import { getMeiliClient, INDEXES, healthCheck } from '@/lib/meilisearch'
import type { MeiliProduct } from '@/lib/meilisearch'
import { requireAuth, apiError, apiSuccess } from '@/lib/api-utils'
import { logError } from '@/lib/logger'
import { prismaProductSearchAsMeiliHits } from '@/lib/search/products-meilisearch-fallback-prisma'

/**
 * MEILISEARCH PRODUCT SEARCH API
 *
 * Meili fuzzy + khi có query mà Meili trả 0 hit → fallback Prisma tokenize (AND substring)
 * giống `/api/products/list`.
 */

function mapMeiliHitToDto(hit: MeiliProduct & { _formatted?: Record<string, string | undefined> }) {
  return {
    systemId: hit.id,
    id: hit.productId,
    name: hit.name,
    barcode: hit.barcode,
    brandId: hit.brandId,
    brandName: hit.brandName,
    categoryId: hit.categoryId,
    categoryName: hit.categoryName,
    costPrice: hit.costPrice,
    lastPurchasePrice: hit.lastPurchasePrice || 0,
    price: hit.price || 0,
    prices: hit.prices || {},
    unit: hit.unit || 'Cái',
    status: hit.status,
    thumbnailImage: hit.thumbnailImage,
    pkgxId: hit.pkgxId,
    totalStock: hit.totalStock || 0,
    branchStocks: hit.branchStocks || [],
    _highlight: hit._formatted
      ? {
          name: hit._formatted.name,
          productId: hit._formatted.productId,
        }
      : undefined,
  }
}

export async function GET(request: Request) {
  const session = await requireAuth()
  if (!session) return apiError('Unauthorized', 401)

  try {
    const isHealthy = await healthCheck()

    const { searchParams } = new URL(request.url)

    const query = searchParams.get('q')?.trim() || ''
    const limit = Math.min(parseInt(searchParams.get('limit') || '20', 10), 100)
    const offset = parseInt(searchParams.get('offset') || '0', 10)

    const brandId = searchParams.get('brandId')
    const categoryId = searchParams.get('categoryId')
    const status = searchParams.get('status')

    const sort = searchParams.get('sort')

    const startTime = Date.now()

    if (!isHealthy) {
      if (!query) {
        return apiError('Search service unavailable', 503)
      }
      const fb = await prismaProductSearchAsMeiliHits({
        query,
        limit,
        offset,
        brandId,
        categoryId,
        status,
      })
      const products = fb.hits.map((h) => ({
        systemId: h.systemId,
        id: h.id,
        name: h.name,
        barcode: h.barcode,
        brandId: h.brandId,
        brandName: h.brandName,
        categoryId: h.categoryId,
        categoryName: h.categoryName,
        costPrice: h.costPrice,
        lastPurchasePrice: h.lastPurchasePrice,
        price: h.price,
        prices: h.prices,
        unit: h.unit,
        status: h.status,
        thumbnailImage: h.thumbnailImage,
        pkgxId: h.pkgxId,
        totalStock: h.totalStock,
        branchStocks: h.branchStocks,
        _highlight: undefined as undefined,
      }))
      return apiSuccess({
        data: products,
        meta: {
          total: fb.estimatedTotal,
          limit,
          offset,
          query,
          searchTimeMs: Date.now() - startTime,
          processingTimeMs: 0,
          fallback: 'prisma',
        },
      })
    }

    const client = getMeiliClient()
    const index = client.index<MeiliProduct>(INDEXES.PRODUCTS)

    const filters: string[] = []
    if (brandId) filters.push(`brandId = "${brandId}"`)
    if (categoryId) filters.push(`categoryId = "${categoryId}"`)
    if (status) filters.push(`status = "${status}"`)

    const results = await index.search(query, {
      limit,
      offset,
      filter: filters.length > 0 ? filters.join(' AND ') : undefined,
      sort: sort ? [sort] : ['createdAt:desc'],
      attributesToRetrieve: [
        'id',
        'productId',
        'name',
        'nameVat',
        'barcode',
        'brandId',
        'brandName',
        'categoryId',
        'categoryName',
        'costPrice',
        'lastPurchasePrice',
        'price',
        'prices',
        'unit',
        'status',
        'thumbnailImage',
        'pkgxId',
        'totalStock',
        'branchStocks',
      ],
      attributesToHighlight: ['name', 'productId', 'nameVat'],
      highlightPreTag: '<mark>',
      highlightPostTag: '</mark>',
    })

    const searchTime = Date.now() - startTime

    let hits = results.hits as (MeiliProduct & { _formatted?: Record<string, string | undefined> })[]
    let totalHits = results.estimatedTotalHits ?? 0
    let processingMs = results.processingTimeMs
    let usedFallback: 'prisma' | undefined

    if (query && hits.length === 0) {
      const fb = await prismaProductSearchAsMeiliHits({
        query,
        limit,
        offset,
        brandId,
        categoryId,
        status,
      })
      if (fb.hits.length > 0) {
        hits = fb.hits.map((h) => ({
          id: h.systemId,
          productId: h.id,
          name: h.name,
          nameVat: null,
          barcode: h.barcode,
          brandId: h.brandId,
          brandName: h.brandName,
          categoryId: h.categoryId,
          categoryName: h.categoryName,
          costPrice: h.costPrice,
          lastPurchasePrice: h.lastPurchasePrice,
          price: h.price,
          prices: h.prices,
          unit: h.unit,
          status: h.status,
          thumbnailImage: h.thumbnailImage,
          pkgxId: h.pkgxId,
          totalStock: h.totalStock,
          branchStocks: h.branchStocks,
          createdAt: 0,
          updatedAt: 0,
        })) as (MeiliProduct & { _formatted?: Record<string, string | undefined> })[]
        totalHits = fb.estimatedTotal
        processingMs = 0
        usedFallback = 'prisma'
      }
    }

    const products = hits.map((hit) => mapMeiliHitToDto(hit))

    return apiSuccess({
      data: products,
      meta: {
        total: totalHits,
        limit,
        offset,
        query,
        searchTimeMs: searchTime,
        processingTimeMs: processingMs,
        ...(usedFallback ? { fallback: usedFallback } : {}),
      },
    })
  } catch (error) {
    logError('Meilisearch product search error', error)
    return apiError('Search failed', 500)
  }
}
