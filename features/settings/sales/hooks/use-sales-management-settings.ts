/**
 * Sales Management Settings React Query Hooks
 * Provides data fetching and mutations for sales management settings
 */

import * as React from 'react';
import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import { 
  type SalesManagementSettingsValues, 
  defaultSalesSettings, 
  updateSalesSettingsCache, 
  invalidateSalesSettingsCache 
} from '../sales-management-service';

const API_ENDPOINT = '/api/settings/sales-management';

// Query keys factory
export const salesSettingsKeys = {
  all: ['sales-management-settings'] as const,
  settings: () => [...salesSettingsKeys.all, 'current'] as const,
};

// API functions
async function fetchSalesSettings(): Promise<SalesManagementSettingsValues> {
  const response = await fetch(API_ENDPOINT);
  if (!response.ok) {
    throw new Error('Failed to fetch sales management settings');
  }
  const result = await response.json();
  return result.data ?? defaultSalesSettings;
}

async function updateSalesSettingsApi(data: Partial<SalesManagementSettingsValues>): Promise<SalesManagementSettingsValues> {
  const response = await fetch(API_ENDPOINT, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.error || 'Failed to update sales settings');
  }
  return response.json();
}

async function resetSalesSettingsApi(): Promise<SalesManagementSettingsValues> {
  const response = await fetch(`${API_ENDPOINT}/reset`, {
    method: 'POST',
  });
  if (!response.ok) {
    throw new Error('Failed to reset sales settings');
  }
  return response.json();
}

/**
 * Hook to fetch sales management settings
 */
export function useSalesManagementSettings() {
  return useQuery({
    queryKey: salesSettingsKeys.settings(),
    queryFn: fetchSalesSettings,
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
 * Hook providing sales settings mutations
 */
export function useSalesSettingsMutations(options: MutationCallbacks = {}) {
  const queryClient = useQueryClient();

  const invalidateSettings = () => {
    invalidateSalesSettingsCache();
    queryClient.invalidateQueries({ queryKey: salesSettingsKeys.all });
  };

  const update = useMutation({
    mutationFn: (data: Partial<SalesManagementSettingsValues>) => updateSalesSettingsApi(data),
    onSuccess: (data) => {
      updateSalesSettingsCache(data);
      invalidateSettings();
      options.onSuccess?.();
    },
    onError: options.onError,
  });

  const reset = useMutation({
    mutationFn: resetSalesSettingsApi,
    onSuccess: (data) => {
      updateSalesSettingsCache(data);
      invalidateSettings();
      options.onSuccess?.();
    },
    onError: options.onError,
  });

  return { update, reset };
}

/**
 * Hook providing both data and mutations - for use in settings page
 */
export function useSalesManagementSettingsData() {
  const query = useSalesManagementSettings();
  const { update } = useSalesSettingsMutations();
  const [localSettings, setLocalSettings] = React.useState<SalesManagementSettingsValues | null>(null);

  // Sync local state with fetched data - only once when data is first available
  React.useEffect(() => {
    if (query.data && localSettings === null) {
      setLocalSettings(query.data);
    }
  }, [query.data]);

  const settings = localSettings ?? query.data ?? defaultSalesSettings;

  const updateSetting = React.useCallback(<K extends keyof SalesManagementSettingsValues>(
    key: K,
    value: SalesManagementSettingsValues[K]
  ) => {
    setLocalSettings((prev) => {
      const current = prev ?? query.data ?? defaultSalesSettings;
      return { ...current, [key]: value };
    });
  }, [query.data]);

  // Use ref to always have latest localSettings without causing re-renders
  const localSettingsRef = React.useRef(localSettings);
  React.useEffect(() => {
    localSettingsRef.current = localSettings;
  }, [localSettings]);

  const saveSettings = React.useCallback(() => {
    if (localSettingsRef.current) {
      update.mutate(localSettingsRef.current);
    }
  }, [update]);
  
  return {
    settings,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    updateSetting,
    saveSettings,
    isSaving: update.isPending,
  };
}

// Re-export types
export type { SalesManagementSettingsValues };
