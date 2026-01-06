/**
 * UNIFIED ID MANAGEMENT SYSTEM v3.0
 * 
 * Single source of truth for all ID operations in the system.
 * Database-first approach using IdCounter table.
 * 
 * Features:
 * - 60+ entity configurations
 * - TypeScript branded types (SystemId, BusinessId)
 * - Database-backed counter (atomic operations)
 * - Server & Client compatible utilities
 * 
 * @version 3.0.0
 * @date 2026-01-03
 */

import { prisma } from './prisma';

// ========================================
// ENTITY TYPES (from smart-prefix.ts)
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
  | 'stock-transfers' | 'stock-history' | 'packaging'
  // Sales & Fulfillment
  | 'orders' | 'sales-returns' | 'sales-channels' | 'shipments' | 'other-targets'
  // Purchasing
  | 'purchase-orders' | 'purchase-returns'
  // Finance
  | 'receipts' | 'payments' | 'voucher-receipt' | 'voucher-payment'
  | 'cashbook' | 'reconciliation' | 'receipt-types' | 'payment-types'
  | 'cash-accounts' | 'payment-methods' | 'pricing-settings' | 'taxes'
  // Service & Workflow
  | 'warranty' | 'complaints' | 'internal-tasks' | 'task-templates' | 'custom-fields' | 'wiki'
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
// BRANDED TYPES FOR TYPE SAFETY
// ========================================

/**
 * SystemId - Internal unique identifier
 * Used for: Database queries, foreign keys, routing
 * Example: "EMP000001", "CUSTOMER000001", "ORDER000001"
 */
export type SystemId = string & { readonly __brand: 'SystemId' };

/**
 * BusinessId - User-facing display identifier
 * Used for: UI display, breadcrumbs, user communication
 * Example: "NV000001", "KH000001", "DH000001"
 */
export type BusinessId = string & { readonly __brand: 'BusinessId' };

/**
 * Create a branded SystemId
 */
export function asSystemId(id: string): SystemId {
  return id as SystemId;
}

/**
 * Create a branded BusinessId
 */
export function asBusinessId(id: string): BusinessId {
  return id as BusinessId;
}

/**
 * Entity with dual IDs (SystemId + BusinessId)
 */
export interface DualIDEntity {
  systemId: SystemId;
  id: BusinessId;
}

/**
 * ID Pair - Always keep systemId and businessId together
 */
export interface IDPair {
  systemId: SystemId;
  businessId: BusinessId;
}

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
  'task-templates': { prefix: 'TMPL', systemIdPrefix: 'TMPL', digitCount: 6, displayName: 'Mẫu công việc', category: 'system' },
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

// ========================================
// UTILITY FUNCTIONS (Client-safe)
// ========================================

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
 * Format a counter value to ID string
 */
export function formatId(prefix: string, counter: number, digitCount: number = 6): string {
  return `${prefix}${String(counter).padStart(digitCount, '0')}`;
}

/**
 * Sanitize business ID input
 */
export function sanitizeBusinessId(id: string): string | null {
  if (!id || typeof id !== 'string') return null;
  const cleaned = id.trim().replace(/[^a-zA-Z0-9]/g, '');
  return cleaned ? cleaned.toUpperCase() : null;
}

/**
 * Check if business ID is unique
 */
export function isBusinessIdUnique(
  id: string,
  existingIds: string[],
  currentId?: string
): boolean {
  if (!id) return false;
  const normalizedId = id.toUpperCase();
  const normalizedCurrentId = currentId?.toUpperCase();
  
  return !existingIds.some(existingId => {
    if (!existingId || existingId.trim() === '') return false;
    const normalized = existingId.toUpperCase();
    if (normalizedCurrentId && normalized === normalizedCurrentId) return false;
    return normalized === normalizedId;
  });
}

// ========================================
// DATABASE-BACKED ID GENERATION (Server-only)
// ========================================

export interface GeneratedIds {
  systemId: SystemId;
  businessId: BusinessId;
  counter: number;
}

