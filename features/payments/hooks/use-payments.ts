/**
 * usePayments - React Query hooks (Phiếu Chi)
 * 
 * ⚠️ Direct import: import { usePayments } from '@/features/payments/hooks/use-payments'
 * 
 * Updated to use Server Actions for mutations (Phase 2 migration)
 */

import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import {
  fetchPayments,
  fetchPayment,
  fetchPaymentStats,
  type PaymentsParams,
} from '../api/payments-api';
import { asSystemId } from '@/lib/id-types';
import {
  createPaymentAction,
  updatePaymentAction,
  cancelPaymentAction,
  deletePaymentAction,
  type CreatePaymentInput,
  type UpdatePaymentInput,
  type CancelPaymentInput,
  type PaymentCategory,
} from '@/app/actions/payments';
import type { Payment } from '@/lib/types/prisma-extended';

// Re-export for backwards compatibility
export type { CreatePaymentInput, UpdatePaymentInput, CancelPaymentInput, PaymentCategory };

// Helper to convert legacy Payment format to CreatePaymentInput
function toCreatePaymentInput(data: CreatePaymentInput | Partial<Payment>): CreatePaymentInput {
  // Check if branchId exists - indicates new format
  const d = data as Record<string, unknown>;
  if (d.branchId && typeof d.branchId === 'string') {
    return data as CreatePaymentInput;
  }
  
  // Convert legacy format
  return {
    amount: Number(d.amount) || 0,
    description: (d.description as string) || '',
    category: (d.category as PaymentCategory) || 'other',
    branchId: (d.branchId || d.branchSystemId || '') as string,
    branchSystemId: d.branchSystemId as string | undefined,
    branchName: d.branchName as string | undefined,
    paymentMethodSystemId: d.paymentMethodSystemId as string | undefined,
    paymentMethodName: d.paymentMethodName as string | undefined,
    accountId: d.accountId as string | undefined,
    accountSystemId: d.accountSystemId as string | undefined,
    recipientType: (d.recipientTypeName || d.recipientType) as string | undefined,
    recipientTypeSystemId: d.recipientTypeSystemId as string | undefined,
    recipientTypeName: d.recipientTypeName as string | undefined,
    recipientName: d.recipientName as string | undefined,
    recipientSystemId: d.recipientSystemId as string | undefined,
    linkedOrderSystemId: d.linkedOrderSystemId as string | undefined,
    linkedSalesReturnSystemId: d.linkedSalesReturnSystemId as string | undefined,
    linkedWarrantySystemId: d.linkedWarrantySystemId as string | undefined,
    linkedComplaintSystemId: d.linkedComplaintSystemId as string | undefined,
    purchaseOrderSystemId: d.purchaseOrderSystemId as string | undefined,
    linkedPayrollBatchSystemId: d.linkedPayrollBatchSystemId as string | undefined,
    linkedPayslipSystemId: d.linkedPayslipSystemId as string | undefined,
    paymentReceiptTypeSystemId: d.paymentReceiptTypeSystemId as string | undefined,
    paymentReceiptTypeName: d.paymentReceiptTypeName as string | undefined,
  };
}

// Legacy format: { systemId, data: Payment }
// New format: UpdatePaymentInput (flat with systemId at root)
type LegacyUpdatePaymentInput = { systemId: string; data: Partial<Payment> };

function toUpdatePaymentInput(input: UpdatePaymentInput | LegacyUpdatePaymentInput): UpdatePaymentInput {
  const i = input as Record<string, unknown>;
  // Check if 'data' property exists - indicates legacy format
  if (i.data && typeof i.data === 'object') {
    const legacy = input as LegacyUpdatePaymentInput;
    const d = legacy.data as Record<string, unknown>;
    return {
      systemId: legacy.systemId,
      amount: d.amount !== undefined ? Number(d.amount) : undefined,
      description: d.description as string | undefined,
      category: d.category as PaymentCategory | undefined,
      branchSystemId: d.branchSystemId as string | undefined,
      branchName: d.branchName as string | undefined,
      paymentMethodSystemId: d.paymentMethodSystemId as string | undefined,
      paymentMethodName: d.paymentMethodName as string | undefined,
      accountSystemId: d.accountSystemId as string | undefined,
      recipientType: d.recipientType as string | undefined,
      recipientTypeSystemId: d.recipientTypeSystemId as string | undefined,
      recipientName: d.recipientName as string | undefined,
      recipientSystemId: d.recipientSystemId as string | undefined,
    };
  }
  return input as UpdatePaymentInput;
}

// Alias PaymentsResponse from api
import type { PaymentsResponse } from '../api/payments-api';

export const paymentKeys = {
  all: ['payments'] as const,
  lists: () => [...paymentKeys.all, 'list'] as const,
  list: (params: PaymentsParams) => [...paymentKeys.lists(), params] as const,
  details: () => [...paymentKeys.all, 'detail'] as const,
  detail: (id: string) => [...paymentKeys.details(), id] as const,
  stats: () => [...paymentKeys.all, 'stats'] as const,
};

