import { prisma } from '@/lib/prisma'
import { requireAuth, apiError, apiSuccess } from '@/lib/api-utils'
import { logError } from '@/lib/logger'
import { createActivityLog } from '@/lib/services/activity-log-service'

const TYPE = 'product-type'

export async function GET(_req: Request, { params }: { params: Promise<{ systemId: string }> }) {
  const session = await requireAuth()
  if (!session) return apiError('Unauthorized', 401)

  const { systemId } = await params
  try {
    const item = await prisma.settingsData.findFirst({ where: { systemId, type: TYPE, isDeleted: false } })
    if (!item) return apiError('Product type not found', 404)
    return apiSuccess({ data: item })
  } catch (error) {
    logError('[product-types] GET detail error', error)
    return apiError('Failed to fetch product type', 500)
  }
}

export async function PATCH(request: Request, { params }: { params: Promise<{ systemId: string }> }) {
  const session = await requireAuth()
  if (!session) return apiError('Unauthorized', 401)

  const { systemId } = await params
  try {
    const body = await request.json()

    const existing = await prisma.settingsData.findFirst({ where: { systemId, type: TYPE, isDeleted: false } })
    if (!existing) return apiError('Product type not found', 404)

    // Tách fields hợp lệ của SettingsData vs metadata
    const { id, name, description, isDefault, isActive, ...extraFields } = body
    const prismaData: Record<string, unknown> = { updatedBy: session.user.id }
    if (id !== undefined) prismaData.id = id
    if (name !== undefined) prismaData.name = name
    if (description !== undefined) prismaData.description = description
    if (isDefault !== undefined) prismaData.isDefault = isDefault
    if (isActive !== undefined) prismaData.isActive = isActive

    if (Object.keys(extraFields).length > 0) {
      const currentMeta = (existing?.metadata as Record<string, unknown>) || {}
      prismaData.metadata = { ...currentMeta, ...extraFields }
    }

    const updated = await prisma.settingsData.update({
      where: { systemId },
      data: prismaData,
    })

    // Activity log
    const changes: Record<string, { from: unknown; to: unknown }> = {}
    if (name !== undefined && name !== existing.name) changes['Tên'] = { from: existing.name, to: name }
    if (description !== undefined && description !== existing.description) changes['Mô tả'] = { from: existing.description, to: description }
    if (isDefault !== undefined && isDefault !== existing.isDefault) changes['Mặc định'] = { from: existing.isDefault ? 'Có' : 'Không', to: isDefault ? 'Có' : 'Không' }
    if (isActive !== undefined && isActive !== existing.isActive) changes['Trạng thái'] = { from: existing.isActive ? 'Hoạt động' : 'Ngừng', to: isActive ? 'Hoạt động' : 'Ngừng' }

    if (Object.keys(changes).length > 0) {
      const changeDetail = Object.keys(changes).join(', ')
      createActivityLog({
        entityType: 'product_type',
        entityId: systemId,
        action: `Cập nhật loại sản phẩm: ${existing.name}: ${changeDetail}`,
        actionType: 'update',
        changes,
        createdBy: session.user?.id,
      }).catch(e => logError('Failed to create activity log', e))
    }

    return apiSuccess({ data: updated })
  } catch (error) {
    logError('[product-types] PATCH error', error)
    return apiError('Failed to update product type', 500)
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
        entityType: 'product_type',
        entityId: systemId,
        action: `Xóa loại sản phẩm: ${existing.name}`,
        actionType: 'delete',
        createdBy: session.user?.id,
      }).catch(e => logError('Failed to create activity log', e))
    }

    return apiSuccess({ success: true })
  } catch (error: unknown) {
    const prismaError = error as { code?: string };
    if (prismaError?.code === 'P2025') {
      return apiError('Product type not found', 404)
    }
    logError('[product-types] DELETE error', error)
    return apiError('Failed to delete product type', 500)
  }
}
