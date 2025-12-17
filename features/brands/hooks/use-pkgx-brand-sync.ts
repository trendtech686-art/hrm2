/**
 * Hook chứa tất cả các handlers để đồng bộ thương hiệu (Brand) với PKGX
 * Tương tự như use-pkgx-sync.ts của products
 */
import React from 'react';
import { toast } from 'sonner';
import type { Brand } from '@/features/settings/inventory/types';
import { updateBrand } from '@/lib/pkgx/api-service';
import { usePkgxSettingsStore } from '@/features/settings/pkgx/store';

// Types
type PkgxLogEntry = {
  action: 
    | 'sync_brand_seo'
    | 'sync_brand_description'
    | 'sync_brand_all';
  status: 'success' | 'error' | 'partial' | 'info';
  message: string;
  details?: Record<string, unknown>;
};

type UsePkgxBrandSyncOptions = {
  addPkgxLog?: (entry: PkgxLogEntry) => void;
};

/**
 * Lấy pkgxBrandId từ brand mapping
 */
function getPkgxBrandId(brand: Brand, brandMappings?: Array<{ hrmBrandSystemId: string; pkgxBrandId: number }>) {
  if (!brandMappings) return undefined;
  const mapping = brandMappings.find(m => m.hrmBrandSystemId === brand.systemId);
  return mapping?.pkgxBrandId;
}

/**
 * Hook cung cấp các handlers để đồng bộ Brand với PKGX
 */
