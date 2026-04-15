import { prisma } from '@/lib/prisma'
import { Prisma, CustomerStatus } from '@/generated/prisma/client'
import { validateBody, apiSuccess, apiPaginated, apiError, parsePagination } from '@/lib/api-utils'
import { apiHandler } from '@/lib/api-handler'
import { createCustomerSchema } from './validation'
import { serializeCustomer } from './serialize'
import { generateNextIdsWithTx } from '@/lib/id-system'
import { getUserNameFromDb } from '@/lib/get-user-name'
import { logError } from '@/lib/logger'
import { createNotification } from '@/lib/notifications'

// Route segment config - force dynamic since we use auth and query params
export const dynamic = 'force-dynamic'

// GET /api/customers - List all customers
export const GET = apiHandler(async (request, { session }) => {
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
        where.currentDebt = { not: 0 }
      } else if (debtFilter === 'noDebt') {
        where.currentDebt = { equals: 0 }
      } else if (debtFilter === 'customerOwes') {
        // Phải thu: khách nợ mình
        where.currentDebt = { gt: 0 }
      } else if (debtFilter === 'weOwe') {
        // Phải trả: mình nợ khách
        where.currentDebt = { lt: 0 }
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
            AND c."currentDebt" != 0
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
            AND c."currentDebt" != 0
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

    // Serialize Decimal fields to numbers for JSON response
    const serialized = customers.map(c => ({
      ...c,
      currentDebt: c.currentDebt != null ? Number(c.currentDebt) : null,
      maxDebt: c.maxDebt != null ? Number(c.maxDebt) : null,
      defaultDiscount: c.defaultDiscount != null ? Number(c.defaultDiscount) : null,
      totalSpent: c.totalSpent != null ? Number(c.totalSpent) : null,
    }))

    return apiPaginated(serialized, { page, limit, total })
})

// POST /api/customers - Create new customer
export const POST = apiHandler(async (request, { session }) => {
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
        phone: body.phone,
        companyName: body.company || body.companyName,
        company: body.company || body.companyName,
        taxCode: body.taxCode,
        representative: body.representative || body.contactPerson,
        position: body.position,
        addresses: body.addresses,
        maxDebt: body.maxDebt || body.creditLimit,
        status: body.status as CustomerStatus | undefined,
        notes: body.notes,
        tags: body.tags,
        // Personal info
        gender: body.gender,
        dateOfBirth: body.dateOfBirth ? new Date(body.dateOfBirth) : undefined,
        // Flat address fields
        address: body.address,
        province: body.province,
        district: body.district,
        ward: body.ward,
        // Classification
        type: body.type,
        customerGroup: body.customerGroup,
        pricingPolicyId: body.pricingPolicyId,
        defaultDiscount: body.defaultDiscount,
        // Source & Campaign
        source: body.source,
        campaign: body.campaign,
        referredBy: body.referredBy,
        // Contact
        zaloPhone: body.zaloPhone,
        // Payment terms
        paymentTerms: body.paymentTerms,
        creditRating: body.creditRating,
        allowCredit: body.allowCredit,
        // Multiple contacts
        contacts: body.contacts,
        // Business Profiles
        businessProfiles: body.businessProfiles,
        // Images & Social
        images: body.images,
        social: body.social,
        // Account manager
        accountManagerId: body.accountManagerId,
        createdBy: session!.user.id,
      },
      });
    });

    // Log activity for customer creation (fire-and-forget)
    getUserNameFromDb(session!.user?.id).then(userName =>
      prisma.activityLog.create({
        data: {
          entityType: 'customer',
          entityId: customer.systemId,
          action: 'created',
          actionType: 'create',
          note: `Tạo mới khách hàng: ${customer.name} (${customer.id || customer.systemId})`,
          metadata: { userName, customerName: customer.name },
          createdBy: userName,
        }
      })
    ).catch(e => logError('Activity log failed', e))

    // Notify account manager if assigned
    if (customer.accountManagerId && customer.accountManagerId !== session!.user?.employeeId) {
      createNotification({
        type: 'customer',
        title: 'Khách hàng mới được giao',
        message: `Bạn được giao quản lý khách hàng ${customer.name} (${customer.id})`,
        link: `/customers/${customer.systemId}`,
        recipientId: customer.accountManagerId,
        senderId: session!.user?.employeeId,
        senderName: session!.user?.name,
        settingsKey: 'customer:new',
      }).catch(e => logError('[Customer POST] notification failed', e))
    }

    return apiSuccess(serializeCustomer(customer), 201)
}, { permission: 'create_customers' })
