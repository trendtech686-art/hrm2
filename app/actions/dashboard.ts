'use server';

import prisma from '@/lib/prisma';
import { auth } from '@/auth';
import type { ActionResult } from '@/types/action-result';

export interface DashboardFilters {
  startDate?: Date;
  endDate?: Date;
  branchId?: string;
}

export interface DashboardSummary {
  todaySales: number;
  todayOrders: number;
  todayReceipts: number;
  pendingOrders: number;
  lowStockProducts: number;
  pendingComplaints: number;
  overdueDebts: number;
}

export interface SalesChartData {
  labels: string[];
  data: number[];
}

export interface TopProduct {
  systemId: string;
  name: string;
  sku: string;
  quantity: number;
  revenue: number;
}

export interface RecentOrder {
  systemId: string;
  id: string;
  customerName: string;
  total: number;
  status: string;
  date: Date;
}

export interface DashboardAlert {
  type: 'low_stock' | 'pending_order' | 'overdue_debt' | 'pending_complaint' | 'warranty_due';
  message: string;
  count: number;
  severity: 'warning' | 'error' | 'info';
}

/**
 * Get dashboard summary statistics
 */
export async function getDashboardSummary(
  filters: DashboardFilters = {}
): Promise<ActionResult<DashboardSummary>> {
  const session = await auth()
  if (!session?.user) {
    return { success: false, error: 'Chưa đăng nhập' }
  }

  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const where: Record<string, unknown> = {};
    if (filters.branchId) where.branchId = filters.branchId;

    const [
      todayOrders,
      todaySalesTotal,
      todayReceipts,
      pendingOrders,
      lowStockProducts,
      pendingComplaints,
    ] = await Promise.all([
      // Today's orders count
      prisma.order.count({
        where: {
          ...where,
          orderDate: { gte: today, lt: tomorrow },
        },
      }),
      // Today's sales total
      prisma.order.aggregate({
        where: {
          ...where,
          orderDate: { gte: today, lt: tomorrow },
          status: { not: 'CANCELLED' },
        },
        _sum: { grandTotal: true },
      }),
      // Today's receipts
      prisma.receipt.count({
        where: {
          ...where,
          createdAt: { gte: today, lt: tomorrow },
        },
      }),
      // Pending orders
      prisma.order.count({
        where: {
          ...where,
          status: { in: ['PENDING', 'CONFIRMED', 'PACKING'] },
        },
      }),
      // Low stock products
      prisma.product.count({
        where: {
          status: 'ACTIVE',
          totalAvailable: { lt: 10 },
        },
      }),
      // Pending complaints
      prisma.complaint.count({
        where: {
          status: { in: ['IN_PROGRESS', 'OPEN'] },
        },
      }),
    ]);

    // Calculate overdue debts (customers with debt and overdue SLA)
    const overdueDebts = await prisma.customer.count({
      where: {
        currentDebt: { gt: 0 },
        lastPurchaseDate: { lt: today },
      },
    });

    return {
      success: true,
      data: {
        todaySales: todaySalesTotal._sum.grandTotal ? Number(todaySalesTotal._sum.grandTotal) : 0,
        todayOrders,
        todayReceipts,
        pendingOrders,
        lowStockProducts,
        pendingComplaints,
        overdueDebts,
      },
    };
  } catch (error) {
    console.error('Failed to get dashboard summary:', error);
    return { success: false, error: 'Không thể tải thông tin dashboard' };
  }
}

/**
 * Get sales chart data
 */
