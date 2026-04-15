/**
 * Dashboard API - Server-side aggregation
 * 
 * Thay vì load triệu records về client rồi tính toán,
 * API này tính toán trực tiếp trên database.
 * 
 * Query params:
 * - startDate, endDate: khoảng thời gian (default: hôm nay)
 * - branchId: lọc theo chi nhánh
 * - chartDays: số ngày chart (default: 7)
 */

import { Prisma } from '@prisma/client'
import { prisma } from '@/lib/prisma'
import { requireAuth, apiSuccess, apiError } from '@/lib/api-utils'
import { logError } from '@/lib/logger'

// Raw query result interfaces
interface SummaryRow {
  total_orders: bigint;
  total_revenue: bigint | number;
  new_orders: bigint;
  return_count: bigint;
  cancel_count: bigint;
}

interface ChartRow {
  date: Date;
  orders: bigint;
  revenue: bigint | number;
}

interface TopProductRow {
  systemId: string;
  product_code: string;
  name: string;
  thumbnail_image: string | null;
  total_quantity: bigint;
  total_revenue: bigint | number;
}

interface PipelineRow {
  status: string;
  delivery_status: string | null;
  cnt: bigint;
}

interface InventoryRow {
  total_on_hand: bigint;
  total_value: bigint | number;
  low_stock_count: bigint;
  out_of_stock_count: bigint;
}

