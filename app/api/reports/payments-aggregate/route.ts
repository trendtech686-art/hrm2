/**
 * GET /api/reports/payments-aggregate
 *
 * Báo cáo thanh toán (theo thời gian / phương thức / chi nhánh) — tổng hợp SQL, không fetch toàn bộ payments.
 */

import { eachDayOfInterval, endOfDay, format, parseISO, startOfDay } from 'date-fns'
import { prisma } from '@/lib/prisma'
import { apiHandler } from '@/lib/api-handler'
import { apiError, apiSuccess } from '@/lib/api-utils'
import { logError } from '@/lib/logger'
import {
  generateTimePeriods,
  getTimeKey,
} from '@/features/reports/business-activity/lib/time-buckets'
import type {
  PaymentBranchReportRow,
  PaymentMethodReportRow,
  PaymentTimeReportRow,
  ReportDateRange,
  TimeGrouping,
} from '@/features/reports/business-activity/types'
import type { SystemId } from '@/lib/id-types'

export const dynamic = 'force-dynamic'

const MAX_RANGE_DAYS = 3 * 365

type View = 'time-series' | 'method' | 'branch'

function num(v: unknown): number {
  if (v == null) return 0
  if (typeof v === 'bigint') return Number(v)
  if (typeof v === 'number') return Number.isFinite(v) ? v : 0
  const n = Number(v)
  return Number.isFinite(n) ? n : 0
}

function buildPaymentTimeRows(
  dateRange: ReportDateRange,
  timeGrouping: TimeGrouping,
  daily: Map<string, { count: number; amount: number }>,
): { data: PaymentTimeReportRow[]; summary: { transactionCount: number; totalAmount: number; averageAmount: number } } {
  const start = parseISO(dateRange.from)
  const end = parseISO(dateRange.to)
  const periods = generateTimePeriods(dateRange, timeGrouping)

  const rowMap = new Map<string, PaymentTimeReportRow>()
  for (const p of periods) {
    rowMap.set(p.key, {
      key: p.key,
      label: p.label,
      transactionCount: 0,
      totalAmount: 0,
      completedCount: 0,
      completedAmount: 0,
      pendingCount: 0,
      pendingAmount: 0,
      failedCount: 0,
      failedAmount: 0,
    })
  }

  for (const day of eachDayOfInterval({ start, end })) {
    const dayKey = format(day, 'yyyy-MM-dd')
    const d = daily.get(dayKey) ?? { count: 0, amount: 0 }
    const { key } = getTimeKey(day, timeGrouping)
    const row = rowMap.get(key)
    if (!row) continue
    row.transactionCount += d.count
    row.totalAmount += d.amount
    row.completedCount += d.count
    row.completedAmount += d.amount
  }

  const data = periods.map((p) => ({ ...rowMap.get(p.key)! }))

  const transactionCount = data.reduce((s, r) => s + r.transactionCount, 0)
  const totalAmount = data.reduce((s, r) => s + r.totalAmount, 0)
  const summary = {
    transactionCount,
    totalAmount,
    averageAmount: transactionCount > 0 ? totalAmount / transactionCount : 0,
  }

  return { data, summary }
}

