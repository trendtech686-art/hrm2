/**
 * Inventory Receipts (Phiếu Nhập Kho) API functions
 * 
 * ⚠️ Direct import: import { fetchInventoryReceipts } from '@/features/inventory-receipts/api/inventory-receipts-api'
 */

import type { SystemId } from '@/lib/id-types';
import type { InventoryReceipt } from '@/lib/types/prisma-extended';

const BASE_URL = '/api/inventory-receipts';

export interface InventoryReceiptsParams {
  page?: number;
  limit?: number;
  search?: string;
  supplierId?: string;
  purchaseOrderId?: string;
  branchId?: string;
  receiverId?: string;
  startDate?: string;
  endDate?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface InventoryReceiptsResponse {
  data: InventoryReceipt[];
  total: number;
  page: number;
  pageSize: number;
}

export async function fetchInventoryReceipts(params: InventoryReceiptsParams = {}): Promise<InventoryReceiptsResponse> {
  const searchParams = new URLSearchParams();
  
  if (params.page) searchParams.set('page', String(params.page));
  if (params.limit) searchParams.set('limit', String(params.limit));
  if (params.search) searchParams.set('search', params.search);
  if (params.supplierId) searchParams.set('supplierId', params.supplierId);
  if (params.purchaseOrderId) searchParams.set('purchaseOrderId', params.purchaseOrderId);
  if (params.branchId) searchParams.set('branchId', params.branchId);
  if (params.receiverId) searchParams.set('receiverId', params.receiverId);
  if (params.startDate) searchParams.set('startDate', params.startDate);
  if (params.endDate) searchParams.set('endDate', params.endDate);
  if (params.sortBy) searchParams.set('sortBy', params.sortBy);
  if (params.sortOrder) searchParams.set('sortOrder', params.sortOrder);
  
  const url = searchParams.toString() ? `${BASE_URL}?${searchParams}` : BASE_URL;
  const response = await fetch(url);
  
  if (!response.ok) {
    throw new Error(`Failed to fetch inventory receipts: ${response.statusText}`);
  }
  
  return response.json();
}

export async function fetchInventoryReceipt(systemId: SystemId): Promise<InventoryReceipt> {
  const response = await fetch(`${BASE_URL}/${systemId}`);
  
  if (!response.ok) {
    throw new Error(`Failed to fetch inventory receipt: ${response.statusText}`);
  }
  
  return response.json();
}

export async function createInventoryReceipt(data: Omit<InventoryReceipt, 'systemId' | 'id' | 'createdAt' | 'updatedAt'>): Promise<InventoryReceipt> {
  const response = await fetch(BASE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || 'Failed to create inventory receipt');
  }
  
  return response.json();
}

export async function updateInventoryReceipt(systemId: SystemId, data: Partial<InventoryReceipt>): Promise<InventoryReceipt> {
  const response = await fetch(`${BASE_URL}/${systemId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || 'Failed to update inventory receipt');
  }
  
  return response.json();
}

export async function deleteInventoryReceipt(systemId: SystemId): Promise<void> {
  const response = await fetch(`${BASE_URL}/${systemId}`, {
    method: 'DELETE',
  });
  
  if (!response.ok) {
    throw new Error(`Failed to delete inventory receipt: ${response.statusText}`);
  }
}
