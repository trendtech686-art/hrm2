/**
 * useAllEmployees - Convenience hook for components needing all employees as flat array
 * 
 * Use case: Dropdowns, selects, comboboxes that need all employees for selection
 * 
 * ⚠️ For paginated views, use useEmployees() instead
 */

import * as React from 'react';
import { useEmployees } from './use-employees';
import type { SystemId } from '@/lib/id-types';

/**
 * Returns all employees as a flat array
 * Compatible with legacy store pattern: { data: employees }
 */
export function useAllEmployees() {
  const query = useEmployees({ limit: 30 });
  
  return {
    data: query.data?.data || [],
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
  };
}

/**
 * Returns active employees only (not deleted, isActive = true)
 */
export function useActiveEmployees() {
  const { data, isLoading, isError, error } = useAllEmployees();
  
  const activeEmployees = data.filter(e => !e.isDeleted && (e as any).isActive !== false);
  
  return {
    data: activeEmployees,
    isLoading,
    isError,
    error,
  };
}

/**
 * Returns employees formatted as options for Select/Combobox
 */
export function useEmployeeOptions() {
  const { data, isLoading } = useAllEmployees();
  
  const options = data.map(e => ({
    value: e.systemId,
    label: e.fullName,
  }));
  
  return { options, isLoading };
}

/**
 * Helper hook to find an employee by ID from cached data
 * Replaces legacy findById() method
 */
export function useEmployeeFinder() {
  const { data } = useAllEmployees();
  
  const findById = React.useCallback(
    (systemId: SystemId | string | undefined) => {
      if (!systemId) return undefined;
      return data.find(e => e.systemId === systemId);
    },
    [data]
  );
  
  return { findById };
}

/**
 * Helper hook for searching employees (for Combobox async search)
 * Returns a search function that filters cached employees
 */
export function useEmployeeSearcher() {
  const { data } = useAllEmployees();
  
  const searchEmployees = React.useCallback(
    async (query: string, _page = 0, limit = 100) => {
      const lowerQuery = query.toLowerCase();
      const filtered = data.filter(e => 
        e.fullName?.toLowerCase().includes(lowerQuery) ||
        e.id?.toLowerCase().includes(lowerQuery) ||
        e.phone?.includes(query)
      );
      
      return {
        items: filtered.slice(0, limit).map(e => ({
          value: e.systemId,
          label: e.fullName || e.id || 'N/A',
        })),
        total: filtered.length,
      };
    },
    [data]
  );
  
  return { searchEmployees };
}
