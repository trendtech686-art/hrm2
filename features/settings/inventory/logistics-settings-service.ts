/**
 * Product Logistics Settings Service
 * 
 * Service layer for accessing logistics settings from Prisma database.
 */

import type { ProductLogisticsSettings, LogisticsPreset } from './types';

const API_ENDPOINT = '/api/settings/logistics';

const createPreset = (overrides: Partial<LogisticsPreset>): LogisticsPreset => ({
  weight: overrides.weight ?? 0,
  weightUnit: overrides.weightUnit ?? 'g',
  length: overrides.length ?? 0,
  width: overrides.width ?? 0,
  height: overrides.height ?? 0,
});

const clonePreset = (preset: LogisticsPreset): LogisticsPreset => ({
  weight: preset.weight,
  weightUnit: preset.weightUnit ?? 'g',
  length: preset.length,
  width: preset.width,
  height: preset.height,
});

const cloneSettings = (settings: ProductLogisticsSettings): ProductLogisticsSettings => ({
  physicalDefaults: clonePreset(settings.physicalDefaults),
  comboDefaults: clonePreset(settings.comboDefaults),
});

// Default logistics settings
export const defaultLogisticsSettings: ProductLogisticsSettings = {
  physicalDefaults: createPreset({ weight: 500, length: 30, width: 20, height: 10 }),
  comboDefaults: createPreset({ weight: 1000, length: 35, width: 25, height: 15 }),
};

// In-memory cache
let settingsCache: ProductLogisticsSettings | null = null;
let cacheTimestamp: number = 0;
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

export async function fetchLogisticsSettingsFromService(): Promise<ProductLogisticsSettings> {
  try {
    const response = await fetch(API_ENDPOINT);
    if (!response.ok) {
      return cloneSettings(defaultLogisticsSettings);
    }
    const result = await response.json();
    return result.data ? cloneSettings(result.data) : cloneSettings(defaultLogisticsSettings);
  } catch (error) {
    console.error('[LogisticsSettingsService] Failed to fetch:', error);
    return cloneSettings(defaultLogisticsSettings);
  }
}

export async function getLogisticsSettings(): Promise<ProductLogisticsSettings> {
  const now = Date.now();
  if (settingsCache && (now - cacheTimestamp) < CACHE_TTL) {
    return cloneSettings(settingsCache);
  }
  
  const data = await fetchLogisticsSettingsFromService();
  settingsCache = data;
  cacheTimestamp = now;
  return cloneSettings(data);
}

export function getLogisticsSettingsSync(): ProductLogisticsSettings {
  return settingsCache ? cloneSettings(settingsCache) : cloneSettings(defaultLogisticsSettings);
}

export function invalidateLogisticsSettingsCache(): void {
  settingsCache = null;
  cacheTimestamp = 0;
}

export function updateLogisticsSettingsCache(settings: ProductLogisticsSettings): void {
  settingsCache = cloneSettings(settings);
  cacheTimestamp = Date.now();
}

export type { ProductLogisticsSettings, LogisticsPreset };
