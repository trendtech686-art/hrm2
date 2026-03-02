import { prisma } from '@/lib/prisma'
import { requireAuth, apiSuccess, apiError } from '@/lib/api-utils'

// GET /api/brands/deleted - Get deleted brands
export async function GET() {
  const session = await requireAuth()
  if (!session) return apiError('Unauthorized', 401)

  try {
    const deletedBrands = await prisma.brand.findMany({
      where: {
        isDeleted: true,
      },
      orderBy: { deletedAt: 'desc' },
    })

    return apiSuccess({ data: deletedBrands })
  } catch (error) {
    console.error('Error fetching deleted brands:', error)
    return apiError('Failed to fetch deleted brands', 500)
  }
}
