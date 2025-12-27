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
"[project]/features/settings/use-settings-page-header.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useSettingsPageHeader",
    ()=>useSettingsPageHeader
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$settings$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Settings2$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/settings-2.js [app-client] (ecmascript) <export default as Settings2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$contexts$2f$page$2d$header$2d$context$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/contexts/page-header-context.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
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
    _s();
    const pathname = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePathname"])();
    const { title, icon, docLink, breadcrumb, ...rest } = options;
    const normalizedDocLink = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"]({
        "useSettingsPageHeader.useMemo[normalizedDocLink]": ()=>{
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
        }
    }["useSettingsPageHeader.useMemo[normalizedDocLink]"], [
        docLink
    ]);
    const decoratedTitle = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"]({
        "useSettingsPageHeader.useMemo[decoratedTitle]": ()=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: "inline-flex items-center gap-2",
                children: [
                    icon ?? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$settings$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Settings2$3e$__["Settings2"], {
                        className: "h-5 w-5 text-muted-foreground",
                        "aria-hidden": "true"
                    }, void 0, false, {
                        fileName: "[project]/features/settings/use-settings-page-header.tsx",
                        lineNumber: 40,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
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
            }, this)
    }["useSettingsPageHeader.useMemo[decoratedTitle]"], [
        icon,
        title
    ]);
    const normalizedBreadcrumb = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"]({
        "useSettingsPageHeader.useMemo[normalizedBreadcrumb]": ()=>{
            const custom = (breadcrumb ?? []).map({
                "useSettingsPageHeader.useMemo[normalizedBreadcrumb].custom": (item)=>({
                        ...item,
                        href: item.href || pathname
                    })
            }["useSettingsPageHeader.useMemo[normalizedBreadcrumb].custom"]);
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
            return merged.map({
                "useSettingsPageHeader.useMemo[normalizedBreadcrumb]": (item, index)=>({
                        ...item,
                        isCurrent: index === merged.length - 1
                    })
            }["useSettingsPageHeader.useMemo[normalizedBreadcrumb]"]);
        }
    }["useSettingsPageHeader.useMemo[normalizedBreadcrumb]"], [
        breadcrumb,
        pathname,
        title
    ]);
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$contexts$2f$page$2d$header$2d$context$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePageHeader"])({
        ...rest,
        breadcrumb: normalizedBreadcrumb,
        title: decoratedTitle,
        docLink: normalizedDocLink
    });
}
_s(useSettingsPageHeader, "r5Bo0I/5rInfgy8zopcGsMUA8Tk=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePathname"],
        __TURBOPACK__imported__module__$5b$project$5d2f$contexts$2f$page$2d$header$2d$context$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePageHeader"]
    ];
});
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/features/settings/printer/workflow-templates-page.tsx [app-client] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "WorkflowTemplatesPage",
    ()=>WorkflowTemplatesPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
