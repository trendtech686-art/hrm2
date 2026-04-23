/**
 * GET /api/reports/overview
 *
 * Tổng quan báo cáo (/reports): KPI tháng, 14 ngày doanh thu, thanh toán, tồn kho — không fetch toàn bộ products.
 */

import {
  eachDayOfInterval,
  endOfDay,
  endOfMonth,
  format,
  startOfDay,
  startOfMonth,
  subDays,
  subMonths,
} from 'date-fns'
import { prisma } from '@/lib/prisma'
import { apiHandler } from '@/lib/api-handler'
import { apiError, apiSuccess } from '@/lib/api-utils'
import { logError } from '@/lib/logger'
import { getTimeKey } from '@/features/reports/business-activity/lib/time-buckets'
import type { SalesReportSummary } from '@/features/reports/business-activity/types'

export const dynamic = 'force-dynamic'

function num(v: unknown): number {
  if (v == null) return 0
  if (typeof v === 'bigint') return Number(v)
  if (typeof v === 'number') return Number.isFinite(v) ? v : 0
  const n = Number(v)
  return Number.isFinite(n) ? n : 0
}

function buildSummary(
  orderCount: number,
  productAmount: number,
  taxAmount: number,
  shippingFee: number,
  returnAmount: number,
  cogs: number,
  /** Tổng grandTotal đơn trong kỳ — doanh thu = grandTotalSum − hoàn tiền */
  orderGrandTotalSum: number,
): SalesReportSummary {
  const revenue = orderGrandTotalSum - returnAmount
  const grossProfit = revenue - cogs
  return {
    orderCount,
    productAmount,
    returnAmount,
    taxAmount,
    shippingFee,
    revenue,
    grossProfit,
  }
}

async function salesSummaryForRange(
  start: Date,
  end: Date,
): Promise<SalesReportSummary> {
  const [orderAgg, retAgg, cogsAgg] = await Promise.all([
    prisma.$queryRaw<
      Array<{
        order_count: bigint
        product_amount: unknown
        grand_total_sum: unknown
        tax_amount: unknown
        shipping_fee: unknown
      }>
    >`
      SELECT
        COUNT(*)::bigint AS order_count,
        COALESCE(SUM(o.subtotal), 0) AS product_amount,
        COALESCE(SUM(o."grandTotal"), 0) AS grand_total_sum,
        COALESCE(SUM(o.tax), 0) AS tax_amount,
        COALESCE(SUM(o."shippingFee"), 0) AS shipping_fee
      FROM orders o
      WHERE o.status = 'COMPLETED'
        AND COALESCE(o."completedDate", o."orderDate") >= ${start}
        AND COALESCE(o."completedDate", o."orderDate") <= ${end}
    `,
    prisma.$queryRaw<Array<{ refund_sum: unknown }>>`
      SELECT COALESCE(
        SUM(COALESCE(sr."refundAmount", sr."finalAmount", 0)),
        0
      ) AS refund_sum
      FROM sales_returns sr
      INNER JOIN orders o ON o."systemId" = sr."orderId"
      WHERE sr."returnDate" >= ${start}
        AND sr."returnDate" <= ${end}
        AND o.status = 'COMPLETED'
    `,
    prisma.$queryRaw<Array<{ cogs: unknown }>>`
      SELECT COALESCE(
        SUM(oli.quantity * COALESCE(p."costPrice", 0)),
        0
      ) AS cogs
      FROM order_line_items oli
      INNER JOIN orders o ON o."systemId" = oli."orderId"
      LEFT JOIN products p ON p."systemId" = oli."productId"
      WHERE o.status = 'COMPLETED'
        AND COALESCE(o."completedDate", o."orderDate") >= ${start}
        AND COALESCE(o."completedDate", o."orderDate") <= ${end}
    `,
  ])

  const o = orderAgg[0]
  return buildSummary(
    num(o?.order_count),
    num(o?.product_amount),
    num(o?.tax_amount),
    num(o?.shipping_fee),
    num(retAgg[0]?.refund_sum),
    num(cogsAgg[0]?.cogs),
    num(o?.grand_total_sum),
  )
}

