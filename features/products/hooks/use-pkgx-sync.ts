/**
 * Hook chứa tất cả các handlers để đồng bộ sản phẩm với PKGX
 */
import React from 'react';
import { toast } from 'sonner';
import type { Product } from '../types';
import { updateProduct, updateMemberPrice, uploadImageFromUrl, processHtmlImagesForPkgx } from '@/lib/pkgx/api-service';
import { usePkgxSettingsStore } from '@/features/settings/pkgx/store';
import { useImageStore } from '../image-store';

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
  addPkgxLog: (entry: PkgxLogEntry) => void;
};

/**
 * Hook cung cấp các handlers để đồng bộ sản phẩm với PKGX
 */
export function usePkgxSync({ addPkgxLog }: UsePkgxSyncOptions) {
  const { settings: pkgxSettings } = usePkgxSettingsStore();

  // ═══════════════════════════════════════════════════════════════
  // HELPER: Get price by mapping
  // ═══════════════════════════════════════════════════════════════
  const getPriceByMapping = React.useCallback((product: Product, pkgxPriceField: string): number | undefined => {
    const { priceMapping } = pkgxSettings;
    if (!priceMapping) return undefined;
    
    // priceMapping is PkgxPriceMapping { shopPrice, marketPrice, partnerPrice, acePrice, dealPrice }
    // Each field contains SystemId of HRM pricing policy
    let hrmPriceSystemId: string | null = null;
    
    switch (pkgxPriceField) {
      case 'shopPrice': hrmPriceSystemId = priceMapping.shopPrice; break;
      case 'marketPrice': hrmPriceSystemId = priceMapping.marketPrice; break;
      case 'partnerPrice': hrmPriceSystemId = priceMapping.partnerPrice; break;
      case 'acePrice': hrmPriceSystemId = priceMapping.acePrice; break;
      case 'dealPrice': hrmPriceSystemId = priceMapping.dealPrice; break;
    }
    
    if (!hrmPriceSystemId) return undefined;
    return product.prices?.[hrmPriceSystemId];
  }, [pkgxSettings]);

  // ═══════════════════════════════════════════════════════════════
  // HELPER: Check if has price mapping
  // ═══════════════════════════════════════════════════════════════
  const hasPriceMapping = React.useMemo(() => {
    const { priceMapping } = pkgxSettings;
    return priceMapping && (
      priceMapping.shopPrice || 
      priceMapping.marketPrice || 
      priceMapping.partnerPrice || 
      priceMapping.acePrice || 
      priceMapping.dealPrice
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
  const handlePkgxUpdatePrice = React.useCallback(async (product: Product) => {
    if (!product.pkgxId) {
      toast.error('Sản phẩm chưa được liên kết với PKGX');
      return;
    }

    if (!hasPriceMapping) {
      toast.error('Chưa cấu hình mapping giá. Vui lòng vào Cài đặt > PKGX > Mapping Giá để thiết lập.');
      return;
    }
    
    toast.loading(`Đang đồng bộ giá...`, { id: 'pkgx-sync-price' });
    
    try {
      const payload: Record<string, number> = {};
      
      const shopPrice = getPriceByMapping(product, 'shopPrice');
      if (shopPrice !== undefined) payload.shop_price = shopPrice;
      
      const marketPrice = getPriceByMapping(product, 'marketPrice');
      if (marketPrice !== undefined) payload.market_price = marketPrice;
      
      const partnerPrice = getPriceByMapping(product, 'partnerPrice');
      if (partnerPrice !== undefined) payload.partner_price = partnerPrice;
      
      const acePrice = getPriceByMapping(product, 'acePrice');
      if (acePrice !== undefined) payload.ace_price = acePrice;
      
      const dealPrice = getPriceByMapping(product, 'dealPrice');
      if (dealPrice !== undefined) payload.deal_price = dealPrice;

      if (Object.keys(payload).length === 0) {
        toast.error('Không có giá nào được mapping. Vui lòng kiểm tra cấu hình.', { id: 'pkgx-sync-price' });
        return;
      }
      
      // 1. Sync giá vào bảng goods
      const response = await updateProduct(product.pkgxId, payload);
      
      if (!response.success) {
        throw new Error(response.error);
      }

      // 2. Sync giá ace vào member_price table (ace = rank_id 8)
      let memberPriceSynced = false;
      if (acePrice !== undefined && acePrice > 0) {
        const memberPriceResponse = await updateMemberPrice(product.pkgxId, [
          { user_rank: 8, user_price: acePrice }
        ]);
        memberPriceSynced = memberPriceResponse.success;
      }
      
      const successMsg = memberPriceSynced 
        ? `Đã đồng bộ giá + giá ace thành viên: ${product.name}`
        : `Đã đồng bộ giá: ${product.name}`;
      
      toast.success(successMsg, { id: 'pkgx-sync-price' });
      addPkgxLog({
        action: 'sync_price',
        status: 'success',
        message: successMsg,
        details: { 
          productId: product.systemId, 
          pkgxId: product.pkgxId, 
          prices: payload,
          memberPriceSynced,
          acePrice: acePrice 
        },
      });
    } catch (error) {
      toast.error(`Lỗi đồng bộ giá: ${error instanceof Error ? error.message : 'Unknown error'}`, { id: 'pkgx-sync-price' });
      addPkgxLog({
        action: 'sync_price',
        status: 'error',
        message: `Lỗi đồng bộ giá: ${product.name}`,
        details: { productId: product.systemId, error: error instanceof Error ? error.message : String(error) },
      });
    }
  }, [hasPriceMapping, getPriceByMapping, addPkgxLog]);

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
      const totalInventory = product.inventoryByBranch
        ? Object.values(product.inventoryByBranch).reduce((sum, qty) => sum + (qty || 0), 0)
        : 0;
      
      const response = await updateProduct(product.pkgxId, {
        goods_number: totalInventory,
      });
      
      if (response.success) {
        toast.success(`Đã đồng bộ tồn kho: ${totalInventory} sản phẩm`, { id: 'pkgx-sync-inventory' });
        addPkgxLog({
          action: 'sync_inventory',
          status: 'success',
          message: `Đã đồng bộ tồn kho: ${product.name} (${totalInventory})`,
          details: { productId: product.systemId, pkgxId: product.pkgxId, inventory: totalInventory },
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
  }, [addPkgxLog]);

  // ═══════════════════════════════════════════════════════════════
  // 3. SYNC SEO
  // ═══════════════════════════════════════════════════════════════
  const handlePkgxUpdateSeo = React.useCallback(async (product: Product) => {
    if (!product.pkgxId) {
      toast.error('Sản phẩm chưa được liên kết với PKGX');
      return;
    }
    
    toast.loading(`Đang đồng bộ SEO...`, { id: 'pkgx-sync-seo' });
    
    try {
      const pkgxSeo = product.websiteSeo?.pkgx;
      const response = await updateProduct(product.pkgxId, {
        keywords: pkgxSeo?.seoKeywords || product.tags?.join(', ') || product.name,
        meta_title: pkgxSeo?.seoTitle || product.ktitle || product.name,
        meta_desc: pkgxSeo?.metaDescription || product.seoDescription || '',
      });
      
      if (response.success) {
        toast.success(`Đã đồng bộ SEO cho sản phẩm: ${product.name}`, { id: 'pkgx-sync-seo' });
        addPkgxLog({
          action: 'sync_seo',
          status: 'success',
          message: `Đã đồng bộ SEO: ${product.name}`,
          details: { productId: product.systemId, pkgxId: product.pkgxId },
        });
      } else {
        throw new Error(response.error);
      }
    } catch (error) {
      toast.error(`Lỗi đồng bộ SEO: ${error instanceof Error ? error.message : 'Unknown error'}`, { id: 'pkgx-sync-seo' });
      addPkgxLog({
        action: 'sync_seo',
        status: 'error',
        message: `Lỗi đồng bộ SEO: ${product.name}`,
        details: { productId: product.systemId, error: error instanceof Error ? error.message : String(error) },
      });
    }
  }, [addPkgxLog]);

  // ═══════════════════════════════════════════════════════════════
  // 4. SYNC MÔ TẢ (với xử lý ảnh trong HTML)
  // ═══════════════════════════════════════════════════════════════
  const handlePkgxSyncDescription = React.useCallback(async (product: Product) => {
    if (!product.pkgxId) {
      toast.error('Sản phẩm chưa được liên kết với PKGX');
      return;
    }
    
    toast.loading(`Đang đồng bộ mô tả...`, { id: 'pkgx-sync-desc' });
    
    try {
      const pkgxSeo = product.websiteSeo?.pkgx;
      
      // Get raw descriptions
      const rawLongDesc = pkgxSeo?.longDescription || product.description || '';
      const rawShortDesc = pkgxSeo?.shortDescription || product.shortDescription || '';
      
      // Process images in long description (upload to PKGX and replace URLs)
      let processedLongDesc = rawLongDesc;
      let imageStats = { uploadedCount: 0, skippedCount: 0, errors: [] as string[] };
      
      if (rawLongDesc.includes('<img')) {
        toast.loading(`Đang xử lý ảnh trong mô tả...`, { id: 'pkgx-sync-desc' });
        
        const filenamePrefix = product.sku || product.id || `product-${product.pkgxId}`;
        const result = await processHtmlImagesForPkgx(rawLongDesc, filenamePrefix);
        
        processedLongDesc = result.processedHtml;
        imageStats = result;
        
        if (result.uploadedCount > 0) {
          toast.loading(`Đã upload ${result.uploadedCount} ảnh, đang cập nhật mô tả...`, { id: 'pkgx-sync-desc' });
        }
      }
      
      // Sync to PKGX
      const response = await updateProduct(product.pkgxId, {
        goods_desc: processedLongDesc,
        goods_brief: rawShortDesc,
      });
      
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
        message: `Lỗi đồng bộ mô tả: ${product.name}`,
        details: { productId: product.systemId, error: error instanceof Error ? error.message : String(error) },
      });
    }
  }, [addPkgxLog]);

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
      const response = await updateProduct(product.pkgxId, {
        best: product.isFeatured || false,
        hot: product.isFeatured || false,
        new: product.isNewArrival || false,
        ishome: product.isFeatured || false,
        is_on_sale: product.status === 'active',
      });
      
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
  }, [addPkgxLog]);

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

      const response = await updateProduct(product.pkgxId, payload);
      
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
  }, [getMappedCategoryId, getMappedBrandId, addPkgxLog]);

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
    let thumbnailUrls: string[] = [];
    let galleryUrls: string[] = [];

    // Helper: Kiểm tra URL có thể truy cập từ internet không
    const isPublicUrl = (url: string): boolean => {
      if (!url) return false;
      // Bỏ qua localhost, 127.0.0.1, hoặc internal IP
      if (url.includes('localhost') || url.includes('127.0.0.1') || url.includes('192.168.')) {
        console.log('[PKGX Sync Images] Skipping local URL:', url);
        return false;
      }
      return true;
    };

    try {
      // Import động để tránh circular dependency
      const { FileUploadAPI } = await import('@/lib/file-upload-api');
      const files = await FileUploadAPI.getProductFiles(product.systemId);
      
      console.log('[PKGX Sync Images] Files from HRM server:', files);
      
      // Phân loại ảnh theo documentName - CHỈ lấy URL public
      for (const file of files) {
        if (file.documentName === 'thumbnail' && file.url && isPublicUrl(file.url)) {
          thumbnailUrls.push(file.url);
        } else if (file.documentName === 'gallery' && file.url && isPublicUrl(file.url)) {
          galleryUrls.push(file.url);
        }
      }
    } catch (fetchError) {
      console.warn('[PKGX Sync Images] Không thể lấy ảnh từ HRM server:', fetchError);
    }

    // ===== STEP 2: Fallback về product object nếu server không có ảnh =====
    console.log('[PKGX Sync Images] Product:', product.name, 'systemId:', product.systemId);
    console.log('[PKGX Sync Images] Thumbnails from server:', thumbnailUrls);
    console.log('[PKGX Sync Images] Gallery from server:', galleryUrls);
    console.log('[PKGX Sync Images] product.thumbnailImage:', product.thumbnailImage);
    console.log('[PKGX Sync Images] product.galleryImages:', product.galleryImages);
    console.log('[PKGX Sync Images] product.images (legacy):', product.images);

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

    console.log('[PKGX Sync Images] permanentThumbnails from imageStore:', permanentThumbnails);
    console.log('[PKGX Sync Images] permanentGallery from imageStore:', permanentGallery);

    // Final main image và gallery
    const mainImage = thumbnailUrls[0] || null;
    const galleryImages = galleryUrls;

    console.log('[PKGX Sync Images] Final mainImage:', mainImage);
    console.log('[PKGX Sync Images] Final galleryImages to sync:', galleryImages);

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

      // Helper function: Upload ảnh từ URL qua server PKGX (tránh CORS)
      const uploadFromUrl = async (imageUrl: string, slugSuffix: string): Promise<string | null> => {
        try {
          // Kiểm tra nếu là đường dẫn local trên PKGX (đã upload trước đó)
          if (imageUrl.startsWith('images/') || imageUrl.includes('/cdn/images/')) {
            // Đã là path trên PKGX, không cần upload lại
            const cleanPath = imageUrl.replace(/.*\/cdn\//, '').replace(/^cdn\//, '');
            return cleanPath;
          }

          // Gọi API server-to-server để tránh CORS
          const uploadResult = await uploadImageFromUrl(imageUrl, {
            filenameSlug: `${baseSlug}-${slugSuffix}`,
          });

          if (!uploadResult.success || !uploadResult.data) {
            throw new Error(uploadResult.error || 'Upload thất bại');
          }

          // Trả về đường dẫn original_img
          return uploadResult.data.data?.original_img || null;
        } catch (err) {
          console.error(`Lỗi upload ảnh ${imageUrl}:`, err);
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
      const response = await updateProduct(product.pkgxId, payload);
      
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
  }, [addPkgxLog]);

  // ═══════════════════════════════════════════════════════════════
  // 8. SYNC TẤT CẢ (Full sync, bao gồm xử lý ảnh trong mô tả)
  // ═══════════════════════════════════════════════════════════════
  const handlePkgxSyncAll = React.useCallback(async (product: Product) => {
    if (!product.pkgxId) {
      toast.error('Sản phẩm chưa được liên kết với PKGX');
      return;
    }
    
    toast.loading(`Đang đồng bộ tất cả thông tin...`, { id: 'pkgx-sync-all' });
    
    try {
      const pkgxSeo = product.websiteSeo?.pkgx;
      
      // Get raw descriptions
      const rawLongDesc = pkgxSeo?.longDescription || product.description || '';
      const rawShortDesc = pkgxSeo?.shortDescription || product.shortDescription || '';
      
      // Process images in long description
      let processedLongDesc = rawLongDesc;
      let imageStats = { uploadedCount: 0, skippedCount: 0, errors: [] as string[] };
      
      if (rawLongDesc.includes('<img')) {
        toast.loading(`Đang xử lý ảnh trong mô tả...`, { id: 'pkgx-sync-all' });
        
        const filenamePrefix = product.sku || product.id || `product-${product.pkgxId}`;
        const result = await processHtmlImagesForPkgx(rawLongDesc, filenamePrefix);
        
        processedLongDesc = result.processedHtml;
        imageStats = result;
      }
      
      // Build full payload
      const payload: Record<string, unknown> = {
        // Thông tin cơ bản
        goods_name: product.name,
        goods_sn: product.id,
        
        // Tồn kho
        goods_number: product.inventoryByBranch
          ? Object.values(product.inventoryByBranch).reduce((sum, qty) => sum + (qty || 0), 0)
          : 0,
        
        // SEO
        keywords: pkgxSeo?.seoKeywords || product.tags?.join(', ') || product.name,
        meta_title: pkgxSeo?.seoTitle || product.ktitle || product.name,
        meta_desc: pkgxSeo?.metaDescription || product.seoDescription || '',
        
        // Mô tả (đã xử lý ảnh)
        goods_desc: processedLongDesc,
        goods_brief: rawShortDesc,
        
        // Flags
        best: product.isFeatured || false,
        hot: product.isFeatured || false,
        new: product.isNewArrival || false,
        ishome: product.isFeatured || false,
        is_on_sale: product.status === 'active',
        
        // Image - ảnh đại diện
        ...(product.thumbnailImage && { original_img: product.thumbnailImage }),
      };

      // Gallery images (album ảnh) - update toàn bộ
      const galleryImages = product.galleryImages || product.images || [];
      if (galleryImages.length > 0) {
        payload.gallery_images = galleryImages;
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
      
      const marketPrice = getPriceByMapping(product, 'marketPrice');
      if (marketPrice !== undefined) payload.market_price = marketPrice;
      
      const partnerPrice = getPriceByMapping(product, 'partnerPrice');
      if (partnerPrice !== undefined) payload.partner_price = partnerPrice;
      
      const acePrice = getPriceByMapping(product, 'acePrice');
      if (acePrice !== undefined) payload.ace_price = acePrice;
      
      const dealPrice = getPriceByMapping(product, 'dealPrice');
      if (dealPrice !== undefined) payload.deal_price = dealPrice;

      const response = await updateProduct(product.pkgxId, payload);
      
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
      toast.error(`Lỗi đồng bộ: ${error instanceof Error ? error.message : 'Unknown error'}`, { id: 'pkgx-sync-all' });
      addPkgxLog({
        action: 'sync_all',
        status: 'error',
        message: `Lỗi đồng bộ tất cả: ${product.name}`,
        details: { productId: product.systemId, error: error instanceof Error ? error.message : String(error) },
      });
    }
  }, [getMappedCategoryId, getMappedBrandId, getPriceByMapping, addPkgxLog]);

  return {
    // Sync handlers
    handlePkgxUpdatePrice,
    handlePkgxSyncInventory,
    handlePkgxUpdateSeo,
    handlePkgxSyncDescription,
    handlePkgxSyncFlags,
    handlePkgxSyncBasicInfo,
    handlePkgxSyncImages,
    handlePkgxSyncAll,
    // Helpers
    hasPriceMapping,
  };
}
