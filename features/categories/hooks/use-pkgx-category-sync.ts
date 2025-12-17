/**
 * Hook chứa tất cả các handlers để đồng bộ danh mục (Category) với PKGX
 * Tương tự như use-pkgx-sync.ts của products
 */
import React from 'react';
import { toast } from 'sonner';
import type { ProductCategory } from '@/features/settings/inventory/types';
import { updateCategory } from '@/lib/pkgx/api-service';
import { usePkgxSettingsStore } from '@/features/settings/pkgx/store';

// Types
type PkgxLogEntry = {
  action: 
    | 'sync_category_seo'
    | 'sync_category_description'
    | 'sync_category_all';
  status: 'success' | 'error' | 'partial' | 'info';
  message: string;
  details?: Record<string, unknown>;
};

type UsePkgxCategorySyncOptions = {
  addPkgxLog?: (entry: PkgxLogEntry) => void;
};

/**
 * Lấy pkgxCatId từ category mapping
 */
function getPkgxCatId(category: ProductCategory, categoryMappings?: Array<{ hrmCategorySystemId: string; pkgxCatId: number }>) {
  if (!categoryMappings) return undefined;
  const mapping = categoryMappings.find(m => m.hrmCategorySystemId === category.systemId);
  return mapping?.pkgxCatId;
}

/**
 * Hook cung cấp các handlers để đồng bộ Category với PKGX
 */
