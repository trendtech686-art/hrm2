import { prisma } from '@/lib/prisma'
import type { Prisma } from '@/generated/prisma/client'
import { requireAuth, validateBody, apiSuccess, apiPaginated, apiError, parsePagination } from '@/lib/api-utils'
import { createPaymentSchema } from './validation'

// GET /api/payments - List all payments (phiếu chi)
export async function GET(request: Request) {
  const session = await requireAuth()
  if (!session) return apiError('Unauthorized', 401)

  try {
    const { searchParams } = new URL(request.url)
    const { page, limit, skip } = parsePagination(searchParams)
    const search = searchParams.get('search') || ''
    const status = searchParams.get('status')
    const supplierId = searchParams.get('supplierId')

    const where: Prisma.PaymentWhereInput = {}

    if (search) {
      where.OR = [
        { id: { contains: search, mode: 'insensitive' } },
        { suppliers: { name: { contains: search, mode: 'insensitive' } } },
      ]
    }

    if (status) {
      where.status = status
    }

    if (supplierId) {
      where.supplierId = supplierId
    }

    const [payments, total] = await Promise.all([
      prisma.payment.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          purchaseOrder: {
            select: { systemId: true, id: true },
          },
          suppliers: {
            select: { systemId: true, id: true, name: true },
          },
        },
      }),
      prisma.payment.count({ where }),
    ])

    return apiPaginated(payments, { page, limit, total })
  } catch (error) {
    console.error('Error fetching payments:', error)
    return apiError('Failed to fetch payments', 500)
  }
}

// POST /api/payments - Create new payment
export async function POST(request: Request) {
  const session = await requireAuth()
  if (!session) return apiError('Unauthorized', 401)

  const validation = await validateBody(request, createPaymentSchema)
  if (!validation.success) {
    return apiError(validation.error, 400)
  }
  const body = validation.data

  try {
    // Generate business ID
    let businessId = body.id
    if (!businessId) {
      const lastPayment = await prisma.payment.findFirst({
        orderBy: { createdAt: 'desc' },
        select: { id: true },
      })
      const lastNum = lastPayment?.id 
        ? parseInt(lastPayment.id.replace('PC', '')) 
        : 0
      businessId = `PC${String(lastNum + 1).padStart(6, '0')}`
    }

    if (!body.branchId) {
      return apiError('Branch ID is required', 400)
    }

    const payment = await prisma.payment.create({
      data: {
        systemId: `PAY${String(Date.now()).slice(-10).padStart(10, '0')}`,
        id: businessId,
        supplierId: body.supplierId,
        purchaseOrderId: body.purchaseOrderId,
        branchId: body.branchId,
        type: 'SUPPLIER_PAYMENT',
        amount: body.amount,
        paymentMethod: body.method || body.paymentMethod || 'CASH',
        paymentDate: body.paymentDate ? new Date(body.paymentDate) : new Date(),
        description: body.description,
      },
      include: {
        purchaseOrder: true,
        suppliers: true,
      },
    })

    return apiSuccess(payment, 201)
  } catch (error) {
    console.error('Error creating payment:', error)
    return apiError('Failed to create payment', 500)
  }
}
