import { prisma } from '@/lib/prisma'
import { Prisma } from '@/generated/prisma/client'
import { requireAuth, validateBody, apiSuccess, apiPaginated, apiError, parsePagination } from '@/lib/api-utils'
import { createDepartmentSchema } from './validation'
import { generateNextIdsWithTx } from '@/lib/id-system'

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

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { id: { contains: search, mode: 'insensitive' } },
      ]
    }

    if (all) {
      const departments = await prisma.department.findMany({
        where,
        orderBy: { name: 'asc' },
        include: {
          parent: true,
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
        include: {
          parent: true,
          _count: { select: { employees: true, children: true } },
        },
      }),
      prisma.department.count({ where }),
    ])

    return apiPaginated(departments, { page, limit, total })
  } catch (error) {
    console.error('Error fetching departments:', error)
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
        include: {
          parent: true,
        },
      });
    });

    return apiSuccess(department, 201)
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
      return apiError('Mã phòng ban đã tồn tại', 400)
    }
    console.error('Error creating department:', error)
    return apiError('Failed to create department', 500)
  }
}
