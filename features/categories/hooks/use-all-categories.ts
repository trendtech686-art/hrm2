/**
 * useAllCategories - Convenience hook for components needing all categories as flat array
 * 
 * Replaces legacy useCategoryStore().data pattern
 */

import * as React from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchAllPages } from '@/lib/fetch-all-pages';
import { fetchCategories } from '../api/categories-api';
import { categoryKeys } from './use-categories';
import type { SystemId } from '@/lib/id-types';

/**
 * Returns all categories as a flat array
 * Auto-pagination: no hardcoded limit cap (MODULE-QUALITY-CRITERIA §1.3)
 */
export function useAllCategories() {
  const query = useQuery({
    queryKey: [...categoryKeys.all, 'all'],
    queryFn: () => fetchAllPages((p) => fetchCategories(p)),
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
