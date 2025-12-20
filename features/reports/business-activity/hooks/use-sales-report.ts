/**
 * Sales Report Hooks
 * 
 * Hooks để tính toán dữ liệu báo cáo bán hàng
 */

import * as React from 'react';
import { format, parseISO, startOfDay, startOfWeek, startOfMonth, startOfQuarter, startOfYear, eachDayOfInterval, eachWeekOfInterval, eachMonthOfInterval, isWithinInterval } from 'date-fns';
import { vi } from 'date-fns/locale';
import { useOrderStore } from '@/features/orders/store';
import { useProductStore } from '@/features/products/store';
import { useEmployeeStore } from '@/features/employees/store';
import { useBranchStore } from '@/features/settings/branches/store';
import { useCustomerStore } from '@/features/customers/store';
import { useSalesReturnStore } from '@/features/sales-returns/store';
import { useBrandStore } from '@/features/settings/inventory/brand-store';
import type { 
  ReportDateRange, 
  TimeGrouping,
  SalesTimeReportRow,
  SalesEmployeeReportRow,
  SalesProductReportRow,
  SalesBranchReportRow,
  SalesCustomerReportRow,
  SalesReportSummary,
} from '../types';
import type { SystemId } from '@/lib/id-types';
import type { Order } from '@/features/orders/types';

// Helper: Get time key and label based on grouping
function getTimeKey(date: Date, grouping: TimeGrouping): { key: string; label: string } {
  switch (grouping) {
    case 'day':
      return {
        key: format(date, 'yyyy-MM-dd'),
        label: format(date, 'dd/MM', { locale: vi }),
      };
    case 'week':
      const weekStart = startOfWeek(date, { weekStartsOn: 1 });
      return {
        key: format(weekStart, 'yyyy-ww'),
        label: `T${format(weekStart, 'w')} (${format(weekStart, 'dd/MM')})`,
      };
    case 'month':
      return {
        key: format(date, 'yyyy-MM'),
        label: format(date, 'MM/yyyy', { locale: vi }),
      };
    case 'quarter':
      const quarter = Math.ceil((date.getMonth() + 1) / 3);
      return {
        key: `${date.getFullYear()}-Q${quarter}`,
        label: `Q${quarter}/${date.getFullYear()}`,
      };
    case 'year':
      return {
        key: format(date, 'yyyy'),
        label: format(date, 'yyyy'),
      };
    default:
      return {
        key: format(date, 'yyyy-MM-dd'),
        label: format(date, 'dd/MM', { locale: vi }),
      };
  }
}

// Helper: Generate time periods for the date range
function generateTimePeriods(dateRange: ReportDateRange, grouping: TimeGrouping): { key: string; label: string }[] {
  const start = parseISO(dateRange.from);
  const end = parseISO(dateRange.to);
  
  let dates: Date[] = [];
  
  switch (grouping) {
    case 'day':
      dates = eachDayOfInterval({ start, end });
      break;
    case 'week':
      dates = eachWeekOfInterval({ start, end }, { weekStartsOn: 1 });
      break;
    case 'month':
      dates = eachMonthOfInterval({ start, end });
      break;
    case 'quarter':
      // Generate quarters
      let current = startOfQuarter(start);
      while (current <= end) {
        dates.push(current);
        current = new Date(current.getFullYear(), current.getMonth() + 3, 1);
      }
      break;
    case 'year':
      let currentYear = startOfYear(start);
      while (currentYear <= end) {
        dates.push(currentYear);
        currentYear = new Date(currentYear.getFullYear() + 1, 0, 1);
      }
      break;
  }
  
  return dates.map(d => getTimeKey(d, grouping));
}

