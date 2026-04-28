import { prisma } from '@/lib/prisma'
import { requireAuth, validateBody, apiSuccess, apiError, parsePagination, apiPaginated } from '@/lib/api-utils'
import { API_MAX_PAGE_LIMIT } from '@/lib/pagination-constants'
import { logError } from '@/lib/logger'
import { createActivityLog } from '@/lib/services/activity-log-service'
import { generateNextIds } from '@/lib/id-system'
import { createPaymentMethodSchema } from './validation'

// GET /api/settings/payment-methods - Get all payment methods
export async function GET(request: Request) {
  const session = await requireAuth()
  if (!session) return apiError('Vui lòng đăng nhập', 401)

  try {
    const { searchParams } = new URL(request.url)
    const { page, limit, skip } = parsePagination(searchParams)
    const safeLimit = Math.min(limit, API_MAX_PAGE_LIMIT)

    const [methods, total] = await Promise.all([
      prisma.paymentMethod.findMany({
        skip,
        take: safeLimit,
        orderBy: { createdAt: 'asc' },
      }),
      prisma.paymentMethod.count({}),
    ])

    // Map to frontend format
    const data = methods.map((m) => ({
      systemId: m.systemId,
      id: m.id,
      name: m.name,
      code: m.code,
      type: m.type,
      description: m.description,
      isActive: m.isActive,
      isDefault: m.isDefault ?? false,
    }))

    return apiPaginated(data, { page, limit, total })
  } catch (error) {
    logError('Error fetching payment methods', error)
    return apiError('Không thể tải danh sách phương thức thanh toán', 500)
  }
}

// POST /api/settings/payment-methods - Create payment method
export async function POST(request: Request) {
  const session = await requireAuth()
  if (!session) return apiError('Vui lòng đăng nhập', 401)

  const validation = await validateBody(request, createPaymentMethodSchema)
  if (!validation.success) {
    return apiError(validation.error, 400)
  }
  const body = validation.data

  try {
    const { systemId, businessId } = await generateNextIds('payment-methods')
    
    const method = await prisma.paymentMethod.create({
      data: {
        systemId: body.systemId || systemId,
        id: body.id || businessId,
        name: body.name,
        code: body.code || 'UNKNOWN',
        type: body.type || 'other',
        description: body.description,
        isActive: body.isActive ?? true,
        isDefault: body.isDefault ?? false,
      },
    })

    createActivityLog({
      entityType: 'payment_method',
      entityId: method.systemId,
      action: `Thêm phương thức thanh toán: ${body.name}`,
      actionType: 'create',
      createdBy: session.user?.id,
    }).catch(e => logError('activity log failed', e))

    return apiSuccess({ data: method })
  } catch (error) {
    logError('Error creating payment method', error)
    return apiError('Failed to create payment method', 500)
  }
}
