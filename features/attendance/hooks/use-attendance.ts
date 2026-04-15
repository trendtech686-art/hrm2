/**
 * Attendance React Query Hooks
 * Provides data fetching and mutations for attendance records
 */

import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import {
  fetchAttendanceByMonth,
  lockAttendanceMonth,
  type AttendanceFilters,
  type AttendanceCreateInput,
  type AttendanceUpdateInput,
} from '../api/attendance-api';
import {
  createAttendanceAction,
  updateAttendanceAction,
  deleteAttendanceAction,
} from '@/app/actions/attendance';
import { invalidateRelated } from '@/lib/query-invalidation-map';

// Query keys factory
export const attendanceKeys = {
  all: ['attendance'] as const,
  lists: () => [...attendanceKeys.all, 'list'] as const,
  list: (filters: AttendanceFilters) => [...attendanceKeys.lists(), filters] as const,
  month: (monthKey: string) => [...attendanceKeys.all, 'month', monthKey] as const,
  details: () => [...attendanceKeys.all, 'detail'] as const,
  detail: (id: string) => [...attendanceKeys.details(), id] as const,
};

/**
 * Hook to fetch attendance for a specific month
 */
export function useAttendanceByMonth(monthKey: string, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: attendanceKeys.month(monthKey),
    queryFn: () => fetchAttendanceByMonth(monthKey),
    staleTime: 1000 * 60 * 2, // 2 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    placeholderData: keepPreviousData,
    enabled: options?.enabled ?? !!monthKey,
  });
}

interface MutationCallbacks {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

/**
 * Hook providing attendance mutations
 */
export function useAttendanceMutations(options: MutationCallbacks = {}) {
  const queryClient = useQueryClient();

  const invalidateAttendance = () => {
    invalidateRelated(queryClient, 'attendance');
  };

  const create = useMutation({
    mutationFn: async (data: AttendanceCreateInput) => {
      const result = await createAttendanceAction(data as Parameters<typeof createAttendanceAction>[0]);
      if (!result.success) throw new Error(result.error || 'Failed to create attendance');
      return result.data;
    },
    onSuccess: () => {
      invalidateAttendance();
      options.onSuccess?.();
    },
    onError: options.onError,
  });

  const update = useMutation({
    mutationFn: async ({ systemId, data }: { systemId: string; data: AttendanceUpdateInput }) => {
      const result = await updateAttendanceAction({ systemId, ...data });
      if (!result.success) throw new Error(result.error || 'Failed to update attendance');
      return result.data;
    },
    onSuccess: () => {
      invalidateAttendance();
      options.onSuccess?.();
    },
    onError: options.onError,
  });

  const remove = useMutation({
    mutationFn: async (systemId: string) => {
      const result = await deleteAttendanceAction(systemId);
      if (!result.success) throw new Error(result.error || 'Failed to delete attendance');
      return result.data;
    },
    onSuccess: () => {
      invalidateAttendance();
      options.onSuccess?.();
    },
    onError: options.onError,
  });

  const lockMonth = useMutation({
    mutationFn: ({ monthKey, lock }: { monthKey: string; lock: boolean }) =>
      lockAttendanceMonth(monthKey, lock),
    onSuccess: () => {
      invalidateAttendance();
      options.onSuccess?.();
    },
    onError: options.onError,
  });

  const bulkUpdate = useMutation({
    mutationFn: async (records: Array<{ systemId: string; data: AttendanceUpdateInput }>) => {
      // Use the bulk API endpoint instead of N sequential server actions
      const response = await fetch('/api/attendance/bulk', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ records }),
      });
      if (!response.ok) throw new Error('Failed to bulk update attendance');
      return response.json();
    },
    onSuccess: () => {
      invalidateAttendance();
      options.onSuccess?.();
    },
    onError: options.onError,
  });

  return {
    create,
    update,
    remove,
    lockMonth,
    bulkUpdate,
    isLoading:
      create.isPending ||
      update.isPending ||
      remove.isPending ||
      lockMonth.isPending ||
      bulkUpdate.isPending,
  };
}
