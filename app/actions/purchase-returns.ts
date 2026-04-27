'use server'

/**
 * Server Actions for Purchase Return Management (Trả hàng NCC)
 * 
 * Schema: PurchaseReturn, PurchaseReturnItem
 * Status: DRAFT, PENDING, APPROVED, COMPLETED, CANCELLED
 * Key fields: 
 *   - PurchaseReturn: total (not totalAmount), status
 *   - PurchaseReturnItem: systemId, returnId, productId, quantity, unitPrice, total, reason
 */

import { prisma } from '@/lib/prisma'
import { revalidatePath } from '@/lib/revalidation'
import { generateNextIds } from '@/lib/id-system'
import { generateIdWithPrefix } from '@/lib/id-generator'
import { requireActionPermission } from '@/lib/api-utils'
import type { ActionResult } from '@/types/action-result'
import { createPurchaseReturnSchema, updatePurchaseReturnSchema } from '@/features/purchase-returns/validation'
import { logError } from '@/lib/logger'
import { getSessionUserName } from '@/lib/get-user-name'
import type { Prisma } from '@/generated/prisma/client'

// Types - Raw Prisma types (may contain Decimal)
type PurchaseReturnRaw = NonNullable<Awaited<ReturnType<typeof prisma.purchaseReturn.findFirst>>>
type PurchaseReturnItemRaw = NonNullable<Awaited<ReturnType<typeof prisma.purchaseReturnItem.findFirst>>>

// Serialized types with Decimal converted to number (safe for Server → Client)
type PurchaseReturn = Omit<PurchaseReturnRaw, 'subtotal' | 'total' | 'totalReturnValue' | 'refundAmount' | 'items'> & {
  subtotal: number;
  total: number;
  totalReturnValue: number;
  refundAmount: number;
  items?: PurchaseReturnItem[];
}

type PurchaseReturnItem = Omit<PurchaseReturnItemRaw, 'unitPrice' | 'total'> & {
  unitPrice: number;
  total: number;
}

// Helper to serialize PurchaseReturnItem - converts Decimal to number
function serializePurchaseReturnItem(item: PurchaseReturnItemRaw): PurchaseReturnItem {
  return {
    ...item,
    unitPrice: Number(item.unitPrice),
    total: Number(item.total),
  };
}

// Helper to serialize PurchaseReturn - converts Decimal to number
function serializePurchaseReturn(pr: PurchaseReturnRaw & { items?: PurchaseReturnItemRaw[] }): PurchaseReturn {
  return {
    ...pr,
    subtotal: Number(pr.subtotal),
    total: Number(pr.total),
    totalReturnValue: Number(pr.totalReturnValue),
    refundAmount: Number(pr.refundAmount),
    items: pr.items?.map(serializePurchaseReturnItem),
  };
}

export type CreatePurchaseReturnInput = {
  supplierId?: string
  supplierSystemId?: string
  supplierName?: string
  branchId?: string
  branchSystemId?: string
  branchName?: string
  purchaseOrderId?: string
  purchaseOrderSystemId?: string
  returnDate: string | Date
  reason?: string
  createdBy?: string
  items?: CreatePurchaseReturnItemInput[]
  totalReturnValue?: number
  refundAmount?: number
  refundMethod?: string
  refundEntries?: Array<{ amount: number; accountSystemId?: string; paymentMethodSystemId?: string }>
  accountSystemId?: string
  creatorName?: string
}

export type CreatePurchaseReturnItemInput = {
  productId: string
  productSystemId?: string
  productName?: string
  quantity?: number
  returnQuantity?: number  // alias for quantity
  orderedQuantity?: number
  unitPrice?: number
  reason?: string
  note?: string
}

