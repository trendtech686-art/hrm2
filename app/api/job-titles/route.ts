import { prisma } from '@/lib/prisma'
import { Prisma } from '@/generated/prisma/client'
import { requireAuth, validateBody, apiSuccess, apiPaginated, apiError, parsePagination } from '@/lib/api-utils'
import { createJobTitleSchema } from './validation'
import { generateNextIdsWithTx } from '@/lib/id-system'
import { logError } from '@/lib/logger'
import { createActivityLog } from '@/lib/services/activity-log-service'
import { buildSearchWhere } from '@/lib/search/build-search-where'

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

    const searchWhere = buildSearchWhere<Prisma.JobTitleWhereInput>(search, ['name', 'id'])
    if (searchWhere) Object.assign(where, searchWhere)

    if (all) {
      const jobTitles = await prisma.jobTitle.findMany({
        where,
        orderBy: { name: 'asc' },
        select: {
          systemId: true,
          id: true,
          name: true,
          description: true,
          isActive: true,
          isDeleted: true,
          createdAt: true,
          updatedAt: true,
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
        select: {
          systemId: true,
          id: true,
          name: true,
          description: true,
          isActive: true,
          isDeleted: true,
          createdAt: true,
          updatedAt: true,
          _count: { select: { employees: true } },
        },
      }),
      prisma.jobTitle.count({ where }),
    ])

    return apiPaginated(jobTitles, { page, limit, total })
  } catch (error) {
    logError('Error fetching job titles', error)
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
    const jobTitle = await prisma.$transaction(async (tx) => {
      // Generate IDs using unified ID system
      const { systemId, businessId } = await generateNextIdsWithTx(
        tx,
        'job-titles',
        body.id?.trim() || undefined
      );

      return tx.jobTitle.create({
        data: {
          systemId,
          id: businessId,
          name: body.name,
          description: body.description,
        },
      });
    });

    createActivityLog({
      entityType: 'job_title',
      entityId: jobTitle.systemId,
      action: 'created',
      actionType: 'create',
      metadata: { name: jobTitle.name, businessId: jobTitle.id },
      createdBy: session.user?.employee?.fullName || session.user?.email || 'System',
    })

    return apiSuccess(jobTitle, 201)
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
      return apiError('Mã chức danh đã tồn tại', 400)
    }
    logError('Error creating job title', error)
    return apiError('Failed to create job title', 500)
  }
}
