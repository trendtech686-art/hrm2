import { prisma } from '@/lib/prisma'
import { apiSuccess } from '@/lib/api-utils'
import { apiHandler } from '@/lib/api-handler'

export const dynamic = 'force-dynamic'

// GET /api/customers/ids - Return only business IDs for uniqueness validation
export const GET = apiHandler(async () => {
    const customers = await prisma.customer.findMany({
      where: { isDeleted: false },
      select: { id: true },
      orderBy: { id: 'asc' },
    })

    return apiSuccess(customers.map(c => c.id))
})
