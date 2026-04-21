/**
 * Payment Report Hooks
 *
 * Dữ liệu tổng hợp trên server (GET /api/reports/payments-aggregate).
 */

import { useQuery } from '@tanstack/react-query';
import {
  fetchPaymentsByBranch,
  fetchPaymentsByMethod,
  fetchPaymentsTimeSeries,
} from '@/features/reports/api/reports-api';
import type {
  ReportDateRange,
  TimeGrouping,
  PaymentTimeReportRow,
  PaymentMethodReportRow,
  PaymentBranchReportRow,
} from '../types';
import { REPORTS_QUERY_GC_MS, REPORTS_QUERY_STALE_MS } from '../lib/reports-query-config';

const EMPTY_TIME_SUMMARY = {
  transactionCount: 0,
  totalAmount: 0,
  averageAmount: 0,
};

const EMPTY_METHOD_SUMMARY = EMPTY_TIME_SUMMARY;

// Hook: Thanh toán theo thời gian
export function usePaymentTimeReport(
  dateRange: ReportDateRange,
  timeGrouping: TimeGrouping = 'day',
) {
  const query = useQuery({
    queryKey: [
      'reports',
      'payments-aggregate',
      'time-series',
      dateRange.from,
      dateRange.to,
      timeGrouping,
    ],
    queryFn: () => fetchPaymentsTimeSeries({ dateRange, grouping: timeGrouping }),
    enabled: Boolean(dateRange.from && dateRange.to),
    staleTime: REPORTS_QUERY_STALE_MS,
    gcTime: REPORTS_QUERY_GC_MS,
  });

  return {
    data: (query.data?.data ?? []) as PaymentTimeReportRow[],
    summary: query.data?.summary ?? EMPTY_TIME_SUMMARY,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
  };
}

// Hook: Thanh toán theo phương thức
export function usePaymentMethodReport(dateRange: ReportDateRange) {
  const query = useQuery({
    queryKey: ['reports', 'payments-aggregate', 'method', dateRange.from, dateRange.to],
    queryFn: () => fetchPaymentsByMethod(dateRange),
    enabled: Boolean(dateRange.from && dateRange.to),
    staleTime: REPORTS_QUERY_STALE_MS,
    gcTime: REPORTS_QUERY_GC_MS,
  });

  return {
    data: (query.data?.data ?? []) as PaymentMethodReportRow[],
    summary: query.data?.summary ?? EMPTY_METHOD_SUMMARY,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
  };
}

// Hook: Thanh toán theo chi nhánh
export function usePaymentBranchReport(dateRange: ReportDateRange) {
  const query = useQuery({
    queryKey: ['reports', 'payments-aggregate', 'branch', dateRange.from, dateRange.to],
    queryFn: () => fetchPaymentsByBranch(dateRange),
    enabled: Boolean(dateRange.from && dateRange.to),
    staleTime: REPORTS_QUERY_STALE_MS,
    gcTime: REPORTS_QUERY_GC_MS,
  });

  return {
    data: (query.data?.data ?? []) as PaymentBranchReportRow[],
    summary: query.data?.summary ?? EMPTY_METHOD_SUMMARY,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
  };
}
