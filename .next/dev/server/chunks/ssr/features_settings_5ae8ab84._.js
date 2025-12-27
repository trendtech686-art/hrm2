module.exports = [
"[project]/features/settings/inventory/product-category-store.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useProductCategoryStore",
    ()=>useProductCategoryStore
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/zustand/esm/react.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/id-types.ts [app-ssr] (ecmascript)");
;
;
const generateSystemId = (counter)=>{
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])(`CATEGORY${String(counter + 1).padStart(6, '0')}`);
};
const generateBusinessId = (counter)=>{
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])(`DM${String(counter + 1).padStart(6, '0')}`);
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
const useProductCategoryStore = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["create"])()((set, get)=>({
        data: [],
        counter: 0,
        initialized: false,
        add: (category)=>{
            const currentCounter = get().counter;
            const allData = get().data;
            const { id, ...rest } = category;
            const businessId = id && id.trim() ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])(id.trim()) : generateBusinessId(currentCounter);
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
                                systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])(item.systemId),
                                id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])(item.id),
                                parentId: item.parentId ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])(item.parentId) : undefined,
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
}),
"[project]/features/settings/inventory/product-type-store.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useProductTypeStore",
    ()=>useProductTypeStore
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/zustand/esm/react.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/id-types.ts [app-ssr] (ecmascript)");
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
        systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])(item.systemId),
        id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])(item.id)
    }));
