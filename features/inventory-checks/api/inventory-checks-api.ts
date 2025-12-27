/**
 * Inventory Checks (Phiếu Kiểm Kê) API functions
 * 
 * ⚠️ Direct import: import { fetchInventoryChecks } from '@/features/inventory-checks/api/inventory-checks-api'
 */

import type { SystemId } from '@/lib/id-types';
import type { InventoryCheck, InventoryCheckStatus } from '../types';

const BASE_URL = '/api/inventory-checks';

export interface InventoryChecksParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: InventoryCheckStatus;
  branchId?: string;
  createdBy?: string;
  startDate?: string;
  endDate?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface InventoryChecksResponse {
  data: InventoryCheck[];
  total: number;
  page: number;
  pageSize: number;
}

export async function fetchInventoryChecks(params: InventoryChecksParams = {}): Promise<InventoryChecksResponse> {
  const searchParams = new URLSearchParams();
  
  if (params.page) searchParams.set('page', String(params.page));
  if (params.limit) searchParams.set('limit', String(params.limit));
  if (params.search) searchParams.set('search', params.search);
  if (params.status) searchParams.set('status', params.status);
  if (params.branchId) searchParams.set('branchId', params.branchId);
  if (params.createdBy) searchParams.set('createdBy', params.createdBy);
  if (params.startDate) searchParams.set('startDate', params.startDate);
  if (params.endDate) searchParams.set('endDate', params.endDate);
  if (params.sortBy) searchParams.set('sortBy', params.sortBy);
  if (params.sortOrder) searchParams.set('sortOrder', params.sortOrder);
  
  const url = searchParams.toString() ? `${BASE_URL}?${searchParams}` : BASE_URL;
  const response = await fetch(url);
  
  if (!response.ok) {
    throw new Error(`Failed to fetch inventory checks: ${response.statusText}`);
  }
  
  return response.json();
}

export async function fetchInventoryCheck(systemId: SystemId): Promise<InventoryCheck> {
  const response = await fetch(`${BASE_URL}/${systemId}`);
  
  if (!response.ok) {
    throw new Error(`Failed to fetch inventory check: ${response.statusText}`);
  }
  
  return response.json();
}

export async function createInventoryCheck(data: Omit<InventoryCheck, 'systemId' | 'id' | 'createdAt'>): Promise<InventoryCheck> {
  const response = await fetch(BASE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || 'Failed to create inventory check');
  }
  
  return response.json();
}

export async function updateInventoryCheck(systemId: SystemId, data: Partial<InventoryCheck>): Promise<InventoryCheck> {
  const response = await fetch(`${BASE_URL}/${systemId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || 'Failed to update inventory check');
  }
  
  return response.json();
}

export async function deleteInventoryCheck(systemId: SystemId): Promise<void> {
  const response = await fetch(`${BASE_URL}/${systemId}`, {
    method: 'DELETE',
  });
  
  if (!response.ok) {
    throw new Error(`Failed to delete inventory check: ${response.statusText}`);
  }
}

export async function balanceInventoryCheck(systemId: SystemId): Promise<InventoryCheck> {
  const response = await fetch(`${BASE_URL}/${systemId}/balance`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  });
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || 'Failed to balance inventory check');
  }
  
  return response.json();
}

export async function cancelInventoryCheck(systemId: SystemId, reason: string): Promise<InventoryCheck> {
  const response = await fetch(`${BASE_URL}/${systemId}/cancel`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ reason }),
  });
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || 'Failed to cancel inventory check');
  }
  
  return response.json();
}
