import { prisma } from '@/lib/prisma'
import { apiHandler } from '@/lib/api-handler'
import { apiSuccess } from '@/lib/api-utils'

/**
 * Products Stats API
 * Returns summary statistics for the products list page
 * 
 * GET /api/products/stats
 */

export const dynamic = 'force-dynamic'

export const GET = apiHandler(async () => {
    const completedStatuses = ['DELIVERED', 'COMPLETED'] as const

    const [
      totalProducts,
      stockStats,
      deletedCount,
      soldAgg,
      returnedAgg,
      orderCount,
      customerCount,
      revenueAgg,
      returnValueAgg,
      linkedCount,
    ] = await Promise.all([
      // Total non-deleted products
      prisma.product.count({ where: { isDeleted: false } }),
      // Stock stats — computed from productInventory (source of truth)
      prisma.$queryRaw<[{ in_stock: bigint; out_of_stock: bigint; total_value: number }]>`
        SELECT
          COUNT(*) FILTER (WHERE COALESCE(pi_agg.total_on_hand, 0) > 0) as in_stock,
          COUNT(*) FILTER (WHERE COALESCE(pi_agg.total_on_hand, 0) <= 0) as out_of_stock,
          COALESCE(SUM(p."costPrice" * COALESCE(pi_agg.total_on_hand, 0)), 0)::float as total_value
        FROM products p
        LEFT JOIN (
          SELECT "productId", SUM("onHand")::int as total_on_hand
          FROM product_inventory
          GROUP BY "productId"
        ) pi_agg ON pi_agg."productId" = p."systemId"
        WHERE p."isDeleted" = false AND p.type != 'COMBO'
      `.then(r => ({
        inStock: Number(r[0]?.in_stock ?? 0),
        outOfStock: Number(r[0]?.out_of_stock ?? 0),
        totalValue: r[0]?.total_value ?? 0,
      })),
      // Deleted products count (for trash badge)
      prisma.product.count({ where: { isDeleted: true } }),
      // Quantity sold from completed orders
      prisma.orderLineItem.aggregate({
        _sum: { quantity: true },
        where: { order: { status: { in: [...completedStatuses] } } },
      }).then(r => r._sum.quantity ?? 0),
      // Quantity returned from completed sales returns
      prisma.salesReturnItem.aggregate({
        _sum: { quantity: true },
        where: { salesReturn: { status: 'COMPLETED' } },
      }).then(r => r._sum.quantity ?? 0),
      // Order count (completed)
      prisma.order.count({
        where: { status: { in: [...completedStatuses] } },
      }),
      // Distinct customer count (from completed orders)
      prisma.$queryRaw<[{ count: bigint }]>`
        SELECT COUNT(DISTINCT "customerId")::bigint as count
        FROM orders
        WHERE status IN ('DELIVERED', 'COMPLETED')
          AND "customerId" IS NOT NULL
      `.then(r => Number(r[0]?.count ?? 0)),
      // Revenue (sum of grandTotal from completed orders)
      prisma.order.aggregate({
        _sum: { grandTotal: true },
        where: { status: { in: [...completedStatuses] } },
      }).then(r => Number(r._sum.grandTotal ?? 0)),
      // Return value (sum of totalReturnValue from completed returns)
      prisma.salesReturn.aggregate({
        _sum: { totalReturnValue: true },
        where: { status: 'COMPLETED' },
      }).then(r => Number(r._sum.totalReturnValue ?? 0)),
      // PKGX linked products count
      prisma.product.count({ where: { isDeleted: false, pkgxId: { not: null } } }),
    ])

    return apiSuccess({
      totalProducts,
      inStock: stockStats.inStock,
      outOfStock: stockStats.outOfStock,
      totalValue: stockStats.totalValue,
      deletedCount,
      quantitySold: soldAgg,
      quantityReturned: returnedAgg,
      netQuantitySold: Number(soldAgg) - Number(returnedAgg),
      orderCount,
      customerCount,
      revenue: revenueAgg,
      returnValue: returnValueAgg,
      linked: linkedCount,
      unlinked: totalProducts - linkedCount,
    })
})
