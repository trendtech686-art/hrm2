/**
 * Sales Returns API functions
 * 
 * ⚠️ Direct import: import { fetchSalesReturns } from '@/features/sales-returns/api/sales-returns-api'
 */

import type { SystemId } from '@/lib/id-types';
import type { SalesReturn } from '@/lib/types/prisma-extended';

const BASE_URL = '/api/sales-returns';

export interface SalesReturnsParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  customerId?: string;
  orderId?: string;
  orderSystemId?: string;
  branchId?: string;
  isReceived?: boolean;
  startDate?: string;
  endDate?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface SalesReturnsResponse {
  data: SalesReturn[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export async function fetchSalesReturns(params: SalesReturnsParams = {}): Promise<SalesReturnsResponse> {
  const searchParams = new URLSearchParams();
  
  if (params.page != null) searchParams.set('page', String(params.page));
  if (params.limit != null) searchParams.set('limit', String(params.limit));
  if (params.search) searchParams.set('search', params.search);
  if (params.status) searchParams.set('status', params.status);
  if (params.customerId) searchParams.set('customerId', params.customerId);
  if (params.orderId) searchParams.set('orderId', params.orderId);
  if (params.orderSystemId) searchParams.set('orderSystemId', params.orderSystemId);
  if (params.branchId) searchParams.set('branchId', params.branchId);
  if (params.isReceived !== undefined) searchParams.set('isReceived', String(params.isReceived));
  if (params.startDate) searchParams.set('startDate', params.startDate);
  if (params.endDate) searchParams.set('endDate', params.endDate);
  if (params.sortBy) searchParams.set('sortBy', params.sortBy);
  if (params.sortOrder) searchParams.set('sortOrder', params.sortOrder);
  
  const url = searchParams.toString() ? `${BASE_URL}?${searchParams}` : BASE_URL;
  const response = await fetch(url);
  
  if (!response.ok) {
    throw new Error(`Không thể tải danh sách phiếu trả hàng: ${response.statusText}`);
  }
  
  return response.json();
}

export async function fetchSalesReturn(systemId: SystemId): Promise<SalesReturn> {
  const response = await fetch(`${BASE_URL}/${systemId}`);
  
  if (!response.ok) {
    throw new Error(`Không thể tải phiếu trả hàng: ${response.statusText}`);
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
    throw new Error(error.message || 'Không thể tạo phiếu trả hàng');
  }
  
  return response.json();
}

export async function markAsReceived(systemId: SystemId): Promise<SalesReturn> {
  const response = await fetch(`${BASE_URL}/${systemId}/receive`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  });
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || 'Không thể đánh dấu đã nhận hàng');
  }
  
  return response.json();
}

export interface ExchangeProductData {
  newProductSystemId: string;
  newQuantity: number;
  additionalPayment?: number;
  notes?: string;
}

export async function exchangeProduct(systemId: SystemId, data: ExchangeProductData): Promise<SalesReturn> {
  const response = await fetch(`${BASE_URL}/${systemId}/exchange`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || 'Không thể đổi sản phẩm');
  }
  
  return response.json();
}

