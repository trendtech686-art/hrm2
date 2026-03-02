/**
 * Convenience hooks for employee-scoped leaves
 * 
 * NOTE: useAllLeaves and useLeaveFinder are REMOVED.
 * Use useLeaves() from use-leaves.ts for paginated/filtered queries.
 * Use useLeavesByDateRange() for date-scoped queries.
 * Use useLeaveById() for single leave lookup.
 */

import * as React from 'react';
import { useQuery, useQueries } from '@tanstack/react-query';
import { fetchLeaves, type LeaveFilters } from '../api/leaves-api';
import { leaveKeys } from './use-leaves';

const EMPLOYEE_PAGE_SIZE = 100;

/**
 * Hook for filtering leaves by employee — server-side filtering
 * Uses auto-pagination to fetch ALL leaves for the employee (no hardcoded limit cap)
 */
export function useLeavesByEmployee(employeeSystemId: string | undefined) {
  const baseFilters: LeaveFilters = { employeeId: employeeSystemId, page: 1, limit: EMPLOYEE_PAGE_SIZE };

  // Step 1: Fetch first page to discover totalPages
  const firstPage = useQuery({
    queryKey: leaveKeys.list(baseFilters),
    queryFn: () => fetchLeaves(baseFilters),
    enabled: !!employeeSystemId,
    staleTime: 1000 * 60 * 2,
  });

  const totalPages = firstPage.data?.pagination?.totalPages || 1;

  // Step 2: Fetch remaining pages in parallel
  const remainingQueries = useQueries({
    queries: Array.from({ length: Math.max(0, totalPages - 1) }, (_, i) => {
      const filters: LeaveFilters = { employeeId: employeeSystemId, page: i + 2, limit: EMPLOYEE_PAGE_SIZE };
      return {
        queryKey: leaveKeys.list(filters),
        queryFn: () => fetchLeaves(filters),
        enabled: !!employeeSystemId && totalPages > 1 && !!firstPage.data,
        staleTime: 1000 * 60 * 2,
      };
    }),
  });

  const isLoading = firstPage.isLoading || remainingQueries.some(q => q.isLoading);

  const data = React.useMemo(() => {
    const firstPageData = firstPage.data?.data || [];
    if (totalPages <= 1) return firstPageData;
    return [...firstPageData, ...remainingQueries.flatMap(q => q.data?.data || [])];
  }, [totalPages, firstPage.data?.data, remainingQueries]);

  return {
    data,
    isLoading,
    isError: firstPage.isError,
    error: firstPage.error,
  };
}
