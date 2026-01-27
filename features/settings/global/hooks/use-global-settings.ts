/**
 * Global Settings Hooks
 * React Query hooks for managing global application settings
 * 
 * @module features/settings/global/hooks/use-global-settings
 */

'use client';

import * as React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  type GlobalSettings,
  defaultGlobalSettings,
  updateGlobalSettingsCache,
  invalidateGlobalSettingsCache,
} from '../global-settings-service';

const GLOBAL_SETTINGS_QUERY_KEY = ['settings', 'global'] as const;

async function fetchGlobalSettings(): Promise<GlobalSettings> {
  const response = await fetch('/api/settings/global');
  if (!response.ok) {
    throw new Error('Failed to fetch global settings');
  }
  const data = await response.json();
  // Update cache for sync access
  updateGlobalSettingsCache(data);
  return data;
}

async function saveGlobalSettings(settings: GlobalSettings): Promise<GlobalSettings> {
  const response = await fetch('/api/settings/global', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(settings),
  });
  if (!response.ok) {
    throw new Error('Failed to save global settings');
  }
  const data = await response.json();
  // Update cache
  updateGlobalSettingsCache(data);
  return data;
}

/**
 * Hook to fetch global settings
 */
export function useGlobalSettings() {
  return useQuery({
    queryKey: GLOBAL_SETTINGS_QUERY_KEY,
    queryFn: fetchGlobalSettings,
    staleTime: 30 * 60 * 1000, // 30 minutes
    gcTime: 60 * 60 * 1000, // 1 hour
    initialData: defaultGlobalSettings,
  });
}

/**
 * Hook for global settings mutations
 */
export function useGlobalSettingsMutations() {
  const queryClient = useQueryClient();

  const saveMutation = useMutation({
    mutationFn: saveGlobalSettings,
    onSuccess: (data) => {
      queryClient.setQueryData(GLOBAL_SETTINGS_QUERY_KEY, data);
      toast.success('Đã lưu cài đặt chung');
    },
    onError: () => {
      toast.error('Không thể lưu cài đặt chung');
      invalidateGlobalSettingsCache();
    },
  });

  return { saveMutation };
}

/**
 * Hook to get default page size from global settings
 */
export function useDefaultPageSize(): number {
  const { data } = useGlobalSettings();
  return data?.defaultPageSize ?? defaultGlobalSettings.defaultPageSize;
}

/**
 * Hook to get page size options from global settings
 */
export function usePageSizeOptions(): number[] {
  const { data } = useGlobalSettings();
  return data?.pageSizeOptions ?? defaultGlobalSettings.pageSizeOptions;
}

/**
 * Hook để quản lý pagination state với default page size từ global settings
 * @returns [pagination, setPagination]
 */
export function usePaginationWithGlobalDefault() {
  const defaultPageSize = useDefaultPageSize();
  return React.useState({ pageIndex: 0, pageSize: defaultPageSize });
}

/**
 * Combined hook for global settings data and mutations
 */
export function useGlobalSettingsData() {
  const { data, isLoading, error } = useGlobalSettings();
  const { saveMutation } = useGlobalSettingsMutations();
  const [localSettings, setLocalSettings] = React.useState<GlobalSettings | null>(null);

  // Sync local state with fetched data
  React.useEffect(() => {
    if (data && !localSettings) {
      setLocalSettings(data);
    }
  }, [data, localSettings]);

  const settings = localSettings ?? data ?? defaultGlobalSettings;

  const updateSetting = React.useCallback(<K extends keyof GlobalSettings>(
    key: K,
    value: GlobalSettings[K]
  ) => {
    setLocalSettings((prev) => {
      const current = prev ?? data ?? defaultGlobalSettings;
      return { ...current, [key]: value };
    });
  }, [data]);

  const saveSettings = React.useCallback(() => {
    if (localSettings) {
      saveMutation.mutate(localSettings);
    }
  }, [localSettings, saveMutation]);

  return {
    settings,
    isLoading,
    error,
    updateSetting,
    saveSettings,
    isSaving: saveMutation.isPending,
  };
}
