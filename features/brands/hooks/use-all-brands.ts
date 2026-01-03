/**
 * useAllBrands - Convenience hook for components needing all brands as flat array
 * 
 * Replaces legacy useBrandStore().data pattern
 */

import * as React from 'react';
import { useBrands } from './use-brands';
import type { SystemId } from '@/lib/id-types';

/**
 * Returns all brands as a flat array
 * Compatible with legacy store pattern: { data: brands }
 */
export function useAllBrands() {
  const query = useBrands({ limit: 500 });
  
  return {
    data: query.data?.data || [],
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
