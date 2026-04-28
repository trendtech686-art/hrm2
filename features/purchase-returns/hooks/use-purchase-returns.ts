/**
 * usePurchaseReturns - React Query hooks (Phiếu Hoàn Trả NCC)
 * 
 * ⚠️ Direct import: import { usePurchaseReturns } from '@/features/purchase-returns/hooks/use-purchase-returns'
 */

import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import { asSystemId } from '@/lib/id-types';
import {
  fetchPurchaseReturns,
  fetchPurchaseReturn,
  fetchPurchaseReturnStats,
  type PurchaseReturnsParams,
  type PurchaseReturnStats,
} from '../api/purchase-returns-api';
import {
  createPurchaseReturnAction,
  updatePurchaseReturnAction,
  deletePurchaseReturnAction,
  approvePurchaseReturnAction,
  type CreatePurchaseReturnInput,
} from '@/app/actions/purchase-returns';
import { invalidateRelated } from '@/lib/query-invalidation-map';
// Use the app-layer PurchaseReturn type for display purposes
// The Server Actions return Prisma types which may differ slightly
import type { PurchaseReturn } from '@/lib/types/prisma-extended';

// Type for Server Action responses - maps Prisma return type to app type
type PurchaseReturnData = Awaited<ReturnType<typeof createPurchaseReturnAction>> extends { data?: infer T } ? NonNullable<T> : never;

export const purchaseReturnKeys = {
  all: ['purchase-returns'] as const,
  lists: () => [...purchaseReturnKeys.all, 'list'] as const,
  list: (params: PurchaseReturnsParams) => [...purchaseReturnKeys.lists(), params] as const,
  details: () => [...purchaseReturnKeys.all, 'detail'] as const,
  detail: (id: string) => [...purchaseReturnKeys.details(), id] as const,
  stats: () => [...purchaseReturnKeys.all, 'stats'] as const,
};

export function usePurchaseReturns(params: PurchaseReturnsParams = {}) {
  return useQuery({
    queryKey: purchaseReturnKeys.list(params),
    queryFn: () => fetchPurchaseReturns(params),
    staleTime: 30_000,
    gcTime: 5 * 60 * 1000,
    placeholderData: keepPreviousData,
  });
}

export function usePurchaseReturn(id: string | null | undefined) {
  return useQuery({
    queryKey: purchaseReturnKeys.detail(id!),
    queryFn: () => fetchPurchaseReturn(asSystemId(id!)),
    enabled: !!id,
    staleTime: 60_000,
    // ✅ Always refetch on mount to ensure fresh data
    refetchOnMount: 'always',
  });
}

export function usePurchaseReturnStats(params?: { 
  startDate?: string; 
  endDate?: string; 
  supplierId?: string;
  initialData?: PurchaseReturnStats;
}) {
  const { initialData, ...queryParams } = params || {};
  return useQuery({
    queryKey: [...purchaseReturnKeys.stats(), queryParams],
    queryFn: () => fetchPurchaseReturnStats(queryParams),
    staleTime: 60_000,
    initialData,
  });
}

interface UsePurchaseReturnMutationsOptions {
  onCreateSuccess?: (purchaseReturn: PurchaseReturnData) => void;
  onUpdateSuccess?: (purchaseReturn: PurchaseReturnData) => void;
  onDeleteSuccess?: () => void;
  onProcessSuccess?: (purchaseReturn: PurchaseReturnData) => void;
  onError?: (error: Error) => void;
}

export function usePurchaseReturnMutations(options: UsePurchaseReturnMutationsOptions = {}) {
  const queryClient = useQueryClient();
  
  const create = useMutation({
    mutationFn: async (data: CreatePurchaseReturnInput) => {
      const result = await createPurchaseReturnAction(data);
      if (!result.success) throw new Error(result.error || 'Không thể tạo phiếu trả hàng nhập');
      return result.data!;
    },
    onSuccess: (data) => {
      invalidateRelated(queryClient, 'purchase-returns');
      options.onCreateSuccess?.(data);
    },
    onError: options.onError,
  });
  
  const update = useMutation({
    mutationFn: async ({ systemId, data }: { systemId: string; data: Partial<PurchaseReturn> & { description?: string } }) => {
      const result = await updatePurchaseReturnAction(
        asSystemId(systemId),
        {
          returnDate: data.returnDate as string | Date | undefined,
          reason: data.reason,
        }
      );
      if (!result.success) throw new Error(result.error || 'Không thể cập nhật phiếu trả hàng nhập');
      return result.data!;
    },
    onSuccess: (data) => {
      invalidateRelated(queryClient, 'purchase-returns');
      options.onUpdateSuccess?.(data);
    },
    onError: options.onError,
  });
  
  const process = useMutation({
    mutationFn: async ({ systemId, confirmedBy }: { systemId: string; confirmedBy: string }) => {
      const result = await approvePurchaseReturnAction(asSystemId(systemId), confirmedBy);
      if (!result.success) throw new Error(result.error || 'Không thể duyệt phiếu trả hàng nhập');
      return result.data!;
    },
    onSuccess: (data) => {
      invalidateRelated(queryClient, 'purchase-returns');
      options.onProcessSuccess?.(data);
    },
    onError: options.onError,
  });
  
  const remove = useMutation({
    mutationFn: async (systemId: string) => {
      const result = await deletePurchaseReturnAction(asSystemId(systemId));
      if (!result.success) throw new Error(result.error || 'Không thể xóa phiếu trả hàng nhập');
      return result.data;
    },
    onSuccess: () => {
      invalidateRelated(queryClient, 'purchase-returns');
      options.onDeleteSuccess?.();
    },
    onError: options.onError,
  });
  
  return { create, update, process, remove };
}

export function usePurchaseReturnsBySupplier(supplierId: string | null | undefined) {
  return usePurchaseReturns({
    supplierId: supplierId || undefined,
  });
}

export function usePurchaseReturnsByPO(purchaseOrderId: string | null | undefined) {
  return usePurchaseReturns({
    purchaseOrderId: purchaseOrderId || undefined,
  });
}

/**
 * Fetch purchase returns for a specific purchase order by systemId.
 * Returns flat array for compatibility with existing code.
 */
export function usePurchaseReturnsByPOSystemId(purchaseOrderSystemId: string | null | undefined) {
  const query = useQuery({
    queryKey: [...purchaseReturnKeys.lists(), 'by-po-system-id', purchaseOrderSystemId],
    queryFn: async () => {
      const response = await fetchPurchaseReturns({ purchaseOrderId: purchaseOrderSystemId!, limit: 1000 });
      return response.data;
    },
    enabled: !!purchaseOrderSystemId,
    staleTime: 60_000,
  });

  return {
    data: query.data || [],
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
  };
}

