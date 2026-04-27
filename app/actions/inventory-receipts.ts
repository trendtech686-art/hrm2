'use server'

/**
 * Server Actions for Inventory Receipt Management (Phiếu nhập kho)
 */

import { prisma } from '@/lib/prisma'
import { revalidatePath } from '@/lib/revalidation'
import { generateNextIdsWithTx } from '@/lib/id-system'
import { requireActionPermission, serializeDecimals } from '@/lib/api-utils'
import type { ActionResult } from '@/types/action-result'
import { createInventoryReceiptSchema, updateInventoryReceiptSchema, inventoryReceiptItemSchema } from '@/features/inventory-receipts/validation'
import { logError } from '@/lib/logger'
import { getSessionUserName } from '@/lib/get-user-name'
import type { Prisma } from '@/generated/prisma/client'

// Types
type InventoryReceipt = NonNullable<Awaited<ReturnType<typeof prisma.inventoryReceipt.findFirst>>>
type InventoryReceiptItem = NonNullable<Awaited<ReturnType<typeof prisma.inventoryReceiptItem.findFirst>>>

export type CreateInventoryReceiptInput = {
  type: 'PURCHASE' | 'TRANSFER_IN' | 'RETURN' | 'ADJUSTMENT' | 'OTHER'
  branchId: string
  branchSystemId?: string
  branchName?: string
  supplierSystemId?: string
  supplierName?: string
  purchaseOrderId?: string
  purchaseOrderSystemId?: string
  referenceType?: string
  referenceId?: string
  receiptDate?: string | Date
  notes?: string
  createdBy?: string
  receiverName?: string      // Who received the goods
  receiverSystemId?: string  // Receiver's systemId
  items?: CreateInventoryReceiptItemInput[]
}

export type CreateInventoryReceiptItemInput = {
  productId: string
  productSku?: string
  productName?: string
  quantity: number
  unitCost?: number
  totalCost?: number
}

export type UpdateInventoryReceiptInput = {
  systemId: string
  receiptDate?: string | Date
  notes?: string
  updatedBy?: string
}

// ====================================
// ACTIONS
// ====================================

