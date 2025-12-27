import type { Customer } from '@/lib/types/prisma-extended';
import type { ImportExportConfig, FieldConfig } from '@/lib/import-export/types';

/**
 * Customer Import/Export Configuration
 * Theo chuẩn ImportExportConfig để dùng với GenericImportDialogV2 và GenericExportDialogV2
 */

// ===== FIELD DEFINITIONS =====
export const customerFields: FieldConfig<Customer>[] = [
  // ===== THÔNG TIN CƠ BẢN =====
  {
    key: 'id',
    label: 'Mã khách hàng',
    required: false, // Tự generate nếu để trống
    type: 'string',
    exportGroup: 'Thông tin cơ bản',
    example: 'KH000001',
  },
  {
    key: 'name',
    label: 'Tên khách hàng (*)',
    required: true,
    type: 'string',
    exportGroup: 'Thông tin cơ bản',
    example: 'Công ty TNHH ABC',
  },
  {
    key: 'status',
    label: 'Trạng thái',
    required: false,
    type: 'enum',
    enumValues: ['Đang giao dịch', 'Ngừng Giao Dịch'],
    enumLabels: {
      'Đang giao dịch': 'Đang giao dịch',
      'Ngừng Giao Dịch': 'Ngừng giao dịch',
    },
    exportGroup: 'Thông tin cơ bản',
    example: 'Đang giao dịch',
    defaultValue: 'Đang giao dịch',
  },
  {
    key: 'phone',
    label: 'Số điện thoại',
    required: false,
    type: 'phone',
    exportGroup: 'Thông tin cơ bản',
    example: '0901234567',
    validator: (value: unknown) => {
      if (!value) return null;
      const phone = String(value).replace(/\s/g, '');
      if (!/^0\d{9,10}$/.test(phone)) {
        return '[Warning] Số điện thoại không đúng định dạng';
      }
      return null;
    },
  },
  {
    key: 'email',
    label: 'Email',
    required: false,
    type: 'email',
    exportGroup: 'Thông tin cơ bản',
    example: 'contact@abc.com',
    validator: (value: unknown) => {
      if (!value) return null;
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(String(value))) {
        return 'Email không hợp lệ';
      }
      return null;
    },
  },
  {
    key: 'type',
    label: 'Loại khách hàng',
    required: false,
    type: 'string',
    exportGroup: 'Thông tin cơ bản',
    example: 'Doanh nghiệp',
  },
  {
    key: 'customerGroup',
    label: 'Nhóm khách hàng',
    required: false,
    type: 'string',
    exportGroup: 'Thông tin cơ bản',
    example: 'Khách sỉ',
  },
  {
    key: 'lifecycleStage',
    label: 'Giai đoạn vòng đời',
    required: false,
    type: 'string',
    exportGroup: 'Thông tin cơ bản',
    example: 'Khách mới',
  },
  {
    key: 'source',
    label: 'Nguồn khách hàng',
    required: false,
    type: 'string',
    exportGroup: 'Thông tin cơ bản',
    example: 'Facebook',
  },
  {
    key: 'notes',
    label: 'Ghi chú',
    required: false,
    type: 'string',
    exportGroup: 'Thông tin cơ bản',
    example: 'Khách hàng tiềm năng',
  },

  // ===== THÔNG TIN DOANH NGHIỆP =====
  {
    key: 'company',
    label: 'Tên công ty / HKD',
    required: false,
    type: 'string',
    exportGroup: 'Thông tin doanh nghiệp',
    example: 'Công ty TNHH ABC',
  },
  {
    key: 'taxCode',
    label: 'Mã số thuế',
    required: false,
    type: 'string',
    exportGroup: 'Thông tin doanh nghiệp',
    example: '0123456789',
    validator: (value: unknown) => {
      if (!value) return null;
      const taxCode = String(value);
      if (!/^\d{10}(\d{3})?$/.test(taxCode)) {
        return '[Warning] Mã số thuế phải có 10 hoặc 13 số';
      }
      return null;
    },
  },
  {
    key: 'representative',
    label: 'Người đại diện',
    required: false,
    type: 'string',
    exportGroup: 'Thông tin doanh nghiệp',
    example: 'Nguyễn Văn A',
  },
  {
    key: 'position',
    label: 'Chức vụ',
    required: false,
    type: 'string',
    exportGroup: 'Thông tin doanh nghiệp',
    example: 'Giám đốc',
  },
  {
    key: 'bankName',
    label: 'Ngân hàng',
    required: false,
    type: 'string',
    exportGroup: 'Thông tin doanh nghiệp',
    example: 'Vietcombank',
  },
  {
    key: 'bankAccount',
    label: 'Số tài khoản',
    required: false,
    type: 'string',
    exportGroup: 'Thông tin doanh nghiệp',
    example: '0123456789',
  },

  // ===== THANH TOÁN & GIÁ =====
  {
    key: 'paymentTerms',
    label: 'Hạn thanh toán',
    required: false,
    type: 'string',
    exportGroup: 'Thanh toán & Giá',
    example: 'NET15',
  },
  {
    key: 'creditRating',
    label: 'Xếp hạng tín dụng',
    required: false,
    type: 'string',
    exportGroup: 'Thanh toán & Giá',
    example: 'AAA',
  },
  {
    key: 'currentDebt',
    label: 'Công nợ hiện tại',
    required: false,
    type: 'number',
    exportGroup: 'Thanh toán & Giá',
    example: '0',
    importTransform: (value: unknown) => {
      if (!value) return 0;
      const num = Number(String(value).replace(/[,.\s]/g, ''));
      return isNaN(num) ? 0 : num;
    },
    exportTransform: (value: unknown) => {
      if (!value) return '0';
      return Number(value).toLocaleString('vi-VN');
    },
  },
  {
    key: 'maxDebt',
    label: 'Hạn mức công nợ',
    required: false,
    type: 'number',
    exportGroup: 'Thanh toán & Giá',
    example: '50000000',
    importTransform: (value: unknown) => {
      if (!value) return undefined;
      const num = Number(String(value).replace(/[,.\s]/g, ''));
      return isNaN(num) ? undefined : num;
    },
    exportTransform: (value: unknown) => {
      if (!value) return '';
      return Number(value).toLocaleString('vi-VN');
    },
  },
  {
    key: 'allowCredit',
    label: 'Cho phép công nợ',
    required: false,
    type: 'boolean',
    exportGroup: 'Thanh toán & Giá',
    example: 'Có',
    importTransform: (value: unknown) => {
      if (!value) return undefined;
      const str = String(value).toLowerCase();
      return str === 'có' || str === 'yes' || str === 'true' || str === '1';
    },
    exportTransform: (value: unknown) => value ? 'Có' : 'Không',
  },
  {
    key: 'pricingLevel',
    label: 'Bảng giá áp dụng',
    required: false,
    type: 'enum',
    enumValues: ['Retail', 'Wholesale', 'VIP', 'Partner'],
    enumLabels: {
      'Retail': 'Bán lẻ',
      'Wholesale': 'Bán sỉ',
      'VIP': 'VIP',
      'Partner': 'Đối tác',
    },
    exportGroup: 'Thanh toán & Giá',
    example: 'Retail',
  },
  {
    key: 'defaultDiscount',
    label: 'Chiết khấu mặc định (%)',
    required: false,
    type: 'number',
    exportGroup: 'Thanh toán & Giá',
    example: '5',
    validator: (value: unknown) => {
      if (!value) return null;
      const num = Number(value);
      if (num < 0 || num > 100) {
        return 'Chiết khấu phải từ 0 đến 100%';
      }
      return null;
    },
  },

  // ===== PHÂN LOẠI & QUẢN LÝ =====
  {
    key: 'accountManagerName',
    label: 'Nhân viên phụ trách',
    required: false,
    type: 'string',
    exportGroup: 'Phân loại & Quản lý',
    example: 'Nguyễn Văn B',
  },
  {
    key: 'campaign',
    label: 'Chiến dịch',
    required: false,
    type: 'string',
    exportGroup: 'Phân loại & Quản lý',
    example: 'Summer Sale 2024',
  },
  {
    key: 'tags',
    label: 'Thẻ (Tags)',
    required: false,
    type: 'string',
    exportGroup: 'Phân loại & Quản lý',
    example: 'VIP, Ưu tiên',
    importTransform: (value: unknown) => {
      if (!value) return undefined;
      return String(value).split(',').map(s => s.trim()).filter(Boolean);
    },
    exportTransform: (value: unknown) => {
      if (!value || !Array.isArray(value)) return '';
      return value.join(', ');
    },
  },

  // ===== SOCIAL MEDIA =====
  {
    key: 'zaloPhone',
    label: 'Zalo',
    required: false,
    type: 'phone',
    exportGroup: 'Social Media',
    example: '0901234567',
  },

  // ===== HỆ THỐNG (hidden) =====
  {
    key: 'systemId',
    label: 'System ID',
    required: false,
    type: 'string',
    exportGroup: 'Hệ thống',
    hidden: true,
  },
  {
    key: 'createdAt',
    label: 'Ngày tạo',
    required: false,
    type: 'date',
    exportGroup: 'Hệ thống',
    hidden: true,
  },
  {
    key: 'updatedAt',
    label: 'Ngày cập nhật',
    required: false,
    type: 'date',
    exportGroup: 'Hệ thống',
    hidden: true,
  },
];

