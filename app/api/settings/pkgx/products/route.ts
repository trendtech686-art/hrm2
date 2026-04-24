import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth, validateBody, apiSuccess, apiError, parsePagination } from '@/lib/api-utils'
import { z } from 'zod'
import { cache, CACHE_TTL } from '@/lib/cache'
import { logError } from '@/lib/logger'
import { tokenizeSearch } from '@/lib/search/build-search-where'

// Allow longer execution for large batch syncs (2646+ products)
export const maxDuration = 120

// Schema for syncing products from PKGX
// Use z.coerce to automatically convert string → number from PKGX API
const syncProductsSchema = z.object({
  // Optional: all PKGX product IDs to detect deleted products (sent in final batch)
  allPkgxIds: z.array(z.coerce.number()).optional(),
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
    price5Vat: z.coerce.number().optional().nullable(),
    price12Novat: z.coerce.number().optional().nullable(),
    price5Novat: z.coerce.number().optional().nullable(),
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
    vat: z.string().optional().nullable(), // Tên sản phẩm VAT
    addTime: z.coerce.number().optional().nullable(),
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
    
    const pkgxTokens = tokenizeSearch(search)
    if (pkgxTokens.length > 0) {
      const tokenAnd = pkgxTokens.map((token) => {
        const orConditions: Record<string, unknown>[] = [
          { name: { contains: token, mode: 'insensitive' } },
          { goodsSn: { contains: token, mode: 'insensitive' } },
          { goodsNumber: { contains: token, mode: 'insensitive' } },
        ]
        if (/^\d+$/.test(token)) {
          orConditions.push({ id: parseInt(token) })
        }
        return { OR: orConditions }
      })
      if (tokenAnd.length === 1) {
        where.OR = tokenAnd[0].OR
      } else {
        where.AND = tokenAnd
      }
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
      cache.set(cacheKey, result, CACHE_TTL.MEDIUM * 1000)
    }

    return apiSuccess(result)
  } catch (error) {
    logError('[PKGX Products GET] Error', error)
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
    logError('[PKGX Products POST] Validation error', validation.error)
    return apiError(validation.error, 400)
  }

  try {
    const { products, allPkgxIds } = validation.data

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
              price5Vat: prod.price5Vat,
              price12Novat: prod.price12Novat,
              price5Novat: prod.price5Novat,
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
              vat: prod.vat,
              addTime: prod.addTime,
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
              price5Vat: prod.price5Vat,
              price12Novat: prod.price12Novat,
              price5Novat: prod.price5Novat,
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
              vat: prod.vat,
              addTime: prod.addTime,
              lastUpdate: prod.lastUpdate,
              hrmProductId,
            },
          })
        }
      }, { timeout: 60000 }) // 60 second timeout for batch operations

      // Backfill VAT name for already-linked HRM products if the VAT field is empty.
      // This keeps existing mappings up-to-date without forcing a full re-import.
      const vatItems = batch
        .map(prod => ({ pkgxId: prod.id, vat: (prod.vat || '').trim() }))
        .filter(item => item.vat.length > 0)

      for (const item of vatItems) {
        await prisma.product.updateMany({
          where: {
            isDeleted: false,
            pkgxId: item.pkgxId,
            OR: [
              { nameVat: null },
              { nameVat: '' },
            ],
          },
          data: { nameVat: item.vat },
        })
      }

      synced += batch.length
    }

    // Cleanup: remove PKGX products that no longer exist on PKGX
    let deleted = 0
    let unlinked = 0
    if (allPkgxIds && allPkgxIds.length > 0) {
      const validIds = new Set(allPkgxIds)
      const orphanedProducts = existingProducts.filter(p => !validIds.has(p.id))
      if (orphanedProducts.length > 0) {
        const orphanedIds = orphanedProducts.map(p => p.id)
        
        // Clear pkgxId on HRM products linked to deleted PKGX products
        const unlinkResult = await prisma.product.updateMany({
          where: { pkgxId: { in: orphanedIds }, isDeleted: false },
          data: { pkgxId: null },
        })
        unlinked = unlinkResult.count
        
        // Delete orphaned PKGX products from local DB
        const result = await prisma.pkgxProduct.deleteMany({
          where: { id: { in: orphanedIds } },
        })
        deleted = result.count
      }

      // Also cleanup any HRM products with pkgxId not in current PKGX catalog
      // (handles cases where PKGX products were deleted before cleanup logic existed)
      const staleUnlink = await prisma.product.updateMany({
        where: {
          pkgxId: { not: null, notIn: allPkgxIds },
          isDeleted: false,
        },
        data: { pkgxId: null },
      })
      unlinked += staleUnlink.count
    }

    // Clear server-side cache so GET returns fresh data
    cache.deletePattern('pkgx-products:')

    return apiSuccess({ 
      synced,
      deleted,
      unlinked,
      total: products.length,
      message: `Synced ${synced} products, removed ${deleted} deleted, unlinked ${unlinked} HRM products`,
    })
  } catch (error) {
    logError('[PKGX Products POST] Error syncing', error)
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
    
    // Clear server-side cache
    cache.deletePattern('pkgx-products:')

    return apiSuccess({ 
      deleted: result.count,
      message: `Deleted ${result.count} products from cache`,
    })
  } catch (error) {
    logError('Error clearing PKGX products', error)
    return apiError('Failed to clear PKGX products', 500)
  }
}
