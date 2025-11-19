/**
 * ⚡ ENTERPRISE ID MANAGEMENT SYSTEM v2.0
 * 
 * SINGLE SOURCE OF TRUTH - Synced with smart-prefix.ts
 * 
 * Features:
 * - 60+ entity configurations
 * - TypeScript branded types (SystemId, BusinessId)
 * - Category grouping for UI
 * - Validation rules
 * - Store factory integration
 * - Backward compatibility
 * 
 * @version 2.0.0
 * @date 2025-11-10
 */

import { ENTITY_PREFIXES, type EntityType } from './smart-prefix';

// Re-export EntityType for external use
export type { EntityType };

// ========================================
// 🏷️ BRANDED TYPES FOR TYPE SAFETY
// ========================================

/**
 * SystemId - Internal unique identifier (6 digits)
 * Used for: Database queries, foreign keys, routing
 * Example: "EMP000001", "CUSTOMER000001", "ORDER000001"
 */
export type SystemId = string & { readonly __brand: 'SystemId' };

/**
 * BusinessId - User-facing display identifier (6 digits)
 * Used for: UI display, breadcrumbs, user communication
 * Example: "NV000001", "KH000001", "DH000001"
 */
export type BusinessId = string & { readonly __brand: 'BusinessId' };

/**
 * Create a branded SystemId (use with caution - prefer auto-generation)
 */
export function createSystemId(id: string): SystemId {
  return id as SystemId;
}

/**
 * Create a branded BusinessId (use with caution - prefer auto-generation)
 */
export function createBusinessId(id: string): BusinessId {
  return id as BusinessId;
}

export interface FormattedCounterInfo {
  currentBusinessCounter: number;
  currentSystemCounter: number;
  nextBusinessId: BusinessId;
  nextSystemId: SystemId;
  digitCount: number;
  prefix: string;
  systemIdPrefix: string;
  displayName: string;
}

export function formatCounterInfo(
  entityType: EntityType,
  counters?: { business?: number | null; system?: number | null }
): FormattedCounterInfo {
  const config = ID_CONFIG[entityType];
  if (!config) {
    throw new Error(`Unknown entity type: ${entityType}`);
  }

  const currentBusinessCounter = Math.max(0, counters?.business ?? 0);
  const currentSystemCounter = Math.max(0, counters?.system ?? currentBusinessCounter);
  const nextBusinessCounter = currentBusinessCounter + 1;
  const nextSystemCounter = currentSystemCounter + 1;
  const paddedBusiness = String(nextBusinessCounter).padStart(config.digitCount, '0');
  const paddedSystem = String(nextSystemCounter).padStart(config.digitCount, '0');

  return {
    currentBusinessCounter,
    currentSystemCounter,
    nextBusinessId: createBusinessId(`${config.prefix}${paddedBusiness}`),
    nextSystemId: createSystemId(`${config.systemIdPrefix}${paddedSystem}`),
    digitCount: config.digitCount,
    prefix: config.prefix,
    systemIdPrefix: config.systemIdPrefix,
    displayName: config.displayName,
  };
}

// ========================================
// 📋 CONFIGURATION INTERFACE
// ========================================

export interface EntityIDConfig {
  /** Entity type identifier */
  entityType: EntityType;
  
  /** Prefix for business ID (user-facing) - from smart-prefix.ts */
  prefix: string;
  
  /** Prefix for system ID (internal) - usually same or 'entity-name' */
  systemIdPrefix: string;
  
  /** Number of digits for business ID (e.g., 6 → NV000001) */
  digitCount: number;
  
  /** Display name (Vietnamese) */
  displayName: string;
  
  /** Category for settings UI grouping */
  category: 'hr' | 'finance' | 'inventory' | 'sales' | 'purchasing' | 'service' | 'settings' | 'system';
  
  /** Description or notes */
  description?: string;
  
  /** Custom validation rules */
  validation?: {
    /** Allow users to input custom ID */
    allowCustomId?: boolean;
    /** Regex pattern for validation */
    pattern?: RegExp;
    /** Minimum counter value */
    minValue?: number;
    /** Maximum counter value */
    maxValue?: number;
  };
  
