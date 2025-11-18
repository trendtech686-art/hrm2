/**
 * Address Level Mapper
 * Converts between 2-level (Province → Ward) and 3-level (Province → District → Ward) formats
 * for shipping API compatibility
 */

import type { Province, Ward } from '@/features/provinces/types';

export type Address3Level = {
  provinceId: number;
  provinceName: string;
  districtId: number;
  districtName: string;
  wardCode: string;
  wardName: string;
};

/**
 * Maps 2-level address (Province + Ward) to 3-level format required by shipping APIs
 * Uses simple mapping: districtId = provinceId (same value)
 * 
 * Note: This is a temporary solution. In Vietnam's 2025 administrative reform,
 * the district level was removed. However, shipping APIs still require 3-level structure.
 * We map district to province for compatibility.
 */
export function mapTo3Level(
  province: Province,
  ward: Ward
): Address3Level {
  const provinceIdNum = parseInt(province.id, 10);
  
  return {
    provinceId: provinceIdNum,
    provinceName: province.name,
    districtId: provinceIdNum, // Map district to province (same ID)
    districtName: province.name, // Use province name as district name
    wardCode: ward.id,
    wardName: ward.name
  };
}

/**
 * Validates if province and ward IDs are compatible
 */
export function validateAddress(province: Province, ward: Ward): {
  valid: boolean;
  error?: string;
} {
  if (!ward.provinceId || ward.provinceId !== province.id) {
    return {
      valid: false,
      error: `Ward ${ward.name} does not belong to province ${province.name}`
    };
  }
  
  return { valid: true };
}

/**
 * Format address string for display
 */
export function formatAddress(
  street: string,
  ward: Ward,
  province: Province
): string {
  return `${street}, ${ward.name}, ${province.name}`;
}

/**
 * Parse numeric IDs from string format
 */
export function parseNumericId(id: string): number {
  const num = parseInt(id, 10);
  if (isNaN(num)) {
    throw new Error(`Invalid ID format: ${id}`);
  }
  return num;
}
