/**
 * useAllOrders - Convenience hook for components needing all orders as flat array
 */

import * as React from 'react';
import { useOrders } from './use-orders';
import type { Order } from '@/lib/types/prisma-extended';
import type { SystemId } from '@/lib/id-types';

export function useAllOrders() {
  const query = useOrders({ limit: 30 });
  
  return {
    data: query.data?.data || [],
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
  };
}

/**
 * Hook for finding order by systemId or business id from cached data
 * Replaces legacy store.findById() method
 */
export function useOrderFinder() {
  const { data } = useAllOrders();
  
  const findById = React.useCallback(
    (systemId: SystemId | string | undefined): Order | undefined => {
      if (!systemId) return undefined;
      return data.find(o => o.systemId === systemId);
    },
    [data]
  );
  
  const findByBusinessId = React.useCallback(
    (businessId: string | undefined): Order | undefined => {
      if (!businessId) return undefined;
      return data.find(o => o.id === businessId);
    },
    [data]
  );
  
  return { findById, findByBusinessId };
}
