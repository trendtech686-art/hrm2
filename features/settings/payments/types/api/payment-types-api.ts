/**
 * Payment Types API
 */

import type { PaymentType } from '@/lib/types/prisma-extended';

interface ApiResponse<T> {
  data: T;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

const API_BASE = '/api/settings/payment-types';

export type PaymentTypeFilters = {
  isActive?: boolean;
};

export type PaymentTypeCreateInput = Omit<PaymentType, 'systemId' | 'isDefault' | 'updatedAt'>;
export type PaymentTypeUpdateInput = Partial<Omit<PaymentType, 'systemId'>>;

export async function fetchPaymentTypes(filters: PaymentTypeFilters = {}): Promise<ApiResponse<PaymentType[]>> {
  const params = new URLSearchParams();
  if (filters.isActive !== undefined) params.append('isActive', String(filters.isActive));
  
  const url = params.toString() ? `${API_BASE}?${params}` : API_BASE;
  const response = await fetch(url);
  if (!response.ok) throw new Error('Failed to fetch payment types');
  return response.json();
}

export async function fetchPaymentTypeById(systemId: string): Promise<ApiResponse<PaymentType>> {
  const response = await fetch(`${API_BASE}/${systemId}`);
  if (!response.ok) throw new Error('Failed to fetch payment type');
  return response.json();
}

export async function createPaymentType(data: PaymentTypeCreateInput): Promise<ApiResponse<PaymentType>> {
  const response = await fetch(API_BASE, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error('Failed to create payment type');
  return response.json();
}

export async function updatePaymentType(
  systemId: string,
  data: PaymentTypeUpdateInput
): Promise<ApiResponse<PaymentType>> {
  const response = await fetch(`${API_BASE}/${systemId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error('Failed to update payment type');
  return response.json();
}

export async function deletePaymentType(systemId: string): Promise<ApiResponse<void>> {
  const response = await fetch(`${API_BASE}/${systemId}`, {
    method: 'DELETE',
  });
  if (!response.ok) throw new Error('Failed to delete payment type');
  return response.json();
}

export async function setDefaultPaymentType(systemId: string): Promise<ApiResponse<PaymentType>> {
  const response = await fetch(`${API_BASE}/${systemId}/set-default`, {
    method: 'PATCH',
  });
  if (!response.ok) throw new Error('Failed to set default payment type');
  return response.json();
}

export async function fetchActivePaymentTypes(): Promise<ApiResponse<PaymentType[]>> {
  return fetchPaymentTypes({ isActive: true });
}