  /** Whether entity uses store-factory auto-generation */
  usesStoreFactory?: boolean;
  
  /** Special handling notes for developers */
  notes?: string;
}

// ========================================
// 🗂️ COMPLETE CONFIGURATION REGISTRY
// ========================================

/**
 * ID_CONFIG - Central registry for all 60+ entities
 * 
 * ✅ Synced with smart-prefix.ts
 * ✅ Includes all missing entities
 * ✅ Category organization
 */
export const ID_CONFIG: Record<EntityType, EntityIDConfig> = {
  // ========================================
  // 👥 HR & ORGANIZATION (NHÂN SỰ)
  // ========================================
  
  'employees': {
    entityType: 'employees',
    prefix: ENTITY_PREFIXES['employees'], // 'NV'
    systemIdPrefix: 'EMP',
    digitCount: 6,
    displayName: 'Nhân viên',
    category: 'hr',
    validation: { allowCustomId: true },
    usesStoreFactory: true,
  },
  
  'departments': {
    entityType: 'departments',
    prefix: ENTITY_PREFIXES['departments'], // 'PB'
    systemIdPrefix: 'DEPT',
    digitCount: 6,
    displayName: 'Phòng ban',
    category: 'hr',
    validation: { allowCustomId: true },
    usesStoreFactory: true,
  },
  
  'branches': {
    entityType: 'branches',
    prefix: ENTITY_PREFIXES['branches'], // 'CN'
    systemIdPrefix: 'BRANCH',
    digitCount: 6,
    displayName: 'Chi nhánh',
    category: 'hr',
    validation: { allowCustomId: true },
    usesStoreFactory: true,
  },
  
  'job-titles': {
    entityType: 'job-titles',
    prefix: ENTITY_PREFIXES['job-titles'], // 'CV'
    systemIdPrefix: 'JOB',
    digitCount: 6,
    displayName: 'Chức vụ',
    category: 'hr',
    validation: { allowCustomId: true },
    usesStoreFactory: true,
  },
  
  'attendance': {
    entityType: 'attendance',
    prefix: ENTITY_PREFIXES['attendance'], // 'CC'
    systemIdPrefix: 'ATTEND',
    digitCount: 6,
    displayName: 'Chấm công',
    category: 'hr',
    usesStoreFactory: false,
  },
  
  'duty-schedule': {
    entityType: 'duty-schedule',
    prefix: ENTITY_PREFIXES['duty-schedule'], // 'PC'
    systemIdPrefix: 'DUTY',
    digitCount: 6,
    displayName: 'Phân công',
    category: 'hr',
    notes: 'Prefix conflict with "payments" (PC)',
  },
  
  'payroll': {
    entityType: 'payroll',
    prefix: ENTITY_PREFIXES['payroll'], // 'BL'
    systemIdPrefix: 'PAYROLL',
    digitCount: 6,
    displayName: 'Bảng lương',
    category: 'hr',
    usesStoreFactory: false,
  },
  
  'payslips': {
    entityType: 'payslips',
    prefix: ENTITY_PREFIXES['payslips'], // 'PL'
    systemIdPrefix: 'PAYSLIP',
    digitCount: 6,
    displayName: 'Phiếu lương',
    category: 'hr',
    usesStoreFactory: false,
    notes: 'Sinh từ payroll batch store',
  },
  
  'payroll-audit-log': {
    entityType: 'payroll-audit-log',
    prefix: ENTITY_PREFIXES['payroll-audit-log'], // 'PAL'
    systemIdPrefix: 'PAYROLLLOG',
    digitCount: 6,
    displayName: 'Nhật ký payroll',
    category: 'hr',
    usesStoreFactory: false,
  },
  'payroll-templates': {
    entityType: 'payroll-templates',
    prefix: ENTITY_PREFIXES['payroll-templates'], // 'BTP'
    systemIdPrefix: 'PAYTPL',
    digitCount: 6,
    displayName: 'Mẫu bảng lương',
    category: 'hr',
    usesStoreFactory: false,
    notes: 'Dùng cho trang template payroll Phase 3',
  },
  
  'penalties': {
    entityType: 'penalties',
    prefix: ENTITY_PREFIXES['penalties'], // 'PF'
    systemIdPrefix: 'PENALTY',
    digitCount: 6,
    displayName: 'Phiếu phạt',
    category: 'hr',
    usesStoreFactory: true,
  },
  
  'leaves': {
    entityType: 'leaves',
    prefix: ENTITY_PREFIXES['leaves'], // 'PN'
    systemIdPrefix: 'LEAVE',
    digitCount: 6,
    displayName: 'Nghỉ phép',
    category: 'hr',
    usesStoreFactory: true,
  },
  
  // ========================================
  // 👤 CUSTOMERS & PARTNERS (KHÁCH HÀNG)
  // ========================================
  
  'customers': {
    entityType: 'customers',
    prefix: ENTITY_PREFIXES['customers'], // 'KH'
    systemIdPrefix: 'CUSTOMER',
    digitCount: 6,
    displayName: 'Khách hàng',
    category: 'sales',
    validation: { allowCustomId: true },
    usesStoreFactory: true,
  },
  
  'suppliers': {
    entityType: 'suppliers',
    prefix: ENTITY_PREFIXES['suppliers'], // 'NCC'
    systemIdPrefix: 'SUPPLIER',
    digitCount: 6,
    displayName: 'Nhà cung cấp',
    category: 'purchasing',
    validation: { allowCustomId: true },
    usesStoreFactory: true,
  },
  
  'shipping-partners': {
    entityType: 'shipping-partners',
    prefix: ENTITY_PREFIXES['shipping-partners'], // 'DVVC'
    systemIdPrefix: 'SHIPPING',
    digitCount: 6,
    displayName: 'Đơn vị vận chuyển',
    category: 'settings',
    validation: { allowCustomId: true },
    usesStoreFactory: true,
  },
  
  // ========================================
  // 📦 PRODUCTS & INVENTORY (SẢN PHẨM & KHO)
  // ========================================
  
  'products': {
    entityType: 'products',
    prefix: ENTITY_PREFIXES['products'], // 'SP'
    systemIdPrefix: 'PRODUCT',
    digitCount: 6,
    displayName: 'Sản phẩm',
    category: 'inventory',
    validation: { allowCustomId: true },
    usesStoreFactory: true,
  },
  
  'units': {
    entityType: 'units',
    prefix: ENTITY_PREFIXES['units'], // 'DVT'
    systemIdPrefix: 'UNIT',
    digitCount: 6,
    displayName: 'Đơn vị tính',
    category: 'inventory',
    validation: { allowCustomId: true },
    usesStoreFactory: true,
  },
  
  'stock-locations': {
    entityType: 'stock-locations',
    prefix: ENTITY_PREFIXES['stock-locations'], // 'KHO'
    systemIdPrefix: 'STOCK',
    digitCount: 6,
    displayName: 'Vị trí kho',
    category: 'inventory',
    validation: { allowCustomId: true },
    usesStoreFactory: true,
  },
  
  'inventory-receipts': {
    entityType: 'inventory-receipts',
    prefix: ENTITY_PREFIXES['inventory-receipts'], // 'NK'
    systemIdPrefix: 'INVRECEIPT',
    digitCount: 6,
    displayName: 'Nhập kho',
    category: 'inventory',
    usesStoreFactory: true,
  },
  
  'inventory-checks': {
    entityType: 'inventory-checks',
    prefix: ENTITY_PREFIXES['inventory-checks'], // 'PKK'
    systemIdPrefix: 'INVCHECK',
    digitCount: 6,
    displayName: 'Phiếu kiểm kho',
    category: 'inventory',
    validation: { allowCustomId: true },
    usesStoreFactory: true,
  },
  
  'stock-history': {
    entityType: 'stock-history',
    prefix: ENTITY_PREFIXES['stock-history'], // 'LS'
    systemIdPrefix: 'HISTORY',
    digitCount: 6,
    displayName: 'Lịch sử kho',
    category: 'inventory',
    usesStoreFactory: false,
  },
  
  // ========================================
  // 🛒 SALES (BÁN HÀNG)
  // ========================================
  
  'orders': {
    entityType: 'orders',
    prefix: ENTITY_PREFIXES['orders'], // 'DH'
    systemIdPrefix: 'ORDER',
    digitCount: 6,
    displayName: 'Đơn hàng',
    category: 'sales',
    validation: { allowCustomId: true },
    usesStoreFactory: true,
  },
  
  'sales-returns': {
    entityType: 'sales-returns',
    prefix: ENTITY_PREFIXES['sales-returns'], // 'TH'
    systemIdPrefix: 'RETURN',
    digitCount: 6,
    displayName: 'Trả hàng',
    category: 'sales',
    usesStoreFactory: true,
  },
  
  'sales-channels': {
    entityType: 'sales-channels',
    prefix: ENTITY_PREFIXES['sales-channels'], // 'KENH'
    systemIdPrefix: 'CHANNEL',
    digitCount: 6,
    displayName: 'Kênh bán hàng',
    category: 'sales',
    usesStoreFactory: true,
  },
  
  'shipments': {
    entityType: 'shipments',
    prefix: ENTITY_PREFIXES['shipments'], // 'VC'
    systemIdPrefix: 'SHIPMENT',
    digitCount: 6,
    displayName: 'Vận chuyển',
    category: 'sales',
    usesStoreFactory: false,
  },
  
  // ========================================
  // 🏭 PURCHASING (MUA HÀNG)
  // ========================================
  
  'purchase-orders': {
    entityType: 'purchase-orders',
    prefix: ENTITY_PREFIXES['purchase-orders'], // 'PO'
    systemIdPrefix: 'PURCHASE',
    digitCount: 6,
    displayName: 'Đơn mua hàng',
    category: 'purchasing',
    usesStoreFactory: true,
  },
  
  'purchase-returns': {
    entityType: 'purchase-returns',
    prefix: ENTITY_PREFIXES['purchase-returns'], // 'TM'
    systemIdPrefix: 'PRETURN',
    digitCount: 6,
    displayName: 'Trả hàng NCC',
    category: 'purchasing',
    usesStoreFactory: true,
  },
  
  // ========================================
  // 💰 FINANCE (TÀI CHÍNH)
  // ========================================
  
  'receipts': {
    entityType: 'receipts',
    prefix: ENTITY_PREFIXES['receipts'], // 'PT'
    systemIdPrefix: 'RECEIPT',
    digitCount: 6,
    displayName: 'Phiếu thu',
    category: 'finance',
    usesStoreFactory: true,
  },
  
  'payments': {
    entityType: 'payments',
    prefix: ENTITY_PREFIXES['payments'], // 'PC'
    systemIdPrefix: 'PAYMENT',
    digitCount: 6,
    displayName: 'Phiếu chi',
    category: 'finance',
    usesStoreFactory: true,
  },

  'voucher-receipt': {
    entityType: 'voucher-receipt',
    prefix: ENTITY_PREFIXES['voucher-receipt'], // Alias 'PT'
    systemIdPrefix: 'RECEIPT',
    digitCount: 6,
    displayName: 'Phiếu thu (Voucher)',
    category: 'finance',
    usesStoreFactory: true,
    notes: 'Alias dùng cho các workflow voucher-only hoặc màn hình tổng hợp phiếu thu/chi.',
  },
  
  'voucher-payment': {
    entityType: 'voucher-payment',
    prefix: ENTITY_PREFIXES['voucher-payment'], // Alias 'PC'
    systemIdPrefix: 'PAYMENT',
    digitCount: 6,
    displayName: 'Phiếu chi (Voucher)',
    category: 'finance',
    usesStoreFactory: true,
    notes: 'Alias dùng cho các workflow voucher-only hoặc màn hình tổng hợp phiếu thu/chi.',
  },
  
  'cashbook': {
    entityType: 'cashbook',
    prefix: ENTITY_PREFIXES['cashbook'], // 'SCT'
    systemIdPrefix: 'CASHBOOK',
    digitCount: 6,
    displayName: 'Sổ quỹ tiền mặt',
    category: 'finance',
    usesStoreFactory: false,
  },
  
  'reconciliation': {
    entityType: 'reconciliation',
    prefix: ENTITY_PREFIXES['reconciliation'], // 'DT'
    systemIdPrefix: 'RECON',
    digitCount: 6,
    displayName: 'Đối chiếu',
    category: 'finance',
    usesStoreFactory: false,
  },
  
  // Finance Settings
  'receipt-types': {
    entityType: 'receipt-types',
    prefix: ENTITY_PREFIXES['receipt-types'], // 'LT'
    systemIdPrefix: 'RECTYPE',
    digitCount: 6,
    displayName: 'Loại thu',
    category: 'finance',
    validation: { allowCustomId: true },
    usesStoreFactory: true,
  },
  
  'payment-types': {
    entityType: 'payment-types',
    prefix: ENTITY_PREFIXES['payment-types'], // 'LC'
    systemIdPrefix: 'PAYTYPE',
    digitCount: 6,
    displayName: 'Loại chi',
    category: 'finance',
    validation: { allowCustomId: true },
    usesStoreFactory: true,
  },
  
  'cash-accounts': {
    entityType: 'cash-accounts',
    prefix: ENTITY_PREFIXES['cash-accounts'], // 'TK'
    systemIdPrefix: 'ACCOUNT',
    digitCount: 6,
    displayName: 'Tài khoản',
    category: 'finance',
    validation: { allowCustomId: true },
    usesStoreFactory: true,
  },
  
  'payment-methods': {
    entityType: 'payment-methods',
    prefix: ENTITY_PREFIXES['payment-methods'], // 'PTTT'
    systemIdPrefix: 'METHOD',
    digitCount: 6,
    displayName: 'Phương thức thanh toán',
    category: 'finance',
    validation: { allowCustomId: true },
    usesStoreFactory: true,
  },
  
  'pricing-settings': {
    entityType: 'pricing-settings',
    prefix: ENTITY_PREFIXES['pricing-settings'], // 'GIA'
    systemIdPrefix: 'PRICING',
    digitCount: 6,
    displayName: 'Cài đặt giá',
    category: 'settings',
    usesStoreFactory: false,
  },
  
  // ========================================
  // 🎯 KPI & TARGETS (MỤC TIÊU)
  // ========================================
  
  'kpi': {
    entityType: 'kpi',
    prefix: ENTITY_PREFIXES['kpi'], // 'KPI'
    systemIdPrefix: 'KPI',
    digitCount: 6,
    displayName: 'KPI',
    category: 'hr',
    usesStoreFactory: false,
  },
  
  'target-groups': {
    entityType: 'target-groups',
    prefix: ENTITY_PREFIXES['target-groups'], // 'NHOM'
    systemIdPrefix: 'TARGET',
    digitCount: 6,
    displayName: 'Nhóm mục tiêu',
    category: 'settings',
    validation: { allowCustomId: true },
    usesStoreFactory: true,
  },
  
  'other-targets': {
    entityType: 'other-targets',
    prefix: ENTITY_PREFIXES['other-targets'], // 'MT'
    systemIdPrefix: 'OTHERTARGET',
    digitCount: 6,
    displayName: 'Mục tiêu khác',
    category: 'sales',
    usesStoreFactory: false,
  },
  
  // ========================================
  // CUSTOMER SERVICE (DỊCH VỤ)
  // ========================================
  
  'internal-tasks': {
    entityType: 'internal-tasks',
    prefix: ENTITY_PREFIXES['internal-tasks'], // 'CVNB'
    systemIdPrefix: 'TASK',
    digitCount: 6,
    displayName: 'Công việc nội bộ',
    category: 'system',
    usesStoreFactory: true,
    validation: { allowCustomId: true },
  },
  
  'task-templates': {
    entityType: 'task-templates',
    prefix: ENTITY_PREFIXES['task-templates'], // 'TMPL'
    systemIdPrefix: 'TMPL',
    digitCount: 6,
    displayName: 'Mẫu công việc',
    category: 'system',
    usesStoreFactory: false,
  },
  
  'custom-fields': {
    entityType: 'custom-fields',
    prefix: ENTITY_PREFIXES['custom-fields'], // 'FIELD'
    systemIdPrefix: 'FIELD',
    digitCount: 6,
    displayName: 'Trường tùy chỉnh',
    category: 'settings',
    usesStoreFactory: false,
  },
  
  'warranty': {
    entityType: 'warranty',
    prefix: ENTITY_PREFIXES['warranty'], // 'BH'
    systemIdPrefix: 'WARRANTY',
    digitCount: 6,
    displayName: 'Bảo hành',
    category: 'service',
    usesStoreFactory: true,
    notes: 'systemId: WARRANTY000001, Business ID: BH000001',
  },
  
  'complaints': {
    entityType: 'complaints',
    prefix: ENTITY_PREFIXES['complaints'], // 'PKN'
    systemIdPrefix: 'COMPLAINT',
    digitCount: 6,
    displayName: 'Khiếu nại',
    category: 'service',
    usesStoreFactory: true,
    notes: 'systemId: COMPLAINT000001, Business ID: PKN000001',
  },
  
  // ========================================
  // ⚙️ SETTINGS & CATEGORIES
  // ========================================
  
  'provinces': {
    entityType: 'provinces',
    prefix: ENTITY_PREFIXES['provinces'], // 'TP'
    systemIdPrefix: 'PROVINCE',
    digitCount: 6,
    displayName: 'Tỉnh/Thành phố',
    category: 'settings',
    validation: { allowCustomId: true },
    usesStoreFactory: true,
  },
  'districts': {
    entityType: 'districts',
    prefix: ENTITY_PREFIXES['districts'], // 'QH'
    systemIdPrefix: 'DISTRICT',
    digitCount: 6,
    displayName: 'Quận/Huyện',
    category: 'settings',
    validation: { allowCustomId: true },
    usesStoreFactory: true,
  },
  'wards': {
    entityType: 'wards',
    prefix: ENTITY_PREFIXES['wards'], // 'PX'
    systemIdPrefix: 'WARD',
    digitCount: 6,
    displayName: 'Phường/Xã',
    category: 'settings',
    validation: { allowCustomId: true },
    usesStoreFactory: true,
  },
  
  'wiki': {
    entityType: 'wiki',
    prefix: ENTITY_PREFIXES['wiki'], // 'TL'
    systemIdPrefix: 'WIKI',
    digitCount: 6,
    displayName: 'Tài liệu',
    category: 'system',
    usesStoreFactory: false,
  },
  
  'packaging': {
    entityType: 'packaging',
    prefix: ENTITY_PREFIXES['packaging'], // 'DG'
    systemIdPrefix: 'PACKAGE',
    digitCount: 6,
    displayName: 'Đóng gói',
    category: 'inventory',
    usesStoreFactory: false,
  },
  
  'audit-log': {
    entityType: 'audit-log',
    prefix: ENTITY_PREFIXES['audit-log'], // 'LOG'
    systemIdPrefix: 'LOG',
    digitCount: 10,
    displayName: 'Nhật ký',
    category: 'system',
    usesStoreFactory: false,
  },
  
  // Customer Settings
  'customer-types': {
    entityType: 'customer-types',
    prefix: ENTITY_PREFIXES['customer-types'], // 'LKH'
    systemIdPrefix: 'CUSTTYPE',
    digitCount: 6,
    displayName: 'Loại khách hàng',
    category: 'settings',
    usesStoreFactory: false,
  },
  
  'customer-groups': {
    entityType: 'customer-groups',
    prefix: ENTITY_PREFIXES['customer-groups'], // 'NHKH'
    systemIdPrefix: 'CUSTGROUP',
    digitCount: 6,
    displayName: 'Nhóm khách hàng',
    category: 'settings',
    usesStoreFactory: false,
  },
  
  'customer-sources': {
    entityType: 'customer-sources',
    prefix: ENTITY_PREFIXES['customer-sources'], // 'NKH'
    systemIdPrefix: 'CUSTSOURCE',
    digitCount: 6,
    displayName: 'Nguồn khách hàng',
    category: 'settings',
    usesStoreFactory: false,
  },
  
  'payment-terms': {
    entityType: 'payment-terms',
    prefix: ENTITY_PREFIXES['payment-terms'], // 'HTTT'
    systemIdPrefix: 'PAYTERM',
    digitCount: 6,
    displayName: 'Hình thức thanh toán',
    category: 'settings',
    usesStoreFactory: false,
  },
  
  'credit-ratings': {
    entityType: 'credit-ratings',
    prefix: ENTITY_PREFIXES['credit-ratings'], // 'XHTD'
    systemIdPrefix: 'CREDIT',
    digitCount: 6,
    displayName: 'Xếp hạng tín dụng',
    category: 'settings',
    usesStoreFactory: false,
  },
  
  // Employee Settings
  'employee-types': {
    entityType: 'employee-types',
    prefix: ENTITY_PREFIXES['employee-types'], // 'LNV'
    systemIdPrefix: 'EMPTYPE',
    digitCount: 6,
    displayName: 'Loại nhân viên',
    category: 'settings',
    usesStoreFactory: false,
  },
  
  'employee-statuses': {
    entityType: 'employee-statuses',
    prefix: ENTITY_PREFIXES['employee-statuses'], // 'TTNV'
    systemIdPrefix: 'EMPSTATUS',
    digitCount: 6,
    displayName: 'Trạng thái nhân viên',
    category: 'settings',
    usesStoreFactory: false,
  },
  
  'contract-types': {
    entityType: 'contract-types',
    prefix: ENTITY_PREFIXES['contract-types'], // 'LHD'
    systemIdPrefix: 'CONTRACT',
    digitCount: 6,
    displayName: 'Loại hợp đồng',
    category: 'settings',
    usesStoreFactory: false,
  },
  
  'work-shifts': {
    entityType: 'work-shifts',
    prefix: ENTITY_PREFIXES['work-shifts'], // 'CA'
    systemIdPrefix: 'WSHIFT',
    digitCount: 6,
    displayName: 'Ca làm việc',
    category: 'settings',
    usesStoreFactory: false,
    notes: 'Dùng cho cài đặt ca làm việc & Dual ID trong attendance',
  },
  
  'leave-types': {
    entityType: 'leave-types',
    prefix: ENTITY_PREFIXES['leave-types'], // 'LP'
    systemIdPrefix: 'LEAVETYPE',
    digitCount: 6,
    displayName: 'Loại nghỉ phép',
    category: 'settings',
    usesStoreFactory: false,
    notes: 'Quản lý danh mục phép năm/phép đặc biệt',
  },
  
  'salary-components': {
    entityType: 'salary-components',
    prefix: ENTITY_PREFIXES['salary-components'], // 'SC'
    systemIdPrefix: 'SALCOMP',
    digitCount: 6,
    displayName: 'Thành phần lương',
    category: 'settings',
    usesStoreFactory: false,
    notes: 'Dùng cho cấu hình payroll engine',
  },
  
  // ========================================
  // 🔐 SYSTEM & AUTH
  // ========================================
  
  'settings': {
    entityType: 'settings',
    prefix: ENTITY_PREFIXES['settings'], // 'CFG'
    systemIdPrefix: 'CONFIG',
    digitCount: 6,
    displayName: 'Cấu hình',
    category: 'system',
    usesStoreFactory: false,
  },
  
  'users': {
    entityType: 'users',
    prefix: ENTITY_PREFIXES['users'], // 'USER'
    systemIdPrefix: 'USER',
    digitCount: 6,
    displayName: 'Người dùng',
    category: 'system',
    usesStoreFactory: false,
  },
};