// Types for initial data from Server Components - matches fetchPaymentStats return type
export interface PaymentStats {
  total: number;
  completed: number;
  cancelled: number;
  totalAmount: number;
}

/**
 * Hook for payment statistics with optional initial data from Server Component
 */
export function usePaymentStats(initialData?: PaymentStats) {
  return useQuery({
    queryKey: paymentKeys.stats(),
    queryFn: fetchPaymentStats,
    initialData,
    staleTime: initialData ? 60_000 : 0,
    gcTime: 5 * 60 * 1000,
  });
}

/**
 * Hook for fetching paginated payments list
 * Supports initialData from Server Component for instant hydration
 */
export function usePayments(
  params: PaymentsParams & { enabled?: boolean } = {},
  initialData?: PaymentsResponse
) {
  const { enabled = true, ...queryParams } = params;
  return useQuery({
    queryKey: paymentKeys.list(queryParams),
    queryFn: () => fetchPayments(queryParams),
    initialData,
    staleTime: initialData ? 60_000 : 30_000,
    gcTime: 5 * 60 * 1000,
    placeholderData: keepPreviousData,
    enabled,
  });
}

export function usePayment(id: string | null | undefined, initialData?: Payment) {
  return useQuery({
    queryKey: paymentKeys.detail(id!),
    queryFn: () => fetchPayment(asSystemId(id!)),
    initialData,
    enabled: !!id,
    staleTime: initialData ? 60_000 : 30_000,
  });
}

interface UsePaymentMutationsOptions {
  onCreateSuccess?: (payment: Payment) => void;
  onUpdateSuccess?: (payment: Payment) => void;
  onDeleteSuccess?: () => void;
  onCancelSuccess?: (payment: Payment) => void;
  onError?: (error: Error) => void;
}

export function usePaymentMutations(options: UsePaymentMutationsOptions = {}) {
  const queryClient = useQueryClient();
  
  const create = useMutation({
    // Accept either new CreatePaymentInput or legacy Partial<Payment> format
    mutationFn: async (data: CreatePaymentInput | Partial<Payment>) => {
      const input = toCreatePaymentInput(data);
      const result = await createPaymentAction(input);
      if (!result.success) {
        throw new Error(result.error || 'Failed to create payment');
      }
      return result.data as Payment;
    },
    onSuccess: (data) => {
      // ✅ Invalidate ALL payment queries (list, detail, purchase-order, etc.)
      queryClient.invalidateQueries({ queryKey: paymentKeys.all });
      queryClient.invalidateQueries({ queryKey: paymentKeys.stats() });
      options.onCreateSuccess?.(data);
    },
    onError: options.onError,
  });
  
  const update = useMutation({
    // Accept both new flat format and legacy { systemId, data } format
    mutationFn: async (input: UpdatePaymentInput | LegacyUpdatePaymentInput) => {
      const converted = toUpdatePaymentInput(input);
      const result = await updatePaymentAction(converted);
      if (!result.success) {
        throw new Error(result.error || 'Failed to update payment');
      }
      return result.data as Payment;
    },
    onSuccess: (data, variables) => {
      const systemId = 'data' in variables ? variables.systemId : variables.systemId;
      queryClient.invalidateQueries({ queryKey: paymentKeys.detail(systemId) });
      queryClient.invalidateQueries({ queryKey: paymentKeys.lists() });
      queryClient.invalidateQueries({ queryKey: paymentKeys.stats() });
      options.onUpdateSuccess?.(data);
    },
    onError: options.onError,
  });
  
  const remove = useMutation({
    mutationFn: async (systemId: string) => {
      const result = await deletePaymentAction({ systemId });
      if (!result.success) {
        throw new Error(result.error || 'Failed to delete payment');
      }
      return result.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: paymentKeys.all });
      options.onDeleteSuccess?.();
    },
    onError: options.onError,
  });
  
  const cancel = useMutation({
    mutationFn: async (input: CancelPaymentInput) => {
      const result = await cancelPaymentAction(input);
      if (!result.success) {
        throw new Error(result.error || 'Failed to cancel payment');
      }
      return result.data as Payment;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: paymentKeys.detail(variables.systemId) });
      queryClient.invalidateQueries({ queryKey: paymentKeys.lists() });
      queryClient.invalidateQueries({ queryKey: paymentKeys.stats() });
      options.onCancelSuccess?.(data);
    },
    onError: options.onError,
  });
  
  return { create, update, remove, cancel };
}

export function usePaymentsByRecipient(recipientSystemId: string | null | undefined) {
  return usePayments({
    recipientSystemId: recipientSystemId || undefined,
  });
}

export function usePaymentsByBranch(branchId: string | null | undefined) {
  return usePayments({
    branchId: branchId || undefined,
  });
}

export function usePaymentsByDateRange(startDate: string, endDate: string) {
  return usePayments({ startDate, endDate });
}

export function usePaymentsByCategory(category: Payment['category']) {
  return usePayments({ category });
}
