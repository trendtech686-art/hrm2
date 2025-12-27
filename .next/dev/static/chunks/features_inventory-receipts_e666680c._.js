(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/features/inventory-receipts/api/inventory-receipts-api.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Inventory Receipts (Phiếu Nhập Kho) API functions
 * 
 * ⚠️ Direct import: import { fetchInventoryReceipts } from '@/features/inventory-receipts/api/inventory-receipts-api'
 */ __turbopack_context__.s([
    "createInventoryReceipt",
    ()=>createInventoryReceipt,
    "deleteInventoryReceipt",
    ()=>deleteInventoryReceipt,
    "fetchInventoryReceipt",
    ()=>fetchInventoryReceipt,
    "fetchInventoryReceipts",
    ()=>fetchInventoryReceipts,
    "updateInventoryReceipt",
    ()=>updateInventoryReceipt
]);
const BASE_URL = '/api/inventory-receipts';
async function fetchInventoryReceipts(params = {}) {
    const searchParams = new URLSearchParams();
    if (params.page) searchParams.set('page', String(params.page));
    if (params.limit) searchParams.set('limit', String(params.limit));
    if (params.search) searchParams.set('search', params.search);
    if (params.supplierId) searchParams.set('supplierId', params.supplierId);
    if (params.purchaseOrderId) searchParams.set('purchaseOrderId', params.purchaseOrderId);
    if (params.branchId) searchParams.set('branchId', params.branchId);
    if (params.receiverId) searchParams.set('receiverId', params.receiverId);
    if (params.startDate) searchParams.set('startDate', params.startDate);
    if (params.endDate) searchParams.set('endDate', params.endDate);
    if (params.sortBy) searchParams.set('sortBy', params.sortBy);
    if (params.sortOrder) searchParams.set('sortOrder', params.sortOrder);
    const url = searchParams.toString() ? `${BASE_URL}?${searchParams}` : BASE_URL;
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`Failed to fetch inventory receipts: ${response.statusText}`);
    }
    return response.json();
}
async function fetchInventoryReceipt(systemId) {
    const response = await fetch(`${BASE_URL}/${systemId}`);
    if (!response.ok) {
        throw new Error(`Failed to fetch inventory receipt: ${response.statusText}`);
    }
    return response.json();
}
async function createInventoryReceipt(data) {
    const response = await fetch(BASE_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });
    if (!response.ok) {
        const error = await response.json().catch(()=>({}));
        throw new Error(error.message || 'Failed to create inventory receipt');
    }
    return response.json();
}
async function updateInventoryReceipt(systemId, data) {
    const response = await fetch(`${BASE_URL}/${systemId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });
    if (!response.ok) {
        const error = await response.json().catch(()=>({}));
        throw new Error(error.message || 'Failed to update inventory receipt');
    }
    return response.json();
}
async function deleteInventoryReceipt(systemId) {
    const response = await fetch(`${BASE_URL}/${systemId}`, {
        method: 'DELETE'
    });
    if (!response.ok) {
        throw new Error(`Failed to delete inventory receipt: ${response.statusText}`);
    }
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/features/inventory-receipts/hooks/use-inventory-receipts.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "inventoryReceiptKeys",
    ()=>inventoryReceiptKeys,
    "useInventoryReceipt",
    ()=>useInventoryReceipt,
    "useInventoryReceiptMutations",
    ()=>useInventoryReceiptMutations,
    "useInventoryReceipts",
    ()=>useInventoryReceipts,
    "useInventoryReceiptsByPO",
    ()=>useInventoryReceiptsByPO,
    "useInventoryReceiptsBySupplier",
    ()=>useInventoryReceiptsBySupplier
]);
/**
 * useInventoryReceipts - React Query hooks (Phiếu Nhập Kho)
 * 
 * ⚠️ Direct import: import { useInventoryReceipts } from '@/features/inventory-receipts/hooks/use-inventory-receipts'
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@tanstack/react-query/build/modern/useQuery.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@tanstack/react-query/build/modern/useMutation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@tanstack/react-query/build/modern/QueryClientProvider.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@tanstack/query-core/build/modern/utils.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$inventory$2d$receipts$2f$api$2f$inventory$2d$receipts$2d$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/inventory-receipts/api/inventory-receipts-api.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/id-types.ts [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature(), _s2 = __turbopack_context__.k.signature(), _s3 = __turbopack_context__.k.signature(), _s4 = __turbopack_context__.k.signature();
;
;
;
const inventoryReceiptKeys = {
    all: [
        'inventory-receipts'
    ],
    lists: ()=>[
            ...inventoryReceiptKeys.all,
            'list'
        ],
    list: (params)=>[
            ...inventoryReceiptKeys.lists(),
            params
        ],
    details: ()=>[
            ...inventoryReceiptKeys.all,
            'detail'
        ],
    detail: (id)=>[
            ...inventoryReceiptKeys.details(),
            id
        ]
};
function useInventoryReceipts(params = {}) {
    _s();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"])({
        queryKey: inventoryReceiptKeys.list(params),
        queryFn: {
            "useInventoryReceipts.useQuery": ()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$inventory$2d$receipts$2f$api$2f$inventory$2d$receipts$2d$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["fetchInventoryReceipts"])(params)
        }["useInventoryReceipts.useQuery"],
        staleTime: 30_000,
        gcTime: 5 * 60 * 1000,
        placeholderData: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["keepPreviousData"]
    });
}
_s(useInventoryReceipts, "4ZpngI1uv+Uo3WQHEZmTQ5FNM+k=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"]
    ];
});
function useInventoryReceipt(id) {
    _s1();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"])({
        queryKey: inventoryReceiptKeys.detail(id),
        queryFn: {
            "useInventoryReceipt.useQuery": ()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$inventory$2d$receipts$2f$api$2f$inventory$2d$receipts$2d$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["fetchInventoryReceipt"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])(id))
        }["useInventoryReceipt.useQuery"],
        enabled: !!id,
        staleTime: 60_000
    });
}
_s1(useInventoryReceipt, "4ZpngI1uv+Uo3WQHEZmTQ5FNM+k=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"]
    ];
});
function useInventoryReceiptMutations(options = {}) {
    _s2();
    const queryClient = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQueryClient"])();
    const create = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"])({
        mutationFn: __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$inventory$2d$receipts$2f$api$2f$inventory$2d$receipts$2d$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createInventoryReceipt"],
        onSuccess: {
            "useInventoryReceiptMutations.useMutation[create]": (data)=>{
                queryClient.invalidateQueries({
                    queryKey: inventoryReceiptKeys.lists()
                });
                options.onCreateSuccess?.(data);
            }
        }["useInventoryReceiptMutations.useMutation[create]"],
        onError: options.onError
    });
    const update = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"])({
        mutationFn: {
            "useInventoryReceiptMutations.useMutation[update]": ({ systemId, data })=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$inventory$2d$receipts$2f$api$2f$inventory$2d$receipts$2d$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["updateInventoryReceipt"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])(systemId), data)
        }["useInventoryReceiptMutations.useMutation[update]"],
        onSuccess: {
            "useInventoryReceiptMutations.useMutation[update]": (data, variables)=>{
                queryClient.invalidateQueries({
                    queryKey: inventoryReceiptKeys.detail(variables.systemId)
                });
                queryClient.invalidateQueries({
                    queryKey: inventoryReceiptKeys.lists()
                });
                options.onUpdateSuccess?.(data);
            }
        }["useInventoryReceiptMutations.useMutation[update]"],
        onError: options.onError
    });
    const remove = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"])({
        mutationFn: {
            "useInventoryReceiptMutations.useMutation[remove]": (systemId)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$inventory$2d$receipts$2f$api$2f$inventory$2d$receipts$2d$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["deleteInventoryReceipt"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])(systemId))
        }["useInventoryReceiptMutations.useMutation[remove]"],
        onSuccess: {
            "useInventoryReceiptMutations.useMutation[remove]": ()=>{
                queryClient.invalidateQueries({
                    queryKey: inventoryReceiptKeys.all
                });
                options.onDeleteSuccess?.();
            }
        }["useInventoryReceiptMutations.useMutation[remove]"],
        onError: options.onError
    });
    return {
        create,
        update,
        remove
    };
}
_s2(useInventoryReceiptMutations, "JxOfJjdyCQxYamNcDrzBiezg78E=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQueryClient"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMutation"]
    ];
});
function useInventoryReceiptsBySupplier(supplierId) {
    _s3();
    return useInventoryReceipts({
        supplierId: supplierId || undefined,
        limit: 50
    });
}
_s3(useInventoryReceiptsBySupplier, "c6WFrr5Nel9gKBhkrGiMDQQkw40=", false, function() {
    return [
        useInventoryReceipts
    ];
});
function useInventoryReceiptsByPO(purchaseOrderId) {
    _s4();
    return useInventoryReceipts({
        purchaseOrderId: purchaseOrderId || undefined,
        limit: 20
    });
}
_s4(useInventoryReceiptsByPO, "c6WFrr5Nel9gKBhkrGiMDQQkw40=", false, function() {
    return [
        useInventoryReceipts
    ];
});
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/features/inventory-receipts/page.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "InventoryReceiptsPage",
    ()=>InventoryReceiptsPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$router$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/router.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/date-utils.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$inventory$2d$receipts$2f$hooks$2f$use$2d$inventory$2d$receipts$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/inventory-receipts/hooks/use-inventory-receipts.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$purchase$2d$orders$2f$hooks$2f$use$2d$purchase$2d$orders$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/purchase-orders/hooks/use-purchase-orders.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$suppliers$2f$hooks$2f$use$2d$suppliers$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/features/suppliers/hooks/use-suppliers.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$suppliers$2f$hooks$2f$use$2d$all$2d$suppliers$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/suppliers/hooks/use-all-suppliers.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$contexts$2f$page$2d$header$2d$context$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/contexts/page-header-context.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$data$2d$table$2f$responsive$2d$data$2d$table$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/data-table/responsive-data-table.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$data$2d$table$2f$data$2d$table$2d$date$2d$filter$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/data-table/data-table-date-filter.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$layout$2f$page$2d$filters$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/layout/page-filters.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$layout$2f$page$2d$toolbar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/layout/page-toolbar.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/card.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/select.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/button.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$use$2d$media$2d$query$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/use-media-query.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$package$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Package$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/package.js [app-client] (ecmascript) <export default as Package>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$calendar$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Calendar$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/calendar.js [app-client] (ecmascript) <export default as Calendar>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$users$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Users$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/users.js [app-client] (ecmascript) <export default as Users>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$text$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__FileText$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/file-text.js [app-client] (ecmascript) <export default as FileText>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$printer$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Printer$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/printer.js [app-client] (ecmascript) <export default as Printer>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$download$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Download$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/download.js [app-client] (ecmascript) <export default as Download>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$fuse$2e$js$2f$dist$2f$fuse$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/fuse.js/dist/fuse.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$checkbox$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/checkbox.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$branches$2f$hooks$2f$use$2d$branches$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/settings/branches/hooks/use-branches.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$store$2d$info$2f$hooks$2f$use$2d$store$2d$info$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/settings/store-info/hooks/use-store-info.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$use$2d$print$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/use-print.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2f$stock$2d$in$2d$print$2d$helper$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/lib/print/stock-in-print-helper.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$mappers$2f$stock$2d$in$2e$mapper$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/print-mappers/stock-in.mapper.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/sonner/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$shared$2f$simple$2d$print$2d$options$2d$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/shared/simple-print-options-dialog.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$shared$2f$generic$2d$export$2d$dialog$2d$v2$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/shared/generic-export-dialog-v2.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$import$2d$export$2f$configs$2f$inventory$2d$receipt$2e$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/import-export/configs/inventory-receipt.config.ts [app-client] (ecmascript)");
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
const getColumns = (handlers)=>[
        {
            id: "select",
            header: ({ isAllPageRowsSelected, isSomePageRowsSelected, onToggleAll })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex items-center justify-center",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$checkbox$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Checkbox"], {
                        checked: isAllPageRowsSelected ? true : isSomePageRowsSelected ? "indeterminate" : false,
                        onCheckedChange: (value)=>onToggleAll?.(!!value),
                        "aria-label": "Select all"
                    }, void 0, false, {
                        fileName: "[project]/features/inventory-receipts/page.tsx",
                        lineNumber: 50,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0))
                }, void 0, false, {
                    fileName: "[project]/features/inventory-receipts/page.tsx",
                    lineNumber: 49,
                    columnNumber: 7
                }, ("TURBOPACK compile-time value", void 0)),
            cell: ({ isSelected, onToggleSelect })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex items-center justify-center",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$checkbox$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Checkbox"], {
                        checked: isSelected,
                        onCheckedChange: onToggleSelect,
                        "aria-label": "Select row"
                    }, void 0, false, {
                        fileName: "[project]/features/inventory-receipts/page.tsx",
                        lineNumber: 59,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0))
                }, void 0, false, {
                    fileName: "[project]/features/inventory-receipts/page.tsx",
                    lineNumber: 58,
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
            header: 'Mã phiếu',
            cell: ({ row })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                    className: "font-medium text-primary",
                    children: row.id
                }, void 0, false, {
                    fileName: "[project]/features/inventory-receipts/page.tsx",
                    lineNumber: 77,
                    columnNumber: 7
                }, ("TURBOPACK compile-time value", void 0)),
            meta: {
                displayName: 'Mã phiếu'
            },
            size: 120
        },
        {
            id: 'receivedDate',
            accessorKey: 'receivedDate',
            header: 'Ngày nhập',
            cell: ({ row })=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatDateCustom"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["parseDate"])(row.receivedDate), 'dd/MM/yyyy HH:mm'),
            meta: {
                displayName: 'Ngày nhập'
            },
            size: 150
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
            id: 'purchaseOrderId',
            accessorKey: 'purchaseOrderId',
            header: 'Đơn mua hàng',
            cell: ({ row })=>row.purchaseOrderId,
            meta: {
                displayName: 'Đơn mua hàng'
            },
            size: 140
        },
        {
            id: 'totalQuantity',
            header: 'Tổng SL nhập',
            cell: ({ row })=>{
                const total = row.items.reduce((sum, item)=>sum + Number(item.receivedQuantity), 0);
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                    className: "font-medium",
                    children: total
                }, void 0, false, {
                    fileName: "[project]/features/inventory-receipts/page.tsx",
                    lineNumber: 110,
                    columnNumber: 14
                }, ("TURBOPACK compile-time value", void 0));
            },
            meta: {
                displayName: 'Tổng SL nhập'
            },
            size: 120
        },
        {
            id: 'receiverName',
            accessorKey: 'receiverName',
            header: 'Người nhận',
            cell: ({ row })=>row.receiverName,
            meta: {
                displayName: 'Người nhận'
            },
            size: 150
        },
        {
            id: 'notes',
            accessorKey: 'notes',
            header: 'Ghi chú',
            cell: ({ row })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                    className: "text-body-xs max-w-xs line-clamp-2",
                    children: row.notes || '-'
                }, void 0, false, {
                    fileName: "[project]/features/inventory-receipts/page.tsx",
                    lineNumber: 128,
                    columnNumber: 7
                }, ("TURBOPACK compile-time value", void 0)),
            meta: {
                displayName: 'Ghi chú'
            },
            size: 200
        },
        {
            id: 'itemsCount',
            header: 'Số mặt hàng',
            cell: ({ row })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                    className: "font-medium",
                    children: row.items.length
                }, void 0, false, {
                    fileName: "[project]/features/inventory-receipts/page.tsx",
                    lineNumber: 139,
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
                    fileName: "[project]/features/inventory-receipts/page.tsx",
                    lineNumber: 151,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0));
            },
            meta: {
                displayName: 'Sản phẩm'
            },
            size: 200
        },
        {
            id: 'totalValue',
            header: 'Tổng giá trị',
            cell: ({ row })=>{
                const total = row.items.reduce((sum, item)=>sum + item.receivedQuantity * item.unitPrice, 0);
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                    className: "font-semibold",
                    children: new Intl.NumberFormat('vi-VN', {
                        style: 'currency',
                        currency: 'VND'
                    }).format(total)
                }, void 0, false, {
                    fileName: "[project]/features/inventory-receipts/page.tsx",
                    lineNumber: 168,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0));
            },
            meta: {
                displayName: 'Tổng giá trị'
            },
            size: 150
        },
        {
            id: 'actions',
            header: 'Hành động',
            cell: ({ row })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                    variant: "ghost",
                    size: "sm",
                    className: "h-8",
                    onClick: (e)=>{
                        e.stopPropagation();
                        handlers.onPrint(row);
                    },
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$printer$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Printer$3e$__["Printer"], {
                            className: "h-4 w-4 mr-1"
                        }, void 0, false, {
                            fileName: "[project]/features/inventory-receipts/page.tsx",
                            lineNumber: 189,
                            columnNumber: 9
                        }, ("TURBOPACK compile-time value", void 0)),
                        "In"
                    ]
                }, void 0, true, {
                    fileName: "[project]/features/inventory-receipts/page.tsx",
                    lineNumber: 180,
                    columnNumber: 7
                }, ("TURBOPACK compile-time value", void 0)),
            size: 120,
            meta: {
                displayName: 'Hành động',
                sticky: 'right'
            }
        }
    ];
function InventoryReceiptsPage() {
    _s();
    // React Query hooks
    const { data: receiptsData } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$inventory$2d$receipts$2f$hooks$2f$use$2d$inventory$2d$receipts$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useInventoryReceipts"])();
    const receipts = receiptsData?.data || [];
    const { data: purchaseOrdersData } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$purchase$2d$orders$2f$hooks$2f$use$2d$purchase$2d$orders$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePurchaseOrders"])();
    const allPurchaseOrders = purchaseOrdersData?.data || [];
    const { data: suppliersData } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$suppliers$2f$hooks$2f$use$2d$all$2d$suppliers$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAllSuppliers"])();
    const suppliers = suppliersData || [];
    const { data: branchesData } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$branches$2f$hooks$2f$use$2d$branches$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAllBranches"])();
    const branches = branchesData?.data || [];
    const { data: storeInfoData } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$store$2d$info$2f$hooks$2f$use$2d$store$2d$info$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useStoreInfo"])();
    const storeInfo = storeInfoData || null;
    // Helper functions
    const findSupplierById = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"]({
        "InventoryReceiptsPage.useCallback[findSupplierById]": (systemId)=>{
            return suppliers.find({
                "InventoryReceiptsPage.useCallback[findSupplierById]": (s)=>s.systemId === systemId
            }["InventoryReceiptsPage.useCallback[findSupplierById]"]);
        }
    }["InventoryReceiptsPage.useCallback[findSupplierById]"], [
        suppliers
    ]);
    const findBranchById = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"]({
        "InventoryReceiptsPage.useCallback[findBranchById]": (systemId)=>{
            return branches.find({
                "InventoryReceiptsPage.useCallback[findBranchById]": (b)=>b.systemId === systemId
            }["InventoryReceiptsPage.useCallback[findBranchById]"]);
        }
    }["InventoryReceiptsPage.useCallback[findBranchById]"], [
        branches
    ]);
    const { print, printMultiple } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$use$2d$print$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePrint"])();
    const { employee: currentUser } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$contexts$2f$auth$2d$context$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuth"])();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const isMobile = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$use$2d$media$2d$query$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMediaQuery"])("(max-width: 768px)");
    // Export dialog state
    const [exportDialogOpen, setExportDialogOpen] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"](false);
    const headerActions = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"]({
        "InventoryReceiptsPage.useMemo[headerActions]": ()=>[
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                    variant: "outline",
                    size: "sm",
                    className: "h-9",
                    onClick: {
                        "InventoryReceiptsPage.useMemo[headerActions]": ()=>router.push(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$router$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ROUTES"].PROCUREMENT.PURCHASE_ORDERS)
                    }["InventoryReceiptsPage.useMemo[headerActions]"],
                    children: "Đơn mua hàng"
                }, "purchase-orders", false, {
                    fileName: "[project]/features/inventory-receipts/page.tsx",
                    lineNumber: 232,
                    columnNumber: 5
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                    size: "sm",
                    className: "h-9",
                    onClick: {
                        "InventoryReceiptsPage.useMemo[headerActions]": ()=>router.push(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$router$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ROUTES"].PROCUREMENT.PURCHASE_ORDER_NEW)
                    }["InventoryReceiptsPage.useMemo[headerActions]"],
                    children: "Tạo phiếu nhập"
                }, "create", false, {
                    fileName: "[project]/features/inventory-receipts/page.tsx",
                    lineNumber: 241,
                    columnNumber: 5
                }, this)
            ]
    }["InventoryReceiptsPage.useMemo[headerActions]"], [
        router
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$contexts$2f$page$2d$header$2d$context$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePageHeader"])({
        title: 'Danh sách phiếu nhập kho',
        breadcrumb: [
            {
                label: 'Trang chủ',
                href: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$router$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ROUTES"].DASHBOARD,
                isCurrent: false
            },
            {
                label: 'Phiếu nhập kho',
                href: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$router$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ROUTES"].PROCUREMENT.INVENTORY_RECEIPTS,
                isCurrent: true
            }
        ],
        showBackButton: false,
        actions: headerActions
    });
    // Không cần combine nữa, chỉ dùng receipts
    const filteredDataBase = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"]({
        "InventoryReceiptsPage.useMemo[filteredDataBase]": ()=>{
            return [
                ...receipts
            ].sort({
                "InventoryReceiptsPage.useMemo[filteredDataBase]": (a, b)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getDaysDiff"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["parseDate"])(b.receivedDate), (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["parseDate"])(a.receivedDate))
            }["InventoryReceiptsPage.useMemo[filteredDataBase]"]);
        }
    }["InventoryReceiptsPage.useMemo[filteredDataBase]"], [
        receipts
    ]);
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
    // Use hook for column visibility (database-backed)
    const [columnVisibility, setColumnVisibility] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$use$2d$column$2d$visibility$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useColumnVisibility"])('inventory-receipts', {});
    const [columnOrder, setColumnOrder] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"]([]);
    const [pinnedColumns, setPinnedColumns] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"]([]);
    const [expanded, setExpanded] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"]({});
    const [mobileLoadedCount, setMobileLoadedCount] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"](20);
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"]({
        "InventoryReceiptsPage.useEffect": ()=>{
            const timer = setTimeout({
                "InventoryReceiptsPage.useEffect.timer": ()=>{
                    setDebouncedGlobalFilter(globalFilter);
                }
            }["InventoryReceiptsPage.useEffect.timer"], 300);
            return ({
                "InventoryReceiptsPage.useEffect": ()=>clearTimeout(timer)
            })["InventoryReceiptsPage.useEffect"];
        }
    }["InventoryReceiptsPage.useEffect"], [
        globalFilter
    ]);
    const handlePrintReceipt = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"]({
        "InventoryReceiptsPage.useCallback[handlePrintReceipt]": (receipt)=>{
            // Use helper to prepare print data
            const branch = findBranchById(receipt.branchSystemId);
            const supplier = findSupplierById(receipt.supplierSystemId);
            const storeSettings = branch ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2f$stock$2d$in$2d$print$2d$helper$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createStoreSettings"])(branch) : (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2f$stock$2d$in$2d$print$2d$helper$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createStoreSettings"])(storeInfo);
            const receiptData = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2f$stock$2d$in$2d$print$2d$helper$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["convertStockInForPrint"])(receipt, {
                branch,
                supplier
            });
            print('stock-in', {
                data: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$mappers$2f$stock$2d$in$2e$mapper$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["mapStockInToPrintData"])(receiptData, storeSettings),
                lineItems: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$mappers$2f$stock$2d$in$2e$mapper$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["mapStockInLineItems"])(receiptData.items)
            });
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].info('Đang gửi lệnh in', {
                description: `Phiếu ${receipt.id} - ${receipt.supplierName}`
            });
        }
    }["InventoryReceiptsPage.useCallback[handlePrintReceipt]"], [
        findBranchById,
        findSupplierById,
        storeInfo,
        print
    ]);
    const columns = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"]({
        "InventoryReceiptsPage.useMemo[columns]": ()=>getColumns({
                onPrint: handlePrintReceipt
            })
    }["InventoryReceiptsPage.useMemo[columns]"], [
        handlePrintReceipt
    ]);
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"]({
        "InventoryReceiptsPage.useEffect": ()=>{
            if (!columns.length) return;
            const next = {
                ...columnVisibility
            };
            let changed = false;
            columns.forEach({
                "InventoryReceiptsPage.useEffect": (c)=>{
                    if (!c.id) return;
                    if (typeof next[c.id] === 'undefined') {
                        next[c.id] = true;
                        changed = true;
                    }
                }
            }["InventoryReceiptsPage.useEffect"]);
            if (changed) {
                setColumnVisibility(next);
            }
            if (columnOrder.length === 0) {
                setColumnOrder(columns.map({
                    "InventoryReceiptsPage.useEffect": (c)=>c.id
                }["InventoryReceiptsPage.useEffect"]).filter(Boolean));
            }
        }
    }["InventoryReceiptsPage.useEffect"], [
        columns
    ]);
    const fuse = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"]({
        "InventoryReceiptsPage.useMemo[fuse]": ()=>new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$fuse$2e$js$2f$dist$2f$fuse$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"](filteredDataBase, {
                keys: [
                    "id",
                    "supplierName",
                    "receiverName",
                    "purchaseOrderId"
                ],
                threshold: 0.3,
                ignoreLocation: true
            })
    }["InventoryReceiptsPage.useMemo[fuse]"], [
        filteredDataBase
    ]);
    const filteredData = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"]({
        "InventoryReceiptsPage.useMemo[filteredData]": ()=>{
            let data = filteredDataBase;
            if (supplierFilter !== 'all') {
                data = data.filter({
                    "InventoryReceiptsPage.useMemo[filteredData]": (v)=>v.supplierSystemId === supplierFilter
                }["InventoryReceiptsPage.useMemo[filteredData]"]);
            }
            if (branchFilter !== 'all') {
                data = data.filter({
                    "InventoryReceiptsPage.useMemo[filteredData]": (v)=>v.branchSystemId === branchFilter
                }["InventoryReceiptsPage.useMemo[filteredData]"]);
            }
            if (dateRange && (dateRange[0] || dateRange[1])) {
                data = data.filter({
                    "InventoryReceiptsPage.useMemo[filteredData]": (v)=>{
                        const voucherDate = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["parseDate"])(v.receivedDate);
                        if (!voucherDate) return false;
                        const fromDate = dateRange[0] ? new Date(dateRange[0]) : null;
                        const toDate = dateRange[1] ? new Date(dateRange[1]) : null;
                        if (fromDate && (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isDateBefore"])(voucherDate, fromDate)) return false;
                        if (toDate && (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isDateAfter"])(voucherDate, toDate)) return false;
                        return true;
                    }
                }["InventoryReceiptsPage.useMemo[filteredData]"]);
            }
            if (debouncedGlobalFilter) {
                const searchResults = fuse.search(debouncedGlobalFilter);
                return searchResults.map({
                    "InventoryReceiptsPage.useMemo[filteredData]": (r)=>r.item
                }["InventoryReceiptsPage.useMemo[filteredData]"]);
            }
            return data;
        }
    }["InventoryReceiptsPage.useMemo[filteredData]"], [
        filteredDataBase,
        supplierFilter,
        branchFilter,
        dateRange,
        debouncedGlobalFilter,
        fuse
    ]);
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"]({
        "InventoryReceiptsPage.useEffect": ()=>{
            setMobileLoadedCount(20);
        }
    }["InventoryReceiptsPage.useEffect"], [
        debouncedGlobalFilter,
        supplierFilter,
        branchFilter,
        dateRange
    ]);
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"]({
        "InventoryReceiptsPage.useEffect": ()=>{
            if (!isMobile) return;
            const handleScroll = {
                "InventoryReceiptsPage.useEffect.handleScroll": ()=>{
                    const scrollTop = window.scrollY || document.documentElement.scrollTop;
                    const scrollHeight = document.documentElement.scrollHeight;
                    const clientHeight = document.documentElement.clientHeight;
                    const filteredCount = filteredData.length;
                    if (scrollTop + clientHeight >= scrollHeight * 0.8 && mobileLoadedCount < filteredCount) {
                        setMobileLoadedCount({
                            "InventoryReceiptsPage.useEffect.handleScroll": (prev)=>Math.min(prev + 20, filteredCount)
                        }["InventoryReceiptsPage.useEffect.handleScroll"]);
                    }
                }
            }["InventoryReceiptsPage.useEffect.handleScroll"];
            window.addEventListener('scroll', handleScroll, {
                passive: true
            });
            return ({
                "InventoryReceiptsPage.useEffect": ()=>window.removeEventListener('scroll', handleScroll)
            })["InventoryReceiptsPage.useEffect"];
        }
    }["InventoryReceiptsPage.useEffect"], [
        isMobile,
        mobileLoadedCount,
        filteredData
    ]);
    const sortedData = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"]({
        "InventoryReceiptsPage.useMemo[sortedData]": ()=>{
            let sorted = [
                ...filteredData
            ];
            if (sorting && sorting.id) {
                sorted.sort({
                    "InventoryReceiptsPage.useMemo[sortedData]": (a, b)=>{
                        const aVal = a[sorting.id];
                        const bVal = b[sorting.id];
                        // Special handling for date columns
                        if (sorting.id === 'createdAt' || sorting.id === 'receivedDate') {
                            const aTime = aVal ? new Date(aVal).getTime() : 0;
                            const bTime = bVal ? new Date(bVal).getTime() : 0;
                            return sorting.desc ? bTime - aTime : aTime - bTime;
                        }
                        if (aVal === bVal) return 0;
                        if (aVal < bVal) return sorting.desc ? 1 : -1;
                        if (aVal > bVal) return sorting.desc ? -1 : 1;
                        return 0;
                    }
                }["InventoryReceiptsPage.useMemo[sortedData]"]);
            }
            return sorted;
        }
    }["InventoryReceiptsPage.useMemo[sortedData]"], [
        filteredData,
        sorting
    ]);
    const pageCount = Math.ceil(sortedData.length / pagination.pageSize);
    const paginatedData = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"]({
        "InventoryReceiptsPage.useMemo[paginatedData]": ()=>{
            const start = pagination.pageIndex * pagination.pageSize;
            const end = start + pagination.pageSize;
            return sortedData.slice(start, end);
        }
    }["InventoryReceiptsPage.useMemo[paginatedData]"], [
        sortedData,
        pagination
    ]);
    const handleRowClick = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"]({
        "InventoryReceiptsPage.useCallback[handleRowClick]": (row)=>{
            router.push(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$router$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ROUTES"].PROCUREMENT.INVENTORY_RECEIPT_VIEW.replace(':systemId', row.systemId));
        }
    }["InventoryReceiptsPage.useCallback[handleRowClick]"], [
        router
    ]);
    const selectedRows = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"]({
        "InventoryReceiptsPage.useMemo[selectedRows]": ()=>{
            return sortedData.filter({
                "InventoryReceiptsPage.useMemo[selectedRows]": (r)=>rowSelection[r.systemId]
            }["InventoryReceiptsPage.useMemo[selectedRows]"]);
        }
    }["InventoryReceiptsPage.useMemo[selectedRows]"], [
        sortedData,
        rowSelection
    ]);
    // Print dialog state
    const [isPrintDialogOpen, setIsPrintDialogOpen] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"](false);
    const [pendingPrintReceipts, setPendingPrintReceipts] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"]([]);
    // Open print options dialog
    const handleBulkPrint = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"]({
        "InventoryReceiptsPage.useCallback[handleBulkPrint]": ()=>{
            if (selectedRows.length === 0) return;
            setPendingPrintReceipts(selectedRows);
            setIsPrintDialogOpen(true);
        }
    }["InventoryReceiptsPage.useCallback[handleBulkPrint]"], [
        selectedRows
    ]);
    // Xử lý khi xác nhận tùy chọn in từ dialog
    const handlePrintConfirm = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"]({
        "InventoryReceiptsPage.useCallback[handlePrintConfirm]": (options)=>{
            const { branchSystemId, paperSize } = options;
            // Chuẩn bị danh sách options cho printMultiple
            const printOptionsList = pendingPrintReceipts.map({
                "InventoryReceiptsPage.useCallback[handlePrintConfirm].printOptionsList": (receipt)=>{
                    // Ưu tiên dùng chi nhánh user chọn, nếu không thì dùng chi nhánh của phiếu
                    const branch = branchSystemId ? findBranchById(branchSystemId) : findBranchById(receipt.branchSystemId);
                    const supplier = findSupplierById(receipt.supplierSystemId);
                    const storeSettings = branch ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2f$stock$2d$in$2d$print$2d$helper$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createStoreSettings"])(branch) : (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2f$stock$2d$in$2d$print$2d$helper$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createStoreSettings"])(storeInfo);
                    const receiptData = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2f$stock$2d$in$2d$print$2d$helper$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["convertStockInForPrint"])(receipt, {
                        branch,
                        supplier
                    });
                    return {
                        data: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$mappers$2f$stock$2d$in$2e$mapper$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["mapStockInToPrintData"])(receiptData, storeSettings),
                        lineItems: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$mappers$2f$stock$2d$in$2e$mapper$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["mapStockInLineItems"])(receiptData.items),
                        paperSize
                    };
                }
            }["InventoryReceiptsPage.useCallback[handlePrintConfirm].printOptionsList"]);
            // In tất cả trong 1 lần (1 popup) bằng printMultiple
            printMultiple('stock-in', printOptionsList);
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].success('Đã gửi lệnh in cho phiếu nhập', {
                description: pendingPrintReceipts.map({
                    "InventoryReceiptsPage.useCallback[handlePrintConfirm]": (r)=>r.id
                }["InventoryReceiptsPage.useCallback[handlePrintConfirm]"]).join(', ')
            });
            setRowSelection({});
            setPendingPrintReceipts([]);
        }
    }["InventoryReceiptsPage.useCallback[handlePrintConfirm]"], [
        pendingPrintReceipts,
        findBranchById,
        findSupplierById,
        storeInfo,
        printMultiple
    ]);
    const bulkActions = [
        {
            label: "In phiếu nhập",
            icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$printer$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Printer$3e$__["Printer"],
            onSelect: handleBulkPrint
        }
    ];
    const receiptStats = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"]({
        "InventoryReceiptsPage.useMemo[receiptStats]": ()=>{
            const totalReceipts = filteredData.length;
            const totalQuantity = filteredData.reduce({
                "InventoryReceiptsPage.useMemo[receiptStats].totalQuantity": (sum, r)=>{
                    return sum + r.items.reduce({
                        "InventoryReceiptsPage.useMemo[receiptStats].totalQuantity": (itemSum, item)=>itemSum + item.receivedQuantity
                    }["InventoryReceiptsPage.useMemo[receiptStats].totalQuantity"], 0);
                }
            }["InventoryReceiptsPage.useMemo[receiptStats].totalQuantity"], 0);
            return {
                totalReceipts,
                totalQuantity
            };
        }
    }["InventoryReceiptsPage.useMemo[receiptStats]"], [
        filteredData
    ]);
    const supplierOptions = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"]({
        "InventoryReceiptsPage.useMemo[supplierOptions]": ()=>{
            const supplierMap = new Map();
            filteredDataBase.forEach({
                "InventoryReceiptsPage.useMemo[supplierOptions]": (r)=>{
                    if (r.supplierSystemId) {
                        supplierMap.set(r.supplierSystemId, r.supplierName);
                    }
                }
            }["InventoryReceiptsPage.useMemo[supplierOptions]"]);
            suppliers.forEach({
                "InventoryReceiptsPage.useMemo[supplierOptions]": (s)=>{
                    if (filteredDataBase.some({
                        "InventoryReceiptsPage.useMemo[supplierOptions]": (r)=>r.supplierSystemId === s.systemId
                    }["InventoryReceiptsPage.useMemo[supplierOptions]"])) {
                        supplierMap.set(s.systemId, s.name);
                    }
                }
            }["InventoryReceiptsPage.useMemo[supplierOptions]"]);
            return Array.from(supplierMap.entries()).map({
                "InventoryReceiptsPage.useMemo[supplierOptions]": ([value, label])=>({
                        value,
                        label
                    })
            }["InventoryReceiptsPage.useMemo[supplierOptions]"]).sort({
                "InventoryReceiptsPage.useMemo[supplierOptions]": (a, b)=>a.label.localeCompare(b.label)
            }["InventoryReceiptsPage.useMemo[supplierOptions]"]);
        }
    }["InventoryReceiptsPage.useMemo[supplierOptions]"], [
        filteredDataBase,
        suppliers
    ]);
    const branchOptions = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"]({
        "InventoryReceiptsPage.useMemo[branchOptions]": ()=>{
            const branchMap = new Map();
            filteredDataBase.forEach({
                "InventoryReceiptsPage.useMemo[branchOptions]": (r)=>{
                    if (r.branchSystemId) {
                        branchMap.set(r.branchSystemId, r.branchName || branches.find({
                            "InventoryReceiptsPage.useMemo[branchOptions]": (b)=>b.systemId === r.branchSystemId
                        }["InventoryReceiptsPage.useMemo[branchOptions]"])?.name || 'Chưa gắn chi nhánh');
                    }
                }
            }["InventoryReceiptsPage.useMemo[branchOptions]"]);
            return Array.from(branchMap.entries()).map({
                "InventoryReceiptsPage.useMemo[branchOptions]": ([value, label])=>({
                        value,
                        label
                    })
            }["InventoryReceiptsPage.useMemo[branchOptions]"]).sort({
                "InventoryReceiptsPage.useMemo[branchOptions]": (a, b)=>a.label.localeCompare(b.label)
            }["InventoryReceiptsPage.useMemo[branchOptions]"]);
        }
    }["InventoryReceiptsPage.useMemo[branchOptions]"], [
        filteredDataBase,
        branches
    ]);
    const MobileReceiptCard = ({ receipt })=>{
        const totalQuantity = receipt.items.reduce((sum, item)=>sum + item.receivedQuantity, 0);
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Card"], {
            className: "mb-4 cursor-pointer hover:border-primary",
            onClick: ()=>handleRowClick(receipt),
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardContent"], {
                className: "p-4",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex items-start justify-between",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex items-start gap-3",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "p-2 rounded-full bg-green-100 text-green-600",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$package$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Package$3e$__["Package"], {
                                        className: "h-6 w-6"
                                    }, void 0, false, {
                                        fileName: "[project]/features/inventory-receipts/page.tsx",
                                        lineNumber: 532,
                                        columnNumber: 17
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/features/inventory-receipts/page.tsx",
                                    lineNumber: 531,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex-1",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "font-semibold text-body-sm mb-1",
                                            children: receipt.id
                                        }, void 0, false, {
                                            fileName: "[project]/features/inventory-receipts/page.tsx",
                                            lineNumber: 535,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "text-body-sm text-muted-foreground space-y-1",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex items-center gap-1",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$calendar$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Calendar$3e$__["Calendar"], {
                                                            className: "h-3 w-3"
                                                        }, void 0, false, {
                                                            fileName: "[project]/features/inventory-receipts/page.tsx",
                                                            lineNumber: 538,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatDate"])(receipt.receivedDate)
                                                        }, void 0, false, {
                                                            fileName: "[project]/features/inventory-receipts/page.tsx",
                                                            lineNumber: 539,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/features/inventory-receipts/page.tsx",
                                                    lineNumber: 537,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex items-center gap-1",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$users$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Users$3e$__["Users"], {
                                                            className: "h-3 w-3"
                                                        }, void 0, false, {
                                                            fileName: "[project]/features/inventory-receipts/page.tsx",
                                                            lineNumber: 542,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            children: receipt.supplierName
                                                        }, void 0, false, {
                                                            fileName: "[project]/features/inventory-receipts/page.tsx",
                                                            lineNumber: 543,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/features/inventory-receipts/page.tsx",
                                                    lineNumber: 541,
                                                    columnNumber: 19
                                                }, this),
                                                receipt.purchaseOrderId && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex items-center gap-1",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$text$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__FileText$3e$__["FileText"], {
                                                            className: "h-3 w-3"
                                                        }, void 0, false, {
                                                            fileName: "[project]/features/inventory-receipts/page.tsx",
                                                            lineNumber: 547,
                                                            columnNumber: 23
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            children: [
                                                                "Đơn: ",
                                                                receipt.purchaseOrderId
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/features/inventory-receipts/page.tsx",
                                                            lineNumber: 548,
                                                            columnNumber: 23
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/features/inventory-receipts/page.tsx",
                                                    lineNumber: 546,
                                                    columnNumber: 21
                                                }, this),
                                                receipt.receiverName && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex items-center gap-1",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$users$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Users$3e$__["Users"], {
                                                            className: "h-3 w-3"
                                                        }, void 0, false, {
                                                            fileName: "[project]/features/inventory-receipts/page.tsx",
                                                            lineNumber: 553,
                                                            columnNumber: 23
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            children: [
                                                                "Người nhận: ",
                                                                receipt.receiverName
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/features/inventory-receipts/page.tsx",
                                                            lineNumber: 554,
                                                            columnNumber: 23
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/features/inventory-receipts/page.tsx",
                                                    lineNumber: 552,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/features/inventory-receipts/page.tsx",
                                            lineNumber: 536,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/features/inventory-receipts/page.tsx",
                                    lineNumber: 534,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/features/inventory-receipts/page.tsx",
                            lineNumber: 530,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "text-right",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "font-semibold text-body-sm",
                                children: [
                                    totalQuantity,
                                    " SP"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/features/inventory-receipts/page.tsx",
                                lineNumber: 561,
                                columnNumber: 15
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/features/inventory-receipts/page.tsx",
                            lineNumber: 560,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/features/inventory-receipts/page.tsx",
                    lineNumber: 529,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/features/inventory-receipts/page.tsx",
                lineNumber: 528,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/features/inventory-receipts/page.tsx",
            lineNumber: 527,
            columnNumber: 7
        }, this);
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
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
                            fileName: "[project]/features/inventory-receipts/page.tsx",
                            lineNumber: 578,
                            columnNumber: 15
                        }, void 0),
                        "Xuất Excel"
                    ]
                }, void 0, true, {
                    fileName: "[project]/features/inventory-receipts/page.tsx",
                    lineNumber: 577,
                    columnNumber: 13
                }, void 0)
            }, void 0, false, {
                fileName: "[project]/features/inventory-receipts/page.tsx",
                lineNumber: 575,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Card"], {
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardContent"], {
                            className: "p-4",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-body-sm text-muted-foreground",
                                    children: "Tổng phiếu nhập"
                                }, void 0, false, {
                                    fileName: "[project]/features/inventory-receipts/page.tsx",
                                    lineNumber: 588,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-h3 font-semibold text-green-600",
                                    children: receiptStats.totalReceipts
                                }, void 0, false, {
                                    fileName: "[project]/features/inventory-receipts/page.tsx",
                                    lineNumber: 589,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/features/inventory-receipts/page.tsx",
                            lineNumber: 587,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/features/inventory-receipts/page.tsx",
                        lineNumber: 586,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Card"], {
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardContent"], {
                            className: "p-4",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-body-sm text-muted-foreground",
                                    children: "Tổng số lượng nhập"
                                }, void 0, false, {
                                    fileName: "[project]/features/inventory-receipts/page.tsx",
                                    lineNumber: 594,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-h3 font-semibold text-blue-600",
                                    children: [
                                        receiptStats.totalQuantity,
                                        " SP"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/features/inventory-receipts/page.tsx",
                                    lineNumber: 595,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/features/inventory-receipts/page.tsx",
                            lineNumber: 593,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/features/inventory-receipts/page.tsx",
                        lineNumber: 592,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Card"], {
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardContent"], {
                            className: "p-4",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-body-sm text-muted-foreground",
                                    children: "Đang hiển thị"
                                }, void 0, false, {
                                    fileName: "[project]/features/inventory-receipts/page.tsx",
                                    lineNumber: 600,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-h3 font-semibold",
                                    children: [
                                        filteredData.length,
                                        " / ",
                                        receipts.length
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/features/inventory-receipts/page.tsx",
                                    lineNumber: 601,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/features/inventory-receipts/page.tsx",
                            lineNumber: 599,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/features/inventory-receipts/page.tsx",
                        lineNumber: 598,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/features/inventory-receipts/page.tsx",
                lineNumber: 585,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$layout$2f$page$2d$filters$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PageFilters"], {
                searchValue: globalFilter,
                onSearchChange: setGlobalFilter,
                searchPlaceholder: "Tìm theo mã phiếu, NCC, đơn hàng...",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Select"], {
                        value: supplierFilter,
                        onValueChange: setSupplierFilter,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SelectTrigger"], {
                                className: "h-9 w-full sm:w-[200px]",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SelectValue"], {
                                    placeholder: "Nhà cung cấp"
                                }, void 0, false, {
                                    fileName: "[project]/features/inventory-receipts/page.tsx",
                                    lineNumber: 613,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/features/inventory-receipts/page.tsx",
                                lineNumber: 612,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SelectContent"], {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SelectItem"], {
                                        value: "all",
                                        children: "Tất cả NCC"
                                    }, void 0, false, {
                                        fileName: "[project]/features/inventory-receipts/page.tsx",
                                        lineNumber: 616,
                                        columnNumber: 13
                                    }, this),
                                    supplierOptions.map((opt)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SelectItem"], {
                                            value: opt.value,
                                            children: opt.label
                                        }, opt.value, false, {
                                            fileName: "[project]/features/inventory-receipts/page.tsx",
                                            lineNumber: 618,
                                            columnNumber: 15
                                        }, this))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/features/inventory-receipts/page.tsx",
                                lineNumber: 615,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/features/inventory-receipts/page.tsx",
                        lineNumber: 611,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Select"], {
                        value: branchFilter,
                        onValueChange: setBranchFilter,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SelectTrigger"], {
                                className: "h-9 w-full sm:w-[200px]",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SelectValue"], {
                                    placeholder: "Chi nhánh"
                                }, void 0, false, {
                                    fileName: "[project]/features/inventory-receipts/page.tsx",
                                    lineNumber: 625,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/features/inventory-receipts/page.tsx",
                                lineNumber: 624,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SelectContent"], {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SelectItem"], {
                                        value: "all",
                                        children: "Tất cả chi nhánh"
                                    }, void 0, false, {
                                        fileName: "[project]/features/inventory-receipts/page.tsx",
                                        lineNumber: 628,
                                        columnNumber: 13
                                    }, this),
                                    branchOptions.map((opt)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SelectItem"], {
                                            value: opt.value,
                                            children: opt.label
                                        }, opt.value, false, {
                                            fileName: "[project]/features/inventory-receipts/page.tsx",
                                            lineNumber: 630,
                                            columnNumber: 15
                                        }, this))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/features/inventory-receipts/page.tsx",
                                lineNumber: 627,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/features/inventory-receipts/page.tsx",
                        lineNumber: 623,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$data$2d$table$2f$data$2d$table$2d$date$2d$filter$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DataTableDateFilter"], {
                        value: dateRange,
                        onChange: setDateRange,
                        title: "Ngày nhập hàng"
                    }, void 0, false, {
                        fileName: "[project]/features/inventory-receipts/page.tsx",
                        lineNumber: 635,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/features/inventory-receipts/page.tsx",
                lineNumber: 606,
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
                                children: "Không tìm thấy phiếu nào."
                            }, void 0, false, {
                                fileName: "[project]/features/inventory-receipts/page.tsx",
                                lineNumber: 647,
                                columnNumber: 17
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/features/inventory-receipts/page.tsx",
                            lineNumber: 646,
                            columnNumber: 15
                        }, this) : sortedData.slice(0, mobileLoadedCount).map((r)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(MobileReceiptCard, {
                                receipt: r
                            }, r.systemId, false, {
                                fileName: "[project]/features/inventory-receipts/page.tsx",
                                lineNumber: 653,
                                columnNumber: 17
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/features/inventory-receipts/page.tsx",
                        lineNumber: 644,
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
                                    fileName: "[project]/features/inventory-receipts/page.tsx",
                                    lineNumber: 662,
                                    columnNumber: 19
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "text-body-sm",
                                    children: "Đang tải thêm..."
                                }, void 0, false, {
                                    fileName: "[project]/features/inventory-receipts/page.tsx",
                                    lineNumber: 663,
                                    columnNumber: 19
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/features/inventory-receipts/page.tsx",
                            lineNumber: 661,
                            columnNumber: 17
                        }, this) : sortedData.length > 20 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-body-sm text-muted-foreground",
                            children: [
                                "Đã hiển thị tất cả ",
                                sortedData.length,
                                " phiếu"
                            ]
                        }, void 0, true, {
                            fileName: "[project]/features/inventory-receipts/page.tsx",
                            lineNumber: 666,
                            columnNumber: 17
                        }, this) : null
                    }, void 0, false, {
                        fileName: "[project]/features/inventory-receipts/page.tsx",
                        lineNumber: 659,
                        columnNumber: 13
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/features/inventory-receipts/page.tsx",
                lineNumber: 643,
                columnNumber: 9
            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$data$2d$table$2f$responsive$2d$data$2d$table$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ResponsiveDataTable"], {
                columns: columns,
                data: paginatedData,
                renderMobileCard: (row)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(MobileReceiptCard, {
                        receipt: row
                    }, void 0, false, {
                        fileName: "[project]/features/inventory-receipts/page.tsx",
                        lineNumber: 677,
                        columnNumber: 38
                    }, void 0),
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
                setPinnedColumns: setPinnedColumns,
                onRowClick: handleRowClick
            }, void 0, false, {
                fileName: "[project]/features/inventory-receipts/page.tsx",
                lineNumber: 674,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$shared$2f$simple$2d$print$2d$options$2d$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SimplePrintOptionsDialog"], {
                open: isPrintDialogOpen,
                onOpenChange: setIsPrintDialogOpen,
                onConfirm: handlePrintConfirm,
                selectedCount: pendingPrintReceipts.length,
                title: "In phiếu nhập kho"
            }, void 0, false, {
                fileName: "[project]/features/inventory-receipts/page.tsx",
                lineNumber: 702,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$shared$2f$generic$2d$export$2d$dialog$2d$v2$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["GenericExportDialogV2"], {
                open: exportDialogOpen,
                onOpenChange: setExportDialogOpen,
                config: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$import$2d$export$2f$configs$2f$inventory$2d$receipt$2e$config$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["inventoryReceiptConfig"],
                allData: receipts,
                filteredData: filteredData,
                currentPageData: paginatedData,
                selectedData: selectedRows,
                currentUser: {
                    name: currentUser?.fullName || 'Hệ thống',
                    systemId: currentUser?.systemId || (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])('SYSTEM')
                }
            }, void 0, false, {
                fileName: "[project]/features/inventory-receipts/page.tsx",
                lineNumber: 711,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/features/inventory-receipts/page.tsx",
        lineNumber: 572,
        columnNumber: 5
    }, this);
}
_s(InventoryReceiptsPage, "dCQZrBjWWjMbkweRotmoG39rTyI=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$inventory$2d$receipts$2f$hooks$2f$use$2d$inventory$2d$receipts$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useInventoryReceipts"],
        __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$purchase$2d$orders$2f$hooks$2f$use$2d$purchase$2d$orders$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePurchaseOrders"],
        __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$suppliers$2f$hooks$2f$use$2d$all$2d$suppliers$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAllSuppliers"],
        __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$branches$2f$hooks$2f$use$2d$branches$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAllBranches"],
        __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$store$2d$info$2f$hooks$2f$use$2d$store$2d$info$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useStoreInfo"],
        __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$use$2d$print$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePrint"],
        __TURBOPACK__imported__module__$5b$project$5d2f$contexts$2f$auth$2d$context$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuth"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"],
        __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$use$2d$media$2d$query$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMediaQuery"],
        __TURBOPACK__imported__module__$5b$project$5d2f$contexts$2f$page$2d$header$2d$context$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePageHeader"],
        __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$use$2d$column$2d$visibility$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useColumnVisibility"]
    ];
});
_c = InventoryReceiptsPage;
var _c;
__turbopack_context__.k.register(_c, "InventoryReceiptsPage");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=features_inventory-receipts_e666680c._.js.map