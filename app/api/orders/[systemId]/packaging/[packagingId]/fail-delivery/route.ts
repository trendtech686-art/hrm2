import { prisma } from '@/lib/prisma';
import { requireAuth, apiSuccess, apiError, apiNotFound } from '@/lib/api-utils';
import { DeliveryStatus } from '@/generated/prisma/client';
import { logError } from '@/lib/logger'
import { createNotification } from '@/lib/notifications'
import { createActivityLog } from '@/lib/services/activity-log-service'

interface RouteParams {
  params: Promise<{ systemId: string; packagingId: string }>;
}

// POST /api/orders/[systemId]/packaging/[packagingId]/fail-delivery - Mark delivery as failed
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
      select: {
        orderId: true,
      },
    });

    if (!packaging) {
      return apiNotFound('Packaging');
    }

    if (packaging.orderId !== systemId) {
      return apiError('Packaging does not belong to this order', 400);
    }

    // Transaction: mark delivery as failed
    const updatedOrder = await prisma.$transaction(async (tx) => {
      // Update packaging
      await tx.packaging.update({
        where: { systemId: packagingId },
        data: {
          deliveryStatus: DeliveryStatus.RESCHEDULED,
          notes: reason,
        },
      });

      // Update order status
      const updated = await tx.order.update({
        where: { systemId },
        data: { 
          status: 'FAILED_DELIVERY',
          deliveryStatus: DeliveryStatus.RESCHEDULED,
        },
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
              product: {
                select: {
                  systemId: true,
                  id: true,
                  name: true,
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
            },
          },
          packagings: {
            select: {
              systemId: true,
              id: true,
              status: true,
              deliveryStatus: true,
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
                  trackingCode: true,
                  status: true,
                  deliveryStatus: true,
                  carrier: true,
                },
              },
            },
          },
        },
      });

      return updated;
    });

    // Log activity
    await createActivityLog({
      entityType: 'order',
      entityId: systemId,
      action: `Giao hàng thất bại - ${updatedOrder.id || systemId}${reason ? ` - Lý do: ${reason}` : ''}`,
      actionType: 'status',
      createdBy: session.user?.employee?.fullName || session.user?.name || session.user?.id || undefined,
    }).catch(e => logError('[Fail Delivery] activity log failed', e));

    // Notify salesperson about failed delivery
    if (updatedOrder.salespersonId && updatedOrder.salespersonId !== session.user?.employeeId) {
      createNotification({
        type: 'order',
        settingsKey: 'order:delivery',
        title: 'Giao hàng thất bại',
        message: `Đơn hàng ${updatedOrder.id || systemId} giao thất bại${reason ? `: ${reason}` : ''}`,
        link: `/orders/${systemId}`,
        recipientId: updatedOrder.salespersonId,
        senderId: session.user?.employeeId,
        senderName: session.user?.name,
      }).catch(e => logError('[Fail Delivery] notification failed', e));
    }

    return apiSuccess(updatedOrder);
  } catch (error) {
    logError('Error marking delivery as failed', error);
    return apiError('Failed to update delivery status', 500);
  }
}
