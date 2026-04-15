import { prisma } from '@/lib/prisma'
import { apiSuccess } from '@/lib/api-utils'
import { apiHandler } from '@/lib/api-handler'
import { serializeCustomer } from '../serialize'

// GET /api/customers/deleted - Get soft-deleted customers (not permanently archived)
export const GET = apiHandler(async () => {
    const deletedCustomers = await prisma.customer.findMany({
      where: { isDeleted: true, permanentlyDeletedAt: null },
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
    })

    return apiSuccess(deletedCustomers.map(serializeCustomer))
})
