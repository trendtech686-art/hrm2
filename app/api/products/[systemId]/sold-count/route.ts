import { prisma } from '@/lib/prisma'
import { apiHandler } from '@/lib/api-handler'
import { apiSuccess } from '@/lib/api-utils'

export const dynamic = 'force-dynamic'

/**
 * GET /api/products/[systemId]/sold-count
 * Returns sold quantity per branch for a product (server-side aggregation)
 * 
 * ⚡ UPDATED: Now counts orders that have been stocked out (stock left warehouse)
 * instead of just COMPLETED/DELIVERED orders. This is more accurate because:
 * - Once stock leaves warehouse, it's considered "sold" 
 * - Order status may vary (SHIPPING, DELIVERED, COMPLETED) but stockOutStatus is definitive
 */
export const GET = apiHandler(async (
  _request, { params }
) => {
  const { systemId } = await params
    // Aggregate sold quantity per branch directly in DB
    // Count orders that have been stocked out (stockOutStatus = FULLY_STOCKED_OUT)
    // and are not cancelled
    const lineItems = await prisma.orderLineItem.findMany({
      where: {
        productId: systemId,
        order: {
          stockOutStatus: 'FULLY_STOCKED_OUT',
          status: { not: 'CANCELLED' },
        },
      },
      select: {
        quantity: true,
        order: {
          select: { branchId: true },
        },
      },
    })

    const soldByBranch: Record<string, number> = {}
    for (const item of lineItems) {
      const branchId = item.order.branchId
      soldByBranch[branchId] = (soldByBranch[branchId] || 0) + item.quantity
    }

    return apiSuccess(soldByBranch)
})
