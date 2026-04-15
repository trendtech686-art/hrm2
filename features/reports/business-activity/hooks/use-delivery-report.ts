/**
 * Delivery Report Hooks
 * 
 * Hooks tính toán dữ liệu báo cáo giao hàng
 */

import * as React from 'react';
import { format, parseISO, startOfWeek, startOfQuarter, startOfYear, eachDayOfInterval, eachWeekOfInterval, eachMonthOfInterval, isWithinInterval, differenceInHours } from 'date-fns';
import { vi } from 'date-fns/locale';
import { useAllEmployees } from '@/features/employees/hooks/use-all-employees';
import { useAllBranches } from '@/features/settings/branches/hooks/use-all-branches';
import { useAllCustomers } from '@/features/customers/hooks/use-all-customers';
import { useShipmentsByDateRange } from './use-delivery-report-data';
import { useCompletedOrdersByDateRange } from './use-report-data';
import type {
  ReportDateRange,
  TimeGrouping,
  DeliveryTimeReportRow,
  DeliveryEmployeeReportRow,
  DeliveryShipmentReportRow,
  DeliveryCarrierReportRow,
  DeliveryBranchReportRow,
  DeliveryCustomerReportRow,
  DeliveryChannelReportRow,
  DeliverySourceReportRow,
} from '../types';
import type { SystemId } from '@/lib/id-types';

// Helper: Get time key
function getTimeKey(date: Date, grouping: TimeGrouping): { key: string; label: string } {
  switch (grouping) {
    case 'day':
      return { key: format(date, 'yyyy-MM-dd'), label: format(date, 'dd/MM', { locale: vi }) };
    case 'week': {
      const weekStart = startOfWeek(date, { weekStartsOn: 1 });
      return { key: format(weekStart, 'yyyy-ww'), label: `T${format(weekStart, 'w')} (${format(weekStart, 'dd/MM')})` };
    }
    case 'month':
      return { key: format(date, 'yyyy-MM'), label: format(date, 'MM/yyyy', { locale: vi }) };
    case 'quarter': {
      const quarter = Math.ceil((date.getMonth() + 1) / 3);
      return { key: `${date.getFullYear()}-Q${quarter}`, label: `Q${quarter}/${date.getFullYear()}` };
    }
    case 'year':
      return { key: format(date, 'yyyy'), label: format(date, 'yyyy') };
    default:
      return { key: format(date, 'yyyy-MM-dd'), label: format(date, 'dd/MM', { locale: vi }) };
  }
}

function generateTimePeriods(dateRange: ReportDateRange, grouping: TimeGrouping) {
  const start = parseISO(dateRange.from);
  const end = parseISO(dateRange.to);
  let dates: Date[] = [];

  switch (grouping) {
    case 'day': dates = eachDayOfInterval({ start, end }); break;
    case 'week': dates = eachWeekOfInterval({ start, end }, { weekStartsOn: 1 }); break;
    case 'month': dates = eachMonthOfInterval({ start, end }); break;
    case 'quarter': {
      let current = startOfQuarter(start);
      while (current <= end) { dates.push(current); current = new Date(current.getFullYear(), current.getMonth() + 3, 1); }
      break;
    }
    case 'year': {
      let currentYear = startOfYear(start);
      while (currentYear <= end) { dates.push(currentYear); currentYear = new Date(currentYear.getFullYear() + 1, 0, 1); }
      break;
    }
  }
  return dates.map(d => getTimeKey(d, grouping));
}

// Shipment status helpers
function isDelivered(status: string | null | undefined): boolean {
  return status === 'Đã giao hàng' || status === 'delivered' || status === 'DELIVERED';
}
function isPending(status: string | null | undefined): boolean {
  return status === 'Chờ lấy hàng' || status === 'Đang giao hàng' || status === 'pending' || status === 'PENDING' || status === 'Đã tiếp nhận';
}
function isFailed(status: string | null | undefined): boolean {
  return status === 'Giao hàng thất bại' || status === 'failed' || status === 'FAILED';
}
function isReturned(status: string | null | undefined): boolean {
  return status === 'Đã trả hàng' || status === 'returned' || status === 'RETURNED' || status === 'Đã hoàn';
}

