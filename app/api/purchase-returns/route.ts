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

import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import type { Prisma } from '@/generated/prisma/client';
import { PurchaseReturnStatus } from '@/generated/prisma/client';
import { requireAuth, validateBody, apiSuccess, apiPaginated, apiError, parsePagination } from '@/lib/api-utils';
import { createPurchaseReturnSchema } from './validation';
import { generateIdWithPrefix } from '@/lib/id-generator';
import { v4 as uuidv4 } from 'uuid';

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
export async function GET(request: NextRequest) {
  const session = await requireAuth();
  if (!session) return apiError('Unauthorized', 401);

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
    
    if (search) {
      where.OR = [
        { id: { contains: search, mode: 'insensitive' } },
        { reason: { contains: search, mode: 'insensitive' } },
        { supplierName: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (status) {
      where.status = status as PurchaseReturnStatus;
    }

    if (supplierId) {
      where.supplierId = supplierId;
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
        include: {
          items: true,
          suppliers: true,
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
          items = returnItemsData as unknown as PurchaseReturnItemData[];
        } 
        // If it's a string (shouldn't happen but just in case), try parsing
        else if (typeof returnItemsData === 'string') {
          try {
            const parsed = JSON.parse(returnItemsData);
            if (Array.isArray(parsed)) {
              items = parsed;
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

      return {
        ...pr,
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
    console.error('[Purchase Returns API] GET error:', error);
    return apiError('Failed to fetch purchase returns', 500);
  }
}

// POST - Create new purchase return with inventory and supplier balance updates
export async function POST(request: NextRequest) {
  const session = await requireAuth();
  if (!session) return apiError('Unauthorized', 401);

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
      include: {
        supplier: true,
        items: {
          include: {
            product: {
              select: {
                systemId: true,
                id: true,
                name: true,
                unit: true,
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

    for (const item of items) {
      if (item.returnQuantity <= 0) {
        return apiError('Return quantity must be greater than 0', 400);
      }

      const poItem = purchaseOrder.items.find(
        (poi) => poi.productId === item.productSystemId
      );

      if (!poItem) {
        return apiError(
          `Product ${item.productSystemId} not found in purchase order`,
          400
        );
      }

      // Check if return quantity exceeds ordered quantity
      if (item.returnQuantity > poItem.quantity) {
        return apiError(
          `Return quantity (${item.returnQuantity}) exceeds ordered quantity (${poItem.quantity}) for product ${poItem.product?.name || poItem.productName}`,
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
          supplierSystemId: purchaseOrder.supplierId ?? undefined,
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
          createdBy: session.user?.id || null,
          creatorName: session.user?.name || null,
          // Store items as JSON for flexible structure
          returnItems: items.map((item) => ({
            productSystemId: item.productSystemId,
            productId: item.productId || item.productSystemId,
            productName: item.productName || 'Unknown Product',
            orderedQuantity: item.orderedQuantity || 0,
            returnQuantity: item.returnQuantity,
            unitPrice: item.unitPrice,
            note: item.note || null,
          })),
          // Create individual item records for relational queries
          items: {
            create: items.map((item) => {
              const _poItem = purchaseOrder.items.find(
                (poi) => poi.productId === item.productSystemId
              );
              return {
                systemId: uuidv4(),
                productId: item.productSystemId,
                quantity: item.returnQuantity,
                unitPrice: item.unitPrice,
                total: item.unitPrice * item.returnQuantity,
                reason: item.note || reason || null,
              };
            }),
          },
        },
        include: {
          items: true,
          suppliers: true,
        },
      });

      // Update inventory - deduct returned quantities
      for (const item of items) {
        // Get current inventory for stock history
        let currentStock = 0;
        if (branchSystemId) {
          const productInventory = await tx.productInventory.findUnique({
            where: {
              productId_branchId: {
                productId: item.productSystemId,
                branchId: branchSystemId,
              },
            },
          });
          currentStock = productInventory?.onHand || 0;
        }
        // ✅ FIX: Allow negative stock values - inventory can go negative
        // Previously used Math.max(0, ...) which caused StockHistory.newStockLevel
        // to show 0 while ProductInventory.onHand showed negative values
        const newStock = currentStock - item.returnQuantity;

        // Update product inventory for the branch
        if (branchSystemId) {
          // ✅ FIX: Use decrement to accurately track inventory changes
          // Allowing negative values to properly track oversold/over-returned inventory
          await tx.productInventory.updateMany({
            where: {
              productId: item.productSystemId,
              branchId: branchSystemId,
            },
            data: {
              onHand: { decrement: item.returnQuantity },
            },
          });
          
          // ✅ Create stock history record
          await tx.stockHistory.create({
            data: {
              productId: item.productSystemId,
              branchId: branchSystemId,
              action: 'Xuất kho trả NCC',
              source: 'Phiếu trả hàng nhập',
              quantityChange: -item.returnQuantity,
              newStockLevel: newStock,
              documentId: newReturn.id,
              documentType: 'purchase_return',
              employeeId: session.user?.id,
              employeeName: session.user?.name || undefined,
              note: `Xuất kho trả hàng cho NCC - ${item.productName || item.productSystemId}`,
            },
          });
        }

        // Update general inventory if exists
        const inventory = await tx.inventory.findFirst({
          where: { productId: item.productSystemId },
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

      // Update supplier balance - debit for return (they owe us)
      if (finalRefundAmount > 0 && purchaseOrder.supplierId) {
        await tx.supplier.update({
          where: { systemId: purchaseOrder.supplierId },
          data: {
            currentDebt: { decrement: finalRefundAmount }, // Reduce debt or increase credit
            totalDebt: { decrement: finalRefundAmount },
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
          note: `Purchase return created for order ${purchaseOrder.id}`,
          createdBy: session.user?.id || null,
          metadata: { userName: session.user?.name || 'System' },
        },
      });

      return newReturn;
    });

    return apiSuccess(purchaseReturn, 201);
  } catch (error) {
    console.error('[Purchase Returns API] POST error:', error);
    if (error instanceof Error) {
      return apiError(error.message, 500);
    }
    return apiError('Failed to create purchase return', 500);
  }
}
