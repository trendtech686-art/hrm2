module.exports = [
"[project]/hooks/use-column-visibility.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
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
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$contexts$2f$auth$2d$context$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/contexts/auth-context.tsx [app-ssr] (ecmascript)");
;
;
const API_BASE = '/api/user-preferences';
// Debounce delay for saving preferences (ms)
const SAVE_DEBOUNCE_DELAY = 1000;
function useColumnVisibility(tableName, defaultVisibility = {}) {
    const { user } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$contexts$2f$auth$2d$context$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useAuth"])();
    const [visibility, setVisibility] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(defaultVisibility);
    const [isLoading, setIsLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(true);
    const saveTimeoutRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const lastSavedRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])('');
    const storageKey = `${tableName}-column-visibility`;
    // Load from database
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        const loadVisibility = async ()=>{
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
        };
        loadVisibility();
    }, [
        user?.systemId,
        storageKey,
        tableName
    ]);
    // Cleanup timeout on unmount
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        return ()=>{
            if (saveTimeoutRef.current) {
                clearTimeout(saveTimeoutRef.current);
            }
        };
    }, []);
    // Update visibility - save to database with debounce
    const updateVisibility = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((newVisibility)=>{
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
            saveTimeoutRef.current = setTimeout(()=>{
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
                }).catch((error)=>{
                    console.error(`Error saving column visibility for ${tableName}:`, error);
                });
            }, SAVE_DEBOUNCE_DELAY);
        }
    }, [
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
function useColumnOrder(tableName, defaultOrder = []) {
    const { user } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$contexts$2f$auth$2d$context$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useAuth"])();
    const [order, setOrder] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(defaultOrder);
    const [isLoading, setIsLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(true);
    const saveTimeoutRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const lastSavedRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])('');
    const storageKey = `${tableName}-column-order`;
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        const loadOrder = async ()=>{
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
        };
        loadOrder();
    }, [
        user?.systemId,
        storageKey,
        tableName
    ]);
    // Cleanup timeout on unmount
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        return ()=>{
            if (saveTimeoutRef.current) {
                clearTimeout(saveTimeoutRef.current);
            }
        };
    }, []);
    const updateOrder = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((newOrder)=>{
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
            saveTimeoutRef.current = setTimeout(()=>{
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
                }).catch((error)=>{
                    console.error(`Error saving column order for ${tableName}:`, error);
                });
            }, SAVE_DEBOUNCE_DELAY);
        }
    }, [
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
function usePinnedColumns(tableName, defaultPinned = []) {
    const { user } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$contexts$2f$auth$2d$context$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useAuth"])();
    const [pinned, setPinned] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(defaultPinned);
    const [isLoading, setIsLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(true);
    const saveTimeoutRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const lastSavedRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])('');
    const storageKey = `${tableName}-column-pinned`;
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        const loadPinned = async ()=>{
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
        };
        loadPinned();
    }, [
        user?.systemId,
        storageKey,
        tableName
    ]);
    // Cleanup timeout on unmount
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        return ()=>{
            if (saveTimeoutRef.current) {
                clearTimeout(saveTimeoutRef.current);
            }
        };
    }, []);
    const updatePinned = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((newPinned)=>{
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
            saveTimeoutRef.current = setTimeout(()=>{
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
                }).catch((error)=>{
                    console.error(`Error saving pinned columns for ${tableName}:`, error);
                });
            }, SAVE_DEBOUNCE_DELAY);
        }
    }, [
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
const __TURBOPACK__default__export__ = useColumnVisibility;
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
"[project]/app/(authenticated)/orders/page.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$orders$2f$page$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/orders/page.tsx [app-ssr] (ecmascript)");
"use client";
;
const __TURBOPACK__default__export__ = __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$orders$2f$page$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["OrdersPage"];
}),
];

//# sourceMappingURL=_87412f07._.js.map