import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth, validateBody, apiSuccess, apiError, parsePagination } from '@/lib/api-utils'
import { z } from 'zod'
import { cache, CACHE_TTL } from '@/lib/cache'

// Schema for syncing products from PKGX
// Use z.coerce to automatically convert string → number from PKGX API
const syncProductsSchema = z.object({
  products: z.array(z.object({
    id: z.coerce.number(), // goods_id - may come as string from PKGX
    goodsSn: z.string().optional().nullable(), // SKU from PKGX (goods_sn)
    goodsNumber: z.string().optional().nullable(),
    name: z.string().nullable().optional().default(''), // Allow null/empty
    catId: z.coerce.number().optional().nullable(),
    catName: z.string().optional().nullable(),
    brandId: z.coerce.number().optional().nullable(),
    brandName: z.string().optional().nullable(),
    shopPrice: z.coerce.number().optional().nullable(),
    marketPrice: z.coerce.number().optional().nullable(),
    partnerPrice: z.coerce.number().optional().nullable(),
    acePrice: z.coerce.number().optional().nullable(),
    dealPrice: z.coerce.number().optional().nullable(),
    goodsNumber2: z.string().optional().nullable(),
    goodsWeight: z.coerce.number().optional().nullable(),
    goodsQuantity: z.coerce.number().optional().nullable(),
    warnNumber: z.coerce.number().optional().nullable(),
    goodsThumb: z.string().optional().nullable(),
    originalImg: z.string().optional().nullable(),
    goodsBrief: z.string().optional().nullable(),
    goodsDesc: z.string().optional().nullable(),
    isBest: z.coerce.number().optional().nullable(),
    isNew: z.coerce.number().optional().nullable(),
    isHot: z.coerce.number().optional().nullable(),
    isHome: z.coerce.number().optional().nullable(),
    isOnsale: z.coerce.number().optional().nullable(),
    isReal: z.coerce.number().optional().nullable(),
    keywords: z.string().optional().nullable(),
    ktitle: z.string().optional().nullable(),
    goodsAlias: z.string().optional().nullable(),
    lastUpdate: z.coerce.number().optional().nullable(),
    hrmProductId: z.string().optional().nullable(),
  })),
})

