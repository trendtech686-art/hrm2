module.exports = [
"[project]/features/settings/receipt-types/store.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useReceiptTypeStore",
    ()=>useReceiptTypeStore
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2d$factory$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/store-factory.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/date-utils.ts [app-ssr] (ecmascript)");
;
;
const baseStore = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2d$factory$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createCrudStore"])([], 'receipt-types', {
    businessIdField: 'id',
    apiEndpoint: '/api/settings/data?type=receipt-type'
});
const originalAdd = baseStore.getState().add;
baseStore.setState((state)=>({
        ...state,
        add: (item)=>{
            const newItem = {
                ...item,
                createdAt: item.createdAt ?? (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toISODate"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getCurrentDate"])())
            };
            return originalAdd(newItem);
        }
    }));
const useReceiptTypeStore = baseStore;
}),
"[project]/features/settings/target-groups/store.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useTargetGroupStore",
    ()=>useTargetGroupStore
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2d$factory$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/store-factory.ts [app-ssr] (ecmascript)");
;
const useTargetGroupStore = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2d$factory$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createCrudStore"])([], 'target-groups', {
    apiEndpoint: '/api/settings/data?type=target-group'
});
}),
"[project]/features/settings/payments/methods/store.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "usePaymentMethodStore",
    ()=>usePaymentMethodStore
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/zustand/esm/react.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/id-types.ts [app-ssr] (ecmascript)");
;
;
// API sync helper
async function syncToAPI(action, data) {
    try {
        const endpoint = action === 'create' ? '/api/settings/payment-methods' : `/api/settings/payment-methods/${data.systemId}`;
        const method = action === 'create' ? 'POST' : action === 'update' ? 'PATCH' : 'DELETE';
        const response = await fetch(endpoint, {
            method,
            headers: {
                'Content-Type': 'application/json'
            },
            body: action !== 'delete' ? JSON.stringify(data) : undefined
        });
        return response.ok;
    } catch (error) {
        console.error(`[Payment Methods API] ${action} error:`, error);
        return false;
    }
}
const usePaymentMethodStore = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["create"])()((set, get)=>({
        data: [],
        initialized: false,
        add: (item)=>{
            const newItem = {
                ...item,
                systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])(`PM_${Date.now()}`),
                isDefault: get().data.length === 0
            };
            set((state)=>({
                    data: [
                        ...state.data,
                        newItem
                    ]
                }));
            // Sync to API
            syncToAPI('create', newItem).catch(console.error);
        },
        update: (systemId, updatedFields)=>{
            set((state)=>({
                    data: state.data.map((p)=>p.systemId === systemId ? {
                            ...p,
                            ...updatedFields
                        } : p)
                }));
            // Sync to API
            const updated = get().data.find((p)=>p.systemId === systemId);
            if (updated) {
                syncToAPI('update', updated).catch(console.error);
            }
        },
        remove: (systemId)=>{
            syncToAPI('delete', {
                systemId
            }).catch(console.error);
            set((state)=>({
                    data: state.data.filter((p)=>p.systemId !== systemId)
                }));
        },
        setDefault: (systemId)=>{
            set((state)=>({
                    data: state.data.map((p)=>({
                            ...p,
                            isDefault: p.systemId === systemId
                        }))
                }));
            // Sync all to API (update default status)
            const data = get().data;
            for (const item of data){
                syncToAPI('update', item).catch(console.error);
            }
        },
        loadFromAPI: async ()=>{
            if (get().initialized) return;
            try {
                // NOTE: Settings data is typically small, but using limit for consistency
                const response = await fetch('/api/settings/payment-methods?limit=30');
                if (response.ok) {
                    const json = await response.json();
                    const data = json.data || json.methods || [];
                    if (data.length > 0) {
                        set({
                            data,
                            initialized: true
                        });
                    } else {
                        set({
                            initialized: true
                        });
                    }
                }
            } catch (error) {
                console.error('[Payment Methods Store] loadFromAPI error:', error);
            }
        }
    }));
}),
"[project]/features/settings/payments/types/store.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "usePaymentTypeStore",
    ()=>usePaymentTypeStore
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2d$factory$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/store-factory.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/date-utils.ts [app-ssr] (ecmascript)");
;
;
const baseStore = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2d$factory$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createCrudStore"])([], 'payment-types', {
    businessIdField: 'id',
    apiEndpoint: '/api/settings/data?type=payment-type'
});
const originalAdd = baseStore.getState().add;
baseStore.setState((state)=>({
        ...state,
        add: (item)=>{
            const newItem = {
                ...item,
                createdAt: item.createdAt ?? (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toISODate"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getCurrentDate"])())
            };
            return originalAdd(newItem);
        }
    }));
const usePaymentTypeStore = baseStore;
}),
"[project]/features/settings/payments/api/payment-methods-api.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Payment Methods API functions
 * 
 * ⚠️ Direct import: import { fetchPaymentMethods } from '@/features/settings/payments/api/payment-methods-api'
 */ // PaymentMethod type matching API response (includes isDefault from API transformation)
