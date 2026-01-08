import { prisma } from '@/lib/prisma'
import { Prisma, WarrantyStatus } from '@/generated/prisma/client'
import { requireAuth, validateBody, apiSuccess, apiPaginated, apiError, parsePagination } from '@/lib/api-utils'
import { createWarrantySchema } from './validation'

// GET /api/warranties - List all warranties
export async function GET(request: Request) {
  const session = await requireAuth()
  if (!session) return apiError('Unauthorized', 401)

  try {
    const { searchParams } = new URL(request.url)
    const { page, limit, skip } = parsePagination(searchParams)
    const search = searchParams.get('search') || ''
    const status = searchParams.get('status')
    const customerId = searchParams.get('customerId')

    const where: Prisma.WarrantyWhereInput = {
      isDeleted: false,
    }

    if (search) {
      where.OR = [
        { id: { contains: search, mode: 'insensitive' } },
        { customers: { name: { contains: search, mode: 'insensitive' } } },
        { product: { name: { contains: search, mode: 'insensitive' } } },
      ]
    }

    if (status) {
      where.status = status as WarrantyStatus
    }

    if (customerId) {
      where.customerId = customerId
    }

    const [warranties, total] = await Promise.all([
      prisma.warranty.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          product: {
            select: { systemId: true, id: true, name: true, imageUrl: true },
          },
        },
      }),
      prisma.warranty.count({ where }),
    ])

    return apiPaginated(warranties, { page, limit, total })
  } catch (error) {
    console.error('Error fetching warranties:', error)
    return apiError('Failed to fetch warranties', 500)
  }
}

// POST /api/warranties - Create new warranty
export async function POST(request: Request) {
  const session = await requireAuth()
  if (!session) return apiError('Unauthorized', 401)

  const result = await validateBody(request, createWarrantySchema)
  if (!result.success) return apiError(result.error, 400)

  try {
    const body = result.data

    // Generate business ID
    if (!body.id) {
      const lastWarranty = await prisma.warranty.findFirst({
        orderBy: { createdAt: 'desc' },
        select: { id: true },
      })
      const lastNum = lastWarranty?.id 
        ? parseInt(lastWarranty.id.replace('BH', '')) 
        : 0
      body.id = `BH${String(lastNum + 1).padStart(6, '0')}`
    }

    const warranty = await prisma.warranty.create({
      data: {
        systemId: `WAR${String(Date.now()).slice(-10).padStart(10, '0')}`,
        id: body.id,
        productId: body.productId,
        orderId: body.orderId,
        customerId: body.customerId,
        customerName: body.customerName || '',
        customerPhone: body.customerPhone || '',
        productName: body.productName || '',
        serialNumber: body.serialNumber,
        title: body.title || 'Phiếu bảo hành',
        description: body.description,
        issueDescription: body.issueDescription,
        notes: body.notes,
        status: (body.status || 'RECEIVED') as WarrantyStatus,
        startedAt: body.startDate ? new Date(body.startDate) : undefined,
        warrantyExpireDate: body.endDate ? new Date(body.endDate) : undefined,
        solution: body.solution,
      },
      include: {
        product: true,
      },
    })

    return apiSuccess(warranty, 201)
  } catch (error) {
    console.error('Error creating warranty:', error)
    return apiError('Failed to create warranty', 500)
  }
}
