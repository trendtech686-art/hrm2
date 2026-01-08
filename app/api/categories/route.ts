import { prisma } from '@/lib/prisma'
import { Prisma } from '@/generated/prisma/client'
import { requireAuth, validateBody, apiSuccess, apiPaginated, apiError, parsePagination } from '@/lib/api-utils'
import { createCategorySchema } from './validation'

// GET /api/categories - List all categories
export async function GET(request: Request) {
  const session = await requireAuth()
  if (!session) return apiError('Unauthorized', 401)

  try {
    const { searchParams } = new URL(request.url)
    const { page, limit, skip } = parsePagination(searchParams)
    const search = searchParams.get('search') || ''
    const all = searchParams.get('all') === 'true'
    const tree = searchParams.get('tree') === 'true'

    const where: Prisma.CategoryWhereInput = {
      isDeleted: false,
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { id: { contains: search, mode: 'insensitive' } },
      ]
    }

    // Return tree structure (root categories with children)
    if (tree) {
      where.parentId = null
      const categories = await prisma.category.findMany({
        where,
        orderBy: { sortOrder: 'asc' },
        include: {
          children: {
            where: { isDeleted: false },
            orderBy: { sortOrder: 'asc' },
            include: {
              children: {
                where: { isDeleted: false },
                orderBy: { sortOrder: 'asc' },
              },
            },
          },
          _count: { select: { productCategories: true } },
        },
      })
      return apiSuccess({ data: categories })
    }

    if (all) {
      const categories = await prisma.category.findMany({
        where,
        orderBy: { name: 'asc' },
        include: {
          parent: true,
          _count: { select: { productCategories: true, children: true } },
        },
      })
      return apiSuccess({ data: categories })
    }

    const [categories, total] = await Promise.all([
      prisma.category.findMany({
        where,
        skip,
        take: limit,
        orderBy: { sortOrder: 'asc' },
        include: {
          parent: true,
          _count: { select: { productCategories: true, children: true } },
        },
      }),
      prisma.category.count({ where }),
    ])

    return apiPaginated(categories, { page, limit, total })
  } catch (error) {
    console.error('Error fetching categories:', error)
    return apiError('Failed to fetch categories', 500)
  }
}

// POST /api/categories - Create new category
export async function POST(request: Request) {
  const session = await requireAuth()
  if (!session) return apiError('Unauthorized', 401)

  const result = await validateBody(request, createCategorySchema)
  if (!result.success) return apiError(result.error, 400)

  try {
    const body = result.data

    const category = await prisma.category.create({
      data: {
        systemId: `CAT${String(Date.now()).slice(-6).padStart(6, '0')}`,
        id: body.id,
        name: body.name,
        description: body.description,
        imageUrl: body.thumbnail || body.imageUrl,
        parentId: body.parentId,
        sortOrder: body.sortOrder || 0,
      },
      include: {
        parent: true,
      },
    })

    return apiSuccess(category, 201)
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
      return apiError('Mã danh mục đã tồn tại', 400)
    }
    console.error('Error creating category:', error)
    return apiError('Failed to create category', 500)
  }
}
