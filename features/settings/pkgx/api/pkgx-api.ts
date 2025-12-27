/**
 * PKGX Settings API Layer
 * Handles PKGX integration and mapping operations
 * 
 * API Endpoints:
 * - GET/POST /api/settings/pkgx/categories - PKGX categories from database
 * - GET/POST /api/settings/pkgx/brands - PKGX brands from database
 * - GET/POST/DELETE /api/settings/pkgx/category-mappings - Category mappings
 * - GET/POST/DELETE /api/settings/pkgx/brand-mappings - Brand mappings
 * - GET/POST /api/settings/pkgx/sync-logs - Sync logs
 */

import type { PkgxCategory, PkgxBrand, PkgxCategoryMapping, PkgxBrandMapping } from '@/lib/types/prisma-extended';
import { getCategories as fetchExternalCategories, getBrands as fetchExternalBrands } from '@/lib/pkgx/api-service';

const BASE_URL = '/api/settings/pkgx';

// ========================================
// PKGX Categories (Database)
// ========================================

export async function fetchPkgxCategories(): Promise<PkgxCategory[]> {
  const res = await fetch(`${BASE_URL}/categories`);
  if (!res.ok) throw new Error('Failed to fetch PKGX categories');
  const json = await res.json();
  return json.data || [];
}

export async function syncPkgxCategories(): Promise<{ count: number }> {
  // 1. Fetch from external PKGX API
  const response = await fetchExternalCategories();
  
  if (!response.success || !response.data) {
    throw new Error(response.error || 'Failed to fetch categories from PKGX');
  }
  
  const externalCategories = response.data.data || [];
  
  // 2. Save to database
  const res = await fetch(`${BASE_URL}/categories`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ categories: externalCategories }),
  });
  if (!res.ok) throw new Error('Failed to sync categories to database');
  const json = await res.json();
  
  // 3. Log sync
  await fetch(`${BASE_URL}/sync-logs`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      syncType: 'categories',
      action: 'sync',
      status: 'success',
      itemsTotal: externalCategories.length,
      itemsSuccess: json.synced || externalCategories.length,
      itemsFailed: 0,
    }),
  });
  
  return { count: json.synced || externalCategories.length };
}

// ========================================
// PKGX Brands (Database)
// ========================================

export async function fetchPkgxBrands(): Promise<PkgxBrand[]> {
  const res = await fetch(`${BASE_URL}/brands`);
  if (!res.ok) throw new Error('Failed to fetch PKGX brands');
  const json = await res.json();
  return json.data || [];
}

export async function syncPkgxBrands(): Promise<{ count: number }> {
  // 1. Fetch from external PKGX API
  const response = await fetchExternalBrands();
  
  if (!response.success || !response.data) {
    throw new Error(response.error || 'Failed to fetch brands from PKGX');
  }
  
  const externalBrands = response.data.data || [];
  
  // 2. Save to database
  const res = await fetch(`${BASE_URL}/brands`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ brands: externalBrands }),
  });
  if (!res.ok) throw new Error('Failed to sync brands to database');
  const json = await res.json();
  
  // 3. Log sync
  await fetch(`${BASE_URL}/sync-logs`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      syncType: 'brands',
      action: 'sync',
      status: 'success',
      itemsTotal: externalBrands.length,
      itemsSuccess: json.synced || externalBrands.length,
      itemsFailed: 0,
    }),
  });
  
  return { count: json.synced || externalBrands.length };
}

// ========================================
// Category Mappings (Database)
// ========================================

export async function fetchCategoryMappings(): Promise<PkgxCategoryMapping[]> {
  const res = await fetch(`${BASE_URL}/category-mappings`);
  if (!res.ok) throw new Error('Failed to fetch category mappings');
  const json = await res.json();
  return (json.data || []).map((m: Record<string, unknown>) => ({
    id: m.systemId,
    hrmCategorySystemId: m.hrmCategoryId,
    hrmCategoryName: m.hrmCategoryName,
    pkgxCatId: m.pkgxCategoryId,
    pkgxCatName: m.pkgxCategoryName,
  }));
}

