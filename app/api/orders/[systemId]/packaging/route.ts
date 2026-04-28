import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { requireAuth, apiSuccess, apiError, apiNotFound, validateBody } from '@/lib/api-utils'
import { logError } from '@/lib/logger'
import { createNotification } from '@/lib/notifications'
import { getUserNameFromDb } from '@/lib/get-user-name'

const createPackagingBodySchema = z.object({
  assignedEmployeeId: z.string().optional(),
})

interface RouteParams {
  params: Promise<{ systemId: string }>;
}

// GET /api/orders/[systemId]/packaging - Get packagings for order
export async function GET(request: Request, { params }: RouteParams) {
  const session = await requireAuth()
  if (!session) return apiError('Unauthorized', 401)

  const { systemId } = await params

  try {

    const packagings = await prisma.packaging.findMany({
      where: { orderId: systemId },
      select: {
        systemId: true,
        id: true,
        orderId: true,
        branchId: true,
        status: true,
        requestDate: true,
        confirmDate: true,
        cancelDate: true,
        deliveredDate: true,
        confirmingEmployeeId: true,
        confirmingEmployeeName: true,
        requestingEmployeeId: true,
        requestingEmployeeName: true,
        cancelingEmployeeId: true,
        cancelingEmployeeName: true,
        cancelReason: true,
        assignedEmployeeId: true,
        assignedEmployeeName: true,
        printStatus: true,
        notes: true,
        deliveryMethod: true,
        deliveryStatus: true,
        carrier: true,
        service: true,
        trackingCode: true,
        partnerStatus: true,
        ghtkStatusId: true,
        shippingFeeToPartner: true,
        codAmount: true,
        weight: true,
        dimensions: true,
        requestorName: true,
        requestorPhone: true,
        requestorId: true,
        ghtkTrackingId: true,
        estimatedPickTime: true,
        estimatedDeliverTime: true,
        lastSyncedAt: true,
        assignedEmployee: {
          select: { systemId: true, fullName: true },
        },
        shipment: {
          select: {
            systemId: true,
            id: true,
            trackingCode: true,
            status: true,
            carrier: true,
            shippingFee: true,
            createdAt: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return apiSuccess(packagings);
  } catch (error) {
    logError('Error fetching packagings', error);
    return apiError('Failed to fetch packagings', 500);
  }
}

// POST /api/orders/[systemId]/packaging - Request packaging
export async function POST(request: Request, { params }: RouteParams) {
  const session = await requireAuth();
  if (!session) return apiError('Unauthorized', 401);

  const { systemId } = await params

  const bodyValidation = await validateBody(request, createPackagingBodySchema)
  if (!bodyValidation.success) return apiError(bodyValidation.error, 400)
  const { assignedEmployeeId } = bodyValidation.data

  try {

    // Get the order with packagings and their shipments
    const order = await prisma.order.findUnique({
      where: { systemId },
      select: {
        systemId: true,
        id: true,
        branchId: true,
        packagings: {
          select: {
            systemId: true,
            cancelDate: true,
            confirmDate: true,
            shipment: {
              select: {
                systemId: true,
                status: true,
              },
            },
          },
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
      
      // Look up employee name if assignedEmployeeId is provided
      let assignedEmployeeName: string | undefined;
      if (assignedEmployeeId) {
        const employee = await tx.employee.findUnique({
          where: { systemId: assignedEmployeeId },
          select: { fullName: true },
        });
        assignedEmployeeName = employee?.fullName || undefined;
      }

      // Get requesting employee info from session
      const employeeInfo = session.user?.employee as { systemId?: string; fullName?: string; name?: string } | undefined;
      const requestingEmployeeId = employeeInfo?.systemId;
      const requestingEmployeeName = employeeInfo?.fullName || employeeInfo?.name || session.user?.name || undefined;

      await tx.packaging.create({
        data: {
          systemId: packagingSystemId,
          id: businessId,
          orderId: systemId,
          branchId: order.branchId,
          assignedEmployeeId,
          assignedEmployeeName,
          requestingEmployeeId,
          requestingEmployeeName,
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
        select: {
          systemId: true,
          id: true,
          status: true,
          deliveryStatus: true,
          stockOutStatus: true,
          branchId: true,
          customerId: true,
          customerName: true,
          salespersonId: true,
          salespersonName: true,
          grandTotal: true,
          paidAmount: true,
          paymentStatus: true,
          deliveryMethod: true,
          shippingCarrier: true,
          trackingCode: true,
          notes: true,
          shippingFee: true,
          createdAt: true,
          customer: {
            select: {
              systemId: true,
              id: true,
              name: true,
              phone: true,
              address: true,
            },
          },
          lineItems: {
            select: {
              systemId: true,
              productId: true,
              productName: true,
              productSku: true,
              quantity: true,
              unitPrice: true,
              discount: true,
              total: true,
              product: {
                select: {
                  systemId: true,
                  barcode: true,
                  name: true,
                  thumbnailImage: true,
                },
              },
            },
          },
          payments: {
            select: {
              systemId: true,
              amount: true,
              method: true,
            },
          },
          packagings: {
            select: {
              systemId: true,
              id: true,
              status: true,
              confirmDate: true,
              cancelDate: true,
              deliveryStatus: true,
              trackingCode: true,
              carrier: true,
              assignedEmployeeId: true,
              assignedEmployeeName: true,
              assignedEmployee: {
                select: {
                  systemId: true,
                  fullName: true,
                },
              },
              shipment: {
                select: {
                  systemId: true,
                  trackingCode: true,
                  status: true,
                  carrier: true,
                },
              },
            },
          },
        },
      });

      return updated;
    });

    // Notify assigned employee about new packaging request
    if (assignedEmployeeId && assignedEmployeeId !== session.user?.employeeId) {
      createNotification({
        type: 'order',
        settingsKey: 'order:packaging',
        title: 'Yêu cầu đóng gói mới',
        message: `Bạn được giao đóng gói đơn hàng ${updatedOrder.id || systemId}`,
        link: `/orders/${systemId}`,
        recipientId: assignedEmployeeId,
        senderId: session.user?.employeeId,
        senderName: session.user?.name,
      }).catch(e => logError('[Packaging] notification failed', e));
    }

    // Log activity
    const userName = await getUserNameFromDb(session.user?.id);
    await prisma.activityLog.create({
      data: {
        entityType: 'packaging',
        entityId: updatedOrder.systemId || systemId,
        action: 'created',
        actionType: 'create',
        note: `Tạo phiếu đóng gói`,
        metadata: { userName },
        createdBy: userName,
      }
    }).catch(e => logError('[ActivityLog] packaging created failed', e))

    return apiSuccess(updatedOrder);
  } catch (error) {
    logError('[Packaging API] Error creating packaging', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return apiError(`Failed to create packaging: ${errorMessage}`, 500);
  }
}
