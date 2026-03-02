import { prisma } from '@/lib/prisma';
import { requireAuth, apiSuccess, apiError, apiNotFound } from '@/lib/api-utils';
import { generateNextIdsWithTx } from '@/lib/id-system';

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

// POST /api/orders/[systemId]/packaging/[packagingId]/in-store-pickup/confirm
// Confirm in-store pickup: dispatch stock + mark as delivered + complete order
export async function POST(request: Request, { params }: RouteParams) {
  const session = await requireAuth();
  if (!session) return apiError('Unauthorized', 401);

  try {
    const { systemId, packagingId } = await params;
    
    // Get request body for requestor info
    const body = await request.json().catch(() => ({}));
    const { requestorName, requestorId } = body;

    // Get the packaging with order, line items, and existing shipment
    const packaging = await prisma.packaging.findUnique({
      where: { systemId: packagingId },
      include: { 
        order: {
          include: {
            lineItems: {
              include: { product: true }
            },
            branch: true,
          }
        },
        shipment: true, // Check if shipment already exists
      },
    });

    if (!packaging) {
      return apiNotFound('Packaging');
    }

    if (packaging.orderId !== systemId) {
      return apiError('Packaging does not belong to this order', 400);
    }

    if (!packaging.confirmDate) {
      return apiError('Đóng gói phải được xác nhận trước khi giao hàng', 400);
    }
    
    // ✅ Prevent duplicate processing - check if already has shipment
    if (packaging.shipment) {
      return apiError('Đóng gói này đã được xử lý. Vui lòng tải lại trang.', 400);
    }
    
    // ✅ Check if already delivered
    if (packaging.deliveryStatus === 'DELIVERED') {
      return apiError('Đóng gói này đã được giao. Vui lòng tải lại trang.', 400);
    }

    const order = packaging.order;
    
    // ✅ Check allowNegativeStockOut setting
    const settings = await getSalesSettings();
    if (!settings.allowNegativeStockOut) {
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
    
    const employeeInfo = session.user?.employee as { systemId?: string; fullName?: string; name?: string } | undefined;
    const employeeName = employeeInfo?.fullName || employeeInfo?.name || session.user?.name || 'Hệ thống';
    const _employeeId = employeeInfo?.systemId;

    // Transaction: dispatch stock, create shipment, mark as delivered, complete order
    const updatedOrder = await prisma.$transaction(async (tx) => {
      // 1. Find default stock location for this branch
      const stockLocation = await tx.stockLocation.findFirst({
        where: {
          OR: [
            { branchId: order.branchId },
            { branchSystemId: order.branchId },
          ],
          isActive: true,
        },
      });

      // 2. Dispatch stock (deduct from warehouse) if location exists
      if (stockLocation) {
        for (const item of order.lineItems) {
          if (!item.productId) continue;
          
          // Find and update inventory
          const inventory = await tx.inventory.findFirst({
            where: {
              productId: item.productId,
              locationId: stockLocation.systemId,
            }
          });

          if (inventory) {
            const newQty = Math.max(0, Number(inventory.quantity) - Number(item.quantity));
            await tx.inventory.update({
              where: { systemId: inventory.systemId },
              data: { quantity: newQty },
            });

            // Create stock history record
            await tx.stockHistory.create({
              data: {
                productId: item.productId,
                branchId: order.branchId,
                action: 'Xuất kho bán hàng',
                source: 'Đơn hàng',
                quantityChange: -Number(item.quantity),
                newStockLevel: newQty,
                documentId: order.id,
                documentType: 'sales_order',
                employeeName: employeeName,
                note: `Xuất kho bán hàng - Khách lấy tại cửa hàng - Đơn ${order.id}`,
              }
            });
          }
        }
      }

      // 2. Create or update shipment record for in-store pickup
      let shipment = await tx.shipment.findFirst({
        where: { packagingSystemId: packagingId }
      });

      if (!shipment) {
        // Generate shipment IDs using id-system
        const shipmentIds = await generateNextIdsWithTx(tx, 'shipments');
        
        shipment = await tx.shipment.create({
          data: {
            systemId: shipmentIds.systemId,
            id: shipmentIds.businessId,
            packagingSystemId: packagingId,
            orderId: systemId, // Must use order.systemId (ORDER000001) as FK references Order.systemId
            orderSystemId: systemId,
            orderBusinessId: order.id, // Store business ID (DH000001) for display
            carrier: 'IN_STORE_PICKUP',
            trackingCode: `INSTORE-${packaging.id}`,
            status: 'DELIVERED',
            deliveredAt: new Date(),
          }
        });
      } else {
        await tx.shipment.update({
          where: { systemId: shipment.systemId },
          data: {
            status: 'DELIVERED',
            deliveredAt: new Date(),
          }
        });
      }

      // 3. Update packaging
      await tx.packaging.update({
        where: { systemId: packagingId },
        data: {
          deliveryMethod: 'PICKUP',
          deliveryStatus: 'DELIVERED',
          deliveredDate: new Date(),
          requestorName: requestorName || null,
          requestorId: requestorId || null,
        },
      });

      // 4. Calculate payment status to determine order status
      // Get all payments for this order
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
      
      // ✅ COMPLETED if fully paid, DELIVERED if delivered but not paid yet
      const newStatus = isFullyPaid ? 'COMPLETED' : 'DELIVERED';
      const completedDate = isFullyPaid ? new Date() : undefined;
      
      // 5. Update order status
      const updated = await tx.order.update({
        where: { systemId },
        data: { 
          status: newStatus,
          paymentStatus: newPaymentStatus, // ✅ Also update paymentStatus
          deliveryStatus: 'DELIVERED', // ✅ Also update order-level deliveryStatus
          stockOutStatus: 'FULLY_STOCKED_OUT', // ✅ Mark as stocked out
          dispatchedDate: new Date(),
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

      // ✅ 6. Update ProductInventory - customer picked up at store
      // -committed (release reservation), -onHand (physical stock out), +totalSold
      const branchId = order.branchId;
      if (branchId && order.lineItems.length > 0) {
        for (const item of order.lineItems) {
          const productId = item.productId;
          if (!productId) continue;
          
          // ✅ Use upsert to handle case where ProductInventory doesn't exist yet
          const existingInventory = await tx.productInventory.findUnique({
            where: {
              productId_branchId: { productId, branchId },
            },
          });
          
          const currentOnHand = existingInventory?.onHand ?? 0;
          const currentCommitted = existingInventory?.committed ?? 0;
          // Allow negative stock for tracking purposes
          const newOnHand = currentOnHand - item.quantity;
          const newCommitted = Math.max(0, currentCommitted - item.quantity);
          
          await tx.productInventory.upsert({
            where: {
              productId_branchId: { productId, branchId },
            },
            update: {
              committed: newCommitted,
              onHand: newOnHand, // Allow negative
              updatedAt: new Date(),
            },
            create: {
              productId,
              branchId,
              onHand: -item.quantity, // Start negative if no existing inventory
              committed: 0,
              inTransit: 0,
              inDelivery: 0,
            },
          });
          
          // ✅ Always create stock history record
          await tx.stockHistory.create({
            data: {
              productId,
              branchId,
              action: 'Xuất kho bán hàng',
              source: 'Đơn hàng',
              quantityChange: -item.quantity,
              newStockLevel: newOnHand, // Record actual level (can be negative)
              documentId: order.id,
              documentType: 'order',
              employeeId: session.user?.id,
              employeeName: session.user?.name || undefined,
              note: `Xuất kho bán hàng - khách nhận tại cửa hàng - ${item.productName || productId}`,
            },
          });
          
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

    return apiSuccess(updatedOrder);
  } catch (error) {
    console.error('Error confirming in-store pickup:', error);
    return apiError('Failed to confirm in-store pickup', 500);
  }
}
