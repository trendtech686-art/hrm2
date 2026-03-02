import { prisma } from '@/lib/prisma'
import { requireAuth, apiSuccess, apiError, apiNotFound } from '@/lib/api-utils'

interface RouteParams {
  params: Promise<{ systemId: string }>;
}

// GET /api/orders/[systemId]/packaging - Get packagings for order
export async function GET(request: Request, { params }: RouteParams) {
  const session = await requireAuth()
  if (!session) return apiError('Unauthorized', 401)

  try {
    const { systemId } = await params;

    const packagings = await prisma.packaging.findMany({
      where: { orderId: systemId },
      include: {
        assignedEmployee: {
          select: { systemId: true, fullName: true },
        },
        shipment: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return apiSuccess(packagings);
  } catch (error) {
    console.error('Error fetching packagings:', error);
    return apiError('Failed to fetch packagings', 500);
  }
}

// POST /api/orders/[systemId]/packaging - Request packaging
export async function POST(request: Request, { params }: RouteParams) {
  const session = await requireAuth();
  if (!session) return apiError('Unauthorized', 401);

  try {
    const { systemId } = await params;
    const body = await request.json();
    const { assignedEmployeeId } = body;

    // Get the order with packagings and their shipments
    const order = await prisma.order.findUnique({
      where: { systemId },
      include: { 
        packagings: {
          include: { shipment: true },
        },
      },
    });

    if (!order) {
      return apiNotFound('Order');
    }


    // Check if there's already an active packaging (pending or in-progress, not cancelled)
    // A packaging is "active" if:
    // 1. Not cancelled (no cancelDate)
    // 2. AND either: not confirmed yet, OR confirmed but shipment not completed/cancelled
    const activePackaging = order.packagings.find((p) => {
      if (p.cancelDate) return false; // Cancelled packaging is not active
      if (!p.confirmDate) return true; // Pending packaging (not yet confirmed) is active
      
      // Confirmed packaging - check if shipment is still in progress
      // If shipment exists and not completed/cancelled, packaging is still "active"
      const packagingWithShipment = p as typeof p & { shipment?: { systemId: string; status: string } | null };
      const shipment = packagingWithShipment.shipment;
      if (shipment && shipment.status !== 'DELIVERED' && shipment.status !== 'CANCELLED') {
        return true; // Shipment in progress
      }
      
      return false; // Packaging completed or shipment done
    });
    
    if (activePackaging) {
      return apiError('Đơn hàng đã có phiếu đóng gói đang xử lý. Vui lòng hủy phiếu đóng gói hiện tại trước.', 400);
    }

    // Transaction: create packaging and update order status
    const updatedOrder = await prisma.$transaction(async (tx) => {
      // Get last packaging systemId to generate next one sequentially
      const lastPackaging = await tx.packaging.findFirst({
        orderBy: { systemId: 'desc' },
        select: { systemId: true },
        where: { systemId: { startsWith: 'PACKAGE' } },
      });
      const lastNum = lastPackaging?.systemId 
        ? parseInt(lastPackaging.systemId.replace('PACKAGE', '')) || 0
        : 0;
      const packagingSystemId = `PACKAGE${String(lastNum + 1).padStart(6, '0')}`;
      
      // Generate business ID (DG + order number + suffix)
      // Count ALL packagings (including cancelled) to get unique suffix
      const orderNumStr = order.id?.replace(/^[A-Z-]+/, '') || String(lastNum + 1).padStart(6, '0');
      const totalCount = order.packagings.length;
      const businessId = totalCount > 0 
        ? `DG${orderNumStr}-${String(totalCount + 1).padStart(2, '0')}`
        : `DG${orderNumStr}`;
      
      await tx.packaging.create({
        data: {
          systemId: packagingSystemId,
          id: businessId,
          orderId: systemId,
          branchId: order.branchId,
          assignedEmployeeId,
          status: 'PENDING',
        },
      });

      // Update order status - reset delivery/stockOut status for new packaging request
      const updated = await tx.order.update({
        where: { systemId },
        data: { 
          status: 'PACKING',
          deliveryStatus: 'PENDING_PACK', // ✅ Reset to pending pack for new packaging
          stockOutStatus: 'NOT_STOCKED_OUT', // ✅ Reset stock out status
        },
        include: {
          customer: true,
          lineItems: {
            include: { product: true },
          },
          payments: true,
          packagings: {
            include: {
              assignedEmployee: true,
              shipment: true,
            },
          },
        },
      });

      return updated;
    });

    return apiSuccess(updatedOrder);
  } catch (error) {
    console.error('[Packaging API] Error creating packaging:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return apiError(`Failed to create packaging: ${errorMessage}`, 500);
  }
}
