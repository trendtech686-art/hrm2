/**
 * useAllSalesReturns - Convenience hook for components needing all sales returns as flat array
 */

import { useQuery } from '@tanstack/react-query';
import { fetchAllPages } from '@/lib/fetch-all-pages';
import { fetchSalesReturns } from '../api/sales-returns-api';
import { salesReturnKeys } from './use-sales-returns';
import type { SalesReturn } from '@/lib/types/prisma-extended';

// Stable empty array to avoid new reference on every render while loading
const EMPTY_SALES_RETURNS: SalesReturn[] = [];

export function useAllSalesReturns(options?: { enabled?: boolean }) {
  const enabled = options?.enabled ?? true;
  const query = useQuery({
    queryKey: [...salesReturnKeys.all, 'all'],
    queryFn: () => fetchAllPages((p) => fetchSalesReturns(p)),
    staleTime: 10 * 60 * 1000,
    gcTime: 60 * 60 * 1000,
    enabled,
  });
  
  return {
    data: query.data || EMPTY_SALES_RETURNS,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
  };
}
