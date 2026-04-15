import { prisma } from '@/lib/prisma'
import { Prisma } from '@/generated/prisma/client'
import { apiSuccess, apiPaginated, apiError, parsePagination, validateBody } from '@/lib/api-utils'
import { createBrandSchema } from './validation'
import { generateNextIds } from '@/lib/id-system'
import { cache, CACHE_TTL } from '@/lib/cache'
import { apiHandler } from '@/lib/api-handler'
import { createActivityLog } from '@/lib/services/activity-log-service'
import { logError } from '@/lib/logger'

// GET /api/brands - List all brands
export const GET = apiHandler(async (request, { session }) => {
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
    cache.set(cacheKey, result, CACHE_TTL.LONG * 1000)
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
})

// POST /api/brands - Create new brand
export const POST = apiHandler(async (request, { session }) => {
  const result = await validateBody(request, createBrandSchema)
  if (!result.success) return apiError(result.error, 400)

  const body = result.data
  const { systemId } = await generateNextIds('brands')

  try {
    const brand = await prisma.brand.create({
      data: {
        systemId,
        id: body.id,
        name: body.name,
        description: body.description,
        logo: body.logo,
        logoUrl: body.logoUrl,
        website: body.website,
        seoTitle: body.seoTitle,
        metaDescription: body.metaDescription,
        seoKeywords: body.seoKeywords,
        shortDescription: body.shortDescription,
        longDescription: body.longDescription,
        websiteSeo: body.websiteSeo || Prisma.JsonNull,
      },
    })

    await createActivityLog({
      entityType: 'brand',
      entityId: brand.systemId,
      action: `Thêm thương hiệu: ${body.name}`,
      actionType: 'create',
      createdBy: session?.user.id ?? '',
    }).catch(e => logError('[brands] activity log failed', e))

    cache.deletePattern('^brands:')
    return apiSuccess(brand, 201)
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
      const target = error.meta?.target as string[] | undefined
      return apiError(`Mã thương hiệu đã tồn tại: ${target?.join(', ') || 'unknown field'}`, 400)
    }
    throw error // Let apiHandler catch and report to Sentry
  }
})
