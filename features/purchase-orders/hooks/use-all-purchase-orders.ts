/**
 * useAllPurchaseOrders - Convenience hook for components needing all purchase orders as flat array
 * 
 * Replaces legacy usePurchaseOrderStore().data pattern
 */

import * as React from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchAllPages } from '@/lib/fetch-all-pages';
import { fetchPurchaseOrders } from '../api/purchase-orders-api';
import { purchaseOrderKeys } from './use-purchase-orders';
import type { PurchaseOrder } from '@/lib/types/prisma-extended';
import type { SystemId } from '@/lib/id-types';

/**
 * Options for useAllPurchaseOrders hook
 * @property enabled - Whether to fetch data (default: true). Set to false for lazy loading
 */
export interface UseAllPurchaseOrdersOptions {
  enabled?: boolean;
}

/**
 * Returns all purchase orders as a flat array
 * Compatible with legacy store pattern: { data: orders }
 */
export function useAllPurchaseOrders(options: UseAllPurchaseOrdersOptions = {}) {
  const { enabled = true } = options;
  const query = useQuery({
    queryKey: [...purchaseOrderKeys.all, 'all'],
    queryFn: () => fetchAllPages((p) => fetchPurchaseOrders(p)),
    staleTime: 10 * 60 * 1000,
    gcTime: 60 * 60 * 1000,
    enabled,
  });
  
  return {
    data: query.data || [],
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
  };
}

/**
 * Helper hook to find a purchase order by ID from cached data
 * Replaces legacy findById() method
 */
export function usePurchaseOrderFinder() {
  const { data } = useAllPurchaseOrders();
  
  const findById = React.useCallback(
    (systemId: SystemId | string | undefined): PurchaseOrder | undefined => {
      if (!systemId) return undefined;
      return data.find(po => po.systemId === systemId);
    },
    [data]
  );
  
  return { findById };
}


