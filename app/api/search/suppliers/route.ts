import { getMeiliClient, INDEXES, healthCheck } from '@/lib/meilisearch'
import type { MeiliSupplier } from '@/lib/meilisearch'
import { requireAuth, validateQuery, apiError, apiSuccess } from '@/lib/api-utils'
import { logError } from '@/lib/logger'
import { prismaSupplierSearch } from '@/lib/search/suppliers-prisma-fallback'
import { supplierSearchSchema } from '../validation'

/**
 * MEILISEARCH SUPPLIER SEARCH API
 *
 * Fast fuzzy search for suppliers by name, phone, email, address, tax code.
 * Falls back to Prisma when Meilisearch is unavailable.
 *
 * Usage:
 *   GET /api/search/suppliers?q=nha+cung+cap&limit=20
 *   GET /api/search/suppliers?q=abc&isActive=true
 */

export async function GET(request: Request) {
  try {
    const session = await requireAuth()
    if (!session) return apiError('Unauthorized', 401)

    const { searchParams } = new URL(request.url)
    const validation = await validateQuery(searchParams, supplierSearchSchema)
    if (!validation.success) return apiError(validation.error, 400)
    const { q, limit, offset, isActive, status, sort } = validation.data

    const query = q.trim()
    const startTime = Date.now()

    // Check Meilisearch health
    const isHealthy = await healthCheck()
    if (!isHealthy) {
      const isActiveBool = isActive === 'true' ? true : isActive === 'false' ? false : null
      const { hits, estimatedTotal } = await prismaSupplierSearch({
        query,
        limit,
        offset,
        isActive: isActiveBool,
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
    const index = client.index<MeiliSupplier>(INDEXES.SUPPLIERS)

    const filters: string[] = []
    if (isActive !== null) filters.push(`isActive = ${isActive === 'true'}`)
    if (status) filters.push(`status = "${status}"`)

    const results = await index.search(query, {
      limit,
      offset,
      filter: filters.length > 0 ? filters.join(' AND ') : undefined,
      sort: [sort],
      attributesToRetrieve: [
        'id',
        'supplierId',
        'name',
        'phone',
        'email',
        'address',
        'taxCode',
        'contactPerson',
        'totalOrders',
        'totalPurchased',
        'totalDebt',
        'isActive',
        'status',
        'bankName',
        'bankAccount',
      ],
      attributesToHighlight: ['name', 'phone', 'email', 'address'],
      highlightPreTag: '<mark>',
      highlightPostTag: '</mark>',
    })

    const searchTime = Date.now() - startTime

    const suppliers = results.hits.map(hit => ({
      systemId: hit.id,
      id: hit.supplierId,
      name: hit.name,
      phone: hit.phone,
      email: hit.email,
      address: hit.address,
      taxCode: hit.taxCode,
      contactPerson: hit.contactPerson,
      totalOrders: hit.totalOrders,
      totalPurchased: hit.totalPurchased,
      totalDebt: hit.totalDebt,
      isActive: hit.isActive,
      status: hit.status,
      bankName: hit.bankName,
      bankAccount: hit.bankAccount,
      _highlight: hit._formatted ? {
        name: hit._formatted.name,
        phone: hit._formatted.phone,
        email: hit._formatted.email,
        address: hit._formatted.address,
      } : undefined,
    }))

    return apiSuccess({
      data: suppliers,
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
    logError('Meilisearch supplier search error', error)
    return apiError('Search failed', 500)
  }
}
