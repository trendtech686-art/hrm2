import { prisma } from '@/lib/prisma'
import { requireAuth, apiSuccess, apiError, apiNotFound } from '@/lib/api-utils'
import { logError } from '@/lib/logger'

interface RouteParams {
  params: Promise<{ systemId: string }>
}

// DELETE /api/categories/[systemId]/permanent - Permanently archive category
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

    if (!category.isDeleted) {
      return apiError('Danh mục chưa được xóa mềm, không thể lưu trữ vĩnh viễn', 400)
    }

    if (category.permanentlyDeletedAt) {
      return apiError('Danh mục đã được lưu trữ vĩnh viễn', 400)
    }

    // Check if category has children - must handle children first
    if (category._count.children > 0) {
      return apiError('Không thể lưu trữ vĩnh viễn danh mục đang có danh mục con. Hãy xử lý danh mục con trước.', 400)
    }

    // Archive: strip content data, keep identity for product references
    await prisma.$transaction(async (tx) => {
      // Delete PKGX category mapping
      await tx.pkgxCategoryMapping.deleteMany({
        where: { hrmCategoryId: systemId },
      })

      // Delete product-category relationships
      await tx.productCategory.deleteMany({
        where: { categoryId: systemId },
      })

      // Archive: clear SEO/content data, keep identity
      await tx.category.update({
        where: { systemId },
        data: {
          seoTitle: null,
          metaDescription: null,
          seoKeywords: null,
          shortDescription: null,
          longDescription: null,
          ogImage: null,
          websiteSeo: undefined,
          description: null,
          imageUrl: null,
          thumbnail: null,
          color: null,
          icon: null,
          isActive: false,
          permanentlyDeletedAt: new Date(),
        },
      })
    })

    return apiSuccess({ message: 'Đã lưu trữ vĩnh viễn danh mục' })
  } catch (error) {
    logError('Error permanently archiving category', error)
    return apiError('Không thể lưu trữ danh mục vĩnh viễn', 500)
  }
}
