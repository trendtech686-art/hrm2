/**
 * useWarranties - React Query hooks
 * 
 * ⚠️ Direct import: import { useWarranties } from '@/features/warranty/hooks/use-warranties'
 */

import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import {
  fetchWarranties,
  fetchWarranty,
  createWarranty,
  updateWarranty,
  deleteWarranty,
  fetchWarrantyStats,
  type WarrantiesParams,
} from '../api/warranties-api';
import type { WarrantyTicket } from '@/lib/types/prisma-extended';

export const warrantyKeys = {
  all: ['warranties'] as const,
  lists: () => [...warrantyKeys.all, 'list'] as const,
  list: (params: WarrantiesParams) => [...warrantyKeys.lists(), params] as const,
  details: () => [...warrantyKeys.all, 'detail'] as const,
  detail: (id: string) => [...warrantyKeys.details(), id] as const,
  stats: () => [...warrantyKeys.all, 'stats'] as const,
};

export function useWarranties(params: WarrantiesParams = {}) {
  return useQuery({
    queryKey: warrantyKeys.list(params),
    queryFn: () => fetchWarranties(params),
    staleTime: 30_000,
    gcTime: 5 * 60 * 1000,
    placeholderData: keepPreviousData,
  });
}

export function useWarranty(id: string | null | undefined) {
  return useQuery({
    queryKey: warrantyKeys.detail(id!),
    queryFn: () => fetchWarranty(id!),
    enabled: !!id,
    staleTime: 60_000,
  });
}

export function useWarrantyStats() {
  return useQuery({
    queryKey: warrantyKeys.stats(),
    queryFn: fetchWarrantyStats,
    staleTime: 60_000,
  });
}

interface UseWarrantyMutationsOptions {
  onCreateSuccess?: (warranty: WarrantyTicket) => void;
  onUpdateSuccess?: (warranty: WarrantyTicket) => void;
  onDeleteSuccess?: () => void;
  onError?: (error: Error) => void;
}

export function useWarrantyMutations(options: UseWarrantyMutationsOptions = {}) {
  const queryClient = useQueryClient();
  
  const create = useMutation({
    mutationFn: createWarranty,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: warrantyKeys.lists() });
      queryClient.invalidateQueries({ queryKey: warrantyKeys.stats() });
      options.onCreateSuccess?.(data);
    },
    onError: options.onError,
  });
  
  const update = useMutation({
    mutationFn: ({ systemId, data }: { systemId: string; data: Partial<WarrantyTicket> }) => 
      updateWarranty(systemId, data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: warrantyKeys.detail(variables.systemId) });
      queryClient.invalidateQueries({ queryKey: warrantyKeys.lists() });
      queryClient.invalidateQueries({ queryKey: warrantyKeys.stats() });
      options.onUpdateSuccess?.(data);
    },
    onError: options.onError,
  });
  
  const remove = useMutation({
    mutationFn: deleteWarranty,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: warrantyKeys.all });
      options.onDeleteSuccess?.();
    },
    onError: options.onError,
  });
  
  return { create, update, remove };
}

export function usePendingWarranties() {
  return useWarranties({ status: 'pending' });
}

export function useWarrantiesByCustomer(customerId: string | null | undefined) {
  return useWarranties({ customerId: customerId || undefined, limit: 50 });
}
