/**
 * Dashboard Data Fetcher (Server-side with caching)
 */

import { unstable_cache } from 'next/cache';
import { cache } from 'react';
import { prisma } from '@/lib/prisma';
import { CACHE_TTL, CACHE_TAGS } from '@/lib/cache';

export interface DashboardStats {
  sales: {
    today: number;
    todayCount: number;
    month: number;
    monthCount: number;
    growth: number;
  };
  orders: {
    pending: number;
    processing: number;
    completed: number;
  };
  inventory: {
    lowStock: number;
    outOfStock: number;
    totalProducts: number;
  };
  customers: {
    total: number;
    newThisMonth: number;
  };
  warranty: {
    pending: number;
    inProgress: number;
  };
}

export const getDashboardStats = cache(async (branchId?: string) => {
  return unstable_cache(
    async (): Promise<DashboardStats> => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
      const lastMonthStart = new Date(today.getFullYear(), today.getMonth() - 1, 1);
      const lastMonthEnd = new Date(today.getFullYear(), today.getMonth(), 0);

      const branchFilter: Record<string, string> = branchId ? { branchId } : {};

      const [
        todaySales,
        monthSales,
        lastMonthSales,
        pendingOrders,
        processingOrders,
        completedOrders,
        lowStock,
        outOfStock,
        totalProducts,
        totalCustomers,
        newCustomers,
        pendingWarranty,
        inProgressWarranty,
      ] = await Promise.all([
        // Today's sales
        prisma.receipt.aggregate({
          where: { ...branchFilter, createdAt: { gte: today } },
          _sum: { amount: true },
          _count: true,
        }),
        // Month sales
        prisma.receipt.aggregate({
          where: { ...branchFilter, createdAt: { gte: monthStart } },
          _sum: { amount: true },
          _count: true,
        }),
        // Last month sales (for growth)
        prisma.receipt.aggregate({
          where: { 
            ...branchFilter, 
            createdAt: { gte: lastMonthStart, lte: lastMonthEnd } 
          },
          _sum: { amount: true },
        }),
        // Orders by status
        prisma.order.count({ where: { ...branchFilter, status: 'PENDING' } }),
        prisma.order.count({ where: { ...branchFilter, status: 'PROCESSING' } }),
        prisma.order.count({ where: { ...branchFilter, status: 'COMPLETED' } }),
        // Inventory
        prisma.productInventory.count({
          where: {
            ...branchFilter,
            onHand: { lte: 10 },
          },
        }),
        prisma.productInventory.count({
          where: { ...branchFilter, onHand: { lte: 0 } },
        }),
        prisma.product.count({ where: { status: 'ACTIVE' } }),
        // Customers
        prisma.customer.count(),
        prisma.customer.count({
          where: { createdAt: { gte: monthStart } },
        }),
        // Warranty
        prisma.warranty.count({ where: { ...branchFilter, status: 'RECEIVED' } }),
        prisma.warranty.count({ where: { ...branchFilter, status: 'PROCESSING' } }),
      ]);

      const currentMonthTotal = monthSales._sum?.amount?.toNumber() || 0;
      const lastMonthTotal = lastMonthSales._sum?.amount?.toNumber() || 0;
      const growth = lastMonthTotal > 0 
        ? ((currentMonthTotal - lastMonthTotal) / lastMonthTotal) * 100 
        : 0;

      return {
        sales: {
          today: todaySales._sum?.amount?.toNumber() || 0,
          todayCount: typeof todaySales._count === 'number' ? todaySales._count : 0,
          month: currentMonthTotal,
          monthCount: typeof monthSales._count === 'number' ? monthSales._count : 0,
          growth: Math.round(growth * 10) / 10,
        },
        orders: {
          pending: pendingOrders,
          processing: processingOrders,
          completed: completedOrders,
        },
        inventory: {
          lowStock,
          outOfStock,
          totalProducts,
        },
        customers: {
          total: totalCustomers,
          newThisMonth: newCustomers,
        },
        warranty: {
          pending: pendingWarranty,
          inProgress: inProgressWarranty,
        },
      };
    },
    [`dashboard-stats-${branchId || 'all'}`],
    { revalidate: CACHE_TTL.SHORT, tags: [CACHE_TAGS.DASHBOARD] }
  )();
});

