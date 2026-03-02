'use server';

import prisma from '@/lib/prisma';
import { auth } from '@/auth';
import type { ActionResult } from '@/types/action-result';

export interface ReportFilters {
  startDate?: Date;
  endDate?: Date;
  branchId?: string;
  employeeId?: string;
  categoryId?: string;
  brandId?: string;
  groupBy?: 'day' | 'week' | 'month' | 'quarter' | 'year';
}

// ==================== SALES REPORT ====================

export interface SalesReportData {
  totalRevenue: number;
  totalOrders: number;
  averageOrderValue: number;
  topProducts: Array<{ productId: string; productName: string; sku: string; quantity: number; revenue: number }>;
  salesByPeriod: Array<{ period: string; revenue: number; orders: number }>;
  salesByBranch: Array<{ branchId: string; branchName: string; revenue: number; orders: number }>;
  salesByEmployee: Array<{ employeeId: string; employeeName: string; revenue: number; orders: number }>;
}

export async function getSalesReport(
  filters: ReportFilters = {}
): Promise<ActionResult<SalesReportData>> {
  const session = await auth()
  if (!session?.user) {
    return { success: false, error: 'Chưa đăng nhập' }
  }
  try {
    const { startDate, endDate, branchId, employeeId, groupBy = 'day' } = filters;

    const where: Record<string, unknown> = {
      status: { not: 'Đã hủy' },
    };
    if (branchId) where.branchId = branchId;
    if (employeeId) where.employeeId = employeeId;
    if (startDate || endDate) {
      where.orderDate = {};
      if (startDate) (where.orderDate as Record<string, unknown>).gte = startDate;
      if (endDate) (where.orderDate as Record<string, unknown>).lte = endDate;
    }

    // Get total revenue and orders
    const totals = await prisma.order.aggregate({
      where,
      _sum: { grandTotal: true },
      _count: true,
    });

    const totalRevenue = totals._sum.grandTotal ? Number(totals._sum.grandTotal) : 0;
    const totalOrders = totals._count ?? 0;
    const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    // Get top products
    const topProducts = await prisma.orderLineItem.groupBy({
      by: ['productId'],
      _sum: { quantity: true, total: true },
      orderBy: { _sum: { total: 'desc' } },
      take: 10,
    });

    const productIds = topProducts.map((p) => p.productId).filter(Boolean) as string[];
    const products = await prisma.product.findMany({
      where: { systemId: { in: productIds } },
      select: { systemId: true, name: true, id: true },
    });
    const productMap = new Map(products.map((p) => [p.systemId, p]));

    // Get sales by period
    const orders = await prisma.order.findMany({
      where,
      select: { orderDate: true, grandTotal: true },
    });

    const periodMap = new Map<string, { revenue: number; orders: number }>();
    orders.forEach((order) => {
      const date = new Date(order.orderDate);
      let key: string;

      switch (groupBy) {
        case 'year':
          key = `${date.getFullYear()}`;
          break;
        case 'quarter':
          key = `${date.getFullYear()}-Q${Math.ceil((date.getMonth() + 1) / 3)}`;
          break;
        case 'month':
          key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
          break;
        case 'week': {
          const weekStart = new Date(date);
          weekStart.setDate(weekStart.getDate() - weekStart.getDay());
          key = weekStart.toISOString().split('T')[0];
          break;
        }
        default:
          key = date.toISOString().split('T')[0];
      }

      const current = periodMap.get(key) || { revenue: 0, orders: 0 };
      periodMap.set(key, {
        revenue: current.revenue + Number(order.grandTotal || 0),
        orders: current.orders + 1,
      });
    });

    // Get sales by branch
    const salesByBranch = await prisma.order.groupBy({
      by: ['branchId'],
      where,
      _sum: { grandTotal: true },
      _count: true,
    });

    const branchIds = salesByBranch.map((s) => s.branchId);
    const branches = await prisma.branch.findMany({
      where: { systemId: { in: branchIds } },
      select: { systemId: true, name: true },
    });
    const branchMap = new Map(branches.map((b) => [b.systemId, b.name]));

    // Get sales by employee
    const salesByEmployee = await prisma.order.groupBy({
      by: ['salespersonId'],
      where: { ...where, salespersonId: { not: '' } },
      _sum: { grandTotal: true },
      _count: { _all: true },
    });

    const employeeIds = salesByEmployee.map((s) => s.salespersonId).filter(Boolean) as string[];
    const employees = await prisma.employee.findMany({
      where: { systemId: { in: employeeIds } },
      select: { systemId: true, fullName: true },
    });
    const employeeMap = new Map(employees.map((e) => [e.systemId, e.fullName]));

    return {
      success: true,
      data: {
        totalRevenue,
        totalOrders,
        averageOrderValue,
        topProducts: topProducts.map((p) => ({
          productId: p.productId || '',
          productName: productMap.get(p.productId || '')?.name || 'Unknown',
          sku: productMap.get(p.productId || '')?.id || '',
          quantity: p._sum?.quantity || 0,
          revenue: p._sum?.total ? Number(p._sum.total) : 0,
        })),
        salesByPeriod: Array.from(periodMap.entries())
          .sort(([a], [b]) => a.localeCompare(b))
          .map(([period, data]) => ({ period, ...data })),
        salesByBranch: salesByBranch.map((s) => ({
          branchId: s.branchId,
          branchName: branchMap.get(s.branchId) || 'Unknown',
          revenue: s._sum.grandTotal ? Number(s._sum.grandTotal) : 0,
          orders: s._count,
        })),
        salesByEmployee: salesByEmployee.map((s) => ({
          employeeId: s.salespersonId || '',
          employeeName: employeeMap.get(s.salespersonId || '') || 'Unknown',
          revenue: s._sum?.grandTotal ? Number(s._sum.grandTotal) : 0,
          orders: s._count._all ?? 0,
        })),
      },
    };
  } catch (error) {
    console.error('Không thể tải báo cáo doanh số:', error);
    return { success: false, error: 'Không thể tải báo cáo doanh số' };
  }
}

