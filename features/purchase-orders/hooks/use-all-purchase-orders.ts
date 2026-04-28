/**
 * useAllPurchaseOrders - Convenience hook for components needing all purchase orders as flat array
 * 
 * Replaces legacy usePurchaseOrderStore().data pattern
 * 
 * ⚠️ WARNING: Sử dụng filter để giới hạn data!
 * - Dùng startDate/endDate để filter theo ngày
 * - Dùng branchId/supplierId để filter cụ thể
 */

import * as React from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchAllPages } from '@/lib/fetch-all-pages';
import { fetchPurchaseOrders, type PurchaseOrdersParams } from '../api/purchase-orders-api';
import { purchaseOrderKeys } from './use-purchase-orders';
import type { PurchaseOrder } from '@/lib/types/prisma-extended';
import type { SystemId } from '@/lib/id-types';

export interface UseAllPurchaseOrdersOptions extends Pick<PurchaseOrdersParams, 'startDate' | 'endDate' | 'branchId' | 'supplierId' | 'status' | 'paymentStatus' | 'search'> {
  enabled?: boolean;
}

/**
 * Returns all purchase orders as a flat array
 * Compatible with legacy store pattern: { data: orders }
 */
export function useAllPurchaseOrders(options: UseAllPurchaseOrdersOptions = {}) {
  const { enabled = true, startDate, endDate, branchId, supplierId, status, paymentStatus, search } = options;
  const query = useQuery({
    queryKey: [...purchaseOrderKeys.all, 'all', { startDate, endDate, branchId, supplierId, status, paymentStatus, search }],
    queryFn: () => fetchAllPages((p) => fetchPurchaseOrders({ ...p, startDate, endDate, branchId, supplierId, status, paymentStatus, search })),
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


