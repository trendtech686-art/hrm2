import { prisma } from '@/lib/prisma'
import { requireAuth, validateBody, apiSuccess, apiError } from '@/lib/api-utils'
import { createPaymentMethodSchema } from './validation'

// GET /api/settings/payment-methods - Get all payment methods
export async function GET(request: Request) {
  const session = await requireAuth()
  if (!session) return apiError('Vui lòng đăng nhập', 401)

  try {
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '100')

    const methods = await prisma.paymentMethod.findMany({
      take: limit,
      orderBy: { createdAt: 'asc' },
    })

    // Map to frontend format
    const data = methods.map((m) => ({
      systemId: m.systemId,
      id: m.id,
      name: m.name,
      code: m.code,
      type: m.type,
      isActive: m.isActive,
      isDefault: false, // Will be set by frontend or add a column
    }))

    return apiSuccess({ data })
  } catch (error) {
    console.error('Error fetching payment methods:', error)
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
    const method = await prisma.paymentMethod.create({
      data: {
        systemId: body.systemId || `PM_${Date.now()}`,
        id: body.id || `PM${Date.now()}`,
        name: body.name,
        code: body.code || 'UNKNOWN',
        type: body.type || 'other',
        isActive: body.isActive ?? true,
      },
    })

    return apiSuccess({ data: method })
  } catch (error) {
    console.error('Error creating payment method:', error)
    return apiError('Failed to create payment method', 500)
  }
}
