import { prisma } from '@/lib/prisma'
import { Prisma } from '@/generated/prisma/client'
import { requireAuth, validateBody, apiSuccess, apiPaginated, apiError, parsePagination } from '@/lib/api-utils'
import { createBranchSchema } from './validation'
import { generateNextIdsWithTx } from '@/lib/id-system'
import { cache, CACHE_TTL } from '@/lib/cache'

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
      // Cache key for all branches (most common use case)
      const cacheKey = search ? `branches:all:${search}` : 'branches:all'
      const cached = cache.get(cacheKey)
      if (cached) {
        return apiSuccess(cached)
      }

      const branches = await prisma.branch.findMany({
        where,
        orderBy: { name: 'asc' },
        include: {
          _count: { select: { employees: true } },
        },
      })
      
      const result = { data: branches }
      cache.set(cacheKey, result, CACHE_TTL.HOUR) // Cache 1 giờ
      return apiSuccess(result)
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

    const branch = await prisma.$transaction(async (tx) => {
      // Generate IDs using unified ID system
      const { systemId, businessId } = await generateNextIdsWithTx(
        tx,
        'branches',
        body.id?.trim() || undefined
      );

      return tx.branch.create({
        data: {
          systemId,
          id: businessId,
          name: body.name,
          address: body.address,
          phone: body.phone,
          isDefault: body.isDefault ?? false,
        },
      });
    });

    // Invalidate branches cache
    cache.deletePattern('^branches:')
    
    return apiSuccess(branch, 201)
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
      return apiError('Mã chi nhánh đã tồn tại', 400)
    }
    console.error('Error creating branch:', error)
    return apiError('Failed to create branch', 500)
  }
}
