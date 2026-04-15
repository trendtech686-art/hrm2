/**
 * Sales Management Settings React Query Hooks
 * Provides data fetching and mutations for sales settings
 */

import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import { invalidateRelated } from '@/lib/query-invalidation-map';
import {
  fetchSalesSettings,
  updateSalesSettings,
  resetSalesSettings,
} from '../api/sales-settings-api';
import type { SalesManagementSettingsValues } from '../sales-management-service';

// Query keys factory
export const salesSettingsKeys = {
  all: ['sales-settings'] as const,
  settings: () => [...salesSettingsKeys.all, 'current'] as const,
};

/**
 * Hook to fetch sales management settings
 */
export function useSalesSettings() {
  return useQuery({
    queryKey: salesSettingsKeys.settings(),
    queryFn: fetchSalesSettings,
    staleTime: 1000 * 60 * 10, // 10 minutes - settings rarely change
    gcTime: 10 * 60 * 1000,
    placeholderData: keepPreviousData,
  });
}

interface MutationCallbacks {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

/**
 * Hook providing sales settings mutations
 */
export function useSalesSettingsMutations(options: MutationCallbacks = {}) {
  const queryClient = useQueryClient();

  const invalidateSettings = () => invalidateRelated(queryClient, 'sales-settings');

  const update = useMutation({
    mutationFn: (data: Partial<SalesManagementSettingsValues>) => updateSalesSettings(data),
    onSuccess: () => {
      invalidateSettings();
      options.onSuccess?.();
    },
    onError: options.onError,
  });

  const reset = useMutation({
    mutationFn: () => resetSalesSettings(),
    onSuccess: () => {
      invalidateSettings();
      options.onSuccess?.();
    },
    onError: options.onError,
  });

  return {
    update,
    reset,
    isLoading: update.isPending || reset.isPending,
  };
}

/**
 * Hook to update a single sales setting
 */
export function useSalesSettingUpdate() {
  const { update } = useSalesSettingsMutations();
  
  return <K extends keyof SalesManagementSettingsValues>(
    key: K,
    value: SalesManagementSettingsValues[K]
  ) => update.mutate({ [key]: value });
}