// Hook: Giao hàng theo thời gian
export function useDeliveryTimeReport(
  dateRange: ReportDateRange,
  timeGrouping: TimeGrouping = 'day',
  _filters?: { branchIds?: SystemId[] }
) {
  const { data: shipments = [] } = useShipmentsByDateRange(dateRange);

  return React.useMemo(() => {
    const start = parseISO(dateRange.from);
    const end = parseISO(dateRange.to);

    const filtered = shipments.filter(s => {
      const date = s.createdAt ? parseISO(s.createdAt) : null;
      if (!date || !isWithinInterval(date, { start, end })) return false;
      return true;
    });

    const periods = generateTimePeriods(dateRange, timeGrouping);
    const dataMap = new Map<string, DeliveryTimeReportRow>();

    periods.forEach(period => {
      dataMap.set(period.key, {
        key: period.key,
        label: period.label,
        totalShipments: 0,
        deliveredCount: 0,
        pendingCount: 0,
        failedCount: 0,
        returnedCount: 0,
        totalAmount: 0,
        codAmount: 0,
        shippingFee: 0,
        deliveryRate: 0,
      });
    });

    filtered.forEach(shipment => {
      const date = parseISO(shipment.createdAt!);
      const { key } = getTimeKey(date, timeGrouping);
      const row = dataMap.get(key);
      if (!row) return;

      row.totalShipments += 1;
      if (isDelivered(shipment.deliveryStatus)) row.deliveredCount += 1;
      else if (isPending(shipment.deliveryStatus)) row.pendingCount += 1;
      else if (isFailed(shipment.deliveryStatus)) row.failedCount += 1;
      if (isReturned(shipment.deliveryStatus)) row.returnedCount += 1;

      row.codAmount += shipment.codAmount || 0;
      row.shippingFee += shipment.shippingFeeToPartner || 0;
      row.totalAmount += (shipment.codAmount || 0) + (shipment.shippingFeeToPartner || 0);

      if (shipment.createdAt && shipment.deliveredAt) {
        const deliveryHours = differenceInHours(parseISO(shipment.deliveredAt), parseISO(shipment.createdAt));
        row.averageDeliveryTime = ((row.averageDeliveryTime || 0) * (row.deliveredCount - 1) + deliveryHours) / row.deliveredCount;
      }
    });

    dataMap.forEach(row => {
      row.deliveryRate = row.totalShipments > 0 ? (row.deliveredCount / row.totalShipments) * 100 : 0;
    });

    const data = Array.from(dataMap.values());

    const summary = {
      totalShipments: data.reduce((sum, r) => sum + r.totalShipments, 0),
      deliveredCount: data.reduce((sum, r) => sum + r.deliveredCount, 0),
      pendingCount: data.reduce((sum, r) => sum + r.pendingCount, 0),
      failedCount: data.reduce((sum, r) => sum + r.failedCount, 0),
      returnedCount: data.reduce((sum, r) => sum + r.returnedCount, 0),
      totalAmount: data.reduce((sum, r) => sum + r.totalAmount, 0),
      codAmount: data.reduce((sum, r) => sum + r.codAmount, 0),
      shippingFee: data.reduce((sum, r) => sum + r.shippingFee, 0),
      deliveryRate: 0,
    };
    summary.deliveryRate = summary.totalShipments > 0 ? (summary.deliveredCount / summary.totalShipments) * 100 : 0;

    return { data, summary };
  }, [shipments, dateRange, timeGrouping]);
}

