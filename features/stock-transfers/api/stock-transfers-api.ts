/**
 * Stock Transfers (Phiếu Chuyển Kho) API functions
 * 
 * ⚠️ Direct import: import { fetchStockTransfers } from '@/features/stock-transfers/api/stock-transfers-api'
 */

import type { SystemId } from '@/lib/id-types';
import type { StockTransfer, StockTransferStatus } from '@/lib/types/prisma-extended';

const BASE_URL = '/api/stock-transfers';

export interface StockTransfersParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: StockTransferStatus;
  fromBranchId?: string;
  toBranchId?: string;
  createdBy?: string;
  startDate?: string;
  endDate?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface StockTransfersResponse {
  data: StockTransfer[];
  total: number;
  page: number;
  pageSize: number;
}

export async function fetchStockTransfers(params: StockTransfersParams = {}): Promise<StockTransfersResponse> {
  const searchParams = new URLSearchParams();
  
  if (params.page) searchParams.set('page', String(params.page));
  if (params.limit) searchParams.set('limit', String(params.limit));
  if (params.search) searchParams.set('search', params.search);
  if (params.status) searchParams.set('status', params.status);
  if (params.fromBranchId) searchParams.set('fromBranchId', params.fromBranchId);
  if (params.toBranchId) searchParams.set('toBranchId', params.toBranchId);
  if (params.createdBy) searchParams.set('createdBy', params.createdBy);
  if (params.startDate) searchParams.set('startDate', params.startDate);
  if (params.endDate) searchParams.set('endDate', params.endDate);
  if (params.sortBy) searchParams.set('sortBy', params.sortBy);
  if (params.sortOrder) searchParams.set('sortOrder', params.sortOrder);
  
  const url = searchParams.toString() ? `${BASE_URL}?${searchParams}` : BASE_URL;
  const response = await fetch(url);
  
  if (!response.ok) {
    throw new Error(`Failed to fetch stock transfers: ${response.statusText}`);
  }
  
  return response.json();
}

export async function fetchStockTransfer(systemId: SystemId): Promise<StockTransfer> {
  const response = await fetch(`${BASE_URL}/${systemId}`);
  
  if (!response.ok) {
    throw new Error(`Failed to fetch stock transfer: ${response.statusText}`);
  }
  
  return response.json();
}

export async function createStockTransfer(data: Omit<StockTransfer, 'systemId' | 'createdAt' | 'updatedAt'> & { id?: string }): Promise<StockTransfer> {
  const response = await fetch(BASE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || 'Failed to create stock transfer');
  }
  
  return response.json();
}

export async function updateStockTransfer(systemId: SystemId, data: Partial<StockTransfer>): Promise<StockTransfer> {
  const response = await fetch(`${BASE_URL}/${systemId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || 'Failed to update stock transfer');
  }
  
  return response.json();
}

export async function deleteStockTransfer(systemId: SystemId): Promise<void> {
  const response = await fetch(`${BASE_URL}/${systemId}`, {
    method: 'DELETE',
  });
  
  if (!response.ok) {
    throw new Error(`Failed to delete stock transfer: ${response.statusText}`);
  }
}

export async function startTransfer(systemId: SystemId): Promise<StockTransfer> {
  const response = await fetch(`${BASE_URL}/${systemId}/start`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  });
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || 'Failed to start transfer');
  }
  
  return response.json();
}

export async function completeTransfer(systemId: SystemId, receivedItems?: { productSystemId: string; receivedQuantity: number }[]): Promise<StockTransfer> {
  const response = await fetch(`${BASE_URL}/${systemId}/complete`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ receivedItems }),
  });
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || 'Failed to complete transfer');
  }
  
  return response.json();
}

export async function cancelStockTransfer(systemId: SystemId, reason: string): Promise<StockTransfer> {
  const response = await fetch(`${BASE_URL}/${systemId}/cancel`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ reason }),
  });
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || 'Failed to cancel stock transfer');
  }
  
  return response.json();
}

export async function fetchStockTransferStats(): Promise<{
  total: number;
  pending: number;
  transferring: number;
  completed: number;
  cancelled: number;
}> {
  const response = await fetch(`${BASE_URL}/stats`);
  
  if (!response.ok) {
    throw new Error(`Failed to fetch stock transfer stats: ${response.statusText}`);
  }
  
  return response.json();
}
