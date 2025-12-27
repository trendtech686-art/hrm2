module.exports = [
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
"[project]/features/settings/pkgx/validation/category-mapping-validation.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "CATEGORY_MAPPING_ERROR_CODES",
    ()=>CATEGORY_MAPPING_ERROR_CODES,
    "CATEGORY_MAPPING_ERROR_MESSAGES",
    ()=>CATEGORY_MAPPING_ERROR_MESSAGES,
    "CATEGORY_MAPPING_WARNING_CODES",
    ()=>CATEGORY_MAPPING_WARNING_CODES,
    "CATEGORY_MAPPING_WARNING_MESSAGES",
    ()=>CATEGORY_MAPPING_WARNING_MESSAGES,
    "checkWarnings",
    ()=>checkWarnings,
    "findPotentialDuplicates",
    ()=>findPotentialDuplicates,
    "suggestMatchingCategories",
    ()=>suggestMatchingCategories,
    "validateBatchMappings",
    ()=>validateBatchMappings,
    "validateCategoryExists",
    ()=>validateCategoryExists,
    "validateCategoryMapping",
    ()=>validateCategoryMapping,
    "validateDuplicateMappings",
    ()=>validateDuplicateMappings,
    "validateRequiredFields",
    ()=>validateRequiredFields
]);
const CATEGORY_MAPPING_ERROR_CODES = {
    // Required field errors
    HRM_CATEGORY_REQUIRED: 'HRM_CATEGORY_REQUIRED',
    PKGX_CATEGORY_REQUIRED: 'PKGX_CATEGORY_REQUIRED',
    // Duplicate/conflict errors
    HRM_CATEGORY_ALREADY_MAPPED: 'HRM_CATEGORY_ALREADY_MAPPED',
    PKGX_CATEGORY_ALREADY_MAPPED: 'PKGX_CATEGORY_ALREADY_MAPPED',
    // Not found errors
    HRM_CATEGORY_NOT_FOUND: 'HRM_CATEGORY_NOT_FOUND',
    PKGX_CATEGORY_NOT_FOUND: 'PKGX_CATEGORY_NOT_FOUND',
    // Inactive/deleted errors
    HRM_CATEGORY_INACTIVE: 'HRM_CATEGORY_INACTIVE',
    PKGX_CATEGORY_INACTIVE: 'PKGX_CATEGORY_INACTIVE',
    // Structure errors
    MAPPING_TO_PARENT_CATEGORY: 'MAPPING_TO_PARENT_CATEGORY',
    HIERARCHY_MISMATCH: 'HIERARCHY_MISMATCH'
};
const CATEGORY_MAPPING_WARNING_CODES = {
    // Suggestions
    SAME_NAME_AVAILABLE: 'SAME_NAME_AVAILABLE',
    PARENT_NOT_MAPPED: 'PARENT_NOT_MAPPED',
    CHILD_ALREADY_MAPPED: 'CHILD_ALREADY_MAPPED',
    NAME_MISMATCH: 'NAME_MISMATCH',
    MANY_TO_ONE_MAPPING: 'MANY_TO_ONE_MAPPING'
};
const CATEGORY_MAPPING_ERROR_MESSAGES = {
    [CATEGORY_MAPPING_ERROR_CODES.HRM_CATEGORY_REQUIRED]: 'Vui lòng chọn danh mục HRM',
    [CATEGORY_MAPPING_ERROR_CODES.PKGX_CATEGORY_REQUIRED]: 'Vui lòng chọn danh mục PKGX',
    [CATEGORY_MAPPING_ERROR_CODES.HRM_CATEGORY_ALREADY_MAPPED]: 'Danh mục HRM này đã được mapping với danh mục PKGX khác',
    [CATEGORY_MAPPING_ERROR_CODES.PKGX_CATEGORY_ALREADY_MAPPED]: 'Danh mục PKGX này đã được mapping với danh mục HRM khác',
    [CATEGORY_MAPPING_ERROR_CODES.HRM_CATEGORY_NOT_FOUND]: 'Không tìm thấy danh mục HRM trong hệ thống',
    [CATEGORY_MAPPING_ERROR_CODES.PKGX_CATEGORY_NOT_FOUND]: 'Không tìm thấy danh mục PKGX (có thể đã bị xóa trên PKGX)',
    [CATEGORY_MAPPING_ERROR_CODES.HRM_CATEGORY_INACTIVE]: 'Danh mục HRM đã bị vô hiệu hóa hoặc xóa',
    [CATEGORY_MAPPING_ERROR_CODES.PKGX_CATEGORY_INACTIVE]: 'Danh mục PKGX không hoạt động',
    [CATEGORY_MAPPING_ERROR_CODES.MAPPING_TO_PARENT_CATEGORY]: 'Không nên mapping với danh mục cha. Hãy chọn danh mục con cụ thể',
    [CATEGORY_MAPPING_ERROR_CODES.HIERARCHY_MISMATCH]: 'Cấp danh mục không khớp (cha/con)'
};
const CATEGORY_MAPPING_WARNING_MESSAGES = {
    [CATEGORY_MAPPING_WARNING_CODES.SAME_NAME_AVAILABLE]: 'Có danh mục PKGX trùng tên, có thể bạn muốn chọn danh mục đó',
    [CATEGORY_MAPPING_WARNING_CODES.PARENT_NOT_MAPPED]: 'Danh mục cha chưa được mapping. Nên mapping danh mục cha trước',
    [CATEGORY_MAPPING_WARNING_CODES.CHILD_ALREADY_MAPPED]: 'Đã có danh mục con được mapping. Kiểm tra lại cấu trúc',
    [CATEGORY_MAPPING_WARNING_CODES.NAME_MISMATCH]: 'Tên danh mục HRM và PKGX khác nhau đáng kể',
    [CATEGORY_MAPPING_WARNING_CODES.MANY_TO_ONE_MAPPING]: 'Nhiều danh mục HRM đang mapping tới cùng một danh mục PKGX'
};
function validateRequiredFields(input) {
    const errors = [];
    if (!input.hrmCategorySystemId) {
        errors.push({
            code: CATEGORY_MAPPING_ERROR_CODES.HRM_CATEGORY_REQUIRED,
            field: 'hrmCategorySystemId',
            message: CATEGORY_MAPPING_ERROR_MESSAGES[CATEGORY_MAPPING_ERROR_CODES.HRM_CATEGORY_REQUIRED]
        });
    }
    if (!input.pkgxCatId) {
        errors.push({
            code: CATEGORY_MAPPING_ERROR_CODES.PKGX_CATEGORY_REQUIRED,
            field: 'pkgxCatId',
            message: CATEGORY_MAPPING_ERROR_MESSAGES[CATEGORY_MAPPING_ERROR_CODES.PKGX_CATEGORY_REQUIRED]
        });
    }
    return errors;
}
function validateCategoryExists(input, context) {
    const errors = [];
    if (input.hrmCategorySystemId) {
        const hrmCat = context.hrmCategories.find((c)=>c.systemId === input.hrmCategorySystemId);
        if (!hrmCat) {
            errors.push({
                code: CATEGORY_MAPPING_ERROR_CODES.HRM_CATEGORY_NOT_FOUND,
                field: 'hrmCategorySystemId',
                message: CATEGORY_MAPPING_ERROR_MESSAGES[CATEGORY_MAPPING_ERROR_CODES.HRM_CATEGORY_NOT_FOUND],
                details: {
                    systemId: input.hrmCategorySystemId
                }
            });
        } else if (hrmCat.status === 'inactive' || hrmCat.isActive === false) {
            errors.push({
                code: CATEGORY_MAPPING_ERROR_CODES.HRM_CATEGORY_INACTIVE,
                field: 'hrmCategorySystemId',
                message: CATEGORY_MAPPING_ERROR_MESSAGES[CATEGORY_MAPPING_ERROR_CODES.HRM_CATEGORY_INACTIVE],
                details: {
                    systemId: input.hrmCategorySystemId,
                    name: hrmCat.name
                }
            });
        }
    }
    if (input.pkgxCatId) {
        const pkgxCat = context.pkgxCategories.find((c)=>c.id === input.pkgxCatId);
        if (!pkgxCat) {
            errors.push({
                code: CATEGORY_MAPPING_ERROR_CODES.PKGX_CATEGORY_NOT_FOUND,
                field: 'pkgxCatId',
                message: CATEGORY_MAPPING_ERROR_MESSAGES[CATEGORY_MAPPING_ERROR_CODES.PKGX_CATEGORY_NOT_FOUND],
                details: {
                    pkgxCatId: input.pkgxCatId
                }
            });
        }
    }
    return errors;
}
function validateDuplicateMappings(input, context) {
    const errors = [];
    if (input.hrmCategorySystemId) {
        const existingHrmMapping = context.existingMappings.find((m)=>m.hrmCategorySystemId === input.hrmCategorySystemId && m.id !== context.editingMappingId);
        if (existingHrmMapping) {
            errors.push({
                code: CATEGORY_MAPPING_ERROR_CODES.HRM_CATEGORY_ALREADY_MAPPED,
                field: 'hrmCategorySystemId',
                message: CATEGORY_MAPPING_ERROR_MESSAGES[CATEGORY_MAPPING_ERROR_CODES.HRM_CATEGORY_ALREADY_MAPPED],
                details: {
                    existingMapping: existingHrmMapping,
                    mappedTo: existingHrmMapping.pkgxCatName
                }
            });
        }
    }
    // Note: PKGX category có thể mapping với nhiều HRM category (one-to-many)
    // Nhưng vẫn cảnh báo nếu đã có mapping khác
    return errors;
}
function checkWarnings(input, context) {
    const warnings = [];
    if (!input.hrmCategorySystemId || !input.pkgxCatId) {
        return warnings;
    }
    const hrmCat = context.hrmCategories.find((c)=>c.systemId === input.hrmCategorySystemId);
    const pkgxCat = context.pkgxCategories.find((c)=>c.id === input.pkgxCatId);
    if (!hrmCat || !pkgxCat) return warnings;
    // 1. Check name mismatch
    const normalizedHrmName = normalizeString(hrmCat.name);
    const normalizedPkgxName = normalizeString(pkgxCat.name);
    const similarity = calculateSimilarity(normalizedHrmName, normalizedPkgxName);
    if (similarity < 0.5) {
        warnings.push({
            code: CATEGORY_MAPPING_WARNING_CODES.NAME_MISMATCH,
            message: CATEGORY_MAPPING_WARNING_MESSAGES[CATEGORY_MAPPING_WARNING_CODES.NAME_MISMATCH],
            details: {
                hrmName: hrmCat.name,
                pkgxName: pkgxCat.name,
                similarity: Math.round(similarity * 100) + '%'
            }
        });
    }
    // 2. Check if same name exists in PKGX
    const sameNamePkgx = context.pkgxCategories.find((c)=>c.id !== input.pkgxCatId && normalizeString(c.name) === normalizedHrmName);
    if (sameNamePkgx) {
        warnings.push({
            code: CATEGORY_MAPPING_WARNING_CODES.SAME_NAME_AVAILABLE,
            message: CATEGORY_MAPPING_WARNING_MESSAGES[CATEGORY_MAPPING_WARNING_CODES.SAME_NAME_AVAILABLE],
            details: {
                suggestedCategory: sameNamePkgx
            }
        });
    }
    // 3. Check if parent category is not mapped (for HRM categories with parent)
    if (hrmCat.parentId) {
        const parentMapping = context.existingMappings.find((m)=>m.hrmCategorySystemId === hrmCat.parentId);
        if (!parentMapping) {
            const parentCat = context.hrmCategories.find((c)=>c.systemId === hrmCat.parentId);
            if (parentCat) {
                warnings.push({
                    code: CATEGORY_MAPPING_WARNING_CODES.PARENT_NOT_MAPPED,
                    message: CATEGORY_MAPPING_WARNING_MESSAGES[CATEGORY_MAPPING_WARNING_CODES.PARENT_NOT_MAPPED],
                    details: {
                        parentName: parentCat.name,
                        parentId: hrmCat.parentId
                    }
                });
            }
        }
    }
    // 4. Check many-to-one mapping
    const otherMappingsToSamePkgx = context.existingMappings.filter((m)=>m.pkgxCatId === input.pkgxCatId && m.id !== context.editingMappingId);
    if (otherMappingsToSamePkgx.length > 0) {
        warnings.push({
            code: CATEGORY_MAPPING_WARNING_CODES.MANY_TO_ONE_MAPPING,
            message: CATEGORY_MAPPING_WARNING_MESSAGES[CATEGORY_MAPPING_WARNING_CODES.MANY_TO_ONE_MAPPING],
            details: {
                count: otherMappingsToSamePkgx.length + 1,
                existingMappings: otherMappingsToSamePkgx.map((m)=>m.hrmCategoryName)
            }
        });
    }
    // 5. Check if mapping to parent category when children exist
    const pkgxChildren = context.pkgxCategories.filter((c)=>c.parentId === pkgxCat.id);
    if (pkgxChildren.length > 0) {
        warnings.push({
            code: CATEGORY_MAPPING_WARNING_CODES.CHILD_ALREADY_MAPPED,
            message: 'Danh mục PKGX này có danh mục con. Cân nhắc mapping với danh mục con cụ thể',
            details: {
                childCount: pkgxChildren.length,
                children: pkgxChildren.slice(0, 5).map((c)=>c.name)
            }
        });
    }
    return warnings;
}
function validateCategoryMapping(input, context) {
    const errors = [];
    const warnings = [];
    // 1. Required fields
    errors.push(...validateRequiredFields(input));
    // If required fields are missing, stop here
    if (errors.length > 0) {
        return {
            isValid: false,
            errors,
            warnings
        };
    }
    // 2. Category exists
    errors.push(...validateCategoryExists(input, context));
    // 3. Duplicate mappings
    errors.push(...validateDuplicateMappings(input, context));
    // 4. Warnings (non-blocking)
    warnings.push(...checkWarnings(input, context));
    return {
        isValid: errors.length === 0,
        errors,
        warnings
    };
}
// ========================================
// Utility Functions
// ========================================
/**
 * Normalize string for comparison
 */ function normalizeString(str) {
    return str.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '') // Remove diacritics
    .replace(/đ/g, 'd').replace(/[^a-z0-9\s]/g, '').trim();
}
/**
 * Calculate string similarity (Jaccard index)
 */ function calculateSimilarity(str1, str2) {
    const words1 = new Set(str1.split(/\s+/).filter((w)=>w.length > 0));
    const words2 = new Set(str2.split(/\s+/).filter((w)=>w.length > 0));
    if (words1.size === 0 && words2.size === 0) return 1;
    if (words1.size === 0 || words2.size === 0) return 0;
    const intersection = new Set([
        ...words1
    ].filter((x)=>words2.has(x)));
    const union = new Set([
        ...words1,
        ...words2
    ]);
    return intersection.size / union.size;
}
function suggestMatchingCategories(hrmCategoryName, pkgxCategories, limit = 5) {
    const normalizedInput = normalizeString(hrmCategoryName);
    const scored = pkgxCategories.map((cat)=>({
            category: cat,
            score: calculateSimilarity(normalizedInput, normalizeString(cat.name))
        }));
    return scored.filter((s)=>s.score > 0.2).sort((a, b)=>b.score - a.score).slice(0, limit);
}
function findPotentialDuplicates(mappings) {
    const grouped = new Map();
    for (const mapping of mappings){
        const existing = grouped.get(mapping.pkgxCatId) || [];
        existing.push(mapping);
        grouped.set(mapping.pkgxCatId, existing);
    }
    return Array.from(grouped.entries()).filter(([, mappings])=>mappings.length > 1).map(([pkgxCatId, mappings])=>({
            pkgxCatId,
            mappings
        }));
}
function validateBatchMappings(inputs, context) {
    const valid = [];
    const invalid = [];
    const withWarnings = [];
    // Check for duplicates within the batch itself
    const hrmIdsSeen = new Set();
    for (const input of inputs){
        // Check batch internal duplicates
        if (input.hrmCategorySystemId && hrmIdsSeen.has(input.hrmCategorySystemId)) {
            invalid.push({
                input,
                errors: [
                    {
                        code: CATEGORY_MAPPING_ERROR_CODES.HRM_CATEGORY_ALREADY_MAPPED,
                        field: 'hrmCategorySystemId',
                        message: 'Danh mục HRM này xuất hiện nhiều lần trong danh sách import'
                    }
                ]
            });
            continue;
        }
        if (input.hrmCategorySystemId) {
            hrmIdsSeen.add(input.hrmCategorySystemId);
        }
        const result = validateCategoryMapping(input, context);
        if (!result.isValid) {
            invalid.push({
                input,
                errors: result.errors
            });
        } else {
            valid.push(input);
            if (result.warnings.length > 0) {
                withWarnings.push({
                    input,
                    warnings: result.warnings
                });
            }
        }
    }
    return {
        valid,
        invalid,
        withWarnings,
        summary: {
            total: inputs.length,
            validCount: valid.length,
            invalidCount: invalid.length,
            warningCount: withWarnings.length
        }
    };
}
}),
"[project]/features/settings/pkgx/validation/brand-mapping-validation.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "BRAND_MAPPING_ERROR_CODES",
    ()=>BRAND_MAPPING_ERROR_CODES,
    "BRAND_MAPPING_ERROR_MESSAGES",
    ()=>BRAND_MAPPING_ERROR_MESSAGES,
    "BRAND_MAPPING_WARNING_CODES",
    ()=>BRAND_MAPPING_WARNING_CODES,
    "BRAND_MAPPING_WARNING_MESSAGES",
    ()=>BRAND_MAPPING_WARNING_MESSAGES,
    "checkWarnings",
    ()=>checkWarnings,
    "suggestMatchingBrands",
    ()=>suggestMatchingBrands,
    "validateBrandExists",
    ()=>validateBrandExists,
    "validateBrandMapping",
    ()=>validateBrandMapping,
    "validateDuplicateMappings",
    ()=>validateDuplicateMappings,
    "validateRequiredFields",
    ()=>validateRequiredFields
]);
const BRAND_MAPPING_ERROR_CODES = {
    // Required field errors
    HRM_BRAND_REQUIRED: 'HRM_BRAND_REQUIRED',
    PKGX_BRAND_REQUIRED: 'PKGX_BRAND_REQUIRED',
    // Duplicate/conflict errors
    HRM_BRAND_ALREADY_MAPPED: 'HRM_BRAND_ALREADY_MAPPED',
    PKGX_BRAND_ALREADY_MAPPED: 'PKGX_BRAND_ALREADY_MAPPED',
    // Not found errors
    HRM_BRAND_NOT_FOUND: 'HRM_BRAND_NOT_FOUND',
    PKGX_BRAND_NOT_FOUND: 'PKGX_BRAND_NOT_FOUND',
    // Inactive/deleted errors
    HRM_BRAND_INACTIVE: 'HRM_BRAND_INACTIVE'
};
const BRAND_MAPPING_WARNING_CODES = {
    // Suggestions
    SAME_NAME_AVAILABLE: 'SAME_NAME_AVAILABLE',
    NAME_MISMATCH: 'NAME_MISMATCH',
    MANY_TO_ONE_MAPPING: 'MANY_TO_ONE_MAPPING'
};
const BRAND_MAPPING_ERROR_MESSAGES = {
    [BRAND_MAPPING_ERROR_CODES.HRM_BRAND_REQUIRED]: 'Vui lòng chọn thương hiệu HRM',
    [BRAND_MAPPING_ERROR_CODES.PKGX_BRAND_REQUIRED]: 'Vui lòng chọn thương hiệu PKGX',
    [BRAND_MAPPING_ERROR_CODES.HRM_BRAND_ALREADY_MAPPED]: 'Thương hiệu HRM này đã được mapping với thương hiệu PKGX khác',
    [BRAND_MAPPING_ERROR_CODES.PKGX_BRAND_ALREADY_MAPPED]: 'Thương hiệu PKGX này đã được mapping với thương hiệu HRM khác',
    [BRAND_MAPPING_ERROR_CODES.HRM_BRAND_NOT_FOUND]: 'Không tìm thấy thương hiệu HRM trong hệ thống',
    [BRAND_MAPPING_ERROR_CODES.PKGX_BRAND_NOT_FOUND]: 'Không tìm thấy thương hiệu PKGX (có thể đã bị xóa trên PKGX)',
    [BRAND_MAPPING_ERROR_CODES.HRM_BRAND_INACTIVE]: 'Thương hiệu HRM đã bị vô hiệu hóa hoặc xóa'
};
const BRAND_MAPPING_WARNING_MESSAGES = {
    [BRAND_MAPPING_WARNING_CODES.SAME_NAME_AVAILABLE]: 'Có thương hiệu PKGX trùng tên, có thể bạn muốn chọn thương hiệu đó',
    [BRAND_MAPPING_WARNING_CODES.NAME_MISMATCH]: 'Tên thương hiệu HRM và PKGX khác nhau đáng kể',
    [BRAND_MAPPING_WARNING_CODES.MANY_TO_ONE_MAPPING]: 'Nhiều thương hiệu HRM đang mapping tới cùng một thương hiệu PKGX'
};
function validateRequiredFields(input) {
    const errors = [];
    if (!input.hrmBrandSystemId) {
        errors.push({
            code: BRAND_MAPPING_ERROR_CODES.HRM_BRAND_REQUIRED,
            field: 'hrmBrandSystemId',
            message: BRAND_MAPPING_ERROR_MESSAGES[BRAND_MAPPING_ERROR_CODES.HRM_BRAND_REQUIRED]
        });
    }
    if (!input.pkgxBrandId) {
        errors.push({
            code: BRAND_MAPPING_ERROR_CODES.PKGX_BRAND_REQUIRED,
            field: 'pkgxBrandId',
            message: BRAND_MAPPING_ERROR_MESSAGES[BRAND_MAPPING_ERROR_CODES.PKGX_BRAND_REQUIRED]
        });
    }
    return errors;
}
function validateBrandExists(input, context) {
    const errors = [];
    if (input.hrmBrandSystemId) {
        const hrmBrand = context.hrmBrands.find((b)=>b.systemId === input.hrmBrandSystemId);
        if (!hrmBrand) {
            errors.push({
                code: BRAND_MAPPING_ERROR_CODES.HRM_BRAND_NOT_FOUND,
                field: 'hrmBrandSystemId',
                message: BRAND_MAPPING_ERROR_MESSAGES[BRAND_MAPPING_ERROR_CODES.HRM_BRAND_NOT_FOUND],
                details: {
                    systemId: input.hrmBrandSystemId
                }
            });
        } else if (hrmBrand.status === 'inactive' || hrmBrand.isActive === false) {
            errors.push({
                code: BRAND_MAPPING_ERROR_CODES.HRM_BRAND_INACTIVE,
                field: 'hrmBrandSystemId',
                message: BRAND_MAPPING_ERROR_MESSAGES[BRAND_MAPPING_ERROR_CODES.HRM_BRAND_INACTIVE],
                details: {
                    systemId: input.hrmBrandSystemId,
                    name: hrmBrand.name
                }
            });
        }
    }
    if (input.pkgxBrandId) {
        const pkgxBrand = context.pkgxBrands.find((b)=>b.id === input.pkgxBrandId);
        if (!pkgxBrand) {
            errors.push({
                code: BRAND_MAPPING_ERROR_CODES.PKGX_BRAND_NOT_FOUND,
                field: 'pkgxBrandId',
                message: BRAND_MAPPING_ERROR_MESSAGES[BRAND_MAPPING_ERROR_CODES.PKGX_BRAND_NOT_FOUND],
                details: {
                    pkgxBrandId: input.pkgxBrandId
                }
            });
        }
    }
    return errors;
}
function validateDuplicateMappings(input, context) {
    const errors = [];
    if (input.hrmBrandSystemId) {
        const existingHrmMapping = context.existingMappings.find((m)=>m.hrmBrandSystemId === input.hrmBrandSystemId && m.id !== context.editingMappingId);
        if (existingHrmMapping) {
            errors.push({
                code: BRAND_MAPPING_ERROR_CODES.HRM_BRAND_ALREADY_MAPPED,
                field: 'hrmBrandSystemId',
                message: BRAND_MAPPING_ERROR_MESSAGES[BRAND_MAPPING_ERROR_CODES.HRM_BRAND_ALREADY_MAPPED],
                details: {
                    existingMapping: existingHrmMapping,
                    mappedTo: existingHrmMapping.pkgxBrandName
                }
            });
        }
    }
    return errors;
}
function checkWarnings(input, context) {
    const warnings = [];
    if (!input.hrmBrandSystemId || !input.pkgxBrandId) {
        return warnings;
    }
    const hrmBrand = context.hrmBrands.find((b)=>b.systemId === input.hrmBrandSystemId);
    const pkgxBrand = context.pkgxBrands.find((b)=>b.id === input.pkgxBrandId);
    if (!hrmBrand || !pkgxBrand) return warnings;
    // 1. Check name mismatch
    const normalizedHrmName = normalizeString(hrmBrand.name);
    const normalizedPkgxName = normalizeString(pkgxBrand.name);
    const similarity = calculateSimilarity(normalizedHrmName, normalizedPkgxName);
    if (similarity < 0.5) {
        warnings.push({
            code: BRAND_MAPPING_WARNING_CODES.NAME_MISMATCH,
            message: BRAND_MAPPING_WARNING_MESSAGES[BRAND_MAPPING_WARNING_CODES.NAME_MISMATCH],
            details: {
                hrmName: hrmBrand.name,
                pkgxName: pkgxBrand.name,
                similarity: Math.round(similarity * 100) + '%'
            }
        });
    }
    // 2. Check if same name exists in PKGX
    const sameNamePkgx = context.pkgxBrands.find((b)=>b.id !== input.pkgxBrandId && normalizeString(b.name) === normalizedHrmName);
    if (sameNamePkgx) {
        warnings.push({
            code: BRAND_MAPPING_WARNING_CODES.SAME_NAME_AVAILABLE,
            message: BRAND_MAPPING_WARNING_MESSAGES[BRAND_MAPPING_WARNING_CODES.SAME_NAME_AVAILABLE],
            details: {
                suggestedBrand: sameNamePkgx
            }
        });
    }
    // 3. Check many-to-one mapping
    const otherMappingsToSamePkgx = context.existingMappings.filter((m)=>m.pkgxBrandId === input.pkgxBrandId && m.id !== context.editingMappingId);
    if (otherMappingsToSamePkgx.length > 0) {
        warnings.push({
            code: BRAND_MAPPING_WARNING_CODES.MANY_TO_ONE_MAPPING,
            message: BRAND_MAPPING_WARNING_MESSAGES[BRAND_MAPPING_WARNING_CODES.MANY_TO_ONE_MAPPING],
            details: {
                count: otherMappingsToSamePkgx.length + 1,
                existingMappings: otherMappingsToSamePkgx.map((m)=>m.hrmBrandName)
            }
        });
    }
    return warnings;
}
function validateBrandMapping(input, context) {
    const errors = [];
    const warnings = [];
    // 1. Required fields
    errors.push(...validateRequiredFields(input));
    // If required fields are missing, stop here
    if (errors.length > 0) {
        return {
            isValid: false,
            errors,
            warnings
        };
    }
    // 2. Brand exists
    errors.push(...validateBrandExists(input, context));
    // 3. Duplicate mappings
    errors.push(...validateDuplicateMappings(input, context));
    // 4. Warnings (non-blocking)
    warnings.push(...checkWarnings(input, context));
    return {
        isValid: errors.length === 0,
        errors,
        warnings
    };
}
// ========================================
// Utility Functions
// ========================================
/**
 * Normalize string for comparison
 */ function normalizeString(str) {
    return str.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd').replace(/[^a-z0-9\s]/g, '').trim();
}
/**
 * Calculate string similarity (Jaccard index)
 */ function calculateSimilarity(str1, str2) {
    const words1 = new Set(str1.split(/\s+/).filter((w)=>w.length > 0));
    const words2 = new Set(str2.split(/\s+/).filter((w)=>w.length > 0));
    if (words1.size === 0 && words2.size === 0) return 1;
    if (words1.size === 0 || words2.size === 0) return 0;
    const intersection = new Set([
        ...words1
    ].filter((x)=>words2.has(x)));
    const union = new Set([
        ...words1,
        ...words2
    ]);
    return intersection.size / union.size;
}
function suggestMatchingBrands(hrmBrandName, pkgxBrands, limit = 5) {
    const normalizedInput = normalizeString(hrmBrandName);
    const scored = pkgxBrands.map((brand)=>({
            brand,
            score: calculateSimilarity(normalizedInput, normalizeString(brand.name))
        }));
    return scored.filter((s)=>s.score > 0.2).sort((a, b)=>b.score - a.score).slice(0, limit);
}
}),
"[project]/features/settings/pkgx/validation/product-mapping-validation.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "PRODUCT_MAPPING_ERROR_CODES",
    ()=>PRODUCT_MAPPING_ERROR_CODES,
    "PRODUCT_MAPPING_ERROR_MESSAGES",
    ()=>PRODUCT_MAPPING_ERROR_MESSAGES,
    "PRODUCT_MAPPING_WARNING_CODES",
    ()=>PRODUCT_MAPPING_WARNING_CODES,
    "PRODUCT_MAPPING_WARNING_MESSAGES",
    ()=>PRODUCT_MAPPING_WARNING_MESSAGES,
    "checkWarnings",
    ()=>checkWarnings,
    "suggestMatchingProducts",
    ()=>suggestMatchingProducts,
    "validateDuplicateLinks",
    ()=>validateDuplicateLinks,
    "validateProductExists",
    ()=>validateProductExists,
    "validateProductMapping",
    ()=>validateProductMapping,
    "validateRequiredFields",
    ()=>validateRequiredFields
]);
const PRODUCT_MAPPING_ERROR_CODES = {
    // Required field errors
    HRM_PRODUCT_REQUIRED: 'HRM_PRODUCT_REQUIRED',
    PKGX_PRODUCT_REQUIRED: 'PKGX_PRODUCT_REQUIRED',
    // Duplicate/conflict errors
    HRM_PRODUCT_ALREADY_LINKED: 'HRM_PRODUCT_ALREADY_LINKED',
    PKGX_PRODUCT_ALREADY_LINKED: 'PKGX_PRODUCT_ALREADY_LINKED',
    // Not found errors
    HRM_PRODUCT_NOT_FOUND: 'HRM_PRODUCT_NOT_FOUND',
    PKGX_PRODUCT_NOT_FOUND: 'PKGX_PRODUCT_NOT_FOUND',
    // Inactive/deleted errors
    HRM_PRODUCT_INACTIVE: 'HRM_PRODUCT_INACTIVE'
};
const PRODUCT_MAPPING_WARNING_CODES = {
    // Suggestions
    SKU_MATCH_AVAILABLE: 'SKU_MATCH_AVAILABLE',
    NAME_MISMATCH: 'NAME_MISMATCH',
    SKU_MISMATCH: 'SKU_MISMATCH'
};
const PRODUCT_MAPPING_ERROR_MESSAGES = {
    [PRODUCT_MAPPING_ERROR_CODES.HRM_PRODUCT_REQUIRED]: 'Vui lòng chọn sản phẩm HRM',
    [PRODUCT_MAPPING_ERROR_CODES.PKGX_PRODUCT_REQUIRED]: 'Vui lòng chọn sản phẩm PKGX',
    [PRODUCT_MAPPING_ERROR_CODES.HRM_PRODUCT_ALREADY_LINKED]: 'Sản phẩm HRM này đã được liên kết với sản phẩm PKGX khác',
    [PRODUCT_MAPPING_ERROR_CODES.PKGX_PRODUCT_ALREADY_LINKED]: 'Sản phẩm PKGX này đã được liên kết với sản phẩm HRM khác',
    [PRODUCT_MAPPING_ERROR_CODES.HRM_PRODUCT_NOT_FOUND]: 'Không tìm thấy sản phẩm HRM trong hệ thống',
    [PRODUCT_MAPPING_ERROR_CODES.PKGX_PRODUCT_NOT_FOUND]: 'Không tìm thấy sản phẩm PKGX (có thể đã bị xóa trên PKGX)',
    [PRODUCT_MAPPING_ERROR_CODES.HRM_PRODUCT_INACTIVE]: 'Sản phẩm HRM đã bị vô hiệu hóa hoặc xóa'
};
const PRODUCT_MAPPING_WARNING_MESSAGES = {
    [PRODUCT_MAPPING_WARNING_CODES.SKU_MATCH_AVAILABLE]: 'Có sản phẩm HRM có SKU trùng khớp, có thể bạn muốn chọn sản phẩm đó',
    [PRODUCT_MAPPING_WARNING_CODES.NAME_MISMATCH]: 'Tên sản phẩm HRM và PKGX khác nhau đáng kể',
    [PRODUCT_MAPPING_WARNING_CODES.SKU_MISMATCH]: 'Mã SKU của sản phẩm HRM và PKGX không khớp'
};
function validateRequiredFields(input) {
    const errors = [];
    if (!input.hrmProductSystemId) {
        errors.push({
            code: PRODUCT_MAPPING_ERROR_CODES.HRM_PRODUCT_REQUIRED,
            field: 'hrmProductSystemId',
            message: PRODUCT_MAPPING_ERROR_MESSAGES[PRODUCT_MAPPING_ERROR_CODES.HRM_PRODUCT_REQUIRED]
        });
    }
    if (!input.pkgxProductId) {
        errors.push({
            code: PRODUCT_MAPPING_ERROR_CODES.PKGX_PRODUCT_REQUIRED,
            field: 'pkgxProductId',
            message: PRODUCT_MAPPING_ERROR_MESSAGES[PRODUCT_MAPPING_ERROR_CODES.PKGX_PRODUCT_REQUIRED]
        });
    }
    return errors;
}
function validateProductExists(input, context) {
    const errors = [];
    if (input.hrmProductSystemId) {
        const hrmProduct = context.hrmProducts.find((p)=>p.systemId === input.hrmProductSystemId);
        if (!hrmProduct) {
            errors.push({
                code: PRODUCT_MAPPING_ERROR_CODES.HRM_PRODUCT_NOT_FOUND,
                field: 'hrmProductSystemId',
                message: PRODUCT_MAPPING_ERROR_MESSAGES[PRODUCT_MAPPING_ERROR_CODES.HRM_PRODUCT_NOT_FOUND],
                details: {
                    systemId: input.hrmProductSystemId
                }
            });
        } else if (hrmProduct.status === 'inactive' || hrmProduct.isActive === false) {
            errors.push({
                code: PRODUCT_MAPPING_ERROR_CODES.HRM_PRODUCT_INACTIVE,
                field: 'hrmProductSystemId',
                message: PRODUCT_MAPPING_ERROR_MESSAGES[PRODUCT_MAPPING_ERROR_CODES.HRM_PRODUCT_INACTIVE],
                details: {
                    systemId: input.hrmProductSystemId,
                    name: hrmProduct.name
                }
            });
        }
    }
    if (input.pkgxProductId) {
        const pkgxProduct = context.pkgxProducts.find((p)=>p.goods_id === input.pkgxProductId);
        if (!pkgxProduct) {
            errors.push({
                code: PRODUCT_MAPPING_ERROR_CODES.PKGX_PRODUCT_NOT_FOUND,
                field: 'pkgxProductId',
                message: PRODUCT_MAPPING_ERROR_MESSAGES[PRODUCT_MAPPING_ERROR_CODES.PKGX_PRODUCT_NOT_FOUND],
                details: {
                    pkgxProductId: input.pkgxProductId
                }
            });
        }
    }
    return errors;
}
function validateDuplicateLinks(input, context) {
    const errors = [];
    if (input.hrmProductSystemId) {
        const hrmProduct = context.hrmProducts.find((p)=>p.systemId === input.hrmProductSystemId);
        // Check if HRM product already linked to another PKGX product
        if (hrmProduct?.pkgxId && hrmProduct.pkgxId !== input.pkgxProductId && hrmProduct.systemId !== context.editingProductId) {
            errors.push({
                code: PRODUCT_MAPPING_ERROR_CODES.HRM_PRODUCT_ALREADY_LINKED,
                field: 'hrmProductSystemId',
                message: PRODUCT_MAPPING_ERROR_MESSAGES[PRODUCT_MAPPING_ERROR_CODES.HRM_PRODUCT_ALREADY_LINKED],
                details: {
                    linkedTo: hrmProduct.pkgxId
                }
            });
        }
    }
    if (input.pkgxProductId) {
        // Check if PKGX product already linked to another HRM product
        const linkedHrmProduct = context.hrmProducts.find((p)=>p.pkgxId === input.pkgxProductId && p.systemId !== input.hrmProductSystemId);
        if (linkedHrmProduct) {
            errors.push({
                code: PRODUCT_MAPPING_ERROR_CODES.PKGX_PRODUCT_ALREADY_LINKED,
                field: 'pkgxProductId',
                message: PRODUCT_MAPPING_ERROR_MESSAGES[PRODUCT_MAPPING_ERROR_CODES.PKGX_PRODUCT_ALREADY_LINKED],
                details: {
                    linkedTo: linkedHrmProduct.name,
                    linkedSystemId: linkedHrmProduct.systemId
                }
            });
        }
    }
    return errors;
}
function checkWarnings(input, context) {
    const warnings = [];
    if (!input.hrmProductSystemId || !input.pkgxProductId) {
        return warnings;
    }
    const hrmProduct = context.hrmProducts.find((p)=>p.systemId === input.hrmProductSystemId);
    const pkgxProduct = context.pkgxProducts.find((p)=>p.goods_id === input.pkgxProductId);
    if (!hrmProduct || !pkgxProduct) return warnings;
    // 1. Check name mismatch
    const normalizedHrmName = normalizeString(hrmProduct.name);
    const normalizedPkgxName = normalizeString(pkgxProduct.goods_name);
    const similarity = calculateSimilarity(normalizedHrmName, normalizedPkgxName);
    if (similarity < 0.3) {
        warnings.push({
            code: PRODUCT_MAPPING_WARNING_CODES.NAME_MISMATCH,
            message: PRODUCT_MAPPING_WARNING_MESSAGES[PRODUCT_MAPPING_WARNING_CODES.NAME_MISMATCH],
            details: {
                hrmName: hrmProduct.name,
                pkgxName: pkgxProduct.goods_name,
                similarity: Math.round(similarity * 100) + '%'
            }
        });
    }
    // 2. Check SKU mismatch
    if (hrmProduct.id && pkgxProduct.goods_sn && hrmProduct.id !== pkgxProduct.goods_sn) {
        warnings.push({
            code: PRODUCT_MAPPING_WARNING_CODES.SKU_MISMATCH,
            message: PRODUCT_MAPPING_WARNING_MESSAGES[PRODUCT_MAPPING_WARNING_CODES.SKU_MISMATCH],
            details: {
                hrmSku: hrmProduct.id,
                pkgxSku: pkgxProduct.goods_sn
            }
        });
    }
    return warnings;
}
function validateProductMapping(input, context) {
    const errors = [];
    const warnings = [];
    // 1. Required fields
    errors.push(...validateRequiredFields(input));
    // If required fields are missing, stop here
    if (errors.length > 0) {
        return {
            isValid: false,
            errors,
            warnings
        };
    }
    // 2. Product exists
    errors.push(...validateProductExists(input, context));
    // 3. Duplicate links
    errors.push(...validateDuplicateLinks(input, context));
    // 4. Warnings (non-blocking)
    warnings.push(...checkWarnings(input, context));
    return {
        isValid: errors.length === 0,
        errors,
        warnings
    };
}
// ========================================
// Utility Functions
// ========================================
/**
 * Normalize string for comparison
 */ function normalizeString(str) {
    return str.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd').replace(/[^a-z0-9\s]/g, '').trim();
}
/**
 * Calculate string similarity (Jaccard index)
 */ function calculateSimilarity(str1, str2) {
    const words1 = new Set(str1.split(/\s+/).filter((w)=>w.length > 0));
    const words2 = new Set(str2.split(/\s+/).filter((w)=>w.length > 0));
    if (words1.size === 0 && words2.size === 0) return 1;
    if (words1.size === 0 || words2.size === 0) return 0;
    const intersection = new Set([
        ...words1
    ].filter((x)=>words2.has(x)));
    const union = new Set([
        ...words1,
        ...words2
    ]);
    return intersection.size / union.size;
}
function suggestMatchingProducts(pkgxProduct, hrmProducts, limit = 5) {
    const results = [];
    // Filter out already linked products
    const availableProducts = hrmProducts.filter((p)=>!p.pkgxId);
    // 1. SKU exact match (highest priority)
    if (pkgxProduct.goods_sn) {
        const skuMatch = availableProducts.find((p)=>p.id === pkgxProduct.goods_sn);
        if (skuMatch) {
            results.push({
                product: skuMatch,
                score: 1,
                matchType: 'sku'
            });
        }
    }
    // 2. Name similarity
    const normalizedPkgxName = normalizeString(pkgxProduct.goods_name);
    const scored = availableProducts.filter((p)=>!results.some((r)=>r.product.systemId === p.systemId)).map((product)=>({
            product,
            score: calculateSimilarity(normalizedPkgxName, normalizeString(product.name)),
            matchType: 'name'
        })).filter((s)=>s.score > 0.2);
    results.push(...scored);
    return results.sort((a, b)=>b.score - a.score).slice(0, limit);
}
}),
"[project]/features/settings/pkgx/validation/index.ts [app-ssr] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
// Category Mapping Validation
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$pkgx$2f$validation$2f$category$2d$mapping$2d$validation$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/settings/pkgx/validation/category-mapping-validation.ts [app-ssr] (ecmascript)");
// Brand Mapping Validation
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$pkgx$2f$validation$2f$brand$2d$mapping$2d$validation$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/settings/pkgx/validation/brand-mapping-validation.ts [app-ssr] (ecmascript)");
// Product Mapping Validation
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$pkgx$2f$validation$2f$product$2d$mapping$2d$validation$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/settings/pkgx/validation/product-mapping-validation.ts [app-ssr] (ecmascript)");
;
;
;
}),
"[project]/features/settings/pkgx/hooks/use-category-mapping-validation.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useCategoryMappingValidation",
    ()=>useCategoryMappingValidation,
    "useFieldValidation",
    ()=>useFieldValidation
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$pkgx$2f$validation$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/features/settings/pkgx/validation/index.ts [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$pkgx$2f$validation$2f$category$2d$mapping$2d$validation$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/settings/pkgx/validation/category-mapping-validation.ts [app-ssr] (ecmascript)");
;
;
function useCategoryMappingValidation(options) {
    const { existingMappings, hrmCategories, pkgxCategories, editingMappingId, debounceMs = 300 } = options;
    const [validationResult, setValidationResult] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"](null);
    const [isValidating, setIsValidating] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"](false);
    const [suggestions, setSuggestions] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"]([]);
    const debounceTimerRef = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"](null);
    // Create validation context
    const context = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"](()=>({
            existingMappings,
            hrmCategories,
            pkgxCategories,
            editingMappingId
        }), [
        existingMappings,
        hrmCategories,
        pkgxCategories,
        editingMappingId
    ]);
    // Sync validation
    const validate = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"]((input)=>{
        const result = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$pkgx$2f$validation$2f$category$2d$mapping$2d$validation$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["validateCategoryMapping"])(input, context);
        setValidationResult(result);
        // Update suggestions based on HRM category name
        if (input.hrmCategorySystemId) {
            const hrmCat = hrmCategories.find((c)=>c.systemId === input.hrmCategorySystemId);
            if (hrmCat) {
                const newSuggestions = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$pkgx$2f$validation$2f$category$2d$mapping$2d$validation$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["suggestMatchingCategories"])(hrmCat.name, pkgxCategories);
                setSuggestions(newSuggestions);
            }
        }
        return result;
    }, [
        context,
        hrmCategories,
        pkgxCategories
    ]);
    // Async validation with debounce
    const validateAsync = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"](async (input)=>{
        return new Promise((resolve)=>{
            setIsValidating(true);
            if (debounceTimerRef.current) {
                clearTimeout(debounceTimerRef.current);
            }
            debounceTimerRef.current = setTimeout(()=>{
                const result = validate(input);
                setIsValidating(false);
                resolve(result);
            }, debounceMs);
        });
    }, [
        validate,
        debounceMs
    ]);
    // Clear validation
    const clearValidation = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"](()=>{
        setValidationResult(null);
        setSuggestions([]);
        if (debounceTimerRef.current) {
            clearTimeout(debounceTimerRef.current);
        }
    }, []);
    // Cleanup on unmount
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"](()=>{
        return ()=>{
            if (debounceTimerRef.current) {
                clearTimeout(debounceTimerRef.current);
            }
        };
    }, []);
    // Computed values
    const hasErrors = validationResult ? validationResult.errors.length > 0 : false;
    const hasWarnings = validationResult ? validationResult.warnings.length > 0 : false;
    const getFieldError = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"]((field)=>{
        if (!validationResult) return undefined;
        const error = validationResult.errors.find((e)=>e.field === field);
        return error?.message;
    }, [
        validationResult
    ]);
    const getFieldWarning = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"]((field)=>{
        if (!validationResult) return undefined;
        const warning = validationResult.warnings.find((w)=>w.field === field);
        return warning?.message;
    }, [
        validationResult
    ]);
    return {
        validationResult,
        isValidating,
        suggestions,
        validate,
        validateAsync,
        clearValidation,
        hasErrors,
        hasWarnings,
        getFieldError,
        getFieldWarning
    };
}
function useFieldValidation(validator, initialValue) {
    const [error, setError] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"]();
    const [touched, setTouched] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"](false);
    const validate = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"]((value)=>{
        const errorMessage = validator(value);
        setError(errorMessage);
        return !errorMessage;
    }, [
        validator
    ]);
    const handleBlur = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"](()=>{
        setTouched(true);
    }, []);
    const reset = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"](()=>{
        setError(undefined);
        setTouched(false);
    }, []);
    // Validate initial value
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"](()=>{
        if (initialValue !== undefined) {
            validate(initialValue);
        }
    }, []);
    return {
        error: touched ? error : undefined,
        touched,
        validate,
        handleBlur,
        reset,
        isValid: !error
    };
}
}),
"[project]/features/settings/pkgx/hooks/use-brand-mapping-validation.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useBrandMappingValidation",
    ()=>useBrandMappingValidation
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$pkgx$2f$validation$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/features/settings/pkgx/validation/index.ts [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$pkgx$2f$validation$2f$brand$2d$mapping$2d$validation$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/settings/pkgx/validation/brand-mapping-validation.ts [app-ssr] (ecmascript)");
;
;
function useBrandMappingValidation(options) {
    const { existingMappings, hrmBrands, pkgxBrands, editingMappingId, debounceMs = 300 } = options;
    const [validationResult, setValidationResult] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"](null);
    const [isValidating, setIsValidating] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"](false);
    const [suggestions, setSuggestions] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"]([]);
    const debounceTimerRef = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"](null);
    // Create validation context
    const context = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"](()=>({
            existingMappings,
            hrmBrands,
            pkgxBrands,
            editingMappingId
        }), [
        existingMappings,
        hrmBrands,
        pkgxBrands,
        editingMappingId
    ]);
    // Sync validation
    const validate = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"]((input)=>{
        const result = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$pkgx$2f$validation$2f$brand$2d$mapping$2d$validation$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["validateBrandMapping"])(input, context);
        setValidationResult(result);
        // Update suggestions based on HRM brand name
        if (input.hrmBrandSystemId) {
            const hrmBrand = hrmBrands.find((b)=>b.systemId === input.hrmBrandSystemId);
            if (hrmBrand) {
                const newSuggestions = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$pkgx$2f$validation$2f$brand$2d$mapping$2d$validation$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["suggestMatchingBrands"])(hrmBrand.name, pkgxBrands);
                setSuggestions(newSuggestions);
            }
        }
        return result;
    }, [
        context,
        hrmBrands,
        pkgxBrands
    ]);
    // Async validation with debounce
    const validateAsync = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"](async (input)=>{
        return new Promise((resolve)=>{
            setIsValidating(true);
            if (debounceTimerRef.current) {
                clearTimeout(debounceTimerRef.current);
            }
            debounceTimerRef.current = setTimeout(()=>{
                const result = validate(input);
                setIsValidating(false);
                resolve(result);
            }, debounceMs);
        });
    }, [
        validate,
        debounceMs
    ]);
    // Clear validation
    const clearValidation = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"](()=>{
        setValidationResult(null);
        setSuggestions([]);
        if (debounceTimerRef.current) {
            clearTimeout(debounceTimerRef.current);
        }
    }, []);
    // Cleanup on unmount
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"](()=>{
        return ()=>{
            if (debounceTimerRef.current) {
                clearTimeout(debounceTimerRef.current);
            }
        };
    }, []);
    // Computed values
    const hasErrors = validationResult ? validationResult.errors.length > 0 : false;
    const hasWarnings = validationResult ? validationResult.warnings.length > 0 : false;
    const getFieldError = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"]((field)=>{
        if (!validationResult) return undefined;
        const error = validationResult.errors.find((e)=>e.field === field);
        return error?.message;
    }, [
        validationResult
    ]);
    const getFieldWarning = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"]((field)=>{
        if (!validationResult) return undefined;
        const warning = validationResult.warnings.find((w)=>w.field === field);
        return warning?.message;
    }, [
        validationResult
    ]);
    return {
        validationResult,
        isValidating,
        suggestions,
        validate,
        validateAsync,
        clearValidation,
        hasErrors,
        hasWarnings,
        getFieldError,
        getFieldWarning
    };
}
}),
"[project]/features/settings/pkgx/hooks/use-pkgx-entity-sync.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "SYNC_ACTIONS",
    ()=>SYNC_ACTIONS,
    "usePkgxEntitySync",
    ()=>usePkgxEntitySync
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/sonner/dist/index.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$refresh$2d$cw$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__RefreshCw$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/refresh-cw.js [app-ssr] (ecmascript) <export default as RefreshCw>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$search$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Search$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/search.js [app-ssr] (ecmascript) <export default as Search>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$text$2d$align$2d$start$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__AlignLeft$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/text-align-start.js [app-ssr] (ecmascript) <export default as AlignLeft>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$folder$2d$pen$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__FolderEdit$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/folder-pen.js [app-ssr] (ecmascript) <export default as FolderEdit>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$dollar$2d$sign$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__DollarSign$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/dollar-sign.js [app-ssr] (ecmascript) <export default as DollarSign>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$package$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Package$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/package.js [app-ssr] (ecmascript) <export default as Package>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$tag$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Tag$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/tag.js [app-ssr] (ecmascript) <export default as Tag>");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$pkgx$2f$api$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/pkgx/api-service.ts [app-ssr] (ecmascript)");
;
;
;
;
// Helper to map SyncActionKey to PkgxSyncLogAction
const mapActionKeyToLogAction = (actionKey)=>{
    switch(actionKey){
        case 'sync_all':
            return 'sync_all';
        case 'sync_seo':
            return 'sync_seo';
        case 'sync_price':
            return 'sync_price';
        case 'sync_inventory':
            return 'sync_inventory';
        case 'sync_basic':
        case 'sync_description':
        case 'sync_flags':
        default:
            return 'update_product'; // Map other actions to generic update
    }
};
const SYNC_ACTIONS = [
    {
        key: 'sync_all',
        label: 'Đồng bộ tất cả',
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$refresh$2d$cw$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__RefreshCw$3e$__["RefreshCw"],
        title: 'Đồng bộ tất cả',
        description: (name)=>`Đồng bộ TẤT CẢ thông tin của "${name}" lên PKGX`,
        confirmTitle: 'Đồng bộ tất cả',
        confirmDescription: (name)=>`Bạn có chắc muốn đồng bộ TẤT CẢ thông tin "${name}" lên PKGX?`,
        supportedEntities: [
            'category',
            'brand',
            'product'
        ],
        isPrimary: true
    },
    {
        key: 'sync_basic',
        label: 'Thông tin cơ bản',
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$folder$2d$pen$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__FolderEdit$3e$__["FolderEdit"],
        title: 'Đồng bộ thông tin cơ bản',
        description: (name)=>`Đồng bộ thông tin cơ bản của "${name}"`,
        confirmTitle: 'Đồng bộ thông tin cơ bản',
        confirmDescription: (name)=>`Đồng bộ thông tin cơ bản của "${name}" lên PKGX?`,
        supportedEntities: [
            'category',
            'brand',
            'product'
        ]
    },
    {
        key: 'sync_seo',
        label: 'SEO',
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$search$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Search$3e$__["Search"],
        title: 'Đồng bộ SEO',
        description: (name)=>`Đồng bộ SEO (keywords, meta title, meta description) của "${name}"`,
        confirmTitle: 'Đồng bộ SEO',
        confirmDescription: (name)=>`Đồng bộ SEO của "${name}" lên PKGX?`,
        supportedEntities: [
            'category',
            'brand',
            'product'
        ]
    },
    {
        key: 'sync_description',
        label: 'Mô tả',
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$text$2d$align$2d$start$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__AlignLeft$3e$__["AlignLeft"],
        title: 'Đồng bộ mô tả',
        description: (name)=>`Đồng bộ mô tả (short desc, long desc) của "${name}"`,
        confirmTitle: 'Đồng bộ mô tả',
        confirmDescription: (name)=>`Đồng bộ mô tả của "${name}" lên PKGX?`,
        supportedEntities: [
            'category',
            'brand',
            'product'
        ]
    },
    {
        key: 'sync_price',
        label: 'Giá',
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$dollar$2d$sign$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__DollarSign$3e$__["DollarSign"],
        title: 'Đồng bộ giá',
        description: (name)=>`Đồng bộ giá bán, giá thị trường, giá khuyến mãi của "${name}"`,
        confirmTitle: 'Đồng bộ giá',
        confirmDescription: (name)=>`Đồng bộ giá sản phẩm "${name}" lên PKGX?`,
        supportedEntities: [
            'product'
        ]
    },
    {
        key: 'sync_inventory',
        label: 'Tồn kho',
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$package$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Package$3e$__["Package"],
        title: 'Đồng bộ tồn kho',
        description: (name)=>`Đồng bộ tổng số lượng tồn kho của "${name}"`,
        confirmTitle: 'Đồng bộ tồn kho',
        confirmDescription: (name)=>`Đồng bộ tồn kho sản phẩm "${name}" lên PKGX?`,
        supportedEntities: [
            'product'
        ]
    },
    {
        key: 'sync_flags',
        label: 'Flags',
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$tag$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Tag$3e$__["Tag"],
        title: 'Đồng bộ flags',
        description: (name)=>`Đồng bộ flags (nổi bật, mới, hot, trang chủ) của "${name}"`,
        confirmTitle: 'Đồng bộ flags',
        confirmDescription: (name)=>`Đồng bộ flags của "${name}" lên PKGX?`,
        supportedEntities: [
            'product'
        ]
    }
];
function usePkgxEntitySync(options) {
    const { entityType, onLog, getPkgxCatIdByHrmCategory, getPkgxBrandIdByHrmBrand } = options;
    const [isSyncing, setIsSyncing] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"](false);
    const [confirmAction, setConfirmAction] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"]({
        open: false,
        title: '',
        description: '',
        action: null
    });
    // Get available actions for this entity type
    const availableActions = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"](()=>SYNC_ACTIONS.filter((action)=>action.supportedEntities.includes(entityType)), [
        entityType
    ]);
    // Primary action (sync all)
    const primaryAction = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"](()=>availableActions.find((a)=>a.isPrimary), [
        availableActions
    ]);
    // Secondary actions (non-primary)
    const secondaryActions = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"](()=>availableActions.filter((a)=>!a.isPrimary), [
        availableActions
    ]);
    // Confirm handler
    const handleConfirm = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"]((title, description, action)=>{
        setConfirmAction({
            open: true,
            title,
            description,
            action
        });
    }, []);
    // Execute confirmed action
    const executeAction = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"](()=>{
        if (confirmAction.action) {
            confirmAction.action();
        }
        setConfirmAction({
            open: false,
            title: '',
            description: '',
            action: null
        });
    }, [
        confirmAction.action
    ]);
    // Cancel confirm dialog
    const cancelConfirm = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"](()=>{
        setConfirmAction({
            open: false,
            title: '',
            description: '',
            action: null
        });
    }, []);
    // ========================================
    // Category Sync Handlers
    // ========================================
    const syncCategory = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"](async (pkgxCatId, hrmCategory, actionKey)=>{
        setIsSyncing(true);
        try {
            const pkgxSeo = hrmCategory.websiteSeo?.pkgx;
            let payload = {};
            let successMessage = '';
            switch(actionKey){
                case 'sync_all':
                    payload = {
                        cat_name: hrmCategory.name,
                        keywords: pkgxSeo?.seoKeywords || hrmCategory.seoKeywords || hrmCategory.name,
                        meta_title: pkgxSeo?.seoTitle || hrmCategory.seoTitle || hrmCategory.name,
                        meta_desc: pkgxSeo?.metaDescription || hrmCategory.metaDescription || '',
                        cat_desc: pkgxSeo?.shortDescription || hrmCategory.shortDescription || '',
                        long_desc: pkgxSeo?.longDescription || hrmCategory.longDescription || ''
                    };
                    successMessage = `Đã đồng bộ tất cả cho danh mục: ${hrmCategory.name}`;
                    break;
                case 'sync_basic':
                    payload = {
                        cat_name: hrmCategory.name,
                        is_show: hrmCategory.isActive !== false ? 1 : 0
                    };
                    successMessage = `Đã đồng bộ thông tin cơ bản cho danh mục: ${hrmCategory.name}`;
                    // Use updateCategoryBasic for basic info
                    const basicResponse = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$pkgx$2f$api$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["updateCategoryBasic"])(pkgxCatId, payload);
                    if (basicResponse.success) {
                        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toast"].success(successMessage);
                        onLog?.({
                            action: 'update_product',
                            status: 'success',
                            message: successMessage,
                            details: {
                                categoryId: pkgxCatId
                            }
                        });
                    } else {
                        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toast"].error(basicResponse.error || 'Không thể đồng bộ');
                    }
                    setIsSyncing(false);
                    return basicResponse.success;
                case 'sync_seo':
                    payload = {
                        keywords: pkgxSeo?.seoKeywords || hrmCategory.seoKeywords || hrmCategory.name,
                        meta_title: pkgxSeo?.seoTitle || hrmCategory.seoTitle || hrmCategory.name,
                        meta_desc: pkgxSeo?.metaDescription || hrmCategory.metaDescription || ''
                    };
                    successMessage = `Đã đồng bộ SEO cho danh mục: ${hrmCategory.name}`;
                    break;
                case 'sync_description':
                    payload = {
                        cat_desc: pkgxSeo?.shortDescription || hrmCategory.shortDescription || '',
                        long_desc: pkgxSeo?.longDescription || hrmCategory.longDescription || ''
                    };
                    successMessage = `Đã đồng bộ mô tả cho danh mục: ${hrmCategory.name}`;
                    break;
                default:
                    setIsSyncing(false);
                    return false;
            }
            const response = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$pkgx$2f$api$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["updateCategory"])(pkgxCatId, payload);
            if (response.success) {
                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toast"].success(successMessage);
                onLog?.({
                    action: mapActionKeyToLogAction(actionKey),
                    status: 'success',
                    message: successMessage,
                    details: {
                        categoryId: pkgxCatId
                    }
                });
            } else {
                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toast"].error(response.error || 'Không thể đồng bộ');
            }
            return response.success;
        } catch (error) {
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toast"].error('Lỗi khi đồng bộ danh mục');
            return false;
        } finally{
            setIsSyncing(false);
        }
    }, [
        onLog
    ]);
    // ========================================
    // Brand Sync Handlers
    // ========================================
    const syncBrand = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"](async (pkgxBrandId, hrmBrand, actionKey)=>{
        setIsSyncing(true);
        try {
            const pkgxSeo = hrmBrand.websiteSeo?.pkgx;
            let payload = {};
            let successMessage = '';
            switch(actionKey){
                case 'sync_all':
                    payload = {
                        brand_name: hrmBrand.name,
                        site_url: hrmBrand.website || '',
                        keywords: pkgxSeo?.seoKeywords || hrmBrand.seoKeywords || hrmBrand.name,
                        meta_title: pkgxSeo?.seoTitle || hrmBrand.seoTitle || hrmBrand.name,
                        meta_desc: pkgxSeo?.metaDescription || hrmBrand.metaDescription || '',
                        short_desc: pkgxSeo?.shortDescription || hrmBrand.shortDescription || '',
                        long_desc: pkgxSeo?.longDescription || hrmBrand.longDescription || ''
                    };
                    successMessage = `Đã đồng bộ tất cả cho thương hiệu: ${hrmBrand.name}`;
                    break;
                case 'sync_basic':
                    payload = {
                        brand_name: hrmBrand.name,
                        site_url: hrmBrand.website || ''
                    };
                    successMessage = `Đã đồng bộ thông tin cơ bản cho thương hiệu: ${hrmBrand.name}`;
                    break;
                case 'sync_seo':
                    payload = {
                        keywords: pkgxSeo?.seoKeywords || hrmBrand.seoKeywords || hrmBrand.name,
                        meta_title: pkgxSeo?.seoTitle || hrmBrand.seoTitle || hrmBrand.name,
                        meta_desc: pkgxSeo?.metaDescription || hrmBrand.metaDescription || ''
                    };
                    successMessage = `Đã đồng bộ SEO cho thương hiệu: ${hrmBrand.name}`;
                    break;
                case 'sync_description':
                    payload = {
                        short_desc: pkgxSeo?.shortDescription || hrmBrand.shortDescription || '',
                        long_desc: pkgxSeo?.longDescription || hrmBrand.longDescription || ''
                    };
                    successMessage = `Đã đồng bộ mô tả cho thương hiệu: ${hrmBrand.name}`;
                    break;
                default:
                    setIsSyncing(false);
                    return false;
            }
            const response = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$pkgx$2f$api$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["updateBrand"])(pkgxBrandId, payload);
            if (response.success) {
                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toast"].success(successMessage);
                onLog?.({
                    action: mapActionKeyToLogAction(actionKey),
                    status: 'success',
                    message: successMessage,
                    details: {
                        brandId: pkgxBrandId
                    }
                });
            } else {
                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toast"].error(response.error || 'Không thể đồng bộ');
            }
            return response.success;
        } catch (error) {
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toast"].error('Lỗi khi đồng bộ thương hiệu');
            return false;
        } finally{
            setIsSyncing(false);
        }
    }, [
        onLog
    ]);
    // ========================================
    // Product Sync Handlers
    // ========================================
    const syncProduct = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"](async (pkgxProductId, hrmProduct, actionKey)=>{
        setIsSyncing(true);
        try {
            let payload = {};
            let successMessage = '';
            switch(actionKey){
                case 'sync_all':
                    payload = {
                        goods_name: hrmProduct.name,
                        goods_sn: hrmProduct.sku || '',
                        shop_price: hrmProduct.sellingPrice || 0,
                        market_price: hrmProduct.costPrice || hrmProduct.sellingPrice || 0,
                        promote_price: hrmProduct.dealPrice || 0,
                        goods_number: hrmProduct.quantity || 0,
                        keywords: hrmProduct.seoKeywords || hrmProduct.name,
                        meta_title: hrmProduct.ktitle || hrmProduct.name,
                        meta_desc: hrmProduct.seoDescription || '',
                        goods_brief: hrmProduct.shortDescription || '',
                        goods_desc: hrmProduct.description || '',
                        is_best: hrmProduct.isBest ? 1 : 0,
                        is_new: hrmProduct.isNew ? 1 : 0,
                        is_hot: hrmProduct.isHot ? 1 : 0,
                        is_home: hrmProduct.isHome ? 1 : 0
                    };
                    // Add category/brand if mapped
                    if (hrmProduct.categorySystemId && getPkgxCatIdByHrmCategory) {
                        const catId = getPkgxCatIdByHrmCategory(hrmProduct.categorySystemId);
                        if (catId) payload.cat_id = catId;
                    }
                    if (hrmProduct.brandSystemId && getPkgxBrandIdByHrmBrand) {
                        const brandId = getPkgxBrandIdByHrmBrand(hrmProduct.brandSystemId);
                        if (brandId) payload.brand_id = brandId;
                    }
                    successMessage = `Đã đồng bộ tất cả cho sản phẩm: ${hrmProduct.name}`;
                    break;
                case 'sync_basic':
                    payload = {
                        goods_name: hrmProduct.name,
                        goods_sn: hrmProduct.sku || ''
                    };
                    // Add category/brand if mapped
                    if (hrmProduct.categorySystemId && getPkgxCatIdByHrmCategory) {
                        const catId = getPkgxCatIdByHrmCategory(hrmProduct.categorySystemId);
                        if (catId) payload.cat_id = catId;
                    }
                    if (hrmProduct.brandSystemId && getPkgxBrandIdByHrmBrand) {
                        const brandId = getPkgxBrandIdByHrmBrand(hrmProduct.brandSystemId);
                        if (brandId) payload.brand_id = brandId;
                    }
                    successMessage = `Đã đồng bộ thông tin cơ bản cho sản phẩm: ${hrmProduct.name}`;
                    break;
                case 'sync_seo':
                    payload = {
                        keywords: hrmProduct.seoKeywords || hrmProduct.name,
                        meta_title: hrmProduct.ktitle || hrmProduct.name,
                        meta_desc: hrmProduct.seoDescription || ''
                    };
                    successMessage = `Đã đồng bộ SEO cho sản phẩm: ${hrmProduct.name}`;
                    break;
                case 'sync_description':
                    payload = {
                        goods_brief: hrmProduct.shortDescription || '',
                        goods_desc: hrmProduct.description || ''
                    };
                    successMessage = `Đã đồng bộ mô tả cho sản phẩm: ${hrmProduct.name}`;
                    break;
                case 'sync_price':
                    payload = {
                        shop_price: hrmProduct.sellingPrice || 0,
                        market_price: hrmProduct.costPrice || hrmProduct.sellingPrice || 0,
                        promote_price: hrmProduct.dealPrice || 0
                    };
                    successMessage = `Đã đồng bộ giá cho sản phẩm: ${hrmProduct.name}`;
                    break;
                case 'sync_inventory':
                    payload = {
                        goods_number: hrmProduct.quantity || 0
                    };
                    successMessage = `Đã đồng bộ tồn kho cho sản phẩm: ${hrmProduct.name}`;
                    break;
                case 'sync_flags':
                    payload = {
                        is_best: hrmProduct.isBest ? 1 : 0,
                        is_new: hrmProduct.isNew ? 1 : 0,
                        is_hot: hrmProduct.isHot ? 1 : 0,
                        is_home: hrmProduct.isHome ? 1 : 0
                    };
                    successMessage = `Đã đồng bộ flags cho sản phẩm: ${hrmProduct.name}`;
                    break;
                default:
                    setIsSyncing(false);
                    return false;
            }
            const response = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$pkgx$2f$api$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["updateProduct"])(pkgxProductId, payload);
            if (response.success) {
                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toast"].success(successMessage);
                onLog?.({
                    action: mapActionKeyToLogAction(actionKey),
                    status: 'success',
                    message: successMessage,
                    details: {
                        pkgxId: pkgxProductId
                    }
                });
            } else {
                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toast"].error(response.error || 'Không thể đồng bộ');
            }
            return response.success;
        } catch (error) {
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toast"].error('Lỗi khi đồng bộ sản phẩm');
            return false;
        } finally{
            setIsSyncing(false);
        }
    }, [
        onLog,
        getPkgxCatIdByHrmCategory,
        getPkgxBrandIdByHrmBrand
    ]);
    // ========================================
    // Generic sync handler based on entity type
    // ========================================
    const sync = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"](async (pkgxId, hrmData, actionKey)=>{
        switch(entityType){
            case 'category':
                return syncCategory(pkgxId, hrmData, actionKey);
            case 'brand':
                return syncBrand(pkgxId, hrmData, actionKey);
            case 'product':
                return syncProduct(pkgxId, hrmData, actionKey);
            default:
                return false;
        }
    }, [
        entityType,
        syncCategory,
        syncBrand,
        syncProduct
    ]);
    // ========================================
    // Action trigger with confirmation
    // ========================================
    const triggerSyncAction = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"]((actionKey, pkgxId, hrmData, entityName)=>{
        const action = SYNC_ACTIONS.find((a)=>a.key === actionKey);
        if (!action) return;
        handleConfirm(action.confirmTitle, action.confirmDescription(entityName), ()=>sync(pkgxId, hrmData, actionKey));
    }, [
        handleConfirm,
        sync
    ]);
    return {
        // State
        isSyncing,
        confirmAction,
        // Actions config
        availableActions,
        primaryAction,
        secondaryActions,
        // Handlers
        handleConfirm,
        executeAction,
        cancelConfirm,
        // Sync methods
        sync,
        syncCategory,
        syncBrand,
        syncProduct,
        triggerSyncAction
    };
}
}),
"[project]/features/settings/pkgx/hooks/use-pkgx-bulk-sync.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "usePkgxBulkSync",
    ()=>usePkgxBulkSync
]);
/**
 * usePkgxBulkSync - Shared hook for bulk PKGX sync operations
 * 
 * Supports bulk sync for products and brands with:
 * - Progress tracking
 * - Confirmation dialog
 * - Error handling
 * - Logging
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/sonner/dist/index.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$pkgx$2f$api$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/pkgx/api-service.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$pkgx$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/settings/pkgx/store.ts [app-ssr] (ecmascript)");
;
;
;
;
// ========================================
// Bulk Action Configs
// ========================================
const BULK_ACTION_LABELS = {
    sync_all: {
        title: 'Đồng bộ tất cả',
        description: 'Đồng bộ toàn bộ thông tin (tên, SKU, giá, tồn kho, SEO, mô tả, flags)'
    },
    sync_basic: {
        title: 'Đồng bộ thông tin cơ bản',
        description: 'Đồng bộ tên, SKU, danh mục, thương hiệu'
    },
    sync_seo: {
        title: 'Đồng bộ SEO',
        description: 'Đồng bộ keywords, meta title, meta description'
    },
    sync_description: {
        title: 'Đồng bộ mô tả',
        description: 'Đồng bộ mô tả ngắn và mô tả chi tiết'
    },
    sync_price: {
        title: 'Đồng bộ giá',
        description: 'Đồng bộ giá bán, giá thị trường, giá khuyến mãi'
    },
    sync_inventory: {
        title: 'Đồng bộ tồn kho',
        description: 'Đồng bộ số lượng tồn kho'
    },
    sync_flags: {
        title: 'Đồng bộ flags',
        description: 'Đồng bộ trạng thái nổi bật, mới, hot, hiển thị'
    },
    sync_images: {
        title: 'Đồng bộ hình ảnh',
        description: 'Đồng bộ hình ảnh đại diện và album'
    }
};
// ========================================
// Payload Builders
// ========================================
function buildProductPayload(product, actionKey) {
    const pkgxSettings = __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$pkgx$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["usePkgxSettingsStore"].getState();
    const { categoryMappings, brandMappings } = pkgxSettings.settings;
    // Get PKGX category/brand IDs
    const catMapping = categoryMappings.find((m)=>m.hrmCategorySystemId === product.categorySystemId);
    const brandMapping = brandMappings.find((m)=>m.hrmBrandSystemId === product.brandSystemId);
    // Get website-specific SEO data
    const pkgxSeo = product.seoPkgx;
    // Calculate total inventory
    const totalInventory = Object.values(product.inventoryByBranch || {}).reduce((sum, qty)=>sum + qty, 0);
    switch(actionKey){
        case 'sync_all':
            return {
                goods_name: product.name,
                goods_sn: product.id,
                shop_price: product.sellingPrice || 0,
                market_price: product.costPrice || product.sellingPrice || 0,
                promote_price: 0,
                goods_number: totalInventory,
                keywords: pkgxSeo?.seoKeywords || product.seoKeywords || product.name,
                meta_title: pkgxSeo?.seoTitle || product.ktitle || product.name,
                meta_desc: pkgxSeo?.metaDescription || product.seoDescription || '',
                goods_brief: pkgxSeo?.shortDescription || product.shortDescription || '',
                goods_desc: pkgxSeo?.longDescription || product.description || '',
                is_best: product.isFeatured ? 1 : 0,
                is_new: product.isNewArrival ? 1 : 0,
                is_hot: product.isBestSeller ? 1 : 0,
                is_home: product.isPublished ? 1 : 0,
                is_on_sale: product.isPublished ?? product.status === 'active' ? 1 : 0,
                ...catMapping && {
                    cat_id: catMapping.pkgxCatId
                },
                ...brandMapping && {
                    brand_id: brandMapping.pkgxBrandId
                }
            };
        case 'sync_basic':
            return {
                goods_name: product.name,
                goods_sn: product.id,
                ...catMapping && {
                    cat_id: catMapping.pkgxCatId
                },
                ...brandMapping && {
                    brand_id: brandMapping.pkgxBrandId
                }
            };
        case 'sync_price':
            return {
                shop_price: product.sellingPrice || 0,
                market_price: product.costPrice || product.sellingPrice || 0,
                promote_price: 0
            };
        case 'sync_inventory':
            return {
                goods_number: totalInventory
            };
        case 'sync_seo':
            return {
                keywords: pkgxSeo?.seoKeywords || product.seoKeywords || product.name,
                meta_title: pkgxSeo?.seoTitle || product.ktitle || product.name,
                meta_desc: pkgxSeo?.metaDescription || product.seoDescription || ''
            };
        case 'sync_description':
            return {
                goods_brief: pkgxSeo?.shortDescription || product.shortDescription || '',
                goods_desc: pkgxSeo?.longDescription || product.description || ''
            };
        case 'sync_flags':
            return {
                is_best: product.isFeatured ? 1 : 0,
                is_new: product.isNewArrival ? 1 : 0,
                is_hot: product.isBestSeller ? 1 : 0,
                is_home: product.isPublished ? 1 : 0,
                is_on_sale: product.isPublished ?? product.status === 'active' ? 1 : 0
            };
        default:
            return {};
    }
}
function buildBrandPayload(brand, actionKey) {
    const pkgxSeo = brand.websiteSeo?.pkgx;
    switch(actionKey){
        case 'sync_all':
            return {
                brand_name: brand.name,
                site_url: brand.website || '',
                keywords: pkgxSeo?.seoKeywords || brand.seoKeywords || brand.name,
                meta_title: pkgxSeo?.seoTitle || brand.seoTitle || brand.name,
                meta_desc: pkgxSeo?.metaDescription || brand.metaDescription || '',
                short_desc: pkgxSeo?.shortDescription || brand.shortDescription || '',
                brand_desc: pkgxSeo?.longDescription || brand.longDescription || brand.description || ''
            };
        case 'sync_basic':
            return {
                brand_name: brand.name,
                site_url: brand.website || ''
            };
        case 'sync_seo':
            return {
                keywords: pkgxSeo?.seoKeywords || brand.seoKeywords || brand.name,
                meta_title: pkgxSeo?.seoTitle || brand.seoTitle || brand.name,
                meta_desc: pkgxSeo?.metaDescription || brand.metaDescription || '',
                short_desc: pkgxSeo?.shortDescription || brand.shortDescription || ''
            };
        case 'sync_description':
            return {
                short_desc: pkgxSeo?.shortDescription || brand.shortDescription || '',
                brand_desc: pkgxSeo?.longDescription || brand.longDescription || brand.description || ''
            };
        default:
            return {};
    }
}
function usePkgxBulkSync(options) {
    const { entityType, onLog } = options;
    // Confirmation dialog state
    const [confirmAction, setConfirmAction] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"]({
        open: false,
        title: '',
        description: '',
        action: null,
        itemCount: 0
    });
    // Progress state
    const [progress, setProgress] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"]({
        total: 0,
        completed: 0,
        success: 0,
        error: 0,
        isRunning: false
    });
    // Check if PKGX is enabled
    const checkPkgxEnabled = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"](()=>{
        const pkgxSettings = __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$pkgx$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["usePkgxSettingsStore"].getState();
        if (!pkgxSettings.settings.enabled) {
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toast"].error('PKGX chưa được bật');
            return false;
        }
        return true;
    }, []);
    // Helper to get PKGX brand ID from brand mappings
    const getPkgxBrandId = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"]((brand)=>{
        const pkgxSettings = __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$pkgx$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["usePkgxSettingsStore"].getState();
        const mapping = pkgxSettings.settings.brandMappings.find((m)=>m.hrmBrandSystemId === brand.systemId);
        return mapping?.pkgxBrandId;
    }, []);
    // Execute bulk sync for products
    const executeBulkSyncProducts = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"](async (products, actionKey)=>{
        const linkedProducts = products.filter((p)=>p.pkgxId);
        if (linkedProducts.length === 0) {
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toast"].error('Không có sản phẩm nào đã liên kết PKGX');
            return;
        }
        setProgress({
            total: linkedProducts.length,
            completed: 0,
            success: 0,
            error: 0,
            isRunning: true
        });
        const actionLabel = BULK_ACTION_LABELS[actionKey].title.toLowerCase();
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toast"].info(`Đang ${actionLabel} ${linkedProducts.length} sản phẩm...`);
        let successCount = 0;
        let errorCount = 0;
        for(let i = 0; i < linkedProducts.length; i++){
            const product = linkedProducts[i];
            try {
                const payload = buildProductPayload(product, actionKey);
                const response = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$pkgx$2f$api$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["updateProduct"])(product.pkgxId, payload);
                if (response.success) {
                    successCount++;
                } else {
                    errorCount++;
                }
            } catch  {
                errorCount++;
            }
            setProgress((prev)=>({
                    ...prev,
                    completed: i + 1,
                    success: successCount,
                    error: errorCount
                }));
        }
        setProgress((prev)=>({
                ...prev,
                isRunning: false
            }));
        // Show results
        if (successCount > 0) {
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toast"].success(`Đã ${actionLabel} ${successCount} sản phẩm`);
            onLog?.({
                action: `bulk_${actionKey}`,
                status: 'success',
                message: `Đã ${actionLabel} ${successCount} sản phẩm`,
                details: {
                    successCount,
                    errorCount
                }
            });
        }
        if (errorCount > 0) {
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toast"].error(`Lỗi ${errorCount} sản phẩm`);
        }
    }, [
        onLog
    ]);
    // Execute bulk sync for brands
    const executeBulkSyncBrands = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"](async (brands, actionKey)=>{
        const linkedBrands = brands.filter((b)=>getPkgxBrandId(b));
        if (linkedBrands.length === 0) {
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toast"].error('Không có thương hiệu nào đã liên kết PKGX');
            return;
        }
        setProgress({
            total: linkedBrands.length,
            completed: 0,
            success: 0,
            error: 0,
            isRunning: true
        });
        const actionLabel = BULK_ACTION_LABELS[actionKey].title.toLowerCase();
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toast"].info(`Đang ${actionLabel} ${linkedBrands.length} thương hiệu...`);
        let successCount = 0;
        let errorCount = 0;
        for(let i = 0; i < linkedBrands.length; i++){
            const brand = linkedBrands[i];
            const pkgxBrandId = getPkgxBrandId(brand);
            if (!pkgxBrandId) {
                errorCount++;
                continue;
            }
            try {
                const payload = buildBrandPayload(brand, actionKey);
                const response = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$pkgx$2f$api$2d$service$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["updateBrand"])(pkgxBrandId, payload);
                if (response.success) {
                    successCount++;
                } else {
                    errorCount++;
                }
            } catch  {
                errorCount++;
            }
            setProgress((prev)=>({
                    ...prev,
                    completed: i + 1,
                    success: successCount,
                    error: errorCount
                }));
        }
        setProgress((prev)=>({
                ...prev,
                isRunning: false
            }));
        // Show results
        if (successCount > 0) {
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toast"].success(`Đã ${actionLabel} ${successCount} thương hiệu`);
            onLog?.({
                action: `bulk_${actionKey}`,
                status: 'success',
                message: `Đã ${actionLabel} ${successCount} thương hiệu`,
                details: {
                    successCount,
                    errorCount
                }
            });
        }
        if (errorCount > 0) {
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toast"].error(`Lỗi ${errorCount} thương hiệu`);
        }
    }, [
        getPkgxBrandId,
        onLog
    ]);
    // Trigger bulk sync with confirmation
    const triggerBulkSync = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"]((items, actionKey)=>{
        if (!checkPkgxEnabled()) return;
        // Filter linked items
        let linkedCount = 0;
        let unlinkedCount = 0;
        if (entityType === 'product') {
            const products = items;
            linkedCount = products.filter((p)=>p.pkgxId).length;
            unlinkedCount = products.length - linkedCount;
        } else {
            const brands = items;
            linkedCount = brands.filter((b)=>getPkgxBrandId(b)).length;
            unlinkedCount = brands.length - linkedCount;
        }
        if (linkedCount === 0) {
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["toast"].error(`Không có ${entityType === 'product' ? 'sản phẩm' : 'thương hiệu'} nào đã liên kết PKGX`);
            return;
        }
        const actionConfig = BULK_ACTION_LABELS[actionKey];
        const entityLabel = entityType === 'product' ? 'sản phẩm' : 'thương hiệu';
        let description = `Bạn có chắc muốn ${actionConfig.title.toLowerCase()} cho ${linkedCount} ${entityLabel}?`;
        if (unlinkedCount > 0) {
            description += `\n(${unlinkedCount} ${entityLabel} chưa liên kết sẽ bị bỏ qua)`;
        }
        setConfirmAction({
            open: true,
            title: actionConfig.title,
            description,
            itemCount: linkedCount,
            action: async ()=>{
                if (entityType === 'product') {
                    await executeBulkSyncProducts(items, actionKey);
                } else {
                    await executeBulkSyncBrands(items, actionKey);
                }
            }
        });
    }, [
        entityType,
        checkPkgxEnabled,
        getPkgxBrandId,
        executeBulkSyncProducts,
        executeBulkSyncBrands
    ]);
    // Execute confirmed action
    const executeAction = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"](async ()=>{
        if (confirmAction.action) {
            await confirmAction.action();
        }
        setConfirmAction({
            open: false,
            title: '',
            description: '',
            action: null,
            itemCount: 0
        });
    }, [
        confirmAction.action
    ]);
    // Cancel confirmation
    const cancelConfirm = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"](()=>{
        setConfirmAction({
            open: false,
            title: '',
            description: '',
            action: null,
            itemCount: 0
        });
    }, []);
    return {
        // Confirmation dialog state
        confirmAction,
        // Progress state
        progress,
        // Actions
        triggerBulkSync,
        executeAction,
        cancelConfirm,
        // Helpers
        checkPkgxEnabled,
        getPkgxBrandId,
        // Direct execute (without confirm)
        executeBulkSyncProducts,
        executeBulkSyncBrands
    };
}
}),
"[project]/features/settings/pkgx/hooks/index.ts [app-ssr] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$pkgx$2f$hooks$2f$use$2d$category$2d$mapping$2d$validation$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/settings/pkgx/hooks/use-category-mapping-validation.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$pkgx$2f$hooks$2f$use$2d$brand$2d$mapping$2d$validation$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/settings/pkgx/hooks/use-brand-mapping-validation.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$pkgx$2f$hooks$2f$use$2d$pkgx$2d$entity$2d$sync$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/settings/pkgx/hooks/use-pkgx-entity-sync.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$pkgx$2f$hooks$2f$use$2d$pkgx$2d$bulk$2d$sync$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/settings/pkgx/hooks/use-pkgx-bulk-sync.ts [app-ssr] (ecmascript)");
;
;
;
;
}),
"[project]/features/settings/pkgx/hooks/use-product-mapping-validation.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useProductMappingValidation",
    ()=>useProductMappingValidation
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$pkgx$2f$validation$2f$product$2d$mapping$2d$validation$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/settings/pkgx/validation/product-mapping-validation.ts [app-ssr] (ecmascript)");
;
;
function useProductMappingValidation(options) {
    const { hrmProducts, pkgxProducts, editingProductId, debounceMs = 300 } = options;
    const [validationResult, setValidationResult] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"](null);
    const [isValidating, setIsValidating] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"](false);
    const [suggestions, setSuggestions] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"]([]);
    const debounceTimerRef = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"](null);
    // Create validation context
    const context = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"](()=>({
            hrmProducts,
            pkgxProducts,
            editingProductId
        }), [
        hrmProducts,
        pkgxProducts,
        editingProductId
    ]);
    // Update suggestions based on PKGX product
    const updateSuggestions = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"]((pkgxProduct)=>{
        const newSuggestions = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$pkgx$2f$validation$2f$product$2d$mapping$2d$validation$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["suggestMatchingProducts"])({
            goods_name: pkgxProduct.goods_name,
            goods_sn: pkgxProduct.goods_sn
        }, hrmProducts);
        setSuggestions(newSuggestions);
    }, [
        hrmProducts
    ]);
    // Sync validation
    const validate = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"]((input)=>{
        const result = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$pkgx$2f$validation$2f$product$2d$mapping$2d$validation$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["validateProductMapping"])(input, context);
        setValidationResult(result);
        return result;
    }, [
        context
    ]);
    // Async validation with debounce
    const validateAsync = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"](async (input)=>{
        return new Promise((resolve)=>{
            setIsValidating(true);
            if (debounceTimerRef.current) {
                clearTimeout(debounceTimerRef.current);
            }
            debounceTimerRef.current = setTimeout(()=>{
                const result = validate(input);
                setIsValidating(false);
                resolve(result);
            }, debounceMs);
        });
    }, [
        validate,
        debounceMs
    ]);
    // Clear validation
    const clearValidation = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"](()=>{
        setValidationResult(null);
        setSuggestions([]);
        if (debounceTimerRef.current) {
            clearTimeout(debounceTimerRef.current);
        }
    }, []);
    // Cleanup on unmount
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"](()=>{
        return ()=>{
            if (debounceTimerRef.current) {
                clearTimeout(debounceTimerRef.current);
            }
        };
    }, []);
    // Computed values
    const hasErrors = validationResult ? validationResult.errors.length > 0 : false;
    const hasWarnings = validationResult ? validationResult.warnings.length > 0 : false;
    const getFieldError = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"]((field)=>{
        if (!validationResult) return undefined;
        const error = validationResult.errors.find((e)=>e.field === field);
        return error?.message;
    }, [
        validationResult
    ]);
    const getFieldWarning = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"]((field)=>{
        if (!validationResult) return undefined;
        const warning = validationResult.warnings.find((w)=>w.field === field);
        return warning?.message;
    }, [
        validationResult
    ]);
    return {
        validationResult,
        isValidating,
        suggestions,
        validate,
        validateAsync,
        clearValidation,
        updateSuggestions,
        hasErrors,
        hasWarnings,
        getFieldError,
        getFieldWarning
    };
}
}),
"[project]/features/settings/pkgx/pkgx-settings-page.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "PkgxSettingsPage",
    ()=>PkgxSettingsPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$tabs$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/tabs.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$globe$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Globe$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/globe.js [app-ssr] (ecmascript) <export default as Globe>");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$settings$2f$SettingsVerticalTabs$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/settings/SettingsVerticalTabs.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$use$2d$settings$2d$page$2d$header$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/settings/use-settings-page-header.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$pkgx$2f$components$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/features/settings/pkgx/components/index.ts [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$pkgx$2f$components$2f$general$2d$config$2d$tab$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/settings/pkgx/components/general-config-tab.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$pkgx$2f$components$2f$category$2d$mapping$2d$tab$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/settings/pkgx/components/category-mapping-tab.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$pkgx$2f$components$2f$brand$2d$mapping$2d$tab$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/settings/pkgx/components/brand-mapping-tab.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$pkgx$2f$components$2f$price$2d$mapping$2d$tab$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/settings/pkgx/components/price-mapping-tab.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$pkgx$2f$components$2f$product$2d$mapping$2d$tab$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/settings/pkgx/components/product-mapping-tab.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$pkgx$2f$components$2f$sync$2d$settings$2d$tab$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/settings/pkgx/components/sync-settings-tab.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$pkgx$2f$components$2f$log$2d$tab$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/settings/pkgx/components/log-tab.tsx [app-ssr] (ecmascript)");
;
;
;
;
;
;
;
const PKGX_TABS = [
    {
        value: 'general',
        label: 'Cấu hình chung'
    },
    {
        value: 'category-mapping',
        label: 'Mapping danh mục'
    },
    {
        value: 'brand-mapping',
        label: 'Mapping thương hiệu'
    },
    {
        value: 'price-mapping',
        label: 'Mapping giá'
    },
    {
        value: 'product-mapping',
        label: 'Sản phẩm đã liên kết'
    },
    {
        value: 'sync',
        label: 'Auto Sync'
    },
    {
        value: 'logs',
        label: 'Logs'
    }
];
function PkgxSettingsPage() {
    const [activeTab, setActiveTab] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"]('general');
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$use$2d$settings$2d$page$2d$header$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useSettingsPageHeader"])({
        title: 'Website phukiengiaxuong.com.vn',
        icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$globe$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Globe$3e$__["Globe"], {
            className: "h-5 w-5 text-rose-600"
        }, void 0, false, {
            fileName: "[project]/features/settings/pkgx/pkgx-settings-page.tsx",
            lineNumber: 31,
            columnNumber: 11
        }, this),
        breadcrumb: [
            {
                label: 'Tích hợp PKGX',
                href: '/settings/pkgx',
                isCurrent: true
            }
        ]
    });
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$settings$2f$SettingsVerticalTabs$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SettingsVerticalTabs"], {
        value: activeTab,
        onValueChange: setActiveTab,
        tabs: PKGX_TABS,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$tabs$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TabsContent"], {
                value: "general",
                className: "mt-0",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$pkgx$2f$components$2f$general$2d$config$2d$tab$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["GeneralConfigTab"], {}, void 0, false, {
                    fileName: "[project]/features/settings/pkgx/pkgx-settings-page.tsx",
                    lineNumber: 44,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/features/settings/pkgx/pkgx-settings-page.tsx",
                lineNumber: 43,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$tabs$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TabsContent"], {
                value: "category-mapping",
                className: "mt-0",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$pkgx$2f$components$2f$category$2d$mapping$2d$tab$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CategoryMappingTab"], {}, void 0, false, {
                    fileName: "[project]/features/settings/pkgx/pkgx-settings-page.tsx",
                    lineNumber: 48,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/features/settings/pkgx/pkgx-settings-page.tsx",
                lineNumber: 47,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$tabs$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TabsContent"], {
                value: "brand-mapping",
                className: "mt-0",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$pkgx$2f$components$2f$brand$2d$mapping$2d$tab$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["BrandMappingTab"], {}, void 0, false, {
                    fileName: "[project]/features/settings/pkgx/pkgx-settings-page.tsx",
                    lineNumber: 52,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/features/settings/pkgx/pkgx-settings-page.tsx",
                lineNumber: 51,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$tabs$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TabsContent"], {
                value: "price-mapping",
                className: "mt-0",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$pkgx$2f$components$2f$price$2d$mapping$2d$tab$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["PriceMappingTab"], {}, void 0, false, {
                    fileName: "[project]/features/settings/pkgx/pkgx-settings-page.tsx",
                    lineNumber: 56,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/features/settings/pkgx/pkgx-settings-page.tsx",
                lineNumber: 55,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$tabs$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TabsContent"], {
                value: "product-mapping",
                className: "mt-0",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$pkgx$2f$components$2f$product$2d$mapping$2d$tab$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ProductMappingTab"], {}, void 0, false, {
                    fileName: "[project]/features/settings/pkgx/pkgx-settings-page.tsx",
                    lineNumber: 60,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/features/settings/pkgx/pkgx-settings-page.tsx",
                lineNumber: 59,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$tabs$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TabsContent"], {
                value: "sync",
                className: "mt-0",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$pkgx$2f$components$2f$sync$2d$settings$2d$tab$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["SyncSettingsTab"], {}, void 0, false, {
                    fileName: "[project]/features/settings/pkgx/pkgx-settings-page.tsx",
                    lineNumber: 64,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/features/settings/pkgx/pkgx-settings-page.tsx",
                lineNumber: 63,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$tabs$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TabsContent"], {
                value: "logs",
                className: "mt-0",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$pkgx$2f$components$2f$log$2d$tab$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["LogTab"], {}, void 0, false, {
                    fileName: "[project]/features/settings/pkgx/pkgx-settings-page.tsx",
                    lineNumber: 68,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/features/settings/pkgx/pkgx-settings-page.tsx",
                lineNumber: 67,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/features/settings/pkgx/pkgx-settings-page.tsx",
        lineNumber: 38,
        columnNumber: 5
    }, this);
}
}),
];

//# sourceMappingURL=features_settings_pkgx_b4749314._.js.map