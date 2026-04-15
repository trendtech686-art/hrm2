/**
 * Price History Hook
 * Fetches price history for a product with server-side pagination
 */

import { useQuery, keepPreviousData } from '@tanstack/react-query';
import type { PriceHistoryEntry } from '../purchase-price-history-columns';

export interface PriceHistoryResponse {
  data: PriceHistoryEntry[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface PriceHistoryFilters {
  page?: number;
  limit?: number;
  branchId?: string;
  fromDate?: string;
  toDate?: string;
}

// Query keys factory
export const priceHistoryKeys = {
  all: ['price-history'] as const,
  product: (productId: string, filters?: PriceHistoryFilters) =>
    [...priceHistoryKeys.all, 'product', productId, filters] as const,
};

/**
 * Fetch price history from API
 */
async function fetchPriceHistory(
  productSystemId: string,
  filters: PriceHistoryFilters = {}
): Promise<PriceHistoryResponse> {
  const params = new URLSearchParams();

  if (filters.page) params.set('page', String(filters.page));
  if (filters.limit) params.set('limit', String(filters.limit));
  if (filters.branchId && filters.branchId !== 'all') params.set('branchId', filters.branchId);
  if (filters.fromDate) params.set('fromDate', filters.fromDate);
  if (filters.toDate) params.set('toDate', filters.toDate);

  const url = `/api/products/${productSystemId}/price-history${params.toString() ? '?' + params : ''}`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error('Failed to fetch price history');
  }

  return response.json();
}

/**
 * Hook to fetch price history for a product with server-side pagination
 */
export function useProductPriceHistory(
  productSystemId: string | undefined,
  options?: {
    page?: number;
    limit?: number;
    branchId?: string;
    fromDate?: string;
    toDate?: string;
    enabled?: boolean;
  }
): {
  data: PriceHistoryResponse | undefined;
  isLoading: boolean;
  isFetching: boolean;
  error: Error | null;
} {
  const filters: PriceHistoryFilters = {
    page: options?.page || 1,
    limit: options?.limit || 20,
    branchId: options?.branchId,
    fromDate: options?.fromDate,
    toDate: options?.toDate,
  };

  return useQuery({
    queryKey: priceHistoryKeys.product(productSystemId!, filters),
    queryFn: () => fetchPriceHistory(productSystemId!, filters),
    enabled: !!productSystemId && (options?.enabled ?? true),
    staleTime: 1000 * 60 * 2,
    gcTime: 10 * 60 * 1000,
    placeholderData: keepPreviousData,
  });
}
