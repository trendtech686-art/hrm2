/**
 * Sales Management Settings Service
 * 
 * Service layer for accessing sales management settings from Prisma database.
 * This is used by non-React files (services, lib functions) that cannot use hooks.
 * 
 * For React components, use the hooks from './hooks/use-sales-management-settings' instead.
 */

import { logError } from '@/lib/logger'

export type PrintCopiesOption = '1' | '2' | '3';

export type SalesManagementSettingsValues = {
  allowCancelAfterExport: boolean;
  allowNegativeOrder: boolean;
  allowNegativeApproval: boolean;
  allowNegativePacking: boolean;
  allowNegativeStockOut: boolean;
  printCopies: PrintCopiesOption;
};

const API_ENDPOINT = '/api/settings/sales-management';

// Default settings
export const defaultSalesSettings: SalesManagementSettingsValues = {
  allowCancelAfterExport: true,
  allowNegativeOrder: true,
  allowNegativeApproval: true,
  allowNegativePacking: true,
  allowNegativeStockOut: true,
  printCopies: '1',
};

// In-memory cache
let settingsCache: SalesManagementSettingsValues | null = null;
let cacheTimestamp: number = 0;
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

export async function fetchSalesSettingsFromService(): Promise<SalesManagementSettingsValues> {
  try {
    const response = await fetch(API_ENDPOINT);
    if (!response.ok) {
      return { ...defaultSalesSettings };
    }
    const result = await response.json();
    return result.data ?? { ...defaultSalesSettings };
  } catch (error) {
    logError('[SalesSettingsService] Failed to fetch', error);
    return { ...defaultSalesSettings };
  }
}

export async function getSalesSettings(): Promise<SalesManagementSettingsValues> {
  const now = Date.now();
  if (settingsCache && (now - cacheTimestamp) < CACHE_TTL) {
    return { ...settingsCache };
  }
  
  const data = await fetchSalesSettingsFromService();
  settingsCache = data;
  cacheTimestamp = now;
  return { ...data };
}

/**
 * Synchronous access to cached settings
 * Returns cached value or defaults if cache is empty
 * For non-React code that needs immediate access
 */
export function getSalesSettingsSync(): SalesManagementSettingsValues {
  return settingsCache ? { ...settingsCache } : { ...defaultSalesSettings };
}

export function invalidateSalesSettingsCache(): void {
  settingsCache = null;
  cacheTimestamp = 0;
}

export function updateSalesSettingsCache(settings: SalesManagementSettingsValues): void {
  settingsCache = { ...settings };
  cacheTimestamp = Date.now();
}
