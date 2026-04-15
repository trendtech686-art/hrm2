import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { OrderStatus } from '@/generated/prisma/client';
import { requireAuth, apiSuccess, apiError, apiNotFound } from '@/lib/api-utils';
import { updateCustomerDebt } from '@/lib/services/customer-debt-service';
import { createNotification } from '@/lib/notifications'
import { logError } from '@/lib/logger'
import { getUserNameFromDb } from '@/lib/get-user-name'

interface RouteParams {
  params: Promise<{ systemId: string }>;
}

// Valid status transitions
const validTransitions: Record<OrderStatus, OrderStatus[]> = {
  PENDING: ['CONFIRMED', 'CANCELLED'],
  CONFIRMED: ['PROCESSING', 'CANCELLED'],
  PROCESSING: ['PACKING', 'CANCELLED'],
  PACKING: ['PACKED', 'CANCELLED'],
  PACKED: ['SHIPPING', 'READY_FOR_PICKUP', 'CANCELLED'],
  READY_FOR_PICKUP: ['DELIVERED', 'COMPLETED', 'CANCELLED'],
  SHIPPING: ['DELIVERED', 'FAILED_DELIVERY', 'CANCELLED'],
  DELIVERED: ['COMPLETED', 'RETURNED'],
  COMPLETED: ['RETURNED'],
  FAILED_DELIVERY: ['SHIPPING', 'CANCELLED', 'RETURNED'],
  CANCELLED: [],
  RETURNED: [],
};

// PATCH /api/orders/[systemId]/status - Update order status
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  const session = await requireAuth();
  if (!session) return apiError('Unauthorized', 401);

  try {
    const { systemId } = await params;
    const body = await request.json();
    const { status } = body;

    if (!status) {
      return apiError('Trạng thái là bắt buộc', 400);
    }

    // Get the order
    const order = await prisma.order.findUnique({
      where: { systemId },
    });

    if (!order) {
      return apiNotFound('Đơn hàng');
    }

    // Validate status transition
    const allowedStatuses = validTransitions[order.status] || [];
    if (!allowedStatuses.includes(status as OrderStatus)) {
      return apiError(`Không thể chuyển trạng thái từ ${order.status} sang ${status}`, 400);
    }

    // Update timestamps based on status
    const statusTimestamps: Partial<Record<OrderStatus, object>> = {
      CONFIRMED: { approvedDate: new Date() },
      DELIVERED: { completedDate: new Date() },
      COMPLETED: { completedDate: new Date() },
      CANCELLED: { cancelledDate: new Date() },
    };

    const updatedOrder = await prisma.order.update({
      where: { systemId },
      data: {
        status: status as OrderStatus,
        ...statusTimestamps[status as OrderStatus],
      },
      include: {
        customer: true,
        lineItems: {
          include: { product: true },
        },
        payments: true,
      },
    });

    // ✅ Update customer debt when order is DELIVERED or COMPLETED
    const debtAffectingStatuses: OrderStatus[] = ['DELIVERED', 'COMPLETED'];
    if (debtAffectingStatuses.includes(status as OrderStatus) && updatedOrder.customer?.systemId) {
      await updateCustomerDebt(updatedOrder.customer.systemId).catch(err => {
        logError('[Order Status] Failed to update customer debt', err);
      });
    }

    // Notify salesperson about order status change (non-blocking)
    const statusLabels: Record<string, string> = {
      PENDING: 'Chờ xác nhận', CONFIRMED: 'Đã xác nhận', PROCESSING: 'Đang xử lý',
      PACKING: 'Đang đóng gói', PACKED: 'Đã đóng gói', SHIPPING: 'Đang giao hàng',
      DELIVERED: 'Đã giao hàng', COMPLETED: 'Hoàn thành', CANCELLED: 'Đã hủy',
      FAILED_DELIVERY: 'Giao thất bại', RETURNED: 'Đã trả hàng',
      READY_FOR_PICKUP: 'Sẵn sàng lấy hàng',
    };
    const statusLabel = statusLabels[status as string] || status;
    const orderLink = `/orders/${updatedOrder.systemId}`;
    if (updatedOrder.salespersonId && updatedOrder.salespersonId !== session.user?.employeeId) {
      createNotification({
        type: 'order',
        title: 'Cập nhật đơn hàng',
        message: `Đơn hàng ${updatedOrder.id} → ${statusLabel}`,
        link: orderLink,
        recipientId: updatedOrder.salespersonId,
        senderId: session.user?.employeeId || undefined,
        senderName: session.user?.name || undefined,
        settingsKey: 'order:status',
      }).catch(e => logError('[Orders] Status notification failed', e));
    }

    // ✅ Log activity
    const userName = await getUserNameFromDb(session.user?.id);
    await prisma.activityLog.create({
      data: {
        entityType: 'order',
        entityId: systemId,
        action: 'status_changed',
        actionType: 'status',
        changes: { status: { from: order.status, to: status } },
        note: `Đổi trạng thái đơn hàng ${updatedOrder.id}: ${order.status} → ${statusLabel}`,
        metadata: { userName, orderId: updatedOrder.id },
        createdBy: userName,
      }
    }).catch(e => logError('[Orders Status] activity log failed', e))

    return apiSuccess(updatedOrder);
  } catch (error) {
    logError('Error updating order status', error);
    return apiError('Không thể cập nhật trạng thái đơn hàng', 500);
  }
}
