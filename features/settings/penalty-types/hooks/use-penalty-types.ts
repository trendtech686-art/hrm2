/**
 * usePenaltyTypes - React Query hooks
 * 
 * ⚠️ Direct import: import { usePenaltyTypes } from '@/features/settings/penalty-types/hooks/use-penalty-types'
 */

import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import { generateSubEntityId } from '@/lib/id-utils';
import {
  fetchPenaltyTypes,
  fetchPenaltyType,
  createPenaltyType,
  updatePenaltyType,
  deletePenaltyType,
  type PenaltyTypesParams,
  type PenaltyTypeSetting,
  type PenaltyTypesResponse,
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
    onMutate: async (newData) => {
      // Cancel outgoing queries
      await queryClient.cancelQueries({ queryKey: penaltyTypeKeys.lists() });
      
      // Snapshot previous value
      const previousData = queryClient.getQueriesData({ queryKey: penaltyTypeKeys.lists() });
      
      // Optimistically add to all list queries
      queryClient.setQueriesData({ queryKey: penaltyTypeKeys.lists() }, (old: PenaltyTypesResponse | undefined) => {
        if (!old?.data) return old;
        const tempItem = {
          ...newData,
          systemId: generateSubEntityId('TEMP'),
          id: generateSubEntityId('TEMP'),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        return { ...old, data: [...old.data, tempItem] };
      });
      
      return { previousData };
    },
    onSuccess: (data) => {
      // Replace temp item with real data
      queryClient.setQueriesData({ queryKey: penaltyTypeKeys.lists() }, (old: PenaltyTypesResponse | undefined) => {
        if (!old?.data) return old;
        const filtered = old.data.filter((item: PenaltyTypeSetting) => !item.systemId.startsWith('temp-'));
        return { ...old, data: [...filtered, data] };
      });
      options.onCreateSuccess?.(data);
    },
    onError: (error, _, context) => {
      // Rollback on error
      context?.previousData?.forEach(([queryKey, data]) => {
        queryClient.setQueryData(queryKey, data);
      });
      options.onError?.(error as Error);
    },
  });
  
  const update = useMutation({
    mutationFn: ({ systemId, data }: { systemId: string; data: Partial<PenaltyTypeSetting> }) => 
      updatePenaltyType(systemId, data),
    onMutate: async ({ systemId, data: updateData }) => {
      // Cancel outgoing queries
      await queryClient.cancelQueries({ queryKey: penaltyTypeKeys.lists() });
      await queryClient.cancelQueries({ queryKey: penaltyTypeKeys.detail(systemId) });
      
      // Snapshot previous values
      const previousLists = queryClient.getQueriesData({ queryKey: penaltyTypeKeys.lists() });
      const previousDetail = queryClient.getQueryData(penaltyTypeKeys.detail(systemId));
      
      // Optimistically update in lists
      queryClient.setQueriesData({ queryKey: penaltyTypeKeys.lists() }, (old: PenaltyTypesResponse | undefined) => {
        if (!old?.data) return old;
        return {
          ...old,
          data: old.data.map((item: PenaltyTypeSetting) =>
            item.systemId === systemId ? { ...item, ...updateData, updatedAt: new Date().toISOString() } : item
          ),
        };
      });
      
      // Optimistically update detail
      queryClient.setQueryData(penaltyTypeKeys.detail(systemId), (old: PenaltyTypeSetting | undefined) =>
        old ? { ...old, ...updateData, updatedAt: new Date().toISOString() } : old
      );
      
      return { previousLists, previousDetail, systemId };
    },
    onSuccess: (data, variables) => {
      // Update with server data
      queryClient.setQueriesData({ queryKey: penaltyTypeKeys.lists() }, (old: PenaltyTypesResponse | undefined) => {
        if (!old?.data) return old;
        return {
          ...old,
          data: old.data.map((item: PenaltyTypeSetting) => (item.systemId === variables.systemId ? data : item)),
        };
      });
      queryClient.setQueryData(penaltyTypeKeys.detail(variables.systemId), data);
      options.onUpdateSuccess?.(data);
    },
    onError: (error, _, context) => {
      // Rollback on error
      context?.previousLists?.forEach(([queryKey, data]) => {
        queryClient.setQueryData(queryKey, data);
      });
      if (context?.previousDetail && context?.systemId) {
        queryClient.setQueryData(penaltyTypeKeys.detail(context.systemId), context.previousDetail);
      }
      options.onError?.(error as Error);
    },
  });
  
  const remove = useMutation({
    mutationFn: deletePenaltyType,
    onMutate: async (systemId) => {
      // Cancel outgoing queries
      await queryClient.cancelQueries({ queryKey: penaltyTypeKeys.lists() });
      
      // Snapshot previous value
      const previousData = queryClient.getQueriesData({ queryKey: penaltyTypeKeys.lists() });
      
      // Optimistically remove from lists
      queryClient.setQueriesData({ queryKey: penaltyTypeKeys.lists() }, (old: PenaltyTypesResponse | undefined) => {
        if (!old?.data) return old;
        return { ...old, data: old.data.filter((item: PenaltyTypeSetting) => item.systemId !== systemId) };
      });
      
      return { previousData };
    },
    onSuccess: () => {
      options.onDeleteSuccess?.();
    },
    onError: (error, _, context) => {
      // Rollback on error
      context?.previousData?.forEach(([queryKey, data]) => {
        queryClient.setQueryData(queryKey, data);
      });
      options.onError?.(error as Error);
    },
  });
  
  return { create, update, remove };
}

export type { PenaltyTypeSetting };
