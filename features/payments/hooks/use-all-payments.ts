/**
 * useAllPayments - Convenience hook for components needing all payments as flat array
 * 
 * ⚠️ WARNING: Sử dụng filter để giới hạn data!
 * - Dùng startDate/endDate để filter theo ngày
 * - Dùng branchId/accountId để filter theo chi nhánh/tài khoản
 */

import * as React from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchAllPages } from '@/lib/fetch-all-pages';
import { fetchPayments } from '../api/payments-api';
import { paymentKeys } from './use-payments';
import type { Payment } from '@/lib/types/prisma-extended';

// Stable empty array to prevent re-renders
const EMPTY_PAYMENTS: Payment[] = [];

/**
 * Options for useAllPayments hook
 * @property enabled - Whether to fetch data (default: true). Set to false for lazy loading
 * @property startDate - Filter by start date (ISO string)
 * @property endDate - Filter by end date (ISO string)
 * @property branchId - Filter by branch
 * @property accountId - Filter by cash account
 */
export interface UseAllPaymentsOptions {
  enabled?: boolean;
  limit?: number; // Ignored — auto-pagination fetches all
  startDate?: string;
  endDate?: string;
  branchId?: string;
  accountId?: string;
}

/**
 * @example
 * // Filter by date range
 * const { data } = useAllPayments({ startDate: '2024-01-01', endDate: '2024-01-31' });
 */
export function useAllPayments(options: UseAllPaymentsOptions = {}) {
  const { enabled = true, startDate, endDate, branchId, accountId } = options;
  const query = useQuery({
    queryKey: [...paymentKeys.all, 'all', { startDate, endDate, branchId, accountId }],
    queryFn: () => fetchAllPages((p) => fetchPayments({ ...p, startDate, endDate, branchId, accountId })),
    enabled,
    staleTime: 10 * 60 * 1000,
    gcTime: 60 * 60 * 1000,
  });
  
  // Memoize data to prevent unnecessary re-renders
  const data = React.useMemo(() => 
    query.data || EMPTY_PAYMENTS,
    [query.data]
  );
  
  return {
    data,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
  };
}

/**
 * Finder hook for looking up payments by systemId.
 * Cache-only: subscribes to the query cache but NEVER triggers a fetch.
 */
export function usePaymentFinder() {
  const { data: payments = [] } = useAllPayments({ enabled: false });
  
  const findById = React.useCallback((systemId: string): Payment | undefined => {
    return payments.find(p => p.systemId === systemId);
  }, [payments]);
  
  return { findById };
}
