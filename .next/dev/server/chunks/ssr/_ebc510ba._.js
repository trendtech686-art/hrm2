module.exports = [
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
const SYSTEM_FALLBACK_ID = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createSystemId"])('SYS000000');
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
                let finalItem = {
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
    } catch (e) {}
    return null;
}
function getStoreLogo(storeInfoLogo) {
    if (storeInfoLogo) return storeInfoLogo;
    try {
        const settings = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$settings$2d$cache$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getGeneralSettingsSync"])();
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
"[project]/lib/print-mappers/attendance.mapper.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
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
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$mappers$2f$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/lib/print-mappers/types.ts [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/print-service.ts [app-ssr] (ecmascript)");
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
        ...(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getStoreData"])(storeSettings),
        // === THÔNG TIN BẢNG CHẤM CÔNG ===
        '{month_year}': `${month}/${year}`,
        '{month}': String(month),
        '{year}': String(year),
        '{department_name}': sheet.departmentName || 'Tất cả phòng ban',
        '{is_locked}': sheet.isLocked ? 'Đã khóa' : 'Đang mở',
        '{created_on}': (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatDate"])(sheet.createdAt),
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
        ...(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getStoreData"])(storeSettings),
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
}),
"[project]/lib/print/attendance-print-helper.ts [app-ssr] (ecmascript) <locals>", ((__turbopack_context__) => {
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
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$mappers$2f$attendance$2e$mapper$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/print-mappers/attendance.mapper.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/print-service.ts [app-ssr] (ecmascript)");
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
    const generalSettings = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getGeneralSettings"])();
    return {
        name: storeInfo?.companyName || storeInfo?.brandName || generalSettings?.companyName || '',
        address: storeInfo?.headquartersAddress || generalSettings?.companyAddress || '',
        phone: storeInfo?.hotline || generalSettings?.phoneNumber || '',
        email: storeInfo?.email || generalSettings?.email || '',
        website: storeInfo?.website,
        taxCode: storeInfo?.taxCode,
        province: storeInfo?.province,
        logo: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getStoreLogo"])(storeInfo?.logo)
    };
}
;
}),
"[project]/repositories/in-memory-repository.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
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
}),
"[project]/hooks/use-debounce.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useDebounce",
    ()=>useDebounce
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
;
function useDebounce(value, delay) {
    const [debouncedValue, setDebouncedValue] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"](value);
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"](()=>{
        const handler = setTimeout(()=>{
            setDebouncedValue(value);
        }, delay);
        return ()=>{
            clearTimeout(handler);
        };
    }, [
        value,
        delay
    ]);
    return debouncedValue;
}
}),
"[project]/app/(authenticated)/attendance/page.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$attendance$2f$page$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/attendance/page.tsx [app-ssr] (ecmascript)");
"use client";
;
const __TURBOPACK__default__export__ = __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$attendance$2f$page$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AttendancePage"];
}),
];

//# sourceMappingURL=_ebc510ba._.js.map