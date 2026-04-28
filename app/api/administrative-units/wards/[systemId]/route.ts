import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { logError } from '@/lib/logger'
import { requireAuth, apiSuccess, apiError, apiNotFound } from '@/lib/api-utils'
import { createActivityLog } from '@/lib/services/activity-log-service'

type RouteParams = { params: Promise<{ systemId: string }> }

/**
 * PUT /api/administrative-units/wards/[systemId]
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

    const existing = await prisma.ward.findUnique({ where: { systemId } })
    if (!existing || existing.isDeleted) {
      return apiNotFound('Ward')
    }

    const changes: Record<string, { from: unknown; to: unknown }> = {}
    if (name && name !== existing.name) changes.name = { from: existing.name, to: name }

    const ward = await prisma.ward.update({
      where: { systemId },
      data: {
        ...(name && { name }),
        ...(id && { id }),
        updatedBy: session.user?.id,
      },
    })

    await createActivityLog({
      entityType: 'ward',
      entityId: systemId,
      action: `Cập nhật phường/xã "${ward.name}"`,
      actionType: 'update',
      changes,
      metadata: { userName: session.user?.name },
      createdBy: session.user?.id,
    })

    return apiSuccess(ward)
  } catch (error) {
    logError('Failed to update ward', error)
    return apiError('Không thể cập nhật phường/xã', 500)
  }
}

/**
 * DELETE /api/administrative-units/wards/[systemId]
 */
export async function DELETE(_request: NextRequest, { params }: RouteParams) {
  const session = await requireAuth()
  if (!session) {
    return apiError('Unauthorized', 401)
  }

  try {
    const { systemId } = await params

    const existing = await prisma.ward.findUnique({ where: { systemId } })
    if (!existing || existing.isDeleted) {
      return apiNotFound('Ward')
    }

    await prisma.ward.update({
      where: { systemId },
      data: { isDeleted: true, updatedBy: session.user?.id },
    })

    await createActivityLog({
      entityType: 'ward',
      entityId: systemId,
      action: `Xóa phường/xã "${existing.name}"`,
      actionType: 'delete',
      metadata: { userName: session.user?.name, wardName: existing.name },
      createdBy: session.user?.id,
    })

    return apiSuccess({ success: true })
  } catch (error) {
    logError('Failed to delete ward', error)
    return apiError('Không thể xóa phường/xã', 500)
  }
}
