/**
 * Global Settings Service - Client Side
 * Cache and type definitions for global application settings
 * 
 * NOTE: This file is safe to import in client components
 * Server-side database operations are handled via API routes
 * 
 * @module features/settings/global/global-settings-service
 */

export interface GlobalSettings {
  /** Số dòng mỗi trang mặc định cho tất cả data tables */
  defaultPageSize: number;
  /** Các option page size cho dropdown */
  pageSizeOptions: number[];
}

export const defaultGlobalSettings: GlobalSettings = {
  defaultPageSize: 20,
  pageSizeOptions: [5, 10, 20, 50, 100],
};

// ============================================
// CACHE FOR SYNC ACCESS (Client-safe)
// ============================================
let settingsCache: GlobalSettings | null = null;
let cacheTimestamp: number = 0;
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

function isCacheValid(): boolean {
  return settingsCache !== null && (Date.now() - cacheTimestamp) < CACHE_TTL;
}

export function updateGlobalSettingsCache(settings: GlobalSettings): void {
  settingsCache = settings;
  cacheTimestamp = Date.now();
}

export function invalidateGlobalSettingsCache(): void {
  settingsCache = null;
  cacheTimestamp = 0;
}

/**
 * Sync access to global settings for non-React contexts
 * Returns cached settings or defaults if cache is empty
 */
export function getGlobalSettingsSync(): GlobalSettings {
  if (isCacheValid() && settingsCache) {
    return settingsCache;
  }
  return defaultGlobalSettings;
}
