import { prisma } from '@/lib/prisma'
import { Prisma } from '@/generated/prisma/client'
import { requireAuth, apiError } from '@/lib/api-utils'
import { NextResponse } from 'next/server'

/**
 * Cursor-based Pagination API for Orders
 * 
 * WHY CURSOR > OFFSET for millions of records:
 * - Offset: SELECT * FROM orders OFFSET 999000 LIMIT 20
 *   → DB must scan 999,000 rows first! O(n) complexity
 * 
 * - Cursor: SELECT * FROM orders WHERE orderDate < '2024-01-15' LIMIT 20
 *   → Uses index directly! O(log n) complexity
 * 
 * USAGE:
 * First page: /api/orders/cursor?limit=20
 * Next page: /api/orders/cursor?limit=20&cursor=ORDER_SYSTEM_ID
 */

// Minimal fields for list view (reduce network payload)
const ORDER_LIST_SELECT = {
  systemId: true,
  id: true,
  customerName: true,
  customerId: true,
  branchName: true,
  branchId: true,
  salespersonName: true,
  orderDate: true,
  status: true,
  paymentStatus: true,
  deliveryStatus: true,
  grandTotal: true,
  paidAmount: true,
  createdAt: true,
  // Count line items instead of including all
  _count: {
    select: { lineItems: true }
  }
} as const

export async function GET(request: Request) {
  const session = await requireAuth()
  if (!session) return apiError('Unauthorized', 401)

  try {
    const { searchParams } = new URL(request.url)
    
    // Cursor pagination params
    const cursor = searchParams.get('cursor') // systemId of last item
    const limit = Math.min(parseInt(searchParams.get('limit') || '20', 10), 100)
    const direction = searchParams.get('direction') || 'next' // 'next' or 'prev'
    
    // Filters
    const search = searchParams.get('search')?.trim()
    const status = searchParams.get('status')
    const paymentStatus = searchParams.get('paymentStatus')
    const deliveryStatus = searchParams.get('deliveryStatus')
    const customerId = searchParams.get('customerId')
    const branchId = searchParams.get('branchId')
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')

    // Build WHERE clause
    const where: Prisma.OrderWhereInput = {}

    if (search) {
      where.OR = [
        { id: { contains: search, mode: 'insensitive' } },
        { customerName: { contains: search, mode: 'insensitive' } },
        { trackingCode: { contains: search } },
      ]
    }

    if (status && status !== 'all') {
      where.status = status as Prisma.EnumOrderStatusFilter<"Order">
    }

    if (paymentStatus && paymentStatus !== 'all') {
      where.paymentStatus = paymentStatus as Prisma.EnumPaymentStatusFilter<"Order">
    }

    if (deliveryStatus && deliveryStatus !== 'all') {
      where.deliveryStatus = deliveryStatus as Prisma.EnumDeliveryStatusFilter<"Order">
    }

    if (customerId) {
      where.customerId = customerId
    }

    if (branchId) {
      where.branchId = branchId
    }

    if (startDate || endDate) {
      where.orderDate = {}
      if (startDate) {
        where.orderDate.gte = new Date(startDate)
      }
      if (endDate) {
        where.orderDate.lte = new Date(endDate)
      }
    }

    // Fetch one extra to determine if there's more
    const takeAmount = limit + 1

    // Cursor-based query
    const orders = await prisma.order.findMany({
      where,
      select: ORDER_LIST_SELECT,
      take: direction === 'prev' ? -takeAmount : takeAmount,
      ...(cursor && {
        cursor: { systemId: cursor },
        skip: 1, // Skip the cursor item itself
      }),
      orderBy: { orderDate: 'desc' },
    })

    // Check if there are more items
    const hasMore = orders.length > limit
    if (hasMore) {
      orders.pop() // Remove the extra item
    }

    // For prev direction, reverse the results
    if (direction === 'prev') {
      orders.reverse()
    }

    // Get cursors for next/prev navigation
    const firstItem = orders[0]
    const lastItem = orders[orders.length - 1]

    // Get total count (cached, updated periodically for performance)
    // For very large tables, consider using an estimated count or caching
    const total = await prisma.order.count({ where })

    return NextResponse.json({
      data: orders,
      pagination: {
        limit,
        total,
        hasMore,
        hasPrev: !!cursor, // If we have a cursor, there are previous items
        nextCursor: hasMore ? lastItem?.systemId : null,
        prevCursor: firstItem?.systemId || null,
      },
    })
  } catch (error) {
    console.error('Error fetching orders (cursor):', error)
    return apiError('Failed to fetch orders', 500)
  }
}
