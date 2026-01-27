/**
 * Shipping Settings React Query Hooks
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchShippingSettings, saveShippingSettings } from '../api/shipping-settings-api';
import { updateShippingSettingsCache, DEFAULT_SETTINGS } from '../shipping-settings-service';
import type { ShippingSettings } from '../types';

// Re-export DEFAULT_SETTINGS for fallback usage
export { DEFAULT_SETTINGS as DEFAULT_SHIPPING_SETTINGS } from '../shipping-settings-service';

export const shippingSettingsKeys = {
  all: ['shipping-settings'] as const,
  main: () => [...shippingSettingsKeys.all, 'main'] as const,
};

/**
 * Hook to fetch shipping settings
 */
export function useShippingSettings() {
  return useQuery({
    queryKey: shippingSettingsKeys.main(),
    queryFn: async () => {
      const data = await fetchShippingSettings();
      if (data) {
        updateShippingSettingsCache(data);
        return data;
      }
      return DEFAULT_SETTINGS;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 30, // 30 minutes
  });
}

/**
 * Hook to save shipping settings
 */
export function useShippingSettingsMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (settings: ShippingSettings) => saveShippingSettings(settings),
    onSuccess: (data) => {
      // Update cache
      updateShippingSettingsCache(data);
      // Invalidate query to refetch
      queryClient.invalidateQueries({ queryKey: shippingSettingsKeys.all });
    },
  });
}
