/**
 * useReceipts - React Query hooks (Phiếu Thu)
 * 
 * ⚠️ Direct import: import { useReceipts } from '@/features/receipts/hooks/use-receipts'
 * 
 * Updated to use Server Actions for mutations (Phase 2 migration)
 */

import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import {
  fetchReceipts,
  fetchReceipt,
  fetchReceiptStats,
  type ReceiptsParams,
} from '../api/receipts-api';
import { asSystemId } from '@/lib/id-types';
import {
  createReceiptAction,
  updateReceiptAction,
  cancelReceiptAction,
  deleteReceiptAction,
  type CreateReceiptInput,
  type UpdateReceiptInput,
  type CancelReceiptInput,
  type ReceiptCategory,
} from '@/app/actions/receipts';
import { invalidateRelated } from '@/lib/query-invalidation-map';
import type { Receipt } from '@/lib/types/prisma-extended';

// Re-export for backwards compatibility
export type { CreateReceiptInput, UpdateReceiptInput, CancelReceiptInput, ReceiptCategory };

// Helper to convert legacy Receipt format to CreateReceiptInput
function toCreateReceiptInput(data: CreateReceiptInput | Partial<Receipt>): CreateReceiptInput {
  // Check if branchId exists - indicates new format
  const d = data as Record<string, unknown>;
  if (d.branchId && typeof d.branchId === 'string') {
    return data as CreateReceiptInput;
  }
  
  // Convert legacy format
  return {
    amount: Number(d.amount) || 0,
    description: (d.description as string) || '',
    category: (d.category as ReceiptCategory) || 'other',
    branchId: (d.branchId || d.branchSystemId || '') as string,
    branchSystemId: d.branchSystemId as string | undefined,
    branchName: d.branchName as string | undefined,
    paymentMethodSystemId: d.paymentMethodSystemId as string | undefined,
    paymentMethodName: d.paymentMethodName as string | undefined,
    accountId: d.accountId as string | undefined,
    accountSystemId: d.accountSystemId as string | undefined,
    payerType: (d.payerTypeName || d.payerType) as string | undefined,
    payerTypeSystemId: d.payerTypeSystemId as string | undefined,
    payerName: d.payerName as string | undefined,
    payerSystemId: d.payerSystemId as string | undefined,
    customerId: d.customerId as string | undefined,
    customerSystemId: d.customerSystemId as string | undefined,
    customerName: d.customerName as string | undefined,
    linkedOrderSystemId: d.linkedOrderSystemId as string | undefined,
    linkedSalesReturnSystemId: d.linkedSalesReturnSystemId as string | undefined,
    linkedWarrantySystemId: d.linkedWarrantySystemId as string | undefined,
    linkedComplaintSystemId: d.linkedComplaintSystemId as string | undefined,
    paymentReceiptTypeSystemId: d.paymentReceiptTypeSystemId as string | undefined,
    paymentReceiptTypeName: d.paymentReceiptTypeName as string | undefined,
    affectsDebt: d.affectsDebt as boolean | undefined,
    orderAllocations: d.orderAllocations as CreateReceiptInput['orderAllocations'],
  };
}

// Legacy format: { systemId, data: Receipt }
// New format: UpdateReceiptInput (flat with systemId at root)
type LegacyUpdateReceiptInput = { systemId: string; data: Partial<Receipt> };

function toUpdateReceiptInput(input: UpdateReceiptInput | LegacyUpdateReceiptInput): UpdateReceiptInput {
  const i = input as Record<string, unknown>;
  // Check if 'data' property exists - indicates legacy format
  if (i.data && typeof i.data === 'object') {
    const legacy = input as LegacyUpdateReceiptInput;
    const d = legacy.data as Record<string, unknown>;
    return {
      systemId: legacy.systemId,
      amount: d.amount !== undefined ? Number(d.amount) : undefined,
      description: d.description as string | undefined,
      category: d.category as ReceiptCategory | undefined,
      branchSystemId: d.branchSystemId as string | undefined,
      branchName: d.branchName as string | undefined,
      paymentMethodSystemId: d.paymentMethodSystemId as string | undefined,
      paymentMethodName: d.paymentMethodName as string | undefined,
      accountSystemId: d.accountSystemId as string | undefined,
      payerType: d.payerType as string | undefined,
      payerTypeSystemId: d.payerTypeSystemId as string | undefined,
      payerName: d.payerName as string | undefined,
      payerSystemId: d.payerSystemId as string | undefined,
    };
  }
  return input as UpdateReceiptInput;
}

