/**
 * Brands API functions
 * 
 * ⚠️ Direct import: import { fetchBrands } from '@/features/brands/api/brands-api'
 */

import type { BrandModel as Brand } from '@/generated/prisma/models/Brand';

const BASE_URL = '/api/brands';

export interface BrandsParams {
  page?: number;
  limit?: number;
  search?: string;
  includeDeleted?: boolean;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface BrandsResponse {
  data: Brand[];
  total: number;
  page: number;
  pageSize: number;
}

export async function fetchBrands(params: BrandsParams = {}): Promise<BrandsResponse> {
  const searchParams = new URLSearchParams();
  
  if (params.page) searchParams.set('page', String(params.page));
  if (params.limit) searchParams.set('limit', String(params.limit));
  if (params.search) searchParams.set('search', params.search);
  if (params.includeDeleted) searchParams.set('includeDeleted', 'true');
  if (params.sortBy) searchParams.set('sortBy', params.sortBy);
  if (params.sortOrder) searchParams.set('sortOrder', params.sortOrder);
  
  const url = searchParams.toString() ? `${BASE_URL}?${searchParams}` : BASE_URL;
  const response = await fetch(url);
  
  if (!response.ok) {
    throw new Error(`Failed to fetch brands: ${response.statusText}`);
  }
  
  return response.json();
}

export async function fetchBrand(systemId: string): Promise<Brand> {
  const response = await fetch(`${BASE_URL}/${systemId}`);
  
  if (!response.ok) {
    throw new Error(`Failed to fetch brand: ${response.statusText}`);
  }
  
  return response.json();
}

export async function createBrand(data: Omit<Brand, 'systemId' | 'createdAt' | 'updatedAt'>): Promise<Brand> {
  const response = await fetch(BASE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || 'Failed to create brand');
  }
  
  return response.json();
}

export async function updateBrand(systemId: string, data: Partial<Brand>): Promise<Brand> {
  const response = await fetch(`${BASE_URL}/${systemId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || 'Failed to update brand');
  }
  
  return response.json();
}

export async function deleteBrand(systemId: string): Promise<void> {
  const response = await fetch(`${BASE_URL}/${systemId}`, {
    method: 'DELETE',
  });
  
  if (!response.ok) {
    throw new Error(`Failed to delete brand: ${response.statusText}`);
  }
}

/**
 * Fetch deleted brands (trash)
 */
export async function fetchDeletedBrands(): Promise<Brand[]> {
  const res = await fetch(`${BASE_URL}/deleted`, {
    credentials: 'include',
  });
  
  if (!res.ok) {
    throw new Error(`Failed to fetch deleted brands: ${res.statusText}`);
  }
  
  const json = await res.json();
  return json.data || json;
}

/**
 * Restore deleted brand
 */
export async function restoreBrand(systemId: string): Promise<Brand> {
  const res = await fetch(`${BASE_URL}/${systemId}/restore`, {
    method: 'POST',
    credentials: 'include',
  });
  
  const json = await res.json();
  
  if (!res.ok) {
    throw new Error(json.error || json.message || `Failed to restore brand: ${res.statusText}`);
  }
  
  return json.data || json;
}

/**
 * Permanently delete brand
 */
export async function permanentDeleteBrand(systemId: string): Promise<void> {
  const res = await fetch(`${BASE_URL}/${systemId}/permanent`, {
    method: 'DELETE',
    credentials: 'include',
  });
  
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || errorData.message || `Failed to permanently delete brand: ${res.statusText}`);
  }
}

export type { Brand };

// Bulk Operations
// ═══════════════════════════════════════════════════════════════

async function bulkAction(action: string, systemIds: string[]): Promise<{ updatedCount: number }> {
  const res = await fetch(`${BASE_URL}/bulk`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ action, systemIds }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || err.message || 'Bulk action failed');
  }
  return res.json();
}

export function bulkDeleteBrands(systemIds: string[]) {
  return bulkAction('delete', systemIds);
}

export function bulkActivateBrands(systemIds: string[]) {
  return bulkAction('activate', systemIds);
}

export function bulkDeactivateBrands(systemIds: string[]) {
  return bulkAction('deactivate', systemIds);
}
