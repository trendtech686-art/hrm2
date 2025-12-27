/**
 * Sales Channels React Query Hooks
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  fetchSalesChannels,
  fetchSalesChannelById,
  createSalesChannel,
  updateSalesChannel,
  deleteSalesChannel,
  setDefaultSalesChannel,
  fetchAppliedSalesChannels,
  type SalesChannelFilters,
  type SalesChannelCreateInput,
  type SalesChannelUpdateInput,
} from '../api/sales-channels-api';

export const salesChannelKeys = {
  all: ['sales-channels'] as const,
  lists: () => [...salesChannelKeys.all, 'list'] as const,
  list: (filters: SalesChannelFilters) => [...salesChannelKeys.lists(), filters] as const,
  details: () => [...salesChannelKeys.all, 'detail'] as const,
  detail: (id: string) => [...salesChannelKeys.details(), id] as const,
  applied: () => [...salesChannelKeys.all, 'applied'] as const,
};

export function useSalesChannels(filters: SalesChannelFilters = {}) {
  return useQuery({
    queryKey: salesChannelKeys.list(filters),
    queryFn: () => fetchSalesChannels(filters),
    staleTime: 1000 * 60 * 10,
  });
}

export function useSalesChannelById(systemId: string | undefined) {
  return useQuery({
    queryKey: salesChannelKeys.detail(systemId!),
    queryFn: () => fetchSalesChannelById(systemId!),
    enabled: !!systemId,
    staleTime: 1000 * 60 * 10,
  });
}

export function useAppliedSalesChannels() {
  return useQuery({
    queryKey: salesChannelKeys.applied(),
    queryFn: fetchAppliedSalesChannels,
    staleTime: 1000 * 60 * 10,
  });
}

interface MutationCallbacks {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

export function useSalesChannelMutations(options: MutationCallbacks = {}) {
  const queryClient = useQueryClient();
  const invalidate = () => queryClient.invalidateQueries({ queryKey: salesChannelKeys.all });

  const create = useMutation({
    mutationFn: (data: SalesChannelCreateInput) => createSalesChannel(data),
    onSuccess: () => { invalidate(); options.onSuccess?.(); },
    onError: options.onError,
  });

  const update = useMutation({
    mutationFn: ({ systemId, data }: { systemId: string; data: SalesChannelUpdateInput }) =>
      updateSalesChannel(systemId, data),
    onSuccess: () => { invalidate(); options.onSuccess?.(); },
    onError: options.onError,
  });

  const remove = useMutation({
    mutationFn: (systemId: string) => deleteSalesChannel(systemId),
    onSuccess: () => { invalidate(); options.onSuccess?.(); },
    onError: options.onError,
  });

  const setDefault = useMutation({
    mutationFn: (systemId: string) => setDefaultSalesChannel(systemId),
    onSuccess: () => { invalidate(); options.onSuccess?.(); },
    onError: options.onError,
  });

  return {
    create, update, remove, setDefault,
    isLoading: create.isPending || update.isPending || remove.isPending || setDefault.isPending,
  };
}
