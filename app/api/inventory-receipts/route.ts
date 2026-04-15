/**
 * Inventory Receipts API Route
 */

import { prisma } from '@/lib/prisma';
import { Prisma, InventoryReceiptType, InventoryReceiptStatus } from '@/generated/prisma/client';
import { validateBody, apiSuccess, apiPaginated, apiError, parsePagination } from '@/lib/api-utils';
import { apiHandler } from '@/lib/api-handler';
import { createInventoryReceiptSchema } from './validation';
import { generateNextIdsWithTx } from '@/lib/id-system';
import { logError } from '@/lib/logger'
import { syncProductsInventory } from '@/lib/meilisearch-sync'
import { createNotification } from '@/lib/notifications'
import { getUserNameFromDb } from '@/lib/get-user-name'

// Interface for inventory receipt item input
interface _InventoryReceiptItemInput {
  systemId: string;
  productId: string;
  quantity?: number;
  unitCost?: number;
  totalCost?: number;
  notes?: string;
}

// GET - List inventory receipts
export const GET = apiHandler(async (request) => {
  try {
    const searchParams = request.nextUrl.searchParams;
    const { page, limit, skip } = parsePagination(searchParams);
    const search = searchParams.get('search') || '';
    const type = searchParams.get('type') || '';
    const purchaseOrderSystemId = searchParams.get('purchaseOrderSystemId') || '';

    const supplierId = searchParams.get('supplierId') || '';
    const branchId = searchParams.get('branchId') || '';
    const productSystemId = searchParams.get('productSystemId') || '';
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const sortOrder = (searchParams.get('sortOrder') || 'desc') as 'asc' | 'desc';

    const where: Prisma.InventoryReceiptWhereInput = {};
    
    if (search) {
      where.OR = [
        { id: { contains: search, mode: 'insensitive' } },
        { notes: { contains: search, mode: 'insensitive' } },
        { supplierName: { contains: search, mode: 'insensitive' } },
      ];
    }
    
    if (type) {
      where.type = type as InventoryReceiptType;
    }

    // ⚡ Filter by purchase order for PO detail page
    if (purchaseOrderSystemId) {
      where.purchaseOrderSystemId = purchaseOrderSystemId;
    }

    if (supplierId) {
      where.supplierSystemId = supplierId;
    }

    if (branchId) {
      where.branchSystemId = branchId;
    }

    // ⚡ Filter by product - receipts containing items for this product
    if (productSystemId) {
      where.items = { some: { productId: productSystemId } };
    }

    const [data, total] = await Promise.all([
      prisma.inventoryReceipt.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
        include: {
          items: {
            include: {
              // ⚡ Include product for image URL
              inventoryReceipt: false, // Don't include back-reference
            },
          },
        },
      }),
      prisma.inventoryReceipt.count({ where }),
    ]);

    // Lookup products to get imageUrl for items
    const productIds = data.flatMap(r => r.items.map(i => i.productId)).filter((id): id is string => !!id);
    const uniqueProductIds = [...new Set(productIds)];
    
    const products = uniqueProductIds.length > 0
      ? await prisma.product.findMany({
          where: { systemId: { in: uniqueProductIds } },
          select: { systemId: true, imageUrl: true },
        })
      : [];
    
    const productMap = new Map(products.map(p => [p.systemId, p]));

    // Lookup purchase orders to get supplier info
    const poSystemIds = data
      .map(r => r.purchaseOrderSystemId)
      .filter((id): id is string => !!id);
    
    const purchaseOrders = poSystemIds.length > 0 
      ? await prisma.purchaseOrder.findMany({
          where: { systemId: { in: poSystemIds } },
          select: { 
            systemId: true, 
            id: true,
            supplier: { select: { name: true } },
          },
        })
      : [];
    
    const poMap = new Map(purchaseOrders.map(po => [po.systemId, po]));
    
    // Lookup employees for receiver info
    const employeeIds = data
      .map(r => r.employeeId)
      .filter((id): id is string => !!id);
    
    // Also lookup createdBy for createdByName
    const creatorIds = data
      .map(r => r.createdBy)
      .filter((id): id is string => !!id);
    
    const allEmployeeIds = [...new Set([...employeeIds, ...creatorIds])];
    
    const employees = allEmployeeIds.length > 0
      ? await prisma.employee.findMany({
          where: { systemId: { in: allEmployeeIds } },
          select: { systemId: true, fullName: true },
        })
      : [];
    
    const employeeMap = new Map(employees.map(e => [e.systemId, e]));

    // ✅ Transform data to match frontend expected format
    // DB schema: quantity, unitCost -> Frontend: receivedQuantity, unitPrice
    const transformedData = data.map(receipt => {
      const po = receipt.purchaseOrderSystemId ? poMap.get(receipt.purchaseOrderSystemId) : null;
      const employee = receipt.employeeId ? employeeMap.get(receipt.employeeId) : null;
      const creator = receipt.createdBy ? employeeMap.get(receipt.createdBy) : null;
      
      return {
        ...receipt,
        // Map receiptDate to receivedDate for frontend compatibility
        receivedDate: receipt.receivedDate?.toISOString() || receipt.receiptDate?.toISOString() || new Date().toISOString(),
        // Populate missing fields from relations
        purchaseOrderId: receipt.purchaseOrderId || po?.id || null,
        supplierName: receipt.supplierName || po?.supplier?.name || null,
        receiverName: receipt.receiverName || employee?.fullName || null,
        createdByName: creator?.fullName || null,
        items: receipt.items.map(item => {
          const product = item.productId ? productMap.get(item.productId) : null;
          return {
            ...item,
            // Map DB fields to frontend expected names
            productSystemId: item.productId,
            productId: item.productSku,
            receivedQuantity: item.quantity,
            orderedQuantity: item.quantity,
            unitPrice: Number(item.unitCost) || 0,
            unitCost: Number(item.unitCost) || 0,
            totalCost: Number(item.totalCost) || 0,
            // ⚡ Include product image
            imageUrl: product?.imageUrl || null,
          };
        }),
      };
    });

    return apiPaginated(transformedData, { page, limit, total });
  } catch (error) {
    logError('[Inventory Receipts API] GET error', error);
    return apiError('Không thể tải danh sách phiếu nhập kho', 500);
  }
})

