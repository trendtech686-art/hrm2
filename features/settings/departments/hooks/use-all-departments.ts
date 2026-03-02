/**
 * useAllDepartments - Convenience hook for components needing all departments
 * Uses fetchAllPages auto-pagination to load ALL records
 * 
 * Use case: Dropdowns, selects, comboboxes that need all departments
 */

import * as React from 'react';
import { useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchAllPages } from '@/lib/fetch-all-pages';
import { fetchDepartments } from '../api/departments-api';
import type { Department } from '../api/departments-api';
import { departmentKeys } from './use-departments';

// Stable empty array to prevent re-renders
const EMPTY_DEPARTMENTS: Department[] = [];

/**
 * Returns all departments as a flat array
 * Compatible with legacy store pattern: { data: departments }
 */
export function useAllDepartments() {
  const query = useQuery({
    queryKey: [...departmentKeys.all, 'all'],
    queryFn: () => fetchAllPages((p) => fetchDepartments(p)),
    staleTime: 10 * 60 * 1000,
    gcTime: 60 * 60 * 1000,
  });
  
  const data = React.useMemo(() => 
    query.data || EMPTY_DEPARTMENTS,
    [query.data]
  );
  
  return {
    data,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
  };
}

/**
 * Returns departments formatted as options for Select/Combobox
 */
export function useDepartmentOptions() {
  const { data, isLoading } = useAllDepartments();
  
  const options = data.map(d => ({
    value: d.systemId,
    label: d.name,
  }));
  
  return { options, isLoading };
}

/**
 * Hook for finding department by systemId
 */
export function useDepartmentFinder() {
  const { data } = useAllDepartments();
  
  const findById = useCallback((systemId: string): Department | undefined => {
    return data.find(d => d.systemId === systemId);
  }, [data]);
  
  return { findById };
}
