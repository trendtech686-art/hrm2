/**
 * Price Adjustments API Client
 * Read operations use API routes, mutations use Server Actions
 */

import {
  createPriceAdjustmentAction,
  updatePriceAdjustmentAction,
  deletePriceAdjustmentAction,
  confirmPriceAdjustmentAction,
  cancelPriceAdjustmentAction,
  type CreatePriceAdjustmentInput as ServerCreateInput,
  type UpdatePriceAdjustmentInput as ServerUpdateInput,
} from '@/app/actions/price-adjustments';
import type { 
  PriceAdjustment, 
  PriceAdjustmentCreateInput, 
  PriceAdjustmentUpdateInput 
} from '../types';

const BASE_URL = '/api/price-adjustments';

export interface PriceAdjustmentFilters {
  status?: string;
  pricingPolicyId?: string;
  search?: string;
  limit?: number;
  page?: number;
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

/**
 * Fetch price adjustments with filters
 */
export async function fetchPriceAdjustments(
  filters: PriceAdjustmentFilters = {}
): Promise<PaginatedResponse<PriceAdjustment>> {
  const params = new URLSearchParams();
  
  if (filters.status) params.set('status', filters.status);
  if (filters.pricingPolicyId) params.set('pricingPolicyId', filters.pricingPolicyId);
  if (filters.search) params.set('search', filters.search);
  if (filters.limit) params.set('limit', filters.limit.toString());
  if (filters.page) params.set('page', filters.page.toString());
  if (filters.sortBy) params.set('sortBy', filters.sortBy);
  if (filters.sortOrder) params.set('sortOrder', filters.sortOrder);
  
  const response = await fetch(`${BASE_URL}?${params.toString()}`);
  
  if (!response.ok) {
    throw new Error('Failed to fetch price adjustments');
  }
  
  return response.json();
}

/**
 * Fetch single price adjustment by ID
 */
export async function fetchPriceAdjustmentById(
  systemId: string
): Promise<PriceAdjustment> {
  const response = await fetch(`${BASE_URL}/${systemId}`);
  
  if (!response.ok) {
    throw new Error('Failed to fetch price adjustment');
  }
  
  return response.json();
}

/**
 * Create new price adjustment (uses Server Action)
 */
export async function createPriceAdjustment(
  data: PriceAdjustmentCreateInput
): Promise<PriceAdjustment> {
  // Transform feature input to server action input
  const serverInput: ServerCreateInput = {
    pricingPolicyId: data.pricingPolicyId,
    pricingPolicyName: data.pricingPolicyName,
    adjustmentDate: new Date(),
    type: (data.type as 'INCREASE' | 'DECREASE' | 'SET') || 'SET',
    reason: data.reason,
    description: data.note,
    createdBy: data.createdBy,
    items: data.items?.map(item => ({
      productId: item.productId,
      productSystemId: item.productSystemId,
      productName: item.productName,
      productImage: item.productImage,
      oldPrice: item.oldPrice,
      newPrice: item.newPrice,
      adjustmentAmount: item.adjustmentAmount,
      adjustmentPercent: item.adjustmentPercent,
      note: item.note,
    })),
  };
  const result = await createPriceAdjustmentAction(serverInput);
  if (!result.success) {
    throw new Error(result.error || 'Failed to create price adjustment');
  }
  return result.data as unknown as PriceAdjustment;
}

/**
 * Update price adjustment (uses Server Action)
 */
export async function updatePriceAdjustment(
  systemId: string,
  data: PriceAdjustmentUpdateInput
): Promise<PriceAdjustment> {
  // Transform feature input to server action input
  const serverInput: ServerUpdateInput = {
    systemId,
    reason: data.reason,
    description: data.note,
  };
  const result = await updatePriceAdjustmentAction(serverInput);
  if (!result.success) {
    throw new Error(result.error || 'Failed to update price adjustment');
  }
  return result.data as unknown as PriceAdjustment;
}

/**
 * Delete price adjustment (uses Server Action)
 */
export async function deletePriceAdjustment(systemId: string): Promise<void> {
  const result = await deletePriceAdjustmentAction(systemId);
  if (!result.success) {
    throw new Error(result.error || 'Failed to delete price adjustment');
  }
}

/**
 * Confirm price adjustment and update product prices (uses Server Action)
 */
export async function confirmPriceAdjustment(
  systemId: string,
  confirmedBy?: string,
  _confirmedByName?: string
): Promise<PriceAdjustment> {
  const result = await confirmPriceAdjustmentAction(systemId, confirmedBy || '');
  if (!result.success) {
    throw new Error(result.error || 'Failed to confirm price adjustment');
  }
  return result.data as unknown as PriceAdjustment;
}

/**
 * Cancel price adjustment (uses Server Action)
 */
export async function cancelPriceAdjustment(
  systemId: string,
  _cancelledBy?: string,
  _cancelledByName?: string,
  _reason?: string
): Promise<PriceAdjustment> {
  const result = await cancelPriceAdjustmentAction(systemId);
  if (!result.success) {
    throw new Error(result.error || 'Failed to cancel price adjustment');
  }
  return result.data as unknown as PriceAdjustment;
}
