import { prisma } from '@/lib/prisma'
import { Prisma } from '@/generated/prisma/client'
import { requireAuth, apiSuccess, apiError, apiNotFound } from '@/lib/api-utils'
import { logError } from '@/lib/logger'
import { createActivityLog } from '@/lib/services/activity-log-service'

interface RouteParams {
  params: Promise<{ systemId: string }>
}

// GET /api/departments/[systemId]
export async function GET(_request: Request, { params }: RouteParams) {
  const session = await requireAuth()
  if (!session) return apiError('Unauthorized', 401)

  try {
    const { systemId } = await params

    const department = await prisma.department.findUnique({
      where: { systemId },
      select: {
        systemId: true,
        id: true,
        name: true,
        description: true,
        parentId: true,
        isActive: true,
        isDeleted: true,
        createdAt: true,
        updatedAt: true,
        parent: {
          select: {
            systemId: true,
            id: true,
            name: true,
          },
        },
        children: {
          select: {
            systemId: true,
            id: true,
            name: true,
            description: true,
            parentId: true,
            isActive: true,
          },
        },
        employees: {
          where: { isDeleted: false },
          take: 10,
          select: {
            systemId: true,
            id: true,
            fullName: true,
            avatar: true,
            jobTitle: true,
          },
        },
        _count: { select: { employees: true, children: true } },
      },
    })

    if (!department) {
      return apiNotFound('Phòng ban')
    }

    return apiSuccess(department)
  } catch (error) {
    logError('Error fetching department', error)
    return apiError('Failed to fetch department', 500)
  }
}

// PUT /api/departments/[systemId]
export async function PUT(request: Request, { params }: RouteParams) {
  const session = await requireAuth()
  if (!session) return apiError('Unauthorized', 401)

  try {
    const { systemId } = await params
    const body = await request.json()

    // Read existing for diff
    const existing = await prisma.department.findUnique({
      where: { systemId },
    })
    if (!existing || existing.isDeleted) {
      return apiError('Phòng ban không tồn tại', 404)
    }

    const department = await prisma.department.update({
      where: { systemId },
      data: {
        ...(body.name !== undefined && { name: body.name }),
        ...(body.description !== undefined && { description: body.description }),
        ...(body.parentId !== undefined && { parentId: body.parentId }),
        ...(body.isActive !== undefined && { isActive: body.isActive }),
      },
      select: {
        parent: {
          select: {
            systemId: true,
            id: true,
            name: true,
          },
        },
      },
    })

    // Activity log with diff
    const changes: Record<string, { from: unknown; to: unknown }> = {}
    if (body.name !== undefined && body.name !== existing.name) changes['Tên'] = { from: existing.name, to: body.name }
    if (body.description !== undefined && body.description !== existing.description) changes['Mô tả'] = { from: existing.description ?? '', to: body.description ?? '' }
    if (body.isActive !== undefined && body.isActive !== existing.isActive) changes['Trạng thái'] = { from: existing.isActive ? 'Hoạt động' : 'Ngừng', to: body.isActive ? 'Hoạt động' : 'Ngừng' }

    if (Object.keys(changes).length > 0) {
      const changeDetail = Object.keys(changes).join(', ')
      createActivityLog({
        entityType: 'department',
        entityId: systemId,
        action: `Cập nhật phòng ban: ${existing.name}: ${changeDetail}`,
        actionType: 'update',
        changes,
        createdBy: session.user?.id,
      }).catch(e => logError('activity log failed', e))
    }

    return apiSuccess(department)
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
      return apiNotFound('Phòng ban')
    }
    logError('Error updating department', error)
    return apiError('Failed to update department', 500)
  }
}

// DELETE /api/departments/[systemId]
export async function DELETE(_request: Request, { params }: RouteParams) {
  const session = await requireAuth()
  if (!session) return apiError('Unauthorized', 401)

  try {
    const { systemId } = await params

    // Soft delete
    await prisma.department.update({
      where: { systemId },
      data: { isDeleted: true },
    })

    createActivityLog({
      entityType: 'department',
      entityId: systemId,
      action: 'deleted',
      actionType: 'delete',
      createdBy: session.user?.employee?.fullName || session.user?.email || 'System',
    })

    return apiSuccess({ success: true })
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
      return apiNotFound('Phòng ban')
    }
    logError('Error deleting department', error)
    return apiError('Failed to delete department', 500)
  }
}
