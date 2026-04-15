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
import { invalidateRelated } from '@/lib/query-invalidation-map';
import type { Payment } from '@/lib/types/prisma-extended';

// Re-export for backwards compatibility
export type { CreatePaymentInput, UpdatePaymentInput, CancelPaymentInput, PaymentCategory };

// Helper to convert legacy Payment format to CreatePaymentInput
function toCreatePaymentInput(data: CreatePaymentInput | Partial<Payment>): CreatePaymentInput {
  const d = data as Record<string, unknown>;
  
  // Check if date field exists - indicates new format from detail-page
  // Also check branchId as secondary indicator
  if (d.date && typeof d.date === 'string') {
    // Pass through all fields, ensuring branchId is set
    return {
      ...(data as CreatePaymentInput),
      branchId: (d.branchId || d.branchSystemId || '') as string,
    };
  }
  
  // Convert legacy format (from payment form-page)
  return {
    date: (d.date || d.paymentDate || new Date().toISOString()) as string,
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
    recipientName: (d.recipientName as string) || '',
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
    supplierId: d.supplierId as string | undefined,
    orderAllocations: d.orderAllocations as CreatePaymentInput['orderAllocations'],
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
    // ✅ Always refetch on mount to ensure fresh data
    refetchOnMount: 'always',
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
      invalidateRelated(queryClient, 'payments');
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
    onSuccess: (data) => {
      invalidateRelated(queryClient, 'payments');
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
      invalidateRelated(queryClient, 'payments');
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
    onSuccess: (data) => {
      invalidateRelated(queryClient, 'payments');
      options.onCancelSuccess?.(data);
    },
    onError: options.onError,
  });
  
  return { create, update, remove, cancel };
}


