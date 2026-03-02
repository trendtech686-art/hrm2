'use server'

/**
 * Server Actions for Cost Adjustment Management (Điều chỉnh giá vốn)
 */

import { prisma } from '@/lib/prisma'
import { revalidatePath } from '@/lib/revalidation'
import { generateIdWithPrefix } from '@/lib/id-generator'
import { auth } from '@/auth'
import type { ActionResult } from '@/types/action-result'
import { createCostAdjustmentSchema, updateCostAdjustmentSchema, costAdjustmentItemSchema } from '@/features/cost-adjustments/validation'

// Types
type CostAdjustment = NonNullable<Awaited<ReturnType<typeof prisma.costAdjustment.findFirst>>>
type CostAdjustmentItem = NonNullable<Awaited<ReturnType<typeof prisma.costAdjustmentItem.findFirst>>>

export type CreateCostAdjustmentInput = {
  branchId: string
  branchSystemId?: string
  branchName?: string
  adjustmentDate: string | Date
  type: 'INCREASE' | 'DECREASE' | 'SET'
  reason?: string
  description?: string
  createdBy?: string
  items?: CreateCostAdjustmentItemInput[]
}

export type CreateCostAdjustmentItemInput = {
  productId: string
  productSystemId?: string
  productSku?: string
  productName?: string
  currentCost: number
  newCost: number
  difference?: number
  notes?: string
}

export type UpdateCostAdjustmentInput = {
  systemId: string
  adjustmentDate?: string | Date
  type?: 'INCREASE' | 'DECREASE' | 'SET'
  reason?: string
  description?: string
  updatedBy?: string
}

// ====================================
// ACTIONS
// ====================================

export async function createCostAdjustmentAction(
  input: CreateCostAdjustmentInput
): Promise<ActionResult<CostAdjustment>> {
  const session = await auth()
  if (!session?.user) {
    return { success: false, error: 'Chưa đăng nhập' }
  }

  const validated = createCostAdjustmentSchema.safeParse(input)
  if (!validated.success) {
    return { success: false, error: validated.error.issues[0]?.message || 'Dữ liệu không hợp lệ' }
  }

  try {
    const systemId = await generateIdWithPrefix('DCGV', prisma)

    const costAdjustment = await prisma.costAdjustment.create({
      data: {
        systemId,
        id: systemId,
        branchId: input.branchId,
        adjustmentDate: new Date(input.adjustmentDate),
        type: input.type,
        reason: input.reason,
        note: input.description,
        status: 'DRAFT',
        createdBy: input.createdBy,
        items: input.items?.length ? {
          create: input.items.map((item) => ({
            productId: item.productId,
            productSystemId: item.productSystemId,
            productName: item.productName,
            oldCost: item.currentCost,
            newCost: item.newCost,
            adjustmentAmount: item.difference ?? (item.newCost - item.currentCost),
            quantity: 1,
          })),
        } : undefined,
      },
      include: { items: true },
    })

    revalidatePath('/cost-adjustments')
    return { success: true, data: costAdjustment }
  } catch (error) {
    console.error('Error creating cost adjustment:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Không thể tạo điều chỉnh giá vốn',
    }
  }
}

export async function updateCostAdjustmentAction(
  input: UpdateCostAdjustmentInput
): Promise<ActionResult<CostAdjustment>> {
  const session = await auth()
  if (!session?.user) {
    return { success: false, error: 'Chưa đăng nhập' }
  }

  const validated = updateCostAdjustmentSchema.safeParse(input)
  if (!validated.success) {
    return { success: false, error: validated.error.issues[0]?.message || 'Dữ liệu không hợp lệ' }
  }

  try {
    const { systemId, ...data } = input

    const existing = await prisma.costAdjustment.findUnique({
      where: { systemId },
    })

    if (!existing) {
      return { success: false, error: 'Không tìm thấy điều chỉnh giá vốn' }
    }

    if (existing.status !== 'DRAFT') {
      return {
        success: false,
        error: 'Chỉ có thể cập nhật điều chỉnh giá vốn ở trạng thái Nháp',
      }
    }

    const updateData: Record<string, unknown> = {}
    
    if (data.adjustmentDate !== undefined) updateData.adjustmentDate = new Date(data.adjustmentDate)
    if (data.type !== undefined) updateData.type = data.type
    if (data.reason !== undefined) updateData.reason = data.reason
    if (data.description !== undefined) updateData.note = data.description
    if (data.updatedBy !== undefined) updateData.updatedBy = data.updatedBy

    const costAdjustment = await prisma.costAdjustment.update({
      where: { systemId },
      data: updateData,
      include: { items: true },
    })

    revalidatePath('/cost-adjustments')
    revalidatePath(`/cost-adjustments/${systemId}`)
    return { success: true, data: costAdjustment }
  } catch (error) {
    console.error('Error updating cost adjustment:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Không thể cập nhật điều chỉnh giá vốn',
    }
  }
}

