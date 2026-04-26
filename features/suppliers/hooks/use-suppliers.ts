/**
 * useSuppliers - React Query hooks for suppliers
 * 
 * ⚠️ IMPORTANT: Direct import pattern
 * - Import: import { useSuppliers } from '@/features/suppliers/hooks/use-suppliers'
 * - NEVER import from '@/features/suppliers/store'
 */

import { useQuery, useMutation, useQueryClient, keepPreviousData, useInfiniteQuery } from '@tanstack/react-query';
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
import { invalidateRelated } from '@/lib/query-invalidation-map';

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
  totalDebit: number;
  totalCredit: number;
  totalPurchased: number;
  totalPaid: number;
  deletedCount?: number;
}

/**
 * Hook for supplier statistics with optional initial data from Server Component
 */
export function useSupplierStats(initialData?: SupplierStats) {
  return useQuery({
    queryKey: supplierKeys.stats(),
    queryFn: async () => {
      const res = await fetch('/api/suppliers/stats');
      if (!res.ok) throw new Error('Lỗi khi lấy thống kê');
      const json = await res.json();
      return (json.data || initialData || {
        totalSuppliers: 0,
        activeSuppliers: 0,
        totalDebit: 0,
        totalCredit: 0,
        totalPurchased: 0,
        totalPaid: 0,
      }) as SupplierStats;
    },
    initialData: initialData || {
      totalSuppliers: 0,
      activeSuppliers: 0,
      totalDebit: 0,
      totalCredit: 0,
      totalPurchased: 0,
      totalPaid: 0,
    },
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
    // ✅ Always refetch on mount to ensure fresh data after mutations from other pages
    refetchOnMount: 'always',
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

/**
 * Hook for infinite scroll suppliers list
 * Loads 30 suppliers per page, automatically fetches more when scrolling
 */
export function useInfiniteSuppliers(params: Omit<SuppliersParams, 'page'> & { enabled?: boolean } = {}) {
  const { enabled = true, ...queryParams } = params;
  const limit = queryParams.limit || 30;
  
  return useInfiniteQuery({
    queryKey: [...supplierKeys.lists(), 'infinite', queryParams],
    queryFn: ({ pageParam = 1 }) => fetchSuppliers({ ...queryParams, page: pageParam, limit }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const { page, totalPages } = lastPage.pagination;
      return page < totalPages ? page + 1 : undefined;
    },
    staleTime: 60_000,
    gcTime: 10 * 60 * 1000,
    enabled,
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
        throw new Error(result.error || 'Lỗi khi tạo nhà cung cấp');
      }
      return result.data as Supplier;
    },
    onSuccess: (data) => {
      invalidateRelated(queryClient, 'suppliers');
      options.onCreateSuccess?.(data);
    },
    onError: options.onError,
  });
  
  const update = useMutation({
    mutationFn: async (input: UpdateSupplierInput | { systemId: string; data: Record<string, unknown> }) => {
      const data = toUpdateSupplierInput(input);
      const result = await updateSupplierAction(data);
      if (!result.success) {
        throw new Error(result.error || 'Lỗi khi cập nhật nhà cung cấp');
      }
      return result.data as Supplier;
    },
    onSuccess: (data) => {
      invalidateRelated(queryClient, 'suppliers');
      options.onUpdateSuccess?.(data);
    },
    onError: options.onError,
  });
  
  const remove = useMutation({
    mutationFn: async (systemId: string) => {
      const result = await deleteSupplierAction({ systemId });
      if (!result.success) {
        throw new Error(result.error || 'Lỗi khi xóa nhà cung cấp');
      }
      return result.data;
    },
    onMutate: async (systemId) => {
      await queryClient.cancelQueries({ queryKey: supplierKeys.lists() });
      const previousLists = queryClient.getQueriesData<PaginatedResponse<Supplier>>({ queryKey: supplierKeys.lists() });
      queryClient.setQueriesData<PaginatedResponse<Supplier>>(
        { queryKey: supplierKeys.lists() },
        (old) => old ? { ...old, data: old.data.filter(s => s.systemId !== systemId) } : old
      );
      return { previousLists };
    },
    onError: (_err, _systemId, context) => {
      if (context?.previousLists) {
        for (const [key, data] of context.previousLists) {
          queryClient.setQueryData(key, data);
        }
      }
      options.onError?.(_err as Error);
    },
    onSuccess: () => {
      options.onDeleteSuccess?.();
    },
    onSettled: () => {
      invalidateRelated(queryClient, 'suppliers');
    },
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
        throw new Error(result.error || 'Lỗi khi khôi phục nhà cung cấp');
      }
      return result.data as Supplier;
    },
    onSuccess: () => {
      invalidateRelated(queryClient, 'suppliers');
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
      invalidateRelated(queryClient, 'suppliers');
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
