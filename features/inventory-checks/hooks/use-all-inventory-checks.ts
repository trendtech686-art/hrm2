/**
 * useAllInventoryChecks - Convenience hook for flat array of inventory checks
 * Returns all inventory checks (equivalent to old store's data array)
 * Uses fetchAllPages auto-pagination to load ALL records
 */

import { useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchAllPages } from '@/lib/fetch-all-pages';
import { fetchInventoryChecks } from '../api/inventory-checks-api';
import { inventoryCheckKeys } from './use-inventory-checks';
import type { InventoryCheck } from '../types';

export function useAllInventoryChecks(options?: { enabled?: boolean }) {
  const query = useQuery({
    queryKey: [...inventoryCheckKeys.all, 'all'],
    queryFn: () => fetchAllPages((p) => fetchInventoryChecks(p)),
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

export function useInventoryCheckFinder() {
  const { data: inventoryChecks = [] } = useAllInventoryChecks();
  
  const findById = useCallback((systemId: string): InventoryCheck | null => {
    return inventoryChecks.find(ic => ic.systemId === systemId) ?? null;
  }, [inventoryChecks]);
  
  return { findById };
}
