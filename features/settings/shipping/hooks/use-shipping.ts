/**
 * Shipping Partners React Query Hooks
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
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
  });
}

export function useShippingPartnerById(systemId: string | undefined) {
  return useQuery({
    queryKey: shippingPartnerKeys.detail(systemId!),
    queryFn: () => fetchShippingPartnerById(systemId!),
    enabled: !!systemId,
    staleTime: 1000 * 60 * 5,
  });
}

export function useActiveShippingPartners() {
  return useQuery({
    queryKey: shippingPartnerKeys.active(),
    queryFn: fetchActiveShippingPartners,
    staleTime: 1000 * 60 * 10,
  });
}

export function useConnectedShippingPartners() {
  return useQuery({
    queryKey: shippingPartnerKeys.connected(),
    queryFn: fetchConnectedShippingPartners,
    staleTime: 1000 * 60 * 5,
  });
}

interface MutationCallbacks {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

export function useShippingPartnerMutations(options: MutationCallbacks = {}) {
  const queryClient = useQueryClient();
  const invalidate = () => queryClient.invalidateQueries({ queryKey: shippingPartnerKeys.all });

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
    mutationFn: ({ systemId, credentials }: { systemId: string; credentials: Record<string, any> }) =>
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
