/**
 * Global Search API
 *
 * Unified search endpoint: products, customers, orders, employees.
 *
 * Features:
 * - Tokenized search via buildSearchWhere (same as list APIs)
 * - Meilisearch for products + Prisma fallback
 * - Prisma-only for customers / orders / employees
 * - 500ms total timeout budget
 * - Only active/non-deleted records
 */

import { requireAuth } from '@/lib/api-utils'
import { buildSearchWhere } from '@/lib/search/build-search-where'
import { prisma } from '@/lib/prisma'
import { Prisma } from '@/generated/prisma/client'
import { NextResponse } from 'next/server'
import { getMeiliClient, INDEXES, healthCheck } from '@/lib/meilisearch'
import type { MeiliProduct } from '@/lib/meilisearch'
import { prismaProductSearchAsMeiliHits } from '@/lib/search/products-meilisearch-fallback-prisma'

const TOTAL_TIMEOUT_MS = 500

type EntityType = 'products' | 'customers' | 'orders' | 'employees'

interface SearchHit {
  type: EntityType
  id: string
  systemId: string
  name: string
  subtitle?: string
  extra?: Record<string, unknown>
}

type SearchResult = {
  hits: SearchHit[]
  total: number
}

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error('timeout')), ms)
    ),
  ]) as Promise<T>
}

async function searchProducts(q: string, limit: number, offset: number): Promise<SearchResult> {
  const healthy = await healthCheck()

  if (healthy) {
    try {
      const client = getMeiliClient()
      const index = client.index<MeiliProduct>(INDEXES.PRODUCTS)
      const results = await index.search(q, {
        limit,
        offset,
        attributesToRetrieve: ['id', 'productId', 'name', 'barcode', 'price', 'unit', 'status'],
      })
      const hits: SearchHit[] = results.hits.map((h) => ({
        type: 'products' as const,
        id: (h as MeiliProduct).productId || h.id,
        systemId: h.id,
        name: h.name,
        subtitle: h.barcode || undefined,
        extra: { price: h.price, unit: h.unit || 'Cái', status: h.status },
      }))
      return { hits, total: results.estimatedTotalHits ?? hits.length }
    } catch {
      /* fall through to Prisma fallback */
    }
  }

  const fb = await prismaProductSearchAsMeiliHits({ query: q, limit, offset })
  const hits: SearchHit[] = fb.hits.map((h) => ({
    type: 'products' as const,
    id: h.id,
    systemId: h.systemId,
    name: h.name,
    subtitle: h.barcode || undefined,
    extra: { price: h.price, unit: h.unit, status: h.status },
  }))
  return { hits, total: fb.estimatedTotal }
}

async function searchCustomers(q: string, limit: number, offset: number): Promise<SearchResult> {
  const where: Prisma.CustomerWhereInput = { isDeleted: false }
  const sw = buildSearchWhere(q, ['name', 'phone', 'id'])
  if (sw) Object.assign(where, sw)

  const [rows, total] = await Promise.all([
    prisma.customer.findMany({
      where,
      take: limit,
      skip: offset,
      select: { systemId: true, id: true, name: true, phone: true, status: true },
    }),
    prisma.customer.count({ where }),
  ])

  const hits: SearchHit[] = rows.map((c) => ({
    type: 'customers' as const,
    id: c.id,
    systemId: c.systemId,
    name: c.name,
    subtitle: c.phone || undefined,
    extra: { status: c.status },
  }))
  return { hits, total }
}

async function searchOrders(q: string, limit: number, offset: number): Promise<SearchResult> {
  const where: Prisma.OrderWhereInput = {}
  const sw = buildSearchWhere(q, ['id', 'customerName'])
  if (sw) Object.assign(where, sw)

  const [rows, total] = await Promise.all([
    prisma.order.findMany({
      where,
      take: limit,
      skip: offset,
      orderBy: { orderDate: 'desc' },
      select: { systemId: true, id: true, customerName: true, status: true, grandTotal: true },
    }),
    prisma.order.count({ where }),
  ])

  const hits: SearchHit[] = rows.map((o) => ({
    type: 'orders' as const,
    id: o.id || o.systemId,
    systemId: o.systemId,
    name: `Đơn hàng ${o.id || o.systemId}`,
    subtitle: o.customerName || undefined,
    extra: {
      status: o.status,
      grandTotal: Number(o.grandTotal),
    },
  }))
  return { hits, total }
}

async function searchEmployees(q: string, limit: number, offset: number): Promise<SearchResult> {
  const where: Prisma.EmployeeWhereInput = { isDeleted: false }
  const sw = buildSearchWhere(q, ['fullName', 'id', 'workEmail'])
  if (sw) Object.assign(where, sw)

  const [rows, total] = await Promise.all([
    prisma.employee.findMany({
      where,
      take: limit,
      skip: offset,
      select: { systemId: true, id: true, fullName: true, workEmail: true, employmentStatus: true },
    }),
    prisma.employee.count({ where }),
  ])

  const hits: SearchHit[] = rows.map((e) => ({
    type: 'employees' as const,
    id: e.id,
    systemId: e.systemId,
    name: e.fullName,
    subtitle: e.workEmail || undefined,
    extra: { status: e.employmentStatus },
  }))
  return { hits, total }
}

export async function GET(request: Request) {
  const session = await requireAuth()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const q = searchParams.get('q')?.trim() || ''
  const rawType = searchParams.get('type')
  const limit = Math.min(parseInt(searchParams.get('limit') || '20', 10), 100)
  const offset = parseInt(searchParams.get('offset') || '0', 10)

  if (!q) {
    return NextResponse.json({ data: [], meta: { total: 0, limit, offset, query: '', searchTimeMs: 0 } })
  }

  const startTime = Date.now()

  const VALID_TYPES: readonly EntityType[] = ['products', 'customers', 'orders', 'employees']

  const entities: EntityType[] =
    !rawType || rawType === 'all' || !VALID_TYPES.includes(rawType as EntityType)
      ? ['products', 'customers', 'orders', 'employees']
      : [rawType as EntityType]

  const perEntityTimeout = Math.floor(TOTAL_TIMEOUT_MS / entities.length)

  const allHits: SearchHit[] = []
  const breakdown: Record<string, { count: number }> = {}
  let totalHits = 0

  const promises = entities.map(async (entity) => {
    try {
      let result: SearchResult
      if (entity === 'products') {
        result = await withTimeout(searchProducts(q, limit, offset), perEntityTimeout)
      } else if (entity === 'customers') {
        result = await withTimeout(searchCustomers(q, limit, offset), perEntityTimeout)
      } else if (entity === 'orders') {
        result = await withTimeout(searchOrders(q, limit, offset), perEntityTimeout)
      } else {
        result = await withTimeout(searchEmployees(q, limit, offset), perEntityTimeout)
      }
      allHits.push(...result.hits)
      breakdown[entity] = { count: result.total }
      totalHits += result.total
    } catch {
      breakdown[entity] = { count: 0 }
    }
  })

  await Promise.all(promises)

  return NextResponse.json({
    data: allHits,
    meta: {
      total: totalHits,
      limit,
      offset,
      query: q,
      searchTimeMs: Date.now() - startTime,
      breakdown,
    },
  })
}
