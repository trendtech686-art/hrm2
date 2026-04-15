/**
 * useUnits - React Query hooks
 * 
 * ⚠️ Direct import: import { useUnits } from '@/features/settings/units/hooks/use-units'
 */

import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import { invalidateRelated } from '@/lib/query-invalidation-map';
import {
  fetchUnits,
  fetchUnit,
  createUnit,
  updateUnit,
  deleteUnit,
  type UnitsParams,
  type Unit,
} from '../api/units-api';

export const unitKeys = {
  all: ['units'] as const,
  lists: () => [...unitKeys.all, 'list'] as const,
  list: (params: UnitsParams) => [...unitKeys.lists(), params] as const,
  details: () => [...unitKeys.all, 'detail'] as const,
  detail: (id: string) => [...unitKeys.details(), id] as const,
};

export function useUnits(params: UnitsParams = {}) {
  return useQuery({
    queryKey: unitKeys.list(params),
    queryFn: () => fetchUnits(params),
    staleTime: 10 * 60 * 1000, // Units rarely change
    gcTime: 60 * 60 * 1000,
    placeholderData: keepPreviousData,
  });
}

export function useUnit(id: string | null | undefined) {
  return useQuery({
    queryKey: unitKeys.detail(id!),
    queryFn: () => fetchUnit(id!),
    enabled: !!id,
    staleTime: 10 * 60 * 1000,
    gcTime: 60 * 60 * 1000,
  });
}

interface UseUnitMutationsOptions {
  onCreateSuccess?: (unit: Unit) => void;
  onUpdateSuccess?: (unit: Unit) => void;
  onDeleteSuccess?: () => void;
  onError?: (error: Error) => void;
}

export function useUnitMutations(options: UseUnitMutationsOptions = {}) {
  const queryClient = useQueryClient();
  
  const create = useMutation({
    mutationFn: createUnit,
    onSuccess: (data) => {
      invalidateRelated(queryClient, 'units');
      options.onCreateSuccess?.(data);
    },
    onError: options.onError,
  });
  
  const update = useMutation({
    mutationFn: ({ systemId, data }: { systemId: string; data: Partial<Unit> }) => 
      updateUnit(systemId, data),
    onSuccess: (data) => {
      invalidateRelated(queryClient, 'units');
      options.onUpdateSuccess?.(data);
    },
    onError: options.onError,
  });
  
  const remove = useMutation({
    mutationFn: deleteUnit,
    onSuccess: () => {
      invalidateRelated(queryClient, 'units');
      options.onDeleteSuccess?.();
    },
    onError: options.onError,
  });
  
  return { create, update, remove };
}

export function useActiveUnits() {
  const query = useQuery({
    queryKey: [...unitKeys.all, 'active'],
    queryFn: async () => {
      const res = await fetchUnits({ isActive: true });
      return res.data;
    },
    staleTime: 10 * 60 * 1000,
    gcTime: 60 * 60 * 1000,
  });
  return { ...query, data: query.data ? { data: query.data } : undefined };
}
