/**
 * Complaints API - Isolated API functions
 */

import type { Complaint } from '@/lib/types/prisma-extended';

const API_BASE = '/api/complaints';

export interface ComplaintsParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  priority?: string;
  type?: string;
  assignedTo?: string;
  customerId?: string;
  orderId?: string;
  orderSystemId?: string;
  branchId?: string;
  startDate?: string;
  endDate?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export async function fetchComplaints(params: ComplaintsParams = {}): Promise<PaginatedResponse<Complaint>> {
  const { page = 1, limit = 50, ...rest } = params;
  
  const searchParams = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });
  
  Object.entries(rest).forEach(([key, value]) => {
    if (value != null && value !== '') {
      searchParams.set(key, String(value));
    }
  });
  
  const res = await fetch(`${API_BASE}?${searchParams}`, { credentials: 'include' });
  if (!res.ok) {
    const body = await res.json().catch(() => ({ message: res.statusText }));
    throw new Error(body?.message || `Lỗi ${res.status}: ${res.statusText}`);
  }
  return res.json();
}

export async function fetchComplaint(id: string): Promise<Complaint> {
  const res = await fetch(`${API_BASE}/${id}`, { credentials: 'include' });
  if (!res.ok) throw new Error(`Failed to fetch complaint: ${res.statusText}`);
  return res.json();
}

export async function fetchComplaintStats(): Promise<{
  total: number;
  pending: number;
  inProgress: number;
  resolved: number;
}> {
  const res = await fetch(`${API_BASE}/stats`, { credentials: 'include' });
  if (!res.ok) throw new Error(`Failed to fetch complaint stats`);
  return res.json();
}
