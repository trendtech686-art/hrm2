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
"[project]/lib/complaints-settings-sync.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getComplaintsNotificationsSync",
    ()=>getComplaintsNotificationsSync,
    "getComplaintsRemindersSync",
    ()=>getComplaintsRemindersSync,
    "getComplaintsSLASync",
    ()=>getComplaintsSLASync,
    "getComplaintsTemplatesSync",
    ()=>getComplaintsTemplatesSync,
    "getComplaintsTrackingSync",
    ()=>getComplaintsTrackingSync,
    "initComplaintsSettings",
    ()=>initComplaintsSettings,
    "loadComplaintsNotificationsAsync",
    ()=>loadComplaintsNotificationsAsync,
    "loadComplaintsRemindersAsync",
    ()=>loadComplaintsRemindersAsync,
    "loadComplaintsSLAAsync",
    ()=>loadComplaintsSLAAsync,
    "loadComplaintsTemplatesAsync",
    ()=>loadComplaintsTemplatesAsync,
    "loadComplaintsTrackingAsync",
    ()=>loadComplaintsTrackingAsync,
    "saveComplaintsNotificationsAsync",
    ()=>saveComplaintsNotificationsAsync,
    "saveComplaintsRemindersAsync",
    ()=>saveComplaintsRemindersAsync,
    "saveComplaintsSLAAsync",
    ()=>saveComplaintsSLAAsync,
    "saveComplaintsTemplatesAsync",
    ()=>saveComplaintsTemplatesAsync,
    "saveComplaintsTrackingAsync",
    ()=>saveComplaintsTrackingAsync
]);
/**
 * Complaints Settings Sync Utilities
 * Provides sync functions for complaints SLA, notifications, tracking, reminders settings
 * Uses in-memory cache with database as source of truth
 * 
 * NOTE: localStorage has been removed - all data comes from API/database
 */ // Default values - mutable for use as initial state
