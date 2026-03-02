import { prisma } from '@/lib/prisma'
import { requireAuth, apiSuccess, apiError } from '@/lib/api-utils'

// GET /api/categories/deleted - Get deleted categories
export async function GET() {
  const session = await requireAuth()
  if (!session) return apiError('Unauthorized', 401)

  try {
    const deletedCategories = await prisma.category.findMany({
      where: {
        isDeleted: true,
      },
      orderBy: { deletedAt: 'desc' },
    })

    return apiSuccess({ data: deletedCategories })
  } catch (error) {
    console.error('Error fetching deleted categories:', error)
    return apiError('Failed to fetch deleted categories', 500)
  }
}
