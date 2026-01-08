import { prisma } from '@/lib/prisma'
import { Prisma } from '@/generated/prisma/client'
import { requireAuth, validateBody, apiSuccess, apiPaginated, apiError, parsePagination } from '@/lib/api-utils'
import { createJobTitleSchema } from './validation'

// GET /api/job-titles - List all job titles
export async function GET(request: Request) {
  const session = await requireAuth()
  if (!session) return apiError('Unauthorized', 401)

  try {
    const { searchParams } = new URL(request.url)
    const { page, limit, skip } = parsePagination(searchParams)
    const search = searchParams.get('search') || ''
    const all = searchParams.get('all') === 'true'

    const where: Prisma.JobTitleWhereInput = {
      isDeleted: false,
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { id: { contains: search, mode: 'insensitive' } },
      ]
    }

    if (all) {
      const jobTitles = await prisma.jobTitle.findMany({
        where,
        orderBy: { name: 'asc' },
        include: {
          _count: { select: { employees: true } },
        },
      })
      return apiSuccess({ data: jobTitles })
    }

    const [jobTitles, total] = await Promise.all([
      prisma.jobTitle.findMany({
        where,
        skip,
        take: limit,
        orderBy: { name: 'asc' },
        include: {
          _count: { select: { employees: true } },
        },
      }),
      prisma.jobTitle.count({ where }),
    ])

    return apiPaginated(jobTitles, { page, limit, total })
  } catch (error) {
    console.error('Error fetching job titles:', error)
    return apiError('Failed to fetch job titles', 500)
  }
}

// POST /api/job-titles - Create new job title
export async function POST(request: Request) {
  const session = await requireAuth()
  if (!session) return apiError('Unauthorized', 401)

  const validation = await validateBody(request, createJobTitleSchema)
  if (!validation.success) {
    return apiError(validation.error, 400)
  }
  const body = validation.data

  try {
    const jobTitle = await prisma.jobTitle.create({
      data: {
        systemId: `JOB${String(Date.now()).slice(-6).padStart(6, '0')}`,
        id: body.id,
        name: body.name,
        description: body.description,
      },
    })

    return apiSuccess(jobTitle, 201)
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
      return apiError('Mã chức danh đã tồn tại', 400)
    }
    console.error('Error creating job title:', error)
    return apiError('Failed to create job title', 500)
  }
}
