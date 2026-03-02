/**
 * useAllEmployees - Auto-paginating hook for components needing all employees as flat array
 * 
 * Use case: Dropdowns, selects, comboboxes that need all employees for selection
 * Fetches all pages automatically using parallel queries — no hardcoded limit cap.
 * 
 * ⚠️ For paginated views, use useEmployees() instead
 */

import * as React from 'react';
import { useQuery, useQueries } from '@tanstack/react-query';
import { fetchEmployees } from '../api/employees-api';
import { employeeKeys } from './use-employees';
import type { EmployeesParams } from '../api/employees-api';
import type { Employee } from '@/lib/types/prisma-extended';
import type { SystemId } from '@/lib/id-types';

// ✅ Stable empty array to prevent re-renders
const EMPTY_EMPLOYEES: Employee[] = [];
const EMPTY_OPTIONS: { value: SystemId; label: string }[] = [];

const ALL_EMPLOYEES_PAGE_SIZE = 100;

/**
 * Options for useAllEmployees hook
 * @property enabled - Whether to fetch data (default: true). Set to false for lazy loading
 */
export interface UseAllEmployeesOptions {
  enabled?: boolean;
}

/**
 * Returns all employees as a flat array via auto-pagination.
 * Fetches page 1 to discover totalPages, then fetches remaining pages in parallel.
 * No hardcoded limit — works correctly regardless of employee count.
 * 
 * @example
 * // Lazy loading - chỉ load khi dropdown mở
 * const [opened, setOpened] = useState(false);
 * const { data } = useAllEmployees({ enabled: opened });
 */
export function useAllEmployees(options: UseAllEmployeesOptions = {}) {
  const { enabled = true } = options;

  const baseParams: EmployeesParams = { page: 1, limit: ALL_EMPLOYEES_PAGE_SIZE };

  // Step 1: Fetch first page to discover totalPages
  const firstPage = useQuery({
    queryKey: employeeKeys.list(baseParams),
    queryFn: () => fetchEmployees(baseParams),
    staleTime: 60_000,
    gcTime: 10 * 60 * 1000,
    enabled,
  });

  const totalPages = firstPage.data?.pagination?.totalPages || 1;

  // Step 2: Fetch remaining pages in parallel (only when totalPages > 1)
  const remainingPageQueries = useQueries({
    queries: Array.from({ length: Math.max(0, totalPages - 1) }, (_, i) => {
      const params: EmployeesParams = { page: i + 2, limit: ALL_EMPLOYEES_PAGE_SIZE };
      return {
        queryKey: employeeKeys.list(params),
        queryFn: () => fetchEmployees(params),
        staleTime: 60_000,
        gcTime: 10 * 60 * 1000,
        enabled: enabled && totalPages > 1 && !!firstPage.data,
      };
    }),
  });

  // Step 3: Merge all pages
  const isLoading = firstPage.isLoading || remainingPageQueries.some(q => q.isLoading);

  const data = React.useMemo(() => {
    const firstPageData = firstPage.data?.data || [];
    if (isLoading) return firstPageData;
    if (totalPages <= 1) return firstPageData.length > 0 ? firstPageData : EMPTY_EMPLOYEES;
    return [...firstPageData, ...remainingPageQueries.flatMap(q => q.data?.data || [])];
  }, [isLoading, totalPages, firstPage.data?.data, remainingPageQueries]);
  
  return {
    data,
    isLoading,
    isError: firstPage.isError,
    error: firstPage.error,
  };
}

/**
 * Returns active employees only (not deleted, isActive = true)
 * @param options - Pass { enabled: false } to defer loading until needed
 */
export function useActiveEmployees(options: UseAllEmployeesOptions = {}) {
  const { data, isLoading, isError, error } = useAllEmployees(options);
  
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
    (idOrSystemId: SystemId | string | undefined) => {
      if (!idOrSystemId) return undefined;
      // ✅ Search by systemId first, then fallback to business id
      return data.find(e => e.systemId === idOrSystemId) || 
             data.find(e => e.id === idOrSystemId);
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
