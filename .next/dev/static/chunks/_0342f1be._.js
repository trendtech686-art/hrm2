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
"[project]/lib/sanitize.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "isHtmlSafe",
    ()=>isHtmlSafe,
    "sanitizeHtml",
    ()=>sanitizeHtml,
    "sanitizeTipTapContent",
    ()=>sanitizeTipTapContent,
    "sanitizeToText",
    ()=>sanitizeToText
]);
/**
 * HTML Sanitization Utilities
 * ═══════════════════════════════════════════════════════════════
 * Sử dụng DOMPurify để sanitize HTML content từ user input
 * Đảm bảo an toàn khi render với dangerouslySetInnerHTML
 * ═══════════════════════════════════════════════════════════════
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$dompurify$2f$dist$2f$purify$2e$es$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/dompurify/dist/purify.es.mjs [app-client] (ecmascript)");
;
/**
 * Default configuration for DOMPurify
 * - Cho phép các thẻ HTML cơ bản (p, span, strong, em, ul, ol, li, a, br, img)
 * - Cho phép styles cơ bản (color, background-color, text-align)
 * - Loại bỏ các thẻ nguy hiểm (script, iframe, form, input)
 * - Loại bỏ các event handlers (onclick, onerror, etc.)
 */ const ALLOWED_TAGS = [
    'p',
    'span',
    'div',
    'br',
    'hr',
    'h1',
    'h2',
    'h3',
    'h4',
    'h5',
    'h6',
    'strong',
    'b',
    'em',
    'i',
    'u',
    's',
    'strike',
    'ul',
    'ol',
    'li',
    'a',
    'img',
    'blockquote',
    'pre',
    'code',
    'table',
    'thead',
    'tbody',
    'tr',
    'th',
    'td',
    'sub',
    'sup'
];
const ALLOWED_ATTR = [
    'href',
    'target',
    'rel',
    'title',
    'src',
    'alt',
    'width',
    'height',
    'class',
    'id',
    'style',
    'colspan',
    'rowspan'
];
const ALLOWED_URI_REGEXP = /^(?:(?:https?|mailto|tel):|[^a-z]|[a-z+.-]+(?:[^a-z+.\-:]|$))/i;
function sanitizeHtml(dirty) {
    if (!dirty) return '';
    return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$dompurify$2f$dist$2f$purify$2e$es$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].sanitize(dirty, {
        ALLOWED_TAGS,
        ALLOWED_ATTR,
        ALLOWED_URI_REGEXP,
        // Keep safe styles
        ALLOW_DATA_ATTR: false,
        // Remove empty elements
        KEEP_CONTENT: true,
        // Force target="_blank" links to have rel="noopener noreferrer"
        ADD_ATTR: [
            'target'
        ]
    });
}
function sanitizeToText(dirty) {
    if (!dirty) return '';
    return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$dompurify$2f$dist$2f$purify$2e$es$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].sanitize(dirty, {
        ALLOWED_TAGS: [],
        KEEP_CONTENT: true
    }).trim();
}
function sanitizeTipTapContent(dirty) {
    if (!dirty) return '';
    return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$dompurify$2f$dist$2f$purify$2e$es$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].sanitize(dirty, {
        ALLOWED_TAGS: [
            ...ALLOWED_TAGS,
            'mark',
            'figure',
            'figcaption'
        ],
        ALLOWED_ATTR: [
            ...ALLOWED_ATTR,
            'data-type',
            'data-mention'
        ],
        ALLOWED_URI_REGEXP,
        KEEP_CONTENT: true
    });
}
function isHtmlSafe(html) {
    if (!html) return true;
    const sanitized = sanitizeHtml(html);
    // If sanitization changed the content significantly, it might be unsafe
    // This is a basic check - for strict validation, compare DOM structures
    return sanitized.length >= html.length * 0.9;
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
"[project]/lib/settings-sync-helper.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "bulkSaveSettingsToAPI",
    ()=>bulkSaveSettingsToAPI,
    "createSettingsSyncMiddleware",
    ()=>createSettingsSyncMiddleware,
    "fetchSettingsFromAPI",
    ()=>fetchSettingsFromAPI,
    "initializeSettingsFromAPI",
    ()=>initializeSettingsFromAPI,
    "saveSettingsToAPI",
    ()=>saveSettingsToAPI
]);
/**
 * Settings API Sync Helper
 * 
 * Helper functions to sync settings stores with PostgreSQL API
 */ const API_BASE = '/api/settings';
