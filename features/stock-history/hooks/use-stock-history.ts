/**
 * Stock History React Query Hooks
 * Provides data fetching for stock movement history
 */

import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import { invalidateRelated } from '@/lib/query-invalidation-map';
import {
  fetchStockHistory,
  createStockHistory,
  fetchStockMovementSummary,
  type StockHistoryFilters,
  type StockHistoryCreateInput,
  type StockHistoryResponse,
} from '../api/stock-history-api';

// Query keys factory
export const stockHistoryKeys = {
  all: ['stock-history'] as const,
  lists: () => [...stockHistoryKeys.all, 'list'] as const,
  list: (filters: StockHistoryFilters) => [...stockHistoryKeys.lists(), filters] as const,
  product: (productId: string, filters?: Omit<StockHistoryFilters, 'productId'>) => 
    [...stockHistoryKeys.all, 'product', productId, filters] as const,
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
    gcTime: 10 * 60 * 1000,
    placeholderData: keepPreviousData,
  });
}

/**
 * Hook to fetch stock history for a specific product with server-side pagination
 */
export function useProductStockHistory(
  productId: string | undefined,
  options?: { 
    page?: number;
    limit?: number; 
    branchId?: string;
    fromDate?: string; 
    toDate?: string; 
    enabled?: boolean;
  }
): { 
  data: StockHistoryResponse | undefined;
  isLoading: boolean;
  isFetching: boolean;
  error: Error | null;
} {
  const filters: StockHistoryFilters = {
    productId: productId!,
    page: options?.page || 1,
    limit: options?.limit || 20,
    branchSystemId: options?.branchId && options.branchId !== 'all' ? options.branchId : undefined,
    fromDate: options?.fromDate,
    toDate: options?.toDate,
  };

  return useQuery({
    queryKey: stockHistoryKeys.product(productId!, filters),
    queryFn: () => fetchStockHistory(filters),
    enabled: !!productId && (options?.enabled ?? true),
    staleTime: 1000 * 60 * 2,
    gcTime: 10 * 60 * 1000,
    placeholderData: keepPreviousData,
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
    gcTime: 10 * 60 * 1000,
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

  const invalidateHistory = () => invalidateRelated(queryClient, 'stock-history');

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
