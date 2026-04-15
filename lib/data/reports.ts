/**
 * Reports Data Fetchers
 * 
 * Server-side aggregation for reports with caching
 * Optimized queries to reduce database load
 */

import { unstable_cache } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';
import { CACHE_TTL, CACHE_TAGS } from '@/lib/cache';

// ==================== TYPES ====================

export interface SalesReportFilters {
  startDate: string;
  endDate: string;
  branchId?: string;
  groupBy?: 'day' | 'week' | 'month';
}

export interface SalesSummary {
  totalRevenue: number;
  totalOrders: number;
  totalItems: number;
  averageOrderValue: number;
  totalDiscount: number;
  totalProfit: number;
  profitMargin: number;
}

export interface SalesByPeriod {
  period: string;
  revenue: number;
  orders: number;
  items: number;
}

export interface TopProduct {
  productSystemId: string;
  productId: string;
  productName: string;
  quantitySold: number;
  revenue: number;
  profit: number;
}

export interface TopCustomer {
  customerSystemId: string;
  customerId: string;
  customerName: string;
  totalOrders: number;
  totalSpent: number;
}

export interface InventoryReport {
  totalProducts: number;
  totalStock: number;
  totalValue: number;
  outOfStock: number;
  lowStock: number;
  overStock: number;
  topMovingProducts: Array<{
    productId: string;
    productName: string;
    soldQuantity: number;
    currentStock: number;
  }>;
  slowMovingProducts: Array<{
    productId: string;
    productName: string;
    daysInStock: number;
    currentStock: number;
  }>;
}

// ==================== SALES SUMMARY ====================

/**
 * Get aggregated sales summary
 * Uses Order model for sales data
 * Cached for 5 minutes
 */
export const getSalesSummary = unstable_cache(
  async (filters: SalesReportFilters): Promise<SalesSummary> => {
    const { startDate, endDate, branchId } = filters;
    
    // Build where clause without explicit type to avoid Prisma type conflicts
    const where = {
      orderDate: {
        gte: new Date(startDate),
        lte: new Date(endDate),
      },
      status: {
        notIn: ['CANCELLED' as const],
      },
      ...(branchId && { branchId }),
    };

    // Single aggregation query for orders
    const result = await prisma.order.aggregate({
      where,
      _sum: {
        grandTotal: true,
        discount: true,
      },
      _count: {
        _all: true,
      },
    });

    // Count total items sold
    const itemsResult = await prisma.orderLineItem.aggregate({
      where: {
        order: { is: where },
      },
      _sum: {
        quantity: true,
      },
    });

    const totalRevenue = result._sum?.grandTotal ? Number(result._sum.grandTotal) : 0;
    const totalOrders = (result._count as { _all: number })._all ?? 0;
    const totalItems = itemsResult._sum?.quantity ?? 0;
    const totalDiscount = result._sum?.discount ? Number(result._sum.discount) : 0;
    const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
    
    // Estimate profit (would need proper cost tracking)
    const totalProfit = totalRevenue * 0.25; // placeholder
    const profitMargin = totalRevenue > 0 ? (totalProfit / totalRevenue) * 100 : 0;

    return {
      totalRevenue,
      totalOrders,
      totalItems,
      averageOrderValue,
      totalDiscount,
      totalProfit,
      profitMargin,
    };
  },
  ['reports-sales-summary'],
  { revalidate: CACHE_TTL.MEDIUM, tags: [CACHE_TAGS.REPORTS] }
);

/**
 * Get sales data grouped by period
 * Cached for 5 minutes
 */
export const getSalesByPeriod = unstable_cache(
  async (filters: SalesReportFilters): Promise<SalesByPeriod[]> => {
    const { startDate, endDate, branchId, groupBy = 'day' } = filters;
    
    // Whitelist date format to prevent SQL injection
    const FORMAT_MAP = { day: 'YYYY-MM-DD', week: 'IYYY-IW', month: 'YYYY-MM' } as const;
    const dateFormat = FORMAT_MAP[groupBy] ?? FORMAT_MAP.day;

    const startDateParam = new Date(startDate);
    const endDateParam = new Date(endDate);

    const results = branchId
      ? await prisma.$queryRaw<Array<{
          period: string;
          revenue: number | null;
          orders: bigint;
          items: bigint | null;
        }>>(Prisma.sql`
          SELECT 
            TO_CHAR(o.order_date, ${dateFormat}) as period,
            SUM(o.grand_total) as revenue,
            COUNT(DISTINCT o.system_id) as orders,
            SUM(oli.quantity) as items
          FROM "order" o
          LEFT JOIN order_line_item oli ON o.system_id = oli.order_id
          WHERE o.order_date >= ${startDateParam}
            AND o.order_date <= ${endDateParam}
            AND o.status != 'CANCELLED'
            AND o.branch_id = ${branchId}
          GROUP BY period ORDER BY period ASC
        `)
      : await prisma.$queryRaw<Array<{
          period: string;
          revenue: number | null;
          orders: bigint;
          items: bigint | null;
        }>>(Prisma.sql`
          SELECT 
            TO_CHAR(o.order_date, ${dateFormat}) as period,
            SUM(o.grand_total) as revenue,
            COUNT(DISTINCT o.system_id) as orders,
            SUM(oli.quantity) as items
          FROM "order" o
          LEFT JOIN order_line_item oli ON o.system_id = oli.order_id
          WHERE o.order_date >= ${startDateParam}
            AND o.order_date <= ${endDateParam}
            AND o.status != 'CANCELLED'
          GROUP BY period ORDER BY period ASC
        `);

    return results.map(r => ({
      period: r.period,
      revenue: Number(r.revenue) || 0,
      orders: Number(r.orders) || 0,
      items: Number(r.items) || 0,
    }));
  },
  ['reports-sales-by-period'],
  { revalidate: CACHE_TTL.MEDIUM, tags: [CACHE_TAGS.REPORTS] }
);

