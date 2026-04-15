import { prisma } from '@/lib/prisma'
import type { Prisma } from '@/generated/prisma/client'
import { apiSuccess } from '@/lib/api-utils'
import { apiHandler } from '@/lib/api-handler'

/**
 * GET /api/customers/[systemId]/products
 * 
 * Fetch paginated products purchased by a customer
 * Flattens order line items into individual product records
 */
export const GET = apiHandler(async (
  request,
  { params: rawParams }
) => {
    const params = await rawParams
    const customerSystemId = params.systemId
    const { searchParams } = new URL(request.url)

    // Pagination
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10))
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '20', 10)))
    const skip = (page - 1) * limit

    // Get customer's orders with line items
    const where: Prisma.OrderWhereInput = {
      customerId: customerSystemId,
      status: { not: 'CANCELLED' },
    }

    // First, get all orders to calculate total line items count
    const orders = await prisma.order.findMany({
      where,
      select: {
        systemId: true,
        id: true,
        orderDate: true,
        lineItems: {
          select: {
            systemId: true,
            productId: true,
            productName: true,
            quantity: true,
          },
        },
      },
      orderBy: { orderDate: 'desc' },
    })

    // Flatten all line items
    type LineItemWithOrder = {
      systemId: string
      productSystemId: string
      productId: string
      name: string
      quantity: number
      orderId: string
      orderSystemId: string
      orderDate: string
      warrantyMonths: number
      warrantyExpiry: string
    }

    const allItems: LineItemWithOrder[] = []
    
    for (const order of orders) {
      const lineItems = order.lineItems

      if (!lineItems || lineItems.length === 0) continue

      for (let i = 0; i < lineItems.length; i++) {
        const item = lineItems[i]
        if (!item) continue

        // Warranty will be fetched from Product later
        const warrantyMonths = 0
        const warrantyExpiry = ''

        allItems.push({
          systemId: `${order.systemId}-${item.productId || i}-${i}`,
          productSystemId: item.productId || '',
          productId: item.productId || '',
          name: item.productName || '',
          quantity: item.quantity || 0,
          orderId: order.id,
          orderSystemId: order.systemId,
          orderDate: order.orderDate ? new Date(order.orderDate).toISOString().split('T')[0] : '',
          warrantyMonths,
          warrantyExpiry,
        })
      }
    }

    // Sort by order date descending
    allItems.sort((a, b) => new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime())

    const total = allItems.length
    const totalPages = Math.ceil(total / limit)
    
    // Apply pagination
    const paginatedItems = allItems.slice(skip, skip + limit)

    // Get product warranty periods for items that don't have it stored
    const productSystemIds = [...new Set(paginatedItems.map(item => item.productSystemId).filter(Boolean))]
    
    if (productSystemIds.length > 0) {
      const products = await prisma.product.findMany({
        where: { systemId: { in: productSystemIds } },
        select: { systemId: true, warrantyPeriodMonths: true },
      })
      
      const productWarrantyMap = new Map(products.map(p => [p.systemId, p.warrantyPeriodMonths || 0]))
      
      // Update warranty info for items that don't have it
      for (const item of paginatedItems) {
        if (item.warrantyMonths === 0 && item.productSystemId) {
          const warrantyMonths = productWarrantyMap.get(item.productSystemId) || 0
          item.warrantyMonths = warrantyMonths
          
          if (warrantyMonths > 0 && item.orderDate) {
            const orderDate = new Date(item.orderDate)
            orderDate.setMonth(orderDate.getMonth() + warrantyMonths)
            item.warrantyExpiry = orderDate.toISOString().split('T')[0]
          }
        }
      }
    }

    return apiSuccess({
      data: paginatedItems,
      pagination: {
        page,
        limit,
        total,
        totalPages,
      },
    })
})