// ========================================
// 🛠️ HELPER FUNCTIONS
// ========================================

/**
 * Get configuration for an entity type
 */
export function getEntityConfig(entityType: EntityType): EntityIDConfig {
  const config = ID_CONFIG[entityType];
  if (!config) {
    throw new Error(`No configuration found for entity type: ${entityType}`);
  }
  return config;
}

/**
 * Get all entity types in a category
 */
export function getEntitiesByCategory(category: EntityIDConfig['category']): EntityType[] {
  return Object.values(ID_CONFIG)
    .filter(config => config.category === category)
    .map(config => config.entityType);
}

/**
 * Get entities grouped by category
 */
export function getEntityCategories(): Record<string, EntityType[]> {
  const categories: Record<string, EntityType[]> = {
    'hr': [],
    'finance': [],
    'inventory': [],
    'sales': [],
    'purchasing': [],
    'service': [],
    'settings': [],
    'system': [],
  };
  
  Object.values(ID_CONFIG).forEach(config => {
    categories[config.category].push(config.entityType);
  });
  
  return categories;
}

/**
 * Validate ID format for an entity
 * Returns validation result with detailed error message
 */
export function validateIdFormat(
  id: string,
  entityType: EntityType
): { valid: boolean; error?: string } {
  const config = getEntityConfig(entityType);
  
  // Check prefix
  if (!id.startsWith(config.prefix)) {
    return { 
      valid: false, 
      error: `Invalid prefix. Expected "${config.prefix}", got "${id.slice(0, config.prefix.length)}"` 
    };
  }
  
  // Check digit count
  const numberPart = id.substring(config.prefix.length);
  if (numberPart.length !== config.digitCount) {
    const expectedLength = config.prefix.length + config.digitCount;
    return { 
      valid: false, 
      error: `Invalid length. Expected ${expectedLength} characters, got ${id.length}` 
    };
  }
  
  // Check if numeric
  if (!/^\d+$/.test(numberPart)) {
    return { 
      valid: false, 
      error: 'Numeric part must contain only digits' 
    };
  }
  
  // Custom pattern validation
  if (config.validation?.pattern && !config.validation.pattern.test(id)) {
    return { 
      valid: false, 
      error: 'ID does not match required pattern' 
    };
  }
  
  return { valid: true };
}

