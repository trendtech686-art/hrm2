/**
 * Shipping Settings Service
 * 
 * Service layer for accessing shipping settings from Prisma database.
 * This is used by non-React files (services, lib functions) that cannot use hooks.
 * 
 * For React components, use the hooks from './hooks/use-shipping-settings' instead.
 */

import type { ShippingSettings } from './types';
import { fetchShippingSettings } from './api/shipping-settings-api';

// Default settings (fallback when API fails or no data in DB)
const DEFAULT_SETTINGS: ShippingSettings = {
  weightSource: 'product',
  customWeight: 100,
  weightUnit: 'gram',
  length: 10,
  width: 10,
  height: 10,
  deliveryRequirement: 'CHOXEMHANGKHONGTHU',
  shippingNote: '',
  autoSyncStatus: true,
  autoCancelOrder: false,
  autoSyncCod: true,
  latePickupWarningDays: 1,
  lateDeliveryWarningDays: 1,
};

// In-memory cache for settings
let settingsCache: ShippingSettings | null = null;
let cacheTimestamp: number = 0;
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

/**
 * Get shipping settings from API with caching
 * Use this for non-React files (services, lib functions)
 */
export async function getShippingSettings(): Promise<ShippingSettings> {
  const now = Date.now();
  
  // Return cached data if still valid
  if (settingsCache && (now - cacheTimestamp) < CACHE_TTL) {
    return settingsCache;
  }
  
  try {
    const data = await fetchShippingSettings();
    if (data) {
      settingsCache = data;
      cacheTimestamp = now;
      return data;
    }
    return DEFAULT_SETTINGS;
  } catch (error) {
    console.error('[ShippingSettingsService] Failed to fetch settings:', error);
    // Return cached data even if expired, or default settings
    return settingsCache ?? DEFAULT_SETTINGS;
  }
}

/**
 * Get settings synchronously (returns cached or default)
 * WARNING: May return stale data. Use getShippingSettings() when possible.
 */
export function getShippingSettingsSync(): ShippingSettings {
  return settingsCache ?? DEFAULT_SETTINGS;
}

/**
 * Invalidate the cache (call after saving settings)
 */
export function invalidateShippingSettingsCache(): void {
  settingsCache = null;
  cacheTimestamp = 0;
}

/**
 * Update cache with new settings
 */
export function updateShippingSettingsCache(settings: ShippingSettings): void {
  settingsCache = settings;
  cacheTimestamp = Date.now();
}

export { DEFAULT_SETTINGS };
