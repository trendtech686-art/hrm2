/**
 * Attendance React Query Hooks
 * Provides data fetching and mutations for attendance records
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  fetchAttendance,
  fetchAttendanceByMonth,
  fetchAttendanceById,
  createAttendance,
  updateAttendance,
  deleteAttendance,
  lockAttendanceMonth,
  bulkUpdateAttendance,
  type AttendanceFilters,
  type AttendanceCreateInput,
  type AttendanceUpdateInput,
} from '../api/attendance-api';

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
 * Hook to fetch attendance records with filters
 */
export function useAttendance(filters: AttendanceFilters = {}) {
  return useQuery({
    queryKey: attendanceKeys.list(filters),
    queryFn: () => fetchAttendance(filters),
    staleTime: 1000 * 60, // 1 minute for frequently changing data
  });
}

/**
 * Hook to fetch attendance for a specific month
 */
export function useAttendanceByMonth(monthKey: string, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: attendanceKeys.month(monthKey),
    queryFn: () => fetchAttendanceByMonth(monthKey),
    staleTime: 1000 * 60 * 2, // 2 minutes
    enabled: options?.enabled ?? !!monthKey,
  });
}

/**
 * Hook to fetch single attendance record
 */
export function useAttendanceById(systemId: string | undefined) {
  return useQuery({
    queryKey: attendanceKeys.detail(systemId!),
    queryFn: () => fetchAttendanceById(systemId!),
    enabled: !!systemId,
    staleTime: 1000 * 60,
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
    queryClient.invalidateQueries({ queryKey: attendanceKeys.all });
  };

  const create = useMutation({
    mutationFn: (data: AttendanceCreateInput) => createAttendance(data),
    onSuccess: () => {
      invalidateAttendance();
      options.onSuccess?.();
    },
    onError: options.onError,
  });

  const update = useMutation({
    mutationFn: ({ systemId, data }: { systemId: string; data: AttendanceUpdateInput }) =>
      updateAttendance(systemId, data),
    onSuccess: () => {
      invalidateAttendance();
      options.onSuccess?.();
    },
    onError: options.onError,
  });

  const remove = useMutation({
    mutationFn: (systemId: string) => deleteAttendance(systemId),
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
    mutationFn: (records: Array<{ systemId: string; data: AttendanceUpdateInput }>) =>
      bulkUpdateAttendance(records),
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

/**
 * Helper hook to get current month's attendance
 */
export function useCurrentMonthAttendance() {
  const now = new Date();
  const monthKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  return useAttendanceByMonth(monthKey);
}
