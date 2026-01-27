/**
 * useAllOrders - Convenience hook for components needing all orders as flat array
 * 
 * ⚠️ WARNING: This loads ALL orders into memory. Use with caution for large datasets.
 * Consider using useOrders with pagination for better performance.
 */

import * as React from 'react';
import { useOrderStore } from '../store';
import type { Order } from '@/lib/types/prisma-extended';
import type { SystemId } from '@/lib/id-types';

/**
 * Hook to access all orders from Zustand store
 * ⚠️ DEPRECATED: This hook still uses Zustand. Consider using useOrders() with pagination.
 * This provides backward compatibility with components using useOrderStore().data
 */
export function useAllOrders() {
  const { data } = useOrderStore();
  
  return {
    data: data || [],
    isLoading: false,
    isError: false,
    error: null,
  };
}

/**
 * Returns only active orders (not deleted, not cancelled)
 * Replaces legacy useOrderStore().getActive()
 */
export function useActiveOrders() {
  const { data, isLoading, isError, error } = useAllOrders();
  
  const activeOrders = React.useMemo(
    () => data.filter(o => o.status !== 'Đã hủy'),
    [data]
  );
  
  return { data: activeOrders, isLoading, isError, error };
}

/**
 * Hook for accessing order store actions (add, update, delete, etc.)
 * Replaces legacy useOrderStore() action usage
 * Re-exports from use-order-actions for convenience
 */
export { useOrderActions } from './use-order-actions';

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
