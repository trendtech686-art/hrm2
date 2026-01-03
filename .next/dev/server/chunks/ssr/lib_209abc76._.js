module.exports = [
"[project]/lib/api-config.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
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
    const meta = __TURBOPACK__import$2e$meta__;
    if (meta.env?.DEV) {
        return '/api';
    }
    return meta.env?.VITE_API_BASE_URL || 'http://localhost:3001/api';
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
}),
"[project]/lib/id-utils.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
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
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$smart$2d$prefix$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/smart-prefix.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/id-config.ts [app-ssr] (ecmascript)");
;
;
function generateSystemId(entityType, counter) {
    const config = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ID_CONFIG"][entityType];
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
    const prefix = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$smart$2d$prefix$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getPrefix"])(entityType);
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
    const prefix = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$smart$2d$prefix$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getPrefix"])(entityType);
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
}),
"[project]/lib/store-factory.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "createCrudStore",
    ()=>createCrudStore
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/zustand/esm/react.mjs [app-ssr] (ecmascript)");
// persist, createJSONStorage removed - database is now source of truth
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/id-utils.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$smart$2d$prefix$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/smart-prefix.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/id-config.ts [app-ssr] (ecmascript)");
;
;
;
;
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
    const businessPrefix = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$smart$2d$prefix$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getPrefix"])(entityType); // Vietnamese prefix for Business ID (NV, KH, DH)
    const config = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ID_CONFIG"][entityType];
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
                const newSystemId = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createSystemId"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["generateSystemId"])(entityType, newSystemIdCounter));
                // Generate or validate Business ID (if field exists)
                const finalItem = {
                    ...item
                };
                let newBusinessIdCounter = currentCounters.businessId;
                if (businessIdField in item) {
                    const customId = item[businessIdField];
                    const existingIds = get().data.map((d)=>d[businessIdField]);
                    // ✅ If customId provided, validate uniqueness
                    if (customId && customId.trim()) {
                        if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isBusinessIdUnique"])(customId, existingIds)) {
                            throw new Error(`Mã "${customId}" đã tồn tại! Vui lòng sử dụng mã khác.`);
                        }
                        finalItem[businessIdField] = customId.trim().toUpperCase();
                    } else {
                        // ✅ Auto-generate with findNextAvailableBusinessId
                        const digitCount = 6; // All entities use 6 digits
                        const result = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["findNextAvailableBusinessId"])(businessPrefix, existingIds, newBusinessIdCounter, digitCount);
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
                        const newSystemId = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createSystemId"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["generateSystemId"])(entityType, currentSystemIdCounter));
                        // Generate or validate Business ID (if field exists)
                        const finalItem = {
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
                                if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isBusinessIdUnique"])(customId, existingIds)) {
                                    throw new Error(`Mã "${customId}" đã tồn tại! Vui lòng sử dụng mã khác.`);
                                }
                                finalItem[businessIdField] = customId.trim().toUpperCase();
                            } else {
                                // ✅ Auto-generate with findNextAvailableBusinessId
                                const result = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["findNextAvailableBusinessId"])(businessPrefix, existingIds, currentBusinessIdCounter, digitCount);
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
                    if (businessId && !(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isBusinessIdUnique"])(businessId, existingIds)) {
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
                            systemId: lastItem ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getMaxSystemIdCounter"])([
                                lastItem
                            ], systemIdPrefix) : 0,
                            businessId: lastItem && options?.businessIdField ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getMaxBusinessIdCounter"])([
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
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["create"])(storeConfig);
};
}),
"[project]/lib/id-types.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
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
}),
"[project]/lib/activity-history-helper.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
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
var __TURBOPACK__imported__module__$5b$project$5d2f$contexts$2f$auth$2d$context$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/contexts/auth-context.tsx [app-ssr] (ecmascript)");
;
function getCurrentUserInfo() {
    const authInfo = (0, __TURBOPACK__imported__module__$5b$project$5d2f$contexts$2f$auth$2d$context$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getCurrentUserInfo"])();
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
}),
"[project]/lib/seed-audit.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "DEFAULT_SEED_AUTHOR",
    ()=>DEFAULT_SEED_AUTHOR,
    "buildSeedAuditFields",
    ()=>buildSeedAuditFields
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/id-types.ts [app-ssr] (ecmascript)");
;
const DEFAULT_SEED_AUTHOR = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('EMP000001');
const buildSeedAuditFields = ({ createdAt, createdBy = DEFAULT_SEED_AUTHOR, updatedAt, updatedBy })=>({
        createdAt,
        updatedAt: updatedAt ?? createdAt,
        createdBy,
        updatedBy: updatedBy ?? createdBy
    });
}),
"[project]/lib/ghtk-constants.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
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
}),
"[project]/lib/print-service.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
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
    "hidePhoneMiddle",
    ()=>hidePhoneMiddle,
    "numberToWords",
    ()=>numberToWords,
    "printDocument",
    ()=>printDocument,
    "replaceVariables",
    ()=>replaceVariables
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/settings/printer/store.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/date-utils.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$settings$2d$cache$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/settings-cache.ts [app-ssr] (ecmascript)");
;
;
;
function getGeneralSettings() {
    try {
        const settings = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$settings$2d$cache$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getGeneralSettingsSync"])();
        return {
            companyName: settings.storeName,
            companyAddress: settings.storeAddress,
            phoneNumber: settings.storePhone,
            storeName: settings.storeName,
            storeAddress: settings.storeAddress,
            storePhone: settings.storePhone,
            logoUrl: settings.logoUrl
        };
    } catch (_e) {}
    return null;
}
function getStoreLogo(storeInfoLogo) {
    if (storeInfoLogo) return storeInfoLogo;
    try {
        const settings = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$settings$2d$cache$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getGeneralSettingsSync"])();
        return settings.logoUrl || undefined;
    } catch (_e) {}
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
function hidePhoneMiddle(phone) {
    if (!phone) return '';
    if (phone.length < 6) return phone;
    const start = phone.slice(0, 3);
    const end = phone.slice(-3);
    return `${start}****${end}`;
}
function formatDate(date) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatDateForDisplay"])(date);
}
function formatTime(date) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatTimeForDisplay"])(date);
}
function formatDateTime(date) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatDateTimeForDisplay"])(date);
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
    const store = __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["usePrintTemplateStore"].getState();
    const defaultSize = store.getDefaultSize(templateType);
    const template = store.getTemplate(templateType, defaultSize, branchId);
    let html = template.content;
    // Replace variables
    html = replaceVariables(html, data);
    return html;
}
function printDocument(templateType, data, options) {
    const store = __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["usePrintTemplateStore"].getState();
    const paperSize = options?.paperSize || store.getDefaultSize(templateType);
    const template = store.getTemplate(templateType, paperSize, options?.branchId);
    // Generate HTML content
    const html = replaceVariables(template.content, data);
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
    const store = __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["usePrintTemplateStore"].getState();
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
}),
"[project]/lib/use-print.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "usePrint",
    ()=>usePrint
]);
/**
 * Hook để sử dụng Print Service trong các component
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/print-service.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/settings/printer/store.ts [app-ssr] (ecmascript)");
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
 */ function processConditionals(html, data, _lineItems) {
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
    const templateStore = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["usePrintTemplateStore"])();
    const [isLoading] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"](false);
    const getTemplateContent = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"]((type, paperSize, branchId)=>{
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
    }, [
        templateStore,
        currentBranchId
    ]);
    const processTemplate = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"]((templateContent, data, lineItems)=>{
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
                html = html.replace(lineItemsBlockPattern, (match, blockContent)=>{
                    return lineItems.map((item, index)=>{
                        let itemHtml = blockContent;
                        // Thêm {line_index}
                        itemHtml = itemHtml.replace(/\{line_index\}/g, String(index + 1));
                        // Replace các biến từ item (line item data)
                        Object.entries(item).forEach(([key, value])=>{
                            const placeholder = key.startsWith('{') ? key : `{${key}}`;
                            const regex = new RegExp(placeholder.replace(/[{}]/g, '\\$&'), 'g');
                            itemHtml = itemHtml.replace(regex, value?.toString() || '');
                        });
                        // Replace các biến global (data) cho mỗi item page
                        Object.entries(data).forEach(([key, value])=>{
                            const placeholder = key.startsWith('{') ? key : `{${key}}`;
                            const regex = new RegExp(placeholder.replace(/[{}]/g, '\\$&'), 'g');
                            itemHtml = itemHtml.replace(regex, value?.toString() || '');
                        });
                        return itemHtml;
                    }).join('\n');
                });
            // Đã xử lý xong line items theo block mode, skip table mode
            } else {
                // === XỬ LÝ TABLE MODE (cũ) ===
                // Tìm tất cả các table trong template
                const tablePattern = /<table[^>]*>[\s\S]*?<\/table>/gi;
                const tables = html.match(tablePattern);
                if (tables) {
                    // Tìm table chứa {line_stt} - đây là bảng line items
                    const lineItemsTable = tables.find((table)=>table.includes('{line_stt}'));
                    if (lineItemsTable) {
                        // Tìm tbody trong table này
                        const tbodyMatch = lineItemsTable.match(/<tbody[^>]*>([\s\S]*?)<\/tbody>/i);
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
                                const rowsHtml = lineItems.map((item)=>{
                                    let row = templateRow;
                                    // Xử lý điều kiện cho line item trước
                                    row = processLineItemConditionals(row, item);
                                    Object.entries(item).forEach(([key, value])=>{
                                        const placeholder = key.startsWith('{') ? key : `{${key}}`;
                                        const regex = new RegExp(placeholder.replace(/[{}]/g, '\\$&'), 'g');
                                        row = row.replace(regex, value?.toString() || '');
                                    });
                                    return row;
                                }).join('\n    ');
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
                                const templateRow = allRows.find((row)=>row.includes('{line_stt}')) || allRows[0];
                                // Tạo các row mới từ template
                                const rowsHtml = lineItems.map((item)=>{
                                    let row = templateRow;
                                    // Xử lý điều kiện cho line item trước
                                    row = processLineItemConditionals(row, item);
                                    // Replace từng biến trong item
                                    Object.entries(item).forEach(([key, value])=>{
                                        const placeholder = key.startsWith('{') ? key : `{${key}}`;
                                        const regex = new RegExp(placeholder.replace(/[{}]/g, '\\$&'), 'g');
                                        row = row.replace(regex, value?.toString() || '');
                                    });
                                    return row;
                                }).join('\n    ');
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
        html = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["replaceVariables"])(html, data);
        return html;
    }, []);
    const print = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"]((type, options)=>{
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
    }, [
        templateStore,
        getTemplateContent,
        processTemplate
    ]);
    /**
   * In nhiều tài liệu cùng lúc - gộp thành 1 document với page break giữa các tài liệu
   */ const printMultiple = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"]((type, optionsList)=>{
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
        const allHtmlParts = optionsList.map((options, index)=>{
            const html = processTemplate(templateContent, options.data, options.lineItems);
            // Thêm page break sau mỗi document (trừ document cuối)
            if (index < optionsList.length - 1) {
                return `<div class="print-page" style="page-break-after: always; break-after: page;">${html}</div>`;
            }
            return `<div class="print-page-last">${html}</div>`;
        });
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
    }, [
        templateStore,
        getTemplateContent,
        processTemplate
    ]);
    /**
   * In nhiều loại tài liệu khác nhau cùng lúc - gộp thành 1 popup duy nhất
   * Ví dụ: In đơn hàng + phiếu giao hàng + phiếu đóng gói trong 1 lần
   */ const printMixedDocuments = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"]((documents)=>{
        if (documents.length === 0) return;
        // Xử lý từng document và gộp lại với page break
        const allHtmlParts = [];
        documents.forEach((doc, docIndex)=>{
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
        });
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
    }, [
        templateStore,
        getTemplateContent,
        processTemplate
    ]);
    const getPreview = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"]((type, options)=>{
        const { data, lineItems, paperSize, branchId } = options;
        // Lấy template content
        const templateContent = getTemplateContent(type, paperSize, branchId);
        if (!templateContent) {
            return '<p style="color: red;">Không tìm thấy mẫu in</p>';
        }
        // Xử lý template
        return processTemplate(templateContent, data, lineItems);
    }, [
        getTemplateContent,
        processTemplate
    ]);
    const hasTemplate = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"]((type, paperSize)=>{
        const size = paperSize || templateStore.getDefaultSize(type);
        const template = templateStore.getTemplate(type, size, currentBranchId);
        return !!template?.content;
    }, [
        templateStore,
        currentBranchId
    ]);
    const getAvailableSizes = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"]((type)=>{
        const sizes = [
            'K57',
            'K80',
            'A4',
            'A5'
        ];
        return sizes.filter((size)=>{
            const template = templateStore.getTemplate(type, size, currentBranchId);
            return !!template?.content;
        });
    }, [
        templateStore,
        currentBranchId
    ]);
    const getDefaultSize = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"]((type)=>{
        return templateStore.getDefaultSize(type);
    }, [
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
}),
"[project]/lib/print-mappers/types.ts [app-ssr] (ecmascript) <locals>", ((__turbopack_context__) => {
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
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/print-service.ts [app-ssr] (ecmascript)");
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
}),
"[project]/lib/print-mappers/packing.mapper.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "mapPackingCompositeLineItems",
    ()=>mapPackingCompositeLineItems,
    "mapPackingLineItems",
    ()=>mapPackingLineItems,
    "mapPackingToPrintData",
    ()=>mapPackingToPrintData
]);
/**
 * Packing Mapper - Phiếu đóng gói
 * Đồng bộ với variables/phieu-dong-goi.ts
 * 
 * Variables coverage: 100%
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$mappers$2f$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/lib/print-mappers/types.ts [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/print-service.ts [app-ssr] (ecmascript)");
;
function mapPackingToPrintData(packing, storeSettings) {
    const phone = packing.customerPhoneHide ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$mappers$2f$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["hidePhoneMiddle"])(packing.customerPhone || '') : packing.customerPhone || '';
    return {
        ...(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getStoreData"])(storeSettings),
        // === THÔNG TIN CỬA HÀNG / CHI NHÁNH ===
        '{location_name}': packing.location?.name || storeSettings.name || '',
        '{location_address}': packing.location?.address || storeSettings.address || '',
        '{location_province}': packing.location?.province || '',
        '{location_country}': packing.location?.country || 'Việt Nam',
        '{location_phone}': packing.location?.phone || storeSettings.phone || '',
        '{store_province}': storeSettings.province || '',
        // === THÔNG TIN PHIẾU ĐÓNG GÓI ===
        '{fulfillment_code}': packing.code,
        '{packing_code}': packing.code,
        '{order_code}': packing.orderCode,
        '{created_on}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatDate"])(packing.createdAt),
        '{created_on_time}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatTime"])(packing.createdAt),
        '{modified_on}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatDate"])(packing.modifiedAt),
        '{modified_on_time}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatTime"])(packing.modifiedAt),
        '{packed_on}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatDate"])(packing.packedAt),
        '{packed_on_time}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatTime"])(packing.packedAt),
        '{shipped_on}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatDate"])(packing.shippedAt),
        '{shipped_on_time}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatTime"])(packing.shippedAt),
        '{account_name}': packing.createdBy || '',
        '{assigned_employee}': packing.assignedEmployee || '',
        '{fulfillment_status}': packing.fulfillmentStatus || '',
        // === THÔNG TIN KHÁCH HÀNG ===
        '{customer_name}': packing.customerName,
        '{customer_code}': packing.customerCode || '',
        '{customer_phone}': phone,
        '{customer_phone_number}': phone,
        '{customer_phone_number_hide}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$mappers$2f$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["hidePhoneMiddle"])(packing.customerPhone || ''),
        '{customer_email}': packing.customerEmail || '',
        '{customer_address}': packing.customerAddress || '',
        '{billing_address}': packing.billingAddress || '',
        // === THÔNG TIN GIAO HÀNG ===
        '{shipping_address}': packing.shippingAddress,
        '{shipping_province}': packing.shippingProvince || '',
        '{shipping_district}': packing.shippingDistrict || '',
        '{shipping_ward}': packing.shippingWard || '',
        // === TỔNG GIÁ TRỊ ===
        '{total_quantity}': (packing.totalQuantity ?? 0).toString(),
        '{subtotal}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatCurrency"])(packing.subtotal || 0),
        '{total_discounts}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatCurrency"])(packing.totalDiscount || 0),
        '{fulfillment_discount}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatCurrency"])(packing.fulfillmentDiscount || packing.totalDiscount || 0),
        '{total_tax}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatCurrency"])(packing.totalTax || 0),
        '{total_extra_tax}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatCurrency"])(packing.totalExtraTax || 0),
        '{total_tax_included_line}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatCurrency"])(packing.totalTaxIncludedLine || 0),
        '{total_amount_before_tax}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatCurrency"])(packing.totalAmountBeforeTax || 0),
        '{total_amount_after_tax}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatCurrency"])(packing.totalAmountAfterTax || 0),
        '{total}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatCurrency"])(packing.total || 0),
        '{total_amount}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatCurrency"])(packing.totalAmount || packing.total || 0),
        '{total_amount_text}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["numberToWords"])(packing.totalAmount || packing.total || 0),
        '{total_weight}': packing.totalWeight?.toString() || '',
        '{cod}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatCurrency"])(packing.codAmount),
        '{cod_amount}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatCurrency"])(packing.codAmount || 0),
        '{cod_amount_text}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["numberToWords"])(packing.codAmount || 0),
        // === GHI CHÚ ===
        '{packing_note}': packing.note || '',
        '{package_note}': packing.packageNote || packing.note || '',
        '{note}': packing.note || '',
        '{order_note}': packing.orderNote || ''
    };
}
function mapPackingLineItems(items) {
    return items.map((item, index)=>({
            '{line_stt}': (index + 1).toString(),
            '{line_variant_code}': item.variantCode || '',
            '{line_product_name}': item.productName,
            '{line_product_name_variant_name}': item.productNameVariantName || `${item.productName}${item.variantName ? ' - ' + item.variantName : ''}`,
            '{line_variant}': item.variantName || '',
            '{line_variant_name}': item.variantName || '',
            '{line_variant_barcode}': item.barcode || '',
            '{line_unit}': item.unit || 'Cái',
            '{line_quantity}': item.quantity.toString(),
            '{line_price}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatCurrency"])(item.price || 0),
            '{line_price_after_discount}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatCurrency"])(item.priceAfterDiscount || item.price || 0),
            '{line_discount_rate}': item.discountRate ? `${item.discountRate}%` : '',
            '{line_discount_amount}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatCurrency"])(item.discountAmount),
            '{line_tax_rate}': item.taxRate ? `${item.taxRate}%` : '',
            '{line_tax_amount}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatCurrency"])(item.taxAmount),
            '{line_tax_included}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatCurrency"])(item.taxIncluded || 0),
            '{line_tax_exclude}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatCurrency"])(item.taxExclude || 0),
            '{line_tax}': item.taxName || '',
            '{line_amount}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatCurrency"])(item.amount || 0),
            '{line_product_brand}': item.brand || '',
            '{line_brand}': item.brand || '',
            '{line_product_category}': item.category || '',
            '{line_category}': item.category || '',
            '{line_variant_options}': item.variantOptions || '',
            '{line_weight}': item.weight?.toString() || '',
            '{line_weight_unit}': item.weightUnit || 'g',
            '{bin_location}': item.binLocation || '',
            '{line_note}': item.note || '',
            // Serial/Lot
            '{serials}': item.serial || '',
            '{lots_number_code1}': item.lotNumber || '',
            '{lots_number_code2}': item.lotWithQty || '',
            '{lots_number_code3}': item.lotWithDates || '',
            '{lots_number_code4}': item.lotWithDatesQty || '',
            // Composite
            '{line_composite_variant_code}': item.compositeVariantCode || '',
            '{line_composite_variant_name}': item.compositeVariantName || '',
            '{line_composite_unit}': item.compositeUnit || '',
            '{line_composite_quantity}': item.compositeQuantity?.toString() || ''
        }));
}
function mapPackingCompositeLineItems(compositeItems) {
    if (!compositeItems) return [];
    const results = [];
    let stt = 1;
    for (const item of compositeItems){
        if (item.compositeComponents) {
            for (const component of item.compositeComponents){
                results.push({
                    '{line_stt}': stt.toString(),
                    '{composite_product_name}': item.productName,
                    '{composite_component_name}': component.componentName,
                    '{composite_quantity}': component.quantity.toString()
                });
                stt++;
            }
        }
    }
    return results;
}
}),
"[project]/lib/print-mappers/shipping-label.mapper.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "mapShippingLabelToPrintData",
    ()=>mapShippingLabelToPrintData
]);
/**
 * Shipping Label Mapper - Nhãn giao hàng
 * Đồng bộ với variables/nhan-giao-hang.ts
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$mappers$2f$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/lib/print-mappers/types.ts [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/print-service.ts [app-ssr] (ecmascript)");
;
// Helper function để tạo barcode image
function generateBarcodeImage(code, height = 50) {
    if (!code) return '';
    // Sử dụng barcodeapi.org - CODE128 format
    return `<img src="https://barcodeapi.org/api/128/${encodeURIComponent(code)}" style="height:${height}px" alt="barcode"/>`;
}
// Helper function để tạo QR code image  
function generateQRCodeImage(code, size = 100) {
    if (!code) return '';
    // Sử dụng quickchart.io cho QR code
    return `<img src="https://quickchart.io/qr?text=${encodeURIComponent(code)}&size=${size}" style="width:${size}px;height:${size}px" alt="qrcode"/>`;
}
function mapShippingLabelToPrintData(label, storeSettings) {
    return {
        ...(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getStoreData"])(storeSettings),
        // === THÔNG TIN CHI NHÁNH ===
        '{location_name}': label.location?.name || storeSettings.name || '',
        '{location_address}': label.location?.address || storeSettings.address || '',
        '{location_phone_number}': label.location?.phone || storeSettings.phone || '',
        '{location_province}': label.location?.province || '',
        '{store_province}': storeSettings.province || '',
        // === THÔNG TIN ĐƠN HÀNG ===
        '{order_code}': label.orderCode,
        '{order_qr_code}': label.orderQrCode ? `<img src="${label.orderQrCode}" style="max-width:100px;max-height:100px"/>` : '',
        '{order_bar_code}': label.orderBarCode ? `<img src="${label.orderBarCode}" style="max-height:50px"/>` : '',
        '{created_on}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatDate"])(label.createdAt),
        '{created_on_time}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatTime"])(label.createdAt),
        '{modified_on}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatDate"])(label.modifiedAt),
        '{modified_on_time}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatTime"])(label.modifiedAt),
        '{received_on}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatDate"])(label.receivedOn),
        '{received_on_time}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatTime"])(label.receivedOn),
        '{packed_on}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatDate"])(label.packedOn),
        '{packed_on_time}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatTime"])(label.packedOn),
        '{shipped_on_time}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatTime"])(label.shippedOn),
        '{account_name}': label.createdBy || '',
        '{creator_name}': label.creatorName || label.createdBy || '',
        '{status}': label.status || '',
        '{pushing_status}': label.pushingStatus || '',
        // === THÔNG TIN KHÁCH HÀNG ===
        '{customer_name}': label.customerName,
        '{customer_phone_number}': label.customerPhone || '',
        '{customer_phone_number_hide}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$mappers$2f$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["hidePhoneMiddle"])(label.customerPhone),
        '{customer_email}': label.customerEmail || '',
        '{shipping_address}': label.shippingAddress,
        '{billing_address}': label.billingAddress || '',
        '{city}': label.city || '',
        '{district}': label.district || '',
        // === THÔNG TIN NGƯỜI NHẬN ===
        '{receiver_name}': label.receiverName || label.customerName,
        '{receiver_phone}': label.receiverPhone || label.customerPhone || '',
        '{receiver_phone_hide}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$mappers$2f$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["hidePhoneMiddle"])(label.receiverPhone || label.customerPhone),
        // === THÔNG TIN VẬN CHUYỂN ===
        '{tracking_number}': label.trackingCode || '',
        '{shipment_code}': label.trackingCode || '',
        '{shipment_barcode}': generateBarcodeImage(label.trackingCode, 50),
        '{shipment_qrcode}': generateQRCodeImage(label.trackingCode, 100),
        '{tracking_number_qr_code}': label.trackingQrCode ? `<img src="${label.trackingQrCode}" style="max-width:100px;max-height:100px"/>` : generateQRCodeImage(label.trackingCode, 100),
        '{tracking_number_bar_code}': label.trackingBarCode ? `<img src="${label.trackingBarCode}" style="max-height:50px"/>` : generateBarcodeImage(label.trackingCode, 50),
        '{delivery_service_provider}': label.carrierName || '',
        '{partner_name}': label.carrierName || '',
        '{delivery_type}': label.deliveryType || '',
        '{service_name}': label.serviceName || '',
        '{partner_type}': label.partnerType || '',
        '{partner_phone_number}': label.partnerPhone || '',
        // === VNPOST ===
        '{vnpost_crm_code}': label.vnpostCrmCode || '',
        '{vnpost_crm_bar_code}': label.vnpostCrmBarCode ? `<img src="${label.vnpostCrmBarCode}" style="max-height:50px"/>` : '',
        // === SAPO EXPRESS ===
        '{route_code_se}': label.routeCodeSe || '',
        '{sorting_code}': label.sortingCode || '',
        '{sorting_code_bar_code}': label.sortingCodeBarCode ? `<img src="${label.sortingCodeBarCode}" style="max-height:50px"/>` : '',
        // === NGÀY GIAO ===
        '{ship_on_min}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatDate"])(label.shipOnMin),
        '{ship_on_max}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatDate"])(label.shipOnMax),
        // === TỔNG GIÁ TRỊ ===
        '{total_quantity}': label.totalItems.toString(),
        '{total}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatCurrency"])(label.total),
        '{total_tax}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatCurrency"])(label.totalTax),
        '{delivery_fee}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatCurrency"])(label.deliveryFee),
        '{cod_amount}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatCurrency"])(label.codAmount),
        '{cod}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatCurrency"])(label.codAmount),
        '{total_amount}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatCurrency"])(label.totalAmount),
        '{fulfillment_discount}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatCurrency"])(label.fulfillmentDiscount),
        '{freight_amount}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatCurrency"])(label.freightAmount),
        '{shipper_deposits}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatCurrency"])(label.shipperDeposits),
        '{packing_weight}': label.packingWeight?.toString() || '',
        // Khối lượng - đổi đơn vị
        '{total_weight_g}': label.packingWeight ? Math.round(label.packingWeight * 1000).toString() : '0',
        '{total_weight_kg}': label.packingWeight?.toString() || '0',
        '{reason_cancel}': label.reasonCancel || '',
        '{shipment_note}': label.note || '',
        '{note}': label.note || ''
    };
}
}),
"[project]/lib/print-mappers/delivery.mapper.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "mapDeliveryLineItems",
    ()=>mapDeliveryLineItems,
    "mapDeliveryToPrintData",
    ()=>mapDeliveryToPrintData
]);
/**
 * Delivery Mapper - Phiếu giao hàng
 * Đồng bộ với variables/phieu-giao-hang.ts
 * 
 * Variables coverage: 100%
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/print-service.ts [app-ssr] (ecmascript)");
;
// Helper function để tạo barcode image
function generateBarcodeImage(code, height = 50) {
    if (!code) return '';
    return `<img src="https://barcodeapi.org/api/128/${encodeURIComponent(code)}" style="height:${height}px" alt="barcode"/>`;
}
// Helper function để tạo QR code image  
function generateQRCodeImage(code, size = 100) {
    if (!code) return '';
    return `<img src="https://quickchart.io/qr?text=${encodeURIComponent(code)}&size=${size}" style="width:${size}px;height:${size}px" alt="qrcode"/>`;
}
function mapDeliveryToPrintData(delivery, storeSettings) {
    return {
        ...(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getStoreData"])(storeSettings),
        // === THÔNG TIN CỬA HÀNG / CHI NHÁNH ===
        '{location_name}': delivery.location?.name || storeSettings.name || '',
        '{location_address}': delivery.location?.address || storeSettings.address || '',
        '{location_phone_number}': delivery.location?.phone || storeSettings.phone || '',
        '{location_province}': delivery.location?.province || '',
        '{store_province}': storeSettings.province || '',
        // === THÔNG TIN PHIẾU GIAO HÀNG ===
        '{delivery_code}': delivery.code,
        '{order_code}': delivery.orderCode,
        '{order_qr_code}': generateQRCodeImage(delivery.orderCode, 100),
        '{order_bar_code}': generateBarcodeImage(delivery.orderCode, 50),
        '{created_on}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatDate"])(delivery.createdAt),
        '{created_on_time}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatTime"])(delivery.createdAt),
        '{shipped_on}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatDate"])(delivery.shippedAt),
        '{shipped_on_time}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatTime"])(delivery.shippedAt),
        '{account_name}': delivery.createdBy || '',
        '{shipper_name}': delivery.shipperName || '',
        '{delivery_status}': delivery.deliveryStatus || '',
        // === THÔNG TIN VẬN CHUYỂN ===
        '{tracking_number}': delivery.trackingCode || '',
        '{tracking_number_qr_code}': generateQRCodeImage(delivery.trackingCode, 100),
        '{tracking_number_bar_code}': generateBarcodeImage(delivery.trackingCode, 50),
        '{shipment_barcode}': generateBarcodeImage(delivery.trackingCode, 50),
        '{shipment_qrcode}': generateQRCodeImage(delivery.trackingCode, 100),
        '{carrier_name}': delivery.carrierName || '',
        '{partner_name}': delivery.carrierName || '',
        '{delivery_type}': delivery.deliveryType || '',
        '{service_name}': delivery.serviceName || '',
        // === THÔNG TIN KHÁCH HÀNG ===
        '{customer_name}': delivery.customerName,
        '{customer_code}': delivery.customerCode || '',
        '{customer_phone_number}': delivery.customerPhone || '',
        '{customer_phone_number_hide}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["hidePhoneMiddle"])(delivery.customerPhone),
        '{customer_email}': delivery.customerEmail || '',
        // === THÔNG TIN NGƯỜI NHẬN ===
        '{receiver_name}': delivery.receiverName || delivery.customerName,
        '{receiver_phone}': delivery.receiverPhone || delivery.customerPhone || '',
        '{receiver_phone_hide}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["hidePhoneMiddle"])(delivery.receiverPhone || delivery.customerPhone),
        '{shipping_address}': delivery.shippingAddress,
        '{city}': delivery.city || '',
        '{district}': delivery.district || '',
        '{ward}': delivery.ward || '',
        // === TỔNG GIÁ TRỊ ===
        '{total_quantity}': (delivery.totalQuantity ?? 0).toString(),
        '{total_weight}': delivery.totalWeight?.toString() || '',
        '{total}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatCurrency"])(delivery.subtotal || 0),
        '{delivery_fee}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatCurrency"])(delivery.deliveryFee || 0),
        '{cod_amount}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatCurrency"])(delivery.codAmount || 0),
        '{cod_amount_text}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["numberToWords"])(delivery.codAmount || 0),
        '{total_amount}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatCurrency"])(delivery.totalAmount || 0),
        '{total_text}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["numberToWords"])(delivery.totalAmount || 0),
        '{note}': delivery.note || ''
    };
}
function mapDeliveryLineItems(items) {
    return items.map((item, index)=>({
            '{line_stt}': (index + 1).toString(),
            '{line_variant_code}': item.variantCode || '',
            '{line_product_name}': item.productName,
            '{line_variant}': item.variantName || '',
            '{line_variant_barcode}': item.barcode || '',
            '{line_unit}': item.unit || 'Cái',
            '{line_quantity}': item.quantity.toString(),
            '{line_price}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatCurrency"])(item.price || 0),
            '{line_amount}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatCurrency"])(item.amount || 0),
            '{line_weight}': item.weight?.toString() || '',
            '{line_note}': item.note || '',
            '{serials}': item.serial || '',
            '{lots_number_code1}': item.lotNumber || ''
        }));
}
}),
"[project]/lib/print-mappers/receipt.mapper.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "mapReceiptToPrintData",
    ()=>mapReceiptToPrintData
]);
/**
 * Receipt Mapper - Phiếu thu
 * Đồng bộ với variables/phieu-thu.ts
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/print-service.ts [app-ssr] (ecmascript)");
;
function mapReceiptToPrintData(receipt, storeSettings) {
    return {
        ...(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getStoreData"])(storeSettings),
        // === THÔNG TIN CHI NHÁNH ===
        '{location_name}': receipt.location?.name || storeSettings.name || '',
        '{location_address}': receipt.location?.address || storeSettings.address || '',
        '{location_province}': receipt.location?.province || '',
        '{store_province}': storeSettings.province || '',
        // === THÔNG TIN PHIẾU THU ===
        '{receipt_voucher_code}': receipt.code,
        '{receipt_barcode}': `<img src="https://barcodeapi.org/api/128/${encodeURIComponent(receipt.code)}" style="height:40px"/>`,
        '{created_on}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatDate"])(receipt.createdAt),
        '{issued_on}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatDate"])(receipt.issuedAt || receipt.createdAt),
        '{issued_on_time}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatTime"])(receipt.issuedAt || receipt.createdAt),
        '{account_name}': receipt.createdBy || '',
        '{group_name}': receipt.groupName || '',
        '{counted}': receipt.counted ? 'Có' : 'Không',
        // === THÔNG TIN NGƯỜI NỘP ===
        '{object_name}': receipt.payerName,
        '{object_phone_number}': receipt.payerPhone || '',
        '{object_address}': receipt.payerAddress || '',
        '{object_type}': receipt.payerType || '',
        // === GIÁ TRỊ ===
        '{amount}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatCurrency"])(receipt.amount),
        '{amount_text}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["numberToWords"])(receipt.amount),
        '{total_text}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["numberToWords"])(receipt.amount),
        '{payment_method_name}': receipt.paymentMethod || 'Tiền mặt',
        '{payment_method}': receipt.paymentMethod || 'Tiền mặt',
        '{reference}': receipt.reference || '',
        '{document_root_code}': receipt.documentRootCode || '',
        '{note}': receipt.note || '',
        '{description}': receipt.description || receipt.note || '',
        // === NỢ KHÁCH HÀNG ===
        '{customer_debt}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatCurrency"])(receipt.customerDebt),
        '{customer_debt_text}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["numberToWords"])(receipt.customerDebt || 0),
        '{customer_debt_prev}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatCurrency"])(receipt.customerDebtPrev),
        '{customer_debt_prev_text}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["numberToWords"])(receipt.customerDebtPrev || 0),
        '{customer_debt_before_create_receipt}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatCurrency"])(receipt.customerDebtBefore),
        '{customer_debt_before_create_receipt_text}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["numberToWords"])(receipt.customerDebtBefore || 0),
        '{customer_debt_after_create_receipt}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatCurrency"])(receipt.customerDebtAfter),
        '{customer_debt_after_create_receipt_text}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["numberToWords"])(receipt.customerDebtAfter || 0),
        // === NỢ NHÀ CUNG CẤP ===
        '{supplier_debt}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatCurrency"])(receipt.supplierDebt),
        '{supplier_debt_text}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["numberToWords"])(receipt.supplierDebt || 0),
        '{supplier_debt_prev}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatCurrency"])(receipt.supplierDebtPrev),
        '{supplier_debt_prev_text}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["numberToWords"])(receipt.supplierDebtPrev || 0),
        '{supplier_debt_before_create_receipt}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatCurrency"])(receipt.supplierDebtBefore),
        '{supplier_debt_before_create_receipt_text}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["numberToWords"])(receipt.supplierDebtBefore || 0),
        '{supplier_debt_after_create_receipt}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatCurrency"])(receipt.supplierDebtAfter),
        '{supplier_debt_after_create_receipt_text}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["numberToWords"])(receipt.supplierDebtAfter || 0)
    };
}
}),
"[project]/lib/print-mappers/payment.mapper.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "mapPaymentToPrintData",
    ()=>mapPaymentToPrintData
]);
/**
 * Payment Mapper - Phiếu chi
 * Đồng bộ với variables/phieu-chi.ts
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/print-service.ts [app-ssr] (ecmascript)");
;
// Helper function để tạo barcode image
function generateBarcodeImage(code, height = 50) {
    if (!code) return '';
    return `<img src="https://barcodeapi.org/api/128/${encodeURIComponent(code)}" style="height:${height}px" alt="barcode"/>`;
}
function mapPaymentToPrintData(payment, storeSettings) {
    return {
        ...(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getStoreData"])(storeSettings),
        // === THÔNG TIN CHI NHÁNH ===
        '{location_name}': payment.location?.name || storeSettings.name || '',
        '{location_address}': payment.location?.address || storeSettings.address || '',
        '{location_province}': payment.location?.province || '',
        '{store_province}': storeSettings.province || '',
        // === THÔNG TIN PHIẾU CHI ===
        '{payment_voucher_code}': payment.code,
        '{payment_barcode}': generateBarcodeImage(payment.code),
        '{created_on}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatDate"])(payment.createdAt),
        '{issued_on}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatDate"])(payment.issuedAt || payment.createdAt),
        '{issued_on_time}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatTime"])(payment.issuedAt || payment.createdAt),
        '{account_name}': payment.createdBy || '',
        '{group_name}': payment.groupName || '',
        '{counted}': payment.counted ? 'Có' : 'Không',
        // === THÔNG TIN NGƯỜI NHẬN ===
        '{object_name}': payment.recipientName,
        '{object_phone_number}': payment.recipientPhone || '',
        '{object_address}': payment.recipientAddress || '',
        '{object_type}': payment.recipientType || '',
        // === GIÁ TRỊ ===
        '{amount}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatCurrency"])(payment.amount),
        '{amount_text}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["numberToWords"])(payment.amount),
        '{total_text}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["numberToWords"])(payment.amount),
        '{payment_method_name}': payment.paymentMethod || 'Tiền mặt',
        '{payment_method}': payment.paymentMethod || 'Tiền mặt',
        '{reference}': payment.reference || '',
        '{document_root_code}': payment.documentRootCode || '',
        '{note}': payment.note || '',
        '{description}': payment.description || payment.note || '',
        // === NỢ KHÁCH HÀNG ===
        '{customer_debt}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatCurrency"])(payment.customerDebt),
        '{customer_debt_text}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["numberToWords"])(payment.customerDebt || 0),
        '{customer_debt_prev}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatCurrency"])(payment.customerDebtPrev),
        '{customer_debt_prev_text}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["numberToWords"])(payment.customerDebtPrev || 0),
        '{customer_debt_before_create_payment}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatCurrency"])(payment.customerDebtBefore),
        '{customer_debt_before_create_payment_text}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["numberToWords"])(payment.customerDebtBefore || 0),
        '{customer_debt_after_create_payment}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatCurrency"])(payment.customerDebtAfter),
        '{customer_debt_after_create_payment_text}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["numberToWords"])(payment.customerDebtAfter || 0),
        // === NỢ NHÀ CUNG CẤP ===
        '{supplier_debt}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatCurrency"])(payment.supplierDebt),
        '{supplier_debt_text}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["numberToWords"])(payment.supplierDebt || 0),
        '{supplier_debt_prev}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatCurrency"])(payment.supplierDebtPrev),
        '{supplier_debt_prev_text}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["numberToWords"])(payment.supplierDebtPrev || 0),
        '{supplier_debt_before_create_payment}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatCurrency"])(payment.supplierDebtBefore),
        '{supplier_debt_before_create_payment_text}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["numberToWords"])(payment.supplierDebtBefore || 0),
        '{supplier_debt_after_create_payment}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatCurrency"])(payment.supplierDebtAfter),
        '{supplier_debt_after_create_payment_text}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["numberToWords"])(payment.supplierDebtAfter || 0)
    };
}
}),
"[project]/lib/file-upload-api.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "FileUploadAPI",
    ()=>FileUploadAPI
]);
// API client để giao tiếp với server - Staging System
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2d$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/api-config.ts [app-ssr] (ecmascript)");
;
const API_BASE_URL = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2d$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getApiBaseUrl"])();
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
        } catch (_error) {
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
}),
"[project]/lib/print-mappers/order.mapper.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "mapOrderLineItems",
    ()=>mapOrderLineItems,
    "mapOrderToPrintData",
    ()=>mapOrderToPrintData
]);
/**
 * Order Mapper - Đơn bán hàng
 * Chuyển đổi Order entity sang format để in
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/print-service.ts [app-ssr] (ecmascript)");
;
// Helper function for hiding phone middle digits
function hidePhoneMiddle(phone) {
    if (!phone) return '';
    if (phone.length < 6) return phone;
    const start = phone.slice(0, 3);
    const end = phone.slice(-3);
    return `${start}****${end}`;
}
// Alias for backward compatibility
const formatDateText = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatDate"];
function mapOrderToPrintData(order, storeSettings) {
    return {
        ...(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getStoreData"])(storeSettings),
        // === THÔNG TIN CHI NHÁNH ===
        '{location_name}': order.location?.name || storeSettings.name || '',
        '{location_address}': order.location?.address || storeSettings.address || '',
        '{location_phone_number}': order.location?.phone || storeSettings.phone || '',
        '{location_province}': order.location?.province || '',
        '{store_province}': storeSettings.province || '',
        // === THÔNG TIN ĐƠN HÀNG ===
        '{order_code}': order.code,
        '{order_qr_code}': '',
        '{bar_code(code)}': `<img src="https://barcodeapi.org/api/128/${encodeURIComponent(order.code)}" style="height:40px"/>`,
        '{created_on}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatDate"])(order.createdAt),
        '{created_on_time}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatTime"])(order.createdAt),
        '{created_on_text}': formatDateText(order.createdAt),
        '{modified_on}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatDate"])(order.modifiedAt),
        '{modified_on_time}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatTime"])(order.modifiedAt),
        '{issued_on}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatDate"])(order.issuedAt || order.createdAt),
        '{issued_on_time}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatTime"])(order.issuedAt || order.createdAt),
        '{issued_on_text}': formatDateText(order.issuedAt || order.createdAt),
        '{account_name}': order.createdBy || '',
        '{assignee_name}': order.assigneeName || order.createdBy || '',
        // === TRẠNG THÁI ===
        '{order_status}': order.status || '',
        '{payment_status}': order.paymentStatus || '',
        '{fulfillment_status}': order.fulfillmentStatus || '',
        '{packed_status}': order.packedStatus || '',
        '{return_status}': order.returnStatus || '',
        // === NGUỒN / KÊNH ===
        '{source}': order.source || '',
        '{channel}': order.channel || '',
        '{reference}': order.reference || '',
        '{tag}': order.tags?.join(', ') || '',
        '{bar_code(reference_number)}': order.reference ? `<img src="https://barcodeapi.org/api/128/${encodeURIComponent(order.reference)}" style="height:40px"/>` : '',
        // === GIAO HÀNG ===
        '{expected_delivery_type}': order.expectedDeliveryType || '',
        '{expected_payment_method}': order.expectedPaymentMethod || '',
        '{ship_on_min}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatDate"])(order.shipOnMin),
        '{ship_on_max}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatDate"])(order.shipOnMax),
        '{shipped_on}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatDate"])(order.shippedOn),
        // === CHÍNH SÁCH ===
        '{price_list_name}': order.priceListName || '',
        '{currency_name}': order.currencyName || 'VND',
        '{tax_treatment}': order.taxTreatment || '',
        // === KHỐI LƯỢNG ===
        '{weight_g}': order.totalWeightG?.toString() || '0',
        '{weight_kg}': order.totalWeightKg?.toString() || '0',
        // === THÔNG TIN KHÁCH HÀNG ===
        '{customer_name}': order.customer?.name || '',
        '{customer_code}': order.customer?.code || '',
        '{customer_phone_number}': order.customer?.phone || '',
        '{customer_phone_number_hide}': hidePhoneMiddle(order.customer?.phone),
        '{customer_email}': order.customer?.email || '',
        '{customer_group}': order.customer?.group || '',
        '{customer_contact}': order.customer?.contactName || order.customer?.name || '',
        '{customer_contact_phone_number}': order.customer?.contactPhone || order.customer?.phone || '',
        '{customer_contact_phone_number_hide}': hidePhoneMiddle(order.customer?.contactPhone || order.customer?.phone),
        '{customer_card}': order.customer?.cardLevel || '',
        '{customer_tax_number}': order.customer?.taxNumber || '',
        // === ĐIỂM KHÁCH HÀNG ===
        '{customer_point}': order.customer?.currentPoint?.toString() || '0',
        '{customer_point_used}': order.customer?.pointUsed?.toString() || '0',
        '{customer_point_new}': order.customer?.pointEarned?.toString() || '0',
        '{customer_point_before_create_invoice}': order.customer?.pointBeforeOrder?.toString() || '0',
        '{customer_point_after_create_invoice}': order.customer?.pointAfterOrder?.toString() || '0',
        // === NỢ KHÁCH HÀNG ===
        '{customer_debt}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatCurrency"])(order.customer?.currentDebt),
        '{customer_debt_text}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["numberToWords"])(order.customer?.currentDebt || 0),
        '{customer_debt_prev}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatCurrency"])(order.customer?.previousDebt),
        '{customer_debt_prev_text}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["numberToWords"])(order.customer?.previousDebt || 0),
        '{debt_before_create_invoice}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatCurrency"])(order.customer?.debtBeforeOrder || order.customer?.previousDebt),
        '{debt_before_create_invoice_text}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["numberToWords"])(order.customer?.debtBeforeOrder || order.customer?.previousDebt || 0),
        '{debt_after_create_invoice}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatCurrency"])(order.customer?.debtAfterOrder || order.customer?.currentDebt),
        '{debt_after_create_invoice_text}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["numberToWords"])(order.customer?.debtAfterOrder || order.customer?.currentDebt || 0),
        '{total_amount_and_debt_before_create_invoice}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatCurrency"])((order.customer?.debtBeforeOrder || 0) + order.total),
        '{total_amount_and_debt_before_create_invoice_text}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["numberToWords"])((order.customer?.debtBeforeOrder || 0) + order.total),
        // === ĐỊA CHỈ ===
        '{billing_address}': order.billingAddress || order.customer?.address || '',
        '{shipping_address}': order.shippingAddress || '',
        '{shipping_address:full_name}': order.recipient?.name || order.customer?.name || '',
        '{shipping_address:phone_number}': order.recipient?.phone || order.customer?.phone || '',
        '{shipping_address:phone_number_hide}': hidePhoneMiddle(order.recipient?.phone || order.customer?.phone),
        // === TỔNG GIÁ TRỊ ===
        '{total_quantity}': order.totalQuantity.toString(),
        '{total}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatCurrency"])(order.subtotal),
        '{total_none_discount}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatCurrency"])(order.subtotalBeforeDiscount || order.subtotal),
        '{total_line_item_discount}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatCurrency"])(order.totalLineItemDiscount),
        '{product_discount}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatCurrency"])(order.totalLineItemDiscount),
        '{order_discount}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatCurrency"])(order.orderDiscount),
        '{order_discount_rate}': order.orderDiscountRate ? `${order.orderDiscountRate}%` : '',
        '{order_discount_value}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatCurrency"])(order.orderDiscountValue || order.orderDiscount),
        '{total_discount}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatCurrency"])(order.totalDiscount),
        '{discount_details}': order.discountDetails || '',
        '{total_tax}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatCurrency"])(order.totalTax),
        '{total_extra_tax}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatCurrency"])(order.totalExtraTax),
        '{total_tax_included_line}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatCurrency"])(order.totalTaxIncludedLine),
        '{total_amount_before_tax}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatCurrency"])(order.totalAmountBeforeTax),
        '{total_amount_after_tax}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatCurrency"])(order.totalAmountAfterTax),
        '{delivery_fee}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatCurrency"])(order.deliveryFee),
        '{total_amount}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatCurrency"])(order.total),
        '{total_text}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["numberToWords"])(order.total),
        '{total_remain}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatCurrency"])(order.totalRemain),
        '{total_remain_text}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["numberToWords"])(order.totalRemain || 0),
        // === THANH TOÁN ===
        '{payment_name}': order.paymentMethod || '',
        '{payment_customer}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatCurrency"])(order.paidAmount),
        '{money_return}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatCurrency"])(order.changeAmount),
        '{payments}': order.payments?.map((p)=>`${p.method}: ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatCurrency"])(p.amount)}`).join(', ') || '',
        '{payment_qr}': order.paymentQrUrl ? `<img src="${order.paymentQrUrl}" style="max-width:120px;max-height:120px"/>` : '',
        // === KHUYẾN MẠI ===
        '{promotion_name}': order.promotionName || '',
        '{promotion_code}': order.promotionCode || '',
        '{order_note}': order.note || ''
    };
}
function mapOrderLineItems(items) {
    return items.map((item, index)=>({
            '{line_stt}': (index + 1).toString(),
            '{line_product_name}': item.productName,
            '{line_variant}': item.variantName || '',
            '{line_variant_code}': item.variantCode || '',
            '{line_variant_barcode}': item.barcode || '',
            '{line_variant_barcode_image}': item.barcode ? `<img src="https://barcodeapi.org/api/128/${item.barcode}" style="height:30px"/>` : '',
            '{line_variant_options}': item.variantOptions || '',
            '{line_image}': item.imageUrl ? `<img src="${item.imageUrl}" style="max-width:50px;max-height:50px"/>` : '',
            '{line_unit}': item.unit || 'Cái',
            '{line_quantity}': item.quantity.toString(),
            '{line_price}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatCurrency"])(item.price),
            '{line_price_after_discount}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatCurrency"])(item.priceAfterDiscount || item.amount / item.quantity),
            '{line_price_discount}': `${(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatCurrency"])(item.priceAfterDiscount || item.price)} / ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatCurrency"])(item.price)}`,
            '{line_discount_amount}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatCurrency"])(item.discountAmount),
            '{line_discount_rate}': item.discountRate ? `${item.discountRate}%` : '',
            '{line_tax_amount}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatCurrency"])(item.taxAmount),
            '{line_tax_rate}': item.taxRate ? `${item.taxRate}%` : '',
            '{line_tax_included}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatCurrency"])(item.taxIncluded),
            '{line_tax_exclude}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatCurrency"])(item.taxExclude),
            '{line_amount}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatCurrency"])(item.amount),
            '{line_amount_none_discount}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatCurrency"])(item.amountBeforeDiscount || item.price * item.quantity),
            // Mở rộng
            '{line_note}': item.note || '',
            '{line_brand}': item.brand || '',
            '{line_category}': item.category || '',
            '{line_product_description}': item.description || '',
            '{line_weight_g}': item.weightG?.toString() || '',
            '{line_weight_kg}': item.weightG ? (item.weightG / 1000).toFixed(2) : '',
            '{bin_location}': item.binLocation || '',
            '{serials}': item.serial || '',
            '{lots_number_code1}': item.lotNumber || '',
            '{lots_number_code2}': '',
            '{lots_number_code3}': item.lotInfo || '',
            '{lots_number_code4}': '',
            '{lots_number_combo}': '',
            '{packsizes}': '',
            '{term_name}': item.warrantyPolicy || '',
            '{term_number}': item.warrantyPeriod || '',
            '{term_name_combo}': '',
            '{term_number_combo}': '',
            '{composite_details}': item.compositeDetails || '',
            '{line_promotion_or_loyalty}': item.promotionInfo || ''
        }));
}
}),
"[project]/lib/print-mappers/quote.mapper.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "mapQuoteLineItems",
    ()=>mapQuoteLineItems,
    "mapQuoteToPrintData",
    ()=>mapQuoteToPrintData
]);
/**
 * Quote Mapper - Phiếu đơn tạm tính / Báo giá
 * Đồng bộ với variables/phieu-don-tam-tinh.ts
 * 
 * Note: Quote có cấu trúc gần giống Order nên share nhiều biến
 * Variables coverage: 100%
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/print-service.ts [app-ssr] (ecmascript)");
;
// Helper function for hiding phone middle digits
function hidePhoneMiddle(phone) {
    if (!phone) return '';
    if (phone.length < 6) return phone;
    const start = phone.slice(0, 3);
    const end = phone.slice(-3);
    return `${start}****${end}`;
}
// Alias for backward compatibility
const formatDateText = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatDate"];
function mapQuoteToPrintData(quote, storeSettings) {
    return {
        ...(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getStoreData"])(storeSettings),
        // === THÔNG TIN CHI NHÁNH ===
        '{location_name}': quote.location?.name || storeSettings.name || '',
        '{location_address}': quote.location?.address || storeSettings.address || '',
        '{location_phone_number}': quote.location?.phone || storeSettings.phone || '',
        '{location_province}': quote.location?.province || '',
        '{store_province}': storeSettings.province || '',
        // === THÔNG TIN ĐƠN HÀNG ===
        '{order_code}': quote.code,
        '{order_qr_code}': '',
        '{bar_code(code)}': `<img src="https://barcodeapi.org/api/128/${encodeURIComponent(quote.code)}" style="height:40px"/>`,
        '{created_on}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatDate"])(quote.createdAt),
        '{created_on_time}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatTime"])(quote.createdAt),
        '{created_on_text}': formatDateText(quote.createdAt),
        '{modified_on}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatDate"])(quote.modifiedAt),
        '{modified_on_time}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatTime"])(quote.modifiedAt),
        '{issued_on}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatDate"])(quote.issuedAt || quote.createdAt),
        '{issued_on_time}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatTime"])(quote.issuedAt || quote.createdAt),
        '{issued_on_text}': formatDateText(quote.issuedAt || quote.createdAt),
        '{account_name}': quote.createdBy || '',
        '{assignee_name}': quote.assigneeName || quote.createdBy || '',
        // === TRẠNG THÁI ===
        '{order_status}': quote.status || '',
        '{payment_status}': quote.paymentStatus || '',
        '{fulfillment_status}': quote.fulfillmentStatus || '',
        '{packed_status}': quote.packedStatus || '',
        '{return_status}': quote.returnStatus || '',
        // === NGUỒN / KÊNH ===
        '{source}': quote.source || '',
        '{channel}': quote.channel || '',
        '{reference}': quote.reference || '',
        '{tag}': quote.tags?.join(', ') || '',
        '{bar_code(reference_number)}': quote.reference ? `<img src="https://barcodeapi.org/api/128/${encodeURIComponent(quote.reference)}" style="height:40px"/>` : '',
        // === GIAO HÀNG ===
        '{expected_delivery_type}': quote.expectedDeliveryType || '',
        '{expected_payment_method}': quote.expectedPaymentMethod || '',
        '{ship_on_min}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatDate"])(quote.shipOnMin),
        '{ship_on_max}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatDate"])(quote.shipOnMax),
        '{shipped_on}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatDate"])(quote.shippedOn),
        // === CHÍNH SÁCH ===
        '{price_list_name}': quote.priceListName || '',
        '{currency_name}': quote.currencyName || 'VND',
        '{tax_treatment}': quote.taxTreatment || '',
        // === KHỐI LƯỢNG ===
        '{weight_g}': quote.totalWeightG?.toString() || '0',
        '{weight_kg}': quote.totalWeightKg?.toString() || '0',
        // === THÔNG TIN KHÁCH HÀNG ===
        '{customer_name}': quote.customer?.name || '',
        '{customer_code}': quote.customer?.code || '',
        '{customer_phone_number}': quote.customer?.phone || '',
        '{customer_phone_number_hide}': hidePhoneMiddle(quote.customer?.phone),
        '{customer_email}': quote.customer?.email || '',
        '{customer_group}': quote.customer?.group || '',
        '{customer_contact}': quote.customer?.contactName || quote.customer?.name || '',
        '{customer_contact_phone_number}': quote.customer?.contactPhone || quote.customer?.phone || '',
        '{customer_contact_phone_number_hide}': hidePhoneMiddle(quote.customer?.contactPhone || quote.customer?.phone),
        '{customer_card}': quote.customer?.cardLevel || '',
        '{customer_tax_number}': quote.customer?.taxNumber || '',
        // === ĐIỂM KHÁCH HÀNG ===
        '{customer_point}': quote.customer?.currentPoint?.toString() || '0',
        '{customer_point_used}': quote.customer?.pointUsed?.toString() || '0',
        '{customer_point_new}': quote.customer?.pointEarned?.toString() || '0',
        '{customer_point_before_create_invoice}': quote.customer?.pointBeforeOrder?.toString() || '0',
        '{customer_point_after_create_invoice}': quote.customer?.pointAfterOrder?.toString() || '0',
        // === NỢ KHÁCH HÀNG ===
        '{customer_debt}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatCurrency"])(quote.customer?.currentDebt),
        '{customer_debt_text}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["numberToWords"])(quote.customer?.currentDebt || 0),
        '{customer_debt_prev}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatCurrency"])(quote.customer?.previousDebt),
        '{customer_debt_prev_text}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["numberToWords"])(quote.customer?.previousDebt || 0),
        '{debt_before_create_invoice}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatCurrency"])(quote.customer?.debtBeforeOrder || quote.customer?.previousDebt),
        '{debt_before_create_invoice_text}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["numberToWords"])(quote.customer?.debtBeforeOrder || quote.customer?.previousDebt || 0),
        '{debt_after_create_invoice}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatCurrency"])(quote.customer?.debtAfterOrder || quote.customer?.currentDebt),
        '{debt_after_create_invoice_text}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["numberToWords"])(quote.customer?.debtAfterOrder || quote.customer?.currentDebt || 0),
        '{total_amount_and_debt_before_create_invoice}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatCurrency"])((quote.customer?.debtBeforeOrder || 0) + quote.total),
        '{total_amount_and_debt_before_create_invoice_text}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["numberToWords"])((quote.customer?.debtBeforeOrder || 0) + quote.total),
        // === ĐỊA CHỈ ===
        '{billing_address}': quote.billingAddress || quote.customer?.address || '',
        '{shipping_address}': quote.shippingAddress || '',
        '{shipping_address:full_name}': quote.recipient?.name || quote.customer?.name || '',
        '{shipping_address:phone_number}': quote.recipient?.phone || quote.customer?.phone || '',
        '{shipping_address:phone_number_hide}': hidePhoneMiddle(quote.recipient?.phone || quote.customer?.phone),
        // === TỔNG GIÁ TRỊ ===
        '{total_quantity}': quote.totalQuantity.toString(),
        '{total}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatCurrency"])(quote.subtotal),
        '{total_none_discount}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatCurrency"])(quote.subtotalBeforeDiscount || quote.subtotal),
        '{total_line_item_discount}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatCurrency"])(quote.totalLineItemDiscount),
        '{product_discount}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatCurrency"])(quote.totalLineItemDiscount),
        '{order_discount}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatCurrency"])(quote.orderDiscount),
        '{order_discount_rate}': quote.orderDiscountRate ? `${quote.orderDiscountRate}%` : '',
        '{order_discount_value}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatCurrency"])(quote.orderDiscountValue || quote.orderDiscount),
        '{total_discount}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatCurrency"])(quote.totalDiscount),
        '{discount_details}': quote.discountDetails || '',
        '{total_tax}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatCurrency"])(quote.totalTax),
        '{total_extra_tax}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatCurrency"])(quote.totalExtraTax),
        '{total_tax_included_line}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatCurrency"])(quote.totalTaxIncludedLine),
        '{total_amount_before_tax}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatCurrency"])(quote.totalAmountBeforeTax),
        '{total_amount_after_tax}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatCurrency"])(quote.totalAmountAfterTax),
        '{delivery_fee}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatCurrency"])(quote.deliveryFee),
        '{total_amount}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatCurrency"])(quote.total),
        '{total_text}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["numberToWords"])(quote.total),
        '{total_remain}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatCurrency"])(quote.totalRemain),
        '{total_remain_text}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["numberToWords"])(quote.totalRemain || 0),
        // === THANH TOÁN ===
        '{payment_name}': quote.paymentMethod || '',
        '{payment_customer}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatCurrency"])(quote.paidAmount),
        '{money_return}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatCurrency"])(quote.changeAmount),
        '{payments}': quote.payments?.map((p)=>`${p.method}: ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatCurrency"])(p.amount)}`).join(', ') || '',
        '{payment_qr}': quote.paymentQrUrl ? `<img src="${quote.paymentQrUrl}" style="max-width:120px;max-height:120px"/>` : '',
        // === KHUYẾN MẠI ===
        '{promotion_name}': quote.promotionName || '',
        '{promotion_code}': quote.promotionCode || '',
        '{order_note}': quote.note || ''
    };
}
function mapQuoteLineItems(items) {
    return items.map((item, index)=>({
            '{line_stt}': (index + 1).toString(),
            '{line_product_name}': item.productName,
            '{line_variant}': item.variantName || '',
            '{line_variant_code}': item.variantCode || '',
            '{line_variant_barcode}': item.barcode || '',
            '{line_variant_barcode_image}': item.barcode ? `<img src="https://barcodeapi.org/api/128/${item.barcode}" style="height:30px"/>` : '',
            '{line_variant_options}': item.variantOptions || '',
            '{line_image}': item.imageUrl ? `<img src="${item.imageUrl}" style="max-width:50px;max-height:50px"/>` : '',
            '{line_unit}': item.unit || 'Cái',
            '{line_quantity}': item.quantity.toString(),
            '{line_price}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatCurrency"])(item.price),
            '{line_price_after_discount}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatCurrency"])(item.priceAfterDiscount || item.amount / item.quantity),
            '{line_price_discount}': `${(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatCurrency"])(item.priceAfterDiscount || item.price)} / ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatCurrency"])(item.price)}`,
            '{line_discount_amount}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatCurrency"])(item.discountAmount),
            '{line_discount_rate}': item.discountRate ? `${item.discountRate}%` : '',
            '{line_tax_amount}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatCurrency"])(item.taxAmount),
            '{line_tax_rate}': item.taxRate ? `${item.taxRate}%` : '',
            '{line_tax_included}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatCurrency"])(item.taxIncluded),
            '{line_tax_exclude}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatCurrency"])(item.taxExclude),
            '{line_amount}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatCurrency"])(item.amount),
            '{line_amount_none_discount}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatCurrency"])(item.amountBeforeDiscount || item.price * item.quantity),
            // Mở rộng
            '{line_note}': item.note || '',
            '{line_brand}': item.brand || '',
            '{line_category}': item.category || '',
            '{line_product_description}': item.description || '',
            '{line_weight_g}': item.weightG?.toString() || '',
            '{line_weight_kg}': item.weightG ? (item.weightG / 1000).toFixed(2) : '',
            '{bin_location}': item.binLocation || '',
            '{serials}': item.serial || '',
            '{lots_number_code1}': item.lotNumber || '',
            '{lots_number_code2}': '',
            '{lots_number_code3}': item.lotInfo || '',
            '{lots_number_code4}': '',
            '{lots_number_combo}': '',
            '{packsizes}': '',
            '{term_name}': item.warrantyPolicy || '',
            '{term_number}': item.warrantyPeriod || '',
            '{term_name_combo}': '',
            '{term_number_combo}': '',
            '{composite_details}': item.compositeDetails || '',
            '{line_promotion_or_loyalty}': item.promotionInfo || ''
        }));
}
}),
"[project]/lib/print-mappers/sales-return.mapper.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "mapSalesReturnLineItems",
    ()=>mapSalesReturnLineItems,
    "mapSalesReturnReturnLineItems",
    ()=>mapSalesReturnReturnLineItems,
    "mapSalesReturnToPrintData",
    ()=>mapSalesReturnToPrintData
]);
/**
 * Sales Return Mapper - Đơn đổi trả hàng
 * Đồng bộ với variables/don-doi-tra-hang.ts
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$mappers$2f$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/lib/print-mappers/types.ts [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/print-service.ts [app-ssr] (ecmascript)");
;
function mapSalesReturnToPrintData(ret, storeSettings) {
    return {
        ...(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getStoreData"])(storeSettings),
        // === THÔNG TIN CHI NHÁNH ===
        '{location_name}': ret.location?.name || storeSettings.name || '',
        '{location_address}': ret.location?.address || storeSettings.address || '',
        '{location_province}': ret.location?.province || '',
        '{store_province}': storeSettings.province || '',
        // === THÔNG TIN ĐƠN TRẢ ===
        '{order_return_code}': ret.orderReturnCode || ret.code,
        '{order_code}': ret.orderCode,
        '{order_qr_code}': ret.orderQrCode ? `<img src="${ret.orderQrCode}" style="max-width:100px;max-height:100px"/>` : '',
        '{bar_code(code)}': ret.orderBarCode ? `<img src="${ret.orderBarCode}" style="max-height:50px"/>` : '',
        '{created_on}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatDate"])(ret.createdAt),
        '{created_on_time}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatTime"])(ret.createdAt),
        '{modified_on}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatDate"])(ret.modifiedAt),
        '{modified_on_time}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatTime"])(ret.modifiedAt),
        '{issued_on}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatDate"])(ret.issuedAt || ret.createdAt),
        '{issued_on_time}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatTime"])(ret.issuedAt || ret.createdAt),
        '{account_name}': ret.createdBy || '',
        '{assignee_name}': ret.assigneeName || '',
        // === TRẠNG THÁI ===
        '{order_status}': ret.orderStatus || '',
        '{payment_status}': ret.paymentStatus || '',
        '{fulfillment_status}': ret.fulfillmentStatus || '',
        '{packed_status}': ret.packedStatus || '',
        '{return_status}': ret.returnStatus || '',
        // === NGUỒN / KÊNH ===
        '{source}': ret.source || '',
        '{channel}': ret.channel || '',
        '{reference}': ret.reference || '',
        '{bar_code(reference_number)}': '',
        '{tag}': ret.tags?.join(', ') || '',
        // === CHÍNH SÁCH ===
        '{price_list_name}': ret.priceListName || '',
        '{currency_name}': ret.currencyName || 'VND',
        '{expected_delivery_type}': ret.expectedDeliveryType || '',
        '{expected_payment_method}': ret.expectedPaymentMethod || '',
        // === NGÀY GIAO ===
        '{ship_on_min}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatDate"])(ret.shipOnMin),
        '{ship_on_max}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatDate"])(ret.shipOnMax),
        // === THÔNG TIN KHÁCH HÀNG ===
        '{customer_name}': ret.customerName,
        '{customer_code}': ret.customerCode || '',
        '{customer_phone_number}': ret.customerPhone || '',
        '{customer_email}': ret.customerEmail || '',
        '{customer_contact}': ret.customerContact || ret.customerName,
        '{customer_card}': ret.customerCard || '',
        '{customer_tax_number}': ret.customerTaxNumber || '',
        '{customer_point}': ret.customerPoint?.toString() || '0',
        '{customer_debt}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatCurrency"])(ret.customerDebt),
        '{customer_debt_text}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["numberToWords"])(ret.customerDebt || 0),
        '{customer_debt_prev}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatCurrency"])(ret.customerDebtPrev),
        '{customer_debt_prev_text}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["numberToWords"])(ret.customerDebtPrev || 0),
        '{billing_address}': ret.billingAddress || '',
        '{shipping_address}': ret.shippingAddress || '',
        '{shipping_address:full_name}': ret.shippingRecipient || ret.customerName,
        '{shipping_address:phone_number}': ret.shippingRecipientPhone || ret.customerPhone || '',
        // === TỔNG GIÁ TRỊ ===
        '{total_quantity}': ret.totalQuantity?.toString() || '0',
        '{return_total_quantity}': ret.returnTotalQuantity?.toString() || '0',
        '{total}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatCurrency"])(ret.total),
        '{total_none_discount}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatCurrency"])(ret.totalNoneDiscount),
        '{total_line_item_discount}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatCurrency"])(ret.totalLineItemDiscount),
        '{order_discount}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatCurrency"])(ret.orderDiscount),
        '{order_discount_rate}': ret.orderDiscountRate ? `${ret.orderDiscountRate}%` : '',
        '{order_discount_value}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatCurrency"])(ret.orderDiscountValue),
        '{total_discount}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatCurrency"])(ret.totalDiscount),
        '{product_discount}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatCurrency"])(ret.productDiscount),
        '{total_tax}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatCurrency"])(ret.totalTax),
        '{total_extra_tax}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatCurrency"])(ret.totalExtraTax),
        '{total_tax_included_line}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatCurrency"])(ret.totalTaxIncludedLine),
        '{total_amount_before_tax}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatCurrency"])(ret.totalAmountBeforeTax),
        '{total_amount_after_tax}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatCurrency"])(ret.totalAmountAfterTax),
        '{delivery_fee}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatCurrency"])(ret.deliveryFee),
        '{total_amount}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatCurrency"])(ret.totalAmount),
        '{total_text}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["numberToWords"])(ret.totalAmount || 0),
        '{return_total_amount}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatCurrency"])(ret.returnTotalAmount),
        '{total_order_exchange_amount}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatCurrency"])(ret.totalOrderExchangeAmount),
        '{order_exchange_payment_note}': ret.orderExchangePaymentNote || '',
        '{payment_customer}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatCurrency"])(ret.paymentCustomer),
        '{money_return}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatCurrency"])(ret.moneyReturn),
        '{total_remain}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatCurrency"])(ret.totalRemain),
        '{payment_name}': ret.paymentName || '',
        '{promotion_name}': ret.promotionName || '',
        '{promotion_code}': ret.promotionCode || '',
        '{order_note}': ret.note || '',
        '{note}': ret.note || '',
        '{reason_return}': ret.reason || '',
        '{refund_status}': ret.refundStatus || ''
    };
}
function mapSalesReturnLineItems(items) {
    return items.map((item, index)=>({
            '{line_stt}': (index + 1).toString(),
            '{line_variant_code}': item.variantCode || '',
            '{line_product_name}': item.productName,
            '{line_variant}': item.variantName || '',
            '{line_variant_barcode}': item.barcode || '',
            '{line_unit}': item.unit || 'Cái',
            '{line_quantity}': item.quantity.toString(),
            '{line_price}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatCurrency"])(item.price),
            '{line_price_after_discount}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatCurrency"])(item.priceAfterDiscount),
            '{line_discount_rate}': item.discountRate ? `${item.discountRate}%` : '',
            '{line_discount_amount}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatCurrency"])(item.discountAmount),
            '{line_tax_rate}': item.taxRate ? `${item.taxRate}%` : '',
            '{line_tax_amount}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatCurrency"])(item.taxAmount),
            '{line_tax_included}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatCurrency"])(item.taxIncluded),
            '{line_tax_exclude}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatCurrency"])(item.taxExclude),
            '{line_amount}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatCurrency"])(item.amount),
            '{line_amount_none_discount}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatCurrency"])(item.amountNoneDiscount),
            '{line_brand}': item.brand || '',
            '{line_category}': item.category || '',
            '{line_variant_options}': item.variantOptions || '',
            '{line_promotion_or_loyalty}': item.promotionOrLoyalty || '',
            '{serials}': item.serial || '',
            '{lots_number_code1}': item.lotNumber || '',
            '{lots_number_code2}': item.lotInfoQty || '',
            '{lots_number_code3}': item.lotInfo || '',
            '{lots_number_code4}': item.lotInfoExpiry || '',
            '{line_note}': item.note || ''
        }));
}
function mapSalesReturnReturnLineItems(items) {
    if (!items) return [];
    return items.map((item, index)=>({
            '{return_line_stt}': (index + 1).toString(),
            '{return_line_variant_code}': item.variantCode || '',
            '{return_line_product_name}': item.productName,
            '{return_line_variant}': item.variantName || '',
            '{return_line_unit}': item.unit || 'Cái',
            '{return_line_quantity}': item.quantity.toString(),
            '{return_line_price}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatCurrency"])(item.price),
            '{return_line_amount}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatCurrency"])(item.amount),
            '{return_serials}': item.serial || '',
            '{return_line_note}': item.note || '',
            // Map to standard line item variables as well (for templates that use generic names)
            '{line_stt}': (index + 1).toString(),
            '{line_variant_code}': item.variantCode || '',
            '{line_product_name}': item.productName,
            '{line_variant}': item.variantName || '',
            '{line_unit}': item.unit || 'Cái',
            '{line_quantity}': item.quantity.toString(),
            '{line_price}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatCurrency"])(item.price),
            '{line_total}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatCurrency"])(item.amount),
            '{line_amount}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatCurrency"])(item.amount),
            '{line_note}': item.note || ''
        }));
}
}),
"[project]/lib/print-mappers/product-label.mapper.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "mapProductLabelToPrintData",
    ()=>mapProductLabelToPrintData,
    "mapProductToLabelPrintData",
    ()=>mapProductToLabelPrintData
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/print-service.ts [app-ssr] (ecmascript)");
;
const DEFAULT_QR_SIZE = 96;
const DEFAULT_BARCODE_HEIGHT = 48;
function generateBarcodeImage(value, height = DEFAULT_BARCODE_HEIGHT) {
    if (!value) return '';
    return `<img src="https://barcodeapi.org/api/128/${encodeURIComponent(value)}" style="height:${height}px" alt="barcode"/>`;
}
function generateQRCodeImage(value, size = DEFAULT_QR_SIZE) {
    if (!value) return '';
    return `<img src="https://quickchart.io/qr?text=${encodeURIComponent(value)}&size=${size}" style="width:${size}px;height:${size}px" alt="qr"/>`;
}
function formatWeight(value, unit) {
    if (value === undefined || value === null) return '';
    if (unit === 'g') return `${value} g`;
    if (unit === 'kg') return `${value} kg`;
    return `${value} ${unit || ''}`.trim();
}
function mapProductLabelToPrintData(product, storeSettings) {
    const barcodeValue = product.barcode || product.sku || product.name;
    const qrValue = product.qrCodeValue || barcodeValue || product.name;
    return {
        ...(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getStoreData"])(storeSettings),
        '{product_name}': product.name,
        '{product_name_vat}': product.nameVat || product.name,
        '{product_sku}': product.sku,
        '{product_unit}': product.unit || '',
        '{product_price}': product.price !== undefined ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatCurrency"])(product.price) : '',
        '{product_brand}': product.brand || '',
        '{product_category}': product.category || '',
        '{product_weight}': product.weightText || formatWeight(product.weightValue, product.weightUnit),
        '{product_origin}': product.origin || '',
        '{product_ingredients}': product.ingredients || '',
        '{product_mfg_date}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatDate"])(product.manufactureDate),
        '{product_expiry_date}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatDate"])(product.expiryDate),
        '{product_lot_number}': product.lotNumber || '',
        '{product_description}': product.description || '',
        '{product_short_description}': product.shortDescription || product.description || '',
        '{product_storage_instructions}': product.storageInstructions || '',
        '{product_barcode}': barcodeValue || '',
        '{product_barcode_image}': generateBarcodeImage(barcodeValue),
        '{product_qr_code}': generateQRCodeImage(qrValue),
        // Tem phụ fields
        '{product_usage_guide}': product.usageGuide || '',
        '{product_importer_name}': product.importerName || '',
        '{product_importer_address}': product.importerAddress || ''
    };
}
function mapProductToLabelPrintData(product, storeSettings, overrides = {}) {
    const firstPrice = Object.values(product.prices || {})[0];
    const resolvedPrice = overrides.price ?? product.sellingPrice ?? firstPrice;
    return mapProductLabelToPrintData({
        sku: overrides.sku || product.id || product.sku || '',
        name: overrides.name || product.name,
        nameVat: overrides.nameVat || product.nameVat || product.name,
        unit: overrides.unit || product.unit,
        price: resolvedPrice,
        brand: overrides.brand || '',
        category: overrides.category || product.category || '',
        weightText: overrides.weightText,
        weightValue: overrides.weightValue ?? product.weight,
        weightUnit: overrides.weightUnit ?? product.weightUnit,
        origin: overrides.origin || product.origin,
        ingredients: overrides.ingredients,
        manufactureDate: overrides.manufactureDate,
        expiryDate: overrides.expiryDate,
        lotNumber: overrides.lotNumber,
        storageInstructions: overrides.storageInstructions,
        description: overrides.description || product.description,
        shortDescription: overrides.shortDescription || product.shortDescription,
        barcode: overrides.barcode || product.barcode || product.id,
        qrCodeValue: overrides.qrCodeValue || product.id,
        // Tem phụ fields from product
        usageGuide: overrides.usageGuide || product.usageGuide,
        importerName: overrides.importerName || product.importerName,
        importerAddress: overrides.importerAddress || product.importerAddress
    }, storeSettings);
}
}),
"[project]/lib/print-mappers/purchase-order.mapper.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "mapPurchaseOrderLineItems",
    ()=>mapPurchaseOrderLineItems,
    "mapPurchaseOrderToPrintData",
    ()=>mapPurchaseOrderToPrintData
]);
/**
 * Purchase Order Mapper - Đơn nhập hàng
 * Đồng bộ với variables/don-nhap-hang.ts
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/print-service.ts [app-ssr] (ecmascript)");
;
function mapPurchaseOrderToPrintData(po, storeSettings) {
    return {
        ...(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getStoreData"])(storeSettings),
        // === THÔNG TIN CHI NHÁNH ===
        '{location_name}': po.location?.name || storeSettings.name || '',
        '{location_address}': po.location?.address || storeSettings.address || '',
        '{location_province}': po.location?.province || '',
        '{store_province}': storeSettings.province || '',
        // === THÔNG TIN ĐƠN NHẬP ===
        '{purchase_order_code}': po.code,
        '{created_on}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatDate"])(po.createdAt),
        '{created_on_time}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatTime"])(po.createdAt),
        '{modified_on}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatDate"])(po.modifiedAt),
        '{received_on}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatDate"])(po.receivedOn),
        '{received_on_time}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatTime"])(po.receivedOn),
        '{completed_on}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatDate"])(po.completedOn || po.receivedOn),
        '{ended_on}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatDate"])(po.completedOn || po.receivedOn),
        '{cancelled_on}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatDate"])(po.cancelledOn),
        '{due_on}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatDate"])(po.dueOn),
        '{due_on_time}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatTime"])(po.dueOn),
        '{account_name}': po.createdBy || '',
        '{activated_account_name}': po.activatedAccountName || po.createdBy || '',
        '{assignee_name}': po.assigneeName || '',
        '{reference}': po.reference || '',
        '{tags}': po.tags?.join(', ') || '',
        // === TRẠNG THÁI ===
        '{status}': po.status || '',
        '{received_status}': po.receivedStatus || '',
        '{financial_status}': po.financialStatus || '',
        '{refund_status}': po.refundStatus || '',
        '{refund_transaction_status}': po.refundTransactionStatus || '',
        // === THÔNG TIN NHÀ CUNG CẤP ===
        '{supplier_name}': po.supplierName,
        '{supplier_code}': po.supplierCode || '',
        '{order_supplier_code}': po.supplierCode || '',
        '{supplier_phone}': po.supplierPhone || '',
        '{supplier_phone_number}': po.supplierPhone || '',
        '{supplier_email}': po.supplierEmail || '',
        '{supplier_address}': po.supplierAddress || '',
        '{billing_address}': po.billingAddress || '',
        // === NỢ NCC ===
        '{supplier_debt}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatCurrency"])(po.supplierDebt),
        '{supplier_debt_text}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["numberToWords"])(po.supplierDebt || 0),
        '{supplier_debt_prev}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatCurrency"])(po.supplierDebtPrev),
        '{supplier_debt_prev_text}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["numberToWords"])(po.supplierDebtPrev || 0),
        // === KHỐI LƯỢNG ===
        '{weight_g}': po.totalWeightG?.toString() || '0',
        '{weight_kg}': po.totalWeightKg?.toString() || '0',
        // === TỔNG GIÁ TRỊ ===
        '{total_quantity}': po.totalQuantity.toString(),
        '{total}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatCurrency"])(po.total),
        '{total_order}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatCurrency"])(po.total),
        '{total_price}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatCurrency"])(po.totalPrice || po.total),
        '{total_discounts_rate}': po.totalDiscountsRate ? `${po.totalDiscountsRate}%` : '',
        '{total_discounts_value}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatCurrency"])(po.totalDiscountsValue),
        '{total_discounts}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatCurrency"])(po.totalDiscounts),
        '{discount}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatCurrency"])(po.totalDiscounts),
        '{product_discount}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatCurrency"])(po.productDiscount),
        '{total_tax}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatCurrency"])(po.totalTax),
        '{tax_vat}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatCurrency"])(po.totalTax),
        '{total_extra_tax}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatCurrency"])(po.totalExtraTax),
        '{total_tax_included_line}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatCurrency"])(po.totalTaxIncludedLine),
        '{total_amount_before_tax}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatCurrency"])(po.totalAmountBeforeTax),
        '{total_amount_after_tax}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatCurrency"])(po.totalAmountAfterTax),
        '{total_landed_costs}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatCurrency"])(po.totalLandedCosts),
        '{total_transaction_amount}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatCurrency"])(po.totalTransactionAmount),
        '{total_amount_transaction}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatCurrency"])(po.totalAmountTransaction),
        '{total_remain}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatCurrency"])(po.totalRemain),
        '{total_amount_text}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["numberToWords"])(po.totalPrice || po.total),
        '{payments}': po.payments || '',
        '{note}': po.note || ''
    };
}
function mapPurchaseOrderLineItems(items) {
    return items.map((item, index)=>({
            '{line_stt}': (index + 1).toString(),
            '{line_title}': item.title || item.productName,
            '{line_product_name}': item.productName || item.title,
            '{line_variant_code}': item.variantCode || '',
            '{line_variant_name}': item.variantName || '',
            '{line_variant}': item.variantName || '',
            '{line_variant_barcode}': item.barcode || '',
            '{line_unit}': item.unit || 'Cái',
            '{line_quantity}': item.quantity.toString(),
            '{line_ordered_quantity}': item.quantity.toString(),
            '{line_received_quantity}': item.receivedQuantity?.toString() || '0',
            '{line_price}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatCurrency"])(item.price),
            '{line_price_after_discount}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatCurrency"])(item.priceAfterDiscount),
            '{line_discount_rate}': item.discountRate ? `${item.discountRate}%` : '',
            '{line_discount_amount}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatCurrency"])(item.discountAmount),
            '{line_tax_rate}': item.taxRate ? `${item.taxRate}%` : '',
            '{line_tax_amount}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatCurrency"])(item.taxAmount),
            '{line_tax}': item.taxType || '',
            '{line_tax_included}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatCurrency"])(item.taxIncluded),
            '{line_tax_exclude}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatCurrency"])(item.taxExclude),
            '{line_amount}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatCurrency"])(item.amount),
            '{line_total}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatCurrency"])(item.amount),
            '{total_line_amount}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatCurrency"])(item.amount),
            '{total_line_amount_text}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["numberToWords"])(item.amount),
            '{line_brand}': item.brand || '',
            '{line_category}': item.category || '',
            '{line_variant_options}': item.variantOptions || '',
            '{line_weight_g}': item.weightG?.toString() || '',
            '{line_weight_kg}': item.weightKg?.toString() || '',
            '{serials}': item.serial || '',
            '{lots_number_code1}': item.lotNumber || '',
            '{lots_number_code2}': item.lotInfoQty || '',
            '{lots_number_code3}': item.lotInfo || '',
            '{lots_number_code4}': item.lotInfoExpiry || '',
            '{line_note}': item.note || ''
        }));
}
}),
"[project]/lib/print-mappers/stock-in.mapper.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "mapStockInLineItems",
    ()=>mapStockInLineItems,
    "mapStockInToPrintData",
    ()=>mapStockInToPrintData
]);
/**
 * Stock In Mapper - Phiếu nhập kho
 * Đồng bộ với variables/phieu-nhap-kho.ts
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/print-service.ts [app-ssr] (ecmascript)");
;
function mapStockInToPrintData(stockIn, storeSettings) {
    return {
        ...(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getStoreData"])(storeSettings),
        // === THÔNG TIN CHI NHÁNH ===
        '{location_name}': stockIn.location?.name || storeSettings.name || '',
        '{location_address}': stockIn.location?.address || storeSettings.address || '',
        '{location_province}': stockIn.location?.province || '',
        '{store_province}': storeSettings.province || '',
        // === THÔNG TIN PHIẾU NHẬP KHO ===
        '{receipt_code}': stockIn.code,
        '{stock_in_code}': stockIn.code,
        '{purchase_order_code}': stockIn.purchaseOrderCode || '',
        '{order_supplier_code}': stockIn.purchaseOrderCode || '',
        '{created_on}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatDate"])(stockIn.createdAt),
        '{modified_on}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatDate"])(stockIn.modifiedAt),
        '{received_on}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatDate"])(stockIn.receivedOn),
        '{received_on_time}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatTime"])(stockIn.receivedOn),
        '{account_name}': stockIn.createdBy || '',
        '{reference}': stockIn.reference || '',
        '{stock_in_status}': stockIn.status || '',
        // === THÔNG TIN NHÀ CUNG CẤP ===
        '{supplier_name}': stockIn.supplierName || '',
        '{supplier_code}': stockIn.supplierCode || '',
        '{supplier_phone}': stockIn.supplierPhone || '',
        '{supplier_email}': stockIn.supplierEmail || '',
        '{supplier_debt}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatCurrency"])(stockIn.supplierDebt),
        '{supplier_debt_text}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["numberToWords"])(stockIn.supplierDebt || 0),
        '{supplier_debt_prev}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatCurrency"])(stockIn.supplierDebtPrev),
        '{supplier_debt_prev_text}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["numberToWords"])(stockIn.supplierDebtPrev || 0),
        // === TỔNG GIÁ TRỊ ===
        '{total_quantity}': stockIn.totalQuantity.toString(),
        '{total}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatCurrency"])(stockIn.total),
        '{total_order}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatCurrency"])(stockIn.total),
        '{total_price}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatCurrency"])(stockIn.totalPrice || stockIn.total),
        '{total_discounts}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatCurrency"])(stockIn.totalDiscounts),
        '{discount}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatCurrency"])(stockIn.totalDiscounts),
        '{total_tax}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatCurrency"])(stockIn.totalTax),
        '{tax_vat}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatCurrency"])(stockIn.totalTax),
        '{total_landed_costs}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatCurrency"])(stockIn.totalLandedCosts),
        '{total_amount_text}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["numberToWords"])(stockIn.totalPrice || stockIn.total),
        '{paid}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatCurrency"])(stockIn.paid),
        '{remaining}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatCurrency"])(stockIn.remaining),
        '{note}': stockIn.note || ''
    };
}
function mapStockInLineItems(items) {
    return items.map((item, index)=>({
            '{line_stt}': (index + 1).toString(),
            '{line_variant_code}': item.variantCode || '',
            '{line_product_name}': item.productName,
            '{line_variant_name}': item.variantName || '',
            '{line_variant}': item.variantName || '',
            '{line_variant_barcode}': item.barcode || '',
            '{line_unit}': item.unit || 'Cái',
            '{line_quantity}': item.quantity.toString(),
            '{line_ordered_quantity}': item.quantity.toString(),
            '{line_received_quantity}': item.receivedQuantity?.toString() || '0',
            '{line_price}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatCurrency"])(item.price),
            '{line_discount_rate}': item.discountRate ? `${item.discountRate}%` : '',
            '{line_discount_amount}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatCurrency"])(item.discountAmount),
            '{line_tax_rate}': item.taxRate ? `${item.taxRate}%` : '',
            '{line_tax_amount}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatCurrency"])(item.taxAmount),
            '{line_tax}': item.taxType || '',
            '{line_amount}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatCurrency"])(item.amount),
            '{line_total}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatCurrency"])(item.amount),
            '{line_brand}': item.brand || '',
            '{line_category}': item.category || '',
            '{line_variant_options}': item.variantOptions || '',
            '{bin_location}': item.binLocation || '',
            '{serials}': item.serial || ''
        }));
}
}),
"[project]/lib/print-mappers/stock-transfer.mapper.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "mapStockTransferLineItems",
    ()=>mapStockTransferLineItems,
    "mapStockTransferToPrintData",
    ()=>mapStockTransferToPrintData
]);
/**
 * Stock Transfer Mapper - Phiếu chuyển kho
 * Đồng bộ với variables/phieu-chuyen-hang.ts
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/print-service.ts [app-ssr] (ecmascript)");
;
function mapStockTransferToPrintData(transfer, storeSettings) {
    return {
        ...(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getStoreData"])(storeSettings),
        // === THÔNG TIN CHI NHÁNH ===
        '{location_name}': transfer.location?.name || storeSettings.name || '',
        '{location_address}': transfer.location?.address || storeSettings.address || '',
        '{location_province}': transfer.location?.province || '',
        '{store_province}': storeSettings.province || '',
        // === THÔNG TIN PHIẾU CHUYỂN HÀNG ===
        '{order_code}': transfer.code,
        '{transfer_code}': transfer.code,
        '{created_on}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatDate"])(transfer.createdAt),
        '{created_on_time}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatTime"])(transfer.createdAt),
        '{modified_on}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatDate"])(transfer.modifiedAt),
        '{modified_on_time}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatTime"])(transfer.modifiedAt),
        '{shipped_on}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatDate"])(transfer.shippedOn),
        '{shipped_on_time}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatTime"])(transfer.shippedOn),
        '{received_on}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatDate"])(transfer.receivedOn),
        '{received_on_time}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatTime"])(transfer.receivedOn),
        '{account_name}': transfer.createdBy || '',
        '{status}': transfer.status || '',
        '{reference}': transfer.reference || '',
        // === CHI NHÁNH CHUYỂN ===
        '{source_location_name}': transfer.sourceLocationName,
        '{source_location_address}': transfer.sourceLocationAddress || '',
        // === CHI NHÁNH NHẬN ===
        '{destination_location_name}': transfer.destinationLocationName,
        '{target_location_name}': transfer.destinationLocationName,
        '{destination_location_address}': transfer.destinationLocationAddress || '',
        // === KHỐI LƯỢNG ===
        '{weight_g}': transfer.totalWeightG?.toString() || '0',
        '{weight_kg}': transfer.totalWeightKg?.toString() || '0',
        // === TỔNG GIÁ TRỊ ===
        '{total_quantity}': transfer.totalQuantity?.toString() || '0',
        '{total_receipt_quantity}': transfer.totalReceiptQuantity?.toString() || '0',
        '{total_amount_transfer}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatCurrency"])(transfer.totalAmountTransfer),
        '{total_amount_receipt}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatCurrency"])(transfer.totalAmountReceipt),
        '{total_fee_amount}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatCurrency"])(transfer.totalFeeAmount),
        '{note}': transfer.note || ''
    };
}
function mapStockTransferLineItems(items) {
    return items.map((item, index)=>({
            '{line_stt}': (index + 1).toString(),
            '{line_variant_code}': item.variantCode || '',
            '{line_product_name}': item.productName,
            '{line_variant_name}': item.variantName || '',
            '{line_variant}': item.variantName || '',
            '{line_variant_barcode}': item.barcode || '',
            '{line_variant_image}': item.imageUrl ? `<img src="${item.imageUrl}" style="max-width:50px;max-height:50px"/>` : '',
            '{line_unit}': item.unit || 'Cái',
            '{line_quantity}': item.quantity.toString(),
            '{receipt_quantity}': item.receiptQuantity?.toString() || '',
            '{change_quantity}': item.changeQuantity?.toString() || '',
            '{line_price}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatCurrency"])(item.price),
            '{line_amount}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatCurrency"])(item.amount),
            '{line_amount_received}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatCurrency"])(item.amountReceived),
            '{line_weight_g}': item.weightG?.toString() || '',
            '{line_weight_kg}': item.weightKg?.toString() || '',
            '{line_brand}': item.brand || '',
            '{line_category}': item.category || '',
            '{line_variant_options}': item.variantOptions || '',
            '{serials}': item.serial || '',
            '{lots_number_code1}': item.lotNumber || '',
            '{lots_number_code2}': item.lotInfoQty || '',
            '{lots_number_code3}': item.lotInfo || '',
            '{lots_number_code4}': item.lotInfoExpiry || ''
        }));
}
}),
"[project]/lib/print-mappers/inventory-check.mapper.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "mapInventoryCheckLineItems",
    ()=>mapInventoryCheckLineItems,
    "mapInventoryCheckToPrintData",
    ()=>mapInventoryCheckToPrintData
]);
/**
 * Inventory Check Mapper - Phiếu kiểm kho
 * Đồng bộ với variables/phieu-kiem-hang.ts
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/print-service.ts [app-ssr] (ecmascript)");
;
function mapInventoryCheckToPrintData(check, storeSettings) {
    return {
        ...(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getStoreData"])(storeSettings),
        // === THÔNG TIN CHI NHÁNH ===
        '{location_name}': check.location?.name || storeSettings.name || '',
        '{location_address}': check.location?.address || storeSettings.address || '',
        '{location_province}': check.location?.province || '',
        '{store_province}': storeSettings.province || '',
        // === THÔNG TIN PHIẾU KIỂM HÀNG ===
        '{code}': check.code,
        '{inventory_code}': check.code,
        '{created_on}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatDate"])(check.createdAt),
        '{created_on_time}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatTime"])(check.createdAt),
        '{modified_on}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatDate"])(check.modifiedAt),
        '{modified_on_time}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatTime"])(check.modifiedAt),
        '{adjusted_on}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatDate"])(check.adjustedOn),
        '{adjusted_on_time}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatTime"])(check.adjustedOn),
        '{account_name}': check.createdBy || '',
        '{status}': check.status || '',
        '{inventory_status}': check.status || '',
        '{reason}': check.reason || '',
        // === TỔNG ===
        '{total}': check.totalQuantity?.toString() || '0',
        '{total_items}': check.totalQuantity?.toString() || '0',
        '{total_surplus}': check.totalSurplus?.toString() || '0',
        '{total_shortage}': check.totalShortage?.toString() || '0',
        '{note}': check.note || ''
    };
}
function mapInventoryCheckLineItems(items) {
    return items.map((item, index)=>({
            '{line_stt}': (index + 1).toString(),
            '{line_variant_code}': item.variantCode || '',
            '{line_product_name}': item.productName,
            '{line_variant_name}': item.variantName || '',
            '{line_variant}': item.variantName || '',
            '{line_variant_barcode}': item.barcode || '',
            '{line_unit}': item.unit || 'Cái',
            '{line_stock_quantity}': item.stockQuantity.toString(),
            '{line_on_hand}': item.stockQuantity.toString(),
            '{line_after_quantity}': item.afterQuantity.toString(),
            '{line_real_quantity}': item.afterQuantity.toString(),
            '{line_change_quantity}': item.changeQuantity.toString(),
            '{line_difference}': item.changeQuantity.toString(),
            '{line_reason}': item.reason || '',
            '{line_brand}': item.brand || '',
            '{line_category}': item.category || '',
            '{line_variant_options}': item.variantOptions || '',
            '{line_note}': item.note || ''
        }));
}
}),
"[project]/lib/print-mappers/warranty.mapper.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
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
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/print-service.ts [app-ssr] (ecmascript)");
;
function mapWarrantyToPrintData(warranty, storeSettings) {
    return {
        ...(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getStoreData"])(storeSettings),
        // === THÔNG TIN CHI NHÁNH ===
        '{location_name}': warranty.location?.name || storeSettings.name || '',
        '{location_address}': warranty.location?.address || storeSettings.address || '',
        '{location_province}': warranty.location?.province || '',
        '{store_province}': storeSettings.province || '',
        // === THÔNG TIN PHIẾU BẢO HÀNH ===
        '{warranty_card_code}': warranty.code,
        '{warranty_code}': warranty.code,
        '{created_on}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatDate"])(warranty.createdAt),
        '{modified_on}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatDate"])(warranty.modifiedAt),
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
        '{start_date}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatDate"])(warranty.startDate),
        '{end_date}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatDate"])(warranty.endDate),
        '{warranty_expired_on}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatDate"])(warranty.endDate),
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
            '{start_date}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatDate"])(item.startDate),
            '{end_date}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatDate"])(item.endDate)
        }));
}
}),
"[project]/lib/print-mappers/supplier-return.mapper.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "mapSupplierReturnLineItems",
    ()=>mapSupplierReturnLineItems,
    "mapSupplierReturnToPrintData",
    ()=>mapSupplierReturnToPrintData
]);
/**
 * Supplier Return Mapper - Phiếu trả hàng NCC
 * Đồng bộ với variables/phieu-tra-hang-ncc.ts
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/print-service.ts [app-ssr] (ecmascript)");
;
function mapSupplierReturnToPrintData(ret, storeSettings) {
    return {
        ...(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getStoreData"])(storeSettings),
        // === THÔNG TIN CHI NHÁNH ===
        '{location_name}': ret.location?.name || storeSettings.name || '',
        '{location_address}': ret.location?.address || storeSettings.address || '',
        '{location_province}': ret.location?.province || '',
        '{store_province}': storeSettings.province || '',
        // === THÔNG TIN PHIẾU HOÀN TRẢ ===
        '{refund_code}': ret.code,
        '{return_supplier_code}': ret.code,
        '{created_on}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatDate"])(ret.createdAt),
        '{modified_on}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatDate"])(ret.modifiedAt),
        '{account_name}': ret.createdBy || '',
        '{purchase_order_code}': ret.purchaseOrderCode || '',
        '{reference}': ret.reference || '',
        // === THÔNG TIN NHÀ CUNG CẤP ===
        '{supplier_name}': ret.supplierName,
        '{supplier_code}': ret.supplierCode || '',
        '{supplier_phone_number}': ret.supplierPhone || '',
        '{supplier_email}': ret.supplierEmail || '',
        '{supplier_address}': ret.supplierAddress || '',
        '{supplier_address1}': ret.supplierAddress || '',
        // === TỔNG GIÁ TRỊ ===
        '{note}': ret.reason || '',
        '{reason_return}': ret.reason || '',
        '{total_quantity}': ret.totalQuantity.toString(),
        '{total_amount}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatCurrency"])(ret.totalAmount),
        '{total_order}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatCurrency"])(ret.totalAmount),
        '{total_tax}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatCurrency"])(ret.totalTax),
        '{total_landed_costs}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatCurrency"])(ret.totalLandedCosts),
        '{total_discounts}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatCurrency"])(ret.totalDiscounts),
        '{total_price}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatCurrency"])(ret.totalPrice),
        '{discrepancy_price}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatCurrency"])(ret.discrepancyPrice),
        '{discrepancy_reason}': ret.discrepancyReason || '',
        '{transaction_refund_amount}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatCurrency"])(ret.transactionRefundAmount),
        '{refunded}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatCurrency"])(ret.transactionRefundAmount),
        '{transaction_refund_method_name}': ret.transactionRefundMethodName || '',
        '{transaction_refund_method_amount}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatCurrency"])(ret.transactionRefundMethodAmount),
        '{remaining}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatCurrency"])(ret.remaining)
    };
}
function mapSupplierReturnLineItems(items) {
    return items.map((item, index)=>({
            '{line_stt}': (index + 1).toString(),
            '{line_variant_sku}': item.variantSku || item.variantCode || '',
            '{line_variant_code}': item.variantCode || '',
            '{line_product_name}': item.productName,
            '{line_variant_name}': item.variantName || '',
            '{line_variant}': item.variantName || '',
            '{line_variant_barcode}': item.barcode || '',
            '{line_unit}': item.unit || 'Cái',
            '{line_quantity}': item.quantity.toString(),
            '{line_price}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatCurrency"])(item.price),
            '{line_price_after_discount}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatCurrency"])(item.priceAfterDiscount),
            '{line_discount_rate}': item.discountRate ? `${item.discountRate}%` : '',
            '{line_discount_amount}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatCurrency"])(item.discountAmount),
            '{tax_lines_rate}': item.taxRate ? `${item.taxRate}%` : '',
            '{line_amount}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatCurrency"])(item.amount),
            '{line_total}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatCurrency"])(item.amount),
            '{line_amount_none_discount}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatCurrency"])(item.amountNoneDiscount),
            '{serials}': item.serial || '',
            '{lots_number_code1}': item.lotNumber || '',
            '{lots_number_code2}': item.lotInfoQty || '',
            '{lots_number_code3}': item.lotInfo || '',
            '{lots_number_code4}': item.lotInfoExpiry || ''
        }));
}
}),
"[project]/lib/print-mappers/complaint.mapper.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
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
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/print-service.ts [app-ssr] (ecmascript)");
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
    const phone = complaint.customerPhoneHide ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["hidePhoneMiddle"])(complaint.customerPhone || '') : complaint.customerPhone || '';
    const statusVi = COMPLAINT_STATUS_MAP[complaint.status || ''] || complaint.status || '';
    const typeVi = COMPLAINT_TYPE_MAP[complaint.complaintType || ''] || complaint.complaintType || '';
    return {
        ...(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getStoreData"])(storeSettings),
        // === THÔNG TIN CHI NHÁNH ===
        '{location_name}': complaint.location?.name || storeSettings.name || '',
        '{location_address}': complaint.location?.address || storeSettings.address || '',
        '{location_province}': complaint.location?.province || '',
        '{location_phone}': complaint.location?.phone || storeSettings.phone || '',
        '{store_province}': storeSettings.province || '',
        // === THÔNG TIN PHIẾU KHIẾU NẠI ===
        '{complaint_code}': complaint.code,
        '{created_on}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatDate"])(complaint.createdAt),
        '{created_on_time}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatTime"])(complaint.createdAt),
        '{modified_on}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatDate"])(complaint.modifiedAt),
        '{account_name}': complaint.createdBy || '',
        // === THÔNG TIN KHÁCH HÀNG ===
        '{customer_name}': complaint.customerName,
        '{customer_code}': complaint.customerCode || '',
        '{customer_phone}': phone,
        '{customer_phone_number}': phone,
        '{customer_phone_hide}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["hidePhoneMiddle"])(complaint.customerPhone || ''),
        '{customer_email}': complaint.customerEmail || '',
        '{customer_address}': complaint.customerAddress || '',
        '{customer_group}': complaint.customerGroup || '',
        // === THÔNG TIN ĐƠN HÀNG LIÊN QUAN ===
        '{order_code}': complaint.orderCode || '',
        '{order_date}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatDate"])(complaint.orderCreatedAt),
        '{order_created_on}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatDate"])(complaint.orderCreatedAt),
        '{order_total}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatCurrency"])(complaint.orderTotal),
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
        '{resolved_on}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatDate"])(complaint.resolvedAt),
        '{resolved_on_time}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatTime"])(complaint.resolvedAt),
        '{response_deadline}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatDate"])(complaint.responseDeadline),
        // === CHI PHÍ BỒI THƯỜNG ===
        '{compensation_amount}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatCurrency"])(complaint.compensationAmount),
        '{compensation_amount_text}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["numberToWords"])(complaint.compensationAmount || 0),
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
}),
"[project]/lib/print-mappers/penalty.mapper.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "mapPenaltyToPrintData",
    ()=>mapPenaltyToPrintData
]);
/**
 * Penalty Mapper - Phiếu phạt
 * Đồng bộ với variables/phieu-phat.ts
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/print-service.ts [app-ssr] (ecmascript)");
;
function mapPenaltyToPrintData(penalty, storeSettings) {
    return {
        ...(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getStoreData"])(storeSettings),
        // === THÔNG TIN CHI NHÁNH ===
        '{location_name}': penalty.location?.name || storeSettings.name || '',
        '{location_address}': penalty.location?.address || storeSettings.address || '',
        '{location_province}': penalty.location?.province || '',
        '{location_phone}': penalty.location?.phone || storeSettings.phone || '',
        '{store_province}': storeSettings.province || '',
        // === THÔNG TIN PHIẾU PHẠT ===
        '{penalty_code}': penalty.code,
        '{created_on}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatDate"])(penalty.createdAt),
        '{created_on_time}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatTime"])(penalty.createdAt),
        '{modified_on}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatDate"])(penalty.modifiedAt),
        '{account_name}': penalty.createdBy || '',
        // === THÔNG TIN NHÂN VIÊN ===
        '{employee_name}': penalty.employeeName,
        '{employee_code}': penalty.employeeCode || '',
        '{employee_phone}': penalty.employeePhone || '',
        '{employee_email}': penalty.employeeEmail || '',
        '{employee_position}': penalty.employeePosition || '',
        '{position_name}': penalty.employeePosition || '',
        '{department_name}': penalty.department || '',
        '{department}': penalty.department || '',
        // === THÔNG TIN VI PHẠM ===
        '{penalty_date}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatDate"])(penalty.penaltyDate),
        '{penalty_date_time}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatTime"])(penalty.penaltyDate),
        '{violation_date}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatDate"])(penalty.penaltyDate),
        '{violation_type}': penalty.violationType || '',
        '{violation_description}': penalty.violationDescription || '',
        '{violation_evidence}': penalty.violationEvidence || '',
        '{evidence}': penalty.violationEvidence || '',
        '{violation_count}': penalty.violationCount?.toString() || '',
        // === THÔNG TIN PHẠT ===
        '{penalty_type}': penalty.penaltyType,
        '{penalty_level}': penalty.penaltyLevel || '',
        '{penalty_reason}': penalty.reason,
        '{reason}': penalty.reason,
        '{penalty_amount}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatCurrency"])(penalty.amount),
        '{amount}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatCurrency"])(penalty.amount),
        '{penalty_amount_text}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["numberToWords"])(penalty.amount),
        '{deduction_method}': penalty.deductionMethod || 'Trừ lương',
        '{deduction_period}': penalty.deductionPeriod || '',
        // === PHÊ DUYỆT ===
        '{status}': penalty.status || '',
        '{approved_by}': penalty.approvedBy || '',
        '{approved_on}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatDate"])(penalty.approvedAt),
        '{approved_on_time}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatTime"])(penalty.approvedAt),
        '{rejected_by}': penalty.rejectedBy || '',
        '{rejected_on}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatDate"])(penalty.rejectedAt),
        '{rejection_reason}': penalty.rejectionReason || '',
        // === THÔNG TIN BỔ SUNG ===
        '{witness_name}': penalty.witnessName || '',
        '{witness_signature}': penalty.witnessSignature || '',
        '{employee_acknowledgement}': penalty.employeeAcknowledgement ? 'Đã xác nhận' : '',
        '{employee_signature_date}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatDate"])(penalty.employeeSignatureDate),
        '{penalty_note}': penalty.note || '',
        '{note}': penalty.note || ''
    };
}
}),
"[project]/lib/print-mappers/supplier-order.mapper.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "mapSupplierOrderLineItems",
    ()=>mapSupplierOrderLineItems,
    "mapSupplierOrderToPrintData",
    ()=>mapSupplierOrderToPrintData
]);
/**
 * Supplier Order Mapper - Đơn đặt hàng nhập (don-dat-hang-nhap)
 * Đồng bộ với variables/don-dat-hang-nhap.ts
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/print-service.ts [app-ssr] (ecmascript)");
;
function mapSupplierOrderToPrintData(order, storeSettings) {
    return {
        ...(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getStoreData"])(storeSettings),
        // === THÔNG TIN CHI NHÁNH ===
        '{location_name}': order.location?.name || storeSettings.name || '',
        '{location_address}': order.location?.address || storeSettings.address || '',
        '{location_province}': order.location?.province || '',
        '{store_province}': storeSettings.province || '',
        // === THÔNG TIN ĐƠN ĐẶT HÀNG NHẬP ===
        '{order_supplier_code}': order.code,
        '{purchase_order_code}': order.code,
        '{code}': order.code,
        '{status}': order.status || '',
        '{received_status}': order.receivedStatus || '',
        '{financial_status}': order.financialStatus || '',
        '{refund_status}': order.refundStatus || '',
        '{refund_transaction_status}': order.refundTransactionStatus || '',
        '{created_on}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatDate"])(order.createdAt),
        '{created_on_time}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatTime"])(order.createdAt),
        '{modified_on}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatDate"])(order.modifiedOn),
        '{modified_on_time}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatTime"])(order.modifiedOn),
        '{received_on}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatDate"])(order.receivedOn),
        '{received_on_time}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatTime"])(order.receivedOn),
        '{due_on}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatDate"])(order.dueOn),
        '{due_on_time}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatTime"])(order.dueOn),
        '{completed_on}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatDate"])(order.completedOn),
        '{ended_on}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatDate"])(order.endedOn),
        '{cancelled_on}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatDate"])(order.cancelledOn),
        '{activated_account_name}': order.createdBy || '',
        '{account_name}': order.createdBy || '',
        '{assignee_name}': order.assigneeName || '',
        '{reference}': order.reference || '',
        '{billing_address}': order.billingAddress || '',
        // === THÔNG TIN NHÀ CUNG CẤP ===
        '{supplier_name}': order.supplierName,
        '{supplier_code}': order.supplierCode || '',
        '{supplier_phone}': order.supplierPhone || '',
        '{supplier_phone_number}': order.supplierPhone || '',
        '{supplier_email}': order.supplierEmail || '',
        '{supplier_address}': order.supplierAddress || '',
        // === NỢ NCC ===
        '{supplier_debt}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatCurrency"])(order.supplierDebt),
        '{supplier_debt_text}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["numberToWords"])(order.supplierDebt || 0),
        '{supplier_debt_prev}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatCurrency"])(order.supplierDebtPrev),
        '{supplier_debt_prev_text}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["numberToWords"])(order.supplierDebtPrev || 0),
        // === KHỐI LƯỢNG ===
        '{weight_g}': order.totalWeightG?.toString() || '0',
        '{weight_kg}': order.totalWeightKg?.toString() || '0',
        // === TỔNG GIÁ TRỊ ===
        '{total_quantity}': order.totalQuantity.toString(),
        '{total_price}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatCurrency"])(order.totalPrice),
        '{total}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatCurrency"])(order.totalPrice),
        '{total_order}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatCurrency"])(order.totalPrice),
        '{total_line_amount}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatCurrency"])(order.totalLineAmount),
        '{total_line_amount_text}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["numberToWords"])(order.totalLineAmount || 0),
        '{total_tax}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatCurrency"])(order.totalTax),
        '{total_extra_tax}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatCurrency"])(order.totalExtraTax),
        '{tax_vat}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatCurrency"])(order.totalTax),
        '{total_discounts}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatCurrency"])(order.totalDiscounts),
        '{discount}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatCurrency"])(order.totalDiscounts),
        '{product_discount}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatCurrency"])(order.productDiscount),
        '{total_discounts_rate}': order.totalDiscountsRate ? `${order.totalDiscountsRate}%` : '',
        '{total_discounts_value}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatCurrency"])(order.totalDiscountsValue),
        '{total_tax_included_line}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatCurrency"])(order.totalTaxIncludedLine),
        '{total_amount_before_tax}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatCurrency"])(order.totalAmountBeforeTax),
        '{total_amount_after_tax}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatCurrency"])(order.totalAmountAfterTax),
        '{total_amount_text}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["numberToWords"])(order.totalPrice),
        '{total_transaction_amount}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatCurrency"])(order.totalTransactionAmount),
        '{total_remain}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatCurrency"])(order.totalRemain),
        '{total_amount_transaction}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatCurrency"])(order.totalAmountTransaction),
        '{total_landed_costs}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatCurrency"])(order.totalLandedCosts),
        '{payments}': order.payments?.map((p)=>`${(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatDate"])(p.date)}: ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatCurrency"])(p.amount)} (${p.method})`).join(', ') || '',
        '{note}': order.note || '',
        '{tags}': order.tags?.join(', ') || ''
    };
}
function mapSupplierOrderLineItems(items) {
    return items.map((item, index)=>({
            '{line_stt}': (index + 1).toString(),
            '{line_title}': item.title || item.productName,
            '{line_product_name}': item.productName,
            '{line_unit}': item.unit || 'Cái',
            '{line_note}': item.note || '',
            '{line_quantity}': item.quantity.toString(),
            '{line_ordered_quantity}': item.quantity.toString(),
            '{line_received_quantity}': item.receivedQuantity?.toString() || '0',
            '{line_variant_code}': item.variantCode || '',
            '{line_variant_name}': item.variantName || '',
            '{line_variant_options}': item.variantOptions || '',
            '{line_variant_barcode}': item.barcode || '',
            '{line_category}': item.category || '',
            '{line_brand}': item.brand || '',
            '{line_price}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatCurrency"])(item.price),
            '{line_price_after_discount}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatCurrency"])(item.priceAfterDiscount),
            '{line_discount_amount}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatCurrency"])(item.discountAmount),
            '{line_discount_rate}': item.discountRate ? `${item.discountRate}%` : '',
            '{line_amount}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatCurrency"])(item.amount),
            '{line_total}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatCurrency"])(item.amount),
            '{line_tax_exclude}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatCurrency"])(item.taxExclude),
            '{line_tax_included}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatCurrency"])(item.taxIncluded),
            '{line_tax_amount}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatCurrency"])(item.taxAmount),
            '{line_tax_rate}': item.taxRate ? `${item.taxRate}%` : '',
            '{line_tax}': item.taxType || '',
            '{line_weight_g}': item.weightG?.toString() || '',
            '{line_weight_kg}': item.weightKg?.toString() || '',
            '{serials}': item.serials?.join(', ') || '',
            '{lots_number_code1}': item.lots?.[0] || '',
            '{lots_number_code2}': item.lots?.[1] || '',
            '{lots_number_code3}': item.lots?.[2] || '',
            '{lots_number_code4}': item.lots?.[3] || ''
        }));
}
}),
"[project]/lib/print-mappers/return-order.mapper.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "mapReturnOrderLineItems",
    ()=>mapReturnOrderLineItems,
    "mapReturnOrderToPrintData",
    ()=>mapReturnOrderToPrintData
]);
/**
 * Return Order Mapper - Đơn trả hàng (don-tra-hang)
 * Đồng bộ với variables/don-tra-hang.ts
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/print-service.ts [app-ssr] (ecmascript)");
;
function mapReturnOrderToPrintData(order, storeSettings) {
    return {
        ...(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getStoreData"])(storeSettings),
        // === THÔNG TIN CHI NHÁNH ===
        '{location_name}': order.location?.name || storeSettings.name || '',
        '{location_address}': order.location?.address || storeSettings.address || '',
        '{store_province}': storeSettings.province || '',
        '{location_province}': order.location?.province || '',
        // === THÔNG TIN ĐƠN TRẢ ===
        '{order_return_code}': order.code,
        '{return_code}': order.code,
        '{order_code}': order.orderCode || '',
        '{created_on}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatDate"])(order.createdAt),
        '{created_on_time}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatTime"])(order.createdAt),
        '{modified_on}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatDate"])(order.modifiedAt),
        '{received_on}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatDate"])(order.receivedOn),
        '{reference}': order.reference || '',
        '{account_name}': order.createdBy || '',
        // === TRẠNG THÁI ===
        '{status}': order.status || '',
        '{refund_status}': order.refundStatus || '',
        // === THÔNG TIN KHÁCH HÀNG ===
        '{customer_name}': order.customerName || '',
        '{customer_code}': order.customerCode || '',
        '{customer_phone_number}': order.customerPhone || '',
        '{customer_email}': order.customerEmail || '',
        '{customer_group}': order.customerGroup || '',
        '{billing_address}': order.billingAddress || '',
        // === LÝ DO ===
        '{reason_return}': order.reasonReturn || '',
        '{reason}': order.reasonReturn || '',
        // === TỔNG GIÁ TRỊ ===
        '{total_quantity}': order.totalQuantity.toString(),
        '{total_amount}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatCurrency"])(order.totalAmount),
        '{total_text}': order.totalText || '',
        '{note}': order.note || ''
    };
}
function mapReturnOrderLineItems(items) {
    return items.map((item, index)=>({
            '{line_stt}': (index + 1).toString(),
            '{line_variant_code}': item.variantCode || '',
            '{line_product_name}': item.productName,
            '{line_variant}': item.variantName || '',
            '{line_variant_options}': item.variantOptions || '',
            '{line_unit}': item.unit || 'Cái',
            '{line_quantity}': item.quantity.toString(),
            '{line_price}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatCurrency"])(item.price),
            '{line_amount}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatCurrency"])(item.amount),
            '{line_brand}': item.brand || '',
            '{serials}': item.serial || '',
            '{line_note}': item.note || ''
        }));
}
}),
"[project]/lib/print-mappers/handover.mapper.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "mapHandoverLineItems",
    ()=>mapHandoverLineItems,
    "mapHandoverToPrintData",
    ()=>mapHandoverToPrintData
]);
/**
 * Handover Mapper - Phiếu bàn giao tài sản/thiết bị
 * Đồng bộ với variables/phieu-ban-giao.ts và templates/handover.ts
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/print-service.ts [app-ssr] (ecmascript)");
;
function mapHandoverToPrintData(handover, storeSettings) {
    return {
        ...(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getStoreData"])(storeSettings),
        // === THÔNG TIN PHIẾU ===
        '{handover_code}': handover.code,
        '{created_on}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatDate"])(handover.createdAt),
        '{created_on_time}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatTime"])(handover.createdAt),
        '{handover_type}': handover.handoverType || '',
        '{status}': handover.status || '',
        '{note}': handover.note || '',
        '{account_name}': handover.accountName || '',
        // === NGƯỜI BÀN GIAO ===
        '{from_employee}': handover.fromEmployee?.name || '',
        '{from_employee_code}': handover.fromEmployee?.code || '',
        '{from_department}': handover.fromEmployee?.department || '',
        '{from_position}': handover.fromEmployee?.position || '',
        // === NGƯỜI NHẬN ===
        '{to_employee}': handover.toEmployee?.name || '',
        '{to_employee_code}': handover.toEmployee?.code || '',
        '{to_department}': handover.toEmployee?.department || '',
        '{to_position}': handover.toEmployee?.position || '',
        // === TỔNG KẾT ===
        '{total_items}': handover.totalItems?.toString() || handover.items.length.toString(),
        '{total_quantity}': handover.totalQuantity?.toString() || handover.items.reduce((sum, item)=>sum + (item.quantity || 0), 0).toString(),
        '{total_value}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatCurrency"])(handover.totalValue || handover.items.reduce((sum, item)=>sum + (item.value || 0), 0))
    };
}
function mapHandoverLineItems(items) {
    return items.map((item)=>({
            '{line_item_code}': item.itemCode || '',
            '{line_item_name}': item.itemName || '',
            '{line_description}': item.description || '',
            '{line_serial}': item.serial || '',
            '{line_quantity}': item.quantity?.toString() || '1',
            '{line_unit}': item.unit || 'Cái',
            '{line_condition}': item.condition || 'Tốt',
            '{line_value}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatCurrency"])(item.value),
            '{line_note}': item.note || ''
        }));
}
}),
"[project]/lib/print-mappers/refund-confirmation.mapper.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "mapRefundConfirmationLineItems",
    ()=>mapRefundConfirmationLineItems,
    "mapRefundConfirmationToPrintData",
    ()=>mapRefundConfirmationToPrintData
]);
/**
 * Refund Confirmation Mapper - Phiếu xác nhận hoàn (phieu-xac-nhan-hoan)
 * Đồng bộ với variables/phieu-xac-nhan-hoan.ts
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$mappers$2f$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/lib/print-mappers/types.ts [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/print-service.ts [app-ssr] (ecmascript)");
;
function mapRefundConfirmationToPrintData(refund, storeSettings) {
    return {
        ...(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getStoreData"])(storeSettings),
        // === THÔNG TIN CHI NHÁNH ===
        '{location_name}': refund.location?.name || storeSettings.name || '',
        '{location_address}': refund.location?.address || storeSettings.address || '',
        // === THÔNG TIN PHIẾU XÁC NHẬN HOÀN ===
        '{hand_over_code}': refund.code,
        '{printed_on}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatDate"])(refund.printedOn),
        '{current_account_name}': refund.accountName || '',
        '{account_name}': refund.accountName || '',
        '{created_on}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatDate"])(refund.createdOn || refund.printedOn),
        '{created_on_time}': refund.createdOnTime || '',
        // === THÔNG TIN VẬN CHUYỂN ===
        '{shipping_provider_name}': refund.shippingProviderName || '',
        '{service_name}': refund.serviceName || '',
        // === THÔNG TIN KHÁCH HÀNG ===
        '{customer_name}': refund.customerName || '',
        '{customer_phone_number}': refund.customerPhoneNumber || '',
        // === THÔNG TIN NGÂN HÀNG ===
        '{bank_name}': refund.bankName || '',
        '{bank_branch}': refund.bankBranch || '',
        '{bank_account}': refund.bankAccount || '',
        '{bank_account_name}': refund.bankAccountName || '',
        // === THÔNG TIN HOÀN TIỀN ===
        '{refund_code}': refund.refundCode || refund.code,
        '{refund_amount}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatCurrency"])(refund.refundAmount),
        '{refund_amount_text}': refund.refundAmountText || '',
        '{refund_method}': refund.refundMethod || '',
        '{refund_reason}': refund.refundReason || '',
        '{refund_status}': refund.refundStatus || '',
        '{refunded_on}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatDate"])(refund.refundedOn),
        // === THÔNG TIN ĐƠN TRẢ HÀNG ===
        '{return_code}': refund.returnCode || '',
        '{return_date}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatDate"])(refund.returnDate),
        '{order_date}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatDate"])(refund.orderDate),
        // === TỔNG GIÁ TRỊ ===
        '{total_cod}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatCurrency"])(refund.totalCod),
        '{quantity}': refund.quantity?.toString() || refund.orders.length.toString(),
        '{note}': refund.note || ''
    };
}
function mapRefundConfirmationLineItems(orders) {
    return orders.map((order)=>({
            '{order_code}': order.orderCode,
            '{shipment_code}': order.shipmentCode || '',
            '{shipping_name}': order.shippingName || '',
            '{shipping_phone}': order.shippingPhone || '',
            '{shipping_phone_hide}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$mappers$2f$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["hidePhoneMiddle"])(order.shippingPhone || ''),
            '{shipping_address}': order.shippingAddress || '',
            '{city}': order.city || '',
            '{district}': order.district || '',
            '{cod}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatCurrency"])(order.cod),
            '{note}': order.note || ''
        }));
}
}),
"[project]/lib/print-mappers/packing-guide.mapper.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "mapPackingGuideLineItems",
    ()=>mapPackingGuideLineItems,
    "mapPackingGuideToPrintData",
    ()=>mapPackingGuideToPrintData
]);
/**
 * Packing Guide Mapper - Phiếu hướng dẫn đóng gói (phieu-huong-dan-dong-goi)
 * Đồng bộ với variables/phieu-huong-dan-dong-goi.ts
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/print-service.ts [app-ssr] (ecmascript)");
;
function mapPackingGuideToPrintData(guide, storeSettings) {
    return {
        ...(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getStoreData"])(storeSettings),
        // === THÔNG TIN PHIẾU HƯỚNG DẪN ĐÓNG GÓI ===
        '{created_on}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatDate"])(guide.createdAt),
        '{created_on_time}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatTime"])(guide.createdAt),
        '{list_order_code}': guide.listOrderCode?.join(', ') || '',
        '{order_code}': guide.orderCode || guide.listOrderCode?.[0] || '',
        // === NHÂN VIÊN ===
        '{account_name}': guide.accountName || '',
        '{account_phone}': guide.accountPhone || '',
        '{account_email}': guide.accountEmail || '',
        // === CHI NHÁNH ===
        '{location_name}': guide.locationName || storeSettings.name || '',
        // === THÔNG TIN KHÁCH HÀNG ===
        '{customer_name}': guide.customerName || '',
        '{customer_phone_number}': guide.customerPhoneNumber || '',
        // === THÔNG TIN VẬN CHUYỂN ===
        '{shipping_address}': guide.shippingAddress || '',
        '{cod}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatCurrency"])(guide.cod),
        // === TỔNG GIÁ TRỊ ===
        '{total}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatCurrency"])(guide.total),
        '{total_product_quantity}': guide.totalProductQuantity?.toString() || '0',
        '{total_quantity}': guide.totalQuantity?.toString() || guide.totalProductQuantity?.toString() || '0',
        '{order_note}': guide.orderNote || '',
        '{packing_note}': guide.packingNote || ''
    };
}
function mapPackingGuideLineItems(items) {
    return items.map((item, index)=>({
            '{line_stt}': (index + 1).toString(),
            '{line_variant_sku}': item.variantCode || '',
            '{line_variant_code}': item.variantCode || '',
            '{line_variant_barcode}': item.variantBarcode || '',
            '{line_product_name}': item.productName,
            '{line_variant_name}': item.variantName || '',
            '{line_variant}': item.variant || item.variantName || '',
            '{line_variant_options}': item.variantOptions || '',
            '{line_unit}': item.unit || 'Cái',
            '{line_quantity}': item.quantity.toString(),
            '{line_brand}': item.brand || '',
            '{line_category}': item.category || '',
            '{bin_location}': item.binLocation || '',
            '{line_image}': item.image || '',
            '{line_variant_qrcode}': item.variantQrCode ? `https://quickchart.io/qr?text=${encodeURIComponent(item.variantQrCode)}&size=100` : '',
            '{composite_details}': item.compositeDetails || '',
            '{line_product_description}': item.productDescription || '',
            '{lineitem_note}': item.note || '',
            '{note_of_store}': item.storeNote || '',
            '{location_name}': ''
        }));
}
}),
"[project]/lib/print-mappers/sales-summary.mapper.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "mapSalesSummaryItemsFulfillment",
    ()=>mapSalesSummaryItemsFulfillment,
    "mapSalesSummaryItemsReturn",
    ()=>mapSalesSummaryItemsReturn,
    "mapSalesSummaryLineItems",
    ()=>mapSalesSummaryLineItems,
    "mapSalesSummaryOrdersFinished",
    ()=>mapSalesSummaryOrdersFinished,
    "mapSalesSummaryPaymentMethods",
    ()=>mapSalesSummaryPaymentMethods,
    "mapSalesSummaryToPrintData",
    ()=>mapSalesSummaryToPrintData
]);
/**
 * Sales Summary Mapper - Phiếu tổng kết bán hàng (phieu-tong-ket-ban-hang)
 * Đồng bộ với variables/phieu-tong-ket-ban-hang.ts
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/print-service.ts [app-ssr] (ecmascript)");
;
function mapSalesSummaryToPrintData(summary, storeSettings) {
    return {
        ...(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getStoreData"])(storeSettings),
        // === THÔNG TIN ===
        '{location_name}': summary.locationName || storeSettings.name || '',
        '{account_name}': summary.accountName || '',
        '{date_print}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatDate"])(summary.datePrint),
        '{time_print}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatTime"])(summary.timePrint || summary.datePrint),
        '{time_filter}': summary.timeFilter || '',
        '{source_name}': summary.sourceName || '',
        '{created_on}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatDate"])(summary.createdOn || summary.datePrint),
        '{from_date}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatDate"])(summary.fromDate),
        '{to_date}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatDate"])(summary.toDate),
        '{period}': summary.period || '',
        '{note}': summary.note || '',
        // === TỔNG QUAN BÁN HÀNG ===
        '{total_quantity_order_finished}': summary.totalQuantityOrderFinished?.toString() || '0',
        '{total_quantity_line_item_fulfillment}': summary.totalQuantityLineItemFulfillment?.toString() || '0',
        '{total_quantity_line_item_return}': summary.totalQuantityLineItemReturn?.toString() || '0',
        '{total_line_amount}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatCurrency"])(summary.totalLineAmount),
        '{total_order_payment}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatCurrency"])(summary.totalOrderPayment),
        '{total_order_return_payment}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatCurrency"])(summary.totalOrderReturnPayment),
        '{total_real_receipt}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatCurrency"])(summary.totalRealReceipt),
        // === TỔNG KẾT ===
        '{total_orders}': summary.totalOrders?.toString() || summary.totalQuantityOrderFinished?.toString() || '0',
        '{total_revenue}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatCurrency"])(summary.totalRevenue || summary.totalLineAmount),
        '{sales_revenue}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatCurrency"])(summary.salesRevenue || summary.totalLineAmount),
        '{delivery_revenue}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatCurrency"])(summary.deliveryRevenue),
        '{total_discount}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatCurrency"])(summary.totalDiscount),
        '{total_tax}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatCurrency"])(summary.totalTax),
        '{total_returns}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatCurrency"])(summary.totalReturns || summary.totalOrderReturnPayment),
        '{total_collected}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatCurrency"])(summary.totalCollected || summary.totalRealReceipt),
        // === THỰC THU THEO HÌNH THỨC ===
        '{real_receipt_cash}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatCurrency"])(summary.realReceiptCash),
        '{real_receipt_transfer}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatCurrency"])(summary.realReceiptTransfer),
        '{real_receipt_mpos}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatCurrency"])(summary.realReceiptMpos),
        '{real_receipt_cod}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatCurrency"])(summary.realReceiptCod),
        '{real_receipt_online}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatCurrency"])(summary.realReceiptOnline),
        // === CHI TIẾT THANH TOÁN ===
        '{cash_amount}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatCurrency"])(summary.cashAmount || summary.realReceiptCash),
        '{card_amount}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatCurrency"])(summary.cardAmount || summary.realReceiptMpos),
        '{bank_transfer_amount}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatCurrency"])(summary.bankTransferAmount || summary.realReceiptTransfer),
        '{cod_amount}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatCurrency"])(summary.codAmount || summary.realReceiptCod),
        '{ewallet_amount}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatCurrency"])(summary.ewalletAmount || summary.realReceiptOnline),
        // === NỢ ===
        '{debt}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatCurrency"])(summary.debt),
        // === TỔNG THU ===
        '{receipt_in_day}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatCurrency"])(summary.receiptInDay),
        '{receipt_cash}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatCurrency"])(summary.receiptCash),
        '{receipt_transfer}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatCurrency"])(summary.receiptTransfer),
        '{receipt_mpos}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatCurrency"])(summary.receiptMpos),
        '{receipt_cod}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatCurrency"])(summary.receiptCod),
        '{receipt_online}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatCurrency"])(summary.receiptOnline),
        // === TỔNG CHI ===
        '{payment_in_day}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatCurrency"])(summary.paymentInDay),
        '{payment_cash}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatCurrency"])(summary.paymentCash),
        '{payment_transfer}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatCurrency"])(summary.paymentTransfer),
        '{payment_mpos}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatCurrency"])(summary.paymentMpos)
    };
}
function mapSalesSummaryOrdersFinished(orders) {
    if (!orders) return [];
    return orders.map((order)=>({
            '{stt_order_finish}': order.stt.toString(),
            '{order_code}': order.orderCode,
            '{amount_order_finished}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatCurrency"])(order.amount),
            '{discount_order_finished}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatCurrency"])(order.discount),
            '{tax_order_finished}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatCurrency"])(order.tax),
            '{total_order_finished}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatCurrency"])(order.total)
        }));
}
function mapSalesSummaryItemsFulfillment(items) {
    if (!items) return [];
    return items.map((item)=>({
            '{stt_item_fulfillment}': item.stt.toString(),
            '{sku_fulfillment}': item.sku,
            '{variant_name_fulfillment}': item.variantName,
            '{quantity_item_fulfilment}': item.quantity.toString(),
            '{amount_item_fulfilment}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatCurrency"])(item.amount)
        }));
}
function mapSalesSummaryItemsReturn(items) {
    if (!items) return [];
    return items.map((item)=>({
            '{stt_item_return}': item.stt.toString(),
            '{sku_return}': item.sku,
            '{variant_name_return}': item.variantName,
            '{quantity_item_return}': item.quantity.toString(),
            '{amount_item_return}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatCurrency"])(item.amount)
        }));
}
function mapSalesSummaryPaymentMethods(methods) {
    if (!methods) return [];
    return methods.map((method)=>({
            '{payment_method_name}': method.name,
            '{payment_method_amount}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatCurrency"])(method.amount)
        }));
}
function mapSalesSummaryLineItems(items) {
    if (!items) return [];
    return items.map((item, index)=>({
            '{line_stt}': (index + 1).toString(),
            '{line_product_name}': item.productName || '',
            '{line_quantity}': item.quantity?.toString() || '0',
            '{line_amount}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatCurrency"])(item.amount)
        }));
}
}),
"[project]/lib/print-mappers/warranty-request.mapper.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
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
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/print-service.ts [app-ssr] (ecmascript)");
;
function mapWarrantyRequestToPrintData(request, storeSettings) {
    return {
        ...(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getStoreData"])(storeSettings),
        // === THÔNG TIN CHI NHÁNH ===
        '{location_name}': request.location?.name || storeSettings.name || '',
        '{location_address}': request.location?.address || storeSettings.address || '',
        '{store_province}': storeSettings.province || '',
        '{location_province}': request.location?.province || '',
        // === THÔNG TIN PHIẾU YÊU CẦU BẢO HÀNH ===
        '{warranty_claim_card_code}': request.code,
        '{warranty_request_code}': request.warrantyRequestCode || request.code,
        '{order_code}': request.orderCode || '',
        '{created_on}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatDate"])(request.createdAt),
        '{created_on_time}': request.createdAtTime || '',
        '{modified_on}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatDate"])(request.modifiedAt),
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
        '{purchase_date}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatDate"])(request.purchaseDate),
        '{warranty_expired_on}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatDate"])(request.warrantyExpiredOn),
        '{warranty_duration}': request.warrantyDuration || '',
        // === THÔNG TIN SỰ CỐ ===
        '{issue_type}': request.issueType || '',
        '{issue_description}': request.issueDescription || '',
        '{device_condition}': request.deviceCondition || '',
        '{accessories}': request.accessories || '',
        // === XỬ LÝ ===
        '{received_by}': request.receivedBy || '',
        '{technician_name}': request.technicianName || '',
        '{expected_completion_date}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatDate"])(request.expectedCompletionDate),
        '{note}': request.note || '',
        // === TAGS ===
        '{tag}': request.tag || '',
        // === TỔNG GIÁ TRỊ ===
        '{total_quantity}': request.totalQuantity.toString(),
        '{total_amount}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatCurrency"])(request.totalAmount)
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
            '{line_received_on}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatDate"])(item.receivedOn),
            '{line_status}': item.status || '',
            '{line_expense_title}': item.expenseTitle || '',
            '{line_expense_amount}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatCurrency"])(item.expenseAmount),
            '{line_expense_total_amount}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatCurrency"])(item.expenseTotalAmount)
        }));
}
}),
"[project]/lib/print-mappers/packing-request.mapper.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "mapPackingRequestLineItems",
    ()=>mapPackingRequestLineItems,
    "mapPackingRequestToPrintData",
    ()=>mapPackingRequestToPrintData
]);
/**
 * Packing Request Mapper - Phiếu yêu cầu đóng gói (phieu-yeu-cau-dong-goi)
 * Đồng bộ với variables/phieu-yeu-cau-dong-goi.ts
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$mappers$2f$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/lib/print-mappers/types.ts [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/print-service.ts [app-ssr] (ecmascript)");
;
function mapPackingRequestToPrintData(request, storeSettings) {
    const barcode = request.code ? `https://barcodeapi.org/api/128/${encodeURIComponent(request.code)}` : '';
    const orderBarcode = request.orderCode ? `https://barcodeapi.org/api/128/${encodeURIComponent(request.orderCode)}` : '';
    return {
        ...(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getStoreData"])(storeSettings),
        // === THÔNG TIN CHI NHÁNH ===
        '{location_name}': request.location?.name || storeSettings.name || '',
        '{location_address}': request.location?.address || storeSettings.address || '',
        '{store_province}': storeSettings.province || '',
        '{location_province}': request.location?.province || '',
        // === THÔNG TIN PHIẾU YÊU CẦU ĐÓNG GÓI ===
        '{code}': request.code,
        '{packing_request_code}': request.packingRequestCode || request.code,
        '{bar_code(code)}': barcode,
        '{order_code}': request.orderCode || '',
        '{bar_code(order_code)}': orderBarcode,
        '{created_on}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatDate"])(request.createdAt),
        '{created_on_time}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatTime"])(request.createdAt),
        '{packed_on}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatDate"])(request.packedOn),
        '{packed_on_time}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatTime"])(request.packedOn),
        '{cancel_date}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatDate"])(request.cancelDate),
        '{ship_on_min}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatDate"])(request.shipOnMin),
        '{ship_on_max}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatDate"])(request.shipOnMax),
        '{deadline}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatDate"])(request.deadline),
        '{priority}': request.priority || '',
        // === NHÂN VIÊN ===
        '{account_name}': request.accountName || '',
        '{packed_processing_account_name}': request.packedProcessingAccountName || '',
        '{cancel_account_name}': request.cancelAccountName || '',
        '{assignee_name}': request.assigneeName || '',
        '{assigned_employee}': request.assignedEmployee || request.assigneeName || '',
        // === TRẠNG THÁI ===
        '{status}': request.status || '',
        // === THÔNG TIN KHÁCH HÀNG ===
        '{customer_name}': request.customerName || '',
        '{customer_phone_number}': request.customerPhone || '',
        '{customer_phone_number_hide}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$mappers$2f$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["hidePhoneMiddle"])(request.customerPhone || ''),
        '{customer_email}': request.customerEmail || '',
        '{shipping_address}': request.shippingAddress || '',
        // === THÔNG TIN VẬN CHUYỂN ===
        '{carrier_name}': request.carrierName || '',
        '{service_name}': request.serviceName || '',
        '{cod}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatCurrency"])(request.cod),
        // === GHI CHÚ ===
        '{order_note}': request.orderNote || '',
        '{packing_note}': request.packingNote || '',
        '{special_request}': request.specialRequest || '',
        // === TỔNG GIÁ TRỊ ===
        '{total_quantity}': request.totalQuantity.toString(),
        '{total_tax}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatCurrency"])(request.totalTax),
        '{fulfillment_discount}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatCurrency"])(request.fulfillmentDiscount),
        '{total}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatCurrency"])(request.total),
        '{total_weight}': request.totalWeight?.toString() || '0'
    };
}
function mapPackingRequestLineItems(items) {
    return items.map((item, index)=>({
            '{line_stt}': (index + 1).toString(),
            '{line_variant_code}': item.variantCode || '',
            '{line_product_name}': item.productName,
            '{line_variant}': item.variantName || '',
            '{line_unit}': item.unit || 'Cái',
            '{line_quantity}': item.quantity.toString(),
            '{line_price}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatCurrency"])(item.price),
            '{line_discount_rate}': item.discountRate ? `${item.discountRate}%` : '',
            '{line_discount_amount}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatCurrency"])(item.discountAmount),
            '{line_tax_rate}': item.taxRate ? `${item.taxRate}%` : '',
            '{line_tax}': item.taxType || '',
            '{line_amount}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatCurrency"])(item.amount),
            '{lots_number_code1}': item.lotNumber || '',
            '{lots_number_code2}': item.lotInfoQty || '',
            '{lots_number_code3}': item.lotInfo || '',
            '{lots_number_code4}': item.lotInfoExpiry || '',
            '{line_note}': item.note || '',
            '{bin_location}': item.binLocation || ''
        }));
}
}),
"[project]/lib/print-mappers/index.ts [app-ssr] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
/**
 * Print Mappers - Index
 * Export tất cả mappers từ một nơi
 */ // Types & Utilities
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/print-service.ts [app-ssr] (ecmascript)");
// =============================================
// MAIN TEMPLATE TYPES (16 loại chính)
// =============================================
// Order - Đơn bán hàng
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$mappers$2f$order$2e$mapper$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/print-mappers/order.mapper.ts [app-ssr] (ecmascript)");
// Quote - Báo giá / Đơn tạm tính
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$mappers$2f$quote$2e$mapper$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/print-mappers/quote.mapper.ts [app-ssr] (ecmascript)");
// Sales Return - Đơn đổi trả hàng
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$mappers$2f$sales$2d$return$2e$mapper$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/print-mappers/sales-return.mapper.ts [app-ssr] (ecmascript)");
// Packing - Phiếu đóng gói
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$mappers$2f$packing$2e$mapper$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/print-mappers/packing.mapper.ts [app-ssr] (ecmascript)");
// Delivery - Phiếu giao hàng
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$mappers$2f$delivery$2e$mapper$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/print-mappers/delivery.mapper.ts [app-ssr] (ecmascript)");
// Shipping Label - Nhãn giao hàng
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$mappers$2f$shipping$2d$label$2e$mapper$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/print-mappers/shipping-label.mapper.ts [app-ssr] (ecmascript)");
// Product Label - Tem phụ sản phẩm
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$mappers$2f$product$2d$label$2e$mapper$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/print-mappers/product-label.mapper.ts [app-ssr] (ecmascript)");
// Purchase Order - Đơn đặt hàng nhập
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$mappers$2f$purchase$2d$order$2e$mapper$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/print-mappers/purchase-order.mapper.ts [app-ssr] (ecmascript)");
// Stock In - Phiếu nhập kho
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$mappers$2f$stock$2d$in$2e$mapper$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/print-mappers/stock-in.mapper.ts [app-ssr] (ecmascript)");
// Stock Transfer - Phiếu chuyển kho
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$mappers$2f$stock$2d$transfer$2e$mapper$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/print-mappers/stock-transfer.mapper.ts [app-ssr] (ecmascript)");
// Inventory Check - Phiếu kiểm kho
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$mappers$2f$inventory$2d$check$2e$mapper$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/print-mappers/inventory-check.mapper.ts [app-ssr] (ecmascript)");
// Receipt - Phiếu thu
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$mappers$2f$receipt$2e$mapper$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/print-mappers/receipt.mapper.ts [app-ssr] (ecmascript)");
// Payment - Phiếu chi
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$mappers$2f$payment$2e$mapper$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/print-mappers/payment.mapper.ts [app-ssr] (ecmascript)");
// Warranty - Phiếu bảo hành
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$mappers$2f$warranty$2e$mapper$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/print-mappers/warranty.mapper.ts [app-ssr] (ecmascript)");
// Supplier Return - Phiếu trả hàng NCC
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$mappers$2f$supplier$2d$return$2e$mapper$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/print-mappers/supplier-return.mapper.ts [app-ssr] (ecmascript)");
// Complaint - Phiếu khiếu nại
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$mappers$2f$complaint$2e$mapper$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/print-mappers/complaint.mapper.ts [app-ssr] (ecmascript)");
// Penalty - Phiếu phạt
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$mappers$2f$penalty$2e$mapper$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/print-mappers/penalty.mapper.ts [app-ssr] (ecmascript)");
// =============================================
// EXTENDED TEMPLATE TYPES (8 loại mở rộng)
// =============================================
// Supplier Order - Đơn đặt hàng nhập (don-dat-hang-nhap)
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$mappers$2f$supplier$2d$order$2e$mapper$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/print-mappers/supplier-order.mapper.ts [app-ssr] (ecmascript)");
// Return Order - Đơn trả hàng (don-tra-hang)
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$mappers$2f$return$2d$order$2e$mapper$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/print-mappers/return-order.mapper.ts [app-ssr] (ecmascript)");
// Handover - Phiếu bàn giao (phieu-ban-giao)
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$mappers$2f$handover$2e$mapper$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/print-mappers/handover.mapper.ts [app-ssr] (ecmascript)");
// Refund Confirmation - Phiếu xác nhận hoàn (phieu-xac-nhan-hoan)
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$mappers$2f$refund$2d$confirmation$2e$mapper$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/print-mappers/refund-confirmation.mapper.ts [app-ssr] (ecmascript)");
// Packing Guide - Phiếu hướng dẫn đóng gói (phieu-huong-dan-dong-goi)
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$mappers$2f$packing$2d$guide$2e$mapper$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/print-mappers/packing-guide.mapper.ts [app-ssr] (ecmascript)");
// Sales Summary - Phiếu tổng kết bán hàng (phieu-tong-ket-ban-hang)
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$mappers$2f$sales$2d$summary$2e$mapper$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/print-mappers/sales-summary.mapper.ts [app-ssr] (ecmascript)");
// Warranty Request - Phiếu yêu cầu bảo hành (phieu-yeu-cau-bao-hanh)
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$mappers$2f$warranty$2d$request$2e$mapper$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/print-mappers/warranty-request.mapper.ts [app-ssr] (ecmascript)");
// Packing Request - Phiếu yêu cầu đóng gói (phieu-yeu-cau-dong-goi)
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$mappers$2f$packing$2d$request$2e$mapper$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/print-mappers/packing-request.mapper.ts [app-ssr] (ecmascript)");
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
}),
"[project]/lib/print-data-mappers.ts [app-ssr] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
/**
 * Print Data Mappers
 * 
 * @deprecated File này đã được tách thành thư mục `lib/print-mappers/`
 * Import từ `@/lib/print-mappers` thay vì file này
 * 
 * File này chỉ re-export để đảm bảo backward compatibility
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$mappers$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/lib/print-mappers/index.ts [app-ssr] (ecmascript) <locals>");
;
}),
"[project]/lib/print/order-print-helper.ts [app-ssr] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

/**
 * Order Print Helper
 * Helpers để chuẩn bị dữ liệu in cho đơn hàng
 */ __turbopack_context__.s([
    "convertOrderForPrint",
    ()=>convertOrderForPrint,
    "convertPackagingToDeliveryForPrint",
    ()=>convertPackagingToDeliveryForPrint,
    "convertToPackingForPrint",
    ()=>convertToPackingForPrint,
    "convertToShippingLabelForPrint",
    ()=>convertToShippingLabelForPrint,
    "createStoreSettings",
    ()=>createStoreSettings
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$data$2d$mappers$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/lib/print-data-mappers.ts [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$mappers$2f$order$2e$mapper$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/print-mappers/order.mapper.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$mappers$2f$delivery$2e$mapper$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/print-mappers/delivery.mapper.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$mappers$2f$shipping$2d$label$2e$mapper$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/print-mappers/shipping-label.mapper.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$mappers$2f$packing$2e$mapper$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/print-mappers/packing.mapper.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$orders$2f$address$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/orders/address-utils.ts [app-ssr] (ecmascript)");
;
;
function convertOrderForPrint(order, options = {}) {
    const { customer, createdByEmployee } = options;
    // Tính tổng số lượng
    const totalQuantity = order.lineItems.reduce((sum, item)=>sum + item.quantity, 0);
    // Tính tổng giảm giá dòng
    const lineDiscounts = order.lineItems.reduce((sum, item)=>{
        if (item.discountType === 'percentage') {
            return sum + item.unitPrice * item.quantity * item.discount / 100;
        }
        return sum + item.discount * item.quantity;
    }, 0);
    // Tổng giảm giá (dòng + đơn)
    const totalDiscount = lineDiscounts + (order.orderDiscount || 0) + (order.voucherAmount || 0);
    // Format địa chỉ
    const shippingAddr = typeof order.shippingAddress === 'string' ? order.shippingAddress : (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$orders$2f$address$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatOrderAddress"])(order.shippingAddress);
    const billingAddr = typeof order.billingAddress === 'string' ? order.billingAddress : (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$orders$2f$address$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatOrderAddress"])(order.billingAddress);
    // Get customer first address for fallback
    const customerFirstAddress = customer?.addresses?.[0];
    const customerAddressString = customerFirstAddress ? [
        customerFirstAddress.street,
        customerFirstAddress.ward,
        customerFirstAddress.district,
        customerFirstAddress.province
    ].filter(Boolean).join(', ') : '';
    return {
        code: order.id,
        createdAt: order.orderDate,
        createdBy: createdByEmployee?.fullName || order.salesperson,
        // Trạng thái
        status: order.status,
        paymentStatus: order.paymentStatus,
        fulfillmentStatus: order.deliveryStatus,
        // Customer
        customer: customer ? {
            name: customer.name,
            code: customer.id,
            phone: customer.phone,
            email: customer.email,
            group: customer.customerGroup || '',
            address: customerAddressString
        } : {
            name: order.customerName
        },
        billingAddress: billingAddr,
        shippingAddress: shippingAddr,
        items: order.lineItems.map((item)=>{
            const lineDiscount = item.discountType === 'percentage' ? item.unitPrice * item.quantity * item.discount / 100 : item.discount * item.quantity;
            const lineAmountBeforeTax = item.unitPrice * item.quantity - lineDiscount;
            // Tính thuế cho từng dòng
            const taxRate = item.tax || 0; // % thuế (ví dụ: 10)
            const lineTaxAmount = lineAmountBeforeTax * taxRate / 100;
            const lineAmount = lineAmountBeforeTax + lineTaxAmount;
            return {
                productName: item.productName,
                variantName: '',
                variantCode: item.productId,
                unit: 'Cái',
                quantity: item.quantity,
                price: item.unitPrice,
                discountAmount: lineDiscount,
                taxAmount: lineTaxAmount,
                taxRate: taxRate,
                amount: lineAmount,
                note: item.note || ''
            };
        }),
        totalQuantity,
        subtotal: order.subtotal,
        totalDiscount,
        totalTax: order.tax,
        deliveryFee: order.shippingFee,
        total: order.grandTotal,
        paymentMethod: order.expectedPaymentMethod || order.payments[0]?.method,
        paidAmount: order.paidAmount,
        changeAmount: order.paidAmount > order.grandTotal ? order.paidAmount - order.grandTotal : 0,
        note: order.notes
    };
}
function convertPackagingToDeliveryForPrint(order, packaging, options = {}) {
    const { customer } = options;
    // Format địa chỉ
    const shippingAddr = typeof order.shippingAddress === 'string' ? order.shippingAddress : (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$orders$2f$address$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatOrderAddress"])(order.shippingAddress);
    // Lấy contact info từ shipping address nếu là object
    let recipientName = customer?.name || order.customerName;
    let recipientPhone = customer?.phone;
    if (typeof order.shippingAddress === 'object' && order.shippingAddress) {
        recipientName = order.shippingAddress.contactName || recipientName;
        recipientPhone = order.shippingAddress.phone || order.shippingAddress.contactPhone || recipientPhone;
    }
    return {
        code: packaging.id,
        orderCode: order.id,
        createdAt: packaging.requestDate,
        createdBy: packaging.requestingEmployeeName,
        trackingCode: packaging.trackingCode,
        carrierName: packaging.carrier,
        // Thông tin khách hàng
        customerName: customer?.name || order.customerName,
        customerCode: customer?.id,
        customerPhone: customer?.phone,
        customerEmail: customer?.email,
        // Thông tin người nhận
        receiverName: recipientName,
        receiverPhone: recipientPhone,
        shippingAddress: shippingAddr,
        // Danh sách sản phẩm
        items: order.lineItems.map((item)=>({
                variantCode: item.productId,
                productName: item.productName,
                variantName: '',
                quantity: item.quantity,
                price: item.unitPrice,
                amount: item.unitPrice * item.quantity,
                note: item.note
            })),
        // Tổng giá trị
        totalQuantity: order.lineItems.reduce((sum, item)=>sum + item.quantity, 0),
        subtotal: order.subtotal,
        deliveryFee: order.shippingFee,
        codAmount: packaging.codAmount || order.codAmount,
        totalAmount: order.grandTotal,
        note: packaging.noteToShipper
    };
}
function convertToShippingLabelForPrint(order, packaging, options = {}) {
    const { customer } = options;
    const shippingAddr = typeof order.shippingAddress === 'string' ? order.shippingAddress : (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$orders$2f$address$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatOrderAddress"])(order.shippingAddress);
    let recipientName = customer?.name || order.customerName;
    let recipientPhone = customer?.phone;
    if (typeof order.shippingAddress === 'object' && order.shippingAddress) {
        recipientName = order.shippingAddress.contactName || recipientName;
        recipientPhone = order.shippingAddress.phone || order.shippingAddress.contactPhone || recipientPhone;
    }
    const totalItems = order.lineItems.reduce((sum, item)=>sum + item.quantity, 0);
    return {
        orderCode: order.id,
        trackingCode: packaging.trackingCode,
        carrierName: packaging.carrier,
        // Thông tin khách hàng
        customerName: customer?.name || order.customerName,
        customerPhone: customer?.phone,
        shippingAddress: shippingAddr,
        // Thông tin người nhận (nếu khác)
        receiverName: recipientName,
        receiverPhone: recipientPhone,
        totalItems,
        packingWeight: packaging.weight ? packaging.weight / 1000 : undefined,
        codAmount: packaging.codAmount || order.codAmount,
        note: packaging.noteToShipper
    };
}
function convertToPackingForPrint(order, packaging, options = {}) {
    const { customer, productBinLocations = {}, assignedEmployee } = options;
    const shippingAddr = typeof order.shippingAddress === 'string' ? order.shippingAddress : (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$orders$2f$address$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatOrderAddress"])(order.shippingAddress);
    let recipientName = customer?.name || order.customerName;
    let recipientPhone = customer?.phone;
    if (typeof order.shippingAddress === 'object' && order.shippingAddress) {
        recipientName = order.shippingAddress.contactName || recipientName;
        recipientPhone = order.shippingAddress.phone || order.shippingAddress.contactPhone || recipientPhone;
    }
    // Extract ward/district from shippingAddress if it's an object
    const shippingWard = typeof order.shippingAddress === 'object' && order.shippingAddress ? order.shippingAddress.ward : undefined;
    const shippingDistrict = typeof order.shippingAddress === 'object' && order.shippingAddress ? order.shippingAddress.district : undefined;
    return {
        code: packaging.id,
        createdAt: packaging.requestDate,
        packedAt: packaging.confirmDate,
        createdBy: packaging.requestingEmployeeName,
        orderCode: order.id,
        fulfillmentStatus: packaging.status,
        assignedEmployee: assignedEmployee?.fullName || packaging.assignedEmployeeName,
        customerName: recipientName,
        customerCode: customer?.id,
        customerPhone: recipientPhone,
        customerEmail: customer?.email,
        shippingAddress: shippingAddr,
        shippingWard,
        shippingDistrict,
        items: order.lineItems.map((item)=>({
                variantCode: item.productId,
                productName: item.productName,
                variantName: '',
                quantity: item.quantity,
                binLocation: productBinLocations[item.productSystemId] || ''
            })),
        totalQuantity: order.lineItems.reduce((sum, item)=>sum + item.quantity, 0),
        codAmount: packaging.codAmount || order.codAmount,
        note: packaging.notes,
        orderNote: order.notes
    };
}
function createStoreSettings(branch, options) {
    if (!branch) {
        return {
            name: '',
            address: '',
            phone: '',
            email: '',
            logo: options?.logo || undefined
        };
    }
    return {
        name: branch.name,
        address: branch.address || '',
        phone: branch.phone || '',
        email: '',
        logo: options?.logo || undefined
    };
}
;
}),
"[project]/lib/utils/shipping-config-migration.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Shipping Configuration Migration - V2 Multi-Account Structure
 * 
 * NOTE: localStorage has been removed - all data comes from API/database
 */ __turbopack_context__.s([
    "addPartnerAccount",
    ()=>addPartnerAccount,
    "deletePartnerAccount",
    ()=>deletePartnerAccount,
    "exportShippingConfig",
    ()=>exportShippingConfig,
    "getDefaultAccount",
    ()=>getDefaultAccount,
    "getDefaultShippingConfig",
    ()=>getDefaultShippingConfig,
    "getPartnerAccounts",
    ()=>getPartnerAccounts,
    "importShippingConfig",
    ()=>importShippingConfig,
    "loadShippingConfig",
    ()=>loadShippingConfig,
    "loadShippingConfigAsync",
    ()=>loadShippingConfigAsync,
    "saveShippingConfig",
    ()=>saveShippingConfig,
    "setDefaultAccount",
    ()=>setDefaultAccount,
    "updateGlobalConfig",
    ()=>updateGlobalConfig,
    "updatePartnerAccount",
    ()=>updatePartnerAccount
]);
// In-memory cache
let configCache = null;
/**
 * Get default global config
 */ function getDefaultGlobalConfig() {
    return {
        weight: {
            mode: 'FROM_PRODUCTS',
            customValue: 500
        },
        dimensions: {
            length: 30,
            width: 20,
            height: 10
        },
        requirement: 'ALLOW_CHECK_NOT_TRY',
        note: '',
        autoSyncCancelStatus: false,
        autoSyncCODCollection: false,
        latePickupWarningDays: 2,
        lateDeliveryWarningDays: 7
    };
}
function getDefaultShippingConfig() {
    return {
        version: 2,
        partners: {
            GHN: {
                accounts: []
            },
            GHTK: {
                accounts: []
            },
            VTP: {
                accounts: []
            },
            'J&T': {
                accounts: []
            },
            SPX: {
                accounts: []
            },
            VNPOST: {
                accounts: []
            },
            NINJA_VAN: {
                accounts: []
            },
            AHAMOVE: {
                accounts: []
            }
        },
        global: getDefaultGlobalConfig(),
        lastUpdated: new Date().toISOString()
    };
}
async function loadShippingConfigAsync() {
    try {
        const response = await fetch('/api/shipping-config');
        if (!response.ok) throw new Error('Failed to fetch');
        const config = await response.json();
        configCache = config;
        return config;
    } catch (error) {
        console.error('[ShippingConfig] Failed to load from database:', error);
        // Return cached or default
        return configCache ?? getDefaultShippingConfig();
    }
}
function loadShippingConfig() {
    // Return cache if available
    if (configCache) return configCache;
    // Return default - async load should be triggered on app init
    return getDefaultShippingConfig();
}
function saveShippingConfig(config) {
    config.lastUpdated = new Date().toISOString();
    // Update cache
    configCache = config;
    // Save to database
    fetch('/api/shipping-config', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(config)
    }).then((response)=>{
        if (response.ok) {
            console.log('✅ Shipping config saved to database');
        } else {
            console.warn('⚠️ Failed to save shipping config to database');
        }
    }).catch((error)=>{
        console.error('❌ Error saving shipping config to database:', error);
    });
}
function getPartnerAccounts(config, partnerCode) {
    return config.partners[partnerCode]?.accounts || [];
}
function getDefaultAccount(config, partnerCode) {
    const accounts = getPartnerAccounts(config, partnerCode);
    const defaultAcc = accounts.find((acc)=>acc.isDefault && acc.active);
    if (defaultAcc) return defaultAcc;
    // Return first active account if no default
    return accounts.find((acc)=>acc.active) || null;
}
function addPartnerAccount(config, partnerCode, account) {
    const newAccount = {
        ...account,
        id: `acc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };
    config.partners[partnerCode].accounts.push(newAccount);
    saveShippingConfig(config);
    return config;
}
function updatePartnerAccount(config, partnerCode, accountId, updates) {
    const accounts = config.partners[partnerCode].accounts;
    const index = accounts.findIndex((acc)=>acc.id === accountId);
    if (index !== -1) {
        accounts[index] = {
            ...accounts[index],
            ...updates,
            updatedAt: new Date().toISOString()
        };
        saveShippingConfig(config);
    }
    return config;
}
function deletePartnerAccount(config, partnerCode, accountId) {
    const accounts = config.partners[partnerCode].accounts;
    const account = accounts.find((acc)=>acc.id === accountId);
    // Remove the account
    config.partners[partnerCode].accounts = accounts.filter((acc)=>acc.id !== accountId);
    // Set a new default if we deleted the default account
    if (account?.isDefault && config.partners[partnerCode].accounts.length > 0) {
        config.partners[partnerCode].accounts[0].isDefault = true;
    }
    saveShippingConfig(config);
    return config;
}
function setDefaultAccount(config, partnerCode, accountId) {
    const accounts = config.partners[partnerCode].accounts;
    // Remove default from all accounts
    accounts.forEach((acc)=>{
        acc.isDefault = false;
    });
    // Set new default
    const account = accounts.find((acc)=>acc.id === accountId);
    if (account) {
        account.isDefault = true;
        account.updatedAt = new Date().toISOString();
    }
    saveShippingConfig(config);
    return config;
}
function updateGlobalConfig(config, updates) {
    config.global = {
        ...config.global,
        ...updates
    };
    saveShippingConfig(config);
    return config;
}
function exportShippingConfig() {
    const config = loadShippingConfig();
    return JSON.stringify(config, null, 2);
}
function importShippingConfig(jsonString) {
    try {
        const config = JSON.parse(jsonString);
        if (config.version !== 2) {
            throw new Error('Invalid config version');
        }
        saveShippingConfig(config);
        return config;
    } catch (error) {
        console.error('Import failed:', error);
        throw error;
    }
}
}),
"[project]/lib/utils/get-shipping-credentials.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getActivePartners",
    ()=>getActivePartners,
    "getGHNCredentials",
    ()=>getGHNCredentials,
    "getGHTKCredentials",
    ()=>getGHTKCredentials,
    "hasActiveAccount",
    ()=>hasActiveAccount
]);
/**
 * Helper functions to get shipping partner credentials
 * Centralized source from shipping_partners_config (localStorage)
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2f$shipping$2d$config$2d$migration$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/utils/shipping-config-migration.ts [app-ssr] (ecmascript)");
;
function getGHTKCredentials() {
    const config = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2f$shipping$2d$config$2d$migration$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["loadShippingConfig"])();
    const accounts = config.partners.GHTK.accounts;
    // Find default active account first, then any active account
    const activeAccount = accounts.find((a)=>a.isDefault && a.active) || accounts.find((a)=>a.active);
    if (!activeAccount) {
        throw new Error('Chưa cấu hình GHTK. Vui lòng vào Cài đặt → Đối tác vận chuyển.');
    }
    if (!activeAccount.credentials?.apiToken) {
        throw new Error('Tài khoản GHTK chưa có API Token. Vui lòng cấu hình lại.');
    }
    return {
        apiToken: activeAccount.credentials.apiToken,
        partnerCode: activeAccount.credentials.partnerCode || '',
        account: activeAccount
    };
}
function getGHNCredentials() {
    const config = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2f$shipping$2d$config$2d$migration$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["loadShippingConfig"])();
    const accounts = config.partners.GHN.accounts;
    const activeAccount = accounts.find((a)=>a.isDefault && a.active) || accounts.find((a)=>a.active);
    if (!activeAccount) {
        throw new Error('Chưa cấu hình GHN. Vui lòng vào Cài đặt → Đối tác vận chuyển.');
    }
    if (!activeAccount.credentials?.apiToken) {
        throw new Error('Tài khoản GHN chưa có API Token. Vui lòng cấu hình lại.');
    }
    return {
        apiToken: activeAccount.credentials.apiToken,
        partnerCode: activeAccount.credentials.partnerCode || '',
        account: activeAccount
    };
}
function hasActiveAccount(partnerCode) {
    try {
        const config = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2f$shipping$2d$config$2d$migration$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["loadShippingConfig"])();
        const accounts = config.partners[partnerCode].accounts;
        return accounts.some((a)=>a.active);
    } catch  {
        return false;
    }
}
function getActivePartners() {
    const partners = [
        'GHTK',
        'GHN',
        'VTP',
        'J&T',
        'SPX'
    ];
    return partners.filter((p)=>hasActiveAccount(p));
}
}),
];

//# sourceMappingURL=lib_209abc76._.js.map