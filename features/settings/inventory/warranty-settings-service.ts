/**
 * Warranty Settings Service
 * 
 * Service layer for accessing warranty settings from Prisma database.
 * This is used by non-React files (services, lib functions) that cannot use hooks.
 * 
 * For React components, use the hooks from './hooks/use-warranty-settings' instead.
 */

export interface WarrantySettings {
  /** Thời hạn bảo hành mặc định (tháng) - áp dụng cho tất cả SP nếu không cấu hình riêng */
  defaultWarrantyMonths: number;
}

const API_ENDPOINT = '/api/settings/warranty';

// Default warranty settings
export const defaultWarrantySettings: WarrantySettings = {
  defaultWarrantyMonths: 12,
};

// In-memory cache
let settingsCache: WarrantySettings | null = null;
let cacheTimestamp: number = 0;
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

export async function fetchWarrantySettingsFromService(): Promise<WarrantySettings> {
  try {
    const response = await fetch(API_ENDPOINT);
    if (!response.ok) {
      return defaultWarrantySettings;
    }
    const result = await response.json();
    return result.data ?? defaultWarrantySettings;
  } catch (error) {
    console.error('[WarrantySettingsService] Failed to fetch:', error);
    return defaultWarrantySettings;
  }
}

export async function getWarrantySettings(): Promise<WarrantySettings> {
  const now = Date.now();
  if (settingsCache && (now - cacheTimestamp) < CACHE_TTL) {
    return settingsCache;
  }
  
  const data = await fetchWarrantySettingsFromService();
  settingsCache = data;
  cacheTimestamp = now;
  return data;
}

export function getWarrantySettingsSync(): WarrantySettings {
  return settingsCache ?? defaultWarrantySettings;
}

export function invalidateWarrantySettingsCache(): void {
  settingsCache = null;
  cacheTimestamp = 0;
}

export function updateWarrantySettingsCache(settings: WarrantySettings): void {
  settingsCache = settings;
  cacheTimestamp = Date.now();
}
