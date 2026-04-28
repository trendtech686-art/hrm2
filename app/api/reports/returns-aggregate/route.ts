/**
 * GET /api/reports/returns-aggregate
 *
 * Báo cáo trả hàng — tổng hợp SQL / phân trang danh sách.
 */

import { endOfDay, parseISO, startOfDay } from 'date-fns'
import { prisma } from '@/lib/prisma'
import { apiHandler } from '@/lib/api-handler'
import { apiError, apiSuccess, parsePagination } from '@/lib/api-utils'
import { logError, logWarn } from '@/lib/logger'
import type { ReturnOrderReportRow, ReturnProductReportRow } from '@/features/reports/business-activity/types'
import type { SystemId } from '@/lib/id-types'

export const dynamic = 'force-dynamic'

const MAX_RANGE_DAYS = 3 * 365

type View = 'order-list' | 'product'

function num(v: unknown): number {
  if (v == null) return 0
  if (typeof v === 'bigint') return Number(v)
  if (typeof v === 'number') return Number.isFinite(v) ? v : 0
  const n = Number(v)
  return Number.isFinite(n) ? n : 0
}

export const GET = apiHandler(async (request) => {
  const { searchParams } = new URL(request.url)
  const startDate = searchParams.get('startDate')
  const endDate = searchParams.get('endDate')
  const view = (searchParams.get('view') || 'order-list') as View

  if (!startDate || !endDate) {
    return apiError('Thiếu startDate hoặc endDate (yyyy-MM-dd)', 400)
  }

  if (view !== 'order-list' && view !== 'product') {
    return apiError('view không hợp lệ', 400)
  }

  const start = startOfDay(parseISO(startDate))
  const end = endOfDay(parseISO(endDate))
  if (start > end) {
    return apiError('startDate phải trước endDate', 400)
  }

  const rangeDays = Math.ceil((end.getTime() - start.getTime()) / (24 * 60 * 60 * 1000))
  if (rangeDays > MAX_RANGE_DAYS) {
    logWarn('[reports/returns-aggregate] range too large', {
      rangeDays,
      maxDays: MAX_RANGE_DAYS,
      startDate,
      endDate,
    })
    return apiError(`Khoảng thời gian tối đa ${MAX_RANGE_DAYS} ngày`, 400)
  }

  try {
    if (view === 'order-list') {
      const { page, limit, skip } = parsePagination(searchParams)

      const [rows, countRow, sumRow] = await Promise.all([
        prisma.$queryRaw<
          Array<{
            systemId: string
            id: string
            orderId: string
            orderSystemId: string | null
            returnDate: Date
            customerName: string | null
            creatorName: string | null
            branchName: string | null
            totalReturnValue: unknown
            refundAmount: unknown
            finalAmount: unknown
            reason: string | null
            item_count: bigint
          }>
        >`
          SELECT
            sr."systemId",
            sr.id,
            sr."orderId",
            sr."orderSystemId",
            sr."returnDate",
            sr."customerName",
            sr."creatorName",
            sr."branchName",
            sr."totalReturnValue",
            sr."refundAmount",
            sr."finalAmount",
            sr.reason,
            (SELECT COUNT(*)::bigint FROM sales_return_items sri WHERE sri."returnId" = sr."systemId") AS item_count
          FROM sales_returns sr
          WHERE sr."returnDate" >= ${start}
            AND sr."returnDate" <= ${end}
          ORDER BY sr."returnDate" DESC
          LIMIT ${limit} OFFSET ${skip}
        `,
        prisma.$queryRaw<Array<{ c: bigint }>>`
          SELECT COUNT(*)::bigint AS c
          FROM sales_returns sr
          WHERE sr."returnDate" >= ${start}
            AND sr."returnDate" <= ${end}
        `,
        prisma.$queryRaw<
          Array<{
            total_return_amt: unknown
            total_refund_amt: unknown
            line_items: bigint
          }>
        >`
          SELECT
            COALESCE(SUM(sr."totalReturnValue"), 0) AS total_return_amt,
            COALESCE(SUM(COALESCE(sr."refundAmount", sr."finalAmount", 0)), 0) AS total_refund_amt,
            (SELECT COUNT(*)::bigint
             FROM sales_return_items sri
             INNER JOIN sales_returns sr2 ON sr2."systemId" = sri."returnId"
             WHERE sr2."returnDate" >= ${start}
               AND sr2."returnDate" <= ${end}
            ) AS line_items
          FROM sales_returns sr
          WHERE sr."returnDate" >= ${start}
            AND sr."returnDate" <= ${end}
        `,
      ])

      const data: ReturnOrderReportRow[] = rows.map((r) => ({
        returnSystemId: r.systemId as SystemId,
        returnId: r.id,
        orderId: r.orderId,
        orderSystemId: (r.orderSystemId ?? r.orderId) as SystemId,
        returnDate: r.returnDate.toISOString(),
        customerName: r.customerName || undefined,
        employeeName: r.creatorName || undefined,
        branchName: r.branchName || undefined,
        itemCount: num(r.item_count),
        returnAmount: num(r.totalReturnValue),
        refundAmount: num(r.refundAmount) || num(r.finalAmount),
        reason: r.reason || undefined,
      }))

      const total = num(countRow[0]?.c)
      const agg = sumRow[0]
      return apiSuccess({
        data,
        summary: {
          totalReturns: total,
          totalReturnAmount: num(agg?.total_return_amt),
          totalRefundAmount: num(agg?.total_refund_amt),
          totalItems: num(agg?.line_items),
        },
        pagination: { page, limit, total, totalPages: Math.ceil(total / limit) || 1 },
      })
    }

    // product aggregate
    const productRows = await prisma.$queryRaw<
      Array<{
        product_id: string
        product_name: string
        product_code: string | null
        sku: string | null
        return_count: bigint
        quantity_returned: bigint
        return_amount: unknown
      }>
    >`
      SELECT
        COALESCE(sri."productId", 'unknown') AS product_id,
        MAX(sri."productName") AS product_name,
        MAX(sri."productSku") AS product_code,
        MAX(sri."productSku") AS sku,
        COUNT(*)::bigint AS return_count,
        COALESCE(SUM(sri.quantity), 0)::bigint AS quantity_returned,
        COALESCE(SUM(sri.total), 0) AS return_amount
      FROM sales_return_items sri
      INNER JOIN sales_returns sr ON sr."systemId" = sri."returnId"
      WHERE sr."returnDate" >= ${start}
        AND sr."returnDate" <= ${end}
      GROUP BY sri."productId"
      ORDER BY quantity_returned DESC
    `

    const reasonRows = await prisma.$queryRaw<
      Array<{ product_id: string; reason: string; cnt: bigint }>
    >`
      SELECT
        COALESCE(sri."productId", 'unknown') AS product_id,
        COALESCE(sr.reason, '') AS reason,
        COUNT(*)::bigint AS cnt
      FROM sales_return_items sri
      INNER JOIN sales_returns sr ON sr."systemId" = sri."returnId"
      WHERE sr."returnDate" >= ${start}
        AND sr."returnDate" <= ${end}
        AND sr.reason IS NOT NULL
        AND TRIM(sr.reason) <> ''
      GROUP BY sri."productId", sr.reason
    `

    const reasonsByProduct = new Map<string, Array<{ reason: string; cnt: number }>>()
    for (const rr of reasonRows) {
      const pid = rr.product_id
      if (!reasonsByProduct.has(pid)) reasonsByProduct.set(pid, [])
      reasonsByProduct.get(pid)!.push({ reason: rr.reason, cnt: num(rr.cnt) })
    }
    for (const arr of reasonsByProduct.values()) {
      arr.sort((a, b) => b.cnt - a.cnt)
    }

    const data: ReturnProductReportRow[] = productRows.map((r) => {
      const pid = r.product_id
      const top = reasonsByProduct.get(pid)?.slice(0, 3).map((x) => x.reason) ?? []
      return {
        productSystemId: pid as SystemId,
        productName: r.product_name || 'Không xác định',
        productCode: r.product_code ?? undefined,
        sku: r.sku ?? undefined,
        returnCount: num(r.return_count),
        quantityReturned: num(r.quantity_returned),
        returnAmount: num(r.return_amount),
        returnRate: 0,
        topReasons: top,
      }
    })

    const summary = {
      totalProducts: data.length,
      totalQuantityReturned: data.reduce((s, x) => s + x.quantityReturned, 0),
      totalReturnAmount: data.reduce((s, x) => s + x.returnAmount, 0),
    }

    return apiSuccess({ data, summary })
  } catch (e) {
    logError('[reports/returns-aggregate]', e)
    return apiError('Không thể tạo báo cáo trả hàng', 500)
  }
}, { auth: true })