export async function createPurchaseReturnAction(
  input: CreatePurchaseReturnInput
): Promise<ActionResult<PurchaseReturn>> {
  try {
    const authResult = await requireActionPermission('create_purchase_returns')
  if (!authResult.success) return authResult
    const session = authResult.session!

    const validated = createPurchaseReturnSchema.safeParse(input)
    if (!validated.success) {
      return { success: false, error: validated.error.issues[0]?.message || 'Dữ liệu không hợp lệ' }
    }

    const { systemId, businessId } = await generateNextIds('purchase-returns')

    // Calculate total from items
    const totalAmount = input.items?.reduce((sum, item) => {
      const qty = item.quantity ?? item.returnQuantity ?? 0
      const itemTotal = qty * (item.unitPrice ?? 0)
      return sum + itemTotal
    }, 0) ?? 0

    // ✅ FIX: Lookup PO to get correct product systemIds and images
    const poItemsMap = new Map<string, { productId: string; productName: string; imageUrl: string | null }>();
    if (input.purchaseOrderSystemId) {
      const po = await prisma.purchaseOrder.findUnique({
        where: { systemId: input.purchaseOrderSystemId },
        include: {
          items: {
            include: {
              product: {
                select: { systemId: true, id: true, name: true, imageUrl: true, thumbnailImage: true }
              }
            }
          }
        }
      });
      if (po) {
        for (const item of po.items) {
          if (item.product) {
            // Map by product.systemId, product.id (SKU), and productId field
            poItemsMap.set(item.product.systemId, {
              productId: item.product.systemId,
              productName: item.product.name,
              imageUrl: item.product.thumbnailImage || item.product.imageUrl
            });
            poItemsMap.set(item.product.id, {
              productId: item.product.systemId,
              productName: item.product.name,
              imageUrl: item.product.thumbnailImage || item.product.imageUrl
            });
            if (item.productId && item.productId !== item.product.systemId) {
              poItemsMap.set(item.productId, {
                productId: item.product.systemId,
                productName: item.product.name,
                imageUrl: item.product.thumbnailImage || item.product.imageUrl
              });
            }
          }
        }
      }
    }

    // ✅ FIX: Resolve correct product systemIds for items
    const resolvedItems = (input.items || []).map(item => {
      const poProduct = poItemsMap.get(item.productSystemId || item.productId || '');
      const resolvedProductId = poProduct?.productId || item.productSystemId || item.productId;
      const qty = item.quantity ?? item.returnQuantity ?? 0;
      return {
        ...item,
        resolvedProductId,
        productName: poProduct?.productName || item.productName || 'Sản phẩm',
        imageUrl: poProduct?.imageUrl || null,
        quantity: qty,
      };
    });

    // ✅ FIX: Use $transaction to create return AND update inventory atomically
    const purchaseReturn = await prisma.$transaction(async (tx) => {
      // Create the purchase return record
      const newReturn = await tx.purchaseReturn.create({
        data: {
          systemId,
          id: businessId,
          supplierId: input.supplierId,
          supplierSystemId: input.supplierSystemId,
          supplierName: input.supplierName,
          branchId: input.branchSystemId || input.branchId,
          branchSystemId: input.branchSystemId || input.branchId,
          branchName: input.branchName,
          purchaseOrderId: input.purchaseOrderId,
          purchaseOrderSystemId: input.purchaseOrderSystemId,
          purchaseOrderBusinessId: input.purchaseOrderId,
          returnDate: new Date(input.returnDate),
          reason: input.reason,
          total: totalAmount,
          totalReturnValue: input.totalReturnValue ?? totalAmount,
          refundAmount: input.refundAmount ?? 0,
          refundMethod: input.refundMethod,
          accountSystemId: input.accountSystemId,
          status: 'COMPLETED', // ✅ Auto-complete - no approval workflow needed
          createdBy: input.createdBy,
          creatorName: input.creatorName,
          // Store items as JSON with correct product info
          returnItems: resolvedItems.map(item => ({
            productSystemId: item.resolvedProductId,
            productId: item.productId,
            productName: item.productName,
            orderedQuantity: item.orderedQuantity || 0,
            returnQuantity: item.quantity,
            unitPrice: item.unitPrice ?? 0,
            note: item.note || item.reason || null,
            imageUrl: item.imageUrl,
          })),
          // Create individual item records for relational queries
          items: resolvedItems.length ? {
            create: await Promise.all(resolvedItems.map(async (item) => ({
              systemId: await generateIdWithPrefix('RTNI'),
              productId: item.resolvedProductId,
              quantity: item.quantity,
              unitPrice: item.unitPrice ?? 0,
              total: item.quantity * (item.unitPrice ?? 0),
              reason: item.note || item.reason,
            }))),
          } : undefined,
        },
        include: { items: true },
      });

      // ✅ FIX: Deduct inventory and create stock history at creation time
      const branchId = input.branchSystemId || input.branchId;
      if (branchId && resolvedItems.length > 0) {
        for (const item of resolvedItems) {
          const productId = item.resolvedProductId;
          if (!productId) continue;

          // Get current inventory
          const productInventory = await tx.productInventory.findUnique({
            where: {
              productId_branchId: {
                productId,
                branchId,
              },
            },
          });
          const currentStock = productInventory?.onHand || 0;
          const newStock = currentStock - item.quantity;

          // Update ProductInventory
          await tx.productInventory.upsert({
            where: {
              productId_branchId: {
                productId,
                branchId,
              },
            },
            update: {
              onHand: { decrement: item.quantity },
            },
            create: {
              productId,
              branchId,
              onHand: -item.quantity, // Allow negative for returns without prior stock
              committed: 0,
              inTransit: 0,
              inDelivery: 0,
            },
          });

          // Create StockHistory record
          await tx.stockHistory.create({
            data: {
              productId,
              branchId,
              action: 'Xuất kho trả NCC',
              source: 'Phiếu trả hàng nhập',
              quantityChange: -item.quantity,
              newStockLevel: newStock,
              documentId: businessId,
              documentType: 'purchase_return',
              employeeId: input.createdBy,
              employeeName: input.creatorName || undefined,
              note: `Xuất kho trả hàng cho NCC - ${item.productName}`,
            },
          });
        }
      }

      return newReturn;
    });

    const userName = getSessionUserName(session)
    prisma.activityLog.create({
      data: {
        entityType: 'PurchaseReturn',
        entityId: purchaseReturn.systemId,
        action: 'CREATE',
        note: `Tạo phiếu trả hàng nhập ${purchaseReturn.id}`,
        changes: { supplierId: purchaseReturn.supplierId, total: Number(purchaseReturn.total) } as unknown as Prisma.InputJsonValue,
        createdBy: userName,
      },
    }).catch(e => logError('Activity log failed', e))

    revalidatePath('/purchase-returns')
    revalidatePath('/products')
    revalidatePath('/inventory')
    return { success: true, data: serializePurchaseReturn(purchaseReturn) }
  } catch (error) {
    logError('Error creating purchase return', error)
    return {
      success: false,
      error: 'Không thể tạo phiếu trả hàng nhập',
    }
  }
}

