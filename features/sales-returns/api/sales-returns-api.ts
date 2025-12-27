/**
 * Sales Returns API functions
 * 
 * ⚠️ Direct import: import { fetchSalesReturns } from '@/features/sales-returns/api/sales-returns-api'
 */

import type { SystemId, BusinessId } from '@/lib/id-types';
import type { SalesReturn } from '@/lib/types/prisma-extended';

const BASE_URL = '/api/sales-returns';

export interface SalesReturnsParams {
  page?: number;
  limit?: number;
  search?: string;
  customerId?: string;
  orderId?: string;
  branchId?: string;
  isReceived?: boolean;
  startDate?: string;
  endDate?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface SalesReturnsResponse {
  data: SalesReturn[];
  total: number;
  page: number;
  pageSize: number;
}

export async function fetchSalesReturns(params: SalesReturnsParams = {}): Promise<SalesReturnsResponse> {
  const searchParams = new URLSearchParams();
  
  if (params.page) searchParams.set('page', String(params.page));
  if (params.limit) searchParams.set('limit', String(params.limit));
  if (params.search) searchParams.set('search', params.search);
  if (params.customerId) searchParams.set('customerId', params.customerId);
  if (params.orderId) searchParams.set('orderId', params.orderId);
  if (params.branchId) searchParams.set('branchId', params.branchId);
  if (params.isReceived !== undefined) searchParams.set('isReceived', String(params.isReceived));
  if (params.startDate) searchParams.set('startDate', params.startDate);
  if (params.endDate) searchParams.set('endDate', params.endDate);
  if (params.sortBy) searchParams.set('sortBy', params.sortBy);
  if (params.sortOrder) searchParams.set('sortOrder', params.sortOrder);
  
  const url = searchParams.toString() ? `${BASE_URL}?${searchParams}` : BASE_URL;
  const response = await fetch(url);
  
  if (!response.ok) {
    throw new Error(`Failed to fetch sales returns: ${response.statusText}`);
  }
  
  return response.json();
}

export async function fetchSalesReturn(systemId: SystemId): Promise<SalesReturn> {
  const response = await fetch(`${BASE_URL}/${systemId}`);
  
  if (!response.ok) {
    throw new Error(`Failed to fetch sales return: ${response.statusText}`);
  }
  
  return response.json();
}

export async function createSalesReturn(data: Omit<SalesReturn, 'systemId' | 'id' | 'createdAt' | 'updatedAt'>): Promise<SalesReturn> {
  const response = await fetch(BASE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || 'Failed to create sales return');
  }
  
  return response.json();
}

export async function updateSalesReturn(systemId: SystemId, data: Partial<SalesReturn>): Promise<SalesReturn> {
  const response = await fetch(`${BASE_URL}/${systemId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || 'Failed to update sales return');
  }
  
  return response.json();
}

export async function deleteSalesReturn(systemId: SystemId): Promise<void> {
  const response = await fetch(`${BASE_URL}/${systemId}`, {
    method: 'DELETE',
  });
  
  if (!response.ok) {
    throw new Error(`Failed to delete sales return: ${response.statusText}`);
  }
}

export async function markAsReceived(systemId: SystemId): Promise<SalesReturn> {
  const response = await fetch(`${BASE_URL}/${systemId}/receive`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  });
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || 'Failed to mark sales return as received');
  }
  
  return response.json();
}

export async function fetchSalesReturnStats(): Promise<{
  total: number;
  pending: number;
  received: number;
  totalValue: number;
}> {
  const response = await fetch(`${BASE_URL}/stats`);
  
  if (!response.ok) {
    throw new Error(`Failed to fetch sales return stats: ${response.statusText}`);
  }
  
  return response.json();
}
