module.exports = [
"[project]/features/orders/api/orders-api.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Orders API - Isolated API functions
 * 
 * ⚠️ IMPORTANT: This file should ONLY contain:
 * - Fetch functions
 * - Type imports from ../types
 * - NO store imports
 * - NO cross-feature imports
 */ __turbopack_context__.s([
    "createOrder",
    ()=>createOrder,
    "deleteOrder",
    ()=>deleteOrder,
    "fetchOrder",
    ()=>fetchOrder,
    "fetchOrderStats",
    ()=>fetchOrderStats,
    "fetchOrders",
    ()=>fetchOrders,
    "updateOrder",
    ()=>updateOrder
]);
const API_BASE = '/api/orders';
async function fetchOrders(params = {}) {
    const { page = 1, limit = 50, ...rest } = params;
    const searchParams = new URLSearchParams({
        page: String(page),
        limit: String(limit)
    });
    // Add optional params
    Object.entries(rest).forEach(([key, value])=>{
        if (value != null && value !== '') {
            searchParams.set(key, String(value));
        }
    });
    const res = await fetch(`${API_BASE}?${searchParams}`);
    if (!res.ok) {
        throw new Error(`Failed to fetch orders: ${res.statusText}`);
    }
    return res.json();
}
async function fetchOrder(id) {
    const res = await fetch(`${API_BASE}/${id}`);
    if (!res.ok) {
        throw new Error(`Failed to fetch order ${id}: ${res.statusText}`);
    }
    return res.json();
}
async function createOrder(data) {
    const res = await fetch(API_BASE, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });
    if (!res.ok) {
        const error = await res.json().catch(()=>({}));
        throw new Error(error.message || `Failed to create order: ${res.statusText}`);
    }
    return res.json();
}
async function updateOrder({ id, ...data }) {
    const res = await fetch(`${API_BASE}/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });
    if (!res.ok) {
        const error = await res.json().catch(()=>({}));
        throw new Error(error.message || `Failed to update order: ${res.statusText}`);
    }
    return res.json();
}
async function deleteOrder(id) {
    const res = await fetch(`${API_BASE}/${id}`, {
        method: 'DELETE'
    });
    if (!res.ok) {
        const error = await res.json().catch(()=>({}));
        throw new Error(error.message || `Failed to delete order: ${res.statusText}`);
    }
}
async function fetchOrderStats() {
    const res = await fetch(`${API_BASE}/stats`);
    if (!res.ok) {
        throw new Error(`Failed to fetch order stats: ${res.statusText}`);
    }
    return res.json();
}
}),
"[project]/features/orders/api/order-actions-api.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Orders API - Additional functions for cancel, payment, etc.
 */ __turbopack_context__.s([
    "addOrderPayment",
    ()=>addOrderPayment,
    "cancelOrder",
    ()=>cancelOrder,
    "cancelShipment",
    ()=>cancelShipment,
    "confirmPackaging",
    ()=>confirmPackaging,
    "createPackaging",
    ()=>createPackaging,
    "createShipment",
    ()=>createShipment,
    "syncShipmentStatus",
    ()=>syncShipmentStatus,
    "updateOrderStatus",
    ()=>updateOrderStatus
]);
const API_BASE = '/api/orders';
async function cancelOrder(systemId, data) {
    const res = await fetch(`${API_BASE}/${systemId}/cancel`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });
    if (!res.ok) {
        const error = await res.json().catch(()=>({}));
        throw new Error(error.message || 'Failed to cancel order');
    }
    return res.json();
}
async function addOrderPayment(systemId, data) {
    const res = await fetch(`${API_BASE}/${systemId}/payments`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });
    if (!res.ok) {
        const error = await res.json().catch(()=>({}));
        throw new Error(error.message || 'Failed to add payment');
    }
    return res.json();
}
async function updateOrderStatus(systemId, status) {
    const res = await fetch(`${API_BASE}/${systemId}/status`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            status
        })
    });
    if (!res.ok) {
        const error = await res.json().catch(()=>({}));
        throw new Error(error.message || 'Failed to update status');
    }
    return res.json();
}
async function createPackaging(systemId, data) {
    const res = await fetch(`${API_BASE}/${systemId}/packaging`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });
    if (!res.ok) {
        const error = await res.json().catch(()=>({}));
        throw new Error(error.message || 'Failed to create packaging');
    }
    return res.json();
}
async function confirmPackaging(systemId, packagingId) {
    const res = await fetch(`${API_BASE}/${systemId}/packaging/${packagingId}/confirm`, {
        method: 'POST'
    });
    if (!res.ok) {
        const error = await res.json().catch(()=>({}));
        throw new Error(error.message || 'Failed to confirm packaging');
    }
    return res.json();
}
async function createShipment(systemId, data) {
    const res = await fetch(`${API_BASE}/${systemId}/shipment`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });
    if (!res.ok) {
        const error = await res.json().catch(()=>({}));
        throw new Error(error.message || 'Failed to create shipment');
    }
    return res.json();
}
async function syncShipmentStatus(systemId) {
    const res = await fetch(`${API_BASE}/${systemId}/shipment/sync`, {
        method: 'POST'
    });
    if (!res.ok) {
        const error = await res.json().catch(()=>({}));
        throw new Error(error.message || 'Failed to sync shipment');
    }
    return res.json();
}
async function cancelShipment(systemId) {
    const res = await fetch(`${API_BASE}/${systemId}/shipment/cancel`, {
        method: 'POST'
    });
    if (!res.ok) {
        const error = await res.json().catch(()=>({}));
        throw new Error(error.message || 'Failed to cancel shipment');
    }
    return res.json();
}
}),
"[project]/features/orders/hooks/use-orders.ts [app-ssr] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "orderKeys",
    ()=>orderKeys,
    "useOrder",
    ()=>useOrder,
    "useOrderSearch",
    ()=>useOrderSearch,
    "useOrderStats",
    ()=>useOrderStats,
    "useOrders",
    ()=>useOrders
]);
/**
 * useOrders - React Query hook for orders list
 * 
 * ⚠️ IMPORTANT: Direct import pattern
 * - Import this file directly: import { useOrders } from '@/features/orders/hooks/use-orders'
 * - NEVER import from '@/features/orders' or '@/features/orders/store'
 * 
 * This hook is ISOLATED - it only depends on:
 * - @tanstack/react-query
 * - Local API functions
 * - Local types
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@tanstack/react-query/build/modern/useQuery.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$utils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@tanstack/query-core/build/modern/utils.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$orders$2f$api$2f$orders$2d$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/orders/api/orders-api.ts [app-ssr] (ecmascript)");
// Re-export from use-all-orders for backward compatibility
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$orders$2f$hooks$2f$use$2d$all$2d$orders$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/orders/hooks/use-all-orders.ts [app-ssr] (ecmascript)");
;
;
const orderKeys = {
    all: [
        'orders'
    ],
    lists: ()=>[
            ...orderKeys.all,
            'list'
        ],
    list: (params)=>[
            ...orderKeys.lists(),
            params
        ],
    details: ()=>[
            ...orderKeys.all,
            'detail'
        ],
    detail: (id)=>[
            ...orderKeys.details(),
            id
        ],
    stats: ()=>[
            ...orderKeys.all,
            'stats'
        ]
};
function useOrders(params = {}) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useQuery"])({
        queryKey: orderKeys.list(params),
        queryFn: ()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$orders$2f$api$2f$orders$2d$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["fetchOrders"])(params),
        staleTime: 30_000,
        gcTime: 5 * 60 * 1000,
        placeholderData: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$utils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["keepPreviousData"]
    });
}
function useOrder(id) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useQuery"])({
        queryKey: orderKeys.detail(id),
        queryFn: ()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$orders$2f$api$2f$orders$2d$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["fetchOrder"])(id),
        enabled: !!id,
        staleTime: 60_000,
        gcTime: 10 * 60 * 1000
    });
}
function useOrderStats() {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useQuery"])({
        queryKey: orderKeys.stats(),
        queryFn: __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$orders$2f$api$2f$orders$2d$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["fetchOrderStats"],
        staleTime: 60_000,
        gcTime: 5 * 60 * 1000
    });
}
function useOrderSearch(search, limit = 20) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useQuery"])({
        queryKey: orderKeys.list({
            search,
            limit
        }),
        queryFn: ()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$orders$2f$api$2f$orders$2d$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["fetchOrders"])({
                search,
                limit
            }),
        enabled: search.length >= 2,
        staleTime: 30_000
    });
}
;
}),
"[project]/features/orders/hooks/use-all-orders.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useAllOrders",
    ()=>useAllOrders,
    "useOrderFinder",
    ()=>useOrderFinder
]);
/**
 * useAllOrders - Convenience hook for components needing all orders as flat array
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$orders$2f$hooks$2f$use$2d$orders$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/features/orders/hooks/use-orders.ts [app-ssr] (ecmascript) <locals>");
;
;
function useAllOrders() {
    const query = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$orders$2f$hooks$2f$use$2d$orders$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["useOrders"])({
        limit: 30
    });
    return {
        data: query.data?.data || [],
        isLoading: query.isLoading,
        isError: query.isError,
        error: query.error
    };
}
function useOrderFinder() {
    const { data } = useAllOrders();
    const findById = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"]((systemId)=>{
        if (!systemId) return undefined;
        return data.find((o)=>o.systemId === systemId);
    }, [
        data
    ]);
    const findByBusinessId = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"]((businessId)=>{
        if (!businessId) return undefined;
        return data.find((o)=>o.id === businessId);
    }, [
        data
    ]);
    return {
        findById,
        findByBusinessId
    };
}
}),
"[project]/features/orders/hooks/use-order-mutations.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useOptimisticOrderUpdate",
    ()=>useOptimisticOrderUpdate,
    "useOrderMutations",
    ()=>useOrderMutations
]);
/**
 * useOrderMutations - React Query mutations for orders
 * 
 * ⚠️ IMPORTANT: Direct import pattern
 * Import this file directly: import { useOrderMutations } from '@/features/orders/hooks/use-order-mutations'
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@tanstack/react-query/build/modern/useMutation.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@tanstack/react-query/build/modern/QueryClientProvider.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$orders$2f$api$2f$orders$2d$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/orders/api/orders-api.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$orders$2f$hooks$2f$use$2d$orders$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/features/orders/hooks/use-orders.ts [app-ssr] (ecmascript) <locals>");
;
;
;
function useOrderMutations(options = {}) {
    const queryClient = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useQueryClient"])();
    const create = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMutation"])({
        mutationFn: __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$orders$2f$api$2f$orders$2d$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createOrder"],
        onSuccess: (data)=>{
            // Invalidate orders list to refetch
            queryClient.invalidateQueries({
                queryKey: __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$orders$2f$hooks$2f$use$2d$orders$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["orderKeys"].lists()
            });
            // Also invalidate stats
            queryClient.invalidateQueries({
                queryKey: __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$orders$2f$hooks$2f$use$2d$orders$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["orderKeys"].stats()
            });
            options.onCreateSuccess?.(data);
        },
        onError: options.onError
    });
    const update = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMutation"])({
        mutationFn: __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$orders$2f$api$2f$orders$2d$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["updateOrder"],
        onSuccess: (data, variables)=>{
            // Invalidate the specific order detail
            queryClient.invalidateQueries({
                queryKey: __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$orders$2f$hooks$2f$use$2d$orders$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["orderKeys"].detail(variables.id)
            });
            // Invalidate orders list
            queryClient.invalidateQueries({
                queryKey: __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$orders$2f$hooks$2f$use$2d$orders$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["orderKeys"].lists()
            });
            // Invalidate stats in case status changed
            queryClient.invalidateQueries({
                queryKey: __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$orders$2f$hooks$2f$use$2d$orders$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["orderKeys"].stats()
            });
            options.onUpdateSuccess?.(data);
        },
        onError: options.onError
    });
    const remove = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMutation"])({
        mutationFn: __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$orders$2f$api$2f$orders$2d$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["deleteOrder"],
        onSuccess: ()=>{
            // Invalidate all order queries
            queryClient.invalidateQueries({
                queryKey: __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$orders$2f$hooks$2f$use$2d$orders$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["orderKeys"].all
            });
            options.onDeleteSuccess?.();
        },
        onError: options.onError
    });
    return {
        create,
        update,
        remove,
        isCreating: create.isPending,
        isUpdating: update.isPending,
        isDeleting: remove.isPending,
        isMutating: create.isPending || update.isPending || remove.isPending
    };
}
function useOptimisticOrderUpdate() {
    const queryClient = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useQueryClient"])();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMutation"])({
        mutationFn: __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$orders$2f$api$2f$orders$2d$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["updateOrder"],
        // Optimistic update
        onMutate: async (newData)=>{
            // Cancel outgoing refetches
            await queryClient.cancelQueries({
                queryKey: __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$orders$2f$hooks$2f$use$2d$orders$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["orderKeys"].detail(newData.id)
            });
            // Snapshot previous value
            const previousOrder = queryClient.getQueryData(__TURBOPACK__imported__module__$5b$project$5d2f$features$2f$orders$2f$hooks$2f$use$2d$orders$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["orderKeys"].detail(newData.id));
            // Optimistically update
            queryClient.setQueryData(__TURBOPACK__imported__module__$5b$project$5d2f$features$2f$orders$2f$hooks$2f$use$2d$orders$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["orderKeys"].detail(newData.id), (old)=>({
                    ...old,
                    ...newData
                }));
            return {
                previousOrder
            };
        },
        // Rollback on error
        onError: (_err, newData, context)=>{
            if (context?.previousOrder) {
                queryClient.setQueryData(__TURBOPACK__imported__module__$5b$project$5d2f$features$2f$orders$2f$hooks$2f$use$2d$orders$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["orderKeys"].detail(newData.id), context.previousOrder);
            }
        },
        // Refetch after success or error
        onSettled: (_data, _error, variables)=>{
            queryClient.invalidateQueries({
                queryKey: __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$orders$2f$hooks$2f$use$2d$orders$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["orderKeys"].detail(variables.id)
            });
        }
    });
}
}),
"[project]/features/orders/hooks/use-order-actions.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useOrderActions",
    ()=>useOrderActions
]);
/**
 * useOrderActions - Mutations for order actions (cancel, payment, packaging, shipment)
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@tanstack/react-query/build/modern/useMutation.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@tanstack/react-query/build/modern/QueryClientProvider.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$orders$2f$api$2f$order$2d$actions$2d$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/orders/api/order-actions-api.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$orders$2f$hooks$2f$use$2d$orders$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/features/orders/hooks/use-orders.ts [app-ssr] (ecmascript) <locals>");
;
;
;
function useOrderActions(options = {}) {
    const queryClient = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useQueryClient"])();
    const invalidate = ()=>queryClient.invalidateQueries({
            queryKey: __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$orders$2f$hooks$2f$use$2d$orders$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["orderKeys"].all
        });
    const cancel = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMutation"])({
        mutationFn: ({ systemId, reason, restockItems })=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$orders$2f$api$2f$order$2d$actions$2d$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cancelOrder"])(systemId, {
                reason,
                restockItems
            }),
        onSuccess: ()=>{
            invalidate();
            options.onSuccess?.();
        },
        onError: options.onError
    });
    const addPayment = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMutation"])({
        mutationFn: ({ systemId, ...data })=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$orders$2f$api$2f$order$2d$actions$2d$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["addOrderPayment"])(systemId, data),
        onSuccess: ()=>{
            invalidate();
            options.onSuccess?.();
        },
        onError: options.onError
    });
    const updateStatus = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMutation"])({
        mutationFn: ({ systemId, status })=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$orders$2f$api$2f$order$2d$actions$2d$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["updateOrderStatus"])(systemId, status),
        onSuccess: ()=>{
            invalidate();
            options.onSuccess?.();
        },
        onError: options.onError
    });
    const requestPackaging = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMutation"])({
        mutationFn: ({ systemId, assignedEmployeeId })=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$orders$2f$api$2f$order$2d$actions$2d$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createPackaging"])(systemId, {
                assignedEmployeeId
            }),
        onSuccess: ()=>{
            invalidate();
            options.onSuccess?.();
        },
        onError: options.onError
    });
    const confirmPacking = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMutation"])({
        mutationFn: ({ systemId, packagingId })=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$orders$2f$api$2f$order$2d$actions$2d$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["confirmPackaging"])(systemId, packagingId),
        onSuccess: ()=>{
            invalidate();
            options.onSuccess?.();
        },
        onError: options.onError
    });
    const requestShipment = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMutation"])({
        mutationFn: ({ systemId, provider, serviceType })=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$orders$2f$api$2f$order$2d$actions$2d$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createShipment"])(systemId, {
                provider,
                serviceType
            }),
        onSuccess: ()=>{
            invalidate();
            options.onSuccess?.();
        },
        onError: options.onError
    });
    const syncShipment = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMutation"])({
        mutationFn: (systemId)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$orders$2f$api$2f$order$2d$actions$2d$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["syncShipmentStatus"])(systemId),
        onSuccess: ()=>{
            invalidate();
            options.onSuccess?.();
        },
        onError: options.onError
    });
    const cancelOrderShipment = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMutation"])({
        mutationFn: (systemId)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$orders$2f$api$2f$order$2d$actions$2d$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cancelShipment"])(systemId),
        onSuccess: ()=>{
            invalidate();
            options.onSuccess?.();
        },
        onError: options.onError
    });
    return {
        cancel,
        addPayment,
        updateStatus,
        requestPackaging,
        confirmPacking,
        requestShipment,
        syncShipment,
        cancelOrderShipment,
        isLoading: cancel.isPending || addPayment.isPending || updateStatus.isPending || requestPackaging.isPending || confirmPacking.isPending || requestShipment.isPending || syncShipment.isPending || cancelOrderShipment.isPending
    };
}
}),
"[project]/features/orders/hooks/use-shipping-calculator.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useShippingCalculator",
    ()=>useShippingCalculator
]);
/**
 * useShippingCalculator Hook
 * Calculate shipping fees from multiple partners in parallel
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2f$shipping$2d$config$2d$migration$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/utils/shipping-config-migration.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2d$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/api-config.ts [app-ssr] (ecmascript)");
;
;
;
// Cache for shipping calculations (5 minutes)
const CACHE_DURATION = 5 * 60 * 1000;
const calculationCache = new Map();
function getCacheKey(request) {
    return JSON.stringify({
        from: `${request.fromDistrictId}`,
        to: `${request.toDistrictId}`,
        // ✅ CRITICAL: Include province and ward for 2-level address support
        // Without these, 2-level addresses with districtId=0 would have same cache key
        toProvince: request.toProvince || '',
        toWard: request.toWard || request.toWardCode || '',
        weight: request.weight,
        cod: request.codAmount || 0,
        // ✅ CRITICAL: Include transport and orderValue in cache key
        // Different transport (road/fly) = different fees
        // Different orderValue = different insurance fees
        transport: request.options?.transport || 'road',
        orderValue: request.options?.orderValue || 0
    });
}
function useShippingCalculator() {
    const [results, setResults] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"]([]);
    const [isCalculating, setIsCalculating] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"](false);
    const abortControllerRef = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"](null);
    const requestIdRef = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"](0); // ✅ Track request ID
    const calculateFees = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"](async (request)=>{
        // ✅ Cancel previous request if still pending
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }
        // ✅ Create new request ID
        const currentRequestId = ++requestIdRef.current;
        // ✅ Create new AbortController for this request
        const abortController = new AbortController();
        abortControllerRef.current = abortController;
        // ✅ Helper to check if this request should continue
        const shouldContinue = ()=>{
            if (currentRequestId !== requestIdRef.current) {
                return false;
            }
            if (abortController.signal.aborted) {
                return false;
            }
            return true;
        };
        const cacheKey = getCacheKey(request);
        // Check cache
        const cached = calculationCache.get(cacheKey);
        if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
            // Check if request still valid before using cache
            if (!shouldContinue()) {
                throw new Error('REQUEST_CANCELLED');
            }
            setResults(cached.result);
            return cached.result;
        }
        setIsCalculating(true);
        // Load shipping config
        const config = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2f$shipping$2d$config$2d$migration$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["loadShippingConfig"])();
        // Initialize results with loading state
        const partnerCodes = [
            'GHN',
            'GHTK',
            'VTP',
            'J&T',
            'SPX'
        ];
        const partnerNames = {
            'GHN': 'Giao Hàng Nhanh',
            'GHTK': 'Giao Hàng Tiết Kiệm',
            'VTP': 'Viettel Post',
            'J&T': 'J&T Express',
            'SPX': 'SPX Express'
        };
        const initialResults = partnerCodes.map((code)=>({
                partnerId: code,
                partnerCode: code,
                partnerName: partnerNames[code],
                accountSystemId: '',
                status: 'loading',
                services: []
            }));
        setResults(initialResults);
        // Calculate fees in parallel
        const promises = partnerCodes.map(async (partnerCode)=>{
            try {
                // ✅ V2: Get default account for partner
                const partnerData = config.partners[partnerCode];
                if (!partnerData || !partnerData.accounts || partnerData.accounts.length === 0) {
                    // Return "not-configured" status
                    return {
                        partnerId: partnerCode,
                        partnerCode,
                        partnerName: partnerNames[partnerCode],
                        accountSystemId: '',
                        status: 'error',
                        services: [],
                        error: 'NOT_CONFIGURED'
                    };
                }
                // ✅ V2: Get default account (or first active account)
                const defaultAccount = partnerData.accounts.find((a)=>a.isDefault && a.active) || partnerData.accounts.find((a)=>a.active) || partnerData.accounts[0];
                if (!defaultAccount || !defaultAccount.active) {
                    return {
                        partnerId: partnerCode,
                        partnerCode,
                        partnerName: partnerNames[partnerCode],
                        accountSystemId: defaultAccount?.id || '',
                        status: 'error',
                        services: [],
                        error: 'NOT_CONFIGURED'
                    };
                }
                // Call partner API based on type
                let services = [];
                switch(partnerCode){
                    case 'GHN':
                        {
                            // TEMPORARY: Mock data to avoid CORS error
                            // TODO: Call via backend proxy server
                            services = [
                                {
                                    partnerId: partnerCode,
                                    partnerCode,
                                    partnerName: partnerNames[partnerCode],
                                    accountSystemId: 'default',
                                    serviceId: 'standard',
                                    serviceName: 'Giao hàng tiêu chuẩn',
                                    fee: 28000,
                                    estimatedDays: '2-3 ngày'
                                },
                                {
                                    partnerId: partnerCode,
                                    partnerCode,
                                    partnerName: partnerNames[partnerCode],
                                    accountSystemId: 'default',
                                    serviceId: 'express',
                                    serviceName: 'Hỏa tốc',
                                    fee: 40000,
                                    estimatedDays: '1 ngày'
                                }
                            ];
                            break;
                        }
                    case 'GHTK':
                        {
                            // Call via backend proxy server
                            try {
                                const proxyUrl = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2d$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getBaseUrl"])();
                                const pickAddressId = request.fromWardCode || '';
                                // ✅ FIX: Get API token from correct field (apiToken, not token)
                                const apiToken = defaultAccount.credentials.apiToken || '';
                                const partnerCodeStr = defaultAccount.credentials.partnerCode || 'GHTK';
                                console.log('🔑 [GHTK Token Debug]', {
                                    hasDefaultAccount: !!defaultAccount,
                                    accountId: defaultAccount.id,
                                    credentialsKeys: Object.keys(defaultAccount.credentials || {}),
                                    hasApiToken: !!defaultAccount.credentials.apiToken,
                                    apiTokenLength: apiToken.length,
                                    partnerCode: partnerCodeStr
                                });
                                if (!apiToken) {
                                    throw new Error('❌ Missing GHTK API Token. Vui lòng cấu hình token trong Settings > Shipping Partners > GHTK');
                                }
                                // ✅ GHTK minimum weight: 100g
                                if (request.weight < 100) {
                                    throw new Error(`Khối lượng tối thiểu của GHTK là 100g. Hiện tại: ${request.weight}g`);
                                }
                                const requestBody = {
                                    apiToken: apiToken,
                                    partnerCode: partnerCodeStr,
                                    province: request.toProvince || '',
                                    district: request.toDistrict || '',
                                    ward: request.toWard || request.toWardCode || '',
                                    address: request.toAddress,
                                    weight: request.weight,
                                    value: request.options?.orderValue || 0
                                };
                                console.log('🔍 [GHTK Calculator] Request body BEFORE sending:', {
                                    province: requestBody.province,
                                    district: requestBody.district,
                                    ward: requestBody.ward,
                                    toWard: request.toWard,
                                    toWardCode: request.toWardCode,
                                    hasWard: !!requestBody.ward
                                });
                                // Include service options for accurate pricing
                                if (request.options) {
                                    // ✅ GHTK API accepts 'transport' parameter directly
                                    // - 'road' = Đường bộ
                                    // - 'fly' = Đường bay
                                    if (request.options.transport) {
                                        requestBody.transport = request.options.transport;
                                    }
                                    // ❌ TAGS NOT SUPPORTED in calculate fee API (only for order creation)
                                    // if (request.options.tags && request.options.tags.length > 0) {
                                    //   requestBody.tags = request.options.tags;
                                    // }
                                    if (request.options.deliverWorkShift) {
                                        requestBody.deliver_work_shift = request.options.deliverWorkShift;
                                    }
                                    if (request.options.pickAddressId) {
                                        requestBody.pick_address_id = request.options.pickAddressId;
                                    }
                                }
                                // Always send pick_province and pick_district
                                if (pickAddressId) {
                                    requestBody.pick_address_id = pickAddressId;
                                    requestBody.pick_province = request.fromProvince || '';
                                    requestBody.pick_district = request.fromDistrict || '';
                                } else {
                                    requestBody.pick_province = request.fromProvince || '';
                                    requestBody.pick_district = request.fromDistrict || '';
                                }
                                const response = await fetch(`${proxyUrl}/api/shipping/ghtk/calculate-fee`, {
                                    method: 'POST',
                                    headers: {
                                        'Content-Type': 'application/json'
                                    },
                                    body: JSON.stringify(requestBody),
                                    signal: abortController.signal
                                });
                                // ✅ Check if request is still valid before processing response
                                if (!shouldContinue()) {
                                    throw new Error('REQUEST_CANCELLED');
                                }
                                const fees = await response.json();
                                // ✅ Check again after async operation
                                if (!shouldContinue()) {
                                    throw new Error('REQUEST_CANCELLED');
                                }
                                if (fees.success && fees.fee) {
                                    const feeData = fees.fee;
                                    const standardFee = feeData.fee || 0;
                                    const insuranceFee = feeData.insurance_fee || 0;
                                    const deliveryType = feeData.delivery_type || '';
                                    // Xác định tên gói cước dựa trên delivery_type
                                    let standardServiceName = 'Giao hàng tiêu chuẩn';
                                    let expressServiceName = 'Giao hàng nhanh';
                                    const deliveryTypeLower = deliveryType.toLowerCase();
                                    if (deliveryTypeLower.includes('bbs') || deliveryTypeLower.includes('hangnang') || deliveryTypeLower.includes('(10-20kg)') || deliveryTypeLower.includes('(20-')) {
                                        standardServiceName = 'Hàng nặng BBS';
                                        expressServiceName = 'BBS Nhanh';
                                    } else if (deliveryTypeLower.includes('tietkiem') || deliveryTypeLower.includes('pd-')) {
                                        standardServiceName = 'Gói tiết kiệm';
                                        expressServiceName = 'Tiết kiệm nhanh';
                                    }
                                    // Express fee = standard + 40%
                                    const expressFee = Math.round(standardFee * 1.4);
                                    services = [
                                        {
                                            partnerId: partnerCode,
                                            partnerCode,
                                            partnerName: partnerNames[partnerCode],
                                            accountSystemId: defaultAccount.id,
                                            serviceId: 'standard',
                                            serviceName: standardServiceName,
                                            fee: standardFee,
                                            estimatedDays: '1-2 ngày'
                                        },
                                        {
                                            partnerId: partnerCode,
                                            partnerCode,
                                            partnerName: partnerNames[partnerCode],
                                            accountSystemId: defaultAccount.id,
                                            serviceId: 'express',
                                            serviceName: expressServiceName,
                                            fee: expressFee,
                                            estimatedDays: '0-1 ngày'
                                        }
                                    ];
                                } else {
                                    const errorMsg = fees.message || 'GHTK API Error';
                                    throw new Error(errorMsg);
                                }
                            } catch (error) {
                                // ✅ Ignore AbortError - request was cancelled
                                if (error instanceof Error && error.name === 'AbortError') {
                                    // Return empty result instead of throwing
                                    services = [];
                                    break;
                                }
                                // Fallback to mock data
                                services = [
                                    {
                                        partnerId: partnerCode,
                                        partnerCode,
                                        partnerName: partnerNames[partnerCode],
                                        accountSystemId: defaultAccount.id,
                                        serviceId: 'standard',
                                        serviceName: 'Giao hàng tiêu chuẩn',
                                        fee: 25000,
                                        estimatedDays: '1-2 ngày'
                                    }
                                ];
                            }
                            break;
                        }
                    case 'VTP':
                        {
                            // Mock VTP for now
                            services = [
                                {
                                    partnerId: partnerCode,
                                    partnerCode,
                                    partnerName: partnerNames[partnerCode],
                                    accountSystemId: defaultAccount.id,
                                    serviceId: 'standard',
                                    serviceName: 'Tiêu chuẩn',
                                    fee: 30000,
                                    estimatedDays: '2-3 ngày'
                                }
                            ];
                            break;
                        }
                    case 'J&T':
                        {
                            // Mock J&T for now
                            services = [
                                {
                                    partnerId: partnerCode,
                                    partnerCode,
                                    partnerName: partnerNames[partnerCode],
                                    accountSystemId: defaultAccount.id,
                                    serviceId: 'standard',
                                    serviceName: 'Tiêu chuẩn',
                                    fee: 26000,
                                    estimatedDays: '2-4 ngày'
                                }
                            ];
                            break;
                        }
                    case 'SPX':
                        {
                            // Mock SPX for now
                            services = [
                                {
                                    partnerId: partnerCode,
                                    partnerCode,
                                    partnerName: partnerNames[partnerCode],
                                    accountSystemId: defaultAccount.id,
                                    serviceId: 'standard',
                                    serviceName: 'Tiêu chuẩn',
                                    fee: 28000,
                                    estimatedDays: '2-3 ngày'
                                }
                            ];
                            break;
                        }
                    default:
                        return {
                            partnerId: partnerCode,
                            partnerCode,
                            partnerName: partnerNames[partnerCode],
                            accountSystemId: '',
                            status: 'error',
                            services: [],
                            error: 'Partner không được hỗ trợ'
                        };
                }
                return {
                    partnerId: partnerCode,
                    partnerCode,
                    partnerName: partnerNames[partnerCode],
                    accountSystemId: defaultAccount.id,
                    status: 'success',
                    services
                };
            } catch (error) {
                return {
                    partnerId: partnerCode,
                    partnerCode,
                    partnerName: partnerNames[partnerCode],
                    accountSystemId: '',
                    status: 'error',
                    services: [],
                    error: error.message || 'Không thể tính phí'
                };
            }
        });
        const calculatedResults = await Promise.allSettled(promises);
        // ✅ Final check: Only update state if this is still the latest request
        if (!shouldContinue()) {
            setIsCalculating(false);
            return []; // Don't update state
        }
        const finalResults = calculatedResults.map((result, index)=>{
            // ✅ Handle fulfilled promises
            if (result.status === 'fulfilled' && result.value) {
                return result.value;
            }
            // ✅ Handle rejected or aborted promises
            return {
                partnerId: partnerCodes[index],
                partnerCode: partnerCodes[index],
                partnerName: partnerNames[partnerCodes[index]],
                accountSystemId: '',
                status: 'error',
                services: [],
                error: result.status === 'rejected' ? result.reason?.message || 'Lỗi kết nối' : 'Request cancelled'
            };
        }).filter((result)=>result !== null && result.status !== undefined); // ✅ Filter out nulls
        // Update cache
        calculationCache.set(cacheKey, {
            result: finalResults,
            timestamp: Date.now()
        });
        setResults(finalResults);
        setIsCalculating(false);
        return finalResults;
    }, []);
    const clearCache = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"](()=>{
        calculationCache.clear();
    }, []);
    return {
        results,
        isCalculating,
        calculateFees,
        clearCache
    };
}
}),
"[project]/features/orders/hooks/use-global-shipping-config.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "DELIVERY_REQUIREMENT_LABELS",
    ()=>DELIVERY_REQUIREMENT_LABELS,
    "calculateWeight",
    ()=>calculateWeight,
    "getDefaultDimensions",
    ()=>getDefaultDimensions,
    "getGHTKTagsFromRequirement",
    ()=>getGHTKTagsFromRequirement,
    "useGlobalShippingConfig",
    ()=>useGlobalShippingConfig
]);
/**
 * useGlobalShippingConfig Hook
 * Get global shipping configuration and apply to order forms
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2f$shipping$2d$config$2d$migration$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/utils/shipping-config-migration.ts [app-ssr] (ecmascript)");
;
;
const DELIVERY_REQUIREMENT_LABELS = {
    'ALLOW_CHECK_NOT_TRY': 'Cho xem hàng, không cho thử',
    'ALLOW_TRY': 'Cho thử hàng',
    'NOT_ALLOW_CHECK': 'Không cho xem hàng'
};
function getGHTKTagsFromRequirement(requirement) {
    switch(requirement){
        case 'ALLOW_CHECK_NOT_TRY':
        case 'ALLOW_TRY':
            return [
                10
            ]; // Tag 10: Cho xem hàng
        case 'NOT_ALLOW_CHECK':
        default:
            return [];
    }
}
function calculateWeight(config, productWeights// Array of product weights in grams
) {
    if (config.weight.mode === 'FROM_PRODUCTS') {
        // Sum all product weights
        const totalWeight = productWeights.reduce((sum, w)=>sum + (w || 0), 0);
        // Minimum 100g for GHTK
        return Math.max(totalWeight, 100);
    } else {
        // Use custom value
        return config.weight.customValue || 100;
    }
}
function getDefaultDimensions(config) {
    return {
        length: config.dimensions.length || 30,
        width: config.dimensions.width || 20,
        height: config.dimensions.height || 10
    };
}
function useGlobalShippingConfig() {
    const [globalConfig, setGlobalConfig] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"](()=>{
        const config = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2f$shipping$2d$config$2d$migration$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["loadShippingConfig"])();
        return config.global;
    });
    // Reload config when needed
    const reload = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"](()=>{
        const config = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2f$shipping$2d$config$2d$migration$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["loadShippingConfig"])();
        setGlobalConfig(config.global);
    }, []);
    // Get default shipping options based on global config
    const getDefaultShippingOptions = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"](()=>{
        return {
            // Delivery requirement
            requirement: globalConfig.requirement,
            requirementLabel: DELIVERY_REQUIREMENT_LABELS[globalConfig.requirement],
            // Default note
            note: globalConfig.note || '',
            // GHTK specific tags based on requirement
            ghtkTags: getGHTKTagsFromRequirement(globalConfig.requirement),
            // Auto sync settings
            autoSyncCancelStatus: globalConfig.autoSyncCancelStatus,
            autoSyncCODCollection: globalConfig.autoSyncCODCollection,
            // Warning days
            latePickupWarningDays: globalConfig.latePickupWarningDays,
            lateDeliveryWarningDays: globalConfig.lateDeliveryWarningDays
        };
    }, [
        globalConfig
    ]);
    // Calculate weight for order based on products
    const getWeight = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"]((productWeights)=>{
        return calculateWeight(globalConfig, productWeights);
    }, [
        globalConfig
    ]);
    // Get default dimensions
    const getDimensions = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"](()=>{
        return getDefaultDimensions(globalConfig);
    }, [
        globalConfig
    ]);
    return {
        globalConfig,
        reload,
        getDefaultShippingOptions,
        getWeight,
        getDimensions,
        // Direct access to config values
        weightMode: globalConfig.weight.mode,
        customWeight: globalConfig.weight.customValue,
        defaultDimensions: globalConfig.dimensions,
        deliveryRequirement: globalConfig.requirement,
        defaultNote: globalConfig.note
    };
}
}),
"[project]/features/orders/hooks/use-debounce.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useDebounce",
    ()=>useDebounce
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
;
function useDebounce(value, delay = 500) {
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
"[project]/features/orders/store.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useOrderStore",
    ()=>useOrderStore
]);
// persist middleware removed - database is now source of truth
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/date-utils.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2d$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/api-config.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2d$factory$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/store-factory.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/id-types.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/id-utils.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$employees$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/employees/store.ts [app-ssr] (ecmascript)");
// REMOVED: Voucher store no longer exists - using Payment/Receipt stores instead
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$products$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/products/store.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$products$2f$combo$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/products/combo-utils.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$stock$2d$history$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/stock-history/store.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$customers$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/customers/store.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$receipt$2d$types$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/settings/receipt-types/store.ts [app-ssr] (ecmascript)");
// REMOVED: import type { Voucher } from '../vouchers/types';
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$cashbook$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/cashbook/store.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$receipts$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/receipts/store.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$sales$2d$returns$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/sales-returns/store.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$finance$2f$document$2d$helpers$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/finance/document-helpers.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$shipments$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/shipments/store.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$contexts$2f$auth$2d$context$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/contexts/auth-context.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$sales$2f$sales$2d$management$2d$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/settings/sales/sales-management-store.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$activity$2d$history$2d$helper$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/activity-history-helper.ts [app-ssr] (ecmascript)");
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
// ✅ Helper to get branch systemId
const getBranchId = (order)=>order.branchSystemId;
const deliveryStatusesBlockedForCancellation = [
    'Đang giao hàng',
    'Đã giao hàng',
    'Chờ giao lại'
];
const IN_STORE_PICKUP_PREFIX = 'INSTORE';
const PACKAGING_CODE_PREFIX = 'DG';
const PACKAGING_SYSTEM_ID_PREFIX = 'PACKAGE';
// ✅ Track packaging systemId counter globally
let packagingSystemIdCounter = 0;
// ✅ Initialize counter from all existing packagings across all orders
const initPackagingCounter = (orders)=>{
    const allPackagings = orders.flatMap((o)=>o.packagings || []);
    packagingSystemIdCounter = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getMaxSystemIdCounter"])(allPackagings, PACKAGING_SYSTEM_ID_PREFIX);
};
// ✅ Generate next packaging systemId
const getNextPackagingSystemId = ()=>{
    packagingSystemIdCounter++;
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["generateSystemId"])('packaging', packagingSystemIdCounter));
};
const getPackagingSuffixFromOrderId = (orderId)=>{
    if (!orderId) return '';
    const rawValue = `${orderId}`;
    const suffix = rawValue.replace(/^[A-Z-]+/, '');
    return suffix || rawValue;
};
// Count only active packagings (not cancelled) for numbering
const getActivePackagingCount = (packagings)=>{
    return packagings.filter((p)=>p.status !== 'Hủy đóng gói').length;
};
const buildPackagingBusinessId = (orderId, activeIndex, activeCount)=>{
    const suffix = getPackagingSuffixFromOrderId(orderId);
    const baseCode = `${PACKAGING_CODE_PREFIX}${suffix || '000000'}`;
    // Only add suffix if there are multiple active packagings
    if (activeCount > 1 && activeIndex > 0) {
        const paddedIndex = String(activeIndex + 1).padStart(2, '0');
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])(`${baseCode}-${paddedIndex}`);
    }
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])(baseCode);
};
const getReturnedValueForOrder = (orderSystemId)=>{
    return __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$sales$2d$returns$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useSalesReturnStore"].getState().data.filter((sr)=>sr.orderSystemId === orderSystemId).reduce((sum, sr)=>sum + sr.totalReturnValue, 0);
};
const calculateActualDebt = (order)=>{
    const totalReturnedValue = getReturnedValueForOrder(order.systemId);
    return Math.max(order.grandTotal - totalReturnedValue, 0);
};
const calculateTotalPaid = (payments)=>{
    return payments.reduce((sum, payment)=>sum + payment.amount, 0);
};
const getOrderOutstandingAmount = (order)=>{
    const actualDebt = calculateActualDebt(order);
    const totalPaid = calculateTotalPaid(order.payments ?? []);
    return Math.max(actualDebt - totalPaid, 0);
};
const applyPaymentToOrder = (order, payment)=>{
    const updatedPayments = [
        ...order.payments ?? [],
        payment
    ];
    const totalPaid = calculateTotalPaid(updatedPayments);
    const actualDebt = calculateActualDebt(order);
    let newPaymentStatus = 'Chưa thanh toán';
    if (totalPaid >= actualDebt) {
        newPaymentStatus = 'Thanh toán toàn bộ';
    } else if (totalPaid > 0) {
        newPaymentStatus = 'Thanh toán 1 phần';
    }
    const wasCompleted = order.status === 'Hoàn thành';
    let newStatus = order.status;
    let newCompletedDate = order.completedDate;
    if (newPaymentStatus === 'Thanh toán toàn bộ' && order.deliveryStatus === 'Đã giao hàng') {
        newStatus = 'Hoàn thành';
        newCompletedDate = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toISODateTime"])(new Date());
        if (!wasCompleted) {
            const { incrementOrderStats } = __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$customers$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCustomerStore"].getState();
            incrementOrderStats(order.customerSystemId, order.grandTotal);
        }
    }
    const { updateDebtTransactionPayment } = __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$customers$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCustomerStore"].getState();
    updateDebtTransactionPayment(order.customerSystemId, order.id, payment.amount);
    return {
        ...order,
        payments: updatedPayments,
        paymentStatus: newPaymentStatus,
        status: newStatus,
        completedDate: newCompletedDate,
        paidAmount: totalPaid
    };
};
const shouldAutoAllocateReceipt = (receipt)=>{
    return receipt.status === 'completed' && receipt.affectsDebt && !!receipt.customerSystemId && !receipt.linkedOrderSystemId;
};
const getAllocatedAmount = (receipt)=>{
    return receipt.orderAllocations?.reduce((sum, allocation)=>sum + allocation.amount, 0) ?? 0;
};
const autoAllocateReceiptToOrders = (receipt)=>{
    if (!shouldAutoAllocateReceipt(receipt)) {
        return;
    }
    const remainingAmount = receipt.amount - getAllocatedAmount(receipt);
    if (remainingAmount <= 0) {
        return;
    }
    const candidateOrders = baseStore.getState().data.filter((order)=>order.customerSystemId === receipt.customerSystemId && order.status !== 'Đã hủy').map((order)=>({
            order,
            outstanding: getOrderOutstandingAmount(order)
        })).filter((entry)=>entry.outstanding > 0).sort((a, b)=>{
        const aTime = a.order.orderDate ? new Date(a.order.orderDate).getTime() : 0;
        const bTime = b.order.orderDate ? new Date(b.order.orderDate).getTime() : 0;
        return aTime - bTime;
    });
    if (!candidateOrders.length) {
        return;
    }
    let amountToDistribute = remainingAmount;
    const updatedOrders = new Map();
    const allocationEntries = [];
    for (const { order } of candidateOrders){
        if (amountToDistribute <= 0) {
            break;
        }
        const currentOrderState = updatedOrders.get(order.systemId) ?? order;
        const outstanding = getOrderOutstandingAmount(currentOrderState);
        if (outstanding <= 0) {
            continue;
        }
        const allocationAmount = Math.min(outstanding, amountToDistribute);
        if (allocationAmount <= 0) {
            continue;
        }
        const paymentEntry = {
            systemId: receipt.systemId,
            id: receipt.id,
            date: receipt.date,
            amount: allocationAmount,
            method: receipt.paymentMethodName,
            createdBy: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])(receipt.createdBy),
            description: receipt.description ?? `Thanh toán từ phiếu thu ${receipt.id}`
        };
        const updatedOrder = applyPaymentToOrder(currentOrderState, paymentEntry);
        updatedOrders.set(order.systemId, updatedOrder);
        allocationEntries.push({
            orderSystemId: order.systemId,
            orderId: order.id,
            amount: allocationAmount
        });
        amountToDistribute -= allocationAmount;
    }
    if (!allocationEntries.length) {
        return;
    }
    baseStore.setState((state)=>{
        const data = state.data.map((order)=>updatedOrders.get(order.systemId) ?? order);
        return {
            data
        };
    });
    const receiptStore = __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$receipts$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useReceiptStore"].getState();
    const latestReceipt = receiptStore.findById(receipt.systemId);
    if (!latestReceipt) {
        return;
    }
    receiptStore.update(receipt.systemId, {
        ...latestReceipt,
        orderAllocations: [
            ...latestReceipt.orderAllocations ?? [],
            ...allocationEntries
        ]
    });
};
const ensureOrderPackagingIdentifiers = (order)=>{
    if (!order.packagings || order.packagings.length === 0) {
        return null;
    }
    // Count only active packagings for proper numbering
    const activePackagings = order.packagings.filter((p)=>p.status !== 'Hủy đóng gói');
    const activeCount = activePackagings.length;
    let changed = false;
    let activeIndex = 0;
    const updatedPackagings = order.packagings.map((pkg, idx)=>{
        const isCancelled = pkg.status === 'Hủy đóng gói';
        const hasId = typeof pkg.id === 'string' && pkg.id.trim().length > 0;
        // ✅ Check for temp systemId or old format (PKG_)
        const hasTempOrOldSystemId = pkg.systemId?.startsWith('PKG_TEMP_') || pkg.systemId?.startsWith('PKG_');
        const hasValidSystemId = pkg.systemId?.startsWith(PACKAGING_SYSTEM_ID_PREFIX);
        const shouldFixTracking = pkg.deliveryMethod === 'Nhận tại cửa hàng' && pkg.trackingCode === `${IN_STORE_PICKUP_PREFIX}-`;
        // For cancelled packagings, keep existing ID
        if (isCancelled) {
            if (!hasId || hasTempOrOldSystemId && !hasValidSystemId) {
                // Still need to assign an ID if missing
                const nextPkg = {
                    ...pkg
                };
                if (!hasId) {
                    nextPkg.id = buildPackagingBusinessId(order.id, 0, 1);
                }
                if (hasTempOrOldSystemId && !hasValidSystemId) {
                    nextPkg.systemId = getNextPackagingSystemId();
                }
                changed = true;
                return nextPkg;
            }
            return pkg;
        }
        // For active packagings, use activeIndex for numbering
        const currentActiveIndex = activeIndex;
        activeIndex++;
        if (hasId && !shouldFixTracking && hasValidSystemId) {
            return pkg;
        }
        const nextPkg = {
            ...pkg
        };
        if (!hasId) {
            nextPkg.id = buildPackagingBusinessId(order.id, currentActiveIndex, activeCount);
            changed = true;
        }
        // ✅ Fix temporary/old systemId to proper format PACKAGE000001
        if (hasTempOrOldSystemId && !hasValidSystemId) {
            nextPkg.systemId = getNextPackagingSystemId();
            changed = true;
        }
        if (shouldFixTracking) {
            const resolvedId = nextPkg.id ?? buildPackagingBusinessId(order.id, currentActiveIndex, activeCount);
            nextPkg.trackingCode = `${IN_STORE_PICKUP_PREFIX}-${resolvedId}`;
            changed = true;
        }
        return nextPkg;
    });
    return changed ? {
        ...order,
        packagings: updatedPackagings
    } : null;
};
const ensureCancellationAllowed = (order, actionLabel)=>{
    if (!order) return false;
    const { allowCancelAfterExport } = __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$sales$2f$sales$2d$management$2d$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useSalesManagementSettingsStore"].getState();
    if (allowCancelAfterExport) {
        return true;
    }
    const hasLeftWarehouse = order.stockOutStatus === 'Xuất kho toàn bộ' || deliveryStatusesBlockedForCancellation.includes(order.deliveryStatus);
    if (hasLeftWarehouse) {
        alert(`Không thể ${actionLabel} vì đơn hàng đã xuất kho. Vào Cấu hình bán hàng -> Thiết lập quản lý bán hàng và bật "Cho phép hủy đơn hàng sau khi xuất kho".`);
        return false;
    }
    return true;
};
const processLineItemStock = (lineItem, branchSystemId, operation, orderQuantity = 1 // Số lượng đặt của line item
)=>{
    const { findById: findProductById, commitStock, uncommitStock, dispatchStock, completeDelivery, returnStockFromTransit } = __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$products$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useProductStore"].getState();
    const product = findProductById((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])(lineItem.productSystemId));
    // Xác định danh sách items cần xử lý (SP con nếu combo, hoặc chính SP nếu thường)
    const itemsToProcess = [];
    if (product && (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$products$2f$combo$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isComboProduct"])(product) && product.comboItems) {
        // Combo: xử lý tất cả SP con
        product.comboItems.forEach((comboItem)=>{
            itemsToProcess.push({
                productSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])(comboItem.productSystemId),
                quantity: orderQuantity * comboItem.quantity
            });
        });
    } else {
        // Sản phẩm thường
        itemsToProcess.push({
            productSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])(lineItem.productSystemId),
            quantity: orderQuantity
        });
    }
    // Thực hiện operation cho từng item
    itemsToProcess.forEach((item)=>{
        const branchId = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])(branchSystemId);
        switch(operation){
            case 'commit':
                commitStock(item.productSystemId, branchId, item.quantity);
                break;
            case 'uncommit':
                uncommitStock(item.productSystemId, branchId, item.quantity);
                break;
            case 'dispatch':
                dispatchStock(item.productSystemId, branchId, item.quantity);
                break;
            case 'complete':
                completeDelivery(item.productSystemId, branchId, item.quantity);
                break;
            case 'return':
                returnStockFromTransit(item.productSystemId, branchId, item.quantity);
                break;
        }
    });
    return itemsToProcess; // Return để có thể dùng cho stock history
};
/**
 * ✅ Helper để lấy danh sách stock items từ line items (mở rộng combo thành SP con)
 * Dùng trong webhook GHTK hoặc các thao tác batch
 */ const getComboStockItems = (lineItems)=>{
    const { findById: findProductById } = __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$products$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useProductStore"].getState();
    const stockItems = [];
    lineItems.forEach((item)=>{
        const product = findProductById((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])(item.productSystemId));
        if (product && (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$products$2f$combo$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isComboProduct"])(product) && product.comboItems) {
            // Combo: mở rộng thành SP con
            product.comboItems.forEach((comboItem)=>{
                stockItems.push({
                    productSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])(comboItem.productSystemId),
                    quantity: item.quantity * comboItem.quantity
                });
            });
        } else {
            // Sản phẩm thường
            stockItems.push({
                productSystemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])(item.productSystemId),
                quantity: item.quantity
            });
        }
    });
    return stockItems;
};
const createOrderRefundVoucher = (order, amount, employeeId)=>{
    const lastPositivePayment = [
        ...order.payments ?? []
    ].reverse().find((p)=>p.amount > 0);
    const { document, error } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$finance$2f$document$2d$helpers$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createPaymentDocument"])({
        amount,
        description: `Hoàn tiền do hủy đơn ${order.id}`,
        recipientName: order.customerName,
        recipientSystemId: order.customerSystemId,
        customerSystemId: order.customerSystemId,
        customerName: order.customerName,
        branchSystemId: order.branchSystemId,
        branchName: order.branchName,
        createdBy: employeeId,
        paymentMethodName: lastPositivePayment?.method || 'Tiền mặt',
        paymentTypeName: 'Hoàn tiền khách hàng',
        originalDocumentId: order.id,
        linkedOrderSystemId: order.systemId,
        affectsDebt: true,
        category: 'other'
    });
    if (!document) {
        console.error('[cancelOrder] Không thể tạo phiếu chi hoàn tiền', error);
        return null;
    }
    return document;
};
// REMOVED: initialDataOmit transformation - database is source of truth
const initialData = [];
const baseStore = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2d$factory$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createCrudStore"])([], 'orders', {
    businessIdField: 'id',
    apiEndpoint: '/api/orders',
    getCurrentUser: ()=>{
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$contexts$2f$auth$2d$context$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getCurrentUserSystemId"])());
    }
});
// ✅ API Sync helpers
const API_ENDPOINT = '/api/orders';
const syncToApi = {
    create: async (order)=>{
        try {
            const response = await fetch(API_ENDPOINT, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(order)
            });
            if (!response.ok) console.warn('[Order API] Create sync failed');
            else console.log('[Order API] Created:', order.systemId);
        } catch (e) {
            console.warn('[Order API] Create sync error:', e);
        }
    },
    update: async (systemId, updates)=>{
        try {
            const response = await fetch(`${API_ENDPOINT}/${systemId}`, {
                method: 'PATCH',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updates)
            });
            if (!response.ok) console.warn('[Order API] Update sync failed');
            else console.log('[Order API] Updated:', systemId);
        } catch (e) {
            console.warn('[Order API] Update sync error:', e);
        }
    },
    delete: async (systemId, hard = false)=>{
        try {
            const response = await fetch(`${API_ENDPOINT}/${systemId}`, {
                method: 'DELETE',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    hard
                })
            });
            if (!response.ok) console.warn('[Order API] Delete sync failed');
            else console.log('[Order API] Deleted:', systemId);
        } catch (e) {
            console.warn('[Order API] Delete sync error:', e);
        }
    },
    restore: async (systemId)=>{
        try {
            const response = await fetch(`${API_ENDPOINT}/${systemId}/restore`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            if (!response.ok) console.warn('[Order API] Restore sync failed');
            else console.log('[Order API] Restored:', systemId);
        } catch (e) {
            console.warn('[Order API] Restore sync error:', e);
        }
    }
};
// ✅ Wrap base store methods with API sync
const originalAdd = baseStore.getState().add;
const originalUpdate = baseStore.getState().update;
const originalRemove = baseStore.getState().remove;
const originalHardDelete = baseStore.getState().hardDelete;
const originalRestore = baseStore.getState().restore;
baseStore.setState({
    add: (item)=>{
        const result = originalAdd(item);
        syncToApi.create(result);
        return result;
    },
    update: (systemId, updates)=>{
        originalUpdate(systemId, updates);
        syncToApi.update(systemId, updates);
    },
    remove: (systemId)=>{
        originalRemove(systemId);
        syncToApi.delete(systemId, false);
    },
    hardDelete: (systemId)=>{
        originalHardDelete(systemId);
        syncToApi.delete(systemId, true);
    },
    restore: (systemId)=>{
        originalRestore(systemId);
        syncToApi.restore(systemId);
    }
});
// ✅ MIGRATION: Ensure all orders have paidAmount field (backward compatibility)
baseStore.setState((state)=>({
        data: state.data.map((order)=>({
                ...order,
                paidAmount: order.paidAmount ?? 0
            }))
    }));
// ✅ MIGRATION: Merge seed data - add new orders from initialData if not exist in persisted store
baseStore.setState((state)=>{
    const existingIds = new Set(state.data.map((o)=>o.systemId));
    const newOrders = initialData.filter((o)=>!existingIds.has(o.systemId));
    if (newOrders.length > 0) {
        return {
            data: [
                ...state.data,
                ...newOrders
            ]
        };
    }
    return state;
});
// ✅ MIGRATION: Fix order status - orders with full payment and delivery should be "Hoàn thành"
baseStore.setState((state)=>({
        data: state.data.map((order)=>{
            // If order is already completed or cancelled, skip
            if (order.status === 'Hoàn thành' || order.status === 'Đã hủy') {
                return order;
            }
            // Check if all active packagings are delivered
            const activePackagings = order.packagings.filter((p)=>p.status !== 'Hủy đóng gói');
            const isAllDelivered = activePackagings.length > 0 && activePackagings.every((p)=>p.deliveryStatus === 'Đã giao hàng');
            // If fully paid and fully delivered, update status to "Hoàn thành"
            if (order.paymentStatus === 'Thanh toán toàn bộ' && (isAllDelivered || order.deliveryStatus === 'Đã giao hàng')) {
                return {
                    ...order,
                    status: 'Hoàn thành',
                    completedDate: order.completedDate || (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toISODateTime"])(new Date())
                };
            }
            return order;
        })
    }));
const originalAddWithStock = baseStore.getState().add;
baseStore.setState({
    add: (item)=>{
        const { commitStock, findById: findProductById } = __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$products$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useProductStore"].getState();
        const userInfo = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$activity$2d$history$2d$helper$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getCurrentUserInfo"])();
        const newItem = originalAddWithStock(item);
        if (newItem) {
            const hydratedPackagings = ensureOrderPackagingIdentifiers(newItem);
            if (hydratedPackagings) {
                Object.assign(newItem, hydratedPackagings);
                baseStore.setState((state)=>({
                        data: state.data.map((order)=>order.systemId === hydratedPackagings.systemId ? hydratedPackagings : order)
                    }));
            }
            newItem.lineItems.forEach((li)=>{
                const product = findProductById((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])(li.productSystemId));
                // ✅ Xử lý combo: commit stock của SP con thay vì combo
                if (product && (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$products$2f$combo$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isComboProduct"])(product) && product.comboItems) {
                    product.comboItems.forEach((comboItem)=>{
                        // Commit stock = số lượng combo × số lượng SP con trong combo
                        const totalQuantity = li.quantity * comboItem.quantity;
                        commitStock((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])(comboItem.productSystemId), (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])(newItem.branchSystemId), totalQuantity);
                    });
                } else {
                    // Sản phẩm thường: commit stock như bình thường
                    commitStock((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])(li.productSystemId), (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])(newItem.branchSystemId), li.quantity);
                }
            });
            // ✅ Cập nhật lastPurchaseDate khi tạo đơn mới (để SLA/churn risk hoạt động đúng)
            if (newItem.customerSystemId) {
                const { update: updateCustomer, findById: findCustomer } = __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$customers$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCustomerStore"].getState();
                const customer = findCustomer(newItem.customerSystemId);
                if (customer) {
                    updateCustomer(newItem.customerSystemId, {
                        lastPurchaseDate: new Date().toISOString().split('T')[0]
                    });
                }
            }
            // ✅ Add activity history entry
            const historyEntry = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$activity$2d$history$2d$helper$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createCreatedEntry"])(userInfo, `${userInfo.name} đã tạo đơn hàng ${newItem.id} cho khách hàng ${newItem.customerName} (Tổng: ${newItem.grandTotal.toLocaleString('vi-VN')}đ)`);
            baseStore.setState((state)=>({
                    data: state.data.map((order)=>order.systemId === newItem.systemId ? {
                            ...order,
                            activityHistory: [
                                historyEntry
                            ]
                        } : order)
                }));
        }
        return newItem;
    }
});
const backfillPackagingIdentifiers = ()=>{
    const currentState = baseStore.getState();
    let changed = false;
    const updatedData = currentState.data.map((order)=>{
        const updatedOrder = ensureOrderPackagingIdentifiers(order);
        if (updatedOrder) {
            changed = true;
            return updatedOrder;
        }
        return order;
    });
    if (changed) {
        baseStore.setState({
            data: updatedData
        });
    }
};
backfillPackagingIdentifiers();
const augmentedMethods = {
    cancelOrder: (systemId, employeeId, options)=>{
        const { reason, restock = true } = options ?? {};
        const currentOrder = baseStore.getState().data.find((o)=>o.systemId === systemId);
        if (!ensureCancellationAllowed(currentOrder, 'hủy đơn hàng')) {
            return;
        }
        baseStore.setState((state)=>{
            const orderToCancel = state.data.find((o)=>o.systemId === systemId);
            if (!orderToCancel || orderToCancel.status === 'Đã hủy') {
                return state;
            }
            const employee = __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$employees$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEmployeeStore"].getState().findById(employeeId);
            const now = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toISODateTime"])(new Date());
            const cancellationReason = reason && reason.trim().length > 0 ? reason.trim() : orderToCancel.cancellationReason || `Hủy bởi ${employee?.fullName || 'Hệ thống'}`;
            // ✅ Uncommit stock (hỗ trợ combo)
            if (restock) {
                orderToCancel.lineItems.forEach((item)=>{
                    processLineItemStock(item, orderToCancel.branchSystemId, 'uncommit', item.quantity);
                });
            }
            const hasDispatchedStock = orderToCancel.stockOutStatus === 'Xuất kho toàn bộ' || [
                'Chờ lấy hàng',
                'Đang giao hàng',
                'Đã giao hàng',
                'Chờ giao lại'
            ].includes(orderToCancel.deliveryStatus);
            // ✅ Return stock from transit (hỗ trợ combo)
            if (restock && hasDispatchedStock) {
                orderToCancel.lineItems.forEach((item)=>{
                    processLineItemStock(item, orderToCancel.branchSystemId, 'return', item.quantity);
                });
            }
            const existingPayments = orderToCancel.payments ?? [];
            const netCollected = existingPayments.reduce((sum, payment)=>sum + payment.amount, 0);
            let refundPaymentEntry = null;
            const refundAmount = netCollected > 0 ? netCollected : 0;
            if (refundAmount > 0) {
                const refundVoucher = createOrderRefundVoucher(orderToCancel, refundAmount, employeeId);
                if (!refundVoucher) {
                    alert('Không thể tạo phiếu chi hoàn tiền. Vui lòng kiểm tra cấu hình tài chính trước khi hủy đơn.');
                    return state;
                }
                refundPaymentEntry = {
                    systemId: refundVoucher.systemId,
                    id: refundVoucher.id,
                    date: refundVoucher.date,
                    amount: -refundAmount,
                    method: refundVoucher.paymentMethodName,
                    createdBy: employeeId,
                    description: `Hoàn tiền khi hủy đơn ${orderToCancel.id}`
                };
            }
            const updatedPayments = refundPaymentEntry ? [
                ...existingPayments,
                refundPaymentEntry
            ] : existingPayments;
            const updatedPaidAmount = Math.max(0, (orderToCancel.paidAmount ?? 0) - refundAmount);
            const updatedPackagings = orderToCancel.packagings.map((pkg)=>{
                if (pkg.status === 'Hủy đóng gói' && pkg.deliveryStatus === 'Đã hủy') {
                    return pkg;
                }
                return {
                    ...pkg,
                    status: 'Hủy đóng gói',
                    deliveryStatus: 'Đã hủy',
                    cancelDate: now,
                    cancelReason: pkg.cancelReason ?? cancellationReason,
                    cancelingEmployeeId: employeeId,
                    cancelingEmployeeName: employee?.fullName || 'Hệ thống'
                };
            });
            const updatedOrder = {
                ...orderToCancel,
                status: 'Đã hủy',
                cancelledDate: now,
                cancellationReason,
                deliveryStatus: 'Đã hủy',
                stockOutStatus: restock ? 'Chưa xuất kho' : orderToCancel.stockOutStatus,
                payments: updatedPayments,
                paidAmount: updatedPaidAmount,
                paymentStatus: refundPaymentEntry ? 'Chưa thanh toán' : orderToCancel.paymentStatus,
                packagings: updatedPackagings,
                cancellationMetadata: {
                    restockItems: restock,
                    notifyCustomer: false,
                    emailNotifiedAt: undefined
                },
                activityHistory: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$activity$2d$history$2d$helper$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["appendHistoryEntry"])(orderToCancel.activityHistory, (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$activity$2d$history$2d$helper$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createHistoryEntry"])('cancelled', (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$activity$2d$history$2d$helper$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getCurrentUserInfo"])(), `${employee?.fullName || 'Hệ thống'} đã hủy đơn hàng. Lý do: ${cancellationReason}${refundAmount > 0 ? `. Hoàn tiền: ${refundAmount.toLocaleString('vi-VN')}đ` : ''}`))
            };
            // ✅ Remove debt transaction from customer
            __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$customers$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCustomerStore"].getState().removeDebtTransaction(orderToCancel.customerSystemId, orderToCancel.id);
            return {
                data: state.data.map((o)=>o.systemId === systemId ? updatedOrder : o)
            };
        });
    },
    addPayment: (orderSystemId, paymentData, employeeId)=>{
        // --- Side effects must happen outside setState ---
        const order = baseStore.getState().findById(orderSystemId);
        const employee = __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$employees$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEmployeeStore"].getState().findById(employeeId);
        if (!order || !employee) {
            console.error("Order or employee not found for payment.");
            return;
        }
        const { document: createdReceipt, error } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$finance$2f$document$2d$helpers$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createReceiptDocument"])({
            amount: paymentData.amount,
            description: `Thanh toán cho đơn hàng ${order.id}`,
            customerName: order.customerName,
            customerSystemId: order.customerSystemId,
            branchSystemId: order.branchSystemId,
            branchName: order.branchName,
            createdBy: employeeId,
            paymentMethodName: paymentData.method,
            receiptTypeName: 'Thanh toán cho đơn hàng',
            originalDocumentId: order.id,
            linkedOrderSystemId: order.systemId,
            affectsDebt: true
        });
        if (!createdReceipt) {
            console.error('Failed to create receipt', error);
            alert('Không thể tạo phiếu thu cho đơn hàng. Vui lòng kiểm tra cấu hình chứng từ.');
            return;
        }
        // 2. Now, update the order state with the created receipt info
        baseStore.setState((state)=>{
            const orderIndex = state.data.findIndex((o)=>o.systemId === orderSystemId);
            if (orderIndex === -1) return state;
            const orderToUpdate = state.data[orderIndex];
            const newPayment = {
                systemId: createdReceipt.systemId,
                id: createdReceipt.id,
                date: createdReceipt.date,
                amount: createdReceipt.amount,
                method: createdReceipt.paymentMethodName,
                createdBy: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])(createdReceipt.createdBy),
                description: createdReceipt.description
            };
            const updatedOrder = applyPaymentToOrder(orderToUpdate, newPayment);
            // ✅ Add activity history entry
            updatedOrder.activityHistory = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$activity$2d$history$2d$helper$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["appendHistoryEntry"])(orderToUpdate.activityHistory, (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$activity$2d$history$2d$helper$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createHistoryEntry"])('payment_made', (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$activity$2d$history$2d$helper$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getCurrentUserInfo"])(), `${employee?.fullName || 'Nhân viên'} đã thanh toán ${paymentData.amount.toLocaleString('vi-VN')}đ bằng ${paymentData.method}`));
            const newData = [
                ...state.data
            ];
            newData[orderIndex] = updatedOrder;
            return {
                data: newData
            };
        });
    },
    requestPackaging: (orderSystemId, employeeId, assignedEmployeeId)=>{
        baseStore.setState((state)=>{
            const order = state.data.find((o)=>o.systemId === orderSystemId);
            if (!order) return state;
            const employee = __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$employees$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEmployeeStore"].getState().findById(employeeId);
            const assignedEmployee = assignedEmployeeId ? __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$employees$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEmployeeStore"].getState().findById(assignedEmployeeId) : null;
            // Count only active packagings for proper numbering
            const activePackagings = order.packagings.filter((p)=>p.status !== 'Hủy đóng gói');
            const activeCountAfterInsert = activePackagings.length + 1;
            const newActiveIndex = activePackagings.length; // This will be the index in active packagings
            const newPackaging = {
                systemId: getNextPackagingSystemId(),
                id: buildPackagingBusinessId(order.id, newActiveIndex, activeCountAfterInsert),
                requestDate: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toISODateTime"])(new Date()),
                requestingEmployeeId: employeeId,
                requestingEmployeeName: employee?.fullName || 'N/A',
                assignedEmployeeId,
                assignedEmployeeName: assignedEmployee?.fullName,
                status: 'Chờ đóng gói',
                printStatus: 'Chưa in'
            };
            const updatedOrder = {
                ...order,
                packagings: [
                    ...order.packagings,
                    newPackaging
                ],
                deliveryStatus: 'Chờ đóng gói'
            };
            return {
                data: state.data.map((o)=>o.systemId === orderSystemId ? updatedOrder : o)
            };
        });
    },
    confirmPackaging: (orderSystemId, packagingSystemId, employeeId)=>{
        // ✅ Check negative packing setting
        const { allowNegativePacking } = __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$sales$2f$sales$2d$management$2d$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useSalesManagementSettingsStore"].getState();
        if (!allowNegativePacking) {
            const order = baseStore.getState().data.find((o)=>o.systemId === orderSystemId);
            if (order) {
                const { findById: findProductById } = __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$products$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useProductStore"].getState();
                for (const item of order.lineItems){
                    const product = findProductById((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])(item.productSystemId));
                    if (product && (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$products$2f$combo$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isComboProduct"])(product) && product.comboItems) {
                        for (const comboItem of product.comboItems){
                            const childProduct = findProductById((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])(comboItem.productSystemId));
                            const requiredQty = item.quantity * comboItem.quantity;
                            const currentStock = childProduct?.inventoryByBranch?.[order.branchSystemId] || 0;
                            if (currentStock < requiredQty) {
                                alert(`Không thể đóng gói: Sản phẩm "${childProduct?.name}" không đủ tồn kho (Có: ${currentStock}, Cần: ${requiredQty})`);
                                return baseStore.getState();
                            }
                        }
                    } else {
                        const currentStock = product?.inventoryByBranch?.[order.branchSystemId] || 0;
                        if (currentStock < item.quantity) {
                            alert(`Không thể đóng gói: Sản phẩm "${item.productName}" không đủ tồn kho (Có: ${currentStock}, Cần: ${item.quantity})`);
                            return baseStore.getState();
                        }
                    }
                }
            }
        }
        baseStore.setState((state)=>{
            const dataCopy = [
                ...state.data
            ];
            const orderIndex = dataCopy.findIndex((o)=>o.systemId === orderSystemId);
            if (orderIndex === -1) return state;
            const orderCopy = {
                ...dataCopy[orderIndex]
            };
            const packagingIndex = orderCopy.packagings.findIndex((p)=>p.systemId === packagingSystemId);
            if (packagingIndex === -1) return state;
            const employee = __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$employees$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEmployeeStore"].getState().findById(employeeId);
            const packagingsCopy = [
                ...orderCopy.packagings
            ];
            packagingsCopy[packagingIndex] = {
                ...packagingsCopy[packagingIndex],
                status: 'Đã đóng gói',
                confirmDate: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toISODateTime"])(new Date()),
                confirmingEmployeeId: employeeId,
                confirmingEmployeeName: employee?.fullName || 'N/A'
            };
            orderCopy.packagings = packagingsCopy;
            orderCopy.deliveryStatus = 'Đã đóng gói';
            dataCopy[orderIndex] = orderCopy;
            return {
                data: dataCopy
            };
        });
    },
    cancelPackagingRequest: (orderSystemId, packagingSystemId, employeeId, reason)=>{
        baseStore.setState((state)=>{
            const order = state.data.find((o)=>o.systemId === orderSystemId);
            if (!order) return state;
            const employee = __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$employees$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEmployeeStore"].getState().findById(employeeId);
            const updatedPackagings = order.packagings.map((p)=>{
                if (p.systemId === packagingSystemId) {
                    return {
                        ...p,
                        status: 'Hủy đóng gói',
                        cancelDate: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toISODateTime"])(new Date()),
                        cancelingEmployeeId: employeeId,
                        cancelingEmployeeName: employee?.fullName || 'N/A',
                        cancelReason: reason
                    };
                }
                return p;
            });
            const isAnyActivePackaging = updatedPackagings.some((p)=>p.status !== 'Hủy đóng gói');
            const updatedOrder = {
                ...order,
                packagings: updatedPackagings,
                deliveryStatus: isAnyActivePackaging ? order.deliveryStatus : 'Chờ đóng gói'
            };
            return {
                data: state.data.map((o)=>o.systemId === orderSystemId ? updatedOrder : o)
            };
        });
    },
    processInStorePickup: (orderSystemId, packagingSystemId)=>{
        baseStore.setState((state)=>{
            const order = state.data.find((o)=>o.systemId === orderSystemId);
            if (!order) return state;
            const totalCount = order.packagings.length;
            const updatedPackagings = order.packagings.map((p, index)=>{
                if (p.systemId === packagingSystemId) {
                    const hasId = typeof p.id === 'string' && p.id.trim().length > 0;
                    const resolvedId = hasId ? p.id : buildPackagingBusinessId(order.id, index, totalCount);
                    return {
                        ...p,
                        id: resolvedId,
                        deliveryMethod: 'Nhận tại cửa hàng',
                        deliveryStatus: 'Đã đóng gói'
                    };
                }
                return p;
            });
            const updatedOrder = {
                ...order,
                packagings: updatedPackagings,
                deliveryStatus: 'Đã đóng gói'
            };
            return {
                data: state.data.map((o)=>o.systemId === orderSystemId ? updatedOrder : o)
            };
        });
    },
    confirmInStorePickup: (orderSystemId, packagingSystemId, employeeId)=>{
        console.log('🟢 [confirmInStorePickup] Called with:', {
            orderSystemId,
            packagingSystemId,
            employeeId
        });
        // ✅ Check negative stock out setting
        const { allowNegativeStockOut } = __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$sales$2f$sales$2d$management$2d$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useSalesManagementSettingsStore"].getState();
        if (!allowNegativeStockOut) {
            const order = baseStore.getState().data.find((o)=>o.systemId === orderSystemId);
            if (order) {
                const { findById: findProductById } = __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$products$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useProductStore"].getState();
                for (const item of order.lineItems){
                    const product = findProductById((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])(item.productSystemId));
                    if (product && (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$products$2f$combo$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isComboProduct"])(product) && product.comboItems) {
                        for (const comboItem of product.comboItems){
                            const childProduct = findProductById((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])(comboItem.productSystemId));
                            const requiredQty = item.quantity * comboItem.quantity;
                            const currentStock = childProduct?.inventoryByBranch?.[order.branchSystemId] || 0;
                            if (currentStock < requiredQty) {
                                alert(`Không thể xuất kho: Sản phẩm "${childProduct?.name}" không đủ tồn kho (Có: ${currentStock}, Cần: ${requiredQty})`);
                                return baseStore.getState();
                            }
                        }
                    } else {
                        const currentStock = product?.inventoryByBranch?.[order.branchSystemId] || 0;
                        if (currentStock < item.quantity) {
                            alert(`Không thể xuất kho: Sản phẩm "${item.productName}" không đủ tồn kho (Có: ${currentStock}, Cần: ${item.quantity})`);
                            return baseStore.getState();
                        }
                    }
                }
            }
        }
        baseStore.setState((state)=>{
            const order = state.data.find((o)=>o.systemId === orderSystemId);
            if (!order) {
                console.error('❌ [confirmInStorePickup] Order not found:', orderSystemId);
                return state;
            }
            console.log('📋 [confirmInStorePickup] Order found:', order.id);
            console.log('📋 [confirmInStorePickup] Line items:', order.lineItems.length);
            // Stock logic
            const { addEntry: addStockHistory } = __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$stock$2d$history$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useStockHistoryStore"].getState();
            const employeeData = __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$employees$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEmployeeStore"].getState().findById(employeeId);
            const now = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toISODateTime"])(new Date());
            order.lineItems.forEach((item, index)=>{
                console.log(`📦 [confirmInStorePickup] Dispatching item ${index + 1}:`, {
                    productSystemId: item.productSystemId,
                    productName: item.productName,
                    quantity: item.quantity,
                    branchSystemId: getBranchId(order)
                });
                // ✅ Dispatch stock (hỗ trợ combo - sẽ dispatch SP con)
                const processedItems = processLineItemStock(item, getBranchId(order), 'dispatch', item.quantity);
                // ✅ Add stock history entry for each processed item (SP con nếu combo)
                processedItems.forEach((processedItem)=>{
                    const product = __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$products$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useProductStore"].getState().findById(processedItem.productSystemId);
                    const currentStock = product?.inventoryByBranch?.[getBranchId(order)] || 0;
                    addStockHistory({
                        date: now,
                        productId: processedItem.productSystemId,
                        action: 'Xuất kho (Đơn hàng)',
                        quantityChange: -processedItem.quantity,
                        newStockLevel: currentStock,
                        documentId: order.id,
                        branchSystemId: getBranchId(order),
                        branch: order.branchName,
                        employeeName: employeeData?.fullName || 'Hệ thống'
                    });
                });
            });
            // Status update logic - will be updated with trackingCode after shipment creation
            let updatedPackagings = order.packagings.map((p)=>{
                if (p.systemId === packagingSystemId) {
                    return {
                        ...p,
                        deliveryStatus: 'Đã giao hàng',
                        deliveredDate: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toISODateTime"])(new Date())
                    };
                }
                return p;
            });
            const isAllDelivered = updatedPackagings.every((p)=>p.status === 'Hủy đóng gói' || p.deliveryStatus === 'Đã giao hàng');
            let newStatus = order.status === 'Đặt hàng' ? 'Đang giao dịch' : order.status;
            let newCompletedDate = order.completedDate;
            if (isAllDelivered && order.paymentStatus === 'Thanh toán toàn bộ') {
                newStatus = 'Hoàn thành';
                newCompletedDate = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toISODateTime"])(new Date());
            }
            const employee = __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$employees$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEmployeeStore"].getState().findById(employeeId);
            // ✅ Create shipment record for INSTORE pickup
            const packaging = order.packagings.find((p)=>p.systemId === packagingSystemId);
            let newShipment = null;
            if (packaging) {
                const { createShipment, updateShipment } = __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$shipments$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useShipmentStore"].getState();
                newShipment = createShipment({
                    packagingSystemId: packagingSystemId,
                    orderSystemId: orderSystemId,
                    orderId: order.id,
                    trackingCode: '',
                    carrier: 'Nhận tại cửa hàng',
                    service: 'Nhận tại cửa hàng',
                    deliveryStatus: 'Đã giao hàng',
                    printStatus: 'Chưa in',
                    reconciliationStatus: 'Chưa đối soát',
                    shippingFeeToPartner: 0,
                    codAmount: 0,
                    payer: 'Người gửi',
                    createdAt: now,
                    dispatchedAt: now,
                    deliveredAt: now
                });
                // Update shipment trackingCode to use its own business ID
                if (newShipment) {
                    updateShipment(newShipment.systemId, {
                        trackingCode: newShipment.id
                    });
                    // Update packaging with shipment trackingCode
                    updatedPackagings = updatedPackagings.map((p)=>{
                        if (p.systemId === packagingSystemId) {
                            return {
                                ...p,
                                trackingCode: newShipment.id
                            };
                        }
                        return p;
                    });
                }
                console.log('✅ [confirmInStorePickup] Shipment created:', newShipment?.id);
            }
            const updatedOrder = {
                ...order,
                packagings: updatedPackagings,
                deliveryStatus: 'Đã giao hàng',
                status: newStatus,
                completedDate: newCompletedDate,
                stockOutStatus: 'Xuất kho toàn bộ',
                dispatchedDate: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toISODateTime"])(new Date()),
                dispatchedByEmployeeId: employeeId,
                dispatchedByEmployeeName: employee?.fullName
            };
            console.log('✅ [confirmInStorePickup] Stock dispatched successfully');
            return {
                data: state.data.map((o)=>o.systemId === orderSystemId ? updatedOrder : o)
            };
        });
    },
    confirmPartnerShipment: async (orderSystemId, packagingSystemId, shipmentData)=>{
        try {
            const order = baseStore.getState().data.find((o)=>o.systemId === orderSystemId);
            if (!order) {
                return {
                    success: false,
                    message: 'Không tìm thấy đơn hàng'
                };
            }
            // ✅ Check negative packing setting (covers creating shipment)
            const { allowNegativePacking } = __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$sales$2f$sales$2d$management$2d$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useSalesManagementSettingsStore"].getState();
            if (!allowNegativePacking) {
                const { findById: findProductById } = __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$products$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useProductStore"].getState();
                for (const item of order.lineItems){
                    const product = findProductById((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])(item.productSystemId));
                    if (product && (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$products$2f$combo$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isComboProduct"])(product) && product.comboItems) {
                        for (const comboItem of product.comboItems){
                            const childProduct = findProductById((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])(comboItem.productSystemId));
                            const requiredQty = item.quantity * comboItem.quantity;
                            const currentStock = childProduct?.inventoryByBranch?.[order.branchSystemId] || 0;
                            if (currentStock < requiredQty) {
                                return {
                                    success: false,
                                    message: `Không thể tạo vận đơn: Sản phẩm "${childProduct?.name}" không đủ tồn kho`
                                };
                            }
                        }
                    } else {
                        const currentStock = product?.inventoryByBranch?.[order.branchSystemId] || 0;
                        if (currentStock < item.quantity) {
                            return {
                                success: false,
                                message: `Không thể tạo vận đơn: Sản phẩm "${item.productName}" không đủ tồn kho`
                            };
                        }
                    }
                }
            }
            // ✅ Get GHTK preview params from window (set by ShippingIntegration)
            const ghtkParams = window.__ghtkPreviewParams;
            if (!ghtkParams) {
                return {
                    success: false,
                    message: 'Thiếu thông tin vận chuyển. Vui lòng chọn dịch vụ vận chuyển.'
                };
            }
            // ✅ Import GHTK service dynamically
            const { GHTKService } = await __turbopack_context__.A("[project]/features/settings/shipping/integrations/ghtk-service.ts [app-ssr] (ecmascript, async loader)");
            const { getGHTKCredentials } = await __turbopack_context__.A("[project]/lib/utils/get-shipping-credentials.ts [app-ssr] (ecmascript, async loader)");
            const { apiToken, partnerCode } = getGHTKCredentials();
            const ghtkService = new GHTKService(apiToken, partnerCode);
            console.log('📤 [confirmPartnerShipment] Calling GHTK API with params:', ghtkParams);
            // ✅ Call real GHTK API
            const result = await ghtkService.createOrder(ghtkParams);
            if (!result.success || !result.order) {
                throw new Error(result.message || 'Không thể tạo đơn vận chuyển');
            }
            // ✅ Update order with real tracking code from GHTK
            const trackingCode = result.order.label;
            const ghtkTrackingId = result.order.tracking_id;
            const estimatedPickTime = result.order.estimated_pick_time;
            const estimatedDeliverTime = result.order.estimated_deliver_time;
            baseStore.setState((state)=>{
                const updatedPackagings = order.packagings.map((p)=>{
                    if (p.systemId === packagingSystemId) {
                        return {
                            ...p,
                            deliveryMethod: 'Dịch vụ giao hàng',
                            deliveryStatus: 'Chờ lấy hàng',
                            carrier: 'GHTK',
                            service: result.order?.fee ? `${result.order.fee}đ` : 'Standard',
                            trackingCode: trackingCode,
                            shippingFeeToPartner: parseInt(result.order?.fee || '0') || 0,
                            codAmount: ghtkParams.pick_money || 0,
                            payer: ghtkParams.is_freeship === 1 ? 'Người gửi' : 'Người nhận',
                            noteToShipper: ghtkParams.note || '',
                            weight: ghtkParams.weight,
                            dimensions: `${ghtkParams.products?.[0]?.length || 10}×${ghtkParams.products?.[0]?.width || 10}×${ghtkParams.products?.[0]?.height || 10}`,
                            // ✅ Store GHTK specific data
                            ghtkTrackingId: String(ghtkTrackingId),
                            estimatedPickTime: estimatedPickTime,
                            estimatedDeliverTime: estimatedDeliverTime
                        };
                    }
                    return p;
                });
                const updatedOrder = {
                    ...order,
                    packagings: updatedPackagings,
                    deliveryStatus: 'Chờ lấy hàng',
                    status: 'Đang giao dịch'
                };
                return {
                    data: state.data.map((o)=>o.systemId === orderSystemId ? updatedOrder : o)
                };
            });
            console.log('✅ [confirmPartnerShipment] GHTK order created successfully:', {
                trackingCode,
                ghtkTrackingId,
                estimatedPickTime,
                estimatedDeliverTime
            });
            return {
                success: true,
                message: `Tạo vận đơn thành công! Mã vận đơn: ${trackingCode}`
            };
        } catch (error) {
            console.error('❌ [confirmPartnerShipment] Error:', error);
            let errorMessage = 'Vui lòng thử lại';
            if (error instanceof Error) {
                errorMessage = error.message;
            }
            return {
                success: false,
                message: `Lỗi tạo đơn vận chuyển: ${errorMessage}`
            };
        }
    },
    dispatchFromWarehouse: (orderSystemId, packagingSystemId, employeeId)=>{
        // ✅ Check negative stock out setting
        const { allowNegativeStockOut } = __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$sales$2f$sales$2d$management$2d$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useSalesManagementSettingsStore"].getState();
        if (!allowNegativeStockOut) {
            const order = baseStore.getState().data.find((o)=>o.systemId === orderSystemId);
            if (order) {
                const { findById: findProductById } = __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$products$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useProductStore"].getState();
                for (const item of order.lineItems){
                    const product = findProductById((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])(item.productSystemId));
                    if (product && (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$products$2f$combo$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isComboProduct"])(product) && product.comboItems) {
                        for (const comboItem of product.comboItems){
                            const childProduct = findProductById((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])(comboItem.productSystemId));
                            const requiredQty = item.quantity * comboItem.quantity;
                            const currentStock = childProduct?.inventoryByBranch?.[order.branchSystemId] || 0;
                            if (currentStock < requiredQty) {
                                alert(`Không thể xuất kho: Sản phẩm "${childProduct?.name}" không đủ tồn kho (Có: ${currentStock}, Cần: ${requiredQty})`);
                                return baseStore.getState();
                            }
                        }
                    } else {
                        const currentStock = product?.inventoryByBranch?.[order.branchSystemId] || 0;
                        if (currentStock < item.quantity) {
                            alert(`Không thể xuất kho: Sản phẩm "${item.productName}" không đủ tồn kho (Có: ${currentStock}, Cần: ${item.quantity})`);
                            return baseStore.getState();
                        }
                    }
                }
            }
        }
        baseStore.setState((state)=>{
            const order = state.data.find((o)=>o.systemId === orderSystemId);
            if (!order) return state;
            const { addEntry: addStockHistory } = __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$stock$2d$history$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useStockHistoryStore"].getState();
            const employeeData = __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$employees$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEmployeeStore"].getState().findById(employeeId);
            const now = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toISODateTime"])(new Date());
            order.lineItems.forEach((item)=>{
                // ✅ Dispatch stock (hỗ trợ combo - sẽ dispatch SP con)
                const processedItems = processLineItemStock(item, getBranchId(order), 'dispatch', item.quantity);
                // ✅ Add stock history entry for each processed item
                processedItems.forEach((processedItem)=>{
                    const product = __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$products$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useProductStore"].getState().findById(processedItem.productSystemId);
                    const currentStock = product?.inventoryByBranch?.[getBranchId(order)] || 0;
                    addStockHistory({
                        date: now,
                        productId: processedItem.productSystemId,
                        action: 'Xuất kho (Đơn hàng)',
                        quantityChange: -processedItem.quantity,
                        newStockLevel: currentStock,
                        documentId: order.id,
                        branchSystemId: getBranchId(order),
                        branch: order.branchName,
                        employeeName: employeeData?.fullName || 'Hệ thống'
                    });
                });
            });
            const now2 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toISODateTime"])(new Date());
            const updatedPackagings = order.packagings.map((p)=>p.systemId === packagingSystemId ? {
                    ...p,
                    deliveryStatus: 'Đang giao hàng'
                } : p);
            const updatedOrder = {
                ...order,
                packagings: updatedPackagings,
                deliveryStatus: 'Đang giao hàng',
                stockOutStatus: 'Xuất kho toàn bộ',
                dispatchedDate: now2,
                dispatchedByEmployeeId: employeeId,
                dispatchedByEmployeeName: employeeData?.fullName,
                status: order.status === 'Đặt hàng' ? 'Đang giao dịch' : order.status
            };
            return {
                data: state.data.map((o)=>o.systemId === orderSystemId ? updatedOrder : o)
            };
        });
    },
    completeDelivery: (orderSystemId, packagingSystemId, employeeId)=>{
        baseStore.setState((state)=>{
            const order = state.data.find((o)=>o.systemId === orderSystemId);
            if (!order) return state;
            // ✅ Complete delivery (hỗ trợ combo - sẽ complete SP con)
            order.lineItems.forEach((item)=>{
                processLineItemStock(item, getBranchId(order), 'complete', item.quantity);
            });
            const updatedPackagings = order.packagings.map((p)=>p.systemId === packagingSystemId ? {
                    ...p,
                    deliveryStatus: 'Đã giao hàng',
                    deliveredDate: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toISODateTime"])(new Date())
                } : p);
            const isAllDelivered = updatedPackagings.every((p)=>p.status === 'Hủy đóng gói' || p.deliveryStatus === 'Đã giao hàng');
            let newStatus = order.status;
            let newCompletedDate = order.completedDate;
            // ✅ Khi tất cả đơn đã giao → tạo công nợ (nếu có) và cập nhật stats
            if (isAllDelivered && order.status !== 'Hoàn thành') {
                // Tính công nợ còn lại
                const totalPaid = (order.payments || []).reduce((sum, p)=>sum + p.amount, 0);
                const debtAmount = Math.max(0, order.grandTotal - totalPaid);
                // ✅ Tạo công nợ CHỈ KHI giao hàng thành công
                if (debtAmount > 0) {
                    const { addDebtTransaction } = __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$customers$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCustomerStore"].getState();
                    const dueDate = new Date();
                    dueDate.setDate(dueDate.getDate() + 30);
                    addDebtTransaction(order.customerSystemId, {
                        systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])(`DEBT_${order.systemId}`),
                        orderId: order.id,
                        orderDate: order.orderDate.split('T')[0],
                        amount: debtAmount,
                        dueDate: dueDate.toISOString().split('T')[0],
                        isPaid: false,
                        remainingAmount: debtAmount,
                        notes: 'Công nợ từ đơn hàng đã giao thành công'
                    });
                }
                // Update customer stats
                const { incrementOrderStats } = __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$customers$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCustomerStore"].getState();
                incrementOrderStats(order.customerSystemId, order.grandTotal);
            }
            // Check if order is fully complete (delivered + fully paid)
            if (isAllDelivered && order.paymentStatus === 'Thanh toán toàn bộ') {
                newStatus = 'Hoàn thành';
                newCompletedDate = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toISODateTime"])(new Date());
            }
            const employee = __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$employees$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEmployeeStore"].getState().findById(employeeId);
            const updatedOrder = {
                ...order,
                packagings: updatedPackagings,
                deliveryStatus: 'Đã giao hàng',
                status: newStatus,
                completedDate: newCompletedDate,
                activityHistory: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$activity$2d$history$2d$helper$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["appendHistoryEntry"])(order.activityHistory, (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$activity$2d$history$2d$helper$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createHistoryEntry"])('status_changed', (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$activity$2d$history$2d$helper$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getCurrentUserInfo"])(), `${employee?.fullName || 'Nhân viên'} đã xác nhận giao hàng thành công${newStatus === 'Hoàn thành' ? '. Đơn hàng hoàn thành' : ''}`))
            };
            return {
                data: state.data.map((o)=>o.systemId === orderSystemId ? updatedOrder : o)
            };
        });
    },
    failDelivery: (orderSystemId, packagingSystemId, employeeId, reason)=>{
        baseStore.setState((state)=>{
            const order = state.data.find((o)=>o.systemId === orderSystemId);
            if (!order) return state;
            const { incrementFailedDeliveryStats } = __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$customers$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCustomerStore"].getState();
            // ✅ Return stock from transit (hỗ trợ combo - sẽ return SP con)
            order.lineItems.forEach((item)=>{
                processLineItemStock(item, getBranchId(order), 'return', item.quantity);
            });
            // ✅ Update customer failed delivery stats
            incrementFailedDeliveryStats(order.customerSystemId);
            const updatedPackagings = order.packagings.map((p)=>p.systemId === packagingSystemId ? {
                    ...p,
                    deliveryStatus: 'Chờ giao lại',
                    notes: `Giao thất bại: ${reason}`
                } : p);
            const updatedOrder = {
                ...order,
                packagings: updatedPackagings,
                deliveryStatus: 'Chờ giao lại'
            };
            return {
                data: state.data.map((o)=>o.systemId === orderSystemId ? updatedOrder : o)
            };
        });
    },
    // ✅ Hủy giao hàng - KHÔNG trả hàng về kho (hàng bị thất tung/shipper giữ)
    cancelDeliveryOnly: (orderSystemId, packagingSystemId, employeeId, reason)=>{
        const currentOrder = baseStore.getState().data.find((o)=>o.systemId === orderSystemId);
        if (!ensureCancellationAllowed(currentOrder, 'hủy giao hàng')) {
            return;
        }
        baseStore.setState((state)=>{
            const order = state.data.find((o)=>o.systemId === orderSystemId);
            if (!order) return state;
            // ✅ Get employee info for canceller
            const employeeData = __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$employees$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEmployeeStore"].getState().findById(employeeId);
            const updatedPackagings = order.packagings.map((p)=>p.systemId === packagingSystemId ? {
                    ...p,
                    status: 'Hủy đóng gói',
                    deliveryStatus: 'Đã hủy',
                    cancelReason: `Hủy giao hàng: ${reason}`,
                    cancelDate: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toISODateTime"])(new Date()),
                    cancelingEmployeeId: employeeId,
                    cancelingEmployeeName: employeeData?.fullName || 'Hệ thống'
                } : p);
            // ✅ Check if all packagings are cancelled, update order status accordingly
            const allCancelled = updatedPackagings.every((p)=>p.deliveryStatus === 'Đã hủy' || p.status === 'Hủy đóng gói');
            const hasAnyActive = updatedPackagings.some((p)=>p.deliveryStatus && p.deliveryStatus !== 'Đã hủy' && p.status !== 'Hủy đóng gói');
            let newOrderStatus = order.status;
            let newDeliveryStatus = order.deliveryStatus;
            if (allCancelled) {
                // All packagings cancelled → order goes back to pending state
                newOrderStatus = 'Đang giao dịch';
                newDeliveryStatus = 'Chưa giao hàng';
            } else if (hasAnyActive) {
                // Some packagings still active → keep current delivery status of remaining active packaging
                const activePackaging = updatedPackagings.find((p)=>p.deliveryStatus && p.deliveryStatus !== 'Đã hủy');
                if (activePackaging?.deliveryStatus) {
                    newDeliveryStatus = activePackaging.deliveryStatus;
                }
            }
            const updatedOrder = {
                ...order,
                packagings: updatedPackagings,
                status: newOrderStatus,
                deliveryStatus: newDeliveryStatus
            };
            return {
                data: state.data.map((o)=>o.systemId === orderSystemId ? updatedOrder : o)
            };
        });
    },
    // ✅ Hủy giao và nhận lại hàng - TRẢ hàng về kho (đã nhận lại từ shipper)
    cancelDelivery: (orderSystemId, packagingSystemId, employeeId, reason)=>{
        const currentOrder = baseStore.getState().data.find((o)=>o.systemId === orderSystemId);
        if (!ensureCancellationAllowed(currentOrder, 'hủy giao hàng')) {
            return;
        }
        baseStore.setState((state)=>{
            const order = state.data.find((o)=>o.systemId === orderSystemId);
            if (!order) return state;
            // ✅ TRẢ hàng từ "đang giao" về "tồn kho" (hỗ trợ combo - sẽ return SP con)
            order.lineItems.forEach((item)=>{
                processLineItemStock(item, getBranchId(order), 'return', item.quantity);
            });
            // ✅ Get employee info for canceller
            const employeeData = __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$employees$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEmployeeStore"].getState().findById(employeeId);
            const updatedPackagings = order.packagings.map((p)=>p.systemId === packagingSystemId ? {
                    ...p,
                    status: 'Hủy đóng gói',
                    deliveryStatus: 'Đã hủy',
                    cancelReason: `Hủy giao hàng: ${reason}`,
                    cancelDate: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toISODateTime"])(new Date()),
                    cancelingEmployeeId: employeeId,
                    cancelingEmployeeName: employeeData?.fullName || 'Hệ thống'
                } : p);
            // ✅ Check if all packagings are cancelled, update order status accordingly
            const allCancelled = updatedPackagings.every((p)=>p.deliveryStatus === 'Đã hủy' || p.status === 'Hủy đóng gói');
            const hasAnyActive = updatedPackagings.some((p)=>p.deliveryStatus && p.deliveryStatus !== 'Đã hủy' && p.status !== 'Hủy đóng gói');
            let newOrderStatus = order.status;
            let newDeliveryStatus = order.deliveryStatus;
            if (allCancelled) {
                // All packagings cancelled → order goes back to pending state
                newOrderStatus = 'Đang giao dịch';
                newDeliveryStatus = 'Chưa giao hàng';
            } else if (hasAnyActive) {
                // Some packagings still active → keep current delivery status of remaining active packaging
                const activePackaging = updatedPackagings.find((p)=>p.deliveryStatus && p.deliveryStatus !== 'Đã hủy');
                if (activePackaging?.deliveryStatus) {
                    newDeliveryStatus = activePackaging.deliveryStatus;
                }
            }
            const updatedOrder = {
                ...order,
                packagings: updatedPackagings,
                status: newOrderStatus,
                deliveryStatus: newDeliveryStatus
            };
            return {
                data: state.data.map((o)=>o.systemId === orderSystemId ? updatedOrder : o)
            };
        });
    },
    confirmCodReconciliation: (shipments, employeeId)=>{
        const { add: addReceipt } = __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$receipts$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useReceiptStore"].getState();
        const { accounts } = __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$cashbook$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCashbookStore"].getState();
        const { data: receiptTypes } = __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$receipt$2d$types$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useReceiptTypeStore"].getState();
        const employee = __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$employees$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEmployeeStore"].getState().findById(employeeId);
        const allOrders = baseStore.getState().data;
        const totalByPartnerAndBranch = {};
        shipments.forEach((shipment)=>{
            const order = allOrders.find((o)=>o.systemId === shipment.orderSystemId);
            if (!order || !shipment.carrier) return;
            const key = `${shipment.carrier}-${getBranchId(order)}`;
            if (!totalByPartnerAndBranch[key]) {
                totalByPartnerAndBranch[key] = {
                    total: 0,
                    ids: [],
                    branchSystemId: getBranchId(order),
                    branchName: order.branchName,
                    partnerName: shipment.carrier,
                    shipmentSystemIds: []
                };
            }
            totalByPartnerAndBranch[key].total += shipment.codAmount || 0;
            totalByPartnerAndBranch[key].ids.push(shipment.trackingCode || shipment.id);
            totalByPartnerAndBranch[key].shipmentSystemIds.push(shipment.systemId);
        });
        const createdReceipts = [];
        Object.values(totalByPartnerAndBranch).forEach((group)=>{
            const account = accounts.find((acc)=>acc.type === 'bank' && acc.branchSystemId === group.branchSystemId) || accounts.find((acc)=>acc.type === 'bank');
            const category = receiptTypes.find((c)=>c.id === 'DOISOATCOD');
            if (account && category) {
                const newReceiptData = {
                    id: '',
                    date: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toISODateTime"])(new Date()),
                    amount: group.total,
                    payerType: 'Đối tác vận chuyển',
                    payerName: group.partnerName,
                    description: `Đối soát COD cho các vận đơn: ${group.ids.join(', ')}`,
                    paymentMethod: 'Chuyển khoản',
                    accountSystemId: account.systemId,
                    originalDocumentId: group.ids.join(', '),
                    createdBy: employee?.fullName || 'N/A',
                    branchSystemId: group.branchSystemId,
                    branchName: group.branchName,
                    paymentReceiptTypeSystemId: category.systemId,
                    paymentReceiptTypeName: category.name,
                    status: 'completed',
                    createdAt: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toISODateTime"])(new Date()),
                    updatedAt: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toISODateTime"])(new Date()),
                    affectsDebt: false
                };
                const newReceipt = addReceipt(newReceiptData);
                if (newReceipt) {
                    createdReceipts.push({
                        ...newReceipt,
                        shipmentSystemIds: group.shipmentSystemIds
                    });
                }
            }
        });
        baseStore.setState((state)=>{
            const updates = new Map();
            shipments.forEach((shipment)=>{
                const receiptForShipment = createdReceipts.find((v)=>v.shipmentSystemIds.includes(shipment.systemId));
                if (!receiptForShipment || !shipment.codAmount || shipment.codAmount <= 0) return;
                const orderSystemId = shipment.orderSystemId;
                const orderUpdates = updates.get(orderSystemId) || {
                    newPayments: [],
                    reconciledShipmentIds: []
                };
                const newPayment = {
                    systemId: receiptForShipment.systemId,
                    id: receiptForShipment.id,
                    date: receiptForShipment.date,
                    method: 'Đối soát COD',
                    amount: shipment.codAmount || 0,
                    createdBy: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('SYSTEM'),
                    description: `Thanh toán COD cho vận đơn ${shipment.trackingCode || shipment.id}`
                };
                orderUpdates.newPayments.push(newPayment);
                orderUpdates.reconciledShipmentIds.push(shipment.systemId);
                updates.set(orderSystemId, orderUpdates);
            });
            if (updates.size === 0) return state;
            const newData = state.data.map((order)=>{
                if (updates.has(order.systemId)) {
                    const orderUpdates = updates.get(order.systemId);
                    let updatedOrder = {
                        ...order
                    };
                    updatedOrder.packagings = updatedOrder.packagings.map((p)=>orderUpdates.reconciledShipmentIds.includes(p.systemId) ? {
                            ...p,
                            reconciliationStatus: 'Đã đối soát'
                        } : p);
                    for (const payment of orderUpdates.newPayments){
                        updatedOrder = applyPaymentToOrder(updatedOrder, payment);
                    }
                    return updatedOrder;
                }
                return order;
            });
            return {
                data: newData
            };
        });
    },
    // ============================================
    // GHTK INTEGRATION METHODS
    // ============================================
    /**
     * Process GHTK webhook update
     * Called when GHTK pushes status update or from tracking API
     */ processGHTKWebhook: (webhookData)=>{
        baseStore.setState((state)=>{
            // Find order by tracking code or partner_id
            const order = state.data.find((o)=>o.packagings.some((p)=>p.trackingCode === webhookData.label_id || p.systemId === webhookData.partner_id || o.systemId === webhookData.partner_id));
            if (!order) {
                console.warn('[GHTK Webhook] Order not found for:', {
                    label_id: webhookData.label_id,
                    partner_id: webhookData.partner_id
                });
                return state;
            }
            // Import status mapping
            const { getGHTKStatusInfo, getGHTKReasonText } = __turbopack_context__.r("[project]/lib/ghtk-constants.ts [app-ssr] (ecmascript)");
            const statusMapping = getGHTKStatusInfo(webhookData.status_id);
            if (!statusMapping) {
                console.warn('[GHTK Webhook] Unknown status:', webhookData.status_id);
                return state;
            }
            console.log('[GHTK Webhook] Processing update:', {
                order: order.id,
                trackingCode: webhookData.label_id,
                statusId: webhookData.status_id,
                statusText: statusMapping.statusText,
                deliveryStatus: statusMapping.deliveryStatus
            });
            // Update packaging with new status
            const updatedPackagings = order.packagings.map((p)=>{
                if (p.trackingCode !== webhookData.label_id && p.systemId !== webhookData.partner_id) {
                    return p;
                }
                return {
                    ...p,
                    deliveryStatus: statusMapping.deliveryStatus,
                    partnerStatus: statusMapping.statusText,
                    ghtkStatusId: webhookData.status_id,
                    ghtkReasonCode: webhookData.reason_code,
                    ghtkReasonText: webhookData.reason ? webhookData.reason : webhookData.reason_code ? getGHTKReasonText(webhookData.reason_code) : undefined,
                    actualWeight: webhookData.weight,
                    actualFee: webhookData.fee,
                    lastSyncedAt: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toISODateTime"])(new Date()),
                    // Update reconciliation status if status = 6 (Đã đối soát)
                    reconciliationStatus: webhookData.status_id === 6 ? 'Đã đối soát' : p.reconciliationStatus,
                    // Update delivered date if status = 5 or 6
                    deliveredDate: [
                        5,
                        6
                    ].includes(webhookData.status_id) && !p.deliveredDate ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toISODateTime"])(new Date()) : p.deliveredDate
                };
            });
            // Handle stock updates based on status
            if (statusMapping.shouldUpdateStock && statusMapping.stockAction) {
                const { dispatchStock, completeDelivery: productCompleteDelivery, returnStockFromTransit } = __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$products$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useProductStore"].getState();
                const { incrementFailedDeliveryStats } = __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$customers$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCustomerStore"].getState();
                // ✅ Expand combo items to child products
                const stockItems = getComboStockItems(order.lineItems);
                stockItems.forEach((item)=>{
                    switch(statusMapping.stockAction){
                        case 'dispatch':
                            // Status 3: Đã lấy hàng -> Move to transit
                            dispatchStock(item.productSystemId, (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])(getBranchId(order)), item.quantity);
                            break;
                        case 'complete':
                            // Status 5: Đã giao hàng -> Complete delivery
                            productCompleteDelivery(item.productSystemId, (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])(getBranchId(order)), item.quantity);
                            break;
                        case 'return':
                            // Status -1, 7, 9, 13, 20: Failed/Returned -> Return stock
                            returnStockFromTransit(item.productSystemId, (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])(getBranchId(order)), item.quantity);
                            break;
                    }
                });
                // ✅ Increment failed delivery stats for customer if return (moved outside loop)
                if (statusMapping.stockAction === 'return') {
                    const failureStatuses = [
                        7,
                        9,
                        13,
                        20,
                        21
                    ];
                    const currentPackaging = order.packagings.find((p)=>p.trackingCode === webhookData.label_id);
                    const previousStatusId = currentPackaging?.ghtkStatusId;
                    if (failureStatuses.includes(webhookData.status_id) && (!previousStatusId || !failureStatuses.includes(previousStatusId))) {
                        incrementFailedDeliveryStats(order.customerSystemId);
                    }
                }
                console.log('[GHTK Webhook] Stock updated:', {
                    action: statusMapping.stockAction,
                    items: stockItems.length
                });
            }
            // Determine order-level delivery status
            const allPackagingsDelivered = updatedPackagings.every((p)=>p.status === 'Hủy đóng gói' || p.deliveryStatus === 'Đã giao hàng');
            let newOrderDeliveryStatus = order.deliveryStatus;
            let newOrderStatus = order.status;
            let newCompletedDate = order.completedDate;
            let newStockOutStatus = order.stockOutStatus;
            // Update order delivery status
            if (allPackagingsDelivered) {
                newOrderDeliveryStatus = 'Đã giao hàng';
                // Auto-complete order if delivered + paid
                if (order.paymentStatus === 'Thanh toán toàn bộ' && order.status !== 'Hoàn thành') {
                    newOrderStatus = 'Hoàn thành';
                    newCompletedDate = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toISODateTime"])(new Date());
                    // Update customer stats
                    const { incrementOrderStats } = __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$customers$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCustomerStore"].getState();
                    incrementOrderStats(order.customerSystemId, order.grandTotal);
                    console.log('[GHTK Webhook] Order completed:', order.id);
                }
            } else if (statusMapping.statusId === 3) {
                // Status 3: Đã lấy hàng
                newOrderDeliveryStatus = 'Đang giao hàng';
                newStockOutStatus = 'Xuất kho toàn bộ';
            } else if ([
                4,
                10
            ].includes(statusMapping.statusId)) {
                // Status 4, 10: Đang giao
                newOrderDeliveryStatus = 'Đang giao hàng';
            }
            const updatedOrder = {
                ...order,
                packagings: updatedPackagings,
                deliveryStatus: newOrderDeliveryStatus,
                status: newOrderStatus,
                completedDate: newCompletedDate,
                stockOutStatus: newStockOutStatus
            };
            return {
                data: state.data.map((o)=>o.systemId === order.systemId ? updatedOrder : o)
            };
        });
    },
    /**
     * Cancel GHTK shipment
     * ⚠️ Chỉ hủy được khi đơn ở trạng thái: 1, 2, 12 (Chưa tiếp nhận, Đã tiếp nhận, Đang lấy hàng)
     */ cancelGHTKShipment: async (orderSystemId, packagingSystemId, trackingCode)=>{
        try {
            console.log('[GHTK] Cancelling shipment:', trackingCode);
            // ✅ Lấy credentials từ shipping_partners_config
            const { getGHTKCredentials } = await __turbopack_context__.A("[project]/lib/utils/get-shipping-credentials.ts [app-ssr] (ecmascript, async loader)");
            let credentials;
            try {
                credentials = getGHTKCredentials();
            } catch (error) {
                return {
                    success: false,
                    message: error.message || 'Chưa cấu hình GHTK. Vui lòng vào Cài đặt → Đối tác vận chuyển.'
                };
            }
            const response = await fetch((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2d$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getApiUrl"])('/shipping/ghtk/cancel-order'), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    trackingCode,
                    apiToken: credentials.apiToken,
                    partnerCode: credentials.partnerCode
                })
            });
            const data = await response.json();
            // ✅ Kiểm tra response từ GHTK
            if (!response.ok) {
                throw new Error(data.message || data.error || 'Failed to cancel GHTK shipment');
            }
            // ✅ GHTK trả success: false khi không thể hủy (đã lấy hàng)
            if (data.success === false) {
                console.log('[GHTK] Cannot cancel:', data.message);
                return {
                    success: false,
                    message: data.message || 'Không thể hủy đơn hàng'
                };
            }
            console.log('[GHTK] Cancellation successful:', data.message);
            // ✅ CHỈ update state khi GHTK xác nhận hủy thành công
            baseStore.setState((state)=>{
                const order = state.data.find((o)=>o.systemId === orderSystemId);
                if (!order) return state;
                const updatedPackagings = order.packagings.map((p)=>{
                    if (p.systemId !== packagingSystemId) return p;
                    return {
                        ...p,
                        status: 'Hủy đóng gói',
                        deliveryStatus: 'Đã hủy',
                        cancelDate: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toISODateTime"])(new Date()),
                        cancelReason: 'Hủy vận đơn GHTK',
                        ghtkStatusId: -1,
                        partnerStatus: 'Hủy đơn hàng'
                    };
                });
                // ✅ KHÔNG rollback stock - để user tự quyết định (nút "Hủy giao và nhận lại hàng")
                const updatedOrder = {
                    ...order,
                    packagings: updatedPackagings
                };
                return {
                    data: state.data.map((o)=>o.systemId === orderSystemId ? updatedOrder : o)
                };
            });
            return {
                success: true,
                message: data.message || 'Đã hủy vận đơn GHTK thành công'
            };
        } catch (error) {
            console.error('[GHTK] Cancel error:', error);
            return {
                success: false,
                message: error.message || 'Lỗi khi hủy vận đơn GHTK'
            };
        }
    }
};
// Auto-allocate historical receipts on startup
__TURBOPACK__imported__module__$5b$project$5d2f$features$2f$receipts$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useReceiptStore"].getState().data.forEach((receipt)=>{
    autoAllocateReceiptToOrders(receipt);
});
// React to newly created receipts
__TURBOPACK__imported__module__$5b$project$5d2f$features$2f$receipts$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useReceiptStore"].subscribe((state)=>state.data, (currentReceipts, previousReceipts)=>{
    const previousIds = new Set((previousReceipts ?? []).map((r)=>r.systemId));
    currentReceipts.forEach((receipt)=>{
        if (!previousIds.has(receipt.systemId)) {
            autoAllocateReceiptToOrders(receipt);
        }
    });
});
const useOrderStore = ()=>{
    const state = baseStore();
    return {
        ...state,
        ...augmentedMethods
    };
};
// Export getState for non-hook usage
useOrderStore.getState = ()=>{
    const state = baseStore.getState();
    return {
        ...state,
        ...augmentedMethods
    };
};
}),
"[project]/features/orders/address-utils.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "cloneOrderAddress",
    ()=>cloneOrderAddress,
    "formatOrderAddress",
    ()=>formatOrderAddress
]);
const formatOrderAddress = (address)=>{
    if (!address) return '';
    if (typeof address === 'string') {
        return address;
    }
    if (address.formattedAddress) {
        return address.formattedAddress;
    }
    return [
        address.street,
        address.ward,
        address.district,
        address.province
    ].filter(Boolean).join(', ');
};
const hasAddressValue = (value)=>typeof value === 'string' && value.trim().length > 0;
const cloneOrderAddress = (address)=>{
    if (!address) return undefined;
    if (typeof address === 'string') {
        const normalized = address.trim();
        return normalized ? {
            street: normalized,
            formattedAddress: normalized
        } : undefined;
    }
    if (typeof address !== 'object') {
        return undefined;
    }
    const snapshot = {
        street: address.street,
        ward: address.ward,
        district: address.district,
        province: address.province,
        contactName: address.contactName,
        company: address.company,
        note: address.note ?? address.notes,
        id: address.id,
        label: address.label,
        provinceId: address.provinceId,
        districtId: address.districtId,
        wardId: address.wardId
    };
    const phoneValue = address.phone ?? address.contactPhone;
    if (hasAddressValue(phoneValue)) {
        snapshot.phone = phoneValue;
        snapshot.contactPhone = phoneValue;
    }
    const formatted = formatOrderAddress(snapshot);
    if (hasAddressValue(formatted)) {
        snapshot.formattedAddress = formatted;
    } else if (hasAddressValue(address.formattedAddress)) {
        snapshot.formattedAddress = address.formattedAddress;
    }
    return snapshot;
};
}),
];

//# sourceMappingURL=features_orders_7d8a2291._.js.map