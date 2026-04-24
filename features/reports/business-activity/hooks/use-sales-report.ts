/**
 * Sales Report Hooks
 *
 * Hooks để tính toán dữ liệu báo cáo bán hàng
 */

import { useQuery } from '@tanstack/react-query';
import {
  fetchSalesByDimension,
  fetchSalesTimeSeries,
} from '@/features/reports/api/reports-api';
import type {
  ReportDateRange,
  TimeGrouping,
  SalesEmployeeReportRow,
  SalesProductReportRow,
  SalesBranchReportRow,
  SalesCustomerReportRow,
  SalesSourceReportRow,
  SalesCustomerGroupReportRow,
  SalesTaxReportRow,
  SalesReportSummary,
} from '../types';
import type { SystemId } from '@/lib/id-types';
import { REPORTS_QUERY_GC_MS, REPORTS_QUERY_STALE_MS } from '../lib/reports-query-config';

const EMPTY_SALES_SUMMARY: SalesReportSummary = {
  orderCount: 0,
  productAmount: 0,
  returnAmount: 0,
  taxAmount: 0,
  shippingFee: 0,
  revenue: 0,
  grossProfit: 0,
};

// Hook: Báo cáo bán hàng theo thời gian — dữ liệu tổng hợp trên server (SQL), không fetch toàn bộ orders
export function useSalesTimeReport(
  dateRange: ReportDateRange,
  timeGrouping: TimeGrouping = 'day',
  filters?: {
    branchIds?: SystemId[];
    employeeIds?: SystemId[];
    sourceIds?: string[];
  },
) {
  const query = useQuery({
    queryKey: [
      'reports',
      'sales-time-series',
      dateRange.from,
      dateRange.to,
      timeGrouping,
      filters?.branchIds,
      filters?.employeeIds,
      filters?.sourceIds,
    ],
    queryFn: () =>
      fetchSalesTimeSeries({
        dateRange,
        grouping: timeGrouping,
        branchIds: filters?.branchIds,
        employeeIds: filters?.employeeIds,
        sourceIds: filters?.sourceIds,
      }),
    enabled: Boolean(dateRange.from && dateRange.to),
    // Short stale time so filter changes trigger fresh fetch
    staleTime: 30 * 1000,
    gcTime: REPORTS_QUERY_GC_MS,
    refetchOnMount: true,
  });

  return {
    data: query.data?.data ?? [],
    summary: query.data?.summary ?? EMPTY_SALES_SUMMARY,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
  };
}

// Hook: Báo cáo bán hàng theo nhân viên
export function useSalesEmployeeReport(
  dateRange: ReportDateRange,
  filters?: {
    branchIds?: SystemId[];
  },
) {
  const query = useQuery({
    queryKey: [
      'reports',
      'sales-by-dimension',
      'employee',
      dateRange.from,
      dateRange.to,
      filters?.branchIds,
    ],
    queryFn: () =>
      fetchSalesByDimension({
        dimension: 'employee',
        dateRange,
        branchIds: filters?.branchIds,
      }),
    enabled: Boolean(dateRange.from && dateRange.to),
    staleTime: REPORTS_QUERY_STALE_MS,
    gcTime: REPORTS_QUERY_GC_MS,
  });

  return {
    data: (query.data?.data ?? []) as SalesEmployeeReportRow[],
    summary: query.data?.summary ?? EMPTY_SALES_SUMMARY,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
  };
}

// Hook: Báo cáo bán hàng theo sản phẩm
export function useSalesProductReport(
  dateRange: ReportDateRange,
  filters?: {
    branchIds?: SystemId[];
    categoryIds?: SystemId[];
  },
) {
  const query = useQuery({
    queryKey: [
      'reports',
      'sales-by-dimension',
      'product',
      dateRange.from,
      dateRange.to,
      filters?.branchIds,
      filters?.categoryIds,
    ],
    queryFn: () =>
      fetchSalesByDimension({
        dimension: 'product',
        dateRange,
        branchIds: filters?.branchIds,
        categoryIds: filters?.categoryIds,
      }),
    enabled: Boolean(dateRange.from && dateRange.to),
    staleTime: REPORTS_QUERY_STALE_MS,
    gcTime: REPORTS_QUERY_GC_MS,
  });

  return {
    data: (query.data?.data ?? []) as SalesProductReportRow[],
    summary: query.data?.summary ?? EMPTY_SALES_SUMMARY,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
  };
}

