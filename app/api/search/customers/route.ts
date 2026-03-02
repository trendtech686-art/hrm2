import { getMeiliClient, INDEXES, healthCheck } from '@/lib/meilisearch'
import type { MeiliCustomer } from '@/lib/meilisearch'
import { requireAuth, apiError } from '@/lib/api-utils'
import { NextResponse } from 'next/server'

/**
 * MEILISEARCH CUSTOMER SEARCH API
 * 
 * Fast fuzzy search for customers by name, phone, email
 * 
 * Usage:
 *   GET /api/search/customers?q=nguyen&limit=20
 *   GET /api/search/customers?q=0909&city=HCM
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
    const city = searchParams.get('city')
    const district = searchParams.get('district')
    
    // Sorting
    const sort = searchParams.get('sort') || 'createdAt:desc'

    const client = getMeiliClient()
    const index = client.index<MeiliCustomer>(INDEXES.CUSTOMERS)

    const filters: string[] = []
    if (city) filters.push(`city = "${city}"`)
    if (district) filters.push(`district = "${district}"`)

    const startTime = Date.now()
    
    const results = await index.search(query, {
      limit,
      offset,
      filter: filters.length > 0 ? filters.join(' AND ') : undefined,
      sort: [sort],
      attributesToRetrieve: [
        'id',
        'customerId',
        'name',
        'phone',
        'email',
        'address',
        'city',
        'district',
        'totalOrders',
        'totalSpent',
      ],
      attributesToHighlight: ['name', 'phone', 'email'],
      highlightPreTag: '<mark>',
      highlightPostTag: '</mark>',
    })

    const searchTime = Date.now() - startTime

    const customers = results.hits.map(hit => ({
      systemId: hit.id,
      id: hit.customerId,
      name: hit.name,
      phone: hit.phone,
      email: hit.email,
      address: hit.address,
      city: hit.city,
      district: hit.district,
      totalOrders: hit.totalOrders,
      totalSpent: hit.totalSpent,
      _highlight: hit._formatted ? {
        name: hit._formatted.name,
        phone: hit._formatted.phone,
        email: hit._formatted.email,
      } : undefined,
    }))

    return NextResponse.json({
      data: customers,
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
    console.error('Meilisearch customer search error:', error)
    return apiError('Search failed', 500)
  }
}
