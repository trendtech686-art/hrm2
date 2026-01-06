/**
 * Trendtech Settings Store - Selectors
 * Selector hooks for optimized re-renders
 * 
 * @module features/settings/trendtech/store/selectors
 */

import { useTrendtechSettingsStore } from './index';

// ========================================
// Selector Hooks
// ========================================

export function useTrendtechEnabled() {
  return useTrendtechSettingsStore((state) => state.settings.enabled);
}

export function useTrendtechApiConfig() {
  return useTrendtechSettingsStore((state) => ({
    apiUrl: state.settings.apiUrl,
    apiKey: state.settings.apiKey,
    enabled: state.settings.enabled,
  }));
}

export function useTrendtechCategories() {
  return useTrendtechSettingsStore((state) => state.settings.categories);
}

export function useTrendtechBrands() {
  return useTrendtechSettingsStore((state) => state.settings.brands);
}

export function useTrendtechPriceMapping() {
  return useTrendtechSettingsStore((state) => state.settings.priceMapping);
}

export function useTrendtechCategoryMappings() {
  return useTrendtechSettingsStore((state) => state.settings.categoryMappings);
}

export function useTrendtechBrandMappings() {
  return useTrendtechSettingsStore((state) => state.settings.brandMappings);
}

export function useTrendtechSyncSettings() {
  return useTrendtechSettingsStore((state) => state.settings.syncSettings);
}

export function useTrendtechSyncStatus() {
  return useTrendtechSettingsStore((state) => ({
    lastSyncAt: state.settings.lastSyncAt,
    lastSyncResult: state.settings.lastSyncResult,
    connectionStatus: state.settings.connectionStatus,
    connectionError: state.settings.connectionError,
  }));
}

export function useTrendtechProducts() {
  return useTrendtechSettingsStore((state) => ({
    products: state.settings.trendtechProducts,
    lastFetch: state.settings.trendtechProductsLastFetch,
  }));
}