export async function updatePurchaseReturnAction(
  systemId: string,
  input: Partial<CreatePurchaseReturnInput>
): Promise<ActionResult<PurchaseReturn>> {
  try {
    const authResult = await requireActionPermission('edit_purchase_returns')
  if (!authResult.success) return authResult
    const session = authResult.session!

    const validated = updatePurchaseReturnSchema.safeParse(input)
    if (!validated.success) {
      return { success: false, error: validated.error.issues[0]?.message || 'Dữ liệu không hợp lệ' }
    }

    const existing = await prisma.purchaseReturn.findUnique({
      where: { systemId },
    })

    if (!existing) {
      return { success: false, error: 'Không tìm thấy phiếu trả hàng nhập' }
    }

    if (existing.status !== 'DRAFT') {
      return {
        success: false,
        error: 'Chỉ có thể cập nhật phiếu trả hàng nhập ở trạng thái Nháp',
      }
    }

    const purchaseReturn = await prisma.purchaseReturn.update({
      where: { systemId },
      data: {
        supplierId: input.supplierId,
        supplierSystemId: input.supplierSystemId,
        supplierName: input.supplierName,
        branchId: input.branchId,
        branchSystemId: input.branchSystemId,
        branchName: input.branchName,
        purchaseOrderId: input.purchaseOrderId,
        purchaseOrderSystemId: input.purchaseOrderSystemId,
        returnDate: input.returnDate ? new Date(input.returnDate) : undefined,
        reason: input.reason,
      },
      include: { items: true },
    })

    const userName = getSessionUserName(session)
    prisma.activityLog.create({
      data: {
        entityType: 'PurchaseReturn',
        entityId: systemId,
        action: 'UPDATE',
        note: `Cập nhật phiếu trả hàng nhập ${existing.id}`,
        changes: input as unknown as Prisma.InputJsonValue,
        createdBy: userName,
      },
    }).catch(e => logError('Activity log failed', e))

    revalidatePath('/purchase-returns')
    revalidatePath(`/purchase-returns/${systemId}`)
    return { success: true, data: serializePurchaseReturn(purchaseReturn) }
  } catch (error) {
    logError('Error updating purchase return', error)
    return {
      success: false,
      error: 'Không thể cập nhật phiếu trả hàng nhập',
    }
  }
}

