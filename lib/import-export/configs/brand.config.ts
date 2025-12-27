import type { Brand } from '@/lib/types/prisma-extended';
import type { ImportExportConfig, FieldConfig } from '@/lib/import-export/types';

/**
 * Brand Import/Export Configuration
 * Theo chuẩn ImportExportConfig để dùng với GenericImportDialogV2 và GenericExportDialogV2
 */

// Field definitions for Brand import/export
export const brandFields: FieldConfig<Brand>[] = [
  // === Basic Info ===
  {
    key: 'id',
    label: 'Mã thương hiệu (*)',
    type: 'string',
    required: true,
    exportGroup: 'Thông tin cơ bản',
    exportable: true,
    example: 'BRAND001',
    validator: (value) => {
      if (!value || String(value).trim() === '') {
        return 'Mã thương hiệu là bắt buộc';
      }
      return null;
    }
  },
  {
    key: 'name',
    label: 'Tên thương hiệu (*)',
    type: 'string',
    required: true,
    exportGroup: 'Thông tin cơ bản',
    exportable: true,
    example: 'Apple',
    validator: (value) => {
      if (!value || String(value).trim() === '') {
        return 'Tên thương hiệu là bắt buộc';
      }
      return null;
    }
  },
  {
    key: 'description',
    label: 'Mô tả',
    type: 'string',
    required: false,
    exportGroup: 'Thông tin cơ bản',
    exportable: true,
    example: 'Thương hiệu công nghệ hàng đầu thế giới',
  },
  {
    key: 'website',
    label: 'Website',
    type: 'string',
    required: false,
    exportGroup: 'Thông tin cơ bản',
    exportable: true,
    example: 'https://www.apple.com',
    validator: (value) => {
      if (value && typeof value === 'string') {
        const trimmed = value.trim();
        if (trimmed && !trimmed.match(/^https?:\/\/.+/i)) {
          return 'Website phải bắt đầu bằng http:// hoặc https://';
        }
      }
      return null;
    }
  },
  {
    key: 'logo',
    label: 'Logo URL',
    type: 'string',
    required: false,
    exportGroup: 'Thông tin cơ bản',
    exportable: true,
    example: 'https://example.com/logo.png',
  },
  
  // === SEO Fields ===
  {
    key: 'seoTitle',
    label: 'SEO Title',
    type: 'string',
    required: false,
    exportGroup: 'SEO & Mô tả',
    exportable: true,
    example: 'Apple - Thương hiệu công nghệ cao cấp',
  },
  {
    key: 'metaDescription',
    label: 'Meta Description',
    type: 'string',
    required: false,
    exportGroup: 'SEO & Mô tả',
    exportable: true,
    example: 'Apple Inc. là tập đoàn công nghệ đa quốc gia...',
  },
  {
    key: 'seoKeywords',
    label: 'SEO Keywords',
    type: 'string',
    required: false,
    exportGroup: 'SEO & Mô tả',
    exportable: true,
    example: 'apple, iphone, macbook, công nghệ',
  },
  {
    key: 'shortDescription',
    label: 'Mô tả ngắn',
    type: 'string',
    required: false,
    exportGroup: 'SEO & Mô tả',
    exportable: true,
    example: 'Thương hiệu công nghệ hàng đầu từ Mỹ',
  },
  {
    key: 'longDescription',
    label: 'Mô tả chi tiết',
    type: 'string',
    required: false,
    exportGroup: 'SEO & Mô tả',
    exportable: true,
    example: '<p>Apple Inc. được thành lập năm 1976...</p>',
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
export const brandFieldGroups = {
  'Thông tin cơ bản': 'Thông tin cơ bản',
  'SEO & Mô tả': 'SEO & Mô tả',
  'Cài đặt': 'Cài đặt',
} as const;

// Full config object
export const brandImportExportConfig: ImportExportConfig<Brand> = {
  entityType: 'brands',
  entityDisplayName: 'Thương hiệu',
  fields: brandFields,
  
  // Template file
  templateFileName: 'Mau_Nhap_Thuong_Hieu.xlsx',
  sheetName: 'Thương hiệu',
  
  // Upsert config - dùng id làm key
  upsertKey: 'id',
  allowUpdate: true,
  allowInsert: true,
  
  // Max rows
  maxRows: 500,
  
  // Row-level transform after all field transforms
  postTransformRow: (row: Partial<Brand>) => {
    // Ensure isActive defaults to true for new brands
    if (row.isActive === undefined) {
      row.isActive = true;
    }
    return row;
  },
  
  // Validate entire row
  validateRow: (row: Brand, _index: number, _existingData: Brand[], _mode) => {
    const errors: Array<{ field?: string; message: string }> = [];
    
    if (!row.id || String(row.id).trim() === '') {
      errors.push({ field: 'id', message: 'Mã thương hiệu là bắt buộc' });
    }
    
    if (!row.name || String(row.name).trim() === '') {
      errors.push({ field: 'name', message: 'Tên thương hiệu là bắt buộc' });
    }
    
    return errors;
  }
};
