(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/features/settings/receipt-types/store.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useReceiptTypeStore",
    ()=>useReceiptTypeStore
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2d$factory$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/store-factory.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/date-utils.ts [app-client] (ecmascript)");
;
;
const baseStore = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2d$factory$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createCrudStore"])([], 'receipt-types', {
    businessIdField: 'id',
    apiEndpoint: '/api/settings/data?type=receipt-type'
});
const originalAdd = baseStore.getState().add;
baseStore.setState((state)=>({
        ...state,
        add: (item)=>{
            const newItem = {
                ...item,
                createdAt: item.createdAt ?? (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toISODate"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getCurrentDate"])())
            };
            return originalAdd(newItem);
        }
    }));
const useReceiptTypeStore = baseStore;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/features/settings/target-groups/store.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useTargetGroupStore",
    ()=>useTargetGroupStore
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2d$factory$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/store-factory.ts [app-client] (ecmascript)");
;
const useTargetGroupStore = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2d$factory$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createCrudStore"])([], 'target-groups', {
    apiEndpoint: '/api/settings/data?type=target-group'
});
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/features/settings/payments/methods/store.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "usePaymentMethodStore",
    ()=>usePaymentMethodStore
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/zustand/esm/react.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/id-types.ts [app-client] (ecmascript)");
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
const usePaymentMethodStore = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["create"])()((set, get)=>({
        data: [],
        initialized: false,
        add: (item)=>{
            const newItem = {
                ...item,
                systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])(`PM_${Date.now()}`),
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
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/features/settings/payments/types/store.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "usePaymentTypeStore",
    ()=>usePaymentTypeStore
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2d$factory$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/store-factory.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/date-utils.ts [app-client] (ecmascript)");
;
;
const baseStore = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2d$factory$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createCrudStore"])([], 'payment-types', {
    businessIdField: 'id',
    apiEndpoint: '/api/settings/data?type=payment-type'
});
const originalAdd = baseStore.getState().add;
baseStore.setState((state)=>({
        ...state,
        add: (item)=>{
            const newItem = {
                ...item,
                createdAt: item.createdAt ?? (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toISODate"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$date$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getCurrentDate"])())
            };
            return originalAdd(newItem);
        }
    }));
