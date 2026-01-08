import { prisma } from '@/lib/prisma';
import { requireAuth, apiSuccess, apiError, apiNotFound } from '@/lib/api-utils';

interface RouteParams {
  params: Promise<{ systemId: string; packagingId: string }>;
}

// POST /api/orders/[systemId]/packaging/[packagingId]/ghtk - Create GHTK shipment
export async function POST(request: Request, { params }: RouteParams) {
  const session = await requireAuth();
  if (!session) return apiError('Unauthorized', 401);

  try {
    const { systemId, packagingId } = await params;
    const _body = await request.json();

    // Get the packaging
    const packaging = await prisma.packaging.findUnique({
      where: { systemId: packagingId },
      include: {
        order: {
          include: { customer: true },
        },
      },
    });

    if (!packaging) {
      return apiNotFound('Packaging');
    }

    if (packaging.orderId !== systemId) {
      return apiError('Packaging does not belong to this order', 400);
    }

    // TODO: Call GHTK API to create shipment
    // This is a placeholder - actual implementation needs GHTK API integration
    const ghtkResponse = {
      success: true,
      trackingCode: `GHTK${Date.now()}`,
      estimatedDelivery: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days
    };

    // Transaction: create shipment with GHTK data
    const updatedOrder = await prisma.$transaction(async (tx) => {
      // Generate shipment systemId
      const shipmentId = `SH${Date.now()}`;
      
      // Create shipment
      await tx.shipment.create({
        data: {
          systemId: shipmentId,
          id: shipmentId,
          orderId: packaging.orderId,
          packagingSystemId: packaging.systemId,
          carrier: 'GHTK',
          trackingCode: ghtkResponse.trackingCode,
          estimatedDeliverTime: ghtkResponse.estimatedDelivery,
          status: 'PENDING',
        },
      });

      // Update order status
      const updated = await tx.order.update({
        where: { systemId },
        data: { status: 'SHIPPING' },
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
    console.error('Error creating GHTK shipment:', error);
    return apiError('Failed to create GHTK shipment', 500);
  }
}

// DELETE /api/orders/[systemId]/packaging/[packagingId]/ghtk - Cancel GHTK shipment
export async function DELETE(request: Request, { params }: RouteParams) {
  const session = await requireAuth();
  if (!session) return apiError('Unauthorized', 401);

  try {
    const { systemId, packagingId } = await params;
    const { searchParams } = new URL(request.url);
    const trackingCode = searchParams.get('trackingCode');

    if (!trackingCode) {
      return apiError('Tracking code is required', 400);
    }

    // Get the packaging with shipment
    const packaging = await prisma.packaging.findUnique({
      where: { systemId: packagingId },
      include: { shipment: true },
    });

    if (!packaging) {
      return apiNotFound('Packaging');
    }

    if (packaging.orderId !== systemId) {
      return apiError('Packaging does not belong to this order', 400);
    }

    if (!packaging.shipment || packaging.shipment.trackingCode !== trackingCode) {
      return apiNotFound('Shipment');
    }

    // TODO: Call GHTK API to cancel shipment
    // This is a placeholder - actual implementation needs GHTK API integration

    // Transaction: cancel shipment
    const updatedOrder = await prisma.$transaction(async (tx) => {
      // Update shipment
      await tx.shipment.update({
        where: { systemId: packaging.shipment!.systemId },
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
    console.error('Error cancelling GHTK shipment:', error);
    return apiError('Failed to cancel GHTK shipment', 500);
  }
}
