import { prisma } from '@/lib/prisma'
import { Prisma } from '@/generated/prisma/client'
import { requireAuth, validateBody, apiSuccess, apiError, apiNotFound } from '@/lib/api-utils'
import { updateRoleSchema } from '../validation'
import { logError } from '@/lib/logger'
import { createActivityLog } from '@/lib/services/activity-log-service'
import { invalidateRolePermissionsCache } from '@/lib/rbac/resolve-permissions'

type RouteParams = { params: Promise<{ systemId: string }> }

// GET /api/roles/[systemId]
export async function GET(_request: Request, { params }: RouteParams) {
  const session = await requireAuth()
  if (!session) return apiError('Unauthorized', 401)

  try {
    const { systemId } = await params

    const role = await prisma.roleSetting.findUnique({
      where: { systemId },
    })

    if (!role || role.isDeleted) {
      return apiNotFound('Vai trò')
    }

    return apiSuccess(role)
  } catch (error) {
    logError('Error fetching role', error)
    return apiError('Failed to fetch role', 500)
  }
}

// PUT /api/roles/[systemId]
export async function PUT(request: Request, { params }: RouteParams) {
  const session = await requireAuth()
  if (!session) return apiError('Unauthorized', 401)

  const validation = await validateBody(request, updateRoleSchema)
  if (!validation.success) {
    return apiError(validation.error, 400)
  }
  const body = validation.data

  try {
    const { systemId } = await params

    // Check if it's a system role
    const existingRole = await prisma.roleSetting.findUnique({
      where: { systemId },
    })

    if (!existingRole || existingRole.isDeleted) {
      return apiNotFound('Vai trò')
    }

    if (existingRole.isSystem && body.isSystem === false) {
      return apiError('Không thể thay đổi vai trò hệ thống', 400)
    }

    const role = await prisma.roleSetting.update({
      where: { systemId },
      data: {
        ...(body.id !== undefined && { id: body.id }),
        ...(body.name !== undefined && { name: body.name }),
        ...(body.description !== undefined && { description: body.description }),
        ...(body.permissions !== undefined && { permissions: body.permissions }),
        ...(body.isActive !== undefined && { isActive: body.isActive }),
        ...(body.sortOrder !== undefined && { sortOrder: body.sortOrder }),
      },
    })

    // Invalidate permission cache for this role so changes take effect within 60s.
    // Clear both old id (nếu đổi id) và id mới.
    invalidateRolePermissionsCache(existingRole.id)
    if (body.id && body.id !== existingRole.id) {
      invalidateRolePermissionsCache(body.id)
    }

    // Activity log with diff
    const changes: Record<string, { from: unknown; to: unknown }> = {}
    if (body.name !== undefined && body.name !== existingRole.name) changes.name = { from: existingRole.name, to: body.name }
    if (body.description !== undefined && body.description !== existingRole.description) changes.description = { from: existingRole.description, to: body.description }
    if (body.permissions !== undefined && JSON.stringify(body.permissions) !== JSON.stringify(existingRole.permissions)) changes.permissions = { from: existingRole.permissions, to: body.permissions }
    if (body.isActive !== undefined && body.isActive !== existingRole.isActive) changes.isActive = { from: existingRole.isActive, to: body.isActive }
    if (Object.keys(changes).length > 0) {
      await createActivityLog({
        entityType: 'role',
        entityId: systemId,
        action: `Cập nhật vai trò: ${existingRole.name}`,
        actionType: 'update',
        changes,
        metadata: { userName: session?.user.name || session?.user.email, businessId: existingRole.id },
        createdBy: session?.user.id ?? '',
      }).catch(e => logError('[roles] activity log failed', e))
    }

    return apiSuccess(role)
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
      return apiNotFound('Vai trò')
    }
    logError('Error updating role', error)
    return apiError('Failed to update role', 500)
  }
}

// DELETE /api/roles/[systemId]
export async function DELETE(_request: Request, { params }: RouteParams) {
  const session = await requireAuth()
  if (!session) return apiError('Unauthorized', 401)

  try {
    const { systemId } = await params

    // Check if it's a system role
    const existingRole = await prisma.roleSetting.findUnique({
      where: { systemId },
    })

    if (!existingRole) {
      return apiNotFound('Vai trò')
    }

    if (existingRole.isSystem) {
      return apiError('Không thể xóa vai trò hệ thống', 400)
    }

    // Soft delete
    await prisma.roleSetting.update({
      where: { systemId },
      data: {
        isDeleted: true,
        deletedAt: new Date(),
      },
    })

    invalidateRolePermissionsCache(existingRole.id)

    await createActivityLog({
      entityType: 'role',
      entityId: systemId,
      action: `Xóa vai trò: ${existingRole.name}`,
      actionType: 'delete',
      changes: { name: { from: existingRole.name, to: null } },
      metadata: { userName: session?.user.name || session?.user.email, businessId: existingRole.id },
      createdBy: session?.user.id ?? '',
    }).catch(e => logError('[roles] activity log failed', e))

    return apiSuccess({ message: 'Đã xóa vai trò' })
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
      return apiNotFound('Vai trò')
    }
    logError('Error deleting role', error)
    return apiError('Failed to delete role', 500)
  }
}
