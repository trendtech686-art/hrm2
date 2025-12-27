(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/hooks/use-column-visibility.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__,
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
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature(), _s2 = __turbopack_context__.k.signature();
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
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
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
"[project]/app/(authenticated)/customers/page.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$customers$2f$page$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/customers/page.tsx [app-client] (ecmascript)");
"use client";
;
const __TURBOPACK__default__export__ = __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$customers$2f$page$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CustomersPage"];
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=_61e84f0a._.js.map