export async function deleteCostAdjustmentAction(
  systemId: string
): Promise<ActionResult<CostAdjustment>> {
  const session = await auth()
  if (!session?.user) {
    return { success: false, error: 'Chưa đăng nhập' }
  }

  try {
    const existing = await prisma.costAdjustment.findUnique({
      where: { systemId },
    })

    if (!existing) {
      return { success: false, error: 'Không tìm thấy điều chỉnh giá vốn' }
    }

    if (existing.status !== 'DRAFT') {
      return {
        success: false,
        error: 'Chỉ có thể xóa điều chỉnh giá vốn ở trạng thái Nháp',
      }
    }

    // Delete items first
    await prisma.costAdjustmentItem.deleteMany({
      where: { adjustmentId: systemId },
    })

    const costAdjustment = await prisma.costAdjustment.delete({
      where: { systemId },
    })

    revalidatePath('/cost-adjustments')
    return { success: true, data: costAdjustment }
  } catch (error) {
    console.error('Error deleting cost adjustment:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Không thể xóa điều chỉnh giá vốn',
    }
  }
}

export async function getCostAdjustmentAction(
  systemId: string
): Promise<ActionResult<CostAdjustment>> {
  const session = await auth()
  if (!session?.user) {
    return { success: false, error: 'Chưa đăng nhập' }
  }

  try {
    const costAdjustment = await prisma.costAdjustment.findUnique({
      where: { systemId },
      include: {
        items: true,
      },
    })

    if (!costAdjustment) {
      return { success: false, error: 'Không tìm thấy điều chỉnh giá vốn' }
    }

    return { success: true, data: costAdjustment }
  } catch (error) {
    console.error('Error getting cost adjustment:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Không thể lấy điều chỉnh giá vốn',
    }
  }
}

export async function addCostAdjustmentItemAction(
  costAdjustmentId: string,
  item: CreateCostAdjustmentItemInput
): Promise<ActionResult<CostAdjustmentItem>> {
  const session = await auth()
  if (!session?.user) {
    return { success: false, error: 'Chưa đăng nhập' }
  }

  const validated = costAdjustmentItemSchema.safeParse(item)
  if (!validated.success) {
    return { success: false, error: validated.error.issues[0]?.message || 'Dữ liệu không hợp lệ' }
  }

  try {
    const costAdjustment = await prisma.costAdjustment.findUnique({
      where: { systemId: costAdjustmentId },
      include: { items: true },
    })

    if (!costAdjustment) {
      return { success: false, error: 'Không tìm thấy điều chỉnh giá vốn' }
    }

    if (costAdjustment.status !== 'DRAFT') {
      return {
        success: false,
        error: 'Chỉ có thể thêm mục vào điều chỉnh giá vốn ở trạng thái Nháp',
      }
    }

    const newItem = await prisma.costAdjustmentItem.create({
      data: {
        adjustmentId: costAdjustmentId,
        productId: item.productId,
        productSystemId: item.productSystemId,
        productName: item.productName,
        oldCost: item.currentCost,
        newCost: item.newCost,
        adjustmentAmount: item.difference ?? (item.newCost - item.currentCost),
        quantity: 1,
      },
    })

    revalidatePath('/cost-adjustments')
    revalidatePath(`/cost-adjustments/${costAdjustmentId}`)
    return { success: true, data: newItem }
  } catch (error) {
    console.error('Error adding cost adjustment item:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Không thể thêm mục điều chỉnh giá vốn',
    }
  }
}

export async function updateCostAdjustmentItemAction(
  itemId: string,
  data: Partial<CreateCostAdjustmentItemInput>
): Promise<ActionResult<CostAdjustmentItem>> {
  const session = await auth()
  if (!session?.user) {
    return { success: false, error: 'Chưa đăng nhập' }
  }

  const validated = costAdjustmentItemSchema.partial().safeParse(data)
  if (!validated.success) {
    return { success: false, error: validated.error.issues[0]?.message || 'Dữ liệu không hợp lệ' }
  }

  try {
    const item = await prisma.costAdjustmentItem.findUnique({
      where: { systemId: itemId },
      include: { costAdjustment: true },
    })

    if (!item) {
      return { success: false, error: 'Không tìm thấy mục điều chỉnh giá vốn' }
    }

    if (item.costAdjustment.status !== 'DRAFT') {
      return {
        success: false,
        error: 'Chỉ có thể cập nhật mục trong điều chỉnh giá vốn ở trạng thái Nháp',
      }
    }

    const updateData: Record<string, unknown> = {}
    
    if (data.currentCost !== undefined) updateData.oldCost = data.currentCost
    if (data.newCost !== undefined) updateData.newCost = data.newCost

    // Recalculate adjustmentAmount
    const oldCost = data.currentCost ?? Number(item.oldCost)
    const newCost = data.newCost ?? Number(item.newCost)
    updateData.adjustmentAmount = newCost - oldCost

    const updatedItem = await prisma.costAdjustmentItem.update({
      where: { systemId: itemId },
      data: updateData,
    })

    revalidatePath('/cost-adjustments')
    revalidatePath(`/cost-adjustments/${item.adjustmentId}`)
    return { success: true, data: updatedItem }
  } catch (error) {
    console.error('Error updating cost adjustment item:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Không thể cập nhật mục điều chỉnh giá vốn',
    }
  }
}