// Hook: Báo cáo bán hàng theo chi nhánh
export function useSalesBranchReport(dateRange: ReportDateRange) {
  const query = useQuery({
    queryKey: ['reports', 'sales-by-dimension', 'branch', dateRange.from, dateRange.to],
    queryFn: () =>
      fetchSalesByDimension({
        dimension: 'branch',
        dateRange,
      }),
    enabled: Boolean(dateRange.from && dateRange.to),
    staleTime: REPORTS_QUERY_STALE_MS,
    gcTime: REPORTS_QUERY_GC_MS,
  });

  return {
    data: (query.data?.data ?? []) as SalesBranchReportRow[],
    summary: query.data?.summary ?? EMPTY_SALES_SUMMARY,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
  };
}

// Hook: Báo cáo bán hàng theo khách hàng
export function useSalesCustomerReport(
  dateRange: ReportDateRange,
  filters?: {
    branchIds?: SystemId[];
    customerGroupIds?: string[];
  },
) {
  const query = useQuery({
    queryKey: [
      'reports',
      'sales-by-dimension',
      'customer',
      dateRange.from,
      dateRange.to,
      filters?.branchIds,
      filters?.customerGroupIds,
    ],
    queryFn: () =>
      fetchSalesByDimension({
        dimension: 'customer',
        dateRange,
        branchIds: filters?.branchIds,
        customerGroupIds: filters?.customerGroupIds,
      }),
    enabled: Boolean(dateRange.from && dateRange.to),
    staleTime: REPORTS_QUERY_STALE_MS,
    gcTime: REPORTS_QUERY_GC_MS,
  });

  return {
    data: (query.data?.data ?? []) as SalesCustomerReportRow[],
    summary: query.data?.summary ?? EMPTY_SALES_SUMMARY,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
  };
}

// Hook: Báo cáo bán hàng theo nguồn
export function useSalesSourceReport(
  dateRange: ReportDateRange,
  filters?: {
    branchIds?: SystemId[];
  },
) {
  const query = useQuery({
    queryKey: [
      'reports',
      'sales-by-dimension',
      'source',
      dateRange.from,
      dateRange.to,
      filters?.branchIds,
    ],
    queryFn: () =>
      fetchSalesByDimension({
        dimension: 'source',
        dateRange,
        branchIds: filters?.branchIds,
      }),
    enabled: Boolean(dateRange.from && dateRange.to),
    staleTime: REPORTS_QUERY_STALE_MS,
    gcTime: REPORTS_QUERY_GC_MS,
  });

  return {
    data: (query.data?.data ?? []) as SalesSourceReportRow[],
    summary: query.data?.summary ?? EMPTY_SALES_SUMMARY,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
  };
}

// Hook: Báo cáo bán hàng theo nhóm khách hàng
export function useSalesCustomerGroupReport(
  dateRange: ReportDateRange,
  filters?: {
    branchIds?: SystemId[];
    customerGroupIds?: string[];
  },
) {
  const query = useQuery({
    queryKey: [
      'reports',
      'sales-by-dimension',
      'customer_group',
      dateRange.from,
      dateRange.to,
      filters?.branchIds,
      filters?.customerGroupIds,
    ],
    queryFn: () =>
      fetchSalesByDimension({
        dimension: 'customer_group',
        dateRange,
        branchIds: filters?.branchIds,
        customerGroupIds: filters?.customerGroupIds,
      }),
    enabled: Boolean(dateRange.from && dateRange.to),
    staleTime: REPORTS_QUERY_STALE_MS,
    gcTime: REPORTS_QUERY_GC_MS,
  });

  return {
    data: (query.data?.data ?? []) as SalesCustomerGroupReportRow[],
    summary: query.data?.summary ?? EMPTY_SALES_SUMMARY,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
  };
}

// Hook: Báo cáo bán hàng theo thuế
export function useSalesTaxReport(
  dateRange: ReportDateRange,
  filters?: {
    branchIds?: SystemId[];
  },
) {
  const query = useQuery({
    queryKey: [
      'reports',
      'sales-by-dimension',
      'tax',
      dateRange.from,
      dateRange.to,
      filters?.branchIds,
    ],
    queryFn: () =>
      fetchSalesByDimension({
        dimension: 'tax',
        dateRange,
        branchIds: filters?.branchIds,
      }),
    enabled: Boolean(dateRange.from && dateRange.to),
    staleTime: REPORTS_QUERY_STALE_MS,
    gcTime: REPORTS_QUERY_GC_MS,
  });

  return {
    data: (query.data?.data ?? []) as SalesTaxReportRow[],
    summary: query.data?.summary ?? EMPTY_SALES_SUMMARY,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
  };
}

export default {
  useSalesTimeReport,
  useSalesEmployeeReport,
  useSalesProductReport,
  useSalesBranchReport,
  useSalesCustomerReport,
  useSalesSourceReport,
  useSalesCustomerGroupReport,
  useSalesTaxReport,
};
