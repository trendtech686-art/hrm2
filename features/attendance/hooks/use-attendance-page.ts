/**
 * useAttendancePage - Hook for attendance LIST page with server-side pagination
 * 
 * Fetches attendance data per-employee with pagination support.
 * Use this hook for the attendance list page to enable server-side pagination.
 */

import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { fetchPaginatedAttendanceByMonth } from '../api/attendance-api';
import { attendanceKeys } from './use-attendance';

/**
 * Hook for fetching paginated attendance by month
 */
export function useAttendancePage(
  monthKey: string,
  options: {
    page?: number;
    limit?: number;
    search?: string;
    department?: string;
    enabled?: boolean;
  } = {}
) {
  const { page = 1, limit = 40, search, department, enabled = true } = options;

  return useQuery({
    queryKey: attendanceKeys.page(monthKey, { page, limit, search, department }),
    queryFn: () => fetchPaginatedAttendanceByMonth(monthKey, { page, limit, search, department }),
    placeholderData: keepPreviousData,
    enabled: enabled && !!monthKey,
    staleTime: 1000 * 60 * 2, // 2 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}
