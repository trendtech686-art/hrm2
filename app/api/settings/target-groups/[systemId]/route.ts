import { prisma } from '@/lib/prisma'
import { Prisma } from '@/generated/prisma/client'
import { apiError, apiSuccess, requireAuth } from '@/lib/api-utils'
import { logError } from '@/lib/logger'
import { createActivityLog } from '@/lib/services/activity-log-service'

const TYPE = 'target-group'

interface SettingsDataRecord {
  systemId: string;
  id: string;
  name: string;
  description?: string | null;
  type: string;
  isActive: boolean;
  isDefault: boolean;
  metadata?: Record<string, unknown> | null;
  [key: string]: unknown;
}

function mapRecord(item: SettingsDataRecord) {
  const meta = (item?.metadata as Record<string, unknown> | null) || {}
  return { ...item, ...meta }
}

export async function GET(_req: Request, { params }: { params: Promise<{ systemId: string }> }) {
  const session = await requireAuth()
  if (!session) return apiError('Unauthorized', 401)

  const { systemId } = await params
  try {
    const item = await prisma.settingsData.findFirst({ where: { systemId, type: TYPE, isDeleted: false } })
    if (!item) return apiError('Target group not found', 404)
    return apiSuccess(mapRecord(item as unknown as SettingsDataRecord))
  } catch (error) {
    logError('[target-groups] GET detail error', error)
    return apiError('Failed to fetch target group', 500)
  }
}

export async function PATCH(request: Request, { params }: { params: Promise<{ systemId: string }> }) {
  const session = await requireAuth()
  if (!session) return apiError('Unauthorized', 401)

  const { systemId } = await params
  try {
    const body = await request.json()
    const existing = await prisma.settingsData.findUnique({ where: { systemId } })
    if (!existing || existing.type !== TYPE) return apiError('Target group not found', 404)

    // If setting as default, unset all other defaults of same type
    if (body.isDefault === true) {
      await prisma.settingsData.updateMany({
        where: { type: TYPE, isDeleted: false, isDefault: true, systemId: { not: systemId } },
        data: { isDefault: false },
      })
    }

    const updated = await prisma.settingsData.update({
      where: { systemId },
      data: {
        id: body.id ?? existing.id,
        name: body.name ?? existing.name,
        description: body.description ?? existing.description,
        isActive: body.isActive ?? existing.isActive,
        isDefault: body.isDefault ?? existing.isDefault,
        metadata: (existing.metadata ?? {}) as Prisma.InputJsonObject,
        updatedBy: session.user.id,
      },
    })

    // Activity log
    const changes: Record<string, { from: unknown; to: unknown }> = {}
    if (body.name !== undefined && body.name !== existing.name) changes['Tên'] = { from: existing.name, to: body.name }
    if (body.description !== undefined && body.description !== existing.description) changes['Mô tả'] = { from: existing.description, to: body.description }
    if (body.isActive !== undefined && body.isActive !== existing.isActive) changes['Trạng thái'] = { from: existing.isActive ? 'Hoạt động' : 'Ngừng', to: body.isActive ? 'Hoạt động' : 'Ngừng' }
    if (body.isDefault !== undefined && body.isDefault !== existing.isDefault) changes['Mặc định'] = { from: existing.isDefault ? 'Có' : 'Không', to: body.isDefault ? 'Có' : 'Không' }

    if (Object.keys(changes).length > 0) {
      const changeDetail = Object.keys(changes).join(', ')
      createActivityLog({
        entityType: 'target_group',
        entityId: systemId,
        action: `Cập nhật nhóm đối tượng: ${existing.name}: ${changeDetail}`,
        actionType: 'update',
        changes,
        createdBy: session.user?.id,
      }).catch(e => logError('Failed to create activity log', e))
    }

    return apiSuccess(mapRecord(updated as unknown as SettingsDataRecord))
  } catch (error) {
    logError('[target-groups] PATCH error', error)
    return apiError('Failed to update target group', 500)
  }
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ systemId: string }> }) {
  const session = await requireAuth()
  if (!session) return apiError('Unauthorized', 401)

  const { systemId } = await params
  try {
    const existing = await prisma.settingsData.findFirst({ where: { systemId, type: TYPE, isDeleted: false } })

    await prisma.settingsData.delete({ where: { systemId } })

    if (existing) {
      createActivityLog({
        entityType: 'target_group',
        entityId: systemId,
        action: `Xóa nhóm đối tượng: ${existing.name}`,
        actionType: 'delete',
        createdBy: session.user?.id,
      }).catch(e => logError('Failed to create activity log', e))
    }

    return apiSuccess({ success: true })
  } catch (error: unknown) {
    const prismaError = error as { code?: string };
    if (prismaError?.code === 'P2025') return apiError('Target group not found', 404)
    logError('[target-groups] DELETE error', error)
    return apiError('Failed to delete target group', 500)
  }
}
