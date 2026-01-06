/**
 * PKGX Settings Store - Selectors
 * Selector hooks for optimized re-renders
 * 
 * @module features/settings/pkgx/store/selectors
 */

import { usePkgxSettingsStore } from './index';

// ========================================
// Selector Hooks
// ========================================

export function usePkgxEnabled() {
  return usePkgxSettingsStore((state) => state.settings.enabled);
}

export function usePkgxApiConfig() {
  return usePkgxSettingsStore((state) => ({
    apiUrl: state.settings.apiUrl,
    apiKey: state.settings.apiKey,
    enabled: state.settings.enabled,
  }));
}

export function usePkgxCategories() {
  return usePkgxSettingsStore((state) => state.settings.categories);
}

export function usePkgxBrands() {
  return usePkgxSettingsStore((state) => state.settings.brands);
}

export function usePkgxPriceMapping() {
  return usePkgxSettingsStore((state) => state.settings.priceMapping);
}

export function usePkgxCategoryMappings() {
  return usePkgxSettingsStore((state) => state.settings.categoryMappings);
}

export function usePkgxBrandMappings() {
  return usePkgxSettingsStore((state) => state.settings.brandMappings);
}

export function usePkgxSyncSettings() {
  return usePkgxSettingsStore((state) => state.settings.syncSettings);
}

export function usePkgxSyncStatus() {
  return usePkgxSettingsStore((state) => ({
    lastSyncAt: state.settings.lastSyncAt,
    lastSyncResult: state.settings.lastSyncResult,
    connectionStatus: state.settings.connectionStatus,
    connectionError: state.settings.connectionError,
  }));
}

export function usePkgxProducts() {
  return usePkgxSettingsStore((state) => ({
    products: state.settings.pkgxProducts,
    lastFetch: state.settings.pkgxProductsLastFetch,
  }));
}
