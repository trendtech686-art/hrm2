/**
 * Tasks React Query Hooks
 * Provides data fetching and mutations for task management
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  fetchTasks,
  fetchTaskById,
  createTask,
  updateTask,
  deleteTask,
  restoreTask,
  updateTaskStatus,
  completeTask,
  fetchTaskActivities,
  addTaskComment,
  toggleTaskTimer,
  fetchSubtasks,
  type TaskFilters,
  type TaskCreateInput,
  type TaskUpdateInput,
} from '../api/tasks-api';
import type { TaskStatus } from '@/lib/types/prisma-extended';

// Query keys factory
export const taskKeys = {
  all: ['tasks'] as const,
  lists: () => [...taskKeys.all, 'list'] as const,
  list: (filters: TaskFilters) => [...taskKeys.lists(), filters] as const,
  details: () => [...taskKeys.all, 'detail'] as const,
  detail: (id: string) => [...taskKeys.details(), id] as const,
  activities: (id: string) => [...taskKeys.all, 'activities', id] as const,
  subtasks: (parentId: string) => [...taskKeys.all, 'subtasks', parentId] as const,
  myTasks: (assigneeId: string) => [...taskKeys.all, 'my', assigneeId] as const,
};

/**
 * Hook to fetch tasks with filters
 */
export function useTasks(filters: TaskFilters = {}) {
  return useQuery({
    queryKey: taskKeys.list(filters),
    queryFn: () => fetchTasks(filters),
    staleTime: 1000 * 60, // 1 minute - tasks change frequently
  });
}

/**
 * Hook to fetch single task
 */
export function useTaskById(systemId: string | undefined) {
  return useQuery({
    queryKey: taskKeys.detail(systemId!),
    queryFn: () => fetchTaskById(systemId!),
    enabled: !!systemId,
    staleTime: 1000 * 30, // 30 seconds
  });
}

/**
 * Hook to fetch task activities
 */
export function useTaskActivities(taskSystemId: string | undefined) {
  return useQuery({
    queryKey: taskKeys.activities(taskSystemId!),
    queryFn: () => fetchTaskActivities(taskSystemId!),
    enabled: !!taskSystemId,
    staleTime: 1000 * 30,
  });
}

/**
 * Hook to fetch subtasks
 */
export function useSubtasks(parentSystemId: string | undefined) {
  return useQuery({
    queryKey: taskKeys.subtasks(parentSystemId!),
    queryFn: () => fetchSubtasks(parentSystemId!),
    enabled: !!parentSystemId,
    staleTime: 1000 * 60,
  });
}

interface MutationCallbacks {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

/**
 * Hook providing task mutations
 */
export function useTaskMutations(options: MutationCallbacks = {}) {
  const queryClient = useQueryClient();

  const invalidateTasks = () => {
    queryClient.invalidateQueries({ queryKey: taskKeys.all });
  };

  const create = useMutation({
    mutationFn: (data: TaskCreateInput) => createTask(data),
    onSuccess: () => {
      invalidateTasks();
      options.onSuccess?.();
    },
    onError: options.onError,
  });

  const update = useMutation({
    mutationFn: ({ systemId, data }: { systemId: string; data: TaskUpdateInput }) =>
      updateTask(systemId, data),
    onSuccess: () => {
      invalidateTasks();
      options.onSuccess?.();
    },
    onError: options.onError,
  });

  const remove = useMutation({
    mutationFn: (systemId: string) => deleteTask(systemId),
    onSuccess: () => {
      invalidateTasks();
      options.onSuccess?.();
    },
    onError: options.onError,
  });

  const restore = useMutation({
    mutationFn: (systemId: string) => restoreTask(systemId),
    onSuccess: () => {
      invalidateTasks();
      options.onSuccess?.();
    },
    onError: options.onError,
  });

  const changeStatus = useMutation({
    mutationFn: ({ systemId, status }: { systemId: string; status: TaskStatus }) =>
      updateTaskStatus(systemId, status),
    onSuccess: () => {
      invalidateTasks();
      options.onSuccess?.();
    },
    onError: options.onError,
  });

  const complete = useMutation({
    mutationFn: (systemId: string) => completeTask(systemId),
    onSuccess: () => {
      invalidateTasks();
      options.onSuccess?.();
    },
    onError: options.onError,
  });

  const addComment = useMutation({
    mutationFn: ({ systemId, content }: { systemId: string; content: string }) =>
      addTaskComment(systemId, content),
    onSuccess: (_, { systemId }) => {
      queryClient.invalidateQueries({ queryKey: taskKeys.activities(systemId) });
      options.onSuccess?.();
    },
    onError: options.onError,
  });

  const toggleTimer = useMutation({
    mutationFn: ({ systemId, action }: { systemId: string; action: 'start' | 'stop' }) =>
      toggleTaskTimer(systemId, action),
    onSuccess: () => {
      invalidateTasks();
      options.onSuccess?.();
    },
    onError: options.onError,
  });

  return {
    create,
    update,
    remove,
    restore,
    changeStatus,
    complete,
    addComment,
    toggleTimer,
    isLoading:
      create.isPending ||
      update.isPending ||
      remove.isPending ||
      restore.isPending ||
      changeStatus.isPending ||
      complete.isPending ||
      addComment.isPending ||
      toggleTimer.isPending,
  };
}

/**
 * Hook to fetch user's assigned tasks
 */
export function useMyTasks(assigneeId: string | undefined) {
  return useTasks({
    assigneeId: assigneeId || '',
    limit: 50,
  });
}

/**
 * Hook to fetch tasks by status
 */
export function useTasksByStatus(status: TaskStatus) {
  return useTasks({ status });
}

/**
 * Hook to fetch overdue tasks
 */
export function useOverdueTasks() {
  const today = new Date().toISOString().split('T')[0];
  return useTasks({
    dueTo: today,
    status: 'Đang thực hiện',
  });
}
