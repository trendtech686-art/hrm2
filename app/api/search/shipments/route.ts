import { getMeiliClient, INDEXES, healthCheck } from '@/lib/meilisearch'
import type { MeiliShipment } from '@/lib/meilisearch'
import { requireAuth, validateQuery, apiError, apiSuccess } from '@/lib/api-utils'
import { logError } from '@/lib/logger'
import { prismaShipmentSearch } from '@/lib/search/shipments-prisma-fallback'
import { shipmentSearchSchema } from '../validation'

/**
 * MEILISEARCH SHIPMENT SEARCH API
 *
 * Fast fuzzy search for shipments by tracking code, recipient info.
 * Falls back to Prisma when Meilisearch is unavailable.
 *
 * Usage:
 *   GET /api/search/shipments?q=ABC123&limit=20
 *   GET /api/search/shipments?q=nguyen&status=delivered
 */

export async function GET(request: Request) {
  try {
    const session = await requireAuth()
    if (!session) return apiError('Unauthorized', 401)

    const { searchParams } = new URL(request.url)
    const validation = await validateQuery(searchParams, shipmentSearchSchema)
    if (!validation.success) return apiError(validation.error, 400)
    const { q, limit, offset, status, carrier, printStatus, deliveryStatus, sort } = validation.data

    const query = q.trim()
    const startTime = Date.now()

    // Check Meilisearch health
    const isHealthy = await healthCheck()
    if (!isHealthy) {
      const { hits, estimatedTotal } = await prismaShipmentSearch({
        query,
        limit,
        offset,
        status,
        carrier,
        printStatus,
        deliveryStatus,
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
    const index = client.index<MeiliShipment>(INDEXES.SHIPMENTS)

    const filters: string[] = []
    if (status) filters.push(`status = "${status}"`)
    if (carrier) filters.push(`carrier = "${carrier}"`)
    if (printStatus) filters.push(`printStatus = "${printStatus}"`)
    if (deliveryStatus) filters.push(`deliveryStatus = "${deliveryStatus}"`)

    const results = await index.search(query, {
      limit,
      offset,
      filter: filters.length > 0 ? filters.join(' AND ') : undefined,
      sort: [sort],
      attributesToRetrieve: [
        'id',
        'trackingCode',
        'trackingNumber',
        'carrier',
        'status',
        'service',
        'orderId',
        'orderBusinessId',
        'recipientName',
        'recipientPhone',
        'recipientAddress',
        'shippingFee',
        'weight',
        'createdAt',
        'pickedAt',
        'deliveredAt',
        'returnedAt',
        'printStatus',
        'deliveryStatus',
      ],
      attributesToHighlight: ['trackingCode', 'trackingNumber', 'recipientName', 'recipientPhone'],
      highlightPreTag: '<mark>',
      highlightPostTag: '</mark>',
    })

    const searchTime = Date.now() - startTime

    const shipments = results.hits.map(hit => ({
      systemId: hit.id,
      trackingCode: hit.trackingCode,
      trackingNumber: hit.trackingNumber,
      carrier: hit.carrier,
      status: hit.status,
      service: hit.service,
      orderId: hit.orderId,
      orderBusinessId: hit.orderBusinessId,
      recipientName: hit.recipientName,
      recipientPhone: hit.recipientPhone,
      recipientAddress: hit.recipientAddress,
      shippingFee: hit.shippingFee,
      weight: hit.weight,
      createdAt: hit.createdAt ? new Date(hit.createdAt).toISOString() : null,
      pickedAt: hit.pickedAt ? new Date(hit.pickedAt).toISOString() : null,
      deliveredAt: hit.deliveredAt ? new Date(hit.deliveredAt).toISOString() : null,
      returnedAt: hit.returnedAt ? new Date(hit.returnedAt).toISOString() : null,
      printStatus: hit.printStatus,
      deliveryStatus: hit.deliveryStatus,
      _highlight: hit._formatted ? {
        trackingCode: hit._formatted.trackingCode,
        trackingNumber: hit._formatted.trackingNumber,
        recipientName: hit._formatted.recipientName,
        recipientPhone: hit._formatted.recipientPhone,
      } : undefined,
    }))

    return apiSuccess({
      data: shipments,
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
    logError('Meilisearch shipment search error', error)
    return apiError('Search failed', 500)
  }
}
