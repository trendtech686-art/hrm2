/**
 * useReceipts - React Query hooks (Phiếu Thu)
 * 
 * ⚠️ Direct import: import { useReceipts } from '@/features/receipts/hooks/use-receipts'
 */

import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import { asSystemId } from '@/lib/id-types';
import {
  fetchReceipts,
  fetchReceipt,
  createReceipt,
  updateReceipt,
  deleteReceipt,
  cancelReceipt,
  fetchReceiptStats,
  type ReceiptsParams,
} from '../api/receipts-api';
import type { Receipt } from '@/lib/types/prisma-extended';

export const receiptKeys = {
  all: ['receipts'] as const,
  lists: () => [...receiptKeys.all, 'list'] as const,
  list: (params: ReceiptsParams) => [...receiptKeys.lists(), params] as const,
  details: () => [...receiptKeys.all, 'detail'] as const,
  detail: (id: string) => [...receiptKeys.details(), id] as const,
  stats: () => [...receiptKeys.all, 'stats'] as const,
};

export function useReceipts(params: ReceiptsParams = {}) {
  return useQuery({
    queryKey: receiptKeys.list(params),
    queryFn: () => fetchReceipts(params),
    staleTime: 30_000,
    gcTime: 5 * 60 * 1000,
    placeholderData: keepPreviousData,
  });
}

export function useReceipt(id: string | null | undefined) {
  return useQuery({
    queryKey: receiptKeys.detail(id!),
    queryFn: () => fetchReceipt(asSystemId(id!)),
    enabled: !!id,
    staleTime: 60_000,
  });
}

export function useReceiptStats() {
  return useQuery({
    queryKey: receiptKeys.stats(),
    queryFn: fetchReceiptStats,
    staleTime: 60_000,
  });
}

interface UseReceiptMutationsOptions {
  onCreateSuccess?: (receipt: Receipt) => void;
  onUpdateSuccess?: (receipt: Receipt) => void;
  onDeleteSuccess?: () => void;
  onCancelSuccess?: (receipt: Receipt) => void;
  onError?: (error: Error) => void;
}

export function useReceiptMutations(options: UseReceiptMutationsOptions = {}) {
  const queryClient = useQueryClient();
  
  const create = useMutation({
    mutationFn: createReceipt,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: receiptKeys.lists() });
      queryClient.invalidateQueries({ queryKey: receiptKeys.stats() });
      options.onCreateSuccess?.(data);
    },
    onError: options.onError,
  });
  
  const update = useMutation({
    mutationFn: ({ systemId, data }: { systemId: string; data: Partial<Receipt> }) => 
      updateReceipt(asSystemId(systemId), data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: receiptKeys.detail(variables.systemId) });
      queryClient.invalidateQueries({ queryKey: receiptKeys.lists() });
      queryClient.invalidateQueries({ queryKey: receiptKeys.stats() });
      options.onUpdateSuccess?.(data);
    },
    onError: options.onError,
  });
  
  const remove = useMutation({
    mutationFn: (systemId: string) => deleteReceipt(asSystemId(systemId)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: receiptKeys.all });
      options.onDeleteSuccess?.();
    },
    onError: options.onError,
  });
  
  const cancel = useMutation({
    mutationFn: ({ systemId, reason }: { systemId: string; reason?: string }) => 
      cancelReceipt(asSystemId(systemId), reason),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: receiptKeys.detail(variables.systemId) });
      queryClient.invalidateQueries({ queryKey: receiptKeys.lists() });
      queryClient.invalidateQueries({ queryKey: receiptKeys.stats() });
      options.onCancelSuccess?.(data);
    },
    onError: options.onError,
  });
  
  return { create, update, remove, cancel };
}

export function useReceiptsByPayer(payerSystemId: string | null | undefined) {
  return useReceipts({
    payerSystemId: payerSystemId || undefined,
    limit: 50,
  });
}

export function useReceiptsByBranch(branchId: string | null | undefined) {
  return useReceipts({
    branchId: branchId || undefined,
    limit: 100,
  });
}

export function useReceiptsByDateRange(startDate: string, endDate: string) {
  return useReceipts({ startDate, endDate });
}
