import { getMeiliClient, INDEXES, healthCheck } from '@/lib/meilisearch'
import type { MeiliEmployee } from '@/lib/meilisearch'
import { requireAuth, validateQuery, apiError, apiSuccess } from '@/lib/api-utils'
import { logError } from '@/lib/logger'
import { prismaEmployeeSearch } from '@/lib/search/employees-prisma-fallback'
import { employeeSearchSchema } from '../validation'

/**
 * MEILISEARCH EMPLOYEE SEARCH API
 *
 * Search employees by fullName, employeeId, email, phone.
 * Falls back to Prisma when Meilisearch is unavailable.
 */

function mapMeiliHitToDto(hit: MeiliEmployee & { _formatted?: Record<string, string | undefined> }) {
  return {
    systemId: hit.id,
    id: hit.employeeId,
    fullName: hit.fullName,
    email: hit.email,
    phone: hit.phone,
    department: hit.department,
    position: hit.position,
    status: hit.status,
    _highlight: hit._formatted
      ? {
          fullName: hit._formatted.fullName,
          employeeId: hit._formatted.employeeId,
        }
      : undefined,
  }
}

export async function GET(request: Request) {
  try {
    const session = await requireAuth()
    if (!session) return apiError('Unauthorized', 401)

    const { searchParams } = new URL(request.url)
    const validation = await validateQuery(searchParams, employeeSearchSchema)
    if (!validation.success) return apiError(validation.error, 400)
    const { q, limit, offset, department, departmentId, position, status } = validation.data

    const query = q.trim()
    const startTime = Date.now()

    // Check Meilisearch health
    const isHealthy = await healthCheck()
    if (!isHealthy) {
      const { hits, estimatedTotal } = await prismaEmployeeSearch({
        query,
        limit,
        offset,
        departmentId,
        status,
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
    const index = client.index<MeiliEmployee>(INDEXES.EMPLOYEES)

    const filters: string[] = []
    if (department) filters.push(`department = "${department}"`)
    if (position) filters.push(`position = "${position}"`)
    if (status) filters.push(`status = "${status}"`)

    const results = await index.search(query, {
      limit,
      offset,
      filter: filters.length > 0 ? filters.join(' AND ') : undefined,
      sort: ['fullName:asc'],
      attributesToRetrieve: [
        'id',
        'employeeId',
        'fullName',
        'email',
        'phone',
        'department',
        'position',
        'status',
      ],
      attributesToHighlight: ['fullName', 'employeeId', 'email'],
      highlightPreTag: '<mark>',
      highlightPostTag: '</mark>',
    })

    const searchTime = Date.now() - startTime

    const employees = (results.hits as (MeiliEmployee & { _formatted?: Record<string, string | undefined> })[]).map(
      (hit) => mapMeiliHitToDto(hit)
    )

    const totalHits = results.estimatedTotalHits ?? employees.length

    return apiSuccess({
      data: employees,
      meta: {
        source: 'meilisearch',
        total: totalHits,
        limit,
        offset,
        query,
        searchTimeMs: searchTime,
        processingTimeMs: results.processingTimeMs,
      },
    })
  } catch (error) {
    logError('Meilisearch employee search error', error)
    return apiError('Search failed', 500)
  }
}
