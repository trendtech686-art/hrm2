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

export type { Brand };