/**
 * Check if entity allows custom ID input
 */
export function allowsCustomId(entityType: EntityType): boolean {
  return getEntityConfig(entityType).validation?.allowCustomId ?? false;
}

/**
 * Get entities that use store factory
 */
export function getStoreFactoryEntities(): EntityType[] {
  return Object.values(ID_CONFIG)
    .filter(config => config.usesStoreFactory === true)
    .map(config => config.entityType);
}

/**
 * Get display label for category
 */
export function getCategoryLabel(category: EntityIDConfig['category']): string {
  const labels: Record<EntityIDConfig['category'], string> = {
    'hr': 'Nhân sự & Tổ chức',
    'finance': 'Tài chính',
    'inventory': 'Kho hàng',
    'sales': 'Bán hàng',
    'purchasing': 'Mua hàng',
    'service': 'Dịch vụ khách hàng',
    'settings': 'Cài đặt',
    'system': 'Hệ thống',
  };
  return labels[category];
}

/**
 * Search entities by name or prefix
 */
export function searchEntities(query: string): EntityIDConfig[] {
  const lowerQuery = query.toLowerCase();
  return Object.values(ID_CONFIG).filter(config => 
    config.displayName.toLowerCase().includes(lowerQuery) ||
    config.prefix.toLowerCase().includes(lowerQuery) ||
    config.entityType.includes(lowerQuery)
  );
}

