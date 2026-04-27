import type { ProductCategory } from '@/lib/types/prisma-extended';
import type { ImportExportConfig, FieldConfig } from '@/lib/import-export/types';
// NOTE: Prisma import removed to prevent client-side bundling errors
// These helpers are not currently used (marked as TODO in field configs)
// If needed in future, create separate server-side utils file
// import { prisma } from '@/lib/prisma';

/**
 * Product Category Import/Export Configuration
 * Theo chuẩn ImportExportConfig để dùng với GenericImportDialogV2 và GenericExportDialogV2
 */

// ===== PRELOADED DATA CACHE =====
export interface CategoryImportCache {
  categories: Array<{
    systemId: string;
    id: string;
    name: string;
    path?: string;
  }>;
}

// Build cache from preloaded data (called in dialog before preview)
export function buildCategoryImportCache(preloadedData: Record<string, unknown>): CategoryImportCache {
  return {
    categories: (preloadedData.categories as CategoryImportCache['categories']) || [],
  };
}

// Helper: Get category systemId from name using cache (sync)
function getCategorySystemIdByNameFromCache(
  value: string,
  cache: CategoryImportCache
): string | null {
  if (!value || String(value).trim() === '') return null;
  
  const normalizedValue = String(value).trim().toLowerCase();
  
  const byName = cache.categories.find(c => 
    c.name.toLowerCase() === normalizedValue ||
    c.id.toLowerCase() === normalizedValue
  );
  if (byName) return byName.systemId;
  
  const byPath = cache.categories.find(c => 
    c.path?.toLowerCase() === normalizedValue
  );
  if (byPath) return byPath.systemId;
  
  return null;
}

// Helper: Get category name from systemId using cache (sync) - reserved for future use
function _getCategoryNameByIdFromCache(
  systemId: string,
  cache: CategoryImportCache
): string {
  if (!systemId) return '';
  const category = cache.categories.find(c => c.systemId === systemId);
  return category?.name || '';
}

// Field definitions for ProductCategory import/export
export const categoryFields: FieldConfig<ProductCategory>[] = [
  // === Basic Info ===
  {
    key: 'id',
    label: 'Mã danh mục (*)',
    type: 'string',
    required: true,
    exportGroup: 'Thông tin cơ bản',
    exportable: true,
    example: 'CAT001',
    validator: (value) => {
      if (!value || String(value).trim() === '') {
        return 'Mã danh mục là bắt buộc';
      }
      return null;
    }
  },
  {
    key: 'name',
    label: 'Tên danh mục (*)',
    type: 'string',
    required: true,
    exportGroup: 'Thông tin cơ bản',
    exportable: true,
    example: 'Điện thoại',
    validator: (value) => {
      if (!value || String(value).trim() === '') {
        return 'Tên danh mục là bắt buộc';
      }
      return null;
    }
  },
  {
    key: 'slug',
    label: 'Slug',
    type: 'string',
    required: false,
    exportGroup: 'Thông tin cơ bản',
    exportable: true,
    example: 'dien-thoai',
  },
  
  // === Hierarchy ===
  {
    key: 'parentId',
    label: 'Danh mục cha',
    type: 'string',
    required: false,
    exportGroup: 'Phân cấp',
    exportable: true,
    example: 'Điện tử',
    // NOTE: Transform logic đã được di chuyển vào postTransformRow
    // sử dụng preloadedDataCache từ dialog để lookup async
  },
  {
    key: 'path',
    label: 'Đường dẫn',
    type: 'string',
    required: false,
    exportGroup: 'Phân cấp',
    exportable: true,
    hidden: true, // Don't show in import (auto-generated)
    example: 'Điện tử > Điện thoại',
  },
  {
    key: 'level',
    label: 'Cấp độ',
    type: 'number',
    required: false,
    exportGroup: 'Phân cấp',
    exportable: true,
    hidden: true, // Don't show in import (auto-calculated)
    example: '1',
  },
  
  // === Display ===
  {
    key: 'color',
    label: 'Màu sắc',
    type: 'string',
    required: false,
    exportGroup: 'Hiển thị',
    exportable: true,
    example: '#3b82f6',
  },
  {
    key: 'icon',
    label: 'Icon',
    type: 'string',
    required: false,
    exportGroup: 'Hiển thị',
    exportable: true,
    example: '📱',
  },
  {
    key: 'thumbnailImage',
    label: 'Ảnh đại diện',
    type: 'string',
    required: false,
    exportGroup: 'Hiển thị',
    exportable: true,
    example: 'https://example.com/category.jpg',
  },
  {
    key: 'sortOrder',
    label: 'Thứ tự',
    type: 'number',
    required: false,
    exportGroup: 'Hiển thị',
    exportable: true,
    example: '1',
    importTransform: (value) => {
      if (value === undefined || value === null || value === '') return 0;
      const num = Number(value);
      return isNaN(num) ? 0 : num;
    }
  },
  
  // === SEO Fields ===
  {
    key: 'seoTitle',
    label: 'SEO Title',
    type: 'string',
    required: false,
    exportGroup: 'SEO & Mô tả',
    exportable: true,
    example: 'Điện thoại chính hãng - Giá tốt nhất',
  },
  {
    key: 'metaDescription',
    label: 'Meta Description',
    type: 'string',
    required: false,
    exportGroup: 'SEO & Mô tả',
    exportable: true,
    example: 'Mua điện thoại chính hãng giá tốt nhất...',
  },
  {
    key: 'seoKeywords',
    label: 'SEO Keywords',
    type: 'string',
    required: false,
    exportGroup: 'SEO & Mô tả',
    exportable: true,
    example: 'điện thoại, smartphone, iphone, samsung',
  },
  {
    key: 'shortDescription',
    label: 'Mô tả ngắn',
    type: 'string',
    required: false,
    exportGroup: 'SEO & Mô tả',
    exportable: true,
    example: 'Danh mục điện thoại di động các hãng',
  },
  {
    key: 'longDescription',
    label: 'Mô tả chi tiết',
    type: 'string',
    required: false,
    exportGroup: 'SEO & Mô tả',
    exportable: true,
    example: '<p>Điện thoại di động từ các thương hiệu...</p>',
  },
  
  // === Settings ===
  {
    key: 'isActive',
    label: 'Trạng thái',
    type: 'boolean',
    required: false,
    exportGroup: 'Cài đặt',
    exportable: true,
    example: 'Hoạt động',
    importTransform: (value) => {
      if (typeof value === 'boolean') return value;
      if (typeof value === 'number') return value === 1;
      const strValue = String(value).toLowerCase().trim();
      return strValue === 'true' || strValue === '1' || strValue === 'hoạt động' || strValue === 'hoat dong' || strValue === 'có' || strValue === 'co' || strValue === 'yes' || strValue === 'active';
    },
    exportTransform: (value) => value ? 'Hoạt động' : 'Ngừng'
  },
];

