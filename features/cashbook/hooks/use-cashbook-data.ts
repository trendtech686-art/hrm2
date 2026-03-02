/**
 * useCashbookData - Server-side filtered cashbook hook
 * Replaces useAllReceipts + useAllPayments with server-side filtering
 */

import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { fetchCashbook, type CashbookParams } from '../api/cashbook-summary-api';

export const cashbookDataKeys = {
  all: ['cashbook-data'] as const,
  list: (params: CashbookParams) => [...cashbookDataKeys.all, params] as const,
};

export function useCashbookData(params: CashbookParams & { enabled?: boolean } = {}) {
  const { enabled = true, ...queryParams } = params;
  
  return useQuery({
    queryKey: cashbookDataKeys.list(queryParams),
    queryFn: () => fetchCashbook(queryParams),
    staleTime: 30_000,
    gcTime: 5 * 60 * 1000,
    placeholderData: keepPreviousData,
    enabled,
  });
}
