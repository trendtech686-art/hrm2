/**
 * Receipts (Phiếu Thu) API functions
 * 
 * ⚠️ Direct import: import { fetchReceipts } from '@/features/receipts/api/receipts-api'
 */

import type { SystemId } from '@/lib/id-types';
import type { Receipt, ReceiptStatus, ReceiptCategory } from '@/lib/types/prisma-extended';

const BASE_URL = '/api/receipts';

export interface ReceiptsParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: ReceiptStatus;
  category?: ReceiptCategory;
  payerTypeSystemId?: string;
  payerSystemId?: string;
  branchId?: string;
  accountId?: string;
  startDate?: string;
  endDate?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface ReceiptsResponse {
  data: Receipt[];
  total: number;
  page: number;
  pageSize: number;
}

export async function fetchReceipts(params: ReceiptsParams = {}): Promise<ReceiptsResponse> {
  const searchParams = new URLSearchParams();
  
  if (params.page) searchParams.set('page', String(params.page));
  if (params.limit) searchParams.set('limit', String(params.limit));
  if (params.search) searchParams.set('search', params.search);
  if (params.status) searchParams.set('status', params.status);
  if (params.category) searchParams.set('category', params.category);
  if (params.payerTypeSystemId) searchParams.set('payerTypeSystemId', params.payerTypeSystemId);
  if (params.payerSystemId) searchParams.set('payerSystemId', params.payerSystemId);
  if (params.branchId) searchParams.set('branchId', params.branchId);
  if (params.accountId) searchParams.set('accountId', params.accountId);
  if (params.startDate) searchParams.set('startDate', params.startDate);
  if (params.endDate) searchParams.set('endDate', params.endDate);
  if (params.sortBy) searchParams.set('sortBy', params.sortBy);
  if (params.sortOrder) searchParams.set('sortOrder', params.sortOrder);
  
  const url = searchParams.toString() ? `${BASE_URL}?${searchParams}` : BASE_URL;
  const response = await fetch(url);
  
  if (!response.ok) {
    throw new Error(`Failed to fetch receipts: ${response.statusText}`);
  }
  
  return response.json();
}

export async function fetchReceipt(systemId: SystemId): Promise<Receipt> {
  const response = await fetch(`${BASE_URL}/${systemId}`);
  
  if (!response.ok) {
    throw new Error(`Failed to fetch receipt: ${response.statusText}`);
  }
  
  return response.json();
}

export async function createReceipt(data: Omit<Receipt, 'systemId' | 'id' | 'createdAt' | 'updatedAt'>): Promise<Receipt> {
  const response = await fetch(BASE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || 'Failed to create receipt');
  }
  
  return response.json();
}

export async function updateReceipt(systemId: SystemId, data: Partial<Receipt>): Promise<Receipt> {
  const response = await fetch(`${BASE_URL}/${systemId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || 'Failed to update receipt');
  }
  
  return response.json();
}

export async function deleteReceipt(systemId: SystemId): Promise<void> {
  const response = await fetch(`${BASE_URL}/${systemId}`, {
    method: 'DELETE',
  });
  
  if (!response.ok) {
    throw new Error(`Failed to delete receipt: ${response.statusText}`);
  }
}

export async function cancelReceipt(systemId: SystemId, reason?: string): Promise<Receipt> {
  const response = await fetch(`${BASE_URL}/${systemId}/cancel`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ reason }),
  });
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || 'Failed to cancel receipt');
  }
  
  return response.json();
}

export async function fetchReceiptStats(): Promise<{
  total: number;
  completed: number;
  cancelled: number;
  totalAmount: number;
}> {
  const response = await fetch(`${BASE_URL}/stats`);
  
  if (!response.ok) {
    throw new Error(`Failed to fetch receipt stats: ${response.statusText}`);
  }
  
  return response.json();
}