const usePaymentTypeStore = baseStore;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/features/settings/shipping/store.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useShippingPartnerStore",
    ()=>useShippingPartnerStore
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2d$factory$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/store-factory.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$fuse$2e$js$2f$dist$2f$fuse$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/fuse.js/dist/fuse.mjs [app-client] (ecmascript)");
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
const baseStore = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2d$factory$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createCrudStore"])([], 'shipping-partners', {
    // ⚠️ DEPRECATED: Store này không còn dùng để lưu credentials nữa
    // Credentials giờ được lưu trong database
    apiEndpoint: '/api/settings/data?type=shipping-partner'
});
const fuse = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$fuse$2e$js$2f$dist$2f$fuse$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"](baseStore.getState().data, {
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
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/features/settings/sales/sales-management-store.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "salesManagementDefaultSettings",
    ()=>salesManagementDefaultSettings,
    "useSalesManagementSettingsStore",
    ()=>useSalesManagementSettingsStore
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/zustand/esm/react.mjs [app-client] (ecmascript)");
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
const useSalesManagementSettingsStore = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["create"])()((set, get)=>({
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
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/features/settings/pricing/store.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "usePricingPolicyStore",
    ()=>usePricingPolicyStore
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2d$factory$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/store-factory.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$contexts$2f$auth$2d$context$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/contexts/auth-context.tsx [app-client] (ecmascript)");
;
;
const baseStore = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2d$factory$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createCrudStore"])([], 'pricing-settings', {
    businessIdField: 'id',
    getCurrentUser: __TURBOPACK__imported__module__$5b$project$5d2f$contexts$2f$auth$2d$context$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getCurrentUserSystemId"],
    apiEndpoint: '/api/settings/data?type=pricing-policy'
});
const originalAdd = baseStore.getState().add;
const setDefaultAction = (systemId)=>{
    baseStore.setState((current)=>{
        const target = current.data.find((policy)=>policy.systemId === systemId);
        if (!target) return current;
        const updatedData = current.data.map((policy)=>policy.type === target.type ? {
                ...policy,
                isDefault: policy.systemId === systemId
            } : policy);
        return {
            ...current,
            data: updatedData
        };
    });
};
const enhancedAdd = (item)=>{
    const newItem = originalAdd(item);
    const storeData = baseStore.getState().data;
    const hasDefaultForType = storeData.filter((policy)=>policy.type === newItem.type).some((policy)=>policy.isDefault);
    if (item.isDefault) {
        setDefaultAction(newItem.systemId);
    } else if (!hasDefaultForType) {
        setDefaultAction(newItem.systemId);
    }
    return newItem;
};
baseStore.setState((state)=>({
        ...state,
        add: enhancedAdd,
        setDefault: setDefaultAction,
        getActive: ()=>baseStore.getState().data.filter((policy)=>policy.isActive),
        getInactive: ()=>baseStore.getState().data.filter((policy)=>!policy.isActive)
    }));
const usePricingPolicyStore = baseStore;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/features/settings/inventory/product-type-store.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useProductTypeStore",
    ()=>useProductTypeStore
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/zustand/esm/react.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/id-types.ts [app-client] (ecmascript)");
;
;
const generateId = ()=>crypto.randomUUID();
// API sync helper
async function syncToAPI(action, data) {
    try {
        const endpoint = action === 'create' ? '/api/settings/product-types' : `/api/settings/product-types/${data.systemId}`;
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
        console.error(`[Product Type API] ${action} error:`, error);
        return false;
    }
}
const rawData = [
    {
        systemId: generateId(),
        id: 'PT001',
        name: 'Hàng hóa',
        description: 'Sản phẩm vật lý có tồn kho',
        isDefault: true,
        isActive: true,
        createdAt: new Date().toISOString()
    },
    {
        systemId: generateId(),
        id: 'PT002',
        name: 'Dịch vụ',
        description: 'Dịch vụ không có tồn kho',
        isActive: true,
        createdAt: new Date().toISOString()
    },
    {
        systemId: generateId(),
        id: 'PT003',
        name: 'Digital',
        description: 'Sản phẩm số (ebook, khóa học online...)',
        isActive: true,
        createdAt: new Date().toISOString()
    }
];
const initialData = rawData.map((item)=>({
        ...item,
        systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])(item.systemId),
        id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asBusinessId"])(item.id)
    }));
