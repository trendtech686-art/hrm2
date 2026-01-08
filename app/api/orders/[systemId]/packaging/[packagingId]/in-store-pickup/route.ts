import { prisma } from '@/lib/prisma';
import { requireAuth, apiSuccess, apiError, apiNotFound } from '@/lib/api-utils';

interface RouteParams {
  params: Promise<{ systemId: string; packagingId: string }>;
}

// POST /api/orders/[systemId]/packaging/[packagingId]/in-store-pickup - Process in-store pickup
export async function POST(_request: Request, { params }: RouteParams) {
  const session = await requireAuth();
  if (!session) return apiError('Unauthorized', 401);

  try {
    const { systemId, packagingId } = await params;

    // Get the packaging
    const packaging = await prisma.packaging.findUnique({
      where: { systemId: packagingId },
      include: { order: true },
    });

    if (!packaging) {
      return apiNotFound('Packaging');
    }

    if (packaging.orderId !== systemId) {
      return apiError('Packaging does not belong to this order', 400);
    }

    if (!packaging.confirmDate) {
      return apiError('Packaging must be completed first', 400);
    }

    // Transaction: set as ready for pickup
    const updatedOrder = await prisma.$transaction(async (tx) => {
      // Update packaging
      await tx.packaging.update({
        where: { systemId: packagingId },
        data: {
          deliveryMethod: 'PICKUP',
        },
      });

      // Update order status
      const updated = await tx.order.update({
        where: { systemId },
        data: { status: 'READY_FOR_PICKUP' },
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
    console.error('Error processing in-store pickup:', error);
    return apiError('Failed to process in-store pickup', 500);
  }
}
