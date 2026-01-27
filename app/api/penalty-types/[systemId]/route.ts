import { prisma } from '@/lib/prisma'
import { Prisma } from '@/generated/prisma/client'
import { requireAuth, apiSuccess, apiError, apiNotFound } from '@/lib/api-utils'

type RouteParams = { params: Promise<{ systemId: string }> }

// GET /api/penalty-types/[systemId]
export async function GET(_request: Request, { params }: RouteParams) {
  const session = await requireAuth()
  if (!session) return apiError('Unauthorized', 401)

  try {
    const { systemId } = await params

    const penaltyType = await prisma.penaltyTypeSetting.findUnique({
      where: { systemId },
    })

    if (!penaltyType || penaltyType.isDeleted) {
      return apiNotFound('Loại phạt')
    }

    return apiSuccess(penaltyType)
  } catch (error) {
    console.error('Error fetching penalty type:', error)
    return apiError('Failed to fetch penalty type', 500)
  }
}

// PUT /api/penalty-types/[systemId]
export async function PUT(request: Request, { params }: RouteParams) {
  const session = await requireAuth()
  if (!session) return apiError('Unauthorized', 401)

  try {
    const { systemId } = await params
    const body = await request.json()

    const penaltyType = await prisma.penaltyTypeSetting.update({
      where: { systemId },
      data: {
        id: body.id,
        name: body.name,
        description: body.description,
        defaultAmount: body.defaultAmount,
        category: body.category,
        isActive: body.isActive,
        sortOrder: body.sortOrder,
      },
    })

    return apiSuccess(penaltyType)
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
      return apiNotFound('Loại phạt')
    }
    console.error('Error updating penalty type:', error)
    return apiError('Failed to update penalty type', 500)
  }
}

// DELETE /api/penalty-types/[systemId]
export async function DELETE(_request: Request, { params }: RouteParams) {
  const session = await requireAuth()
  if (!session) return apiError('Unauthorized', 401)

  try {
    const { systemId } = await params

    // Soft delete
    await prisma.penaltyTypeSetting.update({
      where: { systemId },
      data: {
        isDeleted: true,
        deletedAt: new Date(),
      },
    })

    return apiSuccess({ message: 'Đã xóa loại phạt' })
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
      return apiNotFound('Loại phạt')
    }
    console.error('Error deleting penalty type:', error)
    return apiError('Failed to delete penalty type', 500)
  }
}
