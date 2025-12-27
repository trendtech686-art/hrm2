/**
 * Pricing Settings API Layer
 * Handles all pricing policy-related API calls
 */

import type { PricingPolicy } from '@/lib/types/prisma-extended';

export interface PricingPolicyFilters {
  page?: number;
  limit?: number;
  type?: 'Nhập hàng' | 'Bán hàng';
  isActive?: boolean;
}

export interface PricingPolicyResponse {
  data: PricingPolicy[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface PricingPolicyCreateInput {
  systemId?: string;
  id?: string;
  name: string;
  description?: string;
  type: 'Nhập hàng' | 'Bán hàng';
  isDefault?: boolean;
  isActive?: boolean;
}

export interface PricingPolicyUpdateInput extends Partial<PricingPolicyCreateInput> {}

const BASE_URL = '/api/settings/pricing-policies';
const LEGACY_URL = '/api/settings/data?type=pricing-policy';

/**
 * Fetch pricing policies with filters
 */
export async function fetchPricingPolicies(
  filters: PricingPolicyFilters = {}
): Promise<PricingPolicyResponse> {
  const params = new URLSearchParams();
  
  if (filters.page) params.set('page', String(filters.page));
  if (filters.limit) params.set('limit', String(filters.limit));
  if (filters.type) params.set('type', filters.type);
  if (filters.isActive !== undefined) params.set('isActive', String(filters.isActive));

  // Try new endpoint first, fallback to legacy
  let url = params.toString() ? `${BASE_URL}?${params}` : BASE_URL;
  let response = await fetch(url);
  
  // Fallback to legacy endpoint
  if (!response.ok && response.status === 404) {
    url = `${LEGACY_URL}${params.toString() ? '&' + params : ''}`;
    response = await fetch(url);
  }
  
  if (!response.ok) {
    throw new Error('Failed to fetch pricing policies');
  }
  
  return response.json();
}

/**
 * Fetch single pricing policy by ID
 */
export async function fetchPricingPolicyById(
  systemId: string
): Promise<PricingPolicy> {
  const response = await fetch(`${BASE_URL}/${systemId}`);
  
  if (!response.ok) {
    throw new Error('Failed to fetch pricing policy');
  }
  
  return response.json();
}

/**
 * Create new pricing policy
 */
export async function createPricingPolicy(
  data: PricingPolicyCreateInput
): Promise<PricingPolicy> {
  const response = await fetch(BASE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.error || 'Failed to create pricing policy');
  }
  
  return response.json();
}

/**
 * Update pricing policy
 */
export async function updatePricingPolicy(
  systemId: string,
  data: PricingPolicyUpdateInput
): Promise<PricingPolicy> {
  const response = await fetch(`${BASE_URL}/${systemId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.error || 'Failed to update pricing policy');
  }
  
  return response.json();
}

/**
 * Delete pricing policy
 */
export async function deletePricingPolicy(systemId: string): Promise<void> {
  const response = await fetch(`${BASE_URL}/${systemId}`, {
    method: 'DELETE',
  });
  
  if (!response.ok) {
    throw new Error('Failed to delete pricing policy');
  }
}

/**
 * Set default pricing policy for type
 */
export async function setDefaultPricingPolicy(
  systemId: string
): Promise<PricingPolicy> {
  const response = await fetch(`${BASE_URL}/${systemId}/set-default`, {
    method: 'POST',
  });
  
  if (!response.ok) {
    throw new Error('Failed to set default pricing policy');
  }
  
  return response.json();
}

/**
 * Get active pricing policies
 */
export async function fetchActivePricingPolicies(): Promise<PricingPolicy[]> {
  const response = await fetchPricingPolicies({ isActive: true, limit: 100 });
  return response.data;
}

/**
 * Get pricing policies by type
 */
export async function fetchPricingPoliciesByType(
  type: 'Nhập hàng' | 'Bán hàng'
): Promise<PricingPolicy[]> {
  const response = await fetchPricingPolicies({ type, isActive: true, limit: 100 });
  return response.data;
}
