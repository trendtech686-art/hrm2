/**
 * Cost Adjustments React Query Hooks
 * Provides data fetching and mutations for cost adjustments
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  fetchCostAdjustments,
  fetchCostAdjustmentById,
  createCostAdjustment,
  updateCostAdjustment,
  deleteCostAdjustment,
  confirmCostAdjustment,
  cancelCostAdjustment,
  type CostAdjustmentFilters,
  type CostAdjustmentCreateInput,
  type CostAdjustmentUpdateInput,
} from '../api/cost-adjustments-api';
import type { CostAdjustmentStatus } from '../types';

// Query keys factory
export const costAdjustmentKeys = {
  all: ['cost-adjustments'] as const,
  lists: () => [...costAdjustmentKeys.all, 'list'] as const,
  list: (filters: CostAdjustmentFilters) => [...costAdjustmentKeys.lists(), filters] as const,
  details: () => [...costAdjustmentKeys.all, 'detail'] as const,
  detail: (id: string) => [...costAdjustmentKeys.details(), id] as const,
  byProduct: (productId: string) => [...costAdjustmentKeys.all, 'product', productId] as const,
};

/**
 * Hook to fetch cost adjustments with filters
 */
export function useCostAdjustments(filters: CostAdjustmentFilters = {}) {
  return useQuery({
    queryKey: costAdjustmentKeys.list(filters),
    queryFn: () => fetchCostAdjustments(filters),
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
}

/**
 * Hook to fetch single cost adjustment
 */
export function useCostAdjustmentById(systemId: string | undefined) {
  return useQuery({
    queryKey: costAdjustmentKeys.detail(systemId!),
    queryFn: () => fetchCostAdjustmentById(systemId!),
    enabled: !!systemId,
    staleTime: 1000 * 60,
  });
}

/**
 * Hook to fetch cost adjustments for a product
 */
export function useCostAdjustmentsByProduct(productId: string | undefined) {
  return useCostAdjustments({
    productId: productId || '',
    limit: 50,
  });
}

interface MutationCallbacks {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

/**
 * Hook providing cost adjustment mutations
 */
export function useCostAdjustmentMutations(options: MutationCallbacks = {}) {
  const queryClient = useQueryClient();

  const invalidateAdjustments = () => {
    queryClient.invalidateQueries({ queryKey: costAdjustmentKeys.all });
  };

  const create = useMutation({
    mutationFn: (data: CostAdjustmentCreateInput) => createCostAdjustment(data),
    onSuccess: () => {
      invalidateAdjustments();
      options.onSuccess?.();
    },
    onError: options.onError,
  });

  const update = useMutation({
    mutationFn: ({ systemId, data }: { systemId: string; data: CostAdjustmentUpdateInput }) =>
      updateCostAdjustment(systemId, data),
    onSuccess: () => {
      invalidateAdjustments();
      options.onSuccess?.();
    },
    onError: options.onError,
  });

  const remove = useMutation({
    mutationFn: (systemId: string) => deleteCostAdjustment(systemId),
    onSuccess: () => {
      invalidateAdjustments();
      options.onSuccess?.();
    },
    onError: options.onError,
  });

  const confirm = useMutation({
    mutationFn: (systemId: string) => confirmCostAdjustment(systemId),
    onSuccess: () => {
      invalidateAdjustments();
      options.onSuccess?.();
    },
    onError: options.onError,
  });

  const cancel = useMutation({
    mutationFn: (systemId: string) => cancelCostAdjustment(systemId),
    onSuccess: () => {
      invalidateAdjustments();
      options.onSuccess?.();
    },
    onError: options.onError,
  });

  return {
    create,
    update,
    remove,
    confirm,
    cancel,
    isLoading:
      create.isPending ||
      update.isPending ||
      remove.isPending ||
      confirm.isPending ||
      cancel.isPending,
  };
}

/**
 * Hook to fetch draft cost adjustments
 */
export function useDraftCostAdjustments() {
  return useCostAdjustments({ status: 'draft' });
}

/**
 * Hook to fetch cost adjustments by status
 */
export function useCostAdjustmentsByStatus(status: CostAdjustmentStatus) {
  return useCostAdjustments({ status });
}
