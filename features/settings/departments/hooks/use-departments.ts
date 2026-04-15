/**
 * useDepartments - React Query hooks
 * 
 * ⚠️ Direct import: import { useDepartments } from '@/features/settings/departments/hooks/use-departments'
 */

import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import { invalidateRelated } from '@/lib/query-invalidation-map';
import { generateSubEntityId } from '@/lib/id-utils';
import {
  fetchDepartments,
  fetchDepartment,
  createDepartment,
  updateDepartment,
  deleteDepartment,
  type DepartmentsParams,
  type DepartmentsResponse,
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
    gcTime: 60 * 60 * 1000,
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
    onMutate: async (newData) => {
      // Cancel outgoing queries
      await queryClient.cancelQueries({ queryKey: departmentKeys.lists() });
      
      // Snapshot previous value
      const previousData = queryClient.getQueriesData({ queryKey: departmentKeys.lists() });
      
      // Optimistically add to all list queries
      queryClient.setQueriesData({ queryKey: departmentKeys.lists() }, (old: unknown) => {
        if (!old) return old;
        const oldData = old as DepartmentsResponse | Department[];
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
      queryClient.setQueriesData({ queryKey: departmentKeys.lists() }, (old: unknown) => {
        if (!old) return old;
        const oldData = old as DepartmentsResponse | Department[];
        const dataArray = Array.isArray(oldData) ? oldData : (oldData.data ?? []);
        const filtered = dataArray.filter((item: Department) => !item.systemId?.startsWith('temp-'));
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
    mutationFn: ({ systemId, data }: { systemId: string; data: Partial<Department> }) => 
      updateDepartment(systemId, data),
    onMutate: async ({ systemId, data: updateData }) => {
      // Cancel outgoing queries
      await queryClient.cancelQueries({ queryKey: departmentKeys.lists() });
      await queryClient.cancelQueries({ queryKey: departmentKeys.detail(systemId) });
      
      // Snapshot previous values
      const previousLists = queryClient.getQueriesData({ queryKey: departmentKeys.lists() });
      const previousDetail = queryClient.getQueryData(departmentKeys.detail(systemId));
      
      // Optimistically update in lists
      queryClient.setQueriesData({ queryKey: departmentKeys.lists() }, (old: unknown) => {
        if (!old) return old;
        const oldData = old as DepartmentsResponse | Department[];
        const dataArray = Array.isArray(oldData) ? oldData : (oldData.data ?? []);
        const updated = dataArray.map((item: Department) =>
          item.systemId === systemId ? { ...item, ...updateData, updatedAt: new Date().toISOString() } : item
        );
        return Array.isArray(oldData) ? updated : { ...oldData, data: updated };
      });
      
      // Optimistically update detail
      queryClient.setQueryData(departmentKeys.detail(systemId), (old: unknown) =>
        old ? { ...(old as Department), ...updateData, updatedAt: new Date().toISOString() } : old
      );
      
      return { previousLists, previousDetail, systemId };
    },
    onSuccess: (data, variables) => {
      // Update with server data
      queryClient.setQueriesData({ queryKey: departmentKeys.lists() }, (old: unknown) => {
        if (!old) return old;
        const oldData = old as DepartmentsResponse | Department[];
        const dataArray = Array.isArray(oldData) ? oldData : (oldData.data ?? []);
        const updated = dataArray.map((item: Department) => (item.systemId === variables.systemId ? data : item));
        return Array.isArray(oldData) ? updated : { ...oldData, data: updated };
      });
      queryClient.setQueryData(departmentKeys.detail(variables.systemId), data);
      options.onUpdateSuccess?.(data);
    },
    onSettled: () => {
      invalidateRelated(queryClient, 'departments');
    },
    onError: (error, _, context) => {
      // Rollback on error
      context?.previousLists?.forEach(([queryKey, data]) => {
        queryClient.setQueryData(queryKey, data);
      });
      if (context?.previousDetail && context?.systemId) {
        queryClient.setQueryData(departmentKeys.detail(context.systemId), context.previousDetail);
      }
      options.onError?.(error as Error);
    },
  });
  
  const remove = useMutation({
    mutationFn: deleteDepartment,
    onMutate: async (systemId) => {
      // Cancel outgoing queries
      await queryClient.cancelQueries({ queryKey: departmentKeys.lists() });
      
      // Snapshot previous value
      const previousData = queryClient.getQueriesData({ queryKey: departmentKeys.lists() });
      
      // Optimistically remove from lists
      queryClient.setQueriesData({ queryKey: departmentKeys.lists() }, (old: unknown) => {
        if (!old) return old;
        const oldData = old as DepartmentsResponse | Department[];
        const dataArray = Array.isArray(oldData) ? oldData : (oldData.data ?? []);
        const filtered = dataArray.filter((item: Department) => item.systemId !== systemId);
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

export function useAllDepartments() {
  return useDepartments();
}
