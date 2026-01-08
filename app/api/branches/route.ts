import { prisma } from '@/lib/prisma'
import { Prisma } from '@/generated/prisma/client'
import { requireAuth, validateBody, apiSuccess, apiPaginated, apiError, parsePagination } from '@/lib/api-utils'
import { createBranchSchema } from './validation'

// GET /api/branches - List all branches
export async function GET(request: Request) {
  const session = await requireAuth()
  if (!session) return apiError('Unauthorized', 401)

  try {
    const { searchParams } = new URL(request.url)
    const { page, limit, skip } = parsePagination(searchParams)
    const search = searchParams.get('search') || ''
    const all = searchParams.get('all') === 'true'

    const where: Prisma.BranchWhereInput = {
      isDeleted: false,
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { id: { contains: search, mode: 'insensitive' } },
        { address: { contains: search, mode: 'insensitive' } },
      ]
    }

    if (all) {
      const branches = await prisma.branch.findMany({
        where,
        orderBy: { name: 'asc' },
        include: {
          _count: { select: { employees: true } },
        },
      })
      return apiSuccess({ data: branches })
    }

    const [branches, total] = await Promise.all([
      prisma.branch.findMany({
        where,
        skip,
        take: limit,
        orderBy: { name: 'asc' },
        include: {
          _count: { select: { employees: true } },
        },
      }),
      prisma.branch.count({ where }),
    ])

    return apiPaginated(branches, { page, limit, total })
  } catch (error) {
    console.error('Error fetching branches:', error)
    return apiError('Failed to fetch branches', 500)
  }
}

// POST /api/branches - Create new branch
export async function POST(request: Request) {
  const session = await requireAuth()
  if (!session) return apiError('Unauthorized', 401)

  const result = await validateBody(request, createBranchSchema)
  if (!result.success) return apiError(result.error, 400)

  try {
    const body = result.data

    const branch = await prisma.branch.create({
      data: {
        systemId: `BRANCH${String(Date.now()).slice(-6).padStart(6, '0')}`,
        id: body.id,
        name: body.name,
        address: body.address,
        phone: body.phone,
        isDefault: body.isDefault ?? false,
      },
    })

    return apiSuccess(branch, 201)
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
      return apiError('Mã chi nhánh đã tồn tại', 400)
    }
    console.error('Error creating branch:', error)
    return apiError('Failed to create branch', 500)
  }
}
