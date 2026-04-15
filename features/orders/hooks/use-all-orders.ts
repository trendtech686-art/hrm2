/**
 * useAllOrders - Convenience hook for components needing all orders as flat array
 * 
 * Auto-pagination: no hardcoded limit cap (MODULE-QUALITY-CRITERIA §1.3)
 * 
 * @param options.enabled - Set to false to disable fetching (lazy load)
 * 
 * @example
 * // Lazy load - only fetch when needed
 * const { data: orders } = useAllOrders({ enabled: isDialogOpen });
 */

import * as React from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchAllPages } from '@/lib/fetch-all-pages';
import { fetchOrders } from '../api/orders-api';
import { orderKeys } from './use-orders';
import type { Order } from '@/lib/types/prisma-extended';
import type { SystemId } from '@/lib/id-types';

interface UseAllOrdersOptions {
  /** Set to false to disable fetching until needed */
  enabled?: boolean;
  /** @deprecated Ignored — auto-pagination fetches all */
  limit?: number;
}

/**
 * Hook to access all orders via React Query
 * Auto-pagination: fetches all pages automatically
 */
export function useAllOrders(options: UseAllOrdersOptions = {}) {
  const { enabled = true } = options;
  const query = useQuery({
    queryKey: [...orderKeys.all, 'all'],
    queryFn: () => fetchAllPages((p) => fetchOrders(p)),
    enabled,
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
 * Hook for finding order by systemId or business id from cached data.
 * Cache-only: subscribes to the query cache but NEVER triggers a fetch.
 */
export function useOrderFinder() {
  const { data } = useAllOrders({ enabled: false });
  
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
