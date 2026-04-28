/**
 * Debt Aging Report API
 * 
 * GET /api/reports/debt-aging?type=customer|supplier
 * 
 * Returns debt aging report grouped by time buckets:
 * - Current (0-30 days)
 * - 31-60 days
 * - 61-90 days
 * - Over 90 days
 */

import { prisma } from '@/lib/prisma'
import { requireAuth, apiError, apiPaginated } from '@/lib/api-utils'
import { parsePagination } from '@/lib/api-utils'
import { API_MAX_PAGE_LIMIT } from '@/lib/pagination-constants'
import { logError } from '@/lib/logger'

interface AgingBucket {
  current: number    // 0-30 days
  days31_60: number  // 31-60 days
  days61_90: number  // 61-90 days
  over90: number     // > 90 days
  total: number
}

interface AgingRow {
  systemId: string
  name: string
  phone: string | null
  currentDebt: number
  aging: AgingBucket
}

interface PaginatedAgingResult {
  rows: AgingRow[]
  totals: AgingBucket
}

export async function GET(request: Request) {
  const session = await requireAuth()
  if (!session) return apiError('Unauthorized', 401)

  const { searchParams } = new URL(request.url)
  const type = searchParams.get('type') || 'customer'
  const { page, limit, skip } = parsePagination(searchParams)
  const safeLimit = Math.min(limit, API_MAX_PAGE_LIMIT)

  try {
    if (type === 'supplier') {
      return await supplierDebtAgingOptimized(page, safeLimit, skip)
    }
    return await customerDebtAgingOptimized(page, safeLimit, skip)
  } catch (error) {
    logError('Error generating debt aging report', error)
    return apiError('Failed to generate debt aging report', 500)
  }
}

/**
 * Optimized customer debt aging using raw SQL to avoid N+1 queries.
 * Single query with LEFT JOINs and date-based grouping.
 */
async function customerDebtAgingOptimized(page: number, limit: number, skip: number) {
  const now = new Date()
  const d30 = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
  const d60 = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000)
  const d90 = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000)

  // Single optimized query using raw SQL with JOINs
  // Uses FIFO approach: oldest orders are assumed unpaid first
  const rawResult = await prisma.$queryRaw<Array<{
    systemId: string
    name: string
    phone: string | null
    currentDebt: bigint | number
    orders_json: string | null
  }>>`
    SELECT 
      c."systemId",
      c.name,
      c.phone,
      c."currentDebt",
      COALESCE(
        (
          SELECT json_agg(json_build_object(
            'createdAt', o."createdAt",
            'grandTotal', o."grandTotal"
          ))
          FROM "Order" o
          WHERE o."customerId" = c."systemId"
            AND o.status != 'CANCELLED'
            AND o.status IN ('COMPLETED', 'DELIVERED', 'FULLY_STOCKED_OUT')
        ),
        '[]'
      ) as orders_json
    FROM "Customer" c
    WHERE c."isDeleted" = false
      AND c."currentDebt" > 0
    ORDER BY c.name
  `

  const rows: AgingRow[] = []
  const totals: AgingBucket = { current: 0, days31_60: 0, days61_90: 0, over90: 0, total: 0 }

  for (const row of rawResult) {
    const totalDebt = Number(row.currentDebt ?? 0)
    if (totalDebt <= 0) continue

    // Parse the JSON orders
    let orders: Array<{ createdAt: Date; grandTotal: unknown }> = []
    try {
      orders = JSON.parse(row.orders_json || '[]')
    } catch {
      orders = []
    }

    const aging = classifyAging(orders, d30, d60, d90, totalDebt)
    rows.push({
      systemId: row.systemId,
      name: row.name,
      phone: row.phone,
      currentDebt: totalDebt,
      aging,
    })

    totals.current += aging.current
    totals.days31_60 += aging.days31_60
    totals.days61_90 += aging.days61_90
    totals.over90 += aging.over90
    totals.total += aging.total
  }

  // Apply pagination
  const total = rows.length
  const paginatedRows = rows.slice(skip, skip + limit)

  return apiPaginated(paginatedRows, { page, limit, total, _totals: totals })
}

