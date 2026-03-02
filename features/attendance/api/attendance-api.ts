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
  monthKey?: string;
  employeeSystemId?: string;
  dayKey?: string;
  record?: {
    status: string;
    checkIn?: string;
    checkOut?: string;
    morningCheckOut?: string;
    afternoonCheckIn?: string;
    overtimeCheckIn?: string;
    overtimeCheckOut?: string;
    notes?: string;
  };
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
 * Transforms individual records into row format (one row per employee)
 */
export async function fetchAttendanceByMonth(
  monthKey: string
): Promise<AttendanceDataRow[]> {
  const [year, month] = monthKey.split('-');
  const fromDate = `${year}-${month}-01`;
  const lastDay = new Date(parseInt(year), parseInt(month), 0).getDate();
  const toDate = `${year}-${month}-${String(lastDay).padStart(2, '0')}`;
  
  // Auto-paginate: fetch page 1 → discover totalPages → fetch remaining
  const PAGE_SIZE = 200; // batch size per request
  const firstPage = await fetchAttendance({
    fromDate,
    toDate,
    page: 1,
    limit: PAGE_SIZE,
  });
  
  let allRecords = [...firstPage.data];
  
  // Fetch remaining pages in parallel if needed
  if (firstPage.pagination && firstPage.pagination.totalPages > 1) {
    const remainingPages = Array.from(
      { length: firstPage.pagination.totalPages - 1 },
      (_, i) => i + 2,
    );
    const remainingResults = await Promise.all(
      remainingPages.map(page =>
        fetchAttendance({ fromDate, toDate, page, limit: PAGE_SIZE })
      ),
    );
    for (const result of remainingResults) {
      allRecords = allRecords.concat(result.data);
    }
  }
  
  // Transform individual records into row format
  const recordsByEmployee = new Map<string, AttendanceDataRow>();
  
  type AttendanceRecord = {
    date: string;
    employeeId: string;
    employee?: { systemId?: string; id?: string; fullName?: string; department?: string };
    status: string;
    checkIn?: string;
    checkOut?: string;
    notes?: string;
    createdAt?: string;
    updatedAt?: string;
    createdBy?: string;
    updatedBy?: string;
  };
  
  (allRecords as unknown as AttendanceRecord[]).forEach((record) => {
    const employeeSystemId = record.employee?.systemId || record.employeeId;
    
    if (!recordsByEmployee.has(employeeSystemId)) {
      recordsByEmployee.set(employeeSystemId, {
        systemId: employeeSystemId,
        employeeSystemId: employeeSystemId,
        employeeId: record.employee?.id || employeeSystemId, // Business ID (NV001)
        fullName: record.employee?.fullName || '',
        department: record.employee?.department,
        workDays: 0,
        leaveDays: 0,
        absentDays: 0,
        lateArrivals: 0,
        earlyDepartures: 0,
        otHours: 0,
        createdAt: record.createdAt,
        updatedAt: record.updatedAt,
        createdBy: record.createdBy,
        updatedBy: record.updatedBy,
      } as unknown as AttendanceDataRow);
    }
    
    const row = recordsByEmployee.get(employeeSystemId)!;
    const recordDate = new Date(record.date);
    const day = recordDate.getDate();
    
    // Map database status to frontend status
    const statusMap: Record<string, string> = {
      'PRESENT': 'present',
      'ABSENT': 'absent',
      'LEAVE': 'leave',
      'HALF_DAY': 'half-day',
      'HOLIDAY': 'holiday',
    };
    
    const status = statusMap[record.status] || 'present';
    
    (row as Record<string, unknown>)[`day_${day}`] = {
      status,
      checkIn: record.checkIn ? new Date(record.checkIn).toTimeString().slice(0, 5) : undefined,
      checkOut: record.checkOut ? new Date(record.checkOut).toTimeString().slice(0, 5) : undefined,
      notes: record.notes,
    };
    
    // Tính totals trực tiếp từ status
    if (status === 'present') {
      row.workDays = (row.workDays || 0) + 1;
    } else if (status === 'half-day') {
      row.workDays = (row.workDays || 0) + 0.5;
    } else if (status === 'leave') {
      row.leaveDays = (row.leaveDays || 0) + 1;
    } else if (status === 'absent') {
      row.absentDays = (row.absentDays || 0) + 1;
    }
    // Tính late arrivals / early departures (cần settings để tính chính xác, tạm dùng 8:30-18:00)
    if (record.checkIn) {
      const checkInTime = new Date(record.checkIn);
      const checkInMinutes = checkInTime.getHours() * 60 + checkInTime.getMinutes();
      if (checkInMinutes > 8 * 60 + 30) { // 8:30
        row.lateArrivals = (row.lateArrivals || 0) + 1;
      }
    }
    if (record.checkOut) {
      const checkOutTime = new Date(record.checkOut);
      const checkOutMinutes = checkOutTime.getHours() * 60 + checkOutTime.getMinutes();
      if (checkOutMinutes < 18 * 60) { // 18:00
        row.earlyDepartures = (row.earlyDepartures || 0) + 1;
      }
      // Tính OT (sau 18:00)
      if (checkOutMinutes > 18 * 60) {
        const otMinutes = checkOutMinutes - 18 * 60;
        row.otHours = (row.otHours || 0) + (otMinutes / 60);
      }
    }
  });
  
  return Array.from(recordsByEmployee.values());
}

/**
 * Fetch attendance data for a specific employee in a specific month.
 * Reuses the fetchAttendanceByMonth transform logic but filtered to one employee.
 * 
 * Used by: print handlers in employee detail page (on-demand, not pre-loaded)
 */
export async function fetchAttendanceByEmployeeMonth(
  employeeId: string,
  monthKey: string
): Promise<AttendanceDataRow | null> {
  const allRows = await fetchAttendanceByMonth(monthKey);
  const row = allRows.find(r => 
    r.employeeSystemId === employeeId || (r as Record<string, unknown>).employeeId === employeeId
  );
  return row || null;
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
