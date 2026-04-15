/**
 * ID Configuration Constants
 * Pure constants file - no Prisma dependency
 * Safe to import in client components
 * 
 * @version 1.0.0
 */

// ========================================
// ENTITY TYPES
// ========================================

export type EntityType =
  // HR & Organization
  | 'employees' | 'departments' | 'branches' | 'job-titles'
  | 'attendance' | 'duty-schedule' | 'payroll' | 'payslips'
  | 'payroll-audit-log' | 'payroll-templates' | 'penalties' | 'leaves' | 'kpi'
  // Customers & Partners
  | 'customers' | 'suppliers' | 'shipping-partners'
  | 'customer-types' | 'customer-groups' | 'customer-sources'
  | 'payment-terms' | 'credit-ratings' | 'lifecycle-stages' | 'sla-settings'
  // Products & Inventory
  | 'products' | 'brands' | 'categories' | 'units'
  | 'stock-locations' | 'inventory-receipts' | 'inventory-checks'
  | 'stock-transfers' | 'stock-history' | 'packaging' | 'cost-adjustments' | 'price-adjustments'
  // Sales & Fulfillment
  | 'orders' | 'sales-returns' | 'sales-channels' | 'shipments' | 'other-targets'
  // Purchasing
  | 'purchase-orders' | 'purchase-returns' | 'supplier-warranty'
  // Finance
  | 'receipts' | 'payments' | 'voucher-receipt' | 'voucher-payment'
  | 'cashbook' | 'reconciliation' | 'receipt-types' | 'payment-types'
  | 'cash-accounts' | 'payment-methods' | 'pricing-settings' | 'taxes'
  // Service & Workflow
  | 'warranty' | 'complaints' | 'internal-tasks' | 'recurring-tasks' | 'task-templates' | 'task-boards' | 'custom-fields' | 'wiki'
  // Settings
  | 'provinces' | 'districts' | 'wards' | 'target-groups'
  | 'employee-types' | 'employee-statuses' | 'contract-types'
  | 'work-shifts' | 'leave-types' | 'salary-components'
  // System
  | 'settings' | 'users' | 'audit-log'
  // PKGX Integration
  | 'pkgx-categories' | 'pkgx-brands' | 'pkgx-category-mappings'
  | 'pkgx-brand-mappings' | 'pkgx-price-mappings' | 'pkgx-sync-logs';

// ========================================
// ENTITY CONFIGURATION
// ========================================

export interface EntityConfig {
  /** Business ID prefix (Vietnamese, user-facing) */
  prefix: string;
  /** System ID prefix (English, internal) */
  systemIdPrefix: string;
  /** Number of digits (default: 6) */
  digitCount: number;
  /** Display name */
  displayName: string;
  /** Category for grouping */
  category: 'hr' | 'finance' | 'inventory' | 'sales' | 'purchasing' | 'service' | 'settings' | 'system';
  /** Allow custom business ID input */
  allowCustomId?: boolean;
}

/**
 * ID_CONFIG - Central registry for all entities
 * ✅ Pure constants - no Prisma dependency
 * ✅ Safe to import in client components & stores
 */
