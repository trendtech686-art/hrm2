/**
 * Units API functions
 * 
 * ⚠️ Direct import: import { fetchUnits } from '@/features/settings/units/api/units-api'
 */

import type { Unit } from '@/lib/types/prisma-extended';

const BASE_URL = '/api/units';

export interface UnitsParams {
  page?: number;
  limit?: number;
  search?: string;
  isActive?: boolean;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface UnitsResponse {
  data: Unit[];
  total: number;
  page: number;
  pageSize: number;
}

export async function fetchUnits(params: UnitsParams = {}): Promise<UnitsResponse> {
  const searchParams = new URLSearchParams();
  
  if (params.page) searchParams.set('page', String(params.page));
  if (params.limit) searchParams.set('limit', String(params.limit));
  if (params.search) searchParams.set('search', params.search);
  if (params.isActive !== undefined) searchParams.set('isActive', String(params.isActive));
  if (params.sortBy) searchParams.set('sortBy', params.sortBy);
  if (params.sortOrder) searchParams.set('sortOrder', params.sortOrder);
  
  const url = searchParams.toString() ? `${BASE_URL}?${searchParams}` : BASE_URL;
  const response = await fetch(url);
  
  if (!response.ok) {
    throw new Error(`Failed to fetch units: ${response.statusText}`);
  }
  
  return response.json();
}

export async function fetchUnit(systemId: string): Promise<Unit> {
  const response = await fetch(`${BASE_URL}/${systemId}`);
  
  if (!response.ok) {
    throw new Error(`Failed to fetch unit: ${response.statusText}`);
  }
  
  return response.json();
}

export async function createUnit(data: Omit<Unit, 'systemId' | 'createdAt' | 'updatedAt'>): Promise<Unit> {
  const response = await fetch(BASE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || 'Failed to create unit');
  }
  
  return response.json();
}

export async function updateUnit(systemId: string, data: Partial<Unit>): Promise<Unit> {
  const response = await fetch(`${BASE_URL}/${systemId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || 'Failed to update unit');
  }
  
  return response.json();
}

export async function deleteUnit(systemId: string): Promise<void> {
  const response = await fetch(`${BASE_URL}/${systemId}`, {
    method: 'DELETE',
  });
  
  if (!response.ok) {
    throw new Error(`Failed to delete unit: ${response.statusText}`);
  }
}

export type { Unit };
