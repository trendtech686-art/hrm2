/**
 * Task Templates React Query Hooks
 * Provides data fetching and mutations for task templates
 */

import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import { invalidateRelated } from '@/lib/query-invalidation-map';
import * as api from '../api/templates-api';
import type { TaskTemplate } from '../template-types';

// Query keys factory
export const templateKeys = {
  all: ['task-templates'] as const,
  lists: () => [...templateKeys.all, 'list'] as const,
  list: (filters: api.TaskTemplatesParams) => [...templateKeys.lists(), filters] as const,
  details: () => [...templateKeys.all, 'detail'] as const,
  detail: (id: string) => [...templateKeys.details(), id] as const,
};

/**
 * Hook to fetch task templates with filters and pagination
 * ✅ API Filter pattern - server-side search and pagination
 */
export function useTaskTemplates(filters: api.TaskTemplatesParams = {}) {
  return useQuery({
    queryKey: templateKeys.list(filters),
    queryFn: () => api.fetchTaskTemplates(filters),
    staleTime: 1000 * 60 * 5, // 5 minutes
    placeholderData: keepPreviousData,
  });
}

/**
 * Hook to fetch single template
 */
export function useTaskTemplateById(systemId: string | undefined) {
  return useQuery({
    queryKey: templateKeys.detail(systemId!),
    queryFn: () => api.fetchTaskTemplateById(systemId!),
    enabled: !!systemId,
    staleTime: 1000 * 60 * 5,
  });
}

interface MutationCallbacks {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

/**
 * Hook providing task template mutations
 */
export function useTaskTemplateMutations(options: MutationCallbacks = {}) {
  const queryClient = useQueryClient();

  const invalidateTemplates = () => invalidateRelated(queryClient, 'task-templates');

  const create = useMutation({
    mutationFn: api.createTaskTemplate,
    onSuccess: () => {
      invalidateTemplates();
      options.onSuccess?.();
    },
    onError: options.onError,
  });

  const update = useMutation({
    mutationFn: ({ systemId, data }: { systemId: string; data: Partial<TaskTemplate> }) =>
      api.updateTaskTemplate(systemId, data),
    onSuccess: () => {
      invalidateTemplates();
      options.onSuccess?.();
    },
    onError: options.onError,
  });

  const remove = useMutation({
    mutationFn: api.deleteTaskTemplate,
    onSuccess: () => {
      invalidateTemplates();
      options.onSuccess?.();
    },
    onError: options.onError,
  });

  const incrementUsage = useMutation({
    mutationFn: api.incrementTemplateUsage,
    onSuccess: () => {
      invalidateTemplates();
    },
    onError: options.onError,
  });

  return {
    create,
    update,
    remove,
    incrementUsage,
  };
}
