import { prisma } from '@/lib/prisma';
import { requireAuth, apiSuccess, apiError, apiNotFound } from '@/lib/api-utils';
import { logError } from '@/lib/logger'
import { createNotification } from '@/lib/notifications'
import { createActivityLog } from '@/lib/services/activity-log-service'

interface RouteParams {
  params: Promise<{ systemId: string; packagingId: string }>;
}

// POST /api/orders/[systemId]/packaging/[packagingId]/confirm-pickup - Confirm customer picked up
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

    if (order.status !== 'READY_FOR_PICKUP') {
      return apiError('Order must be ready for pickup', 400);
    }

    // Transaction: confirm pickup
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

      // ✅ Update ProductInventory - customer picked up
      // -committed (release reservation), -onHand (physical stock out), +totalSold
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
            const newOnHand = Math.max(0, inventory.onHand - item.quantity);
            await tx.productInventory.update({
              where: {
                productId_branchId: { productId, branchId },
              },
              data: {
                committed: { decrement: Math.min(inventory.committed, item.quantity) },
                onHand: { decrement: Math.min(inventory.onHand, item.quantity) },
                updatedAt: new Date(),
              },
            });
            
            // ✅ Create stock history record
            await tx.stockHistory.create({
              data: {
                productId,
                branchId,
                action: 'Xuất kho khách nhận',
                source: 'Đơn hàng',
                quantityChange: -item.quantity,
                newStockLevel: newOnHand,
                documentId: updated.id,
                documentType: 'order',
                employeeId: session.user?.id,
                employeeName: session.user?.name || undefined,
                note: `Xuất kho - khách nhận hàng tại cửa hàng - ${item.productName || productId}`,
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

    // Log activity
    await createActivityLog({
      entityType: 'order',
      entityId: systemId,
      action: `Xác nhận khách nhận hàng - ${updatedOrder.id || systemId}`,
      actionType: 'status',
      createdBy: session.user?.employee?.fullName || session.user?.name || session.user?.id || undefined,
    }).catch(e => logError('[Confirm Pickup] activity log failed', e));

    // Notify salesperson about pickup confirmed
    if (updatedOrder.salespersonId && updatedOrder.salespersonId !== session.user?.employeeId) {
      createNotification({
        type: 'order',
        title: 'Khách đã nhận hàng',
        message: `Đơn hàng ${updatedOrder.id || systemId} - khách đã nhận hàng tại cửa hàng`,
        link: `/orders/${systemId}`,
        recipientId: updatedOrder.salespersonId,
        senderId: session.user?.employeeId,
        senderName: session.user?.name,
        settingsKey: 'order:delivery',
      }).catch(e => logError('[Confirm Pickup] notification failed', e));
    }

    return apiSuccess(updatedOrder);
  } catch (error) {
    logError('Error confirming pickup', error);
    return apiError('Failed to confirm pickup', 500);
  }
}
