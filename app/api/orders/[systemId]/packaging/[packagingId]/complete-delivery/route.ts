import { prisma } from '@/lib/prisma';
import { requireAuth, apiSuccess, apiError, apiNotFound } from '@/lib/api-utils';
import { updateCustomerDebt } from '@/lib/services/customer-debt-service';
import { logError } from '@/lib/logger'
import { createNotification } from '@/lib/notifications'
import { createActivityLog } from '@/lib/services/activity-log-service'

interface RouteParams {
  params: Promise<{ systemId: string; packagingId: string }>;
}

// POST /api/orders/[systemId]/packaging/[packagingId]/complete-delivery - Complete delivery
export async function POST(_request: Request, { params }: RouteParams) {
  const session = await requireAuth();
  if (!session) return apiError('Unauthorized', 401);

  try {
    const { systemId, packagingId } = await params;

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

    if (!packaging.order) {
      return apiError('Packaging không thuộc đơn hàng nào', 400);
    }
    const order = packaging.order;

    // Transaction: complete delivery
    const updatedOrder = await prisma.$transaction(async (tx) => {
      // Update packaging
      await tx.packaging.update({
        where: { systemId: packagingId },
        data: {
          deliveredDate: new Date(),
          deliveryStatus: 'DELIVERED',
        },
      });

      // Calculate payment status to determine order status
      const orderPayments = await tx.orderPayment.findMany({
        where: { orderId: systemId },
      });
      const totalPaidFromPayments = orderPayments.reduce((sum, p) => sum + Number(p.amount || 0), 0);
      
      // ✅ For exchange orders, also get receipts linked to this order (from sales return)
      const linkedReceipts = await tx.receipt.findMany({
        where: {
          linkedOrderSystemId: systemId,
          status: 'completed',
        },
      });
      // ✅ Exclude receipts already linked to OrderPayment (to avoid double counting)
      const linkedReceiptSystemIds = new Set(
        orderPayments.filter(p => p.linkedReceiptSystemId).map(p => p.linkedReceiptSystemId)
      );
      const totalPaidFromReceipts = linkedReceipts
        .filter(r => !linkedReceiptSystemIds.has(r.systemId))
        .reduce((sum, r) => sum + Number(r.amount || 0), 0);
      
      const totalPaid = totalPaidFromPayments + totalPaidFromReceipts;
      const grandTotal = Number(order.grandTotal || 0);
      // ✅ For exchange orders, subtract linkedSalesReturnValue from grandTotal
      const linkedReturnValue = Number(order.linkedSalesReturnValue || 0);
      const netGrandTotal = Math.max(0, grandTotal - linkedReturnValue);
      const isFullyPaid = totalPaid >= netGrandTotal;
      
      // ✅ Update paymentStatus based on payment
      const newPaymentStatus = isFullyPaid ? 'PAID' : (totalPaid > 0 ? 'PARTIAL' : 'UNPAID');
      
      // Only set COMPLETED if fully paid, otherwise set PROCESSING (delivered but awaiting payment)
      const newStatus = isFullyPaid ? 'COMPLETED' : 'PROCESSING';
      const completedDate = isFullyPaid ? new Date() : undefined;

      // Update order status
      const updated = await tx.order.update({
        where: { systemId },
        data: {
          status: newStatus,
          paymentStatus: newPaymentStatus, // ✅ Also update paymentStatus
          deliveryStatus: 'DELIVERED', // ✅ Use enum value, not Vietnamese
          ...(completedDate && { completedDate }),
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

      // ✅ Update ProductInventory - delivery completed
      // -inDelivery (no longer in transit)
      // Also update totalSold on Product
      const branchId = updated.branchId;
      if (branchId && updated.lineItems.length > 0) {
        for (const item of updated.lineItems) {
          const productId = item.productId;
          if (!productId) continue;
          
          const inventory = await tx.productInventory.findUnique({
            where: {
              productId_branchId: { productId, branchId },
            },
          });
          
          if (inventory) {
            await tx.productInventory.update({
              where: {
                productId_branchId: { productId, branchId },
              },
              data: {
                inDelivery: { decrement: Math.min(inventory.inDelivery, item.quantity) },
                updatedAt: new Date(),
              },
            });

            // ✅ Create StockHistory for delivery completed
            await tx.stockHistory.create({
              data: {
                productId,
                branchId,
                action: 'Giao hàng thành công',
                source: 'Đơn hàng',
                quantityChange: 0, // onHand không thay đổi, chỉ inDelivery
                newStockLevel: inventory.onHand,
                documentId: updated.id,
                documentType: 'order',
                employeeId: session.user?.id,
                employeeName: session.user?.name || undefined,
                note: `Giao hàng thành công - ${item.quantity} ${item.productName || 'sản phẩm'}`,
              },
            });
          }
          
          // Update totalSold on Product
          await tx.product.update({
            where: { systemId: productId },
            data: {
              totalSold: { increment: item.quantity },
            },
          });
        }
        
      }

      return updated;
    });

    // ✅ Update customer debt after delivery completion
    const customerSysId = updatedOrder.customer?.systemId || updatedOrder.customerId;
    if (customerSysId) {
      await updateCustomerDebt(customerSysId).catch(err => {
        logError('[Complete Delivery] Failed to update customer debt', err);
      });
    }

    // Log activity
    await createActivityLog({
      entityType: 'order',
      entityId: systemId,
      action: `Giao hàng thành công - ${updatedOrder.id || systemId}`,
      actionType: 'status',
      createdBy: session.user?.employee?.fullName || session.user?.name || session.user?.id || undefined,
    }).catch(e => logError('[Complete Delivery] activity log failed', e));

    // Notify salesperson about delivery completed
    if (updatedOrder.salespersonId && updatedOrder.salespersonId !== session.user?.employeeId) {
      createNotification({
        type: 'order',
        settingsKey: 'order:delivery',
        title: 'Giao hàng thành công',
        message: `Đơn hàng ${updatedOrder.id || systemId} đã giao thành công`,
        link: `/orders/${systemId}`,
        recipientId: updatedOrder.salespersonId,
        senderId: session.user?.employeeId,
        senderName: session.user?.name,
      }).catch(e => logError('[Complete Delivery] notification failed', e));
    }

    return apiSuccess(updatedOrder);
  } catch (error) {
    logError('Error completing delivery', error);
    return apiError('Failed to complete delivery', 500);
  }
}
