/**
 * Cost Adjustments API Layer
 * Handles all cost adjustment-related API calls
 */

import type { CostAdjustment, CostAdjustmentStatus, CostAdjustmentType, CostAdjustmentItem } from '../types';

export interface CostAdjustmentFilters {
  page?: number;
  limit?: number;
  status?: CostAdjustmentStatus;
  type?: CostAdjustmentType;
  fromDate?: string;
  toDate?: string;
  search?: string;
  productId?: string;
}

export interface CostAdjustmentResponse {
  data: CostAdjustment[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface CostAdjustmentCreateInput {
  systemId?: string;
  id?: string;
  type: CostAdjustmentType;
  status?: CostAdjustmentStatus;
  items: CostAdjustmentItem[];
  note?: string;
  reason?: string;
  referenceCode?: string;
}

export interface CostAdjustmentUpdateInput extends Partial<CostAdjustmentCreateInput> {}

const BASE_URL = '/api/cost-adjustments';

/**
 * Fetch cost adjustments with filters
 */
export async function fetchCostAdjustments(
  filters: CostAdjustmentFilters = {}
): Promise<CostAdjustmentResponse> {
  const params = new URLSearchParams();
  
  if (filters.page) params.set('page', String(filters.page));
  if (filters.limit) params.set('limit', String(filters.limit));
  if (filters.status) params.set('status', filters.status);
  if (filters.type) params.set('type', filters.type);
  if (filters.fromDate) params.set('fromDate', filters.fromDate);
  if (filters.toDate) params.set('toDate', filters.toDate);
  if (filters.search) params.set('search', filters.search);
  if (filters.productId) params.set('productId', filters.productId);

  const url = params.toString() ? `${BASE_URL}?${params}` : BASE_URL;
  const response = await fetch(url);
  
  if (!response.ok) {
    throw new Error('Failed to fetch cost adjustments');
  }
  
  return response.json();
}

/**
 * Fetch single cost adjustment by ID
 */
export async function fetchCostAdjustmentById(
  systemId: string
): Promise<CostAdjustment> {
  const response = await fetch(`${BASE_URL}/${systemId}`);
  
  if (!response.ok) {
    throw new Error('Failed to fetch cost adjustment');
  }
  
  return response.json();
}

/**
 * Create new cost adjustment
 */
export async function createCostAdjustment(
  data: CostAdjustmentCreateInput
): Promise<CostAdjustment> {
  const response = await fetch(BASE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.error || 'Failed to create cost adjustment');
  }
  
  return response.json();
}

/**
 * Update cost adjustment
 */
export async function updateCostAdjustment(
  systemId: string,
  data: CostAdjustmentUpdateInput
): Promise<CostAdjustment> {
  const response = await fetch(`${BASE_URL}/${systemId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.error || 'Failed to update cost adjustment');
  }
  
  return response.json();
}

/**
 * Delete cost adjustment
 */
export async function deleteCostAdjustment(systemId: string): Promise<void> {
  const response = await fetch(`${BASE_URL}/${systemId}`, {
    method: 'DELETE',
  });
  
  if (!response.ok) {
    throw new Error('Failed to delete cost adjustment');
  }
}

/**
 * Confirm cost adjustment
 */
export async function confirmCostAdjustment(
  systemId: string
): Promise<CostAdjustment> {
  return updateCostAdjustment(systemId, { status: 'confirmed' });
}

/**
 * Cancel cost adjustment
 */
export async function cancelCostAdjustment(
  systemId: string
): Promise<CostAdjustment> {
  return updateCostAdjustment(systemId, { status: 'cancelled' });
}
