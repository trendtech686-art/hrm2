'use server'

/**
 * Server Actions for Price Adjustment Management (Điều chỉnh giá bán)
 */

import { prisma } from '@/lib/prisma'
import { revalidatePath } from '@/lib/revalidation'
import { generateIdWithPrefix, syncCounterWithTable } from '@/lib/id-generator'
import { requireActionPermission } from '@/lib/api-utils'
import type { ActionResult } from '@/types/action-result'
import { createPriceAdjustmentSchema, updatePriceAdjustmentSchema, priceAdjustmentItemSchema } from '@/features/price-adjustments/validation'
import { logError } from '@/lib/logger'
import { getSessionUserName } from '@/lib/get-user-name'

// Types
type PriceAdjustment = NonNullable<Awaited<ReturnType<typeof prisma.priceAdjustment.findFirst>>>
type PriceAdjustmentItem = NonNullable<Awaited<ReturnType<typeof prisma.priceAdjustmentItem.findFirst>>>

export type CreatePriceAdjustmentInput = {
  pricingPolicyId?: string
  pricingPolicySystemId?: string
  pricingPolicyName?: string
  adjustmentDate: string | Date
  effectiveDate?: string | Date
  expiryDate?: string | Date
  type: 'INCREASE' | 'DECREASE' | 'SET'
  reason?: string
  description?: string
  createdBy?: string
  createdByName?: string
  items?: CreatePriceAdjustmentItemInput[]
}

export type CreatePriceAdjustmentItemInput = {
  productId: string
  productSystemId?: string
  productName?: string
  productImage?: string
  oldPrice: number
  newPrice: number
  adjustmentAmount?: number
  adjustmentPercent?: number
  note?: string
}

export type UpdatePriceAdjustmentInput = {
  systemId: string
  adjustmentDate?: string | Date
  effectiveDate?: string | Date
  expiryDate?: string | Date
  type?: 'INCREASE' | 'DECREASE' | 'SET'
  reason?: string
  description?: string
  updatedBy?: string
}

// ====================================
// ACTIONS
// ====================================

export async function createPriceAdjustmentAction(
  input: CreatePriceAdjustmentInput
): Promise<ActionResult<PriceAdjustment>> {
  const authResult = await requireActionPermission('edit_products')
  if (!authResult.success) return authResult

  const validated = createPriceAdjustmentSchema.safeParse(input)
  if (!validated.success) {
    return { success: false, error: validated.error.issues[0]?.message || 'Dữ liệu không hợp lệ' }
  }

  try {
    // Sync counter with existing IDs to prevent duplicates
    await syncCounterWithTable('DCGB', 'price_adjustments', 'id')
    const systemId = await generateIdWithPrefix('DCGB', prisma)

    const priceAdjustment = await prisma.priceAdjustment.create({
      data: {
        systemId,
        id: systemId,
        branchId: 'DEFAULT',
        pricingPolicyId: input.pricingPolicyId ?? 'DEFAULT',
        pricingPolicyName: input.pricingPolicyName,
        adjustmentDate: new Date(input.adjustmentDate),
        type: input.type,
        reason: input.reason,
        note: input.description,
        status: 'DRAFT',
        createdBy: input.createdBy,
        createdBySystemId: input.createdBy,
        createdByName: input.createdByName,
        items: input.items?.length ? {
          create: input.items.map((item) => {
            const itemSystemId = `${systemId}-${item.productId}`
            return {
              systemId: itemSystemId,
              productId: item.productId,
              productSystemId: item.productSystemId ?? item.productId,
              productName: item.productName,
              productImage: item.productImage,
              oldPrice: item.oldPrice,
              newPrice: item.newPrice,
              adjustmentAmount: item.adjustmentAmount ?? (item.newPrice - item.oldPrice),
              adjustmentPercent: item.adjustmentPercent ?? (item.oldPrice !== 0 ? ((item.newPrice - item.oldPrice) / item.oldPrice * 100) : 0),
              note: item.note,
            }
          }),
        } : undefined,
      },
      include: { items: true },
    })

    // Transform Decimal to Number for serialization
    const serialized = {
      ...priceAdjustment,
      items: priceAdjustment.items.map(item => ({
        ...item,
        oldPrice: Number(item.oldPrice),
        newPrice: Number(item.newPrice),
        adjustmentAmount: Number(item.adjustmentAmount),
        adjustmentPercent: Number(item.adjustmentPercent),
      })),
    }

    revalidatePath('/price-adjustments')

    // Activity log
    const userName = getSessionUserName(authResult.session)
    prisma.activityLog.create({
      data: {
        entityType: 'price_adjustment',
        entityId: priceAdjustment.systemId,
        action: `Thêm điều chỉnh giá bán: ${priceAdjustment.systemId}`,
        actionType: 'create',
        note: `${input.reason || input.type || ''} - ${priceAdjustment.items?.length || 0} SP`,
        metadata: { userName },
        createdBy: userName,
      }
    }).catch(e => logError('[ActivityLog] price adjustment create failed', e))

    return { success: true, data: serialized as unknown as PriceAdjustment }
  } catch (error) {
    logError('Error creating price adjustment', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Không thể tạo điều chỉnh giá',
    }
  }
}

