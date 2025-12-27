/**
 * useJobTitles - React Query hooks
 * 
 * ⚠️ Direct import: import { useJobTitles } from '@/features/settings/job-titles/hooks/use-job-titles'
 */

import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import {
  fetchJobTitles,
  fetchJobTitle,
  createJobTitle,
  updateJobTitle,
  deleteJobTitle,
  type JobTitlesParams,
  type JobTitle,
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
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: jobTitleKeys.all });
      options.onCreateSuccess?.(data);
    },
    onError: options.onError,
  });
  
  const update = useMutation({
    mutationFn: ({ systemId, data }: { systemId: string; data: Partial<JobTitle> }) => 
      updateJobTitle(systemId, data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: jobTitleKeys.detail(variables.systemId) });
      queryClient.invalidateQueries({ queryKey: jobTitleKeys.lists() });
      options.onUpdateSuccess?.(data);
    },
    onError: options.onError,
  });
  
  const remove = useMutation({
    mutationFn: deleteJobTitle,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: jobTitleKeys.all });
      options.onDeleteSuccess?.();
    },
    onError: options.onError,
  });
  
  return { create, update, remove };
}

export function useAllJobTitles() {
  return useJobTitles({ limit: 50 });
}