/**
 * Optimized supplier debt aging using raw SQL to avoid N+1 queries.
 * Single query with LEFT JOINs and date-based grouping.
 */
async function supplierDebtAgingOptimized(page: number, limit: number, skip: number) {
  const now = new Date()
  const d30 = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
  const d60 = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000)
  const d90 = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000)

  // Single optimized query using raw SQL with JOINs
  const rawResult = await prisma.$queryRaw<Array<{
    systemId: string
    name: string
    phone: string | null
    currentDebt: bigint | number
    pos_json: string | null
  }>>`
    SELECT 
      s."systemId",
      s.name,
      s.phone,
      s."currentDebt",
      COALESCE(
        (
          SELECT json_agg(json_build_object(
            'createdAt', po."createdAt",
            'grandTotal', COALESCE(po.subtotal, 0) - COALESCE(po.discount, 0)
          ))
          FROM "PurchaseOrder" po
          WHERE (po."supplierSystemId" = s."systemId" OR po."supplierId" = s."systemId")
            AND po."isDeleted" = false
            AND po.status != 'CANCELLED'
            AND po."deliveryStatus" = 'Đã nhập'
        ),
        '[]'
      ) as pos_json
    FROM "Supplier" s
    WHERE s."isDeleted" = false
      AND s."currentDebt" > 0
    ORDER BY s.name
  `

  const rows: AgingRow[] = []
  const totals: AgingBucket = { current: 0, days31_60: 0, days61_90: 0, over90: 0, total: 0 }

  for (const row of rawResult) {
    const totalDebt = Number(row.currentDebt ?? 0)
    if (totalDebt <= 0) continue

    // Parse the JSON POs
    let pos: Array<{ createdAt: Date; grandTotal: unknown }> = []
    try {
      pos = JSON.parse(row.pos_json || '[]')
    } catch {
      pos = []
    }

    const aging = classifyAging(pos, d30, d60, d90, totalDebt)
    rows.push({
      systemId: row.systemId,
      name: row.name,
      phone: row.phone,
      currentDebt: totalDebt,
      aging,
    })

    totals.current += aging.current
    totals.days31_60 += aging.days31_60
    totals.days61_90 += aging.days61_90
    totals.over90 += aging.over90
    totals.total += aging.total
  }

  // Apply pagination
  const total = rows.length
  const paginatedRows = rows.slice(skip, skip + limit)

  return apiPaginated(paginatedRows, { page, limit, total, _totals: totals })
}

/**
 * Classify debt into aging buckets using FIFO approach:
 * Oldest invoices are assumed to be paid first, remaining debt is spread across buckets.
 */
function classifyAging(
  documents: Array<{ createdAt: Date; grandTotal: unknown }>,
  d30: Date, d60: Date, d90: Date,
  totalDebt: number
): AgingBucket {
  const bucket: AgingBucket = { current: 0, days31_60: 0, days61_90: 0, over90: 0, total: totalDebt }

  // Sort oldest first (FIFO: oldest debt remains unpaid)
  const sorted = [...documents].sort((a, b) => {
    const dateA = a.createdAt instanceof Date ? a.createdAt : new Date(a.createdAt)
    const dateB = b.createdAt instanceof Date ? b.createdAt : new Date(b.createdAt)
    return dateA.getTime() - dateB.getTime()
  })

  // Walk through documents oldest-first, allocating remaining debt
  let remaining = totalDebt
  for (const doc of sorted) {
    if (remaining <= 0) break
    const amount = Math.min(Number(doc.grandTotal ?? 0), remaining)
    if (amount <= 0) continue

    const docDate = doc.createdAt instanceof Date ? doc.createdAt : new Date(doc.createdAt)
    if (docDate < d90) {
      bucket.over90 += amount
    } else if (docDate < d60) {
      bucket.days61_90 += amount
    } else if (docDate < d30) {
      bucket.days31_60 += amount
    } else {
      bucket.current += amount
    }
    remaining -= amount
  }

  // If remaining debt can't be attributed to specific docs, put in over90
  if (remaining > 0) {
    bucket.over90 += remaining
  }

  return bucket
}
