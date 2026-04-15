/**
 * Inventory SLA Settings React Query Hooks
 * Provides data fetching and mutations for inventory SLA settings
 */

import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import { invalidateRelated } from '@/lib/query-invalidation-map';
import type { ProductSlaSettings } from '../types';
import { defaultSlaSettings, updateSlaSettingsCache, invalidateSlaSettingsCache } from '../sla-settings-service';

const API_ENDPOINT = '/api/settings/inventory-sla';

// Query keys factory
export const slaSettingsKeys = {
  all: ['sla-settings'] as const,
  settings: () => [...slaSettingsKeys.all, 'current'] as const,
};

// API functions
async function fetchSlaSettings(): Promise<ProductSlaSettings> {
  const response = await fetch(API_ENDPOINT);
  if (!response.ok) {
    throw new Error('Failed to fetch SLA settings');
  }
  const result = await response.json();
  return result.data ?? defaultSlaSettings;
}

async function updateSlaSettingsApi(data: Partial<ProductSlaSettings>): Promise<ProductSlaSettings> {
  const response = await fetch(API_ENDPOINT, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.error || 'Failed to update SLA settings');
  }
  return response.json();
}

async function resetSlaSettingsApi(): Promise<ProductSlaSettings> {
  const response = await fetch(`${API_ENDPOINT}/reset`, {
    method: 'POST',
  });
  if (!response.ok) {
    throw new Error('Failed to reset SLA settings');
  }
  return response.json();
}

/**
 * Hook to fetch SLA settings
 */
export function useSlaSettings() {
  return useQuery({
    queryKey: slaSettingsKeys.settings(),
    queryFn: fetchSlaSettings,
    staleTime: 1000 * 60 * 30, // 30 minutes
    gcTime: 1000 * 60 * 60, // 1 hour
    placeholderData: keepPreviousData,
  });
}

interface MutationCallbacks {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

/**
 * Hook providing SLA settings mutations
 */
export function useSlaSettingsMutations(options: MutationCallbacks = {}) {
  const queryClient = useQueryClient();

  const invalidateSettings = () => {
    invalidateSlaSettingsCache();
    invalidateRelated(queryClient, 'sla-settings');
  };

  const update = useMutation({
    mutationFn: (data: Partial<ProductSlaSettings>) => updateSlaSettingsApi(data),
    onSuccess: (data) => {
      updateSlaSettingsCache(data);
      invalidateSettings();
      options.onSuccess?.();
    },
    onError: options.onError,
  });

  const reset = useMutation({
    mutationFn: resetSlaSettingsApi,
    onSuccess: (data) => {
      updateSlaSettingsCache(data);
      invalidateSettings();
      options.onSuccess?.();
    },
    onError: options.onError,
  });

  return { update, reset };
}

/**
 * Hook providing both data and mutations
 */
export function useSlaSettingsData() {
  const query = useSlaSettings();
  
  return {
    settings: query.data ?? defaultSlaSettings,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
  };
}
