import { getMeiliClient, INDEXES, healthCheck } from '@/lib/meilisearch'
import type { MeiliOrder } from '@/lib/meilisearch'
import { requireAuth, apiError } from '@/lib/api-utils'
import { NextResponse } from 'next/server'
import { logError } from '@/lib/logger'

/**
 * MEILISEARCH ORDER SEARCH API
 * 
 * Fast fuzzy search for orders by order ID, customer name/phone
 * 
 * Usage:
 *   GET /api/search/orders?q=ORD-2024&limit=20
 *   GET /api/search/orders?q=nguyen&status=completed
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
    const limit = Math.min(parseInt(searchParams.get('limit') || '20', 10), 100)
    const offset = parseInt(searchParams.get('offset') || '0', 10)
    
    // Filters
    const status = searchParams.get('status')
    const branchId = searchParams.get('branchId')
    const fromDate = searchParams.get('fromDate')
    const toDate = searchParams.get('toDate')
    
    // Sorting
    const sort = searchParams.get('sort') || 'createdAt:desc'

    const client = getMeiliClient()
    const index = client.index<MeiliOrder>(INDEXES.ORDERS)

    const filters: string[] = []
    if (status) filters.push(`status = "${status}"`)
    if (branchId) filters.push(`branchId = "${branchId}"`)
    if (fromDate) {
      const fromTs = new Date(fromDate).getTime()
      filters.push(`createdAt >= ${fromTs}`)
    }
    if (toDate) {
      const toTs = new Date(toDate).getTime()
      filters.push(`createdAt <= ${toTs}`)
    }

    const startTime = Date.now()
    
    const results = await index.search(query, {
      limit,
      offset,
      filter: filters.length > 0 ? filters.join(' AND ') : undefined,
      sort: [sort],
      attributesToRetrieve: [
        'id',
        'orderId',
        'customerName',
        'customerPhone',
        'status',
        'totalAmount',
        'branchId',
        'branchName',
        'createdAt',
      ],
      attributesToHighlight: ['orderId', 'customerName', 'customerPhone'],
      highlightPreTag: '<mark>',
      highlightPostTag: '</mark>',
    })

    const searchTime = Date.now() - startTime

    const orders = results.hits.map(hit => ({
      systemId: hit.id,
      id: hit.orderId,
      customerName: hit.customerName,
      customerPhone: hit.customerPhone,
      status: hit.status,
      totalAmount: hit.totalAmount,
      branchId: hit.branchId,
      branchName: hit.branchName,
      createdAt: hit.createdAt ? new Date(hit.createdAt).toISOString() : null,
      _highlight: hit._formatted ? {
        orderId: hit._formatted.orderId,
        customerName: hit._formatted.customerName,
        customerPhone: hit._formatted.customerPhone,
      } : undefined,
    }))

    return NextResponse.json({
      data: orders,
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
    logError('Meilisearch order search error', error)
    return apiError('Search failed', 500)
  }
}
