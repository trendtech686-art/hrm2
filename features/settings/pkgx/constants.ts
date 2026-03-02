/**
 * API Configuration
 */
export const PKGX_API_CONFIG = {
  baseUrl: 'https://phukiengiaxuong.com.vn/admin/api_product_hrm.php',
  cdnUrl: 'https://phukiengiaxuong.com.vn/cdn/',
  defaultApiKey: 'a91f2c47e5d8b6f03a7c4e9d12f0b8a6',
  
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
  { key: 'marketPrice', field: 'market_price', label: 'Giá thị trường (market_price)', description: 'Giá niêm yết / giá gốc' },
  { key: 'partnerPrice', field: 'partner_price', label: 'Giá đối tác (partner_price)', description: 'Giá dành cho đối tác' },
  { key: 'acePrice', field: 'ace_price', label: 'Giá ACE (ace_price)', description: 'Giá đặc biệt ACE' },
  { key: 'dealPrice', field: 'deal_price', label: 'Giá deal (deal_price)', description: 'Giá khuyến mãi' },
] as const;
