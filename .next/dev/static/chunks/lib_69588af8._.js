(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/lib/id-types.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Type-safe ID System
 * 
 * Prevents mixing systemId with business ID at compile time
 */ // Branded types for type safety
__turbopack_context__.s([
    "asBusinessId",
    ()=>asBusinessId,
    "asSystemId",
    ()=>asSystemId,
    "buildEntityLink",
    ()=>buildEntityLink,
    "ensureBusinessId",
    ()=>ensureBusinessId,
    "ensureSystemId",
    ()=>ensureSystemId,
    "getDisplayId",
    ()=>getDisplayId,
    "isBusinessIdFormat",
    ()=>isBusinessIdFormat,
    "isSystemIdFormat",
    ()=>isSystemIdFormat,
    "parseId",
    ()=>parseId
]);
function asSystemId(id) {
    return id;
}
function asBusinessId(id) {
    return id;
}
function isSystemIdFormat(id) {
    // SystemId: 8 digits + prefix (e.g., NV00000001, VOUCHER00000123)
    return /^[A-Z]+\d{8}$/.test(id);
}
function isBusinessIdFormat(id) {
    // Business ID: shorter, variable length (e.g., NV001, PT000001)
    return /^[A-Z]+\d{3,6}$/.test(id);
}
function parseId(id) {
    if (isSystemIdFormat(id)) {
        return {
            type: 'system',
            value: asSystemId(id)
        };
    }
    if (isBusinessIdFormat(id)) {
        return {
            type: 'business',
            value: asBusinessId(id)
        };
    }
    throw new Error(`Invalid ID format: ${id}`);
}
function buildEntityLink(path, entity) {
    return path.replace(':systemId', entity.systemId);
}
function getDisplayId(entity) {
    return entity.id;
}
function ensureSystemId(id, context) {
    if (!isSystemIdFormat(id)) {
        console.warn(`[ensureSystemId] Invalid SystemId format: "${id}"${context ? ` in ${context}` : ''}`);
    }
    return asSystemId(id);
}
function ensureBusinessId(id, context) {
    if (!isBusinessIdFormat(id)) {
        console.warn(`[ensureBusinessId] Invalid BusinessId format: "${id}"${context ? ` in ${context}` : ''}`);
    }
    return asBusinessId(id);
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/warranty-settings-sync.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getWarrantyNotificationsSync",
    ()=>getWarrantyNotificationsSync,
    "getWarrantySLATargetsSync",
    ()=>getWarrantySLATargetsSync,
    "getWarrantyTemplatesSync",
    ()=>getWarrantyTemplatesSync,
    "getWarrantyTrackingSync",
    ()=>getWarrantyTrackingSync,
    "initWarrantySettings",
    ()=>initWarrantySettings,
    "loadWarrantyNotificationsAsync",
    ()=>loadWarrantyNotificationsAsync,
    "loadWarrantySLATargetsAsync",
    ()=>loadWarrantySLATargetsAsync,
    "loadWarrantyTemplatesAsync",
    ()=>loadWarrantyTemplatesAsync,
    "loadWarrantyTrackingAsync",
    ()=>loadWarrantyTrackingAsync,
    "saveWarrantyNotificationsAsync",
    ()=>saveWarrantyNotificationsAsync,
    "saveWarrantySLATargetsAsync",
    ()=>saveWarrantySLATargetsAsync,
    "saveWarrantyTemplatesAsync",
    ()=>saveWarrantyTemplatesAsync,
    "saveWarrantyTrackingAsync",
    ()=>saveWarrantyTrackingAsync
]);
/**
 * Warranty Settings Sync Utilities
 * Provides sync functions for warranty SLA, notifications, tracking settings
 * Uses in-memory cache with database as source of truth
 * 
 * NOTE: localStorage has been removed - all data comes from API/database
 */ // Default values - mutable for use as initial state
