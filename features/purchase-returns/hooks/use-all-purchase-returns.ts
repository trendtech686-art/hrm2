/**
 * useAllPurchaseReturns - Convenience hook for components needing all purchase returns as flat array
 * 
 * Replaces legacy usePurchaseReturnStore().data pattern
 */

import * as React from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchAllPages } from '@/lib/fetch-all-pages';
import { fetchPurchaseReturns } from '../api/purchase-returns-api';
import { purchaseReturnKeys } from './use-purchase-returns';
import type { PurchaseReturn } from '@/lib/types/prisma-extended';
import type { SystemId } from '@/lib/id-types';

/**
 * Returns all purchase returns as a flat array
 * Compatible with legacy store pattern: { data: returns }
 */
export function useAllPurchaseReturns(options?: { enabled?: boolean }) {
  const query = useQuery({
    queryKey: [...purchaseReturnKeys.all, 'all'],
    queryFn: () => fetchAllPages((p) => fetchPurchaseReturns(p)),
    staleTime: 10 * 60 * 1000,
    gcTime: 60 * 60 * 1000,
    enabled: options?.enabled ?? true,
  });
  
  return {
    data: query.data || [],
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
  };
}

/**
 * Helper hook to find a purchase return by ID from cached data
 * Replaces legacy findById() method
 */
export function usePurchaseReturnFinder() {
  const { data } = useAllPurchaseReturns();
  
  const findById = React.useCallback(
    (systemId: SystemId | string | undefined): PurchaseReturn | undefined => {
      if (!systemId) return undefined;
      return data.find(pr => pr.systemId === systemId);
    },
    [data]
  );
  
  return { findById };
}

/**
 * Returns purchase returns filtered by supplier
 */
export function usePurchaseReturnsBySupplier(supplierSystemId: SystemId | string | undefined) {
  const { data, isLoading } = useAllPurchaseReturns();
  
  const filtered = React.useMemo(
    () => supplierSystemId 
      ? data.filter(pr => pr.supplierSystemId === supplierSystemId)
      : [],
    [data, supplierSystemId]
  );
  
  return { data: filtered, isLoading };
}
