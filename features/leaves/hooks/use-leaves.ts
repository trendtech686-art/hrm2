/**
 * Leaves React Query Hooks
 * Provides data fetching and mutations for leave requests
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  fetchLeaves,
  fetchLeaveById,
  createLeave,
  updateLeave,
  deleteLeave,
  restoreLeave,
  hardDeleteLeave,
  approveLeave,
  rejectLeave,
  cancelLeave,
  fetchLeaveQuota,
  type LeaveFilters,
  type LeaveCreateInput,
  type LeaveUpdateInput,
} from '../api/leaves-api';

// Query keys factory
export const leaveKeys = {
  all: ['leaves'] as const,
  lists: () => [...leaveKeys.all, 'list'] as const,
  list: (filters: LeaveFilters) => [...leaveKeys.lists(), filters] as const,
  details: () => [...leaveKeys.all, 'detail'] as const,
  detail: (id: string) => [...leaveKeys.details(), id] as const,
  quota: (employeeId: string, year?: number) => 
    [...leaveKeys.all, 'quota', employeeId, year] as const,
};

/**
 * Hook to fetch leave requests with filters
 */
export function useLeaves(filters: LeaveFilters = {}) {
  return useQuery({
    queryKey: leaveKeys.list(filters),
    queryFn: () => fetchLeaves(filters),
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
}

/**
 * Hook to fetch single leave request
 */
export function useLeaveById(systemId: string | undefined) {
  return useQuery({
    queryKey: leaveKeys.detail(systemId!),
    queryFn: () => fetchLeaveById(systemId!),
    enabled: !!systemId,
    staleTime: 1000 * 60,
  });
}

/**
 * Hook to fetch leave quota for an employee
 */
export function useLeaveQuota(employeeId: string | undefined, year?: number) {
  return useQuery({
    queryKey: leaveKeys.quota(employeeId!, year),
    queryFn: () => fetchLeaveQuota(employeeId!, year),
    enabled: !!employeeId,
    staleTime: 1000 * 60 * 5, // 5 minutes - quota doesn't change often
  });
}

interface MutationCallbacks {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

/**
 * Hook providing leave mutations
 */
export function useLeaveMutations(options: MutationCallbacks = {}) {
  const queryClient = useQueryClient();

  const invalidateLeaves = () => {
    queryClient.invalidateQueries({ queryKey: leaveKeys.all });
  };

  const create = useMutation({
    mutationFn: (data: LeaveCreateInput) => createLeave(data),
    onSuccess: () => {
      invalidateLeaves();
      options.onSuccess?.();
    },
    onError: options.onError,
  });

  const update = useMutation({
    mutationFn: ({ systemId, data }: { systemId: string; data: LeaveUpdateInput }) =>
      updateLeave(systemId, data),
    onSuccess: () => {
      invalidateLeaves();
      options.onSuccess?.();
    },
    onError: options.onError,
  });

  const remove = useMutation({
    mutationFn: (systemId: string) => deleteLeave(systemId),
    onSuccess: () => {
      invalidateLeaves();
      options.onSuccess?.();
    },
    onError: options.onError,
  });

  const restore = useMutation({
    mutationFn: (systemId: string) => restoreLeave(systemId),
    onSuccess: () => {
      invalidateLeaves();
      options.onSuccess?.();
    },
    onError: options.onError,
  });

  const hardDelete = useMutation({
    mutationFn: (systemId: string) => hardDeleteLeave(systemId),
    onSuccess: () => {
      invalidateLeaves();
      options.onSuccess?.();
    },
    onError: options.onError,
  });

  const approve = useMutation({
    mutationFn: ({ systemId, notes }: { systemId: string; notes?: string }) =>
      approveLeave(systemId, notes),
    onSuccess: () => {
      invalidateLeaves();
      options.onSuccess?.();
    },
    onError: options.onError,
  });

  const reject = useMutation({
    mutationFn: ({ systemId, reason }: { systemId: string; reason: string }) =>
      rejectLeave(systemId, reason),
    onSuccess: () => {
      invalidateLeaves();
      options.onSuccess?.();
    },
    onError: options.onError,
  });

  const cancel = useMutation({
    mutationFn: (systemId: string) => cancelLeave(systemId),
    onSuccess: () => {
      invalidateLeaves();
      options.onSuccess?.();
    },
    onError: options.onError,
  });

  return {
    create,
    update,
    remove,
    restore,
    hardDelete,
    approve,
    reject,
    cancel,
    isLoading:
      create.isPending ||
      update.isPending ||
      remove.isPending ||
      restore.isPending ||
      hardDelete.isPending ||
      approve.isPending ||
      reject.isPending ||
      cancel.isPending,
  };
}

/**
 * Hook to fetch pending leave requests (for managers)
 */
export function usePendingLeaves() {
  return useLeaves({ status: 'Chờ duyệt' });
}

/**
 * Hook to fetch employee's own leave requests
 */
export function useMyLeaves(employeeId: string | undefined) {
  return useLeaves({
    employeeId: employeeId || '',
    limit: 50,
  });
}
