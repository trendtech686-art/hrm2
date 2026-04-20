/**
 * API Configuration
 */
export const PKGX_API_CONFIG = {
  baseUrl: 'https://phukiengiaxuong.com.vn/admin/api_product_hrm.php',
  cdnUrl: 'https://phukiengiaxuong.com.vn/cdn/',
  defaultApiKey: process.env.PKGX_DEFAULT_API_KEY || '',
  
  // Rate limiting
  maxRequestsPerMinute: 60,
  requestTimeout: 30000, // 30 seconds
  
  // Pagination
  defaultPageSize: 500,
  maxPageSize: 1000,
};

/**
 * Field mapping reference
 */
export const FIELD_MAPPING_REFERENCE = {
  // HRM Field → PKGX Field
  'pkgxId': 'goods_id',
  'id': 'goods_sn',
  'name': 'goods_name',
  'categorySystemId': 'cat_id',
  'brandSystemId': 'brand_id',
  'description': 'goods_desc',
  'shortDescription': 'goods_brief',
  'ktitle': 'meta_title',
  'seoDescription': 'meta_desc',
  'tags': 'keywords',
  'thumbnailImage': 'original_img',
  'isFeatured': 'is_best',
  'isNewArrival': 'is_new',
  'isPublished': 'is_on_sale',
  'slug': 'slug',
} as const;

/**
 * PKGX Price field descriptions
 */
export const PKGX_PRICE_FIELDS = [
  { key: 'shopPrice', field: 'shop_price', label: 'Giá bán (shop_price)', description: 'Giá bán chính trên website' },
  { key: 'partnerPrice', field: 'partner_price', label: 'Giá đối tác (partner_price)', description: 'Giá dành cho đối tác' },
  { key: 'price5Vat', field: 'price_5vat', label: 'Giá 5% VAT (price_5vat)', description: 'Giá đã bao gồm 5% VAT' },
  { key: 'price12Novat', field: 'price_12novat', label: 'Giá 12% Không VAT (price_12novat)', description: 'Giá chưa bao gồm 12% VAT' },
  { key: 'price5Novat', field: 'price_5novat', label: 'Giá 5% Không VAT (price_5novat)', description: 'Giá chưa bao gồm 5% VAT' },
] as const;
