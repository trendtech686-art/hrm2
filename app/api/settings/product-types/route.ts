import { prisma } from '@/lib/prisma'
import { Prisma } from '@/generated/prisma/client'
import { requireAuth, apiError, apiSuccess, parsePagination } from '@/lib/api-utils'
import { logError } from '@/lib/logger'
import { createActivityLog } from '@/lib/services/activity-log-service'
import { buildSearchWhere } from '@/lib/search/build-search-where'

const TYPE = 'product-type'

export async function GET(request: Request) {
  const session = await requireAuth()
  if (!session) return apiError('Unauthorized', 401)

  try {
    const { searchParams } = new URL(request.url)
    const { page, limit, skip } = parsePagination(searchParams)
    const search = searchParams.get('search') || undefined

    const where: Prisma.SettingsDataWhereInput = { type: TYPE, isDeleted: false }
    const searchWhere = buildSearchWhere<Prisma.SettingsDataWhereInput>(search, ['name', 'id'])
    if (searchWhere) Object.assign(where, searchWhere)

    const [data, total] = await Promise.all([
      prisma.settingsData.findMany({
        where,
        orderBy: [{ name: 'asc' }],
        skip,
        take: limit,
      }),
      prisma.settingsData.count({ where }),
    ])

    return apiSuccess({ data, pagination: { total, page, limit, totalPages: Math.ceil(total / limit) } })
  } catch (error) {
    logError('[product-types] GET error', error)
    return apiError('Failed to fetch product types', 500)
  }
}

export async function POST(request: Request) {
  const session = await requireAuth()
  if (!session) return apiError('Unauthorized', 401)

  try {
    const body = await request.json()
    const { id, name, description, isDefault = false, isActive = true } = body || {}
    if (!id || !name) return apiError('id and name are required', 400)

    const created = await prisma.settingsData.create({
      data: {
        id,
        name,
        description,
        type: TYPE,
        isDefault,
        isActive,
        metadata: {},
        createdBy: session.user.id,
        updatedBy: session.user.id,
      },
    })

    await createActivityLog({
      entityType: 'product_type',
      entityId: created.systemId,
      action: `Thêm loại sản phẩm: ${name}`,
      actionType: 'create',
      createdBy: session.user.id,
    }).catch(e => logError('[product-types] activity log failed', e))

    return apiSuccess({ data: created }, 201)
  } catch (error) {
    logError('[product-types] POST error', error)
    return apiError('Failed to create product type', 500)
  }
}
