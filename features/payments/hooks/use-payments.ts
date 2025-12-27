/**
 * usePayments - React Query hooks (Phiếu Chi)
 * 
 * ⚠️ Direct import: import { usePayments } from '@/features/payments/hooks/use-payments'
 */

import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import {
  fetchPayments,
  fetchPayment,
  createPayment,
  updatePayment,
  deletePayment,
  cancelPayment,
  fetchPaymentStats,
  type PaymentsParams,
} from '../api/payments-api';
import type { Payment } from '@/lib/types/prisma-extended';
import { asSystemId } from '@/lib/id-types';

export const paymentKeys = {
  all: ['payments'] as const,
  lists: () => [...paymentKeys.all, 'list'] as const,
  list: (params: PaymentsParams) => [...paymentKeys.lists(), params] as const,
  details: () => [...paymentKeys.all, 'detail'] as const,
  detail: (id: string) => [...paymentKeys.details(), id] as const,
  stats: () => [...paymentKeys.all, 'stats'] as const,
};

export function usePayments(params: PaymentsParams = {}) {
  return useQuery({
    queryKey: paymentKeys.list(params),
    queryFn: () => fetchPayments(params),
    staleTime: 30_000,
    gcTime: 5 * 60 * 1000,
    placeholderData: keepPreviousData,
  });
}

export function usePayment(id: string | null | undefined) {
  return useQuery({
    queryKey: paymentKeys.detail(id!),
    queryFn: () => fetchPayment(asSystemId(id!)),
    enabled: !!id,
    staleTime: 60_000,
  });
}

export function usePaymentStats() {
  return useQuery({
    queryKey: paymentKeys.stats(),
    queryFn: fetchPaymentStats,
    staleTime: 60_000,
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
    mutationFn: createPayment,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: paymentKeys.lists() });
      queryClient.invalidateQueries({ queryKey: paymentKeys.stats() });
      options.onCreateSuccess?.(data);
    },
    onError: options.onError,
  });
  
  const update = useMutation({
    mutationFn: ({ systemId, data }: { systemId: string; data: Partial<Payment> }) => 
      updatePayment(asSystemId(systemId), data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: paymentKeys.detail(variables.systemId) });
      queryClient.invalidateQueries({ queryKey: paymentKeys.lists() });
      queryClient.invalidateQueries({ queryKey: paymentKeys.stats() });
      options.onUpdateSuccess?.(data);
    },
    onError: options.onError,
  });
  
  const remove = useMutation({
    mutationFn: (systemId: string) => deletePayment(asSystemId(systemId)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: paymentKeys.all });
      options.onDeleteSuccess?.();
    },
    onError: options.onError,
  });
  
  const cancel = useMutation({
    mutationFn: ({ systemId, reason }: { systemId: string; reason?: string }) => 
      cancelPayment(asSystemId(systemId), reason),
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
    limit: 50,
  });
}

export function usePaymentsByBranch(branchId: string | null | undefined) {
  return usePayments({
    branchId: branchId || undefined,
    limit: 100,
  });
}

export function usePaymentsByDateRange(startDate: string, endDate: string) {
  return usePayments({ startDate, endDate });
}

export function usePaymentsByCategory(category: Payment['category']) {
  return usePayments({ category: category as any });
}
