import { prisma } from '@/lib/prisma'
import { Prisma } from '@/generated/prisma/client'
import { requireAuth, apiSuccess, apiError, apiNotFound } from '@/lib/api-utils'

type RouteParams = { params: Promise<{ systemId: string }> }

// GET /api/complaint-types/[systemId]
export async function GET(_request: Request, { params }: RouteParams) {
  const session = await requireAuth()
  if (!session) return apiError('Unauthorized', 401)

  try {
    const { systemId } = await params

    const complaintType = await prisma.complaintTypeSetting.findUnique({
      where: { systemId },
    })

    if (!complaintType || complaintType.isDeleted) {
      return apiNotFound('Loại khiếu nại')
    }

    return apiSuccess(complaintType)
  } catch (error) {
    console.error('Error fetching complaint type:', error)
    return apiError('Failed to fetch complaint type', 500)
  }
}

// PUT /api/complaint-types/[systemId]
export async function PUT(request: Request, { params }: RouteParams) {
  const session = await requireAuth()
  if (!session) return apiError('Unauthorized', 401)

  try {
    const { systemId } = await params
    const body = await request.json()

    // If setting as default, unset other defaults
    if (body.isDefault) {
      await prisma.complaintTypeSetting.updateMany({
        where: { isDefault: true, systemId: { not: systemId } },
        data: { isDefault: false },
      })
    }

    const complaintType = await prisma.complaintTypeSetting.update({
      where: { systemId },
      data: {
        id: body.id,
        name: body.name,
        description: body.description,
        color: body.color,
        isActive: body.isActive,
        isDefault: body.isDefault,
        sortOrder: body.sortOrder,
      },
    })

    return apiSuccess(complaintType)
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
      return apiNotFound('Loại khiếu nại')
    }
    console.error('Error updating complaint type:', error)
    return apiError('Failed to update complaint type', 500)
  }
}

// DELETE /api/complaint-types/[systemId]
export async function DELETE(_request: Request, { params }: RouteParams) {
  const session = await requireAuth()
  if (!session) return apiError('Unauthorized', 401)

  try {
    const { systemId } = await params

    // Soft delete
    await prisma.complaintTypeSetting.update({
      where: { systemId },
      data: {
        isDeleted: true,
        deletedAt: new Date(),
      },
    })

    return apiSuccess({ message: 'Đã xóa loại khiếu nại' })
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
      return apiNotFound('Loại khiếu nại')
    }
    console.error('Error deleting complaint type:', error)
    return apiError('Failed to delete complaint type', 500)
  }
}
