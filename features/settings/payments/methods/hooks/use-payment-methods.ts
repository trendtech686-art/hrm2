/**
 * Payment Methods React Query Hooks
 * 
 * @see docs/SETTINGS-MODULE-STANDARD.md
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  fetchPaymentMethods,
  fetchPaymentMethodById,
  createPaymentMethod,
  updatePaymentMethod,
  deletePaymentMethod,
  setDefaultPaymentMethod,
  fetchActivePaymentMethods,
  type PaymentMethodFilters,
  type PaymentMethodCreateInput,
  type PaymentMethodUpdateInput,
} from '../api/payment-methods-api';

// Query Keys
export const paymentMethodKeys = {
  all: ['payment-methods'] as const,
  lists: () => [...paymentMethodKeys.all, 'list'] as const,
  list: (filters: PaymentMethodFilters) => [...paymentMethodKeys.lists(), filters] as const,
  details: () => [...paymentMethodKeys.all, 'detail'] as const,
  detail: (id: string) => [...paymentMethodKeys.details(), id] as const,
  active: () => [...paymentMethodKeys.all, 'active'] as const,
};

// List hook
export function usePaymentMethods(filters: PaymentMethodFilters = {}) {
  return useQuery({
    queryKey: paymentMethodKeys.list(filters),
    queryFn: () => fetchPaymentMethods(filters),
    staleTime: 0, // ⚠️ QUAN TRỌNG: 0 để refetch ngay sau invalidate
    gcTime: 1000 * 60 * 60,
  });
}

// Detail hook
export function usePaymentMethodById(systemId: string | undefined) {
  return useQuery({
    queryKey: paymentMethodKeys.detail(systemId!),
    queryFn: () => fetchPaymentMethodById(systemId!),
    enabled: !!systemId,
    staleTime: 1000 * 60 * 10,
    gcTime: 1000 * 60 * 60,
  });
}

// Active list hook
export function useActivePaymentMethods() {
  return useQuery({
    queryKey: paymentMethodKeys.active(),
    queryFn: fetchActivePaymentMethods,
    staleTime: 1000 * 60 * 10,
    gcTime: 1000 * 60 * 60,
  });
}

// Mutation callbacks
interface MutationCallbacks {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

// Mutations hook
export function usePaymentMethodMutations(options: MutationCallbacks = {}) {
  const queryClient = useQueryClient();
  
  // ⚠️ QUAN TRỌNG: refetchType: 'all' để force refetch ngay lập tức
  const invalidate = () => queryClient.invalidateQueries({ 
    queryKey: paymentMethodKeys.all,
    refetchType: 'all',
  });

  const create = useMutation({
    mutationFn: (data: PaymentMethodCreateInput) => createPaymentMethod(data),
    onSuccess: () => { invalidate(); options.onSuccess?.(); },
    onError: options.onError,
  });

  const update = useMutation({
    mutationFn: ({ systemId, data }: { systemId: string; data: PaymentMethodUpdateInput }) =>
      updatePaymentMethod(systemId, data),
    onSuccess: () => { invalidate(); options.onSuccess?.(); },
    onError: options.onError,
  });

  const remove = useMutation({
    mutationFn: (systemId: string) => deletePaymentMethod(systemId),
    onSuccess: () => { invalidate(); options.onSuccess?.(); },
    onError: options.onError,
  });

  const setDefault = useMutation({
    mutationFn: (systemId: string) => setDefaultPaymentMethod(systemId),
    onSuccess: () => { invalidate(); options.onSuccess?.(); },
    onError: options.onError,
  });

  return {
    create, 
    update, 
    remove, 
    setDefault,
    isLoading: create.isPending || update.isPending || remove.isPending || setDefault.isPending,
  };
}
