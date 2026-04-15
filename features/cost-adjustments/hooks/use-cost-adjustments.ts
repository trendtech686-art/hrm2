/**
 * Cost Adjustments React Query Hooks
 * Provides data fetching and mutations for cost adjustments
 * 
 * ⚠️ Direct import: import { useCostAdjustments } from '@/features/cost-adjustments/hooks/use-cost-adjustments'
 */

import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import {
  fetchCostAdjustments,
  fetchCostAdjustmentById,
  type CostAdjustmentFilters,
} from '../api/cost-adjustments-api';
import {
  createCostAdjustmentAction,
  updateCostAdjustmentAction,
  deleteCostAdjustmentAction,
  confirmCostAdjustmentAction,
  cancelCostAdjustmentAction,
  type CreateCostAdjustmentInput,
  type UpdateCostAdjustmentInput,
} from '@/app/actions/cost-adjustments';
import { invalidateRelated } from '@/lib/query-invalidation-map';
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
    placeholderData: keepPreviousData,
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
    invalidateRelated(queryClient, 'cost-adjustments');
  };

  const create = useMutation({
    mutationFn: async (data: CreateCostAdjustmentInput) => {
      const result = await createCostAdjustmentAction(data);
      if (!result.success) throw new Error(result.error || 'Failed to create cost adjustment');
      return result.data!;
    },
    onSuccess: () => {
      invalidateAdjustments();
      options.onSuccess?.();
    },
    onError: options.onError,
  });

  const update = useMutation({
    mutationFn: async ({ systemId, data }: { systemId: string; data: Partial<UpdateCostAdjustmentInput> }) => {
      const result = await updateCostAdjustmentAction({ systemId, ...data });
      if (!result.success) throw new Error(result.error || 'Failed to update cost adjustment');
      return result.data!;
    },
    onSuccess: () => {
      invalidateAdjustments();
      options.onSuccess?.();
    },
    onError: options.onError,
  });

  const remove = useMutation({
    mutationFn: async (systemId: string) => {
      const result = await deleteCostAdjustmentAction(systemId);
      if (!result.success) throw new Error(result.error || 'Failed to delete cost adjustment');
      return result.data;
    },
    onSuccess: () => {
      invalidateAdjustments();
      options.onSuccess?.();
    },
    onError: options.onError,
  });

  const confirm = useMutation({
    mutationFn: async ({ systemId, confirmedBy }: { systemId: string; confirmedBy?: string; confirmedByName?: string }) => {
      const result = await confirmCostAdjustmentAction(systemId, confirmedBy || '');
      if (!result.success) throw new Error(result.error || 'Failed to confirm cost adjustment');
      return result.data!;
    },
    onSuccess: () => {
      invalidateAdjustments();
      options.onSuccess?.();
    },
    onError: options.onError,
  });

  const cancel = useMutation({
    mutationFn: async ({ systemId }: { 
      systemId: string; 
      cancelledBy?: string; 
      cancelledByName?: string; 
      reason?: string;
    }) => {
      const result = await cancelCostAdjustmentAction(systemId);
      if (!result.success) throw new Error(result.error || 'Failed to cancel cost adjustment');
      return result.data!;
    },
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