export const GET = apiHandler(async (request) => {
  const { searchParams } = new URL(request.url)
  const startDate = searchParams.get('startDate')
  const endDate = searchParams.get('endDate')
  const view = (searchParams.get('view') || 'time-series') as View
  const grouping = (searchParams.get('grouping') || 'day') as TimeGrouping

  if (!startDate || !endDate) {
    return apiError('Thiếu startDate hoặc endDate (yyyy-MM-dd)', 400)
  }

  const validViews: View[] = ['time-series', 'method', 'branch']
  if (!validViews.includes(view)) {
    return apiError('view không hợp lệ', 400)
  }

  const validGrouping: TimeGrouping[] = ['day', 'week', 'month', 'quarter', 'year']
  if (view === 'time-series' && !validGrouping.includes(grouping)) {
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

  const dateRange: ReportDateRange = {
    from: format(start, 'yyyy-MM-dd'),
    to: format(end, 'yyyy-MM-dd'),
  }

  try {
    if (view === 'time-series') {
      const dailyRows = await prisma.$queryRaw<
        Array<{ d: Date; cnt: bigint; total_amount: unknown }>
      >`
        SELECT
          CAST(p."paymentDate" AS DATE) AS d,
          COUNT(*)::bigint AS cnt,
          COALESCE(SUM(p.amount), 0) AS total_amount
        FROM payments p
        WHERE p.status = 'completed'
          AND p."paymentDate" >= ${start}
          AND p."paymentDate" <= ${end}
        GROUP BY 1
        ORDER BY 1
      `

      const daily = new Map<string, { count: number; amount: number }>()
      for (const r of dailyRows) {
        daily.set(format(new Date(r.d), 'yyyy-MM-dd'), {
          count: num(r.cnt),
          amount: num(r.total_amount),
        })
      }

      const payload = buildPaymentTimeRows(dateRange, grouping, daily)
      return apiSuccess(payload)
    }

    if (view === 'method') {
      const rows = await prisma.$queryRaw<
        Array<{
          method_id: string
          method_name: string
          cnt: bigint
          total_amount: unknown
        }>
      >`
        SELECT
          COALESCE(p."paymentMethodSystemId", 'unknown') AS method_id,
          COALESCE(p."paymentMethodName", 'Không xác định') AS method_name,
          COUNT(*)::bigint AS cnt,
          COALESCE(SUM(p.amount), 0) AS total_amount
        FROM payments p
        WHERE p.status = 'completed'
          AND p."paymentDate" >= ${start}
          AND p."paymentDate" <= ${end}
        GROUP BY p."paymentMethodSystemId", p."paymentMethodName"
        ORDER BY total_amount DESC
      `

      const totalAmount = rows.reduce((s, r) => s + num(r.total_amount), 0)
      const data: PaymentMethodReportRow[] = rows.map((r) => ({
        methodId: r.method_id,
        methodName: r.method_name,
        transactionCount: num(r.cnt),
        totalAmount: num(r.total_amount),
        percentage: totalAmount > 0 ? (num(r.total_amount) / totalAmount) * 100 : 0,
      }))

      const summary = {
        transactionCount: data.reduce((s, r) => s + r.transactionCount, 0),
        totalAmount,
        averageAmount:
          data.reduce((s, r) => s + r.transactionCount, 0) > 0
            ? totalAmount / data.reduce((s, r) => s + r.transactionCount, 0)
            : 0,
      }

      return apiSuccess({ data, summary })
    }

    // branch
    const rows = await prisma.$queryRaw<
      Array<{
        branch_id: string
        branch_name: string
        cnt: bigint
        total_amount: unknown
        cash_amount: unknown
        card_amount: unknown
        bank_amount: unknown
        other_amount: unknown
      }>
    >`
      SELECT
        COALESCE(NULLIF(TRIM(p."branchSystemId"), ''), COALESCE(p."branchId", 'unknown')) AS branch_id,
        MAX(COALESCE(p."branchName", 'Không xác định')) AS branch_name,
        COUNT(*)::bigint AS cnt,
        COALESCE(SUM(p.amount), 0) AS total_amount,
        COALESCE(SUM(
          CASE
            WHEN LOWER(COALESCE(p."paymentMethodName", '')) LIKE '%tiền mặt%'
              OR LOWER(COALESCE(p."paymentMethodName", '')) LIKE '%cash%' THEN p.amount
            ELSE 0
          END
        ), 0) AS cash_amount,
        COALESCE(SUM(
          CASE
            WHEN LOWER(COALESCE(p."paymentMethodName", '')) LIKE '%thẻ%'
              OR LOWER(COALESCE(p."paymentMethodName", '')) LIKE '%card%'
              OR LOWER(COALESCE(p."paymentMethodName", '')) LIKE '%visa%'
              OR LOWER(COALESCE(p."paymentMethodName", '')) LIKE '%mastercard%' THEN p.amount
            ELSE 0
          END
        ), 0) AS card_amount,
        COALESCE(SUM(
          CASE
            WHEN LOWER(COALESCE(p."paymentMethodName", '')) LIKE '%chuyển khoản%'
              OR LOWER(COALESCE(p."paymentMethodName", '')) LIKE '%bank%'
              OR LOWER(COALESCE(p."paymentMethodName", '')) LIKE '%ngân hàng%' THEN p.amount
            ELSE 0
          END
        ), 0) AS bank_amount,
        COALESCE(SUM(
          CASE
            WHEN (
              LOWER(COALESCE(p."paymentMethodName", '')) LIKE '%tiền mặt%'
              OR LOWER(COALESCE(p."paymentMethodName", '')) LIKE '%cash%'
              OR LOWER(COALESCE(p."paymentMethodName", '')) LIKE '%thẻ%'
              OR LOWER(COALESCE(p."paymentMethodName", '')) LIKE '%card%'
              OR LOWER(COALESCE(p."paymentMethodName", '')) LIKE '%visa%'
              OR LOWER(COALESCE(p."paymentMethodName", '')) LIKE '%mastercard%'
              OR LOWER(COALESCE(p."paymentMethodName", '')) LIKE '%chuyển khoản%'
              OR LOWER(COALESCE(p."paymentMethodName", '')) LIKE '%bank%'
              OR LOWER(COALESCE(p."paymentMethodName", '')) LIKE '%ngân hàng%'
            ) THEN 0
            ELSE p.amount
          END
        ), 0) AS other_amount
      FROM payments p
      WHERE p.status = 'completed'
        AND p."paymentDate" >= ${start}
        AND p."paymentDate" <= ${end}
      GROUP BY COALESCE(NULLIF(TRIM(p."branchSystemId"), ''), COALESCE(p."branchId", 'unknown'))
      ORDER BY total_amount DESC
    `

    const data: PaymentBranchReportRow[] = rows.map((r) => ({
      branchSystemId: r.branch_id as SystemId,
      branchName: r.branch_name,
      transactionCount: num(r.cnt),
      totalAmount: num(r.total_amount),
      cashAmount: num(r.cash_amount),
      cardAmount: num(r.card_amount),
      bankTransferAmount: num(r.bank_amount),
      otherAmount: num(r.other_amount),
    }))

    const summary = {
      transactionCount: data.reduce((s, r) => s + r.transactionCount, 0),
      totalAmount: data.reduce((s, r) => s + r.totalAmount, 0),
      averageAmount: 0,
    }
    summary.averageAmount =
      summary.transactionCount > 0 ? summary.totalAmount / summary.transactionCount : 0

    return apiSuccess({ data, summary })
  } catch (e) {
    logError('[reports/payments-aggregate]', e)
    return apiError('Không thể tạo báo cáo thanh toán', 500)
  }
}, { auth: true })
