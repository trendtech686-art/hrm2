/**
 * Employees API - Isolated API functions
 * 
 * ⚠️ IMPORTANT: This file should ONLY contain:
 * - Fetch functions
 * - Type imports from ../types
 * - NO store imports
 * - NO cross-feature imports
 */

import type { Employee } from '@/lib/types/prisma-extended';

const API_BASE = '/api/employees';

export interface EmployeesParams {
  page?: number;
  limit?: number;
  search?: string;
  departmentId?: string;
  branchId?: string;
  jobTitleId?: string;
  status?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface CreateEmployeeInput {
  fullName: string;
  email?: string;
  phone?: string;
  departmentId?: string;
  branchId?: string;
  jobTitleId?: string;
  hireDate?: string;
  // Optional fields for updates
  isDeleted?: boolean;
  employmentStatus?: string;
}

export interface UpdateEmployeeInput extends Partial<CreateEmployeeInput> {
  systemId: string;
}

/**
 * Fetch paginated employees list
 */
export async function fetchEmployees(params: EmployeesParams = {}): Promise<PaginatedResponse<Employee>> {
  const { page = 1, limit = 50, ...rest } = params;
  
  const searchParams = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });
  
  // Add optional params
  Object.entries(rest).forEach(([key, value]) => {
    if (value != null && value !== '') {
      searchParams.set(key, String(value));
    }
  });
  
  const res = await fetch(`${API_BASE}?${searchParams}`, {
    credentials: 'include',
  });
  
  if (!res.ok) {
    throw new Error(`Failed to fetch employees: ${res.statusText}`);
  }
  
  return res.json();
}

/**
 * Fetch single employee by ID
 */
export async function fetchEmployee(id: string): Promise<Employee> {
  const res = await fetch(`${API_BASE}/${id}`, {
    credentials: 'include',
  });
  
  if (!res.ok) {
    throw new Error(`Failed to fetch employee ${id}: ${res.statusText}`);
  }
  
  return res.json();
}

/**
 * Create new employee
 */
export async function createEmployee(data: CreateEmployeeInput): Promise<Employee> {
  const res = await fetch(API_BASE, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(data),
  });
  
  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.message || `Failed to create employee: ${res.statusText}`);
  }
  
  return res.json();
}

/**
 * Update existing employee
 */
export async function updateEmployee({ systemId, ...data }: UpdateEmployeeInput): Promise<Employee> {
  const res = await fetch(`${API_BASE}/${systemId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(data),
  });
  
  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.message || `Failed to update employee: ${res.statusText}`);
  }
  
  return res.json();
}

/**
 * Delete employee (soft delete)
 */
export async function deleteEmployee(id: string): Promise<void> {
  const res = await fetch(`${API_BASE}/${id}`, {
    method: 'DELETE',
    credentials: 'include',
  });
  
  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.message || `Failed to delete employee: ${res.statusText}`);
  }
}

/**
 * Search employees for autocomplete
 */
export async function searchEmployees(query: string, limit = 20): Promise<Employee[]> {
  const res = await fetch(`${API_BASE}?search=${encodeURIComponent(query)}&limit=${limit}`, {
    credentials: 'include',
  });
  
  if (!res.ok) {
    throw new Error(`Failed to search employees: ${res.statusText}`);
  }
  
  const json = await res.json();
  return json.data || [];
}

/**
 * Fetch employees by department
 */
export async function fetchEmployeesByDepartment(departmentId: string): Promise<Employee[]> {
  const res = await fetch(`${API_BASE}?departmentId=${departmentId}&limit=100`, {
    credentials: 'include',
  });
  
  if (!res.ok) {
    throw new Error(`Failed to fetch employees by department: ${res.statusText}`);
  }
  
  const json = await res.json();
  return json.data || [];
}

/**
 * Fetch employees by branch
 */
export async function fetchEmployeesByBranch(branchId: string): Promise<Employee[]> {
  const res = await fetch(`${API_BASE}?branchId=${branchId}&limit=100`, {
    credentials: 'include',
  });
  
  if (!res.ok) {
    throw new Error(`Failed to fetch employees by branch: ${res.statusText}`);
  }
  
  const json = await res.json();
  return json.data || [];
}
