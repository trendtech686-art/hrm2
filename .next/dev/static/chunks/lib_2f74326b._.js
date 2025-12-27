(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
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
"[project]/lib/attendance-snapshot-service.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "attendanceSnapshotService",
    ()=>attendanceSnapshotService
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$attendance$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/attendance/store.ts [app-client] (ecmascript)");
;
const buildSnapshot = (row, query, locked)=>({
        monthKey: query.monthKey,
        employeeSystemId: query.employeeSystemId,
        employeeId: row.employeeId,
        fullName: row.fullName,
        department: row.department,
        totals: {
            workDays: row.workDays,
            leaveDays: row.leaveDays,
            absentDays: row.absentDays,
            lateArrivals: row.lateArrivals,
            earlyDepartures: row.earlyDepartures,
            otHours: row.otHours,
            otHoursWeekday: row.otHoursWeekday ?? 0,
            otHoursWeekend: row.otHoursWeekend ?? 0,
            otHoursHoliday: row.otHoursHoliday ?? 0
        },
        locked,
        status: locked ? 'locked' : 'pending',
        generatedAt: new Date().toISOString()
    });
const getLatestLockedMonthKey = ()=>{
    const { lockedMonths } = __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$attendance$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAttendanceStore"].getState();
    const lockedKeys = Object.entries(lockedMonths).filter(([, isLocked])=>Boolean(isLocked)).map(([monthKey])=>monthKey).sort().reverse();
    return lockedKeys[0];
};
const attendanceSnapshotService = {
    getSnapshot ({ monthKey, employeeSystemId }) {
        const state = __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$attendance$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAttendanceStore"].getState();
        const monthRows = state.attendanceData[monthKey];
        if (!monthRows?.length) {
            return null;
        }
        const targetRow = monthRows.find((row)=>row.employeeSystemId === employeeSystemId);
        if (!targetRow) {
            return null;
        }
        const locked = Boolean(state.lockedMonths[monthKey]);
        return buildSnapshot(targetRow, {
            monthKey,
            employeeSystemId
        }, locked);
    },
    getLatestLockedSnapshot (employeeSystemId) {
        const latestLockedKey = getLatestLockedMonthKey();
        if (!latestLockedKey) {
            return null;
        }
        return this.getSnapshot({
            monthKey: latestLockedKey,
            employeeSystemId
        });
    }
};
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
"[project]/lib/print-mappers/payroll.mapper.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "mapPayrollBatchLineItems",
    ()=>mapPayrollBatchLineItems,
    "mapPayrollBatchToPrintData",
    ()=>mapPayrollBatchToPrintData,
    "mapPayslipComponentLineItems",
    ()=>mapPayslipComponentLineItems,
    "mapPayslipToPrintData",
    ()=>mapPayslipToPrintData
]);
/**
 * Payroll Mapper - Bảng lương & Phiếu lương
 * Đồng bộ với variables/bang-luong.ts
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$mappers$2f$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/lib/print-mappers/types.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/print-service.ts [app-client] (ecmascript)");
;
// Helper: Format số khấu trừ (có dấu âm khi > 0, không dấu khi = 0)
const formatDeduction = (value)=>{
    if (!value || value === 0) return '0';
    return `-${(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatCurrency"])(value)}`;
};
// ============================================
// BATCH MAPPER (Tổng bảng lương)
// ============================================
const STATUS_MAP = {
    'draft': 'Nháp',
    'reviewed': 'Đã duyệt',
    'locked': 'Đã khóa'
};
function mapPayrollBatchToPrintData(batch, storeSettings) {
    return {
        ...(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getStoreData"])(storeSettings),
        // === THÔNG TIN BẢNG LƯƠNG ===
        '{batch_code}': batch.code,
        '{batch_title}': batch.title,
        '{batch_status}': STATUS_MAP[batch.status] || batch.status,
        '{pay_period}': batch.payPeriod,
        '{pay_period_start}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatDate"])(batch.payPeriodStart),
        '{pay_period_end}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatDate"])(batch.payPeriodEnd),
        '{payroll_date}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatDate"])(batch.payrollDate),
        '{reference_months}': batch.referenceMonths?.join(', ') || '',
        '{created_on}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatDate"])(batch.createdAt),
        '{created_by}': batch.createdBy || '',
        '{locked_on}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatDate"])(batch.lockedAt),
        '{locked_by}': batch.lockedBy || '',
        '{notes}': batch.notes || '',
        // === TỔNG KẾT ===
        '{total_employees}': String(batch.totalEmployees),
        '{total_gross}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatCurrency"])(batch.totalGross),
        '{total_gross_text}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["numberToWords"])(batch.totalGross),
        '{total_earnings}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatCurrency"])(batch.totalEarnings),
        '{total_deductions}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatCurrency"])(batch.totalDeductions),
        '{total_contributions}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatCurrency"])(batch.totalContributions),
        '{total_insurance}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatCurrency"])(batch.totalInsurance),
        '{total_tax}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatCurrency"])(batch.totalTax),
        '{total_net}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatCurrency"])(batch.totalNet),
        '{total_net_text}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["numberToWords"])(batch.totalNet)
    };
}
function mapPayrollBatchLineItems(payslips) {
    if (!payslips?.length) return [];
    return payslips.map((slip, index)=>({
            '{line_stt}': String(index + 1),
            '{employee_code}': slip.employeeCode,
            '{employee_name}': slip.employeeName,
            '{department_name}': slip.departmentName || '',
            '{earnings}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatCurrency"])(slip.earnings),
            '{deductions}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatCurrency"])(slip.deductions),
            '{contributions}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatCurrency"])(slip.contributions),
            '{total_insurance}': formatDeduction(slip.totalEmployeeInsurance),
            '{personal_income_tax}': formatDeduction(slip.personalIncomeTax),
            '{net_pay}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatCurrency"])(slip.netPay)
        }));
}
// ============================================
// PAYSLIP MAPPER (Phiếu lương cá nhân)
// ============================================
const COMPONENT_CATEGORY_MAP = {
    'earning': 'Khoản cộng',
    'deduction': 'Khoản trừ',
    'contribution': 'Đóng góp'
};
function mapPayslipToPrintData(payslip, storeSettings) {
    return {
        ...(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getStoreData"])(storeSettings),
        // === THÔNG TIN PHIẾU LƯƠNG ===
        '{payslip_code}': payslip.code,
        '{batch_code}': payslip.batchCode || '',
        '{batch_title}': payslip.batchTitle || '',
        '{pay_period}': payslip.payPeriod || '',
        '{payroll_date}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatDate"])(payslip.payrollDate),
        // === THÔNG TIN NHÂN VIÊN ===
        '{employee_code}': payslip.employeeCode,
        '{employee_name}': payslip.employeeName,
        '{department_name}': payslip.departmentName || '',
        '{position}': payslip.position || '',
        // === THÔNG TIN CHẤM CÔNG ===
        '{work_days}': String(payslip.workDays ?? 0),
        '{standard_work_days}': String(payslip.standardWorkDays ?? 26),
        '{leave_days}': String(payslip.leaveDays ?? 0),
        '{absent_days}': String(payslip.absentDays ?? 0),
        '{ot_hours}': String(payslip.otHours ?? 0),
        '{ot_hours_weekday}': String(payslip.otHoursWeekday ?? 0),
        '{ot_hours_weekend}': String(payslip.otHoursWeekend ?? 0),
        '{ot_hours_holiday}': String(payslip.otHoursHoliday ?? 0),
        '{late_arrivals}': String(payslip.lateArrivals ?? 0),
        '{early_departures}': String(payslip.earlyDepartures ?? 0),
        // === CHI TIẾT LƯƠNG ===
        '{total_earnings}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatCurrency"])(payslip.earnings),
        '{total_deductions}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatCurrency"])(payslip.deductions),
        '{total_contributions}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatCurrency"])(payslip.contributions),
        '{total_insurance}': formatDeduction(payslip.totalEmployeeInsurance),
        // === BẢO HIỂM CHI TIẾT ===
        '{bhxh_amount}': formatDeduction(payslip.employeeSocialInsurance),
        '{bhyt_amount}': formatDeduction(payslip.employeeHealthInsurance),
        '{bhtn_amount}': formatDeduction(payslip.employeeUnemploymentInsurance),
        // === GIẢM TRỪ GIA CẢNH ===
        '{personal_deduction}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatCurrency"])(payslip.personalDeduction),
        '{dependent_deduction}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatCurrency"])(payslip.dependentDeduction),
        '{dependents_count}': String(payslip.numberOfDependents || 0),
        // === THUẾ & THỰC LĨNH ===
        '{personal_income_tax}': formatDeduction(payslip.personalIncomeTax),
        '{taxable_income}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatCurrency"])(payslip.taxableIncome),
        '{social_insurance_base}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatCurrency"])(payslip.socialInsuranceBase),
        '{penalty_deductions}': formatDeduction(payslip.penaltyDeductions),
        '{other_deductions}': formatDeduction(payslip.otherDeductions),
        '{net_pay}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatCurrency"])(payslip.netPay),
        '{net_pay_text}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["numberToWords"])(payslip.netPay)
    };
}
/**
 * Tạo công thức đọc được cho component
 * Ví dụ: "35,000,000 × (16.98 / 26)" hoặc "Cố định"
 */ function formatComponentFormula(comp) {
    // Fixed amount
    if (comp.calculationType === 'fixed' || !comp.formula) {
        return 'Cố định';
    }
    const ctx = comp.metadata?.context;
    if (!ctx) return comp.formula || '';
    // Lương cơ bản: baseSalary × (workDays / standardWorkDays)
    if (comp.formula?.includes('baseSalary') && comp.formula?.includes('workDays')) {
        const baseSalary = ctx.baseSalary ?? 0;
        const workDays = ctx.workDays ?? 0;
        const standardWorkDays = ctx.standardWorkDays ?? 26;
        return `${(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatCurrency"])(baseSalary)} × (${workDays} / ${standardWorkDays})`;
    }
    // Phụ cấp ăn trưa: workDays × mealAllowancePerDay
    if (comp.formula?.includes('mealAllowancePerDay') || comp.name.toLowerCase().includes('ăn trưa')) {
        const workDays = ctx.workDays ?? 0;
        const mealAllowancePerDay = ctx.mealAllowancePerDay ?? 30000;
        return `${workDays} ngày × ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatCurrency"])(mealAllowancePerDay)}`;
    }
    // OT ngày thường (không có hệ số, chỉ nhân hourlyRate)
    if (comp.formula?.includes('otPayWeekday') || comp.name.toLowerCase().includes('ngày thường')) {
        const hours = ctx.otHoursWeekday ?? 0;
        const hourlyRate = ctx.otHourlyRate ?? 0;
        if (hours > 0 && hourlyRate > 0) {
            return `${hours}h × ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatCurrency"])(hourlyRate)}`;
        }
        return hours > 0 ? `${hours}h OT` : '—';
    }
    // OT cuối tuần (hourlyRate × hệ số)
    if (comp.formula?.includes('otPayWeekend') || comp.name.toLowerCase().includes('cuối tuần')) {
        const hours = ctx.otHoursWeekend ?? 0;
        const hourlyRate = ctx.otHourlyRate ?? 0;
        const rate = ctx.otRateWeekend ?? 2;
        if (hours > 0 && hourlyRate > 0) {
            return `${hours}h × ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatCurrency"])(hourlyRate)} × ${rate}`;
        }
        return hours > 0 ? `${hours}h OT` : '—';
    }
    // OT ngày lễ (hourlyRate × hệ số)
    if (comp.formula?.includes('otPayHoliday') || comp.name.toLowerCase().includes('ngày lễ')) {
        const hours = ctx.otHoursHoliday ?? 0;
        const hourlyRate = ctx.otHourlyRate ?? 0;
        const rate = ctx.otRateHoliday ?? 3;
        if (hours > 0 && hourlyRate > 0) {
            return `${hours}h × ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatCurrency"])(hourlyRate)} × ${rate}`;
        }
        return hours > 0 ? `${hours}h OT` : '—';
    }
    // Fallback - hiển thị formula gốc nếu có
    return comp.formula || 'Cố định';
}
function mapPayslipComponentLineItems(components) {
    if (!components?.length) return [];
    return components.map((comp, index)=>({
            '{line_stt}': String(index + 1),
            '{component_code}': comp.code || '',
            '{component_name}': comp.name,
            '{component_category}': COMPONENT_CATEGORY_MAP[comp.category] || comp.category,
            '{component_formula}': formatComponentFormula(comp),
            '{component_amount}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatCurrency"])(comp.amount)
        }));
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/print/payroll-print-helper.ts [app-client] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

/**
 * Payroll Print Helper
 * Helpers để chuẩn bị dữ liệu in cho bảng lương và phiếu lương
 */ __turbopack_context__.s([
    "convertPayrollBatchForPrint",
    ()=>convertPayrollBatchForPrint,
    "convertPayslipForPrint",
    ()=>convertPayslipForPrint,
    "createStoreSettings",
    ()=>createStoreSettings
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$attendance$2d$snapshot$2d$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/attendance-snapshot-service.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$mappers$2f$payroll$2e$mapper$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/print-mappers/payroll.mapper.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/print-service.ts [app-client] (ecmascript)");
;
;
;
function convertPayrollBatchForPrint(batch, payslips, options = {}) {
    const { employeeLookup = {}, departmentLookup = {}, creatorName, lockerName } = options;
    // Calculate totals from payslips
    const totalEarnings = payslips.reduce((sum, p)=>sum + p.totals.earnings, 0);
    const totalDeductions = payslips.reduce((sum, p)=>sum + p.totals.deductions, 0);
    const totalContributions = payslips.reduce((sum, p)=>sum + p.totals.contributions, 0);
    const totalInsurance = payslips.reduce((sum, p)=>sum + (p.totals.totalEmployeeInsurance || 0), 0);
    const totalTax = payslips.reduce((sum, p)=>sum + (p.totals.personalIncomeTax || 0), 0);
    // Convert payslips
    const payslipsForPrint = payslips.map((payslip)=>{
        const employee = employeeLookup[payslip.employeeSystemId];
        const departmentName = payslip.departmentSystemId ? departmentLookup[payslip.departmentSystemId]?.name : employee?.departmentName;
        return {
            code: payslip.id || payslip.systemId,
            batchCode: batch.id,
            batchTitle: batch.title,
            payPeriod: batch.payPeriod?.monthKey,
            payrollDate: batch.payrollDate,
            employeeCode: employee?.id || payslip.employeeId || '',
            employeeName: employee?.fullName || `Nhân viên ${payslip.employeeId || payslip.employeeSystemId}`,
            departmentName: departmentName || 'Không xác định',
            earnings: payslip.totals.earnings,
            deductions: payslip.totals.deductions,
            contributions: payslip.totals.contributions,
            taxableIncome: payslip.totals.taxableIncome,
            socialInsuranceBase: payslip.totals.socialInsuranceBase,
            netPay: payslip.totals.netPay,
            // Bảo hiểm chi tiết
            totalEmployeeInsurance: payslip.totals.totalEmployeeInsurance || 0,
            employeeSocialInsurance: payslip.totals.employeeSocialInsurance || 0,
            employeeHealthInsurance: payslip.totals.employeeHealthInsurance || 0,
            employeeUnemploymentInsurance: payslip.totals.employeeUnemploymentInsurance || 0,
            // Thuế TNCN
            personalIncomeTax: payslip.totals.personalIncomeTax || 0,
            // Khấu trừ phạt & khác
            penaltyDeductions: payslip.totals.penaltyDeductions || 0,
            otherDeductions: payslip.totals.otherDeductions || 0,
            // Giảm trừ gia cảnh
            personalDeduction: payslip.totals.personalDeduction || 0,
            dependentDeduction: payslip.totals.dependentDeduction || 0,
            numberOfDependents: payslip.totals.numberOfDependents || 0,
            components: payslip.components?.map((c)=>({
                    code: c.componentId,
                    name: c.label,
                    category: c.category,
                    amount: c.amount
                }))
        };
    });
    return {
        code: batch.id,
        title: batch.title,
        status: batch.status,
        payPeriod: batch.payPeriod?.monthKey || '',
        payPeriodStart: batch.payPeriod?.startDate,
        payPeriodEnd: batch.payPeriod?.endDate,
        payrollDate: batch.payrollDate || '',
        referenceMonths: batch.referenceAttendanceMonthKeys,
        totalEmployees: payslips.length,
        totalGross: batch.totalGross || 0,
        totalEarnings,
        totalDeductions,
        totalContributions,
        totalInsurance,
        totalTax,
        totalNet: batch.totalNet || 0,
        createdAt: batch.createdAt || '',
        createdBy: creatorName,
        lockedAt: batch.lockedAt,
        lockedBy: lockerName,
        notes: batch.notes,
        payslips: payslipsForPrint
    };
}
function convertPayslipForPrint(payslip, batch, options = {}) {
    const { employee, departmentName } = options;
    // Lấy attendance info: từ totals trước, nếu không có thì lấy từ snapshot
    let attendance = {
        workDays: payslip.totals.workDays,
        standardWorkDays: payslip.totals.standardWorkDays ?? 26,
        leaveDays: payslip.totals.leaveDays ?? 0,
        absentDays: payslip.totals.absentDays ?? 0,
        otHours: payslip.totals.otHours ?? 0,
        otHoursWeekday: payslip.totals.otHoursWeekday ?? 0,
        otHoursWeekend: payslip.totals.otHoursWeekend ?? 0,
        otHoursHoliday: payslip.totals.otHoursHoliday ?? 0,
        lateArrivals: payslip.totals.lateArrivals ?? 0,
        earlyDepartures: payslip.totals.earlyDepartures ?? 0
    };
    // Nếu totals không có workDays (dữ liệu cũ), thử lấy từ attendance snapshot
    if (attendance.workDays === undefined || attendance.workDays === null) {
        const monthKey = payslip.periodMonthKey || batch.payPeriod?.monthKey;
        if (monthKey) {
            const snapshot = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$attendance$2d$snapshot$2d$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["attendanceSnapshotService"].getSnapshot({
                monthKey,
                employeeSystemId: payslip.employeeSystemId
            });
            if (snapshot) {
                attendance = {
                    workDays: snapshot.totals.workDays,
                    standardWorkDays: 26,
                    leaveDays: snapshot.totals.leaveDays,
                    absentDays: snapshot.totals.absentDays,
                    otHours: snapshot.totals.otHours,
                    otHoursWeekday: snapshot.totals.otHoursWeekday ?? 0,
                    otHoursWeekend: snapshot.totals.otHoursWeekend ?? 0,
                    otHoursHoliday: snapshot.totals.otHoursHoliday ?? 0,
                    lateArrivals: snapshot.totals.lateArrivals,
                    earlyDepartures: snapshot.totals.earlyDepartures
                };
            }
        }
    }
    return {
        code: payslip.id || payslip.systemId,
        batchCode: batch.id,
        batchTitle: batch.title,
        payPeriod: batch.payPeriod?.monthKey,
        payrollDate: batch.payrollDate,
        employeeCode: employee?.id || payslip.employeeId || '',
        employeeName: employee?.fullName || `Nhân viên ${payslip.employeeId || payslip.employeeSystemId}`,
        departmentName: departmentName || employee?.department || 'Không xác định',
        position: employee?.position,
        // Thông tin chấm công (từ attendance object đã resolve)
        workDays: attendance.workDays,
        standardWorkDays: attendance.standardWorkDays,
        leaveDays: attendance.leaveDays,
        absentDays: attendance.absentDays,
        otHours: attendance.otHours,
        otHoursWeekday: attendance.otHoursWeekday,
        otHoursWeekend: attendance.otHoursWeekend,
        otHoursHoliday: attendance.otHoursHoliday,
        lateArrivals: attendance.lateArrivals,
        earlyDepartures: attendance.earlyDepartures,
        // Chi tiết lương
        earnings: payslip.totals.earnings,
        deductions: payslip.totals.deductions,
        contributions: payslip.totals.contributions,
        taxableIncome: payslip.totals.taxableIncome,
        socialInsuranceBase: payslip.totals.socialInsuranceBase,
        netPay: payslip.totals.netPay,
        // Bảo hiểm chi tiết
        totalEmployeeInsurance: payslip.totals.totalEmployeeInsurance || 0,
        employeeSocialInsurance: payslip.totals.employeeSocialInsurance || 0,
        employeeHealthInsurance: payslip.totals.employeeHealthInsurance || 0,
        employeeUnemploymentInsurance: payslip.totals.employeeUnemploymentInsurance || 0,
        // Thuế TNCN
        personalIncomeTax: payslip.totals.personalIncomeTax || 0,
        // Khấu trừ phạt & khác
        penaltyDeductions: payslip.totals.penaltyDeductions || 0,
        otherDeductions: payslip.totals.otherDeductions || 0,
        // Giảm trừ gia cảnh
        personalDeduction: payslip.totals.personalDeduction || 0,
        dependentDeduction: payslip.totals.dependentDeduction || 0,
        numberOfDependents: payslip.totals.numberOfDependents || 0,
        components: payslip.components?.map((c)=>({
                code: c.componentId,
                name: c.label,
                category: c.category,
                amount: c.amount,
                calculationType: c.calculationType,
                formula: c.formula,
                metadata: c.metadata
            }))
    };
}
function createStoreSettings(storeInfo) {
    const generalSettings = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getGeneralSettings"])();
    // Fallback: lấy từ store nếu storeInfo rỗng
    let storeInfoFromStorage = null;
    if (!storeInfo?.companyName && !storeInfo?.brandName) {
        try {
            // Import store dynamically để tránh circular dependency
            const { useStoreInfoStore } = __turbopack_context__.r("[project]/features/settings/store-info/store-info-store.ts [app-client] (ecmascript)");
            storeInfoFromStorage = useStoreInfoStore.getState().info;
        } catch (e) {}
    }
    const info = storeInfo?.companyName || storeInfo?.brandName ? storeInfo : storeInfoFromStorage;
    return {
        name: info?.companyName || info?.brandName || generalSettings?.companyName || '',
        address: info?.headquartersAddress || generalSettings?.companyAddress || '',
        phone: info?.hotline || generalSettings?.phoneNumber || '',
        email: info?.email || generalSettings?.email || '',
        website: info?.website,
        taxCode: info?.taxCode,
        province: info?.province,
        logo: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getStoreLogo"])(info?.logo)
    };
}
;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/print-mappers/attendance.mapper.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "mapAttendanceDetailLineItems",
    ()=>mapAttendanceDetailLineItems,
    "mapAttendanceDetailToPrintData",
    ()=>mapAttendanceDetailToPrintData,
    "mapAttendanceSheetLineItems",
    ()=>mapAttendanceSheetLineItems,
    "mapAttendanceSheetToPrintData",
    ()=>mapAttendanceSheetToPrintData
]);
/**
 * Attendance Mapper - Bảng chấm công
 * Đồng bộ với variables/bang-cham-cong.ts
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$mappers$2f$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/lib/print-mappers/types.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/print-service.ts [app-client] (ecmascript)");
;
// ============================================
// STATUS MAPS
// ============================================
const STATUS_MAP = {
    'present': 'Có mặt',
    'absent': 'Vắng',
    'leave': 'Nghỉ phép',
    'half-day': 'Nửa ngày',
    'weekend': 'Cuối tuần',
    'holiday': 'Nghỉ lễ',
    'future': '-'
};
const STATUS_SHORT_MAP = {
    'present': '✓',
    'absent': 'X',
    'leave': 'P',
    'half-day': '½',
    'weekend': '-',
    'holiday': 'L',
    'future': '-'
};
const DAY_OF_WEEK_MAP = {
    0: 'CN',
    1: 'T2',
    2: 'T3',
    3: 'T4',
    4: 'T5',
    5: 'T6',
    6: 'T7'
};
function mapAttendanceSheetToPrintData(sheet, storeSettings) {
    const [year, month] = sheet.monthKey.split('-').map(Number);
    return {
        ...(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getStoreData"])(storeSettings),
        // === THÔNG TIN BẢNG CHẤM CÔNG ===
        '{month_year}': `${month}/${year}`,
        '{month}': String(month),
        '{year}': String(year),
        '{department_name}': sheet.departmentName || 'Tất cả phòng ban',
        '{is_locked}': sheet.isLocked ? 'Đã khóa' : 'Đang mở',
        '{created_on}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatDate"])(sheet.createdAt),
        '{created_by}': sheet.createdBy || '',
        // === TỔNG KẾT ===
        '{total_employees}': String(sheet.totalEmployees),
        '{total_work_days}': String(sheet.totalWorkDays),
        '{total_leave_days}': String(sheet.totalLeaveDays),
        '{total_absent_days}': String(sheet.totalAbsentDays),
        '{total_late_arrivals}': String(sheet.totalLateArrivals),
        '{total_early_departures}': String(sheet.totalEarlyDepartures),
        '{total_ot_hours}': String(sheet.totalOtHours)
    };
}
function mapAttendanceSheetLineItems(employees, monthKey) {
    if (!employees?.length) return [];
    // Parse year and month for day of week calculation
    const [year, month] = monthKey ? monthKey.split('-').map(Number) : [
        new Date().getFullYear(),
        new Date().getMonth() + 1
    ];
    return employees.map((emp, index)=>{
        const lineItem = {
            '{line_index}': String(index + 1),
            '{employee_code}': emp.employeeCode,
            '{employee_name}': emp.employeeName,
            '{department_name}': emp.departmentName || '',
            '{work_days}': String(emp.workDays),
            '{leave_days}': String(emp.leaveDays),
            '{absent_days}': String(emp.absentDays),
            '{late_arrivals}': String(emp.lateArrivals),
            '{early_departures}': String(emp.earlyDepartures),
            '{ot_hours}': String(emp.otHours)
        };
        // Add day_1 to day_31 with all details
        for(let d = 1; d <= 31; d++){
            const dayKey = `day_${d}`;
            const status = emp.dailyRecords?.[dayKey];
            // Day status (short form)
            lineItem[`{${dayKey}}`] = status ? STATUS_SHORT_MAP[status] || status : '';
            // Day of week
            const date = new Date(year, month - 1, d);
            const isValidDate = date.getMonth() === month - 1; // Check if day exists in month
            lineItem[`{dow_${d}}`] = isValidDate ? DAY_OF_WEEK_MAP[date.getDay()] || '' : '';
            // Check-in/out times
            lineItem[`{checkin_${d}}`] = emp.dailyCheckIn?.[dayKey] || '';
            lineItem[`{checkout_${d}}`] = emp.dailyCheckOut?.[dayKey] || '';
            // OT times  
            lineItem[`{ot_in_${d}}`] = emp.dailyOtIn?.[dayKey] || '';
            lineItem[`{ot_out_${d}}`] = emp.dailyOtOut?.[dayKey] || '';
            // Notes
            lineItem[`{note_${d}}`] = emp.dailyNotes?.[dayKey] || '';
        }
        return lineItem;
    });
}
function mapAttendanceDetailToPrintData(detail, storeSettings) {
    const [year, month] = detail.monthKey.split('-').map(Number);
    return {
        ...(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getStoreData"])(storeSettings),
        // === THÔNG TIN NHÂN VIÊN ===
        '{employee_code}': detail.employeeCode,
        '{employee_name}': detail.employeeName,
        '{department_name}': detail.departmentName || '',
        // === THÔNG TIN KỲ ===
        '{month_year}': `${month}/${year}`,
        // === TỔNG KẾT ===
        '{work_days}': String(detail.workDays),
        '{leave_days}': String(detail.leaveDays),
        '{absent_days}': String(detail.absentDays),
        '{late_arrivals}': String(detail.lateArrivals),
        '{early_departures}': String(detail.earlyDepartures),
        '{ot_hours}': String(detail.otHours)
    };
}
function mapAttendanceDetailLineItems(dailyDetails) {
    if (!dailyDetails?.length) return [];
    return dailyDetails.map((record, index)=>({
            '{line_index}': String(index + 1),
            '{day}': String(record.day),
            '{day_of_week}': record.dayOfWeek || getDayOfWeekLabel(record.day),
            '{status}': STATUS_MAP[record.status] || record.status,
            '{check_in}': record.checkIn || '',
            '{check_out}': record.checkOut || '',
            '{ot_check_in}': record.overtimeCheckIn || '',
            '{ot_check_out}': record.overtimeCheckOut || '',
            '{notes}': record.notes || ''
        }));
}
// Helper to get day of week label from day number (requires year/month context)
function getDayOfWeekLabel(day, year, month) {
    if (!year || !month) return '';
    const date = new Date(year, month - 1, day);
    return DAY_OF_WEEK_MAP[date.getDay()] || '';
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/print/attendance-print-helper.ts [app-client] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

/**
 * Attendance Print Helper
 * Helpers để chuẩn bị dữ liệu in cho bảng chấm công
 */ __turbopack_context__.s([
    "convertAttendanceDetailForPrint",
    ()=>convertAttendanceDetailForPrint,
    "convertAttendanceSheetForPrint",
    ()=>convertAttendanceSheetForPrint,
    "createStoreSettings",
    ()=>createStoreSettings
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$mappers$2f$attendance$2e$mapper$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/print-mappers/attendance.mapper.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/print-service.ts [app-client] (ecmascript)");
;
;
function convertAttendanceSheetForPrint(monthKey, attendanceData, options = {}) {
    const { isLocked, departmentName, createdBy } = options;
    // Calculate totals
    const totalWorkDays = attendanceData.reduce((sum, row)=>sum + (row.workDays || 0), 0);
    const totalLeaveDays = attendanceData.reduce((sum, row)=>sum + (row.leaveDays || 0), 0);
    const totalAbsentDays = attendanceData.reduce((sum, row)=>sum + (row.absentDays || 0), 0);
    const totalLateArrivals = attendanceData.reduce((sum, row)=>sum + (row.lateArrivals || 0), 0);
    const totalEarlyDepartures = attendanceData.reduce((sum, row)=>sum + (row.earlyDepartures || 0), 0);
    const totalOtHours = attendanceData.reduce((sum, row)=>sum + (row.otHours || 0), 0);
    // Convert employees
    const employees = attendanceData.map((row)=>{
        const dailyRecords = {};
        const dailyCheckIn = {};
        const dailyCheckOut = {};
        const dailyOtIn = {};
        const dailyOtOut = {};
        const dailyNotes = {};
        // Extract day_1 to day_31
        for(let d = 1; d <= 31; d++){
            const dayKey = `day_${d}`;
            const record = row[dayKey];
            if (record) {
                dailyRecords[`day_${d}`] = record.status;
                if (record.checkIn) dailyCheckIn[`day_${d}`] = record.checkIn;
                if (record.checkOut) dailyCheckOut[`day_${d}`] = record.checkOut;
                if (record.overtimeCheckIn) dailyOtIn[`day_${d}`] = record.overtimeCheckIn;
                if (record.overtimeCheckOut) dailyOtOut[`day_${d}`] = record.overtimeCheckOut;
                if (record.notes) dailyNotes[`day_${d}`] = record.notes;
            }
        }
        return {
            employeeCode: row.employeeId || '',
            employeeName: row.fullName || '',
            departmentName: row.department || '',
            workDays: row.workDays || 0,
            leaveDays: row.leaveDays || 0,
            absentDays: row.absentDays || 0,
            lateArrivals: row.lateArrivals || 0,
            earlyDepartures: row.earlyDepartures || 0,
            otHours: row.otHours || 0,
            dailyRecords,
            dailyCheckIn,
            dailyCheckOut,
            dailyOtIn,
            dailyOtOut,
            dailyNotes
        };
    });
    const [year, month] = monthKey.split('-').map(Number);
    return {
        monthKey,
        month,
        year,
        departmentName,
        isLocked,
        createdBy,
        totalEmployees: attendanceData.length,
        totalWorkDays,
        totalLeaveDays,
        totalAbsentDays,
        totalLateArrivals,
        totalEarlyDepartures,
        totalOtHours,
        employees
    };
}
function convertAttendanceDetailForPrint(monthKey, row) {
    const [year, month] = monthKey.split('-').map(Number);
    const daysInMonth = new Date(year, month, 0).getDate();
    // Extract daily details
    const dailyDetails = [];
    for(let d = 1; d <= daysInMonth; d++){
        const dayKey = `day_${d}`;
        const record = row[dayKey];
        if (record) {
            const date = new Date(year, month - 1, d);
            const dayOfWeekMap = {
                0: 'CN',
                1: 'T2',
                2: 'T3',
                3: 'T4',
                4: 'T5',
                5: 'T6',
                6: 'T7'
            };
            dailyDetails.push({
                day: d,
                dayOfWeek: dayOfWeekMap[date.getDay()] || '',
                status: record.status,
                checkIn: record.checkIn,
                checkOut: record.checkOut,
                overtimeCheckIn: record.overtimeCheckIn,
                overtimeCheckOut: record.overtimeCheckOut,
                notes: record.notes
            });
        }
    }
    return {
        monthKey,
        employeeCode: row.employeeId || '',
        employeeName: row.fullName || '',
        departmentName: row.department || '',
        workDays: row.workDays || 0,
        leaveDays: row.leaveDays || 0,
        absentDays: row.absentDays || 0,
        lateArrivals: row.lateArrivals || 0,
        earlyDepartures: row.earlyDepartures || 0,
        otHours: row.otHours || 0,
        dailyDetails
    };
}
function createStoreSettings(storeInfo) {
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
"[project]/lib/print-mappers/penalty.mapper.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "mapPenaltyToPrintData",
    ()=>mapPenaltyToPrintData
]);
/**
 * Penalty Mapper - Phiếu phạt
 * Đồng bộ với variables/phieu-phat.ts
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$mappers$2f$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/lib/print-mappers/types.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/print-service.ts [app-client] (ecmascript)");
;
function mapPenaltyToPrintData(penalty, storeSettings) {
    return {
        ...(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getStoreData"])(storeSettings),
        // === THÔNG TIN CHI NHÁNH ===
        '{location_name}': penalty.location?.name || storeSettings.name || '',
        '{location_address}': penalty.location?.address || storeSettings.address || '',
        '{location_province}': penalty.location?.province || '',
        '{location_phone}': penalty.location?.phone || storeSettings.phone || '',
        '{store_province}': storeSettings.province || '',
        // === THÔNG TIN PHIẾU PHẠT ===
        '{penalty_code}': penalty.code,
        '{created_on}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatDate"])(penalty.createdAt),
        '{created_on_time}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatTime"])(penalty.createdAt),
        '{modified_on}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatDate"])(penalty.modifiedAt),
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
        '{penalty_date}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatDate"])(penalty.penaltyDate),
        '{penalty_date_time}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatTime"])(penalty.penaltyDate),
        '{violation_date}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatDate"])(penalty.penaltyDate),
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
        '{penalty_amount}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatCurrency"])(penalty.amount),
        '{amount}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatCurrency"])(penalty.amount),
        '{penalty_amount_text}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["numberToWords"])(penalty.amount),
        '{deduction_method}': penalty.deductionMethod || 'Trừ lương',
        '{deduction_period}': penalty.deductionPeriod || '',
        // === PHÊ DUYỆT ===
        '{status}': penalty.status || '',
        '{approved_by}': penalty.approvedBy || '',
        '{approved_on}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatDate"])(penalty.approvedAt),
        '{approved_on_time}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatTime"])(penalty.approvedAt),
        '{rejected_by}': penalty.rejectedBy || '',
        '{rejected_on}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatDate"])(penalty.rejectedAt),
        '{rejection_reason}': penalty.rejectionReason || '',
        // === THÔNG TIN BỔ SUNG ===
        '{witness_name}': penalty.witnessName || '',
        '{witness_signature}': penalty.witnessSignature || '',
        '{employee_acknowledgement}': penalty.employeeAcknowledgement ? 'Đã xác nhận' : '',
        '{employee_signature_date}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatDate"])(penalty.employeeSignatureDate),
        '{penalty_note}': penalty.note || '',
        '{note}': penalty.note || ''
    };
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/print/penalty-print-helper.ts [app-client] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

/**
 * Penalty Print Helper
 * Helpers để chuẩn bị dữ liệu in cho phiếu phạt
 */ __turbopack_context__.s([
    "convertPenaltyForPrint",
    ()=>convertPenaltyForPrint,
    "createStoreSettings",
    ()=>createStoreSettings
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$mappers$2f$penalty$2e$mapper$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/print-mappers/penalty.mapper.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/print-service.ts [app-client] (ecmascript)");
;
;
function convertPenaltyForPrint(penalty, options = {}) {
    const { branch, employee, issuer, creator, approver } = options;
    // Map trạng thái sang tiếng Việt
    const statusMap = {
        'draft': 'Nháp',
        'pending': 'Chờ duyệt',
        'approved': 'Đã duyệt',
        'executed': 'Đã thực hiện',
        'cancelled': 'Đã hủy'
    };
    const typeMap = {
        'late': 'Đi muộn',
        'absent': 'Vắng mặt',
        'violation': 'Vi phạm nội quy',
        'performance': 'Hiệu suất kém',
        'other': 'Khác'
    };
    return {
        // Thông tin cơ bản
        code: penalty.id,
        createdAt: penalty.createdAt,
        penaltyDate: penalty.penaltyDate || penalty.issueDate,
        createdBy: issuer?.fullName || creator?.fullName || penalty.issuerName || penalty.createdByName,
        approvedAt: penalty.approvedAt,
        approvedBy: approver?.fullName || penalty.approvedByName,
        // Trạng thái
        status: penalty.status ? statusMap[penalty.status] || penalty.status : undefined,
        penaltyType: penalty.penaltyTypeName || (penalty.type ? typeMap[penalty.type] || penalty.type : undefined),
        // Chi nhánh
        location: branch ? {
            name: branch.name,
            address: branch.address,
            province: branch.province
        } : penalty.branchName ? {
            name: penalty.branchName
        } : undefined,
        // Nhân viên bị phạt
        employeeName: employee?.fullName || penalty.employeeName,
        employeeCode: employee?.id || penalty.employeeCode,
        department: employee?.department || penalty.employeeDepartment,
        employeePosition: employee?.jobTitle || penalty.employeePosition,
        // Nội dung phạt
        amount: penalty.amount,
        reason: penalty.reason,
        violationDescription: penalty.description,
        note: penalty.note
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
"[project]/lib/print-mappers/leave.mapper.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "mapLeaveToPrintData",
    ()=>mapLeaveToPrintData
]);
/**
 * Leave Mapper - Đơn nghỉ phép
 * Đồng bộ với variables/don-nghi-phep.ts
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$mappers$2f$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/lib/print-mappers/types.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/print-service.ts [app-client] (ecmascript)");
;
function mapLeaveToPrintData(leave, storeSettings) {
    return {
        ...(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getStoreData"])(storeSettings),
        // === THÔNG TIN CHI NHÁNH ===
        '{location_name}': leave.location?.name || storeSettings.name || '',
        '{location_address}': leave.location?.address || storeSettings.address || '',
        '{location_province}': leave.location?.province || '',
        '{location_phone}': leave.location?.phone || storeSettings.phone || '',
        '{store_province}': storeSettings.province || '',
        // === THÔNG TIN ĐƠN NGHỈ PHÉP ===
        '{leave_code}': leave.code,
        '{created_on}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatDate"])(leave.createdAt || leave.requestDate),
        '{created_on_time}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatTime"])(leave.createdAt),
        '{request_date}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatDate"])(leave.requestDate),
        '{account_name}': leave.createdBy || '',
        // === THÔNG TIN NHÂN VIÊN ===
        '{employee_name}': leave.employeeName,
        '{employee_code}': leave.employeeCode || '',
        '{employee_phone}': leave.employeePhone || '',
        '{employee_email}': leave.employeeEmail || '',
        '{employee_position}': leave.employeePosition || '',
        '{position_name}': leave.employeePosition || '',
        '{department_name}': leave.department || '',
        '{department}': leave.department || '',
        // === THÔNG TIN NGHỈ PHÉP ===
        '{leave_type}': leave.leaveTypeName,
        '{leave_type_name}': leave.leaveTypeName,
        '{leave_paid}': leave.leaveTypeIsPaid ? 'Có lương' : 'Không lương',
        '{start_date}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatDate"])(leave.startDate),
        '{end_date}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatDate"])(leave.endDate),
        '{date_range}': `${(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatDate"])(leave.startDate)} - ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatDate"])(leave.endDate)}`,
        '{number_of_days}': String(leave.numberOfDays),
        '{reason}': leave.reason,
        // === TRẠNG THÁI ===
        '{status}': leave.status || '',
        '{approved_by}': leave.approvedBy || '',
        '{approved_date}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatDate"])(leave.approvedAt),
        '{rejected_by}': leave.rejectedBy || '',
        '{rejected_date}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatDate"])(leave.rejectedAt),
        '{rejection_reason}': leave.rejectionReason || '',
        // === GHI CHÚ ===
        '{note}': leave.note || ''
    };
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/print/leave-print-helper.ts [app-client] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

/**
 * Leave Print Helper
 * Helpers để chuẩn bị dữ liệu in cho đơn nghỉ phép
 */ __turbopack_context__.s([
    "convertLeaveForPrint",
    ()=>convertLeaveForPrint,
    "createStoreSettings",
    ()=>createStoreSettings
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$mappers$2f$leave$2e$mapper$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/print-mappers/leave.mapper.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/print-service.ts [app-client] (ecmascript)");
;
;
function convertLeaveForPrint(leave, options = {}) {
    const { branch, employee, creator, approver } = options;
    return {
        // Thông tin cơ bản
        code: leave.id,
        createdAt: leave.createdAt,
        requestDate: leave.requestDate,
        createdBy: creator?.fullName || leave.createdByName,
        // Chi nhánh
        location: branch ? {
            name: branch.name,
            address: branch.address,
            province: branch.province
        } : leave.branchName ? {
            name: leave.branchName
        } : undefined,
        // Nhân viên
        employeeName: employee?.fullName || leave.employeeName,
        employeeCode: employee?.id || leave.employeeId || leave.employeeCode,
        department: employee?.department || leave.employeeDepartment,
        employeePosition: employee?.jobTitle || leave.employeePosition,
        // Thông tin nghỉ phép
        leaveTypeName: leave.leaveTypeName,
        leaveTypeIsPaid: leave.leaveTypeIsPaid,
        startDate: leave.startDate,
        endDate: leave.endDate,
        numberOfDays: leave.numberOfDays,
        reason: leave.reason,
        // Trạng thái
        status: leave.status,
        approvedBy: approver?.fullName || leave.approvedByName,
        approvedAt: leave.approvedAt,
        rejectedBy: leave.rejectedByName,
        rejectedAt: leave.rejectedAt,
        rejectionReason: leave.rejectionReason,
        note: leave.note
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
"[project]/lib/active-timer-sync.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Active Timer Sync Utilities
 * 
 * Sync active timer with database as source of truth
 * Uses in-memory cache for fast synchronous access
 * 
 * NOTE: localStorage has been removed - all data comes from API/database
 */ __turbopack_context__.s([
    "getActiveTimerSync",
    ()=>getActiveTimerSync,
    "loadActiveTimer",
    ()=>loadActiveTimer,
    "removeActiveTimer",
    ()=>removeActiveTimer,
    "saveActiveTimer",
    ()=>saveActiveTimer
]);
// In-memory cache for fast synchronous access
let timerCache = null;
async function saveActiveTimer(userId, taskId, startedAt, description) {
    // Update in-memory cache
    timerCache = {
        taskId,
        startedAt,
        description
    };
    // Save to database for persistence
    try {
        const res = await fetch('/api/active-timer', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                userId,
                taskId,
                startTime: startedAt,
                description
            })
        });
        return res.ok;
    } catch (error) {
        console.error('Failed to save active timer to database:', error);
        return false;
    }
}
async function removeActiveTimer(userId) {
    // Clear in-memory cache
    timerCache = null;
    // Remove from database
    try {
        const res = await fetch(`/api/active-timer?userId=${userId}`, {
            method: 'DELETE'
        });
        return res.ok;
    } catch (error) {
        console.error('Failed to remove active timer from database:', error);
        return false;
    }
}
async function loadActiveTimer(userId) {
    // Return from cache if available
    if (timerCache) {
        return timerCache;
    }
    // Fetch from database
    try {
        const res = await fetch(`/api/active-timer?userId=${userId}`);
        if (res.ok) {
            const data = await res.json();
            if (data?.taskId && data?.startTime) {
                const timerData = {
                    taskId: data.taskId,
                    startedAt: data.startTime,
                    description: data.description
                };
                // Update cache
                timerCache = timerData;
                return timerData;
            }
        }
    } catch (error) {
        console.error('Failed to load active timer from database:', error);
    }
    return null;
}
function getActiveTimerSync() {
    return timerCache;
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/security-utils.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Security utilities for handling sensitive data
 * 
 * ⚠️ IMPORTANT: These are CLIENT-SIDE utilities for basic protection.
 * Real password hashing MUST be done on the server with bcrypt/argon2.
 * These functions are for:
 * 1. Preventing plain-text storage in localStorage during development
 * 2. Adding a layer of obfuscation until backend is implemented
 */ /**
 * Simple hash for client-side obfuscation (NOT cryptographically secure)
 * Should be replaced with server-side bcrypt when backend is ready
 */ __turbopack_context__.s([
    "checkRateLimit",
    ()=>checkRateLimit,
    "hashPassword",
    ()=>hashPassword,
    "isPasswordHashed",
    ()=>isPasswordHashed,
    "isValidEmail",
    ()=>isValidEmail,
    "resetRateLimit",
    ()=>resetRateLimit,
    "sanitizeInput",
    ()=>sanitizeInput,
    "sanitizeObject",
    ()=>sanitizeObject,
    "validatePasswordStrength",
    ()=>validatePasswordStrength,
    "verifyPassword",
    ()=>verifyPassword
]);
async function hashPassword(password) {
    // Use SubtleCrypto for SHA-256 hash
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map((b)=>b.toString(16).padStart(2, '0')).join('');
    // Prefix to indicate this is a hashed password
    return `sha256:${hashHex}`;
}
function isPasswordHashed(value) {
    return value.startsWith('sha256:') || value.startsWith('$2b$'); // SHA-256 or bcrypt
}
async function verifyPassword(password, storedHash) {
    if (!isPasswordHashed(storedHash)) {
        // Legacy plain text - compare directly (for migration)
        return password === storedHash;
    }
    if (storedHash.startsWith('sha256:')) {
        const hashedInput = await hashPassword(password);
        return hashedInput === storedHash;
    }
    // bcrypt would need to be verified server-side
    return false;
}
function sanitizeInput(input) {
    if (!input) return '';
    return input.replace(/[<>]/g, '') // Remove < > to prevent HTML injection
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+=/gi, '') // Remove event handlers like onclick=
    .trim();
}
function sanitizeObject(obj) {
    const result = {};
    for (const [key, value] of Object.entries(obj)){
        if (typeof value === 'string') {
            result[key] = sanitizeInput(value);
        } else if (value && typeof value === 'object' && !Array.isArray(value)) {
            result[key] = sanitizeObject(value);
        } else if (Array.isArray(value)) {
            result[key] = value.map((item)=>typeof item === 'string' ? sanitizeInput(item) : typeof item === 'object' && item !== null ? sanitizeObject(item) : item);
        } else {
            result[key] = value;
        }
    }
    return result;
}
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}
function validatePasswordStrength(password) {
    const errors = [];
    if (password.length < 6) {
        errors.push('Mật khẩu phải có ít nhất 6 ký tự');
    }
    if (password.length > 128) {
        errors.push('Mật khẩu không được quá 128 ký tự');
    }
    // Optional: Add more strength checks
    // if (!/[A-Z]/.test(password)) {
    //   errors.push('Mật khẩu cần có ít nhất 1 chữ in hoa');
    // }
    // if (!/[0-9]/.test(password)) {
    //   errors.push('Mật khẩu cần có ít nhất 1 số');
    // }
    return {
        isValid: errors.length === 0,
        errors
    };
}
/**
 * Rate limiting helper (for future use with API calls)
 * Stores attempt counts in memory
 */ const rateLimitStore = new Map();
function checkRateLimit(key, maxAttempts = 5, windowMs = 60000) {
    const now = Date.now();
    const entry = rateLimitStore.get(key);
    if (!entry || now > entry.resetTime) {
        // First attempt or window expired
        rateLimitStore.set(key, {
            count: 1,
            resetTime: now + windowMs
        });
        return {
            allowed: true,
            remainingAttempts: maxAttempts - 1,
            resetTime: now + windowMs
        };
    }
    if (entry.count >= maxAttempts) {
        return {
            allowed: false,
            remainingAttempts: 0,
            resetTime: entry.resetTime
        };
    }
    entry.count++;
    return {
        allowed: true,
        remainingAttempts: maxAttempts - entry.count,
        resetTime: entry.resetTime
    };
}
function resetRateLimit(key) {
    rateLimitStore.delete(key);
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=lib_2f74326b._.js.map