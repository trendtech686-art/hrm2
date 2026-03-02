import { prisma } from '@/lib/prisma';
import { requireAuth, apiSuccess, apiError, apiNotFound } from '@/lib/api-utils';

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
      include: { 
        order: {
          include: { lineItems: true }
        } 
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

    // ✅ Check allowNegativeStockOut setting
    const settings = await getSalesSettings();
    if (!settings.allowNegativeStockOut && packaging.order) {
      const order = packaging.order;
      const branchId = order.branchId;
      
      // Get inventories for all products
      const productIds = order.lineItems.map(item => item.productId).filter(Boolean) as string[];
      const inventories = await prisma.productInventory.findMany({
        where: { productId: { in: productIds }, branchId },
      });
      const inventoryMap = new Map(inventories.map(inv => [inv.productId, inv]));
      
      for (const item of order.lineItems) {
        if (!item.productId) continue;
        const inventory = inventoryMap.get(item.productId);
        const onHand = inventory?.onHand ?? 0;
        
        if (onHand < item.quantity) {
          return apiError(
            `Không thể xuất kho: Sản phẩm "${item.productName || item.productId}" không đủ tồn kho. Có: ${onHand}, cần: ${item.quantity}`,
            400
          );
        }
      }
    }

    // Transaction: update packaging and order status
    const updatedOrder = await prisma.$transaction(async (tx) => {
      // Update packaging status - mark as completed/shipped
      await tx.packaging.update({
        where: { systemId: packagingId },
        data: {
          deliveryStatus: 'SHIPPING',
        },
      });

      // Update order status
      const updated = await tx.order.update({
        where: { systemId },
        data: { 
          status: 'SHIPPING', 
          deliveryStatus: 'SHIPPING', // ✅ Also update order-level deliveryStatus
          stockOutStatus: 'FULLY_STOCKED_OUT',
          dispatchedDate: new Date(),
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

      // ✅ Update ProductInventory - dispatch from warehouse
      // -committed (release reservation), -onHand (physical stock out), +inDelivery (in transit to customer)
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
            // Calculate new onHand - allow negative for tracking purposes
            const newOnHand = inventory.onHand - item.quantity;
            
            await tx.productInventory.update({
              where: {
                productId_branchId: { productId, branchId },
              },
              data: {
                committed: { decrement: Math.min(inventory.committed, item.quantity) },
                onHand: { decrement: item.quantity }, // Allow negative stock
                inDelivery: { increment: item.quantity },
                updatedAt: new Date(),
              },
            });
            
            // ✅ Create stock history record
            await tx.stockHistory.create({
              data: {
                productId,
                branchId,
                action: 'Xuất kho bán hàng',
                source: 'Đơn hàng',
                quantityChange: -item.quantity,
                newStockLevel: newOnHand, // Record actual new level (can be negative)
                documentId: updated.id,
                documentType: 'order',
                employeeId: session.user?.id,
                employeeName: session.user?.name || undefined,
                note: `Xuất kho bán hàng - ${item.productName || productId}`,
              },
            });
          }
        }
        
      }

      return updated;
    });

    return apiSuccess(updatedOrder);
  } catch (error) {
    console.error('Error dispatching order:', error);
    return apiError('Failed to dispatch order', 500);
  }
}
