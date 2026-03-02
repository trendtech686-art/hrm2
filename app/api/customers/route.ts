import { prisma } from '@/lib/prisma'
import { Prisma, CustomerStatus, CustomerLifecycle } from '@/generated/prisma/client'
import { requireAuth, validateBody, apiSuccess, apiPaginated, apiError, parsePagination } from '@/lib/api-utils'
import { createCustomerSchema } from './validation'
import { generateNextIdsWithTx } from '@/lib/id-system'

// Route segment config - force dynamic since we use auth and query params
export const dynamic = 'force-dynamic'

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
    const type = searchParams.get('type')
    const sortBy = searchParams.get('sortBy') || 'createdAt'
    const sortOrder = (searchParams.get('sortOrder') || 'desc') as 'asc' | 'desc'
    const dateFrom = searchParams.get('dateFrom')
    const dateTo = searchParams.get('dateTo')
    const debtFilter = searchParams.get('debtFilter')

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
        { taxCode: { contains: search, mode: 'insensitive' } },
      ]
    }

    if (status && status !== 'all') {
      where.status = status as CustomerStatus
    }

    if (type && type !== 'all') {
      where.type = type
    }

    if (dateFrom || dateTo) {
      where.createdAt = {}
      if (dateFrom) where.createdAt.gte = new Date(dateFrom)
      if (dateTo) where.createdAt.lte = new Date(dateTo)
    }

    // Server-side debt filtering using DB fields
    if (debtFilter && debtFilter !== 'all') {
      if (debtFilter === 'hasDebt') {
        where.currentDebt = { gt: 0 }
      } else if (debtFilter === 'overdue' || debtFilter === 'totalOverdue') {
        // Customers with currentDebt > 0 and unpaid orders older than their payment terms
        const now = new Date()
        // Get customers with debt and unpaid completed orders
        // Calculate overdue using raw query for performance
        const overdueCustomers = await prisma.$queryRaw<{ customerId: string }[]>`
          SELECT DISTINCT o."customerId" as "customerId"
          FROM orders o
          JOIN customers c ON o."customerId" = c."systemId"
          WHERE o.status != 'CANCELLED'
            AND (o.status = 'COMPLETED' OR o."deliveryStatus" = 'DELIVERED' OR o."stockOutStatus" = 'FULLY_STOCKED_OUT')
            AND o."paymentStatus" != 'PAID'
            AND c."currentDebt" > 0
            AND c."isDeleted" = false
            AND o."orderDate" + (
              CASE 
                WHEN c."paymentTerms" = 'NET60' THEN INTERVAL '60 days'
                WHEN c."paymentTerms" = 'NET15' THEN INTERVAL '15 days'
                WHEN c."paymentTerms" = 'COD' THEN INTERVAL '0 days'
                ELSE INTERVAL '30 days'
              END
            ) < ${now}
        `
        const customerIds = overdueCustomers.map(r => r.customerId).filter(Boolean)
        where.systemId = { in: customerIds.length > 0 ? customerIds : ['__none__'] }
      } else if (debtFilter === 'dueSoon') {
        // Customers with orders due within 3 days
        const now = new Date()
        const threeDaysLater = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000)
        const dueSoonCustomers = await prisma.$queryRaw<{ customerId: string }[]>`
          SELECT DISTINCT o."customerId" as "customerId"
          FROM orders o
          JOIN customers c ON o."customerId" = c."systemId"
          WHERE o.status != 'CANCELLED'
            AND (o.status = 'COMPLETED' OR o."deliveryStatus" = 'DELIVERED' OR o."stockOutStatus" = 'FULLY_STOCKED_OUT')
            AND o."paymentStatus" != 'PAID'
            AND c."currentDebt" > 0
            AND c."isDeleted" = false
            AND o."orderDate" + (
              CASE 
                WHEN c."paymentTerms" = 'NET60' THEN INTERVAL '60 days'
                WHEN c."paymentTerms" = 'NET15' THEN INTERVAL '15 days'
                WHEN c."paymentTerms" = 'COD' THEN INTERVAL '0 days'
                ELSE INTERVAL '30 days'
              END
            ) BETWEEN ${now} AND ${threeDaysLater}
        `
        const customerIds = dueSoonCustomers.map(r => r.customerId).filter(Boolean)
        where.systemId = { in: customerIds.length > 0 ? customerIds : ['__none__'] }
      }
    }

    // Build orderBy
    const orderBy: Prisma.CustomerOrderByWithRelationInput = { [sortBy]: sortOrder }

    const [customers, total] = await Promise.all([
      prisma.customer.findMany({
        where,
        skip,
        take: limit,
        orderBy,
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

    const customer = await prisma.$transaction(async (tx) => {
      // Generate IDs using unified ID system
      const { systemId, businessId } = await generateNextIdsWithTx(
        tx,
        'customers',
        body.id?.trim() || undefined
      );

      return tx.customer.create({
        data: {
          systemId,
          id: businessId,
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
      });
    });

    return apiSuccess(customer, 201)
  } catch (error) {
    console.error('Error creating customer:', error)
    
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
      return apiError('Customer ID already exists', 400)
    }

    return apiError('Failed to create customer', 500)
  }
}
