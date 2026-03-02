/**
 * Tasks React Query Hooks
 * Provides data fetching and mutations for task management
 */

import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import {
  fetchTasks,
  fetchTaskById,
  fetchTaskActivities,
  fetchSubtasks,
  fetchTaskDashboardStats,
  type TaskFilters,
  type TaskCreateInput,
  type TaskUpdateInput,
} from '../api/tasks-api';
import {
  createTaskAction,
  updateTaskAction,
  deleteTaskAction,
  restoreTaskAction,
  updateTaskStatusAction,
  completeTaskAction,
  addTaskCommentAction,
  toggleTaskTimerAction,
  type CreateTaskInput,
  type UpdateTaskInput,
} from '@/app/actions/tasks';
import type { TaskStatus } from '@/lib/types/prisma-extended';
import type { Task } from '@prisma/client';

// Helper to convert legacy update format to flat format
function toUpdateTaskInput(input: UpdateTaskInput | { systemId: string; data: TaskUpdateInput }): UpdateTaskInput {
  const i = input as Record<string, unknown>;
  if (i.data && typeof i.data === 'object') {
    return {
      systemId: i.systemId as string,
      ...(i.data as Record<string, unknown>),
    } as UpdateTaskInput;
  }
  return input as UpdateTaskInput;
}

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
  stats: () => [...taskKeys.all, 'stats'] as const,
  dashboardStats: (createdFrom?: string) => [...taskKeys.all, 'dashboard-stats', createdFrom] as const,
};

// Types for initial data from Server Components
export interface TaskStats {
  todo: number;
  inProgress: number;
  completed: number;
  overdue: number;
}

/**
 * Hook for task statistics with optional initial data from Server Component
 */
export function useTaskStats(initialData?: TaskStats) {
  return useQuery({
    queryKey: taskKeys.stats(),
    queryFn: async () => {
      const res = await fetch('/api/tasks/stats');
      if (!res.ok) throw new Error('Failed to fetch task stats');
      return res.json() as Promise<TaskStats>;
    },
    initialData,
    staleTime: initialData ? 60_000 : 0,
    gcTime: 10 * 60 * 1000,
  });
}

/**
 * Hook for comprehensive dashboard statistics — server-side aggregation.
 * No raw task data is loaded; all metrics computed on the server.
 */
export function useTaskDashboardStats(createdFrom?: string) {
  return useQuery({
    queryKey: taskKeys.dashboardStats(createdFrom),
    queryFn: () => fetchTaskDashboardStats({ createdFrom }),
    staleTime: 1000 * 60 * 2, // 2 minutes
    gcTime: 10 * 60 * 1000,
    placeholderData: keepPreviousData,
  });
}

/**
 * Hook to fetch tasks with filters
 */
export function useTasks(filters: TaskFilters = {}) {
  return useQuery({
    queryKey: taskKeys.list(filters),
    queryFn: () => fetchTasks(filters),
    staleTime: 1000 * 60, // 1 minute - tasks change frequently
    placeholderData: keepPreviousData,
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
    mutationFn: async (data: CreateTaskInput | TaskCreateInput) => {
      const input = data as CreateTaskInput;
      const result = await createTaskAction(input);
      if (!result.success) {
        throw new Error(result.error || 'Failed to create task');
      }
      return result.data as Task;
    },
    onSuccess: () => {
      invalidateTasks();
      options.onSuccess?.();
    },
    onError: options.onError,
  });

  const update = useMutation({
    mutationFn: async (input: UpdateTaskInput | { systemId: string; data: TaskUpdateInput }) => {
      const data = toUpdateTaskInput(input);
      const result = await updateTaskAction(data);
      if (!result.success) {
        throw new Error(result.error || 'Failed to update task');
      }
      return result.data as Task;
    },
    onSuccess: () => {
      invalidateTasks();
      options.onSuccess?.();
    },
    onError: options.onError,
  });

  const remove = useMutation({
    mutationFn: async (systemId: string) => {
      const result = await deleteTaskAction(systemId);
      if (!result.success) {
        throw new Error(result.error || 'Failed to delete task');
      }
      return result.data as Task;
    },
    // Optimistic delete - UI cập nhật ngay lập tức
    onMutate: async (systemId) => {
      await queryClient.cancelQueries({ queryKey: taskKeys.lists() });
      
      const previousLists = queryClient.getQueriesData({ queryKey: taskKeys.lists() });
      
      queryClient.setQueriesData(
        { queryKey: taskKeys.lists() },
        (old: { data?: Array<{ systemId: string }>, pagination?: unknown } | undefined) => {
          if (!old?.data) return old;
          return {
            ...old,
            data: old.data.filter(item => item.systemId !== systemId),
          };
        }
      );
      
      return { previousLists };
    },
    onError: (_err, _systemId, context) => {
      if (context?.previousLists) {
        context.previousLists.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
      options.onError?.(_err as Error);
    },
    onSuccess: () => {
      options.onSuccess?.();
    },
    onSettled: () => {
      invalidateTasks();
    },
  });

  const restore = useMutation({
    mutationFn: async (systemId: string) => {
      const result = await restoreTaskAction(systemId);
      if (!result.success) {
        throw new Error(result.error || 'Failed to restore task');
      }
      return result.data as Task;
    },
    onSuccess: () => {
      invalidateTasks();
      options.onSuccess?.();
    },
    onError: options.onError,
  });

  const changeStatus = useMutation({
    mutationFn: async ({ systemId, status }: { systemId: string; status: TaskStatus }) => {
      const result = await updateTaskStatusAction(systemId, status as unknown as import('@prisma/client').TaskStatus);
      if (!result.success) {
        throw new Error(result.error || 'Failed to update task status');
      }
      return result.data as Task;
    },
    onSuccess: () => {
      invalidateTasks();
      options.onSuccess?.();
    },
    onError: options.onError,
  });

  const complete = useMutation({
    mutationFn: async (systemId: string) => {
      const result = await completeTaskAction(systemId);
      if (!result.success) {
        throw new Error(result.error || 'Failed to complete task');
      }
      return result.data as Task;
    },
    onSuccess: () => {
      invalidateTasks();
      options.onSuccess?.();
    },
    onError: options.onError,
  });

  const addComment = useMutation({
    mutationFn: async ({ systemId, content }: { systemId: string; content: string }) => {
      const result = await addTaskCommentAction(systemId, content);
      if (!result.success) {
        throw new Error(result.error || 'Failed to add comment');
      }
      return result.data as Task;
    },
    onSuccess: (_, { systemId }) => {
      queryClient.invalidateQueries({ queryKey: taskKeys.activities(systemId) });
      options.onSuccess?.();
    },
    onError: options.onError,
  });

  const toggleTimer = useMutation({
    mutationFn: async ({ systemId, action }: { systemId: string; action: 'start' | 'stop' }) => {
      const result = await toggleTaskTimerAction(systemId, action);
      if (!result.success) {
        throw new Error(result.error || 'Failed to toggle timer');
      }
      return result.data as Task;
    },
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