// Group labels for UI organization
export const categoryFieldGroups = {
  'Thông tin cơ bản': 'Thông tin cơ bản',
  'Phân cấp': 'Phân cấp',
  'Hiển thị': 'Hiển thị',
  'SEO & Mô tả': 'SEO & Mô tả',
  'Cài đặt': 'Cài đặt',
} as const;

// Full config object
export const categoryImportExportConfig: ImportExportConfig<ProductCategory> = {
  entityType: 'categories',
  entityDisplayName: 'Danh mục sản phẩm',
  fields: categoryFields,
  
  // Template file
  templateFileName: 'Mau_Nhap_Danh_Muc.xlsx',
  sheetName: 'Danh mục',
  
  // Upsert config - dùng id làm key
  upsertKey: 'id',
  allowUpdate: true,
  allowInsert: true,
  
  // Max rows
  maxRows: 500,
  
  // Row-level transform after all field transforms
  // NOTE: preloadedDataCache chứa categories được truyền qua context
  postTransformRow: (row: Partial<ProductCategory>, _index?: number, context?: string | Record<string, unknown>) => {
    // Cast context to Record if it's an object
    const ctx = typeof context === 'object' && context !== null ? context as Record<string, unknown> : null;
    
    // Ensure isActive defaults to true for new categories
    if (row.isActive === undefined) {
      row.isActive = true;
    }
    
    // Default sortOrder to 0
    if (row.sortOrder === undefined) {
      row.sortOrder = 0;
    }
    
    // Generate slug from name if not provided
    if (!row.slug && row.name) {
      row.slug = String(row.name)
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
        .replace(/đ/g, 'd')
        .replace(/Đ/g, 'D')
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
    }
    
    // Transform parentId from name to systemId using preloadedDataCache
    if (row.parentId && typeof row.parentId === 'string' && ctx?.preloadedData) {
      const cache = ctx.preloadedData as CategoryImportCache;
      const parentSystemId = getCategorySystemIdByNameFromCache(row.parentId as string, cache);
      if (parentSystemId) {
        row.parentId = parentSystemId;
      }
    }
    
    return row;
  },
  
  // Validate entire row
  validateRow: (row: ProductCategory, _index: number, _existingData: ProductCategory[], _mode) => {
    const errors: Array<{ field?: string; message: string }> = [];
    
    if (!row.id || String(row.id).trim() === '') {
      errors.push({ field: 'id', message: 'Mã danh mục là bắt buộc' });
    }
    
    if (!row.name || String(row.name).trim() === '') {
      errors.push({ field: 'name', message: 'Tên danh mục là bắt buộc' });
    }
    
    return errors;
  }
};
