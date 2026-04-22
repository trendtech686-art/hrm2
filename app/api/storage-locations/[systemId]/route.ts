import { prisma } from '@/lib/prisma'
import { requireAuth, apiError, apiSuccess } from '@/lib/api-utils'
import { logError } from '@/lib/logger'
import { createActivityLog } from '@/lib/services/activity-log-service'
import { stockLocationToStorageDto } from '@/lib/stock-location-storage-dto'

export async function GET(_req: Request, { params }: { params: Promise<{ systemId: string }> }) {
  const session = await requireAuth()
  if (!session) return apiError('Unauthorized', 401)

  const { systemId } = await params
  try {
    const loc = await prisma.stockLocation.findUnique({ where: { systemId } })
    if (!loc) return apiError('Storage location not found', 404)
    return apiSuccess(stockLocationToStorageDto(loc))
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
    const existing = await prisma.stockLocation.findUnique({ where: { systemId } })
    if (!existing) return apiError('Storage location not found', 404)

    const body = await request.json()
    const { name, description, isActive, isDefault, branchId: bodyBranchRef } = body || {}

    let branchConnect:
      | { branchId: string; branchSystemId: string }
      | undefined
    if (bodyBranchRef && typeof bodyBranchRef === 'string') {
      const b = await prisma.branch.findFirst({
        where: { isDeleted: false, OR: [{ systemId: bodyBranchRef }, { id: bodyBranchRef }] },
      })
      if (b) {
        branchConnect = { branchId: b.id, branchSystemId: b.systemId }
      }
    }

    const updated = await prisma.stockLocation.update({
      where: { systemId },
      data: {
        ...(name !== undefined && { name }),
        ...(description !== undefined && { description }),
        ...(isActive !== undefined && { isActive }),
        ...(isDefault !== undefined && { isDefault }),
        ...(branchConnect && {
          branchId: branchConnect.branchId,
          branchSystemId: branchConnect.branchSystemId,
        }),
        updatedBy: session.user.id,
      },
    })

    const changes: Record<string, { from: unknown; to: unknown }> = {}
    if (name !== undefined && name !== existing.name) changes['Tên'] = { from: existing.name, to: name }
    if (description !== undefined && description !== existing.description) {
      changes['Mô tả'] = { from: existing.description, to: description }
    }
    if (isActive !== undefined && isActive !== existing.isActive) {
      changes['Trạng thái'] = { from: existing.isActive ? 'Hoạt động' : 'Ngừng', to: isActive ? 'Hoạt động' : 'Ngừng' }
    }
    if (isDefault !== undefined && isDefault !== existing.isDefault) {
      changes['Mặc định'] = { from: existing.isDefault ? 'Có' : 'Không', to: isDefault ? 'Có' : 'Không' }
    }

    if (Object.keys(changes).length > 0) {
      const changeDetail = Object.keys(changes).join(', ')
      createActivityLog({
        entityType: 'storage_location',
        entityId: systemId,
        action: `Cập nhật điểm lưu kho: ${existing.name}: ${changeDetail}`,
        actionType: 'update',
        changes,
        createdBy: session.user?.id,
      }).catch((e) => logError('Failed to create activity log', e))
    }

    return apiSuccess(stockLocationToStorageDto(updated))
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
    const existing = await prisma.stockLocation.findUnique({ where: { systemId } })
    if (!existing) return apiError('Storage location not found', 404)

    await prisma.stockLocation.update({
      where: { systemId },
      data: { isActive: false, updatedBy: session.user.id },
    })

    createActivityLog({
      entityType: 'storage_location',
      entityId: systemId,
      action: `Vô hiệu điểm lưu kho: ${existing.name}`,
      actionType: 'delete',
      createdBy: session.user?.id,
    }).catch((e) => logError('Failed to create activity log', e))

    return apiSuccess({ success: true })
  } catch (error: unknown) {
    const prismaError = error as { code?: string }
    if (prismaError?.code === 'P2025') {
      return apiError('Storage location not found', 404)
    }
    logError('Error deleting storage location', error)
    return apiError('Failed to delete storage location', 500)
  }
}
