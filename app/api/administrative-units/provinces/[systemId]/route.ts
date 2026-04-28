import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { logError } from '@/lib/logger'
import { requireAuth, apiSuccess, apiError, apiNotFound } from '@/lib/api-utils'
import { createActivityLog } from '@/lib/services/activity-log-service'

type RouteParams = { params: Promise<{ systemId: string }> }

/**
 * PUT /api/administrative-units/provinces/[systemId]
 */
export async function PUT(request: NextRequest, { params }: RouteParams) {
  const session = await requireAuth()
  if (!session) {
    return apiError('Unauthorized', 401)
  }

  try {
    const { systemId } = await params
    const body = await request.json()
    const { name, id } = body

    const existing = await prisma.province.findUnique({ where: { systemId } })
    if (!existing || existing.isDeleted) {
      return apiNotFound('Province')
    }

    const changes: Record<string, { from: unknown; to: unknown }> = {}
    if (name && name !== existing.name) changes.name = { from: existing.name, to: name }
    if (id && id !== existing.id) changes.id = { from: existing.id, to: id }

    const province = await prisma.province.update({
      where: { systemId },
      data: {
        ...(name && { name }),
        ...(id && { id }),
        updatedBy: session.user?.id,
      },
    })

    await createActivityLog({
      entityType: 'province',
      entityId: systemId,
      action: `Cập nhật tỉnh/thành "${province.name}"`,
      actionType: 'update',
      changes,
      metadata: { userName: session.user?.name },
      createdBy: session.user?.id,
    })

    return apiSuccess(province)
  } catch (error) {
    logError('Failed to update province', error)
    return apiError('Không thể cập nhật tỉnh thành', 500)
  }
}

/**
 * DELETE /api/administrative-units/provinces/[systemId]
 */
export async function DELETE(_request: NextRequest, { params }: RouteParams) {
  const session = await requireAuth()
  if (!session) {
    return apiError('Unauthorized', 401)
  }

  try {
    const { systemId } = await params

    const existing = await prisma.province.findUnique({ where: { systemId } })
    if (!existing || existing.isDeleted) {
      return apiNotFound('Province')
    }

    await prisma.province.update({
      where: { systemId },
      data: { isDeleted: true, updatedBy: session.user?.id },
    })

    await createActivityLog({
      entityType: 'province',
      entityId: systemId,
      action: `Xóa tỉnh/thành "${existing.name}" (${existing.id})`,
      actionType: 'delete',
      metadata: { userName: session.user?.name, provinceName: existing.name },
      createdBy: session.user?.id,
    })

    return apiSuccess({ success: true })
  } catch (error) {
    logError('Failed to delete province', error)
    return apiError('Không thể xóa tỉnh thành', 500)
  }
}
