import { getMeiliClient, INDEXES, healthCheck } from '@/lib/meilisearch'
import type { MeiliCustomer } from '@/lib/meilisearch'
import { requireAuth, validateQuery, apiError, apiSuccess } from '@/lib/api-utils'
import { logError } from '@/lib/logger'
import { prismaCustomerSearch } from '@/lib/search/customers-prisma-fallback'
import { customerSearchSchema } from '../validation'

/**
 * MEILISEARCH CUSTOMER SEARCH API
 *
 * Fast fuzzy search for customers by name, phone, email.
 * Falls back to Prisma when Meilisearch is unavailable.
 *
 * Usage:
 *   GET /api/search/customers?q=nguyen&limit=20
 *   GET /api/search/customers?q=0909&status=ACTIVE
 */

export async function GET(request: Request) {
  try {
    const session = await requireAuth()
    if (!session) return apiError('Unauthorized', 401)

    const { searchParams } = new URL(request.url)
    const validation = await validateQuery(searchParams, customerSearchSchema)
    if (!validation.success) return apiError(validation.error, 400)
    const { q, limit, offset, city, district, status, type, customerGroup, sort } = validation.data

    const query = q.trim()
    const startTime = Date.now()

    // Check Meilisearch health
    const isHealthy = await healthCheck()
    if (!isHealthy) {
      const { hits, estimatedTotal } = await prismaCustomerSearch({
        query,
        limit,
        offset,
        status,
        type,
        customerGroup,
      })
      const searchTime = Date.now() - startTime
      return apiSuccess({
        data: hits,
        meta: {
          source: 'fallback',
          total: estimatedTotal,
          limit,
          offset,
          query,
          searchTimeMs: searchTime,
        },
      })
    }

    const client = getMeiliClient()
    const index = client.index<MeiliCustomer>(INDEXES.CUSTOMERS)

    const filters: string[] = []
    if (city) filters.push(`city = "${city}"`)
    if (district) filters.push(`district = "${district}"`)
    if (status) filters.push(`status = "${status}"`)

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

    return apiSuccess({
      data: customers,
      meta: {
        source: 'meilisearch',
        total: results.estimatedTotalHits,
        limit,
        offset,
        query,
        searchTimeMs: searchTime,
        processingTimeMs: results.processingTimeMs,
      },
    })
  } catch (error) {
    logError('Meilisearch customer search error', error)
    return apiError('Search failed', 500)
  }
}
