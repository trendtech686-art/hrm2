import { prisma } from '@/lib/prisma'
import { requireAuth, validateBody, apiSuccess, apiError, parsePagination } from '@/lib/api-utils'
import { z } from 'zod'
import { generateNextIds } from '@/lib/id-system'
import { logError } from '@/lib/logger'
import { createActivityLog } from '@/lib/services/activity-log-service'

// Validation schema
const createTaxSchema = z.object({
  systemId: z.string().optional(),
  id: z.string().optional(),
  name: z.string().min(1, 'Tên thuế không được để trống'),
  rate: z.number().min(0, 'Tỷ lệ thuế phải >= 0').max(100, 'Tỷ lệ thuế phải <= 100'),
  description: z.string().optional(),
  isDefaultSale: z.boolean().optional(),
  isDefaultPurchase: z.boolean().optional(),
})

// GET /api/settings/taxes - Get all taxes
export async function GET(request: Request) {
  const session = await requireAuth()
  if (!session) return apiError('Vui lòng đăng nhập', 401)

  try {
    const { searchParams } = new URL(request.url)
    const { page, limit, skip } = parsePagination(searchParams)
    const isDefaultSale = searchParams.get('isDefaultSale')
    const isDefaultPurchase = searchParams.get('isDefaultPurchase')

    const where = {
      isDeleted: false,
      ...(isDefaultSale !== null && { isDefaultSale: isDefaultSale === 'true' }),
      ...(isDefaultPurchase !== null && { isDefaultPurchase: isDefaultPurchase === 'true' }),
    }

    const [taxes, total] = await Promise.all([
      prisma.tax.findMany({
        where,
        skip,
        take: limit,
        orderBy: { name: 'asc' },
      }),
      prisma.tax.count({ where }),
    ])

    return apiSuccess({
      data: taxes,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    logError('Error fetching taxes', error)
    return apiError('Không thể tải danh sách thuế', 500)
  }
}

// POST /api/settings/taxes - Create tax
export async function POST(request: Request) {
  const session = await requireAuth()
  if (!session) return apiError('Vui lòng đăng nhập', 401)

  const validation = await validateBody(request, createTaxSchema)
  if (!validation.success) {
    return apiError(validation.error, 400)
  }
  const body = validation.data

  try {
    // If setting as default sale, unset others
    if (body.isDefaultSale) {
      await prisma.tax.updateMany({
        where: { isDefaultSale: true },
        data: { isDefaultSale: false },
      })
    }

    // If setting as default purchase, unset others
    if (body.isDefaultPurchase) {
      await prisma.tax.updateMany({
        where: { isDefaultPurchase: true },
        data: { isDefaultPurchase: false },
      })
    }

    // Generate IDs
    const { systemId, businessId } = await generateNextIds('taxes')
    
    const tax = await prisma.tax.create({
      data: {
        systemId: body.systemId || systemId,
        id: body.id || businessId,
        name: body.name,
        rate: body.rate,
        description: body.description || '',
        isDefaultSale: body.isDefaultSale ?? false,
        isDefaultPurchase: body.isDefaultPurchase ?? false,
      },
    })

    createActivityLog({
      entityType: 'tax',
      entityId: tax.systemId,
      action: `Thêm thuế: ${body.name} (${body.rate}%)`,
      actionType: 'create',
      createdBy: session.user?.id,
    }).catch(e => logError('[taxes] activity log failed', e))

    return apiSuccess({ data: tax }, 201)
  } catch (error) {
    logError('Error creating tax', error)
    return apiError('Không thể tạo thuế mới', 500)
  }
}
