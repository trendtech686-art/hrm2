(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
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
]);

//# sourceMappingURL=_b6d594a8._.js.map