/**
 * Generate next IDs using database counter (ATOMIC)
 * 
 * @param entityType - Entity type from ID_CONFIG
 * @param customBusinessId - Optional custom business ID (user input)
 * @returns Generated systemId and businessId
 * 
 * @example
 * const { systemId, businessId } = await generateNextIds('employees');
 * // systemId: "EMP000001", businessId: "NV000001"
 * 
 * @example
 * const { systemId, businessId } = await generateNextIds('employees', 'NV-CUSTOM-001');
 * // systemId: "EMP000001", businessId: "NVCUSTOM001"
 */
export async function generateNextIds(
  entityType: EntityType,
  customBusinessId?: string
): Promise<GeneratedIds> {
  const config = getConfig(entityType);
  
  // Atomic increment using upsert
  const counter = await prisma.idCounter.upsert({
    where: { entityType },
    update: { currentValue: { increment: 1 } },
    create: {
      entityType,
      prefix: config.prefix,
      systemPrefix: config.systemIdPrefix,
      businessPrefix: config.prefix,
      currentValue: 1,
      padding: config.digitCount,
    },
  });

  const systemId = asSystemId(formatId(config.systemIdPrefix, counter.currentValue, config.digitCount));
  
  // Handle custom business ID
  let businessId: BusinessId;
  if (customBusinessId && config.allowCustomId) {
    const sanitized = sanitizeBusinessId(customBusinessId);
    if (sanitized) {
      businessId = asBusinessId(sanitized);
    } else {
      businessId = asBusinessId(formatId(config.prefix, counter.currentValue, config.digitCount));
    }
  } else {
    businessId = asBusinessId(formatId(config.prefix, counter.currentValue, config.digitCount));
  }

  return {
    systemId,
    businessId,
    counter: counter.currentValue,
  };
}

/**
 * Get current counter value for an entity (without incrementing)
 */
export async function getCurrentCounter(entityType: EntityType): Promise<number> {
  const counter = await prisma.idCounter.findUnique({
    where: { entityType },
  });
  return counter?.currentValue ?? 0;
}

/**
 * Preview next IDs (without incrementing counter)
 */
export async function previewNextIds(entityType: EntityType): Promise<{
  nextSystemId: string;
  nextBusinessId: string;
  currentCounter: number;
}> {
  const config = getConfig(entityType);
  const currentCounter = await getCurrentCounter(entityType);
  const nextCounter = currentCounter + 1;
  
  return {
    nextSystemId: formatId(config.systemIdPrefix, nextCounter, config.digitCount),
    nextBusinessId: formatId(config.prefix, nextCounter, config.digitCount),
    currentCounter,
  };
}

/**
 * Reset counter for an entity (USE WITH CAUTION!)
 */
export async function resetCounter(entityType: EntityType, newValue: number = 0): Promise<void> {
  const config = getConfig(entityType);
  
  await prisma.idCounter.upsert({
    where: { entityType },
    update: { currentValue: newValue },
    create: {
      entityType,
      prefix: config.prefix,
      systemPrefix: config.systemIdPrefix,
      businessPrefix: config.prefix,
      currentValue: newValue,
      padding: config.digitCount,
    },
  });
}

/**
 * Batch generate IDs for multiple items
 */
export async function generateBatchIds(
  entityType: EntityType,
  count: number
): Promise<GeneratedIds[]> {
  const config = getConfig(entityType);
  const results: GeneratedIds[] = [];
  
  // Get current counter and reserve range atomically
  const counter = await prisma.idCounter.upsert({
    where: { entityType },
    update: { currentValue: { increment: count } },
    create: {
      entityType,
      prefix: config.prefix,
      systemPrefix: config.systemIdPrefix,
      businessPrefix: config.prefix,
      currentValue: count,
      padding: config.digitCount,
    },
  });
  
  // Generate IDs for the reserved range
  const startCounter = counter.currentValue - count + 1;
  for (let i = 0; i < count; i++) {
    const currentCounter = startCounter + i;
    results.push({
      systemId: asSystemId(formatId(config.systemIdPrefix, currentCounter, config.digitCount)),
      businessId: asBusinessId(formatId(config.prefix, currentCounter, config.digitCount)),
      counter: currentCounter,
    });
  }
  
  return results;
}

// ========================================
// HELPER EXPORTS
// ========================================

/**
 * Get all entity types
 */
export function getAllEntityTypes(): EntityType[] {
  return Object.keys(ID_CONFIG) as EntityType[];
}

