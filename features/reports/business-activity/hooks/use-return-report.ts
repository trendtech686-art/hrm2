/**
 * Return Report Hooks — GET /api/reports/returns-aggregate
 */

import { useQuery } from '@tanstack/react-query';
import { fetchReturnsOrderList, fetchReturnsProductAggregate } from '@/features/reports/api/reports-api';
import type { ReportDateRange, ReturnOrderReportRow, ReturnProductReportRow } from '../types';
import { REPORTS_QUERY_GC_MS, REPORTS_QUERY_STALE_MS } from '../lib/reports-query-config';

export function useReturnOrderReport(dateRange: ReportDateRange, page = 1, pageSize = 500) {
  const query = useQuery({
    queryKey: ['reports', 'returns-aggregate', 'order-list', dateRange.from, dateRange.to, page, pageSize],
    queryFn: () => fetchReturnsOrderList(dateRange, page, pageSize),
    enabled: Boolean(dateRange.from && dateRange.to),
    staleTime: REPORTS_QUERY_STALE_MS,
    gcTime: REPORTS_QUERY_GC_MS,
  });

  return {
    data: (query.data?.data ?? []) as ReturnOrderReportRow[],
    summary: query.data?.summary ?? {
      totalReturns: 0,
      totalReturnAmount: 0,
      totalRefundAmount: 0,
      totalItems: 0,
    },
    pagination: query.data?.pagination,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
  };
}

export function useReturnProductReport(dateRange: ReportDateRange) {
  const query = useQuery({
    queryKey: ['reports', 'returns-aggregate', 'product', dateRange.from, dateRange.to],
    queryFn: () => fetchReturnsProductAggregate(dateRange),
    enabled: Boolean(dateRange.from && dateRange.to),
    staleTime: REPORTS_QUERY_STALE_MS,
    gcTime: REPORTS_QUERY_GC_MS,
  });

  return {
    data: (query.data?.data ?? []) as ReturnProductReportRow[],
    summary: query.data?.summary ?? {
      totalProducts: 0,
      totalQuantityReturned: 0,
      totalReturnAmount: 0,
    },
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
  };
}