export async function getSalesChartData(
  filters: DashboardFilters & { groupBy?: 'day' | 'week' | 'month' } = {}
): Promise<ActionResult<SalesChartData>> {
  const session = await auth()
  if (!session?.user) {
    return { success: false, error: 'Chưa đăng nhập' }
  }

  try {
    const { startDate, endDate, branchId, groupBy = 'day' } = filters;

    // Default to last 7 days if no range specified
    const end = endDate || new Date();
    const start = startDate || new Date(end.getTime() - 7 * 24 * 60 * 60 * 1000);

    const where: Record<string, unknown> = {
      orderDate: { gte: start, lte: end },
      status: { not: 'CANCELLED' },
    };
    if (branchId) where.branchId = branchId;

    const orders = await prisma.order.findMany({
      where,
      select: {
        orderDate: true,
        grandTotal: true,
      },
      orderBy: { orderDate: 'asc' },
    });

    // Group by period
    const grouped = new Map<string, number>();

    orders.forEach((order) => {
      let key: string;
      const date = new Date(order.orderDate);

      if (groupBy === 'month') {
        key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      } else if (groupBy === 'week') {
        const weekStart = new Date(date);
        weekStart.setDate(weekStart.getDate() - weekStart.getDay());
        key = weekStart.toISOString().split('T')[0];
      } else {
        key = date.toISOString().split('T')[0];
      }

      grouped.set(key, (grouped.get(key) || 0) + Number(order.grandTotal || 0));
    });

    const labels = Array.from(grouped.keys());
    const data = Array.from(grouped.values());

    return { success: true, data: { labels, data } };
  } catch (error) {
    console.error('Failed to get sales chart data:', error);
    return { success: false, error: 'Không thể tải biểu đồ doanh số' };
  }
}

/**
 * Get top selling products
 */
export async function getTopProducts(
  filters: DashboardFilters & { limit?: number } = {}
): Promise<ActionResult<TopProduct[]>> {
  const session = await auth()
  if (!session?.user) {
    return { success: false, error: 'Chưa đăng nhập' }
  }

  try {
    const { startDate, endDate, branchId, limit = 10 } = filters;

    const where: Record<string, unknown> = {
      order: { status: { not: 'CANCELLED' } },
    };
    if (branchId) (where.order as Record<string, unknown>).branchId = branchId;
    if (startDate || endDate) {
      (where.order as Record<string, unknown>).orderDate = {};
      if (startDate) ((where.order as Record<string, unknown>).orderDate as Record<string, unknown>).gte = startDate;
      if (endDate) ((where.order as Record<string, unknown>).orderDate as Record<string, unknown>).lte = endDate;
    }

    const topProducts = await prisma.orderLineItem.groupBy({
      by: ['productId'],
      where,
      _sum: {
        quantity: true,
        total: true,
      },
      orderBy: {
        _sum: { quantity: 'desc' },
      },
      take: limit,
    });

    // Fetch product details
    const productIds = topProducts.map((p) => p.productId).filter((id): id is string => id !== null);
    const products = await prisma.product.findMany({
      where: { systemId: { in: productIds } },
      select: { systemId: true, name: true, id: true },
    });

    const productMap = new Map(products.map((p) => [p.systemId, p]));

    const result: TopProduct[] = topProducts
      .filter((p) => p.productId !== null)
      .map((p) => {
        const product = productMap.get(p.productId!);
        return {
          systemId: p.productId!,
          name: product?.name || 'Unknown',
          sku: product?.id || '',
          quantity: p._sum?.quantity || 0,
          revenue: p._sum?.total ? Number(p._sum.total) : 0,
        };
      });

    return { success: true, data: result };
  } catch (error) {
    console.error('Failed to get top products:', error);
    return { success: false, error: 'Không thể tải sản phẩm bán chạy' };
  }
}

/**
 * Get recent orders
 */
export async function getRecentOrders(
  filters: DashboardFilters & { limit?: number } = {}
): Promise<ActionResult<RecentOrder[]>> {
  const session = await auth()
  if (!session?.user) {
    return { success: false, error: 'Chưa đăng nhập' }
  }

  try {
    const { branchId, limit = 10 } = filters;

    const where: Record<string, unknown> = {};
    if (branchId) where.branchId = branchId;

    const orders = await prisma.order.findMany({
      where,
      select: {
        systemId: true,
        id: true,
        customerName: true,
        grandTotal: true,
        status: true,
        orderDate: true,
      },
      orderBy: { orderDate: 'desc' },
      take: limit,
    });

    return {
      success: true,
      data: orders.map((o) => ({
        systemId: o.systemId,
        id: o.id,
        customerName: o.customerName || 'Khách lẻ',
        total: o.grandTotal ? Number(o.grandTotal) : 0,
        status: o.status || '',
        date: o.orderDate,
      })),
    };
  } catch (error) {
    console.error('Failed to get recent orders:', error);
    return { success: false, error: 'Không thể tải đơn hàng gần đây' };
  }
}