// Alias ReceiptsResponse from api
import type { ReceiptsResponse } from '../api/receipts-api';

export const receiptKeys = {
  all: ['receipts'] as const,
  lists: () => [...receiptKeys.all, 'list'] as const,
  list: (params: ReceiptsParams) => [...receiptKeys.lists(), params] as const,
  details: () => [...receiptKeys.all, 'detail'] as const,
  detail: (id: string) => [...receiptKeys.details(), id] as const,
  stats: () => [...receiptKeys.all, 'stats'] as const,
};

// Types for initial data from Server Components - matches fetchReceiptStats return type
export interface ReceiptStats {
  total: number;
  completed: number;
  cancelled: number;
  totalAmount: number;
}

/**
 * Hook for receipt statistics with optional initial data from Server Component
 */
export function useReceiptStats(initialData?: ReceiptStats) {
  return useQuery({
    queryKey: receiptKeys.stats(),
    queryFn: fetchReceiptStats,
    initialData,
    staleTime: initialData ? 60_000 : 0,
    gcTime: 10 * 60 * 1000,
  });
}

/**
 * Hook for fetching paginated receipts list
 * Supports initialData from Server Component for instant hydration
 */
export function useReceipts(
  params: ReceiptsParams & { enabled?: boolean } = {},
  initialData?: ReceiptsResponse
) {
  const { enabled = true, ...queryParams } = params;
  return useQuery({
    queryKey: receiptKeys.list(queryParams),
    queryFn: () => fetchReceipts(queryParams),
    initialData,
    staleTime: initialData ? 60_000 : 30_000,
    gcTime: 5 * 60 * 1000,
    placeholderData: keepPreviousData,
    enabled,
  });
}

export function useReceipt(id: string | null | undefined, initialData?: Receipt) {
  return useQuery({
    queryKey: receiptKeys.detail(id!),
    queryFn: () => fetchReceipt(asSystemId(id!)),
    initialData,
    enabled: !!id,
    staleTime: initialData ? 60_000 : 30_000,
    gcTime: 10 * 60 * 1000,
    // ✅ Always refetch on mount to ensure fresh data
    refetchOnMount: 'always',
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
    // Accept either new CreateReceiptInput or legacy Partial<Receipt> format
    mutationFn: async (data: CreateReceiptInput | Partial<Receipt>) => {
      const input = toCreateReceiptInput(data);
      const result = await createReceiptAction(input);
      if (!result.success) {
        throw new Error(result.error || 'Failed to create receipt');
      }
      return result.data as Receipt;
    },
    onSuccess: (data) => {
      invalidateRelated(queryClient, 'receipts');
      options.onCreateSuccess?.(data);
    },
    onError: options.onError,
  });
  
  const update = useMutation({
    // Accept both new flat format and legacy { systemId, data } format
    mutationFn: async (input: UpdateReceiptInput | LegacyUpdateReceiptInput) => {
      const converted = toUpdateReceiptInput(input);
      const result = await updateReceiptAction(converted);
      if (!result.success) {
        throw new Error(result.error || 'Failed to update receipt');
      }
      return result.data as Receipt;
    },
    onSuccess: (data) => {
      invalidateRelated(queryClient, 'receipts');
      options.onUpdateSuccess?.(data);
    },
    onError: options.onError,
  });
  
  const remove = useMutation({
    mutationFn: async (systemId: string) => {
      const result = await deleteReceiptAction({ systemId });
      if (!result.success) {
        throw new Error(result.error || 'Failed to delete receipt');
      }
      return result.data;
    },
    onSuccess: () => {
      invalidateRelated(queryClient, 'receipts');
      options.onDeleteSuccess?.();
    },
    onError: options.onError,
  });
  
  const cancel = useMutation({
    mutationFn: async (input: CancelReceiptInput) => {
      const result = await cancelReceiptAction(input);
      if (!result.success) {
        throw new Error(result.error || 'Failed to cancel receipt');
      }
      return result.data as Receipt;
    },
    onSuccess: (data) => {
      invalidateRelated(queryClient, 'receipts');
      options.onCancelSuccess?.(data);
    },
    onError: options.onError,
  });
  
  return { create, update, remove, cancel };
}

export function useReceiptsByPayer(payerSystemId: string | null | undefined) {
  return useReceipts({
    payerSystemId: payerSystemId || undefined,
  });
}

export function useReceiptsByBranch(branchId: string | null | undefined) {
  return useReceipts({
    branchId: branchId || undefined,
  });
}

export function useReceiptsByDateRange(startDate: string, endDate: string) {
  return useReceipts({ startDate, endDate });
}
