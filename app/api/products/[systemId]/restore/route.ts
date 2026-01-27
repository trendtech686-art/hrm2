import { prisma } from '@/lib/prisma'
import { requireAuth, apiSuccess, apiError, apiNotFound } from '@/lib/api-utils'

// POST /api/products/[systemId]/restore - Restore soft-deleted product
export async function POST(
  _request: Request,
  { params }: { params: Promise<{ systemId: string }> }
) {
  const session = await requireAuth()
  if (!session) return apiError('Unauthorized', 401)

  try {
    const { systemId } = await params

    const existing = await prisma.product.findUnique({
      where: { systemId },
    })

    if (!existing) {
      return apiNotFound('Product')
    }

    const restored = await prisma.product.update({
      where: { systemId },
      data: {
        isDeleted: false,
        deletedAt: null,
      },
    })

    return apiSuccess(restored)
  } catch (error) {
    console.error('Error restoring product:', error)
    return apiError('Failed to restore product', 500)
  }
}
