/**
 * Roles API functions
 * 
 * ⚠️ Direct import: import { fetchRoles } from '@/features/settings/roles/api/roles-api'
 */

export interface RoleSetting {
  systemId: string;
  id: string;
  name: string;
  description?: string;
  permissions?: string[];
  isSystem: boolean;
  isActive: boolean;
  sortOrder: number;
  createdAt?: string;
  updatedAt?: string;
}

const BASE_URL = '/api/roles';

export interface RolesParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface RolesResponse {
  data: RoleSetting[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export async function fetchRoles(params: RolesParams = {}): Promise<RolesResponse> {
  const searchParams = new URLSearchParams();
  
  if (params.page) searchParams.set('page', String(params.page));
  if (params.limit) searchParams.set('limit', String(params.limit));
  if (params.search) searchParams.set('search', params.search);
  if (params.sortBy) searchParams.set('sortBy', params.sortBy);
  if (params.sortOrder) searchParams.set('sortOrder', params.sortOrder);
  
  const url = searchParams.toString() ? `${BASE_URL}?${searchParams}` : BASE_URL;
  const response = await fetch(url);
  
  if (!response.ok) {
    throw new Error(`Failed to fetch roles: ${response.statusText}`);
  }
  
  return response.json();
}

export async function fetchAllRoles(): Promise<{ data: RoleSetting[] }> {
  const response = await fetch(`${BASE_URL}?all=true`);
  
  if (!response.ok) {
    throw new Error(`Failed to fetch roles: ${response.statusText}`);
  }
  
  return response.json();
}

export async function fetchRole(systemId: string): Promise<RoleSetting> {
  const response = await fetch(`${BASE_URL}/${systemId}`);
  
  if (!response.ok) {
    throw new Error(`Failed to fetch role: ${response.statusText}`);
  }
  
  const result = await response.json();
  return result.data || result;
}

export type CreateRoleInput = Omit<RoleSetting, 'systemId' | 'id' | 'createdAt' | 'updatedAt'>;

export async function createRole(data: CreateRoleInput): Promise<RoleSetting> {
  const response = await fetch(BASE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || 'Failed to create role');
  }
  
  const result = await response.json();
  return result.data || result;
}

export async function updateRole(systemId: string, data: Partial<RoleSetting>): Promise<RoleSetting> {
  const response = await fetch(`${BASE_URL}/${systemId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || 'Failed to update role');
  }
  
  const result = await response.json();
  return result.data || result;
}

export async function deleteRole(systemId: string): Promise<void> {
  const response = await fetch(`${BASE_URL}/${systemId}`, {
    method: 'DELETE',
  });
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || 'Failed to delete role');
  }
}

export type { RoleSetting as Role };
