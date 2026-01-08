import { prisma } from '@/lib/prisma'
import { Prisma } from '@/generated/prisma/client'
import type { SupplierStatus } from '@/lib/types/prisma-extended'
import { requireAuth, validateBody, apiSuccess, apiPaginated, apiError, parsePagination } from '@/lib/api-utils'
import { createSupplierSchema } from './validation'

// GET /api/suppliers - List all suppliers
export async function GET(request: Request) {
  const session = await requireAuth()
  if (!session) return apiError('Unauthorized', 401)

  try {
    const { searchParams } = new URL(request.url)
    const { page, limit, skip } = parsePagination(searchParams)
    const search = searchParams.get('search') || ''
    const status = searchParams.get('status')
    const all = searchParams.get('all') === 'true'

    const where: Prisma.SupplierWhereInput = {
      isDeleted: false,
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { id: { contains: search, mode: 'insensitive' } },
        { phone: { contains: search } },
        { email: { contains: search, mode: 'insensitive' } },
      ]
    }

    if (status) {
      where.status = status as SupplierStatus
    }

    if (all) {
      const suppliers = await prisma.supplier.findMany({
        where,
        orderBy: { name: 'asc' },
      })
      return apiSuccess({ data: suppliers })
    }

    const [suppliers, total] = await Promise.all([
      prisma.supplier.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          _count: { select: { purchaseOrders: true } },
        },
      }),
      prisma.supplier.count({ where }),
    ])

    return apiPaginated(suppliers, { page, limit, total })
  } catch (error) {
    console.error('Error fetching suppliers:', error)
    return apiError('Failed to fetch suppliers', 500)
  }
}

// POST /api/suppliers - Create new supplier
export async function POST(request: Request) {
  const session = await requireAuth()
  if (!session) return apiError('Unauthorized', 401)

  const result = await validateBody(request, createSupplierSchema)
  if (!result.success) return apiError(result.error, 400)

  try {
    const body = result.data

    // Generate business ID if not provided
    if (!body.id) {
      const lastSupplier = await prisma.supplier.findFirst({
        orderBy: { createdAt: 'desc' },
        select: { id: true },
      })
      const lastNum = lastSupplier?.id 
        ? parseInt(lastSupplier.id.replace('NCC', '')) 
        : 0
      body.id = `NCC${String(lastNum + 1).padStart(4, '0')}`
    }

    const supplier = await prisma.supplier.create({
      data: {
        systemId: `SUP${String(Date.now()).slice(-6).padStart(6, '0')}`,
        id: body.id,
        name: body.name,
        contactPerson: body.contactPerson,
        phone: body.phone,
        email: body.email,
        address: body.address,
        taxCode: body.taxCode,
        bankAccount: body.bankAccount,
        website: body.website,
      },
    })

    return apiSuccess(supplier, 201)
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
      return apiError('Mã nhà cung cấp đã tồn tại', 400)
    }
    console.error('Error creating supplier:', error)
    return apiError('Failed to create supplier', 500)
  }
}
