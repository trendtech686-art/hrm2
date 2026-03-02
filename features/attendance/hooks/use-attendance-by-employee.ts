/**
 * Hook: useAttendanceByEmployee
 * 
 * Server-side filtered hook for employee attendance history.
 * Replaces Zustand store's client-side filtering pattern:
 *   ❌ attendanceData[monthKey].find(r => r.employeeSystemId === id)
 *   ✅ GET /api/attendance/employee-summary?employeeId=X
 * 
 * Used in: Employee detail page (attendance history tab)
 */

import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { attendanceKeys } from './use-attendance';

// ============== Types ==============

export interface EmployeeAttendanceSummary {
  monthKey: string;
  workDays: number;
  leaveDays: number;
  absentDays: number;
  lateArrivals: number;
  earlyDepartures: number;
  otHours: number;
  recordCount: number;
}

// ============== API ==============

async function fetchEmployeeAttendanceSummary(
  employeeId: string
): Promise<EmployeeAttendanceSummary[]> {
  const response = await fetch(
    `/api/attendance/employee-summary?employeeId=${encodeURIComponent(employeeId)}`,
    { credentials: 'include' }
  );

  if (!response.ok) {
    throw new Error('Failed to fetch employee attendance summary');
  }

  const json = await response.json();
  // apiSuccess() returns data directly, or wrapped in { data } for paginated
  const data: EmployeeAttendanceSummary[] = json.data ?? json;
  return data;
}

// ============== Hook ==============

/**
 * Fetch monthly attendance summaries for a specific employee (server-side aggregated).
 * 
 * @example
 * ```tsx
 * const { data: attendanceSummary, isLoading } = useAttendanceByEmployee(employee.systemId);
 * // Returns: [{ monthKey: '2025-01', workDays: 22, leaveDays: 1, ... }, ...]
 * ```
 */
export function useAttendanceByEmployee(employeeId: string | undefined) {
  return useQuery({
    queryKey: [...attendanceKeys.all, 'employee-summary', employeeId],
    queryFn: () => fetchEmployeeAttendanceSummary(employeeId!),
    enabled: !!employeeId,
    staleTime: 1000 * 60 * 2, // 2 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    placeholderData: keepPreviousData,
  });
}
