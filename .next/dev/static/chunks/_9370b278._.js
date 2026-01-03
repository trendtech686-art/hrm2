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
                const finalItem = {
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
"[project]/features/products/data.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "data",
    ()=>data
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/id-types.ts [app-client] (ecmascript)");
;
const SEED_AUTHOR = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])('EMP000001');
const buildAuditFields = (createdAt, createdBy = SEED_AUTHOR)=>({
        createdAt,
        updatedAt: createdAt,
        createdBy,
        updatedBy: createdBy
    });
const data = [
    {
        systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])('PRODUCT000001'),
        id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asBusinessId"])('SP000001'),
        name: 'Laptop Dell Inspiron 15',
        thumbnailImage: 'https://images.unsplash.com/photo-1517430816045-df4b7de11d1d?auto=format&fit=crop&w=600&q=80',
        unit: 'Chiếc',
        costPrice: 12000000,
        prices: {
            [(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])('PP000001')]: 15000000
        },
        inventoryByBranch: {
            [(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])('BRANCH000001')]: 50,
            [(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])('BRANCH000002')]: 30
        },
        committedByBranch: {
            [(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])('BRANCH000001')]: 1,
            [(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])('BRANCH000002')]: 0
        },
        inTransitByBranch: {
            [(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])('BRANCH000001')]: 0,
            [(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])('BRANCH000002')]: 0
        },
        ...buildAuditFields('2024-01-01T08:00:00Z')
    },
    {
        systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])('PRODUCT000002'),
        id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asBusinessId"])('SP000002'),
        name: 'Chuột Logitech MX Master 3',
        thumbnailImage: 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?auto=format&fit=crop&w=600&q=80',
        unit: 'Chiếc',
        costPrice: 1500000,
        prices: {
            [(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])('PP000001')]: 2000000
        },
        inventoryByBranch: {
            [(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])('BRANCH000001')]: 100,
            [(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])('BRANCH000002')]: 80
        },
        committedByBranch: {
            [(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])('BRANCH000001')]: 1,
            [(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])('BRANCH000002')]: 0
        },
        inTransitByBranch: {
            [(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])('BRANCH000001')]: 0,
            [(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])('BRANCH000002')]: 0
        },
        ...buildAuditFields('2024-01-02T08:00:00Z')
    },
    {
        systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])('PRODUCT000003'),
        id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asBusinessId"])('SP000003'),
        name: 'Điện thoại iPhone 15 Pro',
        thumbnailImage: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80',
        unit: 'Chiếc',
        costPrice: 25000000,
        prices: {
            [(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])('PP000001')]: 28000000
        },
        inventoryByBranch: {
            [(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])('BRANCH000001')]: 20,
            [(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])('BRANCH000002')]: 15
        },
        committedByBranch: {
            [(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])('BRANCH000001')]: 1,
            [(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])('BRANCH000002')]: 0
        },
        inTransitByBranch: {
            [(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])('BRANCH000001')]: 0,
            [(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])('BRANCH000002')]: 0
        },
        ...buildAuditFields('2024-01-03T08:00:00Z')
    },
    {
        systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])('PRODUCT000004'),
        id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asBusinessId"])('SP000004'),
        name: 'Ốp lưng iPhone 15 Pro',
        thumbnailImage: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=600&q=80',
        unit: 'Chiếc',
        costPrice: 200000,
        prices: {
            [(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])('PP000001')]: 300000
        },
        inventoryByBranch: {
            [(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])('BRANCH000001')]: 200,
            [(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])('BRANCH000002')]: 150
        },
        committedByBranch: {
            [(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])('BRANCH000001')]: 2,
            [(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])('BRANCH000002')]: 0
        },
        inTransitByBranch: {
            [(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])('BRANCH000001')]: 0,
            [(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])('BRANCH000002')]: 0
        },
        ...buildAuditFields('2024-01-04T08:00:00Z')
    },
    {
        systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])('PRODUCT000005'),
        id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asBusinessId"])('SP000005'),
        name: 'Máy tính bảng iPad Air',
        thumbnailImage: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=600&q=80',
        unit: 'Chiếc',
        costPrice: 15000000,
        prices: {
            [(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])('PP000001')]: 18000000
        },
        inventoryByBranch: {
            [(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])('BRANCH000001')]: 30,
            [(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])('BRANCH000002')]: 20
        },
        committedByBranch: {
            [(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])('BRANCH000001')]: 1,
            [(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])('BRANCH000002')]: 0
        },
        inTransitByBranch: {
            [(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])('BRANCH000001')]: 0,
            [(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])('BRANCH000002')]: 0
        },
        ...buildAuditFields('2024-01-05T08:00:00Z')
    },
    {
        systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])('PRODUCT000006'),
        id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asBusinessId"])('SP000006'),
        name: 'Đồng hồ Apple Watch Series 9',
        thumbnailImage: 'https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?auto=format&fit=crop&w=600&q=80',
        unit: 'Chiếc',
        costPrice: 10000000,
        prices: {
            [(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])('PP000001')]: 12000000
        },
        inventoryByBranch: {
            [(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])('BRANCH000001')]: 40,
            [(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])('BRANCH000002')]: 25
        },
        committedByBranch: {
            [(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])('BRANCH000001')]: 1,
            [(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])('BRANCH000002')]: 0
        },
        inTransitByBranch: {
            [(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])('BRANCH000001')]: 0,
            [(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])('BRANCH000002')]: 0
        },
        ...buildAuditFields('2024-01-06T08:00:00Z')
    },
    {
        systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])('PRODUCT000007'),
        id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asBusinessId"])('SP000007'),
        name: 'Tai nghe AirPods Pro',
        thumbnailImage: 'https://images.unsplash.com/photo-1519671282429-b44660ead0a7?auto=format&fit=crop&w=600&q=80',
        unit: 'Chiếc',
        costPrice: 5000000,
        prices: {
            [(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])('PP000001')]: 6000000
        },
        inventoryByBranch: {
            [(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])('BRANCH000001')]: 60,
            [(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])('BRANCH000002')]: 40
        },
        committedByBranch: {
            [(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])('BRANCH000001')]: 1,
            [(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])('BRANCH000002')]: 0
        },
        inTransitByBranch: {
            [(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])('BRANCH000001')]: 0,
            [(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])('BRANCH000002')]: 0
        },
        ...buildAuditFields('2024-01-07T08:00:00Z')
    },
    {
        systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])('PRODUCT000008'),
        id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asBusinessId"])('SP000008'),
        name: 'Bàn phím cơ Keychron K2',
        thumbnailImage: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=600&q=80',
        unit: 'Chiếc',
        costPrice: 2000000,
        prices: {
            [(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])('PP000001')]: 2500000
        },
        inventoryByBranch: {
            [(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])('BRANCH000001')]: 35,
            [(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])('BRANCH000002')]: 25
        },
        committedByBranch: {
            [(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])('BRANCH000001')]: 1,
            [(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])('BRANCH000002')]: 0
        },
        inTransitByBranch: {
            [(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])('BRANCH000001')]: 0,
            [(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])('BRANCH000002')]: 0
        },
        ...buildAuditFields('2024-01-08T08:00:00Z')
    },
    {
        systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])('PRODUCT000009'),
        id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asBusinessId"])('SP000009'),
        name: 'Keycap custom',
        thumbnailImage: 'https://images.unsplash.com/photo-1505740106531-4243f3831c78?auto=format&fit=crop&w=600&q=80',
        unit: 'Bộ',
        costPrice: 600000,
        prices: {
            [(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])('PP000001')]: 800000
        },
        inventoryByBranch: {
            [(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])('BRANCH000001')]: 50,
            [(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])('BRANCH000002')]: 30
        },
        committedByBranch: {
            [(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])('BRANCH000001')]: 1,
            [(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])('BRANCH000002')]: 0
        },
        inTransitByBranch: {
            [(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])('BRANCH000001')]: 0,
            [(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])('BRANCH000002')]: 0
        },
        ...buildAuditFields('2024-01-09T08:00:00Z')
    },
    {
        systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])('PRODUCT000010'),
        id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asBusinessId"])('SP000010'),
        name: 'Switch Gateron Yellow',
        thumbnailImage: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=600&q=80',
        unit: 'Cái',
        costPrice: 3000,
        prices: {
            [(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])('PP000001')]: 5000
        },
        inventoryByBranch: {
            [(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])('BRANCH000001')]: 500,
            [(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])('BRANCH000002')]: 300
        },
        committedByBranch: {
            [(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])('BRANCH000001')]: 90,
            [(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])('BRANCH000002')]: 0
        },
        inTransitByBranch: {
            [(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])('BRANCH000001')]: 0,
            [(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])('BRANCH000002')]: 0
        },
        ...buildAuditFields('2024-01-10T08:00:00Z')
    },
    // ═══════════════════════════════════════════════════════════════
    // COMBO PRODUCTS - Sản phẩm bundle
    // ═══════════════════════════════════════════════════════════════
    {
        systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])('PRODUCT000011'),
        id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asBusinessId"])('COMBO001'),
        name: 'Combo Bàn phím + Keycap + Switch',
        thumbnailImage: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80',
        shortDescription: 'Bộ combo custom keyboard siêu hot',
        type: 'combo',
        unit: 'Bộ',
        costPrice: 0,
        prices: {
            [(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])('PP000001')]: 3000000
        },
        inventoryByBranch: {},
        committedByBranch: {},
        inTransitByBranch: {},
        // Combo items: Bàn phím (1) + Keycap (1) + Switch (90 cái)
        comboItems: [
            {
                productSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])('PRODUCT000008'),
                quantity: 1
            },
            {
                productSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])('PRODUCT000009'),
                quantity: 1
            },
            {
                productSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])('PRODUCT000010'),
                quantity: 90
            }
        ],
        comboPricingType: 'sum_discount_percent',
        comboDiscount: 10,
        status: 'active',
        ...buildAuditFields('2024-06-01T08:00:00Z')
    },
    {
        systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])('PRODUCT000012'),
        id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asBusinessId"])('COMBO002'),
        name: 'Combo iPhone + Ốp lưng',
        thumbnailImage: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=600&q=80',
        shortDescription: 'Mua iPhone kèm ốp lưng giá ưu đãi',
        type: 'combo',
        unit: 'Bộ',
        costPrice: 0,
        prices: {
            [(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])('PP000001')]: 27500000
        },
        inventoryByBranch: {},
        committedByBranch: {},
        inTransitByBranch: {},
        comboItems: [
            {
                productSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])('PRODUCT000003'),
                quantity: 1
            },
            {
                productSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])('PRODUCT000004'),
                quantity: 1
            }
        ],
        comboPricingType: 'sum_discount_amount',
        comboDiscount: 800000,
        status: 'active',
        ...buildAuditFields('2024-06-15T08:00:00Z')
    }
];
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
"[project]/features/products/store.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useProductStore",
    ()=>useProductStore
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2d$factory$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/store-factory.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$products$2f$data$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/products/data.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/id-types.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$contexts$2f$auth$2d$context$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/contexts/auth-context.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$fuse$2e$js$2f$dist$2f$fuse$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/fuse.js/dist/fuse.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$activity$2d$history$2d$helper$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/activity-history-helper.ts [app-client] (ecmascript)");
;
;
;
;
;
;
const baseStore = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2d$factory$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createCrudStore"])(__TURBOPACK__imported__module__$5b$project$5d2f$features$2f$products$2f$data$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["data"], 'products', {
    businessIdField: 'id',
    persistKey: 'hrm-products',
    getCurrentUser: __TURBOPACK__imported__module__$5b$project$5d2f$contexts$2f$auth$2d$context$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getCurrentUserSystemId"]
});
// Helper to check if product tracks stock
const canModifyStock = (product)=>{
    if (!product) return false;
    // Services, digital products, and combos don't track stock directly
    if (product.type === 'service' || product.type === 'digital' || product.type === 'combo') return false;
    // Explicitly disabled stock tracking
    if (product.isStockTracked === false) return false;
    return true;
};
// Define custom methods
const updateInventory = (productSystemId, branchSystemId, quantityChange)=>{
    baseStore.setState((state)=>{
        const product = state.data.find((p)=>p.systemId === productSystemId);
        if (!product) return state;
        // Skip if product doesn't track stock
        if (!canModifyStock(product)) {
            console.warn(`[updateInventory] Skipped: Product ${productSystemId} does not track stock`);
            return state;
        }
        const oldQuantity = product.inventoryByBranch?.[branchSystemId] || 0;
        const newQuantity = oldQuantity + quantityChange;
        // ✅ Removed COMPLAINT_ADJUSTMENT stock history creation
        // Stock history will be created by inventory check balance instead
        return {
            data: state.data.map((p)=>{
                if (p.systemId === productSystemId) {
                    const newInventoryByBranch = {
                        ...p.inventoryByBranch
                    };
                    newInventoryByBranch[branchSystemId] = newQuantity;
                    return {
                        ...p,
                        inventoryByBranch: newInventoryByBranch
                    };
                }
                return p;
            })
        };
    });
};
const commitStock = (productSystemId, branchSystemId, quantity)=>{
    baseStore.setState((state)=>{
        const product = state.data.find((p)=>p.systemId === productSystemId);
        if (!canModifyStock(product)) {
            console.warn(`[commitStock] Skipped: Product ${productSystemId} does not track stock`);
            return state;
        }
        return {
            data: state.data.map((p)=>{
                if (p.systemId === productSystemId) {
                    const newCommitted = {
                        ...p.committedByBranch
                    };
                    newCommitted[branchSystemId] = (newCommitted[branchSystemId] || 0) + quantity;
                    return {
                        ...p,
                        committedByBranch: newCommitted
                    };
                }
                return p;
            })
        };
    });
};
const uncommitStock = (productSystemId, branchSystemId, quantity)=>{
    baseStore.setState((state)=>{
        const product = state.data.find((p)=>p.systemId === productSystemId);
        if (!canModifyStock(product)) {
            console.warn(`[uncommitStock] Skipped: Product ${productSystemId} does not track stock`);
            return state;
        }
        return {
            data: state.data.map((p)=>{
                if (p.systemId === productSystemId) {
                    const newCommitted = {
                        ...p.committedByBranch
                    };
                    newCommitted[branchSystemId] = Math.max(0, (newCommitted[branchSystemId] || 0) - quantity);
                    return {
                        ...p,
                        committedByBranch: newCommitted
                    };
                }
                return p;
            })
        };
    });
};
const dispatchStock = (productSystemId, branchSystemId, quantity)=>{
    console.log('🔴 [dispatchStock] Called with:', {
        productSystemId,
        branchSystemId,
        quantity
    });
    baseStore.setState((state)=>{
        const product = state.data.find((p)=>p.systemId === productSystemId);
        if (!product) {
            console.error('❌ [dispatchStock] Product not found:', productSystemId);
            return state;
        }
        // Skip if product doesn't track stock
        if (!canModifyStock(product)) {
            console.warn(`[dispatchStock] Skipped: Product ${productSystemId} does not track stock`);
            return state;
        }
        console.log('📦 [dispatchStock] Current inventory:', product.inventoryByBranch);
        console.log('📦 [dispatchStock] Current committed:', product.committedByBranch);
        return {
            data: state.data.map((product)=>{
                if (product.systemId === productSystemId) {
                    const newInventory = {
                        ...product.inventoryByBranch
                    };
                    const oldInventory = newInventory[branchSystemId] || 0;
                    newInventory[branchSystemId] = oldInventory - quantity;
                    const newCommitted = {
                        ...product.committedByBranch
                    };
                    newCommitted[branchSystemId] = Math.max(0, (newCommitted[branchSystemId] || 0) - quantity);
                    const newInTransit = {
                        ...product.inTransitByBranch
                    };
                    newInTransit[branchSystemId] = (newInTransit[branchSystemId] || 0) + quantity;
                    console.log('✅ [dispatchStock] Updated inventory:', {
                        old: oldInventory,
                        new: newInventory[branchSystemId],
                        change: -quantity
                    });
                    return {
                        ...product,
                        inventoryByBranch: newInventory,
                        committedByBranch: newCommitted,
                        inTransitByBranch: newInTransit
                    };
                }
                return product;
            })
        };
    });
    console.log('✅ [dispatchStock] Completed');
};
const completeDelivery = (productSystemId, branchSystemId, quantity)=>{
    baseStore.setState((state)=>{
        const product = state.data.find((p)=>p.systemId === productSystemId);
        if (!canModifyStock(product)) {
            return state;
        }
        return {
            data: state.data.map((p)=>{
                if (p.systemId === productSystemId) {
                    const newInTransit = {
                        ...p.inTransitByBranch
                    };
                    newInTransit[branchSystemId] = Math.max(0, (newInTransit[branchSystemId] || 0) - quantity);
                    return {
                        ...p,
                        inTransitByBranch: newInTransit
                    };
                }
                return p;
            })
        };
    });
};
const returnStockFromTransit = (productSystemId, branchSystemId, quantity)=>{
    baseStore.setState((state)=>{
        const product = state.data.find((p)=>p.systemId === productSystemId);
        if (!canModifyStock(product)) {
            return state;
        }
        return {
            data: state.data.map((p)=>{
                if (p.systemId === productSystemId) {
                    const newInTransit = {
                        ...p.inTransitByBranch
                    };
                    newInTransit[branchSystemId] = Math.max(0, (newInTransit[branchSystemId] || 0) - quantity);
                    const newInventory = {
                        ...p.inventoryByBranch
                    };
                    newInventory[branchSystemId] = (newInventory[branchSystemId] || 0) + quantity;
                    return {
                        ...p,
                        inventoryByBranch: newInventory,
                        inTransitByBranch: newInTransit
                    };
                }
                return p;
            })
        };
    });
};
const updateLastPurchasePrice = (productSystemId, price, date)=>{
    baseStore.setState((state)=>({
            data: state.data.map((product)=>{
                if (product.systemId === productSystemId) {
                    // Only update if the new date is newer or equal to the existing lastPurchaseDate
                    const existingDate = product.lastPurchaseDate ? new Date(product.lastPurchaseDate).getTime() : 0;
                    const newDateTs = new Date(date).getTime();
                    if (newDateTs >= existingDate) {
                        return {
                            ...product,
                            lastPurchasePrice: price,
                            lastPurchaseDate: date
                        };
                    }
                }
                return product;
            })
        }));
};
const searchProducts = async (query, page = 1, limit = 10)=>{
    const allProducts = baseStore.getState().data;
    // ✅ Create fresh Fuse instance with current data (avoid stale data)
    const fuse = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$fuse$2e$js$2f$dist$2f$fuse$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"](allProducts, {
        keys: [
            'name',
            'id',
            'sku',
            'barcode'
        ],
        threshold: 0.3
    });
    const results = fuse.search(query);
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedResults = results.slice(startIndex, endIndex);
    return {
        items: paginatedResults.map((result)=>({
                value: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])(result.item.systemId),
                label: `${result.item.name} (${result.item.id})`
            })),
        hasNextPage: endIndex < results.length
    };
};
// Wrapped add method with activity history logging
const addProduct = (product)=>{
    const userInfo = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$activity$2d$history$2d$helper$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getCurrentUserInfo"])();
    const newProduct = baseStore.getState().add(product);
    // Add activity history entry
    const historyEntry = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$activity$2d$history$2d$helper$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createCreatedEntry"])(userInfo, `${userInfo.name} đã tạo sản phẩm ${newProduct.name} (${newProduct.id})`);
    baseStore.getState().update(newProduct.systemId, {
        ...newProduct,
        activityHistory: [
            historyEntry
        ]
    });
    return newProduct;
};
// Wrapped update method with activity history logging
const updateProduct = (systemId, updatedProduct)=>{
    const userInfo = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$activity$2d$history$2d$helper$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getCurrentUserInfo"])();
    const existingProduct = baseStore.getState().data.find((p)=>p.systemId === systemId);
    const historyEntries = [];
    if (existingProduct) {
        // Track status changes
        if (existingProduct.status !== updatedProduct.status) {
            const statusLabels = {
                'active': 'Đang kinh doanh',
                'inactive': 'Ngừng kinh doanh',
                'discontinued': 'Ngừng sản xuất'
            };
            historyEntries.push((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$activity$2d$history$2d$helper$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createStatusChangedEntry"])(userInfo, statusLabels[existingProduct.status || 'active'], statusLabels[updatedProduct.status || 'active'], `${userInfo.name} đã đổi trạng thái từ "${statusLabels[existingProduct.status || 'active']}" sang "${statusLabels[updatedProduct.status || 'active']}"`));
        }
        // Track field changes
        const fieldsToTrack = [
            {
                key: 'name',
                label: 'Tên sản phẩm'
            },
            {
                key: 'id',
                label: 'Mã SKU'
            },
            {
                key: 'description',
                label: 'Mô tả'
            },
            {
                key: 'shortDescription',
                label: 'Mô tả ngắn'
            },
            {
                key: 'type',
                label: 'Loại sản phẩm'
            },
            {
                key: 'categorySystemId',
                label: 'Danh mục'
            },
            {
                key: 'brandSystemId',
                label: 'Thương hiệu'
            },
            {
                key: 'unit',
                label: 'Đơn vị tính'
            },
            {
                key: 'costPrice',
                label: 'Giá vốn'
            },
            {
                key: 'minPrice',
                label: 'Giá tối thiểu'
            },
            {
                key: 'barcode',
                label: 'Mã vạch'
            },
            {
                key: 'primarySupplierSystemId',
                label: 'Nhà cung cấp chính'
            },
            {
                key: 'warrantyPeriodMonths',
                label: 'Thời hạn bảo hành'
            },
            {
                key: 'reorderLevel',
                label: 'Mức đặt hàng lại'
            },
            {
                key: 'safetyStock',
                label: 'Tồn kho an toàn'
            },
            {
                key: 'maxStock',
                label: 'Tồn kho tối đa'
            }
        ];
        const changes = [];
        for (const field of fieldsToTrack){
            const oldVal = existingProduct[field.key];
            const newVal = updatedProduct[field.key];
            if (oldVal !== newVal && !(oldVal === undefined && newVal === undefined)) {
                if (field.key === 'status') continue;
                const oldDisplay = oldVal !== undefined && oldVal !== null && oldVal !== '' ? String(oldVal) : '(trống)';
                const newDisplay = newVal !== undefined && newVal !== null && newVal !== '' ? String(newVal) : '(trống)';
                changes.push(`${field.label}: ${oldDisplay} → ${newDisplay}`);
            }
        }
        // Track price changes separately
        if (existingProduct.costPrice !== updatedProduct.costPrice) {
            changes.push(`Giá vốn: ${existingProduct.costPrice?.toLocaleString('vi-VN')} → ${updatedProduct.costPrice?.toLocaleString('vi-VN')}`);
        }
        if (changes.length > 0) {
            historyEntries.push((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$activity$2d$history$2d$helper$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createUpdatedEntry"])(userInfo, `${userInfo.name} đã cập nhật: ${changes.join(', ')}`));
        }
    }
    const productWithHistory = {
        ...updatedProduct,
        activityHistory: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$activity$2d$history$2d$helper$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["appendHistoryEntry"])(existingProduct?.activityHistory, ...historyEntries)
    };
    baseStore.getState().update(systemId, productWithHistory);
};
const useProductStore = ()=>{
    const state = baseStore();
    return {
        ...state,
        add: addProduct,
        update: updateProduct,
        updateInventory,
        commitStock,
        uncommitStock,
        dispatchStock,
        completeDelivery,
        returnStockFromTransit,
        updateLastPurchasePrice,
        searchProducts
    };
};
// Export getState method for non-hook usage
useProductStore.getState = ()=>{
    const state = baseStore.getState();
    return {
        ...state,
        add: addProduct,
        update: updateProduct,
        updateInventory,
        commitStock,
        uncommitStock,
        dispatchStock,
        completeDelivery,
        returnStockFromTransit,
        updateLastPurchasePrice,
        searchProducts
    };
};
useProductStore.subscribe = baseStore.subscribe;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/features/cost-adjustments/store.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useCostAdjustmentStore",
    ()=>useCostAdjustmentStore
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/zustand/esm/react.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$middleware$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/zustand/esm/middleware.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/id-types.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$products$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/products/store.ts [app-client] (ecmascript)");
;
;
;
;
const PREFIX = 'DCGV'; // Điều chỉnh giá vốn
const SEED_AUTHOR = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])('EMP000001');
// Helper function to create sample data
const createSampleData = ()=>{
    const now = new Date();
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const twoWeeksAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);
    const threeWeeksAgo = new Date(now.getTime() - 21 * 24 * 60 * 60 * 1000);
    const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    return [
        // Draft - chưa xác nhận
        {
            systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])('COST_ADJ000001'),
            id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asBusinessId"])('DCGV000001'),
            type: 'manual',
            status: 'draft',
            items: [
                {
                    productSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])('PRODUCT000001'),
                    productId: 'SP000001',
                    productName: 'Laptop Dell Inspiron 15',
                    productImage: 'https://images.unsplash.com/photo-1517430816045-df4b7de11d1d?auto=format&fit=crop&w=600&q=80',
                    oldCostPrice: 12000000,
                    newCostPrice: 12500000,
                    adjustmentAmount: 500000,
                    adjustmentPercent: 4.17,
                    reason: 'Giá nhập tăng từ nhà cung cấp'
                },
                {
                    productSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])('PRODUCT000002'),
                    productId: 'SP000002',
                    productName: 'Chuột Logitech MX Master 3',
                    productImage: 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?auto=format&fit=crop&w=600&q=80',
                    oldCostPrice: 1500000,
                    newCostPrice: 1600000,
                    adjustmentAmount: 100000,
                    adjustmentPercent: 6.67,
                    reason: 'Cập nhật theo giá thị trường'
                }
            ],
            note: 'Điều chỉnh giá vốn theo giá nhập mới từ NCC Dell',
            reason: 'Thay đổi giá từ nhà cung cấp',
            referenceCode: 'PN000015',
            createdDate: oneWeekAgo.toISOString(),
            createdBySystemId: SEED_AUTHOR,
            createdByName: 'Nguyễn Văn A',
            createdAt: oneWeekAgo.toISOString(),
            updatedAt: oneWeekAgo.toISOString(),
            createdBy: SEED_AUTHOR,
            updatedBy: SEED_AUTHOR
        },
        // Draft - batch điều chỉnh nhiều sản phẩm
        {
            systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])('COST_ADJ000002'),
            id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asBusinessId"])('DCGV000002'),
            type: 'batch',
            status: 'draft',
            items: [
                {
                    productSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])('PRODUCT000003'),
                    productId: 'SP000003',
                    productName: 'Điện thoại iPhone 15 Pro',
                    productImage: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80',
                    oldCostPrice: 25000000,
                    newCostPrice: 24000000,
                    adjustmentAmount: -1000000,
                    adjustmentPercent: -4,
                    reason: 'Giảm giá nhập từ Apple'
                },
                {
                    productSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])('PRODUCT000004'),
                    productId: 'SP000004',
                    productName: 'Tai nghe AirPods Pro',
                    productImage: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=600&q=80',
                    oldCostPrice: 5000000,
                    newCostPrice: 4800000,
                    adjustmentAmount: -200000,
                    adjustmentPercent: -4,
                    reason: 'Giảm giá theo chính sách mới'
                },
                {
                    productSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])('PRODUCT000005'),
                    productId: 'SP000005',
                    productName: 'Bàn phím cơ Keychron K8',
                    productImage: 'https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?auto=format&fit=crop&w=600&q=80',
                    oldCostPrice: 2000000,
                    newCostPrice: 1900000,
                    adjustmentAmount: -100000,
                    adjustmentPercent: -5,
                    reason: 'Điều chỉnh theo lô hàng mới'
                }
            ],
            note: 'Điều chỉnh hàng loạt theo chương trình giảm giá Q4/2024',
            reason: 'Chương trình khuyến mãi từ nhà cung cấp',
            createdDate: now.toISOString(),
            createdBySystemId: SEED_AUTHOR,
            createdByName: 'Nguyễn Văn A',
            createdAt: now.toISOString(),
            updatedAt: now.toISOString(),
            createdBy: SEED_AUTHOR,
            updatedBy: SEED_AUTHOR
        },
        // Confirmed - đã xác nhận
        {
            systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])('COST_ADJ000003'),
            id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asBusinessId"])('DCGV000003'),
            type: 'import',
            status: 'confirmed',
            items: [
                {
                    productSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])('PRODUCT000006'),
                    productId: 'SP000006',
                    productName: 'Màn hình LG UltraWide 34"',
                    productImage: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=600&q=80',
                    oldCostPrice: 8000000,
                    newCostPrice: 8500000,
                    adjustmentAmount: 500000,
                    adjustmentPercent: 6.25,
                    reason: 'Cập nhật từ đơn nhập hàng'
                }
            ],
            note: 'Tự động điều chỉnh từ đơn nhập hàng PN000012',
            reason: 'Đơn nhập hàng mới',
            referenceCode: 'PN000012',
            createdDate: twoWeeksAgo.toISOString(),
            createdBySystemId: SEED_AUTHOR,
            createdByName: 'Nguyễn Văn A',
            confirmedDate: oneWeekAgo.toISOString(),
            confirmedBySystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])('EMP000002'),
            confirmedByName: 'Trần Thị B',
            createdAt: twoWeeksAgo.toISOString(),
            updatedAt: oneWeekAgo.toISOString(),
            createdBy: SEED_AUTHOR,
            updatedBy: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])('EMP000002')
        },
        // Confirmed - đã xác nhận (từ đơn nhập)
        {
            systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])('COST_ADJ000004'),
            id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asBusinessId"])('DCGV000004'),
            type: 'manual',
            status: 'confirmed',
            items: [
                {
                    productSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])('PRODUCT000007'),
                    productId: 'SP000007',
                    productName: 'SSD Samsung 1TB',
                    productImage: 'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?auto=format&fit=crop&w=600&q=80',
                    oldCostPrice: 2500000,
                    newCostPrice: 2200000,
                    adjustmentAmount: -300000,
                    adjustmentPercent: -12,
                    reason: 'Giá SSD giảm mạnh trên thị trường'
                },
                {
                    productSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])('PRODUCT000008'),
                    productId: 'SP000008',
                    productName: 'RAM Kingston 16GB DDR5',
                    productImage: 'https://images.unsplash.com/photo-1562976540-1502c2145186?auto=format&fit=crop&w=600&q=80',
                    oldCostPrice: 1800000,
                    newCostPrice: 1500000,
                    adjustmentAmount: -300000,
                    adjustmentPercent: -16.67,
                    reason: 'Giá RAM giảm'
                }
            ],
            note: 'Điều chỉnh giá theo biến động thị trường linh kiện',
            reason: 'Biến động thị trường',
            createdDate: threeWeeksAgo.toISOString(),
            createdBySystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])('EMP000003'),
            createdByName: 'Lê Văn C',
            confirmedDate: twoWeeksAgo.toISOString(),
            confirmedBySystemId: SEED_AUTHOR,
            confirmedByName: 'Nguyễn Văn A',
            createdAt: threeWeeksAgo.toISOString(),
            updatedAt: twoWeeksAgo.toISOString(),
            createdBy: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])('EMP000003'),
            updatedBy: SEED_AUTHOR
        },
        // Cancelled - đã hủy
        {
            systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])('COST_ADJ000005'),
            id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asBusinessId"])('DCGV000005'),
            type: 'manual',
            status: 'cancelled',
            items: [
                {
                    productSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])('PRODUCT000001'),
                    productId: 'SP000001',
                    productName: 'Laptop Dell Inspiron 15',
                    productImage: 'https://images.unsplash.com/photo-1517430816045-df4b7de11d1d?auto=format&fit=crop&w=600&q=80',
                    oldCostPrice: 12000000,
                    newCostPrice: 11000000,
                    adjustmentAmount: -1000000,
                    adjustmentPercent: -8.33,
                    reason: 'Điều chỉnh sai'
                }
            ],
            note: 'Phiếu điều chỉnh bị hủy do nhập sai giá',
            reason: 'Sai thông tin giá',
            createdDate: oneMonthAgo.toISOString(),
            createdBySystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])('EMP000003'),
            createdByName: 'Lê Văn C',
            cancelledDate: threeWeeksAgo.toISOString(),
            cancelledBySystemId: SEED_AUTHOR,
            cancelledByName: 'Nguyễn Văn A',
            cancelReason: 'Nhập sai giá vốn mới, cần tạo phiếu mới',
            createdAt: oneMonthAgo.toISOString(),
            updatedAt: threeWeeksAgo.toISOString(),
            createdBy: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])('EMP000003'),
            updatedBy: SEED_AUTHOR
        },
        // Confirmed - đã xác nhận (cũ hơn)
        {
            systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])('COST_ADJ000006'),
            id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asBusinessId"])('DCGV000006'),
            type: 'batch',
            status: 'confirmed',
            items: [
                {
                    productSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])('PRODUCT000009'),
                    productId: 'SP000009',
                    productName: 'Webcam Logitech C920',
                    productImage: 'https://images.unsplash.com/photo-1587826080692-f439cd0b70da?auto=format&fit=crop&w=600&q=80',
                    oldCostPrice: 1200000,
                    newCostPrice: 1350000,
                    adjustmentAmount: 150000,
                    adjustmentPercent: 12.5,
                    reason: 'Tăng giá nhập'
                },
                {
                    productSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])('PRODUCT000010'),
                    productId: 'SP000010',
                    productName: 'Loa Bluetooth JBL Flip 6',
                    productImage: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&w=600&q=80',
                    oldCostPrice: 2000000,
                    newCostPrice: 2100000,
                    adjustmentAmount: 100000,
                    adjustmentPercent: 5,
                    reason: 'Giá nhập tăng'
                }
            ],
            note: 'Điều chỉnh theo đợt kiểm kê cuối tháng',
            reason: 'Kiểm kê định kỳ',
            createdDate: oneMonthAgo.toISOString(),
            createdBySystemId: SEED_AUTHOR,
            createdByName: 'Nguyễn Văn A',
            confirmedDate: threeWeeksAgo.toISOString(),
            confirmedBySystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])('EMP000002'),
            confirmedByName: 'Trần Thị B',
            createdAt: oneMonthAgo.toISOString(),
            updatedAt: threeWeeksAgo.toISOString(),
            createdBy: SEED_AUTHOR,
            updatedBy: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])('EMP000002')
        }
    ];
};
const generateSystemIdFromCounter = (counter)=>{
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])(`COST_ADJ${String(counter + 1).padStart(6, '0')}`);
};
const useCostAdjustmentStore = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["create"])()((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$middleware$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["persist"])((set, get)=>({
        data: createSampleData(),
        counter: 6,
        getById: (systemId)=>get().data.find((item)=>item.systemId === systemId),
        getByBusinessId: (businessId)=>get().data.find((item)=>item.id === businessId),
        generateNextId: ()=>{
            const existing = get().data;
            let maxNum = 0;
            existing.forEach((item)=>{
                const match = item.id.match(/^DCGV(\d+)$/);
                if (match) {
                    const num = parseInt(match[1], 10);
                    if (num > maxNum) maxNum = num;
                }
            });
            return `${PREFIX}${String(maxNum + 1).padStart(6, '0')}`;
        },
        isBusinessIdExists: (businessId)=>{
            return get().data.some((item)=>item.id === businessId);
        },
        create: (items, type, createdBySystemId, createdByName, options)=>{
            const currentCounter = get().counter;
            const systemId = generateSystemIdFromCounter(currentCounter);
            const businessId = options?.customId || get().generateNextId();
            // Calculate adjustment amounts
            const processedItems = items.map((item)=>({
                    ...item,
                    adjustmentAmount: item.newCostPrice - item.oldCostPrice,
                    adjustmentPercent: item.oldCostPrice > 0 ? (item.newCostPrice - item.oldCostPrice) / item.oldCostPrice * 100 : 0
                }));
            const optionalFields = {};
            if (options?.note !== undefined) {
                optionalFields.note = options.note;
            }
            if (options?.reason !== undefined) {
                optionalFields.reason = options.reason;
            }
            if (options?.referenceCode !== undefined) {
                optionalFields.referenceCode = options.referenceCode;
            }
            const newAdjustment = {
                systemId,
                id: businessId,
                type,
                status: options?.status || 'draft',
                items: processedItems,
                createdDate: new Date().toISOString(),
                createdBySystemId,
                createdByName,
                // Audit fields
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                createdBy: createdBySystemId,
                updatedBy: createdBySystemId,
                ...optionalFields
            };
            set((state)=>({
                    data: [
                        newAdjustment,
                        ...state.data
                    ],
                    counter: state.counter + 1
                }));
            return newAdjustment;
        },
        confirm: (systemId, confirmedBySystemId, confirmedByName)=>{
            const adjustment = get().getById(systemId);
            if (!adjustment || adjustment.status !== 'draft') return false;
            // Update product cost prices
            const productStore = __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$products$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useProductStore"].getState();
            adjustment.items.forEach((item)=>{
                const existingProduct = productStore.findById((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])(item.productSystemId));
                if (!existingProduct) return;
                productStore.update((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])(item.productSystemId), {
                    ...existingProduct,
                    costPrice: item.newCostPrice
                });
            });
            set((state)=>({
                    data: state.data.map((item)=>item.systemId === systemId ? {
                            ...item,
                            status: 'confirmed',
                            confirmedDate: new Date().toISOString(),
                            confirmedBySystemId,
                            confirmedByName,
                            updatedAt: new Date().toISOString(),
                            updatedBy: confirmedBySystemId
                        } : item)
                }));
            return true;
        },
        cancel: (systemId, cancelledBySystemId, cancelledByName, reason)=>{
            const adjustment = get().getById(systemId);
            if (!adjustment || adjustment.status !== 'draft') return false;
            set((state)=>({
                    data: state.data.map((item)=>item.systemId === systemId ? {
                            ...item,
                            status: 'cancelled',
                            cancelledDate: new Date().toISOString(),
                            cancelledBySystemId,
                            cancelledByName,
                            cancelReason: reason ?? '',
                            updatedAt: new Date().toISOString(),
                            updatedBy: cancelledBySystemId
                        } : item)
                }));
            return true;
        },
        getAll: ()=>get().data.filter((item)=>item.status !== 'cancelled'),
        getByStatus: (status)=>get().data.filter((item)=>item.status === status)
    }), {
    name: 'hrm-cost-adjustments',
    version: 1
}));
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/ui/checkbox.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Checkbox",
    ()=>Checkbox
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$checkbox$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@radix-ui/react-checkbox/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Check$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/check.js [app-client] (ecmascript) <export default as Check>");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/utils.ts [app-client] (ecmascript)");
;
;
;
;
;
const Checkbox = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](_c = ({ className, checked, defaultChecked, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$checkbox$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Root"], {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("peer h-4 w-4 shrink-0 rounded-sm border border-primary ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground", className),
        ...props,
        ...checked !== undefined ? {
            checked
        } : {},
        ...defaultChecked !== undefined ? {
            defaultChecked
        } : {},
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$checkbox$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Indicator"], {
            className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("flex items-center justify-center text-current"),
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Check$3e$__["Check"], {
                className: "h-4 w-4"
            }, void 0, false, {
                fileName: "[project]/components/ui/checkbox.tsx",
                lineNumber: 31,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0))
        }, void 0, false, {
            fileName: "[project]/components/ui/checkbox.tsx",
            lineNumber: 28,
            columnNumber: 5
        }, ("TURBOPACK compile-time value", void 0))
    }, void 0, false, {
        fileName: "[project]/components/ui/checkbox.tsx",
        lineNumber: 18,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0)));
_c1 = Checkbox;
Checkbox.displayName = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$checkbox$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Root"].displayName;
;
var _c, _c1;
__turbopack_context__.k.register(_c, "Checkbox$React.forwardRef");
__turbopack_context__.k.register(_c1, "Checkbox");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/features/cost-adjustments/columns.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getColumns",
    ()=>getColumns,
    "getStatusOptions",
    ()=>getStatusOptions
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$badge$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/badge.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/button.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$checkbox$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/checkbox.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/dropdown-menu.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$ellipsis$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MoreHorizontal$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/ellipsis.js [app-client] (ecmascript) <export default as MoreHorizontal>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$eye$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Eye$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/eye.js [app-client] (ecmascript) <export default as Eye>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$printer$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Printer$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/printer.js [app-client] (ecmascript) <export default as Printer>");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/date-utils.ts [app-client] (ecmascript)");
;
;
;
;
;
;
;
;
const getStatusVariant = (status)=>{
    switch(status){
        case 'draft':
            return 'secondary';
        case 'confirmed':
            return 'success';
        case 'cancelled':
            return 'destructive';
        default:
            return 'outline';
    }
};
const getStatusLabel = (status)=>{
    switch(status){
        case 'draft':
            return 'Nháp';
        case 'confirmed':
            return 'Đã xác nhận';
        case 'cancelled':
            return 'Đã hủy';
        default:
            return status;
    }
};
const formatCurrency = (value)=>value.toLocaleString('vi-VN') + ' đ';
const getColumns = (navigate, onPrint)=>[
        {
            id: 'select',
            header: ({ isAllPageRowsSelected, isSomePageRowsSelected, onToggleAll })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex items-center justify-center",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$checkbox$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Checkbox"], {
                        checked: isAllPageRowsSelected ? true : isSomePageRowsSelected ? 'indeterminate' : false,
                        onCheckedChange: (value)=>onToggleAll?.(!!value),
                        "aria-label": "Chọn tất cả",
                        className: "h-4 w-4"
                    }, void 0, false, {
                        fileName: "[project]/features/cost-adjustments/columns.tsx",
                        lineNumber: 40,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0))
                }, void 0, false, {
                    fileName: "[project]/features/cost-adjustments/columns.tsx",
                    lineNumber: 39,
                    columnNumber: 7
                }, ("TURBOPACK compile-time value", void 0)),
            cell: ({ isSelected, onToggleSelect })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex items-center justify-center",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$checkbox$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Checkbox"], {
                        checked: isSelected,
                        onCheckedChange: onToggleSelect,
                        "aria-label": "Chọn hàng",
                        className: "h-4 w-4"
                    }, void 0, false, {
                        fileName: "[project]/features/cost-adjustments/columns.tsx",
                        lineNumber: 50,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0))
                }, void 0, false, {
                    fileName: "[project]/features/cost-adjustments/columns.tsx",
                    lineNumber: 49,
                    columnNumber: 7
                }, ("TURBOPACK compile-time value", void 0)),
            enableSorting: false,
            size: 50,
            meta: {
                displayName: 'Chọn'
            }
        },
        {
            id: 'id',
            accessorKey: 'id',
            header: 'Mã phiếu',
            cell: ({ row })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                    href: `/cost-adjustments/${row.systemId}`,
                    className: "font-medium text-primary hover:underline",
                    children: row.id
                }, void 0, false, {
                    fileName: "[project]/features/cost-adjustments/columns.tsx",
                    lineNumber: 67,
                    columnNumber: 7
                }, ("TURBOPACK compile-time value", void 0)),
            meta: {
                displayName: 'Mã phiếu'
            }
        },
        {
            id: 'referenceCode',
            accessorKey: 'referenceCode',
            header: 'Mã tham chiếu',
            cell: ({ row })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                    className: "text-muted-foreground",
                    children: row.referenceCode || '-'
                }, void 0, false, {
                    fileName: "[project]/features/cost-adjustments/columns.tsx",
                    lineNumber: 81,
                    columnNumber: 7
                }, ("TURBOPACK compile-time value", void 0)),
            meta: {
                displayName: 'Mã tham chiếu'
            }
        },
        {
            id: 'createdDate',
            accessorKey: 'createdDate',
            header: 'Ngày tạo',
            cell: ({ row })=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatDate"])(row.createdDate),
            meta: {
                displayName: 'Ngày tạo'
            }
        },
        {
            id: 'createdByName',
            accessorKey: 'createdByName',
            header: 'Người tạo',
            cell: ({ row })=>row.createdByName,
            meta: {
                displayName: 'Người tạo'
            }
        },
        {
            id: 'itemCount',
            accessorKey: 'items',
            header: 'Số SP',
            cell: ({ row })=>row.items?.length || 0,
            meta: {
                displayName: 'Số sản phẩm'
            }
        },
        {
            id: 'totalOldValue',
            accessorKey: 'items',
            header: 'Tổng giá vốn cũ',
            cell: ({ row })=>{
                const totalOldValue = row.items?.reduce((sum, item)=>sum + item.oldCostPrice, 0) || 0;
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                    children: formatCurrency(totalOldValue)
                }, void 0, false, {
                    fileName: "[project]/features/cost-adjustments/columns.tsx",
                    lineNumber: 114,
                    columnNumber: 14
                }, ("TURBOPACK compile-time value", void 0));
            },
            meta: {
                displayName: 'Tổng giá vốn cũ'
            }
        },
        {
            id: 'totalNewValue',
            accessorKey: 'items',
            header: 'Tổng giá vốn mới',
            cell: ({ row })=>{
                const totalNewValue = row.items?.reduce((sum, item)=>sum + item.newCostPrice, 0) || 0;
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                    children: formatCurrency(totalNewValue)
                }, void 0, false, {
                    fileName: "[project]/features/cost-adjustments/columns.tsx",
                    lineNumber: 124,
                    columnNumber: 14
                }, ("TURBOPACK compile-time value", void 0));
            },
            meta: {
                displayName: 'Tổng giá vốn mới'
            }
        },
        {
            id: 'totalDifference',
            accessorKey: 'items',
            header: 'Chênh lệch',
            cell: ({ row })=>{
                const totalDifference = row.items?.reduce((sum, item)=>sum + item.adjustmentAmount, 0) || 0;
                const isPositive = totalDifference > 0;
                const isNegative = totalDifference < 0;
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                    className: `font-medium ${isPositive ? 'text-green-600' : isNegative ? 'text-red-600' : ''}`,
                    children: [
                        isPositive ? '+' : '',
                        formatCurrency(totalDifference)
                    ]
                }, void 0, true, {
                    fileName: "[project]/features/cost-adjustments/columns.tsx",
                    lineNumber: 138,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0));
            },
            meta: {
                displayName: 'Chênh lệch'
            }
        },
        {
            id: 'reason',
            accessorKey: 'reason',
            header: 'Lý do',
            cell: ({ row })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                    className: "text-muted-foreground truncate max-w-[200px] block",
                    children: row.reason || '-'
                }, void 0, false, {
                    fileName: "[project]/features/cost-adjustments/columns.tsx",
                    lineNumber: 150,
                    columnNumber: 7
                }, ("TURBOPACK compile-time value", void 0)),
            meta: {
                displayName: 'Lý do'
            }
        },
        {
            id: 'status',
            accessorKey: 'status',
            header: 'Trạng thái',
            cell: ({ row })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$badge$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Badge"], {
                    variant: getStatusVariant(row.status),
                    children: getStatusLabel(row.status)
                }, void 0, false, {
                    fileName: "[project]/features/cost-adjustments/columns.tsx",
                    lineNumber: 161,
                    columnNumber: 7
                }, ("TURBOPACK compile-time value", void 0)),
            meta: {
                displayName: 'Trạng thái'
            }
        },
        {
            id: 'confirmedDate',
            accessorKey: 'confirmedDate',
            header: 'Ngày xác nhận',
            cell: ({ row })=>row.confirmedDate ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatDate"])(row.confirmedDate) : '-',
            meta: {
                displayName: 'Ngày xác nhận'
            }
        },
        {
            id: 'confirmedByName',
            accessorKey: 'confirmedByName',
            header: 'Người xác nhận',
            cell: ({ row })=>row.confirmedByName || '-',
            meta: {
                displayName: 'Người xác nhận'
            }
        },
        {
            id: 'note',
            accessorKey: 'note',
            header: 'Ghi chú',
            cell: ({ row })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                    className: "text-muted-foreground truncate max-w-[200px] block",
                    children: row.note || '-'
                }, void 0, false, {
                    fileName: "[project]/features/cost-adjustments/columns.tsx",
                    lineNumber: 186,
                    columnNumber: 7
                }, ("TURBOPACK compile-time value", void 0)),
            meta: {
                displayName: 'Ghi chú'
            }
        },
        {
            id: 'actions',
            header: 'Hành động',
            cell: ({ row })=>{
                const adjustment = row;
                const isDraft = adjustment.status === 'draft';
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DropdownMenu"], {
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DropdownMenuTrigger"], {
                            asChild: true,
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                variant: "ghost",
                                size: "sm",
                                className: "h-8 w-8 p-0",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$ellipsis$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MoreHorizontal$3e$__["MoreHorizontal"], {
                                        className: "h-4 w-4"
                                    }, void 0, false, {
                                        fileName: "[project]/features/cost-adjustments/columns.tsx",
                                        lineNumber: 203,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "sr-only",
                                        children: "Mở menu"
                                    }, void 0, false, {
                                        fileName: "[project]/features/cost-adjustments/columns.tsx",
                                        lineNumber: 204,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/features/cost-adjustments/columns.tsx",
                                lineNumber: 202,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0))
                        }, void 0, false, {
                            fileName: "[project]/features/cost-adjustments/columns.tsx",
                            lineNumber: 201,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DropdownMenuContent"], {
                            align: "end",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DropdownMenuItem"], {
                                    onClick: ()=>navigate(`/cost-adjustments/${adjustment.systemId}`),
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$eye$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Eye$3e$__["Eye"], {
                                            className: "mr-2 h-4 w-4"
                                        }, void 0, false, {
                                            fileName: "[project]/features/cost-adjustments/columns.tsx",
                                            lineNumber: 209,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        "Xem chi tiết"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/features/cost-adjustments/columns.tsx",
                                    lineNumber: 208,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0)),
                                isDraft && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DropdownMenuItem"], {
                                            onClick: ()=>navigate(`/cost-adjustments/${adjustment.systemId}`),
                                            children: "Xác nhận"
                                        }, void 0, false, {
                                            fileName: "[project]/features/cost-adjustments/columns.tsx",
                                            lineNumber: 214,
                                            columnNumber: 17
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DropdownMenuSeparator"], {}, void 0, false, {
                                            fileName: "[project]/features/cost-adjustments/columns.tsx",
                                            lineNumber: 217,
                                            columnNumber: 17
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DropdownMenuItem"], {
                                            className: "text-destructive focus:text-destructive",
                                            onClick: ()=>navigate(`/cost-adjustments/${adjustment.systemId}`),
                                            children: "Hủy phiếu"
                                        }, void 0, false, {
                                            fileName: "[project]/features/cost-adjustments/columns.tsx",
                                            lineNumber: 218,
                                            columnNumber: 17
                                        }, ("TURBOPACK compile-time value", void 0))
                                    ]
                                }, void 0, true),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DropdownMenuSeparator"], {}, void 0, false, {
                                    fileName: "[project]/features/cost-adjustments/columns.tsx",
                                    lineNumber: 226,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DropdownMenuItem"], {
                                    onClick: ()=>onPrint(adjustment),
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$printer$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Printer$3e$__["Printer"], {
                                            className: "mr-2 h-4 w-4"
                                        }, void 0, false, {
                                            fileName: "[project]/features/cost-adjustments/columns.tsx",
                                            lineNumber: 228,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        "In phiếu"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/features/cost-adjustments/columns.tsx",
                                    lineNumber: 227,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/features/cost-adjustments/columns.tsx",
                            lineNumber: 207,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0))
                    ]
                }, void 0, true, {
                    fileName: "[project]/features/cost-adjustments/columns.tsx",
                    lineNumber: 200,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0));
            },
            meta: {
                displayName: 'Hành động'
            }
        }
    ];
const getStatusOptions = ()=>[
        {
            value: 'all',
            label: 'Tất cả trạng thái'
        },
        {
            value: 'draft',
            label: 'Nháp'
        },
        {
            value: 'confirmed',
            label: 'Đã xác nhận'
        },
        {
            value: 'cancelled',
            label: 'Đã hủy'
        }
    ];
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/ui/card.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Card",
    ()=>Card,
    "CardContent",
    ()=>CardContent,
    "CardDescription",
    ()=>CardDescription,
    "CardFooter",
    ()=>CardFooter,
    "CardHeader",
    ()=>CardHeader,
    "CardTitle",
    ()=>CardTitle
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/utils.ts [app-client] (ecmascript)");
;
;
;
const Card = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](_c = ({ className, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("rounded-lg border bg-card text-card-foreground shadow-sm", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/card.tsx",
        lineNumber: 9,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0)));
_c1 = Card;
Card.displayName = "Card";
const CardHeader = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](_c2 = ({ className, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("flex flex-col space-y-1.5 p-6", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/card.tsx",
        lineNumber: 24,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0)));
_c3 = CardHeader;
CardHeader.displayName = "CardHeader";
const CardTitle = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](_c4 = ({ className, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("text-h3 font-semibold leading-none tracking-tight", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/card.tsx",
        lineNumber: 36,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0)));
_c5 = CardTitle;
CardTitle.displayName = "CardTitle";
const CardDescription = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](_c6 = ({ className, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("text-sm text-muted-foreground", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/card.tsx",
        lineNumber: 51,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0)));
_c7 = CardDescription;
CardDescription.displayName = "CardDescription";
const CardContent = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](_c8 = ({ className, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("p-6 pt-0", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/card.tsx",
        lineNumber: 63,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0)));
_c9 = CardContent;
CardContent.displayName = "CardContent";
const CardFooter = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](_c10 = ({ className, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("flex items-center p-6 pt-0", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/card.tsx",
        lineNumber: 71,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0)));
_c11 = CardFooter;
CardFooter.displayName = "CardFooter";
;
var _c, _c1, _c2, _c3, _c4, _c5, _c6, _c7, _c8, _c9, _c10, _c11;
__turbopack_context__.k.register(_c, "Card$React.forwardRef");
__turbopack_context__.k.register(_c1, "Card");
__turbopack_context__.k.register(_c2, "CardHeader$React.forwardRef");
__turbopack_context__.k.register(_c3, "CardHeader");
__turbopack_context__.k.register(_c4, "CardTitle$React.forwardRef");
__turbopack_context__.k.register(_c5, "CardTitle");
__turbopack_context__.k.register(_c6, "CardDescription$React.forwardRef");
__turbopack_context__.k.register(_c7, "CardDescription");
__turbopack_context__.k.register(_c8, "CardContent$React.forwardRef");
__turbopack_context__.k.register(_c9, "CardContent");
__turbopack_context__.k.register(_c10, "CardFooter$React.forwardRef");
__turbopack_context__.k.register(_c11, "CardFooter");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/mobile/skeleton.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "CardGridSkeleton",
    ()=>CardGridSkeleton,
    "ChartSkeleton",
    ()=>ChartSkeleton,
    "FormSkeleton",
    ()=>FormSkeleton,
    "MobileCardSkeleton",
    ()=>MobileCardSkeleton,
    "PageSkeleton",
    ()=>PageSkeleton,
    "Skeleton",
    ()=>Skeleton,
    "TableSkeleton",
    ()=>TableSkeleton
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/card.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/utils.ts [app-client] (ecmascript)");
;
;
;
function Skeleton({ className, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("animate-pulse rounded-md bg-muted", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/components/mobile/skeleton.tsx",
        lineNumber: 14,
        columnNumber: 5
    }, this);
}
_c = Skeleton;
function MobileCardSkeleton({ count = 3, className }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
        children: Array.from({
            length: count
        }).map((_, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Card"], {
                className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("overflow-hidden", className),
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardContent"], {
                    className: "p-4",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex items-start space-x-3",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Skeleton, {
                                    className: "h-12 w-12 rounded-full flex-shrink-0"
                                }, void 0, false, {
                                    fileName: "[project]/components/mobile/skeleton.tsx",
                                    lineNumber: 38,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex-1 space-y-2",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Skeleton, {
                                            className: "h-4 w-3/4"
                                        }, void 0, false, {
                                            fileName: "[project]/components/mobile/skeleton.tsx",
                                            lineNumber: 42,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Skeleton, {
                                            className: "h-3 w-1/2"
                                        }, void 0, false, {
                                            fileName: "[project]/components/mobile/skeleton.tsx",
                                            lineNumber: 43,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "space-y-1.5 pt-2",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Skeleton, {
                                                    className: "h-3 w-full"
                                                }, void 0, false, {
                                                    fileName: "[project]/components/mobile/skeleton.tsx",
                                                    lineNumber: 45,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Skeleton, {
                                                    className: "h-3 w-2/3"
                                                }, void 0, false, {
                                                    fileName: "[project]/components/mobile/skeleton.tsx",
                                                    lineNumber: 46,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/mobile/skeleton.tsx",
                                            lineNumber: 44,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/mobile/skeleton.tsx",
                                    lineNumber: 41,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/mobile/skeleton.tsx",
                            lineNumber: 36,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex items-center justify-between mt-3 pt-3 border-t",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Skeleton, {
                                    className: "h-5 w-20"
                                }, void 0, false, {
                                    fileName: "[project]/components/mobile/skeleton.tsx",
                                    lineNumber: 53,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Skeleton, {
                                    className: "h-3 w-24"
                                }, void 0, false, {
                                    fileName: "[project]/components/mobile/skeleton.tsx",
                                    lineNumber: 54,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/mobile/skeleton.tsx",
                            lineNumber: 52,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/mobile/skeleton.tsx",
                    lineNumber: 35,
                    columnNumber: 11
                }, this)
            }, i, false, {
                fileName: "[project]/components/mobile/skeleton.tsx",
                lineNumber: 34,
                columnNumber: 9
            }, this))
    }, void 0, false);
}
_c1 = MobileCardSkeleton;
function TableSkeleton({ rows = 5, columns = 4 }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "space-y-3",
        children: Array.from({
            length: rows
        }).map((_, rowIndex)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center space-x-4",
                children: Array.from({
                    length: columns
                }).map((_, colIndex)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Skeleton, {
                            className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("h-9", colIndex === 0 ? "w-1/4" : "flex-1")
                        }, void 0, false, {
                            fileName: "[project]/components/mobile/skeleton.tsx",
                            lineNumber: 79,
                            columnNumber: 15
                        }, this)
                    }, colIndex, false, {
                        fileName: "[project]/components/mobile/skeleton.tsx",
                        lineNumber: 78,
                        columnNumber: 13
                    }, this))
            }, rowIndex, false, {
                fileName: "[project]/components/mobile/skeleton.tsx",
                lineNumber: 76,
                columnNumber: 9
            }, this))
    }, void 0, false, {
        fileName: "[project]/components/mobile/skeleton.tsx",
        lineNumber: 74,
        columnNumber: 5
    }, this);
}
_c2 = TableSkeleton;
function CardGridSkeleton({ count = 4, columns = 4 }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: `grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-${columns}`,
        children: Array.from({
            length: count
        }).map((_, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Card"], {
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardContent"], {
                    className: "p-6",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex items-start justify-between mb-2",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Skeleton, {
                                    className: "h-5 w-5 rounded"
                                }, void 0, false, {
                                    fileName: "[project]/components/mobile/skeleton.tsx",
                                    lineNumber: 109,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Skeleton, {
                                    className: "h-4 w-16"
                                }, void 0, false, {
                                    fileName: "[project]/components/mobile/skeleton.tsx",
                                    lineNumber: 110,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/mobile/skeleton.tsx",
                            lineNumber: 108,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Skeleton, {
                            className: "h-8 w-24 mb-2"
                        }, void 0, false, {
                            fileName: "[project]/components/mobile/skeleton.tsx",
                            lineNumber: 112,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Skeleton, {
                            className: "h-3 w-full"
                        }, void 0, false, {
                            fileName: "[project]/components/mobile/skeleton.tsx",
                            lineNumber: 113,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/mobile/skeleton.tsx",
                    lineNumber: 107,
                    columnNumber: 11
                }, this)
            }, i, false, {
                fileName: "[project]/components/mobile/skeleton.tsx",
                lineNumber: 106,
                columnNumber: 9
            }, this))
    }, void 0, false, {
        fileName: "[project]/components/mobile/skeleton.tsx",
        lineNumber: 104,
        columnNumber: 5
    }, this);
}
_c3 = CardGridSkeleton;
function FormSkeleton({ fields = 6 }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "space-y-6",
        children: [
            Array.from({
                length: fields
            }).map((_, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "space-y-2",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Skeleton, {
                            className: "h-4 w-32"
                        }, void 0, false, {
                            fileName: "[project]/components/mobile/skeleton.tsx",
                            lineNumber: 129,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Skeleton, {
                            className: "h-9 w-full"
                        }, void 0, false, {
                            fileName: "[project]/components/mobile/skeleton.tsx",
                            lineNumber: 130,
                            columnNumber: 11
                        }, this)
                    ]
                }, i, true, {
                    fileName: "[project]/components/mobile/skeleton.tsx",
                    lineNumber: 128,
                    columnNumber: 9
                }, this)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex justify-end space-x-2 pt-4",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Skeleton, {
                        className: "h-9 w-24"
                    }, void 0, false, {
                        fileName: "[project]/components/mobile/skeleton.tsx",
                        lineNumber: 134,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Skeleton, {
                        className: "h-9 w-24"
                    }, void 0, false, {
                        fileName: "[project]/components/mobile/skeleton.tsx",
                        lineNumber: 135,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/mobile/skeleton.tsx",
                lineNumber: 133,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/mobile/skeleton.tsx",
        lineNumber: 126,
        columnNumber: 5
    }, this);
}
_c4 = FormSkeleton;
function ChartSkeleton({ height = "300px" }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "w-full",
        style: {
            height
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-end justify-between h-full space-x-2 pb-4",
                children: [
                    40,
                    70,
                    55,
                    80,
                    60,
                    90,
                    45
                ].map((h, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex-1",
                        style: {
                            height: `${h}%`
                        },
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Skeleton, {
                            className: "w-full h-full"
                        }, void 0, false, {
                            fileName: "[project]/components/mobile/skeleton.tsx",
                            lineNumber: 150,
                            columnNumber: 13
                        }, this)
                    }, i, false, {
                        fileName: "[project]/components/mobile/skeleton.tsx",
                        lineNumber: 149,
                        columnNumber: 11
                    }, this))
            }, void 0, false, {
                fileName: "[project]/components/mobile/skeleton.tsx",
                lineNumber: 147,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex justify-between pt-2",
                children: Array.from({
                    length: 7
                }).map((_, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Skeleton, {
                            className: "h-3 w-8"
                        }, void 0, false, {
                            fileName: "[project]/components/mobile/skeleton.tsx",
                            lineNumber: 157,
                            columnNumber: 13
                        }, this)
                    }, i, false, {
                        fileName: "[project]/components/mobile/skeleton.tsx",
                        lineNumber: 156,
                        columnNumber: 11
                    }, this))
            }, void 0, false, {
                fileName: "[project]/components/mobile/skeleton.tsx",
                lineNumber: 154,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/mobile/skeleton.tsx",
        lineNumber: 146,
        columnNumber: 5
    }, this);
}
_c5 = ChartSkeleton;
function PageSkeleton() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "space-y-6",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "space-y-2",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Skeleton, {
                        className: "h-8 w-48"
                    }, void 0, false, {
                        fileName: "[project]/components/mobile/skeleton.tsx",
                        lineNumber: 173,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Skeleton, {
                        className: "h-4 w-96"
                    }, void 0, false, {
                        fileName: "[project]/components/mobile/skeleton.tsx",
                        lineNumber: 174,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/mobile/skeleton.tsx",
                lineNumber: 172,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex justify-between",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Skeleton, {
                        className: "h-9 w-64"
                    }, void 0, false, {
                        fileName: "[project]/components/mobile/skeleton.tsx",
                        lineNumber: 179,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Skeleton, {
                        className: "h-9 w-32"
                    }, void 0, false, {
                        fileName: "[project]/components/mobile/skeleton.tsx",
                        lineNumber: 180,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/mobile/skeleton.tsx",
                lineNumber: 178,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(CardGridSkeleton, {
                count: 6
            }, void 0, false, {
                fileName: "[project]/components/mobile/skeleton.tsx",
                lineNumber: 184,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/mobile/skeleton.tsx",
        lineNumber: 170,
        columnNumber: 5
    }, this);
}
_c6 = PageSkeleton;
var _c, _c1, _c2, _c3, _c4, _c5, _c6;
__turbopack_context__.k.register(_c, "Skeleton");
__turbopack_context__.k.register(_c1, "MobileCardSkeleton");
__turbopack_context__.k.register(_c2, "TableSkeleton");
__turbopack_context__.k.register(_c3, "CardGridSkeleton");
__turbopack_context__.k.register(_c4, "FormSkeleton");
__turbopack_context__.k.register(_c5, "ChartSkeleton");
__turbopack_context__.k.register(_c6, "PageSkeleton");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/mobile/touch-button.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "TouchButton",
    ()=>TouchButton,
    "touchButtonVariants",
    ()=>touchButtonVariants
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/button.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/utils.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$class$2d$variance$2d$authority$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/class-variance-authority/dist/index.mjs [app-client] (ecmascript)");
;
;
;
;
;
const touchButtonVariants = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$class$2d$variance$2d$authority$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cva"])("inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50", {
    variants: {
        variant: {
            default: "bg-primary text-primary-foreground hover:bg-primary/90",
            destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
            outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
            secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
            ghost: "hover:bg-accent hover:text-accent-foreground",
            link: "text-primary underline-offset-4 hover:underline"
        },
        size: {
            default: "h-12 px-4 py-2 min-w-touch",
            sm: "h-9 rounded-md px-3 min-w-touch",
            lg: "h-14 rounded-md px-8 min-w-touch-lg",
            xl: "h-16 rounded-md px-10 min-w-touch-lg",
            icon: "h-12 w-12",
            "icon-sm": "h-9 w-10",
            "icon-lg": "h-14 w-14"
        }
    },
    defaultVariants: {
        variant: "default",
        size: "default"
    }
});
/**
 * TouchButton - Mobile-optimized button with minimum 44px touch targets
 * Follows Apple HIG and Material Design guidelines for touch interfaces
 */ const TouchButton = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](_c = ({ className, variant, size, asChild: _asChild = false, ...props }, ref)=>{
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])(touchButtonVariants({
            variant,
            size,
            className
        })),
        ref: ref,
        ...props
    }, void 0, false, {
        fileName: "[project]/components/mobile/touch-button.tsx",
        lineNumber: 48,
        columnNumber: 7
    }, ("TURBOPACK compile-time value", void 0));
});
_c1 = TouchButton;
TouchButton.displayName = "TouchButton";
;
var _c, _c1;
__turbopack_context__.k.register(_c, "TouchButton$React.forwardRef");
__turbopack_context__.k.register(_c1, "TouchButton");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/mobile/empty-state.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "EmptyState",
    ()=>EmptyState,
    "SearchEmptyState",
    ()=>SearchEmptyState
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/utils.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$mobile$2f$touch$2d$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/mobile/touch-button.tsx [app-client] (ecmascript)");
;
;
;
function EmptyState({ icon: Icon, title, description, action, className, size = "md" }) {
    const sizeClasses = {
        sm: {
            container: "py-8",
            icon: "h-12 w-12 mb-3",
            title: "text-base",
            description: "text-sm"
        },
        md: {
            container: "py-12",
            icon: "h-16 w-16 mb-4",
            title: "text-lg",
            description: "text-sm"
        },
        lg: {
            container: "py-16",
            icon: "h-20 w-20 mb-6",
            title: "text-xl",
            description: "text-base"
        }
    };
    const classes = sizeClasses[size];
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("flex flex-col items-center justify-center px-4 text-center", classes.container, className),
        children: [
            Icon && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Icon, {
                className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("text-muted-foreground", classes.icon),
                strokeWidth: 1.5
            }, void 0, false, {
                fileName: "[project]/components/mobile/empty-state.tsx",
                lineNumber: 63,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("font-semibold mb-2", classes.title),
                children: title
            }, void 0, false, {
                fileName: "[project]/components/mobile/empty-state.tsx",
                lineNumber: 72,
                columnNumber: 7
            }, this),
            description && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("text-muted-foreground mb-6 max-w-sm", classes.description),
                children: description
            }, void 0, false, {
                fileName: "[project]/components/mobile/empty-state.tsx",
                lineNumber: 77,
                columnNumber: 9
            }, this),
            action && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mt-2",
                children: action
            }, void 0, false, {
                fileName: "[project]/components/mobile/empty-state.tsx",
                lineNumber: 87,
                columnNumber: 18
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/mobile/empty-state.tsx",
        lineNumber: 55,
        columnNumber: 5
    }, this);
}
_c = EmptyState;
function SearchEmptyState({ searchQuery, onClear }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(EmptyState, {
        title: "Không tìm thấy kết quả",
        description: `Không có kết quả nào phù hợp với "${searchQuery}". Thử tìm kiếm với từ khóa khác.`,
        action: onClear && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$mobile$2f$touch$2d$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TouchButton"], {
            variant: "outline",
            onClick: onClear,
            children: "Xóa bộ lọc"
        }, void 0, false, {
            fileName: "[project]/components/mobile/empty-state.tsx",
            lineNumber: 108,
            columnNumber: 11
        }, void 0)
    }, void 0, false, {
        fileName: "[project]/components/mobile/empty-state.tsx",
        lineNumber: 103,
        columnNumber: 5
    }, this);
}
_c1 = SearchEmptyState;
var _c, _c1;
__turbopack_context__.k.register(_c, "EmptyState");
__turbopack_context__.k.register(_c1, "SearchEmptyState");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/ui/table.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Table",
    ()=>Table,
    "TableBody",
    ()=>TableBody,
    "TableCaption",
    ()=>TableCaption,
    "TableCell",
    ()=>TableCell,
    "TableFooter",
    ()=>TableFooter,
    "TableHead",
    ()=>TableHead,
    "TableHeader",
    ()=>TableHeader,
    "TableRow",
    ()=>TableRow
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/utils.ts [app-client] (ecmascript)");
;
;
;
const Table = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](_c = ({ className, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("table", {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("w-full caption-bottom text-sm", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/table.tsx",
        lineNumber: 9,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0)));
_c1 = Table;
Table.displayName = "Table";
const TableHeader = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](_c2 = ({ className, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("thead", {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("[&_tr]:border-b", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/table.tsx",
        lineNumber: 21,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0)));
_c3 = TableHeader;
TableHeader.displayName = "TableHeader";
const TableBody = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](_c4 = ({ className, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tbody", {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("[&_tr:last-child]:border-0", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/table.tsx",
        lineNumber: 29,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0)));
_c5 = TableBody;
TableBody.displayName = "TableBody";
const TableFooter = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](_c6 = ({ className, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tfoot", {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("border-t bg-muted/50 font-medium [&>tr]:last:border-b-0", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/table.tsx",
        lineNumber: 41,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0)));
_c7 = TableFooter;
TableFooter.displayName = "TableFooter";
const TableRow = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](_c8 = ({ className, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("group border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/table.tsx",
        lineNumber: 56,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0)));
_c9 = TableRow;
TableRow.displayName = "TableRow";
const TableHead = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](_c10 = ({ className, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("h-9 px-4 text-left align-middle font-medium text-foreground [&:has([role=checkbox])]:px-3 [&:has([role=checkbox])]:w-12 [&:has([role=checkbox])]:text-center whitespace-nowrap", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/table.tsx",
        lineNumber: 71,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0)));
_c11 = TableHead;
TableHead.displayName = "TableHead";
const TableCell = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](_c12 = ({ className, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("px-4 py-1 align-middle whitespace-nowrap [&:has([role=checkbox])]:px-3 [&:has([role=checkbox])]:w-12 [&:has([role=checkbox])]:text-center", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/table.tsx",
        lineNumber: 86,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0)));
_c13 = TableCell;
TableCell.displayName = "TableCell";
const TableCaption = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](_c14 = ({ className, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("caption", {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("mt-4 text-sm text-muted-foreground", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/table.tsx",
        lineNumber: 101,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0)));
_c15 = TableCaption;
TableCaption.displayName = "TableCaption";
;
var _c, _c1, _c2, _c3, _c4, _c5, _c6, _c7, _c8, _c9, _c10, _c11, _c12, _c13, _c14, _c15;
__turbopack_context__.k.register(_c, "Table$React.forwardRef");
__turbopack_context__.k.register(_c1, "Table");
__turbopack_context__.k.register(_c2, "TableHeader$React.forwardRef");
__turbopack_context__.k.register(_c3, "TableHeader");
__turbopack_context__.k.register(_c4, "TableBody$React.forwardRef");
__turbopack_context__.k.register(_c5, "TableBody");
__turbopack_context__.k.register(_c6, "TableFooter$React.forwardRef");
__turbopack_context__.k.register(_c7, "TableFooter");
__turbopack_context__.k.register(_c8, "TableRow$React.forwardRef");
__turbopack_context__.k.register(_c9, "TableRow");
__turbopack_context__.k.register(_c10, "TableHead$React.forwardRef");
__turbopack_context__.k.register(_c11, "TableHead");
__turbopack_context__.k.register(_c12, "TableCell$React.forwardRef");
__turbopack_context__.k.register(_c13, "TableCell");
__turbopack_context__.k.register(_c14, "TableCaption$React.forwardRef");
__turbopack_context__.k.register(_c15, "TableCaption");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/ui/select.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Select",
    ()=>Select,
    "SelectContent",
    ()=>SelectContent,
    "SelectGroup",
    ()=>SelectGroup,
    "SelectItem",
    ()=>SelectItem,
    "SelectLabel",
    ()=>SelectLabel,
    "SelectScrollDownButton",
    ()=>SelectScrollDownButton,
    "SelectScrollUpButton",
    ()=>SelectScrollUpButton,
    "SelectSeparator",
    ()=>SelectSeparator,
    "SelectTrigger",
    ()=>SelectTrigger,
    "SelectValue",
    ()=>SelectValue
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$select$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@radix-ui/react-select/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Check$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/check.js [app-client] (ecmascript) <export default as Check>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$down$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronDown$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/chevron-down.js [app-client] (ecmascript) <export default as ChevronDown>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$up$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronUp$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/chevron-up.js [app-client] (ecmascript) <export default as ChevronUp>");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/utils.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$contexts$2f$modal$2d$context$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/contexts/modal-context.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
;
;
;
;
;
const Select = ({ value, defaultValue, ...props })=>{
    const controlledProps = {};
    if (value !== undefined) {
        controlledProps.value = value;
    }
    if (defaultValue !== undefined) {
        controlledProps.defaultValue = defaultValue;
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$select$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Root"], {
        ...props,
        ...controlledProps
    }, void 0, false, {
        fileName: "[project]/components/ui/select.tsx",
        lineNumber: 26,
        columnNumber: 10
    }, ("TURBOPACK compile-time value", void 0));
};
_c = Select;
Select.displayName = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$select$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Root"].displayName;
const SelectGroup = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$select$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Group"];
const SelectValue = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$select$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Value"];
const SelectTrigger = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](_c1 = ({ className, children, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$select$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Trigger"], {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("flex h-9 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background data-[placeholder]:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1", className),
        ...props,
        children: [
            children,
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$select$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Icon"], {
                asChild: true,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$down$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronDown$3e$__["ChevronDown"], {
                    className: "h-4 w-4 opacity-50"
                }, void 0, false, {
                    fileName: "[project]/components/ui/select.tsx",
                    lineNumber: 48,
                    columnNumber: 7
                }, ("TURBOPACK compile-time value", void 0))
            }, void 0, false, {
                fileName: "[project]/components/ui/select.tsx",
                lineNumber: 47,
                columnNumber: 5
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/components/ui/select.tsx",
        lineNumber: 38,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0)));
_c2 = SelectTrigger;
SelectTrigger.displayName = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$select$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Trigger"].displayName;
const SelectScrollUpButton = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](({ className, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$select$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ScrollUpButton"], {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("flex cursor-default items-center justify-center py-1", className),
        ...props,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$up$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronUp$3e$__["ChevronUp"], {
            className: "h-4 w-4"
        }, void 0, false, {
            fileName: "[project]/components/ui/select.tsx",
            lineNumber: 66,
            columnNumber: 5
        }, ("TURBOPACK compile-time value", void 0))
    }, void 0, false, {
        fileName: "[project]/components/ui/select.tsx",
        lineNumber: 58,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0)));
_c3 = SelectScrollUpButton;
SelectScrollUpButton.displayName = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$select$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ScrollUpButton"].displayName;
const SelectScrollDownButton = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](({ className, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$select$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ScrollDownButton"], {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("flex cursor-default items-center justify-center py-1", className),
        ...props,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$down$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronDown$3e$__["ChevronDown"], {
            className: "h-4 w-4"
        }, void 0, false, {
            fileName: "[project]/components/ui/select.tsx",
            lineNumber: 83,
            columnNumber: 5
        }, ("TURBOPACK compile-time value", void 0))
    }, void 0, false, {
        fileName: "[project]/components/ui/select.tsx",
        lineNumber: 75,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0)));
_c4 = SelectScrollDownButton;
SelectScrollDownButton.displayName = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$select$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ScrollDownButton"].displayName;
const SelectContent = /*#__PURE__*/ _s(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](_c5 = _s(({ className, children, position = "popper", ...props }, ref)=>{
    _s();
    const modalId = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useId"]();
    const [isOpen, setIsOpen] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"](false);
    const { zIndex } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$contexts$2f$modal$2d$context$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useModal"])(modalId, isOpen, 'select');
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"]({
        "SelectContent.useEffect": ()=>{
            const content = ref && 'current' in ref ? ref.current : null;
            if (!content) return;
            const observer = new MutationObserver({
                "SelectContent.useEffect": (mutations)=>{
                    mutations.forEach({
                        "SelectContent.useEffect": (mutation)=>{
                            if (mutation.type === 'attributes' && mutation.attributeName === 'data-state') {
                                const target = mutation.target;
                                const state = target.getAttribute('data-state');
                                setIsOpen(state === 'open');
                            }
                        }
                    }["SelectContent.useEffect"]);
                }
            }["SelectContent.useEffect"]);
            observer.observe(content, {
                attributes: true,
                attributeFilter: [
                    'data-state'
                ]
            });
            return ({
                "SelectContent.useEffect": ()=>observer.disconnect()
            })["SelectContent.useEffect"];
        }
    }["SelectContent.useEffect"], [
        ref
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$select$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Portal"], {
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$select$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Content"], {
            ref: ref,
            className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("relative max-h-[--radix-select-content-available-height] min-w-[8rem] overflow-y-auto overflow-x-hidden rounded-md border bg-popover text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-[--radix-select-content-transform-origin]", position === "popper" && "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1", className),
            style: {
                zIndex
            },
            position: position,
            ...props,
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(SelectScrollUpButton, {}, void 0, false, {
                    fileName: "[project]/components/ui/select.tsx",
                    lineNumber: 130,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$select$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Viewport"], {
                    className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("p-1", position === "popper" && "h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]"),
                    children: children
                }, void 0, false, {
                    fileName: "[project]/components/ui/select.tsx",
                    lineNumber: 131,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(SelectScrollDownButton, {}, void 0, false, {
                    fileName: "[project]/components/ui/select.tsx",
                    lineNumber: 140,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0))
            ]
        }, void 0, true, {
            fileName: "[project]/components/ui/select.tsx",
            lineNumber: 118,
            columnNumber: 7
        }, ("TURBOPACK compile-time value", void 0))
    }, void 0, false, {
        fileName: "[project]/components/ui/select.tsx",
        lineNumber: 117,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
}, "oXfM6F2HxOqs+JkgAgmCu2d1dJo=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$contexts$2f$modal$2d$context$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useModal"]
    ];
})), "oXfM6F2HxOqs+JkgAgmCu2d1dJo=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$contexts$2f$modal$2d$context$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useModal"]
    ];
});
_c6 = SelectContent;
SelectContent.displayName = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$select$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Content"].displayName;
const SelectLabel = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](_c7 = ({ className, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$select$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Label"], {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("py-1.5 pl-8 pr-2 text-sm font-semibold", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/select.tsx",
        lineNumber: 151,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0)));
_c8 = SelectLabel;
SelectLabel.displayName = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$select$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Label"].displayName;
const SelectItem = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](_c9 = ({ className, children, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$select$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Item"], {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50", className),
        ...props,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: "absolute left-2 flex h-3.5 w-3.5 items-center justify-center",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$select$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ItemIndicator"], {
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Check$3e$__["Check"], {
                        className: "h-4 w-4"
                    }, void 0, false, {
                        fileName: "[project]/components/ui/select.tsx",
                        lineNumber: 173,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0))
                }, void 0, false, {
                    fileName: "[project]/components/ui/select.tsx",
                    lineNumber: 172,
                    columnNumber: 7
                }, ("TURBOPACK compile-time value", void 0))
            }, void 0, false, {
                fileName: "[project]/components/ui/select.tsx",
                lineNumber: 171,
                columnNumber: 5
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$select$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ItemText"], {
                children: children
            }, void 0, false, {
                fileName: "[project]/components/ui/select.tsx",
                lineNumber: 177,
                columnNumber: 5
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/components/ui/select.tsx",
        lineNumber: 163,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0)));
_c10 = SelectItem;
SelectItem.displayName = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$select$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Item"].displayName;
const SelectSeparator = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](_c11 = ({ className, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$select$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Separator"], {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("-mx-1 my-1 h-px bg-muted", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/select.tsx",
        lineNumber: 186,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0)));
_c12 = SelectSeparator;
SelectSeparator.displayName = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$select$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Separator"].displayName;
;
var _c, _c1, _c2, _c3, _c4, _c5, _c6, _c7, _c8, _c9, _c10, _c11, _c12;
__turbopack_context__.k.register(_c, "Select");
__turbopack_context__.k.register(_c1, "SelectTrigger$React.forwardRef");
__turbopack_context__.k.register(_c2, "SelectTrigger");
__turbopack_context__.k.register(_c3, "SelectScrollUpButton");
__turbopack_context__.k.register(_c4, "SelectScrollDownButton");
__turbopack_context__.k.register(_c5, "SelectContent$React.forwardRef");
__turbopack_context__.k.register(_c6, "SelectContent");
__turbopack_context__.k.register(_c7, "SelectLabel$React.forwardRef");
__turbopack_context__.k.register(_c8, "SelectLabel");
__turbopack_context__.k.register(_c9, "SelectItem$React.forwardRef");
__turbopack_context__.k.register(_c10, "SelectItem");
__turbopack_context__.k.register(_c11, "SelectSeparator$React.forwardRef");
__turbopack_context__.k.register(_c12, "SelectSeparator");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/data-table/data-table-pagination.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "DataTablePagination",
    ()=>DataTablePagination
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/button.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/select.tsx [app-client] (ecmascript)");
;
;
;
function DataTablePagination({ pageIndex, pageSize, pageCount, rowCount, selectedRowCount, setPageIndex, setPageSize, canPreviousPage, canNextPage }) {
    // Generate page numbers to display
    const getPageNumbers = ()=>{
        const pages = [];
        const showEllipsis = pageCount > 7;
        if (!showEllipsis) {
            // Show all pages if 7 or fewer
            for(let i = 0; i < pageCount; i++){
                pages.push(i);
            }
        } else {
            // Always show first page
            pages.push(0);
            if (pageIndex <= 3) {
                // Near start: 1 2 3 4 5 ... last
                for(let i = 1; i < 5; i++){
                    pages.push(i);
                }
                pages.push('ellipsis');
                pages.push(pageCount - 1);
            } else if (pageIndex >= pageCount - 4) {
                // Near end: 1 ... N-4 N-3 N-2 N-1 N
                pages.push('ellipsis');
                for(let i = pageCount - 5; i < pageCount; i++){
                    pages.push(i);
                }
            } else {
                // Middle: 1 ... current-1 current current+1 ... last
                pages.push('ellipsis');
                pages.push(pageIndex - 1);
                pages.push(pageIndex);
                pages.push(pageIndex + 1);
                pages.push('ellipsis');
                pages.push(pageCount - 1);
            }
        }
        return pages;
    };
    const pageNumbers = getPageNumbers();
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex items-center justify-between px-2",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex-1 text-sm text-muted-foreground",
                children: [
                    selectedRowCount,
                    " của",
                    " ",
                    rowCount,
                    " dòng được chọn."
                ]
            }, void 0, true, {
                fileName: "[project]/components/data-table/data-table-pagination.tsx",
                lineNumber: 80,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center space-x-6 lg:space-x-8",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center space-x-2",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-sm font-medium",
                                children: "Số dòng mỗi trang"
                            }, void 0, false, {
                                fileName: "[project]/components/data-table/data-table-pagination.tsx",
                                lineNumber: 86,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Select"], {
                                value: `${pageSize}`,
                                onValueChange: (value)=>{
                                    setPageSize(Number(value));
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SelectTrigger"], {
                                        className: "w-[70px]",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SelectValue"], {
                                            placeholder: `${pageSize}`
                                        }, void 0, false, {
                                            fileName: "[project]/components/data-table/data-table-pagination.tsx",
                                            lineNumber: 94,
                                            columnNumber: 15
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/components/data-table/data-table-pagination.tsx",
                                        lineNumber: 93,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SelectContent"], {
                                        children: [
                                            10,
                                            20,
                                            30,
                                            40,
                                            50
                                        ].map((size)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SelectItem"], {
                                                value: `${size}`,
                                                children: size
                                            }, size, false, {
                                                fileName: "[project]/components/data-table/data-table-pagination.tsx",
                                                lineNumber: 98,
                                                columnNumber: 17
                                            }, this))
                                    }, void 0, false, {
                                        fileName: "[project]/components/data-table/data-table-pagination.tsx",
                                        lineNumber: 96,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/data-table/data-table-pagination.tsx",
                                lineNumber: 87,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/data-table/data-table-pagination.tsx",
                        lineNumber: 85,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center space-x-1",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                variant: "outline",
                                size: "sm",
                                className: "px-3",
                                onClick: ()=>setPageIndex(pageIndex - 1),
                                disabled: !canPreviousPage,
                                children: "Previous"
                            }, void 0, false, {
                                fileName: "[project]/components/data-table/data-table-pagination.tsx",
                                lineNumber: 107,
                                columnNumber: 11
                            }, this),
                            pageNumbers.map((page, idx)=>{
                                if (page === 'ellipsis') {
                                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "px-2 text-muted-foreground",
                                        children: "..."
                                    }, `ellipsis-${idx}`, false, {
                                        fileName: "[project]/components/data-table/data-table-pagination.tsx",
                                        lineNumber: 120,
                                        columnNumber: 17
                                    }, this);
                                }
                                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                    variant: pageIndex === page ? "default" : "outline",
                                    size: "sm",
                                    className: "w-9 p-0",
                                    onClick: ()=>setPageIndex(page),
                                    children: page + 1
                                }, page, false, {
                                    fileName: "[project]/components/data-table/data-table-pagination.tsx",
                                    lineNumber: 127,
                                    columnNumber: 15
                                }, this);
                            }),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                variant: "outline",
                                size: "sm",
                                className: "px-3",
                                onClick: ()=>setPageIndex(pageIndex + 1),
                                disabled: !canNextPage,
                                children: "Next"
                            }, void 0, false, {
                                fileName: "[project]/components/data-table/data-table-pagination.tsx",
                                lineNumber: 139,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/data-table/data-table-pagination.tsx",
                        lineNumber: 106,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/data-table/data-table-pagination.tsx",
                lineNumber: 84,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/data-table/data-table-pagination.tsx",
        lineNumber: 79,
        columnNumber: 5
    }, this);
}
_c = DataTablePagination;
var _c;
__turbopack_context__.k.register(_c, "DataTablePagination");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/data-table/sticky-scrollbar.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "StickyScrollbar",
    ()=>StickyScrollbar
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/utils.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
;
;
function StickyScrollbar({ targetRef, className }) {
    _s();
    const scrollbarRef = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"](null);
    const [isVisible, setIsVisible] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"](false);
    const [scrollbarStyle, setScrollbarStyle] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"]({});
    const [isMounted, setIsMounted] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"](false);
    const [updateTrigger, setUpdateTrigger] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"](0); // ✅ Force update trigger
    // Force re-render after mount to ensure refs are available
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"]({
        "StickyScrollbar.useEffect": ()=>{
            setIsMounted(true);
        }
    }["StickyScrollbar.useEffect"], []);
    // ✅ Force update when target element changes size (e.g., columns added/removed)
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"]({
        "StickyScrollbar.useEffect": ()=>{
            if (!isMounted || !targetRef.current) return;
            const targetElement = targetRef.current;
            // Watch for changes to table width/scrollWidth
            const mutationObserver = new MutationObserver({
                "StickyScrollbar.useEffect": ()=>{
                    setUpdateTrigger({
                        "StickyScrollbar.useEffect": (prev)=>prev + 1
                    }["StickyScrollbar.useEffect"]);
                }
            }["StickyScrollbar.useEffect"]);
            mutationObserver.observe(targetElement, {
                attributes: true,
                childList: true,
                subtree: true
            });
            return ({
                "StickyScrollbar.useEffect": ()=>{
                    mutationObserver.disconnect();
                }
            })["StickyScrollbar.useEffect"];
        }
    }["StickyScrollbar.useEffect"], [
        targetRef,
        isMounted
    ]);
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"]({
        "StickyScrollbar.useEffect": ()=>{
            if (!isMounted) return;
            const targetElement = targetRef.current;
            const scrollbarElement = scrollbarRef.current;
            if (!targetElement || !scrollbarElement) return;
            let animationFrameId;
            // Check if horizontal scrollbar is needed and update position
            const updateScrollbar = {
                "StickyScrollbar.useEffect.updateScrollbar": ()=>{
                    const hasHorizontalScroll = targetElement.scrollWidth > targetElement.clientWidth;
                    setIsVisible(hasHorizontalScroll);
                    if (hasHorizontalScroll) {
                        // Get the bounding rect to position the scrollbar correctly
                        const rect = targetElement.getBoundingClientRect();
                        // Set the scrollbar position and width to match the table VIEWPORT
                        setScrollbarStyle({
                            left: `${rect.left}px`,
                            width: `${rect.width}px`
                        });
                        // ✅ FIX: Set the inner content width to match table's FULL scroll width
                        // This allows the scrollbar to scroll the full distance
                        const scrollContent = scrollbarElement.firstElementChild;
                        if (scrollContent) {
                            scrollContent.style.width = `${targetElement.scrollWidth}px`;
                            scrollContent.style.height = '1px'; // Ensure height for scrollbar
                        }
                    }
                }
            }["StickyScrollbar.useEffect.updateScrollbar"];
            // Sync scroll position: sticky scrollbar -> table
            const handleStickyScroll = {
                "StickyScrollbar.useEffect.handleStickyScroll": ()=>{
                    cancelAnimationFrame(animationFrameId);
                    animationFrameId = requestAnimationFrame({
                        "StickyScrollbar.useEffect.handleStickyScroll": ()=>{
                            if (targetElement.scrollLeft !== scrollbarElement.scrollLeft) {
                                targetElement.scrollLeft = scrollbarElement.scrollLeft;
                            }
                        }
                    }["StickyScrollbar.useEffect.handleStickyScroll"]);
                }
            }["StickyScrollbar.useEffect.handleStickyScroll"];
            // Sync scroll position: table -> sticky scrollbar
            const handleTableScroll = {
                "StickyScrollbar.useEffect.handleTableScroll": ()=>{
                    cancelAnimationFrame(animationFrameId);
                    animationFrameId = requestAnimationFrame({
                        "StickyScrollbar.useEffect.handleTableScroll": ()=>{
                            if (scrollbarElement.scrollLeft !== targetElement.scrollLeft) {
                                scrollbarElement.scrollLeft = targetElement.scrollLeft;
                            }
                        }
                    }["StickyScrollbar.useEffect.handleTableScroll"]);
                }
            }["StickyScrollbar.useEffect.handleTableScroll"];
            // Initial update
            updateScrollbar();
            // Add event listeners
            scrollbarElement.addEventListener('scroll', handleStickyScroll, {
                passive: true
            });
            targetElement.addEventListener('scroll', handleTableScroll, {
                passive: true
            });
            window.addEventListener('resize', updateScrollbar, {
                passive: true
            });
            // Re-check on content changes
            const resizeObserver = new ResizeObserver(updateScrollbar);
            resizeObserver.observe(targetElement);
            return ({
                "StickyScrollbar.useEffect": ()=>{
                    cancelAnimationFrame(animationFrameId);
                    scrollbarElement.removeEventListener('scroll', handleStickyScroll);
                    targetElement.removeEventListener('scroll', handleTableScroll);
                    window.removeEventListener('resize', updateScrollbar);
                    resizeObserver.disconnect();
                }
            })["StickyScrollbar.useEffect"];
        }
    }["StickyScrollbar.useEffect"], [
        targetRef,
        isMounted,
        updateTrigger
    ]); // ✅ Re-run when updateTrigger changes
    // Always render but conditionally show with visibility
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        ref: scrollbarRef,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("fixed bottom-0 z-[100] overflow-x-auto overflow-y-hidden", "h-3 bg-muted/90 backdrop-blur-sm border-t border-border shadow-[0_-2px_12px_rgba(0,0,0,0.08)]", "transition-opacity duration-200", isVisible ? "opacity-100" : "opacity-0 pointer-events-none", className),
        style: scrollbarStyle,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "h-px pointer-events-none"
        }, void 0, false, {
            fileName: "[project]/components/data-table/sticky-scrollbar.tsx",
            lineNumber: 142,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/components/data-table/sticky-scrollbar.tsx",
        lineNumber: 130,
        columnNumber: 5
    }, this);
}
_s(StickyScrollbar, "Y55S33O4SE3s/90fKN0gu6V8GXs=");
_c = StickyScrollbar;
var _c;
__turbopack_context__.k.register(_c, "StickyScrollbar");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/data-table/responsive-data-table.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "MobileCardWrapper",
    ()=>MobileCardWrapper,
    "ResponsiveDataTable",
    ()=>ResponsiveDataTable
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$down$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronDown$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/chevron-down.js [app-client] (ecmascript) <export default as ChevronDown>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevrons$2d$right$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronsRight$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/chevrons-right.js [app-client] (ecmascript) <export default as ChevronsRight>");
var __TURBOPACK__imported__module__$5b$project$5d2f$contexts$2f$breakpoint$2d$context$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/contexts/breakpoint-context.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/card.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$mobile$2f$skeleton$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/mobile/skeleton.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$mobile$2f$empty$2d$state$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/mobile/empty-state.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$mobile$2f$touch$2d$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/mobile/touch-button.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/utils.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$table$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/table.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$data$2d$table$2f$data$2d$table$2d$pagination$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/data-table/data-table-pagination.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/button.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/dropdown-menu.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$data$2d$table$2f$sticky$2d$scrollbar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/data-table/sticky-scrollbar.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
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
function ResponsiveDataTable({ columns, data, renderMobileCard, autoGenerateMobileCards = true, mobileCardClassName, isLoading = false, emptyTitle = "Không có dữ liệu", emptyDescription, emptyAction, mobileVirtualized = false, mobileRowHeight = 180, mobileListHeight = 600, pageCount, pagination, setPagination, rowCount, rowSelection = {}, setRowSelection = ()=>{}, onBulkDelete, showBulkDeleteButton = true, bulkActions, pkgxBulkActions, bulkActionButtons, allSelectedRows = [], renderSubComponent, expanded = {}, setExpanded = ()=>{}, sorting, setSorting, columnVisibility = {}, setColumnVisibility = ()=>{}, columnOrder = [], setColumnOrder = ()=>{}, pinnedColumns = [], setPinnedColumns = ()=>{}, onRowClick, getRowStyle, className }) {
    _s();
    const { isMobile } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$contexts$2f$breakpoint$2d$context$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useBreakpoint"])();
    const autoCardColumns = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"]({
        "ResponsiveDataTable.useMemo[autoCardColumns]": ()=>{
            return columns.filter({
                "ResponsiveDataTable.useMemo[autoCardColumns]": (column)=>{
                    if (!column.id) return false;
                    if ([
                        'select',
                        'control',
                        'actions',
                        'expander'
                    ].includes(column.id)) return false;
                    if (columnVisibility && columnVisibility[column.id] === false) return false;
                    const meta = column.meta;
                    if (meta?.hideOnMobileCard) return false;
                    return true;
                }
            }["ResponsiveDataTable.useMemo[autoCardColumns]"]).slice(0, 6);
        }
    }["ResponsiveDataTable.useMemo[autoCardColumns]"], [
        columns,
        columnVisibility
    ]);
    const getColumnLabel = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"]({
        "ResponsiveDataTable.useCallback[getColumnLabel]": (column)=>{
            if (typeof column.header === 'string') return column.header;
            const meta = column.meta;
            if (meta?.displayName) return meta.displayName;
            return column.id || '';
        }
    }["ResponsiveDataTable.useCallback[getColumnLabel]"], []);
    const renderColumnValue = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"]({
        "ResponsiveDataTable.useCallback[renderColumnValue]": (column, row)=>{
            if (typeof column.cell === 'function') {
                return column.cell({
                    row,
                    isSelected: false,
                    isExpanded: false,
                    onToggleSelect: {
                        "ResponsiveDataTable.useCallback[renderColumnValue]": ()=>{}
                    }["ResponsiveDataTable.useCallback[renderColumnValue]"],
                    onToggleExpand: {
                        "ResponsiveDataTable.useCallback[renderColumnValue]": ()=>{}
                    }["ResponsiveDataTable.useCallback[renderColumnValue]"]
                });
            }
            if (column.accessorKey) {
                const value = row[column.accessorKey];
                if (value === undefined || value === null) return '—';
                if (/*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isValidElement"](value)) return value;
                return String(value);
            }
            return '—';
        }
    }["ResponsiveDataTable.useCallback[renderColumnValue]"], []);
    const autoRenderMobileCard = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"]({
        "ResponsiveDataTable.useCallback[autoRenderMobileCard]": (row)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(MobileCardWrapper, {
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "space-y-3 text-sm",
                    children: autoCardColumns.map({
                        "ResponsiveDataTable.useCallback[autoRenderMobileCard]": (column)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "text-xs uppercase text-muted-foreground font-semibold",
                                        children: getColumnLabel(column)
                                    }, void 0, false, {
                                        fileName: "[project]/components/data-table/responsive-data-table.tsx",
                                        lineNumber: 237,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "text-base font-medium text-foreground",
                                        children: renderColumnValue(column, row)
                                    }, void 0, false, {
                                        fileName: "[project]/components/data-table/responsive-data-table.tsx",
                                        lineNumber: 240,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, column.id, true, {
                                fileName: "[project]/components/data-table/responsive-data-table.tsx",
                                lineNumber: 236,
                                columnNumber: 11
                            }, this)
                    }["ResponsiveDataTable.useCallback[autoRenderMobileCard]"])
                }, void 0, false, {
                    fileName: "[project]/components/data-table/responsive-data-table.tsx",
                    lineNumber: 234,
                    columnNumber: 7
                }, this)
            }, void 0, false, {
                fileName: "[project]/components/data-table/responsive-data-table.tsx",
                lineNumber: 233,
                columnNumber: 5
            }, this)
    }["ResponsiveDataTable.useCallback[autoRenderMobileCard]"], [
        autoCardColumns,
        getColumnLabel,
        renderColumnValue
    ]);
    const hasAutoCardSupport = autoGenerateMobileCards !== false && autoCardColumns.length > 0;
    const cardRenderer = renderMobileCard ?? (hasAutoCardSupport ? autoRenderMobileCard : undefined);
    const shouldRenderMobileCards = Boolean(isMobile && cardRenderer);
    const desktopProps = {
        columns,
        data,
        pageCount,
        pagination,
        setPagination,
        rowCount,
        rowSelection,
        setRowSelection,
        onBulkDelete,
        showBulkDeleteButton,
        bulkActions,
        pkgxBulkActions,
        bulkActionButtons,
        allSelectedRows,
        renderSubComponent,
        expanded,
        setExpanded,
        sorting,
        setSorting,
        columnVisibility,
        setColumnVisibility,
        columnOrder,
        setColumnOrder,
        pinnedColumns,
        setPinnedColumns,
        onRowClick,
        getRowStyle,
        className
    };
    // Loading state
    if (isLoading) {
        return shouldRenderMobileCards ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$mobile$2f$skeleton$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MobileCardSkeleton"], {
            count: pagination.pageSize || 10,
            className: mobileCardClassName
        }, void 0, false, {
            fileName: "[project]/components/data-table/responsive-data-table.tsx",
            lineNumber: 287,
            columnNumber: 7
        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("space-y-3", className),
            children: Array.from({
                length: pagination.pageSize || 10
            }).map((_, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "h-16 bg-muted animate-pulse rounded"
                }, i, false, {
                    fileName: "[project]/components/data-table/responsive-data-table.tsx",
                    lineNumber: 291,
                    columnNumber: 11
                }, this))
        }, void 0, false, {
            fileName: "[project]/components/data-table/responsive-data-table.tsx",
            lineNumber: 289,
            columnNumber: 7
        }, this);
    }
    // Empty state - only for mobile card mode
    if (data.length === 0 && shouldRenderMobileCards) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$mobile$2f$empty$2d$state$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["EmptyState"], {
            title: emptyTitle,
            description: emptyDescription,
            action: emptyAction,
            className: className
        }, void 0, false, {
            fileName: "[project]/components/data-table/responsive-data-table.tsx",
            lineNumber: 300,
            columnNumber: 7
        }, this);
    }
    // Mobile card layout
    if (shouldRenderMobileCards && cardRenderer) {
        if (mobileVirtualized) {
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('pb-4', className),
                style: {
                    maxHeight: mobileListHeight,
                    overflowY: 'auto'
                },
                children: data.map((row, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: mobileCardClassName,
                        style: {
                            minHeight: mobileRowHeight
                        },
                        children: cardRenderer(row, index)
                    }, row.systemId, false, {
                        fileName: "[project]/components/data-table/responsive-data-table.tsx",
                        lineNumber: 318,
                        columnNumber: 13
                    }, this))
            }, void 0, false, {
                fileName: "[project]/components/data-table/responsive-data-table.tsx",
                lineNumber: 313,
                columnNumber: 9
            }, this);
        }
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("space-y-3 pb-4", className),
            children: [
                data.map((row, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: mobileCardClassName,
                        children: cardRenderer(row, index)
                    }, row.systemId, false, {
                        fileName: "[project]/components/data-table/responsive-data-table.tsx",
                        lineNumber: 333,
                        columnNumber: 11
                    }, this)),
                pageCount > 1 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex items-center justify-between pt-4 border-t",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$mobile$2f$touch$2d$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TouchButton"], {
                            variant: "outline",
                            size: "sm",
                            onClick: ()=>setPagination((p)=>({
                                        ...p,
                                        pageIndex: Math.max(0, p.pageIndex - 1)
                                    })),
                            disabled: pagination.pageIndex === 0,
                            children: "Trước"
                        }, void 0, false, {
                            fileName: "[project]/components/data-table/responsive-data-table.tsx",
                            lineNumber: 341,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex flex-col items-center gap-1",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "text-sm font-medium",
                                    children: [
                                        "Trang ",
                                        pagination.pageIndex + 1,
                                        " / ",
                                        pageCount
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/data-table/responsive-data-table.tsx",
                                    lineNumber: 351,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "text-xs text-muted-foreground",
                                    children: [
                                        rowCount,
                                        " kết quả"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/data-table/responsive-data-table.tsx",
                                    lineNumber: 354,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/data-table/responsive-data-table.tsx",
                            lineNumber: 350,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$mobile$2f$touch$2d$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TouchButton"], {
                            variant: "outline",
                            size: "sm",
                            onClick: ()=>setPagination((p)=>({
                                        ...p,
                                        pageIndex: Math.min(pageCount - 1, p.pageIndex + 1)
                                    })),
                            disabled: pagination.pageIndex >= pageCount - 1,
                            children: "Sau"
                        }, void 0, false, {
                            fileName: "[project]/components/data-table/responsive-data-table.tsx",
                            lineNumber: 359,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/data-table/responsive-data-table.tsx",
                    lineNumber: 340,
                    columnNumber: 11
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/components/data-table/responsive-data-table.tsx",
            lineNumber: 331,
            columnNumber: 7
        }, this);
    }
    // Desktop table layout
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(DesktopDataTable, {
        ...desktopProps
    }, void 0, false, {
        fileName: "[project]/components/data-table/responsive-data-table.tsx",
        lineNumber: 374,
        columnNumber: 10
    }, this);
}
_s(ResponsiveDataTable, "G+zNnfsPnBHf5s0BANJdXDbE9s4=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$contexts$2f$breakpoint$2d$context$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useBreakpoint"]
    ];
});
_c = ResponsiveDataTable;
function DesktopDataTable({ columns, data, pageCount, pagination, setPagination, rowCount, rowSelection, setRowSelection, onBulkDelete: _onBulkDelete, showBulkDeleteButton: _showBulkDeleteButton = true, bulkActions, pkgxBulkActions, bulkActionButtons, allSelectedRows, renderSubComponent, expanded, setExpanded, sorting, setSorting, columnVisibility, setColumnVisibility: _setColumnVisibility, columnOrder, setColumnOrder: _setColumnOrder, pinnedColumns, setPinnedColumns: _setPinnedColumns, onRowClick, getRowStyle, className }) {
    _s1();
    const numSelected = Object.keys(rowSelection).length;
    const isAllPageRowsSelected = data.length > 0 && data.every((row)=>rowSelection[row.systemId]);
    const isSomePageRowsSelected = !isAllPageRowsSelected && data.some((row)=>rowSelection[row.systemId]);
    const hasData = data?.length > 0;
    const [columnWidths, setColumnWidths] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"]({});
    const stickyCellBg = 'var(--sticky-column-bg, rgba(255, 255, 255, 1))';
    const stickyHeaderBg = 'var(--sticky-column-header-bg, var(--muted))';
    const handleToggleAllPageRows = (value)=>{
        const newSelection = {
            ...rowSelection
        };
        data.forEach((row)=>{
            if (value) {
                newSelection[row.systemId] = true;
            } else {
                delete newSelection[row.systemId];
            }
        });
        setRowSelection(newSelection);
    };
    const displayColumns = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"]({
        "DesktopDataTable.useMemo[displayColumns]": ()=>{
            const expanderColumn = renderSubComponent ? {
                id: 'expander',
                header: ({
                    "DesktopDataTable.useMemo[displayColumns]": ()=>null
                })["DesktopDataTable.useMemo[displayColumns]"],
                cell: ({
                    "DesktopDataTable.useMemo[displayColumns]": ({ isExpanded, onToggleExpand })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex items-center justify-center",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                variant: "ghost",
                                size: "icon",
                                onClick: {
                                    "DesktopDataTable.useMemo[displayColumns]": (e)=>{
                                        e.stopPropagation();
                                        onToggleExpand();
                                    }
                                }["DesktopDataTable.useMemo[displayColumns]"],
                                className: "h-8 w-8",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevrons$2d$right$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronsRight$3e$__["ChevronsRight"], {
                                    className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('h-4 w-4 transition-transform', isExpanded && 'rotate-90')
                                }, void 0, false, {
                                    fileName: "[project]/components/data-table/responsive-data-table.tsx",
                                    lineNumber: 443,
                                    columnNumber: 17
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/components/data-table/responsive-data-table.tsx",
                                lineNumber: 434,
                                columnNumber: 15
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/components/data-table/responsive-data-table.tsx",
                            lineNumber: 433,
                            columnNumber: 13
                        }, this)
                })["DesktopDataTable.useMemo[displayColumns]"],
                size: 60,
                meta: {
                    displayName: 'Mở rộng',
                    sticky: 'left'
                }
            } : null;
            const allConfigurableColumns = expanderColumn ? [
                expanderColumn,
                ...columns
            ] : [
                ...columns
            ];
            const visibleMasterCols = allConfigurableColumns.filter({
                "DesktopDataTable.useMemo[displayColumns].visibleMasterCols": (col)=>{
                    if (col.id === 'expander') return true;
                    const isVisible = columnVisibility[col.id];
                    return isVisible !== false;
                }
            }["DesktopDataTable.useMemo[displayColumns].visibleMasterCols"]);
            const normalizedCols = visibleMasterCols.map({
                "DesktopDataTable.useMemo[displayColumns].normalizedCols": (col)=>{
                    if ([
                        'select',
                        'control'
                    ].includes(col.id)) {
                        return {
                            ...col,
                            meta: {
                                ...col.meta,
                                sticky: 'left'
                            }
                        };
                    }
                    if (col.id === 'actions') {
                        return {
                            ...col,
                            meta: {
                                ...col.meta,
                                sticky: 'right'
                            }
                        };
                    }
                    return col;
                }
            }["DesktopDataTable.useMemo[displayColumns].normalizedCols"]);
            const staticLeftCols = normalizedCols.filter({
                "DesktopDataTable.useMemo[displayColumns].staticLeftCols": (c)=>{
                    const meta = c.meta;
                    return meta?.sticky === 'left' && ![
                        'select',
                        'control',
                        'expander'
                    ].includes(c.id);
                }
            }["DesktopDataTable.useMemo[displayColumns].staticLeftCols"]);
            const staticRightCols = normalizedCols.filter({
                "DesktopDataTable.useMemo[displayColumns].staticRightCols": (c)=>c.meta?.sticky === 'right'
            }["DesktopDataTable.useMemo[displayColumns].staticRightCols"]);
            const controlCols = normalizedCols.filter({
                "DesktopDataTable.useMemo[displayColumns].controlCols": (c)=>[
                        'select',
                        'control',
                        'expander'
                    ].includes(c.id)
            }["DesktopDataTable.useMemo[displayColumns].controlCols"]);
            const bodyCols = normalizedCols.filter({
                "DesktopDataTable.useMemo[displayColumns].bodyCols": (c)=>{
                    const meta = c.meta;
                    return !meta?.sticky && ![
                        'select',
                        'control',
                        'expander'
                    ].includes(c.id);
                }
            }["DesktopDataTable.useMemo[displayColumns].bodyCols"]);
            const orderedBodyCols = [
                ...bodyCols
            ].sort({
                "DesktopDataTable.useMemo[displayColumns].orderedBodyCols": (a, b)=>{
                    const indexA = columnOrder.indexOf(a.id);
                    const indexB = columnOrder.indexOf(b.id);
                    if (indexA === -1 && indexB === -1) return 0;
                    if (indexA === -1) return 1;
                    if (indexB === -1) return -1;
                    return indexA - indexB;
                }
            }["DesktopDataTable.useMemo[displayColumns].orderedBodyCols"]);
            const userPinnedCols = orderedBodyCols.filter({
                "DesktopDataTable.useMemo[displayColumns].userPinnedCols": (col)=>pinnedColumns.includes(col.id)
            }["DesktopDataTable.useMemo[displayColumns].userPinnedCols"]).map({
                "DesktopDataTable.useMemo[displayColumns].userPinnedCols": (col)=>({
                        ...col,
                        meta: {
                            ...col.meta,
                            sticky: 'left'
                        }
                    })
            }["DesktopDataTable.useMemo[displayColumns].userPinnedCols"]);
            const nonPinnedBodyCols = orderedBodyCols.filter({
                "DesktopDataTable.useMemo[displayColumns].nonPinnedBodyCols": (c)=>!pinnedColumns.includes(c.id)
            }["DesktopDataTable.useMemo[displayColumns].nonPinnedBodyCols"]);
            return [
                ...controlCols,
                ...staticLeftCols,
                ...userPinnedCols,
                ...nonPinnedBodyCols,
                ...staticRightCols
            ];
        }
    }["DesktopDataTable.useMemo[displayColumns]"], [
        columns,
        columnVisibility,
        columnOrder,
        pinnedColumns,
        renderSubComponent
    ]);
    const leftStickyColumns = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"]({
        "DesktopDataTable.useMemo[leftStickyColumns]": ()=>displayColumns.filter({
                "DesktopDataTable.useMemo[leftStickyColumns]": (c)=>c.meta?.sticky === 'left'
            }["DesktopDataTable.useMemo[leftStickyColumns]"])
    }["DesktopDataTable.useMemo[leftStickyColumns]"], [
        displayColumns
    ]);
    const rightStickyColumns = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"]({
        "DesktopDataTable.useMemo[rightStickyColumns]": ()=>displayColumns.filter({
                "DesktopDataTable.useMemo[rightStickyColumns]": (c)=>c.meta?.sticky === 'right'
            }["DesktopDataTable.useMemo[rightStickyColumns]"])
    }["DesktopDataTable.useMemo[rightStickyColumns]"], [
        displayColumns
    ]);
    const getColumnWidth = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"]({
        "DesktopDataTable.useCallback[getColumnWidth]": (column)=>{
            return column.size ?? columnWidths[column.id] ?? column.meta?.minWidth ?? 140;
        }
    }["DesktopDataTable.useCallback[getColumnWidth]"], [
        columnWidths
    ]);
    const leftOffsets = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"]({
        "DesktopDataTable.useMemo[leftOffsets]": ()=>{
            let offset = 0;
            return leftStickyColumns.map({
                "DesktopDataTable.useMemo[leftOffsets]": (c)=>{
                    const width = getColumnWidth(c);
                    const currentOffset = offset;
                    offset += width;
                    return currentOffset;
                }
            }["DesktopDataTable.useMemo[leftOffsets]"]);
        }
    }["DesktopDataTable.useMemo[leftOffsets]"], [
        leftStickyColumns,
        getColumnWidth
    ]);
    const rightOffsets = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"]({
        "DesktopDataTable.useMemo[rightOffsets]": ()=>{
            let offset = 0;
            const reversedOffsets = [
                ...rightStickyColumns
            ].reverse().map({
                "DesktopDataTable.useMemo[rightOffsets].reversedOffsets": (c)=>{
                    const width = getColumnWidth(c);
                    const currentOffset = offset;
                    offset += width;
                    return currentOffset;
                }
            }["DesktopDataTable.useMemo[rightOffsets].reversedOffsets"]);
            return reversedOffsets.reverse();
        }
    }["DesktopDataTable.useMemo[rightOffsets]"], [
        rightStickyColumns,
        getColumnWidth
    ]);
    const tableContainerRef = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"](null);
    const headerScrollRef = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"](null);
    const bodyTableRef = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"](null);
    const headerTableRef = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"](null);
    const fallbackTableRef = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"]({
        "DesktopDataTable.useCallback[fallbackTableRef]": (node)=>{
            headerTableRef.current = node;
            bodyTableRef.current = node;
        }
    }["DesktopDataTable.useCallback[fallbackTableRef]"], []);
    const syncScroll = (source)=>{
        if (!headerScrollRef.current || !tableContainerRef.current) return;
        if (source === 'body') {
            headerScrollRef.current.scrollLeft = tableContainerRef.current.scrollLeft;
        } else {
            tableContainerRef.current.scrollLeft = headerScrollRef.current.scrollLeft;
        }
    };
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"]({
        "DesktopDataTable.useEffect": ()=>{
            if (!hasData) return;
            if (!headerTableRef.current) return;
            const syncWidths = {
                "DesktopDataTable.useEffect.syncWidths": ()=>{
                    const bodyTable = bodyTableRef.current;
                    const headerTable = headerTableRef.current;
                    if (!headerTable) return;
                    const bodyRow = bodyTable?.querySelector('tbody tr:first-child');
                    const headerRow = headerTable.querySelector('thead tr:last-child');
                    if (!headerRow) return;
                    const bodyCells = bodyRow ? Array.from(bodyRow.querySelectorAll('td')) : [];
                    const headerCells = Array.from(headerRow.querySelectorAll('th'));
                    const nextWidthMap = {};
                    displayColumns.forEach({
                        "DesktopDataTable.useEffect.syncWidths": (column, index)=>{
                            const sourceCell = bodyCells[index];
                            const fallbackCell = headerCells[index];
                            const width = sourceCell?.getBoundingClientRect().width || fallbackCell?.getBoundingClientRect().width;
                            if (width && headerCells[index]) {
                                headerCells[index].style.width = `${width}px`;
                                headerCells[index].style.minWidth = `${width}px`;
                                headerCells[index].style.maxWidth = `${width}px`;
                                nextWidthMap[column.id] = width;
                            }
                        }
                    }["DesktopDataTable.useEffect.syncWidths"]);
                    if (bodyTable) {
                        headerTable.style.width = `${bodyTable.getBoundingClientRect().width}px`;
                    }
                    setColumnWidths({
                        "DesktopDataTable.useEffect.syncWidths": (prev)=>{
                            let changed = false;
                            const updated = {
                                ...prev
                            };
                            Object.entries(nextWidthMap).forEach({
                                "DesktopDataTable.useEffect.syncWidths": ([key, width])=>{
                                    if (prev[key] !== width) {
                                        changed = true;
                                        updated[key] = width;
                                    }
                                }
                            }["DesktopDataTable.useEffect.syncWidths"]);
                            return changed ? updated : prev;
                        }
                    }["DesktopDataTable.useEffect.syncWidths"]);
                }
            }["DesktopDataTable.useEffect.syncWidths"];
            syncWidths();
            window.addEventListener('resize', syncWidths);
            const resizeObserver = new ResizeObserver(syncWidths);
            if (bodyTableRef.current) {
                resizeObserver.observe(bodyTableRef.current);
            }
            return ({
                "DesktopDataTable.useEffect": ()=>{
                    window.removeEventListener('resize', syncWidths);
                    resizeObserver.disconnect();
                }
            })["DesktopDataTable.useEffect"];
        }
    }["DesktopDataTable.useEffect"], [
        data,
        displayColumns,
        hasData
    ]);
    const renderHeaderRow = (isSticky)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$table$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TableRow"], {
            className: "h-9",
            children: displayColumns.map((column, colIndex)=>{
                const stickyMeta = isSticky ? column.meta?.sticky : undefined;
                const hasFixedSize = column.size !== undefined;
                const fallbackMinWidth = column.meta?.minWidth ?? 140;
                const style = {};
                if (hasFixedSize) {
                    style.width = column.size;
                    style.minWidth = column.size;
                    style.maxWidth = column.size;
                } else {
                    style.minWidth = fallbackMinWidth;
                }
                let thClassName = "bg-muted whitespace-nowrap";
                const isLastLeftSticky = stickyMeta === 'left' && colIndex === leftStickyColumns.length - 1;
                const _isFirstRightSticky = stickyMeta === 'right' && colIndex === displayColumns.length - rightStickyColumns.length;
                if (isSticky && stickyMeta === 'left') {
                    const stickyIndex = leftStickyColumns.findIndex((c)=>c.id === column.id);
                    if (stickyIndex !== -1) {
                        style.position = 'sticky';
                        style.left = `${leftOffsets[stickyIndex]}px`;
                        style.top = 0;
                        style.backgroundColor = stickyHeaderBg;
                        thClassName = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])(thClassName, "z-30 bg-muted shadow-sm");
                    }
                } else if (isSticky && stickyMeta === 'right') {
                    const stickyIndex = rightStickyColumns.findIndex((c)=>c.id === column.id);
                    if (stickyIndex !== -1) {
                        style.position = 'sticky';
                        style.right = `${rightOffsets[stickyIndex]}px`;
                        style.top = 0;
                        style.backgroundColor = stickyHeaderBg;
                        thClassName = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])(thClassName, "z-30 bg-muted shadow-[-2px_0_4px_-2px_rgba(0,0,0,0.1)]");
                    }
                }
                if ([
                    'control',
                    'select',
                    'expander',
                    'actions'
                ].includes(column.id)) {
                    thClassName = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])(thClassName, "px-2 text-center");
                }
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$table$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TableHead"], {
                    style: style,
                    className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])(thClassName, {
                        "border-r": isSticky && isLastLeftSticky
                    }),
                    children: typeof column.header === 'function' ? column.header({
                        isAllPageRowsSelected,
                        isSomePageRowsSelected,
                        onToggleAll: handleToggleAllPageRows,
                        sorting,
                        setSorting
                    }) : column.header
                }, column.id, false, {
                    fileName: "[project]/components/data-table/responsive-data-table.tsx",
                    lineNumber: 670,
                    columnNumber: 11
                }, this);
            })
        }, void 0, false, {
            fileName: "[project]/components/data-table/responsive-data-table.tsx",
            lineNumber: 624,
            columnNumber: 5
        }, this);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("flex flex-col w-full", className),
        children: [
            hasData ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        ref: headerScrollRef,
                        onScroll: ()=>syncScroll('header'),
                        className: "sticky top-32 z-30 overflow-x-auto rounded-t-md border border-b-0 bg-muted [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$table$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Table"], {
                            ref: headerTableRef,
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$table$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TableHeader"], {
                                className: "bg-muted shadow-sm",
                                children: [
                                    numSelected > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                        className: "absolute inset-x-0 top-0 z-50 h-9 bg-muted/95 backdrop-blur-sm border-b shadow-md",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                className: "sticky left-0 z-[60] bg-muted/95 backdrop-blur-sm px-3 w-[48px]",
                                                children: columns.find((c)=>c.id === 'select') && typeof columns.find((c)=>c.id === 'select').header === 'function' && // @ts-expect-error - header function type is complex with selection props
                                                columns.find((c)=>c.id === 'select').header({
                                                    isAllPageRowsSelected,
                                                    isSomePageRowsSelected,
                                                    onToggleAll: handleToggleAllPageRows
                                                })
                                            }, void 0, false, {
                                                fileName: "[project]/components/data-table/responsive-data-table.tsx",
                                                lineNumber: 705,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                className: "sticky left-[48px] z-[60] h-9 bg-muted/95 backdrop-blur-sm",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex items-center gap-3 px-4",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "text-sm font-medium",
                                                            children: [
                                                                numSelected,
                                                                " mục đã chọn"
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/components/data-table/responsive-data-table.tsx",
                                                            lineNumber: 718,
                                                            columnNumber: 25
                                                        }, this),
                                                        bulkActions && bulkActions.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DropdownMenu"], {
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DropdownMenuTrigger"], {
                                                                    asChild: true,
                                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                                                        variant: "outline",
                                                                        size: "sm",
                                                                        children: [
                                                                            "Action",
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$down$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronDown$3e$__["ChevronDown"], {
                                                                                className: "ml-2 h-4 w-4"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/components/data-table/responsive-data-table.tsx",
                                                                                lineNumber: 724,
                                                                                columnNumber: 33
                                                                            }, this)
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/components/data-table/responsive-data-table.tsx",
                                                                        lineNumber: 722,
                                                                        columnNumber: 31
                                                                    }, this)
                                                                }, void 0, false, {
                                                                    fileName: "[project]/components/data-table/responsive-data-table.tsx",
                                                                    lineNumber: 721,
                                                                    columnNumber: 29
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DropdownMenuContent"], {
                                                                    align: "start",
                                                                    children: bulkActions.map((action, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DropdownMenuItem"], {
                                                                            onSelect: ()=>action.onSelect(allSelectedRows),
                                                                            disabled: action.disabled,
                                                                            children: [
                                                                                action.icon && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(action.icon, {
                                                                                    className: "mr-2 h-4 w-4"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/components/data-table/responsive-data-table.tsx",
                                                                                    lineNumber: 734,
                                                                                    columnNumber: 51
                                                                                }, this),
                                                                                action.label
                                                                            ]
                                                                        }, index, true, {
                                                                            fileName: "[project]/components/data-table/responsive-data-table.tsx",
                                                                            lineNumber: 729,
                                                                            columnNumber: 33
                                                                        }, this))
                                                                }, void 0, false, {
                                                                    fileName: "[project]/components/data-table/responsive-data-table.tsx",
                                                                    lineNumber: 727,
                                                                    columnNumber: 29
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/components/data-table/responsive-data-table.tsx",
                                                            lineNumber: 720,
                                                            columnNumber: 27
                                                        }, this),
                                                        pkgxBulkActions && pkgxBulkActions.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DropdownMenu"], {
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DropdownMenuTrigger"], {
                                                                    asChild: true,
                                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                                                        variant: "outline",
                                                                        size: "sm",
                                                                        children: [
                                                                            "PKGX",
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$down$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronDown$3e$__["ChevronDown"], {
                                                                                className: "ml-2 h-4 w-4"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/components/data-table/responsive-data-table.tsx",
                                                                                lineNumber: 746,
                                                                                columnNumber: 33
                                                                            }, this)
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/components/data-table/responsive-data-table.tsx",
                                                                        lineNumber: 744,
                                                                        columnNumber: 31
                                                                    }, this)
                                                                }, void 0, false, {
                                                                    fileName: "[project]/components/data-table/responsive-data-table.tsx",
                                                                    lineNumber: 743,
                                                                    columnNumber: 29
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DropdownMenuContent"], {
                                                                    align: "start",
                                                                    children: pkgxBulkActions.map((action, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DropdownMenuItem"], {
                                                                            onSelect: ()=>action.onSelect(allSelectedRows),
                                                                            disabled: action.disabled,
                                                                            className: action.variant === 'destructive' ? 'text-destructive focus:text-destructive' : '',
                                                                            children: [
                                                                                action.icon && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(action.icon, {
                                                                                    className: "mr-2 h-4 w-4"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/components/data-table/responsive-data-table.tsx",
                                                                                    lineNumber: 757,
                                                                                    columnNumber: 51
                                                                                }, this),
                                                                                action.label
                                                                            ]
                                                                        }, index, true, {
                                                                            fileName: "[project]/components/data-table/responsive-data-table.tsx",
                                                                            lineNumber: 751,
                                                                            columnNumber: 33
                                                                        }, this))
                                                                }, void 0, false, {
                                                                    fileName: "[project]/components/data-table/responsive-data-table.tsx",
                                                                    lineNumber: 749,
                                                                    columnNumber: 29
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/components/data-table/responsive-data-table.tsx",
                                                            lineNumber: 742,
                                                            columnNumber: 27
                                                        }, this),
                                                        bulkActionButtons
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/components/data-table/responsive-data-table.tsx",
                                                    lineNumber: 717,
                                                    columnNumber: 23
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/components/data-table/responsive-data-table.tsx",
                                                lineNumber: 716,
                                                columnNumber: 21
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/data-table/responsive-data-table.tsx",
                                        lineNumber: 704,
                                        columnNumber: 19
                                    }, this),
                                    renderHeaderRow(true)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/data-table/responsive-data-table.tsx",
                                lineNumber: 702,
                                columnNumber: 15
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/components/data-table/responsive-data-table.tsx",
                            lineNumber: 701,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/components/data-table/responsive-data-table.tsx",
                        lineNumber: 696,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        ref: tableContainerRef,
                        onScroll: ()=>syncScroll('body'),
                        className: "rounded-b-md border bg-background overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$table$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Table"], {
                            ref: bodyTableRef,
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$table$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TableBody"], {
                                children: data.map((row, rowIndex)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$table$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TableRow"], {
                                                "data-state": rowSelection[row.systemId] && "selected",
                                                onClick: ()=>onRowClick?.(row),
                                                className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('group', onRowClick && 'cursor-pointer'),
                                                style: getRowStyle?.(row),
                                                children: displayColumns.map((column, colIndex)=>{
                                                    const isInteractiveColumn = [
                                                        'select',
                                                        'control',
                                                        'actions',
                                                        'expander'
                                                    ].includes(column.id);
                                                    const stickyMeta = column.meta?.sticky;
                                                    const hasFixedSize = column.size !== undefined;
                                                    const fallbackMinWidth = column.meta?.minWidth ?? 140;
                                                    const style = {};
                                                    if (hasFixedSize) {
                                                        style.width = column.size;
                                                        style.minWidth = column.size;
                                                        style.maxWidth = column.size;
                                                    } else {
                                                        style.minWidth = fallbackMinWidth;
                                                    }
                                                    let tdClassName = "";
                                                    const isLastLeftSticky = stickyMeta === 'left' && colIndex === leftStickyColumns.length - 1;
                                                    if (stickyMeta === 'left') {
                                                        const stickyIndex = leftStickyColumns.findIndex((c)=>c.id === column.id);
                                                        if (stickyIndex !== -1) {
                                                            style.position = 'sticky';
                                                            style.left = `${leftOffsets[stickyIndex]}px`;
                                                            const rowBgColor = getRowStyle?.(row)?.backgroundColor;
                                                            style.backgroundColor = rowBgColor || stickyCellBg;
                                                            tdClassName = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("z-20 shadow-[2px_0_6px_rgba(0,0,0,0.05)]", "bg-muted text-foreground group-hover:bg-muted group-data-[state=selected]:bg-muted");
                                                        }
                                                    } else if (stickyMeta === 'right') {
                                                        const stickyIndex = rightStickyColumns.findIndex((c)=>c.id === column.id);
                                                        if (stickyIndex !== -1) {
                                                            style.position = 'sticky';
                                                            style.right = `${rightOffsets[stickyIndex]}px`;
                                                            const rowBgColor = getRowStyle?.(row)?.backgroundColor;
                                                            style.backgroundColor = rowBgColor || stickyCellBg;
                                                            tdClassName = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("z-20", "bg-muted text-foreground group-hover:bg-muted group-data-[state=selected]:bg-muted shadow-[-2px_0_6px_rgba(0,0,0,0.08)]");
                                                        }
                                                    }
                                                    if ([
                                                        'control',
                                                        'select',
                                                        'expander',
                                                        'actions'
                                                    ].includes(column.id)) {
                                                        tdClassName = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])(tdClassName, "px-2 text-center");
                                                    }
                                                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$table$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TableCell"], {
                                                        style: style,
                                                        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])(tdClassName, {
                                                            "border-r": isLastLeftSticky
                                                        }),
                                                        onClick: isInteractiveColumn ? (e)=>e.stopPropagation() : undefined,
                                                        children: column.cell({
                                                            row,
                                                            isSelected: !!rowSelection[row.systemId],
                                                            isExpanded: !!expanded[row.systemId],
                                                            onToggleSelect: (value)=>{
                                                                setRowSelection((prev)=>{
                                                                    const newSelection = {
                                                                        ...prev
                                                                    };
                                                                    if (value) {
                                                                        newSelection[row.systemId] = true;
                                                                    } else {
                                                                        delete newSelection[row.systemId];
                                                                    }
                                                                    return newSelection;
                                                                });
                                                            },
                                                            onToggleExpand: ()=>setExpanded((prev)=>({
                                                                        ...prev,
                                                                        [row.systemId]: !prev[row.systemId]
                                                                    }))
                                                        })
                                                    }, column.id, false, {
                                                        fileName: "[project]/components/data-table/responsive-data-table.tsx",
                                                        lineNumber: 841,
                                                        columnNumber: 27
                                                    }, this);
                                                })
                                            }, void 0, false, {
                                                fileName: "[project]/components/data-table/responsive-data-table.tsx",
                                                lineNumber: 783,
                                                columnNumber: 21
                                            }, this),
                                            expanded[row.systemId] && renderSubComponent && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$table$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TableRow"], {
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$table$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TableCell"], {
                                                    colSpan: displayColumns.length,
                                                    className: "p-0",
                                                    children: renderSubComponent(row)
                                                }, void 0, false, {
                                                    fileName: "[project]/components/data-table/responsive-data-table.tsx",
                                                    lineNumber: 872,
                                                    columnNumber: 25
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/components/data-table/responsive-data-table.tsx",
                                                lineNumber: 871,
                                                columnNumber: 23
                                            }, this)
                                        ]
                                    }, `${row.systemId}-${rowIndex}`, true, {
                                        fileName: "[project]/components/data-table/responsive-data-table.tsx",
                                        lineNumber: 782,
                                        columnNumber: 19
                                    }, this))
                            }, void 0, false, {
                                fileName: "[project]/components/data-table/responsive-data-table.tsx",
                                lineNumber: 780,
                                columnNumber: 15
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/components/data-table/responsive-data-table.tsx",
                            lineNumber: 779,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/components/data-table/responsive-data-table.tsx",
                        lineNumber: 774,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                ref: tableContainerRef,
                className: "rounded-md border bg-background overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$table$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Table"], {
                    ref: fallbackTableRef,
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$table$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TableHeader"], {
                            className: "bg-muted shadow-sm",
                            children: renderHeaderRow(true)
                        }, void 0, false, {
                            fileName: "[project]/components/data-table/responsive-data-table.tsx",
                            lineNumber: 889,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$table$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TableBody"], {
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$table$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TableRow"], {
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$table$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TableCell"], {
                                    colSpan: displayColumns.length,
                                    className: "h-24 text-center",
                                    children: "Không có dữ liệu."
                                }, void 0, false, {
                                    fileName: "[project]/components/data-table/responsive-data-table.tsx",
                                    lineNumber: 894,
                                    columnNumber: 17
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/components/data-table/responsive-data-table.tsx",
                                lineNumber: 893,
                                columnNumber: 15
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/components/data-table/responsive-data-table.tsx",
                            lineNumber: 892,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/data-table/responsive-data-table.tsx",
                    lineNumber: 888,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/components/data-table/responsive-data-table.tsx",
                lineNumber: 884,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex-shrink-0 border-t bg-background px-6 py-3",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$data$2d$table$2f$data$2d$table$2d$pagination$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DataTablePagination"], {
                    pageIndex: pagination.pageIndex,
                    pageSize: pagination.pageSize,
                    pageCount: pageCount,
                    setPageIndex: (index)=>setPagination((p)=>({
                                ...p,
                                pageIndex: index
                            })),
                    setPageSize: (size)=>setPagination({
                            pageIndex: 0,
                            pageSize: size
                        }),
                    canPreviousPage: pagination.pageIndex > 0,
                    canNextPage: pagination.pageIndex < pageCount - 1,
                    rowCount: rowCount,
                    selectedRowCount: numSelected
                }, void 0, false, {
                    fileName: "[project]/components/data-table/responsive-data-table.tsx",
                    lineNumber: 904,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/components/data-table/responsive-data-table.tsx",
                lineNumber: 903,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$data$2d$table$2f$sticky$2d$scrollbar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["StickyScrollbar"], {
                targetRef: tableContainerRef
            }, void 0, false, {
                fileName: "[project]/components/data-table/responsive-data-table.tsx",
                lineNumber: 917,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/data-table/responsive-data-table.tsx",
        lineNumber: 693,
        columnNumber: 5
    }, this);
}
_s1(DesktopDataTable, "7PCOZ0p0+vf/tzIdwIILPMLt+Pw=");
_c1 = DesktopDataTable;
function MobileCardWrapper({ children, onClick, className }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Card"], {
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("hover:shadow-md transition-shadow", onClick && "cursor-pointer", className),
        onClick: onClick,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardContent"], {
            className: "p-4",
            children: children
        }, void 0, false, {
            fileName: "[project]/components/data-table/responsive-data-table.tsx",
            lineNumber: 943,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/components/data-table/responsive-data-table.tsx",
        lineNumber: 935,
        columnNumber: 5
    }, this);
}
_c2 = MobileCardWrapper;
var _c, _c1, _c2;
__turbopack_context__.k.register(_c, "ResponsiveDataTable");
__turbopack_context__.k.register(_c1, "DesktopDataTable");
__turbopack_context__.k.register(_c2, "MobileCardWrapper");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/ui/dialog.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Dialog",
    ()=>Dialog,
    "DialogClose",
    ()=>DialogClose,
    "DialogContent",
    ()=>DialogContent,
    "DialogDescription",
    ()=>DialogDescription,
    "DialogFooter",
    ()=>DialogFooter,
    "DialogHeader",
    ()=>DialogHeader,
    "DialogOverlay",
    ()=>DialogOverlay,
    "DialogPortal",
    ()=>DialogPortal,
    "DialogProvider",
    ()=>DialogProvider,
    "DialogTitle",
    ()=>DialogTitle,
    "DialogTrigger",
    ()=>DialogTrigger
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dialog$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@radix-ui/react-dialog/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/x.js [app-client] (ecmascript) <export default as X>");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/utils.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$contexts$2f$modal$2d$context$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/contexts/modal-context.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
;
;
// Use the original Dialog component
const Dialog = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dialog$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Root"];
// Create a Context to pass ID through the Dialog component tree
const DialogContext = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createContext"]("");
// Provider component that accepts an ID
const DialogProvider = ({ id, children })=>{
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(DialogContext.Provider, {
        value: id,
        children: children
    }, void 0, false, {
        fileName: "[project]/components/ui/dialog.tsx",
        lineNumber: 18,
        columnNumber: 10
    }, ("TURBOPACK compile-time value", void 0));
};
_c = DialogProvider;
const DialogTrigger = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dialog$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Trigger"];
const DialogPortal = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dialog$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Portal"];
const DialogClose = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dialog$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Close"];
const DialogOverlay = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](({ className, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dialog$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Overlay"], {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("fixed inset-0 z-50 bg-black/50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/dialog.tsx",
        lineNumber: 31,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0)));
_c1 = DialogOverlay;
DialogOverlay.displayName = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dialog$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Overlay"].displayName;
const DialogContent = /*#__PURE__*/ _s(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](_c2 = _s(({ className, children, id: propId, open, ...props }, ref)=>{
    _s();
    // Always call useId unconditionally (React hooks rule)
    const generatedId = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useId"]();
    // Use either the prop id or the id from context
    const contextId = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useContext"](DialogContext);
    const id = propId || contextId || `dialog-${generatedId}`;
    // Register with our modal context using the open prop
    const { zIndex } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$contexts$2f$modal$2d$context$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useModal"])(id, !!open, 'dialog');
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(DialogPortal, {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(DialogOverlay, {
                style: {
                    zIndex: zIndex - 1
                }
            }, void 0, false, {
                fileName: "[project]/components/ui/dialog.tsx",
                lineNumber: 61,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dialog$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Content"], {
                ref: ref,
                className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("dialog-content fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg sm:rounded-lg", className),
                style: {
                    zIndex
                },
                ...props,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(DialogProvider, {
                    id: id,
                    children: [
                        children,
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dialog$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Close"], {
                            "aria-label": "Đóng",
                            className: "absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
                                    className: "h-4 w-4"
                                }, void 0, false, {
                                    fileName: "[project]/components/ui/dialog.tsx",
                                    lineNumber: 77,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "sr-only",
                                    children: "Đóng"
                                }, void 0, false, {
                                    fileName: "[project]/components/ui/dialog.tsx",
                                    lineNumber: 78,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/ui/dialog.tsx",
                            lineNumber: 73,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0))
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/ui/dialog.tsx",
                    lineNumber: 71,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0))
            }, void 0, false, {
                fileName: "[project]/components/ui/dialog.tsx",
                lineNumber: 62,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/components/ui/dialog.tsx",
        lineNumber: 59,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
}, "Uh/TpXHu/jA+i0Mwt6dQWUEXh+Y=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$contexts$2f$modal$2d$context$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useModal"]
    ];
})), "Uh/TpXHu/jA+i0Mwt6dQWUEXh+Y=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$contexts$2f$modal$2d$context$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useModal"]
    ];
});
_c3 = DialogContent;
DialogContent.displayName = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dialog$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Content"].displayName;
const DialogHeader = ({ className, ...props })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("flex flex-col space-y-1.5 text-center sm:text-left", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/dialog.tsx",
        lineNumber: 91,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0));
_c4 = DialogHeader;
DialogHeader.displayName = "DialogHeader";
const DialogFooter = ({ className, ...props })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/dialog.tsx",
        lineNumber: 105,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0));
_c5 = DialogFooter;
DialogFooter.displayName = "DialogFooter";
const DialogTitle = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](_c6 = ({ className, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dialog$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Title"], {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("text-lg font-semibold leading-none tracking-tight", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/dialog.tsx",
        lineNumber: 119,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0)));
_c7 = DialogTitle;
DialogTitle.displayName = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dialog$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Title"].displayName;
const DialogDescription = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](_c8 = ({ className, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dialog$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Description"], {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("text-sm text-muted-foreground", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/dialog.tsx",
        lineNumber: 134,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0)));
_c9 = DialogDescription;
DialogDescription.displayName = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$dialog$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Description"].displayName;
;
var _c, _c1, _c2, _c3, _c4, _c5, _c6, _c7, _c8, _c9;
__turbopack_context__.k.register(_c, "DialogProvider");
__turbopack_context__.k.register(_c1, "DialogOverlay");
__turbopack_context__.k.register(_c2, "DialogContent$React.forwardRef");
__turbopack_context__.k.register(_c3, "DialogContent");
__turbopack_context__.k.register(_c4, "DialogHeader");
__turbopack_context__.k.register(_c5, "DialogFooter");
__turbopack_context__.k.register(_c6, "DialogTitle$React.forwardRef");
__turbopack_context__.k.register(_c7, "DialogTitle");
__turbopack_context__.k.register(_c8, "DialogDescription$React.forwardRef");
__turbopack_context__.k.register(_c9, "DialogDescription");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/ui/command.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Command",
    ()=>Command,
    "CommandDialog",
    ()=>CommandDialog,
    "CommandEmpty",
    ()=>CommandEmpty,
    "CommandGroup",
    ()=>CommandGroup,
    "CommandInput",
    ()=>CommandInput,
    "CommandItem",
    ()=>CommandItem,
    "CommandList",
    ()=>CommandList,
    "CommandSeparator",
    ()=>CommandSeparator,
    "CommandShortcut",
    ()=>CommandShortcut
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$cmdk$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/cmdk/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$search$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Search$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/search.js [app-client] (ecmascript) <export default as Search>");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/utils.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/dialog.tsx [app-client] (ecmascript)");
;
;
;
;
;
;
const Command = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](({ className, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$cmdk$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Command"], {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("flex h-full w-full flex-col overflow-hidden rounded-md bg-popover text-popover-foreground", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/command.tsx",
        lineNumber: 13,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0)));
_c = Command;
Command.displayName = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$cmdk$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Command"].displayName;
const CommandDialog = ({ children, ...props })=>{
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Dialog"], {
        ...props,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DialogContent"], {
            className: "overflow-hidden p-0 shadow-lg",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Command, {
                className: "[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground [&_[cmdk-group]:not([hidden])_~[cmdk-group]]:pt-0 [&_[cmdk-group]]:px-2 [&_[cmdk-input-wrapper]_svg]:h-5 [&_[cmdk-input-wrapper]_svg]:w-5 [&_[cmdk-input]]:h-12 [&_[cmdk-item]]:px-2 [&_[cmdk-item]]:py-3 [&_[cmdk-item]_svg]:h-5 [&_[cmdk-item]_svg]:w-5",
                children: children
            }, void 0, false, {
                fileName: "[project]/components/ui/command.tsx",
                lineNumber: 28,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0))
        }, void 0, false, {
            fileName: "[project]/components/ui/command.tsx",
            lineNumber: 27,
            columnNumber: 7
        }, ("TURBOPACK compile-time value", void 0))
    }, void 0, false, {
        fileName: "[project]/components/ui/command.tsx",
        lineNumber: 26,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
_c1 = CommandDialog;
const CommandInput = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](_c2 = ({ className, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex items-center border-b px-3",
        "cmdk-input-wrapper": "",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$search$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Search$3e$__["Search"], {
                className: "mr-2 h-4 w-4 shrink-0 opacity-50"
            }, void 0, false, {
                fileName: "[project]/components/ui/command.tsx",
                lineNumber: 41,
                columnNumber: 5
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$cmdk$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Command"].Input, {
                ref: ref,
                className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50", className),
                ...props
            }, void 0, false, {
                fileName: "[project]/components/ui/command.tsx",
                lineNumber: 42,
                columnNumber: 5
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/components/ui/command.tsx",
        lineNumber: 40,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0)));
_c3 = CommandInput;
CommandInput.displayName = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$cmdk$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Command"].Input.displayName;
const CommandList = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](_c4 = ({ className, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$cmdk$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Command"].List, {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("max-h-[300px] overflow-y-auto overflow-x-hidden", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/command.tsx",
        lineNumber: 59,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0)));
_c5 = CommandList;
CommandList.displayName = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$cmdk$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Command"].List.displayName;
const CommandEmpty = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](_c6 = (props, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$cmdk$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Command"].Empty, {
        ref: ref,
        className: "py-6 text-center text-sm",
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/command.tsx",
        lineNumber: 72,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0)));
_c7 = CommandEmpty;
CommandEmpty.displayName = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$cmdk$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Command"].Empty.displayName;
const CommandGroup = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](_c8 = ({ className, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$cmdk$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Command"].Group, {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("overflow-hidden p-1 text-foreground [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/command.tsx",
        lineNumber: 85,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0)));
_c9 = CommandGroup;
CommandGroup.displayName = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$cmdk$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Command"].Group.displayName;
const CommandSeparator = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](_c10 = ({ className, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$cmdk$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Command"].Separator, {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("-mx-1 h-px bg-border", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/command.tsx",
        lineNumber: 101,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0)));
_c11 = CommandSeparator;
CommandSeparator.displayName = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$cmdk$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Command"].Separator.displayName;
const CommandItem = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](_c12 = ({ className, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$cmdk$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Command"].Item, {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("relative flex cursor-default gap-2 select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none data-[disabled=true]:pointer-events-none data-[selected='true']:bg-accent data-[selected=true]:text-accent-foreground data-[disabled=true]:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/command.tsx",
        lineNumber: 113,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0)));
_c13 = CommandItem;
CommandItem.displayName = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$cmdk$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Command"].Item.displayName;
const CommandShortcut = ({ className, ...props })=>{
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("ml-auto text-xs tracking-widest text-muted-foreground", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/command.tsx",
        lineNumber: 130,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
_c14 = CommandShortcut;
CommandShortcut.displayName = "CommandShortcut";
;
var _c, _c1, _c2, _c3, _c4, _c5, _c6, _c7, _c8, _c9, _c10, _c11, _c12, _c13, _c14;
__turbopack_context__.k.register(_c, "Command");
__turbopack_context__.k.register(_c1, "CommandDialog");
__turbopack_context__.k.register(_c2, "CommandInput$React.forwardRef");
__turbopack_context__.k.register(_c3, "CommandInput");
__turbopack_context__.k.register(_c4, "CommandList$React.forwardRef");
__turbopack_context__.k.register(_c5, "CommandList");
__turbopack_context__.k.register(_c6, "CommandEmpty$React.forwardRef");
__turbopack_context__.k.register(_c7, "CommandEmpty");
__turbopack_context__.k.register(_c8, "CommandGroup$React.forwardRef");
__turbopack_context__.k.register(_c9, "CommandGroup");
__turbopack_context__.k.register(_c10, "CommandSeparator$React.forwardRef");
__turbopack_context__.k.register(_c11, "CommandSeparator");
__turbopack_context__.k.register(_c12, "CommandItem$React.forwardRef");
__turbopack_context__.k.register(_c13, "CommandItem");
__turbopack_context__.k.register(_c14, "CommandShortcut");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/ui/popover.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Popover",
    ()=>Popover,
    "PopoverContent",
    ()=>PopoverContent,
    "PopoverProvider",
    ()=>PopoverProvider,
    "PopoverTrigger",
    ()=>PopoverTrigger
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$popover$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@radix-ui/react-popover/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/utils.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$contexts$2f$modal$2d$context$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/contexts/modal-context.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
const Popover = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$popover$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Root"];
const PopoverTrigger = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$popover$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Trigger"];
// Context to pass popover ID through the component tree
const PopoverContext = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createContext"]("");
// Provider component that accepts an ID
const PopoverProvider = ({ id, children })=>{
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(PopoverContext.Provider, {
        value: id,
        children: children
    }, void 0, false, {
        fileName: "[project]/components/ui/popover.tsx",
        lineNumber: 18,
        columnNumber: 10
    }, ("TURBOPACK compile-time value", void 0));
};
_c = PopoverProvider;
const PopoverContent = /*#__PURE__*/ _s(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](_c1 = _s(({ className, align = "center", sideOffset = 4, id: propId, ...props }, ref)=>{
    _s();
    // Always call useId unconditionally (React hooks rule)
    const generatedId = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useId"]();
    // Use either the prop id or the id from context
    const contextId = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useContext"](PopoverContext);
    const id = propId || contextId || `popover-${generatedId}`;
    // Get open state from props
    const [open, setOpen] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"](false);
    const dataState = props["data-state"];
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"]({
        "PopoverContent.useEffect": ()=>{
            if (dataState === "open") {
                setOpen(true);
            } else {
                setOpen(false);
            }
        }
    }["PopoverContent.useEffect"], [
        dataState
    ]);
    // Register with our modal context
    const { zIndex } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$contexts$2f$modal$2d$context$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useModal"])(id, open, 'popover');
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$popover$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Portal"], {
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$popover$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Content"], {
            ref: ref,
            align: align,
            sideOffset: sideOffset,
            className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("w-72 rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-none transition-opacity duration-200 opacity-0 data-[state=open]:opacity-100 data-[state=closed]:opacity-0", className),
            style: {
                zIndex
            },
            ...props,
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(PopoverProvider, {
                id: id,
                children: props.children
            }, void 0, false, {
                fileName: "[project]/components/ui/popover.tsx",
                lineNumber: 60,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0))
        }, void 0, false, {
            fileName: "[project]/components/ui/popover.tsx",
            lineNumber: 49,
            columnNumber: 7
        }, ("TURBOPACK compile-time value", void 0))
    }, void 0, false, {
        fileName: "[project]/components/ui/popover.tsx",
        lineNumber: 48,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
}, "ZBFOo/9aj1++uwpq2sH6qLwyHa0=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$contexts$2f$modal$2d$context$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useModal"]
    ];
})), "ZBFOo/9aj1++uwpq2sH6qLwyHa0=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$contexts$2f$modal$2d$context$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useModal"]
    ];
});
_c2 = PopoverContent;
PopoverContent.displayName = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$popover$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Content"].displayName;
;
var _c, _c1, _c2;
__turbopack_context__.k.register(_c, "PopoverProvider");
__turbopack_context__.k.register(_c1, "PopoverContent$React.forwardRef");
__turbopack_context__.k.register(_c2, "PopoverContent");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/ui/separator.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Separator",
    ()=>Separator
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$separator$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@radix-ui/react-separator/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/utils.ts [app-client] (ecmascript)");
"use client";
;
;
;
;
const Separator = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](_c = ({ className, orientation = "horizontal", decorative = true, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$separator$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Root"], {
        ref: ref,
        decorative: decorative,
        orientation: orientation,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("shrink-0 bg-border", orientation === "horizontal" ? "h-[1px] w-full" : "h-full w-[1px]", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/separator.tsx",
        lineNumber: 16,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0)));
_c1 = Separator;
Separator.displayName = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$separator$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Root"].displayName;
;
var _c, _c1;
__turbopack_context__.k.register(_c, "Separator$React.forwardRef");
__turbopack_context__.k.register(_c1, "Separator");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/data-table/data-table-faceted-filter.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "DataTableFacetedFilter",
    ()=>DataTableFacetedFilter
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Check$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/check.js [app-client] (ecmascript) <export default as Check>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$plus$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__PlusCircle$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/circle-plus.js [app-client] (ecmascript) <export default as PlusCircle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/utils.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$badge$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/badge.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/button.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$command$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/command.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$popover$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/popover.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$separator$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/separator.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$contexts$2f$modal$2d$context$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/contexts/modal-context.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
;
;
;
;
;
;
;
;
;
function DataTableFacetedFilter({ title, options, selectedValues, onSelectedValuesChange }) {
    _s();
    const [isOpen, setIsOpen] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"](false);
    const modalId = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useId"]();
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$contexts$2f$modal$2d$context$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useModal"])(modalId, isOpen);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$popover$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Popover"], {
        open: isOpen,
        onOpenChange: setIsOpen,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$popover$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PopoverTrigger"], {
                asChild: true,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                    variant: "outline",
                    size: "sm",
                    className: "border-dashed flex items-center px-3 text-sm w-full sm:w-auto justify-start",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$plus$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__PlusCircle$3e$__["PlusCircle"], {
                            className: "mr-1.5 h-3.5 w-3.5 flex-shrink-0"
                        }, void 0, false, {
                            fileName: "[project]/components/data-table/data-table-faceted-filter.tsx",
                            lineNumber: 53,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "truncate",
                            children: title
                        }, void 0, false, {
                            fileName: "[project]/components/data-table/data-table-faceted-filter.tsx",
                            lineNumber: 54,
                            columnNumber: 11
                        }, this),
                        selectedValues.size > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$separator$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Separator"], {
                                    orientation: "vertical",
                                    className: "mx-1.5 h-3.5"
                                }, void 0, false, {
                                    fileName: "[project]/components/data-table/data-table-faceted-filter.tsx",
                                    lineNumber: 57,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$badge$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Badge"], {
                                    variant: "secondary",
                                    className: "rounded-sm px-1 font-normal text-xs sm:hidden ml-auto",
                                    children: selectedValues.size
                                }, void 0, false, {
                                    fileName: "[project]/components/data-table/data-table-faceted-filter.tsx",
                                    lineNumber: 58,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "hidden space-x-1 sm:flex",
                                    children: selectedValues.size > 2 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$badge$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Badge"], {
                                        variant: "secondary",
                                        className: "rounded-sm px-1 font-normal text-xs",
                                        children: [
                                            selectedValues.size,
                                            " selected"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/data-table/data-table-faceted-filter.tsx",
                                        lineNumber: 66,
                                        columnNumber: 19
                                    }, this) : options.filter((option)=>selectedValues.has(option.value)).map((option)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$badge$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Badge"], {
                                            variant: "secondary",
                                            className: "rounded-sm px-1 font-normal text-xs",
                                            children: option.label
                                        }, option.value, false, {
                                            fileName: "[project]/components/data-table/data-table-faceted-filter.tsx",
                                            lineNumber: 76,
                                            columnNumber: 23
                                        }, this))
                                }, void 0, false, {
                                    fileName: "[project]/components/data-table/data-table-faceted-filter.tsx",
                                    lineNumber: 64,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/data-table/data-table-faceted-filter.tsx",
                    lineNumber: 48,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/components/data-table/data-table-faceted-filter.tsx",
                lineNumber: 47,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$popover$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PopoverContent"], {
                className: "w-[200px] p-0",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$command$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Command"], {
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$command$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CommandInput"], {
                            placeholder: title
                        }, void 0, false, {
                            fileName: "[project]/components/data-table/data-table-faceted-filter.tsx",
                            lineNumber: 93,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$command$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CommandList"], {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$command$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CommandEmpty"], {
                                    children: "No results found."
                                }, void 0, false, {
                                    fileName: "[project]/components/data-table/data-table-faceted-filter.tsx",
                                    lineNumber: 95,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$command$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CommandGroup"], {
                                    children: options.map((option)=>{
                                        const isSelected = selectedValues.has(option.value);
                                        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$command$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CommandItem"], {
                                            onSelect: ()=>{
                                                const newSelectedValues = new Set(selectedValues);
                                                if (isSelected) {
                                                    newSelectedValues.delete(option.value);
                                                } else {
                                                    newSelectedValues.add(option.value);
                                                }
                                                onSelectedValuesChange(newSelectedValues);
                                            },
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary", isSelected ? "bg-primary text-primary-foreground" : "opacity-50 [&_svg]:invisible"),
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Check$3e$__["Check"], {
                                                        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("h-4 w-4")
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/data-table/data-table-faceted-filter.tsx",
                                                        lineNumber: 120,
                                                        columnNumber: 23
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/components/data-table/data-table-faceted-filter.tsx",
                                                    lineNumber: 112,
                                                    columnNumber: 21
                                                }, this),
                                                option.icon && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(option.icon, {
                                                    className: "mr-2 h-4 w-4 text-muted-foreground"
                                                }, void 0, false, {
                                                    fileName: "[project]/components/data-table/data-table-faceted-filter.tsx",
                                                    lineNumber: 123,
                                                    columnNumber: 23
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    children: option.label
                                                }, void 0, false, {
                                                    fileName: "[project]/components/data-table/data-table-faceted-filter.tsx",
                                                    lineNumber: 125,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, option.value, true, {
                                            fileName: "[project]/components/data-table/data-table-faceted-filter.tsx",
                                            lineNumber: 100,
                                            columnNumber: 19
                                        }, this);
                                    })
                                }, void 0, false, {
                                    fileName: "[project]/components/data-table/data-table-faceted-filter.tsx",
                                    lineNumber: 96,
                                    columnNumber: 13
                                }, this),
                                selectedValues.size > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$command$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CommandSeparator"], {}, void 0, false, {
                                            fileName: "[project]/components/data-table/data-table-faceted-filter.tsx",
                                            lineNumber: 132,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$command$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CommandGroup"], {
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$command$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CommandItem"], {
                                                onSelect: ()=>onSelectedValuesChange(new Set()),
                                                className: "justify-center text-center",
                                                children: "Clear filters"
                                            }, void 0, false, {
                                                fileName: "[project]/components/data-table/data-table-faceted-filter.tsx",
                                                lineNumber: 134,
                                                columnNumber: 19
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/components/data-table/data-table-faceted-filter.tsx",
                                            lineNumber: 133,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/data-table/data-table-faceted-filter.tsx",
                            lineNumber: 94,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/data-table/data-table-faceted-filter.tsx",
                    lineNumber: 92,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/components/data-table/data-table-faceted-filter.tsx",
                lineNumber: 91,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/data-table/data-table-faceted-filter.tsx",
        lineNumber: 46,
        columnNumber: 5
    }, this);
}
_s(DataTableFacetedFilter, "IEMF1JTJbgbu9m4W+wVPwoqZoF4=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$contexts$2f$modal$2d$context$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useModal"]
    ];
});
_c = DataTableFacetedFilter;
var _c;
__turbopack_context__.k.register(_c, "DataTableFacetedFilter");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/ui/label.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Label",
    ()=>Label
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$label$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@radix-ui/react-label/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$class$2d$variance$2d$authority$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/class-variance-authority/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/utils.ts [app-client] (ecmascript)");
;
;
;
;
;
const labelVariants = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$class$2d$variance$2d$authority$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cva"])("text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70");
const Label = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](_c = ({ className, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$label$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Root"], {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])(labelVariants(), className),
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/label.tsx",
        lineNumber: 16,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0)));
_c1 = Label;
Label.displayName = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$label$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Root"].displayName;
;
var _c, _c1;
__turbopack_context__.k.register(_c, "Label$React.forwardRef");
__turbopack_context__.k.register(_c1, "Label");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/data-table/data-table-column-toggle.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "DataTableColumnCustomizer",
    ()=>DataTableColumnCustomizer
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$settings$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Settings2$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/settings-2.js [app-client] (ecmascript) <export default as Settings2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$search$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Search$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/search.js [app-client] (ecmascript) <export default as Search>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/x.js [app-client] (ecmascript) <export default as X>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$pin$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Pin$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/pin.js [app-client] (ecmascript) <export default as Pin>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$grip$2d$vertical$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__GripVertical$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/grip-vertical.js [app-client] (ecmascript) <export default as GripVertical>");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/button.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$checkbox$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/checkbox.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/input.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$label$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/label.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/dialog.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$scroll$2d$area$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/scroll-area.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/utils.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$separator$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/separator.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$dnd$2d$kit$2f$core$2f$dist$2f$core$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@dnd-kit/core/dist/core.esm.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$dnd$2d$kit$2f$sortable$2f$dist$2f$sortable$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@dnd-kit/sortable/dist/sortable.esm.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$dnd$2d$kit$2f$utilities$2f$dist$2f$utilities$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@dnd-kit/utilities/dist/utilities.esm.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
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
function DataTableColumnCustomizer({ children, columns, columnVisibility, setColumnVisibility, columnOrder, setColumnOrder, pinnedColumns, setPinnedColumns, onResetToDefault }) {
    _s();
    var _s1 = __turbopack_context__.k.signature();
    const [open, setOpen] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"](false);
    // Local state for changes within the dialog
    const [localVisibility, setLocalVisibility] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"]({});
    const [localOrder, setLocalOrder] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"]([]);
    const [localPinned, setLocalPinned] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"]([]);
    const [search, setSearch] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"]('');
    // @dnd-kit sensors
    const sensors = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$dnd$2d$kit$2f$core$2f$dist$2f$core$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSensors"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$dnd$2d$kit$2f$core$2f$dist$2f$core$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSensor"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$dnd$2d$kit$2f$core$2f$dist$2f$core$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PointerSensor"], {
        activationConstraint: {
            distance: 8
        }
    }), (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$dnd$2d$kit$2f$core$2f$dist$2f$core$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSensor"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$dnd$2d$kit$2f$core$2f$dist$2f$core$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["KeyboardSensor"], {
        coordinateGetter: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$dnd$2d$kit$2f$sortable$2f$dist$2f$sortable$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["sortableKeyboardCoordinates"]
    }));
    const allConfigurableColumns = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"]({
        "DataTableColumnCustomizer.useMemo[allConfigurableColumns]": ()=>columns.filter({
                "DataTableColumnCustomizer.useMemo[allConfigurableColumns]": (c)=>c.id !== 'select' && c.id !== 'actions' && c.id !== 'control' && c.id !== 'expander'
            }["DataTableColumnCustomizer.useMemo[allConfigurableColumns]"])
    }["DataTableColumnCustomizer.useMemo[allConfigurableColumns]"], [
        columns
    ]);
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"]({
        "DataTableColumnCustomizer.useEffect": ()=>{
            if (open) {
                // On open, sync local state with props
                // ✅ FIX: Đảm bảo TẤT CẢ columns có trong localVisibility (không bị undefined)
                const fullVisibility = {};
                allConfigurableColumns.forEach({
                    "DataTableColumnCustomizer.useEffect": (col)=>{
                        // Nếu columnVisibility có giá trị → dùng giá trị đó
                        // Nếu không → mặc định false (ẩn)
                        fullVisibility[col.id] = columnVisibility[col.id] ?? false;
                    }
                }["DataTableColumnCustomizer.useEffect"]);
                setLocalVisibility(fullVisibility);
                setLocalPinned(pinnedColumns);
                const allIds = allConfigurableColumns.map({
                    "DataTableColumnCustomizer.useEffect.allIds": (c)=>c.id
                }["DataTableColumnCustomizer.useEffect.allIds"]);
                const currentOrder = columnOrder.filter({
                    "DataTableColumnCustomizer.useEffect.currentOrder": (id)=>allIds.includes(id)
                }["DataTableColumnCustomizer.useEffect.currentOrder"]);
                const newIds = allIds.filter({
                    "DataTableColumnCustomizer.useEffect.newIds": (id)=>!currentOrder.includes(id)
                }["DataTableColumnCustomizer.useEffect.newIds"]);
                setLocalOrder([
                    ...currentOrder,
                    ...newIds
                ]);
                setSearch('');
            }
        }
    }["DataTableColumnCustomizer.useEffect"], [
        open,
        columnVisibility,
        columnOrder,
        pinnedColumns,
        allConfigurableColumns
    ]);
    const handleSave = ()=>{
        // ✅ FIX: Merge localVisibility với columnVisibility, giữ nguyên select & actions
        setColumnVisibility((_prev)=>({
                ...localVisibility,
                select: true,
                actions: true
            }));
        setColumnOrder(localOrder);
        setPinnedColumns(localPinned);
        setOpen(false);
    };
    const handleReset = ()=>{
        if (onResetToDefault) {
            onResetToDefault();
            return;
        }
        const defaultVisibleColumns = [
            'id',
            'fullName',
            'workEmail',
            'phone',
            'department',
            'jobTitle',
            'hireDate',
            'employmentStatus'
        ];
        const initialVisibility = {};
        allConfigurableColumns.forEach((c)=>{
            initialVisibility[c.id] = defaultVisibleColumns.includes(c.id);
        });
        setLocalVisibility(initialVisibility);
        setLocalOrder(columns.map((c)=>c.id).filter(Boolean));
        setLocalPinned([
            'id'
        ]);
    };
    const toggleColumnVisibility = (colId, checked)=>{
        setLocalVisibility((prev)=>({
                ...prev,
                [colId]: checked
            }));
    };
    const togglePin = (colId)=>{
        setLocalPinned((prev)=>prev.includes(colId) ? prev.filter((id)=>id !== colId) : [
                ...prev,
                colId
            ]);
    };
    const availableColumns = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"]({
        "DataTableColumnCustomizer.useMemo[availableColumns]": ()=>allConfigurableColumns.filter({
                "DataTableColumnCustomizer.useMemo[availableColumns]": (c)=>!localVisibility[c.id] && (c.meta?.displayName ?? c.id).toLowerCase().includes(search.toLowerCase())
            }["DataTableColumnCustomizer.useMemo[availableColumns]"])
    }["DataTableColumnCustomizer.useMemo[availableColumns]"], [
        allConfigurableColumns,
        localVisibility,
        search
    ]);
    const { pinnedVisibleColumns, unpinnedVisibleColumns } = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"]({
        "DataTableColumnCustomizer.useMemo": ()=>{
            const visibleCols = localOrder.map({
                "DataTableColumnCustomizer.useMemo.visibleCols": (id)=>allConfigurableColumns.find({
                        "DataTableColumnCustomizer.useMemo.visibleCols": (c)=>c.id === id
                    }["DataTableColumnCustomizer.useMemo.visibleCols"])
            }["DataTableColumnCustomizer.useMemo.visibleCols"]).filter({
                "DataTableColumnCustomizer.useMemo.visibleCols": (c)=>!!c && localVisibility[c.id]
            }["DataTableColumnCustomizer.useMemo.visibleCols"]);
            const pinned = visibleCols.filter({
                "DataTableColumnCustomizer.useMemo.pinned": (c)=>localPinned.includes(c.id)
            }["DataTableColumnCustomizer.useMemo.pinned"]);
            const unpinned = visibleCols.filter({
                "DataTableColumnCustomizer.useMemo.unpinned": (c)=>!localPinned.includes(c.id)
            }["DataTableColumnCustomizer.useMemo.unpinned"]);
            return {
                pinnedVisibleColumns: pinned,
                unpinnedVisibleColumns: unpinned
            };
        }
    }["DataTableColumnCustomizer.useMemo"], [
        localOrder,
        localPinned,
        localVisibility,
        allConfigurableColumns
    ]);
    const groupedAvailableColumns = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"]({
        "DataTableColumnCustomizer.useMemo[groupedAvailableColumns]": ()=>{
            return availableColumns.reduce({
                "DataTableColumnCustomizer.useMemo[groupedAvailableColumns]": (groups, col)=>{
                    const groupName = col.meta?.group || 'Thông tin khác';
                    if (!groups[groupName]) {
                        groups[groupName] = [];
                    }
                    groups[groupName].push(col);
                    return groups;
                }
            }["DataTableColumnCustomizer.useMemo[groupedAvailableColumns]"], {});
        }
    }["DataTableColumnCustomizer.useMemo[groupedAvailableColumns]"], [
        availableColumns
    ]);
    const handleDragEnd = (event)=>{
        const { active, over } = event;
        if (!over || active.id === over.id) return;
        const activeId = active.id;
        const overId = over.id;
        // Check if both are in same group (pinned or unpinned)
        const isActivePinned = localPinned.includes(activeId);
        const isOverPinned = localPinned.includes(overId);
        if (isActivePinned !== isOverPinned) return;
        setLocalOrder((items)=>{
            const oldIndex = items.indexOf(activeId);
            const newIndex = items.indexOf(overId);
            if (oldIndex === -1 || newIndex === -1) return items;
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$dnd$2d$kit$2f$sortable$2f$dist$2f$sortable$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["arrayMove"])(items, oldIndex, newIndex);
        });
    };
    const SortableColumnItem = ({ col })=>{
        _s1();
        const { attributes, listeners, setNodeRef, transform, transition, isDragging } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$dnd$2d$kit$2f$sortable$2f$dist$2f$sortable$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSortable"])({
            id: col.id
        });
        const style = {
            transform: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$dnd$2d$kit$2f$utilities$2f$dist$2f$utilities$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CSS"].Transform.toString(transform),
            transition
        };
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            ref: setNodeRef,
            style: style,
            className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("flex items-center p-2 rounded-md group", isDragging ? 'opacity-50' : 'hover:bg-muted/50'),
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    ...attributes,
                    ...listeners,
                    className: "cursor-grab active:cursor-grabbing touch-none",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$grip$2d$vertical$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__GripVertical$3e$__["GripVertical"], {
                        className: "h-5 w-5 mr-2 text-muted-foreground"
                    }, void 0, false, {
                        fileName: "[project]/components/data-table/data-table-column-toggle.tsx",
                        lineNumber: 237,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/components/data-table/data-table-column-toggle.tsx",
                    lineNumber: 232,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                    className: "flex-grow text-sm",
                    children: col.meta?.displayName ?? col.id
                }, void 0, false, {
                    fileName: "[project]/components/data-table/data-table-column-toggle.tsx",
                    lineNumber: 239,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                    variant: "ghost",
                    size: "icon",
                    className: "h-7 w-7",
                    onClick: ()=>togglePin(col.id),
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$pin$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Pin$3e$__["Pin"], {
                        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("h-4 w-4", localPinned.includes(col.id) ? "text-primary fill-current" : "text-muted-foreground")
                    }, void 0, false, {
                        fileName: "[project]/components/data-table/data-table-column-toggle.tsx",
                        lineNumber: 247,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/components/data-table/data-table-column-toggle.tsx",
                    lineNumber: 241,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                    variant: "ghost",
                    size: "icon",
                    className: "h-7 w-7 text-muted-foreground hover:text-destructive",
                    onClick: ()=>toggleColumnVisibility(col.id, false),
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
                        className: "h-4 w-4"
                    }, void 0, false, {
                        fileName: "[project]/components/data-table/data-table-column-toggle.tsx",
                        lineNumber: 255,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/components/data-table/data-table-column-toggle.tsx",
                    lineNumber: 249,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/components/data-table/data-table-column-toggle.tsx",
            lineNumber: 224,
            columnNumber: 7
        }, this);
    };
    _s1(SortableColumnItem, "zfYsXk183s9wPgtHlnuIh3ss26Y=", false, function() {
        return [
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$dnd$2d$kit$2f$sortable$2f$dist$2f$sortable$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSortable"]
        ];
    });
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Dialog"], {
        open: open,
        onOpenChange: setOpen,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DialogTrigger"], {
                asChild: true,
                children: children || /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                    variant: "outline",
                    size: "sm",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$settings$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Settings2$3e$__["Settings2"], {
                            className: "mr-2 h-4 w-4"
                        }, void 0, false, {
                            fileName: "[project]/components/data-table/data-table-column-toggle.tsx",
                            lineNumber: 266,
                            columnNumber: 13
                        }, this),
                        "Điều chỉnh cột"
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/data-table/data-table-column-toggle.tsx",
                    lineNumber: 265,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/components/data-table/data-table-column-toggle.tsx",
                lineNumber: 263,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DialogContent"], {
                className: "max-w-3xl h-[75vh] flex flex-col",
                open: open,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DialogHeader"], {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DialogTitle"], {
                                children: "Điều chỉnh cột hiển thị"
                            }, void 0, false, {
                                fileName: "[project]/components/data-table/data-table-column-toggle.tsx",
                                lineNumber: 273,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DialogDescription"], {
                                children: "Chọn, sắp xếp và ghim các cột để tùy chỉnh giao diện bảng của bạn."
                            }, void 0, false, {
                                fileName: "[project]/components/data-table/data-table-column-toggle.tsx",
                                lineNumber: 274,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/data-table/data-table-column-toggle.tsx",
                        lineNumber: 272,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex flex-col md:flex-row gap-6 flex-grow min-h-0",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex flex-col border rounded-lg flex-1 min-h-0",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "p-4 border-b",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                className: "font-semibold mb-2",
                                                children: "Thêm cột hiển thị"
                                            }, void 0, false, {
                                                fileName: "[project]/components/data-table/data-table-column-toggle.tsx",
                                                lineNumber: 282,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "relative",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$search$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Search$3e$__["Search"], {
                                                        className: "absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/data-table/data-table-column-toggle.tsx",
                                                        lineNumber: 284,
                                                        columnNumber: 25
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Input"], {
                                                        placeholder: "Tìm kiếm cột...",
                                                        className: "w-full pl-8 h-9",
                                                        value: search,
                                                        onChange: (e)=>setSearch(e.target.value)
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/data-table/data-table-column-toggle.tsx",
                                                        lineNumber: 285,
                                                        columnNumber: 25
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/components/data-table/data-table-column-toggle.tsx",
                                                lineNumber: 283,
                                                columnNumber: 21
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/data-table/data-table-column-toggle.tsx",
                                        lineNumber: 281,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$scroll$2d$area$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ScrollArea"], {
                                        className: "flex-grow p-4",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "space-y-4",
                                            children: [
                                                Object.keys(groupedAvailableColumns).map((groupName)=>{
                                                    const cols = groupedAvailableColumns[groupName];
                                                    if (!Array.isArray(cols) || cols.length === 0) return null;
                                                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                                                className: "text-sm font-semibold mb-2 text-muted-foreground",
                                                                children: groupName
                                                            }, void 0, false, {
                                                                fileName: "[project]/components/data-table/data-table-column-toggle.tsx",
                                                                lineNumber: 300,
                                                                columnNumber: 37
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "space-y-2",
                                                                children: cols.map((col)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: "flex items-center space-x-2",
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$checkbox$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Checkbox"], {
                                                                                id: `add-${col.id}`,
                                                                                checked: localVisibility[col.id] || false,
                                                                                onCheckedChange: (checked)=>toggleColumnVisibility(col.id, !!checked)
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/components/data-table/data-table-column-toggle.tsx",
                                                                                lineNumber: 304,
                                                                                columnNumber: 45
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$label$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Label"], {
                                                                                htmlFor: `add-${col.id}`,
                                                                                className: "font-normal text-sm",
                                                                                children: col.meta?.displayName ?? col.id
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/components/data-table/data-table-column-toggle.tsx",
                                                                                lineNumber: 309,
                                                                                columnNumber: 45
                                                                            }, this)
                                                                        ]
                                                                    }, col.id, true, {
                                                                        fileName: "[project]/components/data-table/data-table-column-toggle.tsx",
                                                                        lineNumber: 303,
                                                                        columnNumber: 41
                                                                    }, this))
                                                            }, void 0, false, {
                                                                fileName: "[project]/components/data-table/data-table-column-toggle.tsx",
                                                                lineNumber: 301,
                                                                columnNumber: 37
                                                            }, this)
                                                        ]
                                                    }, groupName, true, {
                                                        fileName: "[project]/components/data-table/data-table-column-toggle.tsx",
                                                        lineNumber: 299,
                                                        columnNumber: 33
                                                    }, this);
                                                }),
                                                availableColumns.length === 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-sm text-muted-foreground text-center py-4",
                                                    children: "Không có cột nào."
                                                }, void 0, false, {
                                                    fileName: "[project]/components/data-table/data-table-column-toggle.tsx",
                                                    lineNumber: 317,
                                                    columnNumber: 29
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/data-table/data-table-column-toggle.tsx",
                                            lineNumber: 294,
                                            columnNumber: 21
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/components/data-table/data-table-column-toggle.tsx",
                                        lineNumber: 293,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/data-table/data-table-column-toggle.tsx",
                                lineNumber: 280,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex flex-col border rounded-lg flex-1 min-h-0",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "p-4 border-b",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                            className: "font-semibold",
                                            children: "Cột hiển thị"
                                        }, void 0, false, {
                                            fileName: "[project]/components/data-table/data-table-column-toggle.tsx",
                                            lineNumber: 325,
                                            columnNumber: 21
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/components/data-table/data-table-column-toggle.tsx",
                                        lineNumber: 324,
                                        columnNumber: 18
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$scroll$2d$area$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ScrollArea"], {
                                        className: "flex-grow p-2",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$dnd$2d$kit$2f$core$2f$dist$2f$core$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DndContext"], {
                                            sensors: sensors,
                                            collisionDetection: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$dnd$2d$kit$2f$core$2f$dist$2f$core$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["closestCenter"],
                                            onDragEnd: handleDragEnd,
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "space-y-1",
                                                children: [
                                                    pinnedVisibleColumns.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$dnd$2d$kit$2f$sortable$2f$dist$2f$sortable$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SortableContext"], {
                                                        items: pinnedVisibleColumns.map((c)=>c.id),
                                                        strategy: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$dnd$2d$kit$2f$sortable$2f$dist$2f$sortable$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["verticalListSortingStrategy"],
                                                        children: pinnedVisibleColumns.map((col)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(SortableColumnItem, {
                                                                col: col
                                                            }, col.id, false, {
                                                                fileName: "[project]/components/data-table/data-table-column-toggle.tsx",
                                                                lineNumber: 341,
                                                                columnNumber: 31
                                                            }, this))
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/data-table/data-table-column-toggle.tsx",
                                                        lineNumber: 336,
                                                        columnNumber: 27
                                                    }, this),
                                                    pinnedVisibleColumns.length > 0 && unpinnedVisibleColumns.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "relative my-2 mx-2",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$separator$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Separator"], {}, void 0, false, {
                                                                fileName: "[project]/components/data-table/data-table-column-toggle.tsx",
                                                                lineNumber: 348,
                                                                columnNumber: 33
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "absolute left-1/2 -translate-x-1/2 -top-2 text-xs bg-popover px-2 text-muted-foreground",
                                                                children: "Ghim"
                                                            }, void 0, false, {
                                                                fileName: "[project]/components/data-table/data-table-column-toggle.tsx",
                                                                lineNumber: 349,
                                                                columnNumber: 33
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/components/data-table/data-table-column-toggle.tsx",
                                                        lineNumber: 347,
                                                        columnNumber: 29
                                                    }, this),
                                                    unpinnedVisibleColumns.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$dnd$2d$kit$2f$sortable$2f$dist$2f$sortable$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SortableContext"], {
                                                        items: unpinnedVisibleColumns.map((c)=>c.id),
                                                        strategy: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$dnd$2d$kit$2f$sortable$2f$dist$2f$sortable$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["verticalListSortingStrategy"],
                                                        children: unpinnedVisibleColumns.map((col)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(SortableColumnItem, {
                                                                col: col
                                                            }, col.id, false, {
                                                                fileName: "[project]/components/data-table/data-table-column-toggle.tsx",
                                                                lineNumber: 360,
                                                                columnNumber: 31
                                                            }, this))
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/data-table/data-table-column-toggle.tsx",
                                                        lineNumber: 355,
                                                        columnNumber: 27
                                                    }, this),
                                                    pinnedVisibleColumns.length + unpinnedVisibleColumns.length === 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "text-sm text-muted-foreground text-center py-4",
                                                        children: "Không có cột nào được hiển thị."
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/data-table/data-table-column-toggle.tsx",
                                                        lineNumber: 366,
                                                        columnNumber: 29
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/components/data-table/data-table-column-toggle.tsx",
                                                lineNumber: 333,
                                                columnNumber: 23
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/components/data-table/data-table-column-toggle.tsx",
                                            lineNumber: 328,
                                            columnNumber: 21
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/components/data-table/data-table-column-toggle.tsx",
                                        lineNumber: 327,
                                        columnNumber: 18
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/data-table/data-table-column-toggle.tsx",
                                lineNumber: 323,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/data-table/data-table-column-toggle.tsx",
                        lineNumber: 278,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DialogFooter"], {
                        className: "pt-6 mt-auto flex-shrink-0",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                type: "button",
                                variant: "ghost",
                                size: "sm",
                                onClick: handleReset,
                                children: "Quay về mặc định"
                            }, void 0, false, {
                                fileName: "[project]/components/data-table/data-table-column-toggle.tsx",
                                lineNumber: 374,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex-grow"
                            }, void 0, false, {
                                fileName: "[project]/components/data-table/data-table-column-toggle.tsx",
                                lineNumber: 377,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                type: "button",
                                variant: "outline",
                                size: "sm",
                                onClick: ()=>setOpen(false),
                                children: "Thoát"
                            }, void 0, false, {
                                fileName: "[project]/components/data-table/data-table-column-toggle.tsx",
                                lineNumber: 378,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                type: "button",
                                size: "sm",
                                onClick: handleSave,
                                children: "Lưu"
                            }, void 0, false, {
                                fileName: "[project]/components/data-table/data-table-column-toggle.tsx",
                                lineNumber: 381,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/data-table/data-table-column-toggle.tsx",
                        lineNumber: 373,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/data-table/data-table-column-toggle.tsx",
                lineNumber: 271,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/data-table/data-table-column-toggle.tsx",
        lineNumber: 262,
        columnNumber: 5
    }, this);
}
_s(DataTableColumnCustomizer, "y0mpOleZ2JqkRoIIgN79Q5rresE=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$dnd$2d$kit$2f$core$2f$dist$2f$core$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSensors"]
    ];
});
_c = DataTableColumnCustomizer;
var _c;
__turbopack_context__.k.register(_c, "DataTableColumnCustomizer");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/layout/page-toolbar.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "PageToolbar",
    ()=>PageToolbar
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/utils.ts [app-client] (ecmascript)");
;
;
function PageToolbar({ leftActions, rightActions, children, className }) {
    // Backward compatibility: if children is provided, render old way
    if (children && !leftActions && !rightActions) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("flex flex-wrap items-center gap-2 py-3 bg-background", className),
            children: children
        }, void 0, false, {
            fileName: "[project]/components/layout/page-toolbar.tsx",
            lineNumber: 26,
            columnNumber: 7
        }, this);
    }
    if (!leftActions && !rightActions) return null;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("flex items-center justify-between py-3 bg-background", className),
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center gap-2",
                children: leftActions
            }, void 0, false, {
                fileName: "[project]/components/layout/page-toolbar.tsx",
                lineNumber: 47,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center gap-2",
                children: rightActions
            }, void 0, false, {
                fileName: "[project]/components/layout/page-toolbar.tsx",
                lineNumber: 52,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/layout/page-toolbar.tsx",
        lineNumber: 40,
        columnNumber: 5
    }, this);
}
_c = PageToolbar;
var _c;
__turbopack_context__.k.register(_c, "PageToolbar");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/layout/page-filters.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "PageFilters",
    ()=>PageFilters
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/input.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/utils.ts [app-client] (ecmascript)");
;
;
;
function PageFilters({ searchValue = '', onSearchChange, searchPlaceholder = 'Tìm kiếm...', children, leftFilters, rightFilters, className }) {
    // Backward compatibility: if children is provided without leftFilters/rightFilters, use old layout
    const useNewLayout = leftFilters !== undefined || rightFilters !== undefined;
    if (!useNewLayout && children) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 py-3 bg-muted/20", className),
            children: [
                onSearchChange && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Input"], {
                    type: "search",
                    placeholder: searchPlaceholder,
                    value: searchValue,
                    onChange: (e)=>onSearchChange(e.target.value),
                    className: "h-9 w-full sm:w-[280px] md:w-[360px] lg:w-[420px]"
                }, void 0, false, {
                    fileName: "[project]/components/layout/page-filters.tsx",
                    lineNumber: 48,
                    columnNumber: 11
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex flex-wrap items-center gap-2",
                    children: children
                }, void 0, false, {
                    fileName: "[project]/components/layout/page-filters.tsx",
                    lineNumber: 58,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/components/layout/page-filters.tsx",
            lineNumber: 40,
            columnNumber: 7
        }, this);
    }
    // New layout: Search + leftFilters | rightFilters
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 py-3 bg-muted/20", className),
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex flex-col sm:flex-row items-stretch sm:items-center gap-2 flex-1",
                children: [
                    onSearchChange && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Input"], {
                        type: "search",
                        placeholder: searchPlaceholder,
                        value: searchValue,
                        onChange: (e)=>onSearchChange(e.target.value),
                        className: "h-9 w-full sm:w-[280px] md:w-[360px] lg:w-[420px]"
                    }, void 0, false, {
                        fileName: "[project]/components/layout/page-filters.tsx",
                        lineNumber: 76,
                        columnNumber: 11
                    }, this),
                    leftFilters && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex flex-wrap items-center gap-2",
                        children: leftFilters
                    }, void 0, false, {
                        fileName: "[project]/components/layout/page-filters.tsx",
                        lineNumber: 85,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/layout/page-filters.tsx",
                lineNumber: 74,
                columnNumber: 7
            }, this),
            rightFilters && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex flex-wrap items-center gap-2",
                children: rightFilters
            }, void 0, false, {
                fileName: "[project]/components/layout/page-filters.tsx",
                lineNumber: 93,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/layout/page-filters.tsx",
        lineNumber: 67,
        columnNumber: 5
    }, this);
}
_c = PageFilters;
var _c;
__turbopack_context__.k.register(_c, "PageFilters");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/features/cost-adjustments/cost-adjustment-card.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "CostAdjustmentCard",
    ()=>CostAdjustmentCard
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/card.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$badge$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/badge.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/button.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trending$2d$up$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__TrendingUp$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/trending-up.js [app-client] (ecmascript) <export default as TrendingUp>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trending$2d$down$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__TrendingDown$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/trending-down.js [app-client] (ecmascript) <export default as TrendingDown>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$package$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Package$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/package.js [app-client] (ecmascript) <export default as Package>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$calendar$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Calendar$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/calendar.js [app-client] (ecmascript) <export default as Calendar>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$user$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__User$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/user.js [app-client] (ecmascript) <export default as User>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$ellipsis$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MoreHorizontal$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/ellipsis.js [app-client] (ecmascript) <export default as MoreHorizontal>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$eye$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Eye$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/eye.js [app-client] (ecmascript) <export default as Eye>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2d$big$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/circle-check-big.js [app-client] (ecmascript) <export default as CheckCircle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__XCircle$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/circle-x.js [app-client] (ecmascript) <export default as XCircle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$printer$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Printer$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/printer.js [app-client] (ecmascript) <export default as Printer>");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/date-utils.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/dropdown-menu.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
;
;
;
;
const getStatusVariant = (status)=>{
    switch(status){
        case 'draft':
            return 'secondary';
        case 'confirmed':
            return 'success';
        case 'cancelled':
            return 'destructive';
        default:
            return 'outline';
    }
};
const getStatusLabel = (status)=>{
    switch(status){
        case 'draft':
            return 'Nháp';
        case 'confirmed':
            return 'Đã xác nhận';
        case 'cancelled':
            return 'Đã hủy';
        default:
            return status;
    }
};
const formatCurrency = (value)=>value.toLocaleString('vi-VN') + ' đ';
function CostAdjustmentCard({ adjustment, onConfirm, onCancel }) {
    _s();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const isDraft = adjustment.status === 'draft';
    // Calculate totals
    const totalOldValue = adjustment.items?.reduce((sum, item)=>sum + item.oldCostPrice, 0) || 0;
    const totalNewValue = adjustment.items?.reduce((sum, item)=>sum + item.newCostPrice, 0) || 0;
    const totalDifference = totalNewValue - totalOldValue;
    const isPositive = totalDifference > 0;
    const isNegative = totalDifference < 0;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Card"], {
        className: "mb-3",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardContent"], {
            className: "p-4",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex items-start justify-between mb-3",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex-1",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex items-center gap-2 mb-1",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardTitle"], {
                                            className: "font-semibold text-sm text-primary",
                                            children: adjustment.id
                                        }, void 0, false, {
                                            fileName: "[project]/features/cost-adjustments/cost-adjustment-card.tsx",
                                            lineNumber: 56,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$badge$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Badge"], {
                                            variant: getStatusVariant(adjustment.status),
                                            children: getStatusLabel(adjustment.status)
                                        }, void 0, false, {
                                            fileName: "[project]/features/cost-adjustments/cost-adjustment-card.tsx",
                                            lineNumber: 57,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/features/cost-adjustments/cost-adjustment-card.tsx",
                                    lineNumber: 55,
                                    columnNumber: 13
                                }, this),
                                adjustment.referenceCode && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-xs text-muted-foreground",
                                    children: [
                                        "Mã tham chiếu: ",
                                        adjustment.referenceCode
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/features/cost-adjustments/cost-adjustment-card.tsx",
                                    lineNumber: 62,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/features/cost-adjustments/cost-adjustment-card.tsx",
                            lineNumber: 54,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DropdownMenu"], {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DropdownMenuTrigger"], {
                                    asChild: true,
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                        variant: "ghost",
                                        size: "sm",
                                        className: "h-8 w-8 p-0",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$ellipsis$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MoreHorizontal$3e$__["MoreHorizontal"], {
                                            className: "h-4 w-4"
                                        }, void 0, false, {
                                            fileName: "[project]/features/cost-adjustments/cost-adjustment-card.tsx",
                                            lineNumber: 71,
                                            columnNumber: 17
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/features/cost-adjustments/cost-adjustment-card.tsx",
                                        lineNumber: 70,
                                        columnNumber: 15
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/features/cost-adjustments/cost-adjustment-card.tsx",
                                    lineNumber: 69,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DropdownMenuContent"], {
                                    align: "end",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DropdownMenuItem"], {
                                            onClick: ()=>router.push(`/cost-adjustments/${adjustment.systemId}`),
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$eye$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Eye$3e$__["Eye"], {
                                                    className: "mr-2 h-4 w-4"
                                                }, void 0, false, {
                                                    fileName: "[project]/features/cost-adjustments/cost-adjustment-card.tsx",
                                                    lineNumber: 76,
                                                    columnNumber: 17
                                                }, this),
                                                "Xem chi tiết"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/features/cost-adjustments/cost-adjustment-card.tsx",
                                            lineNumber: 75,
                                            columnNumber: 15
                                        }, this),
                                        isDraft && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DropdownMenuItem"], {
                                                    onClick: ()=>onConfirm?.(adjustment.systemId),
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2d$big$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle$3e$__["CheckCircle"], {
                                                            className: "mr-2 h-4 w-4"
                                                        }, void 0, false, {
                                                            fileName: "[project]/features/cost-adjustments/cost-adjustment-card.tsx",
                                                            lineNumber: 82,
                                                            columnNumber: 21
                                                        }, this),
                                                        "Xác nhận"
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/features/cost-adjustments/cost-adjustment-card.tsx",
                                                    lineNumber: 81,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DropdownMenuSeparator"], {}, void 0, false, {
                                                    fileName: "[project]/features/cost-adjustments/cost-adjustment-card.tsx",
                                                    lineNumber: 85,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DropdownMenuItem"], {
                                                    className: "text-destructive",
                                                    onClick: ()=>onCancel?.(adjustment.systemId),
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__XCircle$3e$__["XCircle"], {
                                                            className: "mr-2 h-4 w-4"
                                                        }, void 0, false, {
                                                            fileName: "[project]/features/cost-adjustments/cost-adjustment-card.tsx",
                                                            lineNumber: 90,
                                                            columnNumber: 21
                                                        }, this),
                                                        "Hủy phiếu"
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/features/cost-adjustments/cost-adjustment-card.tsx",
                                                    lineNumber: 86,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DropdownMenuItem"], {
                                            onClick: ()=>router.push(`/cost-adjustments/${adjustment.systemId}`),
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$printer$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Printer$3e$__["Printer"], {
                                                    className: "mr-2 h-4 w-4"
                                                }, void 0, false, {
                                                    fileName: "[project]/features/cost-adjustments/cost-adjustment-card.tsx",
                                                    lineNumber: 96,
                                                    columnNumber: 17
                                                }, this),
                                                "In phiếu"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/features/cost-adjustments/cost-adjustment-card.tsx",
                                            lineNumber: 95,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/features/cost-adjustments/cost-adjustment-card.tsx",
                                    lineNumber: 74,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/features/cost-adjustments/cost-adjustment-card.tsx",
                            lineNumber: 68,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/features/cost-adjustments/cost-adjustment-card.tsx",
                    lineNumber: 53,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex items-center gap-2 mb-3 p-2 bg-muted/50 rounded-md",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex-1",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-xs text-muted-foreground",
                                    children: "Giá vốn cũ"
                                }, void 0, false, {
                                    fileName: "[project]/features/cost-adjustments/cost-adjustment-card.tsx",
                                    lineNumber: 106,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "font-medium text-sm",
                                    children: formatCurrency(totalOldValue)
                                }, void 0, false, {
                                    fileName: "[project]/features/cost-adjustments/cost-adjustment-card.tsx",
                                    lineNumber: 107,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/features/cost-adjustments/cost-adjustment-card.tsx",
                            lineNumber: 105,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex items-center",
                            children: isPositive ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trending$2d$up$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__TrendingUp$3e$__["TrendingUp"], {
                                className: "h-4 w-4 text-emerald-600"
                            }, void 0, false, {
                                fileName: "[project]/features/cost-adjustments/cost-adjustment-card.tsx",
                                lineNumber: 111,
                                columnNumber: 15
                            }, this) : isNegative ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trending$2d$down$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__TrendingDown$3e$__["TrendingDown"], {
                                className: "h-4 w-4 text-destructive"
                            }, void 0, false, {
                                fileName: "[project]/features/cost-adjustments/cost-adjustment-card.tsx",
                                lineNumber: 113,
                                columnNumber: 15
                            }, this) : null
                        }, void 0, false, {
                            fileName: "[project]/features/cost-adjustments/cost-adjustment-card.tsx",
                            lineNumber: 109,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex-1 text-right",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-xs text-muted-foreground",
                                    children: "Giá vốn mới"
                                }, void 0, false, {
                                    fileName: "[project]/features/cost-adjustments/cost-adjustment-card.tsx",
                                    lineNumber: 117,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "font-medium text-sm",
                                    children: formatCurrency(totalNewValue)
                                }, void 0, false, {
                                    fileName: "[project]/features/cost-adjustments/cost-adjustment-card.tsx",
                                    lineNumber: 118,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/features/cost-adjustments/cost-adjustment-card.tsx",
                            lineNumber: 116,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/features/cost-adjustments/cost-adjustment-card.tsx",
                    lineNumber: 104,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: `text-center p-2 rounded-md mb-3 ${isPositive ? 'bg-emerald-500/10 text-emerald-600' : isNegative ? 'bg-destructive/10 text-destructive' : 'bg-gray-50 text-gray-700'}`,
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "text-sm font-medium",
                        children: [
                            "Chênh lệch: ",
                            isPositive ? '+' : '',
                            formatCurrency(totalDifference)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/features/cost-adjustments/cost-adjustment-card.tsx",
                        lineNumber: 128,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/features/cost-adjustments/cost-adjustment-card.tsx",
                    lineNumber: 123,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "grid grid-cols-2 gap-2 text-sm",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex items-center gap-1 text-muted-foreground",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$package$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Package$3e$__["Package"], {
                                    className: "h-3.5 w-3.5"
                                }, void 0, false, {
                                    fileName: "[project]/features/cost-adjustments/cost-adjustment-card.tsx",
                                    lineNumber: 136,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    children: [
                                        adjustment.items?.length || 0,
                                        " sản phẩm"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/features/cost-adjustments/cost-adjustment-card.tsx",
                                    lineNumber: 137,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/features/cost-adjustments/cost-adjustment-card.tsx",
                            lineNumber: 135,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex items-center gap-1 text-muted-foreground",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$calendar$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Calendar$3e$__["Calendar"], {
                                    className: "h-3.5 w-3.5"
                                }, void 0, false, {
                                    fileName: "[project]/features/cost-adjustments/cost-adjustment-card.tsx",
                                    lineNumber: 140,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatDate"])(adjustment.createdDate)
                                }, void 0, false, {
                                    fileName: "[project]/features/cost-adjustments/cost-adjustment-card.tsx",
                                    lineNumber: 141,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/features/cost-adjustments/cost-adjustment-card.tsx",
                            lineNumber: 139,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/features/cost-adjustments/cost-adjustment-card.tsx",
                    lineNumber: 134,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex items-center gap-1 mt-2 text-xs text-muted-foreground",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$user$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__User$3e$__["User"], {
                            className: "h-3 w-3"
                        }, void 0, false, {
                            fileName: "[project]/features/cost-adjustments/cost-adjustment-card.tsx",
                            lineNumber: 147,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            children: adjustment.createdByName
                        }, void 0, false, {
                            fileName: "[project]/features/cost-adjustments/cost-adjustment-card.tsx",
                            lineNumber: 148,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/features/cost-adjustments/cost-adjustment-card.tsx",
                    lineNumber: 146,
                    columnNumber: 9
                }, this),
                adjustment.reason && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: "mt-2 text-xs text-muted-foreground line-clamp-2",
                    children: [
                        "Lý do: ",
                        adjustment.reason
                    ]
                }, void 0, true, {
                    fileName: "[project]/features/cost-adjustments/cost-adjustment-card.tsx",
                    lineNumber: 153,
                    columnNumber: 11
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/features/cost-adjustments/cost-adjustment-card.tsx",
            lineNumber: 52,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/features/cost-adjustments/cost-adjustment-card.tsx",
        lineNumber: 51,
        columnNumber: 5
    }, this);
}
_s(CostAdjustmentCard, "fN7XvhJ+p5oE6+Xlo0NJmXpxjC8=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"]
    ];
});
_c = CostAdjustmentCard;
var _c;
__turbopack_context__.k.register(_c, "CostAdjustmentCard");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/ui/alert-dialog.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AlertDialog",
    ()=>AlertDialog,
    "AlertDialogAction",
    ()=>AlertDialogAction,
    "AlertDialogCancel",
    ()=>AlertDialogCancel,
    "AlertDialogContent",
    ()=>AlertDialogContent,
    "AlertDialogDescription",
    ()=>AlertDialogDescription,
    "AlertDialogFooter",
    ()=>AlertDialogFooter,
    "AlertDialogHeader",
    ()=>AlertDialogHeader,
    "AlertDialogOverlay",
    ()=>AlertDialogOverlay,
    "AlertDialogPortal",
    ()=>AlertDialogPortal,
    "AlertDialogTitle",
    ()=>AlertDialogTitle,
    "AlertDialogTrigger",
    ()=>AlertDialogTrigger
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$alert$2d$dialog$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@radix-ui/react-alert-dialog/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/utils.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/button.tsx [app-client] (ecmascript)");
;
;
;
;
;
const AlertDialog = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$alert$2d$dialog$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Root"];
const AlertDialogTrigger = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$alert$2d$dialog$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Trigger"];
const AlertDialogPortal = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$alert$2d$dialog$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Portal"];
const AlertDialogOverlay = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](({ className, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$alert$2d$dialog$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Overlay"], {
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("fixed inset-0 z-50 bg-black/80 transition-opacity duration-200 opacity-0 data-[state=open]:opacity-100 data-[state=closed]:opacity-0", className),
        ...props,
        ref: ref
    }, void 0, false, {
        fileName: "[project]/components/ui/alert-dialog.tsx",
        lineNumber: 17,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0)));
_c = AlertDialogOverlay;
AlertDialogOverlay.displayName = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$alert$2d$dialog$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Overlay"].displayName;
const AlertDialogContent = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](_c1 = ({ className, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(AlertDialogPortal, {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(AlertDialogOverlay, {}, void 0, false, {
                fileName: "[project]/components/ui/alert-dialog.tsx",
                lineNumber: 33,
                columnNumber: 5
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$alert$2d$dialog$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Content"], {
                ref: ref,
                className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg transition-opacity duration-200 opacity-0 data-[state=open]:opacity-100 data-[state=closed]:opacity-0 sm:rounded-lg", className),
                ...props
            }, void 0, false, {
                fileName: "[project]/components/ui/alert-dialog.tsx",
                lineNumber: 34,
                columnNumber: 5
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/components/ui/alert-dialog.tsx",
        lineNumber: 32,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0)));
_c2 = AlertDialogContent;
AlertDialogContent.displayName = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$alert$2d$dialog$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Content"].displayName;
const AlertDialogHeader = ({ className, ...props })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("flex flex-col space-y-2 text-center sm:text-left", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/alert-dialog.tsx",
        lineNumber: 50,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0));
_c3 = AlertDialogHeader;
AlertDialogHeader.displayName = "AlertDialogHeader";
const AlertDialogFooter = ({ className, ...props })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/alert-dialog.tsx",
        lineNumber: 64,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0));
_c4 = AlertDialogFooter;
AlertDialogFooter.displayName = "AlertDialogFooter";
const AlertDialogTitle = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](_c5 = ({ className, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$alert$2d$dialog$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Title"], {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("text-lg font-semibold", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/alert-dialog.tsx",
        lineNumber: 78,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0)));
_c6 = AlertDialogTitle;
AlertDialogTitle.displayName = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$alert$2d$dialog$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Title"].displayName;
const AlertDialogDescription = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](_c7 = ({ className, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$alert$2d$dialog$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Description"], {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("text-sm text-muted-foreground", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/alert-dialog.tsx",
        lineNumber: 90,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0)));
_c8 = AlertDialogDescription;
AlertDialogDescription.displayName = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$alert$2d$dialog$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Description"].displayName;
const AlertDialogAction = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](_c9 = ({ className, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$alert$2d$dialog$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Action"], {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["buttonVariants"])(), className),
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/alert-dialog.tsx",
        lineNumber: 103,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0)));
_c10 = AlertDialogAction;
AlertDialogAction.displayName = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$alert$2d$dialog$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Action"].displayName;
const AlertDialogCancel = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](_c11 = ({ className, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$alert$2d$dialog$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Cancel"], {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["buttonVariants"])({
            variant: "outline"
        }), "mt-2 sm:mt-0", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/alert-dialog.tsx",
        lineNumber: 115,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0)));
_c12 = AlertDialogCancel;
AlertDialogCancel.displayName = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$alert$2d$dialog$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Cancel"].displayName;
;
var _c, _c1, _c2, _c3, _c4, _c5, _c6, _c7, _c8, _c9, _c10, _c11, _c12;
__turbopack_context__.k.register(_c, "AlertDialogOverlay");
__turbopack_context__.k.register(_c1, "AlertDialogContent$React.forwardRef");
__turbopack_context__.k.register(_c2, "AlertDialogContent");
__turbopack_context__.k.register(_c3, "AlertDialogHeader");
__turbopack_context__.k.register(_c4, "AlertDialogFooter");
__turbopack_context__.k.register(_c5, "AlertDialogTitle$React.forwardRef");
__turbopack_context__.k.register(_c6, "AlertDialogTitle");
__turbopack_context__.k.register(_c7, "AlertDialogDescription$React.forwardRef");
__turbopack_context__.k.register(_c8, "AlertDialogDescription");
__turbopack_context__.k.register(_c9, "AlertDialogAction$React.forwardRef");
__turbopack_context__.k.register(_c10, "AlertDialogAction");
__turbopack_context__.k.register(_c11, "AlertDialogCancel$React.forwardRef");
__turbopack_context__.k.register(_c12, "AlertDialogCancel");
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
"[project]/features/settings/branches/data.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "data",
    ()=>data
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/id-types.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$seed$2d$audit$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/seed-audit.ts [app-client] (ecmascript)");
;
;
const data = [
    {
        systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])('BRANCH000001'),
        id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asBusinessId"])('CN000001'),
        name: 'Trụ sở chính',
        address: '123 Đường ABC, Quận 1, TP.HCM',
        phone: '02833334444',
        managerId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])('EMP000001'),
        isDefault: true,
        ...(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$seed$2d$audit$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["buildSeedAuditFields"])({
            createdAt: '2024-01-01T08:00:00Z'
        })
    },
    {
        systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])('BRANCH000002'),
        id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asBusinessId"])('CN000002'),
        name: 'Chi nhánh Hà Nội',
        address: '456 Đường XYZ, Quận Hai Bà Trưng, Hà Nội',
        phone: '02488889999',
        managerId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])('EMP000002'),
        isDefault: false,
        ...(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$seed$2d$audit$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["buildSeedAuditFields"])({
            createdAt: '2024-01-02T08:00:00Z'
        })
    }
];
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/features/settings/branches/store.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useBranchStore",
    ()=>useBranchStore
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2d$factory$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/store-factory.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$branches$2f$data$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/settings/branches/data.ts [app-client] (ecmascript)");
;
;
const baseStore = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2d$factory$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createCrudStore"])(__TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$branches$2f$data$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["data"], 'branches');
const setDefault = (systemId)=>{
    baseStore.setState((state)=>({
            data: state.data.map((branch)=>({
                    ...branch,
                    isDefault: branch.systemId === systemId
                }))
        }));
};
const originalAdd = baseStore.getState().add;
const originalUpdate = baseStore.getState().update;
baseStore.setState({
    add: (item)=>{
        const result = originalAdd(item);
        if (item.isDefault) {
            setDefault(result.systemId);
        }
        return result;
    },
    update: (systemId, updatedItem)=>{
        originalUpdate(systemId, updatedItem);
        if (updatedItem.isDefault) {
            setDefault(systemId);
        }
    }
});
const enhanceState = (state)=>({
        ...state,
        setDefault
    });
const useBranchStoreBase = ()=>enhanceState(baseStore());
useBranchStoreBase.getState = ()=>enhanceState(baseStore.getState());
const useBranchStore = useBranchStoreBase;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/hooks/use-print-options.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "usePrintOptions",
    ()=>usePrintOptions,
    "useSimplePrintOptions",
    ()=>useSimplePrintOptions
]);
/**
 * Hook để quản lý print options
 * Sử dụng database (user preferences) làm source of truth
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$contexts$2f$auth$2d$context$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/contexts/auth-context.tsx [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
;
;
const API_BASE = '/api/user-preferences';
const SAVE_DEBOUNCE_DELAY = 500;
const PRINT_OPTIONS_KEY = 'print-options-default';
const DEFAULT_PRINT_OPTIONS = {
    branchSystemId: '',
    paperSize: 'A4',
    printOrder: true,
    printDelivery: false,
    printPacking: false,
    printShippingLabel: false
};
function usePrintOptions() {
    _s();
    const { user } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$contexts$2f$auth$2d$context$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuth"])();
    const [options, setOptionsState] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(DEFAULT_PRINT_OPTIONS);
    const [isLoading, setIsLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const saveTimeoutRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const lastSavedRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])('');
    // Load from database
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "usePrintOptions.useEffect": ()=>{
            const loadOptions = {
                "usePrintOptions.useEffect.loadOptions": async ()=>{
                    try {
                        if (user?.systemId) {
                            const res = await fetch(`${API_BASE}?userId=${user.systemId}&key=${encodeURIComponent(PRINT_OPTIONS_KEY)}`);
                            if (res.ok) {
                                const data = await res.json();
                                if (data && data.value) {
                                    setOptionsState({
                                        ...DEFAULT_PRINT_OPTIONS,
                                        ...data.value
                                    });
                                    lastSavedRef.current = JSON.stringify(data.value);
                                }
                            }
                        }
                    } catch (error) {
                        console.error('Error loading print options:', error);
                    } finally{
                        setIsLoading(false);
                    }
                }
            }["usePrintOptions.useEffect.loadOptions"];
            loadOptions();
        }
    }["usePrintOptions.useEffect"], [
        user?.systemId
    ]);
    // Cleanup timeout on unmount
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "usePrintOptions.useEffect": ()=>{
            return ({
                "usePrintOptions.useEffect": ()=>{
                    if (saveTimeoutRef.current) {
                        clearTimeout(saveTimeoutRef.current);
                    }
                }
            })["usePrintOptions.useEffect"];
        }
    }["usePrintOptions.useEffect"], []);
    // Update options - save to database with debounce
    const setOptions = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "usePrintOptions.useCallback[setOptions]": (newOptions)=>{
            setOptionsState(newOptions);
            if (user?.systemId) {
                const newValueStr = JSON.stringify(newOptions);
                if (newValueStr === lastSavedRef.current) {
                    return;
                }
                if (saveTimeoutRef.current) {
                    clearTimeout(saveTimeoutRef.current);
                }
                saveTimeoutRef.current = setTimeout({
                    "usePrintOptions.useCallback[setOptions]": ()=>{
                        lastSavedRef.current = newValueStr;
                        fetch(API_BASE, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({
                                userId: user.systemId,
                                key: PRINT_OPTIONS_KEY,
                                value: newOptions,
                                category: 'ui'
                            })
                        }).catch({
                            "usePrintOptions.useCallback[setOptions]": (error)=>{
                                console.error('Error saving print options:', error);
                            }
                        }["usePrintOptions.useCallback[setOptions]"]);
                    }
                }["usePrintOptions.useCallback[setOptions]"], SAVE_DEBOUNCE_DELAY);
            }
        }
    }["usePrintOptions.useCallback[setOptions]"], [
        user?.systemId
    ]);
    return [
        options,
        setOptions,
        isLoading
    ];
}
_s(usePrintOptions, "wWqZKD1skBtJHnl/9bbeNqWhIys=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$contexts$2f$auth$2d$context$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuth"]
    ];
});
const SIMPLE_PRINT_OPTIONS_KEY = 'simple-print-options-default';
const DEFAULT_SIMPLE_PRINT_OPTIONS = {
    branchSystemId: '',
    paperSize: 'A4'
};
function useSimplePrintOptions() {
    _s1();
    const { user } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$contexts$2f$auth$2d$context$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuth"])();
    const [options, setOptionsState] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(DEFAULT_SIMPLE_PRINT_OPTIONS);
    const [isLoading, setIsLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const saveTimeoutRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const lastSavedRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])('');
    // Load from database
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "useSimplePrintOptions.useEffect": ()=>{
            const loadOptions = {
                "useSimplePrintOptions.useEffect.loadOptions": async ()=>{
                    try {
                        if (user?.systemId) {
                            const res = await fetch(`${API_BASE}?userId=${user.systemId}&key=${encodeURIComponent(SIMPLE_PRINT_OPTIONS_KEY)}`);
                            if (res.ok) {
                                const data = await res.json();
                                if (data && data.value) {
                                    setOptionsState({
                                        ...DEFAULT_SIMPLE_PRINT_OPTIONS,
                                        ...data.value
                                    });
                                    lastSavedRef.current = JSON.stringify(data.value);
                                }
                            }
                        }
                    } catch (error) {
                        console.error('Error loading simple print options:', error);
                    } finally{
                        setIsLoading(false);
                    }
                }
            }["useSimplePrintOptions.useEffect.loadOptions"];
            loadOptions();
        }
    }["useSimplePrintOptions.useEffect"], [
        user?.systemId
    ]);
    // Cleanup timeout on unmount
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "useSimplePrintOptions.useEffect": ()=>{
            return ({
                "useSimplePrintOptions.useEffect": ()=>{
                    if (saveTimeoutRef.current) {
                        clearTimeout(saveTimeoutRef.current);
                    }
                }
            })["useSimplePrintOptions.useEffect"];
        }
    }["useSimplePrintOptions.useEffect"], []);
    // Update options - save to database with debounce
    const setOptions = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useSimplePrintOptions.useCallback[setOptions]": (newOptions)=>{
            setOptionsState(newOptions);
            if (user?.systemId) {
                const newValueStr = JSON.stringify(newOptions);
                if (newValueStr === lastSavedRef.current) {
                    return;
                }
                if (saveTimeoutRef.current) {
                    clearTimeout(saveTimeoutRef.current);
                }
                saveTimeoutRef.current = setTimeout({
                    "useSimplePrintOptions.useCallback[setOptions]": ()=>{
                        lastSavedRef.current = newValueStr;
                        fetch(API_BASE, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({
                                userId: user.systemId,
                                key: SIMPLE_PRINT_OPTIONS_KEY,
                                value: newOptions,
                                category: 'ui'
                            })
                        }).catch({
                            "useSimplePrintOptions.useCallback[setOptions]": (error)=>{
                                console.error('Error saving simple print options:', error);
                            }
                        }["useSimplePrintOptions.useCallback[setOptions]"]);
                    }
                }["useSimplePrintOptions.useCallback[setOptions]"], SAVE_DEBOUNCE_DELAY);
            }
        }
    }["useSimplePrintOptions.useCallback[setOptions]"], [
        user?.systemId
    ]);
    return [
        options,
        setOptions,
        isLoading
    ];
}
_s1(useSimplePrintOptions, "t78AEqgE7QeKdk4aTwYL8rdkJcE=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$contexts$2f$auth$2d$context$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuth"]
    ];
});
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/shared/simple-print-options-dialog.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "SimplePrintOptionsDialog",
    ()=>SimplePrintOptionsDialog
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/dialog.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/button.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$label$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/label.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$checkbox$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/checkbox.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/select.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/utils.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$branches$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/settings/branches/store.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$use$2d$print$2d$options$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/hooks/use-print-options.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
;
;
;
;
;
;
;
;
;
// Paper size options matching the order print dialog
const PAPER_SIZE_OPTIONS = [
    {
        label: 'A4',
        value: 'A4'
    },
    {
        label: 'A5',
        value: 'A5'
    },
    {
        label: 'A6',
        value: 'A6'
    },
    {
        label: 'K80',
        value: 'K80'
    },
    {
        label: 'K57',
        value: 'K57'
    }
];
function SimplePrintOptionsDialog({ open, onOpenChange, onConfirm, selectedCount, title = 'Tùy chọn in' }) {
    _s();
    const { data: branches } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$branches$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useBranchStore"])();
    const activeBranches = branches;
    const [savedDefaults, setSavedDefaults] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$use$2d$print$2d$options$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSimplePrintOptions"])();
    // Find default branch
    const defaultBranch = activeBranches.find((b)=>b.isDefault)?.systemId ?? activeBranches[0]?.systemId ?? '';
    const [branchSystemId, setBranchSystemId] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"](savedDefaults.branchSystemId || defaultBranch);
    const [paperSize, setPaperSize] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"](savedDefaults.paperSize || 'A4');
    const [saveAsDefault, setSaveAsDefault] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"](false);
    // Reset form when dialog opens
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"]({
        "SimplePrintOptionsDialog.useEffect": ()=>{
            if (open) {
                setBranchSystemId(savedDefaults.branchSystemId || defaultBranch);
                setPaperSize(savedDefaults.paperSize || 'A4');
                setSaveAsDefault(false);
            }
        }
    }["SimplePrintOptionsDialog.useEffect"], [
        open,
        defaultBranch,
        savedDefaults
    ]);
    const handleConfirm = ()=>{
        const options = {
            branchSystemId,
            paperSize
        };
        if (saveAsDefault) {
            setSavedDefaults(options);
        }
        onConfirm(options);
        onOpenChange(false);
    };
    // Get branch display name
    const selectedBranchName = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"]({
        "SimplePrintOptionsDialog.useMemo[selectedBranchName]": ()=>{
            if (!branchSystemId) return 'Chi nhánh mặc định';
            const branch = activeBranches.find({
                "SimplePrintOptionsDialog.useMemo[selectedBranchName].branch": (b)=>b.systemId === branchSystemId
            }["SimplePrintOptionsDialog.useMemo[selectedBranchName].branch"]);
            return branch?.name ?? 'Chi nhánh mặc định';
        }
    }["SimplePrintOptionsDialog.useMemo[selectedBranchName]"], [
        branchSystemId,
        activeBranches
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Dialog"], {
        open: open,
        onOpenChange: onOpenChange,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DialogContent"], {
            className: "sm:max-w-[480px]",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DialogHeader"], {
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DialogTitle"], {
                        className: "text-lg",
                        children: [
                            title,
                            selectedCount > 1 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "ml-2 text-sm font-normal text-muted-foreground",
                                children: [
                                    "(",
                                    selectedCount,
                                    " phiếu)"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/shared/simple-print-options-dialog.tsx",
                                lineNumber: 94,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/shared/simple-print-options-dialog.tsx",
                        lineNumber: 91,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/components/shared/simple-print-options-dialog.tsx",
                    lineNumber: 90,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "grid gap-6 py-4",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex items-center gap-4",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$label$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Label"], {
                                    className: "min-w-[160px] text-right text-muted-foreground",
                                    children: "Chọn mẫu in tại chi nhánh"
                                }, void 0, false, {
                                    fileName: "[project]/components/shared/simple-print-options-dialog.tsx",
                                    lineNumber: 104,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Select"], {
                                    value: branchSystemId,
                                    onValueChange: setBranchSystemId,
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SelectTrigger"], {
                                            className: "flex-1",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SelectValue"], {
                                                placeholder: "Chi nhánh mặc định",
                                                children: selectedBranchName
                                            }, void 0, false, {
                                                fileName: "[project]/components/shared/simple-print-options-dialog.tsx",
                                                lineNumber: 109,
                                                columnNumber: 17
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/components/shared/simple-print-options-dialog.tsx",
                                            lineNumber: 108,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SelectContent"], {
                                            children: activeBranches.map((branch)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SelectItem"], {
                                                    value: branch.systemId,
                                                    children: [
                                                        branch.name,
                                                        " ",
                                                        branch.isDefault ? '(mặc định)' : ''
                                                    ]
                                                }, branch.systemId, true, {
                                                    fileName: "[project]/components/shared/simple-print-options-dialog.tsx",
                                                    lineNumber: 115,
                                                    columnNumber: 19
                                                }, this))
                                        }, void 0, false, {
                                            fileName: "[project]/components/shared/simple-print-options-dialog.tsx",
                                            lineNumber: 113,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/shared/simple-print-options-dialog.tsx",
                                    lineNumber: 107,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/shared/simple-print-options-dialog.tsx",
                            lineNumber: 103,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "space-y-3",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$label$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Label"], {
                                    className: "text-muted-foreground",
                                    children: "Chọn mẫu in phiếu"
                                }, void 0, false, {
                                    fileName: "[project]/components/shared/simple-print-options-dialog.tsx",
                                    lineNumber: 125,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex flex-wrap gap-2",
                                    children: PAPER_SIZE_OPTIONS.map((option)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                            type: "button",
                                            variant: paperSize === option.value ? "default" : "outline",
                                            size: "sm",
                                            className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("min-w-[70px]", paperSize === option.value && "bg-primary text-primary-foreground"),
                                            onClick: ()=>setPaperSize(option.value),
                                            children: option.label
                                        }, option.value, false, {
                                            fileName: "[project]/components/shared/simple-print-options-dialog.tsx",
                                            lineNumber: 128,
                                            columnNumber: 17
                                        }, this))
                                }, void 0, false, {
                                    fileName: "[project]/components/shared/simple-print-options-dialog.tsx",
                                    lineNumber: 126,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/shared/simple-print-options-dialog.tsx",
                            lineNumber: 124,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex items-center space-x-2",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$checkbox$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Checkbox"], {
                                    id: "save-default",
                                    checked: saveAsDefault,
                                    onCheckedChange: (checked)=>setSaveAsDefault(checked === true)
                                }, void 0, false, {
                                    fileName: "[project]/components/shared/simple-print-options-dialog.tsx",
                                    lineNumber: 147,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$label$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Label"], {
                                    htmlFor: "save-default",
                                    className: "text-sm cursor-pointer text-muted-foreground",
                                    children: "Đặt làm mặc định cho chức năng in tùy chọn"
                                }, void 0, false, {
                                    fileName: "[project]/components/shared/simple-print-options-dialog.tsx",
                                    lineNumber: 152,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/shared/simple-print-options-dialog.tsx",
                            lineNumber: 146,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/shared/simple-print-options-dialog.tsx",
                    lineNumber: 101,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DialogFooter"], {
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                            variant: "outline",
                            onClick: ()=>onOpenChange(false),
                            children: "Thoát"
                        }, void 0, false, {
                            fileName: "[project]/components/shared/simple-print-options-dialog.tsx",
                            lineNumber: 162,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                            onClick: handleConfirm,
                            children: "In"
                        }, void 0, false, {
                            fileName: "[project]/components/shared/simple-print-options-dialog.tsx",
                            lineNumber: 165,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/shared/simple-print-options-dialog.tsx",
                    lineNumber: 161,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/components/shared/simple-print-options-dialog.tsx",
            lineNumber: 89,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/components/shared/simple-print-options-dialog.tsx",
        lineNumber: 88,
        columnNumber: 5
    }, this);
}
_s(SimplePrintOptionsDialog, "QJJD7sONPLcGBCttWrotRcVUHBc=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$branches$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useBranchStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$use$2d$print$2d$options$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSimplePrintOptions"]
    ];
});
_c = SimplePrintOptionsDialog;
var _c;
__turbopack_context__.k.register(_c, "SimplePrintOptionsDialog");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/features/settings/printer/templates/order.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Mẫu in Đơn bán hàng - TipTap compatible
 * 
 * QUAN TRỌNG - Quy tắc template:
 * 1. Bảng chứa {line_stt} là bảng line items - sẽ được lặp theo số sản phẩm
 * 2. Các bảng khác là bảng thông tin - không lặp
 * 3. Sử dụng inline styles để đảm bảo hiển thị đúng khi in
 * 
 * CHUẨN TEMPLATE v2 (2025-12-08):
 * - Header: Logo trái + Store info phải (dạng table)
 * - Title: Căn giữa, border-bottom
 * - Info table: Label 22% nền xám
 * - Product table: table-layout fixed, responsive
 * - Summary: 250px căn phải
 * - Footer: border-top dashed, font nhỏ
 */ __turbopack_context__.s([
    "ORDER_TEMPLATE",
    ()=>ORDER_TEMPLATE
]);
const ORDER_TEMPLATE = `
<div style="font-family: Arial, sans-serif; font-size: 12px; line-height: 1.4; max-width: 800px; margin: 0 auto; padding: 10px;">

<!-- HEADER: Logo trái + Thông tin cửa hàng phải -->
<table style="width: 100%; margin-bottom: 12px; border-collapse: collapse;">
  <tr>
    <td style="width: 70px; vertical-align: top; padding-right: 10px;">{store_logo}</td>
    <td style="vertical-align: top;">
      <div style="font-size: 14px; font-weight: bold; margin-bottom: 2px;">{store_name}</div>
      <div style="font-size: 11px; color: #333;">{store_address}</div>
      <div style="font-size: 11px; color: #333;">ĐT: {store_phone_number} | Email: {store_email}</div>
    </td>
  </tr>
</table>

<!-- TIÊU ĐỀ -->
<h2 style="text-align: center; margin: 12px 0 5px 0; font-size: 14px; font-weight: bold; margin-bottom: 2px; border-bottom: 2px solid #333; padding-bottom: 8px;">HÓA ĐƠN BÁN HÀNG</h2>
<div style="text-align: center; margin-bottom: 12px; font-size: 11px;">
  <div>Số: <strong>{order_code}</strong></div>
  <div>Ngày: {created_on} {created_on_time}</div>
</div>

<!-- THÔNG TIN KHÁCH HÀNG -->
<table style="width: 100%; border-collapse: collapse; margin-bottom: 10px;">
  <tbody>
    <tr>
      <td style="padding: 4px 6px; width: 22%; background: #f5f5f5; border: 1px solid #333; font-size: 11px;">Khách hàng:</td>
      <td style="padding: 4px 6px; border: 1px solid #333; font-size: 11px;"><strong>{customer_name}</strong></td>
      <td style="padding: 4px 6px; width: 18%; background: #f5f5f5; border: 1px solid #333; font-size: 11px;">Mã KH:</td>
      <td style="padding: 4px 6px; border: 1px solid #333; font-size: 11px;">{customer_code}</td>
    </tr>
    <tr>
      <td style="padding: 4px 6px; background: #f5f5f5; border: 1px solid #333; font-size: 11px;">Điện thoại:</td>
      <td style="padding: 4px 6px; border: 1px solid #333; font-size: 11px;">{customer_phone_number}</td>
      <td style="padding: 4px 6px; background: #f5f5f5; border: 1px solid #333; font-size: 11px;">Nhóm KH:</td>
      <td style="padding: 4px 6px; border: 1px solid #333; font-size: 11px;">{customer_group}</td>
    </tr>
    <tr>
      <td style="padding: 4px 6px; background: #f5f5f5; border: 1px solid #333; font-size: 11px;">Địa chỉ:</td>
      <td style="padding: 4px 6px; border: 1px solid #333; font-size: 11px;" colspan="3">{billing_address}</td>
    </tr>
    <tr>
      <td style="padding: 4px 6px; background: #f5f5f5; border: 1px solid #333; font-size: 11px;">ĐC giao hàng:</td>
      <td style="padding: 4px 6px; border: 1px solid #333; font-size: 11px;" colspan="3">{shipping_address}</td>
    </tr>
    <tr>
      <td style="padding: 4px 6px; background: #f5f5f5; border: 1px solid #333; font-size: 11px;">NV bán:</td>
      <td style="padding: 4px 6px; border: 1px solid #333; font-size: 11px;">{account_name}</td>
      <td style="padding: 4px 6px; background: #f5f5f5; border: 1px solid #333; font-size: 11px;">Trạng thái:</td>
      <td style="padding: 4px 6px; border: 1px solid #333; font-size: 11px;">{order_status}</td>
    </tr>
  </tbody>
</table>

<!-- BẢNG SẢN PHẨM - Responsive với table-layout fixed -->
<table style="width: 100%; border-collapse: collapse; margin-bottom: 10px; table-layout: fixed;">
  <thead>
    <tr style="background: #f5f5f5;">
      <th style="padding: 5px 3px; border: 1px solid #333; text-align: center; width: 28px; font-size: 10px;">STT</th>
      <th style="padding: 5px 3px; border: 1px solid #333; text-align: left; font-size: 10px;">Tên sản phẩm</th>
      <th style="padding: 5px 3px; border: 1px solid #333; text-align: center; width: 32px; font-size: 10px;">ĐVT</th>
      <th style="padding: 5px 3px; border: 1px solid #333; text-align: center; width: 28px; font-size: 10px;">SL</th>
      <th style="padding: 5px 3px; border: 1px solid #333; text-align: right; width: 65px; font-size: 10px;">Đơn giá</th>
      <th style="padding: 5px 3px; border: 1px solid #333; text-align: right; width: 50px; font-size: 10px;">VAT</th>
      <th style="padding: 5px 3px; border: 1px solid #333; text-align: right; width: 45px; font-size: 10px;">CK</th>
      <th style="padding: 5px 3px; border: 1px solid #333; text-align: right; width: 70px; font-size: 10px;">Thành tiền</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td style="padding: 4px 3px; border: 1px solid #333; text-align: center; font-size: 10px;">{line_stt}</td>
      <td style="padding: 4px 3px; border: 1px solid #333; font-size: 10px; word-wrap: break-word;">{line_product_name}<br><small style="color: #666;">{line_variant}</small></td>
      <td style="padding: 4px 3px; border: 1px solid #333; text-align: center; font-size: 10px;">{line_unit}</td>
      <td style="padding: 4px 3px; border: 1px solid #333; text-align: center; font-size: 10px; font-weight: bold;">{line_quantity}</td>
      <td style="padding: 4px 3px; border: 1px solid #333; text-align: right; font-size: 10px;">{line_price}</td>
      <td style="padding: 4px 3px; border: 1px solid #333; text-align: right; font-size: 10px;">{line_tax_amount}</td>
      <td style="padding: 4px 3px; border: 1px solid #333; text-align: right; font-size: 10px;">{line_discount_amount}</td>
      <td style="padding: 4px 3px; border: 1px solid #333; text-align: right; font-size: 10px;">{line_amount}</td>
    </tr>
  </tbody>
</table>

<!-- BẢNG TỔNG GIÁ TRỊ -->
<table style="width: 250px; margin-left: auto; border-collapse: collapse; margin-bottom: 10px;">
  <tbody>
    <tr>
      <td style="padding: 4px 6px; border: 1px solid #333; font-size: 11px;">Tổng số lượng:</td>
      <td style="padding: 4px 6px; border: 1px solid #333; text-align: right; width: 85px; font-size: 11px;"><strong>{total_quantity}</strong></td>
    </tr>
    <tr>
      <td style="padding: 4px 6px; border: 1px solid #333; font-size: 11px;">Tổng tiền hàng:</td>
      <td style="padding: 4px 6px; border: 1px solid #333; text-align: right; font-size: 11px;">{total}</td>
    </tr>
    <tr>
      <td style="padding: 4px 6px; border: 1px solid #333; font-size: 11px;">Chiết khấu:</td>
      <td style="padding: 4px 6px; border: 1px solid #333; text-align: right; font-size: 11px;">{total_discount}</td>
    </tr>
    <tr>
      <td style="padding: 4px 6px; border: 1px solid #333; font-size: 11px;">Thuế:</td>
      <td style="padding: 4px 6px; border: 1px solid #333; text-align: right; font-size: 11px;">{total_tax}</td>
    </tr>
    <tr>
      <td style="padding: 4px 6px; border: 1px solid #333; font-size: 11px;">Phí giao hàng:</td>
      <td style="padding: 4px 6px; border: 1px solid #333; text-align: right; font-size: 11px;">{delivery_fee}</td>
    </tr>
    <tr style="background: #f5f5f5;">
      <td style="padding: 5px 6px; border: 1px solid #333; font-size: 11px;"><strong>TỔNG CỘNG:</strong></td>
      <td style="padding: 5px 6px; border: 1px solid #333; text-align: right; font-size: 11px;"><strong>{total_amount}</strong></td>
    </tr>
  </tbody>
</table>

<!-- BẰNG CHỮ -->
<p style="margin: 8px 0; font-size: 11px;"><strong>Bằng chữ:</strong> <em>{total_text}</em></p>

<!-- THANH TOÁN -->
<table style="width: 100%; border-collapse: collapse; margin-bottom: 10px;">
  <tbody>
    <tr>
      <td style="padding: 4px 6px; width: 22%; background: #f5f5f5; border: 1px solid #333; font-size: 11px;">Phương thức TT:</td>
      <td style="padding: 4px 6px; border: 1px solid #333; font-size: 11px;">{payment_name}</td>
      <td style="padding: 4px 6px; width: 18%; background: #f5f5f5; border: 1px solid #333; font-size: 11px;">TT thanh toán:</td>
      <td style="padding: 4px 6px; border: 1px solid #333; font-size: 11px;">{payment_status}</td>
    </tr>
    <tr>
      <td style="padding: 4px 6px; background: #f5f5f5; border: 1px solid #333; font-size: 11px;">Khách đưa:</td>
      <td style="padding: 4px 6px; border: 1px solid #333; font-size: 11px;">{payment_customer}</td>
      <td style="padding: 4px 6px; background: #f5f5f5; border: 1px solid #333; font-size: 11px;">Tiền thừa:</td>
      <td style="padding: 4px 6px; border: 1px solid #333; font-size: 11px;">{money_return}</td>
    </tr>
  </tbody>
</table>

<!-- GHI CHÚ -->
<div style="margin: 8px 0; padding: 8px; background: #f5f5f5; border: 1px solid #333; font-size: 11px;">
  <strong>Ghi chú:</strong> {order_note}
</div>

<!-- CHỮ KÝ -->
<table style="width: 100%; margin-top: 25px;">
  <tbody>
    <tr>
      <td style="width: 50%; text-align: center; padding: 8px; vertical-align: top;">
        <div style="font-weight: bold; font-size: 11px;">Người mua hàng</div>
        <div style="color: #888; font-size: 10px; font-style: italic;">(Ký, ghi rõ họ tên)</div>
        <div style="height: 50px;"></div>
        <div style="font-size: 11px;">{customer_name}</div>
      </td>
      <td style="width: 50%; text-align: center; padding: 8px; vertical-align: top;">
        <div style="font-weight: bold; font-size: 11px;">Người bán hàng</div>
        <div style="color: #888; font-size: 10px; font-style: italic;">(Ký, ghi rõ họ tên)</div>
        <div style="height: 50px;"></div>
        <div style="font-size: 11px;">{account_name}</div>
      </td>
    </tr>
  </tbody>
</table>

<!-- FOOTER -->
<div style="text-align: center; margin-top: 15px; padding-top: 8px; border-top: 1px dashed #333; font-size: 10px; color: #666;">
  <div>Cảm ơn quý khách đã mua hàng!</div>
  <div>Hotline: {store_phone_number} | In lúc: {print_date} {print_time}</div>
</div>

</div>
`;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/features/settings/printer/templates/quote.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Mẫu in Phiếu báo giá / Đơn tạm tính - TipTap compatible
 * Cập nhật: Thiết kế đen trắng cho máy in
 */ __turbopack_context__.s([
    "QUOTE_TEMPLATE",
    ()=>QUOTE_TEMPLATE
]);
const QUOTE_TEMPLATE = `
<div style="font-family: Arial, sans-serif; font-size: 12px; line-height: 1.4; max-width: 800px; margin: 0 auto; padding: 10px;">

<!-- HEADER -->
<table style="width: 100%; margin-bottom: 10px;">
  <tr>
    <td style="width: 80px; vertical-align: top;">{store_logo}</td>
    <td style="vertical-align: top;">
      <div style="font-size: 14px; font-weight: bold; margin-bottom: 2px;">{store_name}</div>
      <div>{store_address}</div>
      <div>ĐT: {store_phone_number} | Email: {store_email}</div>
    </td>
  </tr>
</table>

<!-- TIÊU ĐỀ -->
<h2 style="text-align: center; margin: 15px 0 5px 0; font-size: 14px; font-weight: bold; margin-bottom: 2px; border-bottom: 2px solid #333; padding-bottom: 10px;">PHIẾU BÁO GIÁ</h2>
<div style="text-align: center; margin-bottom: 10px;">
  <div>Số: <strong>{order_code}</strong></div>
  <div>Ngày: {created_on} {created_on_time}</div>
  <div style="font-style: italic;">Hiệu lực đến: {issued_on}</div>
</div>

<!-- THÔNG TIN KHÁCH HÀNG -->
<table style="width: 100%; border-collapse: collapse; margin-bottom: 10px; table-layout: fixed;">
  <tbody>
    <tr>
      <td style="padding: 4px 6px; width: 22%; background: #f5f5f5; border: 1px solid #333;">Khách hàng:</td>
      <td style="padding: 5px; border: 1px solid #333;"><strong>{customer_name}</strong></td>
      <td style="padding: 5px; width: 15%; background: #f5f5f5; border: 1px solid #333;">Mã KH:</td>
      <td style="padding: 5px; border: 1px solid #333;">{customer_code}</td>
    </tr>
    <tr>
      <td style="padding: 5px; background: #f5f5f5; border: 1px solid #333;">Điện thoại:</td>
      <td style="padding: 5px; border: 1px solid #333;">{customer_phone_number}</td>
      <td style="padding: 5px; background: #f5f5f5; border: 1px solid #333;">Email:</td>
      <td style="padding: 5px; border: 1px solid #333;">{customer_email}</td>
    </tr>
    <tr>
      <td style="padding: 5px; background: #f5f5f5; border: 1px solid #333;">Địa chỉ:</td>
      <td style="padding: 5px; border: 1px solid #333;" colspan="3">{billing_address}</td>
    </tr>
    <tr>
      <td style="padding: 5px; background: #f5f5f5; border: 1px solid #333;">Nhân viên:</td>
      <td style="padding: 5px; border: 1px solid #333;">{account_name}</td>
      <td style="padding: 5px; background: #f5f5f5; border: 1px solid #333;">Chính sách giá:</td>
      <td style="padding: 5px; border: 1px solid #333;">{price_list_name}</td>
    </tr>
  </tbody>
</table>

<!-- BẢNG SẢN PHẨM -->
<table style="width: 100%; border-collapse: collapse; margin-bottom: 10px; table-layout: fixed;">
  <thead>
    <tr style="background: #f5f5f5;">
      <th style="padding: 8px; border: 1px solid #333; text-align: center; width: 40px;">STT</th>
      <th style="padding: 8px; border: 1px solid #333; text-align: left;">Tên sản phẩm</th>
      <th style="padding: 8px; border: 1px solid #333; text-align: center; width: 60px;">ĐVT</th>
      <th style="padding: 8px; border: 1px solid #333; text-align: center; width: 50px;">SL</th>
      <th style="padding: 8px; border: 1px solid #333; text-align: right; width: 100px;">Đơn giá</th>
      <th style="padding: 8px; border: 1px solid #333; text-align: right; width: 80px;">CK</th>
      <th style="padding: 8px; border: 1px solid #333; text-align: right; width: 110px;">Thành tiền</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td style="padding: 6px; border: 1px solid #333; text-align: center;">{line_stt}</td>
      <td style="padding: 6px; border: 1px solid #333;">{line_product_name}<br><small>{line_variant}</small></td>
      <td style="padding: 6px; border: 1px solid #333; text-align: center;">{line_unit}</td>
      <td style="padding: 6px; border: 1px solid #333; text-align: center;">{line_quantity}</td>
      <td style="padding: 6px; border: 1px solid #333; text-align: right;">{line_price}</td>
      <td style="padding: 6px; border: 1px solid #333; text-align: right;">{line_discount_amount}</td>
      <td style="padding: 6px; border: 1px solid #333; text-align: right;">{line_amount}</td>
    </tr>
  </tbody>
</table>

<!-- TỔNG GIÁ TRỊ -->
<table style="width: 250px; margin-left: auto; border-collapse: collapse; margin-bottom: 10px; table-layout: fixed;">
  <tbody>
    <tr>
      <td style="padding: 5px; border: 1px solid #333;">Tổng tiền hàng:</td>
      <td style="padding: 5px; border: 1px solid #333; text-align: right; width: 120px;">{total}</td>
    </tr>
    <tr>
      <td style="padding: 5px; border: 1px solid #333;">Chiết khấu:</td>
      <td style="padding: 5px; border: 1px solid #333; text-align: right;">{total_discount}</td>
    </tr>
    <tr>
      <td style="padding: 5px; border: 1px solid #333;">Thuế VAT:</td>
      <td style="padding: 5px; border: 1px solid #333; text-align: right;">{total_tax}</td>
    </tr>
    <tr style="background: #f5f5f5;">
      <td style="padding: 5px; border: 1px solid #333;"><strong>TỔNG CỘNG:</strong></td>
      <td style="padding: 5px; border: 1px solid #333; text-align: right;"><strong>{total_amount}</strong></td>
    </tr>
  </tbody>
</table>

<p style="margin: 10px 0;"><strong>Bằng chữ:</strong> <em>{total_text}</em></p>

<!-- GHI CHÚ -->
<div style="margin: 10px 0; padding: 10px; background: #f5f5f5; border: 1px solid #333;">
  <strong>Ghi chú:</strong> {order_note}
</div>

<!-- ĐIỀU KHOẢN -->
<div style="margin-bottom: 10px; padding: 10px; border: 1px solid #333; font-size: 11px;">
  <strong>Điều khoản:</strong>
  <ul style="margin: 5px 0 0 15px; padding: 0;">
    <li>Báo giá có hiệu lực trong 7 ngày kể từ ngày lập</li>
    <li>Giá trên chưa bao gồm phí vận chuyển (nếu có)</li>
    <li>Thanh toán: Theo thỏa thuận</li>
  </ul>
</div>

<!-- CHỮ KÝ -->
<table style="width: 100%; margin-top: 30px;">
  <tbody>
    <tr>
      <td style="width: 50%; text-align: center; padding: 10px;">
        <strong>Khách hàng</strong><br>
        <em>(Ký xác nhận đồng ý)</em><br>
        <div style="height: 50px;"></div>
        {customer_name}
      </td>
      <td style="width: 50%; text-align: center; padding: 10px;">
        <strong>Nhân viên báo giá</strong><br>
        <em>(Ký, ghi rõ họ tên)</em><br>
        <div style="height: 50px;"></div>
        {account_name}
      </td>
    </tr>
  </tbody>
</table>

<!-- FOOTER -->
<div style="text-align: center; margin-top: 15px; padding-top: 8px; border-top: 1px dashed #333;">
  <p style="margin: 5px 0;">Cảm ơn Quý khách đã quan tâm!</p>
  <p style="margin: 5px 0;">Liên hệ: {store_phone_number}</p>

  <div style="font-size: 10px; color: #666; margin-top: 5px;">In lúc: {print_date} {print_time}</div></div>

</div>
`;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/features/settings/printer/templates/receipt.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Mẫu in Phiếu thu - TipTap compatible
 * Cập nhật: Thiết kế đen trắng cho máy in
 */ __turbopack_context__.s([
    "RECEIPT_TEMPLATE",
    ()=>RECEIPT_TEMPLATE
]);
const RECEIPT_TEMPLATE = `
<div style="font-family: Arial, sans-serif; font-size: 12px; line-height: 1.4; max-width: 800px; margin: 0 auto; padding: 10px;">

<!-- HEADER -->
<table style="width: 100%; margin-bottom: 10px;">
  <tr>
    <td style="width: 80px; vertical-align: top;">{store_logo}</td>
    <td style="vertical-align: top;">
      <div style="font-size: 14px; font-weight: bold; margin-bottom: 2px;">{store_name}</div>
      <div>{store_address}</div>
    </td>
  </tr>
</table>

<!-- TIÊU ĐỀ -->
<h2 style="text-align: center; margin: 15px 0 5px 0; font-size: 14px; font-weight: bold; margin-bottom: 2px; border-bottom: 2px solid #333; padding-bottom: 10px;">PHIẾU THU</h2>
<div style="text-align: center; margin-bottom: 10px;">
  <div>Số: <strong>{receipt_voucher_code}</strong></div>
  <div>Ngày: {created_on}</div>
</div>

<!-- MÃ VẠCH -->
<table style="width: 100%; margin-bottom: 10px;">
  <tr>
    <td style="text-align: center; padding: 10px; border: 1px solid #333; background: #f5f5f5;">
      <div style="margin-bottom: 8px;">{receipt_barcode}</div>
      <div style="font-family: monospace;">{receipt_voucher_code}</div>
    </td>
  </tr>
</table>

<!-- THÔNG TIN PHIẾU THU -->
<table style="width: 100%; border-collapse: collapse; margin-bottom: 10px; table-layout: fixed;">
  <tbody>
    <tr>
      <td style="padding: 4px 6px; width: 22%; background: #f5f5f5; border: 1px solid #333;">Người nộp tiền:</td>
      <td style="padding: 5px; border: 1px solid #333;"><strong>{object_name}</strong></td>
    </tr>
    <tr>
      <td style="padding: 5px; background: #f5f5f5; border: 1px solid #333;">Địa chỉ:</td>
      <td style="padding: 5px; border: 1px solid #333;">{object_address}</td>
    </tr>
    <tr>
      <td style="padding: 5px; background: #f5f5f5; border: 1px solid #333;">Lý do nộp:</td>
      <td style="padding: 5px; border: 1px solid #333;">{description}</td>
    </tr>
    <tr>
      <td style="padding: 5px; background: #f5f5f5; border: 1px solid #333;">Hình thức thanh toán:</td>
      <td style="padding: 5px; border: 1px solid #333;">{payment_method}</td>
    </tr>
  </tbody>
</table>

<!-- SỐ TIỀN -->
<table style="width: 100%; margin-bottom: 10px;">
  <tr>
    <td style="text-align: center; padding: 15px; border: 2px solid #333;">
      <div style="margin-bottom: 8px;">Số tiền</div>
      <div style="font-size: 24px; font-weight: bold;">{amount}</div>
      <div style="font-style: italic; margin-top: 8px;">({amount_text})</div>
    </td>
  </tr>
</table>

<!-- GHI CHÚ -->
<div style="margin: 10px 0; padding: 10px; background: #f5f5f5; border: 1px solid #333;">
  <strong>Ghi chú:</strong> {note}
</div>

<!-- CHỮ KÝ -->
<table style="width: 100%; margin-top: 30px;">
  <tbody>
    <tr>
      <td style="width: 33%; text-align: center; padding: 10px;">
        <strong>Người nộp tiền</strong><br>
        <em>(Ký, ghi rõ họ tên)</em><br>
        <div style="height: 50px;"></div>
        {object_name}
      </td>
      <td style="width: 33%; text-align: center; padding: 10px;">
        <strong>Thủ quỹ</strong><br>
        <em>(Ký, ghi rõ họ tên)</em><br>
        <div style="height: 50px;"></div>
      </td>
      <td style="width: 33%; text-align: center; padding: 10px;">
        <strong>Người lập phiếu</strong><br>
        <em>(Ký, ghi rõ họ tên)</em><br>
        <div style="height: 50px;"></div>
        {account_name}
      </td>
    </tr>
  </tbody>
</table>

<!-- FOOTER -->
<div style="text-align: center; margin-top: 15px; padding-top: 8px; border-top: 1px dashed #333; font-size: 11px;">
  In lúc: {print_date} {print_time}
</div>

</div>
`;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/features/settings/printer/templates/payment.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Mẫu in Phiếu chi - TipTap compatible
 * Cập nhật: Thiết kế đen trắng cho máy in
 */ __turbopack_context__.s([
    "PAYMENT_TEMPLATE",
    ()=>PAYMENT_TEMPLATE
]);
const PAYMENT_TEMPLATE = `
<div style="font-family: Arial, sans-serif; font-size: 12px; line-height: 1.4; max-width: 800px; margin: 0 auto; padding: 10px;">

<!-- HEADER -->
<table style="width: 100%; margin-bottom: 10px;">
  <tr>
    <td style="width: 80px; vertical-align: top;">{store_logo}</td>
    <td style="vertical-align: top;">
      <div style="font-size: 14px; font-weight: bold; margin-bottom: 2px;">{store_name}</div>
      <div>{store_address}</div>
    </td>
  </tr>
</table>

<!-- TIÊU ĐỀ -->
<h2 style="text-align: center; margin: 15px 0 5px 0; font-size: 14px; font-weight: bold; margin-bottom: 2px; border-bottom: 2px solid #333; padding-bottom: 10px;">PHIẾU CHI</h2>
<div style="text-align: center; margin-bottom: 10px;">
  <div>Số: <strong>{payment_voucher_code}</strong></div>
  <div>Ngày: {created_on}</div>
</div>

<!-- MÃ VẠCH -->
<table style="width: 100%; margin-bottom: 10px;">
  <tr>
    <td style="text-align: center; padding: 10px; border: 1px solid #333; background: #f5f5f5;">
      <div style="margin-bottom: 8px;">{payment_barcode}</div>
      <div style="font-family: monospace;">{payment_voucher_code}</div>
    </td>
  </tr>
</table>

<!-- THÔNG TIN PHIẾU CHI -->
<table style="width: 100%; border-collapse: collapse; margin-bottom: 10px; table-layout: fixed;">
  <tbody>
    <tr>
      <td style="padding: 4px 6px; width: 22%; background: #f5f5f5; border: 1px solid #333;">Người nhận tiền:</td>
      <td style="padding: 5px; border: 1px solid #333;"><strong>{object_name}</strong></td>
    </tr>
    <tr>
      <td style="padding: 5px; background: #f5f5f5; border: 1px solid #333;">Địa chỉ:</td>
      <td style="padding: 5px; border: 1px solid #333;">{object_address}</td>
    </tr>
    <tr>
      <td style="padding: 5px; background: #f5f5f5; border: 1px solid #333;">Lý do chi:</td>
      <td style="padding: 5px; border: 1px solid #333;">{description}</td>
    </tr>
    <tr>
      <td style="padding: 5px; background: #f5f5f5; border: 1px solid #333;">Hình thức thanh toán:</td>
      <td style="padding: 5px; border: 1px solid #333;">{payment_method}</td>
    </tr>
  </tbody>
</table>

<!-- SỐ TIỀN -->
<table style="width: 100%; margin-bottom: 10px;">
  <tr>
    <td style="text-align: center; padding: 15px; border: 2px solid #333;">
      <div style="margin-bottom: 8px;">Số tiền</div>
      <div style="font-size: 24px; font-weight: bold;">{amount}</div>
      <div style="font-style: italic; margin-top: 8px;">({amount_text})</div>
    </td>
  </tr>
</table>

<!-- GHI CHÚ -->
<div style="margin: 10px 0; padding: 10px; background: #f5f5f5; border: 1px solid #333;">
  <strong>Ghi chú:</strong> {note}
</div>

<!-- CHỮ KÝ -->
<table style="width: 100%; margin-top: 30px;">
  <tbody>
    <tr>
      <td style="width: 33%; text-align: center; padding: 10px;">
        <strong>Người nhận tiền</strong><br>
        <em>(Ký, ghi rõ họ tên)</em><br>
        <div style="height: 50px;"></div>
        {object_name}
      </td>
      <td style="width: 33%; text-align: center; padding: 10px;">
        <strong>Thủ quỹ</strong><br>
        <em>(Ký, ghi rõ họ tên)</em><br>
        <div style="height: 50px;"></div>
      </td>
      <td style="width: 33%; text-align: center; padding: 10px;">
        <strong>Người lập phiếu</strong><br>
        <em>(Ký, ghi rõ họ tên)</em><br>
        <div style="height: 50px;"></div>
        {account_name}
      </td>
    </tr>
  </tbody>
</table>

<!-- FOOTER -->
<div style="text-align: center; margin-top: 15px; padding-top: 8px; border-top: 1px dashed #333; font-size: 11px;">
  In lúc: {print_date} {print_time}
</div>

</div>
`;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/features/settings/printer/templates/warranty.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Mẫu in Phiếu bảo hành - TipTap compatible
 * Cập nhật: Thiết kế đen trắng cho máy in
 */ __turbopack_context__.s([
    "WARRANTY_TEMPLATE",
    ()=>WARRANTY_TEMPLATE
]);
const WARRANTY_TEMPLATE = `
<div style="font-family: Arial, sans-serif; font-size: 12px; line-height: 1.4; max-width: 800px; margin: 0 auto; padding: 10px;">

<!-- HEADER -->
<table style="width: 100%; margin-bottom: 10px;">
  <tr>
    <td style="width: 80px; vertical-align: top;">{store_logo}</td>
    <td style="vertical-align: top;">
      <div style="font-size: 14px; font-weight: bold; margin-bottom: 2px;">{store_name}</div>
      <div>{store_address}</div>
      <div>Hotline: <strong>{store_phone_number}</strong></div>
    </td>
  </tr>
</table>

<!-- TIÊU ĐỀ -->
<h2 style="text-align: center; margin: 15px 0 5px 0; font-size: 14px; font-weight: bold; margin-bottom: 2px; border-bottom: 2px solid #333; padding-bottom: 10px;">PHIẾU BẢO HÀNH</h2>
<div style="text-align: center; margin-bottom: 10px;">
  <div>Mã phiếu: <strong>{warranty_code}</strong></div>
  <div>Ngày: {created_on}</div>
</div>

<!-- THÔNG TIN KHÁCH HÀNG -->
<table style="width: 100%; border-collapse: collapse; margin-bottom: 10px; table-layout: fixed;">
  <tbody>
    <tr>
      <td style="padding: 4px 6px; width: 22%; background: #f5f5f5; border: 1px solid #333;">Khách hàng:</td>
      <td style="padding: 5px; border: 1px solid #333;"><strong>{customer_name}</strong></td>
      <td style="padding: 5px; width: 15%; background: #f5f5f5; border: 1px solid #333;">SĐT:</td>
      <td style="padding: 5px; border: 1px solid #333;">{customer_phone_number}</td>
    </tr>
    <tr>
      <td style="padding: 5px; background: #f5f5f5; border: 1px solid #333;">Địa chỉ:</td>
      <td style="padding: 5px; border: 1px solid #333;" colspan="3">{customer_address}</td>
    </tr>
  </tbody>
</table>

<!-- THÔNG TIN SẢN PHẨM BẢO HÀNH -->
<table style="width: 100%; border-collapse: collapse; margin-bottom: 10px; table-layout: fixed; border: 2px solid #333;">
  <tbody>
    <tr>
      <td style="padding: 8px; width: 25%; background: #f5f5f5; border: 1px solid #333;">Sản phẩm:</td>
      <td style="padding: 8px; border: 1px solid #333;"><strong>{product_name}</strong></td>
    </tr>
    <tr>
      <td style="padding: 8px; background: #f5f5f5; border: 1px solid #333;">Serial/IMEI:</td>
      <td style="padding: 8px; border: 1px solid #333; font-family: monospace; font-size: 14px;">{serial_number}</td>
    </tr>
    <tr>
      <td style="padding: 8px; background: #f5f5f5; border: 1px solid #333;">Thời hạn BH:</td>
      <td style="padding: 8px; border: 1px solid #333;">{warranty_duration}</td>
    </tr>
    <tr>
      <td style="padding: 8px; background: #f5f5f5; border: 1px solid #333;">Ngày hết hạn:</td>
      <td style="padding: 8px; border: 1px solid #333;"><strong>{warranty_expired_on}</strong></td>
    </tr>
  </tbody>
</table>

<!-- QUY ĐỊNH BẢO HÀNH -->
<table style="width: 100%; border-collapse: collapse; margin-bottom: 10px; table-layout: fixed;">
  <tr>
    <td style="width: 50%; padding: 10px; border: 1px solid #333; vertical-align: top;">
      <strong>ĐƯỢC BẢO HÀNH:</strong>
      <div style="padding-left: 10px; margin-top: 5px;">
        <div>- Còn trong thời hạn bảo hành</div>
        <div>- Tem bảo hành còn nguyên vẹn</div>
        <div>- Hư hỏng do lỗi kỹ thuật từ NSX</div>
      </div>
    </td>
    <td style="width: 50%; padding: 10px; border: 1px solid #333; vertical-align: top;">
      <strong>TỪ CHỐI BẢO HÀNH:</strong>
      <div style="padding-left: 10px; margin-top: 5px;">
        <div>- Rơi vỡ, trầy xước, biến dạng</div>
        <div>- Vào nước, ẩm, cháy, nổ</div>
        <div>- Tự ý tháo lắp, sửa chữa</div>
        <div>- Sử dụng sai cách, cố ý làm hư</div>
      </div>
    </td>
  </tr>
</table>

<!-- CHỮ KÝ -->
<table style="width: 100%; margin-top: 30px;">
  <tbody>
    <tr>
      <td style="width: 50%; text-align: center; padding: 10px;">
        <strong>Khách hàng</strong><br>
        <em>(Ký xác nhận)</em><br>
        <div style="height: 50px;"></div>
        {customer_name}
      </td>
      <td style="width: 50%; text-align: center; padding: 10px;">
        <strong>Nhân viên</strong><br>
        <em>(Ký, ghi rõ họ tên)</em><br>
        <div style="height: 50px;"></div>
        {account_name}
      </td>
    </tr>
  </tbody>
</table>

<!-- FOOTER -->
<div style="text-align: center; margin-top: 15px; padding-top: 8px; border-top: 1px dashed #333; font-size: 11px;">
  Cảm ơn quý khách đã tin tưởng sử dụng dịch vụ của chúng tôi!

  <div style="font-size: 10px; color: #666; margin-top: 5px;">In lúc: {print_date} {print_time}</div></div>

</div>
`;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/features/settings/printer/templates/inventory-check.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Mẫu in Phiếu kiểm kho - TipTap compatible
 * Cập nhật: Thiết kế đen trắng cho máy in
 */ __turbopack_context__.s([
    "INVENTORY_CHECK_TEMPLATE",
    ()=>INVENTORY_CHECK_TEMPLATE
]);
const INVENTORY_CHECK_TEMPLATE = `
<div style="font-family: Arial, sans-serif; font-size: 12px; line-height: 1.4; max-width: 800px; margin: 0 auto; padding: 10px;">

<!-- HEADER -->
<table style="width: 100%; margin-bottom: 10px;">
  <tr>
    <td style="width: 80px; vertical-align: top;">{store_logo}</td>
    <td style="vertical-align: top;">
      <div style="font-size: 14px; font-weight: bold; margin-bottom: 2px;">{store_name}</div>
      <div>{store_address}</div>
    </td>
  </tr>
</table>

<!-- TIÊU ĐỀ -->
<h2 style="text-align: center; margin: 15px 0 5px 0; font-size: 14px; font-weight: bold; margin-bottom: 2px; border-bottom: 2px solid #333; padding-bottom: 10px;">PHIẾU KIỂM KHO</h2>
<div style="text-align: center; margin-bottom: 10px;">
  <div>Mã phiếu: <strong>{inventory_code}</strong></div>
  <div>Ngày kiểm: {created_on}</div>
</div>

<!-- THÔNG TIN KHO -->
<table style="width: 100%; border-collapse: collapse; margin-bottom: 10px; table-layout: fixed;">
  <tbody>
    <tr>
      <td style="padding: 4px 6px; width: 22%; background: #f5f5f5; border: 1px solid #333;">Kho kiểm:</td>
      <td style="padding: 5px; border: 1px solid #333;"><strong>{location_name}</strong></td>
      <td style="padding: 4px 6px; width: 22%; background: #f5f5f5; border: 1px solid #333;">Trạng thái:</td>
      <td style="padding: 5px; border: 1px solid #333;">{inventory_status}</td>
    </tr>
    <tr>
      <td style="padding: 5px; background: #f5f5f5; border: 1px solid #333;">Người kiểm:</td>
      <td style="padding: 5px; border: 1px solid #333;" colspan="3">{account_name}</td>
    </tr>
  </tbody>
</table>

<!-- BẢNG SẢN PHẨM -->
<table style="width: 100%; border-collapse: collapse; margin-bottom: 10px; table-layout: fixed;">
  <thead>
    <tr style="background: #f5f5f5;">
      <th style="padding: 8px; border: 1px solid #333; text-align: center; width: 40px;">STT</th>
      <th style="padding: 8px; border: 1px solid #333; text-align: center; width: 100px;">Mã SP</th>
      <th style="padding: 8px; border: 1px solid #333; text-align: left;">Tên sản phẩm</th>
      <th style="padding: 8px; border: 1px solid #333; text-align: center; width: 70px;">Tồn kho</th>
      <th style="padding: 8px; border: 1px solid #333; text-align: center; width: 70px;">Thực tế</th>
      <th style="padding: 8px; border: 1px solid #333; text-align: center; width: 60px;">Lệch</th>
      <th style="padding: 8px; border: 1px solid #333; text-align: left; width: 100px;">Ghi chú</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td style="padding: 6px; border: 1px solid #333; text-align: center;">{line_stt}</td>
      <td style="padding: 6px; border: 1px solid #333; text-align: center; font-family: monospace;">{line_variant_code}</td>
      <td style="padding: 6px; border: 1px solid #333;">{line_product_name}<br><small>{line_variant}</small></td>
      <td style="padding: 6px; border: 1px solid #333; text-align: center;">{line_on_hand}</td>
      <td style="padding: 6px; border: 1px solid #333; text-align: center; font-weight: bold;">{line_real_quantity}</td>
      <td style="padding: 6px; border: 1px solid #333; text-align: center; font-weight: bold;">{line_difference}</td>
      <td style="padding: 6px; border: 1px solid #333; font-size: 11px;">{line_note}</td>
    </tr>
  </tbody>
</table>

<!-- TỔNG KẾT -->
<table style="width: 250px; margin-left: auto; border-collapse: collapse; margin-bottom: 10px; table-layout: fixed;">
  <tbody>
    <tr>
      <td style="padding: 5px; border: 1px solid #333;">Tổng số SP kiểm:</td>
      <td style="padding: 5px; border: 1px solid #333; text-align: right; width: 80px;"><strong>{total_items}</strong></td>
    </tr>
    <tr>
      <td style="padding: 5px; border: 1px solid #333;">Chênh lệch (thừa):</td>
      <td style="padding: 5px; border: 1px solid #333; text-align: right;"><strong>+{total_surplus}</strong></td>
    </tr>
    <tr>
      <td style="padding: 5px; border: 1px solid #333;">Chênh lệch (thiếu):</td>
      <td style="padding: 5px; border: 1px solid #333; text-align: right;"><strong>-{total_shortage}</strong></td>
    </tr>
  </tbody>
</table>

<!-- GHI CHÚ -->
<div style="margin: 10px 0; padding: 10px; background: #f5f5f5; border: 1px solid #333;">
  <strong>Ghi chú:</strong> {note}
</div>

<!-- CHỮ KÝ -->
<table style="width: 100%; margin-top: 30px;">
  <tbody>
    <tr>
      <td style="width: 50%; text-align: center; padding: 10px;">
        <strong>Người kiểm kho</strong><br>
        <em>(Ký, ghi rõ họ tên)</em><br>
        <div style="height: 50px;"></div>
        {account_name}
      </td>
      <td style="width: 50%; text-align: center; padding: 10px;">
        <strong>Thủ kho</strong><br>
        <em>(Ký, ghi rõ họ tên)</em><br>
        <div style="height: 50px;"></div>
      </td>
    </tr>
  </tbody>
</table>

<!-- FOOTER -->
<div style="text-align: center; margin-top: 15px; padding-top: 8px; border-top: 1px dashed #333; font-size: 11px;">
  In lúc: {print_date} {print_time}
</div>

</div>
`;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/features/settings/printer/templates/stock-transfer.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Mẫu in Phiếu chuyển kho - TipTap compatible
 * Cập nhật: Thiết kế đen trắng cho máy in
 */ __turbopack_context__.s([
    "STOCK_TRANSFER_TEMPLATE",
    ()=>STOCK_TRANSFER_TEMPLATE
]);
const STOCK_TRANSFER_TEMPLATE = `
<div style="font-family: Arial, sans-serif; font-size: 12px; line-height: 1.4; max-width: 800px; margin: 0 auto; padding: 10px;">

<!-- HEADER -->
<table style="width: 100%; margin-bottom: 10px;">
  <tr>
    <td style="width: 80px; vertical-align: top;">{store_logo}</td>
    <td style="vertical-align: top;">
      <div style="font-size: 14px; font-weight: bold; margin-bottom: 2px;">{store_name}</div>
      <div>{store_address}</div>
    </td>
  </tr>
</table>

<!-- TIÊU ĐỀ -->
<h2 style="text-align: center; margin: 15px 0 5px 0; font-size: 14px; font-weight: bold; margin-bottom: 2px; border-bottom: 2px solid #333; padding-bottom: 10px;">PHIẾU CHUYỂN KHO</h2>
<div style="text-align: center; margin-bottom: 10px;">
  <div>Mã phiếu: <strong>{transfer_code}</strong></div>
  <div>Ngày: {created_on}</div>
</div>

<!-- THÔNG TIN CHUYỂN KHO -->
<table style="width: 100%; border-collapse: collapse; margin-bottom: 10px; table-layout: fixed;">
  <tbody>
    <tr>
      <td style="padding: 10px; width: 45%; border: 2px solid #333; text-align: center;">
        <div style="font-size: 12px;">KHO XUẤT</div>
        <div style="font-size: 14px; font-weight: bold; margin-bottom: 2px;">{source_location_name}</div>
      </td>
      <td style="padding: 10px; text-align: center; font-size: 20px; width: 10%;">--&gt;</td>
      <td style="padding: 10px; width: 45%; border: 2px solid #333; text-align: center;">
        <div style="font-size: 12px;">KHO NHẬP</div>
        <div style="font-size: 14px; font-weight: bold; margin-bottom: 2px;">{target_location_name}</div>
      </td>
    </tr>
  </tbody>
</table>

<table style="width: 100%; border-collapse: collapse; margin-bottom: 10px; table-layout: fixed;">
  <tbody>
    <tr>
      <td style="padding: 4px 6px; width: 22%; background: #f5f5f5; border: 1px solid #333;">Trạng thái:</td>
      <td style="padding: 5px; border: 1px solid #333;"><strong>{status}</strong></td>
      <td style="padding: 4px 6px; width: 22%; background: #f5f5f5; border: 1px solid #333;">Người tạo:</td>
      <td style="padding: 5px; border: 1px solid #333;">{account_name}</td>
    </tr>
  </tbody>
</table>

<!-- BẢNG SẢN PHẨM -->
<table style="width: 100%; border-collapse: collapse; margin-bottom: 10px; table-layout: fixed;">
  <thead>
    <tr style="background: #f5f5f5;">
      <th style="padding: 8px; border: 1px solid #333; text-align: center; width: 40px;">STT</th>
      <th style="padding: 8px; border: 1px solid #333; text-align: center; width: 100px;">Mã SP</th>
      <th style="padding: 8px; border: 1px solid #333; text-align: left;">Tên sản phẩm</th>
      <th style="padding: 8px; border: 1px solid #333; text-align: center; width: 60px;">ĐVT</th>
      <th style="padding: 8px; border: 1px solid #333; text-align: center; width: 80px;">Số lượng</th>
      <th style="padding: 8px; border: 1px solid #333; text-align: center; width: 40px;">OK</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td style="padding: 6px; border: 1px solid #333; text-align: center;">{line_stt}</td>
      <td style="padding: 6px; border: 1px solid #333; text-align: center; font-family: monospace;">{line_variant_code}</td>
      <td style="padding: 6px; border: 1px solid #333;">{line_product_name}<br><small>{line_variant}</small></td>
      <td style="padding: 6px; border: 1px solid #333; text-align: center;">{line_unit}</td>
      <td style="padding: 6px; border: 1px solid #333; text-align: center; font-weight: bold;">{line_quantity}</td>
      <td style="padding: 6px; border: 1px solid #333; text-align: center;"><div style="width: 16px; height: 16px; border: 1px solid #333; margin: 0 auto;"></div></td>
    </tr>
  </tbody>
</table>

<!-- TỔNG CỘNG -->
<table style="width: 250px; margin-left: auto; border-collapse: collapse; margin-bottom: 10px; table-layout: fixed;">
  <tbody>
    <tr style="background: #f5f5f5;">
      <td style="padding: 5px; border: 1px solid #333;"><strong>Tổng số lượng:</strong></td>
      <td style="padding: 5px; border: 1px solid #333; text-align: right;"><strong>{total_quantity}</strong></td>
    </tr>
  </tbody>
</table>

<!-- GHI CHÚ -->
<div style="margin: 10px 0; padding: 10px; background: #f5f5f5; border: 1px solid #333;">
  <strong>Ghi chú:</strong> {note}
</div>

<!-- CHỮ KÝ -->
<table style="width: 100%; margin-top: 30px;">
  <tbody>
    <tr>
      <td style="width: 33%; text-align: center; padding: 10px;">
        <strong>Người lập phiếu</strong><br>
        <em>(Ký, ghi rõ họ tên)</em><br>
        <div style="height: 50px;"></div>
        {account_name}
      </td>
      <td style="width: 33%; text-align: center; padding: 10px;">
        <strong>Thủ kho xuất</strong><br>
        <em>(Ký, ghi rõ họ tên)</em><br>
        <div style="height: 50px;"></div>
      </td>
      <td style="width: 33%; text-align: center; padding: 10px;">
        <strong>Thủ kho nhập</strong><br>
        <em>(Ký, ghi rõ họ tên)</em><br>
        <div style="height: 50px;"></div>
      </td>
    </tr>
  </tbody>
</table>

<!-- FOOTER -->
<div style="text-align: center; margin-top: 15px; padding-top: 8px; border-top: 1px dashed #333; font-size: 11px;">
  In lúc: {print_date} {print_time}
</div>

</div>
`;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/features/settings/printer/templates/sales-return.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Mẫu in Phiếu trả hàng - TipTap compatible
 * Cập nhật: Thiết kế đen trắng cho máy in
 */ __turbopack_context__.s([
    "SALES_RETURN_TEMPLATE",
    ()=>SALES_RETURN_TEMPLATE
]);
const SALES_RETURN_TEMPLATE = `
<div style="font-family: Arial, sans-serif; font-size: 12px; line-height: 1.4; max-width: 800px; margin: 0 auto; padding: 10px;">

<!-- HEADER -->
<table style="width: 100%; margin-bottom: 10px;">
  <tr>
    <td style="width: 80px; vertical-align: top;">{store_logo}</td>
    <td style="vertical-align: top;">
      <div style="font-size: 14px; font-weight: bold; margin-bottom: 2px;">{store_name}</div>
      <div>{store_address}</div>
    </td>
  </tr>
</table>

<!-- TIÊU ĐỀ -->
<h2 style="text-align: center; margin: 15px 0 5px 0; font-size: 14px; font-weight: bold; margin-bottom: 2px; border-bottom: 2px solid #333; padding-bottom: 10px;">PHIẾU TRẢ HÀNG</h2>
<div style="text-align: center; margin-bottom: 10px;">
  <div>Số: <strong>{order_return_code}</strong></div>
  <div>Đơn hàng gốc: <strong>{order_code}</strong></div>
  <div>Ngày: {created_on}</div>
</div>

<!-- THÔNG TIN KHÁCH HÀNG -->
<table style="width: 100%; border-collapse: collapse; margin-bottom: 10px; table-layout: fixed;">
  <tbody>
    <tr>
      <td style="padding: 4px 6px; width: 22%; background: #f5f5f5; border: 1px solid #333;">Khách hàng:</td>
      <td style="padding: 5px; border: 1px solid #333;"><strong>{customer_name}</strong></td>
      <td style="padding: 5px; width: 15%; background: #f5f5f5; border: 1px solid #333;">SĐT:</td>
      <td style="padding: 5px; border: 1px solid #333;">{customer_phone_number}</td>
    </tr>
    <tr>
      <td style="padding: 5px; background: #f5f5f5; border: 1px solid #333;">Lý do trả:</td>
      <td style="padding: 5px; border: 1px solid #333;" colspan="3"><strong>{reason_return}</strong></td>
    </tr>
  </tbody>
</table>

<!-- BẢNG SẢN PHẨM TRẢ -->
<table style="width: 100%; border-collapse: collapse; margin-bottom: 10px; table-layout: fixed;">
  <thead>
    <tr style="background: #f5f5f5;">
      <th style="padding: 8px; border: 1px solid #333; text-align: center; width: 40px;">STT</th>
      <th style="padding: 8px; border: 1px solid #333; text-align: center; width: 100px;">Mã SP</th>
      <th style="padding: 8px; border: 1px solid #333; text-align: left;">Tên sản phẩm</th>
      <th style="padding: 8px; border: 1px solid #333; text-align: center; width: 60px;">ĐVT</th>
      <th style="padding: 8px; border: 1px solid #333; text-align: center; width: 60px;">SL Trả</th>
      <th style="padding: 8px; border: 1px solid #333; text-align: right; width: 100px;">Đơn giá</th>
      <th style="padding: 8px; border: 1px solid #333; text-align: right; width: 110px;">Thành tiền</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td style="padding: 6px; border: 1px solid #333; text-align: center;">{line_stt}</td>
      <td style="padding: 6px; border: 1px solid #333; text-align: center; font-family: monospace;">{line_variant_code}</td>
      <td style="padding: 6px; border: 1px solid #333;">{line_product_name}<br><small>{line_variant}</small></td>
      <td style="padding: 6px; border: 1px solid #333; text-align: center;">{line_unit}</td>
      <td style="padding: 6px; border: 1px solid #333; text-align: center; font-weight: bold;">{line_quantity}</td>
      <td style="padding: 6px; border: 1px solid #333; text-align: right;">{line_price}</td>
      <td style="padding: 6px; border: 1px solid #333; text-align: right;">{line_total}</td>
    </tr>
  </tbody>
</table>

<!-- TỔNG TIỀN HOÀN -->
<table style="width: 250px; margin-left: auto; border-collapse: collapse; margin-bottom: 10px; table-layout: fixed;">
  <tbody>
    <tr>
      <td style="padding: 5px; border: 1px solid #333;">Tổng số lượng trả:</td>
      <td style="padding: 5px; border: 1px solid #333; text-align: right; width: 100px;"><strong>{total_quantity}</strong></td>
    </tr>
    <tr style="background: #f5f5f5;">
      <td style="padding: 5px; border: 1px solid #333;"><strong>TỔNG TIỀN HOÀN:</strong></td>
      <td style="padding: 5px; border: 1px solid #333; text-align: right;"><strong>{total}</strong></td>
    </tr>
    <tr>
      <td style="padding: 5px; border: 1px solid #333;">Trạng thái hoàn:</td>
      <td style="padding: 5px; border: 1px solid #333; text-align: right;">{refund_status}</td>
    </tr>
  </tbody>
</table>

<!-- GHI CHÚ -->
<div style="margin: 10px 0; padding: 10px; background: #f5f5f5; border: 1px solid #333;">
  <strong>Ghi chú:</strong> {note}
</div>

<!-- CHỮ KÝ -->
<table style="width: 100%; margin-top: 30px;">
  <tbody>
    <tr>
      <td style="width: 50%; text-align: center; padding: 10px;">
        <strong>Khách hàng</strong><br>
        <em>(Ký, ghi rõ họ tên)</em><br>
        <div style="height: 50px;"></div>
        {customer_name}
      </td>
      <td style="width: 50%; text-align: center; padding: 10px;">
        <strong>Người nhận hàng trả</strong><br>
        <em>(Ký, ghi rõ họ tên)</em><br>
        <div style="height: 50px;"></div>
        {account_name}
      </td>
    </tr>
  </tbody>
</table>

<!-- FOOTER -->
<div style="text-align: center; margin-top: 15px; padding-top: 8px; border-top: 1px dashed #333; font-size: 11px;">
  Hotline: {store_phone_number}

  <div style="font-size: 10px; color: #666; margin-top: 5px;">In lúc: {print_date} {print_time}</div></div>

</div>
`;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/features/settings/printer/templates/purchase-order.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Mẫu in Đơn đặt hàng nhập - TipTap compatible
 * Cập nhật: Thiết kế đen trắng cho máy in
 */ __turbopack_context__.s([
    "PURCHASE_ORDER_TEMPLATE",
    ()=>PURCHASE_ORDER_TEMPLATE
]);
const PURCHASE_ORDER_TEMPLATE = `
<div style="font-family: Arial, sans-serif; font-size: 12px; line-height: 1.4; max-width: 800px; margin: 0 auto; padding: 10px;">

<!-- HEADER -->
<table style="width: 100%; margin-bottom: 10px;">
  <tr>
    <td style="width: 80px; vertical-align: top;">{store_logo}</td>
    <td style="vertical-align: top;">
      <div style="font-size: 14px; font-weight: bold; margin-bottom: 2px;">{store_name}</div>
      <div>{store_address}</div>
    </td>
  </tr>
</table>

<!-- TIÊU ĐỀ -->
<h2 style="text-align: center; margin: 15px 0 5px 0; font-size: 14px; font-weight: bold; margin-bottom: 2px; border-bottom: 2px solid #333; padding-bottom: 10px;">ĐƠN ĐẶT HÀNG NHẬP</h2>
<div style="text-align: center; margin-bottom: 10px;">
  <div>Số: <strong>{order_supplier_code}</strong></div>
  <div>Ngày: {created_on}</div>
</div>

<!-- THÔNG TIN NHÀ CUNG CẤP -->
<table style="width: 100%; border-collapse: collapse; margin-bottom: 10px; table-layout: fixed;">
  <tbody>
    <tr>
      <td style="padding: 4px 6px; width: 22%; background: #f5f5f5; border: 1px solid #333;">Nhà cung cấp:</td>
      <td style="padding: 5px; border: 1px solid #333;"><strong>{supplier_name}</strong></td>
      <td style="padding: 5px; width: 15%; background: #f5f5f5; border: 1px solid #333;">Mã NCC:</td>
      <td style="padding: 5px; border: 1px solid #333; font-family: monospace;">{supplier_code}</td>
    </tr>
    <tr>
      <td style="padding: 5px; background: #f5f5f5; border: 1px solid #333;">Điện thoại:</td>
      <td style="padding: 5px; border: 1px solid #333;">{supplier_phone_number}</td>
      <td style="padding: 5px; background: #f5f5f5; border: 1px solid #333;">Email:</td>
      <td style="padding: 5px; border: 1px solid #333;">{supplier_email}</td>
    </tr>
    <tr>
      <td style="padding: 5px; background: #f5f5f5; border: 1px solid #333;">Địa chỉ:</td>
      <td style="padding: 5px; border: 1px solid #333;" colspan="3">{supplier_address}</td>
    </tr>
  </tbody>
</table>

<!-- BẢNG SẢN PHẨM -->
<table style="width: 100%; border-collapse: collapse; margin-bottom: 10px; table-layout: fixed;">
  <thead>
    <tr style="background: #f5f5f5;">
      <th style="padding: 8px; border: 1px solid #333; text-align: center; width: 40px;">STT</th>
      <th style="padding: 8px; border: 1px solid #333; text-align: center; width: 100px;">Mã SP</th>
      <th style="padding: 8px; border: 1px solid #333; text-align: left;">Tên sản phẩm</th>
      <th style="padding: 8px; border: 1px solid #333; text-align: center; width: 60px;">ĐVT</th>
      <th style="padding: 8px; border: 1px solid #333; text-align: center; width: 60px;">SL Đặt</th>
      <th style="padding: 8px; border: 1px solid #333; text-align: right; width: 100px;">Đơn giá</th>
      <th style="padding: 8px; border: 1px solid #333; text-align: right; width: 110px;">Thành tiền</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td style="padding: 6px; border: 1px solid #333; text-align: center;">{line_stt}</td>
      <td style="padding: 6px; border: 1px solid #333; text-align: center; font-family: monospace;">{line_variant_code}</td>
      <td style="padding: 6px; border: 1px solid #333;">{line_product_name}<br><small>{line_variant}</small></td>
      <td style="padding: 6px; border: 1px solid #333; text-align: center;">{line_unit}</td>
      <td style="padding: 6px; border: 1px solid #333; text-align: center;">{line_ordered_quantity}</td>
      <td style="padding: 6px; border: 1px solid #333; text-align: right;">{line_price}</td>
      <td style="padding: 6px; border: 1px solid #333; text-align: right;">{line_total}</td>
    </tr>
  </tbody>
</table>

<!-- TỔNG TIỀN -->
<table style="width: 250px; margin-left: auto; border-collapse: collapse; margin-bottom: 10px; table-layout: fixed;">
  <tbody>
    <tr>
      <td style="padding: 5px; border: 1px solid #333;">Tổng tiền hàng:</td>
      <td style="padding: 5px; border: 1px solid #333; text-align: right; width: 100px;">{total}</td>
    </tr>
    <tr>
      <td style="padding: 5px; border: 1px solid #333;">Chiết khấu:</td>
      <td style="padding: 5px; border: 1px solid #333; text-align: right;">{discount}</td>
    </tr>
    <tr>
      <td style="padding: 5px; border: 1px solid #333;">Thuế VAT:</td>
      <td style="padding: 5px; border: 1px solid #333; text-align: right;">{tax_vat}</td>
    </tr>
    <tr style="background: #f5f5f5;">
      <td style="padding: 5px; border: 1px solid #333;"><strong>TỔNG CỘNG:</strong></td>
      <td style="padding: 5px; border: 1px solid #333; text-align: right;"><strong>{total_order}</strong></td>
    </tr>
  </tbody>
</table>

<!-- GHI CHÚ -->
<div style="margin: 10px 0; padding: 10px; background: #f5f5f5; border: 1px solid #333;">
  <strong>Ghi chú:</strong> {note}
</div>

<!-- CHỮ KÝ -->
<table style="width: 100%; margin-top: 30px;">
  <tbody>
    <tr>
      <td style="width: 50%; text-align: center; padding: 10px;">
        <strong>Người lập đơn</strong><br>
        <em>(Ký, ghi rõ họ tên)</em><br>
        <div style="height: 50px;"></div>
        {account_name}
      </td>
      <td style="width: 50%; text-align: center; padding: 10px;">
        <strong>Duyệt đơn</strong><br>
        <em>(Ký, ghi rõ họ tên)</em><br>
        <div style="height: 50px;"></div>
      </td>
    </tr>
  </tbody>
</table>

<!-- FOOTER -->
<div style="text-align: center; margin-top: 15px; padding-top: 8px; border-top: 1px dashed #333; font-size: 11px;">
  In lúc: {print_date} {print_time}
</div>

</div>
`;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/features/settings/printer/templates/packing.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Mẫu in Phiếu đóng gói - TipTap compatible
 * Cập nhật: 2025-12-08 - Responsive + Chuẩn hóa
 */ __turbopack_context__.s([
    "PACKING_TEMPLATE",
    ()=>PACKING_TEMPLATE
]);
const PACKING_TEMPLATE = `
<div style="font-family: Arial, sans-serif; font-size: 12px; line-height: 1.4; max-width: 800px; margin: 0 auto; padding: 10px;">

<!-- HEADER -->
<table style="width: 100%; margin-bottom: 12px; border-collapse: collapse;">
  <tr>
    <td style="width: 70px; vertical-align: top; padding-right: 10px;">{store_logo}</td>
    <td style="vertical-align: top;">
      <div style="font-size: 14px; font-weight: bold; margin-bottom: 2px;">{store_name}</div>
      <div style="font-size: 11px; color: #333;">{store_address}</div>
    </td>
  </tr>
</table>

<!-- TIÊU ĐỀ -->
<h2 style="text-align: center; margin: 12px 0 5px 0; font-size: 14px; font-weight: bold; margin-bottom: 2px; border-bottom: 2px solid #333; padding-bottom: 8px;">PHIẾU ĐÓNG GÓI</h2>
<div style="text-align: center; margin-bottom: 12px; font-size: 11px;">
  <div>Mã: <strong>{fulfillment_code}</strong> | Đơn hàng: <strong>{order_code}</strong></div>
  <div>Ngày: {created_on}</div>
</div>

<!-- THÔNG TIN -->
<table style="width: 100%; border-collapse: collapse; margin-bottom: 10px;">
  <tbody>
    <tr>
      <td style="padding: 4px 6px; width: 22%; background: #f5f5f5; border: 1px solid #333; font-size: 11px;">Khách hàng:</td>
      <td style="padding: 4px 6px; border: 1px solid #333; font-size: 11px;"><strong>{customer_name}</strong></td>
      <td style="padding: 4px 6px; width: 15%; background: #f5f5f5; border: 1px solid #333; font-size: 11px;">SĐT:</td>
      <td style="padding: 4px 6px; border: 1px solid #333; font-size: 11px;">{customer_phone_number}</td>
    </tr>
    <tr>
      <td style="padding: 4px 6px; background: #f5f5f5; border: 1px solid #333; font-size: 11px;">Địa chỉ giao:</td>
      <td style="padding: 4px 6px; border: 1px solid #333; font-size: 11px;" colspan="3">{shipping_address}</td>
    </tr>
    <tr>
      <td style="padding: 4px 6px; background: #f5f5f5; border: 1px solid #333; font-size: 11px;">NV được gán:</td>
      <td style="padding: 4px 6px; border: 1px solid #333; font-size: 11px;" colspan="3">{assigned_employee}</td>
    </tr>
  </tbody>
</table>

<!-- BẢNG SẢN PHẨM - Responsive -->
<table style="width: 100%; border-collapse: collapse; margin-bottom: 10px; table-layout: fixed;">
  <thead>
    <tr style="background: #f5f5f5;">
      <th style="padding: 5px 3px; border: 1px solid #333; text-align: center; width: 28px; font-size: 10px;">STT</th>
      <th style="padding: 5px 3px; border: 1px solid #333; text-align: center; width: 70px; font-size: 10px;">Mã SP</th>
      <th style="padding: 5px 3px; border: 1px solid #333; text-align: left; font-size: 10px;">Tên sản phẩm</th>
      <th style="padding: 5px 3px; border: 1px solid #333; text-align: center; width: 35px; font-size: 10px;">SL</th>
      <th style="padding: 5px 3px; border: 1px solid #333; text-align: center; width: 55px; font-size: 10px;">Vị trí</th>
      <th style="padding: 5px 3px; border: 1px solid #333; text-align: left; width: 70px; font-size: 10px;">Ghi chú</th>
      <th style="padding: 5px 3px; border: 1px solid #333; text-align: center; width: 28px; font-size: 10px;">OK</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td style="padding: 4px 3px; border: 1px solid #333; text-align: center; font-size: 10px;">{line_stt}</td>
      <td style="padding: 4px 3px; border: 1px solid #333; text-align: center; font-family: monospace; font-size: 9px;">{line_variant_code}</td>
      <td style="padding: 4px 3px; border: 1px solid #333; font-size: 10px; word-wrap: break-word;">{line_product_name}</td>
      <td style="padding: 4px 3px; border: 1px solid #333; text-align: center; font-weight: bold; font-size: 11px;">{line_quantity}</td>
      <td style="padding: 4px 3px; border: 1px solid #333; text-align: center; font-size: 10px;">{bin_location}</td>
      <td style="padding: 4px 3px; border: 1px solid #333; font-size: 9px;">{line_note}</td>
      <td style="padding: 4px 3px; border: 1px solid #333; text-align: center;"><div style="width: 14px; height: 14px; border: 1px solid #333; margin: 0 auto;"></div></td>
    </tr>
  </tbody>
</table>

<!-- TỔNG CỘNG VÀ COD -->
<table style="width: 220px; margin-left: auto; border-collapse: collapse; margin-bottom: 10px;">
  <tbody>
    <tr>
      <td style="padding: 4px 6px; border: 1px solid #333; font-size: 11px;">Tổng số lượng:</td>
      <td style="padding: 4px 6px; border: 1px solid #333; text-align: right; width: 75px; font-size: 11px;"><strong>{total_quantity}</strong></td>
    </tr>
    <tr style="background: #f5f5f5;">
      <td style="padding: 5px 6px; border: 1px solid #333; font-size: 11px;"><strong>COD - THU HỘ:</strong></td>
      <td style="padding: 5px 6px; border: 1px solid #333; text-align: right; font-size: 11px;"><strong>{cod}</strong></td>
    </tr>
  </tbody>
</table>

<!-- GHI CHÚ -->
<div style="margin: 8px 0; padding: 8px; background: #f5f5f5; border: 1px solid #333; font-size: 11px;">
  <strong>Ghi chú đóng gói:</strong> {packing_note}
</div>
<div style="margin: 8px 0; padding: 8px; border: 1px solid #333; font-size: 11px;">
  <strong>Ghi chú đơn hàng:</strong> {order_note}
</div>

<!-- CHỮ KÝ -->
<table style="width: 100%; margin-top: 25px;">
  <tbody>
    <tr>
      <td style="width: 50%; text-align: center; padding: 8px; vertical-align: top;">
        <div style="font-weight: bold; font-size: 11px;">Người đóng gói</div>
        <div style="color: #888; font-size: 10px; font-style: italic;">(Ký, ghi rõ họ tên)</div>
        <div style="height: 50px;"></div>
        <div style="font-size: 11px;">{account_name}</div>
      </td>
      <td style="width: 50%; text-align: center; padding: 8px; vertical-align: top;">
        <div style="font-weight: bold; font-size: 11px;">Kiểm tra</div>
        <div style="color: #888; font-size: 10px; font-style: italic;">(Ký, ghi rõ họ tên)</div>
        <div style="height: 50px;"></div>
      </td>
    </tr>
  </tbody>
</table>

<!-- FOOTER -->
<div style="text-align: center; margin-top: 15px; padding-top: 8px; border-top: 1px dashed #333; font-size: 10px; color: #666;">
  In lúc: {print_date} {print_time}
</div>

</div>
`;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/features/settings/printer/templates/delivery.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Mẫu in Phiếu giao hàng - TipTap compatible
 * Cập nhật: 2025-12-08 - Responsive + Chuẩn hóa
 */ __turbopack_context__.s([
    "DELIVERY_TEMPLATE",
    ()=>DELIVERY_TEMPLATE
]);
const DELIVERY_TEMPLATE = `
<div style="font-family: Arial, sans-serif; font-size: 12px; line-height: 1.4; max-width: 800px; margin: 0 auto; padding: 10px;">

<!-- HEADER -->
<table style="width: 100%; margin-bottom: 12px; border-collapse: collapse;">
  <tr>
    <td style="width: 70px; vertical-align: top; padding-right: 10px;">{store_logo}</td>
    <td style="vertical-align: top;">
      <div style="font-size: 14px; font-weight: bold; margin-bottom: 2px;">{store_name}</div>
      <div style="font-size: 11px; color: #333;">{store_address}</div>
      <div style="font-size: 11px; color: #333;">ĐT: {store_phone_number}</div>
    </td>
  </tr>
</table>

<!-- TIÊU ĐỀ -->
<h2 style="text-align: center; margin: 12px 0 5px 0; font-size: 14px; font-weight: bold; margin-bottom: 2px; border-bottom: 2px solid #333; padding-bottom: 8px;">PHIẾU GIAO HÀNG</h2>
<div style="text-align: center; margin-bottom: 12px; font-size: 11px;">
  <div>Mã: <strong>{delivery_code}</strong> | Đơn hàng: <strong>{order_code}</strong></div>
  <div>Ngày: {created_on} {created_on_time}</div>
</div>

<!-- MÃ VẠCH VẬN ĐƠN -->
<table style="width: 100%; margin-bottom: 10px;">
  <tr>
    <td style="text-align: center; padding: 8px; border: 1px solid #333; background: #f5f5f5;">
      <div style="margin-bottom: 5px;">{shipment_barcode}</div>
      <div style="font-size: 14px; font-weight: bold; font-family: monospace;">{tracking_number}</div>
      <div style="font-size: 10px;">Đối tác: {carrier_name}</div>
    </td>
  </tr>
</table>

<!-- THÔNG TIN NGƯỜI NHẬN -->
<table style="width: 100%; border-collapse: collapse; margin-bottom: 10px;">
  <tbody>
    <tr>
      <td style="padding: 4px 6px; width: 22%; background: #f5f5f5; border: 1px solid #333; font-size: 11px;">Người nhận:</td>
      <td style="padding: 4px 6px; border: 1px solid #333; font-size: 11px;"><strong>{receiver_name}</strong></td>
      <td style="padding: 4px 6px; width: 15%; background: #f5f5f5; border: 1px solid #333; font-size: 11px;">SĐT:</td>
      <td style="padding: 4px 6px; border: 1px solid #333; font-size: 11px;">{receiver_phone}</td>
    </tr>
    <tr>
      <td style="padding: 4px 6px; background: #f5f5f5; border: 1px solid #333; font-size: 11px;">Địa chỉ giao:</td>
      <td style="padding: 4px 6px; border: 1px solid #333; font-size: 11px;" colspan="3">{shipping_address}</td>
    </tr>
    <tr>
      <td style="padding: 4px 6px; background: #f5f5f5; border: 1px solid #333; font-size: 11px;">NV giao hàng:</td>
      <td style="padding: 4px 6px; border: 1px solid #333; font-size: 11px;">{shipper_name}</td>
      <td style="padding: 4px 6px; background: #f5f5f5; border: 1px solid #333; font-size: 11px;">Trạng thái:</td>
      <td style="padding: 4px 6px; border: 1px solid #333; font-size: 11px;">{delivery_status}</td>
    </tr>
  </tbody>
</table>

<!-- BẢNG SẢN PHẨM - Responsive -->
<table style="width: 100%; border-collapse: collapse; margin-bottom: 10px; table-layout: fixed;">
  <thead>
    <tr style="background: #f5f5f5;">
      <th style="padding: 5px 3px; border: 1px solid #333; text-align: center; width: 28px; font-size: 10px;">STT</th>
      <th style="padding: 5px 3px; border: 1px solid #333; text-align: center; width: 70px; font-size: 10px;">Mã SP</th>
      <th style="padding: 5px 3px; border: 1px solid #333; text-align: left; font-size: 10px;">Tên sản phẩm</th>
      <th style="padding: 5px 3px; border: 1px solid #333; text-align: center; width: 32px; font-size: 10px;">ĐVT</th>
      <th style="padding: 5px 3px; border: 1px solid #333; text-align: center; width: 30px; font-size: 10px;">SL</th>
      <th style="padding: 5px 3px; border: 1px solid #333; text-align: right; width: 60px; font-size: 10px;">Đơn giá</th>
      <th style="padding: 5px 3px; border: 1px solid #333; text-align: right; width: 70px; font-size: 10px;">Thành tiền</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td style="padding: 4px 3px; border: 1px solid #333; text-align: center; font-size: 10px;">{line_stt}</td>
      <td style="padding: 4px 3px; border: 1px solid #333; text-align: center; font-family: monospace; font-size: 9px;">{line_variant_code}</td>
      <td style="padding: 4px 3px; border: 1px solid #333; font-size: 10px; word-wrap: break-word;">{line_product_name}<br><small style="color: #666;">{line_variant}</small></td>
      <td style="padding: 4px 3px; border: 1px solid #333; text-align: center; font-size: 10px;">{line_unit}</td>
      <td style="padding: 4px 3px; border: 1px solid #333; text-align: center; font-weight: bold; font-size: 11px;">{line_quantity}</td>
      <td style="padding: 4px 3px; border: 1px solid #333; text-align: right; font-size: 10px;">{line_price}</td>
      <td style="padding: 4px 3px; border: 1px solid #333; text-align: right; font-size: 10px;">{line_amount}</td>
    </tr>
  </tbody>
</table>

<!-- TỔNG GIÁ TRỊ -->
<table style="width: 250px; margin-left: auto; border-collapse: collapse; margin-bottom: 10px;">
  <tbody>
    <tr>
      <td style="padding: 4px 6px; border: 1px solid #333; font-size: 11px;">Tổng số lượng:</td>
      <td style="padding: 4px 6px; border: 1px solid #333; text-align: right; width: 85px; font-size: 11px;"><strong>{total_quantity}</strong></td>
    </tr>
    <tr>
      <td style="padding: 4px 6px; border: 1px solid #333; font-size: 11px;">Tổng tiền hàng:</td>
      <td style="padding: 4px 6px; border: 1px solid #333; text-align: right; font-size: 11px;">{total}</td>
    </tr>
    <tr>
      <td style="padding: 4px 6px; border: 1px solid #333; font-size: 11px;">Phí vận chuyển:</td>
      <td style="padding: 4px 6px; border: 1px solid #333; text-align: right; font-size: 11px;">{delivery_fee}</td>
    </tr>
    <tr style="background: #f5f5f5;">
      <td style="padding: 5px 6px; border: 1px solid #333; font-size: 11px;"><strong>COD - THU HỘ:</strong></td>
      <td style="padding: 5px 6px; border: 1px solid #333; text-align: right; font-size: 11px;"><strong>{cod_amount}</strong></td>
    </tr>
  </tbody>
</table>

<!-- GHI CHÚ -->
<div style="margin: 8px 0; padding: 8px; background: #f5f5f5; border: 1px solid #333; font-size: 11px;">
  <strong>Ghi chú:</strong> {note}
</div>

<!-- CHỮ KÝ -->
<table style="width: 100%; margin-top: 25px;">
  <tbody>
    <tr>
      <td style="width: 50%; text-align: center; padding: 8px; vertical-align: top;">
        <div style="font-weight: bold; font-size: 11px;">Người giao</div>
        <div style="color: #888; font-size: 10px; font-style: italic;">(Ký, ghi rõ họ tên)</div>
        <div style="height: 50px;"></div>
        <div style="font-size: 11px;">{shipper_name}</div>
      </td>
      <td style="width: 50%; text-align: center; padding: 8px; vertical-align: top;">
        <div style="font-weight: bold; font-size: 11px;">Người nhận</div>
        <div style="color: #888; font-size: 10px; font-style: italic;">(Ký, ghi rõ họ tên)</div>
        <div style="height: 50px;"></div>
        <div style="font-size: 11px;">{receiver_name}</div>
      </td>
    </tr>
  </tbody>
</table>

<!-- FOOTER -->
<div style="text-align: center; margin-top: 15px; padding-top: 8px; border-top: 1px dashed #333; font-size: 10px; color: #666;">
  <div>Cảm ơn quý khách!</div>
  <div>Hotline: {store_phone_number} | In lúc: {print_date} {print_time}</div>
</div>

</div>
`;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/features/settings/printer/templates/shipping-label.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Mẫu in Nhãn giao hàng - TipTap compatible
 * Cập nhật: Thiết kế đen trắng cho máy in
 */ __turbopack_context__.s([
    "SHIPPING_LABEL_TEMPLATE",
    ()=>SHIPPING_LABEL_TEMPLATE,
    "SHIPPING_LABEL_TEMPLATE_LARGE",
    ()=>SHIPPING_LABEL_TEMPLATE_LARGE,
    "SHIPPING_LABEL_TEMPLATE_SMALL",
    ()=>SHIPPING_LABEL_TEMPLATE_SMALL
]);
const SHIPPING_LABEL_TEMPLATE = `
<div style="font-family: Arial, sans-serif; font-size: 13px; line-height: 1.4; max-width: 400px; margin: 0 auto; border: 2px solid #333; padding: 15px;">

<!-- HEADER -->
<div style="text-align: center; margin-bottom: 10px; padding-bottom: 10px; border-bottom: 2px dashed #333;">
  <div style="font-size: 14px; font-weight: bold;">{store_name}</div>
  <div style="font-size: 12px;">{store_phone_number}</div>
</div>

<!-- MÃ VẬN ĐƠN -->
<div style="text-align: center; margin-bottom: 10px; padding: 10px; background: #f5f5f5;">
  <div style="margin-bottom: 8px;">{shipment_barcode}</div>
  <div style="font-size: 18px; font-weight: bold; font-family: monospace;">{shipment_code}</div>
  <div style="font-size: 12px;">Đơn: {order_code}</div>
</div>

<!-- NGƯỜI GỬI -->
<div style="margin-bottom: 10px; padding: 8px; background: #f5f5f5;">
  <div style="font-weight: bold; font-size: 11px;">Gửi:</div>
  <div><strong>{store_name}</strong></div>
  <div style="font-size: 11px;">{store_address}</div>
</div>

<!-- NGƯỜI NHẬN -->
<div style="margin-bottom: 10px; padding: 10px; border: 1px solid #333;">
  <div style="font-weight: bold; font-size: 11px;">Nhận:</div>
  <div style="font-size: 14px; font-weight: bold; margin-bottom: 2px;">{customer_name}</div>
  <div style="font-size: 14px; font-weight: bold;">{customer_phone_number}</div>
  <div style="font-size: 12px;">{shipping_address}</div>
</div>

<!-- THÔNG TIN KIỆN -->
<table style="width: 100%; margin-bottom: 10px; border-collapse: collapse;">
  <tr>
    <td style="text-align: center; padding: 8px; background: #f5f5f5; width: 50%; border: 1px solid #333;">
      <div style="font-size: 11px;">Số lượng</div>
      <div style="font-size: 14px; font-weight: bold; margin-bottom: 2px;">{total_quantity}</div>
    </td>
    <td style="text-align: center; padding: 8px; background: #f5f5f5; width: 50%; border: 1px solid #333;">
      <div style="font-size: 11px;">Khối lượng</div>
      <div style="font-size: 14px; font-weight: bold; margin-bottom: 2px;">{total_weight_g}g</div>
    </td>
  </tr>
</table>

<!-- COD -->
<div style="text-align: center; padding: 12px; border: 2px solid #333; margin-bottom: 10px;">
  <div style="font-size: 12px; font-weight: bold;">THU HỘ (COD)</div>
  <div style="font-size: 22px; font-weight: bold;">{cod}</div>
</div>

<!-- GHI CHÚ -->
<div style="font-size: 11px;">
  <strong>Ghi chú:</strong> {note}
</div>

</div>
`;
const SHIPPING_LABEL_TEMPLATE_SMALL = `
<div style="font-family: Arial, sans-serif; font-size: 11px; line-height: 1.3; max-width: 300px; padding: 10px; border: 1px solid #333;">
  <div style="text-align: center; margin-bottom: 8px;">{shipment_barcode}</div>
  <div style="text-align: center; font-weight: bold; font-family: monospace; margin-bottom: 10px;">{shipment_code}</div>
  <div style="border-top: 1px dashed #333; padding-top: 8px;">
    <div><strong>{customer_name}</strong></div>
    <div>{customer_phone_number}</div>
    <div style="font-size: 10px;">{shipping_address}</div>
  </div>
  <div style="text-align: center; margin-top: 10px; padding: 5px; background: #f5f5f5; font-weight: bold;">
    COD: {cod}
  </div>
</div>
`;
const SHIPPING_LABEL_TEMPLATE_LARGE = `
<div style="font-family: Arial, sans-serif; font-size: 13px; line-height: 1.4; max-width: 500px; margin: 0 auto; border: 3px solid #333; padding: 20px;">

<!-- HEADER -->
<div style="text-align: center; margin-bottom: 10px; padding-bottom: 15px; border-bottom: 2px solid #333;">
  <div style="font-size: 18px; font-weight: bold;">{store_name}</div>
  <div>{store_phone_number}</div>
</div>

<!-- MÃ VẠCH + QR -->
<table style="width: 100%; margin-bottom: 20px;">
  <tr>
    <td style="text-align: center; width: 60%;">{shipment_barcode}</td>
    <td style="text-align: center; width: 40%;">{shipment_qrcode}</td>
  </tr>
</table>

<div style="text-align: center; margin-bottom: 20px;">
  <div style="font-size: 28px; font-weight: bold; font-family: monospace;">{shipment_code}</div>
  <div>Đơn: {order_code}</div>
</div>

<!-- NGƯỜI GỬI / NHẬN -->
<table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
  <tr>
    <td style="padding: 15px; background: #f5f5f5; border: 1px solid #333; vertical-align: top; width: 50%;">
      <div style="font-weight: bold; margin-bottom: 5px;">NGƯỜI GỬI</div>
      <div><strong>{store_name}</strong></div>
      <div>{store_phone_number}</div>
      <div style="font-size: 11px;">{store_address}</div>
    </td>
    <td style="padding: 15px; border: 2px solid #333; vertical-align: top; width: 50%;">
      <div style="font-weight: bold; margin-bottom: 5px;">NGƯỜI NHẬN</div>
      <div style="font-size: 16px;"><strong>{customer_name}</strong></div>
      <div style="font-size: 15px; font-weight: bold;">{customer_phone_number}</div>
      <div style="font-size: 12px;">{shipping_address}</div>
    </td>
  </tr>
</table>

<!-- THÔNG TIN KIỆN -->
<table style="width: 100%; margin-bottom: 10px; border-collapse: collapse;">
  <tr>
    <td style="text-align: center; padding: 15px; background: #f5f5f5; width: 50%; border: 1px solid #333;">
      <div style="font-size: 12px;">Số lượng</div>
      <div style="font-size: 24px; font-weight: bold;">{total_quantity}</div>
    </td>
    <td style="text-align: center; padding: 15px; background: #f5f5f5; width: 50%; border: 1px solid #333;">
      <div style="font-size: 12px;">Khối lượng</div>
      <div style="font-size: 24px; font-weight: bold;">{total_weight_kg} kg</div>
    </td>
  </tr>
</table>

<!-- COD -->
<div style="text-align: center; padding: 20px; border: 3px solid #333; margin-bottom: 10px;">
  <div style="font-size: 14px; font-weight: bold;">THU HỘ (COD)</div>
  <div style="font-size: 32px; font-weight: bold;">{cod}</div>
</div>

<!-- GHI CHÚ -->
<div style="padding: 10px; background: #f5f5f5; border: 1px solid #333;">
  <strong>Ghi chú:</strong> {note}
</div>

</div>
`;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/features/settings/printer/templates/product-label.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Mẫu in Tem phụ sản phẩm (product label)
 * Thiết kế theo mẫu tem phụ nhập khẩu chuẩn
 */ __turbopack_context__.s([
    "PRODUCT_LABEL_TEMPLATE",
    ()=>PRODUCT_LABEL_TEMPLATE
]);
const PRODUCT_LABEL_TEMPLATE = `
<div style="font-family: 'Inter', Arial, sans-serif; width: 320px; background: #fff; padding: 16px; line-height: 1.5; font-size: 13px; color: #111;">
  <!-- TÊN SẢN PHẨM -->
  <div style="margin-bottom: 12px;">
    <span style="font-weight: 700;">TÊN SẢN PHẨM:</span> {product_name_vat}
  </div>

  <!-- THƯƠNG HIỆU & ĐỊA CHỈ SẢN XUẤT -->
  <div style="margin-bottom: 8px;">
    <span style="font-weight: 700;">Thương Hiệu:</span> {product_brand}. <span style="font-weight: 700;">Địa chỉ sản xuất:</span> {product_origin}
  </div>

  <!-- HƯỚNG DẪN SỬ DỤNG -->
  <div style="margin-bottom: 8px;">
    <span style="font-weight: 700;">Hướng Dẫn sử dụng:</span> {product_usage_guide}
  </div>

  <!-- ĐƠN VỊ NHẬP KHẨU -->
  <div style="margin-bottom: 8px;">
    <span style="font-weight: 700;">ĐƠN VỊ NHẬP KHẨU:</span> {product_importer_name}
  </div>

  <!-- ĐỊA CHỈ NHẬP KHẨU -->
  <div style="margin-bottom: 12px;">
    <span style="font-weight: 700;">Địa chỉ:</span> {product_importer_address}
  </div>

  <!-- BARCODE -->
  <div style="display: flex; align-items: center; gap: 12px; padding-top: 8px; border-top: 1px dashed #ccc;">
    <div style="flex: 1;">
      {product_barcode_image}
      <div style="font-size: 11px; margin-top: 2px;">{product_barcode}</div>
    </div>
  </div>
</div>
`;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/features/settings/printer/templates/stock-in.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Mẫu in Phiếu nhập kho - TipTap compatible
 * Cập nhật: Thiết kế đen trắng cho máy in
 */ __turbopack_context__.s([
    "STOCK_IN_TEMPLATE",
    ()=>STOCK_IN_TEMPLATE
]);
const STOCK_IN_TEMPLATE = `
<div style="font-family: Arial, sans-serif; font-size: 12px; line-height: 1.4; max-width: 800px; margin: 0 auto; padding: 10px;">

<!-- HEADER -->
<table style="width: 100%; margin-bottom: 10px;">
  <tr>
    <td style="width: 80px; vertical-align: top;">{store_logo}</td>
    <td style="vertical-align: top;">
      <div style="font-size: 14px; font-weight: bold; margin-bottom: 2px;">{store_name}</div>
      <div>{store_address}</div>
    </td>
  </tr>
</table>

<!-- TIÊU ĐỀ -->
<h2 style="text-align: center; margin: 15px 0 5px 0; font-size: 14px; font-weight: bold; margin-bottom: 2px; border-bottom: 2px solid #333; padding-bottom: 10px;">PHIẾU NHẬP KHO</h2>
<div style="text-align: center; margin-bottom: 10px;">
  <div>Mã: <strong>{stock_in_code}</strong></div>
  <div>Đơn đặt hàng: <strong>{order_supplier_code}</strong></div>
  <div>Ngày: {created_on}</div>
</div>

<!-- THÔNG TIN NHẬP KHO -->
<table style="width: 100%; border-collapse: collapse; margin-bottom: 10px; table-layout: fixed;">
  <tbody>
    <tr>
      <td style="padding: 4px 6px; width: 22%; background: #f5f5f5; border: 1px solid #333;">Kho nhập:</td>
      <td style="padding: 5px; border: 1px solid #333;"><strong>{location_name}</strong></td>
      <td style="padding: 5px; width: 15%; background: #f5f5f5; border: 1px solid #333;">Trạng thái:</td>
      <td style="padding: 5px; border: 1px solid #333;">{stock_in_status}</td>
    </tr>
    <tr>
      <td style="padding: 5px; background: #f5f5f5; border: 1px solid #333;">Nhà cung cấp:</td>
      <td style="padding: 5px; border: 1px solid #333;"><strong>{supplier_name}</strong></td>
      <td style="padding: 5px; background: #f5f5f5; border: 1px solid #333;">Mã NCC:</td>
      <td style="padding: 5px; border: 1px solid #333; font-family: monospace;">{supplier_code}</td>
    </tr>
    <tr>
      <td style="padding: 5px; background: #f5f5f5; border: 1px solid #333;">Người tạo:</td>
      <td style="padding: 5px; border: 1px solid #333;" colspan="3">{account_name}</td>
    </tr>
  </tbody>
</table>

<!-- BẢNG SẢN PHẨM -->
<table style="width: 100%; border-collapse: collapse; margin-bottom: 10px; table-layout: fixed;">
  <thead>
    <tr style="background: #f5f5f5;">
      <th style="padding: 8px; border: 1px solid #333; text-align: center; width: 35px;">STT</th>
      <th style="padding: 8px; border: 1px solid #333; text-align: center; width: 90px;">Mã SP</th>
      <th style="padding: 8px; border: 1px solid #333; text-align: left;">Tên sản phẩm</th>
      <th style="padding: 8px; border: 1px solid #333; text-align: center; width: 50px;">ĐVT</th>
      <th style="padding: 8px; border: 1px solid #333; text-align: center; width: 55px;">SL Đặt</th>
      <th style="padding: 8px; border: 1px solid #333; text-align: center; width: 55px;">SL Nhập</th>
      <th style="padding: 8px; border: 1px solid #333; text-align: right; width: 90px;">Đơn giá</th>
      <th style="padding: 8px; border: 1px solid #333; text-align: right; width: 100px;">Thành tiền</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td style="padding: 6px; border: 1px solid #333; text-align: center;">{line_stt}</td>
      <td style="padding: 6px; border: 1px solid #333; text-align: center; font-family: monospace;">{line_variant_code}</td>
      <td style="padding: 6px; border: 1px solid #333;">{line_product_name}<br><small>{line_variant}</small></td>
      <td style="padding: 6px; border: 1px solid #333; text-align: center;">{line_unit}</td>
      <td style="padding: 6px; border: 1px solid #333; text-align: center;">{line_ordered_quantity}</td>
      <td style="padding: 6px; border: 1px solid #333; text-align: center; font-weight: bold;">{line_received_quantity}</td>
      <td style="padding: 6px; border: 1px solid #333; text-align: right;">{line_price}</td>
      <td style="padding: 6px; border: 1px solid #333; text-align: right;">{line_total}</td>
    </tr>
  </tbody>
</table>

<!-- TỔNG TIỀN -->
<table style="width: 250px; margin-left: auto; border-collapse: collapse; margin-bottom: 10px; table-layout: fixed;">
  <tbody>
    <tr>
      <td style="padding: 5px; border: 1px solid #333;">Tổng tiền hàng:</td>
      <td style="padding: 5px; border: 1px solid #333; text-align: right; width: 100px;">{total}</td>
    </tr>
    <tr>
      <td style="padding: 5px; border: 1px solid #333;">Chiết khấu:</td>
      <td style="padding: 5px; border: 1px solid #333; text-align: right;">{discount}</td>
    </tr>
    <tr>
      <td style="padding: 5px; border: 1px solid #333;">Thuế VAT:</td>
      <td style="padding: 5px; border: 1px solid #333; text-align: right;">{tax_vat}</td>
    </tr>
    <tr style="background: #f5f5f5;">
      <td style="padding: 5px; border: 1px solid #333;"><strong>TỔNG CỘNG:</strong></td>
      <td style="padding: 5px; border: 1px solid #333; text-align: right;"><strong>{total_order}</strong></td>
    </tr>
    <tr>
      <td style="padding: 5px; border: 1px solid #333;">Đã thanh toán:</td>
      <td style="padding: 5px; border: 1px solid #333; text-align: right;">{paid}</td>
    </tr>
    <tr>
      <td style="padding: 5px; border: 1px solid #333;">Còn phải trả:</td>
      <td style="padding: 5px; border: 1px solid #333; text-align: right;"><strong>{remaining}</strong></td>
    </tr>
  </tbody>
</table>

<!-- GHI CHÚ -->
<div style="margin: 10px 0; padding: 10px; background: #f5f5f5; border: 1px solid #333;">
  <strong>Ghi chú:</strong> {note}
</div>

<!-- CHỮ KÝ -->
<table style="width: 100%; margin-top: 30px;">
  <tbody>
    <tr>
      <td style="width: 33%; text-align: center; padding: 10px;">
        <strong>Người giao</strong><br>
        <em>(Ký, ghi rõ họ tên)</em><br>
        <div style="height: 50px;"></div>
      </td>
      <td style="width: 33%; text-align: center; padding: 10px;">
        <strong>Thủ kho</strong><br>
        <em>(Ký, ghi rõ họ tên)</em><br>
        <div style="height: 50px;"></div>
      </td>
      <td style="width: 33%; text-align: center; padding: 10px;">
        <strong>Người lập</strong><br>
        <em>(Ký, ghi rõ họ tên)</em><br>
        <div style="height: 50px;"></div>
        {account_name}
      </td>
    </tr>
  </tbody>
</table>

<!-- FOOTER -->
<div style="text-align: center; margin-top: 15px; padding-top: 8px; border-top: 1px dashed #333; font-size: 11px;">
  In lúc: {print_date} {print_time}
</div>

</div>
`;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/features/settings/printer/templates/supplier-return.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Mẫu in Phiếu trả hàng NCC - TipTap compatible
 * Cập nhật: Thiết kế đen trắng cho máy in
 */ __turbopack_context__.s([
    "SUPPLIER_RETURN_TEMPLATE",
    ()=>SUPPLIER_RETURN_TEMPLATE
]);
const SUPPLIER_RETURN_TEMPLATE = `
<div style="font-family: Arial, sans-serif; font-size: 12px; line-height: 1.4; max-width: 800px; margin: 0 auto; padding: 10px;">

<!-- HEADER -->
<table style="width: 100%; margin-bottom: 10px;">
  <tr>
    <td style="width: 80px; vertical-align: top;">{store_logo}</td>
    <td style="vertical-align: top;">
      <div style="font-size: 14px; font-weight: bold; margin-bottom: 2px;">{store_name}</div>
      <div>{store_address}</div>
    </td>
  </tr>
</table>

<!-- TIÊU ĐỀ -->
<h2 style="text-align: center; margin: 15px 0 5px 0; font-size: 14px; font-weight: bold; margin-bottom: 2px; border-bottom: 2px solid #333; padding-bottom: 10px;">PHIẾU TRẢ HÀNG NHÀ CUNG CẤP</h2>
<div style="text-align: center; margin-bottom: 10px;">
  <div>Mã: <strong>{return_supplier_code}</strong></div>
  <div>Ngày: {created_on}</div>
</div>

<!-- THÔNG TIN NHÀ CUNG CẤP -->
<table style="width: 100%; border-collapse: collapse; margin-bottom: 10px; table-layout: fixed;">
  <tbody>
    <tr>
      <td style="padding: 4px 6px; width: 22%; background: #f5f5f5; border: 1px solid #333;">Nhà cung cấp:</td>
      <td style="padding: 5px; border: 1px solid #333;"><strong>{supplier_name}</strong></td>
      <td style="padding: 5px; width: 15%; background: #f5f5f5; border: 1px solid #333;">Mã NCC:</td>
      <td style="padding: 5px; border: 1px solid #333; font-family: monospace;">{supplier_code}</td>
    </tr>
    <tr>
      <td style="padding: 5px; background: #f5f5f5; border: 1px solid #333;">Điện thoại:</td>
      <td style="padding: 5px; border: 1px solid #333;">{supplier_phone_number}</td>
      <td style="padding: 5px; background: #f5f5f5; border: 1px solid #333;">Email:</td>
      <td style="padding: 5px; border: 1px solid #333;">{supplier_email}</td>
    </tr>
    <tr>
      <td style="padding: 5px; background: #f5f5f5; border: 1px solid #333;">Địa chỉ:</td>
      <td style="padding: 5px; border: 1px solid #333;" colspan="3">{supplier_address}</td>
    </tr>
    <tr>
      <td style="padding: 5px; background: #f5f5f5; border: 1px solid #333;">Lý do trả:</td>
      <td style="padding: 5px; border: 1px solid #333;" colspan="3"><strong>{reason_return}</strong></td>
    </tr>
  </tbody>
</table>

<!-- BẢNG SẢN PHẨM TRẢ -->
<table style="width: 100%; border-collapse: collapse; margin-bottom: 10px; table-layout: fixed;">
  <thead>
    <tr style="background: #f5f5f5;">
      <th style="padding: 8px; border: 1px solid #333; text-align: center; width: 40px;">STT</th>
      <th style="padding: 8px; border: 1px solid #333; text-align: center; width: 100px;">Mã SP</th>
      <th style="padding: 8px; border: 1px solid #333; text-align: left;">Tên sản phẩm</th>
      <th style="padding: 8px; border: 1px solid #333; text-align: center; width: 60px;">ĐVT</th>
      <th style="padding: 8px; border: 1px solid #333; text-align: center; width: 60px;">SL Trả</th>
      <th style="padding: 8px; border: 1px solid #333; text-align: right; width: 100px;">Đơn giá</th>
      <th style="padding: 8px; border: 1px solid #333; text-align: right; width: 110px;">Thành tiền</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td style="padding: 6px; border: 1px solid #333; text-align: center;">{line_stt}</td>
      <td style="padding: 6px; border: 1px solid #333; text-align: center; font-family: monospace;">{line_variant_code}</td>
      <td style="padding: 6px; border: 1px solid #333;">{line_product_name}<br><small>{line_variant}</small></td>
      <td style="padding: 6px; border: 1px solid #333; text-align: center;">{line_unit}</td>
      <td style="padding: 6px; border: 1px solid #333; text-align: center; font-weight: bold;">{line_quantity}</td>
      <td style="padding: 6px; border: 1px solid #333; text-align: right;">{line_price}</td>
      <td style="padding: 6px; border: 1px solid #333; text-align: right;">{line_total}</td>
    </tr>
  </tbody>
</table>

<!-- TỔNG GIÁ TRỊ -->
<table style="width: 250px; margin-left: auto; border-collapse: collapse; margin-bottom: 10px; table-layout: fixed;">
  <tbody>
    <tr style="background: #f5f5f5;">
      <td style="padding: 8px; border: 1px solid #333;"><strong>TỔNG GIÁ TRỊ TRẢ:</strong></td>
      <td style="padding: 8px; border: 1px solid #333; text-align: right; width: 100px;"><strong>{total_order}</strong></td>
    </tr>
    <tr>
      <td style="padding: 5px; border: 1px solid #333;">Đã nhận hoàn:</td>
      <td style="padding: 5px; border: 1px solid #333; text-align: right;">{refunded}</td>
    </tr>
    <tr>
      <td style="padding: 5px; border: 1px solid #333;">Còn phải nhận:</td>
      <td style="padding: 5px; border: 1px solid #333; text-align: right;"><strong>{remaining}</strong></td>
    </tr>
  </tbody>
</table>

<!-- GHI CHÚ -->
<div style="margin: 10px 0; padding: 10px; background: #f5f5f5; border: 1px solid #333;">
  <strong>Ghi chú:</strong> {note}
</div>

<!-- CHỮ KÝ -->
<table style="width: 100%; margin-top: 30px;">
  <tbody>
    <tr>
      <td style="width: 33%; text-align: center; padding: 10px;">
        <strong>Đại diện NCC</strong><br>
        <em>(Ký, ghi rõ họ tên)</em><br>
        <div style="height: 50px;"></div>
      </td>
      <td style="width: 33%; text-align: center; padding: 10px;">
        <strong>Thủ kho</strong><br>
        <em>(Ký, ghi rõ họ tên)</em><br>
        <div style="height: 50px;"></div>
      </td>
      <td style="width: 33%; text-align: center; padding: 10px;">
        <strong>Người lập</strong><br>
        <em>(Ký, ghi rõ họ tên)</em><br>
        <div style="height: 50px;"></div>
        {account_name}
      </td>
    </tr>
  </tbody>
</table>

<!-- FOOTER -->
<div style="text-align: center; margin-top: 15px; padding-top: 8px; border-top: 1px dashed #333; font-size: 11px;">
  In lúc: {print_date} {print_time}
</div>

</div>
`;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/features/settings/printer/templates/complaint.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Mẫu in Phiếu khiếu nại - TipTap compatible
 * Cập nhật: Thiết kế đen trắng cho máy in
 */ __turbopack_context__.s([
    "COMPLAINT_TEMPLATE",
    ()=>COMPLAINT_TEMPLATE
]);
const COMPLAINT_TEMPLATE = `
<div style="font-family: Arial, sans-serif; font-size: 12px; line-height: 1.4; max-width: 800px; margin: 0 auto; padding: 10px;">

<!-- HEADER -->
<table style="width: 100%; margin-bottom: 10px;">
  <tr>
    <td style="width: 80px; vertical-align: top;">{store_logo}</td>
    <td style="vertical-align: top;">
      <div style="font-size: 14px; font-weight: bold; margin-bottom: 2px;">{store_name}</div>
      <div>{store_address}</div>
      <div>Hotline: <strong>{store_phone_number}</strong></div>
    </td>
  </tr>
</table>

<!-- TIÊU ĐỀ -->
<h2 style="text-align: center; margin: 15px 0 5px 0; font-size: 14px; font-weight: bold; margin-bottom: 2px; border-bottom: 2px solid #333; padding-bottom: 10px;">PHIẾU KHIẾU NẠI</h2>
<div style="text-align: center; margin-bottom: 10px;">
  <div>Mã phiếu: <strong>{complaint_code}</strong></div>
  <div>Ngày: {created_on}</div>
</div>

<!-- THÔNG TIN KHÁCH HÀNG -->
<table style="width: 100%; border-collapse: collapse; margin-bottom: 10px; table-layout: fixed;">
  <tbody>
    <tr>
      <td style="padding: 4px 6px; width: 22%; background: #f5f5f5; border: 1px solid #333;">Khách hàng:</td>
      <td style="padding: 5px; border: 1px solid #333;"><strong>{customer_name}</strong></td>
      <td style="padding: 5px; width: 15%; background: #f5f5f5; border: 1px solid #333;">SĐT:</td>
      <td style="padding: 5px; border: 1px solid #333;"><strong>{customer_phone_number}</strong></td>
    </tr>
    <tr>
      <td style="padding: 5px; background: #f5f5f5; border: 1px solid #333;">Email:</td>
      <td style="padding: 5px; border: 1px solid #333;">{customer_email}</td>
      <td style="padding: 5px; background: #f5f5f5; border: 1px solid #333;">Địa chỉ:</td>
      <td style="padding: 5px; border: 1px solid #333;">{customer_address}</td>
    </tr>
  </tbody>
</table>

<!-- THÔNG TIN ĐƠN HÀNG -->
<table style="width: 100%; border-collapse: collapse; margin-bottom: 10px; table-layout: fixed;">
  <tbody>
    <tr>
      <td style="padding: 4px 6px; width: 22%; background: #f5f5f5; border: 1px solid #333;">Mã đơn hàng:</td>
      <td style="padding: 5px; border: 1px solid #333;"><strong>{order_code}</strong></td>
      <td style="padding: 5px; width: 15%; background: #f5f5f5; border: 1px solid #333;">Ngày mua:</td>
      <td style="padding: 5px; border: 1px solid #333;">{order_date}</td>
    </tr>
  </tbody>
</table>

<!-- NỘI DUNG KHIẾU NẠI -->
<table style="width: 100%; border-collapse: collapse; margin-bottom: 10px; table-layout: fixed; border: 2px solid #333;">
  <tbody>
    <tr>
      <td style="padding: 8px; width: 25%; background: #f5f5f5; border: 1px solid #333;">Loại khiếu nại:</td>
      <td style="padding: 8px; border: 1px solid #333;"><strong>{complaint_type}</strong></td>
    </tr>
    <tr>
      <td style="padding: 8px; background: #f5f5f5; border: 1px solid #333;">Sản phẩm:</td>
      <td style="padding: 8px; border: 1px solid #333;">{line_product_name} - <small>{line_variant}</small></td>
    </tr>
    <tr>
      <td style="padding: 8px; background: #f5f5f5; border: 1px solid #333;">Mô tả vấn đề:</td>
      <td style="padding: 8px; border: 1px solid #333;">{complaint_description}</td>
    </tr>
    <tr>
      <td style="padding: 8px; background: #f5f5f5; border: 1px solid #333;">Yêu cầu của KH:</td>
      <td style="padding: 8px; border: 1px solid #333;"><strong>{customer_request}</strong></td>
    </tr>
  </tbody>
</table>

<!-- XỬ LÝ KHIẾU NẠI -->
<table style="width: 100%; border-collapse: collapse; margin-bottom: 10px; table-layout: fixed;">
  <tbody>
    <tr>
      <td style="padding: 4px 6px; width: 22%; background: #f5f5f5; border: 1px solid #333;">Trạng thái:</td>
      <td style="padding: 5px; border: 1px solid #333;"><strong>{complaint_status}</strong></td>
    </tr>
    <tr>
      <td style="padding: 5px; background: #f5f5f5; border: 1px solid #333;">Phương án xử lý:</td>
      <td style="padding: 5px; border: 1px solid #333;">{resolution}</td>
    </tr>
    <tr>
      <td style="padding: 5px; background: #f5f5f5; border: 1px solid #333;">Người xử lý:</td>
      <td style="padding: 5px; border: 1px solid #333;">{assignee_name}</td>
    </tr>
    <tr>
      <td style="padding: 5px; background: #f5f5f5; border: 1px solid #333;">Ngày hoàn thành:</td>
      <td style="padding: 5px; border: 1px solid #333;">{resolved_on}</td>
    </tr>
  </tbody>
</table>

<!-- GHI CHÚ -->
<div style="margin: 10px 0; padding: 10px; background: #f5f5f5; border: 1px solid #333;">
  <strong>Ghi chú:</strong> {complaint_note}
</div>

<!-- CHỮ KÝ -->
<table style="width: 100%; margin-top: 30px;">
  <tbody>
    <tr>
      <td style="width: 33%; text-align: center; padding: 10px;">
        <strong>Khách hàng</strong><br>
        <em>(Ký xác nhận)</em><br>
        <div style="height: 50px;"></div>
        {customer_name}
      </td>
      <td style="width: 33%; text-align: center; padding: 10px;">
        <strong>Người xử lý</strong><br>
        <em>(Ký, ghi rõ họ tên)</em><br>
        <div style="height: 50px;"></div>
        {assignee_name}
      </td>
      <td style="width: 33%; text-align: center; padding: 10px;">
        <strong>Quản lý</strong><br>
        <em>(Ký duyệt)</em><br>
        <div style="height: 50px;"></div>
      </td>
    </tr>
  </tbody>
</table>

<!-- FOOTER -->
<div style="text-align: center; margin-top: 15px; padding-top: 8px; border-top: 1px dashed #333; font-size: 11px;">
  Cảm ơn quý khách đã phản hồi. Chúng tôi sẽ xử lý trong thời gian sớm nhất!

  <div style="font-size: 10px; color: #666; margin-top: 5px;">In lúc: {print_date} {print_time}</div></div>

</div>
`;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/features/settings/printer/templates/penalty.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Mẫu in Phiếu phạt - TipTap compatible
 * Cập nhật: Thiết kế đen trắng cho máy in
 */ __turbopack_context__.s([
    "PENALTY_TEMPLATE",
    ()=>PENALTY_TEMPLATE
]);
const PENALTY_TEMPLATE = `
<div style="font-family: Arial, sans-serif; font-size: 12px; line-height: 1.4; max-width: 800px; margin: 0 auto; padding: 10px;">

<!-- HEADER -->
<table style="width: 100%; margin-bottom: 10px;">
  <tr>
    <td style="width: 80px; vertical-align: top;">{store_logo}</td>
    <td style="vertical-align: top;">
      <div style="font-size: 14px; font-weight: bold; margin-bottom: 2px;">{store_name}</div>
      <div>{store_address}</div>
    </td>
  </tr>
</table>

<!-- TIÊU ĐỀ -->
<h2 style="text-align: center; margin: 15px 0 5px 0; font-size: 14px; font-weight: bold; margin-bottom: 2px; border-bottom: 2px solid #333; padding-bottom: 10px;">PHIẾU XỬ PHẠT</h2>
<div style="text-align: center; margin-bottom: 10px;">
  <div>Số: <strong>{penalty_code}</strong></div>
  <div>Ngày: {created_on}</div>
</div>

<!-- THÔNG TIN NGƯỜI BỊ PHẠT -->
<table style="width: 100%; border-collapse: collapse; margin-bottom: 10px; table-layout: fixed;">
  <tbody>
    <tr>
      <td style="padding: 4px 6px; width: 22%; background: #f5f5f5; border: 1px solid #333;">Họ và tên:</td>
      <td style="padding: 5px; border: 1px solid #333;"><strong>{employee_name}</strong></td>
      <td style="padding: 5px; width: 15%; background: #f5f5f5; border: 1px solid #333;">Mã NV:</td>
      <td style="padding: 5px; border: 1px solid #333; font-family: monospace;">{employee_code}</td>
    </tr>
    <tr>
      <td style="padding: 5px; background: #f5f5f5; border: 1px solid #333;">Bộ phận:</td>
      <td style="padding: 5px; border: 1px solid #333;">{department_name}</td>
      <td style="padding: 5px; background: #f5f5f5; border: 1px solid #333;">Chức vụ:</td>
      <td style="padding: 5px; border: 1px solid #333;">{position_name}</td>
    </tr>
  </tbody>
</table>

<!-- NỘI DUNG VI PHẠM -->
<table style="width: 100%; border-collapse: collapse; margin-bottom: 10px; table-layout: fixed;">
  <tbody>
    <tr>
      <td style="padding: 4px 6px; width: 22%; background: #f5f5f5; border: 1px solid #333;">Loại vi phạm:</td>
      <td style="padding: 5px; border: 1px solid #333;"><strong>{violation_type}</strong></td>
    </tr>
    <tr>
      <td style="padding: 5px; background: #f5f5f5; border: 1px solid #333;">Ngày vi phạm:</td>
      <td style="padding: 5px; border: 1px solid #333;">{violation_date}</td>
    </tr>
    <tr>
      <td style="padding: 5px; background: #f5f5f5; border: 1px solid #333;">Mô tả vi phạm:</td>
      <td style="padding: 5px; border: 1px solid #333;">{violation_description}</td>
    </tr>
    <tr>
      <td style="padding: 5px; background: #f5f5f5; border: 1px solid #333;">Bằng chứng:</td>
      <td style="padding: 5px; border: 1px solid #333;">{evidence}</td>
    </tr>
  </tbody>
</table>

<!-- HÌNH THỨC XỬ PHẠT -->
<table style="width: 100%; border-collapse: collapse; margin-bottom: 10px; table-layout: fixed; border: 2px solid #333;">
  <tbody>
    <tr>
      <td style="padding: 8px; width: 30%; background: #f5f5f5; border: 1px solid #333;">Hình thức:</td>
      <td style="padding: 8px; border: 1px solid #333;"><strong>{penalty_type}</strong></td>
    </tr>
    <tr>
      <td style="padding: 8px; background: #f5f5f5; border: 1px solid #333;">Lần vi phạm:</td>
      <td style="padding: 8px; border: 1px solid #333;">Lần thứ <strong>{violation_count}</strong></td>
    </tr>
    <tr style="background: #f5f5f5;">
      <td style="padding: 12px; border: 1px solid #333;"><strong>SỐ TIỀN PHẠT:</strong></td>
      <td style="padding: 12px; border: 1px solid #333; font-size: 18px; font-weight: bold;">{penalty_amount}</td>
    </tr>
    <tr>
      <td style="padding: 8px; border: 1px solid #333;">Bằng chữ:</td>
      <td style="padding: 8px; border: 1px solid #333; font-style: italic;">{penalty_amount_text}</td>
    </tr>
  </tbody>
</table>

<!-- GHI CHÚ -->
<div style="margin: 10px 0; padding: 10px; background: #f5f5f5; border: 1px solid #333;">
  <strong>Ghi chú:</strong> {penalty_note}
</div>

<!-- CĂN CỨ PHÁP LÝ -->
<div style="margin: 10px 0; padding: 10px; border: 1px solid #333; font-size: 12px;">
  <strong>Căn cứ pháp lý:</strong> Theo quy định nội bộ công ty và Bộ luật Lao động Việt Nam.
</div>

<!-- CHỮ KÝ -->
<table style="width: 100%; margin-top: 30px;">
  <tbody>
    <tr>
      <td style="width: 33%; text-align: center; padding: 10px;">
        <strong>Người vi phạm</strong><br>
        <em>(Ký xác nhận)</em><br>
        <div style="height: 50px;"></div>
        {employee_name}
      </td>
      <td style="width: 33%; text-align: center; padding: 10px;">
        <strong>Trưởng bộ phận</strong><br>
        <em>(Ký, ghi rõ họ tên)</em><br>
        <div style="height: 50px;"></div>
      </td>
      <td style="width: 33%; text-align: center; padding: 10px;">
        <strong>Giám đốc</strong><br>
        <em>(Ký duyệt)</em><br>
        <div style="height: 50px;"></div>
      </td>
    </tr>
  </tbody>
</table>

<!-- FOOTER -->
<div style="text-align: center; margin-top: 15px; padding-top: 8px; border-top: 1px dashed #333; font-size: 11px;">
  Phiếu này được lập thành 02 bản, mỗi bên giữ 01 bản có giá trị như nhau.

  <div style="font-size: 10px; color: #666; margin-top: 5px;">In lúc: {print_date} {print_time}</div></div>

</div>
`;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/features/settings/printer/templates/cost-adjustment.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Mẫu in Phiếu điều chỉnh giá vốn - TipTap compatible
 * Cập nhật: Thiết kế đen trắng cho máy in
 */ __turbopack_context__.s([
    "COST_ADJUSTMENT_TEMPLATE",
    ()=>COST_ADJUSTMENT_TEMPLATE
]);
const COST_ADJUSTMENT_TEMPLATE = `
<div style="font-family: Arial, sans-serif; font-size: 12px; line-height: 1.4; max-width: 800px; margin: 0 auto; padding: 10px;">

<!-- HEADER -->
<table style="width: 100%; margin-bottom: 10px;">
  <tr>
    <td style="width: 80px; vertical-align: top;">{store_logo}</td>
    <td style="vertical-align: top;">
      <div style="font-size: 14px; font-weight: bold; margin-bottom: 2px;">{store_name}</div>
      <div>{store_address}</div>
      <div>ĐT: {store_phone}</div>
    </td>
  </tr>
</table>

<!-- TIÊU ĐỀ -->
<h2 style="text-align: center; margin: 15px 0 5px 0; font-size: 16px; font-weight: bold; border-bottom: 2px solid #333; padding-bottom: 10px;">PHIẾU ĐIỀU CHỈNH GIÁ VỐN</h2>
<div style="text-align: center; margin-bottom: 15px;">
  <div>Số: <strong>{adjustment_code}</strong></div>
  <div>Ngày: {created_on} {created_on_time}</div>
</div>

<!-- THÔNG TIN CHI NHÁNH -->
<table style="width: 100%; border-collapse: collapse; margin-bottom: 15px; table-layout: fixed;">
  <tbody>
    <tr>
      <td style="padding: 5px; width: 25%; background: #f5f5f5; border: 1px solid #333;">Chi nhánh:</td>
      <td style="padding: 5px; border: 1px solid #333;"><strong>{location_name}</strong></td>
    </tr>
    <tr>
      <td style="padding: 5px; background: #f5f5f5; border: 1px solid #333;">Địa chỉ:</td>
      <td style="padding: 5px; border: 1px solid #333;">{location_address}</td>
    </tr>
    <tr>
      <td style="padding: 5px; background: #f5f5f5; border: 1px solid #333;">Lý do điều chỉnh:</td>
      <td style="padding: 5px; border: 1px solid #333;"><strong>{reason}</strong></td>
    </tr>
    <tr>
      <td style="padding: 5px; background: #f5f5f5; border: 1px solid #333;">Trạng thái:</td>
      <td style="padding: 5px; border: 1px solid #333;">{status}</td>
    </tr>
  </tbody>
</table>

<!-- DANH SÁCH SẢN PHẨM -->
<table style="width: 100%; border-collapse: collapse; margin-bottom: 15px; font-size: 11px;">
  <thead>
    <tr style="background: #f5f5f5;">
      <th style="padding: 6px; border: 1px solid #333; text-align: center; width: 30px;">STT</th>
      <th style="padding: 6px; border: 1px solid #333; text-align: left;">Mã SP</th>
      <th style="padding: 6px; border: 1px solid #333; text-align: left;">Tên sản phẩm</th>
      <th style="padding: 6px; border: 1px solid #333; text-align: center; width: 50px;">ĐVT</th>
      <th style="padding: 6px; border: 1px solid #333; text-align: right;">Giá vốn cũ</th>
      <th style="padding: 6px; border: 1px solid #333; text-align: right;">Giá vốn mới</th>
      <th style="padding: 6px; border: 1px solid #333; text-align: right;">Chênh lệch</th>
    </tr>
  </thead>
  <tbody>
    <tr data-line-item>
      <td style="padding: 5px; border: 1px solid #333; text-align: center;">{line_stt}</td>
      <td style="padding: 5px; border: 1px solid #333; font-family: monospace;">{line_variant_code}</td>
      <td style="padding: 5px; border: 1px solid #333;">{line_product_name}</td>
      <td style="padding: 5px; border: 1px solid #333; text-align: center;">{line_unit}</td>
      <td style="padding: 5px; border: 1px solid #333; text-align: right;">{line_old_price}</td>
      <td style="padding: 5px; border: 1px solid #333; text-align: right;">{line_new_price}</td>
      <td style="padding: 5px; border: 1px solid #333; text-align: right;">{line_difference}</td>
    </tr>
  </tbody>
</table>

<!-- TỔNG KẾT -->
<table style="width: 50%; margin-left: auto; border-collapse: collapse; margin-bottom: 15px;">
  <tbody>
    <tr>
      <td style="padding: 5px; background: #f5f5f5; border: 1px solid #333;">Tổng số sản phẩm:</td>
      <td style="padding: 5px; border: 1px solid #333; text-align: right;"><strong>{total_items}</strong></td>
    </tr>
    <tr>
      <td style="padding: 5px; background: #f5f5f5; border: 1px solid #333;">Tổng tăng giá vốn:</td>
      <td style="padding: 5px; border: 1px solid #333; text-align: right; color: green;">{total_increase}</td>
    </tr>
    <tr>
      <td style="padding: 5px; background: #f5f5f5; border: 1px solid #333;">Tổng giảm giá vốn:</td>
      <td style="padding: 5px; border: 1px solid #333; text-align: right; color: red;">{total_decrease}</td>
    </tr>
    <tr style="font-weight: bold; font-size: 13px;">
      <td style="padding: 8px; background: #f5f5f5; border: 1px solid #333;">CHÊNH LỆCH:</td>
      <td style="padding: 8px; border: 1px solid #333; text-align: right;">{total_difference}</td>
    </tr>
  </tbody>
</table>

<!-- GHI CHÚ -->
<div style="margin: 15px 0; padding: 10px; background: #f5f5f5; border: 1px solid #333;">
  <strong>Ghi chú:</strong> {note}
</div>

<!-- CHỮ KÝ -->
<table style="width: 100%; margin-top: 30px;">
  <tbody>
    <tr>
      <td style="width: 50%; text-align: center;">
        <strong>Người lập phiếu</strong>
        <div style="margin-top: 50px; font-style: italic;">{account_name}</div>
      </td>
      <td style="width: 50%; text-align: center;">
        <strong>Người xác nhận</strong>
        <div style="margin-top: 50px; font-style: italic;">{confirmed_by}</div>
      </td>
    </tr>
  </tbody>
</table>

<!-- NGÀY IN -->
<div style="text-align: right; margin-top: 20px; font-size: 10px; color: #666;">
  In ngày: {print_date} {print_time}
</div>

</div>
`;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/features/settings/printer/templates/payroll.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Payroll Template - Bảng lương
 * Mẫu in mặc định theo chuẩn TEMPLATE v2
 * 
 * QUAN TRỌNG - Quy tắc template:
 * 1. Bảng chứa {line_stt} hoặc {line_index} là bảng line items - sẽ được lặp theo số nhân viên
 * 2. Các bảng khác là bảng thông tin - không lặp
 * 3. Sử dụng inline styles để đảm bảo hiển thị đúng khi in
 * 
 * CHUẨN TEMPLATE v2 (2025-12-08):
 * - Header: Logo trái + Store info phải (dạng table)
 * - Title: Căn giữa, border-bottom
 * - Info table: Label 22% nền xám
 * - Product table: table-layout fixed, responsive
 * - Summary: 280px căn phải
 * - Footer: border-top dashed, font nhỏ
 */ __turbopack_context__.s([
    "PAYROLL_TEMPLATE",
    ()=>PAYROLL_TEMPLATE
]);
const PAYROLL_TEMPLATE = `
<div style="font-family: Arial, sans-serif; font-size: 12px; line-height: 1.4; max-width: 900px; margin: 0 auto; padding: 10px;">

<!-- HEADER: Logo trái + Thông tin cửa hàng phải -->
<table style="width: 100%; margin-bottom: 12px; border-collapse: collapse;">
  <tr>
    <td style="width: 70px; vertical-align: top; padding-right: 10px;">{store_logo}</td>
    <td style="vertical-align: top;">
      <div style="font-size: 14px; font-weight: bold; margin-bottom: 2px;">{store_name}</div>
      <div style="font-size: 11px; color: #333;">{store_address}</div>
      <div style="font-size: 11px; color: #333;">ĐT: {store_phone_number} | Email: {store_email}</div>
    </td>
  </tr>
</table>

<!-- TIÊU ĐỀ -->
<h2 style="text-align: center; margin: 12px 0 5px 0; font-size: 16px; font-weight: bold; border-bottom: 2px solid #333; padding-bottom: 8px;">BẢNG LƯƠNG TỔNG HỢP</h2>
<div style="text-align: center; margin-bottom: 12px; font-size: 12px;">
  <div><strong>{batch_title}</strong></div>
  <div>Mã: <strong>{batch_code}</strong> | Kỳ lương: <strong>{pay_period}</strong></div>
</div>

<!-- THÔNG TIN BẢNG LƯƠNG -->
<table style="width: 100%; border-collapse: collapse; margin-bottom: 10px;">
  <tbody>
    <tr>
      <td style="padding: 4px 6px; width: 20%; border: 1px solid #333; font-size: 11px;">Trạng thái:</td>
      <td style="padding: 4px 6px; border: 1px solid #333; font-size: 11px;"><strong>{batch_status}</strong></td>
      <td style="padding: 4px 6px; width: 20%; border: 1px solid #333; font-size: 11px;">Ngày thanh toán:</td>
      <td style="padding: 4px 6px; border: 1px solid #333; font-size: 11px;">{payroll_date}</td>
    </tr>
    <tr>
      <td style="padding: 4px 6px; border: 1px solid #333; font-size: 11px;">Tháng chấm công:</td>
      <td style="padding: 4px 6px; border: 1px solid #333; font-size: 11px;">{reference_months}</td>
      <td style="padding: 4px 6px; border: 1px solid #333; font-size: 11px;">Số nhân viên:</td>
      <td style="padding: 4px 6px; border: 1px solid #333; font-size: 11px;"><strong>{total_employees}</strong> người</td>
    </tr>
    <tr>
      <td style="padding: 4px 6px; border: 1px solid #333; font-size: 11px;">Người lập:</td>
      <td style="padding: 4px 6px; border: 1px solid #333; font-size: 11px;">{created_by}</td>
      <td style="padding: 4px 6px; border: 1px solid #333; font-size: 11px;">Ngày lập:</td>
      <td style="padding: 4px 6px; border: 1px solid #333; font-size: 11px;">{created_on}</td>
    </tr>
    <tr>
      <td style="padding: 4px 6px; border: 1px solid #333; font-size: 11px;">Ghi chú:</td>
      <td style="padding: 4px 6px; border: 1px solid #333; font-size: 11px;" colspan="3">{notes}</td>
    </tr>
  </tbody>
</table>

<!-- BẢNG CHI TIẾT LƯƠNG TỪNG NHÂN VIÊN - Table layout fixed -->
<table style="width: 100%; border-collapse: collapse; margin-bottom: 10px; table-layout: fixed;">
  <thead>
    <tr>
      <th style="padding: 5px 3px; border: 1px solid #333; text-align: center; width: 28px; font-size: 10px;">STT</th>
      <th style="padding: 5px 3px; border: 1px solid #333; text-align: left; width: 58px; font-size: 10px;">Mã NV</th>
      <th style="padding: 5px 3px; border: 1px solid #333; text-align: left; font-size: 10px;">Họ tên</th>
      <th style="padding: 5px 3px; border: 1px solid #333; text-align: left; width: 80px; font-size: 10px;">Phòng ban</th>
      <th style="padding: 5px 3px; border: 1px solid #333; text-align: right; width: 72px; font-size: 10px;">Thu nhập</th>
      <th style="padding: 5px 3px; border: 1px solid #333; text-align: right; width: 55px; font-size: 10px;">Bảo hiểm</th>
      <th style="padding: 5px 3px; border: 1px solid #333; text-align: right; width: 60px; font-size: 10px;">Thuế TNCN</th>
      <th style="padding: 5px 3px; border: 1px solid #333; text-align: right; width: 72px; font-size: 10px; font-weight: bold;">Thực lĩnh</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td style="padding: 4px 3px; border: 1px solid #333; text-align: center; font-size: 10px;">{line_stt}</td>
      <td style="padding: 4px 3px; border: 1px solid #333; font-size: 10px;">{employee_code}</td>
      <td style="padding: 4px 3px; border: 1px solid #333; font-size: 10px; word-wrap: break-word;">{employee_name}</td>
      <td style="padding: 4px 3px; border: 1px solid #333; font-size: 10px; word-wrap: break-word;">{department_name}</td>
      <td style="padding: 4px 3px; border: 1px solid #333; text-align: right; font-size: 10px;">{earnings}</td>
      <td style="padding: 4px 3px; border: 1px solid #333; text-align: right; font-size: 10px;">{total_insurance}</td>
      <td style="padding: 4px 3px; border: 1px solid #333; text-align: right; font-size: 10px;">{personal_income_tax}</td>
      <td style="padding: 4px 3px; border: 1px solid #333; text-align: right; font-size: 10px; font-weight: bold;">{net_pay}</td>
    </tr>
  </tbody>
</table>

<!-- BẢNG TỔNG KẾT -->
<table style="width: 300px; margin-left: auto; border-collapse: collapse; margin-bottom: 10px;">
  <tbody>
    <tr>
      <td style="padding: 4px 6px; border: 1px solid #333; font-size: 11px;">Tổng thu nhập:</td>
      <td style="padding: 4px 6px; border: 1px solid #333; text-align: right; width: 120px; font-size: 11px;">{total_earnings}</td>
    </tr>
    <tr>
      <td style="padding: 4px 6px; border: 1px solid #333; font-size: 11px;">Tổng bảo hiểm (NV):</td>
      <td style="padding: 4px 6px; border: 1px solid #333; text-align: right; font-size: 11px;">{total_insurance}</td>
    </tr>
    <tr>
      <td style="padding: 4px 6px; border: 1px solid #333; font-size: 11px;">Tổng thuế TNCN:</td>
      <td style="padding: 4px 6px; border: 1px solid #333; text-align: right; font-size: 11px;">{total_tax}</td>
    </tr>
    <tr>
      <td style="padding: 4px 6px; border: 1px solid #333; font-size: 11px;">Tổng khấu trừ:</td>
      <td style="padding: 4px 6px; border: 1px solid #333; text-align: right; font-size: 11px;">{total_deductions}</td>
    </tr>
    <tr>
      <td style="padding: 4px 6px; border: 1px solid #333; font-size: 11px;">Đóng góp (DN):</td>
      <td style="padding: 4px 6px; border: 1px solid #333; text-align: right; font-size: 11px;">{total_contributions}</td>
    </tr>
    <tr>
      <td style="padding: 5px 6px; border: 1px solid #333; font-size: 12px; font-weight: bold; background: #f0f0f0;">TỔNG THỰC LĨNH:</td>
      <td style="padding: 5px 6px; border: 1px solid #333; text-align: right; font-size: 12px; font-weight: bold; background: #f0f0f0;">{total_net}</td>
    </tr>
  </tbody>
</table>

<!-- BẰNG CHỮ -->
<p style="font-style: italic; margin: 10px 0; font-size: 11px;">
  <strong>Bằng chữ:</strong> {total_net_text}
</p>

<!-- FOOTER: Chữ ký -->
<table style="width: 100%; margin-top: 25px; border-collapse: collapse;">
  <tr>
    <td style="width: 33%; text-align: center; padding: 5px; vertical-align: top;">
      <div style="font-weight: bold; margin-bottom: 50px; font-size: 11px;">Người lập</div>
      <div style="font-size: 11px;">{created_by}</div>
    </td>
    <td style="width: 33%; text-align: center; padding: 5px; vertical-align: top;">
      <div style="font-weight: bold; margin-bottom: 50px; font-size: 11px;">Kế toán trưởng</div>
      <div style="font-size: 11px;"></div>
    </td>
    <td style="width: 33%; text-align: center; padding: 5px; vertical-align: top;">
      <div style="font-weight: bold; margin-bottom: 50px; font-size: 11px;">Giám đốc</div>
      <div style="font-size: 11px;"></div>
    </td>
  </tr>
</table>

<!-- NGÀY IN -->
<div style="margin-top: 15px; padding-top: 8px; border-top: 1px dashed #ccc; font-size: 10px; color: #666; text-align: right;">
  Ngày in: {print_date} {print_time}
</div>

</div>
`;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/features/settings/printer/templates/payslip.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Payslip Template - Phiếu lương cá nhân
 * Mẫu in mặc định theo chuẩn TEMPLATE v2
 * 
 * QUAN TRỌNG - Quy tắc template:
 * 1. Bảng chứa {line_stt} là bảng line items - sẽ được lặp theo số components
 * 2. Các bảng khác là bảng thông tin - không lặp
 * 3. Sử dụng inline styles để đảm bảo hiển thị đúng khi in
 * 
 * CHUẨN TEMPLATE v2 (2025-12-08):
 * - Header: Logo trái + Store info phải (dạng table)
 * - Title: Căn giữa, border-bottom
 * - Info table: Label 22% nền xám
 * - Component table: table-layout fixed, responsive
 * - Summary: 280px căn phải
 * - Footer: border-top dashed, font nhỏ
 */ __turbopack_context__.s([
    "PAYSLIP_TEMPLATE",
    ()=>PAYSLIP_TEMPLATE
]);
const PAYSLIP_TEMPLATE = `
<div style="font-family: Arial, sans-serif; font-size: 12px; line-height: 1.4; max-width: 700px; margin: 0 auto; padding: 10px;">

<!-- HEADER: Logo trái + Thông tin cửa hàng phải -->
<table style="width: 100%; margin-bottom: 12px; border-collapse: collapse;">
  <tr>
    <td style="width: 70px; vertical-align: top; padding-right: 10px;">{store_logo}</td>
    <td style="vertical-align: top;">
      <div style="font-size: 14px; font-weight: bold; margin-bottom: 2px;">{store_name}</div>
      <div style="font-size: 11px; color: #333;">{store_address}</div>
      <div style="font-size: 11px; color: #333;">ĐT: {store_phone_number} | Email: {store_email}</div>
    </td>
  </tr>
</table>

<!-- TIÊU ĐỀ -->
<h2 style="text-align: center; margin: 12px 0 5px 0; font-size: 16px; font-weight: bold; border-bottom: 2px solid #333; padding-bottom: 8px;">PHIẾU LƯƠNG</h2>
<div style="text-align: center; margin-bottom: 12px; font-size: 12px;">
  <div>Kỳ lương: <strong>{pay_period}</strong></div>
  <div>Mã phiếu: <strong>{payslip_code}</strong></div>
</div>

<!-- THÔNG TIN NHÂN VIÊN -->
<table style="width: 100%; border-collapse: collapse; margin-bottom: 10px;">
  <tbody>
    <tr>
      <td style="padding: 4px 6px; width: 22%; border: 1px solid #333; font-size: 11px; background: #f5f5f5;">Mã nhân viên:</td>
      <td style="padding: 4px 6px; border: 1px solid #333; font-size: 11px;"><strong>{employee_code}</strong></td>
      <td style="padding: 4px 6px; width: 22%; border: 1px solid #333; font-size: 11px; background: #f5f5f5;">Họ và tên:</td>
      <td style="padding: 4px 6px; border: 1px solid #333; font-size: 11px;"><strong>{employee_name}</strong></td>
    </tr>
    <tr>
      <td style="padding: 4px 6px; border: 1px solid #333; font-size: 11px; background: #f5f5f5;">Phòng ban:</td>
      <td style="padding: 4px 6px; border: 1px solid #333; font-size: 11px;">{department_name}</td>
      <td style="padding: 4px 6px; border: 1px solid #333; font-size: 11px; background: #f5f5f5;">Chức vụ:</td>
      <td style="padding: 4px 6px; border: 1px solid #333; font-size: 11px;">{position}</td>
    </tr>
    <tr>
      <td style="padding: 4px 6px; border: 1px solid #333; font-size: 11px; background: #f5f5f5;">Bảng lương:</td>
      <td style="padding: 4px 6px; border: 1px solid #333; font-size: 11px;" colspan="3">{batch_title} ({batch_code})</td>
    </tr>
    <tr>
      <td style="padding: 4px 6px; border: 1px solid #333; font-size: 11px; background: #f5f5f5;">Ngày thanh toán:</td>
      <td style="padding: 4px 6px; border: 1px solid #333; font-size: 11px;">{payroll_date}</td>
      <td style="padding: 4px 6px; border: 1px solid #333; font-size: 11px; background: #f5f5f5;">Kỳ lương:</td>
      <td style="padding: 4px 6px; border: 1px solid #333; font-size: 11px;">{pay_period}</td>
    </tr>
  </tbody>
</table>

<!-- THÔNG TIN CHẤM CÔNG -->
<table style="width: 100%; border-collapse: collapse; margin-bottom: 10px; background: #f8f9fa;">
  <tbody>
    <tr>
      <td style="padding: 6px 8px; border: 1px solid #333; font-size: 11px; width: 25%; background: #e8e8e8; font-weight: bold;">Ngày công</td>
      <td style="padding: 6px 8px; border: 1px solid #333; font-size: 11px; width: 25%; text-align: center;"><strong>{work_days}</strong> / {standard_work_days}</td>
      <td style="padding: 6px 8px; border: 1px solid #333; font-size: 11px; width: 25%; background: #e8e8e8; font-weight: bold;">Nghỉ phép</td>
      <td style="padding: 6px 8px; border: 1px solid #333; font-size: 11px; width: 25%; text-align: center;">{leave_days} ngày</td>
    </tr>
    <tr>
      <td style="padding: 6px 8px; border: 1px solid #333; font-size: 11px; background: #e8e8e8; font-weight: bold;">Tổng giờ OT</td>
      <td style="padding: 6px 8px; border: 1px solid #333; font-size: 11px; text-align: center; color: #0066cc;"><strong>{ot_hours}h</strong></td>
      <td style="padding: 6px 8px; border: 1px solid #333; font-size: 11px; background: #e8e8e8; font-weight: bold;">Vắng không phép</td>
      <td style="padding: 6px 8px; border: 1px solid #333; font-size: 11px; text-align: center;">{absent_days} ngày</td>
    </tr>
    <tr>
      <td style="padding: 6px 8px; border: 1px solid #333; font-size: 11px; background: #e8e8e8;">OT ngày thường</td>
      <td style="padding: 6px 8px; border: 1px solid #333; font-size: 11px; text-align: center;">{ot_hours_weekday}h</td>
      <td style="padding: 6px 8px; border: 1px solid #333; font-size: 11px; background: #e8e8e8;">Đi trễ/Về sớm</td>
      <td style="padding: 6px 8px; border: 1px solid #333; font-size: 11px; text-align: center;">{late_arrivals} lần / {early_departures} lần</td>
    </tr>
    <tr>
      <td style="padding: 6px 8px; border: 1px solid #333; font-size: 11px; background: #e8e8e8;">OT cuối tuần</td>
      <td style="padding: 6px 8px; border: 1px solid #333; font-size: 11px; text-align: center;">{ot_hours_weekend}h</td>
      <td style="padding: 6px 8px; border: 1px solid #333; font-size: 11px; background: #e8e8e8;">OT ngày lễ</td>
      <td style="padding: 6px 8px; border: 1px solid #333; font-size: 11px; text-align: center;">{ot_hours_holiday}h</td>
    </tr>
  </tbody>
</table>

<!-- CHI TIẾT CÁC THÀNH PHẦN LƯƠNG (LINE ITEMS) -->
<h4 style="margin: 15px 0 8px 0; font-size: 12px; font-weight: bold; border-bottom: 1px solid #333; padding-bottom: 4px;">I. CHI TIẾT THU NHẬP</h4>
<table style="width: 100%; border-collapse: collapse; margin-bottom: 10px;">
  <thead>
    <tr style="background: #e8e8e8;">
      <th style="padding: 5px 6px; border: 1px solid #333; text-align: center; font-size: 11px; width: 30px;">STT</th>
      <th style="padding: 5px 6px; border: 1px solid #333; text-align: left; font-size: 11px; width: 140px;">Tên thành phần</th>
      <th style="padding: 5px 6px; border: 1px solid #333; text-align: left; font-size: 11px;">Chi tiết tính</th>
      <th style="padding: 5px 6px; border: 1px solid #333; text-align: right; font-size: 11px; width: 110px;">Số tiền</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td style="padding: 4px 6px; border: 1px solid #333; text-align: center; font-size: 10px;">{line_stt}</td>
      <td style="padding: 4px 6px; border: 1px solid #333; font-size: 10px;">{component_name}</td>
      <td style="padding: 4px 6px; border: 1px solid #333; font-size: 10px; color: #555;">{component_formula}</td>
      <td style="padding: 4px 6px; border: 1px solid #333; text-align: right; font-size: 10px; font-weight: bold;">{component_amount}</td>
    </tr>
  </tbody>
  <tfoot>
    <tr style="background: #f5f5f5;">
      <td colspan="3" style="padding: 5px 6px; border: 1px solid #333; font-size: 11px; font-weight: bold;">Tổng thu nhập (Gross)</td>
      <td style="padding: 5px 6px; border: 1px solid #333; text-align: right; font-size: 11px; font-weight: bold;">{total_earnings}</td>
    </tr>
  </tfoot>
</table>

<!-- CÁC KHOẢN KHẤU TRỪ -->
<h4 style="margin: 15px 0 8px 0; font-size: 12px; font-weight: bold; border-bottom: 1px solid #333; padding-bottom: 4px;">II. CÁC KHOẢN KHẤU TRỪ</h4>
<table style="width: 100%; border-collapse: collapse; margin-bottom: 10px;">
  <thead>
    <tr style="background: #e8e8e8;">
      <th style="padding: 5px 6px; border: 1px solid #333; text-align: left; font-size: 11px;">Khoản mục</th>
      <th style="padding: 5px 6px; border: 1px solid #333; text-align: right; font-size: 11px; width: 120px;">Số tiền</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td style="padding: 4px 6px; border: 1px solid #333; font-size: 11px; padding-left: 10px;">BHXH (8%)</td>
      <td style="padding: 4px 6px; border: 1px solid #333; text-align: right; font-size: 11px; color: #c00;">{bhxh_amount}</td>
    </tr>
    <tr>
      <td style="padding: 4px 6px; border: 1px solid #333; font-size: 11px; padding-left: 10px;">BHYT (1.5%)</td>
      <td style="padding: 4px 6px; border: 1px solid #333; text-align: right; font-size: 11px; color: #c00;">{bhyt_amount}</td>
    </tr>
    <tr>
      <td style="padding: 4px 6px; border: 1px solid #333; font-size: 11px; padding-left: 10px;">BHTN (1%)</td>
      <td style="padding: 4px 6px; border: 1px solid #333; text-align: right; font-size: 11px; color: #c00;">{bhtn_amount}</td>
    </tr>
    <tr style="background: #fff5f5;">
      <td style="padding: 4px 6px; border: 1px solid #333; font-size: 11px; font-weight: bold;">Tổng bảo hiểm (10.5%)</td>
      <td style="padding: 4px 6px; border: 1px solid #333; text-align: right; font-size: 11px; font-weight: bold; color: #c00;">{total_insurance}</td>
    </tr>
    <tr>
      <td style="padding: 4px 6px; border: 1px solid #333; font-size: 11px; padding-left: 10px;">Thuế TNCN</td>
      <td style="padding: 4px 6px; border: 1px solid #333; text-align: right; font-size: 11px; color: #c00;">{personal_income_tax}</td>
    </tr>
    <tr>
      <td style="padding: 4px 6px; border: 1px solid #333; font-size: 11px; padding-left: 10px;">Khấu trừ phạt</td>
      <td style="padding: 4px 6px; border: 1px solid #333; text-align: right; font-size: 11px; color: #c00;">{penalty_deductions}</td>
    </tr>
    <tr>
      <td style="padding: 4px 6px; border: 1px solid #333; font-size: 11px; padding-left: 10px;">Khấu trừ khác</td>
      <td style="padding: 4px 6px; border: 1px solid #333; text-align: right; font-size: 11px; color: #c00;">{other_deductions}</td>
    </tr>
  </tbody>
  <tfoot>
    <tr style="background: #fff5f5;">
      <td style="padding: 5px 6px; border: 1px solid #333; font-size: 11px; font-weight: bold;">Tổng khấu trừ</td>
      <td style="padding: 5px 6px; border: 1px solid #333; text-align: right; font-size: 11px; font-weight: bold; color: #c00;">{total_deductions}</td>
    </tr>
  </tfoot>
</table>

<!-- TÍNH THUẾ TNCN (Tham khảo) -->
<h4 style="margin: 15px 0 8px 0; font-size: 12px; font-weight: bold; border-bottom: 1px solid #333; padding-bottom: 4px;">III. TÍNH THUẾ TNCN</h4>
<p style="font-size: 10px; color: #666; margin: 0 0 8px 0; font-style: italic;">Công thức: Thu nhập chịu thuế = Tổng thu nhập - BH (NV đóng) - Giảm trừ gia cảnh</p>
<table style="width: 100%; border-collapse: collapse; margin-bottom: 10px;">
  <tbody>
    <tr>
      <td style="padding: 4px 6px; border: 1px solid #333; font-size: 11px; width: 60%;">Mức giảm trừ bản thân (theo luật thuế TNCN)</td>
      <td style="padding: 4px 6px; border: 1px solid #333; text-align: right; font-size: 11px; color: #666;">{personal_deduction}</td>
    </tr>
    <tr>
      <td style="padding: 4px 6px; border: 1px solid #333; font-size: 11px;">Mức giảm trừ người phụ thuộc ({dependents_count} người × 4.400.000)</td>
      <td style="padding: 4px 6px; border: 1px solid #333; text-align: right; font-size: 11px; color: #666;">{dependent_deduction}</td>
    </tr>
    <tr style="background: #f5f5f5;">
      <td style="padding: 4px 6px; border: 1px solid #333; font-size: 11px; font-weight: bold;">→ Thu nhập chịu thuế</td>
      <td style="padding: 4px 6px; border: 1px solid #333; text-align: right; font-size: 11px; font-weight: bold;">{taxable_income}</td>
    </tr>
    <tr style="background: #fff5f5;">
      <td style="padding: 4px 6px; border: 1px solid #333; font-size: 11px; font-weight: bold;">→ Thuế TNCN phải nộp</td>
      <td style="padding: 4px 6px; border: 1px solid #333; text-align: right; font-size: 11px; font-weight: bold; color: #c00;">{personal_income_tax}</td>
    </tr>
  </tbody>
</table>

<!-- THỰC LĨNH -->
<table style="width: 100%; border-collapse: collapse; margin-bottom: 10px;">
  <tbody>
    <tr style="background: #d4edda;">
      <td style="padding: 8px 10px; border: 2px solid #333; font-size: 14px; font-weight: bold; width: 50%;">THỰC LĨNH</td>
      <td style="padding: 8px 10px; border: 2px solid #333; text-align: right; font-size: 14px; font-weight: bold; color: #155724;">{net_pay}</td>
    </tr>
  </tbody>
</table>

<!-- BẰNG CHỮ -->
<p style="font-style: italic; margin: 10px 0; font-size: 11px; padding: 8px; border: 1px solid #333; background: #fffde7;">
  <strong>Số tiền bằng chữ:</strong> {net_pay_text}
</p>

<!-- FOOTER: Chữ ký -->
<table style="width: 100%; margin-top: 25px; border-collapse: collapse;">
  <tr>
    <td style="width: 50%; text-align: center; padding: 5px; vertical-align: top;">
      <div style="font-weight: bold; margin-bottom: 50px; font-size: 11px;">Người lập phiếu</div>
      <div style="font-size: 11px;"></div>
    </td>
    <td style="width: 50%; text-align: center; padding: 5px; vertical-align: top;">
      <div style="font-weight: bold; margin-bottom: 50px; font-size: 11px;">Người nhận</div>
      <div style="font-size: 11px;">{employee_name}</div>
    </td>
  </tr>
</table>

<!-- NGÀY IN -->
<div style="margin-top: 15px; padding-top: 8px; border-top: 1px dashed #ccc; font-size: 10px; color: #666; text-align: right;">
  Ngày in: {print_date} {print_time}
</div>

</div>
`;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/features/settings/printer/templates/supplier-order.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Mẫu in Đơn đặt hàng nhập (Extended) - TipTap compatible
 */ __turbopack_context__.s([
    "SUPPLIER_ORDER_TEMPLATE",
    ()=>SUPPLIER_ORDER_TEMPLATE
]);
const SUPPLIER_ORDER_TEMPLATE = `
<div style="font-family: Arial, sans-serif; font-size: 12px; line-height: 1.4; max-width: 800px; margin: 0 auto; padding: 10px;">

<!-- HEADER -->
<div style="text-align: center; margin-bottom: 10px;">
  <div style="margin-bottom: 5px;">{store_logo}</div>
  <div style="font-size: 14px; font-weight: bold; margin-bottom: 2px;">{store_name}</div>
  <div style="color: #666;">{store_address}</div>
  <div style="color: #666;">ĐT: {store_phone_number}</div>
</div>

<!-- TIÊU ĐỀ -->
<h2 style="text-align: center; margin: 20px 0 10px 0; font-size: 18px; text-transform: uppercase; border-bottom: 2px solid #333; padding-bottom: 10px;">ĐƠN ĐẶT HÀNG NHẬP</h2>
<div style="text-align: center; margin-bottom: 20px;">
  <div style="font-size: 14px;">Số: <strong>{order_supplier_code}</strong></div>
  <div>Ngày: {created_on} {created_on_time}</div>
</div>

<!-- THÔNG TIN NHÀ CUNG CẤP -->
<table style="width: 100%; border-collapse: collapse; margin-bottom: 10px; table-layout: fixed;">
  <tbody>
    <tr>
      <td style="padding: 8px; width: 20%; background: #f5f5f5; border: 1px solid #ddd; font-weight: bold;">Nhà cung cấp:</td>
      <td style="padding: 8px; border: 1px solid #ddd;"><strong>{supplier_name}</strong></td>
      <td style="padding: 8px; width: 15%; background: #f5f5f5; border: 1px solid #ddd; font-weight: bold;">Mã NCC:</td>
      <td style="padding: 8px; border: 1px solid #ddd;">{supplier_code}</td>
    </tr>
    <tr>
      <td style="padding: 8px; background: #f5f5f5; border: 1px solid #ddd; font-weight: bold;">Điện thoại:</td>
      <td style="padding: 8px; border: 1px solid #ddd;">{supplier_phone_number}</td>
      <td style="padding: 8px; background: #f5f5f5; border: 1px solid #ddd; font-weight: bold;">Email:</td>
      <td style="padding: 8px; border: 1px solid #ddd;">{supplier_email}</td>
    </tr>
    <tr>
      <td style="padding: 8px; background: #f5f5f5; border: 1px solid #ddd; font-weight: bold;">Địa chỉ:</td>
      <td style="padding: 8px; border: 1px solid #ddd;" colspan="3">{supplier_address}</td>
    </tr>
    <tr>
      <td style="padding: 8px; background: #f5f5f5; border: 1px solid #ddd; font-weight: bold;">Kho nhập:</td>
      <td style="padding: 8px; border: 1px solid #ddd;">{location_name}</td>
      <td style="padding: 8px; background: #f5f5f5; border: 1px solid #ddd; font-weight: bold;">Ngày giao dự kiến:</td>
      <td style="padding: 8px; border: 1px solid #ddd;">{expected_on}</td>
    </tr>
  </tbody>
</table>

<!-- BẢNG SẢN PHẨM -->
<table style="width: 100%; border-collapse: collapse; margin-bottom: 10px; table-layout: fixed;">
  <thead>
    <tr style="background: #f5f5f5;">
      <th style="padding: 10px; border: 1px solid #333; text-align: center; width: 40px;">STT</th>
      <th style="padding: 10px; border: 1px solid #333; text-align: center; width: 100px;">Mã SP</th>
      <th style="padding: 10px; border: 1px solid #333; text-align: left;">Tên sản phẩm</th>
      <th style="padding: 10px; border: 1px solid #333; text-align: center; width: 60px;">ĐVT</th>
      <th style="padding: 10px; border: 1px solid #333; text-align: center; width: 60px;">SL Đặt</th>
      <th style="padding: 10px; border: 1px solid #333; text-align: right; width: 100px;">Đơn giá</th>
      <th style="padding: 10px; border: 1px solid #333; text-align: right; width: 110px;">Thành tiền</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td style="padding: 8px; border: 1px solid #333; text-align: center;">{line_stt}</td>
      <td style="padding: 8px; border: 1px solid #333; text-align: center; font-family: monospace;">{line_variant_code}</td>
      <td style="padding: 8px; border: 1px solid #333;">{line_product_name}<br><small style="color: #666;">{line_variant}</small></td>
      <td style="padding: 8px; border: 1px solid #333; text-align: center;">{line_unit}</td>
      <td style="padding: 8px; border: 1px solid #333; text-align: center; font-weight: bold;">{line_quantity}</td>
      <td style="padding: 8px; border: 1px solid #333; text-align: right;">{line_price}</td>
      <td style="padding: 8px; border: 1px solid #333; text-align: right;">{line_amount}</td>
    </tr>
  </tbody>
</table>

<!-- TỔNG GIÁ TRỊ -->
<table style="width: 250px; margin-left: auto; border-collapse: collapse; margin-bottom: 20px;">
  <tbody>
    <tr>
      <td style="padding: 8px; border: 1px solid #333;">Tổng tiền hàng:</td>
      <td style="padding: 8px; border: 1px solid #333; text-align: right; width: 120px;">{total}</td>
    </tr>
    <tr>
      <td style="padding: 8px; border: 1px solid #333;">Chiết khấu:</td>
      <td style="padding: 8px; border: 1px solid #333; text-align: right;">{total_discount}</td>
    </tr>
    <tr>
      <td style="padding: 8px; border: 1px solid #333;">Thuế VAT:</td>
      <td style="padding: 8px; border: 1px solid #333; text-align: right;">{total_tax}</td>
    </tr>
    <tr style="background: #f5f5f5;">
      <td style="padding: 10px; border: 1px solid #333; font-weight: bold; font-size: 14px;">TỔNG CỘNG:</td>
      <td style="padding: 10px; border: 1px solid #333; text-align: right; font-weight: bold; font-size: 14px;">{total_amount}</td>
    </tr>
  </tbody>
</table>

<!-- GHI CHÚ -->
<div style="margin-bottom: 20px; padding: 12px; background: #f5f5f5; border: 1px solid #333;">
  <strong>Ghi chú:</strong> {note}
</div>

<!-- CHỮ KÝ -->
<table style="width: 100%; margin-top: 40px;">
  <tbody>
    <tr>
      <td style="width: 50%; text-align: center; padding: 10px; vertical-align: top;">
        <div style="font-weight: bold; margin-bottom: 5px;">NGƯỜI LẬP ĐƠN</div>
        <div style="color: #888; font-size: 12px; font-style: italic;">(Ký, ghi rõ họ tên)</div>
        <div style="height: 60px;"></div>
        <div>{account_name}</div>
      </td>
      <td style="width: 50%; text-align: center; padding: 10px; vertical-align: top;">
        <div style="font-weight: bold; margin-bottom: 5px;">PHÊ DUYỆT</div>
        <div style="color: #888; font-size: 12px; font-style: italic;">(Ký, ghi rõ họ tên)</div>
        <div style="height: 60px;"></div>
      </td>
    </tr>
  </tbody>
</table>

<!-- FOOTER -->
<div style="margin-top: 15px; padding-top: 8px; border-top: 1px dashed #ccc; font-size: 10px; color: #666; text-align: center;">
  In lúc: {print_date} {print_time}
</div>

</div>
`;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/features/settings/printer/templates/return-order.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Mẫu in Đơn trả hàng (Extended) - TipTap compatible
 */ __turbopack_context__.s([
    "RETURN_ORDER_TEMPLATE",
    ()=>RETURN_ORDER_TEMPLATE
]);
const RETURN_ORDER_TEMPLATE = `
<div style="font-family: Arial, sans-serif; font-size: 12px; line-height: 1.4; max-width: 800px; margin: 0 auto; padding: 10px;">

<!-- HEADER -->
<div style="text-align: center; margin-bottom: 10px;">
  <div style="margin-bottom: 5px;">{store_logo}</div>
  <div style="font-size: 14px; font-weight: bold; margin-bottom: 2px;">{store_name}</div>
  <div style="color: #666;">{store_address}</div>
  <div style="color: #666;">ĐT: {store_phone_number}</div>
</div>

<!-- TIÊU ĐỀ -->
<h2 style="text-align: center; margin: 20px 0 10px 0; font-size: 18px; text-transform: uppercase; border-bottom: 2px solid #333; padding-bottom: 10px;">PHIẾU TRẢ HÀNG</h2>
<div style="text-align: center; margin-bottom: 20px;">
  <div style="font-size: 14px;">Số: <strong>{return_code}</strong></div>
  <div>Ngày: {created_on} {created_on_time}</div>
  <div>Đơn hàng gốc: <strong>{order_code}</strong></div>
</div>

<!-- THÔNG TIN KHÁCH HÀNG -->
<table style="width: 100%; border-collapse: collapse; margin-bottom: 10px; table-layout: fixed;">
  <tbody>
    <tr>
      <td style="padding: 8px; width: 20%; background: #f5f5f5; border: 1px solid #333; font-weight: bold;">Khách hàng:</td>
      <td style="padding: 8px; border: 1px solid #333;"><strong>{customer_name}</strong></td>
      <td style="padding: 8px; width: 15%; background: #f5f5f5; border: 1px solid #333; font-weight: bold;">Mã KH:</td>
      <td style="padding: 8px; border: 1px solid #333;">{customer_code}</td>
    </tr>
    <tr>
      <td style="padding: 8px; background: #f5f5f5; border: 1px solid #333; font-weight: bold;">Điện thoại:</td>
      <td style="padding: 8px; border: 1px solid #333;">{customer_phone_number}</td>
      <td style="padding: 8px; background: #f5f5f5; border: 1px solid #333; font-weight: bold;">Email:</td>
      <td style="padding: 8px; border: 1px solid #333;">{customer_email}</td>
    </tr>
    <tr>
      <td style="padding: 8px; background: #f5f5f5; border: 1px solid #333; font-weight: bold;">Lý do trả:</td>
      <td style="padding: 8px; border: 1px solid #333;" colspan="3"><strong>{reason}</strong></td>
    </tr>
  </tbody>
</table>

<!-- BẢNG SẢN PHẨM TRẢ -->
<table style="width: 100%; border-collapse: collapse; margin-bottom: 10px; table-layout: fixed;">
  <thead>
    <tr style="background: #f5f5f5;">
      <th style="padding: 10px; border: 1px solid #333; text-align: center; width: 40px;">STT</th>
      <th style="padding: 10px; border: 1px solid #333; text-align: center; width: 100px;">Mã SP</th>
      <th style="padding: 10px; border: 1px solid #333; text-align: left;">Tên sản phẩm</th>
      <th style="padding: 10px; border: 1px solid #333; text-align: center; width: 60px;">ĐVT</th>
      <th style="padding: 10px; border: 1px solid #333; text-align: center; width: 60px;">SL Trả</th>
      <th style="padding: 10px; border: 1px solid #333; text-align: right; width: 100px;">Đơn giá</th>
      <th style="padding: 10px; border: 1px solid #333; text-align: right; width: 110px;">Thành tiền</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td style="padding: 8px; border: 1px solid #333; text-align: center;">{line_stt}</td>
      <td style="padding: 8px; border: 1px solid #333; text-align: center; font-family: monospace;">{line_variant_code}</td>
      <td style="padding: 8px; border: 1px solid #333;">{line_product_name}<br><small style="color: #666;">{line_variant}</small></td>
      <td style="padding: 8px; border: 1px solid #333; text-align: center;">{line_unit}</td>
      <td style="padding: 8px; border: 1px solid #333; text-align: center; font-weight: bold;">{line_quantity}</td>
      <td style="padding: 8px; border: 1px solid #333; text-align: right;">{line_price}</td>
      <td style="padding: 8px; border: 1px solid #333; text-align: right;">{line_amount}</td>
    </tr>
  </tbody>
</table>

<!-- TỔNG GIÁ TRỊ HOÀN -->
<table style="width: 250px; margin-left: auto; border-collapse: collapse; margin-bottom: 20px;">
  <tbody>
    <tr>
      <td style="padding: 8px; border: 1px solid #333;">Tổng số lượng trả:</td>
      <td style="padding: 8px; border: 1px solid #333; text-align: right; width: 120px;"><strong>{total_quantity}</strong></td>
    </tr>
    <tr style="background: #f5f5f5;">
      <td style="padding: 10px; border: 1px solid #333; font-weight: bold; font-size: 14px;">TỔNG TIỀN HOÀN:</td>
      <td style="padding: 10px; border: 1px solid #333; text-align: right; font-weight: bold; font-size: 14px;">{total_amount}</td>
    </tr>
    <tr>
      <td style="padding: 8px; border: 1px solid #333;">Bằng chữ:</td>
      <td style="padding: 8px; border: 1px solid #333; text-align: right; font-style: italic;">{total_text}</td>
    </tr>
    <tr>
      <td style="padding: 8px; border: 1px solid #333;">Trạng thái hoàn tiền:</td>
      <td style="padding: 8px; border: 1px solid #333; text-align: right;"><strong>{refund_status}</strong></td>
    </tr>
  </tbody>
</table>

<!-- GHI CHÚ -->
<div style="margin-bottom: 20px; padding: 12px; background: #f5f5f5; border: 1px solid #333;">
  <strong>Ghi chú:</strong> {note}
</div>

<!-- CHỮ KÝ -->
<table style="width: 100%; margin-top: 40px;">
  <tbody>
    <tr>
      <td style="width: 50%; text-align: center; padding: 10px; vertical-align: top;">
        <div style="font-weight: bold; margin-bottom: 5px;">KHÁCH HÀNG</div>
        <div style="color: #888; font-size: 12px; font-style: italic;">(Ký, ghi rõ họ tên)</div>
        <div style="height: 60px;"></div>
        <div>{customer_name}</div>
      </td>
      <td style="width: 50%; text-align: center; padding: 10px; vertical-align: top;">
        <div style="font-weight: bold; margin-bottom: 5px;">NGƯỜI NHẬN HÀNG</div>
        <div style="color: #888; font-size: 12px; font-style: italic;">(Ký, ghi rõ họ tên)</div>
        <div style="height: 60px;"></div>
        <div>{account_name}</div>
      </td>
    </tr>
  </tbody>
</table>

<!-- FOOTER -->
<div style="margin-top: 15px; padding-top: 8px; border-top: 1px dashed #ccc; font-size: 10px; color: #666; text-align: center;">
  In lúc: {print_date} {print_time}
</div>

</div>
`;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/features/settings/printer/templates/handover.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Mẫu in Phiếu bàn giao (Extended) - TipTap compatible
 */ __turbopack_context__.s([
    "HANDOVER_TEMPLATE",
    ()=>HANDOVER_TEMPLATE
]);
const HANDOVER_TEMPLATE = `
<div style="font-family: Arial, sans-serif; font-size: 12px; line-height: 1.4; max-width: 800px; margin: 0 auto; padding: 10px;">

<!-- HEADER -->
<div style="text-align: center; margin-bottom: 10px;">
  <div style="margin-bottom: 5px;">{store_logo}</div>
  <div style="font-size: 14px; font-weight: bold; margin-bottom: 2px;">{store_name}</div>
  <div style="color: #666;">{store_address}</div>
</div>

<!-- TIÊU ĐỀ -->
<h2 style="text-align: center; margin: 20px 0 10px 0; font-size: 18px; text-transform: uppercase; border-bottom: 2px solid #333; padding-bottom: 10px;">PHIẾU BÀN GIAO</h2>
<div style="text-align: center; margin-bottom: 20px;">
  <div style="font-size: 14px;">Số: <strong>{handover_code}</strong></div>
  <div>Ngày: {created_on} {created_on_time}</div>
</div>

<!-- THÔNG TIN BÀN GIAO -->
<table style="width: 100%; border-collapse: collapse; margin-bottom: 10px; table-layout: fixed;">
  <tbody>
    <tr>
      <td style="padding: 8px; width: 20%; background: #f5f5f5; border: 1px solid #333; font-weight: bold;">Người bàn giao:</td>
      <td style="padding: 8px; border: 1px solid #333;"><strong>{from_employee}</strong></td>
      <td style="padding: 8px; width: 20%; background: #f5f5f5; border: 1px solid #333; font-weight: bold;">Bộ phận:</td>
      <td style="padding: 8px; border: 1px solid #333;">{from_department}</td>
    </tr>
    <tr>
      <td style="padding: 8px; background: #f5f5f5; border: 1px solid #333; font-weight: bold;">Người nhận:</td>
      <td style="padding: 8px; border: 1px solid #333;"><strong>{to_employee}</strong></td>
      <td style="padding: 8px; background: #f5f5f5; border: 1px solid #333; font-weight: bold;">Bộ phận:</td>
      <td style="padding: 8px; border: 1px solid #333;">{to_department}</td>
    </tr>
    <tr>
      <td style="padding: 8px; background: #f5f5f5; border: 1px solid #333; font-weight: bold;">Loại bàn giao:</td>
      <td style="padding: 8px; border: 1px solid #333;">{handover_type}</td>
      <td style="padding: 8px; background: #f5f5f5; border: 1px solid #333; font-weight: bold;">Trạng thái:</td>
      <td style="padding: 8px; border: 1px solid #333;"><strong>{status}</strong></td>
    </tr>
  </tbody>
</table>

<!-- BẢNG NỘI DUNG BÀN GIAO -->
<table style="width: 100%; border-collapse: collapse; margin-bottom: 10px; table-layout: fixed;">
  <thead>
    <tr style="background: #f5f5f5;">
      <th style="padding: 10px; border: 1px solid #333; text-align: center; width: 40px;">STT</th>
      <th style="padding: 10px; border: 1px solid #333; text-align: left;">Nội dung bàn giao</th>
      <th style="padding: 10px; border: 1px solid #333; text-align: center; width: 80px;">Số lượng</th>
      <th style="padding: 10px; border: 1px solid #333; text-align: center; width: 100px;">Tình trạng</th>
      <th style="padding: 10px; border: 1px solid #333; text-align: left; width: 150px;">Ghi chú</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td style="padding: 8px; border: 1px solid #333; text-align: center;">{line_stt}</td>
      <td style="padding: 8px; border: 1px solid #333;">{line_description}</td>
      <td style="padding: 8px; border: 1px solid #333; text-align: center; font-weight: bold;">{line_quantity}</td>
      <td style="padding: 8px; border: 1px solid #333; text-align: center;">{line_condition}</td>
      <td style="padding: 8px; border: 1px solid #333;">{line_note}</td>
    </tr>
  </tbody>
</table>

<!-- GHI CHÚ CHUNG -->
<div style="margin-bottom: 20px; padding: 12px; background: #f5f5f5; border: 1px solid #333;">
  <strong>Ghi chú:</strong> {note}
</div>

<!-- CAM KẾT -->
<div style="margin-bottom: 20px; padding: 12px; background: #f5f5f5; border: 1px solid #333;">
  <strong>Cam kết:</strong> Hai bên đã kiểm tra và xác nhận đầy đủ các nội dung bàn giao trên. Người nhận cam kết bảo quản và sử dụng đúng mục đích.
</div>

<!-- CHỮ KÝ -->
<table style="width: 100%; margin-top: 40px;">
  <tbody>
    <tr>
      <td style="width: 33%; text-align: center; padding: 10px; vertical-align: top;">
        <div style="font-weight: bold; margin-bottom: 5px;">NGƯỜI BÀN GIAO</div>
        <div style="color: #888; font-size: 12px; font-style: italic;">(Ký, ghi rõ họ tên)</div>
        <div style="height: 60px;"></div>
        <div>{from_employee}</div>
      </td>
      <td style="width: 33%; text-align: center; padding: 10px; vertical-align: top;">
        <div style="font-weight: bold; margin-bottom: 5px;">NGƯỜI NHẬN</div>
        <div style="color: #888; font-size: 12px; font-style: italic;">(Ký, ghi rõ họ tên)</div>
        <div style="height: 60px;"></div>
        <div>{to_employee}</div>
      </td>
      <td style="width: 33%; text-align: center; padding: 10px; vertical-align: top;">
        <div style="font-weight: bold; margin-bottom: 5px;">XÁC NHẬN</div>
        <div style="color: #888; font-size: 12px; font-style: italic;">(Ký, ghi rõ họ tên)</div>
        <div style="height: 60px;"></div>
      </td>
    </tr>
  </tbody>
</table>

<!-- FOOTER -->
<div style="text-align: center; margin-top: 15px; padding-top: 8px; border-top: 1px dashed #333; color: #666; font-size: 11px;">
  Phiếu này được lập thành 02 bản, mỗi bên giữ 01 bản có giá trị như nhau.

  <div style="font-size: 10px; color: #666; margin-top: 5px;">In lúc: {print_date} {print_time}</div></div>

</div>
`;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/features/settings/printer/templates/refund-confirmation.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Mẫu in Phiếu xác nhận hoàn (Extended) - TipTap compatible
 */ __turbopack_context__.s([
    "REFUND_CONFIRMATION_TEMPLATE",
    ()=>REFUND_CONFIRMATION_TEMPLATE
]);
const REFUND_CONFIRMATION_TEMPLATE = `
<div style="font-family: Arial, sans-serif; font-size: 12px; line-height: 1.4; max-width: 800px; margin: 0 auto; padding: 10px;">

<!-- HEADER -->
<div style="text-align: center; margin-bottom: 10px;">
  <div style="margin-bottom: 5px;">{store_logo}</div>
  <div style="font-size: 14px; font-weight: bold; margin-bottom: 2px;">{store_name}</div>
  <div style="color: #666;">{store_address}</div>
  <div style="color: #666;">ĐT: {store_phone_number}</div>
</div>

<!-- TIÊU ĐỀ -->
<h2 style="text-align: center; margin: 20px 0 10px 0; font-size: 18px; text-transform: uppercase; border-bottom: 2px solid #333; padding-bottom: 10px;">PHIẾU XÁC NHẬN HOÀN TIỀN</h2>
<div style="text-align: center; margin-bottom: 20px;">
  <div style="font-size: 14px;">Số: <strong>{refund_code}</strong></div>
  <div>Ngày: {created_on} {created_on_time}</div>
</div>

<!-- THÔNG TIN HOÀN TIỀN -->
<table style="width: 100%; border-collapse: collapse; margin-bottom: 10px; table-layout: fixed;">
  <tbody>
    <tr>
      <td style="padding: 8px; width: 25%; background: #f5f5f5; border: 1px solid #333; font-weight: bold;">Mã đơn hàng gốc:</td>
      <td style="padding: 8px; border: 1px solid #333;"><strong>{order_code}</strong></td>
      <td style="padding: 8px; width: 20%; background: #f5f5f5; border: 1px solid #333; font-weight: bold;">Ngày đặt:</td>
      <td style="padding: 8px; border: 1px solid #333;">{order_date}</td>
    </tr>
    <tr>
      <td style="padding: 8px; background: #f5f5f5; border: 1px solid #333; font-weight: bold;">Mã phiếu trả:</td>
      <td style="padding: 8px; border: 1px solid #333;"><strong>{return_code}</strong></td>
      <td style="padding: 8px; background: #f5f5f5; border: 1px solid #333; font-weight: bold;">Ngày trả:</td>
      <td style="padding: 8px; border: 1px solid #333;">{return_date}</td>
    </tr>
  </tbody>
</table>

<!-- THÔNG TIN KHÁCH HÀNG -->
<table style="width: 100%; border-collapse: collapse; margin-bottom: 10px; table-layout: fixed;">
  <tbody>
    <tr>
      <td style="padding: 8px; width: 25%; background: #f5f5f5; border: 1px solid #333; font-weight: bold;">Khách hàng:</td>
      <td style="padding: 8px; border: 1px solid #333;"><strong>{customer_name}</strong></td>
      <td style="padding: 8px; width: 20%; background: #f5f5f5; border: 1px solid #333; font-weight: bold;">Điện thoại:</td>
      <td style="padding: 8px; border: 1px solid #333;">{customer_phone_number}</td>
    </tr>
    <tr>
      <td style="padding: 8px; background: #f5f5f5; border: 1px solid #333; font-weight: bold;">Lý do hoàn:</td>
      <td style="padding: 8px; border: 1px solid #333;" colspan="3">{refund_reason}</td>
    </tr>
  </tbody>
</table>

<!-- CHI TIẾT HOÀN TIỀN -->
<div style="background: #f5f5f5; border: 2px solid #333; padding: 20px; margin-bottom: 20px; text-align: center;">
  <div style="font-size: 14px; color: #666; margin-bottom: 10px;">SỐ TIỀN HOÀN</div>
  <div style="font-size: 28px; font-weight: bold;">{refund_amount}</div>
  <div style="font-style: italic; color: #666; margin-top: 5px;">({refund_amount_text})</div>
</div>

<!-- THÔNG TIN HOÀN -->
<table style="width: 100%; border-collapse: collapse; margin-bottom: 10px; table-layout: fixed;">
  <tbody>
    <tr>
      <td style="padding: 8px; width: 25%; background: #f5f5f5; border: 1px solid #333; font-weight: bold;">Hình thức hoàn:</td>
      <td style="padding: 8px; border: 1px solid #333;"><strong>{refund_method}</strong></td>
      <td style="padding: 8px; width: 20%; background: #f5f5f5; border: 1px solid #333; font-weight: bold;">Trạng thái:</td>
      <td style="padding: 8px; border: 1px solid #333;"><strong>{refund_status}</strong></td>
    </tr>
    <tr>
      <td style="padding: 8px; background: #f5f5f5; border: 1px solid #333; font-weight: bold;">Ngày hoàn tiền:</td>
      <td style="padding: 8px; border: 1px solid #333;">{refunded_on}</td>
      <td style="padding: 8px; background: #f5f5f5; border: 1px solid #333; font-weight: bold;">Người xử lý:</td>
      <td style="padding: 8px; border: 1px solid #333;">{account_name}</td>
    </tr>
  </tbody>
</table>

<!-- THÔNG TIN TÀI KHOẢN (nếu chuyển khoản) -->
<table style="width: 100%; border-collapse: collapse; margin-bottom: 10px; table-layout: fixed;">
  <tbody>
    <tr>
      <td style="padding: 8px; width: 25%; background: #f5f5f5; border: 1px solid #333; font-weight: bold;">Ngân hàng:</td>
      <td style="padding: 8px; border: 1px solid #333;">{bank_name}</td>
      <td style="padding: 8px; width: 20%; background: #f5f5f5; border: 1px solid #333; font-weight: bold;">Chi nhánh:</td>
      <td style="padding: 8px; border: 1px solid #333;">{bank_branch}</td>
    </tr>
    <tr>
      <td style="padding: 8px; background: #f5f5f5; border: 1px solid #333; font-weight: bold;">Số tài khoản:</td>
      <td style="padding: 8px; border: 1px solid #333;"><strong>{bank_account}</strong></td>
      <td style="padding: 8px; background: #f5f5f5; border: 1px solid #333; font-weight: bold;">Chủ tài khoản:</td>
      <td style="padding: 8px; border: 1px solid #333;">{bank_account_name}</td>
    </tr>
  </tbody>
</table>

<!-- GHI CHÚ -->
<div style="margin-bottom: 20px; padding: 12px; background: #f5f5f5; border: 1px solid #333;">
  <strong>Ghi chú:</strong> {note}
</div>

<!-- CHỮ KÝ -->
<table style="width: 100%; margin-top: 40px;">
  <tbody>
    <tr>
      <td style="width: 50%; text-align: center; padding: 10px; vertical-align: top;">
        <div style="font-weight: bold; margin-bottom: 5px;">KHÁCH HÀNG</div>
        <div style="color: #888; font-size: 12px; font-style: italic;">(Ký xác nhận đã nhận tiền)</div>
        <div style="height: 60px;"></div>
        <div>{customer_name}</div>
      </td>
      <td style="width: 50%; text-align: center; padding: 10px; vertical-align: top;">
        <div style="font-weight: bold; margin-bottom: 5px;">NGƯỜI XỬ LÝ</div>
        <div style="color: #888; font-size: 12px; font-style: italic;">(Ký, ghi rõ họ tên)</div>
        <div style="height: 60px;"></div>
        <div>{account_name}</div>
      </td>
    </tr>
  </tbody>
</table>

<!-- FOOTER -->
<div style="margin-top: 15px; padding-top: 8px; border-top: 1px dashed #ccc; font-size: 10px; color: #666; text-align: center;">
  In lúc: {print_date} {print_time}
</div>

</div>
`;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/features/settings/printer/templates/packing-guide.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Mẫu in Phiếu hướng dẫn đóng gói (Extended) - TipTap compatible
 */ __turbopack_context__.s([
    "PACKING_GUIDE_TEMPLATE",
    ()=>PACKING_GUIDE_TEMPLATE
]);
const PACKING_GUIDE_TEMPLATE = `
<div style="font-family: Arial, sans-serif; font-size: 12px; line-height: 1.4; max-width: 800px; margin: 0 auto; padding: 10px;">

<!-- HEADER -->
<div style="text-align: center; margin-bottom: 10px;">
  <div style="margin-bottom: 5px;">{store_logo}</div>
  <div style="font-size: 14px; font-weight: bold; margin-bottom: 2px;">{store_name}</div>
</div>

<!-- TIÊU ĐỀ -->
<h2 style="text-align: center; margin: 20px 0 10px 0; font-size: 18px; text-transform: uppercase; border-bottom: 2px solid #333; padding-bottom: 10px;">HƯỚNG DẪN ĐÓNG GÓI</h2>
<div style="text-align: center; margin-bottom: 20px;">
  <div style="font-size: 14px;">Đơn hàng: <strong>{order_code}</strong></div>
  <div>Ngày: {created_on}</div>
</div>

<!-- THÔNG TIN NGƯỜI NHẬN -->
<div style="background: #f5f5f5; border: 1px solid #333; padding: 15px; margin-bottom: 20px;">
  <div style="font-weight: bold; margin-bottom: 10px;">THÔNG TIN GIAO HÀNG</div>
  <table style="width: 100%;">
    <tbody>
      <tr>
        <td style="padding: 5px 0; width: 120px;"><strong>Người nhận:</strong></td>
        <td>{customer_name}</td>
      </tr>
      <tr>
        <td style="padding: 5px 0;"><strong>Điện thoại:</strong></td>
        <td>{customer_phone_number}</td>
      </tr>
      <tr>
        <td style="padding: 5px 0;"><strong>Địa chỉ:</strong></td>
        <td>{shipping_address}</td>
      </tr>
    </tbody>
  </table>
</div>

<!-- CHECKLIST ĐÓNG GÓI -->
<div style="background: #f5f5f5; border: 1px solid #333; padding: 15px; margin-bottom: 20px;">
  <div style="font-weight: bold; margin-bottom: 10px;">CHECKLIST ĐÓNG GÓI</div>
  <table style="width: 100%;">
    <tbody>
      <tr><td style="padding: 5px 0;">[ ] Kiểm tra đầy đủ sản phẩm theo danh sách</td></tr>
      <tr><td style="padding: 5px 0;">[ ] Kiểm tra tình trạng sản phẩm</td></tr>
      <tr><td style="padding: 5px 0;">[ ] Bọc chống sốc cho sản phẩm dễ vỡ</td></tr>
      <tr><td style="padding: 5px 0;">[ ] Đóng gói chắc chắn, dán kín</td></tr>
      <tr><td style="padding: 5px 0;">[ ] Dán nhãn giao hàng</td></tr>
      <tr><td style="padding: 5px 0;">[ ] Kèm hóa đơn/phiếu giao hàng</td></tr>
    </tbody>
  </table>
</div>

<!-- DANH SÁCH SẢN PHẨM -->
<table style="width: 100%; border-collapse: collapse; margin-bottom: 10px; table-layout: fixed;">
  <thead>
    <tr style="background: #f5f5f5;">
      <th style="padding: 10px; border: 1px solid #333; text-align: center; width: 40px;">STT</th>
      <th style="padding: 10px; border: 1px solid #333; text-align: center; width: 100px;">Mã SP</th>
      <th style="padding: 10px; border: 1px solid #333; text-align: left;">Tên sản phẩm</th>
      <th style="padding: 10px; border: 1px solid #333; text-align: center; width: 60px;">SL</th>
      <th style="padding: 10px; border: 1px solid #333; text-align: center; width: 100px;">Vị trí kho</th>
      <th style="padding: 10px; border: 1px solid #333; text-align: center; width: 60px;">Đã lấy</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td style="padding: 8px; border: 1px solid #333; text-align: center;">{line_stt}</td>
      <td style="padding: 8px; border: 1px solid #333; text-align: center; font-family: monospace;">{line_variant_code}</td>
      <td style="padding: 8px; border: 1px solid #333;">{line_product_name}<br><small style="color: #666;">{line_variant}</small></td>
      <td style="padding: 8px; border: 1px solid #333; text-align: center; font-weight: bold; font-size: 16px;">{line_quantity}</td>
      <td style="padding: 8px; border: 1px solid #333; text-align: center;">{bin_location}</td>
      <td style="padding: 8px; border: 1px solid #333; text-align: center; font-size: 20px;">[ ]</td>
    </tr>
  </tbody>
</table>

<!-- TỔNG QUAN -->
<table style="width: 250px; margin-left: auto; border-collapse: collapse; margin-bottom: 20px;">
  <tbody>
    <tr style="background: #f5f5f5;">
      <td style="padding: 10px; border: 1px solid #333; font-weight: bold;">Tổng số lượng:</td>
      <td style="padding: 10px; border: 1px solid #333; text-align: right; font-weight: bold; font-size: 16px;">{total_quantity}</td>
    </tr>
    <tr>
      <td style="padding: 10px; border: 1px solid #333;">COD thu hộ:</td>
      <td style="padding: 10px; border: 1px solid #333; text-align: right; font-weight: bold;">{cod}</td>
    </tr>
  </tbody>
</table>

<!-- LƯU Ý ĐẶC BIỆT -->
<div style="background: #f5f5f5; border: 1px solid #333; padding: 15px; margin-bottom: 20px;">
  <div style="font-weight: bold; margin-bottom: 10px;">LƯU Ý ĐẶC BIỆT</div>
  <div>{packing_note}</div>
  <div style="margin-top: 10px; padding-top: 10px; border-top: 1px dashed #333;">
    <strong>Ghi chú đơn hàng:</strong> {order_note}
  </div>
</div>

<!-- CHỮ KÝ -->
<table style="width: 100%; margin-top: 30px;">
  <tbody>
    <tr>
      <td style="width: 50%; text-align: center; padding: 10px; vertical-align: top;">
        <div style="font-weight: bold; margin-bottom: 5px;">NGƯỜI ĐÓNG GÓI</div>
        <div style="color: #888; font-size: 12px; font-style: italic;">(Ký, ghi rõ họ tên)</div>
        <div style="height: 50px;"></div>
        <div>{account_name}</div>
      </td>
      <td style="width: 50%; text-align: center; padding: 10px; vertical-align: top;">
        <div style="font-weight: bold; margin-bottom: 5px;">KIỂM TRA</div>
        <div style="color: #888; font-size: 12px; font-style: italic;">(Ký, ghi rõ họ tên)</div>
        <div style="height: 50px;"></div>
      </td>
    </tr>
  </tbody>
</table>

<!-- FOOTER -->
<div style="text-align: center; margin-top: 15px; padding-top: 8px; border-top: 1px dashed #333; font-size: 10px; color: #666;">
  In lúc: {print_date} {print_time}
</div>

</div>
`;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/features/settings/printer/templates/sales-summary.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Mẫu in Phiếu tổng kết bán hàng (Extended) - TipTap compatible
 */ __turbopack_context__.s([
    "SALES_SUMMARY_TEMPLATE",
    ()=>SALES_SUMMARY_TEMPLATE
]);
const SALES_SUMMARY_TEMPLATE = `
<div style="font-family: Arial, sans-serif; font-size: 12px; line-height: 1.4; max-width: 800px; margin: 0 auto; padding: 10px;">

<!-- HEADER -->
<div style="text-align: center; margin-bottom: 10px;">
  <div style="margin-bottom: 5px;">{store_logo}</div>
  <div style="font-size: 14px; font-weight: bold; margin-bottom: 2px;">{store_name}</div>
  <div style="color: #666;">Chi nhánh: {location_name}</div>
</div>

<!-- TIÊU ĐỀ -->
<h2 style="text-align: center; margin: 20px 0 10px 0; font-size: 18px; text-transform: uppercase; border-bottom: 2px solid #333; padding-bottom: 10px;">BÁO CÁO TỔNG KẾT BÁN HÀNG</h2>
<div style="text-align: center; margin-bottom: 20px;">
  <div style="font-size: 14px;">Kỳ báo cáo: <strong>{period}</strong></div>
  <div>Từ ngày: {from_date} - Đến ngày: {to_date}</div>
  <div>Người lập: {account_name} | Ngày lập: {created_on}</div>
</div>

<!-- THỐNG KÊ TỔNG QUAN -->
<table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
  <tbody>
    <tr>
      <td style="width: 25%; padding: 15px; text-align: center; background: #f5f5f5; border: 1px solid #333;">
        <div style="font-size: 12px; color: #666;">Tổng đơn hàng</div>
        <div style="font-size: 24px; font-weight: bold;">{total_orders}</div>
      </td>
      <td style="width: 25%; padding: 15px; text-align: center; background: #f5f5f5; border: 1px solid #333;">
        <div style="font-size: 12px; color: #666;">Doanh thu</div>
        <div style="font-size: 24px; font-weight: bold;">{total_revenue}</div>
      </td>
      <td style="width: 25%; padding: 15px; text-align: center; background: #f5f5f5; border: 1px solid #333;">
        <div style="font-size: 12px; color: #666;">Chiết khấu</div>
        <div style="font-size: 24px; font-weight: bold;">{total_discount}</div>
      </td>
      <td style="width: 25%; padding: 15px; text-align: center; background: #f5f5f5; border: 1px solid #333;">
        <div style="font-size: 12px; color: #666;">Trả hàng</div>
        <div style="font-size: 24px; font-weight: bold;">{total_returns}</div>
      </td>
    </tr>
  </tbody>
</table>

<!-- CHI TIẾT DOANH THU -->
<div style="background: #f5f5f5; border: 1px solid #333; padding: 15px; margin-bottom: 20px;">
  <div style="font-weight: bold; margin-bottom: 10px; font-size: 14px;">CHI TIẾT DOANH THU</div>
  <table style="width: 100%; border-collapse: collapse;">
    <tbody>
      <tr>
        <td style="padding: 8px; border-bottom: 1px solid #333;">Doanh thu bán hàng:</td>
        <td style="padding: 8px; border-bottom: 1px solid #333; text-align: right; font-weight: bold;">{sales_revenue}</td>
      </tr>
      <tr>
        <td style="padding: 8px; border-bottom: 1px solid #333;">Phí giao hàng thu được:</td>
        <td style="padding: 8px; border-bottom: 1px solid #333; text-align: right;">{delivery_revenue}</td>
      </tr>
      <tr>
        <td style="padding: 8px; border-bottom: 1px solid #333;">Thuế VAT:</td>
        <td style="padding: 8px; border-bottom: 1px solid #333; text-align: right;">{total_tax}</td>
      </tr>
      <tr style="background: #f5f5f5;">
        <td style="padding: 10px; font-weight: bold; font-size: 14px;">TỔNG DOANH THU:</td>
        <td style="padding: 10px; text-align: right; font-weight: bold; font-size: 16px;">{total_revenue}</td>
      </tr>
    </tbody>
  </table>
</div>

<!-- THỐNG KÊ THANH TOÁN -->
<div style="background: #f5f5f5; border: 1px solid #333; padding: 15px; margin-bottom: 20px;">
  <div style="font-weight: bold; margin-bottom: 10px; font-size: 14px;">THỐNG KÊ THANH TOÁN</div>
  <table style="width: 100%; border-collapse: collapse;">
    <tbody>
      <tr>
        <td style="padding: 8px; border-bottom: 1px solid #333;">Tiền mặt:</td>
        <td style="padding: 8px; border-bottom: 1px solid #333; text-align: right; font-weight: bold;">{cash_amount}</td>
      </tr>
      <tr>
        <td style="padding: 8px; border-bottom: 1px solid #333;">Chuyển khoản:</td>
        <td style="padding: 8px; border-bottom: 1px solid #333; text-align: right;">{bank_transfer_amount}</td>
      </tr>
      <tr>
        <td style="padding: 8px; border-bottom: 1px solid #333;">Thẻ tín dụng:</td>
        <td style="padding: 8px; border-bottom: 1px solid #333; text-align: right;">{card_amount}</td>
      </tr>
      <tr>
        <td style="padding: 8px; border-bottom: 1px solid #333;">Ví điện tử:</td>
        <td style="padding: 8px; border-bottom: 1px solid #333; text-align: right;">{ewallet_amount}</td>
      </tr>
      <tr>
        <td style="padding: 8px; border-bottom: 1px solid #333;">COD:</td>
        <td style="padding: 8px; border-bottom: 1px solid #333; text-align: right;">{cod_amount}</td>
      </tr>
      <tr style="background: #f5f5f5;">
        <td style="padding: 10px; font-weight: bold;">TỔNG THU:</td>
        <td style="padding: 10px; text-align: right; font-weight: bold; font-size: 14px;">{total_collected}</td>
      </tr>
    </tbody>
  </table>
</div>

<!-- TOP SẢN PHẨM BÁN CHẠY -->
<div style="margin-bottom: 20px;">
  <div style="font-weight: bold; margin-bottom: 10px; color: #333; font-size: 14px;">TOP SẢN PHẨM BÁN CHẠY</div>
  <table style="width: 100%; border-collapse: collapse;">
    <thead>
      <tr style="background: #f5f5f5;">
        <th style="padding: 10px; border: 1px solid #333; text-align: center; width: 40px;">STT</th>
        <th style="padding: 10px; border: 1px solid #333; text-align: left;">Sản phẩm</th>
        <th style="padding: 10px; border: 1px solid #333; text-align: center; width: 80px;">SL bán</th>
        <th style="padding: 10px; border: 1px solid #333; text-align: right; width: 120px;">Doanh thu</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td style="padding: 8px; border: 1px solid #333; text-align: center;">{line_stt}</td>
        <td style="padding: 8px; border: 1px solid #333;">{line_product_name}</td>
        <td style="padding: 8px; border: 1px solid #333; text-align: center; font-weight: bold;">{line_quantity}</td>
        <td style="padding: 8px; border: 1px solid #333; text-align: right;">{line_amount}</td>
      </tr>
    </tbody>
  </table>
</div>

<!-- GHI CHÚ -->
<div style="margin-bottom: 20px; padding: 12px; background: #f5f5f5; border: 1px solid #333;">
  <strong>Ghi chú:</strong> {note}
</div>

<!-- CHỮ KÝ -->
<table style="width: 100%; margin-top: 40px;">
  <tbody>
    <tr>
      <td style="width: 50%; text-align: center; padding: 10px; vertical-align: top;">
        <div style="font-weight: bold; margin-bottom: 5px;">NGƯỜI LẬP BÁO CÁO</div>
        <div style="color: #888; font-size: 12px; font-style: italic;">(Ký, ghi rõ họ tên)</div>
        <div style="height: 60px;"></div>
        <div>{account_name}</div>
      </td>
      <td style="width: 50%; text-align: center; padding: 10px; vertical-align: top;">
        <div style="font-weight: bold; margin-bottom: 5px;">QUẢN LÝ XÁC NHẬN</div>
        <div style="color: #888; font-size: 12px; font-style: italic;">(Ký, ghi rõ họ tên)</div>
        <div style="height: 60px;"></div>
      </td>
    </tr>
  </tbody>
</table>

<!-- FOOTER -->
<div style="margin-top: 15px; padding-top: 8px; border-top: 1px dashed #ccc; font-size: 10px; color: #666; text-align: center;">
  In lúc: {print_date} {print_time}
</div>

</div>
`;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/features/settings/printer/templates/warranty-request.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Mẫu in Phiếu yêu cầu bảo hành (Extended) - TipTap compatible
 */ __turbopack_context__.s([
    "WARRANTY_REQUEST_TEMPLATE",
    ()=>WARRANTY_REQUEST_TEMPLATE
]);
const WARRANTY_REQUEST_TEMPLATE = `
<div style="font-family: Arial, sans-serif; font-size: 12px; line-height: 1.4; max-width: 800px; margin: 0 auto; padding: 10px;">

<!-- HEADER -->
<div style="text-align: center; margin-bottom: 10px;">
  <div style="margin-bottom: 5px;">{store_logo}</div>
  <div style="font-size: 14px; font-weight: bold; margin-bottom: 2px;">{store_name}</div>
  <div style="color: #666;">{store_address}</div>
  <div style="color: #666;">Hotline: {store_phone_number}</div>
</div>

<!-- TIÊU ĐỀ -->
<h2 style="text-align: center; margin: 20px 0 10px 0; font-size: 18px; text-transform: uppercase; border-bottom: 2px solid #333; padding-bottom: 10px;">PHIẾU YÊU CẦU BẢO HÀNH</h2>
<div style="text-align: center; margin-bottom: 20px;">
  <div style="font-size: 14px;">Số: <strong>{warranty_request_code}</strong></div>
  <div>Ngày tiếp nhận: {created_on} {created_on_time}</div>
</div>

<!-- THÔNG TIN KHÁCH HÀNG -->
<div style="background: #f5f5f5; border: 1px solid #333; padding: 15px; margin-bottom: 20px;">
  <div style="font-weight: bold; margin-bottom: 10px;">THÔNG TIN KHÁCH HÀNG</div>
  <table style="width: 100%;">
    <tbody>
      <tr>
        <td style="padding: 5px 0; width: 25%;"><strong>Họ tên:</strong></td>
        <td style="padding: 5px 0;"><strong>{customer_name}</strong></td>
        <td style="padding: 5px 0; width: 20%;"><strong>Mã KH:</strong></td>
        <td style="padding: 5px 0;">{customer_code}</td>
      </tr>
      <tr>
        <td style="padding: 5px 0;"><strong>Điện thoại:</strong></td>
        <td style="padding: 5px 0;">{customer_phone_number}</td>
        <td style="padding: 5px 0;"><strong>Email:</strong></td>
        <td style="padding: 5px 0;">{customer_email}</td>
      </tr>
      <tr>
        <td style="padding: 5px 0;"><strong>Địa chỉ:</strong></td>
        <td style="padding: 5px 0;" colspan="3">{customer_address}</td>
      </tr>
    </tbody>
  </table>
</div>

<!-- THÔNG TIN SẢN PHẨM -->
<div style="background: #f5f5f5; border: 1px solid #333; padding: 15px; margin-bottom: 20px;">
  <div style="font-weight: bold; margin-bottom: 10px;">THÔNG TIN SẢN PHẨM BẢO HÀNH</div>
  <table style="width: 100%;">
    <tbody>
      <tr>
        <td style="padding: 5px 0; width: 25%;"><strong>Sản phẩm:</strong></td>
        <td style="padding: 5px 0;"><strong>{product_name}</strong></td>
      </tr>
      <tr>
        <td style="padding: 5px 0;"><strong>Mã SP:</strong></td>
        <td style="padding: 5px 0;">{product_code}</td>
      </tr>
      <tr>
        <td style="padding: 5px 0;"><strong>Serial/IMEI:</strong></td>
        <td style="padding: 5px 0;"><strong>{serial_number}</strong></td>
      </tr>
      <tr>
        <td style="padding: 5px 0;"><strong>Mã đơn hàng gốc:</strong></td>
        <td style="padding: 5px 0;">{order_code}</td>
      </tr>
      <tr>
        <td style="padding: 5px 0;"><strong>Ngày mua:</strong></td>
        <td style="padding: 5px 0;">{purchase_date}</td>
      </tr>
      <tr>
        <td style="padding: 5px 0;"><strong>Thời hạn BH:</strong></td>
        <td style="padding: 5px 0;">{warranty_duration}</td>
      </tr>
      <tr>
        <td style="padding: 5px 0;"><strong>Hết hạn BH:</strong></td>
        <td style="padding: 5px 0;"><strong>{warranty_expired_on}</strong></td>
      </tr>
    </tbody>
  </table>
</div>

<!-- TÌNH TRẠNG LỖI -->
<div style="background: #f5f5f5; border: 1px solid #333; padding: 15px; margin-bottom: 20px;">
  <div style="font-weight: bold; margin-bottom: 10px;">TÌNH TRẠNG LỖI</div>
  <table style="width: 100%;">
    <tbody>
      <tr>
        <td style="padding: 5px 0; width: 25%;"><strong>Loại lỗi:</strong></td>
        <td style="padding: 5px 0;"><strong>{issue_type}</strong></td>
      </tr>
      <tr>
        <td style="padding: 5px 0; vertical-align: top;"><strong>Mô tả lỗi:</strong></td>
        <td style="padding: 5px 0;">{issue_description}</td>
      </tr>
      <tr>
        <td style="padding: 5px 0;"><strong>Tình trạng máy:</strong></td>
        <td style="padding: 5px 0;">{device_condition}</td>
      </tr>
      <tr>
        <td style="padding: 5px 0;"><strong>Phụ kiện kèm:</strong></td>
        <td style="padding: 5px 0;">{accessories}</td>
      </tr>
    </tbody>
  </table>
</div>

<!-- TRẠNG THÁI XỬ LÝ -->
<table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
  <tbody>
    <tr>
      <td style="padding: 8px; width: 25%; background: #f5f5f5; border: 1px solid #d9d9d9; font-weight: bold;">Trạng thái:</td>
      <td style="padding: 8px; border: 1px solid #d9d9d9;"><strong style="color: #eb2f96;">{status}</strong></td>
      <td style="padding: 8px; width: 25%; background: #f5f5f5; border: 1px solid #d9d9d9; font-weight: bold;">Ưu tiên:</td>
      <td style="padding: 8px; border: 1px solid #d9d9d9;">{priority}</td>
    </tr>
    <tr>
      <td style="padding: 8px; background: #f5f5f5; border: 1px solid #d9d9d9; font-weight: bold;">Người tiếp nhận:</td>
      <td style="padding: 8px; border: 1px solid #d9d9d9;">{received_by}</td>
      <td style="padding: 8px; background: #f5f5f5; border: 1px solid #d9d9d9; font-weight: bold;">Kỹ thuật viên:</td>
      <td style="padding: 8px; border: 1px solid #d9d9d9;">{technician_name}</td>
    </tr>
    <tr>
      <td style="padding: 8px; background: #f5f5f5; border: 1px solid #d9d9d9; font-weight: bold;">Dự kiến hoàn thành:</td>
      <td style="padding: 8px; border: 1px solid #d9d9d9;" colspan="3">{expected_completion_date}</td>
    </tr>
  </tbody>
</table>

<!-- GHI CHÚ -->
<div style="margin-bottom: 20px; padding: 12px; background: #f5f5f5; border: 1px solid #333;">
  <strong>Ghi chú:</strong> {note}
</div>

<!-- QUY ĐỊNH BẢO HÀNH -->
<div style="margin-bottom: 20px; padding: 12px; background: #f5f5f5; border: 1px solid #333; font-size: 11px;">
  <strong>QUY ĐỊNH BẢO HÀNH:</strong>
  <ul style="margin: 5px 0 0 15px; padding: 0;">
    <li>Thời gian xử lý: 7-14 ngày làm việc (tùy mức độ lỗi)</li>
    <li>Khách hàng vui lòng mang theo phiếu này khi nhận máy</li>
    <li>Cửa hàng không chịu trách nhiệm nếu máy không được nhận trong 30 ngày</li>
    <li>Hotline hỗ trợ: {store_phone_number}</li>
  </ul>
</div>

<!-- CHỮ KÝ -->
<table style="width: 100%; margin-top: 30px;">
  <tbody>
    <tr>
      <td style="width: 50%; text-align: center; padding: 10px; vertical-align: top;">
        <div style="font-weight: bold; margin-bottom: 5px;">KHÁCH HÀNG</div>
        <div style="color: #888; font-size: 12px; font-style: italic;">(Ký xác nhận)</div>
        <div style="height: 50px;"></div>
        <div>{customer_name}</div>
      </td>
      <td style="width: 50%; text-align: center; padding: 10px; vertical-align: top;">
        <div style="font-weight: bold; margin-bottom: 5px;">NHÂN VIÊN TIẾP NHẬN</div>
        <div style="color: #888; font-size: 12px; font-style: italic;">(Ký, ghi rõ họ tên)</div>
        <div style="height: 50px;"></div>
        <div>{received_by}</div>
      </td>
    </tr>
  </tbody>
</table>

<!-- FOOTER -->
<div style="margin-top: 15px; padding-top: 8px; border-top: 1px dashed #ccc; font-size: 10px; color: #666; text-align: center;">
  In lúc: {print_date} {print_time}
</div>

</div>
`;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/features/settings/printer/templates/packing-request.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Mẫu in Phiếu yêu cầu đóng gói (Extended) - TipTap compatible
 */ __turbopack_context__.s([
    "PACKING_REQUEST_TEMPLATE",
    ()=>PACKING_REQUEST_TEMPLATE
]);
const PACKING_REQUEST_TEMPLATE = `
<div style="font-family: Arial, sans-serif; font-size: 12px; line-height: 1.4; max-width: 800px; margin: 0 auto; padding: 10px;">

<!-- HEADER -->
<div style="text-align: center; margin-bottom: 10px;">
  <div style="margin-bottom: 5px;">{store_logo}</div>
  <div style="font-size: 14px; font-weight: bold; margin-bottom: 2px;">{store_name}</div>
  <div style="color: #666;">Kho: {location_name}</div>
</div>

<!-- TIÊU ĐỀ -->
<h2 style="text-align: center; margin: 20px 0 10px 0; font-size: 18px; text-transform: uppercase; border-bottom: 2px solid #333; padding-bottom: 10px;">PHIẾU YÊU CẦU ĐÓNG GÓI</h2>
<div style="text-align: center; margin-bottom: 20px;">
  <div style="font-size: 14px;">Mã yêu cầu: <strong>{packing_request_code}</strong></div>
  <div>Đơn hàng: <strong>{order_code}</strong></div>
  <div>Ngày tạo: {created_on} {created_on_time}</div>
</div>

<!-- ĐỘ ƯU TIÊN -->
<div style="text-align: center; margin-bottom: 20px;">
  <span style="background: #f5f5f5; border: 1px solid #333; padding: 8px 20px; font-weight: bold; font-size: 14px;">
    ĐỘ ƯU TIÊN: {priority}
  </span>
</div>

<!-- THÔNG TIN GIAO HÀNG -->
<div style="background: #f5f5f5; border: 1px solid #333; padding: 15px; margin-bottom: 20px;">
  <div style="font-weight: bold; margin-bottom: 10px;">THÔNG TIN GIAO HÀNG</div>
  <table style="width: 100%;">
    <tbody>
      <tr>
        <td style="padding: 5px 0; width: 25%;"><strong>Người nhận:</strong></td>
        <td style="padding: 5px 0;"><strong>{customer_name}</strong></td>
      </tr>
      <tr>
        <td style="padding: 5px 0;"><strong>Điện thoại:</strong></td>
        <td style="padding: 5px 0;">{customer_phone_number}</td>
      </tr>
      <tr>
        <td style="padding: 5px 0;"><strong>Địa chỉ:</strong></td>
        <td style="padding: 5px 0;">{shipping_address}</td>
      </tr>
      <tr>
        <td style="padding: 5px 0;"><strong>Đơn vị VC:</strong></td>
        <td style="padding: 5px 0;">{carrier_name}</td>
      </tr>
      <tr>
        <td style="padding: 5px 0;"><strong>Dịch vụ:</strong></td>
        <td style="padding: 5px 0;">{service_name}</td>
      </tr>
    </tbody>
  </table>
</div>

<!-- DANH SÁCH SẢN PHẨM CẦN ĐÓNG GÓI -->
<table style="width: 100%; border-collapse: collapse; margin-bottom: 10px; table-layout: fixed;">
  <thead>
    <tr style="background: #f5f5f5;">
      <th style="padding: 10px; border: 1px solid #333; text-align: center; width: 40px;">STT</th>
      <th style="padding: 10px; border: 1px solid #333; text-align: center; width: 100px;">Mã SP</th>
      <th style="padding: 10px; border: 1px solid #333; text-align: left;">Tên sản phẩm</th>
      <th style="padding: 10px; border: 1px solid #333; text-align: center; width: 60px;">SL</th>
      <th style="padding: 10px; border: 1px solid #333; text-align: center; width: 100px;">Vị trí kho</th>
      <th style="padding: 10px; border: 1px solid #333; text-align: center; width: 60px;">Lấy</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td style="padding: 8px; border: 1px solid #333; text-align: center;">{line_stt}</td>
      <td style="padding: 8px; border: 1px solid #333; text-align: center; font-family: monospace;">{line_variant_code}</td>
      <td style="padding: 8px; border: 1px solid #333;">{line_product_name}<br><small style="color: #666;">{line_variant}</small></td>
      <td style="padding: 8px; border: 1px solid #333; text-align: center; font-weight: bold; font-size: 16px;">{line_quantity}</td>
      <td style="padding: 8px; border: 1px solid #333; text-align: center; font-weight: bold;">{bin_location}</td>
      <td style="padding: 8px; border: 1px solid #333; text-align: center; font-size: 20px;">[ ]</td>
    </tr>
  </tbody>
</table>

<!-- THỐNG KÊ -->
<table style="width: 250px; margin-left: auto; border-collapse: collapse; margin-bottom: 20px;">
  <tbody>
    <tr>
      <td style="padding: 10px; border: 1px solid #333; background: #f5f5f5; font-weight: bold;">Tổng số lượng:</td>
      <td style="padding: 10px; border: 1px solid #333; text-align: right; font-weight: bold; font-size: 16px;">{total_quantity}</td>
    </tr>
    <tr>
      <td style="padding: 10px; border: 1px solid #333;">Tổng khối lượng:</td>
      <td style="padding: 10px; border: 1px solid #333; text-align: right;">{total_weight} g</td>
    </tr>
    <tr>
      <td style="padding: 10px; border: 1px solid #333;">COD thu hộ:</td>
      <td style="padding: 10px; border: 1px solid #333; text-align: right; font-weight: bold;">{cod}</td>
    </tr>
  </tbody>
</table>

<!-- YÊU CẦU ĐẶC BIỆT -->
<div style="background: #f5f5f5; border: 1px solid #333; padding: 15px; margin-bottom: 20px;">
  <div style="font-weight: bold; margin-bottom: 10px;">YÊU CẦU ĐẶC BIỆT</div>
  <div>{special_request}</div>
</div>

<!-- GHI CHÚ -->
<div style="margin-bottom: 20px; padding: 12px; background: #f5f5f5; border: 1px solid #333;">
  <strong>Ghi chú đóng gói:</strong> {packing_note}
</div>

<!-- TRẠNG THÁI -->
<table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
  <tbody>
    <tr>
      <td style="padding: 8px; width: 25%; background: #f5f5f5; border: 1px solid #333; font-weight: bold;">Trạng thái:</td>
      <td style="padding: 8px; border: 1px solid #333;"><strong>{status}</strong></td>
      <td style="padding: 8px; width: 25%; background: #f5f5f5; border: 1px solid #333; font-weight: bold;">Người được gán:</td>
      <td style="padding: 8px; border: 1px solid #333;">{assigned_employee}</td>
    </tr>
    <tr>
      <td style="padding: 8px; background: #f5f5f5; border: 1px solid #333; font-weight: bold;">Thời hạn:</td>
      <td style="padding: 8px; border: 1px solid #333;" colspan="3"><strong>{deadline}</strong></td>
    </tr>
  </tbody>
</table>

<!-- CHỮ KÝ -->
<table style="width: 100%; margin-top: 30px;">
  <tbody>
    <tr>
      <td style="width: 50%; text-align: center; padding: 10px; vertical-align: top;">
        <div style="font-weight: bold; margin-bottom: 5px;">NGƯỜI ĐÓNG GÓI</div>
        <div style="color: #888; font-size: 12px; font-style: italic;">(Ký, ghi rõ họ tên)</div>
        <div style="height: 50px;"></div>
      </td>
      <td style="width: 50%; text-align: center; padding: 10px; vertical-align: top;">
        <div style="font-weight: bold; margin-bottom: 5px;">KIỂM TRA</div>
        <div style="color: #888; font-size: 12px; font-style: italic;">(Ký, ghi rõ họ tên)</div>
        <div style="height: 50px;"></div>
      </td>
    </tr>
  </tbody>
</table>

<!-- FOOTER -->
<div style="text-align: center; margin-top: 15px; padding-top: 8px; border-top: 1px dashed #333; font-size: 10px; color: #666;">
  In lúc: {print_date} {print_time}
</div>

</div>
`;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/features/settings/printer/templates/attendance.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Attendance Template - Bảng chấm công
 * Mẫu in mặc định cho bảng chấm công
 * 
 * CHUẨN TEMPLATE v3 (2025-12-10):
 * - Dạng DỌC (portrait) - mỗi nhân viên 1 tờ A4
 * - Compact: Chia 2 nửa tháng theo chiều ngang
 * - Font nhỏ gọn, vừa 1 trang
 */ // Template cho BÁO CÁO CÁ NHÂN (mỗi nhân viên 1 trang)
__turbopack_context__.s([
    "ATTENDANCE_SUMMARY_TEMPLATE",
    ()=>ATTENDANCE_SUMMARY_TEMPLATE,
    "ATTENDANCE_TEMPLATE",
    ()=>ATTENDANCE_TEMPLATE
]);
const ATTENDANCE_TEMPLATE = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { 
      font-family: Arial, sans-serif; 
      font-size: 9px; 
      line-height: 1.2;
      padding: 8mm;
    }
    @page { size: A4 portrait; margin: 8mm; }
    .page-break { page-break-after: always; }
    
    .header { 
      display: flex;
      align-items: center;
      margin-bottom: 8px;
      gap: 10px;
    }
    .store-logo {
      max-width: 40px;
      max-height: 40px;
    }
    .store-info-container { flex: 1; }
    .store-name { 
      font-size: 11px; 
      font-weight: bold; 
    }
    .store-info { 
      font-size: 8px; 
      color: #333;
    }
    
    .title { 
      font-size: 13px; 
      font-weight: bold; 
      text-align: center;
      margin: 8px 0 4px 0;
      text-transform: uppercase;
    }
    .subtitle {
      font-size: 11px;
      text-align: center;
      margin-bottom: 8px;
      font-weight: bold;
    }
    
    .employee-info {
      display: flex;
      justify-content: space-between;
      margin-bottom: 8px;
      padding: 6px 10px;
      background: #f0f0f0;
      border-radius: 3px;
      font-size: 9px;
    }
    .info-group { display: flex; gap: 20px; }
    .info-item strong { font-weight: bold; }
    
    .legend {
      margin: 6px 0;
      font-size: 8px;
      color: #666;
    }
    .legend span { margin-right: 10px; }
    
    .tables-container {
      display: flex;
      gap: 8px;
    }
    .half-month {
      flex: 1;
    }
    .half-month h4 {
      font-size: 9px;
      text-align: center;
      margin-bottom: 4px;
      background: #333;
      color: white;
      padding: 3px;
    }
    
    table { 
      width: 100%; 
      border-collapse: collapse; 
      font-size: 8px;
    }
    th, td { 
      border: 1px solid #999; 
      padding: 2px 3px; 
      text-align: center;
    }
    th { 
      background: #e0e0e0; 
      font-weight: bold;
      font-size: 7px;
    }
    .col-day { width: 22px; }
    .col-dow { width: 22px; }
    .col-status { width: 28px; }
    .col-time { width: 38px; font-size: 7px; }
    
    .summary-section {
      margin: 10px 0;
      display: flex;
      gap: 10px;
    }
    .summary-box {
      flex: 1;
      padding: 6px 10px;
      background: #f5f5f5;
      border-radius: 3px;
      border: 1px solid #ddd;
      display: flex;
      justify-content: space-between;
      font-size: 9px;
    }
    .summary-box strong {
      font-size: 11px;
    }
    
    .footer { 
      margin-top: 15px;
      display: flex;
      justify-content: space-between;
    }
    .signature-box {
      width: 30%;
      text-align: center;
    }
    .signature-title {
      font-weight: bold;
      font-size: 9px;
      margin-bottom: 35px;
    }
    .signature-line {
      border-top: 1px dotted #333;
      padding-top: 3px;
      font-size: 8px;
    }
    
    .print-date {
      font-size: 8px;
      color: #666;
      text-align: right;
      margin-top: 10px;
    }
    
    @media print {
      body { padding: 5mm; }
    }
  </style>
</head>
<body>
  {{#line_items}}
  <div class="employee-page">
    <!-- Header -->
    <div class="header">
      <img src="{store_logo}" class="store-logo" onerror="this.style.display='none'">
      <div class="store-info-container">
        <div class="store-name">{store_name}</div>
        <div class="store-info">{store_address} | ĐT: {store_phone_number}</div>
      </div>
    </div>

    <div class="title">BẢNG CHẤM CÔNG CÁ NHÂN</div>
    <div class="subtitle">Tháng {month_year}</div>

    <!-- Thông tin nhân viên -->
    <div class="employee-info">
      <div class="info-group">
        <div class="info-item"><strong>Mã NV:</strong> {employee_code}</div>
        <div class="info-item"><strong>Họ tên:</strong> {employee_name}</div>
      </div>
      <div class="info-group">
        <div class="info-item"><strong>Phòng ban:</strong> {department_name}</div>
      </div>
    </div>

    <!-- Chú thích -->
    <div class="legend">
      <span>✓ Có mặt</span>
      <span>X Vắng</span>
      <span>P Nghỉ phép</span>
      <span>½ Nửa ngày</span>
      <span>L Nghỉ lễ</span>
      <span>- Cuối tuần/Chưa đến</span>
    </div>

    <!-- 2 bảng song song: Nửa đầu + Nửa cuối tháng -->
    <div class="tables-container">
      <!-- Nửa đầu tháng (1-15) -->
      <div class="half-month">
        <h4>Ngày 1 - 15</h4>
        <table>
          <thead>
            <tr>
              <th class="col-day">Ngày</th>
              <th class="col-dow">Thứ</th>
              <th class="col-status">TT</th>
              <th class="col-time">Vào</th>
              <th class="col-time">Ra</th>
            </tr>
          </thead>
          <tbody>
            <tr><td>1</td><td>{dow_1}</td><td>{day_1}</td><td>{checkin_1}</td><td>{checkout_1}</td></tr>
            <tr><td>2</td><td>{dow_2}</td><td>{day_2}</td><td>{checkin_2}</td><td>{checkout_2}</td></tr>
            <tr><td>3</td><td>{dow_3}</td><td>{day_3}</td><td>{checkin_3}</td><td>{checkout_3}</td></tr>
            <tr><td>4</td><td>{dow_4}</td><td>{day_4}</td><td>{checkin_4}</td><td>{checkout_4}</td></tr>
            <tr><td>5</td><td>{dow_5}</td><td>{day_5}</td><td>{checkin_5}</td><td>{checkout_5}</td></tr>
            <tr><td>6</td><td>{dow_6}</td><td>{day_6}</td><td>{checkin_6}</td><td>{checkout_6}</td></tr>
            <tr><td>7</td><td>{dow_7}</td><td>{day_7}</td><td>{checkin_7}</td><td>{checkout_7}</td></tr>
            <tr><td>8</td><td>{dow_8}</td><td>{day_8}</td><td>{checkin_8}</td><td>{checkout_8}</td></tr>
            <tr><td>9</td><td>{dow_9}</td><td>{day_9}</td><td>{checkin_9}</td><td>{checkout_9}</td></tr>
            <tr><td>10</td><td>{dow_10}</td><td>{day_10}</td><td>{checkin_10}</td><td>{checkout_10}</td></tr>
            <tr><td>11</td><td>{dow_11}</td><td>{day_11}</td><td>{checkin_11}</td><td>{checkout_11}</td></tr>
            <tr><td>12</td><td>{dow_12}</td><td>{day_12}</td><td>{checkin_12}</td><td>{checkout_12}</td></tr>
            <tr><td>13</td><td>{dow_13}</td><td>{day_13}</td><td>{checkin_13}</td><td>{checkout_13}</td></tr>
            <tr><td>14</td><td>{dow_14}</td><td>{day_14}</td><td>{checkin_14}</td><td>{checkout_14}</td></tr>
            <tr><td>15</td><td>{dow_15}</td><td>{day_15}</td><td>{checkin_15}</td><td>{checkout_15}</td></tr>
          </tbody>
        </table>
      </div>

      <!-- Nửa cuối tháng (16-31) -->
      <div class="half-month">
        <h4>Ngày 16 - 31</h4>
        <table>
          <thead>
            <tr>
              <th class="col-day">Ngày</th>
              <th class="col-dow">Thứ</th>
              <th class="col-status">TT</th>
              <th class="col-time">Vào</th>
              <th class="col-time">Ra</th>
            </tr>
          </thead>
          <tbody>
            <tr><td>16</td><td>{dow_16}</td><td>{day_16}</td><td>{checkin_16}</td><td>{checkout_16}</td></tr>
            <tr><td>17</td><td>{dow_17}</td><td>{day_17}</td><td>{checkin_17}</td><td>{checkout_17}</td></tr>
            <tr><td>18</td><td>{dow_18}</td><td>{day_18}</td><td>{checkin_18}</td><td>{checkout_18}</td></tr>
            <tr><td>19</td><td>{dow_19}</td><td>{day_19}</td><td>{checkin_19}</td><td>{checkout_19}</td></tr>
            <tr><td>20</td><td>{dow_20}</td><td>{day_20}</td><td>{checkin_20}</td><td>{checkout_20}</td></tr>
            <tr><td>21</td><td>{dow_21}</td><td>{day_21}</td><td>{checkin_21}</td><td>{checkout_21}</td></tr>
            <tr><td>22</td><td>{dow_22}</td><td>{day_22}</td><td>{checkin_22}</td><td>{checkout_22}</td></tr>
            <tr><td>23</td><td>{dow_23}</td><td>{day_23}</td><td>{checkin_23}</td><td>{checkout_23}</td></tr>
            <tr><td>24</td><td>{dow_24}</td><td>{day_24}</td><td>{checkin_24}</td><td>{checkout_24}</td></tr>
            <tr><td>25</td><td>{dow_25}</td><td>{day_25}</td><td>{checkin_25}</td><td>{checkout_25}</td></tr>
            <tr><td>26</td><td>{dow_26}</td><td>{day_26}</td><td>{checkin_26}</td><td>{checkout_26}</td></tr>
            <tr><td>27</td><td>{dow_27}</td><td>{day_27}</td><td>{checkin_27}</td><td>{checkout_27}</td></tr>
            <tr><td>28</td><td>{dow_28}</td><td>{day_28}</td><td>{checkin_28}</td><td>{checkout_28}</td></tr>
            <tr><td>29</td><td>{dow_29}</td><td>{day_29}</td><td>{checkin_29}</td><td>{checkout_29}</td></tr>
            <tr><td>30</td><td>{dow_30}</td><td>{day_30}</td><td>{checkin_30}</td><td>{checkout_30}</td></tr>
            <tr><td>31</td><td>{dow_31}</td><td>{day_31}</td><td>{checkin_31}</td><td>{checkout_31}</td></tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Tổng kết -->
    <div class="summary-section">
      <div class="summary-box"><span>Ngày công:</span> <strong>{work_days}</strong></div>
      <div class="summary-box"><span>Nghỉ phép:</span> <strong>{leave_days}</strong></div>
      <div class="summary-box"><span>Vắng mặt:</span> <strong>{absent_days}</strong></div>
      <div class="summary-box"><span>Đi trễ:</span> <strong>{late_arrivals}</strong></div>
      <div class="summary-box"><span>Về sớm:</span> <strong>{early_departures}</strong></div>
      <div class="summary-box"><span>Giờ làm thêm:</span> <strong>{ot_hours}h</strong></div>
    </div>

    <!-- Chữ ký -->
    <div class="footer">
      <div class="signature-box">
        <div class="signature-title">Nhân viên</div>
        <div class="signature-line">(Ký, ghi rõ họ tên)</div>
      </div>
      <div class="signature-box">
        <div class="signature-title">Trưởng phòng</div>
        <div class="signature-line">(Ký, ghi rõ họ tên)</div>
      </div>
      <div class="signature-box">
        <div class="signature-title">Giám đốc</div>
        <div class="signature-line">(Ký, đóng dấu)</div>
      </div>
    </div>

    <div class="print-date">Ngày in: {print_date}</div>
  </div>
  <div class="page-break"></div>
  {{/line_items}}
</body>
</html>`;
const ATTENDANCE_SUMMARY_TEMPLATE = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { 
      font-family: Arial, sans-serif; 
      font-size: 8px; 
      line-height: 1.2;
      padding: 5mm;
    }
    @page { size: A4 landscape; margin: 5mm; }
    
    .header { 
      display: flex;
      align-items: center;
      margin-bottom: 8px;
      gap: 10px;
    }
    .store-logo {
      max-width: 40px;
      max-height: 40px;
    }
    .store-name { 
      font-size: 11px; 
      font-weight: bold; 
    }
    .store-info { 
      font-size: 8px; 
      color: #333;
    }
    
    .title { 
      font-size: 14px; 
      font-weight: bold; 
      text-align: center;
      margin: 5px 0;
      text-transform: uppercase;
    }
    .subtitle {
      font-size: 10px;
      text-align: center;
      margin-bottom: 8px;
    }
    
    .legend {
      font-size: 7px;
      margin-bottom: 5px;
      color: #666;
    }
    
    table { 
      width: 100%; 
      border-collapse: collapse; 
      font-size: 7px;
    }
    th, td { 
      border: 1px solid #999; 
      padding: 2px; 
      text-align: center;
    }
    th { 
      background: #e0e0e0; 
      font-weight: bold;
    }
    .col-name { 
      text-align: left; 
      padding-left: 3px !important;
      min-width: 80px;
    }
    
    .summary {
      margin-top: 8px;
      font-size: 9px;
    }
    
    .footer { 
      margin-top: 15px;
      display: flex;
      justify-content: space-between;
    }
    .signature-box {
      width: 25%;
      text-align: center;
    }
    .signature-title {
      font-weight: bold;
      font-size: 9px;
      margin-bottom: 30px;
    }
    
    .print-date {
      font-size: 7px;
      color: #666;
      text-align: right;
      margin-top: 8px;
    }
  </style>
</head>
<body>
  <div class="header">
    <img src="{store_logo}" class="store-logo" onerror="this.style.display='none'">
    <div>
      <div class="store-name">{store_name}</div>
      <div class="store-info">{store_address}</div>
    </div>
  </div>

  <div class="title">BẢNG CHẤM CÔNG TỔNG HỢP</div>
  <div class="subtitle">Tháng {month_year} | Phòng ban: {department_name}</div>

  <div class="legend">
    ✓ = Có mặt | X = Vắng | P = Nghỉ phép | ½ = Nửa ngày | L = Nghỉ lễ | - = Cuối tuần
  </div>

  <table>
    <thead>
      <tr>
        <th rowspan="2">STT</th>
        <th rowspan="2">Mã NV</th>
        <th rowspan="2" class="col-name">Họ và tên</th>
        <th colspan="4">Tổng kết</th>
        <th colspan="31">Ngày trong tháng</th>
      </tr>
      <tr>
        <th>Công</th>
        <th>Phép</th>
        <th>Vắng</th>
        <th>OT</th>
        <th>1</th><th>2</th><th>3</th><th>4</th><th>5</th><th>6</th><th>7</th>
        <th>8</th><th>9</th><th>10</th><th>11</th><th>12</th><th>13</th><th>14</th><th>15</th>
        <th>16</th><th>17</th><th>18</th><th>19</th><th>20</th><th>21</th><th>22</th>
        <th>23</th><th>24</th><th>25</th><th>26</th><th>27</th><th>28</th><th>29</th><th>30</th><th>31</th>
      </tr>
    </thead>
    <tbody>
      {{#line_items}}
      <tr>
        <td>{line_index}</td>
        <td>{employee_code}</td>
        <td class="col-name">{employee_name}</td>
        <td>{work_days}</td>
        <td>{leave_days}</td>
        <td>{absent_days}</td>
        <td>{ot_hours}</td>
        <td>{day_1}</td><td>{day_2}</td><td>{day_3}</td><td>{day_4}</td><td>{day_5}</td><td>{day_6}</td><td>{day_7}</td>
        <td>{day_8}</td><td>{day_9}</td><td>{day_10}</td><td>{day_11}</td><td>{day_12}</td><td>{day_13}</td><td>{day_14}</td><td>{day_15}</td>
        <td>{day_16}</td><td>{day_17}</td><td>{day_18}</td><td>{day_19}</td><td>{day_20}</td><td>{day_21}</td><td>{day_22}</td>
        <td>{day_23}</td><td>{day_24}</td><td>{day_25}</td><td>{day_26}</td><td>{day_27}</td><td>{day_28}</td><td>{day_29}</td><td>{day_30}</td><td>{day_31}</td>
      </tr>
      {{/line_items}}
    </tbody>
  </table>

  <div class="summary">
    <strong>Tổng cộng:</strong> {total_employees} nhân viên | 
    {total_work_days} công | {total_leave_days} phép | {total_absent_days} vắng | {total_ot_hours}h OT
  </div>

  <div class="footer">
    <div class="signature-box">
      <div class="signature-title">Người lập</div>
    </div>
    <div class="signature-box">
      <div class="signature-title">Kế toán</div>
    </div>
    <div class="signature-box">
      <div class="signature-title">Trưởng phòng</div>
    </div>
    <div class="signature-box">
      <div class="signature-title">Giám đốc</div>
    </div>
  </div>

  <div class="print-date">Ngày in: {print_date}</div>
</body>
</html>`;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/features/settings/printer/templates/index.ts [app-client] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "DEFAULT_TEMPLATES",
    ()=>DEFAULT_TEMPLATES,
    "EXTENDED_TEMPLATES",
    ()=>EXTENDED_TEMPLATES,
    "getAllTemplateTypes",
    ()=>getAllTemplateTypes,
    "getDefaultTemplate",
    ()=>getDefaultTemplate
]);
// =============================================
// EXPORT ALL DEFAULT TEMPLATES
// =============================================
// MAIN TEMPLATES (16 loại chính)
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$templates$2f$order$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/settings/printer/templates/order.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$templates$2f$quote$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/settings/printer/templates/quote.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$templates$2f$receipt$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/settings/printer/templates/receipt.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$templates$2f$payment$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/settings/printer/templates/payment.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$templates$2f$warranty$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/settings/printer/templates/warranty.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$templates$2f$inventory$2d$check$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/settings/printer/templates/inventory-check.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$templates$2f$stock$2d$transfer$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/settings/printer/templates/stock-transfer.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$templates$2f$sales$2d$return$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/settings/printer/templates/sales-return.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$templates$2f$purchase$2d$order$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/settings/printer/templates/purchase-order.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$templates$2f$packing$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/settings/printer/templates/packing.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$templates$2f$delivery$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/settings/printer/templates/delivery.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$templates$2f$shipping$2d$label$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/settings/printer/templates/shipping-label.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$templates$2f$product$2d$label$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/settings/printer/templates/product-label.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$templates$2f$stock$2d$in$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/settings/printer/templates/stock-in.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$templates$2f$supplier$2d$return$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/settings/printer/templates/supplier-return.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$templates$2f$complaint$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/settings/printer/templates/complaint.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$templates$2f$penalty$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/settings/printer/templates/penalty.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$templates$2f$cost$2d$adjustment$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/settings/printer/templates/cost-adjustment.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$templates$2f$payroll$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/settings/printer/templates/payroll.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$templates$2f$payslip$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/settings/printer/templates/payslip.ts [app-client] (ecmascript)");
// EXTENDED TEMPLATES (8 loại mở rộng - MỚI)
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$templates$2f$supplier$2d$order$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/settings/printer/templates/supplier-order.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$templates$2f$return$2d$order$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/settings/printer/templates/return-order.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$templates$2f$handover$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/settings/printer/templates/handover.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$templates$2f$refund$2d$confirmation$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/settings/printer/templates/refund-confirmation.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$templates$2f$packing$2d$guide$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/settings/printer/templates/packing-guide.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$templates$2f$sales$2d$summary$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/settings/printer/templates/sales-summary.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$templates$2f$warranty$2d$request$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/settings/printer/templates/warranty-request.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$templates$2f$packing$2d$request$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/settings/printer/templates/packing-request.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$templates$2f$attendance$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/settings/printer/templates/attendance.ts [app-client] (ecmascript)");
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
;
;
;
;
;
const DEFAULT_TEMPLATES = {
    'order': __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$templates$2f$order$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ORDER_TEMPLATE"],
    'quote': __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$templates$2f$quote$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["QUOTE_TEMPLATE"],
    'receipt': __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$templates$2f$receipt$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["RECEIPT_TEMPLATE"],
    'payment': __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$templates$2f$payment$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PAYMENT_TEMPLATE"],
    'warranty': __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$templates$2f$warranty$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["WARRANTY_TEMPLATE"],
    'inventory-check': __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$templates$2f$inventory$2d$check$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["INVENTORY_CHECK_TEMPLATE"],
    'stock-transfer': __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$templates$2f$stock$2d$transfer$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["STOCK_TRANSFER_TEMPLATE"],
    'sales-return': __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$templates$2f$sales$2d$return$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SALES_RETURN_TEMPLATE"],
    'purchase-order': __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$templates$2f$purchase$2d$order$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PURCHASE_ORDER_TEMPLATE"],
    'packing': __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$templates$2f$packing$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PACKING_TEMPLATE"],
    'delivery': __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$templates$2f$delivery$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DELIVERY_TEMPLATE"],
    'shipping-label': __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$templates$2f$shipping$2d$label$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SHIPPING_LABEL_TEMPLATE"],
    'product-label': __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$templates$2f$product$2d$label$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PRODUCT_LABEL_TEMPLATE"],
    'stock-in': __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$templates$2f$stock$2d$in$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["STOCK_IN_TEMPLATE"],
    'supplier-return': __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$templates$2f$supplier$2d$return$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SUPPLIER_RETURN_TEMPLATE"],
    'complaint': __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$templates$2f$complaint$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["COMPLAINT_TEMPLATE"],
    'penalty': __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$templates$2f$penalty$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PENALTY_TEMPLATE"],
    'leave': __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$templates$2f$penalty$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PENALTY_TEMPLATE"],
    'cost-adjustment': __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$templates$2f$cost$2d$adjustment$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["COST_ADJUSTMENT_TEMPLATE"],
    'handover': __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$templates$2f$handover$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["HANDOVER_TEMPLATE"],
    'payroll': __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$templates$2f$payroll$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PAYROLL_TEMPLATE"],
    'payslip': __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$templates$2f$payslip$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PAYSLIP_TEMPLATE"],
    'attendance': __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$templates$2f$attendance$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ATTENDANCE_TEMPLATE"]
};
const EXTENDED_TEMPLATES = {
    'supplier-order': __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$templates$2f$supplier$2d$order$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SUPPLIER_ORDER_TEMPLATE"],
    'return-order': __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$templates$2f$return$2d$order$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["RETURN_ORDER_TEMPLATE"],
    'refund-confirmation': __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$templates$2f$refund$2d$confirmation$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["REFUND_CONFIRMATION_TEMPLATE"],
    'packing-guide': __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$templates$2f$packing$2d$guide$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PACKING_GUIDE_TEMPLATE"],
    'sales-summary': __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$templates$2f$sales$2d$summary$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SALES_SUMMARY_TEMPLATE"],
    'warranty-request': __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$templates$2f$warranty$2d$request$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["WARRANTY_REQUEST_TEMPLATE"],
    'packing-request': __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$templates$2f$packing$2d$request$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PACKING_REQUEST_TEMPLATE"]
};
function getDefaultTemplate(type) {
    if (type in DEFAULT_TEMPLATES) {
        return DEFAULT_TEMPLATES[type];
    }
    if (type in EXTENDED_TEMPLATES) {
        return EXTENDED_TEMPLATES[type];
    }
    return '';
}
function getAllTemplateTypes() {
    return [
        ...Object.keys(DEFAULT_TEMPLATES),
        ...Object.keys(EXTENDED_TEMPLATES)
    ];
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/features/settings/printer/default-templates.ts [app-client] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
// Re-export từ templates/index.ts - các template mới đã được tối ưu với inline styles
// Các template này tương thích với TipTap editor và preview
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$templates$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/features/settings/printer/templates/index.ts [app-client] (ecmascript) <locals>");
;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/features/settings/printer/store.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "usePrintTemplateStore",
    ()=>usePrintTemplateStore
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/zustand/esm/react.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$middleware$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/zustand/esm/middleware.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$default$2d$templates$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/features/settings/printer/default-templates.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$templates$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/features/settings/printer/templates/index.ts [app-client] (ecmascript) <locals>");
;
;
;
const getTemplateKey = (type, size, branchId)=>branchId ? `${type}-${size}-${branchId}` : `${type}-${size}`;
const usePrintTemplateStore = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["create"])()((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$middleware$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["persist"])((set, get)=>({
        templates: {},
        defaultSizes: {},
        getTemplate: (type, size, branchId)=>{
            const state = get();
            const key = getTemplateKey(type, size, branchId);
            // Thử tìm template cho branch cụ thể
            const branchTemplate = state.templates[key];
            if (branchTemplate && branchTemplate.content && branchTemplate.content.trim() !== '') {
                // Auto-reset payroll templates nếu phát hiện dùng syntax cũ
                // - {{#line_items}} : Mustache syntax không được hỗ trợ
                // - {line_index} : biến cũ, phải dùng {line_stt}
                if ((type === 'payroll' || type === 'payslip') && (branchTemplate.content.includes('{{#line_items}}') || branchTemplate.content.includes('{line_index}'))) {
                    // Template đang dùng syntax cũ không được hỗ trợ -> reset về mặc định
                    return {
                        id: `template-${key}`,
                        type,
                        name: type === 'payroll' ? 'Bảng lương' : 'Phiếu lương',
                        content: (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$templates$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["getDefaultTemplate"])(type),
                        paperSize: size,
                        isActive: true,
                        updatedAt: new Date().toISOString()
                    };
                }
                return branchTemplate;
            }
            // Nếu không có template cho branch, tìm template chung
            const generalKey = getTemplateKey(type, size);
            const generalTemplate = state.templates[generalKey];
            if (branchId && generalTemplate && generalTemplate.content && generalTemplate.content.trim() !== '') {
                // Auto-reset payroll templates nếu phát hiện dùng syntax cũ
                if ((type === 'payroll' || type === 'payslip') && (generalTemplate.content.includes('{{#line_items}}') || generalTemplate.content.includes('{line_index}'))) {
                    return {
                        id: `template-${key}`,
                        type,
                        name: type === 'payroll' ? 'Bảng lương' : 'Phiếu lương',
                        content: (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$templates$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["getDefaultTemplate"])(type),
                        paperSize: size,
                        isActive: true,
                        updatedAt: new Date().toISOString()
                    };
                }
                return generalTemplate;
            }
            // Return default template if not exists or empty
            // Đây là điểm quan trọng: nếu chưa có template hoặc template trống
            // thì sử dụng mẫu mặc định của hệ thống
            return {
                id: `template-${key}`,
                type,
                name: type === 'order' ? 'Mẫu hóa đơn bán hàng' : 'Mẫu in',
                content: (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$templates$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["getDefaultTemplate"])(type),
                paperSize: size,
                isActive: true,
                updatedAt: new Date().toISOString()
            };
        },
        updateTemplate: (type, size, content, branchId)=>{
            const key = getTemplateKey(type, size, branchId);
            set((state)=>{
                const current = state.templates[key] || {
                    id: `template-${key}`,
                    type,
                    name: 'Mẫu in',
                    content: (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$templates$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["getDefaultTemplate"])(type),
                    paperSize: size,
                    isActive: true,
                    updatedAt: new Date().toISOString()
                };
                return {
                    templates: {
                        ...state.templates,
                        [key]: {
                            ...current,
                            content,
                            updatedAt: new Date().toISOString()
                        }
                    }
                };
            });
        },
        updateTemplateAllBranches: (type, size, content)=>{
            // Lưu template chung (không có branchId) - sẽ áp dụng cho tất cả chi nhánh
            const key = getTemplateKey(type, size);
            set((state)=>{
                // Xóa tất cả template cụ thể của các branch cho type và size này
                const newTemplates = {
                    ...state.templates
                };
                Object.keys(newTemplates).forEach((k)=>{
                    if (k.startsWith(`${type}-${size}-`)) {
                        delete newTemplates[k];
                    }
                });
                return {
                    templates: {
                        ...newTemplates,
                        [key]: {
                            id: `template-${key}`,
                            type,
                            name: 'Mẫu in',
                            content,
                            paperSize: size,
                            isActive: true,
                            updatedAt: new Date().toISOString()
                        }
                    }
                };
            });
        },
        resetTemplate: (type, size, branchId)=>{
            const key = getTemplateKey(type, size, branchId);
            set((state)=>({
                    templates: {
                        ...state.templates,
                        [key]: {
                            id: `template-${key}`,
                            type,
                            name: 'Mẫu mặc định',
                            content: (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$templates$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["getDefaultTemplate"])(type),
                            paperSize: size,
                            isActive: true,
                            updatedAt: new Date().toISOString()
                        }
                    }
                }));
        },
        setDefaultSize: (type, size)=>{
            set((state)=>({
                    defaultSizes: {
                        ...state.defaultSizes,
                        [type]: size
                    }
                }));
        },
        getDefaultSize: (type)=>{
            const state = get();
            return state.defaultSizes[type] || 'A4';
        }
    }), {
    name: 'print-templates-storage'
}));
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
    "hidePhoneMiddle",
    ()=>hidePhoneMiddle,
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
    } catch (_e) {}
    return null;
}
function getStoreLogo(storeInfoLogo) {
    if (storeInfoLogo) return storeInfoLogo;
    try {
        const settings = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$settings$2d$cache$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getGeneralSettingsSync"])();
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
        templateStore,
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
"[project]/features/settings/branches/api/branches-api.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Branches API functions
 * 
 * ⚠️ Direct import: import { fetchBranches } from '@/features/settings/branches/api/branches-api'
 */ __turbopack_context__.s([
    "createBranch",
    ()=>createBranch,
    "deleteBranch",
    ()=>deleteBranch,
    "fetchBranch",
    ()=>fetchBranch,
    "fetchBranches",
    ()=>fetchBranches,
    "setDefaultBranch",
    ()=>setDefaultBranch,
    "updateBranch",
    ()=>updateBranch
]);
const BASE_URL = '/api/branches';
async function fetchBranches(params = {}) {
    const searchParams = new URLSearchParams();
    if (params.page) searchParams.set('page', String(params.page));
    if (params.limit) searchParams.set('limit', String(params.limit));
    if (params.search) searchParams.set('search', params.search);
    if (params.isDefault !== undefined) searchParams.set('isDefault', String(params.isDefault));
    if (params.sortBy) searchParams.set('sortBy', params.sortBy);
    if (params.sortOrder) searchParams.set('sortOrder', params.sortOrder);
    const url = searchParams.toString() ? `${BASE_URL}?${searchParams}` : BASE_URL;
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`Failed to fetch branches: ${response.statusText}`);
    }
    return response.json();
}
async function fetchBranch(systemId) {
    const response = await fetch(`${BASE_URL}/${systemId}`);
    if (!response.ok) {
        throw new Error(`Failed to fetch branch: ${response.statusText}`);
    }
    return response.json();
}
async function createBranch(data) {
    const response = await fetch(BASE_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });
    if (!response.ok) {
        const error = await response.json().catch(()=>({}));
        throw new Error(error.message || 'Failed to create branch');
    }
    return response.json();
}
async function updateBranch(systemId, data) {
    const response = await fetch(`${BASE_URL}/${systemId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });
    if (!response.ok) {
        const error = await response.json().catch(()=>({}));
        throw new Error(error.message || 'Failed to update branch');
    }
    return response.json();
}
async function deleteBranch(systemId) {
    const response = await fetch(`${BASE_URL}/${systemId}`, {
        method: 'DELETE'
    });
    if (!response.ok) {
        throw new Error(`Failed to delete branch: ${response.statusText}`);
    }
}
async function setDefaultBranch(systemId) {
    const response = await fetch(`${BASE_URL}/${systemId}/set-default`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    });
    if (!response.ok) {
        const error = await response.json().catch(()=>({}));
        throw new Error(error.message || 'Failed to set default branch');
    }
    return response.json();
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/features/settings/branches/hooks/use-branches.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "branchKeys",
    ()=>branchKeys,
    "useBranch",
    ()=>useBranch,
    "useBranchMutations",
    ()=>useBranchMutations,
    "useBranches",
    ()=>useBranches,
    "useDefaultBranch",
    ()=>useDefaultBranch
]);
/**
 * useBranches - React Query hooks
 * 
 * ⚠️ Direct import: import { useBranches } from '@/features/settings/branches/hooks/use-branches'
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@tanstack/react-query/build/modern/useQuery.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@tanstack/react-query/build/modern/useMutation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@tanstack/react-query/build/modern/QueryClientProvider.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@tanstack/query-core/build/modern/utils.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$branches$2f$api$2f$branches$2d$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/settings/branches/api/branches-api.ts [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature(), _s2 = __turbopack_context__.k.signature(), _s3 = __turbopack_context__.k.signature();
;
;
const branchKeys = {
    all: [
        'branches'
    ],
    lists: ()=>[
            ...branchKeys.all,
            'list'
        ],
    list: (params)=>[
            ...branchKeys.lists(),
            params
        ],
    details: ()=>[
            ...branchKeys.all,
            'detail'
        ],
    detail: (id)=>[
            ...branchKeys.details(),
            id
        ]
};
function useBranches(params = {}) {
    _s();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"])({
        queryKey: branchKeys.list(params),
        queryFn: {
            "useBranches.useQuery": ()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$branches$2f$api$2f$branches$2d$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["fetchBranches"])(params)
        }["useBranches.useQuery"],
        staleTime: 10 * 60 * 1000,
        gcTime: 60 * 60 * 1000,
        placeholderData: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["keepPreviousData"]
    });
}
_s(useBranches, "4ZpngI1uv+Uo3WQHEZmTQ5FNM+k=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"]
    ];
});
function useBranch(id) {
    _s1();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"])({
        queryKey: branchKeys.detail(id),
        queryFn: {
            "useBranch.useQuery": ()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$branches$2f$api$2f$branches$2d$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["fetchBranch"])(id)
        }["useBranch.useQuery"],
        enabled: !!id,
        staleTime: 10 * 60 * 1000
    });
}
_s1(useBranch, "4ZpngI1uv+Uo3WQHEZmTQ5FNM+k=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"]
    ];
});
function useBranchMutations(options = {}) {
    _s2();
    const queryClient = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQueryClient"])();
    const create = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"])({
        mutationFn: __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$branches$2f$api$2f$branches$2d$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createBranch"],
        onSuccess: {
            "useBranchMutations.useMutation[create]": (data)=>{
                queryClient.invalidateQueries({
                    queryKey: branchKeys.all
                });
                options.onCreateSuccess?.(data);
            }
        }["useBranchMutations.useMutation[create]"],
        onError: options.onError
    });
    const update = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"])({
        mutationFn: {
            "useBranchMutations.useMutation[update]": ({ systemId, data })=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$branches$2f$api$2f$branches$2d$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["updateBranch"])(systemId, data)
        }["useBranchMutations.useMutation[update]"],
        onSuccess: {
            "useBranchMutations.useMutation[update]": (data, variables)=>{
                queryClient.invalidateQueries({
                    queryKey: branchKeys.detail(variables.systemId)
                });
                queryClient.invalidateQueries({
                    queryKey: branchKeys.lists()
                });
                options.onUpdateSuccess?.(data);
            }
        }["useBranchMutations.useMutation[update]"],
        onError: options.onError
    });
    const remove = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"])({
        mutationFn: __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$branches$2f$api$2f$branches$2d$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["deleteBranch"],
        onSuccess: {
            "useBranchMutations.useMutation[remove]": ()=>{
                queryClient.invalidateQueries({
                    queryKey: branchKeys.all
                });
                options.onDeleteSuccess?.();
            }
        }["useBranchMutations.useMutation[remove]"],
        onError: options.onError
    });
    const makeDefault = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"])({
        mutationFn: __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$branches$2f$api$2f$branches$2d$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["setDefaultBranch"],
        onSuccess: {
            "useBranchMutations.useMutation[makeDefault]": (data)=>{
                queryClient.invalidateQueries({
                    queryKey: branchKeys.all
                });
                options.onSetDefaultSuccess?.(data);
            }
        }["useBranchMutations.useMutation[makeDefault]"],
        onError: options.onError
    });
    return {
        create,
        update,
        remove,
        makeDefault
    };
}
_s2(useBranchMutations, "EPwZaexZ+A2MG/Il9d02DBsR3OY=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQueryClient"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"]
    ];
});
function useDefaultBranch() {
    _s3();
    const { data, ...rest } = useBranches({
        isDefault: true,
        limit: 1
    });
    return {
        ...rest,
        data: data?.data?.[0] ?? null
    };
}
_s3(useDefaultBranch, "25wE7MkZyZGCmEQqDULsd6PAQBo=", false, function() {
    return [
        useBranches
    ];
});
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/features/settings/branches/hooks/use-all-branches.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useAllBranches",
    ()=>useAllBranches,
    "useBranchFinder",
    ()=>useBranchFinder,
    "useBranchOptions",
    ()=>useBranchOptions,
    "useDefaultBranch",
    ()=>useDefaultBranch
]);
/**
 * useAllBranches - Convenience hook for components needing all branches as flat array
 * 
 * Use case: Dropdowns, selects that need branch options
 * 
 * ⚠️ For paginated views, use useBranches() instead
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$branches$2f$hooks$2f$use$2d$branches$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/settings/branches/hooks/use-branches.ts [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature(), _s2 = __turbopack_context__.k.signature(), _s3 = __turbopack_context__.k.signature();
;
;
function useAllBranches() {
    _s();
    const query = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$branches$2f$hooks$2f$use$2d$branches$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useBranches"])({
        limit: 100
    });
    return {
        // Cast to Branch[] - API returns string systemId, but we trust the data structure
        data: query.data?.data || [],
        isLoading: query.isLoading,
        isError: query.isError,
        error: query.error
    };
}
_s(useAllBranches, "+PKTE8oUN6qYm8gSxvgSOCPz7xo=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$branches$2f$hooks$2f$use$2d$branches$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useBranches"]
    ];
});
function useBranchOptions() {
    _s1();
    const { data, isLoading } = useAllBranches();
    const options = data.map((b)=>({
            value: b.systemId,
            label: b.name
        }));
    return {
        options,
        isLoading
    };
}
_s1(useBranchOptions, "iJUX8iYMHRFOUTFA2yROVdRBuCs=", false, function() {
    return [
        useAllBranches
    ];
});
function useDefaultBranch() {
    _s2();
    const { data, isLoading } = useAllBranches();
    const defaultBranch = data.find((b)=>b.isDefault) || data[0];
    return {
        defaultBranch,
        isLoading
    };
}
_s2(useDefaultBranch, "iJUX8iYMHRFOUTFA2yROVdRBuCs=", false, function() {
    return [
        useAllBranches
    ];
});
function useBranchFinder() {
    _s3();
    const { data } = useAllBranches();
    const findById = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"]({
        "useBranchFinder.useCallback[findById]": (systemId)=>{
            if (!systemId) return undefined;
            return data.find({
                "useBranchFinder.useCallback[findById]": (b)=>b.systemId === systemId
            }["useBranchFinder.useCallback[findById]"]);
        }
    }["useBranchFinder.useCallback[findById]"], [
        data
    ]);
    return {
        findById
    };
}
_s3(useBranchFinder, "M2po72zMNxGW66rBzp8UHlwb280=", false, function() {
    return [
        useAllBranches
    ];
});
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/print-mappers/cost-adjustment.mapper.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "mapCostAdjustmentLineItems",
    ()=>mapCostAdjustmentLineItems,
    "mapCostAdjustmentToPrintData",
    ()=>mapCostAdjustmentToPrintData
]);
/**
 * Cost Adjustment Mapper - Phiếu điều chỉnh giá vốn
 * Đồng bộ với variables/phieu-dieu-chinh-gia-von.ts
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/print-service.ts [app-client] (ecmascript)");
;
function mapCostAdjustmentToPrintData(adjustment, storeSettings) {
    return {
        ...(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getStoreData"])(storeSettings),
        // === THÔNG TIN CHI NHÁNH ===
        '{location_name}': adjustment.location?.name || storeSettings.name || '',
        '{location_address}': adjustment.location?.address || storeSettings.address || '',
        '{location_province}': adjustment.location?.province || '',
        '{store_province}': storeSettings.province || '',
        // === THÔNG TIN PHIẾU ĐIỀU CHỈNH ===
        '{code}': adjustment.code,
        '{adjustment_code}': adjustment.code,
        '{created_on}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatDate"])(adjustment.createdAt),
        '{created_on_time}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatTime"])(adjustment.createdAt),
        '{modified_on}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatDate"])(adjustment.modifiedAt),
        '{confirmed_on}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatDate"])(adjustment.confirmedDate),
        '{cancelled_on}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatDate"])(adjustment.cancelledDate),
        '{account_name}': adjustment.createdByName || adjustment.createdBy || '',
        '{confirmed_by}': adjustment.confirmedByName || adjustment.confirmedBy || '',
        '{status}': adjustment.status || '',
        '{reason}': adjustment.reason || '',
        // === TỔNG ===
        '{total_items}': adjustment.totalItems?.toString() || '0',
        '{total_difference}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatCurrency"])(adjustment.totalDifference),
        '{total_increase}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatCurrency"])(adjustment.totalIncrease),
        '{total_decrease}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatCurrency"])(adjustment.totalDecrease),
        '{note}': adjustment.note || ''
    };
}
function mapCostAdjustmentLineItems(items) {
    return items.map((item, index)=>({
            '{line_stt}': (index + 1).toString(),
            '{line_variant_code}': item.variantCode || '',
            '{line_product_name}': item.productName,
            '{line_variant_name}': item.variantName || '',
            '{line_variant_barcode}': item.barcode || '',
            '{line_unit}': item.unit || 'Cái',
            '{line_old_price}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatCurrency"])(item.oldPrice),
            '{line_new_price}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatCurrency"])(item.newPrice),
            '{line_difference}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatCurrency"])(item.difference),
            '{line_on_hand}': item.onHand.toString(),
            '{line_total_difference}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatCurrency"])(item.totalDifference),
            '{line_reason}': item.reason || '',
            '{line_brand}': item.brand || '',
            '{line_category}': item.category || '',
            '{line_variant_options}': item.variantOptions || ''
        }));
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/print/cost-adjustment-print-helper.ts [app-client] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

/**
 * Cost Adjustment Print Helper
 * Helpers để chuẩn bị dữ liệu in cho phiếu điều chỉnh giá vốn
 */ __turbopack_context__.s([
    "convertCostAdjustmentForPrint",
    ()=>convertCostAdjustmentForPrint,
    "createStoreSettings",
    ()=>createStoreSettings
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$mappers$2f$cost$2d$adjustment$2e$mapper$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/print-mappers/cost-adjustment.mapper.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/print-service.ts [app-client] (ecmascript)");
;
;
function convertCostAdjustmentForPrint(adjustment, options = {}) {
    const { branch, creator, creatorName } = options;
    // Tính tổng
    const totalItems = adjustment.items.length;
    const totalIncrease = adjustment.items.reduce((sum, item)=>item.adjustmentAmount > 0 ? sum + item.adjustmentAmount : sum, 0);
    const totalDecrease = adjustment.items.reduce((sum, item)=>item.adjustmentAmount < 0 ? sum + Math.abs(item.adjustmentAmount) : sum, 0);
    const totalDifference = adjustment.items.reduce((sum, item)=>sum + item.adjustmentAmount, 0);
    // Map trạng thái sang tiếng Việt
    const statusMap = {
        'draft': 'Nháp',
        'DRAFT': 'Nháp',
        'confirmed': 'Đã xác nhận',
        'CONFIRMED': 'Đã xác nhận',
        'cancelled': 'Đã hủy',
        'CANCELLED': 'Đã hủy'
    };
    return {
        // Thông tin cơ bản
        code: adjustment.id,
        createdAt: adjustment.createdDate ?? new Date(),
        confirmedDate: adjustment.confirmedDate ?? undefined,
        cancelledDate: adjustment.cancelledDate ?? undefined,
        createdBy: adjustment.createdBySystemId ?? undefined,
        createdByName: creator?.fullName ?? creatorName ?? adjustment.createdByName ?? undefined,
        confirmedBy: adjustment.confirmedBySystemId ?? undefined,
        confirmedByName: adjustment.confirmedByName ?? undefined,
        status: statusMap[adjustment.status] || adjustment.status,
        reason: adjustment.reason,
        // Thông tin chi nhánh
        location: branch ? {
            name: branch.name,
            address: branch.address,
            province: branch.province
        } : undefined,
        // Danh sách sản phẩm - App fields: oldCostPrice, newCostPrice
        items: adjustment.items.map((item)=>({
                variantCode: item.productId,
                productName: item.productName,
                unit: 'Cái',
                oldPrice: item.oldCostPrice,
                newPrice: item.newCostPrice,
                difference: item.adjustmentAmount,
                onHand: 0,
                totalDifference: item.adjustmentAmount,
                reason: item.reason || undefined
            })),
        // Tổng
        totalItems,
        totalDifference,
        totalIncrease,
        totalDecrease,
        note: adjustment.note || undefined
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
"[project]/features/settings/store-info/store-info-store.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getDefaultStoreInfo",
    ()=>getDefaultStoreInfo,
    "useStoreInfoStore",
    ()=>useStoreInfoStore
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/zustand/esm/react.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$middleware$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/zustand/esm/middleware.mjs [app-client] (ecmascript)");
;
;
const defaultInfo = {
    companyName: '',
    brandName: '',
    logo: '',
    taxCode: '',
    registrationNumber: '',
    representativeName: '',
    representativeTitle: '',
    hotline: '',
    email: '',
    website: '',
    headquartersAddress: '',
    ward: '',
    district: '',
    province: '',
    note: '',
    bankAccountName: '',
    bankAccountNumber: '',
    bankName: '',
    updatedAt: undefined,
    updatedBySystemId: undefined,
    updatedByName: undefined
};
const useStoreInfoStore = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["create"])()((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$middleware$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["persist"])((set)=>({
        info: {
            ...defaultInfo
        },
        updateInfo: (values, metadata)=>set(()=>({
                    info: {
                        ...values,
                        updatedAt: new Date().toISOString(),
                        updatedBySystemId: metadata?.updatedBySystemId,
                        updatedByName: metadata?.updatedByName
                    }
                })),
        reset: ()=>set(()=>({
                    info: {
                        ...defaultInfo
                    }
                }))
    }), {
    name: 'store-info-settings'
}));
function getDefaultStoreInfo() {
    return {
        ...defaultInfo
    };
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/hooks/use-column-visibility.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__,
    "useColumnLayout",
    ()=>useColumnLayout,
    "useColumnOrder",
    ()=>useColumnOrder,
    "useColumnVisibility",
    ()=>useColumnVisibility,
    "usePinnedColumns",
    ()=>usePinnedColumns
]);
/**
 * Hook để quản lý column visibility
 * Sử dụng database (user preferences) làm source of truth
 * localStorage đã bị remove khỏi codebase
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$contexts$2f$auth$2d$context$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/contexts/auth-context.tsx [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature(), _s2 = __turbopack_context__.k.signature(), _s3 = __turbopack_context__.k.signature();
'use client';
;
;
const API_BASE = '/api/user-preferences';
// Debounce delay for saving preferences (ms)
const SAVE_DEBOUNCE_DELAY = 1000;
function useColumnVisibility(tableName, defaultVisibility = {}) {
    _s();
    const { user } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$contexts$2f$auth$2d$context$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuth"])();
    const [visibility, setVisibility] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(defaultVisibility);
    const [isLoading, setIsLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const saveTimeoutRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const lastSavedRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])('');
    const storageKey = `${tableName}-column-visibility`;
    // Load from database
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "useColumnVisibility.useEffect": ()=>{
            const loadVisibility = {
                "useColumnVisibility.useEffect.loadVisibility": async ()=>{
                    try {
                        if (user?.systemId) {
                            const res = await fetch(`${API_BASE}?userId=${user.systemId}&key=${encodeURIComponent(storageKey)}`);
                            if (res.ok) {
                                const data = await res.json();
                                if (data && data.value) {
                                    setVisibility(data.value);
                                    lastSavedRef.current = JSON.stringify(data.value);
                                }
                            }
                        }
                    } catch (error) {
                        console.error(`Error loading column visibility for ${tableName}:`, error);
                    } finally{
                        setIsLoading(false);
                    }
                }
            }["useColumnVisibility.useEffect.loadVisibility"];
            loadVisibility();
        }
    }["useColumnVisibility.useEffect"], [
        user?.systemId,
        storageKey,
        tableName
    ]);
    // Cleanup timeout on unmount
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "useColumnVisibility.useEffect": ()=>{
            return ({
                "useColumnVisibility.useEffect": ()=>{
                    if (saveTimeoutRef.current) {
                        clearTimeout(saveTimeoutRef.current);
                    }
                }
            })["useColumnVisibility.useEffect"];
        }
    }["useColumnVisibility.useEffect"], []);
    // Update visibility - save to database with debounce
    const updateVisibility = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useColumnVisibility.useCallback[updateVisibility]": (newVisibility)=>{
            setVisibility(newVisibility);
            // Save to database if user logged in (with debounce)
            if (user?.systemId) {
                const newValueStr = JSON.stringify(newVisibility);
                // Skip if value hasn't changed
                if (newValueStr === lastSavedRef.current) {
                    return;
                }
                // Clear existing timeout
                if (saveTimeoutRef.current) {
                    clearTimeout(saveTimeoutRef.current);
                }
                // Debounce save
                saveTimeoutRef.current = setTimeout({
                    "useColumnVisibility.useCallback[updateVisibility]": ()=>{
                        lastSavedRef.current = newValueStr;
                        fetch(API_BASE, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({
                                userId: user.systemId,
                                key: storageKey,
                                value: newVisibility,
                                category: 'ui'
                            })
                        }).catch({
                            "useColumnVisibility.useCallback[updateVisibility]": (error)=>{
                                console.error(`Error saving column visibility for ${tableName}:`, error);
                            }
                        }["useColumnVisibility.useCallback[updateVisibility]"]);
                    }
                }["useColumnVisibility.useCallback[updateVisibility]"], SAVE_DEBOUNCE_DELAY);
            }
        }
    }["useColumnVisibility.useCallback[updateVisibility]"], [
        user?.systemId,
        storageKey,
        tableName
    ]);
    return [
        visibility,
        updateVisibility,
        isLoading
    ];
}
_s(useColumnVisibility, "XRLiX4zGig//zWULiMGmFHYQINE=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$contexts$2f$auth$2d$context$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuth"]
    ];
});
function useColumnOrder(tableName, defaultOrder = []) {
    _s1();
    const { user } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$contexts$2f$auth$2d$context$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuth"])();
    const [order, setOrder] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(defaultOrder);
    const [isLoading, setIsLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const saveTimeoutRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const lastSavedRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])('');
    const storageKey = `${tableName}-column-order`;
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "useColumnOrder.useEffect": ()=>{
            const loadOrder = {
                "useColumnOrder.useEffect.loadOrder": async ()=>{
                    try {
                        if (user?.systemId) {
                            const res = await fetch(`${API_BASE}?userId=${user.systemId}&key=${encodeURIComponent(storageKey)}`);
                            if (res.ok) {
                                const data = await res.json();
                                if (data && data.value) {
                                    setOrder(data.value);
                                    lastSavedRef.current = JSON.stringify(data.value);
                                }
                            }
                        }
                    } catch (error) {
                        console.error(`Error loading column order for ${tableName}:`, error);
                    } finally{
                        setIsLoading(false);
                    }
                }
            }["useColumnOrder.useEffect.loadOrder"];
            loadOrder();
        }
    }["useColumnOrder.useEffect"], [
        user?.systemId,
        storageKey,
        tableName
    ]);
    // Cleanup timeout on unmount
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "useColumnOrder.useEffect": ()=>{
            return ({
                "useColumnOrder.useEffect": ()=>{
                    if (saveTimeoutRef.current) {
                        clearTimeout(saveTimeoutRef.current);
                    }
                }
            })["useColumnOrder.useEffect"];
        }
    }["useColumnOrder.useEffect"], []);
    const updateOrder = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useColumnOrder.useCallback[updateOrder]": (newOrder)=>{
            setOrder(newOrder);
            if (user?.systemId) {
                const newValueStr = JSON.stringify(newOrder);
                // Skip if value hasn't changed
                if (newValueStr === lastSavedRef.current) {
                    return;
                }
                // Clear existing timeout
                if (saveTimeoutRef.current) {
                    clearTimeout(saveTimeoutRef.current);
                }
                // Debounce save
                saveTimeoutRef.current = setTimeout({
                    "useColumnOrder.useCallback[updateOrder]": ()=>{
                        lastSavedRef.current = newValueStr;
                        fetch(API_BASE, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({
                                userId: user.systemId,
                                key: storageKey,
                                value: newOrder,
                                category: 'ui'
                            })
                        }).catch({
                            "useColumnOrder.useCallback[updateOrder]": (error)=>{
                                console.error(`Error saving column order for ${tableName}:`, error);
                            }
                        }["useColumnOrder.useCallback[updateOrder]"]);
                    }
                }["useColumnOrder.useCallback[updateOrder]"], SAVE_DEBOUNCE_DELAY);
            }
        }
    }["useColumnOrder.useCallback[updateOrder]"], [
        user?.systemId,
        storageKey,
        tableName
    ]);
    return [
        order,
        updateOrder,
        isLoading
    ];
}
_s1(useColumnOrder, "37V7XUtZMerSTd1FVdEylUngWzg=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$contexts$2f$auth$2d$context$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuth"]
    ];
});
function usePinnedColumns(tableName, defaultPinned = []) {
    _s2();
    const { user } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$contexts$2f$auth$2d$context$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuth"])();
    const [pinned, setPinned] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(defaultPinned);
    const [isLoading, setIsLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const saveTimeoutRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const lastSavedRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])('');
    const storageKey = `${tableName}-column-pinned`;
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "usePinnedColumns.useEffect": ()=>{
            const loadPinned = {
                "usePinnedColumns.useEffect.loadPinned": async ()=>{
                    try {
                        if (user?.systemId) {
                            const res = await fetch(`${API_BASE}?userId=${user.systemId}&key=${encodeURIComponent(storageKey)}`);
                            if (res.ok) {
                                const data = await res.json();
                                if (data && data.value) {
                                    setPinned(data.value);
                                    lastSavedRef.current = JSON.stringify(data.value);
                                }
                            }
                        }
                    } catch (error) {
                        console.error(`Error loading pinned columns for ${tableName}:`, error);
                    } finally{
                        setIsLoading(false);
                    }
                }
            }["usePinnedColumns.useEffect.loadPinned"];
            loadPinned();
        }
    }["usePinnedColumns.useEffect"], [
        user?.systemId,
        storageKey,
        tableName
    ]);
    // Cleanup timeout on unmount
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "usePinnedColumns.useEffect": ()=>{
            return ({
                "usePinnedColumns.useEffect": ()=>{
                    if (saveTimeoutRef.current) {
                        clearTimeout(saveTimeoutRef.current);
                    }
                }
            })["usePinnedColumns.useEffect"];
        }
    }["usePinnedColumns.useEffect"], []);
    const updatePinned = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "usePinnedColumns.useCallback[updatePinned]": (newPinned)=>{
            setPinned(newPinned);
            if (user?.systemId) {
                const newValueStr = JSON.stringify(newPinned);
                // Skip if value hasn't changed
                if (newValueStr === lastSavedRef.current) {
                    return;
                }
                // Clear existing timeout
                if (saveTimeoutRef.current) {
                    clearTimeout(saveTimeoutRef.current);
                }
                // Debounce save
                saveTimeoutRef.current = setTimeout({
                    "usePinnedColumns.useCallback[updatePinned]": ()=>{
                        lastSavedRef.current = newValueStr;
                        fetch(API_BASE, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({
                                userId: user.systemId,
                                key: storageKey,
                                value: newPinned,
                                category: 'ui'
                            })
                        }).catch({
                            "usePinnedColumns.useCallback[updatePinned]": (error)=>{
                                console.error(`Error saving pinned columns for ${tableName}:`, error);
                            }
                        }["usePinnedColumns.useCallback[updatePinned]"]);
                    }
                }["usePinnedColumns.useCallback[updatePinned]"], SAVE_DEBOUNCE_DELAY);
            }
        }
    }["usePinnedColumns.useCallback[updatePinned]"], [
        user?.systemId,
        storageKey,
        tableName
    ]);
    return [
        pinned,
        updatePinned,
        isLoading
    ];
}
_s2(usePinnedColumns, "KuxpNaPRKqPkD/3xpgA2kiyy/H4=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$contexts$2f$auth$2d$context$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuth"]
    ];
});
const __TURBOPACK__default__export__ = useColumnVisibility;
function useColumnLayout(tableName, defaults = {}) {
    _s3();
    const [visibility, setVisibility, loadingVis] = useColumnVisibility(tableName, defaults.visibility || {});
    const [order, setOrder, loadingOrder] = useColumnOrder(tableName, defaults.order || []);
    const [pinned, setPinned, loadingPinned] = usePinnedColumns(tableName, defaults.pinned || []);
    const isLoading = loadingVis || loadingOrder || loadingPinned;
    const layout = {
        visibility,
        order,
        pinned
    };
    const setters = {
        setVisibility,
        setOrder,
        setPinned
    };
    return [
        layout,
        setters,
        isLoading
    ];
}
_s3(useColumnLayout, "n4QTG1lTsyB1MyxRM3JydgAM+qE=", false, function() {
    return [
        useColumnVisibility,
        useColumnOrder,
        usePinnedColumns
    ];
});
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/features/cost-adjustments/page.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "CostAdjustmentListPage",
    ()=>CostAdjustmentListPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$cost$2d$adjustments$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/cost-adjustments/store.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$cost$2d$adjustments$2f$columns$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/cost-adjustments/columns.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$shared$2f$lib$2f$app$2d$dynamic$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/shared/lib/app-dynamic.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$data$2d$table$2f$responsive$2d$data$2d$table$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/data-table/responsive-data-table.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$data$2d$table$2f$data$2d$table$2d$faceted$2d$filter$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/data-table/data-table-faceted-filter.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$data$2d$table$2f$data$2d$table$2d$column$2d$toggle$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/data-table/data-table-column-toggle.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$contexts$2f$page$2d$header$2d$context$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/contexts/page-header-context.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$router$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/router.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/button.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/plus.js [app-client] (ecmascript) <export default as Plus>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__XCircle$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/circle-x.js [app-client] (ecmascript) <export default as XCircle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2d$big$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/circle-check-big.js [app-client] (ecmascript) <export default as CheckCircle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$printer$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Printer$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/printer.js [app-client] (ecmascript) <export default as Printer>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$spreadsheet$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__FileSpreadsheet$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/file-spreadsheet.js [app-client] (ecmascript) <export default as FileSpreadsheet>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$download$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Download$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/download.js [app-client] (ecmascript) <export default as Download>");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$layout$2f$page$2d$toolbar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/layout/page-toolbar.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$layout$2f$page$2d$filters$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/layout/page-filters.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$use$2d$media$2d$query$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/use-media-query.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/sonner/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$fuse$2e$js$2f$dist$2f$fuse$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/fuse.js/dist/fuse.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$cost$2d$adjustments$2f$cost$2d$adjustment$2d$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/cost-adjustments/cost-adjustment-card.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/date-utils.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$contexts$2f$auth$2d$context$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/contexts/auth-context.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/id-types.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$alert$2d$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/alert-dialog.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$shared$2f$simple$2d$print$2d$options$2d$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/shared/simple-print-options-dialog.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$use$2d$print$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/use-print.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$branches$2f$hooks$2f$use$2d$all$2d$branches$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/settings/branches/hooks/use-all-branches.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2f$cost$2d$adjustment$2d$print$2d$helper$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/lib/print/cost-adjustment-print-helper.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$mappers$2f$cost$2d$adjustment$2e$mapper$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/print-mappers/cost-adjustment.mapper.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$store$2d$info$2f$store$2d$info$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/settings/store-info/store-info-store.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$use$2d$column$2d$visibility$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/hooks/use-column-visibility.ts [app-client] (ecmascript)");
;
;
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
;
;
;
;
;
;
// ✅ Dynamic imports for Import/Export dialogs - lazy loads XLSX library (~500KB) + config
const CostAdjustmentImportDialog = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$shared$2f$lib$2f$app$2d$dynamic$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])(()=>__turbopack_context__.A("[project]/features/cost-adjustments/components/cost-adjustments-import-export-dialogs.tsx [app-client] (ecmascript, next/dynamic entry, async loader)").then((mod)=>({
            default: mod.CostAdjustmentImportDialog
        })), {
    loadableGenerated: {
        modules: [
            "[project]/features/cost-adjustments/components/cost-adjustments-import-export-dialogs.tsx [app-client] (ecmascript, next/dynamic entry)"
        ]
    },
    ssr: false
});
_c = CostAdjustmentImportDialog;
const CostAdjustmentExportDialog = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$shared$2f$lib$2f$app$2d$dynamic$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])(()=>__turbopack_context__.A("[project]/features/cost-adjustments/components/cost-adjustments-import-export-dialogs.tsx [app-client] (ecmascript, next/dynamic entry, async loader)").then((mod)=>({
            default: mod.CostAdjustmentExportDialog
        })), {
    loadableGenerated: {
        modules: [
            "[project]/features/cost-adjustments/components/cost-adjustments-import-export-dialogs.tsx [app-client] (ecmascript, next/dynamic entry)"
        ]
    },
    ssr: false
});
_c1 = CostAdjustmentExportDialog;
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
function CostAdjustmentListPage() {
    _s();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const { data: adjustments, cancel, confirm } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$cost$2d$adjustments$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCostAdjustmentStore"])();
    const { employee } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$contexts$2f$auth$2d$context$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuth"])();
    const isMobile = !(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$use$2d$media$2d$query$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMediaQuery"])("(min-width: 768px)");
    // Print
    const { print, printMultiple } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$use$2d$print$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePrint"])();
    const { data: branches } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$branches$2f$hooks$2f$use$2d$all$2d$branches$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAllBranches"])();
    const { findById: getBranchById } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$branches$2f$hooks$2f$use$2d$all$2d$branches$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useBranchFinder"])();
    const { info: storeInfo } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$store$2d$info$2f$store$2d$info$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useStoreInfoStore"])();
    const [printDialogOpen, setPrintDialogOpen] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"](false);
    const [itemsToPrint, setItemsToPrint] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"]([]);
    // Single print handler (for dropdown action)
    const handleSinglePrint = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"]({
        "CostAdjustmentListPage.useCallback[handleSinglePrint]": (adjustment)=>{
            const storeSettings = {
                name: storeInfo?.companyName || storeInfo?.brandName || '',
                address: storeInfo?.headquartersAddress || '',
                phone: storeInfo?.hotline || '',
                email: storeInfo?.email || '',
                website: storeInfo?.website,
                taxCode: storeInfo?.taxCode,
                province: storeInfo?.province,
                logo: storeInfo?.logo
            };
            const printData = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2f$cost$2d$adjustment$2d$print$2d$helper$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["convertCostAdjustmentForPrint"])(adjustment, {
                creatorName: adjustment.createdByName ?? undefined
            });
            print('cost-adjustment', {
                data: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$mappers$2f$cost$2d$adjustment$2e$mapper$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["mapCostAdjustmentToPrintData"])(printData, storeSettings),
                lineItems: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$mappers$2f$cost$2d$adjustment$2e$mapper$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["mapCostAdjustmentLineItems"])(printData.items)
            });
        }
    }["CostAdjustmentListPage.useCallback[handleSinglePrint]"], [
        storeInfo,
        print
    ]);
    // Columns memoized with callbacks
    const columns = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"]({
        "CostAdjustmentListPage.useMemo[columns]": ()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$cost$2d$adjustments$2f$columns$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getColumns"])(router.push, handleSinglePrint)
    }["CostAdjustmentListPage.useMemo[columns]"], [
        router,
        handleSinglePrint
    ]);
    // Confirm dialog state
    const [confirmDialogState, setConfirmDialogState] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"](null);
    const [isConfirmLoading, setIsConfirmLoading] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"](false);
    // Table state
    const [rowSelection, setRowSelection] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"]({});
    const [sorting, setSorting] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"]({
        id: 'createdAt',
        desc: true
    });
    const [globalFilter, setGlobalFilter] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"]('');
    const [debouncedGlobalFilter, setDebouncedGlobalFilter] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"]('');
    const [pagination, setPagination] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"]({
        pageIndex: 0,
        pageSize: 40
    });
    const [expanded, setExpanded] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"]({});
    // Filters
    const [statusFilter, setStatusFilter] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"](new Set());
    const [dateFilter, _setDateFilter] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"]();
    // Import/Export dialogs
    const [showImportDialog, setShowImportDialog] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"](false);
    const [showExportDialog, setShowExportDialog] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"](false);
    // Column customization state - using React Query hook
    const [{ visibility: columnVisibility, order: columnOrder, pinned: pinnedColumns }, { setVisibility: setColumnVisibility, setOrder: setColumnOrder, setPinned: setPinnedColumns }] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$use$2d$column$2d$visibility$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useColumnLayout"])('cost-adjustments', {});
    // Debounce search
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"]({
        "CostAdjustmentListPage.useEffect": ()=>{
            const timer = setTimeout({
                "CostAdjustmentListPage.useEffect.timer": ()=>{
                    setDebouncedGlobalFilter(globalFilter);
                }
            }["CostAdjustmentListPage.useEffect.timer"], 300);
            return ({
                "CostAdjustmentListPage.useEffect": ()=>clearTimeout(timer)
            })["CostAdjustmentListPage.useEffect"];
        }
    }["CostAdjustmentListPage.useEffect"], [
        globalFilter
    ]);
    // Page header
    const headerActions = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"]({
        "CostAdjustmentListPage.useMemo[headerActions]": ()=>[
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                    className: "h-9",
                    onClick: {
                        "CostAdjustmentListPage.useMemo[headerActions]": ()=>router.push('/cost-adjustments/new')
                    }["CostAdjustmentListPage.useMemo[headerActions]"],
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__["Plus"], {
                            className: "mr-2 h-4 w-4"
                        }, void 0, false, {
                            fileName: "[project]/features/cost-adjustments/page.tsx",
                            lineNumber: 133,
                            columnNumber: 7
                        }, this),
                        "Tạo phiếu điều chỉnh"
                    ]
                }, "add", true, {
                    fileName: "[project]/features/cost-adjustments/page.tsx",
                    lineNumber: 132,
                    columnNumber: 5
                }, this)
            ]
    }["CostAdjustmentListPage.useMemo[headerActions]"], [
        router
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$contexts$2f$page$2d$header$2d$context$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePageHeader"])({
        title: 'Danh sách điều chỉnh giá vốn',
        breadcrumb: [
            {
                label: 'Trang chủ',
                href: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$router$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ROUTES"].ROOT,
                isCurrent: false
            },
            {
                label: 'Điều chỉnh giá vốn',
                href: '/cost-adjustments',
                isCurrent: true
            }
        ],
        actions: headerActions,
        showBackButton: false
    });
    // Column defaults
    const buildDefaultVisibility = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"]({
        "CostAdjustmentListPage.useCallback[buildDefaultVisibility]": ()=>{
            const defaultVisibleColumns = new Set([
                'id',
                'referenceCode',
                'createdDate',
                'status',
                'itemCount',
                'totalOldValue',
                'totalNewValue',
                'difference',
                'createdByName',
                'reason'
            ]);
            const initialVisibility = {};
            columns.forEach({
                "CostAdjustmentListPage.useCallback[buildDefaultVisibility]": (c)=>{
                    if (!c.id) return;
                    if (c.id === 'select' || c.id === 'actions') {
                        initialVisibility[c.id] = true;
                        return;
                    }
                    initialVisibility[c.id] = defaultVisibleColumns.has(c.id);
                }
            }["CostAdjustmentListPage.useCallback[buildDefaultVisibility]"]);
            return initialVisibility;
        }
    }["CostAdjustmentListPage.useCallback[buildDefaultVisibility]"], [
        columns
    ]);
    const buildDefaultOrder = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"]({
        "CostAdjustmentListPage.useCallback[buildDefaultOrder]": ()=>columns.map({
                "CostAdjustmentListPage.useCallback[buildDefaultOrder]": (c)=>c.id
            }["CostAdjustmentListPage.useCallback[buildDefaultOrder]"]).filter(Boolean)
    }["CostAdjustmentListPage.useCallback[buildDefaultOrder]"], [
        columns
    ]);
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"]({
        "CostAdjustmentListPage.useEffect": ()=>{
            if (columns.length === 0) return;
            // Only set defaults if not already set
            if (Object.keys(columnVisibility).length === 0) {
                setColumnVisibility(buildDefaultVisibility());
            }
            if (columnOrder.length === 0) {
                setColumnOrder(buildDefaultOrder());
            }
        // pinnedColumns is always initialized by useColumnLayout, no need to set here
        }
    }["CostAdjustmentListPage.useEffect"], [
        columns,
        buildDefaultOrder,
        buildDefaultVisibility,
        columnVisibility,
        columnOrder,
        setColumnVisibility,
        setColumnOrder
    ]);
    const resetColumnLayout = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"]({
        "CostAdjustmentListPage.useCallback[resetColumnLayout]": ()=>{
            setColumnVisibility(buildDefaultVisibility());
            setColumnOrder(buildDefaultOrder());
            setPinnedColumns([]);
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].success('Đã khôi phục bố cục cột mặc định');
        }
    }["CostAdjustmentListPage.useCallback[resetColumnLayout]"], [
        buildDefaultVisibility,
        buildDefaultOrder,
        setColumnVisibility,
        setColumnOrder,
        setPinnedColumns
    ]);
    // Fuse search
    const fuseInstance = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"]({
        "CostAdjustmentListPage.useMemo[fuseInstance]": ()=>{
            return new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$fuse$2e$js$2f$dist$2f$fuse$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"](adjustments, {
                keys: [
                    'id',
                    'createdByName',
                    'reason',
                    'referenceCode'
                ],
                threshold: 0.3,
                ignoreLocation: true
            });
        }
    }["CostAdjustmentListPage.useMemo[fuseInstance]"], [
        adjustments
    ]);
    // Filter data
    const filteredData = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"]({
        "CostAdjustmentListPage.useMemo[filteredData]": ()=>{
            let filtered = [
                ...adjustments
            ];
            // Status filter
            if (statusFilter.size > 0) {
                filtered = filtered.filter({
                    "CostAdjustmentListPage.useMemo[filteredData]": (a)=>statusFilter.has(a.status)
                }["CostAdjustmentListPage.useMemo[filteredData]"]);
            }
            // Search filter
            if (debouncedGlobalFilter.trim()) {
                fuseInstance.setCollection(filtered);
                filtered = fuseInstance.search(debouncedGlobalFilter.trim()).map({
                    "CostAdjustmentListPage.useMemo[filteredData]": (r)=>r.item
                }["CostAdjustmentListPage.useMemo[filteredData]"]);
            }
            // Date filter
            if (dateFilter && (dateFilter[0] || dateFilter[1])) {
                const [start, end] = dateFilter;
                const startDate = start ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getStartOfDay"])(start) : null;
                const endDate = end ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getEndOfDay"])(end) : null;
                filtered = filtered.filter({
                    "CostAdjustmentListPage.useMemo[filteredData]": (a)=>{
                        if (!a.createdDate) return false;
                        const rowDate = new Date(a.createdDate);
                        if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isValidDate"])(rowDate)) return false;
                        if (startDate && !endDate) return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isDateAfter"])(rowDate, startDate) || (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isDateSame"])(rowDate, startDate);
                        if (!startDate && endDate) return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isDateBefore"])(rowDate, endDate) || (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isDateSame"])(rowDate, endDate);
                        if (startDate && endDate) return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isDateBetween"])(rowDate, startDate, endDate);
                        return true;
                    }
                }["CostAdjustmentListPage.useMemo[filteredData]"]);
            }
            return filtered;
        }
    }["CostAdjustmentListPage.useMemo[filteredData]"], [
        adjustments,
        statusFilter,
        debouncedGlobalFilter,
        dateFilter,
        fuseInstance
    ]);
    // Reset pagination on filter change
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"]({
        "CostAdjustmentListPage.useEffect": ()=>{
            setPagination({
                "CostAdjustmentListPage.useEffect": (p)=>({
                        ...p,
                        pageIndex: 0
                    })
            }["CostAdjustmentListPage.useEffect"]);
        }
    }["CostAdjustmentListPage.useEffect"], [
        debouncedGlobalFilter,
        statusFilter,
        dateFilter
    ]);
    // Sorting
    const sortedData = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"]({
        "CostAdjustmentListPage.useMemo[sortedData]": ()=>{
            const sorted = [
                ...filteredData
            ];
            if (sorting.id) {
                sorted.sort({
                    "CostAdjustmentListPage.useMemo[sortedData]": (a, b)=>{
                        const aValue = a[sorting.id];
                        const bValue = b[sorting.id];
                        if (aValue === null || aValue === undefined) return 1;
                        if (bValue === null || bValue === undefined) return -1;
                        // Special handling for date columns
                        if (sorting.id === 'createdAt' || sorting.id === 'createdDate') {
                            const aTime = aValue ? new Date(aValue).getTime() : 0;
                            const bTime = bValue ? new Date(bValue).getTime() : 0;
                            return sorting.desc ? bTime - aTime : aTime - bTime;
                        }
                        if (aValue < bValue) return sorting.desc ? 1 : -1;
                        if (aValue > bValue) return sorting.desc ? -1 : 1;
                        return 0;
                    }
                }["CostAdjustmentListPage.useMemo[sortedData]"]);
            }
            return sorted;
        }
    }["CostAdjustmentListPage.useMemo[sortedData]"], [
        filteredData,
        sorting
    ]);
    // Pagination
    const pageCount = Math.ceil(sortedData.length / pagination.pageSize);
    const paginatedData = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"]({
        "CostAdjustmentListPage.useMemo[paginatedData]": ()=>{
            const start = pagination.pageIndex * pagination.pageSize;
            const end = start + pagination.pageSize;
            return sortedData.slice(start, end);
        }
    }["CostAdjustmentListPage.useMemo[paginatedData]"], [
        sortedData,
        pagination
    ]);
    // Selection
    const allSelectedRows = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"]({
        "CostAdjustmentListPage.useMemo[allSelectedRows]": ()=>adjustments.filter({
                "CostAdjustmentListPage.useMemo[allSelectedRows]": (a)=>rowSelection[a.systemId]
            }["CostAdjustmentListPage.useMemo[allSelectedRows]"])
    }["CostAdjustmentListPage.useMemo[allSelectedRows]"], [
        adjustments,
        rowSelection
    ]);
    // Selected adjustments for export
    const selectedAdjustments = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"]({
        "CostAdjustmentListPage.useMemo[selectedAdjustments]": ()=>{
            return adjustments.filter({
                "CostAdjustmentListPage.useMemo[selectedAdjustments]": (a)=>rowSelection[a.systemId]
            }["CostAdjustmentListPage.useMemo[selectedAdjustments]"]);
        }
    }["CostAdjustmentListPage.useMemo[selectedAdjustments]"], [
        adjustments,
        rowSelection
    ]);
    // Import handler - CostAdjustment requires special handling via create() method
    const handleImport = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"]({
        "CostAdjustmentListPage.useCallback[handleImport]": async (importedAdjustments, mode, _branchId)=>{
            let addedCount = 0;
            let skippedCount = 0;
            const errors = [];
            const storeState = __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$cost$2d$adjustments$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCostAdjustmentStore"].getState();
            const creatorSystemId = employee?.systemId || (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])('SYSTEM');
            const creatorName = employee?.fullName || 'Hệ thống';
            importedAdjustments.forEach({
                "CostAdjustmentListPage.useCallback[handleImport]": (adjustment, index)=>{
                    try {
                        // Check if exists by business ID
                        const existing = storeState.getByBusinessId(adjustment.id?.toString() || '');
                        if (existing) {
                            // CostAdjustment doesn't support update via import
                            skippedCount++;
                        } else {
                            if (mode === 'insert-only' || mode === 'upsert') {
                                // Create new adjustment using store's create method
                                if (adjustment.items && adjustment.items.length > 0) {
                                    storeState.create(adjustment.items.map({
                                        "CostAdjustmentListPage.useCallback[handleImport]": (item)=>({
                                                productSystemId: item.productSystemId,
                                                productId: item.productId,
                                                productName: item.productName,
                                                productImage: item.productImage,
                                                oldCostPrice: item.oldCostPrice,
                                                newCostPrice: item.newCostPrice,
                                                reason: item.reason
                                            })
                                    }["CostAdjustmentListPage.useCallback[handleImport]"]), adjustment.type || 'manual', creatorSystemId, creatorName, {
                                        customId: adjustment.id?.toString(),
                                        note: adjustment.note,
                                        reason: adjustment.reason,
                                        referenceCode: adjustment.referenceCode,
                                        status: adjustment.status || 'draft'
                                    });
                                    addedCount++;
                                } else {
                                    errors.push({
                                        row: index + 1,
                                        message: 'Phiếu điều chỉnh cần có ít nhất 1 sản phẩm'
                                    });
                                }
                            } else {
                                skippedCount++;
                            }
                        }
                    } catch (error) {
                        errors.push({
                            row: index + 1,
                            message: error.message
                        });
                    }
                }
            }["CostAdjustmentListPage.useCallback[handleImport]"]);
            if (addedCount > 0) {
                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].success(`Đã import: ${addedCount} phiếu điều chỉnh mới`);
            }
            return {
                success: addedCount,
                failed: errors.length,
                inserted: addedCount,
                updated: 0,
                skipped: skippedCount,
                errors
            };
        }
    }["CostAdjustmentListPage.useCallback[handleImport]"], [
        employee
    ]);
    // Bulk cancel handler
    const handleBulkCancel = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"]({
        "CostAdjustmentListPage.useCallback[handleBulkCancel]": ()=>{
            if (allSelectedRows.length === 0) return;
            const draftItems = allSelectedRows.filter({
                "CostAdjustmentListPage.useCallback[handleBulkCancel].draftItems": (item)=>item.status === 'draft'
            }["CostAdjustmentListPage.useCallback[handleBulkCancel].draftItems"]);
            if (draftItems.length === 0) {
                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].info('Không có phiếu nào có thể hủy', {
                    description: 'Chỉ có thể hủy các phiếu đang ở trạng thái Nháp'
                });
                return;
            }
            setConfirmDialogState({
                type: 'bulk-cancel',
                items: draftItems
            });
        }
    }["CostAdjustmentListPage.useCallback[handleBulkCancel]"], [
        allSelectedRows
    ]);
    // Bulk confirm handler
    const handleBulkConfirm = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"]({
        "CostAdjustmentListPage.useCallback[handleBulkConfirm]": ()=>{
            if (allSelectedRows.length === 0) return;
            const draftItems = allSelectedRows.filter({
                "CostAdjustmentListPage.useCallback[handleBulkConfirm].draftItems": (item)=>item.status === 'draft'
            }["CostAdjustmentListPage.useCallback[handleBulkConfirm].draftItems"]);
            if (draftItems.length === 0) {
                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].info('Không có phiếu nào có thể xác nhận', {
                    description: 'Chỉ có thể xác nhận các phiếu đang ở trạng thái Nháp'
                });
                return;
            }
            setConfirmDialogState({
                type: 'bulk-confirm',
                items: draftItems
            });
        }
    }["CostAdjustmentListPage.useCallback[handleBulkConfirm]"], [
        allSelectedRows
    ]);
    // Handle confirm action
    const handleConfirmDialogAction = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"]({
        "CostAdjustmentListPage.useCallback[handleConfirmDialogAction]": async ()=>{
            if (!confirmDialogState || !employee) return;
            setIsConfirmLoading(true);
            try {
                const userSystemId = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])(employee.systemId);
                const userName = employee.fullName || 'Người dùng';
                if (confirmDialogState.type === 'bulk-cancel') {
                    let successCount = 0;
                    confirmDialogState.items.forEach({
                        "CostAdjustmentListPage.useCallback[handleConfirmDialogAction]": (item)=>{
                            if (cancel((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])(item.systemId), userSystemId, userName, 'Hủy hàng loạt')) {
                                successCount++;
                            }
                        }
                    }["CostAdjustmentListPage.useCallback[handleConfirmDialogAction]"]);
                    if (successCount > 0) {
                        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].success(`Đã hủy ${successCount} phiếu điều chỉnh`);
                    }
                }
                if (confirmDialogState.type === 'bulk-confirm') {
                    let successCount = 0;
                    confirmDialogState.items.forEach({
                        "CostAdjustmentListPage.useCallback[handleConfirmDialogAction]": (item)=>{
                            if (confirm((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])(item.systemId), userSystemId, userName)) {
                                successCount++;
                            }
                        }
                    }["CostAdjustmentListPage.useCallback[handleConfirmDialogAction]"]);
                    if (successCount > 0) {
                        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].success(`Đã xác nhận ${successCount} phiếu điều chỉnh`);
                    }
                }
                setRowSelection({});
            } catch (_error) {
                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error('Không thể hoàn tất hành động');
            } finally{
                setIsConfirmLoading(false);
                setConfirmDialogState(null);
            }
        }
    }["CostAdjustmentListPage.useCallback[handleConfirmDialogAction]"], [
        confirmDialogState,
        employee,
        cancel,
        confirm
    ]);
    // Bulk print handler
    const handleBulkPrint = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"]({
        "CostAdjustmentListPage.useCallback[handleBulkPrint]": ()=>{
            if (allSelectedRows.length === 0) return;
            setItemsToPrint(allSelectedRows);
            setPrintDialogOpen(true);
        }
    }["CostAdjustmentListPage.useCallback[handleBulkPrint]"], [
        allSelectedRows
    ]);
    // Handle print confirm
    const handlePrintConfirm = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"]({
        "CostAdjustmentListPage.useCallback[handlePrintConfirm]": (result)=>{
            if (itemsToPrint.length === 0) return;
            const branch = result.branchSystemId ? getBranchById(result.branchSystemId) : null;
            const storeSettings = {
                name: storeInfo?.companyName || storeInfo?.brandName || '',
                address: storeInfo?.headquartersAddress || '',
                phone: storeInfo?.hotline || '',
                email: storeInfo?.email || '',
                website: storeInfo?.website,
                taxCode: storeInfo?.taxCode,
                province: storeInfo?.province,
                logo: storeInfo?.logo
            };
            const printOptionsList = itemsToPrint.map({
                "CostAdjustmentListPage.useCallback[handlePrintConfirm].printOptionsList": (adjustment)=>{
                    const printData = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2f$cost$2d$adjustment$2d$print$2d$helper$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["convertCostAdjustmentForPrint"])(adjustment, {
                        branch,
                        creatorName: adjustment.createdByName ?? undefined
                    });
                    return {
                        data: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$mappers$2f$cost$2d$adjustment$2e$mapper$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["mapCostAdjustmentToPrintData"])(printData, storeSettings),
                        lineItems: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$mappers$2f$cost$2d$adjustment$2e$mapper$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["mapCostAdjustmentLineItems"])(printData.items),
                        paperSize: result.paperSize
                    };
                }
            }["CostAdjustmentListPage.useCallback[handlePrintConfirm].printOptionsList"]);
            printMultiple('cost-adjustment', printOptionsList);
            setPrintDialogOpen(false);
            setItemsToPrint([]);
            setRowSelection({});
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].success(`Đang in ${itemsToPrint.length} phiếu điều chỉnh giá vốn`);
        }
    }["CostAdjustmentListPage.useCallback[handlePrintConfirm]"], [
        itemsToPrint,
        getBranchById,
        storeInfo,
        printMultiple
    ]);
    // Bulk actions
    const bulkActions = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"]({
        "CostAdjustmentListPage.useMemo[bulkActions]": ()=>[
                {
                    label: 'In phiếu',
                    icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$printer$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Printer$3e$__["Printer"],
                    onSelect: handleBulkPrint
                },
                {
                    label: 'Xác nhận',
                    icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2d$big$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle$3e$__["CheckCircle"],
                    onSelect: handleBulkConfirm
                },
                {
                    label: 'Hủy phiếu',
                    icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__XCircle$3e$__["XCircle"],
                    onSelect: handleBulkCancel,
                    variant: 'destructive'
                }
            ]
    }["CostAdjustmentListPage.useMemo[bulkActions]"], [
        handleBulkPrint,
        handleBulkConfirm,
        handleBulkCancel
    ]);
    // Confirm dialog copy
    const confirmDialogCopy = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"]({
        "CostAdjustmentListPage.useMemo[confirmDialogCopy]": ()=>{
            if (!confirmDialogState) return null;
            if (confirmDialogState.type === 'bulk-cancel') {
                return {
                    title: 'Hủy nhiều phiếu điều chỉnh',
                    description: `Bạn sắp hủy ${confirmDialogState.items.length} phiếu điều chỉnh giá vốn. Chỉ các phiếu đang ở trạng thái Nháp mới được hủy.`,
                    confirmLabel: `Hủy ${confirmDialogState.items.length} phiếu`
                };
            }
            if (confirmDialogState.type === 'bulk-confirm') {
                return {
                    title: 'Xác nhận nhiều phiếu điều chỉnh',
                    description: `Bạn sắp xác nhận ${confirmDialogState.items.length} phiếu điều chỉnh giá vốn. Sau khi xác nhận, giá vốn sản phẩm sẽ được cập nhật.`,
                    confirmLabel: `Xác nhận ${confirmDialogState.items.length} phiếu`
                };
            }
            return null;
        }
    }["CostAdjustmentListPage.useMemo[confirmDialogCopy]"], [
        confirmDialogState
    ]);
    // Filter options
    const statusOptions = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"]({
        "CostAdjustmentListPage.useMemo[statusOptions]": ()=>[
                {
                    value: 'draft',
                    label: 'Nháp'
                },
                {
                    value: 'confirmed',
                    label: 'Đã xác nhận'
                },
                {
                    value: 'cancelled',
                    label: 'Đã hủy'
                }
            ]
    }["CostAdjustmentListPage.useMemo[statusOptions]"], []);
    // Export config
    const _exportConfig = {
        fileName: 'Danh_sach_dieu_chinh_gia_von',
        columns
    };
    // Row click handler
    const handleRowClick = (row)=>{
        router.push(`/cost-adjustments/${row.systemId}`);
    };
    // Actions for mobile card - navigate to detail page for confirm/cancel
    const handleConfirm = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"]({
        "CostAdjustmentListPage.useCallback[handleConfirm]": (systemId)=>{
            router.push(`/cost-adjustments/${systemId}`);
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].info('Mở trang chi tiết để xác nhận phiếu');
        }
    }["CostAdjustmentListPage.useCallback[handleConfirm]"], [
        router
    ]);
    const handleCancel = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"]({
        "CostAdjustmentListPage.useCallback[handleCancel]": (systemId)=>{
            router.push(`/cost-adjustments/${systemId}`);
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].info('Mở trang chi tiết để hủy phiếu');
        }
    }["CostAdjustmentListPage.useCallback[handleCancel]"], [
        router
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex flex-col w-full h-full",
        children: [
            !isMobile && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$layout$2f$page$2d$toolbar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PageToolbar"], {
                leftActions: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                            variant: "outline",
                            size: "sm",
                            onClick: ()=>setShowImportDialog(true),
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$spreadsheet$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__FileSpreadsheet$3e$__["FileSpreadsheet"], {
                                    className: "mr-2 h-4 w-4"
                                }, void 0, false, {
                                    fileName: "[project]/features/cost-adjustments/page.tsx",
                                    lineNumber: 546,
                                    columnNumber: 17
                                }, void 0),
                                "Nhập file"
                            ]
                        }, void 0, true, {
                            fileName: "[project]/features/cost-adjustments/page.tsx",
                            lineNumber: 545,
                            columnNumber: 15
                        }, void 0),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                            variant: "outline",
                            size: "sm",
                            onClick: ()=>setShowExportDialog(true),
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$download$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Download$3e$__["Download"], {
                                    className: "mr-2 h-4 w-4"
                                }, void 0, false, {
                                    fileName: "[project]/features/cost-adjustments/page.tsx",
                                    lineNumber: 550,
                                    columnNumber: 17
                                }, void 0),
                                "Xuất Excel"
                            ]
                        }, void 0, true, {
                            fileName: "[project]/features/cost-adjustments/page.tsx",
                            lineNumber: 549,
                            columnNumber: 15
                        }, void 0)
                    ]
                }, void 0, true),
                rightActions: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$data$2d$table$2f$data$2d$table$2d$column$2d$toggle$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DataTableColumnCustomizer"], {
                    columns: columns,
                    columnVisibility: columnVisibility,
                    setColumnVisibility: setColumnVisibility,
                    columnOrder: columnOrder,
                    setColumnOrder: setColumnOrder,
                    pinnedColumns: pinnedColumns,
                    setPinnedColumns: setPinnedColumns,
                    onResetToDefault: resetColumnLayout
                }, void 0, false, {
                    fileName: "[project]/features/cost-adjustments/page.tsx",
                    lineNumber: 556,
                    columnNumber: 13
                }, void 0)
            }, void 0, false, {
                fileName: "[project]/features/cost-adjustments/page.tsx",
                lineNumber: 542,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$layout$2f$page$2d$filters$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PageFilters"], {
                searchValue: globalFilter,
                onSearchChange: setGlobalFilter,
                searchPlaceholder: "Tìm kiếm phiếu điều chỉnh...",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$data$2d$table$2f$data$2d$table$2d$faceted$2d$filter$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DataTableFacetedFilter"], {
                    title: "Trạng thái",
                    options: statusOptions,
                    selectedValues: statusFilter,
                    onSelectedValuesChange: setStatusFilter
                }, void 0, false, {
                    fileName: "[project]/features/cost-adjustments/page.tsx",
                    lineNumber: 576,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/features/cost-adjustments/page.tsx",
                lineNumber: 571,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "w-full py-4",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$data$2d$table$2f$responsive$2d$data$2d$table$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ResponsiveDataTable"], {
                    columns: columns,
                    data: paginatedData,
                    renderMobileCard: (adjustment)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$features$2f$cost$2d$adjustments$2f$cost$2d$adjustment$2d$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CostAdjustmentCard"], {
                            adjustment: adjustment,
                            onConfirm: handleConfirm,
                            onCancel: handleCancel
                        }, void 0, false, {
                            fileName: "[project]/features/cost-adjustments/page.tsx",
                            lineNumber: 590,
                            columnNumber: 13
                        }, void 0),
                    pageCount: pageCount,
                    pagination: pagination,
                    setPagination: setPagination,
                    rowCount: filteredData.length,
                    rowSelection: rowSelection,
                    setRowSelection: setRowSelection,
                    allSelectedRows: allSelectedRows,
                    bulkActions: bulkActions,
                    showBulkDeleteButton: false,
                    expanded: expanded,
                    setExpanded: setExpanded,
                    sorting: sorting,
                    setSorting: setSorting,
                    columnVisibility: columnVisibility,
                    setColumnVisibility: setColumnVisibility,
                    columnOrder: columnOrder,
                    setColumnOrder: setColumnOrder,
                    pinnedColumns: pinnedColumns,
                    setPinnedColumns: setPinnedColumns,
                    onRowClick: handleRowClick
                }, void 0, false, {
                    fileName: "[project]/features/cost-adjustments/page.tsx",
                    lineNumber: 586,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/features/cost-adjustments/page.tsx",
                lineNumber: 585,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$alert$2d$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AlertDialog"], {
                open: !!confirmDialogState,
                onOpenChange: (open)=>{
                    if (!open && !isConfirmLoading) {
                        setConfirmDialogState(null);
                    }
                },
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$alert$2d$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AlertDialogContent"], {
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$alert$2d$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AlertDialogHeader"], {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$alert$2d$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AlertDialogTitle"], {
                                    children: confirmDialogCopy?.title
                                }, void 0, false, {
                                    fileName: "[project]/features/cost-adjustments/page.tsx",
                                    lineNumber: 627,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$alert$2d$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AlertDialogDescription"], {
                                    children: confirmDialogCopy?.description
                                }, void 0, false, {
                                    fileName: "[project]/features/cost-adjustments/page.tsx",
                                    lineNumber: 628,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/features/cost-adjustments/page.tsx",
                            lineNumber: 626,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$alert$2d$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AlertDialogFooter"], {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$alert$2d$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AlertDialogCancel"], {
                                    className: "h-9",
                                    disabled: isConfirmLoading,
                                    children: "Đóng"
                                }, void 0, false, {
                                    fileName: "[project]/features/cost-adjustments/page.tsx",
                                    lineNumber: 633,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$alert$2d$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AlertDialogAction"], {
                                    className: "h-9",
                                    disabled: isConfirmLoading,
                                    onClick: handleConfirmDialogAction,
                                    children: isConfirmLoading ? 'Đang xử lý...' : confirmDialogCopy?.confirmLabel ?? 'Đồng ý'
                                }, void 0, false, {
                                    fileName: "[project]/features/cost-adjustments/page.tsx",
                                    lineNumber: 636,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/features/cost-adjustments/page.tsx",
                            lineNumber: 632,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/features/cost-adjustments/page.tsx",
                    lineNumber: 625,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/features/cost-adjustments/page.tsx",
                lineNumber: 620,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$shared$2f$simple$2d$print$2d$options$2d$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SimplePrintOptionsDialog"], {
                open: printDialogOpen,
                onOpenChange: setPrintDialogOpen,
                selectedCount: itemsToPrint.length,
                onConfirm: handlePrintConfirm,
                title: "In phiếu điều chỉnh giá vốn"
            }, void 0, false, {
                fileName: "[project]/features/cost-adjustments/page.tsx",
                lineNumber: 648,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(CostAdjustmentImportDialog, {
                open: showImportDialog,
                onOpenChange: setShowImportDialog,
                branches: branches.map((b)=>({
                        systemId: b.systemId,
                        name: b.name
                    })),
                existingData: adjustments,
                onImport: handleImport,
                currentUser: {
                    name: employee?.fullName || 'Hệ thống',
                    systemId: employee?.systemId || (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])('SYSTEM')
                }
            }, void 0, false, {
                fileName: "[project]/features/cost-adjustments/page.tsx",
                lineNumber: 657,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(CostAdjustmentExportDialog, {
                open: showExportDialog,
                onOpenChange: setShowExportDialog,
                allData: adjustments,
                filteredData: sortedData,
                currentPageData: paginatedData,
                selectedData: selectedAdjustments,
                currentUser: {
                    name: employee?.fullName || 'Hệ thống',
                    systemId: employee?.systemId || (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])('SYSTEM')
                }
            }, void 0, false, {
                fileName: "[project]/features/cost-adjustments/page.tsx",
                lineNumber: 670,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/features/cost-adjustments/page.tsx",
        lineNumber: 539,
        columnNumber: 5
    }, this);
}
_s(CostAdjustmentListPage, "BuWr1SMRxIPXBqHRrngMGdtzgWY=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"],
        __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$cost$2d$adjustments$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCostAdjustmentStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$contexts$2f$auth$2d$context$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuth"],
        __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$use$2d$media$2d$query$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMediaQuery"],
        __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$use$2d$print$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePrint"],
        __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$branches$2f$hooks$2f$use$2d$all$2d$branches$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAllBranches"],
        __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$branches$2f$hooks$2f$use$2d$all$2d$branches$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useBranchFinder"],
        __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$store$2d$info$2f$store$2d$info$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useStoreInfoStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$use$2d$column$2d$visibility$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useColumnLayout"],
        __TURBOPACK__imported__module__$5b$project$5d2f$contexts$2f$page$2d$header$2d$context$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePageHeader"]
    ];
});
_c2 = CostAdjustmentListPage;
var _c, _c1, _c2;
__turbopack_context__.k.register(_c, "CostAdjustmentImportDialog");
__turbopack_context__.k.register(_c1, "CostAdjustmentExportDialog");
__turbopack_context__.k.register(_c2, "CostAdjustmentListPage");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=_9370b278._.js.map