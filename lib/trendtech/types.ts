import type { SystemId } from '@/lib/id-types';

// ========================================
// Trendtech Reference Data Types
// ========================================

/**
 * Danh mục Trendtech (flat - 1 cấp)
 * Next.js API: GET /api/hrm/categories
 */
export type TrendtechCategory = {
  id: number;           // Category ID trên Trendtech
  name: string;         // Tên danh mục
  slug: string;         // URL slug
  description?: string; // Mô tả danh mục
  image?: string;       // Ảnh đại diện
  isActive: boolean;    // Trạng thái
  sortOrder: number;    // Thứ tự
};

/**
 * Thương hiệu Trendtech
 * Next.js API: GET /api/hrm/brands
 */
export type TrendtechBrand = {
  id: number;           // Brand ID trên Trendtech
  name: string;         // Tên thương hiệu
  slug: string;         // URL slug
  logo?: string;        // Logo URL
  description?: string; // Mô tả
  isActive: boolean;    // Trạng thái
  sortOrder: number;    // Thứ tự
};

// ========================================
// Mapping Types
// ========================================

/**
 * Mapping danh mục HRM → Trendtech
 */
export type TrendtechCategoryMapping = {
  id: string;                         // Unique mapping ID
  hrmCategorySystemId: SystemId;      // Category systemId trong HRM
  hrmCategoryName: string;            // Tên hiển thị HRM
  trendtechCatId: number;             // Category ID trên Trendtech
  trendtechCatName: string;           // Tên danh mục Trendtech
};

/**
 * Mapping thương hiệu HRM → Trendtech
 */
export type TrendtechBrandMapping = {
  id: string;                         // Unique mapping ID
  hrmBrandSystemId: SystemId;         // Brand systemId trong HRM
  hrmBrandName: string;               // Tên hiển thị HRM
  trendtechBrandId: number;           // Brand ID trên Trendtech
  trendtechBrandName: string;         // Tên thương hiệu Trendtech
};

/**
 * Mapping bảng giá HRM → Trendtech
 * Trendtech chỉ có 2 loại giá: price (giá bán) và compareAtPrice (giá so sánh/giá gốc)
 */
export type TrendtechPriceMapping = {
  price: SystemId | null;             // Bảng giá → price (giá bán hiện tại)
  compareAtPrice: SystemId | null;    // Bảng giá → compareAtPrice (giá gốc để gạch)
};

// ========================================
// Sync Settings Types
// ========================================

/**
 * Cài đặt đồng bộ tự động
 */
export type TrendtechSyncSettings = {
  autoSyncEnabled: boolean;           // Bật/tắt auto sync
  intervalMinutes: number;            // Tần suất (15, 30, 60, 120, 240)
  syncInventory: boolean;             // Đồng bộ tồn kho
  syncPrice: boolean;                 // Đồng bộ giá
  syncSeo: boolean;                   // Đồng bộ SEO
  syncOnProductUpdate: boolean;       // Sync ngay khi update SP trong HRM
  notifyOnError: boolean;             // Thông báo khi có lỗi
};

/**
 * Log đồng bộ Trendtech
 */
export type TrendtechSyncLog = {
  id: string;                         // Unique log ID
  timestamp: string;                  // ISO timestamp
  action: 
    | 'test_connection'               // Test kết nối API
    | 'ping'                          // Ping server
    | 'sync_all'                      // Đồng bộ toàn bộ
    | 'sync_price'                    // Đồng bộ giá
    | 'sync_inventory'                // Đồng bộ tồn kho
    | 'sync_seo'                      // Đồng bộ SEO
    | 'create_product'                // Tạo sản phẩm mới
    | 'update_product'                // Cập nhật sản phẩm
    | 'delete_product'                // Xóa sản phẩm
    | 'link_product'                  // Liên kết SP HRM với Trendtech
    | 'unlink_product'                // Hủy liên kết SP
    | 'sync_categories'               // Đồng bộ danh mục
    | 'sync_brands'                   // Đồng bộ thương hiệu
    | 'get_products'                  // Lấy danh sách SP từ Trendtech
    | 'upload_image'                  // Upload ảnh sản phẩm
    | 'save_config'                   // Lưu cấu hình
    | 'save_mapping';                 // Lưu mapping
  status: 'success' | 'error' | 'partial' | 'info';
  message: string;
  details?: {
    url?: string;
    method?: string;
    responseTime?: number;
    httpStatus?: number;
    total?: number;
    success?: number;
    failed?: number;
    productId?: string;
    productName?: string;
    trendtechId?: number;
    inventory?: number;
    categoryId?: number;
    brandId?: number;
    error?: string;
    errorCode?: string;
  };
};

/**
 * Kết quả sync gần nhất
 */
export type TrendtechSyncResult = {
  status: 'success' | 'partial' | 'error';
  total: number;
  success: number;
  failed: number;
  errors?: string[];
};

// ========================================
// Main Trendtech Settings Type
// ========================================

/**
 * Toàn bộ cài đặt Trendtech
 */
export type TrendtechSettings = {
  // === General Config ===
  apiUrl: string;                     // Next.js API base URL (e.g., https://trendtech.vn/api/hrm)
  apiKey: string;                     // API Key for authentication
  enabled: boolean;                   // Bật/tắt tích hợp Trendtech
  
  // === Reference Data ===
  categories: TrendtechCategory[];
  brands: TrendtechBrand[];
  
  // === Mappings ===
  priceMapping: TrendtechPriceMapping;
  categoryMappings: TrendtechCategoryMapping[];
  brandMappings: TrendtechBrandMapping[];
  
  // === Sync Settings ===
  syncSettings: TrendtechSyncSettings;
  
  // === Status ===
  lastSyncAt?: string;
  lastSyncResult?: TrendtechSyncResult;
  connectionStatus?: 'connected' | 'disconnected' | 'error';
  connectionError?: string;
  
  // === Logs ===
  logs: TrendtechSyncLog[];
  
  // === Cached Trendtech Products ===
  trendtechProducts: TrendtechProduct[];
  trendtechProductsLastFetch?: string;
};