export async function GET(request: Request) {
  const session = await requireAuth()
  if (!session) return apiError('Unauthorized', 401)

  try {
    const { searchParams } = new URL(request.url)
    const today = new Date().toISOString().split('T')[0]
    const startDate = searchParams.get('startDate') || today
    const endDate = searchParams.get('endDate') || today
    const branchId = searchParams.get('branchId') || null

    // Chart date range
    const chartFrom = searchParams.get('chartFrom')
    const chartTo = searchParams.get('chartTo')
    // Top products date range (falls back to chart range)
    const topFrom = searchParams.get('topFrom') || chartFrom
    const topTo = searchParams.get('topTo') || chartTo

    // Fallback: chartDays param for backward compat
    const chartDays = Math.min(Number(searchParams.get('chartDays')) || 7, 365)

    const startOfDay = new Date(startDate)
    startOfDay.setHours(0, 0, 0, 0)
    const endOfDay = new Date(endDate)
    endOfDay.setHours(23, 59, 59, 999)

    // Chart range — explicit dates or fallback to chartDays
    const chartStart = chartFrom ? new Date(chartFrom) : new Date(endOfDay)
    if (!chartFrom) chartStart.setDate(chartStart.getDate() - (chartDays - 1))
    chartStart.setHours(0, 0, 0, 0)

    const chartEnd = chartTo ? new Date(chartTo) : new Date(endOfDay)
    chartEnd.setHours(23, 59, 59, 999)

    // Top products range
    const topProductStart = topFrom ? new Date(topFrom) : new Date(chartStart)
    topProductStart.setHours(0, 0, 0, 0)

    const topProductEnd = topTo ? new Date(topTo) : new Date(chartEnd)
    topProductEnd.setHours(23, 59, 59, 999)

    // Branch filter SQL fragments
    const branchFilter = branchId
      ? Prisma.sql`AND o."branchId" = ${branchId}`
      : Prisma.empty
    const branchFilterInv = branchId
      ? Prisma.sql`WHERE pi."branchId" = ${branchId}`
      : Prisma.empty

    const [
      summaryResult,
      recentOrders,
      topProducts,
      pipelineResult,
      revenueChart,
      inventoryResult,
      activeEmployees,
    ] = await Promise.all([
      // 1. Summary KPIs
      prisma.$queryRaw<SummaryRow[]>`
        SELECT
          COUNT(*) FILTER (WHERE o.status NOT IN ('CANCELLED')) as total_orders,
          COALESCE(SUM(o."grandTotal") FILTER (WHERE o.status NOT IN ('CANCELLED')), 0) as total_revenue,
          COUNT(*) FILTER (WHERE o.status = 'PENDING') as new_orders,
          COUNT(*) FILTER (WHERE o.status = 'RETURNED') as return_count,
          COUNT(*) FILTER (WHERE o.status = 'CANCELLED') as cancel_count
        FROM orders o
        WHERE o."orderDate" >= ${startOfDay} AND o."orderDate" <= ${endOfDay}
          ${branchFilter}
      `,

      // 2. Recent orders (last 5)
      prisma.order.findMany({
        take: 5,
        orderBy: { orderDate: 'desc' },
        where: branchId ? { branchId } : undefined,
        select: {
          systemId: true,
          id: true,
          customerName: true,
          grandTotal: true,
          status: true,
          orderDate: true,
        },
      }),

      // 3. Top products (riêng khoảng thời gian topProductDays)
      prisma.$queryRaw<TopProductRow[]>`
        SELECT
          p."systemId",
          p.id as product_code,
          p.name,
          p."thumbnailImage" as thumbnail_image,
          COALESCE(SUM(li.quantity), 0) as total_quantity,
          COALESCE(SUM(li.quantity * li."unitPrice"), 0) as total_revenue
        FROM order_line_items li
        JOIN products p ON li."productId" = p."systemId"
        JOIN orders o ON li."orderId" = o."systemId"
        WHERE o."orderDate" >= ${topProductStart} AND o."orderDate" <= ${topProductEnd}
          AND o.status NOT IN ('CANCELLED', 'RETURNED')
          ${branchFilter}
        GROUP BY p."systemId", p.id, p.name, p."thumbnailImage"
        ORDER BY total_quantity DESC
        LIMIT 5
      `,

      // 4. Order pipeline
      prisma.$queryRaw<PipelineRow[]>`
        SELECT o.status, o."deliveryStatus" as delivery_status, COUNT(*) as cnt
        FROM orders o
        WHERE o.status NOT IN ('COMPLETED', 'CANCELLED', 'RETURNED')
          ${branchFilter}
        GROUP BY o.status, o."deliveryStatus"
      `,

      // 5. Revenue chart
      prisma.$queryRaw<ChartRow[]>`
        SELECT
          DATE(o."orderDate") as date,
          COUNT(*) FILTER (WHERE o.status NOT IN ('CANCELLED')) as orders,
          COALESCE(SUM(o."grandTotal") FILTER (WHERE o.status NOT IN ('CANCELLED')), 0) as revenue
        FROM orders o
        WHERE o."orderDate" >= ${chartStart} AND o."orderDate" <= ${chartEnd}
          ${branchFilter}
        GROUP BY DATE(o."orderDate")
        ORDER BY date ASC
      `,

      // 6. Inventory summary
      prisma.$queryRaw<InventoryRow[]>`
        SELECT
          COALESCE(SUM(pi."onHand"), 0) as total_on_hand,
          COALESCE(SUM(pi."onHand" * COALESCE(p."costPrice", 0)), 0) as total_value,
          COUNT(*) FILTER (WHERE 
            pi."onHand" > 0 
            AND pi."onHand" <= COALESCE(NULLIF(p."reorderLevel", 0), 10)
          ) as low_stock_count,
          COUNT(*) FILTER (WHERE pi."onHand" <= 0) as out_of_stock_count
        FROM product_inventory pi
        JOIN products p ON pi."productId" = p."systemId"
        ${branchFilterInv}
      `,

      // 7. Active employees
      prisma.employee.count({
        where: { employmentStatus: 'ACTIVE' },
      }),
    ])

    // Parse summary
    const summary = summaryResult[0]
    const kpi = {
      totalRevenue: Number(summary?.total_revenue || 0),
      totalOrders: Number(summary?.total_orders || 0),
      newOrders: Number(summary?.new_orders || 0),
      returnCount: Number(summary?.return_count || 0),
      cancelCount: Number(summary?.cancel_count || 0),
      activeEmployees,
    }

    // Parse order pipeline
    const pipeline = {
      pending: 0,        // Chờ duyệt (PENDING)
      confirmed: 0,      // Chờ thanh toán (CONFIRMED)
      packing: 0,        // Chờ đóng gói (PACKING + PROCESSING)
      readyForPickup: 0, // Chờ lấy hàng (PACKED, READY_FOR_PICKUP)
      shipping: 0,       // Đang giao hàng (SHIPPING)
      failedDelivery: 0, // Hủy giao - chờ nhận (FAILED_DELIVERY)
    }
    for (const row of pipelineResult) {
      const cnt = Number(row.cnt)
      switch (row.status) {
        case 'PENDING': pipeline.pending += cnt; break
        case 'CONFIRMED': pipeline.confirmed += cnt; break
        case 'PROCESSING':
        case 'PACKING': pipeline.packing += cnt; break
        case 'PACKED':
        case 'READY_FOR_PICKUP': pipeline.readyForPickup += cnt; break
        case 'SHIPPING': pipeline.shipping += cnt; break
        case 'FAILED_DELIVERY': pipeline.failedDelivery += cnt; break
      }
    }

    // Fill chart data
    const chartData: Array<{ date: string; orders: number; revenue: number }> = []
    for (let i = chartDays - 1; i >= 0; i--) {
      const d = new Date(endOfDay)
      d.setDate(d.getDate() - i)
      const dateStr = d.toISOString().split('T')[0]
      const found = revenueChart.find(
        r => new Date(r.date).toISOString().split('T')[0] === dateStr
      )
      chartData.push({
        date: dateStr,
        orders: found ? Number(found.orders) : 0,
        revenue: found ? Number(found.revenue) : 0,
      })
    }

    // Inventory
    const inv = inventoryResult[0]
    const inventory = {
      totalOnHand: Number(inv?.total_on_hand || 0),
      totalValue: Number(inv?.total_value || 0),
      lowStockCount: Number(inv?.low_stock_count || 0),
      outOfStockCount: Number(inv?.out_of_stock_count || 0),
    }

    return apiSuccess({
      kpi,
      recentOrders: recentOrders.map(o => ({
        ...o,
        grandTotal: Number(o.grandTotal),
        orderDate: o.orderDate instanceof Date ? o.orderDate.toISOString() : String(o.orderDate),
      })),
      topProducts: topProducts.map(p => ({
        systemId: p.systemId,
        code: p.product_code,
        name: p.name,
        thumbnailImage: p.thumbnail_image,
        quantity: Number(p.total_quantity),
        revenue: Number(p.total_revenue),
      })),
      pipeline,
      chartData,
      inventory,
    })
  } catch (error) {
    logError('Dashboard API error', error)
    return apiError('Failed to fetch dashboard data', 500)
  }
}
