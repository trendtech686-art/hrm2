import type { SystemId } from '@/lib/id-types';

// ========================================
// PKGX Reference Data Types
// ========================================

/**
 * Danh mục PKGX (cat_id từ ECShop)
 */
export type PkgxCategory = {
  id: number;         // cat_id trên PKGX
  name: string;       // Tên danh mục
  parentId?: number;  // Parent category (nếu có)
  // SEO fields
  cat_desc?: string;      // Mô tả danh mục (HTML)
  keywords?: string;      // SEO keywords
  cat_alias?: string;     // Slug/alias
  style?: string;         // Template style
  grade?: number;         // Cấp độ danh mục
  filter_attr?: string;   // Filter attributes
};

/**
 * Thương hiệu PKGX (brand_id từ ECShop)
 */
export type PkgxBrand = {
  id: number;           // brand_id trên PKGX
  name: string;         // Tên thương hiệu
  // SEO fields
  brand_logo?: string;    // Logo URL
  brand_desc?: string;    // Mô tả thương hiệu (HTML)
  site_url?: string;      // Website URL
  sort_order?: number;    // Thứ tự sắp xếp
};

/**
 * Ảnh trong gallery sản phẩm PKGX
 */
export type PkgxGalleryImage = {
  img_id: number;           // ID ảnh trong gallery
  goods_id: number;         // ID sản phẩm
  img_url: string;          // Đường dẫn ảnh gốc
  thumb_url: string;        // Đường dẫn thumbnail
  img_desc?: string;        // Mô tả ảnh
  img_original?: string;    // Ảnh gốc (nếu có)
};

// ========================================
// Mapping Types
// ========================================

/**
 * Mapping danh mục HRM → PKGX
 */
export type PkgxCategoryMapping = {
  id: string;                     // Unique mapping ID
  hrmCategorySystemId: SystemId;  // Category systemId trong HRM
  hrmCategoryName: string;        // Tên hiển thị HRM
  pkgxCatId: number;              // cat_id trên PKGX
  pkgxCatName: string;            // Tên danh mục PKGX
};

/**
 * Mapping thương hiệu HRM → PKGX
 */
export type PkgxBrandMapping = {
  id: string;                     // Unique mapping ID
  hrmBrandSystemId: SystemId;     // Brand systemId trong HRM
  hrmBrandName: string;           // Tên hiển thị HRM
  pkgxBrandId: number;            // brand_id trên PKGX
  pkgxBrandName: string;          // Tên thương hiệu PKGX
};

/**
 * Mapping bảng giá HRM → các loại giá PKGX
 */
export type PkgxPriceMapping = {
  shopPrice: SystemId | null;     // Bảng giá → shop_price (giá bán)
  marketPrice: SystemId | null;   // Bảng giá → market_price (giá thị trường)
  partnerPrice: SystemId | null;  // Bảng giá → partner_price (giá đối tác)
  acePrice: SystemId | null;      // Bảng giá → ace_price
  dealPrice: SystemId | null;     // Bảng giá → deal_price
};

// ========================================
// Sync Settings Types
// ========================================

/**
 * Cài đặt đồng bộ tự động
 */
export type PkgxSyncSettings = {
  autoSyncEnabled: boolean;       // Bật/tắt auto sync
  intervalMinutes: number;        // Tần suất (15, 30, 60, 120, 240)
  syncInventory: boolean;         // Đồng bộ tồn kho
  syncPrice: boolean;             // Đồng bộ giá
  syncSeo: boolean;               // Đồng bộ SEO (meta_title, meta_desc, keywords)
  syncOnProductUpdate: boolean;   // Sync ngay khi update SP trong HRM
  notifyOnError: boolean;         // Thông báo khi có lỗi
};

/**
 * Log đồng bộ PKGX - Ghi lại TẤT CẢ các API call
 */
