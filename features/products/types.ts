export type ProductStatus = 'active' | 'inactive' | 'discontinued';
export type ProductType = 'physical' | 'service' | 'digital';

import { type SystemId, type BusinessId } from "@/lib/id-types";

export type Product = {
  systemId: SystemId;
  id: BusinessId; // User-facing SKU
  name: string;
  
  // Product Content
  title?: string; // Tiêu đề SEO-friendly
  description?: string; // Mô tả chi tiết (có thể dài, hỗ trợ HTML)
  shortDescription?: string; // Mô tả ngắn gọn (1-2 câu)
  images?: string[]; // Mảng URL hình ảnh
  
  // Classification - Linked to settings
  type?: ProductType; // 'physical' | 'service' | 'digital'
  productTypeSystemId?: SystemId; // Link to ProductType.systemId from settings
  categorySystemId?: SystemId; // Link to ProductCategory.systemId from settings
  storageLocationSystemId?: SystemId; // Link to StorageLocation.systemId - Điểm lưu kho
  tags?: string[]; // Tags để filter
  status?: ProductStatus; // 'active' | 'inactive' | 'discontinued'
  
  unit: string;
  costPrice: number;
  lastPurchasePrice?: number; // Giá nhập gần nhất từ đơn hàng
  lastPurchaseDate?: string; // Ngày nhập gần nhất
  
  // Pricing
  prices: Record<string, number>; // Key is PricingPolicy.systemId
  suggestedRetailPrice?: number; // Giá bán lẻ đề xuất
  minPrice?: number; // Giá tối thiểu cho phép

  // Inventory
  // FIX: Renamed inventoryByLocation to inventoryByBranch to match usage across the app.
  isStockTracked?: boolean; // false cho dịch vụ, true cho hàng hóa
  inventoryByBranch: Record<SystemId, number>; // Key is Branch.systemId, represents On-Hand stock
  committedByBranch: Record<SystemId, number>; // Key is Branch.systemId, represents stock in open orders
  inTransitByBranch: Record<SystemId, number>; // New field for stock that has been dispatched but not delivered
  
  // New inventory management fields
  reorderLevel?: number;
  safetyStock?: number;
  maxStock?: number; // Mức tồn tối đa

  // Logistics
  weight?: number;
  weightUnit?: 'g' | 'kg';
  dimensions?: { length?: number; width?: number; height?: number }; // cm
  barcode?: string; // Mã vạch
  
  // Purchasing
  primarySupplierSystemId?: SystemId; // Links to Supplier.systemId
  
  // Warranty
  warrantyPeriodMonths?: number; // Thời hạn bảo hành (tháng), mặc định 12 tháng
  
  // Sales Analytics
  totalSold?: number; // Tổng số lượng đã bán
  totalRevenue?: number; // Tổng doanh thu
  lastSoldDate?: string; // Ngày bán gần nhất
  viewCount?: number; // Số lần xem
  
  // Lifecycle
  launchedDate?: string; // Ngày ra mắt
  discontinuedDate?: string; // Ngày ngừng kinh doanh
  
  // Audit fields
  createdAt?: string; // ISO timestamp
  updatedAt?: string; // ISO timestamp
  deletedAt?: string | null; // ISO timestamp when soft-deleted
  isDeleted?: boolean; // Soft delete flag
  createdBy?: SystemId; // Employee systemId who created this
  updatedBy?: SystemId; // Employee systemId who last updated this
};
