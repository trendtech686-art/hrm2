/**
 * Warranty Settings React Query Hooks
 * Provides data fetching and mutations for warranty settings
 */

import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import { invalidateRelated } from '@/lib/query-invalidation-map';
import { 
  type WarrantySettings, 
  defaultWarrantySettings, 
  updateWarrantySettingsCache, 
  invalidateWarrantySettingsCache 
} from '../warranty-settings-service';

const API_ENDPOINT = '/api/settings/warranty';

// Query keys factory
export const warrantySettingsKeys = {
  all: ['warranty-settings'] as const,
  settings: () => [...warrantySettingsKeys.all, 'current'] as const,
};

// API functions
async function fetchWarrantySettings(): Promise<WarrantySettings> {
  const response = await fetch(API_ENDPOINT);
  if (!response.ok) {
    throw new Error('Failed to fetch warranty settings');
  }
  const result = await response.json();
  return result.data ?? defaultWarrantySettings;
}

async function updateWarrantySettingsApi(data: Partial<WarrantySettings>): Promise<WarrantySettings> {
  const response = await fetch(API_ENDPOINT, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.error || 'Failed to update warranty settings');
  }
  return response.json();
}

async function resetWarrantySettingsApi(): Promise<WarrantySettings> {
  const response = await fetch(`${API_ENDPOINT}/reset`, {
    method: 'POST',
  });
  if (!response.ok) {
    throw new Error('Failed to reset warranty settings');
  }
  return response.json();
}

/**
 * Hook to fetch warranty settings
 */
export function useWarrantySettings() {
  return useQuery({
    queryKey: warrantySettingsKeys.settings(),
    queryFn: fetchWarrantySettings,
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
 * Hook providing warranty settings mutations
 */
export function useWarrantySettingsMutations(options: MutationCallbacks = {}) {
  const queryClient = useQueryClient();

  const invalidateSettings = () => {
    invalidateWarrantySettingsCache();
    invalidateRelated(queryClient, 'warranty-settings');
  };

  const update = useMutation({
    mutationFn: (data: Partial<WarrantySettings>) => updateWarrantySettingsApi(data),
    onSuccess: (data) => {
      updateWarrantySettingsCache(data);
      invalidateSettings();
      options.onSuccess?.();
    },
    onError: options.onError,
  });

  const reset = useMutation({
    mutationFn: resetWarrantySettingsApi,
    onSuccess: (data) => {
      updateWarrantySettingsCache(data);
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
export function useWarrantySettingsData() {
  const query = useWarrantySettings();
  
  return {
    settings: query.data ?? defaultWarrantySettings,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
  };
}

/**
 * Hook để lấy thời hạn bảo hành mặc định
 */
export function useDefaultWarrantyMonths(): number {
  const { settings } = useWarrantySettingsData();
  return settings.defaultWarrantyMonths;
}

// Re-export type for convenience
export type { WarrantySettings };
