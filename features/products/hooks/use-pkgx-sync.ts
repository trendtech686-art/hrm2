/**
 * Hook chứa tất cả các handlers để đồng bộ sản phẩm với PKGX
 */
import React from 'react';
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';
import type { Product } from '../types';
import type { SystemId } from '@/lib/id-types';
import { updateProduct, uploadImageSmart, processHtmlImagesForPkgx, createProduct as createPkgxProduct } from '@/lib/pkgx/api-service';
import { usePkgxMappings } from '@/features/settings/pkgx/hooks/use-pkgx-settings';
import { useImageStore } from '../image-store';
import { fetchProduct, updateProduct as updateHrmProduct } from '../api/products-api';
import { productKeys } from './use-products';
import { useBrandFinder } from '@/features/brands/hooks/use-all-brands';
import { useAllPricingPolicies } from '@/features/settings/pricing/hooks/use-all-pricing-policies';
import { logError } from '@/lib/logger'

/**
 * Fetch fresh product data with prices if prices are empty
 * This is needed because product list API returns empty prices for performance
 */
async function ensureProductWithPrices(product: Product): Promise<Product> {
  // ALWAYS fetch full product data from API to ensure we have all fields
  // This is important because list page may not have all data (images, seoPkgx, etc.)
  try {
    const freshProduct = await fetchProduct(product.systemId);
    return freshProduct;
  } catch {
    return product;
  }
}

// Types
type PkgxLogEntry = {
  action: 
    | 'ping'
    | 'test_connection'
    | 'sync_all'
    | 'sync_price'
    | 'sync_inventory'
    | 'sync_seo'
    | 'sync_description'
    | 'sync_flags'
    | 'sync_basic_info'
    | 'sync_images'
    | 'create_product'
    | 'update_product'
    | 'link_product'
    | 'unlink_product'
    | 'unlink_mapping'
    | 'sync_categories'
    | 'sync_brands'
    | 'get_products'
    | 'upload_image'
    | 'save_config'
    | 'save_mapping';
  status: 'success' | 'error' | 'partial' | 'info';
  message: string;
  details?: Record<string, unknown>;
};

type UsePkgxSyncOptions = {
  addPkgxLog?: (entry: PkgxLogEntry) => void;
  // Optional overrides to avoid duplicate API calls when page already has this data
  brandFinder?: (id: string) => { systemId: string; name: string } | undefined;
  pricingPolicies?: Array<{ systemId: string; name: string; type: string; isActive: boolean; isDefault: boolean }>;
};

// Type for imported data from PKGX
export type PkgxImportedData = {
  name: string;
  id: string;
  description?: string;
  ktitle?: string;
  seoDescription?: string;
  seoKeywords?: string;
  shortDescription?: string;
  prices: Record<string, number>;
  websiteSeo: {
    pkgx: {
      seoTitle?: string;
      metaDescription?: string;
      seoKeywords?: string;
      shortDescription?: string;
      longDescription?: string;
    };
  };
};

/**
 * Hook cung cấp các handlers để đồng bộ sản phẩm với PKGX
 */
