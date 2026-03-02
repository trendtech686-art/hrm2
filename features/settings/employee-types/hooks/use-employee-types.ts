/**
 * useEmployeeTypes - React Query hooks
 * 
 * ⚠️ Direct import: import { useEmployeeTypes } from '@/features/settings/employee-types/hooks/use-employee-types'
 */

import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import { generateSubEntityId } from '@/lib/id-utils';
import {
  fetchEmployeeTypes,
  fetchEmployeeType,
  createEmployeeType,
  updateEmployeeType,
  deleteEmployeeType,
  type EmployeeTypesParams,
  type EmployeeTypesResponse,
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
    onMutate: async (newData) => {
      // Cancel outgoing queries
      await queryClient.cancelQueries({ queryKey: employeeTypeKeys.lists() });
      
      // Snapshot previous value
      const previousData = queryClient.getQueriesData({ queryKey: employeeTypeKeys.lists() });
      
      // Optimistically add to all list queries
      queryClient.setQueriesData({ queryKey: employeeTypeKeys.lists() }, (old: unknown) => {
        if (!old) return old;
        const oldData = old as EmployeeTypesResponse | EmployeeTypeSetting[];
        const dataArray = Array.isArray(oldData) ? oldData : (oldData.data ?? []);
        const tempItem = {
          ...newData,
          systemId: generateSubEntityId('TEMP'),
          id: generateSubEntityId('TEMP'),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        return Array.isArray(oldData) ? [...dataArray, tempItem] : { ...oldData, data: [...dataArray, tempItem] };
      });
      
      return { previousData };
    },
    onSuccess: (data) => {
      // Replace temp item with real data
      queryClient.setQueriesData({ queryKey: employeeTypeKeys.lists() }, (old: unknown) => {
        if (!old) return old;
        const oldData = old as EmployeeTypesResponse | EmployeeTypeSetting[];
        const dataArray = Array.isArray(oldData) ? oldData : (oldData.data ?? []);
        const filtered = dataArray.filter((item: EmployeeTypeSetting) => !item.systemId?.startsWith('temp-'));
        return Array.isArray(oldData) ? [...filtered, data] : { ...oldData, data: [...filtered, data] };
      });
      options.onCreateSuccess?.(data);
    },
    onError: (error, _, context) => {
      // Rollback on error
      context?.previousData?.forEach(([queryKey, data]) => {
        queryClient.setQueryData(queryKey, data);
      });
      options.onError?.(error as Error);
    },
  });
  
  const update = useMutation({
    mutationFn: ({ systemId, data }: { systemId: string; data: Partial<EmployeeTypeSetting> }) => 
      updateEmployeeType(systemId, data),
    onMutate: async ({ systemId, data: updateData }) => {
      // Cancel outgoing queries
      await queryClient.cancelQueries({ queryKey: employeeTypeKeys.lists() });
      await queryClient.cancelQueries({ queryKey: employeeTypeKeys.detail(systemId) });
      
      // Snapshot previous values
      const previousLists = queryClient.getQueriesData({ queryKey: employeeTypeKeys.lists() });
      const previousDetail = queryClient.getQueryData(employeeTypeKeys.detail(systemId));
      
      // Optimistically update in lists
      queryClient.setQueriesData({ queryKey: employeeTypeKeys.lists() }, (old: unknown) => {
        if (!old) return old;
        const oldData = old as EmployeeTypesResponse | EmployeeTypeSetting[];
        const dataArray = Array.isArray(oldData) ? oldData : (oldData.data ?? []);
        const updated = dataArray.map((item: EmployeeTypeSetting) =>
          item.systemId === systemId ? { ...item, ...updateData, updatedAt: new Date().toISOString() } : item
        );
        return Array.isArray(oldData) ? updated : { ...oldData, data: updated };
      });
      
      // Optimistically update detail
      queryClient.setQueryData(employeeTypeKeys.detail(systemId), (old: unknown) =>
        old ? { ...(old as EmployeeTypeSetting), ...updateData, updatedAt: new Date().toISOString() } : old
      );
      
      return { previousLists, previousDetail, systemId };
    },
    onSuccess: (data, variables) => {
      // Update with server data
      queryClient.setQueriesData({ queryKey: employeeTypeKeys.lists() }, (old: unknown) => {
        if (!old) return old;
        const oldData = old as EmployeeTypesResponse | EmployeeTypeSetting[];
        const dataArray = Array.isArray(oldData) ? oldData : (oldData.data ?? []);
        const updated = dataArray.map((item: EmployeeTypeSetting) => (item.systemId === variables.systemId ? data : item));
        return Array.isArray(oldData) ? updated : { ...oldData, data: updated };
      });
      queryClient.setQueryData(employeeTypeKeys.detail(variables.systemId), data);
      options.onUpdateSuccess?.(data);
    },
    onError: (error, _, context) => {
      // Rollback on error
      context?.previousLists?.forEach(([queryKey, data]) => {
        queryClient.setQueryData(queryKey, data);
      });
      if (context?.previousDetail && context?.systemId) {
        queryClient.setQueryData(employeeTypeKeys.detail(context.systemId), context.previousDetail);
      }
      options.onError?.(error as Error);
    },
  });
  
  const remove = useMutation({
    mutationFn: deleteEmployeeType,
    onMutate: async (systemId) => {
      // Cancel outgoing queries
      await queryClient.cancelQueries({ queryKey: employeeTypeKeys.lists() });
      
      // Snapshot previous value
      const previousData = queryClient.getQueriesData({ queryKey: employeeTypeKeys.lists() });
      
      // Optimistically remove from lists
      queryClient.setQueriesData({ queryKey: employeeTypeKeys.lists() }, (old: unknown) => {
        if (!old) return old;
        const oldData = old as EmployeeTypesResponse | EmployeeTypeSetting[];
        const dataArray = Array.isArray(oldData) ? oldData : (oldData.data ?? []);
        const filtered = dataArray.filter((item: EmployeeTypeSetting) => item.systemId !== systemId);
        return Array.isArray(oldData) ? filtered : { ...oldData, data: filtered };
      });
      
      return { previousData };
    },
    onSuccess: () => {
      options.onDeleteSuccess?.();
    },
    onError: (error, _, context) => {
      // Rollback on error
      context?.previousData?.forEach(([queryKey, data]) => {
        queryClient.setQueryData(queryKey, data);
      });
      options.onError?.(error as Error);
    },
  });
  
  return { create, update, remove };
}