export async function createInventoryReceiptAction(
  input: CreateInventoryReceiptInput
): Promise<ActionResult<InventoryReceipt>> {
  const authResult = await requireActionPermission('create_inventory')
  if (!authResult.success) return authResult
  const { session } = authResult

  const validated = createInventoryReceiptSchema.safeParse(input)
  if (!validated.success) {
    return { success: false, error: validated.error.issues[0]?.message || 'Dữ liệu không hợp lệ' }
  }

  try {
    const branchId = input.branchId || input.branchSystemId || '';
    const createdByName = input.createdBy || session.user?.name || session.user?.email || 'Unknown';
    // receiverName: who received the goods, fallback to createdByName
    const receiverName = input.receiverName || createdByName;
    
    const result = await prisma.$transaction(async (tx) => {
      // Generate IDs using unified ID system (queries MAX from actual table)
      const { systemId, businessId } = await generateNextIdsWithTx(
        tx,
        'inventory-receipts',
        undefined
      );

      const inventoryReceipt = await tx.inventoryReceipt.create({
        data: {
          systemId,
          id: businessId,
          type: input.type,
          branchId: branchId,
          branchSystemId: input.branchSystemId,
          branchName: input.branchName,
          supplierSystemId: input.supplierSystemId,
          supplierName: input.supplierName,
          purchaseOrderId: input.purchaseOrderId,
          purchaseOrderSystemId: input.purchaseOrderSystemId,
          referenceType: input.referenceType,
          referenceId: input.referenceId,
          receiptDate: input.receiptDate ? new Date(input.receiptDate) : new Date(),
          receivedDate: input.receiptDate ? new Date(input.receiptDate) : new Date(),
          notes: input.notes,
          status: 'CONFIRMED', // Use CONFIRMED as the receipt is complete
          createdBy: createdByName,
          receiverName: receiverName,
          receiverSystemId: input.receiverSystemId,
          items: input.items?.length ? {
            create: input.items.map((item) => ({
              productId: item.productId,
              productSku: item.productSku || '',
              productName: item.productName || '',
              quantity: item.quantity,
              unitCost: item.unitCost ?? 0,
              totalCost: item.totalCost ?? (item.quantity * (item.unitCost ?? 0)),
            })),
          } : undefined,
        },
        include: { items: true },
      });

      // Process stock updates for each item
      if (input.items?.length && branchId) {
        for (const item of input.items) {
          const productSystemId = item.productId;
          const quantity = item.quantity;
          const unitCost = item.unitCost ?? 0;
          
          // Get current inventory
          const inventory = await tx.productInventory.findUnique({
            where: {
              productId_branchId: {
                productId: productSystemId,
                branchId: branchId,
              },
            },
          });

          const oldStock = inventory?.onHand || 0;
          const newStock = oldStock + quantity;

          // Update ProductInventory
          await tx.productInventory.upsert({
            where: {
              productId_branchId: {
                productId: productSystemId,
                branchId: branchId,
              },
            },
            update: {
              onHand: { increment: quantity },
              updatedAt: new Date(),
            },
            create: {
              productId: productSystemId,
              branchId: branchId,
              onHand: quantity,
              committed: 0,
              inTransit: 0,
              inDelivery: 0,
            },
          });

          // Create StockHistory
          await tx.stockHistory.create({
            data: {
              productId: productSystemId,
              branchId: branchId,
              action: 'Nhập kho',
              source: 'Phiếu nhập kho',
              quantityChange: quantity,
              newStockLevel: newStock,
              documentId: businessId,
              documentType: 'inventory_receipt',
              employeeName: createdByName,
              note: `Nhập kho từ đơn hàng ${input.purchaseOrderId || ''}`,
            },
          });

          // Update Product costPrice and lastPurchasePrice
          if (unitCost > 0) {
            await tx.product.update({
              where: { systemId: productSystemId },
              data: {
                lastPurchasePrice: unitCost,
                lastPurchaseDate: new Date(),
                costPrice: unitCost, // Update cost price to latest purchase price
              },
            });
          } else {
            // Just update lastPurchaseDate
            await tx.product.update({
              where: { systemId: productSystemId },
              data: {
                lastPurchaseDate: new Date(),
              },
            });
          }
        }
      }

      // ✅ Update supplier debt when receiving goods from a supplier
      // Nhập hàng = tăng công nợ phải trả nhà cung cấp
      if (input.supplierSystemId) {
        const totalAmount = input.items?.reduce(
          (sum, item) => sum + (item.totalCost ?? item.quantity * (item.unitCost ?? 0)),
          0
        ) || 0;
        
        if (totalAmount > 0) {
          await tx.supplier.update({
            where: { systemId: input.supplierSystemId },
            data: {
              currentDebt: { increment: totalAmount },
            },
          });
        }
      }

      return inventoryReceipt;
    });

    // Serialize Decimal fields to plain numbers for Client Components
    const serializedResult = {
      ...result,
      items: result.items.map(item => ({
        ...item,
        unitCost: Number(item.unitCost),
        totalCost: Number(item.totalCost),
      })),
    };

    const userName = getSessionUserName(session)
    prisma.activityLog.create({
      data: {
        entityType: 'InventoryReceipt',
        entityId: result.systemId,
        action: 'CREATE',
        note: `Tạo phiếu nhập kho ${result.id}`,
        changes: { type: result.type, branchId: result.branchId, supplierSystemId: result.supplierSystemId } as unknown as Prisma.InputJsonValue,
        createdBy: userName,
      },
    }).catch(e => logError('Activity log failed', e))

    revalidatePath('/inventory-receipts')
    return { success: true, data: serializedResult as unknown as typeof result }
  } catch (error) {
    logError('Error creating inventory receipt', error)
    return {
      success: false,
      error: 'Không thể tạo phiếu nhập kho',
    }
  }
}

