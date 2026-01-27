import { prisma } from '@/lib/prisma'
import { requireAuth, apiSuccess, apiError } from '@/lib/api-utils'

// GET /api/products/deleted - Get all soft-deleted products
export async function GET() {
  const session = await requireAuth()
  if (!session) return apiError('Unauthorized', 401)

  try {
    const deletedProducts = await prisma.product.findMany({
      where: { isDeleted: true },
      orderBy: { deletedAt: 'desc' },
      include: {
        productCategories: true,
        brand: true,
      },
    })

    return apiSuccess(deletedProducts)
  } catch (error) {
    console.error('Error fetching deleted products:', error)
    return apiError('Failed to fetch deleted products', 500)
  }
}
