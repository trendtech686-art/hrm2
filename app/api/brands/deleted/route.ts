import { prisma } from '@/lib/prisma'
import { requireAuth, apiSuccess, apiError } from '@/lib/api-utils'
import { logError } from '@/lib/logger'

// GET /api/brands/deleted - Get deleted brands
export async function GET() {
  const session = await requireAuth()
  if (!session) return apiError('Unauthorized', 401)

  try {
    const deletedBrands = await prisma.brand.findMany({
      where: {
        isDeleted: true,
        permanentlyDeletedAt: null,
      },
      select: {
        systemId: true,
        id: true,
        name: true,
        description: true,
        logo: true,
        logoUrl: true,
        isActive: true,
        isDeleted: true,
        deletedAt: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: { deletedAt: 'desc' },
    })

    return apiSuccess({ data: deletedBrands })
  } catch (error) {
    logError('Error fetching deleted brands', error)
    return apiError('Không thể tải thương hiệu đã xóa', 500)
  }
}
