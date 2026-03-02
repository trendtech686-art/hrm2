/**
 * useEmployees - React Query hooks for employees
 * 
 * ⚠️ IMPORTANT: Direct import pattern
 * - Import this file directly: import { useEmployees } from '@/features/employees/hooks/use-employees'
 * - NEVER import from '@/features/employees' or '@/features/employees/store'
 * 
 * This hook uses Server Actions for mutations (Phase 2 migration)
 */

import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import {
  fetchEmployees,
  fetchEmployee,
  searchEmployees,
  fetchEmployeesByDepartment,
  fetchEmployeesByBranch,
  fetchDeletedEmployees,
  type EmployeesParams,
} from '../api/employees-api';
import {
  createEmployeeAction,
  updateEmployeeAction,
  deleteEmployeeAction,
  restoreEmployeeAction,
  type CreateEmployeeInput,
  type UpdateEmployeeInput,
} from '@/app/actions/employees';

// Re-export types for backwards compatibility
export type { CreateEmployeeInput, UpdateEmployeeInput };

// Query keys - exported for invalidation
export const employeeKeys = {
  all: ['employees'] as const,
  lists: () => [...employeeKeys.all, 'list'] as const,
  list: (params: EmployeesParams) => [...employeeKeys.lists(), params] as const,
  details: () => [...employeeKeys.all, 'detail'] as const,
  detail: (id: string) => [...employeeKeys.details(), id] as const,
  search: (query: string) => [...employeeKeys.all, 'search', query] as const,
  byDepartment: (id: string) => [...employeeKeys.all, 'department', id] as const,
  byBranch: (id: string) => [...employeeKeys.all, 'branch', id] as const,
  stats: () => [...employeeKeys.all, 'stats'] as const,
};

// Types for initial data from Server Components
export interface EmployeeStats {
  total: number;
  active: number;
  onLeave: number;
  resigned: number;
  deleted: number;
}

/**
 * Hook for employee statistics with optional initial data from Server Component
 */
export function useEmployeeStats(initialData?: EmployeeStats) {
  return useQuery({
    queryKey: employeeKeys.stats(),
    queryFn: async () => {
      const res = await fetch('/api/employees/stats');
      if (!res.ok) throw new Error('Failed to fetch employee stats');
      return res.json() as Promise<EmployeeStats>;
    },
    initialData,
    staleTime: initialData ? 60_000 : 0,
    gcTime: 10 * 60 * 1000,
  });
}

/**
 * Hook for fetching paginated employees list
 * 
 * @example
 * ```tsx
 * function EmployeesPage() {
 *   const [page, setPage] = useState(1);
 *   const { data, isLoading } = useEmployees({ page });
 *   
 *   return (
 *     <DataTable 
 *       data={data?.data || []} 
 *       pagination={data?.pagination}
 *       onPageChange={setPage}
 *     />
 *   );
 * }
 * ```
 */
export function useEmployees(params: EmployeesParams & { enabled?: boolean } = {}) {
  const { enabled = true, ...queryParams } = params;
  return useQuery({
    queryKey: employeeKeys.list(queryParams),
    queryFn: () => fetchEmployees(queryParams),
    staleTime: 60_000, // 1 minute - employees don't change frequently
    gcTime: 10 * 60 * 1000, // 10 minutes
    placeholderData: keepPreviousData,
    enabled,
  });
}

/**
 * Hook for fetching single employee by ID
 */
export function useEmployee(id: string | null | undefined) {
  return useQuery({
    queryKey: employeeKeys.detail(id!),
    queryFn: () => fetchEmployee(id!),
    enabled: !!id,
    staleTime: 60_000,
    gcTime: 10 * 60 * 1000,
  });
}

/**
 * Hook for searching employees (autocomplete)
 */
export function useEmployeeSearch(query: string, limit = 20) {
  return useQuery({
    queryKey: employeeKeys.search(query),
    queryFn: () => searchEmployees(query, limit),
    enabled: query.length >= 2,
    staleTime: 30_000,
  });
}

/**
 * Hook for fetching employees by department
 */
export function useEmployeesByDepartment(departmentId: string | null | undefined) {
  return useQuery({
    queryKey: employeeKeys.byDepartment(departmentId!),
    queryFn: () => fetchEmployeesByDepartment(departmentId!),
    enabled: !!departmentId,
    staleTime: 60_000,
  });
}

/**
 * Hook for fetching employees by branch
 */
export function useEmployeesByBranch(branchId: string | null | undefined) {
  return useQuery({
    queryKey: employeeKeys.byBranch(branchId!),
    queryFn: () => fetchEmployeesByBranch(branchId!),
    enabled: !!branchId,
    staleTime: 60_000,
  });
}

/**
 * Hook for employee mutations (create/update/delete)
 */
interface UseEmployeeMutationsOptions {
  onCreateSuccess?: (employee: unknown) => void;
  onUpdateSuccess?: (employee: unknown) => void;
  onDeleteSuccess?: () => void;
  onError?: (error: Error) => void;
}

