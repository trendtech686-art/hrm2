/**
 * Task Boards React Query Hooks
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { invalidateRelated } from '@/lib/query-invalidation-map';
import * as api from '../api/boards-api';
import type { TaskBoard } from '../api/boards-api';

export const boardKeys = {
  all: ['task-boards'] as const,
  lists: () => [...boardKeys.all, 'list'] as const,
  details: () => [...boardKeys.all, 'detail'] as const,
  detail: (id: string) => [...boardKeys.details(), id] as const,
};

export function useTaskBoards() {
  return useQuery({
    queryKey: boardKeys.lists(),
    queryFn: api.fetchTaskBoards,
    staleTime: 1000 * 60 * 5,
  });
}

export function useTaskBoardById(systemId: string | undefined) {
  return useQuery({
    queryKey: boardKeys.detail(systemId!),
    queryFn: () => api.fetchTaskBoardById(systemId!),
    enabled: !!systemId,
    staleTime: 1000 * 60 * 5,
  });
}

interface MutationCallbacks {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

export function useTaskBoardMutations(options: MutationCallbacks = {}) {
  const queryClient = useQueryClient();

  const invalidateBoards = () => invalidateRelated(queryClient, 'task-boards');

  const create = useMutation({
    mutationFn: api.createTaskBoard,
    onSuccess: () => {
      invalidateBoards();
      options.onSuccess?.();
    },
    onError: options.onError,
  });

  const update = useMutation({
    mutationFn: ({ systemId, data }: { systemId: string; data: Partial<TaskBoard> }) =>
      api.updateTaskBoard(systemId, data),
    onSuccess: () => {
      invalidateBoards();
      options.onSuccess?.();
    },
    onError: options.onError,
  });

  const remove = useMutation({
    mutationFn: api.deleteTaskBoard,
    onSuccess: () => {
      invalidateBoards();
      options.onSuccess?.();
    },
    onError: options.onError,
  });

  return { create, update, remove };
}
