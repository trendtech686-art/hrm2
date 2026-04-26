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
  pagination: {
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
  };
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
    throw new Error(`Không thể tải danh sách thương hiệu: ${response.statusText}`);
  }
  
  return response.json();
}

export async function fetchBrand(systemId: string): Promise<Brand> {
  const response = await fetch(`${BASE_URL}/${systemId}`);
  
  if (!response.ok) {
    throw new Error(`Không thể tải thương hiệu: ${response.statusText}`);
  }
  
  return response.json();
}

/**
 * Fetch deleted brands (trash)
 */
export async function fetchDeletedBrands(): Promise<Brand[]> {
  const res = await fetch(`${BASE_URL}/deleted`, {
    credentials: 'include',
  });
  
  if (!res.ok) {
    throw new Error(`Không thể tải thương hiệu đã xóa: ${res.statusText}`);
  }
  
  const json = await res.json();
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
    throw new Error(errorData.error || errorData.message || `Không thể xóa vĩnh viễn thương hiệu: ${res.statusText}`);
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
    throw new Error(err.error || err.message || 'Thao tác hàng loạt thất bại');
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
