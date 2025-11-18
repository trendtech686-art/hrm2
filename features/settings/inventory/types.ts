// Product Type (Loại sản phẩm)
export interface ProductType {
  systemId: string;
  id: string; // User-facing ID
  name: string;
  description?: string;
  isDefault?: boolean;
  isDeleted?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

// Product Category (Danh mục sản phẩm)
export interface ProductCategory {
  systemId: string;
  id: string; // User-facing ID
  name: string;
  description?: string;
  parentId?: string; // For hierarchical categories
  path?: string; // Full path like "Điện tử > Máy tính > Bàn phím"
  level?: number; // 0 for root, 1 for first child, etc.
  color?: string; // For UI display
  icon?: string; // Icon name or emoji
  sortOrder?: number;
  isActive?: boolean;
  isDeleted?: boolean;
  createdAt?: string;
  updatedAt?: string;
}
