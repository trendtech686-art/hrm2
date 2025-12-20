/**
 * usePkgxBulkSync - Shared hook for bulk PKGX sync operations
 * 
 * Supports bulk sync for products and brands with:
 * - Progress tracking
 * - Confirmation dialog
 * - Error handling
 * - Logging
 */

import * as React from 'react';
import { toast } from 'sonner';
import { updateProduct, updateBrand } from '../../../../lib/pkgx/api-service';
import { usePkgxSettingsStore } from '../store';
import type { Product } from '../../../products/types';
import type { Brand } from '../../../settings/inventory/types';

// ========================================
// Types
// ========================================

export type BulkSyncEntityType = 'product' | 'brand';

export type BulkSyncActionKey = 
  | 'sync_all'
  | 'sync_basic'
  | 'sync_seo'
  | 'sync_description'
  | 'sync_price'
  | 'sync_inventory'
  | 'sync_flags'
  | 'sync_images';

export interface BulkConfirmState {
  open: boolean;
  title: string;
  description: string;
  action: (() => Promise<void>) | null;
  itemCount: number;
}

export interface BulkSyncProgress {
  total: number;
  completed: number;
  success: number;
  error: number;
  isRunning: boolean;
}

export interface UsePkgxBulkSyncOptions {
  entityType: BulkSyncEntityType;
  onLog?: (log: {
    action: `bulk_${BulkSyncActionKey}`;
    status: 'success' | 'error' | 'info';
    message: string;
    details?: Record<string, unknown>;
  }) => void;
}

// ========================================
// Bulk Action Configs
// ========================================

const BULK_ACTION_LABELS: Record<BulkSyncActionKey, { title: string; description: string }> = {
  sync_all: {
    title: 'Đồng bộ tất cả',
    description: 'Đồng bộ toàn bộ thông tin (tên, SKU, giá, tồn kho, SEO, mô tả, flags)',
  },
  sync_basic: {
    title: 'Đồng bộ thông tin cơ bản',
    description: 'Đồng bộ tên, SKU, danh mục, thương hiệu',
  },
  sync_seo: {
    title: 'Đồng bộ SEO',
    description: 'Đồng bộ keywords, meta title, meta description',
  },
  sync_description: {
    title: 'Đồng bộ mô tả',
    description: 'Đồng bộ mô tả ngắn và mô tả chi tiết',
  },
  sync_price: {
    title: 'Đồng bộ giá',
    description: 'Đồng bộ giá bán, giá thị trường, giá khuyến mãi',
  },
  sync_inventory: {
    title: 'Đồng bộ tồn kho',
    description: 'Đồng bộ số lượng tồn kho',
  },
  sync_flags: {
    title: 'Đồng bộ flags',
    description: 'Đồng bộ trạng thái nổi bật, mới, hot, hiển thị',
  },
  sync_images: {
    title: 'Đồng bộ hình ảnh',
    description: 'Đồng bộ hình ảnh đại diện và album',
  },
};

// ========================================
// Payload Builders
// ========================================