/**
 * Get top selling products
 * Cached for 10 minutes
 */
export const getTopProducts = unstable_cache(
  async (filters: SalesReportFilters & { limit?: number }): Promise<TopProduct[]> => {
    const { startDate, endDate, branchId, limit = 10 } = filters;

    const orderWhere = {
      orderDate: {
        gte: new Date(startDate),
        lte: new Date(endDate),
      },
      status: {
        notIn: ['CANCELLED' as const],
      },
      ...(branchId && { branchId }),
    };

    const results = await prisma.orderLineItem.groupBy({
      by: ['productId'],
      where: {
        order: { is: orderWhere },
      },
      _sum: {
        quantity: true,
        total: true,
      },
      orderBy: {
        _sum: {
          quantity: 'desc',
        },
      },
      take: limit,
    });

    // Get product details
    const productIds = results.map(r => r.productId).filter(Boolean) as string[];
    const products = await prisma.product.findMany({
      where: { systemId: { in: productIds } },
      select: {
        systemId: true,
        id: true,
        name: true,
        costPrice: true,
      },
    });

    const productMap = new Map(products.map(p => [p.systemId, p]));

    return results.map(r => {
      const product = productMap.get(r.productId || '');
      const revenue = r._sum?.total ? Number(r._sum.total) : 0;
      const quantity = r._sum?.quantity ?? 0;
      const cost = Number(product?.costPrice || 0) * quantity;
      
      return {
        productSystemId: r.productId || '',
        productId: product?.id || '',
        productName: product?.name || 'Unknown',
        quantitySold: quantity,
        revenue,
        profit: revenue - cost,
      };
    });
  },
  ['reports-top-products'],
  { revalidate: CACHE_TTL.LONG, tags: [CACHE_TAGS.REPORTS] }
);

/**
 * Get top customers by spending
 * Cached for 10 minutes
 */
export const getTopCustomers = unstable_cache(
  async (filters: SalesReportFilters & { limit?: number }): Promise<TopCustomer[]> => {
    const { startDate, endDate, branchId, limit = 10 } = filters;

    const where = {
      orderDate: {
        gte: new Date(startDate),
        lte: new Date(endDate),
      },
      status: {
        notIn: ['CANCELLED' as const],
      },
      ...(branchId && { branchId }),
      customerId: { not: '' },
    };

    const results = await prisma.order.groupBy({
      by: ['customerId'],
      where,
      _sum: {
        grandTotal: true,
      },
      _count: {
        _all: true,
      },
      orderBy: {
        _sum: {
          grandTotal: 'desc',
        },
      },
      take: limit,
    });

    // Get customer details - filter nulls
    const customerIds = results.map(r => r.customerId).filter((id): id is string => id !== null && id !== '');
    const customers = await prisma.customer.findMany({
      where: { systemId: { in: customerIds } },
      select: {
        systemId: true,
        id: true,
        name: true,
      },
    });

    const customerMap = new Map(customers.map(c => [c.systemId, c]));

    return results.map(r => {
      const customer = customerMap.get(r.customerId || '');
      return {
        customerSystemId: r.customerId || '',
        customerId: customer?.id || '',
        customerName: customer?.name || 'Khách lẻ',
        totalOrders: (r._count as { _all: number })._all ?? 0,
        totalSpent: r._sum?.grandTotal ? Number(r._sum.grandTotal) : 0,
      };
    });
  },
  ['reports-top-customers'],
  { revalidate: CACHE_TTL.LONG, tags: [CACHE_TAGS.REPORTS] }
);

// ==================== INVENTORY REPORTS ====================

/**
 * Get inventory report with aggregations
 * Uses ProductInventory model with correct fields (onHand)
 * Cached for 10 minutes
 */
