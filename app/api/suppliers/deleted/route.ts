import { prisma } from '@/lib/prisma'
import { requireAuth, apiSuccess, apiError } from '@/lib/api-utils'

// GET /api/suppliers/deleted - Get all soft-deleted suppliers
export async function GET() {
  const session = await requireAuth()
  if (!session) return apiError('Unauthorized', 401)

  try {
    const deletedSuppliers = await prisma.supplier.findMany({
      where: { isDeleted: true },
      orderBy: { deletedAt: 'desc' },
    })

    return apiSuccess(deletedSuppliers)
  } catch (error) {
    console.error('Error fetching deleted suppliers:', error)
    return apiError('Failed to fetch deleted suppliers', 500)
  }
}
