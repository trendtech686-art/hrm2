module.exports = [
"[project]/features/purchase-orders/api/purchase-orders-api.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Purchase Orders API - Isolated API functions
 */ __turbopack_context__.s([
    "createPurchaseOrder",
    ()=>createPurchaseOrder,
    "deletePurchaseOrder",
    ()=>deletePurchaseOrder,
    "fetchPurchaseOrder",
    ()=>fetchPurchaseOrder,
    "fetchPurchaseOrders",
    ()=>fetchPurchaseOrders,
    "searchPurchaseOrders",
    ()=>searchPurchaseOrders,
    "updatePurchaseOrder",
    ()=>updatePurchaseOrder
]);
const API_BASE = '/api/purchase-orders';
async function fetchPurchaseOrders(params = {}) {
    const { page = 1, limit = 50, ...rest } = params;
    const searchParams = new URLSearchParams({
        page: String(page),
        limit: String(limit)
    });
    Object.entries(rest).forEach(([key, value])=>{
        if (value != null && value !== '') {
            searchParams.set(key, String(value));
        }
    });
    const res = await fetch(`${API_BASE}?${searchParams}`, {
        credentials: 'include'
    });
    if (!res.ok) throw new Error(`Failed to fetch purchase orders: ${res.statusText}`);
    return res.json();
}
async function fetchPurchaseOrder(id) {
    const res = await fetch(`${API_BASE}/${id}`, {
        credentials: 'include'
    });
    if (!res.ok) throw new Error(`Failed to fetch purchase order: ${res.statusText}`);
    return res.json();
}
async function createPurchaseOrder(data) {
    const res = await fetch(API_BASE, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(data)
    });
    if (!res.ok) {
        const error = await res.json().catch(()=>({}));
        throw new Error(error.message || `Failed to create purchase order`);
    }
    return res.json();
}
async function updatePurchaseOrder(systemId, data) {
    const res = await fetch(`${API_BASE}/${systemId}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(data)
    });
    if (!res.ok) {
        const error = await res.json().catch(()=>({}));
        throw new Error(error.message || `Failed to update purchase order`);
    }
    return res.json();
}
async function deletePurchaseOrder(id) {
    const res = await fetch(`${API_BASE}/${id}`, {
        method: 'DELETE',
        credentials: 'include'
    });
    if (!res.ok) throw new Error(`Failed to delete purchase order`);
}
async function searchPurchaseOrders(query, limit = 20) {
    const res = await fetch(`${API_BASE}?search=${encodeURIComponent(query)}&limit=${limit}`, {
        credentials: 'include'
    });
    if (!res.ok) throw new Error(`Failed to search purchase orders`);
    const json = await res.json();
    return json.data || [];
}
}),
"[project]/features/purchase-orders/hooks/use-purchase-orders.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "purchaseOrderKeys",
    ()=>purchaseOrderKeys,
    "usePurchaseOrder",
    ()=>usePurchaseOrder,
    "usePurchaseOrderMutations",
    ()=>usePurchaseOrderMutations,
    "usePurchaseOrders",
    ()=>usePurchaseOrders,
    "usePurchaseOrdersBySupplier",
    ()=>usePurchaseOrdersBySupplier
]);
/**
 * usePurchaseOrders - React Query hooks
 * 
 * ⚠️ Direct import: import { usePurchaseOrders } from '@/features/purchase-orders/hooks/use-purchase-orders'
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@tanstack/react-query/build/modern/useQuery.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@tanstack/react-query/build/modern/useMutation.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@tanstack/react-query/build/modern/QueryClientProvider.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$utils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@tanstack/query-core/build/modern/utils.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$purchase$2d$orders$2f$api$2f$purchase$2d$orders$2d$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/purchase-orders/api/purchase-orders-api.ts [app-ssr] (ecmascript)");
;
;
const purchaseOrderKeys = {
    all: [
        'purchase-orders'
    ],
    lists: ()=>[
            ...purchaseOrderKeys.all,
            'list'
        ],
    list: (params)=>[
            ...purchaseOrderKeys.lists(),
            params
        ],
    details: ()=>[
            ...purchaseOrderKeys.all,
            'detail'
        ],
    detail: (id)=>[
            ...purchaseOrderKeys.details(),
            id
        ]
};
function usePurchaseOrders(params = {}) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useQuery"])({
        queryKey: purchaseOrderKeys.list(params),
        queryFn: ()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$purchase$2d$orders$2f$api$2f$purchase$2d$orders$2d$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["fetchPurchaseOrders"])(params),
        staleTime: 30_000,
        gcTime: 5 * 60 * 1000,
        placeholderData: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$utils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["keepPreviousData"]
    });
}
function usePurchaseOrder(id) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useQuery"])({
        queryKey: purchaseOrderKeys.detail(id),
        queryFn: ()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$purchase$2d$orders$2f$api$2f$purchase$2d$orders$2d$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["fetchPurchaseOrder"])(id),
        enabled: !!id,
        staleTime: 60_000
    });
}
function usePurchaseOrderMutations(options = {}) {
    const queryClient = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useQueryClient"])();
    const create = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMutation"])({
        mutationFn: __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$purchase$2d$orders$2f$api$2f$purchase$2d$orders$2d$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createPurchaseOrder"],
        onSuccess: (data)=>{
            queryClient.invalidateQueries({
                queryKey: purchaseOrderKeys.lists()
            });
            options.onCreateSuccess?.(data);
        },
        onError: options.onError
    });
    const update = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMutation"])({
        mutationFn: ({ systemId, data })=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$purchase$2d$orders$2f$api$2f$purchase$2d$orders$2d$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["updatePurchaseOrder"])(systemId, data),
        onSuccess: (data, variables)=>{
            queryClient.invalidateQueries({
                queryKey: purchaseOrderKeys.detail(variables.systemId)
            });
            queryClient.invalidateQueries({
                queryKey: purchaseOrderKeys.lists()
            });
            options.onUpdateSuccess?.(data);
        },
        onError: options.onError
    });
    const remove = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMutation"])({
        mutationFn: __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$purchase$2d$orders$2f$api$2f$purchase$2d$orders$2d$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["deletePurchaseOrder"],
        onSuccess: ()=>{
            queryClient.invalidateQueries({
                queryKey: purchaseOrderKeys.all
            });
            options.onDeleteSuccess?.();
        },
        onError: options.onError
    });
    return {
        create,
        update,
        remove
    };
}
function usePurchaseOrdersBySupplier(supplierId) {
    return usePurchaseOrders({
        supplierId: supplierId || undefined,
        limit: 100
    });
}
}),
"[project]/features/purchase-orders/payment-utils.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getPaymentsForPurchaseOrder",
    ()=>getPaymentsForPurchaseOrder,
    "getReceiptsForPurchaseOrder",
    ()=>getReceiptsForPurchaseOrder,
    "isPaymentLinkedToPurchaseOrder",
    ()=>isPaymentLinkedToPurchaseOrder,
    "isReceiptLinkedToPurchaseOrder",
    ()=>isReceiptLinkedToPurchaseOrder,
    "sumPaymentsForPurchaseOrder",
    ()=>sumPaymentsForPurchaseOrder
]);
const SUPPLIER_TARGET_IDS = [
    'NHACUNGCAP',
    'supplier'
];
const SUPPLIER_TARGET_LABELS = [
    'Nhà cung cấp'
];
const isPaymentLinkedToPurchaseOrder = (payment, purchaseOrder)=>{
    if (!payment || !purchaseOrder) {
        return false;
    }
    if (payment.purchaseOrderSystemId) {
        return payment.purchaseOrderSystemId === purchaseOrder.systemId;
    }
    if (payment.originalDocumentId) {
        return payment.originalDocumentId === purchaseOrder.systemId || payment.originalDocumentId === purchaseOrder.id;
    }
    const isSupplierTarget = payment.recipientTypeSystemId && SUPPLIER_TARGET_IDS.includes(payment.recipientTypeSystemId) || payment.recipientTypeName && SUPPLIER_TARGET_LABELS.includes(payment.recipientTypeName);
    if (isSupplierTarget && payment.recipientSystemId && payment.recipientSystemId === purchaseOrder.supplierSystemId) {
        return true;
    }
    return false;
};
const getPaymentsForPurchaseOrder = (payments, purchaseOrder)=>{
    if (!Array.isArray(payments) || !purchaseOrder) {
        return [];
    }
    return payments.filter((payment)=>isPaymentLinkedToPurchaseOrder(payment, purchaseOrder));
};
const sumPaymentsForPurchaseOrder = (payments, purchaseOrder)=>{
    return getPaymentsForPurchaseOrder(payments, purchaseOrder).reduce((sum, payment)=>sum + (payment.amount || 0), 0);
};
const isReceiptLinkedToPurchaseOrder = (receipt, purchaseOrder)=>{
    if (!receipt || !purchaseOrder) {
        return false;
    }
    if (receipt.purchaseOrderSystemId) {
        return receipt.purchaseOrderSystemId === purchaseOrder.systemId;
    }
    if (receipt.originalDocumentId) {
        return receipt.originalDocumentId === purchaseOrder.systemId || receipt.originalDocumentId === purchaseOrder.id;
    }
    const isSupplierTarget = receipt.payerTypeSystemId && SUPPLIER_TARGET_IDS.includes(receipt.payerTypeSystemId) || receipt.payerTypeName && SUPPLIER_TARGET_LABELS.includes(receipt.payerTypeName);
    if (isSupplierTarget && receipt.payerSystemId && receipt.payerSystemId === purchaseOrder.supplierSystemId) {
        return true;
    }
    return false;
};
const getReceiptsForPurchaseOrder = (receipts, purchaseOrder)=>{
    if (!Array.isArray(receipts) || !purchaseOrder) {
        return [];
    }
    return receipts.filter((receipt)=>isReceiptLinkedToPurchaseOrder(receipt, purchaseOrder));
};
}),
"[project]/features/purchase-orders/columns.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getColumns",
    ()=>getColumns
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/date-utils.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$checkbox$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/checkbox.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$badge$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/badge.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/button.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/dropdown-menu.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$ellipsis$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__MoreHorizontal$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/ellipsis.js [app-ssr] (ecmascript) <export default as MoreHorizontal>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$printer$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Printer$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/printer.js [app-ssr] (ecmascript) <export default as Printer>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$credit$2d$card$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__CreditCard$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/credit-card.js [app-ssr] (ecmascript) <export default as CreditCard>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$package$2d$check$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__PackageCheck$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/package-check.js [app-ssr] (ecmascript) <export default as PackageCheck>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$x$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__XCircle$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/circle-x.js [app-ssr] (ecmascript) <export default as XCircle>");
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
const statusVariants = {
    "Đặt hàng": "secondary",
    "Đang giao dịch": "warning",
    "Hoàn thành": "success",
    "Đã hủy": "destructive",
    "Kết thúc": "default",
    "Đã trả hàng": "destructive"
};
const getColumns = (onCancel, onPrint, onPayment, onReceiveGoods, branches)=>[
        {
            id: "select",
            header: ({ isAllPageRowsSelected, isSomePageRowsSelected, onToggleAll })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex items-center justify-center",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$checkbox$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Checkbox"], {
                        checked: isAllPageRowsSelected ? true : isSomePageRowsSelected ? "indeterminate" : false,
                        onCheckedChange: (value)=>onToggleAll?.(!!value),
                        "aria-label": "Select all"
                    }, void 0, false, {
                        fileName: "[project]/features/purchase-orders/columns.tsx",
                        lineNumber: 39,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0))
                }, void 0, false, {
                    fileName: "[project]/features/purchase-orders/columns.tsx",
                    lineNumber: 38,
                    columnNumber: 8
                }, ("TURBOPACK compile-time value", void 0)),
            cell: ({ isSelected, onToggleSelect })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex items-center justify-center",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$checkbox$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Checkbox"], {
                        checked: isSelected,
                        onCheckedChange: onToggleSelect,
                        "aria-label": "Select row"
                    }, void 0, false, {
                        fileName: "[project]/features/purchase-orders/columns.tsx",
                        lineNumber: 48,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0))
                }, void 0, false, {
                    fileName: "[project]/features/purchase-orders/columns.tsx",
                    lineNumber: 47,
                    columnNumber: 8
                }, ("TURBOPACK compile-time value", void 0)),
            size: 48,
            meta: {
                displayName: "Select",
                sticky: "left"
            }
        },
        {
            id: "id",
            accessorKey: "id",
            header: "Mã đơn nhập hàng",
            cell: ({ row })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "text-body-sm font-medium text-primary hover:underline",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                        href: `/purchase-orders/${row.systemId}`,
                        children: row.id
                    }, void 0, false, {
                        fileName: "[project]/features/purchase-orders/columns.tsx",
                        lineNumber: 65,
                        columnNumber: 95
                    }, ("TURBOPACK compile-time value", void 0))
                }, void 0, false, {
                    fileName: "[project]/features/purchase-orders/columns.tsx",
                    lineNumber: 65,
                    columnNumber: 24
                }, ("TURBOPACK compile-time value", void 0)),
            meta: {
                displayName: "Mã đơn nhập hàng"
            },
            size: 150
        },
        {
            id: "supplierName",
            accessorKey: "supplierName",
            header: "Tên Nhà cung cấp",
            cell: ({ row })=>row.supplierName,
            meta: {
                displayName: "Tên Nhà cung cấp"
            }
        },
        {
            id: "branchName",
            accessorKey: "branchName",
            header: "Chi nhánh",
            cell: ({ row })=>row.branchName,
            meta: {
                displayName: "Chi nhánh"
            }
        },
        {
            id: "buyer",
            accessorKey: "buyer",
            header: "Nhân viên",
            cell: ({ row })=>row.buyer,
            meta: {
                displayName: "Nhân viên"
            }
        },
        {
            id: "orderDate",
            accessorKey: "orderDate",
            header: "Ngày đặt hàng",
            cell: ({ row })=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatDate"])(row.orderDate),
            meta: {
                displayName: "Ngày đặt hàng"
            }
        },
        {
            id: "deliveryDate",
            accessorKey: "deliveryDate",
            header: "Ngày giao",
            cell: ({ row })=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatDateCustom"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["parseDate"])(row.deliveryDate ?? ""), 'dd/MM/yyyy'),
            meta: {
                displayName: "Ngày giao"
            }
        },
        {
            id: "shippingFee",
            accessorKey: "shippingFee",
            header: "Phí vận chuyển",
            cell: ({ row })=>formatCurrency(row.shippingFee || 0),
            meta: {
                displayName: "Phí vận chuyển"
            }
        },
        {
            id: "tax",
            accessorKey: "tax",
            header: "Thuế",
            cell: ({ row })=>formatCurrency(row.tax || 0),
            meta: {
                displayName: "Thuế"
            }
        },
        {
            id: "discount",
            accessorKey: "discount",
            header: "Giảm giá",
            cell: ({ row })=>formatCurrency(row.discount || 0),
            meta: {
                displayName: "Giảm giá"
            }
        },
        {
            id: "notes",
            accessorKey: "notes",
            header: "Ghi chú",
            cell: ({ row })=>row.notes || '-',
            meta: {
                displayName: "Ghi chú"
            }
        },
        {
            id: "creatorName",
            accessorKey: "creatorName",
            header: "Người tạo",
            cell: ({ row })=>row.creatorName || '-',
            meta: {
                displayName: "Người tạo"
            }
        },
        {
            id: "grandTotal",
            accessorKey: "grandTotal",
            header: "Tổng tiền",
            cell: ({ row })=>{
                // Tính lại từ lineItems nếu grandTotal = 0
                let total = row.grandTotal;
                if (total === 0 && row.lineItems && row.lineItems.length > 0) {
                    const itemsTotal = row.lineItems.reduce((sum, item)=>{
                        const lineGross = item.quantity * item.unitPrice;
                        const discountAmount = item.discountType === 'percentage' ? lineGross * (item.discount / 100) : item.discount;
                        return sum + (lineGross - discountAmount);
                    }, 0);
                    total = itemsTotal + (row.shippingFee || 0) + (row.tax || 0);
                }
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                    className: "text-body-sm font-semibold",
                    children: formatCurrency(total)
                }, void 0, false, {
                    fileName: "[project]/features/purchase-orders/columns.tsx",
                    lineNumber: 156,
                    columnNumber: 14
                }, ("TURBOPACK compile-time value", void 0));
            },
            meta: {
                displayName: "Tổng tiền"
            }
        },
        {
            id: "status",
            accessorKey: "status",
            header: "Trạng thái ĐH",
            cell: ({ row })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$badge$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Badge"], {
                    variant: statusVariants[row.status],
                    children: row.status
                }, void 0, false, {
                    fileName: "[project]/features/purchase-orders/columns.tsx",
                    lineNumber: 164,
                    columnNumber: 24
                }, ("TURBOPACK compile-time value", void 0)),
            meta: {
                displayName: "Trạng thái ĐH"
            }
        },
        {
            id: "deliveryStatus",
            accessorKey: "deliveryStatus",
            header: "Trạng thái Nhận hàng",
            cell: ({ row })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$badge$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Badge"], {
                    variant: "outline",
                    children: row.deliveryStatus
                }, void 0, false, {
                    fileName: "[project]/features/purchase-orders/columns.tsx",
                    lineNumber: 171,
                    columnNumber: 24
                }, ("TURBOPACK compile-time value", void 0)),
            meta: {
                displayName: "Trạng thái Nhận hàng"
            }
        },
        {
            id: "paymentStatus",
            accessorKey: "paymentStatus",
            header: "Trạng thái Thanh toán",
            cell: ({ row })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$badge$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Badge"], {
                    variant: row.paymentStatus === 'Đã thanh toán' ? 'success' : 'warning',
                    children: row.paymentStatus
                }, void 0, false, {
                    fileName: "[project]/features/purchase-orders/columns.tsx",
                    lineNumber: 178,
                    columnNumber: 24
                }, ("TURBOPACK compile-time value", void 0)),
            meta: {
                displayName: "Trạng thái Thanh toán"
            }
        },
        {
            id: "returnStatus",
            accessorKey: "returnStatus",
            header: "Trạng thái Trả hàng",
            cell: ({ row })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$badge$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Badge"], {
                    variant: "outline",
                    children: row.returnStatus || 'Chưa hoàn trả'
                }, void 0, false, {
                    fileName: "[project]/features/purchase-orders/columns.tsx",
                    lineNumber: 185,
                    columnNumber: 24
                }, ("TURBOPACK compile-time value", void 0)),
            meta: {
                displayName: "Trạng thái Trả hàng"
            }
        },
        {
            id: "refundStatus",
            accessorKey: "refundStatus",
            header: "Trạng thái Hoàn tiền",
            cell: ({ row })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$badge$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Badge"], {
                    variant: "outline",
                    children: row.refundStatus || 'Chưa hoàn tiền'
                }, void 0, false, {
                    fileName: "[project]/features/purchase-orders/columns.tsx",
                    lineNumber: 192,
                    columnNumber: 24
                }, ("TURBOPACK compile-time value", void 0)),
            meta: {
                displayName: "Trạng thái Hoàn tiền"
            }
        },
        {
            id: "actions",
            header: ()=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "text-center",
                    children: "Hành động"
                }, void 0, false, {
                    fileName: "[project]/features/purchase-orders/columns.tsx",
                    lineNumber: 197,
                    columnNumber: 19
                }, ("TURBOPACK compile-time value", void 0)),
            cell: ({ row })=>{
                const isActionable = row.status !== 'Hoàn thành' && row.status !== 'Đã hủy' && row.status !== 'Kết thúc';
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex items-center justify-center",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DropdownMenu"], {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DropdownMenuTrigger"], {
                                asChild: true,
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Button"], {
                                    variant: "ghost",
                                    className: "h-8 w-8 p-0",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "sr-only",
                                            children: "Mở menu"
                                        }, void 0, false, {
                                            fileName: "[project]/features/purchase-orders/columns.tsx",
                                            lineNumber: 205,
                                            columnNumber: 16
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$ellipsis$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__MoreHorizontal$3e$__["MoreHorizontal"], {
                                            className: "h-4 w-4"
                                        }, void 0, false, {
                                            fileName: "[project]/features/purchase-orders/columns.tsx",
                                            lineNumber: 206,
                                            columnNumber: 16
                                        }, ("TURBOPACK compile-time value", void 0))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/features/purchase-orders/columns.tsx",
                                    lineNumber: 204,
                                    columnNumber: 14
                                }, ("TURBOPACK compile-time value", void 0))
                            }, void 0, false, {
                                fileName: "[project]/features/purchase-orders/columns.tsx",
                                lineNumber: 203,
                                columnNumber: 12
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DropdownMenuContent"], {
                                align: "end",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DropdownMenuItem"], {
                                        onClick: (e)=>{
                                            e.stopPropagation();
                                            onPrint(row);
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$printer$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Printer$3e$__["Printer"], {
                                                className: "mr-2 h-4 w-4"
                                            }, void 0, false, {
                                                fileName: "[project]/features/purchase-orders/columns.tsx",
                                                lineNumber: 211,
                                                columnNumber: 16
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            "In đơn nhập hàng"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/features/purchase-orders/columns.tsx",
                                        lineNumber: 210,
                                        columnNumber: 14
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DropdownMenuItem"], {
                                        onClick: (e)=>{
                                            e.stopPropagation();
                                            onPayment(row);
                                        },
                                        disabled: row.paymentStatus === 'Đã thanh toán',
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$credit$2d$card$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__CreditCard$3e$__["CreditCard"], {
                                                className: "mr-2 h-4 w-4"
                                            }, void 0, false, {
                                                fileName: "[project]/features/purchase-orders/columns.tsx",
                                                lineNumber: 218,
                                                columnNumber: 16
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            "Thanh toán"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/features/purchase-orders/columns.tsx",
                                        lineNumber: 214,
                                        columnNumber: 14
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DropdownMenuItem"], {
                                        onClick: (e)=>{
                                            e.stopPropagation();
                                            onReceiveGoods(row);
                                        },
                                        disabled: row.deliveryStatus === 'Đã nhập',
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$package$2d$check$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__PackageCheck$3e$__["PackageCheck"], {
                                                className: "mr-2 h-4 w-4"
                                            }, void 0, false, {
                                                fileName: "[project]/features/purchase-orders/columns.tsx",
                                                lineNumber: 225,
                                                columnNumber: 16
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            "Nhập hàng"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/features/purchase-orders/columns.tsx",
                                        lineNumber: 221,
                                        columnNumber: 14
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DropdownMenuSeparator"], {}, void 0, false, {
                                        fileName: "[project]/features/purchase-orders/columns.tsx",
                                        lineNumber: 228,
                                        columnNumber: 14
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DropdownMenuItem"], {
                                        onClick: (e)=>{
                                            e.stopPropagation();
                                            onCancel(row);
                                        },
                                        disabled: !isActionable,
                                        className: "text-destructive",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$x$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__XCircle$3e$__["XCircle"], {
                                                className: "mr-2 h-4 w-4"
                                            }, void 0, false, {
                                                fileName: "[project]/features/purchase-orders/columns.tsx",
                                                lineNumber: 234,
                                                columnNumber: 16
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            "Hủy đơn"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/features/purchase-orders/columns.tsx",
                                        lineNumber: 229,
                                        columnNumber: 14
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/features/purchase-orders/columns.tsx",
                                lineNumber: 209,
                                columnNumber: 12
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/features/purchase-orders/columns.tsx",
                        lineNumber: 202,
                        columnNumber: 10
                    }, ("TURBOPACK compile-time value", void 0))
                }, void 0, false, {
                    fileName: "[project]/features/purchase-orders/columns.tsx",
                    lineNumber: 201,
                    columnNumber: 8
                }, ("TURBOPACK compile-time value", void 0));
            },
            meta: {
                displayName: "Hành động",
                sticky: "right"
            },
            size: 90
        }
    ];
}),
"[project]/features/purchase-orders/purchase-order-card.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "PurchaseOrderCard",
    ()=>PurchaseOrderCard
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/card.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$badge$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/badge.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/dropdown-menu.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$mobile$2f$touch$2d$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/mobile/touch-button.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$building$2d$2$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Building2$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/building-2.js [app-ssr] (ecmascript) <export default as Building2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$calendar$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Calendar$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/calendar.js [app-ssr] (ecmascript) <export default as Calendar>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$dollar$2d$sign$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__DollarSign$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/dollar-sign.js [app-ssr] (ecmascript) <export default as DollarSign>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$ellipsis$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__MoreHorizontal$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/ellipsis.js [app-ssr] (ecmascript) <export default as MoreHorizontal>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$package$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Package$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/package.js [app-ssr] (ecmascript) <export default as Package>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$printer$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Printer$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/printer.js [app-ssr] (ecmascript) <export default as Printer>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$x$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__XCircle$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/circle-x.js [app-ssr] (ecmascript) <export default as XCircle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$credit$2d$card$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__CreditCard$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/credit-card.js [app-ssr] (ecmascript) <export default as CreditCard>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$package$2d$check$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__PackageCheck$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/package-check.js [app-ssr] (ecmascript) <export default as PackageCheck>");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/date-utils.ts [app-ssr] (ecmascript)");
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
function PurchaseOrderCard({ purchaseOrder: po, onCancel, onPrint, onPayment, onReceiveGoods, onClick }) {
    const getStatusVariant = (status)=>{
        const map = {
            'Đặt hàng': 'secondary',
            'Đang giao dịch': 'default',
            'Hoàn thành': 'default',
            'Đã hủy': 'destructive',
            'Kết thúc': 'outline'
        };
        return map[status] || 'default';
    };
    const getDeliveryStatusVariant = (status)=>{
        const map = {
            'Chưa nhập': 'secondary',
            'Nhập một phần': 'default',
            'Đã nhập': 'default'
        };
        return map[status] || 'default';
    };
    const getPaymentStatusVariant = (status)=>{
        const map = {
            'Chưa thanh toán': 'secondary',
            'Thanh toán một phần': 'default',
            'Đã thanh toán': 'default'
        };
        return map[status] || 'default';
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Card"], {
        className: "hover:shadow-md transition-shadow cursor-pointer",
        onClick: ()=>onClick(po),
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CardContent"], {
            className: "p-4",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex items-center justify-between mb-2",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex items-center gap-2 flex-1 min-w-0",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center gap-2 flex-wrap",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-body-sm font-medium font-mono",
                                        children: po.id
                                    }, void 0, false, {
                                        fileName: "[project]/features/purchase-orders/purchase-order-card.tsx",
                                        lineNumber: 71,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$badge$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Badge"], {
                                        variant: getStatusVariant(po.status),
                                        className: "text-body-xs",
                                        children: po.status
                                    }, void 0, false, {
                                        fileName: "[project]/features/purchase-orders/purchase-order-card.tsx",
                                        lineNumber: 72,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/features/purchase-orders/purchase-order-card.tsx",
                                lineNumber: 70,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/features/purchase-orders/purchase-order-card.tsx",
                            lineNumber: 69,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DropdownMenu"], {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DropdownMenuTrigger"], {
                                    asChild: true,
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$mobile$2f$touch$2d$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TouchButton"], {
                                        variant: "ghost",
                                        size: "sm",
                                        className: "h-8 w-8 p-0 flex-shrink-0",
                                        onClick: (e)=>e.stopPropagation(),
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$ellipsis$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__MoreHorizontal$3e$__["MoreHorizontal"], {
                                            className: "h-4 w-4"
                                        }, void 0, false, {
                                            fileName: "[project]/features/purchase-orders/purchase-order-card.tsx",
                                            lineNumber: 85,
                                            columnNumber: 17
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/features/purchase-orders/purchase-order-card.tsx",
                                        lineNumber: 79,
                                        columnNumber: 15
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/features/purchase-orders/purchase-order-card.tsx",
                                    lineNumber: 78,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DropdownMenuContent"], {
                                    align: "end",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DropdownMenuItem"], {
                                            onClick: (e)=>{
                                                e.stopPropagation();
                                                onPrint(po);
                                            },
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$printer$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Printer$3e$__["Printer"], {
                                                    className: "mr-2 h-4 w-4"
                                                }, void 0, false, {
                                                    fileName: "[project]/features/purchase-orders/purchase-order-card.tsx",
                                                    lineNumber: 95,
                                                    columnNumber: 17
                                                }, this),
                                                "In đơn hàng"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/features/purchase-orders/purchase-order-card.tsx",
                                            lineNumber: 89,
                                            columnNumber: 15
                                        }, this),
                                        po.status !== 'Đã hủy' && po.status !== 'Kết thúc' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
                                            children: [
                                                po.paymentStatus !== 'Đã thanh toán' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DropdownMenuItem"], {
                                                    onClick: (e)=>{
                                                        e.stopPropagation();
                                                        onPayment(po);
                                                    },
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$credit$2d$card$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__CreditCard$3e$__["CreditCard"], {
                                                            className: "mr-2 h-4 w-4"
                                                        }, void 0, false, {
                                                            fileName: "[project]/features/purchase-orders/purchase-order-card.tsx",
                                                            lineNumber: 107,
                                                            columnNumber: 23
                                                        }, this),
                                                        "Thanh toán"
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/features/purchase-orders/purchase-order-card.tsx",
                                                    lineNumber: 101,
                                                    columnNumber: 21
                                                }, this),
                                                po.deliveryStatus !== 'Đã nhập' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DropdownMenuItem"], {
                                                    onClick: (e)=>{
                                                        e.stopPropagation();
                                                        onReceiveGoods(po);
                                                    },
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$package$2d$check$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__PackageCheck$3e$__["PackageCheck"], {
                                                            className: "mr-2 h-4 w-4"
                                                        }, void 0, false, {
                                                            fileName: "[project]/features/purchase-orders/purchase-order-card.tsx",
                                                            lineNumber: 118,
                                                            columnNumber: 23
                                                        }, this),
                                                        "Nhập hàng"
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/features/purchase-orders/purchase-order-card.tsx",
                                                    lineNumber: 112,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DropdownMenuItem"], {
                                                    onClick: (e)=>{
                                                        e.stopPropagation();
                                                        onCancel(po);
                                                    },
                                                    className: "text-destructive",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$x$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__XCircle$3e$__["XCircle"], {
                                                            className: "mr-2 h-4 w-4"
                                                        }, void 0, false, {
                                                            fileName: "[project]/features/purchase-orders/purchase-order-card.tsx",
                                                            lineNumber: 129,
                                                            columnNumber: 21
                                                        }, this),
                                                        "Hủy đơn"
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/features/purchase-orders/purchase-order-card.tsx",
                                                    lineNumber: 122,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/features/purchase-orders/purchase-order-card.tsx",
                                    lineNumber: 88,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/features/purchase-orders/purchase-order-card.tsx",
                            lineNumber: 77,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/features/purchase-orders/purchase-order-card.tsx",
                    lineNumber: 68,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "text-body-sm font-medium mb-1",
                    children: po.supplierName
                }, void 0, false, {
                    fileName: "[project]/features/purchase-orders/purchase-order-card.tsx",
                    lineNumber: 139,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "text-body-xs text-muted-foreground mb-3 flex items-center",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$building$2d$2$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Building2$3e$__["Building2"], {
                            className: "h-3 w-3 mr-1.5 flex-shrink-0"
                        }, void 0, false, {
                            fileName: "[project]/features/purchase-orders/purchase-order-card.tsx",
                            lineNumber: 141,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "truncate",
                            children: po.branchName
                        }, void 0, false, {
                            fileName: "[project]/features/purchase-orders/purchase-order-card.tsx",
                            lineNumber: 142,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/features/purchase-orders/purchase-order-card.tsx",
                    lineNumber: 140,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "border-t mb-3"
                }, void 0, false, {
                    fileName: "[project]/features/purchase-orders/purchase-order-card.tsx",
                    lineNumber: 146,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "space-y-2 mb-3",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex items-center text-body-xs text-muted-foreground",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$calendar$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Calendar$3e$__["Calendar"], {
                                    className: "h-3 w-3 mr-1.5 flex-shrink-0"
                                }, void 0, false, {
                                    fileName: "[project]/features/purchase-orders/purchase-order-card.tsx",
                                    lineNumber: 151,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    children: [
                                        "Đặt hàng: ",
                                        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatDate"])(po.orderDate)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/features/purchase-orders/purchase-order-card.tsx",
                                    lineNumber: 152,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/features/purchase-orders/purchase-order-card.tsx",
                            lineNumber: 150,
                            columnNumber: 11
                        }, this),
                        po.deliveryDate && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex items-center text-body-xs text-muted-foreground",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$package$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Package$3e$__["Package"], {
                                    className: "h-3 w-3 mr-1.5 flex-shrink-0"
                                }, void 0, false, {
                                    fileName: "[project]/features/purchase-orders/purchase-order-card.tsx",
                                    lineNumber: 156,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    children: [
                                        "Dự kiến: ",
                                        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatDate"])(po.deliveryDate)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/features/purchase-orders/purchase-order-card.tsx",
                                    lineNumber: 157,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/features/purchase-orders/purchase-order-card.tsx",
                            lineNumber: 155,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/features/purchase-orders/purchase-order-card.tsx",
                    lineNumber: 149,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex flex-wrap gap-1.5 mb-3",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$badge$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Badge"], {
                            variant: getDeliveryStatusVariant(po.deliveryStatus),
                            className: "text-body-xs",
                            children: po.deliveryStatus
                        }, void 0, false, {
                            fileName: "[project]/features/purchase-orders/purchase-order-card.tsx",
                            lineNumber: 164,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$badge$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Badge"], {
                            variant: getPaymentStatusVariant(po.paymentStatus),
                            className: "text-body-xs",
                            children: po.paymentStatus
                        }, void 0, false, {
                            fileName: "[project]/features/purchase-orders/purchase-order-card.tsx",
                            lineNumber: 167,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/features/purchase-orders/purchase-order-card.tsx",
                    lineNumber: 163,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "border-t mb-3"
                }, void 0, false, {
                    fileName: "[project]/features/purchase-orders/purchase-order-card.tsx",
                    lineNumber: 173,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex items-center justify-between",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "text-body-xs text-muted-foreground",
                            children: "Tổng tiền:"
                        }, void 0, false, {
                            fileName: "[project]/features/purchase-orders/purchase-order-card.tsx",
                            lineNumber: 177,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex items-center gap-1",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$dollar$2d$sign$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__DollarSign$3e$__["DollarSign"], {
                                    className: "h-3 w-3 text-muted-foreground"
                                }, void 0, false, {
                                    fileName: "[project]/features/purchase-orders/purchase-order-card.tsx",
                                    lineNumber: 179,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "text-body-sm font-semibold",
                                    children: formatCurrency(po.grandTotal)
                                }, void 0, false, {
                                    fileName: "[project]/features/purchase-orders/purchase-order-card.tsx",
                                    lineNumber: 180,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/features/purchase-orders/purchase-order-card.tsx",
                            lineNumber: 178,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/features/purchase-orders/purchase-order-card.tsx",
                    lineNumber: 176,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/features/purchase-orders/purchase-order-card.tsx",
            lineNumber: 66,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/features/purchase-orders/purchase-order-card.tsx",
        lineNumber: 62,
        columnNumber: 5
    }, this);
}
}),
"[project]/features/purchase-orders/store.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "usePurchaseOrderStore",
    ()=>usePurchaseOrderStore
]);
// REMOVED: Voucher store no longer exists
// import { useVoucherStore } from '../vouchers/store';
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$inventory$2d$receipts$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/inventory-receipts/store.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$payments$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/payments/store.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$receipts$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/receipts/store.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$employees$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/employees/store.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$purchase$2d$returns$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/purchase-returns/store.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/date-utils.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$cashbook$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/cashbook/store.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$receipt$2d$types$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/settings/receipt-types/store.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2d$factory$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/store-factory.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$purchase$2d$orders$2f$payment$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/purchase-orders/payment-utils.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$products$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/products/store.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/id-types.ts [app-ssr] (ecmascript)");
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
// REMOVED: initialDataOmit transformation - database is source of truth
const initialData = [];
const baseStore = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2d$factory$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createCrudStore"])([], 'purchase-orders', {
    businessIdField: 'id',
    apiEndpoint: '/api/purchase-orders'
});
const runInventoryReceiptBackfill = ()=>{
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$inventory$2d$receipts$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["syncInventoryReceiptsWithPurchaseOrders"])({
        purchaseOrders: baseStore.getState().data,
        products: __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$products$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useProductStore"].getState().data
    });
};
runInventoryReceiptBackfill();
// Re-run backfill whenever purchase orders or products hydrate/update
baseStore.subscribe?.(()=>{
    runInventoryReceiptBackfill();
});
__TURBOPACK__imported__module__$5b$project$5d2f$features$2f$products$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useProductStore"].subscribe?.(()=>{
    runInventoryReceiptBackfill();
});
// Helper functions for ActivityHistory
const getCurrentUserInfo = ()=>{
    const employees = __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$employees$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEmployeeStore"].getState().data;
    // Fallback to system user
    return {
        systemId: 'SYSTEM',
        name: 'Hệ thống'
    };
};
const createHistoryEntry = (action, description, user, metadata)=>({
        id: crypto.randomUUID(),
        action,
        timestamp: new Date(),
        user: {
            systemId: user.systemId,
            name: user.name
        },
        description,
        metadata
    });
const augmentedMethods = {
    addPayment: (purchaseOrderId, payment)=>baseStore.setState((state)=>{
            const { data: allReturns } = __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$purchase$2d$returns$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["usePurchaseReturnStore"].getState();
            const newData = state.data.map((po)=>{
                if (po.systemId === purchaseOrderId) {
                    const poSystemId = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])(po.systemId);
                    const newPayment = {
                        ...payment,
                        id: `PAY_${po.id}_${(po.payments || []).length + 1}`
                    };
                    const updatedPayments = [
                        ...po.payments || [],
                        newPayment
                    ];
                    const totalPaid = updatedPayments.reduce((sum, p)=>sum + p.amount, 0);
                    const totalReturnedValue = allReturns.filter((r)=>r.purchaseOrderSystemId === poSystemId).reduce((sum, r)=>sum + r.totalReturnValue, 0);
                    const actualDebt = po.grandTotal - totalReturnedValue;
                    let newPaymentStatus;
                    if (totalPaid >= actualDebt) {
                        newPaymentStatus = 'Đã thanh toán';
                    } else if (totalPaid > 0) {
                        newPaymentStatus = 'Thanh toán một phần';
                    } else {
                        newPaymentStatus = 'Chưa thanh toán';
                    }
                    let newStatus = po.status;
                    if (po.status !== 'Đã hủy' && po.status !== 'Kết thúc') {
                        // Hoàn thành: đã nhập hết + đã thanh toán hết
                        if (po.deliveryStatus === 'Đã nhập' && newPaymentStatus === 'Đã thanh toán') {
                            newStatus = 'Hoàn thành';
                        } else if (po.deliveryStatus === 'Chưa nhập' && newPaymentStatus === 'Chưa thanh toán') {
                            newStatus = 'Đặt hàng';
                        } else {
                            newStatus = 'Đang giao dịch';
                        }
                    }
                    return {
                        ...po,
                        payments: updatedPayments,
                        paymentStatus: newPaymentStatus,
                        status: newStatus
                    };
                }
                return po;
            });
            return {
                data: newData
            };
        }),
    updatePaymentStatusForPoIds: (poIds)=>{
        baseStore.setState((state)=>{
            const { data: allPayments } = __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$payments$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["usePaymentStore"].getState();
            const { data: allReturns } = __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$purchase$2d$returns$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["usePurchaseReturnStore"].getState();
            const uniquePoIds = [
                ...new Set(poIds)
            ];
            const newData = [
                ...state.data
            ];
            let changed = false;
            uniquePoIds.forEach((poId)=>{
                const poIndex = newData.findIndex((p)=>p.id === poId);
                if (poIndex === -1) return;
                const po = newData[poIndex];
                const poSystemId = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])(po.systemId);
                const totalPaid = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$purchase$2d$orders$2f$payment$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["sumPaymentsForPurchaseOrder"])(allPayments, po);
                const totalReturnedValue = allReturns.filter((r)=>r.purchaseOrderSystemId === poSystemId).reduce((sum, r)=>sum + r.totalReturnValue, 0);
                const actualDebt = po.grandTotal - totalReturnedValue;
                let newPaymentStatus;
                if (totalPaid >= actualDebt) {
                    newPaymentStatus = 'Đã thanh toán';
                } else if (totalPaid > 0) {
                    newPaymentStatus = 'Thanh toán một phần';
                } else {
                    newPaymentStatus = 'Chưa thanh toán';
                }
                let newStatus = po.status;
                if (po.status !== 'Đã hủy' && po.status !== 'Kết thúc') {
                    // Hoàn thành: đã nhập hết + đã thanh toán hết
                    if (po.deliveryStatus === 'Đã nhập' && newPaymentStatus === 'Đã thanh toán') {
                        newStatus = 'Hoàn thành';
                    } else if (po.deliveryStatus === 'Chưa nhập' && newPaymentStatus === 'Chưa thanh toán') {
                        newStatus = 'Đặt hàng';
                    } else {
                        newStatus = 'Đang giao dịch';
                    }
                }
                if (po.paymentStatus !== newPaymentStatus || po.status !== newStatus) {
                    newData[poIndex] = {
                        ...po,
                        paymentStatus: newPaymentStatus,
                        status: newStatus
                    };
                    changed = true;
                }
            });
            return changed ? {
                data: newData
            } : state;
        });
    },
    processInventoryReceipt: (purchaseOrderSystemId)=>{
        baseStore.setState((state)=>{
            const { data: allReceipts } = __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$inventory$2d$receipts$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useInventoryReceiptStore"].getState();
            const poIndex = state.data.findIndex((p)=>p.systemId === purchaseOrderSystemId);
            if (poIndex === -1) return state;
            const po = state.data[poIndex];
            const poReceipts = allReceipts.filter((r)=>r.purchaseOrderSystemId === purchaseOrderSystemId);
            const totalReceivedByProduct = po.lineItems.reduce((acc, lineItem)=>{
                const totalReceived = poReceipts.reduce((sum, receipt)=>{
                    const item = receipt.items.find((i)=>i.productSystemId === lineItem.productSystemId);
                    return sum + (item ? Number(item.receivedQuantity) : 0);
                }, 0);
                acc[lineItem.productSystemId] = totalReceived;
                return acc;
            }, {});
            const allItemsFullyReceived = po.lineItems.every((item)=>(totalReceivedByProduct[item.productSystemId] || 0) >= item.quantity);
            const anyItemReceived = Object.values(totalReceivedByProduct).some((qty)=>qty > 0);
            let newDeliveryStatus;
            if (allItemsFullyReceived) {
                newDeliveryStatus = 'Đã nhập';
            } else if (anyItemReceived) {
                newDeliveryStatus = 'Đã nhập một phần';
            } else {
                newDeliveryStatus = 'Chưa nhập';
            }
            let newStatus = po.status;
            // Chỉ tự động cập nhật status nếu KHÔNG phải trạng thái terminal
            if (po.status !== 'Đã hủy' && po.status !== 'Kết thúc') {
                // Hoàn thành: đã nhập hết + đã thanh toán hết
                if (newDeliveryStatus === 'Đã nhập' && po.paymentStatus === 'Đã thanh toán') {
                    newStatus = 'Hoàn thành';
                } else if (newDeliveryStatus === 'Chưa nhập' && po.paymentStatus === 'Chưa thanh toán') {
                    newStatus = 'Đặt hàng';
                } else {
                    newStatus = 'Đang giao dịch';
                }
            }
            if (po.deliveryStatus !== newDeliveryStatus || po.status !== newStatus) {
                const newData = [
                    ...state.data
                ];
                const updatedPO = {
                    ...po,
                    deliveryStatus: newDeliveryStatus,
                    status: newStatus
                };
                if (po.deliveryStatus === 'Chưa nhập' && newDeliveryStatus !== 'Chưa nhập') {
                    const latestReceipt = poReceipts.sort((a, b)=>new Date(b.receivedDate).getTime() - new Date(a.receivedDate).getTime())[0];
                    if (latestReceipt) {
                        updatedPO.deliveryDate = latestReceipt.receivedDate;
                    }
                }
                newData[poIndex] = updatedPO;
                const latestReceipt = poReceipts.sort((a, b)=>new Date(b.receivedDate).getTime() - new Date(a.receivedDate).getTime())[0];
                const receiptReceiverName = latestReceipt?.receiverName || 'Hệ thống';
                const user = latestReceipt?.receiverSystemId ? __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$employees$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEmployeeStore"].getState().data.find((e)=>e.systemId === latestReceipt.receiverSystemId) : __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$employees$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEmployeeStore"].getState().data.find((e)=>e.fullName === receiptReceiverName);
                // Add to activityHistory
                const historyEntry = createHistoryEntry('status_changed', `Cập nhật trạng thái giao hàng thành "${newDeliveryStatus}" thông qua phiếu nhập kho ${latestReceipt.id}.`, {
                    systemId: user?.systemId || 'SYSTEM',
                    name: receiptReceiverName
                }, {
                    oldValue: po.deliveryStatus,
                    newValue: newDeliveryStatus,
                    field: 'deliveryStatus'
                });
                newData[poIndex] = {
                    ...updatedPO,
                    activityHistory: [
                        ...updatedPO.activityHistory || [],
                        historyEntry
                    ]
                };
                return {
                    data: newData
                };
            }
            return state;
        });
    },
    processReturn: (purchaseOrderId, isFullReturn, newRefundStatus, returnId, creatorName)=>baseStore.setState((state)=>{
            const poIndex = state.data.findIndex((p)=>p.id === purchaseOrderId);
            if (poIndex === -1) return state;
            const po = state.data[poIndex];
            let newReturnStatus = 'Hoàn hàng một phần';
            if (isFullReturn) {
                newReturnStatus = 'Hoàn hàng toàn bộ';
            }
            // QUAN TRỌNG: Không đè status thành "Đã trả hàng"
            // Chỉ cập nhật returnStatus, giữ nguyên status chính (Hoàn thành, Đang giao dịch, etc.)
            // Logic tự động sẽ xử lý status dựa trên deliveryStatus + paymentStatus
            const updatedPO = {
                ...po,
                returnStatus: newReturnStatus,
                // Bỏ dòng: status: newStatus,  
                ...newRefundStatus && {
                    refundStatus: newRefundStatus
                }
            };
            if (returnId && creatorName) {
                const user = __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$employees$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEmployeeStore"].getState().data.find((e)=>e.fullName === creatorName);
                // Add to activityHistory
                const historyEntry = createHistoryEntry('status_changed', `Tạo phiếu hoàn trả ${returnId}, cập nhật trạng thái hoàn trả đơn hàng.`, {
                    systemId: user?.systemId || 'SYSTEM',
                    name: creatorName
                }, {
                    oldValue: po.returnStatus || 'Chưa hoàn trả',
                    newValue: newReturnStatus,
                    field: 'returnStatus'
                });
                updatedPO.activityHistory = [
                    ...updatedPO.activityHistory || [],
                    historyEntry
                ];
            }
            const newData = [
                ...state.data
            ];
            newData[poIndex] = updatedPO;
            return {
                data: newData
            };
        }),
    syncAllPurchaseOrderStatuses: ()=>baseStore.setState((state)=>{
            const { data: allPayments } = __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$payments$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["usePaymentStore"].getState();
            const { data: allReturns } = __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$purchase$2d$returns$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["usePurchaseReturnStore"].getState();
            const newData = state.data.map((po_untyped)=>{
                const po = po_untyped;
                const poSystemId = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])(po.systemId);
                const totalPaid = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$purchase$2d$orders$2f$payment$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["sumPaymentsForPurchaseOrder"])(allPayments, po);
                const totalReturnedValue = allReturns.filter((r)=>r.purchaseOrderSystemId === poSystemId).reduce((sum, r)=>sum + r.totalReturnValue, 0);
                const actualDebt = po.grandTotal - totalReturnedValue;
                let newPaymentStatus;
                if (totalPaid >= actualDebt) {
                    newPaymentStatus = 'Đã thanh toán';
                } else if (totalPaid > 0) {
                    newPaymentStatus = 'Thanh toán một phần';
                } else {
                    newPaymentStatus = 'Chưa thanh toán';
                }
                let newStatus = po.status;
                // Chỉ tự động cập nhật status nếu KHÔNG phải trạng thái terminal (Đã hủy, Kết thúc)
                // Bỏ check "Đã trả hàng" vì đây không còn là status chính nữa
                if (po.status !== 'Đã hủy' && po.status !== 'Kết thúc') {
                    // Hoàn thành: đã nhập hết + đã thanh toán hết
                    if (po.deliveryStatus === 'Đã nhập' && newPaymentStatus === 'Đã thanh toán') {
                        newStatus = 'Hoàn thành';
                    } else if (po.deliveryStatus === 'Chưa nhập' && newPaymentStatus === 'Chưa thanh toán') {
                        newStatus = 'Đặt hàng';
                    } else {
                        newStatus = 'Đang giao dịch';
                    }
                }
                if (po.paymentStatus !== newPaymentStatus || po.status !== newStatus) {
                    return {
                        ...po,
                        paymentStatus: newPaymentStatus,
                        status: newStatus
                    };
                }
                return po;
            });
            const hasChanged = newData.some((po, index)=>po !== state.data[index]);
            return hasChanged ? {
                data: newData
            } : state;
        }),
    finishOrder: (systemId, userId, userName)=>baseStore.setState((state)=>{
            const poIndex = state.data.findIndex((p)=>p.systemId === systemId);
            if (poIndex === -1) return state;
            const po = state.data[poIndex];
            if (po.status === 'Kết thúc' || po.status === 'Đã hủy') return state;
            // Add to activityHistory
            const historyEntry = createHistoryEntry('ended', `Đã kết thúc đơn hàng.`, {
                systemId: userId,
                name: userName
            }, {
                oldValue: po.status,
                newValue: 'Kết thúc',
                field: 'status'
            });
            const updatedPO = {
                ...po,
                status: 'Kết thúc',
                activityHistory: [
                    ...po.activityHistory || [],
                    historyEntry
                ]
            };
            const newData = [
                ...state.data
            ];
            newData[poIndex] = updatedPO;
            return {
                data: newData
            };
        }),
    cancelOrder: (systemId, userId, userName)=>baseStore.setState((state)=>{
            const po = state.data.find((p)=>p.systemId === systemId);
            if (!po || [
                'Hoàn thành',
                'Đã hủy',
                'Kết thúc'
            ].includes(po.status)) {
                console.warn(`Attempted to cancel an order with status: ${po?.status}`);
                return state;
            }
            const { data: allPayments } = __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$payments$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["usePaymentStore"].getState();
            const totalPaid = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$purchase$2d$orders$2f$payment$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["sumPaymentsForPurchaseOrder"])(allPayments, po);
            if (totalPaid > 0) {
                const { accounts } = __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$cashbook$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCashbookStore"].getState();
                const { data: receiptTypes } = __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$receipt$2d$types$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useReceiptTypeStore"].getState();
                const { add: addReceipt } = __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$receipts$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useReceiptStore"].getState();
                const refundCategory = receiptTypes.find((rt)=>rt.name === 'Nhà cung cấp hoàn tiền');
                const targetAccount = accounts.find((acc)=>acc.type === 'cash' && acc.branchSystemId === po.branchSystemId) || accounts.find((acc)=>acc.type === 'cash');
                if (refundCategory && targetAccount) {
                    const newReceipt = {
                        id: '',
                        date: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toISODateTime"])(new Date()),
                        amount: totalPaid,
                        payerType: 'Nhà cung cấp',
                        payerTypeSystemId: 'NHACUNGCAP',
                        payerTypeName: 'Nhà cung cấp',
                        payerName: po.supplierName,
                        payerSystemId: po.supplierSystemId,
                        description: `Nhận hoàn tiền từ NCC cho đơn hàng ${po.id} bị hủy.`,
                        paymentMethod: 'Tiền mặt',
                        paymentMethodSystemId: 'CASH',
                        paymentMethodName: 'Tiền mặt',
                        accountSystemId: targetAccount.systemId,
                        paymentReceiptTypeSystemId: refundCategory.systemId,
                        paymentReceiptTypeName: refundCategory.name,
                        branchSystemId: po.branchSystemId,
                        branchName: po.branchName,
                        createdBy: userName,
                        createdAt: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toISODateTime"])(new Date()),
                        status: 'completed',
                        category: 'other',
                        affectsDebt: true,
                        purchaseOrderSystemId: po.systemId,
                        purchaseOrderId: po.id,
                        originalDocumentId: po.id
                    };
                    addReceipt(newReceipt);
                } else {
                    console.error("Không thể tạo phiếu thu hoàn tiền: Thiếu loại phiếu 'Nhà cung cấp hoàn tiền' hoặc tài khoản quỹ tiền mặt.");
                }
            }
            // Add to activityHistory
            const historyEntry = createHistoryEntry('cancelled', `Đã hủy đơn hàng.`, {
                systemId: userId,
                name: userName
            }, {
                oldValue: po.status,
                newValue: 'Đã hủy',
                field: 'status'
            });
            const updatedPO = {
                ...po,
                status: 'Đã hủy',
                activityHistory: [
                    ...po.activityHistory || [],
                    historyEntry
                ]
            };
            return {
                data: state.data.map((item)=>item.systemId === systemId ? updatedPO : item)
            };
        }),
    bulkCancel: (systemIds, userId, userName)=>{
        systemIds.forEach((systemId)=>{
            augmentedMethods.cancelOrder(systemId, userId, userName);
        });
    },
    printPurchaseOrders: (systemIds)=>{
        // Placeholder for print functionality
        console.log('Printing purchase orders:', systemIds);
    // TODO: Implement actual print logic
    }
};
const usePurchaseOrderStore = ()=>{
    const state = baseStore();
    return {
        ...state,
        ...augmentedMethods
    };
};
// Export getState for non-hook usage
usePurchaseOrderStore.getState = ()=>{
    const state = baseStore.getState();
    return {
        ...state,
        ...augmentedMethods
    };
};
}),
"[project]/features/purchase-orders/page.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "PurchaseOrdersPage",
    ()=>PurchaseOrdersPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$router$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/router.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/date-utils.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$purchase$2d$orders$2f$hooks$2f$use$2d$purchase$2d$orders$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/purchase-orders/hooks/use-purchase-orders.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$purchase$2d$orders$2f$payment$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/purchase-orders/payment-utils.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$branches$2f$hooks$2f$use$2d$branches$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/settings/branches/hooks/use-branches.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$purchase$2d$orders$2f$columns$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/purchase-orders/columns.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$data$2d$table$2f$responsive$2d$data$2d$table$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/data-table/responsive-data-table.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$data$2d$table$2f$data$2d$table$2d$column$2d$toggle$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/data-table/data-table-column-toggle.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$layout$2f$page$2d$toolbar$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/layout/page-toolbar.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$layout$2f$page$2d$filters$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/layout/page-filters.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$input$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/input.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$purchase$2d$orders$2f$purchase$2d$order$2d$card$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/purchase-orders/purchase-order-card.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$contexts$2f$breakpoint$2d$context$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/contexts/breakpoint-context.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/card.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$alert$2d$dialog$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/alert-dialog.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/button.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$plus$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__PlusCircle$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/circle-plus.js [app-ssr] (ecmascript) <export default as PlusCircle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$fuse$2e$js$2f$dist$2f$fuse$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/fuse.js/dist/fuse.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$contexts$2f$page$2d$header$2d$context$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/contexts/page-header-context.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/select.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$payments$2f$hooks$2f$use$2d$payments$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/payments/hooks/use-payments.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$suppliers$2f$hooks$2f$use$2d$suppliers$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/features/suppliers/hooks/use-suppliers.ts [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$suppliers$2f$hooks$2f$use$2d$all$2d$suppliers$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/suppliers/hooks/use-all-suppliers.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$inventory$2d$receipts$2f$hooks$2f$use$2d$inventory$2d$receipts$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/inventory-receipts/hooks/use-inventory-receipts.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$products$2f$hooks$2f$use$2d$products$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/products/hooks/use-products.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$stock$2d$history$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/stock-history/store.ts [app-ssr] (ecmascript)"); // Keep for now - no RQ hook
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$cashbook$2f$hooks$2f$use$2d$cashbook$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/cashbook/hooks/use-cashbook.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$payments$2f$types$2f$hooks$2f$use$2d$payment$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/settings/payments/types/hooks/use-payment-types.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$purchase$2d$returns$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/purchase-returns/store.ts [app-ssr] (ecmascript)"); // Keep for now - no RQ hook
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$purchase$2d$orders$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/purchase-orders/store.ts [app-ssr] (ecmascript)"); // For processInventoryReceipt
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/sonner/dist/index.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$contexts$2f$auth$2d$context$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/contexts/auth-context.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/dialog.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$label$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/label.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$textarea$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/textarea.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$table$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/table.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/id-types.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$store$2d$info$2f$hooks$2f$use$2d$store$2d$info$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/settings/store-info/hooks/use-store-info.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$use$2d$print$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/use-print.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2f$purchase$2d$order$2d$print$2d$helper$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/lib/print/purchase-order-print-helper.ts [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$mappers$2f$purchase$2d$order$2e$mapper$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/print-mappers/purchase-order.mapper.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$shared$2f$simple$2d$print$2d$options$2d$dialog$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/shared/simple-print-options-dialog.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$shared$2f$generic$2d$import$2d$dialog$2d$v2$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/shared/generic-import-dialog-v2.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$shared$2f$generic$2d$export$2d$dialog$2d$v2$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/shared/generic-export-dialog-v2.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$import$2d$export$2f$configs$2f$purchase$2d$order$2e$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/import-export/configs/purchase-order.config.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$spreadsheet$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__FileSpreadsheet$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/file-spreadsheet.js [app-ssr] (ecmascript) <export default as FileSpreadsheet>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$download$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Download$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/download.js [app-ssr] (ecmascript) <export default as Download>");
var __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$use$2d$column$2d$visibility$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/hooks/use-column-visibility.ts [app-ssr] (ecmascript)");
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
function PurchaseOrdersPage() {
    // React Query hooks
    const { data: purchaseOrdersData } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$purchase$2d$orders$2f$hooks$2f$use$2d$purchase$2d$orders$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["usePurchaseOrders"])();
    const purchaseOrders = purchaseOrdersData?.data || [];
    const { update: updatePurchaseOrderMutation } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$purchase$2d$orders$2f$hooks$2f$use$2d$purchase$2d$orders$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["usePurchaseOrderMutations"])();
    const { data: branchesData } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$branches$2f$hooks$2f$use$2d$branches$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useAllBranches"])();
    const branches = branchesData?.data || [];
    const { data: suppliersData } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$suppliers$2f$hooks$2f$use$2d$all$2d$suppliers$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useAllSuppliers"])();
    const suppliers = suppliersData || [];
    const { data: storeInfoData } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$store$2d$info$2f$hooks$2f$use$2d$store$2d$info$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useStoreInfo"])();
    const storeInfo = storeInfoData || null;
    // Helper functions
    const findBranchById = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"]((systemId)=>{
        return branches.find((b)=>b.systemId === systemId);
    }, [
        branches
    ]);
    const findSupplierById = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"]((systemId)=>{
        return suppliers.find((s)=>s.systemId === systemId);
    }, [
        suppliers
    ]);
    // Legacy functions - create wrappers
    const cancelOrder = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"]((systemId, reason)=>{
        updatePurchaseOrderMutation.mutate({
            systemId,
            data: {
                status: 'Đã hủy',
                notes: reason
            }
        });
    }, [
        updatePurchaseOrderMutation
    ]);
    const bulkCancel = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"]((systemIds, reason)=>{
        systemIds.forEach((id)=>cancelOrder(id, reason));
    }, [
        cancelOrder
    ]);
    // Sync not needed with React Query - data updates automatically
    const syncAllPurchaseOrderStatuses = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"](()=>{
    // No-op - React Query handles data freshness
    }, []);
    const { print } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$use$2d$print$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["usePrint"])();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRouter"])();
    const { isMobile } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$contexts$2f$breakpoint$2d$context$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useBreakpoint"])();
    // Sync payment statuses when component mounts hoặc khi vouchers thay đổi
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"](()=>{
        syncAllPurchaseOrderStatuses();
    }, [
        syncAllPurchaseOrderStatuses
    ]);
    const headerActions = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"](()=>[
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Button"], {
                className: "h-9",
                size: "sm",
                onClick: ()=>router.push(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$router$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ROUTES"].PROCUREMENT.PURCHASE_ORDER_NEW),
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$plus$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__PlusCircle$3e$__["PlusCircle"], {
                        className: "mr-2 h-4 w-4"
                    }, void 0, false, {
                        fileName: "[project]/features/purchase-orders/page.tsx",
                        lineNumber: 152,
                        columnNumber: 7
                    }, this),
                    "Tạo đơn nhập hàng"
                ]
            }, "add", true, {
                fileName: "[project]/features/purchase-orders/page.tsx",
                lineNumber: 146,
                columnNumber: 5
            }, this)
        ], [
        router
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$contexts$2f$page$2d$header$2d$context$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["usePageHeader"])({
        title: "Đơn nhập hàng",
        breadcrumb: [
            {
                label: 'Trang chủ',
                href: '/',
                isCurrent: false
            },
            {
                label: 'Đơn nhập hàng',
                href: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$router$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ROUTES"].PROCUREMENT.PURCHASE_ORDERS,
                isCurrent: true
            }
        ],
        actions: headerActions,
        showBackButton: false
    });
    // Data stores for actions
    const { data: paymentsData } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$payments$2f$hooks$2f$use$2d$payments$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["usePayments"])();
    const allPayments = paymentsData?.data || [];
    const { create: addPaymentMutation } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$payments$2f$hooks$2f$use$2d$payments$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["usePaymentMutations"])();
    const { data: receiptsData } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$inventory$2d$receipts$2f$hooks$2f$use$2d$inventory$2d$receipts$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useInventoryReceipts"])();
    const allReceipts = receiptsData?.data || [];
    const { create: addReceiptMutation } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$inventory$2d$receipts$2f$hooks$2f$use$2d$inventory$2d$receipts$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useInventoryReceiptMutations"])();
    const addInventoryReceipt = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"]((data)=>{
        return addReceiptMutation.mutateAsync(data);
    }, [
        addReceiptMutation
    ]);
    const { data: productsData } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$products$2f$hooks$2f$use$2d$products$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useProducts"])();
    const allProducts = productsData?.data || [];
    const { update: updateProductMutation } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$products$2f$hooks$2f$use$2d$products$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useProductMutations"])();
    const findProductById = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"]((systemId)=>{
        return allProducts.find((p)=>p.systemId === systemId);
    }, [
        allProducts
    ]);
    const updateInventory = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"]((systemId, branchSystemId, quantityChange)=>{
        const product = findProductById(systemId);
        if (product) {
            const currentInventory = product.inventoryByBranch || {};
            const currentQuantity = currentInventory[branchSystemId] || 0;
            updateProductMutation.mutate({
                systemId,
                inventoryByBranch: {
                    ...currentInventory,
                    [branchSystemId]: currentQuantity + quantityChange
                }
            });
        }
    }, [
        findProductById,
        updateProductMutation
    ]);
    const { addEntry: addStockHistoryEntry } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$stock$2d$history$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useStockHistoryStore"])();
    const { processInventoryReceipt } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$purchase$2d$orders$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["usePurchaseOrderStore"])();
    const { data: cashbookData } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$cashbook$2f$hooks$2f$use$2d$cashbook$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCashbookAccounts"])();
    const accounts = cashbookData || [];
    const { data: paymentTypesData } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$payments$2f$types$2f$hooks$2f$use$2d$payment$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["usePaymentTypes"])();
    const paymentTypes = paymentTypesData?.data || [];
    const { employee: loggedInUser } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$contexts$2f$auth$2d$context$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useAuth"])();
    const { add: addPurchaseReturn, data: allPurchaseReturns } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$purchase$2d$returns$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["usePurchaseReturnStore"])();
    const currentUserSystemId = loggedInUser?.systemId ?? 'SYSTEM';
    const currentUserName = loggedInUser?.fullName ?? 'Hệ thống';
    const [rowSelection, setRowSelection] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"]({});
    const [cancelDialogState, setCancelDialogState] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"]({
        isOpen: false,
        po: null
    });
    const [isBulkPayAlertOpen, setIsBulkPayAlertOpen] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"](false);
    const [showImportDialog, setShowImportDialog] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"](false);
    const [showExportDialog, setShowExportDialog] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"](false);
    const [receiveDialogState, setReceiveDialogState] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"]({
        isOpen: false,
        purchaseOrder: null,
        receivedDate: '',
        targetBranchSystemId: null,
        targetBranchName: '',
        warehouseName: '',
        documentCode: '',
        notes: '',
        items: []
    });
    const [pendingReceiveQueue, setPendingReceiveQueue] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"]([]);
    const [isSubmittingReceive, setIsSubmittingReceive] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"](false);
    const [sorting, setSorting] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"]({
        id: 'createdAt',
        desc: true
    });
    const [globalFilter, setGlobalFilter] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"]('');
    const [branchFilter, setBranchFilter] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"]('all');
    const [statusFilter, setStatusFilter] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"]('all');
    const [paymentStatusFilter, setPaymentStatusFilter] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"]('all');
    const [pagination, setPagination] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"]({
        pageIndex: 0,
        pageSize: 10
    });
    // Get initial column visibility from columns
    const cols = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"](()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$purchase$2d$orders$2f$columns$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getColumns"])(()=>{}, ()=>{}, ()=>{}, ()=>{}, []), []);
    const defaultVisibility = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"](()=>{
        const initial = {};
        cols.forEach((c)=>{
            if (c.id) initial[c.id] = true;
        });
        return initial;
    }, [
        cols
    ]);
    // Use hook for column visibility (database-backed)
    const [columnVisibility, setColumnVisibility] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$use$2d$column$2d$visibility$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useColumnVisibility"])('purchase-orders', defaultVisibility);
    const [columnOrder, setColumnOrder] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"]([]);
    const [pinnedColumns, setPinnedColumns] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"]([]);
    // Mobile infinite scroll state
    const [mobileLoadedCount, setMobileLoadedCount] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"](20);
    // Reset mobile loaded count when filters change
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"](()=>{
        setMobileLoadedCount(20);
    }, [
        globalFilter,
        branchFilter,
        statusFilter,
        paymentStatusFilter
    ]);
    const handleCancelRequest = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"]((po)=>{
        const totalPaid = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$purchase$2d$orders$2f$payment$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["sumPaymentsForPurchaseOrder"])(allPayments, po);
        const hasBeenDelivered = po.deliveryStatus !== 'Chưa nhập';
        setCancelDialogState({
            isOpen: true,
            po: po,
            totalPaid: totalPaid,
            willCreateReturn: hasBeenDelivered
        });
    }, [
        allPayments
    ]);
    const confirmCancel = ()=>{
        if (!cancelDialogState.po) return;
        const po = cancelDialogState.po;
        if (cancelDialogState.willCreateReturn) {
            const poSystemId = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])(po.systemId);
            const receiptsForPO = allReceipts.filter((r)=>r.purchaseOrderSystemId === poSystemId);
            const returnsForPO = allPurchaseReturns.filter((pr)=>pr.purchaseOrderSystemId === poSystemId);
            const returnItems = po.lineItems.map((item)=>{
                const totalReceived = receiptsForPO.reduce((sum, receipt)=>{
                    const receiptItem = receipt.items.find((i)=>i.productSystemId === item.productSystemId);
                    return sum + (receiptItem ? Number(receiptItem.receivedQuantity) : 0);
                }, 0);
                const totalReturned = returnsForPO.reduce((sum, pr)=>{
                    const returnItem = pr.items.find((i)=>i.productSystemId === item.productSystemId);
                    return sum + (returnItem ? returnItem.returnQuantity : 0);
                }, 0);
                const returnableQuantity = totalReceived - totalReturned;
                if (returnableQuantity <= 0) {
                    return null;
                }
                return {
                    productSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])(item.productSystemId),
                    productId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])(item.productId),
                    productName: item.productName,
                    orderedQuantity: item.quantity,
                    returnQuantity: returnableQuantity,
                    unitPrice: item.unitPrice
                };
            }).filter((item)=>Boolean(item));
            if (returnItems.length > 0) {
                const totalReturnValue = returnItems.reduce((sum, item)=>sum + item.returnQuantity * item.unitPrice, 0);
                addPurchaseReturn({
                    id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])(''),
                    purchaseOrderSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])(po.systemId),
                    purchaseOrderId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])(po.id),
                    supplierSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])(po.supplierSystemId),
                    supplierName: po.supplierName,
                    branchSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])(po.branchSystemId),
                    branchName: po.branchName,
                    returnDate: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toISODate"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getCurrentDate"])()),
                    reason: `Tự động tạo khi hủy đơn nhập hàng ${po.id}`,
                    items: returnItems,
                    totalReturnValue,
                    refundAmount: 0,
                    refundMethod: '',
                    creatorName: currentUserName
                });
            }
        }
        cancelOrder(po.systemId, `Hủy bởi ${currentUserName}`);
        setCancelDialogState({
            isOpen: false,
            po: null
        });
    };
    const requireLoggedInEmployee = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"](()=>{
        if (!loggedInUser) {
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toast"].error('Chưa xác định người nhận', {
                description: 'Vui lòng đăng nhập để ghi nhận người nhập hàng.'
            });
            return false;
        }
        return true;
    }, [
        loggedInUser,
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toast"]
    ]);
    const computeReceivableItems = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"]((po)=>{
        const relatedReceipts = allReceipts.filter((r)=>r.purchaseOrderSystemId === (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])(po.systemId));
        return po.lineItems.map((item)=>{
            const receivedQty = relatedReceipts.reduce((sum, receipt)=>{
                const receiptItem = receipt.items.find((i)=>i.productSystemId === item.productSystemId);
                return sum + (receiptItem ? Number(receiptItem.receivedQuantity) : 0);
            }, 0);
            const remaining = Math.max(item.quantity - receivedQty, 0);
            return {
                productSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])(item.productSystemId),
                productId: item.productId,
                productName: item.productName,
                orderedQuantity: item.quantity,
                remainingQuantity: remaining,
                receiveQuantity: remaining,
                unitPrice: item.unitPrice
            };
        }).filter((item)=>item.remainingQuantity > 0);
    }, [
        allReceipts
    ]);
    const openReceiveDialogForOrder = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"]((po, presetItems)=>{
        const computedItems = presetItems ?? computeReceivableItems(po);
        if (computedItems.length === 0) {
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toast"].error('Đơn đã nhận đủ', {
                description: `Đơn ${po.id} không còn số lượng cần nhập`
            });
            return false;
        }
        const branchMatch = branches.find((b)=>b.systemId === po.branchSystemId);
        const fallbackBranch = branchMatch ?? branches[0];
        const targetBranchId = fallbackBranch?.systemId ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])(fallbackBranch.systemId) : po.branchSystemId ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])(po.branchSystemId) : null;
        const targetBranchName = fallbackBranch?.name || po.branchName || 'Chưa xác định';
        setReceiveDialogState({
            isOpen: true,
            purchaseOrder: po,
            receivedDate: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatDateCustom"])(new Date(), "yyyy-MM-dd'T'HH:mm"),
            targetBranchSystemId: targetBranchId,
            targetBranchName,
            warehouseName: po.branchName ? `Kho ${po.branchName}` : '',
            documentCode: '',
            notes: '',
            items: computedItems
        });
        return true;
    }, [
        branches,
        computeReceivableItems,
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toast"]
    ]);
    const closeReceiveDialog = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"](()=>{
        setReceiveDialogState({
            isOpen: false,
            purchaseOrder: null,
            receivedDate: '',
            targetBranchSystemId: null,
            targetBranchName: '',
            warehouseName: '',
            documentCode: '',
            notes: '',
            items: []
        });
        setPendingReceiveQueue([]);
    }, []);
    const beginReceiveFlow = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"]((orders)=>{
        if (!requireLoggedInEmployee()) return;
        const receivableEntries = orders.map((po)=>({
                po,
                items: computeReceivableItems(po)
            })).filter((entry)=>entry.items.length > 0);
        if (receivableEntries.length === 0) {
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toast"])('Không có đơn hợp lệ', {
                description: 'Các đơn đã chọn đều đã nhập đủ hàng.'
            });
            return;
        }
        const [firstEntry, ...restEntries] = receivableEntries;
        setPendingReceiveQueue(restEntries.map((entry)=>entry.po));
        openReceiveDialogForOrder(firstEntry.po, firstEntry.items);
    }, [
        computeReceivableItems,
        openReceiveDialogForOrder,
        requireLoggedInEmployee,
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toast"]
    ]);
    const handleReceiveQuantityChange = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"]((productSystemId, value)=>{
        setReceiveDialogState((prev)=>({
                ...prev,
                items: prev.items.map((item)=>item.productSystemId === productSystemId ? {
                        ...item,
                        receiveQuantity: Math.min(Math.max(value, 0), item.remainingQuantity)
                    } : item)
            }));
    }, []);
    const handleReceiveFieldChange = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"]((field, value)=>{
        setReceiveDialogState((prev)=>({
                ...prev,
                [field]: value
            }));
    }, []);
    const handleReceiveBranchChange = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"]((branchSystemId)=>{
        const branch = branches.find((b)=>b.systemId === branchSystemId);
        const nextSystemId = branch?.systemId ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])(branch.systemId) : branchSystemId ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])(branchSystemId) : null;
        setReceiveDialogState((prev)=>({
                ...prev,
                targetBranchSystemId: nextSystemId,
                targetBranchName: branch?.name || prev.targetBranchName
            }));
    }, [
        branches
    ]);
    const handleSubmitReceiveDialog = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"](async ()=>{
        if (!receiveDialogState.purchaseOrder || !requireLoggedInEmployee()) {
            return;
        }
        if (!receiveDialogState.targetBranchSystemId) {
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toast"].error('Chưa chọn chi nhánh', {
                description: 'Vui lòng chọn chi nhánh nhận hàng trước khi lưu phiếu.'
            });
            return;
        }
        const itemsToReceive = receiveDialogState.items.filter((item)=>item.receiveQuantity > 0).map((item)=>({
                productSystemId: item.productSystemId,
                productId: item.productId,
                productName: item.productName,
                orderedQuantity: item.orderedQuantity,
                receivedQuantity: item.receiveQuantity,
                unitPrice: item.unitPrice
            }));
        if (itemsToReceive.length === 0) {
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toast"].error('Chưa chọn số lượng', {
                description: 'Vui lòng nhập số lượng thực nhận cho ít nhất một sản phẩm.'
            });
            return;
        }
        setIsSubmittingReceive(true);
        try {
            const normalizedDate = receiveDialogState.receivedDate ? receiveDialogState.receivedDate.replace('T', ' ') : (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatDateCustom"])(new Date(), 'yyyy-MM-dd HH:mm');
            const branchSystemId = receiveDialogState.targetBranchSystemId;
            const receiptPayload = {
                id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])(receiveDialogState.documentCode?.trim() || ''),
                purchaseOrderSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])(receiveDialogState.purchaseOrder.systemId),
                purchaseOrderId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])(receiveDialogState.purchaseOrder.id || receiveDialogState.purchaseOrder.systemId),
                supplierSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])(receiveDialogState.purchaseOrder.supplierSystemId),
                supplierName: receiveDialogState.purchaseOrder.supplierName,
                receivedDate: normalizedDate,
                receiverSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])(currentUserSystemId),
                receiverName: currentUserName,
                notes: receiveDialogState.notes,
                branchSystemId,
                branchName: receiveDialogState.targetBranchName,
                warehouseName: receiveDialogState.warehouseName,
                items: itemsToReceive.map((item)=>({
                        productSystemId: item.productSystemId,
                        productId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])(item.productId || ''),
                        productName: item.productName,
                        orderedQuantity: item.orderedQuantity,
                        receivedQuantity: item.receivedQuantity,
                        unitPrice: item.unitPrice
                    }))
            };
            const createdReceipt = await addInventoryReceipt(receiptPayload);
            itemsToReceive.forEach((item)=>{
                const productBeforeUpdate = findProductById(item.productSystemId);
                const oldStock = productBeforeUpdate?.inventoryByBranch?.[branchSystemId] || 0;
                updateInventory(item.productSystemId, branchSystemId, item.receivedQuantity);
                addStockHistoryEntry({
                    productId: item.productSystemId,
                    date: new Date().toISOString(),
                    employeeName: currentUserName,
                    action: `Nhập hàng từ NCC (${receiveDialogState.purchaseOrder?.id})`,
                    quantityChange: item.receivedQuantity,
                    newStockLevel: oldStock + item.receivedQuantity,
                    documentId: createdReceipt.id,
                    branch: receiveDialogState.targetBranchName,
                    branchSystemId
                });
            });
            processInventoryReceipt(receiveDialogState.purchaseOrder.systemId);
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toast"].success('Đã lưu phiếu nhập', {
                description: `Hoàn tất nhập hàng cho đơn ${receiveDialogState.purchaseOrder.id}.`
            });
            if (pendingReceiveQueue.length > 0) {
                const [next, ...rest] = pendingReceiveQueue;
                setPendingReceiveQueue(rest);
                openReceiveDialogForOrder(next);
            } else {
                closeReceiveDialog();
            }
        } finally{
            setIsSubmittingReceive(false);
        }
    }, [
        receiveDialogState,
        requireLoggedInEmployee,
        currentUserSystemId,
        currentUserName,
        addInventoryReceipt,
        findProductById,
        updateInventory,
        addStockHistoryEntry,
        processInventoryReceipt,
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toast"],
        pendingReceiveQueue,
        openReceiveDialogForOrder,
        closeReceiveDialog
    ]);
    const handlePrint = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"]((po)=>{
        // Use helper to prepare print data
        const branch = findBranchById(po.branchSystemId);
        const supplier = findSupplierById(po.supplierSystemId);
        const storeSettings = branch ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2f$purchase$2d$order$2d$print$2d$helper$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createStoreSettings"])(branch) : (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2f$purchase$2d$order$2d$print$2d$helper$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createStoreSettings"])(storeInfo);
        const poData = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2f$purchase$2d$order$2d$print$2d$helper$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["convertPurchaseOrderForPrint"])(po, {
            branch,
            supplier
        });
        print('purchase-order', {
            data: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$mappers$2f$purchase$2d$order$2e$mapper$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["mapPurchaseOrderToPrintData"])(poData, storeSettings),
            lineItems: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$mappers$2f$purchase$2d$order$2e$mapper$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["mapPurchaseOrderLineItems"])(poData.items)
        });
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toast"])(`Đang in đơn nhập hàng ${po.id}`);
    }, [
        findBranchById,
        findSupplierById,
        storeInfo,
        print
    ]);
    const handlePayment = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"]((po)=>{
        // TODO: Implement payment dialog/modal
        router.push(`/purchase-orders/${po.systemId}`);
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toast"])(`Mở trang thanh toán cho đơn ${po.id}`);
    }, [
        router,
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toast"]
    ]);
    const handleReceiveGoods = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"]((po)=>{
        beginReceiveFlow([
            po
        ]);
    }, [
        beginReceiveFlow
    ]);
    // Print dialog state
    const [isPrintDialogOpen, setIsPrintDialogOpen] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"](false);
    const [pendingPrintPOs, setPendingPrintPOs] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"]([]);
    const { printMultiple } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$use$2d$print$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["usePrint"])();
    // Bulk actions - open print dialog
    const handleBulkPrint = ()=>{
        const selectedIds = Object.keys(rowSelection).filter((id)=>rowSelection[id]);
        if (selectedIds.length === 0) {
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toast"].error('Chưa chọn đơn hàng', {
                description: 'Vui lòng chọn ít nhất một đơn hàng'
            });
            return;
        }
        const selectedPOs = purchaseOrders.filter((p)=>selectedIds.includes(p.systemId));
        setPendingPrintPOs(selectedPOs);
        setIsPrintDialogOpen(true);
    };
    // Handle print confirm from dialog
    const handlePrintConfirm = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"]((options)=>{
        const { branchSystemId, paperSize } = options;
        const printOptionsList = pendingPrintPOs.map((po)=>{
            const branch = branchSystemId ? findBranchById(branchSystemId) : findBranchById(po.branchSystemId);
            const supplier = findSupplierById(po.supplierSystemId);
            const storeSettings = branch ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2f$purchase$2d$order$2d$print$2d$helper$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createStoreSettings"])(branch) : (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2f$purchase$2d$order$2d$print$2d$helper$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createStoreSettings"])(storeInfo);
            const poData = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2f$purchase$2d$order$2d$print$2d$helper$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["convertPurchaseOrderForPrint"])(po, {
                branch,
                supplier
            });
            return {
                data: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$mappers$2f$purchase$2d$order$2e$mapper$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["mapPurchaseOrderToPrintData"])(poData, storeSettings),
                lineItems: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$print$2d$mappers$2f$purchase$2d$order$2e$mapper$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["mapPurchaseOrderLineItems"])(poData.items),
                paperSize
            };
        });
        printMultiple('purchase-order', printOptionsList);
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toast"].success('Đã gửi lệnh in', {
            description: pendingPrintPOs.map((p)=>p.id).join(', ')
        });
        setRowSelection({});
        setPendingPrintPOs([]);
    }, [
        pendingPrintPOs,
        findBranchById,
        findSupplierById,
        storeInfo,
        printMultiple
    ]);
    const handleBulkCancel = ()=>{
        const selectedIds = Object.keys(rowSelection).filter((id)=>rowSelection[id]);
        if (selectedIds.length === 0) {
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toast"].error('Chưa chọn đơn hàng', {
                description: 'Vui lòng chọn ít nhất một đơn hàng'
            });
            return;
        }
        bulkCancel(selectedIds, `Hủy bởi ${currentUserName}`);
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toast"].success('Đã hủy', {
            description: `Đã hủy ${selectedIds.length} đơn nhập hàng`
        });
        setRowSelection({});
    };
    const allSelectedRows = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"](()=>purchaseOrders.filter((po)=>rowSelection[po.systemId]), [
        purchaseOrders,
        rowSelection
    ]);
    const selectedOrders = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"](()=>{
        return purchaseOrders.filter((o)=>rowSelection[o.systemId]);
    }, [
        purchaseOrders,
        rowSelection
    ]);
    const numSelected = Object.keys(rowSelection).length;
    const confirmBulkPay = ()=>{
        const paymentCategory = paymentTypes.find((pt)=>pt.name === 'Thanh toán cho đơn nhập hàng');
        const paymentMethodName = 'Chuyển khoản';
        const paymentMethodSystemId = 'BANK_TRANSFER';
        let totalPaymentsCreated = 0;
        allSelectedRows.forEach((po)=>{
            const totalPaid = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$purchase$2d$orders$2f$payment$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["sumPaymentsForPurchaseOrder"])(allPayments, po);
            const totalReturnValue = allPurchaseReturns.filter((r)=>r.purchaseOrderSystemId === (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])(po.systemId)).reduce((sum, r)=>sum + r.totalReturnValue, 0);
            const actualDebt = Math.max(po.grandTotal - totalReturnValue, 0);
            const amountRemaining = actualDebt - totalPaid;
            if (amountRemaining > 0) {
                const account = accounts.find((acc)=>acc.type === 'bank' && acc.branchSystemId === po.branchSystemId) || accounts.find((acc)=>acc.type === 'bank');
                if (!account) {
                    console.error(`Không tìm thấy tài khoản ngân hàng cho chi nhánh ${po.branchName}`);
                    return;
                }
                const now = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatDateCustom"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getCurrentDate"])(), 'yyyy-MM-dd HH:mm');
                const newPayment = {
                    id: '',
                    date: now,
                    amount: amountRemaining,
                    recipientTypeSystemId: 'NHACUNGCAP',
                    recipientTypeName: 'Nhà cung cấp',
                    recipientName: po.supplierName,
                    recipientSystemId: po.supplierSystemId,
                    description: `Thanh toán toàn bộ cho đơn nhập hàng ${po.id}`,
                    paymentMethodSystemId,
                    paymentMethodName,
                    accountSystemId: account.systemId,
                    paymentReceiptTypeSystemId: paymentCategory?.systemId || '',
                    paymentReceiptTypeName: paymentCategory?.name || 'Thanh toán cho đơn nhập hàng',
                    branchSystemId: po.branchSystemId,
                    branchName: po.branchName,
                    createdBy: currentUserName,
                    createdAt: now,
                    status: 'completed',
                    category: 'supplier_payment',
                    affectsDebt: true,
                    purchaseOrderSystemId: po.systemId,
                    purchaseOrderId: po.id,
                    originalDocumentId: po.id
                };
                addPaymentMutation.mutate(newPayment);
                totalPaymentsCreated += 1;
            }
        });
        if (totalPaymentsCreated > 0) {
            syncAllPurchaseOrderStatuses();
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toast"].success('Đã tạo phiếu chi', {
                description: `Hoàn tất ${totalPaymentsCreated} phiếu chi cho đơn nhập hàng đã chọn.`
            });
        }
        setRowSelection({});
        setIsBulkPayAlertOpen(false);
    };
    // Import handler
    const handleImport = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"](async (importedOrders, mode, _branchId)=>{
        let addedCount = 0;
        let updatedCount = 0;
        let skippedCount = 0;
        const errors = [];
        for (const [index, order] of importedOrders.entries()){
            try {
                const existing = purchaseOrders.find((o)=>o.id.toLowerCase() === (order.id || '').toLowerCase());
                if (existing) {
                    if (mode === 'update-only' || mode === 'upsert') {
                        await updatePurchaseOrderMutation.mutateAsync({
                            systemId: existing.systemId,
                            data: {
                                ...existing,
                                ...order,
                                systemId: existing.systemId
                            }
                        });
                        updatedCount++;
                    } else {
                        skippedCount++;
                    }
                } else {
                    if (mode === 'insert-only' || mode === 'upsert') {
                        // Use add mutation when available
                        skippedCount++; // For now, skip adding as we need add mutation
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
        if (addedCount > 0 || updatedCount > 0) {
            const messages = [];
            if (addedCount > 0) messages.push(`${addedCount} đơn nhập hàng mới`);
            if (updatedCount > 0) messages.push(`${updatedCount} đơn cập nhật`);
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toast"].success(`Đã import: ${messages.join(', ')}`);
        }
        return {
            success: addedCount + updatedCount,
            failed: errors.length,
            inserted: addedCount,
            updated: updatedCount,
            skipped: skippedCount,
            errors
        };
    }, [
        purchaseOrders,
        updatePurchaseOrderMutation
    ]);
    const handleBulkReceiveStart = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"](()=>{
        if (allSelectedRows.length === 0) {
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toast"].error('Chưa chọn đơn hàng', {
                description: 'Vui lòng chọn ít nhất một đơn nhập hàng cần nhập kho.'
            });
            return;
        }
        const targetOrders = allSelectedRows.filter((po)=>po.deliveryStatus !== 'Đã nhập');
        if (targetOrders.length === 0) {
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toast"])('Tất cả đơn đã nhập', {
                description: 'Các đơn đã chọn đều đã hoàn tất nhập kho.'
            });
            return;
        }
        setRowSelection({});
        beginReceiveFlow(targetOrders);
    }, [
        allSelectedRows,
        beginReceiveFlow,
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toast"]
    ]);
    const columns = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"](()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$purchase$2d$orders$2f$columns$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getColumns"])(handleCancelRequest, handlePrint, handlePayment, handleReceiveGoods, branches), [
        handleCancelRequest,
        handlePrint,
        handlePayment,
        handleReceiveGoods,
        branches
    ]);
    // Track if we've initialized column visibility to prevent infinite loops
    const hasInitializedVisibility = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"](false);
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"](()=>{
        // Only initialize once
        if (hasInitializedVisibility.current) return;
        hasInitializedVisibility.current = true;
        const defaultVisibleColumns = [
            'id',
            'supplierName',
            'branchName',
            'buyer',
            'orderDate',
            'deliveryDate',
            'shippingFee',
            'tax',
            'discount',
            'notes',
            'creatorName',
            'grandTotal',
            'status',
            'deliveryStatus',
            'paymentStatus',
            'returnStatus',
            'refundStatus'
        ];
        const initialVisibility = {};
        columns.forEach((c)=>{
            if (c.id === 'select' || c.id === 'actions') {
                initialVisibility[c.id] = true;
            } else {
                initialVisibility[c.id] = defaultVisibleColumns.includes(c.id);
            }
        });
        setColumnVisibility(initialVisibility);
        setColumnOrder(columns.map((c)=>c.id).filter(Boolean));
    }, [
        columns
    ]);
    const fuse = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"](()=>new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$fuse$2e$js$2f$dist$2f$fuse$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"](purchaseOrders, {
            keys: [
                "id",
                "supplierName",
                "status"
            ]
        }), [
        purchaseOrders
    ]);
    const filteredData = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"](()=>{
        let data = purchaseOrders;
        if (branchFilter !== 'all') {
            data = data.filter((po)=>po.branchSystemId === branchFilter);
        }
        if (statusFilter !== 'all') {
            data = data.filter((po)=>po.status === statusFilter);
        }
        if (paymentStatusFilter !== 'all') {
            data = data.filter((po)=>po.paymentStatus === paymentStatusFilter);
        }
        if (globalFilter) {
            data = fuse.search(globalFilter, {
                limit: data.length
            }).map((result)=>result.item);
        }
        return data;
    }, [
        purchaseOrders,
        globalFilter,
        fuse,
        branchFilter,
        statusFilter,
        paymentStatusFilter
    ]);
    const sortedData = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"](()=>{
        const sorted = [
            ...filteredData
        ];
        if (sorting.id) {
            sorted.sort((a, b)=>{
                const aValue = a[sorting.id];
                const bValue = b[sorting.id];
                // Special handling for date columns
                if (sorting.id === 'createdAt' || sorting.id === 'orderDate') {
                    const aTime = aValue ? new Date(aValue).getTime() : 0;
                    const bTime = bValue ? new Date(bValue).getTime() : 0;
                    return sorting.desc ? bTime - aTime : aTime - bTime;
                }
                if (aValue < bValue) return sorting.desc ? 1 : -1;
                if (aValue > bValue) return sorting.desc ? -1 : 1;
                return 0;
            });
        }
        return sorted;
    }, [
        filteredData,
        sorting
    ]);
    const pageCount = Math.ceil(sortedData.length / pagination.pageSize);
    const paginatedData = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"](()=>{
        const start = pagination.pageIndex * pagination.pageSize;
        const end = start + pagination.pageSize;
        return sortedData.slice(start, end);
    }, [
        sortedData,
        pagination
    ]);
    // Mobile infinite scroll listener
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"](()=>{
        if (!isMobile) return;
        const handleScroll = ()=>{
            const scrollPosition = window.scrollY + window.innerHeight;
            const documentHeight = document.documentElement.scrollHeight;
            const scrollPercentage = scrollPosition / documentHeight * 100;
            // Load more when scroll 80%
            if (scrollPercentage > 80 && mobileLoadedCount < sortedData.length) {
                setMobileLoadedCount((prev)=>Math.min(prev + 20, sortedData.length));
            }
        };
        window.addEventListener('scroll', handleScroll);
        return ()=>window.removeEventListener('scroll', handleScroll);
    }, [
        isMobile,
        mobileLoadedCount,
        sortedData.length
    ]);
    // Display data: mobile uses infinite scroll, desktop uses pagination
    const displayData = isMobile ? sortedData.slice(0, mobileLoadedCount) : paginatedData;
    const hasValidReceiveQuantity = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"](()=>receiveDialogState.items.some((item)=>item.receiveQuantity > 0), [
        receiveDialogState.items
    ]);
    const bulkActions = [
        {
            label: "In đơn nhập hàng",
            onSelect: handleBulkPrint
        },
        {
            label: "Thanh toán",
            onSelect: ()=>setIsBulkPayAlertOpen(true)
        },
        {
            label: "Nhập hàng",
            onSelect: handleBulkReceiveStart
        },
        {
            label: "Hủy đơn",
            onSelect: handleBulkCancel
        }
    ];
    const handleRowClick = (row)=>{
        router.push(`/purchase-orders/${row.systemId}`);
    };
    // Calculate statistics for POs with receipts and returns
    const poStats = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"](()=>{
        const stats = new Map();
        // Collect all PO IDs
        purchaseOrders.forEach((po)=>{
            const totalOrdered = po.lineItems.reduce((sum, item)=>sum + item.quantity, 0);
            stats.set(po.id, {
                totalOrdered,
                totalReceived: 0,
                totalReturned: 0,
                variance: totalOrdered
            });
        });
        // Add received quantities
        allReceipts.forEach((receipt)=>{
            if (receipt.purchaseOrderId && stats.has(receipt.purchaseOrderId)) {
                const totalReceived = receipt.items.reduce((sum, item)=>sum + item.receivedQuantity, 0);
                const current = stats.get(receipt.purchaseOrderId);
                current.totalReceived += totalReceived;
                current.variance = current.totalOrdered - current.totalReceived + current.totalReturned;
            }
        });
        // Add returned quantities
        allPurchaseReturns.forEach((ret)=>{
            if (ret.purchaseOrderId && stats.has(ret.purchaseOrderId)) {
                const totalReturned = ret.items.reduce((sum, item)=>sum + item.returnQuantity, 0);
                const current = stats.get(ret.purchaseOrderId);
                current.totalReturned += totalReturned;
                current.variance = current.totalOrdered - current.totalReceived + current.totalReturned;
            }
        });
        // Calculate totals
        let totalOrdered = 0;
        let totalReceived = 0;
        let totalReturned = 0;
        stats.forEach((stat)=>{
            totalOrdered += stat.totalOrdered;
            totalReceived += stat.totalReceived;
            totalReturned += stat.totalReturned;
        });
        return {
            totalOrdered,
            totalReceived,
            totalReturned,
            netInStock: totalReceived - totalReturned,
            receivedRate: totalOrdered > 0 ? (totalReceived / totalOrdered * 100).toFixed(1) : '0',
            returnedRate: totalReceived > 0 ? (totalReturned / totalReceived * 100).toFixed(1) : '0'
        };
    }, [
        purchaseOrders,
        allReceipts,
        allPurchaseReturns
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "space-y-4",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Card"], {
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CardContent"], {
                            className: "p-4",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-body-sm text-muted-foreground",
                                    children: "Tổng đặt hàng"
                                }, void 0, false, {
                                    fileName: "[project]/features/purchase-orders/page.tsx",
                                    lineNumber: 988,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-h3",
                                    children: [
                                        poStats.totalOrdered,
                                        " SP"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/features/purchase-orders/page.tsx",
                                    lineNumber: 989,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/features/purchase-orders/page.tsx",
                            lineNumber: 987,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/features/purchase-orders/page.tsx",
                        lineNumber: 986,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Card"], {
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CardContent"], {
                            className: "p-4",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-body-sm text-muted-foreground",
                                    children: "Đã nhận"
                                }, void 0, false, {
                                    fileName: "[project]/features/purchase-orders/page.tsx",
                                    lineNumber: 994,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-h3 text-green-600",
                                    children: [
                                        poStats.totalReceived,
                                        " SP",
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "text-body-sm text-muted-foreground ml-2",
                                            children: [
                                                "(",
                                                poStats.receivedRate,
                                                "%)"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/features/purchase-orders/page.tsx",
                                            lineNumber: 997,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/features/purchase-orders/page.tsx",
                                    lineNumber: 995,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/features/purchase-orders/page.tsx",
                            lineNumber: 993,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/features/purchase-orders/page.tsx",
                        lineNumber: 992,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Card"], {
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CardContent"], {
                            className: "p-4",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-body-sm text-muted-foreground",
                                    children: "Đã trả lại"
                                }, void 0, false, {
                                    fileName: "[project]/features/purchase-orders/page.tsx",
                                    lineNumber: 1003,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-h3 text-orange-600",
                                    children: [
                                        poStats.totalReturned,
                                        " SP",
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "text-body-sm text-muted-foreground ml-2",
                                            children: [
                                                "(",
                                                poStats.returnedRate,
                                                "%)"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/features/purchase-orders/page.tsx",
                                            lineNumber: 1006,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/features/purchase-orders/page.tsx",
                                    lineNumber: 1004,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/features/purchase-orders/page.tsx",
                            lineNumber: 1002,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/features/purchase-orders/page.tsx",
                        lineNumber: 1001,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Card"], {
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CardContent"], {
                            className: "p-4",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-body-sm text-muted-foreground",
                                    children: "Tồn kho thực"
                                }, void 0, false, {
                                    fileName: "[project]/features/purchase-orders/page.tsx",
                                    lineNumber: 1012,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: `text-h3 ${poStats.netInStock >= 0 ? 'text-blue-600' : 'text-red-600'}`,
                                    children: [
                                        poStats.netInStock > 0 ? '+' : '',
                                        poStats.netInStock,
                                        " SP"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/features/purchase-orders/page.tsx",
                                    lineNumber: 1013,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/features/purchase-orders/page.tsx",
                            lineNumber: 1011,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/features/purchase-orders/page.tsx",
                        lineNumber: 1010,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/features/purchase-orders/page.tsx",
                lineNumber: 985,
                columnNumber: 7
            }, this),
            !isMobile && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$layout$2f$page$2d$toolbar$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["PageToolbar"], {
                rightActions: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Button"], {
                            variant: "outline",
                            size: "sm",
                            onClick: ()=>setShowImportDialog(true),
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$spreadsheet$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__FileSpreadsheet$3e$__["FileSpreadsheet"], {
                                    className: "mr-2 h-4 w-4"
                                }, void 0, false, {
                                    fileName: "[project]/features/purchase-orders/page.tsx",
                                    lineNumber: 1026,
                                    columnNumber: 17
                                }, void 0),
                                "Nhập file"
                            ]
                        }, void 0, true, {
                            fileName: "[project]/features/purchase-orders/page.tsx",
                            lineNumber: 1025,
                            columnNumber: 15
                        }, void 0),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Button"], {
                            variant: "outline",
                            size: "sm",
                            onClick: ()=>setShowExportDialog(true),
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$download$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Download$3e$__["Download"], {
                                    className: "mr-2 h-4 w-4"
                                }, void 0, false, {
                                    fileName: "[project]/features/purchase-orders/page.tsx",
                                    lineNumber: 1030,
                                    columnNumber: 17
                                }, void 0),
                                "Xuất Excel"
                            ]
                        }, void 0, true, {
                            fileName: "[project]/features/purchase-orders/page.tsx",
                            lineNumber: 1029,
                            columnNumber: 15
                        }, void 0),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$data$2d$table$2f$data$2d$table$2d$column$2d$toggle$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DataTableColumnCustomizer"], {
                            columns: columns,
                            columnVisibility: columnVisibility,
                            setColumnVisibility: setColumnVisibility,
                            columnOrder: columnOrder,
                            setColumnOrder: setColumnOrder,
                            pinnedColumns: pinnedColumns,
                            setPinnedColumns: setPinnedColumns
                        }, void 0, false, {
                            fileName: "[project]/features/purchase-orders/page.tsx",
                            lineNumber: 1033,
                            columnNumber: 15
                        }, void 0)
                    ]
                }, void 0, true)
            }, void 0, false, {
                fileName: "[project]/features/purchase-orders/page.tsx",
                lineNumber: 1022,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$layout$2f$page$2d$filters$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["PageFilters"], {
                searchValue: globalFilter,
                onSearchChange: setGlobalFilter,
                searchPlaceholder: "Tìm kiếm đơn nhập hàng...",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Select"], {
                        value: branchFilter,
                        onValueChange: setBranchFilter,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SelectTrigger"], {
                                className: "h-9 w-full sm:w-[180px]",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SelectValue"], {
                                    placeholder: "Chi nhánh"
                                }, void 0, false, {
                                    fileName: "[project]/features/purchase-orders/page.tsx",
                                    lineNumber: 1055,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/features/purchase-orders/page.tsx",
                                lineNumber: 1054,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SelectContent"], {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SelectItem"], {
                                        value: "all",
                                        children: "Tất cả chi nhánh"
                                    }, void 0, false, {
                                        fileName: "[project]/features/purchase-orders/page.tsx",
                                        lineNumber: 1058,
                                        columnNumber: 13
                                    }, this),
                                    branches.map((b)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SelectItem"], {
                                            value: b.systemId,
                                            children: b.name
                                        }, b.systemId, false, {
                                            fileName: "[project]/features/purchase-orders/page.tsx",
                                            lineNumber: 1059,
                                            columnNumber: 32
                                        }, this))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/features/purchase-orders/page.tsx",
                                lineNumber: 1057,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/features/purchase-orders/page.tsx",
                        lineNumber: 1053,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Select"], {
                        value: statusFilter,
                        onValueChange: setStatusFilter,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SelectTrigger"], {
                                className: "h-9 w-full sm:w-[180px]",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SelectValue"], {
                                    placeholder: "Trạng thái"
                                }, void 0, false, {
                                    fileName: "[project]/features/purchase-orders/page.tsx",
                                    lineNumber: 1064,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/features/purchase-orders/page.tsx",
                                lineNumber: 1063,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SelectContent"], {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SelectItem"], {
                                        value: "all",
                                        children: "Tất cả trạng thái"
                                    }, void 0, false, {
                                        fileName: "[project]/features/purchase-orders/page.tsx",
                                        lineNumber: 1067,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SelectItem"], {
                                        value: "Đặt hàng",
                                        children: "Đặt hàng"
                                    }, void 0, false, {
                                        fileName: "[project]/features/purchase-orders/page.tsx",
                                        lineNumber: 1068,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SelectItem"], {
                                        value: "Đang giao dịch",
                                        children: "Đang giao dịch"
                                    }, void 0, false, {
                                        fileName: "[project]/features/purchase-orders/page.tsx",
                                        lineNumber: 1069,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SelectItem"], {
                                        value: "Hoàn thành",
                                        children: "Hoàn thành"
                                    }, void 0, false, {
                                        fileName: "[project]/features/purchase-orders/page.tsx",
                                        lineNumber: 1070,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SelectItem"], {
                                        value: "Đã hủy",
                                        children: "Đã hủy"
                                    }, void 0, false, {
                                        fileName: "[project]/features/purchase-orders/page.tsx",
                                        lineNumber: 1071,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SelectItem"], {
                                        value: "Kết thúc",
                                        children: "Kết thúc"
                                    }, void 0, false, {
                                        fileName: "[project]/features/purchase-orders/page.tsx",
                                        lineNumber: 1072,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/features/purchase-orders/page.tsx",
                                lineNumber: 1066,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/features/purchase-orders/page.tsx",
                        lineNumber: 1062,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Select"], {
                        value: paymentStatusFilter,
                        onValueChange: setPaymentStatusFilter,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SelectTrigger"], {
                                className: "h-9 w-full sm:w-[180px]",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SelectValue"], {
                                    placeholder: "Thanh toán"
                                }, void 0, false, {
                                    fileName: "[project]/features/purchase-orders/page.tsx",
                                    lineNumber: 1077,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/features/purchase-orders/page.tsx",
                                lineNumber: 1076,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SelectContent"], {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SelectItem"], {
                                        value: "all",
                                        children: "Tất cả"
                                    }, void 0, false, {
                                        fileName: "[project]/features/purchase-orders/page.tsx",
                                        lineNumber: 1080,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SelectItem"], {
                                        value: "Chưa thanh toán",
                                        children: "Chưa thanh toán"
                                    }, void 0, false, {
                                        fileName: "[project]/features/purchase-orders/page.tsx",
                                        lineNumber: 1081,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SelectItem"], {
                                        value: "Thanh toán một phần",
                                        children: "Thanh toán một phần"
                                    }, void 0, false, {
                                        fileName: "[project]/features/purchase-orders/page.tsx",
                                        lineNumber: 1082,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SelectItem"], {
                                        value: "Đã thanh toán",
                                        children: "Đã thanh toán"
                                    }, void 0, false, {
                                        fileName: "[project]/features/purchase-orders/page.tsx",
                                        lineNumber: 1083,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/features/purchase-orders/page.tsx",
                                lineNumber: 1079,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/features/purchase-orders/page.tsx",
                        lineNumber: 1075,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/features/purchase-orders/page.tsx",
                lineNumber: 1048,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$data$2d$table$2f$responsive$2d$data$2d$table$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ResponsiveDataTable"], {
                columns: columns,
                data: displayData,
                renderMobileCard: (po)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$features$2f$purchase$2d$orders$2f$purchase$2d$order$2d$card$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["PurchaseOrderCard"], {
                        purchaseOrder: po,
                        onCancel: handleCancelRequest,
                        onPrint: handlePrint,
                        onPayment: handlePayment,
                        onReceiveGoods: handleReceiveGoods,
                        onClick: handleRowClick
                    }, void 0, false, {
                        fileName: "[project]/features/purchase-orders/page.tsx",
                        lineNumber: 1093,
                        columnNumber: 11
                    }, void 0),
                pageCount: pageCount,
                pagination: pagination,
                setPagination: setPagination,
                rowCount: filteredData.length,
                rowSelection: rowSelection,
                setRowSelection: setRowSelection,
                sorting: sorting,
                setSorting: setSorting,
                onRowClick: handleRowClick,
                showBulkDeleteButton: false,
                bulkActions: bulkActions,
                allSelectedRows: allSelectedRows,
                expanded: {},
                setExpanded: ()=>{},
                columnVisibility: columnVisibility,
                setColumnVisibility: setColumnVisibility,
                columnOrder: columnOrder,
                setColumnOrder: setColumnOrder,
                pinnedColumns: pinnedColumns,
                setPinnedColumns: setPinnedColumns
            }, void 0, false, {
                fileName: "[project]/features/purchase-orders/page.tsx",
                lineNumber: 1089,
                columnNumber: 7
            }, this),
            isMobile && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "py-6 text-center",
                children: mobileLoadedCount < sortedData.length ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex items-center justify-center gap-2 text-muted-foreground",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent"
                        }, void 0, false, {
                            fileName: "[project]/features/purchase-orders/page.tsx",
                            lineNumber: 1129,
                            columnNumber: 15
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "text-body-sm",
                            children: "Đang tải thêm..."
                        }, void 0, false, {
                            fileName: "[project]/features/purchase-orders/page.tsx",
                            lineNumber: 1130,
                            columnNumber: 15
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/features/purchase-orders/page.tsx",
                    lineNumber: 1128,
                    columnNumber: 13
                }, this) : sortedData.length > 20 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: "text-body-sm text-muted-foreground",
                    children: [
                        "Đã hiển thị tất cả ",
                        sortedData.length,
                        " kết quả"
                    ]
                }, void 0, true, {
                    fileName: "[project]/features/purchase-orders/page.tsx",
                    lineNumber: 1133,
                    columnNumber: 13
                }, this) : null
            }, void 0, false, {
                fileName: "[project]/features/purchase-orders/page.tsx",
                lineNumber: 1126,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$alert$2d$dialog$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AlertDialog"], {
                open: cancelDialogState.isOpen,
                onOpenChange: (open)=>setCancelDialogState((s)=>({
                            ...s,
                            isOpen: open
                        })),
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$alert$2d$dialog$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AlertDialogContent"], {
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$alert$2d$dialog$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AlertDialogHeader"], {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$alert$2d$dialog$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AlertDialogTitle"], {
                                    children: "Bạn có chắc chắn muốn hủy đơn hàng này?"
                                }, void 0, false, {
                                    fileName: "[project]/features/purchase-orders/page.tsx",
                                    lineNumber: 1143,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$alert$2d$dialog$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AlertDialogDescription"], {
                                    children: cancelDialogState.willCreateReturn ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
                                        children: [
                                            "Đơn hàng này đã có sản phẩm được nhập kho. Hủy đơn sẽ tự động tạo một ",
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                children: "Phiếu Xuất trả hàng"
                                            }, void 0, false, {
                                                fileName: "[project]/features/purchase-orders/page.tsx",
                                                lineNumber: 1147,
                                                columnNumber: 89
                                            }, this),
                                            " cho các sản phẩm đã nhận.",
                                            cancelDialogState.totalPaid && cancelDialogState.totalPaid > 0 ? ` Đồng thời, một Phiếu Thu hoàn tiền ${formatCurrency(cancelDialogState.totalPaid)} sẽ được tạo.` : '',
                                            ' ',
                                            "Hành động này không thể hoàn tác."
                                        ]
                                    }, void 0, true) : cancelDialogState.totalPaid && cancelDialogState.totalPaid > 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
                                        children: [
                                            "Đơn hàng này đã được thanh toán ",
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                children: formatCurrency(cancelDialogState.totalPaid)
                                            }, void 0, false, {
                                                fileName: "[project]/features/purchase-orders/page.tsx",
                                                lineNumber: 1155,
                                                columnNumber: 51
                                            }, this),
                                            ". Việc hủy đơn sẽ tự động tạo một ",
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                children: "Phiếu Thu"
                                            }, void 0, false, {
                                                fileName: "[project]/features/purchase-orders/page.tsx",
                                                lineNumber: 1156,
                                                columnNumber: 51
                                            }, this),
                                            ' ghi nhận khoản tiền này là "Nhà cung cấp cần hoàn lại". Hành động này không thể hoàn tác.'
                                        ]
                                    }, void 0, true) : 'Hành động này sẽ chuyển trạng thái đơn hàng thành "Đã hủy" và không thể hoàn tác.'
                                }, void 0, false, {
                                    fileName: "[project]/features/purchase-orders/page.tsx",
                                    lineNumber: 1144,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/features/purchase-orders/page.tsx",
                            lineNumber: 1142,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$alert$2d$dialog$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AlertDialogFooter"], {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$alert$2d$dialog$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AlertDialogCancel"], {
                                    className: "h-9",
                                    onClick: ()=>setCancelDialogState({
                                            isOpen: false,
                                            po: null
                                        }),
                                    children: "Thoát"
                                }, void 0, false, {
                                    fileName: "[project]/features/purchase-orders/page.tsx",
                                    lineNumber: 1165,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$alert$2d$dialog$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AlertDialogAction"], {
                                    className: "h-9",
                                    onClick: confirmCancel,
                                    children: "Xác nhận hủy"
                                }, void 0, false, {
                                    fileName: "[project]/features/purchase-orders/page.tsx",
                                    lineNumber: 1166,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/features/purchase-orders/page.tsx",
                            lineNumber: 1164,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/features/purchase-orders/page.tsx",
                    lineNumber: 1141,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/features/purchase-orders/page.tsx",
                lineNumber: 1140,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$alert$2d$dialog$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AlertDialog"], {
                open: isBulkPayAlertOpen,
                onOpenChange: setIsBulkPayAlertOpen,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$alert$2d$dialog$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AlertDialogContent"], {
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$alert$2d$dialog$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AlertDialogHeader"], {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$alert$2d$dialog$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AlertDialogTitle"], {
                                    children: "Xác nhận thanh toán?"
                                }, void 0, false, {
                                    fileName: "[project]/features/purchase-orders/page.tsx",
                                    lineNumber: 1174,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$alert$2d$dialog$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AlertDialogDescription"], {
                                    children: [
                                        "Bạn có chắc chắn muốn thanh toán toàn bộ cho ",
                                        numSelected,
                                        " đơn hàng đã chọn không?"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/features/purchase-orders/page.tsx",
                                    lineNumber: 1175,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/features/purchase-orders/page.tsx",
                            lineNumber: 1173,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$alert$2d$dialog$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AlertDialogFooter"], {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$alert$2d$dialog$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AlertDialogCancel"], {
                                    className: "h-9",
                                    children: "Hủy"
                                }, void 0, false, {
                                    fileName: "[project]/features/purchase-orders/page.tsx",
                                    lineNumber: 1180,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$alert$2d$dialog$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AlertDialogAction"], {
                                    className: "h-9",
                                    onClick: confirmBulkPay,
                                    children: "Xác nhận"
                                }, void 0, false, {
                                    fileName: "[project]/features/purchase-orders/page.tsx",
                                    lineNumber: 1181,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/features/purchase-orders/page.tsx",
                            lineNumber: 1179,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/features/purchase-orders/page.tsx",
                    lineNumber: 1172,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/features/purchase-orders/page.tsx",
                lineNumber: 1171,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Dialog"], {
                open: receiveDialogState.isOpen,
                onOpenChange: (open)=>{
                    if (!open) {
                        closeReceiveDialog();
                    }
                },
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DialogContent"], {
                    className: "max-w-4xl",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DialogHeader"], {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DialogTitle"], {
                                    children: [
                                        "Nhập hàng cho ",
                                        receiveDialogState.purchaseOrder?.id || 'đơn hàng'
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/features/purchase-orders/page.tsx",
                                    lineNumber: 1192,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DialogDescription"], {
                                    children: "Chọn chi nhánh, kho nhận và nhập số lượng thực nhận cho từng sản phẩm theo guideline dual ID."
                                }, void 0, false, {
                                    fileName: "[project]/features/purchase-orders/page.tsx",
                                    lineNumber: 1193,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/features/purchase-orders/page.tsx",
                            lineNumber: 1191,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "space-y-4",
                            children: [
                                pendingReceiveQueue.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "rounded-md bg-blue-50 px-3 py-2 text-body-sm text-blue-700 dark:bg-blue-950/50 dark:text-blue-300",
                                    children: [
                                        "Còn ",
                                        pendingReceiveQueue.length,
                                        " đơn trong hàng đợi sẽ được mở tiếp sau khi lưu phiếu này."
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/features/purchase-orders/page.tsx",
                                    lineNumber: 1199,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "grid gap-4 md:grid-cols-2",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "space-y-2",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$label$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Label"], {
                                                    children: "Mã phiếu nhập"
                                                }, void 0, false, {
                                                    fileName: "[project]/features/purchase-orders/page.tsx",
                                                    lineNumber: 1205,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$input$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Input"], {
                                                    placeholder: "Ví dụ: PNK000123",
                                                    className: "h-9",
                                                    value: receiveDialogState.documentCode,
                                                    onChange: (event)=>handleReceiveFieldChange('documentCode', event.target.value)
                                                }, void 0, false, {
                                                    fileName: "[project]/features/purchase-orders/page.tsx",
                                                    lineNumber: 1206,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/features/purchase-orders/page.tsx",
                                            lineNumber: 1204,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "space-y-2",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$label$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Label"], {
                                                    children: "Ngày nhận hàng"
                                                }, void 0, false, {
                                                    fileName: "[project]/features/purchase-orders/page.tsx",
                                                    lineNumber: 1214,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$input$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Input"], {
                                                    type: "datetime-local",
                                                    className: "h-9",
                                                    value: receiveDialogState.receivedDate,
                                                    onChange: (event)=>handleReceiveFieldChange('receivedDate', event.target.value)
                                                }, void 0, false, {
                                                    fileName: "[project]/features/purchase-orders/page.tsx",
                                                    lineNumber: 1215,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/features/purchase-orders/page.tsx",
                                            lineNumber: 1213,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "space-y-2",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$label$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Label"], {
                                                    children: "Chi nhánh nhận"
                                                }, void 0, false, {
                                                    fileName: "[project]/features/purchase-orders/page.tsx",
                                                    lineNumber: 1223,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Select"], {
                                                    value: receiveDialogState.targetBranchSystemId || undefined,
                                                    onValueChange: handleReceiveBranchChange,
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SelectTrigger"], {
                                                            className: "h-9",
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SelectValue"], {
                                                                placeholder: "Chọn chi nhánh"
                                                            }, void 0, false, {
                                                                fileName: "[project]/features/purchase-orders/page.tsx",
                                                                lineNumber: 1226,
                                                                columnNumber: 21
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/features/purchase-orders/page.tsx",
                                                            lineNumber: 1225,
                                                            columnNumber: 19
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SelectContent"], {
                                                            children: branches.map((branch)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SelectItem"], {
                                                                    value: branch.systemId,
                                                                    children: branch.name
                                                                }, branch.systemId, false, {
                                                                    fileName: "[project]/features/purchase-orders/page.tsx",
                                                                    lineNumber: 1230,
                                                                    columnNumber: 23
                                                                }, this))
                                                        }, void 0, false, {
                                                            fileName: "[project]/features/purchase-orders/page.tsx",
                                                            lineNumber: 1228,
                                                            columnNumber: 19
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/features/purchase-orders/page.tsx",
                                                    lineNumber: 1224,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/features/purchase-orders/page.tsx",
                                            lineNumber: 1222,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "space-y-2",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$label$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Label"], {
                                                    children: "Kho nhận"
                                                }, void 0, false, {
                                                    fileName: "[project]/features/purchase-orders/page.tsx",
                                                    lineNumber: 1238,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$input$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Input"], {
                                                    placeholder: "Kho chính, Kho lẻ...",
                                                    className: "h-9",
                                                    value: receiveDialogState.warehouseName,
                                                    onChange: (event)=>handleReceiveFieldChange('warehouseName', event.target.value)
                                                }, void 0, false, {
                                                    fileName: "[project]/features/purchase-orders/page.tsx",
                                                    lineNumber: 1239,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/features/purchase-orders/page.tsx",
                                            lineNumber: 1237,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/features/purchase-orders/page.tsx",
                                    lineNumber: 1203,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "space-y-2",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$label$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Label"], {
                                            children: "Ghi chú"
                                        }, void 0, false, {
                                            fileName: "[project]/features/purchase-orders/page.tsx",
                                            lineNumber: 1248,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$textarea$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Textarea"], {
                                            placeholder: "Ví dụ: Nhập đợt 1, bao gồm phiếu vận chuyển số...",
                                            value: receiveDialogState.notes,
                                            onChange: (event)=>handleReceiveFieldChange('notes', event.target.value)
                                        }, void 0, false, {
                                            fileName: "[project]/features/purchase-orders/page.tsx",
                                            lineNumber: 1249,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/features/purchase-orders/page.tsx",
                                    lineNumber: 1247,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "rounded-lg border",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$table$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Table"], {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$table$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TableHeader"], {
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$table$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TableRow"], {
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$table$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TableHead"], {
                                                                children: "Sản phẩm"
                                                            }, void 0, false, {
                                                                fileName: "[project]/features/purchase-orders/page.tsx",
                                                                lineNumber: 1259,
                                                                columnNumber: 21
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$table$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TableHead"], {
                                                                children: "Số lượng đặt"
                                                            }, void 0, false, {
                                                                fileName: "[project]/features/purchase-orders/page.tsx",
                                                                lineNumber: 1260,
                                                                columnNumber: 21
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$table$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TableHead"], {
                                                                children: "Còn lại"
                                                            }, void 0, false, {
                                                                fileName: "[project]/features/purchase-orders/page.tsx",
                                                                lineNumber: 1261,
                                                                columnNumber: 21
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$table$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TableHead"], {
                                                                className: "w-48",
                                                                children: "Nhập lần này"
                                                            }, void 0, false, {
                                                                fileName: "[project]/features/purchase-orders/page.tsx",
                                                                lineNumber: 1262,
                                                                columnNumber: 21
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/features/purchase-orders/page.tsx",
                                                        lineNumber: 1258,
                                                        columnNumber: 19
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/features/purchase-orders/page.tsx",
                                                    lineNumber: 1257,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$table$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TableBody"], {
                                                    children: receiveDialogState.items.map((item)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$table$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TableRow"], {
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$table$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TableCell"], {
                                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: "flex flex-col",
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                className: "text-body-sm font-medium",
                                                                                children: item.productName
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/features/purchase-orders/page.tsx",
                                                                                lineNumber: 1270,
                                                                                columnNumber: 27
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                className: "text-body-xs text-muted-foreground",
                                                                                children: item.productId
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/features/purchase-orders/page.tsx",
                                                                                lineNumber: 1271,
                                                                                columnNumber: 27
                                                                            }, this)
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/features/purchase-orders/page.tsx",
                                                                        lineNumber: 1269,
                                                                        columnNumber: 25
                                                                    }, this)
                                                                }, void 0, false, {
                                                                    fileName: "[project]/features/purchase-orders/page.tsx",
                                                                    lineNumber: 1268,
                                                                    columnNumber: 23
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$table$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TableCell"], {
                                                                    children: item.orderedQuantity
                                                                }, void 0, false, {
                                                                    fileName: "[project]/features/purchase-orders/page.tsx",
                                                                    lineNumber: 1274,
                                                                    columnNumber: 23
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$table$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TableCell"], {
                                                                    children: item.remainingQuantity
                                                                }, void 0, false, {
                                                                    fileName: "[project]/features/purchase-orders/page.tsx",
                                                                    lineNumber: 1275,
                                                                    columnNumber: 23
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$table$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TableCell"], {
                                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$input$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Input"], {
                                                                        type: "number",
                                                                        min: 0,
                                                                        max: item.remainingQuantity,
                                                                        className: "h-9",
                                                                        value: item.receiveQuantity,
                                                                        onChange: (event)=>handleReceiveQuantityChange(item.productSystemId, Number(event.target.value))
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/features/purchase-orders/page.tsx",
                                                                        lineNumber: 1277,
                                                                        columnNumber: 25
                                                                    }, this)
                                                                }, void 0, false, {
                                                                    fileName: "[project]/features/purchase-orders/page.tsx",
                                                                    lineNumber: 1276,
                                                                    columnNumber: 23
                                                                }, this)
                                                            ]
                                                        }, item.productSystemId, true, {
                                                            fileName: "[project]/features/purchase-orders/page.tsx",
                                                            lineNumber: 1267,
                                                            columnNumber: 21
                                                        }, this))
                                                }, void 0, false, {
                                                    fileName: "[project]/features/purchase-orders/page.tsx",
                                                    lineNumber: 1265,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/features/purchase-orders/page.tsx",
                                            lineNumber: 1256,
                                            columnNumber: 15
                                        }, this),
                                        receiveDialogState.items.length === 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "p-4 text-body-sm text-muted-foreground",
                                            children: "Tất cả sản phẩm trong đơn này đã được nhập đủ."
                                        }, void 0, false, {
                                            fileName: "[project]/features/purchase-orders/page.tsx",
                                            lineNumber: 1291,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/features/purchase-orders/page.tsx",
                                    lineNumber: 1255,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/features/purchase-orders/page.tsx",
                            lineNumber: 1197,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DialogFooter"], {
                            className: "gap-2",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Button"], {
                                    type: "button",
                                    variant: "outline",
                                    className: "h-9",
                                    onClick: closeReceiveDialog,
                                    disabled: isSubmittingReceive,
                                    children: "Hủy"
                                }, void 0, false, {
                                    fileName: "[project]/features/purchase-orders/page.tsx",
                                    lineNumber: 1296,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Button"], {
                                    type: "button",
                                    className: "h-9",
                                    onClick: handleSubmitReceiveDialog,
                                    disabled: isSubmittingReceive || !hasValidReceiveQuantity || !receiveDialogState.targetBranchSystemId,
                                    children: isSubmittingReceive ? 'Đang lưu...' : pendingReceiveQueue.length > 0 ? 'Lưu & chuyển đơn tiếp theo' : 'Lưu phiếu nhập'
                                }, void 0, false, {
                                    fileName: "[project]/features/purchase-orders/page.tsx",
                                    lineNumber: 1299,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/features/purchase-orders/page.tsx",
                            lineNumber: 1295,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/features/purchase-orders/page.tsx",
                    lineNumber: 1190,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/features/purchase-orders/page.tsx",
                lineNumber: 1185,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$shared$2f$simple$2d$print$2d$options$2d$dialog$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SimplePrintOptionsDialog"], {
                open: isPrintDialogOpen,
                onOpenChange: setIsPrintDialogOpen,
                onConfirm: handlePrintConfirm,
                selectedCount: pendingPrintPOs.length,
                title: "In đơn nhập hàng"
            }, void 0, false, {
                fileName: "[project]/features/purchase-orders/page.tsx",
                lineNumber: 1316,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$shared$2f$generic$2d$import$2d$dialog$2d$v2$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["GenericImportDialogV2"], {
                open: showImportDialog,
                onOpenChange: setShowImportDialog,
                config: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$import$2d$export$2f$configs$2f$purchase$2d$order$2e$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["purchaseOrderImportExportConfig"],
                branches: branches.map((b)=>({
                        systemId: b.systemId,
                        name: b.name
                    })),
                existingData: purchaseOrders,
                onImport: handleImport,
                currentUser: {
                    name: loggedInUser?.fullName || 'Hệ thống',
                    systemId: loggedInUser?.systemId || (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('SYSTEM')
                }
            }, void 0, false, {
                fileName: "[project]/features/purchase-orders/page.tsx",
                lineNumber: 1325,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$shared$2f$generic$2d$export$2d$dialog$2d$v2$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["GenericExportDialogV2"], {
                open: showExportDialog,
                onOpenChange: setShowExportDialog,
                config: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$import$2d$export$2f$configs$2f$purchase$2d$order$2e$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["purchaseOrderImportExportConfig"],
                allData: purchaseOrders,
                filteredData: sortedData,
                currentPageData: paginatedData,
                selectedData: selectedOrders,
                currentUser: {
                    name: loggedInUser?.fullName || 'Hệ thống',
                    systemId: loggedInUser?.systemId || (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('SYSTEM')
                }
            }, void 0, false, {
                fileName: "[project]/features/purchase-orders/page.tsx",
                lineNumber: 1339,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/features/purchase-orders/page.tsx",
        lineNumber: 983,
        columnNumber: 5
    }, this);
}
}),
];

//# sourceMappingURL=features_purchase-orders_5c70741e._.js.map