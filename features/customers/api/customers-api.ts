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
