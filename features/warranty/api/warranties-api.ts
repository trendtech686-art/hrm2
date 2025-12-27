/**
 * Warranty API - Isolated API functions
 */

import type { WarrantyTicket } from '@/lib/types/prisma-extended';

const API_BASE = '/api/warranties';

export interface WarrantiesParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  customerId?: string;
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

export async function fetchWarranties(params: WarrantiesParams = {}): Promise<PaginatedResponse<WarrantyTicket>> {
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
  if (!res.ok) throw new Error(`Failed to fetch warranties: ${res.statusText}`);
  return res.json();
}

export async function fetchWarranty(id: string): Promise<WarrantyTicket> {
  const res = await fetch(`${API_BASE}/${id}`, { credentials: 'include' });
  if (!res.ok) throw new Error(`Failed to fetch warranty: ${res.statusText}`);
  return res.json();
}

export async function createWarranty(data: Partial<WarrantyTicket>): Promise<WarrantyTicket> {
  const res = await fetch(API_BASE, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.message || `Failed to create warranty`);
  }
  return res.json();
}

export async function updateWarranty(systemId: string, data: Partial<WarrantyTicket>): Promise<WarrantyTicket> {
  const res = await fetch(`${API_BASE}/${systemId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.message || `Failed to update warranty`);
  }
  return res.json();
}

export async function deleteWarranty(id: string): Promise<void> {
  const res = await fetch(`${API_BASE}/${id}`, { method: 'DELETE', credentials: 'include' });
  if (!res.ok) throw new Error(`Failed to delete warranty`);
}

export async function fetchWarrantyStats(): Promise<{
  total: number;
  pending: number;
  processed: number;
  completed: number;
}> {
  const res = await fetch(`${API_BASE}/stats`, { credentials: 'include' });
  if (!res.ok) throw new Error(`Failed to fetch warranty stats`);
  return res.json();
}