export function usePkgxCategorySync({ addPkgxLog }: UsePkgxCategorySyncOptions = {}) {
  const { settings: pkgxSettings } = usePkgxSettingsStore();

  // Default log function if not provided
  const logAction = React.useCallback((entry: PkgxLogEntry) => {
    if (addPkgxLog) {
      addPkgxLog(entry);
    }
    console.log('[PKGX Category Sync]', entry.action, entry.status, entry.message);
  }, [addPkgxLog]);

  // ═══════════════════════════════════════════════════════════════
  // 1. SYNC SEO (keywords, meta_title, meta_desc)
  // ═══════════════════════════════════════════════════════════════
  const handleSyncSeo = React.useCallback(async (category: ProductCategory) => {
    const pkgxCatId = getPkgxCatId(category, pkgxSettings?.categoryMappings);
    
    if (!pkgxCatId) {
      toast.error('Danh mục chưa được liên kết với PKGX. Vui lòng mapping trong Cài đặt > PKGX.');
      return;
    }
    
    toast.loading(`Đang đồng bộ SEO danh mục...`, { id: 'pkgx-category-sync-seo' });
    
    try {
      const pkgxSeo = category.websiteSeo?.pkgx;
      // Fallback chain: SEO PKGX → SEO Chung → name
      const seoPayload = {
        keywords: pkgxSeo?.seoKeywords || category.seoKeywords || category.name,
        meta_title: pkgxSeo?.seoTitle || category.seoTitle || category.name,
        meta_desc: pkgxSeo?.metaDescription || category.metaDescription || '',
        short_desc: pkgxSeo?.shortDescription || category.shortDescription || '',
        cat_alias: pkgxSeo?.slug || category.slug || '',
      };
      
      // DEBUG
      console.log('[PKGX Category SEO Sync] Category:', category.name);
      console.log('[PKGX Category SEO Sync] websiteSeo.pkgx:', pkgxSeo);
      console.log('[PKGX Category SEO Sync] SEO Chung - seoKeywords:', category.seoKeywords);
      console.log('[PKGX Category SEO Sync] Payload:', seoPayload);
      
      const response = await updateCategory(pkgxCatId, seoPayload);
      
      if (response.success) {
        toast.success(`Đã đồng bộ SEO cho danh mục: ${category.name}`, { id: 'pkgx-category-sync-seo' });
        logAction({
          action: 'sync_category_seo',
          status: 'success',
          message: `Đã đồng bộ SEO: ${category.name}`,
          details: { categoryId: category.systemId, pkgxCatId, payload: seoPayload },
        });
      } else {
        throw new Error(response.error);
      }
    } catch (error) {
      toast.error(`Lỗi đồng bộ SEO danh mục: ${error instanceof Error ? error.message : 'Unknown error'}`, { id: 'pkgx-category-sync-seo' });
      logAction({
        action: 'sync_category_seo',
        status: 'error',
        message: `Lỗi đồng bộ SEO: ${category.name}`,
        details: { categoryId: category.systemId, error: error instanceof Error ? error.message : String(error) },
      });
    }
  }, [pkgxSettings?.categoryMappings, logAction]);

  // ═══════════════════════════════════════════════════════════════
  // 2. SYNC MÔ TẢ (cat_desc = longDescription)
  // ═══════════════════════════════════════════════════════════════
  const handleSyncDescription = React.useCallback(async (category: ProductCategory) => {
    const pkgxCatId = getPkgxCatId(category, pkgxSettings?.categoryMappings);
    
    if (!pkgxCatId) {
      toast.error('Danh mục chưa được liên kết với PKGX. Vui lòng mapping trong Cài đặt > PKGX.');
      return;
    }
    
    toast.loading(`Đang đồng bộ mô tả danh mục...`, { id: 'pkgx-category-sync-desc' });
    
    try {
      const pkgxSeo = category.websiteSeo?.pkgx;
      // Fallback chain: SEO PKGX → SEO Chung
      const descPayload = {
        cat_desc: pkgxSeo?.longDescription || category.longDescription || '',
        short_desc: pkgxSeo?.shortDescription || category.shortDescription || '',
      };
      
      console.log('[PKGX Category Desc Sync] Payload:', descPayload);
      
      const response = await updateCategory(pkgxCatId, descPayload);
      
      if (response.success) {
        toast.success(`Đã đồng bộ mô tả cho danh mục: ${category.name}`, { id: 'pkgx-category-sync-desc' });
        logAction({
          action: 'sync_category_description',
          status: 'success',
          message: `Đã đồng bộ mô tả: ${category.name}`,
          details: { categoryId: category.systemId, pkgxCatId },
        });
      } else {
        throw new Error(response.error);
      }
    } catch (error) {
      toast.error(`Lỗi đồng bộ mô tả danh mục: ${error instanceof Error ? error.message : 'Unknown error'}`, { id: 'pkgx-category-sync-desc' });
      logAction({
        action: 'sync_category_description',
        status: 'error',
        message: `Lỗi đồng bộ mô tả: ${category.name}`,
        details: { categoryId: category.systemId, error: error instanceof Error ? error.message : String(error) },
      });
    }
  }, [pkgxSettings?.categoryMappings, logAction]);

  // ═══════════════════════════════════════════════════════════════
  // 3. SYNC TẤT CẢ (SEO + Mô tả + Slug)
  // ═══════════════════════════════════════════════════════════════
  const handleSyncAll = React.useCallback(async (category: ProductCategory) => {
    const pkgxCatId = getPkgxCatId(category, pkgxSettings?.categoryMappings);
    
    if (!pkgxCatId) {
      toast.error('Danh mục chưa được liên kết với PKGX. Vui lòng mapping trong Cài đặt > PKGX.');
      return;
    }
    
    toast.loading(`Đang đồng bộ tất cả thông tin danh mục...`, { id: 'pkgx-category-sync-all' });
    
    try {
      const pkgxSeo = category.websiteSeo?.pkgx;
      
      // Build full payload
      const fullPayload = {
        // Basic info
        cat_name: category.name,
        cat_alias: pkgxSeo?.slug || category.slug || '',
        // SEO fields - Fallback chain: SEO PKGX → SEO Chung → name
        keywords: pkgxSeo?.seoKeywords || category.seoKeywords || category.name,
        meta_title: pkgxSeo?.seoTitle || category.seoTitle || category.name,
        meta_desc: pkgxSeo?.metaDescription || category.metaDescription || '',
        short_desc: pkgxSeo?.shortDescription || category.shortDescription || '',
        // Description (HTML)
        cat_desc: pkgxSeo?.longDescription || category.longDescription || '',
      };
      
      console.log('[PKGX Category Sync All] Payload:', fullPayload);
      
      const response = await updateCategory(pkgxCatId, fullPayload);
      
      if (response.success) {
        toast.success(`Đã đồng bộ tất cả thông tin danh mục: ${category.name}`, { id: 'pkgx-category-sync-all' });
        logAction({
          action: 'sync_category_all',
          status: 'success',
          message: `Đã đồng bộ tất cả: ${category.name}`,
          details: { categoryId: category.systemId, pkgxCatId },
        });
      } else {
        throw new Error(response.error);
      }
    } catch (error) {
      toast.error(`Lỗi đồng bộ danh mục: ${error instanceof Error ? error.message : 'Unknown error'}`, { id: 'pkgx-category-sync-all' });
      logAction({
        action: 'sync_category_all',
        status: 'error',
        message: `Lỗi đồng bộ: ${category.name}`,
        details: { categoryId: category.systemId, error: error instanceof Error ? error.message : String(error) },
      });
    }
  }, [pkgxSettings?.categoryMappings, logAction]);

  // ═══════════════════════════════════════════════════════════════
  // HELPER: Kiểm tra category có mapping với PKGX không
  // ═══════════════════════════════════════════════════════════════
  const hasPkgxMapping = React.useCallback((category: ProductCategory) => {
    return !!getPkgxCatId(category, pkgxSettings?.categoryMappings);
  }, [pkgxSettings?.categoryMappings]);

  return {
    handleSyncSeo,
    handleSyncDescription,
    handleSyncAll,
    hasPkgxMapping,
    getPkgxCatId: (category: ProductCategory) => getPkgxCatId(category, pkgxSettings?.categoryMappings),
  };
}
