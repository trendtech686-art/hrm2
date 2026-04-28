/**
 * useAllPurchaseReturns - Convenience hook for components needing all purchase returns as flat array
 * 
 * Replaces legacy usePurchaseReturnStore().data pattern
 * 
 * ⚠️ WARNING: Sử dụng filter để giới hạn data!
 * - Dùng startDate/endDate để filter theo ngày
 * - Dùng branchId/supplierId để filter cụ thể
 */

import * as React from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchAllPages } from '@/lib/fetch-all-pages';
import { fetchPurchaseReturns, type PurchaseReturnsParams } from '../api/purchase-returns-api';
import { purchaseReturnKeys } from './use-purchase-returns';
import type { PurchaseReturn } from '@/lib/types/prisma-extended';
import type { SystemId } from '@/lib/id-types';

export interface UseAllPurchaseReturnsOptions extends Pick<PurchaseReturnsParams, 'startDate' | 'endDate' | 'branchId' | 'supplierId' | 'status' | 'search'> {
  enabled?: boolean;
}

/**
 * Returns all purchase returns as a flat array
 * Compatible with legacy store pattern: { data: returns }
 */
export function useAllPurchaseReturns(options: UseAllPurchaseReturnsOptions = {}) {
  const { enabled = true, startDate, endDate, branchId, supplierId, status, search } = options;
  const query = useQuery({
    queryKey: [...purchaseReturnKeys.all, 'all', { startDate, endDate, branchId, supplierId, status, search }],
    queryFn: () => fetchAllPages((p) => fetchPurchaseReturns({ ...p, startDate, endDate, branchId, supplierId, status, search })),
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
 * Fetch purchase returns for a specific purchase order (server-side filtered)
 * Replaces useAllPurchaseReturns() + .filter(pr => pr.purchaseOrderSystemId === poSystemId)
 */
export function usePurchaseReturnsByPO(poSystemId: string | undefined) {
  const query = useQuery({
    queryKey: [...purchaseReturnKeys.all, 'byPO', poSystemId],
    queryFn: async () => {
      const res = await fetchPurchaseReturns({ purchaseOrderId: poSystemId! });
      return res.data;
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    enabled: !!poSystemId,
  });
  
  return {
    data: query.data || [],
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
  };
}