const useProductTypeStore = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["create"])()((set, get)=>({
        data: initialData,
        initialized: false,
        add: (productType)=>{
            const newProductType = {
                ...productType,
                systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])(generateId()),
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
                                    systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asSystemId"])(item.systemId),
                                    id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["asBusinessId"])(item.id)
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
}),
"[project]/features/settings/pkgx/types.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "DEFAULT_PKGX_SETTINGS",
    ()=>DEFAULT_PKGX_SETTINGS,
    "SYNC_INTERVAL_OPTIONS",
    ()=>SYNC_INTERVAL_OPTIONS
]);
const DEFAULT_PKGX_SETTINGS = {
    apiUrl: 'https://phukiengiaxuong.com.vn/admin/api_product_pro.php',
    apiKey: '',
    enabled: false,
    categories: [],
    brands: [],
    priceMapping: {
        shopPrice: null,
        marketPrice: null,
        partnerPrice: null,
        acePrice: null,
        dealPrice: null
    },
    categoryMappings: [],
    brandMappings: [],
    syncSettings: {
        autoSyncEnabled: false,
        intervalMinutes: 30,
        syncInventory: true,
        syncPrice: true,
        syncSeo: false,
        syncOnProductUpdate: true,
        notifyOnError: true
    },
    logs: [],
    // Cached PKGX Products
    pkgxProducts: [],
    pkgxProductsLastFetch: undefined
};
const SYNC_INTERVAL_OPTIONS = [
    {
        value: 15,
        label: '15 phút'
    },
    {
        value: 30,
        label: '30 phút'
    },
    {
        value: 60,
        label: '1 giờ'
    },
    {
        value: 120,
        label: '2 giờ'
    },
    {
        value: 240,
        label: '4 giờ'
    }
];
}),
"[project]/features/settings/pkgx/constants.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "FIELD_MAPPING_REFERENCE",
    ()=>FIELD_MAPPING_REFERENCE,
    "PKGX_API_CONFIG",
    ()=>PKGX_API_CONFIG,
    "PKGX_BRANDS",
    ()=>PKGX_BRANDS,
    "PKGX_CATEGORIES",
    ()=>PKGX_CATEGORIES,
    "PKGX_PRICE_FIELDS",
    ()=>PKGX_PRICE_FIELDS
]);
const PKGX_CATEGORIES = [
    // === Danh mục chính - Hàng theo loại ===
    {
        id: 382,
        name: 'Sản phẩm mới'
    },
    {
        id: 302,
        name: 'Hàng Theo Loại Bán'
    },
    {
        id: 413,
        name: 'Hàng Hot Trend'
    },
    {
        id: 390,
        name: 'Hàng Bán Chạy'
    },
    {
        id: 389,
        name: 'Hàng Thanh Lý'
    },
    {
        id: 387,
        name: 'Hàng Độc Quyền'
    },
    {
        id: 391,
        name: 'Hàng bán Sàn TMĐT'
    },
    {
        id: 388,
        name: 'Hàng Tặng Kèm'
    },
    {
        id: 386,
        name: 'Hàng Chợ'
    },
    // === Tai nghe ===
    {
        id: 37,
        name: 'Sỉ tai nghe'
    },
    {
        id: 315,
        name: 'Tai nghe Bluetooth TWS'
    },
    {
        id: 314,
        name: 'Tai nghe có dây'
    },
    {
        id: 316,
        name: 'Tai nghe chụp tai bluetooth'
    },
    {
        id: 375,
        name: 'Tai nghe bluetooth 1 bên'
    },
    {
        id: 376,
        name: 'Tai nghe bluetooth thể thao'
    },
    {
        id: 377,
        name: 'Tai nghe chụp tai Gaming'
    },
    {
        id: 384,
        name: 'Case Tai Nghe Bluetooth'
    },
    // === Cáp sạc ===
    {
        id: 38,
        name: 'Sỉ cáp sạc'
    },
    {
        id: 317,
        name: 'Cáp sạc Type-C'
    },
    {
        id: 318,
        name: 'Cáp sạc Lightning'
    },
    {
        id: 319,
        name: 'Cáp sạc Micro USB'
    },
    {
        id: 320,
        name: 'Cáp sạc đa năng'
    },
    {
        id: 378,
        name: 'Cáp sạc nhanh'
    },
    // === Củ sạc ===
    {
        id: 39,
        name: 'Sỉ củ sạc'
    },
    {
        id: 321,
        name: 'Củ sạc nhanh'
    },
    {
        id: 322,
        name: 'Củ sạc thường'
    },
    {
        id: 323,
        name: 'Củ sạc không dây'
    },
    {
        id: 379,
        name: 'Củ sạc Magsafe'
    },
    // === Sạc dự phòng ===
    {
        id: 40,
        name: 'Sỉ sạc dự phòng'
    },
    {
        id: 324,
        name: 'Sạc dự phòng 10000mAh'
    },
    {
        id: 325,
        name: 'Sạc dự phòng 20000mAh'
    },
    {
        id: 326,
        name: 'Sạc dự phòng 30000mAh+'
    },
    {
        id: 380,
        name: 'Sạc dự phòng mini'
    },
    // === Loa ===
    {
        id: 41,
        name: 'Sỉ loa bluetooth'
    },
    {
        id: 327,
        name: 'Loa bluetooth mini'
    },
    {
        id: 328,
        name: 'Loa bluetooth karaoke'
    },
    {
        id: 329,
        name: 'Loa bluetooth chống nước'
    },
    {
        id: 381,
        name: 'Loa kéo'
    },
    // === Phụ kiện điện thoại ===
    {
        id: 42,
        name: 'Phụ kiện điện thoại'
    },
    {
        id: 330,
        name: 'Ốp lưng điện thoại'
    },
    {
        id: 331,
        name: 'Kính cường lực'
    },
    {
        id: 332,
        name: 'Giá đỡ điện thoại'
    },
    {
        id: 333,
        name: 'Gậy selfie/tripod'
    },
    {
        id: 383,
        name: 'Ring holder'
    },
    // === Phụ kiện máy tính ===
    {
        id: 43,
        name: 'Phụ kiện máy tính'
    },
    {
        id: 334,
        name: 'Chuột máy tính'
    },
    {
        id: 335,
        name: 'Bàn phím'
    },
    {
        id: 336,
        name: 'Hub USB'
    },
    {
        id: 337,
        name: 'Webcam'
    },
    // === Đồng hồ thông minh ===
    {
        id: 44,
        name: 'Sỉ đồng hồ thông minh'
    },
    {
        id: 338,
        name: 'Smartwatch'
    },
    {
        id: 339,
        name: 'Smartband'
    },
    {
        id: 340,
        name: 'Dây đeo smartwatch'
    },
    // === Gaming ===
    {
        id: 45,
        name: 'Phụ kiện gaming'
    },
    {
        id: 341,
        name: 'Tay cầm chơi game'
    },
    {
        id: 342,
        name: 'Quạt tản nhiệt điện thoại'
    },
    {
        id: 343,
        name: 'Nút bấm chơi game'
    },
    // === Ô tô ===
    {
        id: 46,
        name: 'Phụ kiện ô tô'
    },
    {
        id: 344,
        name: 'Sạc xe hơi'
    },
    {
        id: 345,
        name: 'Giá đỡ điện thoại xe hơi'
    },
    {
        id: 346,
        name: 'Camera hành trình'
    },
    // === Gia dụng ===
    {
        id: 47,
        name: 'Đồ gia dụng'
    },
    {
        id: 347,
        name: 'Đèn LED'
    },
    {
        id: 348,
        name: 'Quạt mini'
    },
    {
        id: 349,
        name: 'Cân điện tử'
    }
];
const PKGX_BRANDS = [
    // === Thương hiệu chính ===
    {
        id: 15,
        name: 'Hoco'
    },
    {
        id: 141,
        name: 'Borofone'
    },
    {
        id: 138,
        name: 'Baseus'
    },
    {
        id: 12,
        name: 'Wekome'
    },
    {
        id: 157,
        name: 'Maxitech'
    },
    // === Thương hiệu phụ ===
    {
        id: 10,
        name: 'Anker'
    },
    {
        id: 11,
        name: 'Xiaomi'
    },
    {
        id: 13,
        name: 'Samsung'
    },
    {
        id: 14,
        name: 'Apple'
    },
    {
        id: 16,
        name: 'Remax'
    },
    {
        id: 17,
        name: 'Ugreen'
    },
    {
        id: 18,
        name: 'Vivan'
    },
    {
        id: 19,
        name: 'Energizer'
    },
    {
        id: 20,
        name: 'Sony'
    },
    {
        id: 21,
        name: 'JBL'
    },
    {
        id: 22,
        name: 'Logitech'
    },
    {
        id: 23,
        name: 'Rapoo'
    },
    {
        id: 24,
        name: 'Orico'
    },
    {
        id: 25,
        name: 'Havit'
    },
    {
        id: 26,
        name: 'Edifier'
    },
    {
        id: 27,
        name: 'Aukey'
    },
    {
        id: 28,
        name: 'Belkin'
    },
    {
        id: 29,
        name: 'Mophie'
    },
    {
        id: 30,
        name: 'Spigen'
    },
    {
        id: 31,
        name: 'Nillkin'
    },
    {
        id: 32,
        name: 'ESR'
    },
    {
        id: 33,
        name: 'Mazer'
    },
    {
        id: 34,
        name: 'Hyphen'
    },
    {
        id: 35,
        name: 'WiWU'
    },
    {
        id: 36,
        name: 'Pisen'
    },
    {
        id: 37,
        name: 'Yoobao'
    },
    {
        id: 38,
        name: 'iWalk'
    },
    {
        id: 39,
        name: 'Romoss'
    },
    {
        id: 40,
        name: 'Tronsmart'
    },
    {
        id: 41,
        name: 'QCY'
    },
    {
        id: 42,
        name: 'Lenovo'
    },
    {
        id: 43,
        name: 'Huawei'
    },
    {
        id: 44,
        name: 'Oppo'
    },
    {
        id: 45,
        name: 'Vivo'
    },
    {
        id: 46,
        name: 'Realme'
    },
    {
        id: 47,
        name: 'Nothing'
    },
    {
        id: 100,
        name: 'Không thương hiệu'
    },
    {
        id: 101,
        name: 'OEM'
    },
    {
        id: 102,
        name: 'Noname'
    }
];
const PKGX_API_CONFIG = {
    baseUrl: 'https://phukiengiaxuong.com.vn/admin/api_product_hrm.php',
    cdnUrl: 'https://phukiengiaxuong.com.vn/cdn/',
    defaultApiKey: 'a91f2c47e5d8b6f03a7c4e9d12f0b8a6',
    // Rate limiting
    maxRequestsPerMinute: 60,
    requestTimeout: 30000,
    // Pagination
    defaultPageSize: 50,
    maxPageSize: 100
};
const FIELD_MAPPING_REFERENCE = {
    // HRM Field → PKGX Field
    'pkgxId': 'goods_id',
    'id': 'goods_sn',
    'name': 'goods_name',
    'categorySystemId': 'cat_id',
    'brandSystemId': 'brand_id',
    'description': 'goods_desc',
    'shortDescription': 'goods_brief',
    'ktitle': 'meta_title',
    'seoDescription': 'meta_desc',
    'tags': 'keywords',
    'thumbnailImage': 'original_img',
    'isFeatured': 'is_best',
    'isNewArrival': 'is_new',
    'isPublished': 'is_on_sale',
    'slug': 'slug'
};
const PKGX_PRICE_FIELDS = [
    {
        key: 'shopPrice',
        field: 'shop_price',
        label: 'Giá bán (shop_price)',
        description: 'Giá bán chính trên website'
    },
    {
        key: 'marketPrice',
        field: 'market_price',
        label: 'Giá thị trường (market_price)',
        description: 'Giá niêm yết / giá gốc'
    },
    {
        key: 'partnerPrice',
        field: 'partner_price',
        label: 'Giá đối tác (partner_price)',
        description: 'Giá dành cho đối tác'
    },
    {
        key: 'acePrice',
        field: 'ace_price',
        label: 'Giá ACE (ace_price)',
        description: 'Giá đặc biệt ACE'
    },
    {
        key: 'dealPrice',
        field: 'deal_price',
        label: 'Giá deal (deal_price)',
        description: 'Giá khuyến mãi'
    }
];
}),
"[project]/features/settings/pkgx/store.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "usePkgxApiConfig",
    ()=>usePkgxApiConfig,
    "usePkgxBrandMappings",
    ()=>usePkgxBrandMappings,
    "usePkgxBrands",
    ()=>usePkgxBrands,
    "usePkgxCategories",
    ()=>usePkgxCategories,
    "usePkgxCategoryMappings",
    ()=>usePkgxCategoryMappings,
    "usePkgxEnabled",
    ()=>usePkgxEnabled,
    "usePkgxPriceMapping",
    ()=>usePkgxPriceMapping,
    "usePkgxProducts",
    ()=>usePkgxProducts,
    "usePkgxSettingsStore",
    ()=>usePkgxSettingsStore,
    "usePkgxSyncSettings",
    ()=>usePkgxSyncSettings,
    "usePkgxSyncStatus",
    ()=>usePkgxSyncStatus
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/zustand/esm/react.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$pkgx$2f$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/settings/pkgx/types.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$pkgx$2f$constants$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/settings/pkgx/constants.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$pkgx$2f$api$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/pkgx/api-service.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$contexts$2f$auth$2d$context$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/contexts/auth-context.tsx [app-ssr] (ecmascript)");
;
;
;
;
;
// ========================================
// API Sync Helper
// ========================================
async function syncPkgxSettingsToAPI(settings) {
    try {
        const response = await fetch('/api/settings/pkgx', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify(settings)
        });
        return response.ok;
    } catch (error) {
        console.error('[PKGX Settings API] sync error:', error);
        return false;
    }
}
const usePkgxSettingsStore = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["create"])()((set, get)=>({
        // === Initial State ===
        settings: {
            ...__TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$pkgx$2f$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DEFAULT_PKGX_SETTINGS"],
            categories: __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$pkgx$2f$constants$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["PKGX_CATEGORIES"],
            brands: __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$pkgx$2f$constants$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["PKGX_BRANDS"]
        },
        isLoading: false,
        isSaving: false,
        initialized: false,
        // === General Config Actions ===
        setApiUrl: (url)=>set((state)=>({
                    settings: {
                        ...state.settings,
                        apiUrl: url
                    }
                })),
        setApiKey: (key)=>set((state)=>({
                    settings: {
                        ...state.settings,
                        apiKey: key
                    }
                })),
        setEnabled: (enabled)=>set((state)=>({
                    settings: {
                        ...state.settings,
                        enabled
                    }
                })),
        // === Reference Data Actions ===
        setCategories: (categories)=>set((state)=>({
                    settings: {
                        ...state.settings,
                        categories
                    }
                })),
        addCategory: (category)=>set((state)=>({
                    settings: {
                        ...state.settings,
                        categories: [
                            ...state.settings.categories,
                            category
                        ]
                    }
                })),
        updateCategory: (id, updates)=>set((state)=>({
                    settings: {
                        ...state.settings,
                        categories: state.settings.categories.map((c)=>c.id === id ? {
                                ...c,
                                ...updates
                            } : c)
                    }
                })),
        deleteCategory: (id)=>set((state)=>({
                    settings: {
                        ...state.settings,
                        categories: state.settings.categories.filter((c)=>c.id !== id),
                        // Also remove related mappings
                        categoryMappings: state.settings.categoryMappings.filter((m)=>m.pkgxCatId !== id)
                    }
                })),
        setBrands: (brands)=>set((state)=>({
                    settings: {
                        ...state.settings,
                        brands
                    }
                })),
        addBrand: (brand)=>set((state)=>({
                    settings: {
                        ...state.settings,
                        brands: [
                            ...state.settings.brands,
                            brand
                        ]
                    }
                })),
        updateBrand: (id, updates)=>set((state)=>({
                    settings: {
                        ...state.settings,
                        brands: state.settings.brands.map((b)=>b.id === id ? {
                                ...b,
                                ...updates
                            } : b)
                    }
                })),
        deleteBrand: (id)=>set((state)=>({
                    settings: {
                        ...state.settings,
                        brands: state.settings.brands.filter((b)=>b.id !== id),
                        // Also remove related mappings
                        brandMappings: state.settings.brandMappings.filter((m)=>m.pkgxBrandId !== id)
                    }
                })),
        // === Mapping Actions ===
        setPriceMapping: (mapping)=>set((state)=>({
                    settings: {
                        ...state.settings,
                        priceMapping: mapping
                    }
                })),
        updatePriceMapping: (field, policyId)=>set((state)=>({
                    settings: {
                        ...state.settings,
                        priceMapping: {
                            ...state.settings.priceMapping,
                            [field]: policyId
                        }
                    }
                })),
        setCategoryMappings: (mappings)=>set((state)=>({
                    settings: {
                        ...state.settings,
                        categoryMappings: mappings
                    }
                })),
        addCategoryMapping: (mapping)=>set((state)=>({
                    settings: {
                        ...state.settings,
                        categoryMappings: [
                            ...state.settings.categoryMappings,
                            mapping
                        ]
                    }
                })),
        updateCategoryMapping: (id, updates)=>set((state)=>({
                    settings: {
                        ...state.settings,
                        categoryMappings: state.settings.categoryMappings.map((m)=>m.id === id ? {
                                ...m,
                                ...updates
                            } : m)
                    }
                })),
        deleteCategoryMapping: (id)=>set((state)=>({
                    settings: {
                        ...state.settings,
                        categoryMappings: state.settings.categoryMappings.filter((m)=>m.id !== id)
                    }
                })),
        setBrandMappings: (mappings)=>set((state)=>({
                    settings: {
                        ...state.settings,
                        brandMappings: mappings
                    }
                })),
        addBrandMapping: (mapping)=>set((state)=>({
                    settings: {
                        ...state.settings,
                        brandMappings: [
                            ...state.settings.brandMappings,
                            mapping
                        ]
                    }
                })),
        updateBrandMapping: (id, updates)=>set((state)=>({
                    settings: {
                        ...state.settings,
                        brandMappings: state.settings.brandMappings.map((m)=>m.id === id ? {
                                ...m,
                                ...updates
                            } : m)
                    }
                })),
        deleteBrandMapping: (id)=>set((state)=>({
                    settings: {
                        ...state.settings,
                        brandMappings: state.settings.brandMappings.filter((m)=>m.id !== id)
                    }
                })),
        // === Sync Settings Actions ===
        setSyncSettings: (syncSettings)=>set((state)=>({
                    settings: {
                        ...state.settings,
                        syncSettings
                    }
                })),
        updateSyncSetting: (key, value)=>set((state)=>({
                    settings: {
                        ...state.settings,
                        syncSettings: {
                            ...state.settings.syncSettings,
                            [key]: value
                        }
                    }
                })),
        // === Log Actions ===
        addLog: (log)=>{
            // Lấy thông tin user hiện tại
            const userInfo = (0, __TURBOPACK__imported__module__$5b$project$5d2f$contexts$2f$auth$2d$context$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getCurrentUserInfo"])();
            const newLog = {
                ...log,
                id: `log-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
                timestamp: new Date().toISOString(),
                userId: userInfo.systemId,
                userName: userInfo.name
            };
            set((state)=>({
                    settings: {
                        ...state.settings,
                        logs: [
                            newLog,
                            ...state.settings.logs
                        ].slice(0, 100)
                    }
                }));
        },
        clearLogs: ()=>set((state)=>({
                    settings: {
                        ...state.settings,
                        logs: []
                    }
                })),
        // === Sync Actions ===
        syncCategoriesFromPkgx: async ()=>{
            const { addLog, setCategories } = get();
            try {
                const response = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$pkgx$2f$api$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getCategories"])();
                if (response.success && response.data && !response.data.error) {
                    // Map API response to PkgxCategory format
                    const categories = response.data.data.map((cat)=>({
                            id: cat.cat_id,
                            name: cat.cat_name,
                            parentId: cat.parent_id > 0 ? cat.parent_id : undefined
                        }));
                    // Replace all categories with fresh data from server
                    setCategories(categories);
                    addLog({
                        action: 'sync_categories',
                        status: 'success',
                        message: `Đã đồng bộ ${categories.length} danh mục từ PKGX`,
                        details: {
                            total: categories.length,
                            success: categories.length,
                            failed: 0
                        }
                    });
                } else {
                    throw new Error(response.error || response.data?.message || 'Không thể lấy danh sách danh mục');
                }
            } catch (error) {
                addLog({
                    action: 'sync_categories',
                    status: 'error',
                    message: 'Lỗi khi đồng bộ danh mục từ PKGX',
                    details: {
                        error: error instanceof Error ? error.message : String(error)
                    }
                });
                throw error; // Re-throw to let UI handle
            }
        },
        syncBrandsFromPkgx: async ()=>{
            const { addLog, setBrands } = get();
            try {
                const response = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$pkgx$2f$api$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getBrands"])();
                if (response.success && response.data && !response.data.error) {
                    // Map API response to PkgxBrand format
                    const brands = response.data.data.map((brand)=>({
                            id: brand.brand_id,
                            name: brand.brand_name
                        }));
                    // Replace all brands with fresh data from server
                    setBrands(brands);
                    addLog({
                        action: 'sync_brands',
                        status: 'success',
                        message: `Đã đồng bộ ${brands.length} thương hiệu từ PKGX`,
                        details: {
                            total: brands.length,
                            success: brands.length,
                            failed: 0
                        }
                    });
                } else {
                    throw new Error(response.error || response.data?.message || 'Không thể lấy danh sách thương hiệu');
                }
            } catch (error) {
                addLog({
                    action: 'sync_brands',
                    status: 'error',
                    message: 'Lỗi khi đồng bộ thương hiệu từ PKGX',
                    details: {
                        error: error instanceof Error ? error.message : String(error)
                    }
                });
                throw error; // Re-throw to let UI handle
            }
        },
        // === PKGX Products Cache Actions ===
        setPkgxProducts: (products)=>set((state)=>({
                    settings: {
                        ...state.settings,
                        pkgxProducts: products,
                        pkgxProductsLastFetch: new Date().toISOString()
                    }
                })),
        clearPkgxProducts: ()=>set((state)=>({
                    settings: {
                        ...state.settings,
                        pkgxProducts: [],
                        pkgxProductsLastFetch: undefined
                    }
                })),
        // === Status Actions ===
        setLastSyncAt: (timestamp)=>set((state)=>({
                    settings: {
                        ...state.settings,
                        lastSyncAt: timestamp
                    }
                })),
        setLastSyncResult: (result)=>set((state)=>({
                    settings: {
                        ...state.settings,
                        lastSyncResult: result
                    }
                })),
        setConnectionStatus: (status, error)=>set((state)=>({
                    settings: {
                        ...state.settings,
                        connectionStatus: status,
                        connectionError: error
                    }
                })),
        // === Utility Actions ===
        loadDefaultData: ()=>set((state)=>({
                    settings: {
                        ...state.settings,
                        categories: __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$pkgx$2f$constants$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["PKGX_CATEGORIES"],
                        brands: __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$pkgx$2f$constants$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["PKGX_BRANDS"]
                    }
                })),
        resetSettings: ()=>set({
                settings: {
                    ...__TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$pkgx$2f$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DEFAULT_PKGX_SETTINGS"],
                    categories: __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$pkgx$2f$constants$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["PKGX_CATEGORIES"],
                    brands: __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$pkgx$2f$constants$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["PKGX_BRANDS"]
                }
            }),
        setLoading: (isLoading)=>set({
                isLoading
            }),
        setSaving: (isSaving)=>set({
                isSaving
            }),
        // === Getters ===
        getCategoryById: (id)=>get().settings.categories.find((c)=>c.id === id),
        getBrandById: (id)=>get().settings.brands.find((b)=>b.id === id),
        getCategoryMappingByHrmId: (hrmCategoryId)=>get().settings.categoryMappings.find((m)=>m.hrmCategorySystemId === hrmCategoryId),
        getBrandMappingByHrmId: (hrmBrandId)=>get().settings.brandMappings.find((m)=>m.hrmBrandSystemId === hrmBrandId),
        getPkgxCatIdByHrmCategory: (hrmCategoryId)=>{
            const mapping = get().settings.categoryMappings.find((m)=>m.hrmCategorySystemId === hrmCategoryId);
            return mapping?.pkgxCatId ?? null;
        },
        getPkgxBrandIdByHrmBrand: (hrmBrandId)=>{
            const mapping = get().settings.brandMappings.find((m)=>m.hrmBrandSystemId === hrmBrandId);
            return mapping?.pkgxBrandId ?? null;
        },
        loadFromAPI: async ()=>{
            if (get().initialized) return;
            try {
                const response = await fetch('/api/settings/pkgx', {
                    credentials: 'include'
                });
                if (response.ok) {
                    const json = await response.json();
                    const data = json.data || json.settings;
                    if (data) {
                        set({
                            settings: {
                                ...__TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$pkgx$2f$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DEFAULT_PKGX_SETTINGS"],
                                categories: __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$pkgx$2f$constants$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["PKGX_CATEGORIES"],
                                brands: __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$pkgx$2f$constants$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["PKGX_BRANDS"],
                                ...data
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
                console.error('[PKGX Settings Store] loadFromAPI error:', error);
            }
        }
    }));
function usePkgxEnabled() {
    return usePkgxSettingsStore((state)=>state.settings.enabled);
}
function usePkgxApiConfig() {
    return usePkgxSettingsStore((state)=>({
            apiUrl: state.settings.apiUrl,
            apiKey: state.settings.apiKey,
            enabled: state.settings.enabled
        }));
}
function usePkgxCategories() {
    return usePkgxSettingsStore((state)=>state.settings.categories);
}
function usePkgxBrands() {
    return usePkgxSettingsStore((state)=>state.settings.brands);
}
function usePkgxPriceMapping() {
    return usePkgxSettingsStore((state)=>state.settings.priceMapping);
}
function usePkgxCategoryMappings() {
    return usePkgxSettingsStore((state)=>state.settings.categoryMappings);
}
function usePkgxBrandMappings() {
    return usePkgxSettingsStore((state)=>state.settings.brandMappings);
}
function usePkgxSyncSettings() {
    return usePkgxSettingsStore((state)=>state.settings.syncSettings);
}
function usePkgxSyncStatus() {
    return usePkgxSettingsStore((state)=>({
            lastSyncAt: state.settings.lastSyncAt,
            lastSyncResult: state.settings.lastSyncResult,
            connectionStatus: state.settings.connectionStatus,
            connectionError: state.settings.connectionError
        }));
}
function usePkgxProducts() {
    return usePkgxSettingsStore((state)=>({
            products: state.settings.pkgxProducts,
            lastFetch: state.settings.pkgxProductsLastFetch
        }));
}
}),
"[project]/features/settings/pricing/store.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "usePricingPolicyStore",
    ()=>usePricingPolicyStore
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2d$factory$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/store-factory.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$contexts$2f$auth$2d$context$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/contexts/auth-context.tsx [app-ssr] (ecmascript)");
;
;
const baseStore = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2d$factory$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createCrudStore"])([], 'pricing-settings', {
    businessIdField: 'id',
    getCurrentUser: __TURBOPACK__imported__module__$5b$project$5d2f$contexts$2f$auth$2d$context$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getCurrentUserSystemId"],
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
}),
"[project]/features/settings/branches/store.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useBranchStore",
    ()=>useBranchStore
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2d$factory$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/store-factory.ts [app-ssr] (ecmascript)");
;
const baseStore = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2d$factory$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createCrudStore"])([], 'branches', {
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
];

//# sourceMappingURL=features_settings_5ae8ab84._.js.map