// Hook: Giao hàng theo nhân viên
export function useDeliveryEmployeeReport(
  dateRange: ReportDateRange,
  _filters?: { branchIds?: SystemId[] }
) {
  const { data: shipments = [] } = useShipmentsByDateRange(dateRange);
  const { data: employees } = useAllEmployees();

  return React.useMemo(() => {
    const start = parseISO(dateRange.from);
    const end = parseISO(dateRange.to);

    const filtered = shipments.filter(s => {
      const date = s.createdAt ? parseISO(s.createdAt) : null;
      return date && isWithinInterval(date, { start, end });
    });

    const employeeMap = new Map<string, DeliveryEmployeeReportRow>();

    filtered.forEach(shipment => {
      const empName = shipment.creatorEmployeeName || 'Không xác định';
      const empKey = empName;

      if (!employeeMap.has(empKey)) {
        const employee = employees.find(e => e.fullName === empName);
        employeeMap.set(empKey, {
          employeeSystemId: (employee?.systemId || empKey) as SystemId,
          employeeName: empName,
          totalShipments: 0,
          deliveredCount: 0,
          failedCount: 0,
          deliveryRate: 0,
          totalAmount: 0,
        });
      }

      const row = employeeMap.get(empKey)!;
      row.totalShipments += 1;
      if (isDelivered(shipment.deliveryStatus)) row.deliveredCount += 1;
      if (isFailed(shipment.deliveryStatus)) row.failedCount += 1;
      row.totalAmount += (shipment.codAmount || 0);
    });

    employeeMap.forEach(row => {
      row.deliveryRate = row.totalShipments > 0 ? (row.deliveredCount / row.totalShipments) * 100 : 0;
    });

    const data = Array.from(employeeMap.values()).sort((a, b) => b.totalShipments - a.totalShipments);
    return { data };
  }, [shipments, employees, dateRange]);
}

// Hook: Giao hàng theo vận đơn (chi tiết)
export function useDeliveryShipmentReport(
  dateRange: ReportDateRange,
  filters?: { branchIds?: SystemId[]; carrierIds?: string[] }
) {
  const { data: shipments = [] } = useShipmentsByDateRange(dateRange);

  return React.useMemo(() => {
    const start = parseISO(dateRange.from);
    const end = parseISO(dateRange.to);

    const filtered = shipments.filter(s => {
      const date = s.createdAt ? parseISO(s.createdAt) : null;
      if (!date || !isWithinInterval(date, { start, end })) return false;
      if (filters?.carrierIds?.length && s.carrier && !filters.carrierIds.includes(s.carrier)) return false;
      return true;
    });

    const data: DeliveryShipmentReportRow[] = filtered.map(s => ({
      shipmentSystemId: s.systemId as SystemId,
      shipmentId: s.id || s.trackingCode || '',
      orderId: s.orderId || '',
      carrierName: s.carrier || undefined,
      status: s.deliveryStatus || 'Không xác định',
      createdDate: s.createdAt || '',
      deliveredDate: s.deliveredAt || undefined,
      codAmount: s.codAmount || 0,
      shippingFee: s.shippingFeeToPartner || 0,
      customerName: s.customerName || undefined,
      deliveryAddress: s.recipientAddress || undefined,
    }));

    return { data };
  }, [shipments, dateRange, filters]);
}

// Hook: Giao hàng theo đối tác vận chuyển
export function useDeliveryCarrierReport(
  dateRange: ReportDateRange,
) {
  const { data: shipments = [] } = useShipmentsByDateRange(dateRange);

  return React.useMemo(() => {
    const start = parseISO(dateRange.from);
    const end = parseISO(dateRange.to);

    const filtered = shipments.filter(s => {
      const date = s.createdAt ? parseISO(s.createdAt) : null;
      return date && isWithinInterval(date, { start, end });
    });

    const carrierMap = new Map<string, DeliveryCarrierReportRow>();

    filtered.forEach(shipment => {
      const carrierId = shipment.carrier || 'self';
      const carrierName = shipment.carrier || 'Tự giao';

      if (!carrierMap.has(carrierId)) {
        carrierMap.set(carrierId, {
          carrierSystemId: carrierId as SystemId,
          carrierName,
          totalShipments: 0,
          deliveredCount: 0,
          pendingCount: 0,
          failedCount: 0,
          deliveryRate: 0,
          totalCod: 0,
          totalShippingFee: 0,
        });
      }

      const row = carrierMap.get(carrierId)!;
      row.totalShipments += 1;
      if (isDelivered(shipment.deliveryStatus)) row.deliveredCount += 1;
      else if (isPending(shipment.deliveryStatus)) row.pendingCount += 1;
      if (isFailed(shipment.deliveryStatus)) row.failedCount += 1;
      row.totalCod += shipment.codAmount || 0;
      row.totalShippingFee += shipment.shippingFeeToPartner || 0;

      if (shipment.createdAt && shipment.deliveredAt) {
        const hours = differenceInHours(parseISO(shipment.deliveredAt), parseISO(shipment.createdAt));
        row.averageDeliveryTime = ((row.averageDeliveryTime || 0) * (row.deliveredCount - 1) + hours) / row.deliveredCount;
      }
    });

    carrierMap.forEach(row => {
      row.deliveryRate = row.totalShipments > 0 ? (row.deliveredCount / row.totalShipments) * 100 : 0;
    });

    const data = Array.from(carrierMap.values()).sort((a, b) => b.totalShipments - a.totalShipments);
    return { data };
  }, [shipments, dateRange]);
}

