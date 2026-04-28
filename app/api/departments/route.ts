import { prisma } from '@/lib/prisma'
import { Prisma } from '@/generated/prisma/client'
import { requireAuth, validateBody, apiSuccess, apiPaginated, apiError, parsePagination } from '@/lib/api-utils'
import { createDepartmentSchema } from './validation'
import { generateNextIdsWithTx } from '@/lib/id-system'
import { logError } from '@/lib/logger'
import { createActivityLog } from '@/lib/services/activity-log-service'
import { buildSearchWhere } from '@/lib/search/build-search-where'

// GET /api/departments - List all departments
export async function GET(request: Request) {
  const session = await requireAuth()
  if (!session) return apiError('Unauthorized', 401)

  try {
    const { searchParams } = new URL(request.url)
    const { page, limit, skip } = parsePagination(searchParams)
    const search = searchParams.get('search') || ''
    const all = searchParams.get('all') === 'true'

    const where: Prisma.DepartmentWhereInput = {
      isDeleted: false,
    }

    const searchWhere = buildSearchWhere<Prisma.DepartmentWhereInput>(search, ['name', 'id'])
    if (searchWhere) Object.assign(where, searchWhere)

    if (all) {
      const departments = await prisma.department.findMany({
        where,
        orderBy: { name: 'asc' },
        select: {
          systemId: true,
          id: true,
          name: true,
          description: true,
          parentId: true,
          isActive: true,
          isDeleted: true,
          createdAt: true,
          updatedAt: true,
          parent: {
            select: {
              systemId: true,
              id: true,
              name: true,
            },
          },
          _count: { select: { employees: true, children: true } },
        },
      })
      return apiSuccess({ data: departments })
    }

    const [departments, total] = await Promise.all([
      prisma.department.findMany({
        where,
        skip,
        take: limit,
        orderBy: { name: 'asc' },
        select: {
          systemId: true,
          id: true,
          name: true,
          description: true,
          parentId: true,
          isActive: true,
          isDeleted: true,
          createdAt: true,
          updatedAt: true,
          parent: {
            select: {
              systemId: true,
              id: true,
              name: true,
            },
          },
          _count: { select: { employees: true, children: true } },
        },
      }),
      prisma.department.count({ where }),
    ])

    return apiPaginated(departments, { page, limit, total })
  } catch (error) {
    logError('Error fetching departments', error)
    return apiError('Failed to fetch departments', 500)
  }
}

// POST /api/departments - Create new department
export async function POST(request: Request) {
  const session = await requireAuth()
  if (!session) return apiError('Unauthorized', 401)

  const validation = await validateBody(request, createDepartmentSchema)
  if (!validation.success) {
    return apiError(validation.error, 400)
  }
  const body = validation.data

  try {
    const department = await prisma.$transaction(async (tx) => {
      // Generate IDs using unified ID system
      const { systemId, businessId } = await generateNextIdsWithTx(
        tx,
        'departments',
        body.id?.trim() || undefined
      );

      return tx.department.create({
        data: {
          systemId,
          id: businessId,
          name: body.name,
          description: body.description,
          parent: body.parentId ? { connect: { systemId: body.parentId } } : undefined,
        },
        select: {
          parent: {
            select: {
              systemId: true,
              id: true,
              name: true,
            },
          },
        },
      });
    });

    createActivityLog({
      entityType: 'department',
      entityId: department.systemId,
      action: 'created',
      actionType: 'create',
      metadata: { name: department.name, businessId: department.id },
      createdBy: session.user?.employee?.fullName || session.user?.email || 'System',
    })

    return apiSuccess(department, 201)
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
      return apiError('Mã phòng ban đã tồn tại', 400)
    }
    logError('Error creating department', error)
    return apiError('Failed to create department', 500)
  }
}