export async function updatePriceAdjustmentAction(
  input: UpdatePriceAdjustmentInput
): Promise<ActionResult<PriceAdjustment>> {
  const authResult = await requireActionPermission('edit_products')
  if (!authResult.success) return authResult

  const validated = updatePriceAdjustmentSchema.safeParse(input)
  if (!validated.success) {
    return { success: false, error: validated.error.issues[0]?.message || 'Dữ liệu không hợp lệ' }
  }

  try {
    const { systemId, ...data } = input

    const existing = await prisma.priceAdjustment.findUnique({
      where: { systemId },
    })

    if (!existing) {
      return { success: false, error: 'Không tìm thấy điều chỉnh giá' }
    }

    if (existing.status !== 'DRAFT') {
      return {
        success: false,
        error: 'Chỉ có thể cập nhật điều chỉnh giá ở trạng thái Nháp',
      }
    }

    const updateData: Record<string, unknown> = {}
    
    if (data.adjustmentDate !== undefined) updateData.adjustmentDate = new Date(data.adjustmentDate)
    if (data.effectiveDate !== undefined) updateData.effectiveDate = new Date(data.effectiveDate)
    if (data.expiryDate !== undefined) updateData.expiryDate = new Date(data.expiryDate)
    if (data.type !== undefined) updateData.type = data.type
    if (data.reason !== undefined) updateData.reason = data.reason
    if (data.description !== undefined) updateData.description = data.description
    if (data.updatedBy !== undefined) updateData.updatedBy = data.updatedBy

    const priceAdjustment = await prisma.priceAdjustment.update({
      where: { systemId },
      data: updateData,
      include: { items: true },
    })

    // Transform Decimal to Number for serialization
    const serialized = {
      ...priceAdjustment,
      items: priceAdjustment.items.map(item => ({
        ...item,
        oldPrice: Number(item.oldPrice),
        newPrice: Number(item.newPrice),
        adjustmentAmount: Number(item.adjustmentAmount),
        adjustmentPercent: Number(item.adjustmentPercent),
      })),
    }

    revalidatePath('/price-adjustments')
    revalidatePath(`/price-adjustments/${systemId}`)

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
          entityType: 'price_adjustment',
          entityId: systemId,
          action: `Cập nhật điều chỉnh giá bán: ${systemId}: ${changeFields}`,
          actionType: 'update',
          changes: JSON.parse(JSON.stringify(changes)),
          metadata: { userName },
          createdBy: userName,
        }
      }).catch(e => logError('[ActivityLog] price adjustment update failed', e))
    }

    return { success: true, data: serialized as unknown as PriceAdjustment }
  } catch (error) {
    logError('Error updating price adjustment', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Không thể cập nhật điều chỉnh giá',
    }
  }
}

