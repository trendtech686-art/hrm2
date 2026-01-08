import { prisma } from '@/lib/prisma'
import { Prisma, CustomerStatus, CustomerLifecycle } from '@/generated/prisma/client'
import { requireAuth, validateBody, apiSuccess, apiPaginated, apiError, parsePagination } from '@/lib/api-utils'
import { createCustomerSchema } from './validation'

// GET /api/customers - List all customers
export async function GET(request: Request) {
  try {
    // Auth check
    const session = await requireAuth()
    if (!session) return apiError('Unauthorized', 401)

    const { searchParams } = new URL(request.url)
    const { page, limit, skip } = parsePagination(searchParams)
    const search = searchParams.get('search') || ''
    const status = searchParams.get('status')

    const where: Prisma.CustomerWhereInput = {
      isDeleted: false,
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { id: { contains: search, mode: 'insensitive' } },
        { phone: { contains: search } },
        { email: { contains: search, mode: 'insensitive' } },
        { company: { contains: search, mode: 'insensitive' } },
      ]
    }

    if (status) {
      where.status = status as CustomerStatus
    }

    const [customers, total] = await Promise.all([
      prisma.customer.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.customer.count({ where }),
    ])

    return apiPaginated(customers, { page, limit, total })
  } catch (error) {
    console.error('Error fetching customers:', error)
    return apiError('Failed to fetch customers', 500)
  }
}

// POST /api/customers - Create new customer
export async function POST(request: Request) {
  try {
    // Auth check
    const session = await requireAuth()
    if (!session) return apiError('Unauthorized', 401)

    // Validate body
    const result = await validateBody(request, createCustomerSchema)
    if (!result.success) return apiError(result.error, 400)
    
    const body = result.data

    // Generate business ID if not provided
    if (!body.id) {
      const lastCustomer = await prisma.customer.findFirst({
        orderBy: { createdAt: 'desc' },
        select: { id: true },
      })
      const lastNum = lastCustomer?.id 
        ? parseInt(lastCustomer.id.replace('KH', '')) 
        : 0
      body.id = `KH${String(lastNum + 1).padStart(5, '0')}`
    }

    const customer = await prisma.customer.create({
      data: {
        systemId: `CUSTOMER${String(Date.now()).slice(-6).padStart(6, '0')}`,
        id: body.id,
        name: body.name,
        email: body.email,
        phone: body.phone,
        companyName: body.company || body.companyName,
        company: body.company || body.companyName,
        taxCode: body.taxCode,
        representative: body.representative || body.contactPerson,
        addresses: body.addresses,
        maxDebt: body.maxDebt || body.creditLimit,
        lifecycleStage: (body.lifecycleStage || body.customerType) as CustomerLifecycle | undefined,
        notes: body.notes,
        createdBy: session.user.id,
      },
    })

    return apiSuccess(customer, 201)
  } catch (error) {
    console.error('Error creating customer:', error)
    
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
      return apiError('Customer ID already exists', 400)
    }

    return apiError('Failed to create customer', 500)
  }
}
