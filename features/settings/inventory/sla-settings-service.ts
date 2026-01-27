/**
 * Inventory SLA Settings Service
 * 
 * Service layer for accessing inventory SLA settings from Prisma database.
 * This is used by non-React files (services, lib functions) that cannot use hooks.
 * 
 * For React components, use the hooks from './hooks/use-sla-settings' instead.
 */

import type { ProductSlaSettings } from './types';

const API_ENDPOINT = '/api/settings/inventory-sla';

// Default SLA settings
export const defaultSlaSettings: ProductSlaSettings = {
  // Ngưỡng mặc định
  defaultReorderLevel: 10,
  defaultSafetyStock: 5,
  defaultMaxStock: 100,
  
  // Cảnh báo hàng tồn lâu
  deadStockDays: 90,
  slowMovingDays: 30,
  
  // Notifications
  enableEmailAlerts: false,
  alertEmailRecipients: [],
  alertFrequency: 'daily',
  
  // Dashboard
  showOnDashboard: true,
  dashboardAlertTypes: ['out_of_stock', 'low_stock', 'below_safety'],
};

// In-memory cache
let settingsCache: ProductSlaSettings | null = null;
let cacheTimestamp: number = 0;
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

export async function fetchSlaSettingsFromService(): Promise<ProductSlaSettings> {
  try {
    const response = await fetch(API_ENDPOINT);
    if (!response.ok) {
      return defaultSlaSettings;
    }
    const result = await response.json();
    return result.data ?? defaultSlaSettings;
  } catch (error) {
    console.error('[SlaSettingsService] Failed to fetch:', error);
    return defaultSlaSettings;
  }
}

export async function getSlaSettings(): Promise<ProductSlaSettings> {
  const now = Date.now();
  if (settingsCache && (now - cacheTimestamp) < CACHE_TTL) {
    return settingsCache;
  }
  
  const data = await fetchSlaSettingsFromService();
  settingsCache = data;
  cacheTimestamp = now;
  return data;
}

export function getSlaSettingsSync(): ProductSlaSettings {
  return settingsCache ?? defaultSlaSettings;
}

export function invalidateSlaSettingsCache(): void {
  settingsCache = null;
  cacheTimestamp = 0;
}

export function updateSlaSettingsCache(settings: ProductSlaSettings): void {
  settingsCache = settings;
  cacheTimestamp = Date.now();
}

export type { ProductSlaSettings };