export async function deletePriceAdjustmentAction(
  systemId: string
): Promise<ActionResult<PriceAdjustment>> {
  const authResult = await requireActionPermission('edit_products')
  if (!authResult.success) return authResult
  try {
    const existing = await prisma.priceAdjustment.findUnique({
      where: { systemId },
    })

    if (!existing) {
      return { success: false, error: 'Không tìm thấy điều chỉnh giá' }
    }

    if (existing.status !== 'DRAFT') {
      return {
        success: false,
        error: 'Chỉ có thể xóa điều chỉnh giá ở trạng thái Nháp',
      }
    }

    // Delete items first
    await prisma.priceAdjustmentItem.deleteMany({
      where: { adjustmentId: systemId },
    })

    const priceAdjustment = await prisma.priceAdjustment.delete({
      where: { systemId },
    })

    // Activity log
    const userName = getSessionUserName(authResult.session)
    prisma.activityLog.create({
      data: {
        entityType: 'price_adjustment',
        entityId: systemId,
        action: `Xóa điều chỉnh giá bán: ${systemId}`,
        actionType: 'delete',
        note: `${existing.reason || existing.type || ''}`,
        metadata: { userName },
        createdBy: userName,
      }
    }).catch(e => logError('[ActivityLog] price adjustment delete failed', e))

    revalidatePath('/price-adjustments')
    return { success: true, data: priceAdjustment }
  } catch (error) {
    logError('Error deleting price adjustment', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Không thể xóa điều chỉnh giá',
    }
  }
}

export async function addPriceAdjustmentItemAction(
  priceAdjustmentId: string,
  item: CreatePriceAdjustmentItemInput
): Promise<ActionResult<PriceAdjustmentItem>> {
  const authResult = await requireActionPermission('edit_products')
  if (!authResult.success) return authResult

  const validated = priceAdjustmentItemSchema.safeParse(item)
  if (!validated.success) {
    return { success: false, error: validated.error.issues[0]?.message || 'Dữ liệu không hợp lệ' }
  }

  try {
    const priceAdjustment = await prisma.priceAdjustment.findUnique({
      where: { systemId: priceAdjustmentId },
      include: { items: true },
    })

    if (!priceAdjustment) {
      return { success: false, error: 'Không tìm thấy điều chỉnh giá' }
    }

    if (priceAdjustment.status !== 'DRAFT') {
      return {
        success: false,
        error: 'Chỉ có thể thêm mục vào điều chỉnh giá ở trạng thái Nháp',
      }
    }

    const adjustmentAmount = item.newPrice - item.oldPrice
    const adjustmentPercent = item.oldPrice !== 0 
      ? (adjustmentAmount / item.oldPrice * 100)
      : 0

    const itemSystemId = await generateIdWithPrefix('DCGBI', prisma)
    const newItem = await prisma.priceAdjustmentItem.create({
      data: {
        systemId: itemSystemId,
        adjustmentId: priceAdjustmentId,
        productId: item.productId,
        productSystemId: item.productSystemId ?? item.productId,
        productName: item.productName,
        productImage: item.productImage,
        oldPrice: item.oldPrice,
        newPrice: item.newPrice,
        adjustmentAmount: item.adjustmentAmount ?? adjustmentAmount,
        adjustmentPercent: item.adjustmentPercent ?? adjustmentPercent,
        note: item.note,
      },
    })

    revalidatePath('/price-adjustments')
    revalidatePath(`/price-adjustments/${priceAdjustmentId}`)
    
    // Transform Decimal to Number for serialization
    const serializedItem = {
      ...newItem,
      oldPrice: Number(newItem.oldPrice),
      newPrice: Number(newItem.newPrice),
      adjustmentAmount: Number(newItem.adjustmentAmount),
      adjustmentPercent: Number(newItem.adjustmentPercent),
    }
    
    return { success: true, data: serializedItem as unknown as PriceAdjustmentItem }
  } catch (error) {
    logError('Error adding price adjustment item', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Không thể thêm mục điều chỉnh giá',
    }
  }
}

