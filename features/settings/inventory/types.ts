import type { SystemId, BusinessId } from '@/lib/id-types';

// ========================================
// Multi-Website SEO Support
// ========================================

/**
 * SEO Data cho một website cụ thể
 * Mỗi entity (Category, Brand, Product) có thể có SEO riêng cho từng website
 */
export interface WebsiteSeoData {
  seoTitle?: string | undefined; // Title tag cho SEO
  metaDescription?: string | undefined; // Meta description
  seoKeywords?: string | undefined; // Keywords (comma separated)
  shortDescription?: string | undefined; // Mô tả ngắn (1-2 câu)
  longDescription?: string | undefined; // Mô tả chi tiết (HTML)
  slug?: string | undefined; // URL slug cho website này
  ogImage?: string | undefined; // Open Graph image URL (for social sharing)
}

/**
 * SEO Data cho nhiều website
 * Key là website code: 'pkgx' | 'web2' | ...
 */
export type MultiWebsiteSeo = Record<string, WebsiteSeoData>;

// ========================================
// Product Type (Loại sản phẩm)
// ========================================
export interface ProductType {
  systemId: SystemId;
  id: BusinessId; // User-facing ID
  name: string;
  description?: string | undefined;
  isDefault?: boolean | undefined;
  isActive?: boolean | undefined;
  isDeleted?: boolean | undefined;
  createdAt?: string | undefined;
  updatedAt?: string | undefined;
}

// Product Category (Danh mục sản phẩm) - Nâng cấp theo WordPress
export interface ProductCategory {
  systemId: SystemId;
  id: BusinessId; // User-facing ID (Mã danh mục)
  name: string; // Tên danh mục (hiển thị)
  slug?: string | undefined; // URL-friendly name (VD: "ban-phim-co")
  
  // SEO Fields (giống WordPress) - Default/HRM internal
  seoTitle?: string | undefined; // Title tag cho SEO
  metaDescription?: string | undefined; // Meta description cho SEO
  seoKeywords?: string | undefined; // Từ khóa SEO
  shortDescription?: string | undefined; // Mô tả ngắn (1-2 câu)
  longDescription?: string | undefined; // Mô tả chi tiết (HTML)
  
  // Multi-website SEO (NEW) - SEO riêng cho từng website
  // Key: 'pkgx' | 'web2' | ...
  websiteSeo?: MultiWebsiteSeo | undefined;
  
  // Hierarchy
  parentId?: SystemId | undefined; // Danh mục cha
  path?: string | undefined; // Full path: "Điện tử > Máy tính > Bàn phím"
  level?: number | undefined; // 0 = root, 1 = child, 2 = grandchild (max 3 cấp)
  
  // Display
  color?: string | undefined; // Màu hiển thị
  icon?: string | undefined; // Icon hoặc emoji
  thumbnailImage?: string | undefined; // Ảnh đại diện danh mục
  
  // Settings
  sortOrder?: number | undefined;
  isActive?: boolean | undefined;
  isDeleted?: boolean | undefined;
  
  // Timestamps
  createdAt?: string | undefined;
  updatedAt?: string | undefined;
}

// Brand (Thương hiệu)
export interface Brand {
  systemId: SystemId;
  id: BusinessId; // User-facing ID
  name: string;
  description?: string | undefined; // Mô tả chung (HRM internal)
  website?: string | undefined;
  logo?: string | undefined;
  
  // SEO Fields (NEW) - Default/HRM internal
  seoTitle?: string | undefined;
  metaDescription?: string | undefined;
  seoKeywords?: string | undefined; // Từ khóa SEO
  shortDescription?: string | undefined; // Mô tả ngắn
  longDescription?: string | undefined; // Mô tả dài (HTML)
  
  // Multi-website SEO (NEW) - SEO riêng cho từng website
  // Key: 'pkgx' | 'web2' | ...
  websiteSeo?: MultiWebsiteSeo | undefined;
  
  // Settings
  isActive?: boolean | undefined;
  isDeleted?: boolean | undefined;
  
  // Timestamps
  createdAt?: string | undefined;
  updatedAt?: string | undefined;
}

// Product SLA Settings (Cấu hình cảnh báo tồn kho)
export interface ProductSlaSettings {
  // Ngưỡng cảnh báo mặc định (áp dụng cho tất cả SP nếu không cấu hình riêng)
  defaultReorderLevel?: number | undefined; // Mức đặt hàng lại mặc định
  defaultSafetyStock?: number | undefined; // Tồn kho an toàn mặc định
  defaultMaxStock?: number | undefined; // Tồn kho tối đa mặc định
  
  // Cảnh báo hàng tồn lâu
  deadStockDays?: number | undefined; // Số ngày không bán → coi là hàng chết (default: 90)
  slowMovingDays?: number | undefined; // Số ngày không bán → coi là hàng chậm (default: 30)
  
  // Notification settings
  enableEmailAlerts?: boolean | undefined;
  alertEmailRecipients?: string[] | undefined;
  alertFrequency?: 'daily' | 'weekly' | 'realtime' | undefined;
  
  // Dashboard settings
  showOnDashboard?: boolean | undefined;
  dashboardAlertTypes?: ('out_of_stock' | 'low_stock' | 'below_safety' | 'over_stock' | 'dead_stock')[] | undefined;
}

export type LogisticsPreset = {
  weight?: number | undefined;
  weightUnit?: 'g' | 'kg' | undefined;
  length?: number | undefined;
  width?: number | undefined;
  height?: number | undefined;
};

export interface ProductLogisticsSettings {
  physicalDefaults: LogisticsPreset;
  comboDefaults: LogisticsPreset;
}

// Importer (Đơn vị nhập khẩu)
export interface Importer {
  systemId: SystemId;
  id: BusinessId; // User-facing ID (Mã đơn vị)
  name: string; // Tên đơn vị nhập khẩu
  address?: string | undefined; // Địa chỉ
  origin?: string | undefined; // Xuất xứ mặc định (VD: Trung Quốc, Việt Nam)
  phone?: string | undefined; // Số điện thoại
  email?: string | undefined; // Email
  taxCode?: string | undefined; // Mã số thuế
  usageGuide?: string | undefined; // Hướng dẫn sử dụng mặc định
  
  // Settings
  isDefault?: boolean | undefined;
  isActive?: boolean | undefined;
  isDeleted?: boolean | undefined;
  
  // Timestamps
  createdAt?: string | undefined;
  updatedAt?: string | undefined;
}
