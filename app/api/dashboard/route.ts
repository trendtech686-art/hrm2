/**
 * Dashboard API - Server-side aggregation
 * 
 * Thay vì load triệu records về client rồi tính toán,
 * API này tính toán trực tiếp trên database.
 */

import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const startDate = searchParams.get('startDate') || new Date().toISOString().split('T')[0]
    const endDate = searchParams.get('endDate') || new Date().toISOString().split('T')[0]
    
    const startOfDay = new Date(startDate)
    startOfDay.setHours(0, 0, 0, 0)
    
    const endOfDay = new Date(endDate)
    endOfDay.setHours(23, 59, 59, 999)

    // Execute all aggregations in parallel
    const [
      todayStats,
      recentOrders,
      topProducts,
      ordersByStatus,
      employeeStats,
    ] = await Promise.all([
      // Today's summary stats - use correct table name "orders"
      prisma.$queryRaw`
        SELECT 
          COUNT(*) FILTER (WHERE status != 'CANCELLED') as total_orders,
          COALESCE(SUM("grandTotal") FILTER (WHERE status != 'CANCELLED'), 0) as total_revenue,
          COUNT(*) FILTER (WHERE status = 'COMPLETED') as completed_orders,
          COUNT(*) FILTER (WHERE "deliveryStatus" = 'SHIPPING') as shipping_orders
        FROM orders
        WHERE "orderDate" >= ${startOfDay} AND "orderDate" <= ${endOfDay}
      `,
      
      // Recent orders (last 10)
      prisma.order.findMany({
        take: 10,
        orderBy: { orderDate: 'desc' },
        select: {
          systemId: true,
          id: true,
          customerName: true,
          grandTotal: true,
          status: true,
          orderDate: true,
        },
      }),
      
      // Top selling products (from order line items) - use correct table names
      prisma.$queryRaw`
        SELECT 
          p."systemId",
          p.id,
          p.name,
          SUM(li.quantity) as total_quantity,
          SUM(li.quantity * li."unitPrice") as total_revenue
        FROM order_line_items li
        JOIN products p ON li."productId" = p."systemId"
        JOIN orders o ON li."orderId" = o."systemId"
        WHERE o."orderDate" >= ${startOfDay} AND o."orderDate" <= ${endOfDay}
          AND o.status != 'CANCELLED'
        GROUP BY p."systemId", p.id, p.name
        ORDER BY total_quantity DESC
        LIMIT 5
      `,
      
      // Orders by status
      prisma.order.groupBy({
        by: ['status'],
        _count: { status: true },
        where: {
          orderDate: {
            gte: startOfDay,
            lte: endOfDay,
          },
        },
      }),
      
      // Active employees count
      prisma.employee.count({
        where: { employmentStatus: 'ACTIVE' },
      }),
    ])

    // New customers today
    const newCustomers = await prisma.customer.count({
      where: {
        createdAt: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
    })

    return NextResponse.json({
      success: true,
      data: {
        summary: {
          totalOrders: Number((todayStats as any[])[0]?.total_orders || 0),
          totalRevenue: Number((todayStats as any[])[0]?.total_revenue || 0),
          completedOrders: Number((todayStats as any[])[0]?.completed_orders || 0),
          shippingOrders: Number((todayStats as any[])[0]?.shipping_orders || 0),
          activeEmployees: employeeStats,
          newCustomers,
        },
        recentOrders,
        topProducts,
        ordersByStatus: ordersByStatus.map(s => ({
          status: s.status,
          count: s._count.status,
        })),
      },
    })
  } catch (error) {
    console.error('Dashboard API error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch dashboard data' },
      { status: 500 }
    )
  }
}
