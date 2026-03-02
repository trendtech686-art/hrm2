/**
 * useAllBrands - Convenience hook for components needing all brands as flat array
 * 
 * Replaces legacy useBrandStore().data pattern
 */

import * as React from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchAllPages } from '@/lib/fetch-all-pages';
import { fetchBrands } from '../api/brands-api';
import { brandKeys } from './use-brands';
import type { SystemId } from '@/lib/id-types';

/**
 * Returns all brands as a flat array
 * Auto-pagination: no hardcoded limit cap (MODULE-QUALITY-CRITERIA §1.3)
 */
export function useAllBrands() {
  const query = useQuery({
    queryKey: [...brandKeys.all, 'all'],
    queryFn: () => fetchAllPages((p) => fetchBrands(p)),
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
 * Returns brands formatted as options for Select/Combobox
 */
export function useBrandOptions() {
  const { data, isLoading } = useActiveBrands();
  
  const options = React.useMemo(
    () => data.map(b => ({
      value: b.systemId,
      label: b.name,
    })),
    [data]
  );
  
  return { options, isLoading };
}

/**
 * Helper hook to find a brand by ID from cached data
 * Replaces legacy findById() method
 */
export function useBrandFinder() {
  const { data } = useAllBrands();
  
  const findById = React.useCallback(
    (systemId: SystemId | string | undefined) => {
      if (!systemId) return undefined;
      return data.find(b => b.systemId === systemId);
    },
    [data]
  );
  
  return { findById };
}
