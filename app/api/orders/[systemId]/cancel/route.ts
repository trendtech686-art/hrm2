import { prisma } from '@/lib/prisma';
import { OrderStatus } from '@/generated/prisma/client';
import { requireAuth, apiSuccess, apiError, apiNotFound } from '@/lib/api-utils';
import { updateCustomerDebt } from '@/lib/services/customer-debt-service';
import { logError } from '@/lib/logger'
import { createNotification } from '@/lib/notifications'
import { getUserNameFromDb } from '@/lib/get-user-name'
import { resolveStockItems } from '@/lib/inventory/combo-stock-helper'

interface RouteParams {
  params: Promise<{ systemId: string }>;
}

// Helper to get sales management settings
async function getSalesSettings() {
  const setting = await prisma.setting.findFirst({
    where: { key: 'sales-management-settings' },
  });
  // Note: setting.value is already a JSON object (Prisma Json type)
  const value = setting?.value as { allowCancelAfterExport?: boolean } | null;
  return { allowCancelAfterExport: value?.allowCancelAfterExport ?? true };
}

// POST /api/orders/[systemId]/cancel - Cancel order
export async function POST(request: Request, { params }: RouteParams) {
  const session = await requireAuth();
  if (!session) return apiError('Unauthorized', 401);

  try {
    const { systemId } = await params;
    const body = await request.json();
    const { reason, restockItems } = body;

    // Get the order first
    const order = await prisma.order.findUnique({
      where: { systemId },
      include: {
        lineItems: {
          include: { product: true },
        },
        packagings: {
          include: { shipment: true },
        },
      },
    });

    if (!order) {
      return apiNotFound('Order');
    }

    // Check if order can be cancelled
    const nonCancellableStatuses: OrderStatus[] = [
      'DELIVERED' as OrderStatus,
      'CANCELLED' as OrderStatus,
      'RETURNED' as OrderStatus,
    ];
    if (nonCancellableStatuses.includes(order.status)) {
      return apiError(`Cannot cancel order with status ${order.status}`, 400);
    }

    // ✅ Check allowCancelAfterExport setting
    // Order is considered "exported" if it has dispatched date or SHIPPING status
    const isExported = order.dispatchedDate || order.status === 'SHIPPING';
    if (isExported) {
      const settings = await getSalesSettings();
      if (!settings.allowCancelAfterExport) {
        return apiError('Không được phép hủy đơn hàng sau khi xuất kho. Vui lòng liên hệ quản trị viên.', 400);
      }
    }

    // Transaction: cancel order and optionally restock items
    const updatedOrder = await prisma.$transaction(async (tx) => {
      // Update order status
      const cancelled = await tx.order.update({
        where: { systemId },
        data: {
          status: 'CANCELLED',
          cancelledDate: new Date(),
          cancellationReason: reason,
        },
        include: {
          customer: true,
          lineItems: {
            include: { product: true },
          },
          payments: true,
        },
      });

      // ✅ Update ProductInventory based on order's actual dispatch status
      // For combo products, resolve to child components
      const branchId = order.branchId;
      const wasNotDispatched = !order.stockOutStatus || order.stockOutStatus === 'NOT_STOCKED_OUT';

      if (branchId && order.lineItems.length > 0) {
        const stockItems = await resolveStockItems(tx, order.lineItems)
        for (const stockItem of stockItems) {
          const inventory = await tx.productInventory.findUnique({
            where: {
              productId_branchId: { productId: stockItem.productId, branchId },
            },
          });
          
          if (inventory) {
            if (wasNotDispatched) {
              // Order was NOT dispatched - only release committed reservation
              await tx.productInventory.update({
                where: {
                  productId_branchId: { productId: stockItem.productId, branchId },
                },
                data: {
                  committed: { decrement: Math.min(inventory.committed, stockItem.quantity) },
                  updatedAt: new Date(),
                },
              });
            } else if (restockItems) {
              // Order WAS dispatched and user wants to return items to stock
              const newOnHand = inventory.onHand + stockItem.quantity;
              
              await tx.productInventory.update({
                where: {
                  productId_branchId: { productId: stockItem.productId, branchId },
                },
                data: {
                  onHand: { increment: stockItem.quantity },
                  inDelivery: { decrement: Math.min(inventory.inDelivery, stockItem.quantity) },
                  updatedAt: new Date(),
                },
              });
              
              // ✅ Create stock history record for restock
              await tx.stockHistory.create({
                data: {
                  productId: stockItem.productId,
                  branchId,
                  action: 'Nhập kho hủy đơn',
                  source: 'Đơn hàng',
                  quantityChange: stockItem.quantity,
                  newStockLevel: newOnHand,
                  documentId: order.id,
                  documentType: 'order',
                  employeeId: session.user?.id,
                  employeeName: session.user?.name || undefined,
                  note: `Nhập lại kho do hủy đơn hàng - ${stockItem.productName}`,
                },
              });
            } else {
              // Order WAS dispatched but don't restock - just clear inDelivery (write off)
              await tx.productInventory.update({
                where: {
                  productId_branchId: { productId: stockItem.productId, branchId },
                },
                data: {
                  inDelivery: { decrement: Math.min(inventory.inDelivery, stockItem.quantity) },
                  updatedAt: new Date(),
                },
              });
            }
          }
        }
        
      }

      return cancelled;
    });

    // ✅ Update customer debt after cancellation (if order was delivered)
    const customerSysId = updatedOrder.customer?.systemId || updatedOrder.customerId;
    if (customerSysId) {
      await updateCustomerDebt(customerSysId).catch(err => {
        logError('[Cancel Order] Failed to update customer debt', err);
      });
    }

    // Notify salesperson about order cancellation
    if (order.salespersonId) {
      createNotification({
        type: 'order',
        settingsKey: 'order:cancelled',
        title: 'Đơn hàng bị hủy',
        message: `Đơn hàng ${order.id} đã bị hủy${reason ? `: ${reason}` : ''}`,
        link: `/orders/${systemId}`,
        recipientId: order.salespersonId,
        senderId: session.user?.employeeId,
        senderName: session.user?.name,
      }).catch(e => logError('[Cancel Order] notification failed', e));
    }

    // ✅ Log activity
    const userName = await getUserNameFromDb(session.user?.id);
    await prisma.activityLog.create({
      data: {
        entityType: 'order',
        entityId: systemId,
        action: 'cancelled',
        actionType: 'status',
        changes: { status: { from: order.status, to: 'CANCELLED' } },
        note: `Hủy đơn hàng ${order.id}${reason ? `: ${reason}` : ''}`,
        metadata: { userName, orderId: order.id, reason },
        createdBy: userName,
      }
    }).catch(e => logError('[Cancel Order] activity log failed', e))

    return apiSuccess(updatedOrder);
  } catch (error) {
    logError('Error cancelling order', error);
    return apiError('Failed to cancel order', 500);
  }
}
