/**
 * useStockTransfers - React Query hooks (Phiếu Chuyển Kho)
 * 
 * ⚠️ Direct import: import { useStockTransfers } from '@/features/stock-transfers/hooks/use-stock-transfers'
 * 
 * Note: Start/Complete/Cancel operations use API routes for complex stock logic
 * Basic CRUD uses Server Actions
 */

import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import {
  fetchStockTransfers,
  fetchStockTransfer,
  fetchStockTransferStats,
  startTransfer,
  completeTransfer,
  cancelStockTransfer,
  type StockTransfersParams,
} from '../api/stock-transfers-api';
import {
  createStockTransferAction,
  updateStockTransferAction,
  deleteStockTransferAction,
  type CreateStockTransferInput,
  type UpdateStockTransferInput,
} from '@/app/actions/stock-transfers';
import { invalidateRelated } from '@/lib/query-invalidation-map';
import type { StockTransfer } from '@/lib/types/prisma-extended';
import { asSystemId } from '@/lib/id-types';

// Re-export types for backwards compatibility
export type { CreateStockTransferInput, UpdateStockTransferInput };

// Legacy format support
type LegacyUpdateInput = { systemId: string; data: Partial<StockTransfer> };

function toUpdateStockTransferInput(input: UpdateStockTransferInput | LegacyUpdateInput): UpdateStockTransferInput {
  const i = input as Record<string, unknown>;
  if (i.data && typeof i.data === 'object') {
    const legacy = input as LegacyUpdateInput;
    const d = legacy.data as Record<string, unknown>;
    return {
      systemId: legacy.systemId,
      note: d.note as string | undefined,
      notes: d.notes as string | undefined,
      reason: d.reason as string | undefined,
    };
  }
  return input as UpdateStockTransferInput;
}

export const stockTransferKeys = {
  all: ['stock-transfers'] as const,
  lists: () => [...stockTransferKeys.all, 'list'] as const,
  list: (params: StockTransfersParams) => [...stockTransferKeys.lists(), params] as const,
  details: () => [...stockTransferKeys.all, 'detail'] as const,
  detail: (id: string) => [...stockTransferKeys.details(), id] as const,
  stats: () => [...stockTransferKeys.all, 'stats'] as const,
};

// Types for initial data from Server Components
export interface StockTransferStats {
  pending: number;
  inTransit: number;
  completed: number;
  cancelled: number;
  total: number;
}

/**
 * Hook for stock transfer statistics with optional initial data from Server Component
 */
export function useStockTransferStats(initialData?: StockTransferStats) {
  return useQuery<StockTransferStats>({
    queryKey: stockTransferKeys.stats(),
    queryFn: async () => {
      const stats = await fetchStockTransferStats();
      return {
        pending: stats.pending,
        inTransit: stats.transferring,
        completed: stats.completed,
        cancelled: stats.cancelled,
        total: stats.total,
      };
    },
    initialData,
    staleTime: initialData ? 60_000 : 0,
    gcTime: 10 * 60 * 1000,
  });
}

export function useStockTransfers(params: StockTransfersParams = {}, options: { enabled?: boolean } = {}) {
  const { enabled = true } = options;
  return useQuery({
    queryKey: stockTransferKeys.list(params),
    queryFn: () => fetchStockTransfers(params),
    staleTime: 30_000,
    gcTime: 5 * 60 * 1000,
    placeholderData: keepPreviousData,
    enabled,
  });
}

export function useStockTransfer(id: string | null | undefined) {
  return useQuery({
    queryKey: stockTransferKeys.detail(id!),
    queryFn: () => fetchStockTransfer(asSystemId(id!)),
    enabled: !!id,
    staleTime: 60_000,
  });
}

interface UseStockTransferMutationsOptions {
  onCreateSuccess?: (transfer: StockTransfer) => void;
  onUpdateSuccess?: (transfer: StockTransfer) => void;
  onDeleteSuccess?: () => void;
  onStartSuccess?: (transfer: StockTransfer) => void;
  onCompleteSuccess?: (transfer: StockTransfer) => void;
  onCancelSuccess?: (transfer: StockTransfer) => void;
  onError?: (error: Error) => void;
}

export function useStockTransferMutations(options: UseStockTransferMutationsOptions = {}) {
  const queryClient = useQueryClient();
  
  const create = useMutation({
    mutationFn: async (data: CreateStockTransferInput | Partial<StockTransfer>) => {
      const input = data as CreateStockTransferInput;
      const result = await createStockTransferAction(input);
      if (!result.success) {
        throw new Error(result.error || 'Failed to create stock transfer');
      }
      return result.data as unknown as StockTransfer;
    },
    onSuccess: (data) => {
      invalidateRelated(queryClient, 'stock-transfers');
      options.onCreateSuccess?.(data);
    },
    onError: options.onError,
  });
  
  const update = useMutation({
    mutationFn: async (input: UpdateStockTransferInput | LegacyUpdateInput) => {
      const converted = toUpdateStockTransferInput(input);
      const result = await updateStockTransferAction(converted);
      if (!result.success) {
        throw new Error(result.error || 'Failed to update stock transfer');
      }
      return result.data as unknown as StockTransfer;
    },
    onSuccess: (data) => {
      invalidateRelated(queryClient, 'stock-transfers');
      options.onUpdateSuccess?.(data);
    },
    onError: options.onError,
  });
  
  const remove = useMutation({
    mutationFn: async (systemId: string) => {
      const result = await deleteStockTransferAction(systemId);
      if (!result.success) {
        throw new Error(result.error || 'Failed to delete stock transfer');
      }
      return result.data;
    },
    onSuccess: () => {
      invalidateRelated(queryClient, 'stock-transfers');
      options.onDeleteSuccess?.();
    },
    onError: options.onError,
  });
  
  const start = useMutation({
    mutationFn: async (systemId: string) => {
      return await startTransfer(asSystemId(systemId));
    },
    onSuccess: (data) => {
      invalidateRelated(queryClient, 'stock-transfers');
      options.onStartSuccess?.(data);
    },
    onError: options.onError,
  });
  
  const complete = useMutation({
    mutationFn: async (input: { systemId: string; receivedItems?: { productSystemId: string; receivedQuantity: number }[] }) => {
      return await completeTransfer(asSystemId(input.systemId), input.receivedItems);
    },
    onSuccess: (data) => {
      invalidateRelated(queryClient, 'stock-transfers');
      options.onCompleteSuccess?.(data);
    },
    onError: options.onError,
  });
  
  const cancel = useMutation({
    mutationFn: async (input: { systemId: string; reason: string }) => {
      return await cancelStockTransfer(asSystemId(input.systemId), input.reason);
    },
    onSuccess: (data) => {
      invalidateRelated(queryClient, 'stock-transfers');
      options.onCancelSuccess?.(data);
    },
    onError: options.onError,
  });
  
  return { create, update, remove, start, complete, cancel };
}

export function usePendingStockTransfers() {
  return useStockTransfers({ status: 'pending' });
}

export function useTransferringStockTransfers() {
  return useStockTransfers({ status: 'transferring' });
}

export function useStockTransfersByBranch(branchId: string | null | undefined, direction: 'from' | 'to' = 'from') {
  return useStockTransfers({
    [direction === 'from' ? 'fromBranchId' : 'toBranchId']: branchId || undefined,
  });
}
