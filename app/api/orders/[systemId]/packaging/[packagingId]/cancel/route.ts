import { prisma } from '@/lib/prisma';
import { requireAuth, apiSuccess, apiError, apiNotFound } from '@/lib/api-utils';

interface RouteParams {
  params: Promise<{ systemId: string; packagingId: string }>;
}

// POST /api/orders/[systemId]/packaging/[packagingId]/cancel - Cancel packaging request
export async function POST(request: Request, { params }: RouteParams) {
  const session = await requireAuth();
  if (!session) return apiError('Unauthorized', 401);

  try {
    const { systemId, packagingId } = await params;
    const body = await request.json();
    const { reason } = body;

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
      return apiError('Cannot cancel completed packaging', 400);
    }

    if (packaging.cancelDate) {
      return apiError('Packaging already cancelled', 400);
    }

    // Transaction: cancel packaging and update order status
    const updatedOrder = await prisma.$transaction(async (tx) => {
      // Update packaging
      await tx.packaging.update({
        where: { systemId: packagingId },
        data: {
          status: 'CANCELLED',
          cancelDate: new Date(),
          cancelReason: reason,
        },
      });

      // Update order status back to CONFIRMED
      const updated = await tx.order.update({
        where: { systemId },
        data: { status: 'CONFIRMED' },
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
    console.error('Error cancelling packaging:', error);
    return apiError('Failed to cancel packaging', 500);
  }
}
