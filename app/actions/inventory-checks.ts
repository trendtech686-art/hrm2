'use server'

/**
 * Server Actions for Inventory Check Management (Phiếu kiểm kê)
 */

import { prisma } from '@/lib/prisma'
import { revalidatePath } from '@/lib/revalidation'
import { generateIdWithPrefix } from '@/lib/id-generator'
import { auth } from '@/auth'
import type { ActionResult } from '@/types/action-result'
import { createInventoryCheckSchema, updateInventoryCheckSchema, inventoryCheckItemSchema } from '@/features/inventory-checks/validation'

// Types
type InventoryCheck = NonNullable<Awaited<ReturnType<typeof prisma.inventoryCheck.findFirst>>>
type InventoryCheckItem = NonNullable<Awaited<ReturnType<typeof prisma.inventoryCheckItem.findFirst>>>

export type CreateInventoryCheckInput = {
  branchId: string
  branchSystemId?: string
  branchName?: string
  checkDate: string | Date
  description?: string
  createdBy?: string
  items?: CreateInventoryCheckItemInput[]
}

export type CreateInventoryCheckItemInput = {
  productId: string
  productSystemId?: string
  productSku?: string
  productName?: string
  systemQuantity: number
  actualQuantity: number
  difference?: number
  notes?: string
}

export type UpdateInventoryCheckInput = {
  systemId: string
  checkDate?: string | Date
  description?: string
  updatedBy?: string
}

// ====================================
// ACTIONS
// ====================================

export async function createInventoryCheckAction(
  input: CreateInventoryCheckInput
): Promise<ActionResult<InventoryCheck>> {
  const session = await auth()
  if (!session?.user) {
    return { success: false, error: 'Chưa đăng nhập' }
  }

  const validated = createInventoryCheckSchema.safeParse(input)
  if (!validated.success) {
    return { success: false, error: validated.error.issues[0]?.message || 'Dữ liệu không hợp lệ' }
  }

  try {
    const systemId = await generateIdWithPrefix('KK', prisma)

    const inventoryCheck = await prisma.inventoryCheck.create({
      data: {
        systemId,
        id: systemId,
        branchId: input.branchId,
        branchSystemId: input.branchSystemId,
        branchName: input.branchName,
        checkDate: new Date(input.checkDate),
        notes: input.description,
        status: 'DRAFT',
        createdBy: input.createdBy,
        items: input.items?.length ? {
          create: input.items.map((item) => ({
            productId: item.productId,
            productName: item.productName || '',
            productSku: item.productSku || '',
            systemQty: item.systemQuantity,
            actualQty: item.actualQuantity,
            difference: item.difference ?? (item.actualQuantity - item.systemQuantity),
            notes: item.notes,
          })),
        } : undefined,
      },
      include: { items: true },
    })

    revalidatePath('/inventory-checks')
    return { success: true, data: inventoryCheck }
  } catch (error) {
    console.error('Error creating inventory check:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Không thể tạo phiếu kiểm kê',
    }
  }
}

export async function updateInventoryCheckAction(
  input: UpdateInventoryCheckInput
): Promise<ActionResult<InventoryCheck>> {
  const session = await auth()
  if (!session?.user) {
    return { success: false, error: 'Chưa đăng nhập' }
  }

  const validated = updateInventoryCheckSchema.safeParse(input)
  if (!validated.success) {
    return { success: false, error: validated.error.issues[0]?.message || 'Dữ liệu không hợp lệ' }
  }

  try {
    const { systemId, ...data } = input

    const existing = await prisma.inventoryCheck.findUnique({
      where: { systemId },
    })

    if (!existing) {
      return { success: false, error: 'Không tìm thấy phiếu kiểm kê' }
    }

    if (existing.status !== 'DRAFT') {
      return {
        success: false,
        error: 'Chỉ phiếu ở trạng thái NHÁP mới có thể cập nhật',
      }
    }

    const updateData: Record<string, unknown> = {}
    
    if (data.checkDate !== undefined) updateData.checkDate = new Date(data.checkDate)
    if (data.description !== undefined) updateData.description = data.description
    if (data.updatedBy !== undefined) updateData.updatedBy = data.updatedBy

    const inventoryCheck = await prisma.inventoryCheck.update({
      where: { systemId },
      data: updateData,
      include: { items: true },
    })

    revalidatePath('/inventory-checks')
    revalidatePath(`/inventory-checks/${systemId}`)
    return { success: true, data: inventoryCheck }
  } catch (error) {
    console.error('Error updating inventory check:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Không thể cập nhật phiếu kiểm kê',
    }
  }
}

