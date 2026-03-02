import { prisma } from '@/lib/prisma'
import { requireAuth, apiSuccess, apiError, apiNotFound } from '@/lib/api-utils'

interface RouteParams {
  params: Promise<{ systemId: string }>
}

// POST /api/brands/[systemId]/restore - Restore deleted brand
export async function POST(_request: Request, { params }: RouteParams) {
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
      return apiError('Thương hiệu chưa bị xóa', 400)
    }

    const restoredBrand = await prisma.brand.update({
      where: { systemId },
      data: {
        isDeleted: false,
        deletedAt: null,
      },
    })

    return apiSuccess(restoredBrand)
  } catch (error) {
    console.error('Error restoring brand:', error)
    return apiError('Failed to restore brand', 500)
  }
}
