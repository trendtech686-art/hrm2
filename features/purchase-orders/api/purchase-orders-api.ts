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
  paymentStatus?: string;
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

// Batch import result type
interface BatchImportResult {
  success: number;
  failed: number;
  inserted: number;
  updated: number;
  skipped: number;
  errors: Array<{ index: number; id?: string; message: string }>;
}

export async function batchImportPurchaseOrders(
  purchaseOrders: Record<string, unknown>[],
  mode: 'insert-only' | 'update-only' | 'upsert',
): Promise<BatchImportResult> {
  const res = await fetch(`${API_BASE}/batch-import`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ purchaseOrders, mode }),
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.message || `Batch import failed: ${res.statusText}`);
  }

  const json = await res.json();
  return json.data ?? json;
}
