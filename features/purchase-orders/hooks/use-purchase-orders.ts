/**
 * usePurchaseOrders - React Query hooks
 * 
 * ⚠️ Direct import: import { usePurchaseOrders } from '@/features/purchase-orders/hooks/use-purchase-orders'
 * 
 * Updated to use Server Actions for mutations (Phase 2 migration)
 */

import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import { fetchAllPages } from '@/lib/fetch-all-pages';
import {
  fetchPurchaseOrders,
  fetchPurchaseOrder,
  type PurchaseOrdersParams,
  type PaginatedResponse,
} from '../api/purchase-orders-api';
import {
  createPurchaseOrderAction,
  updatePurchaseOrderAction,
  deletePurchaseOrderAction,
  cancelPurchaseOrderAction,
  type CreatePurchaseOrderInput,
  type UpdatePurchaseOrderInput,
} from '@/app/actions/purchase-orders';
import type { PurchaseOrder } from '@/lib/types/prisma-extended';

// Type for Server Action responses
type PurchaseOrderData = NonNullable<Awaited<ReturnType<typeof createPurchaseOrderAction>>['data']>;

// Re-export types for backwards compatibility
export type { CreatePurchaseOrderInput, UpdatePurchaseOrderInput };

export const purchaseOrderKeys = {
  all: ['purchase-orders'] as const,
  lists: () => [...purchaseOrderKeys.all, 'list'] as const,
  list: (params: PurchaseOrdersParams) => [...purchaseOrderKeys.lists(), params] as const,
  details: () => [...purchaseOrderKeys.all, 'detail'] as const,
  detail: (id: string) => [...purchaseOrderKeys.details(), id] as const,
  stats: () => [...purchaseOrderKeys.all, 'stats'] as const,
};

// Types for initial data from Server Components
export interface PurchaseOrderStats {
  totalPOs: number;
  pendingPOs: number;
  completedPOs: number;
  totalAmount: number;
}

/**
 * Hook for purchase order statistics with optional initial data from Server Component
 */
export function usePurchaseOrderStats(initialData?: PurchaseOrderStats) {
  return useQuery({
    queryKey: purchaseOrderKeys.stats(),
    queryFn: async () => {
      const res = await fetch('/api/purchase-orders/stats');
      if (!res.ok) throw new Error('Failed to fetch stats');
      return res.json() as Promise<PurchaseOrderStats>;
    },
    initialData,
    staleTime: initialData ? 60_000 : 0,
    gcTime: 5 * 60 * 1000,
  });
}

/**
 * Hook for fetching paginated purchase orders list
 * Supports initialData from Server Component for instant hydration
 */
export function usePurchaseOrders(
  params: PurchaseOrdersParams = {},
  initialData?: PaginatedResponse<PurchaseOrder>
) {
  return useQuery({
    queryKey: purchaseOrderKeys.list(params),
    queryFn: () => fetchPurchaseOrders(params),
    initialData,
    staleTime: initialData ? 60_000 : 30_000,
    gcTime: 5 * 60 * 1000,
    placeholderData: keepPreviousData,
  });
}

export function usePurchaseOrder(id: string | null | undefined, initialData?: PurchaseOrder) {
  return useQuery({
    queryKey: purchaseOrderKeys.detail(id!),
    queryFn: () => fetchPurchaseOrder(id!),
    initialData,
    enabled: !!id,
    staleTime: initialData ? 60_000 : 30_000,
  });
}

interface UsePurchaseOrderMutationsOptions {
  onCreateSuccess?: (po: PurchaseOrderData) => void;
  onUpdateSuccess?: (po: PurchaseOrderData) => void;
  onDeleteSuccess?: () => void;
  onCancelSuccess?: (result: PurchaseOrderData) => void;
  onProcessReceiptSuccess?: (po: unknown) => void;
  onError?: (error: Error) => void;
}

export interface CancelPOResult {
  purchaseOrder: PurchaseOrder;
  purchaseReturn: unknown | null;
  receipt: unknown | null;
}

async function _cancelPurchaseOrder(systemId: string, _userId: string, _userName: string, reason?: string): Promise<CancelPOResult> {
  const res = await fetch(`/api/purchase-orders/${systemId}/cancel`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId: _userId, userName: _userName, reason }),
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || 'Failed to cancel purchase order');
  }
  const json = await res.json();
  return json.data;
}

