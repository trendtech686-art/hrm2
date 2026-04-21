/**
 * GET /api/reports/sales-time-series
 *
 * Tổng hợp báo cáo bán hàng theo thời gian trên PostgreSQL — không stream toàn bộ orders về client.
 * Phù hợp dataset lớn (phân nhóm bucket theo ngày rồi gộp tuần/tháng/... trên server).
 */

import { Prisma } from '@/generated/prisma/client'
import { eachDayOfInterval, format, parseISO } from 'date-fns'
import { endOfDay, startOfDay } from 'date-fns'
import { prisma } from '@/lib/prisma'
import { apiHandler } from '@/lib/api-handler'
import { apiError, apiSuccess } from '@/lib/api-utils'
import { logError } from '@/lib/logger'
import {
  generateTimePeriods,
  getTimeKey,
} from '@/features/reports/business-activity/lib/time-buckets'
import type {
  ReportDateRange,
  SalesReportSummary,
  SalesTimeReportRow,
  TimeGrouping,
} from '@/features/reports/business-activity/types'

export const dynamic = 'force-dynamic'

const MAX_RANGE_DAYS = 3 * 365

function parseList(param: string | null): string[] {
  if (!param?.trim()) return []
  return param
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)
}

function num(v: unknown): number {
  if (v == null) return 0
  if (typeof v === 'bigint') return Number(v)
  if (typeof v === 'number') return Number.isFinite(v) ? v : 0
  const n = Number(v)
  return Number.isFinite(n) ? n : 0
}

function buildRowsFromDaily(
  dateRange: ReportDateRange,
  timeGrouping: TimeGrouping,
  dailyOrders: Map<
    string,
    {
      orderCount: number
      productAmount: number
      taxAmount: number
      shippingFee: number
    }
  >,
  dailyCogs: Map<string, number>,
  dailyReturns: Map<string, number>,
): { data: SalesTimeReportRow[]; summary: SalesReportSummary } {
  const start = parseISO(dateRange.from)
  const end = parseISO(dateRange.to)
  const periods = generateTimePeriods(dateRange, timeGrouping)

  const rowMap = new Map<string, SalesTimeReportRow>()
  for (const p of periods) {
    rowMap.set(p.key, {
      key: p.key,
      label: p.label,
      orderCount: 0,
      productAmount: 0,
      returnAmount: 0,
      taxAmount: 0,
      shippingFee: 0,
      revenue: 0,
      grossProfit: 0,
      costOfGoods: 0,
    })
  }

  for (const day of eachDayOfInterval({ start, end })) {
    const dayKey = format(day, 'yyyy-MM-dd')
    const o = dailyOrders.get(dayKey) ?? {
      orderCount: 0,
      productAmount: 0,
      taxAmount: 0,
      shippingFee: 0,
    }
    const cogs = dailyCogs.get(dayKey) ?? 0
    const ret = dailyReturns.get(dayKey) ?? 0
    const { key } = getTimeKey(day, timeGrouping)
    const row = rowMap.get(key)
    if (!row) continue

    row.orderCount += o.orderCount
    row.productAmount += o.productAmount
    row.taxAmount += o.taxAmount
    row.shippingFee += o.shippingFee
    row.returnAmount += ret
    row.costOfGoods = (row.costOfGoods ?? 0) + cogs
  }

  const data: SalesTimeReportRow[] = periods.map((p) => {
    const row = rowMap.get(p.key)!
    row.revenue = row.productAmount - row.returnAmount
    row.grossProfit = row.revenue - (row.costOfGoods ?? 0)
    return { ...row }
  })

  const summary: SalesReportSummary = {
    orderCount: data.reduce((s, r) => s + r.orderCount, 0),
    productAmount: data.reduce((s, r) => s + r.productAmount, 0),
    returnAmount: data.reduce((s, r) => s + r.returnAmount, 0),
    taxAmount: data.reduce((s, r) => s + r.taxAmount, 0),
    shippingFee: data.reduce((s, r) => s + r.shippingFee, 0),
    revenue: data.reduce((s, r) => s + r.revenue, 0),
    grossProfit: data.reduce((s, r) => s + r.grossProfit, 0),
  }

  return { data, summary }
}