export type PkgxSyncLog = {
  id: string;                     // Unique log ID
  timestamp: string;              // ISO timestamp
  action: 
    | 'test_connection'           // Test kết nối API
    | 'ping'                      // Ping server
    | 'sync_all'                  // Đồng bộ toàn bộ
    | 'sync_price'                // Đồng bộ giá
    | 'sync_inventory'            // Đồng bộ tồn kho
    | 'sync_seo'                  // Đồng bộ SEO
    | 'create_product'            // Tạo sản phẩm mới trên PKGX
    | 'update_product'            // Cập nhật sản phẩm
    | 'link_product'              // Liên kết SP HRM với PKGX
    | 'unlink_product'            // Hủy liên kết SP
    | 'unlink_mapping'            // Hủy liên kết mapping (category/brand)
    | 'sync_categories'           // Đồng bộ danh mục
    | 'sync_brands'               // Đồng bộ thương hiệu
    | 'get_products'              // Lấy danh sách SP từ PKGX
    | 'upload_image'              // Upload ảnh sản phẩm
    | 'save_config'               // Lưu cấu hình
    | 'save_mapping';             // Lưu mapping
  status: 'success' | 'error' | 'partial' | 'info';
  message: string;                // Log message
  // User info - Ai thực hiện action
  userId?: string;                // User systemId hoặc 'SYSTEM'
  userName?: string;              // Tên người dùng
  details?: {
    // Request info
    url?: string;
    method?: string;
    // Response info
    responseTime?: number;        // ms
    httpStatus?: number;
    // Data info
    total?: number;
    success?: number;
    failed?: number;
    productId?: string;
    productName?: string;
    pkgxId?: number;
    inventory?: number;
    categoryId?: number;
    brandId?: number;
    // Error info
    error?: string;
    errorCode?: string;
  };
};

/**
 * Kết quả sync gần nhất
 */
export type PkgxSyncResult = {
  status: 'success' | 'partial' | 'error';
  total: number;
  success: number;
  failed: number;
  errors?: string[];
};

// ========================================
// Main PKGX Settings Type
// ========================================

/**
 * Toàn bộ cài đặt PKGX
 */
export type PkgxSettings = {
  // === General Config ===
  apiUrl: string;
  apiKey: string;
  enabled: boolean;                // Bật/tắt tích hợp PKGX
  
  // === Reference Data ===
  categories: PkgxCategory[];
  brands: PkgxBrand[];
  
  // === Mappings ===
  priceMapping: PkgxPriceMapping;
  categoryMappings: PkgxCategoryMapping[];
  brandMappings: PkgxBrandMapping[];
  
  // === Sync Settings ===
  syncSettings: PkgxSyncSettings;
  
  // === Status ===
  lastSyncAt?: string;
  lastSyncResult?: PkgxSyncResult;
  connectionStatus?: 'connected' | 'disconnected' | 'error';
  connectionError?: string;
  
  // === Logs ===
  logs: PkgxSyncLog[];
  
  // === Cached PKGX Products ===
  pkgxProducts: PkgxProduct[];     // Sản phẩm từ PKGX - lưu cache để không mất khi chuyển tab
  pkgxProductsLastFetch?: string;  // Thời gian fetch gần nhất
};

// ========================================
// PKGX Product Response Types (từ API)
// ========================================

/**
 * Sản phẩm trả về từ PKGX API
 * 
 * Lưu ý quan trọng:
 * - goods_id: Primary Key, dùng để update/link sản phẩm qua API
 * - goods_sn: Mã SKU của sản phẩm, có thể sync với HRM.sku
 */
export type PkgxProduct = {
  goods_id: number;      // PRIMARY KEY - Dùng để update sản phẩm qua API
  goods_name: string;
  goods_sn: string;      // Mã SKU - map với HRM Product.sku
  cat_id: number;
  brand_id: number;
  shop_price: number;
  market_price: number;
  partner_price: number;
  ace_price?: number;
  deal_price?: number;
  goods_number: number;
  goods_desc: string;
  keywords: string;
  goods_brief: string;
  meta_title: string;
  meta_desc: string;
  goods_img: string;
  goods_thumb: string;
  original_img: string;
  is_on_sale: number;
  is_best: number;
  is_hot: number;
  is_new: number;
  is_home: number;
  slug: string;
  seller_note?: string;
  add_time?: number;
  last_update?: number;
};

/**
 * Response phân trang từ get_products
 */
