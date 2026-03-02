import { prisma } from '@/lib/prisma'
import { requireAuth, apiSuccess, apiError, apiNotFound } from '@/lib/api-utils'

interface RouteParams {
  params: Promise<{ systemId: string }>
}

// DELETE /api/categories/[systemId]/permanent - Permanently delete category
export async function DELETE(_request: Request, { params }: RouteParams) {
  const session = await requireAuth()
  if (!session) return apiError('Unauthorized', 401)

  try {
    const { systemId } = await params

    const category = await prisma.category.findUnique({
      where: { systemId },
      include: {
        _count: { select: { children: true } },
      },
    })

    if (!category) {
      return apiNotFound('Danh mục')
    }

    // Check if category has children - must delete children first
    if (category._count.children > 0) {
      return apiError('Không thể xóa vĩnh viễn danh mục đang có danh mục con. Hãy xóa danh mục con trước.', 400)
    }

    // Use transaction to delete all related data
    await prisma.$transaction(async (tx) => {
      // Delete PKGX category mapping if exists
      await tx.pkgxCategoryMapping.deleteMany({
        where: { hrmCategoryId: systemId },
      })

      // Delete product-category relationships
      await tx.productCategory.deleteMany({
        where: { categoryId: systemId },
      })

      // Now delete the category
      await tx.category.delete({
        where: { systemId },
      })
    })

    return apiSuccess({ message: 'Đã xóa vĩnh viễn danh mục' })
  } catch (error) {
    console.error('Error permanently deleting category:', error)
    return apiError('Failed to permanently delete category', 500)
  }
}
