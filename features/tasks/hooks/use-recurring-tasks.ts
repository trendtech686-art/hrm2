/**
 * Recurring Tasks React Query Hooks
 * Provides data fetching and mutations for recurring task definitions
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as api from '../api/recurring-tasks-api';
import type { RecurringTask } from '../recurring-types';

// Query keys factory
export const recurringTaskKeys = {
  all: ['recurring-tasks'] as const,
  lists: () => [...recurringTaskKeys.all, 'list'] as const,
  details: () => [...recurringTaskKeys.all, 'detail'] as const,
  detail: (id: string) => [...recurringTaskKeys.details(), id] as const,
};

/**
 * Hook to fetch all recurring tasks
 */
export function useRecurringTasks() {
  return useQuery({
    queryKey: recurringTaskKeys.lists(),
    queryFn: api.fetchRecurringTasks,
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
}

/**
 * Hook to fetch single recurring task
 */
export function useRecurringTaskById(systemId: string | undefined) {
  return useQuery({
    queryKey: recurringTaskKeys.detail(systemId!),
    queryFn: () => api.fetchRecurringTaskById(systemId!),
    enabled: !!systemId,
    staleTime: 1000 * 60 * 2,
  });
}

interface MutationCallbacks {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

/**
 * Hook providing recurring task mutations
 */
export function useRecurringTaskMutations(options: MutationCallbacks = {}) {
  const queryClient = useQueryClient();

  const invalidateRecurringTasks = () => {
    queryClient.invalidateQueries({ queryKey: recurringTaskKeys.all });
  };

  const create = useMutation({
    mutationFn: api.createRecurringTask,
    onSuccess: () => {
      invalidateRecurringTasks();
      options.onSuccess?.();
    },
    onError: options.onError,
  });

  const update = useMutation({
    mutationFn: ({ systemId, data }: { systemId: string; data: Partial<RecurringTask> }) =>
      api.updateRecurringTask(systemId, data),
    onSuccess: () => {
      invalidateRecurringTasks();
      options.onSuccess?.();
    },
    onError: options.onError,
  });

  const remove = useMutation({
    mutationFn: api.deleteRecurringTask,
    onSuccess: () => {
      invalidateRecurringTasks();
      options.onSuccess?.();
    },
    onError: options.onError,
  });

  const togglePause = useMutation({
    mutationFn: api.toggleRecurringTaskPause,
    onSuccess: () => {
      invalidateRecurringTasks();
      options.onSuccess?.();
    },
    onError: options.onError,
  });

  const process = useMutation({
    mutationFn: api.processRecurringTasks,
    onSuccess: () => {
      invalidateRecurringTasks();
      // Also invalidate tasks since new ones were created
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      options.onSuccess?.();
    },
    onError: options.onError,
  });

  return {
    create,
    update,
    remove,
    togglePause,
    process,
  };
}
