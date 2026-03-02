/**
 * Customers API - Isolated API functions
 * 
 * ⚠️ IMPORTANT: This file should ONLY contain:
 * - Fetch functions
 * - Type imports from ../types
 * - NO store imports
 * - NO cross-feature imports
 */

import type { Customer } from '@/lib/types/prisma-extended';

const API_BASE = '/api/customers';

export interface CustomersParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  type?: string;
  targetGroup?: string;
  lifecycleStage?: string;
  hasDebt?: boolean;
  debtFilter?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  dateFrom?: string;
  dateTo?: string;
  enabled?: boolean; // React Query enabled option
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

export interface CreateCustomerInput {
  name: string;
  email?: string;
  phone?: string;
  company?: string;
  addresses?: Array<{
    street: string;
    ward?: string;
    district?: string;
    province?: string;
    isDefault?: boolean;
  }>;
  notes?: string;
  // Optional fields for updates
  isDeleted?: boolean;
  status?: string;
}

export interface UpdateCustomerInput extends Partial<CreateCustomerInput> {
  systemId: string;
}

/**
 * Fetch paginated customers list
 */
export async function fetchCustomers(params: CustomersParams = {}): Promise<PaginatedResponse<Customer>> {
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
    throw new Error(`Failed to fetch customers: ${res.statusText}`);
  }
  
  return res.json();
}

/**
 * Fetch single customer by ID
 */
export async function fetchCustomer(id: string): Promise<Customer> {
  const res = await fetch(`${API_BASE}/${id}`, {
    credentials: 'include',
  });
  
  if (!res.ok) {
    throw new Error(`Failed to fetch customer ${id}: ${res.statusText}`);
  }
  
  return res.json();
}

/**
 * Create new customer
 */
export async function createCustomer(data: CreateCustomerInput): Promise<Customer> {
  const res = await fetch(API_BASE, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(data),
  });
  
  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.message || `Failed to create customer: ${res.statusText}`);
  }
  
  return res.json();
}

/**
 * Update existing customer
 */
export async function updateCustomer({ systemId, ...data }: UpdateCustomerInput): Promise<Customer> {
  const res = await fetch(`${API_BASE}/${systemId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(data),
  });
  
  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.message || `Failed to update customer: ${res.statusText}`);
  }
  
  return res.json();
}

/**
 * Delete customer (soft delete)
 */
export async function deleteCustomer(id: string): Promise<void> {
  const res = await fetch(`${API_BASE}/${id}`, {
    method: 'DELETE',
    credentials: 'include',
  });
  
  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.message || `Failed to delete customer: ${res.statusText}`);
  }
}

/**
 * Search customers for autocomplete
 */
export async function searchCustomers(query: string, limit = 20): Promise<Customer[]> {
  const res = await fetch(`${API_BASE}?search=${encodeURIComponent(query)}&limit=${limit}`, {
    credentials: 'include',
  });
  
  if (!res.ok) {
    throw new Error(`Failed to search customers: ${res.statusText}`);
  }
  
  const json = await res.json();
  return json.data || [];
}

/**
 * Fetch customer debt summary
 */
export async function fetchCustomerDebt(customerId: string): Promise<{
  totalDebt: number;
  overdueDebt: number;
  transactions: Array<{
    orderId: string;
    amount: number;
    dueDate: string;
    status: string;
  }>;
}> {
  const res = await fetch(`${API_BASE}/${customerId}/debt`, {
    credentials: 'include',
  });
  
  if (!res.ok) {
    throw new Error(`Failed to fetch customer debt: ${res.statusText}`);
  }
  
  return res.json();
}

/**
 * Fetch customer order history
 */
export async function fetchCustomerOrders(customerId: string, params: { page?: number; limit?: number } = {}): Promise<PaginatedResponse<unknown>> {
  const { page = 1, limit = 20 } = params;
  
  const res = await fetch(`${API_BASE}/${customerId}/orders?page=${page}&limit=${limit}`, {
    credentials: 'include',
  });
  
  if (!res.ok) {
    throw new Error(`Failed to fetch customer orders: ${res.statusText}`);
  }
  
  return res.json();
}

// ============ TRASH FUNCTIONS ============

/**
 * Fetch deleted customers
 */
export async function fetchDeletedCustomers(): Promise<Customer[]> {
  const res = await fetch(`${API_BASE}/deleted`, {
    credentials: 'include',
  });
  
  if (!res.ok) {
    throw new Error(`Failed to fetch deleted customers: ${res.statusText}`);
  }
  
  const json = await res.json();
  return json.data || json;
}

/**
 * Restore deleted customer
 */
export async function restoreCustomer(systemId: string): Promise<Customer> {
  const res = await fetch(`${API_BASE}/${systemId}/restore`, {
    method: 'POST',
    credentials: 'include',
  });
  
  const json = await res.json();
  
  if (!res.ok) {
    throw new Error(json.error || json.message || `Failed to restore customer: ${res.statusText}`);
  }
  
  return json.data || json;
}

/**
 * Permanently delete customer
 */
export async function permanentDeleteCustomer(systemId: string): Promise<void> {
  const res = await fetch(`${API_BASE}/${systemId}/permanent`, {
    method: 'DELETE',
    credentials: 'include',
  });
  
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || errorData.message || `Failed to permanently delete customer: ${res.statusText}`);
  }
}

// ============ BULK OPERATIONS ============

/**
 * Bulk delete customers (soft delete)
 */
export async function bulkDeleteCustomers(systemIds: string[]): Promise<void> {
  const res = await fetch(`${API_BASE}/bulk/delete`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ systemIds }),
  });
  
  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.message || `Failed to bulk delete customers: ${res.statusText}`);
  }
}

/**
 * Bulk restore customers
 */
export async function bulkRestoreCustomers(systemIds: string[]): Promise<void> {
  const res = await fetch(`${API_BASE}/bulk/restore`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ systemIds }),
  });
  
  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.message || `Failed to bulk restore customers: ${res.statusText}`);
  }
}

/**
 * Bulk update customer status
 */
export async function bulkUpdateCustomerStatus(systemIds: string[], status: string): Promise<void> {
  const res = await fetch(`${API_BASE}/bulk/status`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ systemIds, status }),
  });
  
  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.message || `Failed to bulk update customer status: ${res.statusText}`);
  }
}
