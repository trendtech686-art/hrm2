/**
 * Complaint Types API functions
 * 
 * ⚠️ Direct import: import { fetchComplaintTypes } from '@/features/settings/complaint-types/api/complaint-types-api'
 */

export interface ComplaintTypeSetting {
  systemId: string;
  id: string;
  name: string;
  description?: string;
  color?: string;
  isActive: boolean;
  isDefault: boolean;
  sortOrder: number;
  createdAt?: string;
  updatedAt?: string;
}

const BASE_URL = '/api/complaint-types';

export interface ComplaintTypesParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface ComplaintTypesResponse {
  data: ComplaintTypeSetting[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export async function fetchComplaintTypes(params: ComplaintTypesParams = {}): Promise<ComplaintTypesResponse> {
  const searchParams = new URLSearchParams();
  
  if (params.page) searchParams.set('page', String(params.page));
  if (params.limit) searchParams.set('limit', String(params.limit));
  if (params.search) searchParams.set('search', params.search);
  if (params.sortBy) searchParams.set('sortBy', params.sortBy);
  if (params.sortOrder) searchParams.set('sortOrder', params.sortOrder);
  
  const url = searchParams.toString() ? `${BASE_URL}?${searchParams}` : BASE_URL;
  const response = await fetch(url);
  
  if (!response.ok) {
    throw new Error(`Failed to fetch complaint types: ${response.statusText}`);
  }
  
  return response.json();
}

export async function fetchAllComplaintTypes(): Promise<{ data: ComplaintTypeSetting[] }> {
  const response = await fetch(`${BASE_URL}?all=true`);
  
  if (!response.ok) {
    throw new Error(`Failed to fetch complaint types: ${response.statusText}`);
  }
  
  return response.json();
}

export async function fetchComplaintType(systemId: string): Promise<ComplaintTypeSetting> {
  const response = await fetch(`${BASE_URL}/${systemId}`);
  
  if (!response.ok) {
    throw new Error(`Failed to fetch complaint type: ${response.statusText}`);
  }
  
  const result = await response.json();
  return result.data || result;
}

export type CreateComplaintTypeInput = Omit<ComplaintTypeSetting, 'systemId' | 'id' | 'createdAt' | 'updatedAt'>;

export async function createComplaintType(data: CreateComplaintTypeInput): Promise<ComplaintTypeSetting> {
  const response = await fetch(BASE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || 'Failed to create complaint type');
  }
  
  const result = await response.json();
  return result.data || result;
}

export async function updateComplaintType(systemId: string, data: Partial<ComplaintTypeSetting>): Promise<ComplaintTypeSetting> {
  const response = await fetch(`${BASE_URL}/${systemId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || 'Failed to update complaint type');
  }
  
  const result = await response.json();
  return result.data || result;
}

export async function deleteComplaintType(systemId: string): Promise<void> {
  const response = await fetch(`${BASE_URL}/${systemId}`, {
    method: 'DELETE',
  });
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || 'Failed to delete complaint type');
  }
}

export type { ComplaintTypeSetting as ComplaintType };