export async function updatePriceAdjustmentItemAction(
  itemId: string,
  data: Partial<CreatePriceAdjustmentItemInput>
): Promise<ActionResult<PriceAdjustmentItem>> {
  const authResult = await requireActionPermission('edit_products')
  if (!authResult.success) return authResult

  const validated = priceAdjustmentItemSchema.partial().safeParse(data)
  if (!validated.success) {
    return { success: false, error: validated.error.issues[0]?.message || 'Dữ liệu không hợp lệ' }
  }

  try {
    const item = await prisma.priceAdjustmentItem.findUnique({
      where: { systemId: itemId },
      include: { priceAdjustment: true },
    })

    if (!item) {
      return { success: false, error: 'Không tìm thấy mục điều chỉnh giá' }
    }

    if (item.priceAdjustment.status !== 'DRAFT') {
      return {
        success: false,
        error: 'Chỉ có thể cập nhật mục trong điều chỉnh giá ở trạng thái Nháp',
      }
    }

    const updateData: Record<string, unknown> = {}
    
    if (data.oldPrice !== undefined) updateData.oldPrice = data.oldPrice
    if (data.newPrice !== undefined) updateData.newPrice = data.newPrice
    if (data.note !== undefined) updateData.note = data.note

    // Recalculate adjustmentAmount and adjustmentPercent
    const oldPrice = data.oldPrice ?? Number(item.oldPrice)
    const newPrice = data.newPrice ?? Number(item.newPrice)
    const adjustmentAmount = newPrice - oldPrice
    updateData.adjustmentAmount = adjustmentAmount
    updateData.adjustmentPercent = oldPrice !== 0 ? (adjustmentAmount / oldPrice * 100) : 0

    const updatedItem = await prisma.priceAdjustmentItem.update({
      where: { systemId: itemId },
      data: updateData,
    })

    revalidatePath('/price-adjustments')
    revalidatePath(`/price-adjustments/${item.adjustmentId}`)
    
    // Transform Decimal to Number for serialization
    const serializedItem = {
      ...updatedItem,
      oldPrice: Number(updatedItem.oldPrice),
      newPrice: Number(updatedItem.newPrice),
      adjustmentAmount: Number(updatedItem.adjustmentAmount),
      adjustmentPercent: Number(updatedItem.adjustmentPercent),
    }
    
    return { success: true, data: serializedItem as unknown as PriceAdjustmentItem }
  } catch (error) {
    logError('Error updating price adjustment item', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Không thể cập nhật mục điều chỉnh giá',
    }
  }
}

export async function removePriceAdjustmentItemAction(
  itemId: string
): Promise<ActionResult<PriceAdjustmentItem>> {
  const authResult = await requireActionPermission('edit_products')
  if (!authResult.success) return authResult
  try {
    const item = await prisma.priceAdjustmentItem.findUnique({
      where: { systemId: itemId },
      include: { priceAdjustment: true },
    })

    if (!item) {
      return { success: false, error: 'Không tìm thấy mục điều chỉnh giá' }
    }

    if (item.priceAdjustment.status !== 'DRAFT') {
      return {
        success: false,
        error: 'Chỉ có thể xóa mục trong điều chỉnh giá ở trạng thái Nháp',
      }
    }

    const deletedItem = await prisma.priceAdjustmentItem.delete({
      where: { systemId: itemId },
    })

    revalidatePath('/price-adjustments')
    revalidatePath(`/price-adjustments/${item.adjustmentId}`)
    
    // Transform Decimal to Number for serialization
    const serializedItem = {
      ...deletedItem,
      oldPrice: Number(deletedItem.oldPrice),
      newPrice: Number(deletedItem.newPrice),
      adjustmentAmount: Number(deletedItem.adjustmentAmount),
      adjustmentPercent: Number(deletedItem.adjustmentPercent),
    }
    
    return { success: true, data: serializedItem as unknown as PriceAdjustmentItem }
  } catch (error) {
    logError('Error removing price adjustment item', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Không thể xóa mục điều chỉnh giá',
    }
  }
}