// Hook: Giao hàng theo chi nhánh
export function useDeliveryBranchReport(dateRange: ReportDateRange) {
  const { data: shipments = [] } = useShipmentsByDateRange(dateRange);
  const { data: branches } = useAllBranches();

  return React.useMemo(() => {
    const start = parseISO(dateRange.from);
    const end = parseISO(dateRange.to);

    const filtered = shipments.filter(s => {
      const date = s.createdAt ? parseISO(s.createdAt) : null;
      return date && isWithinInterval(date, { start, end });
    });

    const branchMap = new Map<string, DeliveryBranchReportRow>();

    filtered.forEach(shipment => {
      const branchName = shipment.branchName || 'Không xác định';
      const branchId = branchName;

      if (!branchMap.has(branchId)) {
        const branch = branches.find(b => b.name === branchName);
        branchMap.set(branchId, {
          branchSystemId: (branch?.systemId || branchId) as SystemId,
          branchName,
          totalShipments: 0,
          deliveredCount: 0,
          failedCount: 0,
          deliveryRate: 0,
          totalAmount: 0,
        });
      }

      const row = branchMap.get(branchId)!;
      row.totalShipments += 1;
      if (isDelivered(shipment.deliveryStatus)) row.deliveredCount += 1;
      if (isFailed(shipment.deliveryStatus)) row.failedCount += 1;
      row.totalAmount += shipment.codAmount || 0;
    });

    branchMap.forEach(row => {
      row.deliveryRate = row.totalShipments > 0 ? (row.deliveredCount / row.totalShipments) * 100 : 0;
    });

    const data = Array.from(branchMap.values()).sort((a, b) => b.totalShipments - a.totalShipments);
    return { data };
  }, [shipments, branches, dateRange]);
}

// Hook: Giao hàng theo khách hàng
export function useDeliveryCustomerReport(
  dateRange: ReportDateRange,
  _filters?: { branchIds?: SystemId[] }
) {
  const { data: shipments = [] } = useShipmentsByDateRange(dateRange);
  const { data: customers = [] } = useAllCustomers();

  return React.useMemo(() => {
    const start = parseISO(dateRange.from);
    const end = parseISO(dateRange.to);

    const filtered = shipments.filter(s => {
      const date = s.createdAt ? parseISO(s.createdAt) : null;
      return date && isWithinInterval(date, { start, end });
    });

    const customerMap = new Map<string, DeliveryCustomerReportRow>();

    filtered.forEach(shipment => {
      const custName = shipment.customerName || 'Không xác định';
      const custKey = custName;

      if (!customerMap.has(custKey)) {
        const customer = customers.find(c => c.name === custName);
        customerMap.set(custKey, {
          customerSystemId: (customer?.systemId || custKey) as SystemId,
          customerName: custName,
          totalShipments: 0,
          deliveredCount: 0,
          failedCount: 0,
          returnedCount: 0,
          totalAmount: 0,
        });
      }

      const row = customerMap.get(custKey)!;
      row.totalShipments += 1;
      if (isDelivered(shipment.deliveryStatus)) row.deliveredCount += 1;
      if (isFailed(shipment.deliveryStatus)) row.failedCount += 1;
      if (isReturned(shipment.deliveryStatus)) row.returnedCount += 1;
      row.totalAmount += shipment.codAmount || 0;
    });

    const data = Array.from(customerMap.values()).sort((a, b) => b.totalShipments - a.totalShipments);
    return { data };
  }, [shipments, customers, dateRange]);
}

