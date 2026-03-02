/**
 * useInventoryReceipts - React Query hooks (Phiếu Nhập Kho)
 * 
 * ⚠️ Direct import: import { useInventoryReceipts } from '@/features/inventory-receipts/hooks/use-inventory-receipts'
 * 
 * Updated to use Server Actions for mutations (Phase 2 migration)
 */

import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import {
  fetchInventoryReceipts,
  fetchInventoryReceipt,
  type InventoryReceiptsParams,
} from '../api/inventory-receipts-api';
import {
  createInventoryReceiptAction,
  updateInventoryReceiptAction,
  deleteInventoryReceiptAction,
  type CreateInventoryReceiptInput,
  type UpdateInventoryReceiptInput,
} from '@/app/actions/inventory-receipts';
import type { InventoryReceipt as _InventoryReceipt } from '@/lib/types/prisma-extended';
import { asSystemId } from '@/lib/id-types';

// Type for Server Action responses
type InventoryReceiptData = NonNullable<Awaited<ReturnType<typeof createInventoryReceiptAction>>['data']>;

// Re-export types for backwards compatibility
export type { CreateInventoryReceiptInput, UpdateInventoryReceiptInput };

export const inventoryReceiptKeys = {
  all: ['inventory-receipts'] as const,
  lists: () => [...inventoryReceiptKeys.all, 'list'] as const,
  list: (params: InventoryReceiptsParams) => [...inventoryReceiptKeys.lists(), params] as const,
  details: () => [...inventoryReceiptKeys.all, 'detail'] as const,
  detail: (id: string) => [...inventoryReceiptKeys.details(), id] as const,
};

export function useInventoryReceipts(params: InventoryReceiptsParams = {}) {
  return useQuery({
    queryKey: inventoryReceiptKeys.list(params),
    queryFn: () => fetchInventoryReceipts(params),
    staleTime: 30_000,
    gcTime: 5 * 60 * 1000,
    placeholderData: keepPreviousData,
  });
}

export function useInventoryReceipt(id: string | null | undefined) {
  return useQuery({
    queryKey: inventoryReceiptKeys.detail(id!),
    queryFn: () => fetchInventoryReceipt(asSystemId(id!)),
    enabled: !!id,
    staleTime: 60_000,
  });
}

interface UseInventoryReceiptMutationsOptions {
  onCreateSuccess?: (receipt: InventoryReceiptData) => void;
  onUpdateSuccess?: (receipt: InventoryReceiptData) => void;
  onDeleteSuccess?: () => void;
  onError?: (error: Error) => void;
}

export function useInventoryReceiptMutations(options: UseInventoryReceiptMutationsOptions = {}) {
  const queryClient = useQueryClient();
  
  const create = useMutation({
    mutationFn: async (data: CreateInventoryReceiptInput) => {
      const result = await createInventoryReceiptAction(data);
      if (!result.success) throw new Error(result.error || 'Failed to create inventory receipt');
      return result.data!;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: inventoryReceiptKeys.lists() });
      // Invalidate AND refetch products because inventory receipt updates costPrice, lastPurchasePrice, lastPurchaseDate
      // Using refetchQueries to ensure data is fresh immediately (not just marked as stale)
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.refetchQueries({ queryKey: ['products'] });
      options.onCreateSuccess?.(data);
    },
    onError: options.onError,
  });
  
  const update = useMutation({
    mutationFn: async ({ systemId, data }: { systemId: string; data: UpdateInventoryReceiptInput }) => {
      const result = await updateInventoryReceiptAction({ 
        systemId, 
        receiptDate: data.receiptDate,
        updatedBy: data.updatedBy,
      });
      if (!result.success) throw new Error(result.error || 'Failed to update inventory receipt');
      return result.data!;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: inventoryReceiptKeys.detail(variables.systemId) });
      queryClient.invalidateQueries({ queryKey: inventoryReceiptKeys.lists() });
      options.onUpdateSuccess?.(data);
    },
    onError: options.onError,
  });
  
  const remove = useMutation({
    mutationFn: async (systemId: string) => {
      const result = await deleteInventoryReceiptAction(systemId);
      if (!result.success) throw new Error(result.error || 'Failed to delete inventory receipt');
      return result.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: inventoryReceiptKeys.all });
      options.onDeleteSuccess?.();
    },
    onError: options.onError,
  });
  
  return { create, update, remove };
}

export function useInventoryReceiptsBySupplier(supplierId: string | null | undefined) {
  return useInventoryReceipts({
    supplierId: supplierId || undefined,
  });
}

export function useInventoryReceiptsByPO(purchaseOrderId: string | null | undefined) {
  return useInventoryReceipts({
    purchaseOrderId: purchaseOrderId || undefined,
  });
}
