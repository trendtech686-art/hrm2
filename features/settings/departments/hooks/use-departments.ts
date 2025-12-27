/**
 * useDepartments - React Query hooks
 * 
 * ⚠️ Direct import: import { useDepartments } from '@/features/settings/departments/hooks/use-departments'
 */

import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import {
  fetchDepartments,
  fetchDepartment,
  createDepartment,
  updateDepartment,
  deleteDepartment,
  type DepartmentsParams,
  type Department,
} from '../api/departments-api';

export const departmentKeys = {
  all: ['departments'] as const,
  lists: () => [...departmentKeys.all, 'list'] as const,
  list: (params: DepartmentsParams) => [...departmentKeys.lists(), params] as const,
  details: () => [...departmentKeys.all, 'detail'] as const,
  detail: (id: string) => [...departmentKeys.details(), id] as const,
};

export function useDepartments(params: DepartmentsParams = {}) {
  return useQuery({
    queryKey: departmentKeys.list(params),
    queryFn: () => fetchDepartments(params),
    staleTime: 10 * 60 * 1000,
    gcTime: 60 * 60 * 1000,
    placeholderData: keepPreviousData,
  });
}

export function useDepartment(id: string | null | undefined) {
  return useQuery({
    queryKey: departmentKeys.detail(id!),
    queryFn: () => fetchDepartment(id!),
    enabled: !!id,
    staleTime: 10 * 60 * 1000,
  });
}

interface UseDepartmentMutationsOptions {
  onCreateSuccess?: (department: Department) => void;
  onUpdateSuccess?: (department: Department) => void;
  onDeleteSuccess?: () => void;
  onError?: (error: Error) => void;
}

export function useDepartmentMutations(options: UseDepartmentMutationsOptions = {}) {
  const queryClient = useQueryClient();
  
  const create = useMutation({
    mutationFn: createDepartment,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: departmentKeys.all });
      options.onCreateSuccess?.(data);
    },
    onError: options.onError,
  });
  
  const update = useMutation({
    mutationFn: ({ systemId, data }: { systemId: string; data: Partial<Department> }) => 
      updateDepartment(systemId, data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: departmentKeys.detail(variables.systemId) });
      queryClient.invalidateQueries({ queryKey: departmentKeys.lists() });
      options.onUpdateSuccess?.(data);
    },
    onError: options.onError,
  });
  
  const remove = useMutation({
    mutationFn: deleteDepartment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: departmentKeys.all });
      options.onDeleteSuccess?.();
    },
    onError: options.onError,
  });
  
  return { create, update, remove };
}

export function useAllDepartments() {
  return useDepartments({ limit: 50 });
}
