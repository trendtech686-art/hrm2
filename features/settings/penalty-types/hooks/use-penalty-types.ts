/**
 * usePenaltyTypes - React Query hooks
 * 
 * ⚠️ Direct import: import { usePenaltyTypes } from '@/features/settings/penalty-types/hooks/use-penalty-types'
 */

import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import {
  fetchPenaltyTypes,
  fetchPenaltyType,
  createPenaltyType,
  updatePenaltyType,
  deletePenaltyType,
  type PenaltyTypesParams,
  type PenaltyTypeSetting,
} from '../api/penalty-types-api';

export const penaltyTypeKeys = {
  all: ['penalty-types'] as const,
  lists: () => [...penaltyTypeKeys.all, 'list'] as const,
  list: (params: PenaltyTypesParams) => [...penaltyTypeKeys.lists(), params] as const,
  details: () => [...penaltyTypeKeys.all, 'detail'] as const,
  detail: (id: string) => [...penaltyTypeKeys.details(), id] as const,
};

export function usePenaltyTypes(params: PenaltyTypesParams = {}) {
  return useQuery({
    queryKey: penaltyTypeKeys.list(params),
    queryFn: () => fetchPenaltyTypes(params),
    staleTime: 10 * 60 * 1000,
    gcTime: 60 * 60 * 1000,
    placeholderData: keepPreviousData,
  });
}

export function usePenaltyType(id: string | null | undefined) {
  return useQuery({
    queryKey: penaltyTypeKeys.detail(id!),
    queryFn: () => fetchPenaltyType(id!),
    enabled: !!id,
    staleTime: 10 * 60 * 1000,
    gcTime: 60 * 60 * 1000,
  });
}

interface UsePenaltyTypeMutationsOptions {
  onCreateSuccess?: (penaltyType: PenaltyTypeSetting) => void;
  onUpdateSuccess?: (penaltyType: PenaltyTypeSetting) => void;
  onDeleteSuccess?: () => void;
  onError?: (error: Error) => void;
}

export function usePenaltyTypeMutations(options: UsePenaltyTypeMutationsOptions = {}) {
  const queryClient = useQueryClient();
  
  const create = useMutation({
    mutationFn: createPenaltyType,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: penaltyTypeKeys.all });
      options.onCreateSuccess?.(data);
    },
    onError: options.onError,
  });
  
  const update = useMutation({
    mutationFn: ({ systemId, data }: { systemId: string; data: Partial<PenaltyTypeSetting> }) => 
      updatePenaltyType(systemId, data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: penaltyTypeKeys.detail(variables.systemId) });
      queryClient.invalidateQueries({ queryKey: penaltyTypeKeys.lists() });
      options.onUpdateSuccess?.(data);
    },
    onError: options.onError,
  });
  
  const remove = useMutation({
    mutationFn: deletePenaltyType,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: penaltyTypeKeys.all });
      options.onDeleteSuccess?.();
    },
    onError: options.onError,
  });
  
  return { create, update, remove };
}

export type { PenaltyTypeSetting };
