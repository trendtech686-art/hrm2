/**
 * useAllDepartments - Convenience hook for components needing all departments
 * 
 * Use case: Dropdowns, selects, comboboxes that need all departments
 */

import { useCallback } from 'react';
import { useDepartments } from './use-departments';
import type { Department } from '../api/departments-api';

/**
 * Returns all departments as a flat array
 * Compatible with legacy store pattern: { data: departments }
 */
export function useAllDepartments() {
  const query = useDepartments({ limit: 500 });
  
  return {
    data: query.data?.data || [],
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