export const ID_CONFIG: Record<EntityType, EntityConfig> = {
  // ========================================
  // HR & ORGANIZATION
  // ========================================
  'employees': { prefix: 'NV', systemIdPrefix: 'EMP', digitCount: 6, displayName: 'Nhân viên', category: 'hr', allowCustomId: true },
  'departments': { prefix: 'PB', systemIdPrefix: 'DEPT', digitCount: 6, displayName: 'Phòng ban', category: 'hr', allowCustomId: true },
  'branches': { prefix: 'CN', systemIdPrefix: 'BRANCH', digitCount: 6, displayName: 'Chi nhánh', category: 'hr', allowCustomId: true },
  'job-titles': { prefix: 'CV', systemIdPrefix: 'JOB', digitCount: 6, displayName: 'Chức vụ', category: 'hr', allowCustomId: true },
  'attendance': { prefix: 'CC', systemIdPrefix: 'ATTEND', digitCount: 6, displayName: 'Chấm công', category: 'hr' },
  'duty-schedule': { prefix: 'PC', systemIdPrefix: 'DUTY', digitCount: 6, displayName: 'Phân công', category: 'hr' },
  'payroll': { prefix: 'BL', systemIdPrefix: 'PAYROLL', digitCount: 6, displayName: 'Bảng lương', category: 'hr' },
  'payslips': { prefix: 'PL', systemIdPrefix: 'PAYSLIP', digitCount: 6, displayName: 'Phiếu lương', category: 'hr' },
  'payroll-audit-log': { prefix: 'PAL', systemIdPrefix: 'PAYROLLLOG', digitCount: 6, displayName: 'Nhật ký payroll', category: 'hr' },
  'payroll-templates': { prefix: 'BTP', systemIdPrefix: 'PAYTPL', digitCount: 6, displayName: 'Mẫu bảng lương', category: 'hr' },
  'penalties': { prefix: 'PF', systemIdPrefix: 'PENALTY', digitCount: 6, displayName: 'Phiếu phạt', category: 'hr' },
  'leaves': { prefix: 'PN', systemIdPrefix: 'LEAVE', digitCount: 6, displayName: 'Nghỉ phép', category: 'hr' },
  'kpi': { prefix: 'KPI', systemIdPrefix: 'KPI', digitCount: 6, displayName: 'KPI', category: 'hr' },

  // ========================================
  // CUSTOMERS & PARTNERS
  // ========================================
  'customers': { prefix: 'KH', systemIdPrefix: 'CUSTOMER', digitCount: 6, displayName: 'Khách hàng', category: 'sales', allowCustomId: true },
  'suppliers': { prefix: 'NCC', systemIdPrefix: 'SUPPLIER', digitCount: 6, displayName: 'Nhà cung cấp', category: 'purchasing', allowCustomId: true },
  'shipping-partners': { prefix: 'DVVC', systemIdPrefix: 'SHIPPING', digitCount: 6, displayName: 'Đơn vị vận chuyển', category: 'settings', allowCustomId: true },
  'customer-types': { prefix: 'LKH', systemIdPrefix: 'CUSTTYPE', digitCount: 6, displayName: 'Loại khách hàng', category: 'settings' },
  'customer-groups': { prefix: 'NHKH', systemIdPrefix: 'CUSTGROUP', digitCount: 6, displayName: 'Nhóm khách hàng', category: 'settings' },
  'customer-sources': { prefix: 'NKH', systemIdPrefix: 'CUSTSOURCE', digitCount: 6, displayName: 'Nguồn khách hàng', category: 'settings' },
  'payment-terms': { prefix: 'HTTT', systemIdPrefix: 'PAYTERM', digitCount: 6, displayName: 'Điều khoản thanh toán', category: 'settings' },
  'credit-ratings': { prefix: 'XHTD', systemIdPrefix: 'CREDIT', digitCount: 6, displayName: 'Xếp hạng tín dụng', category: 'settings' },
  'lifecycle-stages': { prefix: 'GDL', systemIdPrefix: 'LIFECYCLE', digitCount: 6, displayName: 'Giai đoạn vòng đời', category: 'sales' },
  'sla-settings': { prefix: 'SLA', systemIdPrefix: 'SLACFG', digitCount: 6, displayName: 'Cài đặt SLA', category: 'sales' },

  // ========================================
  // PRODUCTS & INVENTORY
  // ========================================
  'products': { prefix: 'SP', systemIdPrefix: 'PRODUCT', digitCount: 6, displayName: 'Sản phẩm', category: 'inventory', allowCustomId: true },
  'brands': { prefix: 'TH', systemIdPrefix: 'BRAND', digitCount: 6, displayName: 'Thương hiệu', category: 'inventory', allowCustomId: true },
  'categories': { prefix: 'DM', systemIdPrefix: 'CATEGORY', digitCount: 6, displayName: 'Danh mục', category: 'inventory', allowCustomId: true },
  'units': { prefix: 'DVT', systemIdPrefix: 'UNIT', digitCount: 6, displayName: 'Đơn vị tính', category: 'inventory', allowCustomId: true },
  'stock-locations': { prefix: 'KHO', systemIdPrefix: 'STOCK', digitCount: 6, displayName: 'Vị trí kho', category: 'inventory', allowCustomId: true },
  'inventory-receipts': { prefix: 'NK', systemIdPrefix: 'INVRECEIPT', digitCount: 6, displayName: 'Nhập kho', category: 'inventory' },
  'inventory-checks': { prefix: 'PKK', systemIdPrefix: 'INVCHECK', digitCount: 6, displayName: 'Phiếu kiểm kho', category: 'inventory', allowCustomId: true },
  'stock-transfers': { prefix: 'PCK', systemIdPrefix: 'TRANSFER', digitCount: 6, displayName: 'Phiếu chuyển kho', category: 'inventory' },
  'stock-history': { prefix: 'LS', systemIdPrefix: 'HISTORY', digitCount: 6, displayName: 'Lịch sử kho', category: 'inventory' },
  'packaging': { prefix: 'DG', systemIdPrefix: 'PACKAGE', digitCount: 6, displayName: 'Đóng gói', category: 'inventory' },
  'cost-adjustments': { prefix: 'DCGV', systemIdPrefix: 'COSTADJ', digitCount: 6, displayName: 'Điều chỉnh giá vốn', category: 'inventory' },
  'price-adjustments': { prefix: 'DCGB', systemIdPrefix: 'PRICEADJ', digitCount: 6, displayName: 'Điều chỉnh giá bán', category: 'inventory' },

  // ========================================
  // SALES & FULFILLMENT
  // ========================================
  'orders': { prefix: 'DH', systemIdPrefix: 'ORDER', digitCount: 6, displayName: 'Đơn hàng', category: 'sales', allowCustomId: true },
  'sales-returns': { prefix: 'TH', systemIdPrefix: 'RETURN', digitCount: 6, displayName: 'Trả hàng', category: 'sales' },
  'sales-channels': { prefix: 'KENH', systemIdPrefix: 'CHANNEL', digitCount: 6, displayName: 'Kênh bán hàng', category: 'sales' },
  'shipments': { prefix: 'VC', systemIdPrefix: 'SHIPMENT', digitCount: 6, displayName: 'Vận chuyển', category: 'sales' },
  'other-targets': { prefix: 'MT', systemIdPrefix: 'OTHERTARGET', digitCount: 6, displayName: 'Mục tiêu khác', category: 'sales' },

  // ========================================
  // PURCHASING
  // ========================================
  'purchase-orders': { prefix: 'PO', systemIdPrefix: 'PURCHASE', digitCount: 6, displayName: 'Đơn mua hàng', category: 'purchasing' },
  'purchase-returns': { prefix: 'TM', systemIdPrefix: 'PRETURN', digitCount: 6, displayName: 'Trả hàng NCC', category: 'purchasing' },
  'supplier-warranty': { prefix: 'BHCC', systemIdPrefix: 'SWARRANTY', digitCount: 6, displayName: 'BH Nhà cung cấp', category: 'purchasing' },

  // ========================================
  // FINANCE
  // ========================================
  'receipts': { prefix: 'PT', systemIdPrefix: 'RECEIPT', digitCount: 6, displayName: 'Phiếu thu', category: 'finance' },
  'payments': { prefix: 'PC', systemIdPrefix: 'PAYMENT', digitCount: 6, displayName: 'Phiếu chi', category: 'finance' },
  'voucher-receipt': { prefix: 'PT', systemIdPrefix: 'RECEIPT', digitCount: 6, displayName: 'Phiếu thu (Voucher)', category: 'finance' },
  'voucher-payment': { prefix: 'PC', systemIdPrefix: 'PAYMENT', digitCount: 6, displayName: 'Phiếu chi (Voucher)', category: 'finance' },
  'cashbook': { prefix: 'SCT', systemIdPrefix: 'CASHBOOK', digitCount: 6, displayName: 'Sổ quỹ', category: 'finance' },
  'reconciliation': { prefix: 'DT', systemIdPrefix: 'RECON', digitCount: 6, displayName: 'Đối chiếu', category: 'finance' },
  'receipt-types': { prefix: 'LT', systemIdPrefix: 'RECTYPE', digitCount: 6, displayName: 'Loại thu', category: 'finance', allowCustomId: true },
  'payment-types': { prefix: 'LC', systemIdPrefix: 'PAYTYPE', digitCount: 6, displayName: 'Loại chi', category: 'finance', allowCustomId: true },
  'cash-accounts': { prefix: 'TK', systemIdPrefix: 'ACCOUNT', digitCount: 6, displayName: 'Tài khoản', category: 'finance', allowCustomId: true },
  'payment-methods': { prefix: 'PTTT', systemIdPrefix: 'METHOD', digitCount: 6, displayName: 'Phương thức TT', category: 'finance', allowCustomId: true },
  'pricing-settings': { prefix: 'GIA', systemIdPrefix: 'PRICING', digitCount: 6, displayName: 'Cài đặt giá', category: 'settings' },
  'taxes': { prefix: 'TAX', systemIdPrefix: 'TAX', digitCount: 6, displayName: 'Thuế', category: 'settings' },

  // ========================================
  // SERVICE & WORKFLOW
  // ========================================
  'warranty': { prefix: 'BH', systemIdPrefix: 'WARRANTY', digitCount: 6, displayName: 'Bảo hành', category: 'service' },
  'complaints': { prefix: 'PKN', systemIdPrefix: 'COMPLAINT', digitCount: 6, displayName: 'Khiếu nại', category: 'service' },
  'internal-tasks': { prefix: 'CVNB', systemIdPrefix: 'TASK', digitCount: 6, displayName: 'Công việc nội bộ', category: 'system', allowCustomId: true },
  'recurring-tasks': { prefix: 'RT', systemIdPrefix: 'RT', digitCount: 6, displayName: 'Công việc lặp lại', category: 'system' },
  'task-templates': { prefix: 'TMPL', systemIdPrefix: 'TMPL', digitCount: 6, displayName: 'Mẫu công việc', category: 'system' },
  'task-boards': { prefix: 'BOARD', systemIdPrefix: 'BOARD', digitCount: 6, displayName: 'Bảng công việc', category: 'system' },
  'custom-fields': { prefix: 'FIELD', systemIdPrefix: 'FIELD', digitCount: 6, displayName: 'Trường tùy chỉnh', category: 'settings' },
  'wiki': { prefix: 'TL', systemIdPrefix: 'WIKI', digitCount: 6, displayName: 'Tài liệu', category: 'system' },

  // ========================================
  // SETTINGS
  // ========================================
  'provinces': { prefix: 'TP', systemIdPrefix: 'PROVINCE', digitCount: 6, displayName: 'Tỉnh/Thành phố', category: 'settings', allowCustomId: true },
  'districts': { prefix: 'QH', systemIdPrefix: 'DISTRICT', digitCount: 6, displayName: 'Quận/Huyện', category: 'settings', allowCustomId: true },
  'wards': { prefix: 'PX', systemIdPrefix: 'WARD', digitCount: 6, displayName: 'Phường/Xã', category: 'settings', allowCustomId: true },
  'target-groups': { prefix: 'NHOM', systemIdPrefix: 'TARGET', digitCount: 6, displayName: 'Nhóm mục tiêu', category: 'settings', allowCustomId: true },
  'employee-types': { prefix: 'LNV', systemIdPrefix: 'EMPTYPE', digitCount: 6, displayName: 'Loại nhân viên', category: 'settings' },
  'employee-statuses': { prefix: 'TTNV', systemIdPrefix: 'EMPSTATUS', digitCount: 6, displayName: 'Trạng thái NV', category: 'settings' },
  'contract-types': { prefix: 'LHD', systemIdPrefix: 'CONTRACT', digitCount: 6, displayName: 'Loại hợp đồng', category: 'settings' },
  'work-shifts': { prefix: 'CA', systemIdPrefix: 'WSHIFT', digitCount: 6, displayName: 'Ca làm việc', category: 'settings' },
  'leave-types': { prefix: 'LP', systemIdPrefix: 'LEAVETYPE', digitCount: 6, displayName: 'Loại nghỉ phép', category: 'settings' },
  'salary-components': { prefix: 'SC', systemIdPrefix: 'SALCOMP', digitCount: 6, displayName: 'Thành phần lương', category: 'settings' },

  // ========================================
  // SYSTEM
  // ========================================
  'settings': { prefix: 'CFG', systemIdPrefix: 'CONFIG', digitCount: 6, displayName: 'Cấu hình', category: 'system' },
  'users': { prefix: 'USER', systemIdPrefix: 'USER', digitCount: 6, displayName: 'Người dùng', category: 'system' },
  'audit-log': { prefix: 'LOG', systemIdPrefix: 'LOG', digitCount: 10, displayName: 'Nhật ký', category: 'system' },

  // ========================================
  // PKGX INTEGRATION
  // ========================================
  'pkgx-categories': { prefix: 'PKGXCAT', systemIdPrefix: 'PKGXCAT', digitCount: 6, displayName: 'Danh mục PKGX', category: 'settings' },
  'pkgx-brands': { prefix: 'PKGXBRAND', systemIdPrefix: 'PKGXBRAND', digitCount: 6, displayName: 'Thương hiệu PKGX', category: 'settings' },
  'pkgx-category-mappings': { prefix: 'CATMAP', systemIdPrefix: 'CATMAP', digitCount: 6, displayName: 'Mapping danh mục', category: 'settings' },
  'pkgx-brand-mappings': { prefix: 'BRANDMAP', systemIdPrefix: 'BRANDMAP', digitCount: 6, displayName: 'Mapping thương hiệu', category: 'settings' },
  'pkgx-price-mappings': { prefix: 'PRICEMAP', systemIdPrefix: 'PRICEMAP', digitCount: 6, displayName: 'Mapping giá', category: 'settings' },
  'pkgx-sync-logs': { prefix: 'PKGXLOG', systemIdPrefix: 'PKGXLOG', digitCount: 6, displayName: 'Log đồng bộ PKGX', category: 'system' },
};