export async function deleteInventoryCheckAction(
  systemId: string
): Promise<ActionResult<InventoryCheck>> {
  const session = await auth()
  if (!session?.user) {
    return { success: false, error: 'Chưa đăng nhập' }
  }

  try {
    const existing = await prisma.inventoryCheck.findUnique({
      where: { systemId },
    })

    if (!existing) {
      return { success: false, error: 'Không tìm thấy phiếu kiểm kê' }
    }

    if (existing.status !== 'DRAFT') {
      return {
        success: false,
        error: 'Chỉ phiếu ở trạng thái NHÁP mới có thể xóa',
      }
    }

    // Delete items first
    await prisma.inventoryCheckItem.deleteMany({
      where: { checkId: systemId },
    })

    const inventoryCheck = await prisma.inventoryCheck.delete({
      where: { systemId },
    })

    revalidatePath('/inventory-checks')
    return { success: true, data: inventoryCheck }
  } catch (error) {
    console.error('Error deleting inventory check:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Không thể xóa phiếu kiểm kê',
    }
  }
}

export async function getInventoryCheckAction(
  systemId: string
): Promise<ActionResult<InventoryCheck>> {
  const session = await auth()
  if (!session?.user) {
    return { success: false, error: 'Chưa đăng nhập' }
  }

  try {
    const inventoryCheck = await prisma.inventoryCheck.findUnique({
      where: { systemId },
      include: {
        items: true,
      },
    })

    if (!inventoryCheck) {
      return { success: false, error: 'Không tìm thấy phiếu kiểm kê' }
    }

    return { success: true, data: inventoryCheck }
  } catch (error) {
    console.error('Error getting inventory check:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Không thể lấy thông tin phiếu kiểm kê',
    }
  }
}

export async function addInventoryCheckItemAction(
  inventoryCheckId: string,
  item: CreateInventoryCheckItemInput
): Promise<ActionResult<InventoryCheckItem>> {
  const session = await auth()
  if (!session?.user) {
    return { success: false, error: 'Chưa đăng nhập' }
  }

  const validated = inventoryCheckItemSchema.safeParse(item)
  if (!validated.success) {
    return { success: false, error: validated.error.issues[0]?.message || 'Dữ liệu không hợp lệ' }
  }

  try {
    const inventoryCheck = await prisma.inventoryCheck.findUnique({
      where: { systemId: inventoryCheckId },
      include: { items: true },
    })

    if (!inventoryCheck) {
      return { success: false, error: 'Không tìm thấy phiếu kiểm kê' }
    }

    if (inventoryCheck.status !== 'DRAFT') {
      return {
        success: false,
        error: 'Chỉ phiếu ở trạng thái NHÁP mới có thể thêm sản phẩm',
      }
    }

    const newItem = await prisma.inventoryCheckItem.create({
      data: {
        checkId: inventoryCheckId,
        productId: item.productId,
        productSku: item.productSku || '',
        productName: item.productName || '',
        systemQty: item.systemQuantity,
        actualQty: item.actualQuantity,
        difference: item.difference ?? (item.actualQuantity - item.systemQuantity),
        notes: item.notes,
      },
    })

    revalidatePath('/inventory-checks')
    revalidatePath(`/inventory-checks/${inventoryCheckId}`)
    return { success: true, data: newItem }
  } catch (error) {
    console.error('Error adding inventory check item:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Không thể thêm sản phẩm vào phiếu kiểm kê',
    }
  }
}

export async function updateInventoryCheckItemAction(
  itemId: string,
  data: Partial<CreateInventoryCheckItemInput>
): Promise<ActionResult<InventoryCheckItem>> {
  const session = await auth()
  if (!session?.user) {
    return { success: false, error: 'Chưa đăng nhập' }
  }

  const validated = inventoryCheckItemSchema.partial().safeParse(data)
  if (!validated.success) {
    return { success: false, error: validated.error.issues[0]?.message || 'Dữ liệu không hợp lệ' }
  }

  try {
    const item = await prisma.inventoryCheckItem.findUnique({
      where: { systemId: itemId },
      include: { inventoryCheck: true },
    })

    if (!item) {
      return { success: false, error: 'Không tìm thấy sản phẩm' }
    }

    if (item.inventoryCheck.status !== 'DRAFT') {
      return {
        success: false,
        error: 'Chỉ sản phẩm trong phiếu ở trạng thái NHÁP mới có thể cập nhật',
      }
    }

    const updateData: Record<string, unknown> = {}
    
    if (data.actualQuantity !== undefined) {
      updateData.actualQty = data.actualQuantity
      updateData.difference = data.actualQuantity - Number(item.systemQty)
    }
    if (data.notes !== undefined) updateData.notes = data.notes

    const updatedItem = await prisma.inventoryCheckItem.update({
      where: { systemId: itemId },
      data: updateData,
    })

    revalidatePath('/inventory-checks')
    revalidatePath(`/inventory-checks/${item.checkId}`)
    return { success: true, data: updatedItem }
  } catch (error) {
    console.error('Error updating inventory check item:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Không thể cập nhật sản phẩm trong phiếu kiểm kê',
    }
  }
}

