import { prisma } from '@/lib/prisma'
import { apiHandler } from '@/lib/api-handler'
import { apiSuccess, apiPaginated, apiError, parsePagination, validateBody } from '@/lib/api-utils'
import { logError } from '@/lib/logger'
import { createActivityLog } from '@/lib/services/activity-log-service'
import { z } from 'zod'
import { buildSearchWhere } from '@/lib/search/build-search-where'

const createPromotionSchema = z.object({
  code: z.string().min(1, 'Bắt buộc nhập mã').transform(v => v.trim().toUpperCase()),
  description: z.string().optional(),
  discountType: z.enum(['PERCENTAGE', 'FIXED']).default('FIXED'),
  discountValue: z.number().min(0),
  minOrderAmount: z.number().min(0).optional(),
  maxDiscount: z.number().min(0).optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  usageLimit: z.number().int().min(0).optional(),
  isActive: z.boolean().default(true),
})

// GET /api/promotions
export const GET = apiHandler(async (req) => {
  try {
    const { searchParams } = new URL(req.url)
    const { page, limit, skip } = parsePagination(searchParams)
    const search = searchParams.get('search') || ''
    const activeOnly = searchParams.get('activeOnly') === 'true'

    const where: Record<string, unknown> = {}
    const searchWhere = buildSearchWhere(search, ['code', 'description'])
    if (searchWhere) Object.assign(where, searchWhere)
    if (activeOnly) {
      where.isActive = true
      const now = new Date()
      const existingAnd = (where.AND as Array<Record<string, unknown>> | undefined) ?? []
      where.AND = [
        ...existingAnd,
        { OR: [{ startDate: null }, { startDate: { lte: now } }] },
        { OR: [{ endDate: null }, { endDate: { gte: now } }] },
      ]
    }

    const [promotions, total] = await Promise.all([
      prisma.promotion.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.promotion.count({ where }),
    ])

    const filtered = activeOnly
      ? promotions.filter(p => !p.usageLimit || p.usageCount < p.usageLimit)
      : promotions

    return apiPaginated(filtered, { page, limit, total: activeOnly ? filtered.length : total })
  } catch (error) {
    logError('GET /api/promotions failed', error)
    return apiError('Failed to fetch promotions', 500)
  }
})

// POST /api/promotions
export const POST = apiHandler(async (req, { session }) => {
  try {
    const validation = await validateBody(req, createPromotionSchema)
    if (!validation.success) {
      return apiError(validation.error, 400)
    }
    const body = validation.data

    // Check duplicate code
    const existing = await prisma.promotion.findUnique({ where: { code: body.code } })
    if (existing) {
      return apiError('Mã giảm giá đã tồn tại', 400)
    }

    const promotion = await prisma.promotion.create({
      data: {
        id: body.code,
        code: body.code,
        description: body.description,
        discountType: body.discountType,
        discountValue: body.discountValue,
        minOrderAmount: body.minOrderAmount,
        maxDiscount: body.maxDiscount,
        startDate: body.startDate ? new Date(body.startDate) : undefined,
        endDate: body.endDate ? new Date(body.endDate) : undefined,
        usageLimit: body.usageLimit,
        isActive: body.isActive,
      },
    })

    createActivityLog({
      entityType: 'promotion',
      entityId: promotion.systemId,
      action: 'created',
      actionType: 'create',
      metadata: { code: promotion.code, description: promotion.description },
      createdBy: session!.user?.employee?.fullName || session!.user?.email || 'System',
    })

    return apiSuccess(promotion, 201)
  } catch (error) {
    logError('POST /api/promotions failed', error)
    return apiError('Failed to create promotion', 500)
  }
}, { permission: 'edit_settings' })