// Hook: Báo cáo bán hàng theo thời gian
export function useSalesTimeReport(
  dateRange: ReportDateRange,
  timeGrouping: TimeGrouping = 'day',
  filters?: {
    branchIds?: SystemId[];
    employeeIds?: SystemId[];
    sourceIds?: string[];
  }
) {
  const { data: orders } = useOrderStore();
  const { findById: findProductById } = useProductStore();
  const { data: returns } = useSalesReturnStore();
  
  return React.useMemo(() => {
    const start = parseISO(dateRange.from);
    const end = parseISO(dateRange.to);
    
    // Filter orders by date and other criteria
    const filteredOrders = orders.filter(order => {
      // Status filter - only completed orders
      if (order.status !== 'Hoàn thành') return false;
      
      // Date filter
      const orderDate = order.orderDate ? parseISO(order.orderDate) : null;
      if (!orderDate) return false;
      if (!isWithinInterval(orderDate, { start, end })) return false;
      
      // Branch filter
      if (filters?.branchIds?.length && !filters.branchIds.includes(order.branchSystemId as SystemId)) {
        return false;
      }
      
      // Employee filter
      if (filters?.employeeIds?.length && order.assigneeSystemId && !filters.employeeIds.includes(order.assigneeSystemId as SystemId)) {
        return false;
      }
      
      // Source filter
      if (filters?.sourceIds?.length && order.source && !filters.sourceIds.includes(order.source)) {
        return false;
      }
      
      return true;
    });
    
    // Filter returns by date
    const filteredReturns = returns.filter(ret => {
      const returnDate = ret.returnDate ? parseISO(ret.returnDate) : null;
      if (!returnDate) return false;
      return isWithinInterval(returnDate, { start, end });
    });
    
    // Generate all time periods
    const periods = generateTimePeriods(dateRange, timeGrouping);
    
    // Initialize data map
    const dataMap = new Map<string, SalesTimeReportRow>();
    periods.forEach(period => {
      dataMap.set(period.key, {
        key: period.key,
        label: period.label,
        orderCount: 0,
        productAmount: 0,
        returnAmount: 0,
        taxAmount: 0,
        shippingFee: 0,
        revenue: 0,
        grossProfit: 0,
        costOfGoods: 0,
      });
    });
    
    // Aggregate orders
    filteredOrders.forEach(order => {
      const orderDate = parseISO(order.orderDate!);
      const { key } = getTimeKey(orderDate, timeGrouping);
      
      const row = dataMap.get(key);
      if (!row) return;
      
      // Calculate cost of goods
      const costOfGoods = order.lineItems.reduce((sum, item) => {
        const product = findProductById(item.productSystemId);
        return sum + ((product?.costPrice || 0) * item.quantity);
      }, 0);
      
      row.orderCount += 1;
      row.productAmount += order.subtotal || 0;
      row.taxAmount += order.tax || 0;
      row.shippingFee += order.shippingCost || 0;
      row.costOfGoods = (row.costOfGoods || 0) + costOfGoods;
    });
    
    // Aggregate returns
    filteredReturns.forEach(ret => {
      const returnDate = parseISO(ret.returnDate!);
      const { key } = getTimeKey(returnDate, timeGrouping);
      
      const row = dataMap.get(key);
      if (!row) return;
      
      row.returnAmount += ret.totalRefund || 0;
    });
    
    // Calculate derived fields
    dataMap.forEach(row => {
      row.revenue = row.productAmount - row.returnAmount;
      row.grossProfit = row.revenue - (row.costOfGoods || 0);
    });
    
    // Convert to array and sort
    const data = Array.from(dataMap.values());
    
    // Calculate summary
    const summary: SalesReportSummary = {
      orderCount: data.reduce((sum, r) => sum + r.orderCount, 0),
      productAmount: data.reduce((sum, r) => sum + r.productAmount, 0),
      returnAmount: data.reduce((sum, r) => sum + r.returnAmount, 0),
      taxAmount: data.reduce((sum, r) => sum + r.taxAmount, 0),
      shippingFee: data.reduce((sum, r) => sum + r.shippingFee, 0),
      revenue: data.reduce((sum, r) => sum + r.revenue, 0),
      grossProfit: data.reduce((sum, r) => sum + r.grossProfit, 0),
    };
    
    return { data, summary };
  }, [orders, returns, dateRange, timeGrouping, filters, findProductById]);
}

