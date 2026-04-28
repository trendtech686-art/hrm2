/**
 * Purchase Returns API Route
 * 
 * POST /api/purchase-returns - Create return with inventory/supplier balance updates
 * GET  /api/purchase-returns - List returns with advanced filtering
 * 
 * Business Logic:
 * - Validates purchase order and items exist
 * - Checks return quantities don't exceed received quantities  
 * - Creates return with atomic transaction:
 *   - Deducts inventory from warehouse
 *   - Updates supplier balance (debit for return)
 *   - Creates purchase return record
 *   - Updates purchase order return status
 * - Handles approval workflow (DRAFT → PENDING → APPROVED → COMPLETED)
 */

import { prisma } from '@/lib/prisma';
import type { Prisma } from '@/generated/prisma/client';
import { PurchaseReturnStatus } from '@/generated/prisma/client';
import { validateBody, apiSuccess, apiPaginated, apiError, parsePagination } from '@/lib/api-utils';
import { apiHandler } from '@/lib/api-handler';
import { createPurchaseReturnSchema } from './validation';
import { generateIdWithPrefix } from '@/lib/id-generator';
import { v4 as uuidv4 } from 'uuid';
import { logError } from '@/lib/logger'
import { createNotification } from '@/lib/notifications'
import { syncProductsInventory } from '@/lib/meilisearch-sync'
import { buildSearchWhere } from '@/lib/search/build-search-where'

// Interface for purchase return item input
interface _PurchaseReturnItemInput {
  productSystemId: string;
  productId?: string;
  productName?: string;
  orderedQuantity?: number;
  returnQuantity: number;
  unitPrice: number;
  note?: string;
}

// GET - List purchase returns with advanced filtering
export const GET = apiHandler(async (request) => {
  try {
    const searchParams = request.nextUrl.searchParams;
    const { page, limit, skip } = parsePagination(searchParams);
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status');
    const supplierId = searchParams.get('supplierId');
    const purchaseOrderId = searchParams.get('purchaseOrderId');
    const branchId = searchParams.get('branchId');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const sortOrder = (searchParams.get('sortOrder') || 'desc') as 'asc' | 'desc';

    const where: Prisma.PurchaseReturnWhereInput = {};
    
    // Build AND conditions array for complex queries
    const andConditions: Prisma.PurchaseReturnWhereInput[] = [];
    
    const searchWhere = buildSearchWhere<Prisma.PurchaseReturnWhereInput>(search, [
      'id',
      'reason',
      'supplierName',
    ])
    if (searchWhere) andConditions.push(searchWhere)

    if (status) {
      where.status = status as PurchaseReturnStatus;
    }

    if (supplierId) {
      // ✅ FIX: Check both supplierId and supplierSystemId
      andConditions.push({
        OR: [
          { supplierId: supplierId },
          { supplierSystemId: supplierId },
        ],
      });
    }
    
    // Apply AND conditions if any
    if (andConditions.length > 0) {
      where.AND = andConditions;
    }

    if (purchaseOrderId) {
      where.purchaseOrderSystemId = purchaseOrderId;
    }

    if (branchId) {
      where.branchSystemId = branchId;
    }

    if (startDate || endDate) {
      where.returnDate = {};
      if (startDate) {
        where.returnDate.gte = new Date(startDate);
      }
      if (endDate) {
        where.returnDate.lte = new Date(endDate);
      }
    }

    const [rawData, total] = await Promise.all([
      prisma.purchaseReturn.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
        select: {
          systemId: true,
          id: true,
          supplierId: true,
          purchaseOrderId: true,
          branchId: true,
          employeeId: true,
          status: true,
          reason: true,
          purchaseOrderSystemId: true,
          purchaseOrderBusinessId: true,
          supplierSystemId: true,
          supplierName: true,
          branchSystemId: true,
          branchName: true,
          refundMethod: true,
          accountSystemId: true,
          creatorName: true,
          createdBy: true,
          updatedBy: true,
          subtotal: true,
          total: true,
          totalReturnValue: true,
          refundAmount: true,
          returnDate: true,
          returnItems: true,
          createdAt: true,
          updatedAt: true,
          items: {
            select: {
              systemId: true,
              productId: true,
              quantity: true,
              unitPrice: true,
              total: true,
              reason: true,
            },
          },
          suppliers: {
            select: { systemId: true, id: true, name: true, phone: true, email: true, address: true, bankAccount: true, bankName: true },
          },
        },
      }),
      prisma.purchaseReturn.count({ where }),
    ]);

    // Map data to include proper items structure from returnItems JSON
    // The relational `items` table has different structure (quantity vs returnQuantity)
    // So we prefer returnItems JSON which has the correct format
    const data = rawData.map(pr => {
      // Parse returnItems JSON if available, otherwise map from relational items
      interface PurchaseReturnItemData {
        productSystemId: string;
        productId?: string;
        productName?: string;
        orderedQuantity?: number;
        returnQuantity: number;
        unitPrice: number;
        note?: string;
      }
      let items: PurchaseReturnItemData[] = [];
      
      // returnItems is stored as JSON in Prisma, may be array or need parsing
      const returnItemsData = pr.returnItems;
      if (returnItemsData) {
        // If it's already an array, use it directly
        if (Array.isArray(returnItemsData)) {
          // Convert any Decimal values in the JSON items
          items = (returnItemsData as unknown as PurchaseReturnItemData[]).map(item => ({
            ...item,
            unitPrice: Number(item.unitPrice),
          }));
        } 
        // If it's a string (shouldn't happen but just in case), try parsing
        else if (typeof returnItemsData === 'string') {
          try {
            const parsed = JSON.parse(returnItemsData);
            if (Array.isArray(parsed)) {
              items = parsed.map((item: PurchaseReturnItemData) => ({
                ...item,
                unitPrice: Number(item.unitPrice),
              }));
            }
          } catch {
            // Ignore parse errors
          }
        }
      }
      
      // Fallback: if returnItems empty, map from relational items table
      if (items.length === 0 && pr.items && pr.items.length > 0) {
        items = pr.items.map(item => ({
          productSystemId: item.productId || '',
          productId: item.productId || '',
          productName: '', // Not available in relational table
          orderedQuantity: 0,
          returnQuantity: item.quantity,
          unitPrice: Number(item.unitPrice),
          note: item.reason || '',
        }));
      }

      // Destructure to exclude relational items from spread
      const { items: _relationalItems, ...prBase } = pr;
      return {
        ...prBase,
        items,
        // Convert Decimal fields to numbers
        subtotal: Number(pr.subtotal),
        total: Number(pr.total),
        totalReturnValue: Number(pr.totalReturnValue),
        refundAmount: Number(pr.refundAmount),
      };
    });

    return apiPaginated(data, { page, limit, total });
  } catch (error) {
    logError('[Purchase Returns API] GET error', error);
    return apiError('Không thể tải danh sách phiếu trả hàng nhập', 500);
  }
})

