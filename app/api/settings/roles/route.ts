import { prisma } from '@/lib/prisma'
import { Prisma } from '@/generated/prisma/client'
import { requireAuth, apiSuccess, apiError } from '@/lib/api-utils'
import { generateIdWithPrefix } from '@/lib/id-generator'
import { logError } from '@/lib/logger'
import { createActivityLog } from '@/lib/services/activity-log-service'
import { invalidateRolePermissionsCache } from '@/lib/rbac/resolve-permissions'
import { z } from 'zod'

const SETTING_KEY = 'role-settings'
const SETTING_GROUP = 'hrm'

const roleSchema = z.object({
  id: z.string().min(1),
  systemId: z.string().min(1),
  name: z.string().min(1),
  description: z.string().default(''),
  permissions: z.array(z.string()).default([]),
  isDefault: z.boolean().default(false),
})

const putBodySchema = z.object({
  roles: z.array(roleSchema).min(1, 'Cần ít nhất 1 vai trò'),
})

// GET /api/settings/roles - Get role settings
export async function GET() {
  const session = await requireAuth()
  if (!session) return apiError('Unauthorized', 401)

  try {
    const setting = await prisma.setting.findFirst({
      where: {
        key: SETTING_KEY,
        group: SETTING_GROUP,
      },
    })

    if (!setting) {
      return apiSuccess({ data: null })
    }

    // Handle both formats: array (from PUT) or { roles: [...] } (from seed)
    const rawValue = setting.value;
    const roles = Array.isArray(rawValue)
      ? rawValue
      : (rawValue as Record<string, unknown>)?.roles ?? null;
    return apiSuccess({ data: roles })
  } catch (error) {
    logError('Error fetching role settings', error)
    return apiError('Failed to fetch role settings', 500)
  }
}

