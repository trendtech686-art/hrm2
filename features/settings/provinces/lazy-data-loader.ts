/**
 * Lazy Data Loader for Provinces
 * 
 * Loads large data files (2.3MB+) on-demand instead of at module initialization.
 * This significantly reduces initial compile time and bundle size.
 */

import { asSystemId, asBusinessId, type SystemId, type BusinessId } from '@/lib/id-types';
import type { Province, District, Ward } from '@/lib/types/prisma-extended';

// Cache for loaded data
let wardsCache: {
  wards2Level: Ward[] | null;
  wards3Level: Ward[] | null;
  districts: District[] | null;
  provinces: Province[] | null;
} = {
  wards2Level: null,
  wards3Level: null,
  districts: null,
  provinces: null,
};

/**
 * Load provinces data (small file, ~5KB)
 */
export async function loadProvinces(): Promise<Province[]> {
  if (wardsCache.provinces) return wardsCache.provinces;
  
  const { PROVINCES_DATA } = await import('./provinces-data');
  wardsCache.provinces = PROVINCES_DATA.map((p) => ({ ...p }));
  return wardsCache.provinces;
}

/**
 * Load provinces data synchronously (for initial state)
 */
export function loadProvincesSync(): Province[] {
  if (wardsCache.provinces) return wardsCache.provinces;
  
  // Fallback to sync import for initial state - provinces-data is small
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { PROVINCES_DATA } = require('./provinces-data');
  wardsCache.provinces = PROVINCES_DATA.map((p: Province) => ({ ...p }));
  return wardsCache.provinces;
}

/**
 * Load districts data (~70KB)
 */
export async function loadDistricts(): Promise<District[]> {
  if (wardsCache.districts) return wardsCache.districts;
  
  const { DISTRICTS_DATA } = await import('./districts-data');
  wardsCache.districts = DISTRICTS_DATA.map((district) => ({
    ...district,
    systemId: asSystemId(district.systemId),
    provinceId: asBusinessId(district.provinceId),
  }));
  return wardsCache.districts;
}

/**
 * Load 2-level wards data (~600KB) - lazy
 */
export async function loadWards2Level(): Promise<Ward[]> {
  if (wardsCache.wards2Level) return wardsCache.wards2Level;
  
  const { WARDS_2LEVEL_DATA } = await import('./wards-2level-data');
  wardsCache.wards2Level = WARDS_2LEVEL_DATA.map((ward) => ({
    systemId: asSystemId(ward.systemId),
    id: ward.id,
    name: ward.name,
    provinceId: asBusinessId(ward.provinceId),
    provinceName: ward.provinceName,
    level: '2-level' as const,
  }));
  return wardsCache.wards2Level;
}

/**
 * Load 3-level wards data (~2.3MB) - lazy
 */
export async function loadWards3Level(): Promise<Ward[]> {
  if (wardsCache.wards3Level) return wardsCache.wards3Level;
  
  const { WARDS_3LEVEL_DATA } = await import('./wards-3level-data');
  wardsCache.wards3Level = WARDS_3LEVEL_DATA.map((ward) => ({
    systemId: asSystemId(ward.systemId),
    id: ward.id,
    name: ward.name,
    provinceId: asBusinessId(ward.provinceId),
    provinceName: ward.provinceName,
    districtId: ward.districtId,
    districtName: ward.districtName,
    level: '3-level' as const,
  }));
  return wardsCache.wards3Level;
}

/**
 * Load all wards (combined 2-level + 3-level)
 */
export async function loadAllWards(): Promise<Ward[]> {
  const [wards2, wards3] = await Promise.all([
    loadWards2Level(),
    loadWards3Level(),
  ]);
  return [...wards2, ...wards3];
}

/**
 * Load all data at once
 */
export async function loadAllData(): Promise<{
  provinces: Province[];
  districts: District[];
  wards: Ward[];
}> {
  const [provinces, districts, wards] = await Promise.all([
    loadProvinces(),
    loadDistricts(),
    loadAllWards(),
  ]);
  return { provinces, districts, wards };
}

/**
 * Clear cache (useful for testing or memory management)
 */
export function clearCache(): void {
  wardsCache = {
    wards2Level: null,
    wards3Level: null,
    districts: null,
    provinces: null,
  };
}

/**
 * Check if data is loaded
 */
export function isDataLoaded(): {
  provinces: boolean;
  districts: boolean;
  wards2Level: boolean;
  wards3Level: boolean;
} {
  return {
    provinces: wardsCache.provinces !== null,
    districts: wardsCache.districts !== null,
    wards2Level: wardsCache.wards2Level !== null,
    wards3Level: wardsCache.wards3Level !== null,
  };
}