async function salesLast14DaysSeries(): Promise<
  { label: string; value: number }[]
> {
  const end = endOfDay(new Date())
  const start = startOfDay(subDays(end, 13))

  const [orderRows, returnRows] = await Promise.all([
    prisma.$queryRaw<
      Array<{
        d: Date
        order_count: bigint
        product_amount: unknown
        grand_total_sum: unknown
        tax_amount: unknown
        shipping_fee: unknown
      }>
    >`
      SELECT
        CAST(COALESCE(o."completedDate", o."orderDate") AS DATE) AS d,
        COUNT(*)::bigint AS order_count,
        COALESCE(SUM(o.subtotal), 0) AS product_amount,
        COALESCE(SUM(o."grandTotal"), 0) AS grand_total_sum,
        COALESCE(SUM(o.tax), 0) AS tax_amount,
        COALESCE(SUM(o."shippingFee"), 0) AS shipping_fee
      FROM orders o
      WHERE o.status = 'COMPLETED'
        AND COALESCE(o."completedDate", o."orderDate") >= ${start}
        AND COALESCE(o."completedDate", o."orderDate") <= ${end}
      GROUP BY 1
      ORDER BY 1
    `,
    prisma.$queryRaw<Array<{ d: Date; refund_sum: unknown }>>`
      SELECT
        CAST(sr."returnDate" AS DATE) AS d,
        COALESCE(SUM(COALESCE(sr."refundAmount", sr."finalAmount", 0)), 0) AS refund_sum
      FROM sales_returns sr
      INNER JOIN orders o ON o."systemId" = sr."orderId"
      WHERE sr."returnDate" >= ${start}
        AND sr."returnDate" <= ${end}
        AND o.status = 'COMPLETED'
      GROUP BY 1
      ORDER BY 1
    `,
  ])

  const dailyOrders = new Map<
    string,
    {
      orderCount: number
      productAmount: number
      grandTotalSum: number
      taxAmount: number
      shippingFee: number
    }
  >()
  for (const r of orderRows) {
    const key = format(new Date(r.d), 'yyyy-MM-dd')
    dailyOrders.set(key, {
      orderCount: num(r.order_count),
      productAmount: num(r.product_amount),
      grandTotalSum: num(r.grand_total_sum),
      taxAmount: num(r.tax_amount),
      shippingFee: num(r.shipping_fee),
    })
  }
  const dailyReturns = new Map<string, number>()
  for (const r of returnRows) {
    dailyReturns.set(format(new Date(r.d), 'yyyy-MM-dd'), num(r.refund_sum))
  }

  const out: { label: string; value: number }[] = []
  for (const day of eachDayOfInterval({ start, end })) {
    const dayKey = format(day, 'yyyy-MM-dd')
    const o = dailyOrders.get(dayKey) ?? {
      orderCount: 0,
      productAmount: 0,
      grandTotalSum: 0,
      taxAmount: 0,
      shippingFee: 0,
    }
    const ret = dailyReturns.get(dayKey) ?? 0
    const { label } = getTimeKey(day, 'day')
    const revenue = o.grandTotalSum - ret
    out.push({ label, value: revenue })
  }

  return out
}

async function paymentSummaryForRange(
  start: Date,
  end: Date,
): Promise<{ totalAmount: number; transactionCount: number }> {
  const rows = await prisma.$queryRaw<Array<{ cnt: bigint; amt: unknown }>>`
    SELECT
      COUNT(*)::bigint AS cnt,
      COALESCE(SUM(p.amount), 0) AS amt
    FROM payments p
    WHERE p.status = 'completed'
      AND p."paymentDate" >= ${start}
      AND p."paymentDate" <= ${end}
  `
  const r = rows[0]
  return {
    transactionCount: num(r?.cnt),
    totalAmount: num(r?.amt),
  }
}

