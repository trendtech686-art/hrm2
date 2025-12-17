/**
 * Trendtech Mapping Service
 * 
 * Transform data giữa HRM và Trendtech
 */

import type { SystemId } from '../id-types';
import type { Product } from '../../features/products/types';
import { useTrendtechSettingsStore } from '../../features/settings/trendtech/store';
import type { TrendtechProductPayload, TrendtechProduct } from './types';

// ========================================
// Mapping Functions
// ========================================

/**
 * Lấy category ID Trendtech từ HRM categorySystemId
 */
export function getTrendtechCatId(hrmCategoryId: SystemId | undefined): number | null {
  if (!hrmCategoryId) return null;
  const store = useTrendtechSettingsStore.getState();
  return store.getTrendtechCatIdByHrmCategory(hrmCategoryId);
}

/**
 * Lấy brand ID Trendtech từ HRM brandSystemId
 */
export function getTrendtechBrandId(hrmBrandId: SystemId | undefined): number | null {
  if (!hrmBrandId) return null;
  const store = useTrendtechSettingsStore.getState();
  return store.getTrendtechBrandIdByHrmBrand(hrmBrandId);
}

/**
 * Lấy giá theo mapping bảng giá
 */
export function getPriceByMapping(
  product: Product,
  priceField: 'price' | 'compareAtPrice'
): number | undefined {
  const store = useTrendtechSettingsStore.getState();
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
 * Tạo slug từ tên sản phẩm
 */
export function createSlug(name: string): string {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .replace(/[^a-z0-9\s-]/g, '') // Remove special chars
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(/-+/g, '-') // Replace multiple - with single -
    .replace(/^-|-$/g, ''); // Trim - from start/end
}

/**
 * Map HRM Product → Trendtech Payload để tạo/cập nhật sản phẩm
 */
export function mapHrmToTrendtechPayload(product: Product): TrendtechProductPayload {
  const payload: TrendtechProductPayload = {
    name: product.name,
    sku: product.id,
    slug: product.trendtechSlug || createSlug(product.name),
    quantity: getTotalInventory(product),
    price: product.costPrice || 0, // Default, will be overwritten by mapping
  };

  // Map category
  const catId = getTrendtechCatId(product.categorySystemId);
  if (catId) payload.categoryId = catId;

  // Map brand
  const brandId = getTrendtechBrandId(product.brandSystemId);
  if (brandId) payload.brandId = brandId;

  // Map prices
  const price = getPriceByMapping(product, 'price');
  if (price !== undefined) payload.price = price;

  const compareAtPrice = getPriceByMapping(product, 'compareAtPrice');
  if (compareAtPrice !== undefined) payload.compareAtPrice = compareAtPrice;

  // Map cost price
  if (product.costPrice) payload.costPrice = product.costPrice;

  // Map content
  if (product.description) payload.description = product.description;
  if (product.shortDescription) payload.shortDescription = product.shortDescription;

  // Map images
  if (product.thumbnailImage) payload.thumbnail = product.thumbnailImage;
  if (product.galleryImages?.length) payload.images = product.galleryImages;

  // Map SEO - Ưu tiên từ seoTrendtech nếu có, fallback về field gốc
  const trendtechSeo = product.seoTrendtech;
  payload.metaTitle = trendtechSeo?.seoTitle || product.ktitle || product.name;
  payload.metaDescription = trendtechSeo?.metaDescription || product.seoDescription || product.shortDescription || '';
  payload.metaKeywords = trendtechSeo?.seoKeywords || product.seoKeywords || product.tags?.join(', ') || '';

  // Map flags
  payload.isActive = product.status === 'active';
  if (product.isFeatured !== undefined) payload.isFeatured = product.isFeatured;
  if (product.isNewArrival !== undefined) payload.isNewArrival = product.isNewArrival;
  if (product.isBestSeller !== undefined) payload.isBestSeller = product.isBestSeller;
  if (product.isOnSale !== undefined) payload.isOnSale = product.isOnSale;

  return payload;
}

/**
 * Map Trendtech Product → HRM fields để update sau khi tạo
 */
export function mapTrendtechToHrmFields(trendtechProduct: TrendtechProduct): Partial<Product> {
  return {
    trendtechId: trendtechProduct.id,
    trendtechSlug: trendtechProduct.slug,
  };
}

/**
 * Tạo payload chỉ chứa giá để update
 */
export function createPriceUpdatePayload(product: Product): Partial<TrendtechProductPayload> {
  const payload: Partial<TrendtechProductPayload> = {};

  const price = getPriceByMapping(product, 'price');
  if (price !== undefined) payload.price = price;

  const compareAtPrice = getPriceByMapping(product, 'compareAtPrice');
  if (compareAtPrice !== undefined) payload.compareAtPrice = compareAtPrice;

  return payload;
}

/**
 * Tạo payload chỉ chứa SEO để update
 */
export function createSeoUpdatePayload(product: Product): Partial<TrendtechProductPayload> {
  const trendtechSeo = product.seoTrendtech;
  
  return {
    metaTitle: trendtechSeo?.seoTitle || product.ktitle || product.name,
    metaDescription: trendtechSeo?.metaDescription || product.seoDescription || product.shortDescription || '',
    metaKeywords: trendtechSeo?.seoKeywords || product.seoKeywords || product.tags?.join(', ') || '',
  };
}

/**
 * Tạo payload chỉ chứa tồn kho để update
 */
export function createInventoryUpdatePayload(product: Product): Partial<TrendtechProductPayload> {
  const quantity = getTotalInventory(product);
  return {
    quantity,
  };
}

/**
 * Kiểm tra sản phẩm đã được link với Trendtech chưa
 */
export function isLinkedToTrendtech(product: Product): boolean {
  return typeof product.trendtechId === 'number' && product.trendtechId > 0;
}

/**
 * So sánh dữ liệu HRM và Trendtech để tìm khác biệt
 */
export function compareProductData(
  hrmProduct: Product,
  trendtechProduct: TrendtechProduct
): {
  hasPriceDiff: boolean;
  hasStockDiff: boolean;
  hasSeoDiff: boolean;
  hasContentDiff: boolean;
  details: {
    field: string;
    hrmValue: any;
    trendtechValue: any;
  }[];
} {
  const details: { field: string; hrmValue: any; trendtechValue: any }[] = [];
  
  // Price comparison
  const hrmPrice = getPriceByMapping(hrmProduct, 'price');
  if (hrmPrice !== undefined && hrmPrice !== trendtechProduct.price) {
    details.push({ field: 'price', hrmValue: hrmPrice, trendtechValue: trendtechProduct.price });
  }
  
  // Stock comparison
  const hrmStock = getTotalInventory(hrmProduct);
  if (hrmStock !== trendtechProduct.quantity) {
    details.push({ field: 'quantity', hrmValue: hrmStock, trendtechValue: trendtechProduct.quantity });
  }
  
  // SEO comparison
  const trendtechSeo = hrmProduct.seoTrendtech;
  const hrmMetaTitle = trendtechSeo?.seoTitle || hrmProduct.ktitle || hrmProduct.name;
  if (hrmMetaTitle !== trendtechProduct.metaTitle) {
    details.push({ field: 'metaTitle', hrmValue: hrmMetaTitle, trendtechValue: trendtechProduct.metaTitle });
  }
  
  // Content comparison
  if (hrmProduct.name !== trendtechProduct.name) {
    details.push({ field: 'name', hrmValue: hrmProduct.name, trendtechValue: trendtechProduct.name });
  }
  
  return {
    hasPriceDiff: details.some(d => d.field === 'price'),
    hasStockDiff: details.some(d => d.field === 'quantity'),
    hasSeoDiff: details.some(d => d.field.startsWith('meta')),
    hasContentDiff: details.some(d => d.field === 'name'),
    details,
  };
}
