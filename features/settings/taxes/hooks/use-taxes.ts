/**
 * Taxes Settings React Query Hooks
 * Provides data fetching and mutations for taxes
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  fetchTaxes,
  fetchTaxById,
  createTax,
  updateTax,
  deleteTax,
  setDefaultSaleTax,
  setDefaultPurchaseTax,
  fetchAllTaxes,
  type TaxFilters,
  type TaxCreateInput,
  type TaxUpdateInput,
} from '../api/taxes-api';

// Query keys factory
export const taxKeys = {
  all: ['taxes'] as const,
  lists: () => [...taxKeys.all, 'list'] as const,
  list: (filters: TaxFilters) => [...taxKeys.lists(), filters] as const,
  details: () => [...taxKeys.all, 'detail'] as const,
  detail: (id: string) => [...taxKeys.details(), id] as const,
};

/**
 * Hook to fetch taxes with filters
 */
export function useTaxes(filters: TaxFilters = {}) {
  return useQuery({
    queryKey: taxKeys.list(filters),
    queryFn: () => fetchTaxes(filters),
    staleTime: 1000 * 60 * 10, // 10 minutes - rarely changes
  });
}

/**
 * Hook to fetch all taxes
 */
export function useAllTaxes() {
  return useQuery({
    queryKey: taxKeys.lists(),
    queryFn: fetchAllTaxes,
    staleTime: 1000 * 60 * 10,
  });
}

/**
 * Hook to fetch single tax
 */
export function useTaxById(systemId: string | undefined) {
  return useQuery({
    queryKey: taxKeys.detail(systemId!),
    queryFn: () => fetchTaxById(systemId!),
    enabled: !!systemId,
    staleTime: 1000 * 60 * 10,
  });
}

interface MutationCallbacks {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

/**
 * Hook providing tax mutations
 */
export function useTaxMutations(options: MutationCallbacks = {}) {
  const queryClient = useQueryClient();

  const invalidateTaxes = () => {
    queryClient.invalidateQueries({ queryKey: taxKeys.all });
  };

  const create = useMutation({
    mutationFn: (data: TaxCreateInput) => createTax(data),
    onSuccess: () => {
      invalidateTaxes();
      options.onSuccess?.();
    },
    onError: options.onError,
  });

  const update = useMutation({
    mutationFn: ({ systemId, data }: { systemId: string; data: TaxUpdateInput }) =>
      updateTax(systemId, data),
    onSuccess: () => {
      invalidateTaxes();
      options.onSuccess?.();
    },
    onError: options.onError,
  });

  const remove = useMutation({
    mutationFn: (systemId: string) => deleteTax(systemId),
    onSuccess: () => {
      invalidateTaxes();
      options.onSuccess?.();
    },
    onError: options.onError,
  });

  const setDefaultSale = useMutation({
    mutationFn: (systemId: string) => setDefaultSaleTax(systemId),
    onSuccess: () => {
      invalidateTaxes();
      options.onSuccess?.();
    },
    onError: options.onError,
  });

  const setDefaultPurchase = useMutation({
    mutationFn: (systemId: string) => setDefaultPurchaseTax(systemId),
    onSuccess: () => {
      invalidateTaxes();
      options.onSuccess?.();
    },
    onError: options.onError,
  });

  return {
    create,
    update,
    remove,
    setDefaultSale,
    setDefaultPurchase,
    isLoading:
      create.isPending ||
      update.isPending ||
      remove.isPending ||
      setDefaultSale.isPending ||
      setDefaultPurchase.isPending,
  };
}
