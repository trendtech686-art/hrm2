import { prisma } from '@/lib/prisma'
import { requireAuth, apiSuccess, apiError, apiNotFound } from '@/lib/api-utils'
import { logError } from '@/lib/logger'

interface RouteParams {
  params: Promise<{ systemId: string }>
}

// POST /api/categories/[systemId]/restore - Restore deleted category
export async function POST(_request: Request, { params }: RouteParams) {
  const session = await requireAuth()
  if (!session) return apiError('Unauthorized', 401)

  try {
    const { systemId } = await params

    const category = await prisma.category.findUnique({
      where: { systemId },
    })

    if (!category) {
      return apiNotFound('Danh mục')
    }

    if (!category.isDeleted) {
      return apiError('Danh mục chưa bị xóa', 400)
    }

    if (category.permanentlyDeletedAt) {
      return apiError('Danh mục đã được lưu trữ vĩnh viễn, không thể khôi phục', 400)
    }

    const restoredCategory = await prisma.category.update({
      where: { systemId },
      data: {
        isDeleted: false,
        deletedAt: null,
      },
    })

    return apiSuccess(restoredCategory)
  } catch (error) {
    logError('Error restoring category', error)
    return apiError('Không thể khôi phục danh mục', 500)
  }
}
