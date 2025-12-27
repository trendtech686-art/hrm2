/**
 * Stock History API Layer
 * Handles all stock history-related API calls
 */

import type { StockHistoryEntry, StockHistoryAction } from '@/lib/types/prisma-extended';

export interface StockHistoryFilters {
  page?: number;
  limit?: number;
  productId?: string;
  branchSystemId?: string;
  action?: StockHistoryAction | string;
  fromDate?: string;
  toDate?: string;
  documentId?: string;
}

export interface StockHistoryResponse {
  data: StockHistoryEntry[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface StockHistoryCreateInput {
  systemId?: string;
  productId: string;
  date: string;
  employeeName: string;
  action: StockHistoryAction | string;
  quantityChange: number;
  newStockLevel: number;
  documentId: string;
  branchSystemId: string;
  branch: string;
}

const BASE_URL = '/api/inventory/stock-history';

/**
 * Fetch stock history with filters
 */
export async function fetchStockHistory(
  filters: StockHistoryFilters = {}
): Promise<StockHistoryResponse> {
  const params = new URLSearchParams();
  
  if (filters.page) params.set('page', String(filters.page));
  if (filters.limit) params.set('limit', String(filters.limit));
  if (filters.productId) params.set('productId', filters.productId);
  if (filters.branchSystemId) params.set('branchSystemId', filters.branchSystemId);
  if (filters.action) params.set('action', filters.action);
  if (filters.fromDate) params.set('fromDate', filters.fromDate);
  if (filters.toDate) params.set('toDate', filters.toDate);
  if (filters.documentId) params.set('documentId', filters.documentId);

  const url = params.toString() ? `${BASE_URL}?${params}` : BASE_URL;
  const response = await fetch(url);
  
  if (!response.ok) {
    throw new Error('Failed to fetch stock history');
  }
  
  return response.json();
}

/**
 * Fetch stock history for a specific product
 */
export async function fetchProductStockHistory(
  productId: string,
  options?: { limit?: number; fromDate?: string; toDate?: string }
): Promise<StockHistoryEntry[]> {
  const response = await fetchStockHistory({
    productId,
    limit: options?.limit || 100,
    fromDate: options?.fromDate,
    toDate: options?.toDate,
  });
  return response.data;
}

/**
 * Create stock history entry
 */
export async function createStockHistory(
  data: StockHistoryCreateInput
): Promise<StockHistoryEntry> {
  const response = await fetch(BASE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.error || 'Failed to create stock history entry');
  }
  
  return response.json();
}

/**
 * Get stock movement summary for a product
 */
export async function fetchStockMovementSummary(
  productId: string,
  period?: { fromDate: string; toDate: string }
): Promise<{
  inbound: number;
  outbound: number;
  netChange: number;
  transactions: number;
}> {
  const params = new URLSearchParams({ productId });
  if (period?.fromDate) params.set('fromDate', period.fromDate);
  if (period?.toDate) params.set('toDate', period.toDate);
  
  const response = await fetch(`${BASE_URL}/summary?${params}`);
  
  if (!response.ok) {
    throw new Error('Failed to fetch stock movement summary');
  }
  
  return response.json();
}
