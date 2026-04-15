/**
 * Payment Types React Query Hooks
 */

import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import { invalidateRelated } from '@/lib/query-invalidation-map';
import {
  fetchPaymentTypes,
  fetchPaymentTypeById,
  createPaymentType,
  updatePaymentType,
  deletePaymentType,
  setDefaultPaymentType,
  fetchActivePaymentTypes,
  type PaymentTypeFilters,
  type PaymentTypeCreateInput,
  type PaymentTypeUpdateInput,
} from '../api/payment-types-api';

export const paymentTypeKeys = {
  all: ['payment-types'] as const,
  lists: () => [...paymentTypeKeys.all, 'list'] as const,
  list: (filters: PaymentTypeFilters) => [...paymentTypeKeys.lists(), filters] as const,
  details: () => [...paymentTypeKeys.all, 'detail'] as const,
  detail: (id: string) => [...paymentTypeKeys.details(), id] as const,
  active: () => [...paymentTypeKeys.all, 'active'] as const,
};

export function usePaymentTypes(filters: PaymentTypeFilters = {}) {
  return useQuery({
    queryKey: paymentTypeKeys.list(filters),
    queryFn: () => fetchPaymentTypes(filters),
    staleTime: 1000 * 60 * 10,
    gcTime: 1000 * 60 * 60,
    placeholderData: keepPreviousData,
  });
}

export function usePaymentTypeById(systemId: string | undefined) {
  return useQuery({
    queryKey: paymentTypeKeys.detail(systemId!),
    queryFn: () => fetchPaymentTypeById(systemId!),
    enabled: !!systemId,
    staleTime: 1000 * 60 * 10,
    gcTime: 1000 * 60 * 60,
  });
}

export function useActivePaymentTypes() {
  return useQuery({
    queryKey: paymentTypeKeys.active(),
    queryFn: fetchActivePaymentTypes,
    staleTime: 1000 * 60 * 10,
    gcTime: 1000 * 60 * 60,
    placeholderData: keepPreviousData,
  });
}

interface MutationCallbacks {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

export function usePaymentTypeMutations(options: MutationCallbacks = {}) {
  const queryClient = useQueryClient();
  const invalidate = () => invalidateRelated(queryClient, 'payment-types');

  const create = useMutation({
    mutationFn: (data: PaymentTypeCreateInput) => createPaymentType(data),
    onSuccess: () => { invalidate(); options.onSuccess?.(); },
    onError: options.onError,
  });

  const update = useMutation({
    mutationFn: ({ systemId, data }: { systemId: string; data: PaymentTypeUpdateInput }) =>
      updatePaymentType(systemId, data),
    onSuccess: () => { invalidate(); options.onSuccess?.(); },
    onError: options.onError,
  });

  const remove = useMutation({
    mutationFn: (systemId: string) => deletePaymentType(systemId),
    onSuccess: () => { invalidate(); options.onSuccess?.(); },
    onError: options.onError,
  });

  const setDefault = useMutation({
    mutationFn: (systemId: string) => setDefaultPaymentType(systemId),
    onSuccess: () => { invalidate(); options.onSuccess?.(); },
    onError: options.onError,
  });

  return {
    create, update, remove, setDefault,
    isLoading: create.isPending || update.isPending || remove.isPending || setDefault.isPending,
  };
}
