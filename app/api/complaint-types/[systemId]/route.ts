import { prisma } from '@/lib/prisma'
import { Prisma } from '@/generated/prisma/client'
import { requireAuth, apiSuccess, apiError, apiNotFound } from '@/lib/api-utils'
import { logError } from '@/lib/logger'
import { createActivityLog } from '@/lib/services/activity-log-service'

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
    logError('Error fetching complaint type', error)
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

    const existing = await prisma.complaintTypeSetting.findUnique({ where: { systemId } })
    if (!existing || existing.isDeleted) return apiNotFound('Loại khiếu nại')

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

    const changes: Record<string, { from: unknown; to: unknown }> = {}
    if (body.name !== undefined && body.name !== existing.name) changes.name = { from: existing.name, to: body.name }
    if (body.description !== undefined && body.description !== existing.description) changes.description = { from: existing.description, to: body.description }
    if (body.color !== undefined && body.color !== existing.color) changes.color = { from: existing.color, to: body.color }
    if (body.isActive !== undefined && body.isActive !== existing.isActive) changes.isActive = { from: existing.isActive, to: body.isActive }
    if (body.isDefault !== undefined && body.isDefault !== existing.isDefault) changes.isDefault = { from: existing.isDefault, to: body.isDefault }
    if (Object.keys(changes).length > 0) {
      await createActivityLog({
        entityType: 'complaint_type',
        entityId: systemId,
        action: `Cập nhật loại khiếu nại: ${existing.name}`,
        actionType: 'update',
        changes,
        metadata: { userName: session?.user.name || session?.user.email },
        createdBy: session?.user.id ?? '',
      }).catch(e => logError('[complaint-types] activity log failed', e))
    }

    return apiSuccess(complaintType)
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
      return apiNotFound('Loại khiếu nại')
    }
    logError('Error updating complaint type', error)
    return apiError('Failed to update complaint type', 500)
  }
}

// DELETE /api/complaint-types/[systemId]
export async function DELETE(_request: Request, { params }: RouteParams) {
  const session = await requireAuth()
  if (!session) return apiError('Unauthorized', 401)

  try {
    const { systemId } = await params

    const existing = await prisma.complaintTypeSetting.findUnique({ where: { systemId } })

    // Soft delete
    await prisma.complaintTypeSetting.update({
      where: { systemId },
      data: {
        isDeleted: true,
        deletedAt: new Date(),
      },
    })

    if (existing) {
      await createActivityLog({
        entityType: 'complaint_type',
        entityId: systemId,
        action: `Xóa loại khiếu nại: ${existing.name}`,
        actionType: 'delete',
        changes: { name: { from: existing.name, to: null } },
        metadata: { userName: session?.user.name || session?.user.email },
        createdBy: session?.user.id ?? '',
      }).catch(e => logError('[complaint-types] activity log failed', e))
    }

    return apiSuccess({ message: 'Đã xóa loại khiếu nại' })
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
      return apiNotFound('Loại khiếu nại')
    }
    logError('Error deleting complaint type', error)
    return apiError('Failed to delete complaint type', 500)
  }
}