// ==================== INVENTORY REPORT ====================

export interface InventoryReportData {
  totalProducts: number;
  totalValue: number;
  lowStockProducts: Array<{ productId: string; productName: string; sku: string; currentStock: number; minStock: number }>;
  stockByCategory: Array<{ categoryId: string; categoryName: string; quantity: number; value: number }>;
  stockByBranch: Array<{ branchId: string; branchName: string; quantity: number; value: number }>;
}

export async function getInventoryReport(
  filters: { branchId?: string; categoryId?: string } = {}
): Promise<ActionResult<InventoryReportData>> {
  const session = await auth()
  if (!session?.user) {
    return { success: false, error: 'Chưa đăng nhập' }
  }
  try {
    const where: Record<string, unknown> = { isActive: true };
    if (filters.categoryId) where.categoryId = filters.categoryId;

    // Total products and value
    const products = await prisma.product.findMany({
      where,
      select: {
        systemId: true,
        name: true,
        id: true,
        totalInventory: true,
        reorderLevel: true,
        costPrice: true,
      },
    });

    const totalProducts = products.length;
    const totalValue = products.reduce(
      (sum, p) => sum + (p.totalInventory || 0) * Number(p.costPrice || 0),
      0
    );

    // Low stock products
    const lowStockProducts = products
      .filter((p) => (p.totalInventory || 0) < (p.reorderLevel || 0))
      .map((p) => ({
        productId: p.systemId,
        productName: p.name,
        sku: p.id,
        currentStock: p.totalInventory || 0,
        minStock: p.reorderLevel || 0,
      }));

    // Stock by branch
    const stockByBranch = await prisma.productInventory.groupBy({
      by: ['branchId'],
      _sum: { onHand: true },
    });

    const branchIds = stockByBranch.map((s) => s.branchId);
    const branchesList = await prisma.branch.findMany({
      where: { systemId: { in: branchIds } },
      select: { systemId: true, name: true },
    });
    const branchNames = new Map(branchesList.map((b) => [b.systemId, b.name]));

    return {
      success: true,
      data: {
        totalProducts,
        totalValue,
        lowStockProducts,
        stockByCategory: [],
        stockByBranch: stockByBranch.map((s) => ({
          branchId: s.branchId,
          branchName: branchNames.get(s.branchId) || 'Unknown',
          quantity: s._sum.onHand || 0,
          value: 0,
        })),
      },
    };
  } catch (error) {
    console.error('Không thể tải báo cáo tồn kho:', error);
    return { success: false, error: 'Không thể tải báo cáo tồn kho' };
  }
}

