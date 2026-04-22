/**
 * GET /api/reports/delivery-aggregate
 *
 * Báo cáo giao hàng — tổng hợp SQL (shipments + packagings + orders), không fetch toàn bộ vận đơn.
 */

import { Prisma } from '@/generated/prisma/client'
import { eachDayOfInterval, endOfDay, format, parseISO, startOfDay } from 'date-fns'
import { prisma } from '@/lib/prisma'
import { apiHandler } from '@/lib/api-handler'
import { apiError, apiSuccess, parsePagination } from '@/lib/api-utils'
import { logError, logWarn } from '@/lib/logger'
import {
  generateTimePeriods,
  getTimeKey,
} from '@/features/reports/business-activity/lib/time-buckets'
import type {
  DeliveryBranchReportRow,
  DeliveryCarrierReportRow,
  DeliveryChannelReportRow,
  DeliveryCustomerReportRow,
  DeliveryEmployeeReportRow,
  DeliveryReportSummary,
  DeliveryShipmentReportRow,
  DeliverySourceReportRow,
  DeliveryTimeReportRow,
  ReportDateRange,
  TimeGrouping,
} from '@/features/reports/business-activity/types'
import type { SystemId } from '@/lib/id-types'

export const dynamic = 'force-dynamic'

const MAX_RANGE_DAYS = 3 * 365

type View =
  | 'time-series'
  | 'employee'
  | 'carrier'
  | 'branch'
  | 'customer'
  | 'channel'
  | 'source'
  | 'shipment-list'

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

function buildDeliveryTimeRows(
  dateRange: ReportDateRange,
  timeGrouping: TimeGrouping,
  daily: Map<
    string,
    {
      totalShipments: number
      deliveredCount: number
      pendingCount: number
      failedCount: number
      returnedCount: number
      totalAmount: number
      codAmount: number
      shippingFee: number
      /** Tổng giờ giao (để chia cho deliveredWithHours) */
      avgHoursSum: number
      deliveredWithHours: number
    }
  >,
): { data: DeliveryTimeReportRow[]; summary: Record<string, number> } {
  const start = parseISO(dateRange.from)
  const end = parseISO(dateRange.to)
  const periods = generateTimePeriods(dateRange, timeGrouping)

  const rowMap = new Map<string, DeliveryTimeReportRow>()
  for (const p of periods) {
    rowMap.set(p.key, {
      key: p.key,
      label: p.label,
      totalShipments: 0,
      deliveredCount: 0,
      pendingCount: 0,
      failedCount: 0,
      returnedCount: 0,
      totalAmount: 0,
      codAmount: 0,
      shippingFee: 0,
      deliveryRate: 0,
    })
  }

  const sumHoursByPeriod = new Map<string, number>()
  const weightHoursByPeriod = new Map<string, number>()

  for (const day of eachDayOfInterval({ start, end })) {
    const dayKey = format(day, 'yyyy-MM-dd')
    const d = daily.get(dayKey)
    if (!d) continue
    const { key } = getTimeKey(day, timeGrouping)
    const row = rowMap.get(key)
    if (!row) continue

    row.totalShipments += d.totalShipments
    row.deliveredCount += d.deliveredCount
    row.pendingCount += d.pendingCount
    row.failedCount += d.failedCount
    row.returnedCount += d.returnedCount
    row.totalAmount += d.totalAmount
    row.codAmount += d.codAmount
    row.shippingFee += d.shippingFee

    if (d.deliveredWithHours > 0) {
      sumHoursByPeriod.set(key, (sumHoursByPeriod.get(key) ?? 0) + d.avgHoursSum)
      weightHoursByPeriod.set(key, (weightHoursByPeriod.get(key) ?? 0) + d.deliveredWithHours)
    }
  }

  const data: DeliveryTimeReportRow[] = periods.map((p) => {
    const row = { ...rowMap.get(p.key)! }
    row.deliveryRate =
      row.totalShipments > 0 ? (row.deliveredCount / row.totalShipments) * 100 : 0
    const w = weightHoursByPeriod.get(p.key) ?? 0
    if (w > 0) {
      row.averageDeliveryTime = (sumHoursByPeriod.get(p.key) ?? 0) / w
    }
    return row
  })

  const summary = {
    totalShipments: data.reduce((s, r) => s + r.totalShipments, 0),
    deliveredCount: data.reduce((s, r) => s + r.deliveredCount, 0),
    pendingCount: data.reduce((s, r) => s + r.pendingCount, 0),
    failedCount: data.reduce((s, r) => s + r.failedCount, 0),
    returnedCount: data.reduce((s, r) => s + r.returnedCount, 0),
    totalAmount: data.reduce((s, r) => s + r.totalAmount, 0),
    codAmount: data.reduce((s, r) => s + r.codAmount, 0),
    shippingFee: data.reduce((s, r) => s + r.shippingFee, 0),
    deliveryRate: 0,
  }
  summary.deliveryRate =
    summary.totalShipments > 0 ? (summary.deliveredCount / summary.totalShipments) * 100 : 0

  return { data, summary }
}

