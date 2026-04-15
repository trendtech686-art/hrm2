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
  const { systemId } = await params
  const promotion = await prisma.promotion.findUnique({ where: { systemId } })
  if (!promotion) return apiError('Không tìm thấy khuyến mãi', 404)
  return apiSuccess(promotion)
})

// PATCH /api/promotions/[systemId]
export const PATCH = apiHandler(async (req, { session, params }) => {
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

  createActivityLog({
    entityType: 'promotion',
    entityId: promotion.systemId,
    action: 'updated',
    actionType: 'update',
    metadata: { code: promotion.code },
    createdBy: session!.user?.employee?.fullName || session!.user?.email || 'System',
  })

  return apiSuccess(promotion)
}, { permission: 'edit_settings' })

// DELETE /api/promotions/[systemId]
export const DELETE = apiHandler(async (req, { session, params }) => {
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
}, { permission: 'edit_settings' })
