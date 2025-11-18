/**
 * Smart Prefix System
 * Mapping entity types to their unique prefixes
 */

export const ENTITY_PREFIXES = {
  // ========================================
  // NHÂN SỰ & TỔ CHỨC (HR & ORGANIZATION)
  // ========================================
  'employees': 'NV',           // Nhân viên (Employee)
  'departments': 'PB',         // Phòng ban (Department)
  'branches': 'CN',            // Chi nhánh (Branch)
  'job-titles': 'CV',          // Chức vụ (Job Title)
  
  // ========================================
  // KHÁCH HÀNG & ĐỐI TÁC (CUSTOMERS & PARTNERS)
  // ========================================
  'customers': 'KH',           // Khách hàng (Customer)
  'suppliers': 'NCC',          // Nhà cung cấp (Supplier)
  'shipping-partners': 'DVVC', // Đơn vị vận chuyển (Shipping Partner)
  
  // ========================================
  // SẢN PHẨM & KHO (PRODUCTS & INVENTORY)
  // ========================================
  'products': 'SP',            // Sản phẩm (Product)
  'units': 'DVT',              // Đơn vị tính (Unit)
  'stock-locations': 'KHO',    // Kho hàng (Stock Location)
  'inventory-receipts': 'NK',  // Nhập kho (Inventory Receipt)
  'inventory-checks': 'PKK',   // Phiếu kiểm kho (Inventory Check)
  'stock-history': 'LS',       // Lịch sử kho (Stock History)
  
  // ========================================
  // BÁN HÀNG (SALES)
  // ========================================
  'orders': 'DH',              // Đơn hàng (Sales Order)
  'sales-returns': 'TH',       // Trả hàng (Sales Return)
  'sales-channels': 'KENH',    // Kênh bán hàng (Sales Channel)
  'shipments': 'VC',           // Vận chuyển (Shipment)
  
  // ========================================
  // MUA HÀNG (PURCHASING)
  // ========================================
  'purchase-orders': 'PO',     // Đơn mua hàng (Purchase Order)
  'purchase-returns': 'TM',    // Trả mua (Purchase Return)
  
  // ========================================
  // TÀI CHÍNH (FINANCE)
  // ========================================
  'receipts': 'PT',            // Phiếu thu (Receipt)
  'payments': 'PC',            // Phiếu chi (Payment)
  'cashbook': 'SCT',           // Sổ quỹ (Cashbook)
  'reconciliation': 'DT',      // Đối tài (Reconciliation)
  
  // Cài đặt tài chính
  'receipt-types': 'LT',       // Loại thu (Receipt Type)
  'payment-types': 'LC',       // Loại chi (Payment Type)
  'cash-accounts': 'TK',       // Tài khoản tiền (Cash Account)
  'payment-methods': 'PTTT',   // Phương thức thanh toán (Payment Method)
  'pricing-settings': 'GIA',   // Chính sách giá (Pricing Policy)
  
  // ========================================
  // LƯƠNG & NHÂN SỰ (PAYROLL & HR)
  // ========================================
  'payroll': 'BL',             // Bảng lương (Payroll)
  'penalties': 'PF',           // Phiếu phạt (Penalty)
  'leaves': 'PN',              // Phép nghỉ (Leave)
  'attendance': 'CC',          // Chấm công (Attendance)
  'duty-schedule': 'PC',       // Phân công (Duty Schedule)
  
  // ========================================
  // KPI & MỤC TIÊU (KPI & TARGETS)
  // ========================================
  'kpi': 'KPI',                // KPI
  'target-groups': 'NHOM',     // Nhóm mục tiêu (Target Group)
  'other-targets': 'MT',       // Mục tiêu khác (Other Target)
  
  // ========================================
  // CÔNG VIỆC & DỊCH VỤ (TASKS & SERVICES)
  // ========================================
  'internal-tasks': 'CVNB',    // Công việc nội bộ (Internal Task)
  'task-templates': 'TMPL',    // Mẫu công việc (Task Template)
  'custom-fields': 'FIELD',    // Trường tùy chỉnh (Custom Field)
  'warranty': 'BH',            // Bảo hành (Warranty)
  'complaints': 'PKN',         // Khiếu nại (Complaint)
  
  // ========================================
  // CÀI ĐẶT & DANH MỤC (SETTINGS & CATEGORIES)
  // ========================================
  'provinces': 'TP',           // Tỉnh/Thành phố (Province)
  'wiki': 'TL',                // Tài liệu (Wiki)
  'packaging': 'DG',           // Đóng gói (Packaging)
  'audit-log': 'LOG',          // Nhật ký (Audit Log)
  
  // ========================================
  // CÀI ĐẶT KHÁCH HÀNG (CUSTOMER SETTINGS)
  // ========================================
  'customer-types': 'LKH',     // Loại khách hàng (Customer Type)
  'customer-groups': 'NHKH',   // Nhóm khách hàng (Customer Group)
  'customer-sources': 'NKH',   // Nguồn khách hàng (Customer Source)
  'payment-terms': 'HTTT',     // Hạn thanh toán (Payment Term)
  'credit-ratings': 'XHTD',    // Xếp hạng tín dụng (Credit Rating)
  
  // ========================================
  // CÀI ĐẶT NHÂN VIÊN (EMPLOYEE SETTINGS)
  // ========================================
  'employee-types': 'LNV',     // Loại nhân viên (Employee Type)
  'employee-statuses': 'TTNV', // Trạng thái nhân viên (Employee Status)
  'contract-types': 'LHD',     // Loại hợp đồng (Contract Type)
  
  // ========================================
  // CÀI ĐẶT KHÁC (OTHER SETTINGS)
  // ========================================
  'settings': 'CFG',           // Cấu hình (Configuration)
  
  // ========================================
  // AUTHENTICATION & USERS
  // ========================================
  'users': 'USER',             // User accounts (for admin management)
  
} as const;

export type EntityType = keyof typeof ENTITY_PREFIXES;

/**
 * Get prefix for an entity type
 */
export function getPrefix(entityType: EntityType): string {
  return ENTITY_PREFIXES[entityType];
}

/**
 * Get all entity types
 */
export function getAllEntityTypes(): EntityType[] {
  return Object.keys(ENTITY_PREFIXES) as EntityType[];
}

/**
 * Check if an entity type exists
 */
export function isValidEntityType(entityType: string): entityType is EntityType {
  return entityType in ENTITY_PREFIXES;
}

/**
 * Get entity type from prefix
 */
export function getEntityTypeFromPrefix(prefix: string): EntityType | null {
  const entry = Object.entries(ENTITY_PREFIXES).find(([_, p]) => p === prefix);
  return entry ? (entry[0] as EntityType) : null;
}
