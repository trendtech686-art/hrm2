/**
 * Employee Types API functions
 * 
 * ⚠️ Direct import: import { fetchEmployeeTypes } from '@/features/settings/employee-types/api/employee-types-api'
 */

import type { EmployeeTypeSetting } from '@/lib/types/prisma-extended';

const BASE_URL = '/api/employee-types';

export interface EmployeeTypesParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface EmployeeTypesResponse {
  data: EmployeeTypeSetting[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export async function fetchEmployeeTypes(params: EmployeeTypesParams = {}): Promise<EmployeeTypesResponse> {
  const searchParams = new URLSearchParams();
  
  if (params.page) searchParams.set('page', String(params.page));
  if (params.limit) searchParams.set('limit', String(params.limit));
  if (params.search) searchParams.set('search', params.search);
  if (params.sortBy) searchParams.set('sortBy', params.sortBy);
  if (params.sortOrder) searchParams.set('sortOrder', params.sortOrder);
  
  const url = searchParams.toString() ? `${BASE_URL}?${searchParams}` : BASE_URL;
  const response = await fetch(url);
  
  if (!response.ok) {
    throw new Error(`Failed to fetch employee types: ${response.statusText}`);
  }
  
  return response.json();
}

export async function fetchAllEmployeeTypes(): Promise<{ data: EmployeeTypeSetting[] }> {
  const response = await fetch(`${BASE_URL}?all=true`);
  
  if (!response.ok) {
    throw new Error(`Failed to fetch employee types: ${response.statusText}`);
  }
  
  return response.json();
}

export async function fetchEmployeeType(systemId: string): Promise<EmployeeTypeSetting> {
  const response = await fetch(`${BASE_URL}/${systemId}`);
  
  if (!response.ok) {
    throw new Error(`Failed to fetch employee type: ${response.statusText}`);
  }
  
  return response.json();
}

export async function createEmployeeType(data: Omit<EmployeeTypeSetting, 'systemId' | 'createdAt' | 'updatedAt'>): Promise<EmployeeTypeSetting> {
  const response = await fetch(BASE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || 'Failed to create employee type');
  }
  
  return response.json();
}

export async function updateEmployeeType(systemId: string, data: Partial<EmployeeTypeSetting>): Promise<EmployeeTypeSetting> {
  const response = await fetch(`${BASE_URL}/${systemId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || 'Failed to update employee type');
  }
  
  return response.json();
}

export async function deleteEmployeeType(systemId: string): Promise<void> {
  const response = await fetch(`${BASE_URL}/${systemId}`, {
    method: 'DELETE',
  });
  
  if (!response.ok) {
    throw new Error(`Failed to delete employee type: ${response.statusText}`);
  }
}

export type { EmployeeTypeSetting };
