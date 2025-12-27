/**
 * Trendtech Settings API Layer
 */

import type { TrendtechSettings, TrendtechCategory, TrendtechBrand, TrendtechCategoryMapping, TrendtechBrandMapping, TrendtechSyncResult } from '@/lib/trendtech/types';

const BASE_URL = '/api/settings/trendtech';

// Settings
export async function fetchTrendtechSettings(): Promise<TrendtechSettings> {
  const res = await fetch(BASE_URL);
  if (!res.ok) throw new Error('Failed to fetch');
  return res.json();
}

export async function updateTrendtechSettings(data: Partial<TrendtechSettings>): Promise<TrendtechSettings> {
  const res = await fetch(BASE_URL, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
  if (!res.ok) throw new Error('Failed to update');
  return res.json();
}

// Categories
export async function fetchTrendtechCategories(): Promise<TrendtechCategory[]> {
  const res = await fetch(`${BASE_URL}/categories`);
  if (!res.ok) throw new Error('Failed to fetch');
  return res.json();
}

export async function syncTrendtechCategories(): Promise<{ count: number }> {
  const res = await fetch(`${BASE_URL}/categories/sync`, { method: 'POST' });
  if (!res.ok) throw new Error('Failed to sync');
  return res.json();
}

// Brands
export async function fetchTrendtechBrands(): Promise<TrendtechBrand[]> {
  const res = await fetch(`${BASE_URL}/brands`);
  if (!res.ok) throw new Error('Failed to fetch');
  return res.json();
}

export async function syncTrendtechBrands(): Promise<{ count: number }> {
  const res = await fetch(`${BASE_URL}/brands/sync`, { method: 'POST' });
  if (!res.ok) throw new Error('Failed to sync');
  return res.json();
}

// Mappings
export async function fetchCategoryMappings(): Promise<TrendtechCategoryMapping[]> {
  const res = await fetch(`${BASE_URL}/mappings/categories`);
  if (!res.ok) throw new Error('Failed to fetch');
  return res.json();
}

export async function saveCategoryMapping(data: TrendtechCategoryMapping): Promise<TrendtechCategoryMapping> {
  const res = await fetch(`${BASE_URL}/mappings/categories`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
  if (!res.ok) throw new Error('Failed to save');
  return res.json();
}

export async function deleteCategoryMapping(id: string): Promise<void> {
  const res = await fetch(`${BASE_URL}/mappings/categories/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete');
}

export async function fetchBrandMappings(): Promise<TrendtechBrandMapping[]> {
  const res = await fetch(`${BASE_URL}/mappings/brands`);
  if (!res.ok) throw new Error('Failed to fetch');
  return res.json();
}

export async function saveBrandMapping(data: TrendtechBrandMapping): Promise<TrendtechBrandMapping> {
  const res = await fetch(`${BASE_URL}/mappings/brands`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
  if (!res.ok) throw new Error('Failed to save');
  return res.json();
}

export async function deleteBrandMapping(id: string): Promise<void> {
  const res = await fetch(`${BASE_URL}/mappings/brands/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete');
}

// Sync
export async function syncProductToTrendtech(productSystemId: string): Promise<TrendtechSyncResult> {
  const res = await fetch(`${BASE_URL}/products/${productSystemId}/sync`, { method: 'POST' });
  if (!res.ok) throw new Error('Failed to sync');
  return res.json();
}

export async function bulkSyncToTrendtech(productSystemIds: string[]): Promise<{ success: number; failed: number }> {
  const res = await fetch(`${BASE_URL}/products/bulk-sync`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ productSystemIds }) });
  if (!res.ok) throw new Error('Failed to sync');
  return res.json();
}
