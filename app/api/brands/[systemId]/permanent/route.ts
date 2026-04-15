import { prisma } from '@/lib/prisma'
import { requireAuth, apiSuccess, apiError, apiNotFound } from '@/lib/api-utils'
import { logError } from '@/lib/logger'

interface RouteParams {
  params: Promise<{ systemId: string }>
}

// DELETE /api/brands/[systemId]/permanent - Permanently archive brand
export async function DELETE(_request: Request, { params }: RouteParams) {
  const session = await requireAuth()
  if (!session) return apiError('Unauthorized', 401)

  try {
    const { systemId } = await params

    const brand = await prisma.brand.findUnique({
      where: { systemId },
    })

    if (!brand) {
      return apiNotFound('Thương hiệu')
    }

    if (!brand.isDeleted) {
      return apiError('Thương hiệu chưa được xóa mềm, không thể lưu trữ vĩnh viễn', 400)
    }

    if (brand.permanentlyDeletedAt) {
      return apiError('Thương hiệu đã được lưu trữ vĩnh viễn', 400)
    }

    // Archive: strip sensitive/internal data, keep identity
    await prisma.$transaction(async (tx) => {
      // Delete PKGX brand mappings
      await tx.pkgxBrandMapping.deleteMany({
        where: { hrmBrandId: systemId },
      })

      // Unlink products from this brand
      await tx.product.updateMany({
        where: { brandId: systemId },
        data: { brandId: null },
      })

      // Archive: clear content data, keep identity
      await tx.brand.update({
        where: { systemId },
        data: {
          description: null,
          website: null,
          logo: null,
          logoUrl: null,
          thumbnail: null,
          seoTitle: null,
          metaDescription: null,
          seoKeywords: null,
          shortDescription: null,
          longDescription: null,
          websiteSeo: undefined,
          isActive: false,
          permanentlyDeletedAt: new Date(),
        },
      })
    })

    return apiSuccess({ message: 'Đã lưu trữ vĩnh viễn thương hiệu' })
  } catch (error) {
    logError('Error permanently archiving brand', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return apiError(`Không thể lưu trữ thương hiệu: ${errorMessage}`, 500)
  }
}
