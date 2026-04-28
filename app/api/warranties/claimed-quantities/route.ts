import { prisma } from '@/lib/prisma'
import { Prisma } from '@/generated/prisma/client'
import { requireAuth, apiSuccess, apiError } from '@/lib/api-utils'
import { logError } from '@/lib/logger'

/**
 * GET /api/warranties/claimed-quantities?customerId=xxx
 * 
 * Returns aggregated claimed quantities for a customer based on COMPLETED warranties.
 * Optimized for performance - calculates aggregates directly in DB, not in application code.
 */
export async function GET(request: Request) {
  const session = await requireAuth()
  if (!session) return apiError('Chưa được xác thực', 401)

  try {
    const { searchParams } = new URL(request.url)
    const customerId = searchParams.get('customerId')

    if (!customerId) {
      return apiError('customerId là bắt buộc', 400)
    }

    // Fetch all COMPLETED warranties for this customer with products
    // Using raw SQL to aggregate products directly in database for efficiency
    const warranties = await prisma.warranty.findMany({
      where: {
        customerId: customerId,
        status: 'COMPLETED',
        isDeleted: false,
      },
      select: {
        id: true,
        products: true, // JSON field
      },
    })

    // Aggregate claimed quantities in application code (products is JSON, not easy to aggregate in SQL)
    const claimedQuantities: Record<string, number> = {}
    const claimedProducts: Record<string, { name: string; quantity: number; warrantyIds: string[] }> = {}

    const warrantyResolutions = ['return', 'replace', 'exchange', 'out_of_stock']

    warranties.forEach((warranty) => {
      const products = warranty.products as Array<{
        productName?: string
        quantity?: number
        resolution?: string
      }> | null

      if (products && Array.isArray(products)) {
        products.forEach((product) => {
          if (
            product.productName &&
            product.quantity &&
            product.resolution &&
            warrantyResolutions.includes(product.resolution)
          ) {
            const key = product.productName.toLowerCase().trim()

            // Sum quantities
            claimedQuantities[key] = (claimedQuantities[key] || 0) + product.quantity

            // Track product details
            if (!claimedProducts[key]) {
              claimedProducts[key] = {
                name: product.productName,
                quantity: 0,
                warrantyIds: [],
              }
            }
            claimedProducts[key].quantity += product.quantity
            if (!claimedProducts[key].warrantyIds.includes(warranty.id)) {
              claimedProducts[key].warrantyIds.push(warranty.id)
            }
          }
        })
      }
    })

    // Calculate total
    const totalClaimed = Object.values(claimedQuantities).reduce((sum, qty) => sum + qty, 0)

    return apiSuccess({
      customerId,
      totalClaimed,
      claimedQuantities, // { "sản phẩm a": 5, "sản phẩm b": 3 }
      claimedProducts: Object.entries(claimedProducts).map(([key, value]) => ({
        productName: value.name,
        claimedQuantity: value.quantity,
        warrantyIds: value.warrantyIds,
        warrantyCount: value.warrantyIds.length,
      })),
      warrantiesCount: warranties.length, // How many COMPLETED warranties
    })
  } catch (error) {
    logError('Error fetching claimed quantities', error)
    return apiError('Không thể tải số lượng đã bảo hành', 500)
  }
}
