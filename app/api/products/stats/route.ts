import { prisma } from '@/lib/prisma'
import { requireAuth, apiError } from '@/lib/api-utils'
import { NextResponse } from 'next/server'

/**
 * Products Stats API
 * Returns summary statistics for the products list page
 * 
 * GET /api/products/stats
 * Response: { totalProducts, activeProducts, outOfStock, lowStock, totalValue, deletedCount }
 */

export const dynamic = 'force-dynamic'

export async function GET() {
  const session = await requireAuth()
  if (!session) return apiError('Unauthorized', 401)

  try {
    const [
      totalProducts,
      activeProducts,
      outOfStockCount,
      lowStockCount,
      totalValueAgg,
      deletedCount,
    ] = await Promise.all([
      // Total non-deleted products
      prisma.product.count({ where: { isDeleted: false } }),
      // Active products
      prisma.product.count({ where: { isDeleted: false, status: 'ACTIVE' } }),
      // Out of stock (totalInventory <= 0, not combo)
      prisma.product.count({
        where: { isDeleted: false, type: { not: 'COMBO' }, totalInventory: { lte: 0 } },
      }),
      // Low stock (totalInventory > 0 AND <= reorderLevel) — approximate via raw SQL
      prisma.$queryRaw<[{ count: bigint }]>`
        SELECT COUNT(*)::bigint as count FROM products
        WHERE "isDeleted" = false
          AND type != 'combo'
          AND "reorderLevel" IS NOT NULL
          AND "totalInventory" > 0
          AND "totalInventory" <= "reorderLevel"
      `.then(r => Number(r[0]?.count ?? 0)),
      // Total inventory value (costPrice * totalInventory)
      prisma.$queryRaw<[{ total: number | null }]>`
        SELECT COALESCE(SUM("costPrice" * "totalInventory"), 0)::float as total
        FROM products
        WHERE "isDeleted" = false AND type != 'combo'
      `.then(r => r[0]?.total ?? 0),
      // Deleted products count (for trash badge)
      prisma.product.count({ where: { isDeleted: true } }),
    ])

    return NextResponse.json({
      totalProducts,
      activeProducts,
      outOfStock: outOfStockCount,
      lowStock: lowStockCount,
      totalValue: totalValueAgg,
      deletedCount,
    })
  } catch (error) {
    console.error('Products stats error:', error)
    return apiError('Failed to get stats', 500)
  }
}