export async function updateInventoryReceiptAction(
  input: UpdateInventoryReceiptInput
): Promise<ActionResult<InventoryReceipt>> {
  const authResult = await requireActionPermission('edit_inventory')
  if (!authResult.success) return authResult
  const session = authResult.session!

  const validated = updateInventoryReceiptSchema.safeParse(input)
  if (!validated.success) {
    return { success: false, error: validated.error.issues[0]?.message || 'Dữ liệu không hợp lệ' }
  }

  try {
    const { systemId, ...data } = input

    const existing = await prisma.inventoryReceipt.findUnique({
      where: { systemId },
    })

    if (!existing) {
      return { success: false, error: 'Không tìm thấy phiếu nhập kho' }
    }

    if (existing.status !== 'DRAFT') {
      return {
        success: false,
        error: 'Chỉ có thể cập nhật phiếu nhập kho ở trạng thái Nháp',
      }
    }

    const updateData: Record<string, unknown> = {}
    
    if (data.receiptDate !== undefined) updateData.receiptDate = new Date(data.receiptDate)
    if (data.notes !== undefined) updateData.notes = data.notes
    if (data.updatedBy !== undefined) updateData.updatedBy = data.updatedBy

    const inventoryReceipt = await prisma.inventoryReceipt.update({
      where: { systemId },
      data: updateData,
      include: { items: true },
    })

    const userName = getSessionUserName(session)
    prisma.activityLog.create({
      data: {
        entityType: 'InventoryReceipt',
        entityId: systemId,
        action: 'UPDATE',
        note: `Cập nhật phiếu nhập kho ${existing.id}`,
        changes: data as unknown as Prisma.InputJsonValue,
        createdBy: userName,
      },
    }).catch(e => logError('Activity log failed', e))

    revalidatePath('/inventory-receipts')
    revalidatePath(`/inventory-receipts/${systemId}`)
    return { success: true, data: serializeDecimals(inventoryReceipt) }
  } catch (error) {
    logError('Error updating inventory receipt', error)
    return {
      success: false,
      error: 'Không thể cập nhật phiếu nhập kho',
    }
  }
}

export async function deleteInventoryReceiptAction(
  systemId: string
): Promise<ActionResult<InventoryReceipt>> {
  const authResult = await requireActionPermission('delete_inventory')
  if (!authResult.success) return authResult
  const session = authResult.session!
  try {
    const existing = await prisma.inventoryReceipt.findUnique({
      where: { systemId },
    })

    if (!existing) {
      return { success: false, error: 'Không tìm thấy phiếu nhập kho' }
    }

    if (existing.status !== 'DRAFT') {
      return {
        success: false,
        error: 'Chỉ có thể xóa phiếu nhập kho ở trạng thái Nháp',
      }
    }

    // Delete items first
    await prisma.inventoryReceiptItem.deleteMany({
      where: { receiptId: systemId },
    })

    const inventoryReceipt = await prisma.inventoryReceipt.delete({
      where: { systemId },
    })

    const userName = getSessionUserName(session)
    prisma.activityLog.create({
      data: {
        entityType: 'InventoryReceipt',
        entityId: systemId,
        action: 'DELETE',
        note: `Xóa phiếu nhập kho ${existing.id}`,
        createdBy: userName,
      },
    }).catch(e => logError('Activity log failed', e))

    revalidatePath('/inventory-receipts')
    return { success: true, data: serializeDecimals(inventoryReceipt) }
  } catch (error) {
    logError('Error deleting inventory receipt', error)
    return {
      success: false,
      error: 'Không thể xóa phiếu nhập kho',
    }
  }
}

export async function getInventoryReceiptAction(
  systemId: string
): Promise<ActionResult<InventoryReceipt>> {
  const authResult = await requireActionPermission('view_inventory')
  if (!authResult.success) return authResult
  try {
    const inventoryReceipt = await prisma.inventoryReceipt.findUnique({
      where: { systemId },
      include: {
        items: true,
      },
    })

    if (!inventoryReceipt) {
      return { success: false, error: 'Không tìm thấy phiếu nhập kho' }
    }

    return { success: true, data: serializeDecimals(inventoryReceipt) }
  } catch (error) {
    logError('Error getting inventory receipt', error)
    return {
      success: false,
      error: 'Không tìm thấy phiếu nhập kho',
    }
  }
}

