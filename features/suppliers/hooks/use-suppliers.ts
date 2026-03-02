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
  searchSuppliers,
  type SuppliersParams,
  type PaginatedResponse,
} from '../api/suppliers-api';
import {
  createSupplierAction,
  updateSupplierAction,
  deleteSupplierAction,
  restoreSupplierAction,
  type CreateSupplierInput,
  type UpdateSupplierInput,
} from '@/app/actions/suppliers';
import type { Supplier } from '@/lib/types/prisma-extended';

// Helper to convert legacy update format to flat format
function toUpdateSupplierInput(input: UpdateSupplierInput | { systemId: string; data: Record<string, unknown> }): UpdateSupplierInput {
  const i = input as Record<string, unknown>;
  if (i.data && typeof i.data === 'object') {
    return {
      systemId: i.systemId as string,
      ...(i.data as Record<string, unknown>),
    } as UpdateSupplierInput;
  }
  return input as UpdateSupplierInput;
}

// Query keys
export const supplierKeys = {
  all: ['suppliers'] as const,
  lists: () => [...supplierKeys.all, 'list'] as const,
  list: (params: SuppliersParams) => [...supplierKeys.lists(), params] as const,
  details: () => [...supplierKeys.all, 'detail'] as const,
  detail: (id: string) => [...supplierKeys.details(), id] as const,
  search: (query: string) => [...supplierKeys.all, 'search', query] as const,
  stats: () => [...supplierKeys.all, 'stats'] as const,
};

// Types for initial data from Server Components
export interface SupplierStats {
  totalSuppliers: number;
  activeSuppliers: number;
  suppliersWithDebt: number;
  totalDebtAmount: number;
}

/**
 * Hook for supplier statistics with optional initial data from Server Component
 */
export function useSupplierStats(initialData?: SupplierStats) {
  return useQuery({
    queryKey: supplierKeys.stats(),
    queryFn: async () => {
      const res = await fetch('/api/suppliers/stats');
      if (!res.ok) throw new Error('Failed to fetch stats');
      return res.json() as Promise<SupplierStats>;
    },
    initialData,
    staleTime: initialData ? 60_000 : 0,
    gcTime: 5 * 60 * 1000,
  });
}

/**
 * Hook for fetching paginated suppliers list
 * Supports initialData from Server Component for instant hydration
 */
export function useSuppliers(
  params: SuppliersParams & { enabled?: boolean } = {},
  initialData?: PaginatedResponse<Supplier>
) {
  const { enabled = true, ...queryParams } = params;
  return useQuery({
    queryKey: supplierKeys.list(queryParams),
    queryFn: () => fetchSuppliers(queryParams),
    initialData,
    staleTime: initialData ? 60_000 : 30_000,
    gcTime: 10 * 60 * 1000,
    placeholderData: keepPreviousData,
    enabled,
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
    mutationFn: async (data: CreateSupplierInput) => {
      const result = await createSupplierAction(data);
      if (!result.success) {
        throw new Error(result.error || 'Failed to create supplier');
      }
      return result.data as Supplier;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: supplierKeys.lists() });
      options.onCreateSuccess?.(data);
    },
    onError: options.onError,
  });
  
  const update = useMutation({
    mutationFn: async (input: UpdateSupplierInput | { systemId: string; data: Record<string, unknown> }) => {
      const data = toUpdateSupplierInput(input);
      const result = await updateSupplierAction(data);
      if (!result.success) {
        throw new Error(result.error || 'Failed to update supplier');
      }
      return result.data as Supplier;
    },
    onSuccess: (data, variables) => {
      const systemId = 'systemId' in variables ? variables.systemId : (variables as UpdateSupplierInput).systemId;
      queryClient.invalidateQueries({ queryKey: supplierKeys.detail(systemId) });
      queryClient.invalidateQueries({ queryKey: supplierKeys.lists() });
      options.onUpdateSuccess?.(data);
    },
    onError: options.onError,
  });
  
  const remove = useMutation({
    mutationFn: async (systemId: string) => {
      const result = await deleteSupplierAction({ systemId });
      if (!result.success) {
        throw new Error(result.error || 'Failed to delete supplier');
      }
      return result.data;
    },
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

// ============ TRASH HOOKS ============

import {
  fetchDeletedSuppliers,
  permanentDeleteSupplier,
} from '../api/suppliers-api';

/**
 * Hook for fetching deleted suppliers (trash)
 */
export function useDeletedSuppliers() {
  return useQuery({
    queryKey: [...supplierKeys.all, 'deleted'],
    queryFn: fetchDeletedSuppliers,
    staleTime: 30_000,
  });
}

/**
 * Hook for trash mutations (restore, permanent delete)
 */
export function useTrashMutations() {
  const queryClient = useQueryClient();
  
  const restore = useMutation({
    mutationFn: async (systemId: string) => {
      const result = await restoreSupplierAction({ systemId });
      if (!result.success) {
        throw new Error(result.error || 'Failed to restore supplier');
      }
      return result.data as Supplier;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: supplierKeys.all });
    },
  });
  
  const permanentDelete = useMutation({
    mutationFn: permanentDeleteSupplier,
    onMutate: async (systemId) => {
      await queryClient.cancelQueries({ queryKey: [...supplierKeys.all, 'deleted'] });
      const previousDeleted = queryClient.getQueryData([...supplierKeys.all, 'deleted']);
      queryClient.setQueryData(
        [...supplierKeys.all, 'deleted'],
        (old: Array<{ systemId: string }> | undefined) => 
          old?.filter(item => item.systemId !== systemId) || []
      );
      return { previousDeleted };
    },
    onError: (_err, _systemId, context) => {
      if (context?.previousDeleted) {
        queryClient.setQueryData([...supplierKeys.all, 'deleted'], context.previousDeleted);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: supplierKeys.all });
    },
  });
  
  return {
    restore,
    permanentDelete,
    isRestoring: restore.isPending,
    isDeleting: permanentDelete.isPending,
  };
}

// Re-export from use-all-suppliers for backward compatibility
export { useAllSuppliers, useSupplierOptions, useSupplierFinder } from './use-all-suppliers';
export { useActiveSuppliers as useActiveSuppliersFromAll } from './use-all-suppliers';
