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
import { usePkgxMappings } from './use-pkgx-settings';
import type { PkgxSettings } from '../types';
import type { Product } from '../../../products/types';
import type { Brand } from '../../../settings/inventory/types';
import { logError } from '@/lib/logger'

// ========================================
// Types
// ========================================

export type BulkSyncEntityType = 'product' | 'brand';

export type BulkSyncActionKey = 
  | 'publish'
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

export interface ProductSyncHandlers {
  handlePkgxPublish: (product: Product) => Promise<void>;
  handlePkgxSyncAll: (product: Product) => Promise<void>;
  handlePkgxUpdatePrice: (product: Product) => Promise<void>;
  handlePkgxSyncInventory: (product: Product) => Promise<void>;
  handlePkgxUpdateSeo: (product: Product) => Promise<void>;
  handlePkgxSyncDescription: (product: Product) => Promise<void>;
  handlePkgxSyncFlags: (product: Product) => Promise<void>;
  handlePkgxSyncBasicInfo: (product: Product) => Promise<void>;
  handlePkgxSyncImages: (product: Product) => Promise<void>;
}

export interface BrandSyncHandlers {
  handleSyncAll: (brand: Brand) => Promise<void>;
  handleSyncBasicInfo: (brand: Brand) => Promise<void>;
  handleSyncSeo: (brand: Brand) => Promise<void>;
  handleSyncDescription: (brand: Brand) => Promise<void>;
}