__turbopack_context__.s([
    "createPaymentMethod",
    ()=>createPaymentMethod,
    "deletePaymentMethod",
    ()=>deletePaymentMethod,
    "fetchPaymentMethod",
    ()=>fetchPaymentMethod,
    "fetchPaymentMethods",
    ()=>fetchPaymentMethods,
    "updatePaymentMethod",
    ()=>updatePaymentMethod
]);
const BASE_URL = '/api/settings/payment-methods';
async function fetchPaymentMethods(params = {}) {
    const searchParams = new URLSearchParams();
    if (params.page) searchParams.set('page', String(params.page));
    if (params.limit) searchParams.set('limit', String(params.limit));
    if (params.search) searchParams.set('search', params.search);
    if (params.isActive !== undefined) searchParams.set('isActive', String(params.isActive));
    if (params.type) searchParams.set('type', params.type);
    if (params.sortBy) searchParams.set('sortBy', params.sortBy);
    if (params.sortOrder) searchParams.set('sortOrder', params.sortOrder);
    const url = searchParams.toString() ? `${BASE_URL}?${searchParams}` : BASE_URL;
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`Failed to fetch payment methods: ${response.statusText}`);
    }
    return response.json();
}
async function fetchPaymentMethod(systemId) {
    const response = await fetch(`${BASE_URL}/${systemId}`);
    if (!response.ok) {
        throw new Error(`Failed to fetch payment method: ${response.statusText}`);
    }
    return response.json();
}
async function createPaymentMethod(data) {
    const response = await fetch(BASE_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });
    if (!response.ok) {
        const error = await response.json().catch(()=>({}));
        throw new Error(error.message || 'Failed to create payment method');
    }
    return response.json();
}
async function updatePaymentMethod(systemId, data) {
    const response = await fetch(`${BASE_URL}/${systemId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });
    if (!response.ok) {
        const error = await response.json().catch(()=>({}));
        throw new Error(error.message || 'Failed to update payment method');
    }
    return response.json();
}
async function deletePaymentMethod(systemId) {
    const response = await fetch(`${BASE_URL}/${systemId}`, {
        method: 'DELETE'
    });
    if (!response.ok) {
        throw new Error(`Failed to delete payment method: ${response.statusText}`);
    }
}
}),
"[project]/features/settings/payments/hooks/use-payment-methods.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "paymentMethodKeys",
    ()=>paymentMethodKeys,
    "useActivePaymentMethods",
    ()=>useActivePaymentMethods,
    "useAllPaymentMethods",
    ()=>useAllPaymentMethods,
    "usePaymentMethod",
    ()=>usePaymentMethod,
    "usePaymentMethodMutations",
    ()=>usePaymentMethodMutations,
    "usePaymentMethods",
    ()=>usePaymentMethods
]);
/**
 * usePaymentMethods - React Query hooks
 * 
 * ⚠️ Direct import: import { usePaymentMethods } from '@/features/settings/payments/hooks/use-payment-methods'
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@tanstack/react-query/build/modern/useQuery.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@tanstack/react-query/build/modern/useMutation.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@tanstack/react-query/build/modern/QueryClientProvider.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$utils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@tanstack/query-core/build/modern/utils.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$payments$2f$api$2f$payment$2d$methods$2d$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/settings/payments/api/payment-methods-api.ts [app-ssr] (ecmascript)");
;
;
const paymentMethodKeys = {
    all: [
        'payment-methods'
    ],
    lists: ()=>[
            ...paymentMethodKeys.all,
            'list'
        ],
    list: (params)=>[
            ...paymentMethodKeys.lists(),
            params
        ],
    details: ()=>[
            ...paymentMethodKeys.all,
            'detail'
        ],
    detail: (id)=>[
            ...paymentMethodKeys.details(),
            id
        ]
};
function usePaymentMethods(params = {}) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useQuery"])({
        queryKey: paymentMethodKeys.list(params),
        queryFn: ()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$payments$2f$api$2f$payment$2d$methods$2d$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["fetchPaymentMethods"])(params),
        staleTime: 10 * 60 * 1000,
        gcTime: 60 * 60 * 1000,
        placeholderData: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$utils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["keepPreviousData"]
    });
}
function usePaymentMethod(id) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useQuery"])({
        queryKey: paymentMethodKeys.detail(id),
        queryFn: ()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$payments$2f$api$2f$payment$2d$methods$2d$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["fetchPaymentMethod"])(id),
        enabled: !!id,
        staleTime: 10 * 60 * 1000
    });
}
function usePaymentMethodMutations(options = {}) {
    const queryClient = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useQueryClient"])();
    const create = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMutation"])({
        mutationFn: __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$payments$2f$api$2f$payment$2d$methods$2d$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createPaymentMethod"],
        onSuccess: (data)=>{
            queryClient.invalidateQueries({
                queryKey: paymentMethodKeys.all
            });
            options.onCreateSuccess?.(data);
        },
        onError: options.onError
    });
    const update = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMutation"])({
        mutationFn: ({ systemId, data })=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$payments$2f$api$2f$payment$2d$methods$2d$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["updatePaymentMethod"])(systemId, data),
        onSuccess: (data, variables)=>{
            queryClient.invalidateQueries({
                queryKey: paymentMethodKeys.detail(variables.systemId)
            });
            queryClient.invalidateQueries({
                queryKey: paymentMethodKeys.lists()
            });
            options.onUpdateSuccess?.(data);
        },
        onError: options.onError
    });
    const remove = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMutation"])({
        mutationFn: __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$payments$2f$api$2f$payment$2d$methods$2d$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["deletePaymentMethod"],
        onSuccess: ()=>{
            queryClient.invalidateQueries({
                queryKey: paymentMethodKeys.all
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
function useActivePaymentMethods() {
    return usePaymentMethods({
        isActive: true,
        limit: 50
    });
}
function useAllPaymentMethods() {
    return usePaymentMethods({
        limit: 50
    });
}
}),
"[project]/features/settings/payments/hooks/use-all-payment-methods.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useAllPaymentMethods",
    ()=>useAllPaymentMethods,
    "useDefaultPaymentMethod",
    ()=>useDefaultPaymentMethod
]);
/**
 * useAllPaymentMethods - Convenience hook for components needing all methods as flat array
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$payments$2f$hooks$2f$use$2d$payment$2d$methods$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/settings/payments/hooks/use-payment-methods.ts [app-ssr] (ecmascript)");
;
function useAllPaymentMethods() {
    const query = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$payments$2f$hooks$2f$use$2d$payment$2d$methods$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["usePaymentMethods"])({});
    return {
        data: query.data?.data || [],
        isLoading: query.isLoading,
        isError: query.isError,
        error: query.error
    };
}
function useDefaultPaymentMethod() {
    const { data, isLoading } = useAllPaymentMethods();
    const defaultMethod = data.find((pm)=>pm.isDefault);
    return {
        defaultMethod,
        isLoading
    };
}
}),
"[project]/features/settings/shipping/store.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useShippingPartnerStore",
    ()=>useShippingPartnerStore
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2d$factory$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/store-factory.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$fuse$2e$js$2f$dist$2f$fuse$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/fuse.js/dist/fuse.mjs [app-ssr] (ecmascript)");
;
;
// FIX: Replaced import from a non-existent module and replaced it with a mock function.
const connectPartner = async (partnerId, credentials)=>{
    console.log(`Connecting to ${partnerId} with`, credentials);
    // Simulate success for known partners if they have credentials.
    if (credentials && Object.values(credentials).every((v)=>v)) {
        return {
            success: true,
            message: 'Kết nối thành công.'
        };
    }
    return {
        success: false,
        message: 'Thông tin kết nối không hợp lệ.'
    };
};
const baseStore = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2d$factory$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createCrudStore"])([], 'shipping-partners', {
    // ⚠️ DEPRECATED: Store này không còn dùng để lưu credentials nữa
    // Credentials giờ được lưu trong database
    apiEndpoint: '/api/settings/data?type=shipping-partner'
});
const fuse = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$fuse$2e$js$2f$dist$2f$fuse$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"](baseStore.getState().data, {
    keys: [
        'name',
        'id',
        'phone'
    ],
    threshold: 0.3
});
const storeExtension = {
    searchShippingPartners: async (query, page, limit = 20)=>{
        return new Promise((resolve)=>{
            setTimeout(()=>{
                const allPartners = baseStore.getState().data;
                const results = query ? fuse.search(query).map((r)=>r.item) : allPartners;
                const start = (page - 1) * limit;
                const end = start + limit;
                const paginatedItems = results.slice(start, end);
                resolve({
                    items: paginatedItems.map((p)=>({
                            value: p.systemId,
                            label: p.name
                        })),
                    hasNextPage: end < results.length
                });
            }, 300);
        });
    },
    connect: async (systemId, credentials)=>{
        // ⚠️ DEPRECATED: Không nên dùng hàm này nữa
        // Vui lòng cấu hình trong Settings → Đối tác vận chuyển
        // Credentials sẽ được lưu vào shipping_partners_config
        console.warn('[ShippingPartnerStore] connect() is deprecated. Use shipping_partners_config instead.');
        const partner = baseStore.getState().findById(systemId);
        if (!partner) return {
            success: false,
            message: 'Không tìm thấy đối tác vận chuyển.'
        };
        console.log('[ShippingPartnerStore] Connecting partner:', {
            systemId,
            credentials
        });
        const result = {
            success: true,
            message: 'Kết nối thành công.'
        };
        if (result.success) {
            baseStore.setState((state)=>{
                const newData = state.data.map((p)=>p.systemId === systemId ? {
                        ...p,
                        isConnected: true,
                        status: 'Đang hợp tác',
                        credentials
                    } : p);
                console.log('[ShippingPartnerStore] Updated partner:', newData.find((p)=>p.systemId === systemId));
                return {
                    data: newData
                };
            });
        }
        return result;
    },
    disconnect: (systemId)=>{
        // ⚠️ DEPRECATED: Không nên dùng hàm này nữa
        console.warn('[ShippingPartnerStore] disconnect() is deprecated. Use shipping_partners_config instead.');
        baseStore.setState((state)=>({
                data: state.data.map((p)=>p.systemId === systemId ? {
                        ...p,
                        isConnected: false,
                        status: 'Ngừng hợp tác',
                        credentials: {},
                        configuration: {}
                    } : p)
            }));
    }
};
baseStore.setState(storeExtension);
const useShippingPartnerStore = baseStore;
}),
"[project]/features/settings/shipping/integrations/ghtk-service.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GHTKService",
    ()=>GHTKService,
    "GHTK_STATUS_MAP",
    ()=>GHTK_STATUS_MAP,
    "GHTK_TAGS",
    ()=>GHTK_TAGS
]);
/**
 * GHTK (Giao Hàng Tiết Kiệm) API Integration Service
 * Documentation: https://api.ghtk.vn/
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2d$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/api-config.ts [app-ssr] (ecmascript)");
;
// ✅ Use local proxy server to avoid CORS
const GHTK_BASE_URL = `${(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2d$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getBaseUrl"])()}/api/shipping/ghtk`;
class GHTKService {
    apiToken;
    partnerCode;
    constructor(apiToken, partnerCode = ''){
        this.apiToken = apiToken;
        this.partnerCode = partnerCode;
    }
    /**
   * Tính phí vận chuyển
   */ async calculateShippingFee(params) {
        // ✅ Call through proxy server
        const payload = {
            apiToken: this.apiToken,
            partnerCode: this.partnerCode,
            pick_province: params.pickProvince,
            pick_district: params.pickDistrict,
            pick_ward: params.pickWard,
            province: params.province,
            district: params.district,
            ward: params.ward,
            address: params.address,
            weight: params.weight * 1000,
            value: params.value,
            transport: params.transport,
            tags: params.tags
        };
        const response = await fetch(`${GHTK_BASE_URL}/calculate-fee`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });
        if (!response.ok) {
            const errorData = await response.json().catch(()=>({}));
            throw new Error(errorData.error || `GHTK API Error: ${response.status} ${response.statusText}`);
        }
        return await response.json();
    }
    /**
   * Tạo đơn hàng mới
   */ async createOrder(params) {
        // ⚠️ GHTK limitation: Cannot create orders >= 20,000 gram (20kg)
        const totalWeightGram = params.totalWeight || params.products.reduce((sum, p)=>sum + p.weight * p.quantity, 0);
        if (totalWeightGram >= 20000) {
            throw new Error(`GHTK không hỗ trợ đơn hàng ≥20kg (${totalWeightGram}g). Vui lòng liên hệ GHTK để được hỗ trợ dịch vụ BBS cho hàng nặng.`);
        }
        // ✅ Call through proxy server
        console.log('[GHTKService.createOrder] pickAddressId:', params.pickAddressId, 'type:', typeof params.pickAddressId);
        const payload = {
            apiToken: this.apiToken,
            partnerCode: this.partnerCode,
            // ⚠️ CRITICAL GHTK API STRUCTURE - UPDATED:
            // According to GHTK API behavior (error 30207 testing):
            // 
            // pick_address_id = ID của KHO GHTK (từ API /services/shipment/list_pick_address_id)
            // 
            // ⚠️ IMPORTANT: Ngay cả khi có pick_address_id, GHTK VẪN YÊU CẦU đầy đủ thông tin địa chỉ!
            //    - Phải gửi: pick_name, pick_address, pick_province, pick_district, pick_tel
            //    - pick_address_id CHỈ dùng để xác định kho ưu tiên, KHÔNG thay thế địa chỉ chi tiết
            //    - Nếu thiếu pick_address → Error 30207 "Vui lòng nhập địa chỉ lấy hàng hóa"
            // ✅ Pickup info - ALWAYS send full address details
            pick_name: params.pickName || 'Người gửi',
            pick_address: params.pickAddress || '',
            pick_province: params.pickProvince || '',
            pick_district: params.pickDistrict || '',
            pick_ward: params.pickWard || '',
            pick_tel: params.pickTel || '',
            // ✅ pick_address_id is OPTIONAL, only add if available
            ...params.pickAddressId ? {
                pick_address_id: params.pickAddressId
            } : {},
            // ✅ Customer/Recipient info (always use generic field names)
            name: params.customerName,
            address: params.customerAddress,
            province: params.customerProvince,
            district: params.customerDistrict,
            ward: params.customerWard,
            street: params.customerStreet,
            hamlet: params.customerHamlet || 'Khác',
            tel: params.customerTel,
            // Order info
            id: params.orderId,
            products: params.products.map((p)=>({
                    name: p.name,
                    weight: p.weight,
                    quantity: p.quantity,
                    product_code: p.productCode || 'DEFAULT',
                    price: p.price || 0
                })),
            total_weight: params.totalWeight,
            weight_option: 'gram',
            total_box: params.totalBox,
            value: params.value,
            transport: params.transport || 'road',
            pick_option: 'cod',
            note: params.note,
            // Payment
            is_freeship: params.isFreeship === 1 || params.isFreeship === true ? 1 : 0,
            pick_money: params.pickMoney || 0,
            // ✅ NEW: not_delivered_fee field for tag 19 (Không giao được thu phí)
            // According to GHTK docs: Must pass not_delivered_fee when using tag 19
            // Range: 0 < not_delivered_fee <= 20,000,000
            ...params.tags?.includes(19) && params.failedDeliveryFee ? {
                not_delivered_fee: params.failedDeliveryFee
            } : {},
            // ✅ Dates & shifts
            pick_date: params.pickDate,
            deliver_date: params.deliverDate,
            pick_work_shift: params.pickWorkShift,
            deliver_work_shift: params.deliverWorkShift,
            // Tags
            tags: params.tags
        };
        console.log('📤 [GHTKService] FINAL payload before sending to GHTK:', JSON.stringify(payload, null, 2));
        const response = await fetch(`${GHTK_BASE_URL}/submit-order`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });
        console.log('📡 [GHTKService] Response status:', response.status);
        console.log('📡 [GHTKService] Response ok:', response.ok);
        if (!response.ok) {
            const errorData = await response.json().catch(()=>({}));
            console.error('📡 [GHTKService] Error data:', errorData);
            throw new Error(errorData.error || errorData.message || `GHTK API Error: ${response.status} ${response.statusText}`);
        }
        const data = await response.json();
        console.log('📡 [GHTKService] Response data:', data);
        // ✅ Handle GHTK error response (success: false)
        if (!data.success) {
            console.error('📡 [GHTKService] API returned error:', data.message);
            throw new Error(data.message || 'GHTK API returned error');
        }
        return data;
    }
    /**
   * Kiểm tra trạng thái đơn hàng
   */ async getOrderStatus(trackingCode) {
        const url = `${GHTK_BASE_URL}/services/shipment/v2/${trackingCode}`;
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Token': this.apiToken,
                'X-Client-Source': this.partnerCode
            }
        });
        if (!response.ok) {
            throw new Error(`GHTK API Error: ${response.status} ${response.statusText}`);
        }
        return await response.json();
    }
    /**
   * In nhãn đơn hàng (shipping label)
   */ async printLabel(trackingCode) {
        const url = `${GHTK_BASE_URL}/services/label/${trackingCode}`;
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Token': this.apiToken,
                'X-Client-Source': this.partnerCode
            }
        });
        if (!response.ok) {
            throw new Error(`GHTK API Error: ${response.status} ${response.statusText}`);
        }
        return await response.json();
    }
    /**
   * Hủy đơn hàng
   */ async cancelOrder(trackingCode) {
        const url = `${GHTK_BASE_URL}/services/shipment/cancel/${trackingCode}`;
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Token': this.apiToken,
                'X-Client-Source': this.partnerCode
            }
        });
        if (!response.ok) {
            throw new Error(`GHTK API Error: ${response.status} ${response.statusText}`);
        }
        return await response.json();
    }
}
const GHTK_STATUS_MAP = {
    '-1': {
        text: 'Hủy đơn hàng',
        color: 'destructive'
    },
    '1': {
        text: 'Chưa tiếp nhận',
        color: 'secondary'
    },
    '2': {
        text: 'Đã tiếp nhận',
        color: 'info'
    },
    '3': {
        text: 'Đã lấy hàng/Đã nhập kho',
        color: 'warning'
    },
    '4': {
        text: 'Đã điều phối giao hàng/Đang giao hàng',
        color: 'warning'
    },
    '5': {
        text: 'Đã giao hàng/Chưa đối soát',
        color: 'success'
    },
    '6': {
        text: 'Đã đối soát',
        color: 'success'
    },
    '7': {
        text: 'Không lấy được hàng',
        color: 'destructive'
    },
    '8': {
        text: 'Hoãn lấy hàng',
        color: 'warning'
    },
    '9': {
        text: 'Không giao được hàng',
        color: 'destructive'
    },
    '10': {
        text: 'Delay giao hàng',
        color: 'warning'
    },
    '11': {
        text: 'Đã đối soát công nợ trả hàng',
        color: 'secondary'
    },
    '12': {
        text: 'Đã điều phối lấy hàng/Đang lấy hàng',
        color: 'warning'
    },
    '13': {
        text: 'Đơn hàng bồi hoàn',
        color: 'destructive'
    },
    '20': {
        text: 'Đang trả hàng (COD cầm hàng đi trả)',
        color: 'warning'
    },
    '21': {
        text: 'Đã trả hàng',
        color: 'secondary'
    },
    '123': {
        text: 'Shipper báo đã lấy hàng',
        color: 'info'
    },
    '127': {
        text: 'Shipper (nhân viên lấy/giao hàng) báo không lấy được hàng',
        color: 'destructive'
    },
    '128': {
        text: 'Shipper báo delay lấy hàng',
        color: 'warning'
    },
    '45': {
        text: 'Shipper báo đã giao hàng',
        color: 'success'
    },
    '49': {
        text: 'Shipper báo không giao được giao hàng',
        color: 'destructive'
    },
    '410': {
        text: 'Shipper báo delay giao hàng',
        color: 'warning'
    }
};
const GHTK_TAGS = {
    FRAGILE: 1,
    HIGH_VALUE: 2,
    BULKY: 3,
    DOCUMENT: 4,
    FOOD: 5,
    TRY_BEFORE_BUY: 10,
    CALL_SHOP: 13,
    PARTIAL_DELIVERY_SELECT: 17,
    PARTIAL_DELIVERY_EXCHANGE: 18,
    NO_DELIVERY_FEE: 19
};
}),
"[project]/features/settings/shipping/api/shipping-api.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Shipping Partners API Layer
 * Handles all shipping partner-related API calls
 */ __turbopack_context__.s([
    "connectShippingPartner",
    ()=>connectShippingPartner,
    "createShippingPartner",
    ()=>createShippingPartner,
    "deleteShippingPartner",
    ()=>deleteShippingPartner,
    "disconnectShippingPartner",
    ()=>disconnectShippingPartner,
    "fetchActiveShippingPartners",
    ()=>fetchActiveShippingPartners,
    "fetchConnectedShippingPartners",
    ()=>fetchConnectedShippingPartners,
    "fetchShippingPartnerById",
    ()=>fetchShippingPartnerById,
    "fetchShippingPartners",
    ()=>fetchShippingPartners,
    "updateShippingPartner",
    ()=>updateShippingPartner
]);
const BASE_URL = '/api/settings/shipping-partners';
async function fetchShippingPartners(filters = {}) {
    const params = new URLSearchParams();
    if (filters.page) params.set('page', String(filters.page));
    if (filters.limit) params.set('limit', String(filters.limit));
    if (filters.status) params.set('status', filters.status);
    if (filters.isConnected !== undefined) params.set('isConnected', String(filters.isConnected));
    const url = params.toString() ? `${BASE_URL}?${params}` : BASE_URL;
    const response = await fetch(url);
    if (!response.ok) throw new Error('Failed to fetch shipping partners');
    return response.json();
}
async function fetchShippingPartnerById(systemId) {
    const response = await fetch(`${BASE_URL}/${systemId}`);
    if (!response.ok) throw new Error('Failed to fetch shipping partner');
    return response.json();
}
async function createShippingPartner(data) {
    const response = await fetch(BASE_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('Failed to create shipping partner');
    return response.json();
}
async function updateShippingPartner(systemId, data) {
    const response = await fetch(`${BASE_URL}/${systemId}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('Failed to update shipping partner');
    return response.json();
}
async function deleteShippingPartner(systemId) {
    const response = await fetch(`${BASE_URL}/${systemId}`, {
        method: 'DELETE'
    });
    if (!response.ok) throw new Error('Failed to delete shipping partner');
}
async function connectShippingPartner(systemId, credentials) {
    const response = await fetch(`${BASE_URL}/${systemId}/connect`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            credentials
        })
    });
    if (!response.ok) throw new Error('Failed to connect shipping partner');
    return response.json();
}
async function disconnectShippingPartner(systemId) {
    const response = await fetch(`${BASE_URL}/${systemId}/disconnect`, {
        method: 'POST'
    });
    if (!response.ok) throw new Error('Failed to disconnect shipping partner');
    return response.json();
}
async function fetchActiveShippingPartners() {
    const response = await fetchShippingPartners({
        status: 'Đang hợp tác',
        limit: 100
    });
    return response.data;
}
async function fetchConnectedShippingPartners() {
    const response = await fetchShippingPartners({
        isConnected: true,
        limit: 100
    });
    return response.data;
}
}),
"[project]/features/settings/shipping/hooks/use-shipping.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "shippingPartnerKeys",
    ()=>shippingPartnerKeys,
    "useActiveShippingPartners",
    ()=>useActiveShippingPartners,
    "useConnectedShippingPartners",
    ()=>useConnectedShippingPartners,
    "useShippingPartnerById",
    ()=>useShippingPartnerById,
    "useShippingPartnerMutations",
    ()=>useShippingPartnerMutations,
    "useShippingPartners",
    ()=>useShippingPartners
]);
/**
 * Shipping Partners React Query Hooks
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@tanstack/react-query/build/modern/useQuery.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@tanstack/react-query/build/modern/useMutation.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@tanstack/react-query/build/modern/QueryClientProvider.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$shipping$2f$api$2f$shipping$2d$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/settings/shipping/api/shipping-api.ts [app-ssr] (ecmascript)");
;
;
const shippingPartnerKeys = {
    all: [
        'shipping-partners'
    ],
    lists: ()=>[
            ...shippingPartnerKeys.all,
            'list'
        ],
    list: (filters)=>[
            ...shippingPartnerKeys.lists(),
            filters
        ],
    details: ()=>[
            ...shippingPartnerKeys.all,
            'detail'
        ],
    detail: (id)=>[
            ...shippingPartnerKeys.details(),
            id
        ],
    active: ()=>[
            ...shippingPartnerKeys.all,
            'active'
        ],
    connected: ()=>[
            ...shippingPartnerKeys.all,
            'connected'
        ]
};
function useShippingPartners(filters = {}) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useQuery"])({
        queryKey: shippingPartnerKeys.list(filters),
        queryFn: ()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$shipping$2f$api$2f$shipping$2d$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["fetchShippingPartners"])(filters),
        staleTime: 1000 * 60 * 5
    });
}
function useShippingPartnerById(systemId) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useQuery"])({
        queryKey: shippingPartnerKeys.detail(systemId),
        queryFn: ()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$shipping$2f$api$2f$shipping$2d$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["fetchShippingPartnerById"])(systemId),
        enabled: !!systemId,
        staleTime: 1000 * 60 * 5
    });
}
function useActiveShippingPartners() {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useQuery"])({
        queryKey: shippingPartnerKeys.active(),
        queryFn: __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$shipping$2f$api$2f$shipping$2d$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["fetchActiveShippingPartners"],
        staleTime: 1000 * 60 * 10
    });
}
function useConnectedShippingPartners() {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useQuery"])({
        queryKey: shippingPartnerKeys.connected(),
        queryFn: __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$shipping$2f$api$2f$shipping$2d$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["fetchConnectedShippingPartners"],
        staleTime: 1000 * 60 * 5
    });
}
function useShippingPartnerMutations(options = {}) {
    const queryClient = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useQueryClient"])();
    const invalidate = ()=>queryClient.invalidateQueries({
            queryKey: shippingPartnerKeys.all
        });
    const create = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMutation"])({
        mutationFn: (data)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$shipping$2f$api$2f$shipping$2d$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createShippingPartner"])(data),
        onSuccess: ()=>{
            invalidate();
            options.onSuccess?.();
        },
        onError: options.onError
    });
    const update = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMutation"])({
        mutationFn: ({ systemId, data })=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$shipping$2f$api$2f$shipping$2d$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["updateShippingPartner"])(systemId, data),
        onSuccess: ()=>{
            invalidate();
            options.onSuccess?.();
        },
        onError: options.onError
    });
    const remove = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMutation"])({
        mutationFn: (systemId)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$shipping$2f$api$2f$shipping$2d$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["deleteShippingPartner"])(systemId),
        onSuccess: ()=>{
            invalidate();
            options.onSuccess?.();
        },
        onError: options.onError
    });
    const connect = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMutation"])({
        mutationFn: ({ systemId, credentials })=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$shipping$2f$api$2f$shipping$2d$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["connectShippingPartner"])(systemId, credentials),
        onSuccess: ()=>{
            invalidate();
            options.onSuccess?.();
        },
        onError: options.onError
    });
    const disconnect = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMutation"])({
        mutationFn: (systemId)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$shipping$2f$api$2f$shipping$2d$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["disconnectShippingPartner"])(systemId),
        onSuccess: ()=>{
            invalidate();
            options.onSuccess?.();
        },
        onError: options.onError
    });
    return {
        create,
        update,
        remove,
        connect,
        disconnect,
        isLoading: create.isPending || update.isPending || remove.isPending || connect.isPending || disconnect.isPending
    };
}
}),
"[project]/features/settings/shipping/hooks/use-all-shipping-partners.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useAllShippingPartners",
    ()=>useAllShippingPartners
]);
/**
 * useAllShippingPartners - Convenience hook for components needing all partners as flat array
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$shipping$2f$hooks$2f$use$2d$shipping$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/settings/shipping/hooks/use-shipping.ts [app-ssr] (ecmascript)");
;
function useAllShippingPartners() {
    const query = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$shipping$2f$hooks$2f$use$2d$shipping$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useShippingPartners"])({});
    return {
        data: query.data?.data || [],
        isLoading: query.isLoading,
        isError: query.isError,
        error: query.error
    };
}
}),
"[project]/features/settings/shipping/shipping-settings-store.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useShippingSettingsStore",
    ()=>useShippingSettingsStore
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/zustand/esm/react.mjs [app-ssr] (ecmascript)");
;
const defaultSettings = {
    weightSource: 'product',
    customWeight: 100,
    weightUnit: 'gram',
    length: 10,
    width: 10,
    height: 10,
    deliveryRequirement: 'CHOXEMHANGKHONGTHU',
    shippingNote: '',
    autoSyncStatus: true,
    autoCancelOrder: false,
    autoSyncCod: true,
    latePickupWarningDays: 1,
    lateDeliveryWarningDays: 1
};
// API sync helper
async function syncToAPI(settings) {
    try {
        const response = await fetch('/api/settings/shipping', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(settings)
        });
        return response.ok;
    } catch (error) {
        console.error('[Shipping Settings API] sync error:', error);
        return false;
    }
}
const useShippingSettingsStore = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["create"])()((set, get)=>({
        settings: defaultSettings,
        initialized: false,
        setSettings: (newSettings)=>{
            const updatedSettings = {
                ...get().settings,
                ...newSettings
            };
            set({
                settings: updatedSettings
            });
            // Sync to API
            syncToAPI(updatedSettings).catch(console.error);
        },
        loadFromAPI: async ()=>{
            if (get().initialized) return;
            try {
                const response = await fetch('/api/settings/shipping');
                if (response.ok) {
                    const json = await response.json();
                    const settings = json.data || json.settings;
                    if (settings) {
                        set({
                            settings: {
                                ...defaultSettings,
                                ...settings
                            },
                            initialized: true
                        });
                    } else {
                        set({
                            initialized: true
                        });
                    }
                }
            } catch (error) {
                console.error('[Shipping Settings Store] loadFromAPI error:', error);
            }
        }
    }));
}),
"[project]/features/settings/sales/sales-management-store.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "salesManagementDefaultSettings",
    ()=>salesManagementDefaultSettings,
    "useSalesManagementSettingsStore",
    ()=>useSalesManagementSettingsStore
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/zustand/esm/react.mjs [app-ssr] (ecmascript)");
;
const defaultSettings = {
    allowCancelAfterExport: true,
    allowNegativeOrder: true,
    allowNegativeApproval: true,
    allowNegativePacking: true,
    allowNegativeStockOut: true,
    printCopies: '1'
};
// API sync helper
async function syncToAPI(settings) {
    try {
        const response = await fetch('/api/settings/sales', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(settings)
        });
        return response.ok;
    } catch (error) {
        console.error('[Sales Management Settings API] sync error:', error);
        return false;
    }
}
const useSalesManagementSettingsStore = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["create"])()((set, get)=>({
        ...defaultSettings,
        initialized: false,
        updateSetting: (key, value)=>{
            set((state)=>({
                    ...state,
                    [key]: value
                }));
            syncToAPI({
                [key]: value
            }).catch(console.error);
        },
        reset: ()=>{
            set(()=>({
                    ...defaultSettings
                }));
            syncToAPI(defaultSettings).catch(console.error);
        },
        loadFromAPI: async ()=>{
            if (get().initialized) return;
            try {
                const response = await fetch('/api/settings/sales');
                if (response.ok) {
                    const json = await response.json();
                    const data = json.data || json;
                    if (data) {
                        set({
                            ...defaultSettings,
                            ...data,
                            initialized: true
                        });
                    } else {
                        set({
                            initialized: true
                        });
                    }
                }
            } catch (error) {
                console.error('[Sales Management Settings Store] loadFromAPI error:', error);
            }
        }
    }));
const salesManagementDefaultSettings = defaultSettings;
}),
"[project]/features/settings/customers/api/customer-settings-api.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Customer Settings API Layer
 * Handles customer types, groups, sources, payment terms, credit ratings, lifecycle stages
 */ __turbopack_context__.s([
    "createCreditRating",
    ()=>createCreditRating,
    "createCustomerGroup",
    ()=>createCustomerGroup,
    "createCustomerSource",
    ()=>createCustomerSource,
    "createCustomerType",
    ()=>createCustomerType,
    "createLifecycleStage",
    ()=>createLifecycleStage,
    "createPaymentTerm",
    ()=>createPaymentTerm,
    "deleteCreditRating",
    ()=>deleteCreditRating,
    "deleteCustomerGroup",
    ()=>deleteCustomerGroup,
    "deleteCustomerSource",
    ()=>deleteCustomerSource,
    "deleteCustomerType",
    ()=>deleteCustomerType,
    "deleteLifecycleStage",
    ()=>deleteLifecycleStage,
    "deletePaymentTerm",
    ()=>deletePaymentTerm,
    "fetchCreditRatings",
    ()=>fetchCreditRatings,
    "fetchCustomerGroups",
    ()=>fetchCustomerGroups,
    "fetchCustomerSlaSettings",
    ()=>fetchCustomerSlaSettings,
    "fetchCustomerSources",
    ()=>fetchCustomerSources,
    "fetchCustomerTypes",
    ()=>fetchCustomerTypes,
    "fetchLifecycleStages",
    ()=>fetchLifecycleStages,
    "fetchPaymentTerms",
    ()=>fetchPaymentTerms,
    "updateCreditRating",
    ()=>updateCreditRating,
    "updateCustomerGroup",
    ()=>updateCustomerGroup,
    "updateCustomerSlaSetting",
    ()=>updateCustomerSlaSetting,
    "updateCustomerSource",
    ()=>updateCustomerSource,
    "updateCustomerType",
    ()=>updateCustomerType,
    "updateLifecycleStage",
    ()=>updateLifecycleStage,
    "updatePaymentTerm",
    ()=>updatePaymentTerm
]);
const BASE_URL = '/api/settings/customers';
async function fetchCustomerTypes() {
    const res = await fetch(`${BASE_URL}/types`);
    if (!res.ok) throw new Error('Failed to fetch customer types');
    return res.json();
}
async function createCustomerType(data) {
    const res = await fetch(`${BASE_URL}/types`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Failed to create');
    return res.json();
}
async function updateCustomerType(systemId, data) {
    const res = await fetch(`${BASE_URL}/types/${systemId}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Failed to update');
    return res.json();
}
async function deleteCustomerType(systemId) {
    const res = await fetch(`${BASE_URL}/types/${systemId}`, {
        method: 'DELETE'
    });
    if (!res.ok) throw new Error('Failed to delete');
}
async function fetchCustomerGroups() {
    const res = await fetch(`${BASE_URL}/groups`);
    if (!res.ok) throw new Error('Failed to fetch');
    return res.json();
}
async function createCustomerGroup(data) {
    const res = await fetch(`${BASE_URL}/groups`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Failed to create');
    return res.json();
}
async function updateCustomerGroup(systemId, data) {
    const res = await fetch(`${BASE_URL}/groups/${systemId}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Failed to update');
    return res.json();
}
async function deleteCustomerGroup(systemId) {
    const res = await fetch(`${BASE_URL}/groups/${systemId}`, {
        method: 'DELETE'
    });
    if (!res.ok) throw new Error('Failed to delete');
}
async function fetchCustomerSources() {
    const res = await fetch(`${BASE_URL}/sources`);
    if (!res.ok) throw new Error('Failed to fetch');
    return res.json();
}
async function createCustomerSource(data) {
    const res = await fetch(`${BASE_URL}/sources`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Failed to create');
    return res.json();
}
async function updateCustomerSource(systemId, data) {
    const res = await fetch(`${BASE_URL}/sources/${systemId}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Failed to update');
    return res.json();
}
async function deleteCustomerSource(systemId) {
    const res = await fetch(`${BASE_URL}/sources/${systemId}`, {
        method: 'DELETE'
    });
    if (!res.ok) throw new Error('Failed to delete');
}
async function fetchPaymentTerms() {
    const res = await fetch(`${BASE_URL}/payment-terms`);
    if (!res.ok) throw new Error('Failed to fetch');
    return res.json();
}
async function createPaymentTerm(data) {
    const res = await fetch(`${BASE_URL}/payment-terms`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Failed to create');
    return res.json();
}
async function updatePaymentTerm(systemId, data) {
    const res = await fetch(`${BASE_URL}/payment-terms/${systemId}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Failed to update');
    return res.json();
}
async function deletePaymentTerm(systemId) {
    const res = await fetch(`${BASE_URL}/payment-terms/${systemId}`, {
        method: 'DELETE'
    });
    if (!res.ok) throw new Error('Failed to delete');
}
async function fetchCreditRatings() {
    const res = await fetch(`${BASE_URL}/credit-ratings`);
    if (!res.ok) throw new Error('Failed to fetch');
    return res.json();
}
async function createCreditRating(data) {
    const res = await fetch(`${BASE_URL}/credit-ratings`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Failed to create');
    return res.json();
}
async function updateCreditRating(systemId, data) {
    const res = await fetch(`${BASE_URL}/credit-ratings/${systemId}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Failed to update');
    return res.json();
}
async function deleteCreditRating(systemId) {
    const res = await fetch(`${BASE_URL}/credit-ratings/${systemId}`, {
        method: 'DELETE'
    });
    if (!res.ok) throw new Error('Failed to delete');
}
async function fetchLifecycleStages() {
    const res = await fetch(`${BASE_URL}/lifecycle-stages`);
    if (!res.ok) throw new Error('Failed to fetch');
    return res.json();
}
async function createLifecycleStage(data) {
    const res = await fetch(`${BASE_URL}/lifecycle-stages`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Failed to create');
    return res.json();
}
async function updateLifecycleStage(systemId, data) {
    const res = await fetch(`${BASE_URL}/lifecycle-stages/${systemId}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Failed to update');
    return res.json();
}
async function deleteLifecycleStage(systemId) {
    const res = await fetch(`${BASE_URL}/lifecycle-stages/${systemId}`, {
        method: 'DELETE'
    });
    if (!res.ok) throw new Error('Failed to delete');
}
async function fetchCustomerSlaSettings() {
    const res = await fetch(`${BASE_URL}/sla-settings`);
    if (!res.ok) throw new Error('Failed to fetch');
    return res.json();
}
async function updateCustomerSlaSetting(systemId, data) {
    const res = await fetch(`${BASE_URL}/sla-settings/${systemId}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Failed to update');
    return res.json();
}
}),
"[project]/features/settings/customers/hooks/use-customer-settings.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "customerSettingsKeys",
    ()=>customerSettingsKeys,
    "useCreditRatingMutations",
    ()=>useCreditRatingMutations,
    "useCreditRatings",
    ()=>useCreditRatings,
    "useCustomerGroupMutations",
    ()=>useCustomerGroupMutations,
    "useCustomerGroups",
    ()=>useCustomerGroups,
    "useCustomerSlaSettingMutations",
    ()=>useCustomerSlaSettingMutations,
    "useCustomerSlaSettings",
    ()=>useCustomerSlaSettings,
    "useCustomerSourceMutations",
    ()=>useCustomerSourceMutations,
    "useCustomerSources",
    ()=>useCustomerSources,
    "useCustomerTypeMutations",
    ()=>useCustomerTypeMutations,
    "useCustomerTypes",
    ()=>useCustomerTypes,
    "useLifecycleStageMutations",
    ()=>useLifecycleStageMutations,
    "useLifecycleStages",
    ()=>useLifecycleStages,
    "usePaymentTermMutations",
    ()=>usePaymentTermMutations,
    "usePaymentTerms",
    ()=>usePaymentTerms
]);
/**
 * Customer Settings React Query Hooks
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@tanstack/react-query/build/modern/useQuery.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@tanstack/react-query/build/modern/useMutation.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@tanstack/react-query/build/modern/QueryClientProvider.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$customers$2f$api$2f$customer$2d$settings$2d$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/settings/customers/api/customer-settings-api.ts [app-ssr] (ecmascript)");
;
;
const customerSettingsKeys = {
    all: [
        'customer-settings'
    ],
    types: ()=>[
            ...customerSettingsKeys.all,
            'types'
        ],
    groups: ()=>[
            ...customerSettingsKeys.all,
            'groups'
        ],
    sources: ()=>[
            ...customerSettingsKeys.all,
            'sources'
        ],
    paymentTerms: ()=>[
            ...customerSettingsKeys.all,
            'payment-terms'
        ],
    creditRatings: ()=>[
            ...customerSettingsKeys.all,
            'credit-ratings'
        ],
    lifecycleStages: ()=>[
            ...customerSettingsKeys.all,
            'lifecycle-stages'
        ],
    slaSettings: ()=>[
            ...customerSettingsKeys.all,
            'sla-settings'
        ]
};
function useCustomerTypes() {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useQuery"])({
        queryKey: customerSettingsKeys.types(),
        queryFn: __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$customers$2f$api$2f$customer$2d$settings$2d$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["fetchCustomerTypes"],
        staleTime: 1000 * 60 * 10
    });
}
function useCustomerTypeMutations(opts) {
    const qc = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useQueryClient"])();
    const invalidate = ()=>qc.invalidateQueries({
            queryKey: customerSettingsKeys.types()
        });
    return {
        create: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMutation"])({
            mutationFn: __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$customers$2f$api$2f$customer$2d$settings$2d$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createCustomerType"],
            onSuccess: ()=>{
                invalidate();
                opts?.onSuccess?.();
            }
        }),
        update: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMutation"])({
            mutationFn: ({ systemId, data })=>__TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$customers$2f$api$2f$customer$2d$settings$2d$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["updateCustomerType"](systemId, data),
            onSuccess: ()=>{
                invalidate();
                opts?.onSuccess?.();
            }
        }),
        remove: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMutation"])({
            mutationFn: __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$customers$2f$api$2f$customer$2d$settings$2d$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["deleteCustomerType"],
            onSuccess: ()=>{
                invalidate();
                opts?.onSuccess?.();
            }
        })
    };
}
function useCustomerGroups() {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useQuery"])({
        queryKey: customerSettingsKeys.groups(),
        queryFn: __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$customers$2f$api$2f$customer$2d$settings$2d$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["fetchCustomerGroups"],
        staleTime: 1000 * 60 * 10
    });
}
function useCustomerGroupMutations(opts) {
    const qc = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useQueryClient"])();
    const invalidate = ()=>qc.invalidateQueries({
            queryKey: customerSettingsKeys.groups()
        });
    return {
        create: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMutation"])({
            mutationFn: __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$customers$2f$api$2f$customer$2d$settings$2d$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createCustomerGroup"],
            onSuccess: ()=>{
                invalidate();
                opts?.onSuccess?.();
            }
        }),
        update: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMutation"])({
            mutationFn: ({ systemId, data })=>__TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$customers$2f$api$2f$customer$2d$settings$2d$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["updateCustomerGroup"](systemId, data),
            onSuccess: ()=>{
                invalidate();
                opts?.onSuccess?.();
            }
        }),
        remove: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMutation"])({
            mutationFn: __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$customers$2f$api$2f$customer$2d$settings$2d$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["deleteCustomerGroup"],
            onSuccess: ()=>{
                invalidate();
                opts?.onSuccess?.();
            }
        })
    };
}
function useCustomerSources() {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useQuery"])({
        queryKey: customerSettingsKeys.sources(),
        queryFn: __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$customers$2f$api$2f$customer$2d$settings$2d$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["fetchCustomerSources"],
        staleTime: 1000 * 60 * 10
    });
}
function useCustomerSourceMutations(opts) {
    const qc = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useQueryClient"])();
    const invalidate = ()=>qc.invalidateQueries({
            queryKey: customerSettingsKeys.sources()
        });
    return {
        create: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMutation"])({
            mutationFn: __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$customers$2f$api$2f$customer$2d$settings$2d$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createCustomerSource"],
            onSuccess: ()=>{
                invalidate();
                opts?.onSuccess?.();
            }
        }),
        update: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMutation"])({
            mutationFn: ({ systemId, data })=>__TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$customers$2f$api$2f$customer$2d$settings$2d$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["updateCustomerSource"](systemId, data),
            onSuccess: ()=>{
                invalidate();
                opts?.onSuccess?.();
            }
        }),
        remove: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMutation"])({
            mutationFn: __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$customers$2f$api$2f$customer$2d$settings$2d$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["deleteCustomerSource"],
            onSuccess: ()=>{
                invalidate();
                opts?.onSuccess?.();
            }
        })
    };
}
function usePaymentTerms() {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useQuery"])({
        queryKey: customerSettingsKeys.paymentTerms(),
        queryFn: __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$customers$2f$api$2f$customer$2d$settings$2d$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["fetchPaymentTerms"],
        staleTime: 1000 * 60 * 10
    });
}
function usePaymentTermMutations(opts) {
    const qc = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useQueryClient"])();
    const invalidate = ()=>qc.invalidateQueries({
            queryKey: customerSettingsKeys.paymentTerms()
        });
    return {
        create: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMutation"])({
            mutationFn: __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$customers$2f$api$2f$customer$2d$settings$2d$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createPaymentTerm"],
            onSuccess: ()=>{
                invalidate();
                opts?.onSuccess?.();
            }
        }),
        update: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMutation"])({
            mutationFn: ({ systemId, data })=>__TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$customers$2f$api$2f$customer$2d$settings$2d$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["updatePaymentTerm"](systemId, data),
            onSuccess: ()=>{
                invalidate();
                opts?.onSuccess?.();
            }
        }),
        remove: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMutation"])({
            mutationFn: __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$customers$2f$api$2f$customer$2d$settings$2d$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["deletePaymentTerm"],
            onSuccess: ()=>{
                invalidate();
                opts?.onSuccess?.();
            }
        })
    };
}
function useCreditRatings() {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useQuery"])({
        queryKey: customerSettingsKeys.creditRatings(),
        queryFn: __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$customers$2f$api$2f$customer$2d$settings$2d$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["fetchCreditRatings"],
        staleTime: 1000 * 60 * 10
    });
}
function useCreditRatingMutations(opts) {
    const qc = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useQueryClient"])();
    const invalidate = ()=>qc.invalidateQueries({
            queryKey: customerSettingsKeys.creditRatings()
        });
    return {
        create: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMutation"])({
            mutationFn: __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$customers$2f$api$2f$customer$2d$settings$2d$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createCreditRating"],
            onSuccess: ()=>{
                invalidate();
                opts?.onSuccess?.();
            }
        }),
        update: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMutation"])({
            mutationFn: ({ systemId, data })=>__TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$customers$2f$api$2f$customer$2d$settings$2d$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["updateCreditRating"](systemId, data),
            onSuccess: ()=>{
                invalidate();
                opts?.onSuccess?.();
            }
        }),
        remove: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMutation"])({
            mutationFn: __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$customers$2f$api$2f$customer$2d$settings$2d$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["deleteCreditRating"],
            onSuccess: ()=>{
                invalidate();
                opts?.onSuccess?.();
            }
        })
    };
}
function useLifecycleStages() {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useQuery"])({
        queryKey: customerSettingsKeys.lifecycleStages(),
        queryFn: __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$customers$2f$api$2f$customer$2d$settings$2d$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["fetchLifecycleStages"],
        staleTime: 1000 * 60 * 10
    });
}
function useLifecycleStageMutations(opts) {
    const qc = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useQueryClient"])();
    const invalidate = ()=>qc.invalidateQueries({
            queryKey: customerSettingsKeys.lifecycleStages()
        });
    return {
        create: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMutation"])({
            mutationFn: __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$customers$2f$api$2f$customer$2d$settings$2d$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createLifecycleStage"],
            onSuccess: ()=>{
                invalidate();
                opts?.onSuccess?.();
            }
        }),
        update: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMutation"])({
            mutationFn: ({ systemId, data })=>__TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$customers$2f$api$2f$customer$2d$settings$2d$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["updateLifecycleStage"](systemId, data),
            onSuccess: ()=>{
                invalidate();
                opts?.onSuccess?.();
            }
        }),
        remove: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMutation"])({
            mutationFn: __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$customers$2f$api$2f$customer$2d$settings$2d$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["deleteLifecycleStage"],
            onSuccess: ()=>{
                invalidate();
                opts?.onSuccess?.();
            }
        })
    };
}
function useCustomerSlaSettings() {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useQuery"])({
        queryKey: customerSettingsKeys.slaSettings(),
        queryFn: __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$customers$2f$api$2f$customer$2d$settings$2d$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["fetchCustomerSlaSettings"],
        staleTime: 1000 * 60 * 10
    });
}
function useCustomerSlaSettingMutations(opts) {
    const qc = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useQueryClient"])();
    const invalidate = ()=>qc.invalidateQueries({
            queryKey: customerSettingsKeys.slaSettings()
        });
    return {
        update: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMutation"])({
            mutationFn: ({ systemId, data })=>__TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$customers$2f$api$2f$customer$2d$settings$2d$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["updateCustomerSlaSetting"](systemId, data),
            onSuccess: ()=>{
                invalidate();
                opts?.onSuccess?.();
            }
        })
    };
}
}),
"[project]/features/settings/customers/hooks/use-all-customer-settings.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useAllCustomerGroups",
    ()=>useAllCustomerGroups,
    "useAllCustomerSources",
    ()=>useAllCustomerSources,
    "useAllCustomerTypes",
    ()=>useAllCustomerTypes,
    "useCustomerGroupFinder",
    ()=>useCustomerGroupFinder,
    "useCustomerGroupOptions",
    ()=>useCustomerGroupOptions,
    "useCustomerSourceFinder",
    ()=>useCustomerSourceFinder,
    "useCustomerSourceOptions",
    ()=>useCustomerSourceOptions,
    "useCustomerTypeFinder",
    ()=>useCustomerTypeFinder,
    "useCustomerTypeOptions",
    ()=>useCustomerTypeOptions
]);
/**
 * Convenience hooks for customer settings - flat array access
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$customers$2f$hooks$2f$use$2d$customer$2d$settings$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/settings/customers/hooks/use-customer-settings.ts [app-ssr] (ecmascript)");
;
;
function useAllCustomerTypes() {
    const query = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$customers$2f$hooks$2f$use$2d$customer$2d$settings$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCustomerTypes"])();
    return {
        data: query.data || [],
        isLoading: query.isLoading,
        isError: query.isError,
        error: query.error
    };
}
function useCustomerTypeOptions() {
    const { data, isLoading } = useAllCustomerTypes();
    const options = data.map((t)=>({
            value: t.systemId,
            label: t.name
        }));
    return {
        options,
        isLoading
    };
}
function useCustomerTypeFinder() {
    const { data } = useAllCustomerTypes();
    const findById = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((systemId)=>{
        return data.find((t)=>t.systemId === systemId);
    }, [
        data
    ]);
    return {
        findById
    };
}
function useAllCustomerGroups() {
    const query = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$customers$2f$hooks$2f$use$2d$customer$2d$settings$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCustomerGroups"])();
    return {
        data: query.data || [],
        isLoading: query.isLoading,
        isError: query.isError,
        error: query.error
    };
}
function useCustomerGroupOptions() {
    const { data, isLoading } = useAllCustomerGroups();
    const options = data.map((g)=>({
            value: g.systemId,
            label: g.name
        }));
    return {
        options,
        isLoading
    };
}
function useAllCustomerSources() {
    const query = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$customers$2f$hooks$2f$use$2d$customer$2d$settings$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCustomerSources"])();
    return {
        data: query.data || [],
        isLoading: query.isLoading,
        isError: query.isError,
        error: query.error
    };
}
function useCustomerSourceOptions() {
    const { data, isLoading } = useAllCustomerSources();
    const options = data.map((s)=>({
            value: s.systemId,
            label: s.name
        }));
    return {
        options,
        isLoading
    };
}
function useCustomerGroupFinder() {
    const { data } = useAllCustomerGroups();
    const findById = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((systemId)=>{
        return data.find((g)=>g.systemId === systemId);
    }, [
        data
    ]);
    return {
        findById
    };
}
function useCustomerSourceFinder() {
    const { data } = useAllCustomerSources();
    const findById = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((systemId)=>{
        return data.find((s)=>s.systemId === systemId);
    }, [
        data
    ]);
    return {
        findById
    };
}
}),
"[project]/features/settings/customers/sla-settings-data.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "SLA_TYPE_DESCRIPTIONS",
    ()=>SLA_TYPE_DESCRIPTIONS,
    "SLA_TYPE_LABELS",
    ()=>SLA_TYPE_LABELS,
    "defaultCustomerSlaSettings",
    ()=>defaultCustomerSlaSettings
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/id-types.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$seed$2d$audit$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/seed-audit.ts [app-ssr] (ecmascript)");
;
;
const defaultCustomerSlaSettings = [
    // Follow-up SLA - Nhắc liên hệ định kỳ
    {
        systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('CUSTSLA0000001'),
        id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])('SLA-FOLLOWUP'),
        name: 'Liên hệ định kỳ',
        description: 'Nhắc nhở liên hệ khách hàng sau một thời gian không tương tác',
        slaType: 'follow-up',
        targetDays: 14,
        warningDays: 3,
        criticalDays: 7,
        color: '#2196F3',
        isActive: true,
        ...(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$seed$2d$audit$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["buildSeedAuditFields"])({
            createdAt: '2024-01-01T08:00:00Z'
        })
    },
    // Re-engagement SLA - Kích hoạt lại khách hàng không hoạt động
    {
        systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('CUSTSLA0000002'),
        id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])('SLA-REENGAGEMENT'),
        name: 'Kích hoạt lại',
        description: 'Khách hàng không mua hàng cần được kích hoạt lại',
        slaType: 're-engagement',
        targetDays: 60,
        warningDays: 10,
        criticalDays: 14,
        color: '#FF9800',
        isActive: true,
        ...(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$seed$2d$audit$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["buildSeedAuditFields"])({
            createdAt: '2024-01-02T08:00:00Z'
        })
    },
    // Debt Payment SLA - Nhắc thanh toán công nợ
    {
        systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])('CUSTSLA0000003'),
        id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])('SLA-DEBT'),
        name: 'Nhắc công nợ',
        description: 'Nhắc thanh toán công nợ quá hạn',
        slaType: 'debt-payment',
        targetDays: 7,
        warningDays: 2,
        criticalDays: 7,
        color: '#E91E63',
        isActive: true,
        ...(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$seed$2d$audit$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["buildSeedAuditFields"])({
            createdAt: '2024-01-03T08:00:00Z'
        })
    }
];
const SLA_TYPE_LABELS = {
    'follow-up': 'Liên hệ định kỳ',
    're-engagement': 'Kích hoạt lại',
    'debt-payment': 'Nhắc công nợ'
};
const SLA_TYPE_DESCRIPTIONS = {
    'follow-up': 'Nhắc nhở liên hệ khách hàng theo chu kỳ định kỳ',
    're-engagement': 'Kích hoạt khách hàng không hoạt động trong thời gian dài',
    'debt-payment': 'Nhắc thanh toán công nợ quá hạn'
};
}),
"[project]/features/settings/customers/sla-settings-store.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getSlaBySlaType",
    ()=>getSlaBySlaType,
    "loadCustomerSlaSettings",
    ()=>loadCustomerSlaSettings,
    "useCustomerSlaStore",
    ()=>useCustomerSlaStore
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2d$factory$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/store-factory.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$customers$2f$sla$2d$settings$2d$data$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/settings/customers/sla-settings-data.ts [app-ssr] (ecmascript)");
;
;
const useCustomerSlaStore = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2d$factory$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createCrudStore"])(__TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$customers$2f$sla$2d$settings$2d$data$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["defaultCustomerSlaSettings"], 'sla-settings', {
    apiEndpoint: '/api/settings/customers?type=sla-setting'
});
function getSlaBySlaType(slaType) {
    return useCustomerSlaStore.getState().data.find((sla)=>sla.slaType === slaType && sla.isActive);
}
function loadCustomerSlaSettings() {
    return useCustomerSlaStore.getState().data.filter((sla)=>sla.isActive);
}
}),
"[project]/features/settings/branches/api/branches-api.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
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
}),
"[project]/features/settings/branches/hooks/use-branches.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "branchKeys",
    ()=>branchKeys,
    "useAllBranches",
    ()=>useAllBranches,
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
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@tanstack/react-query/build/modern/useQuery.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@tanstack/react-query/build/modern/useMutation.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@tanstack/react-query/build/modern/QueryClientProvider.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$utils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@tanstack/query-core/build/modern/utils.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$branches$2f$api$2f$branches$2d$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/settings/branches/api/branches-api.ts [app-ssr] (ecmascript)");
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
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useQuery"])({
        queryKey: branchKeys.list(params),
        queryFn: ()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$branches$2f$api$2f$branches$2d$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["fetchBranches"])(params),
        staleTime: 10 * 60 * 1000,
        gcTime: 60 * 60 * 1000,
        placeholderData: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$utils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["keepPreviousData"]
    });
}
function useBranch(id) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useQuery"])({
        queryKey: branchKeys.detail(id),
        queryFn: ()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$branches$2f$api$2f$branches$2d$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["fetchBranch"])(id),
        enabled: !!id,
        staleTime: 10 * 60 * 1000
    });
}
function useBranchMutations(options = {}) {
    const queryClient = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useQueryClient"])();
    const create = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMutation"])({
        mutationFn: __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$branches$2f$api$2f$branches$2d$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createBranch"],
        onSuccess: (data)=>{
            queryClient.invalidateQueries({
                queryKey: branchKeys.all
            });
            options.onCreateSuccess?.(data);
        },
        onError: options.onError
    });
    const update = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMutation"])({
        mutationFn: ({ systemId, data })=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$branches$2f$api$2f$branches$2d$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["updateBranch"])(systemId, data),
        onSuccess: (data, variables)=>{
            queryClient.invalidateQueries({
                queryKey: branchKeys.detail(variables.systemId)
            });
            queryClient.invalidateQueries({
                queryKey: branchKeys.lists()
            });
            options.onUpdateSuccess?.(data);
        },
        onError: options.onError
    });
    const remove = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMutation"])({
        mutationFn: __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$branches$2f$api$2f$branches$2d$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["deleteBranch"],
        onSuccess: ()=>{
            queryClient.invalidateQueries({
                queryKey: branchKeys.all
            });
            options.onDeleteSuccess?.();
        },
        onError: options.onError
    });
    const makeDefault = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMutation"])({
        mutationFn: __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$branches$2f$api$2f$branches$2d$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["setDefaultBranch"],
        onSuccess: (data)=>{
            queryClient.invalidateQueries({
                queryKey: branchKeys.all
            });
            options.onSetDefaultSuccess?.(data);
        },
        onError: options.onError
    });
    return {
        create,
        update,
        remove,
        makeDefault
    };
}
function useAllBranches() {
    return useBranches({
        limit: 100
    });
}
function useDefaultBranch() {
    const { data, ...rest } = useBranches({
        isDefault: true,
        limit: 1
    });
    return {
        ...rest,
        data: data?.data?.[0] ?? null
    };
}
}),
"[project]/features/settings/branches/hooks/use-all-branches.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
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
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$branches$2f$hooks$2f$use$2d$branches$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/settings/branches/hooks/use-branches.ts [app-ssr] (ecmascript)");
;
;
function useAllBranches() {
    const query = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$branches$2f$hooks$2f$use$2d$branches$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useBranches"])({
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
function useBranchOptions() {
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
function useDefaultBranch() {
    const { data, isLoading } = useAllBranches();
    const defaultBranch = data.find((b)=>b.isDefault) || data[0];
    return {
        defaultBranch,
        isLoading
    };
}
function useBranchFinder() {
    const { data } = useAllBranches();
    const findById = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"]((systemId)=>{
        if (!systemId) return undefined;
        return data.find((b)=>b.systemId === systemId);
    }, [
        data
    ]);
    return {
        findById
    };
}
}),
"[project]/features/settings/store-info/api/store-info-api.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Store Info Settings API Layer
 * Handles all store information settings API calls
 */ __turbopack_context__.s([
    "fetchStoreInfo",
    ()=>fetchStoreInfo,
    "resetStoreInfo",
    ()=>resetStoreInfo,
    "updateStoreInfo",
    ()=>updateStoreInfo,
    "uploadStoreLogo",
    ()=>uploadStoreLogo
]);
const BASE_URL = '/api/settings/store-info';
async function fetchStoreInfo() {
    const response = await fetch(BASE_URL);
    if (!response.ok) {
        throw new Error('Failed to fetch store info');
    }
    return response.json();
}
async function updateStoreInfo(data, metadata) {
    const response = await fetch(BASE_URL, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            ...data,
            ...metadata
        })
    });
    if (!response.ok) {
        const error = await response.json().catch(()=>({}));
        throw new Error(error.error || 'Failed to update store info');
    }
    return response.json();
}
async function resetStoreInfo() {
    const response = await fetch(`${BASE_URL}/reset`, {
        method: 'POST'
    });
    if (!response.ok) {
        throw new Error('Failed to reset store info');
    }
    return response.json();
}
async function uploadStoreLogo(file) {
    const formData = new FormData();
    formData.append('logo', file);
    const response = await fetch(`${BASE_URL}/logo`, {
        method: 'POST',
        body: formData
    });
    if (!response.ok) {
        throw new Error('Failed to upload logo');
    }
    return response.json();
}
}),
"[project]/features/settings/store-info/hooks/use-store-info.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "storeInfoKeys",
    ()=>storeInfoKeys,
    "useStoreInfo",
    ()=>useStoreInfo,
    "useStoreInfoMutations",
    ()=>useStoreInfoMutations
]);
/**
 * Store Info Settings React Query Hooks
 * Provides data fetching and mutations for store information
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@tanstack/react-query/build/modern/useQuery.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@tanstack/react-query/build/modern/useMutation.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@tanstack/react-query/build/modern/QueryClientProvider.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$store$2d$info$2f$api$2f$store$2d$info$2d$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/settings/store-info/api/store-info-api.ts [app-ssr] (ecmascript)");
;
;
const storeInfoKeys = {
    all: [
        'store-info'
    ],
    info: ()=>[
            ...storeInfoKeys.all,
            'current'
        ]
};
function useStoreInfo() {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useQuery"])({
        queryKey: storeInfoKeys.info(),
        queryFn: __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$store$2d$info$2f$api$2f$store$2d$info$2d$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["fetchStoreInfo"],
        staleTime: 1000 * 60 * 30
    });
}
function useStoreInfoMutations(options = {}) {
    const queryClient = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useQueryClient"])();
    const invalidateInfo = ()=>{
        queryClient.invalidateQueries({
            queryKey: storeInfoKeys.all
        });
    };
    const update = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMutation"])({
        mutationFn: ({ data, metadata })=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$store$2d$info$2f$api$2f$store$2d$info$2d$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["updateStoreInfo"])(data, metadata),
        onSuccess: ()=>{
            invalidateInfo();
            options.onSuccess?.();
        },
        onError: options.onError
    });
    const reset = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMutation"])({
        mutationFn: ()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$store$2d$info$2f$api$2f$store$2d$info$2d$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["resetStoreInfo"])(),
        onSuccess: ()=>{
            invalidateInfo();
            options.onSuccess?.();
        },
        onError: options.onError
    });
    const uploadLogo = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMutation"])({
        mutationFn: (file)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$store$2d$info$2f$api$2f$store$2d$info$2d$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["uploadStoreLogo"])(file),
        onSuccess: ()=>{
            invalidateInfo();
            options.onSuccess?.();
        },
        onError: options.onError
    });
    return {
        update,
        reset,
        uploadLogo,
        isLoading: update.isPending || reset.isPending || uploadLogo.isPending
    };
}
}),
"[project]/features/settings/use-settings-page-header.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useSettingsPageHeader",
    ()=>useSettingsPageHeader
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$settings$2d$2$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Settings2$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/settings-2.js [app-ssr] (ecmascript) <export default as Settings2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$contexts$2f$page$2d$header$2d$context$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/contexts/page-header-context.tsx [app-ssr] (ecmascript)");
;
;
;
;
;
const defaultDocLabel = 'Xem hướng dẫn';
const baseBreadcrumb = [
    {
        label: 'Trang chủ',
        href: '/',
        isCurrent: false
    },
    {
        label: 'Cài đặt',
        href: '/settings',
        isCurrent: false
    }
];
const normalizeLabel = (label)=>label?.trim().toLocaleLowerCase('vi');
const isHomeCrumb = (item)=>item.href === '/' || normalizeLabel(item.label) === 'trang chủ';
const isSettingsCrumb = (item)=>item.href === '/settings' || normalizeLabel(item.label) === 'cài đặt';
function useSettingsPageHeader(options) {
    const pathname = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["usePathname"])();
    const { title, icon, docLink, breadcrumb, ...rest } = options;
    const normalizedDocLink = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"](()=>{
        if (!docLink) return undefined;
        if (typeof docLink === 'string') {
            return {
                href: docLink,
                label: defaultDocLabel
            };
        }
        return {
            href: docLink.href,
            label: docLink.label ?? defaultDocLabel
        };
    }, [
        docLink
    ]);
    const decoratedTitle = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"](()=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
            className: "inline-flex items-center gap-2",
            children: [
                icon ?? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$settings$2d$2$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Settings2$3e$__["Settings2"], {
                    className: "h-5 w-5 text-muted-foreground",
                    "aria-hidden": "true"
                }, void 0, false, {
                    fileName: "[project]/features/settings/use-settings-page-header.tsx",
                    lineNumber: 40,
                    columnNumber: 17
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                    children: title
                }, void 0, false, {
                    fileName: "[project]/features/settings/use-settings-page-header.tsx",
                    lineNumber: 41,
                    columnNumber: 7
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/features/settings/use-settings-page-header.tsx",
            lineNumber: 39,
            columnNumber: 5
        }, this), [
        icon,
        title
    ]);
    const normalizedBreadcrumb = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"](()=>{
        const custom = (breadcrumb ?? []).map((item)=>({
                ...item,
                href: item.href || pathname
            }));
        let merged = custom.length ? [
            ...custom
        ] : [
            {
                label: title,
                href: pathname,
                isCurrent: true
            }
        ];
        if (!merged.some(isHomeCrumb)) {
            merged = [
                {
                    ...baseBreadcrumb[0]
                },
                ...merged
            ];
        }
        if (!merged.some(isSettingsCrumb)) {
            const homeIndex = merged.findIndex(isHomeCrumb);
            const insertionIndex = homeIndex >= 0 ? homeIndex + 1 : 0;
            merged = [
                ...merged.slice(0, insertionIndex),
                {
                    ...baseBreadcrumb[1]
                },
                ...merged.slice(insertionIndex)
            ];
        }
        return merged.map((item, index)=>({
                ...item,
                isCurrent: index === merged.length - 1
            }));
    }, [
        breadcrumb,
        pathname,
        title
    ]);
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$contexts$2f$page$2d$header$2d$context$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["usePageHeader"])({
        ...rest,
        breadcrumb: normalizedBreadcrumb,
        title: decoratedTitle,
        docLink: normalizedDocLink
    });
}
}),
"[project]/features/settings/inventory/api/product-types-api.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Product Types API service
 */ __turbopack_context__.s([
    "createProductType",
    ()=>createProductType,
    "deleteProductType",
    ()=>deleteProductType,
    "fetchProductTypeById",
    ()=>fetchProductTypeById,
    "fetchProductTypes",
    ()=>fetchProductTypes,
    "updateProductType",
    ()=>updateProductType
]);
const API_ENDPOINT = '/api/settings/product-types';
async function fetchProductTypes(params) {
    const queryParams = new URLSearchParams();
    if (params?.limit) queryParams.set('limit', String(params.limit));
    if (params?.page) queryParams.set('page', String(params.page));
    const url = queryParams.toString() ? `${API_ENDPOINT}?${queryParams}` : API_ENDPOINT;
    const response = await fetch(url, {
        credentials: 'include'
    });
    if (!response.ok) {
        throw new Error('Failed to fetch product types');
    }
    return response.json();
}
async function fetchProductTypeById(systemId) {
    const response = await fetch(`${API_ENDPOINT}/${systemId}`, {
        credentials: 'include'
    });
    if (!response.ok) {
        throw new Error('Failed to fetch product type');
    }
    const json = await response.json();
    return json.data || json;
}
async function createProductType(data) {
    const response = await fetch(API_ENDPOINT, {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });
    if (!response.ok) {
        throw new Error('Failed to create product type');
    }
    const json = await response.json();
    return json.data || json;
}
async function updateProductType(systemId, data) {
    const response = await fetch(`${API_ENDPOINT}/${systemId}`, {
        method: 'PATCH',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });
    if (!response.ok) {
        throw new Error('Failed to update product type');
    }
    const json = await response.json();
    return json.data || json;
}
async function deleteProductType(systemId) {
    const response = await fetch(`${API_ENDPOINT}/${systemId}`, {
        method: 'DELETE',
        credentials: 'include'
    });
    if (!response.ok) {
        throw new Error('Failed to delete product type');
    }
}
}),
"[project]/features/settings/inventory/hooks/use-product-types.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "productTypeKeys",
    ()=>productTypeKeys,
    "useProductType",
    ()=>useProductType,
    "useProductTypeMutations",
    ()=>useProductTypeMutations,
    "useProductTypes",
    ()=>useProductTypes
]);
/**
 * useProductTypes - React Query hooks for product types
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@tanstack/react-query/build/modern/useQuery.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@tanstack/react-query/build/modern/useMutation.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@tanstack/react-query/build/modern/QueryClientProvider.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$inventory$2f$api$2f$product$2d$types$2d$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/settings/inventory/api/product-types-api.ts [app-ssr] (ecmascript)");
;
;
const productTypeKeys = {
    all: [
        'product-types'
    ],
    lists: ()=>[
            ...productTypeKeys.all,
            'list'
        ],
    list: (params)=>[
            ...productTypeKeys.lists(),
            params
        ],
    details: ()=>[
            ...productTypeKeys.all,
            'detail'
        ],
    detail: (id)=>[
            ...productTypeKeys.details(),
            id
        ]
};
function useProductTypes(params) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useQuery"])({
        queryKey: productTypeKeys.list(params),
        queryFn: ()=>__TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$inventory$2f$api$2f$product$2d$types$2d$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["fetchProductTypes"](params),
        staleTime: 1000 * 60 * 10
    });
}
function useProductType(systemId) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useQuery"])({
        queryKey: productTypeKeys.detail(systemId),
        queryFn: ()=>__TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$inventory$2f$api$2f$product$2d$types$2d$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["fetchProductTypeById"](systemId),
        enabled: !!systemId,
        staleTime: 1000 * 60 * 10
    });
}
function useProductTypeMutations() {
    const queryClient = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useQueryClient"])();
    const invalidateProductTypes = ()=>{
        queryClient.invalidateQueries({
            queryKey: productTypeKeys.all
        });
    };
    const create = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMutation"])({
        mutationFn: __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$inventory$2f$api$2f$product$2d$types$2d$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createProductType"],
        onSuccess: invalidateProductTypes
    });
    const update = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMutation"])({
        mutationFn: ({ systemId, data })=>__TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$inventory$2f$api$2f$product$2d$types$2d$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["updateProductType"](systemId, data),
        onSuccess: invalidateProductTypes
    });
    const remove = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMutation"])({
        mutationFn: __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$inventory$2f$api$2f$product$2d$types$2d$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["deleteProductType"],
        onSuccess: invalidateProductTypes
    });
    return {
        create,
        update,
        remove
    };
}
}),
"[project]/features/settings/inventory/hooks/use-all-product-types.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useActiveProductTypes",
    ()=>useActiveProductTypes,
    "useAllProductTypes",
    ()=>useAllProductTypes,
    "useDefaultProductType",
    ()=>useDefaultProductType,
    "useProductTypeFinder",
    ()=>useProductTypeFinder,
    "useProductTypeOptions",
    ()=>useProductTypeOptions
]);
/**
 * useAllProductTypes - Convenience hook for components needing all product types as flat array
 * 
 * Replaces legacy useProductTypeStore().data pattern
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$inventory$2f$hooks$2f$use$2d$product$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/settings/inventory/hooks/use-product-types.ts [app-ssr] (ecmascript)");
;
;
function useAllProductTypes() {
    const query = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$inventory$2f$hooks$2f$use$2d$product$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useProductTypes"])({
        limit: 50
    });
    return {
        data: query.data?.data || [],
        isLoading: query.isLoading,
        isError: query.isError,
        error: query.error
    };
}
function useActiveProductTypes() {
    const { data, isLoading, isError, error } = useAllProductTypes();
    const activeTypes = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"](()=>data.filter((pt)=>!pt.isDeleted && pt.isActive !== false), [
        data
    ]);
    return {
        data: activeTypes,
        isLoading,
        isError,
        error
    };
}
function useProductTypeOptions() {
    const { data, isLoading } = useActiveProductTypes();
    const options = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"](()=>data.map((pt)=>({
                value: pt.systemId,
                label: pt.name
            })), [
        data
    ]);
    return {
        options,
        isLoading
    };
}
function useDefaultProductType() {
    const { data, isLoading } = useActiveProductTypes();
    const defaultType = data.find((pt)=>pt.isDefault) || data[0];
    return {
        defaultType,
        isLoading
    };
}
function useProductTypeFinder() {
    const { data } = useAllProductTypes();
    const findById = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"]((systemId)=>{
        if (!systemId) return undefined;
        return data.find((pt)=>pt.systemId === systemId && !pt.isDeleted);
    }, [
        data
    ]);
    return {
        findById
    };
}
}),
"[project]/features/settings/pricing/api/pricing-api.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Pricing Settings API Layer
 * Handles all pricing policy-related API calls
 */ __turbopack_context__.s([
    "createPricingPolicy",
    ()=>createPricingPolicy,
    "deletePricingPolicy",
    ()=>deletePricingPolicy,
    "fetchActivePricingPolicies",
    ()=>fetchActivePricingPolicies,
    "fetchPricingPolicies",
    ()=>fetchPricingPolicies,
    "fetchPricingPoliciesByType",
    ()=>fetchPricingPoliciesByType,
    "fetchPricingPolicyById",
    ()=>fetchPricingPolicyById,
    "setDefaultPricingPolicy",
    ()=>setDefaultPricingPolicy,
    "updatePricingPolicy",
    ()=>updatePricingPolicy
]);
const BASE_URL = '/api/settings/pricing-policies';
const LEGACY_URL = '/api/settings/data?type=pricing-policy';
async function fetchPricingPolicies(filters = {}) {
    const params = new URLSearchParams();
    if (filters.page) params.set('page', String(filters.page));
    if (filters.limit) params.set('limit', String(filters.limit));
    if (filters.type) params.set('type', filters.type);
    if (filters.isActive !== undefined) params.set('isActive', String(filters.isActive));
    // Try new endpoint first, fallback to legacy
    let url = params.toString() ? `${BASE_URL}?${params}` : BASE_URL;
    let response = await fetch(url);
    // Fallback to legacy endpoint
    if (!response.ok && response.status === 404) {
        url = `${LEGACY_URL}${params.toString() ? '&' + params : ''}`;
        response = await fetch(url);
    }
    if (!response.ok) {
        throw new Error('Failed to fetch pricing policies');
    }
    return response.json();
}
async function fetchPricingPolicyById(systemId) {
    const response = await fetch(`${BASE_URL}/${systemId}`);
    if (!response.ok) {
        throw new Error('Failed to fetch pricing policy');
    }
    return response.json();
}
async function createPricingPolicy(data) {
    const response = await fetch(BASE_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });
    if (!response.ok) {
        const error = await response.json().catch(()=>({}));
        throw new Error(error.error || 'Failed to create pricing policy');
    }
    return response.json();
}
async function updatePricingPolicy(systemId, data) {
    const response = await fetch(`${BASE_URL}/${systemId}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });
    if (!response.ok) {
        const error = await response.json().catch(()=>({}));
        throw new Error(error.error || 'Failed to update pricing policy');
    }
    return response.json();
}
async function deletePricingPolicy(systemId) {
    const response = await fetch(`${BASE_URL}/${systemId}`, {
        method: 'DELETE'
    });
    if (!response.ok) {
        throw new Error('Failed to delete pricing policy');
    }
}
async function setDefaultPricingPolicy(systemId) {
    const response = await fetch(`${BASE_URL}/${systemId}/set-default`, {
        method: 'POST'
    });
    if (!response.ok) {
        throw new Error('Failed to set default pricing policy');
    }
    return response.json();
}
async function fetchActivePricingPolicies() {
    const response = await fetchPricingPolicies({
        isActive: true,
        limit: 100
    });
    return response.data;
}
async function fetchPricingPoliciesByType(type) {
    const response = await fetchPricingPolicies({
        type,
        isActive: true,
        limit: 100
    });
    return response.data;
}
}),
"[project]/features/settings/pricing/hooks/use-pricing.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "pricingPolicyKeys",
    ()=>pricingPolicyKeys,
    "useActivePricingPolicies",
    ()=>useActivePricingPolicies,
    "usePricingPolicies",
    ()=>usePricingPolicies,
    "usePricingPoliciesByType",
    ()=>usePricingPoliciesByType,
    "usePricingPolicyById",
    ()=>usePricingPolicyById,
    "usePricingPolicyMutations",
    ()=>usePricingPolicyMutations,
    "usePurchasePricingPolicies",
    ()=>usePurchasePricingPolicies,
    "useSalePricingPolicies",
    ()=>useSalePricingPolicies
]);
/**
 * Pricing Settings React Query Hooks
 * Provides data fetching and mutations for pricing policies
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@tanstack/react-query/build/modern/useQuery.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@tanstack/react-query/build/modern/useMutation.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@tanstack/react-query/build/modern/QueryClientProvider.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$pricing$2f$api$2f$pricing$2d$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/settings/pricing/api/pricing-api.ts [app-ssr] (ecmascript)");
;
;
const pricingPolicyKeys = {
    all: [
        'pricing-policies'
    ],
    lists: ()=>[
            ...pricingPolicyKeys.all,
            'list'
        ],
    list: (filters)=>[
            ...pricingPolicyKeys.lists(),
            filters
        ],
    details: ()=>[
            ...pricingPolicyKeys.all,
            'detail'
        ],
    detail: (id)=>[
            ...pricingPolicyKeys.details(),
            id
        ],
    active: ()=>[
            ...pricingPolicyKeys.all,
            'active'
        ],
    byType: (type)=>[
            ...pricingPolicyKeys.all,
            'type',
            type
        ]
};
function usePricingPolicies(filters = {}) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useQuery"])({
        queryKey: pricingPolicyKeys.list(filters),
        queryFn: ()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$pricing$2f$api$2f$pricing$2d$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["fetchPricingPolicies"])(filters),
        staleTime: 1000 * 60 * 10
    });
}
function useActivePricingPolicies() {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useQuery"])({
        queryKey: pricingPolicyKeys.active(),
        queryFn: __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$pricing$2f$api$2f$pricing$2d$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["fetchActivePricingPolicies"],
        staleTime: 1000 * 60 * 10
    });
}
function usePricingPoliciesByType(type) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useQuery"])({
        queryKey: pricingPolicyKeys.byType(type),
        queryFn: ()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$pricing$2f$api$2f$pricing$2d$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["fetchPricingPoliciesByType"])(type),
        staleTime: 1000 * 60 * 10
    });
}
function usePricingPolicyById(systemId) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useQuery"])({
        queryKey: pricingPolicyKeys.detail(systemId),
        queryFn: ()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$pricing$2f$api$2f$pricing$2d$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["fetchPricingPolicyById"])(systemId),
        enabled: !!systemId,
        staleTime: 1000 * 60 * 10
    });
}
function usePricingPolicyMutations(options = {}) {
    const queryClient = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useQueryClient"])();
    const invalidatePolicies = ()=>{
        queryClient.invalidateQueries({
            queryKey: pricingPolicyKeys.all
        });
    };
    const create = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMutation"])({
        mutationFn: (data)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$pricing$2f$api$2f$pricing$2d$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createPricingPolicy"])(data),
        onSuccess: ()=>{
            invalidatePolicies();
            options.onSuccess?.();
        },
        onError: options.onError
    });
    const update = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMutation"])({
        mutationFn: ({ systemId, data })=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$pricing$2f$api$2f$pricing$2d$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["updatePricingPolicy"])(systemId, data),
        onSuccess: ()=>{
            invalidatePolicies();
            options.onSuccess?.();
        },
        onError: options.onError
    });
    const remove = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMutation"])({
        mutationFn: (systemId)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$pricing$2f$api$2f$pricing$2d$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["deletePricingPolicy"])(systemId),
        onSuccess: ()=>{
            invalidatePolicies();
            options.onSuccess?.();
        },
        onError: options.onError
    });
    const setDefault = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMutation"])({
        mutationFn: (systemId)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$pricing$2f$api$2f$pricing$2d$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["setDefaultPricingPolicy"])(systemId),
        onSuccess: ()=>{
            invalidatePolicies();
            options.onSuccess?.();
        },
        onError: options.onError
    });
    return {
        create,
        update,
        remove,
        setDefault,
        isLoading: create.isPending || update.isPending || remove.isPending || setDefault.isPending
    };
}
function useSalePricingPolicies() {
    return usePricingPoliciesByType('Bán hàng');
}
function usePurchasePricingPolicies() {
    return usePricingPoliciesByType('Nhập hàng');
}
}),
"[project]/features/settings/pricing/hooks/use-all-pricing-policies.ts [app-ssr] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useAllPricingPolicies",
    ()=>useAllPricingPolicies,
    "useDefaultSellingPolicy",
    ()=>useDefaultSellingPolicy,
    "useSellingPolicies",
    ()=>useSellingPolicies
]);
/**
 * useAllPricingPolicies - Convenience hook for components needing all policies as flat array
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$pricing$2f$hooks$2f$use$2d$pricing$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/settings/pricing/hooks/use-pricing.ts [app-ssr] (ecmascript)");
;
;
function useAllPricingPolicies() {
    const query = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$pricing$2f$hooks$2f$use$2d$pricing$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["usePricingPolicies"])({});
    return {
        data: query.data?.data || [],
        isLoading: query.isLoading,
        isError: query.isError,
        error: query.error
    };
}
function useDefaultSellingPolicy() {
    const { data, isLoading } = useAllPricingPolicies();
    const defaultPolicy = data.find((p)=>p.type === 'Bán hàng' && p.isDefault);
    return {
        defaultPolicy,
        isLoading
    };
}
function useSellingPolicies() {
    const { data, isLoading } = useAllPricingPolicies();
    const sellingPolicies = data.filter((p)=>p.type === 'Bán hàng');
    return {
        data: sellingPolicies,
        isLoading
    };
}
}),
"[project]/features/settings/taxes/api/taxes-api.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Taxes Settings API Layer
 * Handles all tax-related API calls
 */ __turbopack_context__.s([
    "createTax",
    ()=>createTax,
    "deleteTax",
    ()=>deleteTax,
    "fetchAllTaxes",
    ()=>fetchAllTaxes,
    "fetchTaxById",
    ()=>fetchTaxById,
    "fetchTaxes",
    ()=>fetchTaxes,
    "setDefaultPurchaseTax",
    ()=>setDefaultPurchaseTax,
    "setDefaultSaleTax",
    ()=>setDefaultSaleTax,
    "updateTax",
    ()=>updateTax
]);
const BASE_URL = '/api/settings/taxes';
const LEGACY_URL = '/api/settings/data?type=tax';
async function fetchTaxes(filters = {}) {
    const params = new URLSearchParams();
    if (filters.page) params.set('page', String(filters.page));
    if (filters.limit) params.set('limit', String(filters.limit));
    if (filters.isDefaultSale !== undefined) params.set('isDefaultSale', String(filters.isDefaultSale));
    if (filters.isDefaultPurchase !== undefined) params.set('isDefaultPurchase', String(filters.isDefaultPurchase));
    // Try new endpoint first, fallback to legacy
    let url = params.toString() ? `${BASE_URL}?${params}` : BASE_URL;
    let response = await fetch(url);
    // Fallback to legacy endpoint
    if (!response.ok && response.status === 404) {
        url = `${LEGACY_URL}${params.toString() ? '&' + params : ''}`;
        response = await fetch(url);
    }
    if (!response.ok) {
        throw new Error('Failed to fetch taxes');
    }
    return response.json();
}
async function fetchTaxById(systemId) {
    const response = await fetch(`${BASE_URL}/${systemId}`);
    if (!response.ok) {
        throw new Error('Failed to fetch tax');
    }
    return response.json();
}
async function createTax(data) {
    const response = await fetch(BASE_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });
    if (!response.ok) {
        const error = await response.json().catch(()=>({}));
        throw new Error(error.error || 'Failed to create tax');
    }
    return response.json();
}
async function updateTax(systemId, data) {
    const response = await fetch(`${BASE_URL}/${systemId}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });
    if (!response.ok) {
        const error = await response.json().catch(()=>({}));
        throw new Error(error.error || 'Failed to update tax');
    }
    return response.json();
}
async function deleteTax(systemId) {
    const response = await fetch(`${BASE_URL}/${systemId}`, {
        method: 'DELETE'
    });
    if (!response.ok) {
        throw new Error('Failed to delete tax');
    }
}
async function setDefaultSaleTax(systemId) {
    const response = await fetch(`${BASE_URL}/${systemId}/set-default-sale`, {
        method: 'POST'
    });
    if (!response.ok) {
        throw new Error('Failed to set default sale tax');
    }
    return response.json();
}
async function setDefaultPurchaseTax(systemId) {
    const response = await fetch(`${BASE_URL}/${systemId}/set-default-purchase`, {
        method: 'POST'
    });
    if (!response.ok) {
        throw new Error('Failed to set default purchase tax');
    }
    return response.json();
}
async function fetchAllTaxes() {
    const response = await fetchTaxes({
        limit: 100
    });
    return response.data;
}
}),
"[project]/features/settings/taxes/hooks/use-taxes.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "taxKeys",
    ()=>taxKeys,
    "useAllTaxes",
    ()=>useAllTaxes,
    "useTaxById",
    ()=>useTaxById,
    "useTaxMutations",
    ()=>useTaxMutations,
    "useTaxes",
    ()=>useTaxes
]);
/**
 * Taxes Settings React Query Hooks
 * Provides data fetching and mutations for taxes
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@tanstack/react-query/build/modern/useQuery.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@tanstack/react-query/build/modern/useMutation.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@tanstack/react-query/build/modern/QueryClientProvider.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$taxes$2f$api$2f$taxes$2d$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/settings/taxes/api/taxes-api.ts [app-ssr] (ecmascript)");
;
;
const taxKeys = {
    all: [
        'taxes'
    ],
    lists: ()=>[
            ...taxKeys.all,
            'list'
        ],
    list: (filters)=>[
            ...taxKeys.lists(),
            filters
        ],
    details: ()=>[
            ...taxKeys.all,
            'detail'
        ],
    detail: (id)=>[
            ...taxKeys.details(),
            id
        ]
};
function useTaxes(filters = {}) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useQuery"])({
        queryKey: taxKeys.list(filters),
        queryFn: ()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$taxes$2f$api$2f$taxes$2d$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["fetchTaxes"])(filters),
        staleTime: 1000 * 60 * 10
    });
}
function useAllTaxes() {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useQuery"])({
        queryKey: taxKeys.lists(),
        queryFn: __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$taxes$2f$api$2f$taxes$2d$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["fetchAllTaxes"],
        staleTime: 1000 * 60 * 10
    });
}
function useTaxById(systemId) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useQuery"])({
        queryKey: taxKeys.detail(systemId),
        queryFn: ()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$taxes$2f$api$2f$taxes$2d$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["fetchTaxById"])(systemId),
        enabled: !!systemId,
        staleTime: 1000 * 60 * 10
    });
}
function useTaxMutations(options = {}) {
    const queryClient = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useQueryClient"])();
    const invalidateTaxes = ()=>{
        queryClient.invalidateQueries({
            queryKey: taxKeys.all
        });
    };
    const create = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMutation"])({
        mutationFn: (data)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$taxes$2f$api$2f$taxes$2d$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createTax"])(data),
        onSuccess: ()=>{
            invalidateTaxes();
            options.onSuccess?.();
        },
        onError: options.onError
    });
    const update = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMutation"])({
        mutationFn: ({ systemId, data })=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$taxes$2f$api$2f$taxes$2d$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["updateTax"])(systemId, data),
        onSuccess: ()=>{
            invalidateTaxes();
            options.onSuccess?.();
        },
        onError: options.onError
    });
    const remove = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMutation"])({
        mutationFn: (systemId)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$taxes$2f$api$2f$taxes$2d$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["deleteTax"])(systemId),
        onSuccess: ()=>{
            invalidateTaxes();
            options.onSuccess?.();
        },
        onError: options.onError
    });
    const setDefaultSale = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMutation"])({
        mutationFn: (systemId)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$taxes$2f$api$2f$taxes$2d$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["setDefaultSaleTax"])(systemId),
        onSuccess: ()=>{
            invalidateTaxes();
            options.onSuccess?.();
        },
        onError: options.onError
    });
    const setDefaultPurchase = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useMutation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMutation"])({
        mutationFn: (systemId)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$taxes$2f$api$2f$taxes$2d$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["setDefaultPurchaseTax"])(systemId),
        onSuccess: ()=>{
            invalidateTaxes();
            options.onSuccess?.();
        },
        onError: options.onError
    });
    return {
        create,
        update,
        remove,
        setDefaultSale,
        setDefaultPurchase,
        isLoading: create.isPending || update.isPending || remove.isPending || setDefaultSale.isPending || setDefaultPurchase.isPending
    };
}
}),
"[project]/features/settings/taxes/hooks/use-all-taxes.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useAllTaxesData",
    ()=>useAllTaxesData,
    "useTaxFinder",
    ()=>useTaxFinder,
    "useTaxOptions",
    ()=>useTaxOptions
]);
/**
 * useAllTaxes - Convenience hook for components needing all taxes as flat array
 * 
 * Replaces legacy useTaxStore().data pattern
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$taxes$2f$hooks$2f$use$2d$taxes$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/settings/taxes/hooks/use-taxes.ts [app-ssr] (ecmascript)");
;
;
function useAllTaxesData() {
    const query = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$taxes$2f$hooks$2f$use$2d$taxes$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useAllTaxes"])();
    const data = query.data || [];
    // Helper to get default sale tax
    const getDefaultSale = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"](()=>{
        return data.find((tax)=>tax.isDefaultSale);
    }, [
        data
    ]);
    // Helper to get default purchase tax
    const getDefaultPurchase = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"](()=>{
        return data.find((tax)=>tax.isDefaultPurchase);
    }, [
        data
    ]);
    return {
        data,
        getDefaultSale,
        getDefaultPurchase,
        isLoading: query.isLoading,
        isError: query.isError,
        error: query.error
    };
}
function useTaxOptions() {
    const { data, isLoading } = useAllTaxesData();
    const options = data.map((t)=>({
            value: t.systemId,
            label: `${t.name} (${t.rate}%)`,
            rate: t.rate
        }));
    return {
        options,
        isLoading
    };
}
function useTaxFinder() {
    const { data } = useAllTaxesData();
    const findById = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"]((systemId)=>{
        if (!systemId) return undefined;
        return data.find((t)=>t.systemId === systemId);
    }, [
        data
    ]);
    return {
        findById
    };
}
}),
];

//# sourceMappingURL=features_settings_5f391bbc._.js.map