export function usePkgxBrandSync({ addPkgxLog }: UsePkgxBrandSyncOptions = {}) {
  const { settings: pkgxSettings } = usePkgxSettingsStore();

  // Default log function if not provided
  const logAction = React.useCallback((entry: PkgxLogEntry) => {
    if (addPkgxLog) {
      addPkgxLog(entry);
    }
    console.log('[PKGX Brand Sync]', entry.action, entry.status, entry.message);
  }, [addPkgxLog]);

  // ═══════════════════════════════════════════════════════════════
  // 1. SYNC SEO (keywords, meta_title, meta_desc)
  // ═══════════════════════════════════════════════════════════════
  const handleSyncSeo = React.useCallback(async (brand: Brand) => {
    const pkgxBrandId = getPkgxBrandId(brand, pkgxSettings?.brandMappings);
    
    if (!pkgxBrandId) {
      toast.error('Thương hiệu chưa được liên kết với PKGX. Vui lòng mapping trong Cài đặt > PKGX.');
      return;
    }
    
    toast.loading(`Đang đồng bộ SEO thương hiệu...`, { id: 'pkgx-brand-sync-seo' });
    
    try {
      const pkgxSeo = brand.websiteSeo?.pkgx;
      // Fallback chain: SEO PKGX → SEO Chung → name
      const seoPayload = {
        keywords: pkgxSeo?.seoKeywords || brand.seoKeywords || brand.name,
        meta_title: pkgxSeo?.seoTitle || brand.seoTitle || brand.name,
        meta_desc: pkgxSeo?.metaDescription || brand.metaDescription || '',
        short_desc: pkgxSeo?.shortDescription || brand.shortDescription || '',
      };
      
      // DEBUG
      console.log('[PKGX Brand SEO Sync] Brand:', brand.name);
      console.log('[PKGX Brand SEO Sync] websiteSeo.pkgx:', pkgxSeo);
      console.log('[PKGX Brand SEO Sync] SEO Chung - seoKeywords:', brand.seoKeywords);
      console.log('[PKGX Brand SEO Sync] Payload:', seoPayload);
      
      const response = await updateBrand(pkgxBrandId, seoPayload);
      
      if (response.success) {
        toast.success(`Đã đồng bộ SEO cho thương hiệu: ${brand.name}`, { id: 'pkgx-brand-sync-seo' });
        logAction({
          action: 'sync_brand_seo',
          status: 'success',
          message: `Đã đồng bộ SEO: ${brand.name}`,
          details: { brandId: brand.systemId, pkgxBrandId, payload: seoPayload },
        });
      } else {
        throw new Error(response.error);
      }
    } catch (error) {
      toast.error(`Lỗi đồng bộ SEO thương hiệu: ${error instanceof Error ? error.message : 'Unknown error'}`, { id: 'pkgx-brand-sync-seo' });
      logAction({
        action: 'sync_brand_seo',
        status: 'error',
        message: `Lỗi đồng bộ SEO: ${brand.name}`,
        details: { brandId: brand.systemId, error: error instanceof Error ? error.message : String(error) },
      });
    }
  }, [pkgxSettings?.brandMappings, logAction]);

  // ═══════════════════════════════════════════════════════════════
  // 2. SYNC MÔ TẢ (brand_desc = longDescription)
  // ═══════════════════════════════════════════════════════════════
  const handleSyncDescription = React.useCallback(async (brand: Brand) => {
    const pkgxBrandId = getPkgxBrandId(brand, pkgxSettings?.brandMappings);
    
    if (!pkgxBrandId) {
      toast.error('Thương hiệu chưa được liên kết với PKGX. Vui lòng mapping trong Cài đặt > PKGX.');
      return;
    }
    
    toast.loading(`Đang đồng bộ mô tả thương hiệu...`, { id: 'pkgx-brand-sync-desc' });
    
    try {
      const pkgxSeo = brand.websiteSeo?.pkgx;
      // Fallback chain: SEO PKGX → SEO Chung → description
      const descPayload = {
        brand_desc: pkgxSeo?.longDescription || brand.longDescription || brand.description || '',
        short_desc: pkgxSeo?.shortDescription || brand.shortDescription || '',
      };
      
      console.log('[PKGX Brand Desc Sync] Payload:', descPayload);
      
      const response = await updateBrand(pkgxBrandId, descPayload);
      
      if (response.success) {
        toast.success(`Đã đồng bộ mô tả cho thương hiệu: ${brand.name}`, { id: 'pkgx-brand-sync-desc' });
        logAction({
          action: 'sync_brand_description',
          status: 'success',
          message: `Đã đồng bộ mô tả: ${brand.name}`,
          details: { brandId: brand.systemId, pkgxBrandId },
        });
      } else {
        throw new Error(response.error);
      }
    } catch (error) {
      toast.error(`Lỗi đồng bộ mô tả thương hiệu: ${error instanceof Error ? error.message : 'Unknown error'}`, { id: 'pkgx-brand-sync-desc' });
      logAction({
        action: 'sync_brand_description',
        status: 'error',
        message: `Lỗi đồng bộ mô tả: ${brand.name}`,
        details: { brandId: brand.systemId, error: error instanceof Error ? error.message : String(error) },
      });
    }
  }, [pkgxSettings?.brandMappings, logAction]);

  // ═══════════════════════════════════════════════════════════════
  // 3. SYNC TẤT CẢ (SEO + Mô tả + Website)
  // ═══════════════════════════════════════════════════════════════
  const handleSyncAll = React.useCallback(async (brand: Brand) => {
    const pkgxBrandId = getPkgxBrandId(brand, pkgxSettings?.brandMappings);
    
    if (!pkgxBrandId) {
      toast.error('Thương hiệu chưa được liên kết với PKGX. Vui lòng mapping trong Cài đặt > PKGX.');
      return;
    }
    
    toast.loading(`Đang đồng bộ tất cả thông tin thương hiệu...`, { id: 'pkgx-brand-sync-all' });
    
    try {
      const pkgxSeo = brand.websiteSeo?.pkgx;
      
      // Build full payload
      const fullPayload = {
        // Basic info
        brand_name: brand.name,
        site_url: brand.website || '',
        // SEO fields - Fallback chain: SEO PKGX → SEO Chung → name
        keywords: pkgxSeo?.seoKeywords || brand.seoKeywords || brand.name,
        meta_title: pkgxSeo?.seoTitle || brand.seoTitle || brand.name,
        meta_desc: pkgxSeo?.metaDescription || brand.metaDescription || '',
        short_desc: pkgxSeo?.shortDescription || brand.shortDescription || '',
        // Description (HTML)
        brand_desc: pkgxSeo?.longDescription || brand.longDescription || brand.description || '',
      };
      
      console.log('[PKGX Brand Sync All] Payload:', fullPayload);
      
      const response = await updateBrand(pkgxBrandId, fullPayload);
      
      if (response.success) {
        toast.success(`Đã đồng bộ tất cả thông tin thương hiệu: ${brand.name}`, { id: 'pkgx-brand-sync-all' });
        logAction({
          action: 'sync_brand_all',
          status: 'success',
          message: `Đã đồng bộ tất cả: ${brand.name}`,
          details: { brandId: brand.systemId, pkgxBrandId },
        });
      } else {
        throw new Error(response.error);
      }
    } catch (error) {
      toast.error(`Lỗi đồng bộ thương hiệu: ${error instanceof Error ? error.message : 'Unknown error'}`, { id: 'pkgx-brand-sync-all' });
      logAction({
        action: 'sync_brand_all',
        status: 'error',
        message: `Lỗi đồng bộ: ${brand.name}`,
        details: { brandId: brand.systemId, error: error instanceof Error ? error.message : String(error) },
      });
    }
  }, [pkgxSettings?.brandMappings, logAction]);

  // ═══════════════════════════════════════════════════════════════
  // HELPER: Kiểm tra brand có mapping với PKGX không
  // ═══════════════════════════════════════════════════════════════
  const hasPkgxMapping = React.useCallback((brand: Brand) => {
    return !!getPkgxBrandId(brand, pkgxSettings?.brandMappings);
  }, [pkgxSettings?.brandMappings]);

  return {
    handleSyncSeo,
    handleSyncDescription,
    handleSyncAll,
    hasPkgxMapping,
    getPkgxBrandId: (brand: Brand) => getPkgxBrandId(brand, pkgxSettings?.brandMappings),
  };
}