export const getInventoryReport = unstable_cache(
  async (branchId?: string): Promise<InventoryReport> => {
    const where = branchId ? { branchId } : {};

    // Get summary stats - ProductInventory uses 'onHand' not 'quantity'
    const [summary, outOfStock, lowStock] = await Promise.all([
      prisma.productInventory.aggregate({
        where,
        _sum: { onHand: true },
        _count: { _all: true },
      }),
      prisma.productInventory.count({
        where: { ...where, onHand: { lte: 0 } },
      }),
      prisma.productInventory.count({
        where: {
          ...where,
          onHand: { gt: 0, lte: 10 }, // assuming minStock = 10
        },
      }),
    ]);

    // Calculate total value - need to join with Product for costPrice
    const inventoryWithProducts = await prisma.productInventory.findMany({
      where,
      select: {
        onHand: true,
        productId: true,
      },
    });

    // Get products to calculate value
    const productIds = [...new Set(inventoryWithProducts.map(i => i.productId))];
    const products = await prisma.product.findMany({
      where: { systemId: { in: productIds } },
      select: { systemId: true, costPrice: true },
    });
    const productCostMap = new Map(products.map(p => [p.systemId, Number(p.costPrice || 0)]));

    const totalValue = inventoryWithProducts.reduce(
      (sum, inv) => sum + (inv.onHand * (productCostMap.get(inv.productId) || 0)),
      0
    );

    // Top moving products (last 30 days) - use OrderLineItem
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const topMoving = await prisma.orderLineItem.groupBy({
      by: ['productId'],
      where: {
        order: {
          is: {
            orderDate: { gte: thirtyDaysAgo },
            status: { notIn: ['CANCELLED' as const] },
          },
        },
      },
      _sum: { quantity: true },
      orderBy: { _sum: { quantity: 'desc' } },
      take: 10,
    });

    // Get product details for top moving
    const topProductIds = topMoving.map(t => t.productId).filter(Boolean) as string[];
    const topProducts = await prisma.product.findMany({
      where: { systemId: { in: topProductIds } },
      select: { systemId: true, id: true, name: true },
    });

    const topProductMap = new Map(topProducts.map(p => [p.systemId, p]));

    // Get inventory for top products
    const topInventory = await prisma.productInventory.findMany({
      where: {
        productId: { in: topProductIds },
        ...(branchId && { branchId }),
      },
    });
    const inventoryByProduct = new Map<string, number>();
    topInventory.forEach(inv => {
      const current = inventoryByProduct.get(inv.productId) || 0;
      inventoryByProduct.set(inv.productId, current + inv.onHand);
    });

    return {
      totalProducts: (summary._count as { _all: number })._all ?? 0,
      totalStock: summary._sum?.onHand ?? 0,
      totalValue,
      outOfStock,
      lowStock,
      overStock: 0, // Would need maxStock tracking
      topMovingProducts: topMoving.map(t => {
        const product = topProductMap.get(t.productId || '');
        const currentStock = inventoryByProduct.get(t.productId || '') || 0;
        return {
          productId: product?.id || '',
          productName: product?.name || '',
          soldQuantity: t._sum?.quantity ?? 0,
          currentStock,
        };
      }),
      slowMovingProducts: [], // Would need more complex query
    };
  },
  ['reports-inventory'],
  { revalidate: CACHE_TTL.LONG, tags: [CACHE_TAGS.REPORTS] }
);

// ==================== REVENUE BY BRANCH ====================

/**
 * Get revenue comparison by branch
 */
export const getRevenueByBranch = unstable_cache(
  async (filters: SalesReportFilters): Promise<Array<{
    branchSystemId: string;
    branchName: string;
    revenue: number;
    orders: number;
  }>> => {
    const { startDate, endDate } = filters;

    const where = {
      orderDate: {
        gte: new Date(startDate),
        lte: new Date(endDate),
      },
      status: {
        notIn: ['CANCELLED' as const],
      },
    };

    const results = await prisma.order.groupBy({
      by: ['branchId'],
      where,
      _sum: { grandTotal: true },
      _count: { _all: true },
    });

    // Get branch names
    const branchIds = results.map(r => r.branchId).filter(Boolean);
    const branches = await prisma.branch.findMany({
      where: { systemId: { in: branchIds } },
      select: { systemId: true, name: true },
    });

    const branchMap = new Map(branches.map(b => [b.systemId, b]));

    return results.map(r => ({
      branchSystemId: r.branchId || '',
      branchName: branchMap.get(r.branchId || '')?.name || 'Unknown',
      revenue: r._sum?.grandTotal ? Number(r._sum.grandTotal) : 0,
      orders: (r._count as { _all: number })._all ?? 0,
    }));
  },
  ['reports-by-branch'],
  { revalidate: CACHE_TTL.MEDIUM, tags: [CACHE_TAGS.REPORTS] }
);
