import { prisma } from '@/lib/prisma';
import { requireAuth, apiSuccess, apiError, apiNotFound } from '@/lib/api-utils';
import { logError } from '@/lib/logger'
import { createNotification } from '@/lib/notifications'
import { createActivityLog } from '@/lib/services/activity-log-service'
import { resolveStockItems } from '@/lib/inventory/combo-stock-helper'

interface RouteParams {
  params: Promise<{ systemId: string; packagingId: string }>;
}

// Helper to get sales management settings
async function getSalesSettings() {
  const setting = await prisma.setting.findFirst({
    where: { key: 'sales-management-settings' },
  });
  // Note: setting.value is already a JSON object (Prisma Json type)
  const value = setting?.value as { allowNegativeStockOut?: boolean } | null;
  return { allowNegativeStockOut: value?.allowNegativeStockOut ?? true };
}

// POST /api/orders/[systemId]/packaging/[packagingId]/dispatch - Dispatch from warehouse
export async function POST(_request: Request, { params }: RouteParams) {
  const session = await requireAuth();
  if (!session) return apiError('Unauthorized', 401);

  try {
    const { systemId, packagingId } = await params;

    // Get the packaging with order and line items
    const packaging = await prisma.packaging.findUnique({
      where: { systemId: packagingId },
      select: {
        systemId: true,
        orderId: true,
        confirmDate: true,
        order: {
          select: {
            lineItems: {
              select: {
                productId: true,
                productName: true,
                quantity: true,
              },
            },
            branchId: true,
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

    if (!packaging.confirmDate) {
      return apiError('Packaging must be completed before dispatch', 400);
    }

    // ✅ Check allowNegativeStockOut setting (resolves combo → children)
    const settings = await getSalesSettings();
    if (!settings.allowNegativeStockOut && packaging.order) {
      const order = packaging.order;
      const branchId = order.branchId;
      
      // Resolve combo items to actual stock items
      const stockItems = await resolveStockItems(prisma as never, order.lineItems)
      const productIds = stockItems.map(si => si.productId)
      const inventories = await prisma.productInventory.findMany({
        where: { productId: { in: productIds }, branchId },
      });
      const inventoryMap = new Map(inventories.map(inv => [inv.productId, inv]));
      
      for (const stockItem of stockItems) {
        const inventory = inventoryMap.get(stockItem.productId);
        const onHand = inventory?.onHand ?? 0;
        
        if (onHand < stockItem.quantity) {
          return apiError(
            `Không thể xuất kho: Sản phẩm "${stockItem.productName}" không đủ tồn kho. Có: ${onHand}, cần: ${stockItem.quantity}`,
            400
          );
        }
      }
    }

    // Transaction: update packaging and order status
    const updatedOrder = await prisma.$transaction(async (tx) => {
      // Update packaging status - dispatch = stock out + start shipping
      await tx.packaging.update({
        where: { systemId: packagingId },
        data: {
          deliveryStatus: 'SHIPPING',
        },
      });

      // Update order status - stock out and start shipping
      const updated = await tx.order.update({
        where: { systemId },
        data: { 
          status: 'SHIPPING', 
          deliveryStatus: 'SHIPPING',
          stockOutStatus: 'FULLY_STOCKED_OUT',
          dispatchedDate: new Date(),
        },
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
          dispatchedDate: true,
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

      // ✅ Update ProductInventory - dispatch from warehouse
      // -committed (release reservation), -onHand (physical stock out), +inDelivery (in transit to customer)
      // For combo products, deduct stock of child components
      const branchId = updated.branchId;
      if (branchId && updated.lineItems.length > 0) {
        const stockItems = await resolveStockItems(tx, updated.lineItems)
        for (const stockItem of stockItems) {
          const inventory = await tx.productInventory.findUnique({
            where: {
              productId_branchId: { productId: stockItem.productId, branchId },
            },
          });
          
          if (inventory) {
            const newOnHand = inventory.onHand - stockItem.quantity;
            
            await tx.productInventory.update({
              where: {
                productId_branchId: { productId: stockItem.productId, branchId },
              },
              data: {
                committed: { decrement: Math.min(inventory.committed, stockItem.quantity) },
                onHand: { decrement: stockItem.quantity },
                inDelivery: { increment: stockItem.quantity },
                updatedAt: new Date(),
              },
            });
            
            await tx.stockHistory.create({
              data: {
                productId: stockItem.productId,
                branchId,
                action: 'Xuất kho bán hàng',
                source: 'Đơn hàng',
                quantityChange: -stockItem.quantity,
                newStockLevel: newOnHand,
                documentId: updated.id,
                documentType: 'order',
                employeeId: session.user?.id,
                employeeName: session.user?.name || undefined,
                note: `Xuất kho bán hàng - ${stockItem.productName}`,
              },
            });
          }
        }
        
      }

      return updated;
    });

    // Log activity
    await createActivityLog({
      entityType: 'order',
      entityId: systemId,
      action: `Xuất kho đơn hàng ${updatedOrder.id || systemId}`,
      actionType: 'status',
      createdBy: session.user?.employee?.fullName || session.user?.name || session.user?.id || undefined,
    }).catch(e => logError('[Dispatch] activity log failed', e));

    // Notify salesperson about dispatch
    if (updatedOrder.salespersonId && updatedOrder.salespersonId !== session.user?.employeeId) {
      createNotification({
        type: 'order',
        settingsKey: 'order:packaging',
        title: 'Đơn hàng đã xuất kho',
        message: `Đơn hàng ${updatedOrder.id || systemId} đã được xuất kho`,
        link: `/orders/${systemId}`,
        recipientId: updatedOrder.salespersonId,
        senderId: session.user?.employeeId,
        senderName: session.user?.name,
      }).catch(e => logError('[Dispatch] notification failed', e));
    }

    return apiSuccess(updatedOrder);
  } catch (error) {
    logError('Error dispatching order', error);
    return apiError('Failed to dispatch order', 500);
  }
}
