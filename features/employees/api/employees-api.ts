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
  // Filter by name (not ID)
  department?: string;
  jobTitle?: string;
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
  role?: string;
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
  const { page, limit, ...rest } = params;
  
  const searchParams = new URLSearchParams();
  if (page != null) searchParams.set('page', String(page));
  if (limit != null) searchParams.set('limit', String(limit));
  
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
    method: 'PUT',
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
  console.log('[deleteEmployee] Calling DELETE', `${API_BASE}/${id}`);
  const res = await fetch(`${API_BASE}/${id}`, {
    method: 'DELETE',
    credentials: 'include',
  });
  
  console.log('[deleteEmployee] Response:', res.status, res.ok);
  
  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    console.error('[deleteEmployee] Error:', error);
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
 * Fetch employees by department (auto-paginated — fetches all pages)
 */
export async function fetchEmployeesByDepartment(departmentId: string): Promise<Employee[]> {
  return fetchAllEmployeePages({ departmentId });
}

/**
 * Fetch employees by branch (auto-paginated — fetches all pages)
 */
export async function fetchEmployeesByBranch(branchId: string): Promise<Employee[]> {
  return fetchAllEmployeePages({ branchId });
}

/**
 * Internal helper: auto-paginate to fetch ALL employees matching given filters.
 * Fetches page 1, discovers totalPages, then fetches remaining pages in parallel.
 */
async function fetchAllEmployeePages(filters: Omit<EmployeesParams, 'page' | 'limit'>): Promise<Employee[]> {
  const PAGE_SIZE = 100;
  
  // Step 1: Fetch first page to discover totalPages
  const firstPage = await fetchEmployees({ ...filters, page: 1, limit: PAGE_SIZE });
  const totalPages = firstPage.pagination?.totalPages || 1;
  
  if (totalPages <= 1) return firstPage.data || [];
  
  // Step 2: Fetch remaining pages in parallel
  const remaining = await Promise.all(
    Array.from({ length: totalPages - 1 }, (_, i) =>
      fetchEmployees({ ...filters, page: i + 2, limit: PAGE_SIZE })
    )
  );
  
  return [...firstPage.data, ...remaining.flatMap(r => r.data || [])];
}
/**
 * Fetch deleted employees (trash)
 */
export async function fetchDeletedEmployees(): Promise<Employee[]> {
  const res = await fetch(`${API_BASE}/deleted`, {
    credentials: 'include',
  });
  
  if (!res.ok) {
    throw new Error(`Failed to fetch deleted employees: ${res.statusText}`);
  }
  
  const json = await res.json();
  // API returns array directly, not wrapped in { data: ... }
  return Array.isArray(json) ? json : (json.data || []);
}

/**
 * Restore deleted employee
 */
export async function restoreEmployee(systemId: string): Promise<Employee> {
  const res = await fetch(`${API_BASE}/${systemId}/restore`, {
    method: 'POST',
    credentials: 'include',
  });
  
  const json = await res.json().catch(() => ({}));
  
  if (!res.ok) {
    throw new Error(json.message || `Failed to restore employee: ${res.statusText}`);
  }
  
  // API returns employee directly, not wrapped in { data: ... }
  return json.data || json;
}

/**
 * Permanently delete employee
 */
export async function permanentDeleteEmployee(systemId: string): Promise<void> {
  const res = await fetch(`${API_BASE}/${systemId}/permanent`, {
    method: 'DELETE',
    credentials: 'include',
  });
  
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    // API returns { error: message }, not { message: ... }
    throw new Error(errorData.error || errorData.message || `Failed to permanently delete employee: ${res.statusText}`);
  }
}