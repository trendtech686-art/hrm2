/**
 * Payment Types React Query Hooks
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
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
  });
}

export function usePaymentTypeById(systemId: string | undefined) {
  return useQuery({
    queryKey: paymentTypeKeys.detail(systemId!),
    queryFn: () => fetchPaymentTypeById(systemId!),
    enabled: !!systemId,
    staleTime: 1000 * 60 * 10,
  });
}

export function useActivePaymentTypes() {
  return useQuery({
    queryKey: paymentTypeKeys.active(),
    queryFn: fetchActivePaymentTypes,
    staleTime: 1000 * 60 * 10,
  });
}

interface MutationCallbacks {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

export function usePaymentTypeMutations(options: MutationCallbacks = {}) {
  const queryClient = useQueryClient();
  const invalidate = () => queryClient.invalidateQueries({ queryKey: paymentTypeKeys.all });

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
