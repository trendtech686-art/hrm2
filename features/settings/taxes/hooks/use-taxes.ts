/**
 * Taxes Settings React Query Hooks
 * Provides data fetching and mutations for taxes
 */

import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import { invalidateRelated } from '@/lib/query-invalidation-map';
import {
  fetchTaxes,
  fetchTaxById,
  createTax,
  updateTax,
  deleteTax,
  setDefaultSaleTax,
  setDefaultPurchaseTax,
  setDefaultExcelExportTax,
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
    staleTime: 30 * 60 * 1000, // 30 minutes - settings rarely change
    gcTime: 2 * 60 * 60 * 1000, // 2 hours
    placeholderData: keepPreviousData,
  });
}

/**
 * Hook to fetch all taxes
 */
export function useAllTaxes(options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: taxKeys.lists(),
    queryFn: fetchAllTaxes,
    enabled: options?.enabled !== false,
    staleTime: 30 * 60 * 1000, // 30 minutes - settings rarely change
    gcTime: 2 * 60 * 60 * 1000, // 2 hours
    placeholderData: keepPreviousData,
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
    staleTime: 30 * 60 * 1000, // 30 minutes
    gcTime: 2 * 60 * 60 * 1000, // 2 hours
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

  const invalidateTaxes = () => invalidateRelated(queryClient, 'taxes');

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

  const setDefaultExcelExport = useMutation({
    mutationFn: (systemId: string) => setDefaultExcelExportTax(systemId),
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
    setDefaultExcelExport,
    isLoading:
      create.isPending ||
      update.isPending ||
      remove.isPending ||
      setDefaultSale.isPending ||
      setDefaultPurchase.isPending ||
      setDefaultExcelExport.isPending,
  };
}
