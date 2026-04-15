'use server'

/**
 * Server Actions for Cost Adjustment Management (Điều chỉnh giá vốn)
 */

import { prisma } from '@/lib/prisma'
import { revalidatePath } from '@/lib/revalidation'
import { generateIdWithPrefix } from '@/lib/id-generator'
import { requireActionPermission } from '@/lib/api-utils'
import type { ActionResult } from '@/types/action-result'
import { createCostAdjustmentSchema, updateCostAdjustmentSchema, costAdjustmentItemSchema } from '@/features/cost-adjustments/validation'
import { logError } from '@/lib/logger'
import { getSessionUserName } from '@/lib/get-user-name'

// Types
type CostAdjustment = NonNullable<Awaited<ReturnType<typeof prisma.costAdjustment.findFirst>>>
type CostAdjustmentItem = NonNullable<Awaited<ReturnType<typeof prisma.costAdjustmentItem.findFirst>>>

// Helper to transform Decimal fields to Numbers for serialization
function transformItemDecimals(item: CostAdjustmentItem) {
  const { oldCost, newCost, adjustmentAmount, adjustmentPercent, ...rest } = item
  return {
    ...rest,
    oldCost: Number(oldCost) || 0,
    newCost: Number(newCost) || 0,
    adjustmentAmount: Number(adjustmentAmount) || 0,
    adjustmentPercent: Number(adjustmentPercent) || 0,
  }
}

function transformAdjustmentDecimals(adjustment: CostAdjustment & { items: CostAdjustmentItem[] }) {
  return {
    ...adjustment,
    items: adjustment.items.map(transformItemDecimals),
  }
}

// Flexible input type that accepts both old API format and new form format
export type CreateCostAdjustmentInput = {
  // Branch (optional for global cost adjustments)
  branchId?: string
  branchSystemId?: string
  branchName?: string
  // Date (defaults to today if not provided)
  adjustmentDate?: string | Date
  // Type/Reason
  type?: string
  reason?: string
  note?: string
  description?: string
  referenceCode?: string
  businessId?: string
  // Creator
  createdBy?: string
  createdByName?: string
  // Items - flexible to accept both formats
  items?: CreateCostAdjustmentItemInput[]
}

export type CreateCostAdjustmentItemInput = {
  productId?: string
  productSystemId?: string
  productSku?: string
  productName?: string
  productImage?: string
  // Old format
  currentCost?: number
  newCost?: number
  difference?: number
  // New form format
  oldCostPrice?: number
  newCostPrice?: number
  adjustmentAmount?: number
  adjustmentPercent?: number
  notes?: string
}

export type UpdateCostAdjustmentInput = {
  systemId: string
  adjustmentDate?: string | Date
  type?: string
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
  const authResult = await requireActionPermission('create_cost_adjustments')
  if (!authResult.success) return authResult

  const validated = createCostAdjustmentSchema.safeParse(input)
  if (!validated.success) {
    return { success: false, error: validated.error.issues[0]?.message || 'Dữ liệu không hợp lệ' }
  }

  try {
    // Generate IDs properly:
    // - systemId: business ID provided by user OR auto-generated
    // - id: always matches systemId when auto-generated, otherwise separate unique ID
    let systemId: string
    let id: string
    
    if (input.businessId) {
      // User provided custom ID - use it for systemId but generate unique id
      systemId = input.businessId
      id = await generateIdWithPrefix('DCGV', prisma)
    } else {
      // Auto-generate - use same value for both
      systemId = await generateIdWithPrefix('DCGV', prisma)
      id = systemId
    }
    
    const adjustmentDate = input.adjustmentDate ? new Date(input.adjustmentDate) : new Date()

    const costAdjustment = await prisma.costAdjustment.create({
      data: {
        systemId,
        id,
        branchId: input.branchId || input.branchSystemId || 'GLOBAL', // Default branch for global adjustments
        adjustmentDate,
        type: input.type || 'manual',
        reason: input.reason || null,
        referenceCode: input.referenceCode || null,
        note: input.note || input.description || null,
        status: 'DRAFT',
        createdBySystemId: input.createdBy || null,
        createdByName: input.createdByName || null,
        createdBy: input.createdBy || null,
        items: input.items?.length ? {
          create: input.items.map((item) => {
            // Support both formats: currentCost/newCost (old) and oldCostPrice/newCostPrice (form)
            const oldCost = item.currentCost ?? item.oldCostPrice ?? 0
            const newCost = item.newCost ?? item.newCostPrice ?? 0
            const adjustmentAmount = item.difference ?? item.adjustmentAmount ?? (newCost - oldCost)
            const adjustmentPercent = item.adjustmentPercent ?? (oldCost > 0 ? ((newCost - oldCost) / oldCost * 100) : 0)
            
            return {
              productId: item.productId || null,
              productSystemId: item.productSystemId || null,
              productName: item.productName || null,
              productImage: item.productImage || null,
              oldCost,
              newCost,
              adjustmentAmount,
              adjustmentPercent,
              quantity: 1,
            }
          }),
        } : undefined,
      },
      include: { items: true },
    })

    revalidatePath('/cost-adjustments')

    // Activity log
    const userName = getSessionUserName(authResult.session)
    prisma.activityLog.create({
      data: {
        entityType: 'cost_adjustment',
        entityId: costAdjustment.systemId,
        action: `Thêm điều chỉnh giá vốn: ${costAdjustment.systemId}`,
        actionType: 'create',
        note: `${input.reason || input.type || ''} - ${costAdjustment.items?.length || 0} SP`,
        metadata: { userName },
        createdBy: userName,
      }
    }).catch(e => logError('[ActivityLog] cost adjustment create failed', e))

    return { success: true, data: transformAdjustmentDecimals(costAdjustment) as unknown as CostAdjustment }
  } catch (error) {
    logError('Error creating cost adjustment', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Không thể tạo điều chỉnh giá vốn',
    }
  }
}

