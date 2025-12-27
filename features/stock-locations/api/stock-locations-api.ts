/**
 * Stock Locations API Layer
 * Handles all stock location-related API calls
 */

import type { StockLocation } from '@/lib/types/prisma-extended';

export interface StockLocationFilters {
  page?: number;
  limit?: number;
  branchSystemId?: string;
  search?: string;
}

export interface StockLocationResponse {
  data: StockLocation[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface StockLocationCreateInput {
  systemId?: string;
  id?: string;
  name: string;
  branchSystemId: string;
}

export interface StockLocationUpdateInput extends Partial<StockLocationCreateInput> {}

const BASE_URL = '/api/stock-locations';

/**
 * Fetch stock locations with filters
 */
export async function fetchStockLocations(
  filters: StockLocationFilters = {}
): Promise<StockLocationResponse> {
  const params = new URLSearchParams();
  
  if (filters.page) params.set('page', String(filters.page));
  if (filters.limit) params.set('limit', String(filters.limit));
  if (filters.branchSystemId) params.set('branchSystemId', filters.branchSystemId);
  if (filters.search) params.set('search', filters.search);

  const url = params.toString() ? `${BASE_URL}?${params}` : BASE_URL;
  const response = await fetch(url);
  
  if (!response.ok) {
    throw new Error('Failed to fetch stock locations');
  }
  
  return response.json();
}

/**
 * Fetch single stock location by ID
 */
export async function fetchStockLocationById(
  systemId: string
): Promise<StockLocation> {
  const response = await fetch(`${BASE_URL}/${systemId}`);
  
  if (!response.ok) {
    throw new Error('Failed to fetch stock location');
  }
  
  return response.json();
}

/**
 * Create new stock location
 */
export async function createStockLocation(
  data: StockLocationCreateInput
): Promise<StockLocation> {
  const response = await fetch(BASE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.error || 'Failed to create stock location');
  }
  
  return response.json();
}

/**
 * Update stock location
 */
export async function updateStockLocation(
  systemId: string,
  data: StockLocationUpdateInput
): Promise<StockLocation> {
  const response = await fetch(`${BASE_URL}/${systemId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.error || 'Failed to update stock location');
  }
  
  return response.json();
}

/**
 * Delete stock location
 */
export async function deleteStockLocation(systemId: string): Promise<void> {
  const response = await fetch(`${BASE_URL}/${systemId}`, {
    method: 'DELETE',
  });
  
  if (!response.ok) {
    throw new Error('Failed to delete stock location');
  }
}

/**
 * Get stock locations for a branch
 */
export async function fetchBranchStockLocations(
  branchSystemId: string
): Promise<StockLocation[]> {
  const response = await fetchStockLocations({
    branchSystemId,
    limit: 100,
  });
  return response.data;
}
