import { getMeiliClient, INDEXES, healthCheck } from '@/lib/meilisearch'
import type { MeiliProduct } from '@/lib/meilisearch'
import { requireAuth, apiError } from '@/lib/api-utils'
import { NextResponse } from 'next/server'

/**
 * MEILISEARCH PRODUCT SEARCH API
 * 
 * Ultra-fast fuzzy search with:
 * - Typo tolerance (iphon → iPhone)
 * - Vietnamese accent support
 * - Instant results (< 20ms)
 * - Filtering & sorting
 * 
 * Usage:
 *   GET /api/search/products?q=iphone&limit=20
 *   GET /api/search/products?q=cap sac&brandId=xxx&sort=costPrice:asc
 */

export async function GET(request: Request) {
  const session = await requireAuth()
  if (!session) return apiError('Unauthorized', 401)

  try {
    // Check Meilisearch health
    const isHealthy = await healthCheck()
    if (!isHealthy) {
      return apiError('Search service unavailable', 503)
    }

    const { searchParams } = new URL(request.url)
    
    // Search params
    const query = searchParams.get('q')?.trim() || ''
    const limit = Math.min(parseInt(searchParams.get('limit') || '20', 10), 100)
    const offset = parseInt(searchParams.get('offset') || '0', 10)
    
    // Filters
    const brandId = searchParams.get('brandId')
    const categoryId = searchParams.get('categoryId')
    const status = searchParams.get('status')
    
    // Sorting
    const sort = searchParams.get('sort') // e.g., "name:asc", "costPrice:desc"

    // Build Meilisearch query
    const client = getMeiliClient()
    const index = client.index<MeiliProduct>(INDEXES.PRODUCTS)

    // Build filter array
    const filters: string[] = []
    if (brandId) filters.push(`brandId = "${brandId}"`)
    if (categoryId) filters.push(`categoryId = "${categoryId}"`)
    if (status) filters.push(`status = "${status}"`)

    // Execute search
    const startTime = Date.now()
    
    const results = await index.search(query, {
      limit,
      offset,
      filter: filters.length > 0 ? filters.join(' AND ') : undefined,
      sort: sort ? [sort] : ['createdAt:desc'],
      attributesToRetrieve: [
        'id',
        'productId',
        'name',
        'barcode',
        'brandId',
        'brandName',
        'categoryId',
        'categoryName',
        'costPrice',
        'price',      // ✅ Default selling price
        'prices',     // ✅ All prices by pricingPolicyId
        'unit',       // ✅ Unit of measure
        'status',
        'thumbnailImage',
        'pkgxId',
        'totalStock', // ✅ Total stock across all branches
        'branchStocks', // ✅ Stock per branch
      ],
      attributesToHighlight: ['name', 'productId'],
      highlightPreTag: '<mark>',
      highlightPostTag: '</mark>',
    })

    const searchTime = Date.now() - startTime

    // Transform results
    const products = results.hits.map(hit => ({
      systemId: hit.id,
      id: hit.productId,
      name: hit.name,
      barcode: hit.barcode,
      brandId: hit.brandId,
      brandName: hit.brandName,
      categoryId: hit.categoryId,
      categoryName: hit.categoryName,
      costPrice: hit.costPrice,
      price: hit.price || 0,          // ✅ Default selling price
      prices: hit.prices || {},       // ✅ All prices by pricingPolicyId
      unit: hit.unit || 'Cái',        // ✅ Unit of measure
      status: hit.status,
      thumbnailImage: hit.thumbnailImage,
      pkgxId: hit.pkgxId,
      totalStock: hit.totalStock || 0, // ✅ Total stock
      branchStocks: hit.branchStocks || [], // ✅ Stock per branch
      // Highlighted fields
      _highlight: hit._formatted ? {
        name: hit._formatted.name,
        productId: hit._formatted.productId,
      } : undefined,
    }))

    return NextResponse.json({
      data: products,
      meta: {
        total: results.estimatedTotalHits,
        limit,
        offset,
        query,
        searchTimeMs: searchTime,
        processingTimeMs: results.processingTimeMs,
      },
    })
  } catch (error) {
    console.error('Meilisearch product search error:', error)
    return apiError('Search failed', 500)
  }
}
