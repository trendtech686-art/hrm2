import { prisma } from '@/lib/prisma'
import type { Prisma } from '@/generated/prisma/client'
import { requireAuth, validateBody, apiSuccess, apiPaginated, apiError, parsePagination } from '@/lib/api-utils'
import { createReceiptSchema } from './validation'

// GET /api/receipts - List all receipts (phiếu thu)
export async function GET(request: Request) {
  const session = await requireAuth()
  if (!session) return apiError('Unauthorized', 401)

  try {
    const { searchParams } = new URL(request.url)
    const { page, limit, skip } = parsePagination(searchParams)
    const search = searchParams.get('search') || ''
    const status = searchParams.get('status')
    const customerId = searchParams.get('customerId')

    const where: Prisma.ReceiptWhereInput = {}

    if (search) {
      where.OR = [
        { id: { contains: search, mode: 'insensitive' } },
        { customers: { name: { contains: search, mode: 'insensitive' } } },
      ]
    }

    if (status) {
      where.status = status
    }

    if (customerId) {
      where.customerId = customerId
    }

    const [receipts, total] = await Promise.all([
      prisma.receipt.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          order: {
            select: { systemId: true, id: true },
          },
          customers: {
            select: { systemId: true, id: true, name: true },
          },
        },
      }),
      prisma.receipt.count({ where }),
    ])

    return apiPaginated(receipts, { page, limit, total })
  } catch (error) {
    console.error('Error fetching receipts:', error)
    return apiError('Failed to fetch receipts', 500)
  }
}

// POST /api/receipts - Create new receipt
export async function POST(request: Request) {
  const session = await requireAuth()
  if (!session) return apiError('Unauthorized', 401)

  const validation = await validateBody(request, createReceiptSchema)
  if (!validation.success) {
    return apiError(validation.error, 400)
  }
  const body = validation.data

  try {
    // Generate business ID
    let businessId = body.id
    if (!businessId) {
      const lastReceipt = await prisma.receipt.findFirst({
        orderBy: { createdAt: 'desc' },
        select: { id: true },
      })
      const lastNum = lastReceipt?.id 
        ? parseInt(lastReceipt.id.replace('PT', '')) 
        : 0
      businessId = `PT${String(lastNum + 1).padStart(6, '0')}`
    }

    if (!body.branchId) {
      return apiError('Branch ID is required', 400)
    }

    const receipt = await prisma.receipt.create({
      data: {
        systemId: `REC${String(Date.now()).slice(-10).padStart(10, '0')}`,
        id: businessId,
        customerId: body.customerId,
        orderId: body.orderId,
        branchId: body.branchId,
        type: 'CUSTOMER_PAYMENT',
        amount: body.amount,
        paymentMethod: body.method || body.paymentMethod || 'CASH',
        receiptDate: body.receiptDate ? new Date(body.receiptDate) : new Date(),
        description: body.description,
      },
      include: {
        order: true,
        customers: true,
      },
    })

    return apiSuccess(receipt, 201)
  } catch (error) {
    console.error('Error creating receipt:', error)
    return apiError('Failed to create receipt', 500)
  }
}