// POST - Create new inventory receipt
export const POST = apiHandler(async (request, { session }) => {
  const result = await validateBody(request, createInventoryReceiptSchema);
  if (!result.success) return apiError(result.error, 400);

  try {
    const data = result.data;
    
    
    // Normalize branchId - support both branchId and branchSystemId
    const branchId = data.branchId || data.branchSystemId;
    if (!branchId) {
      return apiError('branchId or branchSystemId is required', 400);
    }

    const inventoryReceipt = await prisma.$transaction(async (tx) => {
      // Generate IDs using unified ID system
      const { systemId, businessId } = await generateNextIdsWithTx(
        tx,
        'inventory-receipts',
        data.id?.trim() || undefined
      );

      // Normalize items - prefer productSystemId over productId for FK references
      // productSystemId = internal ID (PROD112654), productId = business ID (ZP8)
      const normalizedItems = data.items?.map((item) => ({
        // Use productSystemId for database FK, productId for display/SKU
        productSystemId: item.productSystemId || '',
        productId: item.productId || '', // For display/SKU only
        productName: item.productName || '',
        // ✅ Ưu tiên receivedQuantity trước vì frontend gửi field này
        quantity: item.receivedQuantity || item.quantity || 1,
        // ✅ unitCost có thể là 0 (valid), dùng != null thay vì falsy check
        unitCost: item.unitCost != null && item.unitCost > 0 ? item.unitCost : (item.unitPrice || 0),
        totalCost: item.totalCost || 0,
        notes: item.notes || null,
      })) || [];
      
      const receipt = await tx.inventoryReceipt.create({
        data: {
          systemId,
          id: businessId,
          // Map type string to valid enum - PURCHASE is for goods receipt from supplier
          type: (data.type === 'GOODS_RECEIPT' || data.type === 'PURCHASE' || !data.type ? 'PURCHASE' : data.type) as InventoryReceiptType,
          branchId: branchId,
          branchSystemId: branchId, // Also save as branchSystemId for frontend
          branchName: data.branchName || null, // Save branch name for display
          employeeId: data.employeeId || data.receiverSystemId || null,
          referenceType: data.referenceType || (data.purchaseOrderSystemId ? 'purchase_order' : null),
          referenceId: data.referenceId || data.purchaseOrderSystemId || null,
          // Link to purchase order
          purchaseOrderSystemId: data.purchaseOrderSystemId || null,
          purchaseOrderId: data.purchaseOrderId || null,
          supplierSystemId: data.supplierSystemId || null,
          supplierName: data.supplierName || null,
          receiptDate: data.receiptDate || data.receivedDate ? new Date(data.receiptDate || data.receivedDate!) : new Date(),
          receivedDate: data.receivedDate ? new Date(data.receivedDate) : new Date(),
          receiverSystemId: data.receiverSystemId || null,
          receiverName: data.receiverName || null,
          status: (data.status === 'DRAFT' ? 'DRAFT' : data.status === 'CANCELLED' ? 'CANCELLED' : 'CONFIRMED') as InventoryReceiptStatus,
          notes: data.notes || null,
          createdBy: data.createdBy || session!.user?.name || session!.user?.id || null,
          items: normalizedItems.length ? {
            create: normalizedItems.map((item) => ({
              productId: item.productSystemId, // Use systemId for FK reference
              productName: item.productName,
              productSku: item.productId, // Use businessId for SKU display
              quantity: item.quantity,
              unitCost: item.unitCost,
              totalCost: item.totalCost || item.quantity * item.unitCost,
            })),
          } : undefined,
        },
        include: {
          items: true,
        },
      });

      // ✅ Auto-update ProductInventory and create StockHistory for each item
      if (normalizedItems.length && branchId) {
        // G1: Check if linked PO is active (for inTransit tracking)
        let linkedPOActive = false;
        if (data.purchaseOrderSystemId) {
          const linkedPO = await tx.purchaseOrder.findUnique({
            where: { systemId: data.purchaseOrderSystemId },
            select: { status: true },
          });
          linkedPOActive = !!linkedPO && ['PENDING', 'CONFIRMED', 'RECEIVING'].includes(linkedPO.status);
        }

        // Tính tổng số lượng để phân bổ chi phí
        const totalQuantity = normalizedItems.reduce((sum, item) => sum + item.quantity, 0);
        const shippingFee = data.shippingFee || 0;
        const otherFees = data.otherFees || 0;
        const totalFees = shippingFee + otherFees;
        // Chi phí phân bổ cho mỗi đơn vị sản phẩm
        const feePerUnit = totalQuantity > 0 ? totalFees / totalQuantity : 0;
        const costMethod = data.costCalculationMethod || 'with_fees';
        

        for (const item of normalizedItems) {
          const quantity = item.quantity;
          const unitCost = item.unitCost || 0;
          // Giá nhập + chi phí phân bổ
          const unitCostWithFees = unitCost + feePerUnit;
          
          
          // Get current inventory - use productSystemId for FK reference
          const inventory = await tx.productInventory.findUnique({
            where: {
              productId_branchId: {
                productId: item.productSystemId,
                branchId: branchId,
              },
            },
          });

          // Update ProductInventory - use productSystemId for FK reference
          // ✅ Use actual returned value from DB to ensure accuracy
          const updatedInventory = await tx.productInventory.upsert({
            where: {
              productId_branchId: {
                productId: item.productSystemId,
                branchId: branchId,
              },
            },
            update: {
              onHand: { increment: quantity },
              updatedAt: new Date(),
            },
            create: {
              productId: item.productSystemId,
              branchId: branchId,
              onHand: quantity,
              committed: 0,
              inTransit: 0,
              inDelivery: 0,
            },
          });

          // G1: Decrease inTransit when receiving from an active PO
          if (linkedPOActive) {
            const decrementBy = Math.min(quantity, updatedInventory.inTransit);
            if (decrementBy > 0) {
              await tx.productInventory.update({
                where: { productId_branchId: { productId: item.productSystemId, branchId: branchId } },
                data: { inTransit: { decrement: decrementBy } },
              });
            }
          }

          // Create StockHistory - use actual DB value for accurate stock level
          await tx.stockHistory.create({
            data: {
              productId: item.productSystemId,
              branchId: branchId,
              action: 'Nhập kho',
              source: 'Phiếu nhập kho',
              quantityChange: quantity,
              newStockLevel: updatedInventory.onHand, // ✅ Use actual DB value
              documentId: businessId,
              documentType: 'inventory_receipt',
              employeeId: session!.user?.id,
              employeeName: session!.user?.name || undefined,
              note: `Nhập kho - ${item.notes || 'Phiếu nhập hàng'}`,
            },
          });

          // ✅ Always update lastPurchaseDate when receiving inventory
          // Update cost price only if unitCost > 0
          const currentProduct = await tx.product.findUnique({
            where: { systemId: item.productSystemId },
            select: { costPrice: true },
          });
          
          const _currentCostPrice = Number(currentProduct?.costPrice) || 0;
          
          if (unitCost > 0) {
            // Tính giá vốn dựa trên phương pháp được chọn
            // ✅ Logic: Mỗi lô nhập có giá vốn riêng = Giá nhập + Phí phân bổ
            // KHÔNG bình quân với tồn cũ (mỗi lô 1 giá khác nhau)
            let newCostPrice = unitCostWithFees; // Default: giá nhập + chi phí phân bổ
            
            switch (costMethod) {
              case 'last_purchase':
                // Giá vốn = giá nhập gần nhất (không tính phí)
                newCostPrice = unitCost;
                break;
              
              case 'weighted_average':
                // Giá vốn = giá nhập (không tính phí)
                newCostPrice = unitCost;
                break;
              
              case 'with_fees':
              default:
                // Giá vốn = Giá nhập + Phí phân bổ cho lô này
                newCostPrice = Math.round(unitCostWithFees);
                break;
            }
            
            await tx.product.update({
              where: { systemId: item.productSystemId },
              data: {
                lastPurchasePrice: unitCost, // Giá nhập gốc (không bao gồm phí)
                lastPurchaseDate: new Date(),
                // Giá vốn đã tính theo phương pháp được chọn
                costPrice: newCostPrice,
              },
            });

          } else {
            // unitCost = 0, chỉ update lastPurchaseDate
            await tx.product.update({
              where: { systemId: item.productSystemId },
              data: {
                lastPurchaseDate: new Date(),
              },
            });
          }
        }
        
      }

      // ✅ Update supplier debt when receiving goods from a supplier
      // Nhập hàng = tăng công nợ phải trả nhà cung cấp
      if (data.supplierSystemId && receipt.status === 'CONFIRMED') {
        const totalAmount = normalizedItems.reduce(
          (sum, item) => sum + (item.totalCost || item.quantity * item.unitCost),
          0
        );
        
        if (totalAmount > 0) {
          await tx.supplier.update({
            where: { systemId: data.supplierSystemId },
            data: {
              currentDebt: { increment: totalAmount },
            },
          });
        }
      }

      return receipt;
    });

    // ✅ Sync affected products to Meilisearch for real-time inventory data
    if (inventoryReceipt.items && inventoryReceipt.items.length > 0) {
      const productSystemIds = inventoryReceipt.items
        .map(item => item.productId) // productId in DB is actually productSystemId
        .filter(Boolean) as string[];
      syncProductsInventory(productSystemIds).catch(err => 
        logError('[Inventory Receipts API] Meilisearch sync failed', err)
      );
    }

    // ✅ Notify assigned employee about new inventory receipt
    const receiptEmployeeId = inventoryReceipt.employeeId || inventoryReceipt.receiverSystemId
    if (receiptEmployeeId && receiptEmployeeId !== session!.user?.employeeId) {
      createNotification({
        type: 'inventory_receipt',
        settingsKey: 'inventory-receipt:updated',
        title: 'Nhập kho mới',
        message: `Phiếu nhập kho ${inventoryReceipt.id || inventoryReceipt.systemId}${inventoryReceipt.supplierName ? ` - NCC: ${inventoryReceipt.supplierName}` : ''}`,
        link: `/inventory-receipts/${inventoryReceipt.systemId}`,
        recipientId: receiptEmployeeId,
        senderId: session!.user?.employeeId,
        senderName: session!.user?.name,
      }).catch(e => logError('[Inventory Receipts POST] notification failed', e))
    }

    // Log activity
    getUserNameFromDb(session!.user?.id).then(userName =>
      prisma.activityLog.create({
        data: {
          entityType: 'inventory_receipt',
          entityId: inventoryReceipt.systemId,
          action: 'created',
          actionType: 'create',
          note: `Tạo phiếu nhập kho`,
          metadata: { userName },
          createdBy: userName,
        }
      })
    ).catch(e => logError('[ActivityLog] inventory_receipt create failed', e))
    return apiSuccess(inventoryReceipt, 201);
  } catch (error) {
    logError('[Inventory Receipts API] POST error', error);
    return apiError('Không thể tạo phiếu nhập kho', 500);
  }
})
