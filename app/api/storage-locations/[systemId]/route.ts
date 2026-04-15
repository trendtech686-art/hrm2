import { prisma } from '@/lib/prisma'
import { requireAuth, apiError, apiSuccess } from '@/lib/api-utils'
import { logError } from '@/lib/logger'
import { createActivityLog } from '@/lib/services/activity-log-service'

const TYPE = 'storage-location'

export async function GET(_req: Request, { params }: { params: Promise<{ systemId: string }> }) {
  const session = await requireAuth()
  if (!session) return apiError('Unauthorized', 401)

  const { systemId } = await params
  try {
    const loc = await prisma.settingsData.findFirst({ where: { systemId, type: TYPE, isDeleted: false } })
    if (!loc) return apiError('Storage location not found', 404)
    return apiSuccess({ ...loc, ...(loc.metadata as Record<string, unknown> | null | undefined || {}) })
  } catch (error) {
    logError('Error fetching storage location', error)
    return apiError('Failed to fetch storage location', 500)
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ systemId: string }> }) {
  const session = await requireAuth()
  if (!session) return apiError('Unauthorized', 401)

  const { systemId } = await params
  try {
    const existing = await prisma.settingsData.findFirst({ where: { systemId, type: TYPE, isDeleted: false } })
    if (!existing) return apiError('Storage location not found', 404)

    const body = await request.json()
    const { branchId, ...rest } = body || {}
    const updated = await prisma.settingsData.update({
      where: { systemId },
      data: {
        ...rest,
        metadata: branchId !== undefined ? { ...(rest.metadata || {}), branchId } : rest.metadata,
        updatedBy: session.user.id,
      },
    })

    // Activity log with diff
    const changes: Record<string, { from: unknown; to: unknown }> = {}
    if (body.name !== undefined && body.name !== existing.name) changes['Tên'] = { from: existing.name, to: body.name }
    if (body.description !== undefined && body.description !== existing.description) changes['Mô tả'] = { from: existing.description, to: body.description }
    if (body.isActive !== undefined && body.isActive !== existing.isActive) changes['Trạng thái'] = { from: existing.isActive ? 'Hoạt động' : 'Ngừng', to: body.isActive ? 'Hoạt động' : 'Ngừng' }
    if (body.isDefault !== undefined && body.isDefault !== existing.isDefault) changes['Mặc định'] = { from: existing.isDefault ? 'Có' : 'Không', to: body.isDefault ? 'Có' : 'Không' }

    if (Object.keys(changes).length > 0) {
      const changeDetail = Object.keys(changes).join(', ')
      createActivityLog({
        entityType: 'storage_location',
        entityId: systemId,
        action: `Cập nhật điểm lưu kho: ${existing.name}: ${changeDetail}`,
        actionType: 'update',
        changes,
        createdBy: session.user?.id,
      }).catch(e => logError('Failed to create activity log', e))
    }

    return apiSuccess({ ...updated, ...(updated.metadata as Record<string, unknown> | null | undefined || {}) })
  } catch (error) {
    logError('Error updating storage location', error)
    return apiError('Failed to update storage location', 500)
  }
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ systemId: string }> }) {
  const session = await requireAuth()
  if (!session) return apiError('Unauthorized', 401)

  const { systemId } = await params
  try {
    const existing = await prisma.settingsData.findFirst({ where: { systemId, type: TYPE, isDeleted: false } })

    await prisma.settingsData.delete({
      where: { systemId }
    })

    if (existing) {
      createActivityLog({
        entityType: 'storage_location',
        entityId: systemId,
        action: `Xóa điểm lưu kho: ${existing.name}`,
        actionType: 'delete',
        createdBy: session.user?.id,
      }).catch(e => logError('Failed to create activity log', e))
    }

    return apiSuccess({ success: true })
  } catch (error: unknown) {
    const prismaError = error as { code?: string };
    if (prismaError?.code === 'P2025') {
      return apiError('Storage location not found', 404)
    }
    logError('Error deleting storage location', error)
    return apiError('Failed to delete storage location', 500)
  }
}