// PUT /api/settings/roles - Update role settings
export async function PUT(request: Request) {
  const session = await requireAuth()
  if (!session) return apiError('Unauthorized', 401)

  let rawBody: unknown
  try {
    rawBody = await request.json()
  } catch {
    return apiError('Invalid JSON body', 400)
  }

  const parsed = putBodySchema.safeParse(rawBody)
  if (!parsed.success) {
    return apiError(parsed.error.issues[0]?.message || 'Dữ liệu không hợp lệ', 400)
  }
  const { roles } = parsed.data

  try {
    // Read existing roles before update for diff
    const existingSetting = await prisma.setting.findFirst({
      where: { key: SETTING_KEY, group: SETTING_GROUP },
    })
    const rawExisting = existingSetting?.value
    const existingRoles = (
      Array.isArray(rawExisting)
        ? rawExisting
        : (rawExisting as Record<string, unknown>)?.roles ?? []
    ) as Array<{ id: string; systemId: string; name: string; description: string; permissions: string[]; isDefault: boolean }>

    const setting = await prisma.setting.upsert({
      where: {
        key_group: {
          key: SETTING_KEY,
          group: SETTING_GROUP,
        },
      },
      update: {
        value: { roles } as unknown as Prisma.InputJsonValue,
        updatedAt: new Date(),
      },
      create: {
        systemId: await generateIdWithPrefix('SET_ROLE', prisma),
        key: SETTING_KEY,
        group: SETTING_GROUP,
        type: 'json',
        category: 'hrm',
        value: { roles } as unknown as Prisma.InputJsonValue,
        description: 'Role permissions settings',
      },
    })

    // Đồng bộ sang bảng RoleSetting (nguồn chính của resolver RBAC).
    // Upsert từng role + soft-delete role đã xoá khỏi UI.
    const newIds = new Set(roles.map(r => r.id))
    try {
      await prisma.$transaction(async (tx) => {
        for (const role of roles) {
          await tx.roleSetting.upsert({
            where: { id: role.id },
            update: {
              name: role.name,
              description: role.description || null,
              permissions: role.permissions as unknown as Prisma.InputJsonValue,
              isActive: true,
              isDeleted: false,
              deletedAt: null,
              updatedBy: session.user?.id,
            },
            create: {
              systemId: role.systemId,
              id: role.id,
              name: role.name,
              description: role.description || null,
              permissions: role.permissions as unknown as Prisma.InputJsonValue,
              isSystem: role.isDefault === true,
              isActive: true,
              sortOrder: 0,
              createdBy: session.user?.id,
            },
          })
        }
        // Soft delete những role không còn trong payload và không phải system.
        await tx.roleSetting.updateMany({
          where: {
            isDeleted: false,
            isSystem: false,
            NOT: { id: { in: Array.from(newIds) } },
          },
          data: { isDeleted: true, deletedAt: new Date() },
        })
      })
      // Clear cache permissions cho toàn bộ role (đơn giản + an toàn).
      invalidateRolePermissionsCache()
    } catch (syncErr) {
      logError('[roles] failed to sync RoleSetting table', syncErr)
    }

    // Generate activity logs by diffing old vs new roles
    const oldMap = new Map(existingRoles.map(r => [r.id, r]))
    const newMap = new Map(roles.map(r => [r.id, r]))

    const logPromises: Promise<void>[] = []

    // Detect added roles
    for (const [id, role] of newMap) {
      if (!oldMap.has(id)) {
        logPromises.push(
          createActivityLog({
            entityType: 'role',
            entityId: role.systemId,
            action: `Thêm vai trò: ${role.name}`,
            actionType: 'create',
            changes: { name: { from: null, to: role.name }, description: { from: null, to: role.description } },
            createdBy: session.user?.id,
          }).catch(e => logError('[roles] activity log failed', e))
        )
      }
    }

    // Detect deleted roles
    for (const [id, role] of oldMap) {
      if (!newMap.has(id)) {
        logPromises.push(
          createActivityLog({
            entityType: 'role',
            entityId: role.systemId,
            action: `Xóa vai trò: ${role.name}`,
            actionType: 'delete',
            createdBy: session.user?.id,
          }).catch(e => logError('[roles] activity log failed', e))
        )
      }
    }

    // Detect updated roles
    for (const [id, newRole] of newMap) {
      const oldRole = oldMap.get(id)
      if (!oldRole) continue

      const changes: Record<string, { from: unknown; to: unknown }> = {}
      if (newRole.name !== oldRole.name) changes['Tên'] = { from: oldRole.name, to: newRole.name }
      if (newRole.description !== oldRole.description) changes['Mô tả'] = { from: oldRole.description, to: newRole.description }

      const oldPerms = JSON.stringify([...(oldRole.permissions ?? [])].sort())
      const newPerms = JSON.stringify([...(newRole.permissions ?? [])].sort())
      if (oldPerms !== newPerms) {
        const added = newRole.permissions.filter(p => !oldRole.permissions.includes(p))
        const removed = oldRole.permissions.filter(p => !newRole.permissions.includes(p))
        changes['Phân quyền'] = {
          from: `${oldRole.permissions.length} quyền`,
          to: `${newRole.permissions.length} quyền${added.length ? ` (+${added.length})` : ''}${removed.length ? ` (-${removed.length})` : ''}`,
        }
      }

      if (Object.keys(changes).length > 0) {
        const hasPermChange = 'Phân quyền' in changes
        const hasInfoChange = 'Tên' in changes || 'Mô tả' in changes
        let action = `Cập nhật vai trò: ${oldRole.name}`
        if (hasPermChange && !hasInfoChange) action = `Cập nhật phân quyền: ${oldRole.name}`
        if (hasInfoChange && !hasPermChange) action = `Cập nhật thông tin vai trò: ${oldRole.name}`

        logPromises.push(
          createActivityLog({
            entityType: 'role',
            entityId: newRole.systemId,
            action,
            actionType: 'update',
            changes,
            createdBy: session.user?.id,
          }).catch(e => logError('[roles] activity log failed', e))
        )
      }
    }

    await Promise.all(logPromises)

    // Extract roles array from saved value
    const savedRoles = Array.isArray(setting.value)
      ? setting.value
      : (setting.value as Record<string, unknown>)?.roles ?? roles;
    return apiSuccess({ data: savedRoles })
  } catch (error) {
    logError('Error saving role settings', error)
    return apiError('Failed to save role settings', 500)
  }
}
