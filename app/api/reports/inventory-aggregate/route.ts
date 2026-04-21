/**
 * GET /api/reports/inventory-aggregate
 *
 * Báo cáo tồn kho — tổng hợp từ product_inventory + products (không tải toàn bộ sản phẩm qua client).
 */

import { Prisma } from '@/generated/prisma/client'
import { prisma } from '@/lib/prisma'
import { apiHandler } from '@/lib/api-handler'
import { apiError, apiSuccess } from '@/lib/api-utils'
import { logError } from '@/lib/logger'
import type {
  InventoryBranchReportRow,
  InventoryCategoryReportRow,
  InventoryProductReportRow,
} from '@/features/reports/business-activity/types'
import type { SystemId } from '@/lib/id-types'

export const dynamic = 'force-dynamic'

type View = 'product' | 'branch' | 'category'

function num(v: unknown): number {
  if (v == null) return 0
  if (typeof v === 'bigint') return Number(v)
  if (typeof v === 'number') return Number.isFinite(v) ? v : 0
  const n = Number(v)
  return Number.isFinite(n) ? n : 0
}

export const GET = apiHandler(async (request) => {
  const { searchParams } = new URL(request.url)
  const view = (searchParams.get('view') || 'product') as View
  const branchId = searchParams.get('branchId') || undefined
  const categoryId = searchParams.get('categoryId') || undefined
  const stockStatus = searchParams.get('stockStatus') || undefined

  if (!['product', 'branch', 'category'].includes(view)) {
    return apiError('view không hợp lệ', 400)
  }

  const branchFilter = branchId
    ? Prisma.sql`AND pi."branchId" = ${branchId}`
    : Prisma.empty

  const categoryFilter =
    categoryId && view === 'product'
      ? Prisma.sql`AND EXISTS (
          SELECT 1 FROM unnest(p."categorySystemIds") AS c
          WHERE c = ${categoryId}
        )`
      : Prisma.empty

  const stockFilter =
    stockStatus && view === 'product'
      ? Prisma.sql`AND stock_status = ${stockStatus}`
      : Prisma.empty

  try {
    if (view === 'product') {
      const rows = await prisma.$queryRaw<
        Array<{
          productSystemId: string
          productName: string
          productCode: string | null
          sku: string | null
          categoryName: string | null
          brandName: string | null
          unit: string | null
          onHand: bigint
          committed: bigint
          inTransit: bigint
          inDelivery: bigint
          available: number
          costPrice: unknown
          reorderLevel: number | null
          maxStock: number | null
          stock_status: string
          inventoryValue: unknown
        }>
      >`
        WITH pi_agg AS (
          SELECT
            pi."productId",
            SUM(pi."onHand")::bigint AS on_hand,
            SUM(pi.committed)::bigint AS committed,
            SUM(pi."inTransit")::bigint AS in_transit,
            SUM(pi."inDelivery")::bigint AS in_delivery
          FROM product_inventory pi
          WHERE 1 = 1
            ${branchFilter}
          GROUP BY pi."productId"
        ),
        enriched AS (
          SELECT
            p."systemId" AS "productSystemId",
            p.name AS "productName",
            p.id AS "productCode",
            p.barcode AS sku,
            cat.name AS "categoryName",
            b.name AS "brandName",
            COALESCE(p.unit, 'cái') AS unit,
            a.on_hand::bigint AS "onHand",
            a.committed::bigint AS committed,
            a.in_transit::bigint AS "inTransit",
            a.in_delivery::bigint AS "inDelivery",
            (a.on_hand - a.committed)::int AS available,
            p."costPrice",
            p."reorderLevel",
            p."maxStock",
            (a.on_hand::numeric * COALESCE(p."costPrice", 0)) AS "inventoryValue",
            CASE
              WHEN (a.on_hand - a.committed) <= 0 THEN 'out_of_stock'
              WHEN p."reorderLevel" IS NOT NULL AND (a.on_hand - a.committed) < p."reorderLevel" THEN 'low_stock'
              WHEN p."maxStock" IS NOT NULL AND (a.on_hand - a.committed) > p."maxStock" THEN 'over_stock'
              ELSE 'normal'
            END AS stock_status
          FROM pi_agg a
          INNER JOIN products p ON p."systemId" = a."productId"
          LEFT JOIN categories cat ON cat."systemId" = (p."categorySystemIds")[1]
          LEFT JOIN brands b ON b."systemId" = p."brandId"
          WHERE p."isDeleted" = false
            AND COALESCE(p."isStockTracked", true) = true
            ${categoryFilter}
        )
        SELECT * FROM enriched
        WHERE 1 = 1
          ${stockFilter}
        ORDER BY "inventoryValue" DESC NULLS LAST
      `

      const data: InventoryProductReportRow[] = rows.map((r) => ({
        productSystemId: r.productSystemId as SystemId,
        productName: r.productName,
        productCode: r.productCode ?? undefined,
        sku: r.sku ?? undefined,
        categoryName: r.categoryName ?? undefined,
        brandName: r.brandName ?? undefined,
        unit: r.unit || 'cái',
        onHand: num(r.onHand),
        committed: num(r.committed),
        inTransit: num(r.inTransit),
        inDelivery: num(r.inDelivery),
        available: r.available,
        costPrice: num(r.costPrice),
        inventoryValue: num(r.inventoryValue),
        reorderLevel: r.reorderLevel ?? undefined,
        stockStatus: r.stock_status as InventoryProductReportRow['stockStatus'],
      }))

      const summary = {
        totalProducts: data.length,
        totalOnHand: data.reduce((s, x) => s + x.onHand, 0),
        totalCommitted: data.reduce((s, x) => s + x.committed, 0),
        totalAvailable: data.reduce((s, x) => s + x.available, 0),
        totalInventoryValue: data.reduce((s, x) => s + x.inventoryValue, 0),
        outOfStockCount: data.filter((x) => x.stockStatus === 'out_of_stock').length,
        lowStockCount: data.filter((x) => x.stockStatus === 'low_stock').length,
      }

      return apiSuccess({ data, summary })
    }

    if (view === 'branch') {
      const rows = await prisma.$queryRaw<
        Array<{
          branchSystemId: string
          branchName: string
          totalProducts: bigint
          totalOnHand: bigint
          totalCommitted: bigint
          totalAvailable: bigint
          totalInventoryValue: unknown
          outOfStockCount: bigint
          lowStockCount: bigint
        }>
      >`
        WITH per_cell AS (
          SELECT
            pi."branchId",
            pi."productId",
            pi."onHand",
            pi.committed,
            (pi."onHand" - pi.committed) AS available,
            p."costPrice",
            p."reorderLevel"
          FROM product_inventory pi
          INNER JOIN products p ON p."systemId" = pi."productId"
          WHERE p."isDeleted" = false
            AND COALESCE(p."isStockTracked", true) = true
        ),
        agg AS (
          SELECT
            c."branchId",
            COUNT(DISTINCT CASE WHEN c."onHand" > 0 OR c.committed > 0 THEN c."productId" END)::bigint AS total_products,
            COALESCE(SUM(c."onHand"), 0)::bigint AS total_on_hand,
            COALESCE(SUM(c.committed), 0)::bigint AS total_committed,
            COALESCE(SUM(c.available), 0)::bigint AS total_available,
            COALESCE(SUM(c."onHand"::numeric * COALESCE(c."costPrice", 0)), 0) AS total_inventory_value,
            SUM(
              CASE
                WHEN (c."onHand" > 0 OR c.committed > 0) AND c.available <= 0 THEN 1
                ELSE 0
              END
            )::bigint AS out_of_stock_count,
            SUM(
              CASE
                WHEN (c."onHand" > 0 OR c.committed > 0)
                  AND c.available > 0
                  AND c."reorderLevel" IS NOT NULL
                  AND c.available < c."reorderLevel"
                THEN 1
                ELSE 0
              END
            )::bigint AS low_stock_count
          FROM per_cell c
          GROUP BY c."branchId"
        )
        SELECT
          a."branchId" AS "branchSystemId",
          COALESCE(br.name, 'Không xác định') AS "branchName",
          a.total_products AS "totalProducts",
          a.total_on_hand AS "totalOnHand",
          a.total_committed AS "totalCommitted",
          a.total_available AS "totalAvailable",
          a.total_inventory_value AS "totalInventoryValue",
          a.out_of_stock_count AS "outOfStockCount",
          a.low_stock_count AS "lowStockCount"
        FROM agg a
        LEFT JOIN branches br ON br."systemId" = a."branchId"
        WHERE a.total_products > 0
        ORDER BY a.total_inventory_value DESC
      `

      const data: InventoryBranchReportRow[] = rows.map((r) => ({
        branchSystemId: r.branchSystemId as SystemId,
        branchName: r.branchName,
        totalProducts: num(r.totalProducts),
        totalOnHand: num(r.totalOnHand),
        totalCommitted: num(r.totalCommitted),
        totalAvailable: num(r.totalAvailable),
        totalInventoryValue: num(r.totalInventoryValue),
        outOfStockCount: num(r.outOfStockCount),
        lowStockCount: num(r.lowStockCount),
      }))

      const summary = {
        totalBranches: data.length,
        totalOnHand: data.reduce((s, x) => s + x.totalOnHand, 0),
        totalInventoryValue: data.reduce((s, x) => s + x.totalInventoryValue, 0),
        totalOutOfStock: data.reduce((s, x) => s + x.outOfStockCount, 0),
      }

      return apiSuccess({ data, summary })
    }

    // category
    const rows = await prisma.$queryRaw<
      Array<{
        categorySystemId: string
        categoryName: string
        productCount: bigint
        totalOnHand: bigint
        totalCommitted: bigint
        totalAvailable: bigint
        totalInventoryValue: unknown
        outOfStockCount: bigint
      }>
    >`
      WITH pi_agg AS (
        SELECT
          pi."productId",
          SUM(pi."onHand")::bigint AS on_hand,
          SUM(pi.committed)::bigint AS committed
        FROM product_inventory pi
        GROUP BY pi."productId"
      ),
      per_product AS (
        SELECT
          COALESCE((p."categorySystemIds")[1], 'uncategorized') AS cat_id,
          COALESCE(cat.name, 'Chưa phân loại') AS cat_name,
          p."systemId",
          (a.on_hand - a.committed)::bigint AS available,
          a.on_hand::bigint AS on_hand,
          a.committed::bigint AS committed,
          (a.on_hand::numeric * COALESCE(p."costPrice", 0)) AS inv_val
        FROM pi_agg a
        INNER JOIN products p ON p."systemId" = a."productId"
        LEFT JOIN categories cat ON cat."systemId" = (p."categorySystemIds")[1]
        WHERE p."isDeleted" = false
          AND COALESCE(p."isStockTracked", true) = true
      ),
      agg AS (
        SELECT
          cat_id AS "categorySystemId",
          MAX(cat_name) AS "categoryName",
          COUNT(*)::bigint AS product_count,
          COALESCE(SUM(on_hand), 0)::bigint AS total_on_hand,
          COALESCE(SUM(committed), 0)::bigint AS total_committed,
          COALESCE(SUM(available), 0)::bigint AS total_available,
          COALESCE(SUM(inv_val), 0) AS total_inventory_value,
          SUM(CASE WHEN available <= 0 AND on_hand = 0 THEN 1 ELSE 0 END)::bigint AS out_of_stock_count
        FROM per_product
        GROUP BY cat_id
      )
      SELECT * FROM agg
      ORDER BY total_inventory_value DESC NULLS LAST
    `

    const data: InventoryCategoryReportRow[] = rows.map((r) => ({
      categorySystemId: r.categorySystemId as SystemId,
      categoryName: r.categoryName,
      productCount: num(r.productCount),
      totalOnHand: num(r.totalOnHand),
      totalCommitted: num(r.totalCommitted),
      totalAvailable: num(r.totalAvailable),
      totalInventoryValue: num(r.totalInventoryValue),
      outOfStockCount: num(r.outOfStockCount),
    }))

    const summary = {
      totalCategories: data.length,
      totalOnHand: data.reduce((s, x) => s + x.totalOnHand, 0),
      totalInventoryValue: data.reduce((s, x) => s + x.totalInventoryValue, 0),
      totalOutOfStock: data.reduce((s, x) => s + x.outOfStockCount, 0),
    }

    return apiSuccess({ data, summary })
  } catch (e) {
    logError('[reports/inventory-aggregate]', e)
    return apiError('Không thể tạo báo cáo tồn kho', 500)
  }
})