function buildProductPayload(product: Product, actionKey: BulkSyncActionKey): Record<string, unknown> {
  const pkgxSettings = usePkgxSettingsStore.getState();
  const { categoryMappings, brandMappings } = pkgxSettings.settings;
  
  // Get PKGX category/brand IDs
  const catMapping = categoryMappings.find(m => m.hrmCategorySystemId === product.categorySystemId);
  const brandMapping = brandMappings.find(m => m.hrmBrandSystemId === product.brandSystemId);
  
  // Get website-specific SEO data
  const pkgxSeo = product.seoPkgx;
  
  // Calculate total inventory
  const totalInventory = Object.values(product.inventoryByBranch || {}).reduce((sum, qty) => sum + qty, 0);
  
  switch (actionKey) {
    case 'sync_all':
      return {
        goods_name: product.name,
        goods_sn: product.id,
        shop_price: product.sellingPrice || 0,
        market_price: product.costPrice || product.sellingPrice || 0,
        promote_price: 0, // dealPrice not in Product type
        goods_number: totalInventory,
        keywords: pkgxSeo?.seoKeywords || product.seoKeywords || product.name,
        meta_title: pkgxSeo?.seoTitle || product.ktitle || product.name,
        meta_desc: pkgxSeo?.metaDescription || product.seoDescription || '',
        goods_brief: pkgxSeo?.shortDescription || product.shortDescription || '',
        goods_desc: pkgxSeo?.longDescription || product.description || '',
        is_best: product.isFeatured ? 1 : 0,
        is_new: product.isNewArrival ? 1 : 0,
        is_hot: product.isBestSeller ? 1 : 0,
        is_home: product.isPublished ? 1 : 0,
        is_on_sale: product.isPublished ?? (product.status === 'active') ? 1 : 0,
        ...(catMapping && { cat_id: catMapping.pkgxCatId }),
        ...(brandMapping && { brand_id: brandMapping.pkgxBrandId }),
      };
      
    case 'sync_basic':
      return {
        goods_name: product.name,
        goods_sn: product.id,
        ...(catMapping && { cat_id: catMapping.pkgxCatId }),
        ...(brandMapping && { brand_id: brandMapping.pkgxBrandId }),
      };
      
    case 'sync_price':
      return {
        shop_price: product.sellingPrice || 0,
        market_price: product.costPrice || product.sellingPrice || 0,
        promote_price: 0,
      };
      
    case 'sync_inventory':
      return {
        goods_number: totalInventory,
      };
      
    case 'sync_seo':
      return {
        keywords: pkgxSeo?.seoKeywords || product.seoKeywords || product.name,
        meta_title: pkgxSeo?.seoTitle || product.ktitle || product.name,
        meta_desc: pkgxSeo?.metaDescription || product.seoDescription || '',
      };
      
    case 'sync_description':
      return {
        goods_brief: pkgxSeo?.shortDescription || product.shortDescription || '',
        goods_desc: pkgxSeo?.longDescription || product.description || '',
      };
      
    case 'sync_flags':
      return {
        is_best: product.isFeatured ? 1 : 0,
        is_new: product.isNewArrival ? 1 : 0,
        is_hot: product.isBestSeller ? 1 : 0,
        is_home: product.isPublished ? 1 : 0,
        is_on_sale: product.isPublished ?? (product.status === 'active') ? 1 : 0,
      };
      
    default:
      return {};
  }
}

function buildBrandPayload(brand: Brand, actionKey: BulkSyncActionKey): Record<string, unknown> {
  const pkgxSeo = brand.websiteSeo?.pkgx;
  
  switch (actionKey) {
    case 'sync_all':
      return {
        brand_name: brand.name,
        site_url: brand.website || '',
        keywords: pkgxSeo?.seoKeywords || brand.seoKeywords || brand.name,
        meta_title: pkgxSeo?.seoTitle || brand.seoTitle || brand.name,
        meta_desc: pkgxSeo?.metaDescription || brand.metaDescription || '',
        short_desc: pkgxSeo?.shortDescription || brand.shortDescription || '',
        brand_desc: pkgxSeo?.longDescription || brand.longDescription || brand.description || '',
      };
      
    case 'sync_basic':
      return {
        brand_name: brand.name,
        site_url: brand.website || '',
      };
      
    case 'sync_seo':
      return {
        keywords: pkgxSeo?.seoKeywords || brand.seoKeywords || brand.name,
        meta_title: pkgxSeo?.seoTitle || brand.seoTitle || brand.name,
        meta_desc: pkgxSeo?.metaDescription || brand.metaDescription || '',
        short_desc: pkgxSeo?.shortDescription || brand.shortDescription || '',
      };
      
    case 'sync_description':
      return {
        short_desc: pkgxSeo?.shortDescription || brand.shortDescription || '',
        brand_desc: pkgxSeo?.longDescription || brand.longDescription || brand.description || '',
      };
      
    default:
      return {};
  }
}

// ========================================
// Main Hook
// ========================================

