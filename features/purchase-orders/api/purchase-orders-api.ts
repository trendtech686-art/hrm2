/**
 * Purchase Orders API - Isolated API functions
 */

import type { PurchaseOrder } from '@/lib/types/prisma-extended';

const API_BASE = '/api/purchase-orders';

export interface PurchaseOrdersParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  supplierId?: string;
  branchId?: string;
  startDate?: string;
  endDate?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export async function fetchPurchaseOrders(params: PurchaseOrdersParams = {}): Promise<PaginatedResponse<PurchaseOrder>> {
  const { page = 1, limit = 50, ...rest } = params;
  
  const searchParams = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });
  
  Object.entries(rest).forEach(([key, value]) => {
    if (value != null && value !== '') {
      searchParams.set(key, String(value));
    }
  });
  
  const res = await fetch(`${API_BASE}?${searchParams}`, { credentials: 'include' });
  if (!res.ok) throw new Error(`Failed to fetch purchase orders: ${res.statusText}`);
  return res.json();
}

export async function fetchPurchaseOrder(id: string): Promise<PurchaseOrder> {
  const res = await fetch(`${API_BASE}/${id}`, { credentials: 'include' });
  if (!res.ok) throw new Error(`Failed to fetch purchase order: ${res.statusText}`);
  return res.json();
}

export async function createPurchaseOrder(data: Partial<PurchaseOrder>): Promise<PurchaseOrder> {
  const res = await fetch(API_BASE, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.message || `Failed to create purchase order`);
  }
  return res.json();
}

export async function updatePurchaseOrder(systemId: string, data: Partial<PurchaseOrder>): Promise<PurchaseOrder> {
  const res = await fetch(`${API_BASE}/${systemId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.message || `Failed to update purchase order`);
  }
  return res.json();
}

export async function deletePurchaseOrder(id: string): Promise<void> {
  const res = await fetch(`${API_BASE}/${id}`, { method: 'DELETE', credentials: 'include' });
  if (!res.ok) throw new Error(`Failed to delete purchase order`);
}

export async function searchPurchaseOrders(query: string, limit = 20): Promise<PurchaseOrder[]> {
  const res = await fetch(`${API_BASE}?search=${encodeURIComponent(query)}&limit=${limit}`, { credentials: 'include' });
  if (!res.ok) throw new Error(`Failed to search purchase orders`);
  const json = await res.json();
  return json.data || [];
}
