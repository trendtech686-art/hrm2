/**
 * useAllBrands - Convenience hook for components needing all brands as flat array
 * 
 * Replaces legacy useBrandStore().data pattern
 */

import * as React from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchBrands } from '../api/brands-api';
import { brandKeys } from './use-brands';
import type { SystemId } from '@/lib/id-types';

/**
 * Returns all brands as a flat array.
 * Uses server-side limit=500 (brands are typically <200 items).
 */
export function useAllBrands(options: { enabled?: boolean } = {}) {
  const { enabled = true } = options;
  const query = useQuery({
    queryKey: [...brandKeys.all, 'all'],
    queryFn: async () => {
      const result = await fetchBrands({ page: 1, limit: 500 });
      return result.data;
    },
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
 * Returns only active brands (not deleted, isActive = true)
 * Replaces legacy useBrandStore().getActive()
 */
export function useActiveBrands() {
  const { data, isLoading, isError, error } = useAllBrands();
  
  const activeBrands = React.useMemo(
    () => data.filter(b => !b.isDeleted && b.isActive !== false),
    [data]
  );
  
  return { data: activeBrands, isLoading, isError, error };
}

/**
 * Helper hook to find a brand by ID from cached data
 * Replaces legacy findById() method
 */
export function useBrandFinder(options: { enabled?: boolean } = {}) {
  const { data } = useAllBrands(options);
  
  const findById = React.useCallback(
    (systemId: SystemId | string | undefined) => {
      if (!systemId) return undefined;
      return data.find(b => b.systemId === systemId);
    },
    [data]
  );
  
  return { findById };
}