export interface UsePkgxBulkSyncOptions {
  entityType: BulkSyncEntityType;
  /** Handlers from usePkgxSync - required for product bulk sync */
  productSyncHandlers?: ProductSyncHandlers;
  /** Handlers from usePkgxBrandSync - required for brand bulk sync */
  brandSyncHandlers?: BrandSyncHandlers;
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
  publish: {
    title: 'Đăng lên PKGX',
    description: 'Tạo sản phẩm mới trên PKGX (chỉ áp dụng cho sản phẩm chưa liên kết)',
  },
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
// Payload Builders (for Brands only - Products use handlers)
// ========================================

function _buildBrandPayload(brand: Brand, actionKey: BulkSyncActionKey): Record<string, unknown> {
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
  const { entityType, productSyncHandlers, brandSyncHandlers, onLog } = options;
  const { data: pkgxSettings } = usePkgxMappings();
  
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
  const checkPkgxEnabled = React.useCallback((settings: PkgxSettings | undefined) => {
    if (!settings?.enabled) {
      toast.error('PKGX chưa được bật');
      return false;
    }
    return true;
  }, []);
  
  // Helper to get PKGX brand ID from brand mappings
  const getPkgxBrandId = React.useCallback((brand: Brand, settings: PkgxSettings): number | undefined => {
    const mapping = settings.brandMappings.find(
      m => m.hrmBrandSystemId === brand.systemId
    );
    return mapping?.pkgxBrandId;
  }, []);
  
  // Map action key to handler
  const getProductHandler = React.useCallback((actionKey: BulkSyncActionKey): ((product: Product) => Promise<void>) | null => {
    if (!productSyncHandlers) return null;
    
    switch (actionKey) {
      case 'publish': return productSyncHandlers.handlePkgxPublish;
      case 'sync_all': return productSyncHandlers.handlePkgxSyncAll;
      case 'sync_price': return productSyncHandlers.handlePkgxUpdatePrice;
      case 'sync_inventory': return productSyncHandlers.handlePkgxSyncInventory;
      case 'sync_seo': return productSyncHandlers.handlePkgxUpdateSeo;
      case 'sync_description': return productSyncHandlers.handlePkgxSyncDescription;
      case 'sync_flags': return productSyncHandlers.handlePkgxSyncFlags;
      case 'sync_basic': return productSyncHandlers.handlePkgxSyncBasicInfo;
      case 'sync_images': return productSyncHandlers.handlePkgxSyncImages;
      default: return null;
    }
  }, [productSyncHandlers]);

  // Execute bulk sync for products - using handlers from usePkgxSync
  const executeBulkSyncProducts = React.useCallback(async (
    products: Product[],
    actionKey: BulkSyncActionKey
  ) => {
    // For publish action, filter products that are NOT linked yet
    // For sync actions, filter products that ARE linked
    const isPublishAction = actionKey === 'publish';
    const targetProducts = isPublishAction 
      ? products.filter(p => !p.pkgxId)
      : products.filter(p => p.pkgxId);
    
    if (targetProducts.length === 0) {
      if (isPublishAction) {
        toast.error('Tất cả sản phẩm đã được liên kết PKGX');
      } else {
        toast.error('Không có sản phẩm nào đã liên kết PKGX');
      }
      return;
    }
    
    const handler = getProductHandler(actionKey);
    if (!handler) {
      toast.error('Chức năng chưa được cấu hình. Vui lòng thử lại.');
      logError('[usePkgxBulkSync] No handler for action', actionKey);
      return;
    }
    
    setProgress({
      total: targetProducts.length,
      completed: 0,
      success: 0,
      error: 0,
      isRunning: true,
    });
    
    const actionLabel = BULK_ACTION_LABELS[actionKey].title.toLowerCase();
    
    let successCount = 0;
    let errorCount = 0;
    
    // Process sequentially to avoid overwhelming the API
    for (let i = 0; i < targetProducts.length; i++) {
      const product = targetProducts[i];
      try {
        // Call the handler from usePkgxSync - it handles everything (fetch prices, upload images, etc.)
        await handler(product);
        successCount++;
      } catch (error) {
        logError(`[usePkgxBulkSync] Error ${actionKey} product ${product.id}`, error);
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
  }, [onLog, getProductHandler]);
  
  // Map action key to brand handler
  const getBrandHandler = React.useCallback((actionKey: BulkSyncActionKey): ((brand: Brand) => Promise<void>) | null => {
    if (!brandSyncHandlers) return null;
    
    switch (actionKey) {
      case 'sync_all': return brandSyncHandlers.handleSyncAll;
      case 'sync_basic': return brandSyncHandlers.handleSyncBasicInfo;
      case 'sync_seo': return brandSyncHandlers.handleSyncSeo;
      case 'sync_description': return brandSyncHandlers.handleSyncDescription;
      default: return null;
    }
  }, [brandSyncHandlers]);

  // Execute bulk sync for brands - using handlers from usePkgxBrandSync
  const executeBulkSyncBrands = React.useCallback(async (
    brands: Brand[],
    actionKey: BulkSyncActionKey
  ) => {
    const linkedBrands = brands.filter(b => getPkgxBrandId(b, pkgxSettings!));
    
    if (linkedBrands.length === 0) {
      toast.error('Không có thương hiệu nào đã liên kết PKGX');
      return;
    }
    
    const handler = getBrandHandler(actionKey);
    if (!handler) {
      toast.error('Chức năng chưa được cấu hình. Vui lòng thử lại.');
      logError('[usePkgxBulkSync] No brand handler for action', actionKey);
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
    
    let successCount = 0;
    let errorCount = 0;
    
    for (let i = 0; i < linkedBrands.length; i++) {
      const brand = linkedBrands[i];
      
      try {
        // Call the handler from usePkgxBrandSync - unified logic
        await handler(brand);
        successCount++;
      } catch (error) {
        logError(`[usePkgxBulkSync] Error syncing brand ${brand.name}`, error);
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
  }, [getPkgxBrandId, onLog, pkgxSettings, getBrandHandler]);
  
  // Trigger bulk sync with confirmation
  const triggerBulkSync = React.useCallback(<T extends Product | Brand>(
    items: T[],
    actionKey: BulkSyncActionKey
  ) => {
    if (!checkPkgxEnabled(pkgxSettings)) return;
    
    const totalSelected = items.length;
    const entityLabel = entityType === 'product' ? 'sản phẩm' : 'thương hiệu';
    const isPublishAction = actionKey === 'publish';
    
    // Count linked/unlinked items
    let linkedCount = 0;
    let unlinkedCount = 0;
    
    if (entityType === 'product') {
      const products = items as Product[];
      linkedCount = products.filter(p => p.pkgxId).length;
      unlinkedCount = products.length - linkedCount;
    } else {
      const brands = items as Brand[];
      linkedCount = brands.filter(b => getPkgxBrandId(b, pkgxSettings!)).length;
      unlinkedCount = brands.length - linkedCount;
    }
    
    // For publish: target unlinked items, for sync: target linked items
    const targetCount = isPublishAction ? unlinkedCount : linkedCount;
    const skippedCount = isPublishAction ? linkedCount : unlinkedCount;
    
    if (targetCount === 0) {
      if (isPublishAction) {
        toast.error(`Tất cả ${entityLabel} đã được liên kết PKGX, không có gì để đăng mới`);
      } else {
        toast.error(`Không có ${entityLabel} nào đã liên kết PKGX để đồng bộ`);
      }
      return;
    }
    
    const actionConfig = BULK_ACTION_LABELS[actionKey];
    
    // Build description with clear counts
    let description = '';
    if (skippedCount > 0) {
      // Mixed selection - show X/Y format
      description = `Sẽ xử lý ${targetCount}/${totalSelected} ${entityLabel}`;
      if (isPublishAction) {
        description += ` (chưa liên kết PKGX).\n${skippedCount} ${entityLabel} đã liên kết sẽ bị bỏ qua.`;
      } else {
        description += ` (đã liên kết PKGX).\n${skippedCount} ${entityLabel} chưa liên kết sẽ bị bỏ qua.`;
      }
    } else {
      // All selected items will be processed
      description = `${actionConfig.description}\n\nXử lý ${targetCount} ${entityLabel}.`;
    }
    
    setConfirmAction({
      open: true,
      title: `${actionConfig.title} (${targetCount}/${totalSelected})`,
      description,
      itemCount: targetCount,
      action: async () => {
        if (entityType === 'product') {
          await executeBulkSyncProducts(items as Product[], actionKey);
        } else {
          await executeBulkSyncBrands(items as Brand[], actionKey);
        }
      },
    });
  }, [entityType, checkPkgxEnabled, getPkgxBrandId, executeBulkSyncProducts, executeBulkSyncBrands, pkgxSettings]);
  
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
  }, [confirmAction]);
  
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
