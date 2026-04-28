import { prisma } from '@/lib/prisma';
import { requireAuth, apiSuccess, apiError, apiNotFound } from '@/lib/api-utils';
import { OrderStatus, DeliveryStatus, StockOutStatus } from '@/generated/prisma/client';
import { logError } from '@/lib/logger'
import { createNotification } from '@/lib/notifications'
import { createActivityLog } from '@/lib/services/activity-log-service'

interface RouteParams {
  params: Promise<{ systemId: string; packagingId: string }>;
}

// POST /api/orders/[systemId]/packaging/[packagingId]/cancel-delivery - Cancel delivery and optionally restock
export async function POST(request: Request, { params }: RouteParams) {
  const session = await requireAuth();
  if (!session) return apiError('Unauthorized', 401);

  try {
    const { systemId, packagingId } = await params;
    const body = await request.json();
    const { reason, restockItems } = body;

    // Get the packaging with order
    const packaging = await prisma.packaging.findUnique({
      where: { systemId: packagingId },
      select: {
        orderId: true,
        order: {
          select: {
            systemId: true,
            id: true,
            branchId: true,
            lineItems: {
              select: {
                productId: true,
                productName: true,
                quantity: true,
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
    const order = packaging.order;

    // Transaction: cancel delivery
    const updatedOrder = await prisma.$transaction(async (tx) => {
      // Update packaging
      await tx.packaging.update({
        where: { systemId: packagingId },
        data: {
          cancelDate: new Date(),
          cancelReason: reason,
          status: 'CANCELLED',
          deliveryStatus: DeliveryStatus.CANCELLED,
        },
      });

      // Also update linked shipment status
      await tx.shipment.updateMany({
        where: { packagingSystemId: packagingId },
        data: {
          status: 'CANCELLED',
          deliveryStatus: 'CANCELLED',
          cancelledAt: new Date(),
        },
      });

      // Restock items if requested - update ProductInventory
      if (restockItems && order.lineItems.length > 0) {
        for (const item of order.lineItems) {
          if (!item.productId) continue;
          
          const inventory = await tx.productInventory.findUnique({
            where: {
              productId_branchId: {
                productId: item.productId,
                branchId: order.branchId,
              },
            },
          });
          
          const newOnHand = (inventory?.onHand || 0) + item.quantity;
          
          await tx.productInventory.upsert({
            where: {
              productId_branchId: {
                productId: item.productId,
                branchId: order.branchId,
              },
            },
            update: {
              onHand: { increment: item.quantity },
              // ✅ Also decrement inDelivery since items are being returned to warehouse
              inDelivery: { decrement: Math.min(inventory?.inDelivery || 0, item.quantity) },
              updatedAt: new Date(),
            },
            create: {
              productId: item.productId,
              branchId: order.branchId,
              onHand: item.quantity,
              committed: 0,
              inTransit: 0,
              inDelivery: 0,
            },
          });
          
          // ✅ Create stock history record
          await tx.stockHistory.create({
            data: {
              productId: item.productId,
              branchId: order.branchId,
              action: 'Nhập kho hủy giao hàng',
              source: 'Đơn hàng',
              quantityChange: item.quantity,
              newStockLevel: newOnHand,
              documentId: order.id,
              documentType: 'order',
              employeeId: session.user?.id,
              employeeName: session.user?.name || undefined,
              note: `Nhập lại kho do hủy giao hàng - ${item.productName || item.productId}`,
            },
          });
        }
        
      }

      // Check if there are any other active (non-cancelled) packagings for this order
      const activePackagings = await tx.packaging.findMany({
        where: {
          orderId: systemId,
          status: { not: 'CANCELLED' },
        },
      });

      // Determine new order status based on remaining active packagings
      // If no active packagings left, set order to CANCELLED
      // Otherwise, recalculate status based on remaining packagings
      let newOrderStatus: OrderStatus = OrderStatus.PROCESSING;
      let newDeliveryStatus: DeliveryStatus | null = null;
      let newStockOutStatus: StockOutStatus | null = null;
      let resetDispatchedDate = false;
      
      if (activePackagings.length === 0) {
        // All packagings are cancelled -> order is cancelled
        newOrderStatus = OrderStatus.RETURNED; // Use RETURNED as closest to cancelled state
        newDeliveryStatus = DeliveryStatus.CANCELLED;
        newStockOutStatus = StockOutStatus.NOT_STOCKED_OUT;
        resetDispatchedDate = true;
      } else {
        // There are still active packagings, revert order to previous state
        // Check if any remaining packaging has been dispatched
        const hasDeliveredPackaging = activePackagings.some(p => 
          p.deliveryStatus === DeliveryStatus.DELIVERED
        );
        const hasShippingPackaging = activePackagings.some(p => 
          p.deliveryStatus === DeliveryStatus.SHIPPING ||
          p.deliveryStatus === DeliveryStatus.PENDING_SHIP
        );
        const hasPackedPackaging = activePackagings.some(p => 
          p.status === 'COMPLETED'
        );
        
        if (hasDeliveredPackaging) {
          newOrderStatus = OrderStatus.DELIVERED;
          newDeliveryStatus = DeliveryStatus.DELIVERED;
        } else if (hasShippingPackaging) {
          newOrderStatus = OrderStatus.SHIPPING;
          newDeliveryStatus = DeliveryStatus.SHIPPING;
        } else if (hasPackedPackaging) {
          // Packed but not shipped yet - reset to waiting state
          newOrderStatus = OrderStatus.PROCESSING;
          newDeliveryStatus = DeliveryStatus.PACKED;
          newStockOutStatus = StockOutStatus.NOT_STOCKED_OUT; // ✅ Reset stock out status
          resetDispatchedDate = true;
        } else {
          // No active packaging in progress
          newOrderStatus = OrderStatus.PROCESSING;
          newDeliveryStatus = DeliveryStatus.PENDING_PACK;
          newStockOutStatus = StockOutStatus.NOT_STOCKED_OUT; // ✅ Reset stock out status
          resetDispatchedDate = true;
        }
      }

      // Update order status, deliveryStatus, stockOutStatus and optionally reset dispatchedDate
      const updated = await tx.order.update({
        where: { systemId },
        data: { 
          status: newOrderStatus,
          ...(newDeliveryStatus && { deliveryStatus: newDeliveryStatus }),
          ...(newStockOutStatus && { stockOutStatus: newStockOutStatus }),
          ...(resetDispatchedDate && { dispatchedDate: null }),
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
      action: `Hủy giao hàng - ${updatedOrder.id || systemId}${reason ? ` - Lý do: ${reason}` : ''}`,
      actionType: 'status',
      createdBy: session.user?.employee?.fullName || session.user?.name || session.user?.id || undefined,
    }).catch(e => logError('[Cancel Delivery] activity log failed', e));

    // Notify salesperson about delivery cancellation
    if (updatedOrder.salespersonId && updatedOrder.salespersonId !== session.user?.employeeId) {
      createNotification({
        type: 'order',
        title: 'Hủy giao hàng',
        message: `Giao hàng đơn ${updatedOrder.id || systemId} đã bị hủy${reason ? `: ${reason}` : ''}`,
        link: `/orders/${systemId}`,
        recipientId: updatedOrder.salespersonId,
        senderId: session.user?.employeeId,
        senderName: session.user?.name,
        settingsKey: 'order:delivery',
      }).catch(e => logError('[Cancel Delivery] notification failed', e));
    }

    return apiSuccess(updatedOrder);
  } catch (error) {
    logError('Error cancelling delivery', error);
    return apiError('Failed to cancel delivery', 500);
  }
}
