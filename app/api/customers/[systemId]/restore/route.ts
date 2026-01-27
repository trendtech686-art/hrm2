import { prisma } from '@/lib/prisma'
import { requireAuth, apiSuccess, apiError, apiNotFound } from '@/lib/api-utils'

// POST /api/customers/[systemId]/restore - Restore soft-deleted customer
export async function POST(
  _request: Request,
  { params }: { params: Promise<{ systemId: string }> }
) {
  const session = await requireAuth()
  if (!session) return apiError('Unauthorized', 401)

  try {
    const { systemId } = await params

    const existing = await prisma.customer.findUnique({
      where: { systemId },
    })

    if (!existing) {
      return apiNotFound('Customer')
    }

    const restored = await prisma.customer.update({
      where: { systemId },
      data: {
        isDeleted: false,
        deletedAt: null,
      },
    })

    return apiSuccess(restored)
  } catch (error) {
    console.error('Error restoring customer:', error)
    return apiError('Failed to restore customer', 500)
  }
}
