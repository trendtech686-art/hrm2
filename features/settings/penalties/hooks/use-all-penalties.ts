/**
 * Convenience hooks for penalty types and employee-scoped penalties
 * 
 * NOTE: useAllPenalties and usePenaltyFinder are REMOVED.
 * Use usePenalties() from use-penalties.ts for paginated/filtered queries.
 * Use usePenaltyById() for single penalty lookup.
 * Use usePenaltiesByIds() for batch lookup.
 */

import * as React from 'react';
import { useQuery, useQueries } from '@tanstack/react-query';
import { usePenaltyTypes, penaltyKeys } from './use-penalties';
import * as api from '../api/penalties-api';
import type { PenaltyFilters } from '../api/penalties-api';

const EMPLOYEE_PAGE_SIZE = 100;

/**
 * Returns all penalty types as a flat array (reference data — small set)
 */
export function useAllPenaltyTypes() {
  const query = usePenaltyTypes();
  
  return {
    data: query.data || [],
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
  };
}

/**
 * Hook for filtering penalties by employee — server-side filtering
 * Uses auto-pagination to fetch ALL penalties for the employee (no hardcoded limit cap)
 */
export function usePenaltiesByEmployee(employeeSystemId: string | undefined) {
  const baseFilters: PenaltyFilters = { employeeSystemId, page: 1, limit: EMPLOYEE_PAGE_SIZE };

  // Step 1: Fetch first page to discover totalPages
  const firstPage = useQuery({
    queryKey: penaltyKeys.list(baseFilters),
    queryFn: () => api.fetchPenalties(baseFilters),
    enabled: !!employeeSystemId,
    staleTime: 1000 * 60 * 5,
  });

  const totalPages = firstPage.data?.pagination?.totalPages || 1;

  // Step 2: Fetch remaining pages in parallel
  const remainingQueries = useQueries({
    queries: Array.from({ length: Math.max(0, totalPages - 1) }, (_, i) => {
      const filters: PenaltyFilters = { employeeSystemId, page: i + 2, limit: EMPLOYEE_PAGE_SIZE };
      return {
        queryKey: penaltyKeys.list(filters),
        queryFn: () => api.fetchPenalties(filters),
        enabled: !!employeeSystemId && totalPages > 1 && !!firstPage.data,
        staleTime: 1000 * 60 * 5,
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