/**
 * Get total entity count
 */
export function getTotalEntityCount(): number {
  return Object.keys(ID_CONFIG).length;
}

/**
 * Export configuration for backup/import
 */
export function exportConfig(): string {
  return JSON.stringify(ID_CONFIG, null, 2);
}

// ========================================
// 📊 STATISTICS & ANALYTICS
// ========================================

export interface IDSystemStats {
  totalEntities: number;
  byCategory: Record<string, number>;
  storeFactoryEnabled: number;
  customIdAllowed: number;
  averageDigitCount: number;
}

/**
 * Get ID system statistics
 */
export function getIDSystemStats(): IDSystemStats {
  const configs = Object.values(ID_CONFIG);
  
  const byCategory: Record<string, number> = {};
  let storeFactoryEnabled = 0;
  let customIdAllowed = 0;
  let totalDigits = 0;
  
  configs.forEach(config => {
    // Count by category
    byCategory[config.category] = (byCategory[config.category] || 0) + 1;
    
    // Count features
    if (config.usesStoreFactory) storeFactoryEnabled++;
    if (config.validation?.allowCustomId) customIdAllowed++;
    totalDigits += config.digitCount;
  });
  
  return {
    totalEntities: configs.length,
    byCategory,
    storeFactoryEnabled,
    customIdAllowed,
    averageDigitCount: Math.round(totalDigits / configs.length * 10) / 10,
  };
}
