import { prisma } from '@/lib/prisma'
import { requireAuth, apiSuccess, apiError, apiNotFound } from '@/lib/api-utils'

interface RouteParams {
  params: Promise<{ systemId: string }>
}

// DELETE /api/brands/[systemId]/permanent - Permanently delete brand
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

    // Use transaction to ensure data integrity
    await prisma.$transaction(async (tx) => {
      // Delete PKGX brand mappings if any
      await tx.pkgxBrandMapping.deleteMany({
        where: { hrmBrandId: systemId },
      })

      // Unlink products from this brand before deleting
      await tx.product.updateMany({
        where: { brandId: systemId },
        data: { brandId: null },
      })

      // Now delete the brand
      await tx.brand.delete({
        where: { systemId },
      })
    })

    return apiSuccess({ message: 'Đã xóa vĩnh viễn thương hiệu' })
  } catch (error) {
    console.error('Error permanently deleting brand:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return apiError(`Không thể xóa thương hiệu: ${errorMessage}`, 500)
  }
}
