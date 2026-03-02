/**
 * useAllStockLocations - Convenience hook for flat array of stock locations
 * Auto-pagination: no hardcoded limit cap (MODULE-QUALITY-CRITERIA §1.3)
 */

import * as React from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchAllPages } from '@/lib/fetch-all-pages';
import { fetchStockLocations } from '../api/stock-locations-api';
import { stockLocationKeys } from './use-stock-locations';
import type { StockLocation } from '@/lib/types/prisma-extended';
import type { SystemId } from '@/lib/id-types';

export function useAllStockLocations() {
  const query = useQuery({
    queryKey: [...stockLocationKeys.all, 'all'],
    queryFn: () => fetchAllPages((p) => fetchStockLocations(p)),
    staleTime: 10 * 60 * 1000,
    gcTime: 60 * 60 * 1000,
  });
  return {
    data: (query.data || []) as StockLocation[],
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
  };
}

/**
 * Helper hook to find a stock location by SystemId from cached data
 * Replaces legacy findBySystemId() method
 */
export function useStockLocationFinder() {
  const { data } = useAllStockLocations();
  
  const findBySystemId = React.useCallback(
    (systemId: SystemId | string | undefined) => {
      if (!systemId) return undefined;
      return data.find(loc => loc.systemId === systemId);
    },
    [data]
  );
  
  return { findBySystemId };
}
