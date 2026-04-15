import { prisma } from '@/lib/prisma'
import { requireAuth, apiSuccess, apiError } from '@/lib/api-utils'
import { logError } from '@/lib/logger'

// GET /api/categories/deleted - Get deleted categories
export async function GET() {
  const session = await requireAuth()
  if (!session) return apiError('Unauthorized', 401)

  try {
    const deletedCategories = await prisma.category.findMany({
      where: {
        isDeleted: true,
        permanentlyDeletedAt: null,
      },
      select: {
        systemId: true,
        id: true,
        name: true,
        slug: true,
        parentId: true,
        path: true,
        level: true,
        description: true,
        isActive: true,
        isDeleted: true,
        deletedAt: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: { deletedAt: 'desc' },
    })

    return apiSuccess({ data: deletedCategories })
  } catch (error) {
    logError('Error fetching deleted categories', error)
    return apiError('Không thể tải danh mục đã xóa', 500)
  }
}
