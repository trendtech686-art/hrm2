/**
 * Suppliers API - Isolated API functions
 * 
 * ⚠️ IMPORTANT: This file should ONLY contain:
 * - Fetch functions
 * - Type imports from ../types
 * - NO store imports
 * - NO cross-feature imports
 */

import type { Supplier } from '@/lib/types/prisma-extended';

const API_BASE = '/api/suppliers';

export interface SuppliersParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  hasDebt?: boolean;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  includeDeleted?: boolean;
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

export interface CreateSupplierInput {
  name: string;
  taxCode?: string;
  phone?: string;
  email?: string;
  address?: string;
  website?: string;
  accountManager?: string;
  bankAccount?: string;
  bankName?: string;
  contactPerson?: string;
  notes?: string;
}

export interface UpdateSupplierInput extends Partial<CreateSupplierInput> {
  systemId: string;
  isDeleted?: boolean;
  deletedAt?: string | Date | null;
  status?: string;
}

/**
 * Fetch paginated suppliers list
 */
export async function fetchSuppliers(params: SuppliersParams = {}): Promise<PaginatedResponse<Supplier>> {
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
  
  const res = await fetch(`${API_BASE}?${searchParams}`, {
    credentials: 'include',
  });
  
  if (!res.ok) {
    throw new Error(`Failed to fetch suppliers: ${res.statusText}`);
  }
  
  return res.json();
}

/**
 * Fetch single supplier by ID
 */
export async function fetchSupplier(id: string): Promise<Supplier> {
  const res = await fetch(`${API_BASE}/${id}`, {
    credentials: 'include',
  });
  
  if (!res.ok) {
    throw new Error(`Failed to fetch supplier ${id}: ${res.statusText}`);
  }
  
  return res.json();
}

/**
 * Create new supplier
 */
export async function createSupplier(data: CreateSupplierInput): Promise<Supplier> {
  const res = await fetch(API_BASE, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(data),
  });
  
  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.message || `Failed to create supplier: ${res.statusText}`);
  }
  
  return res.json();
}

/**
 * Update existing supplier
 */
export async function updateSupplier({ systemId, ...data }: UpdateSupplierInput): Promise<Supplier> {
  const res = await fetch(`${API_BASE}/${systemId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(data),
  });
  
  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.message || `Failed to update supplier: ${res.statusText}`);
  }
  
  return res.json();
}

/**
 * Delete supplier (soft delete)
 */
export async function deleteSupplier(id: string): Promise<void> {
  const res = await fetch(`${API_BASE}/${id}`, {
    method: 'DELETE',
    credentials: 'include',
  });
  
  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.message || `Failed to delete supplier: ${res.statusText}`);
  }
}

/**
 * Search suppliers for autocomplete
 */
export async function searchSuppliers(query: string, limit = 20): Promise<Supplier[]> {
  const res = await fetch(`${API_BASE}?search=${encodeURIComponent(query)}&limit=${limit}`, {
    credentials: 'include',
  });
  
  if (!res.ok) {
    throw new Error(`Failed to search suppliers: ${res.statusText}`);
  }
  
  const json = await res.json();
  return json.data || [];
}