export async function confirmPriceAdjustmentAction(
  systemId: string,
  confirmedBy: string,
  confirmedByName?: string
): Promise<ActionResult<PriceAdjustment>> {
  const authResult = await requireActionPermission('edit_products')
  if (!authResult.success) return authResult
  try {
    const existing = await prisma.priceAdjustment.findUnique({
      where: { systemId },
      include: { items: true },
    })

    if (!existing) {
      return { success: false, error: 'Không tìm thấy điều chỉnh giá' }
    }

    if (existing.status !== 'DRAFT') {
      return {
        success: false,
        error: 'Chỉ có thể xác nhận điều chỉnh giá ở trạng thái Nháp',
      }
    }

    if (!existing.items.length) {
      return {
        success: false,
        error: 'Điều chỉnh giá phải có ít nhất một mục',
      }
    }

    // Update product prices in ProductPrice table
    for (const item of existing.items) {
      if (item.productSystemId && existing.pricingPolicyId) {
        await prisma.productPrice.upsert({
          where: {
            productId_pricingPolicyId: {
              productId: item.productSystemId,
              pricingPolicyId: existing.pricingPolicyId,
            },
          },
          update: { price: Number(item.newPrice) },
          create: {
            productId: item.productSystemId,
            pricingPolicyId: existing.pricingPolicyId,
            price: Number(item.newPrice),
          },
        })
      }
    }

    const priceAdjustment = await prisma.priceAdjustment.update({
      where: { systemId },
      data: {
        status: 'CONFIRMED',
        confirmedBySystemId: confirmedBy,
        confirmedByName: confirmedByName,
        confirmedDate: new Date(),
        updatedBy: confirmedBy,
      },
      include: { items: true },
    })

    // Transform Decimal to Number for serialization
    const serialized = {
      ...priceAdjustment,
      items: priceAdjustment.items.map(item => ({
        ...item,
        oldPrice: Number(item.oldPrice),
        newPrice: Number(item.newPrice),
        adjustmentAmount: Number(item.adjustmentAmount),
        adjustmentPercent: Number(item.adjustmentPercent),
      })),
    }

    revalidatePath('/price-adjustments')
    revalidatePath(`/price-adjustments/${systemId}`)
    revalidatePath('/products')

    // Activity log
    const userName = getSessionUserName(authResult.session)
    prisma.activityLog.create({
      data: {
        entityType: 'price_adjustment',
        entityId: systemId,
        action: `Xác nhận điều chỉnh giá bán: ${systemId}`,
        actionType: 'status',
        changes: JSON.parse(JSON.stringify({ 'Trạng thái': { from: 'Nháp', to: 'Xác nhận' } })),
        note: `${existing.items.length} SP được cập nhật giá bán`,
        metadata: { userName, itemCount: existing.items.length },
        createdBy: userName,
      }
    }).catch(e => logError('[ActivityLog] price adjustment confirm failed', e))

    return { success: true, data: serialized as unknown as PriceAdjustment }
  } catch (error) {
    logError('Error confirming price adjustment', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Không thể xác nhận điều chỉnh giá',
    }
  }
}

export async function cancelPriceAdjustmentAction(
  systemId: string
): Promise<ActionResult<PriceAdjustment>> {
  const authResult = await requireActionPermission('edit_products')
  if (!authResult.success) return authResult
  try {
    const existing = await prisma.priceAdjustment.findUnique({
      where: { systemId },
    })

    if (!existing) {
      return { success: false, error: 'Không tìm thấy điều chỉnh giá' }
    }

    if (existing.status !== 'DRAFT') {
      return {
        success: false,
        error: 'Chỉ có thể hủy điều chỉnh giá ở trạng thái Nháp',
      }
    }

    const priceAdjustment = await prisma.priceAdjustment.update({
      where: { systemId },
      data: { status: 'CANCELLED' },
    })

    // Activity log
    const userName = getSessionUserName(authResult.session)
    prisma.activityLog.create({
      data: {
        entityType: 'price_adjustment',
        entityId: systemId,
        action: `Hủy điều chỉnh giá bán: ${systemId}`,
        actionType: 'status',
        changes: JSON.parse(JSON.stringify({ 'Trạng thái': { from: existing.status, to: 'CANCELLED' } })),
        metadata: { userName },
        createdBy: userName,
      }
    }).catch(e => logError('[ActivityLog] price adjustment cancel failed', e))

    revalidatePath('/price-adjustments')
    revalidatePath(`/price-adjustments/${systemId}`)
    return { success: true, data: priceAdjustment }
  } catch (error) {
    logError('Error cancelling price adjustment', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Không thể hủy điều chỉnh giá',
    }
  }
}
