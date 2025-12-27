/**
 * Stock History React Query Hooks
 * Provides data fetching for stock movement history
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  fetchStockHistory,
  fetchProductStockHistory,
  createStockHistory,
  fetchStockMovementSummary,
  type StockHistoryFilters,
  type StockHistoryCreateInput,
} from '../api/stock-history-api';

// Query keys factory
export const stockHistoryKeys = {
  all: ['stock-history'] as const,
  lists: () => [...stockHistoryKeys.all, 'list'] as const,
  list: (filters: StockHistoryFilters) => [...stockHistoryKeys.lists(), filters] as const,
  product: (productId: string) => [...stockHistoryKeys.all, 'product', productId] as const,
  summary: (productId: string) => [...stockHistoryKeys.all, 'summary', productId] as const,
};

/**
 * Hook to fetch stock history with filters
 */
export function useStockHistory(filters: StockHistoryFilters = {}) {
  return useQuery({
    queryKey: stockHistoryKeys.list(filters),
    queryFn: () => fetchStockHistory(filters),
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
}

/**
 * Hook to fetch stock history for a specific product
 */
export function useProductStockHistory(
  productId: string | undefined,
  options?: { limit?: number; fromDate?: string; toDate?: string }
) {
  return useQuery({
    queryKey: stockHistoryKeys.product(productId!),
    queryFn: () => fetchProductStockHistory(productId!, options),
    enabled: !!productId,
    staleTime: 1000 * 60 * 2,
  });
}

/**
 * Hook to fetch stock movement summary
 */
export function useStockMovementSummary(
  productId: string | undefined,
  period?: { fromDate: string; toDate: string }
) {
  return useQuery({
    queryKey: stockHistoryKeys.summary(productId!),
    queryFn: () => fetchStockMovementSummary(productId!, period),
    enabled: !!productId,
    staleTime: 1000 * 60 * 5,
  });
}

interface MutationCallbacks {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

/**
 * Hook providing stock history mutations
 */
export function useStockHistoryMutations(options: MutationCallbacks = {}) {
  const queryClient = useQueryClient();

  const invalidateHistory = () => {
    queryClient.invalidateQueries({ queryKey: stockHistoryKeys.all });
  };

  const create = useMutation({
    mutationFn: (data: StockHistoryCreateInput) => createStockHistory(data),
    onSuccess: () => {
      invalidateHistory();
      options.onSuccess?.();
    },
    onError: options.onError,
  });

  return {
    create,
    isLoading: create.isPending,
  };
}
