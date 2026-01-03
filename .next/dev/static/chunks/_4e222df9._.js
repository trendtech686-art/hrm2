(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/features/settings/inventory/product-type-store.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useProductTypeStore",
    ()=>useProductTypeStore
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/zustand/esm/react.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$middleware$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/zustand/esm/middleware.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/id-types.ts [app-client] (ecmascript)");
;
;
;
const generateId = ()=>crypto.randomUUID();
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
const useProductTypeStore = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["create"])()((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$middleware$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["persist"])((set, get)=>({
        data: initialData,
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
        getActive: ()=>{
            return get().data.filter((item)=>!item.isDeleted && item.isActive !== false);
        }
    }), {
    name: 'product-type-storage'
}));
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/import-export/configs/product.config.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__,
    "productFields",
    ()=>productFields,
    "productImportExportConfig",
    ()=>productImportExportConfig
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$pricing$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/settings/pricing/store.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$inventory$2f$product$2d$type$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/settings/inventory/product-type-store.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/id-types.ts [app-client] (ecmascript)");
;
;
;
/**
 * Product Import/Export Configuration
 * Theo chuẩn ImportExportConfig để dùng với GenericImportDialogV2 và GenericExportDialogV2
 */ // Helper: Get all pricing policies
const getAllPricingPolicies = ()=>{
    return __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$pricing$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePricingPolicyStore"].getState().data;
};
// ===== PRODUCT TYPE HELPERS =====
// Helper: Get all active product types from settings
const getAllProductTypes = ()=>{
    return __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$inventory$2f$product$2d$type$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useProductTypeStore"].getState().getActive();
};
// Helper: Get ProductType systemId from name (tên loại sản phẩm)
const getProductTypeSystemIdByName = (name)=>{
    if (!name) return null;
    const productTypes = getAllProductTypes();
    const normalizedName = name.toLowerCase().trim();
    // Tìm theo tên chính xác (case-insensitive)
    const productType = productTypes.find((pt)=>pt.name.toLowerCase() === normalizedName || pt.id.toLowerCase() === normalizedName);
    return productType?.systemId || null;
};
// Helper: Get ProductType name from systemId
const getProductTypeNameById = (systemId)=>{
    if (!systemId) return '';
    const productTypes = getAllProductTypes();
    const productType = productTypes.find((pt)=>pt.systemId === systemId);
    return productType?.name || '';
};
// Helper: Get default ProductType systemId
const getDefaultProductTypeSystemId = ()=>{
    const productTypes = getAllProductTypes();
    const defaultType = productTypes.find((pt)=>pt.isDefault);
    return defaultType?.systemId || productTypes[0]?.systemId || null;
};
// Helper: Map enum type ('physical', 'service', 'digital') to ProductType systemId
// Fallback khi user import bằng type cũ
const getProductTypeSystemIdByEnumType = (enumType)=>{
    if (!enumType) return getDefaultProductTypeSystemId();
    const productTypes = getAllProductTypes();
    const normalizedType = String(enumType).toLowerCase().trim();
    // Map từ enum type sang tên tiếng Việt để tìm ProductType
    const typeNameMapping = {
        'physical': [
            'hàng hóa',
            'hang hoa',
            'physical',
            'hàng hoá'
        ],
        'service': [
            'dịch vụ',
            'dich vu',
            'service'
        ],
        'digital': [
            'digital',
            'sản phẩm số',
            'san pham so',
            'kỹ thuật số',
            'ky thuat so'
        ],
        'combo': [
            'combo',
            'bộ sản phẩm',
            'bo san pham'
        ]
    };
    for (const [_enumKey, names] of Object.entries(typeNameMapping)){
        if (names.includes(normalizedType)) {
            // Tìm ProductType có tên match với một trong các aliases
            const productType = productTypes.find((pt)=>names.some((name)=>pt.name.toLowerCase().includes(name) || name.includes(pt.name.toLowerCase())));
            if (productType) return productType.systemId;
        }
    }
    // Fallback: tìm trực tiếp theo tên
    const productType = productTypes.find((pt)=>pt.name.toLowerCase().includes(normalizedType) || normalizedType.includes(pt.name.toLowerCase()));
    return productType?.systemId || getDefaultProductTypeSystemId();
};
// ===== PRICING POLICY HELPERS =====
// Helper: Get pricing policy systemId from code (id) OR name
// Hỗ trợ nhiều format cột giá trong Excel:
// - "Giá: Giá bán lẻ" hoặc "Giá: BANLE" (có prefix "Giá:")
// - "Giá bán lẻ" hoặc "BANLE" (không có prefix)
const getPricingPolicySystemId = (columnName)=>{
    const policies = getAllPricingPolicies();
    // Normalize: bỏ prefix "Giá:" hoặc "Gia:" nếu có
    let normalizedName = columnName.trim();
    const pricePrefix = /^(giá|gia)\s*:\s*/i;
    if (pricePrefix.test(normalizedName)) {
        normalizedName = normalizedName.replace(pricePrefix, '').trim();
    }
    const upperName = normalizedName.toUpperCase();
    // Tìm theo id (mã bảng giá) trước
    const policyById = policies.find((p)=>p.id.toUpperCase() === upperName);
    if (policyById) return policyById.systemId;
    // Tìm theo name (tên bảng giá)
    const policyByName = policies.find((p)=>p.name.toUpperCase() === upperName);
    if (policyByName) return policyByName.systemId;
    // Tìm theo name chứa (partial match)
    const policyByPartialName = policies.find((p)=>p.name.toUpperCase().includes(upperName) || upperName.includes(p.name.toUpperCase()));
    if (policyByPartialName) return policyByPartialName.systemId;
    return null;
};
// Helper: Get pricing policy code (id) from systemId  
const _getPricingPolicyCode = (systemId)=>{
    const policies = getAllPricingPolicies();
    const policy = policies.find((p)=>p.systemId === systemId);
    return policy?.id || systemId;
};
// Helper: Get pricing policy name from systemId  
const _getPricingPolicyName = (systemId)=>{
    const policies = getAllPricingPolicies();
    const policy = policies.find((p)=>p.systemId === systemId);
    return policy?.name || systemId;
};
// Helper: Check if a column name matches a pricing policy (by id or name)
const _isPricingPolicyColumn = (columnName)=>{
    return getPricingPolicySystemId(columnName) !== null;
};
const productFields = [
    // ===== THÔNG TIN CƠ BẢN =====
    {
        key: 'id',
        label: 'Mã sản phẩm',
        required: false,
        type: 'string',
        exportGroup: 'Thông tin cơ bản',
        example: 'SP000001'
    },
    {
        key: 'name',
        label: 'Tên sản phẩm (*)',
        required: true,
        type: 'string',
        exportGroup: 'Thông tin cơ bản',
        example: 'Áo sơ mi nam'
    },
    {
        key: 'sku',
        label: 'SKU',
        required: false,
        type: 'string',
        exportGroup: 'Thông tin cơ bản',
        example: 'ASM-001'
    },
    {
        key: 'barcode',
        label: 'Mã vạch',
        required: false,
        type: 'string',
        exportGroup: 'Thông tin cơ bản',
        example: '8934567890123'
    },
    {
        key: 'type',
        label: 'Loại SP (Hệ thống)',
        required: false,
        type: 'enum',
        enumValues: [
            'physical',
            'service',
            'digital'
        ],
        enumLabels: {
            'physical': 'Hàng hóa',
            'service': 'Dịch vụ',
            'digital': 'Sản phẩm số'
        },
        exportGroup: 'Thông tin cơ bản',
        example: 'Hàng hóa',
        defaultValue: 'physical',
        hidden: true,
        importTransform: (value)=>{
            if (!value) return 'physical';
            const str = String(value).toLowerCase().trim();
            // Map tiếng Việt sang English
            if (str === 'hàng hóa' || str === 'hang hoa' || str === 'physical' || str === 'hàng hoá') return 'physical';
            if (str === 'dịch vụ' || str === 'dich vu' || str === 'service') return 'service';
            if (str === 'sản phẩm số' || str === 'san pham so' || str === 'kỹ thuật số' || str === 'digital' || str === 'ky thuat so') return 'digital';
            if (str === 'combo' || str === 'bộ sản phẩm' || str === 'bo san pham') return 'combo';
            return 'physical';
        },
        validator: (value)=>{
            if (value === 'combo') {
                return 'Không hỗ trợ import sản phẩm Combo. Vui lòng tạo Combo trực tiếp trong hệ thống.';
            }
            return null;
        }
    },
    // NEW: Loại sản phẩm từ Settings (ProductType) - Khuyến khích dùng thay cho field "type" cũ
    {
        key: 'productTypeSystemId',
        label: 'Loại sản phẩm',
        required: false,
        type: 'string',
        exportGroup: 'Thông tin cơ bản',
        example: 'Hàng hóa',
        importTransform: (value)=>{
            if (!value) return undefined;
            const str = String(value).trim();
            if (!str) return undefined;
            // Trước tiên thử tìm theo tên/id trong ProductType settings
            const systemId = getProductTypeSystemIdByName(str);
            if (systemId) return systemId;
            // Fallback: map từ enum type cũ
            const enumSystemId = getProductTypeSystemIdByEnumType(str);
            return enumSystemId || undefined;
        },
        exportTransform: (value)=>{
            // Export ra tên loại SP thay vì systemId
            return getProductTypeNameById(value);
        },
        validator: (value)=>{
            if (!value) return null; // Optional field
            const str = String(value).trim();
            if (!str) return null;
            // Validate: tên loại SP phải tồn tại trong settings
            const systemId = getProductTypeSystemIdByName(str);
            if (!systemId) {
                // Fallback check enum type
                const enumSystemId = getProductTypeSystemIdByEnumType(str);
                if (!enumSystemId) {
                    return `Loại sản phẩm "${str}" không tồn tại trong hệ thống. Vui lòng kiểm tra danh sách loại SP trong Cài đặt > Kho hàng.`;
                }
            }
            return null;
        }
    },
    {
        key: 'status',
        label: 'Trạng thái',
        required: false,
        type: 'enum',
        enumValues: [
            'active',
            'inactive',
            'discontinued'
        ],
        enumLabels: {
            'active': 'Đang kinh doanh',
            'inactive': 'Ngừng kinh doanh',
            'discontinued': 'Ngừng nhập'
        },
        exportGroup: 'Thông tin cơ bản',
        example: 'Đang kinh doanh',
        defaultValue: 'active',
        importTransform: (value)=>{
            if (!value) return 'active';
            const str = String(value).toLowerCase().trim();
            // Map tiếng Việt sang English
            if (str === 'đang kinh doanh' || str === 'dang kinh doanh' || str === 'active') return 'active';
            if (str === 'ngừng kinh doanh' || str === 'ngung kinh doanh' || str === 'inactive') return 'inactive';
            if (str === 'ngừng nhập' || str === 'ngung nhap' || str === 'discontinued') return 'discontinued';
            return 'active';
        }
    },
    {
        key: 'unit',
        label: 'Đơn vị tính',
        required: false,
        type: 'string',
        exportGroup: 'Thông tin cơ bản',
        example: 'Cái',
        defaultValue: 'Cái'
    },
    {
        key: 'categories',
        label: 'Danh mục',
        required: false,
        type: 'string',
        exportGroup: 'Thông tin cơ bản',
        example: 'Thời trang > Áo nam; Sale > Hot deal',
        importTransform: (value)=>{
            if (!value) return undefined;
            const str = String(value).trim();
            if (!str) return undefined;
            // Split by semicolon to get multiple categories, each category can have multi-level with >
            return str.split(';').map((s)=>s.trim()).filter(Boolean);
        },
        exportTransform: (value)=>{
            const categories = value;
            return categories?.join('; ') || '';
        }
    },
    // Legacy single category field (backward compatibility)
    {
        key: 'category',
        label: 'Danh mục (cũ)',
        required: false,
        type: 'string',
        exportGroup: 'Thông tin cơ bản',
        hidden: true,
        example: 'Thời trang > Áo nam > Áo sơ mi'
    },
    {
        key: 'description',
        label: 'Mô tả',
        required: false,
        type: 'string',
        exportGroup: 'Thông tin cơ bản',
        example: 'Áo sơ mi nam cao cấp'
    },
    {
        key: 'shortDescription',
        label: 'Mô tả ngắn',
        required: false,
        type: 'string',
        exportGroup: 'Thông tin cơ bản',
        example: 'Áo sơ mi nam'
    },
    // ===== HÌNH ẢNH =====
    // NOTE: Hình ảnh được upload lên server trước, sau đó import đường dẫn
    // Format: /products/{ma_sp}/{ten_file}.jpg hoặc URL đầy đủ
    {
        key: 'thumbnailImage',
        label: 'Ảnh đại diện',
        required: false,
        type: 'string',
        exportGroup: 'Hình ảnh',
        example: '/products/SP001/main.jpg',
        validator: (value)=>{
            if (!value) return null; // Optional
            const str = String(value).trim();
            // Cho phép: /path/to/file.ext hoặc http(s)://...
            if (!str.startsWith('/') && !str.startsWith('http')) {
                return 'Đường dẫn ảnh phải bắt đầu bằng / hoặc http(s)://';
            }
            // Check extension
            const validExts = [
                '.jpg',
                '.jpeg',
                '.png',
                '.gif',
                '.webp',
                '.svg'
            ];
            const hasValidExt = validExts.some((ext)=>str.toLowerCase().endsWith(ext));
            if (!hasValidExt && !str.includes('?')) {
                return 'Định dạng ảnh không hợp lệ (jpg, png, gif, webp, svg)';
            }
            return null;
        }
    },
    {
        key: 'galleryImages',
        label: 'Ảnh bộ sưu tập',
        required: false,
        type: 'string',
        exportGroup: 'Hình ảnh',
        example: '/products/SP001/1.jpg, /products/SP001/2.jpg',
        importTransform: (value)=>{
            if (!value) return undefined;
            const str = String(value).trim();
            if (!str) return undefined;
            return str.split(/[,;|]/).map((s)=>s.trim()).filter(Boolean);
        },
        exportTransform: (value)=>{
            const images = value;
            return images?.join(', ') || '';
        },
        validator: (value)=>{
            if (!value) return null;
            const str = String(value).trim();
            if (!str) return null;
            const paths = str.split(/[,;|]/).map((s)=>s.trim()).filter(Boolean);
            const validExts = [
                '.jpg',
                '.jpeg',
                '.png',
                '.gif',
                '.webp',
                '.svg'
            ];
            for (const path of paths){
                if (!path.startsWith('/') && !path.startsWith('http')) {
                    return `Đường dẫn "${path}" phải bắt đầu bằng / hoặc http(s)://`;
                }
                const hasValidExt = validExts.some((ext)=>path.toLowerCase().endsWith(ext));
                if (!hasValidExt && !path.includes('?')) {
                    return `Đường dẫn "${path}" có định dạng ảnh không hợp lệ`;
                }
            }
            return null;
        }
    },
    // ===== VIDEO LINKS =====
    {
        key: 'videoLinks',
        label: 'Video link',
        required: false,
        type: 'string',
        exportGroup: 'Media',
        example: 'https://youtube.com/watch?v=xxx; https://drive.google.com/file/xxx',
        importTransform: (value)=>{
            if (!value) return undefined;
            const str = String(value).trim();
            if (!str) return undefined;
            return str.split(/[,;|]/).map((s)=>s.trim()).filter(Boolean);
        },
        exportTransform: (value)=>{
            const links = value;
            return links?.join('; ') || '';
        },
        validator: (value)=>{
            if (!value) return null;
            const str = String(value).trim();
            if (!str) return null;
            const links = str.split(/[,;|]/).map((s)=>s.trim()).filter(Boolean);
            for (const link of links){
                if (!link.startsWith('http')) {
                    return `Link "${link}" phải bắt đầu bằng http:// hoặc https://`;
                }
                // Kiểm tra domain hợp lệ (YouTube, TikTok, Drive, Vimeo, etc.)
                const validDomains = [
                    'youtube.com',
                    'youtu.be',
                    'tiktok.com',
                    'drive.google.com',
                    'vimeo.com',
                    'facebook.com',
                    'fb.watch'
                ];
                const isValidDomain = validDomains.some((domain)=>link.includes(domain));
                if (!isValidDomain) {
                    // Cho phép các domain khác nhưng cảnh báo
                    console.warn(`Link "${link}" không thuộc các nền tảng video phổ biến`);
                }
            }
            return null;
        }
    },
    // ===== GIÁ =====
    {
        key: 'costPrice',
        label: 'Giá vốn',
        required: false,
        type: 'number',
        exportGroup: 'Giá',
        example: '150000',
        importTransform: (value)=>{
            if (!value) return 0;
            const num = Number(String(value).replace(/[,.\s]/g, ''));
            return isNaN(num) ? 0 : num;
        }
    },
    {
        key: 'sellingPrice',
        label: 'Giá bán',
        required: false,
        type: 'number',
        exportGroup: 'Giá',
        example: '250000',
        importTransform: (value)=>{
            if (!value) return 0;
            const num = Number(String(value).replace(/[,.\s]/g, ''));
            return isNaN(num) ? 0 : num;
        }
    },
    {
        key: 'minPrice',
        label: 'Giá tối thiểu',
        required: false,
        type: 'number',
        exportGroup: 'Giá',
        example: '200000',
        importTransform: (value)=>{
            if (!value) return undefined;
            const num = Number(String(value).replace(/[,.\s]/g, ''));
            return isNaN(num) ? undefined : num;
        }
    },
    {
        key: 'taxRate',
        label: 'Thuế suất (%)',
        required: false,
        type: 'number',
        exportGroup: 'Giá',
        example: '10',
        importTransform: (value)=>{
            if (!value) return undefined;
            const num = Number(String(value).replace(/[%\s]/g, ''));
            return isNaN(num) ? undefined : num;
        }
    },
    // NOTE: Giá theo bảng giá (prices) được xử lý động trong preTransformRawRow
    // User tạo cột với tên = mã bảng giá (VD: PL_10, BANLE, VIP...)
    // Hệ thống tự detect và gom vào field prices
    // ===== TỒN KHO =====
    // NOTE: initialStock chỉ áp dụng khi TẠO MỚI sản phẩm (mode insert-only)
    // Tồn kho sau đó được quản lý qua phiếu nhập/xuất/kiểm kê
    {
        key: 'initialStock',
        label: 'Tồn kho ban đầu',
        required: false,
        type: 'number',
        exportGroup: 'Tồn kho',
        example: '100',
        importTransform: (value)=>{
            if (!value) return undefined;
            const num = Number(String(value).replace(/[,.\s]/g, ''));
            return isNaN(num) || num < 0 ? undefined : num;
        }
    },
    {
        key: 'isStockTracked',
        label: 'Theo dõi tồn kho',
        required: false,
        type: 'boolean',
        exportGroup: 'Tồn kho',
        example: 'Có',
        defaultValue: true,
        importTransform: (value)=>{
            if (!value) return true;
            const str = String(value).toLowerCase();
            return str === 'có' || str === 'yes' || str === 'true' || str === '1';
        }
    },
    {
        key: 'reorderLevel',
        label: 'Mức đặt hàng lại',
        required: false,
        type: 'number',
        exportGroup: 'Tồn kho',
        example: '10',
        importTransform: (value)=>{
            if (!value) return undefined;
            const num = Number(String(value).replace(/[,.\s]/g, ''));
            return isNaN(num) ? undefined : num;
        }
    },
    {
        key: 'safetyStock',
        label: 'Tồn kho an toàn',
        required: false,
        type: 'number',
        exportGroup: 'Tồn kho',
        example: '5',
        importTransform: (value)=>{
            if (!value) return undefined;
            const num = Number(String(value).replace(/[,.\s]/g, ''));
            return isNaN(num) ? undefined : num;
        }
    },
    {
        key: 'maxStock',
        label: 'Tồn kho tối đa',
        required: false,
        type: 'number',
        exportGroup: 'Tồn kho',
        example: '100',
        importTransform: (value)=>{
            if (!value) return undefined;
            const num = Number(String(value).replace(/[,.\s]/g, ''));
            return isNaN(num) ? undefined : num;
        }
    },
    // ===== VẬT LÝ =====
    {
        key: 'weight',
        label: 'Trọng lượng',
        required: false,
        type: 'number',
        exportGroup: 'Vật lý',
        example: '200',
        importTransform: (value)=>{
            if (!value) return undefined;
            const num = Number(String(value).replace(/[,.\s]/g, ''));
            return isNaN(num) ? undefined : num;
        }
    },
    {
        key: 'weightUnit',
        label: 'Đơn vị trọng lượng',
        required: false,
        type: 'enum',
        enumValues: [
            'g',
            'kg'
        ],
        exportGroup: 'Vật lý',
        example: 'g',
        defaultValue: 'g'
    },
    // ===== BẢO HÀNH =====
    {
        key: 'warrantyPeriodMonths',
        label: 'Bảo hành (tháng)',
        required: false,
        type: 'number',
        exportGroup: 'Bảo hành',
        example: '12',
        importTransform: (value)=>{
            if (!value) return undefined;
            const num = Number(String(value).replace(/[,.\s]/g, ''));
            return isNaN(num) ? undefined : num;
        }
    },
    // ===== KÍCH THƯỚC =====
    {
        key: 'dimensions',
        label: 'Kích thước (DxRxC cm)',
        required: false,
        type: 'string',
        exportGroup: 'Vật lý',
        example: '30x20x10',
        importTransform: (value)=>{
            if (!value) return undefined;
            const str = String(value).trim();
            const match = str.match(/^(\d+(?:\.\d+)?)\s*[xX×]\s*(\d+(?:\.\d+)?)\s*[xX×]\s*(\d+(?:\.\d+)?)$/);
            if (match) {
                return {
                    length: parseFloat(match[1]),
                    width: parseFloat(match[2]),
                    height: parseFloat(match[3])
                };
            }
            return undefined;
        },
        exportTransform: (value)=>{
            const dims = value;
            if (dims && typeof dims === 'object' && 'length' in dims) {
                return `${dims.length || 0}x${dims.width || 0}x${dims.height || 0}`;
            }
            return '';
        }
    },
    // ===== THÔNG TIN MỞ RỘNG =====
    {
        key: 'ktitle',
        label: 'Tiêu đề SEO',
        required: false,
        type: 'string',
        exportGroup: 'Mô tả',
        example: 'Áo sơ mi nam cao cấp | Thời trang ABC'
    },
    {
        key: 'seoDescription',
        label: 'Mô tả SEO',
        required: false,
        type: 'string',
        exportGroup: 'Mô tả',
        example: 'Áo sơ mi nam chất liệu cotton cao cấp...'
    },
    {
        key: 'subCategories',
        label: 'Danh mục phụ',
        required: false,
        type: 'string',
        exportGroup: 'Phân loại',
        example: 'Slim fit > Form ôm; Cotton > Cao cấp',
        importTransform: (value)=>{
            if (!value) return undefined;
            const str = String(value).trim();
            if (!str) return undefined;
            // Split by semicolon to get multiple sub-categories
            return str.split(';').map((s)=>s.trim()).filter(Boolean);
        },
        exportTransform: (value)=>{
            const subCategories = value;
            return subCategories?.join('; ') || '';
        }
    },
    // Legacy single subCategory field (backward compatibility)
    {
        key: 'subCategory',
        label: 'Danh mục phụ (cũ)',
        required: false,
        type: 'string',
        exportGroup: 'Phân loại',
        hidden: true,
        example: 'Áo sơ mi > Dài tay > Slim fit'
    },
    {
        key: 'tags',
        label: 'Tags',
        required: false,
        type: 'string',
        exportGroup: 'Phân loại',
        example: 'nam,công sở,cotton',
        importTransform: (value)=>{
            if (!value) return undefined;
            const str = String(value).trim();
            return str.split(/[,;]/).map((s)=>s.trim()).filter(Boolean);
        },
        exportTransform: (value)=>{
            const tags = value;
            return tags?.join(', ') || '';
        }
    },
    {
        key: 'pkgxId',
        label: 'ID PKGX',
        required: false,
        type: 'number',
        exportGroup: 'Thông tin cơ bản',
        example: '12345',
        importTransform: (value)=>{
            if (!value) return undefined;
            const num = Number(String(value).replace(/[,.\s]/g, ''));
            return isNaN(num) || num <= 0 ? undefined : num;
        }
    },
    {
        key: 'trendtechId',
        label: 'ID Trendtech',
        required: false,
        type: 'number',
        exportGroup: 'Thông tin cơ bản',
        example: '67890',
        importTransform: (value)=>{
            if (!value) return undefined;
            const num = Number(String(value).replace(/[,.\s]/g, ''));
            return isNaN(num) || num <= 0 ? undefined : num;
        }
    },
    {
        key: 'warehouseLocation',
        label: 'Vị trí kho',
        required: false,
        type: 'string',
        exportGroup: 'Tồn kho',
        example: 'A1-01'
    },
    // ===== GIÁ BỔ SUNG =====
    {
        key: 'lastPurchasePrice',
        label: 'Giá nhập gần nhất',
        required: false,
        type: 'number',
        exportGroup: 'Giá',
        example: '140000',
        importTransform: (value)=>{
            if (!value) return undefined;
            const num = Number(String(value).replace(/[,.\s]/g, ''));
            return isNaN(num) ? undefined : num;
        }
    },
    // ===== THÔNG TIN TEM =====
    {
        key: 'nameVat',
        label: 'Tên VAT',
        required: false,
        type: 'string',
        exportGroup: 'Tem phụ',
        example: 'Áo sơ mi nam cotton'
    },
    {
        key: 'origin',
        label: 'Xuất xứ',
        required: false,
        type: 'string',
        exportGroup: 'Tem phụ',
        example: 'Việt Nam'
    },
    {
        key: 'usageGuide',
        label: 'Hướng dẫn sử dụng',
        required: false,
        type: 'string',
        exportGroup: 'Tem phụ',
        example: 'Giặt máy ở nhiệt độ thấp'
    },
    {
        key: 'importerName',
        label: 'Đơn vị nhập khẩu',
        required: false,
        type: 'string',
        exportGroup: 'Tem phụ',
        example: 'Công ty TNHH ABC'
    },
    {
        key: 'importerAddress',
        label: 'Địa chỉ nhập khẩu',
        required: false,
        type: 'string',
        exportGroup: 'Tem phụ',
        example: '123 Nguyễn Văn A, Q.1, TP.HCM'
    },
    // ===== E-COMMERCE (bán hàng website) =====
    // Slug chung (legacy - không khuyến khích dùng nữa)
    {
        key: 'slug',
        label: 'Slug (URL)',
        required: false,
        type: 'string',
        exportGroup: 'E-commerce',
        hidden: true,
        example: 'ao-so-mi-nam-trang-oxford',
        importTransform: (value)=>{
            if (!value) return undefined;
            // Convert to URL-friendly slug
            return String(value).trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '') // Remove diacritics
            .replace(/đ/g, 'd').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
        }
    },
    // Slug riêng cho PKGX website
    {
        key: 'pkgxSlug',
        label: 'Slug PKGX',
        required: false,
        type: 'string',
        exportGroup: 'E-commerce PKGX',
        example: 'ao-so-mi-nam-trang-oxford',
        importTransform: (value)=>{
            if (!value) return undefined;
            // Convert to URL-friendly slug
            return String(value).trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '') // Remove diacritics
            .replace(/đ/g, 'd').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
        }
    },
    // Slug riêng cho Trendtech website
    {
        key: 'trendtechSlug',
        label: 'Slug Trendtech',
        required: false,
        type: 'string',
        exportGroup: 'E-commerce Trendtech',
        example: 'ao-so-mi-nam-trang-oxford',
        importTransform: (value)=>{
            if (!value) return undefined;
            // Convert to URL-friendly slug
            return String(value).trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '') // Remove diacritics
            .replace(/đ/g, 'd').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
        }
    },
    {
        key: 'isPublished',
        label: 'Đăng web',
        required: false,
        type: 'boolean',
        exportGroup: 'E-commerce',
        example: 'Có',
        defaultValue: false,
        importTransform: (value)=>{
            if (value === undefined || value === null || value === '') return false;
            const str = String(value).toLowerCase().trim();
            return str === 'có' || str === 'yes' || str === '1' || str === 'true' || str === 'x';
        },
        exportTransform: (value)=>value ? 'Có' : 'Không'
    },
    {
        key: 'isFeatured',
        label: 'Nổi bật',
        required: false,
        type: 'boolean',
        exportGroup: 'E-commerce',
        example: 'Có',
        defaultValue: false,
        importTransform: (value)=>{
            if (value === undefined || value === null || value === '') return false;
            const str = String(value).toLowerCase().trim();
            return str === 'có' || str === 'yes' || str === '1' || str === 'true' || str === 'x';
        },
        exportTransform: (value)=>value ? 'Có' : 'Không'
    },
    {
        key: 'isNewArrival',
        label: 'Mới về',
        required: false,
        type: 'boolean',
        exportGroup: 'E-commerce',
        example: 'Có',
        defaultValue: false,
        importTransform: (value)=>{
            if (value === undefined || value === null || value === '') return false;
            const str = String(value).toLowerCase().trim();
            return str === 'có' || str === 'yes' || str === '1' || str === 'true' || str === 'x';
        },
        exportTransform: (value)=>value ? 'Có' : 'Không'
    },
    {
        key: 'isBestSeller',
        label: 'Bán chạy',
        required: false,
        type: 'boolean',
        exportGroup: 'E-commerce',
        example: 'Có',
        defaultValue: false,
        importTransform: (value)=>{
            if (value === undefined || value === null || value === '') return false;
            const str = String(value).toLowerCase().trim();
            return str === 'có' || str === 'yes' || str === '1' || str === 'true' || str === 'x';
        },
        exportTransform: (value)=>value ? 'Có' : 'Không'
    },
    {
        key: 'isOnSale',
        label: 'Đang giảm giá',
        required: false,
        type: 'boolean',
        exportGroup: 'E-commerce',
        example: 'Có',
        defaultValue: false,
        importTransform: (value)=>{
            if (value === undefined || value === null || value === '') return false;
            const str = String(value).toLowerCase().trim();
            return str === 'có' || str === 'yes' || str === '1' || str === 'true' || str === 'x';
        },
        exportTransform: (value)=>value ? 'Có' : 'Không'
    },
    {
        key: 'sortOrder',
        label: 'Thứ tự hiển thị',
        required: false,
        type: 'number',
        exportGroup: 'E-commerce',
        example: '1',
        importTransform: (value)=>{
            if (!value) return undefined;
            const num = Number(String(value).replace(/[,.\s]/g, ''));
            return isNaN(num) ? undefined : num;
        }
    },
    {
        key: 'publishedAt',
        label: 'Ngày đăng web',
        required: false,
        type: 'date',
        exportGroup: 'E-commerce',
        example: '2024-01-15'
    },
    // ===== PHÂN TÍCH BÁN HÀNG =====
    {
        key: 'totalSold',
        label: 'Tổng đã bán',
        required: false,
        type: 'number',
        exportGroup: 'Phân tích',
        hidden: true,
        importTransform: (value)=>{
            if (!value) return undefined;
            const num = Number(String(value).replace(/[,.\s]/g, ''));
            return isNaN(num) ? undefined : num;
        }
    },
    {
        key: 'totalRevenue',
        label: 'Tổng doanh thu',
        required: false,
        type: 'number',
        exportGroup: 'Phân tích',
        hidden: true,
        importTransform: (value)=>{
            if (!value) return undefined;
            const num = Number(String(value).replace(/[,.\s]/g, ''));
            return isNaN(num) ? undefined : num;
        }
    },
    {
        key: 'lastSoldDate',
        label: 'Ngày bán gần nhất',
        required: false,
        type: 'date',
        exportGroup: 'Phân tích',
        hidden: true
    },
    {
        key: 'viewCount',
        label: 'Lượt xem',
        required: false,
        type: 'number',
        exportGroup: 'Phân tích',
        hidden: true,
        importTransform: (value)=>{
            if (!value) return undefined;
            const num = Number(String(value).replace(/[,.\s]/g, ''));
            return isNaN(num) ? undefined : num;
        }
    },
    // ===== VÒNG ĐỜI SẢN PHẨM =====
    {
        key: 'launchedDate',
        label: 'Ngày ra mắt',
        required: false,
        type: 'date',
        exportGroup: 'Vòng đời',
        example: '2024-01-15'
    },
    {
        key: 'lastPurchaseDate',
        label: 'Ngày nhập gần nhất',
        required: false,
        type: 'date',
        exportGroup: 'Vòng đời',
        hidden: true
    },
    {
        key: 'discontinuedDate',
        label: 'Ngày ngừng kinh doanh',
        required: false,
        type: 'date',
        exportGroup: 'Vòng đời',
        example: '2025-12-31'
    },
    // ===== HỆ THỐNG (hidden) =====
    {
        key: 'systemId',
        label: 'System ID',
        required: false,
        type: 'string',
        exportGroup: 'Hệ thống',
        hidden: true
    },
    {
        key: 'createdAt',
        label: 'Ngày tạo',
        required: false,
        type: 'date',
        exportGroup: 'Hệ thống',
        hidden: true
    },
    {
        key: 'updatedAt',
        label: 'Ngày cập nhật',
        required: false,
        type: 'date',
        exportGroup: 'Hệ thống',
        hidden: true
    }
];
const productImportExportConfig = {
    entityType: 'products',
    entityDisplayName: 'Sản phẩm',
    fields: productFields,
    upsertKey: 'id',
    templateFileName: 'mau-import-san-pham.xlsx',
    requireBranch: true,
    // Pre-transform raw row (normalize column names + detect pricing columns)
    preTransformRawRow: (rawRow)=>{
        const normalized = {};
        const prices = {};
        // Map từ label tiếng Việt sang key
        const labelToKey = {};
        productFields.forEach((field)=>{
            labelToKey[field.label.toLowerCase()] = field.key;
            // Also map without (*) marker
            const labelWithoutStar = field.label.replace(/\s*\(\*\)\s*$/, '').toLowerCase();
            labelToKey[labelWithoutStar] = field.key;
        });
        Object.entries(rawRow).forEach(([key, value])=>{
            // Normalize Excel header: strip (*) marker and lowercase
            const normalizedExcelHeader = key.replace(/\s*\(\*\)\s*$/, '').toLowerCase();
            // Check if this column is a pricing policy code (e.g., PL_10, BANLE, VIP)
            const policySystemId = getPricingPolicySystemId(key);
            if (policySystemId && value !== undefined && value !== null && value !== '') {
                // This is a pricing column - parse price value
                const priceValue = Number(String(value).replace(/[,.\s]/g, ''));
                if (!isNaN(priceValue) && priceValue > 0) {
                    prices[policySystemId] = priceValue;
                }
            } else {
                // Normal field - map to key
                const normalizedKey = labelToKey[normalizedExcelHeader] || labelToKey[key.toLowerCase()] || key;
                normalized[normalizedKey] = value;
            }
        });
        // Add prices if any pricing columns were found
        if (Object.keys(prices).length > 0) {
            normalized.prices = prices;
        }
        return normalized;
    },
    // Post-transform row (set defaults, enrich data)
    // NOTE: branchSystemId được truyền từ import dialog để xử lý tồn kho ban đầu
    postTransformRow: (row, _index, branchSystemId)=>{
        // Xử lý tồn kho ban đầu - chỉ áp dụng khi có initialStock và branchSystemId
        let inventoryByBranch = row.inventoryByBranch || {};
        const initialStock = row.initialStock;
        if (initialStock !== undefined && initialStock > 0 && branchSystemId) {
            inventoryByBranch = {
                ...inventoryByBranch,
                [branchSystemId]: initialStock
            };
        }
        // Remove initialStock from final data (không lưu vào Product)
        const { initialStock: _removed, ...cleanRow } = row;
        // Auto-set productTypeSystemId nếu chưa có
        // Ưu tiên: productTypeSystemId > type enum mapping > default
        let productTypeSystemIdStr = cleanRow.productTypeSystemId;
        if (!productTypeSystemIdStr && cleanRow.type) {
            // Map từ type enum sang productTypeSystemId
            productTypeSystemIdStr = getProductTypeSystemIdByEnumType(cleanRow.type) || undefined;
        }
        if (!productTypeSystemIdStr) {
            // Fallback: lấy default ProductType
            productTypeSystemIdStr = getDefaultProductTypeSystemId() || undefined;
        }
        // Cast to SystemId if we have a value
        const productTypeSystemId = productTypeSystemIdStr ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$id$2d$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["asSystemId"])(productTypeSystemIdStr) : undefined;
        return {
            ...cleanRow,
            type: cleanRow.type || 'physical',
            productTypeSystemId,
            status: cleanRow.status || 'active',
            unit: cleanRow.unit || 'Cái',
            costPrice: cleanRow.costPrice ?? 0,
            sellingPrice: cleanRow.sellingPrice ?? 0,
            isStockTracked: cleanRow.isStockTracked ?? true,
            prices: cleanRow.prices || {},
            inventoryByBranch,
            committedByBranch: cleanRow.committedByBranch || {},
            inTransitByBranch: cleanRow.inTransitByBranch || {}
        };
    },
    // Validate row level (check duplicate SKU/barcode + warnings)
    validateRow: (row, _index, existingData, mode)=>{
        const errors = [];
        const rowWithInitialStock = row;
        // Check unique SKU - only in insert-only mode
        if (row.sku && mode === 'insert-only') {
            const duplicate = existingData.find((p)=>p.sku === row.sku && p.id !== row.id);
            if (duplicate) {
                errors.push({
                    field: 'sku',
                    message: `SKU đã được sử dụng bởi ${duplicate.name} (${duplicate.id})`
                });
            }
        }
        // Check unique barcode - only in insert-only mode
        if (row.barcode && mode === 'insert-only') {
            const duplicate = existingData.find((p)=>p.barcode === row.barcode && p.id !== row.id);
            if (duplicate) {
                errors.push({
                    field: 'barcode',
                    message: `Mã vạch đã được sử dụng bởi ${duplicate.name} (${duplicate.id})`
                });
            }
        }
        // Cảnh báo: initialStock chỉ có tác dụng khi tạo mới
        if (rowWithInitialStock.initialStock !== undefined && rowWithInitialStock.initialStock > 0) {
            if (mode === 'update-only') {
                errors.push({
                    field: 'initialStock',
                    message: 'Tồn kho ban đầu sẽ bị BỎ QUA vì đang ở chế độ Cập nhật',
                    type: 'warning'
                });
            } else if (mode === 'upsert') {
                // Check if product exists
                const exists = existingData.find((p)=>p.id === row.id);
                if (exists) {
                    errors.push({
                        field: 'initialStock',
                        message: `SP đã tồn tại - tồn kho ban đầu sẽ BỎ QUA (giữ nguyên tồn kho hiện tại)`,
                        type: 'warning'
                    });
                }
            }
        }
        // Cảnh báo giá bán < giá vốn
        if (row.costPrice && row.sellingPrice && row.costPrice > row.sellingPrice) {
            errors.push({
                field: 'sellingPrice',
                message: `Giá bán (${row.sellingPrice?.toLocaleString()}) thấp hơn giá vốn (${row.costPrice?.toLocaleString()})`,
                type: 'warning'
            });
        }
        return errors;
    }
};
const __TURBOPACK__default__export__ = productImportExportConfig;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/features/products/components/product-import-export-dialogs.tsx [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {

const e = new Error("Could not parse module '[project]/features/products/components/product-import-export-dialogs.tsx'\n\nUnterminated regexp literal");
e.code = 'MODULE_UNPARSABLE';
throw e;
}),
"[project]/features/products/components/product-import-export-dialogs.tsx [app-client] (ecmascript, next/dynamic entry)", ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/features/products/components/product-import-export-dialogs.tsx [app-client] (ecmascript)"));
}),
]);

//# sourceMappingURL=_4e222df9._.js.map