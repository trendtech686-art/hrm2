/**
 * useAllSalesReturns - Convenience hook for components needing all sales returns as flat array
 */

import * as React from 'react';
import { useSalesReturns } from './use-sales-returns';
import type { SalesReturn } from '@/lib/types/prisma-extended';

export function useAllSalesReturns() {
  const query = useSalesReturns({ limit: 500 });
  
  return {
    data: query.data?.data || [],
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