export async function saveCategoryMapping(data: PkgxCategoryMapping): Promise<PkgxCategoryMapping> {
  const res = await fetch(`${BASE_URL}/category-mappings`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      hrmCategoryId: data.hrmCategorySystemId,
      hrmCategoryName: data.hrmCategoryName,
      pkgxCategoryId: data.pkgxCatId,
      pkgxCategoryName: data.pkgxCatName,
    }),
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || 'Failed to save category mapping');
  }
  const json = await res.json();
  const m = json.data;
  return {
    id: m.systemId,
    hrmCategorySystemId: m.hrmCategoryId,
    hrmCategoryName: m.hrmCategoryName,
    pkgxCatId: m.pkgxCategoryId,
    pkgxCatName: m.pkgxCategoryName,
  };
}

export async function deleteCategoryMapping(id: string): Promise<void> {
  const res = await fetch(`${BASE_URL}/category-mappings?systemId=${encodeURIComponent(id)}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Failed to delete category mapping');
}

// ========================================
// Brand Mappings (Database)
// ========================================

export async function fetchBrandMappings(): Promise<PkgxBrandMapping[]> {
  const res = await fetch(`${BASE_URL}/brand-mappings`);
  if (!res.ok) throw new Error('Failed to fetch brand mappings');
  const json = await res.json();
  return (json.data || []).map((m: Record<string, unknown>) => ({
    id: m.systemId,
    hrmBrandSystemId: m.hrmBrandId,
    hrmBrandName: m.hrmBrandName,
    pkgxBrandId: m.pkgxBrandId,
    pkgxBrandName: m.pkgxBrandName,
  }));
}

export async function saveBrandMapping(data: PkgxBrandMapping): Promise<PkgxBrandMapping> {
  const res = await fetch(`${BASE_URL}/brand-mappings`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      hrmBrandId: data.hrmBrandSystemId,
      hrmBrandName: data.hrmBrandName,
      pkgxBrandId: data.pkgxBrandId,
      pkgxBrandName: data.pkgxBrandName,
    }),
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || 'Failed to save brand mapping');
  }
  const json = await res.json();
  const m = json.data;
  return {
    id: m.systemId,
    hrmBrandSystemId: m.hrmBrandId,
    hrmBrandName: m.hrmBrandName,
    pkgxBrandId: m.pkgxBrandId,
    pkgxBrandName: m.pkgxBrandName,
  };
}

export async function deleteBrandMapping(id: string): Promise<void> {
  const res = await fetch(`${BASE_URL}/brand-mappings?systemId=${encodeURIComponent(id)}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Failed to delete brand mapping');
}

// ========================================
// Product Sync Operations
// ========================================

export async function syncProductToPkgx(productSystemId: string): Promise<{ success: boolean; pkgxId?: number }> {
  const res = await fetch(`${BASE_URL}/products/${productSystemId}/sync`, { method: 'POST' });
  if (!res.ok) throw new Error('Failed to sync product');
  return res.json();
}

export async function bulkSyncProductsToPkgx(productSystemIds: string[]): Promise<{ success: number; failed: number }> {
  const res = await fetch(`${BASE_URL}/products/bulk-sync`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ productSystemIds }),
  });
  if (!res.ok) throw new Error('Failed to bulk sync products');
  return res.json();
}

// ========================================
// Sync Logs
// ========================================

export async function fetchSyncLogs(limit = 50): Promise<Array<{ syncType: string; action: string; status: string; syncedAt: string }>> {
  const res = await fetch(`${BASE_URL}/sync-logs?limit=${limit}`);
  if (!res.ok) throw new Error('Failed to fetch sync logs');
  const json = await res.json();
  return json.data || [];
}
