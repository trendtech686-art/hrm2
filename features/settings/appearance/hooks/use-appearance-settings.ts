/**
 * Appearance Settings Hooks
 * React Query hooks for managing appearance settings (theme, colors, fonts)
 *
 * Architecture:
 * - React Query for data fetching/caching
 * - Cookie for SSR (server reads from cookie to inject CSS vars)
 * - ThemeProvider for client-side reactive updates
 *
 * @module features/settings/appearance/hooks/use-appearance-settings
 */

'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import type { ColorMode, Font, FontSize, Theme } from '@/lib/appearance-constants';
import { defaultCustomTheme, type CustomThemeConfig } from '../store';
import { applyTheme } from '@/components/theme-provider';
import { notifyThemeChanged } from '@/hooks/use-chart-colors';

const APPEARANCE_QUERY_KEY = ['settings', 'appearance'] as const;

export interface AppearanceSettings {
  theme: Theme;
  colorMode: ColorMode;
  font: Font;
  fontSize: FontSize;
  customThemeConfig: CustomThemeConfig;
}

// In-memory cache for synchronous access (needed by ThemeProvider on mount)
let settingsCache: AppearanceSettings | null = null;

export function getAppearanceSettingsCache(): AppearanceSettings | null {
  return settingsCache;
}

function updateAppearanceSettingsCache(settings: AppearanceSettings): void {
  settingsCache = settings;
}

function invalidateAppearanceSettingsCache(): void {
  settingsCache = null;
}

// API functions
async function fetchAppearanceSettings(): Promise<AppearanceSettings> {
  const response = await fetch('/api/user-preferences/appearance');
  if (!response.ok) {
    throw new Error('Failed to fetch appearance settings');
  }
  const result = await response.json();

  if (!result.data) {
    // Return defaults if no saved settings
    return {
      theme: 'slate',
      colorMode: 'light',
      font: 'inter',
      fontSize: 'base',
      customThemeConfig: defaultCustomTheme,
    };
  }

  const data = result.data;
  const fromApi = data.customThemeConfig && typeof data.customThemeConfig === 'object'
    ? data.customThemeConfig
    : {};
  const mergedConfig = { ...defaultCustomTheme, ...fromApi } as CustomThemeConfig;

  const settings: AppearanceSettings = {
    theme: (data.theme ?? 'slate') as Theme,
    colorMode: (data.colorMode ?? 'light') as ColorMode,
    font: (data.font ?? 'inter') as Font,
    fontSize: (data.fontSize ?? 'base') as FontSize,
    customThemeConfig: mergedConfig,
  };

  // Update cache
  updateAppearanceSettingsCache(settings);

  return settings;
}

async function saveAppearanceSettings(settings: AppearanceSettings): Promise<AppearanceSettings> {
  const response = await fetch('/api/user-preferences/appearance', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(settings),
  });
  if (!response.ok) {
    throw new Error('Failed to save appearance settings');
  }
  const result = await response.json();

  // Merge with existing data
  const data = result.data;
  const fromApi = data?.customThemeConfig && typeof data.customThemeConfig === 'object'
    ? data.customThemeConfig
    : {};
  const mergedConfig = { ...defaultCustomTheme, ...fromApi } as CustomThemeConfig;

  const savedSettings: AppearanceSettings = {
    theme: (data?.theme ?? settings.theme) as Theme,
    colorMode: (data?.colorMode ?? settings.colorMode) as ColorMode,
    font: (data?.font ?? settings.font) as Font,
    fontSize: (data?.fontSize ?? settings.fontSize) as FontSize,
    customThemeConfig: mergedConfig,
  };

  // Update cache
  updateAppearanceSettingsCache(savedSettings);

  // Apply theme to DOM IMMEDIATELY before any other operations
  if (typeof window !== 'undefined') {
    applyTheme(savedSettings.customThemeConfig, savedSettings.colorMode, savedSettings.fontSize);
    
    // Update the SSR-injected <style> tag to match new theme
    // This prevents stale CSS when navigating between pages without full refresh
    const styleId = 'theme-css';
    const styleEl = document.getElementById(styleId);
    
    if (styleEl) {
      // Build CSS string from config
      const cssLines: string[] = [];
      for (const [key, value] of Object.entries(savedSettings.customThemeConfig)) {
        if (key.startsWith('--') && value) {
          cssLines.push(`${key}: ${value};`);
        }
      }
      // Handle combined shadow variable
      const shadowX = savedSettings.customThemeConfig['--shadow-x'] || '0px';
      const shadowY = savedSettings.customThemeConfig['--shadow-y'] || '1px';
      const shadowBlur = savedSettings.customThemeConfig['--shadow-blur'] || '2px';
      const shadowSpread = savedSettings.customThemeConfig['--shadow-spread'] || '0px';
      const shadowColor = savedSettings.customThemeConfig['--shadow-color'] || 'hsl(0 0% 0% / 0.05)';
      cssLines.push(`--shadow: ${shadowX} ${shadowY} ${shadowBlur} ${shadowSpread} ${shadowColor};`);
      
      styleEl.textContent = `:root { ${cssLines.join(' ')} }`;
    }
    
    // Dispatch theme-change event for other components
    window.dispatchEvent(new CustomEvent('theme-change', {
      detail: {
        colorMode: savedSettings.colorMode,
        fontSize: savedSettings.fontSize,
        customThemeConfig: savedSettings.customThemeConfig,
      }
    }));

    // Notify chart colors hooks to re-read from DOM
    notifyThemeChanged();
  }

  return savedSettings;
}

// Default settings
export const defaultAppearanceSettings: AppearanceSettings = {
  theme: 'slate',
  colorMode: 'light',
  font: 'inter',
  fontSize: 'base',
  customThemeConfig: defaultCustomTheme,
};

/**
 * Returns the default appearance settings
 */
export function getDefaultAppearanceSettings(): AppearanceSettings {
  return {
    theme: 'slate',
    colorMode: 'light',
    font: 'inter',
    fontSize: 'base',
    customThemeConfig: defaultCustomTheme,
  };
}

/**
 * Hook to fetch appearance settings
 */
export function useAppearanceSettings() {
  return useQuery({
    queryKey: APPEARANCE_QUERY_KEY,
    queryFn: fetchAppearanceSettings,
    staleTime: 24 * 60 * 60 * 1000, // 24 hours - settings rarely change
    gcTime: 7 * 24 * 60 * 60 * 1000, // 7 days
    initialData: defaultAppearanceSettings,
  });
}

/**
 * Hook for appearance settings mutations
 */
export function useAppearanceMutations() {
  const queryClient = useQueryClient();

  const saveMutation = useMutation({
    mutationFn: saveAppearanceSettings,
    onSuccess: (data) => {
      // Update query cache
      queryClient.setQueryData(APPEARANCE_QUERY_KEY, data);
      toast.success('Đã lưu giao diện thành công!');
    },
    onError: () => {
      toast.error('Không thể lưu giao diện');
      invalidateAppearanceSettingsCache();
    },
  });

  const resetMutation = useMutation({
    mutationFn: async () => {
      const defaults = getDefaultAppearanceSettings();
      return saveAppearanceSettings(defaults);
    },
    onSuccess: (data) => {
      // Update query cache with defaults
      queryClient.setQueryData(APPEARANCE_QUERY_KEY, data);
      toast.success('Đã khôi phục giao diện mặc định!');
    },
    onError: () => {
      toast.error('Không thể khôi phục giao diện mặc định');
      invalidateAppearanceSettingsCache();
    },
  });

  return { saveMutation, resetMutation };
}
