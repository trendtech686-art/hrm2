/**
 * Payment Methods API
 */

import type { PaymentMethod } from '@/lib/types/prisma-extended';

interface ApiResponse<T> {
  data: T;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

const API_BASE = '/api/settings/payment-methods';

export type PaymentMethodFilters = {
  isActive?: boolean;
};

export type PaymentMethodCreateInput = Omit<PaymentMethod, 'systemId' | 'isDefault' | 'createdAt' | 'updatedAt'>;
export type PaymentMethodUpdateInput = Partial<PaymentMethodCreateInput>;

export async function fetchPaymentMethods(filters: PaymentMethodFilters = {}): Promise<ApiResponse<PaymentMethod[]>> {
  const params = new URLSearchParams();
  if (filters.isActive !== undefined) params.append('isActive', String(filters.isActive));
  
  const url = params.toString() ? `${API_BASE}?${params}` : API_BASE;
  const response = await fetch(url);
  if (!response.ok) throw new Error('Failed to fetch payment methods');
  return response.json();
}

export async function fetchPaymentMethodById(systemId: string): Promise<ApiResponse<PaymentMethod>> {
  const response = await fetch(`${API_BASE}/${systemId}`);
  if (!response.ok) throw new Error('Failed to fetch payment method');
  return response.json();
}

export async function createPaymentMethod(data: PaymentMethodCreateInput): Promise<ApiResponse<PaymentMethod>> {
  const response = await fetch(API_BASE, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error('Failed to create payment method');
  return response.json();
}

export async function updatePaymentMethod(
  systemId: string,
  data: PaymentMethodUpdateInput
): Promise<ApiResponse<PaymentMethod>> {
  const response = await fetch(`${API_BASE}/${systemId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error('Failed to update payment method');
  return response.json();
}

export async function deletePaymentMethod(systemId: string): Promise<ApiResponse<void>> {
  const response = await fetch(`${API_BASE}/${systemId}`, {
    method: 'DELETE',
  });
  if (!response.ok) throw new Error('Failed to delete payment method');
  return response.json();
}

export async function setDefaultPaymentMethod(systemId: string): Promise<ApiResponse<PaymentMethod>> {
  const response = await fetch(`${API_BASE}/${systemId}/set-default`, {
    method: 'PATCH',
  });
  if (!response.ok) throw new Error('Failed to set default payment method');
  return response.json();
}

export async function fetchActivePaymentMethods(): Promise<ApiResponse<PaymentMethod[]>> {
  return fetchPaymentMethods({ isActive: true });
}