// Hook: Báo cáo bán hàng theo nhân viên
export function useSalesEmployeeReport(
  dateRange: ReportDateRange,
  filters?: {
    branchIds?: SystemId[];
  }
) {
  const { data: orders } = useOrderStore();
  const { data: employees } = useEmployeeStore();
  const { findById: findProductById } = useProductStore();
  const { data: returns } = useSalesReturnStore();
  
  return React.useMemo(() => {
    const start = parseISO(dateRange.from);
    const end = parseISO(dateRange.to);
    
    // Filter orders
    const filteredOrders = orders.filter(order => {
      if (order.status !== 'Hoàn thành') return false;
      const orderDate = order.orderDate ? parseISO(order.orderDate) : null;
      if (!orderDate || !isWithinInterval(orderDate, { start, end })) return false;
      if (filters?.branchIds?.length && !filters.branchIds.includes(order.branchSystemId as SystemId)) return false;
      return true;
    });
    
    // Aggregate by employee
    const employeeMap = new Map<string, SalesEmployeeReportRow>();
    
    filteredOrders.forEach(order => {
      const empId = order.assigneeSystemId || 'unknown';
      const employee = employees.find(e => e.systemId === empId);
      
      if (!employeeMap.has(empId)) {
        employeeMap.set(empId, {
          employeeSystemId: empId as SystemId,
          employeeName: employee?.fullName || order.salesperson || 'Không xác định',
          employeeCode: employee?.id,
          branchName: order.branchName,
          orderCount: 0,
          productAmount: 0,
          returnAmount: 0,
          revenue: 0,
          grossProfit: 0,
        });
      }
      
      const row = employeeMap.get(empId)!;
      const costOfGoods = order.lineItems.reduce((sum, item) => {
        const product = findProductById(item.productSystemId);
        return sum + ((product?.costPrice || 0) * item.quantity);
      }, 0);
      
      row.orderCount += 1;
      row.productAmount += order.subtotal || 0;
      row.revenue = row.productAmount - row.returnAmount;
      row.grossProfit = row.revenue - costOfGoods;
    });
    
    const data = Array.from(employeeMap.values()).sort((a, b) => b.revenue - a.revenue);
    
    const summary: SalesReportSummary = {
      orderCount: data.reduce((sum, r) => sum + r.orderCount, 0),
      productAmount: data.reduce((sum, r) => sum + r.productAmount, 0),
      returnAmount: data.reduce((sum, r) => sum + r.returnAmount, 0),
      taxAmount: 0,
      shippingFee: 0,
      revenue: data.reduce((sum, r) => sum + r.revenue, 0),
      grossProfit: data.reduce((sum, r) => sum + r.grossProfit, 0),
    };
    
    return { data, summary };
  }, [orders, employees, returns, dateRange, filters, findProductById]);
}

