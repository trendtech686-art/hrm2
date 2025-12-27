/**
 * useStorageLocations - React Query hooks
 * 
 * ⚠️ Direct import: import { useStorageLocations } from '@/features/settings/inventory/hooks/use-storage-locations'
 */

import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import {
  fetchStorageLocations,
  fetchStorageLocation,
  createStorageLocation,
  updateStorageLocation,
  deleteStorageLocation,
  type StorageLocationsParams,
  type StorageLocation,
} from '../api/storage-locations-api';

export const storageLocationKeys = {
  all: ['storage-locations'] as const,
  lists: () => [...storageLocationKeys.all, 'list'] as const,
  list: (params: StorageLocationsParams) => [...storageLocationKeys.lists(), params] as const,
  details: () => [...storageLocationKeys.all, 'detail'] as const,
  detail: (id: string) => [...storageLocationKeys.details(), id] as const,
};

export function useStorageLocations(params: StorageLocationsParams = {}) {
  return useQuery({
    queryKey: storageLocationKeys.list(params),
    queryFn: () => fetchStorageLocations(params),
    staleTime: 10 * 60 * 1000,
    gcTime: 60 * 60 * 1000,
    placeholderData: keepPreviousData,
  });
}

export function useStorageLocation(id: string | null | undefined) {
  return useQuery({
    queryKey: storageLocationKeys.detail(id!),
    queryFn: () => fetchStorageLocation(id!),
    enabled: !!id,
    staleTime: 10 * 60 * 1000,
  });
}

interface UseStorageLocationMutationsOptions {
  onCreateSuccess?: (location: StorageLocation) => void;
  onUpdateSuccess?: (location: StorageLocation) => void;
  onDeleteSuccess?: () => void;
  onError?: (error: Error) => void;
}

export function useStorageLocationMutations(options: UseStorageLocationMutationsOptions = {}) {
  const queryClient = useQueryClient();
  
  const create = useMutation({
    mutationFn: createStorageLocation,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: storageLocationKeys.all });
      options.onCreateSuccess?.(data);
    },
    onError: options.onError,
  });
  
  const update = useMutation({
    mutationFn: ({ systemId, data }: { systemId: string; data: Partial<StorageLocation> }) => 
      updateStorageLocation(systemId, data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: storageLocationKeys.detail(variables.systemId) });
      queryClient.invalidateQueries({ queryKey: storageLocationKeys.lists() });
      options.onUpdateSuccess?.(data);
    },
    onError: options.onError,
  });
  
  const remove = useMutation({
    mutationFn: deleteStorageLocation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: storageLocationKeys.all });
      options.onDeleteSuccess?.();
    },
    onError: options.onError,
  });
  
  return { create, update, remove };
}

export function useActiveStorageLocations() {
  return useStorageLocations({ isActive: true, limit: 100 });
}

export function useStorageLocationsByBranch(branchId: string | null | undefined) {
  return useStorageLocations({
    branchId: branchId || undefined,
    isActive: true,
    limit: 50,
  });
}

export function useAllStorageLocations() {
  return useStorageLocations({ limit: 500 });
}
