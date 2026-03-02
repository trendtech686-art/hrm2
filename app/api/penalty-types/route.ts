import { prisma } from '@/lib/prisma'
import { Prisma } from '@/generated/prisma/client'
import { requireAuth, validateBody, apiSuccess, apiPaginated, apiError, parsePagination } from '@/lib/api-utils'
import { createPenaltyTypeSchema } from './validation'
import { generateNextIds } from '@/lib/id-system'

// GET /api/penalty-types - List all penalty types
export async function GET(request: Request) {
  const session = await requireAuth()
  if (!session) return apiError('Unauthorized', 401)

  try {
    const { searchParams } = new URL(request.url)
    const { page, limit, skip } = parsePagination(searchParams)
    const search = searchParams.get('search') || ''
    const all = searchParams.get('all') === 'true'

    const where: Prisma.PenaltyTypeSettingWhereInput = {
      isDeleted: false,
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { id: { contains: search, mode: 'insensitive' } },
      ]
    }

    if (all) {
      const penaltyTypes = await prisma.penaltyTypeSetting.findMany({
        where,
        orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }],
      })
      return apiSuccess({ data: penaltyTypes })
    }

    const [penaltyTypes, total] = await Promise.all([
      prisma.penaltyTypeSetting.findMany({
        where,
        skip,
        take: limit,
        orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }],
      }),
      prisma.penaltyTypeSetting.count({ where }),
    ])

    return apiPaginated(penaltyTypes, { page, limit, total })
  } catch (error) {
    console.error('Error fetching penalty types:', error)
    return apiError('Failed to fetch penalty types', 500)
  }
}

// POST /api/penalty-types - Create new penalty type
export async function POST(request: Request) {
  const session = await requireAuth()
  if (!session) return apiError('Unauthorized', 401)

  const validation = await validateBody(request, createPenaltyTypeSchema)
  if (!validation.success) {
    return apiError(validation.error, 400)
  }
  const body = validation.data

  try {
    const { systemId } = await generateNextIds('penalties')
    
    const penaltyType = await prisma.penaltyTypeSetting.create({
      data: {
        systemId,
        id: body.id,
        name: body.name,
        description: body.description,
        defaultAmount: body.defaultAmount,
        category: body.category,
        isActive: body.isActive ?? true,
        sortOrder: body.sortOrder ?? 0,
      },
    })

    return apiSuccess(penaltyType, 201)
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
      return apiError('Mã loại phạt đã tồn tại', 400)
    }
    console.error('Error creating penalty type:', error)
    return apiError('Failed to create penalty type', 500)
  }
}
