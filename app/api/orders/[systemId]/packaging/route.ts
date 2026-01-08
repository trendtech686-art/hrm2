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

    // Get the order
    const order = await prisma.order.findUnique({
      where: { systemId },
      include: { packagings: true },
    });

    if (!order) {
      return apiNotFound('Order');
    }

    // Check if there's already an active packaging
    const activePackaging = order.packagings.find(
      (p) => !p.confirmDate && !p.cancelDate
    );
    if (activePackaging) {
      return apiError('Order already has an active packaging request', 400);
    }

    // Transaction: create packaging and update order status
    const updatedOrder = await prisma.$transaction(async (tx) => {
      // Create packaging - generate IDs
      const packagingId = `PK${Date.now()}`;
      await tx.packaging.create({
        data: {
          systemId: packagingId,
          id: packagingId,
          orderId: systemId,
          branchId: order.branchId,
          assignedEmployeeId,
          status: 'PENDING',
        },
      });

      // Update order status
      const updated = await tx.order.update({
        where: { systemId },
        data: { status: 'PACKING' },
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
    console.error('Error creating packaging:', error);
    return apiError('Failed to create packaging', 500);
  }
}
