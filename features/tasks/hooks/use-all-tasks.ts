/**
 * Convenience hooks for employee-scoped tasks
 * 
 * NOTE: useAllTasks and useTaskFinder are REMOVED.
 * Use useTasks() from use-tasks.ts for paginated/filtered queries.
 */

import * as React from 'react';
import { useQuery, useQueries } from '@tanstack/react-query';
import { fetchTasks, type TaskFilters } from '../api/tasks-api';
import { taskKeys } from './use-tasks';

const EMPLOYEE_PAGE_SIZE = 100;

/**
 * Hook for filtering tasks by employee (assignee) — server-side filtering
 * Uses auto-pagination to fetch ALL tasks for the employee (no hardcoded limit cap)
 */
export function useTasksByEmployee(employeeSystemId: string | undefined) {
  const baseFilters: TaskFilters = { assigneeId: employeeSystemId, page: 1, limit: EMPLOYEE_PAGE_SIZE };

  // Step 1: Fetch first page to discover totalPages
  const firstPage = useQuery({
    queryKey: taskKeys.list(baseFilters),
    queryFn: () => fetchTasks(baseFilters),
    enabled: !!employeeSystemId,
    staleTime: 1000 * 60,
  });

  const totalPages = firstPage.data?.pagination?.totalPages || 1;

  // Step 2: Fetch remaining pages in parallel
  const remainingQueries = useQueries({
    queries: Array.from({ length: Math.max(0, totalPages - 1) }, (_, i) => {
      const filters: TaskFilters = { assigneeId: employeeSystemId, page: i + 2, limit: EMPLOYEE_PAGE_SIZE };
      return {
        queryKey: taskKeys.list(filters),
        queryFn: () => fetchTasks(filters),
        enabled: !!employeeSystemId && totalPages > 1 && !!firstPage.data,
        staleTime: 1000 * 60,
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
