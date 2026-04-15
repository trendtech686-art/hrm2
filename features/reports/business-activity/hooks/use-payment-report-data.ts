/**
 * Payment Report Data Hooks
 * 
 * Fetches payment data for payment reports
 */

import { useQuery } from '@tanstack/react-query';
import { fetchAllPages } from '@/lib/fetch-all-pages';
import { fetchPayments } from '@/features/payments/api/payments-api';
import type { ReportDateRange } from '../types';

/**
 * Fetch all completed payments within a date range (server-side filtered)
 */
export function usePaymentsByDateRange(dateRange: ReportDateRange) {
  return useQuery({
    queryKey: ['payments', 'byDateRange', dateRange.from, dateRange.to],
    queryFn: () => fetchAllPages((p) => fetchPayments({
      ...p,
      status: 'completed' as const,
      startDate: dateRange.from,
      endDate: dateRange.to,
    })),
    staleTime: 2 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    enabled: !!dateRange.from && !!dateRange.to,
  });
}