/** Điều kiện trạng thái giao (packaging enum + chuỗi UI) */
const DELIVERED_COND = Prisma.sql`COALESCE(pkg."deliveryStatus"::text, s."deliveryStatus", '') IN ('DELIVERED', 'delivered', 'Đã giao hàng')`
const PENDING_COND = Prisma.sql`(
  COALESCE(pkg."deliveryStatus"::text, s."deliveryStatus", '') IN (
    'SHIPPING', 'PENDING_SHIP', 'PACKED', 'PENDING_PACK', 'pending', 'PENDING',
    'Chờ lấy hàng', 'Đang giao hàng', 'Đã tiếp nhận', 'RESCHEDULED'
  )
)`
const FAILED_COND = Prisma.sql`COALESCE(pkg."deliveryStatus"::text, s."deliveryStatus", '') IN ('FAILED', 'failed', 'Giao hàng thất bại', 'CANCELLED')`
const RETURNED_COND = Prisma.sql`COALESCE(pkg."deliveryStatus"::text, s."deliveryStatus", '') IN ('RETURNED', 'returned', 'Đã trả hàng', 'Đã hoàn')`

export const GET = apiHandler(async (request) => {
  const { searchParams } = new URL(request.url)
  const startDate = searchParams.get('startDate')
  const endDate = searchParams.get('endDate')
  const view = (searchParams.get('view') || 'time-series') as View
  const grouping = (searchParams.get('grouping') || 'day') as TimeGrouping

  if (!startDate || !endDate) {
    return apiError('Thiếu startDate hoặc endDate (yyyy-MM-dd)', 400)
  }

  const validViews: View[] = [
    'time-series',
    'employee',
    'carrier',
    'branch',
    'customer',
    'channel',
    'source',
    'shipment-list',
  ]
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
    logWarn('[reports/delivery-aggregate] range too large', {
      rangeDays,
      maxDays: MAX_RANGE_DAYS,
      startDate,
      endDate,
    })
    return apiError(`Khoảng thời gian tối đa ${MAX_RANGE_DAYS} ngày`, 400)
  }

  const branchIds = parseList(searchParams.get('branchIds'))
  const carrierIds = parseList(searchParams.get('carrierIds'))

  const branchFilter =
    branchIds.length > 0
      ? Prisma.sql`AND COALESCE(o."branchId", w."branchSystemId") IN (${Prisma.join(branchIds)})`
      : Prisma.empty

  const carrierFilter =
    carrierIds.length > 0 ? Prisma.sql`AND s.carrier IN (${Prisma.join(carrierIds)})` : Prisma.empty

  const dateRange: ReportDateRange = {
    from: format(start, 'yyyy-MM-dd'),
    to: format(end, 'yyyy-MM-dd'),
  }

  try {
    if (view === 'time-series') {
      const dailyRows = await prisma.$queryRaw<
        Array<{
          d: Date
          total_shipments: bigint
          delivered_count: bigint
          pending_count: bigint
          failed_count: bigint
          returned_count: bigint
          total_amount: unknown
          cod_amount: unknown
          shipping_fee: unknown
          avg_hours: unknown
          delivered_with_hours: bigint
        }>
      >`
        SELECT
          CAST(s."createdAt" AS DATE) AS d,
          COUNT(*)::bigint AS total_shipments,
          SUM(CASE WHEN ${DELIVERED_COND} THEN 1 ELSE 0 END)::bigint AS delivered_count,
          SUM(CASE WHEN ${PENDING_COND} THEN 1 ELSE 0 END)::bigint AS pending_count,
          SUM(CASE WHEN ${FAILED_COND} THEN 1 ELSE 0 END)::bigint AS failed_count,
          SUM(CASE WHEN ${RETURNED_COND} THEN 1 ELSE 0 END)::bigint AS returned_count,
          COALESCE(SUM(COALESCE(pkg."codAmount", s."codAmount", 0) + COALESCE(pkg."shippingFeeToPartner", s."shippingFeeToPartner", s."shippingFee", 0)), 0) AS total_amount,
          COALESCE(SUM(COALESCE(pkg."codAmount", s."codAmount", 0)), 0) AS cod_amount,
          COALESCE(SUM(COALESCE(pkg."shippingFeeToPartner", s."shippingFeeToPartner", s."shippingFee", 0)), 0) AS shipping_fee,
          COALESCE(
            SUM(
              CASE
                WHEN ${DELIVERED_COND} AND s."deliveredAt" IS NOT NULL THEN
                  EXTRACT(EPOCH FROM (s."deliveredAt" - s."createdAt")) / 3600.0
                ELSE NULL
              END
            ),
            0
          ) AS avg_hours,
          SUM(CASE WHEN ${DELIVERED_COND} AND s."deliveredAt" IS NOT NULL THEN 1 ELSE 0 END)::bigint AS delivered_with_hours
        FROM shipments s
        LEFT JOIN packagings pkg ON pkg."systemId" = s."packagingSystemId"
        LEFT JOIN orders o ON o."systemId" = s."orderId"
        LEFT JOIN supplier_warranties w ON w."systemId" = s."warrantyId"
        WHERE s."createdAt" >= ${start}
          AND s."createdAt" <= ${end}
          ${branchFilter}
          ${carrierFilter}
        GROUP BY CAST(s."createdAt" AS DATE)
        ORDER BY 1
      `

      const daily = new Map<
        string,
        {
          totalShipments: number
          deliveredCount: number
          pendingCount: number
          failedCount: number
          returnedCount: number
          totalAmount: number
          codAmount: number
          shippingFee: number
          avgHoursSum: number
          deliveredWithHours: number
        }
      >()

      for (const r of dailyRows) {
        const key = format(new Date(r.d), 'yyyy-MM-dd')
        const dw = num(r.delivered_with_hours)
        daily.set(key, {
          totalShipments: num(r.total_shipments),
          deliveredCount: num(r.delivered_count),
          pendingCount: num(r.pending_count),
          failedCount: num(r.failed_count),
          returnedCount: num(r.returned_count),
          totalAmount: num(r.total_amount),
          codAmount: num(r.cod_amount),
          shippingFee: num(r.shipping_fee),
          avgHoursSum: num(r.avg_hours),
          deliveredWithHours: dw,
        })
      }

      const payload = buildDeliveryTimeRows(dateRange, grouping, daily)
      return apiSuccess(payload)
    }

    if (view === 'employee') {
      const rows = await prisma.$queryRaw<
        Array<{
          emp_key: string
          emp_system_id: string | null
          total_shipments: bigint
          delivered_count: bigint
          failed_count: bigint
          total_cod: unknown
        }>
      >`
        SELECT
          COALESCE(NULLIF(TRIM(COALESCE(pkg."requestingEmployeeName", '')), ''), 'Không xác định') AS emp_key,
          MAX(e."systemId")::text AS emp_system_id,
          COUNT(*)::bigint AS total_shipments,
          SUM(CASE WHEN ${DELIVERED_COND} THEN 1 ELSE 0 END)::bigint AS delivered_count,
          SUM(CASE WHEN ${FAILED_COND} THEN 1 ELSE 0 END)::bigint AS failed_count,
          COALESCE(SUM(COALESCE(pkg."codAmount", s."codAmount", 0)), 0) AS total_cod
        FROM shipments s
        LEFT JOIN packagings pkg ON pkg."systemId" = s."packagingSystemId"
        LEFT JOIN orders o ON o."systemId" = s."orderId"
        LEFT JOIN supplier_warranties w ON w."systemId" = s."warrantyId"
        LEFT JOIN employees e ON e."fullName" = COALESCE(pkg."requestingEmployeeName", '')
        WHERE s."createdAt" >= ${start}
          AND s."createdAt" <= ${end}
          ${branchFilter}
          ${carrierFilter}
        GROUP BY COALESCE(NULLIF(TRIM(COALESCE(pkg."requestingEmployeeName", '')), ''), 'Không xác định')
        ORDER BY total_shipments DESC
      `

      const data: DeliveryEmployeeReportRow[] = rows.map((r) => {
        const totalShipments = num(r.total_shipments)
        const deliveredCount = num(r.delivered_count)
        return {
          employeeSystemId: (r.emp_system_id || r.emp_key) as SystemId,
          employeeName: r.emp_key,
          totalShipments,
          deliveredCount,
          failedCount: num(r.failed_count),
          deliveryRate: totalShipments > 0 ? (deliveredCount / totalShipments) * 100 : 0,
          totalAmount: num(r.total_cod),
        }
      })

      return apiSuccess({ data })
    }

    if (view === 'carrier' || view === 'channel') {
      const rows = await prisma.$queryRaw<
        Array<{
          carrier_id: string
          carrier_name: string
          total_shipments: bigint
          delivered_count: bigint
          pending_count: bigint
          failed_count: bigint
          total_cod: unknown
          total_fee: unknown
          avg_hours: unknown
          delivered_with_hours: bigint
        }>
      >`
        SELECT
          COALESCE(NULLIF(TRIM(s.carrier), ''), 'self') AS carrier_id,
          MAX(COALESCE(NULLIF(TRIM(s.carrier), ''), 'Tự giao')) AS carrier_name,
          COUNT(*)::bigint AS total_shipments,
          SUM(CASE WHEN ${DELIVERED_COND} THEN 1 ELSE 0 END)::bigint AS delivered_count,
          SUM(CASE WHEN ${PENDING_COND} THEN 1 ELSE 0 END)::bigint AS pending_count,
          SUM(CASE WHEN ${FAILED_COND} THEN 1 ELSE 0 END)::bigint AS failed_count,
          COALESCE(SUM(COALESCE(pkg."codAmount", s."codAmount", 0)), 0) AS total_cod,
          COALESCE(SUM(COALESCE(pkg."shippingFeeToPartner", s."shippingFeeToPartner", s."shippingFee", 0)), 0) AS total_fee,
          COALESCE(
            SUM(
              CASE
                WHEN ${DELIVERED_COND} AND s."deliveredAt" IS NOT NULL THEN
                  EXTRACT(EPOCH FROM (s."deliveredAt" - s."createdAt")) / 3600.0
                ELSE NULL
              END
            ),
            0
          ) AS avg_hours,
          SUM(CASE WHEN ${DELIVERED_COND} AND s."deliveredAt" IS NOT NULL THEN 1 ELSE 0 END)::bigint AS delivered_with_hours
        FROM shipments s
        LEFT JOIN packagings pkg ON pkg."systemId" = s."packagingSystemId"
        LEFT JOIN orders o ON o."systemId" = s."orderId"
        LEFT JOIN supplier_warranties w ON w."systemId" = s."warrantyId"
        WHERE s."createdAt" >= ${start}
          AND s."createdAt" <= ${end}
          ${branchFilter}
          ${carrierFilter}
        GROUP BY COALESCE(NULLIF(TRIM(s.carrier), ''), 'self')
        ORDER BY total_shipments DESC
      `

      const mapRow = (r: (typeof rows)[0]): DeliveryCarrierReportRow | DeliveryChannelReportRow => {
        const totalShipments = num(r.total_shipments)
        const deliveredCount = num(r.delivered_count)
        const dw = num(r.delivered_with_hours)
        const avgH = dw > 0 ? num(r.avg_hours) / dw : undefined
        const base = {
          totalShipments,
          deliveredCount,
          pendingCount: num(r.pending_count),
          failedCount: num(r.failed_count),
          deliveryRate: totalShipments > 0 ? (deliveredCount / totalShipments) * 100 : 0,
          totalCod: num(r.total_cod),
          totalShippingFee: num(r.total_fee),
          averageDeliveryTime: avgH,
        }
        if (view === 'channel') {
          return {
            channelId: r.carrier_id,
            channelName: r.carrier_name,
            totalShipments: base.totalShipments,
            deliveredCount: base.deliveredCount,
            failedCount: base.failedCount,
            deliveryRate: base.deliveryRate,
            totalAmount: base.totalCod,
          } as DeliveryChannelReportRow
        }
        return {
          carrierSystemId: r.carrier_id as SystemId,
          carrierName: r.carrier_name,
          ...base,
        } as DeliveryCarrierReportRow
      }

      const data = rows.map(mapRow)
      return apiSuccess({ data })
    }

    if (view === 'branch') {
      const rows = await prisma.$queryRaw<
        Array<{
          branch_id: string
          branch_name: string
          total_shipments: bigint
          delivered_count: bigint
          failed_count: bigint
          total_cod: unknown
        }>
      >`
        SELECT
          COALESCE(o."branchId", w."branchSystemId", 'unknown') AS branch_id,
          MAX(COALESCE(o."branchName", w."branchName", 'Không xác định')) AS branch_name,
          COUNT(*)::bigint AS total_shipments,
          SUM(CASE WHEN ${DELIVERED_COND} THEN 1 ELSE 0 END)::bigint AS delivered_count,
          SUM(CASE WHEN ${FAILED_COND} THEN 1 ELSE 0 END)::bigint AS failed_count,
          COALESCE(SUM(COALESCE(pkg."codAmount", s."codAmount", 0)), 0) AS total_cod
        FROM shipments s
        LEFT JOIN packagings pkg ON pkg."systemId" = s."packagingSystemId"
        LEFT JOIN orders o ON o."systemId" = s."orderId"
        LEFT JOIN supplier_warranties w ON w."systemId" = s."warrantyId"
        WHERE s."createdAt" >= ${start}
          AND s."createdAt" <= ${end}
          ${branchFilter}
          ${carrierFilter}
        GROUP BY COALESCE(o."branchId", w."branchSystemId", 'unknown')
        ORDER BY total_shipments DESC
      `

      const data: DeliveryBranchReportRow[] = rows.map((r) => {
        const totalShipments = num(r.total_shipments)
        const deliveredCount = num(r.delivered_count)
        return {
          branchSystemId: r.branch_id as SystemId,
          branchName: r.branch_name,
          totalShipments,
          deliveredCount,
          failedCount: num(r.failed_count),
          deliveryRate: totalShipments > 0 ? (deliveredCount / totalShipments) * 100 : 0,
          totalAmount: num(r.total_cod),
        }
      })

      return apiSuccess({ data })
    }

    if (view === 'customer') {
      const rows = await prisma.$queryRaw<
        Array<{
          customer_id: string
          customer_name: string
          total_shipments: bigint
          delivered_count: bigint
          failed_count: bigint
          returned_count: bigint
          total_cod: unknown
        }>
      >`
        SELECT
          COALESCE(o."customerId", 'unknown') AS customer_id,
          MAX(COALESCE(o."customerName", w."supplierName", 'Không xác định')) AS customer_name,
          COUNT(*)::bigint AS total_shipments,
          SUM(CASE WHEN ${DELIVERED_COND} THEN 1 ELSE 0 END)::bigint AS delivered_count,
          SUM(CASE WHEN ${FAILED_COND} THEN 1 ELSE 0 END)::bigint AS failed_count,
          SUM(CASE WHEN ${RETURNED_COND} THEN 1 ELSE 0 END)::bigint AS returned_count,
          COALESCE(SUM(COALESCE(pkg."codAmount", s."codAmount", 0)), 0) AS total_cod
        FROM shipments s
        LEFT JOIN packagings pkg ON pkg."systemId" = s."packagingSystemId"
        LEFT JOIN orders o ON o."systemId" = s."orderId"
        LEFT JOIN supplier_warranties w ON w."systemId" = s."warrantyId"
        WHERE s."createdAt" >= ${start}
          AND s."createdAt" <= ${end}
          ${branchFilter}
          ${carrierFilter}
        GROUP BY COALESCE(o."customerId", 'unknown')
        ORDER BY total_shipments DESC
      `

      const data: DeliveryCustomerReportRow[] = rows.map((r) => {
        const totalShipments = num(r.total_shipments)
        const deliveredCount = num(r.delivered_count)
        return {
          customerSystemId: r.customer_id as SystemId,
          customerName: r.customer_name,
          totalShipments,
          deliveredCount,
          failedCount: num(r.failed_count),
          returnedCount: num(r.returned_count),
          totalAmount: num(r.total_cod),
        }
      })

      return apiSuccess({ data })
    }

    if (view === 'source') {
      const rows = await prisma.$queryRaw<
        Array<{
          source_id: string
          source_name: string
          total_shipments: bigint
          delivered_count: bigint
          failed_count: bigint
          total_cod: unknown
        }>
      >`
        SELECT
          COALESCE(NULLIF(TRIM(o.source), ''), 'direct') AS source_id,
          MAX(COALESCE(NULLIF(TRIM(o.source), ''), 'Trực tiếp')) AS source_name,
          COUNT(*)::bigint AS total_shipments,
          SUM(CASE WHEN ${DELIVERED_COND} THEN 1 ELSE 0 END)::bigint AS delivered_count,
          SUM(CASE WHEN ${FAILED_COND} THEN 1 ELSE 0 END)::bigint AS failed_count,
          COALESCE(SUM(COALESCE(pkg."codAmount", s."codAmount", 0)), 0) AS total_cod
        FROM shipments s
        LEFT JOIN packagings pkg ON pkg."systemId" = s."packagingSystemId"
        LEFT JOIN orders o ON o."systemId" = s."orderId"
        LEFT JOIN supplier_warranties w ON w."systemId" = s."warrantyId"
        WHERE s."createdAt" >= ${start}
          AND s."createdAt" <= ${end}
          ${branchFilter}
          ${carrierFilter}
        GROUP BY COALESCE(NULLIF(TRIM(o.source), ''), 'direct')
        ORDER BY total_shipments DESC
      `

      const data: DeliverySourceReportRow[] = rows.map((r) => {
        const totalShipments = num(r.total_shipments)
        const deliveredCount = num(r.delivered_count)
        return {
          sourceId: r.source_id,
          sourceName: r.source_name,
          totalShipments,
          deliveredCount,
          failedCount: num(r.failed_count),
          deliveryRate: totalShipments > 0 ? (deliveredCount / totalShipments) * 100 : 0,
          totalAmount: num(r.total_cod),
        }
      })

      return apiSuccess({ data })
    }

    // shipment-list
    const { page, limit, skip } = parsePagination(searchParams)
    const [listRows, countRow, summaryAgg] = await Promise.all([
      prisma.$queryRaw<
        Array<{
          systemId: string
          id: string
          orderId: string | null
          carrier: string
          eff_status: string
          createdAt: Date
          deliveredAt: Date | null
          cod_amt: unknown
          ship_fee: unknown
          customer_name: string | null
          recipient_address: string | null
        }>
      >`
        SELECT
          s."systemId",
          s.id,
          s."orderId",
          s.carrier,
          COALESCE(pkg."deliveryStatus"::text, s."deliveryStatus", '') AS eff_status,
          s."createdAt",
          s."deliveredAt",
          COALESCE(pkg."codAmount", s."codAmount", 0) AS cod_amt,
          COALESCE(pkg."shippingFeeToPartner", s."shippingFeeToPartner", s."shippingFee", 0) AS ship_fee,
          COALESCE(o."customerName", w."supplierName") AS customer_name,
          s."recipientAddress" AS recipient_address
        FROM shipments s
        LEFT JOIN packagings pkg ON pkg."systemId" = s."packagingSystemId"
        LEFT JOIN orders o ON o."systemId" = s."orderId"
        LEFT JOIN supplier_warranties w ON w."systemId" = s."warrantyId"
        WHERE s."createdAt" >= ${start}
          AND s."createdAt" <= ${end}
          ${branchFilter}
          ${carrierFilter}
        ORDER BY s."createdAt" DESC
        LIMIT ${limit} OFFSET ${skip}
      `,
      prisma.$queryRaw<Array<{ c: bigint }>>`
        SELECT COUNT(*)::bigint AS c
        FROM shipments s
        LEFT JOIN packagings pkg ON pkg."systemId" = s."packagingSystemId"
        LEFT JOIN orders o ON o."systemId" = s."orderId"
        LEFT JOIN supplier_warranties w ON w."systemId" = s."warrantyId"
        WHERE s."createdAt" >= ${start}
          AND s."createdAt" <= ${end}
          ${branchFilter}
          ${carrierFilter}
      `,
      prisma.$queryRaw<
        Array<{
          total_shipments: bigint
          delivered_count: bigint
          pending_count: bigint
          failed_count: bigint
          returned_count: bigint
          cod_amount: unknown
          shipping_fee: unknown
        }>
      >`
        SELECT
          COUNT(*)::bigint AS total_shipments,
          SUM(CASE WHEN ${DELIVERED_COND} THEN 1 ELSE 0 END)::bigint AS delivered_count,
          SUM(CASE WHEN ${PENDING_COND} THEN 1 ELSE 0 END)::bigint AS pending_count,
          SUM(CASE WHEN ${FAILED_COND} THEN 1 ELSE 0 END)::bigint AS failed_count,
          SUM(CASE WHEN ${RETURNED_COND} THEN 1 ELSE 0 END)::bigint AS returned_count,
          COALESCE(SUM(COALESCE(pkg."codAmount", s."codAmount", 0)), 0) AS cod_amount,
          COALESCE(SUM(COALESCE(pkg."shippingFeeToPartner", s."shippingFeeToPartner", s."shippingFee", 0)), 0) AS shipping_fee
        FROM shipments s
        LEFT JOIN packagings pkg ON pkg."systemId" = s."packagingSystemId"
        LEFT JOIN orders o ON o."systemId" = s."orderId"
        LEFT JOIN supplier_warranties w ON w."systemId" = s."warrantyId"
        WHERE s."createdAt" >= ${start}
          AND s."createdAt" <= ${end}
          ${branchFilter}
          ${carrierFilter}
      `,
    ])

    const data: DeliveryShipmentReportRow[] = listRows.map((r) => ({
      shipmentSystemId: r.systemId as SystemId,
      shipmentId: r.id,
      orderId: r.orderId || '',
      carrierName: r.carrier || undefined,
      status: r.eff_status || 'Không xác định',
      createdDate: r.createdAt.toISOString(),
      deliveredDate: r.deliveredAt?.toISOString(),
      codAmount: num(r.cod_amt),
      shippingFee: num(r.ship_fee),
      customerName: r.customer_name || undefined,
      deliveryAddress: r.recipient_address || undefined,
    }))

    const total = num(countRow[0]?.c)
    const s = summaryAgg[0]
    const totalShipments = num(s?.total_shipments)
    const deliveredCount = num(s?.delivered_count)
    const codAmount = num(s?.cod_amount)
    const shippingFee = num(s?.shipping_fee)
    const summary: DeliveryReportSummary = {
      totalShipments,
      deliveredCount,
      pendingCount: num(s?.pending_count),
      failedCount: num(s?.failed_count),
      returnedCount: num(s?.returned_count),
      deliveryRate: totalShipments > 0 ? (deliveredCount / totalShipments) * 100 : 0,
      codAmount,
      shippingFee,
      totalAmount: codAmount + shippingFee,
    }

    return apiSuccess({
      data,
      summary,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) || 1 },
    })
  } catch (e) {
    logError('[reports/delivery-aggregate]', e)
    return apiError('Không thể tạo báo cáo giao hàng', 500)
  }
})
