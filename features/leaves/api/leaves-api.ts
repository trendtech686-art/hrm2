/**
 * Leaves API Layer
 * Handles all leave request-related API calls
 */

import type { LeaveRequest } from '@/lib/types/prisma-extended';

export interface LeaveFilters {
  page?: number;
  limit?: number;
  employeeId?: string;
  status?: string;
  leaveType?: string;
  fromDate?: string;
  toDate?: string;
  includeDeleted?: boolean;
}

export interface LeaveResponse {
  data: LeaveRequest[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface LeaveCreateInput {
  systemId?: string;
  id?: string;
  employeeId: string;
  leaveType: string;
  startDate: string;
  endDate: string;
  reason?: string;
  notes?: string;
  status?: string;
}

export interface LeaveUpdateInput extends Partial<LeaveCreateInput> {}

const BASE_URL = '/api/leaves';

/**
 * Fetch leave requests with filters
 */
export async function fetchLeaves(
  filters: LeaveFilters = {}
): Promise<LeaveResponse> {
  const params = new URLSearchParams();
  
  if (filters.page) params.set('page', String(filters.page));
  if (filters.limit) params.set('limit', String(filters.limit));
  if (filters.employeeId) params.set('employeeId', filters.employeeId);
  if (filters.status) params.set('status', filters.status);
  if (filters.leaveType) params.set('leaveType', filters.leaveType);
  if (filters.fromDate) params.set('fromDate', filters.fromDate);
  if (filters.toDate) params.set('toDate', filters.toDate);
  if (filters.includeDeleted) params.set('includeDeleted', 'true');

  const url = params.toString() ? `${BASE_URL}?${params}` : BASE_URL;
  const response = await fetch(url);
  
  if (!response.ok) {
    throw new Error('Failed to fetch leave requests');
  }
  
  return response.json();
}

/**
 * Fetch single leave request by ID
 */
export async function fetchLeaveById(
  systemId: string
): Promise<LeaveRequest> {
  const response = await fetch(`${BASE_URL}/${systemId}`);
  
  if (!response.ok) {
    throw new Error('Failed to fetch leave request');
  }
  
  return response.json();
}

/**
 * Create new leave request
 */
export async function createLeave(
  data: LeaveCreateInput
): Promise<LeaveRequest> {
  const response = await fetch(BASE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.error || 'Failed to create leave request');
  }
  
  return response.json();
}

/**
 * Update leave request
 */
export async function updateLeave(
  systemId: string,
  data: LeaveUpdateInput
): Promise<LeaveRequest> {
  const response = await fetch(`${BASE_URL}/${systemId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.error || 'Failed to update leave request');
  }
  
  return response.json();
}

/**
 * Approve leave request
 */
export async function approveLeave(
  systemId: string,
  approverNotes?: string
): Promise<LeaveRequest> {
  return updateLeave(systemId, {
    status: 'Đã duyệt',
    notes: approverNotes,
  });
}

/**
 * Reject leave request
 */
export async function rejectLeave(
  systemId: string,
  reason: string
): Promise<LeaveRequest> {
  return updateLeave(systemId, {
    status: 'Từ chối',
    notes: reason,
  });
}

/**
 * Cancel leave request
 */
export async function cancelLeave(
  systemId: string
): Promise<LeaveRequest> {
  return updateLeave(systemId, {
    status: 'Đã hủy',
  });
}

/**
 * Delete leave request (soft delete)
 */
export async function deleteLeave(systemId: string): Promise<void> {
  const response = await fetch(`${BASE_URL}/${systemId}`, {
    method: 'DELETE',
  });
  
  if (!response.ok) {
    throw new Error('Failed to delete leave request');
  }
}

/**
 * Restore deleted leave request
 */
export async function restoreLeave(systemId: string): Promise<LeaveRequest> {
  const response = await fetch(`${BASE_URL}/${systemId}/restore`, {
    method: 'POST',
  });
  
  if (!response.ok) {
    throw new Error('Failed to restore leave request');
  }
  
  return response.json();
}

/**
 * Hard delete leave request (permanent)
 */
export async function hardDeleteLeave(systemId: string): Promise<void> {
  const response = await fetch(`${BASE_URL}/${systemId}?permanent=true`, {
    method: 'DELETE',
  });
  
  if (!response.ok) {
    throw new Error('Failed to permanently delete leave request');
  }
}

/**
 * Get leave quota for an employee
 */
export async function fetchLeaveQuota(
  employeeId: string,
  year?: number
): Promise<{
  total: number;
  used: number;
  remaining: number;
  breakdown: Record<string, number>;
}> {
  const currentYear = year || new Date().getFullYear();
  const response = await fetch(
    `${BASE_URL}/quota?employeeId=${employeeId}&year=${currentYear}`
  );
  
  if (!response.ok) {
    throw new Error('Failed to fetch leave quota');
  }
  
  return response.json();
}