export async function removeCostAdjustmentItemAction(
  itemId: string
): Promise<ActionResult<CostAdjustmentItem>> {
  const session = await auth()
  if (!session?.user) {
    return { success: false, error: 'Chưa đăng nhập' }
  }

  try {
    const item = await prisma.costAdjustmentItem.findUnique({
      where: { systemId: itemId },
      include: { costAdjustment: true },
    })

    if (!item) {
      return { success: false, error: 'Không tìm thấy mục điều chỉnh giá vốn' }
    }

    if (item.costAdjustment.status !== 'DRAFT') {
      return {
        success: false,
        error: 'Chỉ có thể xóa mục trong điều chỉnh giá vốn ở trạng thái Nháp',
      }
    }

    const deletedItem = await prisma.costAdjustmentItem.delete({
      where: { systemId: itemId },
    })

    revalidatePath('/cost-adjustments')
    revalidatePath(`/cost-adjustments/${item.adjustmentId}`)
    return { success: true, data: deletedItem }
  } catch (error) {
    console.error('Error removing cost adjustment item:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Không thể xóa mục điều chỉnh giá vốn',
    }
  }
}

export async function confirmCostAdjustmentAction(
  systemId: string,
  confirmedBy: string
): Promise<ActionResult<CostAdjustment>> {
  const session = await auth()
  if (!session?.user) {
    return { success: false, error: 'Chưa đăng nhập' }
  }

  try {
    const existing = await prisma.costAdjustment.findUnique({
      where: { systemId },
      include: { items: true },
    })

    if (!existing) {
      return { success: false, error: 'Không tìm thấy điều chỉnh giá vốn' }
    }

    if (existing.status !== 'DRAFT') {
      return {
        success: false,
        error: 'Chỉ có thể xác nhận điều chỉnh giá vốn ở trạng thái Nháp',
      }
    }

    if (!existing.items.length) {
      return {
        success: false,
        error: 'Điều chỉnh giá vốn phải có ít nhất một mục',
      }
    }

    // Update product costs
    for (const item of existing.items) {
      if (item.productId) {
        await prisma.product.update({
          where: { systemId: item.productId },
          data: { costPrice: Number(item.newCost) },
        })
      }
    }

    const costAdjustment = await prisma.costAdjustment.update({
      where: { systemId },
      data: {
        status: 'CONFIRMED',
        confirmedBySystemId: confirmedBy,
        confirmedDate: new Date(),
      },
      include: { items: true },
    })

    revalidatePath('/cost-adjustments')
    revalidatePath(`/cost-adjustments/${systemId}`)
    revalidatePath('/products')
    return { success: true, data: costAdjustment }
  } catch (error) {
    console.error('Error confirming cost adjustment:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Không thể xác nhận điều chỉnh giá vốn',
    }
  }
}

export async function cancelCostAdjustmentAction(
  systemId: string
): Promise<ActionResult<CostAdjustment>> {
  const session = await auth()
  if (!session?.user) {
    return { success: false, error: 'Chưa đăng nhập' }
  }

  try {
    const existing = await prisma.costAdjustment.findUnique({
      where: { systemId },
    })

    if (!existing) {
      return { success: false, error: 'Không tìm thấy điều chỉnh giá vốn' }
    }

    if (existing.status !== 'DRAFT') {
      return {
        success: false,
        error: 'Chỉ có thể hủy điều chỉnh giá vốn ở trạng thái Nháp',
      }
    }

    const costAdjustment = await prisma.costAdjustment.update({
      where: { systemId },
      data: { status: 'CANCELLED' },
    })

    revalidatePath('/cost-adjustments')
    revalidatePath(`/cost-adjustments/${systemId}`)
    return { success: true, data: costAdjustment }
  } catch (error) {
    console.error('Error cancelling cost adjustment:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Không thể hủy điều chỉnh giá vốn',
    }
  }
}
