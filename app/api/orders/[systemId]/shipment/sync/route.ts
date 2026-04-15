import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth, apiSuccess, apiError, apiNotFound } from '@/lib/api-utils';
import { logError } from '@/lib/logger'

interface RouteParams {
  params: Promise<{ systemId: string }>;
}

// POST /api/orders/[systemId]/shipment/sync - Sync shipment status from provider
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

    // TODO: Call external shipping provider API to get status
    // This is a placeholder - actual implementation depends on shipping provider
    // For now, just return current status

    const updatedOrder = await prisma.order.findUnique({
      where: { systemId },
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

    return apiSuccess(updatedOrder);
  } catch (error) {
    logError('Error syncing shipment', error);
    return apiError('Failed to sync shipment', 500);
  }
}
