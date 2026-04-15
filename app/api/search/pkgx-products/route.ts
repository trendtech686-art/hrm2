import { getMeiliClient, INDEXES, healthCheck } from '@/lib/meilisearch'
import type { MeiliPkgxProduct } from '@/lib/meilisearch'
import { requireAuth, apiError } from '@/lib/api-utils'
import { NextResponse } from 'next/server'
import { logError } from '@/lib/logger'

/**
 * MEILISEARCH PKGX PRODUCT SEARCH API
 * 
 * Search PKGX products with:
 * - Typo tolerance
 * - Vietnamese accent support
 * - Pagination (offset/limit)
 * - Filter by mapped/unmapped
 * 
 * Usage:
 *   GET /api/search/pkgx-products?q=hoco&limit=30
 *   GET /api/search/pkgx-products?q=cap sac&mapped=false
 */
export async function GET(request: Request) {
  const session = await requireAuth()
  if (!session) return apiError('Unauthorized', 401)

  try {
    const isHealthy = await healthCheck()
    if (!isHealthy) {
      return apiError('Search service unavailable', 503)
    }

    const { searchParams } = new URL(request.url)
    
    const query = searchParams.get('q')?.trim() || ''
    const limit = Math.min(parseInt(searchParams.get('limit') || '30', 10), 100)
    const offset = parseInt(searchParams.get('offset') || '0', 10)
    
    const catId = searchParams.get('catId')
    const brandId = searchParams.get('brandId')
    const mapped = searchParams.get('mapped') // 'true' | 'false'

    const client = getMeiliClient()
    const index = client.index<MeiliPkgxProduct>(INDEXES.PKGX_PRODUCTS)

    const filters: string[] = []
    if (catId) filters.push(`catId = ${catId}`)
    if (brandId) filters.push(`brandId = ${brandId}`)
    if (mapped === 'true') filters.push(`hrmProductId IS NOT NULL`)
    else if (mapped === 'false') filters.push(`hrmProductId IS NULL`)

    const results = await index.search(query, {
      limit,
      offset,
      filter: filters.length > 0 ? filters.join(' AND ') : undefined,
      sort: ['name:asc'],
      attributesToRetrieve: [
        'id', 'goodsSn', 'goodsNumber', 'name',
        'catId', 'catName', 'brandId', 'brandName',
        'shopPrice', 'hrmProductId',
      ],
    })

    const products = results.hits.map(hit => ({
      id: hit.id,
      goodsSn: hit.goodsSn,
      goodsNumber: hit.goodsNumber,
      name: hit.name,
      catId: hit.catId,
      catName: hit.catName,
      brandId: hit.brandId,
      brandName: hit.brandName,
      shopPrice: hit.shopPrice,
      hrmProductId: hit.hrmProductId,
    }))

    return NextResponse.json({
      data: products,
      meta: {
        total: results.estimatedTotalHits,
        limit,
        offset,
        query,
      },
    })
  } catch (error) {
    logError('Meilisearch PKGX product search error', error)
    return apiError('Search failed', 500)
  }
}