export async function updateCostAdjustmentAction(
  input: UpdateCostAdjustmentInput
): Promise<ActionResult<CostAdjustment>> {
  const authResult = await requireActionPermission('create_cost_adjustments')
  if (!authResult.success) return authResult

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

    // Activity log with changes diff
    const userName = getSessionUserName(authResult.session)
    const changes: Record<string, { from: unknown; to: unknown }> = {}
    if (data.adjustmentDate !== undefined) changes['Ngày điều chỉnh'] = { from: existing.adjustmentDate?.toISOString().split('T')[0], to: String(data.adjustmentDate).split('T')[0] }
    if (data.type !== undefined && data.type !== existing.type) changes['Loại'] = { from: existing.type, to: data.type }
    if (data.reason !== undefined && data.reason !== existing.reason) changes['Lý do'] = { from: existing.reason, to: data.reason }
    if (data.description !== undefined && data.description !== existing.note) changes['Mô tả'] = { from: existing.note, to: data.description }
    if (Object.keys(changes).length > 0) {
      const changeFields = Object.keys(changes).join(', ')
      prisma.activityLog.create({
        data: {
          entityType: 'cost_adjustment',
          entityId: systemId,
          action: `Cập nhật điều chỉnh giá vốn: ${systemId}: ${changeFields}`,
          actionType: 'update',
          changes: JSON.parse(JSON.stringify(changes)),
          metadata: { userName },
          createdBy: userName,
        }
      }).catch(e => logError('[ActivityLog] cost adjustment update failed', e))
    }

    return { success: true, data: transformAdjustmentDecimals(costAdjustment) as unknown as CostAdjustment }
  } catch (error) {
    logError('Error updating cost adjustment', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Không thể cập nhật điều chỉnh giá vốn',
    }
  }
}

export async function deleteCostAdjustmentAction(
  systemId: string
): Promise<ActionResult<CostAdjustment>> {
  const authResult = await requireActionPermission('create_cost_adjustments')
  if (!authResult.success) return authResult

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

    // Activity log
    const userName = getSessionUserName(authResult.session)
    prisma.activityLog.create({
      data: {
        entityType: 'cost_adjustment',
        entityId: systemId,
        action: `Xóa điều chỉnh giá vốn: ${systemId}`,
        actionType: 'delete',
        note: `${existing.reason || existing.type || ''}`,
        metadata: { userName },
        createdBy: userName,
      }
    }).catch(e => logError('[ActivityLog] cost adjustment delete failed', e))

    revalidatePath('/cost-adjustments')
    return { success: true, data: costAdjustment }
  } catch (error) {
    logError('Error deleting cost adjustment', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Không thể xóa điều chỉnh giá vốn',
    }
  }
}

