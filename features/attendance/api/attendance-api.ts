/**
 * Attendance API Layer
 * Handles all attendance-related API calls
 */

import type { AttendanceDataRow } from '@/lib/types/prisma-extended';

export interface AttendanceFilters {
  page?: number;
  limit?: number;
  employeeId?: string;
  date?: string;
  fromDate?: string;
  toDate?: string;
  status?: string;
}

export interface AttendanceResponse {
  data: AttendanceDataRow[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface AttendanceCreateInput {
  employeeId: string;
  date: string;
  checkIn?: string;
  checkOut?: string;
  status?: string;
  notes?: string;
}

export interface AttendanceUpdateInput extends Partial<AttendanceCreateInput> {
  action?: 'save' | 'lock' | 'unlock';
}

const BASE_URL = '/api/attendance';

/**
 * Fetch attendance records with filters
 */
export async function fetchAttendance(
  filters: AttendanceFilters = {}
): Promise<AttendanceResponse> {
  const params = new URLSearchParams();
  
  if (filters.page) params.set('page', String(filters.page));
  if (filters.limit) params.set('limit', String(filters.limit));
  if (filters.employeeId) params.set('employeeId', filters.employeeId);
  if (filters.date) params.set('date', filters.date);
  if (filters.fromDate) params.set('fromDate', filters.fromDate);
  if (filters.toDate) params.set('toDate', filters.toDate);
  if (filters.status) params.set('status', filters.status);

  const url = params.toString() ? `${BASE_URL}?${params}` : BASE_URL;
  const response = await fetch(url);
  
  if (!response.ok) {
    throw new Error('Failed to fetch attendance records');
  }
  
  return response.json();
}

/**
 * Fetch attendance for a specific month
 */
export async function fetchAttendanceByMonth(
  monthKey: string
): Promise<AttendanceDataRow[]> {
  const [year, month] = monthKey.split('-');
  const fromDate = `${year}-${month}-01`;
  const lastDay = new Date(parseInt(year), parseInt(month), 0).getDate();
  const toDate = `${year}-${month}-${String(lastDay).padStart(2, '0')}`;
  
  const response = await fetchAttendance({
    fromDate,
    toDate,
    limit: 500,
  });
  
  return response.data;
}

/**
 * Fetch single attendance record by ID
 */
export async function fetchAttendanceById(
  systemId: string
): Promise<AttendanceDataRow> {
  const response = await fetch(`${BASE_URL}/${systemId}`);
  
  if (!response.ok) {
    throw new Error('Failed to fetch attendance record');
  }
  
  return response.json();
}

/**
 * Create attendance record (check-in)
 */
export async function createAttendance(
  data: AttendanceCreateInput
): Promise<AttendanceDataRow> {
  const response = await fetch(BASE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.error || 'Failed to create attendance record');
  }
  
  return response.json();
}

/**
 * Update attendance record
 */
export async function updateAttendance(
  systemId: string,
  data: AttendanceUpdateInput
): Promise<AttendanceDataRow> {
  const response = await fetch(`${BASE_URL}/${systemId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.error || 'Failed to update attendance record');
  }
  
  return response.json();
}

/**
 * Lock/Unlock attendance month
 */
export async function lockAttendanceMonth(
  monthKey: string,
  lock: boolean
): Promise<boolean> {
  const response = await fetch(BASE_URL, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      action: lock ? 'lock' : 'unlock',
      monthKey,
    }),
  });
  
  return response.ok;
}

/**
 * Delete attendance record
 */
export async function deleteAttendance(systemId: string): Promise<void> {
  const response = await fetch(`${BASE_URL}/${systemId}`, {
    method: 'DELETE',
  });
  
  if (!response.ok) {
    throw new Error('Failed to delete attendance record');
  }
}

/**
 * Bulk update attendance records
 */
export async function bulkUpdateAttendance(
  records: Array<{ systemId: string; data: AttendanceUpdateInput }>
): Promise<{ success: number; failed: number }> {
  const response = await fetch(`${BASE_URL}/bulk`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ records }),
  });
  
  if (!response.ok) {
    throw new Error('Failed to bulk update attendance records');
  }
  
  return response.json();
}
