/**
 * usePaymentMethods - React Query hooks
 * 
 * ⚠️ Direct import: import { usePaymentMethods } from '@/features/settings/payments/hooks/use-payment-methods'
 */

import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import {
  fetchPaymentMethods,
  fetchPaymentMethod,
  createPaymentMethod,
  updatePaymentMethod,
  deletePaymentMethod,
  type PaymentMethodsParams,
  type PaymentMethod,
} from '../api/payment-methods-api';

export const paymentMethodKeys = {
  all: ['payment-methods'] as const,
  lists: () => [...paymentMethodKeys.all, 'list'] as const,
  list: (params: PaymentMethodsParams) => [...paymentMethodKeys.lists(), params] as const,
  details: () => [...paymentMethodKeys.all, 'detail'] as const,
  detail: (id: string) => [...paymentMethodKeys.details(), id] as const,
};

export function usePaymentMethods(params: PaymentMethodsParams = {}) {
  return useQuery({
    queryKey: paymentMethodKeys.list(params),
    queryFn: () => fetchPaymentMethods(params),
    staleTime: 10 * 60 * 1000,
    gcTime: 60 * 60 * 1000,
    placeholderData: keepPreviousData,
  });
}

export function usePaymentMethod(id: string | null | undefined) {
  return useQuery({
    queryKey: paymentMethodKeys.detail(id!),
    queryFn: () => fetchPaymentMethod(id!),
    enabled: !!id,
    staleTime: 10 * 60 * 1000,
  });
}

interface UsePaymentMethodMutationsOptions {
  onCreateSuccess?: (method: PaymentMethod) => void;
  onUpdateSuccess?: (method: PaymentMethod) => void;
  onDeleteSuccess?: () => void;
  onError?: (error: Error) => void;
}

export function usePaymentMethodMutations(options: UsePaymentMethodMutationsOptions = {}) {
  const queryClient = useQueryClient();
  
  const create = useMutation({
    mutationFn: createPaymentMethod,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: paymentMethodKeys.all });
      options.onCreateSuccess?.(data);
    },
    onError: options.onError,
  });
  
  const update = useMutation({
    mutationFn: ({ systemId, data }: { systemId: string; data: Partial<PaymentMethod> }) => 
      updatePaymentMethod(systemId, data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: paymentMethodKeys.detail(variables.systemId) });
      queryClient.invalidateQueries({ queryKey: paymentMethodKeys.lists() });
      options.onUpdateSuccess?.(data);
    },
    onError: options.onError,
  });
  
  const remove = useMutation({
    mutationFn: deletePaymentMethod,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: paymentMethodKeys.all });
      options.onDeleteSuccess?.();
    },
    onError: options.onError,
  });
  
  return { create, update, remove };
}

export function useActivePaymentMethods() {
  return usePaymentMethods({ isActive: true, limit: 50 });
}

export function useAllPaymentMethods() {
  return usePaymentMethods({ limit: 50 });
}