// Hook: Báo cáo bán hàng theo sản phẩm
export function useSalesProductReport(
  dateRange: ReportDateRange,
  filters?: {
    branchIds?: SystemId[];
    categoryIds?: SystemId[];
  }
) {
  const { data: orders } = useOrderStore();
  const { data: products, findById: findProductById } = useProductStore();
  
  return React.useMemo(() => {
    const start = parseISO(dateRange.from);
    const end = parseISO(dateRange.to);
    
    // Filter orders
    const filteredOrders = orders.filter(order => {
      if (order.status !== 'Hoàn thành') return false;
      const orderDate = order.orderDate ? parseISO(order.orderDate) : null;
      if (!orderDate || !isWithinInterval(orderDate, { start, end })) return false;
      if (filters?.branchIds?.length && !filters.branchIds.includes(order.branchSystemId as SystemId)) return false;
      return true;
    });
    
    // Aggregate by product
    const productMap = new Map<string, SalesProductReportRow>();
    
    filteredOrders.forEach(order => {
      order.lineItems.forEach(item => {
        const prodId = item.productSystemId;
        const product = findProductById(prodId);
        
        // Category filter
        if (filters?.categoryIds?.length && product?.categorySystemId && 
            !filters.categoryIds.includes(product.categorySystemId)) {
          return;
        }
        
        if (!productMap.has(prodId)) {
          productMap.set(prodId, {
            productSystemId: prodId as SystemId,
            productName: product?.name || item.productName || 'Unknown',
            productCode: product?.sku,
            sku: product?.sku,
            categoryName: product?.categories?.[0],
            brandName: product?.brandSystemId ? useBrandStore.getState().findById(product.brandSystemId)?.name : undefined,
            quantitySold: 0,
            quantityReturned: 0,
            netQuantity: 0,
            productAmount: 0,
            returnAmount: 0,
            revenue: 0,
            grossProfit: 0,
            averagePrice: 0,
          });
        }
        
        const row = productMap.get(prodId)!;
        const costPrice = product?.costPrice || 0;
        const itemAmount = item.quantity * item.unitPrice;
        
        row.quantitySold += item.quantity;
        row.productAmount += itemAmount;
        row.grossProfit += itemAmount - (costPrice * item.quantity);
      });
    });
    
    // Calculate derived fields
    productMap.forEach(row => {
      row.netQuantity = row.quantitySold - row.quantityReturned;
      row.revenue = row.productAmount - row.returnAmount;
      row.averagePrice = row.quantitySold > 0 ? row.productAmount / row.quantitySold : 0;
    });
    
    const data = Array.from(productMap.values()).sort((a, b) => b.revenue - a.revenue);
    
    const summary: SalesReportSummary = {
      orderCount: filteredOrders.length,
      productAmount: data.reduce((sum, r) => sum + r.productAmount, 0),
      returnAmount: data.reduce((sum, r) => sum + r.returnAmount, 0),
      taxAmount: 0,
      shippingFee: 0,
      revenue: data.reduce((sum, r) => sum + r.revenue, 0),
      grossProfit: data.reduce((sum, r) => sum + r.grossProfit, 0),
    };
    
    return { data, summary };
  }, [orders, products, dateRange, filters, findProductById]);
}

// Hook: Báo cáo bán hàng theo chi nhánh
export function useSalesBranchReport(dateRange: ReportDateRange) {
  const { data: orders } = useOrderStore();
  const { data: branches } = useBranchStore();
  const { findById: findProductById } = useProductStore();
  
  return React.useMemo(() => {
    const start = parseISO(dateRange.from);
    const end = parseISO(dateRange.to);
    
    // Filter orders
    const filteredOrders = orders.filter(order => {
      if (order.status !== 'Hoàn thành') return false;
      const orderDate = order.orderDate ? parseISO(order.orderDate) : null;
      return orderDate && isWithinInterval(orderDate, { start, end });
    });
    
    // Aggregate by branch
    const branchMap = new Map<string, SalesBranchReportRow>();
    const customersByBranch = new Map<string, Set<string>>();
    
    filteredOrders.forEach(order => {
      const branchId = order.branchSystemId || 'unknown';
      const branch = branches.find(b => b.systemId === branchId);
      
      if (!branchMap.has(branchId)) {
        branchMap.set(branchId, {
          branchSystemId: branchId as SystemId,
          branchName: branch?.name || order.branchName || 'Không xác định',
          branchCode: branch?.id,
          orderCount: 0,
          customerCount: 0,
          productAmount: 0,
          returnAmount: 0,
          taxAmount: 0,
          shippingFee: 0,
          revenue: 0,
          grossProfit: 0,
        });
        customersByBranch.set(branchId, new Set());
      }
      
      const row = branchMap.get(branchId)!;
      const customers = customersByBranch.get(branchId)!;
      
      const costOfGoods = order.lineItems.reduce((sum, item) => {
        const product = findProductById(item.productSystemId);
        return sum + ((product?.costPrice || 0) * item.quantity);
      }, 0);
      
      row.orderCount += 1;
      row.productAmount += order.subtotal || 0;
      row.grossProfit += (order.subtotal || 0) - costOfGoods;
      
      if (order.customerSystemId) {
        customers.add(order.customerSystemId);
      }
    });
    
    // Update customer counts
    branchMap.forEach((row, branchId) => {
      row.customerCount = customersByBranch.get(branchId)?.size || 0;
      row.revenue = row.productAmount - row.returnAmount;
    });
    
    const data = Array.from(branchMap.values()).sort((a, b) => b.revenue - a.revenue);
    
    const summary: SalesReportSummary = {
      orderCount: data.reduce((sum, r) => sum + r.orderCount, 0),
      productAmount: data.reduce((sum, r) => sum + r.productAmount, 0),
      returnAmount: data.reduce((sum, r) => sum + r.returnAmount, 0),
      taxAmount: 0,
      shippingFee: 0,
      revenue: data.reduce((sum, r) => sum + r.revenue, 0),
      grossProfit: data.reduce((sum, r) => sum + r.grossProfit, 0),
    };
    
    return { data, summary };
  }, [orders, branches, dateRange, findProductById]);
}