export const GET = apiHandler(async (request) => {
  const { searchParams } = new URL(request.url)
  const startDate = searchParams.get('startDate')
  const endDate = searchParams.get('endDate')
  const grouping = (searchParams.get('grouping') || 'day') as TimeGrouping

  if (!startDate || !endDate) {
    return apiError('Thiếu startDate hoặc endDate (yyyy-MM-dd)', 400)
  }

  const validGrouping: TimeGrouping[] = [
    'day',
    'week',
    'month',
    'quarter',
    'year',
  ]
  if (!validGrouping.includes(grouping)) {
    return apiError('grouping không hợp lệ', 400)
  }

  const start = startOfDay(parseISO(startDate))
  const end = endOfDay(parseISO(endDate))
  if (start > end) {
    return apiError('startDate phải trước endDate', 400)
  }

  const rangeDays = Math.ceil((end.getTime() - start.getTime()) / (24 * 60 * 60 * 1000))
  if (rangeDays > MAX_RANGE_DAYS) {
    return apiError(`Khoảng thời gian tối đa ${MAX_RANGE_DAYS} ngày`, 400)
  }

  const branchIds = parseList(searchParams.get('branchIds'))
  const employeeIds = parseList(searchParams.get('employeeIds'))
  const sourceIds = parseList(searchParams.get('sourceIds'))

  const branchFilter = branchIds.length
    ? Prisma.sql`AND o."branchId" IN (${Prisma.join(branchIds)})`
    : Prisma.empty
  const employeeFilter = employeeIds.length
    ? Prisma.sql`AND o."salespersonId" IN (${Prisma.join(employeeIds)})`
    : Prisma.empty
  const sourceFilter = sourceIds.length
    ? Prisma.sql`AND o."source" IN (${Prisma.join(sourceIds)})`
    : Prisma.empty

  const dateRange: ReportDateRange = {
    from: format(start, 'yyyy-MM-dd'),
    to: format(end, 'yyyy-MM-dd'),
  }

  try {
    const [orderRows, cogsRows, returnRows] = await Promise.all([
      prisma.$queryRaw<
        Array<{
          d: Date
          order_count: bigint
          product_amount: unknown
          tax_amount: unknown
          shipping_fee: unknown
        }>
      >`
        SELECT
          CAST(o."orderDate" AS DATE) AS d,
          COUNT(*)::bigint AS order_count,
          COALESCE(SUM(o.subtotal), 0) AS product_amount,
          COALESCE(SUM(o.tax), 0) AS tax_amount,
          COALESCE(SUM(o."shippingFee"), 0) AS shipping_fee
        FROM orders o
        WHERE o.status = 'COMPLETED'
          AND o."orderDate" >= ${start}
          AND o."orderDate" <= ${end}
          ${branchFilter}
          ${employeeFilter}
          ${sourceFilter}
        GROUP BY 1
        ORDER BY 1
      `,

      prisma.$queryRaw<Array<{ d: Date; cogs: unknown }>>`
        SELECT
          CAST(o."orderDate" AS DATE) AS d,
          COALESCE(SUM(oli.quantity * COALESCE(p."costPrice", 0)), 0) AS cogs
        FROM order_line_items oli
        INNER JOIN orders o ON o."systemId" = oli."orderId"
        LEFT JOIN products p ON p."systemId" = oli."productId"
        WHERE o.status = 'COMPLETED'
          AND o."orderDate" >= ${start}
          AND o."orderDate" <= ${end}
          ${branchFilter}
          ${employeeFilter}
          ${sourceFilter}
        GROUP BY 1
        ORDER BY 1
      `,

      prisma.$queryRaw<Array<{ d: Date; refund_sum: unknown }>>`
        SELECT
          CAST(sr."returnDate" AS DATE) AS d,
          COALESCE(
            SUM(COALESCE(sr."refundAmount", sr."finalAmount", 0)),
            0
          ) AS refund_sum
        FROM sales_returns sr
        INNER JOIN orders o ON o."systemId" = sr."orderId"
        WHERE sr."returnDate" >= ${start}
          AND sr."returnDate" <= ${end}
          AND o.status = 'COMPLETED'
          ${branchFilter}
          ${employeeFilter}
          ${sourceFilter}
        GROUP BY 1
        ORDER BY 1
      `,
    ])

    const dailyOrders = new Map<
      string,
      {
        orderCount: number
        productAmount: number
        taxAmount: number
        shippingFee: number
      }
    >()

    for (const r of orderRows) {
      const key = format(new Date(r.d), 'yyyy-MM-dd')
      dailyOrders.set(key, {
        orderCount: num(r.order_count),
        productAmount: num(r.product_amount),
        taxAmount: num(r.tax_amount),
        shippingFee: num(r.shipping_fee),
      })
    }

    const dailyCogs = new Map<string, number>()
    for (const r of cogsRows) {
      dailyCogs.set(format(new Date(r.d), 'yyyy-MM-dd'), num(r.cogs))
    }

    const dailyReturns = new Map<string, number>()
    for (const r of returnRows) {
      dailyReturns.set(format(new Date(r.d), 'yyyy-MM-dd'), num(r.refund_sum))
    }

    const payload = buildRowsFromDaily(
      dateRange,
      grouping,
      dailyOrders,
      dailyCogs,
      dailyReturns,
    )

    return apiSuccess(payload)
  } catch (e) {
    logError('[reports/sales-time-series]', e)
    return apiError('Không thể tạo báo cáo bán hàng theo thời gian', 500)
  }
})
