/**
 * Product Types API service
 */

import type { ProductType } from '@/lib/types/prisma-extended';

const API_ENDPOINT = '/api/settings/product-types';

export interface ProductTypesResponse {
  data: ProductType[];
  pagination?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export async function fetchProductTypes(
  params?: { limit?: number; page?: number }
): Promise<ProductTypesResponse> {
  const queryParams = new URLSearchParams();
  if (params?.limit) queryParams.set('limit', String(params.limit));
  if (params?.page) queryParams.set('page', String(params.page));
  
  const url = queryParams.toString() 
    ? `${API_ENDPOINT}?${queryParams}` 
    : API_ENDPOINT;
    
  const response = await fetch(url, { credentials: 'include' });
  if (!response.ok) {
    throw new Error('Failed to fetch product types');
  }
  return response.json();
}

export async function fetchProductTypeById(systemId: string): Promise<ProductType> {
  const response = await fetch(`${API_ENDPOINT}/${systemId}`, { 
    credentials: 'include' 
  });
  if (!response.ok) {
    throw new Error('Failed to fetch product type');
  }
  const json = await response.json();
  return json.data || json;
}

export async function createProductType(
  data: Omit<ProductType, 'systemId' | 'createdAt' | 'updatedAt'>
): Promise<ProductType> {
  const response = await fetch(API_ENDPOINT, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error('Failed to create product type');
  }
  const json = await response.json();
  return json.data || json;
}

export async function updateProductType(
  systemId: string,
  data: Partial<ProductType>
): Promise<ProductType> {
  const response = await fetch(`${API_ENDPOINT}/${systemId}`, {
    method: 'PATCH',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error('Failed to update product type');
  }
  const json = await response.json();
  return json.data || json;
}

export async function deleteProductType(systemId: string): Promise<void> {
  const response = await fetch(`${API_ENDPOINT}/${systemId}`, {
    method: 'DELETE',
    credentials: 'include',
  });
  if (!response.ok) {
    throw new Error('Failed to delete product type');
  }
}
