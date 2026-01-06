/**
 * Hook chứa các PKGX handlers sử dụng trong ProductsPage
 * Tách từ page.tsx để giảm kích thước file
 */
import React from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import type { Product } from '../types';
import type { PkgxProductPayload } from '@/features/settings/pkgx/types';
import { usePkgxSettingsStore } from '@/features/settings/pkgx/store';
import { useProductStore } from '../store';
import type { ProductQueryResult } from '../product-service';
import { formatDate } from '@/lib/date-utils';

// Types
type PkgxLogEntry = {
  action: string;
  status: 'success' | 'error' | 'partial' | 'info';
  message: string;
  details?: Record<string, unknown>;
};

type UsePkgxPageHandlersOptions = {
  addPkgxLog: (entry: PkgxLogEntry) => void;
  defaultSellingPolicy?: { systemId: string } | null;
  findBrandById?: (id: string) => { systemId: string; name: string } | undefined;
};

/**
 * Hook cung cấp các PKGX handlers cho ProductsPage
 */
export function usePkgxPageHandlers({
  addPkgxLog,
  defaultSellingPolicy,
  findBrandById,
}: UsePkgxPageHandlersOptions) {
  const queryClient = useQueryClient();
  const { settings: pkgxSettings } = usePkgxSettingsStore();
  const { update } = useProductStore();

  // ═══════════════════════════════════════════════════════════════
  // HELPER: Build PKGX product payload from HRM product (for Publish)
  // ═══════════════════════════════════════════════════════════════
  const buildPkgxPayload = React.useCallback((product: Product): PkgxProductPayload => {
    // Find mapped category
    const categoryMapping = pkgxSettings.categoryMappings.find(
      m => m.hrmCategorySystemId === product.categorySystemId
    );
    
    // Find mapped brand
    const brand = product.brandSystemId && findBrandById 
      ? findBrandById(product.brandSystemId) 
      : undefined;
    const brandMapping = brand ? pkgxSettings.brandMappings.find(
      m => m.hrmBrandSystemId === brand.systemId
    ) : undefined;
    
    // Get price from mapping or default
    const { priceMapping } = pkgxSettings;
    
    // Shop price (giá bán)
    let shopPrice = product.costPrice || 0;
    if (priceMapping.shopPrice && product.prices[priceMapping.shopPrice]) {
      shopPrice = product.prices[priceMapping.shopPrice];
    } else if (defaultSellingPolicy) {
      shopPrice = product.prices[defaultSellingPolicy.systemId] || shopPrice;
    }
    
    // Market price (giá thị trường)
    let marketPrice = shopPrice * 1.2; // Default markup
    if (priceMapping.marketPrice && product.prices[priceMapping.marketPrice]) {
      marketPrice = product.prices[priceMapping.marketPrice];
    }
    
    // Partner price (giá đối tác)
    let partnerPrice: number | undefined;
    if (priceMapping.partnerPrice && product.prices[priceMapping.partnerPrice]) {
      partnerPrice = product.prices[priceMapping.partnerPrice];
    }
    
    // ACE price (giá ACE)
    let acePrice: number | undefined;
    if (priceMapping.acePrice && product.prices[priceMapping.acePrice]) {
      acePrice = product.prices[priceMapping.acePrice];
    }
    
    // Deal price (giá khuyến mãi)
    let dealPrice: number | undefined;
    if (priceMapping.dealPrice && product.prices[priceMapping.dealPrice]) {
      dealPrice = product.prices[priceMapping.dealPrice];
    }
    
    // Calculate total inventory
    const totalInventory = product.inventoryByBranch
      ? Object.values(product.inventoryByBranch).reduce((sum, qty) => sum + (qty || 0), 0)
      : 0;
    
    // Get PKGX-specific SEO data (ưu tiên seoPkgx, fallback về field gốc)
    const pkgxSeo = product.seoPkgx;
    
    const payload: PkgxProductPayload = {
      // Thông tin cơ bản
      goods_name: product.name,
      goods_sn: product.id,
      cat_id: categoryMapping?.pkgxCatId || 0,
      brand_id: brandMapping?.pkgxBrandId || 0,
      seller_note: product.sellerNote || '',
      
      // Giá
      shop_price: shopPrice,
      market_price: marketPrice,
      goods_number: totalInventory,
      
      // Mô tả
      goods_desc: pkgxSeo?.longDescription || product.description || '',
      goods_brief: pkgxSeo?.shortDescription || product.shortDescription || '',
      
      // SEO
      keywords: pkgxSeo?.seoKeywords || product.tags?.join(', ') || product.name,
      meta_title: pkgxSeo?.seoTitle || product.ktitle || product.name,
      meta_desc: pkgxSeo?.metaDescription || product.seoDescription || '',
      
      // Hình ảnh
      original_img: product.thumbnailImage || product.images?.[0] || '',
      gallery_images: product.galleryImages || product.images || [],
      
      // Flags mapping
      best: product.isFeatured || false,
      hot: product.isBestSeller || false,
      new: product.isNewArrival || false,
      ishome: product.isFeatured || false,
      is_on_sale: product.isPublished ?? (product.status === 'active'),
    };
    
    // Add optional prices if mapped
    if (partnerPrice !== undefined) payload.partner_price = partnerPrice;
    if (acePrice !== undefined) payload.ace_price = acePrice;
    if (dealPrice !== undefined) payload.deal_price = dealPrice;
    
    return payload;
  }, [pkgxSettings, defaultSellingPolicy, findBrandById]);

  // ═══════════════════════════════════════════════════════════════
  // HANDLER: Publish product to PKGX
  // ═══════════════════════════════════════════════════════════════
  const handlePkgxPublish = React.useCallback(async (product: Product) => {
    if (product.pkgxId) {
      toast.warning('Sản phẩm đã được đăng lên PKGX');
      return;
    }
    
    if (!pkgxSettings.enabled) {
      toast.error('Tích hợp PKGX chưa được bật. Vui lòng bật trong Cài đặt > Tích hợp PKGX');
      return;
    }
    
    toast.loading(`Đang đăng sản phẩm lên PKGX...`, { id: 'pkgx-publish' });
    
    try {
      const payload = buildPkgxPayload(product);
      const { createProduct } = await import('@/lib/pkgx/api-service');
      const response = await createProduct(payload);
      
      if (response.success && response.data) {
        const goodsId = response.data.goods_id;
        
        // Save pkgxId to product store
        update(product.systemId, { pkgxId: goodsId });
        
        // Update React Query cache
        queryClient.setQueriesData<ProductQueryResult>(
          { queryKey: ['products'] },
          (oldData) => {
            if (!oldData) return oldData;
            return {
              ...oldData,
              items: oldData.items.map(item => 
                item.systemId === product.systemId 
                  ? { ...item, pkgxId: goodsId }
                  : item
              ),
            };
          }
        );
        
        toast.success(`Đã đăng sản phẩm lên PKGX! ID: ${goodsId}`, { id: 'pkgx-publish' });
        
        addPkgxLog({
          action: 'create_product',
          status: 'success',
          message: `Đã đăng sản phẩm: ${product.name}`,
          details: { productId: product.systemId, pkgxId: goodsId, productName: product.name },
        });
      } else {
        throw new Error(response.error);
      }
    } catch (error) {
      toast.error(`Lỗi đăng sản phẩm: ${error instanceof Error ? error.message : 'Unknown error'}`, { id: 'pkgx-publish' });
      addPkgxLog({
        action: 'create_product',
        status: 'error',
        message: `Lỗi đăng sản phẩm: ${product.name}`,
        details: { productId: product.systemId, error: error instanceof Error ? error.message : String(error) },
      });
    }
  }, [pkgxSettings, buildPkgxPayload, update, addPkgxLog, queryClient]);

  // ═══════════════════════════════════════════════════════════════
  // HANDLER: Unlink PKGX product
  // ═══════════════════════════════════════════════════════════════
  const handlePkgxUnlink = React.useCallback((product: Product) => {
    // Update store - xóa pkgxId
    update(product.systemId, { pkgxId: undefined });
    
    // Update React Query cache
    queryClient.setQueriesData<ProductQueryResult>(
      { queryKey: ['products'] },
      (oldData) => {
        if (!oldData) return oldData;
        return {
          ...oldData,
          items: oldData.items.map(item => 
            item.systemId === product.systemId 
              ? { ...item, pkgxId: undefined }
              : item
          ),
        };
      }
    );
    
    toast.success(`Đã hủy liên kết PKGX cho sản phẩm: ${product.name}`);
  }, [update, queryClient]);

  // ═══════════════════════════════════════════════════════════════
  // HANDLER: Update product status
  // ═══════════════════════════════════════════════════════════════
  const handleStatusChange = React.useCallback((product: Product, newStatus: 'active' | 'inactive') => {
    update(product.systemId, { status: newStatus });
    
    // Update React Query cache
    queryClient.setQueriesData<ProductQueryResult>(
      { queryKey: ['products'] },
      (oldData) => {
        if (!oldData) return oldData;
        return {
          ...oldData,
          items: oldData.items.map(item => 
            item.systemId === product.systemId 
              ? { ...item, status: newStatus }
              : item
          ),
        };
      }
    );
    
    toast.success(`${product.name}: ${newStatus === 'active' ? 'Đang bán' : 'Ngừng bán'}`);
  }, [update, queryClient]);

  // ═══════════════════════════════════════════════════════════════
  // HANDLER: Update product inventory
  // ═══════════════════════════════════════════════════════════════
  const handleInventoryChange = React.useCallback((product: Product, newQuantity: number) => {
    const branches = Object.keys(product.inventoryByBranch);
    if (branches.length === 0) {
      toast.error('Không tìm thấy chi nhánh để cập nhật tồn kho');
      return;
    }
    
    const defaultBranch = branches[0];
    const newInventory = { ...product.inventoryByBranch, [defaultBranch]: newQuantity };
    
    update(product.systemId, { inventoryByBranch: newInventory });
    
    // Update React Query cache
    queryClient.setQueriesData<ProductQueryResult>(
      { queryKey: ['products'] },
      (oldData) => {
        if (!oldData) return oldData;
        return {
          ...oldData,
          items: oldData.items.map(item => 
            item.systemId === product.systemId 
              ? { ...item, inventoryByBranch: newInventory }
              : item
          ),
        };
      }
    );
    
    toast.success(`Đã cập nhật tồn kho ${product.name}: ${newQuantity}`);
  }, [update, queryClient]);

  // ═══════════════════════════════════════════════════════════════
  // HANDLER: Update product field (inline edit)
  // ═══════════════════════════════════════════════════════════════
  const handleFieldUpdate = React.useCallback((product: Product, field: string, value: string | number | boolean) => {
    let updateData: Partial<Product>;
    
    if (field.startsWith('prices.')) {
      const policySystemId = field.replace('prices.', '');
      updateData = { prices: { ...product.prices, [policySystemId]: value as number } };
    } else {
      updateData = { [field]: value } as Partial<Product>;
    }
    
    update(product.systemId, updateData);
    
    // Update React Query cache
    queryClient.setQueriesData<ProductQueryResult>(
      { queryKey: ['products'] },
      (oldData) => {
        if (!oldData) return oldData;
        return {
          ...oldData,
          items: oldData.items.map(item => 
            item.systemId === product.systemId 
              ? { ...item, ...updateData }
              : item
          ),
        };
      }
    );
    
    // Show success toast with field label
    const fieldLabels: Record<string, string> = {
      pkgxId: 'ID PKGX',
      trendtechId: 'ID Trendtech',
      reorderLevel: 'Mức đặt hàng lại',
      safetyStock: 'Tồn kho an toàn',
      maxStock: 'Mức tồn tối đa',
      sellerNote: 'Ghi chú',
      isPublished: 'Đăng web',
      isFeatured: 'Nổi bật',
      isNewArrival: 'Mới về',
      isBestSeller: 'Bán chạy',
      isOnSale: 'Đang giảm giá',
      isStockTracked: 'Theo dõi kho',
      costPrice: 'Giá vốn',
      sortOrder: 'Thứ tự',
    };
    
    const label = field.startsWith('prices.') ? 'Giá' : (fieldLabels[field] || field);
    const displayValue = typeof value === 'boolean' 
      ? (value ? 'Bật' : 'Tắt') 
      : (typeof value === 'string' && value.includes('T') ? formatDate(new Date(value)) : value);
    toast.success(`Đã cập nhật ${label}: ${displayValue}`);
  }, [update, queryClient]);

  // ═══════════════════════════════════════════════════════════════
  // HELPERS: Bulk action payload builders
  // ═══════════════════════════════════════════════════════════════
  
  /** Get total inventory across all branches */
  const getTotalInventory = React.useCallback((product: Product): number => {
    if (!product.inventoryByBranch) return 0;
    return Object.values(product.inventoryByBranch).reduce((sum, qty) => sum + (qty || 0), 0);
  }, []);

  /** Create price update payload for PKGX bulk sync */
  const createPriceUpdatePayload = React.useCallback((product: Product): Partial<PkgxProductPayload> => {
    const { priceMapping } = pkgxSettings;
    const payload: Partial<PkgxProductPayload> = {};
    
    // Shop price
    if (priceMapping?.shopPrice && product.prices?.[priceMapping.shopPrice]) {
      payload.shop_price = product.prices[priceMapping.shopPrice];
    } else if (defaultSellingPolicy && product.prices?.[defaultSellingPolicy.systemId]) {
      payload.shop_price = product.prices[defaultSellingPolicy.systemId];
    } else if (product.costPrice) {
      payload.shop_price = product.costPrice;
    }
    
    // Other prices
    if (priceMapping?.marketPrice && product.prices?.[priceMapping.marketPrice]) {
      payload.market_price = product.prices[priceMapping.marketPrice];
    }
    if (priceMapping?.partnerPrice && product.prices?.[priceMapping.partnerPrice]) {
      payload.partner_price = product.prices[priceMapping.partnerPrice];
    }
    if (priceMapping?.acePrice && product.prices?.[priceMapping.acePrice]) {
      payload.ace_price = product.prices[priceMapping.acePrice];
    }
    if (priceMapping?.dealPrice && product.prices?.[priceMapping.dealPrice]) {
      payload.deal_price = product.prices[priceMapping.dealPrice];
    }
    
    return payload;
  }, [pkgxSettings, defaultSellingPolicy]);

  /** Create SEO update payload for PKGX bulk sync */
  const createSeoUpdatePayload = React.useCallback((product: Product): Partial<PkgxProductPayload> => {
    const pkgxSeo = product.seoPkgx;
    return {
      keywords: pkgxSeo?.seoKeywords || product.tags?.join(', ') || product.name,
      meta_title: pkgxSeo?.seoTitle || product.ktitle || product.name,
      meta_desc: pkgxSeo?.metaDescription || product.seoDescription || '',
      goods_brief: pkgxSeo?.shortDescription || product.shortDescription || '',
    };
  }, []);

  /** Create flags update payload for PKGX bulk sync */
  const createFlagsUpdatePayload = React.useCallback((product: Product): Partial<PkgxProductPayload> => {
    return {
      best: product.isFeatured || false,
      hot: product.isBestSeller || false,
      new: product.isNewArrival || false,
      ishome: product.isFeatured || false,
      is_on_sale: product.isPublished ?? (product.status === 'active'),
    };
  }, []);

  return {
    // Main handlers
    handlePkgxPublish,
    handlePkgxUnlink,
    handleStatusChange,
    handleInventoryChange,
    handleFieldUpdate,
    
    // Payload builders
    buildPkgxPayload,
    getTotalInventory,
    createPriceUpdatePayload,
    createSeoUpdatePayload,
    createFlagsUpdatePayload,
  };
}
