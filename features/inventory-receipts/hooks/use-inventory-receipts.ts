/**
 * useInventoryReceipts - React Query hooks (Phiếu Nhập Kho)
 * 
 * ⚠️ Direct import: import { useInventoryReceipts } from '@/features/inventory-receipts/hooks/use-inventory-receipts'
 */

import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import {
  fetchInventoryReceipts,
  fetchInventoryReceipt,
  createInventoryReceipt,
  updateInventoryReceipt,
  deleteInventoryReceipt,
  type InventoryReceiptsParams,
} from '../api/inventory-receipts-api';
import type { InventoryReceipt } from '@/lib/types/prisma-extended';
import { asSystemId } from '@/lib/id-types';

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
  onCreateSuccess?: (receipt: InventoryReceipt) => void;
  onUpdateSuccess?: (receipt: InventoryReceipt) => void;
  onDeleteSuccess?: () => void;
  onError?: (error: Error) => void;
}

export function useInventoryReceiptMutations(options: UseInventoryReceiptMutationsOptions = {}) {
  const queryClient = useQueryClient();
  
  const create = useMutation({
    mutationFn: createInventoryReceipt,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: inventoryReceiptKeys.lists() });
      options.onCreateSuccess?.(data);
    },
    onError: options.onError,
  });
  
  const update = useMutation({
    mutationFn: ({ systemId, data }: { systemId: string; data: Partial<InventoryReceipt> }) => 
      updateInventoryReceipt(asSystemId(systemId), data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: inventoryReceiptKeys.detail(variables.systemId) });
      queryClient.invalidateQueries({ queryKey: inventoryReceiptKeys.lists() });
      options.onUpdateSuccess?.(data);
    },
    onError: options.onError,
  });
  
  const remove = useMutation({
    mutationFn: (systemId: string) => deleteInventoryReceipt(asSystemId(systemId)),
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
    limit: 50,
  });
}

export function useInventoryReceiptsByPO(purchaseOrderId: string | null | undefined) {
  return useInventoryReceipts({
    purchaseOrderId: purchaseOrderId || undefined,
    limit: 20,
  });
}
