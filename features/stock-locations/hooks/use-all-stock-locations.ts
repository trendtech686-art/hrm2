/**
 * useAllStockLocations - Convenience hook for flat array of stock locations
 * Returns all stock locations data without pagination
 */

import * as React from 'react';
import { useStockLocations } from './use-stock-locations';
import type { StockLocation } from '@/lib/types/prisma-extended';
import type { SystemId } from '@/lib/id-types';

export function useAllStockLocations() {
  const { data, ...rest } = useStockLocations({});
  return {
    data: data?.data || [] as StockLocation[],
    ...rest,
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