export const getRecentActivity = cache(async (branchId?: string, limit = 10) => {
  return unstable_cache(
    async () => {
      const branchFilter: Record<string, string> = branchId ? { branchId } : {};

      const [recentOrders, recentReceipts, recentWarranties] = await Promise.all([
        prisma.order.findMany({
          where: branchFilter,
          orderBy: { createdAt: 'desc' },
          take: limit,
          select: {
            systemId: true,
            id: true,
            customerName: true,
            grandTotal: true,
            status: true,
            createdAt: true,
          },
        }),
        prisma.receipt.findMany({
          where: branchFilter,
          orderBy: { createdAt: 'desc' },
          take: limit,
          select: {
            systemId: true,
            id: true,
            amount: true,
            createdAt: true,
            customerName: true,
          },
        }),
        prisma.warranty.findMany({
          where: branchFilter,
          orderBy: { createdAt: 'desc' },
          take: limit,
          select: {
            systemId: true,
            id: true,
            customerName: true,
            status: true,
            createdAt: true,
            product: { select: { name: true } },
          },
        }),
      ]);

      return {
        orders: recentOrders,
        receipts: recentReceipts.map(r => ({
          ...r,
          grandTotal: r.amount,
        })),
        warranties: recentWarranties,
      };
    },
    [`recent-activity-${branchId || 'all'}-${limit}`],
    { revalidate: CACHE_TTL.SHORT, tags: [CACHE_TAGS.DASHBOARD] }
  )();
});

export const getSalesChart = cache(async (branchId?: string, days = 30) => {
  return unstable_cache(
    async () => {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);
      startDate.setHours(0, 0, 0, 0);

      const branchFilter: Record<string, string> = branchId ? { branchId } : {};

      const receipts = await prisma.receipt.findMany({
        where: {
          ...branchFilter,
          createdAt: { gte: startDate },
        },
        select: {
          amount: true,
          createdAt: true,
        },
      });

      // Group by date
      const grouped = receipts.reduce((acc, r) => {
        const date = r.createdAt.toISOString().split('T')[0];
        if (!acc[date]) {
          acc[date] = { date, total: 0, count: 0 };
        }
        acc[date].total += r.amount.toNumber();
        acc[date].count += 1;
        return acc;
      }, {} as Record<string, { date: string; total: number; count: number }>);

      return Object.values(grouped).sort((a, b) => a.date.localeCompare(b.date));
    },
    [`sales-chart-${branchId || 'all'}-${days}`],
    { revalidate: CACHE_TTL.MEDIUM, tags: [CACHE_TAGS.DASHBOARD] }
  )();
});

export const getTopProducts = cache(async (branchId?: string, limit = 10) => {
  return unstable_cache(
    async () => {
      const monthStart = new Date();
      monthStart.setDate(1);
      monthStart.setHours(0, 0, 0, 0);

      const branchFilter: Record<string, unknown> = branchId ? { order: { branchId } } : {};

      const topProducts = await prisma.orderLineItem.groupBy({
        by: ['productId'],
        where: {
          ...branchFilter,
          order: { createdAt: { gte: monthStart }, status: { not: 'CANCELLED' } },
        },
        _sum: { quantity: true, total: true },
        orderBy: { _sum: { total: 'desc' } },
        take: limit,
      });

      const productIds = topProducts.map(p => p.productId).filter((id): id is string => id !== null);
      const products = await prisma.product.findMany({
        where: { systemId: { in: productIds } },
        select: { systemId: true, name: true, id: true },
      });

      const productMap = new Map(products.map(p => [p.systemId, p]));

      return topProducts
        .filter(p => p.productId !== null)
        .map(p => ({
          productId: p.productId!,
          productName: productMap.get(p.productId!)?.name || 'Unknown',
          sku: productMap.get(p.productId!)?.id || '',
          quantity: p._sum?.quantity || 0,
          revenue: p._sum?.total?.toNumber() || 0,
        }));
    },
    [`top-products-${branchId || 'all'}-${limit}`],
    { revalidate: CACHE_TTL.MEDIUM, tags: [CACHE_TAGS.DASHBOARD] }
  )();
});
