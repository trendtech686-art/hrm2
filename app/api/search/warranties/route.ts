import { getMeiliClient, INDEXES, healthCheck } from '@/lib/meilisearch'
import type { MeiliWarranty } from '@/lib/meilisearch'
import { requireAuth, validateQuery, apiError, apiSuccess } from '@/lib/api-utils'
import { logError } from '@/lib/logger'
import { prismaWarrantySearch } from '@/lib/search/warranties-prisma-fallback'
import { warrantySearchSchema } from '../validation'

/**
 * MEILISEARCH WARRANTY SEARCH API
 *
 * Fast fuzzy search for warranties by code, customer name, product name.
 * Falls back to Prisma when Meilisearch is unavailable.
 *
 * Usage:
 *   GET /api/search/warranties?q=WRT-001&limit=20
 *   GET /api/search/warranties?q=nguyen&status=completed
 */

export async function GET(request: Request) {
  try {
    const session = await requireAuth()
    if (!session) return apiError('Unauthorized', 401)

    const { searchParams } = new URL(request.url)
    const validation = await validateQuery(searchParams, warrantySearchSchema)
    if (!validation.success) return apiError(validation.error, 400)
    const { q, limit, offset, status, priority, isUnderWarranty, branchId, sort } = validation.data

    const query = q.trim()
    const startTime = Date.now()

    // Check Meilisearch health
    const isHealthy = await healthCheck()
    if (!isHealthy) {
      const isUnderWarrantyBool = isUnderWarranty === 'true' ? true : isUnderWarranty === 'false' ? false : null
      const { hits, estimatedTotal } = await prismaWarrantySearch({
        query,
        limit,
        offset,
        status,
        priority,
        isUnderWarranty: isUnderWarrantyBool,
        branchId,
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
    const index = client.index<MeiliWarranty>(INDEXES.WARRANTIES)

    const filters: string[] = []
    if (status) filters.push(`status = "${status}"`)
    if (priority) filters.push(`priority = "${priority}"`)
    if (isUnderWarranty !== null) filters.push(`isUnderWarranty = ${isUnderWarranty === 'true'}`)
    if (branchId) filters.push(`branchId = "${branchId}"`)

    const results = await index.search(query, {
      limit,
      offset,
      filter: filters.length > 0 ? filters.join(' AND ') : undefined,
      sort: [sort],
      attributesToRetrieve: [
        'id',
        'warrantyId',
        'warrantyCode',
        'title',
        'customerName',
        'customerPhone',
        'customerEmail',
        'customerAddress',
        'productName',
        'serialNumber',
        'status',
        'priority',
        'branchName',
        'assigneeName',
        'orderId',
        'isUnderWarranty',
        'totalCost',
        'createdAt',
        'receivedAt',
        'completedAt',
      ],
      attributesToHighlight: ['warrantyId', 'warrantyCode', 'title', 'customerName', 'customerPhone', 'productName'],
      highlightPreTag: '<mark>',
      highlightPostTag: '</mark>',
    })

    const searchTime = Date.now() - startTime

    const warranties = results.hits.map(hit => ({
      systemId: hit.id,
      warrantyId: hit.warrantyId,
      warrantyCode: hit.warrantyCode,
      title: hit.title,
      customerName: hit.customerName,
      customerPhone: hit.customerPhone,
      customerEmail: hit.customerEmail,
      customerAddress: hit.customerAddress,
      productName: hit.productName,
      serialNumber: hit.serialNumber,
      status: hit.status,
      priority: hit.priority,
      branchName: hit.branchName,
      assigneeName: hit.assigneeName,
      orderId: hit.orderId,
      isUnderWarranty: hit.isUnderWarranty,
      totalCost: hit.totalCost,
      createdAt: hit.createdAt ? new Date(hit.createdAt).toISOString() : null,
      receivedAt: hit.receivedAt ? new Date(hit.receivedAt).toISOString() : null,
      completedAt: hit.completedAt ? new Date(hit.completedAt).toISOString() : null,
      _highlight: hit._formatted ? {
        warrantyId: hit._formatted.warrantyId,
        warrantyCode: hit._formatted.warrantyCode,
        title: hit._formatted.title,
        customerName: hit._formatted.customerName,
        customerPhone: hit._formatted.customerPhone,
        productName: hit._formatted.productName,
      } : undefined,
    }))

    return apiSuccess({
      data: warranties,
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
    logError('Meilisearch warranty search error', error)
    return apiError('Search failed', 500)
  }
}
