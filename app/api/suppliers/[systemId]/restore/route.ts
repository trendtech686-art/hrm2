import { prisma } from '@/lib/prisma'
import { requireAuth, apiSuccess, apiError, apiNotFound } from '@/lib/api-utils'

// POST /api/suppliers/[systemId]/restore - Restore soft-deleted supplier
export async function POST(
  _request: Request,
  { params }: { params: Promise<{ systemId: string }> }
) {
  const session = await requireAuth()
  if (!session) return apiError('Unauthorized', 401)

  try {
    const { systemId } = await params

    const existing = await prisma.supplier.findUnique({
      where: { systemId },
    })

    if (!existing) {
      return apiNotFound('Supplier')
    }

    const restored = await prisma.supplier.update({
      where: { systemId },
      data: {
        isDeleted: false,
        deletedAt: null,
      },
    })

    return apiSuccess(restored)
  } catch (error) {
    console.error('Error restoring supplier:', error)
    return apiError('Failed to restore supplier', 500)
  }
}