export function useEmployeeMutations(options: UseEmployeeMutationsOptions = {}) {
  const queryClient = useQueryClient();
  
  const create = useMutation({
    mutationFn: async (data: CreateEmployeeInput) => {
      const result = await createEmployeeAction(data);
      if (!result.success) throw new Error(result.error || 'Failed to create employee');
      return result.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: employeeKeys.lists() });
      queryClient.invalidateQueries({ queryKey: employeeKeys.stats() });
      options.onCreateSuccess?.(data);
    },
    onError: options.onError,
  });
  
  const update = useMutation({
    mutationFn: async (input: UpdateEmployeeInput) => {
      const result = await updateEmployeeAction(input);
      if (!result.success) throw new Error(result.error || 'Failed to update employee');
      return result.data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: employeeKeys.detail(variables.systemId) });
      queryClient.invalidateQueries({ queryKey: employeeKeys.lists() });
      queryClient.invalidateQueries({ queryKey: employeeKeys.stats() });
      options.onUpdateSuccess?.(data);
    },
    onError: options.onError,
  });
  
  const remove = useMutation({
    mutationFn: async (systemId: string) => {
      const result = await deleteEmployeeAction(systemId);
      if (!result.success) throw new Error(result.error || 'Failed to delete employee');
      return result.data;
    },
    // Optimistic delete - UI cập nhật ngay lập tức
    onMutate: async (systemId) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: employeeKeys.lists() });
      
      // Snapshot previous value for rollback
      const previousLists = queryClient.getQueriesData({ queryKey: employeeKeys.lists() });
      
      // Optimistically update all list queries - mark as deleted
      queryClient.setQueriesData(
        { queryKey: employeeKeys.lists() },
        (old: { data?: Array<{ systemId: string; isDeleted?: boolean }>, pagination?: unknown } | undefined) => {
          if (!old?.data) return old;
          return {
            ...old,
            data: old.data.map(item => 
              item.systemId === systemId 
                ? { ...item, isDeleted: true, deletedAt: new Date().toISOString() }
                : item
            ),
          };
        }
      );
      
      return { previousLists };
    },
    onError: (_err, _systemId, context) => {
      // Rollback on error
      if (context?.previousLists) {
        context.previousLists.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
      options.onError?.(_err as Error);
    },
    onSuccess: () => {
      options.onDeleteSuccess?.();
    },
    onSettled: () => {
      // Always refetch after mutation
      queryClient.invalidateQueries({ queryKey: employeeKeys.all });
    },
  });
  
  return {
    create,
    update,
    remove,
    isCreating: create.isPending,
    isUpdating: update.isPending,
    isDeleting: remove.isPending,
    isMutating: create.isPending || update.isPending || remove.isPending,
  };
}

/**
 * Hook for getting active employees
 */
export function useActiveEmployees(params: Omit<EmployeesParams, 'status'> = {}) {
  return useEmployees({ ...params, status: 'active' });
}

/**
 * Prefetch employee for faster navigation
 */
export function usePrefetchEmployee() {
  const queryClient = useQueryClient();
  
  return (id: string) => {
    queryClient.prefetchQuery({
      queryKey: employeeKeys.detail(id),
      queryFn: () => fetchEmployee(id),
      staleTime: 60_000,
    });
  };
}

/**
 * Hook for fetching deleted employees (trash)
 */
export function useDeletedEmployees() {
  return useQuery({
    queryKey: [...employeeKeys.all, 'deleted'] as const,
    queryFn: fetchDeletedEmployees,
    staleTime: 60_000,
  });
}

/**
 * Hook for trash mutations (restore/permanent delete)
 */
export function useTrashMutations() {
  const queryClient = useQueryClient();
  
  const restore = useMutation({
    mutationFn: async (systemId: string) => {
      const result = await restoreEmployeeAction(systemId);
      if (!result.success) throw new Error(result.error || 'Failed to restore employee');
      return result.data;
    },
    onSuccess: () => {
      // Invalidate both active and deleted lists
      queryClient.invalidateQueries({ queryKey: employeeKeys.all });
    },
  });
  
  const permanentDelete = useMutation({
    mutationFn: async (systemId: string) => {
      // Use delete action with permanent flag - for now use soft delete
      const result = await deleteEmployeeAction(systemId);
      if (!result.success) throw new Error(result.error || 'Failed to permanently delete employee');
      return result.data;
    },
    onMutate: async (systemId) => {
      // Optimistic update - remove from deleted list
      await queryClient.cancelQueries({ queryKey: [...employeeKeys.all, 'deleted'] });
      
      const previousDeleted = queryClient.getQueryData([...employeeKeys.all, 'deleted']);
      
      queryClient.setQueryData(
        [...employeeKeys.all, 'deleted'],
        (old: Array<{ systemId: string }> | undefined) => 
          old?.filter(item => item.systemId !== systemId) || []
      );
      
      return { previousDeleted };
    },
    onError: (_err, _systemId, context) => {
      if (context?.previousDeleted) {
        queryClient.setQueryData([...employeeKeys.all, 'deleted'], context.previousDeleted);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: employeeKeys.all });
    },
  });
  
  return {
    restore,
    permanentDelete,
    isRestoring: restore.isPending,
    isDeleting: permanentDelete.isPending,
  };
}

// Re-export from use-all-employees for backward compatibility
export { useAllEmployees, useEmployeeOptions, useEmployeeFinder, useEmployeeSearcher } from './use-all-employees';
