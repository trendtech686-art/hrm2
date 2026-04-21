/**
 * Filtered data hooks for sales reports
 * 
 * ✅ OPTIMIZED: Fetches only completed orders within date range server-side
 * instead of loading ALL orders and filtering client-side.
 */

import { useQuery } from '@tanstack/react-query';
import { fetchAllPages } from '@/lib/fetch-all-pages';
import { fetchOrders } from '@/features/orders/api/orders-api';
import { fetchSalesReturns } from '@/features/sales-returns/api/sales-returns-api';
import type { ReportDateRange } from '../types';
import { REPORTS_QUERY_GC_MS, REPORTS_QUERY_STALE_MS } from '../lib/reports-query-config';

/**
 * Fetch completed orders within a date range (server-side filtered)
 * Replaces useAllOrders() in report contexts
 */
export function useCompletedOrdersByDateRange(dateRange: ReportDateRange) {
  return useQuery({
    queryKey: ['orders', 'completed', dateRange.from, dateRange.to],
    queryFn: () => fetchAllPages((p) => fetchOrders({
      ...p,
      status: 'COMPLETED',
      startDate: dateRange.from,
      endDate: dateRange.to,
    })),
    staleTime: REPORTS_QUERY_STALE_MS,
    gcTime: REPORTS_QUERY_GC_MS,
    enabled: !!dateRange.from && !!dateRange.to,
  });
}

/**
 * Fetch all orders within a date range (any status, server-side filtered)
 * For reports that need all statuses (e.g., order list report)
 */
export function useOrdersByDateRange(dateRange: ReportDateRange) {
  return useQuery({
    queryKey: ['orders', 'byDateRange', dateRange.from, dateRange.to],
    queryFn: () => fetchAllPages((p) => fetchOrders({
      ...p,
      startDate: dateRange.from,
      endDate: dateRange.to,
    })),
    staleTime: REPORTS_QUERY_STALE_MS,
    gcTime: REPORTS_QUERY_GC_MS,
    enabled: !!dateRange.from && !!dateRange.to,
  });
}

/**
 * Fetch all completed orders (no date range filter)
 * For pages that display all completed orders without date filtering
 */
export function useCompletedOrders() {
  return useQuery({
    queryKey: ['orders', 'completed', 'all'],
    queryFn: () => fetchAllPages((p) => fetchOrders({
      ...p,
      status: 'COMPLETED',
    })),
    staleTime: REPORTS_QUERY_STALE_MS,
    gcTime: REPORTS_QUERY_GC_MS,
  });
}

/**
 * Fetch sales returns within a date range (server-side filtered)
 * Replaces useAllSalesReturns() in report contexts
 */
export function useSalesReturnsByDateRange(dateRange: ReportDateRange) {
  return useQuery({
    queryKey: ['salesReturns', 'byDateRange', dateRange.from, dateRange.to],
    queryFn: () => fetchAllPages((p) => fetchSalesReturns({
      ...p,
      startDate: dateRange.from,
      endDate: dateRange.to,
    })),
    staleTime: REPORTS_QUERY_STALE_MS,
    gcTime: REPORTS_QUERY_GC_MS,
    enabled: !!dateRange.from && !!dateRange.to,
  });
}
