/**
 * Stock History API Layer
 * Handles all stock history-related API calls
 * Read operations use API routes, mutations use Server Actions
 */

import { createStockHistory as createStockHistoryAction } from '@/app/actions/stock-history';
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
  branchId: string; // API uses branchId
  action: StockHistoryAction | string;
  source?: string;
  quantityChange: number;
  newStockLevel: number;
  documentId?: string;
  documentType?: string;
  employeeName?: string;
  note?: string;
}

const BASE_URL = '/api/stock-history';

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
 * Create stock history entry (uses Server Action)
 */
export async function createStockHistory(
  data: StockHistoryCreateInput
): Promise<StockHistoryEntry> {
  const result = await createStockHistoryAction(data);
  if (!result.success) {
    throw new Error(result.error || 'Failed to create stock history entry');
  }
  return result.data!;
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
