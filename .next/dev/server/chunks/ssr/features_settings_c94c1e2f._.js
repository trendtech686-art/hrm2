module.exports = [
"[project]/features/settings/use-settings-page-header.tsx [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useSettingsPageHeader",
    ()=>useSettingsPageHeader
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-jsx-dev-runtime.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$api$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/next/dist/api/navigation.react-server.js [app-rsc] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$components$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/components/navigation.react-server.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$settings$2d$2$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__Settings2$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/settings-2.js [app-rsc] (ecmascript) <export default as Settings2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$contexts$2f$page$2d$header$2d$context$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/contexts/page-header-context.tsx [app-rsc] (ecmascript)");
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
    const pathname = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$components$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["usePathname"])();
    const { title, icon, docLink, breadcrumb, ...rest } = options;
    const normalizedDocLink = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["useMemo"](()=>{
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
    const decoratedTitle = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["useMemo"](()=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
            className: "inline-flex items-center gap-2",
            children: [
                icon ?? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$settings$2d$2$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__Settings2$3e$__["Settings2"], {
                    className: "h-5 w-5 text-muted-foreground",
                    "aria-hidden": "true"
                }, void 0, false, {
                    fileName: "[project]/features/settings/use-settings-page-header.tsx",
                    lineNumber: 40,
                    columnNumber: 17
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
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
    const normalizedBreadcrumb = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["useMemo"](()=>{
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
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$contexts$2f$page$2d$header$2d$context$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["usePageHeader"])({
        ...rest,
        breadcrumb: normalizedBreadcrumb,
        title: decoratedTitle,
        docLink: normalizedDocLink
    });
}
}),
"[project]/features/settings/pkgx/types.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
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
"[project]/features/settings/pkgx/constants.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
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
"[project]/features/settings/pkgx/store.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
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
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/zustand/esm/react.mjs [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$pkgx$2f$types$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/settings/pkgx/types.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$pkgx$2f$constants$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/settings/pkgx/constants.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$pkgx$2f$api$2d$service$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/pkgx/api-service.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$contexts$2f$auth$2d$context$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/contexts/auth-context.tsx [app-rsc] (ecmascript)");
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
const usePkgxSettingsStore = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["create"])()((set, get)=>({
        // === Initial State ===
        settings: {
            ...__TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$pkgx$2f$types$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["DEFAULT_PKGX_SETTINGS"],
            categories: __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$pkgx$2f$constants$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["PKGX_CATEGORIES"],
            brands: __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$pkgx$2f$constants$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["PKGX_BRANDS"]
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
            const userInfo = (0, __TURBOPACK__imported__module__$5b$project$5d2f$contexts$2f$auth$2d$context$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getCurrentUserInfo"])();
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
                const response = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$pkgx$2f$api$2d$service$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getCategories"])();
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
                const response = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$pkgx$2f$api$2d$service$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getBrands"])();
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
                        categories: __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$pkgx$2f$constants$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["PKGX_CATEGORIES"],
                        brands: __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$pkgx$2f$constants$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["PKGX_BRANDS"]
                    }
                })),
        resetSettings: ()=>set({
                settings: {
                    ...__TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$pkgx$2f$types$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["DEFAULT_PKGX_SETTINGS"],
                    categories: __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$pkgx$2f$constants$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["PKGX_CATEGORIES"],
                    brands: __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$pkgx$2f$constants$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["PKGX_BRANDS"]
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
                                ...__TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$pkgx$2f$types$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["DEFAULT_PKGX_SETTINGS"],
                                categories: __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$pkgx$2f$constants$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["PKGX_CATEGORIES"],
                                brands: __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$pkgx$2f$constants$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["PKGX_BRANDS"],
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
"[project]/features/settings/pkgx/components/general-config-tab.tsx [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GeneralConfigTab",
    ()=>GeneralConfigTab
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-jsx-dev-runtime.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/card.tsx [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$label$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/label.tsx [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$input$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/input.tsx [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/button.tsx [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$switch$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/switch.tsx [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$badge$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/badge.tsx [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$eye$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__Eye$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/eye.js [app-rsc] (ecmascript) <export default as Eye>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$eye$2d$off$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__EyeOff$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/eye-off.js [app-rsc] (ecmascript) <export default as EyeOff>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$refresh$2d$cw$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__RefreshCw$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/refresh-cw.js [app-rsc] (ecmascript) <export default as RefreshCw>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle2$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/circle-check.js [app-rsc] (ecmascript) <export default as CheckCircle2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$x$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__XCircle$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/circle-x.js [app-rsc] (ecmascript) <export default as XCircle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/loader-circle.js [app-rsc] (ecmascript) <export default as Loader2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$save$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__Save$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/save.js [app-rsc] (ecmascript) <export default as Save>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/sonner/dist/index.mjs [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$pkgx$2f$store$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/settings/pkgx/store.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$pkgx$2f$constants$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/settings/pkgx/constants.ts [app-rsc] (ecmascript)");
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
function GeneralConfigTab() {
    const { settings, setApiUrl, setApiKey, setEnabled, setConnectionStatus, updateSyncSetting, addLog } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$pkgx$2f$store$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["usePkgxSettingsStore"])();
    const [showApiKey, setShowApiKey] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["useState"](false);
    const [isTesting, setIsTesting] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["useState"](false);
    const [localApiUrl, setLocalApiUrl] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["useState"](settings.apiUrl);
    const [localApiKey, setLocalApiKey] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["useState"](settings.apiKey);
    const handleSaveConfig = ()=>{
        setApiUrl(localApiUrl);
        setApiKey(localApiKey);
        addLog({
            action: 'save_config',
            status: 'success',
            message: 'Đã lưu cấu hình API',
            details: {
                url: localApiUrl
            }
        });
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["toast"].success('Đã lưu cấu hình API');
    };
    const handleTestConnection = async ()=>{
        if (!localApiKey) {
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["toast"].error('Vui lòng nhập API Key trước khi test');
            return;
        }
        setIsTesting(true);
        const startTime = Date.now();
        try {
            // Step 1: Ping server (không cần API key) để kiểm tra server hoạt động
            const pingUrl = `${localApiUrl}?action=ping`;
            const pingResponse = await fetch(pingUrl, {
                method: 'GET'
            });
            if (!pingResponse.ok) {
                addLog({
                    action: 'ping',
                    status: 'error',
                    message: `Server không phản hồi`,
                    details: {
                        url: pingUrl,
                        httpStatus: pingResponse.status
                    }
                });
                throw new Error(`Server không phản hồi (HTTP ${pingResponse.status})`);
            }
            // Verify ping response is valid JSON
            const pingText = await pingResponse.text();
            try {
                JSON.parse(pingText);
            } catch  {
                // Lấy tên file từ URL người dùng nhập
                const apiFileName = localApiUrl.split('/').pop() || 'api_product_hrm.php';
                addLog({
                    action: 'ping',
                    status: 'error',
                    message: 'Server trả về lỗi PHP thay vì JSON',
                    details: {
                        url: pingUrl,
                        error: pingText.substring(0, 100)
                    }
                });
                throw new Error(`Server có lỗi PHP. Vui lòng upload lại file ${apiFileName}`);
            }
            addLog({
                action: 'ping',
                status: 'success',
                message: 'Server hoạt động',
                details: {
                    url: pingUrl,
                    responseTime: Date.now() - startTime
                }
            });
            // Step 2: Test với API key
            const testUrl = `${localApiUrl}?action=test`;
            const testStartTime = Date.now();
            const response = await fetch(testUrl, {
                method: 'GET',
                headers: {
                    'X-API-KEY': localApiKey
                }
            });
            // Check if response is JSON
            const contentType = response.headers.get('content-type');
            const responseText = await response.text();
            let data;
            try {
                data = JSON.parse(responseText);
            } catch (parseError) {
                // PHP trả về HTML error thay vì JSON
                const errorPreview = responseText.substring(0, 200);
                console.error('Invalid JSON response:', errorPreview);
                throw new Error(`Server trả về lỗi PHP. Kiểm tra file API trên server.`);
            }
            if (!data.error) {
                setConnectionStatus('connected');
                const stats = data.stats || {};
                addLog({
                    action: 'test_connection',
                    status: 'success',
                    message: `Kết nối thành công! SP: ${stats.total_products}, DM: ${stats.total_categories}, TH: ${stats.total_brands}`,
                    details: {
                        url: testUrl,
                        responseTime: Date.now() - testStartTime,
                        total: stats.total_products
                    }
                });
                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["toast"].success(`Kết nối thành công! Sản phẩm: ${stats.total_products || 0}, Danh mục: ${stats.total_categories || 0}, Thương hiệu: ${stats.total_brands || 0}`);
            } else {
                setConnectionStatus('error', data.message);
                addLog({
                    action: 'test_connection',
                    status: 'error',
                    message: `Lỗi xác thực: ${data.message}`,
                    details: {
                        url: testUrl,
                        error: data.message
                    }
                });
                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["toast"].error(`Lỗi: ${data.message}`);
            }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Không thể kết nối';
            setConnectionStatus('error', errorMessage);
            addLog({
                action: 'test_connection',
                status: 'error',
                message: `Lỗi kết nối: ${errorMessage}`,
                details: {
                    error: errorMessage,
                    responseTime: Date.now() - startTime
                }
            });
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["toast"].error(`Không thể kết nối đến server PKGX: ${errorMessage}`);
        } finally{
            setIsTesting(false);
        }
    };
    const getStatusBadge = ()=>{
        switch(settings.connectionStatus){
            case 'connected':
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$badge$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Badge"], {
                    variant: "default",
                    className: "bg-green-500",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle2$3e$__["CheckCircle2"], {
                            className: "h-3 w-3 mr-1"
                        }, void 0, false, {
                            fileName: "[project]/features/settings/pkgx/components/general-config-tab.tsx",
                            lineNumber: 147,
                            columnNumber: 66
                        }, this),
                        "Đã kết nối"
                    ]
                }, void 0, true, {
                    fileName: "[project]/features/settings/pkgx/components/general-config-tab.tsx",
                    lineNumber: 147,
                    columnNumber: 16
                }, this);
            case 'error':
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$badge$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Badge"], {
                    variant: "destructive",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$x$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__XCircle$3e$__["XCircle"], {
                            className: "h-3 w-3 mr-1"
                        }, void 0, false, {
                            fileName: "[project]/features/settings/pkgx/components/general-config-tab.tsx",
                            lineNumber: 149,
                            columnNumber: 45
                        }, this),
                        "Lỗi kết nối"
                    ]
                }, void 0, true, {
                    fileName: "[project]/features/settings/pkgx/components/general-config-tab.tsx",
                    lineNumber: 149,
                    columnNumber: 16
                }, this);
            default:
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$badge$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Badge"], {
                    variant: "secondary",
                    children: "Chưa kết nối"
                }, void 0, false, {
                    fileName: "[project]/features/settings/pkgx/components/general-config-tab.tsx",
                    lineNumber: 151,
                    columnNumber: 16
                }, this);
        }
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "space-y-6",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Card"], {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["CardHeader"], {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["CardTitle"], {
                                className: "text-lg",
                                children: "Thông tin kết nối API"
                            }, void 0, false, {
                                fileName: "[project]/features/settings/pkgx/components/general-config-tab.tsx",
                                lineNumber: 160,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["CardDescription"], {
                                children: "Cấu hình kết nối với website phukiengiaxuong.com.vn"
                            }, void 0, false, {
                                fileName: "[project]/features/settings/pkgx/components/general-config-tab.tsx",
                                lineNumber: 161,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/features/settings/pkgx/components/general-config-tab.tsx",
                        lineNumber: 159,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["CardContent"], {
                        className: "space-y-4",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "space-y-2",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$label$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Label"], {
                                        htmlFor: "apiUrl",
                                        children: "API URL"
                                    }, void 0, false, {
                                        fileName: "[project]/features/settings/pkgx/components/general-config-tab.tsx",
                                        lineNumber: 165,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$input$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Input"], {
                                        id: "apiUrl",
                                        value: localApiUrl,
                                        onChange: (e)=>setLocalApiUrl(e.target.value),
                                        placeholder: __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$pkgx$2f$constants$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["PKGX_API_CONFIG"].baseUrl
                                    }, void 0, false, {
                                        fileName: "[project]/features/settings/pkgx/components/general-config-tab.tsx",
                                        lineNumber: 166,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/features/settings/pkgx/components/general-config-tab.tsx",
                                lineNumber: 164,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "space-y-2",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$label$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Label"], {
                                        htmlFor: "apiKey",
                                        children: "API Key"
                                    }, void 0, false, {
                                        fileName: "[project]/features/settings/pkgx/components/general-config-tab.tsx",
                                        lineNumber: 175,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex gap-2",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "relative flex-1",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$input$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Input"], {
                                                    id: "apiKey",
                                                    type: showApiKey ? 'text' : 'password',
                                                    value: localApiKey,
                                                    onChange: (e)=>setLocalApiKey(e.target.value),
                                                    placeholder: "Nhập API Key...",
                                                    className: "pr-10"
                                                }, void 0, false, {
                                                    fileName: "[project]/features/settings/pkgx/components/general-config-tab.tsx",
                                                    lineNumber: 178,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Button"], {
                                                    type: "button",
                                                    variant: "ghost",
                                                    size: "icon",
                                                    className: "absolute right-0 top-0 h-full",
                                                    onClick: ()=>setShowApiKey(!showApiKey),
                                                    children: showApiKey ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$eye$2d$off$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__EyeOff$3e$__["EyeOff"], {
                                                        className: "h-4 w-4"
                                                    }, void 0, false, {
                                                        fileName: "[project]/features/settings/pkgx/components/general-config-tab.tsx",
                                                        lineNumber: 193,
                                                        columnNumber: 33
                                                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$eye$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__Eye$3e$__["Eye"], {
                                                        className: "h-4 w-4"
                                                    }, void 0, false, {
                                                        fileName: "[project]/features/settings/pkgx/components/general-config-tab.tsx",
                                                        lineNumber: 193,
                                                        columnNumber: 66
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/features/settings/pkgx/components/general-config-tab.tsx",
                                                    lineNumber: 186,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/features/settings/pkgx/components/general-config-tab.tsx",
                                            lineNumber: 177,
                                            columnNumber: 15
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/features/settings/pkgx/components/general-config-tab.tsx",
                                        lineNumber: 176,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/features/settings/pkgx/components/general-config-tab.tsx",
                                lineNumber: 174,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center gap-2 pt-2",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Button"], {
                                        onClick: handleSaveConfig,
                                        variant: "default",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$save$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__Save$3e$__["Save"], {
                                                className: "h-4 w-4 mr-2"
                                            }, void 0, false, {
                                                fileName: "[project]/features/settings/pkgx/components/general-config-tab.tsx",
                                                lineNumber: 201,
                                                columnNumber: 15
                                            }, this),
                                            "Lưu cấu hình"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/features/settings/pkgx/components/general-config-tab.tsx",
                                        lineNumber: 200,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Button"], {
                                        onClick: handleTestConnection,
                                        disabled: isTesting,
                                        variant: "outline",
                                        children: [
                                            isTesting ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__["Loader2"], {
                                                className: "h-4 w-4 mr-2 animate-spin"
                                            }, void 0, false, {
                                                fileName: "[project]/features/settings/pkgx/components/general-config-tab.tsx",
                                                lineNumber: 205,
                                                columnNumber: 28
                                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$refresh$2d$cw$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__RefreshCw$3e$__["RefreshCw"], {
                                                className: "h-4 w-4 mr-2"
                                            }, void 0, false, {
                                                fileName: "[project]/features/settings/pkgx/components/general-config-tab.tsx",
                                                lineNumber: 205,
                                                columnNumber: 80
                                            }, this),
                                            "Test Connection"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/features/settings/pkgx/components/general-config-tab.tsx",
                                        lineNumber: 204,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/features/settings/pkgx/components/general-config-tab.tsx",
                                lineNumber: 199,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center gap-3",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-sm text-muted-foreground",
                                        children: "Trạng thái:"
                                    }, void 0, false, {
                                        fileName: "[project]/features/settings/pkgx/components/general-config-tab.tsx",
                                        lineNumber: 211,
                                        columnNumber: 13
                                    }, this),
                                    getStatusBadge()
                                ]
                            }, void 0, true, {
                                fileName: "[project]/features/settings/pkgx/components/general-config-tab.tsx",
                                lineNumber: 210,
                                columnNumber: 11
                            }, this),
                            settings.connectionError && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-sm text-destructive",
                                children: settings.connectionError
                            }, void 0, false, {
                                fileName: "[project]/features/settings/pkgx/components/general-config-tab.tsx",
                                lineNumber: 216,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/features/settings/pkgx/components/general-config-tab.tsx",
                        lineNumber: 163,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/features/settings/pkgx/components/general-config-tab.tsx",
                lineNumber: 158,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Card"], {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["CardHeader"], {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["CardTitle"], {
                                className: "text-lg",
                                children: "Trạng thái tích hợp"
                            }, void 0, false, {
                                fileName: "[project]/features/settings/pkgx/components/general-config-tab.tsx",
                                lineNumber: 224,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["CardDescription"], {
                                children: "Bật/tắt đồng bộ với PKGX"
                            }, void 0, false, {
                                fileName: "[project]/features/settings/pkgx/components/general-config-tab.tsx",
                                lineNumber: 225,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/features/settings/pkgx/components/general-config-tab.tsx",
                        lineNumber: 223,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["CardContent"], {
                        className: "space-y-4",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center justify-between",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "font-medium",
                                                children: "Bật tích hợp PKGX"
                                            }, void 0, false, {
                                                fileName: "[project]/features/settings/pkgx/components/general-config-tab.tsx",
                                                lineNumber: 230,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-sm text-muted-foreground",
                                                children: "Cho phép đồng bộ sản phẩm với website"
                                            }, void 0, false, {
                                                fileName: "[project]/features/settings/pkgx/components/general-config-tab.tsx",
                                                lineNumber: 231,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/features/settings/pkgx/components/general-config-tab.tsx",
                                        lineNumber: 229,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$switch$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Switch"], {
                                        checked: settings.enabled,
                                        onCheckedChange: setEnabled
                                    }, void 0, false, {
                                        fileName: "[project]/features/settings/pkgx/components/general-config-tab.tsx",
                                        lineNumber: 233,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/features/settings/pkgx/components/general-config-tab.tsx",
                                lineNumber: 228,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center justify-between",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "font-medium",
                                                children: "Bật Auto Sync"
                                            }, void 0, false, {
                                                fileName: "[project]/features/settings/pkgx/components/general-config-tab.tsx",
                                                lineNumber: 238,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-sm text-muted-foreground",
                                                children: "Tự động đồng bộ dữ liệu theo lịch"
                                            }, void 0, false, {
                                                fileName: "[project]/features/settings/pkgx/components/general-config-tab.tsx",
                                                lineNumber: 239,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/features/settings/pkgx/components/general-config-tab.tsx",
                                        lineNumber: 237,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$switch$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Switch"], {
                                        checked: settings.syncSettings.autoSyncEnabled,
                                        onCheckedChange: (checked)=>updateSyncSetting('autoSyncEnabled', checked)
                                    }, void 0, false, {
                                        fileName: "[project]/features/settings/pkgx/components/general-config-tab.tsx",
                                        lineNumber: 241,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/features/settings/pkgx/components/general-config-tab.tsx",
                                lineNumber: 236,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/features/settings/pkgx/components/general-config-tab.tsx",
                        lineNumber: 227,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/features/settings/pkgx/components/general-config-tab.tsx",
                lineNumber: 222,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Card"], {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["CardHeader"], {
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["CardTitle"], {
                            className: "text-lg",
                            children: "Thống kê"
                        }, void 0, false, {
                            fileName: "[project]/features/settings/pkgx/components/general-config-tab.tsx",
                            lineNumber: 252,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/features/settings/pkgx/components/general-config-tab.tsx",
                        lineNumber: 251,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["CardContent"], {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "grid grid-cols-2 md:grid-cols-4 gap-4",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "text-center p-3 bg-muted rounded-lg",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-2xl font-bold",
                                                children: settings.categories.length
                                            }, void 0, false, {
                                                fileName: "[project]/features/settings/pkgx/components/general-config-tab.tsx",
                                                lineNumber: 257,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-sm text-muted-foreground",
                                                children: "Danh mục PKGX"
                                            }, void 0, false, {
                                                fileName: "[project]/features/settings/pkgx/components/general-config-tab.tsx",
                                                lineNumber: 258,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/features/settings/pkgx/components/general-config-tab.tsx",
                                        lineNumber: 256,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "text-center p-3 bg-muted rounded-lg",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-2xl font-bold",
                                                children: settings.brands.length
                                            }, void 0, false, {
                                                fileName: "[project]/features/settings/pkgx/components/general-config-tab.tsx",
                                                lineNumber: 261,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-sm text-muted-foreground",
                                                children: "Thương hiệu PKGX"
                                            }, void 0, false, {
                                                fileName: "[project]/features/settings/pkgx/components/general-config-tab.tsx",
                                                lineNumber: 262,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/features/settings/pkgx/components/general-config-tab.tsx",
                                        lineNumber: 260,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "text-center p-3 bg-muted rounded-lg",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-2xl font-bold",
                                                children: settings.categoryMappings.length
                                            }, void 0, false, {
                                                fileName: "[project]/features/settings/pkgx/components/general-config-tab.tsx",
                                                lineNumber: 265,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-sm text-muted-foreground",
                                                children: "Mapping danh mục"
                                            }, void 0, false, {
                                                fileName: "[project]/features/settings/pkgx/components/general-config-tab.tsx",
                                                lineNumber: 266,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/features/settings/pkgx/components/general-config-tab.tsx",
                                        lineNumber: 264,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "text-center p-3 bg-muted rounded-lg",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-2xl font-bold",
                                                children: settings.brandMappings.length
                                            }, void 0, false, {
                                                fileName: "[project]/features/settings/pkgx/components/general-config-tab.tsx",
                                                lineNumber: 269,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-sm text-muted-foreground",
                                                children: "Mapping thương hiệu"
                                            }, void 0, false, {
                                                fileName: "[project]/features/settings/pkgx/components/general-config-tab.tsx",
                                                lineNumber: 270,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/features/settings/pkgx/components/general-config-tab.tsx",
                                        lineNumber: 268,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/features/settings/pkgx/components/general-config-tab.tsx",
                                lineNumber: 255,
                                columnNumber: 11
                            }, this),
                            settings.lastSyncAt && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-sm text-muted-foreground mt-4",
                                children: [
                                    "Lần sync cuối: ",
                                    new Date(settings.lastSyncAt).toLocaleString('vi-VN')
                                ]
                            }, void 0, true, {
                                fileName: "[project]/features/settings/pkgx/components/general-config-tab.tsx",
                                lineNumber: 274,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/features/settings/pkgx/components/general-config-tab.tsx",
                        lineNumber: 254,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/features/settings/pkgx/components/general-config-tab.tsx",
                lineNumber: 250,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/features/settings/pkgx/components/general-config-tab.tsx",
        lineNumber: 156,
        columnNumber: 5
    }, this);
}
}),
"[project]/features/settings/inventory/product-category-store.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useProductCategoryStore",
    ()=>useProductCategoryStore
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/zustand/esm/react.mjs [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/id-types.ts [app-rsc] (ecmascript)");
;
;
const generateSystemId = (counter)=>{
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["asSystemId"])(`CATEGORY${String(counter + 1).padStart(6, '0')}`);
};
const generateBusinessId = (counter)=>{
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["asBusinessId"])(`DM${String(counter + 1).padStart(6, '0')}`);
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
const useProductCategoryStore = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["create"])()((set, get)=>({
        data: [],
        counter: 0,
        initialized: false,
        add: (category)=>{
            const currentCounter = get().counter;
            const allData = get().data;
            const { id, ...rest } = category;
            const businessId = id && id.trim() ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["asBusinessId"])(id.trim()) : generateBusinessId(currentCounter);
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
                                systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["asSystemId"])(item.systemId),
                                id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["asBusinessId"])(item.id),
                                parentId: item.parentId ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["asSystemId"])(item.parentId) : undefined,
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
"[project]/features/settings/pkgx/validation/category-mapping-validation.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
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
"[project]/features/settings/pkgx/validation/brand-mapping-validation.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
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
"[project]/features/settings/pkgx/validation/product-mapping-validation.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
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
"[project]/features/settings/pkgx/validation/index.ts [app-rsc] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
// Category Mapping Validation
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$pkgx$2f$validation$2f$category$2d$mapping$2d$validation$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/settings/pkgx/validation/category-mapping-validation.ts [app-rsc] (ecmascript)");
// Brand Mapping Validation
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$pkgx$2f$validation$2f$brand$2d$mapping$2d$validation$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/settings/pkgx/validation/brand-mapping-validation.ts [app-rsc] (ecmascript)");
// Product Mapping Validation
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$pkgx$2f$validation$2f$product$2d$mapping$2d$validation$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/settings/pkgx/validation/product-mapping-validation.ts [app-rsc] (ecmascript)");
;
;
;
}),
"[project]/features/settings/pkgx/hooks/use-category-mapping-validation.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useCategoryMappingValidation",
    ()=>useCategoryMappingValidation,
    "useFieldValidation",
    ()=>useFieldValidation
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$pkgx$2f$validation$2f$index$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/features/settings/pkgx/validation/index.ts [app-rsc] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$pkgx$2f$validation$2f$category$2d$mapping$2d$validation$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/settings/pkgx/validation/category-mapping-validation.ts [app-rsc] (ecmascript)");
;
;
function useCategoryMappingValidation(options) {
    const { existingMappings, hrmCategories, pkgxCategories, editingMappingId, debounceMs = 300 } = options;
    const [validationResult, setValidationResult] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["useState"](null);
    const [isValidating, setIsValidating] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["useState"](false);
    const [suggestions, setSuggestions] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["useState"]([]);
    const debounceTimerRef = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["useRef"](null);
    // Create validation context
    const context = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["useMemo"](()=>({
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
    const validate = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["useCallback"]((input)=>{
        const result = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$pkgx$2f$validation$2f$category$2d$mapping$2d$validation$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["validateCategoryMapping"])(input, context);
        setValidationResult(result);
        // Update suggestions based on HRM category name
        if (input.hrmCategorySystemId) {
            const hrmCat = hrmCategories.find((c)=>c.systemId === input.hrmCategorySystemId);
            if (hrmCat) {
                const newSuggestions = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$pkgx$2f$validation$2f$category$2d$mapping$2d$validation$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["suggestMatchingCategories"])(hrmCat.name, pkgxCategories);
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
    const validateAsync = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["useCallback"](async (input)=>{
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
    const clearValidation = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["useCallback"](()=>{
        setValidationResult(null);
        setSuggestions([]);
        if (debounceTimerRef.current) {
            clearTimeout(debounceTimerRef.current);
        }
    }, []);
    // Cleanup on unmount
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["useEffect"](()=>{
        return ()=>{
            if (debounceTimerRef.current) {
                clearTimeout(debounceTimerRef.current);
            }
        };
    }, []);
    // Computed values
    const hasErrors = validationResult ? validationResult.errors.length > 0 : false;
    const hasWarnings = validationResult ? validationResult.warnings.length > 0 : false;
    const getFieldError = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["useCallback"]((field)=>{
        if (!validationResult) return undefined;
        const error = validationResult.errors.find((e)=>e.field === field);
        return error?.message;
    }, [
        validationResult
    ]);
    const getFieldWarning = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["useCallback"]((field)=>{
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
    const [error, setError] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["useState"]();
    const [touched, setTouched] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["useState"](false);
    const validate = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["useCallback"]((value)=>{
        const errorMessage = validator(value);
        setError(errorMessage);
        return !errorMessage;
    }, [
        validator
    ]);
    const handleBlur = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["useCallback"](()=>{
        setTouched(true);
    }, []);
    const reset = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["useCallback"](()=>{
        setError(undefined);
        setTouched(false);
    }, []);
    // Validate initial value
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["useEffect"](()=>{
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
"[project]/features/settings/pkgx/hooks/use-brand-mapping-validation.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useBrandMappingValidation",
    ()=>useBrandMappingValidation
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$pkgx$2f$validation$2f$index$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/features/settings/pkgx/validation/index.ts [app-rsc] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$pkgx$2f$validation$2f$brand$2d$mapping$2d$validation$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/settings/pkgx/validation/brand-mapping-validation.ts [app-rsc] (ecmascript)");
;
;
function useBrandMappingValidation(options) {
    const { existingMappings, hrmBrands, pkgxBrands, editingMappingId, debounceMs = 300 } = options;
    const [validationResult, setValidationResult] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["useState"](null);
    const [isValidating, setIsValidating] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["useState"](false);
    const [suggestions, setSuggestions] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["useState"]([]);
    const debounceTimerRef = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["useRef"](null);
    // Create validation context
    const context = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["useMemo"](()=>({
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
    const validate = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["useCallback"]((input)=>{
        const result = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$pkgx$2f$validation$2f$brand$2d$mapping$2d$validation$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["validateBrandMapping"])(input, context);
        setValidationResult(result);
        // Update suggestions based on HRM brand name
        if (input.hrmBrandSystemId) {
            const hrmBrand = hrmBrands.find((b)=>b.systemId === input.hrmBrandSystemId);
            if (hrmBrand) {
                const newSuggestions = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$pkgx$2f$validation$2f$brand$2d$mapping$2d$validation$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["suggestMatchingBrands"])(hrmBrand.name, pkgxBrands);
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
    const validateAsync = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["useCallback"](async (input)=>{
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
    const clearValidation = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["useCallback"](()=>{
        setValidationResult(null);
        setSuggestions([]);
        if (debounceTimerRef.current) {
            clearTimeout(debounceTimerRef.current);
        }
    }, []);
    // Cleanup on unmount
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["useEffect"](()=>{
        return ()=>{
            if (debounceTimerRef.current) {
                clearTimeout(debounceTimerRef.current);
            }
        };
    }, []);
    // Computed values
    const hasErrors = validationResult ? validationResult.errors.length > 0 : false;
    const hasWarnings = validationResult ? validationResult.warnings.length > 0 : false;
    const getFieldError = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["useCallback"]((field)=>{
        if (!validationResult) return undefined;
        const error = validationResult.errors.find((e)=>e.field === field);
        return error?.message;
    }, [
        validationResult
    ]);
    const getFieldWarning = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["useCallback"]((field)=>{
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
"[project]/features/settings/pkgx/hooks/use-pkgx-entity-sync.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "SYNC_ACTIONS",
    ()=>SYNC_ACTIONS,
    "usePkgxEntitySync",
    ()=>usePkgxEntitySync
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/sonner/dist/index.mjs [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$refresh$2d$cw$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__RefreshCw$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/refresh-cw.js [app-rsc] (ecmascript) <export default as RefreshCw>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$search$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__Search$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/search.js [app-rsc] (ecmascript) <export default as Search>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$text$2d$align$2d$start$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__AlignLeft$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/text-align-start.js [app-rsc] (ecmascript) <export default as AlignLeft>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$folder$2d$pen$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__FolderEdit$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/folder-pen.js [app-rsc] (ecmascript) <export default as FolderEdit>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$dollar$2d$sign$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__DollarSign$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/dollar-sign.js [app-rsc] (ecmascript) <export default as DollarSign>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$package$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__Package$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/package.js [app-rsc] (ecmascript) <export default as Package>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$tag$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__Tag$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/tag.js [app-rsc] (ecmascript) <export default as Tag>");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$pkgx$2f$api$2d$service$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/pkgx/api-service.ts [app-rsc] (ecmascript)");
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
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$refresh$2d$cw$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__RefreshCw$3e$__["RefreshCw"],
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
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$folder$2d$pen$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__FolderEdit$3e$__["FolderEdit"],
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
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$search$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__Search$3e$__["Search"],
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
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$text$2d$align$2d$start$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__AlignLeft$3e$__["AlignLeft"],
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
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$dollar$2d$sign$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__DollarSign$3e$__["DollarSign"],
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
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$package$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__Package$3e$__["Package"],
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
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$tag$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__Tag$3e$__["Tag"],
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
    const [isSyncing, setIsSyncing] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["useState"](false);
    const [confirmAction, setConfirmAction] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["useState"]({
        open: false,
        title: '',
        description: '',
        action: null
    });
    // Get available actions for this entity type
    const availableActions = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["useMemo"](()=>SYNC_ACTIONS.filter((action)=>action.supportedEntities.includes(entityType)), [
        entityType
    ]);
    // Primary action (sync all)
    const primaryAction = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["useMemo"](()=>availableActions.find((a)=>a.isPrimary), [
        availableActions
    ]);
    // Secondary actions (non-primary)
    const secondaryActions = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["useMemo"](()=>availableActions.filter((a)=>!a.isPrimary), [
        availableActions
    ]);
    // Confirm handler
    const handleConfirm = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["useCallback"]((title, description, action)=>{
        setConfirmAction({
            open: true,
            title,
            description,
            action
        });
    }, []);
    // Execute confirmed action
    const executeAction = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["useCallback"](()=>{
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
    const cancelConfirm = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["useCallback"](()=>{
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
    const syncCategory = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["useCallback"](async (pkgxCatId, hrmCategory, actionKey)=>{
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
                    const basicResponse = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$pkgx$2f$api$2d$service$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["updateCategoryBasic"])(pkgxCatId, payload);
                    if (basicResponse.success) {
                        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["toast"].success(successMessage);
                        onLog?.({
                            action: 'update_product',
                            status: 'success',
                            message: successMessage,
                            details: {
                                categoryId: pkgxCatId
                            }
                        });
                    } else {
                        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["toast"].error(basicResponse.error || 'Không thể đồng bộ');
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
            const response = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$pkgx$2f$api$2d$service$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["updateCategory"])(pkgxCatId, payload);
            if (response.success) {
                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["toast"].success(successMessage);
                onLog?.({
                    action: mapActionKeyToLogAction(actionKey),
                    status: 'success',
                    message: successMessage,
                    details: {
                        categoryId: pkgxCatId
                    }
                });
            } else {
                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["toast"].error(response.error || 'Không thể đồng bộ');
            }
            return response.success;
        } catch (error) {
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["toast"].error('Lỗi khi đồng bộ danh mục');
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
    const syncBrand = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["useCallback"](async (pkgxBrandId, hrmBrand, actionKey)=>{
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
            const response = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$pkgx$2f$api$2d$service$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["updateBrand"])(pkgxBrandId, payload);
            if (response.success) {
                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["toast"].success(successMessage);
                onLog?.({
                    action: mapActionKeyToLogAction(actionKey),
                    status: 'success',
                    message: successMessage,
                    details: {
                        brandId: pkgxBrandId
                    }
                });
            } else {
                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["toast"].error(response.error || 'Không thể đồng bộ');
            }
            return response.success;
        } catch (error) {
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["toast"].error('Lỗi khi đồng bộ thương hiệu');
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
    const syncProduct = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["useCallback"](async (pkgxProductId, hrmProduct, actionKey)=>{
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
            const response = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$pkgx$2f$api$2d$service$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["updateProduct"])(pkgxProductId, payload);
            if (response.success) {
                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["toast"].success(successMessage);
                onLog?.({
                    action: mapActionKeyToLogAction(actionKey),
                    status: 'success',
                    message: successMessage,
                    details: {
                        pkgxId: pkgxProductId
                    }
                });
            } else {
                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["toast"].error(response.error || 'Không thể đồng bộ');
            }
            return response.success;
        } catch (error) {
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["toast"].error('Lỗi khi đồng bộ sản phẩm');
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
    const sync = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["useCallback"](async (pkgxId, hrmData, actionKey)=>{
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
    const triggerSyncAction = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["useCallback"]((actionKey, pkgxId, hrmData, entityName)=>{
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
"[project]/features/settings/pkgx/hooks/use-pkgx-bulk-sync.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
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
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/sonner/dist/index.mjs [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$pkgx$2f$api$2d$service$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/pkgx/api-service.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$pkgx$2f$store$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/settings/pkgx/store.ts [app-rsc] (ecmascript)");
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
    const pkgxSettings = __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$pkgx$2f$store$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["usePkgxSettingsStore"].getState();
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
    const [confirmAction, setConfirmAction] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["useState"]({
        open: false,
        title: '',
        description: '',
        action: null,
        itemCount: 0
    });
    // Progress state
    const [progress, setProgress] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["useState"]({
        total: 0,
        completed: 0,
        success: 0,
        error: 0,
        isRunning: false
    });
    // Check if PKGX is enabled
    const checkPkgxEnabled = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["useCallback"](()=>{
        const pkgxSettings = __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$pkgx$2f$store$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["usePkgxSettingsStore"].getState();
        if (!pkgxSettings.settings.enabled) {
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["toast"].error('PKGX chưa được bật');
            return false;
        }
        return true;
    }, []);
    // Helper to get PKGX brand ID from brand mappings
    const getPkgxBrandId = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["useCallback"]((brand)=>{
        const pkgxSettings = __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$pkgx$2f$store$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["usePkgxSettingsStore"].getState();
        const mapping = pkgxSettings.settings.brandMappings.find((m)=>m.hrmBrandSystemId === brand.systemId);
        return mapping?.pkgxBrandId;
    }, []);
    // Execute bulk sync for products
    const executeBulkSyncProducts = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["useCallback"](async (products, actionKey)=>{
        const linkedProducts = products.filter((p)=>p.pkgxId);
        if (linkedProducts.length === 0) {
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["toast"].error('Không có sản phẩm nào đã liên kết PKGX');
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
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["toast"].info(`Đang ${actionLabel} ${linkedProducts.length} sản phẩm...`);
        let successCount = 0;
        let errorCount = 0;
        for(let i = 0; i < linkedProducts.length; i++){
            const product = linkedProducts[i];
            try {
                const payload = buildProductPayload(product, actionKey);
                const response = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$pkgx$2f$api$2d$service$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["updateProduct"])(product.pkgxId, payload);
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
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["toast"].success(`Đã ${actionLabel} ${successCount} sản phẩm`);
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
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["toast"].error(`Lỗi ${errorCount} sản phẩm`);
        }
    }, [
        onLog
    ]);
    // Execute bulk sync for brands
    const executeBulkSyncBrands = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["useCallback"](async (brands, actionKey)=>{
        const linkedBrands = brands.filter((b)=>getPkgxBrandId(b));
        if (linkedBrands.length === 0) {
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["toast"].error('Không có thương hiệu nào đã liên kết PKGX');
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
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["toast"].info(`Đang ${actionLabel} ${linkedBrands.length} thương hiệu...`);
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
                const response = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$pkgx$2f$api$2d$service$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["updateBrand"])(pkgxBrandId, payload);
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
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["toast"].success(`Đã ${actionLabel} ${successCount} thương hiệu`);
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
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["toast"].error(`Lỗi ${errorCount} thương hiệu`);
        }
    }, [
        getPkgxBrandId,
        onLog
    ]);
    // Trigger bulk sync with confirmation
    const triggerBulkSync = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["useCallback"]((items, actionKey)=>{
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
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["toast"].error(`Không có ${entityType === 'product' ? 'sản phẩm' : 'thương hiệu'} nào đã liên kết PKGX`);
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
    const executeAction = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["useCallback"](async ()=>{
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
    const cancelConfirm = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["useCallback"](()=>{
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
"[project]/features/settings/pkgx/hooks/index.ts [app-rsc] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$pkgx$2f$hooks$2f$use$2d$category$2d$mapping$2d$validation$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/settings/pkgx/hooks/use-category-mapping-validation.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$pkgx$2f$hooks$2f$use$2d$brand$2d$mapping$2d$validation$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/settings/pkgx/hooks/use-brand-mapping-validation.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$pkgx$2f$hooks$2f$use$2d$pkgx$2d$entity$2d$sync$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/settings/pkgx/hooks/use-pkgx-entity-sync.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$pkgx$2f$hooks$2f$use$2d$pkgx$2d$bulk$2d$sync$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/settings/pkgx/hooks/use-pkgx-bulk-sync.ts [app-rsc] (ecmascript)");
;
;
;
;
}),
"[project]/features/settings/pkgx/components/pkgx-sync-confirm-dialog.tsx [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "PkgxSyncConfirmDialog",
    ()=>PkgxSyncConfirmDialog
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-jsx-dev-runtime.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/loader-circle.js [app-rsc] (ecmascript) <export default as Loader2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$alert$2d$dialog$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/alert-dialog.tsx [app-rsc] (ecmascript)");
;
;
;
function PkgxSyncConfirmDialog({ confirmAction, isSyncing, onConfirm, onCancel }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$alert$2d$dialog$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["AlertDialog"], {
        open: confirmAction.open,
        onOpenChange: (open)=>!open && onCancel(),
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$alert$2d$dialog$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["AlertDialogContent"], {
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$alert$2d$dialog$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["AlertDialogHeader"], {
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$alert$2d$dialog$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["AlertDialogTitle"], {
                            children: confirmAction.title
                        }, void 0, false, {
                            fileName: "[project]/features/settings/pkgx/components/pkgx-sync-confirm-dialog.tsx",
                            lineNumber: 27,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$alert$2d$dialog$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["AlertDialogDescription"], {
                            children: confirmAction.description
                        }, void 0, false, {
                            fileName: "[project]/features/settings/pkgx/components/pkgx-sync-confirm-dialog.tsx",
                            lineNumber: 28,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/features/settings/pkgx/components/pkgx-sync-confirm-dialog.tsx",
                    lineNumber: 26,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$alert$2d$dialog$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["AlertDialogFooter"], {
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$alert$2d$dialog$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["AlertDialogCancel"], {
                            children: "Hủy"
                        }, void 0, false, {
                            fileName: "[project]/features/settings/pkgx/components/pkgx-sync-confirm-dialog.tsx",
                            lineNumber: 31,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$alert$2d$dialog$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["AlertDialogAction"], {
                            onClick: onConfirm,
                            disabled: isSyncing,
                            children: [
                                isSyncing && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__["Loader2"], {
                                    className: "h-4 w-4 mr-2 animate-spin"
                                }, void 0, false, {
                                    fileName: "[project]/features/settings/pkgx/components/pkgx-sync-confirm-dialog.tsx",
                                    lineNumber: 33,
                                    columnNumber: 27
                                }, this),
                                "Xác nhận"
                            ]
                        }, void 0, true, {
                            fileName: "[project]/features/settings/pkgx/components/pkgx-sync-confirm-dialog.tsx",
                            lineNumber: 32,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/features/settings/pkgx/components/pkgx-sync-confirm-dialog.tsx",
                    lineNumber: 30,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/features/settings/pkgx/components/pkgx-sync-confirm-dialog.tsx",
            lineNumber: 25,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/features/settings/pkgx/components/pkgx-sync-confirm-dialog.tsx",
        lineNumber: 24,
        columnNumber: 5
    }, this);
}
}),
"[project]/features/settings/pkgx/components/category-mapping-tab.tsx [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "CategoryMappingTab",
    ()=>CategoryMappingTab
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-jsx-dev-runtime.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/card.tsx [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/button.tsx [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$input$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/input.tsx [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$badge$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/badge.tsx [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$tabs$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/tabs.tsx [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/dialog.tsx [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$label$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/label.tsx [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$scroll$2d$area$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/scroll-area.tsx [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/plus.js [app-rsc] (ecmascript) <export default as Plus>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$pencil$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__Pencil$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/pencil.js [app-rsc] (ecmascript) <export default as Pencil>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trash$2d$2$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__Trash2$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/trash-2.js [app-rsc] (ecmascript) <export default as Trash2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$refresh$2d$cw$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__RefreshCw$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/refresh-cw.js [app-rsc] (ecmascript) <export default as RefreshCw>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$search$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__Search$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/search.js [app-rsc] (ecmascript) <export default as Search>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/loader-circle.js [app-rsc] (ecmascript) <export default as Loader2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$folder$2d$tree$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__FolderTree$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/folder-tree.js [app-rsc] (ecmascript) <export default as FolderTree>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$link$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__Link$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/link.js [app-rsc] (ecmascript) <export default as Link>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$unlink$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__Unlink$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/unlink.js [app-rsc] (ecmascript) <export default as Unlink>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle2$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/circle-check.js [app-rsc] (ecmascript) <export default as CheckCircle2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$ellipsis$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__MoreHorizontal$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/ellipsis.js [app-rsc] (ecmascript) <export default as MoreHorizontal>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$external$2d$link$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__ExternalLink$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/external-link.js [app-rsc] (ecmascript) <export default as ExternalLink>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$upload$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__Upload$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/upload.js [app-rsc] (ecmascript) <export default as Upload>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$text$2d$align$2d$start$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__AlignLeft$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/text-align-start.js [app-rsc] (ecmascript) <export default as AlignLeft>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$folder$2d$pen$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__FolderEdit$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/folder-pen.js [app-rsc] (ecmascript) <export default as FolderEdit>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$link$2d$2$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__Link2$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/link-2.js [app-rsc] (ecmascript) <export default as Link2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$checkbox$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/checkbox.tsx [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/dropdown-menu.tsx [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$pkgx$2f$api$2d$service$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/pkgx/api-service.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/sonner/dist/index.mjs [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$pkgx$2f$store$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/settings/pkgx/store.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$inventory$2f$product$2d$category$2d$store$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/settings/inventory/product-category-store.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$data$2d$table$2f$responsive$2d$data$2d$table$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/data-table/responsive-data-table.tsx [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$pkgx$2f$hooks$2f$index$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/features/settings/pkgx/hooks/index.ts [app-rsc] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$pkgx$2f$hooks$2f$use$2d$category$2d$mapping$2d$validation$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/settings/pkgx/hooks/use-category-mapping-validation.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$pkgx$2f$hooks$2f$use$2d$pkgx$2d$entity$2d$sync$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/settings/pkgx/hooks/use-pkgx-entity-sync.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$shared$2f$pkgx$2d$mapping$2d$dialog$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/shared/pkgx-mapping-dialog.tsx [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$pkgx$2f$components$2f$pkgx$2d$sync$2d$confirm$2d$dialog$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/settings/pkgx/components/pkgx-sync-confirm-dialog.tsx [app-rsc] (ecmascript)");
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
function CategoryMappingTab() {
    const { settings, addCategoryMapping, updateCategoryMapping, deleteCategoryMapping, syncCategoriesFromPkgx, addLog } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$pkgx$2f$store$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["usePkgxSettingsStore"])();
    const productCategories = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$inventory$2f$product$2d$category$2d$store$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["useProductCategoryStore"])();
    const [searchTerm, setSearchTerm] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["useState"]('');
    const [activeTab, setActiveTab] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["useState"]('pkgx-categories');
    const [isDialogOpen, setIsDialogOpen] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["useState"](false);
    const [editingMapping, setEditingMapping] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["useState"](null);
    const [isSyncing, setIsSyncing] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["useState"](false);
    // Detail dialog state
    const [isDetailDialogOpen, setIsDetailDialogOpen] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["useState"](false);
    const [selectedCategoryForDetail, setSelectedCategoryForDetail] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["useState"](null);
    const [isLoadingDetail, setIsLoadingDetail] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["useState"](false);
    const [isPushing, setIsPushing] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["useState"](false);
    // Table state
    const [pagination, setPagination] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["useState"]({
        pageIndex: 0,
        pageSize: 20
    });
    const [sorting, setSorting] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["useState"]({
        id: 'id',
        desc: false
    });
    const [rowSelection, setRowSelection] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["useState"]({});
    // Form state
    const [selectedHrmCategory, setSelectedHrmCategory] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["useState"]('');
    const [selectedPkgxCategory, setSelectedPkgxCategory] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["useState"]('');
    const [showWarningConfirm, setShowWarningConfirm] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["useState"](false);
    // Use shared PKGX entity sync hook
    const entitySync = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$pkgx$2f$hooks$2f$use$2d$pkgx$2d$entity$2d$sync$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["usePkgxEntitySync"])({
        entityType: 'category',
        onLog: addLog
    });
    const hrmCategories = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["useMemo"](()=>productCategories.getActive().sort((a, b)=>(a.path || '').localeCompare(b.path || '')), [
        productCategories
    ]);
    // Validation hook
    const validation = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$pkgx$2f$hooks$2f$use$2d$category$2d$mapping$2d$validation$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["useCategoryMappingValidation"])({
        existingMappings: settings.categoryMappings,
        hrmCategories: hrmCategories,
        pkgxCategories: settings.categories,
        editingMappingId: editingMapping?.id,
        debounceMs: 300
    });
    // Find if PKGX category is mapped
    const findMapping = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["useCallback"]((pkgxCatId)=>{
        return settings.categoryMappings.find((m)=>m.pkgxCatId === pkgxCatId);
    }, [
        settings.categoryMappings
    ]);
    // PKGX Categories data for table
    const pkgxCategoriesData = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["useMemo"](()=>{
        let filtered = settings.categories;
        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            filtered = settings.categories.filter((c)=>c.name.toLowerCase().includes(term) || c.id.toString().includes(term));
        }
        return filtered.map((c)=>({
                ...c,
                systemId: c.id.toString(),
                mappedToHrm: findMapping(c.id)?.hrmCategoryName
            }));
    }, [
        settings.categories,
        searchTerm,
        findMapping
    ]);
    // Mappings data for table
    const mappingsData = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["useMemo"](()=>{
        let filtered = settings.categoryMappings;
        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            filtered = settings.categoryMappings.filter((m)=>m.hrmCategoryName.toLowerCase().includes(term) || m.pkgxCatName.toLowerCase().includes(term));
        }
        return filtered.map((m)=>({
                ...m,
                systemId: m.id
            }));
    }, [
        settings.categoryMappings,
        searchTerm
    ]);
    // Paginated data
    const paginatedPkgxData = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["useMemo"](()=>{
        const start = pagination.pageIndex * pagination.pageSize;
        return pkgxCategoriesData.slice(start, start + pagination.pageSize);
    }, [
        pkgxCategoriesData,
        pagination
    ]);
    const paginatedMappingsData = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["useMemo"](()=>{
        const start = pagination.pageIndex * pagination.pageSize;
        return mappingsData.slice(start, start + pagination.pageSize);
    }, [
        mappingsData,
        pagination
    ]);
    // All selected rows and bulk actions for PKGX categories table
    const allSelectedPkgxRows = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["useMemo"](()=>paginatedPkgxData.filter((p)=>rowSelection[p.systemId]), [
        paginatedPkgxData,
        rowSelection
    ]);
    // Get selected PKGX categories that are NOT mapped (for bulk mapping)
    const selectedUnmappedCategories = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["useMemo"](()=>allSelectedPkgxRows.filter((c)=>!c.mappedToHrm), [
        allSelectedPkgxRows
    ]);
    // Get selected PKGX categories that ARE mapped (for bulk unlink)
    const selectedMappedCategories = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["useMemo"](()=>allSelectedPkgxRows.filter((c)=>c.mappedToHrm), [
        allSelectedPkgxRows
    ]);
    // Bulk actions for PKGX categories table
    const pkgxBulkActions = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["useMemo"](()=>[
            {
                label: `Hủy liên kết (${selectedMappedCategories.length})`,
                icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$unlink$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__Unlink$3e$__["Unlink"],
                variant: 'destructive',
                disabled: selectedMappedCategories.length === 0,
                onSelect: ()=>{
                    if (selectedMappedCategories.length === 0) {
                        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["toast"].error('Không có danh mục đã liên kết nào được chọn');
                        return;
                    }
                    // Bulk delete mappings
                    selectedMappedCategories.forEach((category)=>{
                        const mapping = findMapping(category.id);
                        if (mapping) {
                            deleteCategoryMapping(mapping.id);
                        }
                    });
                    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["toast"].success(`Đã hủy liên kết ${selectedMappedCategories.length} danh mục`);
                    setRowSelection({});
                }
            }
        ], [
        selectedMappedCategories,
        findMapping,
        deleteCategoryMapping
    ]);
    // PKGX Categories columns
    const pkgxColumns = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["useMemo"](()=>[
            {
                id: 'select',
                header: ({ isAllPageRowsSelected, isSomePageRowsSelected, onToggleAll })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$checkbox$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Checkbox"], {
                        checked: isAllPageRowsSelected ? true : isSomePageRowsSelected ? 'indeterminate' : false,
                        onCheckedChange: onToggleAll,
                        "aria-label": "Select all"
                    }, void 0, false, {
                        fileName: "[project]/features/settings/pkgx/components/category-mapping-tab.tsx",
                        lineNumber: 184,
                        columnNumber: 9
                    }, this),
                cell: ({ row, isSelected, onToggleSelect })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$checkbox$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Checkbox"], {
                        checked: isSelected,
                        onCheckedChange: onToggleSelect,
                        "aria-label": "Select row",
                        onClick: (e)=>e.stopPropagation()
                    }, void 0, false, {
                        fileName: "[project]/features/settings/pkgx/components/category-mapping-tab.tsx",
                        lineNumber: 191,
                        columnNumber: 9
                    }, this),
                size: 48,
                enableSorting: false,
                meta: {
                    sticky: 'left',
                    displayName: ''
                }
            },
            {
                id: 'id',
                accessorKey: 'id',
                header: 'ID',
                size: 70,
                cell: ({ row })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "font-mono text-xs",
                        children: row.id
                    }, void 0, false, {
                        fileName: "[project]/features/settings/pkgx/components/category-mapping-tab.tsx",
                        lineNumber: 207,
                        columnNumber: 26
                    }, this)
            },
            {
                id: 'name',
                accessorKey: 'name',
                header: 'Danh mục PKGX',
                cell: ({ row })=>{
                    // Gộp danh mục cha > danh mục con
                    const parent = row.parentId ? settings.categories.find((c)=>c.id === row.parentId) : null;
                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center gap-1",
                        children: [
                            parent && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Fragment"], {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-muted-foreground text-sm",
                                        children: parent.name
                                    }, void 0, false, {
                                        fileName: "[project]/features/settings/pkgx/components/category-mapping-tab.tsx",
                                        lineNumber: 220,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-muted-foreground",
                                        children: "›"
                                    }, void 0, false, {
                                        fileName: "[project]/features/settings/pkgx/components/category-mapping-tab.tsx",
                                        lineNumber: 221,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "font-medium",
                                children: row.name
                            }, void 0, false, {
                                fileName: "[project]/features/settings/pkgx/components/category-mapping-tab.tsx",
                                lineNumber: 224,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/features/settings/pkgx/components/category-mapping-tab.tsx",
                        lineNumber: 217,
                        columnNumber: 11
                    }, this);
                }
            },
            {
                id: 'mappedToHrm',
                header: 'Mapping HRM',
                cell: ({ row })=>row.mappedToHrm ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$badge$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Badge"], {
                        variant: "default",
                        className: "bg-green-500",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle2$3e$__["CheckCircle2"], {
                                className: "h-3 w-3 mr-1"
                            }, void 0, false, {
                                fileName: "[project]/features/settings/pkgx/components/category-mapping-tab.tsx",
                                lineNumber: 235,
                                columnNumber: 13
                            }, this),
                            row.mappedToHrm
                        ]
                    }, void 0, true, {
                        fileName: "[project]/features/settings/pkgx/components/category-mapping-tab.tsx",
                        lineNumber: 234,
                        columnNumber: 11
                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$badge$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Badge"], {
                        variant: "secondary",
                        children: "Chưa liên kết"
                    }, void 0, false, {
                        fileName: "[project]/features/settings/pkgx/components/category-mapping-tab.tsx",
                        lineNumber: 239,
                        columnNumber: 11
                    }, this)
            },
            {
                id: 'actions',
                header: '',
                size: 50,
                cell: ({ row })=>{
                    // Get HRM category for sync actions
                    const mapping = findMapping(row.id);
                    const hrmCategory = mapping ? hrmCategories.find((c)=>c.systemId === mapping.hrmCategorySystemId) : null;
                    // Helper to trigger sync with proper HRM data
                    const triggerSync = (actionKey)=>{
                        if (!mapping || !hrmCategory) {
                            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["toast"].error('Danh mục chưa được liên kết với HRM');
                            return;
                        }
                        const hrmData = {
                            systemId: hrmCategory.systemId,
                            name: hrmCategory.name,
                            isActive: hrmCategory.isActive,
                            seoKeywords: hrmCategory.seoKeywords,
                            seoTitle: hrmCategory.seoTitle,
                            metaDescription: hrmCategory.metaDescription,
                            shortDescription: hrmCategory.shortDescription,
                            longDescription: hrmCategory.longDescription,
                            websiteSeo: hrmCategory.websiteSeo
                        };
                        entitySync.triggerSyncAction(actionKey, row.id, hrmData, row.name);
                    };
                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["DropdownMenu"], {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["DropdownMenuTrigger"], {
                                asChild: true,
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Button"], {
                                    variant: "ghost",
                                    size: "icon",
                                    className: "h-8 w-8",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$ellipsis$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__MoreHorizontal$3e$__["MoreHorizontal"], {
                                        className: "h-4 w-4"
                                    }, void 0, false, {
                                        fileName: "[project]/features/settings/pkgx/components/category-mapping-tab.tsx",
                                        lineNumber: 276,
                                        columnNumber: 17
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/features/settings/pkgx/components/category-mapping-tab.tsx",
                                    lineNumber: 275,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/features/settings/pkgx/components/category-mapping-tab.tsx",
                                lineNumber: 274,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["DropdownMenuContent"], {
                                align: "end",
                                children: row.mappedToHrm ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Fragment"], {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["DropdownMenuItem"], {
                                            onClick: ()=>triggerSync('sync_all'),
                                            className: "font-medium",
                                            title: "Đồng bộ: Tên, Keywords, Meta Title, Meta Desc, Mô tả ngắn, Mô tả dài",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$refresh$2d$cw$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__RefreshCw$3e$__["RefreshCw"], {
                                                    className: "h-4 w-4 mr-2"
                                                }, void 0, false, {
                                                    fileName: "[project]/features/settings/pkgx/components/category-mapping-tab.tsx",
                                                    lineNumber: 288,
                                                    columnNumber: 21
                                                }, this),
                                                "Đồng bộ tất cả"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/features/settings/pkgx/components/category-mapping-tab.tsx",
                                            lineNumber: 283,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["DropdownMenuSeparator"], {}, void 0, false, {
                                            fileName: "[project]/features/settings/pkgx/components/category-mapping-tab.tsx",
                                            lineNumber: 291,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["DropdownMenuItem"], {
                                            onClick: ()=>triggerSync('sync_seo'),
                                            title: "Đồng bộ: Keywords, Meta Title, Meta Desc",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$search$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__Search$3e$__["Search"], {
                                                    className: "h-4 w-4 mr-2"
                                                }, void 0, false, {
                                                    fileName: "[project]/features/settings/pkgx/components/category-mapping-tab.tsx",
                                                    lineNumber: 298,
                                                    columnNumber: 21
                                                }, this),
                                                "SEO"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/features/settings/pkgx/components/category-mapping-tab.tsx",
                                            lineNumber: 294,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["DropdownMenuItem"], {
                                            onClick: ()=>triggerSync('sync_description'),
                                            title: "Đồng bộ: Mô tả ngắn (Short Desc), Mô tả dài (Long Desc)",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$text$2d$align$2d$start$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__AlignLeft$3e$__["AlignLeft"], {
                                                    className: "h-4 w-4 mr-2"
                                                }, void 0, false, {
                                                    fileName: "[project]/features/settings/pkgx/components/category-mapping-tab.tsx",
                                                    lineNumber: 305,
                                                    columnNumber: 21
                                                }, this),
                                                "Mô tả"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/features/settings/pkgx/components/category-mapping-tab.tsx",
                                            lineNumber: 301,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["DropdownMenuItem"], {
                                            onClick: ()=>triggerSync('sync_basic'),
                                            title: "Đồng bộ: Tên danh mục, Trạng thái hiển thị",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$folder$2d$pen$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__FolderEdit$3e$__["FolderEdit"], {
                                                    className: "h-4 w-4 mr-2"
                                                }, void 0, false, {
                                                    fileName: "[project]/features/settings/pkgx/components/category-mapping-tab.tsx",
                                                    lineNumber: 312,
                                                    columnNumber: 21
                                                }, this),
                                                "Thông tin cơ bản"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/features/settings/pkgx/components/category-mapping-tab.tsx",
                                            lineNumber: 308,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["DropdownMenuSeparator"], {}, void 0, false, {
                                            fileName: "[project]/features/settings/pkgx/components/category-mapping-tab.tsx",
                                            lineNumber: 316,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["DropdownMenuItem"], {
                                            onClick: ()=>window.open(`https://phukiengiaxuong.com.vn/admin/category.php?act=edit&cat_id=${row.id}`, '_blank'),
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$external$2d$link$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__ExternalLink$3e$__["ExternalLink"], {
                                                    className: "h-4 w-4 mr-2"
                                                }, void 0, false, {
                                                    fileName: "[project]/features/settings/pkgx/components/category-mapping-tab.tsx",
                                                    lineNumber: 318,
                                                    columnNumber: 21
                                                }, this),
                                                "Xem trên PKGX"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/features/settings/pkgx/components/category-mapping-tab.tsx",
                                            lineNumber: 317,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["DropdownMenuSeparator"], {}, void 0, false, {
                                            fileName: "[project]/features/settings/pkgx/components/category-mapping-tab.tsx",
                                            lineNumber: 323,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["DropdownMenuItem"], {
                                            onClick: ()=>entitySync.handleConfirm('Hủy liên kết PKGX', `Bạn có chắc muốn hủy liên kết danh mục "${row.name}" với PKGX?`, ()=>handleUnlinkCategory(row.id)),
                                            className: "text-destructive focus:text-destructive",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$unlink$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__Unlink$3e$__["Unlink"], {
                                                    className: "h-4 w-4 mr-2"
                                                }, void 0, false, {
                                                    fileName: "[project]/features/settings/pkgx/components/category-mapping-tab.tsx",
                                                    lineNumber: 332,
                                                    columnNumber: 21
                                                }, this),
                                                "Hủy liên kết"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/features/settings/pkgx/components/category-mapping-tab.tsx",
                                            lineNumber: 324,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, void 0, true) : /* Not linked - show link option */ /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Fragment"], {
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["DropdownMenuItem"], {
                                        onClick: ()=>handleQuickMap(row),
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$link$2d$2$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__Link2$3e$__["Link2"], {
                                                className: "h-4 w-4 mr-2"
                                            }, void 0, false, {
                                                fileName: "[project]/features/settings/pkgx/components/category-mapping-tab.tsx",
                                                lineNumber: 340,
                                                columnNumber: 21
                                            }, this),
                                            "Liên kết với HRM"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/features/settings/pkgx/components/category-mapping-tab.tsx",
                                        lineNumber: 339,
                                        columnNumber: 19
                                    }, this)
                                }, void 0, false)
                            }, void 0, false, {
                                fileName: "[project]/features/settings/pkgx/components/category-mapping-tab.tsx",
                                lineNumber: 279,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/features/settings/pkgx/components/category-mapping-tab.tsx",
                        lineNumber: 273,
                        columnNumber: 11
                    }, this);
                }
            }
        ], [
        settings.categories,
        hrmCategories,
        findMapping,
        entitySync
    ]);
    // Mappings columns
    const mappingColumns = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["useMemo"](()=>[
            {
                id: 'hrmCategoryName',
                accessorKey: 'hrmCategoryName',
                header: 'Danh mục HRM',
                cell: ({ row })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "font-medium",
                        children: row.hrmCategoryName
                    }, void 0, false, {
                        fileName: "[project]/features/settings/pkgx/components/category-mapping-tab.tsx",
                        lineNumber: 358,
                        columnNumber: 26
                    }, this)
            },
            {
                id: 'pkgxCatName',
                accessorKey: 'pkgxCatName',
                header: 'Danh mục PKGX',
                cell: ({ row })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        children: row.pkgxCatName
                    }, void 0, false, {
                        fileName: "[project]/features/settings/pkgx/components/category-mapping-tab.tsx",
                        lineNumber: 364,
                        columnNumber: 26
                    }, this)
            },
            {
                id: 'pkgxCatId',
                accessorKey: 'pkgxCatId',
                header: 'ID PKGX',
                size: 80,
                cell: ({ row })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "font-mono text-muted-foreground",
                        children: row.pkgxCatId
                    }, void 0, false, {
                        fileName: "[project]/features/settings/pkgx/components/category-mapping-tab.tsx",
                        lineNumber: 371,
                        columnNumber: 26
                    }, this)
            },
            {
                id: 'actions',
                header: 'Hành động',
                size: 100,
                cell: ({ row })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex justify-end gap-1",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Button"], {
                                variant: "ghost",
                                size: "sm",
                                onClick: ()=>handleOpenDialog(row),
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$pencil$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__Pencil$3e$__["Pencil"], {
                                    className: "h-4 w-4"
                                }, void 0, false, {
                                    fileName: "[project]/features/settings/pkgx/components/category-mapping-tab.tsx",
                                    lineNumber: 380,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/features/settings/pkgx/components/category-mapping-tab.tsx",
                                lineNumber: 379,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Button"], {
                                variant: "ghost",
                                size: "sm",
                                onClick: ()=>handleDelete(row.id),
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trash$2d$2$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__Trash2$3e$__["Trash2"], {
                                    className: "h-4 w-4 text-destructive"
                                }, void 0, false, {
                                    fileName: "[project]/features/settings/pkgx/components/category-mapping-tab.tsx",
                                    lineNumber: 383,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/features/settings/pkgx/components/category-mapping-tab.tsx",
                                lineNumber: 382,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/features/settings/pkgx/components/category-mapping-tab.tsx",
                        lineNumber: 378,
                        columnNumber: 9
                    }, this)
            }
        ], []);
    const handleQuickMap = (pkgxCategory)=>{
        setSelectedPkgxCategory(pkgxCategory.id.toString());
        setSelectedHrmCategory('');
        setEditingMapping(null);
        setIsDialogOpen(true);
    };
    const handleUnlinkCategory = (pkgxCatId)=>{
        const mapping = findMapping(pkgxCatId);
        if (mapping) {
            deleteCategoryMapping(mapping.id);
            addLog({
                action: 'unlink_mapping',
                status: 'success',
                message: `Đã hủy liên kết danh mục: ${mapping.hrmCategoryName} ↔ ${mapping.pkgxCatName}`,
                details: {
                    categoryId: pkgxCatId
                }
            });
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["toast"].success('Đã hủy liên kết danh mục');
        }
    };
    // Open detail dialog with category info
    const handleViewDetail = async (catId)=>{
        setIsDetailDialogOpen(true);
        setIsLoadingDetail(true);
        setSelectedCategoryForDetail(null);
        try {
            const response = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$pkgx$2f$api$2d$service$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getCategoryById"])(catId);
            if (response.success && response.data?.data) {
                setSelectedCategoryForDetail(response.data.data);
            } else {
                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["toast"].error(response.error || 'Không thể lấy thông tin danh mục');
            }
        } catch (error) {
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["toast"].error('Lỗi khi lấy thông tin danh mục');
        } finally{
            setIsLoadingDetail(false);
        }
    };
    // Push category info from HRM to PKGX
    const handlePushCategory = async (pkgxCatId)=>{
        const mapping = findMapping(pkgxCatId);
        if (!mapping) {
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["toast"].error('Danh mục chưa được mapping với HRM');
            return;
        }
        const hrmCategory = hrmCategories.find((c)=>c.systemId === mapping.hrmCategorySystemId);
        if (!hrmCategory) {
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["toast"].error('Không tìm thấy danh mục HRM');
            return;
        }
        setIsPushing(true);
        try {
            const payload = {};
            // Push name
            if (hrmCategory.name) payload.cat_name = hrmCategory.name;
            // Push description (nếu HRM category có field này)
            if (hrmCategory.description) payload.cat_desc = hrmCategory.description;
            // Push keywords (nếu HRM category có field này)
            if (hrmCategory.seoKeywords) payload.keywords = hrmCategory.seoKeywords;
            const response = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$pkgx$2f$api$2d$service$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["updateCategory"])(pkgxCatId, payload);
            if (response.success) {
                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["toast"].success('Đã đẩy thông tin danh mục lên PKGX');
                addLog({
                    action: 'update_product',
                    status: 'success',
                    message: `Đã đẩy thông tin danh mục: ${mapping.hrmCategoryName} → ${mapping.pkgxCatName}`,
                    details: {
                        categoryId: pkgxCatId
                    }
                });
                // Refresh detail if open
                if (isDetailDialogOpen && selectedCategoryForDetail?.cat_id === pkgxCatId) {
                    handleViewDetail(pkgxCatId);
                }
            } else {
                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["toast"].error(response.error || 'Không thể cập nhật danh mục');
            }
        } catch (error) {
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["toast"].error('Lỗi khi đẩy thông tin danh mục');
        } finally{
            setIsPushing(false);
        }
    };
    const handleOpenDialog = (mapping)=>{
        if (mapping) {
            setEditingMapping(mapping);
            setSelectedHrmCategory(mapping.hrmCategorySystemId);
            setSelectedPkgxCategory(mapping.pkgxCatId.toString());
        } else {
            setEditingMapping(null);
            setSelectedHrmCategory('');
            setSelectedPkgxCategory('');
        }
        setIsDialogOpen(true);
    };
    const handleCloseDialog = ()=>{
        setIsDialogOpen(false);
        setEditingMapping(null);
        setSelectedHrmCategory('');
        setSelectedPkgxCategory('');
        setShowWarningConfirm(false);
        validation.clearValidation();
    };
    // Validate when form values change
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["useEffect"](()=>{
        if (isDialogOpen && (selectedHrmCategory || selectedPkgxCategory)) {
            const input = {
                hrmCategorySystemId: selectedHrmCategory || '',
                hrmCategoryName: hrmCategories.find((c)=>c.systemId === selectedHrmCategory)?.name || '',
                pkgxCatId: selectedPkgxCategory ? parseInt(selectedPkgxCategory) : '',
                pkgxCatName: settings.categories.find((c)=>c.id === parseInt(selectedPkgxCategory))?.name || ''
            };
            validation.validateAsync(input);
        }
    }, [
        selectedHrmCategory,
        selectedPkgxCategory,
        isDialogOpen
    ]);
    const handleSave = ()=>{
        // Build input for validation
        const input = {
            hrmCategorySystemId: selectedHrmCategory || '',
            hrmCategoryName: hrmCategories.find((c)=>c.systemId === selectedHrmCategory)?.name || '',
            pkgxCatId: selectedPkgxCategory ? parseInt(selectedPkgxCategory) : '',
            pkgxCatName: settings.categories.find((c)=>c.id === parseInt(selectedPkgxCategory))?.name || ''
        };
        // Run final validation
        const result = validation.validate(input);
        // Block if there are errors
        if (!result.isValid) {
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["toast"].error(result.errors[0]?.message || 'Vui lòng kiểm tra lại thông tin');
            return;
        }
        // Show warning confirmation if there are warnings and not yet confirmed
        if (result.warnings.length > 0 && !showWarningConfirm) {
            setShowWarningConfirm(true);
            return;
        }
        const hrmCategory = hrmCategories.find((c)=>c.systemId === selectedHrmCategory);
        const pkgxCategory = settings.categories.find((c)=>c.id === parseInt(selectedPkgxCategory));
        if (!hrmCategory || !pkgxCategory) {
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["toast"].error('Không tìm thấy danh mục');
            return;
        }
        if (editingMapping) {
            updateCategoryMapping(editingMapping.id, {
                hrmCategorySystemId: hrmCategory.systemId,
                hrmCategoryName: hrmCategory.name,
                pkgxCatId: pkgxCategory.id,
                pkgxCatName: pkgxCategory.name
            });
            addLog({
                action: 'save_mapping',
                status: 'success',
                message: `Cập nhật mapping danh mục: ${hrmCategory.name} → ${pkgxCategory.name}`,
                details: {
                    categoryId: pkgxCategory.id
                }
            });
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["toast"].success('Đã cập nhật mapping danh mục');
        } else {
            addCategoryMapping({
                id: `catmap-${Date.now()}`,
                hrmCategorySystemId: hrmCategory.systemId,
                hrmCategoryName: hrmCategory.name,
                pkgxCatId: pkgxCategory.id,
                pkgxCatName: pkgxCategory.name
            });
            addLog({
                action: 'save_mapping',
                status: 'success',
                message: `Thêm mapping danh mục: ${hrmCategory.name} → ${pkgxCategory.name}`,
                details: {
                    categoryId: pkgxCategory.id
                }
            });
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["toast"].success('Đã thêm mapping danh mục');
        }
        handleCloseDialog();
    };
    const handleDelete = (id)=>{
        const mapping = settings.categoryMappings.find((m)=>m.id === id);
        deleteCategoryMapping(id);
        if (mapping) {
            addLog({
                action: 'save_mapping',
                status: 'info',
                message: `Xóa mapping danh mục: ${mapping.hrmCategoryName}`,
                details: {
                    categoryId: mapping.pkgxCatId
                }
            });
        }
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["toast"].success('Đã xóa mapping danh mục');
    };
    const handleSyncFromPkgx = async ()=>{
        setIsSyncing(true);
        try {
            await syncCategoriesFromPkgx();
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["toast"].success('Đã đồng bộ danh mục từ PKGX');
        } catch (error) {
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["toast"].error(error instanceof Error ? error.message : 'Lỗi khi đồng bộ danh mục');
        } finally{
            setIsSyncing(false);
        }
    };
    // Mobile card renderers
    const renderPkgxMobileCard = (row)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "p-4 space-y-3",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex items-start justify-between",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "font-medium",
                                    children: row.name
                                }, void 0, false, {
                                    fileName: "[project]/features/settings/pkgx/components/category-mapping-tab.tsx",
                                    lineNumber: 611,
                                    columnNumber: 11
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "text-sm text-muted-foreground",
                                    children: [
                                        "ID: ",
                                        row.id
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/features/settings/pkgx/components/category-mapping-tab.tsx",
                                    lineNumber: 612,
                                    columnNumber: 11
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/features/settings/pkgx/components/category-mapping-tab.tsx",
                            lineNumber: 610,
                            columnNumber: 9
                        }, this),
                        row.mappedToHrm ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$badge$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Badge"], {
                            variant: "default",
                            className: "bg-green-500 shrink-0",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle2$3e$__["CheckCircle2"], {
                                    className: "h-3 w-3 mr-1"
                                }, void 0, false, {
                                    fileName: "[project]/features/settings/pkgx/components/category-mapping-tab.tsx",
                                    lineNumber: 616,
                                    columnNumber: 13
                                }, this),
                                "Đã mapping"
                            ]
                        }, void 0, true, {
                            fileName: "[project]/features/settings/pkgx/components/category-mapping-tab.tsx",
                            lineNumber: 615,
                            columnNumber: 11
                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$badge$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Badge"], {
                            variant: "secondary",
                            className: "shrink-0",
                            children: "Chưa mapping"
                        }, void 0, false, {
                            fileName: "[project]/features/settings/pkgx/components/category-mapping-tab.tsx",
                            lineNumber: 620,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/features/settings/pkgx/components/category-mapping-tab.tsx",
                    lineNumber: 609,
                    columnNumber: 7
                }, this),
                row.mappedToHrm && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "text-sm",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "text-muted-foreground",
                            children: "HRM: "
                        }, void 0, false, {
                            fileName: "[project]/features/settings/pkgx/components/category-mapping-tab.tsx",
                            lineNumber: 625,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            children: row.mappedToHrm
                        }, void 0, false, {
                            fileName: "[project]/features/settings/pkgx/components/category-mapping-tab.tsx",
                            lineNumber: 626,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/features/settings/pkgx/components/category-mapping-tab.tsx",
                    lineNumber: 624,
                    columnNumber: 9
                }, this),
                !row.mappedToHrm && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Button"], {
                    variant: "outline",
                    size: "sm",
                    className: "w-full",
                    onClick: ()=>handleQuickMap(row),
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$link$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__Link$3e$__["Link"], {
                            className: "h-4 w-4 mr-2"
                        }, void 0, false, {
                            fileName: "[project]/features/settings/pkgx/components/category-mapping-tab.tsx",
                            lineNumber: 636,
                            columnNumber: 11
                        }, this),
                        "Mapping nhanh"
                    ]
                }, void 0, true, {
                    fileName: "[project]/features/settings/pkgx/components/category-mapping-tab.tsx",
                    lineNumber: 630,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/features/settings/pkgx/components/category-mapping-tab.tsx",
            lineNumber: 608,
            columnNumber: 5
        }, this);
    const renderMappingMobileCard = (row)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "p-4 space-y-3",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "font-medium",
                            children: row.hrmCategoryName
                        }, void 0, false, {
                            fileName: "[project]/features/settings/pkgx/components/category-mapping-tab.tsx",
                            lineNumber: 646,
                            columnNumber: 9
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "text-sm text-muted-foreground",
                            children: [
                                "→ ",
                                row.pkgxCatName,
                                " (ID: ",
                                row.pkgxCatId,
                                ")"
                            ]
                        }, void 0, true, {
                            fileName: "[project]/features/settings/pkgx/components/category-mapping-tab.tsx",
                            lineNumber: 647,
                            columnNumber: 9
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/features/settings/pkgx/components/category-mapping-tab.tsx",
                    lineNumber: 645,
                    columnNumber: 7
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex gap-2",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Button"], {
                            variant: "outline",
                            size: "sm",
                            className: "flex-1",
                            onClick: ()=>handleOpenDialog(row),
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$pencil$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__Pencil$3e$__["Pencil"], {
                                    className: "h-4 w-4 mr-2"
                                }, void 0, false, {
                                    fileName: "[project]/features/settings/pkgx/components/category-mapping-tab.tsx",
                                    lineNumber: 653,
                                    columnNumber: 11
                                }, this),
                                "Sửa"
                            ]
                        }, void 0, true, {
                            fileName: "[project]/features/settings/pkgx/components/category-mapping-tab.tsx",
                            lineNumber: 652,
                            columnNumber: 9
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Button"], {
                            variant: "outline",
                            size: "sm",
                            className: "flex-1",
                            onClick: ()=>handleDelete(row.id),
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trash$2d$2$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__Trash2$3e$__["Trash2"], {
                                    className: "h-4 w-4 mr-2 text-destructive"
                                }, void 0, false, {
                                    fileName: "[project]/features/settings/pkgx/components/category-mapping-tab.tsx",
                                    lineNumber: 657,
                                    columnNumber: 11
                                }, this),
                                "Xóa"
                            ]
                        }, void 0, true, {
                            fileName: "[project]/features/settings/pkgx/components/category-mapping-tab.tsx",
                            lineNumber: 656,
                            columnNumber: 9
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/features/settings/pkgx/components/category-mapping-tab.tsx",
                    lineNumber: 651,
                    columnNumber: 7
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/features/settings/pkgx/components/category-mapping-tab.tsx",
            lineNumber: 644,
            columnNumber: 5
        }, this);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "space-y-6",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Card"], {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["CardHeader"], {
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex flex-col sm:flex-row sm:items-center justify-between gap-4",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["CardTitle"], {
                                            className: "text-lg",
                                            children: "Mapping danh mục sản phẩm"
                                        }, void 0, false, {
                                            fileName: "[project]/features/settings/pkgx/components/category-mapping-tab.tsx",
                                            lineNumber: 670,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["CardDescription"], {
                                            children: "Liên kết danh mục HRM với danh mục PKGX để đồng bộ sản phẩm"
                                        }, void 0, false, {
                                            fileName: "[project]/features/settings/pkgx/components/category-mapping-tab.tsx",
                                            lineNumber: 671,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/features/settings/pkgx/components/category-mapping-tab.tsx",
                                    lineNumber: 669,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex gap-2",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Button"], {
                                            onClick: handleSyncFromPkgx,
                                            disabled: isSyncing,
                                            variant: "outline",
                                            children: [
                                                isSyncing ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__["Loader2"], {
                                                    className: "h-4 w-4 mr-2 animate-spin"
                                                }, void 0, false, {
                                                    fileName: "[project]/features/settings/pkgx/components/category-mapping-tab.tsx",
                                                    lineNumber: 677,
                                                    columnNumber: 30
                                                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$refresh$2d$cw$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__RefreshCw$3e$__["RefreshCw"], {
                                                    className: "h-4 w-4 mr-2"
                                                }, void 0, false, {
                                                    fileName: "[project]/features/settings/pkgx/components/category-mapping-tab.tsx",
                                                    lineNumber: 677,
                                                    columnNumber: 82
                                                }, this),
                                                "Đồng bộ từ PKGX"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/features/settings/pkgx/components/category-mapping-tab.tsx",
                                            lineNumber: 676,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Button"], {
                                            onClick: ()=>handleOpenDialog(),
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__["Plus"], {
                                                    className: "h-4 w-4 mr-2"
                                                }, void 0, false, {
                                                    fileName: "[project]/features/settings/pkgx/components/category-mapping-tab.tsx",
                                                    lineNumber: 681,
                                                    columnNumber: 17
                                                }, this),
                                                "Thêm mapping"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/features/settings/pkgx/components/category-mapping-tab.tsx",
                                            lineNumber: 680,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/features/settings/pkgx/components/category-mapping-tab.tsx",
                                    lineNumber: 675,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/features/settings/pkgx/components/category-mapping-tab.tsx",
                            lineNumber: 668,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/features/settings/pkgx/components/category-mapping-tab.tsx",
                        lineNumber: 667,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["CardContent"], {
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "space-y-4",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex flex-col sm:flex-row items-stretch sm:items-center gap-2",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "relative flex-1",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$search$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__Search$3e$__["Search"], {
                                                    className: "absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                                                }, void 0, false, {
                                                    fileName: "[project]/features/settings/pkgx/components/category-mapping-tab.tsx",
                                                    lineNumber: 691,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$input$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Input"], {
                                                    placeholder: "Tìm kiếm danh mục...",
                                                    value: searchTerm,
                                                    onChange: (e)=>setSearchTerm(e.target.value),
                                                    className: "pl-9"
                                                }, void 0, false, {
                                                    fileName: "[project]/features/settings/pkgx/components/category-mapping-tab.tsx",
                                                    lineNumber: 692,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/features/settings/pkgx/components/category-mapping-tab.tsx",
                                            lineNumber: 690,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "text-sm text-muted-foreground whitespace-nowrap text-center sm:text-right",
                                            children: [
                                                settings.categories.length,
                                                " danh mục PKGX | ",
                                                settings.categoryMappings.length,
                                                " mapping"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/features/settings/pkgx/components/category-mapping-tab.tsx",
                                            lineNumber: 699,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/features/settings/pkgx/components/category-mapping-tab.tsx",
                                    lineNumber: 689,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$tabs$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Tabs"], {
                                    value: activeTab,
                                    onValueChange: setActiveTab,
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$tabs$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["TabsList"], {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$tabs$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["TabsTrigger"], {
                                                    value: "pkgx-categories",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$folder$2d$tree$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__FolderTree$3e$__["FolderTree"], {
                                                            className: "h-4 w-4 mr-2"
                                                        }, void 0, false, {
                                                            fileName: "[project]/features/settings/pkgx/components/category-mapping-tab.tsx",
                                                            lineNumber: 707,
                                                            columnNumber: 19
                                                        }, this),
                                                        "Danh mục PKGX (",
                                                        settings.categories.length,
                                                        ")"
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/features/settings/pkgx/components/category-mapping-tab.tsx",
                                                    lineNumber: 706,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$tabs$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["TabsTrigger"], {
                                                    value: "mappings",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$link$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__Link$3e$__["Link"], {
                                                            className: "h-4 w-4 mr-2"
                                                        }, void 0, false, {
                                                            fileName: "[project]/features/settings/pkgx/components/category-mapping-tab.tsx",
                                                            lineNumber: 711,
                                                            columnNumber: 19
                                                        }, this),
                                                        "Mapping (",
                                                        settings.categoryMappings.length,
                                                        ")"
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/features/settings/pkgx/components/category-mapping-tab.tsx",
                                                    lineNumber: 710,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/features/settings/pkgx/components/category-mapping-tab.tsx",
                                            lineNumber: 705,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$tabs$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["TabsContent"], {
                                            value: "pkgx-categories",
                                            className: "mt-4",
                                            children: settings.categories.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "text-center py-8 text-muted-foreground",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$folder$2d$tree$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__FolderTree$3e$__["FolderTree"], {
                                                        className: "h-12 w-12 mx-auto mb-4 opacity-50"
                                                    }, void 0, false, {
                                                        fileName: "[project]/features/settings/pkgx/components/category-mapping-tab.tsx",
                                                        lineNumber: 719,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        children: "Chưa có danh mục từ PKGX."
                                                    }, void 0, false, {
                                                        fileName: "[project]/features/settings/pkgx/components/category-mapping-tab.tsx",
                                                        lineNumber: 720,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "text-sm mt-1",
                                                        children: 'Bấm "Đồng bộ từ PKGX" để lấy danh sách.'
                                                    }, void 0, false, {
                                                        fileName: "[project]/features/settings/pkgx/components/category-mapping-tab.tsx",
                                                        lineNumber: 721,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/features/settings/pkgx/components/category-mapping-tab.tsx",
                                                lineNumber: 718,
                                                columnNumber: 19
                                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$data$2d$table$2f$responsive$2d$data$2d$table$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ResponsiveDataTable"], {
                                                columns: pkgxColumns,
                                                data: paginatedPkgxData,
                                                renderMobileCard: renderPkgxMobileCard,
                                                pageCount: Math.ceil(pkgxCategoriesData.length / pagination.pageSize),
                                                pagination: pagination,
                                                setPagination: setPagination,
                                                rowCount: pkgxCategoriesData.length,
                                                sorting: sorting,
                                                setSorting: setSorting,
                                                rowSelection: rowSelection,
                                                setRowSelection: setRowSelection,
                                                bulkActions: pkgxBulkActions,
                                                allSelectedRows: allSelectedPkgxRows,
                                                emptyTitle: "Không tìm thấy danh mục"
                                            }, void 0, false, {
                                                fileName: "[project]/features/settings/pkgx/components/category-mapping-tab.tsx",
                                                lineNumber: 724,
                                                columnNumber: 19
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/features/settings/pkgx/components/category-mapping-tab.tsx",
                                            lineNumber: 716,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$tabs$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["TabsContent"], {
                                            value: "mappings",
                                            className: "mt-4",
                                            children: settings.categoryMappings.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "text-center py-8 text-muted-foreground",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$link$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__Link$3e$__["Link"], {
                                                        className: "h-12 w-12 mx-auto mb-4 opacity-50"
                                                    }, void 0, false, {
                                                        fileName: "[project]/features/settings/pkgx/components/category-mapping-tab.tsx",
                                                        lineNumber: 746,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        children: "Chưa có mapping nào."
                                                    }, void 0, false, {
                                                        fileName: "[project]/features/settings/pkgx/components/category-mapping-tab.tsx",
                                                        lineNumber: 747,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "text-sm mt-1",
                                                        children: 'Bấm "Thêm mapping" để bắt đầu.'
                                                    }, void 0, false, {
                                                        fileName: "[project]/features/settings/pkgx/components/category-mapping-tab.tsx",
                                                        lineNumber: 748,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/features/settings/pkgx/components/category-mapping-tab.tsx",
                                                lineNumber: 745,
                                                columnNumber: 19
                                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$data$2d$table$2f$responsive$2d$data$2d$table$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ResponsiveDataTable"], {
                                                columns: mappingColumns,
                                                data: paginatedMappingsData,
                                                renderMobileCard: renderMappingMobileCard,
                                                pageCount: Math.ceil(mappingsData.length / pagination.pageSize),
                                                pagination: pagination,
                                                setPagination: setPagination,
                                                rowCount: mappingsData.length,
                                                sorting: sorting,
                                                setSorting: setSorting,
                                                emptyTitle: "Không tìm thấy mapping"
                                            }, void 0, false, {
                                                fileName: "[project]/features/settings/pkgx/components/category-mapping-tab.tsx",
                                                lineNumber: 751,
                                                columnNumber: 19
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/features/settings/pkgx/components/category-mapping-tab.tsx",
                                            lineNumber: 743,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/features/settings/pkgx/components/category-mapping-tab.tsx",
                                    lineNumber: 704,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/features/settings/pkgx/components/category-mapping-tab.tsx",
                            lineNumber: 688,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/features/settings/pkgx/components/category-mapping-tab.tsx",
                        lineNumber: 687,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/features/settings/pkgx/components/category-mapping-tab.tsx",
                lineNumber: 666,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$shared$2f$pkgx$2d$mapping$2d$dialog$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["PkgxMappingDialog"], {
                open: isDialogOpen,
                onOpenChange: setIsDialogOpen,
                type: "category",
                isEditing: !!editingMapping,
                hrmItems: hrmCategories.map((c)=>({
                        id: c.systemId,
                        name: c.path || c.name
                    })),
                selectedHrmId: selectedHrmCategory,
                onSelectHrmId: setSelectedHrmCategory,
                pkgxItems: settings.categories.map((c)=>({
                        id: c.id.toString(),
                        name: c.name,
                        subText: `ID: ${c.id}`
                    })),
                selectedPkgxId: selectedPkgxCategory,
                onSelectPkgxId: setSelectedPkgxCategory,
                pkgxSuggestions: validation.suggestions.map((s)=>({
                        item: {
                            id: s.category.id.toString(),
                            name: s.category.name
                        },
                        score: s.score
                    })),
                validation: validation.validationResult,
                hasErrors: validation.hasErrors,
                isValidating: validation.isValidating,
                showWarningConfirm: showWarningConfirm,
                onConfirm: handleSave,
                onCancel: handleCloseDialog
            }, void 0, false, {
                fileName: "[project]/features/settings/pkgx/components/category-mapping-tab.tsx",
                lineNumber: 771,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Dialog"], {
                open: isDetailDialogOpen,
                onOpenChange: setIsDetailDialogOpen,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["DialogContent"], {
                    className: "max-w-2xl",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["DialogHeader"], {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["DialogTitle"], {
                                    className: "flex items-center gap-2",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$folder$2d$tree$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__FolderTree$3e$__["FolderTree"], {
                                            className: "h-5 w-5"
                                        }, void 0, false, {
                                            fileName: "[project]/features/settings/pkgx/components/category-mapping-tab.tsx",
                                            lineNumber: 806,
                                            columnNumber: 15
                                        }, this),
                                        "Chi tiết danh mục PKGX"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/features/settings/pkgx/components/category-mapping-tab.tsx",
                                    lineNumber: 805,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["DialogDescription"], {
                                    children: selectedCategoryForDetail ? `ID: ${selectedCategoryForDetail.cat_id}` : 'Đang tải...'
                                }, void 0, false, {
                                    fileName: "[project]/features/settings/pkgx/components/category-mapping-tab.tsx",
                                    lineNumber: 809,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/features/settings/pkgx/components/category-mapping-tab.tsx",
                            lineNumber: 804,
                            columnNumber: 11
                        }, this),
                        isLoadingDetail ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex items-center justify-center py-8",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__["Loader2"], {
                                className: "h-8 w-8 animate-spin text-muted-foreground"
                            }, void 0, false, {
                                fileName: "[project]/features/settings/pkgx/components/category-mapping-tab.tsx",
                                lineNumber: 816,
                                columnNumber: 15
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/features/settings/pkgx/components/category-mapping-tab.tsx",
                            lineNumber: 815,
                            columnNumber: 13
                        }, this) : selectedCategoryForDetail ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$scroll$2d$area$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ScrollArea"], {
                            className: "max-h-[60vh] pr-4",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "space-y-4",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "space-y-2",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$label$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Label"], {
                                                className: "text-sm font-medium",
                                                children: "Tên danh mục"
                                            }, void 0, false, {
                                                fileName: "[project]/features/settings/pkgx/components/category-mapping-tab.tsx",
                                                lineNumber: 823,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "p-2 border rounded text-sm font-medium",
                                                children: selectedCategoryForDetail.cat_name
                                            }, void 0, false, {
                                                fileName: "[project]/features/settings/pkgx/components/category-mapping-tab.tsx",
                                                lineNumber: 824,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/features/settings/pkgx/components/category-mapping-tab.tsx",
                                        lineNumber: 822,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "grid grid-cols-2 gap-4",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "space-y-1",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$label$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Label"], {
                                                        className: "text-xs text-muted-foreground",
                                                        children: "Parent ID"
                                                    }, void 0, false, {
                                                        fileName: "[project]/features/settings/pkgx/components/category-mapping-tab.tsx",
                                                        lineNumber: 831,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "p-2 border rounded text-sm",
                                                        children: selectedCategoryForDetail.parent_id || 'Không có (Root)'
                                                    }, void 0, false, {
                                                        fileName: "[project]/features/settings/pkgx/components/category-mapping-tab.tsx",
                                                        lineNumber: 832,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/features/settings/pkgx/components/category-mapping-tab.tsx",
                                                lineNumber: 830,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "space-y-1",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$label$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Label"], {
                                                        className: "text-xs text-muted-foreground",
                                                        children: "Thứ tự"
                                                    }, void 0, false, {
                                                        fileName: "[project]/features/settings/pkgx/components/category-mapping-tab.tsx",
                                                        lineNumber: 837,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "p-2 border rounded text-sm",
                                                        children: selectedCategoryForDetail.sort_order
                                                    }, void 0, false, {
                                                        fileName: "[project]/features/settings/pkgx/components/category-mapping-tab.tsx",
                                                        lineNumber: 838,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/features/settings/pkgx/components/category-mapping-tab.tsx",
                                                lineNumber: 836,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/features/settings/pkgx/components/category-mapping-tab.tsx",
                                        lineNumber: 829,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "space-y-3",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$label$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Label"], {
                                                className: "text-sm font-medium",
                                                children: "Thông tin SEO"
                                            }, void 0, false, {
                                                fileName: "[project]/features/settings/pkgx/components/category-mapping-tab.tsx",
                                                lineNumber: 846,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "space-y-2",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "space-y-1",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$label$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Label"], {
                                                                className: "text-xs text-muted-foreground",
                                                                children: "Alias (Slug)"
                                                            }, void 0, false, {
                                                                fileName: "[project]/features/settings/pkgx/components/category-mapping-tab.tsx",
                                                                lineNumber: 849,
                                                                columnNumber: 23
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "p-2 border rounded text-sm",
                                                                children: selectedCategoryForDetail.cat_alias || '-'
                                                            }, void 0, false, {
                                                                fileName: "[project]/features/settings/pkgx/components/category-mapping-tab.tsx",
                                                                lineNumber: 850,
                                                                columnNumber: 23
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/features/settings/pkgx/components/category-mapping-tab.tsx",
                                                        lineNumber: 848,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "space-y-1",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$label$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Label"], {
                                                                className: "text-xs text-muted-foreground",
                                                                children: "Keywords"
                                                            }, void 0, false, {
                                                                fileName: "[project]/features/settings/pkgx/components/category-mapping-tab.tsx",
                                                                lineNumber: 855,
                                                                columnNumber: 23
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "p-2 border rounded text-sm",
                                                                children: selectedCategoryForDetail.keywords || '-'
                                                            }, void 0, false, {
                                                                fileName: "[project]/features/settings/pkgx/components/category-mapping-tab.tsx",
                                                                lineNumber: 856,
                                                                columnNumber: 23
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/features/settings/pkgx/components/category-mapping-tab.tsx",
                                                        lineNumber: 854,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/features/settings/pkgx/components/category-mapping-tab.tsx",
                                                lineNumber: 847,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/features/settings/pkgx/components/category-mapping-tab.tsx",
                                        lineNumber: 845,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "space-y-1",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$label$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Label"], {
                                                className: "text-sm font-medium",
                                                children: "Mô tả danh mục"
                                            }, void 0, false, {
                                                fileName: "[project]/features/settings/pkgx/components/category-mapping-tab.tsx",
                                                lineNumber: 865,
                                                columnNumber: 19
                                            }, this),
                                            selectedCategoryForDetail.cat_desc ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "p-3 border rounded text-sm max-h-40 overflow-y-auto bg-muted/30",
                                                dangerouslySetInnerHTML: {
                                                    __html: selectedCategoryForDetail.cat_desc
                                                }
                                            }, void 0, false, {
                                                fileName: "[project]/features/settings/pkgx/components/category-mapping-tab.tsx",
                                                lineNumber: 867,
                                                columnNumber: 21
                                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "p-2 border rounded text-sm text-muted-foreground",
                                                children: "Chưa có mô tả"
                                            }, void 0, false, {
                                                fileName: "[project]/features/settings/pkgx/components/category-mapping-tab.tsx",
                                                lineNumber: 872,
                                                columnNumber: 21
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/features/settings/pkgx/components/category-mapping-tab.tsx",
                                        lineNumber: 864,
                                        columnNumber: 17
                                    }, this),
                                    findMapping(selectedCategoryForDetail.cat_id) && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "p-3 bg-green-50 border border-green-200 rounded-lg",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex items-center gap-2 text-green-700",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle2$3e$__["CheckCircle2"], {
                                                    className: "h-4 w-4"
                                                }, void 0, false, {
                                                    fileName: "[project]/features/settings/pkgx/components/category-mapping-tab.tsx",
                                                    lineNumber: 880,
                                                    columnNumber: 23
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "font-medium",
                                                    children: "Đã mapping với HRM:"
                                                }, void 0, false, {
                                                    fileName: "[project]/features/settings/pkgx/components/category-mapping-tab.tsx",
                                                    lineNumber: 881,
                                                    columnNumber: 23
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    children: findMapping(selectedCategoryForDetail.cat_id)?.hrmCategoryName
                                                }, void 0, false, {
                                                    fileName: "[project]/features/settings/pkgx/components/category-mapping-tab.tsx",
                                                    lineNumber: 882,
                                                    columnNumber: 23
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/features/settings/pkgx/components/category-mapping-tab.tsx",
                                            lineNumber: 879,
                                            columnNumber: 21
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/features/settings/pkgx/components/category-mapping-tab.tsx",
                                        lineNumber: 878,
                                        columnNumber: 19
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/features/settings/pkgx/components/category-mapping-tab.tsx",
                                lineNumber: 820,
                                columnNumber: 15
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/features/settings/pkgx/components/category-mapping-tab.tsx",
                            lineNumber: 819,
                            columnNumber: 13
                        }, this) : null,
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["DialogFooter"], {
                            className: "gap-2",
                            children: [
                                selectedCategoryForDetail && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Fragment"], {
                                    children: [
                                        findMapping(selectedCategoryForDetail.cat_id) && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Button"], {
                                            variant: "outline",
                                            size: "sm",
                                            onClick: ()=>handlePushCategory(selectedCategoryForDetail.cat_id),
                                            disabled: isPushing,
                                            children: [
                                                isPushing ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__["Loader2"], {
                                                    className: "h-4 w-4 animate-spin mr-2"
                                                }, void 0, false, {
                                                    fileName: "[project]/features/settings/pkgx/components/category-mapping-tab.tsx",
                                                    lineNumber: 900,
                                                    columnNumber: 34
                                                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$upload$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__Upload$3e$__["Upload"], {
                                                    className: "h-4 w-4 mr-2"
                                                }, void 0, false, {
                                                    fileName: "[project]/features/settings/pkgx/components/category-mapping-tab.tsx",
                                                    lineNumber: 900,
                                                    columnNumber: 86
                                                }, this),
                                                "Đẩy HRM → PKGX"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/features/settings/pkgx/components/category-mapping-tab.tsx",
                                            lineNumber: 894,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Button"], {
                                            variant: "outline",
                                            size: "sm",
                                            onClick: ()=>window.open(`https://phukiengiaxuong.com.vn/admin/category.php?act=edit&cat_id=${selectedCategoryForDetail.cat_id}`, '_blank'),
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$external$2d$link$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__ExternalLink$3e$__["ExternalLink"], {
                                                    className: "h-4 w-4 mr-2"
                                                }, void 0, false, {
                                                    fileName: "[project]/features/settings/pkgx/components/category-mapping-tab.tsx",
                                                    lineNumber: 909,
                                                    columnNumber: 19
                                                }, this),
                                                "Xem trên PKGX"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/features/settings/pkgx/components/category-mapping-tab.tsx",
                                            lineNumber: 904,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Button"], {
                                    variant: "outline",
                                    onClick: ()=>setIsDetailDialogOpen(false),
                                    children: "Đóng"
                                }, void 0, false, {
                                    fileName: "[project]/features/settings/pkgx/components/category-mapping-tab.tsx",
                                    lineNumber: 914,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/features/settings/pkgx/components/category-mapping-tab.tsx",
                            lineNumber: 890,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/features/settings/pkgx/components/category-mapping-tab.tsx",
                    lineNumber: 803,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/features/settings/pkgx/components/category-mapping-tab.tsx",
                lineNumber: 802,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$pkgx$2f$components$2f$pkgx$2d$sync$2d$confirm$2d$dialog$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["PkgxSyncConfirmDialog"], {
                confirmAction: entitySync.confirmAction,
                isSyncing: entitySync.isSyncing,
                onConfirm: entitySync.executeAction,
                onCancel: entitySync.cancelConfirm
            }, void 0, false, {
                fileName: "[project]/features/settings/pkgx/components/category-mapping-tab.tsx",
                lineNumber: 922,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/features/settings/pkgx/components/category-mapping-tab.tsx",
        lineNumber: 665,
        columnNumber: 5
    }, this);
}
}),
"[project]/features/settings/inventory/brand-store.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useBrandStore",
    ()=>useBrandStore
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/zustand/esm/react.mjs [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/id-types.ts [app-rsc] (ecmascript)");
;
;
const generateSystemId = (currentCounter)=>{
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["asSystemId"])(`BRAND${String(currentCounter + 1).padStart(6, '0')}`);
};
const generateBusinessId = (currentCounter)=>{
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["asBusinessId"])(`TH${String(currentCounter + 1).padStart(6, '0')}`);
};
// API sync helper
async function syncBrandToAPI(brand, action) {
    try {
        const endpoint = action === 'create' ? '/api/brands' : `/api/brands/${brand.systemId}`;
        const response = await fetch(endpoint, {
            method: action === 'create' ? 'POST' : action === 'delete' ? 'DELETE' : 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(brand)
        });
        return response.ok;
    } catch (error) {
        console.error('syncBrandToAPI error:', error);
        return false;
    }
}
const useBrandStore = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["create"])()((set, get)=>({
        data: [],
        counter: 0,
        initialized: false,
        add: (brand)=>{
            const currentCounter = get().counter;
            const { id, ...rest } = brand;
            const businessId = id && id.trim() ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["asBusinessId"])(id.trim()) : generateBusinessId(currentCounter);
            set((state)=>({
                    data: [
                        ...state.data,
                        {
                            ...rest,
                            systemId: generateSystemId(currentCounter),
                            id: businessId,
                            createdAt: new Date().toISOString(),
                            updatedAt: new Date().toISOString(),
                            isActive: brand.isActive ?? true,
                            isDeleted: false
                        }
                    ],
                    counter: state.counter + 1
                }));
        },
        update: (systemId, brand)=>set((state)=>({
                    data: state.data.map((item)=>item.systemId === systemId ? {
                            ...item,
                            ...brand,
                            updatedAt: new Date().toISOString()
                        } : item)
                })),
        remove: (systemId)=>set((state)=>({
                    data: state.data.map((item)=>item.systemId === systemId ? {
                            ...item,
                            isDeleted: true,
                            updatedAt: new Date().toISOString()
                        } : item)
                })),
        getActive: ()=>get().data.filter((item)=>!item.isDeleted && item.isActive),
        findById: (systemId)=>get().data.find((item)=>item.systemId === systemId),
        findByBusinessId: (id)=>get().data.find((item)=>item.id === id),
        getNextId: ()=>generateBusinessId(get().counter),
        isBusinessIdExists: (id)=>get().data.some((item)=>String(item.id) === id),
        loadFromAPI: async ()=>{
            if (get().initialized) return;
            try {
                const response = await fetch('/api/brands?all=true');
                if (response.ok) {
                    const json = await response.json();
                    if (json.data && Array.isArray(json.data)) {
                        const brands = json.data.map((item)=>({
                                ...item,
                                systemId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["asSystemId"])(item.systemId),
                                id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["asBusinessId"])(item.id),
                                // Add default values for fields not in database
                                isActive: item.isDeleted !== true
                            }));
                        set({
                            data: brands,
                            counter: brands.length,
                            initialized: true
                        });
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
"[project]/features/settings/pkgx/components/brand-mapping-tab.tsx [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "BrandMappingTab",
    ()=>BrandMappingTab
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-jsx-dev-runtime.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/card.tsx [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/button.tsx [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$input$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/input.tsx [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$badge$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/badge.tsx [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$tabs$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/tabs.tsx [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/dialog.tsx [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$scroll$2d$area$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/scroll-area.tsx [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/plus.js [app-rsc] (ecmascript) <export default as Plus>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$pencil$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__Pencil$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/pencil.js [app-rsc] (ecmascript) <export default as Pencil>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trash$2d$2$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__Trash2$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/trash-2.js [app-rsc] (ecmascript) <export default as Trash2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$refresh$2d$cw$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__RefreshCw$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/refresh-cw.js [app-rsc] (ecmascript) <export default as RefreshCw>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$search$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__Search$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/search.js [app-rsc] (ecmascript) <export default as Search>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/loader-circle.js [app-rsc] (ecmascript) <export default as Loader2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$award$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__Award$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/award.js [app-rsc] (ecmascript) <export default as Award>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$link$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__Link$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/link.js [app-rsc] (ecmascript) <export default as Link>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$unlink$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__Unlink$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/unlink.js [app-rsc] (ecmascript) <export default as Unlink>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle2$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/circle-check.js [app-rsc] (ecmascript) <export default as CheckCircle2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$ellipsis$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__MoreHorizontal$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/ellipsis.js [app-rsc] (ecmascript) <export default as MoreHorizontal>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$external$2d$link$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__ExternalLink$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/external-link.js [app-rsc] (ecmascript) <export default as ExternalLink>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$upload$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__Upload$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/upload.js [app-rsc] (ecmascript) <export default as Upload>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$text$2d$align$2d$start$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__AlignLeft$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/text-align-start.js [app-rsc] (ecmascript) <export default as AlignLeft>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$globe$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__Globe$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/globe.js [app-rsc] (ecmascript) <export default as Globe>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$link$2d$2$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__Link2$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/link-2.js [app-rsc] (ecmascript) <export default as Link2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$checkbox$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/checkbox.tsx [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/dropdown-menu.tsx [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$pkgx$2f$api$2d$service$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/pkgx/api-service.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/sonner/dist/index.mjs [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$pkgx$2f$store$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/settings/pkgx/store.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$inventory$2f$brand$2d$store$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/settings/inventory/brand-store.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$data$2d$table$2f$responsive$2d$data$2d$table$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/data-table/responsive-data-table.tsx [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$pkgx$2f$hooks$2f$index$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/features/settings/pkgx/hooks/index.ts [app-rsc] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$pkgx$2f$hooks$2f$use$2d$brand$2d$mapping$2d$validation$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/settings/pkgx/hooks/use-brand-mapping-validation.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$pkgx$2f$hooks$2f$use$2d$pkgx$2d$entity$2d$sync$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/settings/pkgx/hooks/use-pkgx-entity-sync.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$shared$2f$pkgx$2d$mapping$2d$dialog$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/shared/pkgx-mapping-dialog.tsx [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$pkgx$2f$components$2f$pkgx$2d$sync$2d$confirm$2d$dialog$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/settings/pkgx/components/pkgx-sync-confirm-dialog.tsx [app-rsc] (ecmascript)");
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
function BrandMappingTab() {
    const { settings, addBrandMapping, updateBrandMapping, deleteBrandMapping, syncBrandsFromPkgx, addLog } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$pkgx$2f$store$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["usePkgxSettingsStore"])();
    const brandStore = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$inventory$2f$brand$2d$store$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["useBrandStore"])();
    const [searchTerm, setSearchTerm] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["useState"]('');
    const [activeTab, setActiveTab] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["useState"]('pkgx-brands');
    const [isDialogOpen, setIsDialogOpen] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["useState"](false);
    const [editingMapping, setEditingMapping] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["useState"](null);
    const [isSyncing, setIsSyncing] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["useState"](false);
    // Detail dialog state
    const [isDetailDialogOpen, setIsDetailDialogOpen] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["useState"](false);
    const [selectedBrandForDetail, setSelectedBrandForDetail] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["useState"](null);
    const [isLoadingDetail, setIsLoadingDetail] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["useState"](false);
    const [isPushing, setIsPushing] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["useState"](false);
    // Table state
    const [pagination, setPagination] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["useState"]({
        pageIndex: 0,
        pageSize: 20
    });
    const [sorting, setSorting] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["useState"]({
        id: 'id',
        desc: false
    });
    const [rowSelection, setRowSelection] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["useState"]({});
    // Form state
    const [selectedHrmBrand, setSelectedHrmBrand] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["useState"]('');
    const [selectedPkgxBrand, setSelectedPkgxBrand] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["useState"]('');
    const [showWarningConfirm, setShowWarningConfirm] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["useState"](false);
    // Use shared PKGX entity sync hook
    const entitySync = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$pkgx$2f$hooks$2f$use$2d$pkgx$2d$entity$2d$sync$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["usePkgxEntitySync"])({
        entityType: 'brand',
        onLog: addLog
    });
    const hrmBrands = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["useMemo"](()=>brandStore.getActive().sort((a, b)=>a.name.localeCompare(b.name)), [
        brandStore
    ]);
    // Validation hook
    const validation = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$pkgx$2f$hooks$2f$use$2d$brand$2d$mapping$2d$validation$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["useBrandMappingValidation"])({
        existingMappings: settings.brandMappings,
        hrmBrands: hrmBrands,
        pkgxBrands: settings.brands,
        editingMappingId: editingMapping?.id,
        debounceMs: 300
    });
    // Find if PKGX brand is mapped
    const findMapping = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["useCallback"]((pkgxBrandId)=>{
        return settings.brandMappings.find((m)=>m.pkgxBrandId === pkgxBrandId);
    }, [
        settings.brandMappings
    ]);
    // PKGX Brands data for table
    const pkgxBrandsData = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["useMemo"](()=>{
        let filtered = settings.brands;
        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            filtered = settings.brands.filter((b)=>b.name.toLowerCase().includes(term) || b.id.toString().includes(term));
        }
        return filtered.map((b)=>({
                ...b,
                systemId: b.id.toString(),
                mappedToHrm: findMapping(b.id)?.hrmBrandName
            }));
    }, [
        settings.brands,
        searchTerm,
        findMapping
    ]);
    // Mappings data for table
    const mappingsData = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["useMemo"](()=>{
        let filtered = settings.brandMappings;
        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            filtered = settings.brandMappings.filter((m)=>m.hrmBrandName.toLowerCase().includes(term) || m.pkgxBrandName.toLowerCase().includes(term));
        }
        return filtered.map((m)=>({
                ...m,
                systemId: m.id
            }));
    }, [
        settings.brandMappings,
        searchTerm
    ]);
    // Paginated data
    const paginatedPkgxData = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["useMemo"](()=>{
        const start = pagination.pageIndex * pagination.pageSize;
        return pkgxBrandsData.slice(start, start + pagination.pageSize);
    }, [
        pkgxBrandsData,
        pagination
    ]);
    const paginatedMappingsData = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["useMemo"](()=>{
        const start = pagination.pageIndex * pagination.pageSize;
        return mappingsData.slice(start, start + pagination.pageSize);
    }, [
        mappingsData,
        pagination
    ]);
    // All selected rows and bulk actions for PKGX brands table
    const allSelectedPkgxRows = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["useMemo"](()=>paginatedPkgxData.filter((p)=>rowSelection[p.systemId]), [
        paginatedPkgxData,
        rowSelection
    ]);
    // Get selected PKGX brands that are NOT mapped (for bulk mapping)
    const selectedUnmappedBrands = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["useMemo"](()=>allSelectedPkgxRows.filter((b)=>!b.mappedToHrm), [
        allSelectedPkgxRows
    ]);
    // Get selected PKGX brands that ARE mapped (for bulk unlink)
    const selectedMappedBrands = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["useMemo"](()=>allSelectedPkgxRows.filter((b)=>b.mappedToHrm), [
        allSelectedPkgxRows
    ]);
    // Bulk actions for PKGX brands table
    const pkgxBulkActions = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["useMemo"](()=>[
            {
                label: `Hủy mapping (${selectedMappedBrands.length})`,
                icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$unlink$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__Unlink$3e$__["Unlink"],
                variant: 'destructive',
                disabled: selectedMappedBrands.length === 0,
                onSelect: ()=>{
                    if (selectedMappedBrands.length === 0) {
                        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["toast"].error('Không có thương hiệu đã mapping nào được chọn');
                        return;
                    }
                    // Bulk delete mappings
                    selectedMappedBrands.forEach((brand)=>{
                        const mapping = findMapping(brand.id);
                        if (mapping) {
                            deleteBrandMapping(mapping.id);
                        }
                    });
                    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["toast"].success(`Đã hủy mapping ${selectedMappedBrands.length} thương hiệu`);
                    setRowSelection({});
                }
            }
        ], [
        selectedMappedBrands,
        findMapping,
        deleteBrandMapping
    ]);
    // PKGX Brands columns
    const pkgxColumns = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["useMemo"](()=>[
            {
                id: 'select',
                header: ({ isAllPageRowsSelected, isSomePageRowsSelected, onToggleAll })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$checkbox$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Checkbox"], {
                        checked: isAllPageRowsSelected ? true : isSomePageRowsSelected ? 'indeterminate' : false,
                        onCheckedChange: (checked)=>onToggleAll?.(checked === true),
                        "aria-label": "Select all"
                    }, void 0, false, {
                        fileName: "[project]/features/settings/pkgx/components/brand-mapping-tab.tsx",
                        lineNumber: 184,
                        columnNumber: 9
                    }, this),
                cell: ({ row, isSelected, onToggleSelect })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$checkbox$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Checkbox"], {
                        checked: isSelected,
                        onCheckedChange: ()=>onToggleSelect(!isSelected),
                        "aria-label": "Select row",
                        onClick: (e)=>e.stopPropagation()
                    }, void 0, false, {
                        fileName: "[project]/features/settings/pkgx/components/brand-mapping-tab.tsx",
                        lineNumber: 191,
                        columnNumber: 9
                    }, this),
                size: 48,
                enableSorting: false,
                meta: {
                    displayName: 'Chọn',
                    sticky: 'left'
                }
            },
            {
                id: 'id',
                accessorKey: 'id',
                header: 'ID',
                size: 70,
                cell: ({ row })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "font-mono text-xs",
                        children: row.id
                    }, void 0, false, {
                        fileName: "[project]/features/settings/pkgx/components/brand-mapping-tab.tsx",
                        lineNumber: 207,
                        columnNumber: 26
                    }, this)
            },
            {
                id: 'name',
                accessorKey: 'name',
                header: 'Thương hiệu PKGX',
                cell: ({ row })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "font-medium",
                        children: row.name
                    }, void 0, false, {
                        fileName: "[project]/features/settings/pkgx/components/brand-mapping-tab.tsx",
                        lineNumber: 213,
                        columnNumber: 26
                    }, this)
            },
            {
                id: 'mappedToHrm',
                header: 'Mapping HRM',
                cell: ({ row })=>row.mappedToHrm ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$badge$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Badge"], {
                        variant: "default",
                        className: "bg-green-500",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle2$3e$__["CheckCircle2"], {
                                className: "h-3 w-3 mr-1"
                            }, void 0, false, {
                                fileName: "[project]/features/settings/pkgx/components/brand-mapping-tab.tsx",
                                lineNumber: 221,
                                columnNumber: 13
                            }, this),
                            row.mappedToHrm
                        ]
                    }, void 0, true, {
                        fileName: "[project]/features/settings/pkgx/components/brand-mapping-tab.tsx",
                        lineNumber: 220,
                        columnNumber: 11
                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$badge$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Badge"], {
                        variant: "secondary",
                        children: "Chưa mapping"
                    }, void 0, false, {
                        fileName: "[project]/features/settings/pkgx/components/brand-mapping-tab.tsx",
                        lineNumber: 225,
                        columnNumber: 11
                    }, this)
            },
            {
                id: 'actions',
                header: '',
                size: 50,
                cell: ({ row })=>{
                    // Get HRM brand for sync actions
                    const mapping = findMapping(row.id);
                    const hrmBrand = mapping ? hrmBrands.find((b)=>b.systemId === mapping.hrmBrandSystemId) : null;
                    // Helper to trigger sync with proper HRM data
                    const triggerSync = (actionKey)=>{
                        if (!mapping || !hrmBrand) {
                            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["toast"].error('Thương hiệu chưa được liên kết với HRM');
                            return;
                        }
                        const hrmData = {
                            systemId: hrmBrand.systemId,
                            name: hrmBrand.name,
                            website: hrmBrand.website,
                            seoKeywords: hrmBrand.seoKeywords,
                            seoTitle: hrmBrand.seoTitle,
                            metaDescription: hrmBrand.metaDescription,
                            shortDescription: hrmBrand.shortDescription,
                            longDescription: hrmBrand.longDescription,
                            websiteSeo: hrmBrand.websiteSeo
                        };
                        entitySync.triggerSyncAction(actionKey, row.id, hrmData, row.name);
                    };
                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["DropdownMenu"], {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["DropdownMenuTrigger"], {
                                asChild: true,
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Button"], {
                                    variant: "ghost",
                                    size: "icon",
                                    className: "h-8 w-8",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$ellipsis$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__MoreHorizontal$3e$__["MoreHorizontal"], {
                                        className: "h-4 w-4"
                                    }, void 0, false, {
                                        fileName: "[project]/features/settings/pkgx/components/brand-mapping-tab.tsx",
                                        lineNumber: 262,
                                        columnNumber: 17
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/features/settings/pkgx/components/brand-mapping-tab.tsx",
                                    lineNumber: 261,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/features/settings/pkgx/components/brand-mapping-tab.tsx",
                                lineNumber: 260,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["DropdownMenuContent"], {
                                align: "end",
                                children: row.mappedToHrm ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Fragment"], {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["DropdownMenuItem"], {
                                            onClick: ()=>triggerSync('sync_all'),
                                            className: "font-medium",
                                            title: "Đồng bộ: Tên, Website, Keywords, Meta Title, Meta Desc, Mô tả ngắn, Mô tả dài",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$refresh$2d$cw$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__RefreshCw$3e$__["RefreshCw"], {
                                                    className: "h-4 w-4 mr-2"
                                                }, void 0, false, {
                                                    fileName: "[project]/features/settings/pkgx/components/brand-mapping-tab.tsx",
                                                    lineNumber: 274,
                                                    columnNumber: 21
                                                }, this),
                                                "Đồng bộ tất cả"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/features/settings/pkgx/components/brand-mapping-tab.tsx",
                                            lineNumber: 269,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["DropdownMenuSeparator"], {}, void 0, false, {
                                            fileName: "[project]/features/settings/pkgx/components/brand-mapping-tab.tsx",
                                            lineNumber: 277,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["DropdownMenuItem"], {
                                            onClick: ()=>triggerSync('sync_basic'),
                                            title: "Đồng bộ: Tên thương hiệu, Website URL",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$globe$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__Globe$3e$__["Globe"], {
                                                    className: "h-4 w-4 mr-2"
                                                }, void 0, false, {
                                                    fileName: "[project]/features/settings/pkgx/components/brand-mapping-tab.tsx",
                                                    lineNumber: 284,
                                                    columnNumber: 21
                                                }, this),
                                                "Thông tin cơ bản"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/features/settings/pkgx/components/brand-mapping-tab.tsx",
                                            lineNumber: 280,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["DropdownMenuItem"], {
                                            onClick: ()=>triggerSync('sync_seo'),
                                            title: "Đồng bộ: Keywords, Meta Title, Meta Desc",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$search$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__Search$3e$__["Search"], {
                                                    className: "h-4 w-4 mr-2"
                                                }, void 0, false, {
                                                    fileName: "[project]/features/settings/pkgx/components/brand-mapping-tab.tsx",
                                                    lineNumber: 291,
                                                    columnNumber: 21
                                                }, this),
                                                "SEO"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/features/settings/pkgx/components/brand-mapping-tab.tsx",
                                            lineNumber: 287,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["DropdownMenuItem"], {
                                            onClick: ()=>triggerSync('sync_description'),
                                            title: "Đồng bộ: Mô tả ngắn (Short Desc), Mô tả dài (Long Desc)",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$text$2d$align$2d$start$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__AlignLeft$3e$__["AlignLeft"], {
                                                    className: "h-4 w-4 mr-2"
                                                }, void 0, false, {
                                                    fileName: "[project]/features/settings/pkgx/components/brand-mapping-tab.tsx",
                                                    lineNumber: 298,
                                                    columnNumber: 21
                                                }, this),
                                                "Mô tả"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/features/settings/pkgx/components/brand-mapping-tab.tsx",
                                            lineNumber: 294,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["DropdownMenuSeparator"], {}, void 0, false, {
                                            fileName: "[project]/features/settings/pkgx/components/brand-mapping-tab.tsx",
                                            lineNumber: 302,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["DropdownMenuItem"], {
                                            onClick: ()=>window.open(`https://phukiengiaxuong.com.vn/admin/brand.php?act=edit&brand_id=${row.id}`, '_blank'),
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$external$2d$link$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__ExternalLink$3e$__["ExternalLink"], {
                                                    className: "h-4 w-4 mr-2"
                                                }, void 0, false, {
                                                    fileName: "[project]/features/settings/pkgx/components/brand-mapping-tab.tsx",
                                                    lineNumber: 304,
                                                    columnNumber: 21
                                                }, this),
                                                "Xem trên PKGX"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/features/settings/pkgx/components/brand-mapping-tab.tsx",
                                            lineNumber: 303,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["DropdownMenuSeparator"], {}, void 0, false, {
                                            fileName: "[project]/features/settings/pkgx/components/brand-mapping-tab.tsx",
                                            lineNumber: 309,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["DropdownMenuItem"], {
                                            onClick: ()=>entitySync.handleConfirm('Hủy liên kết PKGX', `Bạn có chắc muốn hủy liên kết thương hiệu "${row.name}" với PKGX?`, ()=>handleUnlinkBrand(row.id)),
                                            className: "text-destructive focus:text-destructive",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$unlink$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__Unlink$3e$__["Unlink"], {
                                                    className: "h-4 w-4 mr-2"
                                                }, void 0, false, {
                                                    fileName: "[project]/features/settings/pkgx/components/brand-mapping-tab.tsx",
                                                    lineNumber: 318,
                                                    columnNumber: 21
                                                }, this),
                                                "Hủy liên kết"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/features/settings/pkgx/components/brand-mapping-tab.tsx",
                                            lineNumber: 310,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, void 0, true) : /* Not linked - show link option */ /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Fragment"], {
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dropdown$2d$menu$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["DropdownMenuItem"], {
                                        onClick: ()=>handleQuickMap(row),
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$link$2d$2$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__Link2$3e$__["Link2"], {
                                                className: "h-4 w-4 mr-2"
                                            }, void 0, false, {
                                                fileName: "[project]/features/settings/pkgx/components/brand-mapping-tab.tsx",
                                                lineNumber: 326,
                                                columnNumber: 21
                                            }, this),
                                            "Liên kết với HRM"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/features/settings/pkgx/components/brand-mapping-tab.tsx",
                                        lineNumber: 325,
                                        columnNumber: 19
                                    }, this)
                                }, void 0, false)
                            }, void 0, false, {
                                fileName: "[project]/features/settings/pkgx/components/brand-mapping-tab.tsx",
                                lineNumber: 265,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/features/settings/pkgx/components/brand-mapping-tab.tsx",
                        lineNumber: 259,
                        columnNumber: 11
                    }, this);
                }
            }
        ], [
        hrmBrands,
        findMapping,
        entitySync
    ]);
    // Mappings columns
    const mappingColumns = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["useMemo"](()=>[
            {
                id: 'hrmBrandName',
                accessorKey: 'hrmBrandName',
                header: 'Thương hiệu HRM',
                cell: ({ row })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "font-medium",
                        children: row.hrmBrandName
                    }, void 0, false, {
                        fileName: "[project]/features/settings/pkgx/components/brand-mapping-tab.tsx",
                        lineNumber: 344,
                        columnNumber: 26
                    }, this)
            },
            {
                id: 'pkgxBrandName',
                accessorKey: 'pkgxBrandName',
                header: 'Thương hiệu PKGX',
                cell: ({ row })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        children: row.pkgxBrandName
                    }, void 0, false, {
                        fileName: "[project]/features/settings/pkgx/components/brand-mapping-tab.tsx",
                        lineNumber: 350,
                        columnNumber: 26
                    }, this)
            },
            {
                id: 'pkgxBrandId',
                accessorKey: 'pkgxBrandId',
                header: 'ID PKGX',
                size: 80,
                cell: ({ row })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "font-mono text-muted-foreground",
                        children: row.pkgxBrandId
                    }, void 0, false, {
                        fileName: "[project]/features/settings/pkgx/components/brand-mapping-tab.tsx",
                        lineNumber: 357,
                        columnNumber: 26
                    }, this)
            },
            {
                id: 'actions',
                header: 'Hành động',
                size: 100,
                cell: ({ row })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex justify-end gap-1",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Button"], {
                                variant: "ghost",
                                size: "sm",
                                onClick: ()=>handleOpenDialog(row),
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$pencil$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__Pencil$3e$__["Pencil"], {
                                    className: "h-4 w-4"
                                }, void 0, false, {
                                    fileName: "[project]/features/settings/pkgx/components/brand-mapping-tab.tsx",
                                    lineNumber: 366,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/features/settings/pkgx/components/brand-mapping-tab.tsx",
                                lineNumber: 365,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Button"], {
                                variant: "ghost",
                                size: "sm",
                                onClick: ()=>handleDelete(row.id),
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trash$2d$2$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__Trash2$3e$__["Trash2"], {
                                    className: "h-4 w-4 text-destructive"
                                }, void 0, false, {
                                    fileName: "[project]/features/settings/pkgx/components/brand-mapping-tab.tsx",
                                    lineNumber: 369,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/features/settings/pkgx/components/brand-mapping-tab.tsx",
                                lineNumber: 368,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/features/settings/pkgx/components/brand-mapping-tab.tsx",
                        lineNumber: 364,
                        columnNumber: 9
                    }, this)
            }
        ], []);
    const handleQuickMap = (pkgxBrand)=>{
        setSelectedPkgxBrand(pkgxBrand.id.toString());
        setSelectedHrmBrand('');
        setEditingMapping(null);
        setIsDialogOpen(true);
    };
    const handleUnlinkBrand = (pkgxBrandId)=>{
        const mapping = findMapping(pkgxBrandId);
        if (mapping) {
            deleteBrandMapping(mapping.id);
            addLog({
                action: 'unlink_mapping',
                status: 'success',
                message: `Đã hủy liên kết thương hiệu: ${mapping.hrmBrandName} ↔ ${mapping.pkgxBrandName}`,
                details: {
                    brandId: pkgxBrandId
                }
            });
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["toast"].success('Đã hủy liên kết thương hiệu');
        }
    };
    const handleOpenDialog = (mapping)=>{
        if (mapping) {
            setEditingMapping(mapping);
            setSelectedHrmBrand(mapping.hrmBrandSystemId);
            setSelectedPkgxBrand(mapping.pkgxBrandId.toString());
        } else {
            setEditingMapping(null);
            setSelectedHrmBrand('');
            setSelectedPkgxBrand('');
        }
        setIsDialogOpen(true);
    };
    const handleCloseDialog = ()=>{
        setIsDialogOpen(false);
        setEditingMapping(null);
        setSelectedHrmBrand('');
        setSelectedPkgxBrand('');
        setShowWarningConfirm(false);
        validation.clearValidation();
    };
    // Validate when form values change
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["useEffect"](()=>{
        if (isDialogOpen && (selectedHrmBrand || selectedPkgxBrand)) {
            const input = {
                hrmBrandSystemId: selectedHrmBrand || '',
                hrmBrandName: hrmBrands.find((b)=>b.systemId === selectedHrmBrand)?.name || '',
                pkgxBrandId: selectedPkgxBrand ? parseInt(selectedPkgxBrand) : '',
                pkgxBrandName: settings.brands.find((b)=>b.id === parseInt(selectedPkgxBrand))?.name || ''
            };
            validation.validateAsync(input);
        }
    }, [
        selectedHrmBrand,
        selectedPkgxBrand,
        isDialogOpen
    ]);
    const handleSave = ()=>{
        // Build input for validation
        const input = {
            hrmBrandSystemId: selectedHrmBrand || '',
            hrmBrandName: hrmBrands.find((b)=>b.systemId === selectedHrmBrand)?.name || '',
            pkgxBrandId: selectedPkgxBrand ? parseInt(selectedPkgxBrand) : '',
            pkgxBrandName: settings.brands.find((b)=>b.id === parseInt(selectedPkgxBrand))?.name || ''
        };
        // Run final validation
        const result = validation.validate(input);
        // Block if there are errors
        if (!result.isValid) {
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["toast"].error(result.errors[0]?.message || 'Vui lòng kiểm tra lại thông tin');
            return;
        }
        // Show warning confirmation if there are warnings and not yet confirmed
        if (result.warnings.length > 0 && !showWarningConfirm) {
            setShowWarningConfirm(true);
            return;
        }
        const hrmBrand = hrmBrands.find((b)=>b.systemId === selectedHrmBrand);
        const pkgxBrand = settings.brands.find((b)=>b.id === parseInt(selectedPkgxBrand));
        if (!hrmBrand || !pkgxBrand) {
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["toast"].error('Không tìm thấy thương hiệu');
            return;
        }
        if (editingMapping) {
            updateBrandMapping(editingMapping.id, {
                hrmBrandSystemId: hrmBrand.systemId,
                hrmBrandName: hrmBrand.name,
                pkgxBrandId: pkgxBrand.id,
                pkgxBrandName: pkgxBrand.name
            });
            addLog({
                action: 'save_mapping',
                status: 'success',
                message: `Cập nhật mapping thương hiệu: ${hrmBrand.name} → ${pkgxBrand.name}`,
                details: {
                    brandId: pkgxBrand.id
                }
            });
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["toast"].success('Đã cập nhật mapping thương hiệu');
        } else {
            addBrandMapping({
                id: `brandmap-${Date.now()}`,
                hrmBrandSystemId: hrmBrand.systemId,
                hrmBrandName: hrmBrand.name,
                pkgxBrandId: pkgxBrand.id,
                pkgxBrandName: pkgxBrand.name
            });
            addLog({
                action: 'save_mapping',
                status: 'success',
                message: `Thêm mapping thương hiệu: ${hrmBrand.name} → ${pkgxBrand.name}`,
                details: {
                    brandId: pkgxBrand.id
                }
            });
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["toast"].success('Đã thêm mapping thương hiệu');
        }
        handleCloseDialog();
    };
    const handleDelete = (id)=>{
        const mapping = settings.brandMappings.find((m)=>m.id === id);
        deleteBrandMapping(id);
        if (mapping) {
            addLog({
                action: 'save_mapping',
                status: 'info',
                message: `Xóa mapping thương hiệu: ${mapping.hrmBrandName}`,
                details: {
                    brandId: mapping.pkgxBrandId
                }
            });
        }
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["toast"].success('Đã xóa mapping thương hiệu');
    };
    const handleSyncFromPkgx = async ()=>{
        setIsSyncing(true);
        try {
            await syncBrandsFromPkgx();
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["toast"].success('Đã đồng bộ thương hiệu từ PKGX');
        } catch (error) {
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["toast"].error(error instanceof Error ? error.message : 'Lỗi khi đồng bộ thương hiệu');
        } finally{
            setIsSyncing(false);
        }
    };
    // View brand detail
    const handleViewDetail = async (pkgxBrandId)=>{
        setIsLoadingDetail(true);
        setIsDetailDialogOpen(true);
        try {
            const response = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$pkgx$2f$api$2d$service$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getBrandById"])(pkgxBrandId);
            if (response.success && response.data) {
                setSelectedBrandForDetail(response.data);
            } else {
                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["toast"].error('Không tìm thấy thương hiệu');
                setIsDetailDialogOpen(false);
            }
        } catch (error) {
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["toast"].error('Không thể tải thông tin thương hiệu');
            setIsDetailDialogOpen(false);
        } finally{
            setIsLoadingDetail(false);
        }
    };
    // Push brand from HRM to PKGX
    const handlePushBrand = async (pkgxBrandId)=>{
        const mapping = findMapping(pkgxBrandId);
        if (!mapping) {
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["toast"].error('Thương hiệu chưa được mapping với HRM');
            return;
        }
        const hrmBrand = hrmBrands.find((b)=>b.systemId === mapping.hrmBrandSystemId);
        if (!hrmBrand) {
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["toast"].error('Không tìm thấy thương hiệu HRM');
            return;
        }
        setIsPushing(true);
        try {
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$pkgx$2f$api$2d$service$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["updateBrand"])(pkgxBrandId, {
                brand_name: hrmBrand.name,
                brand_desc: hrmBrand.description || '',
                site_url: ''
            });
            // Refresh detail
            const response = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$pkgx$2f$api$2d$service$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getBrandById"])(pkgxBrandId);
            if (response.success && response.data) {
                setSelectedBrandForDetail(response.data);
            }
            addLog({
                action: 'sync_all',
                status: 'success',
                message: `Đẩy thương hiệu từ HRM sang PKGX: ${hrmBrand.name}`,
                details: {
                    brandId: pkgxBrandId
                }
            });
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["toast"].success('Đã đẩy thông tin thương hiệu sang PKGX');
        } catch (error) {
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["toast"].error(error instanceof Error ? error.message : 'Lỗi khi đẩy thương hiệu');
        } finally{
            setIsPushing(false);
        }
    };
    // Mobile card renderers
    const renderPkgxMobileCard = (row)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "p-4 space-y-3",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex items-start justify-between",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "font-medium",
                                    children: row.name
                                }, void 0, false, {
                                    fileName: "[project]/features/settings/pkgx/components/brand-mapping-tab.tsx",
                                    lineNumber: 591,
                                    columnNumber: 11
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "text-sm text-muted-foreground",
                                    children: [
                                        "ID: ",
                                        row.id
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/features/settings/pkgx/components/brand-mapping-tab.tsx",
                                    lineNumber: 592,
                                    columnNumber: 11
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/features/settings/pkgx/components/brand-mapping-tab.tsx",
                            lineNumber: 590,
                            columnNumber: 9
                        }, this),
                        row.mappedToHrm ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$badge$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Badge"], {
                            variant: "default",
                            className: "bg-green-500 shrink-0",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle2$3e$__["CheckCircle2"], {
                                    className: "h-3 w-3 mr-1"
                                }, void 0, false, {
                                    fileName: "[project]/features/settings/pkgx/components/brand-mapping-tab.tsx",
                                    lineNumber: 596,
                                    columnNumber: 13
                                }, this),
                                "Đã mapping"
                            ]
                        }, void 0, true, {
                            fileName: "[project]/features/settings/pkgx/components/brand-mapping-tab.tsx",
                            lineNumber: 595,
                            columnNumber: 11
                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$badge$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Badge"], {
                            variant: "secondary",
                            className: "shrink-0",
                            children: "Chưa mapping"
                        }, void 0, false, {
                            fileName: "[project]/features/settings/pkgx/components/brand-mapping-tab.tsx",
                            lineNumber: 600,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/features/settings/pkgx/components/brand-mapping-tab.tsx",
                    lineNumber: 589,
                    columnNumber: 7
                }, this),
                row.mappedToHrm && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "text-sm",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "text-muted-foreground",
                            children: "HRM: "
                        }, void 0, false, {
                            fileName: "[project]/features/settings/pkgx/components/brand-mapping-tab.tsx",
                            lineNumber: 605,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            children: row.mappedToHrm
                        }, void 0, false, {
                            fileName: "[project]/features/settings/pkgx/components/brand-mapping-tab.tsx",
                            lineNumber: 606,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/features/settings/pkgx/components/brand-mapping-tab.tsx",
                    lineNumber: 604,
                    columnNumber: 9
                }, this),
                !row.mappedToHrm && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Button"], {
                    variant: "outline",
                    size: "sm",
                    className: "w-full",
                    onClick: ()=>handleQuickMap(row),
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$link$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__Link$3e$__["Link"], {
                            className: "h-4 w-4 mr-2"
                        }, void 0, false, {
                            fileName: "[project]/features/settings/pkgx/components/brand-mapping-tab.tsx",
                            lineNumber: 616,
                            columnNumber: 11
                        }, this),
                        "Mapping nhanh"
                    ]
                }, void 0, true, {
                    fileName: "[project]/features/settings/pkgx/components/brand-mapping-tab.tsx",
                    lineNumber: 610,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/features/settings/pkgx/components/brand-mapping-tab.tsx",
            lineNumber: 588,
            columnNumber: 5
        }, this);
    const renderMappingMobileCard = (row)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "p-4 space-y-3",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "font-medium",
                            children: row.hrmBrandName
                        }, void 0, false, {
                            fileName: "[project]/features/settings/pkgx/components/brand-mapping-tab.tsx",
                            lineNumber: 626,
                            columnNumber: 9
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "text-sm text-muted-foreground",
                            children: [
                                "→ ",
                                row.pkgxBrandName,
                                " (ID: ",
                                row.pkgxBrandId,
                                ")"
                            ]
                        }, void 0, true, {
                            fileName: "[project]/features/settings/pkgx/components/brand-mapping-tab.tsx",
                            lineNumber: 627,
                            columnNumber: 9
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/features/settings/pkgx/components/brand-mapping-tab.tsx",
                    lineNumber: 625,
                    columnNumber: 7
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex gap-2",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Button"], {
                            variant: "outline",
                            size: "sm",
                            className: "flex-1",
                            onClick: ()=>handleOpenDialog(row),
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$pencil$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__Pencil$3e$__["Pencil"], {
                                    className: "h-4 w-4 mr-2"
                                }, void 0, false, {
                                    fileName: "[project]/features/settings/pkgx/components/brand-mapping-tab.tsx",
                                    lineNumber: 633,
                                    columnNumber: 11
                                }, this),
                                "Sửa"
                            ]
                        }, void 0, true, {
                            fileName: "[project]/features/settings/pkgx/components/brand-mapping-tab.tsx",
                            lineNumber: 632,
                            columnNumber: 9
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Button"], {
                            variant: "outline",
                            size: "sm",
                            className: "flex-1",
                            onClick: ()=>handleDelete(row.id),
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trash$2d$2$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__Trash2$3e$__["Trash2"], {
                                    className: "h-4 w-4 mr-2 text-destructive"
                                }, void 0, false, {
                                    fileName: "[project]/features/settings/pkgx/components/brand-mapping-tab.tsx",
                                    lineNumber: 637,
                                    columnNumber: 11
                                }, this),
                                "Xóa"
                            ]
                        }, void 0, true, {
                            fileName: "[project]/features/settings/pkgx/components/brand-mapping-tab.tsx",
                            lineNumber: 636,
                            columnNumber: 9
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/features/settings/pkgx/components/brand-mapping-tab.tsx",
                    lineNumber: 631,
                    columnNumber: 7
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/features/settings/pkgx/components/brand-mapping-tab.tsx",
            lineNumber: 624,
            columnNumber: 5
        }, this);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "space-y-6",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Card"], {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["CardHeader"], {
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex flex-col sm:flex-row sm:items-center justify-between gap-4",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["CardTitle"], {
                                            className: "text-lg",
                                            children: "Mapping thương hiệu"
                                        }, void 0, false, {
                                            fileName: "[project]/features/settings/pkgx/components/brand-mapping-tab.tsx",
                                            lineNumber: 650,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["CardDescription"], {
                                            children: "Liên kết thương hiệu HRM với thương hiệu PKGX để đồng bộ sản phẩm"
                                        }, void 0, false, {
                                            fileName: "[project]/features/settings/pkgx/components/brand-mapping-tab.tsx",
                                            lineNumber: 651,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/features/settings/pkgx/components/brand-mapping-tab.tsx",
                                    lineNumber: 649,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex gap-2",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Button"], {
                                            onClick: handleSyncFromPkgx,
                                            disabled: isSyncing,
                                            variant: "outline",
                                            children: [
                                                isSyncing ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__["Loader2"], {
                                                    className: "h-4 w-4 mr-2 animate-spin"
                                                }, void 0, false, {
                                                    fileName: "[project]/features/settings/pkgx/components/brand-mapping-tab.tsx",
                                                    lineNumber: 657,
                                                    columnNumber: 30
                                                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$refresh$2d$cw$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__RefreshCw$3e$__["RefreshCw"], {
                                                    className: "h-4 w-4 mr-2"
                                                }, void 0, false, {
                                                    fileName: "[project]/features/settings/pkgx/components/brand-mapping-tab.tsx",
                                                    lineNumber: 657,
                                                    columnNumber: 82
                                                }, this),
                                                "Đồng bộ từ PKGX"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/features/settings/pkgx/components/brand-mapping-tab.tsx",
                                            lineNumber: 656,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Button"], {
                                            onClick: ()=>handleOpenDialog(),
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__["Plus"], {
                                                    className: "h-4 w-4 mr-2"
                                                }, void 0, false, {
                                                    fileName: "[project]/features/settings/pkgx/components/brand-mapping-tab.tsx",
                                                    lineNumber: 661,
                                                    columnNumber: 17
                                                }, this),
                                                "Thêm mapping"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/features/settings/pkgx/components/brand-mapping-tab.tsx",
                                            lineNumber: 660,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/features/settings/pkgx/components/brand-mapping-tab.tsx",
                                    lineNumber: 655,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/features/settings/pkgx/components/brand-mapping-tab.tsx",
                            lineNumber: 648,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/features/settings/pkgx/components/brand-mapping-tab.tsx",
                        lineNumber: 647,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["CardContent"], {
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "space-y-4",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex flex-col sm:flex-row items-stretch sm:items-center gap-2",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "relative flex-1",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$search$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__Search$3e$__["Search"], {
                                                    className: "absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                                                }, void 0, false, {
                                                    fileName: "[project]/features/settings/pkgx/components/brand-mapping-tab.tsx",
                                                    lineNumber: 671,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$input$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Input"], {
                                                    placeholder: "Tìm kiếm thương hiệu...",
                                                    value: searchTerm,
                                                    onChange: (e)=>setSearchTerm(e.target.value),
                                                    className: "pl-9"
                                                }, void 0, false, {
                                                    fileName: "[project]/features/settings/pkgx/components/brand-mapping-tab.tsx",
                                                    lineNumber: 672,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/features/settings/pkgx/components/brand-mapping-tab.tsx",
                                            lineNumber: 670,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "text-sm text-muted-foreground whitespace-nowrap text-center sm:text-right",
                                            children: [
                                                settings.brands.length,
                                                " thương hiệu PKGX | ",
                                                settings.brandMappings.length,
                                                " mapping"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/features/settings/pkgx/components/brand-mapping-tab.tsx",
                                            lineNumber: 679,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/features/settings/pkgx/components/brand-mapping-tab.tsx",
                                    lineNumber: 669,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$tabs$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Tabs"], {
                                    value: activeTab,
                                    onValueChange: setActiveTab,
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$tabs$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["TabsList"], {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$tabs$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["TabsTrigger"], {
                                                    value: "pkgx-brands",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$award$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__Award$3e$__["Award"], {
                                                            className: "h-4 w-4 mr-2"
                                                        }, void 0, false, {
                                                            fileName: "[project]/features/settings/pkgx/components/brand-mapping-tab.tsx",
                                                            lineNumber: 687,
                                                            columnNumber: 19
                                                        }, this),
                                                        "Thương hiệu PKGX (",
                                                        settings.brands.length,
                                                        ")"
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/features/settings/pkgx/components/brand-mapping-tab.tsx",
                                                    lineNumber: 686,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$tabs$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["TabsTrigger"], {
                                                    value: "mappings",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$link$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__Link$3e$__["Link"], {
                                                            className: "h-4 w-4 mr-2"
                                                        }, void 0, false, {
                                                            fileName: "[project]/features/settings/pkgx/components/brand-mapping-tab.tsx",
                                                            lineNumber: 691,
                                                            columnNumber: 19
                                                        }, this),
                                                        "Mapping (",
                                                        settings.brandMappings.length,
                                                        ")"
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/features/settings/pkgx/components/brand-mapping-tab.tsx",
                                                    lineNumber: 690,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/features/settings/pkgx/components/brand-mapping-tab.tsx",
                                            lineNumber: 685,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$tabs$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["TabsContent"], {
                                            value: "pkgx-brands",
                                            className: "mt-4",
                                            children: settings.brands.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "text-center py-8 text-muted-foreground",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$award$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__Award$3e$__["Award"], {
                                                        className: "h-12 w-12 mx-auto mb-4 opacity-50"
                                                    }, void 0, false, {
                                                        fileName: "[project]/features/settings/pkgx/components/brand-mapping-tab.tsx",
                                                        lineNumber: 699,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        children: "Chưa có thương hiệu từ PKGX."
                                                    }, void 0, false, {
                                                        fileName: "[project]/features/settings/pkgx/components/brand-mapping-tab.tsx",
                                                        lineNumber: 700,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "text-sm mt-1",
                                                        children: 'Bấm "Đồng bộ từ PKGX" để lấy danh sách.'
                                                    }, void 0, false, {
                                                        fileName: "[project]/features/settings/pkgx/components/brand-mapping-tab.tsx",
                                                        lineNumber: 701,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/features/settings/pkgx/components/brand-mapping-tab.tsx",
                                                lineNumber: 698,
                                                columnNumber: 19
                                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$data$2d$table$2f$responsive$2d$data$2d$table$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ResponsiveDataTable"], {
                                                columns: pkgxColumns,
                                                data: paginatedPkgxData,
                                                renderMobileCard: renderPkgxMobileCard,
                                                pageCount: Math.ceil(pkgxBrandsData.length / pagination.pageSize),
                                                pagination: pagination,
                                                setPagination: setPagination,
                                                rowCount: pkgxBrandsData.length,
                                                sorting: sorting,
                                                setSorting: setSorting,
                                                rowSelection: rowSelection,
                                                setRowSelection: setRowSelection,
                                                bulkActions: pkgxBulkActions,
                                                allSelectedRows: allSelectedPkgxRows,
                                                emptyTitle: "Không tìm thấy thương hiệu"
                                            }, void 0, false, {
                                                fileName: "[project]/features/settings/pkgx/components/brand-mapping-tab.tsx",
                                                lineNumber: 704,
                                                columnNumber: 19
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/features/settings/pkgx/components/brand-mapping-tab.tsx",
                                            lineNumber: 696,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$tabs$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["TabsContent"], {
                                            value: "mappings",
                                            className: "mt-4",
                                            children: settings.brandMappings.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "text-center py-8 text-muted-foreground",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$link$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__Link$3e$__["Link"], {
                                                        className: "h-12 w-12 mx-auto mb-4 opacity-50"
                                                    }, void 0, false, {
                                                        fileName: "[project]/features/settings/pkgx/components/brand-mapping-tab.tsx",
                                                        lineNumber: 726,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        children: "Chưa có mapping nào."
                                                    }, void 0, false, {
                                                        fileName: "[project]/features/settings/pkgx/components/brand-mapping-tab.tsx",
                                                        lineNumber: 727,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "text-sm mt-1",
                                                        children: 'Bấm "Thêm mapping" để bắt đầu.'
                                                    }, void 0, false, {
                                                        fileName: "[project]/features/settings/pkgx/components/brand-mapping-tab.tsx",
                                                        lineNumber: 728,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/features/settings/pkgx/components/brand-mapping-tab.tsx",
                                                lineNumber: 725,
                                                columnNumber: 19
                                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$data$2d$table$2f$responsive$2d$data$2d$table$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ResponsiveDataTable"], {
                                                columns: mappingColumns,
                                                data: paginatedMappingsData,
                                                renderMobileCard: renderMappingMobileCard,
                                                pageCount: Math.ceil(mappingsData.length / pagination.pageSize),
                                                pagination: pagination,
                                                setPagination: setPagination,
                                                rowCount: mappingsData.length,
                                                sorting: sorting,
                                                setSorting: setSorting,
                                                emptyTitle: "Không tìm thấy mapping"
                                            }, void 0, false, {
                                                fileName: "[project]/features/settings/pkgx/components/brand-mapping-tab.tsx",
                                                lineNumber: 731,
                                                columnNumber: 19
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/features/settings/pkgx/components/brand-mapping-tab.tsx",
                                            lineNumber: 723,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/features/settings/pkgx/components/brand-mapping-tab.tsx",
                                    lineNumber: 684,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/features/settings/pkgx/components/brand-mapping-tab.tsx",
                            lineNumber: 668,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/features/settings/pkgx/components/brand-mapping-tab.tsx",
                        lineNumber: 667,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/features/settings/pkgx/components/brand-mapping-tab.tsx",
                lineNumber: 646,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$shared$2f$pkgx$2d$mapping$2d$dialog$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["PkgxMappingDialog"], {
                open: isDialogOpen,
                onOpenChange: setIsDialogOpen,
                type: "brand",
                isEditing: !!editingMapping,
                hrmItems: hrmBrands.map((b)=>({
                        id: b.systemId,
                        name: b.name
                    })),
                selectedHrmId: selectedHrmBrand,
                onSelectHrmId: setSelectedHrmBrand,
                pkgxItems: settings.brands.map((b)=>({
                        id: b.id.toString(),
                        name: b.name,
                        subText: `ID: ${b.id}`
                    })),
                selectedPkgxId: selectedPkgxBrand,
                onSelectPkgxId: setSelectedPkgxBrand,
                pkgxSuggestions: validation.suggestions.map((s)=>({
                        item: {
                            id: s.brand.id.toString(),
                            name: s.brand.name
                        },
                        score: s.score
                    })),
                validation: validation.validationResult,
                hasErrors: validation.hasErrors,
                isValidating: validation.isValidating,
                showWarningConfirm: showWarningConfirm,
                onConfirm: handleSave,
                onCancel: handleCloseDialog
            }, void 0, false, {
                fileName: "[project]/features/settings/pkgx/components/brand-mapping-tab.tsx",
                lineNumber: 751,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Dialog"], {
                open: isDetailDialogOpen,
                onOpenChange: setIsDetailDialogOpen,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["DialogContent"], {
                    className: "max-w-2xl",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["DialogHeader"], {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["DialogTitle"], {
                                    className: "flex items-center gap-2",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$award$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__Award$3e$__["Award"], {
                                            className: "h-5 w-5"
                                        }, void 0, false, {
                                            fileName: "[project]/features/settings/pkgx/components/brand-mapping-tab.tsx",
                                            lineNumber: 786,
                                            columnNumber: 15
                                        }, this),
                                        "Chi tiết thương hiệu PKGX"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/features/settings/pkgx/components/brand-mapping-tab.tsx",
                                    lineNumber: 785,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["DialogDescription"], {
                                    children: "Thông tin chi tiết và SEO của thương hiệu"
                                }, void 0, false, {
                                    fileName: "[project]/features/settings/pkgx/components/brand-mapping-tab.tsx",
                                    lineNumber: 789,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/features/settings/pkgx/components/brand-mapping-tab.tsx",
                            lineNumber: 784,
                            columnNumber: 11
                        }, this),
                        isLoadingDetail ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex items-center justify-center py-12",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__["Loader2"], {
                                className: "h-8 w-8 animate-spin text-primary"
                            }, void 0, false, {
                                fileName: "[project]/features/settings/pkgx/components/brand-mapping-tab.tsx",
                                lineNumber: 796,
                                columnNumber: 15
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/features/settings/pkgx/components/brand-mapping-tab.tsx",
                            lineNumber: 795,
                            columnNumber: 13
                        }, this) : selectedBrandForDetail ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$scroll$2d$area$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ScrollArea"], {
                            className: "max-h-[60vh]",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "space-y-6 pr-4",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "space-y-3",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                                className: "font-medium text-sm text-muted-foreground uppercase tracking-wide",
                                                children: "Thông tin cơ bản"
                                            }, void 0, false, {
                                                fileName: "[project]/features/settings/pkgx/components/brand-mapping-tab.tsx",
                                                lineNumber: 803,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "grid grid-cols-2 gap-4 text-sm",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "text-muted-foreground",
                                                                children: "ID:"
                                                            }, void 0, false, {
                                                                fileName: "[project]/features/settings/pkgx/components/brand-mapping-tab.tsx",
                                                                lineNumber: 808,
                                                                columnNumber: 23
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "ml-2 font-mono",
                                                                children: selectedBrandForDetail.brand_id
                                                            }, void 0, false, {
                                                                fileName: "[project]/features/settings/pkgx/components/brand-mapping-tab.tsx",
                                                                lineNumber: 809,
                                                                columnNumber: 23
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/features/settings/pkgx/components/brand-mapping-tab.tsx",
                                                        lineNumber: 807,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "text-muted-foreground",
                                                                children: "Tên:"
                                                            }, void 0, false, {
                                                                fileName: "[project]/features/settings/pkgx/components/brand-mapping-tab.tsx",
                                                                lineNumber: 812,
                                                                columnNumber: 23
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "ml-2 font-medium",
                                                                children: selectedBrandForDetail.brand_name
                                                            }, void 0, false, {
                                                                fileName: "[project]/features/settings/pkgx/components/brand-mapping-tab.tsx",
                                                                lineNumber: 813,
                                                                columnNumber: 23
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/features/settings/pkgx/components/brand-mapping-tab.tsx",
                                                        lineNumber: 811,
                                                        columnNumber: 21
                                                    }, this),
                                                    selectedBrandForDetail.brand_logo && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "col-span-2",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "text-muted-foreground",
                                                                children: "Logo:"
                                                            }, void 0, false, {
                                                                fileName: "[project]/features/settings/pkgx/components/brand-mapping-tab.tsx",
                                                                lineNumber: 817,
                                                                columnNumber: 25
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                                                src: selectedBrandForDetail.brand_logo,
                                                                alt: selectedBrandForDetail.brand_name,
                                                                className: "mt-2 h-16 object-contain"
                                                            }, void 0, false, {
                                                                fileName: "[project]/features/settings/pkgx/components/brand-mapping-tab.tsx",
                                                                lineNumber: 818,
                                                                columnNumber: 25
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/features/settings/pkgx/components/brand-mapping-tab.tsx",
                                                        lineNumber: 816,
                                                        columnNumber: 23
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/features/settings/pkgx/components/brand-mapping-tab.tsx",
                                                lineNumber: 806,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/features/settings/pkgx/components/brand-mapping-tab.tsx",
                                        lineNumber: 802,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "space-y-3",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                                className: "font-medium text-sm text-muted-foreground uppercase tracking-wide",
                                                children: "SEO & Mô tả"
                                            }, void 0, false, {
                                                fileName: "[project]/features/settings/pkgx/components/brand-mapping-tab.tsx",
                                                lineNumber: 830,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "space-y-3 text-sm",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "text-muted-foreground block mb-1",
                                                                children: "Website:"
                                                            }, void 0, false, {
                                                                fileName: "[project]/features/settings/pkgx/components/brand-mapping-tab.tsx",
                                                                lineNumber: 835,
                                                                columnNumber: 23
                                                            }, this),
                                                            selectedBrandForDetail.site_url ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                                                href: selectedBrandForDetail.site_url,
                                                                target: "_blank",
                                                                rel: "noopener noreferrer",
                                                                className: "text-primary hover:underline",
                                                                children: selectedBrandForDetail.site_url
                                                            }, void 0, false, {
                                                                fileName: "[project]/features/settings/pkgx/components/brand-mapping-tab.tsx",
                                                                lineNumber: 837,
                                                                columnNumber: 25
                                                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "text-muted-foreground italic",
                                                                children: "Chưa có"
                                                            }, void 0, false, {
                                                                fileName: "[project]/features/settings/pkgx/components/brand-mapping-tab.tsx",
                                                                lineNumber: 846,
                                                                columnNumber: 25
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/features/settings/pkgx/components/brand-mapping-tab.tsx",
                                                        lineNumber: 834,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "text-muted-foreground block mb-1",
                                                                children: "Mô tả:"
                                                            }, void 0, false, {
                                                                fileName: "[project]/features/settings/pkgx/components/brand-mapping-tab.tsx",
                                                                lineNumber: 850,
                                                                columnNumber: 23
                                                            }, this),
                                                            selectedBrandForDetail.brand_desc ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "prose prose-sm dark:prose-invert max-w-none bg-muted/30 rounded-md p-3",
                                                                dangerouslySetInnerHTML: {
                                                                    __html: selectedBrandForDetail.brand_desc
                                                                }
                                                            }, void 0, false, {
                                                                fileName: "[project]/features/settings/pkgx/components/brand-mapping-tab.tsx",
                                                                lineNumber: 852,
                                                                columnNumber: 25
                                                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "text-muted-foreground italic",
                                                                children: "Chưa có mô tả"
                                                            }, void 0, false, {
                                                                fileName: "[project]/features/settings/pkgx/components/brand-mapping-tab.tsx",
                                                                lineNumber: 857,
                                                                columnNumber: 25
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/features/settings/pkgx/components/brand-mapping-tab.tsx",
                                                        lineNumber: 849,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/features/settings/pkgx/components/brand-mapping-tab.tsx",
                                                lineNumber: 833,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/features/settings/pkgx/components/brand-mapping-tab.tsx",
                                        lineNumber: 829,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "space-y-3",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                                className: "font-medium text-sm text-muted-foreground uppercase tracking-wide",
                                                children: "Trạng thái mapping"
                                            }, void 0, false, {
                                                fileName: "[project]/features/settings/pkgx/components/brand-mapping-tab.tsx",
                                                lineNumber: 865,
                                                columnNumber: 19
                                            }, this),
                                            findMapping(selectedBrandForDetail.brand_id) ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "bg-green-500/10 border border-green-500/20 rounded-md p-3",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$badge$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Badge"], {
                                                        variant: "default",
                                                        className: "bg-green-500 mb-2",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle2$3e$__["CheckCircle2"], {
                                                                className: "h-3 w-3 mr-1"
                                                            }, void 0, false, {
                                                                fileName: "[project]/features/settings/pkgx/components/brand-mapping-tab.tsx",
                                                                lineNumber: 871,
                                                                columnNumber: 25
                                                            }, this),
                                                            "Đã mapping"
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/features/settings/pkgx/components/brand-mapping-tab.tsx",
                                                        lineNumber: 870,
                                                        columnNumber: 23
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "text-sm",
                                                        children: [
                                                            "HRM: ",
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "font-medium",
                                                                children: findMapping(selectedBrandForDetail.brand_id)?.hrmBrandName
                                                            }, void 0, false, {
                                                                fileName: "[project]/features/settings/pkgx/components/brand-mapping-tab.tsx",
                                                                lineNumber: 875,
                                                                columnNumber: 30
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/features/settings/pkgx/components/brand-mapping-tab.tsx",
                                                        lineNumber: 874,
                                                        columnNumber: 23
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/features/settings/pkgx/components/brand-mapping-tab.tsx",
                                                lineNumber: 869,
                                                columnNumber: 21
                                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "bg-muted/50 rounded-md p-3",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$badge$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Badge"], {
                                                        variant: "secondary",
                                                        children: "Chưa mapping"
                                                    }, void 0, false, {
                                                        fileName: "[project]/features/settings/pkgx/components/brand-mapping-tab.tsx",
                                                        lineNumber: 880,
                                                        columnNumber: 23
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "text-sm text-muted-foreground mt-2",
                                                        children: "Thương hiệu này chưa được liên kết với HRM"
                                                    }, void 0, false, {
                                                        fileName: "[project]/features/settings/pkgx/components/brand-mapping-tab.tsx",
                                                        lineNumber: 881,
                                                        columnNumber: 23
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/features/settings/pkgx/components/brand-mapping-tab.tsx",
                                                lineNumber: 879,
                                                columnNumber: 21
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/features/settings/pkgx/components/brand-mapping-tab.tsx",
                                        lineNumber: 864,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/features/settings/pkgx/components/brand-mapping-tab.tsx",
                                lineNumber: 800,
                                columnNumber: 15
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/features/settings/pkgx/components/brand-mapping-tab.tsx",
                            lineNumber: 799,
                            columnNumber: 13
                        }, this) : null,
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$dialog$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["DialogFooter"], {
                            className: "gap-2",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Button"], {
                                    variant: "outline",
                                    onClick: ()=>window.open(`https://phukiengiaxuong.com.vn/admin/brand.php?act=edit&brand_id=${selectedBrandForDetail?.brand_id}`, '_blank'),
                                    disabled: !selectedBrandForDetail,
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$external$2d$link$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__ExternalLink$3e$__["ExternalLink"], {
                                            className: "h-4 w-4 mr-2"
                                        }, void 0, false, {
                                            fileName: "[project]/features/settings/pkgx/components/brand-mapping-tab.tsx",
                                            lineNumber: 897,
                                            columnNumber: 15
                                        }, this),
                                        "Xem trên PKGX"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/features/settings/pkgx/components/brand-mapping-tab.tsx",
                                    lineNumber: 892,
                                    columnNumber: 13
                                }, this),
                                selectedBrandForDetail && findMapping(selectedBrandForDetail.brand_id) && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Button"], {
                                    onClick: ()=>handlePushBrand(selectedBrandForDetail.brand_id),
                                    disabled: isPushing,
                                    children: [
                                        isPushing ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__["Loader2"], {
                                            className: "h-4 w-4 mr-2 animate-spin"
                                        }, void 0, false, {
                                            fileName: "[project]/features/settings/pkgx/components/brand-mapping-tab.tsx",
                                            lineNumber: 906,
                                            columnNumber: 19
                                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$upload$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__Upload$3e$__["Upload"], {
                                            className: "h-4 w-4 mr-2"
                                        }, void 0, false, {
                                            fileName: "[project]/features/settings/pkgx/components/brand-mapping-tab.tsx",
                                            lineNumber: 908,
                                            columnNumber: 19
                                        }, this),
                                        "Đẩy HRM → PKGX"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/features/settings/pkgx/components/brand-mapping-tab.tsx",
                                    lineNumber: 901,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/features/settings/pkgx/components/brand-mapping-tab.tsx",
                            lineNumber: 891,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/features/settings/pkgx/components/brand-mapping-tab.tsx",
                    lineNumber: 783,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/features/settings/pkgx/components/brand-mapping-tab.tsx",
                lineNumber: 782,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$pkgx$2f$components$2f$pkgx$2d$sync$2d$confirm$2d$dialog$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["PkgxSyncConfirmDialog"], {
                confirmAction: entitySync.confirmAction,
                isSyncing: entitySync.isSyncing,
                onConfirm: entitySync.executeAction,
                onCancel: entitySync.cancelConfirm
            }, void 0, false, {
                fileName: "[project]/features/settings/pkgx/components/brand-mapping-tab.tsx",
                lineNumber: 918,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/features/settings/pkgx/components/brand-mapping-tab.tsx",
        lineNumber: 645,
        columnNumber: 5
    }, this);
}
}),
"[project]/features/settings/pricing/store.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "usePricingPolicyStore",
    ()=>usePricingPolicyStore
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2d$factory$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/store-factory.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$contexts$2f$auth$2d$context$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/contexts/auth-context.tsx [app-rsc] (ecmascript)");
;
;
const baseStore = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2d$factory$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createCrudStore"])([], 'pricing-settings', {
    businessIdField: 'id',
    getCurrentUser: __TURBOPACK__imported__module__$5b$project$5d2f$contexts$2f$auth$2d$context$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getCurrentUserSystemId"],
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
"[project]/features/settings/pkgx/components/price-mapping-tab.tsx [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "PriceMappingTab",
    ()=>PriceMappingTab
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-jsx-dev-runtime.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/card.tsx [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$label$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/label.tsx [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/select.tsx [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/button.tsx [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$save$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__Save$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/save.js [app-rsc] (ecmascript) <export default as Save>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/sonner/dist/index.mjs [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$pkgx$2f$store$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/settings/pkgx/store.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$pricing$2f$store$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/settings/pricing/store.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$pkgx$2f$constants$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/settings/pkgx/constants.ts [app-rsc] (ecmascript)");
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
function PriceMappingTab() {
    const { settings, updatePriceMapping, addLog } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$pkgx$2f$store$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["usePkgxSettingsStore"])();
    const pricingPolicies = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$pricing$2f$store$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["usePricingPolicyStore"])((state)=>state.data);
    // Filter only selling price policies
    const sellingPolicies = pricingPolicies.filter((p)=>p.type === 'Bán hàng' && p.isActive);
    const handleChange = (field, value)=>{
        updatePriceMapping(field, value === 'none' ? null : value);
    };
    const handleSave = ()=>{
        // Log the mapping save
        const mappingSummary = __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$pkgx$2f$constants$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["PKGX_PRICE_FIELDS"].filter((pf)=>settings.priceMapping[pf.key]).map((pf)=>{
            const policyId = settings.priceMapping[pf.key];
            const policy = pricingPolicies.find((p)=>p.systemId === policyId);
            return `${pf.field} → ${policy?.name || policyId}`;
        }).join(', ');
        addLog({
            action: 'save_mapping',
            status: 'success',
            message: 'Đã lưu mapping bảng giá',
            details: {
                total: __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$pkgx$2f$constants$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["PKGX_PRICE_FIELDS"].filter((pf)=>settings.priceMapping[pf.key]).length
            }
        });
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["toast"].success('Đã lưu mapping bảng giá');
    };
    const getPolicyName = (policyId)=>{
        if (!policyId) return '-- Không áp dụng --';
        const policy = pricingPolicies.find((p)=>p.systemId === policyId);
        return policy?.name || policyId;
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Card"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["CardHeader"], {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["CardTitle"], {
                        className: "text-lg",
                        children: "Mapping Bảng giá HRM → PKGX"
                    }, void 0, false, {
                        fileName: "[project]/features/settings/pkgx/components/price-mapping-tab.tsx",
                        lineNumber: 56,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["CardDescription"], {
                        children: "Chọn bảng giá trong HRM tương ứng với mỗi loại giá trên PKGX"
                    }, void 0, false, {
                        fileName: "[project]/features/settings/pkgx/components/price-mapping-tab.tsx",
                        lineNumber: 57,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/features/settings/pkgx/components/price-mapping-tab.tsx",
                lineNumber: 55,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["CardContent"], {
                className: "space-y-6",
                children: [
                    __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$pkgx$2f$constants$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["PKGX_PRICE_FIELDS"].map((priceField)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "grid grid-cols-1 md:grid-cols-2 gap-4 items-start",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$label$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Label"], {
                                            className: "text-base font-medium",
                                            children: priceField.label
                                        }, void 0, false, {
                                            fileName: "[project]/features/settings/pkgx/components/price-mapping-tab.tsx",
                                            lineNumber: 65,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-sm text-muted-foreground",
                                            children: priceField.description
                                        }, void 0, false, {
                                            fileName: "[project]/features/settings/pkgx/components/price-mapping-tab.tsx",
                                            lineNumber: 66,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/features/settings/pkgx/components/price-mapping-tab.tsx",
                                    lineNumber: 64,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Select"], {
                                    value: settings.priceMapping[priceField.key] || 'none',
                                    onValueChange: (value)=>handleChange(priceField.key, value),
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["SelectTrigger"], {
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["SelectValue"], {
                                                placeholder: "Chọn bảng giá..."
                                            }, void 0, false, {
                                                fileName: "[project]/features/settings/pkgx/components/price-mapping-tab.tsx",
                                                lineNumber: 73,
                                                columnNumber: 17
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/features/settings/pkgx/components/price-mapping-tab.tsx",
                                            lineNumber: 72,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["SelectContent"], {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["SelectItem"], {
                                                    value: "none",
                                                    children: "-- Không áp dụng --"
                                                }, void 0, false, {
                                                    fileName: "[project]/features/settings/pkgx/components/price-mapping-tab.tsx",
                                                    lineNumber: 76,
                                                    columnNumber: 17
                                                }, this),
                                                sellingPolicies.map((policy)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["SelectItem"], {
                                                        value: policy.systemId,
                                                        children: policy.name
                                                    }, policy.systemId, false, {
                                                        fileName: "[project]/features/settings/pkgx/components/price-mapping-tab.tsx",
                                                        lineNumber: 78,
                                                        columnNumber: 19
                                                    }, this))
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/features/settings/pkgx/components/price-mapping-tab.tsx",
                                            lineNumber: 75,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/features/settings/pkgx/components/price-mapping-tab.tsx",
                                    lineNumber: 68,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, priceField.key, true, {
                            fileName: "[project]/features/settings/pkgx/components/price-mapping-tab.tsx",
                            lineNumber: 63,
                            columnNumber: 11
                        }, this)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "pt-4 border-t",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                className: "font-medium mb-2",
                                children: "Tóm tắt mapping hiện tại:"
                            }, void 0, false, {
                                fileName: "[project]/features/settings/pkgx/components/price-mapping-tab.tsx",
                                lineNumber: 88,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "bg-muted p-4 rounded-lg text-sm space-y-1",
                                children: __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$pkgx$2f$constants$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["PKGX_PRICE_FIELDS"].map((priceField)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex justify-between",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "text-muted-foreground",
                                                children: [
                                                    priceField.field,
                                                    ":"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/features/settings/pkgx/components/price-mapping-tab.tsx",
                                                lineNumber: 92,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "font-medium",
                                                children: getPolicyName(settings.priceMapping[priceField.key])
                                            }, void 0, false, {
                                                fileName: "[project]/features/settings/pkgx/components/price-mapping-tab.tsx",
                                                lineNumber: 93,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, priceField.key, true, {
                                        fileName: "[project]/features/settings/pkgx/components/price-mapping-tab.tsx",
                                        lineNumber: 91,
                                        columnNumber: 15
                                    }, this))
                            }, void 0, false, {
                                fileName: "[project]/features/settings/pkgx/components/price-mapping-tab.tsx",
                                lineNumber: 89,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/features/settings/pkgx/components/price-mapping-tab.tsx",
                        lineNumber: 87,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex justify-end pt-4",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Button"], {
                            onClick: handleSave,
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$save$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__Save$3e$__["Save"], {
                                    className: "h-4 w-4 mr-2"
                                }, void 0, false, {
                                    fileName: "[project]/features/settings/pkgx/components/price-mapping-tab.tsx",
                                    lineNumber: 103,
                                    columnNumber: 13
                                }, this),
                                "Lưu mapping"
                            ]
                        }, void 0, true, {
                            fileName: "[project]/features/settings/pkgx/components/price-mapping-tab.tsx",
                            lineNumber: 102,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/features/settings/pkgx/components/price-mapping-tab.tsx",
                        lineNumber: 101,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/features/settings/pkgx/components/price-mapping-tab.tsx",
                lineNumber: 61,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/features/settings/pkgx/components/price-mapping-tab.tsx",
        lineNumber: 54,
        columnNumber: 5
    }, this);
}
}),
"[project]/features/settings/pkgx/components/product-mapping-tab.tsx [app-rsc] (client reference proxy) <module evaluation>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ProductMappingTab",
    ()=>ProductMappingTab
]);
// This file is generated by next-core EcmascriptClientReferenceModule.
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-server-dom-turbopack-server.js [app-rsc] (ecmascript)");
;
const ProductMappingTab = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerClientReference"])(function() {
    throw new Error("Attempted to call ProductMappingTab() from the server but ProductMappingTab is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.");
}, "[project]/features/settings/pkgx/components/product-mapping-tab.tsx <module evaluation>", "ProductMappingTab");
}),
"[project]/features/settings/pkgx/components/product-mapping-tab.tsx [app-rsc] (client reference proxy)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ProductMappingTab",
    ()=>ProductMappingTab
]);
// This file is generated by next-core EcmascriptClientReferenceModule.
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-server-dom-turbopack-server.js [app-rsc] (ecmascript)");
;
const ProductMappingTab = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerClientReference"])(function() {
    throw new Error("Attempted to call ProductMappingTab() from the server but ProductMappingTab is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.");
}, "[project]/features/settings/pkgx/components/product-mapping-tab.tsx", "ProductMappingTab");
}),
"[project]/features/settings/pkgx/components/product-mapping-tab.tsx [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$pkgx$2f$components$2f$product$2d$mapping$2d$tab$2e$tsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__$3c$module__evaluation$3e$__ = __turbopack_context__.i("[project]/features/settings/pkgx/components/product-mapping-tab.tsx [app-rsc] (client reference proxy) <module evaluation>");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$pkgx$2f$components$2f$product$2d$mapping$2d$tab$2e$tsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__ = __turbopack_context__.i("[project]/features/settings/pkgx/components/product-mapping-tab.tsx [app-rsc] (client reference proxy)");
;
__turbopack_context__.n(__TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$pkgx$2f$components$2f$product$2d$mapping$2d$tab$2e$tsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__);
}),
"[project]/features/settings/pkgx/components/sync-settings-tab.tsx [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "SyncSettingsTab",
    ()=>SyncSettingsTab
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-jsx-dev-runtime.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/card.tsx [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/button.tsx [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$switch$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/switch.tsx [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$label$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/label.tsx [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$badge$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/badge.tsx [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/select.tsx [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$play$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__Play$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/play.js [app-rsc] (ecmascript) <export default as Play>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$pause$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__Pause$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/pause.js [app-rsc] (ecmascript) <export default as Pause>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$text$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__FileText$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/file-text.js [app-rsc] (ecmascript) <export default as FileText>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle2$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/circle-check.js [app-rsc] (ecmascript) <export default as CheckCircle2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$alert$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertCircle$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/circle-alert.js [app-rsc] (ecmascript) <export default as AlertCircle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/loader-circle.js [app-rsc] (ecmascript) <export default as Loader2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/sonner/dist/index.mjs [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$pkgx$2f$store$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/settings/pkgx/store.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$pkgx$2f$types$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/settings/pkgx/types.ts [app-rsc] (ecmascript)");
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
function SyncSettingsTab() {
    const { settings, updateSyncSetting, setLastSyncAt, setLastSyncResult, addLog } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$pkgx$2f$store$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["usePkgxSettingsStore"])();
    const { syncSettings, lastSyncAt, lastSyncResult, apiKey, apiUrl } = settings;
    const [isSyncing, setIsSyncing] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["useState"](false);
    const handleManualSync = async ()=>{
        if (!apiUrl || !apiKey) {
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["toast"].error('Vui lòng cấu hình API URL và API Key trước!');
            return;
        }
        setIsSyncing(true);
        const startTime = Date.now();
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["toast"].info('Đang đồng bộ dữ liệu...');
        try {
            // TODO: Implement actual sync logic with real API
            await new Promise((resolve)=>setTimeout(resolve, 2000));
            const responseTime = Date.now() - startTime;
            const result = {
                status: 'success',
                total: 150,
                success: 150,
                failed: 0
            };
            setLastSyncAt(new Date().toISOString());
            setLastSyncResult(result);
            addLog({
                action: 'sync_all',
                status: 'success',
                message: 'Đồng bộ tất cả dữ liệu thành công',
                details: {
                    total: result.total,
                    success: result.success,
                    failed: result.failed,
                    responseTime,
                    url: apiUrl,
                    method: 'POST'
                }
            });
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["toast"].success('Đồng bộ thành công!');
        } catch (error) {
            const responseTime = Date.now() - startTime;
            const errorMessage = error instanceof Error ? error.message : 'Lỗi không xác định';
            setLastSyncResult({
                status: 'error',
                total: 0,
                success: 0,
                failed: 0
            });
            addLog({
                action: 'sync_all',
                status: 'error',
                message: 'Lỗi đồng bộ dữ liệu',
                details: {
                    error: errorMessage,
                    responseTime,
                    url: apiUrl,
                    method: 'POST'
                }
            });
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["toast"].error('Lỗi đồng bộ: ' + errorMessage);
        } finally{
            setIsSyncing(false);
        }
    };
    const handleToggleAutoSync = (checked)=>{
        updateSyncSetting('autoSyncEnabled', checked);
        addLog({
            action: 'save_config',
            status: 'info',
            message: checked ? 'Đã bật Auto Sync' : 'Đã tắt Auto Sync',
            details: {}
        });
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["toast"].success(checked ? 'Đã bật Auto Sync' : 'Đã tắt Auto Sync');
    };
    const handleToggleSyncInventory = (checked)=>{
        updateSyncSetting('syncInventory', checked);
        addLog({
            action: 'save_config',
            status: 'info',
            message: checked ? 'Đã bật đồng bộ tồn kho' : 'Đã tắt đồng bộ tồn kho',
            details: {}
        });
    };
    const handleToggleSyncPrice = (checked)=>{
        updateSyncSetting('syncPrice', checked);
        addLog({
            action: 'save_config',
            status: 'info',
            message: checked ? 'Đã bật đồng bộ giá' : 'Đã tắt đồng bộ giá',
            details: {}
        });
    };
    const handleToggleSyncSeo = (checked)=>{
        updateSyncSetting('syncSeo', checked);
        addLog({
            action: 'save_config',
            status: 'info',
            message: checked ? 'Đã bật đồng bộ SEO' : 'Đã tắt đồng bộ SEO',
            details: {}
        });
    };
    const handleToggleSyncOnUpdate = (checked)=>{
        updateSyncSetting('syncOnProductUpdate', checked);
        addLog({
            action: 'save_config',
            status: 'info',
            message: checked ? 'Đã bật đồng bộ khi cập nhật SP' : 'Đã tắt đồng bộ khi cập nhật SP',
            details: {}
        });
    };
    const handleToggleNotify = (checked)=>{
        updateSyncSetting('notifyOnError', checked);
        addLog({
            action: 'save_config',
            status: 'info',
            message: checked ? 'Đã bật thông báo lỗi' : 'Đã tắt thông báo lỗi',
            details: {}
        });
    };
    const getNextSyncTime = ()=>{
        if (!lastSyncAt || !syncSettings.autoSyncEnabled) return null;
        const lastSync = new Date(lastSyncAt);
        const nextSync = new Date(lastSync.getTime() + syncSettings.intervalMinutes * 60 * 1000);
        return nextSync;
    };
    const nextSync = getNextSyncTime();
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "space-y-6",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Card"], {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["CardHeader"], {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["CardTitle"], {
                                className: "text-lg",
                                children: "Lịch đồng bộ tự động"
                            }, void 0, false, {
                                fileName: "[project]/features/settings/pkgx/components/sync-settings-tab.tsx",
                                lineNumber: 152,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["CardDescription"], {
                                children: "Cài đặt thời gian và tần suất đồng bộ"
                            }, void 0, false, {
                                fileName: "[project]/features/settings/pkgx/components/sync-settings-tab.tsx",
                                lineNumber: 153,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/features/settings/pkgx/components/sync-settings-tab.tsx",
                        lineNumber: 151,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["CardContent"], {
                        className: "space-y-4",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center justify-between",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$label$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Label"], {
                                                className: "text-base",
                                                children: "Bật Auto Sync"
                                            }, void 0, false, {
                                                fileName: "[project]/features/settings/pkgx/components/sync-settings-tab.tsx",
                                                lineNumber: 158,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-sm text-muted-foreground",
                                                children: "Tự động đồng bộ dữ liệu theo lịch"
                                            }, void 0, false, {
                                                fileName: "[project]/features/settings/pkgx/components/sync-settings-tab.tsx",
                                                lineNumber: 159,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/features/settings/pkgx/components/sync-settings-tab.tsx",
                                        lineNumber: 157,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$switch$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Switch"], {
                                        checked: syncSettings.autoSyncEnabled,
                                        onCheckedChange: handleToggleAutoSync
                                    }, void 0, false, {
                                        fileName: "[project]/features/settings/pkgx/components/sync-settings-tab.tsx",
                                        lineNumber: 161,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/features/settings/pkgx/components/sync-settings-tab.tsx",
                                lineNumber: 156,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center justify-between",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$label$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Label"], {
                                        children: "Tần suất đồng bộ"
                                    }, void 0, false, {
                                        fileName: "[project]/features/settings/pkgx/components/sync-settings-tab.tsx",
                                        lineNumber: 168,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Select"], {
                                        value: syncSettings.intervalMinutes.toString(),
                                        onValueChange: (value)=>updateSyncSetting('intervalMinutes', parseInt(value, 10)),
                                        disabled: !syncSettings.autoSyncEnabled,
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["SelectTrigger"], {
                                                className: "w-[180px]",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["SelectValue"], {}, void 0, false, {
                                                    fileName: "[project]/features/settings/pkgx/components/sync-settings-tab.tsx",
                                                    lineNumber: 175,
                                                    columnNumber: 17
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/features/settings/pkgx/components/sync-settings-tab.tsx",
                                                lineNumber: 174,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["SelectContent"], {
                                                children: __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$pkgx$2f$types$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["SYNC_INTERVAL_OPTIONS"].map((option)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["SelectItem"], {
                                                        value: option.value.toString(),
                                                        children: option.label
                                                    }, option.value, false, {
                                                        fileName: "[project]/features/settings/pkgx/components/sync-settings-tab.tsx",
                                                        lineNumber: 179,
                                                        columnNumber: 19
                                                    }, this))
                                            }, void 0, false, {
                                                fileName: "[project]/features/settings/pkgx/components/sync-settings-tab.tsx",
                                                lineNumber: 177,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/features/settings/pkgx/components/sync-settings-tab.tsx",
                                        lineNumber: 169,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/features/settings/pkgx/components/sync-settings-tab.tsx",
                                lineNumber: 167,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/features/settings/pkgx/components/sync-settings-tab.tsx",
                        lineNumber: 155,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/features/settings/pkgx/components/sync-settings-tab.tsx",
                lineNumber: 150,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Card"], {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["CardHeader"], {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["CardTitle"], {
                                className: "text-lg",
                                children: "Loại dữ liệu đồng bộ"
                            }, void 0, false, {
                                fileName: "[project]/features/settings/pkgx/components/sync-settings-tab.tsx",
                                lineNumber: 192,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["CardDescription"], {
                                children: "Chọn những thông tin cần đồng bộ lên PKGX"
                            }, void 0, false, {
                                fileName: "[project]/features/settings/pkgx/components/sync-settings-tab.tsx",
                                lineNumber: 193,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/features/settings/pkgx/components/sync-settings-tab.tsx",
                        lineNumber: 191,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["CardContent"], {
                        className: "space-y-4",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center justify-between",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$label$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Label"], {
                                                className: "text-base",
                                                children: "Đồng bộ tồn kho"
                                            }, void 0, false, {
                                                fileName: "[project]/features/settings/pkgx/components/sync-settings-tab.tsx",
                                                lineNumber: 198,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-sm text-muted-foreground",
                                                children: "Tổng tồn kho tất cả chi nhánh"
                                            }, void 0, false, {
                                                fileName: "[project]/features/settings/pkgx/components/sync-settings-tab.tsx",
                                                lineNumber: 199,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/features/settings/pkgx/components/sync-settings-tab.tsx",
                                        lineNumber: 197,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$switch$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Switch"], {
                                        checked: syncSettings.syncInventory,
                                        onCheckedChange: handleToggleSyncInventory
                                    }, void 0, false, {
                                        fileName: "[project]/features/settings/pkgx/components/sync-settings-tab.tsx",
                                        lineNumber: 201,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/features/settings/pkgx/components/sync-settings-tab.tsx",
                                lineNumber: 196,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center justify-between",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$label$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Label"], {
                                                className: "text-base",
                                                children: "Đồng bộ giá"
                                            }, void 0, false, {
                                                fileName: "[project]/features/settings/pkgx/components/sync-settings-tab.tsx",
                                                lineNumber: 209,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-sm text-muted-foreground",
                                                children: "Theo mapping bảng giá đã cấu hình"
                                            }, void 0, false, {
                                                fileName: "[project]/features/settings/pkgx/components/sync-settings-tab.tsx",
                                                lineNumber: 210,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/features/settings/pkgx/components/sync-settings-tab.tsx",
                                        lineNumber: 208,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$switch$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Switch"], {
                                        checked: syncSettings.syncPrice,
                                        onCheckedChange: handleToggleSyncPrice
                                    }, void 0, false, {
                                        fileName: "[project]/features/settings/pkgx/components/sync-settings-tab.tsx",
                                        lineNumber: 212,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/features/settings/pkgx/components/sync-settings-tab.tsx",
                                lineNumber: 207,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center justify-between",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$label$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Label"], {
                                                className: "text-base",
                                                children: "Đồng bộ SEO"
                                            }, void 0, false, {
                                                fileName: "[project]/features/settings/pkgx/components/sync-settings-tab.tsx",
                                                lineNumber: 220,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-sm text-muted-foreground",
                                                children: "meta_title, meta_desc, keywords"
                                            }, void 0, false, {
                                                fileName: "[project]/features/settings/pkgx/components/sync-settings-tab.tsx",
                                                lineNumber: 221,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/features/settings/pkgx/components/sync-settings-tab.tsx",
                                        lineNumber: 219,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$switch$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Switch"], {
                                        checked: syncSettings.syncSeo,
                                        onCheckedChange: handleToggleSyncSeo
                                    }, void 0, false, {
                                        fileName: "[project]/features/settings/pkgx/components/sync-settings-tab.tsx",
                                        lineNumber: 223,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/features/settings/pkgx/components/sync-settings-tab.tsx",
                                lineNumber: 218,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center justify-between",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$label$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Label"], {
                                                className: "text-base",
                                                children: "Sync ngay khi cập nhật sản phẩm"
                                            }, void 0, false, {
                                                fileName: "[project]/features/settings/pkgx/components/sync-settings-tab.tsx",
                                                lineNumber: 231,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-sm text-muted-foreground",
                                                children: "Đồng bộ real-time khi sửa SP trong HRM"
                                            }, void 0, false, {
                                                fileName: "[project]/features/settings/pkgx/components/sync-settings-tab.tsx",
                                                lineNumber: 232,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/features/settings/pkgx/components/sync-settings-tab.tsx",
                                        lineNumber: 230,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$switch$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Switch"], {
                                        checked: syncSettings.syncOnProductUpdate,
                                        onCheckedChange: handleToggleSyncOnUpdate
                                    }, void 0, false, {
                                        fileName: "[project]/features/settings/pkgx/components/sync-settings-tab.tsx",
                                        lineNumber: 234,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/features/settings/pkgx/components/sync-settings-tab.tsx",
                                lineNumber: 229,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/features/settings/pkgx/components/sync-settings-tab.tsx",
                        lineNumber: 195,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/features/settings/pkgx/components/sync-settings-tab.tsx",
                lineNumber: 190,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Card"], {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["CardHeader"], {
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["CardTitle"], {
                            className: "text-lg",
                            children: "Thông báo"
                        }, void 0, false, {
                            fileName: "[project]/features/settings/pkgx/components/sync-settings-tab.tsx",
                            lineNumber: 245,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/features/settings/pkgx/components/sync-settings-tab.tsx",
                        lineNumber: 244,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["CardContent"], {
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex items-center justify-between",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$label$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Label"], {
                                            className: "text-base",
                                            children: "Thông báo khi có lỗi sync"
                                        }, void 0, false, {
                                            fileName: "[project]/features/settings/pkgx/components/sync-settings-tab.tsx",
                                            lineNumber: 250,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-sm text-muted-foreground",
                                            children: "Nhận thông báo khi đồng bộ thất bại"
                                        }, void 0, false, {
                                            fileName: "[project]/features/settings/pkgx/components/sync-settings-tab.tsx",
                                            lineNumber: 251,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/features/settings/pkgx/components/sync-settings-tab.tsx",
                                    lineNumber: 249,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$switch$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Switch"], {
                                    checked: syncSettings.notifyOnError,
                                    onCheckedChange: handleToggleNotify
                                }, void 0, false, {
                                    fileName: "[project]/features/settings/pkgx/components/sync-settings-tab.tsx",
                                    lineNumber: 253,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/features/settings/pkgx/components/sync-settings-tab.tsx",
                            lineNumber: 248,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/features/settings/pkgx/components/sync-settings-tab.tsx",
                        lineNumber: 247,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/features/settings/pkgx/components/sync-settings-tab.tsx",
                lineNumber: 243,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Card"], {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["CardHeader"], {
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["CardTitle"], {
                            className: "text-lg",
                            children: "Trạng thái đồng bộ"
                        }, void 0, false, {
                            fileName: "[project]/features/settings/pkgx/components/sync-settings-tab.tsx",
                            lineNumber: 264,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/features/settings/pkgx/components/sync-settings-tab.tsx",
                        lineNumber: 263,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["CardContent"], {
                        className: "space-y-4",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "grid grid-cols-1 md:grid-cols-3 gap-4",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "p-4 bg-muted rounded-lg",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-sm text-muted-foreground",
                                                children: "Lần sync cuối"
                                            }, void 0, false, {
                                                fileName: "[project]/features/settings/pkgx/components/sync-settings-tab.tsx",
                                                lineNumber: 269,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "font-medium",
                                                children: lastSyncAt ? new Date(lastSyncAt).toLocaleString('vi-VN') : 'Chưa có'
                                            }, void 0, false, {
                                                fileName: "[project]/features/settings/pkgx/components/sync-settings-tab.tsx",
                                                lineNumber: 270,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/features/settings/pkgx/components/sync-settings-tab.tsx",
                                        lineNumber: 268,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "p-4 bg-muted rounded-lg",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-sm text-muted-foreground",
                                                children: "Kết quả"
                                            }, void 0, false, {
                                                fileName: "[project]/features/settings/pkgx/components/sync-settings-tab.tsx",
                                                lineNumber: 275,
                                                columnNumber: 15
                                            }, this),
                                            lastSyncResult ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex items-center gap-2",
                                                children: [
                                                    lastSyncResult.status === 'success' ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$badge$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Badge"], {
                                                        className: "bg-green-500",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle2$3e$__["CheckCircle2"], {
                                                                className: "h-3 w-3 mr-1"
                                                            }, void 0, false, {
                                                                fileName: "[project]/features/settings/pkgx/components/sync-settings-tab.tsx",
                                                                lineNumber: 279,
                                                                columnNumber: 53
                                                            }, this),
                                                            "Thành công"
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/features/settings/pkgx/components/sync-settings-tab.tsx",
                                                        lineNumber: 279,
                                                        columnNumber: 21
                                                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$badge$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Badge"], {
                                                        variant: "destructive",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$alert$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertCircle$3e$__["AlertCircle"], {
                                                                className: "h-3 w-3 mr-1"
                                                            }, void 0, false, {
                                                                fileName: "[project]/features/settings/pkgx/components/sync-settings-tab.tsx",
                                                                lineNumber: 281,
                                                                columnNumber: 50
                                                            }, this),
                                                            "Có lỗi"
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/features/settings/pkgx/components/sync-settings-tab.tsx",
                                                        lineNumber: 281,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "text-sm",
                                                        children: [
                                                            lastSyncResult.success,
                                                            "/",
                                                            lastSyncResult.total
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/features/settings/pkgx/components/sync-settings-tab.tsx",
                                                        lineNumber: 283,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/features/settings/pkgx/components/sync-settings-tab.tsx",
                                                lineNumber: 277,
                                                columnNumber: 17
                                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "font-medium",
                                                children: "--"
                                            }, void 0, false, {
                                                fileName: "[project]/features/settings/pkgx/components/sync-settings-tab.tsx",
                                                lineNumber: 286,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/features/settings/pkgx/components/sync-settings-tab.tsx",
                                        lineNumber: 274,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "p-4 bg-muted rounded-lg",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-sm text-muted-foreground",
                                                children: "Lần sync tiếp theo"
                                            }, void 0, false, {
                                                fileName: "[project]/features/settings/pkgx/components/sync-settings-tab.tsx",
                                                lineNumber: 290,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "font-medium",
                                                children: nextSync ? nextSync.toLocaleString('vi-VN') : 'Không có'
                                            }, void 0, false, {
                                                fileName: "[project]/features/settings/pkgx/components/sync-settings-tab.tsx",
                                                lineNumber: 291,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/features/settings/pkgx/components/sync-settings-tab.tsx",
                                        lineNumber: 289,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/features/settings/pkgx/components/sync-settings-tab.tsx",
                                lineNumber: 267,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex gap-2 pt-4",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Button"], {
                                        onClick: handleManualSync,
                                        disabled: isSyncing,
                                        children: [
                                            isSyncing ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__["Loader2"], {
                                                className: "h-4 w-4 mr-2 animate-spin"
                                            }, void 0, false, {
                                                fileName: "[project]/features/settings/pkgx/components/sync-settings-tab.tsx",
                                                lineNumber: 300,
                                                columnNumber: 17
                                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$play$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__Play$3e$__["Play"], {
                                                className: "h-4 w-4 mr-2"
                                            }, void 0, false, {
                                                fileName: "[project]/features/settings/pkgx/components/sync-settings-tab.tsx",
                                                lineNumber: 302,
                                                columnNumber: 17
                                            }, this),
                                            isSyncing ? 'Đang sync...' : 'Sync ngay'
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/features/settings/pkgx/components/sync-settings-tab.tsx",
                                        lineNumber: 298,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Button"], {
                                        variant: "outline",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$text$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__FileText$3e$__["FileText"], {
                                                className: "h-4 w-4 mr-2"
                                            }, void 0, false, {
                                                fileName: "[project]/features/settings/pkgx/components/sync-settings-tab.tsx",
                                                lineNumber: 307,
                                                columnNumber: 15
                                            }, this),
                                            "Xem log"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/features/settings/pkgx/components/sync-settings-tab.tsx",
                                        lineNumber: 306,
                                        columnNumber: 13
                                    }, this),
                                    syncSettings.autoSyncEnabled && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Button"], {
                                        variant: "outline",
                                        onClick: ()=>handleToggleAutoSync(false),
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$pause$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__Pause$3e$__["Pause"], {
                                                className: "h-4 w-4 mr-2"
                                            }, void 0, false, {
                                                fileName: "[project]/features/settings/pkgx/components/sync-settings-tab.tsx",
                                                lineNumber: 312,
                                                columnNumber: 17
                                            }, this),
                                            "Tạm dừng"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/features/settings/pkgx/components/sync-settings-tab.tsx",
                                        lineNumber: 311,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/features/settings/pkgx/components/sync-settings-tab.tsx",
                                lineNumber: 297,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/features/settings/pkgx/components/sync-settings-tab.tsx",
                        lineNumber: 266,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/features/settings/pkgx/components/sync-settings-tab.tsx",
                lineNumber: 262,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/features/settings/pkgx/components/sync-settings-tab.tsx",
        lineNumber: 148,
        columnNumber: 5
    }, this);
}
}),
"[project]/features/settings/pkgx/components/log-tab.tsx [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "LogTab",
    ()=>LogTab
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-jsx-dev-runtime.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/card.tsx [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$input$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/input.tsx [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$badge$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/badge.tsx [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/select.tsx [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$data$2d$table$2f$responsive$2d$data$2d$table$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/data-table/responsive-data-table.tsx [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$layout$2f$page$2d$filters$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/layout/page-filters.tsx [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$search$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__Search$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/search.js [app-rsc] (ecmascript) <export default as Search>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle2$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/circle-check.js [app-rsc] (ecmascript) <export default as CheckCircle2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$x$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__XCircle$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/circle-x.js [app-rsc] (ecmascript) <export default as XCircle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$alert$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertCircle$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/circle-alert.js [app-rsc] (ecmascript) <export default as AlertCircle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$refresh$2d$cw$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__RefreshCw$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/refresh-cw.js [app-rsc] (ecmascript) <export default as RefreshCw>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$globe$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__Globe$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/globe.js [app-rsc] (ecmascript) <export default as Globe>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$link$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__Link$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/link.js [app-rsc] (ecmascript) <export default as Link>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$unlink$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__Unlink$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/unlink.js [app-rsc] (ecmascript) <export default as Unlink>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$save$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__Save$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/save.js [app-rsc] (ecmascript) <export default as Save>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$settings$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__Settings$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/settings.js [app-rsc] (ecmascript) <export default as Settings>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$dollar$2d$sign$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__DollarSign$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/dollar-sign.js [app-rsc] (ecmascript) <export default as DollarSign>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$package$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__Package$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/package.js [app-rsc] (ecmascript) <export default as Package>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$text$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__FileText$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/file-text.js [app-rsc] (ecmascript) <export default as FileText>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$info$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__Info$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/info.js [app-rsc] (ecmascript) <export default as Info>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$user$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__User$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/user.js [app-rsc] (ecmascript) <export default as User>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$image$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__Image$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/image.js [app-rsc] (ecmascript) <export default as Image>");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$pkgx$2f$store$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/settings/pkgx/store.ts [app-rsc] (ecmascript)");
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
function LogTab() {
    const { settings } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$pkgx$2f$store$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["usePkgxSettingsStore"])();
    const [searchTerm, setSearchTerm] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["useState"]('');
    const [statusFilter, setStatusFilter] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["useState"]('all');
    const [actionFilter, setActionFilter] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["useState"]('all');
    // Pagination state
    const [pagination, setPagination] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["useState"]({
        pageIndex: 0,
        pageSize: 20
    });
    const [sorting, setSorting] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["useState"]({
        id: 'timestamp',
        desc: true
    });
    const [columnVisibility, setColumnVisibility] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["useState"]({});
    const [columnOrder, setColumnOrder] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["useState"]([]);
    const [pinnedColumns, setPinnedColumns] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["useState"]([]);
    // Convert logs to include systemId
    const allLogs = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["useMemo"](()=>{
        return settings.logs.map((log)=>({
                ...log,
                systemId: log.id
            }));
    }, [
        settings.logs
    ]);
    const filteredLogs = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["useMemo"](()=>{
        let logs = allLogs;
        // Filter by status
        if (statusFilter !== 'all') {
            logs = logs.filter((log)=>log.status === statusFilter);
        }
        // Filter by action
        if (actionFilter !== 'all') {
            logs = logs.filter((log)=>log.action === actionFilter);
        }
        // Filter by search term
        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            logs = logs.filter((log)=>log.message.toLowerCase().includes(term) || log.action.toLowerCase().includes(term) || log.userName && log.userName.toLowerCase().includes(term));
        }
        return logs;
    }, [
        allLogs,
        statusFilter,
        actionFilter,
        searchTerm
    ]);
    // Sorted data
    const sortedData = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["useMemo"](()=>{
        const sorted = [
            ...filteredLogs
        ];
        if (sorting.id) {
            sorted.sort((a, b)=>{
                const aVal = a[sorting.id];
                const bVal = b[sorting.id];
                if (aVal === bVal) return 0;
                if (aVal === null || aVal === undefined) return 1;
                if (bVal === null || bVal === undefined) return -1;
                const comparison = String(aVal).localeCompare(String(bVal));
                return sorting.desc ? -comparison : comparison;
            });
        }
        return sorted;
    }, [
        filteredLogs,
        sorting
    ]);
    // Paginated data
    const paginatedData = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["useMemo"](()=>{
        const start = pagination.pageIndex * pagination.pageSize;
        return sortedData.slice(start, start + pagination.pageSize);
    }, [
        sortedData,
        pagination
    ]);
    const pageCount = Math.ceil(sortedData.length / pagination.pageSize);
    const getStatusBadge = (status)=>{
        switch(status){
            case 'success':
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$badge$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Badge"], {
                    variant: "default",
                    className: "bg-green-500",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle2$3e$__["CheckCircle2"], {
                            className: "h-3 w-3 mr-1"
                        }, void 0, false, {
                            fileName: "[project]/features/settings/pkgx/components/log-tab.tsx",
                            lineNumber: 98,
                            columnNumber: 13
                        }, this),
                        "Thành công"
                    ]
                }, void 0, true, {
                    fileName: "[project]/features/settings/pkgx/components/log-tab.tsx",
                    lineNumber: 97,
                    columnNumber: 11
                }, this);
            case 'error':
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$badge$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Badge"], {
                    variant: "destructive",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$x$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__XCircle$3e$__["XCircle"], {
                            className: "h-3 w-3 mr-1"
                        }, void 0, false, {
                            fileName: "[project]/features/settings/pkgx/components/log-tab.tsx",
                            lineNumber: 105,
                            columnNumber: 13
                        }, this),
                        "Lỗi"
                    ]
                }, void 0, true, {
                    fileName: "[project]/features/settings/pkgx/components/log-tab.tsx",
                    lineNumber: 104,
                    columnNumber: 11
                }, this);
            case 'partial':
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$badge$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Badge"], {
                    variant: "default",
                    className: "bg-yellow-500",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$alert$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertCircle$3e$__["AlertCircle"], {
                            className: "h-3 w-3 mr-1"
                        }, void 0, false, {
                            fileName: "[project]/features/settings/pkgx/components/log-tab.tsx",
                            lineNumber: 112,
                            columnNumber: 13
                        }, this),
                        "Một phần"
                    ]
                }, void 0, true, {
                    fileName: "[project]/features/settings/pkgx/components/log-tab.tsx",
                    lineNumber: 111,
                    columnNumber: 11
                }, this);
            case 'info':
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$badge$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Badge"], {
                    variant: "secondary",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$info$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__Info$3e$__["Info"], {
                            className: "h-3 w-3 mr-1"
                        }, void 0, false, {
                            fileName: "[project]/features/settings/pkgx/components/log-tab.tsx",
                            lineNumber: 119,
                            columnNumber: 13
                        }, this),
                        "Thông tin"
                    ]
                }, void 0, true, {
                    fileName: "[project]/features/settings/pkgx/components/log-tab.tsx",
                    lineNumber: 118,
                    columnNumber: 11
                }, this);
        }
    };
    const getActionIcon = (action)=>{
        switch(action){
            case 'test_connection':
            case 'ping':
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$globe$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__Globe$3e$__["Globe"], {
                    className: "h-4 w-4 text-blue-500"
                }, void 0, false, {
                    fileName: "[project]/features/settings/pkgx/components/log-tab.tsx",
                    lineNumber: 130,
                    columnNumber: 16
                }, this);
            case 'sync_price':
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$dollar$2d$sign$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__DollarSign$3e$__["DollarSign"], {
                    className: "h-4 w-4 text-green-500"
                }, void 0, false, {
                    fileName: "[project]/features/settings/pkgx/components/log-tab.tsx",
                    lineNumber: 132,
                    columnNumber: 16
                }, this);
            case 'sync_inventory':
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$package$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__Package$3e$__["Package"], {
                    className: "h-4 w-4 text-orange-500"
                }, void 0, false, {
                    fileName: "[project]/features/settings/pkgx/components/log-tab.tsx",
                    lineNumber: 134,
                    columnNumber: 16
                }, this);
            case 'sync_seo':
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$text$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__FileText$3e$__["FileText"], {
                    className: "h-4 w-4 text-purple-500"
                }, void 0, false, {
                    fileName: "[project]/features/settings/pkgx/components/log-tab.tsx",
                    lineNumber: 136,
                    columnNumber: 16
                }, this);
            case 'sync_images':
            case 'bulk_sync_images':
            case 'upload_image':
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$image$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__Image$3e$__["Image"], {
                    className: "h-4 w-4 text-pink-500"
                }, void 0, false, {
                    fileName: "[project]/features/settings/pkgx/components/log-tab.tsx",
                    lineNumber: 140,
                    columnNumber: 16
                }, this);
            case 'create_product':
            case 'update_product':
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$refresh$2d$cw$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__RefreshCw$3e$__["RefreshCw"], {
                    className: "h-4 w-4 text-cyan-500"
                }, void 0, false, {
                    fileName: "[project]/features/settings/pkgx/components/log-tab.tsx",
                    lineNumber: 143,
                    columnNumber: 16
                }, this);
            case 'link_product':
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$link$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__Link$3e$__["Link"], {
                    className: "h-4 w-4 text-blue-500"
                }, void 0, false, {
                    fileName: "[project]/features/settings/pkgx/components/log-tab.tsx",
                    lineNumber: 145,
                    columnNumber: 16
                }, this);
            case 'unlink_product':
            case 'unlink_mapping':
            case 'batch_unlink':
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$unlink$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__Unlink$3e$__["Unlink"], {
                    className: "h-4 w-4 text-gray-500"
                }, void 0, false, {
                    fileName: "[project]/features/settings/pkgx/components/log-tab.tsx",
                    lineNumber: 149,
                    columnNumber: 16
                }, this);
            case 'save_config':
            case 'save_mapping':
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$save$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__Save$3e$__["Save"], {
                    className: "h-4 w-4 text-emerald-500"
                }, void 0, false, {
                    fileName: "[project]/features/settings/pkgx/components/log-tab.tsx",
                    lineNumber: 152,
                    columnNumber: 16
                }, this);
            case 'sync_categories':
            case 'sync_brands':
            case 'get_products':
            case 'sync_all':
            case 'bulk_sync_all':
            case 'bulk_sync_basic':
            case 'bulk_sync_price':
            case 'bulk_sync_inventory':
            case 'bulk_sync_seo':
            case 'bulk_sync_description':
            case 'bulk_sync_flags':
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$refresh$2d$cw$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__RefreshCw$3e$__["RefreshCw"], {
                    className: "h-4 w-4 text-indigo-500"
                }, void 0, false, {
                    fileName: "[project]/features/settings/pkgx/components/log-tab.tsx",
                    lineNumber: 164,
                    columnNumber: 16
                }, this);
            default:
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$settings$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__Settings$3e$__["Settings"], {
                    className: "h-4 w-4 text-gray-500"
                }, void 0, false, {
                    fileName: "[project]/features/settings/pkgx/components/log-tab.tsx",
                    lineNumber: 166,
                    columnNumber: 16
                }, this);
        }
    };
    const getActionLabel = (action)=>{
        const labels = {
            test_connection: 'Test kết nối',
            ping: 'Ping server',
            sync_all: 'Đồng bộ tất cả',
            sync_price: 'Đồng bộ giá',
            sync_inventory: 'Đồng bộ tồn kho',
            sync_seo: 'Đồng bộ SEO',
            sync_description: 'Đồng bộ mô tả',
            sync_flags: 'Đồng bộ flags',
            sync_basic: 'Đồng bộ cơ bản',
            sync_basic_info: 'Đồng bộ cơ bản',
            sync_images: 'Đồng bộ ảnh',
            create_product: 'Tạo SP',
            update_product: 'Cập nhật SP',
            link_product: 'Liên kết SP',
            unlink_product: 'Hủy liên kết',
            unlink_mapping: 'Hủy mapping',
            batch_unlink: 'Hủy hàng loạt',
            bulk_sync_all: 'Bulk: Tất cả',
            bulk_sync_basic: 'Bulk: Cơ bản',
            bulk_sync_price: 'Bulk: Giá',
            bulk_sync_inventory: 'Bulk: Tồn kho',
            bulk_sync_seo: 'Bulk: SEO',
            bulk_sync_description: 'Bulk: Mô tả',
            bulk_sync_flags: 'Bulk: Flags',
            bulk_sync_images: 'Bulk: Ảnh',
            sync_categories: 'Đồng bộ danh mục',
            sync_brands: 'Đồng bộ thương hiệu',
            get_products: 'Lấy DS sản phẩm',
            upload_image: 'Upload ảnh',
            save_config: 'Lưu cấu hình',
            save_mapping: 'Lưu mapping'
        };
        return labels[action] || action;
    };
    const formatTimestamp = (timestamp)=>{
        const date = new Date(timestamp);
        return date.toLocaleString('vi-VN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
    };
    const getDetailsDisplay = (log)=>{
        if (!log.details) return null;
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "space-y-0.5 text-xs text-muted-foreground",
            children: [
                log.details.method && log.details.url && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "font-mono text-blue-600",
                    children: [
                        log.details.method,
                        " ",
                        log.details.url.length > 25 ? '...' + log.details.url.slice(-25) : log.details.url
                    ]
                }, void 0, true, {
                    fileName: "[project]/features/settings/pkgx/components/log-tab.tsx",
                    lineNumber: 226,
                    columnNumber: 11
                }, this),
                log.details.httpStatus && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: log.details.httpStatus >= 400 ? 'text-red-600' : 'text-green-600',
                    children: [
                        "HTTP: ",
                        log.details.httpStatus
                    ]
                }, void 0, true, {
                    fileName: "[project]/features/settings/pkgx/components/log-tab.tsx",
                    lineNumber: 231,
                    columnNumber: 11
                }, this),
                log.details.responseTime !== undefined && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "text-gray-500",
                    children: [
                        log.details.responseTime,
                        "ms"
                    ]
                }, void 0, true, {
                    fileName: "[project]/features/settings/pkgx/components/log-tab.tsx",
                    lineNumber: 236,
                    columnNumber: 11
                }, this),
                log.details.total !== undefined && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    children: [
                        "Tổng: ",
                        log.details.total
                    ]
                }, void 0, true, {
                    fileName: "[project]/features/settings/pkgx/components/log-tab.tsx",
                    lineNumber: 240,
                    columnNumber: 11
                }, this),
                log.details.success !== undefined && log.details.success > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "text-green-600",
                    children: [
                        "OK: ",
                        log.details.success
                    ]
                }, void 0, true, {
                    fileName: "[project]/features/settings/pkgx/components/log-tab.tsx",
                    lineNumber: 243,
                    columnNumber: 11
                }, this),
                log.details.failed !== undefined && log.details.failed > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "text-red-600",
                    children: [
                        "Lỗi: ",
                        log.details.failed
                    ]
                }, void 0, true, {
                    fileName: "[project]/features/settings/pkgx/components/log-tab.tsx",
                    lineNumber: 246,
                    columnNumber: 11
                }, this),
                log.details.productId && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    children: [
                        "SP: ",
                        log.details.productId
                    ]
                }, void 0, true, {
                    fileName: "[project]/features/settings/pkgx/components/log-tab.tsx",
                    lineNumber: 250,
                    columnNumber: 11
                }, this),
                log.details.pkgxId && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    children: [
                        "PKGX: ",
                        log.details.pkgxId
                    ]
                }, void 0, true, {
                    fileName: "[project]/features/settings/pkgx/components/log-tab.tsx",
                    lineNumber: 253,
                    columnNumber: 11
                }, this),
                log.details.errorCode && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "text-red-600",
                    children: [
                        "Mã: ",
                        log.details.errorCode
                    ]
                }, void 0, true, {
                    fileName: "[project]/features/settings/pkgx/components/log-tab.tsx",
                    lineNumber: 257,
                    columnNumber: 11
                }, this),
                log.details.error && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "text-red-600 truncate max-w-[150px]",
                    title: log.details.error,
                    children: log.details.error
                }, void 0, false, {
                    fileName: "[project]/features/settings/pkgx/components/log-tab.tsx",
                    lineNumber: 260,
                    columnNumber: 11
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/features/settings/pkgx/components/log-tab.tsx",
            lineNumber: 223,
            columnNumber: 7
        }, this);
    };
    // Define columns
    const columns = [
        {
            id: 'timestamp',
            accessorKey: 'timestamp',
            header: 'Thời gian',
            size: 150,
            cell: ({ row })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                    className: "text-xs font-mono",
                    children: formatTimestamp(row.timestamp)
                }, void 0, false, {
                    fileName: "[project]/features/settings/pkgx/components/log-tab.tsx",
                    lineNumber: 276,
                    columnNumber: 9
                }, this)
        },
        {
            id: 'action',
            accessorKey: 'action',
            header: 'Hành động',
            size: 150,
            cell: ({ row })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex items-center gap-2",
                    children: [
                        getActionIcon(row.action),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$badge$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Badge"], {
                            variant: "outline",
                            className: "text-xs whitespace-nowrap",
                            children: getActionLabel(row.action)
                        }, void 0, false, {
                            fileName: "[project]/features/settings/pkgx/components/log-tab.tsx",
                            lineNumber: 289,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/features/settings/pkgx/components/log-tab.tsx",
                    lineNumber: 287,
                    columnNumber: 9
                }, this)
        },
        {
            id: 'status',
            accessorKey: 'status',
            header: 'Trạng thái',
            size: 110,
            cell: ({ row })=>getStatusBadge(row.status)
        },
        {
            id: 'message',
            accessorKey: 'message',
            header: 'Thông báo',
            size: 280,
            cell: ({ row })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                    className: "text-sm truncate block max-w-[260px]",
                    title: row.message,
                    children: row.message
                }, void 0, false, {
                    fileName: "[project]/features/settings/pkgx/components/log-tab.tsx",
                    lineNumber: 308,
                    columnNumber: 9
                }, this)
        },
        {
            id: 'userName',
            accessorKey: 'userName',
            header: 'Người thực hiện',
            size: 130,
            cell: ({ row })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex items-center gap-1.5 text-xs",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$user$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__User$3e$__["User"], {
                            className: "h-3 w-3 text-muted-foreground"
                        }, void 0, false, {
                            fileName: "[project]/features/settings/pkgx/components/log-tab.tsx",
                            lineNumber: 320,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "truncate max-w-[100px]",
                            title: row.userName || 'Hệ thống',
                            children: row.userName || 'Hệ thống'
                        }, void 0, false, {
                            fileName: "[project]/features/settings/pkgx/components/log-tab.tsx",
                            lineNumber: 321,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/features/settings/pkgx/components/log-tab.tsx",
                    lineNumber: 319,
                    columnNumber: 9
                }, this)
        },
        {
            id: 'details',
            accessorKey: 'details',
            header: 'Chi tiết',
            size: 180,
            cell: ({ row })=>getDetailsDisplay(row)
        }
    ];
    // Mobile card renderer
    const renderMobileCard = (log)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "p-4 space-y-3",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex items-start justify-between",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex items-center gap-2",
                            children: [
                                getActionIcon(log.action),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$badge$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Badge"], {
                                    variant: "outline",
                                    className: "text-xs",
                                    children: getActionLabel(log.action)
                                }, void 0, false, {
                                    fileName: "[project]/features/settings/pkgx/components/log-tab.tsx",
                                    lineNumber: 342,
                                    columnNumber: 11
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/features/settings/pkgx/components/log-tab.tsx",
                            lineNumber: 340,
                            columnNumber: 9
                        }, this),
                        getStatusBadge(log.status)
                    ]
                }, void 0, true, {
                    fileName: "[project]/features/settings/pkgx/components/log-tab.tsx",
                    lineNumber: 339,
                    columnNumber: 7
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "space-y-1.5",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-sm",
                            children: log.message
                        }, void 0, false, {
                            fileName: "[project]/features/settings/pkgx/components/log-tab.tsx",
                            lineNumber: 350,
                            columnNumber: 9
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-xs text-muted-foreground font-mono",
                            children: formatTimestamp(log.timestamp)
                        }, void 0, false, {
                            fileName: "[project]/features/settings/pkgx/components/log-tab.tsx",
                            lineNumber: 351,
                            columnNumber: 9
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/features/settings/pkgx/components/log-tab.tsx",
                    lineNumber: 349,
                    columnNumber: 7
                }, this),
                log.details && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "pt-2 border-t",
                    children: getDetailsDisplay(log)
                }, void 0, false, {
                    fileName: "[project]/features/settings/pkgx/components/log-tab.tsx",
                    lineNumber: 357,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex items-center justify-between pt-2 border-t",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center gap-1.5 text-xs text-muted-foreground",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$user$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__User$3e$__["User"], {
                                className: "h-3 w-3"
                            }, void 0, false, {
                                fileName: "[project]/features/settings/pkgx/components/log-tab.tsx",
                                lineNumber: 364,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                children: log.userName || 'Hệ thống'
                            }, void 0, false, {
                                fileName: "[project]/features/settings/pkgx/components/log-tab.tsx",
                                lineNumber: 365,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/features/settings/pkgx/components/log-tab.tsx",
                        lineNumber: 363,
                        columnNumber: 9
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/features/settings/pkgx/components/log-tab.tsx",
                    lineNumber: 362,
                    columnNumber: 7
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/features/settings/pkgx/components/log-tab.tsx",
            lineNumber: 338,
            columnNumber: 5
        }, this);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "space-y-6",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Card"], {
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["CardHeader"], {
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["CardTitle"], {
                            className: "text-lg",
                            children: "Lịch sử đồng bộ"
                        }, void 0, false, {
                            fileName: "[project]/features/settings/pkgx/components/log-tab.tsx",
                            lineNumber: 375,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["CardDescription"], {
                            children: "Theo dõi hoạt động đồng bộ với PKGX"
                        }, void 0, false, {
                            fileName: "[project]/features/settings/pkgx/components/log-tab.tsx",
                            lineNumber: 376,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/features/settings/pkgx/components/log-tab.tsx",
                    lineNumber: 374,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["CardContent"], {
                    className: "space-y-4",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$layout$2f$page$2d$filters$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["PageFilters"], {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "relative flex-1 min-w-[200px]",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$search$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__Search$3e$__["Search"], {
                                            className: "absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                                        }, void 0, false, {
                                            fileName: "[project]/features/settings/pkgx/components/log-tab.tsx",
                                            lineNumber: 384,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$input$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Input"], {
                                            placeholder: "Tìm kiếm logs...",
                                            value: searchTerm,
                                            onChange: (e)=>setSearchTerm(e.target.value),
                                            className: "pl-9"
                                        }, void 0, false, {
                                            fileName: "[project]/features/settings/pkgx/components/log-tab.tsx",
                                            lineNumber: 385,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/features/settings/pkgx/components/log-tab.tsx",
                                    lineNumber: 383,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Select"], {
                                    value: statusFilter,
                                    onValueChange: (v)=>setStatusFilter(v),
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["SelectTrigger"], {
                                            className: "w-[160px]",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["SelectValue"], {
                                                placeholder: "Trạng thái"
                                            }, void 0, false, {
                                                fileName: "[project]/features/settings/pkgx/components/log-tab.tsx",
                                                lineNumber: 394,
                                                columnNumber: 17
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/features/settings/pkgx/components/log-tab.tsx",
                                            lineNumber: 393,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["SelectContent"], {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["SelectItem"], {
                                                    value: "all",
                                                    children: "Tất cả trạng thái"
                                                }, void 0, false, {
                                                    fileName: "[project]/features/settings/pkgx/components/log-tab.tsx",
                                                    lineNumber: 397,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["SelectItem"], {
                                                    value: "success",
                                                    children: "Thành công"
                                                }, void 0, false, {
                                                    fileName: "[project]/features/settings/pkgx/components/log-tab.tsx",
                                                    lineNumber: 398,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["SelectItem"], {
                                                    value: "error",
                                                    children: "Lỗi"
                                                }, void 0, false, {
                                                    fileName: "[project]/features/settings/pkgx/components/log-tab.tsx",
                                                    lineNumber: 399,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["SelectItem"], {
                                                    value: "partial",
                                                    children: "Một phần"
                                                }, void 0, false, {
                                                    fileName: "[project]/features/settings/pkgx/components/log-tab.tsx",
                                                    lineNumber: 400,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["SelectItem"], {
                                                    value: "info",
                                                    children: "Thông tin"
                                                }, void 0, false, {
                                                    fileName: "[project]/features/settings/pkgx/components/log-tab.tsx",
                                                    lineNumber: 401,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/features/settings/pkgx/components/log-tab.tsx",
                                            lineNumber: 396,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/features/settings/pkgx/components/log-tab.tsx",
                                    lineNumber: 392,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Select"], {
                                    value: actionFilter,
                                    onValueChange: setActionFilter,
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["SelectTrigger"], {
                                            className: "w-[170px]",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["SelectValue"], {
                                                placeholder: "Hành động"
                                            }, void 0, false, {
                                                fileName: "[project]/features/settings/pkgx/components/log-tab.tsx",
                                                lineNumber: 406,
                                                columnNumber: 17
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/features/settings/pkgx/components/log-tab.tsx",
                                            lineNumber: 405,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["SelectContent"], {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["SelectItem"], {
                                                    value: "all",
                                                    children: "Tất cả hành động"
                                                }, void 0, false, {
                                                    fileName: "[project]/features/settings/pkgx/components/log-tab.tsx",
                                                    lineNumber: 409,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["SelectItem"], {
                                                    value: "test_connection",
                                                    children: "Test kết nối"
                                                }, void 0, false, {
                                                    fileName: "[project]/features/settings/pkgx/components/log-tab.tsx",
                                                    lineNumber: 410,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["SelectItem"], {
                                                    value: "ping",
                                                    children: "Ping server"
                                                }, void 0, false, {
                                                    fileName: "[project]/features/settings/pkgx/components/log-tab.tsx",
                                                    lineNumber: 411,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["SelectItem"], {
                                                    value: "save_config",
                                                    children: "Lưu cấu hình"
                                                }, void 0, false, {
                                                    fileName: "[project]/features/settings/pkgx/components/log-tab.tsx",
                                                    lineNumber: 412,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["SelectItem"], {
                                                    value: "save_mapping",
                                                    children: "Lưu mapping"
                                                }, void 0, false, {
                                                    fileName: "[project]/features/settings/pkgx/components/log-tab.tsx",
                                                    lineNumber: 413,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["SelectItem"], {
                                                    value: "create_product",
                                                    children: "Tạo sản phẩm"
                                                }, void 0, false, {
                                                    fileName: "[project]/features/settings/pkgx/components/log-tab.tsx",
                                                    lineNumber: 414,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["SelectItem"], {
                                                    value: "update_product",
                                                    children: "Cập nhật SP"
                                                }, void 0, false, {
                                                    fileName: "[project]/features/settings/pkgx/components/log-tab.tsx",
                                                    lineNumber: 415,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["SelectItem"], {
                                                    value: "link_product",
                                                    children: "Liên kết SP"
                                                }, void 0, false, {
                                                    fileName: "[project]/features/settings/pkgx/components/log-tab.tsx",
                                                    lineNumber: 416,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["SelectItem"], {
                                                    value: "unlink_product",
                                                    children: "Hủy liên kết"
                                                }, void 0, false, {
                                                    fileName: "[project]/features/settings/pkgx/components/log-tab.tsx",
                                                    lineNumber: 417,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["SelectItem"], {
                                                    value: "sync_all",
                                                    children: "Đồng bộ tất cả"
                                                }, void 0, false, {
                                                    fileName: "[project]/features/settings/pkgx/components/log-tab.tsx",
                                                    lineNumber: 418,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["SelectItem"], {
                                                    value: "sync_price",
                                                    children: "Đồng bộ giá"
                                                }, void 0, false, {
                                                    fileName: "[project]/features/settings/pkgx/components/log-tab.tsx",
                                                    lineNumber: 419,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["SelectItem"], {
                                                    value: "sync_inventory",
                                                    children: "Đồng bộ tồn kho"
                                                }, void 0, false, {
                                                    fileName: "[project]/features/settings/pkgx/components/log-tab.tsx",
                                                    lineNumber: 420,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["SelectItem"], {
                                                    value: "sync_seo",
                                                    children: "Đồng bộ SEO"
                                                }, void 0, false, {
                                                    fileName: "[project]/features/settings/pkgx/components/log-tab.tsx",
                                                    lineNumber: 421,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["SelectItem"], {
                                                    value: "sync_images",
                                                    children: "Đồng bộ ảnh"
                                                }, void 0, false, {
                                                    fileName: "[project]/features/settings/pkgx/components/log-tab.tsx",
                                                    lineNumber: 422,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["SelectItem"], {
                                                    value: "sync_categories",
                                                    children: "Đồng bộ danh mục"
                                                }, void 0, false, {
                                                    fileName: "[project]/features/settings/pkgx/components/log-tab.tsx",
                                                    lineNumber: 423,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["SelectItem"], {
                                                    value: "sync_brands",
                                                    children: "Đồng bộ thương hiệu"
                                                }, void 0, false, {
                                                    fileName: "[project]/features/settings/pkgx/components/log-tab.tsx",
                                                    lineNumber: 424,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["SelectItem"], {
                                                    value: "get_products",
                                                    children: "Lấy danh sách SP"
                                                }, void 0, false, {
                                                    fileName: "[project]/features/settings/pkgx/components/log-tab.tsx",
                                                    lineNumber: 425,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["SelectItem"], {
                                                    value: "upload_image",
                                                    children: "Upload ảnh"
                                                }, void 0, false, {
                                                    fileName: "[project]/features/settings/pkgx/components/log-tab.tsx",
                                                    lineNumber: 426,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/features/settings/pkgx/components/log-tab.tsx",
                                            lineNumber: 408,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/features/settings/pkgx/components/log-tab.tsx",
                                    lineNumber: 404,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/features/settings/pkgx/components/log-tab.tsx",
                            lineNumber: 382,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex items-center gap-4 text-sm text-muted-foreground",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    children: [
                                        filteredLogs.length,
                                        " logs"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/features/settings/pkgx/components/log-tab.tsx",
                                    lineNumber: 433,
                                    columnNumber: 13
                                }, this),
                                filteredLogs.length !== allLogs.length && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "text-xs",
                                    children: [
                                        "(tổng: ",
                                        allLogs.length,
                                        ")"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/features/settings/pkgx/components/log-tab.tsx",
                                    lineNumber: 435,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/features/settings/pkgx/components/log-tab.tsx",
                            lineNumber: 432,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$data$2d$table$2f$responsive$2d$data$2d$table$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ResponsiveDataTable"], {
                            columns: columns,
                            data: paginatedData,
                            pageCount: pageCount,
                            pagination: pagination,
                            setPagination: setPagination,
                            rowCount: sortedData.length,
                            sorting: sorting,
                            setSorting: setSorting,
                            columnVisibility: columnVisibility,
                            setColumnVisibility: setColumnVisibility,
                            columnOrder: columnOrder,
                            setColumnOrder: setColumnOrder,
                            pinnedColumns: pinnedColumns,
                            setPinnedColumns: setPinnedColumns,
                            renderMobileCard: renderMobileCard,
                            emptyTitle: "Chưa có hoạt động",
                            emptyDescription: searchTerm || statusFilter !== 'all' || actionFilter !== 'all' ? 'Không tìm thấy log nào phù hợp với bộ lọc' : 'Chưa có hoạt động đồng bộ nào',
                            emptyAction: allLogs.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex flex-col items-center gap-2 text-muted-foreground",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$refresh$2d$cw$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__RefreshCw$3e$__["RefreshCw"], {
                                        className: "h-12 w-12 text-muted-foreground/50"
                                    }, void 0, false, {
                                        fileName: "[project]/features/settings/pkgx/components/log-tab.tsx",
                                        lineNumber: 465,
                                        columnNumber: 19
                                    }, void 0),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-sm",
                                        children: "Bắt đầu đồng bộ để xem lịch sử hoạt động"
                                    }, void 0, false, {
                                        fileName: "[project]/features/settings/pkgx/components/log-tab.tsx",
                                        lineNumber: 466,
                                        columnNumber: 19
                                    }, void 0)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/features/settings/pkgx/components/log-tab.tsx",
                                lineNumber: 464,
                                columnNumber: 17
                            }, void 0) : undefined
                        }, void 0, false, {
                            fileName: "[project]/features/settings/pkgx/components/log-tab.tsx",
                            lineNumber: 440,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/features/settings/pkgx/components/log-tab.tsx",
                    lineNumber: 380,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/features/settings/pkgx/components/log-tab.tsx",
            lineNumber: 373,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/features/settings/pkgx/components/log-tab.tsx",
        lineNumber: 372,
        columnNumber: 5
    }, this);
}
}),
"[project]/features/settings/pkgx/components/index.ts [app-rsc] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$pkgx$2f$components$2f$general$2d$config$2d$tab$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/settings/pkgx/components/general-config-tab.tsx [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$pkgx$2f$components$2f$category$2d$mapping$2d$tab$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/settings/pkgx/components/category-mapping-tab.tsx [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$pkgx$2f$components$2f$brand$2d$mapping$2d$tab$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/settings/pkgx/components/brand-mapping-tab.tsx [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$pkgx$2f$components$2f$price$2d$mapping$2d$tab$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/settings/pkgx/components/price-mapping-tab.tsx [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$pkgx$2f$components$2f$product$2d$mapping$2d$tab$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/settings/pkgx/components/product-mapping-tab.tsx [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$pkgx$2f$components$2f$sync$2d$settings$2d$tab$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/settings/pkgx/components/sync-settings-tab.tsx [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$pkgx$2f$components$2f$log$2d$tab$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/settings/pkgx/components/log-tab.tsx [app-rsc] (ecmascript)");
;
;
;
;
;
;
;
}),
"[project]/features/settings/pkgx/pkgx-settings-page.tsx [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "PkgxSettingsPage",
    ()=>PkgxSettingsPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-jsx-dev-runtime.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$tabs$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/tabs.tsx [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$globe$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__Globe$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/globe.js [app-rsc] (ecmascript) <export default as Globe>");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$settings$2f$SettingsVerticalTabs$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/settings/SettingsVerticalTabs.tsx [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$use$2d$settings$2d$page$2d$header$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/settings/use-settings-page-header.tsx [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$pkgx$2f$components$2f$index$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/features/settings/pkgx/components/index.ts [app-rsc] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$pkgx$2f$components$2f$general$2d$config$2d$tab$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/settings/pkgx/components/general-config-tab.tsx [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$pkgx$2f$components$2f$category$2d$mapping$2d$tab$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/settings/pkgx/components/category-mapping-tab.tsx [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$pkgx$2f$components$2f$brand$2d$mapping$2d$tab$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/settings/pkgx/components/brand-mapping-tab.tsx [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$pkgx$2f$components$2f$price$2d$mapping$2d$tab$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/settings/pkgx/components/price-mapping-tab.tsx [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$pkgx$2f$components$2f$product$2d$mapping$2d$tab$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/settings/pkgx/components/product-mapping-tab.tsx [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$pkgx$2f$components$2f$sync$2d$settings$2d$tab$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/settings/pkgx/components/sync-settings-tab.tsx [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$pkgx$2f$components$2f$log$2d$tab$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/settings/pkgx/components/log-tab.tsx [app-rsc] (ecmascript)");
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
    const [activeTab, setActiveTab] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["useState"]('general');
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$use$2d$settings$2d$page$2d$header$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["useSettingsPageHeader"])({
        title: 'Website phukiengiaxuong.com.vn',
        icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$globe$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__Globe$3e$__["Globe"], {
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
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$settings$2f$SettingsVerticalTabs$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["SettingsVerticalTabs"], {
        value: activeTab,
        onValueChange: setActiveTab,
        tabs: PKGX_TABS,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$tabs$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["TabsContent"], {
                value: "general",
                className: "mt-0",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$pkgx$2f$components$2f$general$2d$config$2d$tab$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["GeneralConfigTab"], {}, void 0, false, {
                    fileName: "[project]/features/settings/pkgx/pkgx-settings-page.tsx",
                    lineNumber: 44,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/features/settings/pkgx/pkgx-settings-page.tsx",
                lineNumber: 43,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$tabs$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["TabsContent"], {
                value: "category-mapping",
                className: "mt-0",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$pkgx$2f$components$2f$category$2d$mapping$2d$tab$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["CategoryMappingTab"], {}, void 0, false, {
                    fileName: "[project]/features/settings/pkgx/pkgx-settings-page.tsx",
                    lineNumber: 48,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/features/settings/pkgx/pkgx-settings-page.tsx",
                lineNumber: 47,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$tabs$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["TabsContent"], {
                value: "brand-mapping",
                className: "mt-0",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$pkgx$2f$components$2f$brand$2d$mapping$2d$tab$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["BrandMappingTab"], {}, void 0, false, {
                    fileName: "[project]/features/settings/pkgx/pkgx-settings-page.tsx",
                    lineNumber: 52,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/features/settings/pkgx/pkgx-settings-page.tsx",
                lineNumber: 51,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$tabs$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["TabsContent"], {
                value: "price-mapping",
                className: "mt-0",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$pkgx$2f$components$2f$price$2d$mapping$2d$tab$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["PriceMappingTab"], {}, void 0, false, {
                    fileName: "[project]/features/settings/pkgx/pkgx-settings-page.tsx",
                    lineNumber: 56,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/features/settings/pkgx/pkgx-settings-page.tsx",
                lineNumber: 55,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$tabs$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["TabsContent"], {
                value: "product-mapping",
                className: "mt-0",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$pkgx$2f$components$2f$product$2d$mapping$2d$tab$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ProductMappingTab"], {}, void 0, false, {
                    fileName: "[project]/features/settings/pkgx/pkgx-settings-page.tsx",
                    lineNumber: 60,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/features/settings/pkgx/pkgx-settings-page.tsx",
                lineNumber: 59,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$tabs$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["TabsContent"], {
                value: "sync",
                className: "mt-0",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$pkgx$2f$components$2f$sync$2d$settings$2d$tab$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["SyncSettingsTab"], {}, void 0, false, {
                    fileName: "[project]/features/settings/pkgx/pkgx-settings-page.tsx",
                    lineNumber: 64,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/features/settings/pkgx/pkgx-settings-page.tsx",
                lineNumber: 63,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$tabs$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["TabsContent"], {
                value: "logs",
                className: "mt-0",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$pkgx$2f$components$2f$log$2d$tab$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["LogTab"], {}, void 0, false, {
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
"[project]/features/settings/pkgx/pkgx-settings-page.tsx [app-rsc] (ecmascript, next/dynamic entry)", ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/features/settings/pkgx/pkgx-settings-page.tsx [app-rsc] (ecmascript)"));
}),
];

//# sourceMappingURL=features_settings_c94c1e2f._.js.map