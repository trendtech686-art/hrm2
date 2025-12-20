/**
 * Hook chứa tất cả các handlers để đồng bộ thương hiệu (Brand) với PKGX
 * Tương tự như use-pkgx-sync.ts của products
 */
import React from 'react';
import { toast } from 'sonner';
import type { Brand } from '@/features/settings/inventory/types';
import { updateBrand, getBrandById } from '@/lib/pkgx/api-service';
import { usePkgxSettingsStore } from '@/features/settings/pkgx/store';

// Types
type PkgxLogEntry = {
  action: 
    | 'sync_brand_basic_info'
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
  const { settings: pkgxSettings, updateBrand: updateBrandInStore } = usePkgxSettingsStore();

  // Default log function if not provided
  const logAction = React.useCallback((entry: PkgxLogEntry) => {
    if (addPkgxLog) {
      addPkgxLog(entry);
    }
    console.log('[PKGX Brand Sync]', entry.action, entry.status, entry.message);
  }, [addPkgxLog]);

  // ═══════════════════════════════════════════════════════════════
  // HELPER: Refresh brand data từ PKGX sau khi sync thành công
  // ═══════════════════════════════════════════════════════════════
  const refreshBrandFromPkgx = React.useCallback(async (pkgxBrandId: number) => {
    try {
      const response = await getBrandById(pkgxBrandId);
      if (response.success && response.data) {
        // Cập nhật vào store
        updateBrandInStore(pkgxBrandId, {
          id: response.data.brand_id,
          name: response.data.brand_name,
          logo: response.data.brand_logo || '',
          description: response.data.brand_desc || '',
          shortDescription: response.data.short_desc || '',
          longDescription: response.data.long_desc || '',
          keywords: response.data.keywords || '',
          metaTitle: response.data.meta_title || '',
          metaDesc: response.data.meta_desc || '',
          siteUrl: response.data.site_url || '',
          sortOrder: response.data.sort_order || 0,
          isShow: response.data.is_show ?? 1,
        });
        console.log('[PKGX Brand Sync] Auto-refreshed brand data from PKGX:', pkgxBrandId);
      }
    } catch (error) {
      console.warn('[PKGX Brand Sync] Failed to refresh brand data:', error);
    }
  }, [updateBrandInStore]);

  // ═══════════════════════════════════════════════════════════════
  // 1. SYNC THÔNG TIN CƠ BẢN (brand_name, site_url)
  // ═══════════════════════════════════════════════════════════════
  const handleSyncBasicInfo = React.useCallback(async (brand: Brand) => {
    const pkgxBrandId = getPkgxBrandId(brand, pkgxSettings?.brandMappings);
    
    if (!pkgxBrandId) {
      toast.error('Thương hiệu chưa được liên kết với PKGX. Vui lòng mapping trong Cài đặt > PKGX.');
      return;
    }
    
    toast.loading(`Đang đồng bộ thông tin cơ bản...`, { id: 'pkgx-brand-sync-basic' });
    
    try {
      const basicPayload = {
        brand_name: brand.name,
        site_url: brand.website || '',
      };
      
      console.log('[PKGX Brand Basic Sync] Payload:', basicPayload);
      
      const response = await updateBrand(pkgxBrandId, basicPayload);
      
      if (response.success) {
        // Auto-refresh để cập nhật store
        await refreshBrandFromPkgx(pkgxBrandId);
        
        toast.success(`Đã đồng bộ thông tin cơ bản: ${brand.name}`, { id: 'pkgx-brand-sync-basic' });
        logAction({
          action: 'sync_brand_basic_info',
          status: 'success',
          message: `Đã đồng bộ thông tin cơ bản: ${brand.name}`,
          details: { brandId: brand.systemId, pkgxBrandId, payload: basicPayload },
        });
      } else {
        throw new Error(response.error);
      }
    } catch (error) {
      toast.error(`Lỗi đồng bộ thông tin cơ bản: ${error instanceof Error ? error.message : 'Unknown error'}`, { id: 'pkgx-brand-sync-basic' });
      logAction({
        action: 'sync_brand_basic_info',
        status: 'error',
        message: `Lỗi đồng bộ thông tin cơ bản: ${brand.name}`,
        details: { brandId: brand.systemId, error: error instanceof Error ? error.message : String(error) },
      });
    }
  }, [pkgxSettings?.brandMappings, logAction, refreshBrandFromPkgx]);

  // ═══════════════════════════════════════════════════════════════
  // 2. SYNC SEO (keywords, meta_title, meta_desc)
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
      // SEO chỉ gồm: keywords, meta_title, meta_desc
      const seoPayload = {
        keywords: pkgxSeo?.seoKeywords || brand.seoKeywords || brand.name,
        meta_title: pkgxSeo?.seoTitle || brand.seoTitle || brand.name,
        meta_desc: pkgxSeo?.metaDescription || brand.metaDescription || '',
      };
      
      // DEBUG
      console.log('[PKGX Brand SEO Sync] Brand:', brand.name);
      console.log('[PKGX Brand SEO Sync] websiteSeo.pkgx:', pkgxSeo);
      console.log('[PKGX Brand SEO Sync] SEO Chung - seoKeywords:', brand.seoKeywords);
      console.log('[PKGX Brand SEO Sync] Payload:', seoPayload);
      
      const response = await updateBrand(pkgxBrandId, seoPayload);
      
      if (response.success) {
        // Auto-refresh để cập nhật store
        await refreshBrandFromPkgx(pkgxBrandId);
        
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
  }, [pkgxSettings?.brandMappings, logAction, refreshBrandFromPkgx]);

  // ═══════════════════════════════════════════════════════════════
  // 3. SYNC MÔ TẢ (short_desc, long_desc)
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
      // Mô tả chỉ gồm: short_desc, long_desc
      const descPayload = {
        short_desc: pkgxSeo?.shortDescription || brand.shortDescription || '',
        long_desc: pkgxSeo?.longDescription || brand.longDescription || '',
      };
      
      console.log('[PKGX Brand Desc Sync] Payload:', descPayload);
      
      const response = await updateBrand(pkgxBrandId, descPayload);
      
      if (response.success) {
        // Auto-refresh để cập nhật store
        await refreshBrandFromPkgx(pkgxBrandId);
        
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
  }, [pkgxSettings?.brandMappings, logAction, refreshBrandFromPkgx]);

  // ═══════════════════════════════════════════════════════════════
  // 4. SYNC TẤT CẢ (Thông tin cơ bản + SEO + Mô tả)
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
        // Descriptions
        brand_desc: brand.description || '',
        short_desc: pkgxSeo?.shortDescription || brand.shortDescription || '',
        long_desc: pkgxSeo?.longDescription || brand.longDescription || '',
      };
      
      console.log('[PKGX Brand Sync All] Payload:', fullPayload);
      
      const response = await updateBrand(pkgxBrandId, fullPayload);
      
      if (response.success) {
        // Auto-refresh để cập nhật store
        await refreshBrandFromPkgx(pkgxBrandId);
        
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
  }, [pkgxSettings?.brandMappings, logAction, refreshBrandFromPkgx]);

  // ═══════════════════════════════════════════════════════════════
  // HELPER: Kiểm tra brand có mapping với PKGX không
  // ═══════════════════════════════════════════════════════════════
  const hasPkgxMapping = React.useCallback((brand: Brand) => {
    return !!getPkgxBrandId(brand, pkgxSettings?.brandMappings);
  }, [pkgxSettings?.brandMappings]);

  return {
    handleSyncBasicInfo,
    handleSyncSeo,
    handleSyncDescription,
    handleSyncAll,
    hasPkgxMapping,
    getPkgxBrandId: (brand: Brand) => getPkgxBrandId(brand, pkgxSettings?.brandMappings),
  };
}