// Hook: Báo cáo bán hàng theo khách hàng
export function useSalesCustomerReport(
  dateRange: ReportDateRange,
  filters?: {
    branchIds?: SystemId[];
    customerGroupIds?: string[];
  }
) {
  const { data: orders } = useOrderStore();
  const { data: customers } = useCustomerStore();
  const { findById: findProductById } = useProductStore();
  
  return React.useMemo(() => {
    const start = parseISO(dateRange.from);
    const end = parseISO(dateRange.to);
    
    // Filter orders
    const filteredOrders = orders.filter(order => {
      if (order.status !== 'Hoàn thành') return false;
      const orderDate = order.orderDate ? parseISO(order.orderDate) : null;
      if (!orderDate || !isWithinInterval(orderDate, { start, end })) return false;
      if (filters?.branchIds?.length && !filters.branchIds.includes(order.branchSystemId as SystemId)) return false;
      return true;
    });
    
    // Aggregate by customer
    const customerMap = new Map<string, SalesCustomerReportRow>();
    
    filteredOrders.forEach(order => {
      const custId = order.customerSystemId || 'unknown';
      const customer = customers.find(c => c.systemId === custId);
      
      // Customer group filter
      if (filters?.customerGroupIds?.length && customer?.customerGroup && 
          !filters.customerGroupIds.includes(customer.customerGroup)) {
        return;
      }
      
      if (!customerMap.has(custId)) {
        customerMap.set(custId, {
          customerSystemId: custId as SystemId,
          customerName: customer?.name || order.customerName || 'Khách lẻ',
          customerCode: customer?.id,
          customerPhone: customer?.phone,
          customerGroup: customer?.customerGroup,
          orderCount: 0,
          productAmount: 0,
          returnAmount: 0,
          taxAmount: 0,
          shippingFee: 0,
          revenue: 0,
          grossProfit: 0,
          averageOrderValue: 0,
        });
      }
      
      const row = customerMap.get(custId)!;
      const costOfGoods = order.lineItems.reduce((sum, item) => {
        const product = findProductById(item.productSystemId);
        return sum + ((product?.costPrice || 0) * item.quantity);
      }, 0);
      
      row.orderCount += 1;
      row.productAmount += order.subtotal || 0;
      row.grossProfit += (order.subtotal || 0) - costOfGoods;
    });
    
    // Calculate derived fields
    customerMap.forEach(row => {
      row.revenue = row.productAmount - row.returnAmount;
      row.averageOrderValue = row.orderCount > 0 ? row.revenue / row.orderCount : 0;
    });
    
    const data = Array.from(customerMap.values()).sort((a, b) => b.revenue - a.revenue);
    
    const summary: SalesReportSummary = {
      orderCount: data.reduce((sum, r) => sum + r.orderCount, 0),
      productAmount: data.reduce((sum, r) => sum + r.productAmount, 0),
      returnAmount: data.reduce((sum, r) => sum + r.returnAmount, 0),
      taxAmount: 0,
      shippingFee: 0,
      revenue: data.reduce((sum, r) => sum + r.revenue, 0),
      grossProfit: data.reduce((sum, r) => sum + r.grossProfit, 0),
    };
    
    return { data, summary };
  }, [orders, customers, dateRange, filters, findProductById]);
}

export default {
  useSalesTimeReport,
  useSalesEmployeeReport,
  useSalesProductReport,
  useSalesBranchReport,
  useSalesCustomerReport,
};
