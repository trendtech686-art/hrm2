import { prisma } from '@/lib/prisma'
import { apiPaginated, parsePagination } from '@/lib/api-utils'
import { apiHandler } from '@/lib/api-handler'
import { serializeCustomer } from '../serialize'

// GET /api/customers/deleted - Get soft-deleted customers (not permanently archived)
export const GET = apiHandler(async (req) => {
  const { searchParams } = new URL(req.url)
  const { page, limit, skip } = parsePagination(searchParams)

  const [deletedCustomers, total] = await Promise.all([
    prisma.customer.findMany({
      where: { isDeleted: true, permanentlyDeletedAt: null },
      skip,
      take: limit,
      orderBy: { deletedAt: 'desc' },
      select: {
        systemId: true,
        id: true,
        name: true,
        phone: true,
        company: true,
        taxCode: true,
        status: true,
        currentDebt: true,
        maxDebt: true,
        defaultDiscount: true,
        totalSpent: true,
        deletedAt: true,
        isDeleted: true,
      },
    }),
    prisma.customer.count({ where: { isDeleted: true, permanentlyDeletedAt: null } }),
  ])

  return apiPaginated(deletedCustomers.map(serializeCustomer), { page, limit, total })
})