// ========================================
// Trendtech Product Types (từ API)
// ========================================

/**
 * Sản phẩm trả về từ Trendtech API
 * Next.js API: GET /api/hrm/products
 * 
 * Lưu ý:
 * - id: Primary Key, dùng để update/link sản phẩm
 * - sku: Mã SKU có thể sync với HRM.sku
 */
export type TrendtechProduct = {
  id: number;                         // PRIMARY KEY - Dùng để update sản phẩm
  name: string;                       // Tên sản phẩm
  slug: string;                       // URL slug
  sku?: string;                       // Mã SKU
  
  // Mô tả
  shortDescription?: string;          // Mô tả ngắn
  description?: string;               // Mô tả chi tiết (HTML)
  
  // Giá cả
  price: number;                      // Giá bán hiện tại
  compareAtPrice?: number;            // Giá gốc (để gạch)
  costPrice?: number;                 // Giá vốn
  
  // Tồn kho
  quantity: number;                   // Số lượng tồn
  inStock: boolean;                   // Còn hàng
  trackQuantity: boolean;             // Theo dõi tồn kho
  
  // Phân loại
  categoryId?: number;                // ID danh mục
  categoryName?: string;              // Tên danh mục
  brandId?: number;                   // ID thương hiệu
  brandName?: string;                 // Tên thương hiệu
  
  // Hình ảnh
  thumbnail?: string;                 // Ảnh đại diện
  images?: string[];                  // Gallery ảnh
  
  // SEO
  metaTitle?: string;                 // Tiêu đề SEO
  metaDescription?: string;           // Mô tả SEO
  metaKeywords?: string;              // Keywords SEO
  
  // Trạng thái
  isActive: boolean;                  // Đang bán
  isFeatured: boolean;                // Nổi bật
  isNewArrival: boolean;              // Hàng mới
  isBestSeller: boolean;              // Bán chạy
  isOnSale: boolean;                  // Đang giảm giá
  
  // Timestamps
  createdAt: string;
  updatedAt: string;
};

/**
 * Payload tạo/cập nhật sản phẩm trên Trendtech
 * Next.js API: POST/PUT /api/hrm/products
 */
export type TrendtechProductPayload = {
  name: string;
  slug?: string;
  sku?: string;
  shortDescription?: string;
  description?: string;
  price: number;
  compareAtPrice?: number;
  costPrice?: number;
  quantity?: number;
  trackQuantity?: boolean;
  categoryId?: number;
  brandId?: number;
  thumbnail?: string;
  images?: string[];
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string;
  isActive?: boolean;
  isFeatured?: boolean;
  isNewArrival?: boolean;
  isBestSeller?: boolean;
  isOnSale?: boolean;
};

// ========================================
// API Response Types
// ========================================

/**
 * Response chuẩn từ Trendtech API
 */
export type TrendtechApiResponse<T> = {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
};

/**
 * Response danh sách sản phẩm (có phân trang)
 */
export type TrendtechProductsResponse = {
  products: TrendtechProduct[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

/**
 * Response danh mục
 */
export type TrendtechCategoriesResponse = {
  categories: TrendtechCategory[];
};

/**
 * Response thương hiệu
 */
export type TrendtechBrandsResponse = {
  brands: TrendtechBrand[];
};

/**
 * Response tạo sản phẩm
 */
export type TrendtechCreateProductResponse = {
  id: number;
  slug: string;
  message: string;
};

/**
 * Response cập nhật sản phẩm
 */
export type TrendtechUpdateProductResponse = {
  id: number;
  slug?: string;
  message: string;
};

/**
 * Response upload ảnh
 */
export type TrendtechImageUploadResponse = {
  url: string;
  filename: string;
  size: number;
};

// ========================================
// Constants
// ========================================

export const TRENDTECH_API_CONFIG = {
  baseUrl: '', // Will be set from settings
  endpoints: {
    ping: '/ping',
    test: '/test',
    products: '/products',
    categories: '/categories',
    brands: '/brands',
    syncPrice: '/sync/price',
    syncStock: '/sync/stock',
    syncSeo: '/sync/seo',
    uploadImage: '/upload/image',
  },
};

export const SYNC_INTERVAL_OPTIONS = [
  { value: 15, label: 'Mỗi 15 phút' },
  { value: 30, label: 'Mỗi 30 phút' },
  { value: 60, label: 'Mỗi 1 giờ' },
  { value: 120, label: 'Mỗi 2 giờ' },
  { value: 240, label: 'Mỗi 4 giờ' },
  { value: 480, label: 'Mỗi 8 giờ' },
  { value: 1440, label: 'Mỗi ngày' },
];

// ========================================
// Default Settings
// ========================================

export const DEFAULT_TRENDTECH_SETTINGS: TrendtechSettings = {
  apiUrl: '',
  apiKey: '',
  enabled: false,
  categories: [],
  brands: [],
  priceMapping: {
    price: null,
    compareAtPrice: null,
  },
  categoryMappings: [],
  brandMappings: [],
  syncSettings: {
    autoSyncEnabled: false,
    intervalMinutes: 60,
    syncInventory: true,
    syncPrice: true,
    syncSeo: false,
    syncOnProductUpdate: false,
    notifyOnError: true,
  },
  logs: [],
  trendtechProducts: [],
};