// ===== MAIN CONFIG =====
export const customerImportExportConfig: ImportExportConfig<Customer> = {
  entityType: 'customers',
  entityDisplayName: 'Khách hàng',
  fields: customerFields,
  upsertKey: 'id', // Dùng mã khách hàng để đối chiếu khi UPDATE
  templateFileName: 'mau-import-khach-hang.xlsx',
  requireBranch: false, // Khách hàng không bắt buộc chi nhánh
  
  // Pre-transform raw row (normalize column names)
  preTransformRawRow: (rawRow: Record<string, unknown>) => {
    const normalized: Record<string, unknown> = {};
    
    // Map từ label tiếng Việt sang key
    const labelToKey: Record<string, string> = {};
    customerFields.forEach(field => {
      labelToKey[field.label.toLowerCase()] = field.key as string;
      // Also map without (*) marker
      const labelWithoutStar = field.label.replace(/\s*\(\*\)\s*$/, '').toLowerCase();
      labelToKey[labelWithoutStar] = field.key as string;
    });
    
    Object.entries(rawRow).forEach(([key, value]) => {
      // Normalize Excel header: strip (*) marker and lowercase
      const normalizedExcelHeader = key.replace(/\s*\(\*\)\s*$/, '').toLowerCase();
      const normalizedKey = labelToKey[normalizedExcelHeader] || labelToKey[key.toLowerCase()] || key;
      normalized[normalizedKey] = value;
    });
    
    return normalized;
  },
  
  // Post-transform row (set defaults, enrich data)
  postTransformRow: (row: Partial<Customer>) => {
    return {
      ...row,
      status: row.status || 'Đang giao dịch',
      pricingLevel: row.pricingLevel || 'Retail',
      currentDebt: row.currentDebt ?? 0,
      defaultDiscount: row.defaultDiscount ?? 0,
      tags: row.tags || [],
    };
  },
  
  // Validate row level (check duplicate taxCode)
  // Skip duplicate check in upsert/update mode since we're updating existing records
  validateRow: (row, _index, existingData, mode) => {
    const errors: Array<{ field?: string; message: string }> = [];
    
    // Check unique taxCode - only in insert-only mode
    // In upsert/update mode, duplicate is expected and allowed
    if (row.taxCode && mode === 'insert-only') {
      const duplicate = existingData.find(
        c => c.taxCode === row.taxCode && c.id !== row.id
      );
      if (duplicate) {
        errors.push({
          field: 'taxCode',
          message: `Mã số thuế đã được sử dụng bởi ${duplicate.name} (${duplicate.id})`,
        });
      }
    }
    
    return errors;
  },
};

// Re-export cho backward compatibility
export default customerImportExportConfig;
