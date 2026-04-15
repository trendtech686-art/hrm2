import type { Customer } from '@/lib/types/prisma-extended';
import type { ImportExportConfig, FieldConfig } from '@/lib/import-export/types';

/**
 * Customer Import/Export Configuration
 * Theo chuẩn ImportExportConfig để dùng với GenericImportDialogV2 và GenericExportDialogV2
 * 
 * THỨ TỰ CÁC TRƯỜNG CHÍNH (theo yêu cầu):
 * 1. Mã khách hàng
 * 2. Tên khách hàng (*)
 * 3. Mã nhóm khách hàng
 * 4. Điện thoại
 * 5. Email
 * 6. Giới tính
 * 7. Ngày sinh
 * 8. Mã số thuế
 * 9. Địa chỉ
 * 10. Tỉnh thành
 * 11. Quận huyện
 * 12. Phường xã
 * 13. Ngày tạo
 * 14. Trạng thái
 * 15. Nợ hiện tại
 * 16. Tổng chi tiêu
 * 17. SL đơn hàng
 * 18. Tổng SL sản phẩm đã mua
 */

// ===== FIELD DEFINITIONS =====
export const customerFields: FieldConfig<Customer>[] = [
  // ===== 1-8: THÔNG TIN CƠ BẢN =====
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
    example: 'Nguyễn Văn A',
  },
  {
    key: 'customerGroup',
    label: 'Mã nhóm khách hàng',
    required: false,
    type: 'string',
    exportGroup: 'Thông tin cơ bản',
    example: 'VIP',
  },
  {
    key: 'phone',
    label: 'Điện thoại',
    required: false,
    type: 'phone',
    exportGroup: 'Thông tin cơ bản',
    example: '0901234567',
    importTransform: (value: unknown) => {
      if (!value) return undefined;
      let phone = String(value).replace(/\s/g, '');
      // Excel lưu số điện thoại dạng number, mất số 0 đầu
      if (/^\d{9,10}$/.test(phone) && !phone.startsWith('0')) {
        phone = '0' + phone;
      }
      return phone;
    },
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
    example: 'nguyenvana@gmail.com',
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
    key: 'gender',
    label: 'Giới tính',
    required: false,
    type: 'enum',
    enumValues: ['Nam', 'Nữ', 'Khác'],
    enumLabels: {
      'Nam': 'Nam',
      'Nữ': 'Nữ',
      'Khác': 'Khác',
    },
    exportGroup: 'Thông tin cơ bản',
    example: 'Nam',
  },
  {
    key: 'dateOfBirth',
    label: 'Ngày sinh',
    required: false,
    type: 'date',
    exportGroup: 'Thông tin cơ bản',
    example: '15/01/1990',
    importTransform: (value: unknown) => {
      if (!value) return undefined;
      const str = String(value);
      // Handle Excel date format (dd/mm/yyyy or yyyy-mm-dd)
      if (str.includes('/')) {
        const parts = str.split('/');
        if (parts.length === 3) {
          const [day, month, year] = parts;
          return new Date(`${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`);
        }
      }
      return new Date(str);
    },
    exportTransform: (value: unknown) => {
      if (!value) return '';
      const date = new Date(value as string);
      return date.toLocaleDateString('vi-VN');
    },
  },
  {
    key: 'taxCode',
    label: 'Mã số thuế',
    required: false,
    type: 'string',
    exportGroup: 'Thông tin cơ bản',
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

  // ===== 9-12: ĐỊA CHỈ =====
  {
    key: 'address',
    label: 'Địa chỉ',
    required: false,
    type: 'string',
    exportGroup: 'Địa chỉ',
    example: '123 Nguyễn Huệ',
  },
  {
    key: 'province',
    label: 'Tỉnh thành',
    required: false,
    type: 'string',
    exportGroup: 'Địa chỉ',
    example: 'Hồ Chí Minh',
  },
  {
    key: 'district',
    label: 'Quận huyện',
    required: false,
    type: 'string',
    exportGroup: 'Địa chỉ',
    example: 'Quận 1',
  },
  {
    key: 'ward',
    label: 'Phường xã',
    required: false,
    type: 'string',
    exportGroup: 'Địa chỉ',
    example: 'Phường Bến Nghé',
  },

  // ===== 13: NGÀY TẠO =====
  {
    key: 'createdAt',
    label: 'Ngày tạo',
    required: false,
    type: 'date',
    exportGroup: 'Thông tin cơ bản',
    example: '27/01/2026',
    importTransform: (value: unknown) => {
      if (!value) return undefined;
      const str = String(value);
      if (str.includes('/')) {
        const parts = str.split('/');
        if (parts.length === 3) {
          const [day, month, year] = parts;
          return new Date(`${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`);
        }
      }
      return new Date(str);
    },
    exportTransform: (value: unknown) => {
      if (!value) return '';
      const date = new Date(value as string);
      return date.toLocaleDateString('vi-VN');
    },
  },

  // ===== 14: TRẠNG THÁI =====
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

  // ===== 15-18: THỐNG KÊ (chỉ export, không import — dữ liệu tổng hợp tự tính) =====
  {
    key: 'currentDebt',
    label: 'Nợ hiện tại',
    required: false,
    type: 'number',
    exportGroup: 'Thống kê',
    exportOnly: true,
    example: '0',
    exportTransform: (value: unknown) => {
      if (!value) return '0';
      return Number(value).toLocaleString('vi-VN');
    },
  },
  {
    key: 'totalSpent',
    label: 'Tổng chi tiêu',
    required: false,
    type: 'number',
    exportGroup: 'Thống kê',
    exportOnly: true,
    example: '15000000',
    exportTransform: (value: unknown) => {
      if (!value) return '0';
      return Number(value).toLocaleString('vi-VN');
    },
  },
  {
    key: 'totalOrders',
    label: 'SL đơn hàng',
    required: false,
    type: 'number',
    exportGroup: 'Thống kê',
    exportOnly: true,
    example: '10',
  },
  {
    key: 'totalProductsBought',
    label: 'Tổng SL sản phẩm đã mua',
    required: false,
    type: 'number',
    exportGroup: 'Thống kê',
    exportOnly: true,
    example: '50',
  },

  // ===== CÁC TRƯỜNG BỔ SUNG (ẩn trong file mẫu, hiển thị khi export) =====
  {
    key: 'type',
    label: 'Loại khách hàng',
    required: false,
    type: 'string',
    exportGroup: 'Phân loại',
    example: 'Cá nhân',
    hidden: true,
  },
  {
    key: 'lifecycleStage',
    label: 'Giai đoạn vòng đời',
    required: false,
    type: 'string',
    exportGroup: 'Phân loại',
    example: 'Khách mới',
    hidden: true,
  },
  {
    key: 'source',
    label: 'Nguồn khách hàng',
    required: false,
    type: 'string',
    exportGroup: 'Phân loại',
    example: 'Facebook',
    hidden: true,
  },
  {
    key: 'notes',
    label: 'Ghi chú',
    required: false,
    type: 'string',
    exportGroup: 'Thông tin cơ bản',
    example: 'Khách hàng tiềm năng',
    hidden: true,
  },
  {
    key: 'company',
    label: 'Tên công ty',
    required: false,
    type: 'string',
    exportGroup: 'Doanh nghiệp',
    example: 'Công ty TNHH ABC',
    hidden: true,
  },
  {
    key: 'representative',
    label: 'Người đại diện',
    required: false,
    type: 'string',
    exportGroup: 'Doanh nghiệp',
    example: 'Nguyễn Văn B',
    hidden: true,
  },
  {
    key: 'position',
    label: 'Chức vụ',
    required: false,
    type: 'string',
    exportGroup: 'Doanh nghiệp',
    example: 'Giám đốc',
    hidden: true,
  },
  {
    key: 'bankName',
    label: 'Ngân hàng',
    required: false,
    type: 'string',
    exportGroup: 'Ngân hàng',
    example: 'Vietcombank',
    hidden: true,
  },
  {
    key: 'bankAccount',
    label: 'Số tài khoản',
    required: false,
    type: 'string',
    exportGroup: 'Ngân hàng',
    example: '0123456789',
    hidden: true,
  },
  {
    key: 'paymentTerms',
    label: 'Hạn thanh toán',
    required: false,
    type: 'string',
    exportGroup: 'Thanh toán',
    example: 'NET15',
    hidden: true,
  },
  {
    key: 'creditRating',
    label: 'Xếp hạng tín dụng',
    required: false,
    type: 'string',
    exportGroup: 'Thanh toán',
    example: 'AAA',
    hidden: true,
  },
  {
    key: 'maxDebt',
    label: 'Hạn mức công nợ',
    required: false,
    type: 'number',
    exportGroup: 'Thanh toán',
    example: '50000000',
    hidden: true,
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
    exportGroup: 'Thanh toán',
    example: 'Có',
    hidden: true,
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
    exportGroup: 'Thanh toán',
    example: 'Retail',
    hidden: true,
  },
  {
    key: 'defaultDiscount',
    label: 'Chiết khấu mặc định (%)',
    required: false,
    type: 'number',
    exportGroup: 'Thanh toán',
    example: '5',
    hidden: true,
    validator: (value: unknown) => {
      if (!value) return null;
      const num = Number(value);
      if (num < 0 || num > 100) {
        return 'Chiết khấu phải từ 0 đến 100%';
      }
      return null;
    },
  },
  {
    key: 'accountManagerName',
    label: 'Nhân viên phụ trách',
    required: false,
    type: 'string',
    exportGroup: 'Quản lý',
    example: 'Nguyễn Văn C',
    hidden: true,
  },
  {
    key: 'campaign',
    label: 'Chiến dịch',
    required: false,
    type: 'string',
    exportGroup: 'Quản lý',
    example: 'Summer Sale 2024',
    hidden: true,
  },
  {
    key: 'tags',
    label: 'Thẻ (Tags)',
    required: false,
    type: 'string',
    exportGroup: 'Quản lý',
    example: 'VIP, Ưu tiên',
    hidden: true,
    importTransform: (value: unknown) => {
      if (!value) return undefined;
      return String(value).split(',').map(s => s.trim()).filter(Boolean);
    },
    exportTransform: (value: unknown) => {
      if (!value || !Array.isArray(value)) return '';
      return value.join(', ');
    },
  },
  {
    key: 'zaloPhone',
    label: 'Zalo',
    required: false,
    type: 'phone',
    exportGroup: 'Liên hệ',
    example: '0901234567',
    hidden: true,
  },
  
  // ===== PERSONAL INFO =====
  {
    key: 'gender',
    label: 'Giới tính',
    required: false,
    type: 'string',
    exportGroup: 'Thông tin cá nhân',
    example: 'Nam',
    hidden: true,
  },
  {
    key: 'dateOfBirth',
    label: 'Ngày sinh',
    required: false,
    type: 'date',
    exportGroup: 'Thông tin cá nhân',
    example: '1990-01-15',
    hidden: true,
    importTransform: (value: unknown) => {
      if (!value) return undefined;
      const date = new Date(String(value));
      return isNaN(date.getTime()) ? undefined : date.toISOString();
    },
  },
  
  // ===== SOURCE & CAMPAIGN =====
  {
    key: 'segment',
    label: 'Phân khúc RFM',
    required: false,
    type: 'string',
    exportGroup: 'Phân loại',
    example: 'Champions',
    hidden: true,
  },
  {
    key: 'referredBy',
    label: 'Giới thiệu bởi',
    required: false,
    type: 'string',
    exportGroup: 'Nguồn khách hàng',
    example: 'KH001',
    hidden: true,
  },
  
  // ===== FOLLOW-UP TRACKING =====
  {
    key: 'lastContactDate',
    label: 'Ngày liên hệ gần nhất',
    required: false,
    type: 'date',
    exportGroup: 'Theo dõi',
    hidden: true,
    importTransform: (value: unknown) => {
      if (!value) return undefined;
      const date = new Date(String(value));
      return isNaN(date.getTime()) ? undefined : date.toISOString();
    },
  },
  {
    key: 'nextFollowUpDate',
    label: 'Ngày follow-up tiếp theo',
    required: false,
    type: 'date',
    exportGroup: 'Theo dõi',
    hidden: true,
    importTransform: (value: unknown) => {
      if (!value) return undefined;
      const date = new Date(String(value));
      return isNaN(date.getTime()) ? undefined : date.toISOString();
    },
  },
  {
    key: 'followUpReason',
    label: 'Lý do follow-up',
    required: false,
    type: 'string',
    exportGroup: 'Theo dõi',
    example: 'Kiểm tra đơn hàng',
    hidden: true,
  },
  {
    key: 'churnRisk',
    label: 'Nguy cơ rời bỏ',
    required: false,
    type: 'string',
    exportGroup: 'Phân loại',
    example: 'low',
    hidden: true,
  },
  {
    key: 'healthScore',
    label: 'Điểm sức khỏe KH',
    required: false,
    type: 'number',
    exportGroup: 'Phân loại',
    example: '85',
    hidden: true,
    importTransform: (value: unknown) => {
      if (!value) return undefined;
      const num = parseInt(String(value), 10);
      return isNaN(num) ? undefined : Math.min(100, Math.max(0, num));
    },
  },
  // Note: failedDeliveries is a computed field, not stored in DB - keep for export display only
  {
    key: 'failedDeliveries' as keyof Customer,
    label: 'Số lần giao thất bại',
    required: false,
    type: 'number',
    exportGroup: 'Thống kê',
    example: '0',
    hidden: true,
    exportable: true,
  },

  // ===== HỆ THỐNG (ẩn hoàn toàn) =====
  {
    key: 'systemId',
    label: 'System ID',
    required: false,
    type: 'string',
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
      // Also map without (*) or standalone * marker
      const labelWithoutStar = field.label.replace(/\s*\(\*\)\s*$/, '').replace(/\s*\*\s*$/, '').toLowerCase();
      labelToKey[labelWithoutStar] = field.key as string;
    });
    
    // Extra aliases for common variations
    const extraAliases: Record<string, string> = {
      'sđt': 'phone',
      'số điện thoại': 'phone',
      'dt': 'phone',
      'điện thoại di động': 'phone',
      'mobile': 'phone',
      'phone number': 'phone',
      'tên': 'name',
      'tên khách hàng': 'name',
      'tên kh': 'name',
      'mã kh': 'id',
      'mã': 'id',
      'địa chỉ': 'address',
      'nợ': 'currentDebt',
      'nợ hiện tại': 'currentDebt',
      'chi tiêu': 'totalSpent',
      'tổng chi tiêu': 'totalSpent',
      'số đơn': 'totalOrders',
      'số đơn hàng': 'totalOrders',
      'sl sản phẩm': 'totalProductsBought',
      'nhóm': 'customerGroup',
      'nhóm kh': 'customerGroup',
    };
    Object.assign(labelToKey, extraAliases);
    
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
      totalSpent: row.totalSpent ?? 0,
      totalOrders: row.totalOrders ?? 0,
      totalProductsBought: row.totalProductsBought ?? 0,
      defaultDiscount: row.defaultDiscount ?? 0,
      tags: row.tags || [],
    };
  },
  
  // Validate row level (check duplicate taxCode)
  validateRow: (row, _index, existingData, mode) => {
    const errors: Array<{ field?: string; message: string }> = [];
    
    // Check unique taxCode - only in insert-only mode
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
