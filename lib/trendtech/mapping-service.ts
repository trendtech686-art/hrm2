/**
 * Trendtech Mapping Service
 * 
 * Transform data giữa HRM và Trendtech
 */

import type { SystemId } from '../id-types';
import type { Product } from '@/lib/types/prisma-extended';
import type { TrendtechProductPayload, TrendtechProduct, TrendtechSettings } from './types';

// ========================================
// Mapping Functions
// ========================================

/**
 * Lấy category ID Trendtech từ HRM categorySystemId
 */
export function getTrendtechCatId(settings: TrendtechSettings, hrmCategoryId: SystemId | undefined): number | null {
  if (!hrmCategoryId) return null;
  const mapping = settings.categoryMappings?.find(m => m.hrmCategorySystemId === hrmCategoryId);
  return mapping?.trendtechCatId ?? null;
}

/**
 * Lấy brand ID Trendtech từ HRM brandSystemId
 */
export function getTrendtechBrandId(settings: TrendtechSettings, hrmBrandId: SystemId | undefined): number | null {
  if (!hrmBrandId) return null;
  const mapping = settings.brandMappings?.find(m => m.hrmBrandSystemId === hrmBrandId);
  return mapping?.trendtechBrandId ?? null;
}

/**
 * Lấy giá theo mapping bảng giá
 */
export function getPriceByMapping(
  settings: TrendtechSettings,
  product: Product,
  priceField: 'price' | 'compareAtPrice'
): number | undefined {
  const policyId = settings.priceMapping[priceField];
  
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
export function mapHrmToTrendtechPayload(settings: TrendtechSettings, product: Product): TrendtechProductPayload {
  const trendtechSeo = product.seoTrendtech;
  const payload: TrendtechProductPayload = {
    name: product.name,
    sku: product.id,
    slug: trendtechSeo?.slug || createSlug(product.name),
    quantity: getTotalInventory(product),
    price: 0, // Default, will be overwritten by mapping
  };

  // Map category
  const catId = getTrendtechCatId(settings, product.categorySystemId);
  if (catId) payload.categoryId = catId;

  // Map brand
  const brandId = getTrendtechBrandId(settings, product.brandSystemId);
  if (brandId) payload.brandId = brandId;

  // Map prices
  const price = getPriceByMapping(settings, product, 'price');
  if (price !== undefined) payload.price = price;

  const compareAtPrice = getPriceByMapping(settings, product, 'compareAtPrice');
  if (compareAtPrice !== undefined) payload.compareAtPrice = compareAtPrice;

  // Map content
  if (product.description) payload.description = product.description;
  if (product.shortDescription) payload.shortDescription = product.shortDescription;

  // Map images
  if (product.thumbnailImage) payload.thumbnail = product.thumbnailImage;
  if (product.galleryImages?.length) payload.images = product.galleryImages;

  // Map SEO - Ưu tiên từ seoTrendtech nếu có, fallback về field gốc
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
    // Slug stored in seoTrendtech JSON
  };
}

/**
 * Tạo payload chỉ chứa giá để update
 */
export function createPriceUpdatePayload(settings: TrendtechSettings, product: Product): Partial<TrendtechProductPayload> {
  const payload: Partial<TrendtechProductPayload> = {};

  const price = getPriceByMapping(settings, product, 'price');
  if (price !== undefined) payload.price = price;

  const compareAtPrice = getPriceByMapping(settings, product, 'compareAtPrice');
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
  settings: TrendtechSettings,
  hrmProduct: Product,
  trendtechProduct: TrendtechProduct
): {
  hasPriceDiff: boolean;
  hasStockDiff: boolean;
  hasSeoDiff: boolean;
  hasContentDiff: boolean;
  details: {
    field: string;
    hrmValue: string | number | undefined;
    trendtechValue: string | number | undefined;
  }[];
} {
  const details: { field: string; hrmValue: string | number | undefined; trendtechValue: string | number | undefined }[] = [];
  
  // Price comparison
  const hrmPrice = getPriceByMapping(settings, hrmProduct, 'price');
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
