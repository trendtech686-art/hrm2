/**
 * Convenience hooks for employee-scoped tasks
 * 
 * NOTE: useAllTasks and useTaskFinder are REMOVED.
 * Use useTasks() from use-tasks.ts for paginated/filtered queries.
 */

import { useQuery } from '@tanstack/react-query';
import { fetchTasks, type TaskFilters } from '../api/tasks-api';
import { taskKeys } from './use-tasks';

const DEFAULT_PAGE_SIZE = 20;

/**
 * Hook for filtering tasks by employee (assignee) — server-side pagination (single page)
 */
export function useTasksByEmployee(
  employeeSystemId: string | undefined,
  page = 1,
  limit = DEFAULT_PAGE_SIZE,
) {
  const filters: TaskFilters = { assigneeId: employeeSystemId, page, limit };

  const query = useQuery({
    queryKey: taskKeys.list(filters),
    queryFn: () => fetchTasks(filters),
    enabled: !!employeeSystemId,
    staleTime: 1000 * 60,
  });

  return {
    data: query.data?.data || [],
    pagination: query.data?.pagination || { page: 1, limit, total: 0, totalPages: 1 },
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
  };
}
