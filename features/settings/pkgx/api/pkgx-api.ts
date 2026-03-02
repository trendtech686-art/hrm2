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

import type { PkgxCategory, PkgxBrand, PkgxCategoryMapping, PkgxBrandMapping, PkgxSettings } from '@/lib/types/prisma-extended';
import { getCategories as fetchExternalCategories, getBrands as fetchExternalBrands } from '@/lib/pkgx/api-service';

const BASE_URL = '/api/settings/pkgx';

// Helper to get PKGX settings
async function getPkgxSettings(): Promise<PkgxSettings> {
  const res = await fetch('/api/pkgx/settings');
  const json = await res.json();
  return json.data || {};
}

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
  // 0. Get settings first
  const settings = await getPkgxSettings();
  
  // 1. Fetch from external PKGX API
  const response = await fetchExternalCategories(settings);
  
  if (!response.success || !response.data) {
    throw new Error(response.error || 'Failed to fetch categories from PKGX');
  }
  
  const externalCategories = response.data.data || [];
  
  // 2. Transform from PKGX API format to HRM format
  const transformedCategories = externalCategories.map((cat) => ({
    id: cat.cat_id,
    name: cat.cat_name,
    parentId: cat.parent_id || null,
    sortOrder: cat.sort_order || 0,
    isShow: cat.is_show ?? 1,
    catDesc: cat.cat_desc,
    longDesc: cat.long_desc,
    keywords: cat.keywords,
    metaTitle: cat.meta_title,
    metaDesc: cat.meta_desc,
    catAlias: cat.cat_alias,
    style: cat.style,
    grade: cat.grade,
    filterAttr: cat.filter_attr,
  }));
  
  // 3. Save to database
  const res = await fetch(`${BASE_URL}/categories`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ categories: transformedCategories }),
  });
  if (!res.ok) {
    const errorJson = await res.json().catch(() => ({}));
    throw new Error(errorJson.error || 'Failed to sync categories to database');
  }
  const json = await res.json();
  
  // 4. Log sync
  await fetch(`${BASE_URL}/sync-logs`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      syncType: 'categories',
      action: 'sync',
      status: 'success',
      itemsTotal: transformedCategories.length,
      itemsSuccess: json.synced || transformedCategories.length,
      itemsFailed: 0,
    }),
  });
  
  return { count: json.synced || transformedCategories.length };
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
  // 0. Get settings first
  const settings = await getPkgxSettings();
  
  // 1. Fetch from external PKGX API
  const response = await fetchExternalBrands(settings);
  
  if (!response.success || !response.data) {
    throw new Error(response.error || 'Failed to fetch brands from PKGX');
  }
  
  const externalBrands = response.data.data || [];
  
  // 2. Transform from PKGX API format to HRM format
  const transformedBrands = externalBrands.map((brand) => ({
    id: brand.brand_id,
    name: brand.brand_name,
    logo: brand.brand_logo,
    description: brand.brand_desc,
    siteUrl: brand.site_url,
    sortOrder: brand.sort_order || 0,
    isShow: brand.is_show ?? 1,
    keywords: brand.keywords,
    metaTitle: brand.meta_title,
    metaDesc: brand.meta_desc,
    shortDescription: brand.short_desc,
    longDescription: brand.long_desc,
  }));
  
  // 3. Save to database
  const res = await fetch(`${BASE_URL}/brands`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ brands: transformedBrands }),
  });
  if (!res.ok) {
    const errorJson = await res.json().catch(() => ({}));
    throw new Error(errorJson.error || 'Failed to sync brands to database');
  }
  const json = await res.json();
  
  // 4. Log sync
  await fetch(`${BASE_URL}/sync-logs`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      syncType: 'brands',
      action: 'sync',
      status: 'success',
      itemsTotal: transformedBrands.length,
      itemsSuccess: json.synced || transformedBrands.length,
      itemsFailed: 0,
    }),
  });
  
  return { count: json.synced || transformedBrands.length };
}

// ========================================
// Category Mappings (Database)
// ========================================

export async function fetchCategoryMappings(): Promise<PkgxCategoryMapping[]> {
  const res = await fetch(`${BASE_URL}/category-mappings`);
  if (!res.ok) throw new Error('Failed to fetch category mappings');
  const json = await res.json();
  return (json.data || []).map((m: Record<string, unknown>) => ({
    systemId: m.systemId as string,
    id: m.systemId as string, // Alias for backward compat
    hrmCategoryId: m.hrmCategoryId as string,
    hrmCategorySystemId: m.hrmCategoryId as string, // Alias for backward compat
    hrmCategoryName: m.hrmCategoryName as string,
    pkgxCategoryId: m.pkgxCategoryId as number,
    pkgxCatId: m.pkgxCategoryId as number, // Alias for backward compat
    pkgxCategoryName: m.pkgxCategoryName as string,
  }));
}

export async function saveCategoryMapping(data: PkgxCategoryMapping): Promise<PkgxCategoryMapping> {
  const res = await fetch(`${BASE_URL}/category-mappings`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      hrmCategoryId: data.hrmCategoryId || data.hrmCategorySystemId,
      hrmCategoryName: data.hrmCategoryName,
      pkgxCategoryId: data.pkgxCategoryId || data.pkgxCatId,
      pkgxCategoryName: data.pkgxCategoryName,
    }),
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || 'Failed to save category mapping');
  }
  const json = await res.json();
  const m = json.data;
  return {
    systemId: m.systemId,
    id: m.systemId, // Alias
    hrmCategoryId: m.hrmCategoryId,
    hrmCategorySystemId: m.hrmCategoryId, // Alias
    hrmCategoryName: m.hrmCategoryName,
    pkgxCategoryId: m.pkgxCategoryId,
    pkgxCatId: m.pkgxCategoryId, // Alias
    pkgxCategoryName: m.pkgxCategoryName,
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
    systemId: m.systemId as string,
    id: m.systemId as string, // Alias for backward compat
    hrmBrandId: m.hrmBrandId as string,
    hrmBrandSystemId: m.hrmBrandId as string, // Alias for backward compat
    hrmBrandName: m.hrmBrandName as string,
    pkgxBrandId: m.pkgxBrandId as number,
    pkgxBrandName: m.pkgxBrandName as string,
  }));
}

export async function saveBrandMapping(data: PkgxBrandMapping): Promise<PkgxBrandMapping> {
  const res = await fetch(`${BASE_URL}/brand-mappings`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      hrmBrandId: data.hrmBrandId || data.hrmBrandSystemId,
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
    systemId: m.systemId,
    id: m.systemId, // Alias
    hrmBrandId: m.hrmBrandId,
    hrmBrandSystemId: m.hrmBrandId, // Alias
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