async function inventorySnapshot(): Promise<{
  outOfStockCount: number
  lowStockCount: number
  alertItems: Array<{
    productSystemId: string
    productName: string
    productCode: string | null
    available: number
    stockStatus: 'out_of_stock' | 'low_stock'
  }>
}> {
  const counts = await prisma.$queryRaw<
    Array<{ out_of_stock_count: bigint; low_stock_count: bigint }>
  >`
    WITH agg AS (
      SELECT
        pi."productId",
        SUM(pi."onHand")::bigint AS on_hand,
        SUM(pi.committed)::bigint AS committed
      FROM product_inventory pi
      INNER JOIN products p ON p."systemId" = pi."productId"
      WHERE p."isDeleted" = false AND COALESCE(p."isStockTracked", true) = true
      GROUP BY pi."productId"
    ),
    avail AS (
      SELECT
        a."productId",
        (a.on_hand - a.committed)::int AS available,
        p.name,
        p.id AS "productCode",
        p."reorderLevel"
      FROM agg a
      JOIN products p ON p."systemId" = a."productId"
    )
    SELECT
      (SELECT COUNT(*)::bigint FROM avail WHERE available <= 0) AS out_of_stock_count,
      (SELECT COUNT(*)::bigint FROM avail WHERE available > 0 AND "reorderLevel" IS NOT NULL AND available < "reorderLevel") AS low_stock_count
  `

  const items = await prisma.$queryRaw<
    Array<{
      productSystemId: string
      productName: string
      productCode: string | null
      available: number
      stockStatus: string
    }>
  >`
    WITH agg AS (
      SELECT
        pi."productId",
        SUM(pi."onHand")::bigint AS on_hand,
        SUM(pi.committed)::bigint AS committed
      FROM product_inventory pi
      INNER JOIN products p ON p."systemId" = pi."productId"
      WHERE p."isDeleted" = false AND COALESCE(p."isStockTracked", true) = true
      GROUP BY pi."productId"
    ),
    avail AS (
      SELECT
        a."productId" AS "productSystemId",
        p.name AS "productName",
        p.id AS "productCode",
        (a.on_hand - a.committed)::int AS available,
        p."reorderLevel"
      FROM agg a
      JOIN products p ON p."systemId" = a."productId"
    )
    SELECT
      "productSystemId",
      "productName",
      "productCode",
      available,
      CASE
        WHEN available <= 0 THEN 'out_of_stock'
        ELSE 'low_stock'
      END AS "stockStatus"
    FROM avail
    WHERE available <= 0
      OR ("reorderLevel" IS NOT NULL AND available > 0 AND available < "reorderLevel")
    ORDER BY available ASC
    LIMIT 8
  `

  const c = counts[0]
  return {
    outOfStockCount: num(c?.out_of_stock_count),
    lowStockCount: num(c?.low_stock_count),
    alertItems: items.map((row) => ({
      productSystemId: row.productSystemId,
      productName: row.productName,
      productCode: row.productCode,
      available: row.available,
      stockStatus: row.stockStatus as 'out_of_stock' | 'low_stock',
    })),
  }
}

export const GET = apiHandler(async () => {
  try {
    const now = new Date()
    const curStart = startOfDay(startOfMonth(now))
    const curEnd = endOfDay(endOfMonth(now))
    const prevMonthDate = subMonths(now, 1)
    const prevStart = startOfDay(startOfMonth(prevMonthDate))
    const prevEnd = endOfDay(endOfMonth(prevMonthDate))

    const [
      salesCurrentMonth,
      salesPreviousMonth,
      salesLast14Days,
      paymentsCurrentMonth,
      inventory,
    ] = await Promise.all([
      salesSummaryForRange(curStart, curEnd),
      salesSummaryForRange(prevStart, prevEnd),
      salesLast14DaysSeries(),
      paymentSummaryForRange(curStart, curEnd),
      inventorySnapshot(),
    ])

    return apiSuccess({
      sales: {
        currentMonth: salesCurrentMonth,
        previousMonth: salesPreviousMonth,
        last14Days: salesLast14Days,
      },
      payments: {
        currentMonth: paymentsCurrentMonth,
      },
      inventory,
    })
  } catch (e) {
    logError('[reports/overview]', e)
    return apiError('Không tải được tổng quan báo cáo', 500)
  }
})