// POST - Create new purchase return with inventory and supplier balance updates
export const POST = apiHandler(async (request, { session }) => {
  const result = await validateBody(request, createPurchaseReturnSchema);
  if (!result.success) return apiError(result.error, 400);

  try {
    const {
      purchaseOrderSystemId,
      reason,
      items,
      refundAmount,
      refundMethod,
      accountSystemId,
      branchSystemId,
    } = result.data;

    // Validate purchase order exists
    const purchaseOrder = await prisma.purchaseOrder.findUnique({
      where: { systemId: purchaseOrderSystemId },
      select: {
        systemId: true,
        id: true,
        supplierId: true,
        supplierSystemId: true,
        supplierName: true,
        status: true,
        buyerSystemId: true,
        supplier: {
          select: { systemId: true, id: true, name: true, phone: true, email: true, address: true, bankAccount: true, bankName: true },
        },
        items: {
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
                id: true,
                name: true,
                unit: true,
                imageUrl: true,
              },
            },
          },
        },
      },
    });

    if (!purchaseOrder) {
      return apiError('Purchase order not found', 404);
    }

    // Validate return items
    if (!items || items.length === 0) {
      return apiError('At least one return item is required', 400);
    }

    // ✅ FIX: Get inventory receipts and previous returns to calculate returnable qty
    const [inventoryReceipts, previousReturns] = await Promise.all([
      prisma.inventoryReceipt.findMany({
        where: {
          purchaseOrderSystemId: purchaseOrder.systemId,
          status: { not: 'CANCELLED' },
        },
        select: {
          systemId: true,
          receiptItems: true,
        },
      }),
      prisma.purchaseReturn.findMany({
        where: {
          purchaseOrderSystemId: purchaseOrder.systemId,
          status: { not: 'CANCELLED' },
        },
        select: {
          systemId: true,
          returnItems: true,
          items: {
            select: {
              systemId: true,
              productId: true,
              quantity: true,
            },
          },
        },
      }),
    ]);

    // Calculate received quantities per product
    interface ReceiptLineItem { productId?: string; quantity?: number }
    const receivedQuantities: Record<string, number> = {};
    for (const receipt of inventoryReceipts) {
      const receiptItems = (receipt.receiptItems as ReceiptLineItem[] | null) || [];
      for (const item of receiptItems) {
        if (item.productId) {
          receivedQuantities[item.productId] = (receivedQuantities[item.productId] || 0) + (item.quantity || 0);
        }
      }
    }

    // Calculate already returned quantities per product
    const returnedQuantities: Record<string, number> = {};
    for (const pr of previousReturns) {
      // Prefer returnItems JSON
      interface ReturnItemJson { productSystemId: string; returnQuantity: number }
      const returnItems = pr.returnItems as ReturnItemJson[] | null;
      if (returnItems && Array.isArray(returnItems)) {
        for (const item of returnItems) {
          if (item.productSystemId) {
            returnedQuantities[item.productSystemId] = (returnedQuantities[item.productSystemId] || 0) + (item.returnQuantity || 0);
          }
        }
      } else if (pr.items && pr.items.length > 0) {
        for (const item of pr.items) {
          if (item.productId) {
            returnedQuantities[item.productId] = (returnedQuantities[item.productId] || 0) + item.quantity;
          }
        }
      }
    }

    for (const item of items) {
      if (item.returnQuantity <= 0) {
        return apiError('Return quantity must be greater than 0', 400);
      }

      // ✅ FIX: Also match by product.id (SKU) to handle legacy data or frontend sending SKU
      const poItem = purchaseOrder.items.find(
        (poi) => poi.productId === item.productSystemId || poi.product?.id === item.productSystemId
      );

      if (!poItem) {
        return apiError(
          `Product ${item.productSystemId} not found in purchase order`,
          400
        );
      }

      // ✅ FIX: Use resolved productId (systemId from FK) for quantity lookups
      const resolvedProductId = poItem.productId || item.productSystemId;
      
      // ✅ FIX: Calculate actual returnable quantity = received - already_returned
      const totalReceived = receivedQuantities[resolvedProductId] || 0;
      const totalReturned = returnedQuantities[resolvedProductId] || 0;
      const returnableQty = totalReceived - totalReturned;

      // Check if return quantity exceeds returnable quantity
      if (item.returnQuantity > returnableQty) {
        return apiError(
          `Số lượng trả (${item.returnQuantity}) vượt quá số lượng có thể trả (${returnableQty}) cho sản phẩm ${poItem.product?.name || poItem.productName}. Đã nhập: ${totalReceived}, Đã trả: ${totalReturned}`,
          400
        );
      }
    }

    // Calculate total return value
    const totalReturnValue = items.reduce(
      (sum, item) => sum + item.unitPrice * item.returnQuantity,
      0
    );

    // Validate refund amount
    const finalRefundAmount = refundAmount || 0;
    if (finalRefundAmount > totalReturnValue) {
      return apiError(
        'Refund amount cannot exceed total return value',
        400
      );
    }

    // Create purchase return with atomic transaction
    const purchaseReturn = await prisma.$transaction(async (tx) => {
      // Generate IDs
      const systemId = uuidv4();
      const businessId = await generateIdWithPrefix('TH', tx); // TH = Trả Hàng NCC

      // Get branch info if specified
      let branchName: string | undefined = undefined;
      if (branchSystemId) {
        const branch = await tx.branch.findUnique({
          where: { systemId: branchSystemId },
          select: { name: true },
        });
        branchName = branch?.name ?? undefined;
      }

      // Create purchase return record
      const newReturn = await tx.purchaseReturn.create({
        data: {
          systemId,
          id: businessId,
          supplierId: purchaseOrder.supplierId ?? undefined,
          // ✅ FIX: Use supplierSystemId from PO, not supplierId
          supplierSystemId: purchaseOrder.supplierSystemId ?? purchaseOrder.supplier?.systemId ?? undefined,
          supplierName: purchaseOrder.supplier?.name ?? purchaseOrder.supplierName ?? undefined,
          purchaseOrderId: purchaseOrder.id,
          purchaseOrderSystemId: purchaseOrder.systemId,
          purchaseOrderBusinessId: purchaseOrder.id,
          branchId: branchSystemId || null,
          branchSystemId: branchSystemId || null,
          branchName: branchName,
          returnDate: new Date(),
          status: PurchaseReturnStatus.PENDING, // Start as PENDING for approval
          reason: reason || null,
          subtotal: totalReturnValue,
          total: totalReturnValue,
          totalReturnValue,
          refundAmount: finalRefundAmount,
          refundMethod: refundMethod || null,
          accountSystemId: accountSystemId || null,
          createdBy: result.data.createdBy || session!.user?.id || null,
          creatorName: result.data.creatorName || session!.user?.name || null,
          // Store items as JSON for flexible structure
          returnItems: items.map((item) => {
            // Find the PO item to get product name if not provided
            const poItem = purchaseOrder.items.find(
              (poi) => poi.productId === item.productSystemId || poi.product?.id === item.productSystemId
            );
            const productName = item.productName || poItem?.product?.name || poItem?.productName || 'Unknown Product';
            const imageUrl = poItem?.product?.imageUrl || null;
            // ✅ FIX: Use poItem.productId (actual systemId from FK) for productSystemId
            const resolvedProductSystemId = poItem?.productId || item.productSystemId;
            return {
              productSystemId: resolvedProductSystemId,
              productId: poItem?.product?.id || item.productId || item.productSystemId,
              productName,
              orderedQuantity: item.orderedQuantity || poItem?.quantity || 0,
              returnQuantity: item.returnQuantity,
              unitPrice: item.unitPrice,
              note: item.note || null,
              imageUrl, // ✅ Include product image URL
            };
          }),
          // Create individual item records for relational queries
          items: {
            create: items.map((item) => {
              const poItem = purchaseOrder.items.find(
                (poi) => poi.productId === item.productSystemId || poi.product?.id === item.productSystemId
              );
              // ✅ FIX: Use poItem.productId (actual systemId from FK)
              const resolvedProductSystemId = poItem?.productId || item.productSystemId;
              return {
                systemId: uuidv4(),
                productId: resolvedProductSystemId,
                quantity: item.returnQuantity,
                unitPrice: item.unitPrice,
                total: item.unitPrice * item.returnQuantity,
                reason: item.note || reason || null,
              };
            }),
          },
        },
        select: {
          systemId: true,
          id: true,
          supplierId: true,
          purchaseOrderId: true,
          branchId: true,
          employeeId: true,
          status: true,
          reason: true,
          purchaseOrderSystemId: true,
          purchaseOrderBusinessId: true,
          supplierSystemId: true,
          supplierName: true,
          branchSystemId: true,
          branchName: true,
          refundMethod: true,
          accountSystemId: true,
          creatorName: true,
          createdBy: true,
          updatedBy: true,
          subtotal: true,
          total: true,
          totalReturnValue: true,
          refundAmount: true,
          returnDate: true,
          returnItems: true,
          createdAt: true,
          updatedAt: true,
          items: {
            select: {
              systemId: true,
              productId: true,
              quantity: true,
              unitPrice: true,
              total: true,
              reason: true,
            },
          },
          suppliers: {
            select: { systemId: true, id: true, name: true, phone: true, email: true, address: true, bankAccount: true, bankName: true },
          },
        },
      });

      // ✅ FIX: Build a map of resolved product systemIds from PO items
      // PO items have correct productId (Product.systemId) from FK relation
      // This handles cases where input productSystemId might be SKU instead of systemId
      const productSystemIdMap = new Map<string, string>();
      for (const item of items) {
        const poItem = purchaseOrder.items.find(
          (poi) => poi.productId === item.productSystemId || poi.product?.id === item.productSystemId
        );
        if (poItem?.productId) {
          // poItem.productId is the actual Product.systemId from FK
          productSystemIdMap.set(item.productSystemId, poItem.productId);
        }
      }

      // Update inventory - deduct returned quantities
      for (const item of items) {
        // ✅ FIX: Resolve correct product systemId from PO items
        const resolvedProductSystemId = productSystemIdMap.get(item.productSystemId) || item.productSystemId;

        // Update product inventory for the branch
        if (branchSystemId) {
          // ✅ Use upsert to get actual DB value after update
          const updatedInventory = await tx.productInventory.upsert({
            where: {
              productId_branchId: {
                productId: resolvedProductSystemId,
                branchId: branchSystemId,
              },
            },
            update: {
              onHand: { decrement: item.returnQuantity },
            },
            create: {
              productId: resolvedProductSystemId,
              branchId: branchSystemId,
              onHand: -item.returnQuantity,
              committed: 0,
              inTransit: 0,
              inDelivery: 0,
            },
          });
          
          // ✅ Create stock history record with actual DB value
          await tx.stockHistory.create({
            data: {
              productId: resolvedProductSystemId,
              branchId: branchSystemId,
              action: 'Xuất kho trả NCC',
              source: 'Phiếu trả hàng nhập',
              quantityChange: -item.returnQuantity,
              newStockLevel: updatedInventory.onHand, // ✅ Use actual DB value
              documentId: newReturn.id,
              documentType: 'purchase_return',
              employeeId: session!.user?.id,
              employeeName: session!.user?.name || undefined,
              note: `Xuất kho trả hàng cho NCC - ${item.productName || item.productSystemId}`,
            },
          });
        }

        // Update general inventory if exists
        const inventory = await tx.inventory.findFirst({
          where: { productId: resolvedProductSystemId },
        });

        if (inventory) {
          await tx.inventory.update({
            where: { systemId: inventory.systemId },
            data: {
              quantity: { decrement: item.returnQuantity },
            },
          });
        }
      }

      // Update supplier balance - debit for return (they owe us the full return value)
      // Note: Receipt for refund is created separately and will be a positive change to balance
      if (purchaseOrder.supplierId) {
        await tx.supplier.update({
          where: { systemId: purchaseOrder.supplierId },
          data: {
            currentDebt: { decrement: totalReturnValue }, // Reduce debt by full return value
            totalDebt: { decrement: totalReturnValue },
          },
        });
      }

      // Update purchase order return status
      // Calculate if this is partial or full return
      const totalOrdered = purchaseOrder.items.reduce(
        (sum, item) => sum + item.quantity,
        0
      );
      const totalReturned = items.reduce(
        (sum, item) => sum + item.returnQuantity,
        0
      );

      let returnStatus = 'Hoàn hàng một phần';
      if (totalReturned >= totalOrdered) {
        returnStatus = 'Hoàn hàng toàn bộ';
      }

      await tx.purchaseOrder.update({
        where: { systemId: purchaseOrder.systemId },
        data: {
          returnStatus: returnStatus,
        },
      });

      // Log activity to centralized ActivityLog table
      await tx.activityLog.create({
        data: {
          entityType: 'purchase_return',
          entityId: systemId,
          action: 'created',
          actionType: 'create',
          changes: { status: { from: null, to: 'PENDING' } },
          note: `Tạo phiếu trả hàng cho đơn ${purchaseOrder.id}`,
          createdBy: session!.user?.employee?.fullName || session!.user?.name || session!.user?.id || null,
          metadata: { userName: session!.user?.name || 'System' },
        },
      });

      return newReturn;
    });

    // Convert Decimal fields to numbers for serialization
    const serializable = {
      ...purchaseReturn,
      subtotal: Number(purchaseReturn.subtotal),
      total: Number(purchaseReturn.total),
      totalReturnValue: Number(purchaseReturn.totalReturnValue),
      refundAmount: Number(purchaseReturn.refundAmount),
      items: purchaseReturn.items?.map((item: { unitPrice?: unknown; total?: unknown }) => ({
        ...item,
        unitPrice: Number(item.unitPrice ?? 0),
        total: Number(item.total ?? 0),
      })),
    };

    // Sync inventory changes to Meilisearch
    if (items.length > 0) {
      const productSystemIds = items.map((item: { productSystemId: string }) => item.productSystemId);
      syncProductsInventory(productSystemIds).catch(err =>
        logError('[Purchase Returns API] Meilisearch sync failed', err)
      );
    }

    // ✅ Notify PO buyer about purchase return
    if (purchaseOrder.buyerSystemId && purchaseOrder.buyerSystemId !== session!.user?.employeeId) {
      createNotification({
        type: 'purchase_return',
        settingsKey: 'purchase-return:updated',
        title: 'Trả hàng nhà cung cấp',
        message: `Phiếu trả hàng NCC cho đơn ${purchaseOrder.id || purchaseOrderSystemId}${reason ? ` - Lý do: ${reason}` : ''}`,
        link: `/purchase-returns/${purchaseReturn.systemId}`,
        recipientId: purchaseOrder.buyerSystemId,
        senderId: session!.user?.employeeId,
        senderName: session!.user?.name,
      }).catch(e => logError('[Purchase Returns POST] notification failed', e))
    }

    return apiSuccess(serializable, 201);
  } catch (error) {
    logError('[Purchase Returns API] POST error', error);
    return apiError('Không thể tạo phiếu trả hàng nhập', 500);
  }
})
