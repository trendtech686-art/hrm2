/**
 * Store Info Service
 * 
 * Service layer for accessing store info from Prisma database.
 * This is used by non-React files (services, lib functions) that cannot use hooks.
 * 
 * For React components, use the hooks from './hooks/use-store-info' instead.
 */

import type { StoreGeneralInfo } from './types';
import { defaultStoreInfo } from './types';
import { logError } from '@/lib/logger'

const API_ENDPOINT = '/api/settings/store-info';

// In-memory cache
let infoCache: StoreGeneralInfo | null = null;
let cacheTimestamp: number = 0;
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

export async function fetchStoreInfoFromService(): Promise<StoreGeneralInfo> {
  try {
    const response = await fetch(API_ENDPOINT);
    if (!response.ok) {
      return defaultStoreInfo;
    }
    const result = await response.json();
    return result.data ?? defaultStoreInfo;
  } catch (error) {
    logError('[StoreInfoService] Failed to fetch', error);
    return defaultStoreInfo;
  }
}

export async function getStoreInfo(): Promise<StoreGeneralInfo> {
  const now = Date.now();
  if (infoCache && (now - cacheTimestamp) < CACHE_TTL) {
    return infoCache;
  }
  
  const data = await fetchStoreInfoFromService();
  infoCache = data;
  cacheTimestamp = now;
  return data;
}

export function getStoreInfoSync(): StoreGeneralInfo {
  return infoCache ?? defaultStoreInfo;
}

export function invalidateStoreInfoCache(): void {
  infoCache = null;
  cacheTimestamp = 0;
}

export function updateStoreInfoCache(info: StoreGeneralInfo): void {
  infoCache = info;
  cacheTimestamp = Date.now();
}

export { defaultStoreInfo };
export type { StoreGeneralInfo };
