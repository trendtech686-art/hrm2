/**
 * useSalesReturns - React Query hooks
 * 
 * ⚠️ Direct import: import { useSalesReturns } from '@/features/sales-returns/hooks/use-sales-returns'
 */

import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import { asSystemId } from '@/lib/id-types';
import {
  fetchSalesReturns,
  fetchSalesReturn,
  createSalesReturn,
  updateSalesReturn,
  deleteSalesReturn,
  markAsReceived,
  fetchSalesReturnStats,
  type SalesReturnsParams,
} from '../api/sales-returns-api';
import type { SalesReturn } from '@/lib/types/prisma-extended';

export const salesReturnKeys = {
  all: ['sales-returns'] as const,
  lists: () => [...salesReturnKeys.all, 'list'] as const,
  list: (params: SalesReturnsParams) => [...salesReturnKeys.lists(), params] as const,
  details: () => [...salesReturnKeys.all, 'detail'] as const,
  detail: (id: string) => [...salesReturnKeys.details(), id] as const,
  stats: () => [...salesReturnKeys.all, 'stats'] as const,
};

export function useSalesReturns(params: SalesReturnsParams = {}) {
  return useQuery({
    queryKey: salesReturnKeys.list(params),
    queryFn: () => fetchSalesReturns(params),
    staleTime: 30_000,
    gcTime: 5 * 60 * 1000,
    placeholderData: keepPreviousData,
  });
}

export function useSalesReturn(id: string | null | undefined) {
  return useQuery({
    queryKey: salesReturnKeys.detail(id!),
    queryFn: () => fetchSalesReturn(asSystemId(id!)),
    enabled: !!id,
    staleTime: 60_000,
  });
}

export function useSalesReturnStats() {
  return useQuery({
    queryKey: salesReturnKeys.stats(),
    queryFn: fetchSalesReturnStats,
    staleTime: 60_000,
  });
}

interface UseSalesReturnMutationsOptions {
  onCreateSuccess?: (salesReturn: SalesReturn) => void;
  onUpdateSuccess?: (salesReturn: SalesReturn) => void;
  onDeleteSuccess?: () => void;
  onReceiveSuccess?: (salesReturn: SalesReturn) => void;
  onError?: (error: Error) => void;
}

export function useSalesReturnMutations(options: UseSalesReturnMutationsOptions = {}) {
  const queryClient = useQueryClient();
  
  const create = useMutation({
    mutationFn: createSalesReturn,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: salesReturnKeys.lists() });
      queryClient.invalidateQueries({ queryKey: salesReturnKeys.stats() });
      options.onCreateSuccess?.(data);
    },
    onError: options.onError,
  });
  
  const update = useMutation({
    mutationFn: ({ systemId, data }: { systemId: string; data: Partial<SalesReturn> }) => 
      updateSalesReturn(asSystemId(systemId), data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: salesReturnKeys.detail(variables.systemId) });
      queryClient.invalidateQueries({ queryKey: salesReturnKeys.lists() });
      queryClient.invalidateQueries({ queryKey: salesReturnKeys.stats() });
      options.onUpdateSuccess?.(data);
    },
    onError: options.onError,
  });
  
  const remove = useMutation({
    mutationFn: (systemId: string) => deleteSalesReturn(asSystemId(systemId)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: salesReturnKeys.all });
      options.onDeleteSuccess?.();
    },
    onError: options.onError,
  });
  
  const receive = useMutation({
    mutationFn: (systemId: string) => markAsReceived(asSystemId(systemId)),
    onSuccess: (data, systemId) => {
      queryClient.invalidateQueries({ queryKey: salesReturnKeys.detail(systemId) });
      queryClient.invalidateQueries({ queryKey: salesReturnKeys.lists() });
      queryClient.invalidateQueries({ queryKey: salesReturnKeys.stats() });
      options.onReceiveSuccess?.(data);
    },
    onError: options.onError,
  });
  
  return { create, update, remove, receive };
}

export function useSalesReturnsByCustomer(customerId: string | null | undefined) {
  return useSalesReturns({
    customerId: customerId || undefined,
    limit: 50,
  });
}

export function useSalesReturnsByOrder(orderId: string | null | undefined) {
  return useSalesReturns({
    orderId: orderId || undefined,
    limit: 20,
  });
}

export function usePendingSalesReturns() {
  return useSalesReturns({ isReceived: false });
}
