/**
 * useSystemSettings - React Query Hook for System Settings
 * 
 * Stores general-settings via /api/user-preferences endpoint with category 'system-settings'
 */

import { useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

// ============================================================================
// Query Keys Factory
// ============================================================================

export const systemSettingsKeys = {
  all: ['system-settings'] as const,
  setting: (key: string) => [...systemSettingsKeys.all, key] as const,
};

// ============================================================================
// Types
// ============================================================================

export interface GeneralSettings {
  // Mặc định người dùng mới
  defaultRole: string;
  // Branding
  logoUrl: string;
  faviconUrl: string;
  // Định dạng hệ thống
  timezone: string;
  dateFormat: string;
  timeFormat: string;
  currency: string;
  // Hiển thị
  defaultPageSize: number;
  thousandSeparator: string;
  decimalSeparator: string;
  // Ngôn ngữ
  language: string;
}

export const DEFAULT_GENERAL_SETTINGS: GeneralSettings = {
  defaultRole: 'employee',
  logoUrl: '',
  faviconUrl: '',
  timezone: 'Asia/Ho_Chi_Minh',
  dateFormat: 'DD/MM/YYYY',
  timeFormat: '24h',
  currency: 'VND',
  defaultPageSize: 20,
  thousandSeparator: '.',
  decimalSeparator: ',',
  language: 'vi',
};

// ============================================================================
// Generic Settings Hook Factory (React Query)
// ============================================================================

function createSystemSettingsHook<T extends object>(
  preferenceKey: string,
  defaultSettings: T
) {
  return function useSystemSettings() {
    const queryClient = useQueryClient();
    const queryKey = systemSettingsKeys.setting(preferenceKey);

    // Query for fetching settings
    const { data: settings = defaultSettings, isLoading, error } = useQuery({
      queryKey,
      queryFn: async (): Promise<T> => {
        const response = await fetch(
          `/api/user-preferences?category=system-settings&key=${preferenceKey}`
        );
        if (!response.ok) throw new Error('Failed to load settings');
        const data = await response.json();
        return data.value ? { ...defaultSettings, ...data.value } : defaultSettings;
      },
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 30 * 60 * 1000, // 30 minutes
    });

    // Mutation for saving settings with optimistic updates
    const mutation = useMutation({
      mutationFn: async (newSettings: T) => {
        const response = await fetch('/api/user-preferences', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            category: 'system-settings',
            key: preferenceKey,
            value: newSettings,
          }),
        });
        if (!response.ok) throw new Error('Failed to save settings');
        return newSettings;
      },
      onMutate: async (newSettings) => {
        // Cancel outgoing refetches
        await queryClient.cancelQueries({ queryKey });
        
        // Snapshot previous value
        const previousSettings = queryClient.getQueryData<T>(queryKey);
        
        // Optimistic update
        queryClient.setQueryData<T>(queryKey, newSettings);
        
        return { previousSettings };
      },
      onError: (_err, _newSettings, context) => {
        // Rollback on error
        if (context?.previousSettings) {
          queryClient.setQueryData<T>(queryKey, context.previousSettings);
        }
      },
      onSettled: () => {
        // Refetch to ensure sync
        queryClient.invalidateQueries({ queryKey });
      },
    });

    // Update settings
    const setSettings = useCallback((newSettings: T) => {
      mutation.mutate(newSettings);
    }, [mutation]);

    // Update single field
    const updateField = useCallback(<K extends keyof T>(key: K, value: T[K]) => {
      const newSettings = { ...settings, [key]: value };
      mutation.mutate(newSettings);
    }, [settings, mutation]);

    // Reset to defaults
    const resetToDefaults = useCallback(() => {
      mutation.mutate(defaultSettings);
    }, [mutation]);

    // Force save immediately (same as setSettings with React Query)
    const saveImmediately = useCallback(async () => {
      try {
        await mutation.mutateAsync(settings);
        return true;
      } catch {
        return false;
      }
    }, [mutation, settings]);

    return {
      settings,
      setSettings,
      updateField,
      isLoading,
      isSaving: mutation.isPending,
      error: error?.message || null,
      resetToDefaults,
      saveImmediately,
    };
  };
}

// ============================================================================
// Exported Hooks
// ============================================================================

export const useGeneralSettings = createSystemSettingsHook<GeneralSettings>(
  'general-settings',
  DEFAULT_GENERAL_SETTINGS
);
