import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth, apiSuccess, apiError, apiNotFound } from '@/lib/api-utils';
import { logError } from '@/lib/logger'
import { createNotification } from '@/lib/notifications'
import { createActivityLog } from '@/lib/services/activity-log-service'

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
      select: {
        systemId: true,
        id: true,
        packagings: {
          select: {
            systemId: true,
            cancelDate: true,
            shipment: {
              select: {
                systemId: true,
                status: true,
              },
            },
          },
          where: { cancelDate: null },
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
        select: {
          systemId: true,
          id: true,
          status: true,
          paymentStatus: true,
          deliveryStatus: true,
          salespersonId: true,
          customer: {
            select: {
              systemId: true,
              id: true,
              name: true,
              phone: true,
            },
          },
          lineItems: {
            select: {
              systemId: true,
              productId: true,
              productSku: true,
              productName: true,
              quantity: true,
              unitPrice: true,
              discount: true,
              tax: true,
              total: true,
              note: true,
              product: {
                select: {
                  systemId: true,
                  id: true,
                  name: true,
                  thumbnailImage: true,
                },
              },
            },
          },
          payments: {
            select: {
              systemId: true,
              id: true,
              date: true,
              method: true,
              amount: true,
              description: true,
              createdBy: true,
            },
          },
          packagings: {
            select: {
              systemId: true,
              id: true,
              orderId: true,
              status: true,
              packDate: true,
              totalItems: true,
              packedItems: true,
              cancelDate: true,
              assignedEmployee: {
                select: {
                  systemId: true,
                  id: true,
                  fullName: true,
                },
              },
              shipment: {
                select: {
                  systemId: true,
                  id: true,
                  status: true,
                  carrier: true,
                },
              },
            },
            where: { cancelDate: null },
            orderBy: { createdAt: 'desc' },
          },
        },
      });

      return updated;
    });

    // Log activity
    await createActivityLog({
      entityType: 'order',
      entityId: systemId,
      action: `Hủy vận đơn - ${updatedOrder.id || systemId}`,
      actionType: 'status',
      createdBy: session.user?.employee?.fullName || session.user?.name || session.user?.id || undefined,
    }).catch(e => logError('[Cancel Shipment] activity log failed', e));

    // Notify salesperson about shipment cancellation
    if (updatedOrder.salespersonId && updatedOrder.salespersonId !== session.user?.employeeId) {
      createNotification({
        type: 'order',
        settingsKey: 'order:shipment',
        title: 'Hủy vận đơn',
        message: `Vận đơn đơn hàng ${updatedOrder.id || systemId} đã bị hủy`,
        link: `/orders/${systemId}`,
        recipientId: updatedOrder.salespersonId,
        senderId: session.user?.employeeId,
        senderName: session.user?.name,
      }).catch(e => logError('[Cancel Shipment] notification failed', e));
    }

    return apiSuccess(updatedOrder);
  } catch (error) {
    logError('Error cancelling shipment', error);
    return apiError('Failed to cancel shipment', 500);
  }
}
