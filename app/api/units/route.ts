import { prisma } from '@/lib/prisma'
import { Prisma } from '@/generated/prisma/client'
import { requireAuth, apiError, apiSuccess, parsePagination } from '@/lib/api-utils'
import { logError } from '@/lib/logger'
import { createActivityLog } from '@/lib/services/activity-log-service'
import { buildSearchWhere } from '@/lib/search/build-search-where'

// GET /api/units - list units with optional filters
export async function GET(request: Request) {
  const session = await requireAuth()
  if (!session) return apiError('Unauthorized', 401)

  try {
    const { searchParams } = new URL(request.url)
    const { page, limit, skip: _skip } = parsePagination(searchParams)
    const search = searchParams.get('search') || undefined
    const isActiveParam = searchParams.get('isActive')
    const isActive = isActiveParam === null ? undefined : isActiveParam === 'true'
    const sortBy = searchParams.get('sortBy') || 'name'
    const sortOrder = (searchParams.get('sortOrder') || 'asc') as 'asc' | 'desc'

    const where: Prisma.UnitWhereInput = {}
    if (isActive !== undefined) {
      where.isActive = isActive
    }
    const searchWhere = buildSearchWhere<Prisma.UnitWhereInput>(search, ['name', 'id'])
    if (searchWhere) Object.assign(where, searchWhere)

    const [data, total] = await Promise.all([
      prisma.unit.findMany({
        where,
        orderBy: { [sortBy]: sortOrder },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.unit.count({ where }),
    ])

    return apiSuccess({ data, total, page, pageSize: limit })
  } catch (error) {
    logError('Error fetching units', error)
    return apiError('Failed to fetch units', 500)
  }
}

// POST /api/units - create unit
export async function POST(request: Request) {
  const session = await requireAuth()
  if (!session) return apiError('Unauthorized', 401)

  try {
    const body = await request.json()
    const { id, name, description, isDefault = false, isActive = true } = body || {}

    if (!id || !name) {
      return apiError('id and name are required', 400)
    }

    const created = await prisma.unit.create({
      data: {
        id,
        name,
        description,
        isDefault,
        isActive,
        createdBy: session.user.id,
        updatedBy: session.user.id,
      },
    })

    createActivityLog({
      entityType: 'unit',
      entityId: created.systemId,
      action: 'created',
      actionType: 'create',
      metadata: { name, businessId: id },
      createdBy: session.user?.employee?.fullName || session.user?.email || 'System',
    })

    return apiSuccess(created, 201)
  } catch (error) {
    logError('Error creating unit', error)
    return apiError('Failed to create unit', 500)
  }
}
