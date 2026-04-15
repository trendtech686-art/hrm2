import { prisma } from '@/lib/prisma'
import { Prisma } from '@/generated/prisma/client'
import { requireAuth, apiSuccess, apiError, apiNotFound } from '@/lib/api-utils'
import { logError } from '@/lib/logger'
import { createActivityLog } from '@/lib/services/activity-log-service'

interface RouteParams {
  params: Promise<{ systemId: string }>
}

// GET /api/job-titles/[systemId]
export async function GET(_request: Request, { params }: RouteParams) {
  const session = await requireAuth()
  if (!session) return apiError('Unauthorized', 401)

  try {
    const { systemId } = await params

    const jobTitle = await prisma.jobTitle.findUnique({
      where: { systemId },
      include: {
        employees: {
          where: { isDeleted: false },
          take: 10,
          select: {
            systemId: true,
            id: true,
            fullName: true,
            avatar: true,
            department: true,
          },
        },
        _count: { select: { employees: true } },
      },
    })

    if (!jobTitle) {
      return apiNotFound('Chức danh')
    }

    return apiSuccess(jobTitle)
  } catch (error) {
    logError('Error fetching job title', error)
    return apiError('Failed to fetch job title', 500)
  }
}

// PUT /api/job-titles/[systemId]
export async function PUT(request: Request, { params }: RouteParams) {
  const session = await requireAuth()
  if (!session) return apiError('Unauthorized', 401)

  try {
    const { systemId } = await params
    const body = await request.json()

    // Read existing for diff
    const existing = await prisma.jobTitle.findUnique({
      where: { systemId },
    })
    if (!existing || existing.isDeleted) {
      return apiError('Chức vụ không tồn tại', 404)
    }

    const jobTitle = await prisma.jobTitle.update({
      where: { systemId },
      data: {
        ...(body.name !== undefined && { name: body.name }),
        ...(body.description !== undefined && { description: body.description }),
        ...(body.isActive !== undefined && { isActive: body.isActive }),
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
        entityType: 'job_title',
        entityId: systemId,
        action: `Cập nhật chức vụ: ${existing.name}: ${changeDetail}`,
        actionType: 'update',
        changes,
        createdBy: session.user?.id,
      }).catch(e => logError('activity log failed', e))
    }

    return apiSuccess(jobTitle)
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
      return apiNotFound('Chức danh')
    }
    logError('Error updating job title', error)
    return apiError('Failed to update job title', 500)
  }
}

// DELETE /api/job-titles/[systemId]
export async function DELETE(_request: Request, { params }: RouteParams) {
  const session = await requireAuth()
  if (!session) return apiError('Unauthorized', 401)

  try {
    const { systemId } = await params

    // Soft delete
    await prisma.jobTitle.update({
      where: { systemId },
      data: { isDeleted: true },
    })

    createActivityLog({
      entityType: 'job_title',
      entityId: systemId,
      action: 'deleted',
      actionType: 'delete',
      createdBy: session.user?.employee?.fullName || session.user?.email || 'System',
    })

    return apiSuccess({ success: true })
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
      return apiNotFound('Chức danh')
    }
    logError('Error deleting job title', error)
    return apiError('Failed to delete job title', 500)
  }
}