export function usePkgxBulkSync(options: UsePkgxBulkSyncOptions) {
  const { entityType, onLog } = options;
  
  // Confirmation dialog state
  const [confirmAction, setConfirmAction] = React.useState<BulkConfirmState>({
    open: false,
    title: '',
    description: '',
    action: null,
    itemCount: 0,
  });
  
  // Progress state
  const [progress, setProgress] = React.useState<BulkSyncProgress>({
    total: 0,
    completed: 0,
    success: 0,
    error: 0,
    isRunning: false,
  });
  
  // Check if PKGX is enabled
  const checkPkgxEnabled = React.useCallback(() => {
    const pkgxSettings = usePkgxSettingsStore.getState();
    if (!pkgxSettings.settings.enabled) {
      toast.error('PKGX chưa được bật');
      return false;
    }
    return true;
  }, []);
  
  // Helper to get PKGX brand ID from brand mappings
  const getPkgxBrandId = React.useCallback((brand: Brand): number | undefined => {
    const pkgxSettings = usePkgxSettingsStore.getState();
    const mapping = pkgxSettings.settings.brandMappings.find(
      m => m.hrmBrandSystemId === brand.systemId
    );
    return mapping?.pkgxBrandId;
  }, []);
  
  // Execute bulk sync for products
  const executeBulkSyncProducts = React.useCallback(async (
    products: Product[],
    actionKey: BulkSyncActionKey
  ) => {
    const linkedProducts = products.filter(p => p.pkgxId);
    
    if (linkedProducts.length === 0) {
      toast.error('Không có sản phẩm nào đã liên kết PKGX');
      return;
    }
    
    setProgress({
      total: linkedProducts.length,
      completed: 0,
      success: 0,
      error: 0,
      isRunning: true,
    });
    
    const actionLabel = BULK_ACTION_LABELS[actionKey].title.toLowerCase();
    toast.info(`Đang ${actionLabel} ${linkedProducts.length} sản phẩm...`);
    
    let successCount = 0;
    let errorCount = 0;
    
    for (let i = 0; i < linkedProducts.length; i++) {
      const product = linkedProducts[i];
      try {
        const payload = buildProductPayload(product, actionKey);
        const response = await updateProduct(product.pkgxId!, payload);
        
        if (response.success) {
          successCount++;
        } else {
          errorCount++;
        }
      } catch {
        errorCount++;
      }
      
      setProgress(prev => ({
        ...prev,
        completed: i + 1,
        success: successCount,
        error: errorCount,
      }));
    }
    
    setProgress(prev => ({ ...prev, isRunning: false }));
    
    // Show results
    if (successCount > 0) {
      toast.success(`Đã ${actionLabel} ${successCount} sản phẩm`);
      onLog?.({
        action: `bulk_${actionKey}`,
        status: 'success',
        message: `Đã ${actionLabel} ${successCount} sản phẩm`,
        details: { successCount, errorCount },
      });
    }
    if (errorCount > 0) {
      toast.error(`Lỗi ${errorCount} sản phẩm`);
    }
  }, [onLog]);
  
  // Execute bulk sync for brands
  const executeBulkSyncBrands = React.useCallback(async (
    brands: Brand[],
    actionKey: BulkSyncActionKey
  ) => {
    const linkedBrands = brands.filter(b => getPkgxBrandId(b));
    
    if (linkedBrands.length === 0) {
      toast.error('Không có thương hiệu nào đã liên kết PKGX');
      return;
    }
    
    setProgress({
      total: linkedBrands.length,
      completed: 0,
      success: 0,
      error: 0,
      isRunning: true,
    });
    
    const actionLabel = BULK_ACTION_LABELS[actionKey].title.toLowerCase();
    toast.info(`Đang ${actionLabel} ${linkedBrands.length} thương hiệu...`);
    
    let successCount = 0;
    let errorCount = 0;
    
    for (let i = 0; i < linkedBrands.length; i++) {
      const brand = linkedBrands[i];
      const pkgxBrandId = getPkgxBrandId(brand);
      
      if (!pkgxBrandId) {
        errorCount++;
        continue;
      }
      
      try {
        const payload = buildBrandPayload(brand, actionKey);
        const response = await updateBrand(pkgxBrandId, payload);
        
        if (response.success) {
          successCount++;
        } else {
          errorCount++;
        }
      } catch {
        errorCount++;
      }
      
      setProgress(prev => ({
        ...prev,
        completed: i + 1,
        success: successCount,
        error: errorCount,
      }));
    }
    
    setProgress(prev => ({ ...prev, isRunning: false }));
    
    // Show results
    if (successCount > 0) {
      toast.success(`Đã ${actionLabel} ${successCount} thương hiệu`);
      onLog?.({
        action: `bulk_${actionKey}`,
        status: 'success',
        message: `Đã ${actionLabel} ${successCount} thương hiệu`,
        details: { successCount, errorCount },
      });
    }
    if (errorCount > 0) {
      toast.error(`Lỗi ${errorCount} thương hiệu`);
    }
  }, [getPkgxBrandId, onLog]);
  
  // Trigger bulk sync with confirmation
  const triggerBulkSync = React.useCallback(<T extends Product | Brand>(
    items: T[],
    actionKey: BulkSyncActionKey
  ) => {
    if (!checkPkgxEnabled()) return;
    
    // Filter linked items
    let linkedCount = 0;
    let unlinkedCount = 0;
    
    if (entityType === 'product') {
      const products = items as Product[];
      linkedCount = products.filter(p => p.pkgxId).length;
      unlinkedCount = products.length - linkedCount;
    } else {
      const brands = items as Brand[];
      linkedCount = brands.filter(b => getPkgxBrandId(b)).length;
      unlinkedCount = brands.length - linkedCount;
    }
    
    if (linkedCount === 0) {
      toast.error(`Không có ${entityType === 'product' ? 'sản phẩm' : 'thương hiệu'} nào đã liên kết PKGX`);
      return;
    }
    
    const actionConfig = BULK_ACTION_LABELS[actionKey];
    const entityLabel = entityType === 'product' ? 'sản phẩm' : 'thương hiệu';
    
    let description = `Bạn có chắc muốn ${actionConfig.title.toLowerCase()} cho ${linkedCount} ${entityLabel}?`;
    if (unlinkedCount > 0) {
      description += `\n(${unlinkedCount} ${entityLabel} chưa liên kết sẽ bị bỏ qua)`;
    }
    
    setConfirmAction({
      open: true,
      title: actionConfig.title,
      description,
      itemCount: linkedCount,
      action: async () => {
        if (entityType === 'product') {
          await executeBulkSyncProducts(items as Product[], actionKey);
        } else {
          await executeBulkSyncBrands(items as Brand[], actionKey);
        }
      },
    });
  }, [entityType, checkPkgxEnabled, getPkgxBrandId, executeBulkSyncProducts, executeBulkSyncBrands]);
  
  // Execute confirmed action
  const executeAction = React.useCallback(async () => {
    if (confirmAction.action) {
      await confirmAction.action();
    }
    setConfirmAction({
      open: false,
      title: '',
      description: '',
      action: null,
      itemCount: 0,
    });
  }, [confirmAction.action]);
  
  // Cancel confirmation
  const cancelConfirm = React.useCallback(() => {
    setConfirmAction({
      open: false,
      title: '',
      description: '',
      action: null,
      itemCount: 0,
    });
  }, []);
  
  return {
    // Confirmation dialog state
    confirmAction,
    
    // Progress state
    progress,
    
    // Actions
    triggerBulkSync,
    executeAction,
    cancelConfirm,
    
    // Helpers
    checkPkgxEnabled,
    getPkgxBrandId,
    
    // Direct execute (without confirm)
    executeBulkSyncProducts,
    executeBulkSyncBrands,
  };
}

// Export types
export type UsePkgxBulkSyncReturn = ReturnType<typeof usePkgxBulkSync>;