async function processInventoryReceipt(systemId: string): Promise<PurchaseOrder> {
  const res = await fetch(`/api/purchase-orders/${systemId}/process-receipt`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || 'Failed to process inventory receipt');
  }
  const json = await res.json();
  return json.data;
}

export function usePurchaseOrderMutations(options: UsePurchaseOrderMutationsOptions = {}) {
  const queryClient = useQueryClient();
  
  const create = useMutation({
    mutationFn: async (data: CreatePurchaseOrderInput) => {
      const result = await createPurchaseOrderAction(data);
      if (!result.success) throw new Error(result.error || 'Failed to create purchase order');
      return result.data!;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: purchaseOrderKeys.lists() });
      queryClient.invalidateQueries({ queryKey: purchaseOrderKeys.stats() });
      options.onCreateSuccess?.(data);
    },
    onError: options.onError,
  });
  
  const update = useMutation({
    mutationFn: async ({ systemId, data }: { systemId: string; data: Partial<UpdatePurchaseOrderInput> }) => {
      const result = await updatePurchaseOrderAction({ 
        systemId, 
        supplierSystemId: data.supplierSystemId,
        expectedDate: data.expectedDate,
        deliveryDate: data.deliveryDate,
        notes: data.notes,
        updatedBy: data.updatedBy,
      });
      if (!result.success) throw new Error(result.error || 'Failed to update purchase order');
      return result.data!;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: purchaseOrderKeys.detail(variables.systemId) });
      queryClient.invalidateQueries({ queryKey: purchaseOrderKeys.lists() });
      queryClient.invalidateQueries({ queryKey: purchaseOrderKeys.stats() });
      options.onUpdateSuccess?.(data as PurchaseOrderData);
    },
    onError: options.onError,
  });
  
  const remove = useMutation({
    mutationFn: async (systemId: string) => {
      const result = await deletePurchaseOrderAction(systemId);
      if (!result.success) throw new Error(result.error || 'Failed to delete purchase order');
      return result.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: purchaseOrderKeys.all });
      queryClient.invalidateQueries({ queryKey: purchaseOrderKeys.stats() });
      options.onDeleteSuccess?.();
    },
    onError: options.onError,
  });
  
  const cancel = useMutation({
    mutationFn: async ({ systemId, userId: _userId, userName: _userName, reason }: { 
      systemId: string; 
      userId: string; 
      userName: string; 
      reason?: string 
    }) => {
      const result = await cancelPurchaseOrderAction(systemId, reason);
      if (!result.success) throw new Error(result.error || 'Failed to cancel purchase order');
      return result.data!;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: purchaseOrderKeys.detail(variables.systemId) });
      queryClient.invalidateQueries({ queryKey: purchaseOrderKeys.lists() });
      queryClient.invalidateQueries({ queryKey: purchaseOrderKeys.stats() });
      // Also invalidate related queries
      queryClient.invalidateQueries({ queryKey: ['purchase-returns'] });
      queryClient.invalidateQueries({ queryKey: ['receipts'] });
      queryClient.invalidateQueries({ queryKey: ['products'] });
      options.onCancelSuccess?.(data as PurchaseOrderData);
    },
    onError: options.onError,
  });
  
  const processReceipt = useMutation({
    mutationFn: (systemId: string) => processInventoryReceipt(systemId),
    onSuccess: (data, systemId) => {
      queryClient.invalidateQueries({ queryKey: purchaseOrderKeys.detail(systemId) });
      queryClient.invalidateQueries({ queryKey: purchaseOrderKeys.lists() });
      options.onProcessReceiptSuccess?.(data);
    },
    onError: options.onError,
  });
  
  return { create, update, remove, cancel, processReceipt };
}

export function usePurchaseOrdersBySupplier(supplierId: string | null | undefined) {
  const query = useQuery({
    queryKey: [...purchaseOrderKeys.lists(), { supplierId }],
    queryFn: () => fetchAllPages((p) => fetchPurchaseOrders({ ...p, supplierId: supplierId || undefined })),
    enabled: !!supplierId,
    staleTime: 10 * 60 * 1000,
    gcTime: 60 * 60 * 1000,
  });
  // Compat wrapper for .data?.data access
  return { ...query, data: query.data ? { data: query.data } : undefined };
}
