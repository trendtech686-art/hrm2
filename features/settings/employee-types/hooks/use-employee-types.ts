/**
 * useEmployeeTypes - React Query hooks
 * 
 * ⚠️ Direct import: import { useEmployeeTypes } from '@/features/settings/employee-types/hooks/use-employee-types'
 */

import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import {
  fetchEmployeeTypes,
  fetchEmployeeType,
  createEmployeeType,
  updateEmployeeType,
  deleteEmployeeType,
  type EmployeeTypesParams,
  type EmployeeTypeSetting,
} from '../api/employee-types-api';

export const employeeTypeKeys = {
  all: ['employee-types'] as const,
  lists: () => [...employeeTypeKeys.all, 'list'] as const,
  list: (params: EmployeeTypesParams) => [...employeeTypeKeys.lists(), params] as const,
  details: () => [...employeeTypeKeys.all, 'detail'] as const,
  detail: (id: string) => [...employeeTypeKeys.details(), id] as const,
};

export function useEmployeeTypes(params: EmployeeTypesParams = {}) {
  return useQuery({
    queryKey: employeeTypeKeys.list(params),
    queryFn: () => fetchEmployeeTypes(params),
    staleTime: 10 * 60 * 1000,
    gcTime: 60 * 60 * 1000,
    placeholderData: keepPreviousData,
  });
}

export function useEmployeeType(id: string | null | undefined) {
  return useQuery({
    queryKey: employeeTypeKeys.detail(id!),
    queryFn: () => fetchEmployeeType(id!),
    enabled: !!id,
    staleTime: 10 * 60 * 1000,
    gcTime: 60 * 60 * 1000,
  });
}

interface UseEmployeeTypeMutationsOptions {
  onCreateSuccess?: (employeeType: EmployeeTypeSetting) => void;
  onUpdateSuccess?: (employeeType: EmployeeTypeSetting) => void;
  onDeleteSuccess?: () => void;
  onError?: (error: Error) => void;
}

export function useEmployeeTypeMutations(options: UseEmployeeTypeMutationsOptions = {}) {
  const queryClient = useQueryClient();
  
  const create = useMutation({
    mutationFn: createEmployeeType,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: employeeTypeKeys.all });
      options.onCreateSuccess?.(data);
    },
    onError: options.onError,
  });
  
  const update = useMutation({
    mutationFn: ({ systemId, data }: { systemId: string; data: Partial<EmployeeTypeSetting> }) => 
      updateEmployeeType(systemId, data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: employeeTypeKeys.detail(variables.systemId) });
      queryClient.invalidateQueries({ queryKey: employeeTypeKeys.lists() });
      options.onUpdateSuccess?.(data);
    },
    onError: options.onError,
  });
  
  const remove = useMutation({
    mutationFn: deleteEmployeeType,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: employeeTypeKeys.all });
      options.onDeleteSuccess?.();
    },
    onError: options.onError,
  });
  
  return { create, update, remove };
}
