/**
 * useEmployees - React Query hooks for employees
 * 
 * ⚠️ IMPORTANT: Direct import pattern
 * - Import this file directly: import { useEmployees } from '@/features/employees/hooks/use-employees'
 * - NEVER import from '@/features/employees' or '@/features/employees/store'
 * 
 * This hook is ISOLATED - it only depends on:
 * - @tanstack/react-query
 * - Local API functions
 * - Local types
 */

import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import {
  fetchEmployees,
  fetchEmployee,
  createEmployee,
  updateEmployee,
  deleteEmployee,
  searchEmployees,
  fetchEmployeesByDepartment,
  fetchEmployeesByBranch,
  type EmployeesParams,
  type CreateEmployeeInput,
  type UpdateEmployeeInput,
} from '../api/employees-api';

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
};

/**
 * Hook for fetching paginated employees list
 * 
 * @example
 * ```tsx
 * function EmployeesPage() {
 *   const [page, setPage] = useState(1);
 *   const { data, isLoading } = useEmployees({ page, limit: 50 });
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
export function useEmployees(params: EmployeesParams = {}) {
  return useQuery({
    queryKey: employeeKeys.list(params),
    queryFn: () => fetchEmployees(params),
    staleTime: 60_000, // 1 minute - employees don't change frequently
    gcTime: 10 * 60 * 1000, // 10 minutes
    placeholderData: keepPreviousData,
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
    mutationFn: createEmployee,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: employeeKeys.lists() });
      options.onCreateSuccess?.(data);
    },
    onError: options.onError,
  });
  
  const update = useMutation({
    mutationFn: updateEmployee,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: employeeKeys.detail(variables.systemId) });
      queryClient.invalidateQueries({ queryKey: employeeKeys.lists() });
      options.onUpdateSuccess?.(data);
    },
    onError: options.onError,
  });
  
  const remove = useMutation({
    mutationFn: deleteEmployee,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: employeeKeys.all });
      options.onDeleteSuccess?.();
    },
    onError: options.onError,
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

// Re-export from use-all-employees for backward compatibility
export { useAllEmployees, useEmployeeOptions, useEmployeeFinder, useEmployeeSearcher } from './use-all-employees';
