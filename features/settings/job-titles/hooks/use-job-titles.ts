/**
 * useJobTitles - React Query hooks
 * 
 * ⚠️ Direct import: import { useJobTitles } from '@/features/settings/job-titles/hooks/use-job-titles'
 */

import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import { generateSubEntityId } from '@/lib/id-utils';
import {
  fetchJobTitles,
  fetchJobTitle,
  createJobTitle,
  updateJobTitle,
  deleteJobTitle,
  type JobTitlesParams,
  type JobTitle,
  type JobTitlesResponse,
} from '../api/job-titles-api';

export const jobTitleKeys = {
  all: ['job-titles'] as const,
  lists: () => [...jobTitleKeys.all, 'list'] as const,
  list: (params: JobTitlesParams) => [...jobTitleKeys.lists(), params] as const,
  details: () => [...jobTitleKeys.all, 'detail'] as const,
  detail: (id: string) => [...jobTitleKeys.details(), id] as const,
};

export function useJobTitles(params: JobTitlesParams = {}) {
  return useQuery({
    queryKey: jobTitleKeys.list(params),
    queryFn: () => fetchJobTitles(params),
    staleTime: 10 * 60 * 1000,
    gcTime: 60 * 60 * 1000,
    placeholderData: keepPreviousData,
  });
}

export function useJobTitle(id: string | null | undefined) {
  return useQuery({
    queryKey: jobTitleKeys.detail(id!),
    queryFn: () => fetchJobTitle(id!),
    enabled: !!id,
    staleTime: 10 * 60 * 1000,
    gcTime: 60 * 60 * 1000,
  });
}

interface UseJobTitleMutationsOptions {
  onCreateSuccess?: (jobTitle: JobTitle) => void;
  onUpdateSuccess?: (jobTitle: JobTitle) => void;
  onDeleteSuccess?: () => void;
  onError?: (error: Error) => void;
}

export function useJobTitleMutations(options: UseJobTitleMutationsOptions = {}) {
  const queryClient = useQueryClient();
  
  const create = useMutation({
    mutationFn: createJobTitle,
    onMutate: async (newData) => {
      // Cancel outgoing queries
      await queryClient.cancelQueries({ queryKey: jobTitleKeys.lists() });
      
      // Snapshot previous value
      const previousData = queryClient.getQueriesData({ queryKey: jobTitleKeys.lists() });
      
      // Optimistically add to all list queries
      queryClient.setQueriesData({ queryKey: jobTitleKeys.lists() }, (old: JobTitlesResponse | JobTitle[] | undefined) => {
        if (!old) return old;
        const dataArray = Array.isArray(old) ? old : (old.data ?? []);
        const tempItem = {
          ...newData,
          systemId: generateSubEntityId('TEMP'),
          id: generateSubEntityId('TEMP'),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        return Array.isArray(old) ? [...dataArray, tempItem] : { ...old, data: [...dataArray, tempItem] };
      });
      
      return { previousData };
    },
    onSuccess: (data) => {
      // Replace temp item with real data
      queryClient.setQueriesData({ queryKey: jobTitleKeys.lists() }, (old: JobTitlesResponse | JobTitle[] | undefined) => {
        if (!old) return old;
        const dataArray = Array.isArray(old) ? old : (old.data ?? []);
        const filtered = dataArray.filter((item: JobTitle) => !item.systemId?.startsWith('temp-'));
        return Array.isArray(old) ? [...filtered, data] : { ...old, data: [...filtered, data] };
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
    mutationFn: ({ systemId, data }: { systemId: string; data: Partial<JobTitle> }) => 
      updateJobTitle(systemId, data),
    onMutate: async ({ systemId, data: updateData }) => {
      // Cancel outgoing queries
      await queryClient.cancelQueries({ queryKey: jobTitleKeys.lists() });
      await queryClient.cancelQueries({ queryKey: jobTitleKeys.detail(systemId) });
      
      // Snapshot previous values
      const previousLists = queryClient.getQueriesData({ queryKey: jobTitleKeys.lists() });
      const previousDetail = queryClient.getQueryData(jobTitleKeys.detail(systemId));
      
      // Optimistically update in lists
      queryClient.setQueriesData({ queryKey: jobTitleKeys.lists() }, (old: JobTitlesResponse | JobTitle[] | undefined) => {
        if (!old) return old;
        const dataArray = Array.isArray(old) ? old : (old.data ?? []);
        const updated = dataArray.map((item: JobTitle) =>
          item.systemId === systemId ? { ...item, ...updateData, updatedAt: new Date().toISOString() } : item
        );
        return Array.isArray(old) ? updated : { ...old, data: updated };
      });
      
      // Optimistically update detail
      queryClient.setQueryData(jobTitleKeys.detail(systemId), (old: JobTitle | undefined) =>
        old ? { ...old, ...updateData, updatedAt: new Date().toISOString() } : old
      );
      
      return { previousLists, previousDetail, systemId };
    },
    onSuccess: (data, variables) => {
      // Update with server data
      queryClient.setQueriesData({ queryKey: jobTitleKeys.lists() }, (old: JobTitlesResponse | JobTitle[] | undefined) => {
        if (!old) return old;
        const dataArray = Array.isArray(old) ? old : (old.data ?? []);
        const updated = dataArray.map((item: JobTitle) => (item.systemId === variables.systemId ? data : item));
        return Array.isArray(old) ? updated : { ...old, data: updated };
      });
      queryClient.setQueryData(jobTitleKeys.detail(variables.systemId), data);
      options.onUpdateSuccess?.(data);
    },
    onError: (error, _, context) => {
      // Rollback on error
      context?.previousLists?.forEach(([queryKey, data]) => {
        queryClient.setQueryData(queryKey, data);
      });
      if (context?.previousDetail && context?.systemId) {
        queryClient.setQueryData(jobTitleKeys.detail(context.systemId), context.previousDetail);
      }
      options.onError?.(error as Error);
    },
  });
  
  const remove = useMutation({
    mutationFn: deleteJobTitle,
    onMutate: async (systemId) => {
      // Cancel outgoing queries
      await queryClient.cancelQueries({ queryKey: jobTitleKeys.lists() });
      
      // Snapshot previous value
      const previousData = queryClient.getQueriesData({ queryKey: jobTitleKeys.lists() });
      
      // Optimistically remove from lists
      queryClient.setQueriesData({ queryKey: jobTitleKeys.lists() }, (old: JobTitlesResponse | JobTitle[] | undefined) => {
        if (!old) return old;
        const dataArray = Array.isArray(old) ? old : (old.data ?? []);
        const filtered = dataArray.filter((item: JobTitle) => item.systemId !== systemId);
        return Array.isArray(old) ? filtered : { ...old, data: filtered };
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

export function useAllJobTitles() {
  return useJobTitles();
}