/**
 * Get dashboard alerts
 */
export async function getDashboardAlerts(
  branchId?: string
): Promise<ActionResult<DashboardAlert[]>> {
  const session = await auth()
  if (!session?.user) {
    return { success: false, error: 'Chưa đăng nhập' }
  }

  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const alerts: DashboardAlert[] = [];

    // Low stock alert
    const lowStockCount = await prisma.product.count({
      where: {
        status: 'ACTIVE',
        totalAvailable: { lt: 10 },
      },
    });
    if (lowStockCount > 0) {
      alerts.push({
        type: 'low_stock',
        message: `${lowStockCount} sản phẩm tồn kho thấp`,
        count: lowStockCount,
        severity: 'warning',
      });
    }

    // Pending orders alert
    const where: Record<string, unknown> = {
      status: { in: ['PENDING', 'CONFIRMED'] },
    };
    if (branchId) where.branchId = branchId;

    const pendingCount = await prisma.order.count({ where });
    if (pendingCount > 0) {
      alerts.push({
        type: 'pending_order',
        message: `${pendingCount} đơn hàng cần xử lý`,
        count: pendingCount,
        severity: 'info',
      });
    }

    // Overdue debts alert
    const overdueDebtCount = await prisma.customer.count({
      where: {
        currentDebt: { gt: 0 },
        lastPurchaseDate: { lt: today },
      },
    });
    if (overdueDebtCount > 0) {
      alerts.push({
        type: 'overdue_debt',
        message: `${overdueDebtCount} khách hàng quá hạn công nợ`,
        count: overdueDebtCount,
        severity: 'error',
      });
    }

    // Pending complaints alert
    const pendingComplaintCount = await prisma.complaint.count({
      where: {
        status: { in: ['IN_PROGRESS', 'OPEN'] },
      },
    });
    if (pendingComplaintCount > 0) {
      alerts.push({
        type: 'pending_complaint',
        message: `${pendingComplaintCount} khiếu nại cần xử lý`,
        count: pendingComplaintCount,
        severity: 'warning',
      });
    }

    // Warranty due alert (warranties received more than 7 days ago and still processing)
    const sevenDaysAgo = new Date(today);
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const warrantyDueCount = await prisma.warranty.count({
      where: {
        status: 'PROCESSING',
        receivedAt: { lte: sevenDaysAgo },
      },
    });
    if (warrantyDueCount > 0) {
      alerts.push({
        type: 'warranty_due',
        message: `${warrantyDueCount} đơn bảo hành quá hạn`,
        count: warrantyDueCount,
        severity: 'error',
      });
    }

    return { success: true, data: alerts };
  } catch (error) {
    console.error('Failed to get dashboard alerts:', error);
    return { success: false, error: 'Không thể tải cảnh báo' };
  }
}

/**
 * Get debt alerts (customers with overdue debts)
 */
export async function getDebtAlerts(
  limit: number = 10
): Promise<ActionResult<Array<{
  customerId: string;
  customerName: string;
  amount: number;
  daysOverdue: number;
}>>> {
  const session = await auth()
  if (!session?.user) {
    return { success: false, error: 'Chưa đăng nhập' }
  }

  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const customers = await prisma.customer.findMany({
      where: {
        currentDebt: { gt: 0 },
        lastPurchaseDate: { lt: today },
      },
      select: {
        systemId: true,
        name: true,
        currentDebt: true,
        lastPurchaseDate: true,
      },
      orderBy: { lastPurchaseDate: 'asc' },
      take: limit,
    });

    return {
      success: true,
      data: customers.map((c) => ({
        customerId: c.systemId,
        customerName: c.name,
        amount: c.currentDebt ? Number(c.currentDebt) : 0,
        daysOverdue: c.lastPurchaseDate
          ? Math.floor((today.getTime() - c.lastPurchaseDate.getTime()) / (1000 * 60 * 60 * 24))
          : 0,
      })),
    };
  } catch (error) {
    console.error('Failed to get debt alerts:', error);
    return { success: false, error: 'Không thể tải cảnh báo công nợ' };
  }
}
