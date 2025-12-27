/**
 * Payment Methods API functions
 * 
 * ⚠️ Direct import: import { fetchPaymentMethods } from '@/features/settings/payments/api/payment-methods-api'
 */

// PaymentMethod type matching API response (includes isDefault from API transformation)
export interface PaymentMethod {
  systemId: string;
  id: string;
  name: string;
  code?: string;
  type?: string;
  isActive: boolean;
  isDefault: boolean;
  // Bank account info (for transfer methods)
  accountNumber?: string;
  accountName?: string;
  bankName?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const BASE_URL = '/api/settings/payment-methods';

export interface PaymentMethodsParams {
  page?: number;
  limit?: number;
  search?: string;
  isActive?: boolean;
  type?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaymentMethodsResponse {
  data: PaymentMethod[];
  total: number;
  page: number;
  pageSize: number;
}

export async function fetchPaymentMethods(params: PaymentMethodsParams = {}): Promise<PaymentMethodsResponse> {
  const searchParams = new URLSearchParams();
  
  if (params.page) searchParams.set('page', String(params.page));
  if (params.limit) searchParams.set('limit', String(params.limit));
  if (params.search) searchParams.set('search', params.search);
  if (params.isActive !== undefined) searchParams.set('isActive', String(params.isActive));
  if (params.type) searchParams.set('type', params.type);
  if (params.sortBy) searchParams.set('sortBy', params.sortBy);
  if (params.sortOrder) searchParams.set('sortOrder', params.sortOrder);
  
  const url = searchParams.toString() ? `${BASE_URL}?${searchParams}` : BASE_URL;
  const response = await fetch(url);
  
  if (!response.ok) {
    throw new Error(`Failed to fetch payment methods: ${response.statusText}`);
  }
  
  return response.json();
}

export async function fetchPaymentMethod(systemId: string): Promise<PaymentMethod> {
  const response = await fetch(`${BASE_URL}/${systemId}`);
  
  if (!response.ok) {
    throw new Error(`Failed to fetch payment method: ${response.statusText}`);
  }
  
  return response.json();
}

export async function createPaymentMethod(data: Omit<PaymentMethod, 'systemId' | 'createdAt' | 'updatedAt'>): Promise<PaymentMethod> {
  const response = await fetch(BASE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || 'Failed to create payment method');
  }
  
  return response.json();
}

export async function updatePaymentMethod(systemId: string, data: Partial<PaymentMethod>): Promise<PaymentMethod> {
  const response = await fetch(`${BASE_URL}/${systemId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || 'Failed to update payment method');
  }
  
  return response.json();
}

export async function deletePaymentMethod(systemId: string): Promise<void> {
  const response = await fetch(`${BASE_URL}/${systemId}`, {
    method: 'DELETE',
  });
  
  if (!response.ok) {
    throw new Error(`Failed to delete payment method: ${response.statusText}`);
  }
}