// ==================== CUSTOMER REPORT ====================

export interface CustomerReportData {
  totalCustomers: number;
  newCustomers: number;
  activeCustomers: number;
  totalDebt: number;
  overdueDebt: number;
  topCustomers: Array<{ customerId: string; customerName: string; phone: string; totalPurchase: number; orderCount: number }>;
  customersByGroup: Array<{ groupId: string; groupName: string; count: number }>;
}

export async function getCustomerReport(
  filters: ReportFilters = {}
): Promise<ActionResult<CustomerReportData>> {
  const session = await auth()
  if (!session?.user) {
    return { success: false, error: 'Chưa đăng nhập' }
  }
  try {
    const { startDate, endDate } = filters;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Total customers
    const totalCustomers = await prisma.customer.count();

    // New customers in period
    const newCustomerWhere: Record<string, unknown> = {};
    if (startDate || endDate) {
      newCustomerWhere.createdAt = {};
      if (startDate) (newCustomerWhere.createdAt as Record<string, unknown>).gte = startDate;
      if (endDate) (newCustomerWhere.createdAt as Record<string, unknown>).lte = endDate;
    }
    const newCustomers = await prisma.customer.count({ where: newCustomerWhere });

    // Active customers (made purchase in period)
    const orderWhere: Record<string, unknown> = { status: { not: 'Đã hủy' } };
    if (startDate || endDate) {
      orderWhere.orderDate = {};
      if (startDate) (orderWhere.orderDate as Record<string, unknown>).gte = startDate;
      if (endDate) (orderWhere.orderDate as Record<string, unknown>).lte = endDate;
    }
    const activeCustomerIds = await prisma.order.findMany({
      where: orderWhere,
      select: { customerId: true },
      distinct: ['customerId'],
    });
    const activeCustomers = activeCustomerIds.filter((o) => o.customerId).length;

    // Debt summary - Customer doesn't have debt field, get from orders
    const totalDebt = 0; // Would need to calculate from unpaid orders
    const overdueDebt = 0;

    // Top customers
    const topCustomers = await prisma.order.groupBy({
      by: ['customerId'],
      where: { ...orderWhere, customerId: { not: null } },
      _sum: { grandTotal: true },
      _count: true,
      orderBy: { _sum: { grandTotal: 'desc' } },
      take: 10,
    });

    const customerIds = topCustomers.map((c) => c.customerId).filter(Boolean) as string[];
    const customers = await prisma.customer.findMany({
      where: { systemId: { in: customerIds } },
      select: { systemId: true, name: true, phone: true },
    });
    const customerMap = new Map(customers.map((c) => [c.systemId, c]));

    // Customers by group
    const customersByGroup = await prisma.customer.groupBy({
      by: ['customerGroup'],
      where: { customerGroup: { not: null } },
      _count: { _all: true },
    });

    const groupIds = customersByGroup.map((g) => g.customerGroup).filter(Boolean) as string[];
    const groups = await prisma.customerSetting.findMany({
      where: { systemId: { in: groupIds } },
      select: { systemId: true, name: true },
    });
    const groupMap = new Map(groups.map((g) => [g.systemId, g.name]));

    return {
      success: true,
      data: {
        totalCustomers,
        newCustomers,
        activeCustomers,
        totalDebt,
        overdueDebt,
        topCustomers: topCustomers.map((c) => ({
          customerId: c.customerId || '',
          customerName: customerMap.get(c.customerId || '')?.name || 'Unknown',
          phone: customerMap.get(c.customerId || '')?.phone || '',
          totalPurchase: c._sum.grandTotal ? Number(c._sum.grandTotal) : 0,
          orderCount: c._count,
        })),
        customersByGroup: customersByGroup.map((g) => ({
          groupId: g.customerGroup || '',
          groupName: groupMap.get(g.customerGroup || '') || 'Unknown',
          count: g._count._all ?? 0,
        })),
      },
    };
  } catch (error) {
    console.error('Không thể tải báo cáo khách hàng:', error);
    return { success: false, error: 'Không thể tải báo cáo khách hàng' };
  }
}

