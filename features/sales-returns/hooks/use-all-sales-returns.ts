/**
 * useAllSalesReturns - Convenience hook for components needing all sales returns as flat array
 */

import * as React from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchAllPages } from '@/lib/fetch-all-pages';
import { fetchSalesReturns } from '../api/sales-returns-api';
import { salesReturnKeys } from './use-sales-returns';
import type { SalesReturn } from '@/lib/types/prisma-extended';

export function useAllSalesReturns() {
  const query = useQuery({
    queryKey: [...salesReturnKeys.all, 'all'],
    queryFn: () => fetchAllPages((p) => fetchSalesReturns(p)),
    staleTime: 10 * 60 * 1000,
    gcTime: 60 * 60 * 1000,
  });
  
  return {
    data: query.data || [],
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
  };
}

/**
 * Finder hook for looking up sales returns by systemId or businessId
 */
export function useSalesReturnFinder() {
  const { data: salesReturns = [] } = useAllSalesReturns();
  
  const findById = React.useCallback((systemId: string): SalesReturn | undefined => {
    return salesReturns.find(sr => sr.systemId === systemId);
  }, [salesReturns]);
  
  const findByBusinessId = React.useCallback((businessId: string): SalesReturn | undefined => {
    return salesReturns.find(sr => sr.id === businessId);
  }, [salesReturns]);
  
  return { findById, findByBusinessId };
}

/**
 * Returns only pending (not received) sales returns
 */
export function usePendingSalesReturnsData() {
  const { data, ...rest } = useAllSalesReturns();
  
  const pendingReturns = React.useMemo(
    () => data.filter(r => !r.isReceived),
    [data]
  );
  
  return { data: pendingReturns, ...rest };
}