export function usePkgxSync(options?: UsePkgxSyncOptions) {
  const addPkgxLog = React.useMemo(() => options?.addPkgxLog ?? (() => {}), [options?.addPkgxLog]);
  const { data: pkgxSettings, isLoading: isPkgxSettingsLoading } = usePkgxMappings();
  const queryClient = useQueryClient();
  // Use provided overrides or fall back to hooks (disabled when overrides exist to avoid duplicate API calls)
  const hasExternalBrands = !!options?.brandFinder;
  const hasExternalPricing = !!options?.pricingPolicies;
  const { findById: hookBrandFinder } = useBrandFinder({ enabled: !hasExternalBrands });
  const { data: hookPricingPolicies } = useAllPricingPolicies({ enabled: !hasExternalPricing });
  const findBrandById = options?.brandFinder ?? hookBrandFinder;
  const pricingPolicies = options?.pricingPolicies ?? hookPricingPolicies;
  const defaultSellingPolicy = React.useMemo(() => pricingPolicies.find(p => p.type === 'Bán hàng' && p.isDefault), [pricingPolicies]);

  // ═══════════════════════════════════════════════════════════════
  // HELPER: Get price by mapping
  // ═══════════════════════════════════════════════════════════════
  const getPriceByMapping = React.useCallback((product: Product, pkgxPriceField: string): number | undefined => {
    const priceMapping = pkgxSettings?.priceMapping;
    if (!priceMapping) return undefined;
    
    // priceMapping is PkgxPriceMapping { shopPrice, partnerPrice, price5Vat, price12Novat, price5Novat }
    // Each field contains SystemId of HRM pricing policy
    let hrmPriceSystemId: string | null = null;
    
    switch (pkgxPriceField) {
      case 'shopPrice': hrmPriceSystemId = priceMapping.shopPrice; break;
      case 'partnerPrice': hrmPriceSystemId = priceMapping.partnerPrice; break;
      case 'price5Vat': hrmPriceSystemId = priceMapping.price5Vat; break;
      case 'price12Novat': hrmPriceSystemId = priceMapping.price12Novat; break;
      case 'price5Novat': hrmPriceSystemId = priceMapping.price5Novat; break;
    }
    
    if (!hrmPriceSystemId) return undefined;
    return product.prices?.[hrmPriceSystemId];
  }, [pkgxSettings]);

  // ═══════════════════════════════════════════════════════════════
  // HELPER: Check if has price mapping
  // ═══════════════════════════════════════════════════════════════
  const hasPriceMapping = React.useMemo(() => {
    const priceMapping = pkgxSettings?.priceMapping;
    return priceMapping && (
      priceMapping.shopPrice || 
      priceMapping.partnerPrice ||
      priceMapping.price5Vat ||
      priceMapping.price12Novat ||
      priceMapping.price5Novat
    );
  }, [pkgxSettings]);

  // ═══════════════════════════════════════════════════════════════
  // HELPER: Get mapped category ID
  // ═══════════════════════════════════════════════════════════════
  const getMappedCategoryId = React.useCallback((product: Product): number | undefined => {
    if (!pkgxSettings?.categoryMappings || !product.categorySystemId) return undefined;
    const mapping = pkgxSettings.categoryMappings.find(m => m.hrmCategorySystemId === product.categorySystemId);
    return mapping?.pkgxCatId;
  }, [pkgxSettings?.categoryMappings]);

  // ═══════════════════════════════════════════════════════════════
  // HELPER: Get mapped brand ID
  // ═══════════════════════════════════════════════════════════════
  const getMappedBrandId = React.useCallback((product: Product): number | undefined => {
    if (!pkgxSettings?.brandMappings || !product.brandSystemId) return undefined;
    const mapping = pkgxSettings.brandMappings.find(m => m.hrmBrandSystemId === product.brandSystemId);
    return mapping?.pkgxBrandId;
  }, [pkgxSettings?.brandMappings]);

  // ═══════════════════════════════════════════════════════════════
  // 1. SYNC GIÁ (bao gồm cả giá thành viên ace)
  // ═══════════════════════════════════════════════════════════════
  const handlePkgxUpdatePrice = React.useCallback(async (productInput: Product) => {
    if (!productInput.pkgxId) {
      toast.error('Sản phẩm chưa được liên kết với PKGX');
      return;
    }

    if (!hasPriceMapping) {
      toast.error('Chưa cấu hình mapping giá. Vui lòng vào Cài đặt > PKGX > Mapping Giá để thiết lập.');
      return;
    }
    
    // pkgxId is guaranteed to be a number after the check above
    const pkgxId = productInput.pkgxId;
    
    toast.loading(`Đang đồng bộ giá...`, { id: 'pkgx-sync-price' });
    
    try {
      // Ensure we have fresh product data with prices
      const product = await ensureProductWithPrices(productInput);
      
      const payload: Record<string, number> = {};
      
      const shopPrice = getPriceByMapping(product, 'shopPrice');
      if (shopPrice !== undefined) payload.shop_price = shopPrice;
      
      const partnerPrice = getPriceByMapping(product, 'partnerPrice');
      if (partnerPrice !== undefined) payload.partner_price = partnerPrice;

      const price5Vat = getPriceByMapping(product, 'price5Vat');
      if (price5Vat !== undefined) payload.price_5vat = price5Vat;

      const price12Novat = getPriceByMapping(product, 'price12Novat');
      if (price12Novat !== undefined) payload.price_12novat = price12Novat;

      const price5Novat = getPriceByMapping(product, 'price5Novat');
      if (price5Novat !== undefined) payload.price_5novat = price5Novat;

      if (Object.keys(payload).length === 0) {
        toast.error('Không có giá nào được mapping. Vui lòng kiểm tra cấu hình.', { id: 'pkgx-sync-price' });
        return;
      }
      
      // 1. Sync giá vào bảng goods
      const response = await updateProduct(pkgxId, payload, pkgxSettings);
      
      if (!response.success) {
        throw new Error(response.error);
      }
      
      toast.success(`Đã đồng bộ giá: ${product.name}`, { id: 'pkgx-sync-price' });
      addPkgxLog({
        action: 'sync_price',
        status: 'success',
        message: `Đã đồng bộ giá: ${product.name}`,
        details: { 
          productId: product.systemId, 
          pkgxId: product.pkgxId, 
          prices: payload,
        },
      });
    } catch (error) {
      toast.error(`Lỗi đồng bộ giá: ${error instanceof Error ? error.message : 'Unknown error'}`, { id: 'pkgx-sync-price' });
      addPkgxLog({
        action: 'sync_price',
        status: 'error',
        message: `Lỗi đồng bộ giá: ${productInput.name}`,
        details: { productId: productInput.systemId, error: error instanceof Error ? error.message : String(error) },
      });
    }
  }, [hasPriceMapping, getPriceByMapping, addPkgxLog, pkgxSettings]);

  // ═══════════════════════════════════════════════════════════════
  // 2. SYNC TỒN KHO
  // ═══════════════════════════════════════════════════════════════
  const handlePkgxSyncInventory = React.useCallback(async (product: Product) => {
    if (!product.pkgxId) {
      toast.error('Sản phẩm chưa được liên kết với PKGX');
      return;
    }
    
    toast.loading(`Đang đồng bộ tồn kho...`, { id: 'pkgx-sync-inventory' });
    
    try {
      // Get inventory based on defaultBranchId setting
      // - If no defaultBranchId or "all": sum all branches
      // - If specific branchId: use only that branch's inventory
      const defaultBranchId = pkgxSettings?.defaultBranchId;
      let totalInventory = 0;
      
      if (product.inventoryByBranch) {
        if (!defaultBranchId || defaultBranchId === 'all') {
          // Sum all branches
          totalInventory = Object.values(product.inventoryByBranch).reduce((sum, qty) => sum + (qty || 0), 0);
        } else {
          // Use specific branch inventory
          totalInventory = product.inventoryByBranch[defaultBranchId as SystemId] || 0;
        }
      }
      
      const response = await updateProduct(product.pkgxId, {
        goods_number: totalInventory,
      }, pkgxSettings);
      
      if (response.success) {
        toast.success(`Đã đồng bộ tồn kho: ${totalInventory} sản phẩm`, { id: 'pkgx-sync-inventory' });
        addPkgxLog({
          action: 'sync_inventory',
          status: 'success',
          message: `Đã đồng bộ tồn kho: ${product.name} (${totalInventory})`,
          details: { productId: product.systemId, pkgxId: product.pkgxId, inventory: totalInventory, branchId: defaultBranchId || 'all' },
        });
      } else {
        throw new Error(response.error);
      }
    } catch (error) {
      toast.error(`Lỗi đồng bộ tồn kho: ${error instanceof Error ? error.message : 'Unknown error'}`, { id: 'pkgx-sync-inventory' });
      addPkgxLog({
        action: 'sync_inventory',
        status: 'error',
        message: `Lỗi đồng bộ tồn kho: ${product.name}`,
        details: { productId: product.systemId, error: error instanceof Error ? error.message : String(error) },
      });
    }
  }, [addPkgxLog, pkgxSettings]);

  // ═══════════════════════════════════════════════════════════════
  // 3. SYNC SEO
  // ═══════════════════════════════════════════════════════════════
  const handlePkgxUpdateSeo = React.useCallback(async (productInput: Product) => {
    if (!productInput.pkgxId) {
      toast.error('Sản phẩm chưa được liên kết với PKGX');
      return;
    }
    
    // pkgxId is guaranteed to be a number after the check above
    const pkgxId = productInput.pkgxId;
    
    toast.loading(`Đang đồng bộ SEO...`, { id: 'pkgx-sync-seo' });
    
    try {
      // Ensure we have fresh product data
      const product = await ensureProductWithPrices(productInput);
      
      const pkgxSeo = product.seoPkgx;
      // Fallback chain: SEO PKGX → SEO Chung → tags → name
      const seoPayload = {
        keywords: pkgxSeo?.seoKeywords || product.seoKeywords || product.tags?.join(', ') || product.name,
        meta_title: pkgxSeo?.seoTitle || product.ktitle || product.name,
        meta_desc: pkgxSeo?.metaDescription || product.seoDescription || '',
      };
      
      // DEBUG: Log payload để kiểm tra
      
      const response = await updateProduct(pkgxId, seoPayload, pkgxSettings);
      
      if (response.success) {
        toast.success(`Đã đồng bộ SEO cho sản phẩm: ${product.name}`, { id: 'pkgx-sync-seo' });
        addPkgxLog({
          action: 'sync_seo',
          status: 'success',
          message: `Đã đồng bộ SEO: ${product.name}`,
          details: { productId: product.systemId, pkgxId },
        });
      } else {
        throw new Error(response.error);
      }
    } catch (error) {
      toast.error(`Lỗi đồng bộ SEO: ${error instanceof Error ? error.message : 'Unknown error'}`, { id: 'pkgx-sync-seo' });
      addPkgxLog({
        action: 'sync_seo',
        status: 'error',
        message: `Lỗi đồng bộ SEO: ${productInput.name}`,
        details: { productId: productInput.systemId, error: error instanceof Error ? error.message : String(error) },
      });
    }
  }, [addPkgxLog, pkgxSettings]);

  // ═══════════════════════════════════════════════════════════════
  // 4. SYNC MÔ TẢ (với xử lý ảnh trong HTML)
  // ═══════════════════════════════════════════════════════════════
  const handlePkgxSyncDescription = React.useCallback(async (productInput: Product) => {
    if (!productInput.pkgxId) {
      toast.error('Sản phẩm chưa được liên kết với PKGX');
      return;
    }
    
    // pkgxId is guaranteed to be a number after the check above
    const pkgxId = productInput.pkgxId;
    
    toast.loading(`Đang đồng bộ mô tả...`, { id: 'pkgx-sync-desc' });
    
    try {
      // Ensure we have fresh product data with descriptions
      const product = await ensureProductWithPrices(productInput);
      
      const pkgxSeo = product.seoPkgx;
      
      // Get raw descriptions
      const rawLongDesc = pkgxSeo?.longDescription || product.description || '';
      const rawShortDesc = pkgxSeo?.shortDescription || product.shortDescription || '';
      
      // Process images in long description (upload to PKGX and replace URLs)
      let processedLongDesc = rawLongDesc;
      let imageStats = { uploadedCount: 0, skippedCount: 0, errors: [] as string[] };
      
      if (rawLongDesc.includes('<img')) {
        toast.loading(`Đang xử lý ảnh trong mô tả...`, { id: 'pkgx-sync-desc' });
        
        const filenamePrefix = product.id || `product-${pkgxId}`;
        const result = await processHtmlImagesForPkgx(rawLongDesc, filenamePrefix);
        
        processedLongDesc = result.processedHtml;
        imageStats = result;
        
        if (result.uploadedCount > 0) {
          toast.loading(`Đã upload ${result.uploadedCount} ảnh, đang cập nhật mô tả...`, { id: 'pkgx-sync-desc' });
        }
      }
      
      // Sync to PKGX
      const response = await updateProduct(pkgxId, {
        goods_desc: processedLongDesc,
        goods_brief: rawShortDesc,
      }, pkgxSettings);
      
      if (response.success) {
        const message = imageStats.uploadedCount > 0
          ? `Đã đồng bộ mô tả (${imageStats.uploadedCount} ảnh đã upload)`
          : `Đã đồng bộ mô tả`;
          
        toast.success(message, { id: 'pkgx-sync-desc' });
        addPkgxLog({
          action: 'sync_description',
          status: imageStats.errors.length > 0 ? 'partial' : 'success',
          message: `${message}: ${product.name}`,
          details: { 
            productId: product.systemId, 
            pkgxId: product.pkgxId,
            imagesUploaded: imageStats.uploadedCount,
            imagesSkipped: imageStats.skippedCount,
            imageErrors: imageStats.errors,
          },
        });
      } else {
        throw new Error(response.error);
      }
    } catch (error) {
      toast.error(`Lỗi đồng bộ mô tả: ${error instanceof Error ? error.message : 'Unknown error'}`, { id: 'pkgx-sync-desc' });
      addPkgxLog({
        action: 'sync_description',
        status: 'error',
        message: `Lỗi đồng bộ mô tả: ${productInput.name}`,
        details: { productId: productInput.systemId, error: error instanceof Error ? error.message : String(error) },
      });
    }
  }, [addPkgxLog, pkgxSettings]);

  // ═══════════════════════════════════════════════════════════════
  // 5. SYNC FLAGS (best, hot, new, ishome, is_on_sale)
  // ═══════════════════════════════════════════════════════════════
  const handlePkgxSyncFlags = React.useCallback(async (product: Product) => {
    if (!product.pkgxId) {
      toast.error('Sản phẩm chưa được liên kết với PKGX');
      return;
    }
    
    toast.loading(`Đang đồng bộ flags...`, { id: 'pkgx-sync-flags' });
    
    try {
      const isActive = product.status?.toString().toUpperCase() === 'ACTIVE';
      const response = await updateProduct(product.pkgxId, {
        // PKGX API expects: best, hot, new, ishome (not is_best, is_hot, is_new, is_home)
        best: product.isFeatured ? 1 : 0,
        hot: product.isBestSeller ? 1 : 0,
        new: product.isNewArrival ? 1 : 0,
        ishome: product.isFeatured ? 1 : 0,
        is_on_sale: (product.isPublished ?? isActive) ? 1 : 0,
      }, pkgxSettings);
      
      if (response.success) {
        toast.success(`Đã đồng bộ flags`, { id: 'pkgx-sync-flags' });
        addPkgxLog({
          action: 'sync_flags',
          status: 'success',
          message: `Đã đồng bộ flags: ${product.name}`,
          details: { productId: product.systemId, pkgxId: product.pkgxId },
        });
      } else {
        throw new Error(response.error);
      }
    } catch (error) {
      toast.error(`Lỗi đồng bộ flags: ${error instanceof Error ? error.message : 'Unknown error'}`, { id: 'pkgx-sync-flags' });
      addPkgxLog({
        action: 'sync_flags',
        status: 'error',
        message: `Lỗi đồng bộ flags: ${product.name}`,
        details: { productId: product.systemId, error: error instanceof Error ? error.message : String(error) },
      });
    }
  }, [addPkgxLog, pkgxSettings]);

  // ═══════════════════════════════════════════════════════════════
  // 6. SYNC THÔNG TIN CƠ BẢN (tên, SKU, category, brand, seller_note)
  // ═══════════════════════════════════════════════════════════════
  const handlePkgxSyncBasicInfo = React.useCallback(async (product: Product) => {
    if (!product.pkgxId) {
      toast.error('Sản phẩm chưa được liên kết với PKGX');
      return;
    }
    
    toast.loading(`Đang đồng bộ thông tin cơ bản...`, { id: 'pkgx-sync-basic' });
    
    try {
      const payload: Record<string, unknown> = {
        goods_name: product.name,
        goods_sn: product.id,
        seller_note: product.sellerNote || '',
      };

      // Map category nếu có
      const catId = getMappedCategoryId(product);
      if (catId) payload.cat_id = catId;

      // Map brand nếu có  
      const brandId = getMappedBrandId(product);
      if (brandId) payload.brand_id = brandId;

      const response = await updateProduct(product.pkgxId, payload, pkgxSettings);
      
      if (response.success) {
        toast.success(`Đã đồng bộ thông tin cơ bản`, { id: 'pkgx-sync-basic' });
        addPkgxLog({
          action: 'sync_basic_info',
          status: 'success',
          message: `Đã đồng bộ thông tin cơ bản: ${product.name}`,
          details: { productId: product.systemId, pkgxId: product.pkgxId, payload },
        });
      } else {
        throw new Error(response.error);
      }
    } catch (error) {
      toast.error(`Lỗi đồng bộ thông tin cơ bản: ${error instanceof Error ? error.message : 'Unknown error'}`, { id: 'pkgx-sync-basic' });
      addPkgxLog({
        action: 'sync_basic_info',
        status: 'error',
        message: `Lỗi đồng bộ thông tin cơ bản: ${product.name}`,
        details: { productId: product.systemId, error: error instanceof Error ? error.message : String(error) },
      });
    }
  }, [getMappedCategoryId, getMappedBrandId, addPkgxLog, pkgxSettings]);

  // ═══════════════════════════════════════════════════════════════
  // 7. SYNC HÌNH ẢNH (ảnh đại diện + album gallery)
  // Logic: Fetch ảnh từ HRM server trước, upload lên PKGX, rồi sync đường dẫn
  // ═══════════════════════════════════════════════════════════════
  const handlePkgxSyncImages = React.useCallback(async (product: Product) => {
    if (!product.pkgxId) {
      toast.error('Sản phẩm chưa được liên kết với PKGX');
      return;
    }

    toast.loading('Đang lấy thông tin hình ảnh...', { id: 'pkgx-sync-images' });

    // ===== STEP 1: Fetch ảnh từ HRM server =====
    const thumbnailUrls: string[] = [];
    const galleryUrls: string[] = [];

    // Helper: Kiểm tra URL có thể truy cập từ internet không
    const isPublicUrl = (url: string): boolean => {
      if (!url) return false;
      // Bỏ qua localhost, 127.0.0.1, hoặc internal IP
      if (url.includes('localhost') || url.includes('127.0.0.1') || url.includes('192.168.')) {
        return false;
      }
      return true;
    };

    try {
      // Import động để tránh circular dependency
      const { FileUploadAPI } = await import('@/lib/file-upload-api');
      const files = await FileUploadAPI.getProductFiles(product.systemId);
      
      
      // Phân loại ảnh theo documentName - CHỈ lấy URL public
      for (const file of files) {
        if (file.documentName === 'thumbnail' && file.url && isPublicUrl(file.url)) {
          thumbnailUrls.push(file.url);
        } else if (file.documentName === 'gallery' && file.url && isPublicUrl(file.url)) {
          galleryUrls.push(file.url);
        }
      }
    } catch (_fetchError) {
      // Silently fail - fallback to product object
    }

    // ===== STEP 2: Fallback về product object nếu server không có ảnh =====

    // Nếu server không có, dùng từ product object - CHỈ lấy URL public
    if (thumbnailUrls.length === 0 && product.thumbnailImage && isPublicUrl(product.thumbnailImage)) {
      thumbnailUrls.push(product.thumbnailImage);
    }
    if (galleryUrls.length === 0 && product.galleryImages?.length) {
      galleryUrls.push(...product.galleryImages.filter(isPublicUrl));
    }
    // Legacy fallback
    if (thumbnailUrls.length === 0 && galleryUrls.length === 0 && product.images?.length) {
      const publicImages = product.images.filter(isPublicUrl);
      if (publicImages.length > 0) {
        thumbnailUrls.push(publicImages[0]);
        if (publicImages.length > 1) {
          galleryUrls.push(...publicImages.slice(1));
        }
      }
    }

    // Cũng check image-store (ảnh đã upload vào HRM nhưng chưa fetch từ server)
    const imageStoreState = useImageStore.getState();
    const permanentThumbnails = imageStoreState.getPermanentImages(product.systemId, 'thumbnail');
    const permanentGallery = imageStoreState.getPermanentImages(product.systemId, 'gallery');

    // Merge với image-store nếu có - CHỈ lấy URL public
    if (permanentThumbnails.length > 0 && thumbnailUrls.length === 0) {
      thumbnailUrls.push(...permanentThumbnails.map(f => f.url).filter(url => url && isPublicUrl(url)));
    }
    if (permanentGallery.length > 0 && galleryUrls.length === 0) {
      galleryUrls.push(...permanentGallery.map(f => f.url).filter(url => url && isPublicUrl(url)));
    }


    // Final main image và gallery
    const mainImage = thumbnailUrls[0] || null;
    const galleryImages = galleryUrls;


    if (!mainImage && galleryImages.length === 0) {
      toast.error('Sản phẩm chưa có hình ảnh', { id: 'pkgx-sync-images' });
      return;
    }
    
    const totalImages = (mainImage ? 1 : 0) + galleryImages.length;
    toast.loading(`Đang đồng bộ ${totalImages} hình ảnh...`, { id: 'pkgx-sync-images' });
    
    try {
      // Tạo slug từ tên sản phẩm cho filename
      const baseSlug = (product.name || 'product')
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/đ/g, 'd')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '')
        .substring(0, 50);

      let uploadedMainImg: string | null = null;
      const uploadedGalleryPaths: string[] = [];
      let errorCount = 0;

      // Helper function: Upload ảnh từ URL (smart - hỗ trợ cả localhost và public URL)
      const uploadFromUrl = async (imageUrl: string, slugSuffix: string): Promise<string | null> => {
        try {
          // Kiểm tra nếu là đường dẫn local trên PKGX (đã upload trước đó)
          if (imageUrl.startsWith('images/') || imageUrl.includes('/cdn/images/')) {
            // Đã là path trên PKGX, không cần upload lại
            const cleanPath = imageUrl.replace(/.*\/cdn\//, '').replace(/^cdn\//, '');
            return cleanPath;
          }

          // Sử dụng uploadImageSmart - tự động chọn phương thức phù hợp
          // - Localhost: upload file trực tiếp qua multipart/form-data
          // - Public URL: PKGX server fetch từ URL
          const uploadResult = await uploadImageSmart(imageUrl, {
            filenameSlug: `${baseSlug}-${slugSuffix}`,
          }, pkgxSettings);

          if (!uploadResult.success || !uploadResult.data) {
            throw new Error(uploadResult.error || 'Upload thất bại');
          }

          // Trả về đường dẫn original_img
          return uploadResult.data.data?.original_img || null;
        } catch (err) {
          logError(`Lỗi upload ảnh ${imageUrl}`, err);
          return null;
        }
      };

      // Upload ảnh đại diện
      if (mainImage) {
        toast.loading(`Đang upload ảnh đại diện...`, { id: 'pkgx-sync-images' });
        uploadedMainImg = await uploadFromUrl(mainImage, 'main');
        if (!uploadedMainImg) {
          errorCount++;
        }
      }

      // Upload gallery images
      if (galleryImages.length > 0) {
        for (let i = 0; i < galleryImages.length; i++) {
          toast.loading(`Đang upload ảnh ${i + 1}/${galleryImages.length}...`, { id: 'pkgx-sync-images' });
          const galleryPath = await uploadFromUrl(galleryImages[i], `gallery-${i + 1}`);
          if (galleryPath) {
            uploadedGalleryPaths.push(galleryPath);
          } else {
            errorCount++;
          }
        }
      }

      // Kiểm tra có gì để sync không
      if (!uploadedMainImg && uploadedGalleryPaths.length === 0) {
        throw new Error('Không thể upload bất kỳ ảnh nào');
      }

      // Build payload để sync vào sản phẩm
      const payload: Record<string, unknown> = {};
      
      if (uploadedMainImg) {
        payload.original_img = uploadedMainImg;
      }
      
      if (uploadedGalleryPaths.length > 0) {
        payload.gallery_images = uploadedGalleryPaths;
      }

      // Sync đường dẫn vào sản phẩm
      toast.loading(`Đang cập nhật sản phẩm...`, { id: 'pkgx-sync-images' });
      const response = await updateProduct(product.pkgxId, payload, pkgxSettings);
      
      if (response.success) {
        const syncedCount = (uploadedMainImg ? 1 : 0) + uploadedGalleryPaths.length;
        const message = errorCount > 0 
          ? `Đã đồng bộ ${syncedCount} hình ảnh (${errorCount} lỗi)`
          : `Đã đồng bộ ${syncedCount} hình ảnh`;
        
        toast.success(message, { id: 'pkgx-sync-images' });
        addPkgxLog({
          action: 'sync_images',
          status: errorCount > 0 ? 'partial' : 'success',
          message: `${message}: ${product.name}`,
          details: { 
            productId: product.systemId, 
            pkgxId: product.pkgxId, 
            uploadedMainImg,
            galleryCount: uploadedGalleryPaths.length,
            uploadedGalleryPaths,
            errorCount,
          },
        });
      } else {
        throw new Error(response.error);
      }
    } catch (error) {
      toast.error(`Lỗi đồng bộ hình ảnh: ${error instanceof Error ? error.message : 'Unknown error'}`, { id: 'pkgx-sync-images' });
      addPkgxLog({
        action: 'sync_images',
        status: 'error',
        message: `Lỗi đồng bộ hình ảnh: ${product.name}`,
        details: { productId: product.systemId, error: error instanceof Error ? error.message : String(error) },
      });
    }
  }, [addPkgxLog, pkgxSettings]);

  // ═══════════════════════════════════════════════════════════════
  // 8. SYNC TẤT CẢ (Full sync, bao gồm xử lý ảnh trong mô tả)
  // ═══════════════════════════════════════════════════════════════
  const handlePkgxSyncAll = React.useCallback(async (productInput: Product) => {
    if (isPkgxSettingsLoading) {
      toast.error('Đang tải cấu hình PKGX, vui lòng thử lại sau giây lát.');
      return;
    }
    
    if (!pkgxSettings?.enabled) {
      toast.error('Tích hợp PKGX chưa được bật. Vui lòng bật trong Cài đặt > PKGX > Cấu hình chung.');
      return;
    }
    
    if (!productInput.pkgxId) {
      toast.error('Sản phẩm chưa được liên kết với PKGX');
      return;
    }
    
    // pkgxId is guaranteed to be a number after the check above
    const pkgxId = productInput.pkgxId;
    
    toast.loading(`Đang đồng bộ tất cả thông tin...`, { id: 'pkgx-sync-all' });
    
    try {
      // Ensure we have fresh product data with prices and descriptions
      const product = await ensureProductWithPrices(productInput);
      
      const pkgxSeo = product.seoPkgx;
      
      // Get raw descriptions
      const rawLongDesc = pkgxSeo?.longDescription || product.description || '';
      const rawShortDesc = pkgxSeo?.shortDescription || product.shortDescription || '';
      
      // Process images in long description
      let processedLongDesc = rawLongDesc;
      let imageStats = { uploadedCount: 0, skippedCount: 0, errors: [] as string[] };
      
      if (rawLongDesc.includes('<img')) {
        toast.loading(`Đang xử lý ảnh trong mô tả...`, { id: 'pkgx-sync-all' });
        
        const filenamePrefix = product.id || `product-${pkgxId}`;
        const result = await processHtmlImagesForPkgx(rawLongDesc, filenamePrefix, pkgxSettings);
        
        processedLongDesc = result.processedHtml;
        imageStats = result;
      }
      
      // Tạo slug từ tên sản phẩm cho filename ảnh
      const baseSlug = (product.name || 'product')
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/đ/g, 'd')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '')
        .substring(0, 50);
      
      // Helper: Kiểm tra và upload ảnh nếu là URL external
      const prepareImageForPkgx = async (imageUrl: string | undefined, suffix: string): Promise<string | undefined> => {
        if (!imageUrl) return undefined;
        
        // Normalize backslash to forward slash trong URL
        const normalizedUrl = imageUrl.replace(/\\/g, '/');
        
        // Nếu đã là path PKGX local (không phải URL), dùng trực tiếp
        // VD: 'images/...' - path relative trong PKGX CDN
        if (!normalizedUrl.startsWith('http://') && !normalizedUrl.startsWith('https://') && !normalizedUrl.startsWith('/')) {
          // Có thể là path như 'images/...' - dùng trực tiếp
          return normalizedUrl;
        }
        
        // Nếu là URL từ PKGX CDN, extract path
        if (normalizedUrl.includes('phukiengiaxuong.com.vn/cdn/')) {
          return normalizedUrl.replace(/.*phukiengiaxuong\.com\.vn\/cdn\//, '');
        }
        
        // Nếu là URL local (bắt đầu bằng /api/files/...), convert sang absolute URL
        if (normalizedUrl.startsWith('/')) {
          // URL local - cần upload lên PKGX
          const absoluteUrl = typeof window !== 'undefined' 
            ? `${window.location.origin}${normalizedUrl}`
            : `http://localhost:3000${normalizedUrl}`;
          
          toast.loading(`Đang upload ảnh ${suffix}...`, { id: 'pkgx-sync-all' });
          
          const uploadResult = await uploadImageSmart(absoluteUrl, {
            filenameSlug: `${baseSlug}-${suffix}`,
            goodsId: pkgxId,
          }, pkgxSettings);
          
          if (uploadResult.success && uploadResult.data?.data?.original_img) {
            return uploadResult.data.data.original_img;
          }
          
          logError(`Lỗi upload ảnh ${suffix}`, uploadResult.error);
          return undefined;
        }
        
        // Là URL external (localhost hoặc khác) - cần upload lên PKGX
        toast.loading(`Đang upload ảnh ${suffix}...`, { id: 'pkgx-sync-all' });
        
        const uploadResult = await uploadImageSmart(normalizedUrl, {
          filenameSlug: `${baseSlug}-${suffix}`,
          goodsId: pkgxId,
        }, pkgxSettings);
        
        if (uploadResult.success && uploadResult.data?.data?.original_img) {
          return uploadResult.data.data.original_img;
        }
        
        logError(`Lỗi upload ảnh ${suffix}`, uploadResult.error);
        return undefined;
      };
      
      // Upload ảnh đại diện nếu cần - normalize URL trước
      const thumbnailUrl = product.thumbnailImage?.replace(/\\/g, '/');
      const uploadedMainImg = await prepareImageForPkgx(thumbnailUrl, 'main');
      
      // Upload gallery images nếu cần - normalize URL trước
      const galleryImages = (product.galleryImages || product.images || []).map(url => url?.replace(/\\/g, '/'));
      const uploadedGalleryPaths: string[] = [];
      
      for (let i = 0; i < galleryImages.length; i++) {
        const galleryPath = await prepareImageForPkgx(galleryImages[i], `gallery-${i + 1}`);
        if (galleryPath) {
          uploadedGalleryPaths.push(galleryPath);
        }
      }
      
      // Get inventory based on defaultBranchId setting
      const defaultBranchId = pkgxSettings?.defaultBranchId;
      let inventoryForPkgx = 0;
      if (product.inventoryByBranch) {
        if (!defaultBranchId || defaultBranchId === 'all') {
          inventoryForPkgx = Object.values(product.inventoryByBranch).reduce((sum, qty) => sum + (qty || 0), 0);
        } else {
          inventoryForPkgx = product.inventoryByBranch[defaultBranchId as SystemId] || 0;
        }
      }
      
      // Build full payload
      const payload: Record<string, unknown> = {
        // Thông tin cơ bản
        goods_name: product.name,
        goods_sn: product.id,
        
        // Tồn kho (từ kho mặc định hoặc tổng)
        goods_number: inventoryForPkgx,
        
        // SEO
        keywords: pkgxSeo?.seoKeywords || product.tags?.join(', ') || product.name,
        meta_title: pkgxSeo?.seoTitle || product.ktitle || product.name,
        meta_desc: pkgxSeo?.metaDescription || product.seoDescription || '',
        
        // Mô tả (đã xử lý ảnh)
        goods_desc: processedLongDesc,
        goods_brief: rawShortDesc,
        
        // Flags - PKGX API expects: best, hot, new, ishome (not is_best, is_hot, is_new, is_home)
        best: product.isFeatured ? 1 : 0,
        new: product.isNewArrival ? 1 : 0,
        hot: product.isBestSeller ? 1 : 0,
        ishome: product.isFeatured ? 1 : 0,
        is_on_sale: (product.isPublished ?? (product.status?.toString().toUpperCase() === 'ACTIVE')) ? 1 : 0,
        
        // Seller note (ghi chú nội bộ)
        seller_note: product.sellerNote || '',
        
        // Image - ảnh đại diện (đã upload)
        ...(uploadedMainImg && { original_img: uploadedMainImg }),
      };

      // Gallery images (album ảnh) - đã upload
      if (uploadedGalleryPaths.length > 0) {
        payload.gallery_images = uploadedGalleryPaths;
      }

      // Map category
      const catId = getMappedCategoryId(product);
      if (catId) payload.cat_id = catId;

      // Map brand
      const brandId = getMappedBrandId(product);
      if (brandId) payload.brand_id = brandId;

      // Map prices
      const shopPrice = getPriceByMapping(product, 'shopPrice');
      if (shopPrice !== undefined) payload.shop_price = shopPrice;
      
      const partnerPrice = getPriceByMapping(product, 'partnerPrice');
      if (partnerPrice !== undefined) payload.partner_price = partnerPrice;

      const price5Vat = getPriceByMapping(product, 'price5Vat');
      if (price5Vat !== undefined) payload.price_5vat = price5Vat;

      const price12Novat = getPriceByMapping(product, 'price12Novat');
      if (price12Novat !== undefined) payload.price_12novat = price12Novat;

      const price5Novat = getPriceByMapping(product, 'price5Novat');
      if (price5Novat !== undefined) payload.price_5novat = price5Novat;

      const response = await updateProduct(pkgxId, payload, pkgxSettings);
      
      if (response.success) {
        const message = imageStats.uploadedCount > 0
          ? `Đã đồng bộ tất cả (${imageStats.uploadedCount} ảnh trong mô tả đã upload)`
          : `Đã đồng bộ tất cả thông tin`;
          
        toast.success(message, { id: 'pkgx-sync-all' });
        addPkgxLog({
          action: 'sync_all',
          status: imageStats.errors.length > 0 ? 'partial' : 'success',
          message: `${message}: ${product.name}`,
          details: { 
            productId: product.systemId, 
            pkgxId,
            imagesUploaded: imageStats.uploadedCount,
            imagesSkipped: imageStats.skippedCount,
            imageErrors: imageStats.errors,
          },
        });
      } else {
        throw new Error(response.error);
      }
    } catch (error) {
      toast.error(`Lỗi đồng bộ: ${error instanceof Error ? error.message : 'Unknown error'}`, { id: 'pkgx-sync-all' });
      addPkgxLog({
        action: 'sync_all',
        status: 'error',
        message: `Lỗi đồng bộ tất cả: ${productInput.name}`,
        details: { productId: productInput.systemId, error: error instanceof Error ? error.message : String(error) },
      });
    }
  }, [getMappedCategoryId, getMappedBrandId, getPriceByMapping, addPkgxLog, pkgxSettings, isPkgxSettingsLoading]);

  // ═══════════════════════════════════════════════════════════════
  // 9. IMPORT DATA TỪ PKGX VỀ HRM (kéo title, meta, name, description, giá)
  // ═══════════════════════════════════════════════════════════════
  const handleImportFromPkgx = React.useCallback(async (product: Product, onImportSuccess?: (data: PkgxImportedData) => void) => {
    if (!product.pkgxId) {
      toast.error('Sản phẩm chưa được liên kết với PKGX');
      return;
    }
    
    toast.loading(`Đang import dữ liệu từ PKGX...`, { id: 'pkgx-product-import' });
    
    try {
      const { getProductById } = await import('@/lib/pkgx/api-service');
      const response = await getProductById(product.pkgxId, pkgxSettings);
      
      if (response.success && response.data) {
        const pkgxData = response.data;
        
        // Chuẩn bị data để fill form
        const importedData = {
          // Thông tin cơ bản
          name: pkgxData.goods_name || product.name,
          id: pkgxData.goods_sn || product.id,
          description: pkgxData.goods_brief || product.description,
          
          // SEO fields (use seoPkgx nested data structure)
          ktitle: pkgxData.meta_title || product.ktitle,
          seoDescription: pkgxData.meta_desc || product.seoDescription,
          seoKeywords: pkgxData.keywords || product.seoKeywords,
          shortDescription: pkgxData.goods_brief || product.shortDescription,
          
          // Giá (nếu có price mapping)
          prices: {} as Record<string, number>,
          
          // Website SEO (lưu vào pkgx nested object)
          websiteSeo: {
            pkgx: {
              seoTitle: pkgxData.meta_title,
              metaDescription: pkgxData.meta_desc,
              seoKeywords: pkgxData.keywords,
              shortDescription: pkgxData.goods_brief,
              longDescription: pkgxData.goods_desc,
            }
          }
        };
        
        // Map prices từ PKGX về HRM pricing policies
        const priceMapping = pkgxSettings?.priceMapping;
        if (priceMapping) {
          if (priceMapping.shopPrice && pkgxData.shop_price) {
            importedData.prices[priceMapping.shopPrice] = pkgxData.shop_price;
          }
          if (priceMapping.partnerPrice && pkgxData.partner_price) {
            importedData.prices[priceMapping.partnerPrice] = pkgxData.partner_price;
          }
          if (priceMapping.price5Vat && pkgxData.price_5vat) {
            importedData.prices[priceMapping.price5Vat] = pkgxData.price_5vat;
          }
          if (priceMapping.price12Novat && pkgxData.price_12novat) {
            importedData.prices[priceMapping.price12Novat] = pkgxData.price_12novat;
          }
          if (priceMapping.price5Novat && pkgxData.price_5novat) {
            importedData.prices[priceMapping.price5Novat] = pkgxData.price_5novat;
          }
        }
        
        toast.success(`Đã import dữ liệu từ PKGX: ${pkgxData.goods_name}`, { id: 'pkgx-product-import' });
        
        // Callback để parent component update form
        if (onImportSuccess) {
          onImportSuccess(importedData);
        }
        
        addPkgxLog({
          action: 'sync_all',
          status: 'success',
          message: `Import thành công từ PKGX: ${pkgxData.goods_name}`,
          details: { productId: product.systemId, pkgxId: product.pkgxId, importedData },
        });
      } else {
        throw new Error(response.error || 'Không tìm thấy dữ liệu');
      }
    } catch (error) {
      toast.error(`Lỗi import từ PKGX: ${error instanceof Error ? error.message : 'Unknown error'}`, { id: 'pkgx-product-import' });
      addPkgxLog({
        action: 'sync_all',
        status: 'error',
        message: `Lỗi import từ PKGX: ${product.name}`,
        details: { productId: product.systemId, error: error instanceof Error ? error.message : String(error) },
      });
    }
  }, [pkgxSettings, addPkgxLog]);

  // ═══════════════════════════════════════════════════════════════
  // HANDLER: Publish new product to PKGX
  // ═══════════════════════════════════════════════════════════════
  const handlePkgxPublish = React.useCallback(async (product: Product) => {
    if (isPkgxSettingsLoading) {
      toast.error('Đang tải cấu hình PKGX, vui lòng thử lại sau giây lát.');
      return;
    }
    
    if (!pkgxSettings?.enabled) {
      toast.error('Tích hợp PKGX chưa được bật. Vui lòng bật trong Cài đặt > PKGX > Cấu hình chung.');
      return;
    }
    
    if (product.pkgxId) {
      toast.error('Sản phẩm đã được liên kết PKGX');
      return;
    }
    
    toast.loading(`Đang đăng sản phẩm lên PKGX...`, { id: 'pkgx-publish' });

    try {
      // Ensure we have full product data with prices
      const fullProduct = await ensureProductWithPrices(product);
    
    // Build payload
    const catMap = pkgxSettings.categoryMappings?.find(m => m.hrmCategorySystemId === fullProduct.categorySystemId);
    const brand = fullProduct.brandSystemId ? findBrandById(fullProduct.brandSystemId) : undefined;
    const brandMap = brand ? pkgxSettings.brandMappings?.find(m => m.hrmBrandSystemId === brand.systemId) : undefined;
    const priceMapping = pkgxSettings.priceMapping ?? {};
    
    // Check if category mapping exists - PKGX requires cat_id
    if (!catMap?.pkgxCatId) {
      const categoryName = fullProduct.categorySystemId 
        ? `Danh mục "${fullProduct.categorySystemId}" chưa được mapping với PKGX.`
        : 'Sản phẩm chưa có danh mục.';
      toast.error(`Không thể đăng: ${categoryName} Vui lòng vào Cài đặt > PKGX > Mapping Danh mục để thiết lập.`, { id: 'pkgx-publish' });
      return;
    }
    
    // Get prices from mapping
    let shopPrice = fullProduct.costPrice || 0;
    if (priceMapping.shopPrice && fullProduct.prices[priceMapping.shopPrice]) {
      shopPrice = fullProduct.prices[priceMapping.shopPrice];
    } else if (defaultSellingPolicy) {
      shopPrice = fullProduct.prices[defaultSellingPolicy.systemId] || shopPrice;
    }
    
    // Get additional prices from mapping
    let partnerPrice: number | undefined;
    if (priceMapping.partnerPrice && fullProduct.prices[priceMapping.partnerPrice]) {
      partnerPrice = fullProduct.prices[priceMapping.partnerPrice];
    }
    
    // Get inventory based on defaultBranchId setting
    const defaultBranchId = pkgxSettings?.defaultBranchId;
    let totalInventory = 0;
    if (fullProduct.inventoryByBranch) {
      if (!defaultBranchId || defaultBranchId === 'all') {
        totalInventory = Object.values(fullProduct.inventoryByBranch).reduce((s, q) => s + (q || 0), 0);
      } else {
        totalInventory = fullProduct.inventoryByBranch[defaultBranchId as SystemId] || 0;
      }
    }
    const seo = fullProduct.seoPkgx;
    const isActive = fullProduct.status?.toString().toUpperCase() === 'ACTIVE';
    
    // ===== STEP: Fetch images from FileUploadAPI (like handlePkgxSyncImages) =====
    toast.loading(`Đang lấy thông tin hình ảnh...`, { id: 'pkgx-publish' });
    
    const thumbnailUrls: string[] = [];
    const galleryUrls: string[] = [];
    
    try {
      const { FileUploadAPI } = await import('@/lib/file-upload-api');
      const files = await FileUploadAPI.getProductFiles(fullProduct.systemId);
      
      for (const file of files) {
        if (file.documentName === 'thumbnail' && file.url) {
          thumbnailUrls.push(file.url);
        } else if (file.documentName === 'gallery' && file.url) {
          galleryUrls.push(file.url);
        }
      }
    } catch (fetchError) {
      console.warn('🖼️ [handlePkgxPublish] Could not fetch files from API:', fetchError);
    }
    
    // Fallback to product object if API has no images
    if (thumbnailUrls.length === 0 && fullProduct.thumbnailImage) {
      thumbnailUrls.push(fullProduct.thumbnailImage);
    }
    if (galleryUrls.length === 0 && fullProduct.galleryImages?.length) {
      galleryUrls.push(...fullProduct.galleryImages);
    }
    if (thumbnailUrls.length === 0 && galleryUrls.length === 0 && fullProduct.images?.length) {
      thumbnailUrls.push(fullProduct.images[0]);
      if (fullProduct.images.length > 1) {
        galleryUrls.push(...fullProduct.images.slice(1));
      }
    }
    
    // Also check image-store
    const imageStoreState = useImageStore.getState();
    const permanentThumbnails = imageStoreState.getPermanentImages(fullProduct.systemId, 'thumbnail');
    const permanentGallery = imageStoreState.getPermanentImages(fullProduct.systemId, 'gallery');
    
    if (permanentThumbnails.length > 0 && thumbnailUrls.length === 0) {
      thumbnailUrls.push(...permanentThumbnails.map(f => f.url).filter(Boolean));
    }
    if (permanentGallery.length > 0 && galleryUrls.length === 0) {
      galleryUrls.push(...permanentGallery.map(f => f.url).filter(Boolean));
    }
    
    const mainImage = thumbnailUrls[0] || null;
    const galleryImages = galleryUrls;
    
    // Upload images to PKGX server
    toast.loading(`Đang upload hình ảnh...`, { id: 'pkgx-publish' });
    
    const prepareImageForPkgx = async (imageUrl: string | undefined, suffix: string): Promise<string | undefined> => {
      if (!imageUrl) {
        return undefined;
      }
      
      // If already on PKGX server, use as-is
      if (imageUrl.includes('pkgx.vn') || imageUrl.includes('trendtech')) {
        return imageUrl;
      }
      
      // Upload to PKGX using smart upload
      const uploadResult = await uploadImageSmart(
        imageUrl,
        { filenameSlug: `${fullProduct.id}-${suffix}` },
        pkgxSettings
      );
      
      if (uploadResult.success && uploadResult.data?.data?.original_img) {
        return uploadResult.data.data.original_img;
      }
      
      return undefined;
    };
    
    // Upload thumbnail image (using mainImage from FileUploadAPI)
    const uploadedMainImg = await prepareImageForPkgx(mainImage?.replace(/\\/g, '/'), 'main');
    
    // Upload gallery images (using galleryImages from FileUploadAPI)
    const uploadedGalleryPaths: string[] = [];
    
    for (let i = 0; i < galleryImages.length; i++) {
      const galleryPath = await prepareImageForPkgx(galleryImages[i]?.replace(/\\/g, '/'), `gallery-${i + 1}`);
      if (galleryPath) {
        uploadedGalleryPaths.push(galleryPath);
      }
    }
    
    // Process images in description HTML
    toast.loading(`Đang xử lý mô tả...`, { id: 'pkgx-publish' });
    const rawLongDesc = seo?.longDescription || fullProduct.description || '';
    const { processedHtml: processedLongDesc } = await processHtmlImagesForPkgx(
      rawLongDesc,
      fullProduct.id,
      pkgxSettings
    );
    const rawShortDesc = seo?.shortDescription || fullProduct.shortDescription || '';
    
    toast.loading(`Đang tạo sản phẩm trên PKGX...`, { id: 'pkgx-publish' });
    
    const payload: Record<string, unknown> = {
      goods_name: fullProduct.name,
      goods_sn: fullProduct.id,
      cat_id: catMap?.pkgxCatId || 0,
      brand_id: brandMap?.pkgxBrandId || 0,
      seller_note: fullProduct.sellerNote || '',
      shop_price: shopPrice,
      goods_number: totalInventory,
      goods_desc: processedLongDesc,
      goods_brief: rawShortDesc,
      keywords: seo?.seoKeywords || fullProduct.tags?.join(', ') || fullProduct.name,
      meta_title: seo?.seoTitle || fullProduct.ktitle || fullProduct.name,
      meta_desc: seo?.metaDescription || fullProduct.seoDescription || '',
      best: fullProduct.isFeatured ? 1 : 0,
      hot: fullProduct.isBestSeller ? 1 : 0,
      new: fullProduct.isNewArrival ? 1 : 0,
      ishome: fullProduct.isFeatured ? 1 : 0,
      is_on_sale: (fullProduct.isPublished ?? isActive) ? 1 : 0,
    };
    
    // Add uploaded images to payload
    if (uploadedMainImg) {
      payload.original_img = uploadedMainImg;
    }
    if (uploadedGalleryPaths.length > 0) {
      payload.gallery_images = uploadedGalleryPaths;
    }
    
    // Add additional prices if mapped
    if (partnerPrice !== undefined) payload.partner_price = partnerPrice;
    
    const response = await createPkgxProduct(payload, pkgxSettings);
    
    if (response.success && response.data) {
      const pkgxId = response.data.goods_id;
      
      // PKGX create_product may not support original_img
      // So we need to call update_product to set the images after creation
      if (uploadedMainImg || uploadedGalleryPaths.length > 0) {
        toast.loading(`Đang cập nhật hình ảnh...`, { id: 'pkgx-publish' });
        
        const imagePayload: Record<string, unknown> = {};
        if (uploadedMainImg) {
          imagePayload.original_img = uploadedMainImg;
        }
        if (uploadedGalleryPaths.length > 0) {
          imagePayload.gallery_images = uploadedGalleryPaths;
        }
        
        await updateProduct(pkgxId, imagePayload, pkgxSettings);
      }
      
      // Update HRM product with pkgxId
      await updateHrmProduct({ systemId: fullProduct.systemId, pkgxId });
      
      // ✅ Cập nhật cache trực tiếp thay vì invalidate (tránh refetch toàn bộ)
      // Dùng ['products'] để match TẤT CẢ các query products (có các params khác nhau)
      queryClient.setQueriesData<{ data?: Product[]; items?: Product[]; pagination?: unknown }>(
        { queryKey: ['products'] },
        (old) => {
          if (!old) return old;
          // Handle both `data` array (from use-products) and `items` array (from use-products-query)
          if (old.data) {
            return {
              ...old,
              data: old.data.map(p => 
                p.systemId === fullProduct.systemId 
                  ? { ...p, pkgxId } 
                  : p
              ),
            };
          }
          if (old.items) {
            return {
              ...old,
              items: old.items.map(p => 
                p.systemId === fullProduct.systemId 
                  ? { ...p, pkgxId } 
                  : p
              ),
            };
          }
          return old;
        }
      );
      
      // Update single product cache (both formats)
      queryClient.setQueryData<Product>(
        productKeys.detail(fullProduct.systemId),
        (old) => old ? { ...old, pkgxId } : old
      );
      queryClient.setQueryData<Product>(
        ['product', fullProduct.systemId],
        (old) => old ? { ...old, pkgxId } : old
      );
      
      addPkgxLog({
        action: 'create_product',
        status: 'success',
        message: `Đã đăng: ${fullProduct.name}`,
        details: { productId: fullProduct.systemId, pkgxId },
      });
      
      toast.success(`Đã đăng lên PKGX: ${fullProduct.name}`, { id: 'pkgx-publish' });
    } else {
      throw new Error(response.error || 'Không thể tạo sản phẩm trên PKGX');
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
  }, [pkgxSettings, isPkgxSettingsLoading, findBrandById, defaultSellingPolicy, queryClient, addPkgxLog]);

  // ═══════════════════════════════════════════════════════════════
  // HANDLER: Unlink product from PKGX (remove pkgxId)
  // ═══════════════════════════════════════════════════════════════
  const handlePkgxUnlink = React.useCallback(async (product: Product) => {
    if (!product.pkgxId) {
      toast.error('Sản phẩm chưa được liên kết với PKGX');
      return;
    }
    
    const oldPkgxId = product.pkgxId;
    toast.loading(`Đang hủy liên kết PKGX...`, { id: 'pkgx-unlink' });
    
    try {
      // Update HRM product to remove pkgxId
      await updateHrmProduct({ systemId: product.systemId, pkgxId: null });
      
      // ✅ Cập nhật cache trực tiếp thay vì invalidate (tránh refetch toàn bộ)
      // Dùng ['products'] để match TẤT CẢ các query products
      queryClient.setQueriesData<{ data?: Product[]; items?: Product[]; pagination?: unknown }>(
        { queryKey: ['products'] },
        (old) => {
          if (!old) return old;
          // Handle both `data` array and `items` array
          if (old.data) {
            return {
              ...old,
              data: old.data.map(p => 
                p.systemId === product.systemId 
                  ? { ...p, pkgxId: undefined } 
                  : p
              ),
            };
          }
          if (old.items) {
            return {
              ...old,
              items: old.items.map(p => 
                p.systemId === product.systemId 
                  ? { ...p, pkgxId: undefined } 
                  : p
              ),
            };
          }
          return old;
        }
      );
      
      // Update single product cache (both formats)
      queryClient.setQueryData<Product>(
        productKeys.detail(product.systemId),
        (old) => old ? { ...old, pkgxId: undefined } : old
      );
      queryClient.setQueryData<Product>(
        ['product', product.systemId],
        (old) => old ? { ...old, pkgxId: undefined } : old
      );
      
      toast.success(`Đã hủy liên kết: ${product.name}`, { id: 'pkgx-unlink' });
      addPkgxLog({
        action: 'unlink_product',
        status: 'success',
        message: `Đã hủy liên kết: ${product.name}`,
        details: { productId: product.systemId, oldPkgxId },
      });
    } catch (error) {
      toast.error(`Lỗi hủy liên kết: ${error instanceof Error ? error.message : 'Unknown error'}`, { id: 'pkgx-unlink' });
      addPkgxLog({
        action: 'unlink_product',
        status: 'error',
        message: `Lỗi hủy liên kết: ${product.name}`,
        details: { productId: product.systemId, error: error instanceof Error ? error.message : String(error) },
      });
    }
  }, [queryClient, addPkgxLog]);

  return {
    // Publish handler (create new)
    handlePkgxPublish,
    // Unlink handler
    handlePkgxUnlink,
    // Sync handlers
    handlePkgxUpdatePrice,
    handlePkgxSyncInventory,
    handlePkgxUpdateSeo,
    handlePkgxSyncDescription,
    handlePkgxSyncFlags,
    handlePkgxSyncBasicInfo,
    handlePkgxSyncImages,
    handlePkgxSyncAll,
    handleImportFromPkgx,
    // Helpers
    hasPriceMapping,
  };
}
