import { prisma } from '@/lib/prisma';
import { requireAuth, apiSuccess, apiError, apiNotFound } from '@/lib/api-utils';
import { logError } from '@/lib/logger'
import { createNotification } from '@/lib/notifications'
import { createActivityLog } from '@/lib/services/activity-log-service'

interface RouteParams {
  params: Promise<{ systemId: string; packagingId: string }>;
}

// POST /api/orders/[systemId]/packaging/[packagingId]/in-store-pickup
// Step 1: Set delivery method to "Nhận tại cửa hàng" (PICKUP)
// This does NOT dispatch stock - that happens in confirm step
export async function POST(request: Request, { params }: RouteParams) {
  const session = await requireAuth();
  if (!session) return apiError('Unauthorized', 401);

  try {
    const { systemId, packagingId } = await params;
    
    // Get requestor info from body (optional)
    const body = await request.json().catch(() => ({}));
    const { requestorName, requestorPhone } = body;

    // Get the packaging with order
    const packaging = await prisma.packaging.findUnique({
      where: { systemId: packagingId },
      select: {
        systemId: true,
        orderId: true,
        confirmDate: true,
        deliveryMethod: true,
        deliveryStatus: true,
        id: true,
        order: {
          select: {
            id: true,
            customerId: true,
            customerName: true,
            grandTotal: true,
            salespersonId: true,
            customer: {
              select: {
                systemId: true,
                name: true,
                phone: true,
              },
            },
          },
        },
      },
    });

    if (!packaging) {
      return apiNotFound('Packaging');
    }

    if (packaging.orderId !== systemId) {
      return apiError('Packaging does not belong to this order', 400);
    }

    if (!packaging.order) {
      return apiError('Packaging không thuộc đơn hàng nào', 400);
    }

    if (!packaging.confirmDate) {
      return apiError('Đóng gói phải được xác nhận trước', 400);
    }
    
    // ✅ Check if already set for pickup
    if (packaging.deliveryMethod === 'IN_STORE_PICKUP' || packaging.deliveryMethod === 'PICKUP') {
      return apiError('Đóng gói này đã được chọn nhận tại cửa hàng. Vui lòng tải lại trang.', 400);
    }
    
    // ✅ Check if already delivered
    if (packaging.deliveryStatus === 'DELIVERED') {
      return apiError('Đóng gói này đã được giao. Vui lòng tải lại trang.', 400);
    }

    const order = packaging.order;
    
    // ✅ Get requestor info from session (employee who clicked the button)
    const employeeInfo = session.user?.employee as { fullName?: string; name?: string; systemId?: string } | undefined;
    const requestingEmployeeId = employeeInfo?.systemId;
    const requestingEmployeeName = employeeInfo?.fullName || employeeInfo?.name || session.user?.name || 'Hệ thống';

    // Transaction: Only update delivery method and order status
    // Stock dispatch will happen in confirm step
    const updatedOrder = await prisma.$transaction(async (tx) => {
      // 1. Update packaging - set delivery method to IN_STORE_PICKUP
      // ✅ Tracking code is generated in confirm step (after dispatch), not here
      await tx.packaging.update({
        where: { systemId: packagingId },
        data: {
          deliveryMethod: 'IN_STORE_PICKUP',
          deliveryStatus: 'PACKED', // Keep as packed, will be DELIVERED in confirm step
          // ✅ requestingEmployee = người bấm nút "Khách nhận tại cửa hàng"
          requestingEmployeeId: requestingEmployeeId,
          requestingEmployeeName: requestingEmployeeName,
          // requestor = khách hàng đến nhận
          requestorName: requestorName || order.customer?.name || order.customerName,
          requestorPhone: requestorPhone || order.customer?.phone,
        },
      });

      // 2. Update order status to READY_FOR_PICKUP (waiting for customer)
      const updated = await tx.order.update({
        where: { systemId },
        data: { 
          status: 'READY_FOR_PICKUP',
          deliveryStatus: 'PACKED', // Packed and waiting for customer pickup
        },
        select: {
          id: true,
          systemId: true,
          status: true,
          deliveryStatus: true,
          salespersonId: true,
          customerId: true,
          grandTotal: true,
          linkedSalesReturnValue: true,
          customer: {
            select: {
              systemId: true,
              name: true,
              phone: true,
            },
          },
          lineItems: {
            select: {
              systemId: true,
              productId: true,
              productName: true,
              quantity: true,
            },
          },
          payments: {
            select: {
              id: true,
              systemId: true,
              amount: true,
              linkedReceiptSystemId: true,
            },
          },
          packagings: {
            select: {
              systemId: true,
              id: true,
              deliveryMethod: true,
              deliveryStatus: true,
              assignedEmployee: {
                select: {
                  systemId: true,
                  fullName: true,
                },
              },
              shipment: {
                select: {
                  systemId: true,
                  status: true,
                  trackingCode: true,
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
      action: `Chuyển sang nhận tại cửa hàng - ${updatedOrder.id || systemId}`,
      actionType: 'status',
      createdBy: session.user?.employee?.fullName || session.user?.name || session.user?.id || undefined,
    }).catch(e => logError('[In-Store Pickup] activity log failed', e));

    // Notify salesperson about in-store pickup
    if (updatedOrder.salespersonId && updatedOrder.salespersonId !== session.user?.employeeId) {
      createNotification({
        type: 'order',
        settingsKey: 'order:delivery',
        title: 'Khách nhận tại cửa hàng',
        message: `Đơn hàng ${updatedOrder.id || systemId} đã chuyển sang nhận tại cửa hàng`,
        link: `/orders/${systemId}`,
        recipientId: updatedOrder.salespersonId,
        senderId: session.user?.employeeId,
        senderName: session.user?.name,
      }).catch(e => logError('[In-Store Pickup] notification failed', e));
    }

    return apiSuccess(updatedOrder);
  } catch (error) {
    logError('Error setting in-store pickup', error);
    const errorMessage = error instanceof Error 
      ? error.message 
      : 'Failed to set in-store pickup';
    return apiError(errorMessage, 500);
  }
}
