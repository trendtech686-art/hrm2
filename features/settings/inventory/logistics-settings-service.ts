/**
 * Product Logistics Settings Service
 * 
 * Provides default values and cache helpers for logistics settings.
 * Actual data fetching is handled by React Query hooks in use-logistics-settings.ts
 */

import type { ProductLogisticsSettings, LogisticsPreset } from './types';

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

// Cache used by React Query mutation callbacks
let _settingsCache: ProductLogisticsSettings | null = null;

export function invalidateLogisticsSettingsCache(): void {
  _settingsCache = null;
}

export function updateLogisticsSettingsCache(settings: ProductLogisticsSettings): void {
  _settingsCache = cloneSettings(settings);
}

export type { ProductLogisticsSettings, LogisticsPreset };
