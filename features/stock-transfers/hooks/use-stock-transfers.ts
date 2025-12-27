/**
 * useStockTransfers - React Query hooks (Phiếu Chuyển Kho)
 * 
 * ⚠️ Direct import: import { useStockTransfers } from '@/features/stock-transfers/hooks/use-stock-transfers'
 */

import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import {
  fetchStockTransfers,
  fetchStockTransfer,
  createStockTransfer,
  updateStockTransfer,
  deleteStockTransfer,
  startTransfer,
  completeTransfer,
  cancelStockTransfer,
  fetchStockTransferStats,
  type StockTransfersParams,
} from '../api/stock-transfers-api';
import type { StockTransfer } from '@/lib/types/prisma-extended';
import { asSystemId } from '@/lib/id-types';

export const stockTransferKeys = {
  all: ['stock-transfers'] as const,
  lists: () => [...stockTransferKeys.all, 'list'] as const,
  list: (params: StockTransfersParams) => [...stockTransferKeys.lists(), params] as const,
  details: () => [...stockTransferKeys.all, 'detail'] as const,
  detail: (id: string) => [...stockTransferKeys.details(), id] as const,
  stats: () => [...stockTransferKeys.all, 'stats'] as const,
};

export function useStockTransfers(params: StockTransfersParams = {}) {
  return useQuery({
    queryKey: stockTransferKeys.list(params),
    queryFn: () => fetchStockTransfers(params),
    staleTime: 30_000,
    gcTime: 5 * 60 * 1000,
    placeholderData: keepPreviousData,
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

export function useStockTransferStats() {
  return useQuery({
    queryKey: stockTransferKeys.stats(),
    queryFn: fetchStockTransferStats,
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
    mutationFn: createStockTransfer,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: stockTransferKeys.lists() });
      queryClient.invalidateQueries({ queryKey: stockTransferKeys.stats() });
      options.onCreateSuccess?.(data);
    },
    onError: options.onError,
  });
  
  const update = useMutation({
    mutationFn: ({ systemId, data }: { systemId: string; data: Partial<StockTransfer> }) => 
      updateStockTransfer(asSystemId(systemId), data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: stockTransferKeys.detail(variables.systemId) });
      queryClient.invalidateQueries({ queryKey: stockTransferKeys.lists() });
      options.onUpdateSuccess?.(data);
    },
    onError: options.onError,
  });
  
  const remove = useMutation({
    mutationFn: (systemId: string) => deleteStockTransfer(asSystemId(systemId)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: stockTransferKeys.all });
      options.onDeleteSuccess?.();
    },
    onError: options.onError,
  });
  
  const start = useMutation({
    mutationFn: (systemId: string) => startTransfer(asSystemId(systemId)),
    onSuccess: (data, systemId) => {
      queryClient.invalidateQueries({ queryKey: stockTransferKeys.detail(systemId) });
      queryClient.invalidateQueries({ queryKey: stockTransferKeys.lists() });
      queryClient.invalidateQueries({ queryKey: stockTransferKeys.stats() });
      options.onStartSuccess?.(data);
    },
    onError: options.onError,
  });
  
  const complete = useMutation({
    mutationFn: ({ systemId, receivedItems }: { systemId: string; receivedItems?: { productSystemId: string; receivedQuantity: number }[] }) => 
      completeTransfer(asSystemId(systemId), receivedItems),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: stockTransferKeys.detail(variables.systemId) });
      queryClient.invalidateQueries({ queryKey: stockTransferKeys.lists() });
      queryClient.invalidateQueries({ queryKey: stockTransferKeys.stats() });
      options.onCompleteSuccess?.(data);
    },
    onError: options.onError,
  });
  
  const cancel = useMutation({
    mutationFn: ({ systemId, reason }: { systemId: string; reason: string }) => 
      cancelStockTransfer(asSystemId(systemId), reason),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: stockTransferKeys.detail(variables.systemId) });
      queryClient.invalidateQueries({ queryKey: stockTransferKeys.lists() });
      queryClient.invalidateQueries({ queryKey: stockTransferKeys.stats() });
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
    limit: 50,
  });
}
