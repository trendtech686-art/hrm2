import { prisma } from '@/lib/prisma';
import { requireAuth, apiSuccess, apiError, apiNotFound } from '@/lib/api-utils';
import { logError } from '@/lib/logger'
import { createNotification } from '@/lib/notifications'
import { createActivityLog } from '@/lib/services/activity-log-service'

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
    const { reason, cancelingEmployeeId, cancelingEmployeeName } = body;

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

    // ✅ Only prevent cancel if already cancelled
    if (packaging.cancelDate) {
      return apiError('Packaging already cancelled', 400);
    }
    
    // ✅ Prevent cancel if delivery is in progress or completed
    const nonCancellableDeliveryStatuses = ['SHIPPING', 'DELIVERED'];
    if (packaging.deliveryStatus && nonCancellableDeliveryStatuses.includes(packaging.deliveryStatus)) {
      return apiError('Cannot cancel packaging that is being delivered or already delivered', 400);
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
          cancelingEmployeeId: cancelingEmployeeId || session.user?.id,
          cancelingEmployeeName: cancelingEmployeeName || session.user?.name || 'Hệ thống',
        },
      });

      // Update order status back to CONFIRMED
      const updated = await tx.order.update({
        where: { systemId },
        data: { status: 'CONFIRMED' },
        select: {
          systemId: true,
          id: true,
          status: true,
          deliveryStatus: true,
          stockOutStatus: true,
          branchId: true,
          customerId: true,
          customerName: true,
          salespersonId: true,
          salespersonName: true,
          grandTotal: true,
          paidAmount: true,
          paymentStatus: true,
          deliveryMethod: true,
          shippingCarrier: true,
          trackingCode: true,
          notes: true,
          shippingFee: true,
          createdAt: true,
          customer: {
            select: {
              systemId: true,
              id: true,
              name: true,
              phone: true,
              address: true,
            },
          },
          lineItems: {
            select: {
              systemId: true,
              productId: true,
              productName: true,
              productSku: true,
              quantity: true,
              unitPrice: true,
              discount: true,
              total: true,
              product: {
                select: {
                  systemId: true,
                  barcode: true,
                  name: true,
                  thumbnailImage: true,
                },
              },
            },
          },
          payments: {
            select: {
              systemId: true,
              amount: true,
              method: true,
            },
          },
          packagings: {
            select: {
              systemId: true,
              id: true,
              status: true,
              confirmDate: true,
              cancelDate: true,
              deliveryStatus: true,
              trackingCode: true,
              carrier: true,
              assignedEmployeeId: true,
              assignedEmployeeName: true,
              assignedEmployee: {
                select: {
                  systemId: true,
                  fullName: true,
                },
              },
              shipment: {
                select: {
                  systemId: true,
                  trackingCode: true,
                  status: true,
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
      action: `Hủy yêu cầu đóng gói - ${updatedOrder.id || systemId}${reason ? ` - Lý do: ${reason}` : ''}`,
      actionType: 'status',
      createdBy: session.user?.employee?.fullName || session.user?.name || session.user?.id || undefined,
    }).catch(e => logError('[Cancel Packaging] activity log failed', e));

    // Notify assigned packer about packaging cancellation
    if (packaging.assignedEmployeeId && packaging.assignedEmployeeId !== session.user?.employeeId) {
      createNotification({
        type: 'order',
        settingsKey: 'order:packaging',
        title: 'Hủy đóng gói',
        message: `Phiếu đóng gói đơn hàng ${updatedOrder.id || systemId} đã bị hủy${reason ? `: ${reason}` : ''}`,
        link: `/orders/${systemId}`,
        recipientId: packaging.assignedEmployeeId,
        senderId: session.user?.employeeId,
        senderName: session.user?.name,
      }).catch(e => logError('[Cancel Packaging] notification failed', e));
    }

    return apiSuccess(updatedOrder);
  } catch (error) {
    logError('Error cancelling packaging', error);
    return apiError('Failed to cancel packaging', 500);
  }
}
