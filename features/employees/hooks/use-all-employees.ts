/**
 * useAllEmployees - Convenience hook for components needing all employees as flat array
 * 
 * Use case: Dropdowns, selects, comboboxes that need all employees for selection
 * 
 * ⚠️ For paginated views, use useEmployees() instead
 */

import * as React from 'react';
import { useEmployees } from './use-employees';
import type { Employee } from '@/lib/types/prisma-extended';
import type { SystemId } from '@/lib/id-types';

// ✅ Stable empty array to prevent re-renders
const EMPTY_EMPLOYEES: Employee[] = [];
const EMPTY_OPTIONS: { value: SystemId; label: string }[] = [];

/**
 * Returns all employees as a flat array
 * Compatible with legacy store pattern: { data: employees }
 */
export function useAllEmployees() {
  // Use high limit to get all employees for org chart, dropdowns, etc.
  const query = useEmployees({ limit: 500 });
  
  // ✅ Memoize data to prevent unnecessary re-renders
  const data = React.useMemo(() => 
    query.data?.data || EMPTY_EMPLOYEES,
    [query.data?.data]
  );
  
  return {
    data,
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
  
  // ✅ Memoize filtered data to prevent unnecessary re-renders
  const activeEmployees = React.useMemo(() => 
    data.filter(e => !e.isDeleted && (e as { isActive?: boolean }).isActive !== false),
    [data]
  );
  
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
  
  // ✅ Memoize options to prevent unnecessary re-renders
  const options = React.useMemo(() => 
    data.length > 0 
      ? data.map(e => ({
          value: e.systemId,
          label: e.fullName,
        }))
      : EMPTY_OPTIONS,
    [data]
  );
  
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
        hasNextPage: filtered.length > limit,
      };
    },
    [data]
  );
  
  return { searchEmployees };
}
