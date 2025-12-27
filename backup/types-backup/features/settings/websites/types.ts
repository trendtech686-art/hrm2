/**
 * Website Integration Types
 * 
 * Hỗ trợ tích hợp với nhiều website khác nhau (PKGX, Web2, ...)
 * Mỗi website có cấu hình API riêng và mapping riêng
 */

import type { SystemId } from '@/lib/id-types';

// ========================================
// Website Definition
// ========================================

/**
 * Website Code - Dùng làm key để lưu SEO data
 */
export type WebsiteCode = 'pkgx' | 'trendtech' | string;

/**
 * Định nghĩa một website tích hợp
 */
export interface WebsiteDefinition {
  code: WebsiteCode;           // Unique code: 'pkgx', 'trendtech'
  name: string;                // Tên hiển thị: "Phụ kiện giá xưởng", "Trendtech"
  shortName: string;           // Tên ngắn cho tabs: "PKGX", "Trendtech"
  description?: string;        // Mô tả ngắn
  baseUrl: string;             // URL website: https://phukiengiaxuong.com.vn
  adminUrl?: string;           // URL admin panel
  apiUrl?: string;             // URL API endpoint
  platform?: 'ecshop' | 'wordpress' | 'shopify' | 'custom'; // Platform type
  isActive: boolean;           // Bật/tắt
  sortOrder: number;           // Thứ tự hiển thị
  
  // Branding
  logo?: string;               // Logo URL
  color?: string;              // Theme color (hex)
  
  // Features
  features?: {
    syncProducts?: boolean;    // Đồng bộ sản phẩm
    syncCategories?: boolean;  // Đồng bộ danh mục
    syncBrands?: boolean;      // Đồng bộ thương hiệu
    syncInventory?: boolean;   // Đồng bộ tồn kho
    syncPrices?: boolean;      // Đồng bộ giá
    syncSeo?: boolean;         // Đồng bộ SEO
    uploadImages?: boolean;    // Upload ảnh
  };
}

// ========================================
// Predefined Websites
// ========================================

/**
 * Danh sách website được định nghĩa sẵn
 */
export const PREDEFINED_WEBSITES: WebsiteDefinition[] = [
  {
    code: 'pkgx',
    name: 'Phụ kiện giá xưởng',
    shortName: 'PKGX',
    description: 'Website phukiengiaxuong.com.vn',
    baseUrl: 'https://phukiengiaxuong.com.vn',
    adminUrl: 'https://phukiengiaxuong.com.vn/admin',
    apiUrl: 'https://phukiengiaxuong.com.vn/admin/api_product_hrm_v1.php',
    platform: 'ecshop',
    isActive: true,
    sortOrder: 1,
    color: '#ef4444',
    features: {
      syncProducts: true,
      syncCategories: true,
      syncBrands: true,
      syncInventory: true,
      syncPrices: true,
      syncSeo: true,
      uploadImages: true,
    },
  },
  {
    code: 'trendtech',
    name: 'Trendtech',
    shortName: 'Trendtech',
    description: 'Website Trendtech (sắp ra mắt)',
    baseUrl: '',
    platform: 'custom',
    isActive: true, // Active để hiển thị tab SEO
    sortOrder: 2,
    color: '#3b82f6',
    features: {
      syncProducts: true,
      syncCategories: true,
      syncBrands: true,
      syncInventory: true,
      syncPrices: true,
      syncSeo: true,
      uploadImages: true,
    },
  },
];

// ========================================
// Helper Functions
// ========================================

/**
 * Lấy website theo code
 */
export function getWebsiteByCode(code: WebsiteCode): WebsiteDefinition | undefined {
  return PREDEFINED_WEBSITES.find(w => w.code === code);
}

/**
 * Lấy danh sách website đang active
 */
export function getActiveWebsites(): WebsiteDefinition[] {
  return PREDEFINED_WEBSITES.filter(w => w.isActive).sort((a, b) => a.sortOrder - b.sortOrder);
}

/**
 * Lấy tên hiển thị của website
 */
export function getWebsiteName(code: WebsiteCode): string {
  const website = getWebsiteByCode(code);
  return website?.name || code.toUpperCase();
}

/**
 * Lấy màu theme của website
 */
export function getWebsiteColor(code: WebsiteCode): string {
  const website = getWebsiteByCode(code);
  return website?.color || '#6b7280';
}
