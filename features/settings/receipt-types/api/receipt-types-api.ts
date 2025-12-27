/**
 * Receipt Types API Layer
 */

import type { ReceiptType } from '@/lib/types/prisma-extended';

export interface ReceiptTypeFilters {
  page?: number;
  limit?: number;
  isActive?: boolean;
  isBusinessResult?: boolean;
}

export interface ReceiptTypeResponse {
  data: ReceiptType[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ReceiptTypeCreateInput {
  systemId?: string;
  id?: string;
  name: string;
  description?: string;
  isBusinessResult?: boolean;
  isActive?: boolean;
  isDefault?: boolean;
  color?: string;
  createdAt?: string;
}

export interface ReceiptTypeUpdateInput extends Partial<ReceiptTypeCreateInput> {}

const BASE_URL = '/api/settings/receipt-types';

export async function fetchReceiptTypes(
  filters: ReceiptTypeFilters = {}
): Promise<ReceiptTypeResponse> {
  const params = new URLSearchParams();
  if (filters.page) params.set('page', String(filters.page));
  if (filters.limit) params.set('limit', String(filters.limit));
  if (filters.isActive !== undefined) params.set('isActive', String(filters.isActive));
  if (filters.isBusinessResult !== undefined) params.set('isBusinessResult', String(filters.isBusinessResult));

  const url = params.toString() ? `${BASE_URL}?${params}` : BASE_URL;
  const response = await fetch(url);
  
  if (!response.ok) throw new Error('Failed to fetch receipt types');
  return response.json();
}

export async function fetchReceiptTypeById(systemId: string): Promise<ReceiptType> {
  const response = await fetch(`${BASE_URL}/${systemId}`);
  if (!response.ok) throw new Error('Failed to fetch receipt type');
  return response.json();
}

export async function createReceiptType(data: ReceiptTypeCreateInput): Promise<ReceiptType> {
  const response = await fetch(BASE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error('Failed to create receipt type');
  return response.json();
}

export async function updateReceiptType(
  systemId: string,
  data: ReceiptTypeUpdateInput
): Promise<ReceiptType> {
  const response = await fetch(`${BASE_URL}/${systemId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error('Failed to update receipt type');
  return response.json();
}

export async function deleteReceiptType(systemId: string): Promise<void> {
  const response = await fetch(`${BASE_URL}/${systemId}`, { method: 'DELETE' });
  if (!response.ok) throw new Error('Failed to delete receipt type');
}

export async function setDefaultReceiptType(systemId: string): Promise<ReceiptType> {
  const response = await fetch(`${BASE_URL}/${systemId}/set-default`, { method: 'POST' });
  if (!response.ok) throw new Error('Failed to set default');
  return response.json();
}

export async function fetchActiveReceiptTypes(): Promise<ReceiptType[]> {
  const response = await fetchReceiptTypes({ isActive: true, limit: 100 });
  return response.data;
}
