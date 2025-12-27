/**
 * Branches API functions
 * 
 * ⚠️ Direct import: import { fetchBranches } from '@/features/settings/branches/api/branches-api'
 */

import type { BranchModel as Branch } from '@/generated/prisma/models/Branch';

const BASE_URL = '/api/branches';

export interface BranchesParams {
  page?: number;
  limit?: number;
  search?: string;
  isDefault?: boolean;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface BranchesResponse {
  data: Branch[];
  total: number;
  page: number;
  pageSize: number;
}

export async function fetchBranches(params: BranchesParams = {}): Promise<BranchesResponse> {
  const searchParams = new URLSearchParams();
  
  if (params.page) searchParams.set('page', String(params.page));
  if (params.limit) searchParams.set('limit', String(params.limit));
  if (params.search) searchParams.set('search', params.search);
  if (params.isDefault !== undefined) searchParams.set('isDefault', String(params.isDefault));
  if (params.sortBy) searchParams.set('sortBy', params.sortBy);
  if (params.sortOrder) searchParams.set('sortOrder', params.sortOrder);
  
  const url = searchParams.toString() ? `${BASE_URL}?${searchParams}` : BASE_URL;
  const response = await fetch(url);
  
  if (!response.ok) {
    throw new Error(`Failed to fetch branches: ${response.statusText}`);
  }
  
  return response.json();
}

export async function fetchBranch(systemId: string): Promise<Branch> {
  const response = await fetch(`${BASE_URL}/${systemId}`);
  
  if (!response.ok) {
    throw new Error(`Failed to fetch branch: ${response.statusText}`);
  }
  
  return response.json();
}

export async function createBranch(data: Omit<Branch, 'systemId' | 'createdAt' | 'updatedAt'>): Promise<Branch> {
  const response = await fetch(BASE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || 'Failed to create branch');
  }
  
  return response.json();
}

export async function updateBranch(systemId: string, data: Partial<Branch>): Promise<Branch> {
  const response = await fetch(`${BASE_URL}/${systemId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || 'Failed to update branch');
  }
  
  return response.json();
}

export async function deleteBranch(systemId: string): Promise<void> {
  const response = await fetch(`${BASE_URL}/${systemId}`, {
    method: 'DELETE',
  });
  
  if (!response.ok) {
    throw new Error(`Failed to delete branch: ${response.statusText}`);
  }
}

export async function setDefaultBranch(systemId: string): Promise<Branch> {
  const response = await fetch(`${BASE_URL}/${systemId}/set-default`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  });
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || 'Failed to set default branch');
  }
  
  return response.json();
}

export type { Branch };
