/**
 * useAllCategories - Convenience hook for components needing all categories as flat array
 * 
 * Replaces legacy useCategoryStore().data pattern
 */

import * as React from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchCategories } from '../api/categories-api';
import { categoryKeys } from './use-categories';
import type { SystemId } from '@/lib/id-types';

/**
 * Returns all categories as a flat array.
 * Uses server-side limit=500 (categories are typically <200 items).
 */
export function useAllCategories() {
  const query = useQuery({
    queryKey: [...categoryKeys.all, 'all'],
    queryFn: async () => {
      const result = await fetchCategories({ page: 1, limit: 500 });
      return result.data;
    },
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
