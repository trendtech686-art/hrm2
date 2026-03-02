/**
 * Hook chứa tất cả các handlers để đồng bộ danh mục (Category) với PKGX
 * Tương tự như use-pkgx-sync.ts của products
 */
import React from 'react';
import { toast } from 'sonner';
import type { ProductCategory, WebsiteSeoData } from '@/features/settings/inventory/types';
import type { PkgxCategoryMapping } from '@/features/settings/pkgx/types';
import type { PkgxSettings } from '@/lib/types/prisma-extended';
import { updateCategory, updateCategoryBasic, getCategoryById } from '@/lib/pkgx/api-service';
import { usePkgxSettings, usePkgxCategoryMutations, usePkgxCategoryMappings } from '@/features/settings/pkgx/hooks/use-pkgx-settings';

// Helper to get website SEO data safely
function getWebsiteSeo(category: ProductCategory): Record<string, WebsiteSeoData> | undefined {
  if (!category.websiteSeo) return undefined;
  return category.websiteSeo as Record<string, WebsiteSeoData>;
}

// Types
type PkgxLogEntry = {
  action: 
    | 'sync_category_seo'
    | 'sync_category_description'
    | 'sync_category_all'
    | 'sync_category_basic';
  status: 'success' | 'error' | 'partial' | 'info';
  message: string;
  details?: Record<string, unknown>;
};

type UsePkgxCategorySyncOptions = {
  addPkgxLog?: (entry: PkgxLogEntry) => void;
};

/**
 * Lấy pkgxCategoryId từ category mapping
 */
function getPkgxCatId(category: ProductCategory, categoryMappings?: PkgxCategoryMapping[]) {
  
  if (!categoryMappings) {
    return undefined;
  }
  const mapping = categoryMappings.find(m => m.hrmCategoryId === category.systemId);
  return mapping?.pkgxCategoryId;
}

/**
 * Hook cung cấp các handlers để đồng bộ Category với PKGX
 */
