import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth, apiSuccess, apiError, apiNotFound } from '@/lib/api-utils';

interface RouteParams {
  params: Promise<{ systemId: string }>;
}

// POST /api/orders/[systemId]/shipment/cancel - Cancel shipment
export async function POST(request: NextRequest, { params }: RouteParams) {
  const session = await requireAuth();
  if (!session) return apiError('Unauthorized', 401);

  try {
    const { systemId } = await params;

    // Get order with shipment
    const order = await prisma.order.findUnique({
      where: { systemId },
      include: {
        packagings: {
          include: { shipment: true },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!order) {
      return apiNotFound('Order');
    }

    const activePackaging = order.packagings.find((p) => !p.cancelDate);
    const shipment = activePackaging?.shipment;

    if (!shipment) {
      return apiNotFound('Shipment');
    }

    // Transaction: cancel shipment
    const updatedOrder = await prisma.$transaction(async (tx) => {
      // Update shipment
      await tx.shipment.update({
        where: { systemId: shipment.systemId },
        data: {
          status: 'CANCELLED',
          cancelledAt: new Date(),
        },
      });

      // Update order status back to PACKED
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
    console.error('Error cancelling shipment:', error);
    return apiError('Failed to cancel shipment', 500);
  }
}
