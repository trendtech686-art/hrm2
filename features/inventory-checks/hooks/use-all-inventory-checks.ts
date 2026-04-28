/**
 * useAllInventoryChecks - Convenience hook for flat array of inventory checks
 * Returns all inventory checks (equivalent to old store's data array)
 * Uses fetchAllPages auto-pagination to load ALL records
 * 
 * ⚠️ WARNING: Sử dụng filter để giới hạn data!
 * - Dùng startDate/endDate để filter theo ngày
 * - Dùng branchId để filter theo chi nhánh
 * - Dùng status/search để filter cụ thể
 */

import { useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchAllPages } from '@/lib/fetch-all-pages';
import { fetchInventoryChecks, type InventoryChecksParams } from '../api/inventory-checks-api';
import { inventoryCheckKeys } from './use-inventory-checks';
import type { InventoryCheck, InventoryCheckStatus } from '../types';

export interface UseAllInventoryChecksOptions extends Pick<InventoryChecksParams, 'startDate' | 'endDate' | 'branchId' | 'status' | 'search'> {
  enabled?: boolean;
}

export function useAllInventoryChecks(options: UseAllInventoryChecksOptions = {}) {
  const { enabled = true, startDate, endDate, branchId, status, search } = options;
  const query = useQuery({
    queryKey: [...inventoryCheckKeys.all, 'all', { startDate, endDate, branchId, status, search }],
    queryFn: () => fetchAllPages((p) => fetchInventoryChecks({ ...p, startDate, endDate, branchId, status, search })),
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

export function useInventoryCheckFinder() {
  const { data: inventoryChecks = [] } = useAllInventoryChecks();
  
  const findById = useCallback((systemId: string): InventoryCheck | null => {
    return inventoryChecks.find(ic => ic.systemId === systemId) ?? null;
  }, [inventoryChecks]);
  
  return { findById };
}
