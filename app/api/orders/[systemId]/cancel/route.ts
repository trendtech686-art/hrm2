import { prisma } from '@/lib/prisma';
import { OrderStatus } from '@/generated/prisma/client';
import { requireAuth, apiSuccess, apiError, apiNotFound } from '@/lib/api-utils';

interface RouteParams {
  params: Promise<{ systemId: string }>;
}

// POST /api/orders/[systemId]/cancel - Cancel order
export async function POST(request: Request, { params }: RouteParams) {
  const session = await requireAuth();
  if (!session) return apiError('Unauthorized', 401);

  try {
    const { systemId } = await params;
    const body = await request.json();
    const { reason, restockItems } = body;

    // Get the order first
    const order = await prisma.order.findUnique({
      where: { systemId },
      include: {
        lineItems: {
          include: { product: true },
        },
      },
    });

    if (!order) {
      return apiNotFound('Order');
    }

    // Check if order can be cancelled
    const nonCancellableStatuses: OrderStatus[] = [
      'DELIVERED' as OrderStatus,
      'CANCELLED' as OrderStatus,
      'RETURNED' as OrderStatus,
    ];
    if (nonCancellableStatuses.includes(order.status)) {
      return apiError(`Cannot cancel order with status ${order.status}`, 400);
    }

    // Transaction: cancel order and optionally restock items
    const updatedOrder = await prisma.$transaction(async (tx) => {
      // Update order status
      const cancelled = await tx.order.update({
        where: { systemId },
        data: {
          status: 'CANCELLED',
          cancelledDate: new Date(),
          cancellationReason: reason,
        },
        include: {
          customer: true,
          lineItems: {
            include: { product: true },
          },
          payments: true,
        },
      });

      // Restock items if requested
      if (restockItems && order.lineItems.length > 0) {
        for (const _item of order.lineItems) {
          // Note: Stock management is handled by ProductInventory, not Product.stockQuantity
          // For now, just log the intent - implement full stock management separately
        }
      }

      return cancelled;
    });

    return apiSuccess(updatedOrder);
  } catch (error) {
    console.error('Error cancelling order:', error);
    return apiError('Failed to cancel order', 500);
  }
}
