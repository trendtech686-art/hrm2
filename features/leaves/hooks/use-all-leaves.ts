/**
 * Convenience hooks for employee-scoped leaves
 * 
 * NOTE: useAllLeaves and useLeaveFinder are REMOVED.
 * Use useLeaves() from use-leaves.ts for paginated/filtered queries.
 * Use useLeavesByDateRange() for date-scoped queries.
 * Use useLeaveById() for single leave lookup.
 */

import { useQuery } from '@tanstack/react-query';
import { fetchLeaves, type LeaveFilters } from '../api/leaves-api';
import { leaveKeys } from './use-leaves';

const DEFAULT_PAGE_SIZE = 20;

/**
 * Hook for filtering leaves by employee — server-side pagination (single page)
 */
export function useLeavesByEmployee(
  employeeSystemId: string | undefined,
  page = 1,
  limit = DEFAULT_PAGE_SIZE,
) {
  const filters: LeaveFilters = { employeeId: employeeSystemId, page, limit };

  const query = useQuery({
    queryKey: leaveKeys.list(filters),
    queryFn: () => fetchLeaves(filters),
    enabled: !!employeeSystemId,
    staleTime: 1000 * 60 * 2,
  });

  return {
    data: query.data?.data || [],
    pagination: query.data?.pagination || { page: 1, limit, total: 0, totalPages: 1 },
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
  };
}