async function fetchSettingsFromAPI(config) {
    try {
        const params = new URLSearchParams();
        params.set('group', config.group);
        if (config.key) {
            params.set('key', config.key);
        }
        const response = await fetch(`${API_BASE}?${params.toString()}`);
        if (!response.ok) {
            throw new Error(`Failed to fetch settings: ${response.statusText}`);
        }
        const data = await response.json();
        // If specific key requested, return the value
        if (config.key && data.value !== undefined) {
            return data.value;
        }
        // Return grouped data for the specified group
        return data.grouped?.[config.group] || null;
    } catch (error) {
        console.error(`[Settings Sync] Error fetching ${config.group}:`, error);
        return null;
    }
}
async function saveSettingsToAPI(group, key, value, description) {
    try {
        const response = await fetch(API_BASE, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                group,
                key,
                value: typeof value === 'object' ? JSON.stringify(value) : value,
                description
            })
        });
        if (!response.ok) {
            throw new Error(`Failed to save setting: ${response.statusText}`);
        }
        return true;
    } catch (error) {
        console.error(`[Settings Sync] Error saving ${group}.${key}:`, error);
        return false;
    }
}
async function bulkSaveSettingsToAPI(group, settings) {
    try {
        const settingsArray = Object.entries(settings).map(([key, value])=>({
                group,
                key,
                value: typeof value === 'object' ? JSON.stringify(value) : value
            }));
        const response = await fetch(API_BASE, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                settings: settingsArray
            })
        });
        if (!response.ok) {
            throw new Error(`Failed to bulk save settings: ${response.statusText}`);
        }
        return true;
    } catch (error) {
        console.error(`[Settings Sync] Error bulk saving ${group}:`, error);
        return false;
    }
}
function createSettingsSyncMiddleware(group) {
    return (setter)=>{
        return (partialState)=>{
            // Apply local state first
            setter(partialState);
            // Sync to API in background
            if (typeof partialState === 'object' && partialState !== null) {
                bulkSaveSettingsToAPI(group, partialState).catch(console.error);
            }
        };
    };
}
async function initializeSettingsFromAPI(group, setSettings, defaultSettings) {
    const apiSettings = await fetchSettingsFromAPI({
        group
    });
    if (apiSettings) {
        // Parse JSON strings back to objects if needed
        const parsedSettings = Object.entries(apiSettings).reduce((acc, [key, value])=>{
            try {
                if (typeof value === 'string' && (value.startsWith('{') || value.startsWith('['))) {
                    acc[key] = JSON.parse(value);
                } else {
                    acc[key] = value;
                }
            } catch  {
                acc[key] = value;
            }
            return acc;
        }, {});
        setSettings({
            ...defaultSettings,
            ...parsedSettings
        });
    }
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/file-upload-api.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "FileUploadAPI",
    ()=>FileUploadAPI
]);
// API client để giao tiếp với server - Staging System
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2d$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/api-config.ts [app-client] (ecmascript)");
;
const API_BASE_URL = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2d$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getApiBaseUrl"])();
class FileUploadAPI {
    // Upload files vào staging (tạm thời)
    static async uploadToStaging(files, sessionId) {
        const formData = new FormData();
        files.forEach((file)=>{
            formData.append('files', file);
        });
        // CRITICAL FIX: sessionId in FormData doesn't work with multer
        // Send via query params instead
        const url = sessionId ? `${API_BASE_URL}/staging/upload?sessionId=${encodeURIComponent(sessionId)}` : `${API_BASE_URL}/staging/upload`;
        console.log('📤 Uploading to:', url);
        console.log('📦 Files:', files.map((f)=>`${f.name} (${(f.size / 1024).toFixed(1)}KB)`));
        let response;
        try {
            response = await fetch(url, {
                method: 'POST',
                body: formData
            });
        } catch (fetchError) {
            console.error('❌ Network fetch failed:', fetchError);
            throw new Error(`Không thể kết nối đến server (${API_BASE_URL}). Vui lòng kiểm tra server có đang chạy.`);
        }
        if (!response.ok) {
            const errorText = await response.text();
            console.error('❌ Server error:', response.status, errorText);
            throw new Error(`Server error (${response.status}): ${errorText}`);
        }
        const result = await response.json();
        if (!result.success) {
            throw new Error(result.message || 'Staging upload failed');
        }
        return {
            files: result.files,
            sessionId: result.sessionId
        };
    }
    // Confirm staging files → permanent với smart filename
    // NOTE: entitySystemId MUST be immutable (systemId) to avoid broken references
    static async confirmStagingFiles(sessionId, entitySystemId, documentType, documentName, metadata) {
        const response = await fetch(`${API_BASE_URL}/staging/confirm/${sessionId}/${entitySystemId}/${documentType}/${encodeURIComponent(documentName)}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                metadata
            })
        });
        const result = await response.json();
        if (!result.success) {
            throw new Error(result.message || 'Confirm failed');
        }
        return result.files;
    }
    // Lấy staging files theo session
    static async getStagingFiles(sessionId) {
        const response = await fetch(`${API_BASE_URL}/staging/files/${sessionId}`);
        const result = await response.json();
        if (!result.success) {
            throw new Error(result.message || 'Failed to fetch staging files');
        }
        return result.files;
    }
    // Xóa staging files (cancel)
    static async deleteStagingFiles(sessionId) {
        const response = await fetch(`${API_BASE_URL}/staging/${sessionId}`, {
            method: 'DELETE'
        });
        const result = await response.json();
        if (!result.success) {
            throw new Error(result.message || 'Delete staging failed');
        }
    }
    // Upload files lên server (legacy - direct permanent)
    // NOTE: employeeId MUST be the systemId (immutable), NOT the business ID
    static async uploadFiles(employeeId, documentType, documentName, files) {
        const formData = new FormData();
        files.forEach((file)=>{
            formData.append('files', file);
        });
        const response = await fetch(`${API_BASE_URL}/upload/${employeeId}/${documentType}/${encodeURIComponent(documentName)}`, {
            method: 'POST',
            body: formData
        });
        const result = await response.json();
        if (!result.success) {
            throw new Error(result.message || 'Upload failed');
        }
        return result.files;
    }
    // Lấy danh sách file permanent
    // NOTE: employeeId MUST be the systemId (immutable), NOT the business ID
    static async getFiles(employeeId, documentType) {
        try {
            const url = documentType ? `${API_BASE_URL}/files/${employeeId}/${documentType}` : `${API_BASE_URL}/files/${employeeId}`;
            const response = await fetch(url);
            // Check if response is ok
            if (!response.ok) {
                return []; // Return empty array instead of throwing
            }
            const result = await response.json();
            if (!result.success) {
                return []; // Return empty array instead of throwing
            }
            return result.files || [];
        } catch (error) {
            return []; // Return empty array on network error
        }
    }
    // Xóa file permanent
    static async deleteFile(fileId) {
        const response = await fetch(`${API_BASE_URL}/files/${fileId}`, {
            method: 'DELETE'
        });
        const result = await response.json();
        if (!result.success) {
            throw new Error(result.message || 'Delete failed');
        }
    }
    // Lấy URL file để hiển thị (bao gồm staging và permanent)
    static getFileUrl(file) {
        // ✅ Return relative path to use Vite proxy - avoid CORS
        // Server already returns relative path like /api/staging/files/...
        return file.url;
    }
    // Thống kê storage (chỉ permanent files)
    static async getStorageInfo() {
        const response = await fetch(`${API_BASE_URL}/storage/info`);
        const result = await response.json();
        if (!result.success) {
            throw new Error('Failed to get storage info');
        }
        return result.stats;
    }
    // Helper: Generate session ID cho staging
    static generateSessionId() {
        return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }
    static async getProductFiles(productId) {
        return this.getFiles(productId, 'products');
    }
    // Get customer files (images)
    static async getCustomerFiles(customerId) {
        try {
            const response = await fetch(`${API_BASE_URL}/files/customers/${customerId}`);
            if (!response.ok) {
                return [];
            }
            const result = await response.json();
            if (!result.success) {
                return [];
            }
            return result.files || [];
        } catch (error) {
            console.error('Failed to get customer files:', error);
            return [];
        }
    }
    // Get customer contract files
    static async getCustomerContractFiles(customerId) {
        try {
            const response = await fetch(`${API_BASE_URL}/files/customers/${customerId}/contracts`);
            if (!response.ok) {
                return [];
            }
            const result = await response.json();
            if (!result.success) {
                return [];
            }
            return result.files || [];
        } catch (error) {
            console.error('Failed to get customer contract files:', error);
            return [];
        }
    }
    // Confirm customer contract files from staging to permanent
    static async confirmCustomerContractFiles(sessionId, customerId, customerData) {
        const response = await fetch(`${API_BASE_URL}/staging/confirm/${sessionId}/customers/${customerId}/contracts`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                customerData
            })
        });
        const result = await response.json();
        if (!result.success) {
            throw new Error(result.message || 'Confirm customer contract files failed');
        }
        return result.files;
    }
    // Confirm customer images from staging to permanent
    static async confirmCustomerImages(sessionId, customerId, customerData) {
        const response = await fetch(`${API_BASE_URL}/staging/confirm/${sessionId}/customers/${customerId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                customerData
            })
        });
        const result = await response.json();
        if (!result.success) {
            throw new Error(result.message || 'Confirm customer images failed');
        }
        return result.files;
    }
    // Confirm warranty images from staging to permanent
    static async confirmWarrantyImages(sessionId, warrantyId, imageType, warrantyData) {
        const response = await fetch(`${API_BASE_URL}/staging/confirm/${sessionId}/warranty/${warrantyId}/${imageType}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                warrantyData
            })
        });
        const result = await response.json();
        if (!result.success) {
            throw new Error(result.message || 'Confirm warranty images failed');
        }
        return result.files;
    }
    // Delete staging session (cleanup on cancel)
    static async deleteStagingSession(sessionId) {
        const response = await fetch(`${API_BASE_URL}/staging/${sessionId}`, {
            method: 'DELETE'
        });
        const result = await response.json();
        if (!result.success) {
            throw new Error(result.message || 'Delete staging session failed');
        }
    }
    /**
   * Upload ảnh từ TipTap Editor vào STAGING
   * Ảnh sẽ được move sang permanent khi entity được save
   * 
   * @param file - File ảnh cần upload
   * @param sessionId - Session ID để group các ảnh cùng editor
   * @returns StagingFile với URL tạm thời
   */ static async uploadEditorImageToStaging(file, sessionId) {
        const result = await FileUploadAPI.uploadToStaging([
            file
        ], sessionId);
        return {
            file: result.files[0],
            sessionId: result.sessionId
        };
    }
    /**
   * Confirm ảnh editor từ staging sang permanent
   * Đồng thời replace staging URLs trong HTML content bằng permanent URLs
   * 
   * @param sessionId - Editor staging session
   * @param entityId - ID của entity (category, product, etc.)
   * @param entityType - Loại entity ('categories', 'products', etc.)
   * @param htmlContent - Nội dung HTML cần update URLs
   * @returns Updated HTML với permanent URLs
   */ static async confirmEditorImages(sessionId, entityId, entityType, htmlContent) {
        // Confirm staging files
        const confirmedFiles = await FileUploadAPI.confirmStagingFiles(sessionId, entityId, entityType, 'editor-images', {
            source: 'tiptap-editor'
        });
        // Replace staging URLs with permanent URLs in HTML
        let updatedHtml = htmlContent;
        for (const file of confirmedFiles){
            // Staging URL pattern: /api/staging/preview/{sessionId}/{filename}
            // Find and replace with permanent URL
            const stagingPattern = new RegExp(`/api/staging/preview/[^/]+/${file.filename.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`, 'g');
            updatedHtml = updatedHtml.replace(stagingPattern, file.url);
        }
        return {
            html: updatedHtml,
            files: confirmedFiles
        };
    }
    static async uploadCommentImage(file) {
        const formData = new FormData();
        formData.append('image', file);
        const response = await fetch(`${API_BASE_URL}/comments/upload-image`, {
            method: 'POST',
            body: formData
        });
        const result = await response.json();
        if (!response.ok || !result.success) {
            throw new Error(result.message || 'Upload ảnh bình luận thất bại');
        }
        return FileUploadAPI.mapDirectUpload(result.file, file.name);
    }
    static async uploadPrintTemplateImage(file) {
        const formData = new FormData();
        formData.append('image', file);
        const response = await fetch(`${API_BASE_URL}/print-templates/upload-image`, {
            method: 'POST',
            body: formData
        });
        const result = await response.json();
        if (!response.ok || !result.success) {
            throw new Error(result.message || 'Upload ảnh mẫu in thất bại');
        }
        return FileUploadAPI.mapDirectUpload(result.file, file.name);
    }
    static async uploadComplaintCommentImage(complaintId, file) {
        const formData = new FormData();
        formData.append('image', file);
        const response = await fetch(`${API_BASE_URL}/complaints/${complaintId}/comments/upload`, {
            method: 'POST',
            body: formData
        });
        const result = await response.json();
        if (!response.ok || !result.success) {
            throw new Error(result.message || 'Upload ảnh khiếu nại thất bại');
        }
        return FileUploadAPI.mapDirectUpload(result.file, file.name);
    }
    static async uploadTaskEvidence(taskId, files) {
        if (files.length === 0) {
            return [];
        }
        const formData = new FormData();
        files.forEach((file)=>formData.append('files', file));
        const response = await fetch(`${API_BASE_URL}/tasks/${taskId}/evidence`, {
            method: 'POST',
            body: formData
        });
        const result = await response.json();
        if (!response.ok || !result.success) {
            throw new Error(result.message || 'Upload bằng chứng công việc thất bại');
        }
        return (result.files || []).map((file, index)=>FileUploadAPI.mapDirectUpload(file, files[index]?.name || `evidence-${index}`));
    }
    static mapDirectUpload(file, fallbackName) {
        return {
            id: file.id,
            name: file.originalName || file.name || fallbackName,
            size: file.size || file.filesize || 0,
            type: file.mimetype || file.type || 'application/octet-stream',
            url: file.url,
            uploadedAt: file.uploadedAt || new Date().toISOString()
        };
    }
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/repositories/in-memory-repository.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "createInMemoryRepository",
    ()=>createInMemoryRepository
]);
const createInMemoryRepository = (stateGetter)=>{
    const getStore = ()=>stateGetter();
    const ensureEntity = (systemId)=>{
        const entity = getStore().findById(systemId);
        if (!entity) {
            throw new Error(`Không tìm thấy entity với systemId=${systemId}`);
        }
        return entity;
    };
    return {
        async list () {
            return [
                ...getStore().data
            ];
        },
        async getById (systemId) {
            return getStore().findById(systemId);
        },
        async create (payload) {
            return getStore().add(payload);
        },
        async update (systemId, payload) {
            ensureEntity(systemId);
            getStore().update(systemId, payload);
            return ensureEntity(systemId);
        },
        async softDelete (systemId) {
            ensureEntity(systemId);
            getStore().remove(systemId);
        },
        async restore (systemId) {
            ensureEntity(systemId);
            getStore().restore(systemId);
            return getStore().findById(systemId);
        },
        async hardDelete (systemId) {
            ensureEntity(systemId);
            getStore().hardDelete(systemId);
        }
    };
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/hooks/use-workflow-templates.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "clearWorkflowTemplatesCache",
    ()=>clearWorkflowTemplatesCache,
    "fetchWorkflowTemplates",
    ()=>fetchWorkflowTemplates,
    "getWorkflowTemplateSubtasks",
    ()=>getWorkflowTemplateSubtasks,
    "getWorkflowTemplateSync",
    ()=>getWorkflowTemplateSync,
    "getWorkflowTemplatesByType",
    ()=>getWorkflowTemplatesByType,
    "getWorkflowTemplatesSync",
    ()=>getWorkflowTemplatesSync,
    "useWorkflowTemplates",
    ()=>useWorkflowTemplates
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$nanoid$2f$index$2e$browser$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/nanoid/index.browser.js [app-client] (ecmascript) <locals>");
var _s = __turbopack_context__.k.signature();
;
;
// Default templates for initial setup
function getDefaultTemplates() {
    const now = new Date();
    return [
        {
            systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$nanoid$2f$index$2e$browser$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["nanoid"])(),
            id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$nanoid$2f$index$2e$browser$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["nanoid"])(),
            name: 'complaints',
            label: 'Quy trình Khiếu nại tiêu chuẩn',
            description: 'Các bước xử lý khiếu nại từ khách hàng',
            isDefault: true,
            createdAt: now,
            updatedAt: now,
            subtasks: [
                {
                    id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$nanoid$2f$index$2e$browser$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["nanoid"])(),
                    title: 'Tiếp nhận và ghi nhận',
                    completed: false,
                    order: 0,
                    createdAt: now
                },
                {
                    id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$nanoid$2f$index$2e$browser$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["nanoid"])(),
                    title: 'Phân loại và đánh giá',
                    completed: false,
                    order: 1,
                    createdAt: now
                },
                {
                    id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$nanoid$2f$index$2e$browser$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["nanoid"])(),
                    title: 'Xác minh thông tin',
                    completed: false,
                    order: 2,
                    createdAt: now
                },
                {
                    id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$nanoid$2f$index$2e$browser$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["nanoid"])(),
                    title: 'Đề xuất giải pháp',
                    completed: false,
                    order: 3,
                    createdAt: now
                },
                {
                    id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$nanoid$2f$index$2e$browser$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["nanoid"])(),
                    title: 'Thực hiện xử lý',
                    completed: false,
                    order: 4,
                    createdAt: now
                },
                {
                    id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$nanoid$2f$index$2e$browser$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["nanoid"])(),
                    title: 'Phản hồi khách hàng',
                    completed: false,
                    order: 5,
                    createdAt: now
                },
                {
                    id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$nanoid$2f$index$2e$browser$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["nanoid"])(),
                    title: 'Đánh giá kết quả',
                    completed: false,
                    order: 6,
                    createdAt: now
                }
            ]
        },
        {
            systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$nanoid$2f$index$2e$browser$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["nanoid"])(),
            id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$nanoid$2f$index$2e$browser$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["nanoid"])(),
            name: 'warranty',
            label: 'Quy trình Bảo hành tiêu chuẩn',
            description: 'Các bước xử lý bảo hành sản phẩm',
            isDefault: true,
            createdAt: now,
            updatedAt: now,
            subtasks: [
                {
                    id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$nanoid$2f$index$2e$browser$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["nanoid"])(),
                    title: 'Tiếp nhận yêu cầu',
                    completed: false,
                    order: 0,
                    createdAt: now
                },
                {
                    id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$nanoid$2f$index$2e$browser$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["nanoid"])(),
                    title: 'Kiểm tra điều kiện BH',
                    completed: false,
                    order: 1,
                    createdAt: now
                },
                {
                    id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$nanoid$2f$index$2e$browser$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["nanoid"])(),
                    title: 'Kiểm tra lỗi sản phẩm',
                    completed: false,
                    order: 2,
                    createdAt: now
                },
                {
                    id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$nanoid$2f$index$2e$browser$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["nanoid"])(),
                    title: 'Báo giá sửa chữa',
                    completed: false,
                    order: 3,
                    createdAt: now
                },
                {
                    id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$nanoid$2f$index$2e$browser$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["nanoid"])(),
                    title: 'Thực hiện sửa chữa',
                    completed: false,
                    order: 4,
                    createdAt: now
                },
                {
                    id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$nanoid$2f$index$2e$browser$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["nanoid"])(),
                    title: 'Kiểm tra chất lượng',
                    completed: false,
                    order: 5,
                    createdAt: now
                },
                {
                    id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$nanoid$2f$index$2e$browser$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["nanoid"])(),
                    title: 'Trả hàng khách',
                    completed: false,
                    order: 6,
                    createdAt: now
                }
            ]
        },
        {
            systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$nanoid$2f$index$2e$browser$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["nanoid"])(),
            id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$nanoid$2f$index$2e$browser$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["nanoid"])(),
            name: 'orders',
            label: 'Quy trình Đơn hàng tiêu chuẩn',
            description: 'Các bước xử lý đơn hàng',
            isDefault: true,
            createdAt: now,
            updatedAt: now,
            subtasks: [
                {
                    id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$nanoid$2f$index$2e$browser$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["nanoid"])(),
                    title: 'Xác nhận đơn hàng',
                    completed: false,
                    order: 0,
                    createdAt: now
                },
                {
                    id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$nanoid$2f$index$2e$browser$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["nanoid"])(),
                    title: 'Kiểm tra tồn kho',
                    completed: false,
                    order: 1,
                    createdAt: now
                },
                {
                    id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$nanoid$2f$index$2e$browser$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["nanoid"])(),
                    title: 'Chuẩn bị hàng hóa',
                    completed: false,
                    order: 2,
                    createdAt: now
                },
                {
                    id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$nanoid$2f$index$2e$browser$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["nanoid"])(),
                    title: 'Đóng gói',
                    completed: false,
                    order: 3,
                    createdAt: now
                },
                {
                    id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$nanoid$2f$index$2e$browser$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["nanoid"])(),
                    title: 'Giao hàng',
                    completed: false,
                    order: 4,
                    createdAt: now
                },
                {
                    id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$nanoid$2f$index$2e$browser$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["nanoid"])(),
                    title: 'Thu tiền',
                    completed: false,
                    order: 5,
                    createdAt: now
                },
                {
                    id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$nanoid$2f$index$2e$browser$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["nanoid"])(),
                    title: 'Hoàn tất',
                    completed: false,
                    order: 6,
                    createdAt: now
                }
            ]
        },
        {
            systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$nanoid$2f$index$2e$browser$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["nanoid"])(),
            id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$nanoid$2f$index$2e$browser$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["nanoid"])(),
            name: 'sales-returns',
            label: 'Quy trình Đổi trả hàng',
            description: 'Các bước xử lý đổi trả hàng bán',
            isDefault: true,
            createdAt: now,
            updatedAt: now,
            subtasks: [
                {
                    id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$nanoid$2f$index$2e$browser$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["nanoid"])(),
                    title: 'Tiếp nhận yêu cầu',
                    completed: false,
                    order: 0,
                    createdAt: now
                },
                {
                    id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$nanoid$2f$index$2e$browser$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["nanoid"])(),
                    title: 'Kiểm tra điều kiện',
                    completed: false,
                    order: 1,
                    createdAt: now
                },
                {
                    id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$nanoid$2f$index$2e$browser$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["nanoid"])(),
                    title: 'Kiểm tra sản phẩm',
                    completed: false,
                    order: 2,
                    createdAt: now
                },
                {
                    id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$nanoid$2f$index$2e$browser$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["nanoid"])(),
                    title: 'Xử lý hoàn tiền/đổi hàng',
                    completed: false,
                    order: 3,
                    createdAt: now
                },
                {
                    id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$nanoid$2f$index$2e$browser$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["nanoid"])(),
                    title: 'Cập nhật kho',
                    completed: false,
                    order: 4,
                    createdAt: now
                },
                {
                    id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$nanoid$2f$index$2e$browser$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["nanoid"])(),
                    title: 'Hoàn tất',
                    completed: false,
                    order: 5,
                    createdAt: now
                }
            ]
        },
        {
            systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$nanoid$2f$index$2e$browser$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["nanoid"])(),
            id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$nanoid$2f$index$2e$browser$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["nanoid"])(),
            name: 'purchase-returns',
            label: 'Quy trình Trả hàng NCC',
            description: 'Các bước trả hàng cho nhà cung cấp',
            isDefault: true,
            createdAt: now,
            updatedAt: now,
            subtasks: [
                {
                    id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$nanoid$2f$index$2e$browser$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["nanoid"])(),
                    title: 'Phát hiện sản phẩm lỗi/hỏng',
                    completed: false,
                    order: 0,
                    createdAt: now
                },
                {
                    id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$nanoid$2f$index$2e$browser$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["nanoid"])(),
                    title: 'Tạo phiếu trả hàng',
                    completed: false,
                    order: 1,
                    createdAt: now
                },
                {
                    id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$nanoid$2f$index$2e$browser$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["nanoid"])(),
                    title: 'Liên hệ NCC',
                    completed: false,
                    order: 2,
                    createdAt: now
                },
                {
                    id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$nanoid$2f$index$2e$browser$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["nanoid"])(),
                    title: 'Đóng gói trả hàng',
                    completed: false,
                    order: 3,
                    createdAt: now
                },
                {
                    id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$nanoid$2f$index$2e$browser$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["nanoid"])(),
                    title: 'Gửi hàng trả',
                    completed: false,
                    order: 4,
                    createdAt: now
                },
                {
                    id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$nanoid$2f$index$2e$browser$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["nanoid"])(),
                    title: 'Nhận hoàn tiền/đổi hàng',
                    completed: false,
                    order: 5,
                    createdAt: now
                },
                {
                    id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$nanoid$2f$index$2e$browser$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["nanoid"])(),
                    title: 'Cập nhật kho',
                    completed: false,
                    order: 6,
                    createdAt: now
                }
            ]
        },
        {
            systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$nanoid$2f$index$2e$browser$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["nanoid"])(),
            id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$nanoid$2f$index$2e$browser$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["nanoid"])(),
            name: 'stock-transfers',
            label: 'Quy trình Chuyển kho',
            description: 'Các bước chuyển hàng giữa các kho',
            isDefault: true,
            createdAt: now,
            updatedAt: now,
            subtasks: [
                {
                    id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$nanoid$2f$index$2e$browser$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["nanoid"])(),
                    title: 'Tạo phiếu chuyển kho',
                    completed: false,
                    order: 0,
                    createdAt: now
                },
                {
                    id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$nanoid$2f$index$2e$browser$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["nanoid"])(),
                    title: 'Kiểm tra tồn kho xuất',
                    completed: false,
                    order: 1,
                    createdAt: now
                },
                {
                    id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$nanoid$2f$index$2e$browser$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["nanoid"])(),
                    title: 'Lấy hàng và kiểm đếm',
                    completed: false,
                    order: 2,
                    createdAt: now
                },
                {
                    id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$nanoid$2f$index$2e$browser$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["nanoid"])(),
                    title: 'Đóng gói và ghi chú vận chuyển',
                    completed: false,
                    order: 3,
                    createdAt: now
                },
                {
                    id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$nanoid$2f$index$2e$browser$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["nanoid"])(),
                    title: 'Xuất kho nguồn',
                    completed: false,
                    order: 4,
                    createdAt: now
                },
                {
                    id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$nanoid$2f$index$2e$browser$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["nanoid"])(),
                    title: 'Vận chuyển đến kho đích',
                    completed: false,
                    order: 5,
                    createdAt: now
                },
                {
                    id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$nanoid$2f$index$2e$browser$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["nanoid"])(),
                    title: 'Nhận hàng và kiểm đếm tại kho đích',
                    completed: false,
                    order: 6,
                    createdAt: now
                },
                {
                    id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$nanoid$2f$index$2e$browser$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["nanoid"])(),
                    title: 'Nhập kho đích và hoàn tất',
                    completed: false,
                    order: 7,
                    createdAt: now
                }
            ]
        },
        {
            systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$nanoid$2f$index$2e$browser$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["nanoid"])(),
            id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$nanoid$2f$index$2e$browser$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["nanoid"])(),
            name: 'inventory-checks',
            label: 'Quy trình Kiểm kho',
            description: 'Các bước thực hiện kiểm kê hàng tồn kho',
            isDefault: true,
            createdAt: now,
            updatedAt: now,
            subtasks: [
                {
                    id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$nanoid$2f$index$2e$browser$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["nanoid"])(),
                    title: 'Lên kế hoạch kiểm kho (thời gian, phạm vi)',
                    completed: false,
                    order: 0,
                    createdAt: now
                },
                {
                    id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$nanoid$2f$index$2e$browser$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["nanoid"])(),
                    title: 'In danh sách hàng hóa cần kiểm',
                    completed: false,
                    order: 1,
                    createdAt: now
                },
                {
                    id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$nanoid$2f$index$2e$browser$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["nanoid"])(),
                    title: 'Phân công nhân sự kiểm kê',
                    completed: false,
                    order: 2,
                    createdAt: now
                },
                {
                    id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$nanoid$2f$index$2e$browser$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["nanoid"])(),
                    title: 'Thực hiện kiểm đếm thực tế',
                    completed: false,
                    order: 3,
                    createdAt: now
                },
                {
                    id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$nanoid$2f$index$2e$browser$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["nanoid"])(),
                    title: 'Ghi nhận số lượng thực tế',
                    completed: false,
                    order: 4,
                    createdAt: now
                },
                {
                    id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$nanoid$2f$index$2e$browser$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["nanoid"])(),
                    title: 'Đối chiếu với số liệu hệ thống',
                    completed: false,
                    order: 5,
                    createdAt: now
                },
                {
                    id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$nanoid$2f$index$2e$browser$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["nanoid"])(),
                    title: 'Xác định và giải trình chênh lệch',
                    completed: false,
                    order: 6,
                    createdAt: now
                },
                {
                    id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$nanoid$2f$index$2e$browser$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["nanoid"])(),
                    title: 'Duyệt và cập nhật tồn kho',
                    completed: false,
                    order: 7,
                    createdAt: now
                }
            ]
        }
    ];
}
// Parse templates from API response
function parseTemplates(data) {
    return data.map((t)=>({
            ...t,
            systemId: t.systemId || t.id,
            createdAt: new Date(t.createdAt),
            updatedAt: new Date(t.updatedAt),
            subtasks: t.subtasks.map((s)=>({
                    ...s,
                    createdAt: new Date(s.createdAt),
                    completedAt: s.completedAt ? new Date(s.completedAt) : undefined
                }))
        }));
}
// In-memory cache for templates (shared across components)
let templatesCache = null;
let cachePromise = null;
async function fetchWorkflowTemplates() {
    // Return cached if available
    if (templatesCache) {
        return templatesCache;
    }
    // Prevent multiple simultaneous fetches
    if (cachePromise) {
        return cachePromise;
    }
    cachePromise = (async ()=>{
        try {
            const res = await fetch('/api/workflow-templates');
            if (res.ok) {
                const json = await res.json();
                if (json.data && json.data.length > 0) {
                    templatesCache = parseTemplates(json.data);
                    return templatesCache;
                }
            }
        } catch (error) {
            console.error('Failed to fetch workflow templates from API:', error);
        }
        // Return default templates if API fails
        templatesCache = getDefaultTemplates();
        return templatesCache;
    })();
    const result = await cachePromise;
    cachePromise = null;
    return result;
}
async function getWorkflowTemplateSubtasks(workflowName) {
    const templates = await fetchWorkflowTemplates();
    // Find default template for this workflow
    const template = templates.find((t)=>t.name === workflowName && t.isDefault);
    if (!template) {
        // Fallback: get first template for this workflow
        const fallback = templates.find((t)=>t.name === workflowName);
        if (!fallback) return [];
        return fallback.subtasks.map((s)=>({
                ...s,
                id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$nanoid$2f$index$2e$browser$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["nanoid"])(),
                completed: false,
                completedAt: undefined
            }));
    }
    // Deep clone and reset completed status
    return template.subtasks.map((s)=>({
            ...s,
            id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$nanoid$2f$index$2e$browser$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["nanoid"])(),
            completed: false,
            completedAt: undefined
        }));
}
async function getWorkflowTemplatesByType(workflowName) {
    const templates = await fetchWorkflowTemplates();
    return templates.filter((t)=>t.name === workflowName);
}
function clearWorkflowTemplatesCache() {
    templatesCache = null;
    cachePromise = null;
}
function useWorkflowTemplates() {
    _s();
    const [templates, setTemplates] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [isLoading, setIsLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const isSavingRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(false);
    // Load templates on mount
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "useWorkflowTemplates.useEffect": ()=>{
            let mounted = true;
            const load = {
                "useWorkflowTemplates.useEffect.load": async ()=>{
                    try {
                        const data = await fetchWorkflowTemplates();
                        if (mounted) {
                            setTemplates(data);
                            setError(null);
                        }
                    } catch (err) {
                        if (mounted) {
                            setError('Failed to load templates');
                            // Use default templates on error
                            setTemplates(getDefaultTemplates());
                        }
                    } finally{
                        if (mounted) {
                            setIsLoading(false);
                        }
                    }
                }
            }["useWorkflowTemplates.useEffect.load"];
            load();
            return ({
                "useWorkflowTemplates.useEffect": ()=>{
                    mounted = false;
                }
            })["useWorkflowTemplates.useEffect"];
        }
    }["useWorkflowTemplates.useEffect"], []);
    // Save templates to database
    const saveTemplates = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useWorkflowTemplates.useCallback[saveTemplates]": async (newTemplates)=>{
            if (isSavingRef.current) return;
            isSavingRef.current = true;
            setTemplates(newTemplates);
            try {
                const res = await fetch('/api/workflow-templates', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        templates: newTemplates
                    })
                });
                if (!res.ok) {
                    throw new Error('Failed to save templates');
                }
                // Clear cache so next fetch gets fresh data
                clearWorkflowTemplatesCache();
                templatesCache = newTemplates;
                setError(null);
            } catch (err) {
                console.error('Error saving templates:', err);
                setError('Failed to save templates');
            } finally{
                isSavingRef.current = false;
            }
        }
    }["useWorkflowTemplates.useCallback[saveTemplates]"], []);
    return {
        templates,
        setTemplates: saveTemplates,
        isLoading,
        error
    };
}
_s(useWorkflowTemplates, "91Dwstr3eelgbQHPxCLLViRAfZo=");
function getWorkflowTemplatesSync() {
    if (templatesCache) {
        return templatesCache;
    }
    // Return default templates if cache not loaded
    return getDefaultTemplates();
}
function getWorkflowTemplateSync(workflowName) {
    const templates = getWorkflowTemplatesSync();
    const template = templates.find((t)=>t.name === workflowName && t.isDefault);
    if (!template) {
        const fallback = templates.find((t)=>t.name === workflowName);
        if (!fallback) return [];
        return fallback.subtasks.map((s)=>({
                ...s,
                id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$nanoid$2f$index$2e$browser$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["nanoid"])(),
                completed: false,
                completedAt: undefined
            }));
    }
    return template.subtasks.map((s)=>({
            ...s,
            id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$nanoid$2f$index$2e$browser$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["nanoid"])(),
            completed: false,
            completedAt: undefined
        }));
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/hooks/use-workflow-templates.ts [app-client] (ecmascript) <export getWorkflowTemplateSync as getWorkflowTemplate>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getWorkflowTemplate",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$use$2d$workflow$2d$templates$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getWorkflowTemplateSync"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$use$2d$workflow$2d$templates$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/hooks/use-workflow-templates.ts [app-client] (ecmascript)");
}),
"[project]/hooks/use-debounce.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useDebounce",
    ()=>useDebounce
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
;
function useDebounce(value, delay) {
    _s();
    const [debouncedValue, setDebouncedValue] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"](value);
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"]({
        "useDebounce.useEffect": ()=>{
            const handler = setTimeout({
                "useDebounce.useEffect.handler": ()=>{
                    setDebouncedValue(value);
                }
            }["useDebounce.useEffect.handler"], delay);
            return ({
                "useDebounce.useEffect": ()=>{
                    clearTimeout(handler);
                }
            })["useDebounce.useEffect"];
        }
    }["useDebounce.useEffect"], [
        value,
        delay
    ]);
    return debouncedValue;
}
_s(useDebounce, "KDuPAtDOgxm8PU6legVJOb3oOmA=");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/app/(authenticated)/customers/[systemId]/page.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$customers$2f$detail$2d$page$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/customers/detail-page.tsx [app-client] (ecmascript)");
"use client";
;
const __TURBOPACK__default__export__ = __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$customers$2f$detail$2d$page$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CustomerDetailPage"];
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=_0342f1be._.js.map