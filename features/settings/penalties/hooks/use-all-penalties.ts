/**
 * Convenience hooks for penalty types and employee-scoped penalties
 * 
 * NOTE: useAllPenalties and usePenaltyFinder are REMOVED.
 * Use usePenalties() from use-penalties.ts for paginated/filtered queries.
 * Use usePenaltyById() for single penalty lookup.
 * Use usePenaltiesByIds() for batch lookup.
 */

import { useQuery } from '@tanstack/react-query';
import { usePenaltyTypes, penaltyKeys } from './use-penalties';
import * as api from '../api/penalties-api';
import type { PenaltyFilters } from '../api/penalties-api';

const DEFAULT_PAGE_SIZE = 20;

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
 * Hook for filtering penalties by employee — server-side pagination (single page)
 */
export function usePenaltiesByEmployee(
  employeeSystemId: string | undefined,
  page = 1,
  limit = DEFAULT_PAGE_SIZE,
) {
  const filters: PenaltyFilters = { employeeSystemId, page, limit };

  const query = useQuery({
    queryKey: penaltyKeys.list(filters),
    queryFn: () => api.fetchPenalties(filters),
    enabled: !!employeeSystemId,
    staleTime: 1000 * 60 * 5,
  });

  return {
    data: query.data?.data || [],
    pagination: query.data?.pagination || { page: 1, limit, total: 0, totalPages: 1 },
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
  };
}
