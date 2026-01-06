/**
 * useTaxSettings - React Query hooks for tax settings
 * 
 * Replaces useTaxSettingsStore (Zustand)
 * 
 * @example
 * const { data: settings } = useTaxSettings();
 * const { update } = useTaxSettingsMutations();
 * update.mutate({ priceIncludesTax: true });
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  fetchTaxSettings,
  updateTaxSettings,
  resetTaxSettings,
  type TaxSettings,
} from '../api/tax-settings-api';

// Query keys factory
export const taxSettingsKeys = {
  all: ['tax-settings'] as const,
  settings: () => [...taxSettingsKeys.all, 'current'] as const,
};

/**
 * Hook to fetch tax settings
 */
export function useTaxSettings() {
  return useQuery({
    queryKey: taxSettingsKeys.settings(),
    queryFn: fetchTaxSettings,
    staleTime: 1000 * 60 * 30, // 30 minutes - tax settings rarely change
    gcTime: 1000 * 60 * 60, // 1 hour
  });
}

interface UseTaxSettingsMutationsOptions {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

/**
 * Hook providing tax settings mutations
 */
export function useTaxSettingsMutations(options: UseTaxSettingsMutationsOptions = {}) {
  const queryClient = useQueryClient();

  const invalidateSettings = () => {
    queryClient.invalidateQueries({ queryKey: taxSettingsKeys.all });
  };

  const update = useMutation({
    mutationFn: (data: Partial<TaxSettings>) => updateTaxSettings(data),
    onSuccess: () => {
      invalidateSettings();
      options.onSuccess?.();
    },
    onError: options.onError,
  });

  const reset = useMutation({
    mutationFn: resetTaxSettings,
    onSuccess: () => {
      invalidateSettings();
      options.onSuccess?.();
    },
    onError: options.onError,
  });

  return { update, reset };
}

/**
 * Helper to get tax inclusion type
 */
export function getTaxInclusionType(priceIncludesTax: boolean): 'inclusive' | 'exclusive' {
  return priceIncludesTax ? 'inclusive' : 'exclusive';
}
