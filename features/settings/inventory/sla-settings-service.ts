/**
 * Inventory SLA Settings Service
 * 
 * Service layer for accessing inventory SLA settings.
 * Used by non-React files (services, lib functions) that cannot use hooks.
 * 
 * For React components, use the hooks from './hooks/use-sla-settings' instead.
 */

import type { ProductSlaSettings } from './types';

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

// In-memory cache — populated by React Query mutation callbacks
let settingsCache: ProductSlaSettings | null = null;

/**
 * Get SLA settings synchronously from cache.
 * Falls back to default if cache is empty.
 * Used by stock-alert-utils.ts for non-async threshold calculations.
 */
export function getSlaSettingsSync(): ProductSlaSettings {
  return settingsCache ?? defaultSlaSettings;
}

export function invalidateSlaSettingsCache(): void {
  settingsCache = null;
}

export function updateSlaSettingsCache(settings: ProductSlaSettings): void {
  settingsCache = settings;
}

export type { ProductSlaSettings };
