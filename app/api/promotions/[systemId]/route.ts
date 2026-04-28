import { logError } from '@/lib/logger'
import { prisma } from '@/lib/prisma'
import { apiHandler } from '@/lib/api-handler'
import { apiSuccess, apiError, validateBody } from '@/lib/api-utils'
import { createActivityLog } from '@/lib/services/activity-log-service'
import { z } from 'zod'

const updatePromotionSchema = z.object({
  code: z.string().min(1).transform(v => v.trim().toUpperCase()).optional(),
  description: z.string().optional(),
  discountType: z.enum(['PERCENTAGE', 'FIXED']).optional(),
  discountValue: z.number().min(0).optional(),
  minOrderAmount: z.number().min(0).nullable().optional(),
  maxDiscount: z.number().min(0).nullable().optional(),
  startDate: z.string().nullable().optional(),
  endDate: z.string().nullable().optional(),
  usageLimit: z.number().int().min(0).nullable().optional(),
  isActive: z.boolean().optional(),
})

// GET /api/promotions/[systemId]
export const GET = apiHandler(async (req, { params }) => {
  try {
    const { systemId } = await params
    const promotion = await prisma.promotion.findUnique({ where: { systemId } })
    if (!promotion) return apiError('Không tìm thấy khuyến mãi', 404)
    return apiSuccess(promotion)
  } catch (error) {
    logError('GET /api/promotions/[systemId] failed', error)
    return apiError('Failed to fetch promotion', 500)
  }
})

// PATCH /api/promotions/[systemId]
export const PATCH = apiHandler(async (req, { session, params }) => {
  try {
    const { systemId } = await params
    const validation = await validateBody(req, updatePromotionSchema)
    if (!validation.success) {
      return apiError(validation.error, 400)
    }
    const body = validation.data

    const existing = await prisma.promotion.findUnique({ where: { systemId } })
    if (!existing) return apiError('Không tìm thấy khuyến mãi', 404)

    // Check code uniqueness if changed
    if (body.code && body.code !== existing.code) {
      const duplicate = await prisma.promotion.findUnique({ where: { code: body.code } })
      if (duplicate) return apiError('Mã giảm giá đã tồn tại', 400)
    }

    const promotion = await prisma.promotion.update({
      where: { systemId },
      data: {
        ...(body.code && { code: body.code, id: body.code }),
        ...(body.description !== undefined && { description: body.description }),
        ...(body.discountType && { discountType: body.discountType }),
        ...(body.discountValue !== undefined && { discountValue: body.discountValue }),
        ...(body.minOrderAmount !== undefined && { minOrderAmount: body.minOrderAmount }),
        ...(body.maxDiscount !== undefined && { maxDiscount: body.maxDiscount }),
        ...(body.startDate !== undefined && { startDate: body.startDate ? new Date(body.startDate) : null }),
        ...(body.endDate !== undefined && { endDate: body.endDate ? new Date(body.endDate) : null }),
        ...(body.usageLimit !== undefined && { usageLimit: body.usageLimit }),
        ...(body.isActive !== undefined && { isActive: body.isActive }),
      },
    })

    // Activity log with change detection
    const changes: Record<string, { from: unknown; to: unknown }> = {}
    if (body.code !== undefined && body.code !== existing.code) changes['Mã'] = { from: existing.code, to: body.code }
    if (body.description !== undefined && body.description !== existing.description) changes['Mô tả'] = { from: existing.description ?? '', to: body.description ?? '' }
    if (body.discountType !== undefined && body.discountType !== existing.discountType) changes['Loại giảm giá'] = { from: existing.discountType, to: body.discountType }
    if (body.discountValue !== undefined && Number(body.discountValue) !== Number(existing.discountValue)) changes['Giá trị giảm'] = { from: Number(existing.discountValue), to: body.discountValue }
    if (body.isActive !== undefined && body.isActive !== existing.isActive) changes['Trạng thái'] = { from: existing.isActive ? 'Hoạt động' : 'Ngừng', to: body.isActive ? 'Hoạt động' : 'Ngừng' }

    if (Object.keys(changes).length > 0) {
      const changeDetail = Object.keys(changes).join(', ')
      createActivityLog({
        entityType: 'promotion',
        entityId: promotion.systemId,
        action: `Cập nhật khuyến mãi: ${existing.code}: ${changeDetail}`,
        actionType: 'update',
        changes,
        metadata: { code: promotion.code },
        createdBy: session!.user?.employee?.fullName || session!.user?.email || 'System',
      }).catch(e => logError('[promotions] activity log failed', e))
    }

    return apiSuccess(promotion)
  } catch (error) {
    logError('PATCH /api/promotions/[systemId] failed', error)
    return apiError('Failed to update promotion', 500)
  }
}, { permission: 'edit_settings' })

// DELETE /api/promotions/[systemId]
export const DELETE = apiHandler(async (req, { session, params }) => {
  try {
    const { systemId } = await params
    const existing = await prisma.promotion.findUnique({ where: { systemId } })
    if (!existing) return apiError('Không tìm thấy khuyến mãi', 404)

    await prisma.promotion.delete({ where: { systemId } })

    createActivityLog({
      entityType: 'promotion',
      entityId: systemId,
      action: 'deleted',
      actionType: 'delete',
      metadata: { code: existing.code },
      createdBy: session!.user?.employee?.fullName || session!.user?.email || 'System',
    })

    return apiSuccess({ deleted: true })
  } catch (error) {
    logError('DELETE /api/promotions/[systemId] failed', error)
    return apiError('Failed to delete promotion', 500)
  }
}, { permission: 'edit_settings' })
