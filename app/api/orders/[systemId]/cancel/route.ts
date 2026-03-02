import { prisma } from '@/lib/prisma';
import { OrderStatus } from '@/generated/prisma/client';
import { requireAuth, apiSuccess, apiError, apiNotFound } from '@/lib/api-utils';
import { updateCustomerDebt } from '@/lib/services/customer-debt-service';

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

      // ✅ Update ProductInventory - decrease committed
      // This releases the reserved stock when order is cancelled
      const branchId = order.branchId;
      if (branchId && order.lineItems.length > 0) {
        for (const item of order.lineItems) {
          const productId = item.productId;
          if (!productId) continue;
          
          const inventory = await tx.productInventory.findUnique({
            where: {
              productId_branchId: { productId, branchId },
            },
          });
          
          if (inventory) {
            // Decrease committed (release reserved stock)
            // If order was already dispatched (inDelivery > 0), also return to onHand
            const wasDispatched = restockItems; // Use restockItems flag to indicate dispatch status
            const newOnHand = wasDispatched ? inventory.onHand + item.quantity : inventory.onHand;
            
            await tx.productInventory.update({
              where: {
                productId_branchId: { productId, branchId },
              },
              data: {
                committed: { decrement: Math.min(inventory.committed, item.quantity) },
                // If restocking, also add back to onHand (item was dispatched but returned)
                ...(wasDispatched ? {
                  onHand: { increment: item.quantity },
                  inDelivery: { decrement: Math.min(inventory.inDelivery, item.quantity) },
                } : {}),
                updatedAt: new Date(),
              },
            });
            
            // ✅ Create stock history record
            if (wasDispatched) {
              await tx.stockHistory.create({
                data: {
                  productId,
                  branchId,
                  action: 'Nhập kho hủy đơn',
                  source: 'Đơn hàng',
                  quantityChange: item.quantity,
                  newStockLevel: newOnHand,
                  documentId: order.id,
                  documentType: 'order',
                  employeeId: session.user?.id,
                  employeeName: session.user?.name || undefined,
                  note: `Nhập lại kho do hủy đơn hàng - ${item.productName || productId}`,
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
        console.error('[Cancel Order] Failed to update customer debt:', err);
      });
    }

    return apiSuccess(updatedOrder);
  } catch (error) {
    console.error('Error cancelling order:', error);
    return apiError('Failed to cancel order', 500);
  }
}
