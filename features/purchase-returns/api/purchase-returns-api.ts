/**
 * Purchase Returns (Phiếu Hoàn Trả NCC) API functions
 * 
 * ⚠️ Direct import: import { fetchPurchaseReturns } from '@/features/purchase-returns/api/purchase-returns-api'
 */

import type { SystemId } from '@/lib/id-types';
import type { PurchaseReturn } from '@/lib/types/prisma-extended';

const BASE_URL = '/api/purchase-returns';

export interface PurchaseReturnsParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  supplierId?: string;
  purchaseOrderId?: string;
  branchId?: string;
  startDate?: string;
  endDate?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PurchaseReturnsResponse {
  data: PurchaseReturn[];
  total: number;
  page: number;
  pageSize: number;
}

export interface PurchaseReturnStatsParams {
  startDate?: string;
  endDate?: string;
  supplierId?: string;
}

export interface PurchaseReturnStats {
  total: number;
  totalValue: number;
  totalRefund: number;
  byStatus: Array<{ status: string; count: number }>;
  recent: Array<{
    systemId: string;
    id: string;
    status: string;
    totalReturnValue: number;
    refundAmount: number;
    supplierName: string;
    returnDate: string;
    createdAt: string;
  }>;
}

export async function fetchPurchaseReturns(params: PurchaseReturnsParams = {}): Promise<PurchaseReturnsResponse> {
  const searchParams = new URLSearchParams();
  
  if (params.page) searchParams.set('page', String(params.page));
  if (params.limit) searchParams.set('limit', String(params.limit));
  if (params.search) searchParams.set('search', params.search);
  if (params.status) searchParams.set('status', params.status);
  if (params.supplierId) searchParams.set('supplierId', params.supplierId);
  if (params.purchaseOrderId) searchParams.set('purchaseOrderId', params.purchaseOrderId);
  if (params.branchId) searchParams.set('branchId', params.branchId);
  if (params.startDate) searchParams.set('startDate', params.startDate);
  if (params.endDate) searchParams.set('endDate', params.endDate);
  if (params.sortBy) searchParams.set('sortBy', params.sortBy);
  if (params.sortOrder) searchParams.set('sortOrder', params.sortOrder);
  
  const url = searchParams.toString() ? `${BASE_URL}?${searchParams}` : BASE_URL;
  const response = await fetch(url);
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || `Failed to fetch purchase returns: ${response.statusText}`);
  }
  
  return response.json();
}

export async function fetchPurchaseReturn(systemId: SystemId): Promise<PurchaseReturn> {
  const response = await fetch(`${BASE_URL}/${systemId}`);
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || `Failed to fetch purchase return: ${response.statusText}`);
  }
  
  return response.json();
}

export async function createPurchaseReturn(data: Partial<PurchaseReturn>): Promise<PurchaseReturn> {
  const response = await fetch(BASE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || 'Failed to create purchase return');
  }
  
  return response.json();
}

export async function updatePurchaseReturn(systemId: SystemId, data: Partial<PurchaseReturn>): Promise<PurchaseReturn> {
  const response = await fetch(`${BASE_URL}/${systemId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || 'Failed to update purchase return');
  }
  
  return response.json();
}

export async function processPurchaseReturn(systemId: SystemId): Promise<PurchaseReturn> {
  const response = await fetch(`${BASE_URL}/${systemId}/process`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  });
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || 'Failed to process purchase return');
  }
  
  return response.json();
}

export async function deletePurchaseReturn(systemId: SystemId): Promise<void> {
  const response = await fetch(`${BASE_URL}/${systemId}`, {
    method: 'DELETE',
  });
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || `Failed to delete purchase return: ${response.statusText}`);
  }
}

export async function fetchPurchaseReturnStats(params?: PurchaseReturnStatsParams): Promise<PurchaseReturnStats> {
  const searchParams = new URLSearchParams();
  
  if (params?.startDate) searchParams.set('startDate', params.startDate);
  if (params?.endDate) searchParams.set('endDate', params.endDate);
  if (params?.supplierId) searchParams.set('supplierId', params.supplierId);
  
  const url = searchParams.toString() ? `${BASE_URL}/stats?${searchParams}` : `${BASE_URL}/stats`;
  const response = await fetch(url);
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || `Failed to fetch purchase return stats: ${response.statusText}`);
  }
  
  return response.json();
}

