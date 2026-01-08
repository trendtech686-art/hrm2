import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth, apiSuccess, apiError, apiNotFound } from '@/lib/api-utils';

interface RouteParams {
  params: Promise<{ systemId: string }>;
}

// GET /api/orders/[systemId]/shipment - Get shipment for order
export async function GET(request: NextRequest, { params }: RouteParams) {
  const session = await requireAuth();
  if (!session) return apiError('Unauthorized', 401);

  try {
    const { systemId } = await params;

    const shipments = await prisma.shipment.findMany({
      where: {
        orderId: systemId,
      },
      include: {
        packaging: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return apiSuccess(shipments);
  } catch (error) {
    console.error('Error fetching shipments:', error);
    return apiError('Failed to fetch shipments', 500);
  }
}

// POST /api/orders/[systemId]/shipment - Create shipment
export async function POST(request: NextRequest, { params }: RouteParams) {
  const session = await requireAuth();
  if (!session) return apiError('Unauthorized', 401);

  try {
    const { systemId } = await params;
    const body = await request.json();
    const { provider, serviceType, packagingId } = body;

    // Get the order with packaging
    const order = await prisma.order.findUnique({
      where: { systemId },
      include: {
        packagings: {
          where: { confirmDate: { not: null }, cancelDate: null },
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
      },
    });

    if (!order) {
      return apiNotFound('Order');
    }

    const packaging = packagingId
      ? order.packagings.find((p) => p.systemId === packagingId)
      : order.packagings[0];

    if (!packaging) {
      return apiError('No completed packaging found', 400);
    }

    // Transaction: create shipment
    const updatedOrder = await prisma.$transaction(async (tx) => {
      // Generate shipment systemId
      const shipmentId = `SH${Date.now()}`;
      
      // Create shipment
      await tx.shipment.create({
        data: {
          systemId: shipmentId,
          id: shipmentId,
          orderId: systemId,
          packagingSystemId: packaging.systemId,
          carrier: provider,
          service: serviceType,
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
    console.error('Error creating shipment:', error);
    return apiError('Failed to create shipment', 500);
  }
}
