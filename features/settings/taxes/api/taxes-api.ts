/**
 * Taxes Settings API Layer
 * Handles all tax-related API calls
 */

import type { Tax } from '@/lib/types/prisma-extended';

export interface TaxFilters {
  page?: number;
  limit?: number;
  isDefaultSale?: boolean;
  isDefaultPurchase?: boolean;
}

export interface TaxResponse {
  data: Tax[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface TaxCreateInput {
  systemId?: string;
  id?: string;
  name: string;
  rate: number;
  description?: string;
  isDefaultSale?: boolean;
  isDefaultPurchase?: boolean;
}

export interface TaxUpdateInput extends Partial<TaxCreateInput> {}

const BASE_URL = '/api/settings/taxes';
const LEGACY_URL = '/api/settings/data?type=tax';

/**
 * Fetch taxes with filters
 */
export async function fetchTaxes(
  filters: TaxFilters = {}
): Promise<TaxResponse> {
  const params = new URLSearchParams();
  
  if (filters.page) params.set('page', String(filters.page));
  if (filters.limit) params.set('limit', String(filters.limit));
  if (filters.isDefaultSale !== undefined) params.set('isDefaultSale', String(filters.isDefaultSale));
  if (filters.isDefaultPurchase !== undefined) params.set('isDefaultPurchase', String(filters.isDefaultPurchase));

  // Try new endpoint first, fallback to legacy
  let url = params.toString() ? `${BASE_URL}?${params}` : BASE_URL;
  let response = await fetch(url);
  
  // Fallback to legacy endpoint
  if (!response.ok && response.status === 404) {
    url = `${LEGACY_URL}${params.toString() ? '&' + params : ''}`;
    response = await fetch(url);
  }
  
  if (!response.ok) {
    throw new Error('Failed to fetch taxes');
  }
  
  return response.json();
}

/**
 * Fetch single tax by ID
 */
export async function fetchTaxById(
  systemId: string
): Promise<Tax> {
  const response = await fetch(`${BASE_URL}/${systemId}`);
  
  if (!response.ok) {
    throw new Error('Failed to fetch tax');
  }
  
  return response.json();
}

/**
 * Create new tax
 */
export async function createTax(
  data: TaxCreateInput
): Promise<Tax> {
  const response = await fetch(BASE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.error || 'Failed to create tax');
  }
  
  return response.json();
}

/**
 * Update tax
 */
export async function updateTax(
  systemId: string,
  data: TaxUpdateInput
): Promise<Tax> {
  const response = await fetch(`${BASE_URL}/${systemId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.error || 'Failed to update tax');
  }
  
  return response.json();
}

/**
 * Delete tax
 */
export async function deleteTax(systemId: string): Promise<void> {
  const response = await fetch(`${BASE_URL}/${systemId}`, {
    method: 'DELETE',
  });
  
  if (!response.ok) {
    throw new Error('Failed to delete tax');
  }
}

/**
 * Set default tax for sales
 */
export async function setDefaultSaleTax(
  systemId: string
): Promise<Tax> {
  const response = await fetch(`${BASE_URL}/${systemId}/set-default-sale`, {
    method: 'POST',
  });
  
  if (!response.ok) {
    throw new Error('Failed to set default sale tax');
  }
  
  return response.json();
}

/**
 * Set default tax for purchases
 */
export async function setDefaultPurchaseTax(
  systemId: string
): Promise<Tax> {
  const response = await fetch(`${BASE_URL}/${systemId}/set-default-purchase`, {
    method: 'POST',
  });
  
  if (!response.ok) {
    throw new Error('Failed to set default purchase tax');
  }
  
  return response.json();
}

/**
 * Get all taxes
 */
export async function fetchAllTaxes(): Promise<Tax[]> {
  const response = await fetchTaxes({ limit: 100 });
  return response.data;
}
