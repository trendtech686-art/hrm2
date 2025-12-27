/**
 * Storage Locations API functions
 * 
 * ⚠️ Direct import: import { fetchStorageLocations } from '@/features/settings/inventory/api/storage-locations-api'
 */

import type { StorageLocation } from '../storage-location-types';

const BASE_URL = '/api/storage-locations';

export interface StorageLocationsParams {
  page?: number;
  limit?: number;
  search?: string;
  branchId?: string;
  isActive?: boolean;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface StorageLocationsResponse {
  data: StorageLocation[];
  total: number;
  page: number;
  pageSize: number;
}

export async function fetchStorageLocations(params: StorageLocationsParams = {}): Promise<StorageLocationsResponse> {
  const searchParams = new URLSearchParams();
  
  if (params.page) searchParams.set('page', String(params.page));
  if (params.limit) searchParams.set('limit', String(params.limit));
  if (params.search) searchParams.set('search', params.search);
  if (params.branchId) searchParams.set('branchId', params.branchId);
  if (params.isActive !== undefined) searchParams.set('isActive', String(params.isActive));
  if (params.sortBy) searchParams.set('sortBy', params.sortBy);
  if (params.sortOrder) searchParams.set('sortOrder', params.sortOrder);
  
  const url = searchParams.toString() ? `${BASE_URL}?${searchParams}` : BASE_URL;
  const response = await fetch(url);
  
  if (!response.ok) {
    throw new Error(`Failed to fetch storage locations: ${response.statusText}`);
  }
  
  return response.json();
}

export async function fetchStorageLocation(systemId: string): Promise<StorageLocation> {
  const response = await fetch(`${BASE_URL}/${systemId}`);
  
  if (!response.ok) {
    throw new Error(`Failed to fetch storage location: ${response.statusText}`);
  }
  
  return response.json();
}

export async function createStorageLocation(data: Omit<StorageLocation, 'systemId' | 'createdAt' | 'updatedAt'>): Promise<StorageLocation> {
  const response = await fetch(BASE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || 'Failed to create storage location');
  }
  
  return response.json();
}

export async function updateStorageLocation(systemId: string, data: Partial<StorageLocation>): Promise<StorageLocation> {
  const response = await fetch(`${BASE_URL}/${systemId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || 'Failed to update storage location');
  }
  
  return response.json();
}

export async function deleteStorageLocation(systemId: string): Promise<void> {
  const response = await fetch(`${BASE_URL}/${systemId}`, {
    method: 'DELETE',
  });
  
  if (!response.ok) {
    throw new Error(`Failed to delete storage location: ${response.statusText}`);
  }
}

export type { StorageLocation };
