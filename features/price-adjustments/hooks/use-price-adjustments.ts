/**
 * React Query hooks for Price Adjustments
 */

import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import {
  fetchPriceAdjustments,
  fetchPriceAdjustmentById,
  createPriceAdjustment,
  updatePriceAdjustment,
  deletePriceAdjustment,
  confirmPriceAdjustment,
  cancelPriceAdjustment,
  type PriceAdjustmentFilters,
} from '../api/price-adjustments-api';
import type { PriceAdjustmentCreateInput, PriceAdjustmentUpdateInput } from '../types';

// Query keys
export const priceAdjustmentKeys = {
  all: ['price-adjustments'] as const,
  lists: () => [...priceAdjustmentKeys.all, 'list'] as const,
  list: (filters: PriceAdjustmentFilters) => [...priceAdjustmentKeys.lists(), filters] as const,
  details: () => [...priceAdjustmentKeys.all, 'detail'] as const,
  detail: (id: string) => [...priceAdjustmentKeys.details(), id] as const,
};

/**
 * Hook to fetch price adjustments list
 */
export function usePriceAdjustments(filters: PriceAdjustmentFilters = {}) {
  return useQuery({
    queryKey: priceAdjustmentKeys.list(filters),
    queryFn: () => fetchPriceAdjustments(filters),
    staleTime: 1000 * 60,
    placeholderData: keepPreviousData,
  });
}

/**
 * Hook to fetch single price adjustment
 */
export function usePriceAdjustmentById(systemId: string | undefined) {
  return useQuery({
    queryKey: priceAdjustmentKeys.detail(systemId || ''),
    queryFn: () => fetchPriceAdjustmentById(systemId!),
    enabled: !!systemId,
    staleTime: 1000 * 60,
  });
}

// Alias for backwards compatibility
export const usePriceAdjustment = usePriceAdjustmentById;

interface MutationCallbacks {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

/**
 * Hook providing price adjustment mutations
 */
export function usePriceAdjustmentMutations(options: MutationCallbacks = {}) {
  const queryClient = useQueryClient();

  const invalidateAdjustments = () => {
    queryClient.invalidateQueries({ queryKey: priceAdjustmentKeys.all });
  };

  const create = useMutation({
    mutationFn: (data: PriceAdjustmentCreateInput) => createPriceAdjustment(data),
    onSuccess: () => {
      invalidateAdjustments();
      options.onSuccess?.();
    },
    onError: options.onError,
  });

  const update = useMutation({
    mutationFn: ({ systemId, data }: { systemId: string; data: PriceAdjustmentUpdateInput }) =>
      updatePriceAdjustment(systemId, data),
    onSuccess: () => {
      invalidateAdjustments();
      options.onSuccess?.();
    },
    onError: options.onError,
  });

  const remove = useMutation({
    mutationFn: (systemId: string) => deletePriceAdjustment(systemId),
    onSuccess: () => {
      invalidateAdjustments();
      options.onSuccess?.();
    },
    onError: options.onError,
  });

  const confirm = useMutation({
    mutationFn: ({ systemId, confirmedBy, confirmedByName }: { systemId: string; confirmedBy?: string; confirmedByName?: string }) => 
      confirmPriceAdjustment(systemId, confirmedBy, confirmedByName),
    onSuccess: () => {
      invalidateAdjustments();
      options.onSuccess?.();
    },
    onError: options.onError,
  });

  const cancel = useMutation({
    mutationFn: ({ systemId, cancelledBy, cancelledByName, reason }: { 
      systemId: string; 
      cancelledBy?: string; 
      cancelledByName?: string; 
      reason?: string;
    }) => cancelPriceAdjustment(systemId, cancelledBy, cancelledByName, reason),
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
