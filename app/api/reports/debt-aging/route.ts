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
import { requireAuth, apiSuccess, apiError } from '@/lib/api-utils'
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

export async function GET(request: Request) {
  const session = await requireAuth()
  if (!session) return apiError('Unauthorized', 401)

  const { searchParams } = new URL(request.url)
  const type = searchParams.get('type') || 'customer'

  try {
    const now = new Date()
    const d30 = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
    const d60 = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000)
    const d90 = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000)

    if (type === 'supplier') {
      return await supplierDebtAging(d30, d60, d90)
    }
    return await customerDebtAging(d30, d60, d90)
  } catch (error) {
    logError('Error generating debt aging report', error)
    return apiError('Failed to generate debt aging report', 500)
  }
}

async function customerDebtAging(d30: Date, d60: Date, d90: Date) {
  const customers = await prisma.customer.findMany({
    where: { isDeleted: false, currentDebt: { gt: 0 } },
    select: { systemId: true, name: true, phone: true, currentDebt: true },
  })

  const rows: AgingRow[] = []
  const totals: AgingBucket = { current: 0, days31_60: 0, days61_90: 0, over90: 0, total: 0 }

  for (const c of customers) {
    const debt = Number(c.currentDebt ?? 0)
    if (debt <= 0) continue

    // Get unpaid orders to determine aging
    const orders = await prisma.order.findMany({
      where: {
        customerId: c.systemId,
        status: { not: 'CANCELLED' },
        OR: [
          { status: 'COMPLETED' },
          { deliveryStatus: 'DELIVERED' },
          { stockOutStatus: 'FULLY_STOCKED_OUT' },
        ],
      },
      select: { createdAt: true, grandTotal: true },
      orderBy: { createdAt: 'asc' },
    })

    const aging = classifyAging(orders, d30, d60, d90, debt)
    rows.push({
      systemId: c.systemId,
      name: c.name,
      phone: c.phone,
      currentDebt: debt,
      aging,
    })

    totals.current += aging.current
    totals.days31_60 += aging.days31_60
    totals.days61_90 += aging.days61_90
    totals.over90 += aging.over90
    totals.total += aging.total
  }

  return apiSuccess({ type: 'customer', rows, totals })
}

async function supplierDebtAging(d30: Date, d60: Date, d90: Date) {
  const suppliers = await prisma.supplier.findMany({
    where: { isDeleted: false, currentDebt: { gt: 0 } },
    select: { systemId: true, name: true, phone: true, currentDebt: true },
  })

  const rows: AgingRow[] = []
  const totals: AgingBucket = { current: 0, days31_60: 0, days61_90: 0, over90: 0, total: 0 }

  for (const s of suppliers) {
    const debt = Number(s.currentDebt ?? 0)
    if (debt <= 0) continue

    // Get received POs to determine aging
    const pos = await prisma.purchaseOrder.findMany({
      where: {
        OR: [
          { supplierSystemId: s.systemId },
          { supplierId: s.systemId },
        ],
        isDeleted: false,
        status: { not: 'CANCELLED' },
        deliveryStatus: 'Đã nhập',
      },
      select: { createdAt: true, subtotal: true, discount: true },
      orderBy: { createdAt: 'asc' },
    })

    const aging = classifyAging(
      pos.map(p => ({ createdAt: p.createdAt, grandTotal: Number(p.subtotal ?? 0) - Number(p.discount ?? 0) })),
      d30, d60, d90, debt
    )
    rows.push({
      systemId: s.systemId,
      name: s.name,
      phone: s.phone,
      currentDebt: debt,
      aging,
    })

    totals.current += aging.current
    totals.days31_60 += aging.days31_60
    totals.days61_90 += aging.days61_90
    totals.over90 += aging.over90
    totals.total += aging.total
  }

  return apiSuccess({ type: 'supplier', rows, totals })
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
  const sorted = [...documents].sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime())

  // Walk through documents oldest-first, allocating remaining debt
  let remaining = totalDebt
  for (const doc of sorted) {
    if (remaining <= 0) break
    const amount = Math.min(Number(doc.grandTotal ?? 0), remaining)
    if (amount <= 0) continue

    if (doc.createdAt < d90) {
      bucket.over90 += amount
    } else if (doc.createdAt < d60) {
      bucket.days61_90 += amount
    } else if (doc.createdAt < d30) {
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
