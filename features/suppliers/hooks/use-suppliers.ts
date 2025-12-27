/**
 * useSuppliers - React Query hooks for suppliers
 * 
 * ⚠️ IMPORTANT: Direct import pattern
 * - Import: import { useSuppliers } from '@/features/suppliers/hooks/use-suppliers'
 * - NEVER import from '@/features/suppliers/store'
 */

import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import {
  fetchSuppliers,
  fetchSupplier,
  createSupplier,
  updateSupplier,
  deleteSupplier,
  searchSuppliers,
  type SuppliersParams,
  type CreateSupplierInput,
  type UpdateSupplierInput,
} from '../api/suppliers-api';

// Query keys
export const supplierKeys = {
  all: ['suppliers'] as const,
  lists: () => [...supplierKeys.all, 'list'] as const,
  list: (params: SuppliersParams) => [...supplierKeys.lists(), params] as const,
  details: () => [...supplierKeys.all, 'detail'] as const,
  detail: (id: string) => [...supplierKeys.details(), id] as const,
  search: (query: string) => [...supplierKeys.all, 'search', query] as const,
};

export function useSuppliers(params: SuppliersParams = {}) {
  return useQuery({
    queryKey: supplierKeys.list(params),
    queryFn: () => fetchSuppliers(params),
    staleTime: 60_000,
    gcTime: 10 * 60 * 1000,
    placeholderData: keepPreviousData,
  });
}

export function useSupplier(id: string | null | undefined) {
  return useQuery({
    queryKey: supplierKeys.detail(id!),
    queryFn: () => fetchSupplier(id!),
    enabled: !!id,
    staleTime: 60_000,
  });
}

export function useSupplierSearch(query: string, limit = 20) {
  return useQuery({
    queryKey: supplierKeys.search(query),
    queryFn: () => searchSuppliers(query, limit),
    enabled: query.length >= 2,
    staleTime: 30_000,
  });
}

interface UseSupplierMutationsOptions {
  onCreateSuccess?: (supplier: unknown) => void;
  onUpdateSuccess?: (supplier: unknown) => void;
  onDeleteSuccess?: () => void;
  onError?: (error: Error) => void;
}

export function useSupplierMutations(options: UseSupplierMutationsOptions = {}) {
  const queryClient = useQueryClient();
  
  const create = useMutation({
    mutationFn: createSupplier,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: supplierKeys.lists() });
      options.onCreateSuccess?.(data);
    },
    onError: options.onError,
  });
  
  const update = useMutation({
    mutationFn: updateSupplier,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: supplierKeys.detail(variables.systemId) });
      queryClient.invalidateQueries({ queryKey: supplierKeys.lists() });
      options.onUpdateSuccess?.(data);
    },
    onError: options.onError,
  });
  
  const remove = useMutation({
    mutationFn: deleteSupplier,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: supplierKeys.all });
      options.onDeleteSuccess?.();
    },
    onError: options.onError,
  });
  
  return {
    create,
    update,
    remove,
    isCreating: create.isPending,
    isUpdating: update.isPending,
    isDeleting: remove.isPending,
  };
}

export function useActiveSuppliers(params: Omit<SuppliersParams, 'status'> = {}) {
  return useSuppliers({ ...params, status: 'Đang Giao Dịch' });
}

// Re-export from use-all-suppliers for backward compatibility
export { useAllSuppliers, useSupplierOptions, useSupplierFinder } from './use-all-suppliers';
export { useActiveSuppliers as useActiveSuppliersFromAll } from './use-all-suppliers';