export async function getCostAdjustmentAction(
  systemId: string
): Promise<ActionResult<CostAdjustment>> {
  const authResult = await requireActionPermission('view_cost_adjustments')
  if (!authResult.success) return authResult

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

    return { success: true, data: transformAdjustmentDecimals(costAdjustment) as unknown as CostAdjustment }
  } catch (error) {
    logError('Error getting cost adjustment', error)
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
  const authResult = await requireActionPermission('create_cost_adjustments')
  if (!authResult.success) return authResult

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
        productId: item.productId || null,
        productSystemId: item.productSystemId || null,
        productName: item.productName || null,
        oldCost: item.currentCost ?? item.oldCostPrice ?? 0,
        newCost: item.newCost ?? item.newCostPrice ?? 0,
        adjustmentAmount: item.difference ?? item.adjustmentAmount ?? ((item.newCost ?? item.newCostPrice ?? 0) - (item.currentCost ?? item.oldCostPrice ?? 0)),
        quantity: 1,
      },
    })

    revalidatePath('/cost-adjustments')
    revalidatePath(`/cost-adjustments/${costAdjustmentId}`)
    return { success: true, data: transformItemDecimals(newItem) as unknown as CostAdjustmentItem }
  } catch (error) {
    logError('Error adding cost adjustment item', error)
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
  const authResult = await requireActionPermission('create_cost_adjustments')
  if (!authResult.success) return authResult

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
    return { success: true, data: transformItemDecimals(updatedItem) as unknown as CostAdjustmentItem }
  } catch (error) {
    logError('Error updating cost adjustment item', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Không thể cập nhật mục điều chỉnh giá vốn',
    }
  }
}

export async function removeCostAdjustmentItemAction(
  itemId: string
): Promise<ActionResult<CostAdjustmentItem>> {
  const authResult = await requireActionPermission('create_cost_adjustments')
  if (!authResult.success) return authResult

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
    return { success: true, data: transformItemDecimals(deletedItem) as unknown as CostAdjustmentItem }
  } catch (error) {
    logError('Error removing cost adjustment item', error)
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
  const authResult = await requireActionPermission('approve_cost_adjustments')
  if (!authResult.success) return authResult

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
      // Use productSystemId (actual system ID) not productId (business ID)
      const productSystemId = item.productSystemId || item.productId
      if (productSystemId) {
        await prisma.product.update({
          where: { systemId: productSystemId },
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

    // Activity log
    const userName = getSessionUserName(authResult.session)
    prisma.activityLog.create({
      data: {
        entityType: 'cost_adjustment',
        entityId: systemId,
        action: `Xác nhận điều chỉnh giá vốn: ${systemId}`,
        actionType: 'status',
        changes: JSON.parse(JSON.stringify({ 'Trạng thái': { from: 'Nháp', to: 'Xác nhận' } })),
        note: `${existing.items.length} SP được cập nhật giá vốn`,
        metadata: { userName, itemCount: existing.items.length },
        createdBy: userName,
      }
    }).catch(e => logError('[ActivityLog] cost adjustment confirm failed', e))

    return { success: true, data: transformAdjustmentDecimals(costAdjustment) as unknown as CostAdjustment }
  } catch (error) {
    logError('Error confirming cost adjustment', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Không thể xác nhận điều chỉnh giá vốn',
    }
  }
}

export async function cancelCostAdjustmentAction(
  systemId: string
): Promise<ActionResult<CostAdjustment>> {
  const authResult = await requireActionPermission('create_cost_adjustments')
  if (!authResult.success) return authResult

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

    // Activity log
    const userName = getSessionUserName(authResult.session)
    prisma.activityLog.create({
      data: {
        entityType: 'cost_adjustment',
        entityId: systemId,
        action: `Hủy điều chỉnh giá vốn: ${systemId}`,
        actionType: 'status',
        changes: JSON.parse(JSON.stringify({ 'Trạng thái': { from: existing.status, to: 'CANCELLED' } })),
        metadata: { userName },
        createdBy: userName,
      }
    }).catch(e => logError('[ActivityLog] cost adjustment cancel failed', e))

    revalidatePath('/cost-adjustments')
    revalidatePath(`/cost-adjustments/${systemId}`)
    return { success: true, data: costAdjustment }
  } catch (error) {
    logError('Error cancelling cost adjustment', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Không thể hủy điều chỉnh giá vốn',
    }
  }
}
