/**
 * Penalty Types API functions
 * 
 * ⚠️ Direct import: import { fetchPenaltyTypes } from '@/features/settings/penalty-types/api/penalty-types-api'
 */

export interface PenaltyTypeSetting {
  systemId: string;
  id: string;
  name: string;
  description?: string;
  defaultAmount: number;
  category: 'complaint' | 'attendance' | 'performance' | 'other';
  isActive: boolean;
  sortOrder: number;
  createdAt?: string;
  updatedAt?: string;
}

const BASE_URL = '/api/penalty-types';

export interface PenaltyTypesParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PenaltyTypesResponse {
  data: PenaltyTypeSetting[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export async function fetchPenaltyTypes(params: PenaltyTypesParams = {}): Promise<PenaltyTypesResponse> {
  const searchParams = new URLSearchParams();
  
  if (params.page) searchParams.set('page', String(params.page));
  if (params.limit) searchParams.set('limit', String(params.limit));
  if (params.search) searchParams.set('search', params.search);
  if (params.sortBy) searchParams.set('sortBy', params.sortBy);
  if (params.sortOrder) searchParams.set('sortOrder', params.sortOrder);
  
  const url = searchParams.toString() ? `${BASE_URL}?${searchParams}` : BASE_URL;
  const response = await fetch(url);
  
  if (!response.ok) {
    throw new Error(`Failed to fetch penalty types: ${response.statusText}`);
  }
  
  return response.json();
}

export async function fetchAllPenaltyTypes(): Promise<{ data: PenaltyTypeSetting[] }> {
  const response = await fetch(`${BASE_URL}?all=true`);
  
  if (!response.ok) {
    throw new Error(`Failed to fetch penalty types: ${response.statusText}`);
  }
  
  return response.json();
}

export async function fetchPenaltyType(systemId: string): Promise<PenaltyTypeSetting> {
  const response = await fetch(`${BASE_URL}/${systemId}`);
  
  if (!response.ok) {
    throw new Error(`Failed to fetch penalty type: ${response.statusText}`);
  }
  
  const result = await response.json();
  return result.data || result;
}

export type CreatePenaltyTypeInput = Omit<PenaltyTypeSetting, 'systemId' | 'id' | 'createdAt' | 'updatedAt'>;

export async function createPenaltyType(data: CreatePenaltyTypeInput): Promise<PenaltyTypeSetting> {
  const response = await fetch(BASE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || 'Failed to create penalty type');
  }
  
  const result = await response.json();
  return result.data || result;
}

export async function updatePenaltyType(systemId: string, data: Partial<PenaltyTypeSetting>): Promise<PenaltyTypeSetting> {
  const response = await fetch(`${BASE_URL}/${systemId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || 'Failed to update penalty type');
  }
  
  const result = await response.json();
  return result.data || result;
}

export async function deletePenaltyType(systemId: string): Promise<void> {
  const response = await fetch(`${BASE_URL}/${systemId}`, {
    method: 'DELETE',
  });
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || 'Failed to delete penalty type');
  }
}

export type { PenaltyTypeSetting as PenaltyType };
