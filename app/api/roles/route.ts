import { prisma } from '@/lib/prisma'
import { Prisma } from '@/generated/prisma/client'
import { requireAuth, validateBody, apiSuccess, apiPaginated, apiError, parsePagination } from '@/lib/api-utils'
import { createRoleSchema } from './validation'
import { generateNextIds } from '@/lib/id-system'
import { logError } from '@/lib/logger'
import { createActivityLog } from '@/lib/services/activity-log-service'
import { invalidateRolePermissionsCache } from '@/lib/rbac/resolve-permissions'
import { buildSearchWhere } from '@/lib/search/build-search-where'

// GET /api/roles - List all roles
export async function GET(request: Request) {
  const session = await requireAuth()
  if (!session) return apiError('Unauthorized', 401)

  try {
    const { searchParams } = new URL(request.url)
    const { page, limit, skip } = parsePagination(searchParams)
    const search = searchParams.get('search') || ''
    const all = searchParams.get('all') === 'true'

    const where: Prisma.RoleSettingWhereInput = {
      isDeleted: false,
    }

    const searchWhere = buildSearchWhere<Prisma.RoleSettingWhereInput>(search, ['name', 'id'])
    if (searchWhere) Object.assign(where, searchWhere)

    if (all) {
      const roles = await prisma.roleSetting.findMany({
        where,
        orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }],
      })
      return apiSuccess({ data: roles })
    }

    const [roles, total] = await Promise.all([
      prisma.roleSetting.findMany({
        where,
        skip,
        take: limit,
        orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }],
      }),
      prisma.roleSetting.count({ where }),
    ])

    return apiPaginated(roles, { page, limit, total })
  } catch (error) {
    logError('Error fetching roles', error)
    return apiError('Failed to fetch roles', 500)
  }
}

// POST /api/roles - Create new role
export async function POST(request: Request) {
  const session = await requireAuth()
  if (!session) return apiError('Unauthorized', 401)

  const validation = await validateBody(request, createRoleSchema)
  if (!validation.success) {
    return apiError(validation.error, 400)
  }
  const body = validation.data

  try {
    const { systemId } = await generateNextIds('settings')
    
    const role = await prisma.roleSetting.create({
      data: {
        systemId,
        id: body.id,
        name: body.name,
        description: body.description,
        permissions: body.permissions,
        isSystem: body.isSystem ?? false,
        isActive: body.isActive ?? true,
        sortOrder: body.sortOrder ?? 0,
      },
    })

    invalidateRolePermissionsCache(role.id)

    await createActivityLog({
      entityType: 'role',
      entityId: role.systemId,
      action: `Tạo vai trò: ${body.name}`,
      actionType: 'create',
      changes: {
        name: { from: null, to: body.name },
        ...(body.description ? { description: { from: null, to: body.description } } : {}),
      },
      metadata: { userName: session?.user.name || session?.user.email },
      createdBy: session?.user.id ?? '',
    }).catch(e => logError('[roles] activity log failed', e))

    return apiSuccess(role, 201)
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
      return apiError('Mã vai trò đã tồn tại', 400)
    }
    logError('Error creating role', error)
    return apiError('Failed to create role', 500)
  }
}
