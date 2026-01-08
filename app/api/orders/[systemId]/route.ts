import { prisma } from '@/lib/prisma';
import { requireAuth, apiSuccess, apiError, apiNotFound } from '@/lib/api-utils';

interface RouteParams {
  params: Promise<{ systemId: string }>;
}

// GET /api/orders/[systemId] - Get single order
export async function GET(request: Request, { params }: RouteParams) {
  const session = await requireAuth();
  if (!session) return apiError('Unauthorized', 401);

  try {
    const { systemId } = await params;

    const order = await prisma.order.findUnique({
      where: { systemId },
      include: {
        customer: true,
        branch: true,
        lineItems: {
          include: {
            product: {
              select: {
                systemId: true,
                id: true,
                name: true,
                imageUrl: true,
                sellingPrice: true,
              },
            },
          },
        },
        payments: true,
        packagings: {
          include: {
            assignedEmployee: true,
            shipment: true,
          },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!order) {
      return apiNotFound('Order');
    }

    return apiSuccess(order);
  } catch (error) {
    console.error('Error fetching order:', error);
    return apiError('Failed to fetch order', 500);
  }
}

// PATCH /api/orders/[systemId] - Update order
export async function PATCH(request: Request, { params }: RouteParams) {
  const session = await requireAuth();
  if (!session) return apiError('Unauthorized', 401);

  try {
    const { systemId } = await params;
    const body = await request.json();

    const order = await prisma.order.update({
      where: { systemId },
      data: body,
      include: {
        customer: true,
        lineItems: {
          include: { product: true },
        },
        payments: true,
      },
    });

    return apiSuccess(order);
  } catch (error) {
    console.error('Error updating order:', error);
    return apiError('Failed to update order', 500);
  }
}

// DELETE /api/orders/[systemId] - Delete order (soft delete via status)
export async function DELETE(request: Request, { params }: RouteParams) {
  const session = await requireAuth();
  if (!session) return apiError('Unauthorized', 401);

  try {
    const { systemId } = await params;

    await prisma.order.update({
      where: { systemId },
      data: { 
        status: 'CANCELLED',
        cancelledDate: new Date(),
        cancellationReason: 'Deleted by user',
      },
    });

    return apiSuccess({ success: true });
  } catch (error) {
    console.error('Error deleting order:', error);
    return apiError('Failed to delete order', 500);
  }
}
