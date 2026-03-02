import { prisma } from '@/lib/prisma'
import { requireAuth, apiError, apiSuccess, parsePagination } from '@/lib/api-utils'

const TYPE = 'product-type'

export async function GET(request: Request) {
  const session = await requireAuth()
  if (!session) return apiError('Unauthorized', 401)

  try {
    const { searchParams } = new URL(request.url)
    const { page, limit, skip } = parsePagination(searchParams)
    const search = searchParams.get('search') || undefined

    const where: { type: string; isDeleted: boolean; OR?: { name?: { contains: string; mode: 'insensitive' }; id?: { contains: string; mode: 'insensitive' } }[] } = { type: TYPE, isDeleted: false }
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { id: { contains: search, mode: 'insensitive' } },
      ]
    }

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
    console.error('[product-types] GET error:', error)
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

    return apiSuccess({ data: created }, 201)
  } catch (error) {
    console.error('[product-types] POST error:', error)
    return apiError('Failed to create product type', 500)
  }
}