const DEFAULTS = {
    sla: {
        response: 2 * 60,
        processing: 24 * 60,
        return: 48 * 60
    },
    notifications: {
        emailOnCreate: true,
        emailOnAssign: true,
        emailOnProcessing: false,
        emailOnProcessed: true,
        emailOnReturned: true,
        emailOnOverdue: true,
        smsOnOverdue: false,
        inAppNotifications: true,
        reminderNotifications: true
    },
    tracking: {
        enabled: false,
        allowCustomerComments: false,
        showEmployeeName: true,
        showTimeline: true
    },
    templates: []
};
// In-memory cache for sync functions
let slaCache = null;
let notificationsCache = null;
let trackingCache = null;
let templatesCache = null;
// Generic fetch function
async function fetchWarrantySetting(type) {
    try {
        const response = await fetch(`/api/warranty-settings?type=${type}`);
        if (!response.ok) throw new Error('Failed to fetch');
        return await response.json();
    } catch (error) {
        console.error(`[WarrantySettings] Failed to fetch ${type}:`, error);
        throw error;
    }
}
// Generic save function
async function saveWarrantySetting(type, data) {
    try {
        const response = await fetch('/api/warranty-settings', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                type,
                data
            })
        });
        if (!response.ok) throw new Error('Failed to save');
    } catch (error) {
        console.error(`[WarrantySettings] Failed to save ${type}:`, error);
        throw error;
    }
}
async function loadWarrantySLATargetsAsync() {
    try {
        const data = await fetchWarrantySetting('sla-targets');
        slaCache = data;
        return data;
    } catch  {
        // Return cache or defaults if API fails
        return slaCache ?? DEFAULTS.sla;
    }
}
function getWarrantySLATargetsSync() {
    return slaCache ?? DEFAULTS.sla;
}
async function saveWarrantySLATargetsAsync(targets) {
    await saveWarrantySetting('sla-targets', targets);
    slaCache = targets;
}
async function loadWarrantyNotificationsAsync() {
    try {
        const data = await fetchWarrantySetting('notifications');
        notificationsCache = data;
        return data;
    } catch  {
        // Return cache or defaults if API fails
        return notificationsCache ?? DEFAULTS.notifications;
    }
}
function getWarrantyNotificationsSync() {
    return notificationsCache ?? DEFAULTS.notifications;
}
async function saveWarrantyNotificationsAsync(settings) {
    await saveWarrantySetting('notifications', settings);
    notificationsCache = settings;
}
async function loadWarrantyTrackingAsync() {
    try {
        const data = await fetchWarrantySetting('tracking');
        trackingCache = data;
        return data;
    } catch  {
        // Return cache or defaults if API fails
        return trackingCache ?? DEFAULTS.tracking;
    }
}
function getWarrantyTrackingSync() {
    return trackingCache ?? DEFAULTS.tracking;
}
async function saveWarrantyTrackingAsync(settings) {
    await saveWarrantySetting('tracking', settings);
    trackingCache = settings;
}
async function loadWarrantyTemplatesAsync() {
    try {
        const data = await fetchWarrantySetting('reminder-templates');
        templatesCache = data;
        return data;
    } catch  {
        // Return cache or defaults if API fails
        return templatesCache ?? DEFAULTS.templates;
    }
}
function getWarrantyTemplatesSync() {
    return templatesCache ?? [];
}
async function saveWarrantyTemplatesAsync(templates) {
    await saveWarrantySetting('reminder-templates', templates);
    templatesCache = templates;
}
async function initWarrantySettings() {
    await Promise.all([
        loadWarrantySLATargetsAsync(),
        loadWarrantyNotificationsAsync(),
        loadWarrantyTrackingAsync(),
        loadWarrantyTemplatesAsync()
    ]);
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/smart-prefix.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Smart Prefix System
 * Mapping entity types to their unique prefixes
 */ __turbopack_context__.s([
    "ENTITY_PREFIXES",
    ()=>ENTITY_PREFIXES,
    "getAllEntityTypes",
    ()=>getAllEntityTypes,
    "getEntityTypeFromPrefix",
    ()=>getEntityTypeFromPrefix,
    "getPrefix",
    ()=>getPrefix,
    "isValidEntityType",
    ()=>isValidEntityType
]);
const ENTITY_PREFIXES = {
    // ========================================
    // NHÂN SỰ & TỔ CHỨC (HR & ORGANIZATION)
    // ========================================
    'employees': 'NV',
    'departments': 'PB',
    'branches': 'CN',
    'job-titles': 'CV',
    // ========================================
    // KHÁCH HÀNG & ĐỐI TÁC (CUSTOMERS & PARTNERS)
    // ========================================
    'customers': 'KH',
    'suppliers': 'NCC',
    'shipping-partners': 'DVVC',
    // ========================================
    // SẢN PHẨM & KHO (PRODUCTS & INVENTORY)
    // ========================================
    'products': 'SP',
    'brands': 'TH',
    'categories': 'DM',
    'units': 'DVT',
    'stock-locations': 'KHO',
    'inventory-receipts': 'NK',
    'inventory-checks': 'PKK',
    'stock-transfers': 'PCK',
    'stock-history': 'LS',
    // ========================================
    // BÁN HÀNG (SALES)
    // ========================================
    'orders': 'DH',
    'sales-returns': 'TH',
    'sales-channels': 'KENH',
    'shipments': 'VC',
    // ========================================
    // MUA HÀNG (PURCHASING)
    // ========================================
    'purchase-orders': 'PO',
    'purchase-returns': 'TM',
    // ========================================
    // TÀI CHÍNH (FINANCE)
    // ========================================
    'receipts': 'PT',
    'payments': 'PC',
    'voucher-receipt': 'PT',
    'voucher-payment': 'PC',
    'cashbook': 'SCT',
    'reconciliation': 'DT',
    // Cài đặt tài chính
    'receipt-types': 'LT',
    'payment-types': 'LC',
    'cash-accounts': 'TK',
    'payment-methods': 'PTTT',
    'pricing-settings': 'GIA',
    'taxes': 'TAX',
    // ========================================
    // LƯƠNG & NHÂN SỰ (PAYROLL & HR)
    // ========================================
    'payroll': 'BL',
    'payslips': 'PL',
    'payroll-audit-log': 'PAL',
    'payroll-templates': 'BTP',
    'penalties': 'PF',
    'leaves': 'PN',
    'attendance': 'CC',
    'duty-schedule': 'PC',
    // ========================================
    // KPI & MỤC TIÊU (KPI & TARGETS)
    // ========================================
    'kpi': 'KPI',
    'target-groups': 'NHOM',
    'other-targets': 'MT',
    // ========================================
    // CÔNG VIỆC & DỊCH VỤ (TASKS & SERVICES)
    // ========================================
    'internal-tasks': 'CVNB',
    'task-templates': 'TMPL',
    'custom-fields': 'FIELD',
    'warranty': 'BH',
    'complaints': 'PKN',
    // ========================================
    // CÀI ĐẶT & DANH MỤC (SETTINGS & CATEGORIES)
    // ========================================
    'provinces': 'TP',
    'districts': 'QH',
    'wards': 'PX',
    'wiki': 'TL',
    'packaging': 'DG',
    'audit-log': 'LOG',
    // ========================================
    // CÀI ĐẶT KHÁCH HÀNG (CUSTOMER SETTINGS)
    // ========================================
    'customer-types': 'LKH',
    'customer-groups': 'NHKH',
    'customer-sources': 'NKH',
    'payment-terms': 'HTTT',
    'credit-ratings': 'XHTD',
    'lifecycle-stages': 'GDL',
    'sla-settings': 'SLA',
    // ========================================
    // CÀI ĐẶT NHÂN VIÊN (EMPLOYEE SETTINGS)
    // ========================================
    'employee-types': 'LNV',
    'employee-statuses': 'TTNV',
    'contract-types': 'LHD',
    'work-shifts': 'CA',
    'leave-types': 'LP',
    'salary-components': 'SC',
    // ========================================
    // CÀI ĐẶT KHÁC (OTHER SETTINGS)
    // ========================================
    'settings': 'CFG',
    // ========================================
    // AUTHENTICATION & USERS
    // ========================================
    'users': 'USER'
};
function getPrefix(entityType) {
    return ENTITY_PREFIXES[entityType];
}
function getAllEntityTypes() {
    return Object.keys(ENTITY_PREFIXES);
}
function isValidEntityType(entityType) {
    return entityType in ENTITY_PREFIXES;
}
function getEntityTypeFromPrefix(prefix) {
    const entry = Object.entries(ENTITY_PREFIXES).find(([_, p])=>p === prefix);
    return entry ? entry[0] : null;
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/id-config.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ID_CONFIG",
    ()=>ID_CONFIG,
    "allowsCustomId",
    ()=>allowsCustomId,
    "createBusinessId",
    ()=>createBusinessId,
    "createSystemId",
    ()=>createSystemId,
    "exportConfig",
    ()=>exportConfig,
    "formatCounterInfo",
    ()=>formatCounterInfo,
    "getCategoryLabel",
    ()=>getCategoryLabel,
    "getEntitiesByCategory",
    ()=>getEntitiesByCategory,
    "getEntityCategories",
    ()=>getEntityCategories,
    "getEntityConfig",
    ()=>getEntityConfig,
    "getIDSystemStats",
    ()=>getIDSystemStats,
    "getStoreFactoryEntities",
    ()=>getStoreFactoryEntities,
    "getTotalEntityCount",
    ()=>getTotalEntityCount,
    "searchEntities",
    ()=>searchEntities,
    "validateIdFormat",
    ()=>validateIdFormat
]);
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
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$smart$2d$prefix$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/smart-prefix.ts [app-client] (ecmascript)");
;
function createSystemId(id) {
    return id;
}
function createBusinessId(id) {
    return id;
}
function formatCounterInfo(entityType, counters) {
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
        displayName: config.displayName
    };
}
const ID_CONFIG = {
    // ========================================
    // 👥 HR & ORGANIZATION (NHÂN SỰ)
    // ========================================
    'employees': {
        entityType: 'employees',
        prefix: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$smart$2d$prefix$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ENTITY_PREFIXES"]['employees'],
        systemIdPrefix: 'EMP',
        digitCount: 6,
        displayName: 'Nhân viên',
        category: 'hr',
        validation: {
            allowCustomId: true
        },
        usesStoreFactory: true
    },
    'departments': {
        entityType: 'departments',
        prefix: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$smart$2d$prefix$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ENTITY_PREFIXES"]['departments'],
        systemIdPrefix: 'DEPT',
        digitCount: 6,
        displayName: 'Phòng ban',
        category: 'hr',
        validation: {
            allowCustomId: true
        },
        usesStoreFactory: true
    },
    'branches': {
        entityType: 'branches',
        prefix: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$smart$2d$prefix$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ENTITY_PREFIXES"]['branches'],
        systemIdPrefix: 'BRANCH',
        digitCount: 6,
        displayName: 'Chi nhánh',
        category: 'hr',
        validation: {
            allowCustomId: true
        },
        usesStoreFactory: true
    },
    'job-titles': {
        entityType: 'job-titles',
        prefix: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$smart$2d$prefix$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ENTITY_PREFIXES"]['job-titles'],
        systemIdPrefix: 'JOB',
        digitCount: 6,
        displayName: 'Chức vụ',
        category: 'hr',
        validation: {
            allowCustomId: true
        },
        usesStoreFactory: true
    },
    'attendance': {
        entityType: 'attendance',
        prefix: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$smart$2d$prefix$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ENTITY_PREFIXES"]['attendance'],
        systemIdPrefix: 'ATTEND',
        digitCount: 6,
        displayName: 'Chấm công',
        category: 'hr',
        usesStoreFactory: false
    },
    'duty-schedule': {
        entityType: 'duty-schedule',
        prefix: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$smart$2d$prefix$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ENTITY_PREFIXES"]['duty-schedule'],
        systemIdPrefix: 'DUTY',
        digitCount: 6,
        displayName: 'Phân công',
        category: 'hr',
        notes: 'Prefix conflict with "payments" (PC)'
    },
    'payroll': {
        entityType: 'payroll',
        prefix: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$smart$2d$prefix$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ENTITY_PREFIXES"]['payroll'],
        systemIdPrefix: 'PAYROLL',
        digitCount: 6,
        displayName: 'Bảng lương',
        category: 'hr',
        usesStoreFactory: false
    },
    'payslips': {
        entityType: 'payslips',
        prefix: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$smart$2d$prefix$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ENTITY_PREFIXES"]['payslips'],
        systemIdPrefix: 'PAYSLIP',
        digitCount: 6,
        displayName: 'Phiếu lương',
        category: 'hr',
        usesStoreFactory: false,
        notes: 'Sinh từ payroll batch store'
    },
    'payroll-audit-log': {
        entityType: 'payroll-audit-log',
        prefix: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$smart$2d$prefix$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ENTITY_PREFIXES"]['payroll-audit-log'],
        systemIdPrefix: 'PAYROLLLOG',
        digitCount: 6,
        displayName: 'Nhật ký payroll',
        category: 'hr',
        usesStoreFactory: false
    },
    'payroll-templates': {
        entityType: 'payroll-templates',
        prefix: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$smart$2d$prefix$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ENTITY_PREFIXES"]['payroll-templates'],
        systemIdPrefix: 'PAYTPL',
        digitCount: 6,
        displayName: 'Mẫu bảng lương',
        category: 'hr',
        usesStoreFactory: false,
        notes: 'Dùng cho trang template payroll Phase 3'
    },
    'penalties': {
        entityType: 'penalties',
        prefix: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$smart$2d$prefix$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ENTITY_PREFIXES"]['penalties'],
        systemIdPrefix: 'PENALTY',
        digitCount: 6,
        displayName: 'Phiếu phạt',
        category: 'hr',
        usesStoreFactory: true
    },
    'leaves': {
        entityType: 'leaves',
        prefix: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$smart$2d$prefix$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ENTITY_PREFIXES"]['leaves'],
        systemIdPrefix: 'LEAVE',
        digitCount: 6,
        displayName: 'Nghỉ phép',
        category: 'hr',
        usesStoreFactory: true
    },
    // ========================================
    // 👤 CUSTOMERS & PARTNERS (KHÁCH HÀNG)
    // ========================================
    'customers': {
        entityType: 'customers',
        prefix: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$smart$2d$prefix$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ENTITY_PREFIXES"]['customers'],
        systemIdPrefix: 'CUSTOMER',
        digitCount: 6,
        displayName: 'Khách hàng',
        category: 'sales',
        validation: {
            allowCustomId: true
        },
        usesStoreFactory: true
    },
    'suppliers': {
        entityType: 'suppliers',
        prefix: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$smart$2d$prefix$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ENTITY_PREFIXES"]['suppliers'],
        systemIdPrefix: 'SUPPLIER',
        digitCount: 6,
        displayName: 'Nhà cung cấp',
        category: 'purchasing',
        validation: {
            allowCustomId: true
        },
        usesStoreFactory: true
    },
    'shipping-partners': {
        entityType: 'shipping-partners',
        prefix: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$smart$2d$prefix$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ENTITY_PREFIXES"]['shipping-partners'],
        systemIdPrefix: 'SHIPPING',
        digitCount: 6,
        displayName: 'Đơn vị vận chuyển',
        category: 'settings',
        validation: {
            allowCustomId: true
        },
        usesStoreFactory: true
    },
    // ========================================
    // 📦 PRODUCTS & INVENTORY (SẢN PHẨM & KHO)
    // ========================================
    'products': {
        entityType: 'products',
        prefix: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$smart$2d$prefix$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ENTITY_PREFIXES"]['products'],
        systemIdPrefix: 'PRODUCT',
        digitCount: 6,
        displayName: 'Sản phẩm',
        category: 'inventory',
        validation: {
            allowCustomId: true
        },
        usesStoreFactory: true
    },
    'brands': {
        entityType: 'brands',
        prefix: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$smart$2d$prefix$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ENTITY_PREFIXES"]['brands'],
        systemIdPrefix: 'BRAND',
        digitCount: 6,
        displayName: 'Thương hiệu',
        category: 'inventory',
        validation: {
            allowCustomId: true
        },
        usesStoreFactory: true
    },
    'categories': {
        entityType: 'categories',
        prefix: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$smart$2d$prefix$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ENTITY_PREFIXES"]['categories'],
        systemIdPrefix: 'CATEGORY',
        digitCount: 6,
        displayName: 'Danh mục',
        category: 'inventory',
        validation: {
            allowCustomId: true
        },
        usesStoreFactory: true
    },
    'units': {
        entityType: 'units',
        prefix: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$smart$2d$prefix$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ENTITY_PREFIXES"]['units'],
        systemIdPrefix: 'UNIT',
        digitCount: 6,
        displayName: 'Đơn vị tính',
        category: 'inventory',
        validation: {
            allowCustomId: true
        },
        usesStoreFactory: true
    },
    'stock-locations': {
        entityType: 'stock-locations',
        prefix: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$smart$2d$prefix$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ENTITY_PREFIXES"]['stock-locations'],
        systemIdPrefix: 'STOCK',
        digitCount: 6,
        displayName: 'Vị trí kho',
        category: 'inventory',
        validation: {
            allowCustomId: true
        },
        usesStoreFactory: true
    },
    'inventory-receipts': {
        entityType: 'inventory-receipts',
        prefix: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$smart$2d$prefix$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ENTITY_PREFIXES"]['inventory-receipts'],
        systemIdPrefix: 'INVRECEIPT',
        digitCount: 6,
        displayName: 'Nhập kho',
        category: 'inventory',
        usesStoreFactory: true
    },
    'inventory-checks': {
        entityType: 'inventory-checks',
        prefix: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$smart$2d$prefix$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ENTITY_PREFIXES"]['inventory-checks'],
        systemIdPrefix: 'INVCHECK',
        digitCount: 6,
        displayName: 'Phiếu kiểm kho',
        category: 'inventory',
        validation: {
            allowCustomId: true
        },
        usesStoreFactory: true
    },
    'stock-transfers': {
        entityType: 'stock-transfers',
        prefix: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$smart$2d$prefix$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ENTITY_PREFIXES"]['stock-transfers'],
        systemIdPrefix: 'TRANSFER',
        digitCount: 6,
        displayName: 'Phiếu chuyển kho',
        category: 'inventory',
        usesStoreFactory: true,
        notes: 'systemId: TRANSFER000001, Business ID: PCK000001'
    },
    'stock-history': {
        entityType: 'stock-history',
        prefix: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$smart$2d$prefix$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ENTITY_PREFIXES"]['stock-history'],
        systemIdPrefix: 'HISTORY',
        digitCount: 6,
        displayName: 'Lịch sử kho',
        category: 'inventory',
        usesStoreFactory: false
    },
    // ========================================
    // 🛒 SALES (BÁN HÀNG)
    // ========================================
    'orders': {
        entityType: 'orders',
        prefix: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$smart$2d$prefix$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ENTITY_PREFIXES"]['orders'],
        systemIdPrefix: 'ORDER',
        digitCount: 6,
        displayName: 'Đơn hàng',
        category: 'sales',
        validation: {
            allowCustomId: true
        },
        usesStoreFactory: true
    },
    'sales-returns': {
        entityType: 'sales-returns',
        prefix: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$smart$2d$prefix$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ENTITY_PREFIXES"]['sales-returns'],
        systemIdPrefix: 'RETURN',
        digitCount: 6,
        displayName: 'Trả hàng',
        category: 'sales',
        usesStoreFactory: true
    },
    'sales-channels': {
        entityType: 'sales-channels',
        prefix: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$smart$2d$prefix$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ENTITY_PREFIXES"]['sales-channels'],
        systemIdPrefix: 'CHANNEL',
        digitCount: 6,
        displayName: 'Kênh bán hàng',
        category: 'sales',
        usesStoreFactory: true
    },
    'shipments': {
        entityType: 'shipments',
        prefix: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$smart$2d$prefix$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ENTITY_PREFIXES"]['shipments'],
        systemIdPrefix: 'SHIPMENT',
        digitCount: 6,
        displayName: 'Vận chuyển',
        category: 'sales',
        usesStoreFactory: false
    },
    // ========================================
    // 🏭 PURCHASING (MUA HÀNG)
    // ========================================
    'purchase-orders': {
        entityType: 'purchase-orders',
        prefix: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$smart$2d$prefix$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ENTITY_PREFIXES"]['purchase-orders'],
        systemIdPrefix: 'PURCHASE',
        digitCount: 6,
        displayName: 'Đơn mua hàng',
        category: 'purchasing',
        usesStoreFactory: true
    },
    'purchase-returns': {
        entityType: 'purchase-returns',
        prefix: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$smart$2d$prefix$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ENTITY_PREFIXES"]['purchase-returns'],
        systemIdPrefix: 'PRETURN',
        digitCount: 6,
        displayName: 'Trả hàng NCC',
        category: 'purchasing',
        usesStoreFactory: true
    },
    // ========================================
    // 💰 FINANCE (TÀI CHÍNH)
    // ========================================
    'receipts': {
        entityType: 'receipts',
        prefix: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$smart$2d$prefix$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ENTITY_PREFIXES"]['receipts'],
        systemIdPrefix: 'RECEIPT',
        digitCount: 6,
        displayName: 'Phiếu thu',
        category: 'finance',
        usesStoreFactory: true
    },
    'payments': {
        entityType: 'payments',
        prefix: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$smart$2d$prefix$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ENTITY_PREFIXES"]['payments'],
        systemIdPrefix: 'PAYMENT',
        digitCount: 6,
        displayName: 'Phiếu chi',
        category: 'finance',
        usesStoreFactory: true
    },
    'voucher-receipt': {
        entityType: 'voucher-receipt',
        prefix: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$smart$2d$prefix$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ENTITY_PREFIXES"]['voucher-receipt'],
        systemIdPrefix: 'RECEIPT',
        digitCount: 6,
        displayName: 'Phiếu thu (Voucher)',
        category: 'finance',
        usesStoreFactory: true,
        notes: 'Alias dùng cho các workflow voucher-only hoặc màn hình tổng hợp phiếu thu/chi.'
    },
    'voucher-payment': {
        entityType: 'voucher-payment',
        prefix: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$smart$2d$prefix$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ENTITY_PREFIXES"]['voucher-payment'],
        systemIdPrefix: 'PAYMENT',
        digitCount: 6,
        displayName: 'Phiếu chi (Voucher)',
        category: 'finance',
        usesStoreFactory: true,
        notes: 'Alias dùng cho các workflow voucher-only hoặc màn hình tổng hợp phiếu thu/chi.'
    },
    'cashbook': {
        entityType: 'cashbook',
        prefix: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$smart$2d$prefix$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ENTITY_PREFIXES"]['cashbook'],
        systemIdPrefix: 'CASHBOOK',
        digitCount: 6,
        displayName: 'Sổ quỹ tiền mặt',
        category: 'finance',
        usesStoreFactory: false
    },
    'reconciliation': {
        entityType: 'reconciliation',
        prefix: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$smart$2d$prefix$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ENTITY_PREFIXES"]['reconciliation'],
        systemIdPrefix: 'RECON',
        digitCount: 6,
        displayName: 'Đối chiếu',
        category: 'finance',
        usesStoreFactory: false
    },
    // Finance Settings
    'receipt-types': {
        entityType: 'receipt-types',
        prefix: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$smart$2d$prefix$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ENTITY_PREFIXES"]['receipt-types'],
        systemIdPrefix: 'RECTYPE',
        digitCount: 6,
        displayName: 'Loại thu',
        category: 'finance',
        validation: {
            allowCustomId: true
        },
        usesStoreFactory: true
    },
    'payment-types': {
        entityType: 'payment-types',
        prefix: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$smart$2d$prefix$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ENTITY_PREFIXES"]['payment-types'],
        systemIdPrefix: 'PAYTYPE',
        digitCount: 6,
        displayName: 'Loại chi',
        category: 'finance',
        validation: {
            allowCustomId: true
        },
        usesStoreFactory: true
    },
    'cash-accounts': {
        entityType: 'cash-accounts',
        prefix: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$smart$2d$prefix$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ENTITY_PREFIXES"]['cash-accounts'],
        systemIdPrefix: 'ACCOUNT',
        digitCount: 6,
        displayName: 'Tài khoản',
        category: 'finance',
        validation: {
            allowCustomId: true
        },
        usesStoreFactory: true
    },
    'payment-methods': {
        entityType: 'payment-methods',
        prefix: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$smart$2d$prefix$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ENTITY_PREFIXES"]['payment-methods'],
        systemIdPrefix: 'METHOD',
        digitCount: 6,
        displayName: 'Phương thức thanh toán',
        category: 'finance',
        validation: {
            allowCustomId: true
        },
        usesStoreFactory: true
    },
    'pricing-settings': {
        entityType: 'pricing-settings',
        prefix: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$smart$2d$prefix$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ENTITY_PREFIXES"]['pricing-settings'],
        systemIdPrefix: 'PRICING',
        digitCount: 6,
        displayName: 'Cài đặt giá',
        category: 'settings',
        usesStoreFactory: false
    },
    'taxes': {
        entityType: 'taxes',
        prefix: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$smart$2d$prefix$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ENTITY_PREFIXES"]['taxes'],
        systemIdPrefix: 'TAX',
        digitCount: 6,
        displayName: 'Thuế',
        category: 'settings',
        usesStoreFactory: true
    },
    // ========================================
    // 🎯 KPI & TARGETS (MỤC TIÊU)
    // ========================================
    'kpi': {
        entityType: 'kpi',
        prefix: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$smart$2d$prefix$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ENTITY_PREFIXES"]['kpi'],
        systemIdPrefix: 'KPI',
        digitCount: 6,
        displayName: 'KPI',
        category: 'hr',
        usesStoreFactory: false
    },
    'target-groups': {
        entityType: 'target-groups',
        prefix: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$smart$2d$prefix$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ENTITY_PREFIXES"]['target-groups'],
        systemIdPrefix: 'TARGET',
        digitCount: 6,
        displayName: 'Nhóm mục tiêu',
        category: 'settings',
        validation: {
            allowCustomId: true
        },
        usesStoreFactory: true
    },
    'other-targets': {
        entityType: 'other-targets',
        prefix: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$smart$2d$prefix$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ENTITY_PREFIXES"]['other-targets'],
        systemIdPrefix: 'OTHERTARGET',
        digitCount: 6,
        displayName: 'Mục tiêu khác',
        category: 'sales',
        usesStoreFactory: false
    },
    // ========================================
    // CUSTOMER SERVICE (DỊCH VỤ)
    // ========================================
    'internal-tasks': {
        entityType: 'internal-tasks',
        prefix: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$smart$2d$prefix$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ENTITY_PREFIXES"]['internal-tasks'],
        systemIdPrefix: 'TASK',
        digitCount: 6,
        displayName: 'Công việc nội bộ',
        category: 'system',
        usesStoreFactory: true,
        validation: {
            allowCustomId: true
        }
    },
    'task-templates': {
        entityType: 'task-templates',
        prefix: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$smart$2d$prefix$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ENTITY_PREFIXES"]['task-templates'],
        systemIdPrefix: 'TMPL',
        digitCount: 6,
        displayName: 'Mẫu công việc',
        category: 'system',
        usesStoreFactory: false
    },
    'custom-fields': {
        entityType: 'custom-fields',
        prefix: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$smart$2d$prefix$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ENTITY_PREFIXES"]['custom-fields'],
        systemIdPrefix: 'FIELD',
        digitCount: 6,
        displayName: 'Trường tùy chỉnh',
        category: 'settings',
        usesStoreFactory: false
    },
    'warranty': {
        entityType: 'warranty',
        prefix: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$smart$2d$prefix$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ENTITY_PREFIXES"]['warranty'],
        systemIdPrefix: 'WARRANTY',
        digitCount: 6,
        displayName: 'Bảo hành',
        category: 'service',
        usesStoreFactory: true,
        notes: 'systemId: WARRANTY000001, Business ID: BH000001'
    },
    'complaints': {
        entityType: 'complaints',
        prefix: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$smart$2d$prefix$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ENTITY_PREFIXES"]['complaints'],
        systemIdPrefix: 'COMPLAINT',
        digitCount: 6,
        displayName: 'Khiếu nại',
        category: 'service',
        usesStoreFactory: true,
        notes: 'systemId: COMPLAINT000001, Business ID: PKN000001'
    },
    // ========================================
    // ⚙️ SETTINGS & CATEGORIES
    // ========================================
    'provinces': {
        entityType: 'provinces',
        prefix: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$smart$2d$prefix$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ENTITY_PREFIXES"]['provinces'],
        systemIdPrefix: 'PROVINCE',
        digitCount: 6,
        displayName: 'Tỉnh/Thành phố',
        category: 'settings',
        validation: {
            allowCustomId: true
        },
        usesStoreFactory: true
    },
    'districts': {
        entityType: 'districts',
        prefix: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$smart$2d$prefix$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ENTITY_PREFIXES"]['districts'],
        systemIdPrefix: 'DISTRICT',
        digitCount: 6,
        displayName: 'Quận/Huyện',
        category: 'settings',
        validation: {
            allowCustomId: true
        },
        usesStoreFactory: true
    },
    'wards': {
        entityType: 'wards',
        prefix: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$smart$2d$prefix$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ENTITY_PREFIXES"]['wards'],
        systemIdPrefix: 'WARD',
        digitCount: 6,
        displayName: 'Phường/Xã',
        category: 'settings',
        validation: {
            allowCustomId: true
        },
        usesStoreFactory: true
    },
    'wiki': {
        entityType: 'wiki',
        prefix: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$smart$2d$prefix$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ENTITY_PREFIXES"]['wiki'],
        systemIdPrefix: 'WIKI',
        digitCount: 6,
        displayName: 'Tài liệu',
        category: 'system',
        usesStoreFactory: false
    },
    'packaging': {
        entityType: 'packaging',
        prefix: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$smart$2d$prefix$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ENTITY_PREFIXES"]['packaging'],
        systemIdPrefix: 'PACKAGE',
        digitCount: 6,
        displayName: 'Đóng gói',
        category: 'inventory',
        usesStoreFactory: false
    },
    'audit-log': {
        entityType: 'audit-log',
        prefix: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$smart$2d$prefix$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ENTITY_PREFIXES"]['audit-log'],
        systemIdPrefix: 'LOG',
        digitCount: 10,
        displayName: 'Nhật ký',
        category: 'system',
        usesStoreFactory: false
    },
    // Customer Settings
    'customer-types': {
        entityType: 'customer-types',
        prefix: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$smart$2d$prefix$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ENTITY_PREFIXES"]['customer-types'],
        systemIdPrefix: 'CUSTTYPE',
        digitCount: 6,
        displayName: 'Loại khách hàng',
        category: 'settings',
        usesStoreFactory: false
    },
    'customer-groups': {
        entityType: 'customer-groups',
        prefix: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$smart$2d$prefix$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ENTITY_PREFIXES"]['customer-groups'],
        systemIdPrefix: 'CUSTGROUP',
        digitCount: 6,
        displayName: 'Nhóm khách hàng',
        category: 'settings',
        usesStoreFactory: false
    },
    'customer-sources': {
        entityType: 'customer-sources',
        prefix: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$smart$2d$prefix$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ENTITY_PREFIXES"]['customer-sources'],
        systemIdPrefix: 'CUSTSOURCE',
        digitCount: 6,
        displayName: 'Nguồn khách hàng',
        category: 'settings',
        usesStoreFactory: false
    },
    'payment-terms': {
        entityType: 'payment-terms',
        prefix: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$smart$2d$prefix$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ENTITY_PREFIXES"]['payment-terms'],
        systemIdPrefix: 'PAYTERM',
        digitCount: 6,
        displayName: 'Hình thức thanh toán',
        category: 'settings',
        usesStoreFactory: false
    },
    'credit-ratings': {
        entityType: 'credit-ratings',
        prefix: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$smart$2d$prefix$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ENTITY_PREFIXES"]['credit-ratings'],
        systemIdPrefix: 'CREDIT',
        digitCount: 6,
        displayName: 'Xếp hạng tín dụng',
        category: 'settings',
        usesStoreFactory: false
    },
    'lifecycle-stages': {
        entityType: 'lifecycle-stages',
        prefix: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$smart$2d$prefix$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ENTITY_PREFIXES"]['lifecycle-stages'],
        systemIdPrefix: 'LIFECYCLE',
        digitCount: 6,
        displayName: 'Giai đoạn vòng đời khách hàng',
        category: 'sales',
        validation: {
            allowCustomId: true
        },
        usesStoreFactory: true
    },
    'sla-settings': {
        entityType: 'sla-settings',
        prefix: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$smart$2d$prefix$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ENTITY_PREFIXES"]['sla-settings'],
        systemIdPrefix: 'SLACFG',
        digitCount: 6,
        displayName: 'Cài đặt SLA khách hàng',
        category: 'sales',
        validation: {
            allowCustomId: true
        },
        usesStoreFactory: true
    },
    // Employee Settings
    'employee-types': {
        entityType: 'employee-types',
        prefix: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$smart$2d$prefix$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ENTITY_PREFIXES"]['employee-types'],
        systemIdPrefix: 'EMPTYPE',
        digitCount: 6,
        displayName: 'Loại nhân viên',
        category: 'settings',
        usesStoreFactory: false
    },
    'employee-statuses': {
        entityType: 'employee-statuses',
        prefix: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$smart$2d$prefix$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ENTITY_PREFIXES"]['employee-statuses'],
        systemIdPrefix: 'EMPSTATUS',
        digitCount: 6,
        displayName: 'Trạng thái nhân viên',
        category: 'settings',
        usesStoreFactory: false
    },
    'contract-types': {
        entityType: 'contract-types',
        prefix: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$smart$2d$prefix$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ENTITY_PREFIXES"]['contract-types'],
        systemIdPrefix: 'CONTRACT',
        digitCount: 6,
        displayName: 'Loại hợp đồng',
        category: 'settings',
        usesStoreFactory: false
    },
    'work-shifts': {
        entityType: 'work-shifts',
        prefix: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$smart$2d$prefix$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ENTITY_PREFIXES"]['work-shifts'],
        systemIdPrefix: 'WSHIFT',
        digitCount: 6,
        displayName: 'Ca làm việc',
        category: 'settings',
        usesStoreFactory: false,
        notes: 'Dùng cho cài đặt ca làm việc & Dual ID trong attendance'
    },
    'leave-types': {
        entityType: 'leave-types',
        prefix: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$smart$2d$prefix$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ENTITY_PREFIXES"]['leave-types'],
        systemIdPrefix: 'LEAVETYPE',
        digitCount: 6,
        displayName: 'Loại nghỉ phép',
        category: 'settings',
        usesStoreFactory: false,
        notes: 'Quản lý danh mục phép năm/phép đặc biệt'
    },
    'salary-components': {
        entityType: 'salary-components',
        prefix: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$smart$2d$prefix$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ENTITY_PREFIXES"]['salary-components'],
        systemIdPrefix: 'SALCOMP',
        digitCount: 6,
        displayName: 'Thành phần lương',
        category: 'settings',
        usesStoreFactory: false,
        notes: 'Dùng cho cấu hình payroll engine'
    },
    // ========================================
    // 🔐 SYSTEM & AUTH
    // ========================================
    'settings': {
        entityType: 'settings',
        prefix: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$smart$2d$prefix$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ENTITY_PREFIXES"]['settings'],
        systemIdPrefix: 'CONFIG',
        digitCount: 6,
        displayName: 'Cấu hình',
        category: 'system',
        usesStoreFactory: false
    },
    'users': {
        entityType: 'users',
        prefix: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$smart$2d$prefix$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ENTITY_PREFIXES"]['users'],
        systemIdPrefix: 'USER',
        digitCount: 6,
        displayName: 'Người dùng',
        category: 'system',
        usesStoreFactory: false
    }
};
function getEntityConfig(entityType) {
    const config = ID_CONFIG[entityType];
    if (!config) {
        throw new Error(`No configuration found for entity type: ${entityType}`);
    }
    return config;
}
function getEntitiesByCategory(category) {
    return Object.values(ID_CONFIG).filter((config)=>config.category === category).map((config)=>config.entityType);
}
function getEntityCategories() {
    const categories = {
        'hr': [],
        'finance': [],
        'inventory': [],
        'sales': [],
        'purchasing': [],
        'service': [],
        'settings': [],
        'system': []
    };
    Object.values(ID_CONFIG).forEach((config)=>{
        categories[config.category].push(config.entityType);
    });
    return categories;
}
function validateIdFormat(id, entityType) {
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
    return {
        valid: true
    };
}
function allowsCustomId(entityType) {
    return getEntityConfig(entityType).validation?.allowCustomId ?? false;
}
function getStoreFactoryEntities() {
    return Object.values(ID_CONFIG).filter((config)=>config.usesStoreFactory === true).map((config)=>config.entityType);
}
function getCategoryLabel(category) {
    const labels = {
        'hr': 'Nhân sự & Tổ chức',
        'finance': 'Tài chính',
        'inventory': 'Kho hàng',
        'sales': 'Bán hàng',
        'purchasing': 'Mua hàng',
        'service': 'Dịch vụ khách hàng',
        'settings': 'Cài đặt',
        'system': 'Hệ thống'
    };
    return labels[category];
}
function searchEntities(query) {
    const lowerQuery = query.toLowerCase();
    return Object.values(ID_CONFIG).filter((config)=>config.displayName.toLowerCase().includes(lowerQuery) || config.prefix.toLowerCase().includes(lowerQuery) || config.entityType.includes(lowerQuery));
}
function getTotalEntityCount() {
    return Object.keys(ID_CONFIG).length;
}
function exportConfig() {
    return JSON.stringify(ID_CONFIG, null, 2);
}
function getIDSystemStats() {
    const configs = Object.values(ID_CONFIG);
    const byCategory = {};
    let storeFactoryEnabled = 0;
    let customIdAllowed = 0;
    let totalDigits = 0;
    configs.forEach((config)=>{
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
        averageDigitCount: Math.round(totalDigits / configs.length * 10) / 10
    };
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/id-utils.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "extractCounterFromBusinessId",
    ()=>extractCounterFromBusinessId,
    "extractCounterFromSystemId",
    ()=>extractCounterFromSystemId,
    "findNextAvailableBusinessId",
    ()=>findNextAvailableBusinessId,
    "formatIdForDisplay",
    ()=>formatIdForDisplay,
    "generateBusinessId",
    ()=>generateBusinessId,
    "generateSuggestedIds",
    ()=>generateSuggestedIds,
    "generateSystemId",
    ()=>generateSystemId,
    "getMaxBusinessIdCounter",
    ()=>getMaxBusinessIdCounter,
    "getMaxSystemIdCounter",
    ()=>getMaxSystemIdCounter,
    "isBusinessIdUnique",
    ()=>isBusinessIdUnique,
    "isValidIdFormat",
    ()=>isValidIdFormat,
    "sanitizeBusinessId",
    ()=>sanitizeBusinessId
]);
/**
 * ID Utilities
 * Helpers for generating and validating IDs (systemId & business id)
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$smart$2d$prefix$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/smart-prefix.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/id-config.ts [app-client] (ecmascript)");
;
;
function generateSystemId(entityType, counter) {
    const config = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ID_CONFIG"][entityType];
    if (!config) {
        throw new Error(`No configuration found for entity type: ${entityType}`);
    }
    const prefix = config.systemIdPrefix;
    const digitCount = config.digitCount || 6;
    return `${prefix}${String(counter).padStart(digitCount, '0')}`;
}
function generateBusinessId(entityType, counter, customId) {
    // If user provided custom ID, validate and return it
    if (customId && customId.trim()) {
        const sanitized = sanitizeBusinessId(customId);
        if (!sanitized) {
            throw new Error('Mã không hợp lệ! Chỉ được phép sử dụng chữ cái và số.');
        }
        return sanitized;
    }
    // Otherwise, auto-generate
    const prefix = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$smart$2d$prefix$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getPrefix"])(entityType);
    return `${prefix}${String(counter).padStart(6, '0')}`;
}
function sanitizeBusinessId(id) {
    if (!id || typeof id !== 'string') return null;
    // Remove all special characters, keep only alphanumeric
    const cleaned = id.trim().replace(/[^a-zA-Z0-9]/g, '');
    if (!cleaned) return null;
    // Convert to uppercase for consistency
    return cleaned.toUpperCase();
}
function isBusinessIdUnique(id, existingIds, currentId) {
    if (!id) return false;
    const normalizedId = id.toUpperCase();
    const normalizedCurrentId = currentId?.toUpperCase();
    return !existingIds.some((existingId)=>{
        // ✅ Filter out empty/undefined IDs
        if (!existingId || existingId.trim() === '') return false;
        const normalizedExisting = existingId.toUpperCase();
        // Skip self-comparison in edit mode
        if (normalizedCurrentId && normalizedExisting === normalizedCurrentId) {
            return false;
        }
        return normalizedExisting === normalizedId;
    });
}
function extractCounterFromSystemId(systemId, prefix) {
    if (!systemId || typeof systemId !== 'string') return 0;
    // Try different digit counts (most entities use 6 digits, some use 7-8)
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
function extractCounterFromBusinessId(businessId, prefix) {
    if (!businessId || typeof businessId !== 'string') return 0;
    const regex = new RegExp(`^${prefix}(\\d+)$`);
    const match = businessId.match(regex);
    return match ? parseInt(match[1], 10) : 0;
}
function getMaxSystemIdCounter(items, prefix) {
    if (!items || !Array.isArray(items)) return 0;
    let maxCounter = 0;
    items.forEach((item)=>{
        if (!item || !item.systemId) return;
        const counter = extractCounterFromSystemId(item.systemId, prefix);
        if (counter > maxCounter) {
            maxCounter = counter;
        }
    });
    return maxCounter;
}
function getMaxBusinessIdCounter(items, prefix) {
    if (!items || !Array.isArray(items)) return 0;
    let maxCounter = 0;
    items.forEach((item)=>{
        if (!item || !item.id) return;
        const counter = extractCounterFromBusinessId(item.id, prefix);
        if (counter > maxCounter) {
            maxCounter = counter;
        }
    });
    return maxCounter;
}
function formatIdForDisplay(id) {
    // Match pattern: PREFIX followed by numbers
    const match = id.match(/^([A-Z]+)(\d+)$/);
    if (!match) return id;
    const [, prefix, numbers] = match;
    return `${prefix}-${numbers}`;
}
function isValidIdFormat(id) {
    if (!id || typeof id !== 'string') return false;
    // Only alphanumeric characters allowed
    const regex = /^[A-Z0-9]+$/i;
    return regex.test(id);
}
function generateSuggestedIds(entityType, counter, count = 3) {
    const suggestions = [];
    const prefix = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$smart$2d$prefix$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getPrefix"])(entityType);
    for(let i = 0; i < count; i++){
        suggestions.push(`${prefix}${String(counter + i + 1).padStart(6, '0')}`);
    }
    return suggestions;
}
function findNextAvailableBusinessId(prefix, existingIds, startCounter, digitCount = 6) {
    let counter = startCounter;
    let nextId;
    // Keep incrementing until we find a unique ID
    do {
        counter++;
        nextId = `${prefix}${String(counter).padStart(digitCount, '0')}`;
    }while (existingIds.some((id)=>id === nextId))
    return {
        nextId,
        updatedCounter: counter
    };
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/store-factory.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "createCrudStore",
    ()=>createCrudStore
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/zustand/esm/react.mjs [app-client] (ecmascript)");
// persist, createJSONStorage removed - database is now source of truth
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/id-utils.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$smart$2d$prefix$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/smart-prefix.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/id-config.ts [app-client] (ecmascript)");
;
;
;
;
const SYSTEM_FALLBACK_ID = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createSystemId"])('SYS000000');
const asSystemIdFallback = ()=>SYSTEM_FALLBACK_ID;
// ✅ API Sync helper for store-factory
async function syncToAPI(apiEndpoint, action, data, systemId) {
    try {
        const endpoint = action === 'create' ? apiEndpoint : `${apiEndpoint}/${systemId || data.systemId}`;
        const method = action === 'create' ? 'POST' : action === 'update' ? 'PATCH' : action === 'delete' ? 'DELETE' : 'PATCH'; // restore uses PATCH
        const response = await fetch(endpoint, {
            method,
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: action !== 'delete' ? JSON.stringify(data) : undefined
        });
        if (!response.ok) {
            console.warn(`[Store Factory API] ${action} failed for ${apiEndpoint}:`, response.status);
        }
        return response.ok;
    } catch (error) {
        console.error(`[Store Factory API] ${action} error for ${apiEndpoint}:`, error);
        return false;
    }
}
const createCrudStore = (_initialData, entityType, options)=>{
    const businessPrefix = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$smart$2d$prefix$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getPrefix"])(entityType); // Vietnamese prefix for Business ID (NV, KH, DH)
    const config = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ID_CONFIG"][entityType];
    const systemIdPrefix = config?.systemIdPrefix || entityType.toUpperCase(); // English prefix for SystemId (EMP, CUSTOMER, ORDER)
    const businessIdField = options?.businessIdField ?? 'id';
    // const persistKey = options?.persistKey; // @deprecated - No longer used
    const getCurrentUser = options?.getCurrentUser;
    const apiEndpoint = options?.apiEndpoint;
    // ✅ CHANGED: Start with empty array - database is source of truth
    // Mock data files (data.ts) are NO LONGER USED for runtime
    const normalizedInitialData = [];
    const storeConfig = (set, get)=>({
            data: normalizedInitialData,
            // ✅ Counters start at 0 - will be initialized from API via loadFromAPI()
            _counters: {
                systemId: 0,
                businessId: 0
            },
            _initialized: false,
            add: (item)=>{
                // ✅ Get counters from state (persisted)
                const currentCounters = get()._counters;
                const newSystemIdCounter = currentCounters.systemId + 1;
                const newSystemId = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createSystemId"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["generateSystemId"])(entityType, newSystemIdCounter));
                // Generate or validate Business ID (if field exists)
                let finalItem = {
                    ...item
                };
                let newBusinessIdCounter = currentCounters.businessId;
                if (businessIdField in item) {
                    const customId = item[businessIdField];
                    const existingIds = get().data.map((d)=>d[businessIdField]);
                    // ✅ If customId provided, validate uniqueness
                    if (customId && customId.trim()) {
                        if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isBusinessIdUnique"])(customId, existingIds)) {
                            throw new Error(`Mã "${customId}" đã tồn tại! Vui lòng sử dụng mã khác.`);
                        }
                        finalItem[businessIdField] = customId.trim().toUpperCase();
                    } else {
                        // ✅ Auto-generate with findNextAvailableBusinessId
                        const digitCount = 6; // All entities use 6 digits
                        const result = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["findNextAvailableBusinessId"])(businessPrefix, existingIds, newBusinessIdCounter, digitCount);
                        finalItem[businessIdField] = result.nextId;
                        newBusinessIdCounter = result.updatedCounter;
                    }
                }
                const now = new Date().toISOString();
                const currentUser = getCurrentUser?.();
                const newItem = {
                    ...finalItem,
                    systemId: newSystemId,
                    createdAt: finalItem.createdAt || now,
                    updatedAt: now,
                    createdBy: finalItem.createdBy || currentUser,
                    updatedBy: currentUser
                };
                // ✅ Update both data and counters atomically
                set((state)=>({
                        data: [
                            ...state.data,
                            newItem
                        ],
                        _counters: {
                            systemId: newSystemIdCounter,
                            businessId: newBusinessIdCounter
                        }
                    }));
                // ✅ Sync to API in background
                if (apiEndpoint) {
                    syncToAPI(apiEndpoint, 'create', newItem).catch(console.error);
                }
                return newItem;
            },
            addMultiple: (items)=>set((state)=>{
                    const now = new Date().toISOString();
                    const currentUser = getCurrentUser?.();
                    const newItems = [];
                    const digitCount = 6; // All entities use 6 digits
                    // ✅ Start from current counters
                    let currentSystemIdCounter = state._counters.systemId;
                    let currentBusinessIdCounter = state._counters.businessId;
                    items.forEach((item)=>{
                        // ✅ Generate SystemId from current counter
                        currentSystemIdCounter++;
                        const newSystemId = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createSystemId"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["generateSystemId"])(entityType, currentSystemIdCounter));
                        // Generate or validate Business ID (if field exists)
                        let finalItem = {
                            ...item
                        };
                        if (businessIdField in item) {
                            const customId = item[businessIdField];
                            // Collect existing IDs (from state + already added in this batch)
                            const existingIds = [
                                ...state.data.map((d)=>d[businessIdField]),
                                ...newItems.map((d)=>d[businessIdField])
                            ];
                            // ✅ If customId provided, validate uniqueness
                            if (customId && customId.trim()) {
                                if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isBusinessIdUnique"])(customId, existingIds)) {
                                    throw new Error(`Mã "${customId}" đã tồn tại! Vui lòng sử dụng mã khác.`);
                                }
                                finalItem[businessIdField] = customId.trim().toUpperCase();
                            } else {
                                // ✅ Auto-generate with findNextAvailableBusinessId
                                const result = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["findNextAvailableBusinessId"])(businessPrefix, existingIds, currentBusinessIdCounter, digitCount);
                                finalItem[businessIdField] = result.nextId;
                                currentBusinessIdCounter = result.updatedCounter;
                            }
                        }
                        newItems.push({
                            ...finalItem,
                            systemId: newSystemId,
                            createdAt: now,
                            updatedAt: now,
                            createdBy: currentUser,
                            updatedBy: currentUser
                        });
                    });
                    // ✅ Update both data and counters
                    const result = {
                        data: [
                            ...state.data,
                            ...newItems
                        ],
                        _counters: {
                            systemId: currentSystemIdCounter,
                            businessId: currentBusinessIdCounter
                        }
                    };
                    // ✅ Sync to API in background (batch)
                    if (apiEndpoint) {
                        newItems.forEach((item)=>{
                            syncToAPI(apiEndpoint, 'create', item).catch(console.error);
                        });
                    }
                    return result;
                }),
            update: (systemId, updatedItem)=>{
                // Validate unique business ID (case-insensitive, skip self)
                if (businessIdField in updatedItem) {
                    const businessId = updatedItem[businessIdField];
                    const existingIds = get().data.filter((d)=>d.systemId !== systemId).map((d)=>d[businessIdField]);
                    if (businessId && !(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isBusinessIdUnique"])(businessId, existingIds)) {
                        throw new Error(`Mã "${businessId}" đã tồn tại! Vui lòng sử dụng mã khác.`);
                    }
                }
                const now = new Date().toISOString();
                const currentUser = getCurrentUser?.();
                set((state)=>({
                        data: state.data.map((item)=>item.systemId === systemId ? {
                                ...item,
                                ...updatedItem,
                                updatedAt: now,
                                updatedBy: currentUser
                            } : item)
                    }));
                // ✅ Sync to API in background
                if (apiEndpoint) {
                    const fullItem = get().data.find((item)=>item.systemId === systemId);
                    if (fullItem) {
                        syncToAPI(apiEndpoint, 'update', fullItem, systemId).catch(console.error);
                    }
                }
            },
            remove: (systemId)=>{
                // Soft delete - mark as deleted
                const now = new Date().toISOString();
                set((state)=>({
                        data: state.data.map((item)=>item.systemId === systemId ? {
                                ...item,
                                isDeleted: true,
                                deletedAt: now
                            } : item)
                    }));
                // ✅ Sync to API in background
                if (apiEndpoint) {
                    const item = get().data.find((item)=>item.systemId === systemId);
                    if (item) {
                        syncToAPI(apiEndpoint, 'update', {
                            ...item,
                            isDeleted: true,
                            deletedAt: now
                        }, systemId).catch(console.error);
                    }
                }
            },
            hardDelete: (systemId)=>{
                // Permanent delete - remove from array
                set((state)=>({
                        data: state.data.filter((item)=>item.systemId !== systemId)
                    }));
                // ✅ Sync to API in background
                if (apiEndpoint) {
                    syncToAPI(apiEndpoint, 'delete', {
                        systemId
                    }, systemId).catch(console.error);
                }
            },
            restore: (systemId)=>{
                // Restore soft-deleted item
                set((state)=>({
                        data: state.data.map((item)=>item.systemId === systemId ? {
                                ...item,
                                isDeleted: false,
                                deletedAt: null
                            } : item)
                    }));
                // ✅ Sync to API in background
                if (apiEndpoint) {
                    const item = get().data.find((item)=>item.systemId === systemId);
                    if (item) {
                        syncToAPI(apiEndpoint, 'restore', {
                            ...item,
                            isDeleted: false,
                            deletedAt: null
                        }, systemId).catch(console.error);
                    }
                }
            },
            getActive: ()=>get().data.filter((item)=>!item.isDeleted),
            getDeleted: ()=>get().data.filter((item)=>item.isDeleted),
            findById: (id)=>get().data.find((item)=>item.systemId === id || item.id === id),
            // ✅ Load data from database API - OPTIMIZED: No more limit=10000!
            // This is now only used for counter initialization, NOT for loading all data
            // Use React Query hooks for data fetching with proper pagination
            loadFromAPI: async ()=>{
                if (!apiEndpoint) return;
                if (get()._initialized) return;
                try {
                    // Only fetch minimal data needed to initialize counters
                    // Actual data loading should be done via React Query hooks
                    const response = await fetch(`${apiEndpoint}?limit=1&sortBy=systemId&sortOrder=desc`, {
                        credentials: 'include'
                    });
                    if (response.ok) {
                        const json = await response.json();
                        const pagination = json.pagination || {};
                        const lastItem = json.data?.[0];
                        // Initialize counters from the latest item (highest IDs)
                        const newCounters = {
                            systemId: lastItem ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getMaxSystemIdCounter"])([
                                lastItem
                            ], systemIdPrefix) : 0,
                            businessId: lastItem && options?.businessIdField ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getMaxBusinessIdCounter"])([
                                lastItem
                            ], businessPrefix) : 0
                        };
                        set({
                            data: [],
                            _counters: newCounters,
                            _initialized: true
                        });
                        console.log(`[Store Factory] ${apiEndpoint} initialized. Total records: ${pagination.total || 'unknown'}`);
                    }
                } catch (error) {
                    console.error(`[Store Factory] loadFromAPI error for ${apiEndpoint}:`, error);
                    // Still mark as initialized to prevent infinite retry
                    set({
                        _initialized: true
                    });
                }
            }
        });
    // ✅ SIMPLIFIED: No localStorage persistence, database is source of truth
    // Data is loaded via ApiSyncProvider on app init
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["create"])(storeConfig);
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/seed-audit.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "DEFAULT_SEED_AUTHOR",
    ()=>DEFAULT_SEED_AUTHOR,
    "buildSeedAuditFields",
    ()=>buildSeedAuditFields
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/id-types.ts [app-client] (ecmascript)");
;
const DEFAULT_SEED_AUTHOR = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])('EMP000001');
const buildSeedAuditFields = ({ createdAt, createdBy = DEFAULT_SEED_AUTHOR, updatedAt, updatedBy })=>({
        createdAt,
        updatedAt: updatedAt ?? createdAt,
        createdBy,
        updatedBy: updatedBy ?? createdBy
    });
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/activity-history-helper.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Activity History Helper
 * 
 * Helper để tạo các entry lịch sử hoạt động một cách nhất quán
 * Dùng chung cho tất cả các modules trong hệ thống
 * 
 * NOTE: Đã remove import useEmployeeStore để tránh circular dependency
 * và cải thiện compile time
 */ __turbopack_context__.s([
    "appendHistoryEntry",
    ()=>appendHistoryEntry,
    "createAssignedEntry",
    ()=>createAssignedEntry,
    "createBulkUpdateEntries",
    ()=>createBulkUpdateEntries,
    "createCancelledEntry",
    ()=>createCancelledEntry,
    "createCommentEntry",
    ()=>createCommentEntry,
    "createCreatedEntry",
    ()=>createCreatedEntry,
    "createDeletedEntry",
    ()=>createDeletedEntry,
    "createEndedEntry",
    ()=>createEndedEntry,
    "createHistoryEntry",
    ()=>createHistoryEntry,
    "createPaymentEntry",
    ()=>createPaymentEntry,
    "createProductEntry",
    ()=>createProductEntry,
    "createReopenedEntry",
    ()=>createReopenedEntry,
    "createStatusChangedEntry",
    ()=>createStatusChangedEntry,
    "createUpdatedEntry",
    ()=>createUpdatedEntry,
    "createVerifiedEntry",
    ()=>createVerifiedEntry,
    "getCurrentUserInfo",
    ()=>getCurrentUserInfo,
    "getEmployeeInfo",
    ()=>getEmployeeInfo,
    "getEmployeeInfoFromData",
    ()=>getEmployeeInfoFromData
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$contexts$2f$auth$2d$context$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/contexts/auth-context.tsx [app-client] (ecmascript)");
;
function getCurrentUserInfo() {
    const authInfo = (0, __TURBOPACK__imported__module__$5b$project$5d2f$contexts$2f$auth$2d$context$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getCurrentUserInfo"])();
    return {
        systemId: authInfo.systemId || 'SYSTEM',
        name: authInfo.name || 'Hệ thống',
        avatar: undefined
    };
}
function getEmployeeInfoFromData(employeeSystemId, employees) {
    const employee = employees.find((e)=>e.systemId === employeeSystemId);
    if (employee) {
        return {
            systemId: employee.systemId,
            name: employee.fullName,
            avatar: employee.avatarUrl
        };
    }
    // Fallback to system
    return {
        systemId: String(employeeSystemId) || 'SYSTEM',
        name: 'Hệ thống'
    };
}
function getEmployeeInfo(employeeSystemId) {
    // Return minimal info without employee store lookup
    return {
        systemId: String(employeeSystemId) || 'SYSTEM',
        name: 'Hệ thống'
    };
}
function createHistoryEntry(action, userOrDescription, descriptionOrMetadata, metadata) {
    const hasUserObject = typeof userOrDescription === 'object' && userOrDescription !== null;
    const user = hasUserObject ? userOrDescription : getCurrentUserInfo();
    const description = hasUserObject ? descriptionOrMetadata : userOrDescription;
    const meta = hasUserObject ? metadata : descriptionOrMetadata;
    return {
        id: `history-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        action,
        timestamp: new Date(),
        user: {
            systemId: user.systemId,
            name: user.name,
            avatar: user.avatar
        },
        description: description ?? '',
        metadata: meta
    };
}
function createCreatedEntry(user, description) {
    return createHistoryEntry('created', user, description);
}
function createUpdatedEntry(user, description) {
    return createHistoryEntry('updated', user, description);
}
function createStatusChangedEntry(user, oldStatus, newStatus, description) {
    return createHistoryEntry('status_changed', user, description, {
        field: 'status',
        oldValue: oldStatus,
        newValue: newStatus
    });
}
function createDeletedEntry(user, description) {
    return createHistoryEntry('deleted', user, description);
}
function createAssignedEntry(user, description) {
    return createHistoryEntry('assigned', user, description);
}
function createPaymentEntry(user, description) {
    return createHistoryEntry('payment_made', user, description);
}
function createCommentEntry(user, description) {
    return createHistoryEntry('comment_added', user, description);
}
function createCancelledEntry(user, description) {
    return createHistoryEntry('cancelled', user, description);
}
function createVerifiedEntry(user, description) {
    return createHistoryEntry('verified', user, description);
}
function createEndedEntry(user, description) {
    return createHistoryEntry('ended', user, description);
}
function createReopenedEntry(user, description) {
    return createHistoryEntry('reopened', user, description);
}
function createProductEntry(user, action, description) {
    return createHistoryEntry(action, user, description);
}
function appendHistoryEntry(existingHistory, ...newEntries) {
    return [
        ...existingHistory || [],
        ...newEntries
    ];
}
function createBulkUpdateEntries(user, changes) {
    return changes.map((change)=>createHistoryEntry('updated', user, change.description));
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/breadcrumb-generator.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "clearBreadcrumbStores",
    ()=>clearBreadcrumbStores,
    "generateBreadcrumb",
    ()=>generateBreadcrumb,
    "generateDetailBreadcrumb",
    ()=>generateDetailBreadcrumb,
    "generateFormBreadcrumb",
    ()=>generateFormBreadcrumb,
    "getEntityDisplayInfo",
    ()=>getEntityDisplayInfo,
    "getRegisteredStores",
    ()=>getRegisteredStores,
    "registerBreadcrumbStore",
    ()=>registerBreadcrumbStore,
    "useBreadcrumb",
    ()=>useBreadcrumb
]);
/**
 * 🍞 BREADCRUMB AUTO-GENERATION SYSTEM
 * 
 * Automatically generates breadcrumbs from route metadata + entity data
 * 
 * Features:
 * - Auto-lookup entity name from systemId
 * - Falls back to route metadata if entity not found
 * - Type-safe with SystemId branded types
 * - Supports all entity types from id-config.ts
 * 
 * @example
 * ```typescript
 * // Route: /receipts/VOUCHER00000123
 * const crumbs = generateBreadcrumb(location.pathname);
 * // Result: ['Phiếu thu/chi', 'PT000051']
 * ```
 * 
 * @version 1.0.0
 * @date 2025-11-11
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/id-config.ts [app-client] (ecmascript)");
;
let storeRegistry = {};
function registerBreadcrumbStore(entityType, getStore) {
    storeRegistry[entityType] = getStore;
}
/**
 * Find entity by systemId and return display name
 */ function findEntityDisplayName(entityType, systemId) {
    const getStore = storeRegistry[entityType];
    if (!getStore) return null;
    try {
        const store = getStore();
        const item = store.data.find((d)=>d.systemId === systemId);
        if (!item) return null;
        // Priority: name > title > id (business ID) > systemId
        return item.name || item.title || item.id || systemId;
    } catch (error) {
        console.warn(`[Breadcrumb] Failed to lookup ${entityType}:`, error);
        return null;
    }
}
function parseRouteEntity(pathname) {
    // Pattern: /{entity-type}/{systemId}
    const match = pathname.match(/^\/([^/]+)\/([^/]+)$/);
    if (!match) {
        return {
            entityType: null,
            systemId: null,
            displayName: null
        };
    }
    const [, routeType, id] = match;
    // Map route type to entity type
    const routeToEntityMap = {
        'receipts': 'voucher-receipt',
        'payments': 'voucher-payment',
        'employees': 'employees',
        'customers': 'customers',
        'products': 'products',
        'orders': 'orders',
        'suppliers': 'suppliers',
        'complaints': 'complaints',
        'warranty': 'warranty',
        'purchase-orders': 'purchase-orders',
        'sales-returns': 'sales-returns',
        'purchase-returns': 'purchase-returns',
        'inventory-checks': 'inventory-checks'
    };
    const entityType = routeToEntityMap[routeType] || null;
    if (!entityType) {
        return {
            entityType: null,
            systemId: id,
            displayName: null
        };
    }
    // Lookup display name
    const displayName = findEntityDisplayName(entityType, id);
    return {
        entityType,
        systemId: id,
        displayName
    };
}
function generateBreadcrumb(pathname, routeMeta) {
    // If route has static breadcrumb metadata, use it as base
    const baseCrumbs = routeMeta?.breadcrumb || [];
    // Try to enhance with entity data
    const entityInfo = parseRouteEntity(pathname);
    if (entityInfo.displayName) {
        // Replace last breadcrumb with entity display name
        return [
            ...baseCrumbs.slice(0, -1),
            entityInfo.displayName
        ];
    }
    // Fallback to route metadata
    return baseCrumbs;
}
function generateDetailBreadcrumb(entityType, systemId, listPageLabel) {
    const displayName = findEntityDisplayName(entityType, systemId);
    return [
        listPageLabel,
        displayName || systemId
    ];
}
function generateFormBreadcrumb(entityType, systemId, listPageLabel) {
    if (!systemId) {
        return [
            listPageLabel,
            'Thêm mới'
        ];
    }
    const displayName = findEntityDisplayName(entityType, systemId);
    return [
        listPageLabel,
        displayName || 'Chỉnh sửa'
    ];
}
function useBreadcrumb(entityType, systemId, listPageLabel) {
    if (!systemId) {
        return [
            listPageLabel,
            'Thêm mới'
        ];
    }
    return generateDetailBreadcrumb(entityType, systemId, listPageLabel);
}
function getEntityDisplayInfo(entityType) {
    try {
        const config = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getEntityConfig"])(entityType);
        return {
            displayName: config.displayName,
            prefix: config.prefix,
            category: config.category
        };
    } catch  {
        return null;
    }
}
function clearBreadcrumbStores() {
    storeRegistry = {};
}
function getRegisteredStores() {
    return Object.keys(storeRegistry);
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/api-config.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * API Configuration Utilities
 * 
 * Centralized configuration for API endpoints.
 * All API URLs should use these utilities instead of hardcoding.
 */ /**
 * Get the API base URL from environment variables
 * Falls back to localhost:3001 for development
 */ __turbopack_context__.s([
    "getApiBaseUrl",
    ()=>getApiBaseUrl,
    "getApiUrl",
    ()=>getApiUrl,
    "getBaseUrl",
    ()=>getBaseUrl,
    "getFileUrl",
    ()=>getFileUrl
]);
const __TURBOPACK__import$2e$meta__ = {
    get url () {
        return `file://${__turbopack_context__.P("lib/api-config.ts")}`;
    }
};
function getApiBaseUrl() {
    // Use relative path to leverage Vite proxy in development
    // This avoids CORS issues when frontend (5173) talks to backend (3001)
    if (__TURBOPACK__import$2e$meta__.env?.DEV) {
        return '/api';
    }
    return __TURBOPACK__import$2e$meta__.env?.VITE_API_BASE_URL || 'http://localhost:3001/api';
}
function getBaseUrl() {
    const apiUrl = getApiBaseUrl();
    return apiUrl.replace('/api', '');
}
function getFileUrl(relativePath) {
    if (!relativePath) return '';
    // If already a full URL, return as is
    if (relativePath.startsWith('http://') || relativePath.startsWith('https://')) {
        return relativePath;
    }
    // Build full URL
    const baseUrl = getBaseUrl();
    return `${baseUrl}${relativePath}`;
}
function getApiUrl(endpoint) {
    const apiBaseUrl = getApiBaseUrl();
    return `${apiBaseUrl}${endpoint}`;
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/ghtk-constants.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * GHTK Status Mapping & Constants
 * Based on GHTK API documentation: https://api.ghtk.vn/docs/submit-order/webhook
 */ __turbopack_context__.s([
    "GHTK_REASON_MAP",
    ()=>GHTK_REASON_MAP,
    "GHTK_STATUS_MAP",
    ()=>GHTK_STATUS_MAP,
    "canCancelGHTKShipment",
    ()=>canCancelGHTKShipment,
    "getGHTKReasonText",
    ()=>getGHTKReasonText,
    "getGHTKStatusInfo",
    ()=>getGHTKStatusInfo,
    "getGHTKStatusText",
    ()=>getGHTKStatusText,
    "getGHTKStatusVariant",
    ()=>getGHTKStatusVariant,
    "shouldSyncGHTKStatus",
    ()=>shouldSyncGHTKStatus
]);
const GHTK_STATUS_MAP = {
    '-1': {
        statusId: -1,
        statusText: 'Hủy đơn hàng',
        deliveryStatus: 'Chờ giao lại',
        description: 'Đơn hàng đã bị hủy',
        canCancel: false,
        shouldUpdateStock: true,
        stockAction: 'return',
        isFinal: true
    },
    '1': {
        statusId: 1,
        statusText: 'Chưa tiếp nhận',
        deliveryStatus: 'Chờ lấy hàng',
        description: 'GHTK chưa tiếp nhận đơn hàng',
        canCancel: true,
        shouldUpdateStock: false,
        isFinal: false
    },
    '2': {
        statusId: 2,
        statusText: 'Đã tiếp nhận',
        deliveryStatus: 'Chờ lấy hàng',
        description: 'GHTK đã tiếp nhận và đang chuẩn bị lấy hàng',
        canCancel: true,
        shouldUpdateStock: false,
        isFinal: false
    },
    '3': {
        statusId: 3,
        statusText: 'Đã lấy hàng/Đã nhập kho',
        deliveryStatus: 'Đang giao hàng',
        description: 'Shipper đã lấy hàng thành công',
        canCancel: false,
        shouldUpdateStock: true,
        stockAction: 'dispatch',
        isFinal: false
    },
    '4': {
        statusId: 4,
        statusText: 'Đã điều phối giao hàng/Đang giao hàng',
        deliveryStatus: 'Đang giao hàng',
        description: 'Đơn hàng đang được giao đến khách',
        canCancel: false,
        shouldUpdateStock: false,
        isFinal: false
    },
    '5': {
        statusId: 5,
        statusText: 'Đã giao hàng/Chưa đối soát',
        deliveryStatus: 'Đã giao hàng',
        description: 'Giao hàng thành công, chưa đối soát',
        canCancel: false,
        shouldUpdateStock: true,
        stockAction: 'complete',
        isFinal: false
    },
    '6': {
        statusId: 6,
        statusText: 'Đã đối soát',
        deliveryStatus: 'Đã giao hàng',
        description: 'Đã đối soát COD với GHTK',
        canCancel: false,
        shouldUpdateStock: false,
        isFinal: true
    },
    '7': {
        statusId: 7,
        statusText: 'Không lấy được hàng',
        deliveryStatus: 'Chờ giao lại',
        description: 'Shipper không lấy được hàng từ người gửi',
        canCancel: false,
        shouldUpdateStock: true,
        stockAction: 'return',
        isFinal: false
    },
    '8': {
        statusId: 8,
        statusText: 'Hoãn lấy hàng',
        deliveryStatus: 'Chờ lấy hàng',
        description: 'Lấy hàng bị hoãn, sẽ lấy lại sau',
        canCancel: false,
        shouldUpdateStock: false,
        isFinal: false
    },
    '9': {
        statusId: 9,
        statusText: 'Không giao được hàng',
        deliveryStatus: 'Chờ giao lại',
        description: 'Giao hàng thất bại, sẽ giao lại hoặc trả hàng',
        canCancel: false,
        shouldUpdateStock: true,
        stockAction: 'return',
        isFinal: false
    },
    '10': {
        statusId: 10,
        statusText: 'Delay giao hàng',
        deliveryStatus: 'Đang giao hàng',
        description: 'Giao hàng bị chậm trễ',
        canCancel: false,
        shouldUpdateStock: false,
        isFinal: false
    },
    '11': {
        statusId: 11,
        statusText: 'Đã đối soát công nợ trả hàng',
        deliveryStatus: 'Chờ giao lại',
        description: 'Đã đối soát tiền trả hàng',
        canCancel: false,
        shouldUpdateStock: false,
        isFinal: true
    },
    '12': {
        statusId: 12,
        statusText: 'Đã điều phối lấy hàng/Đang lấy hàng',
        deliveryStatus: 'Chờ lấy hàng',
        description: 'Shipper đang trên đường đến lấy hàng',
        canCancel: true,
        shouldUpdateStock: false,
        isFinal: false
    },
    '13': {
        statusId: 13,
        statusText: 'Đơn hàng bồi hoàn',
        deliveryStatus: 'Chờ giao lại',
        description: 'Đơn hàng bị mất/hỏng, đang xử lý bồi hoàn',
        canCancel: false,
        shouldUpdateStock: true,
        stockAction: 'return',
        isFinal: true
    },
    '20': {
        statusId: 20,
        statusText: 'Đang trả hàng (COD cầm hàng đi trả)',
        deliveryStatus: 'Chờ giao lại',
        description: 'Shipper đang mang hàng về trả người gửi',
        canCancel: false,
        shouldUpdateStock: true,
        stockAction: 'return',
        isFinal: false
    },
    '21': {
        statusId: 21,
        statusText: 'Đã trả hàng (COD đã trả xong hàng)',
        deliveryStatus: 'Chờ giao lại',
        description: 'Đã trả hàng về cho người gửi',
        canCancel: false,
        shouldUpdateStock: false,
        isFinal: true
    },
    '123': {
        statusId: 123,
        statusText: 'Shipper báo đã lấy hàng',
        deliveryStatus: 'Chờ lấy hàng',
        description: 'Shipper cập nhật đã lấy hàng (chưa xác nhận)',
        canCancel: false,
        shouldUpdateStock: false,
        isFinal: false
    },
    '127': {
        statusId: 127,
        statusText: 'Shipper báo không lấy được hàng',
        deliveryStatus: 'Chờ lấy hàng',
        description: 'Shipper báo không lấy được (chưa xác nhận)',
        canCancel: false,
        shouldUpdateStock: false,
        isFinal: false
    },
    '128': {
        statusId: 128,
        statusText: 'Shipper báo delay lấy hàng',
        deliveryStatus: 'Chờ lấy hàng',
        description: 'Shipper báo hoãn lấy hàng (chưa xác nhận)',
        canCancel: false,
        shouldUpdateStock: false,
        isFinal: false
    },
    '45': {
        statusId: 45,
        statusText: 'Shipper báo đã giao hàng',
        deliveryStatus: 'Đang giao hàng',
        description: 'Shipper cập nhật đã giao (chưa xác nhận)',
        canCancel: false,
        shouldUpdateStock: false,
        isFinal: false
    },
    '49': {
        statusId: 49,
        statusText: 'Shipper báo không giao được hàng',
        deliveryStatus: 'Đang giao hàng',
        description: 'Shipper báo giao thất bại (chưa xác nhận)',
        canCancel: false,
        shouldUpdateStock: false,
        isFinal: false
    },
    '410': {
        statusId: 410,
        statusText: 'Shipper báo delay giao hàng',
        deliveryStatus: 'Đang giao hàng',
        description: 'Shipper báo hoãn giao hàng (chưa xác nhận)',
        canCancel: false,
        shouldUpdateStock: false,
        isFinal: false
    }
};
const GHTK_REASON_MAP = {
    // Chậm lấy hàng (100-107)
    '100': 'Nhà cung cấp (NCC) hẹn lấy vào ca tiếp theo',
    '101': 'GHTK không liên lạc được với NCC',
    '102': 'NCC chưa có hàng',
    '103': 'NCC đổi địa chỉ',
    '104': 'NCC hẹn ngày lấy hàng',
    '105': 'GHTK quá tải, không lấy kịp',
    '106': 'Do điều kiện thời tiết, khách quan',
    '107': 'Lý do khác',
    // Không lấy được hàng (110-115)
    '110': 'Địa chỉ ngoài vùng phục vụ',
    '111': 'Hàng không nhận vận chuyển',
    '112': 'NCC báo hủy',
    '113': 'NCC hoãn/không liên lạc được 3 lần',
    '114': 'Lý do khác',
    '115': 'Đối tác hủy đơn qua API',
    // Chậm giao hàng (120-1200)
    '120': 'GHTK quá tải, giao không kịp',
    '121': 'Người nhận hàng hẹn giao ca tiếp theo',
    '122': 'Không gọi được cho người nhận hàng',
    '123': 'Người nhận hàng hẹn ngày giao',
    '124': 'Người nhận hàng chuyển địa chỉ nhận mới',
    '125': 'Địa chỉ người nhận sai, cần NCC check lại',
    '126': 'Do điều kiện thời tiết, khách quan',
    '127': 'Lý do khác',
    '128': 'Đối tác hẹn thời gian giao hàng',
    '129': 'Không tìm thấy hàng',
    '1200': 'SĐT người nhận sai, cần NCC check lại',
    // Không giao được hàng (130-135)
    '130': 'Người nhận không đồng ý nhận sản phẩm',
    '131': 'Không liên lạc được với KH 3 lần',
    '132': 'KH hẹn giao lại quá 3 lần',
    '133': 'Shop báo hủy đơn hàng',
    '134': 'Lý do khác',
    '135': 'Đối tác hủy đơn qua API',
    // Delay trả hàng (140-144)
    '140': 'NCC hẹn trả ca sau',
    '141': 'Không liên lạc được với NCC',
    '142': 'NCC không có nhà',
    '143': 'NCC hẹn ngày trả',
    '144': 'Lý do khác'
};
function getGHTKStatusInfo(statusId) {
    return GHTK_STATUS_MAP[statusId] || null;
}
function getGHTKStatusText(statusId) {
    const info = getGHTKStatusInfo(statusId);
    return info?.statusText || `Trạng thái #${statusId}`;
}
function getGHTKReasonText(reasonCode) {
    return GHTK_REASON_MAP[reasonCode] || reasonCode;
}
function canCancelGHTKShipment(statusId) {
    if (!statusId) return false;
    const info = getGHTKStatusInfo(statusId);
    return info?.canCancel || false;
}
function shouldSyncGHTKStatus(statusId) {
    if (!statusId) return true; // Sync nếu chưa có status
    const info = getGHTKStatusInfo(statusId);
    return !info?.isFinal; // Sync nếu chưa đến trạng thái cuối
}
function getGHTKStatusVariant(statusId) {
    if (!statusId) return 'secondary';
    const info = getGHTKStatusInfo(statusId);
    if (!info) return 'secondary';
    // Đã giao hàng, đã đối soát
    if ([
        5,
        6
    ].includes(statusId)) return 'success';
    // Hủy, không lấy/giao được, bồi hoàn
    if ([
        -1,
        7,
        9,
        13
    ].includes(statusId)) return 'destructive';
    // Delay, hoãn
    if ([
        8,
        10
    ].includes(statusId)) return 'warning';
    // Đang xử lý
    if ([
        3,
        4,
        12
    ].includes(statusId)) return 'default';
    return 'secondary';
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/print-service.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "PrintService",
    ()=>PrintService,
    "default",
    ()=>__TURBOPACK__default__export__,
    "formatCurrency",
    ()=>formatCurrency,
    "formatDate",
    ()=>formatDate,
    "formatDateTime",
    ()=>formatDateTime,
    "formatTime",
    ()=>formatTime,
    "generateLineItemsHtml",
    ()=>generateLineItemsHtml,
    "generatePrintHtml",
    ()=>generatePrintHtml,
    "getGeneralSettings",
    ()=>getGeneralSettings,
    "getPreviewHtml",
    ()=>getPreviewHtml,
    "getStoreData",
    ()=>getStoreData,
    "getStoreLogo",
    ()=>getStoreLogo,
    "numberToWords",
    ()=>numberToWords,
    "printDocument",
    ()=>printDocument,
    "replaceVariables",
    ()=>replaceVariables
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/settings/printer/store.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/date-utils.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$settings$2d$cache$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/settings-cache.ts [app-client] (ecmascript)");
;
;
;
function getGeneralSettings() {
    try {
        const settings = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$settings$2d$cache$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getGeneralSettingsSync"])();
        return {
            companyName: settings.storeName,
            companyAddress: settings.storeAddress,
            phoneNumber: settings.storePhone,
            storeName: settings.storeName,
            storeAddress: settings.storeAddress,
            storePhone: settings.storePhone,
            logoUrl: settings.logoUrl
        };
    } catch (e) {}
    return null;
}
function getStoreLogo(storeInfoLogo) {
    if (storeInfoLogo) return storeInfoLogo;
    try {
        const settings = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$settings$2d$cache$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getGeneralSettingsSync"])();
        return settings.logoUrl || undefined;
    } catch (e) {}
    return undefined;
}
function formatCurrency(amount) {
    if (amount === undefined || amount === null) return '0';
    return new Intl.NumberFormat('vi-VN').format(amount);
}
function numberToWords(amount) {
    if (!amount || amount === 0) return 'Không đồng';
    const units = [
        '',
        'một',
        'hai',
        'ba',
        'bốn',
        'năm',
        'sáu',
        'bảy',
        'tám',
        'chín'
    ];
    const positions = [
        '',
        'nghìn',
        'triệu',
        'tỷ',
        'nghìn tỷ',
        'triệu tỷ'
    ];
    const readThreeDigits = (num)=>{
        const hundred = Math.floor(num / 100);
        const ten = Math.floor(num % 100 / 10);
        const unit = num % 10;
        let result = '';
        if (hundred > 0) {
            result += units[hundred] + ' trăm ';
        }
        if (ten > 1) {
            result += units[ten] + ' mươi ';
            if (unit === 1) {
                result += 'mốt ';
            } else if (unit === 5) {
                result += 'lăm ';
            } else if (unit > 0) {
                result += units[unit] + ' ';
            }
        } else if (ten === 1) {
            result += 'mười ';
            if (unit === 5) {
                result += 'lăm ';
            } else if (unit > 0) {
                result += units[unit] + ' ';
            }
        } else if (ten === 0 && hundred > 0 && unit > 0) {
            result += 'lẻ ' + units[unit] + ' ';
        } else if (unit > 0) {
            result += units[unit] + ' ';
        }
        return result.trim();
    };
    let result = '';
    let num = Math.abs(Math.round(amount));
    let posIndex = 0;
    while(num > 0){
        const threeDigits = num % 1000;
        if (threeDigits > 0) {
            const words = readThreeDigits(threeDigits);
            result = words + ' ' + positions[posIndex] + ' ' + result;
        }
        num = Math.floor(num / 1000);
        posIndex++;
    }
    result = result.trim();
    // Capitalize first letter
    result = result.charAt(0).toUpperCase() + result.slice(1) + ' đồng';
    if (amount < 0) {
        result = 'Âm ' + result;
    }
    return result;
}
function formatDate(date) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatDateForDisplay"])(date);
}
function formatTime(date) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatTimeForDisplay"])(date);
}
function formatDateTime(date) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatDateTimeForDisplay"])(date);
}
// ============================================
// PRINT SERVICE
// ============================================
/**
 * CSS styles cho in ấn
 */ const PRINT_STYLES = `
  * { box-sizing: border-box; }
  body { 
    font-family: 'Times New Roman', Times, serif;
    font-size: 13px;
    line-height: 1.5;
    margin: 0;
    padding: 20px;
    color: #000;
  }
  h1, h2, h3, h4 { margin: 0.5em 0; }
  h2 { font-size: 18px; font-weight: bold; }
  p { margin: 0.3em 0; }
  table { 
    width: 100%; 
    border-collapse: collapse; 
    margin: 10px 0;
  }
  th, td { 
    border: 1px solid #333; 
    padding: 6px 8px; 
    text-align: left;
    vertical-align: top;
  }
  th { 
    background: #f0f0f0; 
    font-weight: bold;
  }
  strong { font-weight: bold; }
  em { font-style: italic; }
  hr { border: none; border-top: 1px solid #333; margin: 10px 0; }
  ul { margin: 0.5em 0; padding-left: 25px; list-style-type: disc; }
  ol { margin: 0.5em 0; padding-left: 25px; list-style-type: decimal; }
  li { margin: 0.2em 0; display: list-item; }
  img { max-width: 100%; height: auto; }
  @media print { 
    body { padding: 0; } 
    @page { margin: 15mm; }
  }
`;
function replaceVariables(template, data) {
    let result = template;
    // Replace các biến đơn lẻ
    Object.entries(data).forEach(([key, value])=>{
        // Nếu không phải array (line items), replace trực tiếp
        if (!Array.isArray(value)) {
            const placeholder = key.startsWith('{') ? key : `{${key}}`;
            const stringValue = value?.toString() || '';
            result = result.split(placeholder).join(stringValue);
        }
    });
    return result;
}
function generateLineItemsHtml(templateRow, items, startIndex = 1) {
    return items.map((item, index)=>{
        let row = templateRow;
        // Replace {line_stt} với số thứ tự
        row = row.replace(/{line_stt}/g, (startIndex + index).toString());
        // Replace các biến line_* khác
        Object.entries(item).forEach(([key, value])=>{
            const placeholder = key.startsWith('{') ? key : `{${key}}`;
            const stringValue = value?.toString() || '';
            row = row.split(placeholder).join(stringValue);
        });
        return row;
    }).join('\n');
}
function generatePrintHtml(templateType, data, branchId) {
    const store = __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePrintTemplateStore"].getState();
    const defaultSize = store.getDefaultSize(templateType);
    const template = store.getTemplate(templateType, defaultSize, branchId);
    let html = template.content;
    // Replace variables
    html = replaceVariables(html, data);
    return html;
}
function printDocument(templateType, data, options) {
    const store = __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePrintTemplateStore"].getState();
    const paperSize = options?.paperSize || store.getDefaultSize(templateType);
    const template = store.getTemplate(templateType, paperSize, options?.branchId);
    // Generate HTML content
    let html = replaceVariables(template.content, data);
    // Tạo iframe ẩn để in
    const printFrame = document.createElement('iframe');
    printFrame.style.position = 'absolute';
    printFrame.style.top = '-10000px';
    printFrame.style.left = '-10000px';
    document.body.appendChild(printFrame);
    const printDoc = printFrame.contentDocument || printFrame.contentWindow?.document;
    if (printDoc) {
        const title = options?.title || `In ${templateType}`;
        printDoc.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>${title}</title>
        <style>${PRINT_STYLES}</style>
      </head>
      <body>${html}</body>
      </html>
    `);
        printDoc.close();
        // Đợi load xong rồi in
        setTimeout(()=>{
            printFrame.contentWindow?.print();
            // Xóa iframe sau khi in
            setTimeout(()=>{
                if (document.body.contains(printFrame)) {
                    document.body.removeChild(printFrame);
                }
            }, 1000);
        }, 100);
    }
}
function getPreviewHtml(templateType, data, options) {
    const store = __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePrintTemplateStore"].getState();
    const paperSize = options?.paperSize || store.getDefaultSize(templateType);
    const template = store.getTemplate(templateType, paperSize, options?.branchId);
    return replaceVariables(template.content, data);
}
function getStoreData(settings) {
    const now = new Date();
    const logo = getStoreLogo(settings.logo);
    return {
        '{store_logo}': logo ? `<img src="${logo}" alt="Logo" style="max-height:60px"/>` : '',
        '{store_name}': settings.name || '',
        '{store_address}': settings.address || '',
        '{store_phone_number}': settings.phone || '',
        '{hotline}': settings.hotline || settings.phone || '',
        '{store_hotline}': settings.hotline || settings.phone || '',
        '{store_email}': settings.email || '',
        '{store_fax}': settings.fax || '',
        '{store_website}': settings.website || '',
        '{store_tax_code}': settings.taxCode || '',
        // Print timestamp - always inject current time
        '{print_date}': formatDate(now),
        '{print_time}': formatTime(now)
    };
}
const PrintService = {
    formatCurrency,
    numberToWords,
    formatDate,
    formatTime,
    formatDateTime,
    replaceVariables,
    generateLineItemsHtml,
    generatePrintHtml,
    printDocument,
    getPreviewHtml,
    getStoreData,
    getStoreLogo
};
const __TURBOPACK__default__export__ = PrintService;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/use-print.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "usePrint",
    ()=>usePrint
]);
/**
 * Hook để sử dụng Print Service trong các component
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/print-service.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/settings/printer/store.ts [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
;
;
;
/**
 * Kiểm tra giá trị có "empty" không (null, undefined, '', '0', 0)
 */ function isEmptyValue(value) {
    if (value === undefined || value === null || value === '') return true;
    // Coi '0' và các biến thể như empty
    const strValue = String(value).trim();
    if (strValue === '0' || strValue === '0đ' || strValue === '0 đ') return true;
    return false;
}
/**
 * Xử lý các điều kiện trong template
 * Hỗ trợ:
 * - {{#if has_tax}}...{{/if}} - Điều kiện boolean
 * - {{#if_empty {field}}}...{{/if_empty}} - Nếu field rỗng
 * - {{#if_not_empty {field}}}...{{/if_not_empty}} - Nếu field không rỗng
 * - {{#if_gt {field} value}}...{{/if_gt}} - Nếu field > value (greater than)
 */ function processConditionals(html, data, lineItems) {
    let result = html;
    // 1. Xử lý {{#if_not_empty {field}}}...{{/if_not_empty}}
    const ifNotEmptyPattern = /\{\{#if_not_empty\s+\{([^}]+)\}\}\}([\s\S]*?)\{\{\/if_not_empty\}\}/gi;
    result = result.replace(ifNotEmptyPattern, (match, field, content)=>{
        const key = `{${field}}`;
        const value = data[key];
        if (!isEmptyValue(value)) {
            return content;
        }
        return '';
    });
    // 2. Xử lý {{#if_empty {field}}}...{{/if_empty}}
    const ifEmptyPattern = /\{\{#if_empty\s+\{([^}]+)\}\}\}([\s\S]*?)\{\{\/if_empty\}\}/gi;
    result = result.replace(ifEmptyPattern, (match, field, content)=>{
        const key = `{${field}}`;
        const value = data[key];
        if (isEmptyValue(value)) {
            return content;
        }
        return '';
    });
    // 3. Xử lý {{#if_gt {field} value}}...{{/if_gt}} (greater than 0)
    const ifGtPattern = /\{\{#if_gt\s+\{([^}]+)\}\s+(\d+)\}\}([\s\S]*?)\{\{\/if_gt\}\}/gi;
    result = result.replace(ifGtPattern, (match, field, compareValue, content)=>{
        const key = `{${field}}`;
        const value = data[key];
        // Parse số từ giá trị (loại bỏ dấu chấm, đ, etc.)
        const numValue = parseFloat((value || '0').toString().replace(/[^\d.-]/g, ''));
        const numCompare = parseFloat(compareValue);
        if (numValue > numCompare) {
            return content;
        }
        return '';
    });
    // 4. Xử lý {{#if has_tax}}...{{/if}} - Boolean conditions
    // has_tax = true nếu total_tax > 0
    const hasTax = !isEmptyValue(data['{total_tax}']);
    const hasDiscount = !isEmptyValue(data['{total_discount}']);
    const hasDeliveryFee = !isEmptyValue(data['{delivery_fee}']);
    const hasNote = !isEmptyValue(data['{order_note}']);
    const booleanConditions = {
        'has_tax': hasTax,
        'has_discount': hasDiscount,
        'has_delivery_fee': hasDeliveryFee,
        'has_note': hasNote,
        'has_shipping_address': !isEmptyValue(data['{shipping_address}']),
        'has_customer_email': !isEmptyValue(data['{customer_email}']),
        'has_customer_phone': !isEmptyValue(data['{customer_phone_number}'])
    };
    // Xử lý {{#if condition}}...{{/if}}
    const ifPattern = /\{\{#if\s+(\w+)\}\}([\s\S]*?)\{\{\/if\}\}/gi;
    result = result.replace(ifPattern, (match, condition, content)=>{
        if (booleanConditions[condition]) {
            return content;
        }
        return '';
    });
    // 5. Xử lý {{#unless condition}}...{{/unless}} (ngược lại với if)
    const unlessPattern = /\{\{#unless\s+(\w+)\}\}([\s\S]*?)\{\{\/unless\}\}/gi;
    result = result.replace(unlessPattern, (match, condition, content)=>{
        if (!booleanConditions[condition]) {
            return content;
        }
        return '';
    });
    return result;
}
/**
 * Xử lý điều kiện cho line items
 * Ví dụ: {{#line_if_not_empty {line_tax_amount}}}...{{/line_if_not_empty}}
 */ function processLineItemConditionals(rowHtml, item) {
    let result = rowHtml;
    // Xử lý {{#line_if_not_empty {field}}}...{{/line_if_not_empty}}
    const lineIfNotEmptyPattern = /\{\{#line_if_not_empty\s+\{([^}]+)\}\}\}([\s\S]*?)\{\{\/line_if_not_empty\}\}/gi;
    result = result.replace(lineIfNotEmptyPattern, (match, field, content)=>{
        const key = `{${field}}`;
        const value = item[key];
        if (!isEmptyValue(value)) {
            return content;
        }
        return '';
    });
    // Xử lý {{#line_if_empty {field}}}...{{/line_if_empty}}
    const lineIfEmptyPattern = /\{\{#line_if_empty\s+\{([^}]+)\}\}\}([\s\S]*?)\{\{\/line_if_empty\}\}/gi;
    result = result.replace(lineIfEmptyPattern, (match, field, content)=>{
        const key = `{${field}}`;
        const value = item[key];
        if (isEmptyValue(value)) {
            return content;
        }
        return '';
    });
    return result;
}
function usePrint(currentBranchId) {
    _s();
    const templateStore = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePrintTemplateStore"])();
    const [isLoading] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"](false);
    const getTemplateContent = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"]({
        "usePrint.useCallback[getTemplateContent]": (type, paperSize, branchId)=>{
            // Xác định paperSize sử dụng
            const size = paperSize || templateStore.getDefaultSize(type);
            const branch = branchId || currentBranchId;
            // Lấy template
            const template = templateStore.getTemplate(type, size, branch);
            if (template?.content) {
                return template.content;
            }
            // Fallback: thử lấy template không có branch
            const defaultTemplate = templateStore.getTemplate(type, size);
            return defaultTemplate?.content || null;
        }
    }["usePrint.useCallback[getTemplateContent]"], [
        templateStore,
        currentBranchId
    ]);
    const processTemplate = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"]({
        "usePrint.useCallback[processTemplate]": (templateContent, data, lineItems)=>{
            // Bước 1: Xử lý line items nếu có
            let html = templateContent;
            console.log('[processTemplate] Starting, lineItems count:', lineItems?.length);
            if (lineItems && lineItems.length > 0) {
                // === XỬ LÝ CÚ PHÁP {{#line_items}}...{{/line_items}} ===
                // Dành cho template lặp toàn bộ section (mỗi employee 1 page)
                const lineItemsBlockPattern = /\{\{#line_items\}\}([\s\S]*?)\{\{\/line_items\}\}/gi;
                const lineItemsBlockMatch = html.match(lineItemsBlockPattern);
                console.log('[processTemplate] Block match found:', !!lineItemsBlockMatch, lineItemsBlockMatch?.length);
                if (lineItemsBlockMatch && lineItemsBlockMatch.length > 0) {
                    // Có block {{#line_items}} - lặp cả block cho mỗi item
                    html = html.replace(lineItemsBlockPattern, {
                        "usePrint.useCallback[processTemplate]": (match, blockContent)=>{
                            return lineItems.map({
                                "usePrint.useCallback[processTemplate]": (item, index)=>{
                                    let itemHtml = blockContent;
                                    // Thêm {line_index}
                                    itemHtml = itemHtml.replace(/\{line_index\}/g, String(index + 1));
                                    // Replace các biến từ item (line item data)
                                    Object.entries(item).forEach({
                                        "usePrint.useCallback[processTemplate]": ([key, value])=>{
                                            const placeholder = key.startsWith('{') ? key : `{${key}}`;
                                            const regex = new RegExp(placeholder.replace(/[{}]/g, '\\$&'), 'g');
                                            itemHtml = itemHtml.replace(regex, value?.toString() || '');
                                        }
                                    }["usePrint.useCallback[processTemplate]"]);
                                    // Replace các biến global (data) cho mỗi item page
                                    Object.entries(data).forEach({
                                        "usePrint.useCallback[processTemplate]": ([key, value])=>{
                                            const placeholder = key.startsWith('{') ? key : `{${key}}`;
                                            const regex = new RegExp(placeholder.replace(/[{}]/g, '\\$&'), 'g');
                                            itemHtml = itemHtml.replace(regex, value?.toString() || '');
                                        }
                                    }["usePrint.useCallback[processTemplate]"]);
                                    return itemHtml;
                                }
                            }["usePrint.useCallback[processTemplate]"]).join('\n');
                        }
                    }["usePrint.useCallback[processTemplate]"]);
                // Đã xử lý xong line items theo block mode, skip table mode
                } else {
                    // === XỬ LÝ TABLE MODE (cũ) ===
                    // Tìm tất cả các table trong template
                    const tablePattern = /<table[^>]*>[\s\S]*?<\/table>/gi;
                    const tables = html.match(tablePattern);
                    if (tables) {
                        // Tìm table chứa {line_stt} - đây là bảng line items
                        const lineItemsTable = tables.find({
                            "usePrint.useCallback[processTemplate].lineItemsTable": (table)=>table.includes('{line_stt}')
                        }["usePrint.useCallback[processTemplate].lineItemsTable"]);
                        if (lineItemsTable) {
                            // Tìm tbody trong table này
                            let tbodyMatch = lineItemsTable.match(/<tbody[^>]*>([\s\S]*?)<\/tbody>/i);
                            // Nếu không có tbody, có thể table chỉ có tr trực tiếp
                            // (một số template không dùng thead/tbody)
                            if (!tbodyMatch) {
                                // Tìm tất cả tr trong table (trừ tr trong thead)
                                const theadMatch = lineItemsTable.match(/<thead[^>]*>[\s\S]*?<\/thead>/i);
                                let tableWithoutThead = lineItemsTable;
                                if (theadMatch) {
                                    tableWithoutThead = lineItemsTable.replace(theadMatch[0], '');
                                }
                                // Tìm tr chứa {line_stt}
                                const rowPattern = /<tr[^>]*>[\s\S]*?\{line_stt\}[\s\S]*?<\/tr>/i;
                                const rowMatch = tableWithoutThead.match(rowPattern);
                                if (rowMatch) {
                                    const templateRow = rowMatch[0];
                                    // Tạo các row mới từ template
                                    const rowsHtml = lineItems.map({
                                        "usePrint.useCallback[processTemplate].rowsHtml": (item)=>{
                                            let row = templateRow;
                                            // Xử lý điều kiện cho line item trước
                                            row = processLineItemConditionals(row, item);
                                            Object.entries(item).forEach({
                                                "usePrint.useCallback[processTemplate].rowsHtml": ([key, value])=>{
                                                    const placeholder = key.startsWith('{') ? key : `{${key}}`;
                                                    const regex = new RegExp(placeholder.replace(/[{}]/g, '\\$&'), 'g');
                                                    row = row.replace(regex, value?.toString() || '');
                                                }
                                            }["usePrint.useCallback[processTemplate].rowsHtml"]);
                                            return row;
                                        }
                                    }["usePrint.useCallback[processTemplate].rowsHtml"]).join('\n    ');
                                    // Thay thế row mẫu bằng các rows mới
                                    const newTable = lineItemsTable.replace(templateRow, rowsHtml);
                                    html = html.replace(lineItemsTable, newTable);
                                }
                            } else {
                                // Có tbody - xử lý như cũ
                                const tbodyContent = tbodyMatch[1];
                                // Tìm TẤT CẢ các row trong tbody
                                const allRowsPattern = /<tr[^>]*>[\s\S]*?<\/tr>/gi;
                                const allRows = tbodyContent.match(allRowsPattern);
                                if (allRows && allRows.length > 0) {
                                    // Tìm row chứa {line_stt} - đây là row mẫu
                                    const templateRow = allRows.find({
                                        "usePrint.useCallback[processTemplate]": (row)=>row.includes('{line_stt}')
                                    }["usePrint.useCallback[processTemplate]"]) || allRows[0];
                                    // Tạo các row mới từ template
                                    const rowsHtml = lineItems.map({
                                        "usePrint.useCallback[processTemplate].rowsHtml": (item)=>{
                                            let row = templateRow;
                                            // Xử lý điều kiện cho line item trước
                                            row = processLineItemConditionals(row, item);
                                            // Replace từng biến trong item
                                            Object.entries(item).forEach({
                                                "usePrint.useCallback[processTemplate].rowsHtml": ([key, value])=>{
                                                    const placeholder = key.startsWith('{') ? key : `{${key}}`;
                                                    const regex = new RegExp(placeholder.replace(/[{}]/g, '\\$&'), 'g');
                                                    row = row.replace(regex, value?.toString() || '');
                                                }
                                            }["usePrint.useCallback[processTemplate].rowsHtml"]);
                                            return row;
                                        }
                                    }["usePrint.useCallback[processTemplate].rowsHtml"]).join('\n    ');
                                    // Tạo tbody mới
                                    const newTbody = `<tbody>\n    ${rowsHtml}\n  </tbody>`;
                                    // Thay thế tbody cũ trong table
                                    const newTable = lineItemsTable.replace(tbodyMatch[0], newTbody);
                                    // Thay thế table cũ bằng table mới trong html
                                    html = html.replace(lineItemsTable, newTable);
                                }
                            }
                        }
                    }
                } // End of else (TABLE MODE)
            }
            // Bước 2: Xử lý các điều kiện (conditionals)
            html = processConditionals(html, data, lineItems);
            // Bước 3: Thay thế các biến còn lại
            html = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["replaceVariables"])(html, data);
            return html;
        }
    }["usePrint.useCallback[processTemplate]"], []);
    const print = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"]({
        "usePrint.useCallback[print]": (type, options)=>{
            const { data, lineItems, paperSize, branchId } = options;
            console.log('[usePrint] Starting print for type:', type);
            console.log('[usePrint] Data keys:', Object.keys(data));
            console.log('[usePrint] LineItems count:', lineItems?.length || 0);
            // Lấy template content
            const size = paperSize || templateStore.getDefaultSize(type);
            const templateContent = getTemplateContent(type, size, branchId);
            if (!templateContent) {
                console.error(`[usePrint] No template found for type: ${type}`);
                return;
            }
            console.log('[usePrint] Template found, length:', templateContent.length);
            // Xử lý template
            let html;
            try {
                html = processTemplate(templateContent, data, lineItems);
                console.log('[usePrint] Template processed, html length:', html.length);
            } catch (err) {
                console.error('[usePrint] Error processing template:', err);
                return;
            }
            // Tạo iframe ẩn để in
            const printFrame = document.createElement('iframe');
            printFrame.style.position = 'absolute';
            printFrame.style.top = '-10000px';
            printFrame.style.left = '-10000px';
            document.body.appendChild(printFrame);
            const printDoc = printFrame.contentDocument || printFrame.contentWindow?.document;
            if (printDoc) {
                // CSS cơ bản cho print - giống với Settings preview
                const printCSS = `
        body { font-family: Arial, sans-serif; font-size: 12px; line-height: 1.5; }
        table { width: 100%; border-collapse: collapse; margin: 8px 0; }
        th, td { border: 1px solid #333; padding: 6px 8px; }
        th { background-color: #f5f5f5; font-weight: bold; }
        .text-center, [style*="text-align: center"] { text-align: center; }
        .text-right, [style*="text-align: right"] { text-align: right; }
        img { max-width: 100%; height: auto; }
        h1, h2, h3 { margin: 8px 0; }
        p { margin: 4px 0; }
      `;
                printDoc.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>In ${type}</title>
          <style>${printCSS}</style>
        </head>
        <body>${html}</body>
        </html>
      `);
                printDoc.close();
                // Đợi load xong rồi in
                setTimeout({
                    "usePrint.useCallback[print]": ()=>{
                        printFrame.contentWindow?.print();
                        // Xóa iframe sau khi in
                        setTimeout({
                            "usePrint.useCallback[print]": ()=>{
                                if (document.body.contains(printFrame)) {
                                    document.body.removeChild(printFrame);
                                }
                            }
                        }["usePrint.useCallback[print]"], 1000);
                    }
                }["usePrint.useCallback[print]"], 100);
            }
        }
    }["usePrint.useCallback[print]"], [
        getTemplateContent,
        processTemplate
    ]);
    /**
   * In nhiều tài liệu cùng lúc - gộp thành 1 document với page break giữa các tài liệu
   */ const printMultiple = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"]({
        "usePrint.useCallback[printMultiple]": (type, optionsList)=>{
            if (optionsList.length === 0) return;
            // Lấy template content (dùng paperSize của item đầu tiên hoặc default)
            const firstOptions = optionsList[0];
            const size = firstOptions.paperSize || templateStore.getDefaultSize(type);
            const templateContent = getTemplateContent(type, size, firstOptions.branchId);
            if (!templateContent) {
                console.error(`[usePrint] No template found for type: ${type}`);
                return;
            }
            // Xử lý từng document và gộp lại với page break
            const allHtmlParts = optionsList.map({
                "usePrint.useCallback[printMultiple].allHtmlParts": (options, index)=>{
                    const html = processTemplate(templateContent, options.data, options.lineItems);
                    // Thêm page break sau mỗi document (trừ document cuối)
                    if (index < optionsList.length - 1) {
                        return `<div class="print-page" style="page-break-after: always; break-after: page;">${html}</div>`;
                    }
                    return `<div class="print-page-last">${html}</div>`;
                }
            }["usePrint.useCallback[printMultiple].allHtmlParts"]);
            const combinedHtml = allHtmlParts.join('\n');
            // Tạo iframe ẩn để in
            const printFrame = document.createElement('iframe');
            printFrame.style.position = 'absolute';
            printFrame.style.top = '-10000px';
            printFrame.style.left = '-10000px';
            document.body.appendChild(printFrame);
            const printDoc = printFrame.contentDocument || printFrame.contentWindow?.document;
            if (printDoc) {
                // CSS cơ bản cho print với page break
                const printCSS = `
        * { box-sizing: border-box; }
        body { font-family: Arial, sans-serif; font-size: 12px; line-height: 1.5; margin: 0; padding: 0; }
        table { width: 100%; border-collapse: collapse; margin: 8px 0; }
        th, td { border: 1px solid #333; padding: 6px 8px; }
        th { background-color: #f5f5f5; font-weight: bold; }
        .text-center, [style*="text-align: center"] { text-align: center; }
        .text-right, [style*="text-align: right"] { text-align: right; }
        img { max-width: 100%; height: auto; }
        h1, h2, h3 { margin: 8px 0; }
        p { margin: 4px 0; }
        .print-page { 
          page-break-after: always !important; 
          break-after: page !important;
          page-break-inside: avoid;
        }
        .print-page-last { 
          page-break-after: auto; 
        }
        @media print {
          .print-page { 
            page-break-after: always !important; 
            break-after: page !important;
          }
          .print-page-last { 
            page-break-after: auto; 
          }
        }
      `;
                printDoc.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>In ${optionsList.length} ${type}</title>
          <style>${printCSS}</style>
        </head>
        <body>${combinedHtml}</body>
        </html>
      `);
                printDoc.close();
                // Đợi load xong rồi in
                setTimeout({
                    "usePrint.useCallback[printMultiple]": ()=>{
                        printFrame.contentWindow?.print();
                        // Xóa iframe sau khi in
                        setTimeout({
                            "usePrint.useCallback[printMultiple]": ()=>{
                                if (document.body.contains(printFrame)) {
                                    document.body.removeChild(printFrame);
                                }
                            }
                        }["usePrint.useCallback[printMultiple]"], 1000);
                    }
                }["usePrint.useCallback[printMultiple]"], 100);
            }
        }
    }["usePrint.useCallback[printMultiple]"], [
        templateStore,
        getTemplateContent,
        processTemplate
    ]);
    /**
   * In nhiều loại tài liệu khác nhau cùng lúc - gộp thành 1 popup duy nhất
   * Ví dụ: In đơn hàng + phiếu giao hàng + phiếu đóng gói trong 1 lần
   */ const printMixedDocuments = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"]({
        "usePrint.useCallback[printMixedDocuments]": (documents)=>{
            if (documents.length === 0) return;
            // Xử lý từng document và gộp lại với page break
            const allHtmlParts = [];
            documents.forEach({
                "usePrint.useCallback[printMixedDocuments]": (doc, docIndex)=>{
                    const { type, options } = doc;
                    const { data, lineItems, paperSize, branchId } = options;
                    // Lấy template content cho loại này
                    const size = paperSize || templateStore.getDefaultSize(type);
                    const templateContent = getTemplateContent(type, size, branchId);
                    if (!templateContent) {
                        console.warn(`[printMixedDocuments] No template found for type: ${type}, skipping`);
                        return;
                    }
                    const html = processTemplate(templateContent, data, lineItems);
                    // Thêm page break sau mỗi document (trừ document cuối)
                    if (docIndex < documents.length - 1) {
                        allHtmlParts.push(`<div class="print-page" style="page-break-after: always; break-after: page;">${html}</div>`);
                    } else {
                        allHtmlParts.push(`<div class="print-page-last">${html}</div>`);
                    }
                }
            }["usePrint.useCallback[printMixedDocuments]"]);
            if (allHtmlParts.length === 0) {
                console.error('[printMixedDocuments] No documents to print');
                return;
            }
            const combinedHtml = allHtmlParts.join('\n');
            // Tạo iframe ẩn để in
            const printFrame = document.createElement('iframe');
            printFrame.style.position = 'absolute';
            printFrame.style.top = '-10000px';
            printFrame.style.left = '-10000px';
            document.body.appendChild(printFrame);
            const printDoc = printFrame.contentDocument || printFrame.contentWindow?.document;
            if (printDoc) {
                // CSS cơ bản cho print với page break
                const printCSS = `
        * { box-sizing: border-box; }
        body { font-family: Arial, sans-serif; font-size: 12px; line-height: 1.5; margin: 0; padding: 0; }
        table { width: 100%; border-collapse: collapse; margin: 8px 0; }
        th, td { border: 1px solid #333; padding: 6px 8px; }
        th { background-color: #f5f5f5; font-weight: bold; }
        .text-center, [style*="text-align: center"] { text-align: center; }
        .text-right, [style*="text-align: right"] { text-align: right; }
        img { max-width: 100%; height: auto; }
        h1, h2, h3 { margin: 8px 0; }
        p { margin: 4px 0; }
        .print-page { 
          page-break-after: always !important; 
          break-after: page !important;
          page-break-inside: avoid;
        }
        .print-page-last { 
          page-break-after: auto; 
        }
        @media print {
          .print-page { 
            page-break-after: always !important; 
            break-after: page !important;
          }
          .print-page-last { 
            page-break-after: auto; 
          }
        }
      `;
                printDoc.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>In ${documents.length} tài liệu</title>
          <style>${printCSS}</style>
        </head>
        <body>${combinedHtml}</body>
        </html>
      `);
                printDoc.close();
                // Đợi load xong rồi in
                setTimeout({
                    "usePrint.useCallback[printMixedDocuments]": ()=>{
                        printFrame.contentWindow?.print();
                        // Xóa iframe sau khi in
                        setTimeout({
                            "usePrint.useCallback[printMixedDocuments]": ()=>{
                                if (document.body.contains(printFrame)) {
                                    document.body.removeChild(printFrame);
                                }
                            }
                        }["usePrint.useCallback[printMixedDocuments]"], 1000);
                    }
                }["usePrint.useCallback[printMixedDocuments]"], 100);
            }
        }
    }["usePrint.useCallback[printMixedDocuments]"], [
        templateStore,
        getTemplateContent,
        processTemplate
    ]);
    const getPreview = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"]({
        "usePrint.useCallback[getPreview]": (type, options)=>{
            const { data, lineItems, paperSize, branchId } = options;
            // Lấy template content
            const templateContent = getTemplateContent(type, paperSize, branchId);
            if (!templateContent) {
                return '<p style="color: red;">Không tìm thấy mẫu in</p>';
            }
            // Xử lý template
            return processTemplate(templateContent, data, lineItems);
        }
    }["usePrint.useCallback[getPreview]"], [
        getTemplateContent,
        processTemplate
    ]);
    const hasTemplate = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"]({
        "usePrint.useCallback[hasTemplate]": (type, paperSize)=>{
            const size = paperSize || templateStore.getDefaultSize(type);
            const template = templateStore.getTemplate(type, size, currentBranchId);
            return !!template?.content;
        }
    }["usePrint.useCallback[hasTemplate]"], [
        templateStore,
        currentBranchId
    ]);
    const getAvailableSizes = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"]({
        "usePrint.useCallback[getAvailableSizes]": (type)=>{
            const sizes = [
                'K57',
                'K80',
                'A4',
                'A5'
            ];
            return sizes.filter({
                "usePrint.useCallback[getAvailableSizes]": (size)=>{
                    const template = templateStore.getTemplate(type, size, currentBranchId);
                    return !!template?.content;
                }
            }["usePrint.useCallback[getAvailableSizes]"]);
        }
    }["usePrint.useCallback[getAvailableSizes]"], [
        templateStore,
        currentBranchId
    ]);
    const getDefaultSize = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"]({
        "usePrint.useCallback[getDefaultSize]": (type)=>{
            return templateStore.getDefaultSize(type);
        }
    }["usePrint.useCallback[getDefaultSize]"], [
        templateStore
    ]);
    return {
        print,
        printMultiple,
        printMixedDocuments,
        getPreview,
        hasTemplate,
        getAvailableSizes,
        getDefaultSize,
        isLoading
    };
}
_s(usePrint, "9M5k7O5VBx19rR8sRPzswl/QNGg=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePrintTemplateStore"]
    ];
});
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/print-mappers/types.ts [app-client] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "formatDateText",
    ()=>formatDateText,
    "hidePhoneMiddle",
    ()=>hidePhoneMiddle
]);
/**
 * Print Mappers - Shared Types
 * Types và utilities dùng chung cho tất cả mappers
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/print-service.ts [app-client] (ecmascript)");
;
const hidePhoneMiddle = (phone)=>{
    if (!phone || phone.length < 8) return phone || '';
    return phone.slice(0, 4) + '***' + phone.slice(-3);
};
const formatDateText = (date)=>{
    if (!date) return '';
    const d = typeof date === 'string' ? new Date(date) : date;
    if (isNaN(d.getTime())) return '';
    const day = d.getDate();
    const month = d.getMonth() + 1;
    const year = d.getFullYear();
    return `Ngày ${day} tháng ${month} năm ${year}`;
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/print-mappers/warranty.mapper.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "mapWarrantyLineItems",
    ()=>mapWarrantyLineItems,
    "mapWarrantyToPrintData",
    ()=>mapWarrantyToPrintData
]);
/**
 * Warranty Mapper - Phiếu bảo hành
 * Đồng bộ với variables/phieu-bao-hanh.ts
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$mappers$2f$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/lib/print-mappers/types.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/print-service.ts [app-client] (ecmascript)");
;
function mapWarrantyToPrintData(warranty, storeSettings) {
    return {
        ...(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getStoreData"])(storeSettings),
        // === THÔNG TIN CHI NHÁNH ===
        '{location_name}': warranty.location?.name || storeSettings.name || '',
        '{location_address}': warranty.location?.address || storeSettings.address || '',
        '{location_province}': warranty.location?.province || '',
        '{store_province}': storeSettings.province || '',
        // === THÔNG TIN PHIẾU BẢO HÀNH ===
        '{warranty_card_code}': warranty.code,
        '{warranty_code}': warranty.code,
        '{created_on}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatDate"])(warranty.createdAt),
        '{modified_on}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatDate"])(warranty.modifiedAt),
        '{account_name}': warranty.createdBy || '',
        '{status}': warranty.status || '',
        '{claim_status}': warranty.claimStatus || '',
        // === THÔNG TIN KHÁCH HÀNG ===
        '{customer_name}': warranty.customerName,
        '{customer_phone_number}': warranty.customerPhone || '',
        '{customer_address1}': warranty.customerAddress || '',
        '{customer_address}': warranty.customerAddress || '',
        '{customer_group}': warranty.customerGroup || '',
        // === THÔNG TIN ĐƠN HÀNG ===
        '{order_code}': warranty.orderCode || '',
        // === THÔNG TIN SẢN PHẨM (ĐƠN LẺ) ===
        '{line_product_name}': warranty.productName || '',
        '{product_name}': warranty.productName || '',
        '{line_variant_name}': warranty.variantName || '',
        '{line_variant_sku}': warranty.variantSku || '',
        '{line_variant_barcode}': warranty.barcode || '',
        '{serials}': warranty.serialNumber || '',
        '{serial_number}': warranty.serialNumber || '',
        '{term_name}': warranty.warrantyPolicyName || '',
        '{term_number}': warranty.warrantyPeriod || '',
        '{warranty_duration}': warranty.warrantyPeriod || '',
        '{warranty_period_days}': warranty.warrantyPeriodDays?.toString() || '',
        '{start_date}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatDate"])(warranty.startDate),
        '{end_date}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatDate"])(warranty.endDate),
        '{warranty_expired_on}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatDate"])(warranty.endDate),
        '{issue_description}': warranty.issueDescription || '',
        '{warranty_note}': warranty.note || ''
    };
}
function mapWarrantyLineItems(items) {
    if (!items) return [];
    return items.map((item, index)=>({
            '{line_stt}': (index + 1).toString(),
            '{line_product_name}': item.productName,
            '{line_variant_name}': item.variantName || '',
            '{line_variant_sku}': item.variantSku || '',
            '{line_variant_barcode}': item.barcode || '',
            '{serials}': item.serial || '',
            '{term_name}': item.warrantyPolicyName || '',
            '{term_number}': item.warrantyPeriod || '',
            '{warranty_period_days}': item.warrantyPeriodDays?.toString() || '',
            '{start_date}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatDate"])(item.startDate),
            '{end_date}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatDate"])(item.endDate)
        }));
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/print-mappers/warranty-request.mapper.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "mapWarrantyRequestLineItems",
    ()=>mapWarrantyRequestLineItems,
    "mapWarrantyRequestToPrintData",
    ()=>mapWarrantyRequestToPrintData
]);
/**
 * Warranty Request Mapper - Phiếu yêu cầu bảo hành (phieu-yeu-cau-bao-hanh)
 * Đồng bộ với variables/phieu-yeu-cau-bao-hanh.ts
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$mappers$2f$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/lib/print-mappers/types.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/print-service.ts [app-client] (ecmascript)");
;
function mapWarrantyRequestToPrintData(request, storeSettings) {
    return {
        ...(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getStoreData"])(storeSettings),
        // === THÔNG TIN CHI NHÁNH ===
        '{location_name}': request.location?.name || storeSettings.name || '',
        '{location_address}': request.location?.address || storeSettings.address || '',
        '{store_province}': storeSettings.province || '',
        '{location_province}': request.location?.province || '',
        // === THÔNG TIN PHIẾU YÊU CẦU BẢO HÀNH ===
        '{warranty_claim_card_code}': request.code,
        '{warranty_request_code}': request.warrantyRequestCode || request.code,
        '{order_code}': request.orderCode || '',
        '{created_on}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatDate"])(request.createdAt),
        '{created_on_time}': request.createdAtTime || '',
        '{modified_on}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatDate"])(request.modifiedAt),
        '{account_name}': request.createdBy || '',
        '{reference}': request.reference || '',
        '{status}': request.status || '',
        '{priority}': request.priority || '',
        // === THÔNG TIN KHÁCH HÀNG ===
        '{customer_code}': request.customerCode || '',
        '{customer_name}': request.customerName || '',
        '{customer_phone_number}': request.customerPhone || '',
        '{customer_address1}': request.customerAddress || '',
        '{customer_address}': request.customerAddress || '',
        '{customer_email}': request.customerEmail || '',
        '{customer_group}': request.customerGroup || '',
        // === THÔNG TIN SẢN PHẨM ===
        '{product_code}': request.productCode || '',
        '{product_name}': request.productName || '',
        '{serial_number}': request.serialNumber || '',
        '{purchase_date}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatDate"])(request.purchaseDate),
        '{warranty_expired_on}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatDate"])(request.warrantyExpiredOn),
        '{warranty_duration}': request.warrantyDuration || '',
        // === THÔNG TIN SỰ CỐ ===
        '{issue_type}': request.issueType || '',
        '{issue_description}': request.issueDescription || '',
        '{device_condition}': request.deviceCondition || '',
        '{accessories}': request.accessories || '',
        // === XỬ LÝ ===
        '{received_by}': request.receivedBy || '',
        '{technician_name}': request.technicianName || '',
        '{expected_completion_date}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatDate"])(request.expectedCompletionDate),
        '{note}': request.note || '',
        // === TAGS ===
        '{tag}': request.tag || '',
        // === TỔNG GIÁ TRỊ ===
        '{total_quantity}': request.totalQuantity.toString(),
        '{total_amount}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatCurrency"])(request.totalAmount)
    };
}
function mapWarrantyRequestLineItems(items) {
    return items.map((item, index)=>({
            '{line_stt}': (index + 1).toString(),
            '{line_product_name}': item.productName,
            '{line_variant_name}': item.variantName || '',
            '{line_variant_sku}': item.variantSku || '',
            '{line_variant_barcode}': item.variantBarcode || '',
            '{serials}': item.serial || '',
            '{warranty_card_code}': item.warrantyCardCode || '',
            '{line_quantity}': item.quantity.toString(),
            '{line_type}': item.requestType || '',
            '{line_received_on}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatDate"])(item.receivedOn),
            '{line_status}': item.status || '',
            '{line_expense_title}': item.expenseTitle || '',
            '{line_expense_amount}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatCurrency"])(item.expenseAmount),
            '{line_expense_total_amount}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatCurrency"])(item.expenseTotalAmount)
        }));
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/print/warranty-print-helper.ts [app-client] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

/**
 * Warranty Print Helper
 * Helpers để chuẩn bị dữ liệu in cho phiếu bảo hành và yêu cầu bảo hành
 */ __turbopack_context__.s([
    "convertWarrantyForPrint",
    ()=>convertWarrantyForPrint,
    "convertWarrantyRequestForPrint",
    ()=>convertWarrantyRequestForPrint,
    "createStoreSettings",
    ()=>createStoreSettings
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$mappers$2f$warranty$2e$mapper$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/print-mappers/warranty.mapper.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$mappers$2f$warranty$2d$request$2e$mapper$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/print-mappers/warranty-request.mapper.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/print-service.ts [app-client] (ecmascript)");
;
;
;
function convertWarrantyForPrint(warranty, options = {}) {
    const { branch, customer, creator, technician, linkedOrderId } = options;
    // Map trạng thái sang tiếng Việt
    const statusMap = {
        'received': 'Đã nhận',
        'diagnosing': 'Đang kiểm tra',
        'repairing': 'Đang sửa chữa',
        'waiting_parts': 'Chờ linh kiện',
        'completed': 'Hoàn thành',
        'returned': 'Đã trả khách',
        'cancelled': 'Đã hủy'
    };
    const typeMap = {
        'warranty': 'Bảo hành',
        'repair': 'Sửa chữa'
    };
    // Format địa chỉ khách hàng
    const customerFirstAddress = customer?.addresses?.[0];
    const customerAddressString = customerFirstAddress ? [
        customerFirstAddress.street,
        customerFirstAddress.ward,
        customerFirstAddress.district,
        customerFirstAddress.province
    ].filter(Boolean).join(', ') : warranty.customerAddress || '';
    // Get items from either items or products field
    const warrantyItems = warranty.items || warranty.products || [];
    return {
        // Thông tin cơ bản
        code: warranty.id,
        createdAt: warranty.createdAt,
        modifiedAt: warranty.updatedAt,
        createdBy: creator?.fullName || warranty.createdByName || warranty.employeeName,
        // Trạng thái
        status: statusMap[warranty.status] || warranty.status,
        // Chi nhánh
        location: branch ? {
            name: branch.name,
            address: branch.address,
            province: branch.province
        } : {
            name: warranty.branchName
        },
        // Đơn hàng gốc
        orderCode: linkedOrderId || warranty.orderId,
        // Khách hàng
        customerName: customer?.name || warranty.customerName,
        customerPhone: customer?.phone || warranty.customerPhone,
        customerAddress: customerAddressString,
        // Danh sách sản phẩm
        items: warrantyItems.map((item)=>({
                variantCode: item.productId || item.productSystemId,
                variantSku: item.sku,
                productName: item.productName,
                serialNumber: item.serialNumber,
                quantity: item.quantity,
                warrantyStartDate: item.warrantyStartDate,
                warrantyEndDate: item.warrantyEndDate,
                issue: item.issue || item.issueDescription,
                issueDescription: item.issueDescription || item.issue,
                resolution: item.resolution,
                cost: item.cost,
                note: item.note
            })),
        // Mô tả lỗi chung
        issueDescription: warrantyItems.map((p)=>p.issueDescription || p.issue).filter(Boolean).join(', '),
        note: warranty.note || warranty.notes
    };
}
function convertWarrantyRequestForPrint(request, options = {}) {
    const { branch, customer, creator } = options;
    // Map trạng thái sang tiếng Việt
    const statusMap = {
        'pending': 'Chờ xử lý',
        'approved': 'Đã duyệt',
        'rejected': 'Từ chối',
        'processing': 'Đang xử lý',
        'completed': 'Hoàn thành'
    };
    // Format địa chỉ khách hàng
    const customerFirstAddress = customer?.addresses?.[0];
    const customerAddressString = customerFirstAddress ? [
        customerFirstAddress.street,
        customerFirstAddress.ward,
        customerFirstAddress.district,
        customerFirstAddress.province
    ].filter(Boolean).join(', ') : request.customerAddress || '';
    return {
        // Thông tin cơ bản
        code: request.id,
        createdAt: request.createdAt,
        createdBy: creator?.fullName || request.createdByName,
        // Chi nhánh
        location: branch ? {
            name: branch.name,
            address: branch.address,
            province: branch.province
        } : {
            name: request.branchName
        },
        // Khách hàng
        customerName: customer?.name || request.customerName,
        customerPhone: customer?.phone || request.customerPhone,
        customerAddress: customerAddressString,
        // Danh sách sản phẩm
        items: (request.items || request.products || []).map((item)=>({
                productName: item.productName,
                quantity: item.quantity ?? 1
            })),
        totalQuantity: (request.items || request.products || []).reduce((sum, item)=>sum + (item.quantity ?? 1), 0)
    };
}
function createStoreSettings(storeInfo) {
    // Fallback lấy từ general-settings nếu storeInfo trống
    const generalSettings = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getGeneralSettings"])();
    return {
        name: storeInfo?.companyName || storeInfo?.brandName || generalSettings?.companyName || '',
        address: storeInfo?.headquartersAddress || generalSettings?.companyAddress || '',
        phone: storeInfo?.hotline || generalSettings?.phoneNumber || '',
        email: storeInfo?.email || generalSettings?.email || '',
        website: storeInfo?.website,
        taxCode: storeInfo?.taxCode,
        province: storeInfo?.province,
        logo: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getStoreLogo"])(storeInfo?.logo)
    };
}
;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=lib_69588af8._.js.map