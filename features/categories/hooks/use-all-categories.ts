/**
 * useAllCategories - Convenience hook for components needing all categories as flat array
 * 
 * Replaces legacy useCategoryStore().data pattern
 */

import * as React from 'react';
import { useCategories } from './use-categories';
import type { SystemId } from '@/lib/id-types';

/**
 * Returns all categories as a flat array
 * Compatible with legacy store pattern: { data: categories }
 */
export function useAllCategories() {
  const query = useCategories({ limit: 500 });
  
  return {
    data: query.data?.data || [],
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
  };
}

/**
 * Returns only active categories (not deleted, isActive = true)
 * Replaces legacy useCategoryStore().getActive()
 */
export function useActiveCategories() {
  const { data, isLoading, isError, error } = useAllCategories();
  
  const activeCategories = React.useMemo(
    () => data.filter(c => !c.isDeleted && c.isActive !== false),
    [data]
  );
  
  return { data: activeCategories, isLoading, isError, error };
}

/**
 * Returns categories formatted as options for Select/Combobox
 */
export function useCategoryOptions() {
  const { data, isLoading } = useActiveCategories();
  
  const options = React.useMemo(
    () => data.map(c => ({
      value: c.systemId,
      label: c.path || c.name,
    })),
    [data]
  );
  
  return { options, isLoading };
}

/**
 * Helper hook to find a category by ID from cached data
 * Replaces legacy findById() method
 */
export function useCategoryFinder() {
  const { data } = useAllCategories();
  
  const findById = React.useCallback(
    (systemId: SystemId | string | undefined) => {
      if (!systemId) return undefined;
      return data.find(c => c.systemId === systemId);
    },
    [data]
  );
  
  return { findById };
}
