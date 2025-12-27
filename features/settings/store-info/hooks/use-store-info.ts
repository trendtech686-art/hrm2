/**
 * Store Info Settings React Query Hooks
 * Provides data fetching and mutations for store information
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  fetchStoreInfo,
  updateStoreInfo,
  resetStoreInfo,
  uploadStoreLogo,
} from '../api/store-info-api';
import type { StoreGeneralInfoInput } from '../store-info-store';

// Query keys factory
export const storeInfoKeys = {
  all: ['store-info'] as const,
  info: () => [...storeInfoKeys.all, 'current'] as const,
};

/**
 * Hook to fetch store information
 */
export function useStoreInfo() {
  return useQuery({
    queryKey: storeInfoKeys.info(),
    queryFn: fetchStoreInfo,
    staleTime: 1000 * 60 * 30, // 30 minutes - info rarely changes
  });
}

interface MutationCallbacks {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

/**
 * Hook providing store info mutations
 */
export function useStoreInfoMutations(options: MutationCallbacks = {}) {
  const queryClient = useQueryClient();

  const invalidateInfo = () => {
    queryClient.invalidateQueries({ queryKey: storeInfoKeys.all });
  };

  const update = useMutation({
    mutationFn: ({ 
      data, 
      metadata 
    }: { 
      data: StoreGeneralInfoInput; 
      metadata?: { updatedBySystemId?: string; updatedByName?: string };
    }) => updateStoreInfo(data, metadata),
    onSuccess: () => {
      invalidateInfo();
      options.onSuccess?.();
    },
    onError: options.onError,
  });

  const reset = useMutation({
    mutationFn: () => resetStoreInfo(),
    onSuccess: () => {
      invalidateInfo();
      options.onSuccess?.();
    },
    onError: options.onError,
  });

  const uploadLogo = useMutation({
    mutationFn: (file: File) => uploadStoreLogo(file),
    onSuccess: () => {
      invalidateInfo();
      options.onSuccess?.();
    },
    onError: options.onError,
  });

  return {
    update,
    reset,
    uploadLogo,
    isLoading: update.isPending || reset.isPending || uploadLogo.isPending,
  };
}
