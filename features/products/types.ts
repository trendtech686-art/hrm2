export type ProductStatus = 'active' | 'inactive' | 'discontinued';
export type ProductType = 'physical' | 'service' | 'digital' | 'combo';

import { type SystemId, type BusinessId } from "@/lib/id-types";
import type { HistoryEntry } from "@/lib/activity-history-helper";
import type { WebsiteSeoData, MultiWebsiteSeo } from "@/features/settings/inventory/types";

// Re-export for convenience
export type { WebsiteSeoData, MultiWebsiteSeo };

/**
 * ComboItem - Sản phẩm con trong Combo
 * Tham khảo: Sapo - tối đa 20 sản phẩm con, không cho phép combo lồng combo
 */
export type ComboItem = {
  productSystemId: SystemId; // Link to Product.systemId
  quantity: number; // Số lượng SP con trong combo (>= 1)
};

/**
 * Cách tính giá combo
 * - 'fixed': Giá cố định do người dùng nhập
 * - 'sum_discount_percent': Tổng giá SP con - % giảm giá
 * - 'sum_discount_amount': Tổng giá SP con - số tiền giảm
 */
export type ComboPricingType = 'fixed' | 'sum_discount_percent' | 'sum_discount_amount';

/**
 * ProductVariant - Biến thể sản phẩm (màu sắc, size, chất liệu...)
 * VD: Áo sơ mi có variant: Trắng-M, Trắng-L, Xanh-M, Xanh-L
 */
export type ProductVariant = {
  id: string; // Unique ID within product (VD: "trang-m", "xanh-l")
  sku?: string | undefined; // SKU riêng cho variant
  barcode?: string | undefined; // Mã vạch riêng
  name: string; // Tên hiển thị (VD: "Trắng - Size M")
  
  // Attributes
  attributes: Record<string, string>; // VD: { color: "Trắng", size: "M" }
  
  // Pricing (override từ product nếu có)
  costPrice?: number | undefined;
  sellingPrice?: number | undefined;
  prices?: Record<string, number> | undefined; // Giá theo bảng giá
  
  // Inventory (tồn kho riêng cho variant)
  inventoryByBranch?: Record<SystemId, number> | undefined;
  
  // Media
  image?: string | undefined; // Ảnh riêng cho variant
  
  // Status
  isActive?: boolean | undefined;
  sortOrder?: number | undefined;
};

/**
 * Attribute Option cho Variants
 * VD: Color có options: Trắng, Đen, Xanh
 */
export type VariantAttribute = {
  name: string; // VD: "Màu sắc", "Size"
  code: string; // VD: "color", "size"
  options: string[]; // VD: ["Trắng", "Đen", "Xanh"]
};

