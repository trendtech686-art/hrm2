/**
 * Pricing Settings React Query Hooks
 * Provides data fetching and mutations for pricing policies
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  fetchPricingPolicies,
  fetchPricingPolicyById,
  createPricingPolicy,
  updatePricingPolicy,
  deletePricingPolicy,
  setDefaultPricingPolicy,
  fetchActivePricingPolicies,
  fetchPricingPoliciesByType,
  type PricingPolicyFilters,
  type PricingPolicyCreateInput,
  type PricingPolicyUpdateInput,
} from '../api/pricing-api';

// Query keys factory
export const pricingPolicyKeys = {
  all: ['pricing-policies'] as const,
  lists: () => [...pricingPolicyKeys.all, 'list'] as const,
  list: (filters: PricingPolicyFilters) => [...pricingPolicyKeys.lists(), filters] as const,
  details: () => [...pricingPolicyKeys.all, 'detail'] as const,
  detail: (id: string) => [...pricingPolicyKeys.details(), id] as const,
  active: () => [...pricingPolicyKeys.all, 'active'] as const,
  byType: (type: string) => [...pricingPolicyKeys.all, 'type', type] as const,
};

/**
 * Hook to fetch pricing policies with filters
 */
export function usePricingPolicies(filters: PricingPolicyFilters = {}) {
  return useQuery({
    queryKey: pricingPolicyKeys.list(filters),
    queryFn: () => fetchPricingPolicies(filters),
    staleTime: 1000 * 60 * 10, // 10 minutes - rarely changes
  });
}

/**
 * Hook to fetch active pricing policies
 */
export function useActivePricingPolicies() {
  return useQuery({
    queryKey: pricingPolicyKeys.active(),
    queryFn: fetchActivePricingPolicies,
    staleTime: 1000 * 60 * 10,
  });
}

/**
 * Hook to fetch pricing policies by type
 */
export function usePricingPoliciesByType(type: 'Nhập hàng' | 'Bán hàng') {
  return useQuery({
    queryKey: pricingPolicyKeys.byType(type),
    queryFn: () => fetchPricingPoliciesByType(type),
    staleTime: 1000 * 60 * 10,
  });
}

/**
 * Hook to fetch single pricing policy
 */
export function usePricingPolicyById(systemId: string | undefined) {
  return useQuery({
    queryKey: pricingPolicyKeys.detail(systemId!),
    queryFn: () => fetchPricingPolicyById(systemId!),
    enabled: !!systemId,
    staleTime: 1000 * 60 * 10,
  });
}

interface MutationCallbacks {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

/**
 * Hook providing pricing policy mutations
 */
export function usePricingPolicyMutations(options: MutationCallbacks = {}) {
  const queryClient = useQueryClient();

  const invalidatePolicies = () => {
    queryClient.invalidateQueries({ queryKey: pricingPolicyKeys.all });
  };

  const create = useMutation({
    mutationFn: (data: PricingPolicyCreateInput) => createPricingPolicy(data),
    onSuccess: () => {
      invalidatePolicies();
      options.onSuccess?.();
    },
    onError: options.onError,
  });

  const update = useMutation({
    mutationFn: ({ systemId, data }: { systemId: string; data: PricingPolicyUpdateInput }) =>
      updatePricingPolicy(systemId, data),
    onSuccess: () => {
      invalidatePolicies();
      options.onSuccess?.();
    },
    onError: options.onError,
  });

  const remove = useMutation({
    mutationFn: (systemId: string) => deletePricingPolicy(systemId),
    onSuccess: () => {
      invalidatePolicies();
      options.onSuccess?.();
    },
    onError: options.onError,
  });

  const setDefault = useMutation({
    mutationFn: (systemId: string) => setDefaultPricingPolicy(systemId),
    onSuccess: () => {
      invalidatePolicies();
      options.onSuccess?.();
    },
    onError: options.onError,
  });

  return {
    create,
    update,
    remove,
    setDefault,
    isLoading:
      create.isPending || update.isPending || remove.isPending || setDefault.isPending,
  };
}

/**
 * Hook to get sale pricing policies
 */
export function useSalePricingPolicies() {
  return usePricingPoliciesByType('Bán hàng');
}

/**
 * Hook to get purchase pricing policies
 */
export function usePurchasePricingPolicies() {
  return usePricingPoliciesByType('Nhập hàng');
}