const useProductTypeStore = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["create"])()((set, get)=>({
        data: initialData,
        initialized: false,
        add: (productType)=>{
            const newProductType = {
                ...productType,
                systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])(generateId()),
                createdAt: new Date().toISOString(),
                isDeleted: false
            };
            set((state)=>({
                    data: [
                        ...state.data,
                        newProductType
                    ]
                }));
            syncToAPI('create', newProductType).catch(console.error);
            return newProductType;
        },
        update: (systemId, updates)=>{
            set((state)=>({
                    data: state.data.map((item)=>item.systemId === systemId ? {
                            ...item,
                            ...updates,
                            updatedAt: new Date().toISOString()
                        } : item)
                }));
            const updated = get().data.find((i)=>i.systemId === systemId);
            if (updated) syncToAPI('update', updated).catch(console.error);
        },
        remove: (systemId)=>{
            set((state)=>({
                    data: state.data.map((item)=>item.systemId === systemId ? {
                            ...item,
                            isDeleted: true,
                            updatedAt: new Date().toISOString()
                        } : item)
                }));
            syncToAPI('delete', {
                systemId
            }).catch(console.error);
        },
        findById: (systemId)=>{
            return get().data.find((item)=>item.systemId === systemId && !item.isDeleted);
        },
        getActive: ()=>{
            return get().data.filter((item)=>!item.isDeleted && item.isActive !== false);
        },
        loadFromAPI: async ()=>{
            if (get().initialized) return;
            try {
                // NOTE: Settings data is typically small, but using limit for consistency
                const response = await fetch('/api/settings/product-types?limit=50');
                if (response.ok) {
                    const json = await response.json();
                    const data = json.data || [];
                    if (data.length > 0) {
                        set({
                            data: data.map((item)=>({
                                    ...item,
                                    systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])(item.systemId),
                                    id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asBusinessId"])(item.id)
                                })),
                            initialized: true
                        });
                    } else {
                        set({
                            initialized: true
                        });
                    }
                }
            } catch (error) {
                console.error('[Product Type Store] loadFromAPI error:', error);
            }
        }
    }));
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/features/settings/inventory/product-category-store.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useProductCategoryStore",
    ()=>useProductCategoryStore
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/zustand/esm/react.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/id-types.ts [app-client] (ecmascript)");
;
;
const generateSystemId = (counter)=>{
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])(`CATEGORY${String(counter + 1).padStart(6, '0')}`);
};
const generateBusinessId = (counter)=>{
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asBusinessId"])(`DM${String(counter + 1).padStart(6, '0')}`);
};
// Helper to calculate path and level
const calculatePathAndLevel = (category, allCategories)=>{
    if (!category.parentId) {
        return {
            path: category.name,
            level: 0
        };
    }
    const parent = allCategories.find((c)=>c.systemId === category.parentId);
    if (!parent) {
        return {
            path: category.name,
            level: 0
        };
    }
    const parentInfo = calculatePathAndLevel(parent, allCategories);
    return {
        path: `${parentInfo.path} > ${category.name}`,
        level: parentInfo.level + 1
    };
};
// API sync helper
async function syncCategoryToAPI(category, action) {
    try {
        const endpoint = action === 'create' ? '/api/categories' : `/api/categories/${category.systemId}`;
        const response = await fetch(endpoint, {
            method: action === 'create' ? 'POST' : action === 'delete' ? 'DELETE' : 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(category)
        });
        return response.ok;
    } catch (error) {
        console.error('syncCategoryToAPI error:', error);
        return false;
    }
}
const useProductCategoryStore = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["create"])()((set, get)=>({
        data: [],
        counter: 0,
        initialized: false,
        add: (category)=>{
            const currentCounter = get().counter;
            const allData = get().data;
            const { id, ...rest } = category;
            const businessId = id && id.trim() ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asBusinessId"])(id.trim()) : generateBusinessId(currentCounter);
            const { path, level } = calculatePathAndLevel({
                ...rest,
                systemId: 'temp',
                id: businessId,
                path: '',
                level: 0
            }, allData);
            const newCategory = {
                ...rest,
                systemId: generateSystemId(currentCounter),
                id: businessId,
                path,
                level,
                createdAt: new Date().toISOString(),
                isDeleted: false,
                isActive: category.isActive !== undefined ? category.isActive : true
            };
            set((state)=>({
                    data: [
                        ...state.data,
                        newCategory
                    ],
                    counter: state.counter + 1
                }));
            get().recalculatePaths();
            return newCategory;
        },
        update: (systemId, updates)=>{
            set((state)=>({
                    data: state.data.map((item)=>item.systemId === systemId ? {
                            ...item,
                            ...updates,
                            updatedAt: new Date().toISOString()
                        } : item)
                }));
            get().recalculatePaths();
        },
        remove: (systemId)=>{
            set((state)=>({
                    data: state.data.map((item)=>item.systemId === systemId ? {
                            ...item,
                            isDeleted: true,
                            updatedAt: new Date().toISOString()
                        } : item)
                }));
        },
        findById: (systemId)=>{
            return get().data.find((item)=>item.systemId === systemId && !item.isDeleted);
        },
        findByBusinessId: (id)=>{
            return get().data.find((item)=>item.id === id && !item.isDeleted);
        },
        getActive: ()=>{
            return get().data.filter((item)=>!item.isDeleted && item.isActive);
        },
        getByParent: (parentId)=>{
            return get().data.filter((item)=>!item.isDeleted && item.isActive && item.parentId === parentId).sort((a, b)=>(a.sortOrder ?? 0) - (b.sortOrder ?? 0));
        },
        updateSortOrder: (systemId, newSortOrder)=>{
            set((state)=>({
                    data: state.data.map((item)=>item.systemId === systemId ? {
                            ...item,
                            sortOrder: newSortOrder,
                            updatedAt: new Date().toISOString()
                        } : item)
                }));
        },
        moveCategory: (systemId, newParentId, newSortOrder)=>{
            set((state)=>({
                    data: state.data.map((item)=>item.systemId === systemId ? {
                            ...item,
                            parentId: newParentId,
                            sortOrder: newSortOrder,
                            updatedAt: new Date().toISOString()
                        } : item)
                }));
            get().recalculatePaths();
        },
        recalculatePaths: ()=>{
            set((state)=>{
                const allData = [
                    ...state.data
                ];
                const updated = allData.map((cat)=>{
                    if (cat.isDeleted) return cat;
                    const { path, level } = calculatePathAndLevel(cat, allData);
                    return {
                        ...cat,
                        path,
                        level
                    };
                });
                return {
                    data: updated
                };
            });
        },
        getNextId: ()=>generateBusinessId(get().counter),
        isBusinessIdExists: (id)=>get().data.some((item)=>String(item.id) === id),
        loadFromAPI: async ()=>{
            if (get().initialized) return;
            try {
                const response = await fetch('/api/categories?all=true');
                if (response.ok) {
                    const json = await response.json();
                    if (json.data && Array.isArray(json.data)) {
                        const categories = json.data.map((item)=>({
                                ...item,
                                systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])(item.systemId),
                                id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asBusinessId"])(item.id),
                                parentId: item.parentId ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])(item.parentId) : undefined,
                                // Add default values for fields not in database
                                isActive: item.isDeleted !== true,
                                color: item.color || '#6366f1',
                                path: '',
                                level: 0
                            }));
                        set({
                            data: categories,
                            counter: categories.length,
                            initialized: true
                        });
                        get().recalculatePaths();
                    }
                }
            } catch (error) {
                console.error('loadFromAPI error:', error);
            }
            set({
                initialized: true
            });
        }
    }));
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/features/settings/branches/store.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useBranchStore",
    ()=>useBranchStore
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2d$factory$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/store-factory.ts [app-client] (ecmascript)");
;
const baseStore = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2d$factory$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createCrudStore"])([], 'branches', {
    apiEndpoint: '/api/branches'
});
const setDefault = (systemId)=>{
    baseStore.setState((state)=>({
            data: state.data.map((branch)=>({
                    ...branch,
                    isDefault: branch.systemId === systemId
                }))
        }));
};
const originalAdd = baseStore.getState().add;
const originalUpdate = baseStore.getState().update;
baseStore.setState({
    add: (item)=>{
        const result = originalAdd(item);
        if (item.isDefault) {
            setDefault(result.systemId);
        }
        return result;
    },
    update: (systemId, updatedItem)=>{
        originalUpdate(systemId, updatedItem);
        if (updatedItem.isDefault) {
            setDefault(systemId);
        }
    }
});
const enhanceState = (state)=>({
        ...state,
        setDefault
    });
const useBranchStoreBase = ()=>enhanceState(baseStore());
useBranchStoreBase.getState = ()=>enhanceState(baseStore.getState());
const useBranchStore = useBranchStoreBase;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=features_settings_5c44c746._.js.map