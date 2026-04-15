import { prisma } from '@/lib/prisma';
import { requireAuth, apiSuccess, apiError, apiNotFound } from '@/lib/api-utils';
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
      include: { order: true },
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
          deliveryStatus: 'RESCHEDULED',
          notes: reason,
        },
      });

      // Update order status
      const updated = await tx.order.update({
        where: { systemId },
        data: { 
          status: 'FAILED_DELIVERY',
          deliveryStatus: 'RESCHEDULED', // ✅ Also update order-level deliveryStatus
        },
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
