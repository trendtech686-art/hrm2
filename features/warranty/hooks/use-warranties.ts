/**
 * useWarranties - React Query hooks
 * 
 * ⚠️ Direct import: import { useWarranties } from '@/features/warranty/hooks/use-warranties'
 */

import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import {
  fetchWarranties,
  fetchWarranty,
  fetchWarrantyStats,
  type WarrantiesParams,
} from '../api/warranties-api';
import {
  createWarrantyAction,
  updateWarrantyAction,
  deleteWarrantyAction,
  type CreateWarrantyInput,
} from '@/app/actions/warranty';
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

// Types for initial data from Server Components - matches fetchWarrantyStats return type
export interface WarrantyStats {
  total: number;
  pending: number;
  processed: number;
  completed: number;
}

/**
 * Hook for warranty statistics with optional initial data from Server Component
 */
export function useWarrantyStats(initialData?: WarrantyStats) {
  return useQuery({
    queryKey: warrantyKeys.stats(),
    queryFn: fetchWarrantyStats,
    initialData,
    staleTime: initialData ? 60_000 : 0, // Fresh for 1 min if we have initial data
    gcTime: 10 * 60 * 1000, // 10 minutes
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
    mutationFn: async (data: CreateWarrantyInput) => {
      const result = await createWarrantyAction(data);
      if (!result.success) throw new Error(result.error || 'Failed to create warranty');
      return result.data as WarrantyTicket;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: warrantyKeys.lists() });
      queryClient.invalidateQueries({ queryKey: warrantyKeys.stats() });
      options.onCreateSuccess?.(data);
    },
    onError: options.onError,
  });
  
  const update = useMutation({
    mutationFn: async ({ systemId, data }: { systemId: string; data: Partial<WarrantyTicket> }) => {
      const result = await updateWarrantyAction({ systemId, ...data });
      if (!result.success) throw new Error(result.error || 'Failed to update warranty');
      return result.data as WarrantyTicket;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: warrantyKeys.detail(variables.systemId) });
      queryClient.invalidateQueries({ queryKey: warrantyKeys.lists() });
      queryClient.invalidateQueries({ queryKey: warrantyKeys.stats() });
      options.onUpdateSuccess?.(data);
    },
    onError: options.onError,
  });
  
  const remove = useMutation({
    mutationFn: async (systemId: string) => {
      const result = await deleteWarrantyAction(systemId);
      if (!result.success) throw new Error(result.error || 'Failed to delete warranty');
      return result.data;
    },
    // Optimistic delete - UI cập nhật ngay lập tức
    onMutate: async (systemId) => {
      await queryClient.cancelQueries({ queryKey: warrantyKeys.lists() });
      
      const previousLists = queryClient.getQueriesData({ queryKey: warrantyKeys.lists() });
      
      queryClient.setQueriesData(
        { queryKey: warrantyKeys.lists() },
        (old: { data?: Array<{ systemId: string }>, pagination?: unknown } | undefined) => {
          if (!old?.data) return old;
          return {
            ...old,
            data: old.data.filter(item => item.systemId !== systemId),
          };
        }
      );
      
      return { previousLists };
    },
    onError: (_err, _systemId, context) => {
      if (context?.previousLists) {
        context.previousLists.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
      options.onError?.(_err as Error);
    },
    onSuccess: () => {
      options.onDeleteSuccess?.();
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: warrantyKeys.all });
    },
  });
  
  return { create, update, remove };
}

export function usePendingWarranties() {
  return useWarranties({ status: 'pending' });
}

export function useWarrantiesByCustomer(customerId: string | null | undefined) {
  return useWarranties({ customerId: customerId || undefined });
}