const DEFAULTS = {
    sla: {
        low: {
            responseTime: 240,
            resolveTime: 48
        },
        medium: {
            responseTime: 120,
            resolveTime: 24
        },
        high: {
            responseTime: 60,
            resolveTime: 12
        },
        urgent: {
            responseTime: 30,
            resolveTime: 4
        }
    },
    notifications: {
        emailOnCreate: true,
        emailOnAssign: true,
        emailOnVerified: false,
        emailOnResolved: true,
        emailOnOverdue: true,
        smsOnOverdue: false,
        inAppNotifications: true
    },
    tracking: {
        enabled: false,
        allowCustomerComments: false,
        showEmployeeName: true,
        showTimeline: true
    },
    reminders: {
        enabled: true,
        intervals: {
            firstReminder: 4,
            secondReminder: 8,
            escalation: 24
        },
        notifyAssignee: true,
        notifyCreator: true,
        notifyManager: true
    },
    templates: []
};
// In-memory cache for sync functions
let slaCache = null;
let notificationsCache = null;
let trackingCache = null;
let remindersCache = null;
let templatesCache = null;
// Generic fetch function
async function fetchComplaintsSetting(type) {
    try {
        const response = await fetch(`/api/complaints-settings?type=${type}`);
        if (!response.ok) throw new Error('Failed to fetch');
        return await response.json();
    } catch (error) {
        console.error(`[ComplaintsSettings] Failed to fetch ${type}:`, error);
        throw error;
    }
}
// Generic save function
async function saveComplaintsSetting(type, data) {
    try {
        const response = await fetch('/api/complaints-settings', {
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
        console.error(`[ComplaintsSettings] Failed to save ${type}:`, error);
        throw error;
    }
}
async function loadComplaintsSLAAsync() {
    try {
        const data = await fetchComplaintsSetting('sla');
        slaCache = data;
        return data;
    } catch  {
        // Return cache or defaults if API fails
        return slaCache ?? DEFAULTS.sla;
    }
}
function getComplaintsSLASync() {
    return slaCache ?? DEFAULTS.sla;
}
async function saveComplaintsSLAAsync(settings) {
    await saveComplaintsSetting('sla', settings);
    slaCache = settings;
}
async function loadComplaintsNotificationsAsync() {
    try {
        const data = await fetchComplaintsSetting('notifications');
        notificationsCache = data;
        return data;
    } catch  {
        // Return cache or defaults if API fails
        return notificationsCache ?? DEFAULTS.notifications;
    }
}
function getComplaintsNotificationsSync() {
    return notificationsCache ?? DEFAULTS.notifications;
}
async function saveComplaintsNotificationsAsync(settings) {
    await saveComplaintsSetting('notifications', settings);
    notificationsCache = settings;
}
async function loadComplaintsTrackingAsync() {
    try {
        const data = await fetchComplaintsSetting('tracking');
        trackingCache = data;
        return data;
    } catch  {
        // Return cache or defaults if API fails
        return trackingCache ?? DEFAULTS.tracking;
    }
}
function getComplaintsTrackingSync() {
    return trackingCache ?? DEFAULTS.tracking;
}
async function saveComplaintsTrackingAsync(settings) {
    await saveComplaintsSetting('tracking', settings);
    trackingCache = settings;
}
async function loadComplaintsRemindersAsync() {
    try {
        const data = await fetchComplaintsSetting('reminders');
        remindersCache = data;
        return data;
    } catch  {
        // Return cache or defaults if API fails
        return remindersCache ?? DEFAULTS.reminders;
    }
}
function getComplaintsRemindersSync() {
    return remindersCache ?? DEFAULTS.reminders;
}
async function saveComplaintsRemindersAsync(settings) {
    await saveComplaintsSetting('reminders', settings);
    remindersCache = settings;
}
async function loadComplaintsTemplatesAsync() {
    try {
        const data = await fetchComplaintsSetting('templates');
        templatesCache = data;
        return data;
    } catch  {
        // Return cache or defaults if API fails
        return templatesCache ?? DEFAULTS.templates;
    }
}
function getComplaintsTemplatesSync() {
    return templatesCache ?? [];
}
async function saveComplaintsTemplatesAsync(templates) {
    await saveComplaintsSetting('templates', templates);
    templatesCache = templates;
}
async function initComplaintsSettings() {
    await Promise.all([
        loadComplaintsSLAAsync(),
        loadComplaintsNotificationsAsync(),
        loadComplaintsTrackingAsync(),
        loadComplaintsRemindersAsync(),
        loadComplaintsTemplatesAsync()
    ]);
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
"[project]/lib/print-mappers/complaint.mapper.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "mapComplaintLineItems",
    ()=>mapComplaintLineItems,
    "mapComplaintToPrintData",
    ()=>mapComplaintToPrintData
]);
/**
 * Complaint Mapper - Phiếu khiếu nại
 * Đồng bộ với variables/phieu-khieu-nai.ts
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$mappers$2f$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/lib/print-mappers/types.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/print-service.ts [app-client] (ecmascript)");
;
const COMPLAINT_STATUS_MAP = {
    'new': 'Mới',
    'investigating': 'Đang xử lý',
    'resolved': 'Đã giải quyết',
    'closed': 'Đã đóng',
    'cancelled': 'Đã hủy'
};
const COMPLAINT_TYPE_MAP = {
    'missing-items': 'Thiếu hàng',
    'damaged-items': 'Hàng hư hỏng',
    'wrong-items': 'Sai hàng',
    'late-delivery': 'Giao hàng chậm',
    'service-quality': 'Chất lượng dịch vụ',
    'other': 'Khác'
};
function mapComplaintToPrintData(complaint, storeSettings) {
    const phone = complaint.customerPhoneHide ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$mappers$2f$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["hidePhoneMiddle"])(complaint.customerPhone || '') : complaint.customerPhone || '';
    const statusVi = COMPLAINT_STATUS_MAP[complaint.status || ''] || complaint.status || '';
    const typeVi = COMPLAINT_TYPE_MAP[complaint.complaintType || ''] || complaint.complaintType || '';
    return {
        ...(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getStoreData"])(storeSettings),
        // === THÔNG TIN CHI NHÁNH ===
        '{location_name}': complaint.location?.name || storeSettings.name || '',
        '{location_address}': complaint.location?.address || storeSettings.address || '',
        '{location_province}': complaint.location?.province || '',
        '{location_phone}': complaint.location?.phone || storeSettings.phone || '',
        '{store_province}': storeSettings.province || '',
        // === THÔNG TIN PHIẾU KHIẾU NẠI ===
        '{complaint_code}': complaint.code,
        '{created_on}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatDate"])(complaint.createdAt),
        '{created_on_time}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatTime"])(complaint.createdAt),
        '{modified_on}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatDate"])(complaint.modifiedAt),
        '{account_name}': complaint.createdBy || '',
        // === THÔNG TIN KHÁCH HÀNG ===
        '{customer_name}': complaint.customerName,
        '{customer_code}': complaint.customerCode || '',
        '{customer_phone}': phone,
        '{customer_phone_number}': phone,
        '{customer_phone_hide}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$mappers$2f$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["hidePhoneMiddle"])(complaint.customerPhone || ''),
        '{customer_email}': complaint.customerEmail || '',
        '{customer_address}': complaint.customerAddress || '',
        '{customer_group}': complaint.customerGroup || '',
        // === THÔNG TIN ĐƠN HÀNG LIÊN QUAN ===
        '{order_code}': complaint.orderCode || '',
        '{order_date}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatDate"])(complaint.orderCreatedAt),
        '{order_created_on}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatDate"])(complaint.orderCreatedAt),
        '{order_total}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatCurrency"])(complaint.orderTotal),
        // === THÔNG TIN KHIẾU NẠI ===
        '{complaint_type}': typeVi,
        '{complaint_category}': complaint.category || '',
        '{complaint_priority}': complaint.priority || '',
        '{complaint_source}': complaint.source || '',
        '{complaint_subject}': complaint.subject,
        '{complaint_description}': complaint.description,
        '{customer_request}': complaint.customerRequest || '',
        // === SẢN PHẨM LIÊN QUAN ===
        '{line_product_name}': complaint.productName || '',
        '{line_variant}': complaint.variantName || '',
        '{line_variant_code}': complaint.variantCode || '',
        // === TRẠNG THÁI & XỬ LÝ ===
        '{complaint_status}': statusVi,
        '{status}': statusVi,
        '{assigned_to}': complaint.assignedTo || '',
        '{assignee_name}': complaint.assignedTo || '',
        '{resolution}': complaint.resolution || '',
        '{resolution_note}': complaint.resolutionNote || '',
        '{resolved_on}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatDate"])(complaint.resolvedAt),
        '{resolved_on_time}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatTime"])(complaint.resolvedAt),
        '{response_deadline}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatDate"])(complaint.responseDeadline),
        // === CHI PHÍ BỒI THƯỜNG ===
        '{compensation_amount}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatCurrency"])(complaint.compensationAmount),
        '{compensation_amount_text}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["numberToWords"])(complaint.compensationAmount || 0),
        '{note}': complaint.note || '',
        '{complaint_note}': complaint.note || ''
    };
}
function mapComplaintLineItems(items) {
    if (!items) return [];
    return items.map((item, index)=>({
            '{line_stt}': (index + 1).toString(),
            '{line_product_name}': item.productName,
            '{line_variant_code}': item.variantCode || '',
            '{line_quantity}': item.quantity?.toString() || '',
            '{line_issue}': item.issue || '',
            '{line_resolution}': item.resolution || ''
        }));
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/print/complaint-print-helper.ts [app-client] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

/**
 * Complaint Print Helper
 * Helpers để chuẩn bị dữ liệu in cho phiếu khiếu nại
 */ __turbopack_context__.s([
    "convertComplaintForPrint",
    ()=>convertComplaintForPrint,
    "createStoreSettings",
    ()=>createStoreSettings
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$mappers$2f$complaint$2e$mapper$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/print-mappers/complaint.mapper.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/print-service.ts [app-client] (ecmascript)");
;
;
function convertComplaintForPrint(complaint, options = {}) {
    const { branch, customer, creator, assignee, resolver } = options;
    // Map trạng thái sang tiếng Việt
    const statusMap = {
        'open': 'Mở',
        'new': 'Mới',
        'in_progress': 'Đang xử lý',
        'investigating': 'Đang xác minh',
        'resolved': 'Đã giải quyết',
        'closed': 'Đã đóng',
        'cancelled': 'Đã hủy'
    };
    const priorityMap = {
        'low': 'Thấp',
        'medium': 'Trung bình',
        'high': 'Cao',
        'urgent': 'Khẩn cấp'
    };
    const typeMap = {
        'product': 'Sản phẩm',
        'service': 'Dịch vụ',
        'delivery': 'Giao hàng',
        'payment': 'Thanh toán',
        'missing-items': 'Thiếu hàng',
        'damaged-items': 'Hàng hư hỏng',
        'wrong-items': 'Sai hàng',
        'late-delivery': 'Giao hàng chậm',
        'service-quality': 'Chất lượng dịch vụ',
        'other': 'Khác'
    };
    // Format địa chỉ khách hàng
    const customerFirstAddress = customer?.addresses?.[0];
    const customerAddressString = customerFirstAddress ? [
        customerFirstAddress.street,
        customerFirstAddress.ward,
        customerFirstAddress.district,
        customerFirstAddress.province
    ].filter(Boolean).join(', ') : complaint.customerAddress || '';
    // Determine code - can be id or code field
    const codeValue = complaint.id || complaint.code || '';
    // Determine subject
    const subjectValue = complaint.subject || `Khiếu nại đơn hàng ${complaint.orderCode || complaint.orderId || ''}`;
    // Determine order code
    const orderCodeValue = complaint.orderCode || complaint.orderId;
    // Convert affected products to items array
    const items = complaint.affectedProducts ? complaint.affectedProducts.map((item)=>({
            productName: item.productName,
            variantCode: item.productId,
            quantity: (item.quantityMissing || 0) + (item.quantityDefective || 0) + (item.quantityExcess || 0),
            issue: item.issueType,
            resolution: item.resolutionType
        })) : undefined;
    return {
        // Thông tin cơ bản
        code: codeValue,
        createdAt: complaint.createdAt || '',
        modifiedAt: complaint.updatedAt,
        createdBy: creator?.fullName || complaint.createdByName,
        resolvedAt: complaint.resolvedAt,
        // Trạng thái
        status: complaint.status ? statusMap[complaint.status] || complaint.status : undefined,
        priority: complaint.priority ? priorityMap[complaint.priority] || complaint.priority : undefined,
        complaintType: complaint.type ? typeMap[complaint.type] || complaint.type : undefined,
        category: complaint.category,
        // Phụ trách - không fallback về ID
        assignedTo: assignee?.fullName || complaint.assigneeName || '',
        // Chi nhánh
        location: branch ? {
            name: branch.name,
            address: branch.address,
            province: branch.province
        } : complaint.branchName ? {
            name: complaint.branchName
        } : undefined,
        // Thông tin đơn hàng gốc
        orderCode: orderCodeValue,
        // Khách hàng
        customerName: customer?.name || complaint.customerName || '',
        customerCode: customer?.id,
        customerPhone: customer?.phone || complaint.customerPhone,
        customerEmail: customer?.email || complaint.customerEmail,
        customerAddress: customerAddressString,
        // Nội dung khiếu nại
        subject: subjectValue,
        description: complaint.description || '',
        resolution: complaint.resolution || complaint.proposedSolution,
        resolutionNote: complaint.resolutionNote,
        note: complaint.investigationNote || complaint.note,
        // Danh sách sản phẩm
        items
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
"[project]/app/(authenticated)/complaints/page.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$complaints$2f$page$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/complaints/page.tsx [app-client] (ecmascript)");
"use client";
;
const __TURBOPACK__default__export__ = __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$complaints$2f$page$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ComplaintsPage"];
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=_2d132bfa._.js.map