/**
 * Get entity configuration
 */
export function getConfig(entityType: EntityType): EntityConfig {
  const config = ID_CONFIG[entityType];
  if (!config) {
    throw new Error(`Unknown entity type: ${entityType}`);
  }
  return config;
}

/**
 * Get business ID prefix for an entity
 */
export function getPrefix(entityType: EntityType): string {
  return getConfig(entityType).prefix;
}

/**
 * Get system ID prefix for an entity
 */
export function getSystemPrefix(entityType: EntityType): string {
  return getConfig(entityType).systemIdPrefix;
}

/**
 * Get entity categories for grouping
 */
export function getEntityCategories() {
  const categories: Record<string, EntityType[]> = {};
  
  for (const [entityType, config] of Object.entries(ID_CONFIG)) {
    const category = config.category;
    if (!categories[category]) {
      categories[category] = [];
    }
    categories[category].push(entityType as EntityType);
  }
  
  return categories;
}

/**
 * Validate ID format (client-safe)
 */
export function validateIdFormat(id: string, entityType?: EntityType): { valid: boolean; error?: string } {
  if (!id || typeof id !== 'string') {
    return { valid: false, error: 'ID không được để trống' };
  }

  // Basic format check: alphanumeric only
  if (!/^[A-Z0-9]+$/.test(id.toUpperCase())) {
    return { valid: false, error: 'ID chỉ được chứa chữ cái và số' };
  }

  // If entity type provided, check prefix
  if (entityType) {
    const config = ID_CONFIG[entityType];
    if (config && !id.toUpperCase().startsWith(config.prefix.toUpperCase())) {
      return { valid: false, error: `ID phải bắt đầu bằng ${config.prefix}` };
    }
  }

  return { valid: true };
}
