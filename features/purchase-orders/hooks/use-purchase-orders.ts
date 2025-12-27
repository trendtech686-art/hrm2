/**
 * usePurchaseOrders - React Query hooks
 * 
 * ⚠️ Direct import: import { usePurchaseOrders } from '@/features/purchase-orders/hooks/use-purchase-orders'
 */

import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import {
  fetchPurchaseOrders,
  fetchPurchaseOrder,
  createPurchaseOrder,
  updatePurchaseOrder,
  deletePurchaseOrder,
  type PurchaseOrdersParams,
} from '../api/purchase-orders-api';
import type { PurchaseOrder } from '@/lib/types/prisma-extended';

export const purchaseOrderKeys = {
  all: ['purchase-orders'] as const,
  lists: () => [...purchaseOrderKeys.all, 'list'] as const,
  list: (params: PurchaseOrdersParams) => [...purchaseOrderKeys.lists(), params] as const,
  details: () => [...purchaseOrderKeys.all, 'detail'] as const,
  detail: (id: string) => [...purchaseOrderKeys.details(), id] as const,
};

export function usePurchaseOrders(params: PurchaseOrdersParams = {}) {
  return useQuery({
    queryKey: purchaseOrderKeys.list(params),
    queryFn: () => fetchPurchaseOrders(params),
    staleTime: 30_000,
    gcTime: 5 * 60 * 1000,
    placeholderData: keepPreviousData,
  });
}

export function usePurchaseOrder(id: string | null | undefined) {
  return useQuery({
    queryKey: purchaseOrderKeys.detail(id!),
    queryFn: () => fetchPurchaseOrder(id!),
    enabled: !!id,
    staleTime: 60_000,
  });
}

interface UsePurchaseOrderMutationsOptions {
  onCreateSuccess?: (po: PurchaseOrder) => void;
  onUpdateSuccess?: (po: PurchaseOrder) => void;
  onDeleteSuccess?: () => void;
  onError?: (error: Error) => void;
}

export function usePurchaseOrderMutations(options: UsePurchaseOrderMutationsOptions = {}) {
  const queryClient = useQueryClient();
  
  const create = useMutation({
    mutationFn: createPurchaseOrder,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: purchaseOrderKeys.lists() });
      options.onCreateSuccess?.(data);
    },
    onError: options.onError,
  });
  
  const update = useMutation({
    mutationFn: ({ systemId, data }: { systemId: string; data: Partial<PurchaseOrder> }) => 
      updatePurchaseOrder(systemId, data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: purchaseOrderKeys.detail(variables.systemId) });
      queryClient.invalidateQueries({ queryKey: purchaseOrderKeys.lists() });
      options.onUpdateSuccess?.(data);
    },
    onError: options.onError,
  });
  
  const remove = useMutation({
    mutationFn: deletePurchaseOrder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: purchaseOrderKeys.all });
      options.onDeleteSuccess?.();
    },
    onError: options.onError,
  });
  
  return { create, update, remove };
}

export function usePurchaseOrdersBySupplier(supplierId: string | null | undefined) {
  return usePurchaseOrders({ supplierId: supplierId || undefined, limit: 100 });
}
