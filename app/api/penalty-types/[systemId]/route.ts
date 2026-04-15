import { prisma } from '@/lib/prisma'
import { Prisma } from '@/generated/prisma/client'
import { requireAuth, apiSuccess, apiError, apiNotFound } from '@/lib/api-utils'
import { logError } from '@/lib/logger'
import { createActivityLog } from '@/lib/services/activity-log-service'

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
    logError('Error fetching penalty type', error)
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

    // Read existing for diff
    const existing = await prisma.penaltyTypeSetting.findUnique({
      where: { systemId },
    })
    if (!existing || existing.isDeleted) {
      return apiError('Loại phạt không tồn tại', 404)
    }

    const penaltyType = await prisma.penaltyTypeSetting.update({
      where: { systemId },
      data: {
        ...(body.id !== undefined && { id: body.id }),
        ...(body.name !== undefined && { name: body.name }),
        ...(body.description !== undefined && { description: body.description }),
        ...(body.defaultAmount !== undefined && { defaultAmount: body.defaultAmount }),
        ...(body.category !== undefined && { category: body.category }),
        ...(body.isActive !== undefined && { isActive: body.isActive }),
        ...(body.sortOrder !== undefined && { sortOrder: body.sortOrder }),
      },
    })

    // Activity log with diff
    const changes: Record<string, { from: unknown; to: unknown }> = {}
    if (body.name !== undefined && body.name !== existing.name) changes['Tên'] = { from: existing.name, to: body.name }
    if (body.description !== undefined && body.description !== existing.description) changes['Mô tả'] = { from: existing.description ?? '', to: body.description ?? '' }
    if (body.defaultAmount !== undefined && body.defaultAmount !== existing.defaultAmount) changes['Số tiền phạt'] = { from: existing.defaultAmount, to: body.defaultAmount }
    if (body.category !== undefined && body.category !== existing.category) changes['Danh mục'] = { from: existing.category, to: body.category }
    if (body.isActive !== undefined && body.isActive !== existing.isActive) changes['Trạng thái'] = { from: existing.isActive ? 'Hoạt động' : 'Ngừng', to: body.isActive ? 'Hoạt động' : 'Ngừng' }

    if (Object.keys(changes).length > 0) {
      const changeDetail = Object.keys(changes).join(', ')
      createActivityLog({
        entityType: 'penalty_type',
        entityId: systemId,
        action: `Cập nhật loại phạt: ${existing.name}: ${changeDetail}`,
        actionType: 'update',
        changes,
        createdBy: session.user?.id,
      }).catch(e => logError('activity log failed', e))
    }

    return apiSuccess(penaltyType)
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
      return apiNotFound('Loại phạt')
    }
    logError('Error updating penalty type', error)
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

    createActivityLog({
      entityType: 'penalty_type',
      entityId: systemId,
      action: 'deleted',
      actionType: 'delete',
      createdBy: session.user?.employee?.fullName || session.user?.email || 'System',
    })

    return apiSuccess({ message: 'Đã xóa loại phạt' })
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
      return apiNotFound('Loại phạt')
    }
    logError('Error deleting penalty type', error)
    return apiError('Failed to delete penalty type', 500)
  }
}
