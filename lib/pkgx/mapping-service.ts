import type { SystemId } from '../id-types';
import type { Product } from '../../features/products/types';
import { usePkgxSettingsStore } from '../../features/settings/pkgx/store';
import type { PkgxProductPayload, PkgxProduct } from '../../features/settings/pkgx/types';

// ========================================
// Mapping Functions
// ========================================

/**
 * Lấy cat_id PKGX từ HRM categorySystemId
 */
export function getPkgxCatId(hrmCategoryId: SystemId | undefined): number | null {
  if (!hrmCategoryId) return null;
  const store = usePkgxSettingsStore.getState();
  return store.getPkgxCatIdByHrmCategory(hrmCategoryId);
}

/**
 * Lấy brand_id PKGX từ HRM brandSystemId
 */
export function getPkgxBrandId(hrmBrandId: SystemId | undefined): number | null {
  if (!hrmBrandId) return null;
  const store = usePkgxSettingsStore.getState();
  return store.getPkgxBrandIdByHrmBrand(hrmBrandId);
}

/**
 * Lấy giá theo mapping bảng giá
 */
export function getPriceByMapping(
  product: Product,
  priceField: 'shopPrice' | 'marketPrice' | 'partnerPrice' | 'acePrice' | 'dealPrice'
): number | undefined {
  const store = usePkgxSettingsStore.getState();
  const policyId = store.settings.priceMapping[priceField];
  
  if (!policyId) return undefined;
  
  return product.prices[policyId];
}

/**
 * Tính tổng tồn kho từ tất cả chi nhánh
 */
export function getTotalInventory(product: Product): number {
  if (!product.inventoryByBranch) return 0;
  return Object.values(product.inventoryByBranch).reduce((sum, qty) => sum + (qty || 0), 0);
}

/**
 * Map HRM Product → PKGX Payload để tạo/cập nhật sản phẩm
 * Đồng nhất với các action update trong use-pkgx-sync.ts
 */
export function mapHrmToPkgxPayload(product: Product): PkgxProductPayload {
  // Get PKGX-specific SEO data (ưu tiên seoPkgx, fallback về field gốc)
  const pkgxSeo = product.seoPkgx;
  
  const payload: PkgxProductPayload = {
    // Thông tin cơ bản (giống handlePkgxSyncBasicInfo)
    goods_name: product.name,
    goods_sn: product.id,
    goods_number: getTotalInventory(product),
    seller_note: product.sellerNote || '',
  };

  // Map category
  const catId = getPkgxCatId(product.categorySystemId);
  if (catId) payload.cat_id = catId;

  // Map brand
  const brandId = getPkgxBrandId(product.brandSystemId);
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

  // Map mô tả (giống handlePkgxSyncDescription)
  payload.goods_desc = pkgxSeo?.longDescription || product.description || '';
  payload.goods_brief = pkgxSeo?.shortDescription || product.shortDescription || '';

  // Map SEO (giống handlePkgxUpdateSeo)
  payload.keywords = pkgxSeo?.seoKeywords || product.tags?.join(', ') || product.name;
  payload.meta_title = pkgxSeo?.seoTitle || product.ktitle || product.name;
  payload.meta_desc = pkgxSeo?.metaDescription || product.seoDescription || '';

  // Map flags - đúng theo các trường của HRM
  // HRM isPublished (Đăng web) -> PKGX is_on_sale
  // HRM isFeatured (Nổi bật) -> PKGX is_best
  // HRM isBestSeller (Bán chạy) -> PKGX is_hot
  // HRM isNewArrival (Mới về) -> PKGX is_new
  // HRM isFeatured (Nổi bật) -> PKGX ishome (hiển trang chủ)
  // HRM isOnSale (Đang giảm giá) -> ko có trường tương ứng trong PKGX API
  payload.best = product.isFeatured || false;
  payload.hot = product.isBestSeller || false;
  payload.new = product.isNewArrival || false;
  payload.ishome = product.isFeatured || false;
  payload.is_on_sale = product.isPublished ?? (product.status === 'active');
  
  // Map images
  if (product.thumbnailImage) {
    payload.original_img = product.thumbnailImage;
  } else if (product.images && product.images.length > 0) {
    payload.original_img = product.images[0];
  }
  
  // Gallery images (album ảnh) - ưu tiên galleryImages, fallback images
  const galleryImages = product.galleryImages || product.images || [];
  if (galleryImages.length > 0) {
    payload.gallery_images = galleryImages;
  }

  return payload;
}

/**
 * Map PKGX Product → HRM fields để update sau khi tạo
 */
export function mapPkgxToHrmFields(pkgxProduct: PkgxProduct): Partial<Product> {
  return {
    pkgxId: pkgxProduct.goods_id,
    // Có thể map thêm các field khác nếu cần
  };
}

/**
 * Tạo payload chỉ chứa giá để update
 */
export function createPriceUpdatePayload(product: Product): Partial<PkgxProductPayload> {
  const payload: Partial<PkgxProductPayload> = {};

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

  return payload;
}

/**
 * Tạo payload chỉ chứa SEO để update
 * Fallback chain: SEO PKGX → SEO Chung → tags → empty
 */
export function createSeoUpdatePayload(product: Product): Partial<PkgxProductPayload> {
  const pkgxSeo = product.seoPkgx;
  return {
    meta_title: pkgxSeo?.seoTitle || product.ktitle || product.name,
    meta_desc: pkgxSeo?.metaDescription || product.seoDescription || '',
    keywords: pkgxSeo?.seoKeywords || product.seoKeywords || product.tags?.join(', ') || '',
  };
}

/**
 * Tạo payload chỉ chứa tồn kho để update
 */
export function createInventoryUpdatePayload(product: Product): Partial<PkgxProductPayload> {
  return {
    goods_number: getTotalInventory(product),
  };
}

/**
 * Tạo payload chỉ chứa mô tả để update
 * Ưu tiên lấy từ seoPkgx, fallback về các field cũ
 */
export function createDescriptionUpdatePayload(product: Product): Partial<PkgxProductPayload> {
  const pkgxSeo = product.seoPkgx;
  return {
    goods_desc: pkgxSeo?.longDescription || product.description || '',
    goods_brief: pkgxSeo?.shortDescription || product.shortDescription || '',
  };
}

/**
 * Tạo payload chỉ chứa flags (best, hot, new, ishome, is_on_sale) để update
 * Mapping:
 * - HRM isPublished (Đăng web) -> PKGX is_on_sale
 * - HRM isFeatured (Nổi bật) -> PKGX is_best
 * - HRM isBestSeller (Bán chạy) -> PKGX is_hot  
 * - HRM isNewArrival (Mới về) -> PKGX is_new
 * - HRM isFeatured (Nổi bật) -> PKGX ishome (hiển trang chủ)
 */
export function createFlagsUpdatePayload(product: Product): Partial<PkgxProductPayload> {
  return {
    best: product.isFeatured || false,
    hot: product.isBestSeller || false,
    new: product.isNewArrival || false,
    ishome: product.isFeatured || false,
    is_on_sale: product.isPublished ?? (product.status === 'active'),
  };
}

/**
 * Kiểm tra sản phẩm đã được link với PKGX chưa
 */
export function isLinkedToPkgx(product: Product): boolean {
  return typeof product.pkgxId === 'number' && product.pkgxId > 0;
}