export async function addInventoryReceiptItemAction(
  inventoryReceiptId: string,
  item: CreateInventoryReceiptItemInput
): Promise<ActionResult<InventoryReceiptItem>> {
  const authResult = await requireActionPermission('edit_inventory')
  if (!authResult.success) return authResult

  const validated = inventoryReceiptItemSchema.safeParse(item)
  if (!validated.success) {
    return { success: false, error: validated.error.issues[0]?.message || 'Dữ liệu không hợp lệ' }
  }

  try {
    const inventoryReceipt = await prisma.inventoryReceipt.findUnique({
      where: { systemId: inventoryReceiptId },
      include: { items: true },
    })

    if (!inventoryReceipt) {
      return { success: false, error: 'Không tìm thấy phiếu nhập kho' }
    }

    if (inventoryReceipt.status !== 'DRAFT') {
      return {
        success: false,
        error: 'Chỉ có thể thêm mục vào phiếu nhập kho ở trạng thái Nháp',
      }
    }

    const newItem = await prisma.inventoryReceiptItem.create({
      data: {
        receiptId: inventoryReceiptId,
        productId: item.productId,
        productSku: item.productSku || '',
        productName: item.productName || '',
        quantity: item.quantity,
        unitCost: item.unitCost ?? 0,
        totalCost: item.totalCost ?? (item.quantity * (item.unitCost ?? 0)),
      },
    })

    revalidatePath('/inventory-receipts')
    revalidatePath(`/inventory-receipts/${inventoryReceiptId}`)
    return { success: true, data: serializeDecimals(newItem) }
  } catch (error) {
    logError('Error adding inventory receipt item', error)
    return {
      success: false,
      error: 'Không thể thêm mục vào phiếu nhập kho',
    }
  }
}

export async function updateInventoryReceiptItemAction(
  itemId: string,
  data: Partial<CreateInventoryReceiptItemInput>
): Promise<ActionResult<InventoryReceiptItem>> {
  const authResult = await requireActionPermission('edit_inventory')
  if (!authResult.success) return authResult

  const validated = inventoryReceiptItemSchema.partial().safeParse(data)
  if (!validated.success) {
    return { success: false, error: validated.error.issues[0]?.message || 'Dữ liệu không hợp lệ' }
  }

  try {
    const item = await prisma.inventoryReceiptItem.findUnique({
      where: { systemId: itemId },
      include: { inventoryReceipt: true },
    })

    if (!item) {
      return { success: false, error: 'Không tìm thấy mục phiếu nhập kho' }
    }

    if (item.inventoryReceipt.status !== 'DRAFT') {
      return {
        success: false,
        error: 'Chỉ có thể cập nhật mục phiếu nhập kho ở trạng thái Nháp',
      }
    }

    const updateData: Record<string, unknown> = {}
    
    if (data.quantity !== undefined) updateData.quantity = data.quantity
    if (data.unitCost !== undefined) updateData.unitCost = data.unitCost

    // Recalculate total cost
    const quantity = data.quantity ?? Number(item.quantity)
    const unitCost = data.unitCost ?? Number(item.unitCost ?? 0)
    updateData.totalCost = quantity * unitCost

    const updatedItem = await prisma.inventoryReceiptItem.update({
      where: { systemId: itemId },
      data: updateData,
    })

    revalidatePath('/inventory-receipts')
    revalidatePath(`/inventory-receipts/${item.receiptId}`)
    return { success: true, data: serializeDecimals(updatedItem) }
  } catch (error) {
    logError('Error updating inventory receipt item', error)
    return {
      success: false,
      error: 'Không thể cập nhật mục phiếu nhập kho',
    }
  }
}

export async function removeInventoryReceiptItemAction(
  itemId: string
): Promise<ActionResult<InventoryReceiptItem>> {
  const authResult = await requireActionPermission('edit_inventory')
  if (!authResult.success) return authResult
  try {
    const item = await prisma.inventoryReceiptItem.findUnique({
      where: { systemId: itemId },
      include: { inventoryReceipt: true },
    })

    if (!item) {
      return { success: false, error: 'Không tìm thấy mục phiếu nhập kho' }
    }

    if (item.inventoryReceipt.status !== 'DRAFT') {
      return {
        success: false,
        error: 'Chỉ có thể xóa mục phiếu nhập kho ở trạng thái Nháp',
      }
    }

    const deletedItem = await prisma.inventoryReceiptItem.delete({
      where: { systemId: itemId },
    })

    revalidatePath('/inventory-receipts')
    revalidatePath(`/inventory-receipts/${item.receiptId}`)
    return { success: true, data: serializeDecimals(deletedItem) }
  } catch (error) {
    logError('Error removing inventory receipt item', error)
    return {
      success: false,
      error: 'Không thể xóa mục phiếu nhập kho',
    }
  }
}

