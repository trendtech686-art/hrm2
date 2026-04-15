/**
 * Receipt Types React Query Hooks
 */

import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import { invalidateRelated } from '@/lib/query-invalidation-map';
import {
  fetchReceiptTypes,
  fetchReceiptTypeById,
  createReceiptType,
  updateReceiptType,
  deleteReceiptType,
  setDefaultReceiptType,
  fetchActiveReceiptTypes,
  type ReceiptTypeFilters,
  type ReceiptTypeCreateInput,
  type ReceiptTypeUpdateInput,
} from '../api/receipt-types-api';

export const receiptTypeKeys = {
  all: ['receipt-types'] as const,
  lists: () => [...receiptTypeKeys.all, 'list'] as const,
  list: (filters: ReceiptTypeFilters) => [...receiptTypeKeys.lists(), filters] as const,
  details: () => [...receiptTypeKeys.all, 'detail'] as const,
  detail: (id: string) => [...receiptTypeKeys.details(), id] as const,
  active: () => [...receiptTypeKeys.all, 'active'] as const,
};

export function useReceiptTypes(filters: ReceiptTypeFilters = {}) {
  return useQuery({
    queryKey: receiptTypeKeys.list(filters),
    queryFn: () => fetchReceiptTypes(filters),
    staleTime: 1000 * 60 * 10,
    gcTime: 10 * 60 * 1000,
    placeholderData: keepPreviousData,
  });
}

export function useReceiptTypeById(systemId: string | undefined) {
  return useQuery({
    queryKey: receiptTypeKeys.detail(systemId!),
    queryFn: () => fetchReceiptTypeById(systemId!),
    enabled: !!systemId,
    staleTime: 1000 * 60 * 10,
    gcTime: 10 * 60 * 1000,
  });
}

export function useActiveReceiptTypes() {
  return useQuery({
    queryKey: receiptTypeKeys.active(),
    queryFn: fetchActiveReceiptTypes,
    staleTime: 1000 * 60 * 10,
    gcTime: 10 * 60 * 1000,
    placeholderData: keepPreviousData,
  });
}

interface MutationCallbacks {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

export function useReceiptTypeMutations(options: MutationCallbacks = {}) {
  const queryClient = useQueryClient();
  const invalidate = () => invalidateRelated(queryClient, 'receipt-types');

  const create = useMutation({
    mutationFn: (data: ReceiptTypeCreateInput) => createReceiptType(data),
    onSuccess: () => { invalidate(); options.onSuccess?.(); },
    onError: options.onError,
  });

  const update = useMutation({
    mutationFn: ({ systemId, data }: { systemId: string; data: ReceiptTypeUpdateInput }) =>
      updateReceiptType(systemId, data),
    onSuccess: () => { invalidate(); options.onSuccess?.(); },
    onError: options.onError,
  });

  const remove = useMutation({
    mutationFn: (systemId: string) => deleteReceiptType(systemId),
    onSuccess: () => { invalidate(); options.onSuccess?.(); },
    onError: options.onError,
  });

  const setDefault = useMutation({
    mutationFn: (systemId: string) => setDefaultReceiptType(systemId),
    onSuccess: () => { invalidate(); options.onSuccess?.(); },
    onError: options.onError,
  });

  return {
    create, update, remove, setDefault,
    isLoading: create.isPending || update.isPending || remove.isPending || setDefault.isPending,
  };
}
