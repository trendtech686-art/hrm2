/**
 * useEmployeeFilterOptions - Lightweight hook for filter dropdown options
 * 
 * Fetches distinct department names and job title names from a dedicated API endpoint.
 * This replaces useActiveEmployees() which fetched ALL employees just to extract unique values.
 * 
 * Performance: ~2ms query vs fetching hundreds of full employee records.
 */

import { useQuery } from '@tanstack/react-query';
import { employeeKeys } from './use-employees';

export interface EmployeeFilterOptions {
  departments: string[];
  jobTitles: string[];
}

const EMPTY_OPTIONS: EmployeeFilterOptions = { departments: [], jobTitles: [] };

async function fetchFilterOptions(): Promise<EmployeeFilterOptions> {
  const res = await fetch('/api/employees/filter-options', {
    credentials: 'include',
  });
  if (!res.ok) {
    throw new Error(`Failed to fetch filter options: ${res.statusText}`);
  }
  return res.json();
}

/**
 * Returns distinct department and job title names for filter dropdowns.
 * Much lighter than useActiveEmployees() which loaded ALL employee records.
 */
export function useEmployeeFilterOptions() {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: [...employeeKeys.all, 'filter-options'] as const,
    queryFn: fetchFilterOptions,
    staleTime: 5 * 60_000, // 5 minutes — filter options rarely change
    gcTime: 30 * 60_000,
  });

  return {
    data: data ?? EMPTY_OPTIONS,
    departments: data?.departments ?? [],
    jobTitles: data?.jobTitles ?? [],
    isLoading,
    isError,
    error,
  };
}