// ==================== EMPLOYEE REPORT ====================

export interface EmployeeReportData {
  totalEmployees: number;
  activeEmployees: number;
  employeesByDepartment: Array<{ departmentId: string; departmentName: string; count: number }>;
  salesPerformance: Array<{ employeeId: string; employeeName: string; revenue: number; orders: number }>;
  attendanceSummary: Array<{ employeeId: string; employeeName: string; workDays: number; leaveDays: number; lateDays: number }>;
}

export async function getEmployeeReport(
  filters: ReportFilters = {}
): Promise<ActionResult<EmployeeReportData>> {
  const session = await auth()
  if (!session?.user) {
    return { success: false, error: 'Chưa đăng nhập' }
  }
  try {
    const { startDate, endDate, branchId } = filters;

    const where: Record<string, unknown> = {};
    if (branchId) where.branchId = branchId;

    // Total and active employees
    const totalEmployees = await prisma.employee.count({ where });
    const activeEmployees = await prisma.employee.count({
      where: { ...where, employmentStatus: 'ACTIVE' },
    });

    // Employees by department
    const employeesByDept = await prisma.employee.groupBy({
      by: ['departmentId'],
      where: { ...where, departmentId: { not: null } },
      _count: true,
    });

    const deptIds = employeesByDept.map((d) => d.departmentId).filter(Boolean) as string[];
    const departments = await prisma.department.findMany({
      where: { systemId: { in: deptIds } },
      select: { systemId: true, name: true },
    });
    const deptMap = new Map(departments.map((d) => [d.systemId, d.name]));

    // Sales performance
    const orderWhere: Record<string, unknown> = {
      status: { not: 'CANCELLED' },
      salespersonId: { not: null },
    };
    if (branchId) orderWhere.branchId = branchId;
    if (startDate || endDate) {
      orderWhere.orderDate = {};
      if (startDate) (orderWhere.orderDate as Record<string, unknown>).gte = startDate;
      if (endDate) (orderWhere.orderDate as Record<string, unknown>).lte = endDate;
    }

    const salesPerformance = await prisma.order.groupBy({
      by: ['salespersonId'],
      where: orderWhere,
      _sum: { grandTotal: true },
      _count: true,
      orderBy: { _sum: { grandTotal: 'desc' } },
      take: 20,
    });

    const empIds = salesPerformance.map((s) => s.salespersonId).filter(Boolean) as string[];
    const employees = await prisma.employee.findMany({
      where: { systemId: { in: empIds } },
      select: { systemId: true, fullName: true },
    });
    const empMap = new Map(employees.map((e) => [e.systemId, e.fullName]));

    return {
      success: true,
      data: {
        totalEmployees,
        activeEmployees,
        employeesByDepartment: employeesByDept.map((d) => ({
          departmentId: d.departmentId || '',
          departmentName: deptMap.get(d.departmentId || '') || 'Unknown',
          count: d._count,
        })),
        salesPerformance: salesPerformance.map((s) => ({
          employeeId: s.salespersonId || '',
          employeeName: empMap.get(s.salespersonId || '') || 'Unknown',
          revenue: s._sum.grandTotal ? Number(s._sum.grandTotal) : 0,
          orders: s._count,
        })),
        attendanceSummary: [], // Would need attendance data aggregation
      },
    };
  } catch (error) {
    console.error('Không thể tải báo cáo nhân viên:', error);
    return { success: false, error: 'Không thể tải báo cáo nhân viên' };
  }
}

