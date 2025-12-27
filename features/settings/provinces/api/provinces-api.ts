/**
 * Provinces API Layer
 * Handles all province, district, ward-related API calls
 */

import type { Province, District, Ward } from '@/lib/types/prisma-extended';

export interface ProvinceFilters {
  page?: number;
  limit?: number;
  search?: string;
}

export interface DistrictFilters {
  page?: number;
  limit?: number;
  provinceId?: string;
  search?: string;
}

export interface WardFilters {
  page?: number;
  limit?: number;
  provinceId?: string;
  districtId?: number;
  level?: string;
  search?: string;
}

export interface LocationResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

const BASE_URL = '/api/settings/locations';

// ============== Province API ==============

export async function fetchProvinces(
  filters: ProvinceFilters = {}
): Promise<LocationResponse<Province>> {
  const params = new URLSearchParams();
  if (filters.page) params.set('page', String(filters.page));
  if (filters.limit) params.set('limit', String(filters.limit));
  if (filters.search) params.set('search', filters.search);

  const url = params.toString() ? `${BASE_URL}/provinces?${params}` : `${BASE_URL}/provinces`;
  const response = await fetch(url);
  
  if (!response.ok) throw new Error('Failed to fetch provinces');
  return response.json();
}

export async function fetchProvinceById(systemId: string): Promise<Province> {
  const response = await fetch(`${BASE_URL}/provinces/${systemId}`);
  if (!response.ok) throw new Error('Failed to fetch province');
  return response.json();
}

export async function fetchAllProvinces(): Promise<Province[]> {
  const response = await fetchProvinces({ limit: 100 });
  return response.data;
}

// ============== District API ==============

export async function fetchDistricts(
  filters: DistrictFilters = {}
): Promise<LocationResponse<District>> {
  const params = new URLSearchParams();
  if (filters.page) params.set('page', String(filters.page));
  if (filters.limit) params.set('limit', String(filters.limit));
  if (filters.provinceId) params.set('provinceId', filters.provinceId);
  if (filters.search) params.set('search', filters.search);

  const url = params.toString() ? `${BASE_URL}/districts?${params}` : `${BASE_URL}/districts`;
  const response = await fetch(url);
  
  if (!response.ok) throw new Error('Failed to fetch districts');
  return response.json();
}

export async function fetchDistrictsByProvince(provinceId: string): Promise<District[]> {
  const response = await fetchDistricts({ provinceId, limit: 100 });
  return response.data;
}

// ============== Ward API ==============

export async function fetchWards(
  filters: WardFilters = {}
): Promise<LocationResponse<Ward>> {
  const params = new URLSearchParams();
  if (filters.page) params.set('page', String(filters.page));
  if (filters.limit) params.set('limit', String(filters.limit));
  if (filters.provinceId) params.set('provinceId', filters.provinceId);
  if (filters.districtId) params.set('districtId', String(filters.districtId));
  if (filters.level) params.set('level', filters.level);
  if (filters.search) params.set('search', filters.search);

  const url = params.toString() ? `${BASE_URL}/wards?${params}` : `${BASE_URL}/wards`;
  const response = await fetch(url);
  
  if (!response.ok) throw new Error('Failed to fetch wards');
  return response.json();
}

export async function fetchWardsByDistrict(districtId: number): Promise<Ward[]> {
  const response = await fetchWards({ districtId, limit: 500 });
  return response.data;
}

export async function fetchWardsByProvince(provinceId: string): Promise<Ward[]> {
  const response = await fetchWards({ provinceId, limit: 500 });
  return response.data;
}

export async function fetchAllWards(): Promise<Ward[]> {
  const response = await fetchWards({ limit: 2000 });
  return response.data;
}

// ============== Province Mutations ==============

export async function createProvince(data: Omit<Province, 'systemId'>): Promise<Province> {
  const response = await fetch(`${BASE_URL}/provinces`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error('Failed to create province');
  return response.json();
}

export async function updateProvince(systemId: string, data: Partial<Province>): Promise<Province> {
  const response = await fetch(`${BASE_URL}/provinces/${systemId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error('Failed to update province');
  return response.json();
}

export async function deleteProvince(systemId: string): Promise<void> {
  const response = await fetch(`${BASE_URL}/provinces/${systemId}`, {
    method: 'DELETE',
  });
  if (!response.ok) throw new Error('Failed to delete province');
}

// ============== District Mutations ==============

export async function createDistrict(data: Omit<District, 'systemId'>): Promise<District> {
  const response = await fetch(`${BASE_URL}/districts`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error('Failed to create district');
  return response.json();
}

export async function updateDistrict(systemId: string, data: Partial<District>): Promise<District> {
  const response = await fetch(`${BASE_URL}/districts/${systemId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error('Failed to update district');
  return response.json();
}

export async function deleteDistrict(systemId: string): Promise<void> {
  const response = await fetch(`${BASE_URL}/districts/${systemId}`, {
    method: 'DELETE',
  });
  if (!response.ok) throw new Error('Failed to delete district');
}

// ============== Ward Mutations ==============

export async function createWard(data: Omit<Ward, 'systemId'>): Promise<Ward> {
  const response = await fetch(`${BASE_URL}/wards`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error('Failed to create ward');
  return response.json();
}

export async function updateWard(systemId: string, data: Partial<Ward>): Promise<Ward> {
  const response = await fetch(`${BASE_URL}/wards/${systemId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error('Failed to update ward');
  return response.json();
}

export async function deleteWard(systemId: string): Promise<void> {
  const response = await fetch(`${BASE_URL}/wards/${systemId}`, {
    method: 'DELETE',
  });
  if (!response.ok) throw new Error('Failed to delete ward');
}

// ============== Bulk Import ==============

export type AdministrativeImportPayload = {
  provinces: Array<Omit<Province, 'systemId'>>;
  wards: Array<Omit<Ward, 'systemId'>>;
};

export async function importAdministrativeUnits(payload: AdministrativeImportPayload): Promise<void> {
  const response = await fetch(`${BASE_URL}/import`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!response.ok) throw new Error('Failed to import administrative units');
}