export type Product = {
  systemId: SystemId;
  id: BusinessId; // User-facing SKU
  name: string;
  
  // Product Content - Default/HRM internal
  ktitle?: string | undefined; // Tiêu đề SEO-friendly
  seoDescription?: string | undefined; // Mô tả SEO
  seoKeywords?: string | undefined; // Keywords SEO (comma separated)
  description?: string | undefined; // Mô tả chi tiết (có thể dài, hỗ trợ HTML)
  shortDescription?: string | undefined; // Mô tả ngắn gọn (1-2 câu)
  thumbnailImage?: string | undefined; // Ảnh đại diện chính
  galleryImages?: string[] | undefined; // Bộ sưu tập ảnh phụ (tối đa 9)
  images?: string[] | undefined; // Trường legacy - vẫn giữ để tương thích
  videoLinks?: string[] | undefined; // Video links (YouTube, TikTok, Google Drive...)
  
  // Multi-website SEO (NEW) - SEO riêng cho từng website
  // Key: 'pkgx' | 'web2' | ...
  // Mỗi website có thể có: seoTitle, metaDescription, seoKeywords, shortDescription, longDescription, slug
  websiteSeo?: MultiWebsiteSeo | undefined;
  
  // Classification - Linked to settings
  type?: ProductType | undefined; // 'physical' | 'service' | 'digital'
  productTypeSystemId?: SystemId | undefined; // Link to ProductType.systemId from settings
  categorySystemId?: SystemId | undefined; // Link to ProductCategory.systemId from settings (legacy - single category)
  categorySystemIds?: SystemId[] | undefined; // Multi-category: Array of ProductCategory.systemId
  category?: string | undefined; // Legacy category text input
  categories?: string[] | undefined; // Multi-category: Array of category paths (VD: ["Thời trang > Áo nam", "Sale > Hot"])
  subCategory?: string | undefined; // Legacy sub-category text input
  subCategories?: string[] | undefined; // Multi sub-category: Array of sub-category paths
  brandSystemId?: SystemId | undefined; // Link to Brand.systemId from settings
  productType?: string | undefined; // Legacy display-only type
  warehouseLocation?: string | undefined; // Location label
  storageLocationSystemId?: SystemId | undefined; // Link to StorageLocation.systemId - Điểm lưu kho
  tags?: string[] | undefined; // Tags để filter
  status?: ProductStatus | undefined; // 'active' | 'inactive' | 'discontinued'
  pkgxId?: number | undefined; // ID PKGX (chỉ số dương)
  
  unit: string;
  costPrice: number;
  lastPurchasePrice?: number | undefined; // Giá nhập gần nhất từ đơn hàng
  lastPurchaseDate?: string | undefined; // Ngày nhập gần nhất
  
  // Pricing
  prices: Record<string, number>; // Key is PricingPolicy.systemId
  suggestedRetailPrice?: number | undefined; // Giá bán lẻ đề xuất
  minPrice?: number | undefined; // Giá tối thiểu cho phép
  sellingPrice?: number | undefined; // Legacy selling price
  taxRate?: number | undefined;

  sku?: string | undefined; // Alias for id for compatibility

  // Inventory
  // FIX: Renamed inventoryByLocation to inventoryByBranch to match usage across the app.
  isStockTracked?: boolean | undefined; // false cho dịch vụ, true cho hàng hóa
  inventoryByBranch: Record<SystemId, number>; // Key is Branch.systemId, represents On-Hand stock
  committedByBranch: Record<SystemId, number>; // Key is Branch.systemId, represents stock in open orders
  inTransitByBranch: Record<SystemId, number>; // New field for stock that has been dispatched but not delivered
  
  // New inventory management fields
  reorderLevel?: number | undefined;
  safetyStock?: number | undefined;
  maxStock?: number | undefined; // Mức tồn tối đa

  // Logistics
  weight?: number | undefined;
  weightUnit?: 'g' | 'kg' | undefined;
  dimensions?: { length?: number | undefined; width?: number | undefined; height?: number | undefined } | undefined; // cm
  barcode?: string | undefined; // Mã vạch
  
  // Purchasing
  primarySupplierSystemId?: SystemId | undefined; // Links to Supplier.systemId
  
  // Warranty
  warrantyPeriodMonths?: number | undefined; // Thời hạn bảo hành (tháng), mặc định 12 tháng
  
  // ═══════════════════════════════════════════════════════════════
  // TEM PHỤ FIELDS (thông tin in tem phụ sản phẩm)
  // ═══════════════════════════════════════════════════════════════
  nameVat?: string | undefined; // Tên sản phẩm VAT (tên đầy đủ cho hóa đơn/tem)
  origin?: string | undefined; // Xuất xứ / Địa chỉ sản xuất
  usageGuide?: string | undefined; // Hướng dẫn sử dụng (override từ Importer)
  importerSystemId?: SystemId | undefined; // Link to Importer.systemId từ settings
  importerName?: string | undefined; // Override tên đơn vị nhập khẩu (nếu khác với setting)
  importerAddress?: string | undefined; // Override địa chỉ nhập khẩu (nếu khác với setting)
  
  // ═══════════════════════════════════════════════════════════════
  // COMBO FIELDS (chỉ áp dụng khi type === 'combo')
  // Tham khảo: Sapo - Combo không có tồn kho riêng, tính từ SP con
  // ═══════════════════════════════════════════════════════════════
  comboItems?: ComboItem[] | undefined; // Danh sách SP con (tối đa 20)
  comboPricingType?: ComboPricingType | undefined; // Cách tính giá combo
  comboDiscount?: number | undefined; // Giảm giá (% hoặc số tiền tùy theo comboPricingType)
  
  // ═══════════════════════════════════════════════════════════════
  // E-COMMERCE FIELDS (cho bán hàng trên website)
  // ═══════════════════════════════════════════════════════════════
  slug?: string | undefined; // URL-friendly: "ao-so-mi-nam-trang" (tự generate từ name nếu để trống)
  isPublished?: boolean | undefined; // Hiển thị trên website (default: false - chỉ hiện khi publish)
  isFeatured?: boolean | undefined; // Sản phẩm nổi bật (hiện ở trang chủ)
  isNewArrival?: boolean | undefined; // Sản phẩm mới về
  isBestSeller?: boolean | undefined; // Bán chạy (có thể tự động từ totalSold)
  isOnSale?: boolean | undefined; // Đang giảm giá
  sortOrder?: number | undefined; // Thứ tự hiển thị (số nhỏ hiện trước)
  publishedAt?: string | undefined; // Ngày đăng lên web
  
  // Variants (biến thể: màu sắc, size, chất liệu...)
  hasVariants?: boolean | undefined; // SP có biến thể không
  variantAttributes?: VariantAttribute[] | undefined; // Định nghĩa các thuộc tính variant (color, size...)
  variants?: ProductVariant[] | undefined; // Danh sách biến thể
  
  // Sales Analytics
  totalSold?: number | undefined; // Tổng số lượng đã bán
  totalRevenue?: number | undefined; // Tổng doanh thu
  lastSoldDate?: string | undefined; // Ngày bán gần nhất
  viewCount?: number | undefined; // Số lần xem
  
  // Lifecycle
  launchedDate?: string | undefined; // Ngày ra mắt
  discontinuedDate?: string | undefined; // Ngày ngừng kinh doanh
  
  // Audit fields
  createdAt?: string | undefined; // ISO timestamp
  updatedAt?: string | undefined; // ISO timestamp
  deletedAt?: string | null | undefined; // ISO timestamp when soft-deleted
  isDeleted?: boolean | undefined; // Soft delete flag
  createdBy?: SystemId | undefined; // Employee systemId who created this
  updatedBy?: SystemId | undefined; // Employee systemId who last updated this

  // Activity History
  activityHistory?: HistoryEntry[];
};