// Hook: Giao hàng theo kênh bán hàng (dùng source từ Order)
export function useDeliveryChannelReport(dateRange: ReportDateRange) {
  const { data: shipments = [] } = useShipmentsByDateRange(dateRange);

  return React.useMemo(() => {
    const start = parseISO(dateRange.from);
    const end = parseISO(dateRange.to);

    const filtered = shipments.filter(s => {
      const date = s.createdAt ? parseISO(s.createdAt) : null;
      return date && isWithinInterval(date, { start, end });
    });

    // Group by carrier as channel proxy
    const channelMap = new Map<string, DeliveryChannelReportRow>();

    filtered.forEach(shipment => {
      const channelId = shipment.carrier || 'direct';
      const channelName = shipment.carrier || 'Giao trực tiếp';

      if (!channelMap.has(channelId)) {
        channelMap.set(channelId, {
          channelId,
          channelName,
          totalShipments: 0,
          deliveredCount: 0,
          failedCount: 0,
          deliveryRate: 0,
          totalAmount: 0,
        });
      }

      const row = channelMap.get(channelId)!;
      row.totalShipments += 1;
      if (isDelivered(shipment.deliveryStatus)) row.deliveredCount += 1;
      if (isFailed(shipment.deliveryStatus)) row.failedCount += 1;
      row.totalAmount += shipment.codAmount || 0;
    });

    channelMap.forEach(row => {
      row.deliveryRate = row.totalShipments > 0 ? (row.deliveredCount / row.totalShipments) * 100 : 0;
    });

    const data = Array.from(channelMap.values()).sort((a, b) => b.totalShipments - a.totalShipments);
    return { data };
  }, [shipments, dateRange]);
}

// Hook: Giao hàng theo nguồn bán hàng (lấy source từ Order)
export function useDeliverySourceReport(dateRange: ReportDateRange) {
  const { data: shipments = [] } = useShipmentsByDateRange(dateRange);
  const { data: orders = [] } = useCompletedOrdersByDateRange(dateRange);

  return React.useMemo(() => {
    const start = parseISO(dateRange.from);
    const end = parseISO(dateRange.to);

    const filtered = shipments.filter(s => {
      const date = s.createdAt ? parseISO(s.createdAt) : null;
      return date && isWithinInterval(date, { start, end });
    });

    // Build order source lookup
    const orderSourceMap = new Map<string, string>();
    orders.forEach(order => {
      if (order.systemId) {
        orderSourceMap.set(order.systemId, order.source || 'direct');
      }
    });

    const sourceMap = new Map<string, DeliverySourceReportRow>();

    filtered.forEach(shipment => {
      const sourceId = orderSourceMap.get(shipment.orderSystemId) || 'unknown';
      const sourceName = sourceId === 'direct' ? 'Trực tiếp' : sourceId === 'unknown' ? 'Không xác định' : sourceId;

      if (!sourceMap.has(sourceId)) {
        sourceMap.set(sourceId, {
          sourceId,
          sourceName,
          totalShipments: 0,
          deliveredCount: 0,
          failedCount: 0,
          deliveryRate: 0,
          totalAmount: 0,
        });
      }

      const row = sourceMap.get(sourceId)!;
      row.totalShipments += 1;
      if (isDelivered(shipment.deliveryStatus)) row.deliveredCount += 1;
      if (isFailed(shipment.deliveryStatus)) row.failedCount += 1;
      row.totalAmount += shipment.codAmount || 0;
    });

    sourceMap.forEach(row => {
      row.deliveryRate = row.totalShipments > 0 ? (row.deliveredCount / row.totalShipments) * 100 : 0;
    });

    const data = Array.from(sourceMap.values()).sort((a, b) => b.totalShipments - a.totalShipments);
    return { data };
  }, [shipments, orders, dateRange]);
}
