/**
 * Stock Locations API Layer
 * Handles all stock location-related API calls
 * Read operations use API routes, mutations use Server Actions
 */

import { fetchAllPages } from '@/lib/fetch-all-pages';
import {
  createStockLocationAction,
  updateStockLocationAction,
  deleteStockLocationAction,
} from '@/app/actions/stock-locations';
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
 * Create new stock location (uses Server Action)
 */
export async function createStockLocation(
  data: StockLocationCreateInput
): Promise<StockLocation> {
  const result = await createStockLocationAction({
    name: data.name,
    branchId: data.branchSystemId,
    branchSystemId: data.branchSystemId,
  });
  if (!result.success) {
    throw new Error(result.error || 'Failed to create stock location');
  }
  return result.data! as unknown as StockLocation;
}

/**
 * Update stock location (uses Server Action)
 */
export async function updateStockLocation(
  systemId: string,
  data: StockLocationUpdateInput
): Promise<StockLocation> {
  const result = await updateStockLocationAction({
    systemId,
    name: data.name,
  });
  if (!result.success) {
    throw new Error(result.error || 'Failed to update stock location');
  }
  return result.data! as unknown as StockLocation;
}

/**
 * Delete stock location (uses Server Action)
 */
export async function deleteStockLocation(systemId: string): Promise<void> {
  const result = await deleteStockLocationAction(systemId);
  if (!result.success) {
    throw new Error(result.error || 'Failed to delete stock location');
  }
}

/**
 * Get stock locations for a branch
 */
export async function fetchBranchStockLocations(
  branchSystemId: string
): Promise<StockLocation[]> {
  return fetchAllPages((p) => fetchStockLocations({ ...p, branchSystemId }));
}