/**
 * Get entities by category
 */
export function getEntitiesByCategory(category: EntityConfig['category']): EntityType[] {
  return Object.entries(ID_CONFIG)
    .filter(([, config]) => config.category === category)
    .map(([type]) => type as EntityType);
}

/**
 * Category display labels
 */
export const CATEGORY_LABELS: Record<EntityConfig['category'], string> = {
  hr: 'Nhân sự & Tổ chức',
  finance: 'Tài chính',
  inventory: 'Kho hàng',
  sales: 'Bán hàng',
  purchasing: 'Mua hàng',
  service: 'Dịch vụ khách hàng',
  settings: 'Cài đặt',
  system: 'Hệ thống',
};

// ========================================
// BACKWARD COMPATIBILITY EXPORTS
// ========================================

// Re-exports for backward compatibility with old imports
export { asSystemId as createSystemId };
export { asBusinessId as createBusinessId };

// Backward compatibility type aliases
export type EntityIDConfig = EntityConfig;

// Backward compatibility function aliases
export const getEntityConfig = getConfig;

/**
 * Get entities grouped by category
 * Returns Record<category, EntityType[]>
 */
export function getEntityCategories(): Record<EntityConfig['category'], EntityType[]> {
  const result: Record<EntityConfig['category'], EntityType[]> = {
    hr: [],
    finance: [],
    inventory: [],
    sales: [],
    purchasing: [],
    service: [],
    settings: [],
    system: [],
  };
  
  Object.entries(ID_CONFIG).forEach(([entityType, config]) => {
    result[config.category].push(entityType as EntityType);
  });
  
  return result;
}

/**
 * Validate ID format for a given entity type
 */
export function validateIdFormat(id: string, entityType: EntityType): { valid: boolean; error?: string } {
  if (!id) {
    return { valid: false, error: 'ID cannot be empty' };
  }
  
  const config = ID_CONFIG[entityType];
  if (!config) {
    return { valid: false, error: `Unknown entity type: ${entityType}` };
  }
  
  // Check if matches business ID format
  const businessIdPattern = new RegExp(`^${config.prefix}\\d{${config.digitCount}}$`, 'i');
  if (businessIdPattern.test(id)) {
    return { valid: true };
  }
  
  // Check if matches system ID format
  const systemIdPattern = new RegExp(`^${config.systemIdPrefix}\\d{8}$`, 'i');
  if (systemIdPattern.test(id)) {
    return { valid: true };
  }
  
  return { 
    valid: false, 
    error: `Invalid format. Expected ${config.prefix}${'0'.repeat(config.digitCount)} or ${config.systemIdPrefix}${'0'.repeat(8)}`
  };
}

// Validation functions
export function isSystemIdFormat(id: string): boolean {
  // SystemId: 8 digits (e.g., EMP00000001)
  return /^[A-Z]+\d{8}$/.test(id);
}

export function isBusinessIdFormat(id: string): boolean {
  // Business ID: shorter, variable length (e.g., NV001, PT000001)
  return /^[A-Z]+\d{3,6}$/.test(id);
}

export function ensureSystemId(id: string, _context?: string): SystemId {
  if (!isSystemIdFormat(id)) {
    // Warning: Invalid format, but proceed anyway for legacy compatibility
  }
  return asSystemId(id);
}

export function ensureBusinessId(id: string, _context?: string): BusinessId {
  if (!isBusinessIdFormat(id)) {
    // Warning: Invalid format, but proceed anyway for legacy compatibility
  }
  return asBusinessId(id);
}

/**
 * Generate SystemId (for legacy compatibility with id-utils)
 * @param entityType - Entity type from ID_CONFIG
 * @param counter - Current counter value
 * @returns SystemId string
 */
export function generateSystemId(entityType: EntityType, counter: number): string {
  const config = getConfig(entityType);
  return formatId(config.systemIdPrefix, counter, config.digitCount);
}

/**
 * Generate BusinessId (for legacy compatibility with id-utils)
 * @param entityType - Entity type from ID_CONFIG
 * @param counter - Current counter value
 * @param customId - Optional custom ID from user input
 * @returns BusinessId string
 */