export function usePkgxCategorySync({ addPkgxLog }: UsePkgxCategorySyncOptions = {}) {
  const { data: pkgxSettings, refetch: refetchSettings } = usePkgxSettings();
  const categoryMappings = usePkgxCategoryMappings();
  const { updateCategory: updateCategoryMutation } = usePkgxCategoryMutations();

  // Default log function if not provided
  const logAction = React.useCallback((entry: PkgxLogEntry) => {
    if (addPkgxLog) {
      addPkgxLog(entry);
    }
  }, [addPkgxLog]);

  // ═══════════════════════════════════════════════════════════════
  // HELPER: Refresh category data từ PKGX sau khi sync thành công
  // ═══════════════════════════════════════════════════════════════
  const refreshCategoryFromPkgx = React.useCallback(async (pkgxCatId: number) => {
    try {
      const response = await getCategoryById(pkgxCatId, pkgxSettings);
      if (response.success && response.data?.data?.[0]) {
        const data = response.data.data[0];
        // Cập nhật vào store
        updateCategoryMutation.mutate({
          id: pkgxCatId,
          updates: {
            id: data.cat_id,
            name: data.cat_name,
            parentId: data.parent_id || 0,
            cat_desc: data.cat_desc || '',
            keywords: data.keywords || '',
            cat_alias: data.cat_alias || '',
            grade: data.grade || 0,
          },
        });
      }
    } catch (_error) {
      // Silently ignore sync errors
    }
  }, [updateCategoryMutation, pkgxSettings]);

  // ═══════════════════════════════════════════════════════════════
  // 1. SYNC SEO (keywords, meta_title, meta_desc)
  // ═══════════════════════════════════════════════════════════════
  const handleSyncSeo = React.useCallback(async (category: ProductCategory) => {
    // Force refetch settings để đảm bảo enabled status mới nhất
    const { data: freshSettings } = await refetchSettings();
    
    const pkgxCatId = getPkgxCatId(category, categoryMappings);
    
    if (!pkgxCatId) {
      toast.error('Danh mục chưa được liên kết với PKGX. Vui lòng mapping trong Cài đặt > PKGX.');
      return;
    }
    
    toast.loading(`Đang đồng bộ SEO danh mục...`, { id: 'pkgx-category-sync-seo' });
    
    try {
      const pkgxSeo = getWebsiteSeo(category)?.pkgx;
      // Fallback chain: SEO PKGX → SEO Chung → name
      // Category DB columns: keywords, meta_title, meta_desc (NO cat_alias, NO short_desc!)
      const seoPayload = {
        keywords: pkgxSeo?.seoKeywords || category.seoKeywords || category.name,
        meta_title: pkgxSeo?.seoTitle || category.seoTitle || category.name,
        meta_desc: pkgxSeo?.metaDescription || category.metaDescription || '',
      };
      
      // DEBUG
      
      const response = await updateCategory(pkgxCatId, seoPayload, freshSettings as unknown as PkgxSettings | undefined);
      
      
      if (response.success) {
        // Auto-refresh để cập nhật store
        await refreshCategoryFromPkgx(pkgxCatId);
        
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
  }, [categoryMappings, logAction, refreshCategoryFromPkgx, refetchSettings]);

  // ═══════════════════════════════════════════════════════════════
  // 2. SYNC MÔ TẢ (cat_desc = longDescription)
  // ═══════════════════════════════════════════════════════════════
  const handleSyncDescription = React.useCallback(async (category: ProductCategory) => {
    // Force refetch settings để đảm bảo enabled status mới nhất
    const { data: freshSettings } = await refetchSettings();
    
    const pkgxCatId = getPkgxCatId(category, categoryMappings);
    
    if (!pkgxCatId) {
      toast.error('Danh mục chưa được liên kết với PKGX. Vui lòng mapping trong Cài đặt > PKGX.');
      return;
    }
    
    toast.loading(`Đang đồng bộ mô tả danh mục...`, { id: 'pkgx-category-sync-desc' });
    
    try {
      const pkgxSeo = getWebsiteSeo(category)?.pkgx;
      // Category DB: cat_desc = mô tả ngắn, long_desc = mô tả dài (NO short_desc column!)
      const descPayload = {
        cat_desc: pkgxSeo?.shortDescription || category.shortDescription || '',
        long_desc: pkgxSeo?.longDescription || category.longDescription || '',
      };
      
      
      const response = await updateCategory(pkgxCatId, descPayload, freshSettings as unknown as PkgxSettings | undefined);
      
      if (response.success) {
        // Auto-refresh để cập nhật store
        await refreshCategoryFromPkgx(pkgxCatId);
        
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
  }, [categoryMappings, logAction, refreshCategoryFromPkgx, refetchSettings]);

  // ═══════════════════════════════════════════════════════════════
  // 3. SYNC TẤT CẢ (SEO + Mô tả + Slug)
  // ═══════════════════════════════════════════════════════════════
  const handleSyncAll = React.useCallback(async (category: ProductCategory) => {
    // Force refetch settings để đảm bảo enabled status mới nhất
    const { data: freshSettings } = await refetchSettings();
    
    const pkgxCatId = getPkgxCatId(category, categoryMappings);
    
    if (!pkgxCatId) {
      toast.error('Danh mục chưa được liên kết với PKGX. Vui lòng mapping trong Cài đặt > PKGX.');
      return;
    }
    
    toast.loading(`Đang đồng bộ tất cả thông tin danh mục...`, { id: 'pkgx-category-sync-all' });
    
    try {
      const pkgxSeo = getWebsiteSeo(category)?.pkgx;
      
      // Build full payload
      // Category DB: cat_desc = mô tả ngắn, long_desc = mô tả dài (NO short_desc column!)
      const fullPayload = {
        // Basic info
        cat_name: category.name,
        cat_alias: pkgxSeo?.slug || category.slug || '',
        // SEO fields - Fallback chain: SEO PKGX → SEO Chung → name
        keywords: pkgxSeo?.seoKeywords || category.seoKeywords || category.name,
        meta_title: pkgxSeo?.seoTitle || category.seoTitle || category.name,
        meta_desc: pkgxSeo?.metaDescription || category.metaDescription || '',
        // Descriptions
        cat_desc: pkgxSeo?.shortDescription || category.shortDescription || '',
        long_desc: pkgxSeo?.longDescription || category.longDescription || '',
      };
      
      
      const response = await updateCategory(pkgxCatId, fullPayload, freshSettings as unknown as PkgxSettings | undefined);
      
      if (response.success) {
        // Auto-refresh để cập nhật store
        await refreshCategoryFromPkgx(pkgxCatId);
        
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
  }, [categoryMappings, logAction, refreshCategoryFromPkgx, refetchSettings]);

  // ═══════════════════════════════════════════════════════════════
  // 4. SYNC BASIC (cat_name, is_show)
  // ═══════════════════════════════════════════════════════════════
  const handleSyncBasic = React.useCallback(async (category: ProductCategory) => {
    // Force refetch settings để đảm bảo enabled status mới nhất
    const { data: freshSettings } = await refetchSettings();
    
    const pkgxCatId = getPkgxCatId(category, categoryMappings);
    
    if (!pkgxCatId) {
      toast.error('Danh mục chưa được liên kết với PKGX. Vui lòng mapping trong Cài đặt > PKGX.');
      return;
    }
    
    toast.loading(`Đang đồng bộ thông tin cơ bản danh mục...`, { id: 'pkgx-category-sync-basic' });
    
    try {
      // Build payload - chỉ tên và trạng thái hiển thị
      const basicPayload = {
        cat_name: category.name,
        is_show: category.isActive ? 1 : 0,
      };
      
      
      const response = await updateCategoryBasic(pkgxCatId, basicPayload, freshSettings as unknown as PkgxSettings | undefined);
      
      if (response.success) {
        // Auto-refresh để cập nhật store
        await refreshCategoryFromPkgx(pkgxCatId);
        
        toast.success(`Đã đồng bộ thông tin cơ bản danh mục: ${category.name}`, { id: 'pkgx-category-sync-basic' });
        logAction({
          action: 'sync_category_basic',
          status: 'success',
          message: `Đã đồng bộ thông tin cơ bản: ${category.name}`,
          details: { categoryId: category.systemId, pkgxCatId, payload: basicPayload },
        });
      } else {
        throw new Error(response.error);
      }
    } catch (error) {
      toast.error(`Lỗi đồng bộ thông tin cơ bản: ${error instanceof Error ? error.message : 'Unknown error'}`, { id: 'pkgx-category-sync-basic' });
      logAction({
        action: 'sync_category_basic',
        status: 'error',
        message: `Lỗi đồng bộ thông tin cơ bản: ${category.name}`,
        details: { categoryId: category.systemId, error: error instanceof Error ? error.message : String(error) },
      });
    }
  }, [categoryMappings, logAction, refreshCategoryFromPkgx, refetchSettings]);

  // ═══════════════════════════════════════════════════════════════
  // HELPER: Kiểm tra category có mapping với PKGX không
  // ═══════════════════════════════════════════════════════════════
  const hasPkgxMapping = React.useCallback((category: ProductCategory) => {
    return !!getPkgxCatId(category, categoryMappings);
  }, [categoryMappings]);

  // ═══════════════════════════════════════════════════════════════
  // 5. IMPORT DATA TỪ PKGX VỀ HRM (kéo title, meta, name, description)
  // ═══════════════════════════════════════════════════════════════
  const handleImportFromPkgx = React.useCallback(async (category: ProductCategory, onImportSuccess?: (data: Partial<ProductCategory>) => void) => {
    const pkgxCatId = getPkgxCatId(category, categoryMappings);
    
    if (!pkgxCatId) {
      toast.error('Danh mục chưa được liên kết với PKGX. Vui lòng mapping trong Cài đặt > PKGX.');
      return;
    }
    
    toast.loading(`Đang import dữ liệu từ PKGX...`, { id: 'pkgx-category-import' });
    
    try {
      const response = await getCategoryById(pkgxCatId, pkgxSettings);
      
      if (response.success && response.data?.data?.[0]) {
        const pkgxData = response.data.data[0];
        
        // Chuẩn bị data để fill form
        const importedData = {
          // Thông tin cơ bản
          name: pkgxData.cat_name || category.name,
          
          // SEO fields
          seoTitle: pkgxData.meta_title || category.seoTitle,
          metaDescription: pkgxData.meta_desc || category.metaDescription,
          seoKeywords: pkgxData.keywords || category.seoKeywords,
          shortDescription: pkgxData.cat_desc || category.shortDescription,
          longDescription: pkgxData.cat_desc || category.longDescription,
          
          // Website SEO (lưu vào pkgx nested object)
          websiteSeo: {
            pkgx: {
              seoTitle: pkgxData.meta_title,
              metaDescription: pkgxData.meta_desc,
              seoKeywords: pkgxData.keywords,
              shortDescription: pkgxData.cat_desc,
              longDescription: pkgxData.cat_desc,
            }
          }
        };
        
        toast.success(`Đã import dữ liệu từ PKGX: ${pkgxData.cat_name}`, { id: 'pkgx-category-import' });
        
        // Callback để parent component update form
        if (onImportSuccess) {
          onImportSuccess(importedData);
        }
        
        logAction({
          action: 'sync_category_all',
          status: 'success',
          message: `Import thành công từ PKGX: ${pkgxData.cat_name}`,
          details: { categoryId: category.systemId, pkgxCatId, importedData },
        });
      } else {
        throw new Error(response.error || 'Không tìm thấy dữ liệu');
      }
    } catch (error) {
      toast.error(`Lỗi import từ PKGX: ${error instanceof Error ? error.message : 'Unknown error'}`, { id: 'pkgx-category-import' });
      logAction({
        action: 'sync_category_all',
        status: 'error',
        message: `Lỗi import từ PKGX: ${category.name}`,
        details: { categoryId: category.systemId, error: error instanceof Error ? error.message : String(error) },
      });
    }
  }, [categoryMappings, logAction, pkgxSettings]);

  return {
    handleSyncSeo,
    handleSyncDescription,
    handleSyncAll,
    handleSyncBasic,
    handleImportFromPkgx,
    hasPkgxMapping,
    getPkgxCatId: (category: ProductCategory) => getPkgxCatId(category, categoryMappings),
  };
}

