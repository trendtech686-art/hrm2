/**
 * Departments API functions
 * 
 * ⚠️ Direct import: import { fetchDepartments } from '@/features/settings/departments/api/departments-api'
 */

import type { Department } from '@/lib/types/prisma-extended';

const BASE_URL = '/api/departments';

export interface DepartmentsParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface DepartmentsResponse {
  data: Department[];
  total: number;
  page: number;
  pageSize: number;
}

export async function fetchDepartments(params: DepartmentsParams = {}): Promise<DepartmentsResponse> {
  const searchParams = new URLSearchParams();
  
  if (params.page) searchParams.set('page', String(params.page));
  if (params.limit) searchParams.set('limit', String(params.limit));
  if (params.search) searchParams.set('search', params.search);
  if (params.sortBy) searchParams.set('sortBy', params.sortBy);
  if (params.sortOrder) searchParams.set('sortOrder', params.sortOrder);
  
  const url = searchParams.toString() ? `${BASE_URL}?${searchParams}` : BASE_URL;
  const response = await fetch(url);
  
  if (!response.ok) {
    throw new Error(`Failed to fetch departments: ${response.statusText}`);
  }
  
  return response.json();
}

export async function fetchDepartment(systemId: string): Promise<Department> {
  const response = await fetch(`${BASE_URL}/${systemId}`);
  
  if (!response.ok) {
    throw new Error(`Failed to fetch department: ${response.statusText}`);
  }
  
  return response.json();
}

export async function createDepartment(data: Omit<Department, 'systemId' | 'createdAt' | 'updatedAt'>): Promise<Department> {
  const response = await fetch(BASE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || 'Failed to create department');
  }
  
  return response.json();
}

export async function updateDepartment(systemId: string, data: Partial<Department>): Promise<Department> {
  const response = await fetch(`${BASE_URL}/${systemId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || 'Failed to update department');
  }
  
  return response.json();
}

export async function deleteDepartment(systemId: string): Promise<void> {
  const response = await fetch(`${BASE_URL}/${systemId}`, {
    method: 'DELETE',
  });
  
  if (!response.ok) {
    throw new Error(`Failed to delete department: ${response.statusText}`);
  }
}

export type { Department };
