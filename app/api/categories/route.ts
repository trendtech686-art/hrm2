import { prisma } from '@/lib/prisma'
import { Prisma } from '@/generated/prisma/client'
import { requireAuth, apiSuccess, apiPaginated, apiError, parsePagination } from '@/lib/api-utils'
import { generateNextIds } from '@/lib/id-system'
import type { EntityType } from '@/lib/id-system'
import { cache, CACHE_TTL } from '@/lib/cache'
import { logError } from '@/lib/logger'
import { createActivityLog } from '@/lib/services/activity-log-service'
import { buildSearchWhere } from '@/lib/search/build-search-where'

// Helper: compute path + level from parent
async function computePathAndLevel(name: string, parentId?: string | null) {
  if (!parentId) {
    return { path: name, level: 0 }
  }

  const parent = await prisma.category.findUnique({
    where: { systemId: parentId },
    select: { path: true, level: true, name: true },
  })

  if (!parent) {
    return { path: name, level: 0 }
  }

  const parentPath = parent.path || parent.name
  const parentLevel = parent.level ?? 0
  return {
    path: `${parentPath} > ${name}`,
    level: parentLevel + 1,
  }
}

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
    const sortBy = searchParams.get('sortBy') || 'sortOrder'
    const sortOrder = searchParams.get('sortOrder') === 'desc' ? 'desc' : 'asc'

    const where: Prisma.CategoryWhereInput = {
      isDeleted: false,
    }

    const searchWhere = buildSearchWhere<Prisma.CategoryWhereInput>(search, ['name', 'id'])
    if (searchWhere) Object.assign(where, searchWhere)

    // Return tree structure (root categories with children)
    if (tree) {
      const cacheKey = 'categories:tree'
      const cached = cache.get(cacheKey)
      if (cached) return apiSuccess(cached)

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
      const result = { data: categories }
      cache.set(cacheKey, result, CACHE_TTL.LONG * 1000)
      return apiSuccess(result)
    }

    if (all) {
      const cacheKey = search ? `categories:all:${search}` : 'categories:all'
      const cached = cache.get(cacheKey)
      if (cached) return apiSuccess(cached)

      const categories = await prisma.category.findMany({
        where,
        orderBy: { name: 'asc' },
        include: {
          parent: true,
          _count: { select: { productCategories: true, children: true } },
        },
      })
      const result = { data: categories }
      cache.set(cacheKey, result, CACHE_TTL.LONG * 1000)
      return apiSuccess(result)
    }

    const [categories, total] = await Promise.all([
      prisma.category.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
        include: {
          parent: true,
          _count: { select: { productCategories: true, children: true } },
        },
      }),
      prisma.category.count({ where }),
    ])

    // Map thumbnail → thumbnailImage for frontend compatibility
    const transformed = categories.map(c => ({
      ...c,
      thumbnailImage: c.thumbnail || c.imageUrl || null,
    }))

    return apiPaginated(transformed, { page, limit, total })
  } catch (error) {
    logError('Error fetching categories', error)
    return apiError('Không thể tải danh sách danh mục', 500)
  }
}

// POST /api/categories - Create new category
export async function POST(request: Request) {
  const session = await requireAuth()
  if (!session) return apiError('Unauthorized', 401)

  // TEMP: Bypass validation due to Zod issue
  let body: Record<string, unknown>
  try {
    body = await request.json()
  } catch {
    return apiError('Invalid JSON body', 400)
  }

  // Manual validation
  if (!body.id || !body.name) {
    return apiError('id và name là bắt buộc', 400)
  }

  try {
    const parentId = (body.parentId as string | undefined) || null
    const name = body.name as string
    const { path, level } = await computePathAndLevel(name, parentId)

    // Generate sequential system ID and business ID using ID system
    // If body.id is provided (from PKGX import), use it as custom business ID
    const { systemId, businessId } = await generateNextIds('categories' as EntityType, body.id as string | undefined)

    const category = await prisma.category.create({
      data: {
        systemId,
        id: businessId,
        name,
        description: body.description as string | undefined,
        imageUrl: (body.thumbnail as string | undefined) || (body.imageUrl as string | undefined),
        thumbnail: (body.thumbnail as string | undefined) || (body.imageUrl as string | undefined),
        parentId,
        sortOrder: (body.sortOrder as number | undefined) || 0,
        // SEO fields
        seoTitle: body.seoTitle as string | undefined,
        metaDescription: body.metaDescription as string | undefined,
        seoKeywords: body.seoKeywords as string | undefined,
        shortDescription: body.shortDescription as string | undefined,
        longDescription: body.longDescription as string | undefined,
        ogImage: (body.ogImage as string | undefined) || (body.thumbnail as string | undefined) || (body.imageUrl as string | undefined),
        slug: body.slug as string | undefined,
        websiteSeo: body.websiteSeo as Prisma.InputJsonValue | undefined,
        // Hierarchy
        path,
        level,
        // Status
        isActive: (body.isActive as boolean | undefined) ?? true,
      },
      include: {
        parent: true,
      },
    })

    // Invalidate categories cache
    cache.deletePattern('^categories:')

    createActivityLog({
      entityType: 'category',
      entityId: category.systemId,
      action: `Thêm danh mục: ${category.name}`,
      actionType: 'create',
      createdBy: session.user?.id,
    }).catch(e => logError('Failed to create activity log', e))

    return apiSuccess(category, 201)
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
      return apiError('Mã danh mục đã tồn tại', 400)
    }
    logError('Error creating category', error)
    return apiError('Không thể tạo danh mục', 500)
  }
}
