/**
 * React Query hooks for Administrative Units (Provinces, Districts, Wards)
 * 
 * Fetches data from database via API instead of static files.
 * This reduces bundle size by ~3MB and enables server-side caching.
 */

'use client';

import { useQuery, keepPreviousData } from '@tanstack/react-query';
import type { Province, District, Ward } from '@/lib/types/prisma-extended';

const API_BASE = '/api/administrative-units';

// Query keys
export const administrativeUnitsKeys = {
  all: ['administrative-units'] as const,
  provinces: () => [...administrativeUnitsKeys.all, 'provinces'] as const,
  districts: (provinceId?: string) => [...administrativeUnitsKeys.all, 'districts', provinceId] as const,
  wards: (filters?: { provinceId?: string; districtId?: number; level?: string }) => 
    [...administrativeUnitsKeys.all, 'wards', filters] as const,
};

// API response types
type ApiResponse<T> = {
  success: boolean;
  data: T;
  count: number;
  error?: string;
};

// Fetch functions
async function fetchProvinces(): Promise<Province[]> {
  const res = await fetch(`${API_BASE}/provinces`);
  if (!res.ok) throw new Error('Failed to fetch provinces');
  const json: ApiResponse<Province[]> = await res.json();
  if (!json.success) throw new Error(json.error || 'Failed to fetch provinces');
  return json.data;
}

async function fetchDistricts(provinceId?: string): Promise<District[]> {
  const url = new URL(`${API_BASE}/districts`, window.location.origin);
  if (provinceId) url.searchParams.set('provinceId', provinceId);
  
  const res = await fetch(url.toString());
  if (!res.ok) throw new Error('Failed to fetch districts');
  const json: ApiResponse<District[]> = await res.json();
  if (!json.success) throw new Error(json.error || 'Failed to fetch districts');
  return json.data;
}

async function fetchWards(filters?: { 
  provinceId?: string; 
  districtId?: number; 
  level?: string;
  limit?: number;
}): Promise<Ward[]> {
  const url = new URL(`${API_BASE}/wards`, window.location.origin);
  if (filters?.provinceId) url.searchParams.set('provinceId', filters.provinceId);
  if (filters?.districtId) url.searchParams.set('districtId', String(filters.districtId));
  if (filters?.level) url.searchParams.set('level', filters.level);
  if (filters?.limit) url.searchParams.set('limit', String(filters.limit));
  
  const res = await fetch(url.toString());
  if (!res.ok) throw new Error('Failed to fetch wards');
  const json: ApiResponse<Ward[]> = await res.json();
  if (!json.success) throw new Error(json.error || 'Failed to fetch wards');
  return json.data;
}

// React Query hooks

/**
 * Fetch all provinces (34 provinces)
 * Cached for 1 hour (staleTime) and 24 hours (gcTime)
 */
export function useProvinces() {
  return useQuery({
    queryKey: administrativeUnitsKeys.provinces(),
    queryFn: fetchProvinces,
    staleTime: 1000 * 60 * 60, // 1 hour
    gcTime: 1000 * 60 * 60 * 24, // 24 hours
    placeholderData: keepPreviousData,
  });
}

/**
 * Fetch districts, optionally filtered by province
 * @param provinceId - Optional province ID to filter by
 */
export function useDistricts(provinceId?: string) {
  return useQuery({
    queryKey: administrativeUnitsKeys.districts(provinceId),
    queryFn: () => fetchDistricts(provinceId),
    staleTime: 1000 * 60 * 60, // 1 hour
    gcTime: 1000 * 60 * 60 * 24, // 24 hours
    enabled: provinceId !== undefined || true, // Always enabled, but filters when provinceId provided
    placeholderData: keepPreviousData,
  });
}

/**
 * Fetch wards with filters
 * @param filters - Optional filters (provinceId, districtId, level, limit)
 */
export function useWards(filters?: { 
  provinceId?: string; 
  districtId?: number; 
  level?: '2-level' | '3-level';
  limit?: number;
}) {
  return useQuery({
    queryKey: administrativeUnitsKeys.wards(filters),
    queryFn: () => fetchWards(filters),
    staleTime: 1000 * 60 * 60, // 1 hour
    gcTime: 1000 * 60 * 60 * 24, // 24 hours
    // Only fetch when we have a province or district filter (to avoid loading 10k+ records)
    enabled: !!(filters?.provinceId || filters?.districtId),
    placeholderData: keepPreviousData,
  });
}

/**
 * Fetch 2-level wards for a province
 */
export function useWards2Level(provinceId?: string) {
  return useWards(provinceId ? { provinceId, level: '2-level' } : undefined);
}

/**
 * Fetch 3-level wards for a district
 */
export function useWards3Level(districtId?: number) {
  return useWards(districtId ? { districtId, level: '3-level' } : undefined);
}

/**
 * Combined hook for address form
 * Returns provinces, districts (filtered by province), and wards (filtered by district)
 */
export function useAddressData(provinceId?: string, districtId?: number) {
  const provinces = useProvinces();
  const districts = useDistricts(provinceId);
  const wards = useWards(districtId ? { districtId, level: '3-level' } : provinceId ? { provinceId, level: '2-level' } : undefined);

  return {
    provinces: provinces.data ?? [],
    districts: districts.data ?? [],
    wards: wards.data ?? [],
    isLoading: provinces.isLoading || districts.isLoading || wards.isLoading,
    isError: provinces.isError || districts.isError || wards.isError,
  };
}