export async function removeInventoryCheckItemAction(
  itemId: string
): Promise<ActionResult<InventoryCheckItem>> {
  const session = await auth()
  if (!session?.user) {
    return { success: false, error: 'Chưa đăng nhập' }
  }

  try {
    const item = await prisma.inventoryCheckItem.findUnique({
      where: { systemId: itemId },
      include: { inventoryCheck: true },
    })

    if (!item) {
      return { success: false, error: 'Không tìm thấy sản phẩm' }
    }

    if (item.inventoryCheck.status !== 'DRAFT') {
      return {
        success: false,
        error: 'Chỉ sản phẩm trong phiếu ở trạng thái NHÁP mới có thể xóa',
      }
    }

    const deletedItem = await prisma.inventoryCheckItem.delete({
      where: { systemId: itemId },
    })

    revalidatePath('/inventory-checks')
    revalidatePath(`/inventory-checks/${item.checkId}`)
    return { success: true, data: deletedItem }
  } catch (error) {
    console.error('Error removing inventory check item:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Không thể xóa sản phẩm khỏi phiếu kiểm kê',
    }
  }
}

export async function balanceInventoryCheckAction(
  systemId: string,
  balancedBy: string
): Promise<ActionResult<InventoryCheck>> {
  const session = await auth()
  if (!session?.user) {
    return { success: false, error: 'Chưa đăng nhập' }
  }

  try {
    const existing = await prisma.inventoryCheck.findUnique({
      where: { systemId },
      include: { items: true },
    })

    if (!existing) {
      return { success: false, error: 'Không tìm thấy phiếu kiểm kê' }
    }

    if (existing.status !== 'DRAFT') {
      return {
        success: false,
        error: 'Chỉ phiếu ở trạng thái NHÁP mới có thể cân bằng',
      }
    }

    if (!existing.items.length) {
      return {
        success: false,
        error: 'Phiếu kiểm kê phải có ít nhất một sản phẩm',
      }
    }

    // Update product inventory based on actual counts
    for (const item of existing.items) {
      if (item.productId) {
        // Find inventory for this product and branch
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
            data: { onHand: Number(item.actualQty) },
          })
        }
      }
    }

    const inventoryCheck = await prisma.inventoryCheck.update({
      where: { systemId },
      data: {
        status: 'BALANCED',
        balancedBy,
        balancedAt: new Date(),
      },
      include: { items: true },
    })

    revalidatePath('/inventory-checks')
    revalidatePath(`/inventory-checks/${systemId}`)
    revalidatePath('/products')
    return { success: true, data: inventoryCheck }
  } catch (error) {
    console.error('Error balancing inventory check:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Không thể cân bằng phiếu kiểm kê',
    }
  }
}

export async function cancelInventoryCheckAction(
  systemId: string
): Promise<ActionResult<InventoryCheck>> {
  const session = await auth()
  if (!session?.user) {
    return { success: false, error: 'Chưa đăng nhập' }
  }

  try {
    const existing = await prisma.inventoryCheck.findUnique({
      where: { systemId },
    })

    if (!existing) {
      return { success: false, error: 'Không tìm thấy phiếu kiểm kê' }
    }

    if (existing.status !== 'DRAFT') {
      return {
        success: false,
        error: 'Chỉ phiếu ở trạng thái NHÁP mới có thể hủy',
      }
    }

    const inventoryCheck = await prisma.inventoryCheck.update({
      where: { systemId },
      data: { status: 'CANCELLED' },
    })

    revalidatePath('/inventory-checks')
    revalidatePath(`/inventory-checks/${systemId}`)
    return { success: true, data: inventoryCheck }
  } catch (error) {
    console.error('Error cancelling inventory check:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Không thể hủy phiếu kiểm kê',
    }
  }
}

/**
 * Force cancel inventory check from complaint reversal
 * This action cancels ANY status inventory check (not just DRAFT)
 * Used when reverting complaint verification
 */
export async function forceCancelInventoryCheckAction(
  input: {
    systemId: string
    reason: string
    cancelledBy?: string
  }
): Promise<ActionResult<InventoryCheck>> {
  const session = await auth()
  if (!session?.user) {
    return { success: false, error: 'Chưa đăng nhập' }
  }

  try {
    const existing = await prisma.inventoryCheck.findUnique({
      where: { systemId: input.systemId },
    })

    if (!existing) {
      return { success: false, error: 'Không tìm thấy phiếu kiểm kê' }
    }

    // Already cancelled? Return success
    if (existing.status === 'CANCELLED') {
      return { success: true, data: existing }
    }

    const inventoryCheck = await prisma.inventoryCheck.update({
      where: { systemId: input.systemId },
      data: { 
        status: 'CANCELLED',
        cancelledAt: new Date(),
        cancelledBy: input.cancelledBy || null,
        cancelledReason: input.reason,
        notes: existing.notes 
          ? `${existing.notes}\n[HỦY] ${input.reason}`
          : `[HỦY] ${input.reason}`,
      },
    })

    revalidatePath('/inventory-checks')
    revalidatePath(`/inventory-checks/${input.systemId}`)
    return { success: true, data: inventoryCheck }
  } catch (error) {
    console.error('Error force cancelling inventory check:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Không thể hủy bắt buộc phiếu kiểm kê',
    }
  }
}