// ==================== FINANCIAL REPORT ====================

export interface FinancialReportData {
  totalRevenue: number;
  totalReceipts: number;
  totalPayments: number;
  netCashFlow: number;
  revenueByMonth: Array<{ month: string; revenue: number }>;
  receiptsByType: Array<{ type: string; amount: number; count: number }>;
  paymentsByType: Array<{ type: string; amount: number; count: number }>;
}

export async function getFinancialReport(
  filters: ReportFilters = {}
): Promise<ActionResult<FinancialReportData>> {
  const session = await auth()
  if (!session?.user) {
    return { success: false, error: 'Chưa đăng nhập' }
  }
  try {
    const { startDate, endDate, branchId } = filters;

    const where: Record<string, unknown> = {};
    if (branchId) where.branchId = branchId;
    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) (where.createdAt as Record<string, unknown>).gte = startDate;
      if (endDate) (where.createdAt as Record<string, unknown>).lte = endDate;
    }

    // Revenue from orders
    const orderWhere: Record<string, unknown> = { ...where, status: { not: 'CANCELLED' as const } };
    if (startDate || endDate) {
      delete orderWhere.createdAt;
      orderWhere.orderDate = {};
      if (startDate) (orderWhere.orderDate as Record<string, unknown>).gte = startDate;
      if (endDate) (orderWhere.orderDate as Record<string, unknown>).lte = endDate;
    }
    const revenueResult = await prisma.order.aggregate({
      where: orderWhere,
      _sum: { grandTotal: true },
    });
    const totalRevenue = revenueResult._sum.grandTotal ? Number(revenueResult._sum.grandTotal) : 0;

    // Receipts
    const receiptsResult = await prisma.receipt.aggregate({
      where,
      _sum: { amount: true },
    });
    const totalReceipts = receiptsResult._sum.amount ? Number(receiptsResult._sum.amount) : 0;

    // Payments
    const paymentsResult = await prisma.payment.aggregate({
      where,
      _sum: { amount: true },
    });
    const totalPayments = paymentsResult._sum.amount ? Number(paymentsResult._sum.amount) : 0;

    // Net cash flow
    const netCashFlow = totalReceipts - totalPayments;

    // Revenue by month
    const ordersForMonth = await prisma.order.findMany({
      where: orderWhere,
      select: { orderDate: true, grandTotal: true },
    });

    const monthMap = new Map<string, number>();
    ordersForMonth.forEach((o) => {
      const date = new Date(o.orderDate);
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      monthMap.set(key, (monthMap.get(key) || 0) + Number(o.grandTotal || 0));
    });

    // Receipts by type
    const receiptsByType = await prisma.receipt.groupBy({
      by: ['type'],
      where,
      _sum: { amount: true },
      _count: true,
    });

    // Payments by type
    const paymentsByType = await prisma.payment.groupBy({
      by: ['type'],
      where,
      _sum: { amount: true },
      _count: true,
    });

    return {
      success: true,
      data: {
        totalRevenue,
        totalReceipts,
        totalPayments,
        netCashFlow,
        revenueByMonth: Array.from(monthMap.entries())
          .sort(([a], [b]) => a.localeCompare(b))
          .map(([month, revenue]) => ({ month, revenue })),
        receiptsByType: receiptsByType.map((r) => ({
          type: r.type || 'Other',
          amount: r._sum.amount ? Number(r._sum.amount) : 0,
          count: r._count,
        })),
        paymentsByType: paymentsByType.map((p) => ({
          type: p.type || 'Other',
          amount: p._sum.amount ? Number(p._sum.amount) : 0,
          count: p._count,
        })),
      },
    };
  } catch (error) {
    console.error('Không thể tải báo cáo tài chính:', error);
    return { success: false, error: 'Không thể tải báo cáo tài chính' };
  }
}
