import { prisma } from '@/lib/prisma'
import { Prisma } from '@/generated/prisma/client'
import { requireAuth, validateBody, apiSuccess, apiPaginated, apiError, parsePagination } from '@/lib/api-utils'
import { createComplaintTypeSchema } from './validation'

// GET /api/complaint-types - List all complaint types
export async function GET(request: Request) {
  const session = await requireAuth()
  if (!session) return apiError('Unauthorized', 401)

  try {
    const { searchParams } = new URL(request.url)
    const { page, limit, skip } = parsePagination(searchParams)
    const search = searchParams.get('search') || ''
    const all = searchParams.get('all') === 'true'

    const where: Prisma.ComplaintTypeSettingWhereInput = {
      isDeleted: false,
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { id: { contains: search, mode: 'insensitive' } },
      ]
    }

    if (all) {
      const complaintTypes = await prisma.complaintTypeSetting.findMany({
        where,
        orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }],
      })
      return apiSuccess({ data: complaintTypes })
    }

    const [complaintTypes, total] = await Promise.all([
      prisma.complaintTypeSetting.findMany({
        where,
        skip,
        take: limit,
        orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }],
      }),
      prisma.complaintTypeSetting.count({ where }),
    ])

    return apiPaginated(complaintTypes, { page, limit, total })
  } catch (error) {
    console.error('Error fetching complaint types:', error)
    return apiError('Failed to fetch complaint types', 500)
  }
}

// POST /api/complaint-types - Create new complaint type
export async function POST(request: Request) {
  const session = await requireAuth()
  if (!session) return apiError('Unauthorized', 401)

  const validation = await validateBody(request, createComplaintTypeSchema)
  if (!validation.success) {
    return apiError(validation.error, 400)
  }
  const body = validation.data

  try {
    // If setting as default, unset other defaults
    if (body.isDefault) {
      await prisma.complaintTypeSetting.updateMany({
        where: { isDefault: true },
        data: { isDefault: false },
      })
    }

    const complaintType = await prisma.complaintTypeSetting.create({
      data: {
        systemId: `CMPTYPE${String(Date.now()).slice(-6).padStart(6, '0')}`,
        id: body.id,
        name: body.name,
        description: body.description,
        color: body.color,
        isActive: body.isActive ?? true,
        isDefault: body.isDefault ?? false,
        sortOrder: body.sortOrder ?? 0,
      },
    })

    return apiSuccess(complaintType, 201)
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
      return apiError('Mã loại khiếu nại đã tồn tại', 400)
    }
    console.error('Error creating complaint type:', error)
    return apiError('Failed to create complaint type', 500)
  }
}
