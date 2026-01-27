import { prisma } from '@/lib/prisma'
import { requireAuth, apiSuccess, apiError } from '@/lib/api-utils'

// GET /api/customers/deleted - Get all soft-deleted customers
export async function GET() {
  const session = await requireAuth()
  if (!session) return apiError('Unauthorized', 401)

  try {
    const deletedCustomers = await prisma.customer.findMany({
      where: { isDeleted: true },
      orderBy: { deletedAt: 'desc' },
    })

    return apiSuccess(deletedCustomers)
  } catch (error) {
    console.error('Error fetching deleted customers:', error)
    return apiError('Failed to fetch deleted customers', 500)
  }
}
