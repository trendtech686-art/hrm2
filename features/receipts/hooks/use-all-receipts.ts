/**
 * useAllReceipts - Convenience hook for components needing all receipts as flat array
 * 
 * ⚠️ WARNING: Sử dụng filter để giới hạn data!
 * - Dùng startDate/endDate để filter theo ngày
 * - Dùng branchId/accountId để filter theo chi nhánh/tài khoản
 */

import * as React from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchAllPages } from '@/lib/fetch-all-pages';
import { fetchReceipts } from '../api/receipts-api';
import { receiptKeys } from './use-receipts';
import type { Receipt } from '@/lib/types/prisma-extended';

// Stable empty array to prevent re-renders
const EMPTY_RECEIPTS: Receipt[] = [];

/**
 * Options for useAllReceipts hook
 * @property enabled - Whether to fetch data (default: true). Set to false for lazy loading
 * @property startDate - Filter by start date (ISO string)
 * @property endDate - Filter by end date (ISO string)
 * @property branchId - Filter by branch
 * @property accountId - Filter by cash account
 */
export interface UseAllReceiptsOptions {
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
 * const { data } = useAllReceipts({ startDate: '2024-01-01', endDate: '2024-01-31' });
 */
export function useAllReceipts(options: UseAllReceiptsOptions = {}) {
  const { enabled = true, startDate, endDate, branchId, accountId } = options;
  const query = useQuery({
    queryKey: [...receiptKeys.all, 'all', { startDate, endDate, branchId, accountId }],
    queryFn: () => fetchAllPages((p) => fetchReceipts({ ...p, startDate, endDate, branchId, accountId })),
    enabled,
    staleTime: 10 * 60 * 1000,
    gcTime: 60 * 60 * 1000,
  });
  
  // Memoize data to prevent unnecessary re-renders
  const data = React.useMemo(() => 
    query.data || EMPTY_RECEIPTS,
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
 * Finder hook for looking up receipts by systemId.
 * Cache-only: subscribes to the query cache but NEVER triggers a fetch.
 */
export function useReceiptFinder() {
  const { data: receipts = [] } = useAllReceipts({ enabled: false });
  
  const findById = React.useCallback((systemId: string): Receipt | undefined => {
    return receipts.find(r => r.systemId === systemId);
  }, [receipts]);
  
  return { findById };
}
