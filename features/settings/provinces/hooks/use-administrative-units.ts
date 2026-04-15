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
  provinces: (level?: string) => [...administrativeUnitsKeys.all, 'provinces', level] as const,
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
async function fetchProvinces(level?: string): Promise<Province[]> {
  const url = new URL(`${API_BASE}/provinces`, window.location.origin);
  if (level) url.searchParams.set('level', level);
  const res = await fetch(url.toString());
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
  if (filters?.limit != null) url.searchParams.set('limit', String(filters.limit));
  
  const res = await fetch(url.toString());
  if (!res.ok) throw new Error('Failed to fetch wards');
  const json = await res.json();
  // Wards API returns paginated format { data, pagination } without success field
  if (json.error) throw new Error(json.error);
  return json.data;
}

// React Query hooks

/**
 * Fetch provinces filtered by level
 * Defaults to '2-level' (34 provinces). Pass level: 'all' for both levels.
 * Cached for 1 hour (staleTime) and 24 hours (gcTime)
 */
export function useProvinces(options: { enabled?: boolean; level?: '2-level' | '3-level' | 'all' } = {}) {
  const { enabled = true, level = '2-level' } = options;
  const queryLevel = level === 'all' ? undefined : level;
  return useQuery({
    queryKey: administrativeUnitsKeys.provinces(queryLevel),
    queryFn: () => fetchProvinces(queryLevel),
    staleTime: 1000 * 60 * 60, // 1 hour
    gcTime: 1000 * 60 * 60 * 24, // 24 hours
    placeholderData: keepPreviousData,
    enabled,
  });
}

/**
 * Fetch districts, optionally filtered by province
 * @param provinceId - Optional province ID to filter by
 * @param options.enabled - Set to false to disable the query (lazy loading)
 */
export function useDistricts(provinceId?: string, options: { enabled?: boolean } = {}) {
  const { enabled = true } = options;
  return useQuery({
    queryKey: administrativeUnitsKeys.districts(provinceId),
    queryFn: () => fetchDistricts(provinceId),
    staleTime: 1000 * 60 * 60, // 1 hour
    gcTime: 1000 * 60 * 60 * 24, // 24 hours
    enabled,
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
  return useWards(provinceId ? { provinceId, level: '2-level', limit: 0 } : undefined);
}

/**
 * Fetch 3-level wards for a district
 */
export function useWards3Level(districtId?: number) {
  return useWards(districtId ? { districtId, level: '3-level', limit: 0 } : undefined);
}

/**
 * Combined hook for address form
 * Returns provinces, districts (filtered by province), and wards (filtered by district)
 * @param provinceId - Optional province ID to filter districts
 * @param districtId - Optional district ID to filter wards  
 * @param options.enabled - Set to false to disable all queries (lazy loading)
 */
export function useAddressData(provinceId?: string, districtId?: number, options: { enabled?: boolean } = {}) {
  const { enabled = true } = options;
  const provinces = useProvinces({ enabled });
  const districts = useDistricts(provinceId, { enabled });
  const wards = useWards(districtId ? { districtId, level: '3-level' } : provinceId ? { provinceId, level: '2-level' } : undefined);

  return {
    provinces: provinces.data ?? [],
    districts: districts.data ?? [],
    wards: wards.data ?? [],
    isLoading: provinces.isLoading || districts.isLoading || wards.isLoading,
    isError: provinces.isError || districts.isError || wards.isError,
  };
}
