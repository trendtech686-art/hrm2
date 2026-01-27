/**
 * Product Logistics Settings React Query Hooks
 * Provides data fetching and mutations for logistics settings
 */

import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import type { ProductLogisticsSettings } from '../types';
import { 
  defaultLogisticsSettings, 
  updateLogisticsSettingsCache, 
  invalidateLogisticsSettingsCache 
} from '../logistics-settings-service';

const API_ENDPOINT = '/api/settings/logistics';

// Query keys factory
export const logisticsSettingsKeys = {
  all: ['logistics-settings'] as const,
  settings: () => [...logisticsSettingsKeys.all, 'current'] as const,
};

// API functions
async function fetchLogisticsSettings(): Promise<ProductLogisticsSettings> {
  const response = await fetch(API_ENDPOINT);
  if (!response.ok) {
    throw new Error('Failed to fetch logistics settings');
  }
  const result = await response.json();
  return result.data ?? defaultLogisticsSettings;
}

async function saveLogisticsSettingsApi(data: ProductLogisticsSettings): Promise<ProductLogisticsSettings> {
  const response = await fetch(API_ENDPOINT, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.error || 'Failed to save logistics settings');
  }
  return response.json();
}

async function resetLogisticsSettingsApi(): Promise<ProductLogisticsSettings> {
  const response = await fetch(`${API_ENDPOINT}/reset`, {
    method: 'POST',
  });
  if (!response.ok) {
    throw new Error('Failed to reset logistics settings');
  }
  return response.json();
}

/**
 * Hook to fetch logistics settings
 */
export function useLogisticsSettings() {
  return useQuery({
    queryKey: logisticsSettingsKeys.settings(),
    queryFn: fetchLogisticsSettings,
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
 * Hook providing logistics settings mutations
 */
export function useLogisticsSettingsMutations(options: MutationCallbacks = {}) {
  const queryClient = useQueryClient();

  const invalidateSettings = () => {
    invalidateLogisticsSettingsCache();
    queryClient.invalidateQueries({ queryKey: logisticsSettingsKeys.all });
  };

  const save = useMutation({
    mutationFn: (data: ProductLogisticsSettings) => saveLogisticsSettingsApi(data),
    onSuccess: (data) => {
      updateLogisticsSettingsCache(data);
      invalidateSettings();
      options.onSuccess?.();
    },
    onError: options.onError,
  });

  const reset = useMutation({
    mutationFn: resetLogisticsSettingsApi,
    onSuccess: (data) => {
      updateLogisticsSettingsCache(data);
      invalidateSettings();
      options.onSuccess?.();
    },
    onError: options.onError,
  });

  return { save, reset };
}

/**
 * Hook providing both data and mutations
 */
export function useLogisticsSettingsData() {
  const query = useLogisticsSettings();
  
  return {
    settings: query.data ?? defaultLogisticsSettings,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
  };
}

export type { ProductLogisticsSettings };