export type PkgxProductsResponse = {
  error: boolean;
  message: string;
  pagination: {
    total_items: number;
    total_pages: number;
    current_page: number;
    per_page: number;
  };
  data: PkgxProduct[];
};

/**
 * Response upload ảnh
 */
export type PkgxImageUploadResponse = {
  error: boolean;
  message: string;
  data: {
    original_img: string;
    goods_img: string;
    goods_thumb: string;
    full_urls: {
      original: string;
      goods: string;
      thumb: string;
    };
  };
  goods_id?: number;
  product_updated?: boolean;
};

/**
 * Response lấy danh sách danh mục từ PKGX API
 */
export type PkgxCategoryFromApi = {
  cat_id: number;
  cat_name: string;
  parent_id: number;
  sort_order: number;
  // SEO fields (optional - chỉ có khi API hỗ trợ)
  cat_desc?: string;
  keywords?: string;
  cat_alias?: string;
  style?: string;
  grade?: number;
  filter_attr?: string;
};

export type PkgxCategoriesResponse = {
  error: boolean;
  message: string;
  total: number;
  data: PkgxCategoryFromApi[];
};

/**
 * Response lấy danh sách thương hiệu từ PKGX API
 */
export type PkgxBrandFromApi = {
  brand_id: number;
  brand_name: string;
  brand_logo?: string;
  brand_desc?: string;
  site_url?: string;
  sort_order: number;
};

export type PkgxBrandsResponse = {
  error: boolean;
  message: string;
  total: number;
  data: PkgxBrandFromApi[];
};

/**
 * Response lấy gallery ảnh sản phẩm từ PKGX API
 */
export type PkgxGalleryResponse = {
  error: boolean;
  message: string;
  goods_id: number;
  total: number;
  data: PkgxGalleryImage[];
};

/**
 * Payload tạo/cập nhật sản phẩm
 */
export type PkgxProductPayload = {
  goods_name?: string;
  goods_sn?: string;
  cat_id?: number;
  brand_id?: number;
  shop_price?: number;
  market_price?: number;
  partner_price?: number;
  ace_price?: number;
  deal_price?: number;
  goods_number?: number;
  goods_desc?: string;
  keywords?: string;
  goods_brief?: string;
  meta_title?: string;
  meta_desc?: string;
  original_img?: string;
  gallery_images?: string[];  // Album ảnh sản phẩm
  best?: boolean;
  hot?: boolean;
  new?: boolean;
  ishome?: boolean;
  is_on_sale?: boolean;  // Hiển thị đăng web (on/off trên website PKGX)
  seller_note?: string;
};

// ========================================
// UI State Types
// ========================================

export type PkgxSettingsTab = 
  | 'general'
  | 'categories'
  | 'brands'
  | 'category-mapping'
  | 'brand-mapping'
  | 'price-mapping'
  | 'product-mapping'
  | 'sync';

export type ConnectionTestResult = {
  success: boolean;
  message: string;
  productCount?: number;
};

// ========================================
// Default Values
// ========================================

export const DEFAULT_PKGX_SETTINGS: PkgxSettings = {
  apiUrl: 'https://phukiengiaxuong.com.vn/admin/api_product_pro.php',
  apiKey: '',
  enabled: false,
  
  categories: [],
  brands: [],
  
  priceMapping: {
    shopPrice: null,
    marketPrice: null,
    partnerPrice: null,
    acePrice: null,
    dealPrice: null,
  },
  categoryMappings: [],
  brandMappings: [],
  
  syncSettings: {
    autoSyncEnabled: false,
    intervalMinutes: 30,
    syncInventory: true,
    syncPrice: true,
    syncSeo: false,
    syncOnProductUpdate: true,
    notifyOnError: true,
  },
  
  logs: [],
  
  // Cached PKGX Products
  pkgxProducts: [],
  pkgxProductsLastFetch: undefined,
};

export const SYNC_INTERVAL_OPTIONS = [
  { value: 15, label: '15 phút' },
  { value: 30, label: '30 phút' },
  { value: 60, label: '1 giờ' },
  { value: 120, label: '2 giờ' },
  { value: 240, label: '4 giờ' },
];