export async function confirmInventoryReceiptAction(
  systemId: string,
  _confirmedBy: string
): Promise<ActionResult<InventoryReceipt>> {
  const authResult = await requireActionPermission('approve_inventory')
  if (!authResult.success) return authResult
  const session = authResult.session!
  try {
    const existing = await prisma.inventoryReceipt.findUnique({
      where: { systemId },
      include: { items: true },
    })

    if (!existing) {
      return { success: false, error: 'Không tìm thấy phiếu nhập kho' }
    }

    if (existing.status !== 'DRAFT') {
      return {
        success: false,
        error: 'Chỉ có thể xác nhận phiếu nhập kho ở trạng thái Nháp',
      }
    }

    if (!existing.items.length) {
      return {
        success: false,
        error: 'Phiếu nhập kho phải có ít nhất một mục',
      }
    }

    // Update product inventory
    for (const item of existing.items) {
      if (item.productId) {
        // Find or create inventory for this product and branch
        const inventory = await prisma.productInventory.findFirst({
          where: {
            productId: item.productId,
            branchId: existing.branchId!,
          },
        })

        if (inventory) {
          await prisma.productInventory.update({
            where: { 
              productId_branchId: {
                productId: inventory.productId,
                branchId: inventory.branchId,
              }
            },
            data: { onHand: Number(inventory.onHand) + Number(item.quantity) },
          })
        } else {
          await prisma.productInventory.create({
            data: {
              productId: item.productId,
              branchId: existing.branchId!,
              onHand: Number(item.quantity),
            },
          })
        }
      }
    }

    const inventoryReceipt = await prisma.inventoryReceipt.update({
      where: { systemId },
      data: {
        status: 'CONFIRMED',
      },
      include: { items: true },
    })

    // Sync: increment supplier debt when confirming DRAFT receipt
    if (existing.supplierSystemId) {
      const totalAmount = existing.items.reduce(
        (sum: number, item: { quantity: unknown; unitCost: unknown; totalCost: unknown }) =>
          sum + (Number(item.totalCost) || Number(item.quantity) * Number(item.unitCost) || 0),
        0
      )
      if (totalAmount > 0) {
        await prisma.supplier.update({
          where: { systemId: existing.supplierSystemId },
          data: {
            currentDebt: { increment: totalAmount },
          },
        })
      }
    }

    const userName = getSessionUserName(session)
    prisma.activityLog.create({
      data: {
        entityType: 'InventoryReceipt',
        entityId: systemId,
        action: 'CONFIRM',
        note: `Xác nhận phiếu nhập kho ${existing.id}`,
        createdBy: userName,
      },
    }).catch(e => logError('Activity log failed', e))

    revalidatePath('/inventory-receipts')
    revalidatePath(`/inventory-receipts/${systemId}`)
    revalidatePath('/products')
    return { success: true, data: serializeDecimals(inventoryReceipt) }
  } catch (error) {
    logError('Error confirming inventory receipt', error)
    return {
      success: false,
      error: 'Không thể xác nhận phiếu nhập kho',
    }
  }
}

export async function cancelInventoryReceiptAction(
  systemId: string
): Promise<ActionResult<InventoryReceipt>> {
  const authResult = await requireActionPermission('edit_inventory')
  if (!authResult.success) return authResult
  const session = authResult.session!
  try {
    const existing = await prisma.inventoryReceipt.findUnique({
      where: { systemId },
    })

    if (!existing) {
      return { success: false, error: 'Không tìm thấy phiếu nhập kho' }
    }

    if (existing.status !== 'DRAFT') {
      return {
        success: false,
        error: 'Chỉ có thể hủy phiếu nhập kho ở trạng thái Nháp',
      }
    }

    const inventoryReceipt = await prisma.inventoryReceipt.update({
      where: { systemId },
      data: { status: 'CANCELLED' },
    })

    const userName = getSessionUserName(session)
    prisma.activityLog.create({
      data: {
        entityType: 'InventoryReceipt',
        entityId: systemId,
        action: 'CANCEL',
        note: `Hủy phiếu nhập kho ${existing.id}`,
        createdBy: userName,
      },
    }).catch(e => logError('Activity log failed', e))

    revalidatePath('/inventory-receipts')
    revalidatePath(`/inventory-receipts/${systemId}`)
    return { success: true, data: serializeDecimals(inventoryReceipt) }
  } catch (error) {
    logError('Error cancelling inventory receipt', error)
    return {
      success: false,
      error: 'Không thể hủy phiếu nhập kho',
    }
  }
}
