'use server'

/**
 * Server Actions for Inventory Receipt Management (Phiếu nhập kho)
 */

import { prisma } from '@/lib/prisma'
import { revalidatePath } from '@/lib/revalidation'
import { generateIdWithPrefix } from '@/lib/id-generator'
import { auth } from '@/auth'
import type { ActionResult } from '@/types/action-result'
import { createInventoryReceiptSchema, updateInventoryReceiptSchema, inventoryReceiptItemSchema } from '@/features/inventory-receipts/validation'

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
  const session = await auth()
  if (!session?.user) {
    return { success: false, error: 'Chưa đăng nhập' }
  }

  const validated = createInventoryReceiptSchema.safeParse(input)
  if (!validated.success) {
    return { success: false, error: validated.error.issues[0]?.message || 'Dữ liệu không hợp lệ' }
  }

  try {
    const systemId = await generateIdWithPrefix('NK', prisma)

    const inventoryReceipt = await prisma.inventoryReceipt.create({
      data: {
        systemId,
        id: systemId,
        type: input.type,
        branchId: input.branchId,
        branchSystemId: input.branchSystemId,
        branchName: input.branchName,
        supplierSystemId: input.supplierSystemId,
        supplierName: input.supplierName,
        purchaseOrderId: input.purchaseOrderId,
        purchaseOrderSystemId: input.purchaseOrderSystemId,
        referenceType: input.referenceType,
        referenceId: input.referenceId,
        receiptDate: input.receiptDate ? new Date(input.receiptDate) : new Date(),
        notes: input.notes,
        status: 'DRAFT',
        createdBy: input.createdBy,
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
    })

    revalidatePath('/inventory-receipts')
    return { success: true, data: inventoryReceipt }
  } catch (error) {
    console.error('Error creating inventory receipt:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Không thể tạo phiếu nhập kho',
    }
  }
}

export async function updateInventoryReceiptAction(
  input: UpdateInventoryReceiptInput
): Promise<ActionResult<InventoryReceipt>> {
  const session = await auth()
  if (!session?.user) {
    return { success: false, error: 'Chưa đăng nhập' }
  }

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
        error: 'Only DRAFT inventory receipts can be updated',
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

    revalidatePath('/inventory-receipts')
    revalidatePath(`/inventory-receipts/${systemId}`)
    return { success: true, data: inventoryReceipt }
  } catch (error) {
    console.error('Error updating inventory receipt:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Không thể cập nhật phiếu nhập kho',
    }
  }
}

export async function deleteInventoryReceiptAction(
  systemId: string
): Promise<ActionResult<InventoryReceipt>> {
  const session = await auth()
  if (!session?.user) {
    return { success: false, error: 'Chưa đăng nhập' }
  }
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
        error: 'Only DRAFT inventory receipts can be deleted',
      }
    }

    // Delete items first
    await prisma.inventoryReceiptItem.deleteMany({
      where: { receiptId: systemId },
    })

    const inventoryReceipt = await prisma.inventoryReceipt.delete({
      where: { systemId },
    })

    revalidatePath('/inventory-receipts')
    return { success: true, data: inventoryReceipt }
  } catch (error) {
    console.error('Error deleting inventory receipt:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Không thể xóa phiếu nhập kho',
    }
  }
}

export async function getInventoryReceiptAction(
  systemId: string
): Promise<ActionResult<InventoryReceipt>> {
  const session = await auth()
  if (!session?.user) {
    return { success: false, error: 'Chưa đăng nhập' }
  }
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

    return { success: true, data: inventoryReceipt }
  } catch (error) {
    console.error('Error getting inventory receipt:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Không tìm thấy phiếu nhập kho',
    }
  }
}

export async function addInventoryReceiptItemAction(
  inventoryReceiptId: string,
  item: CreateInventoryReceiptItemInput
): Promise<ActionResult<InventoryReceiptItem>> {
  const session = await auth()
  if (!session?.user) {
    return { success: false, error: 'Chưa đăng nhập' }
  }

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
        error: 'Only DRAFT inventory receipts can have items added',
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
    return { success: true, data: newItem }
  } catch (error) {
    console.error('Error adding inventory receipt item:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Không thể thêm mục vào phiếu nhập kho',
    }
  }
}

export async function updateInventoryReceiptItemAction(
  itemId: string,
  data: Partial<CreateInventoryReceiptItemInput>
): Promise<ActionResult<InventoryReceiptItem>> {
  const session = await auth()
  if (!session?.user) {
    return { success: false, error: 'Chưa đăng nhập' }
  }

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
        error: 'Only items in DRAFT inventory receipts can be updated',
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
    return { success: true, data: updatedItem }
  } catch (error) {
    console.error('Error updating inventory receipt item:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Không thể cập nhật mục phiếu nhập kho',
    }
  }
}

export async function removeInventoryReceiptItemAction(
  itemId: string
): Promise<ActionResult<InventoryReceiptItem>> {
  const session = await auth()
  if (!session?.user) {
    return { success: false, error: 'Chưa đăng nhập' }
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
        error: 'Only items in DRAFT inventory receipts can be removed',
      }
    }

    const deletedItem = await prisma.inventoryReceiptItem.delete({
      where: { systemId: itemId },
    })

    revalidatePath('/inventory-receipts')
    revalidatePath(`/inventory-receipts/${item.receiptId}`)
    return { success: true, data: deletedItem }
  } catch (error) {
    console.error('Error removing inventory receipt item:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Không thể xóa mục phiếu nhập kho',
    }
  }
}

export async function confirmInventoryReceiptAction(
  systemId: string,
  _confirmedBy: string
): Promise<ActionResult<InventoryReceipt>> {
  const session = await auth()
  if (!session?.user) {
    return { success: false, error: 'Chưa đăng nhập' }
  }
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
        error: 'Only DRAFT inventory receipts can be confirmed',
      }
    }

    if (!existing.items.length) {
      return {
        success: false,
        error: 'Inventory receipt must have at least one item',
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

    revalidatePath('/inventory-receipts')
    revalidatePath(`/inventory-receipts/${systemId}`)
    revalidatePath('/products')
    return { success: true, data: inventoryReceipt }
  } catch (error) {
    console.error('Error confirming inventory receipt:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Không thể xác nhận phiếu nhập kho',
    }
  }
}

export async function cancelInventoryReceiptAction(
  systemId: string
): Promise<ActionResult<InventoryReceipt>> {
  const session = await auth()
  if (!session?.user) {
    return { success: false, error: 'Chưa đăng nhập' }
  }
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
        error: 'Only DRAFT inventory receipts can be cancelled',
      }
    }

    const inventoryReceipt = await prisma.inventoryReceipt.update({
      where: { systemId },
      data: { status: 'CANCELLED' },
    })

    revalidatePath('/inventory-receipts')
    revalidatePath(`/inventory-receipts/${systemId}`)
    return { success: true, data: inventoryReceipt }
  } catch (error) {
    console.error('Error cancelling inventory receipt:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Không thể hủy phiếu nhập kho',
    }
  }
}
