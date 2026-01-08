import { prisma } from '@/lib/prisma';
import { requireAuth, apiSuccess, apiError, apiNotFound } from '@/lib/api-utils';

interface RouteParams {
  params: Promise<{ systemId: string; packagingId: string }>;
}

// POST /api/orders/[systemId]/packaging/[packagingId]/confirm - Confirm packaging complete
export async function POST(_request: Request, { params }: RouteParams) {
  const session = await requireAuth();
  if (!session) return apiError('Unauthorized', 401);

  try {
    const { systemId, packagingId } = await params;

    // Get the packaging
    const packaging = await prisma.packaging.findUnique({
      where: { systemId: packagingId },
    });

    if (!packaging) {
      return apiNotFound('Packaging');
    }

    if (packaging.orderId !== systemId) {
      return apiError('Packaging does not belong to this order', 400);
    }

    if (packaging.confirmDate) {
      return apiError('Packaging already completed', 400);
    }

    // Transaction: complete packaging and update order status
    const updatedOrder = await prisma.$transaction(async (tx) => {
      // Update packaging
      await tx.packaging.update({
        where: { systemId: packagingId },
        data: {
          status: 'COMPLETED',
          confirmDate: new Date(),
        },
      });

      // Update order status
      const updated = await tx.order.update({
        where: { systemId },
        data: { status: 'PACKED' },
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
    console.error('Error confirming packaging:', error);
    return apiError('Failed to confirm packaging', 500);
  }
}