export function generateBusinessId(
  entityType: EntityType, 
  counter: number,
  customId?: string
): string {
  if (customId?.trim()) {
    const sanitized = sanitizeBusinessId(customId);
    if (!sanitized) {
      throw new Error('Ma khong hop le! Chi duoc phep su dung chu cai va so.');
    }
    return sanitized;
  }
  const config = getConfig(entityType);
  return formatId(config.prefix, counter, config.digitCount);
}

/**
 * Extract counter from system ID
 */
export function extractCounterFromSystemId(systemId: string, prefix: string): number {
  if (!systemId || typeof systemId !== 'string') return 0;
  
  const regex8 = new RegExp(`^${prefix}(\\d{8})$`);
  const regex7 = new RegExp(`^${prefix}(\\d{7})$`);
  const regex6 = new RegExp(`^${prefix}(\\d{6})$`);
  
  const match8 = systemId.match(regex8);
  if (match8) return parseInt(match8[1], 10);
  
  const match7 = systemId.match(regex7);
  if (match7) return parseInt(match7[1], 10);
  
  const match6 = systemId.match(regex6);
  if (match6) return parseInt(match6[1], 10);
  
  return 0;
}

/**
 * Extract counter from business ID
 */
export function extractCounterFromBusinessId(businessId: string, prefix: string): number {
  if (!businessId || typeof businessId !== 'string') return 0;
  const regex = new RegExp(`^${prefix}(\\d+)$`);
  const match = businessId.match(regex);
  return match ? parseInt(match[1], 10) : 0;
}

// ========================================
// CLIENT-SIDE ID GENERATION (Legacy - for store-factory)
// ========================================

/**
 * Generate a system ID string from entity type and counter (CLIENT-SAFE)
 * @deprecated Use generateNextIds() from server for production
 */
export function generateSystemIdClient(entityType: EntityType, counter: number): string {
  const config = getConfig(entityType);
  return formatId(config.systemIdPrefix, counter, config.digitCount);
}

/**
 * Generate a business ID string from entity type and counter (CLIENT-SAFE)
 * @deprecated Use generateNextIds() from server for production
 */
export function generateBusinessIdClient(entityType: EntityType, counter: number): string {
  const config = getConfig(entityType);
  return formatId(config.prefix, counter, config.digitCount);
}

/**
 * Find next available business ID (avoiding conflicts)
 * @deprecated Should use database-backed generation
 */
export function findNextAvailableBusinessId(
  prefix: string, 
  existingIds: string[], 
  startingCounter: number,
  digitCount: number = 6
): { nextId: string; updatedCounter: number } {
  let counter = startingCounter;
  let nextId = formatId(prefix, counter + 1, digitCount);
  
  // Find next available (skip existing)
  const normalizedExisting = new Set(existingIds.map(id => id?.toUpperCase()));
  while (normalizedExisting.has(nextId.toUpperCase())) {
    counter++;
    nextId = formatId(prefix, counter + 1, digitCount);
  }
  
  return { nextId, updatedCounter: counter + 1 };
}

/**
 * Extract counter value from ID string
 */
export function extractCounter(id: string, prefix: string): number {
  if (!id || !prefix) return 0;
  const normalized = id.toUpperCase();
  const prefixUpper = prefix.toUpperCase();
  
  if (!normalized.startsWith(prefixUpper)) return 0;
  const numericPart = normalized.slice(prefixUpper.length);
  return parseInt(numericPart, 10) || 0;
}

/**
 * Get max system ID counter from items
 */
export function getMaxSystemIdCounter<T extends { systemId?: string }>(
  items: T[], 
  systemIdPrefix: string
): number {
  let maxCounter = 0;
  for (const item of items) {
    if (item.systemId) {
      const counter = extractCounter(item.systemId, systemIdPrefix);
      if (counter > maxCounter) maxCounter = counter;
    }
  }
  return maxCounter;
}

/**
 * Get max business ID counter from items
 */
export function getMaxBusinessIdCounter<T extends { id?: string }>(
  items: T[], 
  businessPrefix: string
): number {
  let maxCounter = 0;
  for (const item of items) {
    if (item.id) {
      const counter = extractCounter(item.id, businessPrefix);
      if (counter > maxCounter) maxCounter = counter;
    }
  }
  return maxCounter;
}
