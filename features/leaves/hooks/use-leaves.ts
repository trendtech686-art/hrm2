/**
 * Leaves React Query Hooks
 * Provides data fetching and mutations for leave requests
 */

import { useQuery, useQueries, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import {
  fetchLeaves,
  fetchLeaveById,
  restoreLeave,
  hardDeleteLeave,
  fetchLeaveQuota,
  type LeaveFilters,
  type LeaveCreateInput,
  type LeaveUpdateInput,
} from '../api/leaves-api';
import {
  createLeaveAction,
  updateLeaveAction,
  deleteLeaveAction,
  approveLeaveAction,
  rejectLeaveAction,
  cancelLeaveAction,
} from '@/app/actions/leaves';

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
    placeholderData: keepPreviousData,
  });
}

/**
 * Hook for leaves overlapping a date range with a specific status (server-side)
 * Returns ONE page of results + total count.
 * For consumers that only need the count, use `total`.
 * For consumers that need ALL records, use `useAllLeavesByDateRange` instead.
 */
export function useLeavesByDateRange(options: {
  status?: string;
  fromDate?: string;
  toDate?: string;
  employeeId?: string;
  page?: number;
  limit?: number;
}) {
  const filters: LeaveFilters = {
    status: options.status,
    fromDate: options.fromDate,
    toDate: options.toDate,
    employeeId: options.employeeId,
    page: options.page,
    limit: options.limit,
  };
  const query = useLeaves(filters);
  return {
    data: query.data?.data || [],
    pagination: query.data?.pagination,
    total: query.data?.pagination?.total || 0,
    isLoading: query.isLoading,
    isError: query.isError,
  };
}

/**
 * Auto-paginating hook that fetches ALL leaves matching a date range.
 * Used when computation requires the complete dataset (attendance sync, payroll).
 * Fetches in standard page sizes and merges all results automatically.
 */
export function useAllLeavesByDateRange(options: {
  status?: string;
  fromDate?: string;
  toDate?: string;
  employeeId?: string;
}) {
  const PAGE_SIZE = 100;
  const hasFilters = !!(options.fromDate && options.toDate);

  const baseFilters: LeaveFilters = {
    status: options.status,
    fromDate: options.fromDate,
    toDate: options.toDate,
    employeeId: options.employeeId,
    page: 1,
    limit: PAGE_SIZE,
  };

  // Step 1: Fetch first page to discover totalPages
  const firstPage = useQuery({
    queryKey: leaveKeys.list(baseFilters),
    queryFn: () => fetchLeaves(baseFilters),
    staleTime: 1000 * 60 * 2,
    enabled: hasFilters,
  });

  const totalPages = firstPage.data?.pagination?.totalPages || 1;

  // Step 2: Fetch remaining pages in parallel (only when totalPages > 1)
  const remainingPageQueries = useQueries({
    queries: Array.from({ length: Math.max(0, totalPages - 1) }, (_, i) => ({
      queryKey: leaveKeys.list({ ...baseFilters, page: i + 2 }),
      queryFn: () => fetchLeaves({ ...baseFilters, page: i + 2 }),
      staleTime: 1000 * 60 * 2,
      enabled: hasFilters && totalPages > 1 && !!firstPage.data,
    })),
  });

  // Step 3: Merge all pages
  const isLoading = firstPage.isLoading || remainingPageQueries.some(q => q.isLoading);
  const firstPageData = firstPage.data?.data || [];

  // Only compute merged data when all pages are loaded
  const data = isLoading || totalPages <= 1
    ? firstPageData
    : [...firstPageData, ...remainingPageQueries.flatMap(q => q.data?.data || [])];

  return {
    data,
    total: firstPage.data?.pagination?.total || 0,
    isLoading,
    isError: firstPage.isError,
  };
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

// --- Batch mutation hook ---

export function useBatchLeaveMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: import('../api/leaves-api').BatchInput) =>
      import('../api/leaves-api').then(m => m.batchLeaves(input)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: leaveKeys.all });
    },
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
    mutationFn: async (data: LeaveCreateInput) => {
      const result = await createLeaveAction(data as Parameters<typeof createLeaveAction>[0]);
      if (!result.success) throw new Error(result.error || 'Failed to create leave');
      return result.data;
    },
    onSuccess: () => {
      invalidateLeaves();
      options.onSuccess?.();
    },
    onError: options.onError,
  });

  const update = useMutation({
    mutationFn: async ({ systemId, data }: { systemId: string; data: LeaveUpdateInput }) => {
      const result = await updateLeaveAction({ systemId, ...data } as Parameters<typeof updateLeaveAction>[0]);
      if (!result.success) throw new Error(result.error || 'Failed to update leave');
      return result.data;
    },
    onSuccess: () => {
      invalidateLeaves();
      options.onSuccess?.();
    },
    onError: options.onError,
  });

  const remove = useMutation({
    mutationFn: async (systemId: string) => {
      const result = await deleteLeaveAction(systemId);
      if (!result.success) throw new Error(result.error || 'Failed to delete leave');
      return result.data;
    },
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
    mutationFn: async ({ systemId, approvedBy }: { systemId: string; approvedBy: string }) => {
      const result = await approveLeaveAction(systemId, approvedBy);
      if (!result.success) throw new Error(result.error || 'Failed to approve leave');
      return result.data;
    },
    onSuccess: () => {
      invalidateLeaves();
      options.onSuccess?.();
    },
    onError: options.onError,
  });

  const reject = useMutation({
    mutationFn: async ({ systemId, rejectedBy, reason }: { systemId: string; rejectedBy: string; reason?: string }) => {
      const result = await rejectLeaveAction(systemId, rejectedBy, reason);
      if (!result.success) throw new Error(result.error || 'Failed to reject leave');
      return result.data;
    },
    onSuccess: () => {
      invalidateLeaves();
      options.onSuccess?.();
    },
    onError: options.onError,
  });

  const cancel = useMutation({
    mutationFn: async (systemId: string) => {
      const result = await cancelLeaveAction(systemId);
      if (!result.success) throw new Error(result.error || 'Failed to cancel leave');
      return result.data;
    },
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
  });
}