export async function deletePurchaseReturnAction(
  systemId: string
): Promise<ActionResult<PurchaseReturn>> {
  try {
    const authResult = await requireActionPermission('delete_purchase_returns')
  if (!authResult.success) return authResult
    const session = authResult.session!

    const existing = await prisma.purchaseReturn.findUnique({
      where: { systemId },
    })

    if (!existing) {
      return { success: false, error: 'Không tìm thấy phiếu trả hàng nhập' }
    }

    if (existing.status !== 'DRAFT') {
      return {
        success: false,
        error: 'Chỉ có thể xóa phiếu trả hàng nhập ở trạng thái Nháp',
      }
    }

    // Delete items first (cascade should handle this but being explicit)
    await prisma.purchaseReturnItem.deleteMany({
      where: { returnId: systemId },
    })

    const purchaseReturn = await prisma.purchaseReturn.delete({
      where: { systemId },
    })

    const userName = getSessionUserName(session)
    prisma.activityLog.create({
      data: {
        entityType: 'PurchaseReturn',
        entityId: systemId,
        action: 'DELETE',
        note: `Xóa phiếu trả hàng nhập ${existing.id}`,
        createdBy: userName,
      },
    }).catch(e => logError('Activity log failed', e))

    revalidatePath('/purchase-returns')
    return { success: true, data: serializePurchaseReturn(purchaseReturn) }
  } catch (error) {
    logError('Error deleting purchase return', error)
    return {
      success: false,
      error: 'Không thể xóa phiếu trả hàng nhập',
    }
  }
}

export async function approvePurchaseReturnAction(
  systemId: string,
  approvedBy: string
): Promise<ActionResult<PurchaseReturn>> {
  try {
    const authResult = await requireActionPermission('approve_purchase_returns')
  if (!authResult.success) return authResult
    const session = authResult.session!

    const existing = await prisma.purchaseReturn.findUnique({
      where: { systemId },
      include: { items: true },
    })

    if (!existing) {
      return { success: false, error: 'Không tìm thấy phiếu trả hàng nhập' }
    }

    if (existing.status !== 'DRAFT' && existing.status !== 'PENDING') {
      return {
        success: false,
        error: 'Chỉ có thể duyệt phiếu trả hàng nhập ở trạng thái Nháp hoặc Chờ duyệt',
      }
    }

    if (!existing.items.length) {
      return {
        success: false,
        error: 'Phiếu trả hàng nhập phải có ít nhất một sản phẩm',
      }
    }

    // ✅ FIX: Only deduct inventory if status is DRAFT (old code path)
    // When status is PENDING, inventory was already deducted at creation time
    if (existing.status === 'DRAFT') {
      // Deduct inventory for returned items (legacy DRAFT returns)
      for (const item of existing.items) {
        if (item.productId && existing.branchId) {
          const inventory = await prisma.productInventory.findUnique({
            where: {
              productId_branchId: {
                productId: item.productId,
                branchId: existing.branchId,
              },
            },
          })

          if (inventory) {
            const newQuantity = Math.max(0, Number(inventory.onHand) - Number(item.quantity))
            await prisma.productInventory.update({
              where: {
                productId_branchId: {
                  productId: item.productId,
                  branchId: existing.branchId,
                },
              },
              data: { onHand: newQuantity },
            })
          }
        }
      }
    }
    // When status is PENDING, inventory was already deducted at creation - skip

    // Update supplier debt if applicable
    if (existing.supplierId && existing.total) {
      const supplier = await prisma.supplier.findUnique({
        where: { systemId: existing.supplierId },
      })

      if (supplier) {
        const currentDebt = Number(supplier.currentDebt ?? 0)
        const returnAmount = Number(existing.total)
        await prisma.supplier.update({
          where: { systemId: existing.supplierId },
          data: { currentDebt: currentDebt - returnAmount },
        })
      }
    }

    const purchaseReturn = await prisma.purchaseReturn.update({
      where: { systemId },
      data: {
        status: 'APPROVED',
        updatedBy: approvedBy,
      },
      include: { items: true },
    })

    const userName = getSessionUserName(session)
    prisma.activityLog.create({
      data: {
        entityType: 'PurchaseReturn',
        entityId: systemId,
        action: 'APPROVE',
        note: `Duyệt phiếu trả hàng nhập ${existing.id}`,
        createdBy: userName,
      },
    }).catch(e => logError('Activity log failed', e))

    revalidatePath('/purchase-returns')
    revalidatePath(`/purchase-returns/${systemId}`)
    revalidatePath('/products')
    revalidatePath('/suppliers')
    return { success: true, data: serializePurchaseReturn(purchaseReturn) }
  } catch (error) {
    logError('Error approving purchase return', error)
    return {
      success: false,
      error: 'Không thể duyệt phiếu trả hàng nhập',
    }
  }
}