// GET /api/settings/pkgx/products - List all PKGX products from database
export async function GET(request: NextRequest) {
  const session = await requireAuth()
  if (!session) return apiError('Unauthorized', 401)

  try {
    const { searchParams } = new URL(request.url)
    const { page, limit, skip: _skip } = parsePagination(searchParams)
    const search = searchParams.get('search') || ''
    const catId = searchParams.get('catId')
    const brandId = searchParams.get('brandId')
    const mapped = searchParams.get('mapped') // 'true' | 'false' | null

    // Cache for non-search queries
    const cacheKey = !search && !catId && !brandId && !mapped 
      ? `pkgx-products:page${page}:limit${limit}` 
      : null
    
    if (cacheKey) {
      const cached = cache.get(cacheKey)
      if (cached) return apiSuccess(cached)
    }

    const where: Record<string, unknown> = {}
    
    if (search) {
      // Search by name, goodsSn, goodsNumber, or id (if numeric)
      const isNumeric = /^\d+$/.test(search)
      const orConditions: Record<string, unknown>[] = [
        { name: { contains: search, mode: 'insensitive' } },
        { goodsSn: { contains: search, mode: 'insensitive' } },
        { goodsNumber: { contains: search, mode: 'insensitive' } },
      ]
      
      // If search term is numeric, also search by id
      if (isNumeric) {
        orConditions.push({ id: parseInt(search) })
      }
      
      where.OR = orConditions
    }
    
    if (catId) {
      where.catId = parseInt(catId)
    }
    
    if (brandId) {
      where.brandId = parseInt(brandId)
    }
    
    if (mapped === 'true') {
      where.hrmProductId = { not: null }
    } else if (mapped === 'false') {
      where.hrmProductId = null
    }

    const [products, total] = await Promise.all([
      prisma.pkgxProduct.findMany({
        where,
        orderBy: [
          { name: 'asc' },
        ],
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.pkgxProduct.count({ where }),
    ])

    const result = { 
      success: true,
      data: products,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    }

    // Cache result
    if (cacheKey) {
      cache.set(cacheKey, result, CACHE_TTL.MEDIUM)
    }

    return apiSuccess(result)
  } catch (error) {
    console.error('[PKGX Products GET] Error:', error)
    const errMsg = error instanceof Error ? error.message : String(error)
    return apiError(`Failed to fetch PKGX products: ${errMsg}`, 500)
  }
}

// POST /api/settings/pkgx/products - Sync products from PKGX API to database
export async function POST(request: NextRequest) {
  const session = await requireAuth()
  if (!session) return apiError('Unauthorized', 401)

  const validation = await validateBody(request, syncProductsSchema)
  if (!validation.success) {
    console.error('[PKGX Products POST] Validation error:', validation.error)
    return apiError(validation.error, 400)
  }

  try {
    const { products } = validation.data

    // Get existing products to preserve hrmProductId mappings
    const existingProducts = await prisma.pkgxProduct.findMany({
      select: { id: true, hrmProductId: true },
    })
    const existingMap = new Map(existingProducts.map(p => [p.id, p.hrmProductId]))

    // Use smaller batch size to avoid transaction timeout
    const BATCH_SIZE = 50
    let synced = 0
    
    for (let i = 0; i < products.length; i += BATCH_SIZE) {
      const batch = products.slice(i, i + BATCH_SIZE)
      
      // Use interactive transaction with extended timeout for batch processing
      await prisma.$transaction(async (tx) => {
        for (const prod of batch) {
          const existingHrmId = existingMap.get(prod.id)
          const hrmProductId = prod.hrmProductId ?? existingHrmId ?? null
          const productName = prod.name || `Product ${prod.id}`
          
          await tx.pkgxProduct.upsert({
            where: { id: prod.id },
            update: {
              goodsSn: prod.goodsSn,
              goodsNumber: prod.goodsNumber,
              name: productName,
              catId: prod.catId,
              catName: prod.catName,
              brandId: prod.brandId,
              brandName: prod.brandName,
              shopPrice: prod.shopPrice,
              marketPrice: prod.marketPrice,
              partnerPrice: prod.partnerPrice,
              acePrice: prod.acePrice,
              dealPrice: prod.dealPrice,
              goodsNumber2: prod.goodsNumber2,
              goodsWeight: prod.goodsWeight,
              goodsQuantity: prod.goodsQuantity,
              warnNumber: prod.warnNumber,
              goodsThumb: prod.goodsThumb,
              originalImg: prod.originalImg,
              goodsBrief: prod.goodsBrief,
              goodsDesc: prod.goodsDesc,
              isBest: prod.isBest,
              isNew: prod.isNew,
              isHot: prod.isHot,
              isHome: prod.isHome,
              isOnsale: prod.isOnsale,
              isReal: prod.isReal,
              keywords: prod.keywords,
              ktitle: prod.ktitle,
              goodsAlias: prod.goodsAlias,
              lastUpdate: prod.lastUpdate,
              hrmProductId,
              syncedAt: new Date(),
            },
            create: {
              id: prod.id,
              goodsSn: prod.goodsSn,
              goodsNumber: prod.goodsNumber,
              name: productName,
              catId: prod.catId,
              catName: prod.catName,
              brandId: prod.brandId,
              brandName: prod.brandName,
              shopPrice: prod.shopPrice,
              marketPrice: prod.marketPrice,
              partnerPrice: prod.partnerPrice,
              acePrice: prod.acePrice,
              dealPrice: prod.dealPrice,
              goodsNumber2: prod.goodsNumber2,
              goodsWeight: prod.goodsWeight,
              goodsQuantity: prod.goodsQuantity,
              warnNumber: prod.warnNumber,
              goodsThumb: prod.goodsThumb,
              originalImg: prod.originalImg,
              goodsBrief: prod.goodsBrief,
              goodsDesc: prod.goodsDesc,
              isBest: prod.isBest,
              isNew: prod.isNew,
              isHot: prod.isHot,
              isHome: prod.isHome,
              isOnsale: prod.isOnsale,
              isReal: prod.isReal,
              keywords: prod.keywords,
              ktitle: prod.ktitle,
              goodsAlias: prod.goodsAlias,
              lastUpdate: prod.lastUpdate,
              hrmProductId,
            },
          })
        }
      }, { timeout: 60000 }) // 60 second timeout for batch operations
      synced += batch.length
    }

    return apiSuccess({ 
      synced,
      total: products.length,
      message: `Synced ${synced} products to database`,
    })
  } catch (error) {
    console.error('[PKGX Products POST] Error syncing:', error)
    const errMsg = error instanceof Error ? error.message : String(error)
    return apiError(`Failed to sync PKGX products: ${errMsg}`, 500)
  }
}

// DELETE /api/settings/pkgx/products - Clear all cached products
export async function DELETE(_request: NextRequest) {
  const session = await requireAuth()
  if (!session) return apiError('Unauthorized', 401)

  try {
    const result = await prisma.pkgxProduct.deleteMany({})
    
    return apiSuccess({ 
      deleted: result.count,
      message: `Deleted ${result.count} products from cache`,
    })
  } catch (error) {
    console.error('Error clearing PKGX products:', error)
    return apiError('Failed to clear PKGX products', 500)
  }
}
