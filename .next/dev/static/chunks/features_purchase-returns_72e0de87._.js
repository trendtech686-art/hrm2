(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/features/purchase-returns/api/purchase-returns-api.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Purchase Returns (Phiếu Hoàn Trả NCC) API functions
 * 
 * ⚠️ Direct import: import { fetchPurchaseReturns } from '@/features/purchase-returns/api/purchase-returns-api'
 */ __turbopack_context__.s([
    "createPurchaseReturn",
    ()=>createPurchaseReturn,
    "deletePurchaseReturn",
    ()=>deletePurchaseReturn,
    "fetchPurchaseReturn",
    ()=>fetchPurchaseReturn,
    "fetchPurchaseReturnStats",
    ()=>fetchPurchaseReturnStats,
    "fetchPurchaseReturns",
    ()=>fetchPurchaseReturns,
    "updatePurchaseReturn",
    ()=>updatePurchaseReturn
]);
const BASE_URL = '/api/purchase-returns';
async function fetchPurchaseReturns(params = {}) {
    const searchParams = new URLSearchParams();
    if (params.page) searchParams.set('page', String(params.page));
    if (params.limit) searchParams.set('limit', String(params.limit));
    if (params.search) searchParams.set('search', params.search);
    if (params.supplierId) searchParams.set('supplierId', params.supplierId);
    if (params.purchaseOrderId) searchParams.set('purchaseOrderId', params.purchaseOrderId);
    if (params.branchId) searchParams.set('branchId', params.branchId);
    if (params.startDate) searchParams.set('startDate', params.startDate);
    if (params.endDate) searchParams.set('endDate', params.endDate);
    if (params.sortBy) searchParams.set('sortBy', params.sortBy);
    if (params.sortOrder) searchParams.set('sortOrder', params.sortOrder);
    const url = searchParams.toString() ? `${BASE_URL}?${searchParams}` : BASE_URL;
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`Failed to fetch purchase returns: ${response.statusText}`);
    }
    return response.json();
}
async function fetchPurchaseReturn(systemId) {
    const response = await fetch(`${BASE_URL}/${systemId}`);
    if (!response.ok) {
        throw new Error(`Failed to fetch purchase return: ${response.statusText}`);
    }
    return response.json();
}
async function createPurchaseReturn(data) {
    const response = await fetch(BASE_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });
    if (!response.ok) {
        const error = await response.json().catch(()=>({}));
        throw new Error(error.message || 'Failed to create purchase return');
    }
    return response.json();
}
async function updatePurchaseReturn(systemId, data) {
    const response = await fetch(`${BASE_URL}/${systemId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });
    if (!response.ok) {
        const error = await response.json().catch(()=>({}));
        throw new Error(error.message || 'Failed to update purchase return');
    }
    return response.json();
}
async function deletePurchaseReturn(systemId) {
    const response = await fetch(`${BASE_URL}/${systemId}`, {
        method: 'DELETE'
    });
    if (!response.ok) {
        throw new Error(`Failed to delete purchase return: ${response.statusText}`);
    }
}
async function fetchPurchaseReturnStats() {
    const response = await fetch(`${BASE_URL}/stats`);
    if (!response.ok) {
        throw new Error(`Failed to fetch purchase return stats: ${response.statusText}`);
    }
    return response.json();
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/features/purchase-returns/hooks/use-purchase-returns.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "purchaseReturnKeys",
    ()=>purchaseReturnKeys,
    "usePurchaseReturn",
    ()=>usePurchaseReturn,
    "usePurchaseReturnMutations",
    ()=>usePurchaseReturnMutations,
    "usePurchaseReturnStats",
    ()=>usePurchaseReturnStats,
    "usePurchaseReturns",
    ()=>usePurchaseReturns,
    "usePurchaseReturnsByPO",
    ()=>usePurchaseReturnsByPO,
    "usePurchaseReturnsBySupplier",
    ()=>usePurchaseReturnsBySupplier
]);
/**
 * usePurchaseReturns - React Query hooks (Phiếu Hoàn Trả NCC)
 * 
 * ⚠️ Direct import: import { usePurchaseReturns } from '@/features/purchase-returns/hooks/use-purchase-returns'
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@tanstack/react-query/build/modern/useQuery.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@tanstack/react-query/build/modern/useMutation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@tanstack/react-query/build/modern/QueryClientProvider.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@tanstack/query-core/build/modern/utils.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/id-types.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$purchase$2d$returns$2f$api$2f$purchase$2d$returns$2d$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/purchase-returns/api/purchase-returns-api.ts [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature(), _s2 = __turbopack_context__.k.signature(), _s3 = __turbopack_context__.k.signature(), _s4 = __turbopack_context__.k.signature(), _s5 = __turbopack_context__.k.signature();
;
;
;
const purchaseReturnKeys = {
    all: [
        'purchase-returns'
    ],
    lists: ()=>[
            ...purchaseReturnKeys.all,
            'list'
        ],
    list: (params)=>[
            ...purchaseReturnKeys.lists(),
            params
        ],
    details: ()=>[
            ...purchaseReturnKeys.all,
            'detail'
        ],
    detail: (id)=>[
            ...purchaseReturnKeys.details(),
            id
        ],
    stats: ()=>[
            ...purchaseReturnKeys.all,
            'stats'
        ]
};
function usePurchaseReturns(params = {}) {
    _s();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"])({
        queryKey: purchaseReturnKeys.list(params),
        queryFn: {
            "usePurchaseReturns.useQuery": ()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$purchase$2d$returns$2f$api$2f$purchase$2d$returns$2d$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["fetchPurchaseReturns"])(params)
        }["usePurchaseReturns.useQuery"],
        staleTime: 30_000,
        gcTime: 5 * 60 * 1000,
        placeholderData: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["keepPreviousData"]
    });
}
_s(usePurchaseReturns, "4ZpngI1uv+Uo3WQHEZmTQ5FNM+k=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"]
    ];
});
function usePurchaseReturn(id) {
    _s1();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"])({
        queryKey: purchaseReturnKeys.detail(id),
        queryFn: {
            "usePurchaseReturn.useQuery": ()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$purchase$2d$returns$2f$api$2f$purchase$2d$returns$2d$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["fetchPurchaseReturn"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])(id))
        }["usePurchaseReturn.useQuery"],
        enabled: !!id,
        staleTime: 60_000
    });
}
_s1(usePurchaseReturn, "4ZpngI1uv+Uo3WQHEZmTQ5FNM+k=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"]
    ];
});
function usePurchaseReturnStats() {
    _s2();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"])({
        queryKey: purchaseReturnKeys.stats(),
        queryFn: __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$purchase$2d$returns$2f$api$2f$purchase$2d$returns$2d$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["fetchPurchaseReturnStats"],
        staleTime: 60_000
    });
}
_s2(usePurchaseReturnStats, "4ZpngI1uv+Uo3WQHEZmTQ5FNM+k=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"]
    ];
});
function usePurchaseReturnMutations(options = {}) {
    _s3();
    const queryClient = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQueryClient"])();
    const create = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"])({
        mutationFn: __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$purchase$2d$returns$2f$api$2f$purchase$2d$returns$2d$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createPurchaseReturn"],
        onSuccess: {
            "usePurchaseReturnMutations.useMutation[create]": (data)=>{
                queryClient.invalidateQueries({
                    queryKey: purchaseReturnKeys.lists()
                });
                queryClient.invalidateQueries({
                    queryKey: purchaseReturnKeys.stats()
                });
                options.onCreateSuccess?.(data);
            }
        }["usePurchaseReturnMutations.useMutation[create]"],
        onError: options.onError
    });
    const update = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"])({
        mutationFn: {
            "usePurchaseReturnMutations.useMutation[update]": ({ systemId, data })=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$purchase$2d$returns$2f$api$2f$purchase$2d$returns$2d$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["updatePurchaseReturn"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])(systemId), data)
        }["usePurchaseReturnMutations.useMutation[update]"],
        onSuccess: {
            "usePurchaseReturnMutations.useMutation[update]": (data, variables)=>{
                queryClient.invalidateQueries({
                    queryKey: purchaseReturnKeys.detail(variables.systemId)
                });
                queryClient.invalidateQueries({
                    queryKey: purchaseReturnKeys.lists()
                });
                queryClient.invalidateQueries({
                    queryKey: purchaseReturnKeys.stats()
                });
                options.onUpdateSuccess?.(data);
            }
        }["usePurchaseReturnMutations.useMutation[update]"],
        onError: options.onError
    });
    const remove = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"])({
        mutationFn: {
            "usePurchaseReturnMutations.useMutation[remove]": (systemId)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$purchase$2d$returns$2f$api$2f$purchase$2d$returns$2d$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["deletePurchaseReturn"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])(systemId))
        }["usePurchaseReturnMutations.useMutation[remove]"],
        onSuccess: {
            "usePurchaseReturnMutations.useMutation[remove]": ()=>{
                queryClient.invalidateQueries({
                    queryKey: purchaseReturnKeys.all
                });
                options.onDeleteSuccess?.();
            }
        }["usePurchaseReturnMutations.useMutation[remove]"],
        onError: options.onError
    });
    return {
        create,
        update,
        remove
    };
}
_s3(usePurchaseReturnMutations, "JxOfJjdyCQxYamNcDrzBiezg78E=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQueryClient"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"]
    ];
});
function usePurchaseReturnsBySupplier(supplierId) {
    _s4();
    return usePurchaseReturns({
        supplierId: supplierId || undefined,
        limit: 50
    });
}
_s4(usePurchaseReturnsBySupplier, "WcZLIXYj2D9ecMYbyNxFdtJlhO0=", false, function() {
    return [
        usePurchaseReturns
    ];
});
function usePurchaseReturnsByPO(purchaseOrderId) {
    _s5();
    return usePurchaseReturns({
        purchaseOrderId: purchaseOrderId || undefined,
        limit: 20
    });
}
_s5(usePurchaseReturnsByPO, "WcZLIXYj2D9ecMYbyNxFdtJlhO0=", false, function() {
    return [
        usePurchaseReturns
    ];
});
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/features/purchase-returns/hooks/use-all-purchase-returns.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useAllPurchaseReturns",
    ()=>useAllPurchaseReturns,
    "usePurchaseReturnFinder",
    ()=>usePurchaseReturnFinder,
    "usePurchaseReturnsBySupplier",
    ()=>usePurchaseReturnsBySupplier
]);
/**
 * useAllPurchaseReturns - Convenience hook for components needing all purchase returns as flat array
 * 
 * Replaces legacy usePurchaseReturnStore().data pattern
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$purchase$2d$returns$2f$hooks$2f$use$2d$purchase$2d$returns$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/purchase-returns/hooks/use-purchase-returns.ts [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature(), _s2 = __turbopack_context__.k.signature();
;
;
function useAllPurchaseReturns() {
    _s();
    const query = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$purchase$2d$returns$2f$hooks$2f$use$2d$purchase$2d$returns$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePurchaseReturns"])({
        limit: 500
    });
    return {
        data: query.data?.data || [],
        isLoading: query.isLoading,
        isError: query.isError,
        error: query.error
    };
}
_s(useAllPurchaseReturns, "cUm+yRpLWmJEI4rszUO0lL77c1I=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$purchase$2d$returns$2f$hooks$2f$use$2d$purchase$2d$returns$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePurchaseReturns"]
    ];
});
function usePurchaseReturnFinder() {
    _s1();
    const { data } = useAllPurchaseReturns();
    const findById = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"]({
        "usePurchaseReturnFinder.useCallback[findById]": (systemId)=>{
            if (!systemId) return undefined;
            return data.find({
                "usePurchaseReturnFinder.useCallback[findById]": (pr)=>pr.systemId === systemId
            }["usePurchaseReturnFinder.useCallback[findById]"]);
        }
    }["usePurchaseReturnFinder.useCallback[findById]"], [
        data
    ]);
    return {
        findById
    };
}
_s1(usePurchaseReturnFinder, "cGNmrGShxsyTbsLroI4yHpDAu6Y=", false, function() {
    return [
        useAllPurchaseReturns
    ];
});
function usePurchaseReturnsBySupplier(supplierSystemId) {
    _s2();
    const { data, isLoading } = useAllPurchaseReturns();
    const filtered = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"]({
        "usePurchaseReturnsBySupplier.useMemo[filtered]": ()=>supplierSystemId ? data.filter({
                "usePurchaseReturnsBySupplier.useMemo[filtered]": (pr)=>pr.supplierSystemId === supplierSystemId
            }["usePurchaseReturnsBySupplier.useMemo[filtered]"]) : []
    }["usePurchaseReturnsBySupplier.useMemo[filtered]"], [
        data,
        supplierSystemId
    ]);
    return {
        data: filtered,
        isLoading
    };
}
_s2(usePurchaseReturnsBySupplier, "czFd1ACc6ooBH+FXqvLz56L8GhY=", false, function() {
    return [
        useAllPurchaseReturns
    ];
});
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/features/purchase-returns/page.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "PurchaseReturnsPage",
    ()=>PurchaseReturnsPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$router$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/router.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/date-utils.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$purchase$2d$returns$2f$hooks$2f$use$2d$all$2d$purchase$2d$returns$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/purchase-returns/hooks/use-all-purchase-returns.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$purchase$2d$orders$2f$hooks$2f$use$2d$all$2d$purchase$2d$orders$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/purchase-orders/hooks/use-all-purchase-orders.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$branches$2f$hooks$2f$use$2d$all$2d$branches$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/settings/branches/hooks/use-all-branches.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$store$2d$info$2f$hooks$2f$use$2d$store$2d$info$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/settings/store-info/hooks/use-store-info.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$contexts$2f$page$2d$header$2d$context$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/contexts/page-header-context.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$use$2d$print$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/use-print.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2f$supplier$2d$return$2d$print$2d$helper$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/lib/print/supplier-return-print-helper.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$mappers$2f$supplier$2d$return$2e$mapper$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/print-mappers/supplier-return.mapper.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$data$2d$table$2f$responsive$2d$data$2d$table$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/data-table/responsive-data-table.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$data$2d$table$2f$data$2d$table$2d$date$2d$filter$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/data-table/data-table-date-filter.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$layout$2f$page$2d$filters$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/layout/page-filters.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$layout$2f$page$2d$toolbar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/layout/page-toolbar.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/card.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/select.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/button.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$avatar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/avatar.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$use$2d$media$2d$query$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/use-media-query.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$package$2d$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__PackageX$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/package-x.js [app-client] (ecmascript) <export default as PackageX>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$building$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Building2$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/building-2.js [app-client] (ecmascript) <export default as Building2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$user$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__User$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/user.js [app-client] (ecmascript) <export default as User>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$text$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__FileText$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/file-text.js [app-client] (ecmascript) <export default as FileText>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/plus.js [app-client] (ecmascript) <export default as Plus>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$printer$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Printer$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/printer.js [app-client] (ecmascript) <export default as Printer>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$download$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Download$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/download.js [app-client] (ecmascript) <export default as Download>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$fuse$2e$js$2f$dist$2f$fuse$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/fuse.js/dist/fuse.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$checkbox$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/checkbox.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/sonner/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$shared$2f$simple$2d$print$2d$options$2d$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/shared/simple-print-options-dialog.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$shared$2f$generic$2d$export$2d$dialog$2d$v2$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/shared/generic-export-dialog-v2.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$import$2d$export$2f$configs$2f$purchase$2d$return$2e$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/import-export/configs/purchase-return.config.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$contexts$2f$auth$2d$context$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/contexts/auth-context.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/id-types.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$use$2d$column$2d$visibility$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/hooks/use-column-visibility.ts [app-client] (ecmascript)");
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
const formatCurrency = (value)=>{
    if (typeof value !== 'number' || isNaN(value)) return '0 ₫';
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
    }).format(value);
};
const getColumns = (onPrint)=>[
        {
            id: "select",
            header: ({ isAllPageRowsSelected, isSomePageRowsSelected, onToggleAll })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex items-center justify-center",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$checkbox$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Checkbox"], {
                        checked: isAllPageRowsSelected ? true : isSomePageRowsSelected ? "indeterminate" : false,
                        onCheckedChange: (value)=>onToggleAll?.(!!value),
                        "aria-label": "Chọn tất cả"
                    }, void 0, false, {
                        fileName: "[project]/features/purchase-returns/page.tsx",
                        lineNumber: 51,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0))
                }, void 0, false, {
                    fileName: "[project]/features/purchase-returns/page.tsx",
                    lineNumber: 50,
                    columnNumber: 7
                }, ("TURBOPACK compile-time value", void 0)),
            cell: ({ isSelected, onToggleSelect })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex items-center justify-center",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$checkbox$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Checkbox"], {
                        checked: isSelected,
                        onCheckedChange: onToggleSelect,
                        "aria-label": "Chọn dòng"
                    }, void 0, false, {
                        fileName: "[project]/features/purchase-returns/page.tsx",
                        lineNumber: 60,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0))
                }, void 0, false, {
                    fileName: "[project]/features/purchase-returns/page.tsx",
                    lineNumber: 59,
                    columnNumber: 7
                }, ("TURBOPACK compile-time value", void 0)),
            size: 48,
            meta: {
                displayName: "Chọn",
                sticky: "left"
            }
        },
        {
            id: 'id',
            accessorKey: 'id',
            header: 'Mã phiếu trả',
            cell: ({ row })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                    className: "text-body-sm font-medium text-primary hover:underline",
                    onClick: (e)=>{
                        e.stopPropagation();
                    // Navigate is handled by onRowClick
                    },
                    children: row.id
                }, void 0, false, {
                    fileName: "[project]/features/purchase-returns/page.tsx",
                    lineNumber: 78,
                    columnNumber: 7
                }, ("TURBOPACK compile-time value", void 0)),
            meta: {
                displayName: 'Mã phiếu trả'
            },
            size: 120
        },
        {
            id: 'returnDate',
            accessorKey: 'returnDate',
            header: 'Ngày trả',
            cell: ({ row })=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatDateCustom"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["parseDate"])(row.returnDate), 'dd/MM/yyyy'),
            meta: {
                displayName: 'Ngày trả'
            },
            size: 120
        },
        {
            id: 'purchaseOrderId',
            accessorKey: 'purchaseOrderId',
            header: 'Đơn nhập hàng',
            cell: ({ row })=>row.purchaseOrderId,
            meta: {
                displayName: 'Đơn nhập hàng'
            },
            size: 140
        },
        {
            id: 'supplierName',
            accessorKey: 'supplierName',
            header: 'Nhà cung cấp',
            cell: ({ row })=>row.supplierName,
            meta: {
                displayName: 'Nhà cung cấp'
            }
        },
        {
            id: 'branchName',
            accessorKey: 'branchName',
            header: 'Chi nhánh',
            cell: ({ row })=>row.branchName,
            meta: {
                displayName: 'Chi nhánh'
            },
            size: 150
        },
        {
            id: 'totalQuantity',
            header: 'Tổng SL',
            cell: ({ row })=>{
                const total = row.items.reduce((sum, item)=>sum + item.returnQuantity, 0);
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                    className: "text-body-sm font-medium",
                    children: total
                }, void 0, false, {
                    fileName: "[project]/features/purchase-returns/page.tsx",
                    lineNumber: 127,
                    columnNumber: 14
                }, ("TURBOPACK compile-time value", void 0));
            },
            meta: {
                displayName: 'Tổng SL'
            },
            size: 100
        },
        {
            id: 'totalReturnValue',
            accessorKey: 'totalReturnValue',
            header: 'Giá trị trả',
            cell: ({ row })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                    className: "text-body-sm font-semibold text-orange-600",
                    children: formatCurrency(row.totalReturnValue)
                }, void 0, false, {
                    fileName: "[project]/features/purchase-returns/page.tsx",
                    lineNumber: 137,
                    columnNumber: 7
                }, ("TURBOPACK compile-time value", void 0)),
            meta: {
                displayName: 'Giá trị trả'
            },
            size: 150
        },
        {
            id: 'refundAmount',
            accessorKey: 'refundAmount',
            header: 'Tiền hoàn',
            cell: ({ row })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                    className: "text-body-sm font-semibold text-green-600",
                    children: formatCurrency(row.refundAmount)
                }, void 0, false, {
                    fileName: "[project]/features/purchase-returns/page.tsx",
                    lineNumber: 149,
                    columnNumber: 7
                }, ("TURBOPACK compile-time value", void 0)),
            meta: {
                displayName: 'Tiền hoàn'
            },
            size: 150
        },
        {
            id: 'creatorName',
            accessorKey: 'creatorName',
            header: 'Người tạo',
            cell: ({ row })=>row.creatorName,
            meta: {
                displayName: 'Người tạo'
            },
            size: 150
        },
        {
            id: 'reason',
            accessorKey: 'reason',
            header: 'Lý do',
            cell: ({ row })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                    className: "text-body-xs max-w-xs line-clamp-2",
                    children: row.reason || '-'
                }, void 0, false, {
                    fileName: "[project]/features/purchase-returns/page.tsx",
                    lineNumber: 169,
                    columnNumber: 7
                }, ("TURBOPACK compile-time value", void 0)),
            meta: {
                displayName: 'Lý do'
            },
            size: 200
        },
        {
            id: 'refundMethod',
            accessorKey: 'refundMethod',
            header: 'Hình thức hoàn',
            cell: ({ row })=>row.refundMethod || '-',
            meta: {
                displayName: 'Hình thức hoàn'
            },
            size: 150
        },
        {
            id: 'itemsCount',
            header: 'Số mặt hàng',
            cell: ({ row })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                    className: "text-body-sm font-medium",
                    children: row.items.length
                }, void 0, false, {
                    fileName: "[project]/features/purchase-returns/page.tsx",
                    lineNumber: 188,
                    columnNumber: 7
                }, ("TURBOPACK compile-time value", void 0)),
            meta: {
                displayName: 'Số mặt hàng'
            },
            size: 120
        },
        {
            id: 'productNames',
            header: 'Sản phẩm',
            cell: ({ row })=>{
                const firstProduct = row.items[0]?.productName || '';
                const remaining = row.items.length - 1;
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                    className: "text-body-xs",
                    children: [
                        firstProduct,
                        remaining > 0 && ` +${remaining}`
                    ]
                }, void 0, true, {
                    fileName: "[project]/features/purchase-returns/page.tsx",
                    lineNumber: 200,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0));
            },
            meta: {
                displayName: 'Sản phẩm'
            },
            size: 200
        },
        {
            id: 'accountSystemId',
            accessorKey: 'accountSystemId',
            header: 'Tài khoản',
            cell: ({ row })=>row.accountSystemId || '-',
            meta: {
                displayName: 'Tài khoản'
            },
            size: 120
        },
        {
            id: 'actions',
            header: 'Hành động',
            cell: ({ row })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                    variant: "ghost",
                    size: "sm",
                    className: "h-9",
                    onClick: (e)=>{
                        e.stopPropagation();
                        onPrint(row);
                    },
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$printer$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Printer$3e$__["Printer"], {
                            className: "h-4 w-4 mr-1"
                        }, void 0, false, {
                            fileName: "[project]/features/purchase-returns/page.tsx",
                            lineNumber: 230,
                            columnNumber: 9
                        }, ("TURBOPACK compile-time value", void 0)),
                        "In"
                    ]
                }, void 0, true, {
                    fileName: "[project]/features/purchase-returns/page.tsx",
                    lineNumber: 221,
                    columnNumber: 7
                }, ("TURBOPACK compile-time value", void 0)),
            size: 120,
            meta: {
                displayName: 'Hành động',
                sticky: 'right'
            }
        }
    ];
function PurchaseReturnsPage() {
    _s();
    const { data: purchaseReturns = [] } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$purchase$2d$returns$2f$hooks$2f$use$2d$all$2d$purchase$2d$returns$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAllPurchaseReturns"])();
    const { data: allPurchaseOrders = [] } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$purchase$2d$orders$2f$hooks$2f$use$2d$all$2d$purchase$2d$orders$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAllPurchaseOrders"])();
    const { data: branches = [] } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$branches$2f$hooks$2f$use$2d$all$2d$branches$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAllBranches"])();
    const { data: storeInfo } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$store$2d$info$2f$hooks$2f$use$2d$store$2d$info$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useStoreInfo"])();
    const { print, printMultiple } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$use$2d$print$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePrint"])();
    const { employee: currentUser } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$contexts$2f$auth$2d$context$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuth"])();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const isMobile = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$use$2d$media$2d$query$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMediaQuery"])("(max-width: 768px)");
    // Print dialog state - using SimplePrintOptionsDialog like Orders page
    const [isPrintDialogOpen, setIsPrintDialogOpen] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"](false);
    const [pendingPrintReturns, setPendingPrintReturns] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"]([]);
    // Export dialog state
    const [exportDialogOpen, setExportDialogOpen] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"](false);
    const handleRowPrint = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"]({
        "PurchaseReturnsPage.useCallback[handleRowPrint]": (entry)=>{
            // In ngay không cần xác nhận
            const storeSettings = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2f$supplier$2d$return$2d$print$2d$helper$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createStoreSettings"])(storeInfo);
            const branch = branches.find({
                "PurchaseReturnsPage.useCallback[handleRowPrint].branch": (b)=>b.systemId === entry.branchSystemId
            }["PurchaseReturnsPage.useCallback[handleRowPrint].branch"]);
            const forPrint = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2f$supplier$2d$return$2d$print$2d$helper$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["convertSupplierReturnForPrint"])(entry, {
                branch
            });
            print('supplier-return', {
                data: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$mappers$2f$supplier$2d$return$2e$mapper$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["mapSupplierReturnToPrintData"])(forPrint, storeSettings),
                lineItems: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$mappers$2f$supplier$2d$return$2e$mapper$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["mapSupplierReturnLineItems"])(forPrint.items)
            });
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].success('Đã gửi lệnh in', {
                description: `Đang in phiếu trả ${entry.id}.`
            });
        }
    }["PurchaseReturnsPage.useCallback[handleRowPrint]"], [
        branches,
        storeInfo,
        print
    ]);
    // Set page header
    const headerActions = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"]({
        "PurchaseReturnsPage.useMemo[headerActions]": ()=>[
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                    size: "sm",
                    className: "h-9",
                    onClick: {
                        "PurchaseReturnsPage.useMemo[headerActions]": ()=>router.push(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$router$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ROUTES"].PROCUREMENT.PURCHASE_RETURN_NEW)
                    }["PurchaseReturnsPage.useMemo[headerActions]"],
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__["Plus"], {
                            className: "mr-2 h-4 w-4"
                        }, void 0, false, {
                            fileName: "[project]/features/purchase-returns/page.tsx",
                            lineNumber: 283,
                            columnNumber: 7
                        }, this),
                        "Tạo phiếu trả hàng"
                    ]
                }, "create", true, {
                    fileName: "[project]/features/purchase-returns/page.tsx",
                    lineNumber: 277,
                    columnNumber: 5
                }, this)
            ]
    }["PurchaseReturnsPage.useMemo[headerActions]"], [
        router
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$contexts$2f$page$2d$header$2d$context$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePageHeader"])({
        title: 'Danh sách phiếu trả NCC',
        actions: headerActions,
        breadcrumb: [
            {
                label: 'Trang chủ',
                href: '/',
                isCurrent: false
            },
            {
                label: 'Trả hàng nhập',
                href: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$router$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ROUTES"].PROCUREMENT.PURCHASE_RETURNS,
                isCurrent: true
            }
        ],
        showBackButton: false
    });
    const [rowSelection, setRowSelection] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"]({});
    const [sorting, setSorting] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"]({
        id: 'createdAt',
        desc: true
    });
    const [globalFilter, setGlobalFilter] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"]('');
    const [debouncedGlobalFilter, setDebouncedGlobalFilter] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"]('');
    const [supplierFilter, setSupplierFilter] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"]('all');
    const [branchFilter, setBranchFilter] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"]('all');
    const [dateRange, setDateRange] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"]();
    const [pagination, setPagination] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"]({
        pageIndex: 0,
        pageSize: 20
    });
    // Get initial column visibility from columns
    const cols = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"]({
        "PurchaseReturnsPage.useMemo[cols]": ()=>getColumns({
                "PurchaseReturnsPage.useMemo[cols]": (_pr)=>undefined
            }["PurchaseReturnsPage.useMemo[cols]"])
    }["PurchaseReturnsPage.useMemo[cols]"], []);
    const defaultVisibility = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"]({
        "PurchaseReturnsPage.useMemo[defaultVisibility]": ()=>{
            const initial = {};
            cols.forEach({
                "PurchaseReturnsPage.useMemo[defaultVisibility]": (c)=>{
                    if (c.id) initial[c.id] = true;
                }
            }["PurchaseReturnsPage.useMemo[defaultVisibility]"]);
            return initial;
        }
    }["PurchaseReturnsPage.useMemo[defaultVisibility]"], [
        cols
    ]);
    // Use hook for column visibility (database-backed)
    const [columnVisibility, setColumnVisibility] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$use$2d$column$2d$visibility$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useColumnVisibility"])('purchase-returns', defaultVisibility);
    const [columnOrder, setColumnOrder] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"]([]);
    const [pinnedColumns, setPinnedColumns] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"]([]);
    const [expanded, setExpanded] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"]({});
    const [mobileLoadedCount, setMobileLoadedCount] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"](20);
    // Debounce search
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"]({
        "PurchaseReturnsPage.useEffect": ()=>{
            const timer = setTimeout({
                "PurchaseReturnsPage.useEffect.timer": ()=>{
                    setDebouncedGlobalFilter(globalFilter);
                }
            }["PurchaseReturnsPage.useEffect.timer"], 300);
            return ({
                "PurchaseReturnsPage.useEffect": ()=>clearTimeout(timer)
            })["PurchaseReturnsPage.useEffect"];
        }
    }["PurchaseReturnsPage.useEffect"], [
        globalFilter
    ]);
    const columns = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"]({
        "PurchaseReturnsPage.useMemo[columns]": ()=>getColumns(handleRowPrint)
    }["PurchaseReturnsPage.useMemo[columns]"], [
        handleRowPrint
    ]);
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"]({
        "PurchaseReturnsPage.useEffect": ()=>{
            const initialVisibility = {};
            columns.forEach({
                "PurchaseReturnsPage.useEffect": (c)=>{
                    initialVisibility[c.id] = true;
                }
            }["PurchaseReturnsPage.useEffect"]);
            setColumnVisibility(initialVisibility);
            setColumnOrder(columns.map({
                "PurchaseReturnsPage.useEffect": (c)=>c.id
            }["PurchaseReturnsPage.useEffect"]).filter(Boolean));
        }
    }["PurchaseReturnsPage.useEffect"], []);
    const fuse = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"]({
        "PurchaseReturnsPage.useMemo[fuse]": ()=>new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$fuse$2e$js$2f$dist$2f$fuse$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"](purchaseReturns, {
                keys: [
                    "id",
                    "supplierName",
                    "creatorName",
                    "purchaseOrderId",
                    "branchName"
                ],
                threshold: 0.3,
                ignoreLocation: true
            })
    }["PurchaseReturnsPage.useMemo[fuse]"], [
        purchaseReturns
    ]);
    // Reset mobile loaded count when filters change
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"]({
        "PurchaseReturnsPage.useEffect": ()=>{
            setMobileLoadedCount(20);
        }
    }["PurchaseReturnsPage.useEffect"], [
        debouncedGlobalFilter,
        supplierFilter,
        branchFilter,
        dateRange
    ]);
    // Mobile infinite scroll
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"]({
        "PurchaseReturnsPage.useEffect": ()=>{
            if (!isMobile) return;
            const handleScroll = {
                "PurchaseReturnsPage.useEffect.handleScroll": ()=>{
                    const scrollTop = window.scrollY || document.documentElement.scrollTop;
                    const scrollHeight = document.documentElement.scrollHeight;
                    const clientHeight = document.documentElement.clientHeight;
                    const filteredCount = filteredData.length;
                    if (scrollTop + clientHeight >= scrollHeight * 0.8 && mobileLoadedCount < filteredCount) {
                        setMobileLoadedCount({
                            "PurchaseReturnsPage.useEffect.handleScroll": (prev)=>Math.min(prev + 20, filteredCount)
                        }["PurchaseReturnsPage.useEffect.handleScroll"]);
                    }
                }
            }["PurchaseReturnsPage.useEffect.handleScroll"];
            window.addEventListener('scroll', handleScroll, {
                passive: true
            });
            return ({
                "PurchaseReturnsPage.useEffect": ()=>window.removeEventListener('scroll', handleScroll)
            })["PurchaseReturnsPage.useEffect"];
        }
    }["PurchaseReturnsPage.useEffect"], [
        isMobile,
        mobileLoadedCount
    ]);
    const filteredData = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"]({
        "PurchaseReturnsPage.useMemo[filteredData]": ()=>{
            let data = purchaseReturns;
            // Apply supplier filter
            if (supplierFilter !== 'all') {
                data = data.filter({
                    "PurchaseReturnsPage.useMemo[filteredData]": (pr)=>pr.supplierSystemId === supplierFilter
                }["PurchaseReturnsPage.useMemo[filteredData]"]);
            }
            // Apply branch filter
            if (branchFilter !== 'all') {
                data = data.filter({
                    "PurchaseReturnsPage.useMemo[filteredData]": (pr)=>pr.branchSystemId === branchFilter
                }["PurchaseReturnsPage.useMemo[filteredData]"]);
            }
            // Apply date range filter
            if (dateRange && (dateRange[0] || dateRange[1])) {
                data = data.filter({
                    "PurchaseReturnsPage.useMemo[filteredData]": (pr)=>{
                        const returnDate = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["parseDate"])(pr.returnDate);
                        if (!returnDate) return false;
                        const fromDate = dateRange[0] ? new Date(dateRange[0]) : null;
                        const toDate = dateRange[1] ? new Date(dateRange[1]) : null;
                        if (fromDate && (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isDateBefore"])(returnDate, fromDate)) return false;
                        if (toDate && (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isDateAfter"])(returnDate, toDate)) return false;
                        return true;
                    }
                }["PurchaseReturnsPage.useMemo[filteredData]"]);
            }
            // Apply search filter (debounced)
            if (debouncedGlobalFilter) {
                const searchResults = fuse.search(debouncedGlobalFilter);
                return searchResults.map({
                    "PurchaseReturnsPage.useMemo[filteredData]": (r)=>r.item
                }["PurchaseReturnsPage.useMemo[filteredData]"]);
            }
            return data;
        }
    }["PurchaseReturnsPage.useMemo[filteredData]"], [
        purchaseReturns,
        supplierFilter,
        branchFilter,
        dateRange,
        debouncedGlobalFilter,
        fuse
    ]);
    const sortedData = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"]({
        "PurchaseReturnsPage.useMemo[sortedData]": ()=>{
            const sorted = [
                ...filteredData
            ];
            if (sorting.id) {
                sorted.sort({
                    "PurchaseReturnsPage.useMemo[sortedData]": (a, b)=>{
                        const aVal = a[sorting.id];
                        const bVal = b[sorting.id];
                        // Special handling for date columns
                        if (sorting.id === 'createdAt' || sorting.id === 'returnDate') {
                            const aTime = aVal ? new Date(aVal).getTime() : 0;
                            const bTime = bVal ? new Date(bVal).getTime() : 0;
                            return sorting.desc ? bTime - aTime : aTime - bTime;
                        }
                        if (aVal === bVal) return 0;
                        if (aVal < bVal) return sorting.desc ? 1 : -1;
                        if (aVal > bVal) return sorting.desc ? -1 : 1;
                        return 0;
                    }
                }["PurchaseReturnsPage.useMemo[sortedData]"]);
            }
            return sorted;
        }
    }["PurchaseReturnsPage.useMemo[sortedData]"], [
        filteredData,
        sorting
    ]);
    const handleRowClick = (row)=>{
        router.push(`${__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$router$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ROUTES"].PROCUREMENT.PURCHASE_RETURNS}/${row.systemId}`);
    };
    const selectedRows = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"]({
        "PurchaseReturnsPage.useMemo[selectedRows]": ()=>{
            return filteredData.filter({
                "PurchaseReturnsPage.useMemo[selectedRows]": (pr)=>rowSelection[pr.systemId]
            }["PurchaseReturnsPage.useMemo[selectedRows]"]);
        }
    }["PurchaseReturnsPage.useMemo[selectedRows]"], [
        filteredData,
        rowSelection
    ]);
    // Open print options dialog for bulk print
    const handleBulkPrint = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"]({
        "PurchaseReturnsPage.useCallback[handleBulkPrint]": ()=>{
            if (selectedRows.length === 0) {
                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error('Chưa chọn phiếu trả', {
                    description: 'Vui lòng chọn ít nhất một phiếu trước khi in.'
                });
                return;
            }
            setPendingPrintReturns(selectedRows);
            setIsPrintDialogOpen(true);
        }
    }["PurchaseReturnsPage.useCallback[handleBulkPrint]"], [
        selectedRows
    ]);
    // Xử lý khi xác nhận tùy chọn in từ dialog
    const handlePrintConfirm = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"]({
        "PurchaseReturnsPage.useCallback[handlePrintConfirm]": (options)=>{
            const { branchSystemId, paperSize } = options;
            // Chuẩn bị danh sách options cho printMultiple
            const printOptionsList = pendingPrintReturns.map({
                "PurchaseReturnsPage.useCallback[handlePrintConfirm].printOptionsList": (entry)=>{
                    // Ưu tiên dùng chi nhánh user chọn, nếu không thì dùng chi nhánh của phiếu
                    const branch = branchSystemId ? branches.find({
                        "PurchaseReturnsPage.useCallback[handlePrintConfirm].printOptionsList": (b)=>b.systemId === branchSystemId
                    }["PurchaseReturnsPage.useCallback[handlePrintConfirm].printOptionsList"]) : branches.find({
                        "PurchaseReturnsPage.useCallback[handlePrintConfirm].printOptionsList": (b)=>b.systemId === entry.branchSystemId
                    }["PurchaseReturnsPage.useCallback[handlePrintConfirm].printOptionsList"]);
                    const storeSettings = branch ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2f$supplier$2d$return$2d$print$2d$helper$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createStoreSettings"])(branch) : (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2f$supplier$2d$return$2d$print$2d$helper$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createStoreSettings"])(storeInfo);
                    const forPrint = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2f$supplier$2d$return$2d$print$2d$helper$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["convertSupplierReturnForPrint"])(entry, {
                        branch
                    });
                    return {
                        data: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$mappers$2f$supplier$2d$return$2e$mapper$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["mapSupplierReturnToPrintData"])(forPrint, storeSettings),
                        lineItems: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$mappers$2f$supplier$2d$return$2e$mapper$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["mapSupplierReturnLineItems"])(forPrint.items),
                        paperSize
                    };
                }
            }["PurchaseReturnsPage.useCallback[handlePrintConfirm].printOptionsList"]);
            // In tất cả trong 1 lần (1 popup) bằng printMultiple
            printMultiple('supplier-return', printOptionsList);
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].success('Đã gửi lệnh in cho phiếu trả', {
                description: pendingPrintReturns.map({
                    "PurchaseReturnsPage.useCallback[handlePrintConfirm]": (r)=>r.id
                }["PurchaseReturnsPage.useCallback[handlePrintConfirm]"]).join(', ')
            });
            setRowSelection({});
            setPendingPrintReturns([]);
        }
    }["PurchaseReturnsPage.useCallback[handlePrintConfirm]"], [
        pendingPrintReturns,
        branches,
        storeInfo,
        printMultiple
    ]);
    const bulkActions = [
        {
            label: "In phiếu trả",
            icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$printer$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Printer$3e$__["Printer"],
            onSelect: handleBulkPrint
        }
    ];
    const pageCount = Math.ceil(sortedData.length / pagination.pageSize);
    const paginatedData = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"]({
        "PurchaseReturnsPage.useMemo[paginatedData]": ()=>{
            const start = pagination.pageIndex * pagination.pageSize;
            const end = start + pagination.pageSize;
            return sortedData.slice(start, end);
        }
    }["PurchaseReturnsPage.useMemo[paginatedData]"], [
        sortedData,
        pagination
    ]);
    const { totalReturnValue, totalRefundAmount, totalQuantity } = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"]({
        "PurchaseReturnsPage.useMemo": ()=>{
            const totalReturnValue = filteredData.reduce({
                "PurchaseReturnsPage.useMemo.totalReturnValue": (sum, pr)=>sum + pr.totalReturnValue
            }["PurchaseReturnsPage.useMemo.totalReturnValue"], 0);
            const totalRefundAmount = filteredData.reduce({
                "PurchaseReturnsPage.useMemo.totalRefundAmount": (sum, pr)=>sum + pr.refundAmount
            }["PurchaseReturnsPage.useMemo.totalRefundAmount"], 0);
            const totalQuantity = filteredData.reduce({
                "PurchaseReturnsPage.useMemo.totalQuantity": (sum, pr)=>{
                    return sum + pr.items.reduce({
                        "PurchaseReturnsPage.useMemo.totalQuantity": (itemSum, item)=>itemSum + item.returnQuantity
                    }["PurchaseReturnsPage.useMemo.totalQuantity"], 0);
                }
            }["PurchaseReturnsPage.useMemo.totalQuantity"], 0);
            return {
                totalReturnValue,
                totalRefundAmount,
                totalQuantity
            };
        }
    }["PurchaseReturnsPage.useMemo"], [
        filteredData
    ]);
    // Supplier options
    const supplierOptions = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"]({
        "PurchaseReturnsPage.useMemo[supplierOptions]": ()=>{
            const uniqueSuppliers = new Map();
            purchaseReturns.forEach({
                "PurchaseReturnsPage.useMemo[supplierOptions]": (pr)=>{
                    if (!uniqueSuppliers.has(pr.supplierSystemId)) {
                        uniqueSuppliers.set(pr.supplierSystemId, pr.supplierName);
                    }
                }
            }["PurchaseReturnsPage.useMemo[supplierOptions]"]);
            return Array.from(uniqueSuppliers.entries()).map({
                "PurchaseReturnsPage.useMemo[supplierOptions]": ([id, name])=>({
                        id,
                        name
                    })
            }["PurchaseReturnsPage.useMemo[supplierOptions]"]);
        }
    }["PurchaseReturnsPage.useMemo[supplierOptions]"], [
        purchaseReturns
    ]);
    // Mobile card component
    const MobileReturnCard = ({ purchaseReturn })=>{
        const totalQty = purchaseReturn.items.reduce((sum, item)=>sum + item.returnQuantity, 0);
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Card"], {
            className: "cursor-pointer hover:shadow-md transition-shadow",
            onClick: ()=>handleRowClick(purchaseReturn),
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardContent"], {
                className: "p-4",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex items-start gap-3",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$avatar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Avatar"], {
                            className: "h-12 w-12 flex-shrink-0",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$avatar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AvatarFallback"], {
                                className: "bg-orange-100 text-orange-600 font-semibold text-body-sm",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$package$2d$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__PackageX$3e$__["PackageX"], {
                                    className: "h-6 w-6"
                                }, void 0, false, {
                                    fileName: "[project]/features/purchase-returns/page.tsx",
                                    lineNumber: 531,
                                    columnNumber: 17
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/features/purchase-returns/page.tsx",
                                lineNumber: 530,
                                columnNumber: 15
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/features/purchase-returns/page.tsx",
                            lineNumber: 529,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex-1 min-w-0",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex items-start justify-between mb-1",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex-1",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                className: "text-body-sm font-semibold",
                                                children: purchaseReturn.id
                                            }, void 0, false, {
                                                fileName: "[project]/features/purchase-returns/page.tsx",
                                                lineNumber: 538,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-body-xs text-muted-foreground",
                                                children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatDateCustom"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["parseDate"])(purchaseReturn.returnDate), 'dd/MM/yyyy')
                                            }, void 0, false, {
                                                fileName: "[project]/features/purchase-returns/page.tsx",
                                                lineNumber: 539,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/features/purchase-returns/page.tsx",
                                        lineNumber: 537,
                                        columnNumber: 17
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/features/purchase-returns/page.tsx",
                                    lineNumber: 536,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "space-y-1.5 mt-2",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex items-center text-body-xs text-muted-foreground",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$user$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__User$3e$__["User"], {
                                                    className: "h-3 w-3 mr-1.5 flex-shrink-0"
                                                }, void 0, false, {
                                                    fileName: "[project]/features/purchase-returns/page.tsx",
                                                    lineNumber: 547,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "truncate",
                                                    children: purchaseReturn.supplierName
                                                }, void 0, false, {
                                                    fileName: "[project]/features/purchase-returns/page.tsx",
                                                    lineNumber: 548,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/features/purchase-returns/page.tsx",
                                            lineNumber: 546,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex items-center text-body-xs text-muted-foreground",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$building$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Building2$3e$__["Building2"], {
                                                    className: "h-3 w-3 mr-1.5 flex-shrink-0"
                                                }, void 0, false, {
                                                    fileName: "[project]/features/purchase-returns/page.tsx",
                                                    lineNumber: 551,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "truncate",
                                                    children: purchaseReturn.branchName
                                                }, void 0, false, {
                                                    fileName: "[project]/features/purchase-returns/page.tsx",
                                                    lineNumber: 552,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/features/purchase-returns/page.tsx",
                                            lineNumber: 550,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex items-center text-body-xs text-muted-foreground",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$text$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__FileText$3e$__["FileText"], {
                                                    className: "h-3 w-3 mr-1.5 flex-shrink-0"
                                                }, void 0, false, {
                                                    fileName: "[project]/features/purchase-returns/page.tsx",
                                                    lineNumber: 555,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "truncate",
                                                    children: [
                                                        "ĐH: ",
                                                        purchaseReturn.purchaseOrderId
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/features/purchase-returns/page.tsx",
                                                    lineNumber: 556,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/features/purchase-returns/page.tsx",
                                            lineNumber: 554,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/features/purchase-returns/page.tsx",
                                    lineNumber: 545,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex items-center justify-between mt-3 pt-2 border-t",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "text-body-xs",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "text-muted-foreground",
                                                    children: "SL: "
                                                }, void 0, false, {
                                                    fileName: "[project]/features/purchase-returns/page.tsx",
                                                    lineNumber: 562,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "font-semibold",
                                                    children: totalQty
                                                }, void 0, false, {
                                                    fileName: "[project]/features/purchase-returns/page.tsx",
                                                    lineNumber: 563,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/features/purchase-returns/page.tsx",
                                            lineNumber: 561,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "text-body-xs",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "text-orange-600 font-semibold",
                                                children: formatCurrency(purchaseReturn.totalReturnValue)
                                            }, void 0, false, {
                                                fileName: "[project]/features/purchase-returns/page.tsx",
                                                lineNumber: 566,
                                                columnNumber: 19
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/features/purchase-returns/page.tsx",
                                            lineNumber: 565,
                                            columnNumber: 17
                                        }, this),
                                        purchaseReturn.refundAmount > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "text-body-xs",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "text-green-600 font-semibold",
                                                children: [
                                                    "Hoàn: ",
                                                    formatCurrency(purchaseReturn.refundAmount)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/features/purchase-returns/page.tsx",
                                                lineNumber: 572,
                                                columnNumber: 21
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/features/purchase-returns/page.tsx",
                                            lineNumber: 571,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/features/purchase-returns/page.tsx",
                                    lineNumber: 560,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/features/purchase-returns/page.tsx",
                            lineNumber: 535,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/features/purchase-returns/page.tsx",
                    lineNumber: 528,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/features/purchase-returns/page.tsx",
                lineNumber: 527,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/features/purchase-returns/page.tsx",
            lineNumber: 526,
            columnNumber: 7
        }, this);
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "space-y-4 flex flex-col h-full",
            children: [
                !isMobile && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$layout$2f$page$2d$toolbar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PageToolbar"], {
                    leftActions: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                        variant: "outline",
                        size: "sm",
                        onClick: ()=>setExportDialogOpen(true),
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$download$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Download$3e$__["Download"], {
                                className: "h-4 w-4 mr-2"
                            }, void 0, false, {
                                fileName: "[project]/features/purchase-returns/page.tsx",
                                lineNumber: 593,
                                columnNumber: 15
                            }, void 0),
                            "Xuất Excel"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/features/purchase-returns/page.tsx",
                        lineNumber: 592,
                        columnNumber: 13
                    }, void 0)
                }, void 0, false, {
                    fileName: "[project]/features/purchase-returns/page.tsx",
                    lineNumber: 590,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Card"], {
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardContent"], {
                                className: "p-4",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-body-sm text-muted-foreground",
                                        children: "Tổng phiếu trả"
                                    }, void 0, false, {
                                        fileName: "[project]/features/purchase-returns/page.tsx",
                                        lineNumber: 604,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-h2 font-semibold",
                                        children: filteredData.length
                                    }, void 0, false, {
                                        fileName: "[project]/features/purchase-returns/page.tsx",
                                        lineNumber: 605,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/features/purchase-returns/page.tsx",
                                lineNumber: 603,
                                columnNumber: 11
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/features/purchase-returns/page.tsx",
                            lineNumber: 602,
                            columnNumber: 9
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Card"], {
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardContent"], {
                                className: "p-4",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-body-sm text-muted-foreground",
                                        children: "Tổng SL trả"
                                    }, void 0, false, {
                                        fileName: "[project]/features/purchase-returns/page.tsx",
                                        lineNumber: 610,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-h2 font-semibold text-orange-600",
                                        children: totalQuantity
                                    }, void 0, false, {
                                        fileName: "[project]/features/purchase-returns/page.tsx",
                                        lineNumber: 611,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/features/purchase-returns/page.tsx",
                                lineNumber: 609,
                                columnNumber: 11
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/features/purchase-returns/page.tsx",
                            lineNumber: 608,
                            columnNumber: 9
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Card"], {
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardContent"], {
                                className: "p-4",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-body-sm text-muted-foreground",
                                        children: "Tổng giá trị hàng trả"
                                    }, void 0, false, {
                                        fileName: "[project]/features/purchase-returns/page.tsx",
                                        lineNumber: 616,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-h2 font-semibold text-orange-600",
                                        children: formatCurrency(totalReturnValue)
                                    }, void 0, false, {
                                        fileName: "[project]/features/purchase-returns/page.tsx",
                                        lineNumber: 617,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/features/purchase-returns/page.tsx",
                                lineNumber: 615,
                                columnNumber: 11
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/features/purchase-returns/page.tsx",
                            lineNumber: 614,
                            columnNumber: 9
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Card"], {
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardContent"], {
                                className: "p-4",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-body-sm text-muted-foreground",
                                        children: "Tổng tiền đã hoàn"
                                    }, void 0, false, {
                                        fileName: "[project]/features/purchase-returns/page.tsx",
                                        lineNumber: 624,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-h2 font-semibold text-green-600",
                                        children: formatCurrency(totalRefundAmount)
                                    }, void 0, false, {
                                        fileName: "[project]/features/purchase-returns/page.tsx",
                                        lineNumber: 625,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/features/purchase-returns/page.tsx",
                                lineNumber: 623,
                                columnNumber: 11
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/features/purchase-returns/page.tsx",
                            lineNumber: 622,
                            columnNumber: 9
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/features/purchase-returns/page.tsx",
                    lineNumber: 601,
                    columnNumber: 7
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$layout$2f$page$2d$filters$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PageFilters"], {
                    searchValue: globalFilter,
                    onSearchChange: setGlobalFilter,
                    searchPlaceholder: "Tìm theo mã phiếu, NCC, đơn hàng...",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Select"], {
                            value: branchFilter,
                            onValueChange: setBranchFilter,
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SelectTrigger"], {
                                    className: "h-9 w-full sm:w-[180px]",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SelectValue"], {
                                        placeholder: "Chi nhánh"
                                    }, void 0, false, {
                                        fileName: "[project]/features/purchase-returns/page.tsx",
                                        lineNumber: 640,
                                        columnNumber: 13
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/features/purchase-returns/page.tsx",
                                    lineNumber: 639,
                                    columnNumber: 11
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SelectContent"], {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SelectItem"], {
                                            value: "all",
                                            children: "Tất cả chi nhánh"
                                        }, void 0, false, {
                                            fileName: "[project]/features/purchase-returns/page.tsx",
                                            lineNumber: 643,
                                            columnNumber: 13
                                        }, this),
                                        branches.map((b)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SelectItem"], {
                                                value: b.systemId,
                                                children: b.name
                                            }, b.systemId, false, {
                                                fileName: "[project]/features/purchase-returns/page.tsx",
                                                lineNumber: 645,
                                                columnNumber: 15
                                            }, this))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/features/purchase-returns/page.tsx",
                                    lineNumber: 642,
                                    columnNumber: 11
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/features/purchase-returns/page.tsx",
                            lineNumber: 638,
                            columnNumber: 9
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Select"], {
                            value: supplierFilter,
                            onValueChange: setSupplierFilter,
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SelectTrigger"], {
                                    className: "h-9 w-full sm:w-[200px]",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SelectValue"], {
                                        placeholder: "Nhà cung cấp"
                                    }, void 0, false, {
                                        fileName: "[project]/features/purchase-returns/page.tsx",
                                        lineNumber: 652,
                                        columnNumber: 13
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/features/purchase-returns/page.tsx",
                                    lineNumber: 651,
                                    columnNumber: 11
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SelectContent"], {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SelectItem"], {
                                            value: "all",
                                            children: "Tất cả NCC"
                                        }, void 0, false, {
                                            fileName: "[project]/features/purchase-returns/page.tsx",
                                            lineNumber: 655,
                                            columnNumber: 13
                                        }, this),
                                        supplierOptions.map((s)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SelectItem"], {
                                                value: s.id,
                                                children: s.name
                                            }, s.id, false, {
                                                fileName: "[project]/features/purchase-returns/page.tsx",
                                                lineNumber: 657,
                                                columnNumber: 15
                                            }, this))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/features/purchase-returns/page.tsx",
                                    lineNumber: 654,
                                    columnNumber: 11
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/features/purchase-returns/page.tsx",
                            lineNumber: 650,
                            columnNumber: 9
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$data$2d$table$2f$data$2d$table$2d$date$2d$filter$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DataTableDateFilter"], {
                            value: dateRange,
                            onChange: setDateRange,
                            title: "Ngày trả hàng"
                        }, void 0, false, {
                            fileName: "[project]/features/purchase-returns/page.tsx",
                            lineNumber: 662,
                            columnNumber: 9
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/features/purchase-returns/page.tsx",
                    lineNumber: 633,
                    columnNumber: 7
                }, this),
                isMobile ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "space-y-4",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "space-y-2",
                            children: sortedData.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Card"], {
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardContent"], {
                                    className: "p-8 text-center text-muted-foreground",
                                    children: "Không tìm thấy phiếu trả hàng nào."
                                }, void 0, false, {
                                    fileName: "[project]/features/purchase-returns/page.tsx",
                                    lineNumber: 675,
                                    columnNumber: 17
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/features/purchase-returns/page.tsx",
                                lineNumber: 674,
                                columnNumber: 15
                            }, this) : sortedData.slice(0, mobileLoadedCount).map((pr)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(MobileReturnCard, {
                                    purchaseReturn: pr
                                }, pr.systemId, false, {
                                    fileName: "[project]/features/purchase-returns/page.tsx",
                                    lineNumber: 681,
                                    columnNumber: 17
                                }, this))
                        }, void 0, false, {
                            fileName: "[project]/features/purchase-returns/page.tsx",
                            lineNumber: 672,
                            columnNumber: 11
                        }, this),
                        sortedData.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "py-6 text-center",
                            children: mobileLoadedCount < sortedData.length ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center justify-center gap-2 text-muted-foreground",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent"
                                    }, void 0, false, {
                                        fileName: "[project]/features/purchase-returns/page.tsx",
                                        lineNumber: 691,
                                        columnNumber: 19
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-sm",
                                        children: "Đang tải thêm..."
                                    }, void 0, false, {
                                        fileName: "[project]/features/purchase-returns/page.tsx",
                                        lineNumber: 692,
                                        columnNumber: 19
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/features/purchase-returns/page.tsx",
                                lineNumber: 690,
                                columnNumber: 17
                            }, this) : sortedData.length > 20 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-sm text-muted-foreground",
                                children: [
                                    "Đã hiển thị tất cả ",
                                    sortedData.length,
                                    " phiếu trả hàng"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/features/purchase-returns/page.tsx",
                                lineNumber: 695,
                                columnNumber: 17
                            }, this) : null
                        }, void 0, false, {
                            fileName: "[project]/features/purchase-returns/page.tsx",
                            lineNumber: 688,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/features/purchase-returns/page.tsx",
                    lineNumber: 671,
                    columnNumber: 9
                }, this) : /* Desktop View - ResponsiveDataTable */ /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$data$2d$table$2f$responsive$2d$data$2d$table$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ResponsiveDataTable"], {
                    columns: columns,
                    data: paginatedData,
                    renderMobileCard: (row)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(MobileReturnCard, {
                            purchaseReturn: row
                        }, void 0, false, {
                            fileName: "[project]/features/purchase-returns/page.tsx",
                            lineNumber: 707,
                            columnNumber: 38
                        }, void 0),
                    onRowClick: handleRowClick,
                    pageCount: pageCount,
                    pagination: pagination,
                    setPagination: setPagination,
                    rowCount: sortedData.length,
                    rowSelection: rowSelection,
                    setRowSelection: setRowSelection,
                    allSelectedRows: selectedRows,
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
                    setPinnedColumns: setPinnedColumns
                }, void 0, false, {
                    fileName: "[project]/features/purchase-returns/page.tsx",
                    lineNumber: 704,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$shared$2f$simple$2d$print$2d$options$2d$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SimplePrintOptionsDialog"], {
                    open: isPrintDialogOpen,
                    onOpenChange: setIsPrintDialogOpen,
                    onConfirm: handlePrintConfirm,
                    selectedCount: pendingPrintReturns.length,
                    title: "In phiếu trả NCC"
                }, void 0, false, {
                    fileName: "[project]/features/purchase-returns/page.tsx",
                    lineNumber: 732,
                    columnNumber: 7
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$shared$2f$generic$2d$export$2d$dialog$2d$v2$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["GenericExportDialogV2"], {
                    open: exportDialogOpen,
                    onOpenChange: setExportDialogOpen,
                    config: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$import$2d$export$2f$configs$2f$purchase$2d$return$2e$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["purchaseReturnConfig"],
                    allData: purchaseReturns,
                    filteredData: filteredData,
                    currentPageData: paginatedData,
                    selectedData: selectedRows,
                    currentUser: {
                        name: currentUser?.fullName || 'Hệ thống',
                        systemId: currentUser?.systemId || (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])('SYSTEM')
                    }
                }, void 0, false, {
                    fileName: "[project]/features/purchase-returns/page.tsx",
                    lineNumber: 741,
                    columnNumber: 7
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/features/purchase-returns/page.tsx",
            lineNumber: 587,
            columnNumber: 5
        }, this)
    }, void 0, false);
}
_s(PurchaseReturnsPage, "qgtJEtsT5d8nNWxIevFvd2Hs3Dw=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$purchase$2d$returns$2f$hooks$2f$use$2d$all$2d$purchase$2d$returns$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAllPurchaseReturns"],
        __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$purchase$2d$orders$2f$hooks$2f$use$2d$all$2d$purchase$2d$orders$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAllPurchaseOrders"],
        __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$branches$2f$hooks$2f$use$2d$all$2d$branches$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAllBranches"],
        __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$store$2d$info$2f$hooks$2f$use$2d$store$2d$info$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useStoreInfo"],
        __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$use$2d$print$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePrint"],
        __TURBOPACK__imported__module__$5b$project$5d2f$contexts$2f$auth$2d$context$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuth"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"],
        __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$use$2d$media$2d$query$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMediaQuery"],
        __TURBOPACK__imported__module__$5b$project$5d2f$contexts$2f$page$2d$header$2d$context$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePageHeader"],
        __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$use$2d$column$2d$visibility$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useColumnVisibility"]
    ];
});
_c = PurchaseReturnsPage;
var _c;
__turbopack_context__.k.register(_c, "PurchaseReturnsPage");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=features_purchase-returns_72e0de87._.js.map