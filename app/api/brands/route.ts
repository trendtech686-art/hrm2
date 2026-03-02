import { prisma } from '@/lib/prisma'
import { Prisma } from '@/generated/prisma/client'
import { requireAuth, validateBody, apiSuccess, apiPaginated, apiError, parsePagination } from '@/lib/api-utils'
import { createBrandSchema } from './validation'
import { generateNextIds } from '@/lib/id-system'
import { cache, CACHE_TTL } from '@/lib/cache'

// GET /api/brands - List all brands
export async function GET(request: Request) {
  const session = await requireAuth()
  if (!session) return apiError('Unauthorized', 401)

  try {
    const { searchParams } = new URL(request.url)
    const { page, limit, skip } = parsePagination(searchParams)
    const search = searchParams.get('search') || ''
    const all = searchParams.get('all') === 'true'

    const where: Prisma.BrandWhereInput = {
      isDeleted: false,
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { id: { contains: search, mode: 'insensitive' } },
      ]
    }

    if (all) {
      const cacheKey = search ? `brands:all:${search}` : 'brands:all'
      const cached = cache.get(cacheKey)
      if (cached) return apiSuccess(cached)

      const brands = await prisma.brand.findMany({
        where,
        orderBy: { name: 'asc' },
        include: {
          _count: { select: { products: true } },
        },
      })
      const result = { data: brands }
      cache.set(cacheKey, result, CACHE_TTL.LONG)
      return apiSuccess(result)
    }

    const [brands, total] = await Promise.all([
      prisma.brand.findMany({
        where,
        skip,
        take: limit,
        orderBy: { name: 'asc' },
        include: {
          _count: { select: { products: true } },
        },
      }),
      prisma.brand.count({ where }),
    ])

    return apiPaginated(brands, { page, limit, total })
  } catch (error) {
    console.error('Error fetching brands:', error)
    return apiError('Failed to fetch brands', 500)
  }
}

// POST /api/brands - Create new brand
export async function POST(request: Request) {
  const session = await requireAuth()
  if (!session) return apiError('Unauthorized', 401)

  const result = await validateBody(request, createBrandSchema)
  if (!result.success) return apiError(result.error, 400)

  try {
    const body = result.data

    // Log the incoming data for debugging

    // Generate sequential systemId - use 'brands' entity type (not 'BRAND')
    const { systemId } = await generateNextIds('brands')

    const brand = await prisma.brand.create({
      data: {
        systemId,
        id: body.id,
        name: body.name,
        description: body.description,
        logo: body.logo,
        logoUrl: body.logoUrl,
        website: body.website,
        // SEO fields
        seoTitle: body.seoTitle,
        metaDescription: body.metaDescription,
        seoKeywords: body.seoKeywords,
        shortDescription: body.shortDescription,
        longDescription: body.longDescription,
        // Multi-website SEO (JSON field)
        websiteSeo: body.websiteSeo || Prisma.JsonNull,
      },
    })

    
    // Invalidate brands cache
    cache.deletePattern('^brands:')
    
    return apiSuccess(brand, 201)
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
      const target = error.meta?.target as string[] | undefined
      console.error('[POST /api/brands] Unique constraint violation:', { code: error.code, target, body: result.data })
      return apiError(`Mã thương hiệu đã tồn tại: ${target?.join(', ') || 'unknown field'}`, 400)
    }
    console.error('[POST /api/brands] Error creating brand:', error instanceof Error ? error.message : error, { body: result.data })
    return apiError(`Failed to create brand: ${error instanceof Error ? error.message : 'Unknown error'}`, 500)
  }
}
