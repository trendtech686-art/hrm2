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
  createPurchaseReturn,
  updatePurchaseReturn,
  deletePurchaseReturn,
  fetchPurchaseReturnStats,
  type PurchaseReturnsParams,
} from '../api/purchase-returns-api';
import type { PurchaseReturn } from '@/lib/types/prisma-extended';

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
  });
}

export function usePurchaseReturnStats() {
  return useQuery({
    queryKey: purchaseReturnKeys.stats(),
    queryFn: fetchPurchaseReturnStats,
    staleTime: 60_000,
  });
}

interface UsePurchaseReturnMutationsOptions {
  onCreateSuccess?: (purchaseReturn: PurchaseReturn) => void;
  onUpdateSuccess?: (purchaseReturn: PurchaseReturn) => void;
  onDeleteSuccess?: () => void;
  onError?: (error: Error) => void;
}

export function usePurchaseReturnMutations(options: UsePurchaseReturnMutationsOptions = {}) {
  const queryClient = useQueryClient();
  
  const create = useMutation({
    mutationFn: createPurchaseReturn,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: purchaseReturnKeys.lists() });
      queryClient.invalidateQueries({ queryKey: purchaseReturnKeys.stats() });
      options.onCreateSuccess?.(data);
    },
    onError: options.onError,
  });
  
  const update = useMutation({
    mutationFn: ({ systemId, data }: { systemId: string; data: Partial<PurchaseReturn> }) => 
      updatePurchaseReturn(asSystemId(systemId), data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: purchaseReturnKeys.detail(variables.systemId) });
      queryClient.invalidateQueries({ queryKey: purchaseReturnKeys.lists() });
      queryClient.invalidateQueries({ queryKey: purchaseReturnKeys.stats() });
      options.onUpdateSuccess?.(data);
    },
    onError: options.onError,
  });
  
  const remove = useMutation({
    mutationFn: (systemId: string) => deletePurchaseReturn(asSystemId(systemId)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: purchaseReturnKeys.all });
      options.onDeleteSuccess?.();
    },
    onError: options.onError,
  });
  
  return { create, update, remove };
}

export function usePurchaseReturnsBySupplier(supplierId: string | null | undefined) {
  return usePurchaseReturns({
    supplierId: supplierId || undefined,
    limit: 50,
  });
}

export function usePurchaseReturnsByPO(purchaseOrderId: string | null | undefined) {
  return usePurchaseReturns({
    purchaseOrderId: purchaseOrderId || undefined,
    limit: 20,
  });
}
