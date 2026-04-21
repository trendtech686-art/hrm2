/**
 * GET /api/reports/sales-by-dimension
 *
 * Báo cáo bán hàng gom theo chiều (nhân viên, sản phẩm, chi nhánh, …) — tổng hợp SQL, không tải toàn bộ orders.
 */

import { Prisma } from '@/generated/prisma/client'
import { endOfDay, parseISO, startOfDay } from 'date-fns'
import { prisma } from '@/lib/prisma'
import { apiHandler } from '@/lib/api-handler'
import { apiError, apiSuccess } from '@/lib/api-utils'
import { logError } from '@/lib/logger'
import type {
  SalesBranchReportRow,
  SalesCustomerGroupReportRow,
  SalesCustomerReportRow,
  SalesEmployeeReportRow,
  SalesProductReportRow,
  SalesReportSummary,
  SalesSourceReportRow,
  SalesTaxReportRow,
} from '@/features/reports/business-activity/types'

export const dynamic = 'force-dynamic'

const MAX_RANGE_DAYS = 3 * 365

type Dimension =
  | 'employee'
  | 'product'
  | 'branch'
  | 'customer'
  | 'source'
  | 'customer_group'
  | 'tax'

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

function buildSummaryFromRows(
  rows: Array<{
    orderCount?: number
    productAmount?: number
    returnAmount?: number
    taxAmount?: number
    shippingFee?: number
    revenue?: number
    grossProfit?: number
  }>,
): SalesReportSummary {
  const orderCount = rows.reduce((s, r) => s + (r.orderCount ?? 0), 0)
  const productAmount = rows.reduce((s, r) => s + (r.productAmount ?? 0), 0)
  const returnAmount = rows.reduce((s, r) => s + (r.returnAmount ?? 0), 0)
  const taxAmount = rows.reduce((s, r) => s + (r.taxAmount ?? 0), 0)
  const shippingFee = rows.reduce((s, r) => s + (r.shippingFee ?? 0), 0)
  const revenue = rows.reduce((s, r) => s + (r.revenue ?? 0), 0)
  const grossProfit = rows.reduce((s, r) => s + (r.grossProfit ?? 0), 0)
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

export const GET = apiHandler(async (request) => {
  const { searchParams } = new URL(request.url)
  const startDate = searchParams.get('startDate')
  const endDate = searchParams.get('endDate')
  const dimension = (searchParams.get('dimension') || '') as Dimension

  const validDims: Dimension[] = [
    'employee',
    'product',
    'branch',
    'customer',
    'source',
    'customer_group',
    'tax',
  ]
  if (!startDate || !endDate) {
    return apiError('Thiếu startDate hoặc endDate (yyyy-MM-dd)', 400)
  }
  if (!validDims.includes(dimension)) {
    return apiError('dimension không hợp lệ', 400)
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
  const categoryIds = parseList(searchParams.get('categoryIds'))
  const customerGroupIds = parseList(searchParams.get('customerGroupIds'))

  const branchFilter = branchIds.length
    ? Prisma.sql`AND o."branchId" IN (${Prisma.join(branchIds)})`
    : Prisma.empty

  const categoryFilter =
    categoryIds.length > 0 && dimension === 'product'
      ? Prisma.sql`AND EXISTS (
          SELECT 1 FROM unnest(p."categorySystemIds") AS cid
          WHERE cid IN (${Prisma.join(categoryIds)})
        )`
      : Prisma.empty

  const customerGroupFilter =
    customerGroupIds.length > 0 && (dimension === 'customer' || dimension === 'customer_group')
      ? Prisma.sql`AND c."customerGroup" IS NOT NULL AND c."customerGroup" IN (${Prisma.join(
          customerGroupIds,
        )})`
      : Prisma.empty

  try {
    switch (dimension) {
      case 'employee': {
        const rows = await prisma.$queryRaw<
          Array<{
            dim_id: string
            emp_name: string | null
            emp_code: string | null
            branch_name: string | null
            order_count: bigint
            product_amount: unknown
            return_amount: unknown
            cogs: unknown
          }>
        >`
          WITH order_cogs AS (
            SELECT oli."orderId", SUM(oli.quantity * COALESCE(pr."costPrice", 0)) AS cogs
            FROM order_line_items oli
            LEFT JOIN products pr ON pr."systemId" = oli."productId"
            GROUP BY oli."orderId"
          ),
          order_agg AS (
            SELECT
              o."salespersonId" AS dim_id,
              COUNT(*)::bigint AS order_count,
              COALESCE(SUM(o.subtotal), 0) AS product_amount,
              COALESCE(SUM(oc.cogs), 0) AS cogs,
              MAX(o."branchName") AS branch_name
            FROM orders o
            LEFT JOIN order_cogs oc ON oc."orderId" = o."systemId"
            WHERE o.status = 'COMPLETED'
              AND o."orderDate" >= ${start}
              AND o."orderDate" <= ${end}
              ${branchFilter}
            GROUP BY o."salespersonId"
          ),
          ret_agg AS (
            SELECT
              o."salespersonId" AS dim_id,
              COALESCE(SUM(COALESCE(sr."refundAmount", sr."finalAmount", 0)), 0) AS return_amount
            FROM sales_returns sr
            INNER JOIN orders o ON o."systemId" = sr."orderId"
            WHERE sr."returnDate" >= ${start}
              AND sr."returnDate" <= ${end}
              AND o.status = 'COMPLETED'
              ${branchFilter}
            GROUP BY o."salespersonId"
          )
          SELECT
            oa.dim_id,
            e."fullName" AS emp_name,
            e.id AS emp_code,
            oa.branch_name,
            oa.order_count,
            oa.product_amount,
            COALESCE(ra.return_amount, 0) AS return_amount,
            oa.cogs
          FROM order_agg oa
          LEFT JOIN ret_agg ra ON ra.dim_id = oa.dim_id
          LEFT JOIN employees e ON e."systemId" = oa.dim_id
          ORDER BY (COALESCE(oa.product_amount, 0) - COALESCE(ra.return_amount, 0)) DESC
        `

        const data: SalesEmployeeReportRow[] = rows.map((r) => {
          const productAmount = num(r.product_amount)
          const returnAmount = num(r.return_amount)
          const revenue = productAmount - returnAmount
          const grossProfit = revenue - num(r.cogs)
          return {
            employeeSystemId: r.dim_id as SalesEmployeeReportRow['employeeSystemId'],
            employeeName: r.emp_name || 'Không xác định',
            employeeCode: r.emp_code ?? undefined,
            branchName: r.branch_name ?? undefined,
            orderCount: num(r.order_count),
            productAmount,
            returnAmount,
            revenue,
            grossProfit,
          }
        })

        return apiSuccess({ data, summary: buildSummaryFromRows(data) })
      }

      case 'product': {
        const [salesRows, retRows] = await Promise.all([
          prisma.$queryRaw<
            Array<{
              pid: string
              product_name: string | null
              product_code: string | null
              sku: string | null
              category_name: string | null
              brand_name: string | null
              thumbnail: string | null
              qty_sold: bigint
              product_amount: unknown
              cogs: unknown
            }>
          >`
            SELECT
              COALESCE(oli."productId", 'unknown') AS pid,
              MAX(p.name) AS product_name,
              MAX(p.id) AS product_code,
              MAX(p.barcode) AS sku,
              MAX(cat.name) AS category_name,
              MAX(b.name) AS brand_name,
              MAX(p."thumbnailImage") AS thumbnail,
              SUM(oli.quantity)::bigint AS qty_sold,
              COALESCE(SUM(oli.quantity * oli."unitPrice"), 0) AS product_amount,
              COALESCE(SUM(oli.quantity * COALESCE(p."costPrice", 0)), 0) AS cogs
            FROM order_line_items oli
            INNER JOIN orders o ON o."systemId" = oli."orderId"
            LEFT JOIN products p ON p."systemId" = oli."productId"
            LEFT JOIN brands b ON b."systemId" = p."brandId"
            LEFT JOIN categories cat ON cat."systemId" = (p."categorySystemIds")[1]
            WHERE o.status = 'COMPLETED'
              AND o."orderDate" >= ${start}
              AND o."orderDate" <= ${end}
              ${branchFilter}
              ${categoryFilter}
            GROUP BY oli."productId"
          `,
          prisma.$queryRaw<
            Array<{
              pid: string
              return_amount: unknown
              qty_returned: bigint
            }>
          >`
            SELECT
              COALESCE(sri."productId", 'unknown') AS pid,
              COALESCE(SUM(sri.total), 0) AS return_amount,
              COALESCE(SUM(sri.quantity), 0)::bigint AS qty_returned
            FROM sales_return_items sri
            INNER JOIN sales_returns sr ON sr."systemId" = sri."returnId"
            INNER JOIN orders o ON o."systemId" = sr."orderId"
            LEFT JOIN products p ON p."systemId" = sri."productId"
            WHERE sr."returnDate" >= ${start}
              AND sr."returnDate" <= ${end}
              AND o.status = 'COMPLETED'
              ${branchFilter}
              ${categoryIds.length > 0 ? Prisma.sql`AND EXISTS (
                SELECT 1 FROM unnest(p."categorySystemIds") AS cid
                WHERE cid IN (${Prisma.join(categoryIds)})
              )` : Prisma.empty}
            GROUP BY sri."productId"
          `,
        ])

        const retMap = new Map<string, { returnAmount: number; qtyReturned: number }>()
        for (const r of retRows) {
          retMap.set(r.pid, {
            returnAmount: num(r.return_amount),
            qtyReturned: num(r.qty_returned),
          })
        }

        const data: SalesProductReportRow[] = salesRows.map((r) => {
          const ret = retMap.get(r.pid)
          const quantitySold = num(r.qty_sold)
          const quantityReturned = ret?.qtyReturned ?? 0
          const productAmount = num(r.product_amount)
          const returnAmount = ret?.returnAmount ?? 0
          const cogs = num(r.cogs)
          const revenue = productAmount - returnAmount
          const grossProfit = productAmount - cogs
          return {
            productSystemId: r.pid as SalesProductReportRow['productSystemId'],
            productName: r.product_name || 'Unknown',
            productCode: r.product_code ?? undefined,
            sku: r.sku ?? undefined,
            categoryName: r.category_name ?? undefined,
            brandName: r.brand_name ?? undefined,
            thumbnailImage: r.thumbnail ?? undefined,
            quantitySold,
            quantityReturned,
            netQuantity: quantitySold - quantityReturned,
            productAmount,
            returnAmount,
            revenue,
            grossProfit,
            averagePrice: quantitySold > 0 ? productAmount / quantitySold : 0,
          }
        })

        const orderCountRows = await prisma.$queryRaw<Array<{ c: bigint }>>`
          SELECT COUNT(*)::bigint AS c
          FROM orders o
          WHERE o.status = 'COMPLETED'
            AND o."orderDate" >= ${start}
            AND o."orderDate" <= ${end}
            ${branchFilter}
        `
        const orderCount = num(orderCountRows[0]?.c)

        const summary = buildSummaryFromRows(data)
        return apiSuccess({ data, summary: { ...summary, orderCount } })
      }

      case 'branch': {
        const rows = await prisma.$queryRaw<
          Array<{
            dim_id: string
            branch_name: string | null
            branch_code: string | null
            order_count: bigint
            customer_count: bigint
            product_amount: unknown
            return_amount: unknown
            tax_amount: unknown
            shipping_fee: unknown
            cogs: unknown
          }>
        >`
          WITH order_cogs AS (
            SELECT oli."orderId", SUM(oli.quantity * COALESCE(pr."costPrice", 0)) AS cogs
            FROM order_line_items oli
            LEFT JOIN products pr ON pr."systemId" = oli."productId"
            GROUP BY oli."orderId"
          ),
          order_agg AS (
            SELECT
              o."branchId" AS dim_id,
              COUNT(*)::bigint AS order_count,
              COUNT(DISTINCT o."customerId") FILTER (WHERE o."customerId" IS NOT NULL)::bigint AS customer_count,
              COALESCE(SUM(o.subtotal), 0) AS product_amount,
              COALESCE(SUM(o.tax), 0) AS tax_amount,
              COALESCE(SUM(o."shippingFee"), 0) AS shipping_fee,
              COALESCE(SUM(oc.cogs), 0) AS cogs,
              MAX(o."branchName") AS branch_name
            FROM orders o
            LEFT JOIN order_cogs oc ON oc."orderId" = o."systemId"
            WHERE o.status = 'COMPLETED'
              AND o."orderDate" >= ${start}
              AND o."orderDate" <= ${end}
            GROUP BY o."branchId"
          ),
          ret_agg AS (
            SELECT
              o."branchId" AS dim_id,
              COALESCE(SUM(COALESCE(sr."refundAmount", sr."finalAmount", 0)), 0) AS return_amount
            FROM sales_returns sr
            INNER JOIN orders o ON o."systemId" = sr."orderId"
            WHERE sr."returnDate" >= ${start}
              AND sr."returnDate" <= ${end}
              AND o.status = 'COMPLETED'
            GROUP BY o."branchId"
          ),
          branches AS (
            SELECT b."systemId", b.id AS branch_code, b.name AS branch_name
            FROM branches b
          )
          SELECT
            oa.dim_id,
            COALESCE(br.branch_name, oa.branch_name) AS branch_name,
            br.branch_code,
            oa.order_count,
            oa.customer_count,
            oa.product_amount,
            COALESCE(ra.return_amount, 0) AS return_amount,
            oa.tax_amount,
            oa.shipping_fee,
            oa.cogs
          FROM order_agg oa
          LEFT JOIN ret_agg ra ON ra.dim_id = oa.dim_id
          LEFT JOIN branches br ON br."systemId" = oa.dim_id
          ORDER BY (COALESCE(oa.product_amount, 0) - COALESCE(ra.return_amount, 0)) DESC
        `

        const data: SalesBranchReportRow[] = rows.map((r) => {
          const productAmount = num(r.product_amount)
          const returnAmount = num(r.return_amount)
          const revenue = productAmount - returnAmount
          const grossProfit = revenue - num(r.cogs)
          return {
            branchSystemId: r.dim_id as SalesBranchReportRow['branchSystemId'],
            branchName: r.branch_name || 'Không xác định',
            branchCode: r.branch_code ?? undefined,
            orderCount: num(r.order_count),
            customerCount: num(r.customer_count),
            productAmount,
            returnAmount,
            taxAmount: num(r.tax_amount),
            shippingFee: num(r.shipping_fee),
            revenue,
            grossProfit,
          }
        })

        return apiSuccess({ data, summary: buildSummaryFromRows(data) })
      }

      case 'customer': {
        const rows = await prisma.$queryRaw<
          Array<{
            dim_id: string
            customer_name: string | null
            customer_code: string | null
            phone: string | null
            customer_group: string | null
            order_count: bigint
            product_amount: unknown
            return_amount: unknown
            tax_amount: unknown
            shipping_fee: unknown
            cogs: unknown
          }>
        >`
          WITH order_cogs AS (
            SELECT oli."orderId", SUM(oli.quantity * COALESCE(pr."costPrice", 0)) AS cogs
            FROM order_line_items oli
            LEFT JOIN products pr ON pr."systemId" = oli."productId"
            GROUP BY oli."orderId"
          ),
          order_agg AS (
            SELECT
              COALESCE(o."customerId", 'unknown') AS dim_id,
              COUNT(*)::bigint AS order_count,
              COALESCE(SUM(o.subtotal), 0) AS product_amount,
              COALESCE(SUM(o.tax), 0) AS tax_amount,
              COALESCE(SUM(o."shippingFee"), 0) AS shipping_fee,
              COALESCE(SUM(oc.cogs), 0) AS cogs,
              MAX(o."customerName") AS fallback_name
            FROM orders o
            LEFT JOIN customers c ON c."systemId" = o."customerId"
            LEFT JOIN order_cogs oc ON oc."orderId" = o."systemId"
            WHERE o.status = 'COMPLETED'
              AND o."orderDate" >= ${start}
              AND o."orderDate" <= ${end}
              ${branchFilter}
              ${customerGroupFilter}
            GROUP BY o."customerId"
          ),
          ret_agg AS (
            SELECT
              COALESCE(o."customerId", 'unknown') AS dim_id,
              COALESCE(SUM(COALESCE(sr."refundAmount", sr."finalAmount", 0)), 0) AS return_amount
            FROM sales_returns sr
            INNER JOIN orders o ON o."systemId" = sr."orderId"
            LEFT JOIN customers c ON c."systemId" = o."customerId"
            WHERE sr."returnDate" >= ${start}
              AND sr."returnDate" <= ${end}
              AND o.status = 'COMPLETED'
              ${branchFilter}
              ${customerGroupFilter}
            GROUP BY o."customerId"
          )
          SELECT
            oa.dim_id,
            COALESCE(c.name, oa.fallback_name) AS customer_name,
            c.id AS customer_code,
            c.phone,
            c."customerGroup" AS customer_group,
            oa.order_count,
            oa.product_amount,
            COALESCE(ra.return_amount, 0) AS return_amount,
            oa.tax_amount,
            oa.shipping_fee,
            oa.cogs
          FROM order_agg oa
          LEFT JOIN ret_agg ra ON ra.dim_id = oa.dim_id
          LEFT JOIN customers c ON c."systemId" = oa.dim_id AND oa.dim_id <> 'unknown'
          ORDER BY (COALESCE(oa.product_amount, 0) - COALESCE(ra.return_amount, 0)) DESC
        `

        const data: SalesCustomerReportRow[] = rows.map((r) => {
          const productAmount = num(r.product_amount)
          const returnAmount = num(r.return_amount)
          const revenue = productAmount - returnAmount
          const grossProfit = revenue - num(r.cogs)
          const orderCount = num(r.order_count)
          return {
            customerSystemId: r.dim_id as SalesCustomerReportRow['customerSystemId'],
            customerName: r.customer_name || 'Khách lẻ',
            customerCode: r.customer_code ?? undefined,
            customerPhone: r.phone ?? undefined,
            customerGroup: r.customer_group ?? undefined,
            orderCount,
            productAmount,
            returnAmount,
            taxAmount: num(r.tax_amount),
            shippingFee: num(r.shipping_fee),
            revenue,
            grossProfit,
            averageOrderValue: orderCount > 0 ? revenue / orderCount : 0,
          }
        })

        return apiSuccess({ data, summary: buildSummaryFromRows(data) })
      }

      case 'source': {
        const rows = await prisma.$queryRaw<
          Array<{
            source_id: string
            source_name: string
            order_count: bigint
            customer_count: bigint
            product_amount: unknown
            cogs: unknown
          }>
        >`
          WITH order_cogs AS (
            SELECT oli."orderId", SUM(oli.quantity * COALESCE(pr."costPrice", 0)) AS cogs
            FROM order_line_items oli
            LEFT JOIN products pr ON pr."systemId" = oli."productId"
            GROUP BY oli."orderId"
          ),
          order_agg AS (
            SELECT
              COALESCE(NULLIF(TRIM(o.source), ''), 'direct') AS source_id,
              MAX(COALESCE(NULLIF(TRIM(o.source), ''), 'Trực tiếp')) AS source_name,
              COUNT(*)::bigint AS order_count,
              COUNT(DISTINCT o."customerId") FILTER (WHERE o."customerId" IS NOT NULL)::bigint AS customer_count,
              COALESCE(SUM(o.subtotal), 0) AS product_amount,
              COALESCE(SUM(oc.cogs), 0) AS cogs
            FROM orders o
            LEFT JOIN order_cogs oc ON oc."orderId" = o."systemId"
            WHERE o.status = 'COMPLETED'
              AND o."orderDate" >= ${start}
              AND o."orderDate" <= ${end}
              ${branchFilter}
            GROUP BY COALESCE(NULLIF(TRIM(o.source), ''), 'direct')
          )
          SELECT * FROM order_agg
          ORDER BY product_amount DESC
        `

        const data: SalesSourceReportRow[] = rows.map((r) => {
          const productAmount = num(r.product_amount)
          const grossProfit = productAmount - num(r.cogs)
          return {
            sourceId: r.source_id,
            sourceName: r.source_name,
            orderCount: num(r.order_count),
            customerCount: num(r.customer_count),
            productAmount,
            revenue: productAmount,
            grossProfit,
          }
        })

        return apiSuccess({ data, summary: buildSummaryFromRows(data) })
      }

      case 'customer_group': {
        const rows = await prisma.$queryRaw<
          Array<{
            group_id: string
            group_name: string
            customer_count: bigint
            order_count: bigint
            product_amount: unknown
            return_amount: unknown
            cogs: unknown
          }>
        >`
          WITH order_cogs AS (
            SELECT oli."orderId", SUM(oli.quantity * COALESCE(pr."costPrice", 0)) AS cogs
            FROM order_line_items oli
            LEFT JOIN products pr ON pr."systemId" = oli."productId"
            GROUP BY oli."orderId"
          ),
          order_agg AS (
            SELECT
              CASE
                WHEN o."customerId" IS NULL OR c."systemId" IS NULL THEN 'unknown'
                WHEN c."customerGroup" IS NULL OR TRIM(c."customerGroup") = '' THEN 'unknown'
                ELSE c."customerGroup"
              END AS group_id,
              CASE
                WHEN o."customerId" IS NULL OR c."systemId" IS NULL THEN 'Không phân nhóm'
                WHEN c."customerGroup" IS NULL OR TRIM(c."customerGroup") = '' THEN 'Không phân nhóm'
                ELSE c."customerGroup"
              END AS group_name,
              COUNT(DISTINCT o."customerId") FILTER (WHERE o."customerId" IS NOT NULL)::bigint AS customer_count,
              COUNT(*)::bigint AS order_count,
              COALESCE(SUM(o.subtotal), 0) AS product_amount,
              COALESCE(SUM(oc.cogs), 0) AS cogs
            FROM orders o
            LEFT JOIN customers c ON c."systemId" = o."customerId"
            LEFT JOIN order_cogs oc ON oc."orderId" = o."systemId"
            WHERE o.status = 'COMPLETED'
              AND o."orderDate" >= ${start}
              AND o."orderDate" <= ${end}
              ${branchFilter}
              ${customerGroupFilter}
            GROUP BY
              CASE
                WHEN o."customerId" IS NULL OR c."systemId" IS NULL THEN 'unknown'
                WHEN c."customerGroup" IS NULL OR TRIM(c."customerGroup") = '' THEN 'unknown'
                ELSE c."customerGroup"
              END,
              CASE
                WHEN o."customerId" IS NULL OR c."systemId" IS NULL THEN 'Không phân nhóm'
                WHEN c."customerGroup" IS NULL OR TRIM(c."customerGroup") = '' THEN 'Không phân nhóm'
                ELSE c."customerGroup"
              END
          ),
          ret_agg AS (
            SELECT
              CASE
                WHEN o."customerId" IS NULL OR c."systemId" IS NULL THEN 'unknown'
                WHEN c."customerGroup" IS NULL OR TRIM(c."customerGroup") = '' THEN 'unknown'
                ELSE c."customerGroup"
              END AS group_id,
              COALESCE(SUM(COALESCE(sr."refundAmount", sr."finalAmount", 0)), 0) AS return_amount
            FROM sales_returns sr
            INNER JOIN orders o ON o."systemId" = sr."orderId"
            LEFT JOIN customers c ON c."systemId" = o."customerId"
            WHERE sr."returnDate" >= ${start}
              AND sr."returnDate" <= ${end}
              AND o.status = 'COMPLETED'
              ${branchFilter}
              ${customerGroupFilter}
            GROUP BY
              CASE
                WHEN o."customerId" IS NULL OR c."systemId" IS NULL THEN 'unknown'
                WHEN c."customerGroup" IS NULL OR TRIM(c."customerGroup") = '' THEN 'unknown'
                ELSE c."customerGroup"
              END
          )
          SELECT
            oa.group_id,
            oa.group_name,
            oa.customer_count,
            oa.order_count,
            oa.product_amount,
            COALESCE(ra.return_amount, 0) AS return_amount,
            oa.cogs
          FROM order_agg oa
          LEFT JOIN ret_agg ra ON ra.group_id = oa.group_id
          ORDER BY (COALESCE(oa.product_amount, 0) - COALESCE(ra.return_amount, 0)) DESC
        `

        const data: SalesCustomerGroupReportRow[] = rows.map((r) => {
          const productAmount = num(r.product_amount)
          const returnAmount = num(r.return_amount)
          const revenue = productAmount - returnAmount
          const grossProfit = revenue - num(r.cogs)
          const orderCount = num(r.order_count)
          return {
            groupId: r.group_id,
            groupName: r.group_name,
            customerCount: num(r.customer_count),
            orderCount,
            productAmount,
            returnAmount,
            revenue,
            grossProfit,
            averageOrderValue: orderCount > 0 ? revenue / orderCount : 0,
          }
        })

        return apiSuccess({ data, summary: buildSummaryFromRows(data) })
      }

      case 'tax': {
        const rows = await prisma.$queryRaw<
          Array<{
            tax_rate_bucket: number
            order_count: bigint
            product_amount: unknown
            tax_amount: unknown
            cogs: unknown
          }>
        >`
          WITH order_cogs AS (
            SELECT oli."orderId", SUM(oli.quantity * COALESCE(pr."costPrice", 0)) AS cogs
            FROM order_line_items oli
            LEFT JOIN products pr ON pr."systemId" = oli."productId"
            GROUP BY oli."orderId"
          ),
          order_bucket AS (
            SELECT
              CASE
                WHEN COALESCE(o.subtotal, 0) <= 0 OR COALESCE(o.tax, 0) <= 0 THEN 0
                WHEN (o.tax::numeric / NULLIF(o.subtotal::numeric, 0)) * 100 < 2.5 THEN 0
                WHEN (o.tax::numeric / NULLIF(o.subtotal::numeric, 0)) * 100 < 6.5 THEN 5
                WHEN (o.tax::numeric / NULLIF(o.subtotal::numeric, 0)) * 100 < 9 THEN 8
                ELSE 10
              END AS tax_rate_bucket,
              o.subtotal,
              o.tax,
              COALESCE(oc.cogs, 0) AS cogs
            FROM orders o
            LEFT JOIN order_cogs oc ON oc."orderId" = o."systemId"
            WHERE o.status = 'COMPLETED'
              AND o."orderDate" >= ${start}
              AND o."orderDate" <= ${end}
              ${branchFilter}
          )
          SELECT
            tax_rate_bucket,
            COUNT(*)::bigint AS order_count,
            COALESCE(SUM(subtotal), 0) AS product_amount,
            COALESCE(SUM(tax), 0) AS tax_amount,
            COALESCE(SUM(cogs), 0) AS cogs
          FROM order_bucket
          GROUP BY tax_rate_bucket
          ORDER BY tax_rate_bucket
        `

        const data: SalesTaxReportRow[] = rows.map((r) => {
          const taxRate = Number(r.tax_rate_bucket)
          const productAmount = num(r.product_amount)
          const taxAmount = num(r.tax_amount)
          const grossProfit = productAmount - num(r.cogs)
          return {
            taxRate,
            taxRateLabel: `${taxRate}%`,
            orderCount: num(r.order_count),
            productAmount,
            taxAmount,
            revenue: productAmount + taxAmount,
            grossProfit,
          }
        })

        const summary: SalesReportSummary = {
          orderCount: data.reduce((s, r) => s + r.orderCount, 0),
          productAmount: data.reduce((s, r) => s + r.productAmount, 0),
          returnAmount: 0,
          taxAmount: data.reduce((s, r) => s + r.taxAmount, 0),
          shippingFee: 0,
          revenue: data.reduce((s, r) => s + r.revenue, 0),
          grossProfit: data.reduce((s, r) => s + r.grossProfit, 0),
        }

        return apiSuccess({ data, summary })
      }

      default:
        return apiError('dimension không hỗ trợ', 400)
    }
  } catch (e) {
    logError('[reports/sales-by-dimension]', e)
    return apiError('Không thể tạo báo cáo bán hàng theo chiều', 500)
  }
})
