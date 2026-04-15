/**
 * Shipping Partners React Query Hooks
 */

import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import { invalidateRelated } from '@/lib/query-invalidation-map';
import {
  fetchShippingPartners,
  fetchShippingPartnerById,
  createShippingPartner,
  updateShippingPartner,
  deleteShippingPartner,
  connectShippingPartner,
  disconnectShippingPartner,
  fetchActiveShippingPartners,
  fetchConnectedShippingPartners,
  type ShippingPartnerFilters,
  type ShippingPartnerCreateInput,
  type ShippingPartnerUpdateInput,
} from '../api/shipping-api';

export const shippingPartnerKeys = {
  all: ['shipping-partners'] as const,
  lists: () => [...shippingPartnerKeys.all, 'list'] as const,
  list: (filters: ShippingPartnerFilters) => [...shippingPartnerKeys.lists(), filters] as const,
  details: () => [...shippingPartnerKeys.all, 'detail'] as const,
  detail: (id: string) => [...shippingPartnerKeys.details(), id] as const,
  active: () => [...shippingPartnerKeys.all, 'active'] as const,
  connected: () => [...shippingPartnerKeys.all, 'connected'] as const,
};

export function useShippingPartners(filters: ShippingPartnerFilters = {}) {
  return useQuery({
    queryKey: shippingPartnerKeys.list(filters),
    queryFn: () => fetchShippingPartners(filters),
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 30,
    placeholderData: keepPreviousData,
  });
}

export function useShippingPartnerById(systemId: string | undefined) {
  return useQuery({
    queryKey: shippingPartnerKeys.detail(systemId!),
    queryFn: () => fetchShippingPartnerById(systemId!),
    enabled: !!systemId,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 30,
  });
}

export function useActiveShippingPartners() {
  return useQuery({
    queryKey: shippingPartnerKeys.active(),
    queryFn: fetchActiveShippingPartners,
    staleTime: 1000 * 60 * 10,
    gcTime: 1000 * 60 * 60,
  });
}

export function useConnectedShippingPartners() {
  return useQuery({
    queryKey: shippingPartnerKeys.connected(),
    queryFn: fetchConnectedShippingPartners,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 30,
  });
}

interface MutationCallbacks {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

export function useShippingPartnerMutations(options: MutationCallbacks = {}) {
  const queryClient = useQueryClient();
  const invalidate = () => invalidateRelated(queryClient, 'shipping-partners');

  const create = useMutation({
    mutationFn: (data: ShippingPartnerCreateInput) => createShippingPartner(data),
    onSuccess: () => { invalidate(); options.onSuccess?.(); },
    onError: options.onError,
  });

  const update = useMutation({
    mutationFn: ({ systemId, data }: { systemId: string; data: ShippingPartnerUpdateInput }) =>
      updateShippingPartner(systemId, data),
    onSuccess: () => { invalidate(); options.onSuccess?.(); },
    onError: options.onError,
  });

  const remove = useMutation({
    mutationFn: (systemId: string) => deleteShippingPartner(systemId),
    onSuccess: () => { invalidate(); options.onSuccess?.(); },
    onError: options.onError,
  });

  const connect = useMutation({
    mutationFn: ({ systemId, credentials }: { systemId: string; credentials: Record<string, unknown> }) =>
      connectShippingPartner(systemId, credentials),
    onSuccess: () => { invalidate(); options.onSuccess?.(); },
    onError: options.onError,
  });

  const disconnect = useMutation({
    mutationFn: (systemId: string) => disconnectShippingPartner(systemId),
    onSuccess: () => { invalidate(); options.onSuccess?.(); },
    onError: options.onError,
  });

  return {
    create, update, remove, connect, disconnect,
    isLoading: create.isPending || update.isPending || remove.isPending || connect.isPending || disconnect.isPending,
  };
}