/**
 * Workflow Templates Settings Page - UPGRADED
 * 
 * Quản lý templates quy trình xử lý cho các chức năng
 * - Full CRUD: Create, Read, Update, Delete templates
 * - Mỗi chức năng có thể có NHIỀU quy trình
 * - Có switch "Mặc định" để chọn quy trình mặc định cho mỗi chức năng
 * - UI: VirtualizedDataTable với select all + Dialog editor
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$use$2d$settings$2d$page$2d$header$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/settings/use-settings-page-header.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/card.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/button.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$shared$2f$subtask$2d$list$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/shared/subtask-list.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/sonner/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$nanoid$2f$index$2e$browser$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/nanoid/index.browser.js [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/plus.js [app-client] (ecmascript) <export default as Plus>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$save$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Save$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/save.js [app-client] (ecmascript) <export default as Save>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/x.js [app-client] (ecmascript) <export default as X>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$ellipsis$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MoreHorizontal$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/ellipsis.js [app-client] (ecmascript) <export default as MoreHorizontal>");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/dialog.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/dropdown-menu.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/select.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/input.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$label$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/label.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$textarea$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/textarea.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$badge$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/badge.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$switch$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/switch.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$checkbox$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/checkbox.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$data$2d$table$2f$virtualized$2d$data$2d$table$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/data-table/virtualized-data-table.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$confirm$2d$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/confirm-dialog.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$separator$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/separator.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$use$2d$workflow$2d$templates$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/hooks/use-workflow-templates.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
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
// Available workflow types - Các chức năng có thể cần quy trình xử lý
const WORKFLOW_TYPES = [
    {
        value: 'complaints',
        label: 'Khiếu nại'
    },
    {
        value: 'warranty',
        label: 'Bảo hành'
    },
    {
        value: 'orders',
        label: 'Đơn hàng'
    },
    {
        value: 'sales-returns',
        label: 'Đổi trả hàng'
    },
    {
        value: 'purchase-returns',
        label: 'Trả hàng NCC'
    },
    {
        value: 'stock-transfers',
        label: 'Chuyển kho'
    },
    {
        value: 'inventory-checks',
        label: 'Kiểm kho'
    }
];
// ============================================================================
// Table Columns
// ============================================================================
function createColumns(onEdit, onDelete, onToggleDefault) {
    return [
        {
            id: 'select',
            size: 40,
            meta: {
                displayName: 'Chọn',
                sticky: 'left'
            },
            header: ({ isAllPageRowsSelected, isSomePageRowsSelected, onToggleAll })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$checkbox$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Checkbox"], {
                    checked: isSomePageRowsSelected ? 'indeterminate' : isAllPageRowsSelected,
                    onCheckedChange: (checked)=>onToggleAll?.(checked === true),
                    "aria-label": "Chọn tất cả"
                }, void 0, false, {
                    fileName: "[project]/features/settings/printer/workflow-templates-page.tsx",
                    lineNumber: 96,
                    columnNumber: 9
                }, this),
            cell: ({ isSelected, onToggleSelect })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$checkbox$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Checkbox"], {
                    checked: isSelected,
                    onCheckedChange: (checked)=>onToggleSelect?.(checked === true),
                    "aria-label": "Chọn dòng"
                }, void 0, false, {
                    fileName: "[project]/features/settings/printer/workflow-templates-page.tsx",
                    lineNumber: 103,
                    columnNumber: 9
                }, this)
        },
        {
            id: 'label',
            header: 'Tên quy trình',
            size: 250,
            cell: ({ row })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex items-center gap-2",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "font-medium",
                            children: row.label
                        }, void 0, false, {
                            fileName: "[project]/features/settings/printer/workflow-templates-page.tsx",
                            lineNumber: 116,
                            columnNumber: 11
                        }, this),
                        row.isDefault && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$badge$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Badge"], {
                            variant: "outline",
                            className: "text-xs",
                            children: "Mặc định"
                        }, void 0, false, {
                            fileName: "[project]/features/settings/printer/workflow-templates-page.tsx",
                            lineNumber: 118,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/features/settings/printer/workflow-templates-page.tsx",
                    lineNumber: 115,
                    columnNumber: 9
                }, this)
        },
        {
            id: 'name',
            header: 'Chức năng',
            size: 120,
            cell: ({ row })=>{
                const wt = WORKFLOW_TYPES.find((w)=>w.value === row.name);
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$badge$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Badge"], {
                    variant: "secondary",
                    children: wt?.label || row.name
                }, void 0, false, {
                    fileName: "[project]/features/settings/printer/workflow-templates-page.tsx",
                    lineNumber: 132,
                    columnNumber: 11
                }, this);
            }
        },
        {
            id: 'description',
            header: 'Mô tả',
            size: 250,
            cell: ({ row })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                    className: "text-sm text-muted-foreground truncate block max-w-[230px]",
                    children: row.description || '-'
                }, void 0, false, {
                    fileName: "[project]/features/settings/printer/workflow-templates-page.tsx",
                    lineNumber: 143,
                    columnNumber: 9
                }, this)
        },
        {
            id: 'subtasks',
            header: 'Số bước',
            size: 80,
            cell: ({ row })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                    className: "text-center block",
                    children: row.subtasks.length
                }, void 0, false, {
                    fileName: "[project]/features/settings/printer/workflow-templates-page.tsx",
                    lineNumber: 153,
                    columnNumber: 9
                }, this)
        },
        {
            id: 'isDefault',
            header: 'Mặc định',
            size: 100,
            cell: ({ row })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex justify-center",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$switch$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Switch"], {
                        checked: row.isDefault,
                        onCheckedChange: (checked)=>onToggleDefault(row, checked),
                        "aria-label": "Đặt làm mặc định"
                    }, void 0, false, {
                        fileName: "[project]/features/settings/printer/workflow-templates-page.tsx",
                        lineNumber: 162,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/features/settings/printer/workflow-templates-page.tsx",
                    lineNumber: 161,
                    columnNumber: 9
                }, this)
        },
        {
            id: 'actions',
            header: 'Thao tác',
            size: 80,
            meta: {
                displayName: 'Thao tác',
                sticky: 'right'
            },
            cell: ({ row })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DropdownMenu"], {
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DropdownMenuTrigger"], {
                            asChild: true,
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                variant: "ghost",
                                size: "icon",
                                className: "h-8 w-8",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$ellipsis$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MoreHorizontal$3e$__["MoreHorizontal"], {
                                    className: "h-4 w-4"
                                }, void 0, false, {
                                    fileName: "[project]/features/settings/printer/workflow-templates-page.tsx",
                                    lineNumber: 179,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/features/settings/printer/workflow-templates-page.tsx",
                                lineNumber: 178,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/features/settings/printer/workflow-templates-page.tsx",
                            lineNumber: 177,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DropdownMenuContent"], {
                            align: "end",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DropdownMenuItem"], {
                                    onClick: ()=>onEdit(row),
                                    children: "Sửa"
                                }, void 0, false, {
                                    fileName: "[project]/features/settings/printer/workflow-templates-page.tsx",
                                    lineNumber: 183,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DropdownMenuSeparator"], {}, void 0, false, {
                                    fileName: "[project]/features/settings/printer/workflow-templates-page.tsx",
                                    lineNumber: 186,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DropdownMenuItem"], {
                                    onClick: ()=>onDelete(row.systemId),
                                    className: "text-destructive focus:text-destructive",
                                    children: "Xóa"
                                }, void 0, false, {
                                    fileName: "[project]/features/settings/printer/workflow-templates-page.tsx",
                                    lineNumber: 187,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/features/settings/printer/workflow-templates-page.tsx",
                            lineNumber: 182,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/features/settings/printer/workflow-templates-page.tsx",
                    lineNumber: 176,
                    columnNumber: 9
                }, this)
        }
    ];
}
function WorkflowTemplatesPage() {
    _s();
    const { templates, setTemplates, isLoading } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$use$2d$workflow$2d$templates$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useWorkflowTemplates"])();
    // Table states
    const [rowSelection, setRowSelection] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"]({});
    const [expanded, setExpanded] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"]({});
    const [sorting, setSorting] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"]({
        id: 'createdAt',
        desc: true
    });
    const [columnVisibility, setColumnVisibility] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"]({});
    const [columnOrder, setColumnOrder] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"]([]);
    const [pinnedColumns, setPinnedColumns] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"]([
        'select',
        'actions'
    ]);
    // Dialog states
    const [isDialogOpen, setIsDialogOpen] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"](false);
    const [editingTemplate, setEditingTemplate] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"](null);
    const [deleteTargetId, setDeleteTargetId] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"](null);
    const [showBulkDeleteDialog, setShowBulkDeleteDialog] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"](false);
    // Form states
    const [formName, setFormName] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"]('');
    const [formLabel, setFormLabel] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"]('');
    const [formDescription, setFormDescription] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"]('');
    const [formSubtasks, setFormSubtasks] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"]([]);
    const selectedRows = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"]({
        "WorkflowTemplatesPage.useMemo[selectedRows]": ()=>{
            return templates.filter({
                "WorkflowTemplatesPage.useMemo[selectedRows]": (t)=>rowSelection[t.systemId]
            }["WorkflowTemplatesPage.useMemo[selectedRows]"]);
        }
    }["WorkflowTemplatesPage.useMemo[selectedRows]"], [
        templates,
        rowSelection
    ]);
    const handleCreate = ()=>{
        setEditingTemplate(null);
        setFormName('');
        setFormLabel('');
        setFormDescription('');
        setFormSubtasks([]);
        setIsDialogOpen(true);
    };
    // Tính số quy trình theo chức năng
    const workflowCounts = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"]({
        "WorkflowTemplatesPage.useMemo[workflowCounts]": ()=>{
            const counts = {};
            WORKFLOW_TYPES.forEach({
                "WorkflowTemplatesPage.useMemo[workflowCounts]": (wt)=>{
                    counts[wt.value] = templates.filter({
                        "WorkflowTemplatesPage.useMemo[workflowCounts]": (t)=>t.name === wt.value
                    }["WorkflowTemplatesPage.useMemo[workflowCounts]"]).length;
                }
            }["WorkflowTemplatesPage.useMemo[workflowCounts]"]);
            return counts;
        }
    }["WorkflowTemplatesPage.useMemo[workflowCounts]"], [
        templates
    ]);
    // Lấy các chức năng đã có quy trình
    const activeWorkflows = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"]({
        "WorkflowTemplatesPage.useMemo[activeWorkflows]": ()=>{
            return WORKFLOW_TYPES.filter({
                "WorkflowTemplatesPage.useMemo[activeWorkflows]": (wt)=>workflowCounts[wt.value] > 0
            }["WorkflowTemplatesPage.useMemo[activeWorkflows]"]);
        }
    }["WorkflowTemplatesPage.useMemo[activeWorkflows]"], [
        workflowCounts
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$use$2d$settings$2d$page$2d$header$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSettingsPageHeader"])({
        title: 'Quy trình',
        actions: [
            // Hiển thị badges cho các chức năng đã có quy trình
            ...activeWorkflows.map({
                "WorkflowTemplatesPage.useSettingsPageHeader": (wt)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$badge$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Badge"], {
                        variant: "secondary",
                        className: "text-xs",
                        children: [
                            wt.label,
                            ": ",
                            workflowCounts[wt.value]
                        ]
                    }, wt.value, true, {
                        fileName: "[project]/features/settings/printer/workflow-templates-page.tsx",
                        lineNumber: 259,
                        columnNumber: 9
                    }, this)
            }["WorkflowTemplatesPage.useSettingsPageHeader"]),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                onClick: handleCreate,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__["Plus"], {
                        className: "h-4 w-4"
                    }, void 0, false, {
                        fileName: "[project]/features/settings/printer/workflow-templates-page.tsx",
                        lineNumber: 264,
                        columnNumber: 9
                    }, this),
                    "Tạo quy trình"
                ]
            }, "add", true, {
                fileName: "[project]/features/settings/printer/workflow-templates-page.tsx",
                lineNumber: 263,
                columnNumber: 7
            }, this)
        ]
    });
    const handleEdit = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"]({
        "WorkflowTemplatesPage.useCallback[handleEdit]": (template)=>{
            setEditingTemplate(template);
            setFormName(template.name);
            setFormLabel(template.label);
            setFormDescription(template.description);
            setFormSubtasks([
                ...template.subtasks
            ]);
            setIsDialogOpen(true);
        }
    }["WorkflowTemplatesPage.useCallback[handleEdit]"], []);
    const handleSave = ()=>{
        // Validation
        if (!formName || !formLabel || formSubtasks.length === 0) {
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error('Vui lòng điền đầy đủ thông tin');
            return;
        }
        const now = new Date();
        if (editingTemplate) {
            // Update existing
            const updatedTemplates = templates.map((t)=>t.systemId === editingTemplate.systemId ? {
                    ...t,
                    name: formName,
                    label: formLabel,
                    description: formDescription,
                    subtasks: formSubtasks,
                    updatedAt: now
                } : t);
            setTemplates(updatedTemplates);
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].success('Đã cập nhật quy trình');
        } else {
            // Create new - check if this is the first template for this function
            const existingForFunction = templates.filter((t)=>t.name === formName);
            const isFirstForFunction = existingForFunction.length === 0;
            const newTemplate = {
                systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$nanoid$2f$index$2e$browser$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["nanoid"])(),
                id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$nanoid$2f$index$2e$browser$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["nanoid"])(),
                name: formName,
                label: formLabel,
                description: formDescription,
                subtasks: formSubtasks,
                isDefault: isFirstForFunction,
                createdAt: now,
                updatedAt: now
            };
            setTemplates([
                ...templates,
                newTemplate
            ]);
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].success('Đã tạo quy trình mới');
        }
        setIsDialogOpen(false);
    };
    const handleDeleteClick = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"]({
        "WorkflowTemplatesPage.useCallback[handleDeleteClick]": (templateId)=>{
            setDeleteTargetId(templateId);
        }
    }["WorkflowTemplatesPage.useCallback[handleDeleteClick]"], []);
    const handleDeleteConfirm = ()=>{
        if (!deleteTargetId) return;
        const templateToDelete = templates.find((t)=>t.systemId === deleteTargetId);
        let newTemplates = templates.filter((t)=>t.systemId !== deleteTargetId);
        // If deleted template was default, set another one as default
        if (templateToDelete?.isDefault) {
            const sameFunction = newTemplates.filter((t)=>t.name === templateToDelete.name);
            if (sameFunction.length > 0 && !sameFunction.some((t)=>t.isDefault)) {
                newTemplates = newTemplates.map((t)=>t.systemId === sameFunction[0].systemId ? {
                        ...t,
                        isDefault: true
                    } : t);
            }
        }
        setTemplates(newTemplates);
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].success('Đã xóa quy trình');
        setDeleteTargetId(null);
    };
    const handleBulkDelete = ()=>{
        setShowBulkDeleteDialog(true);
    };
    const handleBulkDeleteConfirm = ()=>{
        const idsToDelete = Object.keys(rowSelection);
        let newTemplates = templates.filter((t)=>!idsToDelete.includes(t.systemId));
        // Ensure each function has a default
        WORKFLOW_TYPES.forEach((wt)=>{
            const forFunction = newTemplates.filter((t)=>t.name === wt.value);
            if (forFunction.length > 0 && !forFunction.some((t)=>t.isDefault)) {
                newTemplates = newTemplates.map((t)=>t.systemId === forFunction[0].systemId ? {
                        ...t,
                        isDefault: true
                    } : t);
            }
        });
        setTemplates(newTemplates);
        setRowSelection({});
        setShowBulkDeleteDialog(false);
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].success(`Đã xóa ${idsToDelete.length} quy trình`);
    };
    const handleToggleDefault = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"]({
        "WorkflowTemplatesPage.useCallback[handleToggleDefault]": (template, checked)=>{
            if (checked) {
                // Bật mặc định cho template này
                const updatedTemplates = templates.map({
                    "WorkflowTemplatesPage.useCallback[handleToggleDefault].updatedTemplates": (t)=>{
                        if (t.name === template.name) {
                            return {
                                ...t,
                                isDefault: t.systemId === template.systemId,
                                updatedAt: new Date()
                            };
                        }
                        return t;
                    }
                }["WorkflowTemplatesPage.useCallback[handleToggleDefault].updatedTemplates"]);
                setTemplates(updatedTemplates);
            } else {
                // Tắt mặc định - tìm template khác cùng function để set mặc định
                const otherTemplates = templates.filter({
                    "WorkflowTemplatesPage.useCallback[handleToggleDefault].otherTemplates": (t)=>t.name === template.name && t.systemId !== template.systemId
                }["WorkflowTemplatesPage.useCallback[handleToggleDefault].otherTemplates"]);
                if (otherTemplates.length > 0) {
                    const newDefault = otherTemplates[0];
                    const updatedTemplates = templates.map({
                        "WorkflowTemplatesPage.useCallback[handleToggleDefault].updatedTemplates": (t)=>{
                            if (t.name === template.name) {
                                return {
                                    ...t,
                                    isDefault: t.systemId === newDefault.systemId,
                                    updatedAt: new Date()
                                };
                            }
                            return t;
                        }
                    }["WorkflowTemplatesPage.useCallback[handleToggleDefault].updatedTemplates"]);
                    setTemplates(updatedTemplates);
                } else {
                    // Không có template khác, giữ nguyên
                    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error('Phải có ít nhất một quy trình mặc định cho chức năng này');
                }
            }
        }
    }["WorkflowTemplatesPage.useCallback[handleToggleDefault]"], [
        templates,
        setTemplates
    ]);
    const columns = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"]({
        "WorkflowTemplatesPage.useMemo[columns]": ()=>createColumns(handleEdit, handleDeleteClick, handleToggleDefault)
    }["WorkflowTemplatesPage.useMemo[columns]"], [
        handleEdit,
        handleDeleteClick,
        handleToggleDefault
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "space-y-6",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Card"], {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardHeader"], {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardTitle"], {
                                children: "Danh sách quy trình"
                            }, void 0, false, {
                                fileName: "[project]/features/settings/printer/workflow-templates-page.tsx",
                                lineNumber: 427,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardDescription"], {
                                children: "Quản lý các quy trình xử lý cho từng chức năng. Mỗi chức năng có thể có nhiều quy trình, chọn 1 làm mặc định."
                            }, void 0, false, {
                                fileName: "[project]/features/settings/printer/workflow-templates-page.tsx",
                                lineNumber: 428,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/features/settings/printer/workflow-templates-page.tsx",
                        lineNumber: 426,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardContent"], {
                        children: templates.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "text-center py-8 text-muted-foreground",
                            children: 'Chưa có quy trình nào. Nhấn "Tạo quy trình" để bắt đầu.'
                        }, void 0, false, {
                            fileName: "[project]/features/settings/printer/workflow-templates-page.tsx",
                            lineNumber: 434,
                            columnNumber: 13
                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$data$2d$table$2f$virtualized$2d$data$2d$table$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["VirtualizedDataTable"], {
                            columns: columns,
                            data: templates,
                            rowSelection: rowSelection,
                            setRowSelection: setRowSelection,
                            onBulkDelete: handleBulkDelete,
                            showBulkDeleteButton: true,
                            allSelectedRows: selectedRows,
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
                            fileName: "[project]/features/settings/printer/workflow-templates-page.tsx",
                            lineNumber: 438,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/features/settings/printer/workflow-templates-page.tsx",
                        lineNumber: 432,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/features/settings/printer/workflow-templates-page.tsx",
                lineNumber: 425,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Card"], {
                className: "bg-muted/50",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardContent"], {
                    className: "pt-6",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "space-y-3 text-sm",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "font-medium",
                                children: "Hướng dẫn sử dụng:"
                            }, void 0, false, {
                                fileName: "[project]/features/settings/printer/workflow-templates-page.tsx",
                                lineNumber: 465,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                                className: "list-disc list-inside space-y-1 text-muted-foreground",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                        children: "Mỗi chức năng (Khiếu nại, Bảo hành, ...) có thể có nhiều quy trình"
                                    }, void 0, false, {
                                        fileName: "[project]/features/settings/printer/workflow-templates-page.tsx",
                                        lineNumber: 467,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                        children: 'Bật switch "Mặc định" để chọn quy trình áp dụng khi tạo phiếu mới'
                                    }, void 0, false, {
                                        fileName: "[project]/features/settings/printer/workflow-templates-page.tsx",
                                        lineNumber: 468,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                        children: "Mỗi chức năng chỉ có 1 quy trình mặc định"
                                    }, void 0, false, {
                                        fileName: "[project]/features/settings/printer/workflow-templates-page.tsx",
                                        lineNumber: 469,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                        children: "Khi hoàn thành 100% checklist → Tự động chuyển trạng thái cuối"
                                    }, void 0, false, {
                                        fileName: "[project]/features/settings/printer/workflow-templates-page.tsx",
                                        lineNumber: 470,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/features/settings/printer/workflow-templates-page.tsx",
                                lineNumber: 466,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/features/settings/printer/workflow-templates-page.tsx",
                        lineNumber: 464,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/features/settings/printer/workflow-templates-page.tsx",
                    lineNumber: 463,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/features/settings/printer/workflow-templates-page.tsx",
                lineNumber: 462,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Dialog"], {
                open: isDialogOpen,
                onOpenChange: setIsDialogOpen,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DialogContent"], {
                    className: "max-w-4xl max-h-[90vh] overflow-y-auto",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DialogHeader"], {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DialogTitle"], {
                                    children: editingTemplate ? 'Chỉnh sửa quy trình' : 'Tạo quy trình mới'
                                }, void 0, false, {
                                    fileName: "[project]/features/settings/printer/workflow-templates-page.tsx",
                                    lineNumber: 480,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DialogDescription"], {
                                    children: editingTemplate ? 'Cập nhật thông tin và các bước trong quy trình' : 'Chọn chức năng và tạo danh sách các bước xử lý'
                                }, void 0, false, {
                                    fileName: "[project]/features/settings/printer/workflow-templates-page.tsx",
                                    lineNumber: 483,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/features/settings/printer/workflow-templates-page.tsx",
                            lineNumber: 479,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "space-y-6 py-4",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "space-y-4",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "space-y-2",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$label$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Label"], {
                                                    children: "Chức năng *"
                                                }, void 0, false, {
                                                    fileName: "[project]/features/settings/printer/workflow-templates-page.tsx",
                                                    lineNumber: 496,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Select"], {
                                                    value: formName,
                                                    onValueChange: setFormName,
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SelectTrigger"], {
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SelectValue"], {
                                                                placeholder: "Chọn chức năng"
                                                            }, void 0, false, {
                                                                fileName: "[project]/features/settings/printer/workflow-templates-page.tsx",
                                                                lineNumber: 499,
                                                                columnNumber: 21
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/features/settings/printer/workflow-templates-page.tsx",
                                                            lineNumber: 498,
                                                            columnNumber: 19
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SelectContent"], {
                                                            children: WORKFLOW_TYPES.map((wt)=>{
                                                                const count = templates.filter((t)=>t.name === wt.value).length;
                                                                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SelectItem"], {
                                                                    value: wt.value,
                                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: "flex items-center gap-2",
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                children: wt.label
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/features/settings/printer/workflow-templates-page.tsx",
                                                                                lineNumber: 507,
                                                                                columnNumber: 29
                                                                            }, this),
                                                                            count > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$badge$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Badge"], {
                                                                                variant: "secondary",
                                                                                className: "ml-2 text-xs",
                                                                                children: [
                                                                                    count,
                                                                                    " quy trình"
                                                                                ]
                                                                            }, void 0, true, {
                                                                                fileName: "[project]/features/settings/printer/workflow-templates-page.tsx",
                                                                                lineNumber: 509,
                                                                                columnNumber: 31
                                                                            }, this)
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/features/settings/printer/workflow-templates-page.tsx",
                                                                        lineNumber: 506,
                                                                        columnNumber: 27
                                                                    }, this)
                                                                }, wt.value, false, {
                                                                    fileName: "[project]/features/settings/printer/workflow-templates-page.tsx",
                                                                    lineNumber: 505,
                                                                    columnNumber: 25
                                                                }, this);
                                                            })
                                                        }, void 0, false, {
                                                            fileName: "[project]/features/settings/printer/workflow-templates-page.tsx",
                                                            lineNumber: 501,
                                                            columnNumber: 19
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/features/settings/printer/workflow-templates-page.tsx",
                                                    lineNumber: 497,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/features/settings/printer/workflow-templates-page.tsx",
                                            lineNumber: 495,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "space-y-2",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$label$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Label"], {
                                                    children: "Tên quy trình *"
                                                }, void 0, false, {
                                                    fileName: "[project]/features/settings/printer/workflow-templates-page.tsx",
                                                    lineNumber: 523,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Input"], {
                                                    value: formLabel,
                                                    onChange: (e)=>setFormLabel(e.target.value),
                                                    placeholder: "VD: Quy trình xử lý khiếu nại VIP"
                                                }, void 0, false, {
                                                    fileName: "[project]/features/settings/printer/workflow-templates-page.tsx",
                                                    lineNumber: 524,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/features/settings/printer/workflow-templates-page.tsx",
                                            lineNumber: 522,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "space-y-2",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$label$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Label"], {
                                                    children: "Mô tả"
                                                }, void 0, false, {
                                                    fileName: "[project]/features/settings/printer/workflow-templates-page.tsx",
                                                    lineNumber: 533,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$textarea$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Textarea"], {
                                                    value: formDescription,
                                                    onChange: (e)=>setFormDescription(e.target.value),
                                                    placeholder: "Mô tả ngắn gọn về quy trình này",
                                                    rows: 2
                                                }, void 0, false, {
                                                    fileName: "[project]/features/settings/printer/workflow-templates-page.tsx",
                                                    lineNumber: 534,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/features/settings/printer/workflow-templates-page.tsx",
                                            lineNumber: 532,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/features/settings/printer/workflow-templates-page.tsx",
                                    lineNumber: 493,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$separator$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Separator"], {}, void 0, false, {
                                    fileName: "[project]/features/settings/printer/workflow-templates-page.tsx",
                                    lineNumber: 543,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "space-y-3",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex items-center justify-between",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$label$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Label"], {
                                                    className: "text-base",
                                                    children: "Các bước xử lý *"
                                                }, void 0, false, {
                                                    fileName: "[project]/features/settings/printer/workflow-templates-page.tsx",
                                                    lineNumber: 548,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$badge$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Badge"], {
                                                    variant: "secondary",
                                                    children: [
                                                        formSubtasks.length,
                                                        " bước"
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/features/settings/printer/workflow-templates-page.tsx",
                                                    lineNumber: 549,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/features/settings/printer/workflow-templates-page.tsx",
                                            lineNumber: 547,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$shared$2f$subtask$2d$list$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SubtaskList"], {
                                            subtasks: formSubtasks,
                                            onAdd: (title, parentId)=>{
                                                const newSubtask = {
                                                    id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$nanoid$2f$index$2e$browser$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["nanoid"])(),
                                                    title,
                                                    completed: false,
                                                    order: formSubtasks.length,
                                                    createdAt: new Date(),
                                                    parentId
                                                };
                                                setFormSubtasks((prev)=>[
                                                        ...prev,
                                                        newSubtask
                                                    ]);
                                            },
                                            onUpdate: (id, updates)=>{
                                                setFormSubtasks((prev)=>prev.map((s)=>s.id === id ? {
                                                            ...s,
                                                            ...updates
                                                        } : s));
                                            },
                                            onDelete: (id)=>{
                                                setFormSubtasks((prev)=>prev.filter((s)=>s.id !== id && s.parentId !== id));
                                            },
                                            onReorder: (reordered)=>{
                                                setFormSubtasks(reordered);
                                            },
                                            onToggleComplete: (id, completed)=>{
                                                // Keep completed false in template mode
                                                setFormSubtasks((prev)=>prev.map((s)=>s.id === id ? {
                                                            ...s,
                                                            completed: false
                                                        } : s));
                                            },
                                            allowNested: true,
                                            showProgress: false,
                                            readonly: false,
                                            emptyMessage: "Chưa có bước nào. Click 'Thêm subtask' để tạo."
                                        }, void 0, false, {
                                            fileName: "[project]/features/settings/printer/workflow-templates-page.tsx",
                                            lineNumber: 554,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/features/settings/printer/workflow-templates-page.tsx",
                                    lineNumber: 546,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/features/settings/printer/workflow-templates-page.tsx",
                            lineNumber: 491,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DialogFooter"], {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                    variant: "outline",
                                    onClick: ()=>setIsDialogOpen(false),
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
                                            className: "h-4 w-4"
                                        }, void 0, false, {
                                            fileName: "[project]/features/settings/printer/workflow-templates-page.tsx",
                                            lineNumber: 596,
                                            columnNumber: 15
                                        }, this),
                                        "Hủy"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/features/settings/printer/workflow-templates-page.tsx",
                                    lineNumber: 595,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                    onClick: handleSave,
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$save$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Save$3e$__["Save"], {
                                            className: "h-4 w-4"
                                        }, void 0, false, {
                                            fileName: "[project]/features/settings/printer/workflow-templates-page.tsx",
                                            lineNumber: 600,
                                            columnNumber: 15
                                        }, this),
                                        editingTemplate ? 'Cập nhật' : 'Tạo mới'
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/features/settings/printer/workflow-templates-page.tsx",
                                    lineNumber: 599,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/features/settings/printer/workflow-templates-page.tsx",
                            lineNumber: 594,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/features/settings/printer/workflow-templates-page.tsx",
                    lineNumber: 478,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/features/settings/printer/workflow-templates-page.tsx",
                lineNumber: 477,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$confirm$2d$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ConfirmDialog"], {
                open: !!deleteTargetId,
                onOpenChange: (open)=>!open && setDeleteTargetId(null),
                title: "Xác nhận xóa",
                description: `Bạn có chắc muốn xóa quy trình "${templates.find((t)=>t.systemId === deleteTargetId)?.label || ''}"? Hành động này không thể hoàn tác.`,
                confirmText: "Xóa",
                cancelText: "Hủy",
                variant: "destructive",
                onConfirm: handleDeleteConfirm
            }, void 0, false, {
                fileName: "[project]/features/settings/printer/workflow-templates-page.tsx",
                lineNumber: 608,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$confirm$2d$dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ConfirmDialog"], {
                open: showBulkDeleteDialog,
                onOpenChange: setShowBulkDeleteDialog,
                title: "Xác nhận xóa nhiều",
                description: `Bạn có chắc muốn xóa ${selectedRows.length} quy trình đã chọn? Hành động này không thể hoàn tác.`,
                confirmText: "Xóa tất cả",
                cancelText: "Hủy",
                variant: "destructive",
                onConfirm: handleBulkDeleteConfirm
            }, void 0, false, {
                fileName: "[project]/features/settings/printer/workflow-templates-page.tsx",
                lineNumber: 620,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/features/settings/printer/workflow-templates-page.tsx",
        lineNumber: 423,
        columnNumber: 5
    }, this);
}
_s(WorkflowTemplatesPage, "1nMMaCZO1p8Us1hRYN5sJBJZbsE=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$use$2d$workflow$2d$templates$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useWorkflowTemplates"],
        __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$use$2d$settings$2d$page$2d$header$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSettingsPageHeader"]
    ];
});
_c = WorkflowTemplatesPage;
;
var _c;
__turbopack_context__.k.register(_c, "WorkflowTemplatesPage");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/features/settings/customers/customer-types-data.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "defaultCustomerTypes",
    ()=>defaultCustomerTypes
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/id-types.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$seed$2d$audit$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/seed-audit.ts [app-client] (ecmascript)");
;
;
const defaultCustomerTypes = [
    {
        systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])('CTYPE00000001'),
        id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asBusinessId"])('CANHAN'),
        name: 'Cá nhân',
        description: 'Khách hàng cá nhân, mua lẻ',
        isActive: true,
        ...(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$seed$2d$audit$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["buildSeedAuditFields"])({
            createdAt: '2024-01-05T08:00:00Z'
        })
    },
    {
        systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])('CTYPE00000002'),
        id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asBusinessId"])('DOANHNGHIEP'),
        name: 'Doanh nghiệp',
        description: 'Khách hàng là công ty, doanh nghiệp',
        isActive: true,
        ...(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$seed$2d$audit$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["buildSeedAuditFields"])({
            createdAt: '2024-01-06T08:00:00Z'
        })
    }
];
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/features/settings/customers/customer-types-store.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useCustomerTypeStore",
    ()=>useCustomerTypeStore
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2d$factory$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/store-factory.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$customers$2f$customer$2d$types$2d$data$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/settings/customers/customer-types-data.ts [app-client] (ecmascript)");
;
;
const useCustomerTypeStore = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2d$factory$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createCrudStore"])(__TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$customers$2f$customer$2d$types$2d$data$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["defaultCustomerTypes"], 'customer-types', {
    apiEndpoint: '/api/settings/customers?type=customer-type'
});
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/features/settings/customers/customer-groups-data.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "defaultCustomerGroups",
    ()=>defaultCustomerGroups
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/id-types.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$seed$2d$audit$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/seed-audit.ts [app-client] (ecmascript)");
;
;
const defaultCustomerGroups = [
    {
        systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])('CGROUP00000001'),
        id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asBusinessId"])('VIP'),
        name: 'VIP',
        description: 'Khách hàng VIP, mua nhiều, giá trị cao',
        color: '#FFD700',
        defaultCreditLimit: 50000000,
        isActive: true,
        ...(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$seed$2d$audit$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["buildSeedAuditFields"])({
            createdAt: '2024-01-01T08:00:00Z'
        })
    },
    {
        systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])('CGROUP00000002'),
        id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asBusinessId"])('THUONGXUYEN'),
        name: 'Thường xuyên',
        description: 'Khách hàng mua thường xuyên',
        color: '#4CAF50',
        defaultCreditLimit: 20000000,
        isActive: true,
        ...(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$seed$2d$audit$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["buildSeedAuditFields"])({
            createdAt: '2024-01-02T08:00:00Z'
        })
    },
    {
        systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])('CGROUP00000003'),
        id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asBusinessId"])('MOI'),
        name: 'Mới',
        description: 'Khách hàng mới, lần đầu mua',
        color: '#2196F3',
        defaultCreditLimit: 5000000,
        isActive: true,
        ...(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$seed$2d$audit$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["buildSeedAuditFields"])({
            createdAt: '2024-01-03T08:00:00Z'
        })
    },
    {
        systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])('CGROUP00000004'),
        id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asBusinessId"])('TIEMNANG'),
        name: 'Tiềm năng',
        description: 'Khách hàng tiềm năng, đang tìm hiểu',
        color: '#FF9800',
        defaultCreditLimit: 0,
        isActive: true,
        ...(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$seed$2d$audit$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["buildSeedAuditFields"])({
            createdAt: '2024-01-04T08:00:00Z'
        })
    }
];
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/features/settings/customers/customer-groups-store.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useCustomerGroupStore",
    ()=>useCustomerGroupStore
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2d$factory$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/store-factory.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$customers$2f$customer$2d$groups$2d$data$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/settings/customers/customer-groups-data.ts [app-client] (ecmascript)");
;
;
const useCustomerGroupStore = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2d$factory$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createCrudStore"])(__TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$customers$2f$customer$2d$groups$2d$data$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["defaultCustomerGroups"], 'customer-groups', {
    apiEndpoint: '/api/settings/customers?type=customer-group'
});
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/features/settings/customers/customer-sources-data.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "defaultCustomerSources",
    ()=>defaultCustomerSources
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/id-types.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$seed$2d$audit$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/seed-audit.ts [app-client] (ecmascript)");
;
;
const defaultCustomerSources = [
    {
        systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])('CSOURCE00000001'),
        id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asBusinessId"])('WEBSITE'),
        name: 'Website',
        description: 'Khách hàng đến từ website công ty',
        type: 'Online',
        isActive: true,
        ...(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$seed$2d$audit$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["buildSeedAuditFields"])({
            createdAt: '2024-01-07T08:00:00Z'
        })
    },
    {
        systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])('CSOURCE00000002'),
        id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asBusinessId"])('FACEBOOK'),
        name: 'Facebook',
        description: 'Khách hàng từ quảng cáo Facebook',
        type: 'Online',
        isActive: true,
        ...(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$seed$2d$audit$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["buildSeedAuditFields"])({
            createdAt: '2024-01-08T08:00:00Z'
        })
    },
    {
        systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])('CSOURCE00000003'),
        id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asBusinessId"])('ZALO'),
        name: 'Zalo',
        description: 'Khách hàng từ Zalo',
        type: 'Online',
        isActive: true,
        ...(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$seed$2d$audit$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["buildSeedAuditFields"])({
            createdAt: '2024-01-09T08:00:00Z'
        })
    },
    {
        systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])('CSOURCE00000004'),
        id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asBusinessId"])('GIOITHIEU'),
        name: 'Giới thiệu',
        description: 'Khách hàng được giới thiệu bởi khách cũ',
        type: 'Referral',
        isActive: true,
        ...(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$seed$2d$audit$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["buildSeedAuditFields"])({
            createdAt: '2024-01-10T08:00:00Z'
        })
    },
    {
        systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])('CSOURCE00000005'),
        id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asBusinessId"])('CUAHANG'),
        name: 'Cửa hàng',
        description: 'Khách hàng đến trực tiếp cửa hàng',
        type: 'Offline',
        isActive: true,
        ...(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$seed$2d$audit$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["buildSeedAuditFields"])({
            createdAt: '2024-01-11T08:00:00Z'
        })
    },
    {
        systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])('CSOURCE00000006'),
        id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asBusinessId"])('DOITAC'),
        name: 'Đối tác',
        description: 'Khách hàng từ đối tác liên kết',
        type: 'Other',
        isActive: true,
        ...(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$seed$2d$audit$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["buildSeedAuditFields"])({
            createdAt: '2024-01-12T08:00:00Z'
        })
    }
];
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/features/settings/customers/customer-sources-store.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useCustomerSourceStore",
    ()=>useCustomerSourceStore
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2d$factory$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/store-factory.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$customers$2f$customer$2d$sources$2d$data$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/settings/customers/customer-sources-data.ts [app-client] (ecmascript)");
;
;
const useCustomerSourceStore = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2d$factory$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createCrudStore"])(__TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$customers$2f$customer$2d$sources$2d$data$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["defaultCustomerSources"], 'customer-sources', {
    apiEndpoint: '/api/settings/customers?type=customer-source'
});
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/features/settings/customers/payment-terms-data.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "defaultPaymentTerms",
    ()=>defaultPaymentTerms
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/id-types.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$seed$2d$audit$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/seed-audit.ts [app-client] (ecmascript)");
;
;
const defaultPaymentTerms = [
    {
        systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])('PTERM00000001'),
        id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asBusinessId"])('COD'),
        name: 'Thanh toán ngay (COD)',
        description: 'Thanh toán khi nhận hàng',
        days: 0,
        isDefault: true,
        isActive: true,
        ...(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$seed$2d$audit$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["buildSeedAuditFields"])({
            createdAt: '2024-01-19T08:00:00Z'
        })
    },
    {
        systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])('PTERM00000002'),
        id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asBusinessId"])('NET7'),
        name: 'Thanh toán trong 7 ngày',
        description: 'Thanh toán trong vòng 7 ngày kể từ ngày nhận hàng',
        days: 7,
        isDefault: false,
        isActive: true,
        ...(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$seed$2d$audit$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["buildSeedAuditFields"])({
            createdAt: '2024-01-20T08:00:00Z'
        })
    },
    {
        systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])('PTERM00000003'),
        id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asBusinessId"])('NET15'),
        name: 'Thanh toán trong 15 ngày',
        description: 'Thanh toán trong vòng 15 ngày kể từ ngày nhận hàng',
        days: 15,
        isDefault: false,
        isActive: true,
        ...(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$seed$2d$audit$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["buildSeedAuditFields"])({
            createdAt: '2024-01-21T08:00:00Z'
        })
    },
    {
        systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])('PTERM00000004'),
        id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asBusinessId"])('NET30'),
        name: 'Thanh toán trong 30 ngày',
        description: 'Thanh toán trong vòng 30 ngày kể từ ngày nhận hàng',
        days: 30,
        isDefault: false,
        isActive: true,
        ...(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$seed$2d$audit$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["buildSeedAuditFields"])({
            createdAt: '2024-01-22T08:00:00Z'
        })
    },
    {
        systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])('PTERM00000005'),
        id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asBusinessId"])('NET60'),
        name: 'Thanh toán trong 60 ngày',
        description: 'Thanh toán trong vòng 60 ngày kể từ ngày nhận hàng',
        days: 60,
        isDefault: false,
        isActive: true,
        ...(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$seed$2d$audit$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["buildSeedAuditFields"])({
            createdAt: '2024-01-23T08:00:00Z'
        })
    },
    {
        systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])('PTERM00000006'),
        id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asBusinessId"])('NET90'),
        name: 'Thanh toán trong 90 ngày',
        description: 'Thanh toán trong vòng 90 ngày kể từ ngày nhận hàng',
        days: 90,
        isDefault: false,
        isActive: true,
        ...(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$seed$2d$audit$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["buildSeedAuditFields"])({
            createdAt: '2024-01-24T08:00:00Z'
        })
    }
];
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/features/settings/customers/payment-terms-store.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "usePaymentTermStore",
    ()=>usePaymentTermStore
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2d$factory$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/store-factory.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$customers$2f$payment$2d$terms$2d$data$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/settings/customers/payment-terms-data.ts [app-client] (ecmascript)");
;
;
const usePaymentTermStore = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2d$factory$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createCrudStore"])(__TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$customers$2f$payment$2d$terms$2d$data$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["defaultPaymentTerms"], 'payment-terms', {
    apiEndpoint: '/api/settings/customers?type=payment-term'
});
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/features/settings/customers/credit-ratings-data.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "defaultCreditRatings",
    ()=>defaultCreditRatings
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/id-types.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$seed$2d$audit$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/seed-audit.ts [app-client] (ecmascript)");
;
;
const defaultCreditRatings = [
    {
        systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])('CRATING00000001'),
        id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asBusinessId"])('AAA'),
        name: 'AAA - Xuất sắc',
        description: 'Khách hàng có lịch sử thanh toán hoàn hảo, tín dụng cao',
        level: 1,
        maxCreditLimit: 1000000000,
        color: '#4CAF50',
        isActive: true,
        ...(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$seed$2d$audit$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["buildSeedAuditFields"])({
            createdAt: '2024-01-13T08:00:00Z'
        })
    },
    {
        systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])('CRATING00000002'),
        id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asBusinessId"])('AA'),
        name: 'AA - Rất tốt',
        description: 'Khách hàng có lịch sử thanh toán rất tốt',
        level: 2,
        maxCreditLimit: 500000000,
        color: '#8BC34A',
        isActive: true,
        ...(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$seed$2d$audit$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["buildSeedAuditFields"])({
            createdAt: '2024-01-14T08:00:00Z'
        })
    },
    {
        systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])('CRATING00000003'),
        id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asBusinessId"])('A'),
        name: 'A - Tốt',
        description: 'Khách hàng có lịch sử thanh toán tốt',
        level: 3,
        maxCreditLimit: 200000000,
        color: '#CDDC39',
        isActive: true,
        ...(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$seed$2d$audit$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["buildSeedAuditFields"])({
            createdAt: '2024-01-15T08:00:00Z'
        })
    },
    {
        systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])('CRATING00000004'),
        id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asBusinessId"])('B'),
        name: 'B - Trung bình',
        description: 'Khách hàng có lịch sử thanh toán trung bình',
        level: 4,
        maxCreditLimit: 50000000,
        color: '#FF9800',
        isActive: true,
        ...(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$seed$2d$audit$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["buildSeedAuditFields"])({
            createdAt: '2024-01-16T08:00:00Z'
        })
    },
    {
        systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])('CRATING00000005'),
        id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asBusinessId"])('C'),
        name: 'C - Yếu',
        description: 'Khách hàng có lịch sử thanh toán chậm trễ',
        level: 5,
        maxCreditLimit: 10000000,
        color: '#FF5722',
        isActive: true,
        ...(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$seed$2d$audit$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["buildSeedAuditFields"])({
            createdAt: '2024-01-17T08:00:00Z'
        })
    },
    {
        systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])('CRATING00000006'),
        id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asBusinessId"])('D'),
        name: 'D - Rủi ro cao',
        description: 'Khách hàng có lịch sử thanh toán kém, rủi ro cao',
        level: 6,
        maxCreditLimit: 0,
        color: '#F44336',
        isActive: true,
        ...(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$seed$2d$audit$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["buildSeedAuditFields"])({
            createdAt: '2024-01-18T08:00:00Z'
        })
    }
];
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/features/settings/customers/credit-ratings-store.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useCreditRatingStore",
    ()=>useCreditRatingStore
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2d$factory$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/store-factory.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$customers$2f$credit$2d$ratings$2d$data$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/settings/customers/credit-ratings-data.ts [app-client] (ecmascript)");
;
;
const useCreditRatingStore = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2d$factory$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createCrudStore"])(__TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$customers$2f$credit$2d$ratings$2d$data$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["defaultCreditRatings"], 'credit-ratings', {
    apiEndpoint: '/api/settings/customers?type=credit-rating'
});
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/features/settings/customers/sla-settings-data.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "SLA_TYPE_DESCRIPTIONS",
    ()=>SLA_TYPE_DESCRIPTIONS,
    "SLA_TYPE_LABELS",
    ()=>SLA_TYPE_LABELS,
    "defaultCustomerSlaSettings",
    ()=>defaultCustomerSlaSettings
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/id-types.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$seed$2d$audit$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/seed-audit.ts [app-client] (ecmascript)");
;
;
const defaultCustomerSlaSettings = [
    // Follow-up SLA - Nhắc liên hệ định kỳ
    {
        systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])('CUSTSLA0000001'),
        id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asBusinessId"])('SLA-FOLLOWUP'),
        name: 'Liên hệ định kỳ',
        description: 'Nhắc nhở liên hệ khách hàng sau một thời gian không tương tác',
        slaType: 'follow-up',
        targetDays: 14,
        warningDays: 3,
        criticalDays: 7,
        color: '#2196F3',
        isActive: true,
        ...(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$seed$2d$audit$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["buildSeedAuditFields"])({
            createdAt: '2024-01-01T08:00:00Z'
        })
    },
    // Re-engagement SLA - Kích hoạt lại khách hàng không hoạt động
    {
        systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])('CUSTSLA0000002'),
        id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asBusinessId"])('SLA-REENGAGEMENT'),
        name: 'Kích hoạt lại',
        description: 'Khách hàng không mua hàng cần được kích hoạt lại',
        slaType: 're-engagement',
        targetDays: 60,
        warningDays: 10,
        criticalDays: 14,
        color: '#FF9800',
        isActive: true,
        ...(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$seed$2d$audit$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["buildSeedAuditFields"])({
            createdAt: '2024-01-02T08:00:00Z'
        })
    },
    // Debt Payment SLA - Nhắc thanh toán công nợ
    {
        systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])('CUSTSLA0000003'),
        id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asBusinessId"])('SLA-DEBT'),
        name: 'Nhắc công nợ',
        description: 'Nhắc thanh toán công nợ quá hạn',
        slaType: 'debt-payment',
        targetDays: 7,
        warningDays: 2,
        criticalDays: 7,
        color: '#E91E63',
        isActive: true,
        ...(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$seed$2d$audit$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["buildSeedAuditFields"])({
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
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/features/settings/customers/sla-settings-store.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getSlaBySlaType",
    ()=>getSlaBySlaType,
    "loadCustomerSlaSettings",
    ()=>loadCustomerSlaSettings,
    "useCustomerSlaStore",
    ()=>useCustomerSlaStore
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2d$factory$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/store-factory.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$customers$2f$sla$2d$settings$2d$data$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/settings/customers/sla-settings-data.ts [app-client] (ecmascript)");
;
;
const useCustomerSlaStore = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2d$factory$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createCrudStore"])(__TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$customers$2f$sla$2d$settings$2d$data$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["defaultCustomerSlaSettings"], 'sla-settings', {
    apiEndpoint: '/api/settings/customers?type=sla-setting'
});
function getSlaBySlaType(slaType) {
    return useCustomerSlaStore.getState().data.find((sla)=>sla.slaType === slaType && sla.isActive);
}
function loadCustomerSlaSettings() {
    return useCustomerSlaStore.getState().data.filter((sla)=>sla.isActive);
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/features/settings/global-settings-store.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useDefaultPageSize",
    ()=>useDefaultPageSize,
    "useGlobalSettingsStore",
    ()=>useGlobalSettingsStore,
    "usePageSizeOptions",
    ()=>usePageSizeOptions,
    "usePaginationWithGlobalDefault",
    ()=>usePaginationWithGlobalDefault
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/zustand/esm/react.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$settings$2d$sync$2d$helper$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/settings-sync-helper.ts [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature(), _s2 = __turbopack_context__.k.signature();
;
;
;
const DEFAULT_SETTINGS = {
    defaultPageSize: 20,
    pageSizeOptions: [
        5,
        10,
        20,
        50,
        100
    ]
};
const SETTINGS_GROUP = 'global';
const useGlobalSettingsStore = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["create"])()((set, get)=>({
        settings: DEFAULT_SETTINGS,
        initialized: false,
        setDefaultPageSize: (size)=>{
            set((state)=>({
                    settings: {
                        ...state.settings,
                        defaultPageSize: size
                    }
                }));
            // Sync to API in background
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$settings$2d$sync$2d$helper$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["bulkSaveSettingsToAPI"])(SETTINGS_GROUP, {
                defaultPageSize: size
            }).catch(console.error);
        },
        setPageSizeOptions: (options)=>{
            set((state)=>({
                    settings: {
                        ...state.settings,
                        pageSizeOptions: options
                    }
                }));
            // Sync to API in background
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$settings$2d$sync$2d$helper$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["bulkSaveSettingsToAPI"])(SETTINGS_GROUP, {
                pageSizeOptions: options
            }).catch(console.error);
        },
        resetSettings: ()=>{
            set({
                settings: DEFAULT_SETTINGS
            });
            // Sync reset to API
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$settings$2d$sync$2d$helper$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["bulkSaveSettingsToAPI"])(SETTINGS_GROUP, DEFAULT_SETTINGS).catch(console.error);
        },
        initFromAPI: async ()=>{
            if (get().initialized) return;
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$settings$2d$sync$2d$helper$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["initializeSettingsFromAPI"])(SETTINGS_GROUP, (apiSettings)=>set({
                    settings: apiSettings
                }), DEFAULT_SETTINGS);
            set({
                initialized: true
            });
        },
        loadFromAPI: async ()=>{
            // Alias for initFromAPI for consistency with other stores
            await get().initFromAPI();
        }
    }));
function useDefaultPageSize() {
    _s();
    return useGlobalSettingsStore({
        "useDefaultPageSize.useGlobalSettingsStore": (state)=>state.settings.defaultPageSize
    }["useDefaultPageSize.useGlobalSettingsStore"]);
}
_s(useDefaultPageSize, "daLB3VN6Njjmcd0Onb9IJHpY8zc=", false, function() {
    return [
        useGlobalSettingsStore
    ];
});
function usePageSizeOptions() {
    _s1();
    return useGlobalSettingsStore({
        "usePageSizeOptions.useGlobalSettingsStore": (state)=>state.settings.pageSizeOptions
    }["usePageSizeOptions.useGlobalSettingsStore"]);
}
_s1(usePageSizeOptions, "daLB3VN6Njjmcd0Onb9IJHpY8zc=", false, function() {
    return [
        useGlobalSettingsStore
    ];
});
function usePaginationWithGlobalDefault() {
    _s2();
    const defaultPageSize = useDefaultPageSize();
    return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"]({
        pageIndex: 0,
        pageSize: defaultPageSize
    });
}
_s2(usePaginationWithGlobalDefault, "kt+lb8TnCIukHW8stjeRn7z4oEc=", false, function() {
    return [
        useDefaultPageSize
    ];
});
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=features_settings_842fc6a8._.js.map